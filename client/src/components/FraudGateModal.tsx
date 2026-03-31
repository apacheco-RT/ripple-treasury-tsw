import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import type { Txn } from "@/lib/types";

export function FraudGateModal({
  open,
  onClose,
  selected,
  selTxns,
  onReview,
  onApproveAnyway,
}: {
  open: boolean;
  onClose: () => void;
  selected: string[];
  selTxns: Txn[];
  onReview: () => void;
  onApproveAnyway: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, dialogRef);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const flaggedInSel = selTxns.filter(t => t.risk >= 70).length;

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-50 flex items-center justify-center p-6"
          onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
          <motion.div ref={dialogRef}
            initial={{ opacity: 0, scale: 0.95, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
            role="dialog" aria-modal="true" aria-labelledby="fraud-gate-title"
            className="bg-[var(--ds-color-surface-default)] border border-rose-500/40 rounded-[var(--ds-radius-3xl)] shadow-2xl max-w-md w-full p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-[var(--ds-radius-xl)] bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5 text-rose-400" aria-hidden="true" />
              </div>
              <div>
                <h3 id="fraud-gate-title" className="text-white font-medium text-base m-0 mb-1">Elevated risk detected</h3>
                <p className="text-[var(--ds-color-text-secondary)] text-sm leading-relaxed m-0">
                  <strong className="text-rose-300">{flaggedInSel} of {selected.length}</strong> selected payments have a risk score ≥ 70. Review before approving.
                </p>
              </div>
            </div>
            <div className="bg-rose-500/8 border border-rose-500/20 rounded-[var(--ds-radius-xl)] p-3 mb-5 space-y-1.5" role="list" aria-label="High-risk transactions">
              {selTxns.filter(t => t.risk >= 70).map(t => (
                <div key={t.id} className="flex items-center gap-2 text-xs" role="listitem">
                  <ShieldAlert className="w-3 h-3 text-rose-400 shrink-0" aria-hidden="true" />
                  <span className="font-mono font-bold text-rose-300">{t.id}</span>
                  <span className="text-[var(--ds-color-text-secondary)] flex-1 truncate">{t.payee}</span>
                  <span className="text-rose-300 font-bold shrink-0" aria-label={`Risk score ${t.risk}`}>{t.risk}/100</span>
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <button onClick={onReview} autoFocus
                className="w-full h-10 rounded-full bg-teal-600 hover:bg-teal-500 text-white font-medium text-sm transition-colors flex items-center justify-center gap-2 focus:outline-hidden focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-surface-card">
                <ShieldCheck className="w-4 h-4" aria-hidden="true" /> Review flagged payments
              </button>
              <button onClick={onApproveAnyway}
                className="w-full h-10 rounded-full bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/25 font-medium text-sm transition-colors focus:outline-hidden focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 focus:ring-offset-surface-card">
                Approve all anyway (not recommended)
              </button>
              <button onClick={onClose}
                className="text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-text-secondary)] text-sm text-center transition-colors h-10 focus:outline-hidden focus:ring-2 focus:ring-teal-400 rounded-full">
                Cancel
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
