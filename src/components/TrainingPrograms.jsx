import { TRAINING_PROGRAMS } from "../data/trainingPrograms";
import ProgramPanel from "./ProgramPanel";

export default function TrainingPrograms({ sessionsByProgram, onLogSession }) {
  return (
    <section id="programs" className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-10 max-w-[60ch]">
        <p className="font-mono text-xs text-cyan mb-2">01 — TRAINING PROGRAMS</p>
        <h2 className="font-display text-4xl text-ink">Five recurring courses, one record per session</h2>
        <p className="font-body text-mute mt-3">
          Each delivered session gets three photos and one clip, and produces its own downloadable report.
        </p>
      </div>

      <div className="space-y-6">
        {TRAINING_PROGRAMS.map((program) => (
          <ProgramPanel
            key={program.id}
            program={program}
            sessions={sessionsByProgram[program.slug] || []}
            onLogSession={onLogSession}
          />
        ))}
      </div>
    </section>
  );
}
