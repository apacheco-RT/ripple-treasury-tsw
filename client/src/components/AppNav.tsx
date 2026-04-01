import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import {
  Banknote, CreditCard, Briefcase, Activity, Calculator, BarChart2, TrendingUp,
  Landmark, ShieldCheck, Globe, Database, Settings, Search, User, Star, HelpCircle, Bell,
  Table2, ArrowLeftRight, CheckSquare, ListOrdered, FileCheck, RotateCcw, Undo2,
  LayoutTemplate, Wrench, Cog, ClipboardList, GitCompareArrows,
  List, BarChart, History,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
import type { LucideIcon } from "lucide-react";

interface MenuItem {
  icon: LucideIcon;
  label: string;
  highlight?: boolean;
  route?: string;
}
interface MenuSection { title: string; items: MenuItem[]; }
interface NavItem {
  label: string;
  Icon: LucideIcon;
  dropdown?: "payments" | "antiFraud";
}

// ── Menu data ──────────────────────────────────────────────────────────────────

const paymentsMenuSections: MenuSection[] = [
  {
    title: "Transaction",
    items: [
      { icon: Table2,            label: "Single Transaction" },
      { icon: Table2,            label: "Multiple Transactions" },
      { icon: ArrowLeftRight,    label: "Internal Transfer" },
      { icon: GitCompareArrows,  label: "Transaction Status Workflow", highlight: true, route: "/prototype" },
      { icon: CheckSquare,       label: "Payment Approvals" },
      { icon: ListOrdered,       label: "Transaction List" },
      { icon: FileCheck,         label: "Prenote NOC" },
      { icon: RotateCcw,         label: "Returns and NOC" },
      { icon: Undo2,             label: "Reversals" },
    ],
  },
  {
    title: "Template and Instruments",
    items: [
      { icon: LayoutTemplate, label: "Payment Templates" },
      { icon: CreditCard,     label: "Instruments" },
    ],
  },
  {
    title: "Setup",
    items: [
      { icon: Wrench,       label: "Payment Setup" },
      { icon: Cog,          label: "Configuration" },
      { icon: ClipboardList,label: "Job Status" },
    ],
  },
];

const antiFraudMenuSections: MenuSection[] = [
  {
    title: "Anti Money Laundering",
    items: [
      { icon: Cog,          label: "AML Groups" },
      { icon: ShieldCheck,  label: "AML Status Workflow" },
      { icon: List,         label: "Blocked List" },
      { icon: History,      label: "History" },
      { icon: Cog,          label: "OFAC Files" },
      { icon: ClipboardList,label: "Override List" },
      { icon: BarChart,     label: "Statistics" },
    ],
  },
];

const NAV_ITEMS: NavItem[] = [
  { label: "Cash",        Icon: Banknote                  },
  { label: "Payments",    Icon: CreditCard,  dropdown: "payments"  },
  { label: "Portfolio",   Icon: Briefcase                 },
  { label: "Risk",        Icon: Activity                  },
  { label: "Accounting",  Icon: Calculator                },
  { label: "Reporting",   Icon: BarChart2                 },
  { label: "Market data", Icon: TrendingUp                },
  { label: "Banking",     Icon: Landmark                  },
  { label: "Anti fraud",  Icon: ShieldCheck, dropdown: "antiFraud" },
  { label: "Connectivity",Icon: Globe                     },
  { label: "Common data", Icon: Database                  },
  { label: "Admin",       Icon: Settings                  },
];

// ── AppNav ─────────────────────────────────────────────────────────────────────
export default function AppNav() {
  const [location, navigate]       = useLocation();
  const [antiFraudOpen, setAntiFraudOpen] = useState(false);
  const [paymentsOpen,  setPaymentsOpen]  = useState(false);

  const [paymentsSection, setPaymentsSection] = useState("Transaction");
  // Left offset for the Anti Fraud fixed dropdown
  const [afLeft, setAfLeft] = useState(0);

  // Separate refs for buttons and panels (both dropdowns render outside the overflow nav)
  const antiFraudBtn   = useRef<HTMLButtonElement>(null);
  const antiFraudPanel = useRef<HTMLDivElement>(null);
  const paymentsBtn    = useRef<HTMLButtonElement>(null);
  const paymentsPanel  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      const t = e.target as Node;
      if (
        antiFraudBtn.current   && !antiFraudBtn.current.contains(t) &&
        antiFraudPanel.current && !antiFraudPanel.current.contains(t)
      ) {
        setAntiFraudOpen(false);
      }
      if (
        paymentsBtn.current   && !paymentsBtn.current.contains(t) &&
        paymentsPanel.current && !paymentsPanel.current.contains(t)
      ) {
        setPaymentsOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setAntiFraudOpen(false);
        setPaymentsOpen(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setAntiFraudOpen(false);
    setPaymentsOpen(false);
  }, [location]);

  // Determine active nav item based on current route
  const activeItem =
    location.startsWith("/fraud") ? "Anti fraud" : "Payments";

  const toggle = (which: "payments" | "antiFraud") => {
    if (which === "antiFraud") {
      if (!antiFraudOpen && antiFraudBtn.current) {
        setAfLeft(antiFraudBtn.current.getBoundingClientRect().left);
      }
      setAntiFraudOpen(o => !o);
      setPaymentsOpen(false);
    } else {
      setPaymentsOpen(o => !o);
      setAntiFraudOpen(false);
    }
  };

  return (
    <>
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100 focus:px-4 focus:py-2 focus:rounded-[var(--ds-radius-lg)] focus:bg-[var(--ds-color-brand-primary)] focus:text-[var(--ds-color-text-on-brand)] focus:text-sm focus:font-medium focus:shadow-lg focus:outline-hidden"
      >
        Skip to main content
      </a>

      {/* Secondary Nav bar */}
      <div className="nav-dark flex items-center h-[96px] bg-[var(--ds-color-surface-sunken)] border-b border-[var(--ds-color-border-default)] shrink-0 relative z-30">

        <a href="/" className="flex items-center shrink-0 pl-4 pr-3 h-full group" aria-label="Ripple Treasury home">
          <img src="/logo.svg" alt="" className="h-9 w-auto theme-logo" aria-hidden="true" />
        </a>

        {/* Primary navigation — overflow hidden so dropdowns render outside via fixed/sibling */}
        <nav className="flex items-stretch flex-1 h-full overflow-x-auto scrollbar-none" aria-label="Main navigation">
          {NAV_ITEMS.map(({ label, Icon, dropdown }) => {
            const isActive    = label === activeItem;
            const isOpen      = dropdown === "payments" ? paymentsOpen : dropdown === "antiFraud" ? antiFraudOpen : false;

            if (dropdown === "antiFraud") {
              return (
                <button
                  key={label}
                  ref={antiFraudBtn}
                  aria-current={isActive ? "page" : undefined}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onClick={() => toggle("antiFraud")}
                  className={`flex flex-col items-center justify-center gap-[3px] px-3 h-full text-xs font-medium tracking-wide shrink-0 border-b-2 transition-all
                    ${isActive || isOpen ? "text-[var(--ds-color-brand-primary)] border-[var(--ds-color-brand-primary)] bg-[var(--ds-color-brand-primary-subtle)]" : "text-[var(--ds-color-text-secondary)] border-transparent hover:text-[var(--ds-color-text-primary)] hover:bg-white/5"}`}
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {label}
                </button>
              );
            }

            if (dropdown === "payments") {
              return (
                <button
                  key={label}
                  ref={paymentsBtn}
                  aria-current={isActive ? "page" : undefined}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onClick={() => toggle("payments")}
                  className={`flex flex-col items-center justify-center gap-[3px] px-3 h-full text-xs font-medium tracking-wide shrink-0 border-b-2 transition-all
                    ${isActive || isOpen ? "text-[var(--ds-color-brand-primary)] border-[var(--ds-color-brand-primary)] bg-[var(--ds-color-brand-primary-subtle)]" : "text-[var(--ds-color-text-secondary)] border-transparent hover:text-[var(--ds-color-text-primary)] hover:bg-white/5"}`}
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {label}
                </button>
              );
            }

            return (
              <button
                key={label}
                className="flex flex-col items-center justify-center gap-[3px] px-3 h-full text-xs font-medium tracking-wide shrink-0 border-b-2 border-transparent text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-text-primary)] hover:bg-white/5 transition-all"
              >
                <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                {label}
              </button>
            );
          })}
        </nav>

        {/* Search + utility icons */}
        <div className="flex items-center gap-1 px-4 shrink-0 h-full">
          <div className="relative mr-2">
            <input
              placeholder="I'm looking for..."
              aria-label="Global search"
              className="bg-[var(--ds-color-surface-default)] border border-[var(--ds-color-border-default)] text-[var(--ds-color-text-secondary)] text-xs rounded-full pl-4 pr-8 py-1.5 w-52 focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)] focus:border-[var(--ds-color-brand-primary)]/40 placeholder:text-[var(--ds-color-text-tertiary)] transition-all"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[var(--ds-color-text-secondary)]" aria-hidden="true" />
          </div>
          <div role="group" aria-label="User and utility actions" className="flex items-center">
            {([
              ["User profile: ADMIN[QAVR]", User],
              ["Favourites", Star],
              ["Help", HelpCircle],
              ["Notifications", Bell],
            ] as [string, typeof User][]).map(([lbl, Ic]) => (
              <button
                key={lbl}
                aria-label={lbl}
                className="text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-text-primary)] p-2 transition-colors shrink-0 rounded focus:outline-hidden focus:ring-2 focus:ring-[var(--ds-color-brand-primary)]"
              >
                <Ic className="w-4 h-4" aria-hidden="true" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Anti Fraud dropdown — fixed position to escape overflow-x-auto clipping */}
      {antiFraudOpen && (
        <div
          ref={antiFraudPanel}
          style={{ position: "fixed", left: afLeft, top: 140, zIndex: 200 }}
          className="nav-dark w-[560px] bg-[var(--ds-color-surface-page)] border border-[var(--ds-color-border-default)] rounded-b-[var(--ds-radius-xl)] shadow-2xl overflow-hidden"
        >
          {antiFraudMenuSections.map((section) => (
            <div key={section.title}>
              <div className="px-4 py-2 bg-[var(--ds-color-surface-sunken)] border-b border-[var(--ds-color-border-default)]">
                <span className="text-xs font-medium uppercase tracking-wider text-[var(--ds-color-text-secondary)]">
                  {section.title}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 p-4">
                {section.items.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.route) {
                        navigate(item.route);
                        setAntiFraudOpen(false);
                      }
                    }}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-[var(--ds-radius-lg)] transition-colors min-w-[80px] text-left ${
                      item.highlight
                        ? "bg-linear-to-br from-[var(--ds-color-feedback-warning-bg)] to-[var(--ds-color-feedback-warning-bg)] hover:from-[var(--ds-color-feedback-warning-bg)] hover:to-[var(--ds-color-feedback-warning-bg)] ring-1 ring-[var(--ds-color-feedback-warning-border)]/30"
                        : "hover:bg-[var(--ds-color-surface-default)]"
                    } ${item.route ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${item.highlight ? "text-[var(--ds-color-feedback-warning-text)]" : "text-[var(--ds-color-text-secondary)]"}`}
                      aria-hidden="true"
                    />
                    <span
                      className={`text-xs font-medium text-center leading-tight ${
                        item.highlight ? "text-[var(--ds-color-feedback-warning-text)]" : "text-[var(--ds-color-text-secondary)]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Full-width Payments dropdown (below nav bar) */}
      {paymentsOpen && (
        <div
          ref={paymentsPanel}
          className="nav-dark bg-[var(--ds-color-surface-page)] border-b border-[var(--ds-color-border-default)] shadow-xl flex relative z-40"
        >
          {/* Section sidebar */}
          <div className="w-[180px] border-r border-[var(--ds-color-border-default)] bg-[var(--ds-color-surface-sunken)] py-2 shrink-0">
            {paymentsMenuSections.map((section) => (
              <button
                key={section.title}
                onClick={() => setPaymentsSection(section.title)}
                className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${
                  paymentsSection === section.title
                    ? "text-[var(--ds-color-brand-primary)] font-medium bg-[var(--ds-color-brand-primary-subtle)] border-l-2 border-[var(--ds-color-brand-primary)]"
                    : "text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-text-primary)] hover:bg-white/5"
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>

          {/* Items grid */}
          <div className="flex-1 px-6 py-4">
            <div className="flex flex-wrap gap-3">
              {paymentsMenuSections
                .find((s) => s.title === paymentsSection)
                ?.items.map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.route) {
                        navigate(item.route);
                        setPaymentsOpen(false);
                      }
                    }}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-[var(--ds-radius-lg)] transition-colors min-w-[100px] ${
                      item.highlight
                        ? "bg-linear-to-br from-[var(--ds-color-brand-primary-subtle)] to-[var(--ds-color-brand-primary-subtle)] hover:from-[var(--ds-color-interactive-selected-bg)] hover:to-[var(--ds-color-interactive-selected-bg)] ring-1 ring-[var(--ds-color-brand-primary)]/30"
                        : "hover:bg-[var(--ds-color-surface-default)]"
                    } ${item.route ? "cursor-pointer" : "cursor-default"}`}
                  >
                    <item.icon
                      className={`w-6 h-6 ${item.highlight ? "text-[var(--ds-color-brand-primary)]" : "text-[var(--ds-color-text-secondary)]"}`}
                      aria-hidden="true"
                    />
                    <span
                      className={`text-xs font-medium text-center leading-tight ${
                        item.highlight ? "text-[var(--ds-color-brand-primary)]" : "text-[var(--ds-color-text-secondary)]"
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
