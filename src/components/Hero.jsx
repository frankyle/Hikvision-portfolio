import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function Hero({ stats }) {
  return (
    <section id="top" className="max-w-6xl mx-auto px-6 pt-16 pb-20">
      <motion.div variants={container} initial="hidden" animate="show" className="grid md:grid-cols-[1.4fr_1fr] gap-10">
        <div>
          <motion.p variants={item} className="font-mono text-xs text-cyan mb-4">
            HIKVISION TECHNICAL TRAINING — FIELD RECORD
          </motion.p>
          <motion.h1 variants={item} className="font-display text-6xl md:text-7xl leading-[0.95] text-ink">
            Frank's training desk, documented session by session.
          </motion.h1>
          <motion.p variants={item} className="font-body text-mute mt-6 max-w-[60ch] text-lg">
            A working record of the installer and technician trainings Frank runs across CCTV, access
            control, gate motors &amp; energizers, networking, and fire alarm systems — with the photos,
            clips, and reports from each one.
          </motion.p>
        </div>

        <motion.div variants={item} className="border border-line bg-panel2 p-6 self-start">
          <p className="font-mono text-xs text-mute mb-4">SESSION LOG — CUMULATIVE</p>
          <dl className="space-y-4">
            {stats.map((s) => (
              <div key={s.label} className="flex items-baseline justify-between border-b border-line pb-3 last:border-none last:pb-0">
                <dt className="font-body text-sm text-mute">{s.label}</dt>
                <dd className="font-display text-3xl text-ink">{s.value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </motion.div>
    </section>
  );
}
