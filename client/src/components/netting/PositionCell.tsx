import { useState, type CSSProperties } from "react";
import { ChevronDown, ChevronRight, CheckCircle } from "lucide-react";
import { CurrencyBadge, FreshnessChip, deriveFreshnessState } from "@ds-foundation/react";
import { formatAmount, freshnessMinutesToDate, type EntityPairing } from "./types";

interface PositionCellProps {
  pairing: EntityPairing;
}

export function PositionCell({ pairing }: PositionCellProps) {
  const [expanded, setExpanded] = useState(false);
  const settledPct = pairing.grossExposure > 0
    ? Math.round((pairing.settled / pairing.grossExposure) * 100)
    : 0;

  return (
    <div className="px-5 py-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-semibold text-gray-900">
          {pairing.from} ↔ {pairing.to}
        </span>
        <CurrencyBadge currency={pairing.currency} />
        <span className="ml-auto">
          <FreshnessChip
            state={deriveFreshnessState(freshnessMinutesToDate(pairing.freshnessMinutes))}
            timestamp={freshnessMinutesToDate(pairing.freshnessMinutes)}
          />
        </span>
      </div>

      <div className="space-y-1.5">
        <MetricRow
          label="Gross exposure"
          value={formatAmount(pairing.grossExposure, pairing.currency)}
          valueStyle={{ color: 'var(--ds-color-text-primary)' }}
        />
        <MetricRow
          label="Settled"
          value={formatAmount(pairing.settled, pairing.currency)}
          valueStyle={{ color: 'var(--ds-color-feedback-success-icon)' }}
        />
        <MetricRow
          label="Open"
          value={formatAmount(pairing.open, pairing.currency)}
          valueStyle={pairing.open === 0
            ? { color: 'var(--ds-color-feedback-success-icon)', fontSize: '0.75rem' }
            : { color: 'var(--ds-color-feedback-warning-text)', fontWeight: 600 }}
        />
      </div>

      {pairing.open === 0 && (
        <div className="mt-2 flex items-center gap-1 text-xs" style={{ color: 'var(--ds-color-feedback-success-text)' }}>
          <CheckCircle className="w-3 h-3" />
          Fully settled
        </div>
      )}

      {pairing.grossExposure > 0 && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{settledPct}% settled</span>
            <span className="text-gray-300">
              Last: {new Date(pairing.lastSettled).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-400 rounded-full transition-all"
              style={{ width: `${settledPct}%` }}
            />
          </div>
        </div>
      )}

      {pairing.breakdown.length > 0 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-xs text-gray-400 hover:text-purple-600 transition-colors"
        >
          {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          {expanded ? "Hide" : "Show"} transactions
        </button>
      )}

      {expanded && (
        <div className="mt-2 pl-2 border-l-2 border-gray-100 space-y-1">
          {pairing.breakdown.map((item) => (
            <div key={item.type} className="flex justify-between text-xs">
              <span className="text-gray-500">{item.type}</span>
              <span className="text-gray-700 font-medium">
                {formatAmount(item.amount, pairing.currency)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MetricRow({
  label, value, valueStyle,
}: { label: string; value: string; valueStyle?: CSSProperties }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-sm font-medium tabular-nums" style={valueStyle}>{value}</span>
    </div>
  );
}
