import { UnifiedNav } from "@/components/navigation/UnifiedNav";
import { PrintBar } from "@/components/templates/export/PrintBar";
import { CoverPage } from "@/components/templates/export/CoverPage";
import { SectionA } from "@/components/templates/export/SectionA";
import { SectionB } from "@/components/templates/export/SectionB";
import { SectionC } from "@/components/templates/export/SectionC";
import { SectionD } from "@/components/templates/export/SectionD";
import { SectionE } from "@/components/templates/export/SectionE";
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
