import { Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Action } from "./types";
import { StatusPill, MonoAmount } from "@ds-foundation/react";

interface InFlightCellProps {
  actions: Action[];
  onInitiateAction: () => void;
}

export function InFlightCell({ actions, onInitiateAction }: InFlightCellProps) {
  const sorted = [
    ...actions.filter((a) => a.status === "failed"),
    ...actions.filter((a) => a.status !== "failed"),
  ];

  return (
    <div className="px-5 py-4 border-t sm:border-t-0 sm:border-l border-gray-100">
      {sorted.length === 0 ? (
        <p className="text-xs text-gray-300 mb-3">No actions in progress</p>
      ) : (
        <div className="space-y-2 mb-3">
          {sorted.map((action) => {
            const isFailed = action.status === "failed";
            return (
              <div
                key={action.id}
                className={`rounded-md p-2 ${isFailed ? "bg-red-50 border border-red-100" : "bg-gray-50"}`}
              >
                <div className="flex items-center gap-1.5">
                  {isFailed && <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />}
                  <StatusPill status={action.status} />
                  <span className="ml-auto">
                    <MonoAmount value={action.amount} currency={action.currency} size="sm" />
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 ml-4 truncate">
                  {action.accountFrom} → {action.accountTo}
                </p>
                {isFailed && action.failureReason && (
                  <p className="text-xs mt-1 ml-4" style={{ color: 'var(--ds-color-feedback-error-text)' }}>
                    {action.failureReason}
                  </p>
                )}
                {action.requiresManualRelease && (
                  <p className="text-xs mt-1 ml-4 font-medium" style={{ color: 'var(--ds-color-feedback-warning-text)' }}>
                    ⚠ Requires manual bank release
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        className="w-full gap-1.5 text-xs h-7 border-dashed text-gray-500 hover:text-purple-600 hover:border-purple-300"
        onClick={onInitiateAction}
      >
        <Plus className="w-3 h-3" />
        Initiate Action
      </Button>
    </div>
  );
}
