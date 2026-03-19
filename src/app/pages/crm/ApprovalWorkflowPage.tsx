/**
 * Trang Approval Workflow — Quy trình phê duyệt báo giá / hợp đồng / chi tiêu.
 * Approval queue, multi-level approval chain, status tracking,
 * approval history, delegation, AI risk scoring.
 * Phase 1: Mock data + interactive approve/reject + detail modal.
 */
import { useState, useMemo, useCallback } from "react";
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  X,
  Bot,
  Sparkles,
  User,
  ArrowRight,
  AlertTriangle,
  ShieldCheck,
  FileText,
  DollarSign,
  FileCheck,
  Building2,
  ChevronDown,
  ChevronUp,
  Eye,
  TrendingUp,
  Timer,
  BarChart3,
  Zap,
  Send,
  RotateCcw,
  Filter,
  ThumbsUp,
  ThumbsDown,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "../../components/crm/DataTable";
import { ViewToggle } from "../../components/crm/ViewToggle";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";
import { useViewMode } from "../../hooks/useViewMode";
import type { ColumnDef } from "../../types/dataTable";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  LineChart,
  Line,
} from "recharts";

/* ============================================================
 * Types
 * ============================================================ */
type ApprovalType = "quotation" | "contract" | "expense" | "discount" | "refund";
type ApprovalStatus = "pending" | "approved" | "rejected" | "escalated" | "expired";
type ApprovalLevel = 1 | 2 | 3;

interface ApprovalStep {
  level: ApprovalLevel;
  approver: string;
  role: string;
  status: ApprovalStatus;
  comment: string | null;
  timestamp: string | null;
}

interface ApprovalRequest {
  id: string;
  requestNo: string;
  type: ApprovalType;
  title: string;
  description: string;
  requester: string;
  requesterDept: string;
  client: string;
  amount: number;
  currency: string;
  createdAt: string;
  deadline: string;
  currentLevel: ApprovalLevel;
  status: ApprovalStatus;
  steps: ApprovalStep[];
  aiRiskScore: number;
  aiRiskNote: string;
  attachments: number;
  priority: "high" | "normal" | "low";
}

/* ============================================================
 * Constants
 * ============================================================ */
const TYPE_CONFIG: Record<ApprovalType, { label: string; icon: string; color: string }> = {
  quotation: { label: "Báo giá", icon: "📋", color: "bg-blue-50 text-blue-700" },
  contract: { label: "Hợp đồng", icon: "📝", color: "bg-violet-50 text-violet-700" },
  expense: { label: "Chi tiêu", icon: "💰", color: "bg-green-50 text-green-700" },
  discount: { label: "Chiết khấu", icon: "🏷️", color: "bg-amber-50 text-amber-700" },
  refund: { label: "Hoàn tiền", icon: "💸", color: "bg-red-50 text-red-700" },
};

const STATUS_CONFIG: Record<ApprovalStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: "Chờ duyệt", color: "text-amber-600 bg-amber-50", icon: <Clock className="w-3 h-3" /> },
  approved: { label: "Đã duyệt", color: "text-green-600 bg-green-50", icon: <CheckCircle2 className="w-3 h-3" /> },
  rejected: { label: "Từ chối", color: "text-red-600 bg-red-50", icon: <XCircle className="w-3 h-3" /> },
  escalated: { label: "Escalate", color: "text-violet-600 bg-violet-50", icon: <TrendingUp className="w-3 h-3" /> },
  expired: { label: "Hết hạn", color: "text-gray-500 bg-gray-100", icon: <Timer className="w-3 h-3" /> },
};

/* ============================================================
 * Mock Data — 10 approval requests
 * ============================================================ */
const REQUESTS: ApprovalRequest[] = [
  {
    id: "ap1", requestNo: "APR-2026-0089", type: "quotation",
    title: "Báo giá TechCorp AI Phase 2", description: "Báo giá dự án AI Platform Phase 2 cho TechCorp Inc. Bao gồm AI Agent development, training, deployment.",
    requester: "Nguyễn Văn An", requesterDept: "Sales", client: "TechCorp Inc.",
    amount: 120000, currency: "USD", createdAt: "2026-03-02T09:00:00", deadline: "2026-03-05T17:00:00",
    currentLevel: 2, status: "pending",
    steps: [
      { level: 1, approver: "Hoàng Thị Mai", role: "Sales Manager", status: "approved", comment: "Giá hợp lý, margin 35%.", timestamp: "2026-03-02T11:30:00" },
      { level: 2, approver: "Lý Quang Minh", role: "VP Sales", status: "pending", comment: null, timestamp: null },
      { level: 3, approver: "Trần Đức Hùng", role: "CEO", status: "pending", comment: null, timestamp: null },
    ],
    aiRiskScore: 15, aiRiskNote: "Rủi ro thấp. TechCorp là khách hàng lâu năm, payment history tốt. Margin 35% trên benchmark.",
    attachments: 3, priority: "high",
  },
  {
    id: "ap2", requestNo: "APR-2026-0088", type: "contract",
    title: "Hợp đồng gia hạn CloudStack Asia", description: "Gia hạn hợp đồng cloud hosting 3 năm với CloudStack Asia. Bao gồm DR setup và 24/7 support.",
    requester: "Lê Minh Cường", requesterDept: "Operations", client: "CloudStack Asia",
    amount: 540000, currency: "USD", createdAt: "2026-03-01T14:00:00", deadline: "2026-03-07T17:00:00",
    currentLevel: 3, status: "pending",
    steps: [
      { level: 1, approver: "Đỗ Hải Yến", role: "IT Manager", status: "approved", comment: "SLA terms đã review. OK.", timestamp: "2026-03-01T16:00:00" },
      { level: 2, approver: "Hoàng Thị Mai", role: "CFO", status: "approved", comment: "Budget allocated. 12% discount vs 1-year renewal.", timestamp: "2026-03-02T10:00:00" },
      { level: 3, approver: "Trần Đức Hùng", role: "CEO", status: "pending", comment: null, timestamp: null },
    ],
    aiRiskScore: 22, aiRiskNote: "Lock-in 3 năm có rủi ro nếu cloud pricing giảm. Đề xuất thêm clause price-match guarantee.",
    attachments: 5, priority: "high",
  },
  {
    id: "ap3", requestNo: "APR-2026-0087", type: "discount",
    title: "Chiết khấu 15% cho FinServe Korea", description: "FinServe yêu cầu chiết khấu 15% cho gói Enterprise 2-year. Đối thủ đang offer giá thấp hơn 20%.",
    requester: "Nguyễn Văn An", requesterDept: "Sales", client: "FinServe Korea",
    amount: 28500, currency: "USD", createdAt: "2026-03-01T10:00:00", deadline: "2026-03-04T17:00:00",
    currentLevel: 1, status: "pending",
    steps: [
      { level: 1, approver: "Hoàng Thị Mai", role: "Sales Manager", status: "pending", comment: null, timestamp: null },
      { level: 2, approver: "Lý Quang Minh", role: "VP Sales", status: "pending", comment: null, timestamp: null },
    ],
    aiRiskScore: 45, aiRiskNote: "Rủi ro trung bình. 15% discount giảm margin xuống 18%. Counter-offer 10% + thêm 3 tháng support miễn phí.",
    attachments: 2, priority: "normal",
  },
  {
    id: "ap4", requestNo: "APR-2026-0086", type: "expense",
    title: "Chi phí AWS infrastructure tháng 2", description: "AWS bill tháng 2/2026. Tăng 18% do scale-up cho TechCorp và MediSys projects.",
    requester: "Đỗ Hải Yến", requesterDept: "DevOps", client: "Internal",
    amount: 42000, currency: "USD", createdAt: "2026-02-28T08:00:00", deadline: "2026-03-03T17:00:00",
    currentLevel: 2, status: "pending",
    steps: [
      { level: 1, approver: "Lê Minh Cường", role: "Tech Lead", status: "approved", comment: "Chi phí hợp lý cho workload hiện tại.", timestamp: "2026-02-28T10:00:00" },
      { level: 2, approver: "Hoàng Thị Mai", role: "CFO", status: "pending", comment: null, timestamp: null },
    ],
    aiRiskScore: 35, aiRiskNote: "Chi phí tăng 18% nhưng revenue từ 2 project tương ứng tăng 25%. ROI vẫn positive. Xem xét Reserved Instances tiết kiệm 30%.",
    attachments: 1, priority: "normal",
  },
  {
    id: "ap5", requestNo: "APR-2026-0085", type: "refund",
    title: "Hoàn tiền RetailMax — billing error", description: "Hoàn $490 cho RetailMax do tính dư 7 licenses tháng 2. Đã verify bởi finance team.",
    requester: "Trần Đức Hùng", requesterDept: "Finance", client: "RetailMax",
    amount: 490, currency: "USD", createdAt: "2026-03-01T15:30:00", deadline: "2026-03-03T17:00:00",
    currentLevel: 1, status: "approved",
    steps: [
      { level: 1, approver: "Hoàng Thị Mai", role: "CFO", status: "approved", comment: "Verified. Đã credit vào invoice tháng 3.", timestamp: "2026-03-01T16:00:00" },
    ],
    aiRiskScore: 5, aiRiskNote: "Low risk. Billing error đã xác nhận. Đề xuất auto-deactivate inactive users để tránh lặp lại.",
    attachments: 2, priority: "low",
  },
  {
    id: "ap6", requestNo: "APR-2026-0084", type: "quotation",
    title: "Báo giá MediSys EMR Phase 2 + Mobile", description: "Bundle proposal: EMR Phase 2 + Mobile app với chiết khấu bundle 10%.",
    requester: "Hoàng Thị Mai", requesterDept: "Sales", client: "MediSys",
    amount: 135000, currency: "USD", createdAt: "2026-02-27T11:00:00", deadline: "2026-03-04T17:00:00",
    currentLevel: 2, status: "escalated",
    steps: [
      { level: 1, approver: "Nguyễn Văn An", role: "Senior Sales", status: "approved", comment: "Bundle strategy tốt. Cross-sell opportunity.", timestamp: "2026-02-27T14:00:00" },
      { level: 2, approver: "Lý Quang Minh", role: "VP Sales", status: "escalated", comment: "Cần CEO review vì bundle discount ảnh hưởng pricing policy.", timestamp: "2026-02-28T09:00:00" },
      { level: 3, approver: "Trần Đức Hùng", role: "CEO", status: "pending", comment: null, timestamp: null },
    ],
    aiRiskScore: 30, aiRiskNote: "Bundle discount 10% hợp lý cho deal $135K. Nếu set precedent, cần update pricing policy cho bundles.",
    attachments: 4, priority: "high",
  },
  {
    id: "ap7", requestNo: "APR-2026-0083", type: "contract",
    title: "Hợp đồng NeuralWave AI R&D Extension", description: "Gia hạn 6 tháng hợp đồng AI Agent R&D với NeuralWave. Thêm scope: LLM fine-tuning.",
    requester: "Lê Minh Cường", requesterDept: "R&D", client: "NeuralWave AI",
    amount: 120000, currency: "USD", createdAt: "2026-02-25T10:00:00", deadline: "2026-03-01T17:00:00",
    currentLevel: 3, status: "approved",
    steps: [
      { level: 1, approver: "Đỗ Hải Yến", role: "AI Lead", status: "approved", comment: "LLM fine-tuning scope rõ ràng. Deliverables cụ thể.", timestamp: "2026-02-25T14:00:00" },
      { level: 2, approver: "Hoàng Thị Mai", role: "CFO", status: "approved", comment: "Budget approved từ R&D fund.", timestamp: "2026-02-26T10:00:00" },
      { level: 3, approver: "Trần Đức Hùng", role: "CEO", status: "approved", comment: "Strategic investment. Approve.", timestamp: "2026-02-27T09:00:00" },
    ],
    aiRiskScore: 20, aiRiskNote: "NeuralWave performance score 90/100. Low risk. LLM investment aligns with company AI-first strategy.",
    attachments: 6, priority: "normal",
  },
  {
    id: "ap8", requestNo: "APR-2026-0082", type: "expense",
    title: "Mua license Figma Enterprise", description: "Nâng cấp từ Figma Pro lên Enterprise cho design team 8 người. Bao gồm org-wide design system.",
    requester: "Trần Minh Anh", requesterDept: "Design", client: "Internal",
    amount: 5760, currency: "USD", createdAt: "2026-02-24T09:00:00", deadline: "2026-02-28T17:00:00",
    currentLevel: 1, status: "approved",
    steps: [
      { level: 1, approver: "Hoàng Thị Mai", role: "CFO", status: "approved", comment: "ROI rõ ràng: shared design system giảm 30% design time.", timestamp: "2026-02-24T14:00:00" },
    ],
    aiRiskScore: 8, aiRiskNote: "Low value, clear ROI. Auto-approve eligible (<$10K internal tools).",
    attachments: 1, priority: "low",
  },
  {
    id: "ap9", requestNo: "APR-2026-0081", type: "discount",
    title: "Chiết khấu 25% cho LogiTrack — volume deal", description: "LogiTrack mua 100 licenses. Yêu cầu chiết khấu 25% cho volume commitment 3 năm.",
    requester: "Phạm Thanh Tùng", requesterDept: "Sales", client: "LogiTrack",
    amount: 75000, currency: "USD", createdAt: "2026-02-20T10:00:00", deadline: "2026-02-25T17:00:00",
    currentLevel: 2, status: "rejected",
    steps: [
      { level: 1, approver: "Hoàng Thị Mai", role: "Sales Manager", status: "approved", comment: "Volume deal lớn, nên xem xét.", timestamp: "2026-02-20T14:00:00" },
      { level: 2, approver: "Lý Quang Minh", role: "VP Sales", status: "rejected", comment: "25% quá cao. Counter-offer 18% + priority support free.", timestamp: "2026-02-22T09:00:00" },
    ],
    aiRiskScore: 65, aiRiskNote: "25% discount giảm margin xuống 8% — dưới minimum 15%. Counter 18% đạt margin 15.5%. Recommend accept counter.",
    attachments: 3, priority: "normal",
  },
  {
    id: "ap10", requestNo: "APR-2026-0080", type: "quotation",
    title: "Báo giá EduTech LMS Integration", description: "Tích hợp CRM với LMS platform của EduTech. API development + data sync.",
    requester: "Đỗ Hải Yến", requesterDept: "Solutions", client: "EduTech",
    amount: 45000, currency: "USD", createdAt: "2026-02-18T11:00:00", deadline: "2026-02-22T17:00:00",
    currentLevel: 2, status: "approved",
    steps: [
      { level: 1, approver: "Lê Minh Cường", role: "Tech Lead", status: "approved", comment: "Technical scope feasible. 3 sprint estimate.", timestamp: "2026-02-18T15:00:00" },
      { level: 2, approver: "Hoàng Thị Mai", role: "Sales Manager", status: "approved", comment: "Pricing competitive. Win probability 80%.", timestamp: "2026-02-19T10:00:00" },
    ],
    aiRiskScore: 18, aiRiskNote: "Low risk. Standard integration project. EduTech has clean payment history.",
    attachments: 2, priority: "normal",
  },
];

/* ============================================================
 * Chart Data
 * ============================================================ */
const TYPE_CHART = Object.entries(TYPE_CONFIG).map(([key, cfg]) => ({
  name: cfg.label,
  count: REQUESTS.filter((r) => r.type === key).length,
}));
const TYPE_COLORS = ["#3b82f6", "#8b5cf6", "#22c55e", "#f59e0b", "#ef4444"];

const STATUS_PIE = Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
  name: cfg.label,
  value: REQUESTS.filter((r) => r.status === key).length,
})).filter((d) => d.value > 0);
const STATUS_COLORS = ["#f59e0b", "#22c55e", "#ef4444", "#8b5cf6", "#9ca3af"];

const APPROVAL_TIME = [
  { week: "W6", avgHours: 18 }, { week: "W7", avgHours: 22 },
  { week: "W8", avgHours: 16 }, { week: "W9", avgHours: 14 },
  { week: "W10", avgHours: 12 },
];

/* ============================================================
 * Approval Step Visualization
 * ============================================================ */
function ApprovalChain({ steps }: { steps: ApprovalStep[] }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto py-1">
      {steps.map((step, i) => {
        const sCfg = STATUS_CONFIG[step.status];
        return (
          <div key={step.level} className="flex items-center gap-1 flex-shrink-0">
            {i > 0 && <ArrowRight className="w-3 h-3 text-gray-300 flex-shrink-0" />}
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] ${sCfg.color} border border-transparent`}>
              {sCfg.icon}
              <span className="whitespace-nowrap">{step.approver}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
 * Detail Modal
 * ============================================================ */
function ApprovalDetailModal({ request, onClose, onAction }: {
  request: ApprovalRequest;
  onClose: () => void;
  onAction: (id: string, action: "approve" | "reject") => void;
}) {
  const tCfg = TYPE_CONFIG[request.type];
  const sCfg = STATUS_CONFIG[request.status];

  const riskColor = request.aiRiskScore <= 20 ? "text-green-600 bg-green-50" :
    request.aiRiskScore <= 50 ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-sm px-2 py-0.5 rounded ${tCfg.color}`}>{tCfg.icon} {tCfg.label}</span>
              <span className="text-xs text-gray-400">{request.requestNo}</span>
            </div>
            <h3 className="text-gray-900 mt-1">{request.title}</h3>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          <p className="text-sm text-gray-600">{request.description}</p>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-[9px] text-gray-400 mb-0.5">Người yêu cầu</p>
              <p className="text-xs text-gray-800">{request.requester}</p>
              <p className="text-[9px] text-gray-500">{request.requesterDept}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-[9px] text-gray-400 mb-0.5">Khách hàng</p>
              <p className="text-xs text-gray-800">{request.client}</p>
            </div>
          </div>

          {/* Amount & Status */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-green-50 rounded-lg border border-green-100 p-2.5 text-center">
              <p className="text-lg text-green-600">${request.amount.toLocaleString()}</p>
              <p className="text-[8px] text-gray-400">{request.currency}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2.5 text-center">
              <span className={`text-[9px] px-2 py-0.5 rounded inline-flex items-center gap-0.5 ${sCfg.color}`}>
                {sCfg.icon} {sCfg.label}
              </span>
              <p className="text-[8px] text-gray-400 mt-0.5">Trạng thái</p>
            </div>
            <div className={`rounded-lg p-2.5 text-center ${riskColor}`}>
              <p className="text-lg">{request.aiRiskScore}</p>
              <p className="text-[8px] text-gray-400">AI Risk</p>
            </div>
          </div>

          {/* Approval Chain */}
          <div>
            <h4 className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Chuỗi phê duyệt
            </h4>
            <div className="space-y-2">
              {request.steps.map((step) => {
                const stepCfg = STATUS_CONFIG[step.status];
                return (
                  <div key={step.level} className={`rounded-lg border p-3 ${
                    step.status === "approved" ? "border-green-200 bg-green-50/50" :
                    step.status === "rejected" ? "border-red-200 bg-red-50/50" :
                    step.status === "pending" ? "border-amber-200 bg-amber-50/30" :
                    "border-gray-200 bg-gray-50"
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-[9px]">
                          L{step.level}
                        </span>
                        <div>
                          <p className="text-xs text-gray-800">{step.approver}</p>
                          <p className="text-[9px] text-gray-400">{step.role}</p>
                        </div>
                      </div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5 ${stepCfg.color}`}>
                        {stepCfg.icon} {stepCfg.label}
                      </span>
                    </div>
                    {step.comment && (
                      <p className="text-[10px] text-gray-600 mt-1 pl-7">"{step.comment}"</p>
                    )}
                    {step.timestamp && (
                      <p className="text-[8px] text-gray-400 mt-0.5 pl-7">
                        {new Date(step.timestamp).toLocaleString("vi-VN")}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-xs text-gray-900">{new Date(request.createdAt).toLocaleDateString("vi-VN")}</p>
              <p className="text-[8px] text-gray-400">Ngày tạo</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-xs text-gray-900">{new Date(request.deadline).toLocaleDateString("vi-VN")}</p>
              <p className="text-[8px] text-gray-400">Hạn duyệt</p>
            </div>
          </div>

          {/* AI Risk */}
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-lg border border-violet-100 p-3">
            <p className="text-xs text-violet-800 flex items-start gap-1.5">
              <Bot className="w-3.5 h-3.5 text-violet-500 mt-0.5 flex-shrink-0" />
              <span><span className="text-violet-900">AI Risk Analysis:</span> {request.aiRiskNote}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-gray-100 flex-shrink-0">
          <p className="text-[9px] text-gray-400">{request.attachments} tệp đính kèm</p>
          {request.status === "pending" ? (
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => { onAction(request.id, "reject"); onClose(); }}
                className="flex items-center gap-1 px-3 py-2 bg-red-50 text-red-600 rounded-lg text-sm hover:bg-red-100">
                <ThumbsDown className="w-3.5 h-3.5" /> Từ chối
              </button>
              <button type="button" onClick={() => { onAction(request.id, "approve"); onClose(); }}
                className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
                <ThumbsUp className="w-3.5 h-3.5" /> Phê duyệt
              </button>
            </div>
          ) : (
            <button type="button" onClick={onClose}
              className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">Đóng</button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Create Approval Request Modal
 * ============================================================ */
function CreateApprovalModal({ onClose, onCreated }: { onClose: () => void; onCreated: (req: ApprovalRequest) => void }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<ApprovalType>("quotation");
  const [description, setDescription] = useState("");
  const [client, setClient] = useState("");
  const [amount, setAmount] = useState(10000);
  const [priority, setPriority] = useState<"high" | "normal" | "low">("normal");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!title.trim()) { toast.error("Vui lòng nhập tiêu đề yêu cầu"); return; }
    if (!client.trim()) { toast.error("Vui lòng nhập tên khách hàng / đối tượng"); return; }
    setSaving(true);
    const reqNo = `APR-2026-${String(Math.floor(Math.random() * 9000) + 1000)}`;
    const newReq: ApprovalRequest = {
      id: `ap_${Date.now()}`, requestNo: reqNo, type, title, description,
      requester: "Bạn", requesterDept: "Sales", client,
      amount, currency: "USD",
      createdAt: new Date().toISOString(),
      deadline: new Date(Date.now() + 5 * 86400000).toISOString(),
      currentLevel: 1, status: "pending",
      steps: [
        { level: 1, approver: "Hoàng Thị Mai", role: "Sales Manager", status: "pending", comment: null, timestamp: null },
        { level: 2, approver: "Lý Quang Minh", role: "VP Sales", status: "pending", comment: null, timestamp: null },
        ...(amount >= 100000 ? [{ level: 3 as ApprovalLevel, approver: "Trần Đức Hùng", role: "CEO", status: "pending" as ApprovalStatus, comment: null, timestamp: null }] : []),
      ],
      aiRiskScore: Math.min(90, Math.round(amount / 5000)),
      aiRiskNote: `AI đang phân tích rủi ro cho yêu cầu ${TYPE_CONFIG[type].label}. Giá trị: $${amount.toLocaleString()}.`,
      attachments: 0, priority,
    };
    onCreated(newReq);
    toast.success(`Đã tạo yêu cầu phê duyệt "${title}" — ${reqNo}`);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Tạo Yêu cầu Phê duyệt</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3 max-h-[65vh] overflow-y-auto">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tiêu đề *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="VD: Báo giá dự án AI Phase 2"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Loại yêu cầu</label>
              <select value={type} onChange={(e) => setType(e.target.value as ApprovalType)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                {Object.entries(TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Mức ưu tiên</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value as "high" | "normal" | "low")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option value="high">Cao</option>
                <option value="normal">Bình thường</option>
                <option value="low">Thấp</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Khách hàng / Đối tượng *</label>
              <input type="text" value={client} onChange={(e) => setClient(e.target.value)} placeholder="VD: TechCorp Inc."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Giá trị ($)</label>
              <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} min={0}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mô tả chi tiết</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
              placeholder="Mô tả nội dung yêu cầu phê duyệt..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
          </div>
          <div className="bg-violet-50 rounded-lg p-3 border border-violet-100">
            <p className="text-[10px] text-violet-700 flex items-start gap-1">
              <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" />
              <span>Yêu cầu ≥$100K sẽ cần CEO phê duyệt (3 cấp). AI tự động đánh giá risk score và đề xuất counter-offer nếu cần.</span>
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Gửi Yêu cầu"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function ApprovalWorkflowPage() {
  const [requests, setRequests] = useState<ApprovalRequest[]>(REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<ApprovalRequest | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<ApprovalType | "">("");
  const [filterStatus, setFilterStatus] = useState<ApprovalStatus | "">("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ ids: string[]; label: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { mode, setMode } = useViewMode("approval-workflow", "list");

  const stats = useMemo(() => {
    const pending = requests.filter((r) => r.status === "pending").length;
    const totalValue = requests.filter((r) => r.status === "pending").reduce((s, r) => s + r.amount, 0);
    const approved = requests.filter((r) => r.status === "approved").length;
    const highRisk = requests.filter((r) => r.aiRiskScore >= 50 && r.status === "pending").length;
    return { pending, totalValue, approved, highRisk };
  }, [requests]);

  const filtered = useMemo(() => {
    let result = [...requests];
    if (filterType) result = result.filter((r) => r.type === filterType);
    if (filterStatus) result = result.filter((r) => r.status === filterStatus);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        r.title.toLowerCase().includes(q) || r.requestNo.toLowerCase().includes(q) ||
        r.client.toLowerCase().includes(q) || r.requester.toLowerCase().includes(q));
    }
    // Pending first, then by date
    const statusOrder: Record<ApprovalStatus, number> = { pending: 0, escalated: 1, approved: 2, rejected: 3, expired: 4 };
    return result.sort((a, b) => statusOrder[a.status] - statusOrder[b.status] || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [requests, filterType, filterStatus, search]);

  const handleAction = useCallback((id: string, action: "approve" | "reject") => {
    setRequests((prev) => prev.map((r) =>
      r.id === id ? { ...r, status: action === "approve" ? "approved" as const : "rejected" as const } : r
    ));
    toast.success(action === "approve" ? "Đã phê duyệt thành công" : "Đã từ chối yêu cầu");
  }, []);

  const PRIORITY_LABELS: Record<string, string> = { high: "Cao", normal: "Bình thường", low: "Thấp" };

  const columns: ColumnDef<ApprovalRequest>[] = [
    {
      key: "requestNo", header: "Mã", sortable: true, minWidth: 120,
      render: (r) => {
        const tCfg = TYPE_CONFIG[r.type];
        return (
          <div>
            <span className="text-[9px] text-gray-400">{r.requestNo}</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className={`text-[8px] px-1 py-0.5 rounded ${tCfg.color}`}>{tCfg.icon} {tCfg.label}</span>
            </div>
          </div>
        );
      },
    },
    {
      key: "title", header: "Tiêu đề", sortable: true, minWidth: 200,
      render: (r) => (
        <div className="min-w-0">
          <p className="text-gray-900 truncate">{r.title}</p>
          <p className="text-[10px] text-gray-400">{r.requester} · {r.client}</p>
        </div>
      ),
    },
    {
      key: "amount", header: "Giá trị", sortable: true, minWidth: 100,
      render: (r) => <span className="text-gray-900">${r.amount.toLocaleString()}</span>,
      sortValue: (r) => r.amount,
    },
    {
      key: "status", header: "Trạng thái", sortable: true, minWidth: 110, editable: true,
      render: (r) => {
        const sCfg = STATUS_CONFIG[r.status];
        return <span className={`text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5 ${sCfg.color}`}>{sCfg.icon} {sCfg.label}</span>;
      },
      renderEdit: (item, _v, onChange, onSave) => (
        <select defaultValue={item.status} onChange={(e) => { onChange(e.target.value); onSave(); }}
          onBlur={onSave} autoFocus
          className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
          {Object.entries(STATUS_CONFIG).map(([k, cfg]) => <option key={k} value={k}>{cfg.label}</option>)}
        </select>
      ),
    },
    {
      key: "priority", header: "Ưu tiên", sortable: true, minWidth: 90, editable: true,
      render: (r) => (
        <span className={`text-[9px] px-1.5 py-0.5 rounded ${
          r.priority === "high" ? "bg-red-50 text-red-600" : r.priority === "low" ? "bg-gray-100 text-gray-500" : "bg-blue-50 text-blue-600"
        }`}>{PRIORITY_LABELS[r.priority]}</span>
      ),
      renderEdit: (item, _v, onChange, onSave) => (
        <select defaultValue={item.priority} onChange={(e) => { onChange(e.target.value); onSave(); }}
          onBlur={onSave} autoFocus
          className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
          {Object.entries(PRIORITY_LABELS).map(([k, l]) => <option key={k} value={k}>{l}</option>)}
        </select>
      ),
    },
    {
      key: "aiRiskScore", header: "AI Risk", sortable: true, minWidth: 70,
      render: (r) => (
        <span className={`text-xs ${r.aiRiskScore <= 20 ? "text-green-600" : r.aiRiskScore <= 50 ? "text-amber-600" : "text-red-600"}`}>
          {r.aiRiskScore}
        </span>
      ),
      sortValue: (r) => r.aiRiskScore,
    },
    {
      key: "deadline", header: "Hạn duyệt", sortable: true, minWidth: 100,
      render: (r) => <span className="text-gray-500 text-xs">{new Date(r.deadline).toLocaleDateString("vi-VN")}</span>,
    },
  ];

  const handleInlineEdit = useCallback((rowId: string, field: string, value: unknown) => {
    setRequests((prev) => prev.map((r) => r.id === rowId ? { ...r, [field]: value } : r));
    toast.success("Đã cập nhật yêu cầu");
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 400));
    setRequests((prev) => prev.filter((r) => !deleteTarget.ids.includes(r.id)));
    toast.success(`Đã xóa ${deleteTarget.ids.length > 1 ? deleteTarget.ids.length + " yêu cầu" : "\"" + deleteTarget.label + "\""}`);
    setDeleteTarget(null);
    setDeleting(false);
  }, [deleteTarget]);

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-violet-600" /> Quy trình Phê duyệt
          </h1>
          <p className="text-gray-500 mt-0.5">
            Multi-level approval chain, AI risk scoring, SLA tracking, delegation
          </p>
        </div>
        <button type="button" onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 self-start">
          <Plus className="w-4 h-4" /> Tạo Yêu cầu
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className={`rounded-xl border p-3 ${stats.pending > 0 ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}`}>
          <Clock className="w-4 h-4 text-amber-500 mb-1" />
          <p className="text-lg text-gray-900">{stats.pending}</p>
          <p className="text-xs text-gray-600">Chờ phê duyệt</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <p className="text-lg text-gray-900">${(stats.totalValue / 1000).toFixed(0)}K</p>
          <p className="text-xs text-gray-500">Giá trị pending</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-3">
          <p className="text-lg text-green-600">{stats.approved}</p>
          <p className="text-xs text-green-700">Đã duyệt</p>
        </div>
        <div className={`rounded-xl border p-3 ${stats.highRisk > 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
          <p className={`text-lg ${stats.highRisk > 0 ? "text-red-600" : "text-green-600"}`}>{stats.highRisk}</p>
          <p className="text-xs text-gray-600">High risk pending</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3">Theo Trạng thái</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={STATUS_PIE} dataKey="value" nameKey="name" cx="50%" cy="50%"
                outerRadius={65} innerRadius={25}
                label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {STATUS_PIE.map((_, i) => <Cell key={i} fill={STATUS_COLORS[i]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3">Theo Loại</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={TYPE_CHART}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {TYPE_CHART.map((_, i) => <Cell key={i} fill={TYPE_COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3">Thời gian duyt TB (giờ)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={APPROVAL_TIME}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip formatter={(v: number) => [`${v}h`, "TB"]} />
              <Line type="monotone" dataKey="avgHours" stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4, fill: "#6366f1" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            {(["", "pending", "approved", "rejected", "escalated"] as (ApprovalStatus | "")[]).map((s) => (
              <button key={s} type="button" onClick={() => setFilterStatus(s)}
                className={`px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                  filterStatus === s ? "bg-violet-600 text-white" : "text-gray-500 hover:bg-gray-100"
                }`}>
                {s === "" ? "Tất cả" : STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value as ApprovalType | "")}
            className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm">
            <option value="">Tất cả loại</option>
            {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.icon} {cfg.label}</option>
            ))}
          </select>
          <div className="relative flex-1 min-w-[150px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Tìm yêu cầu..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <ViewToggle mode={mode} onSetMode={setMode} modes={["table", "list"]} />
        </div>
      </div>

      {mode === "table" ? (
        <DataTable<ApprovalRequest>
          data={filtered}
          columns={columns}
          storageKey="approval-workflow-table"
          selectable
          onRowClick={setSelectedRequest}
          onInlineEdit={handleInlineEdit}
          onBulkDelete={(ids) => setDeleteTarget({ ids, label: `${ids.length} yêu cầu được chọn` })}
          renderRowActions={(item) => (
            <div className="flex items-center gap-0.5">
              <button type="button" onClick={() => setSelectedRequest(item)} className="p-1 text-gray-400 hover:text-blue-600 rounded" title="Xem"><Eye className="w-3.5 h-3.5" /></button>
              <button type="button" onClick={() => setDeleteTarget({ ids: [item.id], label: item.title })} className="p-1 text-gray-400 hover:text-red-600 rounded" title="Xóa"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          )}
          emptyMessage="Không tìm thấy yêu cầu phù hợp"
        />
      ) : (
      <>
      {/* Request List */}
      <div className="space-y-3">
        {filtered.map((req) => {
          const tCfg = TYPE_CONFIG[req.type];
          const sCfg = STATUS_CONFIG[req.status];
          const riskColor = req.aiRiskScore <= 20 ? "text-green-600" : req.aiRiskScore <= 50 ? "text-amber-600" : "text-red-600";

          return (
            <div key={req.id}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow cursor-pointer"
              onClick={() => setSelectedRequest(req)}>
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${tCfg.color}`}>
                  {tCfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className="text-[9px] text-gray-400">{req.requestNo}</span>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded flex items-center gap-0.5 ${sCfg.color}`}>
                      {sCfg.icon} {sCfg.label}
                    </span>
                    {req.priority === "high" && (
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-red-50 text-red-600">Ưu tiên cao</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-900 line-clamp-1">{req.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-400">
                    <span className="flex items-center gap-0.5"><User className="w-2.5 h-2.5" /> {req.requester}</span>
                    <span className="flex items-center gap-0.5"><Building2 className="w-2.5 h-2.5" /> {req.client}</span>
                  </div>
                  {/* Approval chain mini */}
                  <div className="mt-2">
                    <ApprovalChain steps={req.steps} />
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm text-gray-900">${req.amount.toLocaleString()}</p>
                  <p className={`text-[9px] ${riskColor}`}>Risk: {req.aiRiskScore}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <ClipboardCheck className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Không tìm thấy yêu cầu phù hợp</p>
        </div>
      )}
      </>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Approval Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            4 yêu cầu pending trị giá $730K. CEO cần review 2 yêu cầu &gt;$100K trước deadline thứ 6.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            Thời gian duyệt giảm từ 22h xuống 12h (giảm 45%). Auto-approve cho chi tiêu &lt;$10K giúp giảm 30% workload.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            Chiết khấu FinServe 15% có risk score 45. Counter-offer 10% + support miễn phí sẽ giảm risk xuống 20.
          </p>
        </div>
      </div>

      {selectedRequest && (
        <ApprovalDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onAction={handleAction}
        />
      )}
      {showCreateModal && <CreateApprovalModal onClose={() => setShowCreateModal(false)} onCreated={(req) => setRequests((prev) => [req, ...prev])} />}
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.label ?? ""}
        entityType="yêu cầu phê duyệt"
        description="Thao tác này không thể hoàn tác."
        loading={deleting}
      />
    </div>
  );
}