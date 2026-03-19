/**
 * Trang Data Import/Export Center — Nhập xuất dữ liệu CRM hàng loạt.
 * Import wizard (CSV/Excel), export templates, job history,
 * field mapping, validation preview, scheduled exports, AI data cleaning.
 * Phase 1: Mock data + interactive import/export UI + job list.
 */
import { useState, useMemo, useCallback } from "react";
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  FileSpreadsheet,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  X,
  Bot,
  Sparkles,
  Upload,
  Download,
  AlertTriangle,
  RotateCcw,
  Play,
  Pause,
  Trash2,
  Eye,
  Database,
  Table2,
  FileDown,
  FileUp,
  Filter,
  Settings,
  Calendar,
  Users,
  Briefcase,
  Package,
  Mail,
  BarChart3,
  Zap,
  Shield,
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
type JobType = "import" | "export";
type JobStatus = "completed" | "running" | "failed" | "queued" | "scheduled";
type DataEntity = "contacts" | "deals" | "companies" | "activities" | "products" | "tickets" | "contracts";
type FileFormat = "csv" | "xlsx" | "json" | "pdf";

interface DataJob {
  id: string;
  type: JobType;
  entity: DataEntity;
  format: FileFormat;
  fileName: string;
  status: JobStatus;
  totalRecords: number;
  processedRecords: number;
  errorRecords: number;
  createdBy: string;
  createdAt: string;
  completedAt: string | null;
  duration: number | null;
  fileSize: string;
  errors: string[];
  scheduled: boolean;
  scheduleFrequency: string | null;
}

interface ExportTemplate {
  id: string;
  name: string;
  entity: DataEntity;
  format: FileFormat;
  fields: number;
  filters: string;
  lastUsed: string;
  usageCount: number;
}

/* ============================================================
 * Constants
 * ============================================================ */
const ENTITY_CONFIG: Record<DataEntity, { label: string; icon: React.ReactNode; color: string }> = {
  contacts: { label: "Liên hệ", icon: <Users className="w-3.5 h-3.5" />, color: "bg-blue-50 text-blue-700" },
  deals: { label: "Deals", icon: <Briefcase className="w-3.5 h-3.5" />, color: "bg-green-50 text-green-700" },
  companies: { label: "Công ty", icon: <Database className="w-3.5 h-3.5" />, color: "bg-violet-50 text-violet-700" },
  activities: { label: "Hoạt động", icon: <Calendar className="w-3.5 h-3.5" />, color: "bg-amber-50 text-amber-700" },
  products: { label: "Sản phẩm", icon: <Package className="w-3.5 h-3.5" />, color: "bg-pink-50 text-pink-700" },
  tickets: { label: "Tickets", icon: <Mail className="w-3.5 h-3.5" />, color: "bg-orange-50 text-orange-700" },
  contracts: { label: "Hợp đồng", icon: <FileText className="w-3.5 h-3.5" />, color: "bg-teal-50 text-teal-700" },
};

const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; icon: React.ReactNode }> = {
  completed: { label: "Hoàn thành", color: "text-green-600 bg-green-50", icon: <CheckCircle2 className="w-3 h-3" /> },
  running: { label: "Đang chạy", color: "text-blue-600 bg-blue-50", icon: <Play className="w-3 h-3" /> },
  failed: { label: "Lỗi", color: "text-red-600 bg-red-50", icon: <XCircle className="w-3 h-3" /> },
  queued: { label: "Đang chờ", color: "text-amber-600 bg-amber-50", icon: <Clock className="w-3 h-3" /> },
  scheduled: { label: "Đã lên lịch", color: "text-violet-600 bg-violet-50", icon: <Calendar className="w-3 h-3" /> },
};

const FORMAT_CONFIG: Record<FileFormat, { label: string; icon: string }> = {
  csv: { label: "CSV", icon: "📄" },
  xlsx: { label: "Excel", icon: "📊" },
  json: { label: "JSON", icon: "📋" },
  pdf: { label: "PDF", icon: "📕" },
};

/* ============================================================
 * Mock Data — 12 jobs
 * ============================================================ */
const JOBS: DataJob[] = [
  {
    id: "j1", type: "import", entity: "contacts", format: "csv",
    fileName: "hubspot_contacts_export.csv", status: "completed",
    totalRecords: 2450, processedRecords: 2438, errorRecords: 12,
    createdBy: "Nguyễn Hoàng Nam", createdAt: "2026-03-03T09:30:00", completedAt: "2026-03-03T09:35:42",
    duration: 342, fileSize: "4.8 MB", scheduled: false, scheduleFrequency: null,
    errors: ["12 bản ghi thiếu email (bắt buộc)", "3 duplicate phone numbers đã merge tự động"],
  },
  {
    id: "j2", type: "export", entity: "deals", format: "xlsx",
    fileName: "pipeline_report_Q1_2026.xlsx", status: "completed",
    totalRecords: 186, processedRecords: 186, errorRecords: 0,
    createdBy: "Hoàng Thị Mai", createdAt: "2026-03-03T08:00:00", completedAt: "2026-03-03T08:01:15",
    duration: 75, fileSize: "2.1 MB", scheduled: false, scheduleFrequency: null,
    errors: [],
  },
  {
    id: "j3", type: "import", entity: "companies", format: "xlsx",
    fileName: "company_list_2026.xlsx", status: "running",
    totalRecords: 580, processedRecords: 342, errorRecords: 5,
    createdBy: "Lê Minh Cường", createdAt: "2026-03-03T10:15:00", completedAt: null,
    duration: null, fileSize: "1.2 MB", scheduled: false, scheduleFrequency: null,
    errors: ["5 bản ghi thiếu tên công ty"],
  },
  {
    id: "j4", type: "export", entity: "contacts", format: "csv",
    fileName: "active_contacts_full.csv", status: "scheduled",
    totalRecords: 0, processedRecords: 0, errorRecords: 0,
    createdBy: "AI Agent — Nova", createdAt: "2026-03-01T00:00:00", completedAt: null,
    duration: null, fileSize: "—", scheduled: true, scheduleFrequency: "Hàng tuần (Thứ 2, 6:00)",
    errors: [],
  },
  {
    id: "j5", type: "import", entity: "activities", format: "csv",
    fileName: "salesforce_activities.csv", status: "failed",
    totalRecords: 1200, processedRecords: 856, errorRecords: 344,
    createdBy: "Trần Đức Hùng", createdAt: "2026-03-02T14:00:00", completedAt: "2026-03-02T14:08:30",
    duration: 510, fileSize: "3.5 MB", scheduled: false, scheduleFrequency: null,
    errors: ["344 bản ghi có contact_id không tồn tại", "Date format không thống nhất (MM/DD vs DD/MM)", "Stopped: error rate vượt 25% threshold"],
  },
  {
    id: "j6", type: "export", entity: "activities", format: "pdf",
    fileName: "activity_report_feb_2026.pdf", status: "completed",
    totalRecords: 3200, processedRecords: 3200, errorRecords: 0,
    createdBy: "Hoàng Thị Mai", createdAt: "2026-03-01T17:00:00", completedAt: "2026-03-01T17:02:45",
    duration: 165, fileSize: "8.7 MB", scheduled: false, scheduleFrequency: null,
    errors: [],
  },
  {
    id: "j7", type: "import", entity: "products", format: "xlsx",
    fileName: "product_catalog_update.xlsx", status: "completed",
    totalRecords: 45, processedRecords: 45, errorRecords: 0,
    createdBy: "Đỗ Hải Yến", createdAt: "2026-02-28T10:00:00", completedAt: "2026-02-28T10:00:28",
    duration: 28, fileSize: "0.3 MB", scheduled: false, scheduleFrequency: null,
    errors: [],
  },
  {
    id: "j8", type: "export", entity: "tickets", format: "xlsx",
    fileName: "open_tickets_report.xlsx", status: "scheduled",
    totalRecords: 0, processedRecords: 0, errorRecords: 0,
    createdBy: "AI Agent — Nova", createdAt: "2026-03-01T00:00:00", completedAt: null,
    duration: null, fileSize: "—", scheduled: true, scheduleFrequency: "Hàng ngày (7:00)",
    errors: [],
  },
  {
    id: "j9", type: "export", entity: "companies", format: "json",
    fileName: "companies_api_backup.json", status: "completed",
    totalRecords: 128, processedRecords: 128, errorRecords: 0,
    createdBy: "Lê Minh Cường", createdAt: "2026-02-27T22:00:00", completedAt: "2026-02-27T22:00:45",
    duration: 45, fileSize: "1.8 MB", scheduled: false, scheduleFrequency: null,
    errors: [],
  },
  {
    id: "j10", type: "import", entity: "deals", format: "csv",
    fileName: "legacy_deals_migration.csv", status: "completed",
    totalRecords: 320, processedRecords: 312, errorRecords: 8,
    createdBy: "Nguyễn Văn An", createdAt: "2026-02-25T09:00:00", completedAt: "2026-02-25T09:04:12",
    duration: 252, fileSize: "2.4 MB", scheduled: false, scheduleFrequency: null,
    errors: ["8 deals thiếu stage mapping — đã gán 'New' mặc định"],
  },
  {
    id: "j11", type: "export", entity: "contracts", format: "pdf",
    fileName: "active_contracts_summary.pdf", status: "queued",
    totalRecords: 0, processedRecords: 0, errorRecords: 0,
    createdBy: "Phạm Thanh Tùng", createdAt: "2026-03-03T10:20:00", completedAt: null,
    duration: null, fileSize: "—", scheduled: false, scheduleFrequency: null,
    errors: [],
  },
  {
    id: "j12", type: "import", entity: "contacts", format: "json",
    fileName: "api_webhook_contacts.json", status: "completed",
    totalRecords: 85, processedRecords: 85, errorRecords: 0,
    createdBy: "AI Agent — Nova", createdAt: "2026-03-03T06:00:00", completedAt: "2026-03-03T06:00:12",
    duration: 12, fileSize: "0.5 MB", scheduled: true, scheduleFrequency: "Hàng ngày (6:00)",
    errors: [],
  },
];

const EXPORT_TEMPLATES: ExportTemplate[] = [
  { id: "et1", name: "Danh sách KH Active", entity: "contacts", format: "csv", fields: 15, filters: "status = active", lastUsed: "2026-03-02", usageCount: 24 },
  { id: "et2", name: "Pipeline Q1 Report", entity: "deals", format: "xlsx", fields: 22, filters: "created >= 2026-01-01", lastUsed: "2026-03-03", usageCount: 8 },
  { id: "et3", name: "Hợp đồng sắp hết hạn", entity: "contracts", format: "pdf", fields: 12, filters: "end_date <= 90 ngày", lastUsed: "2026-02-28", usageCount: 6 },
  { id: "et4", name: "Sản phẩm Full Catalog", entity: "products", format: "xlsx", fields: 18, filters: "all", lastUsed: "2026-02-28", usageCount: 3 },
  { id: "et5", name: "Activity Log tháng", entity: "activities", format: "csv", fields: 10, filters: "last 30 days", lastUsed: "2026-03-01", usageCount: 12 },
  { id: "et6", name: "API Backup — Companies", entity: "companies", format: "json", fields: 25, filters: "all", lastUsed: "2026-02-27", usageCount: 15 },
];

/* ============================================================
 * Chart Data
 * ============================================================ */
const VOLUME_BY_ENTITY = Object.entries(ENTITY_CONFIG).map(([key, cfg]) => ({
  name: cfg.label,
  imports: JOBS.filter((j) => j.type === "import" && j.entity === key).reduce((s, j) => s + j.totalRecords, 0),
  exports: JOBS.filter((j) => j.type === "export" && j.entity === key).reduce((s, j) => s + j.totalRecords, 0),
})).filter((d) => d.imports > 0 || d.exports > 0);

const WEEKLY_TREND = [
  { week: "W7", imports: 1200, exports: 2800 },
  { week: "W8", imports: 2450, exports: 3500 },
  { week: "W9", imports: 580, exports: 1800 },
  { week: "W10", imports: 2855, exports: 3514 },
];

/* ============================================================
 * Job Detail Modal
 * ============================================================ */
function JobDetailModal({ job, onClose }: { job: DataJob; onClose: () => void }) {
  const sCfg = STATUS_CONFIG[job.status];
  const eCfg = ENTITY_CONFIG[job.entity];
  const fCfg = FORMAT_CONFIG[job.format];
  const progress = job.totalRecords > 0 ? Math.round((job.processedRecords / job.totalRecords) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              job.type === "import" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
            }`}>
              {job.type === "import" ? <ArrowDownToLine className="w-5 h-5" /> : <ArrowUpFromLine className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-gray-900">{job.type === "import" ? "Import" : "Export"} — {eCfg.label}</h3>
              <p className="text-xs text-gray-400">{job.fileName}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* Status & Format */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[9px] px-2 py-0.5 rounded flex items-center gap-0.5 ${sCfg.color}`}>
              {sCfg.icon} {sCfg.label}
            </span>
            <span className={`text-[9px] px-2 py-0.5 rounded ${eCfg.color}`}>{eCfg.label}</span>
            <span className="text-[9px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">{fCfg.icon} {fCfg.label}</span>
            {job.scheduled && (
              <span className="text-[9px] px-2 py-0.5 rounded bg-violet-50 text-violet-700">🔄 {job.scheduleFrequency}</span>
            )}
          </div>

          {/* Progress */}
          {job.totalRecords > 0 && (
            <div>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Tiến độ</span>
                <span>{job.processedRecords.toLocaleString()} / {job.totalRecords.toLocaleString()} ({progress}%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div className={`h-2.5 rounded-full transition-all ${
                  job.status === "failed" ? "bg-red-500" :
                  job.status === "completed" ? "bg-green-500" : "bg-blue-500"
                }`} style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-green-50 rounded-lg p-2 text-center">
              <p className="text-sm text-green-600">{(job.processedRecords - job.errorRecords).toLocaleString()}</p>
              <p className="text-[8px] text-gray-400">Thành công</p>
            </div>
            <div className={`rounded-lg p-2 text-center ${job.errorRecords > 0 ? "bg-red-50" : "bg-gray-50"}`}>
              <p className={`text-sm ${job.errorRecords > 0 ? "text-red-600" : "text-gray-400"}`}>{job.errorRecords}</p>
              <p className="text-[8px] text-gray-400">Lỗi</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-sm text-gray-900">{job.fileSize}</p>
              <p className="text-[8px] text-gray-400">Dung lượng</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-sm text-gray-900">{job.duration ? `${job.duration}s` : "—"}</p>
              <p className="text-[8px] text-gray-400">Thời gian</p>
            </div>
          </div>

          {/* Người tạo & thời gian */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-[9px] text-gray-400">Người tạo</p>
              <p className="text-xs text-gray-800">{job.createdBy}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2.5">
              <p className="text-[9px] text-gray-400">Thời gian tạo</p>
              <p className="text-xs text-gray-800">{new Date(job.createdAt).toLocaleString("vi-VN")}</p>
            </div>
          </div>

          {/* Errors */}
          {job.errors.length > 0 && (
            <div className="bg-red-50 rounded-lg border border-red-100 p-3">
              <h4 className="text-xs text-red-700 mb-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" /> Chi tiết lỗi ({job.errors.length})
              </h4>
              <ul className="space-y-1">
                {job.errors.map((err, i) => (
                  <li key={i} className="text-xs text-red-600 flex items-start gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-400 mt-1.5 flex-shrink-0" /> {err}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* AI Suggestion */}
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-lg border border-violet-100 p-3">
            <p className="text-xs text-violet-800 flex items-start gap-1.5">
              <Bot className="w-3.5 h-3.5 text-violet-500 mt-0.5 flex-shrink-0" />
              <span>
                <span className="text-violet-900">AI Data Quality:</span>{" "}
                {job.errorRecords > 0
                  ? `Phát hiện ${job.errorRecords} lỗi. Đề xuất: validate data trước khi import, sử dụng template chuẩn để tránh format issues.`
                  : job.status === "scheduled"
                  ? "Job tự động đang hoạt động ổn định. Dữ liệu được đồng bộ đúng lịch."
                  : "Import/Export thành công, không có lỗi. Dữ liệu đã được validate tự động."}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end p-4 border-t border-gray-100 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">Đóng</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Import Wizard Modal (simplified)
 * ============================================================ */
function ImportWizardModal({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [entity, setEntity] = useState<DataEntity>("contacts");
  const [format, setFormat] = useState<FileFormat>("csv");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900 flex items-center gap-2">
            <ArrowDownToLine className="w-5 h-5 text-blue-600" /> Import Wizard
          </h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Steps indicator */}
          <div className="flex items-center gap-2 justify-center">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                  step === s ? "bg-violet-600 text-white" : step > s ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
                }`}>{step > s ? "✓" : s}</div>
                {s < 3 && <div className={`w-8 h-0.5 ${step > s ? "bg-green-500" : "bg-gray-200"}`} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Chọn loại dữ liệu cần import:</p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.entries(ENTITY_CONFIG) as [DataEntity, typeof ENTITY_CONFIG[DataEntity]][]).map(([key, cfg]) => (
                  <button key={key} type="button" onClick={() => setEntity(key)}
                    className={`p-3 rounded-lg border text-sm text-left flex items-center gap-2 transition-colors ${
                      entity === key ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 hover:bg-gray-50"
                    }`}>
                    {cfg.icon} {cfg.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Chọn định dạng file:</p>
              <div className="grid grid-cols-2 gap-2">
                {(["csv", "xlsx", "json"] as FileFormat[]).map((f) => (
                  <button key={f} type="button" onClick={() => setFormat(f)}
                    className={`p-3 rounded-lg border text-sm flex items-center gap-2 transition-colors ${
                      format === f ? "border-violet-500 bg-violet-50 text-violet-700" : "border-gray-200 hover:bg-gray-50"
                    }`}>
                    {FORMAT_CONFIG[f].icon} {FORMAT_CONFIG[f].label}
                  </button>
                ))}
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-violet-400 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Kéo thả file hoặc click để chọn</p>
                <p className="text-[9px] text-gray-400 mt-1">Hỗ trợ: CSV, XLSX, JSON · Tối đa 50MB</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <div className="bg-green-50 rounded-lg border border-green-100 p-4 text-center">
                <CheckCircle2 className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-gray-800">Sẵn sàng import</p>
                <p className="text-xs text-gray-500 mt-1">
                  {ENTITY_CONFIG[entity].label} · {FORMAT_CONFIG[format].label}
                </p>
              </div>
              <div className="bg-violet-50 rounded-lg p-3 text-sm text-violet-800">
                <Bot className="w-4 h-4 text-violet-500 inline mr-1" />
                AI sẽ tự động: validate fields, detect duplicates, clean data formats, map columns.
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between p-4 border-t border-gray-100">
          <button type="button" onClick={() => step > 1 ? setStep(step - 1) : onClose()}
            className="px-3 py-2 text-gray-500 text-sm hover:text-gray-700">
            {step === 1 ? "Huỷ" : "Quay lại"}
          </button>
          <button type="button" onClick={() => {
            if (step < 3) { setStep(step + 1); }
            else { toast.success(`Import ${ENTITY_CONFIG[entity].label} đã được tạo`); onClose(); }
          }}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">
            {step < 3 ? "Tiếp tục" : "Bắt đầu Import"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function DataImportExportPage() {
  const [selectedJob, setSelectedJob] = useState<DataJob | null>(null);
  const [showImportWizard, setShowImportWizard] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<JobType | "">("");
  const [filterStatus, setFilterStatus] = useState<JobStatus | "">("");
  const [activeTab, setActiveTab] = useState<"jobs" | "templates">("jobs");

  const stats = useMemo(() => {
    const totalImported = JOBS.filter((j) => j.type === "import" && j.status === "completed").reduce((s, j) => s + j.processedRecords, 0);
    const totalExported = JOBS.filter((j) => j.type === "export" && j.status === "completed").reduce((s, j) => s + j.processedRecords, 0);
    const totalErrors = JOBS.reduce((s, j) => s + j.errorRecords, 0);
    const scheduled = JOBS.filter((j) => j.scheduled).length;
    return { totalImported, totalExported, totalErrors, scheduled };
  }, []);

  const filtered = useMemo(() => {
    let result = [...JOBS];
    if (filterType) result = result.filter((j) => j.type === filterType);
    if (filterStatus) result = result.filter((j) => j.status === filterStatus);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((j) => j.fileName.toLowerCase().includes(q) || j.createdBy.toLowerCase().includes(q));
    }
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [filterType, filterStatus, search]);

  return (
    <div className="space-y-5">
      <header className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Database className="w-6 h-6 text-violet-600" /> Nhập / Xuất Dữ liệu
          </h1>
          <p className="text-gray-500 mt-0.5">
            Import wizard, export templates, scheduled jobs, AI data validation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => toast.success("Export template đã mở")}
            className="flex items-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm hover:bg-green-100 border border-green-200">
            <ArrowUpFromLine className="w-4 h-4" /> Xuất nhanh
          </button>
          <button type="button" onClick={() => setShowImportWizard(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">
            <ArrowDownToLine className="w-4 h-4" /> Import mới
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-3">
          <ArrowDownToLine className="w-4 h-4 text-blue-500 mb-1" />
          <p className="text-lg text-gray-900">{stats.totalImported.toLocaleString()}</p>
          <p className="text-xs text-blue-700">Bản ghi imported</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-3">
          <ArrowUpFromLine className="w-4 h-4 text-green-500 mb-1" />
          <p className="text-lg text-gray-900">{stats.totalExported.toLocaleString()}</p>
          <p className="text-xs text-green-700">Bản ghi exported</p>
        </div>
        <div className={`rounded-xl border p-3 ${stats.totalErrors > 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
          <p className={`text-lg ${stats.totalErrors > 0 ? "text-red-600" : "text-green-600"}`}>{stats.totalErrors}</p>
          <p className="text-xs text-gray-600">Tổng lỗi</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-3">
          <p className="text-lg text-gray-900">{stats.scheduled}</p>
          <p className="text-xs text-violet-700">Scheduled jobs</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3">Volume theo Loại dữ liệu</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={VOLUME_BY_ENTITY}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="imports" name="Import" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="exports" name="Export" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3">Trend tuần (bản ghi)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={WEEKLY_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="imports" name="Import" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="exports" name="Export" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200">
        <button type="button" onClick={() => setActiveTab("jobs")}
          className={`px-4 py-2.5 text-sm border-b-2 transition-colors ${
            activeTab === "jobs" ? "border-violet-600 text-violet-700" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}>
          Lịch sử Jobs ({JOBS.length})
        </button>
        <button type="button" onClick={() => setActiveTab("templates")}
          className={`px-4 py-2.5 text-sm border-b-2 transition-colors ${
            activeTab === "templates" ? "border-violet-600 text-violet-700" : "border-transparent text-gray-500 hover:text-gray-700"
          }`}>
          Export Templates ({EXPORT_TEMPLATES.length})
        </button>
      </div>

      {activeTab === "jobs" && (
        <>
          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-100 p-3">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1">
                {(["", "import", "export"] as (JobType | "")[]).map((t) => (
                  <button key={t} type="button" onClick={() => setFilterType(t)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                      filterType === t ? "bg-violet-600 text-white" : "text-gray-500 hover:bg-gray-100"
                    }`}>
                    {t === "" ? "Tất cả" : t === "import" ? "Import" : "Export"}
                  </button>
                ))}
              </div>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as JobStatus | "")}
                className="px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                <option value="">Tất cả trạng thái</option>
                {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
              <div className="relative flex-1 min-w-[150px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Tìm file, người tạo..."
                  value={search} onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
            </div>
          </div>

          {/* Job List */}
          <div className="space-y-2">
            {filtered.map((job) => {
              const sCfg = STATUS_CONFIG[job.status];
              const eCfg = ENTITY_CONFIG[job.entity];
              const fCfg = FORMAT_CONFIG[job.format];
              const progress = job.totalRecords > 0 ? Math.round((job.processedRecords / job.totalRecords) * 100) : 0;

              return (
                <div key={job.id}
                  className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow cursor-pointer"
                  onClick={() => setSelectedJob(job)}>
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      job.type === "import" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                    }`}>
                      {job.type === "import" ? <ArrowDownToLine className="w-4 h-4" /> : <ArrowUpFromLine className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-0.5">
                        <span className={`text-[8px] px-1.5 py-0.5 rounded flex items-center gap-0.5 ${sCfg.color}`}>
                          {sCfg.icon} {sCfg.label}
                        </span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded ${eCfg.color}`}>{eCfg.label}</span>
                        <span className="text-[8px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{fCfg.icon} {fCfg.label}</span>
                        {job.scheduled && <span className="text-[8px] px-1.5 py-0.5 rounded bg-violet-50 text-violet-600">🔄 Scheduled</span>}
                      </div>
                      <p className="text-sm text-gray-900 line-clamp-1">{job.fileName}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">
                        {job.createdBy} · {new Date(job.createdAt).toLocaleString("vi-VN")} · {job.fileSize}
                      </p>
                      {job.status === "running" && (
                        <div className="w-full bg-gray-100 rounded-full h-1.5 mt-1.5">
                          <div className="h-1.5 rounded-full bg-blue-500 animate-pulse" style={{ width: `${progress}%` }} />
                        </div>
                      )}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs text-gray-900">{job.totalRecords > 0 ? job.totalRecords.toLocaleString() : "—"}</p>
                      {job.errorRecords > 0 && (
                        <p className="text-[9px] text-red-500">{job.errorRecords} lỗi</p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === "templates" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {EXPORT_TEMPLATES.map((tpl) => {
            const eCfg = ENTITY_CONFIG[tpl.entity];
            const fCfg = FORMAT_CONFIG[tpl.format];
            return (
              <div key={tpl.id}
                className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow cursor-pointer"
                onClick={() => toast.success(`Đang xuất "${tpl.name}"...`)}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileDown className="w-5 h-5 text-green-500" />
                    <h4 className="text-sm text-gray-900">{tpl.name}</h4>
                  </div>
                  <span className="text-[8px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{fCfg.icon} {fCfg.label}</span>
                </div>
                <div className="flex items-center gap-2 text-[9px] text-gray-400 mb-2">
                  <span className={`px-1.5 py-0.5 rounded ${eCfg.color}`}>{eCfg.label}</span>
                  <span>{tpl.fields} fields</span>
                  <span>·</span>
                  <span>{tpl.filters}</span>
                </div>
                <div className="flex items-center justify-between text-[9px] text-gray-400">
                  <span>Dùng {tpl.usageCount} lần</span>
                  <span>Gần nhất: {new Date(tpl.lastUsed).toLocaleDateString("vi-VN")}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length === 0 && activeTab === "jobs" && (
        <div className="text-center py-12 text-gray-400">
          <Database className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Không tìm thấy job phù hợp</p>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Data Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            Import activities thất bại (344 lỗi). Nguyên nhân: contact_id orphan. Cần import contacts trước activities.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            3 scheduled jobs hoạt động ổn. AI tự động clean 23 duplicates và normalize 156 phone numbers tuần qua.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            HubSpot migration hoàn tất: 2438/2450 contacts. 12 còn lại thiếu email — đề xuất manual review.
          </p>
        </div>
      </div>

      {selectedJob && <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
      {showImportWizard && <ImportWizardModal onClose={() => setShowImportWizard(false)} />}
    </div>
  );
}
