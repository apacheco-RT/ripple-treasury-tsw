import React from "react";
import {
  CheckCircle2, ChevronUp, Download, PauseCircle, RefreshCw, Search, Trash2, X,
} from "lucide-react";
import { ColumnPicker } from "./ColumnPicker";
import { IconButton } from "@/components/shared/IconButton";
import { cn } from "@/lib/utils";

type ColsState = { risk: boolean; trnNum: boolean; trnDate: boolean; amount: boolean; payee: boolean; operativeAcct: boolean; instType: boolean; valDate: boolean; offsetNum: boolean };

interface TableToolbarProps {
  selected: string[];
  sortCol: string;
  handleApprove: () => void;
  setShowVoid: React.Dispatch<React.SetStateAction<boolean>>;
  setSelected: React.Dispatch<React.SetStateAction<string[]>>;
  setSortCol: React.Dispatch<React.SetStateAction<string>>;
  tableSearch: string;
  setTableSearch: (v: string) => void;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  showColPicker: boolean;
  setShowColPicker: React.Dispatch<React.SetStateAction<boolean>>;
  cols: ColsState;
  setCols: React.Dispatch<React.SetStateAction<ColsState>>;
  colPickerRef: React.RefObject<HTMLDivElement>;
  refreshing: boolean;
  handleRefresh: () => void;
  sorted: { length: number };
  page: number;
  rowsPerPage: number;
  handleHold?: () => void;
  className?: string;
}

function TableToolbarInner({
  selected, sortCol, handleApprove, setShowVoid, setSelected, setSortCol,
  tableSearch, setTableSearch, setPage, showColPicker, setShowColPicker,
  cols, setCols, colPickerRef, refreshing, handleRefresh, sorted, page, rowsPerPage, handleHold, className,
}: TableToolbarProps) {
  return (
    <div className={cn("flex items-center justify-between px-3 py-2 bg-[var(--ds-color-surface-default)] border-x border-b-0 border-[var(--ds-color-border-default)]/50", className)}>
      <div className="flex items-center gap-2 min-h-[32px]">
        {selected.length > 0 ? (
          <div className="flex items-center gap-2" role="toolbar" aria-label="Bulk actions">
            <span className="text-xs text-[var(--ds-color-text-secondary)] font-medium">{selected.length} selected</span>
            <button onClick={handleApprove}
              className="flex items-center gap-1.5 px-4 h-10 rounded-full text-xs font-medium bg-[var(--ds-color-feedback-success-text)] hover:brightness-110 text-white transition-colors focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-feedback-success-border)] focus:ring-offset-1 focus:ring-offset-transparent">
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> Approve
            </button>
            <button onClick={() => setShowVoid(true)}
              className="flex items-center gap-1.5 px-4 h-10 rounded-full text-xs font-medium bg-[var(--ds-color-feedback-error-bg)] hover:brightness-110 text-[var(--ds-color-feedback-error-text)] border border-[var(--ds-color-feedback-error-border)]/30 transition-colors focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-feedback-error-border)] focus:ring-offset-1 focus:ring-offset-transparent">
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" /> Reject
            </button>
            {handleHold && (
              <button onClick={handleHold}
                className="flex items-center gap-1.5 px-4 h-10 rounded-full text-xs font-medium bg-[var(--ds-color-feedback-warning-bg)] hover:brightness-110 text-[var(--ds-color-feedback-warning-text)] border border-[var(--ds-color-feedback-warning-border)]/25 transition-colors focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-feedback-warning-border)] focus:ring-offset-1 focus:ring-offset-transparent">
                <PauseCircle className="w-3.5 h-3.5" aria-hidden="true" /> Hold
              </button>
            )}
            <IconButton onClick={() => setSelected([])} aria-label="Clear selection"
              icon={<X className="w-3.5 h-3.5" aria-hidden="true" />}>
              <span className="text-xs">Clear</span>
            </IconButton>
          </div>
        ) : (
          <span className="text-xs text-[var(--ds-color-text-secondary)] flex items-center gap-1.5">
            <ChevronUp className="w-3 h-3 text-[var(--ds-color-feedback-error-text)]" aria-hidden="true" />
            {sortCol === "urgency"
              ? "Sorted by urgency · overdue first, then risk score"
              : <>{`Sorted by ${sortCol}`} · <button onClick={() => setSortCol("urgency")} className="text-[var(--ds-color-brand-primary)] hover:underline focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)] rounded-[var(--ds-radius-xs)]">Reset to urgency sort</button></>}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ds-color-text-secondary)] pointer-events-none" aria-hidden="true" />
          <input
            value={tableSearch}
            onChange={e => { setTableSearch(e.target.value); setPage(1); }}
            placeholder="Search transactions…"
            aria-label="Search transaction details"
            className="h-10 bg-[var(--ds-color-surface-page)] border border-[var(--ds-color-border-default)]/60 text-[var(--ds-color-text-primary)] text-xs rounded-[var(--ds-radius-lg)] pl-8 pr-3 w-44 focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)] placeholder:text-[var(--ds-color-text-secondary)] transition-all"
          />
        </div>
        <button className="flex items-center gap-1.5 px-4 h-10 rounded-full text-xs text-[var(--ds-color-text-secondary)] hover:text-white border border-[var(--ds-color-border-default)]/60 hover:border-[var(--ds-color-border-default)] bg-[var(--ds-color-surface-page)] transition-all focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)]">
          <Download className="w-3.5 h-3.5" aria-hidden="true" /> Export
        </button>
        <ColumnPicker
          showColPicker={showColPicker}
          setShowColPicker={setShowColPicker}
          cols={cols}
          setCols={setCols}
          colPickerRef={colPickerRef}
        />
        <IconButton
          onClick={handleRefresh}
          aria-label={refreshing ? "Refreshing data" : "Refresh data"}
          icon={<RefreshCw className={cn("w-3.5 h-3.5", refreshing && "animate-spin")} aria-hidden="true" />}
          className={cn("text-xs text-[var(--ds-color-text-secondary)] hover:text-white border border-[var(--ds-color-border-default)]/60 hover:border-[var(--ds-color-border-default)] bg-[var(--ds-color-surface-page)]", refreshing && "opacity-60")}
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </IconButton>
        <span className="text-xs text-[var(--ds-color-text-secondary)] pl-1" aria-live="polite" aria-atomic="true">
          {sorted.length === 0 ? "0 results" : `${(page - 1) * rowsPerPage + 1}–${Math.min(page * rowsPerPage, sorted.length)} of ${sorted.length}`}
        </span>
      </div>
    </div>
  );
}

export const TableToolbar = React.memo(TableToolbarInner);
