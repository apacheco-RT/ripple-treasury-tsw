import { Skeleton } from "@/components/Skeleton";

export function ResearchHeaderSkeleton() {
  return (
    <section className="pt-28 pb-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[300px] bg-blue-600/8 rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-6 relative z-10 max-w-6xl">
        <Skeleton width="140px" height="28px" className="rounded-full mb-4" />
        <Skeleton width="380px" height="40px" className="mb-3" />
        <Skeleton width="460px" height="20px" shape="text-line" className="mb-2" />
        <Skeleton width="320px" height="20px" shape="text-line" className="mb-6" />

        <div className="bg-[var(--ds-color-surface-raised)]/40 border border-[var(--ds-color-border-default)] rounded-[var(--ds-radius-xl)] p-4 max-w-4xl">
          <div className="space-y-2">
            <Skeleton width="100%" height="14px" shape="text-line" />
            <Skeleton width="100%" height="14px" shape="text-line" />
            <Skeleton width="85%" height="14px" shape="text-line" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-10">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-[var(--ds-color-surface-default)] rounded-[var(--ds-radius-xl)] border border-[var(--ds-color-border-default)] p-4 flex items-start gap-4"
            >
              <Skeleton width="20px" height="20px" shape="circle" className="mt-0.5 shrink-0" />
              <div className="flex-1">
                <Skeleton width="100px" height="10px" shape="text-line" className="mb-2" />
                <Skeleton width="30px" height="22px" className="mb-2" />
                <Skeleton width="100%" height="12px" shape="text-line" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
