// @ds-molecule — composed from DS atoms + TSW domain logic
import React from "react";
import { AlertTriangle, Ban, ShieldCheck, X } from "lucide-react";
import { MonoAmount, CurrencyBadge } from "@ds-foundation/react";
import { RiskScoreBadge } from "./RiskScoreBadge";
import { VerificationActions } from "./VerificationActions";
import { isAnomaly } from "@/lib/mock-data";
import type { FlaggedTxn, VerifAV, VerifKYB } from "@/lib/types";
import { fraudSpotlight } from "@/lib/design-tokens";

interface FlaggedItemDetailProps {
  txn: FlaggedTxn;
  avState: "idle" | "loading" | "done";
  kybState: "idle" | "loading" | "done";
  avSteps: { label: string; done: boolean }[];
  kybSteps: { label: string; done: boolean }[];
  avResult: VerifAV | undefined;
  kybResult: VerifKYB | undefined;
  onRunAV: (pn: string) => void;
  onRunKYB: (pn: string) => void;
  onAction: (id: string) => void;
  onOverride: (txn: FlaggedTxn) => void;
}

function FlaggedItemDetailInner({
  txn: selectedTxn, avState, kybState, avSteps, kybSteps,
  avResult, kybResult, onRunAV, onRunKYB, onAction, onOverride,
}: FlaggedItemDetailProps) {
  const ruleFactors = selectedTxn.riskFactors.filter(f => !isAnomaly(f));
  const anomFactors = selectedTxn.riskFactors.filter(f => isAnomaly(f));
  const anomalyOnly = ruleFactors.length === 0;
  const hasAnomalies = anomFactors.length > 0;

  const recCls = anomalyOnly
    ? "border-[var(--ds-color-feedback-info-border)] bg-[var(--ds-color-feedback-info-bg)] text-white"
    : selectedTxn.riskLevel === "critical" || selectedTxn.riskLevel === "high"
      ? "border-[var(--ds-color-feedback-error-border)] bg-[var(--ds-color-feedback-error-bg)] text-white"
      : selectedTxn.riskLevel === "medium"
        ? "border-[var(--ds-color-feedback-warning-border)] bg-[var(--ds-color-feedback-warning-bg)] text-white"
        : "border-[var(--ds-color-feedback-success-border)] bg-[var(--ds-color-feedback-success-bg)] text-white";

  return (
    <div className="p-4 flex flex-col gap-4 overflow-y-auto max-h-[360px]"
      role="region" aria-label="Transaction detail">

      <div className="flex items-start gap-4">
        <RiskScoreBadge txn={selectedTxn} size="lg" />
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white text-base leading-tight m-0">{selectedTxn.vendor}</h3>
          <p className="text-sm font-medium text-[var(--ds-color-text-primary)] mt-1 m-0">
            <span className="flex items-center gap-1.5">
              <MonoAmount value={selectedTxn.amount} currency={selectedTxn.currency as 'USD' | 'EUR' | 'GBP'} />
              <CurrencyBadge currency={selectedTxn.currency as 'USD' | 'EUR' | 'GBP'} />
            </span>
          </p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <span className="text-xs text-[var(--ds-color-text-secondary)]">#{selectedTxn.paymentNumber}</span>
            {selectedTxn.corridor !== "N/A" && (
              <span className="text-xs text-[var(--ds-color-text-secondary)]">· {selectedTxn.corridor}</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {anomalyOnly
          ? anomFactors.map((f, i) => (
            <span key={i} className="relative group cursor-default inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded border border-[var(--ds-color-feedback-info-border)]/30 bg-[var(--ds-color-feedback-info-bg)] text-[var(--ds-color-feedback-info-text)] font-medium">
              ~ {f.split(":")[0]}
              <span className="pointer-events-none absolute bottom-full left-0 mb-2 hidden group-hover:block w-60 rounded-[var(--ds-radius-lg)] bg-[var(--ds-color-surface-page)] border border-[var(--ds-color-border-default)] px-3 py-2 text-xs text-[var(--ds-color-text-secondary)] shadow-xl z-20 leading-relaxed">
                Anomaly Detected — statistically derived from this client's historical transaction data
              </span>
            </span>
          ))
          : ruleFactors.map((f, i) => (
            <span key={i} className="text-xs px-2 py-0.5 rounded border border-[var(--ds-color-feedback-warning-border)]/30 bg-[var(--ds-color-feedback-warning-bg)] text-[var(--ds-color-feedback-warning-text)] font-medium">
              {f.split(":")[0]}
            </span>
          ))
        }
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs text-[var(--ds-color-text-secondary)] font-medium m-0">Risk factors</p>
          <div className="flex items-center gap-3 text-xs text-[var(--ds-color-text-secondary)]">
            {ruleFactors.length > 0 && <span className="flex items-center gap-1"><AlertTriangle className="w-3 h-3 text-[var(--ds-color-feedback-warning-text)]" />Rule-Based</span>}
            {hasAnomalies && <span className="flex items-center gap-1 text-[var(--ds-color-feedback-info-text)]"><span className="font-bold">~</span>Anomaly</span>}
          </div>
        </div>
        {ruleFactors.length > 0 && (
          <div className="space-y-1.5">
            {ruleFactors.map((f, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[var(--ds-color-feedback-warning-text)]" />
                <span className="text-[var(--ds-color-text-secondary)]">{f}</span>
              </div>
            ))}
          </div>
        )}
        {hasAnomalies && ruleFactors.length > 0 && (
          <div className="mt-3 pt-3 border-t border-[var(--ds-color-border-default)]/60">
            <span className="text-xs font-medium text-[var(--ds-color-text-secondary)]">Additional signal</span>
            <div className="space-y-1.5 mt-1.5">
              {anomFactors.map((f, i) => (
                <div key={i} className="flex items-start gap-2 text-xs">
                  <span className="text-[var(--ds-color-feedback-info-text)] font-bold shrink-0 mt-0.5">~</span>
                  <span className="text-[var(--ds-color-text-secondary)]">{f}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {anomalyOnly && (
          <div className="space-y-1.5">
            {anomFactors.map((f, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <span className="text-[var(--ds-color-feedback-info-text)] font-bold shrink-0 mt-0.5">~</span>
                <span className="text-[var(--ds-color-text-secondary)]">{f}</span>
                <span className="text-xs text-[var(--ds-color-feedback-info-text)] italic mt-0.5 shrink-0">Anomaly Detected</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <VerificationActions
        paymentNumber={selectedTxn.paymentNumber}
        avState={avState}
        kybState={kybState}
        avSteps={avSteps}
        kybSteps={kybSteps}
        avResult={avResult}
        kybResult={kybResult}
        onRunAV={onRunAV}
        onRunKYB={onRunKYB}
      />

      <div>
        <p className="text-xs text-[var(--ds-color-text-secondary)] font-medium mb-2 m-0">Recommendation</p>
        <div className={`border-l-4 rounded-r-[var(--ds-radius-lg)] px-3 py-2.5 text-sm ${recCls}`}>
          {anomalyOnly ? "Unusual pattern detected — please review payment details before approving." : selectedTxn.recommendation}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button onClick={() => onAction(selectedTxn.id)}
          className="flex items-center gap-1.5 px-4 h-10 rounded-full text-xs font-medium bg-[var(--ds-color-surface-raised)]/40 hover:bg-[var(--ds-color-surface-raised)]/60 text-[var(--ds-color-text-secondary)] border border-[var(--ds-color-border-default)] transition-colors focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-border-default)] focus:ring-offset-1 focus:ring-offset-transparent">
          Skip →
        </button>
        <button onClick={() => onAction(selectedTxn.id)}
          className="flex items-center gap-1.5 px-4 h-10 rounded-full text-xs font-medium bg-[var(--ds-color-feedback-error-bg)] hover:bg-[var(--ds-color-feedback-error-bg)] text-[var(--ds-color-feedback-error-text)] border border-[var(--ds-color-feedback-error-border)]/30 transition-colors focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-feedback-error-border)] focus:ring-offset-1 focus:ring-offset-transparent">
          <X className="w-3.5 h-3.5" aria-hidden="true" /> Reject
        </button>
        <button onClick={() => onAction(selectedTxn.id)}
          className="flex items-center gap-1.5 px-4 h-10 rounded-full text-xs font-medium bg-transparent hover:bg-[var(--ds-color-feedback-error-bg)] text-[var(--ds-color-feedback-error-text)] border border-[var(--ds-color-feedback-error-border)]/40 transition-colors focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-feedback-error-border)] focus:ring-offset-1 focus:ring-offset-transparent">
          <Ban className="w-3.5 h-3.5" aria-hidden="true" /> Void
        </button>
        <button
          onClick={() => onOverride(selectedTxn)}
          className="flex-1 flex items-center justify-center gap-1.5 px-6 h-10 rounded-full text-xs font-medium text-white transition-all hover:brightness-110 focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-feedback-error-border)] focus:ring-offset-1 focus:ring-offset-transparent"
          style={{ background: `linear-gradient(to right, ${fraudSpotlight.gradientFrom}, ${fraudSpotlight.gradientTo})` }}>
          <ShieldCheck className="w-3.5 h-3.5" aria-hidden="true" /> Override &amp; Approve
        </button>
      </div>
    </div>
  );
}

export const FlaggedItemDetail = React.memo(FlaggedItemDetailInner);
