import { useState } from "react";
import { BUCKETS } from "../lib/supabase";
import MediaSlot from "./MediaSlot";

const VIDEO_SLOT = { key: "clip", label: "Tutorial clip", type: "video", maxSeconds: 300 };

export default function DeviceVideoLibrary({ videos, onAddVideo }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", device: "", description: "" });
  const [pendingUrl, setPendingUrl] = useState(null);

  function submit(e) {
    e.preventDefault();
    if (!form.title || !pendingUrl) return;
    onAddVideo({ ...form, video_url: pendingUrl });
    setForm({ title: "", device: "", description: "" });
    setPendingUrl(null);
    setOpen(false);
  }

  return (
    <section id="library" className="max-w-6xl mx-auto px-6 py-16 border-t border-line">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div className="max-w-[60ch]">
          <p className="font-mono text-xs text-cyan mb-2">02 — DEVICE VIDEO LIBRARY</p>
          <h2 className="font-display text-4xl text-ink">Short walkthroughs, one device at a time</h2>
          <p className="font-body text-mute mt-3">Under five minutes each, so technicians can watch on-site between jobs.</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="focus-ring font-body text-sm border border-line px-4 py-2 text-ink hover:border-cyan hover:text-cyan transition-colors"
        >
          {open ? "Cancel" : "Add a video"}
        </button>
      </div>

      {open && (
        <form onSubmit={submit} className="border border-line bg-panel2 p-6 mb-10 grid sm:grid-cols-2 gap-4">
          <input
            required
            placeholder="Title (e.g. Setting up AX Pro zones)"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="focus-ring bg-panel border border-line px-3 py-2 text-sm text-ink placeholder:text-mute sm:col-span-2"
          />
          <input
            placeholder="Device / product"
            value={form.device}
            onChange={(e) => setForm({ ...form, device: e.target.value })}
            className="focus-ring bg-panel border border-line px-3 py-2 text-sm text-ink placeholder:text-mute"
          />
          <input
            placeholder="One-line description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="focus-ring bg-panel border border-line px-3 py-2 text-sm text-ink placeholder:text-mute"
          />
          <div className="sm:col-span-2">
            <MediaSlot bucket={BUCKETS.deviceVideos} folder="clips" slot={VIDEO_SLOT} onUploaded={(_, url) => setPendingUrl(url)} />
          </div>
          <button
            type="submit"
            className="focus-ring sm:col-span-2 justify-self-start font-body text-sm border border-amber text-amber px-4 py-2 hover:bg-amber hover:text-panel transition-colors"
          >
            Publish video
          </button>
        </form>
      )}

      {videos.length === 0 ? (
        <p className="font-body text-mute text-sm">No videos published yet — the library starts here.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((v) => (
            <div key={v.id} className="border border-line bg-panel2">
              <video src={v.video_url} controls className="w-full aspect-video bg-panel" />
              <div className="p-4">
                {v.device && <p className="font-mono text-xs text-cyan mb-1">{v.device}</p>}
                <p className="font-display text-xl text-ink">{v.title}</p>
                {v.description && <p className="font-body text-sm text-mute mt-1">{v.description}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
