import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { Bug, ArrowUpDown, ShieldAlert, Table2, Columns3, Filter, HelpCircle, BookmarkCheck, RotateCw, Trash2, ListFilter } from "lucide-react";
import { screenColor, SeverityBadge, FeasBadge } from "./research-data";
import { useLazyData } from "@/hooks/useLazyData";

const reqIcons: Record<string, { icon: ReactNode; iconBg: string }> = {
  "REQ-01": { icon: <ArrowUpDown className="w-4 h-4 text-rose-400" />, iconBg: "bg-rose-500/10" },
  "REQ-02": { icon: <ShieldAlert className="w-4 h-4 text-amber-400" />, iconBg: "bg-amber-500/10" },
  "REQ-03": { icon: <Table2 className="w-4 h-4 text-teal-400" />, iconBg: "bg-teal-500/10" },
  "REQ-04": { icon: <ShieldAlert className="w-4 h-4 text-rose-400" />, iconBg: "bg-rose-500/10" },
  "REQ-05": { icon: <Columns3 className="w-4 h-4 text-slate-300" />, iconBg: "bg-slate-500/10" },
  "REQ-06": { icon: <ArrowUpDown className="w-4 h-4 text-slate-300" />, iconBg: "bg-slate-500/10" },
  "REQ-07": { icon: <Filter className="w-4 h-4 text-blue-400" />, iconBg: "bg-blue-500/10" },
  "REQ-08": { icon: <HelpCircle className="w-4 h-4 text-slate-300" />, iconBg: "bg-slate-500/10" },
  "REQ-09": { icon: <BookmarkCheck className="w-4 h-4 text-teal-400" />, iconBg: "bg-teal-500/10" },
  "REQ-10": { icon: <RotateCw className="w-4 h-4 text-teal-400" />, iconBg: "bg-teal-500/10" },
  "REQ-11": { icon: <Trash2 className="w-4 h-4 text-rose-400" />, iconBg: "bg-rose-500/10" },
  "REQ-12": { icon: <Bug className="w-4 h-4 text-rose-400" />, iconBg: "bg-rose-500/10" },
  "REQ-13": { icon: <ListFilter className="w-4 h-4 text-blue-400" />, iconBg: "bg-blue-500/10" },
  "REQ-14": { icon: <ArrowUpDown className="w-4 h-4 text-amber-400" />, iconBg: "bg-amber-500/10" },
  "REQ-15": { icon: <HelpCircle className="w-4 h-4 text-slate-400" />, iconBg: "bg-slate-500/10" },
};

interface ScreenLegendItem {
  label: string;
  color: string;
}

const screenLegend: ScreenLegendItem[] = [
  { label: "Filter screen", color: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
  { label: "Results screen", color: "bg-teal-500/10 border-teal-500/20 text-teal-400" },
  { label: "Both screens", color: "bg-purple-500/10 border-purple-500/20 text-purple-400" },
  { label: "Bug / Defect", color: "bg-rose-500/10 border-rose-500/20 text-rose-400" },
];

export function RequirementsSection() {
  const requirements = useLazyData(() => import("@/data/report-data").then(m => m.requirements));

  if (!requirements) return null;

  return (
    <section className="py-12 border-t border-surface-border">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl font-medium text-white mb-2 flex items-center gap-3">
            <span className="w-8 h-8 rounded-[var(--m3-shape-full)] bg-orange-500/15 border border-orange-500/25 text-orange-400 text-sm font-bold flex items-center justify-center">D</span>
            Design Requirements &amp; Changes
          </h2>
          <p className="text-slate-400 text-sm mb-8">
            15 functional requirements derived from the heuristic evaluation and customer feedback. Each maps to a screen, a source finding, and a concrete design change.
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {screenLegend.map((l) => (
              <span key={l.label} className={`text-xs font-bold px-2.5 py-1 rounded-[var(--m3-shape-sm)] border ${l.color}`}>{l.label}</span>
            ))}
          </div>

          <div className="space-y-4">
            {requirements.map((req, i) => {
              const icons = reqIcons[req.id] || { icon: null, iconBg: "bg-slate-500/10" };
              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-surface-card rounded-[var(--m3-shape-md)] border border-slate-800 overflow-hidden hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start gap-4 p-4 border-b border-surface-border">
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-14 h-8 rounded-[var(--m3-shape-sm)] bg-surface-card border border-slate-700 flex items-center justify-center">
                        <span className="text-[var(--m3-label-sm)] font-extrabold text-slate-300 font-mono">{req.id}</span>
                      </div>
                      <div className={`w-8 h-8 rounded-[var(--m3-shape-sm)] flex items-center justify-center shrink-0 ${icons.iconBg}`}>
                        {icons.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-[var(--m3-shape-sm)] border ${screenColor(req.screen)}`}>{req.screen}</span>
                        <SeverityBadge level={req.severity} />
                        <FeasBadge level={req.effort} />
                        {req.isBug && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-[var(--m3-shape-sm)] border bg-rose-500/10 border-rose-500/25 text-rose-400">
                            <Bug className="w-3 h-3" /> Defect
                          </span>
                        )}
                        <span className="text-xs text-slate-400 font-mono">{req.source}</span>
                      </div>
                      <p className="text-sm font-medium text-white leading-snug">{req.title}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-surface-border">
                    <div className="p-4">
                      <p className="text-xs uppercase tracking-widest text-slate-400 font-medium mb-2">Requirement</p>
                      <p className="text-xs text-slate-300 leading-relaxed">{req.requirement}</p>
                    </div>
                    <div className="p-4">
                      <p className="text-xs uppercase tracking-widest text-teal-500 font-medium mb-2">Design Change</p>
                      <p className="text-xs text-slate-300 leading-relaxed">{req.designChange}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
