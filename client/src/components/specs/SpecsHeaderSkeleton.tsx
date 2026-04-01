import { Skeleton } from "@/components/Skeleton";

export function SpecsHeaderSkeleton() {
  return (
    <section className="pt-28 pb-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/3 w-[400px] h-[300px] bg-[var(--ds-color-brand-primary-subtle)] rounded-full blur-3xl" />
      </div>
      <div className="container mx-auto px-6 relative z-10 max-w-5xl">
        <Skeleton width="150px" height="28px" className="rounded-full mb-4" />
        <Skeleton width="350px" height="40px" className="mb-3" />
        <Skeleton width="440px" height="20px" shape="text-line" className="mb-2" />
        <Skeleton width="300px" height="20px" shape="text-line" className="mb-6" />

        <div className="bg-[var(--ds-color-surface-raised)]/40 border border-[var(--ds-color-border-default)] rounded-[var(--ds-radius-xl)] p-4 max-w-4xl mb-10">
          <div className="space-y-2">
            <Skeleton width="100%" height="14px" shape="text-line" />
            <Skeleton width="100%" height="14px" shape="text-line" />
            <Skeleton width="75%" height="14px" shape="text-line" />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton
              key={i}
              width={`${100 + i * 20}px`}
              height="30px"
              className="rounded-[var(--ds-radius-lg)]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
