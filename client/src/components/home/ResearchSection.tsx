import { motion } from "framer-motion";
import { Users, Globe } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { CompetitorCard } from "@/components/CompetitorCard";

export function ResearchSection() {
  return (
    <section id="research" className="py-20 border-t border-[var(--ds-color-border-default)]/50 bg-[var(--ds-color-surface-page)]">
      <div className="container mx-auto px-6">
        <SectionHeader 
          icon={<Users className="w-8 h-8" />}
          title="Research Insights"
          subtitle="Synthesized from 25+ stakeholder interviews across London, New York, and Singapore offices."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-[var(--ds-color-surface-default)] rounded-[var(--ds-radius-xl)] border border-[var(--ds-color-border-default)] overflow-hidden shadow-lg"
          >
            <div className="px-6 py-4 border-b border-[var(--ds-color-feedback-info-border)]/30 bg-[var(--ds-color-surface-default)]">
              <h3 className="text-white font-medium m-0">Key Personas</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[var(--ds-color-border-default)]">
                    <th className="p-4 text-xs uppercase text-[var(--ds-color-text-secondary)] font-bold w-1/3">Role</th>
                    <th className="p-4 text-xs uppercase text-[var(--ds-color-text-secondary)] font-bold">Primary Pain Point</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-border">
                  <tr className="hover:bg-[var(--ds-color-surface-raised)]/30 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-white">Cash Manager</div>
                      <div className="text-xs text-[var(--ds-color-text-secondary)]">Daily Ops</div>
                    </td>
                    <td className="p-4 text-sm text-[var(--ds-color-text-secondary)]">
                      "I spend 4 hours daily just logging into different bank portals to scrape CSVs."
                    </td>
                  </tr>
                  <tr className="hover:bg-[var(--ds-color-surface-raised)]/30 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-white">Risk Analyst</div>
                      <div className="text-xs text-[var(--ds-color-text-secondary)]">Strategic</div>
                    </td>
                    <td className="p-4 text-sm text-[var(--ds-color-text-secondary)]">
                      "FX exposure data is stale by the time I get it. I'm hedging based on yesterday's news."
                    </td>
                  </tr>
                  <tr className="hover:bg-[var(--ds-color-surface-raised)]/30 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-white">CFO</div>
                      <div className="text-xs text-[var(--ds-color-text-secondary)]">Executive</div>
                    </td>
                    <td className="p-4 text-sm text-[var(--ds-color-text-secondary)]">
                      "I can't see our global liquidity position in one view. It's a blind spot."
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <div className="relative">
              <div className="absolute -top-6 -left-6 text-6xl text-[var(--ds-color-feedback-info-border)] font-serif opacity-50">"</div>
              <blockquote className="text-2xl font-light text-[var(--ds-color-text-secondary)] italic leading-relaxed z-10 relative">
                The biggest risk isn't market volatility; it's our inability to see the volatility until it's too late.
              </blockquote>
              <div className="mt-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[var(--ds-color-surface-raised)] overflow-hidden">
                  <div className="w-full h-full bg-linear-to-tr from-[var(--ds-color-feedback-info-border)] to-[var(--ds-color-feedback-info-text)] flex items-center justify-center text-white font-bold">SJ</div>
                </div>
                <div>
                  <div className="text-white font-medium">Sarah Jenkins</div>
                  <div className="text-sm text-[var(--ds-color-feedback-info-text)]">Head of Global Treasury</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <h3 className="text-xl font-medium text-white mb-8 flex items-center gap-3">
          <Globe className="text-[var(--ds-color-brand-primary)]" />
          Competitive Landscape
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CompetitorCard 
            name="Modern Treasury" 
            color="teal"
            pros={["API-first architecture", "Excellent developer docs", "Real-time payments"]}
            cons={["Limited forecasting tools", "US-centric banking coverage"]}
          />
          <CompetitorCard 
            name="Kyriba" 
            color="purple"
            pros={["Comprehensive features", "Strong enterprise reputation", "Global coverage"]}
            cons={["Dated UX/UI", "High implementation cost", "Slow performance"]}
          />
          <CompetitorCard 
            name="FIS Integrity" 
            color="blue"
            pros={["Deep banking integration", "Robust risk modules", "Audit trail"]}
            cons={["Complex workflows", "Steep learning curve", "Legacy codebase"]}
          />
        </div>
      </div>
    </section>
  );
}
