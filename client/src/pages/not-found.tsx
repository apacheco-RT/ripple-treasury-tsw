import { AlertCircle } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-surface-page">
      <div className="w-full max-w-md mx-4 bg-surface-card rounded-(--m3-shape-xl) border border-slate-800 p-(--m3-dialog-padding) text-center">
        <div className="flex items-center justify-center gap-2 mb-6">
          <div className="h-8 w-8 rounded-full bg-linear-to-br from-teal-400 to-cyan-300" />
          <span className="text-lg font-semibold text-white tracking-tight">
            Ripple Treasury
          </span>
        </div>

        <AlertCircle className="h-10 w-10 text-rose-400 mx-auto mb-4" />

        <h1 className="text-(--m3-headline-sm) font-normal text-white mb-2">
          404 Page Not Found
        </h1>
        <p className="text-(--m3-body-md) text-slate-400 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-(--m3-button-padding-h) h-(--m3-button-height) rounded-(--m3-shape-full) bg-teal-600 hover:bg-teal-500 text-white font-medium text-sm transition-all"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
