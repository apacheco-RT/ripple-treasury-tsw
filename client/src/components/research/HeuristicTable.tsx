import { motion } from "framer-motion";
import { SeverityBadge } from "./research-data";
import { useLazyData } from "@/hooks/useLazyData";

export function HeuristicTable() {
  const heuristics = useLazyData(() => import("@/data/report-data").then(m => m.heuristics));

  if (!heuristics) return null;

  return (
    <section className="py-12 border-t border-[var(--ds-color-border-default)]/50 bg-[var(--ds-color-surface-sunken)]">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl font-medium text-white mb-2 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/25 text-blue-400 text-sm font-bold flex items-center justify-center">A</span>
            Heuristic Evaluation — H1 to H10
          </h2>
          <p className="text-[var(--ds-color-text-secondary)] text-sm mb-8">Nielsen's 10 heuristics applied across both screens. Severity rated by frequency × impact.</p>

          <div className="bg-[var(--ds-color-surface-default)] rounded-[var(--ds-radius-xl)] border border-[var(--ds-color-border-default)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-blue-500/20 bg-[var(--ds-color-surface-default)]">
                    <th className="px-4 py-3 text-xs uppercase text-[var(--ds-color-text-secondary)] font-bold w-16">ID</th>
                    <th className="px-4 py-3 text-xs uppercase text-[var(--ds-color-text-secondary)] font-bold w-44">Heuristic</th>
                    <th className="px-4 py-3 text-xs uppercase text-[var(--ds-color-text-secondary)] font-bold">Finding</th>
                    <th className="px-4 py-3 text-xs uppercase text-[var(--ds-color-text-secondary)] font-bold w-20">Screen</th>
                    <th className="px-4 py-3 text-xs uppercase text-[var(--ds-color-text-secondary)] font-bold w-24">Severity</th>
                    <th className="px-4 py-3 text-xs uppercase text-[var(--ds-color-text-secondary)] font-bold">Impact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {heuristics.map((h, i) => (
                    <motion.tr
                      key={h.id}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                      className="hover:bg-[var(--ds-color-surface-raised)]/25 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <span className="font-mono text-xs font-bold text-blue-400">{h.id}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-[var(--ds-color-text-secondary)] font-medium leading-snug">{h.name}</td>
                      <td className="px-4 py-3 text-xs text-[var(--ds-color-text-secondary)] leading-relaxed max-w-xs">{h.finding}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--ds-color-surface-raised)] text-[var(--ds-color-text-secondary)] font-medium">{h.screen}</span>
                      </td>
                      <td className="px-4 py-3"><SeverityBadge level={h.severity} /></td>
                      <td className="px-4 py-3 text-xs text-[var(--ds-color-text-secondary)] leading-relaxed max-w-xs">{h.impact}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
