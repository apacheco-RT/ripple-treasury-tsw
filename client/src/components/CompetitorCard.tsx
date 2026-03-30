import { cn } from "@/lib/utils";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";

interface CompetitorCardProps {
  name: string;
  pros: string[];
  cons: string[];
  color: "teal" | "purple" | "blue" | "indigo";
}

export function CompetitorCard({ name, pros, cons, color }: CompetitorCardProps) {
  const borderColors = {
    teal: "border-l-teal-500",
    purple: "border-l-purple-500",
    blue: "border-l-blue-500",
    indigo: "border-l-indigo-500"
  };

  const bgColors = {
    teal: "from-teal-500/10",
    purple: "from-purple-500/10",
    blue: "from-blue-500/10",
    indigo: "from-indigo-500/10"
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "bg-surface-card rounded-[var(--m3-shape-md)] p-[var(--m3-card-padding)] border border-slate-800 shadow-lg border-l-4",
        borderColors[color]
      )}
    >
      <div className={cn("h-16 w-full mb-4 rounded-[var(--m3-shape-sm)] bg-gradient-to-r to-transparent flex items-center px-4", bgColors[color])}>
        <h3 className="text-xl font-medium text-white m-0">{name}</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-xs uppercase tracking-wider text-emerald-400 font-medium mb-2">Strengths</h4>
          <ul className="space-y-2">
            {pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                {pro}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="border-t border-surface-border pt-4">
          <h4 className="text-xs uppercase tracking-wider text-rose-400 font-medium mb-2">Weaknesses</h4>
          <ul className="space-y-2">
            {cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <X className="w-4 h-4 text-rose-500 mt-0.5 shrink-0" />
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
