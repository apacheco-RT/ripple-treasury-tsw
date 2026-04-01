import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Clock, FileText, HelpCircle, Landmark, X,
} from "lucide-react";
import type { Txn } from "@/lib/types";

interface PaymentRailDialogProps {
  txn: Txn | null;
  dialogRef: React.RefObject<HTMLDivElement>;
  onClose: () => void;
  showStablecoin?: boolean;
}

function PaymentRailDialogInner({ txn, dialogRef, onClose, showStablecoin = true }: PaymentRailDialogProps) {
  const [selectedRail, setSelectedRail] = useState<"bank-wire" | "stablecoin">(showStablecoin ? "stablecoin" : "bank-wire");
  const [quoteGenerated, setQuoteGenerated] = useState(false);

  useEffect(() => {
    if (txn) { setSelectedRail(showStablecoin ? "stablecoin" : "bank-wire"); setQuoteGenerated(false); }
  }, [txn, showStablecoin]);

  useEffect(() => {
    if (!txn) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [txn, onClose]);

  if (!txn) return null;

  const fmtUSD = (n: number) => `$${n.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;

  return (
    <AnimatePresence>
      {txn && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/75 backdrop-blur-xs z-50 flex items-center justify-center p-6 overflow-y-auto"
          onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
          <motion.div ref={dialogRef}
            initial={{ opacity: 0, scale: 0.96, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }}
            role="dialog" aria-modal="true" aria-labelledby="rail-dialog-title"
            className="bg-[var(--ds-color-surface-page)] border border-[var(--ds-color-border-default)]/50 rounded-[var(--ds-radius-3xl)] shadow-2xl w-full max-w-3xl my-auto">

            <div className="px-6 py-5 border-b border-[var(--ds-color-border-default)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 id="rail-dialog-title" className="text-xl font-medium text-white m-0">Select payment rail</h2>
                  <p className="text-[var(--ds-color-text-secondary)] text-sm mt-1">Choose how to process this payment. Compare options to find the best solution.</p>
                </div>
                <button onClick={onClose} aria-label="Close dialog"
                  className="p-1.5 rounded-[var(--ds-radius-lg)] text-[var(--ds-color-text-secondary)] hover:text-white hover:bg-white/8 transition-colors shrink-0 focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)]">
                  <X className="w-5 h-5" aria-hidden="true" />
                </button>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-[var(--ds-color-text-secondary)]">Payment Amount:</span>
                  <span className="text-lg font-bold text-white">{fmtUSD(txn.amount)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[var(--ds-color-text-secondary)]">Corridor:</span>
                  <span className="px-2 py-0.5 rounded-[var(--ds-radius-xs)] border border-[var(--ds-color-border-default)] font-mono text-xs text-[var(--ds-color-text-secondary)]">{txn.cur} → EUR</span>
                </div>
                {showStablecoin && (
                  <div className="flex items-center gap-2 text-[var(--ds-color-brand-primary)]">
                    <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                    <span className="font-medium text-sm">Stablecoin rail available</span>
                  </div>
                )}
              </div>
            </div>

            <div className={`p-6 grid grid-cols-1 ${showStablecoin ? "md:grid-cols-2" : ""} gap-4`}>
              <button
                onClick={() => { setSelectedRail("bank-wire"); setQuoteGenerated(false); }}
                aria-pressed={selectedRail === "bank-wire"}
                className={`relative rounded-[var(--ds-radius-xl)] border-2 p-5 text-left transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)] ${selectedRail === "bank-wire"
                  ? "border-[var(--ds-color-brand-primary)]/50 bg-[var(--ds-color-brand-primary-subtle)] shadow-lg shadow-[var(--ds-color-brand-primary)]/10"
                  : "border-[var(--ds-color-border-default)]/50 bg-[var(--ds-color-surface-default)] hover:border-[var(--ds-color-border-default)]"
                  }`}>
                {selectedRail === "bank-wire" && (
                  <div className="absolute top-3 right-3">
                    <CheckCircle2 className="w-5 h-5 text-[var(--ds-color-brand-primary)]" aria-hidden="true" />
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-[var(--ds-radius-lg)] bg-[var(--ds-color-surface-raised)]/60 border border-[var(--ds-color-border-default)]">
                    <Landmark className="w-5 h-5 text-[var(--ds-color-text-secondary)]" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="font-medium text-white text-sm">Bank wire transfer</h3>
                    <p className="text-xs text-[var(--ds-color-text-secondary)]">Standard processing</p>
                  </div>
                </div>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-[var(--ds-color-text-secondary)]"><Clock className="w-3.5 h-3.5" /> Settlement</div>
                    <span className="font-medium text-[var(--ds-color-text-primary)]">1–5 business days</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-[var(--ds-color-text-secondary)]"><FileText className="w-3.5 h-3.5" /> Cost</div>
                    <span className="font-medium text-[var(--ds-color-text-primary)]">$25–45 / txn</span>
                  </div>
                </div>
                <div className="border-t border-[var(--ds-color-border-default)] pt-3 space-y-1.5">
                  {["Traditional banking infrastructure", "Established processes", "Wide acceptance"].map(f => (
                    <div key={f} className="flex items-center gap-2 text-xs text-[var(--ds-color-text-secondary)]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--ds-color-text-secondary)] shrink-0" aria-hidden="true" /> {f}
                    </div>
                  ))}
                </div>
              </button>

              {showStablecoin && (
                <button
                  onClick={() => setSelectedRail("stablecoin")}
                  aria-pressed={selectedRail === "stablecoin"}
                  className={`relative rounded-[var(--ds-radius-xl)] border-2 p-5 text-left transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)] ${selectedRail === "stablecoin"
                    ? "border-[var(--ds-color-brand-primary)]/60 bg-[var(--ds-color-brand-primary-subtle)] shadow-lg shadow-[var(--ds-color-brand-primary)]/15"
                    : "border-[var(--ds-color-border-default)]/50 bg-[var(--ds-color-surface-default)] hover:border-[var(--ds-color-border-default)]"
                    }`}>
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[var(--ds-color-brand-primary)] text-[var(--ds-color-text-on-brand)]">RECOMMENDED</span>
                  </div>
                  {selectedRail === "stablecoin" && (
                    <div className="absolute top-3 right-3">
                      <CheckCircle2 className="w-5 h-5 text-[var(--ds-color-brand-primary)]" aria-hidden="true" />
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-[var(--ds-radius-lg)] bg-[var(--ds-color-brand-primary-subtle)] border border-[var(--ds-color-brand-primary)]/25 flex items-center justify-center">
                      <span className="text-xs font-bold text-[var(--ds-color-brand-primary)] px-0.5">RLUSD</span>
                    </div>
                    <div>
                      <h3 className="font-medium text-white text-sm">Stablecoin transfer (RLUSD)</h3>
                      <p className="text-xs text-[var(--ds-color-text-secondary)]">Next-generation instant settlement</p>
                    </div>
                  </div>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-[var(--ds-color-text-secondary)]"><Clock className="w-3.5 h-3.5" /> Settlement</div>
                      <span className="font-medium text-[var(--ds-color-brand-primary)]">Minutes</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-[var(--ds-color-text-secondary)]"><FileText className="w-3.5 h-3.5" /> Cost</div>
                      <span className="font-medium text-[var(--ds-color-brand-primary)]">$2–5 / txn</span>
                    </div>
                  </div>
                  <div className="border-t border-[var(--ds-color-border-default)] pt-3 space-y-1.5">
                    {["Real-time settlement", "Blockchain transparency", "Lower operational costs"].map(f => (
                      <div key={f} className="flex items-center gap-2 text-xs text-[var(--ds-color-text-secondary)]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[var(--ds-color-feedback-success-text)] shrink-0" aria-hidden="true" /> {f}
                      </div>
                    ))}
                  </div>
                  {selectedRail === "stablecoin" && !quoteGenerated && (
                    <div className="mt-4">
                      <button
                        onClick={e => { e.stopPropagation(); setQuoteGenerated(true); }}
                        className="w-full h-10 rounded-full border border-[var(--ds-color-brand-primary)]/30 text-[var(--ds-color-brand-primary)] text-xs font-medium hover:bg-[var(--ds-color-brand-primary-subtle)] transition-colors focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)]">
                        <FileText className="w-3.5 h-3.5 inline mr-1.5" aria-hidden="true" /> Get Quote
                      </button>
                    </div>
                  )}
                </button>
              )}
            </div>

            {quoteGenerated && selectedRail === "stablecoin" && (
              <div className="px-6 pb-4 space-y-4">
                <div className="rounded-[var(--ds-radius-xl)] border-2 border-[var(--ds-color-brand-primary)]/40 bg-[var(--ds-color-brand-primary-subtle)] p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[var(--ds-color-brand-primary)]" aria-hidden="true" />
                      <h3 className="font-medium text-white text-base m-0">Stablecoin quote</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-[var(--ds-radius-xs)] text-xs font-bold bg-[var(--ds-color-brand-primary)] text-[var(--ds-color-text-on-brand)]">VALID</span>
                      <span className="px-2 py-0.5 rounded-[var(--ds-radius-xs)] border border-[var(--ds-color-border-default)] font-mono text-xs text-[var(--ds-color-text-secondary)]">quo_3f2a8c19b4e047d8</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 mb-4">
                    <div className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border-default)]/50 bg-[var(--ds-color-surface-default)] p-3">
                      <p className="text-xs text-[var(--ds-color-brand-primary)] font-medium mb-1">Source</p>
                      <p className="text-xl font-medium text-white">100.15 <span className="text-sm font-medium">RLUSD</span></p>
                      <p className="text-xs text-[var(--ds-color-text-secondary)] mt-1 font-mono">ACT_998877</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[var(--ds-color-text-secondary)]" aria-hidden="true" />
                    <div className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border-default)]/50 bg-[var(--ds-color-surface-default)] p-3">
                      <p className="text-xs text-[var(--ds-color-brand-primary)] font-medium mb-1">Destination</p>
                      <p className="text-xl font-medium text-white">1,854.20 <span className="text-sm font-medium">MXN</span></p>
                      <p className="text-xs text-[var(--ds-color-text-secondary)] mt-1 font-mono">DEST_554433</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
                    {([
                      ["FX Rate", "18.5142", "RLUSD → MXN"],
                      ["Total Source", "100.30 RLUSD", "Incl. all fees"],
                      ["Transaction Fee", "0.05 RLUSD", ""],
                      ["FX Spread", "0.10 RLUSD", ""],
                      ["Settlement", "DIGITAL_ASSET", ""],
                      ["Asset Path", "RLUSD → XRP → MXN", ""],
                      ["Slippage", "0.50%", ""],
                    ] as [string, string, string][]).map(([label, val, sub]) => (
                      <div key={label}>
                        <p className="text-xs text-[var(--ds-color-brand-primary)] font-medium mb-0.5">{label}</p>
                        <p className="font-medium text-white text-sm">{val}</p>
                        {sub && <p className="text-xs text-[var(--ds-color-text-secondary)]">{sub}</p>}
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 pt-3 border-t border-[var(--ds-color-brand-primary)]/20 text-xs text-[var(--ds-color-text-secondary)]">
                    Expires 2026-02-25 09:35:12 UTC · Real-time pricing · Transparent blockchain settlement
                  </p>
                </div>

                <div className="rounded-[var(--ds-radius-xl)] border border-[var(--ds-color-border-default)]/50 bg-[var(--ds-color-surface-default)] p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <h3 className="font-medium text-white text-sm m-0">Additional details</h3>
                    <HelpCircle className="w-3.5 h-3.5 text-[var(--ds-color-text-secondary)]" aria-hidden="true" />
                  </div>
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
                    {([
                      ["Blockchain Network", "XRP Ledger (via RLUSD)"],
                      ["Regulatory Compliance", "Fully compliant"],
                      ["Expected Completion", "~3–5 minutes"],
                      ["Blockchain Tracking", "Full transparency"],
                    ] as [string, string][]).map(([label, val]) => (
                      <div key={label}>
                        <p className="text-xs text-[var(--ds-color-brand-primary)] font-medium mb-0.5">{label}</p>
                        <p className="text-sm font-medium text-[var(--ds-color-text-primary)]">{val}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="px-6 py-4 border-t border-[var(--ds-color-border-default)] flex items-center justify-between">
              <button onClick={onClose}
                className="px-6 h-10 rounded-full border border-[var(--ds-color-border-default)] text-[var(--ds-color-text-secondary)] hover:text-white hover:bg-white/8 font-medium text-sm transition-colors focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)]">
                Cancel
              </button>
              {(quoteGenerated && selectedRail === "stablecoin") || selectedRail === "bank-wire" ? (
                <button onClick={onClose}
                  className="flex items-center gap-2 px-6 h-10 rounded-full bg-[var(--ds-color-brand-primary)] hover:bg-[var(--ds-color-brand-primary-hover)] text-[var(--ds-color-text-on-brand)] font-medium text-sm transition-colors focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)] focus:ring-offset-2 focus:ring-offset-surface-page">
                  Continue with {selectedRail === "stablecoin" ? "Stablecoin" : "Bank Wire"}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const PaymentRailDialog = React.memo(PaymentRailDialogInner);
