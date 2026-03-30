import { cn } from "@/lib/utils";

type SkeletonShape = "rectangle" | "circle" | "text-line";

interface SkeletonProps {
  width?: string;
  height?: string;
  shape?: SkeletonShape;
  className?: string;
}

export function Skeleton({
  width,
  height,
  shape = "rectangle",
  className,
}: SkeletonProps) {
  const shapeClasses: Record<SkeletonShape, string> = {
    rectangle: "rounded-[var(--m3-shape-sm)]",
    circle: "rounded-full",
    "text-line": "rounded-[var(--m3-shape-xs)] h-3",
  };

  return (
    <div
      className={cn(
        "skeleton-shimmer bg-slate-700/40",
        shapeClasses[shape],
        className
      )}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}
