import { Skeleton } from "@/components/Skeleton";

export function PaymentSummarySkeleton() {
  return (
    <section
      aria-label="Payment summary loading"
      className="bg-[var(--ds-color-surface-default)] border border-[var(--ds-color-border-default)]/50 rounded-[var(--ds-radius-xl)] overflow-hidden"
    >
      <div className="flex items-center gap-3 px-4 py-2.5">
        <Skeleton width="160px" height="20px" />
        <Skeleton width="120px" height="14px" shape="text-line" />
        <div className="ml-auto flex items-center gap-1">
          <Skeleton width="28px" height="28px" shape="rectangle" />
          <Skeleton width="28px" height="28px" shape="rectangle" />
        </div>
      </div>

      <div className="border-t border-[var(--ds-color-border-default)] p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-start">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="rounded-[var(--ds-radius-xl)] border border-[var(--ds-color-border-default)]/50 bg-[var(--ds-color-surface-page)] flex flex-col overflow-hidden"
            >
              <div className="px-4 pt-3 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <Skeleton width="28px" height="28px" shape="rectangle" />
                  <Skeleton width="90px" height="16px" shape="text-line" />
                </div>
                <div className="pl-[38px] mt-2 flex items-baseline justify-between gap-2">
                  <Skeleton width="60px" height="18px" />
                  <Skeleton width="80px" height="14px" shape="text-line" />
                </div>
              </div>
              <div className="w-full flex items-center justify-center gap-1 px-3 py-1.5 border-t border-[var(--ds-color-border-default)]/30 bg-[var(--ds-color-surface-sunken)]/50">
                <Skeleton width="40px" height="12px" shape="text-line" />
              </div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4 mt-3 rounded-[var(--ds-radius-xl)] border border-[var(--ds-color-border-default)]/60 bg-[var(--ds-color-surface-page)] px-5 py-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}>
              <Skeleton width="70px" height="12px" shape="text-line" className="mb-1.5" />
              <Skeleton width="110px" height="16px" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
