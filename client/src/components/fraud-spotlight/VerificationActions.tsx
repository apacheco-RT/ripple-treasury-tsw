import React from "react";
import {
  AlertTriangle, Building2, CheckCircle2, Info, Loader2, Search, X,
} from "lucide-react";
import type { VerifAV, VerifKYB } from "@/lib/types";

interface VerificationActionsProps {
  paymentNumber: string;
  avState: "idle" | "loading" | "done";
  kybState: "idle" | "loading" | "done";
  avSteps: { label: string; done: boolean }[];
  kybSteps: { label: string; done: boolean }[];
  avResult: VerifAV | undefined;
  kybResult: VerifKYB | undefined;
  onRunAV: (pn: string) => void;
  onRunKYB: (pn: string) => void;
}

function VerificationActionsInner({
  paymentNumber: pn, avState: avS, kybState: kybS, avSteps: avSt, kybSteps: kybSt,
  avResult: avRes, kybResult: kybRes, onRunAV, onRunKYB,
}: VerificationActionsProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-[var(--ds-color-text-secondary)] font-medium m-0">Verification actions</p>
        <span className="text-xs text-[var(--ds-color-brand-primary)] flex items-center gap-1">
          <Info className="w-3 h-3" aria-hidden="true" />Enhanced screening available
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <button disabled={avS === "loading"} onClick={() => onRunAV(pn)}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-[var(--ds-radius-lg)] border text-left transition-all focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)] disabled:opacity-50
            ${avS === "done" ? "border-[var(--ds-color-brand-primary)]/30 bg-[var(--ds-color-brand-primary-subtle)]" : "border-[var(--ds-color-border-default)]/60 bg-[var(--ds-color-surface-page)] hover:border-[var(--ds-color-border-default)]"}`}>
          <Building2 className="w-4 h-4 text-[var(--ds-color-brand-primary)] shrink-0" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[var(--ds-color-text-secondary)] m-0">Account Verification</p>
            <p className="text-xs text-[var(--ds-color-text-secondary)] m-0">{avS === "idle" ? "Verify beneficiary account" : avS === "loading" ? "Running…" : "Completed"}</p>
          </div>
          {avS === "loading" && <Loader2 className="w-3.5 h-3.5 text-[var(--ds-color-brand-primary)] animate-spin shrink-0" />}
          {avS === "done" && avRes && (avRes.status === "pass" ? <CheckCircle2 className="w-3.5 h-3.5 text-[var(--ds-color-feedback-success-text)] shrink-0" /> : avRes.status === "warning" ? <AlertTriangle className="w-3.5 h-3.5 text-[var(--ds-color-feedback-warning-text)] shrink-0" /> : <X className="w-3.5 h-3.5 text-[var(--ds-color-feedback-error-text)] shrink-0" />)}
        </button>
        <button disabled={kybS === "loading"} onClick={() => onRunKYB(pn)}
          className={`flex items-center gap-2 px-3 py-2.5 rounded-[var(--ds-radius-lg)] border text-left transition-all focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)] disabled:opacity-50
            ${kybS === "done" ? "border-[var(--ds-color-brand-primary)]/30 bg-[var(--ds-color-brand-primary-subtle)]" : "border-[var(--ds-color-border-default)]/60 bg-[var(--ds-color-surface-page)] hover:border-[var(--ds-color-border-default)]"}`}>
          <Search className="w-4 h-4 text-[var(--ds-color-brand-primary)] shrink-0" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-[var(--ds-color-text-secondary)] m-0">Enhanced KYB Screening</p>
            <p className="text-xs text-[var(--ds-color-text-secondary)] m-0">{kybS === "idle" ? "Business & compliance checks" : kybS === "loading" ? "Running…" : "Completed"}</p>
          </div>
          {kybS === "loading" && <Loader2 className="w-3.5 h-3.5 text-[var(--ds-color-brand-primary)] animate-spin shrink-0" />}
          {kybS === "done" && kybRes && (kybRes.risk === "low" ? <CheckCircle2 className="w-3.5 h-3.5 text-[var(--ds-color-feedback-success-text)] shrink-0" /> : kybRes.risk === "medium" ? <AlertTriangle className="w-3.5 h-3.5 text-[var(--ds-color-feedback-warning-text)] shrink-0" /> : <X className="w-3.5 h-3.5 text-[var(--ds-color-feedback-error-text)] shrink-0" />)}
        </button>
      </div>
      {avS === "loading" && avSt.length > 0 && (
        <div className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border-default)]/60 bg-[var(--ds-color-surface-page)] px-3 py-2.5 mb-2">
          <div className="flex items-center gap-2 mb-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--ds-color-brand-primary)]" /><span className="text-xs font-medium text-[var(--ds-color-text-secondary)]">Running Account Verification…</span></div>
          <div className="space-y-1">{avSt.map((s, i) => <div key={i} className="flex items-center gap-2 text-xs">{s.done ? <CheckCircle2 className="w-3 h-3 text-[var(--ds-color-feedback-success-text)]" /> : <Loader2 className="w-3 h-3 animate-spin text-[var(--ds-color-text-secondary)]" />}<span className={s.done ? "text-[var(--ds-color-text-secondary)]" : "text-[var(--ds-color-text-secondary)]"}>{s.label}</span></div>)}</div>
        </div>
      )}
      {kybS === "loading" && kybSt.length > 0 && (
        <div className="rounded-[var(--ds-radius-lg)] border border-[var(--ds-color-border-default)]/60 bg-[var(--ds-color-surface-page)] px-3 py-2.5 mb-2">
          <div className="flex items-center gap-2 mb-1.5"><Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--ds-color-brand-primary)]" /><span className="text-xs font-medium text-[var(--ds-color-text-secondary)]">Running Enhanced KYB Screening…</span></div>
          <div className="space-y-1">{kybSt.map((s, i) => <div key={i} className="flex items-center gap-2 text-xs">{s.done ? <CheckCircle2 className="w-3 h-3 text-[var(--ds-color-feedback-success-text)]" /> : <Loader2 className="w-3 h-3 animate-spin text-[var(--ds-color-text-secondary)]" />}<span className={s.done ? "text-[var(--ds-color-text-secondary)]" : "text-[var(--ds-color-text-secondary)]"}>{s.label}</span></div>)}</div>
        </div>
      )}
      {avS === "done" && avRes && (
        <div className={`rounded-[var(--ds-radius-lg)] border px-3 py-2.5 mb-2 text-xs ${avRes.status === "pass" ? "border-[var(--ds-color-feedback-success-border)]/30 bg-[var(--ds-color-feedback-success-bg)]" : avRes.status === "warning" ? "border-[var(--ds-color-feedback-warning-border)]/30 bg-[var(--ds-color-feedback-warning-bg)]" : "border-[var(--ds-color-feedback-error-border)]/30 bg-[var(--ds-color-feedback-error-bg)]"}`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-medium text-[var(--ds-color-text-primary)]">Account Verification</span>
            <span className={`font-bold text-xs uppercase tracking-wider ${avRes.status === "pass" ? "text-[var(--ds-color-feedback-success-text)]" : avRes.status === "warning" ? "text-[var(--ds-color-feedback-warning-text)]" : "text-[var(--ds-color-feedback-error-text)]"}`}>
              {avRes.status === "pass" ? "PASS" : avRes.status === "warning" ? "WARNING" : "FAIL"} · {avRes.confidence}% confidence
            </span>
          </div>
          <div className="space-y-1 mb-2">
            {avRes.checks.map((c, i) => <div key={i} className="flex items-center gap-1.5">{c.passed ? <CheckCircle2 className="w-3 h-3 text-[var(--ds-color-feedback-success-text)] shrink-0" /> : <X className="w-3 h-3 text-[var(--ds-color-feedback-error-text)] shrink-0" />}<span className={c.passed ? "text-[var(--ds-color-text-secondary)]" : "text-[var(--ds-color-text-secondary)]"}>{c.label}</span></div>)}
          </div>
          <p className={`text-xs font-medium m-0 ${avRes.status === "pass" ? "text-[var(--ds-color-feedback-success-text)]" : avRes.status === "warning" ? "text-[var(--ds-color-feedback-warning-text)]" : "text-[var(--ds-color-feedback-error-text)]"}`}>{avRes.recommendation}</p>
        </div>
      )}
      {kybS === "done" && kybRes && (
        <div className={`rounded-[var(--ds-radius-lg)] border px-3 py-2.5 mb-2 text-xs ${kybRes.risk === "low" ? "border-[var(--ds-color-feedback-success-border)]/30 bg-[var(--ds-color-feedback-success-bg)]" : kybRes.risk === "medium" ? "border-[var(--ds-color-feedback-warning-border)]/30 bg-[var(--ds-color-feedback-warning-bg)]" : "border-[var(--ds-color-feedback-error-border)]/30 bg-[var(--ds-color-feedback-error-bg)]"}`}>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-medium text-[var(--ds-color-text-primary)]">KYB Screening</span>
            <span className={`font-bold text-xs uppercase tracking-wider ${kybRes.risk === "low" ? "text-[var(--ds-color-feedback-success-text)]" : kybRes.risk === "medium" ? "text-[var(--ds-color-feedback-warning-text)]" : "text-[var(--ds-color-feedback-error-text)]"}`}>{kybRes.status}</span>
          </div>
          <p className="text-[var(--ds-color-text-secondary)] mb-1.5 leading-relaxed m-0">{kybRes.assessment}</p>
          {kybRes.actions.length > 0 && (
            <div className="space-y-0.5 mt-1.5">
              {kybRes.actions.map((a, i) => <div key={i} className="flex items-start gap-1.5"><span className={`shrink-0 mt-0.5 ${kybRes.risk === "high" ? "text-[var(--ds-color-feedback-error-text)]" : "text-[var(--ds-color-feedback-warning-text)]"}`}>→</span><span className="text-[var(--ds-color-text-secondary)]">{a}</span></div>)}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export const VerificationActions = React.memo(VerificationActionsInner);
