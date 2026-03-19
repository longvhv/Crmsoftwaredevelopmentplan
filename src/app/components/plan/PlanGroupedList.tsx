import { ChevronDown, ChevronRight } from "lucide-react";
import type { PlanStep } from "../../types/plan";
import { StepRow } from "./StepRow";

interface PlanGroupedListProps {
  groupedSteps: Map<string, PlanStep[]>;
  expandedGroups: Set<string>;
  selectedStepId: string | null;
  onToggleGroup: (key: string) => void;
  onSelectStep: (step: PlanStep) => void;
}

function GroupMiniStats({ steps }: { steps: PlanStep[] }) {
  const done = steps.filter((s) => s.status === "done").length;
  const inProgress = steps.filter((s) => s.status === "in-progress").length;
  const aiCount = steps.filter(
    (s) => s.aiInvolvement === "AI-Driven" || s.aiInvolvement === "AI-Only",
  ).length;

  return (
    <div className="hidden md:flex items-center gap-2 text-xs">
      <span className="text-green-600">✓ {done}</span>
      <span className="text-blue-600">◷ {inProgress}</span>
      <span className="text-violet-600">AI {aiCount}</span>
    </div>
  );
}

function GroupProgress({ steps }: { steps: PlanStep[] }) {
  const done = steps.filter((s) => s.status === "done").length;
  const percentage = steps.length > 0 ? (done / steps.length) * 100 : 0;

  return (
    <div className="w-16 sm:w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
      <div className="h-full bg-green-500 rounded-full" style={{ width: `${percentage}%` }} />
    </div>
  );
}

export function PlanGroupedList({
  groupedSteps,
  expandedGroups,
  selectedStepId,
  onToggleGroup,
  onSelectStep,
}: PlanGroupedListProps) {
  return (
    <div className="space-y-3">
      {Array.from(groupedSteps.entries()).map(([groupName, steps]) => {
        const isExpanded = expandedGroups.has(groupName);

        return (
          <div key={groupName} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            {/* Tiêu đề nhóm */}
            <button
              type="button"
              onClick={() => onToggleGroup(groupName)}
              className="w-full px-3 sm:px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
                <h3 className="text-sm text-gray-900 truncate">{groupName}</h3>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full flex-shrink-0">
                  {steps.length}
                </span>
                <GroupMiniStats steps={steps} />
              </div>
              <GroupProgress steps={steps} />
            </button>

            {/* Danh sách bước */}
            {isExpanded && (
              <div className="border-t border-gray-50">
                {steps.map((step, index) => (
                  <StepRow
                    key={step.id}
                    step={step}
                    isLast={index === steps.length - 1}
                    isSelected={selectedStepId === step.id}
                    onSelect={() => onSelectStep(step)}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
