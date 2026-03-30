import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckSquare, ChevronRight, Square } from "lucide-react";
import { FraudBadge } from "@/components/FraudBadge";
import { DetailCard } from "@/components/shared/DetailCard";
import type { Txn, TxnAttachment, FeatureFlags } from "@/lib/types";
import { fmtAmt } from "@/lib/mock-data";
import { Paperclip } from "lucide-react";

interface TransactionCardProps {
  txn: Txn;
  index: number;
  isExpanded: boolean;
  isSel: boolean;
  featureFlags: FeatureFlags;
  toggleExpand: (id: string) => void;
  toggleRow: (id: string) => void;
  setPaymentRailTxn: (txn: Txn) => void;
  setAttachment: (a: TxnAttachment) => void;
}

function TransactionCardInner({
  txn: t, index: i, isExpanded, isSel, featureFlags,
  toggleExpand, toggleRow, setPaymentRailTxn, setAttachment,
}: TransactionCardProps) {
  const urgencyLabel = t.overdue ? "Overdue" : t.risk >= 70 ? "High risk" : t.risk >= 40 ? "Medium risk" : "Low risk";

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(i * 0.03, 0.36), duration: 0.25 }}
      aria-label={`${urgencyLabel} — ${t.payee}, ${fmtAmt(t.amount, t.cur)}, ${t.status}`}
      className={`rounded-[var(--m3-shape-md)] border transition-colors
        ${t.overdue ? "border-l-4 border-l-rose-500"
        : t.risk >= 70 ? "border-l-4 border-l-orange-500"
        : t.risk >= 40 ? "border-l-4 border-l-amber-500/50"
        : "border-l-4 border-l-transparent"}
        ${isSel ? "bg-teal-500/5 border-teal-500/20" : "bg-surface-card border-slate-700/50"}
      `}
    >
      <div
        className="flex items-start gap-3 p-3 cursor-pointer"
        onClick={() => toggleExpand(t.id)}
        role="button"
        tabIndex={0}
        aria-expanded={isExpanded}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleExpand(t.id); } }}
      >
        <div
          className="pt-0.5 shrink-0"
          onClick={e => { e.stopPropagation(); toggleRow(t.id); }}
        >
          <button
            aria-label={isSel ? `Deselect ${t.payee}` : `Select ${t.payee}`}
            aria-pressed={isSel}
            className="p-1 min-w-[24px] min-h-[24px] flex items-center justify-center cursor-pointer text-slate-400 hover:text-teal-400 transition-colors rounded-[var(--m3-shape-xs)] focus:outline-none focus:ring-2 focus:ring-teal-400"
          >
            {isSel ? <CheckSquare className="w-4 h-4 text-teal-400" aria-hidden="true" /> : <Square className="w-4 h-4" aria-hidden="true" />}
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <span className="text-sm font-medium text-white truncate">{t.payee}</span>
            <span className="text-sm font-medium text-slate-200 whitespace-nowrap shrink-0">
              {fmtAmt(t.amount, t.cur)} <span className="text-xs text-slate-400 font-normal">{t.cur}</span>
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] px-1.5 py-0.5 rounded-[var(--m3-shape-xs)] font-medium
              ${t.status === "Needs Approval" ? "bg-amber-500/15 text-amber-300 border border-amber-500/25"
              : t.status === "Approved" ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/25"
              : "bg-slate-700/50 text-slate-300 border border-slate-600/50"}`}
            >
              {t.status}
            </span>
            <FraudBadge risk={t.risk} reason={null} />
            {featureFlags.rlusdStrip && t.rlusdEligible && t.status === "Needs Approval" && (
              <span className="inline-flex items-center px-1 py-0 rounded-[var(--m3-shape-xs)] text-[9px] font-bold text-white bg-teal-500 leading-tight">RLUSD</span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400">
            <span className="font-mono">{t.id}</span>
            <span>{t.trnDate}</span>
          </div>
        </div>

        <ChevronRight className={`w-4 h-4 text-slate-400 shrink-0 mt-1 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-slate-700/40 bg-surface-section px-3 py-3 grid grid-cols-1 gap-3">
              <DetailCard title="Payment details">
                <dl className="space-y-2">
                  {([
                    ["Approval Level", String(t.approvalLevel)],
                    ["Inst. Type", t.instType],
                    ["Model ID", t.modelId],
                    ["Risk Score", `${t.risk}/100`],
                    ["Verified", t.verified ? "Verified" : "Unverified"],
                  ] as [string, string][]).map(([label, val]) => (
                    <div key={label} className="flex items-baseline justify-between gap-3">
                      <dt className="text-xs text-slate-300 whitespace-nowrap shrink-0">{label}</dt>
                      <dd className={`text-xs font-medium text-right truncate ${label === "Verified" && !t.verified ? "text-rose-300" : "text-slate-200"}`}>{val}</dd>
                    </div>
                  ))}
                </dl>
              </DetailCard>

              <DetailCard title="Dates & Status">
                <dl className="space-y-2">
                  {([
                    ["Transaction Date", t.trnDate],
                    ["Value Date", t.valDate],
                    ["Process Stage", t.processStage],
                    ["Approver", t.approver],
                  ] as [string, string][]).map(([label, val]) => (
                    <div key={label} className="flex items-baseline justify-between gap-3">
                      <dt className="text-xs text-slate-300 whitespace-nowrap shrink-0">{label}</dt>
                      <dd className="text-xs font-medium text-right truncate text-slate-200">{val}</dd>
                    </div>
                  ))}
                </dl>
              </DetailCard>

              <DetailCard title="Account information">
                <dl className="space-y-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-xs text-slate-300 whitespace-nowrap shrink-0">Operative Acct.</dt>
                    <dd className="text-xs font-medium text-right text-teal-400 font-mono truncate">
                      {featureFlags.selectPaymentRail ? (
                        <button
                          onClick={e => { e.stopPropagation(); setPaymentRailTxn(t); }}
                          className="text-teal-400 hover:text-teal-300 hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-teal-400 rounded-[var(--m3-shape-xs)]"
                        >
                          {t.operativeAcct}
                        </button>
                      ) : t.operativeAcct}
                    </dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-xs text-slate-300 whitespace-nowrap shrink-0">Account Name</dt>
                    <dd className="text-xs font-medium text-right text-slate-200 truncate">{t.payee}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-xs text-slate-300 whitespace-nowrap shrink-0">Account No.</dt>
                    <dd className="text-xs font-medium text-right text-slate-200 font-mono truncate">{t.offsetNumber}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-xs text-slate-300 whitespace-nowrap shrink-0">Legal Entity</dt>
                    <dd className="text-xs font-medium text-right text-slate-200 truncate">{t.legalEntity}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-xs text-slate-300 whitespace-nowrap shrink-0">Bank</dt>
                    <dd className="text-xs font-medium text-right text-slate-200 truncate">{t.bank}</dd>
                  </div>
                </dl>
              </DetailCard>

              <DetailCard title="Additional info">
                <dl className="space-y-2">
                  <div className="flex items-baseline justify-between gap-3">
                    <dt className="text-xs text-slate-300 whitespace-nowrap shrink-0">Type</dt>
                    <dd className="text-xs font-medium text-right text-slate-200">{t.type}</dd>
                  </div>
                  {t.riskReason && (
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-xs text-slate-300 whitespace-nowrap shrink-0">Risk Reason</dt>
                      <dd className="text-xs font-medium text-right text-rose-300 truncate">{t.riskReason}</dd>
                    </div>
                  )}
                  {t.waterfallChain && (
                    <div className="flex items-baseline justify-between gap-3">
                      <dt className="text-xs text-slate-300 whitespace-nowrap shrink-0">Chain</dt>
                      <dd className="text-xs font-medium text-right text-teal-400">
                        {t.waterfallChain} ({t.waterfallPosition}/{t.waterfallTotal})
                      </dd>
                    </div>
                  )}
                  {t.attachment && (
                    <div className="flex items-center gap-2 pt-1">
                      <Paperclip className="w-3 h-3 text-slate-400 shrink-0" aria-hidden="true" />
                      <button
                        onClick={e => { e.stopPropagation(); setAttachment(t.attachment!); }}
                        className="text-xs text-teal-400 hover:underline truncate focus:outline-none focus:ring-2 focus:ring-teal-400 rounded-[var(--m3-shape-xs)]"
                      >
                        {t.attachment.name}
                      </button>
                    </div>
                  )}
                </dl>
              </DetailCard>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export const TransactionCard = React.memo(TransactionCardInner);
