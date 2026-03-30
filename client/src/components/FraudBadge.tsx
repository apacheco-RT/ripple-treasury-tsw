import { Badge } from "@/components/shared/Badge";

interface FraudBadgeProps {
  risk: number;
  reason: string | null;
  className?: string;
}

export function FraudBadge({ risk, reason, className }: FraudBadgeProps) {
  return <Badge variant="fraud" risk={risk} reason={reason} className={className} />;
}
