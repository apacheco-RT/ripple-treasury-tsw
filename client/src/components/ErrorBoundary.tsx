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
        <div className="min-h-screen w-full flex items-center justify-center bg-surface-page">
          <div className="w-full max-w-md mx-4 bg-surface-card rounded-[var(--m3-shape-xl)] border border-slate-800 p-[var(--m3-dialog-padding)] text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-400 to-cyan-300" />
              <span className="text-lg font-semibold text-white tracking-tight">
                Ripple Treasury
              </span>
            </div>

            <AlertTriangle className="h-10 w-10 text-amber-400 mx-auto mb-4" />

            <h1 className="text-[var(--m3-headline-sm)] font-normal text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-[var(--m3-body-md)] text-slate-400 mb-6">
              An unexpected error occurred. Please reload the page to try again.
            </p>

            {this.state.error && (
              <pre className="text-xs text-slate-500 bg-slate-900/60 rounded-lg p-3 mb-6 overflow-auto max-h-24 text-left">
                {this.state.error.message}
              </pre>
            )}

            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-[var(--m3-button-padding-h)] h-[var(--m3-button-height)] rounded-[var(--m3-shape-full)] bg-teal-600 hover:bg-teal-500 text-white font-medium text-sm transition-all cursor-pointer"
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
