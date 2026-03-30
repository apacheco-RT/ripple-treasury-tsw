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
    <div className="min-h-screen bg-surface-page">
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
      <footer className="py-6 border-t border-slate-800 bg-surface-deep text-center">
        <p className="text-slate-400 text-xs">PAYM — UX Research Report · Ripple Treasury Product Design · Feb 2026</p>
      </footer>
    </div>
  );
}
