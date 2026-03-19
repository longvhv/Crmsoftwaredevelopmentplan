import { Eye } from "lucide-react";
import type { PlanStep } from "../../types/plan";
import { StatusBadge, PriorityBadge, AILevelBadge } from "../badges";

interface StepRowProps {
  step: PlanStep;
  isLast: boolean;
  isSelected: boolean;
  onSelect: () => void;
}

export function StepRow({ step, isLast, isSelected, onSelect }: StepRowProps) {
  return (
    <button
      type="button"
      className={`w-full px-3 sm:px-5 py-3 flex items-center gap-2 sm:gap-3 text-left transition-colors ${
        isSelected ? "bg-violet-50" : "hover:bg-gray-50"
      } ${!isLast ? "border-b border-gray-50" : ""}`}
      onClick={onSelect}
    >
      {/* Mã bước */}
      <span className="text-xs text-gray-400 w-10 flex-shrink-0 text-center hidden sm:inline">
        {step.id}
      </span>

      {/* Trạng thái */}
      <StatusBadge status={step.status} />

      {/* Tên & Danh mục */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 truncate">{step.name}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-[10px] text-gray-400 truncate">{step.category}</span>
          <span className="text-[10px] text-gray-300 hidden sm:inline">•</span>
          <span className="text-[10px] text-gray-400 truncate hidden sm:inline">
            {step.subCategory}
          </span>
        </div>
      </div>

      {/* Mức ưu tiên */}
      <PriorityBadge priority={step.priority} className="hidden md:inline-flex" />

      {/* Mức AI */}
      <AILevelBadge level={step.aiInvolvement} className="hidden lg:inline-flex" />

      {/* Nhân sự */}
      <div className="hidden xl:flex items-center gap-1 max-w-[120px]">
        {step.responsible.slice(0, 2).map((person) => (
          <span key={person} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded truncate">
            {person}
          </span>
        ))}
        {step.responsible.length > 2 && (
          <span className="text-[10px] text-gray-400">+{step.responsible.length - 2}</span>
        )}
      </div>

      {/* Thời lượng */}
      <span className="hidden lg:inline text-xs text-gray-400 w-16 text-right">
        {step.duration}
      </span>

      {/* Icon xem chi tiết */}
      <Eye className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
    </button>
  );
}
