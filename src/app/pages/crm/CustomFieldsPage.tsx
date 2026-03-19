/**
 * Custom Fields Manager
 * Quản lý trường dữ liệu tuỳ chỉnh cho mỗi entity trong CRM.
 * Hỗ trợ 14 loại trường, drag-drop reorder, field groups, validation,
 * preview, AI gợi ý trường phù hợp.
 */
import { useState, useMemo, useCallback, useRef } from "react";
import {
  Settings,
  Search,
  Plus,
  X,
  Check,
  Pencil,
  Trash2,
  GripVertical,
  Eye,
  EyeOff,
  Copy,
  ChevronDown,
  ChevronRight,
  Sparkles,
  AlertTriangle,
  Info,
  Contact2,
  Kanban,
  Building2,
  Ticket,
  Package,
  FileSpreadsheet,
  Calendar,
  Type,
  Hash,
  CalendarDays,
  List,
  ListChecks,
  ToggleLeft,
  Mail,
  Phone,
  Link2,
  DollarSign,
  Star,
  Calculator,
  Search as SearchIcon,
  Lock,
  Layers,
  Shield,
  ArrowUp,
  ArrowDown,
  Palette,
  FileText,
  Bot,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";

/* ============================================================
 * Types
 * ============================================================ */
type FieldType =
  | "text"
  | "number"
  | "date"
  | "dropdown"
  | "multi-select"
  | "checkbox"
  | "email"
  | "phone"
  | "url"
  | "currency"
  | "rating"
  | "formula"
  | "lookup"
  | "textarea";

interface DropdownOption {
  value: string;
  label: string;
  color?: string;
}

interface ValidationRule {
  type: "required" | "min" | "max" | "regex" | "unique";
  value?: string | number;
  message: string;
}

interface CustomField {
  id: string;
  name: string;
  label: string;
  type: FieldType;
  entity: string;
  group: string;
  description: string;
  placeholder: string;
  defaultValue: string;
  isRequired: boolean;
  isUnique: boolean;
  isSearchable: boolean;
  isVisible: boolean;
  isSystem: boolean;
  order: number;
  options?: DropdownOption[];
  formula?: string;
  lookupEntity?: string;
  lookupField?: string;
  validations: ValidationRule[];
  createdAt: string;
  updatedAt: string;
}

interface FieldGroup {
  id: string;
  name: string;
  entity: string;
  order: number;
  isCollapsed: boolean;
}

/* ============================================================
 * Constants
 * ============================================================ */
const ENTITIES = [
  { key: "contacts", label: "Liên hệ", icon: Contact2, color: "text-blue-600" },
  { key: "deals", label: "Deals", icon: Kanban, color: "text-green-600" },
  { key: "companies", label: "Công ty", icon: Building2, color: "text-amber-600" },
  { key: "tickets", label: "Ticket", icon: Ticket, color: "text-red-600" },
  { key: "products", label: "Sản phẩm", icon: Package, color: "text-violet-600" },
  { key: "quotations", label: "Báo giá", icon: FileSpreadsheet, color: "text-cyan-600" },
];

const FIELD_TYPES: { key: FieldType; label: string; icon: React.ComponentType<{ className?: string }>; description: string }[] = [
  { key: "text", label: "Văn bản", icon: Type, description: "Một dòng text ngắn" },
  { key: "textarea", label: "Văn bản dài", icon: FileText, description: "Nhiều dòng text" },
  { key: "number", label: "Số", icon: Hash, description: "Số nguyên hoặc thập phân" },
  { key: "date", label: "Ngày", icon: CalendarDays, description: "Chọn ngày/giờ" },
  { key: "dropdown", label: "Dropdown", icon: List, description: "Chọn 1 từ danh sách" },
  { key: "multi-select", label: "Multi-select", icon: ListChecks, description: "Chọn nhiều giá trị" },
  { key: "checkbox", label: "Checkbox", icon: ToggleLeft, description: "Có / Không" },
  { key: "email", label: "Email", icon: Mail, description: "Địa chỉ email" },
  { key: "phone", label: "Điện thoại", icon: Phone, description: "Số điện thoại" },
  { key: "url", label: "URL", icon: Link2, description: "Đường dẫn website" },
  { key: "currency", label: "Tiền tệ", icon: DollarSign, description: "Giá trị tiền tệ" },
  { key: "rating", label: "Đánh giá", icon: Star, description: "Rating 1-5 sao" },
  { key: "formula", label: "Công thức", icon: Calculator, description: "Tính toán từ trường khác" },
  { key: "lookup", label: "Lookup", icon: SearchIcon, description: "Tham chiếu entity khác" },
];

function getFieldTypeConfig(type: FieldType) {
  return FIELD_TYPES.find((ft) => ft.key === type)!;
}

/* ============================================================
 * Mock Data
 * ============================================================ */
const INITIAL_GROUPS: FieldGroup[] = [
  { id: "g1", name: "Thông tin cơ bản", entity: "contacts", order: 0, isCollapsed: false },
  { id: "g2", name: "Thông tin công việc", entity: "contacts", order: 1, isCollapsed: false },
  { id: "g3", name: "Tuỳ chỉnh", entity: "contacts", order: 2, isCollapsed: false },
  { id: "g4", name: "Thông tin cơ bản", entity: "deals", order: 0, isCollapsed: false },
  { id: "g5", name: "Tài chính", entity: "deals", order: 1, isCollapsed: false },
  { id: "g6", name: "Tuỳ chỉnh", entity: "deals", order: 2, isCollapsed: false },
  { id: "g7", name: "Thông tin cơ bản", entity: "companies", order: 0, isCollapsed: false },
  { id: "g8", name: "Tuỳ chỉnh", entity: "companies", order: 1, isCollapsed: false },
  { id: "g9", name: "Thông tin cơ bản", entity: "tickets", order: 0, isCollapsed: false },
  { id: "g10", name: "Thông tin cơ bản", entity: "products", order: 0, isCollapsed: false },
  { id: "g11", name: "Thông tin cơ bản", entity: "quotations", order: 0, isCollapsed: false },
];

const INDUSTRY_OPTIONS: DropdownOption[] = [
  { value: "tech", label: "Công nghệ", color: "#6366f1" },
  { value: "finance", label: "Tài chính", color: "#059669" },
  { value: "healthcare", label: "Y tế", color: "#dc2626" },
  { value: "education", label: "Giáo dục", color: "#2563eb" },
  { value: "retail", label: "Bán lẻ", color: "#d97706" },
  { value: "manufacturing", label: "Sản xuất", color: "#7c3aed" },
  { value: "consulting", label: "Tư vấn", color: "#0891b2" },
  { value: "real-estate", label: "Bất động sản", color: "#65a30d" },
  { value: "other", label: "Khác", color: "#6b7280" },
];

const LEAD_SOURCE_OPTIONS: DropdownOption[] = [
  { value: "website", label: "Website", color: "#6366f1" },
  { value: "referral", label: "Giới thiệu", color: "#059669" },
  { value: "cold-call", label: "Cold Call", color: "#dc2626" },
  { value: "linkedin", label: "LinkedIn", color: "#2563eb" },
  { value: "event", label: "Sự kiện", color: "#d97706" },
  { value: "ads", label: "Quảng cáo", color: "#7c3aed" },
  { value: "partner", label: "Đối tác", color: "#0891b2" },
  { value: "ai-generated", label: "AI tìm kiếm", color: "#e11d48" },
];

const PRIORITY_OPTIONS: DropdownOption[] = [
  { value: "critical", label: "Khẩn cấp", color: "#dc2626" },
  { value: "high", label: "Cao", color: "#d97706" },
  { value: "medium", label: "Trung bình", color: "#2563eb" },
  { value: "low", label: "Thấp", color: "#6b7280" },
];

const INITIAL_FIELDS: CustomField[] = [
  // === CONTACTS ===
  { id: "cf1", name: "first_name", label: "Họ", type: "text", entity: "contacts", group: "Thông tin cơ bản", description: "", placeholder: "Nhập họ", defaultValue: "", isRequired: true, isUnique: false, isSearchable: true, isVisible: true, isSystem: true, order: 0, validations: [{ type: "required", message: "Họ là bắt buộc" }], createdAt: "2025-01-15", updatedAt: "2025-01-15" },
  { id: "cf2", name: "last_name", label: "Tên", type: "text", entity: "contacts", group: "Thông tin cơ bản", description: "", placeholder: "Nhập tên", defaultValue: "", isRequired: true, isUnique: false, isSearchable: true, isVisible: true, isSystem: true, order: 1, validations: [{ type: "required", message: "Tên là bắt buộc" }], createdAt: "2025-01-15", updatedAt: "2025-01-15" },
  { id: "cf3", name: "email", label: "Email", type: "email", entity: "contacts", group: "Thông tin cơ bản", description: "", placeholder: "example@email.com", defaultValue: "", isRequired: true, isUnique: true, isSearchable: true, isVisible: true, isSystem: true, order: 2, validations: [{ type: "required", message: "Email là bắt buộc" }, { type: "unique", message: "Email đã tồn tại" }], createdAt: "2025-01-15", updatedAt: "2025-01-15" },
  { id: "cf4", name: "phone", label: "Điện thoại", type: "phone", entity: "contacts", group: "Thông tin cơ bản", description: "", placeholder: "+84 xxx xxx xxx", defaultValue: "", isRequired: false, isUnique: false, isSearchable: true, isVisible: true, isSystem: true, order: 3, validations: [], createdAt: "2025-01-15", updatedAt: "2025-01-15" },
  { id: "cf5", name: "company", label: "Công ty", type: "lookup", entity: "contacts", group: "Thông tin công việc", description: "Liên kết tới entity Công ty", placeholder: "", defaultValue: "", isRequired: false, isUnique: false, isSearchable: true, isVisible: true, isSystem: true, order: 4, lookupEntity: "companies", lookupField: "name", validations: [], createdAt: "2025-01-15", updatedAt: "2025-01-15" },
  { id: "cf6", name: "job_title", label: "Chức danh", type: "text", entity: "contacts", group: "Thông tin công việc", description: "", placeholder: "VD: CEO, CTO, Sales Manager", defaultValue: "", isRequired: false, isUnique: false, isSearchable: true, isVisible: true, isSystem: true, order: 5, validations: [], createdAt: "2025-01-15", updatedAt: "2025-01-15" },
  { id: "cf7", name: "industry", label: "Ngành nghề", type: "dropdown", entity: "contacts", group: "Thông tin công việc", description: "Ngành nghề của liên hệ", placeholder: "Chọn ngành", defaultValue: "", isRequired: false, isUnique: false, isSearchable: true, isVisible: true, isSystem: false, order: 6, options: INDUSTRY_OPTIONS, validations: [], createdAt: "2025-06-01", updatedAt: "2026-01-10" },
  { id: "cf8", name: "lead_source", label: "Nguồn lead", type: "dropdown", entity: "contacts", group: "Thông tin công việc", description: "Lead đến từ đâu", placeholder: "Chọn nguồn", defaultValue: "", isRequired: false, isUnique: false, isSearchable: true, isVisible: true, isSystem: false, order: 7, options: LEAD_SOURCE_OPTIONS, validations: [], createdAt: "2025-06-15", updatedAt: "2026-01-10" },
  { id: "cf9", name: "birthday", label: "Ngày sinh", type: "date", entity: "contacts", group: "Tuỳ chỉnh", description: "", placeholder: "", defaultValue: "", isRequired: false, isUnique: false, isSearchable: false, isVisible: true, isSystem: false, order: 8, validations: [], createdAt: "2025-08-01", updatedAt: "2025-08-01" },
  { id: "cf10", name: "linkedin_url", label: "LinkedIn", type: "url", entity: "contacts", group: "Tuỳ chỉnh", description: "URL profile LinkedIn", placeholder: "https://linkedin.com/in/...", defaultValue: "", isRequired: false, isUnique: false, isSearchable: false, isVisible: true, isSystem: false, order: 9, validations: [], createdAt: "2025-09-01", updatedAt: "2025-09-01" },
  { id: "cf11", name: "lead_score", label: "Lead Score", type: "number", entity: "contacts", group: "Tuỳ chỉnh", description: "Điểm AI đánh giá lead (0-100)", placeholder: "0-100", defaultValue: "0", isRequired: false, isUnique: false, isSearchable: true, isVisible: true, isSystem: false, order: 10, validations: [{ type: "min", value: 0, message: "Tối thiểu 0" }, { type: "max", value: 100, message: "Tối đa 100" }], createdAt: "2025-10-01", updatedAt: "2026-02-01" },
  { id: "cf12", name: "satisfaction", label: "Mức hài lòng", type: "rating", entity: "contacts", group: "Tuỳ chỉnh", description: "Rating 1-5 sao", placeholder: "", defaultValue: "", isRequired: false, isUnique: false, isSearchable: false, isVisible: true, isSystem: false, order: 11, validations: [], createdAt: "2025-11-01", updatedAt: "2025-11-01" },
  { id: "cf13", name: "tags", label: "Nhãn", type: "multi-select", entity: "contacts", group: "Tuỳ chỉnh", description: "Tags phân loại", placeholder: "Chọn nhãn", defaultValue: "", isRequired: false, isUnique: false, isSearchable: true, isVisible: true, isSystem: false, order: 12, options: [{ value: "vip", label: "VIP", color: "#d97706" }, { value: "hot", label: "Hot", color: "#dc2626" }, { value: "warm", label: "Warm", color: "#2563eb" }, { value: "cold", label: "Cold", color: "#6b7280" }, { value: "partner", label: "Đối tác", color: "#059669" }], validations: [], createdAt: "2025-07-01", updatedAt: "2026-01-15" },

  // === DEALS ===
  { id: "df1", name: "deal_name", label: "Tên Deal", type: "text", entity: "deals", group: "Thông tin cơ bản", description: "", placeholder: "Tên deal", defaultValue: "", isRequired: true, isUnique: false, isSearchable: true, isVisible: true, isSystem: true, order: 0, validations: [{ type: "required", message: "Bắt buộc" }], createdAt: "2025-01-15", updatedAt: "2025-01-15" },
  { id: "df2", name: "amount", label: "Giá trị", type: "currency", entity: "deals", group: "Tài chính", description: "", placeholder: "0", defaultValue: "0", isRequired: true, isUnique: false, isSearchable: true, isVisible: true, isSystem: true, order: 1, validations: [{ type: "required", message: "Bắt buộc" }, { type: "min", value: 0, message: "Phải >= 0" }], createdAt: "2025-01-15", updatedAt: "2025-01-15" },
  { id: "df3", name: "close_date", label: "Ngày dự kiến đóng", type: "date", entity: "deals", group: "Thông tin cơ bản", description: "", placeholder: "", defaultValue: "", isRequired: true, isUnique: false, isSearchable: true, isVisible: true, isSystem: true, order: 2, validations: [{ type: "required", message: "Bắt buộc" }], createdAt: "2025-01-15", updatedAt: "2025-01-15" },
  { id: "df4", name: "win_probability", label: "Xác suất thắng", type: "number", entity: "deals", group: "Tài chính", description: "AI tính toán (%)", placeholder: "0-100", defaultValue: "0", isRequired: false, isUnique: false, isSearchable: true, isVisible: true, isSystem: false, order: 3, validations: [{ type: "min", value: 0, message: "Tối thiểu 0" }, { type: "max", value: 100, message: "Tối đa 100" }], createdAt: "2025-10-01", updatedAt: "2026-02-01" },
  { id: "df5", name: "margin", label: "Biên lợi nhuận (%)", type: "number", entity: "deals", group: "Tài chính", description: "Margin dự kiến", placeholder: "0-100", defaultValue: "", isRequired: false, isUnique: false, isSearchable: false, isVisible: true, isSystem: false, order: 4, validations: [], createdAt: "2025-12-01", updatedAt: "2025-12-01" },
  { id: "df6", name: "weighted_value", label: "Giá trị gia quyền", type: "formula", entity: "deals", group: "Tài chính", description: "= amount × win_probability / 100", placeholder: "", defaultValue: "", isRequired: false, isUnique: false, isSearchable: false, isVisible: true, isSystem: false, order: 5, formula: "amount * win_probability / 100", validations: [], createdAt: "2025-12-01", updatedAt: "2026-01-01" },
  { id: "df7", name: "priority", label: "Ưu tiên", type: "dropdown", entity: "deals", group: "Tuỳ chỉnh", description: "", placeholder: "Chọn mức", defaultValue: "medium", isRequired: false, isUnique: false, isSearchable: true, isVisible: true, isSystem: false, order: 6, options: PRIORITY_OPTIONS, validations: [], createdAt: "2026-01-01", updatedAt: "2026-01-01" },
  { id: "df8", name: "competitor", label: "Đối thủ cạnh tranh", type: "text", entity: "deals", group: "Tuỳ chỉnh", description: "Đối thủ trong deal này", placeholder: "Tên đối thủ", defaultValue: "", isRequired: false, isUnique: false, isSearchable: true, isVisible: true, isSystem: false, order: 7, validations: [], createdAt: "2026-01-15", updatedAt: "2026-01-15" },
  { id: "df9", name: "is_renewal", label: "Deal gia hạn?", type: "checkbox", entity: "deals", group: "Tuỳ chỉnh", description: "", placeholder: "", defaultValue: "false", isRequired: false, isUnique: false, isSearchable: false, isVisible: true, isSystem: false, order: 8, validations: [], createdAt: "2026-02-01", updatedAt: "2026-02-01" },

  // === COMPANIES ===
  { id: "cpf1", name: "company_name", label: "Tên công ty", type: "text", entity: "companies", group: "Thông tin cơ bản", description: "", placeholder: "Tên công ty", defaultValue: "", isRequired: true, isUnique: true, isSearchable: true, isVisible: true, isSystem: true, order: 0, validations: [{ type: "required", message: "Bắt buộc" }], createdAt: "2025-01-15", updatedAt: "2025-01-15" },
  { id: "cpf2", name: "website", label: "Website", type: "url", entity: "companies", group: "Thông tin cơ bản", description: "", placeholder: "https://...", defaultValue: "", isRequired: false, isUnique: false, isSearchable: false, isVisible: true, isSystem: true, order: 1, validations: [], createdAt: "2025-01-15", updatedAt: "2025-01-15" },
  { id: "cpf3", name: "employee_count", label: "Số nhân viên", type: "number", entity: "companies", group: "Thông tin cơ bản", description: "", placeholder: "0", defaultValue: "", isRequired: false, isUnique: false, isSearchable: true, isVisible: true, isSystem: false, order: 2, validations: [{ type: "min", value: 0, message: "Phải >= 0" }], createdAt: "2025-06-01", updatedAt: "2025-06-01" },
  { id: "cpf4", name: "annual_revenue", label: "Doanh thu năm", type: "currency", entity: "companies", group: "Tuỳ chỉnh", description: "Doanh thu ước tính (USD)", placeholder: "0", defaultValue: "", isRequired: false, isUnique: false, isSearchable: true, isVisible: true, isSystem: false, order: 3, validations: [], createdAt: "2025-08-01", updatedAt: "2025-08-01" },
];

/* ============================================================
 * Helper: Field Type Icon
 * ============================================================ */
function FieldTypeIcon({ type, className = "w-4 h-4" }: { type: FieldType; className?: string }) {
  const cfg = getFieldTypeConfig(type);
  const Icon = cfg.icon;
  return <Icon className={className} />;
}

/* ============================================================
 * Field Card
 * ============================================================ */
function FieldCard({
  field,
  index,
  onEdit,
  onDelete,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
}: {
  field: CustomField;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
  onToggleVisibility: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
}) {
  const cfg = getFieldTypeConfig(field.type);
  return (
    <div
      className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg border transition-colors group ${
        field.isVisible ? "bg-white border-gray-100 hover:border-violet-200" : "bg-gray-50 border-gray-100 opacity-60"
      }`}
    >
      {/* Drag handle + order buttons */}
      <div className="flex flex-col gap-0.5 flex-shrink-0">
        <button type="button" onClick={onMoveUp} disabled={isFirst}
          className="text-gray-300 hover:text-gray-500 disabled:opacity-20 disabled:cursor-default">
          <ArrowUp className="w-3 h-3" />
        </button>
        <GripVertical className="w-3.5 h-3.5 text-gray-300" />
        <button type="button" onClick={onMoveDown} disabled={isLast}
          className="text-gray-300 hover:text-gray-500 disabled:opacity-20 disabled:cursor-default">
          <ArrowDown className="w-3 h-3" />
        </button>
      </div>

      {/* Type icon */}
      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
        <FieldTypeIcon type={field.type} className="w-4 h-4 text-gray-500" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-sm text-gray-900 truncate">{field.label}</span>
          {field.isSystem && (
            <span className="text-[7px] px-1 py-0.5 bg-amber-100 text-amber-600 rounded flex-shrink-0">Hệ thống</span>
          )}
          {field.isRequired && (
            <span className="text-[7px] px-1 py-0.5 bg-red-100 text-red-600 rounded flex-shrink-0">Bắt buộc</span>
          )}
          {field.isUnique && (
            <span className="text-[7px] px-1 py-0.5 bg-blue-100 text-blue-600 rounded flex-shrink-0">Duy nhất</span>
          )}
          {field.isSearchable && (
            <SearchIcon className="w-3 h-3 text-gray-300 flex-shrink-0" />
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-[10px] text-gray-400">{cfg.label}</span>
          <span className="text-[10px] text-gray-300">•</span>
          <span className="text-[10px] text-gray-400 font-mono">{field.name}</span>
          {field.type === "formula" && field.formula && (
            <>
              <span className="text-[10px] text-gray-300">•</span>
              <span className="text-[10px] text-violet-400 font-mono">= {field.formula}</span>
            </>
          )}
        </div>
      </div>

      {/* Options count for dropdown/multi-select */}
      {field.options && field.options.length > 0 && (
        <span className="text-[9px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded hidden sm:block">
          {field.options.length} lựa chọn
        </span>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <button type="button" onClick={onToggleVisibility}
          className="p-1 text-gray-300 hover:text-gray-500" title={field.isVisible ? "Ẩn" : "Hiện"}>
          {field.isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
        </button>
        <button type="button" onClick={onEdit}
          className="p-1 text-gray-300 hover:text-violet-600" title="Chỉnh sửa">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        {!field.isSystem && (
          <button type="button" onClick={onDelete}
            className="p-1 text-gray-300 hover:text-red-500" title="Xoá">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * Field Editor Modal
 * ============================================================ */
function FieldEditorModal({
  field,
  isNew,
  entity,
  groups,
  onSave,
  onClose,
}: {
  field: CustomField | null;
  isNew: boolean;
  entity: string;
  groups: FieldGroup[];
  onSave: (f: CustomField) => void;
  onClose: () => void;
}) {
  const entityGroups = groups.filter((g) => g.entity === entity);
  const [form, setForm] = useState<CustomField>(
    field ?? {
      id: `cf_${Date.now()}`,
      name: "",
      label: "",
      type: "text",
      entity,
      group: entityGroups[0]?.name ?? "Tuỳ chỉnh",
      description: "",
      placeholder: "",
      defaultValue: "",
      isRequired: false,
      isUnique: false,
      isSearchable: false,
      isVisible: true,
      isSystem: false,
      order: 999,
      validations: [],
      createdAt: new Date().toISOString().slice(0, 10),
      updatedAt: new Date().toISOString().slice(0, 10),
    },
  );

  const [optionInput, setOptionInput] = useState("");

  const updateForm = (key: keyof CustomField, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addOption = () => {
    if (!optionInput.trim()) return;
    const opt: DropdownOption = {
      value: optionInput.trim().toLowerCase().replace(/\s+/g, "-"),
      label: optionInput.trim(),
      color: `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`,
    };
    updateForm("options", [...(form.options ?? []), opt]);
    setOptionInput("");
  };

  const removeOption = (val: string) => {
    updateForm("options", (form.options ?? []).filter((o) => o.value !== val));
  };

  const handleSave = () => {
    if (!form.label.trim()) {
      toast.error("Tên hiển thị là bắt buộc");
      return;
    }
    const name = form.name || form.label.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    onSave({ ...form, name, updatedAt: new Date().toISOString().slice(0, 10) });
  };

  const showOptions = form.type === "dropdown" || form.type === "multi-select";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] shadow-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">{isNew ? "Thêm trường mới" : `Chỉnh sửa: ${field?.label}`}</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Label & Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Tên hiển thị *</label>
              <input type="text" value={form.label}
                onChange={(e) => updateForm("label", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="VD: Ngày sinh"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Tên kỹ thuật</label>
              <input type="text" value={form.name}
                onChange={(e) => updateForm("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="auto_generate"
              />
            </div>
          </div>

          {/* Type */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Loại trường</label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {FIELD_TYPES.map((ft) => (
                <button key={ft.key} type="button"
                  onClick={() => !field?.isSystem && updateForm("type", ft.key)}
                  disabled={!!field?.isSystem}
                  className={`flex flex-col items-center gap-0.5 p-2 rounded-lg border text-center transition-colors ${
                    form.type === ft.key
                      ? "border-violet-300 bg-violet-50 text-violet-700"
                      : "border-gray-100 text-gray-400 hover:border-gray-200"
                  } ${field?.isSystem ? "cursor-not-allowed opacity-50" : ""}`}
                  title={ft.description}
                >
                  <ft.icon className="w-3.5 h-3.5" />
                  <span className="text-[8px] leading-tight">{ft.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Group */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Nhóm trường</label>
            <select value={form.group}
              onChange={(e) => updateForm("group", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
              {entityGroups.map((g) => (
                <option key={g.id} value={g.name}>{g.name}</option>
              ))}
            </select>
          </div>

          {/* Placeholder & Default */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Placeholder</label>
              <input type="text" value={form.placeholder}
                onChange={(e) => updateForm("placeholder", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Giá trị mặc định</label>
              <input type="text" value={form.defaultValue}
                onChange={(e) => updateForm("defaultValue", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Formula */}
          {form.type === "formula" && (
            <div>
              <label className="text-xs text-gray-500 block mb-1">Công thức</label>
              <input type="text" value={form.formula ?? ""}
                onChange={(e) => updateForm("formula", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="VD: amount * probability / 100"
              />
            </div>
          )}

          {/* Lookup */}
          {form.type === "lookup" && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Entity tham chiếu</label>
                <select value={form.lookupEntity ?? ""}
                  onChange={(e) => updateForm("lookupEntity", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  {ENTITIES.map((e) => (
                    <option key={e.key} value={e.key}>{e.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Trường hiển thị</label>
                <input type="text" value={form.lookupField ?? ""}
                  onChange={(e) => updateForm("lookupField", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="VD: name"
                />
              </div>
            </div>
          )}

          {/* Dropdown Options */}
          {showOptions && (
            <div>
              <label className="text-xs text-gray-500 block mb-1">Danh sách lựa chọn</label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {(form.options ?? []).map((opt) => (
                  <span key={opt.value} className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded text-xs">
                    {opt.color && <span className="w-2 h-2 rounded-full" style={{ background: opt.color }} />}
                    {opt.label}
                    <button type="button" onClick={() => removeOption(opt.value)} className="text-gray-400 hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={optionInput}
                  onChange={(e) => setOptionInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addOption())}
                  className="flex-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Thêm lựa chọn..."
                />
                <button type="button" onClick={addOption}
                  className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Toggles */}
          <div className="grid grid-cols-2 gap-2">
            {[
              { key: "isRequired" as const, label: "Bắt buộc", desc: "Phải nhập khi tạo" },
              { key: "isUnique" as const, label: "Duy nhất", desc: "Không trùng lặp" },
              { key: "isSearchable" as const, label: "Tìm kiếm", desc: "Có thể search" },
              { key: "isVisible" as const, label: "Hiển thị", desc: "Hiện trên form" },
            ].map((toggle) => (
              <label key={toggle.key}
                className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                  form[toggle.key] ? "border-violet-200 bg-violet-50" : "border-gray-100"
                }`}>
                <input type="checkbox" checked={form[toggle.key]}
                  onChange={(e) => updateForm(toggle.key, e.target.checked)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  form[toggle.key] ? "border-violet-500 bg-violet-500" : "border-gray-300"
                }`}>
                  {form[toggle.key] && <Check className="w-3 h-3 text-white" />}
                </div>
                <div>
                  <p className="text-xs text-gray-700">{toggle.label}</p>
                  <p className="text-[9px] text-gray-400">{toggle.desc}</p>
                </div>
              </label>
            ))}
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Mô tả (tuỳ chọn)</label>
            <textarea value={form.description}
              onChange={(e) => updateForm("description", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
              rows={2} placeholder="Mô tả trường này..."
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose}
            className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg">Huỷ</button>
          <button type="button" onClick={handleSave}
            className="px-4 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700">
            {isNew ? "Tạo trường" : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Preview Panel
 * ============================================================ */
function FormPreview({ fields, entity }: { fields: CustomField[]; entity: string }) {
  const entityLabel = ENTITIES.find((e) => e.key === entity)?.label ?? entity;
  const visibleFields = fields.filter((f) => f.isVisible);
  const groups = [...new Set(visibleFields.map((f) => f.group))];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <h4 className="text-sm text-gray-900 mb-3 flex items-center gap-2">
        <Eye className="w-4 h-4 text-violet-500" />
        Xem trước form — {entityLabel}
      </h4>
      <div className="space-y-4 max-h-[60vh] overflow-y-auto">
        {groups.map((group) => (
          <div key={group}>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">{group}</p>
            <div className="space-y-2.5">
              {visibleFields.filter((f) => f.group === group).map((field) => (
                <div key={field.id}>
                  <label className="text-xs text-gray-600 mb-1 block">
                    {field.label}
                    {field.isRequired && <span className="text-red-500 ml-0.5">*</span>}
                  </label>
                  {(field.type === "text" || field.type === "email" || field.type === "phone" || field.type === "url") && (
                    <input type="text" disabled placeholder={field.placeholder || field.label}
                      className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-400" />
                  )}
                  {field.type === "textarea" && (
                    <textarea disabled placeholder={field.placeholder || field.label} rows={2}
                      className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-400 resize-none" />
                  )}
                  {(field.type === "number" || field.type === "currency") && (
                    <input type="text" disabled placeholder={field.placeholder || "0"}
                      className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-400" />
                  )}
                  {field.type === "date" && (
                    <input type="text" disabled placeholder="dd/mm/yyyy"
                      className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-400" />
                  )}
                  {field.type === "dropdown" && (
                    <select disabled className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-400">
                      <option>{field.placeholder || "Chọn..."}</option>
                      {field.options?.map((o) => <option key={o.value}>{o.label}</option>)}
                    </select>
                  )}
                  {field.type === "multi-select" && (
                    <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border border-gray-200 rounded-lg min-h-[34px]">
                      {field.options?.slice(0, 2).map((o) => (
                        <span key={o.value} className="text-[9px] px-1.5 py-0.5 bg-gray-200 text-gray-500 rounded">{o.label}</span>
                      ))}
                      {(field.options?.length ?? 0) > 2 && (
                        <span className="text-[9px] text-gray-400">+{(field.options?.length ?? 0) - 2}</span>
                      )}
                    </div>
                  )}
                  {field.type === "checkbox" && (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded border-2 border-gray-300" />
                      <span className="text-xs text-gray-400">{field.label}</span>
                    </div>
                  )}
                  {field.type === "rating" && (
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-4 h-4 text-gray-300" />
                      ))}
                    </div>
                  )}
                  {field.type === "formula" && (
                    <div className="px-3 py-1.5 bg-violet-50 border border-violet-200 rounded-lg text-xs text-violet-600 font-mono">
                      = {field.formula}
                    </div>
                  )}
                  {field.type === "lookup" && (
                    <div className="px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-600">
                      🔗 Tham chiếu: {ENTITIES.find((e) => e.key === field.lookupEntity)?.label} → {field.lookupField}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính Custom Fields Manager
 * ============================================================ */
export function CustomFieldsPage() {
  const [fields, setFields] = useState<CustomField[]>(INITIAL_FIELDS);
  const [groups] = useState<FieldGroup[]>(INITIAL_GROUPS);
  const [selectedEntity, setSelectedEntity] = useState("contacts");
  const [search, setSearch] = useState("");
  const [editingField, setEditingField] = useState<CustomField | null>(null);
  const [isNewField, setIsNewField] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [deleteFieldTarget, setDeleteFieldTarget] = useState<CustomField | null>(null);

  const entityFields = useMemo(() => {
    let result = fields.filter((f) => f.entity === selectedEntity);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (f) => f.label.toLowerCase().includes(q) || f.name.toLowerCase().includes(q) || f.type.includes(q),
      );
    }
    return result.sort((a, b) => a.order - b.order);
  }, [fields, selectedEntity, search]);

  const fieldGroups = useMemo(() => {
    const gMap = new Map<string, CustomField[]>();
    entityFields.forEach((f) => {
      const list = gMap.get(f.group) ?? [];
      list.push(f);
      gMap.set(f.group, list);
    });
    return gMap;
  }, [entityFields]);

  const stats = useMemo(() => {
    const ef = fields.filter((f) => f.entity === selectedEntity);
    return {
      total: ef.length,
      system: ef.filter((f) => f.isSystem).length,
      custom: ef.filter((f) => !f.isSystem).length,
      required: ef.filter((f) => f.isRequired).length,
      hidden: ef.filter((f) => !f.isVisible).length,
    };
  }, [fields, selectedEntity]);

  const handleSaveField = useCallback((updated: CustomField) => {
    setFields((prev) => {
      const exists = prev.find((f) => f.id === updated.id);
      if (exists) {
        return prev.map((f) => (f.id === updated.id ? updated : f));
      }
      return [...prev, { ...updated, order: prev.filter((f) => f.entity === updated.entity).length }];
    });
    setEditingField(null);
    setIsNewField(false);
    toast.success(isNewField ? `Đã tạo trường "${updated.label}"` : `Đã cập nhật "${updated.label}"`);
  }, [isNewField]);

  const handleDeleteField = useCallback((id: string) => {
    const f = fields.find((x) => x.id === id);
    if (f?.isSystem) {
      toast.error("Không thể xoá trường hệ thống");
      return;
    }
    setFields((prev) => prev.filter((x) => x.id !== id));
    toast.success(`Đã xoá trường "${f?.label}"`);
    setDeleteFieldTarget(null);
  }, [fields]);

  const handleToggleVisibility = useCallback((id: string) => {
    setFields((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isVisible: !f.isVisible } : f)),
    );
  }, []);

  const handleMoveField = useCallback((id: string, direction: "up" | "down") => {
    setFields((prev) => {
      const entityFields = prev
        .filter((f) => f.entity === selectedEntity)
        .sort((a, b) => a.order - b.order);
      const idx = entityFields.findIndex((f) => f.id === id);
      if (idx < 0) return prev;
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= entityFields.length) return prev;

      const currentOrder = entityFields[idx].order;
      const swapOrder = entityFields[swapIdx].order;

      return prev.map((f) => {
        if (f.id === entityFields[idx].id) return { ...f, order: swapOrder };
        if (f.id === entityFields[swapIdx].id) return { ...f, order: currentOrder };
        return f;
      });
    });
  }, [selectedEntity]);

  const entityLabel = ENTITIES.find((e) => e.key === selectedEntity)?.label;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <Layers className="w-6 h-6 text-violet-600" /> Quản lý Trường Tuỳ chỉnh
        </h1>
        <p className="text-gray-500 mt-0.5">
          Thêm, sửa, sắp xếp trường dữ liệu cho mỗi entity — Custom Fields Manager
        </p>
      </header>

      {/* Entity Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 p-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {ENTITIES.map((entity) => {
            const count = fields.filter((f) => f.entity === entity.key).length;
            const Icon = entity.icon;
            return (
              <button key={entity.key} type="button"
                onClick={() => setSelectedEntity(entity.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
                  selectedEntity === entity.key
                    ? "bg-violet-50 text-violet-700 border border-violet-200"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50 border border-transparent"
                }`}>
                <Icon className="w-4 h-4" />
                {entity.label}
                <span className="text-[9px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded-full">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-[10px] text-gray-400">Tổng trường</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-3 text-center">
          <p className="text-lg text-amber-600">{stats.system}</p>
          <p className="text-[10px] text-amber-700">Hệ thống</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-3 text-center">
          <p className="text-lg text-blue-600">{stats.custom}</p>
          <p className="text-[10px] text-blue-700">Tuỳ chỉnh</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-3 text-center hidden sm:block">
          <p className="text-lg text-red-600">{stats.required}</p>
          <p className="text-[10px] text-red-700">Bắt buộc</p>
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 text-center hidden sm:block">
          <p className="text-lg text-gray-500">{stats.hidden}</p>
          <p className="text-[10px] text-gray-500">Đang ẩn</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[150px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Tìm trường..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <button type="button"
          onClick={() => setShowPreview(!showPreview)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition-colors ${
            showPreview ? "bg-violet-50 border-violet-200 text-violet-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}>
          <Eye className="w-4 h-4" />
          <span className="hidden sm:inline">Xem trước</span>
        </button>
        <button type="button"
          onClick={() => { setEditingField(null); setIsNewField(true); }}
          className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">
          <Plus className="w-4 h-4" /> Thêm trường
        </button>
      </div>

      {/* Main Content */}
      <div className={`grid gap-5 ${showPreview ? "grid-cols-1 lg:grid-cols-5" : "grid-cols-1"}`}>
        {/* Field List */}
        <div className={showPreview ? "lg:col-span-3" : ""}>
          <div className="space-y-4">
            {Array.from(fieldGroups.entries()).map(([groupName, groupFields]) => (
              <div key={groupName} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-gray-400" />
                    <span className="text-xs text-gray-700">{groupName}</span>
                    <span className="text-[8px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full">{groupFields.length}</span>
                  </div>
                </div>
                <div className="p-2 space-y-1">
                  {groupFields.map((field, idx) => (
                    <FieldCard
                      key={field.id}
                      field={field}
                      index={idx}
                      onEdit={() => { setEditingField(field); setIsNewField(false); }}
                      onDelete={() => setDeleteFieldTarget(field)}
                      onToggleVisibility={() => handleToggleVisibility(field.id)}
                      onMoveUp={() => handleMoveField(field.id, "up")}
                      onMoveDown={() => handleMoveField(field.id, "down")}
                      isFirst={idx === 0}
                      isLast={idx === groupFields.length - 1}
                    />
                  ))}
                </div>
              </div>
            ))}

            {entityFields.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                <Layers className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Chưa có trường nào cho {entityLabel}</p>
                <button type="button"
                  onClick={() => { setEditingField(null); setIsNewField(true); }}
                  className="mt-2 text-sm text-violet-600 hover:text-violet-700">
                  + Thêm trường đầu tiên
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        {showPreview && (
          <div className="lg:col-span-2">
            <div className="sticky top-20">
              <FormPreview fields={entityFields} entity={selectedEntity} />
            </div>
          </div>
        )}
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Field Suggestions</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>Đề xuất thêm trường <strong>"Preferred Contact Method"</strong> (dropdown: Email/Phone/WhatsApp) cho Contacts — 78% CRM hàng đầu có trường này.</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span>Trường <strong>"Lead Score"</strong> đang là nhập tay — recommend chuyển sang <strong>formula</strong> hoặc <strong>AI-computed</strong> để đảm bảo tính nhất quán.</span>
          </p>
          <p className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <span>Entity <strong>"Deals"</strong> thiếu trường <strong>"Decision Maker"</strong> (lookup → Contacts) — thêm để track stakeholder chính trong deal.</span>
          </p>
        </div>
      </div>

      {/* Field Editor Modal */}
      {(editingField || isNewField) && (
        <FieldEditorModal
          field={editingField}
          isNew={isNewField}
          entity={selectedEntity}
          groups={groups}
          onSave={handleSaveField}
          onClose={() => { setEditingField(null); setIsNewField(false); }}
        />
      )}
      <ConfirmDeleteDialog
        open={!!deleteFieldTarget}
        onClose={() => setDeleteFieldTarget(null)}
        onConfirm={() => { if (deleteFieldTarget) handleDeleteField(deleteFieldTarget.id); }}
        itemName={deleteFieldTarget?.label ?? ""}
        entityType="trường tuỳ chỉnh"
        description="Hành động này không thể hoàn tác. Dữ liệu đã nhập trong trường này sẽ bị mất."
      />
    </div>
  );
}