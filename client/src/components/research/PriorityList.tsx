import { motion } from "framer-motion";
import { sourceColor, SeverityBadge, FeasBadge } from "./research-data";
import { useLazyData } from "@/hooks/useLazyData";

export function PriorityList() {
  const priority = useLazyData(() => import("@/data/report-data").then(m => m.priority));

  if (!priority) return null;

  return (
    <section className="py-12 border-t border-[var(--ds-color-border-default)]/50 bg-[var(--ds-color-surface-sunken)]">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl font-medium text-white mb-2 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-purple-500/15 border border-purple-500/25 text-purple-400 text-sm font-bold flex items-center justify-center">C</span>
            Combined Priority List — P1 to P10
          </h2>
          <p className="text-[var(--ds-color-text-secondary)] text-sm mb-8">Heuristic + backlog findings consolidated and ranked by severity × implementation feasibility. Source indicates whether the finding came from heuristic evaluation, customer backlog, or both.</p>

          <div className="space-y-3">
            {priority.map((p, i) => (
              <motion.div
                key={p.rank}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 bg-[var(--ds-color-surface-default)] rounded-[var(--ds-radius-xl)] border border-[var(--ds-color-border-default)] px-5 py-4 hover:border-[var(--ds-color-border-default)] transition-colors"
              >
                <div className="w-12 h-12 rounded-[var(--ds-radius-xl)] bg-[var(--ds-color-surface-default)] border border-[var(--ds-color-border-default)] flex items-center justify-center shrink-0">
                  <span className="text-xs font-extrabold text-[var(--ds-color-text-secondary)]">{p.rank}</span>
                </div>
                <p className="flex-1 text-sm text-white font-medium leading-snug">{p.finding}</p>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-[var(--ds-radius-lg)] border shrink-0 ${sourceColor[p.source]}`}>
                  {p.source}
                </span>
                <div className="shrink-0"><SeverityBadge level={p.severity} /></div>
                <div className="shrink-0"><FeasBadge level={p.effort} /></div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
