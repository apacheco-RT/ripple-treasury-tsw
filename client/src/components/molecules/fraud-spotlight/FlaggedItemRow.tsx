// @ds-molecule — composed from DS atoms + TSW domain logic
import React from "react";
import { ChevronRight } from "lucide-react";
import { MonoAmount, CurrencyBadge } from "@ds-foundation/react";
import { RiskScoreBadge } from "./RiskScoreBadge";
import { isAnomaly, displayScore, scoreColors, primaryTrigger } from "@/lib/mock-data";
import type { FlaggedTxn } from "@/lib/types";

interface FlaggedItemRowProps {
  txn: FlaggedTxn;
  isSelected: boolean;
  onSelect: (id: string | null) => void;
  flagged: FlaggedTxn[];
}

function FlaggedItemRowInner({ txn: t, isSelected: isSel, onSelect, flagged }: FlaggedItemRowProps) {
  const anomalyOnly = !t.riskFactors.some(f => !isAnomaly(f));
  const score = displayScore(t);
  const c = scoreColors(score, anomalyOnly);
  const trigger = primaryTrigger(t.riskFactors);
  return (
    <div id={`fraud-option-${t.id}`}
      role="option" tabIndex={0} aria-selected={isSel}
      onClick={() => onSelect(isSel ? null : t.id)}
      onKeyDown={(e) => {
        const idx = flagged.findIndex(x => x.id === t.id);
        if (e.key === "ArrowDown" && idx < flagged.length - 1) { e.preventDefault(); onSelect(flagged[idx + 1].id); }
        else if (e.key === "ArrowUp" && idx > 0) { e.preventDefault(); onSelect(flagged[idx - 1].id); }
        else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onSelect(isSel ? null : t.id); }
      }}
      className={`w-full flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-200 focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-[var(--ds-color-brand-primary)]
        ${isSel ? "bg-[var(--ds-color-surface-default)] border-l-2 border-l-[var(--ds-color-brand-primary)]" : "hover:bg-[var(--ds-color-surface-default)]/50 border-l-2 border-l-transparent"}`}>
      <RiskScoreBadge txn={t} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-[var(--ds-color-text-primary)] truncate">{t.vendor}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="flex items-center gap-1.5">
              <MonoAmount value={t.amount} currency={t.currency as 'USD' | 'EUR' | 'GBP'} size="sm" />
              <CurrencyBadge currency={t.currency as 'USD' | 'EUR' | 'GBP'} />
            </span>
          <span className="text-xs text-[var(--ds-color-text-secondary)]">#{t.paymentNumber}</span>
        </div>
      </div>
      <span className={`shrink-0 text-xs font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider
        ${anomalyOnly ? "bg-[var(--ds-color-feedback-info-bg)] border-[var(--ds-color-feedback-info-border)]/25 text-[var(--ds-color-feedback-info-text)]"
        : score >= 75 ? "bg-[var(--ds-color-feedback-error-bg)] border-[var(--ds-color-feedback-error-border)]/25 text-[var(--ds-color-feedback-error-text)]"
        : "bg-[var(--ds-color-feedback-warning-bg)] border-[var(--ds-color-feedback-warning-border)]/25 text-[var(--ds-color-feedback-warning-text)]"}`}>
        {trigger}
      </span>
      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSel ? "rotate-90 text-[var(--ds-color-brand-primary)]" : "text-[var(--ds-color-text-secondary)]"}`} aria-hidden="true" />
    </div>
  );
}

export const FlaggedItemRow = React.memo(FlaggedItemRowInner);
