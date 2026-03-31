import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Calendar, ChevronRight, Search, SlidersHorizontal } from "lucide-react";
import type { Filters } from "@/lib/types";
import { DEFAULT_FILTERS } from "@/lib/types";
import { cn } from "@/lib/utils";

interface FilterPanelProps {
  filters: Filters;
  setFilters: (f: Filters) => void;
  className?: string;
}

export function FilterPanel({ filters, setFilters, className }: FilterPanelProps) {
  const [moreOpen, setMoreOpen] = useState(false);
  const [advOpen, setAdvOpen] = useState(false);

  useEffect(() => {
    if (!moreOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setMoreOpen(false); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [moreOpen]);

  const secondaryCount = [filters.status, filters.txnType, filters.legalEntity, filters.payee, filters.txnNum, filters.processStage].filter(Boolean).length;
  const hasAnyClear = !!(filters.quickSearch || secondaryCount || !filters.showMyItems ||
    filters.dateFrom !== DEFAULT_FILTERS.dateFrom || filters.dateTo !== DEFAULT_FILTERS.dateTo);

  const clearAll = () => setFilters(DEFAULT_FILTERS);

  const quickDate = (r: string) => {
    if (!r) {
      setFilters({ ...filters, datePreset: "", dateFrom: DEFAULT_FILTERS.dateFrom, dateTo: DEFAULT_FILTERS.dateTo });
      return;
    }
    const map: Record<string, [string, string]> = {
      today: ["2026-02-24", "2026-02-24"], week: ["2026-02-17", "2026-02-24"],
      month: ["2026-02-01", "2026-02-28"], qtr: ["2025-01-01", "2026-02-28"],
    };
    const [from, to] = map[r];
    setFilters({ ...filters, datePreset: r, dateFrom: from, dateTo: to });
  };

  const inpBar = "h-10 bg-[var(--ds-color-surface-page)] border border-[var(--ds-color-border-default)]/60 text-[var(--ds-color-text-primary)] text-sm rounded-[var(--ds-radius-lg)] px-3 focus:outline-hidden focus:ring-2 focus:ring-teal-400 focus:border-teal-400 placeholder:text-[var(--ds-color-text-tertiary)] transition-all";
  const inp = `w-full ${inpBar}`;
  const sel = `ds-select ${inp} cursor-pointer`;

  return (
    <section aria-label="Filters" className={cn("bg-[var(--ds-color-surface-default)] border border-[var(--ds-color-border-default)]/50 rounded-[var(--ds-radius-xl)] overflow-hidden", className)}>

      <div className="flex flex-wrap items-center gap-2 px-3 py-2.5">

        <div className="relative shrink-0">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ds-color-text-secondary)]" aria-hidden="true" />
          <input
            value={filters.quickSearch}
            placeholder="Search ID or beneficiary…"
            aria-label="Quick search transactions"
            onChange={e => setFilters({ ...filters, quickSearch: e.target.value })}
            className="h-10 bg-[var(--ds-color-surface-page)] border border-[var(--ds-color-border-default)]/60 text-[var(--ds-color-text-primary)] text-sm rounded-[var(--ds-radius-lg)] pl-7 pr-3 w-48 focus:outline-hidden focus:ring-2 focus:ring-teal-400 placeholder:text-[var(--ds-color-text-tertiary)] transition-all"
          />
        </div>

        <div className="w-px h-5 bg-[var(--ds-color-border-default)]/50 shrink-0" aria-hidden="true" />

        <select
          value={filters.dateType}
          onChange={e => setFilters({ ...filters, dateType: e.target.value })}
          aria-label="Date type"
          className={`ds-select ${inpBar} shrink-0 cursor-pointer`}>
          <option>Transaction date</option>
          <option>Value date</option>
          <option>Entry date</option>
        </select>

        <div className="flex items-center gap-1.5 shrink-0">
          <div className="relative">
            <input type="date" value={filters.dateFrom} aria-label="Start date"
              onChange={e => setFilters({ ...filters, dateFrom: e.target.value, datePreset: "" })}
              className={`ds-date-input ${inpBar} w-40 pr-9`} />
            <label className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-text-primary)] transition-colors cursor-pointer">
              <Calendar className="w-4 h-4 pointer-events-none" />
              <input type="date" value={filters.dateFrom} aria-label="Start date picker"
                onChange={e => setFilters({ ...filters, dateFrom: e.target.value, datePreset: "" })}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" tabIndex={-1} />
            </label>
          </div>
          <ArrowRight className="w-3 h-3 text-[var(--ds-color-text-secondary)] shrink-0" aria-hidden="true" />
          <div className="relative">
            <input type="date" value={filters.dateTo} aria-label="End date"
              onChange={e => setFilters({ ...filters, dateTo: e.target.value, datePreset: "" })}
              className={`ds-date-input ${inpBar} w-40 pr-9`} />
            <label className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-text-primary)] transition-colors cursor-pointer">
              <Calendar className="w-4 h-4 pointer-events-none" />
              <input type="date" value={filters.dateTo} aria-label="End date picker"
                onChange={e => setFilters({ ...filters, dateTo: e.target.value, datePreset: "" })}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" tabIndex={-1} />
            </label>
          </div>
        </div>

        <select
          value={filters.datePreset}
          onChange={e => quickDate(e.target.value)}
          aria-label="Date range preset"
          className={`ds-select ${inpBar} shrink-0 cursor-pointer`}>
          <option value="">Preset…</option>
          <option value="today">Today</option>
          <option value="week">This week</option>
          <option value="month">This month</option>
          <option value="qtr">This quarter</option>
        </select>

        <div className="w-px h-5 bg-[var(--ds-color-border-default)]/50 shrink-0" aria-hidden="true" />

        <div
          role="switch" aria-checked={filters.showMyItems} tabIndex={0}
          aria-label="Show only items I can approve"
          onClick={() => setFilters({ ...filters, showMyItems: !filters.showMyItems })}
          onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFilters({ ...filters, showMyItems: !filters.showMyItems }); } }}
          className="flex items-center gap-2 cursor-pointer shrink-0 focus:outline-hidden focus:ring-2 focus:ring-teal-400 rounded-[var(--ds-radius-lg)] px-1">
          <div className={`w-[52px] h-[32px] rounded-full relative transition-colors ${filters.showMyItems ? "bg-teal-500" : "bg-[var(--ds-color-surface-raised)]"}`}>
            <div className={`rounded-full bg-white absolute top-1 transition-all shadow-sm ${filters.showMyItems ? "w-6 h-6 left-[26px]" : "w-5 h-5 left-1"}`} />
          </div>
          <span className="text-xs text-[var(--ds-color-text-secondary)] whitespace-nowrap select-none">My items</span>
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-auto">

          {secondaryCount > 0 && !moreOpen && (
            <div className="flex items-center gap-1" aria-label={`${secondaryCount} additional filter${secondaryCount > 1 ? "s" : ""} active`}>
              {([
                filters.status && `Status: ${filters.status}`,
                filters.txnType && `Type: ${filters.txnType}`,
                filters.legalEntity && filters.legalEntity.replace("Ripple Treasury ", ""),
              ] as (string | false)[]).filter(Boolean).slice(0, 2).map((c, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[var(--ds-radius-lg)] text-xs font-medium bg-[var(--ds-color-surface-default)]/60 border border-[var(--ds-color-border-default)]/60 text-[var(--ds-color-text-primary)] shrink-0">
                  {c}
                </span>
              ))}
              {secondaryCount > 2 && (
                <span className="text-xs text-[var(--ds-color-text-secondary)]">+{secondaryCount - 2}</span>
              )}
            </div>
          )}

          <button
            onClick={() => setMoreOpen(o => !o)}
            aria-expanded={moreOpen}
            aria-controls="more-filters-panel"
            className={`flex items-center gap-1.5 px-4 h-10 rounded-full border text-xs font-medium transition-all focus:outline-hidden focus:ring-2 focus:ring-teal-400
              ${moreOpen || secondaryCount > 0
                ? "bg-teal-500/15 border-teal-500/35 text-teal-300"
                : "bg-[var(--ds-color-surface-default)] border-[var(--ds-color-border-default)]/60 text-[var(--ds-color-text-secondary)] hover:border-teal-500/30 hover:text-teal-400"}`}>
            <SlidersHorizontal className="w-3 h-3" aria-hidden="true" />
            More filters
            {secondaryCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-teal-500 text-white text-xs font-bold flex items-center justify-center leading-none">
                {secondaryCount}
              </span>
            )}
          </button>

          {hasAnyClear && (
            <button onClick={clearAll}
              className="text-xs text-[var(--ds-color-text-secondary)] hover:text-white transition-colors focus:outline-hidden focus:ring-2 focus:ring-teal-400 rounded-full px-3 h-10">
              Clear all
            </button>
          )}
        </div>
      </div>

      <AnimatePresence initial={false}>
        {moreOpen && (
          <motion.div id="more-filters-panel"
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="border-t border-[var(--ds-color-border-default)] px-3 py-4 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label htmlFor="filter-status" className="block text-xs text-[var(--ds-color-text-secondary)] font-medium mb-1.5">Status</label>
                  <select id="filter-status" value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}
                    className={sel}>
                    <option value="">All statuses</option>
                    {["Needs Approval", "Under Review", "Ready to Approve", "Ready to Extract", "Extracted", "Confirmed", "Approved", "Failed", "Void", "Draft"].map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="filter-txnType" className="block text-xs text-[var(--ds-color-text-secondary)] font-medium mb-1.5">Payment type</label>
                  <select id="filter-txnType" value={filters.txnType} onChange={e => setFilters({ ...filters, txnType: e.target.value })}
                    className={sel}>
                    <option value="">All types</option>
                    <option>Wire</option>
                    <option>ACH</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="filter-legalEntity" className="block text-xs text-[var(--ds-color-text-secondary)] font-medium mb-1.5">Legal entity</label>
                  <select id="filter-legalEntity" value={filters.legalEntity} onChange={e => setFilters({ ...filters, legalEntity: e.target.value })}
                    className={sel}>
                    <option value="">All entities</option>
                    <option>Ripple Treasury LLC</option>
                    <option>Ripple Treasury US LLC</option>
                    <option>Ripple Treasury EU GmbH</option>
                    <option>Ripple Treasury UK Ltd</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="filter-payee" className="block text-xs text-[var(--ds-color-text-secondary)] font-medium mb-1.5">Beneficiary</label>
                  <input id="filter-payee" value={filters.payee} placeholder="Search beneficiary…"
                    onChange={e => setFilters({ ...filters, payee: e.target.value })}
                    className={inp} />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label htmlFor="filter-txnNum" className="block text-xs text-[var(--ds-color-text-secondary)] font-medium mb-1.5">Transaction number</label>
                  <input id="filter-txnNum" value={filters.txnNum} placeholder="Search by number…"
                    onChange={e => setFilters({ ...filters, txnNum: e.target.value })}
                    className={inp} />
                </div>
              </div>

              <div>
                <button
                  onClick={() => setAdvOpen(o => !o)}
                  aria-expanded={advOpen}
                  className="flex items-center gap-1.5 text-xs text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-text-secondary)] font-medium transition-colors focus:outline-hidden focus:ring-2 focus:ring-teal-400 rounded-[var(--ds-radius-lg)] px-1 py-0.5">
                  <ChevronRight className={`w-3 h-3 transition-transform ${advOpen ? "rotate-90" : ""}`} aria-hidden="true" />
                  Advanced
                </button>
                <AnimatePresence initial={false}>
                  {advOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.15 }}
                      className="overflow-hidden"
                    >
                      <fieldset className="border-0 p-0 m-0 mt-2">
                        <legend className="block text-xs text-[var(--ds-color-text-secondary)] font-medium mb-1.5">Netting</legend>
                        <div className="flex items-center gap-4">
                          {["All", "Not Netted", "Netted Only"].map(n => (
                            <label key={n} className="flex items-center gap-1.5 cursor-pointer min-h-[24px] px-1">
                              <input type="radio" name="netting" value={n} checked={filters.netting === n}
                                onChange={() => setFilters({ ...filters, netting: n })}
                                className="w-4 h-4 accent-teal-500" />
                              <span className="text-xs text-[var(--ds-color-text-secondary)] whitespace-nowrap">{n}</span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[var(--ds-color-border-default)]">
                <div className="flex items-center gap-3">
                  <select value={filters.savedSearch} onChange={e => {
                    const p = e.target.value;
                    if (p === "daily") setFilters({ ...filters, savedSearch: p, status: "Needs Approval", showMyItems: true });
                    else if (p === "overdue") setFilters({ ...filters, savedSearch: p, status: "Needs Approval" });
                    else setFilters({ ...filters, savedSearch: p });
                  }} className={`ds-select ${inpBar} text-[var(--ds-color-text-secondary)] cursor-pointer`}
                    aria-label="Saved filter presets">
                    <option value="">Saved searches</option>
                    <option value="daily">My daily queue</option>
                    <option value="overdue">Overdue only</option>
                  </select>
                  <span className="text-xs text-[var(--ds-color-text-secondary)] hidden md:inline">
                    <kbd className="px-1 py-0.5 rounded bg-[var(--ds-color-surface-default)] border border-[var(--ds-color-border-default)] font-mono text-xs text-[var(--ds-color-text-secondary)]">Enter</kbd>
                    {" "}to apply ·{" "}
                    <kbd className="px-1 py-0.5 rounded bg-[var(--ds-color-surface-default)] border border-[var(--ds-color-border-default)] font-mono text-xs text-[var(--ds-color-text-secondary)]">Esc</kbd>
                    {" "}to close
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setMoreOpen(false)}
                    className="px-6 h-10 text-xs text-[var(--ds-color-text-secondary)] border border-[var(--ds-color-border-default)] rounded-full hover:text-white hover:bg-white/8 transition-colors focus:outline-hidden focus:ring-2 focus:ring-teal-400">
                    Close
                  </button>
                  <button onClick={() => setMoreOpen(false)}
                    className="flex items-center gap-2 px-6 h-10 rounded-full bg-teal-600 hover:bg-teal-500 text-white font-medium text-xs transition-all focus:outline-hidden focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-surface-card">
                    <Search className="w-3.5 h-3.5" aria-hidden="true" /> Apply
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
