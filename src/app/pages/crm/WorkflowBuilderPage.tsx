/**
 * Trang Workflow Builder — Trình tạo workflow tự động visual node-based.
 * Canvas với draggable nodes, SVG connections, node palette,
 * node config modal, pre-built templates, AI suggestions.
 * Phase 1: Mock data + interactive canvas + full CRUD UI.
 */
import { useState, useCallback, useRef, useMemo, useEffect } from "react";
import {
  Workflow,
  Search,
  X,
  Bot,
  Sparkles,
  Play,
  Pause,
  Trash2,
  Plus,
  Copy,
  Settings,
  Zap,
  GitBranch,
  Clock,
  Bell,
  Mail,
  CheckCircle2,
  AlertTriangle,
  Users,
  TrendingUp,
  Target,
  Shield,
  Brain,
  ArrowRight,
  GripVertical,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  ZoomIn,
  ZoomOut,
  MousePointer2,
  Save,
  RotateCcw,
  Eye,
  ToggleLeft,
  ToggleRight,
  Pencil,
  LayoutTemplate,
  CircleStop,
  Timer,
  Filter,
  MessageSquare,
  Database,
  Send,
  UserCheck,
  DollarSign,
  FileText,
  PhoneCall,
  CalendarCheck,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
type NodeType =
  | "trigger"
  | "condition"
  | "action"
  | "delay"
  | "ai-agent"
  | "notification"
  | "end";

type WorkflowStatus = "active" | "draft" | "paused" | "error";

interface WorkflowNode {
  id: string;
  type: NodeType;
  label: string;
  description: string;
  x: number;
  y: number;
  config: Record<string, string>;
  icon: string;
}

interface Connection {
  id: string;
  from: string;
  to: string;
  label?: string;
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  status: WorkflowStatus;
  nodes: WorkflowNode[];
  connections: Connection[];
  runs: number;
  successRate: number;
  lastRun: string;
  createdBy: string;
  aiSuggested: boolean;
}

/* ============================================================
 * Constants
 * ============================================================ */
const NODE_CONFIG: Record<
  NodeType,
  { label: string; color: string; borderColor: string; bgColor: string; textColor: string }
> = {
  trigger: {
    label: "Trigger",
    color: "#22c55e",
    borderColor: "border-green-300",
    bgColor: "bg-green-50",
    textColor: "text-green-700",
  },
  condition: {
    label: "Điều kiện",
    color: "#f59e0b",
    borderColor: "border-amber-300",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
  },
  action: {
    label: "Hành động",
    color: "#3b82f6",
    borderColor: "border-blue-300",
    bgColor: "bg-blue-50",
    textColor: "text-blue-700",
  },
  delay: {
    label: "Chờ",
    color: "#8b5cf6",
    borderColor: "border-violet-300",
    bgColor: "bg-violet-50",
    textColor: "text-violet-700",
  },
  "ai-agent": {
    label: "AI Agent",
    color: "#ec4899",
    borderColor: "border-pink-300",
    bgColor: "bg-pink-50",
    textColor: "text-pink-700",
  },
  notification: {
    label: "Thông báo",
    color: "#06b6d4",
    borderColor: "border-cyan-300",
    bgColor: "bg-cyan-50",
    textColor: "text-cyan-700",
  },
  end: {
    label: "Kết thúc",
    color: "#6b7280",
    borderColor: "border-gray-300",
    bgColor: "bg-gray-100",
    textColor: "text-gray-700",
  },
};

const NODE_PALETTE: { type: NodeType; icon: string; label: string; desc: string }[] = [
  { type: "trigger", icon: "⚡", label: "Trigger", desc: "Sự kiện khởi động" },
  { type: "condition", icon: "🔀", label: "Điều kiện", desc: "Rẽ nhánh logic" },
  { type: "action", icon: "⚙️", label: "Hành động", desc: "Thực thi tác vụ" },
  { type: "delay", icon: "⏱️", label: "Chờ / Delay", desc: "Tạm dừng thời gian" },
  { type: "ai-agent", icon: "🤖", label: "AI Agent", desc: "AI xử lý tự động" },
  { type: "notification", icon: "🔔", label: "Thông báo", desc: "Gửi notification" },
  { type: "end", icon: "🏁", label: "Kết thúc", desc: "Dừng workflow" },
];

const STATUS_CONFIG: Record<WorkflowStatus, { label: string; color: string }> = {
  active: { label: "Đang chạy", color: "text-green-600 bg-green-50" },
  draft: { label: "Bản nháp", color: "text-gray-500 bg-gray-100" },
  paused: { label: "Tạm dừng", color: "text-amber-600 bg-amber-50" },
  error: { label: "Lỗi", color: "text-red-600 bg-red-50" },
};

/* ============================================================
 * Mock Workflows — 6 templates
 * ============================================================ */
const WORKFLOWS: WorkflowTemplate[] = [
  {
    id: "wf1",
    name: "Lead Qualification tự động",
    description: "Tự động scoring, phân loại, và route leads dựa trên hành vi và AI analysis",
    category: "Sales",
    icon: "🎯",
    status: "active",
    runs: 1247,
    successRate: 94,
    lastRun: "2026-03-03T09:15:00",
    createdBy: "Hoàng Thị Mai",
    aiSuggested: true,
    nodes: [
      { id: "n1", type: "trigger", label: "Lead mới được tạo", description: "Khi có lead mới từ web form, API, hoặc import", x: 80, y: 60, config: { source: "Web Form, API, Import" }, icon: "⚡" },
      { id: "n2", type: "ai-agent", label: "AI Lead Scoring", description: "AI phân tích và chấm điểm lead 0-100", x: 80, y: 170, config: { model: "GPT-4o", criteria: "Budget, Authority, Need, Timeline" }, icon: "🤖" },
      { id: "n3", type: "condition", label: "Score ≥ 70?", description: "Kiểm tra lead score có đủ tiêu chuẩn", x: 80, y: 280, config: { field: "lead_score", operator: ">=", value: "70" }, icon: "🔀" },
      { id: "n4", type: "action", label: "Assign cho Sales", description: "Tự động phân cho Sales rep phù hợp", x: 280, y: 280, config: { action: "auto_assign", rule: "Round Robin by Territory" }, icon: "⚙️" },
      { id: "n5", type: "notification", label: "Email thông báo Sales", description: "Gửi email + push notification cho Sales rep", x: 280, y: 390, config: { channel: "Email + Push", template: "new_hot_lead" }, icon: "🔔" },
      { id: "n6", type: "action", label: "Vào Nurture campaign", description: "Thêm vào chiến dịch nurturing cho lead chưa đủ tiêu chuẩn", x: 80, y: 390, config: { action: "add_to_campaign", campaign: "Lead Nurture 30-day" }, icon: "⚙️" },
      { id: "n7", type: "delay", label: "Chờ 7 ngày", description: "Chờ 7 ngày trước khi re-evaluate", x: 80, y: 500, config: { duration: "7", unit: "ngày" }, icon: "⏱️" },
      { id: "n8", type: "end", label: "Kết thúc", description: "Workflow hoàn tất", x: 280, y: 500, config: {}, icon: "🏁" },
    ],
    connections: [
      { id: "c1", from: "n1", to: "n2" },
      { id: "c2", from: "n2", to: "n3" },
      { id: "c3", from: "n3", to: "n4", label: "Có" },
      { id: "c4", from: "n3", to: "n6", label: "Không" },
      { id: "c5", from: "n4", to: "n5" },
      { id: "c6", from: "n6", to: "n7" },
      { id: "c7", from: "n7", to: "n3" },
      { id: "c8", from: "n5", to: "n8" },
    ],
  },
  {
    id: "wf2",
    name: "Deal Follow-up Sequence",
    description: "Chuỗi follow-up tự động sau mỗi giai đoạn pipeline — email, call, reminder",
    category: "Sales",
    icon: "📧",
    status: "active",
    runs: 856,
    successRate: 87,
    lastRun: "2026-03-03T08:00:00",
    createdBy: "Nguyễn Văn An",
    aiSuggested: false,
    nodes: [
      { id: "n1", type: "trigger", label: "Deal chuyển stage", description: "Khi deal di chuyển sang stage mới trong pipeline", x: 80, y: 60, config: { event: "deal_stage_changed" }, icon: "⚡" },
      { id: "n2", type: "condition", label: "Stage = Proposal?", description: "Kiểm tra deal đang ở stage nào", x: 80, y: 170, config: { field: "stage", operator: "==", value: "Proposal" }, icon: "🔀" },
      { id: "n3", type: "action", label: "Gửi Proposal email", description: "Tự động gửi email kèm proposal PDF", x: 280, y: 170, config: { action: "send_email", template: "proposal_sent" }, icon: "⚙️" },
      { id: "n4", type: "delay", label: "Chờ 3 ngày", description: "Chờ 3 ngày cho khách review", x: 280, y: 280, config: { duration: "3", unit: "ngày" }, icon: "⏱️" },
      { id: "n5", type: "ai-agent", label: "AI phân tích phản hồi", description: "AI đọc email reply và phân tích sentiment", x: 280, y: 390, config: { model: "GPT-4o", task: "email_sentiment_analysis" }, icon: "🤖" },
      { id: "n6", type: "notification", label: "Alert Sales rep", description: "Thông báo kết quả phân tích cho Sales", x: 280, y: 500, config: { channel: "Slack + Push" }, icon: "🔔" },
      { id: "n7", type: "end", label: "Kết thúc", description: "Workflow hoàn tất", x: 80, y: 280, config: {}, icon: "🏁" },
    ],
    connections: [
      { id: "c1", from: "n1", to: "n2" },
      { id: "c2", from: "n2", to: "n3", label: "Có" },
      { id: "c3", from: "n2", to: "n7", label: "Không" },
      { id: "c4", from: "n3", to: "n4" },
      { id: "c5", from: "n4", to: "n5" },
      { id: "c6", from: "n5", to: "n6" },
    ],
  },
  {
    id: "wf3",
    name: "Customer Onboarding",
    description: "Quy trình onboarding khách hàng mới tự động 30 ngày với checkpoints",
    category: "Customer Success",
    icon: "🚀",
    status: "active",
    runs: 342,
    successRate: 96,
    lastRun: "2026-03-02T14:00:00",
    createdBy: "Đỗ Hải Yến",
    aiSuggested: false,
    nodes: [
      { id: "n1", type: "trigger", label: "Deal Closed-Won", description: "Khi deal chuyển sang Closed-Won", x: 80, y: 60, config: { event: "deal_closed_won" }, icon: "⚡" },
      { id: "n2", type: "action", label: "Tạo Onboarding Project", description: "Tự động tạo project trong task board", x: 80, y: 170, config: { action: "create_project", template: "onboarding_30day" }, icon: "⚙️" },
      { id: "n3", type: "notification", label: "Welcome Email", description: "Gửi email chào mừng + tài liệu onboarding", x: 80, y: 280, config: { template: "welcome_email", attachments: "onboarding_guide.pdf" }, icon: "🔔" },
      { id: "n4", type: "delay", label: "Chờ 3 ngày", description: "Chờ khách đọc tài liệu", x: 80, y: 390, config: { duration: "3", unit: "ngày" }, icon: "⏱️" },
      { id: "n5", type: "action", label: "Schedule Kickoff Call", description: "Tự động lên lịch cuộc gọi kickoff", x: 80, y: 500, config: { action: "schedule_meeting", type: "kickoff" }, icon: "⚙️" },
      { id: "n6", type: "end", label: "Kết thúc", description: "", x: 80, y: 610, config: {}, icon: "🏁" },
    ],
    connections: [
      { id: "c1", from: "n1", to: "n2" },
      { id: "c2", from: "n2", to: "n3" },
      { id: "c3", from: "n3", to: "n4" },
      { id: "c4", from: "n4", to: "n5" },
      { id: "c5", from: "n5", to: "n6" },
    ],
  },
  {
    id: "wf4",
    name: "Churn Prevention Alert",
    description: "AI detect dấu hiệu churn và tự động trigger intervention sequence",
    category: "Customer Success",
    icon: "🛡️",
    status: "active",
    runs: 189,
    successRate: 72,
    lastRun: "2026-03-03T07:30:00",
    createdBy: "AI System",
    aiSuggested: true,
    nodes: [
      { id: "n1", type: "trigger", label: "AI detect churn signal", description: "AI phát hiện dấu hiệu churn từ usage data", x: 80, y: 60, config: { source: "AI Churn Model v3.2" }, icon: "⚡" },
      { id: "n2", type: "condition", label: "Churn risk ≥ 60%?", description: "Kiểm tra mức độ churn risk", x: 80, y: 170, config: { field: "churn_risk", operator: ">=", value: "60" }, icon: "🔀" },
      { id: "n3", type: "notification", label: "Alert CSM ngay", description: "Gửi alert khẩn cấp cho CS Manager", x: 280, y: 170, config: { channel: "Slack + SMS", priority: "urgent" }, icon: "🔔" },
      { id: "n4", type: "ai-agent", label: "AI tạo retention plan", description: "AI tạo kế hoạch giữ chân khách dựa trên context", x: 280, y: 280, config: { model: "GPT-4o", prompt: "Create personalized retention plan" }, icon: "🤖" },
      { id: "n5", type: "action", label: "Tạo task urgency", description: "Tạo task follow-up với priority cao", x: 280, y: 390, config: { action: "create_task", priority: "urgent" }, icon: "⚙️" },
      { id: "n6", type: "action", label: "Log vào health score", description: "Cập nhật customer health score", x: 80, y: 280, config: { action: "update_health_score", delta: "-10" }, icon: "⚙️" },
      { id: "n7", type: "end", label: "Kết thúc", description: "", x: 180, y: 500, config: {}, icon: "🏁" },
    ],
    connections: [
      { id: "c1", from: "n1", to: "n2" },
      { id: "c2", from: "n2", to: "n3", label: "Có" },
      { id: "c3", from: "n2", to: "n6", label: "Không" },
      { id: "c4", from: "n3", to: "n4" },
      { id: "c5", from: "n4", to: "n5" },
      { id: "c6", from: "n5", to: "n7" },
    ],
  },
  {
    id: "wf5",
    name: "Commission Auto-Calculate",
    description: "Tự động tính hoa hồng khi deal closed, apply tiers, notify finance",
    category: "Finance",
    icon: "💰",
    status: "paused",
    runs: 523,
    successRate: 99,
    lastRun: "2026-02-28T23:59:00",
    createdBy: "Phạm Thanh Tùng",
    aiSuggested: false,
    nodes: [
      { id: "n1", type: "trigger", label: "Deal Closed-Won", description: "Khi deal đóng thành công", x: 80, y: 60, config: { event: "deal_closed_won" }, icon: "⚡" },
      { id: "n2", type: "action", label: "Tính hoa hồng", description: "Apply commission rules theo tier", x: 80, y: 170, config: { action: "calculate_commission", rules: "tier_based" }, icon: "⚙️" },
      { id: "n3", type: "notification", label: "Notify Sales + Finance", description: "Thông báo cho Sales rep và bộ phận tài chính", x: 80, y: 280, config: { channel: "Email", recipients: "sales_rep, finance_team" }, icon: "🔔" },
      { id: "n4", type: "end", label: "Kết thúc", description: "", x: 80, y: 390, config: {}, icon: "🏁" },
    ],
    connections: [
      { id: "c1", from: "n1", to: "n2" },
      { id: "c2", from: "n2", to: "n3" },
      { id: "c3", from: "n3", to: "n4" },
    ],
  },
  {
    id: "wf6",
    name: "Meeting Follow-up AI",
    description: "AI tự động tạo summary, action items, và gửi follow-up email sau meeting",
    category: "Productivity",
    icon: "🧠",
    status: "draft",
    runs: 0,
    successRate: 0,
    lastRun: "—",
    createdBy: "AI System",
    aiSuggested: true,
    nodes: [
      { id: "n1", type: "trigger", label: "Meeting kết thúc", description: "Khi cuộc họp trên Calendar kết thúc", x: 80, y: 60, config: { event: "meeting_ended" }, icon: "⚡" },
      { id: "n2", type: "ai-agent", label: "AI tạo Summary", description: "AI phân tích transcript và tạo summary", x: 80, y: 170, config: { model: "GPT-4o", task: "meeting_summary" }, icon: "🤖" },
      { id: "n3", type: "ai-agent", label: "AI extract Action Items", description: "AI trích xuất action items từ transcript", x: 80, y: 280, config: { model: "GPT-4o", task: "extract_actions" }, icon: "🤖" },
      { id: "n4", type: "action", label: "Tạo Tasks", description: "Tự động tạo tasks cho mỗi action item", x: 80, y: 390, config: { action: "create_tasks", source: "ai_extracted" }, icon: "⚙️" },
      { id: "n5", type: "notification", label: "Gửi Follow-up Email", description: "Gửi email summary cho tất cả participants", x: 80, y: 500, config: { template: "meeting_followup", recipients: "all_participants" }, icon: "🔔" },
      { id: "n6", type: "end", label: "Kết thúc", description: "", x: 80, y: 610, config: {}, icon: "🏁" },
    ],
    connections: [
      { id: "c1", from: "n1", to: "n2" },
      { id: "c2", from: "n2", to: "n3" },
      { id: "c3", from: "n3", to: "n4" },
      { id: "c4", from: "n4", to: "n5" },
      { id: "c5", from: "n5", to: "n6" },
    ],
  },
];

/* ============================================================
 * SVG Connection Line
 * ============================================================ */
function ConnectionLine({
  fromNode,
  toNode,
  label,
  nodeWidth,
  nodeHeight,
}: {
  fromNode: WorkflowNode;
  toNode: WorkflowNode;
  label?: string;
  nodeWidth: number;
  nodeHeight: number;
}) {
  const fx = fromNode.x + nodeWidth / 2;
  const fy = fromNode.y + nodeHeight;
  const tx = toNode.x + nodeWidth / 2;
  const ty = toNode.y;

  const midY = (fy + ty) / 2;
  const d = `M ${fx} ${fy} C ${fx} ${midY}, ${tx} ${midY}, ${tx} ${ty}`;

  return (
    <g>
      <path d={d} fill="none" stroke="#c4b5fd" strokeWidth={2} strokeDasharray="6 3" />
      {/* Arrow */}
      <polygon
        points={`${tx - 5},${ty - 8} ${tx + 5},${ty - 8} ${tx},${ty}`}
        fill="#8b5cf6"
      />
      {label && (
        <text
          x={(fx + tx) / 2}
          y={midY - 6}
          textAnchor="middle"
          className="fill-violet-500"
          style={{ fontSize: 10 }}
        >
          {label}
        </text>
      )}
    </g>
  );
}

/* ============================================================
 * Canvas Node
 * ============================================================ */
function CanvasNode({
  node,
  isSelected,
  onSelect,
  onDragStart,
}: {
  node: WorkflowNode;
  isSelected: boolean;
  onSelect: () => void;
  onDragStart: (e: React.MouseEvent) => void;
}) {
  const cfg = NODE_CONFIG[node.type];
  return (
    <div
      className={`absolute w-[180px] rounded-xl border-2 shadow-sm cursor-grab active:cursor-grabbing select-none transition-shadow ${cfg.borderColor} ${cfg.bgColor} ${
        isSelected ? "ring-2 ring-violet-400 shadow-md" : "hover:shadow-md"
      }`}
      style={{ left: node.x, top: node.y }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onMouseDown={(e) => {
        e.stopPropagation();
        onDragStart(e);
      }}
    >
      {/* Header */}
      <div className={`px-3 py-1.5 border-b ${cfg.borderColor} flex items-center gap-2`}>
        <span className="text-sm">{node.icon}</span>
        <span className={`text-[9px] px-1.5 py-0.5 rounded ${cfg.textColor} font-medium`}>
          {cfg.label}
        </span>
      </div>
      {/* Body */}
      <div className="px-3 py-2">
        <p className="text-xs text-gray-800 leading-tight">{node.label}</p>
        {node.description && (
          <p className="text-[9px] text-gray-400 mt-0.5 line-clamp-2">{node.description}</p>
        )}
      </div>
      {/* Ports */}
      <div
        className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white"
        style={{ backgroundColor: cfg.color }}
      />
      {node.type !== "end" && (
        <div
          className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full border-2 border-white"
          style={{ backgroundColor: cfg.color }}
        />
      )}
    </div>
  );
}

/* ============================================================
 * Node Config Modal
 * ============================================================ */
function NodeConfigModal({
  node,
  onClose,
  onUpdate,
}: {
  node: WorkflowNode;
  onClose: () => void;
  onUpdate: (updated: WorkflowNode) => void;
}) {
  const cfg = NODE_CONFIG[node.type];
  const [label, setLabel] = useState(node.label);
  const [description, setDescription] = useState(node.description);
  const [config, setConfig] = useState({ ...node.config });

  const handleSave = () => {
    onUpdate({ ...node, label, description, config });
    toast.success(`Đã cập nhật node "${label}"`);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-lg">{node.icon}</span>
            <div>
              <h3 className="text-sm text-gray-900">Cấu hình Node</h3>
              <span className={`text-[9px] px-1.5 py-0.5 rounded ${cfg.bgColor} ${cfg.textColor}`}>
                {cfg.label}
              </span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tên node</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mô tả</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            />
          </div>
          {Object.entries(config).map(([key, value]) => (
            <div key={key}>
              <label className="text-xs text-gray-500 mb-1 block capitalize">{key.replace(/_/g, " ")}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => setConfig((prev) => ({ ...prev, [key]: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose}
            className="px-4 py-2 text-gray-500 text-sm hover:bg-gray-50 rounded-lg">Huỷ</button>
          <button type="button" onClick={handleSave}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">Lưu</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Canvas Builder View
 * ============================================================ */
const NODE_WIDTH = 180;
const NODE_HEIGHT = 72;

function WorkflowCanvas({
  workflow,
  onBack,
}: {
  workflow: WorkflowTemplate;
  onBack: () => void;
}) {
  const [nodes, setNodes] = useState<WorkflowNode[]>([...workflow.nodes]);
  const [connections, setConnections] = useState<Connection[]>([...workflow.connections]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [configNode, setConfigNode] = useState<WorkflowNode | null>(null);
  const [zoom, setZoom] = useState(1);
  const [paletteOpen, setPaletteOpen] = useState(true);
  const canvasRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);

  // Calculate canvas bounds
  const canvasBounds = useMemo(() => {
    if (nodes.length === 0) return { width: 800, height: 600 };
    const maxX = Math.max(...nodes.map((n) => n.x + NODE_WIDTH + 80));
    const maxY = Math.max(...nodes.map((n) => n.y + NODE_HEIGHT + 80));
    return { width: Math.max(maxX, 800), height: Math.max(maxY, 700) };
  }, [nodes]);

  const nodeMap = useMemo(() => {
    const map = new Map<string, WorkflowNode>();
    nodes.forEach((n) => map.set(n.id, n));
    return map;
  }, [nodes]);

  // Drag handlers
  const handleDragStart = useCallback(
    (nodeId: string, e: React.MouseEvent) => {
      const node = nodes.find((n) => n.id === nodeId);
      if (!node || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      dragRef.current = {
        id: nodeId,
        offsetX: (e.clientX - rect.left) / zoom - node.x,
        offsetY: (e.clientY - rect.top) / zoom - node.y,
      };
      setSelectedNode(nodeId);
    },
    [nodes, zoom]
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current || !canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = Math.max(0, (e.clientX - rect.left) / zoom - dragRef.current.offsetX);
      const newY = Math.max(0, (e.clientY - rect.top) / zoom - dragRef.current.offsetY);
      setNodes((prev) =>
        prev.map((n) => (n.id === dragRef.current!.id ? { ...n, x: newX, y: newY } : n))
      );
    };
    const handleMouseUp = () => {
      dragRef.current = null;
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [zoom]);

  const addNode = (type: NodeType) => {
    const palette = NODE_PALETTE.find((p) => p.type === type)!;
    const newNode: WorkflowNode = {
      id: `n${Date.now()}`,
      type,
      label: palette.label,
      description: palette.desc,
      x: 120 + Math.random() * 100,
      y: 100 + nodes.length * 60,
      config: {},
      icon: palette.icon,
    };
    setNodes((prev) => [...prev, newNode]);
    setSelectedNode(newNode.id);
    toast.success(`Đã thêm node "${palette.label}"`);
  };

  const deleteSelected = () => {
    if (!selectedNode) return;
    setNodes((prev) => prev.filter((n) => n.id !== selectedNode));
    setConnections((prev) =>
      prev.filter((c) => c.from !== selectedNode && c.to !== selectedNode)
    );
    setSelectedNode(null);
    toast.success("Đã xoá node");
  };

  const handleNodeUpdate = (updated: WorkflowNode) => {
    setNodes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
  };

  const selectedNodeObj = selectedNode ? nodes.find((n) => n.id === selectedNode) : null;

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-white border-b border-gray-200 flex-wrap">
        <button type="button" onClick={onBack}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
          <ChevronLeft className="w-4 h-4" /> Quay lại
        </button>
        <div className="h-5 w-px bg-gray-200" />
        <span className="text-sm text-gray-900 flex items-center gap-1.5">
          <span className="text-lg">{workflow.icon}</span>
          {workflow.name}
        </span>
        <span className={`text-[8px] px-1.5 py-0.5 rounded ${STATUS_CONFIG[workflow.status].color}`}>
          {STATUS_CONFIG[workflow.status].label}
        </span>
        <div className="flex-1" />

        {/* Zoom */}
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs text-gray-500 w-10 text-center">{Math.round(zoom * 100)}%</span>
          <button type="button" onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        <div className="h-5 w-px bg-gray-200" />

        {selectedNode && (
          <>
            <button type="button" onClick={() => selectedNodeObj && setConfigNode(selectedNodeObj)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg">
              <Settings className="w-3.5 h-3.5" /> Cấu hình
            </button>
            <button type="button" onClick={deleteSelected}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg">
              <Trash2 className="w-3.5 h-3.5" /> Xoá
            </button>
          </>
        )}

        <button type="button" onClick={() => toast.success("Workflow đã lưu!")}
          className="flex items-center gap-1 px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs hover:bg-violet-700">
          <Save className="w-3.5 h-3.5" /> Lưu
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Node Palette */}
        <div className={`${paletteOpen ? "w-[180px]" : "w-10"} bg-white border-r border-gray-200 flex flex-col transition-all flex-shrink-0`}>
          <button type="button" onClick={() => setPaletteOpen(!paletteOpen)}
            className="p-2 text-gray-400 hover:text-gray-600 self-end">
            {paletteOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {paletteOpen && (
            <div className="px-2 pb-2 space-y-1 overflow-y-auto">
              <p className="text-[9px] text-gray-400 uppercase px-1 mb-1">Kéo thả Node</p>
              {NODE_PALETTE.map((item) => {
                const cfg = NODE_CONFIG[item.type];
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => addNode(item.type)}
                    className={`w-full text-left px-2.5 py-2 rounded-lg border ${cfg.borderColor} ${cfg.bgColor} hover:shadow-sm transition-shadow`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm">{item.icon}</span>
                      <span className={`text-xs ${cfg.textColor}`}>{item.label}</span>
                    </div>
                    <p className="text-[8px] text-gray-400 mt-0.5">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-auto bg-[#fafbfe]"
          onClick={() => setSelectedNode(null)}>
          <div
            ref={canvasRef}
            className="relative"
            style={{
              width: canvasBounds.width * zoom,
              height: canvasBounds.height * zoom,
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
              minWidth: canvasBounds.width,
              minHeight: canvasBounds.height,
            }}
          >
            {/* Grid pattern */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ width: canvasBounds.width, height: canvasBounds.height }}>
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Connection SVGs */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ width: canvasBounds.width, height: canvasBounds.height }}>
              {connections.map((conn) => {
                const fromNode = nodeMap.get(conn.from);
                const toNode = nodeMap.get(conn.to);
                if (!fromNode || !toNode) return null;
                return (
                  <ConnectionLine
                    key={conn.id}
                    fromNode={fromNode}
                    toNode={toNode}
                    label={conn.label}
                    nodeWidth={NODE_WIDTH}
                    nodeHeight={NODE_HEIGHT}
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => (
              <CanvasNode
                key={node.id}
                node={node}
                isSelected={selectedNode === node.id}
                onSelect={() => setSelectedNode(node.id)}
                onDragStart={(e) => handleDragStart(node.id, e)}
              />
            ))}
          </div>
        </div>

        {/* Selected Node Panel */}
        {selectedNodeObj && (
          <div className="w-[220px] bg-white border-l border-gray-200 p-3 overflow-y-auto flex-shrink-0 hidden lg:block">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{selectedNodeObj.icon}</span>
              <div>
                <p className="text-sm text-gray-900">{selectedNodeObj.label}</p>
                <span className={`text-[8px] px-1.5 py-0.5 rounded ${NODE_CONFIG[selectedNodeObj.type].bgColor} ${NODE_CONFIG[selectedNodeObj.type].textColor}`}>
                  {NODE_CONFIG[selectedNodeObj.type].label}
                </span>
              </div>
            </div>
            {selectedNodeObj.description && (
              <p className="text-xs text-gray-500 mb-3">{selectedNodeObj.description}</p>
            )}
            <div className="space-y-2">
              {Object.entries(selectedNodeObj.config).map(([key, value]) => (
                <div key={key} className="bg-gray-50 rounded-lg p-2">
                  <p className="text-[9px] text-gray-400 capitalize">{key.replace(/_/g, " ")}</p>
                  <p className="text-xs text-gray-800">{value}</p>
                </div>
              ))}
            </div>
            <button type="button"
              onClick={() => setConfigNode(selectedNodeObj)}
              className="mt-3 w-full px-3 py-2 bg-violet-600 text-white rounded-lg text-xs hover:bg-violet-700 flex items-center justify-center gap-1">
              <Pencil className="w-3 h-3" /> Chỉnh sửa
            </button>
          </div>
        )}
      </div>

      {/* Config Modal */}
      {configNode && (
        <NodeConfigModal
          node={configNode}
          onClose={() => setConfigNode(null)}
          onUpdate={handleNodeUpdate}
        />
      )}
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function WorkflowBuilderPage() {
  const [view, setView] = useState<"list" | "builder">("list");
  const [activeWorkflow, setActiveWorkflow] = useState<WorkflowTemplate | null>(null);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const categories = useMemo(
    () => [...new Set(WORKFLOWS.map((w) => w.category))],
    []
  );

  const filtered = useMemo(() => {
    let result = [...WORKFLOWS];
    if (filterCategory) result = result.filter((w) => w.category === filterCategory);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (w) => w.name.toLowerCase().includes(q) || w.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [filterCategory, search]);

  const stats = useMemo(
    () => ({
      total: WORKFLOWS.length,
      active: WORKFLOWS.filter((w) => w.status === "active").length,
      totalRuns: WORKFLOWS.reduce((s, w) => s + w.runs, 0),
      avgSuccess: Math.round(
        WORKFLOWS.filter((w) => w.runs > 0).reduce((s, w) => s + w.successRate, 0) /
          WORKFLOWS.filter((w) => w.runs > 0).length
      ),
      aiSuggested: WORKFLOWS.filter((w) => w.aiSuggested).length,
    }),
    []
  );

  const openBuilder = (wf: WorkflowTemplate) => {
    setActiveWorkflow(wf);
    setView("builder");
  };

  if (view === "builder" && activeWorkflow) {
    return (
      <WorkflowCanvas
        workflow={activeWorkflow}
        onBack={() => {
          setView("list");
          setActiveWorkflow(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <Workflow className="w-6 h-6 text-violet-600" /> Workflow Builder
        </h1>
        <p className="text-gray-500 mt-0.5">
          Trình tạo workflow tự động visual node-based — drag & drop, AI suggestions
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <Workflow className="w-4 h-4 text-violet-500 mb-1" />
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Workflows</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-3">
          <Play className="w-4 h-4 text-green-500 mb-1" />
          <p className="text-lg text-green-600">{stats.active}</p>
          <p className="text-xs text-green-700">Đang chạy</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-3">
          <Zap className="w-4 h-4 text-violet-500 mb-1" />
          <p className="text-lg text-violet-600">{stats.totalRuns.toLocaleString()}</p>
          <p className="text-xs text-violet-700">Tổng lượt chạy</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-3">
          <CheckCircle2 className="w-4 h-4 text-blue-500 mb-1" />
          <p className="text-lg text-blue-600">{stats.avgSuccess}%</p>
          <p className="text-xs text-blue-700">Tỷ lệ thành công TB</p>
        </div>
        <div className="bg-pink-50 rounded-xl border border-pink-200 p-3 col-span-2 lg:col-span-1">
          <Brain className="w-4 h-4 text-pink-500 mb-1" />
          <p className="text-lg text-pink-600">{stats.aiSuggested}</p>
          <p className="text-xs text-pink-700">AI đề xuất</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            {["", ...categories].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFilterCategory(c)}
                className={`px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                  filterCategory === c
                    ? "bg-violet-600 text-white"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {c || "Tất cả"}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-[150px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm workflow..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              const blank: WorkflowTemplate = {
                id: `wf-new-${Date.now()}`,
                name: "Workflow mới",
                description: "Workflow trống — thêm node từ palette",
                category: "Custom",
                icon: "✨",
                status: "draft",
                nodes: [
                  { id: "n1", type: "trigger", label: "Trigger", description: "Sự kiện khởi động", x: 120, y: 80, config: {}, icon: "⚡" },
                  { id: "n2", type: "end", label: "Kết thúc", description: "", x: 120, y: 300, config: {}, icon: "🏁" },
                ],
                connections: [{ id: "c1", from: "n1", to: "n2" }],
                runs: 0,
                successRate: 0,
                lastRun: "—",
                createdBy: "Bạn",
                aiSuggested: false,
              };
              openBuilder(blank);
            }}
            className="flex items-center gap-1 px-3 py-1.5 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700"
          >
            <Plus className="w-4 h-4" /> Tạo mới
          </button>
        </div>
      </div>

      {/* Workflow Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((wf) => (
          <div
            key={wf.id}
            className="bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
            onClick={() => openBuilder(wf)}
          >
            {/* Mini preview — node flow */}
            <div className="h-[120px] bg-[#fafbfe] border-b border-gray-100 relative overflow-hidden p-3">
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {wf.connections.slice(0, 6).map((conn) => {
                  const from = wf.nodes.find((n) => n.id === conn.from);
                  const to = wf.nodes.find((n) => n.id === conn.to);
                  if (!from || !to) return null;
                  const scale = 0.45;
                  const fx = from.x * scale + 30;
                  const fy = from.y * scale + 18;
                  const tx = to.x * scale + 30;
                  const ty = to.y * scale;
                  const my = (fy + ty) / 2;
                  return (
                    <path
                      key={conn.id}
                      d={`M ${fx} ${fy} C ${fx} ${my}, ${tx} ${my}, ${tx} ${ty}`}
                      fill="none"
                      stroke="#ddd6fe"
                      strokeWidth={1.5}
                      strokeDasharray="4 2"
                    />
                  );
                })}
              </svg>
              {wf.nodes.slice(0, 8).map((node) => {
                const cfg = NODE_CONFIG[node.type];
                const scale = 0.45;
                return (
                  <div
                    key={node.id}
                    className={`absolute w-[64px] h-[18px] rounded border text-[7px] flex items-center gap-0.5 px-1 ${cfg.borderColor} ${cfg.bgColor} ${cfg.textColor}`}
                    style={{ left: node.x * scale, top: node.y * scale }}
                  >
                    <span className="text-[8px]">{node.icon}</span>
                    <span className="truncate">{node.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className={`text-[8px] px-1.5 py-0.5 rounded ${STATUS_CONFIG[wf.status].color}`}>
                  {STATUS_CONFIG[wf.status].label}
                </span>
                <span className="text-[8px] text-gray-300">{wf.category}</span>
                {wf.aiSuggested && (
                  <span className="text-[8px] px-1.5 py-0.5 rounded bg-pink-50 text-pink-600 flex items-center gap-0.5">
                    <Sparkles className="w-2.5 h-2.5" /> AI
                  </span>
                )}
              </div>

              <h4 className="text-sm text-gray-900 flex items-center gap-1.5">
                <span>{wf.icon}</span> {wf.name}
              </h4>
              <p className="text-[10px] text-gray-400 mt-0.5 line-clamp-2">{wf.description}</p>

              <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                <div className="bg-gray-50 rounded p-1.5">
                  <p className="text-xs text-gray-900">{wf.nodes.length}</p>
                  <p className="text-[7px] text-gray-400">Nodes</p>
                </div>
                <div className="bg-gray-50 rounded p-1.5">
                  <p className="text-xs text-gray-900">{wf.runs.toLocaleString()}</p>
                  <p className="text-[7px] text-gray-400">Chạy</p>
                </div>
                <div className={`rounded p-1.5 ${wf.successRate >= 90 ? "bg-green-50" : wf.successRate >= 70 ? "bg-amber-50" : "bg-gray-50"}`}>
                  <p className={`text-xs ${wf.successRate >= 90 ? "text-green-600" : wf.successRate >= 70 ? "text-amber-600" : "text-gray-500"}`}>
                    {wf.successRate > 0 ? `${wf.successRate}%` : "—"}
                  </p>
                  <p className="text-[7px] text-gray-400">Thành công</p>
                </div>
              </div>

              <div className="flex items-center justify-between mt-2 text-[9px] text-gray-300">
                <span>Bởi {wf.createdBy}</span>
                <span>
                  {wf.lastRun !== "—"
                    ? new Date(wf.lastRun).toLocaleDateString("vi-VN")
                    : "Chưa chạy"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Workflow className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Không tìm thấy workflow phù hợp</p>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Workflow Suggestions</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            Lead Qualification đạt 94% success rate — top performer. Recommend clone và customize cho từng territory.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-pink-500 mt-0.5 flex-shrink-0" />
            Đề xuất workflow mới: "Renewal Reminder 90-60-30" — auto send reminder cho subscriptions sắp hết hạn. Estimated impact: giảm 25% churn.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            Commission Auto-Calculate đang paused. 523 runs với 99% success — nên re-activate. Có thể bổ sung AI anomaly detection node.
          </p>
        </div>
      </div>
    </div>
  );
}
