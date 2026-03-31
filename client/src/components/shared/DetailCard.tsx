import React from "react";
import { cn } from "@/lib/utils";

interface DetailCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

function DetailCardInner({ title, children, className }: DetailCardProps) {
  return (
    <div className={cn("rounded-[var(--ds-radius-lg)] bg-[var(--ds-color-surface-default)] border border-[var(--ds-color-border-default)]/50 p-4", className)}>
      <h4 className="text-xs font-medium text-teal-400 mb-3 pb-2 border-b border-[var(--ds-color-border-default)]/50 uppercase tracking-wider">
        {title}
      </h4>
      {children}
    </div>
  );
}

export const DetailCard = React.memo(DetailCardInner);
