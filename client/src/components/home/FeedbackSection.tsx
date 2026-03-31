import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { InsertFeedback } from "@shared/schema";
import { 
  Form, FormControl, FormField, FormItem, 
  FormLabel, FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface FeedbackSectionProps {
  form: UseFormReturn<InsertFeedback>;
  onSubmit: (data: InsertFeedback) => void;
  isPending: boolean;
  feedbackSent: boolean;
}

export function FeedbackSection({ form, onSubmit, isPending, feedbackSent }: FeedbackSectionProps) {
  return (
    <section id="feedback" className="py-20">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="bg-linear-to-br from-[var(--ds-color-surface-default)] to-[var(--ds-color-surface-page)] rounded-[var(--ds-radius-2xl)] p-6 md:p-8 border border-[var(--ds-color-border-default)]/50 shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-medium text-white mb-4">Share Your Feedback</h2>
            <p className="text-[var(--ds-color-text-secondary)]">Help shape the future of Treasury Management. Your input goes directly to the product team.</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[var(--ds-color-text-secondary)]">Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" className="bg-[var(--ds-color-surface-sunken)] border-[var(--ds-color-border-default)] text-white placeholder:text-[var(--ds-color-text-tertiary)] focus:border-blue-500 transition-colors" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[var(--ds-color-text-secondary)]">Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@company.com" className="bg-[var(--ds-color-surface-sunken)] border-[var(--ds-color-border-default)] text-white placeholder:text-[var(--ds-color-text-tertiary)] focus:border-blue-500 transition-colors" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[var(--ds-color-text-secondary)]">Feedback</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="I think the roadmap should include..." 
                        className="min-h-[120px] bg-[var(--ds-color-surface-sunken)] border-[var(--ds-color-border-default)] text-white placeholder:text-[var(--ds-color-text-tertiary)] focus:border-blue-500 transition-colors resize-none" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-6 rounded-full shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                disabled={isPending}
              >
                {isPending ? "Submitting..." : (
                  <span className="flex items-center gap-2">
                    Submit Feedback <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>

              <AnimatePresence>
                {feedbackSent && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    role="status"
                    className="flex items-center gap-2 px-4 py-3 rounded-[var(--ds-radius-lg)] bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-sm font-medium"
                  >
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    Thank you! Your feedback has been submitted successfully.
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </Form>
        </div>
      </div>
    </section>
  );
}
