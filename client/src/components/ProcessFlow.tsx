import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown, ChevronUp, X } from "lucide-react";
import type { Txn, Filters, ProcessStage } from "@/lib/types";
import { PROCESS_STAGES } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProcessFlowProps {
  txns: Txn[];
  isFiltered: boolean;
  filters: Filters;
  setFilters: (f: Filters) => void;
  className?: string;
}

export function ProcessFlow({ txns, isFiltered, filters, setFilters, className }: ProcessFlowProps) {
  const [open, setOpen] = useState(true);

  const counts = Object.fromEntries(
    PROCESS_STAGES.map(s => [s.key, txns.filter(t => t.processStage === s.key).length])
  ) as Record<ProcessStage, number>;

  const activeStage = filters.processStage as ProcessStage | "";

  const toggleStage = (key: ProcessStage) => {
    setFilters({ ...filters, processStage: activeStage === key ? "" : key });
  };

  return (
    <section aria-label="Process flow" className={cn("bg-surface-card border border-slate-700/50 rounded-(--m3-shape-md) overflow-hidden", className)}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        aria-controls="process-flow-content"
        className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/2 transition-colors duration-200 select-none text-left">
        <span className="text-base font-medium text-white shrink-0">Process Flow</span>
        {isFiltered && <span className="text-xs text-slate-400 italic shrink-0">*filtered</span>}
        {!open && (
          <div className="flex items-center gap-1.5 flex-1 min-w-0 ml-1" aria-hidden="true">
            {PROCESS_STAGES.map((s, i) => (
              <div key={s.key} className="flex items-center gap-1 shrink-0">
                <span className={`text-xs px-1.5 py-0.5 rounded-(--m3-shape-xs) font-bold transition-all ${activeStage === s.key ? "ring-1" : ""}`}
                  style={{
                    color: s.color,
                    background: activeStage === s.key ? s.color + "33" : s.color + "22",
                    ...(activeStage === s.key ? { boxShadow: `0 0 0 1px ${s.color}66` } : {}),
                  }}>
                  {s.key} ({counts[s.key]})
                </span>
                {i < 4 && <ArrowRight className="w-2.5 h-2.5 text-slate-700" aria-hidden="true" />}
              </div>
            ))}
          </div>
        )}
        <div className="ml-auto shrink-0">
          {open
            ? <ChevronUp className="w-4 h-4 text-slate-400" aria-hidden="true" />
            : <ChevronDown className="w-4 h-4 text-slate-400" aria-hidden="true" />}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div id="process-flow-content"
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-surface-border grid grid-cols-5">
              {PROCESS_STAGES.map((s, i) => {
                const isActive = activeStage === s.key;
                return (
                  <button
                    key={s.key}
                    onClick={() => toggleStage(s.key)}
                    aria-pressed={isActive}
                    aria-label={isActive ? `Clear ${s.key} filter` : `Filter by ${s.key} stage`}
                    className={[
                      "p-3 flex flex-col gap-1.5 text-left transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-inset",
                      i < 4 ? "border-r border-surface-border" : "",
                      isActive
                        ? "bg-white/5"
                        : "hover:bg-white/3",
                    ].join(" ")}
                    style={isActive ? { boxShadow: `inset 0 0 0 1.5px ${s.color}55` } : undefined}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className={`w-2 h-2 rounded-(--m3-shape-full) shrink-0 transition-all ${isActive ? "scale-125" : ""}`}
                          style={{ background: s.color }} aria-hidden="true" />
                        <span className="text-xs font-medium text-white truncate">{s.key}</span>
                      </div>
                      {isActive && (
                        <span className="text-xs font-bold px-1.5 py-0.5 rounded-(--m3-shape-full) shrink-0"
                          style={{ background: s.color + "30", color: s.color }}>
                          Active
                        </span>
                      )}
                    </div>

                    <div className="text-2xl font-bold leading-none" style={{ color: s.color }}
                      aria-label={`${counts[s.key]} transactions`}>
                      {counts[s.key]}
                    </div>

                    <p className="text-xs text-slate-400 leading-tight flex-1">{s.desc}</p>

                    <div className={`flex items-center gap-0.5 text-xs mt-0.5 transition-colors ${isActive ? "font-bold" : "text-slate-400"
                      }`} style={isActive ? { color: s.color } : {}}>
                      {isActive
                        ? <><X className="w-2.5 h-2.5" aria-hidden="true" /> Clear filter</>
                        : counts[s.key] > 0
                          ? <>View {counts[s.key]} <ArrowRight className="w-2.5 h-2.5" aria-hidden="true" /></>
                          : s.cta
                            ? <>{s.cta} <ArrowRight className="w-2.5 h-2.5" aria-hidden="true" /></>
                            : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
