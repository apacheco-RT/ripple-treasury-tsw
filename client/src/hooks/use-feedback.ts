import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { api } from "@shared/routes";
import { type InsertFeedback } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useCreateFeedback() {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertFeedback) => {
      const res = await apiRequest(
        api.feedback.create.method,
        api.feedback.create.path,
        data,
      );
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Feedback Received",
        description: "Thank you for your thoughts on the design strategy.",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}
