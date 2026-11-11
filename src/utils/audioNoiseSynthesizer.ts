// Web Audio API Background Noise & Distraction Synthesizer for High-Pressure Stress Test Mock Interviews

export type NoiseType = 'office' | 'cafe' | 'announcement' | 'static';

class StressNoiseEngine {
  private audioCtx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private noiseNode: AudioNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private isPlaying: boolean = false;
  private timerId: any = null;
  private currentVolume: number = 0.25;

  private initContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setVolume(vol: number) {
    this.currentVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setTargetAtTime(this.currentVolume, this.audioCtx.currentTime, 0.05);
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }

  public startNoise(type: NoiseType = 'office', volume: number = 0.25) {
    this.stopNoise();
    this.initContext();

    if (!this.audioCtx) return;

    this.currentVolume = volume;
    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.setValueAtTime(this.currentVolume, this.audioCtx.currentTime);
    this.masterGain.connect(this.audioCtx.destination);

    this.isPlaying = true;

    if (type === 'office') {
      this.createOfficeAmbience();
    } else if (type === 'cafe') {
      this.createCafeAmbience();
    } else if (type === 'announcement') {
      this.createAnnouncementAmbience();
    } else if (type === 'static') {
      this.createStaticAmbience();
    }
  }

  private createPinkNoiseBuffer(): AudioBuffer {
    const bufferSize = this.audioCtx!.sampleRate * 2;
    const buffer = this.audioCtx!.createBuffer(1, bufferSize, this.audioCtx!.sampleRate);
    const output = buffer.getChannelData(0);

    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11;
      b6 = white * 0.115926;
    }
    return buffer;
  }

  private createOfficeAmbience() {
    if (!this.audioCtx || !this.masterGain) return;

    // Pink noise source for background room rumble / typing
    const noiseBuffer = this.createPinkNoiseBuffer();
    const noiseSource = this.audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    this.filterNode = this.audioCtx.createBiquadFilter();
    this.filterNode.type = 'bandpass';
    this.filterNode.frequency.setValueAtTime(450, this.audioCtx.currentTime);
    this.filterNode.Q.setValueAtTime(1.2, this.audioCtx.currentTime);

    noiseSource.connect(this.filterNode);
    this.filterNode.connect(this.masterGain);
    noiseSource.start();
    this.noiseNode = noiseSource;

    // Periodic typing / keyboard click simulation
    this.timerId = setInterval(() => {
      if (!this.isPlaying || !this.audioCtx || !this.masterGain) return;
      this.playKeyboardClick();
    }, 400 + Math.random() * 800);
  }

  private createCafeAmbience() {
    if (!this.audioCtx || !this.masterGain) return;

    const noiseBuffer = this.createPinkNoiseBuffer();
    const noiseSource = this.audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    this.filterNode = this.audioCtx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(320, this.audioCtx.currentTime);

    noiseSource.connect(this.filterNode);
    this.filterNode.connect(this.masterGain);
    noiseSource.start();
    this.noiseNode = noiseSource;

    // Cafe cup clink simulation
    this.timerId = setInterval(() => {
      if (!this.isPlaying || !this.audioCtx || !this.masterGain) return;
      if (Math.random() > 0.4) {
        this.playCupClink();
      }
    }, 1800 + Math.random() * 2500);
  }

  private createAnnouncementAmbience() {
    if (!this.audioCtx || !this.masterGain) return;

    // Low background static
    const noiseBuffer = this.createPinkNoiseBuffer();
    const noiseSource = this.audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    this.filterNode = this.audioCtx.createBiquadFilter();
    this.filterNode.type = 'bandpass';
    this.filterNode.frequency.setValueAtTime(800, this.audioCtx.currentTime);

    const subGain = this.audioCtx.createGain();
    subGain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);

    noiseSource.connect(this.filterNode);
    this.filterNode.connect(subGain);
    subGain.connect(this.masterGain);
    noiseSource.start();
    this.noiseNode = noiseSource;

    // Airport / Station PA Chime every 8-12 seconds
    this.playPaChime();
    this.timerId = setInterval(() => {
      if (!this.isPlaying || !this.audioCtx) return;
      this.playPaChime();
    }, 7000 + Math.random() * 5000);
  }

  private createStaticAmbience() {
    if (!this.audioCtx || !this.masterGain) return;

    const noiseBuffer = this.createPinkNoiseBuffer();
    const noiseSource = this.audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    this.filterNode = this.audioCtx.createBiquadFilter();
    this.filterNode.type = 'highpass';
    this.filterNode.frequency.setValueAtTime(1200, this.audioCtx.currentTime);

    noiseSource.connect(this.filterNode);
    this.filterNode.connect(this.masterGain);
    noiseSource.start();
    this.noiseNode = noiseSource;

    // Random mic crackle bursts
    this.timerId = setInterval(() => {
      if (!this.isPlaying || !this.audioCtx || !this.masterGain) return;
      if (Math.random() > 0.5) {
        this.playMicCrackle();
      }
    }, 900 + Math.random() * 1500);
  }

  private playKeyboardClick() {
    if (!this.audioCtx || !this.masterGain) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const clickGain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1800 + Math.random() * 800, this.audioCtx.currentTime);

      clickGain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      clickGain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.04);

      osc.connect(clickGain);
      clickGain.connect(this.masterGain);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.05);
    } catch (e) {
      // ignore audio context closed state
    }
  }

  private playCupClink() {
    if (!this.audioCtx || !this.masterGain) return;
    try {
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2800 + Math.random() * 400, this.audioCtx.currentTime);

      gain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.35);
    } catch (e) {}
  }

  private playMicCrackle() {
    if (!this.audioCtx || !this.masterGain) return;
    try {
      const buffer = this.audioCtx.createBuffer(1, this.audioCtx.sampleRate * 0.1, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
      }
      const src = this.audioCtx.createBufferSource();
      src.buffer = buffer;
      const crackleGain = this.audioCtx.createGain();
      crackleGain.gain.setValueAtTime(0.15, this.audioCtx.currentTime);
      crackleGain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.09);

      src.connect(crackleGain);
      crackleGain.connect(this.masterGain);
      src.start();
    } catch (e) {}
  }

  public playPaChime() {
    if (!this.audioCtx || !this.masterGain) return;
    try {
      const t = this.audioCtx.currentTime;
      const osc1 = this.audioCtx.createOscillator();
      const osc2 = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc1.frequency.setValueAtTime(554.37, t); // C#5
      osc2.frequency.setValueAtTime(659.25, t + 0.25); // E5

      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.masterGain);

      osc1.start(t);
      osc1.stop(t + 0.25);
      osc2.start(t + 0.25);
      osc2.stop(t + 0.7);
    } catch (e) {}
  }

  public stopNoise() {
    this.isPlaying = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
    if (this.noiseNode) {
      try {
        (this.noiseNode as any).stop?.();
      } catch (e) {}
      this.noiseNode = null;
    }
    if (this.masterGain) {
      this.masterGain.disconnect();
      this.masterGain = null;
    }
  }
}

export const stressNoiseEngine = new StressNoiseEngine();
