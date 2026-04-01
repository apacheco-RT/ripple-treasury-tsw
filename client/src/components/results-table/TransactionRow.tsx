import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, CheckSquare, ChevronRight, Eye,
  Paperclip, RefreshCw, Square, XCircle, CircleCheckBig,
} from "lucide-react";
import { FraudBadge } from "@/components/FraudBadge";
import { IconButton } from "@/components/shared/IconButton";
import { DetailCard } from "@/components/shared/DetailCard";
import type { Txn, TxnAttachment, FeatureFlags } from "@/lib/types";
import { fmtAmt } from "@/lib/mock-data";

interface TransactionRowProps {
  txn: Txn;
  index: number;
  isExpanded: boolean;
  isSel: boolean;
  effectiveCols: Record<string, boolean>;
  cols: Record<string, boolean>;
  featureFlags: FeatureFlags;
  totalColSpan: number;
  toggleExpand: (id: string) => void;
  toggleRow: (id: string) => void;
  setPaymentRailTxn: (txn: Txn) => void;
  setAttachment: (a: TxnAttachment) => void;
  td: string;
}

function TransactionRowInner({
  txn: t, index: i, isExpanded, isSel, effectiveCols, cols, featureFlags,
  totalColSpan, toggleExpand, toggleRow, setPaymentRailTxn, setAttachment, td,
}: TransactionRowProps) {
  const urgencyLabel = t.overdue ? "Overdue" : t.risk >= 70 ? "High risk" : t.risk >= 40 ? "Medium risk" : "Low risk";
  return (
    <React.Fragment>
      <motion.tr
        initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.03, 0.36), duration: 0.25 }}
        onClick={() => toggleExpand(t.id)}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleExpand(t.id); } }}
        tabIndex={0}
        aria-expanded={isExpanded}
        aria-label={`${urgencyLabel} — ${t.payee}, ${fmtAmt(t.amount, t.cur)}, ${t.status}`}
        className={`transition-colors cursor-pointer border-l-2 focus:outline-hidden focus:ring-inset focus:ring-2 focus:ring-[var(--ds-color-brand-primary)]
          ${t.overdue ? "border-l-[var(--ds-color-feedback-error-border)]"
          : t.risk >= 70 ? "border-l-[var(--ds-color-feedback-error-icon)]"
          : t.risk >= 40 ? "border-l-[var(--ds-color-feedback-warning-border)]"
          : "border-l-transparent"}
          ${isExpanded ? "bg-[var(--ds-color-surface-raised)]/20" : isSel ? "bg-[var(--ds-color-interactive-selected-bg)] hover:bg-[var(--ds-color-interactive-selected-bg)]" : "bg-[var(--ds-color-surface-page)] hover:bg-[var(--ds-color-interactive-selected-bg)]"}`}>

        <td className="pl-3 pr-1 py-3" aria-hidden="true">
          <ChevronRight className={`w-3.5 h-3.5 text-[var(--ds-color-text-secondary)] transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
        </td>
        <td className={td} onClick={e => { e.stopPropagation(); toggleRow(t.id); }}>
          <button
            aria-label={isSel ? `Deselect ${t.payee}` : `Select ${t.payee}`}
            aria-pressed={isSel}
            className="p-1 min-w-[24px] min-h-[24px] flex items-center justify-center cursor-pointer text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-brand-primary)] transition-colors rounded-[var(--ds-radius-xs)] focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)]">
            {isSel ? <CheckSquare className="w-4 h-4 text-[var(--ds-color-brand-primary)]" aria-hidden="true" /> : <Square className="w-4 h-4" aria-hidden="true" />}
          </button>
        </td>
        {effectiveCols.risk && <td className={td} onClick={e => e.stopPropagation()}><FraudBadge risk={t.risk} reason={null} /></td>}
        {cols.trnNum && (
          <td className={`${td} font-mono text-xs text-[var(--ds-color-text-secondary)] whitespace-nowrap`}>
            {t.id}
            {featureFlags.rlusdStrip && t.rlusdEligible && t.status === "Needs Approval" && (
              <span className="ml-1.5 inline-flex items-center px-1 py-0 rounded-[var(--ds-radius-xs)] text-[9px] font-bold text-[var(--ds-color-text-on-brand)] bg-[var(--ds-color-brand-primary)] leading-tight">RLUSD</span>
            )}
          </td>
        )}
        {cols.trnDate && <td className={`${td} text-xs text-[var(--ds-color-text-secondary)]`}>{t.trnDate}</td>}
        {cols.amount && (
          <td className={`${td} text-sm font-medium text-[var(--ds-color-text-primary)] whitespace-nowrap text-right`}>
            {fmtAmt(t.amount, t.cur)} <span className="text-xs text-[var(--ds-color-text-secondary)] font-normal">{t.cur}</span>
          </td>
        )}
        {cols.payee && <td className={`${td} text-sm font-medium text-[var(--ds-color-text-primary)] whitespace-nowrap`}>{t.payee}</td>}
        {cols.operativeAcct && (
          <td className={`${td} font-mono text-xs whitespace-nowrap`}>
            <button
              aria-label={`View operative account ${t.operativeAcct}`}
              onClick={e => e.stopPropagation()}
              className="inline-flex items-center min-h-6 px-0.5 text-[var(--ds-color-brand-primary)] hover:text-[var(--ds-color-brand-primary-hover)] hover:underline transition-colors focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)] rounded-[var(--ds-radius-xs)]">
              {t.operativeAcct}
            </button>
          </td>
        )}
        {cols.instType && (
          <td className={td}>
            <span className="text-xs px-1.5 py-0.5 rounded-[var(--ds-radius-lg)] bg-[var(--ds-color-surface-raised)]/60 border border-[var(--ds-color-border-default)] text-[var(--ds-color-text-secondary)] font-medium">{t.instType}</span>
          </td>
        )}
        {cols.valDate && <td className={`${td} text-xs text-[var(--ds-color-text-secondary)]`}>{t.valDate}</td>}
        {cols.offsetNum && <td className={`${td} font-mono text-xs text-[var(--ds-color-text-secondary)]`}>{t.offsetNumber}</td>}
        <td className={`${td} whitespace-nowrap`} onClick={e => e.stopPropagation()}>
          <div className="flex items-center gap-1">
            <IconButton variant="view" onClick={() => {}} aria-label={`View details for ${t.id}`} title="View"
              icon={<Eye className="w-3.5 h-3.5" aria-hidden="true" />} />
            <IconButton variant="confirm" onClick={() => {}} aria-label={`Confirm ${t.id}`} title="Confirm"
              icon={<CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" />} />
            <IconButton variant="complete" onClick={() => {}} aria-label={`Complete ${t.id}`} title="Complete"
              icon={<CircleCheckBig className="w-3.5 h-3.5" aria-hidden="true" />} />
            <IconButton variant="reextract" onClick={() => {}} aria-label={`Re-extract ${t.id}`} title="Re-extract"
              icon={<RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />} />
            <IconButton variant="fail" onClick={() => {}} aria-label={`Fail ${t.id}`} title="Fail"
              icon={<XCircle className="w-3.5 h-3.5" aria-hidden="true" />} />
          </div>
        </td>
      </motion.tr>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <tr>
            <td colSpan={totalColSpan} className="p-0 border-b border-[var(--ds-color-border-default)]">
              <motion.div
                initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="bg-[var(--ds-color-surface-page)] px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <DetailCard title="Payment details">
                    <dl className="space-y-2.5">
                      {([
                        ["Approval Level", String(t.approvalLevel)],
                        ["Inst. Type", t.instType],
                        ["Model ID", t.modelId],
                        ["Risk Score", `${t.risk}/100`],
                        ["Verified", t.verified ? "✓ Verified" : "✗ Unverified"],
                      ] as [string, string][]).map(([label, val]) => (
                        <div key={label} className="flex items-baseline justify-between gap-3">
                          <dt className="text-xs text-[var(--ds-color-text-secondary)] whitespace-nowrap shrink-0">{label}</dt>
                          <dd className={`text-xs font-medium text-right truncate ${label === "Verified" && !t.verified ? "text-[var(--ds-color-feedback-error-text)]" : "text-[var(--ds-color-text-primary)]"}`}>{val}</dd>
                        </div>
                      ))}
                    </dl>
                  </DetailCard>

                  <DetailCard title="Dates">
                    <dl className="space-y-2.5">
                      {([
                        ["Transaction Date", t.trnDate],
                        ["Value Date", t.valDate],
                        ["Process Stage", t.processStage],
                        ["Approver", t.approver],
                      ] as [string, string][]).map(([label, val]) => (
                        <div key={label} className="flex items-baseline justify-between gap-3">
                          <dt className="text-xs text-[var(--ds-color-text-secondary)] whitespace-nowrap shrink-0">{label}</dt>
                          <dd className="text-xs font-medium text-right truncate text-[var(--ds-color-text-primary)]">{val}</dd>
                        </div>
                      ))}
                    </dl>
                  </DetailCard>

                  <DetailCard title="Account information">
                    <dl className="space-y-2.5">
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-xs text-[var(--ds-color-text-secondary)] whitespace-nowrap shrink-0">Operative Acct.</dt>
                        <dd className="text-xs font-medium text-right text-[var(--ds-color-brand-primary)] font-mono truncate">{t.operativeAcct}</dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-xs text-[var(--ds-color-text-secondary)] whitespace-nowrap shrink-0">Account Name</dt>
                        <dd className="text-xs font-medium text-right text-[var(--ds-color-text-primary)] truncate">{t.payee}</dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-xs text-[var(--ds-color-text-secondary)] whitespace-nowrap shrink-0">Account No.</dt>
                        <dd className="text-xs font-medium text-right text-[var(--ds-color-text-primary)] font-mono truncate">{t.offsetNumber}</dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-xs text-[var(--ds-color-text-secondary)] whitespace-nowrap shrink-0">Legal Entity</dt>
                        <dd className="text-xs font-medium text-right text-[var(--ds-color-text-primary)] truncate">{t.legalEntity}</dd>
                      </div>
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-xs text-[var(--ds-color-text-secondary)] whitespace-nowrap shrink-0">Bank</dt>
                        <dd className="text-xs font-medium text-right text-[var(--ds-color-text-primary)] truncate">{t.bank}</dd>
                      </div>
                    </dl>
                  </DetailCard>

                  <DetailCard title="Additional info">
                    <dl className="space-y-2.5">
                      <div className="flex items-baseline justify-between gap-3">
                        <dt className="text-xs text-[var(--ds-color-text-secondary)] whitespace-nowrap shrink-0">Type</dt>
                        <dd className="text-xs font-medium text-right text-[var(--ds-color-text-primary)]">{t.type}</dd>
                      </div>
                      {t.riskReason && (
                        <div className="flex items-baseline justify-between gap-3">
                          <dt className="text-xs text-[var(--ds-color-text-secondary)] whitespace-nowrap shrink-0">Risk Reason</dt>
                          <dd className="text-xs font-medium text-right text-[var(--ds-color-feedback-error-text)] truncate">{t.riskReason}</dd>
                        </div>
                      )}
                      {t.waterfallChain && (
                        <div className="flex items-baseline justify-between gap-3">
                          <dt className="text-xs text-[var(--ds-color-text-secondary)] whitespace-nowrap shrink-0">Chain</dt>
                          <dd className="text-xs font-medium text-right">
                            <button className="text-[var(--ds-color-brand-primary)] hover:underline focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)] rounded-[var(--ds-radius-xs)]">
                              {t.waterfallChain} ({t.waterfallPosition}/{t.waterfallTotal})
                            </button>
                          </dd>
                        </div>
                      )}
                      {t.attachment && (
                        <div className="flex items-center gap-2 pt-1">
                          <Paperclip className="w-3 h-3 text-[var(--ds-color-text-secondary)] shrink-0" aria-hidden="true" />
                          <button
                            onClick={e => { e.stopPropagation(); setAttachment(t.attachment!); }}
                            className="text-xs text-[var(--ds-color-brand-primary)] hover:underline truncate focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)] rounded-[var(--ds-radius-xs)]">
                            {t.attachment.name}
                          </button>
                        </div>
                      )}
                    </dl>
                  </DetailCard>
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </React.Fragment>
  );
}

export const TransactionRow = React.memo(TransactionRowInner);
