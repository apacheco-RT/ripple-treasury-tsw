import { Link, useLocation } from "wouter";
import { useState, useEffect, useRef, useCallback } from "react";
import { Sun, Moon, Settings2, X, ArrowRight, ChevronDown, Menu, Download, Loader2 } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { AnimatePresence, motion } from "framer-motion";

const prototypeFeatures = [
  { key: "rlusdStrip", label: "RLUSD Eligible Strip", description: "Highlight transactions eligible for instant RLUSD settlement" },
  { key: "stablecoinRail", label: "Stablecoin Payment Rail", description: "Show stablecoin option in payment rail selection dialog" },
  { key: "selectPaymentRail", label: "Select Payment Rail Button", description: "Enable payment rail selection for RLUSD-eligible transactions" },
  { key: "riskColumn", label: "Risk Column", description: "Show inline risk score column in the transaction details table" },
  { key: "fraudSpotlight", label: "Fraud Protection Spotlight", description: "Show the fraud protection spotlight banner with flagged transactions" },
];

const navLinks = [
  { href: "/", label: "Hub" },
  { href: "/research", label: "Research" },
  { href: "/specs", label: "Specs" },
  { href: "/prototype", label: "Prototype", isPrototype: true },
];

function downloadPrototypeHtml(setDownloading: (v: boolean) => void) {
  setDownloading(true);
  const a = document.createElement('a');
  a.href = '/api/download-prototype';
  a.download = 'ripple-treasury-prototype.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => setDownloading(false), 3000);
}

export function UnifiedNav() {
  const [location, navigate] = useLocation();
  const { theme, toggle } = useTheme();
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [featureToggles, setFeatureToggles] = useState<Record<string, boolean>>({
    rlusdStrip: false,
    stablecoinRail: false,
    selectPaymentRail: false,
    riskColumn: false,
    fraudSpotlight: false,
  });

  const modalRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const toggleFeature = (key: string) => {
    setFeatureToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const closeModal = useCallback(() => {
    setShowConfigModal(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!showConfigModal) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleKey);
    modalRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKey);
  }, [showConfigModal, closeModal]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [mobileMenuOpen]);

  const launchPrototype = () => {
    const params = new URLSearchParams();
    Object.entries(featureToggles).forEach(([key, val]) => {
      if (val) params.set(key, "1");
    });
    const qs = params.toString();
    setShowConfigModal(false);
    navigate(`/prototype${qs ? `?${qs}` : ""}`);
  };

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-[var(--m3-shape-sm)] focus:bg-teal-600 focus:text-white focus:text-sm focus:font-bold focus:shadow-lg focus:outline-none">
        Skip to main content
      </a>
      <header className="fixed top-0 left-0 right-0 z-50 glass-header">
        <div className="w-full px-4">
          <div className="flex items-center h-11">
            <button
              onClick={() => setMobileMenuOpen(o => !o)}
              className="p-2 rounded-[var(--m3-shape-full)] text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-colors shrink-0 mr-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 h-[var(--m3-icon-button)] w-[var(--m3-icon-button)] flex items-center justify-center"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <nav className="hidden lg:flex items-center flex-1 overflow-x-auto scrollbar-none">
              {navLinks.map(({ href, label, isPrototype }) => {
                const active = isActive(href);
                if (isPrototype) {
                  return (
                    <button
                      key={href}
                      ref={triggerRef}
                      onClick={() => setShowConfigModal(true)}
                      className={`px-3 py-1.5 rounded-[var(--m3-shape-sm)] text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer flex items-center gap-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400
                        ${active
                          ? "bg-teal-500/15 text-teal-400 border border-teal-500/25"
                          : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                        }`}
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                      {label}
                    </button>
                  );
                }
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`px-3 py-1.5 rounded-[var(--m3-shape-sm)] text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400
                      ${active
                        ? "bg-teal-500/15 text-teal-400 border border-teal-500/25"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                      }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-1.5 shrink-0 ml-auto">
              <button
                onClick={() => downloadPrototypeHtml(setDownloading)}
                disabled={downloading}
                aria-label="Download prototype as HTML"
                title="Download prototype as HTML"
                className="p-2 rounded-[var(--m3-shape-full)] transition-all duration-200 text-slate-400 hover:text-teal-400 hover:bg-teal-500/10 border border-transparent hover:border-teal-500/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 h-[var(--m3-icon-button)] w-[var(--m3-icon-button)] flex items-center justify-center disabled:opacity-50 disabled:cursor-wait"
              >
                {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              </button>
              <button
                onClick={toggle}
                aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                className="p-2 rounded-[var(--m3-shape-full)] transition-all duration-200 text-slate-400 hover:text-slate-600 hover:bg-black/5 border border-transparent hover:border-slate-200/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 h-[var(--m3-icon-button)] w-[var(--m3-icon-button)] flex items-center justify-center"
              >
                {theme === "dark"
                  ? <Sun className="w-4 h-4" />
                  : <Moon className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-surface-border/50 bg-surface-page/95 backdrop-blur-md">
            <nav className="flex flex-col px-4 py-3 gap-1">
              {navLinks.map(({ href, label, isPrototype }) => {
                const active = isActive(href);
                if (isPrototype) {
                  return (
                    <button
                      key={href}
                      onClick={() => { setMobileMenuOpen(false); setShowConfigModal(true); }}
                      className={`px-3 py-2 rounded-[var(--m3-shape-sm)] text-sm font-medium text-left transition-all duration-200 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400
                        ${active
                          ? "bg-teal-500/15 text-teal-400"
                          : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                        }`}
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                      {label}
                    </button>
                  );
                }
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`px-3 py-2 rounded-[var(--m3-shape-sm)] text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400
                      ${active
                        ? "bg-teal-500/15 text-teal-400"
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
                      }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      <AnimatePresence>
        {showConfigModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="config-modal-title"
              tabIndex={-1}
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md mx-4 bg-surface-card border border-slate-700/60 rounded-[var(--m3-shape-xl)] shadow-2xl overflow-hidden outline-none"
            >
              <div className="flex items-center justify-between p-[var(--m3-dialog-padding)] border-b border-surface-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[var(--m3-shape-sm)] bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                    <Settings2 className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 id="config-modal-title" className="text-[var(--m3-headline-sm)] font-normal text-white m-0">Configure Prototype</h2>
                    <p className="text-xs text-slate-400 m-0">Toggle features before launching</p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  aria-label="Close configure modal"
                  className="p-2 rounded-[var(--m3-shape-sm)] text-slate-400 hover:text-white hover:bg-white/5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-[var(--m3-dialog-padding)] space-y-3">
                {prototypeFeatures.map((feature) => (
                  <div
                    key={feature.key}
                    className={`flex items-center justify-between p-[var(--m3-card-padding)] rounded-[var(--m3-shape-md)] border transition-all ${
                      featureToggles[feature.key]
                        ? "border-teal-500/30 bg-teal-500/5"
                        : "border-slate-700/40 bg-surface-inset"
                    }`}
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <span className="text-sm font-medium text-white block">{feature.label}</span>
                      <span className="text-xs text-slate-400 block mt-0.5">{feature.description}</span>
                    </div>
                    <button
                      role="switch"
                      aria-checked={featureToggles[feature.key]}
                      onClick={() => toggleFeature(feature.key)}
                      className={`relative inline-flex h-6 w-11 shrink-0 rounded-[var(--m3-shape-full)] border-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
                        featureToggles[feature.key]
                          ? "bg-teal-500 border-teal-500"
                          : "bg-surface-elevated border-surface-border"
                      }`}
                    >
                      <span
                        className={`pointer-events-none block h-4 w-4 rounded-[var(--m3-shape-full)] bg-white shadow transition-transform mt-[1px] ${
                          featureToggles[feature.key] ? "translate-x-[21px]" : "translate-x-[2px]"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <div className="p-[var(--m3-dialog-padding)] border-t border-surface-border flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {Object.values(featureToggles).filter(Boolean).length} of {prototypeFeatures.length} features enabled
                </span>
                <button
                  onClick={launchPrototype}
                  className="h-[var(--m3-button-height)] px-[var(--m3-button-padding-h)] bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white text-sm font-medium rounded-[var(--m3-shape-full)] transition-all shadow-lg hover:shadow-purple-500/20 flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                >
                  Launch Prototype
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
