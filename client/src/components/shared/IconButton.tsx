import React from "react";
import { cn } from "@/lib/utils";

type IconButtonVariant = "view" | "confirm" | "complete" | "reextract" | "fail" | "default";
type IconButtonSize = "sm" | "md";

const VARIANT_CLASSES: Record<IconButtonVariant, string> = {
  view: "text-slate-400 hover:text-blue-300 hover:bg-blue-500/10 focus:ring-blue-400",
  confirm: "text-slate-400 hover:text-emerald-300 hover:bg-emerald-500/10 focus:ring-emerald-400",
  complete: "text-slate-400 hover:text-teal-300 hover:bg-teal-500/10 focus:ring-teal-400",
  reextract: "text-slate-400 hover:text-amber-300 hover:bg-amber-500/10 focus:ring-amber-400",
  fail: "text-slate-400 hover:text-rose-300 hover:bg-rose-500/10 focus:ring-rose-400",
  default: "text-slate-400 hover:text-white hover:bg-(--m3-state-hover) focus:ring-teal-400",
};

const SIZE_CLASSES: Record<IconButtonSize, { iconOnly: string; withText: string }> = {
  sm: {
    iconOnly: "p-1 min-w-[24px] min-h-[24px]",
    withText: "gap-1 px-2 py-1 min-h-[24px] text-xs",
  },
  md: {
    iconOnly: "p-1.5 min-w-(--m3-icon-button-sm) min-h-(--m3-icon-button-sm)",
    withText: "gap-1.5 px-3 py-1.5 min-h-(--m3-icon-button-sm)",
  },
};

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const IconButtonInner = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButtonInner({ variant = "default", size = "md", icon, children, className, ...rest }, ref) {
    const sizeClass = children ? SIZE_CLASSES[size].withText : SIZE_CLASSES[size].iconOnly;
    return (
      <button
        ref={ref}
        {...rest}
        className={cn(
          "flex items-center justify-center rounded-(--m3-shape-sm) transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-1 focus:ring-offset-transparent disabled:opacity-30 disabled:cursor-not-allowed",
          sizeClass,
          VARIANT_CLASSES[variant],
          className,
        )}
      >
        {icon}
        {children}
      </button>
    );
  }
);

export const IconButton = React.memo(IconButtonInner);
