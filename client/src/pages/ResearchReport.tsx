import { useState, useEffect } from "react";
import { UnifiedNav } from "@/components/UnifiedNav";
import { ResearchHeader } from "@/components/research/ResearchHeader";
import { ResearchHeaderSkeleton } from "@/components/research/ResearchHeaderSkeleton";
import { HeuristicTable } from "@/components/research/HeuristicTable";
import { BacklogTable } from "@/components/research/BacklogTable";
import { PriorityList } from "@/components/research/PriorityList";
import { RequirementsSection } from "@/components/research/RequirementsSection";

export default function ResearchReport() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--ds-color-surface-page)]">
      <UnifiedNav />
      <main id="main-content">
        {loaded ? (
          <>
            <ResearchHeader />
            <HeuristicTable />
            <BacklogTable />
            <PriorityList />
            <RequirementsSection />
          </>
        ) : (
          <ResearchHeaderSkeleton />
        )}
      </main>
      <footer className="py-6 border-t border-[var(--ds-color-border-default)] bg-[var(--ds-color-surface-page)] /* @ds-component: custom — surface.deep has no DS equivalent */ text-center">
        <p className="text-[var(--ds-color-text-secondary)] text-xs">PAYM — UX Research Report · Ripple Treasury Product Design · Feb 2026</p>
      </footer>
    </div>
  );
}
