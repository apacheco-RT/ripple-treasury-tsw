import { ExternalLink } from "lucide-react";
import { type Action, type Currency } from "./types";
import { StatusRing, MonoAmount } from "@ds-foundation/react";

interface CompletedCellProps {
  actions: Action[];
}

export function CompletedCell({ actions }: CompletedCellProps) {
  const total = actions.reduce((sum, a) => sum + a.amount, 0);
  // Only renders totals when actions.length > 0, so currency is always defined here
  const currency = actions[0]?.currency as Currency | undefined;

  return (
    <div className="px-5 py-4 border-t sm:border-t-0 sm:border-l border-gray-100">
      {actions.length === 0 ? (
        <p className="text-xs text-gray-300">No completed settlements</p>
      ) : (
        <>
          <div className="flex items-center gap-1.5 mb-2">
            <StatusRing urgency="clear" size="sm" />
            <span className="text-xs font-semibold" style={{ color: 'var(--ds-color-feedback-success-text)' }}>
              {actions.length} settlement{actions.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="space-y-1.5 mb-3">
            {actions.map((action) => (
              <div key={action.id} className="flex items-center justify-between">
                <span className="text-xs text-gray-400 truncate max-w-[100px]">
                  {action.accountFrom.split(" - ")[0]}
                </span>
                <MonoAmount value={action.amount} currency={action.currency} size="sm" />
              </div>
            ))}
          </div>

          {currency && total > 0 && (
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">Total</span>
              <MonoAmount value={total} currency={currency as Currency} size="sm" color="success" />
            </div>
          )}

          <button
            onClick={() => console.log("Navigate to Payments module")}
            className="mt-3 flex items-center gap-1 text-xs text-gray-400 hover:text-purple-600 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            View in Payments
          </button>
        </>
      )}
    </div>
  );
}
