import { Skeleton } from "@/components/Skeleton";

export function SpecsHeaderSkeleton() {
  return (
    <section className="pt-28 pb-12 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/3 w-[400px] h-[300px] bg-teal-600/8 rounded-(--m3-shape-full) blur-3xl" />
      </div>
      <div className="container mx-auto px-6 relative z-10 max-w-5xl">
        <Skeleton width="150px" height="28px" className="rounded-(--m3-shape-full) mb-4" />
        <Skeleton width="350px" height="40px" className="mb-3" />
        <Skeleton width="440px" height="20px" shape="text-line" className="mb-2" />
        <Skeleton width="300px" height="20px" shape="text-line" className="mb-6" />

        <div className="bg-slate-800/40 border border-surface-border rounded-(--m3-shape-md) p-(--m3-card-padding) max-w-4xl mb-10">
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
              className="rounded-(--m3-shape-sm)"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
