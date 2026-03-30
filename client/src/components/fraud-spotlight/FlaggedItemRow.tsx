import React from "react";
import { ChevronRight } from "lucide-react";
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
      className={`w-full flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-teal-400
        ${isSel ? "bg-surface-card border-l-2 border-l-teal-400" : "hover:bg-surface-card/50 border-l-2 border-l-transparent"}`}>
      <RiskScoreBadge txn={t} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-slate-200 truncate">{t.vendor}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-slate-300 font-medium">{t.currency} {t.amount.toLocaleString()}</span>
          <span className="text-xs text-slate-400">#{t.paymentNumber}</span>
        </div>
      </div>
      <span className={`shrink-0 text-xs font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider
        ${anomalyOnly ? "bg-blue-500/10 border-blue-500/25 text-blue-300"
        : score >= 75 ? "bg-rose-500/15 border-rose-500/25 text-rose-300"
        : "bg-amber-500/15 border-amber-500/25 text-amber-300"}`}>
        {trigger}
      </span>
      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isSel ? "rotate-90 text-teal-400" : "text-slate-400"}`} aria-hidden="true" />
    </div>
  );
}

export const FlaggedItemRow = React.memo(FlaggedItemRowInner);
