import { Badge } from "@/components/shared/Badge";

interface StatusChipProps {
  status: string;
  next: string;
  overdue: boolean;
  className?: string;
}

export function StatusChip({ status, next, overdue, className }: StatusChipProps) {
  return <Badge variant="status" status={status} next={next} overdue={overdue} className={className} />;
}
