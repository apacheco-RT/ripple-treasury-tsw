import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { Settings2, X, ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { prototypeFeatures } from "@/lib/types";

export function ConfigurePrototypeModal({
  open,
  onClose,
  triggerRef,
}: {
  open: boolean;
  onClose: () => void;
  triggerRef?: React.RefObject<HTMLButtonElement>;
}) {
  const [, navigate] = useLocation();
  const modalRef = useRef<HTMLDivElement>(null);
  const [featureToggles, setFeatureToggles] = useState<Record<string, boolean>>({
    rlusdStrip: false,
    stablecoinRail: false,
    selectPaymentRail: false,
    riskColumn: false,
    fraudSpotlight: false,
  });

  const toggleFeature = (key: string) => {
    setFeatureToggles(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const closeModal = useCallback(() => {
    onClose();
    triggerRef?.current?.focus();
  }, [onClose, triggerRef]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleKey);
    modalRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, closeModal]);

  const launchPrototype = () => {
    const params = new URLSearchParams();
    Object.entries(featureToggles).forEach(([key, val]) => {
      if (val) params.set(key, "1");
    });
    const qs = params.toString();
    onClose();
    navigate(`/prototype${qs ? `?${qs}` : ""}`);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-xs"
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
            className="w-full max-w-md mx-4 bg-[var(--ds-color-surface-default)] border border-[var(--ds-color-border-default)]/60 rounded-[var(--ds-radius-3xl)] shadow-2xl overflow-hidden outline-hidden"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--ds-color-border-default)]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[var(--ds-radius-xl)] bg-linear-to-br from-purple-600 to-purple-800 flex items-center justify-center">
                  <Settings2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 id="config-modal-title" className="text-lg font-medium text-white m-0">Configure Prototype</h2>
                  <p className="text-xs text-[var(--ds-color-text-secondary)] m-0">Toggle features before launching</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                aria-label="Close configure modal"
                className="p-2 rounded-[var(--ds-radius-lg)] text-[var(--ds-color-text-secondary)] hover:text-white hover:bg-white/5 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ds-color-brand-primary)]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-3">
              {prototypeFeatures.map((feature) => (
                <div
                  key={feature.key}
                  className={`flex items-center justify-between p-4 rounded-[var(--ds-radius-xl)] border transition-all ${
                    featureToggles[feature.key]
                      ? "border-[var(--ds-color-brand-primary)]/30 bg-[var(--ds-color-brand-primary-subtle)]"
                      : "border-[var(--ds-color-border-default)]/40 bg-[var(--ds-color-surface-sunken)]"
                  }`}
                >
                  <div className="flex-1 min-w-0 mr-4">
                    <span className="text-sm font-medium text-white block">{feature.label}</span>
                    <span className="text-xs text-[var(--ds-color-text-secondary)] block mt-0.5">{feature.description}</span>
                  </div>
                  <button
                    role="switch"
                    aria-checked={featureToggles[feature.key]}
                    onClick={() => toggleFeature(feature.key)}
                    className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 transition-colors focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ds-color-brand-primary)] ${
                      featureToggles[feature.key]
                        ? "bg-[var(--ds-color-brand-primary)] border-[var(--ds-color-brand-primary)]"
                        : "bg-[var(--ds-color-surface-raised)] border-[var(--ds-color-border-default)]"
                    }`}
                  >
                    <span
                      className={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow transition-transform mt-px ${
                        featureToggles[feature.key] ? "translate-x-[21px]" : "translate-x-[2px]"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 border-t border-[var(--ds-color-border-default)] flex items-center justify-between">
              <span className="text-xs text-[var(--ds-color-text-secondary)]">
                {Object.values(featureToggles).filter(Boolean).length} of {prototypeFeatures.length} features enabled
              </span>
              <button
                onClick={launchPrototype}
                className="px-6 h-10 bg-[var(--ds-color-brand-primary)] hover:bg-[var(--ds-color-brand-primary-hover)] text-white text-sm font-medium rounded-full transition-all flex items-center gap-2 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ds-color-brand-primary)]"
              >
                Launch Prototype
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
