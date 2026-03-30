import React from "react";
import type { Filters } from "@/lib/types";
import { IconButton } from "@/components/shared/IconButton";
import { cn } from "@/lib/utils";

interface TablePaginationProps {
  sorted: { length: number };
  page: number;
  totalPages: number;
  rowsPerPage: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  filters: Filters;
  setFilters: (f: Filters) => void;
  className?: string;
}

function TablePaginationInner({ sorted, page, totalPages, rowsPerPage, setPage, filters, setFilters, className }: TablePaginationProps) {
  return (
    <div className={cn("flex items-center justify-between px-4 py-2.5 border-t border-surface-border/40 text-xs text-slate-300", className)}>
      <span aria-live="polite">
        {sorted.length === 0 ? "0 results" : `Rows ${(page - 1) * rowsPerPage + 1}–${Math.min(page * rowsPerPage, sorted.length)} of ${sorted.length}`}
      </span>
      <nav aria-label="Pagination" className="flex items-center gap-1">
        {[
          ["First", () => setPage(1), page === 1],
          ["Previous", () => setPage(p => p - 1), page === 1],
          ["Next", () => setPage(p => p + 1), page === totalPages],
          ["Last", () => setPage(totalPages), page === totalPages],
        ].map(([label, fn, disabled]) => (
          <IconButton
            key={label as string}
            onClick={fn as () => void}
            disabled={disabled as boolean}
            className="text-slate-300 hover:text-white"
          >
            {label as string}
          </IconButton>
        ))}
        <span className="px-3 text-slate-300">Page {page} of {totalPages}</span>
      </nav>
      <select
        value={filters.rowsPerPage}
        aria-label="Rows per page"
        onChange={e => setFilters({ ...filters, rowsPerPage: e.target.value })}
        className="m3-select bg-surface-page border border-slate-700/50 text-slate-300 text-xs rounded-[var(--m3-shape-xs)] px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-teal-400 cursor-pointer">
        <option value="25">25 / page</option>
        <option value="50">50 / page</option>
        <option value="100">100 / page</option>
      </select>
    </div>
  );
}

export const TablePagination = React.memo(TablePaginationInner);
