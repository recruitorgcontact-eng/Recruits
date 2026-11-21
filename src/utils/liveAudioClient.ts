import { LanguageCode } from "../types";

export interface LiveAudioCallbacks {
  onStatusChange?: (status: "connecting" | "listening" | "speaking" | "thinking" | "idle" | "error") => void;
  onInputTranscript?: (text: string) => void;
  onOutputTranscript?: (text: string) => void;
  onInterrupted?: () => void;
  onTurnComplete?: () => void;
  onModelInfo?: (info: { model: string; voice: string }) => void;
  onError?: (reason: string) => void;
}

export interface LiveSessionOptions {
  language: LanguageCode;
  memory?: any;
  interviewContext?: {
    role?: string;
    level?: string;
    topic?: string;
    isStressMode?: boolean;
  };
  callbacks?: LiveAudioCallbacks;
}

/**
 * Downsamples Float32 PCM buffer from arbitrary hardware sampleRate (e.g. 48000 / 44100 Hz)
 * to 16,000 Hz Int16 PCM mono required by Gemini Live API.
 */
function downsampleFloat32ToInt16Pcm(input: Float32Array, inputSampleRate: number, targetSampleRate = 16000): Int16Array {
  if (inputSampleRate === targetSampleRate) {
    const out = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const clamped = Math.max(-1, Math.min(1, input[i]));
      out[i] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
    }
    return out;
  }

  const ratio = inputSampleRate / targetSampleRate;
  const newLength = Math.max(1, Math.round(input.length / ratio));
  const result = new Int16Array(newLength);
  let offsetResult = 0;
  let offsetBuffer = 0;

  while (offsetResult < newLength) {
    const nextOffsetBuffer = Math.min(input.length, Math.round((offsetResult + 1) * ratio));
    let accum = 0;
    let count = 0;
    for (let i = offsetBuffer; i < nextOffsetBuffer; i++) {
      accum += input[i];
      count++;
    }
    const sample = count > 0 ? accum / count : 0;
    const clamped = Math.max(-1, Math.min(1, sample));
    result[offsetResult] = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }

  return result;
}

function int16ArrayToBase64(pcm: Int16Array): string {
  const bytes = new Uint8Array(pcm.buffer, pcm.byteOffset, pcm.byteLength);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return window.btoa(binary);
}

function base64ToPcm24kFloat32(base64: string): Float32Array {
  const binary = window.atob(base64);
  const byteLen = binary.length;
  const sampleCount = Math.floor(byteLen / 2);
  const floatData = new Float32Array(sampleCount);
  for (let i = 0; i < sampleCount; i++) {
    const lo = binary.charCodeAt(i * 2);
    const hi = binary.charCodeAt(i * 2 + 1);
    let sample = (hi << 8) | lo;
    if (sample >= 0x8000) sample -= 0x10000;
    floatData[i] = sample / 32768;
  }
  return floatData;
}

/**
 * Full-duplex WebSocket + Web Audio engine for Arohi Live Voice (`Aoede`).
 * - Mic Capture: echoCancellation, noiseSuppression, autoGainControl -> 16kHz PCM16 mono
 * - Playback: 24kHz PCM16 LE gapless AudioContext queue
 * - Barge-In: Instant flush of queued AudioBufferSourceNodes on server `interrupted` or sustained local speech
 */
export class ArohiLiveAudioClient {
  private ws: WebSocket | null = null;
  private inputCtx: AudioContext | null = null;
  private outputCtx: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private processorNode: ScriptProcessorNode | null = null;
  private muteGainNode: GainNode | null = null;

  private activeSources = new Set<AudioBufferSourceNode>();
  private nextStartTime = 0;
  private isMuted = false;
  private isSpeakerMuted = false;
  private isConnected = false;
  private isStopped = false;
  private isArohiSpeaking = false;
  private sustainedVoiceFrames = 0;
  private callbacks: LiveAudioCallbacks = {};

  async start(options: LiveSessionOptions): Promise<boolean> {
    this.stop();
    this.isStopped = false;
    this.callbacks = options.callbacks || {};
    this.callbacks.onStatusChange?.("connecting");

    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      this.callbacks.onError?.("Microphone access is not supported in this browser.");
      return false;
    }

    try {
      // 1. Acquire echo-cancelled mono microphone stream
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.inputCtx = new AudioCtx();
      this.outputCtx = new AudioCtx({ sampleRate: 24000 });
      this.nextStartTime = this.outputCtx.currentTime;

      if (this.inputCtx.state === "suspended") {
        await this.inputCtx.resume().catch(() => {});
      }
      if (this.outputCtx.state === "suspended") {
        await this.outputCtx.resume().catch(() => {});
      }

      // 2. Open WebSocket bridge to server Gemini Live endpoint
      const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
      const wsUrl = `${protocol}//${window.location.host}/ws/arohi-live`;
      const ws = new WebSocket(wsUrl);
      this.ws = ws;

      const handshakeOk = await new Promise<boolean>((resolve) => {
        const timeout = setTimeout(() => {
          resolve(false);
        }, 12000);

        ws.onopen = () => {
          ws.send(
            JSON.stringify({
              type: "start",
              language: options.language,
              memory: options.memory,
              interviewContext: options.interviewContext,
            })
          );
        };

        ws.onmessage = (event) => {
          try {
            const msg = JSON.parse(event.data);
            if (msg.type === "ready") {
              clearTimeout(timeout);
              this.isConnected = true;
              this.callbacks.onModelInfo?.({
                model: msg.model || "gemini-3.8-live",
                voice: msg.voice || "Aoede",
              });
              this.callbacks.onStatusChange?.("listening");
              resolve(true);
              return;
            }
            if (msg.type === "error") {
              clearTimeout(timeout);
              this.callbacks.onError?.(msg.error || "Live session unavailable");
              resolve(false);
              return;
            }
            this.handleServerMessage(msg);
          } catch (_err) {
            // Ignore malformed JSON frames
          }
        };

        ws.onerror = () => {
          clearTimeout(timeout);
          resolve(false);
        };

        ws.onclose = () => {
          clearTimeout(timeout);
          if (!this.isConnected) {
            resolve(false);
          } else if (!this.isStopped) {
            this.callbacks.onStatusChange?.("idle");
            this.callbacks.onError?.("Live connection closed");
          }
        };
      });

      if (!handshakeOk || this.isStopped) {
        this.stop();
        return false;
      }

      // Re-bind continuous runtime handler
      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          this.handleServerMessage(msg);
        } catch (_err) {
          // Ignore malformed JSON frames
        }
      };

      // 3. Start streaming 16kHz PCM16 mono frames from mic
      this.sourceNode = this.inputCtx.createMediaStreamSource(this.mediaStream);
      this.processorNode = this.inputCtx.createScriptProcessor(4096, 1, 1);
      this.muteGainNode = this.inputCtx.createGain();
      this.muteGainNode.gain.value = 0;

      this.sourceNode.connect(this.processorNode);
      this.processorNode.connect(this.muteGainNode);
      this.muteGainNode.connect(this.inputCtx.destination);

      const inputSampleRate = this.inputCtx.sampleRate || 48000;

      this.processorNode.onaudioprocess = (ev) => {
        if (this.isStopped || this.isMuted || !this.ws || this.ws.readyState !== WebSocket.OPEN) {
          return;
        }
        const floatSamples = ev.inputBuffer.getChannelData(0);

        // Compute RMS energy for responsive local barge-in while Arohi is speaking
        let sumSq = 0;
        for (let i = 0; i < floatSamples.length; i++) {
          sumSq += floatSamples[i] * floatSamples[i];
        }
        const rms = Math.sqrt(sumSq / Math.max(1, floatSamples.length));
        if (this.isArohiSpeaking && rms > 0.042) {
          this.sustainedVoiceFrames++;
          if (this.sustainedVoiceFrames >= 3) {
            this.sustainedVoiceFrames = 0;
            this.interruptPlayback();
            this.callbacks.onInterrupted?.();
            this.callbacks.onStatusChange?.("listening");
          }
        } else {
          this.sustainedVoiceFrames = 0;
        }

        const pcm16 = downsampleFloat32ToInt16Pcm(floatSamples, inputSampleRate, 16000);
        const base64Audio = int16ArrayToBase64(pcm16);
        this.ws.send(JSON.stringify({ type: "audio", data: base64Audio }));
      };

      return true;
    } catch (err: any) {
      this.callbacks.onError?.(err?.message || "Failed to initialize live audio call");
      this.stop();
      return false;
    }
  }

  private handleServerMessage(msg: any) {
    if (this.isStopped) return;

    if (msg.type === "audio" && msg.data) {
      this.enqueuePcm24kAudio(msg.data);
    } else if (msg.type === "interrupted") {
      this.interruptPlayback();
      this.callbacks.onInterrupted?.();
      this.callbacks.onStatusChange?.("listening");
    } else if (msg.type === "inputTranscript" && msg.text) {
      this.callbacks.onInputTranscript?.(msg.text);
    } else if (msg.type === "outputTranscript" && msg.text) {
      this.callbacks.onOutputTranscript?.(msg.text);
    } else if (msg.type === "turnComplete") {
      this.callbacks.onTurnComplete?.();
      if (this.activeSources.size === 0) {
        this.isArohiSpeaking = false;
        this.callbacks.onStatusChange?.("listening");
      }
    } else if (msg.type === "error") {
      this.callbacks.onError?.(msg.error || "Live session error");
    }
  }

  private enqueuePcm24kAudio(base64Pcm: string) {
    if (!this.outputCtx || this.isSpeakerMuted) return;

    if (this.outputCtx.state === "suspended") {
      this.outputCtx.resume().catch(() => {});
    }

    const floatSamples = base64ToPcm24kFloat32(base64Pcm);
    if (floatSamples.length === 0) return;

    const buffer = this.outputCtx.createBuffer(1, floatSamples.length, 24000);
    buffer.getChannelData(0).set(floatSamples);

    const source = this.outputCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(this.outputCtx.destination);

    const now = this.outputCtx.currentTime;
    if (this.nextStartTime < now + 0.015) {
      this.nextStartTime = now + 0.015;
    }

    this.activeSources.add(source);
    this.isArohiSpeaking = true;
    this.callbacks.onStatusChange?.("speaking");

    source.onended = () => {
      this.activeSources.delete(source);
      if (this.activeSources.size === 0 && !this.isStopped) {
        this.isArohiSpeaking = false;
        this.callbacks.onStatusChange?.("listening");
      }
    };

    source.start(this.nextStartTime);
    this.nextStartTime += buffer.duration;
  }

  /**
   * Immediately flushes all scheduled Web Audio sources for zero-latency barge-in.
   */
  interruptPlayback() {
    for (const src of this.activeSources) {
      try {
        src.onended = null;
        src.stop();
        src.disconnect();
      } catch (_e) {
        // Ignore already stopped sources
      }
    }
    this.activeSources.clear();
    if (this.outputCtx) {
      this.nextStartTime = this.outputCtx.currentTime;
    } else {
      this.nextStartTime = 0;
    }
    this.isArohiSpeaking = false;
  }

  sendTextTurn(text: string) {
    if (!text.trim() || !this.ws || this.ws.readyState !== WebSocket.OPEN) return;
    this.interruptPlayback();
    this.ws.send(JSON.stringify({ type: "text", text: text.trim() }));
    this.callbacks.onStatusChange?.("thinking");
  }

  setMicMuted(muted: boolean) {
    this.isMuted = muted;
  }

  setSpeakerMuted(muted: boolean) {
    this.isSpeakerMuted = muted;
    if (muted) {
      this.interruptPlayback();
    }
  }

  isActive(): boolean {
    return this.isConnected && !this.isStopped;
  }

  stop() {
    this.isStopped = true;
    this.isConnected = false;
    this.interruptPlayback();

    if (this.processorNode) {
      try {
        this.processorNode.onaudioprocess = null;
        this.processorNode.disconnect();
      } catch (_e) {}
      this.processorNode = null;
    }
    if (this.sourceNode) {
      try {
        this.sourceNode.disconnect();
      } catch (_e) {}
      this.sourceNode = null;
    }
    if (this.muteGainNode) {
      try {
        this.muteGainNode.disconnect();
      } catch (_e) {}
      this.muteGainNode = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((t) => t.stop());
      this.mediaStream = null;
    }
    if (this.ws) {
      try {
        if (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING) {
          this.ws.close();
        }
      } catch (_e) {}
      this.ws = null;
    }
    if (this.inputCtx) {
      this.inputCtx.close().catch(() => {});
      this.inputCtx = null;
    }
    if (this.outputCtx) {
      this.outputCtx.close().catch(() => {});
      this.outputCtx = null;
    }
    this.callbacks.onStatusChange?.("idle");
  }
}
