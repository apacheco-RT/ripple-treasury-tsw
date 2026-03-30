interface SevBadgeProps {
  level: "HIGH" | "MEDIUM" | "LOW";
}

export function SevBadge({ level }: SevBadgeProps) {
  const map = {
    HIGH:   "print-badge-high",
    MEDIUM: "print-badge-med",
    LOW:    "print-badge-low",
  };
  const icons = { HIGH: "▲", MEDIUM: "●", LOW: "ℹ" };
  return (
    <span className={`print-badge ${map[level]}`}>{icons[level]} {level}</span>
  );
}

interface EffortBadgeProps {
  level: "LOW EFFORT" | "MED EFFORT" | "HIGH EFFORT";
}

export function EffortBadge({ level }: EffortBadgeProps) {
  const map = {
    "LOW EFFORT":  "print-badge-low",
    "MED EFFORT":  "print-badge-med",
    "HIGH EFFORT": "print-badge-high",
  };
  return <span className={`print-badge ${map[level]}`}>{level}</span>;
}
