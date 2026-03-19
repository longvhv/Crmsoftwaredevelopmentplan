import type { PlanStats } from "../../types/plan";

interface PlanStatsBarProps {
  stats: PlanStats;
}

const STAT_ITEMS = [
  { key: "total" as const, label: "Tổng bước", bgClass: "bg-white border-gray-100", textClass: "text-gray-900", subClass: "text-gray-500" },
  { key: "done" as const, label: "Hoàn thành", bgClass: "bg-green-50 border-green-100", textClass: "text-green-700", subClass: "text-green-600" },
  { key: "inProgress" as const, label: "Đang thực hiện", bgClass: "bg-blue-50 border-blue-100", textClass: "text-blue-700", subClass: "text-blue-600" },
  { key: "aiDriven" as const, label: "AI-Driven / AI-Only", bgClass: "bg-violet-50 border-violet-100", textClass: "text-violet-700", subClass: "text-violet-600" },
  { key: "critical" as const, label: "Ưu tiên cao nhất", bgClass: "bg-red-50 border-red-100", textClass: "text-red-700", subClass: "text-red-600" },
];

export function PlanStatsBar({ stats }: PlanStatsBarProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {STAT_ITEMS.map((item) => (
        <div key={item.key} className={`${item.bgClass} rounded-xl border p-3 text-center`}>
          <p className={`text-2xl ${item.textClass}`}>{stats[item.key]}</p>
          <p className={`text-xs ${item.subClass}`}>{item.label}</p>
        </div>
      ))}
    </div>
  );
}
