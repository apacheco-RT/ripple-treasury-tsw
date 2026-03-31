import { motion } from "framer-motion";
import { SeverityBadge, FeasBadge, PriorityBadge, ChevronRight } from "./specs-data";
import type { specs } from "@/data/report-data";

export type Spec = (typeof specs)[number];

export function SpecCard({ spec, index }: { spec: Spec; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="bg-[var(--ds-color-surface-default)] rounded-[var(--ds-radius-xl)] border border-[var(--ds-color-border-default)] overflow-hidden"
    >
      <div className="flex items-start gap-4 p-4 border-b border-[var(--ds-color-border-default)]">
        <PriorityBadge rank={spec.rank} />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <SeverityBadge level={spec.severity} />
            <FeasBadge level={spec.effort} />
            <span className="text-xs px-2 py-0.5 rounded-[var(--ds-radius-lg)] bg-[var(--ds-color-surface-raised)] text-[var(--ds-color-text-secondary)] font-mono font-bold border border-[var(--ds-color-border-default)]">{spec.heuristic}</span>
          </div>
          <h3 className="text-xl font-medium text-white m-0 leading-snug">{spec.title}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-surface-border">
        <div className="p-4">
          <p className="text-xs uppercase tracking-widest text-rose-400 font-medium mb-2">⚠ Problem — Current State</p>
          <p className="text-sm text-[var(--ds-color-text-secondary)] leading-relaxed">{spec.problem}</p>
        </div>
        <div className="p-4">
          <p className="text-xs uppercase tracking-widest text-teal-400 font-medium mb-2">→ Solution — Proposed Design</p>
          <p className="text-sm text-[var(--ds-color-text-secondary)] leading-relaxed">{spec.solution}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-[var(--ds-color-border-default)]/60 border-t border-[var(--ds-color-border-default)]/60 bg-[var(--ds-color-surface-sunken)]/60">
        <div className="p-4">
          <p className="text-xs uppercase tracking-widest text-[var(--ds-color-text-secondary)] font-medium mb-2">Design Tokens & Components</p>
          <ul className="space-y-1">
            {spec.tokens.map((t, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-[var(--ds-color-text-secondary)]">
                <ChevronRight className="w-3 h-3 text-teal-500 shrink-0 mt-0.5" />
                <span className="font-mono">{t}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-4">
          <p className="text-xs uppercase tracking-widest text-[var(--ds-color-text-secondary)] font-medium mb-2">Acceptance Criteria</p>
          <ul className="space-y-1.5">
            {spec.criteria.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-[var(--ds-color-text-secondary)]">
                <span className="w-4 h-4 rounded-full bg-[var(--ds-color-surface-default)] border border-[var(--ds-color-border-default)] flex items-center justify-center text-[var(--ds-color-text-secondary)] shrink-0 mt-0.5 text-xs font-bold">{i + 1}</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}
