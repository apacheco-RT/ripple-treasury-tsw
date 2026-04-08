// @tsw-template — prototype-specific component
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
    teal: "border-l-[var(--ds-color-brand-primary)]",
    purple: "border-l-[var(--ds-color-feedback-info-border)]",
    blue: "border-l-[var(--ds-color-feedback-info-border)]",
    indigo: "border-l-[var(--ds-color-brand-primary)]"
  };

  const bgColors = {
    teal: "from-[var(--ds-color-brand-primary-subtle)]",
    purple: "from-[var(--ds-color-feedback-info-bg)]",
    blue: "from-[var(--ds-color-feedback-info-bg)]",
    indigo: "from-[var(--ds-color-brand-primary-subtle)]"
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "bg-[var(--ds-color-surface-default)] rounded-[var(--ds-radius-xl)] p-4 border border-[var(--ds-color-border-default)] shadow-lg border-l-4",
        borderColors[color]
      )}
    >
      <div className={cn("h-16 w-full mb-4 rounded-[var(--ds-radius-lg)] bg-linear-to-r to-transparent flex items-center px-4", bgColors[color])}>
        <h3 className="text-xl font-medium text-[var(--ds-color-text-primary)] m-0">{name}</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-xs uppercase tracking-wider text-[var(--ds-color-feedback-success-text)] font-medium mb-2">Strengths</h4>
          <ul className="space-y-2">
            {pros.map((pro, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--ds-color-text-secondary)]">
                <Check className="w-4 h-4 text-[var(--ds-color-feedback-success-text)] mt-0.5 shrink-0" />
                {pro}
              </li>
            ))}
          </ul>
        </div>
        
        <div className="border-t border-[var(--ds-color-border-default)] pt-4">
          <h4 className="text-xs uppercase tracking-wider text-[var(--ds-color-feedback-error-text)] font-medium mb-2">Weaknesses</h4>
          <ul className="space-y-2">
            {cons.map((con, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--ds-color-text-secondary)]">
                <X className="w-4 h-4 text-[var(--ds-color-feedback-error-text)] mt-0.5 shrink-0" />
                {con}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
