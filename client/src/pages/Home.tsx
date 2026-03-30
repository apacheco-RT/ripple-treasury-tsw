import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertFeedbackSchema, type InsertFeedback } from "@shared/schema";
import { useCreateFeedback } from "@/hooks/use-feedback";

import { UnifiedNav } from "@/components/UnifiedNav";
import { Navigation } from "@/components/Navigation";
import { HeroSection } from "@/components/home/HeroSection";
import { ResearchSection } from "@/components/home/ResearchSection";
import { StrategySection } from "@/components/home/StrategySection";
import { RoadmapSection } from "@/components/home/RoadmapSection";
import { FeedbackSection } from "@/components/home/FeedbackSection";

export default function Home() {
  const createFeedback = useCreateFeedback();
  
  const form = useForm<InsertFeedback>({
    resolver: zodResolver(insertFeedbackSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    }
  });

  const [feedbackSent, setFeedbackSent] = useState(false);

  const onSubmit = (data: InsertFeedback) => {
    createFeedback.mutate(data, {
      onSuccess: () => {
        form.reset();
        setFeedbackSent(true);
        setTimeout(() => setFeedbackSent(false), 5000);
      }
    });
  };

  return (
    <div className="min-h-screen bg-surface-page">
      <UnifiedNav />
      <div className="mt-11">
        <Navigation />
      </div>

      <main id="main-content">
        <HeroSection />
        <ResearchSection />
        <StrategySection />
        <RoadmapSection />
        <FeedbackSection
          form={form}
          onSubmit={onSubmit}
          isPending={createFeedback.isPending}
          feedbackSent={feedbackSent}
        />
      </main>

      <footer className="py-8 border-t border-slate-800 bg-surface-deep text-center">
        <p className="text-slate-400 text-sm">
          &copy; 2026 Ripple Treasury. Confidential &amp; Proprietary.
        </p>
      </footer>
    </div>
  );
}
