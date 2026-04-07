import { Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatAmount, type Action, type ActionStatus } from "./types";

interface InFlightCellProps {
  actions: Action[];
  onInitiateAction: () => void;
}

const STATUS_CONFIG: Record<ActionStatus, { label: string; dot: string; text: string }> = {
  submitted:     { label: "Submitted",      dot: "bg-gray-400",   text: "text-gray-500" },
  in_payments:   { label: "In Payments",    dot: "bg-blue-500",   text: "text-blue-600" },
  first_approval: { label: "1st Approved",   dot: "bg-indigo-500", text: "text-indigo-600" },
  second_approval:{ label: "2nd Approved",   dot: "bg-indigo-600", text: "text-indigo-700" },
  sent_to_bank:  { label: "Sent to Bank",   dot: "bg-teal-500",   text: "text-teal-600" },
  bank_confirmed:{ label: "Confirmed",      dot: "bg-green-500",  text: "text-green-600" },
  failed:        { label: "Failed",         dot: "bg-red-500",    text: "text-red-600" },
};

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
            const cfg = STATUS_CONFIG[action.status];
            const isFailed = action.status === "failed";
            return (
              <div
                key={action.id}
                className={`rounded-md p-2 ${isFailed ? "bg-red-50 border border-red-100" : "bg-gray-50"}`}
              >
                <div className="flex items-center gap-1.5">
                  {isFailed
                    ? <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
                    : <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                  }
                  <span className={`text-xs font-medium ${cfg.text}`}>{cfg.label}</span>
                  <span className="ml-auto text-xs font-semibold tabular-nums text-gray-700">
                    {formatAmount(action.amount, action.currency)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 ml-4 truncate">
                  {action.accountFrom} → {action.accountTo}
                </p>
                {isFailed && action.failureReason && (
                  <p className="text-xs text-red-500 mt-1 ml-4">{action.failureReason}</p>
                )}
                {action.requiresManualRelease && (
                  <p className="text-xs text-amber-600 mt-1 ml-4 font-medium">
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
