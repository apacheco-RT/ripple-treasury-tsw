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
    rectangle: "rounded-[var(--ds-radius-lg)]",
    circle: "rounded-full",
    "text-line": "rounded-[var(--ds-radius-xs)] h-3",
  };

  return (
    <div
      className={cn(
        "skeleton-shimmer bg-[var(--ds-color-surface-raised)]/40",
        shapeClasses[shape],
        className
      )}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}
