import React from "react";
import { Clock, ArrowRight, ShieldAlert, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FlaggedTxn } from "@/lib/types";
import { displayScore, scoreColors, isAnomaly } from "@/lib/mock-data";

export function getRiskColors(risk: number) {
  const hi = risk >= 70;
  const md = risk >= 40;
  return {
    border: hi ? "border-rose-600" : md ? "border-amber-500" : "border-emerald-600",
    text: hi ? "text-rose-400" : md ? "text-amber-400" : "text-emerald-400",
    reason: hi ? "text-rose-300" : md ? "text-amber-300" : "text-emerald-300",
    bg: hi ? "bg-rose-500/10" : md ? "bg-amber-500/10" : "bg-emerald-500/10",
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
    overdue                      ? "bg-rose-500/20 border-rose-500/40 text-rose-300"
    : s === "Under Review"     ? "bg-orange-500/20 border-orange-500/35 text-orange-300"
    : s === "Needs Approval"   ? "bg-amber-500/20 border-amber-500/35 text-amber-300"
    : s === "Ready to Approve" ? "bg-purple-500/20 border-purple-500/35 text-purple-300"
    : s === "Ready to Extract" ? "bg-teal-500/20 border-teal-500/35 text-teal-300"
    : s === "Extracted"        ? "bg-blue-500/20 border-blue-500/35 text-blue-300"
    : s === "Confirmed"        ? "bg-indigo-500/20 border-indigo-500/35 text-indigo-300"
    : s === "Processing"       ? "bg-sky-500/20 border-sky-500/35 text-sky-300"
    : s === "Approved"         ? "bg-emerald-500/20 border-emerald-500/35 text-emerald-300"
    : s === "Failed"           ? "bg-red-500/20 border-red-500/35 text-red-300"
    : s === "Void"             ? "bg-surface-elevated/50 border-surface-border/50 text-slate-400"
    : s === "Draft"            ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-300"
    :                            "bg-surface-elevated/30 border-surface-border/40 text-slate-300";
  return (
    <div className={cn("flex items-center gap-1 text-xs flex-wrap", className)}>
      <span className={`inline-flex items-center h-(--m3-chip-height) px-3 rounded-(--m3-shape-sm) font-medium text-xs border ${cls}`}>
        {overdue && <Clock className="w-2.5 h-2.5 inline mr-1" aria-hidden="true" />}
        {status}
      </span>
      <ArrowRight className="w-2.5 h-2.5 text-slate-400" aria-hidden="true" />
      <span className="text-slate-300 text-xs">{next}</span>
    </div>
  );
}

function FraudBadgeContent({ risk, reason, className }: Omit<FraudBadgeProps, "variant">) {
  const c = getRiskColors(risk);
  return (
    <div className={className}>
      <div className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded-(--m3-shape-xs) border-2 text-xs font-bold w-fit", c.text, c.bg, c.border)}
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
        <div className={cn("rounded-(--m3-shape-full) shrink-0", c.dot, lg ? "w-2.5 h-2.5" : "w-2 h-2")} />
        <span className={cn("font-bold tabular-nums", c.text, lg ? "text-2xl" : "text-sm")}>{score}</span>
        <span className={cn("text-slate-400", lg ? "text-sm" : "text-xs")}>/100</span>
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
