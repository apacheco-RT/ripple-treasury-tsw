import { SevBadge, EffortBadge } from "./ExportBadges";
import { useLazyData } from "@/hooks/useLazyData";

export function SectionB() {
  const backlog = useLazyData(() => import("@/data/report-data").then(m => m.backlog));

  if (!backlog) return null;

  return (
    <div className="print-page">
      <div className="section-header">
        <span className="section-badge teal">B</span>
        <div>
          <h2 className="section-title">Customer Backlog — Enhancement Requests</h2>
          <p className="section-sub">7 items from the product backlog reported by Ripple Treasury customers on the Transaction Status Workflow.</p>
        </div>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th className="w-[4%]">#</th>
            <th className="w-[35%]">Enhancement Request</th>
            <th className="w-[8%]">Screen</th>
            <th className="w-[11%]">Effort</th>
            <th className="w-[10%]">Impact</th>
            <th>Design Note</th>
          </tr>
        </thead>
        <tbody>
          {backlog.map((b, i) => (
            <tr key={i}>
              <td className="mono bold muted">{i + 1}</td>
              <td>{b.item}</td>
              <td><span className="screen-chip">{b.screen}</span></td>
              <td><EffortBadge level={b.effort} /></td>
              <td><SevBadge level={b.impact} /></td>
              <td>{b.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
