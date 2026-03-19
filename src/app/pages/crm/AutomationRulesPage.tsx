/**
 * Trang Quy tắc Tự động hóa — Automation Rules
 * Kiểu "Khi X thì Y" với trigger → condition → action.
 * Phase 1: Visual rule builder, AI-suggested rules.
 */
import { useState, useMemo, useCallback } from "react";
import {
  Zap,
  Plus,
  Play,
  Pause,
  Trash2,
  Copy,
  Bot,
  Mail,
  Users,
  Target,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Bell,
  UserPlus,
  X,
  ChevronDown,
  ChevronUp,
  Activity,
  BarChart3,
  Settings,
  Filter,
  Search,
  Sparkles,
  Edit3,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";

/* ============================================================
 * Types
 * ============================================================ */
type TriggerType =
  | "lead-score-change"
  | "deal-stage-change"
  | "contact-created"
  | "no-activity"
  | "email-opened"
  | "form-submitted"
  | "deal-won"
  | "deal-lost";

type ActionType =
  | "send-email"
  | "assign-to"
  | "create-task"
  | "update-field"
  | "send-notification"
  | "add-tag"
  | "move-pipeline"
  | "ai-analyze";

type RuleStatus = "active" | "paused" | "draft";

interface AutomationRule {
  id: string;
  name: string;
  description: string;
  trigger: { type: TriggerType; config: Record<string, string | number> };
  conditions: { field: string; operator: string; value: string }[];
  actions: { type: ActionType; config: Record<string, string> }[];
  status: RuleStatus;
  createdBy: string;
  isAISuggested: boolean;
  executionCount: number;
  lastExecuted?: string;
  createdDate: string;
  category: string;
}

/* ============================================================
 * Constants
 * ============================================================ */
const TRIGGER_CONFIG: Record<TriggerType, { label: string; icon: React.ReactNode; color: string }> = {
  "lead-score-change": { label: "Điểm lead thay đổi", icon: <TrendingUp className="w-4 h-4" />, color: "bg-blue-100 text-blue-700" },
  "deal-stage-change": { label: "Giai đoạn deal thay đổi", icon: <Target className="w-4 h-4" />, color: "bg-violet-100 text-violet-700" },
  "contact-created": { label: "Liên hệ mới tạo", icon: <UserPlus className="w-4 h-4" />, color: "bg-green-100 text-green-700" },
  "no-activity": { label: "Không có hoạt động", icon: <Clock className="w-4 h-4" />, color: "bg-amber-100 text-amber-700" },
  "email-opened": { label: "Email được mở", icon: <Mail className="w-4 h-4" />, color: "bg-sky-100 text-sky-700" },
  "form-submitted": { label: "Form được gửi", icon: <CheckCircle2 className="w-4 h-4" />, color: "bg-pink-100 text-pink-700" },
  "deal-won": { label: "Deal thắng", icon: <Sparkles className="w-4 h-4" />, color: "bg-emerald-100 text-emerald-700" },
  "deal-lost": { label: "Deal thua", icon: <AlertCircle className="w-4 h-4" />, color: "bg-red-100 text-red-700" },
};

const ACTION_CONFIG: Record<ActionType, { label: string; icon: React.ReactNode; color: string }> = {
  "send-email": { label: "Gửi email", icon: <Mail className="w-3.5 h-3.5" />, color: "bg-blue-50 text-blue-600 border-blue-200" },
  "assign-to": { label: "Gán cho nhân viên", icon: <Users className="w-3.5 h-3.5" />, color: "bg-violet-50 text-violet-600 border-violet-200" },
  "create-task": { label: "Tạo công việc", icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "bg-green-50 text-green-600 border-green-200" },
  "update-field": { label: "Cập nhật trường", icon: <Edit3 className="w-3.5 h-3.5" />, color: "bg-amber-50 text-amber-600 border-amber-200" },
  "send-notification": { label: "Gửi thông báo", icon: <Bell className="w-3.5 h-3.5" />, color: "bg-pink-50 text-pink-600 border-pink-200" },
  "add-tag": { label: "Thêm tag", icon: <Filter className="w-3.5 h-3.5" />, color: "bg-slate-50 text-slate-600 border-slate-200" },
  "move-pipeline": { label: "Chuyển pipeline", icon: <ArrowRight className="w-3.5 h-3.5" />, color: "bg-cyan-50 text-cyan-600 border-cyan-200" },
  "ai-analyze": { label: "AI phân tích", icon: <Bot className="w-3.5 h-3.5" />, color: "bg-violet-50 text-violet-600 border-violet-200" },
};

const STATUS_CONFIG: Record<RuleStatus, { label: string; color: string; bgColor: string }> = {
  active: { label: "Hoạt động", color: "text-green-700", bgColor: "bg-green-100" },
  paused: { label: "Tạm dừng", color: "text-amber-700", bgColor: "bg-amber-100" },
  draft: { label: "Bản nháp", color: "text-gray-500", bgColor: "bg-gray-100" },
};

const CATEGORIES = ["Lead Management", "Deal Pipeline", "Engagement", "Thông báo", "AI Automation"];

/* ============================================================
 * Mock Data — 8 quy tắc mẫu
 * ============================================================ */
const INITIAL_RULES: AutomationRule[] = [
  {
    id: "ar1",
    name: "Lead nóng → Gán Sales Manager",
    description: "Khi AI Lead Score ≥ 80, tự động gán cho Sales Manager và gửi thông báo.",
    trigger: { type: "lead-score-change", config: { threshold: 80, direction: "above" } },
    conditions: [{ field: "aiLeadScore", operator: ">=", value: "80" }],
    actions: [
      { type: "assign-to", config: { assignee: "Nguyễn Văn An", role: "Sales Manager" } },
      { type: "send-notification", config: { message: "Lead mới có score cao cần xử lý gấp" } },
      { type: "create-task", config: { title: "Liên hệ lead trong 24h", priority: "high" } },
    ],
    status: "active",
    createdBy: "Nguyễn Văn An",
    isAISuggested: false,
    executionCount: 47,
    lastExecuted: "2026-03-03T08:15:00",
    createdDate: "2025-12-15",
    category: "Lead Management",
  },
  {
    id: "ar2",
    name: "AI Auto-Nurture Lead lạnh",
    description: "Lead score < 40 sau 7 ngày không hoạt động → AI gửi email nurturing tự động.",
    trigger: { type: "no-activity", config: { days: 7 } },
    conditions: [
      { field: "aiLeadScore", operator: "<", value: "40" },
      { field: "status", operator: "=", value: "new" },
    ],
    actions: [
      { type: "send-email", config: { template: "Nurturing Series #1", from: "AI Sales Agent" } },
      { type: "add-tag", config: { tag: "auto-nurture" } },
      { type: "ai-analyze", config: { action: "Phân tích sentiment và đề xuất nội dung phù hợp" } },
    ],
    status: "active",
    createdBy: "AI Sales Agent",
    isAISuggested: true,
    executionCount: 156,
    lastExecuted: "2026-03-03T06:00:00",
    createdDate: "2026-01-05",
    category: "AI Automation",
  },
  {
    id: "ar3",
    name: "Deal vào Negotiation → Thông báo quản lý",
    description: "Khi deal chuyển sang giai đoạn Đàm phán, gửi thông báo cho Sales Manager.",
    trigger: { type: "deal-stage-change", config: { toStage: "negotiation" } },
    conditions: [{ field: "value", operator: ">=", value: "50000" }],
    actions: [
      { type: "send-notification", config: { to: "Sales Manager", message: "Deal lớn vào giai đoạn đàm phán" } },
      { type: "create-task", config: { title: "Review deal trước đàm phán", priority: "high" } },
    ],
    status: "active",
    createdBy: "Nguyễn Văn An",
    isAISuggested: false,
    executionCount: 23,
    lastExecuted: "2026-03-01T14:30:00",
    createdDate: "2026-01-10",
    category: "Deal Pipeline",
  },
  {
    id: "ar4",
    name: "Welcome email cho liên hệ mới",
    description: "Tự động gửi email chào mừng khi tạo liên hệ mới từ website hoặc form.",
    trigger: { type: "contact-created", config: { source: "website,form" } },
    conditions: [],
    actions: [
      { type: "send-email", config: { template: "Welcome Email", from: "AI Sales Agent" } },
      { type: "ai-analyze", config: { action: "Phân tích ICP fit và gợi ý follow-up" } },
    ],
    status: "active",
    createdBy: "AI Content Agent",
    isAISuggested: true,
    executionCount: 89,
    lastExecuted: "2026-03-02T22:10:00",
    createdDate: "2025-11-20",
    category: "Engagement",
  },
  {
    id: "ar5",
    name: "Deal thắng → Chuyển onboarding",
    description: "Khi deal closed-won, tự động tạo dự án onboarding và thông báo team delivery.",
    trigger: { type: "deal-won", config: {} },
    conditions: [],
    actions: [
      { type: "create-task", config: { title: "Kickoff meeting với khách hàng", priority: "high" } },
      { type: "send-notification", config: { to: "Delivery Team", message: "Deal mới cần onboard" } },
      { type: "update-field", config: { field: "contact.type", value: "customer" } },
      { type: "add-tag", config: { tag: "onboarding" } },
    ],
    status: "active",
    createdBy: "Nguyễn Văn An",
    isAISuggested: false,
    executionCount: 8,
    lastExecuted: "2026-02-28T10:00:00",
    createdDate: "2026-02-01",
    category: "Deal Pipeline",
  },
  {
    id: "ar6",
    name: "AI Follow-up sau email mở",
    description: "Khi khách mở email proposal 2 lần → AI tự động gọi để follow up.",
    trigger: { type: "email-opened", config: { count: 2, template: "Proposal" } },
    conditions: [{ field: "deal.stage", operator: "=", value: "proposal" }],
    actions: [
      { type: "create-task", config: { title: "Gọi follow-up ngay", priority: "high" } },
      { type: "send-notification", config: { message: "Khách đã mở email proposal 2 lần - cơ hội tốt!" } },
    ],
    status: "paused",
    createdBy: "AI Sales Agent",
    isAISuggested: true,
    executionCount: 12,
    lastExecuted: "2026-02-25T15:00:00",
    createdDate: "2026-02-10",
    category: "Engagement",
  },
  {
    id: "ar7",
    name: "Deal thua → Phân tích nguyên nhân",
    description: "Khi deal closed-lost, AI phân tích nguyên nhân và tạo báo cáo tự động.",
    trigger: { type: "deal-lost", config: {} },
    conditions: [],
    actions: [
      { type: "ai-analyze", config: { action: "Phân tích win/loss và đề xuất cải thiện" } },
      { type: "add-tag", config: { tag: "lost-analysis-pending" } },
      { type: "send-email", config: { template: "Thank You & Stay Connected", from: "AI Sales Agent" } },
    ],
    status: "active",
    createdBy: "AI Sales Agent",
    isAISuggested: true,
    executionCount: 5,
    lastExecuted: "2026-02-20T09:00:00",
    createdDate: "2026-02-05",
    category: "AI Automation",
  },
  {
    id: "ar8",
    name: "Lead từ sự kiện → Gán BDR team",
    description: "Lead mới từ kênh sự kiện tự động gán cho BDR team và thêm tag sự kiện.",
    trigger: { type: "contact-created", config: { source: "event" } },
    conditions: [{ field: "source", operator: "=", value: "Sự kiện" }],
    actions: [
      { type: "assign-to", config: { assignee: "Lê Minh Cường", role: "BDR Lead" } },
      { type: "add-tag", config: { tag: "event-lead" } },
    ],
    status: "draft",
    createdBy: "Lê Minh Cường",
    isAISuggested: false,
    executionCount: 0,
    createdDate: "2026-03-01",
    category: "Lead Management",
  },
];

/* ============================================================
 * Rule Card Component
 * ============================================================ */
function RuleCard({
  rule,
  onToggle,
  onDuplicate,
  onDelete,
  onExpand,
  isExpanded,
}: {
  rule: AutomationRule;
  onToggle: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onExpand: () => void;
  isExpanded: boolean;
}) {
  const triggerCfg = TRIGGER_CONFIG[rule.trigger.type];
  const statusCfg = STATUS_CONFIG[rule.status];

  return (
    <div className={`bg-white rounded-xl border transition-all ${
      rule.status === "active" ? "border-green-200 hover:border-green-300" :
      rule.status === "paused" ? "border-amber-200 hover:border-amber-300" :
      "border-gray-100 hover:border-gray-200"
    }`}>
      {/* Header */}
      <button type="button" onClick={onExpand} className="w-full text-left p-4">
        <div className="flex items-start gap-3">
          {/* Trigger icon */}
          <span className={`p-2 rounded-lg flex-shrink-0 ${triggerCfg.color}`}>
            {triggerCfg.icon}
          </span>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
              <h4 className="text-sm text-gray-900 truncate">{rule.name}</h4>
              {rule.isAISuggested && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-violet-100 text-violet-700 flex items-center gap-0.5 flex-shrink-0">
                  <Bot className="w-3 h-3" /> AI
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 line-clamp-1">{rule.description}</p>

            {/* Quick info */}
            <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-400 flex-wrap">
              <span className={`px-1.5 py-0.5 rounded ${statusCfg.bgColor} ${statusCfg.color}`}>
                {statusCfg.label}
              </span>
              <span className="flex items-center gap-0.5">
                <Activity className="w-3 h-3" /> {rule.executionCount} lần chạy
              </span>
              <span className="flex items-center gap-0.5">
                <ArrowRight className="w-3 h-3" /> {rule.actions.length} hành động
              </span>
              {rule.lastExecuted && (
                <span className="flex items-center gap-0.5">
                  <Clock className="w-3 h-3" />
                  {new Date(rule.lastExecuted).toLocaleDateString("vi-VN")}
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={onToggle}
              className={`p-1.5 rounded-lg transition-colors ${
                rule.status === "active"
                  ? "text-green-600 hover:bg-green-50"
                  : "text-gray-400 hover:bg-gray-50"
              }`}
              title={rule.status === "active" ? "Tạm dừng" : "Kích hoạt"}
            >
              {rule.status === "active" ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              type="button"
              onClick={onDuplicate}
              className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg transition-colors"
              title="Nhân bản"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="p-1.5 text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
              title="Xoá"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-300" /> : <ChevronDown className="w-4 h-4 text-gray-300" />}
          </div>
        </div>
      </button>

      {/* Expanded detail */}
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-50 pt-3">
          {/* Visual flow: Trigger → Conditions → Actions */}
          <div className="space-y-3">
            {/* Trigger */}
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">Khi (Trigger)</p>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm ${triggerCfg.color}`}>
                {triggerCfg.icon}
                {triggerCfg.label}
                {Object.entries(rule.trigger.config).length > 0 && (
                  <span className="text-[10px] opacity-70">
                    ({Object.entries(rule.trigger.config).map(([k, v]) => `${k}: ${v}`).join(", ")})
                  </span>
                )}
              </div>
            </div>

            {/* Conditions */}
            {rule.conditions.length > 0 && (
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">Nếu (Điều kiện)</p>
                <div className="space-y-1">
                  {rule.conditions.map((cond, i) => (
                    <div key={i} className="inline-flex items-center gap-1 px-2 py-1 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700 mr-2">
                      <Filter className="w-3 h-3" />
                      {cond.field} {cond.operator} {cond.value}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">Thì (Hành động)</p>
              <div className="space-y-1.5">
                {rule.actions.map((action, i) => {
                  const cfg = ACTION_CONFIG[action.type];
                  return (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[10px] text-gray-300 mt-1 w-4 text-right">{i + 1}.</span>
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-xs ${cfg.color}`}>
                        {cfg.icon}
                        {cfg.label}
                        {Object.values(action.config).length > 0 && (
                          <span className="opacity-70">
                            — {Object.values(action.config).join(", ")}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Metadata */}
            <div className="flex items-center gap-4 pt-2 text-[11px] text-gray-400 border-t border-gray-50">
              <span>Tạo bởi: {rule.createdBy}</span>
              <span>Ngày tạo: {rule.createdDate}</span>
              <span>Phân loại: {rule.category}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * Create Rule Modal
 * ============================================================ */
function CreateRuleModal({ onClose, onSave }: {
  onClose: () => void;
  onSave: (rule: AutomationRule) => void;
}) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [triggerType, setTriggerType] = useState<TriggerType>("lead-score-change");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [selectedActions, setSelectedActions] = useState<ActionType[]>(["send-notification"]);

  const toggleAction = (action: ActionType) => {
    setSelectedActions((prev) =>
      prev.includes(action) ? prev.filter((a) => a !== action) : [...prev, action],
    );
  };

  const handleSave = () => {
    if (!name.trim()) { toast.error("Vui lòng nhập tên quy tắc"); return; }
    onSave({
      id: `ar-new-${Date.now()}`,
      name: name.trim(),
      description: description.trim() || `Quy tắc tự động: ${TRIGGER_CONFIG[triggerType].label}`,
      trigger: { type: triggerType, config: {} },
      conditions: [],
      actions: selectedActions.map((a) => ({ type: a, config: {} })),
      status: "draft",
      createdBy: "Nguyễn Văn An",
      isAISuggested: false,
      executionCount: 0,
      createdDate: "2026-03-03",
      category,
    });
    toast.success("Đã tạo quy tắc mới (bản nháp)");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900 flex items-center gap-2">
            <Plus className="w-5 h-5 text-violet-600" /> Tạo quy tắc mới
          </h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tên quy tắc *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="VD: Lead nóng → Gán Sales"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mô tả</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              placeholder="Mô tả ngắn gọn..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none h-16 focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Khi (Trigger)</label>
              <select value={triggerType} onChange={(e) => setTriggerType(e.target.value as TriggerType)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                {Object.entries(TRIGGER_CONFIG).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Phân loại</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Thì (Hành động) — chọn 1 hoặc nhiều</label>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(ACTION_CONFIG).map(([key, cfg]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => toggleAction(key as ActionType)}
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg border text-xs transition-all ${
                    selectedActions.includes(key as ActionType)
                      ? `${cfg.color} border-current`
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {cfg.icon} {cfg.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
            Huỷ
          </button>
          <button type="button" onClick={handleSave}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors">
            Tạo quy tắc
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function AutomationRulesPage() {
  const [rules, setRules] = useState<AutomationRule[]>(INITIAL_RULES);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<RuleStatus | "">("");
  const [filterCategory, setFilterCategory] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let result = [...rules];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q),
      );
    }
    if (filterStatus) result = result.filter((r) => r.status === filterStatus);
    if (filterCategory) result = result.filter((r) => r.category === filterCategory);
    return result;
  }, [rules, search, filterStatus, filterCategory]);

  const stats = useMemo(() => ({
    total: rules.length,
    active: rules.filter((r) => r.status === "active").length,
    aiSuggested: rules.filter((r) => r.isAISuggested).length,
    totalExecutions: rules.reduce((s, r) => s + r.executionCount, 0),
  }), [rules]);

  const handleToggle = useCallback((id: string) => {
    setRules((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: r.status === "active" ? "paused" : "active" }
          : r,
      ),
    );
    const rule = rules.find((r) => r.id === id);
    if (rule) {
      toast.success(
        rule.status === "active"
          ? `Đã tạm dừng "${rule.name}"`
          : `Đã kích hoạt "${rule.name}"`,
      );
    }
  }, [rules]);

  const handleDuplicate = useCallback((id: string) => {
    const rule = rules.find((r) => r.id === id);
    if (rule) {
      const newRule: AutomationRule = {
        ...rule,
        id: `ar-dup-${Date.now()}`,
        name: `${rule.name} (bản sao)`,
        status: "draft",
        executionCount: 0,
        lastExecuted: undefined,
        createdDate: "2026-03-03",
      };
      setRules((prev) => [newRule, ...prev]);
      toast.success(`Đã nhân bản "${rule.name}"`);
    }
  }, [rules]);

  const handleDelete = useCallback((id: string) => {
    const rule = rules.find((r) => r.id === id);
    setRules((prev) => prev.filter((r) => r.id !== id));
    if (rule) toast.success(`Đã xoá "${rule.name}"`);
    setDeleteTargetId(null);
  }, [rules]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Zap className="w-6 h-6 text-violet-600" /> Quy tắc Tự động hóa
          </h1>
          <p className="text-gray-500 mt-0.5">
            Thiết lập quy tắc "Khi X thì Y" — AI đề xuất & thực thi tự động
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Tạo quy tắc
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Tổng quy tắc</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-3 text-center">
          <p className="text-lg text-green-700">{stats.active}</p>
          <p className="text-xs text-green-600">Đang hoạt động</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-100 p-3 text-center">
          <p className="text-lg text-violet-700 flex items-center justify-center gap-1">
            <Bot className="w-4 h-4" /> {stats.aiSuggested}
          </p>
          <p className="text-xs text-violet-600">AI đề xuất</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-3 text-center">
          <p className="text-lg text-blue-700">{stats.totalExecutions}</p>
          <p className="text-xs text-blue-600">Tổng lượt thực thi</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm quy tắc..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as RuleStatus | "")}
            className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
            <option value="">Tất cả trạng thái</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}
            className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm">
            <option value="">Tất cả phân loại</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Results */}
      <p className="text-sm text-gray-500">
        Hiển thị <span className="text-gray-900">{filtered.length}</span> / {rules.length} quy tắc
      </p>

      {/* Rules list */}
      <div className="space-y-3">
        {filtered.map((rule) => (
          <RuleCard
            key={rule.id}
            rule={rule}
            isExpanded={expandedId === rule.id}
            onExpand={() => setExpandedId(expandedId === rule.id ? null : rule.id)}
            onToggle={() => handleToggle(rule.id)}
            onDuplicate={() => handleDuplicate(rule.id)}
            onDelete={() => setDeleteTargetId(rule.id)}
          />
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Settings className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Không tìm thấy quy tắc phù hợp</p>
          </div>
        )}
      </div>

      {/* AI Insight */}
      <div className="bg-gradient-to-r from-violet-50 to-blue-50 rounded-xl border border-violet-100 p-5">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Automation Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <BarChart3 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            Các quy tắc tự động đã xử lý {stats.totalExecutions} tác vụ, tiết kiệm ~{Math.round(stats.totalExecutions * 3.5)} phút công việc thủ công.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            AI đề xuất thêm: "Khi contact không phản hồi 14 ngày → Gửi email win-back tự động."
          </p>
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            Quy tắc "{rules[0]?.name}" hiệu quả nhất với {rules[0]?.executionCount} lần thực thi.
          </p>
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <CreateRuleModal
          onClose={() => setShowCreate(false)}
          onSave={(rule) => setRules((prev) => [rule, ...prev])}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmDeleteDialog
        open={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={() => { if (deleteTargetId) handleDelete(deleteTargetId); }}
        itemName={rules.find((r) => r.id === deleteTargetId)?.name ?? ""}
        entityType="quy tắc"
        description="Quy tắc đã xoá không thể khôi phục."
      />
    </div>
  );
}