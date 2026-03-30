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
    HIGH:   { bg: "bg-rose-500/15",    border: "border-rose-500/30",   text: "text-rose-400",   icon: <AlertTriangle className="w-3 h-3" /> },
    MEDIUM: { bg: "bg-amber-500/15",   border: "border-amber-500/30",  text: "text-amber-400",  icon: <AlertCircle   className="w-3 h-3" /> },
    LOW:    { bg: "bg-emerald-500/15", border: "border-emerald-500/30",text: "text-emerald-400",icon: <Info          className="w-3 h-3" /> },
  };
  const s = map[level];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-(--m3-shape-sm) text-xs font-bold border ${s.bg} ${s.border} ${s.text}`}>
      {s.icon}{level}
    </span>
  );
}

export function FeasBadge({ level }: { level: "LOW EFFORT" | "MED EFFORT" | "HIGH EFFORT" }) {
  const map = {
    "LOW EFFORT":  "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    "MED EFFORT":  "bg-amber-500/10   border-amber-500/20   text-amber-400",
    "HIGH EFFORT": "bg-rose-500/10    border-rose-500/20    text-rose-400",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-(--m3-shape-sm) text-xs font-bold border ${map[level]}`}>
      {level}
    </span>
  );
}

export const sourceColor: Record<string, string> = {
  Heuristic: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Backlog:   "bg-teal-500/10  text-teal-400  border-teal-500/20",
  Both:      "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export function screenColor(screen: string) {
  if (screen === "Filter")  return "bg-blue-500/10 border-blue-500/20 text-blue-400";
  if (screen === "Results") return "bg-teal-500/10 border-teal-500/20 text-teal-400";
  if (screen === "Both")    return "bg-purple-500/10 border-purple-500/20 text-purple-400";
  return "bg-slate-500/10 border-slate-500/20 text-slate-400";
}
