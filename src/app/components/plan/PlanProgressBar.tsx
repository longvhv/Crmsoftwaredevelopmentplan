import { STATUS_CONFIG } from "../../constants/planConfig";
import type { PlanStats } from "../../types/plan";

interface PlanProgressBarProps {
  stats: PlanStats;
}

export function PlanProgressBar({ stats }: PlanProgressBarProps) {
  const { total, done, inProgress } = stats;
  const percentage = total > 0 ? Math.round((done / total) * 100) : 0;
  const doneWidth = total > 0 ? (done / total) * 100 : 0;
  const progressWidth = total > 0 ? (inProgress / total) * 100 : 0;
  const pendingCount = total - done - inProgress;

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-700">Tiến độ tổng thể</span>
        <span className="text-sm text-gray-900">{percentage}%</span>
      </div>

      <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
        <div
          className="bg-green-500 rounded-l-full transition-all"
          style={{ width: `${doneWidth}%` }}
        />
        <div
          className="bg-blue-500 transition-all"
          style={{ width: `${progressWidth}%` }}
        />
      </div>

      <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
        <span className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG.done.dotColor}`} />
          {STATUS_CONFIG.done.label} ({done})
        </span>
        <span className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG["in-progress"].dotColor}`} />
          {STATUS_CONFIG["in-progress"].label} ({inProgress})
        </span>
        <span className="flex items-center gap-1">
          <span className={`w-2 h-2 rounded-full ${STATUS_CONFIG.pending.dotColor}`} />
          {STATUS_CONFIG.pending.label} ({pendingCount})
        </span>
      </div>
    </div>
  );
}
