import { Link } from "wouter";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileSearch, BookOpen, Layers, ArrowRight,
  AlertTriangle, AlertCircle, Info, CheckCircle2,
  Settings2
} from "lucide-react";
import { UnifiedNav } from "@/components/UnifiedNav";
import { ConfigurePrototypeModal } from "@/components/ConfigurePrototypeModal";

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const stats = [
  { value: "10", label: "Heuristic Findings", icon: <FileSearch className="w-4 h-4" />, color: "text-blue-400" },
  { value: "7", label: "Backlog Items", icon: <BookOpen className="w-4 h-4" />, color: "text-teal-400" },
  { value: "6", label: "HIGH Severity", icon: <AlertTriangle className="w-4 h-4" />, color: "text-rose-400" },
  { value: "3", label: "MEDIUM Severity", icon: <AlertCircle className="w-4 h-4" />, color: "text-amber-400" },
  { value: "1", label: "LOW Severity", icon: <Info className="w-4 h-4" />, color: "text-emerald-400" },
];

const deliverables = [
  {
    href: "/research",
    icon: <FileSearch className="w-8 h-8" />,
    accent: "from-blue-600 to-blue-800",
    border: "border-blue-500/30 hover:border-blue-400/50",
    glow: "hover:shadow-blue-500/10",
    badge: "10 findings",
    badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/25",
    title: "Research Report",
    subtitle: "Heuristic evaluation + customer backlog synthesis",
    bullets: [
      "Nielsen's 10 heuristics applied to both screens",
      "7 customer-reported enhancement requests",
      "Combined priority matrix: impact × feasibility",
    ],
  },
  {
    href: "/specs",
    icon: <BookOpen className="w-8 h-8" />,
    accent: "from-teal-600 to-teal-800",
    border: "border-teal-500/30 hover:border-teal-400/50",
    glow: "hover:shadow-teal-500/10",
    badge: "P1–P10 specs",
    badgeColor: "bg-teal-500/15 text-teal-400 border-teal-500/25",
    title: "Annotated Specs",
    subtitle: "10 prioritised design recommendations with feasibility ratings",
    bullets: [
      "Problem statement + proposed solution per finding",
      "Ripple design tokens + component references",
      "Acceptance criteria for each recommendation",
    ],
  },
  {
    href: "/prototype",
    icon: <Layers className="w-8 h-8" />,
    accent: "from-purple-600 to-purple-800",
    border: "border-purple-500/30 hover:border-purple-400/50",
    glow: "hover:shadow-purple-500/10",
    badge: "Interactive",
    badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/25",
    title: "Interactive Prototype",
    subtitle: "Redesigned Transaction Status Workflow in React",
    bullets: [
      "Filter screen — quick-selects, clear-all, presets",
      "Results screen — fraud badges, pipeline chips, triage",
      "Bulk approval with fraud-awareness confirmation",
    ],
  },
];

const severityMap = [
  { label: "HIGH", count: 6, icon: <AlertTriangle className="w-3.5 h-3.5" />, bg: "bg-rose-500/10", border: "border-rose-500/20", text: "text-rose-400", bar: "bg-rose-500" },
  { label: "MEDIUM", count: 3, icon: <AlertCircle className="w-3.5 h-3.5" />, bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", bar: "bg-amber-500" },
  { label: "LOW", count: 1, icon: <Info className="w-3.5 h-3.5" />, bg: "bg-emerald-500/10", border: "border-emerald-500/20", text: "text-emerald-400", bar: "bg-emerald-500" },
];

export default function Landing() {
  const [showConfigModal, setShowConfigModal] = useState(false);

  return (
    <div className="min-h-screen bg-surface-page">
      <UnifiedNav />

      <main id="main-content">
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-blue-600/8 rounded-(--m3-shape-full) blur-3xl" />
          <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-teal-600/8 rounded-(--m3-shape-full) blur-3xl" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="max-w-3xl mx-auto text-center"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-(--m3-shape-full) bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-bold uppercase tracking-widest mb-6">
              PAYM · Transaction Status Workflow
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl font-medium tracking-tight mb-4 leading-tight">
              UX Audit &{" "}
              <span className="text-gradient">Redesign</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg text-slate-400 mb-10 max-w-xl mx-auto">
              Full heuristic evaluation, annotated specifications, and an interactive prototype
              — built on Ripple Treasury's design system, ready for React.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap justify-center gap-3 mb-12">
              {stats.map((s, i) => (
                <div key={i} className="flex items-center gap-2 px-(--m3-card-padding) py-2 rounded-(--m3-shape-sm) bg-surface-card border border-slate-800 text-sm">
                  <span className={s.color}>{s.icon}</span>
                  <span className="font-bold text-white">{s.value}</span>
                  <span className="text-slate-400">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="max-w-lg mx-auto mb-16 bg-surface-card rounded-(--m3-shape-md) border border-slate-800 p-(--m3-card-padding)"
          >
            <p className="text-xs uppercase tracking-widest text-slate-400 font-medium mb-4 text-center">Finding Severity Distribution</p>
            <div className="space-y-3">
              {severityMap.map((s) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-(--m3-shape-sm) text-xs font-bold border ${s.bg} ${s.border} ${s.text} w-24 shrink-0`}>
                    {s.icon} {s.label}
                  </div>
                  <div className="flex-1 h-2 rounded-(--m3-shape-full) bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-(--m3-shape-full) ${s.bar}`}
                      style={{ width: `${(s.count / 10) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-bold text-slate-300 w-4 text-right">{s.count}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto"
          >
            {deliverables.map((d, i) => {
              const isPrototype = d.href === "/prototype";
              const cardContent = (
                <div className={`group relative bg-surface-card rounded-(--m3-shape-md) border ${d.border} p-(--m3-dialog-padding) cursor-pointer transition-all duration-300 hover:shadow-xl ${d.glow} h-full flex flex-col`}>
                  <div className={`absolute top-0 left-0 right-0 h-1 rounded-t-(--m3-shape-md) bg-linear-to-r ${d.accent} opacity-70 group-hover:opacity-100 transition-opacity`} />
                  <div className={`w-14 h-14 rounded-(--m3-shape-md) bg-linear-to-br ${d.accent} flex items-center justify-center text-white mb-4 shadow-lg opacity-80 group-hover:opacity-100 transition-opacity`}>
                    {d.icon}
                  </div>
                  <div className={`inline-flex items-center self-start px-2.5 py-0.5 rounded-(--m3-shape-full) text-xs font-bold border mb-2 ${d.badgeColor}`}>
                    {d.badge}
                  </div>
                  <h2 className="text-xl font-medium text-white mb-1 tracking-tight m-0">{d.title}</h2>
                  <p className="text-sm text-slate-400 mb-5 leading-relaxed">{d.subtitle}</p>
                  <ul className="space-y-2 flex-1">
                    {d.bullets.map((b, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-slate-400">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        {b}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-1 mt-6 text-sm font-medium text-slate-400 group-hover:text-white transition-colors">
                    {isPrototype ? (
                      <>
                        <Settings2 className="w-4 h-4 mr-0.5" />
                        Configure Prototype
                      </>
                    ) : (
                      <>
                        View {d.title}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </div>
              );

              return (
                <motion.div key={i} variants={fadeInUp}>
                  {isPrototype ? (
                    <button
                      type="button"
                      onClick={() => setShowConfigModal(true)}
                      className="w-full text-left appearance-none bg-transparent border-0 p-0 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 rounded-(--m3-shape-md)"
                    >
                      {cardContent}
                    </button>
                  ) : (
                    <Link href={d.href}>
                      {cardContent}
                    </Link>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <section className="py-10 border-t border-surface-border">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <p className="text-slate-400 text-sm">
            <span className="text-slate-400 font-medium">Persona focus:</span> Treasury Payment Approver &nbsp;·&nbsp;
            <span className="text-slate-400 font-medium">Method:</span> Nielsen's 10 Heuristics + customer backlog synthesis &nbsp;·&nbsp;
            <span className="text-slate-400 font-medium">Tech stack:</span> React + Ripple Treasury design system &nbsp;·&nbsp;
            <span className="text-slate-400 font-medium">Feb 2026</span>
          </p>
        </div>
      </section>

      </main>

      <footer className="py-6 border-t border-slate-800 bg-surface-deep text-center">
        <p className="text-slate-400 text-xs">
          PAYM — Transaction Status Workflow UX Audit &nbsp;·&nbsp; Ripple Treasury Product Design &nbsp;·&nbsp; Confidential
        </p>
      </footer>

      <ConfigurePrototypeModal
        open={showConfigModal}
        onClose={() => setShowConfigModal(false)}
      />
    </div>
  );
}
