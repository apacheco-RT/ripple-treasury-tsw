import React from "react";
import { cn } from "@/lib/utils";

type IconButtonVariant = "view" | "confirm" | "complete" | "reextract" | "fail" | "default";
type IconButtonSize = "sm" | "md";

const VARIANT_CLASSES: Record<IconButtonVariant, string> = {
  view: "text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-feedback-info-text)] hover:bg-[var(--ds-color-feedback-info-bg)] focus:ring-[var(--ds-color-feedback-info-border)]",
  confirm: "text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-feedback-success-text)] hover:bg-[var(--ds-color-feedback-success-bg)] focus:ring-[var(--ds-color-feedback-success-border)]",
  complete: "text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-brand-primary)] hover:bg-[var(--ds-color-brand-primary-subtle)] focus:ring-[var(--ds-color-brand-primary)]",
  reextract: "text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-feedback-warning-text)] hover:bg-[var(--ds-color-feedback-warning-bg)] focus:ring-[var(--ds-color-feedback-warning-border)]",
  fail: "text-[var(--ds-color-text-secondary)] hover:text-[var(--ds-color-feedback-error-text)] hover:bg-[var(--ds-color-feedback-error-bg)] focus:ring-[var(--ds-color-feedback-error-border)]",
  default: "text-[var(--ds-color-text-secondary)] hover:text-white hover:bg-white/8 focus:ring-[var(--ds-color-brand-primary)]",
};

const SIZE_CLASSES: Record<IconButtonSize, { iconOnly: string; withText: string }> = {
  sm: {
    iconOnly: "p-1 min-w-[24px] min-h-[24px]",
    withText: "gap-1 px-2 py-1 min-h-[24px] text-xs",
  },
  md: {
    iconOnly: "p-1.5 min-w-7 min-h-7",
    withText: "gap-1.5 px-3 py-1.5 min-h-7",
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
          "flex items-center justify-center rounded-[var(--ds-radius-lg)] transition-colors focus:outline-hidden focus:ring-2 focus:ring-offset-1 focus:ring-offset-transparent disabled:opacity-30 disabled:cursor-not-allowed",
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
