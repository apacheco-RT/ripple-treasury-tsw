// @ds-molecule — composed from DS atoms + TSW domain logic
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { MonoAmount } from "@ds-foundation/react";
import type { FlaggedTxn } from "@/lib/types";

interface OverrideDialogProps {
  overrideOpen: boolean;
  overrideTxn: FlaggedTxn | null;
  overrideReason: string;
  setOverrideReason: (v: string) => void;
  setOverrideOpen: (v: boolean) => void;
  onConfirm: () => void;
  dialogRef: React.RefObject<HTMLDivElement>;
}

function OverrideDialogInner({
  overrideOpen, overrideTxn, overrideReason, setOverrideReason,
  setOverrideOpen, onConfirm, dialogRef,
}: OverrideDialogProps) {
  return (
    <AnimatePresence>
      {overrideOpen && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs"
          onClick={e => { if (e.target === e.currentTarget) setOverrideOpen(false); }}
        >
          <motion.div
            ref={dialogRef}
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="bg-[var(--ds-color-surface-default)] border border-[var(--ds-color-border-default)]/60 rounded-[var(--ds-radius-3xl)] shadow-2xl w-full max-w-md mx-4 p-6"
            role="dialog" aria-modal="true" aria-labelledby="override-title"
          >
            <h3 id="override-title" className="text-white font-medium text-base m-0 mb-4">Override &amp; Approve</h3>
            <div className="rounded-[var(--ds-radius-lg)] bg-[var(--ds-color-feedback-warning-bg)] border border-[var(--ds-color-feedback-warning-border)]/30 p-3 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-[var(--ds-color-feedback-warning-text)]" aria-hidden="true" />
                <span className="font-medium text-sm text-white">Payment #{overrideTxn?.paymentNumber}</span>
              </div>
              <p className="text-xs text-[var(--ds-color-text-secondary)] m-0">
                {overrideTxn?.vendor}
                {overrideTxn && (
                  <> · <MonoAmount value={overrideTxn.amount} currency={overrideTxn.currency as 'USD' | 'EUR' | 'GBP'} size="sm" /></>
                )}
                 · Risk Score: {overrideTxn?.riskScore}/100
              </p>
            </div>
            <label className="block text-sm font-medium text-[var(--ds-color-text-secondary)] mb-1.5">
              Reason for Override <span className="text-[var(--ds-color-feedback-error-text)]">*</span>
            </label>
            <textarea
              value={overrideReason}
              onChange={e => setOverrideReason(e.target.value)}
              placeholder="Enter the reason for overriding the fraud alert and approving this transaction…"
              rows={4}
              className="w-full bg-[var(--ds-color-surface-page)] border border-[var(--ds-color-border-default)]/60 text-[var(--ds-color-text-primary)] text-sm rounded-[var(--ds-radius-xs)] px-3 py-2 resize-none focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)] placeholder:text-[var(--ds-color-text-secondary)] transition-all"
            />
            <p className="text-xs text-[var(--ds-color-text-secondary)] mt-1.5 mb-5 m-0">This will be logged for audit and compliance purposes.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setOverrideOpen(false)}
                className="px-6 h-10 rounded-full border border-[var(--ds-color-border-default)] text-[var(--ds-color-text-secondary)] hover:text-white hover:bg-white/8 text-sm font-medium transition-colors focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)]">
                Cancel
              </button>
              <button
                disabled={!overrideReason.trim()}
                onClick={onConfirm}
                className={`px-6 h-10 rounded-full text-white text-sm font-medium transition-all focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-feedback-error-border)] disabled:opacity-40 disabled:cursor-not-allowed ${overrideReason.trim() ? "bg-[var(--ds-color-feedback-error-border)] hover:brightness-110" : "bg-[var(--ds-color-surface-raised)]"}`}>
                Confirm Override
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const OverrideDialog = React.memo(OverrideDialogInner);
