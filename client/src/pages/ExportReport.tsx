import { UnifiedNav } from "@/components/UnifiedNav";
import { PrintBar } from "@/components/export/PrintBar";
import { CoverPage } from "@/components/export/CoverPage";
import { SectionA } from "@/components/export/SectionA";
import { SectionB } from "@/components/export/SectionB";
import { SectionC } from "@/components/export/SectionC";
import { SectionD } from "@/components/export/SectionD";
import { SectionE } from "@/components/export/SectionE";
import { useLazyData } from "@/hooks/useLazyData";

export default function ExportReport() {
  const dataReady = useLazyData(() => import("@/data/report-data").then(() => true));

  return (
    <div className="export-root">
      <div className="no-print">
        <UnifiedNav />
      </div>

      <PrintBar />

      <main id="main-content">
        <CoverPage />
        {dataReady && (
          <>
            <SectionA />
            <SectionB />
            <SectionC />
            <SectionD />
            <SectionE />
          </>
        )}
      </main>

      <div className="export-footer no-print">
        <p>PAYM — UX Audit & Design Report · Ripple Treasury Product Design · Feb 2026</p>
      </div>
    </div>
  );
}
