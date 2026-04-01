import React from "react";
import { Clock, ArrowRight, ShieldAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FlaggedTxn } from "@/lib/types";
import { displayScore, scoreColors, isAnomaly } from "@/lib/mock-data";

export function getRiskColors(risk: number) {
  const hi = risk >= 70;
  const md = risk >= 40;
  return {
    border: hi ? "border-[var(--ds-color-feedback-error-border)]"   : md ? "border-[var(--ds-color-feedback-warning-border)]"   : "border-[var(--ds-color-feedback-success-border)]",
    text:   hi ? "text-[var(--ds-color-feedback-error-text)]"       : md ? "text-[var(--ds-color-feedback-warning-text)]"       : "text-[var(--ds-color-feedback-success-text)]",
    reason: hi ? "text-[var(--ds-color-feedback-error-text)]"       : md ? "text-[var(--ds-color-feedback-warning-text)]"       : "text-[var(--ds-color-feedback-success-text)]",
    bg:     hi ? "bg-[var(--ds-color-feedback-error-bg)]"           : md ? "bg-[var(--ds-color-feedback-warning-bg)]"           : "bg-[var(--ds-color-feedback-success-bg)]",
    label: hi ? "HIGH" as const : md ? "MED" as const : "LOW" as const,
    isHigh: hi,
  };
}

interface StatusBadgeProps {
  variant: "status";
  status: string;
  next: string;
  overdue: boolean;
  className?: string;
}

interface FraudBadgeProps {
  variant: "fraud";
  risk: number;
  reason: string | null;
  className?: string;
}

interface RiskScoreBadgeProps {
  variant: "riskScore";
  txn: FlaggedTxn;
  size?: "sm" | "lg";
  className?: string;
}

type BadgeProps = StatusBadgeProps | FraudBadgeProps | RiskScoreBadgeProps;

function StatusBadgeContent({ status, next, overdue, className }: Omit<StatusBadgeProps, "variant">) {
  const s = status;
  const cls =
    overdue                      ? "bg-[var(--ds-color-feedback-error-bg)] border-[var(--ds-color-feedback-error-border)] text-[var(--ds-color-feedback-error-text)]"
    : s === "Under Review"     ? "bg-orange-500/20 border-orange-500/35 text-orange-300"
    : s === "Needs Approval"   ? "bg-[var(--ds-color-feedback-warning-bg)] border-[var(--ds-color-feedback-warning-border)] text-[var(--ds-color-feedback-warning-text)]"
    : s === "Ready to Approve" ? "bg-purple-500/20 border-purple-500/35 text-purple-300"
    : s === "Ready to Extract" ? "bg-[var(--ds-color-brand-primary-subtle)] border-[var(--ds-color-brand-primary)] text-[var(--ds-color-brand-primary)]"
    : s === "Extracted"        ? "bg-[var(--ds-color-feedback-info-bg)] border-[var(--ds-color-feedback-info-border)] text-[var(--ds-color-feedback-info-text)]"
    : s === "Confirmed"        ? "bg-indigo-500/20 border-indigo-500/35 text-indigo-300"
    : s === "Processing"       ? "bg-sky-500/20 border-sky-500/35 text-sky-300"
    : s === "Approved"         ? "bg-[var(--ds-color-feedback-success-bg)] border-[var(--ds-color-feedback-success-border)] text-[var(--ds-color-feedback-success-text)]"
    : s === "Failed"           ? "bg-red-500/20 border-red-500/35 text-red-300"
    : s === "Void"             ? "bg-[var(--ds-color-surface-raised)]/50 border-[var(--ds-color-border-default)]/50 text-[var(--ds-color-text-secondary)]"
    : s === "Draft"            ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-300"
    :                            "bg-[var(--ds-color-surface-raised)]/30 border-[var(--ds-color-border-default)]/40 text-[var(--ds-color-text-secondary)]";
  return (
    <div className={cn("flex items-center gap-1 text-xs flex-wrap", className)}>
      <span className={`inline-flex items-center h-8 px-3 rounded-[var(--ds-radius-lg)] font-medium text-xs border ${cls}`}>
        {overdue && <Clock className="w-2.5 h-2.5 inline mr-1" aria-hidden="true" />}
        {status}
      </span>
      <ArrowRight className="w-2.5 h-2.5 text-[var(--ds-color-text-secondary)]" aria-hidden="true" />
      <span className="text-[var(--ds-color-text-secondary)] text-xs">{next}</span>
    </div>
  );
}

function FraudBadgeContent({ risk, reason, className }: Omit<FraudBadgeProps, "variant">) {
  const c = getRiskColors(risk);
  return (
    <div className={className}>
      <div className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[var(--ds-radius-xs)] border-2 text-xs font-bold w-fit", c.text, c.bg, c.border)}
        aria-label={`Risk score ${risk} — ${c.label}`}>
        {c.isHigh ? <ShieldAlert className="w-2.5 h-2.5" aria-hidden="true" /> : <ShieldCheck className="w-2.5 h-2.5" aria-hidden="true" />}
        <span aria-hidden="true">{risk}</span> · {c.label}
      </div>
      {reason && <p className={cn("text-xs mt-0.5 max-w-[140px] leading-tight", c.reason)}>{reason}</p>}
    </div>
  );
}

function RiskScoreBadgeContent({ txn, size = "sm", className }: Omit<RiskScoreBadgeProps, "variant">) {
  const anomalyOnly = !txn.riskFactors.some(f => !isAnomaly(f));
  const score = displayScore(txn);
  const c = scoreColors(score, anomalyOnly);
  const lg = size === "lg";
  return (
    <div className={cn("shrink-0 flex flex-col", className)}>
      <div className="flex items-center gap-1.5">
        <div className={cn("rounded-full shrink-0", c.dot, lg ? "w-2.5 h-2.5" : "w-2 h-2")} />
        <span className={cn("font-bold tabular-nums", c.text, lg ? "text-2xl" : "text-sm")}>{score}</span>
        <span className={cn("text-[var(--ds-color-text-secondary)]", lg ? "text-sm" : "text-xs")}>/100</span>
      </div>
      <span className={cn("font-bold", c.text, lg ? "text-xs mt-0.5" : "text-xs")}>{c.label}</span>
    </div>
  );
}

function BadgeInner(props: BadgeProps) {
  switch (props.variant) {
    case "status":
      return <StatusBadgeContent status={props.status} next={props.next} overdue={props.overdue} className={props.className} />;
    case "fraud":
      return <FraudBadgeContent risk={props.risk} reason={props.reason} className={props.className} />;
    case "riskScore":
      return <RiskScoreBadgeContent txn={props.txn} size={props.size} className={props.className} />;
  }
}

export const Badge = React.memo(BadgeInner);
