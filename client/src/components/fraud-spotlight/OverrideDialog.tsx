import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setOverrideOpen(false); }}
        >
          <motion.div
            ref={dialogRef}
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="bg-surface-card border border-slate-700/60 rounded-[var(--m3-shape-xl)] shadow-2xl w-full max-w-md mx-4 p-6"
            role="dialog" aria-modal="true" aria-labelledby="override-title"
          >
            <h3 id="override-title" className="text-white font-medium text-base m-0 mb-4">Override &amp; Approve</h3>
            <div className="rounded-[var(--m3-shape-sm)] bg-amber-500/10 border border-amber-500/30 p-3 mb-4">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-400" aria-hidden="true" />
                <span className="font-medium text-sm text-white">Payment #{overrideTxn?.paymentNumber}</span>
              </div>
              <p className="text-xs text-slate-400 m-0">
                {overrideTxn?.vendor} · {overrideTxn?.currency} {overrideTxn?.amount.toLocaleString()} · Risk Score: {overrideTxn?.riskScore}/100
              </p>
            </div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Reason for Override <span className="text-rose-400">*</span>
            </label>
            <textarea
              value={overrideReason}
              onChange={e => setOverrideReason(e.target.value)}
              placeholder="Enter the reason for overriding the fraud alert and approving this transaction…"
              rows={4}
              className="w-full bg-surface-page border border-slate-700/60 text-slate-200 text-sm rounded-[var(--m3-shape-xs)] px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-slate-400 transition-all"
            />
            <p className="text-xs text-slate-400 mt-1.5 mb-5 m-0">This will be logged for audit and compliance purposes.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setOverrideOpen(false)}
                className="px-6 h-[var(--m3-button-height)] rounded-[var(--m3-shape-full)] border border-surface-border text-slate-300 hover:text-white hover:bg-[var(--m3-state-hover)] text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400">
                Cancel
              </button>
              <button
                disabled={!overrideReason.trim()}
                onClick={onConfirm}
                className={`px-6 h-[var(--m3-button-height)] rounded-[var(--m3-shape-full)] text-white text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-rose-400 disabled:opacity-40 disabled:cursor-not-allowed ${overrideReason.trim() ? "bg-rose-600 hover:bg-rose-500" : "bg-slate-700"}`}>
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
