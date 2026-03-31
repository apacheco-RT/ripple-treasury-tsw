import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--ds-color-surface-page)]">
      <div className="w-full max-w-md mx-4 bg-[var(--ds-color-surface-default)] rounded-[var(--ds-radius-3xl)] border border-[var(--ds-color-border-default)] p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="h-8 w-8 rounded-full bg-linear-to-br from-teal-400 to-cyan-300" />
          <span className="text-lg font-semibold text-white tracking-tight">
            Ripple Treasury
          </span>
        </div>

        <AlertCircle className="h-10 w-10 text-rose-400 mx-auto mb-4" />

        <h1 className="text-2xl font-normal text-white mb-2">
          404 Page Not Found
        </h1>
        <p className="text-sm text-[var(--ds-color-text-secondary)] mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 h-10 rounded-full bg-teal-600 hover:bg-teal-500 text-white font-medium text-sm transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
