import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { Zap, BarChart, Shield, Send } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";

interface Principle {
  title: string;
  desc: string;
  icon: ReactNode;
}

interface Differentiator {
  title: string;
  val: string;
}

const principles: Principle[] = [
  { title: "Data Visualization First", desc: "Numbers tell a story. We lead with charts and trends, not just grids of data.", icon: <BarChart className="w-5 h-5" /> },
  { title: "Exception-Based Workflows", desc: "Don't show everything. Only highlight what needs attention or approval.", icon: <Shield className="w-5 h-5" /> },
  { title: "Actionable Insights", desc: "Every data point should lead to a clear next action or decision.", icon: <Send className="w-5 h-5" /> },
];

const differentiators: Differentiator[] = [
  { title: "Unified Data Layer", val: "Aggregates 45+ bank APIs into one schema" },
  { title: "Predictive AI", val: "Forecasts cash flow with 94% accuracy" },
  { title: "Zero-Code Rules", val: "Automated sweeping rules via drag-and-drop" },
  { title: "Real-Time Netting", val: "Inter-company settlement in minutes, not days" },
];

export function StrategySection() {
  return (
    <section id="strategy" className="py-20 relative overflow-hidden">
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-[var(--m3-shape-full)] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-teal-600/5 rounded-[var(--m3-shape-full)] blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <SectionHeader 
          icon={<Zap className="w-8 h-8" />}
          title="Design Strategy"
          subtitle="Our approach combines the speed of consumer fintech with the robustness of enterprise banking."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          <div>
            <h3 className="text-xl font-medium text-white mb-6">Core Principles</h3>
            <div className="space-y-6">
              {principles.map((item, i) => (
                <motion.div 
                  key={i}
                  whileHover={{ x: 5 }}
                  className="flex gap-4 p-[var(--m3-card-padding)] rounded-[var(--m3-shape-md)] hover:bg-[var(--m3-state-hover)] transition-colors border border-transparent hover:border-white/5"
                >
                  <div className="glow-point shrink-0">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1 flex items-center gap-2">
                      {item.title}
                    </h4>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-surface-card to-surface-inset p-1 rounded-[var(--m3-shape-lg)]">
            <div className="bg-surface-inset rounded-[var(--m3-shape-md)] h-full p-[var(--m3-dialog-padding)] border border-slate-800">
              <h3 className="text-xl font-medium text-white mb-6">Key Differentiators</h3>
              <div className="grid grid-cols-1 gap-4">
                {differentiators.map((diff, i) => (
                  <div key={i} className="flex items-center justify-between p-[var(--m3-card-padding)] bg-surface-card rounded-[var(--m3-shape-sm)] border border-slate-800/50">
                    <span className="font-medium text-blue-300">{diff.title}</span>
                    <span className="text-sm text-slate-400 text-right max-w-[200px]">{diff.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
