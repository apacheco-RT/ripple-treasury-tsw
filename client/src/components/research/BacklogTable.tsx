import { motion } from "framer-motion";
import { SeverityBadge, FeasBadge } from "./research-data";
import { useLazyData } from "@/hooks/useLazyData";

export function BacklogTable() {
  const backlog = useLazyData(() => import("@/data/report-data").then(m => m.backlog));

  if (!backlog) return null;

  return (
    <section className="py-12 border-t border-[var(--ds-color-border-default)]">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl font-medium text-white mb-2 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[var(--ds-color-brand-primary-subtle)] border border-[var(--ds-color-brand-primary)]/25 text-[var(--ds-color-brand-primary)] text-sm font-bold flex items-center justify-center">B</span>
            Customer Backlog — Enhancement Requests
          </h2>
          <p className="text-[var(--ds-color-text-secondary)] text-sm mb-8">7 items from the product backlog reported by Ripple Treasury customers. All categorised as Enhancement (UX) on the Transaction Status Workflow.</p>

          <div className="bg-[var(--ds-color-surface-default)] rounded-[var(--ds-radius-xl)] border border-[var(--ds-color-border-default)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-[var(--ds-color-brand-primary)]/20 bg-[var(--ds-color-surface-page)]">
                    <th className="px-4 py-3 text-xs uppercase text-[var(--ds-color-text-secondary)] font-bold">#</th>
                    <th className="px-4 py-3 text-xs uppercase text-[var(--ds-color-text-secondary)] font-bold">Enhancement Request</th>
                    <th className="px-4 py-3 text-xs uppercase text-[var(--ds-color-text-secondary)] font-bold w-20">Screen</th>
                    <th className="px-4 py-3 text-xs uppercase text-[var(--ds-color-text-secondary)] font-bold w-24">Effort</th>
                    <th className="px-4 py-3 text-xs uppercase text-[var(--ds-color-text-secondary)] font-bold w-24">Impact</th>
                    <th className="px-4 py-3 text-xs uppercase text-[var(--ds-color-text-secondary)] font-bold">Design Note</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  {backlog.map((b, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className="hover:bg-[var(--ds-color-surface-raised)]/25 transition-colors"
                    >
                      <td className="px-4 py-3 text-xs text-[var(--ds-color-text-secondary)] font-mono font-bold">{i + 1}</td>
                      <td className="px-4 py-3 text-xs text-[var(--ds-color-text-secondary)] leading-relaxed max-w-xs">{b.item}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--ds-color-surface-raised)] text-[var(--ds-color-text-secondary)] font-medium">{b.screen}</span>
                      </td>
                      <td className="px-4 py-3"><FeasBadge level={b.effort} /></td>
                      <td className="px-4 py-3"><SeverityBadge level={b.impact} /></td>
                      <td className="px-4 py-3 text-xs text-[var(--ds-color-text-secondary)] leading-relaxed max-w-xs">{b.note}</td>
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
