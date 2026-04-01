import { useState, useEffect } from "react";
import { UnifiedNav } from "@/components/navigation/UnifiedNav";
import { SpecsHeader } from "@/components/templates/specs/SpecsHeader";
import { SpecsHeaderSkeleton } from "@/components/templates/specs/SpecsHeaderSkeleton";
import { SpecCard } from "@/components/templates/specs/SpecCard";
import { SectionDivider } from "@/components/templates/specs/specs-data";
import { useLazyData } from "@/hooks/useLazyData";

export default function AnnotatedSpecs() {
  const [loaded, setLoaded] = useState(false);
  const specs = useLazyData(() => import("@/data/report-data").then(m => m.specs));

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const highSpecs   = specs?.filter(s => ["P1","P2","P3","P4","P5","P6"].includes(s.rank)) ?? [];
  const mediumSpecs = specs?.filter(s => ["P7","P8","P9"].includes(s.rank)) ?? [];
  const lowSpecs    = specs?.filter(s => ["P10"].includes(s.rank)) ?? [];

  return (
    <div className="min-h-screen bg-[var(--ds-color-surface-page)]">
      <UnifiedNav />
      <main id="main-content">
        {loaded && specs ? (
          <>
            <SpecsHeader />
            <section className="pb-16 border-t border-[var(--ds-color-border-default)]">
              <div className="container mx-auto px-6 max-w-5xl">
                <div className="pt-10">
                  <SectionDivider label="HIGH" color="bg-[var(--ds-color-feedback-error-bg)] border-[var(--ds-color-feedback-error-border)]/20 text-[var(--ds-color-feedback-error-text)]" />
                  <div className="space-y-6">
                    {highSpecs.map((spec, i) => (
                      <SpecCard key={spec.rank} spec={spec} index={i} />
                    ))}
                  </div>
                </div>

                <div className="pt-10">
                  <SectionDivider label="MEDIUM" color="bg-[var(--ds-color-feedback-warning-bg)] border-[var(--ds-color-feedback-warning-border)]/20 text-[var(--ds-color-feedback-warning-text)]" />
                  <div className="space-y-6">
                    {mediumSpecs.map((spec, i) => (
                      <SpecCard key={spec.rank} spec={spec} index={i} />
                    ))}
                  </div>
                </div>

                <div className="pt-10">
                  <SectionDivider label="LOW" color="bg-[var(--ds-color-feedback-success-bg)] border-[var(--ds-color-feedback-success-border)]/20 text-[var(--ds-color-feedback-success-text)]" />
                  <div className="space-y-6">
                    {lowSpecs.map((spec, i) => (
                      <SpecCard key={spec.rank} spec={spec} index={i} />
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </>
        ) : (
          <SpecsHeaderSkeleton />
        )}
      </main>
      <footer className="py-6 border-t border-[var(--ds-color-border-default)] bg-[var(--ds-color-surface-page)] /* @ds-component: custom — surface.deep has no DS equivalent */ text-center">
        <p className="text-[var(--ds-color-text-secondary)] text-xs">PAYM — Annotated Specs · Ripple Treasury Product Design · Feb 2026</p>
      </footer>
    </div>
  );
}
