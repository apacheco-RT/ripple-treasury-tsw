import { SevBadge, EffortBadge } from "./ExportBadges";
import { useLazyData } from "@/hooks/useLazyData";

export function SectionD() {
  const requirements = useLazyData(() => import("@/data/report-data").then(m => m.requirements));

  if (!requirements) return null;

  return (
    <div className="print-page">
      <div className="section-header">
        <span className="section-badge orange">D</span>
        <div>
          <h2 className="section-title">Design Requirements & Changes — REQ-01 to REQ-15</h2>
          <p className="section-sub">15 functional requirements derived from the heuristic evaluation and customer feedback. Each maps to a screen, source finding, and concrete design change.</p>
        </div>
      </div>
      <div className="req-list">
        {requirements.map(req => (
          <div key={req.id} className="req-card avoid-break">
            <div className="req-header">
              <span className="req-id">{req.id}</span>
              <span className="screen-chip">{req.screen}</span>
              <SevBadge level={req.severity} />
              <EffortBadge level={req.effort} />
              {req.isBug && <span className="print-badge print-badge-high">⚠ DEFECT</span>}
              <span className="source-chip">{req.source}</span>
              <span className="req-title">{req.title}</span>
            </div>
            <div className="req-body">
              <div className="req-col">
                <p className="col-label">Requirement</p>
                <p className="col-text">{req.requirement}</p>
              </div>
              <div className="req-col">
                <p className="col-label teal-label">Design Change</p>
                <p className="col-text">{req.designChange}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
