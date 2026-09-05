import pptxgen from "pptxgenjs";

const INK = "0F1317";
const AMBER = "E8A33D";
const CYAN = "3FA9A0";
const LIGHT = "E7EAED";

async function urlToDataUrl(url) {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Builds and downloads a training-session report deck.
 * session: { program_name, company_name, week_label, technicians_count, session_date }
 * mediaMap: { classroom, practical, group_photo } -> public image URLs (video is referenced, not embedded)
 * videoUrl: optional link to the session clip, shown as a slide note
 */
export async function generateSessionReportPptx({ session, mediaMap, videoUrl }) {
  const pptx = new pptxgen();
  pptx.defineLayout({ name: "WIDE", width: 13.33, height: 7.5 });
  pptx.layout = "WIDE";

  // Cover slide
  const cover = pptx.addSlide();
  cover.background = { color: INK };
  cover.addShape("rect", { x: 0, y: 0, w: 0.15, h: 7.5, fill: { color: AMBER } });
  cover.addText("HIKVISION TECHNICAL TRAINING REPORT", {
    x: 0.7, y: 0.7, fontSize: 14, color: CYAN, fontFace: "IBM Plex Mono", charSpacing: 2,
  });
  cover.addText(session.program_name, {
    x: 0.7, y: 1.3, w: 11.5, fontSize: 40, color: LIGHT, bold: true, fontFace: "Arial",
  });
  cover.addText(
    [
      { text: `Company / site: `, options: { color: "8A94A0" } },
      { text: `${session.company_name}\n`, options: { color: LIGHT, bold: true } },
      { text: `Week: `, options: { color: "8A94A0" } },
      { text: `${session.week_label}\n`, options: { color: LIGHT } },
      { text: `Date: `, options: { color: "8A94A0" } },
      { text: `${session.session_date}\n`, options: { color: LIGHT } },
      { text: `Technicians trained: `, options: { color: "8A94A0" } },
      { text: `${session.technicians_count}`, options: { color: LIGHT } },
    ],
    { x: 0.7, y: 2.6, w: 8, fontSize: 16, lineSpacingMultiple: 1.6 }
  );
  cover.addText("Prepared by Frank — Technical Support Technician", {
    x: 0.7, y: 6.6, fontSize: 12, color: "8A94A0",
  });

  // Photo slides
  const photoSlots = [
    { key: "classroom", label: "Classroom teaching" },
    { key: "practical", label: "Practical / hands-on" },
    { key: "group_photo", label: "Group photo" },
  ];

  for (const slot of photoSlots) {
    const url = mediaMap?.[slot.key];
    if (!url) continue;
    const slide = pptx.addSlide();
    slide.background = { color: INK };
    slide.addText(slot.label, { x: 0.6, y: 0.4, fontSize: 22, color: LIGHT, bold: true });
    slide.addShape("line", { x: 0.6, y: 0.95, w: 12.1, h: 0, line: { color: "262C33", width: 1 } });
    try {
      const dataUrl = await urlToDataUrl(url);
      slide.addImage({ data: dataUrl, x: 1.9, y: 1.3, w: 9.5, h: 5.6, sizing: { type: "contain", w: 9.5, h: 5.6 } });
    } catch {
      slide.addText("Image could not be embedded — see the linked media library.", {
        x: 1, y: 3, color: "8A94A0", fontSize: 14,
      });
    }
  }

  // Closing / video reference slide
  const closing = pptx.addSlide();
  closing.background = { color: INK };
  closing.addText("Session clip & full media", { x: 0.6, y: 0.4, fontSize: 22, color: LIGHT, bold: true });
  closing.addText(
    videoUrl
      ? `The training clip for this session is hosted online: ${videoUrl}`
      : "No video clip was attached to this session.",
    { x: 0.6, y: 1.4, w: 11.5, fontSize: 14, color: "8A94A0" }
  );

  const fileName = `${session.program_slug}-${session.week_label}-report.pptx`.replace(/\s+/g, "_");
  await pptx.writeFile({ fileName });
}
