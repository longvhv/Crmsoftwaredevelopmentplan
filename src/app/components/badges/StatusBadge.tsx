import { CheckCircle2, Clock, AlertCircle, Ban } from "lucide-react";
import type { StepStatus } from "../../types/plan";
import { STATUS_CONFIG } from "../../constants/planConfig";

const STATUS_ICONS: Record<StepStatus, React.ReactNode> = {
  done: <CheckCircle2 className="w-3.5 h-3.5" />,
  "in-progress": <Clock className="w-3.5 h-3.5" />,
  pending: <AlertCircle className="w-3.5 h-3.5" />,
  blocked: <Ban className="w-3.5 h-3.5" />,
};

interface StatusBadgeProps {
  status: StepStatus;
  showLabel?: boolean;
  className?: string;
}

export function StatusBadge({ status, showLabel = false, className = "" }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs ${config.color} ${className}`}>
      {STATUS_ICONS[status]}
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}
