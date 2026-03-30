import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { useFocusTrap } from "@/hooks/use-focus-trap";

export function ApproveConfirmModal({
  open,
  onClose,
  count,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  count: number;
  onConfirm: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(open, dialogRef);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
          <motion.div ref={dialogRef}
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            role="dialog" aria-modal="true" aria-labelledby="approve-confirm-title"
            className="bg-surface-card border border-slate-700/60 rounded-[var(--m3-shape-xl)] shadow-2xl max-w-sm w-full p-6">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" aria-hidden="true" />
              <h3 id="approve-confirm-title" className="text-white font-medium text-base m-0">Approve {count} payment{count !== 1 ? "s" : ""}?</h3>
            </div>
            <p className="text-slate-300 text-sm mb-5 m-0">This will mark the selected transactions as approved and advance them to the next processing stage.</p>
            <div className="flex gap-3 justify-end">
              <button onClick={onClose}
                className="px-6 h-[var(--m3-button-height)] rounded-[var(--m3-shape-full)] border border-surface-border text-slate-300 hover:text-white hover:bg-[var(--m3-state-hover)] font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400">
                Cancel
              </button>
              <button autoFocus onClick={onConfirm}
                className="px-6 h-[var(--m3-button-height)] rounded-[var(--m3-shape-full)] bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-surface-card">
                Approve payments
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
