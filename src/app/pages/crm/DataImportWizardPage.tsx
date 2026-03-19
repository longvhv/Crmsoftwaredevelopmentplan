/**
 * Data Import Wizard
 * Wizard 5 bước nhập dữ liệu CSV/Excel vào CRM:
 * 1. Upload & chọn module đích
 * 2. Preview dữ liệu thô
 * 3. Mapping cột → trường CRM
 * 4. Validation & xử lý conflict
 * 5. Xác nhận & import
 */
import { useState, useMemo, useCallback } from "react";
import {
  Upload,
  FileSpreadsheet,
  FileText,
  ArrowRight,
  ArrowLeft,
  Check,
  X,
  AlertTriangle,
  Info,
  Search,
  ChevronDown,
  Loader2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Sparkles,
  Bot,
  Zap,
  Eye,
  Download,
  Shield,
  Table2,
  Columns3,
  ScanSearch,
  Import,
  Trash2,
  Copy,
  Users,
  Contact2,
  Kanban,
  Building2,
  Package,
  Ticket,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
type ImportStep = 1 | 2 | 3 | 4 | 5;

type ImportModule = "contacts" | "companies" | "deals" | "products" | "tickets";

type MappingStatus = "mapped" | "unmapped" | "ignored" | "ai-suggested";

type ConflictStrategy = "skip" | "overwrite" | "merge" | "create_new";

interface CrmField {
  key: string;
  label: string;
  type: string;
  required: boolean;
  example: string;
}

interface ColumnMapping {
  sourceColumn: string;
  targetField: string | null;
  status: MappingStatus;
  preview: string[];
  aiConfidence?: number;
}

interface ValidationIssue {
  row: number;
  column: string;
  value: string;
  issue: string;
  severity: "error" | "warning" | "info";
  suggestion: string;
}

/* ============================================================
 * Constants
 * ============================================================ */
const IMPORT_MODULES: { key: ImportModule; label: string; icon: React.ComponentType<{ className?: string }>; color: string; description: string }[] = [
  { key: "contacts", label: "Liên hệ", icon: Contact2, color: "text-blue-600 bg-blue-50", description: "Import contacts, leads, khách hàng" },
  { key: "companies", label: "Công ty", icon: Building2, color: "text-violet-600 bg-violet-50", description: "Import tổ chức, doanh nghiệp" },
  { key: "deals", label: "Deals", icon: Kanban, color: "text-green-600 bg-green-50", description: "Import deals, cơ hội kinh doanh" },
  { key: "products", label: "Sản phẩm", icon: Package, color: "text-amber-600 bg-amber-50", description: "Import sản phẩm, dịch vụ" },
  { key: "tickets", label: "Tickets", icon: Ticket, color: "text-red-600 bg-red-50", description: "Import ticket hỗ trợ" },
];

const CRM_FIELDS: Record<ImportModule, CrmField[]> = {
  contacts: [
    { key: "first_name", label: "Họ", type: "text", required: true, example: "Nguyễn" },
    { key: "last_name", label: "Tên", type: "text", required: true, example: "Văn An" },
    { key: "email", label: "Email", type: "email", required: true, example: "an@company.vn" },
    { key: "phone", label: "Số điện thoại", type: "phone", required: false, example: "+84901234567" },
    { key: "company", label: "Công ty", type: "text", required: false, example: "TechCorp" },
    { key: "position", label: "Chức vụ", type: "text", required: false, example: "Giám đốc" },
    { key: "lead_source", label: "Nguồn lead", type: "select", required: false, example: "Website" },
    { key: "lead_score", label: "Lead Score", type: "number", required: false, example: "75" },
    { key: "tags", label: "Tags", type: "tags", required: false, example: "VIP, Hot" },
    { key: "address", label: "Địa chỉ", type: "text", required: false, example: "123 Nguyễn Huệ, Q1" },
    { key: "city", label: "Thành phố", type: "text", required: false, example: "Hồ Chí Minh" },
    { key: "notes", label: "Ghi chú", type: "textarea", required: false, example: "Khách VIP" },
  ],
  companies: [
    { key: "name", label: "Tên công ty", type: "text", required: true, example: "TechCorp" },
    { key: "domain", label: "Website", type: "url", required: false, example: "techcorp.vn" },
    { key: "industry", label: "Ngành nghề", type: "select", required: false, example: "Công nghệ" },
    { key: "size", label: "Quy mô", type: "select", required: false, example: "50-200" },
    { key: "revenue", label: "Doanh thu", type: "number", required: false, example: "10000000000" },
    { key: "phone", label: "Số điện thoại", type: "phone", required: false, example: "+84281234567" },
    { key: "address", label: "Địa chỉ", type: "text", required: false, example: "Tòa nhà ABC" },
  ],
  deals: [
    { key: "name", label: "Tên deal", type: "text", required: true, example: "Enterprise License" },
    { key: "amount", label: "Giá trị (VND)", type: "number", required: true, example: "500000000" },
    { key: "stage", label: "Giai đoạn", type: "select", required: false, example: "Negotiation" },
    { key: "contact_email", label: "Email liên hệ", type: "email", required: false, example: "an@tech.vn" },
    { key: "close_date", label: "Ngày dự kiến đóng", type: "date", required: false, example: "2026-06-30" },
    { key: "probability", label: "Xác suất (%)", type: "number", required: false, example: "75" },
    { key: "owner", label: "Người phụ trách", type: "text", required: false, example: "Tùng Phạm" },
  ],
  products: [
    { key: "name", label: "Tên sản phẩm", type: "text", required: true, example: "CRM Enterprise" },
    { key: "sku", label: "Mã SKU", type: "text", required: false, example: "CRM-ENT-001" },
    { key: "price", label: "Giá (VND)", type: "number", required: true, example: "15000000" },
    { key: "category", label: "Danh mục", type: "select", required: false, example: "Phần mềm" },
    { key: "description", label: "Mô tả", type: "textarea", required: false, example: "Gói enterprise" },
  ],
  tickets: [
    { key: "subject", label: "Tiêu đề", type: "text", required: true, example: "Lỗi đăng nhập" },
    { key: "contact_email", label: "Email khách", type: "email", required: true, example: "kh@company.vn" },
    { key: "priority", label: "Mức ưu tiên", type: "select", required: false, example: "High" },
    { key: "status", label: "Trạng thái", type: "select", required: false, example: "Open" },
    { key: "description", label: "Mô tả", type: "textarea", required: false, example: "Chi tiết lỗi..." },
  ],
};

/* ============================================================
 * Mock CSV Data
 * ============================================================ */
const MOCK_CSV_HEADERS = ["Họ và tên", "Email liên hệ", "SĐT", "Công ty", "Chức vụ", "Nguồn", "Điểm", "Ghi chú"];
const MOCK_CSV_ROWS: string[][] = [
  ["Nguyễn Văn An", "an.nguyen@techcorp.vn", "0901234567", "TechCorp Vietnam", "CTO", "Website", "85", "Khách VIP, quan tâm gói Enterprise"],
  ["Trần Thị Mai", "mai.tran@startup.vn", "0912345678", "StartupXYZ", "CEO", "Giới thiệu", "72", "Cần demo tuần tới"],
  ["Lê Hoàng Đức", "duc.le@bigcorp.com", "0923456789", "BigCorp", "Trưởng phòng IT", "LinkedIn", "68", ""],
  ["Phạm Minh Tâm", "tam.pham@school.edu.vn", "0934567890", "Đại học ABC", "Giảng viên", "Conference", "45", "Nghiên cứu CRM cho giáo dục"],
  ["Vũ Thanh Hà", "ha.vu@media.vn", "0945678901", "MediaPro", "Marketing Manager", "Facebook Ads", "91", "Hot lead, đang dùng đối thủ"],
  ["Đỗ Quốc Bảo", "bao.do@fintech.vn", "0956789012", "FinTech Solutions", "COO", "Webinar", "78", "Cần tích hợp thanh toán"],
  ["Hoàng Thị Lan", "lan.hoang@retail.vn", "", "RetailMax", "Owner", "Google Ads", "82", "Chuỗi 15 cửa hàng"],
  ["Ngô Đình Khoa", "khoa.ngo@logistics.vn", "0978901234", "VN Logistics", "Phó GĐ", "Email outbound", "55", ""],
  ["Bùi Anh Tuấn", "tuan.bui@healthcare.vn", "0989012345", "", "IT Director", "Partner", "63", "Ngành y tế, cần bảo mật cao"],
  ["Trịnh Minh Châu", "invalid-email", "09900123", "ConsultCo", "Consultant", "Cold call", "40", "Email và SĐT có vấn đề"],
];

const MOCK_AI_MAPPINGS: Record<string, { field: string; confidence: number }> = {
  "Họ và tên": { field: "first_name", confidence: 0.72 },
  "Email liên hệ": { field: "email", confidence: 0.98 },
  "SĐT": { field: "phone", confidence: 0.95 },
  "Công ty": { field: "company", confidence: 0.99 },
  "Chức vụ": { field: "position", confidence: 0.97 },
  "Nguồn": { field: "lead_source", confidence: 0.93 },
  "Điểm": { field: "lead_score", confidence: 0.88 },
  "Ghi chú": { field: "notes", confidence: 0.99 },
};

const MOCK_VALIDATION_ISSUES: ValidationIssue[] = [
  { row: 7, column: "SĐT", value: "", issue: "Số điện thoại trống", severity: "warning", suggestion: "Có thể bỏ qua hoặc điền sau" },
  { row: 9, column: "Công ty", value: "", issue: "Công ty trống", severity: "warning", suggestion: "Có thể gán 'Cá nhân' hoặc bỏ qua" },
  { row: 10, column: "Email liên hệ", value: "invalid-email", issue: "Email không hợp lệ — thiếu @domain", severity: "error", suggestion: "Sửa thành email đúng định dạng hoặc bỏ qua dòng" },
  { row: 10, column: "SĐT", value: "09900123", issue: "SĐT quá ngắn (8 ký tự, cần ≥10)", severity: "error", suggestion: "Kiểm tra lại SĐT gốc" },
  { row: 1, column: "Họ và tên", value: "Nguyễn Văn An", issue: "Trùng email với contact có sẵn (ct_001)", severity: "info", suggestion: "Chọn chiến lược: bỏ qua, ghi đè, hoặc merge" },
  { row: 5, column: "Điểm", value: "91", issue: "Lead score cao bất thường (>90)", severity: "info", suggestion: "Kiểm tra lại hoặc xác nhận" },
];

/* ============================================================
 * Step Indicator
 * ============================================================ */
function StepIndicator({ current, steps }: { current: number; steps: { num: number; label: string; icon: React.ComponentType<{ className?: string }> }[] }) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto pb-1">
      {steps.map((step, i) => {
        const Icon = step.icon;
        const isActive = step.num === current;
        const isDone = step.num < current;
        return (
          <div key={step.num} className="flex items-center gap-1 flex-shrink-0">
            {i > 0 && <div className={`w-6 sm:w-10 h-px ${isDone ? "bg-violet-400" : "bg-gray-200"}`} />}
            <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg transition-colors ${
              isActive ? "bg-violet-100 text-violet-700" : isDone ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400"
            }`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                isActive ? "bg-violet-600 text-white" : isDone ? "bg-green-500 text-white" : "bg-gray-200 text-gray-500"
              }`}>
                {isDone ? <Check className="w-3.5 h-3.5" /> : step.num}
              </div>
              <span className="text-[10px] hidden sm:block whitespace-nowrap">{step.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
 * Main Page Component
 * ============================================================ */
export function DataImportWizardPage() {
  const [step, setStep] = useState<ImportStep>(1);
  const [selectedModule, setSelectedModule] = useState<ImportModule>("contacts");
  const [fileName, setFileName] = useState<string | null>(null);
  const [mappings, setMappings] = useState<ColumnMapping[]>([]);
  const [conflictStrategy, setConflictStrategy] = useState<ConflictStrategy>("skip");
  const [importing, setImporting] = useState(false);
  const [importDone, setImportDone] = useState(false);
  const [skipErrors, setSkipErrors] = useState(true);

  const fields = CRM_FIELDS[selectedModule];

  const validationIssues = useMemo(() => MOCK_VALIDATION_ISSUES, []);
  const errorCount = validationIssues.filter((i) => i.severity === "error").length;
  const warningCount = validationIssues.filter((i) => i.severity === "warning").length;
  const infoCount = validationIssues.filter((i) => i.severity === "info").length;

  const handleUpload = () => {
    setFileName("contacts_import_2026Q1.csv");
    const autoMappings: ColumnMapping[] = MOCK_CSV_HEADERS.map((col) => {
      const ai = MOCK_AI_MAPPINGS[col];
      return {
        sourceColumn: col,
        targetField: ai?.field ?? null,
        status: ai ? "ai-suggested" as const : "unmapped" as const,
        preview: MOCK_CSV_ROWS.slice(0, 3).map((r) => r[MOCK_CSV_HEADERS.indexOf(col)]),
        aiConfidence: ai?.confidence,
      };
    });
    setMappings(autoMappings);
    toast.success("Đã tải file — 10 dòng dữ liệu được nhận diện");
  };

  const handleMapField = (sourceCol: string, targetField: string) => {
    setMappings((prev) =>
      prev.map((m) =>
        m.sourceColumn === sourceCol
          ? { ...m, targetField: targetField || null, status: targetField ? "mapped" : "unmapped" }
          : m,
      ),
    );
  };

  const handleIgnoreColumn = (sourceCol: string) => {
    setMappings((prev) =>
      prev.map((m) => (m.sourceColumn === sourceCol ? { ...m, targetField: null, status: "ignored" } : m)),
    );
  };

  const handleAcceptAI = () => {
    setMappings((prev) => prev.map((m) => (m.status === "ai-suggested" ? { ...m, status: "mapped" } : m)));
    toast.success("Đã chấp nhận tất cả mapping từ AI");
  };

  const mappedCount = mappings.filter((m) => m.status === "mapped" || m.status === "ai-suggested").length;
  const requiredFields = fields.filter((f) => f.required);
  const missingRequired = requiredFields.filter((f) => !mappings.some((m) => (m.status === "mapped" || m.status === "ai-suggested") && m.targetField === f.key));

  const handleImport = () => {
    setImporting(true);
    setTimeout(() => {
      setImporting(false);
      setImportDone(true);
      toast.success("Import hoàn tất — 8/10 records thành công!");
    }, 2500);
  };

  const canProceed = (s: ImportStep) => {
    if (s === 1) return !!fileName;
    if (s === 2) return !!fileName;
    if (s === 3) return mappedCount > 0 && missingRequired.length === 0;
    if (s === 4) return true;
    return false;
  };

  const STEPS = [
    { num: 1, label: "Tải file", icon: Upload },
    { num: 2, label: "Xem trước", icon: Table2 },
    { num: 3, label: "Mapping", icon: Columns3 },
    { num: 4, label: "Kiểm tra", icon: ScanSearch },
    { num: 5, label: "Import", icon: Import },
  ];

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <Import className="w-6 h-6 text-violet-600" /> Data Import Wizard
        </h1>
        <p className="text-gray-500 mt-0.5">
          Nhập dữ liệu từ CSV/Excel vào CRM — hỗ trợ AI auto-mapping, validation, và xử lý trùng lặp
        </p>
      </header>

      {/* Step Indicator */}
      <StepIndicator current={step} steps={STEPS} />

      {/* ==================== STEP 1: Upload ==================== */}
      {step === 1 && (
        <div className="space-y-4">
          {/* Module Selection */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm text-gray-900 mb-3">Chọn module đích</h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {IMPORT_MODULES.map((m) => {
                const Icon = m.icon;
                return (
                  <button key={m.key} type="button" onClick={() => setSelectedModule(m.key)}
                    className={`p-3 rounded-xl border text-left transition-colors ${
                      selectedModule === m.key ? "border-violet-300 bg-violet-50" : "border-gray-100 hover:border-gray-200"
                    }`}>
                    <div className={`w-8 h-8 rounded-lg ${m.color} flex items-center justify-center mb-2`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-xs text-gray-900">{m.label}</p>
                    <p className="text-[9px] text-gray-400 mt-0.5">{m.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Upload Zone */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm text-gray-900 mb-3">Tải file dữ liệu</h3>
            {!fileName ? (
              <button type="button" onClick={handleUpload}
                className="w-full border-2 border-dashed border-gray-200 rounded-xl p-8 hover:border-violet-300 hover:bg-violet-50/30 transition-colors text-center group">
                <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3 group-hover:text-violet-400" />
                <p className="text-sm text-gray-600">Kéo thả file hoặc <span className="text-violet-600">chọn từ máy</span></p>
                <p className="text-[10px] text-gray-400 mt-1">Hỗ trợ: CSV, XLSX, XLS — Tối đa 10MB, 50.000 dòng</p>
              </button>
            ) : (
              <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                <FileSpreadsheet className="w-8 h-8 text-green-600" />
                <div className="flex-1">
                  <p className="text-sm text-green-800">{fileName}</p>
                  <p className="text-[10px] text-green-600">10 dòng × 8 cột — 2.4 KB — UTF-8</p>
                </div>
                <button type="button" onClick={() => { setFileName(null); setMappings([]); }}
                  className="p-1.5 text-green-600 hover:bg-green-100 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Import Options */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm text-gray-900 mb-3">Tuỳ chọn import</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Xử lý trùng lặp (duplicate)</label>
                <select value={conflictStrategy} onChange={(e) => setConflictStrategy(e.target.value as ConflictStrategy)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option value="skip">Bỏ qua (giữ bản gốc)</option>
                  <option value="overwrite">Ghi đè (ưu tiên file import)</option>
                  <option value="merge">Merge (gộp thông tin)</option>
                  <option value="create_new">Tạo bản mới (cho phép trùng)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Khi gặp lỗi validation</label>
                <div className="flex items-center gap-4 mt-2">
                  <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                    <input type="radio" name="errPolicy" checked={skipErrors} onChange={() => setSkipErrors(true)}
                      className="accent-violet-600" />
                    Bỏ qua dòng lỗi, import phần còn lại
                  </label>
                  <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                    <input type="radio" name="errPolicy" checked={!skipErrors} onChange={() => setSkipErrors(false)}
                      className="accent-violet-600" />
                    Dừng toàn bộ nếu có lỗi
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== STEP 2: Preview ==================== */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-2">
                <Table2 className="w-4 h-4 text-violet-500" />
                <h3 className="text-sm text-gray-900">Xem trước dữ liệu</h3>
                <span className="text-[9px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full">10 dòng × 8 cột</span>
              </div>
              <p className="text-[10px] text-gray-400">Hiển thị 10 dòng đầu tiên</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/50">
                    <th className="px-3 py-2 text-left text-[10px] text-gray-400 w-8">#</th>
                    {MOCK_CSV_HEADERS.map((h) => (
                      <th key={h} className="px-3 py-2 text-left text-[10px] text-gray-500 font-mono whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MOCK_CSV_ROWS.map((row, i) => (
                    <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="px-3 py-2 text-[10px] text-gray-300">{i + 1}</td>
                      {row.map((cell, j) => (
                        <td key={j} className={`px-3 py-2 text-xs whitespace-nowrap ${
                          !cell ? "text-gray-300 italic" : "text-gray-700"
                        }`}>
                          {cell || "(trống)"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl border border-blue-200 p-3 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-700">
              <p>Dữ liệu đã được nhận diện: <strong>8 cột</strong>, <strong>10 dòng</strong>, encoding <strong>UTF-8</strong>.</p>
              <p className="mt-0.5">Bước tiếp theo: mapping cột file → trường CRM. AI sẽ tự đề xuất mapping.</p>
            </div>
          </div>
        </div>
      )}

      {/* ==================== STEP 3: Mapping ==================== */}
      {step === 3 && (
        <div className="space-y-4">
          {/* AI Banner */}
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-200 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <p className="text-xs text-violet-800">
                AI đã tự động mapping <strong>{mappings.filter((m) => m.status === "ai-suggested").length}</strong> cột 
                với độ tin cậy trung bình <strong>{(mappings.filter((m) => m.aiConfidence).reduce((s, m) => s + (m.aiConfidence ?? 0), 0) / mappings.filter((m) => m.aiConfidence).length * 100).toFixed(0)}%</strong>
              </p>
            </div>
            <button type="button" onClick={handleAcceptAI}
              className="flex items-center gap-1 px-3 py-1.5 bg-violet-600 text-white rounded-lg text-xs hover:bg-violet-700">
              <Check className="w-3.5 h-3.5" /> Chấp nhận AI
            </button>
          </div>

          {/* Mapping status */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-green-50 rounded-lg border border-green-200 p-2 text-center">
              <p className="text-sm text-green-600">{mappings.filter((m) => m.status === "mapped").length}</p>
              <p className="text-[8px] text-green-700">Đã map</p>
            </div>
            <div className="bg-violet-50 rounded-lg border border-violet-200 p-2 text-center">
              <p className="text-sm text-violet-600">{mappings.filter((m) => m.status === "ai-suggested").length}</p>
              <p className="text-[8px] text-violet-700">AI đề xuất</p>
            </div>
            <div className="bg-amber-50 rounded-lg border border-amber-200 p-2 text-center">
              <p className="text-sm text-amber-600">{mappings.filter((m) => m.status === "unmapped").length}</p>
              <p className="text-[8px] text-amber-700">Chưa map</p>
            </div>
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-2 text-center">
              <p className="text-sm text-gray-500">{mappings.filter((m) => m.status === "ignored").length}</p>
              <p className="text-[8px] text-gray-500">Bỏ qua</p>
            </div>
          </div>

          {/* Missing Required */}
          {missingRequired.length > 0 && (
            <div className="bg-red-50 rounded-xl border border-red-200 p-3 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-red-700">
                <p>Trường bắt buộc chưa được mapping:</p>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {missingRequired.map((f) => (
                    <span key={f.key} className="px-1.5 py-0.5 bg-red-100 text-red-600 rounded text-[9px]">{f.label}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Mapping Table */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="px-4 py-2.5 text-left text-xs text-gray-500">Cột trong file</th>
                    <th className="px-4 py-2.5 text-center text-xs text-gray-400 w-8">→</th>
                    <th className="px-4 py-2.5 text-left text-xs text-gray-500">Trường CRM</th>
                    <th className="px-4 py-2.5 text-left text-xs text-gray-400">Dữ liệu mẫu</th>
                    <th className="px-4 py-2.5 text-center text-xs text-gray-400 w-12">AI</th>
                    <th className="px-4 py-2.5 text-center text-xs text-gray-400 w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {mappings.map((m) => (
                    <tr key={m.sourceColumn} className={`border-b border-gray-50 ${
                      m.status === "ignored" ? "opacity-40" : ""
                    }`}>
                      <td className="px-4 py-3">
                        <code className="text-xs text-gray-700 font-mono bg-gray-50 px-1.5 py-0.5 rounded">{m.sourceColumn}</code>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-300">→</td>
                      <td className="px-4 py-3">
                        <select value={m.targetField ?? ""}
                          onChange={(e) => handleMapField(m.sourceColumn, e.target.value)}
                          disabled={m.status === "ignored"}
                          className={`w-full px-2.5 py-1.5 border rounded-lg text-xs ${
                            m.status === "ai-suggested" ? "border-violet-300 bg-violet-50 text-violet-700" :
                            m.targetField ? "border-green-300 bg-green-50 text-green-700" :
                            "border-gray-200 text-gray-600"
                          }`}>
                          <option value="">— Chọn trường —</option>
                          {fields.map((f) => (
                            <option key={f.key} value={f.key}>{f.label}{f.required ? " *" : ""} ({f.type})</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 flex-wrap">
                          {m.preview.map((v, i) => (
                            <span key={i} className="text-[9px] bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded truncate max-w-[100px]">{v || "(trống)"}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {m.aiConfidence && (
                          <span className={`text-[8px] px-1 py-0.5 rounded ${
                            m.aiConfidence >= 0.9 ? "bg-green-100 text-green-600" :
                            m.aiConfidence >= 0.7 ? "bg-amber-100 text-amber-600" :
                            "bg-red-100 text-red-600"
                          }`}>
                            {(m.aiConfidence * 100).toFixed(0)}%
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button type="button" onClick={() => handleIgnoreColumn(m.sourceColumn)}
                          title="Bỏ qua cột này"
                          className="text-gray-300 hover:text-red-500">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== STEP 4: Validation ==================== */}
      {step === 4 && (
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-green-50 rounded-xl border border-green-200 p-3 text-center">
              <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto mb-1" />
              <p className="text-lg text-green-600">{10 - errorCount}</p>
              <p className="text-[9px] text-green-700">Dòng hợp lệ</p>
            </div>
            <div className="bg-red-50 rounded-xl border border-red-200 p-3 text-center">
              <XCircle className="w-5 h-5 text-red-500 mx-auto mb-1" />
              <p className="text-lg text-red-600">{errorCount}</p>
              <p className="text-[9px] text-red-700">Lỗi</p>
            </div>
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-3 text-center">
              <AlertTriangle className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <p className="text-lg text-amber-600">{warningCount}</p>
              <p className="text-[9px] text-amber-700">Cảnh báo</p>
            </div>
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-3 text-center">
              <Info className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <p className="text-lg text-blue-600">{infoCount}</p>
              <p className="text-[9px] text-blue-700">Thông tin</p>
            </div>
          </div>

          {/* Issues List */}
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="p-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <ScanSearch className="w-4 h-4 text-violet-500" />
              <h3 className="text-sm text-gray-900">Kết quả kiểm tra</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {validationIssues.map((issue, i) => (
                <div key={i} className="px-4 py-3 flex items-start gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    issue.severity === "error" ? "bg-red-100" :
                    issue.severity === "warning" ? "bg-amber-100" : "bg-blue-100"
                  }`}>
                    {issue.severity === "error" ? <XCircle className="w-3 h-3 text-red-600" /> :
                     issue.severity === "warning" ? <AlertTriangle className="w-3 h-3 text-amber-600" /> :
                     <Info className="w-3 h-3 text-blue-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono">Dòng {issue.row}</span>
                      <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded font-mono">{issue.column}</span>
                      {issue.value && <code className="text-[9px] text-red-500 bg-red-50 px-1.5 py-0.5 rounded">"{issue.value}"</code>}
                    </div>
                    <p className="text-xs text-gray-700 mt-1">{issue.issue}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-violet-400" /> {issue.suggestion}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conflict Strategy */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm text-gray-900 mb-2">Phát hiện 1 bản ghi trùng lặp</h3>
            <p className="text-xs text-gray-500 mb-3">
              Contact <strong>Nguyễn Văn An</strong> (an.nguyen@techcorp.vn) đã tồn tại trong hệ thống. Chiến lược xử lý:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {([
                { key: "skip", label: "Bỏ qua", desc: "Giữ bản gốc, không import" },
                { key: "overwrite", label: "Ghi đè", desc: "Thay thế bằng dữ liệu mới" },
                { key: "merge", label: "Merge", desc: "Gộp: giữ gốc + bổ sung mới" },
                { key: "create_new", label: "Tạo mới", desc: "Tạo bản ghi duplicate" },
              ] as const).map((s) => (
                <button key={s.key} type="button" onClick={() => setConflictStrategy(s.key)}
                  className={`p-2.5 rounded-lg border text-left transition-colors ${
                    conflictStrategy === s.key ? "border-violet-300 bg-violet-50" : "border-gray-100 hover:border-gray-200"
                  }`}>
                  <p className="text-xs text-gray-900">{s.label}</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">{s.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================== STEP 5: Import ==================== */}
      {step === 5 && (
        <div className="space-y-4">
          {!importDone ? (
            <>
              {/* Summary */}
              <div className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="text-sm text-gray-900 mb-3">Xác nhận Import</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <p className="text-[9px] text-gray-400">Module</p>
                    <p className="text-xs text-gray-900">
                      {IMPORT_MODULES.find((m) => m.key === selectedModule)?.label}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <p className="text-[9px] text-gray-400">Tổng dòng</p>
                    <p className="text-xs text-gray-900">10</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <p className="text-[9px] text-gray-400">Sẽ import</p>
                    <p className="text-xs text-green-600">8 dòng</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2.5">
                    <p className="text-[9px] text-gray-400">Bỏ qua</p>
                    <p className="text-xs text-red-500">2 dòng (lỗi)</p>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs text-gray-600">
                  <p>• Trùng lặp: <strong>{conflictStrategy === "skip" ? "Bỏ qua" : conflictStrategy === "overwrite" ? "Ghi đè" : conflictStrategy === "merge" ? "Merge" : "Tạo mới"}</strong> (1 bản ghi)</p>
                  <p>• Dòng lỗi: <strong>{skipErrors ? "Bỏ qua, import phần còn lại" : "Dừng toàn bộ"}</strong></p>
                  <p>• Fields mapped: <strong>{mappedCount}/{MOCK_CSV_HEADERS.length}</strong></p>
                </div>
              </div>

              {/* Import Button */}
              <div className="flex justify-center">
                <button type="button" onClick={handleImport} disabled={importing}
                  className="flex items-center gap-2 px-8 py-3 bg-violet-600 text-white rounded-xl text-sm hover:bg-violet-700 disabled:opacity-50 shadow-lg shadow-violet-200">
                  {importing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Đang import...
                    </>
                  ) : (
                    <>
                      <Import className="w-5 h-5" /> Bắt đầu Import
                    </>
                  )}
                </button>
              </div>

              {importing && (
                <div className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>Đang xử lý...</span>
                      <span>60%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-500 rounded-full animate-pulse" style={{ width: "60%" }} />
                    </div>
                    <p className="text-[10px] text-gray-400">Validating và chèn dữ liệu vào database...</p>
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Import Complete */
            <div className="space-y-4">
              <div className="bg-green-50 rounded-xl border border-green-200 p-6 text-center">
                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg text-green-800">Import hoàn tất!</h3>
                <p className="text-sm text-green-600 mt-1">8 / 10 bản ghi đã được nhập thành công</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white rounded-xl border border-green-200 p-3 text-center">
                  <p className="text-lg text-green-600">7</p>
                  <p className="text-[9px] text-green-700">Tạo mới</p>
                </div>
                <div className="bg-white rounded-xl border border-blue-200 p-3 text-center">
                  <p className="text-lg text-blue-600">1</p>
                  <p className="text-[9px] text-blue-700">Trùng (đã {conflictStrategy === "skip" ? "bỏ qua" : conflictStrategy === "merge" ? "merge" : "ghi đè"})</p>
                </div>
                <div className="bg-white rounded-xl border border-red-200 p-3 text-center">
                  <p className="text-lg text-red-600">2</p>
                  <p className="text-[9px] text-red-700">Bỏ qua (lỗi)</p>
                </div>
                <div className="bg-white rounded-xl border border-gray-200 p-3 text-center">
                  <p className="text-lg text-gray-600">1.2s</p>
                  <p className="text-[9px] text-gray-500">Thời gian</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button type="button" onClick={() => { setStep(1); setImportDone(false); setFileName(null); setMappings([]); }}
                  className="flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50">
                  <RefreshCw className="w-4 h-4" /> Import thêm
                </button>
                <button type="button" onClick={() => toast.success("Chuyển đến danh sách Liên hệ")}
                  className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">
                  <Eye className="w-4 h-4" /> Xem dữ liệu đã nhập
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      {!importDone && (
        <div className="flex items-center justify-between">
          <button type="button" onClick={() => setStep((s) => Math.max(1, s - 1) as ImportStep)} disabled={step === 1}
            className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg border border-gray-200 disabled:opacity-30">
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </button>
          {step < 5 && (
            <button type="button" onClick={() => setStep((s) => Math.min(5, s + 1) as ImportStep)}
              disabled={!canProceed(step)}
              className="flex items-center gap-1.5 px-5 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 disabled:opacity-30">
              Tiếp theo <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* AI Tips */}
      {step <= 3 && (
        <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <h4 className="text-sm text-violet-900">AI Import Assistant</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
            <p className="flex items-start gap-2">
              <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
              <span>Cột <strong>"Họ và tên"</strong> chứa cả họ + tên. AI sẽ tự tách thành <strong>first_name</strong> và <strong>last_name</strong> cho bạn.</span>
            </p>
            <p className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
              <span>Phát hiện <strong>1 email trùng</strong> với contact có sẵn. Dùng chiến lược <strong>"Merge"</strong> để không mất dữ liệu gốc.</span>
            </p>
            <p className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <span>File này không chứa dữ liệu nhạy cảm (CCCD, thẻ tín dụng). An toàn để import trực tiếp.</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
