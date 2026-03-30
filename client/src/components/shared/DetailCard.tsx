import React from "react";
import { cn } from "@/lib/utils";

interface DetailCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

function DetailCardInner({ title, children, className }: DetailCardProps) {
  return (
    <div className={cn("rounded-(--m3-shape-sm) bg-surface-card border border-slate-700/50 p-4", className)}>
      <h4 className="text-(--m3-label-sm) font-medium text-teal-400 mb-3 pb-2 border-b border-slate-700/50 uppercase tracking-wider">
        {title}
      </h4>
      {children}
    </div>
  );
}

export const DetailCard = React.memo(DetailCardInner);
