import { useState } from "react";
import { BUCKETS } from "../lib/supabase";
import { PROJECT_CATEGORIES, PROJECT_MEDIA_SLOTS } from "../data/projectCategories";
import MediaSlot from "./MediaSlot";

export default function ProjectsShowcase({ projects, onAddProject }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", category: PROJECT_CATEGORIES[0].id, description: "" });
  const [mediaMap, setMediaMap] = useState({});

  function submit(e) {
    e.preventDefault();
    if (!form.title) return;
    onAddProject({ ...form, media: mediaMap });
    setForm({ title: "", category: PROJECT_CATEGORIES[0].id, description: "" });
    setMediaMap({});
    setOpen(false);
  }

  return (
    <section id="projects" className="max-w-6xl mx-auto px-6 py-16 border-t border-line">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div className="max-w-[60ch]">
          <p className="font-mono text-xs text-cyan mb-2">03 — FIELD PROJECTS</p>
          <h2 className="font-display text-4xl text-ink">What the technicians actually installed</h2>
          <p className="font-body text-mute mt-3">Four site photos and a short clip per completed installation.</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="focus-ring font-body text-sm border border-line px-4 py-2 text-ink hover:border-cyan hover:text-cyan transition-colors"
        >
          {open ? "Cancel" : "Add a project"}
        </button>
      </div>

      {open && (
        <form onSubmit={submit} className="border border-line bg-panel2 p-6 mb-10 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <input
              required
              placeholder="Project title / site name"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="focus-ring bg-panel border border-line px-3 py-2 text-sm text-ink placeholder:text-mute"
            />
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="focus-ring bg-panel border border-line px-3 py-2 text-sm text-ink"
            >
              {PROJECT_CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
            <input
              placeholder="One-line description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="focus-ring bg-panel border border-line px-3 py-2 text-sm text-ink placeholder:text-mute sm:col-span-2"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {PROJECT_MEDIA_SLOTS.map((slot) => (
              <MediaSlot
                key={slot.key}
                bucket={BUCKETS.projects}
                folder={`${form.category}/${form.title || "untitled"}`}
                slot={slot}
                onUploaded={(key, url) => setMediaMap((prev) => ({ ...prev, [key]: url }))}
              />
            ))}
          </div>

          <button
            type="submit"
            className="focus-ring font-body text-sm border border-amber text-amber px-4 py-2 hover:bg-amber hover:text-panel transition-colors"
          >
            Publish project
          </button>
        </form>
      )}

      {projects.length === 0 ? (
        <p className="font-body text-mute text-sm">No field projects published yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 gap-6">
          {projects.map((p) => {
            const images = PROJECT_MEDIA_SLOTS.filter((s) => s.type === "image" && p.media?.[s.key]);
            const video = p.media?.project_video;
            const category = PROJECT_CATEGORIES.find((c) => c.id === p.category)?.label;
            return (
              <div key={p.id} className="border border-line bg-panel2">
                <div className="grid grid-cols-2">
                  {images.map((s) => (
                    <img key={s.key} src={p.media[s.key]} alt={p.title} className="aspect-square object-cover" />
                  ))}
                </div>
                {video && <video src={video} controls className="w-full aspect-video bg-panel" />}
                <div className="p-4">
                  <p className="font-mono text-xs text-cyan mb-1">{category}</p>
                  <p className="font-display text-xl text-ink">{p.title}</p>
                  {p.description && <p className="font-body text-sm text-mute mt-1">{p.description}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
