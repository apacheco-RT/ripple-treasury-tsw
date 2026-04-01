import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("[ErrorBoundary] Uncaught error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[var(--ds-color-surface-page)]">
          <div className="w-full max-w-md mx-4 bg-[var(--ds-color-surface-default)] rounded-[var(--ds-radius-3xl)] border border-[var(--ds-color-border-default)] p-6 text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-full bg-linear-to-br from-[var(--ds-color-brand-primary)] to-[var(--ds-color-brand-primary-hover)]" />
              <span className="text-lg font-semibold text-white tracking-tight">
                Ripple Treasury
              </span>
            </div>

            <AlertTriangle className="h-10 w-10 text-[var(--ds-color-feedback-warning-text)] mx-auto mb-4" />

            <h1 className="text-2xl font-normal text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-[var(--ds-color-text-secondary)] mb-6">
              An unexpected error occurred. Please reload the page to try again.
            </p>

            {this.state.error && (
              <pre className="text-xs text-[var(--ds-color-text-tertiary)] bg-[var(--ds-color-surface-page)]/60 rounded-lg p-3 mb-6 overflow-auto max-h-24 text-left">
                {this.state.error.message}
              </pre>
            )}

            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-6 h-10 rounded-full bg-[var(--ds-color-brand-primary)] hover:bg-[var(--ds-color-brand-primary-hover)] text-[var(--ds-color-text-on-brand)] font-medium text-sm transition-all cursor-pointer"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
