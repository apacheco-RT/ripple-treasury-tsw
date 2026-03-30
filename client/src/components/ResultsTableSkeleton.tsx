import { Skeleton } from "@/components/Skeleton";

export function ResultsTableSkeleton() {
  const columns = 8;
  const rows = 6;

  return (
    <section aria-label="Transaction results loading">
      <div className="flex items-center px-4 py-3 bg-surface-card border border-b border-slate-700/50 rounded-t-(--m3-shape-md)">
        <Skeleton width="160px" height="20px" />
      </div>

      <div className="flex items-center gap-3 px-4 py-2.5 bg-surface-card border-x border-slate-700/50">
        <Skeleton width="200px" height="32px" />
        <div className="ml-auto flex items-center gap-2">
          <Skeleton width="80px" height="28px" />
          <Skeleton width="28px" height="28px" />
          <Skeleton width="28px" height="28px" />
        </div>
      </div>

      <div className="bg-surface-card border border-slate-700/50 rounded-b-(--m3-shape-md) overflow-x-auto">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-surface-inset border-b border-slate-700/60">
              <th className="pl-3 pr-1 py-3 w-6"><Skeleton width="16px" height="16px" /></th>
              <th className="px-3 py-3 w-9"><Skeleton width="16px" height="16px" /></th>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-3 py-3">
                  <Skeleton width={`${60 + (i % 3) * 20}px`} height="14px" shape="text-line" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {Array.from({ length: rows }).map((_, rowIdx) => (
              <tr key={rowIdx} className="bg-surface-page">
                <td className="pl-3 pr-1 py-3"><Skeleton width="16px" height="16px" shape="circle" /></td>
                <td className="px-3 py-3"><Skeleton width="16px" height="16px" /></td>
                {Array.from({ length: columns }).map((_, colIdx) => (
                  <td key={colIdx} className="px-3 py-3">
                    <Skeleton
                      width={`${50 + ((rowIdx + colIdx) % 4) * 15}px`}
                      height="14px"
                      shape="text-line"
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-4 py-2.5 border-t border-slate-700/60">
          <Skeleton width="140px" height="14px" shape="text-line" />
          <div className="flex items-center gap-2">
            <Skeleton width="28px" height="28px" />
            <Skeleton width="60px" height="14px" shape="text-line" />
            <Skeleton width="28px" height="28px" />
          </div>
        </div>
      </div>
    </section>
  );
}
