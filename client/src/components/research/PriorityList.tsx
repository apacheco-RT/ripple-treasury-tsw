import { motion } from "framer-motion";
import { sourceColor, SeverityBadge, FeasBadge } from "./research-data";
import { useLazyData } from "@/hooks/useLazyData";

export function PriorityList() {
  const priority = useLazyData(() => import("@/data/report-data").then(m => m.priority));

  if (!priority) return null;

  return (
    <section className="py-12 border-t border-slate-800/50 bg-surface-inset">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl font-medium text-white mb-2 flex items-center gap-3">
            <span className="w-8 h-8 rounded-(--m3-shape-full) bg-purple-500/15 border border-purple-500/25 text-purple-400 text-sm font-bold flex items-center justify-center">C</span>
            Combined Priority List — P1 to P10
          </h2>
          <p className="text-slate-400 text-sm mb-8">Heuristic + backlog findings consolidated and ranked by severity × implementation feasibility. Source indicates whether the finding came from heuristic evaluation, customer backlog, or both.</p>

          <div className="space-y-3">
            {priority.map((p, i) => (
              <motion.div
                key={p.rank}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 bg-surface-card rounded-(--m3-shape-md) border border-slate-800 px-5 py-4 hover:border-slate-700 transition-colors"
              >
                <div className="w-12 h-12 rounded-(--m3-shape-md) bg-surface-card border border-slate-700 flex items-center justify-center shrink-0">
                  <span className="text-xs font-extrabold text-slate-300">{p.rank}</span>
                </div>
                <p className="flex-1 text-sm text-white font-medium leading-snug">{p.finding}</p>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-(--m3-shape-sm) border shrink-0 ${sourceColor[p.source]}`}>
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
