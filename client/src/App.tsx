import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/atoms/ErrorBoundary";
import Landing from "@/pages/Landing";
import ResearchReport from "@/pages/ResearchReport";
import AnnotatedSpecs from "@/pages/AnnotatedSpecs";
import Prototype from "@/pages/Prototype";
import ExportReport from "@/pages/ExportReport";
import NotFound from "@/pages/not-found";

declare global {
  interface Window {
    __STANDALONE_PROTOTYPE__?: boolean;
  }
}

function Router() {
  if (window.__STANDALONE_PROTOTYPE__) {
    return <Prototype />;
  }

  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/research" component={ResearchReport} />
      <Route path="/specs" component={AnnotatedSpecs} />
      <Route path="/prototype" component={Prototype} />
      <Route path="/export" component={ExportReport} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <TooltipProvider>
          <Toaster />
          <ErrorBoundary>
            <Router />
          </ErrorBoundary>
        </TooltipProvider>
      </MotionConfig>
    </QueryClientProvider>
  );
}

export default App;
