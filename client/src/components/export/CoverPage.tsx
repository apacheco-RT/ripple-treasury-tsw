export function CoverPage() {
  return (
    <div className="print-page cover-page">
      <div className="cover-inner">
        <p className="cover-tag">Ripple Treasury · Ripple Treasury Product Design</p>
        <h1 className="cover-title">Transaction Status Workflow</h1>
        <p className="cover-subtitle">UX Audit & Design Requirements</p>
        <div className="cover-meta">
          <span>February 2026</span>
          <span>·</span>
          <span>10 Heuristic Findings</span>
          <span>·</span>
          <span>7 Customer Requests</span>
          <span>·</span>
          <span>15 Design Requirements</span>
          <span>·</span>
          <span>10 Annotated Specs</span>
        </div>
        <div className="cover-toc">
          <p className="toc-label">Contents</p>
          <ol className="toc-list">
            <li>Section A — Heuristic Evaluation (H1–H10)</li>
            <li>Section B — Customer Backlog & Enhancement Requests</li>
            <li>Section C — Combined Priority List (P1–P10)</li>
            <li>Section D — Design Requirements & Changes (REQ-01–15)</li>
            <li>Section E — Annotated Design Specifications (P1–P10)</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
