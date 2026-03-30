import { SevBadge, EffortBadge } from "./ExportBadges";
import { useLazyData } from "@/hooks/useLazyData";

export function SectionE() {
  const specs = useLazyData(() => import("@/data/report-data").then(m => m.specs));

  if (!specs) return null;

  return (
    <div className="print-page">
      <div className="section-header">
        <span className="section-badge teal">E</span>
        <div>
          <h2 className="section-title">Annotated Design Specifications — P1 to P10</h2>
          <p className="section-sub">10 prioritised recommendations each with a problem statement, proposed solution, design tokens, and testable acceptance criteria.</p>
        </div>
      </div>
      <div className="specs-list">
        {specs.map((s, i) => (
          <div key={s.rank} className={`spec-card avoid-break ${i < 6 ? "spec-high" : i < 9 ? "spec-med" : "spec-low"}`}>
            <div className="spec-header">
              <span className="spec-rank">{s.rank}</span>
              <SevBadge level={s.severity} />
              <EffortBadge level={s.effort} />
              <span className="heuristic-chip">{s.heuristic}</span>
              <span className="spec-title">{s.title}</span>
            </div>
            <div className="spec-body">
              <div className="spec-col">
                <p className="col-label red-label">⚠ Problem — Current State</p>
                <p className="col-text">{s.problem}</p>
              </div>
              <div className="spec-col">
                <p className="col-label teal-label">→ Solution — Proposed Design</p>
                <p className="col-text">{s.solution}</p>
              </div>
            </div>
            <div className="spec-footer">
              <div className="spec-col">
                <p className="col-label">Design Tokens & Components</p>
                <ul className="token-list">
                  {s.tokens.map((t, ti) => <li key={ti}>› {t}</li>)}
                </ul>
              </div>
              <div className="spec-col">
                <p className="col-label">Acceptance Criteria</p>
                <ol className="criteria-list">
                  {s.criteria.map((c, ci) => <li key={ci}>{c}</li>)}
                </ol>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
