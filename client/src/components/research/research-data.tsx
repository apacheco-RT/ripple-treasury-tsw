import { AlertTriangle, AlertCircle, Info } from "lucide-react";

export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

export function SeverityBadge({ level }: { level: "HIGH" | "MEDIUM" | "LOW" }) {
  const map = {
    HIGH:   { bg: "bg-[var(--ds-color-feedback-error-bg)]",   border: "border-[var(--ds-color-feedback-error-border)]/30",   text: "text-[var(--ds-color-feedback-error-text)]",   icon: <AlertTriangle className="w-3 h-3" /> },
    MEDIUM: { bg: "bg-[var(--ds-color-feedback-warning-bg)]", border: "border-[var(--ds-color-feedback-warning-border)]/30", text: "text-[var(--ds-color-feedback-warning-text)]", icon: <AlertCircle   className="w-3 h-3" /> },
    LOW:    { bg: "bg-[var(--ds-color-feedback-success-bg)]", border: "border-[var(--ds-color-feedback-success-border)]/30", text: "text-[var(--ds-color-feedback-success-text)]", icon: <Info          className="w-3 h-3" /> },
  };
  const s = map[level];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--ds-radius-lg)] text-xs font-bold border ${s.bg} ${s.border} ${s.text}`}>
      {s.icon}{level}
    </span>
  );
}

export function FeasBadge({ level }: { level: "LOW EFFORT" | "MED EFFORT" | "HIGH EFFORT" }) {
  const map = {
    "LOW EFFORT":  "bg-[var(--ds-color-feedback-success-bg)] border-[var(--ds-color-feedback-success-border)]/20 text-[var(--ds-color-feedback-success-text)]",
    "MED EFFORT":  "bg-[var(--ds-color-feedback-warning-bg)] border-[var(--ds-color-feedback-warning-border)]/20 text-[var(--ds-color-feedback-warning-text)]",
    "HIGH EFFORT": "bg-[var(--ds-color-feedback-error-bg)]   border-[var(--ds-color-feedback-error-border)]/20   text-[var(--ds-color-feedback-error-text)]",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-[var(--ds-radius-lg)] text-xs font-bold border ${map[level]}`}>
      {level}
    </span>
  );
}

export const sourceColor: Record<string, string> = {
  Heuristic: "bg-[var(--ds-color-feedback-info-bg)] text-[var(--ds-color-feedback-info-text)] border-[var(--ds-color-feedback-info-border)]/20",
  Backlog:   "bg-[var(--ds-color-brand-primary-subtle)] text-[var(--ds-color-brand-primary)] border-[var(--ds-color-brand-primary)]/20",
  Both:      "bg-[var(--ds-color-feedback-info-bg)] text-[var(--ds-color-feedback-info-text)] border-[var(--ds-color-feedback-info-border)]/20",
};

export function screenColor(screen: string) {
  if (screen === "Filter")  return "bg-[var(--ds-color-feedback-info-bg)] border-[var(--ds-color-feedback-info-border)]/20 text-[var(--ds-color-feedback-info-text)]";
  if (screen === "Results") return "bg-[var(--ds-color-brand-primary-subtle)] border-[var(--ds-color-brand-primary)]/20 text-[var(--ds-color-brand-primary)]";
  if (screen === "Both")    return "bg-[var(--ds-color-feedback-info-bg)] border-[var(--ds-color-feedback-info-border)]/20 text-[var(--ds-color-feedback-info-text)]";
  return "bg-[var(--ds-color-surface-raised)]/30 border-[var(--ds-color-border-default)]/20 text-[var(--ds-color-text-secondary)]";
}
