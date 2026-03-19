/**
 * Form Builder — Lead Capture Forms
 * Tạo form thu thập lead: drag-drop fields, conditional logic,
 * multi-step, embed code, analytics, CRM auto-create.
 */
import { useState, useMemo } from "react";
import {
  FormInput,
  Plus,
  Search,
  Eye,
  Copy,
  Trash2,
  Code,
  BarChart3,
  CheckCircle2,
  X,
  Pencil,
  Sparkles,
  Bot,
  TrendingUp,
  AlertTriangle,
  Globe,
  Mail,
  Phone,
  User,
  Building2,
  MessageSquare,
  ListChecks,
  Star,
  ToggleLeft,
  CalendarDays,
  Upload,
  ChevronDown,
  MousePointerClick,
  Users,
  FileDown,
  ExternalLink,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";

/* ============================================================
 * Types
 * ============================================================ */
type FieldType = "text" | "email" | "phone" | "textarea" | "select" | "checkbox" | "radio" | "date" | "file" | "hidden" | "number" | "rating";
type FormStatus = "active" | "draft" | "archived";

interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[]; // cho select/radio/checkbox
}

interface LeadForm {
  id: string;
  name: string;
  description: string;
  status: FormStatus;
  fields: FormField[];
  successMessage: string;
  redirectUrl: string | null;
  crmAction: string; // e.g., "Tạo Contact + Gán tag"
  // Stats
  views: number;
  submissions: number;
  conversionRate: number;
  // Meta
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  embedType: "popup" | "inline" | "fullpage";
  tags: string[];
}

/* ============================================================
 * Constants
 * ============================================================ */
const STATUS_CFG: Record<FormStatus, { label: string; color: string; bg: string }> = {
  active: { label: "Đang hoạt động", color: "text-green-600", bg: "bg-green-50 border-green-200" },
  draft: { label: "Bản nháp", color: "text-gray-500", bg: "bg-gray-50 border-gray-200" },
  archived: { label: "Đã lưu trữ", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
};

const FIELD_ICONS: Record<FieldType, React.ComponentType<{ className?: string }>> = {
  text: FormInput,
  email: Mail,
  phone: Phone,
  textarea: MessageSquare,
  select: ListChecks,
  checkbox: CheckCircle2,
  radio: ToggleLeft,
  date: CalendarDays,
  file: Upload,
  hidden: Code,
  number: BarChart3,
  rating: Star,
};

const FIELD_LABELS: Record<FieldType, string> = {
  text: "Text", email: "Email", phone: "Điện thoại", textarea: "Textarea",
  select: "Dropdown", checkbox: "Checkbox", radio: "Radio", date: "Ngày",
  file: "Upload", hidden: "Ẩn", number: "Số", rating: "Đánh giá",
};

/* ============================================================
 * Mock Data
 * ============================================================ */
const MOCK_FORMS: LeadForm[] = [
  {
    id: "frm_001",
    name: "Đăng ký dùng thử AI-CRM",
    description: "Form đăng ký trial 14 ngày trên landing page chính",
    status: "active",
    fields: [
      { id: "f1", type: "text", label: "Họ và tên", placeholder: "Nguyễn Văn A", required: true },
      { id: "f2", type: "email", label: "Email công ty", placeholder: "name@company.com", required: true },
      { id: "f3", type: "phone", label: "Số điện thoại", placeholder: "0901234567", required: true },
      { id: "f4", type: "text", label: "Tên công ty", placeholder: "Công ty ABC", required: true },
      { id: "f5", type: "select", label: "Quy mô công ty", required: true, options: ["1-10", "11-50", "51-200", "201-500", "500+"] },
      { id: "f6", type: "select", label: "Ngành nghề", required: false, options: ["Phần mềm", "Thương mại", "Sản xuất", "Giáo dục", "Y tế", "Tài chính", "Khác"] },
      { id: "f7", type: "hidden", label: "utm_source", required: false },
      { id: "f8", type: "hidden", label: "utm_campaign", required: false },
    ],
    successMessage: "Cảm ơn bạn đăng ký! Kiểm tra email để kích hoạt tài khoản trial.",
    redirectUrl: "https://app.ai-crm.vn/welcome",
    crmAction: "Tạo Contact + Gán tag 'trial_signup' + Enroll sequence 'Onboarding'",
    views: 24500,
    submissions: 3200,
    conversionRate: 13.1,
    createdBy: "Nguyễn Thị Mai",
    createdAt: "2025-10-15T10:00:00Z",
    updatedAt: "2026-03-01T14:00:00Z",
    embedType: "inline",
    tags: ["Trial", "Landing Page", "Main"],
  },
  {
    id: "frm_002",
    name: "Download Whitepaper: AI trong CRM 2026",
    description: "Gated content form — thu thập lead khi download whitepaper",
    status: "active",
    fields: [
      { id: "f1", type: "text", label: "Họ và tên", placeholder: "Nguyễn Văn A", required: true },
      { id: "f2", type: "email", label: "Email", placeholder: "name@company.com", required: true },
      { id: "f3", type: "text", label: "Chức danh", placeholder: "Sales Manager", required: false },
      { id: "f4", type: "text", label: "Tên công ty", placeholder: "Công ty ABC", required: false },
    ],
    successMessage: "Link download đã gửi vào email của bạn! 📧",
    redirectUrl: null,
    crmAction: "Tạo Contact + Gán tag 'whitepaper_AI_2026' + Send email với link download",
    views: 8900,
    submissions: 1450,
    conversionRate: 16.3,
    createdBy: "Trần Đức Anh",
    createdAt: "2026-01-10T09:00:00Z",
    updatedAt: "2026-02-28T11:00:00Z",
    embedType: "popup",
    tags: ["Whitepaper", "Content Marketing"],
  },
  {
    id: "frm_003",
    name: "Đăng ký Webinar: AI Sales Coach",
    description: "Form đăng ký webinar tháng 3 về AI Sales Coach",
    status: "active",
    fields: [
      { id: "f1", type: "text", label: "Họ và tên", required: true },
      { id: "f2", type: "email", label: "Email", required: true },
      { id: "f3", type: "phone", label: "Số điện thoại", required: false },
      { id: "f4", type: "text", label: "Tên công ty", required: false },
      { id: "f5", type: "select", label: "Bạn quan tâm gì nhất?", required: false, options: ["AI Lead Scoring", "AI Sales Coach", "Autonomous AI SDR", "AI Analytics", "Tất cả"] },
      { id: "f6", type: "textarea", label: "Câu hỏi bạn muốn hỏi diễn giả", placeholder: "Nhập câu hỏi...", required: false },
    ],
    successMessage: "Đã đăng ký thành công! Link Zoom sẽ gửi qua email trước 1 giờ.",
    redirectUrl: null,
    crmAction: "Tạo Contact + Gán tag 'webinar_ai_sales_coach' + Enroll sequence 'Webinar Reminder'",
    views: 3200,
    submissions: 890,
    conversionRate: 27.8,
    createdBy: "Lê Hoàng Đức",
    createdAt: "2026-02-20T14:00:00Z",
    updatedAt: "2026-03-02T09:00:00Z",
    embedType: "fullpage",
    tags: ["Webinar", "AI Sales Coach", "March 2026"],
  },
  {
    id: "frm_004",
    name: "Liên hệ tư vấn Enterprise",
    description: "Form liên hệ cho khách hàng Enterprise — routing trực tiếp đến Sales Manager",
    status: "active",
    fields: [
      { id: "f1", type: "text", label: "Họ và tên", required: true },
      { id: "f2", type: "email", label: "Email công ty", required: true },
      { id: "f3", type: "phone", label: "Số điện thoại", required: true },
      { id: "f4", type: "text", label: "Tên công ty", required: true },
      { id: "f5", type: "select", label: "Số nhân viên sales", required: true, options: ["1-10", "11-50", "51-200", "200+"] },
      { id: "f6", type: "select", label: "Ngân sách dự kiến", required: false, options: ["< 50 triệu/năm", "50-200 triệu/năm", "200-500 triệu/năm", "> 500 triệu/năm"] },
      { id: "f7", type: "textarea", label: "Mô tả nhu cầu", placeholder: "Cho chúng tôi biết thêm...", required: false },
    ],
    successMessage: "Cảm ơn! Sales Manager sẽ liên hệ bạn trong vòng 2 giờ làm việc.",
    redirectUrl: null,
    crmAction: "Tạo Contact + Deal + Assign Sales Manager + Gửi Slack notification + Enroll sequence 'Enterprise Nurture'",
    views: 5600,
    submissions: 340,
    conversionRate: 6.1,
    createdBy: "Phạm Minh Tâm",
    createdAt: "2025-11-01T10:00:00Z",
    updatedAt: "2026-03-03T08:00:00Z",
    embedType: "inline",
    tags: ["Enterprise", "High Value"],
  },
  {
    id: "frm_005",
    name: "Khảo sát chất lượng dịch vụ (Draft)",
    description: "Survey post-support — chưa publish",
    status: "draft",
    fields: [
      { id: "f1", type: "rating", label: "Mức độ hài lòng tổng thể", required: true },
      { id: "f2", type: "select", label: "Thời gian phản hồi", required: true, options: ["Rất nhanh", "Nhanh", "Bình thường", "Chậm", "Rất chậm"] },
      { id: "f3", type: "textarea", label: "Góp ý thêm", required: false },
    ],
    successMessage: "Cảm ơn phản hồi của bạn!",
    redirectUrl: null,
    crmAction: "Update Contact NPS + Log Activity",
    views: 0,
    submissions: 0,
    conversionRate: 0,
    createdBy: "Vũ Thanh Hà",
    createdAt: "2026-03-03T07:00:00Z",
    updatedAt: "2026-03-03T07:00:00Z",
    embedType: "popup",
    tags: ["Survey", "CSAT"],
  },
];

/* ============================================================
 * Form Preview Modal
 * ============================================================ */
function FormPreviewModal({ form, onClose }: { form: LeadForm; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] shadow-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm text-gray-900">{form.name}</h3>
            <p className="text-[10px] text-gray-400">{form.description}</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3">
          {form.fields.filter((f) => f.type !== "hidden").map((field) => {
            const FieldIcon = FIELD_ICONS[field.type];
            return (
              <div key={field.id}>
                <label className="text-xs text-gray-600 flex items-center gap-1 mb-1">
                  <FieldIcon className="w-3 h-3 text-gray-400" />
                  {field.label}
                  {field.required && <span className="text-red-400">*</span>}
                </label>
                {field.type === "textarea" ? (
                  <textarea rows={3} placeholder={field.placeholder} disabled
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" />
                ) : field.type === "select" && field.options ? (
                  <select disabled className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50">
                    <option>Chọn...</option>
                    {field.options.map((o) => <option key={o}>{o}</option>)}
                  </select>
                ) : field.type === "rating" ? (
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-6 h-6 text-gray-300" />
                    ))}
                  </div>
                ) : (
                  <input type={field.type === "email" ? "email" : field.type === "phone" ? "tel" : "text"}
                    placeholder={field.placeholder} disabled
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50" />
                )}
              </div>
            );
          })}
          <button type="button" disabled
            className="w-full py-2.5 bg-violet-600 text-white rounded-lg text-sm opacity-50">
            Gửi
          </button>
          <p className="text-[9px] text-gray-400 text-center">
            ✓ {form.successMessage}
          </p>
        </div>

        {/* CRM Action */}
        <div className="p-3 border-t border-gray-100 bg-gray-50">
          <p className="text-[10px] text-gray-400 mb-1">Hành động CRM khi submit:</p>
          <p className="text-xs text-violet-600">{form.crmAction}</p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Create Form Modal
 * ============================================================ */
function CreateFormModal({ onClose, onCreated }: { onClose: () => void; onCreated: (form: LeadForm) => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [embedType, setEmbedType] = useState<"popup" | "inline" | "fullpage">("inline");
  const [successMessage, setSuccessMessage] = useState("Cảm ơn bạn đã gửi thông tin!");
  const [redirectUrl, setRedirectUrl] = useState("");
  const [crmAction, setCrmAction] = useState("Tạo Contact + Gán tag");
  const [fields, setFields] = useState<FormField[]>([
    { id: `f_${Date.now()}`, type: "text", label: "Họ và tên", placeholder: "Nhập họ tên", required: true },
    { id: `f_${Date.now() + 1}`, type: "email", label: "Email", placeholder: "name@company.com", required: true },
  ]);
  const [saving, setSaving] = useState(false);

  const addField = (type: FieldType) => {
    const label = FIELD_LABELS[type];
    setFields((prev) => [...prev, { id: `f_${Date.now()}`, type, label, placeholder: "", required: false }]);
  };

  const removeField = (id: string) => {
    setFields((prev) => prev.filter((f) => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFields((prev) => prev.map((f) => f.id === id ? { ...f, ...updates } : f));
  };

  const handleSave = () => {
    if (!name.trim()) { toast.error("Vui lòng nhập tên form"); return; }
    if (fields.length === 0) { toast.error("Vui lòng thêm ít nhất 1 trường"); return; }
    setSaving(true);
    const now = new Date().toISOString();
    const newForm: LeadForm = {
      id: `frm_${Date.now()}`, name, description: description || name,
      status: "draft", fields, successMessage,
      redirectUrl: redirectUrl || null, crmAction,
      views: 0, submissions: 0, conversionRate: 0,
      createdBy: "Người dùng hiện tại", createdAt: now, updatedAt: now,
      embedType, tags: [],
    };
    onCreated(newForm);
    toast.success(`Đã tạo form "${name}" với ${fields.length} trường`);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Tạo Form mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3 max-h-[65vh] overflow-y-auto">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tên Form *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Đăng ký tư vấn miễn phí"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mô tả</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Mô tả ngắn..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Kiểu embed</label>
              <select value={embedType} onChange={(e) => setEmbedType(e.target.value as "popup" | "inline" | "fullpage")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <option value="inline">Inline</option>
                <option value="popup">Popup</option>
                <option value="fullpage">Full Page</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">CRM Action</label>
              <input type="text" value={crmAction} onChange={(e) => setCrmAction(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Thông báo sau khi submit</label>
            <input type="text" value={successMessage} onChange={(e) => setSuccessMessage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>

          {/* Fields Builder */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-500">Các trường ({fields.length})</label>
            </div>
            <div className="space-y-1.5 mb-2">
              {fields.map((field, idx) => {
                const Icon = FIELD_ICONS[field.type];
                return (
                  <div key={field.id} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 group">
                    <span className="text-[9px] text-gray-300 w-4">{idx + 1}</span>
                    <Icon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <input type="text" value={field.label} onChange={(e) => updateField(field.id, { label: e.target.value })}
                      className="flex-1 text-sm bg-transparent border-none focus:outline-none text-gray-700" />
                    <select value={field.type} onChange={(e) => updateField(field.id, { type: e.target.value as FieldType })}
                      className="text-[10px] bg-white border border-gray-200 rounded px-1 py-0.5 text-gray-500">
                      {Object.entries(FIELD_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                    <label className="flex items-center gap-1 text-[9px] text-gray-400 cursor-pointer">
                      <input type="checkbox" checked={field.required} onChange={(e) => updateField(field.id, { required: e.target.checked })}
                        className="w-3 h-3 rounded border-gray-300 text-indigo-600" />
                      Bắt buộc
                    </label>
                    <button type="button" onClick={() => removeField(field.id)}
                      className="p-0.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-1">
              {(["text", "email", "phone", "textarea", "select", "checkbox", "date", "number", "rating", "file"] as FieldType[]).map((type) => {
                const Icon = FIELD_ICONS[type];
                return (
                  <button key={type} type="button" onClick={() => addField(type)}
                    className="flex items-center gap-1 px-2 py-1 text-[9px] text-gray-500 bg-white border border-dashed border-gray-200 rounded hover:border-indigo-300 hover:text-indigo-600 transition-colors">
                    <Icon className="w-2.5 h-2.5" /> {FIELD_LABELS[type]}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100">
            <p className="text-[10px] text-indigo-700 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Sau khi tạo, bạn có thể chỉnh sửa chi tiết: conditional logic, multi-step, custom CSS trong Form Editor.</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo Form"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Main Page
 * ============================================================ */
export function FormBuilderPage() {
  const [forms, setForms] = useState<LeadForm[]>(MOCK_FORMS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<FormStatus | "all">("all");
  const [previewForm, setPreviewForm] = useState<LeadForm | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteForm, setDeleteForm] = useState<LeadForm | null>(null);

  const filtered = useMemo(() => {
    let result = forms;
    if (statusFilter !== "all") result = result.filter((f) => f.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((f) => f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q));
    }
    return result;
  }, [forms, statusFilter, search]);

  const stats = useMemo(() => ({
    totalForms: forms.length,
    active: forms.filter((f) => f.status === "active").length,
    totalViews: forms.reduce((s, f) => s + f.views, 0),
    totalSubmissions: forms.reduce((s, f) => s + f.submissions, 0),
    avgConversion: forms.filter((f) => f.conversionRate > 0).length > 0
      ? (forms.filter((f) => f.conversionRate > 0).reduce((s, f) => s + f.conversionRate, 0) / forms.filter((f) => f.conversionRate > 0).length).toFixed(1)
      : "0",
    totalFields: forms.reduce((s, f) => s + f.fields.length, 0),
  }), [forms]);

  const handleDuplicate = (form: LeadForm) => {
    const clone = { ...form, id: `frm_${Date.now()}`, name: `${form.name} (Copy)`, status: "draft" as const, views: 0, submissions: 0, conversionRate: 0, createdAt: new Date().toISOString() };
    setForms((prev) => [clone, ...prev]);
    toast.success("Đã sao chép form");
  };

  const handleDelete = (id: string) => {
    setForms((prev) => prev.filter((f) => f.id !== id));
    toast.success("Đã xoá form");
  };

  const handleCopyEmbed = (form: LeadForm) => {
    const code = `<script src="https://forms.ai-crm.vn/embed.js" data-form-id="${form.id}" data-type="${form.embedType}"></script>`;
    navigator.clipboard.writeText(code).then(() => toast.success("Đã copy embed code!"));
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <FormInput className="w-6 h-6 text-indigo-600" /> Form Builder
        </h1>
        <p className="text-gray-500 mt-0.5">
          Tạo form thu thập lead — drag-drop, conditional logic, embed, CRM auto-create
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        <div className="bg-white rounded-xl border border-gray-100 p-2.5 text-center">
          <p className="text-lg text-gray-900">{stats.totalForms}</p>
          <p className="text-[9px] text-gray-400">Forms</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{stats.active}</p>
          <p className="text-[9px] text-green-700">Active</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{stats.totalViews.toLocaleString()}</p>
          <p className="text-[9px] text-blue-700">Lượt xem</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-2.5 text-center">
          <p className="text-lg text-violet-600">{stats.totalSubmissions.toLocaleString()}</p>
          <p className="text-[9px] text-violet-700">Submissions</p>
        </div>
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-2.5 text-center">
          <p className="text-lg text-emerald-600">{stats.avgConversion}%</p>
          <p className="text-[9px] text-emerald-700">TB Conversion</p>
        </div>
        <div className="bg-cyan-50 rounded-xl border border-cyan-200 p-2.5 text-center">
          <p className="text-lg text-cyan-600">{stats.totalFields}</p>
          <p className="text-[9px] text-cyan-700">Tổng fields</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[150px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Tìm form..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as FormStatus | "all")}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
          <option value="all">Tất cả</option>
          {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <button type="button" onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700">
          <Plus className="w-4 h-4" /> Tạo Form
        </button>
      </div>

      {/* Form Cards */}
      <div className="space-y-3">
        {filtered.map((form) => {
          const stCfg = STATUS_CFG[form.status];
          const visibleFields = form.fields.filter((f) => f.type !== "hidden");
          return (
            <div key={form.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-indigo-200 transition-colors">
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${stCfg.bg}`}>
                    <FormInput className={`w-5 h-5 ${stCfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm text-gray-900">{form.name}</h3>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded border ${stCfg.bg} ${stCfg.color}`}>{stCfg.label}</span>
                      <span className="text-[8px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded capitalize">{form.embedType}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">{form.description}</p>

                    {/* Fields preview */}
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      {visibleFields.slice(0, 6).map((f) => {
                        const FIcon = FIELD_ICONS[f.type];
                        return (
                          <span key={f.id} className="flex items-center gap-0.5 text-[8px] px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded text-gray-500">
                            <FIcon className="w-2.5 h-2.5" /> {f.label}
                          </span>
                        );
                      })}
                      {visibleFields.length > 6 && (
                        <span className="text-[8px] text-gray-400">+{visibleFields.length - 6}</span>
                      )}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-3 mt-2 text-[9px] text-gray-400 flex-wrap">
                      {form.views > 0 && <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {form.views.toLocaleString()} views</span>}
                      {form.submissions > 0 && <span className="flex items-center gap-0.5"><Users className="w-3 h-3" /> {form.submissions.toLocaleString()} submissions</span>}
                      {form.conversionRate > 0 && (
                        <span className={`flex items-center gap-0.5 ${form.conversionRate >= 15 ? "text-green-500" : form.conversionRate >= 8 ? "text-amber-500" : "text-red-400"}`}>
                          <MousePointerClick className="w-3 h-3" /> {form.conversionRate}% conversion
                        </span>
                      )}
                    </div>

                    {/* Conversion bar */}
                    {form.views > 0 && (
                      <div className="mt-2">
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${form.conversionRate >= 15 ? "bg-green-400" : form.conversionRate >= 8 ? "bg-amber-400" : "bg-red-400"}`}
                            style={{ width: `${Math.min(form.conversionRate * 3, 100)}%` }} />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      {form.tags.map((t) => (
                        <span key={t} className="text-[8px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CRM Action */}
                <div className="mt-3 pt-2 border-t border-gray-50">
                  <div className="flex items-center gap-1.5 text-[9px] text-violet-500">
                    <Zap className="w-3 h-3" />
                    <span>{form.crmAction}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex-wrap">
                <button type="button" onClick={() => setPreviewForm(form)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-gray-500 hover:bg-white rounded-lg">
                  <Eye className="w-3 h-3" /> Xem trước
                </button>
                <button type="button" onClick={() => handleCopyEmbed(form)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-blue-600 hover:bg-blue-50 rounded-lg">
                  <Code className="w-3 h-3" /> Embed Code
                </button>
                <button type="button" onClick={() => handleDuplicate(form)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-gray-500 hover:bg-white rounded-lg">
                  <Copy className="w-3 h-3" /> Sao chép
                </button>
                <button type="button" onClick={() => toast.success("Mở Form Editor")}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-gray-500 hover:bg-white rounded-lg">
                  <Pencil className="w-3 h-3" /> Sửa
                </button>
                <div className="flex-1" />
                <button type="button" onClick={() => setDeleteForm(form)}
                  className="p-1.5 text-gray-300 hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <FormInput className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Không tìm thấy form nào</p>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border border-indigo-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h4 className="text-sm text-indigo-900">AI Form Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-indigo-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Form <strong>"Webinar AI Sales Coach"</strong> đạt <strong>27.8% conversion</strong> — cao nhất hệ thống. Yếu tố thành công: ít fields (6) + CTA rõ ràng.</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span>Form <strong>"Enterprise Contact"</strong> có conversion thấp (<strong>6.1%</strong>). Đề xuất: giảm từ 7→5 fields, bỏ "Ngân sách" (gây drop-off 34%).</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>Progressive profiling có thể tăng conversion <strong>+15%</strong>: lần 1 hỏi name+email, lần 2 hỏi company+phone (đã có data → skip).</span>
          </p>
        </div>
      </div>

      {/* Preview Modal */}
      {previewForm && <FormPreviewModal form={previewForm} onClose={() => setPreviewForm(null)} />}
      {showCreateModal && <CreateFormModal onClose={() => setShowCreateModal(false)} onCreated={(form) => { setForms((prev) => [form, ...prev]); }} />}
      <ConfirmDeleteDialog
        open={!!deleteForm}
        onClose={() => setDeleteForm(null)}
        onConfirm={() => { if (deleteForm) { handleDelete(deleteForm.id); setDeleteForm(null); } }}
        itemName={deleteForm?.name ?? ""}
        entityType="form"
        description="Hành động này không thể hoàn tác. Mọi embed code liên quan sẽ ngừng hoạt động."
      />
    </div>
  );
}