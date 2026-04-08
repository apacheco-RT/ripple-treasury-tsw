// @tsw-template — prototype page layout
import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { Bug, ArrowUpDown, ShieldAlert, Table2, Columns3, Filter, HelpCircle, BookmarkCheck, RotateCw, Trash2, ListFilter } from "lucide-react";
import { screenColor, SeverityBadge, FeasBadge } from "./research-data";
import { useLazyData } from "@/hooks/useLazyData";

const reqIcons: Record<string, { icon: ReactNode; iconBg: string }> = {
  "REQ-01": { icon: <ArrowUpDown className="w-4 h-4 text-[var(--ds-color-feedback-error-text)]" />, iconBg: "bg-[var(--ds-color-feedback-error-bg)]" },
  "REQ-02": { icon: <ShieldAlert className="w-4 h-4 text-[var(--ds-color-feedback-warning-text)]" />, iconBg: "bg-[var(--ds-color-feedback-warning-bg)]" },
  "REQ-03": { icon: <Table2 className="w-4 h-4 text-[var(--ds-color-brand-primary)]" />, iconBg: "bg-[var(--ds-color-brand-primary-subtle)]" },
  "REQ-04": { icon: <ShieldAlert className="w-4 h-4 text-[var(--ds-color-feedback-error-text)]" />, iconBg: "bg-[var(--ds-color-feedback-error-bg)]" },
  "REQ-05": { icon: <Columns3 className="w-4 h-4 text-[var(--ds-color-text-secondary)]" />, iconBg: "bg-[var(--ds-color-surface-raised)]/30" },
  "REQ-06": { icon: <ArrowUpDown className="w-4 h-4 text-[var(--ds-color-text-secondary)]" />, iconBg: "bg-[var(--ds-color-surface-raised)]/30" },
  "REQ-07": { icon: <Filter className="w-4 h-4 text-[var(--ds-color-feedback-info-text)]" />, iconBg: "bg-[var(--ds-color-feedback-info-bg)]" },
  "REQ-08": { icon: <HelpCircle className="w-4 h-4 text-[var(--ds-color-text-secondary)]" />, iconBg: "bg-[var(--ds-color-surface-raised)]/30" },
  "REQ-09": { icon: <BookmarkCheck className="w-4 h-4 text-[var(--ds-color-brand-primary)]" />, iconBg: "bg-[var(--ds-color-brand-primary-subtle)]" },
  "REQ-10": { icon: <RotateCw className="w-4 h-4 text-[var(--ds-color-brand-primary)]" />, iconBg: "bg-[var(--ds-color-brand-primary-subtle)]" },
  "REQ-11": { icon: <Trash2 className="w-4 h-4 text-[var(--ds-color-feedback-error-text)]" />, iconBg: "bg-[var(--ds-color-feedback-error-bg)]" },
  "REQ-12": { icon: <Bug className="w-4 h-4 text-[var(--ds-color-feedback-error-text)]" />, iconBg: "bg-[var(--ds-color-feedback-error-bg)]" },
  "REQ-13": { icon: <ListFilter className="w-4 h-4 text-[var(--ds-color-feedback-info-text)]" />, iconBg: "bg-[var(--ds-color-feedback-info-bg)]" },
  "REQ-14": { icon: <ArrowUpDown className="w-4 h-4 text-[var(--ds-color-feedback-warning-text)]" />, iconBg: "bg-[var(--ds-color-feedback-warning-bg)]" },
  "REQ-15": { icon: <HelpCircle className="w-4 h-4 text-[var(--ds-color-text-secondary)]" />, iconBg: "bg-[var(--ds-color-surface-raised)]/30" },
};

interface ScreenLegendItem {
  label: string;
  color: string;
}

const screenLegend: ScreenLegendItem[] = [
  { label: "Filter screen", color: "bg-[var(--ds-color-feedback-info-bg)] border-[var(--ds-color-feedback-info-border)]/20 text-[var(--ds-color-feedback-info-text)]" },
  { label: "Results screen", color: "bg-[var(--ds-color-brand-primary-subtle)] border-[var(--ds-color-brand-primary)]/20 text-[var(--ds-color-brand-primary)]" },
  { label: "Both screens", color: "bg-[var(--ds-color-feedback-info-bg)] border-[var(--ds-color-feedback-info-border)]/20 text-[var(--ds-color-feedback-info-text)]" },
  { label: "Bug / Defect", color: "bg-[var(--ds-color-feedback-error-bg)] border-[var(--ds-color-feedback-error-border)]/20 text-[var(--ds-color-feedback-error-text)]" },
];

export function RequirementsSection() {
  const requirements = useLazyData(() => import("@/data/report-data").then(m => m.requirements));

  if (!requirements) return null;

  return (
    <section className="py-12 border-t border-[var(--ds-color-border-default)]">
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-xl font-medium text-[var(--ds-color-text-primary)] mb-2 flex items-center gap-3">
            <span className="w-8 h-8 rounded-full bg-[var(--ds-color-feedback-warning-bg)] border border-[var(--ds-color-feedback-warning-border)]/25 text-[var(--ds-color-feedback-warning-text)] text-sm font-bold flex items-center justify-center">D</span>
            Design Requirements &amp; Changes
          </h2>
          <p className="text-[var(--ds-color-text-secondary)] text-sm mb-8">
            15 functional requirements derived from the heuristic evaluation and customer feedback. Each maps to a screen, a source finding, and a concrete design change.
          </p>

          <div className="flex flex-wrap gap-2 mb-8">
            {screenLegend.map((l) => (
              <span key={l.label} className={`text-xs font-bold px-2.5 py-1 rounded-[var(--ds-radius-lg)] border ${l.color}`}>{l.label}</span>
            ))}
          </div>

          <div className="space-y-4">
            {requirements.map((req, i) => {
              const icons = reqIcons[req.id] || { icon: null, iconBg: "bg-[var(--ds-color-surface-raised)]/30" };
              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-[var(--ds-color-surface-default)] rounded-[var(--ds-radius-xl)] border border-[var(--ds-color-border-default)] overflow-hidden hover:border-[var(--ds-color-border-default)] transition-colors"
                >
                  <div className="flex items-start gap-4 p-4 border-b border-[var(--ds-color-border-default)]">
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="w-14 h-8 rounded-[var(--ds-radius-lg)] bg-[var(--ds-color-surface-default)] border border-[var(--ds-color-border-default)] flex items-center justify-center">
                        <span className="text-xs font-extrabold text-[var(--ds-color-text-secondary)] font-mono">{req.id}</span>
                      </div>
                      <div className={`w-8 h-8 rounded-[var(--ds-radius-lg)] flex items-center justify-center shrink-0 ${icons.iconBg}`}>
                        {icons.icon}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-[var(--ds-radius-lg)] border ${screenColor(req.screen)}`}>{req.screen}</span>
                        <SeverityBadge level={req.severity} />
                        <FeasBadge level={req.effort} />
                        {req.isBug && (
                          <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-[var(--ds-radius-lg)] border bg-[var(--ds-color-feedback-error-bg)] border-[var(--ds-color-feedback-error-border)]/25 text-[var(--ds-color-feedback-error-text)]">
                            <Bug className="w-3 h-3" /> Defect
                          </span>
                        )}
                        <span className="text-xs text-[var(--ds-color-text-secondary)] font-mono">{req.source}</span>
                      </div>
                      <p className="text-sm font-medium text-[var(--ds-color-text-primary)] leading-snug">{req.title}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-surface-border">
                    <div className="p-4">
                      <p className="text-xs uppercase tracking-widest text-[var(--ds-color-text-secondary)] font-medium mb-2">Requirement</p>
                      <p className="text-xs text-[var(--ds-color-text-secondary)] leading-relaxed">{req.requirement}</p>
                    </div>
                    <div className="p-4">
                      <p className="text-xs uppercase tracking-widest text-[var(--ds-color-brand-primary)] font-medium mb-2">Design Change</p>
                      <p className="text-xs text-[var(--ds-color-text-secondary)] leading-relaxed">{req.designChange}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
