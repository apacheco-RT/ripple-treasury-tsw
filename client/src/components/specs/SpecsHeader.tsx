import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { fadeInUp } from "./specs-data";

interface LegendItem {
  label: string;
  desc: string;
}

const legendItems: LegendItem[] = [
  { label: "Rank", desc: "P1 = highest priority" },
  { label: "Severity", desc: "HIGH / MEDIUM / LOW — impact of the UX issue" },
  { label: "Effort", desc: "LOW / MED / HIGH — implementation effort in React rebuild" },
  { label: "Heuristic", desc: "Nielsen heuristic(s) violated" },
];

export function SpecsHeader() {
  return (
    <section className="pt-28 pb-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/3 w-[400px] h-[300px] bg-teal-600/8 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-6 relative z-10 max-w-5xl">
        <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } }}>
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-widest mb-4">
            <BookOpen className="w-3.5 h-3.5" /> Annotated Specs
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-medium tracking-tight mb-3 text-white">
            Design Specifications
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-[var(--ds-color-text-secondary)] text-lg max-w-2xl mb-6">
            10 prioritised recommendations — each with a problem statement, proposed solution,
            Ripple design tokens, and testable acceptance criteria.
          </motion.p>
          <motion.div variants={fadeInUp} className="bg-[var(--ds-color-surface-raised)]/40 border border-[var(--ds-color-border-default)] rounded-[var(--ds-radius-xl)] p-4 max-w-4xl mb-10">
            <p className="text-sm text-[var(--ds-color-text-secondary)] leading-relaxed m-0">The redesign addresses the approval experience across three priority tiers. The six high-priority changes overhaul the core workflow by surfacing urgent transactions first, embedding fraud scores and status indicators directly in the queue, adding a safeguard for risky bulk actions, and restructuring the table to actively guide approvers rather than just display data. The three medium-priority changes reduce everyday friction through better filtering, clearer language, and saved views. A final lower-priority addition rounds things out by improving onboarding through tooltips and helpful empty states.</p>
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-wrap gap-3 text-xs">
            {legendItems.map((l, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-[var(--ds-radius-lg)] bg-[var(--ds-color-surface-default)] border border-[var(--ds-color-border-default)] text-[var(--ds-color-text-secondary)]">
                <span className="font-bold text-[var(--ds-color-text-secondary)]">{l.label}:</span> {l.desc}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
