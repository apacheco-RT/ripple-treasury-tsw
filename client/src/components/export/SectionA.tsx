import { SevBadge } from "./ExportBadges";
import { useLazyData } from "@/hooks/useLazyData";

export function SectionA() {
  const heuristics = useLazyData(() => import("@/data/report-data").then(m => m.heuristics));

  if (!heuristics) return null;

  return (
    <div className="print-page">
      <div className="section-header">
        <span className="section-badge">A</span>
        <div>
          <h2 className="section-title">Heuristic Evaluation — H1 to H10</h2>
          <p className="section-sub">Nielsen's 10 usability heuristics applied to the Transaction Status Workflow. Severity rated by frequency × impact.</p>
        </div>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th className="w-[4%]">ID</th>
            <th className="w-[18%]">Heuristic</th>
            <th className="w-[32%]">Finding</th>
            <th className="w-[8%]">Screen</th>
            <th className="w-[10%]">Severity</th>
            <th>Impact</th>
          </tr>
        </thead>
        <tbody>
          {heuristics.map(h => (
            <tr key={h.id}>
              <td className="mono bold blue">{h.id}</td>
              <td className="bold">{h.name}</td>
              <td>{h.finding}</td>
              <td><span className="screen-chip">{h.screen}</span></td>
              <td><SevBadge level={h.severity} /></td>
              <td>{h.impact}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
