import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--ds-color-surface-page)]">
      <div className="w-full max-w-md mx-4 bg-[var(--ds-color-surface-default)] rounded-[var(--ds-radius-3xl)] border border-[var(--ds-color-border-default)] p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="h-8 w-8 rounded-full bg-linear-to-br from-[var(--ds-color-brand-primary)] to-[var(--ds-color-brand-primary-hover)]" />
          <span className="text-lg font-semibold text-[var(--ds-color-text-primary)] tracking-tight">
            Ripple Treasury
          </span>
        </div>

        <AlertCircle className="h-10 w-10 text-[var(--ds-color-feedback-error-text)] mx-auto mb-4" />

        <h1 className="text-2xl font-normal text-[var(--ds-color-text-primary)] mb-2">
          404 Page Not Found
        </h1>
        <p className="text-sm text-[var(--ds-color-text-secondary)] mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 h-10 rounded-full bg-[var(--ds-color-brand-primary)] hover:bg-[var(--ds-color-brand-primary-hover)] text-[var(--ds-color-text-on-brand)] font-medium text-sm transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
