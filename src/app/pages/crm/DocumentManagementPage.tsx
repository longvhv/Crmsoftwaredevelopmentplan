/**
 * Trang Document Management — Quản lý tài liệu & e-signature tracking.
 * Document library, version control, e-signature workflow,
 * template management, access tracking, AI auto-tagging.
 * Phase 1: Mock data + interactive UI + detail modal.
 */
import { useState, useMemo } from "react";
import {
  FolderOpen,
  Search,
  X,
  Bot,
  Sparkles,
  FileText,
  File,
  FilePlus,
  FileCheck,
  FileX,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Download,
  Upload,
  Eye,
  Lock,
  Users,
  User,
  Pen,
  Send,
  Shield,
  Tag,
  Calendar,
  Building2,
  Hash,
  ExternalLink,
  MoreHorizontal,
  Star,
  StarOff,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
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
type DocType = "proposal" | "contract" | "nda" | "invoice" | "sow" | "report" | "template";
type DocStatus = "draft" | "pending-signature" | "signed" | "expired" | "rejected";
type SignatureStatus = "pending" | "signed" | "declined" | "expired";

interface Signer {
  name: string;
  email: string;
  role: string;
  status: SignatureStatus;
  signedAt: string | null;
  order: number;
}

interface Document {
  id: string;
  title: string;
  type: DocType;
  status: DocStatus;
  version: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  client: string;
  fileSize: string;
  pages: number;
  tags: string[];
  starred: boolean;
  signers: Signer[];
  views: number;
  downloads: number;
  expiresAt: string | null;
  aiTags: string[];
  aiSummary: string;
  relatedDealId: string | null;
}

/* ============================================================
 * Constants
 * ============================================================ */
const TYPE_CONFIG: Record<DocType, { label: string; icon: string; color: string }> = {
  proposal: { label: "Đề xuất", icon: "📋", color: "bg-blue-50 text-blue-700" },
  contract: { label: "Hợp đồng", icon: "📝", color: "bg-violet-50 text-violet-700" },
  nda: { label: "NDA", icon: "🔒", color: "bg-amber-50 text-amber-700" },
  invoice: { label: "Hoá đơn", icon: "💰", color: "bg-green-50 text-green-700" },
  sow: { label: "SOW", icon: "📄", color: "bg-teal-50 text-teal-700" },
  report: { label: "Báo cáo", icon: "📊", color: "bg-pink-50 text-pink-700" },
  template: { label: "Template", icon: "📑", color: "bg-gray-100 text-gray-700" },
};

const STATUS_CONFIG: Record<DocStatus, { label: string; color: string; icon: React.ReactNode }> = {
  draft: { label: "Nháp", color: "text-gray-600 bg-gray-100", icon: <File className="w-3 h-3" /> },
  "pending-signature": { label: "Chờ ký", color: "text-amber-600 bg-amber-50", icon: <Pen className="w-3 h-3" /> },
  signed: { label: "Đã ký", color: "text-green-600 bg-green-50", icon: <CheckCircle2 className="w-3 h-3" /> },
  expired: { label: "Hết hạn", color: "text-red-600 bg-red-50", icon: <Clock className="w-3 h-3" /> },
  rejected: { label: "Từ chối", color: "text-red-600 bg-red-50", icon: <XCircle className="w-3 h-3" /> },
};

const SIG_CONFIG: Record<SignatureStatus, { label: string; color: string }> = {
  pending: { label: "Chờ ký", color: "text-amber-600 bg-amber-50" },
  signed: { label: "Đã ký", color: "text-green-600 bg-green-50" },
  declined: { label: "Từ chối", color: "text-red-600 bg-red-50" },
  expired: { label: "Hết hạn", color: "text-gray-500 bg-gray-100" },
};

/* ============================================================
 * Mock Data — 12 documents
 * ============================================================ */
const DOCUMENTS: Document[] = [
  {
    id: "doc1", title: "Hợp đồng TechCorp AI Phase 2", type: "contract", status: "pending-signature",
    version: "v2.1", createdBy: "Nguyễn Văn An", createdAt: "2026-03-02T09:00:00", updatedAt: "2026-03-03T10:00:00",
    client: "TechCorp Inc.", fileSize: "2.4 MB", pages: 18, tags: ["Enterprise", "AI", "Phase 2"],
    starred: true, views: 12, downloads: 3, expiresAt: "2026-03-10",
    signers: [
      { name: "David Chen", email: "david@techcorp.com", role: "CTO", status: "signed", signedAt: "2026-03-03T08:00:00", order: 1 },
      { name: "Trần Đức Hùng", email: "hung@company.com", role: "CEO", status: "pending", signedAt: null, order: 2 },
    ],
    aiTags: ["AI Platform", "Multi-year", "High-value"],
    aiSummary: "Hợp đồng 2 năm cho AI Platform Phase 2. Giá trị $120K. Payment: 40/30/30. SLA 99.9%. Include IP transfer clause.",
    relatedDealId: "D-2026-0089",
  },
  {
    id: "doc2", title: "NDA — FinServe Korea", type: "nda", status: "signed",
    version: "v1.0", createdBy: "Hoàng Thị Mai", createdAt: "2026-02-15T10:00:00", updatedAt: "2026-02-16T14:00:00",
    client: "FinServe Korea", fileSize: "0.8 MB", pages: 6, tags: ["NDA", "Korea"],
    starred: false, views: 5, downloads: 2, expiresAt: "2028-02-15",
    signers: [
      { name: "Robert Kim", email: "robert@finserve.kr", role: "CEO", status: "signed", signedAt: "2026-02-16T09:00:00", order: 1 },
      { name: "Trần Đức Hùng", email: "hung@company.com", role: "CEO", status: "signed", signedAt: "2026-02-16T14:00:00", order: 2 },
    ],
    aiTags: ["Confidentiality", "2-year Term", "Bilateral"],
    aiSummary: "Mutual NDA, thời hạn 2 năm. Bảo mật thông tin tài chính và kỹ thuật. Phạt vi phạm: 2x giá trị thiệt hại.",
    relatedDealId: null,
  },
  {
    id: "doc3", title: "SOW — MediSys EMR Phase 2 + Mobile", type: "sow", status: "draft",
    version: "v0.3", createdBy: "Lê Minh Cường", createdAt: "2026-03-01T11:00:00", updatedAt: "2026-03-03T09:30:00",
    client: "MediSys", fileSize: "1.5 MB", pages: 12, tags: ["Healthcare", "Mobile", "EMR"],
    starred: true, views: 8, downloads: 1, expiresAt: null,
    signers: [],
    aiTags: ["Healthcare", "EMR Integration", "Mobile App"],
    aiSummary: "SOW cho EMR Phase 2 + Mobile app. 3 sprints, 12 tuần. Team: 4 devs + 1 PM + 1 BA. Tech stack: React Native + Node.js.",
    relatedDealId: "D-2026-0086",
  },
  {
    id: "doc4", title: "Đề xuất CloudStack Asia — 3 Year Renewal", type: "proposal", status: "pending-signature",
    version: "v1.2", createdBy: "Lê Minh Cường", createdAt: "2026-02-28T14:00:00", updatedAt: "2026-03-02T10:00:00",
    client: "CloudStack Asia", fileSize: "3.1 MB", pages: 24, tags: ["Cloud", "Renewal", "3-year"],
    starred: false, views: 15, downloads: 4, expiresAt: "2026-03-07",
    signers: [
      { name: "Alex Wong", email: "alex@cloudstack.asia", role: "VP", status: "signed", signedAt: "2026-03-02T15:00:00", order: 1 },
      { name: "Hoàng Thị Mai", email: "mai@company.com", role: "CFO", status: "pending", signedAt: null, order: 2 },
      { name: "Trần Đức Hùng", email: "hung@company.com", role: "CEO", status: "pending", signedAt: null, order: 3 },
    ],
    aiTags: ["Long-term", "Infrastructure", "High-value"],
    aiSummary: "Proposal gia hạn 3 năm. $540K total. 12% discount vs annual. Include DR setup + 24/7 support. Price-match clause added.",
    relatedDealId: "D-2026-0088",
  },
  {
    id: "doc5", title: "Invoice #INV-2026-0312 — EduTech", type: "invoice", status: "signed",
    version: "v1.0", createdBy: "AI Agent — Nova", createdAt: "2026-03-01T06:00:00", updatedAt: "2026-03-01T06:00:00",
    client: "EduTech", fileSize: "0.3 MB", pages: 2, tags: ["Invoice", "Auto-generated"],
    starred: false, views: 3, downloads: 1, expiresAt: null,
    signers: [
      { name: "Auto-signed", email: "system@company.com", role: "System", status: "signed", signedAt: "2026-03-01T06:00:00", order: 1 },
    ],
    aiTags: ["Auto-generated", "Monthly", "Recurring"],
    aiSummary: "Invoice tháng 3/2026 cho EduTech. $5,500 — recurring monthly. Auto-generated bởi AI Agent Nova. Net 30 payment terms.",
    relatedDealId: null,
  },
  {
    id: "doc6", title: "Hợp đồng NeuralWave AI R&D Extension", type: "contract", status: "signed",
    version: "v1.0", createdBy: "Đỗ Hải Yến", createdAt: "2026-02-25T10:00:00", updatedAt: "2026-02-27T09:00:00",
    client: "NeuralWave AI", fileSize: "2.8 MB", pages: 22, tags: ["AI", "R&D", "Extension"],
    starred: false, views: 9, downloads: 2, expiresAt: "2026-08-31",
    signers: [
      { name: "Sara Lee", email: "sara@neuralwave.ai", role: "CEO", status: "signed", signedAt: "2026-02-26T14:00:00", order: 1 },
      { name: "Trần Đức Hùng", email: "hung@company.com", role: "CEO", status: "signed", signedAt: "2026-02-27T09:00:00", order: 2 },
    ],
    aiTags: ["R&D", "LLM", "6-month Extension"],
    aiSummary: "Extension 6 tháng cho AI R&D contract. Thêm scope: LLM fine-tuning. $120K. Deliverables: 3 fine-tuned models + evaluation report.",
    relatedDealId: null,
  },
  {
    id: "doc7", title: "Proposal — LogiTrack Volume Deal", type: "proposal", status: "rejected",
    version: "v2.0", createdBy: "Phạm Thanh Tùng", createdAt: "2026-02-18T10:00:00", updatedAt: "2026-02-22T09:00:00",
    client: "LogiTrack", fileSize: "2.0 MB", pages: 16, tags: ["Volume", "Discount", "Japan"],
    starred: false, views: 7, downloads: 3, expiresAt: "2026-02-25",
    signers: [
      { name: "Tanaka Yuki", email: "tanaka@logitrack.jp", role: "COO", status: "declined", signedAt: null, order: 1 },
    ],
    aiTags: ["Volume Deal", "High Discount", "Lost"],
    aiSummary: "Volume deal 100 licenses. 25% discount rejected bởi VP Sales — margin quá thấp. Counter-offer 18% cũng bị khách từ chối.",
    relatedDealId: "D-2026-0081",
  },
  {
    id: "doc8", title: "Báo cáo Revenue Q1 2026", type: "report", status: "draft",
    version: "v0.5", createdBy: "Hoàng Thị Mai", createdAt: "2026-03-02T16:00:00", updatedAt: "2026-03-03T11:00:00",
    client: "Internal", fileSize: "4.2 MB", pages: 32, tags: ["Report", "Q1", "Revenue"],
    starred: true, views: 4, downloads: 0, expiresAt: null,
    signers: [],
    aiTags: ["Quarterly", "Executive", "Financial"],
    aiSummary: "Revenue report Q1 2026. Draft — đang chờ data cuối tháng 3. Pipeline $1.8M, closed $1.35M, forecast close $1.65M.",
    relatedDealId: null,
  },
  {
    id: "doc9", title: "Template — Master Service Agreement", type: "template", status: "signed",
    version: "v4.2", createdBy: "Legal Team", createdAt: "2025-06-01T10:00:00", updatedAt: "2026-01-15T14:00:00",
    client: "Internal", fileSize: "1.1 MB", pages: 14, tags: ["Template", "MSA", "Legal"],
    starred: true, views: 45, downloads: 22, expiresAt: null,
    signers: [],
    aiTags: ["Standard Template", "Legal Approved", "v4.2"],
    aiSummary: "MSA template chuẩn. Version 4.2 — updated Jan 2026 với GDPR compliance clause và AI liability terms. Legal approved.",
    relatedDealId: null,
  },
  {
    id: "doc10", title: "SOW — BankPro Compliance Module", type: "sow", status: "pending-signature",
    version: "v1.1", createdBy: "Đỗ Hải Yến", createdAt: "2026-02-28T09:00:00", updatedAt: "2026-03-02T16:00:00",
    client: "BankPro", fileSize: "1.8 MB", pages: 14, tags: ["Banking", "Compliance", "Module"],
    starred: false, views: 6, downloads: 2, expiresAt: "2026-03-08",
    signers: [
      { name: "Trịnh Hoàng Long", email: "long@bankpro.vn", role: "CTO", status: "pending", signedAt: null, order: 1 },
      { name: "Lê Minh Cường", email: "cuong@company.com", role: "Tech Lead", status: "pending", signedAt: null, order: 2 },
    ],
    aiTags: ["Banking Regulation", "Compliance", "Custom Module"],
    aiSummary: "SOW cho compliance module: KYC verification, transaction monitoring, regulatory reporting. 8 weeks. $35K.",
    relatedDealId: null,
  },
  {
    id: "doc11", title: "NDA — SeoulTech", type: "nda", status: "expired",
    version: "v1.0", createdBy: "Hoàng Thị Mai", createdAt: "2024-03-01T10:00:00", updatedAt: "2025-03-01T00:00:00",
    client: "SeoulTech", fileSize: "0.7 MB", pages: 5, tags: ["NDA", "Korea", "Expired"],
    starred: false, views: 3, downloads: 1, expiresAt: "2025-03-01",
    signers: [
      { name: "Park Ji-yeon", email: "jiyeon@seoultech.kr", role: "CEO", status: "expired", signedAt: null, order: 1 },
    ],
    aiTags: ["Expired", "Needs Renewal", "Korea"],
    aiSummary: "NDA hết hạn 1/3/2025. Cần renew ngay nếu tiếp tục business. SeoulTech health score 62 — at risk.",
    relatedDealId: null,
  },
  {
    id: "doc12", title: "Invoice #INV-2026-0298 — RetailMax", type: "invoice", status: "signed",
    version: "v1.1", createdBy: "AI Agent — Nova", createdAt: "2026-03-01T06:00:00", updatedAt: "2026-03-01T16:00:00",
    client: "RetailMax", fileSize: "0.4 MB", pages: 2, tags: ["Invoice", "Credit Note"],
    starred: false, views: 4, downloads: 2, expiresAt: null,
    signers: [
      { name: "Auto-signed", email: "system@company.com", role: "System", status: "signed", signedAt: "2026-03-01T06:00:00", order: 1 },
    ],
    aiTags: ["Credit Note", "Billing Error Fix", "Auto-generated"],
    aiSummary: "Invoice adjusted — credit $490 cho billing error tháng 2. 7 inactive licenses bị tính dư. Đã reconcile.",
    relatedDealId: null,
  },
];

/* ============================================================
 * Chart Data
 * ============================================================ */
const TYPE_CHART = Object.entries(TYPE_CONFIG).map(([key, cfg]) => ({
  name: cfg.label,
  count: DOCUMENTS.filter((d) => d.type === key).length,
})).filter((d) => d.count > 0).sort((a, b) => b.count - a.count);
const TYPE_COLORS = ["#8b5cf6", "#3b82f6", "#f59e0b", "#22c55e", "#14b8a6", "#ec4899", "#6b7280"];

const STATUS_PIE = Object.entries(STATUS_CONFIG).map(([key, cfg]) => ({
  name: cfg.label,
  value: DOCUMENTS.filter((d) => d.status === key).length,
})).filter((d) => d.value > 0);
const STATUS_COLORS = ["#9ca3af", "#f59e0b", "#22c55e", "#ef4444", "#ef4444"];

const SIG_MONTHLY = [
  { month: "T12", sent: 8, signed: 6, pending: 2 },
  { month: "T1", sent: 12, signed: 10, pending: 1 },
  { month: "T2", sent: 10, signed: 7, pending: 2 },
  { month: "T3", sent: 6, signed: 2, pending: 4 },
];

/* ============================================================
 * Detail Modal
 * ============================================================ */
function DocDetailModal({ doc, onClose }: { doc: Document; onClose: () => void }) {
  const tCfg = TYPE_CONFIG[doc.type];
  const sCfg = STATUS_CONFIG[doc.status];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-sm px-2 py-0.5 rounded ${tCfg.color}`}>{tCfg.icon} {tCfg.label}</span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded flex items-center gap-0.5 ${sCfg.color}`}>{sCfg.icon} {sCfg.label}</span>
              <span className="text-[9px] text-gray-400">{doc.version}</span>
            </div>
            <h3 className="text-gray-900">{doc.title}</h3>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* Meta */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-[9px] text-gray-400">Khách hàng</p>
              <p className="text-xs text-gray-800">{doc.client}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-[9px] text-gray-400">Tạo bởi</p>
              <p className="text-xs text-gray-800">{doc.createdBy}</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-gray-50 rounded p-1.5">
              <p className="text-xs text-gray-900">{doc.pages}</p>
              <p className="text-[7px] text-gray-400">Trang</p>
            </div>
            <div className="bg-gray-50 rounded p-1.5">
              <p className="text-xs text-gray-900">{doc.fileSize}</p>
              <p className="text-[7px] text-gray-400">Size</p>
            </div>
            <div className="bg-gray-50 rounded p-1.5">
              <p className="text-xs text-gray-900">{doc.views}</p>
              <p className="text-[7px] text-gray-400">Lượt xem</p>
            </div>
            <div className="bg-gray-50 rounded p-1.5">
              <p className="text-xs text-gray-900">{doc.downloads}</p>
              <p className="text-[7px] text-gray-400">Downloads</p>
            </div>
          </div>

          {/* Signers */}
          {doc.signers.length > 0 && (
            <div>
              <h4 className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                <Pen className="w-3.5 h-3.5" /> E-Signature ({doc.signers.length})
              </h4>
              <div className="space-y-2">
                {doc.signers.map((s, i) => {
                  const sigCfg = SIG_CONFIG[s.status];
                  return (
                    <div key={i} className={`rounded-lg border p-2.5 ${
                      s.status === "signed" ? "border-green-200 bg-green-50/50" :
                      s.status === "declined" ? "border-red-200 bg-red-50/50" :
                      "border-gray-200"
                    }`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-gray-800">#{s.order} {s.name}</p>
                          <p className="text-[9px] text-gray-400">{s.role} · {s.email}</p>
                        </div>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded ${sigCfg.color}`}>{sigCfg.label}</span>
                      </div>
                      {s.signedAt && (
                        <p className="text-[8px] text-gray-400 mt-0.5">Ký lúc: {new Date(s.signedAt).toLocaleString("vi-VN")}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {doc.tags.map((tag) => (
              <span key={tag} className="text-[9px] px-2 py-0.5 rounded bg-gray-100 text-gray-600 flex items-center gap-0.5">
                <Tag className="w-2.5 h-2.5" /> {tag}
              </span>
            ))}
          </div>

          {/* AI Tags & Summary */}
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-lg border border-violet-100 p-3">
            <div className="flex items-center gap-1.5 flex-wrap mb-2">
              {doc.aiTags.map((tag) => (
                <span key={tag} className="text-[8px] px-1.5 py-0.5 rounded bg-violet-100 text-violet-700">{tag}</span>
              ))}
            </div>
            <p className="text-xs text-violet-800 flex items-start gap-1.5">
              <Bot className="w-3.5 h-3.5 text-violet-500 mt-0.5 flex-shrink-0" />
              <span>{doc.aiSummary}</span>
            </p>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-gray-50 rounded p-1.5">
              <p className="text-[10px] text-gray-900">{new Date(doc.createdAt).toLocaleDateString("vi-VN")}</p>
              <p className="text-[7px] text-gray-400">Tạo</p>
            </div>
            <div className="bg-gray-50 rounded p-1.5">
              <p className="text-[10px] text-gray-900">{new Date(doc.updatedAt).toLocaleDateString("vi-VN")}</p>
              <p className="text-[7px] text-gray-400">Cập nhật</p>
            </div>
            <div className={`rounded p-1.5 ${doc.expiresAt && new Date(doc.expiresAt) < new Date() ? "bg-red-50" : "bg-gray-50"}`}>
              <p className="text-[10px] text-gray-900">{doc.expiresAt ? new Date(doc.expiresAt).toLocaleDateString("vi-VN") : "—"}</p>
              <p className="text-[7px] text-gray-400">Hết hạn</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 border-t border-gray-100 flex-shrink-0">
          <button type="button" onClick={() => toast.success("Đang tải xuống...")}
            className="flex items-center gap-1 px-3 py-2 text-gray-600 text-sm hover:bg-gray-100 rounded-lg">
            <Download className="w-3.5 h-3.5" /> Tải
          </button>
          <button type="button" onClick={onClose}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">Đóng</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Create Document Modal
 * ============================================================ */
function CreateDocumentModal({ onClose, onCreated }: { onClose: () => void; onCreated: (doc: Document) => void }) {
  const [title, setTitle] = useState("");
  const [type, setType] = useState<DocType>("proposal");
  const [client, setClient] = useState("");
  const [pages, setPages] = useState(10);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [relatedDealId, setRelatedDealId] = useState("");
  const [saving, setSaving] = useState(false);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) { setTags((prev) => [...prev, t]); setTagInput(""); }
  };

  const handleSave = () => {
    if (!title.trim()) { toast.error("Vui lòng nhập tiêu đề tài liệu"); return; }
    if (!client.trim()) { toast.error("Vui lòng nhập tên khách hàng"); return; }
    setSaving(true);
    const now = new Date().toISOString();
    const newDoc: Document = {
      id: `doc_${Date.now()}`, title, type, status: "draft", version: "v0.1",
      createdBy: "Người dùng hiện tại", createdAt: now, updatedAt: now,
      client, fileSize: "0 KB", pages, tags,
      starred: false, signers: [], views: 0, downloads: 0,
      expiresAt: null, aiTags: [], aiSummary: "AI đang phân tích tài liệu...",
      relatedDealId: relatedDealId || null,
    };
    onCreated(newDoc);
    toast.success(`Đã tạo tài liệu "${title}" (bản nháp)`);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Tạo Tài liệu mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tiêu đề *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="VD: Hợp đồng TechCorp Phase 3"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Loại tài liệu</label>
              <select value={type} onChange={(e) => setType(e.target.value as DocType)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                {Object.entries(TYPE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Số trang</label>
              <input type="number" value={pages} onChange={(e) => setPages(Number(e.target.value))} min={1}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Khách hàng *</label>
            <input type="text" value={client} onChange={(e) => setClient(e.target.value)} placeholder="VD: TechCorp Inc."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Deal liên kết</label>
            <input type="text" value={relatedDealId} onChange={(e) => setRelatedDealId(e.target.value)} placeholder="VD: D-2026-0089"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tags</label>
            <div className="flex items-center gap-2">
              <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Nhập tag + Enter"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              <button type="button" onClick={addTag} className="px-3 py-2 text-sm text-violet-600 hover:bg-violet-50 rounded-lg border border-violet-200">Thêm</button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((t) => (
                  <span key={t} className="text-[9px] px-2 py-0.5 bg-violet-50 text-violet-600 rounded flex items-center gap-1">
                    {t}
                    <button type="button" onClick={() => setTags((prev) => prev.filter((x) => x !== t))} className="text-violet-400 hover:text-violet-700">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="bg-violet-50 rounded-lg p-3 border border-violet-100">
            <p className="text-[10px] text-violet-700 flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI sẽ tự động phân loại, tạo AI tags, và tóm tắt nội dung sau khi upload file.</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo tài liệu"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function DocumentManagementPage() {
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<DocType | "">("");
  const [filterStatus, setFilterStatus] = useState<DocStatus | "">("");
  const [documents, setDocuments] = useState(DOCUMENTS);
  const [showCreateDoc, setShowCreateDoc] = useState(false);

  const stats = useMemo(() => ({
    total: documents.length,
    pendingSig: documents.filter((d) => d.status === "pending-signature").length,
    signed: documents.filter((d) => d.status === "signed").length,
    expiringSoon: documents.filter((d) => d.expiresAt && new Date(d.expiresAt) <= new Date("2026-03-10") && d.status !== "signed" && d.status !== "rejected").length,
  }), [documents]);

  const filtered = useMemo(() => {
    let result = [...documents];
    if (filterType) result = result.filter((d) => d.type === filterType);
    if (filterStatus) result = result.filter((d) => d.status === filterStatus);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((d) =>
        d.title.toLowerCase().includes(q) || d.client.toLowerCase().includes(q) ||
        d.tags.some((t) => t.toLowerCase().includes(q)));
    }
    return result.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [documents, filterType, filterStatus, search]);

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-violet-600" /> Quản lý Tài liệu
          </h1>
          <p className="text-gray-500 mt-0.5">
            Document library, e-signature tracking, version control, AI auto-tagging
          </p>
        </div>
        <button type="button" onClick={() => setShowCreateDoc(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">
          <FilePlus className="w-4 h-4" /> Tạo mới
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <FolderOpen className="w-4 h-4 text-violet-500 mb-1" />
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Tổng tài liệu</p>
        </div>
        <div className={`rounded-xl border p-3 ${stats.pendingSig > 0 ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}`}>
          <Pen className="w-4 h-4 text-amber-500 mb-1" />
          <p className="text-lg text-gray-900">{stats.pendingSig}</p>
          <p className="text-xs text-gray-600">Chờ e-signature</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-3">
          <p className="text-lg text-green-600">{stats.signed}</p>
          <p className="text-xs text-green-700">Đã ký hoàn tất</p>
        </div>
        <div className={`rounded-xl border p-3 ${stats.expiringSoon > 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
          <Clock className="w-4 h-4 text-red-500 mb-1" />
          <p className="text-lg text-gray-900">{stats.expiringSoon}</p>
          <p className="text-xs text-gray-600">Sắp hết hạn</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4">
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
          <h3 className="text-sm text-gray-800 mb-3">Trạng thái</h3>
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
          <h3 className="text-sm text-gray-800 mb-3">E-Signature theo Tháng</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={SIG_MONTHLY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 9 }} />
              <Line type="monotone" dataKey="sent" name="Gửi" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="signed" name="Đã ký" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="pending" name="Chờ" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            {(["", "pending-signature", "draft", "signed", "expired", "rejected"] as (DocStatus | "")[]).map((s) => (
              <button key={s} type="button" onClick={() => setFilterStatus(s)}
                className={`px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                  filterStatus === s ? "bg-violet-600 text-white" : "text-gray-500 hover:bg-gray-100"
                }`}>
                {s === "" ? "Tất cả" : STATUS_CONFIG[s].label}
              </button>
            ))}
          </div>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value as DocType | "")}
            className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm">
            <option value="">Tất cả loại</option>
            {Object.entries(TYPE_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.icon} {cfg.label}</option>
            ))}
          </select>
          <div className="relative flex-1 min-w-[150px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Tìm tài liệu, khách hàng, tag..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
        </div>
      </div>

      {/* Document List */}
      <div className="space-y-2">
        {filtered.map((doc) => {
          const tCfg = TYPE_CONFIG[doc.type];
          const sCfg = STATUS_CONFIG[doc.status];
          const pendingSigners = doc.signers.filter((s) => s.status === "pending").length;
          return (
            <div key={doc.id}
              className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow cursor-pointer"
              onClick={() => setSelectedDoc(doc)}>
              <div className="flex items-start gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm flex-shrink-0 ${tCfg.color}`}>
                  {tCfg.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className={`text-[8px] px-1.5 py-0.5 rounded flex items-center gap-0.5 ${sCfg.color}`}>
                      {sCfg.icon} {sCfg.label}
                    </span>
                    <span className="text-[8px] text-gray-300">{doc.version}</span>
                    {doc.starred && <Star className="w-3 h-3 text-amber-400 fill-amber-400" />}
                    {pendingSigners > 0 && (
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-600 flex items-center gap-0.5">
                        <Pen className="w-2.5 h-2.5" /> {pendingSigners} chờ ký
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-900 line-clamp-1">{doc.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-400">
                    <span className="flex items-center gap-0.5"><Building2 className="w-2.5 h-2.5" /> {doc.client}</span>
                    <span>{doc.createdBy}</span>
                    <span>{doc.pages} trang · {doc.fileSize}</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                    {doc.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="text-[7px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{tag}</span>
                    ))}
                    {doc.tags.length > 3 && <span className="text-[7px] text-gray-300">+{doc.tags.length - 3}</span>}
                  </div>
                </div>
                <div className="text-right flex-shrink-0 text-[9px] text-gray-400">
                  <p>{new Date(doc.updatedAt).toLocaleDateString("vi-VN")}</p>
                  {doc.expiresAt && new Date(doc.expiresAt) < new Date("2026-03-10") && doc.status !== "signed" && (
                    <p className="text-red-500 flex items-center gap-0.5 justify-end mt-0.5">
                      <AlertTriangle className="w-2.5 h-2.5" /> Sắp hết hạn
                    </p>
                  )}
                  <p className="mt-0.5"><Eye className="w-2.5 h-2.5 inline" /> {doc.views}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Không tìm thấy tài liệu phù hợp</p>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Document Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            3 tài liệu chờ e-signature. HĐ TechCorp ($120K) cần CEO ký trước 10/3. CloudStack proposal cần CFO + CEO ký.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            NDA SeoulTech hết hạn 1 năm rồi chưa renew. Health score 62 — cần renew NDA trước khi discuss renewal.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            AI auto-generated 2 invoices tháng này. MSA template v4.2 được dùng 22 lần — most popular template.
          </p>
        </div>
      </div>

      {selectedDoc && <DocDetailModal doc={selectedDoc} onClose={() => setSelectedDoc(null)} />}
      {showCreateDoc && <CreateDocumentModal onClose={() => setShowCreateDoc(false)} onCreated={(doc) => setDocuments((prev) => [doc, ...prev])} />}
    </div>
  );
}