// @tsw-template — prototype page layout
import { motion } from "framer-motion";
import { Target } from "lucide-react";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export function HeroSection() {
  return (
    <section id="overview" className="pt-32 pb-20 relative overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-[500px] bg-linear-to-b from-[var(--ds-color-feedback-info-bg)] to-transparent pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={staggerContainer}
          className="max-w-4xl mx-auto text-center"
        >
          <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--ds-color-feedback-info-bg)] border border-[var(--ds-color-feedback-info-border)]/20 text-[var(--ds-color-feedback-info-text)] text-sm font-medium mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--ds-color-feedback-info-text)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--ds-color-feedback-info-border)]"></span>
            </span>
            Internal Strategy Document
          </motion.div>
          
          <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-medium tracking-tight mb-8">
            Treasury Management <span className="text-gradient">2.0</span>
          </motion.h1>
          
          <motion.p variants={fadeInUp} className="text-xl text-[var(--ds-color-text-secondary)] max-w-2xl mx-auto mb-12">
            A unified platform strategy to revolutionize how global finance teams manage liquidity, risk, and operations.
          </motion.p>
          
          <motion.div variants={fadeInUp} className="bg-[var(--ds-color-surface-default)] border border-[var(--ds-color-border-default)] rounded-[var(--ds-radius-xl)] p-6 text-left shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <Target className="w-32 h-32 text-[var(--ds-color-feedback-info-text)]" />
            </div>

            <h3 className="text-[var(--ds-color-feedback-info-text)] font-medium uppercase tracking-wider text-sm mb-4">The Challenge</h3>
            <p className="text-lg text-[var(--ds-color-text-secondary)] leading-relaxed relative z-10">
              Current treasury operations are fragmented across 12+ legacy systems, resulting in <span className="text-[var(--ds-color-text-primary)] font-bold">48h data latency</span> and <span className="text-[var(--ds-color-text-primary)] font-bold">manual reconciliation overhead</span>. We need a single source of truth.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
