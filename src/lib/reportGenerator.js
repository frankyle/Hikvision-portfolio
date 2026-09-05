import pptxgen from "pptxgenjs";

const INK = "0F1317";
const PANEL2 = "151A20";
const LINE = "262C33";
const AMBER = "E8A33D";
const CYAN = "3FA9A0";
const LIGHT = "E7EAED";
const MUTE = "8A94A0";

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
 * Builds and downloads a two-slide training-session report:
 *   Slide 1 — programme, session details, and the free-text description.
 *   Slide 2 — a 2x2 grid: the three photos plus a linked "session clip" tile.
 *
 * session: { program_name, program_slug, company_name, week_label, session_date,
 *            technicians_count, description }
 * mediaMap: { classroom, practical, group_photo } -> public image URLs
 * videoUrl: optional public URL of the session clip
 */
export async function generateSessionReportPptx({ session, mediaMap, videoUrl }) {
  const pptx = new pptxgen();
  pptx.defineLayout({ name: "WIDE", width: 13.33, height: 7.5 });
  pptx.layout = "WIDE";

  // ---------- Slide 1: details + description ----------
  const details = pptx.addSlide();
  details.background = { color: INK };
  details.addShape("rect", { x: 0, y: 0, w: 0.15, h: 7.5, fill: { color: AMBER } });

  details.addText("HIKVISION TECHNICAL TRAINING REPORT", {
    x: 0.7, y: 0.55, fontSize: 13, color: CYAN, fontFace: "IBM Plex Mono", charSpacing: 2,
  });
  details.addText(session.program_name, {
    x: 0.7, y: 1.0, w: 11.8, fontSize: 36, color: LIGHT, bold: true, fontFace: "Arial",
  });

  // Details panel (left column)
  details.addShape("rect", { x: 0.7, y: 2.15, w: 5.4, h: 4.6, fill: { color: PANEL2 }, line: { color: LINE, width: 1 } });
  details.addText("SESSION DETAILS", { x: 1.0, y: 2.4, fontSize: 12, color: CYAN, fontFace: "IBM Plex Mono", charSpacing: 1.5 });
  const rows = [
    ["Company / site", session.company_name],
    ["Week", session.week_label],
    ["Date", session.session_date || "—"],
    ["Technicians trained", String(session.technicians_count ?? "—")],
  ];
  details.addTable(
    rows.map(([label, value]) => [
      { text: label, options: { color: MUTE, fontSize: 13 } },
      { text: value, options: { color: LIGHT, fontSize: 13, bold: true } },
    ]),
    {
      x: 1.0, y: 2.85, w: 4.8,
      border: { type: "none" },
      autoPage: false,
      rowH: 0.55,
      valign: "middle",
    }
  );

  // Description panel (right column) — this is where the free-text write-up lands
  details.addShape("rect", { x: 6.3, y: 2.15, w: 6.3, h: 4.6, fill: { color: PANEL2 }, line: { color: LINE, width: 1 } });
  details.addText("DESCRIPTION", { x: 6.6, y: 2.4, fontSize: 12, color: CYAN, fontFace: "IBM Plex Mono", charSpacing: 1.5 });
  details.addText(
    session.description?.trim() || "No description added for this session.",
    {
      x: 6.6, y: 2.85, w: 5.7, h: 3.7,
      fontSize: 15, color: session.description?.trim() ? LIGHT : MUTE,
      fontFace: "Arial", valign: "top", lineSpacingMultiple: 1.35,
    }
  );

  details.addText("Prepared by Frank — Technical Support Technician", {
    x: 0.7, y: 7.0, fontSize: 11, color: MUTE,
  });

  // ---------- Slide 2: media grid ----------
  const media = pptx.addSlide();
  media.background = { color: INK };
  media.addText("Session media", { x: 0.6, y: 0.45, fontSize: 24, color: LIGHT, bold: true });
  media.addText(`${session.company_name} — ${session.week_label}`, {
    x: 0.6, y: 0.95, fontSize: 13, color: MUTE,
  });

  // 2x2 grid geometry
  const gap = 0.3;
  const gridX = 0.6, gridY = 1.55, gridW = 12.1, gridH = 5.55;
  const cellW = (gridW - gap) / 2;
  const cellH = (gridH - gap) / 2;
  const cells = [
    { x: gridX, y: gridY },
    { x: gridX + cellW + gap, y: gridY },
    { x: gridX, y: gridY + cellH + gap },
    { x: gridX + cellW + gap, y: gridY + cellH + gap },
  ];

  const photoSlots = [
    { key: "classroom", label: "Classroom teaching" },
    { key: "practical", label: "Practical / hands-on" },
    { key: "group_photo", label: "Group photo" },
  ];

  for (let i = 0; i < photoSlots.length; i++) {
    const slot = photoSlots[i];
    const cell = cells[i];
    const url = mediaMap?.[slot.key];

    media.addShape("rect", { ...cell, w: cellW, h: cellH, fill: { color: PANEL2 }, line: { color: LINE, width: 1 } });
    if (url) {
      try {
        const dataUrl = await urlToDataUrl(url);
        media.addImage({
          data: dataUrl,
          x: cell.x + 0.08, y: cell.y + 0.08, w: cellW - 0.16, h: cellH - 0.55,
          sizing: { type: "cover", w: cellW - 0.16, h: cellH - 0.55 },
        });
      } catch {
        media.addText("Image unavailable", { x: cell.x + 0.2, y: cell.y + cellH / 2 - 0.2, color: MUTE, fontSize: 12 });
      }
    } else {
      media.addText("Not attached", { x: cell.x + 0.2, y: cell.y + cellH / 2 - 0.2, color: MUTE, fontSize: 12 });
    }
    media.addText(slot.label, {
      x: cell.x + 0.08, y: cell.y + cellH - 0.42, w: cellW - 0.16, h: 0.34,
      fontSize: 12, color: LIGHT, fontFace: "IBM Plex Mono",
    });
  }

  // 4th tile: the session clip, as a clickable card (video isn't reliably embeddable from a remote URL)
  const clipCell = cells[3];
  media.addShape("rect", { ...clipCell, w: cellW, h: cellH, fill: { color: PANEL2 }, line: { color: videoUrl ? AMBER : LINE, width: 1 } });
  if (videoUrl) {
    // Play-button triangle
    const cx = clipCell.x + cellW / 2, cy = clipCell.y + cellH / 2 - 0.25;
    media.addShape("triangle", {
      x: cx - 0.3, y: cy - 0.3, w: 0.6, h: 0.6,
      fill: { color: AMBER }, rotate: 90,
    });
    media.addText("Watch session clip", {
      x: clipCell.x, y: cy + 0.45, w: cellW, fontSize: 13, color: AMBER, align: "center", bold: true,
      hyperlink: { url: videoUrl },
    });
  } else {
    media.addText("No clip attached", { x: clipCell.x + 0.2, y: clipCell.y + cellH / 2 - 0.2, color: MUTE, fontSize: 12 });
  }
  media.addText("Training session clip", {
    x: clipCell.x + 0.08, y: clipCell.y + cellH - 0.42, w: cellW - 0.16, h: 0.34,
    fontSize: 12, color: LIGHT, fontFace: "IBM Plex Mono",
  });

  const fileName = `${session.program_slug}-${session.week_label}-report.pptx`.replace(/\s+/g, "_");
  await pptx.writeFile({ fileName });
}
