import { SevBadge, EffortBadge } from "./ExportBadges";
import { useLazyData } from "@/hooks/useLazyData";

export function SectionC() {
  const priority = useLazyData(() => import("@/data/report-data").then(m => m.priority));

  if (!priority) return null;

  return (
    <div className="print-page">
      <div className="section-header">
        <span className="section-badge purple">C</span>
        <div>
          <h2 className="section-title">Combined Priority List — P1 to P10</h2>
          <p className="section-sub">Heuristic and backlog findings consolidated and ranked by severity × feasibility.</p>
        </div>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th className="w-[6%]">Rank</th>
            <th>Finding</th>
            <th className="w-[12%]">Source</th>
            <th className="w-[11%]">Severity</th>
            <th className="w-[13%]">Effort</th>
          </tr>
        </thead>
        <tbody>
          {priority.map(p => (
            <tr key={p.rank}>
              <td className="mono bold">{p.rank}</td>
              <td>{p.finding}</td>
              <td><span className="source-chip">{p.source}</span></td>
              <td><SevBadge level={p.severity} /></td>
              <td><EffortBadge level={p.effort} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
