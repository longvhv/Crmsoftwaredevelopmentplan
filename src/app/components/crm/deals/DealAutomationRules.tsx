/**
 * Deal Stage Automation Rules - Quản lý automation rules cho deal stage changes
 */
import {
  Zap,
  Plus,
  Edit3,
  Trash2,
  Play,
  Pause,
  ChevronRight,
  Mail,
  CheckSquare,
  Bell,
  User,
  Calendar,
  Tag,
  ArrowRight,
  Bot,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { DealStage } from "../../../types/crm";
import { DEAL_STAGE_CONFIG } from "../../../constants/crmConfig";

export interface AutomationTrigger {
  type: "stage_changed" | "probability_threshold" | "value_threshold" | "time_in_stage";
  condition: {
    fromStage?: DealStage;
    toStage?: DealStage;
    threshold?: number;
    days?: number;
  };
}

export interface AutomationAction {
  type: "send_email" | "create_task" | "send_notification" | "update_field" | "assign_to";
  config: {
    emailTemplate?: string;
    taskTitle?: string;
    taskAssignee?: string;
    notificationMessage?: string;
    fieldName?: string;
    fieldValue?: string;
    assigneeId?: string;
  };
}

export interface AutomationRule {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: AutomationTrigger;
  actions: AutomationAction[];
  createdDate: string;
  lastTriggered?: string;
  triggerCount: number;
}

interface DealAutomationRulesProps {
  rules: AutomationRule[];
  onSave: (rule: AutomationRule) => void;
  onDelete: (ruleId: string) => void;
  onToggle: (ruleId: string, enabled: boolean) => void;
}

const ACTION_ICONS: Record<AutomationAction["type"], React.ReactNode> = {
  send_email: <Mail className="w-3.5 h-3.5" />,
  create_task: <CheckSquare className="w-3.5 h-3.5" />,
  send_notification: <Bell className="w-3.5 h-3.5" />,
  update_field: <Edit3 className="w-3.5 h-3.5" />,
  assign_to: <User className="w-3.5 h-3.5" />,
};

const ACTION_LABELS: Record<AutomationAction["type"], string> = {
  send_email: "Gửi email",
  create_task: "Tạo task",
  send_notification: "Gửi thông báo",
  update_field: "Cập nhật field",
  assign_to: "Gán cho người",
};

function getTriggerLabel(trigger: AutomationTrigger): string {
  switch (trigger.type) {
    case "stage_changed":
      const fromStage = trigger.condition.fromStage 
        ? DEAL_STAGE_CONFIG[trigger.condition.fromStage].label 
        : "Bất kỳ";
      const toStage = trigger.condition.toStage 
        ? DEAL_STAGE_CONFIG[trigger.condition.toStage].label 
        : "Bất kỳ";
      return `Stage chuyển từ ${fromStage} → ${toStage}`;
    case "probability_threshold":
      return `AI Win Probability ${trigger.condition.threshold}%+`;
    case "value_threshold":
      return `Giá trị ≥ ${trigger.condition.threshold?.toLocaleString()}đ`;
    case "time_in_stage":
      return `Ở stage quá ${trigger.condition.days} ngày`;
    default:
      return "Unknown trigger";
  }
}

function getActionLabel(action: AutomationAction): string {
  const baseLabel = ACTION_LABELS[action.type];
  
  switch (action.type) {
    case "send_email":
      return `${baseLabel}: ${action.config.emailTemplate || "Default"}`;
    case "create_task":
      return `${baseLabel}: ${action.config.taskTitle || "Untitled"}`;
    case "send_notification":
      return `${baseLabel}: ${action.config.notificationMessage?.slice(0, 30) || "..."}`;
    case "update_field":
      return `${baseLabel}: ${action.config.fieldName} = ${action.config.fieldValue}`;
    case "assign_to":
      return `${baseLabel}: ${action.config.assigneeId || "Unassigned"}`;
    default:
      return baseLabel;
  }
}

export function DealAutomationRules({ rules, onSave, onDelete, onToggle }: DealAutomationRulesProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingRule, setEditingRule] = useState<AutomationRule | null>(null);

  const handleToggle = (ruleId: string, enabled: boolean) => {
    onToggle(ruleId, enabled);
    toast.success(enabled ? "Đã bật automation rule" : "Đã tắt automation rule");
  };

  const handleDelete = (ruleId: string) => {
    if (confirm("Bạn có chắc muốn xóa automation rule này?")) {
      onDelete(ruleId);
      toast.success("Đã xóa automation rule");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-violet-600" />
          <h3 className="text-lg font-semibold text-gray-900">Automation Rules</h3>
          <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">
            {rules.length} rules
          </span>
        </div>
        <button
          type="button"
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tạo Rule
        </button>
      </div>

      {/* Rules List */}
      {rules.length === 0 ? (
        <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-8 text-center">
          <Bot className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500 mb-4">
            Chưa có automation rule nào. Tạo rule để tự động hóa workflow!
          </p>
          <button
            type="button"
            onClick={() => setIsCreating(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tạo Rule Đầu Tiên
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className={`bg-white border rounded-lg p-4 transition-all ${
                rule.enabled 
                  ? "border-violet-200 bg-violet-50/30" 
                  : "border-gray-200"
              }`}
            >
              {/* Rule Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-gray-900">{rule.name}</h4>
                    {rule.enabled ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Pause className="w-3 h-3" />
                        Paused
                      </span>
                    )}
                  </div>
                  {rule.description && (
                    <p className="text-xs text-gray-500">{rule.description}</p>
                  )}
                </div>
                
                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => handleToggle(rule.id, !rule.enabled)}
                    className={`p-1.5 rounded transition-colors ${
                      rule.enabled
                        ? "text-green-600 hover:bg-green-50"
                        : "text-gray-400 hover:bg-gray-50"
                    }`}
                    title={rule.enabled ? "Tắt rule" : "Bật rule"}
                  >
                    {rule.enabled ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingRule(rule)}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(rule.id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Trigger */}
              <div className="flex items-start gap-2 mb-3 pb-3 border-b border-gray-100">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Khi:</p>
                  <p className="text-sm text-gray-900">{getTriggerLabel(rule.trigger)}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-start gap-2">
                <Zap className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-2">Thì:</p>
                  <div className="space-y-1.5">
                    {rule.actions.map((action, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                        <div className="flex items-center gap-1.5 px-2 py-1 bg-white border border-gray-200 rounded text-xs">
                          {ACTION_ICONS[action.type]}
                          <span>{getActionLabel(action)}</span>
                        </div>
                        {idx < rule.actions.length - 1 && (
                          <ChevronRight className="w-3 h-3 text-gray-300" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
                <span>Đã chạy: {rule.triggerCount} lần</span>
                {rule.lastTriggered && <span>Lần cuối: {rule.lastTriggered}</span>}
                <span>Tạo: {rule.createdDate}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(isCreating || editingRule) && (
        <AutomationRuleModal
          rule={editingRule}
          onClose={() => {
            setIsCreating(false);
            setEditingRule(null);
          }}
          onSave={(rule) => {
            onSave(rule);
            setIsCreating(false);
            setEditingRule(null);
            toast.success(editingRule ? "Đã cập nhật rule" : "Đã tạo rule mới");
          }}
        />
      )}
    </div>
  );
}

/* ============================================================
 * Automation Rule Modal (Simplified for now)
 * ============================================================ */
interface AutomationRuleModalProps {
  rule: AutomationRule | null;
  onClose: () => void;
  onSave: (rule: AutomationRule) => void;
}

function AutomationRuleModal({ rule, onClose, onSave }: AutomationRuleModalProps) {
  const [name, setName] = useState(rule?.name || "");
  const [description, setDescription] = useState(rule?.description || "");
  const [triggerType, setTriggerType] = useState<AutomationTrigger["type"]>(
    rule?.trigger.type || "stage_changed"
  );
  const [toStage, setToStage] = useState<DealStage | "">(
    rule?.trigger.condition.toStage || ""
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Vui lòng nhập tên rule");
      return;
    }

    const newRule: AutomationRule = {
      id: rule?.id || `rule-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      enabled: rule?.enabled ?? true,
      trigger: {
        type: triggerType,
        condition: {
          toStage: toStage || undefined,
        },
      },
      actions: rule?.actions || [
        {
          type: "send_notification",
          config: {
            notificationMessage: `Deal chuyển sang ${toStage ? DEAL_STAGE_CONFIG[toStage as DealStage].label : "stage mới"}`,
          },
        },
      ],
      createdDate: rule?.createdDate || new Date().toISOString().split("T")[0],
      triggerCount: rule?.triggerCount || 0,
    };

    onSave(newRule);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">
            {rule ? "Chỉnh sửa Automation Rule" : "Tạo Automation Rule Mới"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Basic Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên Rule *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="VD: Gửi email khi chuyển sang Negotiation"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả rule này làm gì..."
              rows={2}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Trigger */}
          <div className="border-t border-gray-100 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trigger: Khi nào chạy?
            </label>
            <div className="space-y-3">
              <select
                value={triggerType}
                onChange={(e) => setTriggerType(e.target.value as AutomationTrigger["type"])}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="stage_changed">Khi deal chuyển stage</option>
                <option value="probability_threshold">Khi AI Win Probability vượt ngưỡng</option>
                <option value="value_threshold">Khi giá trị deal vượt ngưỡng</option>
                <option value="time_in_stage">Khi deal ở stage quá lâu</option>
              </select>

              {triggerType === "stage_changed" && (
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Chuyển đến stage:</label>
                  <select
                    value={toStage}
                    onChange={(e) => setToStage(e.target.value as DealStage)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  >
                    <option value="">Bất kỳ stage nào</option>
                    {Object.entries(DEAL_STAGE_CONFIG).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-100 pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Actions: Làm gì?
            </label>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
              <p className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Gửi thông báo (mặc định)
              </p>
              <p className="text-xs text-amber-600 mt-1">
                Advanced action builder sẽ được thêm ở phiên bản sau
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors"
            >
              {rule ? "Cập nhật" : "Tạo Rule"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
