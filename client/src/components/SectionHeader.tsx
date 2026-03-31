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
        {icon && <div className="text-blue-400">{icon}</div>}
        <h2 className="text-3xl font-medium text-white m-0 tracking-tight">{title}</h2>
      </div>
      {subtitle && (
        <p className="text-lg text-[var(--ds-color-text-secondary)] max-w-2xl">{subtitle}</p>
      )}
      <div className="absolute -bottom-4 left-0 w-24 h-1 bg-linear-to-r from-blue-500 to-teal-500 rounded-full opacity-80" />
    </div>
  );
}
