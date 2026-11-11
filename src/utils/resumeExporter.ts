import jsPDF from "jspdf";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle } from "docx";
import { ATSAnalysisResult } from "../types";

export interface ResumeExportData {
  candidateName?: string;
  targetRole: string;
  resumeText: string;
  analysisResult?: ATSAnalysisResult | null;
}

/**
 * Cleanly formats resume text lines into structured sections
 */
function parseResumeSections(text: string) {
  const lines = text.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);
  const sections: { title: string; items: string[] }[] = [];
  let currentSection = { title: "PROFILE SUMMARY", items: [] as string[] };

  for (const line of lines) {
    const isHeading =
      line.toUpperCase() === line && line.length < 40 && !line.startsWith("•") && !line.startsWith("-");

    if (isHeading) {
      if (currentSection.items.length > 0) {
        sections.push(currentSection);
      }
      currentSection = { title: line.toUpperCase(), items: [] };
    } else {
      currentSection.items.push(line);
    }
  }

  if (currentSection.items.length > 0) {
    sections.push(currentSection);
  }

  return sections;
}

/**
 * Exports optimized profile as a professionally formatted PDF file using jsPDF
 */
export function exportToPDF(data: ResumeExportData) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const name = data.candidateName || "Professional Resume";
  const role = data.targetRole || "Target Position";
  const sections = parseResumeSections(data.resumeText);

  let y = 15;
  const margin = 15;
  const pageWidth = 210;
  const maxLineWidth = pageWidth - margin * 2;

  // Header Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text(name, margin, y);
  y += 7;

  // Subtitle / Target Role
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(16, 185, 129); // emerald-600
  doc.text(`Target Position: ${role}`, margin, y);
  y += 5;

  // ATS Score Badge if available
  if (data.analysisResult) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text(`ATS Optimization Score: ${data.analysisResult.atsScore}% | Benchmarked on Recruits.org.in`, margin, y);
    y += 6;
  }

  // Divider Line
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  // Sections
  sections.forEach((sec) => {
    // Check page break
    if (y > 270) {
      doc.addPage();
      y = 15;
    }

    // Section Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 41, 59); // slate-800
    doc.text(sec.title, margin, y);
    y += 2;

    // Section Accent Line
    doc.setDrawColor(16, 185, 129); // emerald-500
    doc.setLineWidth(0.8);
    doc.line(margin, y, margin + 25, y);
    y += 5;

    // Section Items
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85); // slate-700

    sec.items.forEach((item) => {
      const isBullet = item.startsWith("•") || item.startsWith("-") || item.startsWith("*");
      const cleanText = isBullet ? item.replace(/^[•\-\*]\s*/, "") : item;

      const wrappedLines = doc.splitTextToSize(cleanText, isBullet ? maxLineWidth - 5 : maxLineWidth);

      if (y + wrappedLines.length * 4.5 > 275) {
        doc.addPage();
        y = 15;
      }

      if (isBullet) {
        doc.text("•", margin + 1, y);
        doc.text(wrappedLines, margin + 5, y);
      } else {
        doc.text(wrappedLines, margin, y);
      }

      y += wrappedLines.length * 4.5 + 1.5;
    });

    y += 4;
  });

  // Save PDF file
  const fileName = `${name.replace(/\s+/g, "_")}_Optimized_Resume.pdf`;
  doc.save(fileName);
}

/**
 * Exports optimized profile as a professionally formatted DOCX file using docx library
 */
export async function exportToDOCX(data: ResumeExportData) {
  const name = data.candidateName || "Professional Candidate";
  const role = data.targetRole || "Target Position";
  const sections = parseResumeSections(data.resumeText);

  const docParagraphs: Paragraph[] = [];

  // Candidate Name Header
  docParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: name,
          bold: true,
          size: 32, // 16pt
          color: "0F172A",
          font: "Arial",
        }),
      ],
    })
  );

  // Target Role Subtitle
  docParagraphs.push(
    new Paragraph({
      alignment: AlignmentType.LEFT,
      children: [
        new TextRun({
          text: `Target Role: ${role}`,
          bold: true,
          size: 22, // 11pt
          color: "10B981",
          font: "Arial",
        }),
      ],
    })
  );

  if (data.analysisResult) {
    docParagraphs.push(
      new Paragraph({
        children: [
          new TextRun({
            text: `ATS Compatibility Score: ${data.analysisResult.atsScore}% (Verified on Recruits.org.in)`,
            italics: true,
            size: 18, // 9pt
            color: "64748B",
            font: "Arial",
          }),
        ],
      })
    );
  }

  // Spacing
  docParagraphs.push(new Paragraph({ text: "" }));

  // Render Sections
  sections.forEach((sec) => {
    // Section Header
    docParagraphs.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun({
            text: sec.title,
            bold: true,
            size: 24, // 12pt
            color: "1E293B",
            font: "Arial",
          }),
        ],
      })
    );

    // Items
    sec.items.forEach((item) => {
      const isBullet = item.startsWith("•") || item.startsWith("-") || item.startsWith("*");
      const cleanText = isBullet ? item.replace(/^[•\-\*]\s*/, "") : item;

      docParagraphs.push(
        new Paragraph({
          bullet: isBullet ? { level: 0 } : undefined,
          children: [
            new TextRun({
              text: cleanText,
              size: 20, // 10pt
              color: "334155",
              font: "Arial",
            }),
          ],
        })
      );
    });

    // Spacer
    docParagraphs.push(new Paragraph({ text: "" }));
  });

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              bottom: 1000,
              left: 1000,
              right: 1000,
            },
          },
        },
        children: docParagraphs,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `${name.replace(/\s+/g, "_")}_Optimized_Resume.docx`;

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
