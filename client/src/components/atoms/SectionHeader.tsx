// @tsw-atom — TSW-specific atom, stays local
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  icon?: ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({ icon, title, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={cn("mb-10 relative", className)}>
      <div className="flex items-center gap-3 mb-2">
        {icon && <div className="text-[var(--ds-color-feedback-info-text)]">{icon}</div>}
        <h2 className="text-3xl font-medium text-[var(--ds-color-text-primary)] m-0 tracking-tight">{title}</h2>
      </div>
      {subtitle && (
        <p className="text-lg text-[var(--ds-color-text-secondary)] max-w-2xl">{subtitle}</p>
      )}
      <div className="absolute -bottom-4 left-0 w-24 h-1 bg-linear-to-r from-[var(--ds-color-feedback-info-border)] to-[var(--ds-color-brand-primary)] rounded-full opacity-80" />
    </div>
  );
}
