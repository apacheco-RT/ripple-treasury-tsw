import { useState, useEffect, useCallback, useRef } from "react";
import { UnifiedNav } from "@/components/navigation/UnifiedNav";
import AppNav from "@/components/navigation/AppNav";
import { ChevronRight, Moon, RefreshCw, Sun } from "lucide-react";
import { FilterPanel } from "@/components/organisms/FilterPanel";
import { FraudSpotlight } from "@/components/organisms/FraudSpotlight";
import { PaymentSummary } from "@/components/molecules/PaymentSummary";
import { PaymentSummarySkeleton } from "@/components/molecules/PaymentSummarySkeleton";
import { ResultsTable } from "@/components/organisms/ResultsTable";
import { ResultsTableSkeleton } from "@/components/organisms/ResultsTableSkeleton";
import { DEFAULT_FILTERS } from "@/lib/types";
import type { Filters } from "@/lib/types";
import { mockTxns } from "@/lib/mock-data";

const FILTER_PARAM_KEYS = [
  "quickSearch", "dateType", "dateFrom", "dateTo", "datePreset",
  "status", "txnType", "legalEntity", "payee", "txnNum",
  "netting", "savedSearch", "processStage", "rowsPerPage",
] as const;

const BOOLEAN_FILTER_KEYS = ["showMyItems"] as const;

function filtersFromURL(): Filters {
  const params = new URLSearchParams(window.location.search);
  const f: Record<string, unknown> = { ...DEFAULT_FILTERS };
  for (const key of FILTER_PARAM_KEYS) {
    const val = params.get(key);
    if (val !== null) {
      f[key] = val;
    }
  }
  for (const key of BOOLEAN_FILTER_KEYS) {
    const val = params.get(key);
    if (val !== null) {
      f[key] = val === "1";
    }
  }
  return f as unknown as Filters;
}

function filtersToParams(filters: Filters): URLSearchParams {
  const params = new URLSearchParams(window.location.search);
  const defaults = DEFAULT_FILTERS as Record<string, unknown>;
  const current = filters as unknown as Record<string, unknown>;
  for (const key of FILTER_PARAM_KEYS) {
    const val = current[key] as string;
    if (val !== defaults[key]) {
      params.set(key, val);
    } else {
      params.delete(key);
    }
  }
  for (const key of BOOLEAN_FILTER_KEYS) {
    const val = current[key] as boolean;
    if (val !== defaults[key]) {
      params.set(key, val ? "1" : "0");
    } else {
      params.delete(key);
    }
  }
  return params;
}

export default function Prototype() {
  const [filters, setFilters] = useState<Filters>(() => filtersFromURL());
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState("4:23 PM");
  const [isDark, setIsDark] = useState(() => localStorage.getItem("paym-theme") !== "light");
  const isInitialMount = useRef(true);

  const urlParams = new URLSearchParams(window.location.search);
  const featureFlags = {
    rlusdStrip: urlParams.get("rlusdStrip") === "1",
    stablecoinRail: urlParams.get("stablecoinRail") === "1",
    selectPaymentRail: urlParams.get("selectPaymentRail") === "1",
    riskColumn: urlParams.get("riskColumn") === "1",
    fraudSpotlight: urlParams.get("fraudSpotlight") === "1",
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const params = filtersToParams(filters);
    const newSearch = params.toString();
    const currentSearch = new URLSearchParams(window.location.search).toString();
    if (newSearch !== currentSearch) {
      const url = newSearch ? `${window.location.pathname}?${newSearch}` : window.location.pathname;
      window.history.replaceState(null, "", url);
    }
  }, [filters]);

  const handleSetFilters = useCallback((f: Filters) => {
    setFilters(f);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("light-mode", !isDark);
    localStorage.setItem("paym-theme", isDark ? "dark" : "light");
  }, [isDark]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      setLastRefreshed(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--ds-color-surface-page)] text-white">
      <UnifiedNav />
      <div className="mt-11">
        <AppNav />
      </div>

      <main id="main-content" className="flex-1 p-6 space-y-5 overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <nav aria-label="Breadcrumb" className="breadcrumb-bar flex items-center gap-1.5 text-xs mb-1.5">
              <span className="text-[var(--ds-color-text-secondary)] font-medium">Payments</span>
              <ChevronRight className="w-3 h-3 text-[var(--ds-color-text-secondary)]" aria-hidden="true" />
              <span className="text-[var(--ds-color-text-secondary)]" aria-current="page">Transaction Status Workflow</span>
            </nav>
            <h1 className="text-xl font-medium text-white m-0 leading-tight tracking-tight">Transaction Status Workflow</h1>
            <p className="text-xs text-[var(--ds-color-text-secondary)] mt-1 m-0">Manage and monitor all your payments in one place</p>
          </div>
          <div className="flex items-center gap-3">
            <p className="text-xs text-[var(--ds-color-text-secondary)] m-0" aria-live="polite">
              Last refreshed: <span className="text-[var(--ds-color-text-secondary)] font-medium">{lastRefreshed}</span>
            </p>
            <button onClick={handleRefresh} aria-label={refreshing ? "Refreshing all sections" : "Refresh all sections"}
              className={`flex items-center gap-1.5 px-4 h-10 rounded-full text-xs font-medium text-[var(--ds-color-text-secondary)] hover:text-white border border-[var(--ds-color-border-default)]/60 hover:border-[var(--ds-color-border-default)] bg-[var(--ds-color-surface-default)] transition-all focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)] ${refreshing ? "opacity-60" : ""}`}>
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} aria-hidden="true" />
              {refreshing ? "Refreshing…" : "Refresh"}
            </button>
          </div>
        </div>

        <FilterPanel filters={filters} setFilters={handleSetFilters} />
        {featureFlags.fraudSpotlight && <FraudSpotlight />}
        {refreshing ? (
          <>
            <PaymentSummarySkeleton />
            <ResultsTableSkeleton />
          </>
        ) : (
          <>
            <PaymentSummary filters={filters} setFilters={handleSetFilters} />
            <ResultsTable txns={mockTxns} tray="all" filters={filters} setFilters={handleSetFilters} featureFlags={featureFlags} />
          </>
        )}
      </main>

      <footer className="shrink-0 py-2 px-4 border-t border-[var(--ds-color-border-default)]/60 bg-[var(--ds-color-surface-page)] flex items-center justify-between">
        <span className="text-xs text-[var(--ds-color-text-secondary)]">©2026 Ripple Treasury. All rights reserved · 26.1.0421 · Policies · QAVR</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--ds-color-text-secondary)]">TSW Redesign · Ripple Treasury Design System · Feb 2026</span>
          <button
            onClick={() => setIsDark(d => !d)}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[var(--ds-color-border-default)] bg-[var(--ds-color-surface-raised)]/60 hover:border-[var(--ds-color-border-default)] hover:bg-[var(--ds-color-surface-raised)]/60 transition-all text-xs font-medium text-[var(--ds-color-text-secondary)] hover:text-white focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)]">
            {isDark
              ? <><Sun className="w-3 h-3 text-[var(--ds-color-feedback-warning-text)]" aria-hidden="true" /> Light</>
              : <><Moon className="w-3 h-3 text-[var(--ds-color-text-secondary)]" aria-hidden="true" /> Dark</>}
          </button>
        </div>
      </footer>
    </div>
  );
}
