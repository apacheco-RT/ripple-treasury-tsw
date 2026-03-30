import { motion } from "framer-motion";
import { SeverityBadge, FeasBadge } from "./research-data";
import { useLazyData } from "@/hooks/useLazyData";

export function BacklogTable() {
  const backlog = useLazyData(() => import("@/data/report-data").then(m => m.backlog));

  if (!backlog) return null;

  return (
    <section className="py-12 border-t border-surface-border">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl font-medium text-white mb-2 flex items-center gap-3">
            <span className="w-8 h-8 rounded-(--m3-shape-full) bg-teal-500/15 border border-teal-500/25 text-teal-400 text-sm font-bold flex items-center justify-center">B</span>
            Customer Backlog — Enhancement Requests
          </h2>
          <p className="text-slate-400 text-sm mb-8">7 items from the product backlog reported by Ripple Treasury customers. All categorised as Enhancement (UX) on the Transaction Status Workflow.</p>

          <div className="bg-surface-card rounded-(--m3-shape-md) border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-teal-500/20 bg-surface-section">
                    <th className="px-4 py-3 text-xs uppercase text-slate-400 font-bold">#</th>
                    <th className="px-4 py-3 text-xs uppercase text-slate-400 font-bold">Enhancement Request</th>
                    <th className="px-4 py-3 text-xs uppercase text-slate-400 font-bold w-20">Screen</th>
                    <th className="px-4 py-3 text-xs uppercase text-slate-400 font-bold w-24">Effort</th>
                    <th className="px-4 py-3 text-xs uppercase text-slate-400 font-bold w-24">Impact</th>
                    <th className="px-4 py-3 text-xs uppercase text-slate-400 font-bold">Design Note</th>
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
                      className="hover:bg-slate-800/25 transition-colors"
                    >
                      <td className="px-4 py-3 text-xs text-slate-400 font-mono font-bold">{i + 1}</td>
                      <td className="px-4 py-3 text-xs text-slate-300 leading-relaxed max-w-xs">{b.item}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">{b.screen}</span>
                      </td>
                      <td className="px-4 py-3"><FeasBadge level={b.effort} /></td>
                      <td className="px-4 py-3"><SeverityBadge level={b.impact} /></td>
                      <td className="px-4 py-3 text-xs text-slate-400 leading-relaxed max-w-xs">{b.note}</td>
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
