import { motion } from "framer-motion";
import { Terminal, Layers, PieChart, Wallet } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";

const phases = [
  {
    phase: "Phase 1: Foundation",
    time: "Q3 2024",
    items: ["Bank API Integration Layer", "Cash Position Dashboard", "User Role Management"],
    status: "completed",
    icon: <Layers className="w-5 h-5 text-white" />
  },
  {
    phase: "Phase 2: Intelligence",
    time: "Q4 2024",
    items: ["Cash Flow Forecasting", "FX Hedging Recommendations", "Automated Reporting"],
    status: "active",
    icon: <PieChart className="w-5 h-5 text-white" />
  },
  {
    phase: "Phase 3: Automation",
    time: "Q1 2025",
    items: ["Smart Payment Routing", "Inter-company Netting Engine", "Virtual Account Management"],
    status: "future",
    icon: <Wallet className="w-5 h-5 text-white" />
  }
];

export function RoadmapSection() {
  return (
    <section id="roadmap" className="py-20 bg-[var(--ds-color-surface-page)] border-t border-[var(--ds-color-border-default)]/50">
      <div className="container mx-auto px-6">
        <SectionHeader 
          icon={<Terminal className="w-8 h-8" />}
          title="Execution Roadmap"
          subtitle="Phased rollout strategy to minimize operational disruption."
        />

        <div className="relative">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-linear-to-b from-blue-500 via-teal-500 to-[var(--ds-color-surface-raised)] md:left-1/2 md:-ml-px" />

          <div className="space-y-12">
            {phases.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative flex items-center justify-between md:justify-normal ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
              >
                <div className={`absolute left-6 md:left-1/2 w-4 h-4 rounded-full border-4 border-surface-section -ml-2 z-10 
                  ${item.status === 'completed' ? 'bg-emerald-500' : item.status === 'active' ? 'bg-blue-500 animate-pulse' : 'bg-[var(--ds-color-surface-raised)]'}`} 
                />

                <div className="hidden md:block w-1/2" />

                <div className={`w-[calc(100%-60px)] md:w-[calc(50%-40px)] ml-16 md:ml-0 ${i % 2 === 0 ? 'md:mr-10' : 'md:ml-10'}`}>
                  <div className="bg-[var(--ds-color-surface-default)] p-6 rounded-[var(--ds-radius-xl)] border border-[var(--ds-color-border-default)] shadow-lg relative group hover:border-blue-500/30 transition-colors">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-2 rounded-[var(--ds-radius-lg)] ${item.status === 'active' ? 'bg-blue-500/20' : 'bg-[var(--ds-color-surface-raised)]'}`}>
                        {item.icon}
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide
                        ${item.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 
                          item.status === 'active' ? 'bg-blue-500/10 text-blue-400' : 'bg-[var(--ds-color-surface-raised)]/50 text-[var(--ds-color-text-secondary)]'}`}>
                        {item.time}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-medium text-white mb-1">{item.phase}</h3>
                    <ul className="mt-4 space-y-2">
                      {item.items.map((sub, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm text-[var(--ds-color-text-secondary)]">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                          {sub}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
