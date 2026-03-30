import { useState, useEffect } from "react";
import { UnifiedNav } from "@/components/UnifiedNav";
import { SpecsHeader } from "@/components/specs/SpecsHeader";
import { SpecsHeaderSkeleton } from "@/components/specs/SpecsHeaderSkeleton";
import { SpecCard } from "@/components/specs/SpecCard";
import { SectionDivider } from "@/components/specs/specs-data";
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
    <div className="min-h-screen bg-surface-page">
      <UnifiedNav />
      <main id="main-content">
        {loaded && specs ? (
          <>
            <SpecsHeader />
            <section className="pb-16 border-t border-surface-border">
              <div className="container mx-auto px-6 max-w-5xl">
                <div className="pt-10">
                  <SectionDivider label="HIGH" color="bg-rose-500/8 border-rose-500/20 text-rose-400" />
                  <div className="space-y-6">
                    {highSpecs.map((spec, i) => (
                      <SpecCard key={spec.rank} spec={spec} index={i} />
                    ))}
                  </div>
                </div>

                <div className="pt-10">
                  <SectionDivider label="MEDIUM" color="bg-amber-500/8 border-amber-500/20 text-amber-400" />
                  <div className="space-y-6">
                    {mediumSpecs.map((spec, i) => (
                      <SpecCard key={spec.rank} spec={spec} index={i} />
                    ))}
                  </div>
                </div>

                <div className="pt-10">
                  <SectionDivider label="LOW" color="bg-emerald-500/8 border-emerald-500/20 text-emerald-400" />
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
      <footer className="py-6 border-t border-slate-800 bg-surface-deep text-center">
        <p className="text-slate-400 text-xs">PAYM — Annotated Specs · Ripple Treasury Product Design · Feb 2026</p>
      </footer>
    </div>
  );
}
