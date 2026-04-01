import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, ShieldAlert, ShieldCheck } from "lucide-react";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import type { FlaggedTxn } from "@/lib/types";
import { fraudSpotlight } from "@/lib/design-tokens";
import { FRAUD_DATA, VERIF_DATA } from "@/lib/mock-data";
import { FlaggedItemRow } from "@/components/fraud-spotlight/FlaggedItemRow";
import { FlaggedItemDetail } from "@/components/fraud-spotlight/FlaggedItemDetail";
import { OverrideDialog } from "@/components/fraud-spotlight/OverrideDialog";

export function FraudSpotlight() {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [actioned, setActioned] = useState<string[]>([]);
  const [overrideOpen, setOverrideOpen] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");
  const [overrideTxn, setOverrideTxn] = useState<FlaggedTxn | null>(null);
  const overrideDialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(overrideOpen, overrideDialogRef);
  const [avState, setAvState] = useState<Record<string, "idle" | "loading" | "done">>({});
  const [kybState, setKybState] = useState<Record<string, "idle" | "loading" | "done">>({});
  const [avSteps, setAvSteps] = useState<Record<string, { label: string; done: boolean }[]>>({});
  const [kybSteps, setKybSteps] = useState<Record<string, { label: string; done: boolean }[]>>({});

  const ALL_FLAGGED = useMemo(() => FRAUD_DATA.filter(t => t.riskScore >= 50), []);
  const flagged = useMemo(() => ALL_FLAGGED.filter(t => !actioned.includes(t.id)), [ALL_FLAGGED, actioned]);
  const allCleared = ALL_FLAGGED.length > 0 && flagged.length === 0;

  useEffect(() => {
    if (selectedId && !flagged.find(t => t.id === selectedId)) setSelectedId(null);
  }, [flagged.length]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!overrideOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOverrideOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [overrideOpen]);

  const selectedTxn = useMemo(() => flagged.find(t => t.id === selectedId) ?? null, [flagged, selectedId]);

  const critCount = useMemo(() => flagged.filter(t => t.riskLevel === "critical").length, [flagged]);
  const highCount = useMemo(() => flagged.filter(t => t.riskLevel === "high").length, [flagged]);

  const handleAction = useCallback((id: string) => {
    const idx = flagged.findIndex(t => t.id === selectedId);
    setActioned(a => [...a, id]);
    const next = flagged[idx + 1];
    setSelectedId(next ? next.id : null);
  }, [flagged, selectedId]);

  const handleOverrideConfirm = useCallback(() => {
    if (overrideTxn) handleAction(overrideTxn.id);
    setOverrideOpen(false); setOverrideReason(""); setOverrideTxn(null);
  }, [overrideTxn, handleAction]);

  const handleOverride = useCallback((txn: FlaggedTxn) => {
    setOverrideTxn(txn);
    setOverrideReason("");
    setOverrideOpen(true);
  }, []);

  const wait = (ms: number) => new Promise<void>(r => setTimeout(r, ms));
  const runAV = useCallback(async (pn: string) => {
    const steps = ["Account number format", "Bank routing code", "Account holder name match", "Account status verification"];
    setAvState(s => ({ ...s, [pn]: "loading" }));
    setAvSteps(s => ({ ...s, [pn]: steps.map(label => ({ label, done: false })) }));
    for (let i = 0; i < steps.length; i++) {
      await wait(500);
      setAvSteps(s => ({ ...s, [pn]: s[pn].map((st, idx) => idx <= i ? { ...st, done: true } : st) }));
    }
    await wait(300);
    setAvState(s => ({ ...s, [pn]: "done" }));
  }, []);
  const runKYB = useCallback(async (pn: string) => {
    const steps = ["Corporate registry search", "Beneficial ownership check", "Sanctions & PEP screening", "Adverse media screening", "Financial crime database check", "Industry watchlist cross-reference"];
    setKybState(s => ({ ...s, [pn]: "loading" }));
    setKybSteps(s => ({ ...s, [pn]: steps.map(label => ({ label, done: false })) }));
    for (let i = 0; i < steps.length; i++) {
      await wait(600);
      setKybSteps(s => ({ ...s, [pn]: s[pn].map((st, idx) => idx <= i ? { ...st, done: true } : st) }));
    }
    await wait(300);
    setKybState(s => ({ ...s, [pn]: "done" }));
  }, []);

  const selectedPn = selectedTxn?.paymentNumber;
  const currentAvState = selectedPn ? (avState[selectedPn] ?? "idle") : "idle";
  const currentKybState = selectedPn ? (kybState[selectedPn] ?? "idle") : "idle";
  const currentAvSteps = selectedPn ? (avSteps[selectedPn] ?? []) : [];
  const currentKybSteps = selectedPn ? (kybSteps[selectedPn] ?? []) : [];
  const currentAvResult = selectedPn ? VERIF_DATA[selectedPn]?.av : undefined;
  const currentKybResult = selectedPn ? VERIF_DATA[selectedPn]?.kyb : undefined;

  return (
    <section aria-label="Fraud spotlight" className="rounded-[var(--ds-radius-xl)] overflow-hidden border border-[var(--ds-color-feedback-error-border)]/20 mb-4">

      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open && !allCleared}
        aria-controls={!allCleared ? "fraud-spotlight-content" : undefined}
        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 focus:outline-hidden focus:ring-2 focus:ring-inset focus:ring-white/20 ${allCleared ? "bg-[var(--ds-color-feedback-success-bg)]" : "fraud-gradient-header"}`}
        style={allCleared ? undefined : { background: `linear-gradient(to right, ${fraudSpotlight.gradientFrom}, ${fraudSpotlight.gradientVia}, ${fraudSpotlight.gradientTo})` }}
      >
        <div className={`w-8 h-8 rounded-[var(--ds-radius-lg)] flex items-center justify-center shrink-0 ${allCleared ? "bg-[var(--ds-color-feedback-success-bg)]" : "bg-white/15 backdrop-blur-xs"}`}>
          {allCleared
            ? <ShieldCheck className="w-4 h-4 text-[var(--ds-color-feedback-success-text)]" aria-hidden="true" />
            : <ShieldAlert className="w-4 h-4 text-white" aria-hidden="true" />}
        </div>
        <div className="flex-1 flex items-center gap-2 flex-wrap min-w-0">
          {allCleared ? (
            <span className="text-sm font-medium text-[var(--ds-color-feedback-success-text)]">All flagged transactions reviewed</span>
          ) : (
            <>
              <span className="text-sm font-medium text-white">Fraud Protection Spotlight</span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-xs">
                {flagged.length} flagged
              </span>
              {critCount > 0 && <span className="text-xs text-white">{critCount} critical</span>}
              {highCount > 0 && <span className="text-xs text-white">{highCount} high</span>}
            </>
          )}
        </div>
        {!allCleared && (
          <span className="text-xs font-medium text-white shrink-0" aria-hidden="true">
            {open ? "Collapse" : "Review now"}
          </span>
        )}
        {open
          ? <ChevronUp className={`w-4 h-4 shrink-0 ${allCleared ? "text-[var(--ds-color-feedback-success-text)]" : "text-white"}`} aria-hidden="true" />
          : <ChevronDown className={`w-4 h-4 shrink-0 ${allCleared ? "text-[var(--ds-color-feedback-success-text)]" : "text-white"}`} aria-hidden="true" />}
      </button>

      <AnimatePresence initial={false}>
        {open && !allCleared && (
          <motion.div id="fraud-spotlight-content"
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/10 grid lg:grid-cols-2 bg-[var(--ds-color-surface-default)]">
              <div role="listbox" aria-label="Flagged transactions"
                aria-activedescendant={selectedId ? `fraud-option-${selectedId}` : undefined}
                className="divide-y divide-surface-border max-h-[360px] overflow-y-auto">
                {flagged.map((t) => (
                  <FlaggedItemRow
                    key={t.id}
                    txn={t}
                    isSelected={t.id === selectedId}
                    onSelect={setSelectedId}
                    flagged={flagged}
                  />
                ))}
              </div>

              <div className="border-l border-[var(--ds-color-border-default)] bg-[var(--ds-color-surface-default)]">
                {selectedTxn ? (
                  <FlaggedItemDetail
                    txn={selectedTxn}
                    avState={currentAvState}
                    kybState={currentKybState}
                    avSteps={currentAvSteps}
                    kybSteps={currentKybSteps}
                    avResult={currentAvResult}
                    kybResult={currentKybResult}
                    onRunAV={runAV}
                    onRunKYB={runKYB}
                    onAction={handleAction}
                    onOverride={handleOverride}
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center" aria-live="polite">
                    <ShieldAlert className="w-8 h-8 text-[var(--ds-color-text-secondary)] mb-2" aria-hidden="true" />
                    <p className="text-[var(--ds-color-text-secondary)] text-sm">Select a transaction to review details</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <OverrideDialog
        overrideOpen={overrideOpen}
        overrideTxn={overrideTxn}
        overrideReason={overrideReason}
        setOverrideReason={setOverrideReason}
        setOverrideOpen={setOverrideOpen}
        onConfirm={handleOverrideConfirm}
        dialogRef={overrideDialogRef}
      />
    </section>
  );
}
