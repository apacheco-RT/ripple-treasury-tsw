import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { CheckSquare, SearchX, Square, X } from "lucide-react";
import { useFocusTrap } from "@/hooks/use-focus-trap";
import { useIsMobile } from "@/hooks/use-mobile";
import { useToast } from "@/hooks/use-toast";
import { FraudGateModal } from "@/components/FraudGateModal";
import { RejectModal } from "@/components/RejectModal";
import { ApproveConfirmModal } from "@/components/ApproveConfirmModal";
import { PaymentRailDialog } from "@/components/results-table/PaymentRailDialog";
import { TableToolbar } from "@/components/results-table/TableToolbar";
import { TransactionRow } from "@/components/results-table/TransactionRow";
import { TransactionCard } from "@/components/results-table/TransactionCard";
import { TablePagination } from "@/components/results-table/TablePagination";
import { AttachmentViewer } from "@/components/results-table/AttachmentViewer";
import { DEFAULT_FILTERS, type Txn, type TxnAttachment, type TrayFilter, type Filters, type FeatureFlags } from "@/lib/types";
import { fmtAmt, ALL_COLS, DEFAULT_COLS } from "@/lib/mock-data";

function parseDDMMYYYY(s: string): number {
  const [d, m, y] = s.split("/");
  return new Date(+y, +m - 1, +d).getTime();
}

function parseYYYYMMDD(s: string): number {
  return new Date(s + "T00:00:00").getTime();
}

export function ResultsTable({ txns, tray, filters, setFilters, featureFlags = { rlusdStrip: false, stablecoinRail: false, selectPaymentRail: false, riskColumn: false } }: { txns: Txn[]; tray: TrayFilter; filters: Filters; setFilters: (f: Filters) => void; featureFlags?: FeatureFlags }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showColPicker, setShowColPicker] = useState(false);
  const colPickerRef = useRef<HTMLDivElement>(null);
  const [showFraudGate, setShowFraudGate] = useState(false);
  const [showVoid, setShowVoid] = useState(false);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [paymentRailTxn, setPaymentRailTxn] = useState<Txn | null>(null);
  const [attachment, setAttachment] = useState<TxnAttachment | null>(null);
  const [rlusdOnly, setRlusdOnly] = useState(false);
  const paymentRailDialogRef = useRef<HTMLDivElement>(null);
  useFocusTrap(!!paymentRailTxn, paymentRailDialogRef);
  const [refreshing, setRefreshing] = useState(false);
  const [sortCol, setSortCol] = useState("urgency");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [cols, setCols] = useState(DEFAULT_COLS);
  const [page, setPage] = useState(1);
  const [tableSearch, setTableSearch] = useState("");

  const isMobile = useIsMobile();
  const { toast } = useToast();

  const rowsPerPage = parseInt(filters.rowsPerPage) || 25;

  const effectiveCols = useMemo(() => ({ ...cols, risk: cols.risk && featureFlags.riskColumn }), [cols, featureFlags.riskColumn]);

  const filtered = useMemo(() => {
    const fromMs = filters.dateFrom ? parseYYYYMMDD(filters.dateFrom) : 0;
    const toMs = filters.dateTo ? parseYYYYMMDD(filters.dateTo) : Infinity;
    const useDateType = filters.dateType;

    return txns.filter(t => {
      const q = filters.quickSearch.toLowerCase();
      if (q && !t.id.toLowerCase().includes(q) && !t.payee.toLowerCase().includes(q)) return false;
      const ts = tableSearch.toLowerCase();
      if (ts && !t.id.toLowerCase().includes(ts) && !t.payee.toLowerCase().includes(ts)) return false;
      if (filters.status && t.status !== filters.status) return false;
      if (filters.processStage && t.processStage !== filters.processStage) return false;
      if (filters.txnType && t.type !== filters.txnType) return false;
      if (filters.legalEntity && t.legalEntity !== filters.legalEntity) return false;
      if (filters.payee && !t.payee.toLowerCase().includes(filters.payee.toLowerCase())) return false;
      if (filters.txnNum && !t.id.toLowerCase().includes(filters.txnNum.toLowerCase())) return false;
      if (filters.showMyItems && t.approver !== "A. Pacheco") return false;
      if (rlusdOnly && !t.rlusdEligible) return false;

      if (filters.dateFrom || filters.dateTo) {
        const dateStr = useDateType === "Value date" ? t.valDate : t.trnDate;
        const txnMs = parseDDMMYYYY(dateStr);
        if (txnMs < fromMs || txnMs > toMs) return false;
      }

      if (tray === "overdue") return t.overdue;
      if (tray === "high-risk") return t.risk >= 70;
      return true;
    });
  }, [txns, filters, tableSearch, rlusdOnly, tray]);

  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    if (sortCol === "urgency") return ((b.overdue ? 200 : 0) + b.risk) - ((a.overdue ? 200 : 0) + a.risk);
    if (sortCol === "amount") return sortDir === "desc" ? b.amount - a.amount : a.amount - b.amount;
    if (sortCol === "risk") return sortDir === "desc" ? b.risk - a.risk : a.risk - b.risk;
    const strSort = (av: string, bv: string) => sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    if (sortCol === "trnNum") return strSort(a.id, b.id);
    if (sortCol === "trnDate") return strSort(a.trnDate, b.trnDate);
    if (sortCol === "valDate") return strSort(a.valDate, b.valDate);
    if (sortCol === "payee") return strSort(a.payee, b.payee);
    if (sortCol === "operativeAcct") return strSort(a.operativeAcct, b.operativeAcct);
    if (sortCol === "instType") return strSort(a.instType, b.instType);
    if (sortCol === "offsetNum") return strSort(a.offsetNumber, b.offsetNumber);
    return 0;
  }), [filtered, sortCol, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / rowsPerPage));
  const pageRows = useMemo(() => sorted.slice((page - 1) * rowsPerPage, page * rowsPerPage), [sorted, page, rowsPerPage]);

  useEffect(() => { setPage(1); }, [filters, tray]);

  useEffect(() => {
    if (!showColPicker) return;
    const onMouse = (e: MouseEvent) => {
      if (colPickerRef.current && !colPickerRef.current.contains(e.target as Node)) {
        setShowColPicker(false);
      }
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setShowColPicker(false); };
    document.addEventListener("mousedown", onMouse);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouse);
      document.removeEventListener("keydown", onKey);
    };
  }, [showColPicker]);

  const visibleColCount = useMemo(() => Object.values(effectiveCols).filter(Boolean).length, [effectiveCols]);
  const totalColSpan = visibleColCount + 3;

  const allSel = pageRows.length > 0 && pageRows.every(t => selected.includes(t.id));
  const toggleAll = useCallback(() => setSelected(s => {
    const allSelected = pageRows.length > 0 && pageRows.every(t => s.includes(t.id));
    return allSelected ? [] : pageRows.map(t => t.id);
  }), [pageRows]);
  const toggleRow = useCallback((id: string) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]), []);
  const toggleExpand = useCallback((id: string) => setExpandedRow(e => e === id ? null : id), []);

  const selTxns = useMemo(() => txns.filter(t => selected.includes(t.id)), [txns, selected]);
  const flaggedInSel = useMemo(() => selTxns.filter(t => t.risk >= 70).length, [selTxns]);

  const handleApprove = useCallback(() => {
    if (flaggedInSel > 0) {
      setShowFraudGate(true);
    } else {
      setShowApproveConfirm(true);
    }
  }, [flaggedInSel]);

  const handleConfirmApprove = useCallback(() => {
    const count = selected.length;
    setShowApproveConfirm(false);
    setSelected([]);
    toast({
      title: "Transactions approved",
      description: `${count} transaction${count !== 1 ? "s" : ""} approved successfully.`,
    });
  }, [selected.length, toast]);

  const handleRefresh = useCallback(() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1200); }, []);
  const handleSort = useCallback((col: string) => {
    setSortCol(prev => {
      if (prev === col) {
        setSortDir(d => d === "asc" ? "desc" : "asc");
        return prev;
      }
      setSortDir("desc");
      return col;
    });
  }, []);

  const handleClosePaymentRail = useCallback(() => setPaymentRailTxn(null), []);
  const handleCloseAttachment = useCallback(() => setAttachment(null), []);
  const handleCloseFraudGate = useCallback(() => setShowFraudGate(false), []);
  const handleCloseVoid = useCallback(() => setShowVoid(false), []);
  const handleCloseApproveConfirm = useCallback(() => setShowApproveConfirm(false), []);

  const handleApproveAnyway = useCallback(() => {
    const count = selected.length;
    setShowFraudGate(false);
    setSelected([]);
    toast({
      title: "Transactions approved",
      description: `${count} transaction${count !== 1 ? "s" : ""} approved (including high-risk items).`,
    });
  }, [selected.length, toast]);

  const handleConfirmReject = useCallback(() => {
    const count = selected.length;
    setSelected([]);
    setShowVoid(false);
    toast({
      title: "Transactions rejected",
      description: `${count} transaction${count !== 1 ? "s" : ""} rejected successfully.`,
      variant: "destructive",
    });
  }, [selected.length, toast]);

  const handleHold = useCallback(() => {
    const count = selected.length;
    setSelected([]);
    toast({
      title: "Transactions held",
      description: `${count} transaction${count !== 1 ? "s" : ""} placed on hold.`,
    });
  }, [selected.length, toast]);

  const th = "px-3 py-3 text-sm text-[var(--ds-color-text-primary)] font-medium text-left whitespace-nowrap select-none cursor-pointer hover:text-white transition-colors focus:outline-hidden focus:ring-inset focus:ring-2 focus:ring-[var(--ds-color-brand-primary)]";
  const td = "px-3 py-3";

  return (
    <section aria-label="Transaction results">
      <div className="flex items-center px-4 py-3 bg-[var(--ds-color-surface-default)] border border-b border-[var(--ds-color-border-default)]/50 rounded-t-[var(--ds-radius-xl)]">
        <h2 className="text-base font-medium text-white">Transaction details</h2>
      </div>

      <TableToolbar
        selected={selected}
        sortCol={sortCol}
        handleApprove={handleApprove}
        setShowVoid={setShowVoid}
        setSelected={setSelected}
        setSortCol={setSortCol}
        tableSearch={tableSearch}
        setTableSearch={setTableSearch}
        setPage={setPage}
        showColPicker={showColPicker}
        setShowColPicker={setShowColPicker}
        cols={cols}
        setCols={setCols}
        colPickerRef={colPickerRef}
        refreshing={refreshing}
        handleRefresh={handleRefresh}
        sorted={sorted}
        page={page}
        rowsPerPage={rowsPerPage}
        handleHold={handleHold}
      />

      {featureFlags.rlusdStrip && (() => {
        const rlusdCount = filtered.filter(t => t.rlusdEligible && t.status === "Needs Approval").length;
        if (rlusdCount === 0) return null;
        return (
          <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--ds-color-brand-primary-subtle)] border-x border-t border-[var(--ds-color-brand-primary)]/25 border-b border-b-[var(--ds-color-brand-primary)]/25">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-[var(--ds-radius-xs)] text-xs font-bold text-[var(--ds-color-text-on-brand)] bg-[var(--ds-color-brand-primary)]">RLUSD</span>
              <span className="text-xs font-medium text-[var(--ds-color-text-secondary)]">
                {rlusdCount} transaction{rlusdCount !== 1 ? "s" : ""} eligible for instant RLUSD settlement
              </span>
            </div>
            <button onClick={() => setRlusdOnly(v => !v)}
              className="text-xs font-medium text-[var(--ds-color-brand-primary)] hover:text-[var(--ds-color-brand-primary-hover)] transition-colors focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)] rounded-[var(--ds-radius-xs)] px-1">
              {rlusdOnly ? "Show all" : "View eligible only"}
            </button>
          </div>
        );
      })()}

      <div className="bg-[var(--ds-color-surface-default)] border border-[var(--ds-color-border-default)]/50 rounded-b-[var(--ds-radius-xl)] overflow-x-auto">
        {isMobile ? (
          <div className="p-2 space-y-2">
            {pageRows.map((t, i) => (
              <TransactionCard
                key={t.id}
                txn={t}
                index={i}
                isExpanded={expandedRow === t.id}
                isSel={selected.includes(t.id)}
                featureFlags={featureFlags}
                toggleExpand={toggleExpand}
                toggleRow={toggleRow}
                setPaymentRailTxn={setPaymentRailTxn}
                setAttachment={setAttachment}
              />
            ))}
          </div>
        ) : (
          <table className="w-full text-left border-collapse text-sm" aria-label="Transactions matching current filters">
            <caption className="sr-only">
              Transaction results — {sorted.length} transactions, sorted by {sortCol === "urgency" ? "urgency (overdue first, then risk score)" : sortCol}
            </caption>
            <thead>
              <tr className="bg-[var(--ds-color-surface-sunken)] border-b border-[var(--ds-color-border-default)]/60">
                <th scope="col" className="pl-3 pr-1 py-3 w-6" aria-hidden="true" />
                <th scope="col" className="px-3 py-3 w-9">
                  <button onClick={toggleAll}
                    aria-label={allSel ? "Deselect all transactions" : "Select all transactions on this page"}
                    aria-pressed={allSel}
                    className="p-1 min-w-[24px] min-h-[24px] flex items-center justify-center text-[var(--ds-color-text-secondary)] hover:text-white transition-colors rounded-[var(--ds-radius-xs)] focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)]">
                    {allSel ? <CheckSquare className="w-4 h-4 text-[var(--ds-color-brand-primary)]" aria-hidden="true" /> : <Square className="w-4 h-4" aria-hidden="true" />}
                  </button>
                </th>
                {effectiveCols.risk && <th scope="col" className={th} tabIndex={0} role="button" onClick={() => handleSort("risk")}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSort("risk"); } }}
                  aria-sort={sortCol === "risk" ? (sortDir === "desc" ? "descending" : "ascending") : "none"}>
                  Risk {sortCol === "risk" ? <span aria-hidden="true">{sortDir === "desc" ? "↓" : "↑"}</span> : <span aria-hidden="true" className="opacity-30">↕</span>}
                </th>}
                {cols.trnNum && <th scope="col" className={th} tabIndex={0} role="button" onClick={() => handleSort("trnNum")}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSort("trnNum"); } }}
                  aria-sort={sortCol === "trnNum" ? (sortDir === "desc" ? "descending" : "ascending") : "none"}>
                  Trn. Number {sortCol === "trnNum" ? <span aria-hidden="true">{sortDir === "desc" ? "↓" : "↑"}</span> : <span aria-hidden="true" className="opacity-30">↕</span>}
                </th>}
                {cols.trnDate && <th scope="col" className={th} tabIndex={0} role="button" onClick={() => handleSort("trnDate")}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSort("trnDate"); } }}
                  aria-sort={sortCol === "trnDate" ? (sortDir === "desc" ? "descending" : "ascending") : "none"}>
                  Trn. Date {sortCol === "trnDate" ? <span aria-hidden="true">{sortDir === "desc" ? "↓" : "↑"}</span> : <span aria-hidden="true" className="opacity-30">↕</span>}
                </th>}
                {cols.amount && <th scope="col" className={`${th} text-right`} tabIndex={0} role="button" onClick={() => handleSort("amount")}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSort("amount"); } }}
                  aria-sort={sortCol === "amount" ? (sortDir === "desc" ? "descending" : "ascending") : "none"}>
                  Amount {sortCol === "amount" ? <span aria-hidden="true">{sortDir === "desc" ? "↓" : "↑"}</span> : <span aria-hidden="true" className="opacity-30">↕</span>}
                </th>}
                {cols.payee && <th scope="col" className={th} tabIndex={0} role="button" onClick={() => handleSort("payee")}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSort("payee"); } }}
                  aria-sort={sortCol === "payee" ? (sortDir === "desc" ? "descending" : "ascending") : "none"}>
                  Beneficiary {sortCol === "payee" ? <span aria-hidden="true">{sortDir === "desc" ? "↓" : "↑"}</span> : <span aria-hidden="true" className="opacity-30">↕</span>}
                </th>}
                {cols.operativeAcct && <th scope="col" className={th} tabIndex={0} role="button" onClick={() => handleSort("operativeAcct")}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSort("operativeAcct"); } }}
                  aria-sort={sortCol === "operativeAcct" ? (sortDir === "desc" ? "descending" : "ascending") : "none"}>
                  Operative Account {sortCol === "operativeAcct" ? <span aria-hidden="true">{sortDir === "desc" ? "↓" : "↑"}</span> : <span aria-hidden="true" className="opacity-30">↕</span>}
                </th>}
                {cols.instType && <th scope="col" className={th} tabIndex={0} role="button" onClick={() => handleSort("instType")}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSort("instType"); } }}
                  aria-sort={sortCol === "instType" ? (sortDir === "desc" ? "descending" : "ascending") : "none"}>
                  Type {sortCol === "instType" ? <span aria-hidden="true">{sortDir === "desc" ? "↓" : "↑"}</span> : <span aria-hidden="true" className="opacity-30">↕</span>}
                </th>}
                {cols.valDate && <th scope="col" className={th} tabIndex={0} role="button" onClick={() => handleSort("valDate")}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSort("valDate"); } }}
                  aria-sort={sortCol === "valDate" ? (sortDir === "desc" ? "descending" : "ascending") : "none"}>
                  Value Date {sortCol === "valDate" ? <span aria-hidden="true">{sortDir === "desc" ? "↓" : "↑"}</span> : <span aria-hidden="true" className="opacity-30">↕</span>}
                </th>}
                {cols.offsetNum && <th scope="col" className={th} tabIndex={0} role="button" onClick={() => handleSort("offsetNum")}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleSort("offsetNum"); } }}
                  aria-sort={sortCol === "offsetNum" ? (sortDir === "desc" ? "descending" : "ascending") : "none"}>
                  Account No. {sortCol === "offsetNum" ? <span aria-hidden="true">{sortDir === "desc" ? "↓" : "↑"}</span> : <span aria-hidden="true" className="opacity-30">↕</span>}
                </th>}
                <th scope="col" className="px-3 py-3 text-sm text-[var(--ds-color-text-primary)] font-medium text-left whitespace-nowrap w-px">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--ds-color-border-default)]/30">
              {pageRows.map((t, i) => (
                <TransactionRow
                  key={t.id}
                  txn={t}
                  index={i}
                  isExpanded={expandedRow === t.id}
                  isSel={selected.includes(t.id)}
                  effectiveCols={effectiveCols}
                  cols={cols}
                  featureFlags={featureFlags}
                  totalColSpan={totalColSpan}
                  toggleExpand={toggleExpand}
                  toggleRow={toggleRow}
                  setPaymentRailTxn={setPaymentRailTxn}
                  setAttachment={setAttachment}
                  td={td}
                />
              ))}
            </tbody>
          </table>
        )}

        {sorted.length === 0 && (
          <div className="py-16 text-center" role="status">
            <SearchX className="w-10 h-10 text-[var(--ds-color-text-secondary)] mx-auto mb-3" aria-hidden="true" />
            <p className="text-[var(--ds-color-text-secondary)] text-sm font-medium mb-1">No payments match these filters</p>
            <p className="text-[var(--ds-color-text-secondary)] text-xs mb-4">Try adjusting the filter criteria or clearing filters to see all transactions.</p>
            <button
              onClick={() => { setTableSearch(""); setRlusdOnly(false); setFilters({ ...DEFAULT_FILTERS, rowsPerPage: filters.rowsPerPage }); }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium text-[var(--ds-color-brand-primary)] hover:text-[var(--ds-color-brand-primary-hover)] bg-[var(--ds-color-brand-primary-subtle)] hover:brightness-110 border border-[var(--ds-color-brand-primary)]/20 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ds-color-brand-primary)]"
            >
              <X className="w-3.5 h-3.5" aria-hidden="true" />
              Clear all filters
            </button>
          </div>
        )}

        <TablePagination
          sorted={sorted}
          page={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          setPage={setPage}
          filters={filters}
          setFilters={setFilters}
        />
      </div>

      <FraudGateModal
        open={showFraudGate}
        onClose={handleCloseFraudGate}
        selected={selected}
        selTxns={selTxns}
        onReview={handleCloseFraudGate}
        onApproveAnyway={handleApproveAnyway}
      />

      <RejectModal
        open={showVoid}
        onClose={handleCloseVoid}
        count={selected.length}
        onConfirm={handleConfirmReject}
      />

      <ApproveConfirmModal
        open={showApproveConfirm}
        onClose={handleCloseApproveConfirm}
        count={selected.length}
        onConfirm={handleConfirmApprove}
      />

      <PaymentRailDialog txn={paymentRailTxn} dialogRef={paymentRailDialogRef} onClose={handleClosePaymentRail} showStablecoin={featureFlags.stablecoinRail} />

      <AttachmentViewer attachment={attachment} onClose={handleCloseAttachment} />
    </section>
  );
}
