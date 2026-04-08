// @tsw-template — prototype page layout
import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { FileSearch, Monitor, Layers } from "lucide-react";
import { fadeInUp, stagger } from "./research-data";

interface ContextCard {
  icon: ReactNode;
  label: string;
  value: string;
  sub: string;
}

const contextCards: ContextCard[] = [
  { icon: <Monitor className="w-5 h-5 text-[var(--ds-color-feedback-info-text)]" />, label: "Screens Evaluated", value: "2", sub: "Screen 1: Filter form · Screen 2: Results table" },
  { icon: <FileSearch className="w-5 h-5 text-[var(--ds-color-brand-primary)]" />, label: "Method", value: "Heuristic", sub: "Nielsen's 10 usability heuristics, severity rated HIGH / MEDIUM / LOW" },
  { icon: <Layers className="w-5 h-5 text-[var(--ds-color-feedback-info-text)]" />, label: "Total Findings", value: "17", sub: "10 heuristic + 7 backlog items → 10 consolidated priority recommendations" },
];

export function ResearchHeader() {
  return (
    <section className="pt-28 pb-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-[var(--ds-color-feedback-info-bg)] rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--ds-color-feedback-info-bg)] border border-[var(--ds-color-feedback-info-border)]/20 text-[var(--ds-color-feedback-info-text)] text-xs font-bold uppercase tracking-widest mb-4">
            <FileSearch className="w-3.5 h-3.5" /> Research Report
          </motion.div>
          <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-medium tracking-tight mb-3 text-[var(--ds-color-text-primary)]">
            UX Research Findings
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-[var(--ds-color-text-secondary)] text-lg max-w-2xl mb-6">
            Nielsen's 10 heuristics applied to the Transaction Center, synthesised with
            7 customer-reported enhancement requests.
          </motion.p>
          <motion.div variants={fadeInUp} className="bg-[var(--ds-color-surface-raised)]/40 border border-[var(--ds-color-border-default)] rounded-[var(--ds-radius-xl)] p-4 max-w-4xl">
            <p className="text-sm text-[var(--ds-color-text-secondary)] leading-relaxed m-0">The current payment approval interface has critical usability and risk management gaps — it shows all 9,177 transactions the same way, with no way to prioritize by risk or urgency. A heuristic evaluation identified 17 findings (6 rated high severity) around missing fraud signals, information overload, and unsafe bulk approval workflows, which customer feedback corroborates. These findings have been distilled into 10 prioritized improvements: the first six redesign the core queue with smarter triage, risk visibility, and fraud prevention, while the last four focus on everyday friction like filtering, clearer labels, and saved views — all grounded in 15 traceable design requirements.</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10"
        >
          {contextCards.map((c, i) => (
            <div key={i} className="bg-[var(--ds-color-surface-default)] rounded-[var(--ds-radius-xl)] border border-[var(--ds-color-border-default)] p-4 flex items-start gap-4">
              <div className="mt-0.5">{c.icon}</div>
              <div>
                <p className="text-xs uppercase tracking-widest text-[var(--ds-color-text-secondary)] font-medium mb-0.5">{c.label}</p>
                <p className="text-xl font-bold text-[var(--ds-color-text-primary)] leading-none mb-1">{c.value}</p>
                <p className="text-xs text-[var(--ds-color-text-secondary)]">{c.sub}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
