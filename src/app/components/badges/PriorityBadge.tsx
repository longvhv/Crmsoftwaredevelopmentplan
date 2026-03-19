import type { StepPriority } from "../../types/plan";
import { PRIORITY_CONFIG } from "../../constants/planConfig";

interface PriorityBadgeProps {
  priority: StepPriority;
  className?: string;
}

export function PriorityBadge({ priority, className = "" }: PriorityBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] ${PRIORITY_CONFIG[priority]} ${className}`}>
      {priority}
    </span>
  );
}
