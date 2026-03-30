import { AlertTriangle, AlertCircle, Info, ChevronRight } from "lucide-react";

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function SeverityBadge({ level }: { level: "HIGH" | "MEDIUM" | "LOW" }) {
  const map = {
    HIGH:   { cls: "bg-rose-500/15 border-rose-500/30 text-rose-400",     icon: <AlertTriangle className="w-3 h-3" /> },
    MEDIUM: { cls: "bg-amber-500/15 border-amber-500/30 text-amber-400",   icon: <AlertCircle   className="w-3 h-3" /> },
    LOW:    { cls: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400", icon: <Info       className="w-3 h-3" /> },
  };
  const s = map[level];
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--m3-shape-sm)] text-xs font-bold border ${s.cls}`}>{s.icon}{level}</span>;
}

export function FeasBadge({ level }: { level: "LOW EFFORT" | "MED EFFORT" | "HIGH EFFORT" }) {
  const cls = {
    "LOW EFFORT":  "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    "MED EFFORT":  "bg-amber-500/10   border-amber-500/20   text-amber-400",
    "HIGH EFFORT": "bg-rose-500/10    border-rose-500/20    text-rose-400",
  }[level];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-[var(--m3-shape-sm)] text-xs font-bold border ${cls}`}>{level}</span>;
}

export function PriorityBadge({ rank }: { rank: string }) {
  const isHigh = ["P1","P2","P3","P4","P5","P6"].includes(rank);
  const isMed  = ["P7","P8","P9"].includes(rank);
  return (
    <div className={`w-12 h-12 rounded-[var(--m3-shape-md)] flex items-center justify-center text-sm font-bold shrink-0
      ${isHigh ? "bg-rose-500/15 border border-rose-500/30 text-rose-400"
               : isMed ? "bg-amber-500/15 border border-amber-500/30 text-amber-400"
                       : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"}`}>
      {rank}
    </div>
  );
}

export function SectionDivider({ label, color }: { label: string; color: string }) {
  return (
    <div className={`flex items-center gap-3 p-[var(--m3-card-padding)] rounded-[var(--m3-shape-md)] border mb-6 ${color}`}>
      <span className="text-sm font-medium uppercase tracking-widest">{label} Priority</span>
    </div>
  );
}

export { ChevronRight };
