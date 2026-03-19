import { X, Users, ArrowRight, Target, CheckCircle2, Bot } from "lucide-react";
import type { PlanStep } from "../../types/plan";
import { PHASE_NAMES, PHASE_BG_COLORS } from "../../constants/planConfig";
import { StatusBadge, PriorityBadge, AILevelBadge } from "../badges";

interface StepDetailModalProps {
  step: PlanStep;
  /** Tất cả steps — dùng để resolve tên dependency */
  allSteps: PlanStep[];
  onClose: () => void;
}

/* ============================================================
 * Thông tin tổng quan (grid 4 cột)
 * ============================================================ */
function MetaGrid({ step }: { step: PlanStep }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <div>
        <p className="text-xs text-gray-500 mb-1">Danh mục</p>
        <p className="text-sm text-gray-900">{step.category}</p>
        <p className="text-xs text-gray-400">{step.subCategory}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-1">Thời lượng</p>
        <p className="text-sm text-gray-900">{step.duration}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-1">Mức độ AI</p>
        <AILevelBadge level={step.aiInvolvement} />
      </div>
      <div>
        <p className="text-xs text-gray-500 mb-1">Phase</p>
        <p className="text-sm text-gray-900">Phase {step.phase}</p>
      </div>
    </div>
  );
}

/* ============================================================
 * Danh sách dependencies
 * ============================================================ */
function DependencyList({ dependencies, allSteps }: { dependencies: string[]; allSteps: PlanStep[] }) {
  if (dependencies.length === 0) return null;

  return (
    <div>
      <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
        <ArrowRight className="w-3.5 h-3.5" /> Phụ thuộc
      </p>
      <div className="flex flex-wrap gap-2">
        {dependencies.map((depId) => {
          const depStep = allSteps.find((s) => s.id === depId);
          return (
            <span
              key={depId}
              className="px-2.5 py-1 bg-gray-50 text-gray-600 rounded-lg text-xs border border-gray-200"
            >
              {depId} — {depStep?.name ?? "Không xác định"}
            </span>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
 * Danh sách sản phẩm bàn giao (deliverables)
 * ============================================================ */
function DeliverableList({ deliverables }: { deliverables: string[] }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
        <Target className="w-3.5 h-3.5" /> Sản phẩm bàn giao
      </p>
      <div className="space-y-1.5">
        {deliverables.map((item) => (
          <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
 * Modal chính
 * ============================================================ */
export function StepDetailModal({ step, allSteps, onClose }: StepDetailModalProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={step.name}
    >
      <div
        className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[90vh] sm:max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-4 sm:p-6 border-b border-gray-100 ${PHASE_BG_COLORS[step.phase]}`}>
          <div className="flex items-start justify-between mb-3">
            <span className="text-xs text-gray-500">{PHASE_NAMES[step.phase]}</span>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-sm text-violet-600 bg-violet-100 px-2 py-0.5 rounded">
              {step.id}
            </span>
            <StatusBadge status={step.status} showLabel />
            <PriorityBadge priority={step.priority} />
          </div>

          <h2 className="text-lg text-gray-900">{step.name}</h2>
          <p className="text-sm text-gray-600 mt-1">{step.description}</p>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-6 space-y-5">
          <MetaGrid step={step} />

          {/* Nhân sự phụ trách */}
          <div>
            <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Nhân sự phụ trách
            </p>
            <div className="flex flex-wrap gap-2">
              {step.responsible.map((person) => (
                <span
                  key={person}
                  className="px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm"
                >
                  {person}
                </span>
              ))}
            </div>
          </div>

          <DependencyList dependencies={step.dependencies} allSteps={allSteps} />
          <DeliverableList deliverables={step.deliverables} />

          {/* Công cụ AI */}
          {step.aiTools.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <Bot className="w-3.5 h-3.5" /> Công cụ AI sử dụng
              </p>
              <div className="flex flex-wrap gap-2">
                {step.aiTools.map((tool) => (
                  <span
                    key={tool}
                    className="px-2.5 py-1 bg-violet-50 text-violet-700 rounded-lg text-sm"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Ghi chú */}
          {step.notes && (
            <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
              <p className="text-xs text-amber-800">{step.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
