import { useState } from "react";
import SessionCard from "./SessionCard";

const emptyForm = { company_name: "", week_label: "", session_date: "", technicians_count: "" };

export default function ProgramPanel({ program, sessions, onLogSession }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);

  function submit(e) {
    e.preventDefault();
    if (!form.company_name || !form.week_label) return;
    onLogSession(program, form);
    setForm(emptyForm);
    setOpen(false);
  }

  return (
    <div className="border border-line">
      <div className="p-6 flex flex-wrap items-start justify-between gap-4 bg-panel2">
        <div>
          <p className="font-mono text-xs text-cyan mb-1">PROGRAM {String(program.id).padStart(2, "0")}</p>
          <h3 className="font-display text-3xl text-ink">{program.name}</h3>
          <p className="font-body text-sm text-mute mt-2">Covers: {program.covers.join(", ")}</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="focus-ring font-body text-sm border border-line px-4 py-2 text-ink hover:border-cyan hover:text-cyan transition-colors"
        >
          {open ? "Cancel" : "Log a session"}
        </button>
      </div>

      {open && (
        <form onSubmit={submit} className="p-6 border-t border-line grid sm:grid-cols-4 gap-3 bg-panel">
          <input
            required
            placeholder="Company / site"
            value={form.company_name}
            onChange={(e) => setForm({ ...form, company_name: e.target.value })}
            className="focus-ring bg-panel2 border border-line px-3 py-2 text-sm text-ink placeholder:text-mute"
          />
          <input
            required
            placeholder="Week label (e.g. Week 1)"
            value={form.week_label}
            onChange={(e) => setForm({ ...form, week_label: e.target.value })}
            className="focus-ring bg-panel2 border border-line px-3 py-2 text-sm text-ink placeholder:text-mute"
          />
          <input
            type="date"
            required
            value={form.session_date}
            onChange={(e) => setForm({ ...form, session_date: e.target.value })}
            className="focus-ring bg-panel2 border border-line px-3 py-2 text-sm text-ink"
          />
          <input
            type="number"
            min="0"
            placeholder="Technicians trained"
            value={form.technicians_count}
            onChange={(e) => setForm({ ...form, technicians_count: e.target.value })}
            className="focus-ring bg-panel2 border border-line px-3 py-2 text-sm text-ink placeholder:text-mute"
          />
          <button
            type="submit"
            className="focus-ring sm:col-span-4 justify-self-start font-body text-sm border border-amber text-amber px-4 py-2 hover:bg-amber hover:text-panel transition-colors"
          >
            Save session
          </button>
        </form>
      )}

      {sessions.length > 0 && (
        <div className="p-6 space-y-4 bg-[#0b0e11]">
          {sessions.map((s) => (
            <SessionCard key={s.id} program={program} session={s} />
          ))}
        </div>
      )}
    </div>
  );
}
