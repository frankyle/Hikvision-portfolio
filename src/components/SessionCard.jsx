import { useState } from "react";
import { BUCKETS } from "../lib/supabase";
import { SESSION_MEDIA_SLOTS } from "../data/trainingPrograms";
import MediaSlot from "./MediaSlot";
import { generateSessionReportPptx } from "../lib/reportGenerator";

export default function SessionCard({ program, session }) {
  const [mediaMap, setMediaMap] = useState({});
  const [generating, setGenerating] = useState(false);
  const folder = `${program.slug}/${session.week_label}-${session.id}`;

  function handleUploaded(key, url) {
    setMediaMap((prev) => ({ ...prev, [key]: url }));
  }

  const photosReady = ["classroom", "practical", "group_photo"].some((k) => mediaMap[k]);

  async function handleDownload() {
    setGenerating(true);
    try {
      await generateSessionReportPptx({
        session: {
          program_name: program.name,
          program_slug: program.slug,
          company_name: session.company_name,
          week_label: session.week_label,
          session_date: session.session_date,
          technicians_count: session.technicians_count,
        },
        mediaMap,
        videoUrl: mediaMap.session_video,
      });
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="border border-line bg-panel p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
        <div>
          <p className="font-display text-2xl text-ink">{session.week_label}</p>
          <p className="font-body text-sm text-mute">
            {session.company_name} · {session.session_date} · {session.technicians_count} technicians
          </p>
        </div>
        <button
          type="button"
          onClick={handleDownload}
          disabled={!photosReady || generating}
          className="focus-ring font-body text-sm border border-amber text-amber px-4 py-2 hover:bg-amber hover:text-panel transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-amber"
        >
          {generating ? "Building deck…" : "Download report (PPTX)"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {SESSION_MEDIA_SLOTS.map((slot) => (
          <MediaSlot
            key={slot.key}
            bucket={BUCKETS.training}
            folder={folder}
            slot={slot}
            onUploaded={handleUploaded}
          />
        ))}
      </div>
    </div>
  );
}
