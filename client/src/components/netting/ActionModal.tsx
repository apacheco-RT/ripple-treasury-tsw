import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  MOCK_ACCOUNTS, formatAmount,
  type EntityPairing, type Action, type Currency,
} from "./types";

interface ActionModalProps {
  pairing: EntityPairing | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (action: Omit<Action, "id" | "createdAt" | "updatedAt">) => void;
}

export function ActionModal({ pairing, open, onClose, onSubmit }: ActionModalProps) {
  const [accountFromId, setAccountFromId] = useState("");
  const [accountToId, setAccountToId] = useState("");
  const [amountMode, setAmountMode] = useState<"full" | "partial">("full");
  const [partialAmount, setPartialAmount] = useState("");

  if (!pairing) return null;

  const fromAccounts = MOCK_ACCOUNTS.filter(
    (a) => a.entity === pairing.from && a.currency === pairing.currency
  );
  const toAccounts = MOCK_ACCOUNTS.filter(
    (a) => a.entity === pairing.to && a.currency === pairing.currency
  );

  const selectedFrom = MOCK_ACCOUNTS.find((a) => a.id === accountFromId);
  const amount = amountMode === "full"
    ? pairing.open
    : Number(partialAmount) || 0;

  const isGBP = pairing.currency === "GBP";
  const balanceExceeded = selectedFrom !== undefined && amount > selectedFrom.balance;
  const canSubmit = accountFromId !== "" && accountToId !== "" && amount > 0 && !balanceExceeded;

  const currencySymbols: Record<Currency, string> = { USD: "$", EUR: "€", GBP: "£" };

  function handleSubmit() {
    if (!canSubmit || !selectedFrom || !pairing) return;
    const accountTo = MOCK_ACCOUNTS.find((a) => a.id === accountToId);
    onSubmit({
      pairingId: pairing.id,
      from: pairing.from,
      to: pairing.to,
      currency: pairing.currency,
      amount,
      status: "submitted",
      accountFrom: selectedFrom.label,
      accountTo: accountTo?.label ?? accountToId,
      requiresManualRelease: isGBP,
    });
    setAccountFromId("");
    setAccountToId("");
    setAmountMode("full");
    setPartialAmount("");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            Initiate Settlement
            <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-purple-50 text-purple-700 border border-purple-100">
              {pairing.from} ↔ {pairing.to}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div className="bg-gray-50 rounded-md px-3 py-2 text-xs text-gray-600">
            Open exposure: <span className="font-semibold text-gray-900">
              {formatAmount(pairing.open, pairing.currency)}
            </span>
          </div>

          {isGBP && (
            <div className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-md">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                GBP requires manual bank release (permanent — LHV has no CHAPS API).
              </p>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">From account ({pairing.from})</Label>
            <Select value={accountFromId} onValueChange={setAccountFromId}>
              <SelectTrigger className="text-sm h-9">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {fromAccounts.map((acc) => (
                  <SelectItem key={acc.id} value={acc.id}>
                    {acc.label} — {formatAmount(acc.balance, acc.currency)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedFrom && (
              <p className="text-xs text-gray-400">
                Available: {formatAmount(selectedFrom.balance, selectedFrom.currency)}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">To account ({pairing.to})</Label>
            <Select value={accountToId} onValueChange={setAccountToId}>
              <SelectTrigger className="text-sm h-9">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {toAccounts.map((acc) => (
                  <SelectItem key={acc.id} value={acc.id}>
                    {acc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Amount</Label>
            <div className="flex gap-2 mb-2">
              {(["full", "partial"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setAmountMode(mode)}
                  className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                    amountMode === mode
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
                  }`}
                >
                  {mode === "full"
                    ? `Full — ${formatAmount(pairing.open, pairing.currency)}`
                    : "Partial"
                  }
                </button>
              ))}
            </div>
            {amountMode === "partial" && (
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  {currencySymbols[pairing.currency]}
                </span>
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="Amount in millions"
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(e.target.value)}
                  className="pl-7 text-sm h-9"
                />
              </div>
            )}
            {balanceExceeded && selectedFrom && (
              <p className="text-xs text-red-500">
                Exceeds available balance by {formatAmount(amount - selectedFrom.balance, pairing.currency)}
              </p>
            )}
          </div>

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              Submit Action
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
