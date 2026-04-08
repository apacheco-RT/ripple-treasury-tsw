// @ds-molecule — composed from DS atoms + TSW domain logic
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp, LayoutGrid, LayoutList, X } from "lucide-react";
import type { Filters, SummaryRowId } from "@/lib/types";
import { SUMMARY_ROWS } from "@/lib/mock-data";
import { MonoAmount } from "@ds-foundation/react";

export function PaymentSummary({ filters, setFilters }: { filters: Filters; setFilters: (f: Filters) => void }) {
  const [open, setOpen] = useState(true);
  const [activeId, setActiveId] = useState<SummaryRowId | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards");
  const [expandedCards, setExpandedCards] = useState<Set<SummaryRowId>>(new Set());
  const toggleCard = (id: SummaryRowId) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    if (!filters.status) {
      setActiveId(null);
    } else {
      const match = SUMMARY_ROWS.find(r => r.statusFilter === filters.status);
      setActiveId(match ? match.id : null);
    }
  }, [filters.status]);

  const displayRows = SUMMARY_ROWS;
  const totalCount = displayRows.reduce((s, r) => s + r.count, 0);
  const totalDebits = displayRows.reduce((s, r) => s + r.debits, 0);
  const totalCredits = displayRows.reduce((s, r) => s + r.credits, 0);
  const totalAmount = displayRows.reduce((s, r) => s + r.amount, 0);

  const handleRowClick = (row: typeof SUMMARY_ROWS[0]) => {
    if (activeId === row.id) {
      setActiveId(null);
      setFilters({ ...filters, status: "" });
    } else {
      setActiveId(row.id);
      if (row.statusFilter) setFilters({ ...filters, status: row.statusFilter });
    }
  };

  const handleClear = () => {
    setActiveId(null);
    setFilters({ ...filters, status: "" });
  };

  return (
    <section aria-label="Payment summary" className="bg-[var(--ds-color-surface-default)] border border-[var(--ds-color-border-default)]/50 rounded-[var(--ds-radius-xl)] overflow-hidden">

      <div className="flex items-center gap-3 px-4 py-2.5">
        <button
          onClick={() => setOpen(o => !o)}
          aria-expanded={open}
          aria-controls="payment-summary-content"
          className="flex items-center gap-2 flex-1 hover:bg-white/8 transition-colors duration-200 select-none text-left rounded-[var(--ds-radius-lg)] focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)]">
          <span className="text-base font-medium text-[var(--ds-color-text-primary)] shrink-0">Payment summary</span>
          <span className="text-xs text-[var(--ds-color-text-secondary)] font-normal ml-1">
            {totalCount.toLocaleString()} transactions · {displayRows.length} status{displayRows.length !== 1 ? "es" : ""}
          </span>
          <div className="ml-auto shrink-0">
            {open
              ? <ChevronUp className="w-4 h-4 text-[var(--ds-color-text-secondary)]" aria-hidden="true" />
              : <ChevronDown className="w-4 h-4 text-[var(--ds-color-text-secondary)]" aria-hidden="true" />}
          </div>
        </button>
        {activeId && (() => {
          const activeRow = SUMMARY_ROWS.find(r => r.id === activeId);
          if (!activeRow) return null;
          return (
            <div className="flex items-center gap-1.5 shrink-0 bg-[var(--ds-color-brand-primary-subtle)] border border-[var(--ds-color-brand-primary)]/30 rounded-[var(--ds-radius-lg)] px-2.5 py-1">
              <div className={`w-4 h-4 rounded-[var(--ds-radius-xs)] flex items-center justify-center ${activeRow.iconBg}`}>
                <activeRow.Icon className={`w-2.5 h-2.5 ${activeRow.iconColor}`} aria-hidden="true" />
              </div>
              <span className="text-xs font-medium text-[var(--ds-color-brand-primary)]">{activeRow.label}</span>
              <span className="text-xs text-[var(--ds-color-text-secondary)]">({activeRow.count})</span>
              <button
                onClick={handleClear}
                aria-label="Clear status filter"
                className="ml-0.5 p-0.5 rounded-[var(--ds-radius-xs)] hover:bg-white/8 transition-colors text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-text-primary)] focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)]">
                <X className="w-3 h-3" aria-hidden="true" />
              </button>
            </div>
          );
        })()}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setViewMode("table")}
            aria-label="Table view"
            aria-pressed={viewMode === "table"}
            className={`p-1.5 rounded-[var(--ds-radius-lg)] transition-colors focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)] ${viewMode === "table" ? "bg-[var(--ds-color-brand-primary-subtle)] text-[var(--ds-color-brand-primary)]" : "text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-text-secondary)] hover:bg-white/8"}`}>
            <LayoutList className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("cards")}
            aria-label="Card view"
            aria-pressed={viewMode === "cards"}
            className={`p-1.5 rounded-[var(--ds-radius-lg)] transition-colors focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)] ${viewMode === "cards" ? "bg-[var(--ds-color-brand-primary-subtle)] text-[var(--ds-color-brand-primary)]" : "text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-text-secondary)] hover:bg-white/8"}`}>
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div id="payment-summary-content"
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            {viewMode === "table" ? (
              <div className="border-t border-[var(--ds-color-border-default)] overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm" aria-label="Payment status summary">
                  <thead>
                    <tr className="bg-[var(--ds-color-surface-sunken)] border-b border-[var(--ds-color-border-default)]/60">
                      <th scope="col" className="px-4 py-2.5 text-sm text-[var(--ds-color-text-primary)] font-medium w-[260px]">Status</th>
                      <th scope="col" className="px-4 py-2.5 text-sm text-[var(--ds-color-text-primary)] font-medium text-right">Operative debits</th>
                      <th scope="col" className="px-4 py-2.5 text-sm text-[var(--ds-color-text-primary)] font-medium text-right">Operative credits</th>
                      <th scope="col" className="px-4 py-2.5 text-sm text-[var(--ds-color-text-primary)] font-medium text-right">Amount</th>
                      <th scope="col" className="px-4 py-2.5 text-sm text-[var(--ds-color-text-primary)] font-medium text-center w-[130px]">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--ds-color-border-default)]/30">
                    {displayRows.map((row) => {
                      const isActive = activeId === row.id;
                      const isDimmed = activeId !== null && !isActive;
                      return (
                        <tr key={row.id}
                          role="button"
                          tabIndex={0}
                          aria-pressed={isActive}
                          aria-label={`${isActive ? "Clear filter" : "Filter by"} ${row.label}`}
                          className={`transition-all group cursor-pointer ${isActive
                            ? "bg-[var(--ds-color-interactive-selected-bg)] border-l-2 border-l-[var(--ds-color-brand-primary)]"
                            : isDimmed
                              ? "bg-[var(--ds-color-surface-page)]/60 opacity-[0.45] hover:opacity-70 hover:bg-[var(--ds-color-interactive-selected-bg)]"
                              : "bg-[var(--ds-color-surface-page)] hover:bg-[var(--ds-color-interactive-selected-bg)]"
                            } focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ds-color-brand-primary)] focus-visible:ring-inset`}
                          aria-disabled={isDimmed ? true : undefined}
                          onClick={() => handleRowClick(row)}
                          onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleRowClick(row); } }}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-[var(--ds-radius-lg)] flex items-center justify-center shrink-0 ${row.iconBg}`}>
                                <row.Icon className={`w-4 h-4 ${row.iconColor}`} aria-hidden="true" />
                              </div>
                              <span className="text-sm font-medium text-[var(--ds-color-text-primary)] leading-tight">
                                {row.label}
                                <span className="ml-1.5 text-xs text-[var(--ds-color-text-secondary)] font-normal">({row.count.toLocaleString()})</span>
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-medium tabular-nums text-sm text-[var(--ds-color-text-secondary)]"><MonoAmount value={row.debits} currency="USD" /></td>
                          <td className="px-4 py-3 text-right font-medium tabular-nums text-sm text-[var(--ds-color-text-secondary)]"><MonoAmount value={row.credits} currency="USD" /></td>
                          <td className="px-4 py-3 text-right font-medium tabular-nums text-sm text-[var(--ds-color-text-primary)]"><MonoAmount value={row.amount} currency="USD" /></td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-xs transition-all rounded-[var(--ds-radius-lg)] px-2 py-1 ${isActive
                              ? "text-[var(--ds-color-brand-primary)] font-medium"
                              : "text-[var(--ds-color-text-secondary)] group-hover:text-[var(--ds-color-brand-primary)]"
                              }`}>
                              {isActive ? "✓ Filtered" : "View details →"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-[var(--ds-color-surface-page)] border-t-2 border-[var(--ds-color-border-default)]/60">
                      <td className="px-4 py-3 font-medium text-[var(--ds-color-text-primary)]">
                        <div className="pl-11">Total</div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium tabular-nums text-sm text-[var(--ds-color-text-primary)]"><MonoAmount value={totalDebits} currency="USD" /></td>
                      <td className="px-4 py-3 text-right font-medium tabular-nums text-sm text-[var(--ds-color-text-primary)]"><MonoAmount value={totalCredits} currency="USD" /></td>
                      <td className="px-4 py-3 text-right font-medium tabular-nums text-sm text-[var(--ds-color-text-primary)]"><MonoAmount value={totalAmount} currency="USD" /></td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="border-t border-[var(--ds-color-border-default)] p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-start">
                  {displayRows.map((row, i) => {
                    const isActive = activeId === row.id;
                    const isDimmed = activeId !== null && !isActive;
                    const isExpanded = expandedCards.has(row.id);
                    return (
                      <motion.div
                        key={row.id}
                        layout
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: isDimmed ? 0.45 : 1, scale: isDimmed ? 0.97 : 1 }}
                        transition={{ delay: i * 0.035, duration: 0.25, layout: { duration: 0.2, ease: "easeInOut" } }}
                        aria-disabled={isDimmed ? true : undefined}
                        className={`rounded-[var(--ds-radius-xl)] border flex flex-col overflow-hidden focus-within:ring-2 focus-within:ring-[var(--ds-color-brand-primary)] ${isActive
                          ? "border-[var(--ds-color-brand-primary)]/50 bg-[var(--ds-color-interactive-selected-bg)] shadow-lg shadow-[var(--ds-color-brand-primary)]/10 ring-1 ring-[var(--ds-color-brand-primary)]/30"
                          : isDimmed
                            ? "border-[var(--ds-color-border-default)]/30 bg-[var(--ds-color-surface-page)]/60"
                            : "border-[var(--ds-color-border-default)]/50 bg-[var(--ds-color-surface-page)] hover:border-[var(--ds-color-border-default)]/60 hover:bg-[var(--ds-color-interactive-selected-bg)]"
                          }`}
                      >
                        <div
                          role="button"
                          tabIndex={0}
                          aria-pressed={isActive}
                          aria-label={`${isActive ? "Clear filter" : "Filter by"} ${row.label}`}
                          className="px-4 pt-3 pb-2.5 cursor-pointer select-none"
                          onClick={() => handleRowClick(row)}
                          onKeyDown={(e: React.KeyboardEvent) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleRowClick(row); } }}
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-[var(--ds-radius-lg)] flex items-center justify-center shrink-0 ${row.iconBg}`}>
                              <row.Icon className={`w-3.5 h-3.5 ${row.iconColor}`} aria-hidden="true" />
                            </div>
                            <span className="text-sm font-medium text-[var(--ds-color-text-primary)] leading-tight truncate">{row.label}</span>
                            {isActive && (
                              <div className="w-2 h-2 rounded-full bg-[var(--ds-color-brand-primary)] shrink-0 animate-pulse ml-auto" />
                            )}
                          </div>
                          <div className="pl-[38px] mt-1 flex items-baseline justify-between gap-2">
                            <span className="flex items-baseline gap-1.5 shrink-0">
                              <span className="text-base font-medium tabular-nums text-[var(--ds-color-text-primary)]">{row.count.toLocaleString()}</span>
                              <span className="text-xs text-[var(--ds-color-text-secondary)]">transactions</span>
                            </span>
                            <span className="text-xs text-[var(--ds-color-text-secondary)] tabular-nums truncate min-w-0"><MonoAmount value={row.amount} currency="USD" size="sm" /></span>
                          </div>
                        </div>
                        <div id={`card-details-${row.id}`}>
                          <AnimatePresence initial={false}>
                            {isExpanded && (
                              <motion.div
                                key="expand"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2, ease: "easeInOut" }}
                                className="overflow-hidden"
                              >
                                <div className="px-4 pb-2.5 space-y-1 border-t border-[var(--ds-color-border-default)] pt-2.5 ml-[38px]">
                                  <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-xs text-[var(--ds-color-text-secondary)]">
                                      <span className="w-3.5 h-3.5 rounded-full bg-[var(--ds-color-feedback-error-bg)] flex items-center justify-center text-[var(--ds-color-feedback-error-text)] text-xs font-bold leading-none shrink-0">−</span>
                                      Debits
                                    </span>
                                    <span className="text-xs tabular-nums text-[var(--ds-color-text-secondary)]"><MonoAmount value={row.debits} currency="USD" size="sm" /></span>
                                  </div>
                                  <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-1.5 text-xs text-[var(--ds-color-text-secondary)]">
                                      <span className="w-3.5 h-3.5 rounded-full bg-[var(--ds-color-feedback-success-bg)] flex items-center justify-center text-[var(--ds-color-feedback-success-text)] text-xs font-bold leading-none shrink-0">+</span>
                                      Credits
                                    </span>
                                    <span className="text-xs tabular-nums text-[var(--ds-color-text-secondary)]"><MonoAmount value={row.credits} currency="USD" size="sm" /></span>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleCard(row.id); }}
                          aria-expanded={isExpanded}
                          aria-controls={`card-details-${row.id}`}
                          aria-label={isExpanded ? `Collapse ${row.label} details` : `Expand ${row.label} details`}
                          className={`w-full flex items-center justify-center gap-1 text-xs font-medium px-3 py-1.5 border-t cursor-pointer transition-colors ${isActive
                            ? "text-[var(--ds-color-brand-primary)] bg-[var(--ds-color-brand-primary-subtle)] border-[var(--ds-color-brand-primary)]/20 hover:bg-[var(--ds-color-interactive-selected-bg)]"
                            : "text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-text-secondary)] bg-[var(--ds-color-surface-sunken)]/50 border-[var(--ds-color-border-default)]/30 hover:bg-[var(--ds-color-surface-sunken)]"
                            }`}
                        >
                          {isExpanded ? (
                            <><ChevronUp className="w-3 h-3" aria-hidden="true" /> Less</>
                          ) : (
                            <><ChevronDown className="w-3 h-3" aria-hidden="true" /> More</>
                          )}
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="grid grid-cols-3 gap-4 mt-3 rounded-[var(--ds-radius-xl)] border border-[var(--ds-color-border-default)]/60 bg-[var(--ds-color-surface-page)] px-5 py-3">
                  <div>
                    <div className="text-xs text-[var(--ds-color-text-secondary)] font-medium mb-0.5">Total debits</div>
                    <div className="text-sm font-medium tabular-nums text-[var(--ds-color-text-primary)]"><MonoAmount value={totalDebits} currency="USD" /></div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--ds-color-text-secondary)] font-medium mb-0.5">Total credits</div>
                    <div className="text-sm font-medium tabular-nums text-[var(--ds-color-text-primary)]"><MonoAmount value={totalCredits} currency="USD" /></div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-[var(--ds-color-text-secondary)] font-medium mb-0.5">Total amount</div>
                    <div className="text-sm font-medium tabular-nums text-[var(--ds-color-text-primary)]"><MonoAmount value={totalAmount} currency="USD" /></div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
