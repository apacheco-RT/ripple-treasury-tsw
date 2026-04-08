// @tsw-organism — TSW-specific feature section, stays local
import React from "react";
import type { Filters } from "@/lib/types";
import { IconButton } from "@ds-foundation/react";
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
    <div className={cn("flex items-center justify-between px-4 py-2.5 border-t border-[var(--ds-color-border-default)]/40 text-xs text-[var(--ds-color-text-secondary)]", className)}>
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
            className="text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-text-primary)]"
          >
            {label as string}
          </IconButton>
        ))}
        <span className="px-3 text-[var(--ds-color-text-secondary)]">Page {page} of {totalPages}</span>
      </nav>
      <select
        value={filters.rowsPerPage}
        aria-label="Rows per page"
        onChange={e => setFilters({ ...filters, rowsPerPage: e.target.value })}
        className="ds-select bg-[var(--ds-color-surface-page)] border border-[var(--ds-color-border-default)]/50 text-[var(--ds-color-text-secondary)] text-xs rounded-[var(--ds-radius-xs)] px-2 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)] cursor-pointer">
        <option value="25">25 / page</option>
        <option value="50">50 / page</option>
        <option value="100">100 / page</option>
      </select>
    </div>
  );
}

export const TablePagination = React.memo(TablePaginationInner);
