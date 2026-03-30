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
    <div className={cn("flex items-center justify-between px-3 py-2 bg-surface-card border-x border-b-0 border-slate-700/50", className)}>
      <div className="flex items-center gap-2 min-h-[32px]">
        {selected.length > 0 ? (
          <div className="flex items-center gap-2" role="toolbar" aria-label="Bulk actions">
            <span className="text-xs text-slate-300 font-medium">{selected.length} selected</span>
            <button onClick={handleApprove}
              className="flex items-center gap-1.5 px-4 h-[var(--m3-button-height)] rounded-[var(--m3-shape-full)] text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-1 focus:ring-offset-transparent">
              <CheckCircle2 className="w-3.5 h-3.5" aria-hidden="true" /> Approve
            </button>
            <button onClick={() => setShowVoid(true)}
              className="flex items-center gap-1.5 px-4 h-[var(--m3-button-height)] rounded-[var(--m3-shape-full)] text-xs font-medium bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-1 focus:ring-offset-transparent">
              <Trash2 className="w-3.5 h-3.5" aria-hidden="true" /> Reject
            </button>
            {handleHold && (
              <button onClick={handleHold}
                className="flex items-center gap-1.5 px-4 h-[var(--m3-button-height)] rounded-[var(--m3-shape-full)] text-xs font-medium bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/25 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 focus:ring-offset-transparent">
                <PauseCircle className="w-3.5 h-3.5" aria-hidden="true" /> Hold
              </button>
            )}
            <IconButton onClick={() => setSelected([])} aria-label="Clear selection"
              icon={<X className="w-3.5 h-3.5" aria-hidden="true" />}>
              <span className="text-xs">Clear</span>
            </IconButton>
          </div>
        ) : (
          <span className="text-xs text-slate-300 flex items-center gap-1.5">
            <ChevronUp className="w-3 h-3 text-rose-400" aria-hidden="true" />
            {sortCol === "urgency"
              ? "Sorted by urgency · overdue first, then risk score"
              : <>{`Sorted by ${sortCol}`} · <button onClick={() => setSortCol("urgency")} className="text-teal-400 hover:underline focus:outline-none focus:ring-2 focus:ring-teal-400 rounded-[var(--m3-shape-xs)]">Reset to urgency sort</button></>}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" aria-hidden="true" />
          <input
            value={tableSearch}
            onChange={e => { setTableSearch(e.target.value); setPage(1); }}
            placeholder="Search transactions…"
            aria-label="Search transaction details"
            className="h-[var(--m3-input-height-dense)] bg-surface-page border border-slate-700/60 text-slate-200 text-xs rounded-[var(--m3-shape-sm)] pl-8 pr-3 w-44 focus:outline-none focus:ring-2 focus:ring-teal-400 placeholder:text-slate-400 transition-all"
          />
        </div>
        <button className="flex items-center gap-1.5 px-4 h-[var(--m3-button-height)] rounded-[var(--m3-shape-full)] text-xs text-slate-300 hover:text-white border border-slate-700/60 hover:border-slate-600 bg-surface-page transition-all focus:outline-none focus:ring-2 focus:ring-teal-400">
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
          className={cn("text-xs text-slate-300 hover:text-white border border-slate-700/60 hover:border-slate-600 bg-surface-page", refreshing && "opacity-60")}
        >
          {refreshing ? "Refreshing…" : "Refresh"}
        </IconButton>
        <span className="text-xs text-slate-300 pl-1" aria-live="polite" aria-atomic="true">
          {sorted.length === 0 ? "0 results" : `${(page - 1) * rowsPerPage + 1}–${Math.min(page * rowsPerPage, sorted.length)} of ${sorted.length}`}
        </span>
      </div>
    </div>
  );
}

export const TableToolbar = React.memo(TableToolbarInner);
