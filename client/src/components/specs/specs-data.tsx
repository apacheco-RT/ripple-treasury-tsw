import { AlertTriangle, AlertCircle, Info, ChevronRight } from "lucide-react";

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export function SeverityBadge({ level }: { level: "HIGH" | "MEDIUM" | "LOW" }) {
  const map = {
    HIGH:   { cls: "bg-[var(--ds-color-feedback-error-bg)] border-[var(--ds-color-feedback-error-border)]/30 text-[var(--ds-color-feedback-error-text)]",     icon: <AlertTriangle className="w-3 h-3" /> },
    MEDIUM: { cls: "bg-[var(--ds-color-feedback-warning-bg)] border-[var(--ds-color-feedback-warning-border)]/30 text-[var(--ds-color-feedback-warning-text)]",   icon: <AlertCircle   className="w-3 h-3" /> },
    LOW:    { cls: "bg-[var(--ds-color-feedback-success-bg)] border-[var(--ds-color-feedback-success-border)]/30 text-[var(--ds-color-feedback-success-text)]", icon: <Info       className="w-3 h-3" /> },
  };
  const s = map[level];
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--ds-radius-lg)] text-xs font-bold border ${s.cls}`}>{s.icon}{level}</span>;
}

export function FeasBadge({ level }: { level: "LOW EFFORT" | "MED EFFORT" | "HIGH EFFORT" }) {
  const cls = {
    "LOW EFFORT":  "bg-[var(--ds-color-feedback-success-bg)] border-[var(--ds-color-feedback-success-border)]/20 text-[var(--ds-color-feedback-success-text)]",
    "MED EFFORT":  "bg-[var(--ds-color-feedback-warning-bg)] border-[var(--ds-color-feedback-warning-border)]/20 text-[var(--ds-color-feedback-warning-text)]",
    "HIGH EFFORT": "bg-[var(--ds-color-feedback-error-bg)]   border-[var(--ds-color-feedback-error-border)]/20   text-[var(--ds-color-feedback-error-text)]",
  }[level];
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-[var(--ds-radius-lg)] text-xs font-bold border ${cls}`}>{level}</span>;
}

export function PriorityBadge({ rank }: { rank: string }) {
  const isHigh = ["P1","P2","P3","P4","P5","P6"].includes(rank);
  const isMed  = ["P7","P8","P9"].includes(rank);
  return (
    <div className={`w-12 h-12 rounded-[var(--ds-radius-xl)] flex items-center justify-center text-sm font-bold shrink-0
      ${isHigh ? "bg-[var(--ds-color-feedback-error-bg)] border border-[var(--ds-color-feedback-error-border)]/30 text-[var(--ds-color-feedback-error-text)]"
               : isMed ? "bg-[var(--ds-color-feedback-warning-bg)] border border-[var(--ds-color-feedback-warning-border)]/30 text-[var(--ds-color-feedback-warning-text)]"
                       : "bg-[var(--ds-color-feedback-success-bg)] border border-[var(--ds-color-feedback-success-border)]/20 text-[var(--ds-color-feedback-success-text)]"}`}>
      {rank}
    </div>
  );
}

export function SectionDivider({ label, color }: { label: string; color: string }) {
  return (
    <div className={`flex items-center gap-3 p-4 rounded-[var(--ds-radius-xl)] border mb-6 ${color}`}>
      <span className="text-sm font-medium uppercase tracking-widest">{label} Priority</span>
    </div>
  );
}

export { ChevronRight };
