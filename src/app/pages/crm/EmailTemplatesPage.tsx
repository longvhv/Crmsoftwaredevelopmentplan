/**
 * Email Templates Page — Quản lý mẫu email với AI scoring
 * Phase P2.02: Table + List view, full CRUD, preview, editor
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Search,
  Mail,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Copy,
  TrendingUp,
  MousePointerClick,
  Zap,
  Bot,
  Code,
  BarChart3,
  X,
  Download,
  Upload,
  CheckCircle2,
  Clock,
  Archive,
} from "lucide-react";
import { toast } from "sonner";
import type { EmailTemplate, EmailTemplateCategory, EmailTemplateStatus } from "../../types/crm";
import type { ColumnDef } from "../../types/dataTable";
import {
  EMAIL_TEMPLATE_CATEGORY_CONFIG,
  EMAIL_TEMPLATE_STATUS_CONFIG,
  CRM_ASSIGNEES,
} from "../../constants/crmConfig";
import {
  fetchEmailTemplates,
  createEmailTemplate,
  updateEmailTemplate,
  deleteEmailTemplate,
  deleteEmailTemplates,
} from "../../api/crmApi";
import { DataTable } from "../../components/crm/DataTable";
import { ViewToggle } from "../../components/crm/ViewToggle";
import { PaginationBar } from "../../components/crm/PaginationBar";
import { useViewMode } from "../../hooks/useViewMode";
import { usePagination } from "../../hooks/usePagination";
import { AIScoreTrigger } from "../../components/crm/AIScoreModal";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";

/* ============================================================
 * Preview Modal
 * ============================================================ */
function PreviewModal({ template, onClose, onEdit }: { template: EmailTemplate; onClose: () => void; onEdit: () => void }) {
  const categoryCfg = EMAIL_TEMPLATE_CATEGORY_CONFIG[template.category];
  const statusCfg = EMAIL_TEMPLATE_STATUS_CONFIG[template.status];
  const creator = CRM_ASSIGNEES.find((a) => a.id === template.createdBy);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-blue-50">
          <div className="flex-1 min-w-0">
            <h3 className="text-gray-900 mb-1 truncate">{template.name}</h3>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-[10px] px-2 py-0.5 rounded ${categoryCfg.bgColor} ${categoryCfg.color}`}>
                {categoryCfg.label}
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded ${statusCfg.bgColor} ${statusCfg.color}`}>
                {statusCfg.label}
              </span>
              {template.tags.slice(0, 2).map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">{tag}</span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 ml-3">
            <button
              type="button"
              onClick={onEdit}
              className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
              title="Chỉnh sửa"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button type="button" onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-5 space-y-4">
          {/* Stats row */}
          <div className="grid grid-cols-4 gap-3">
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-100 text-center">
              <p className="text-xs text-blue-600 mb-1">Đã dùng</p>
              <p className="text-lg text-blue-700">{template.usageCount}</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 border border-green-100 text-center">
              <p className="text-xs text-green-600 mb-1 flex items-center justify-center gap-0.5">
                <Mail className="w-3 h-3" /> Open Rate
              </p>
              <p className="text-lg text-green-700">{template.openRate}%</p>
            </div>
            <div className="bg-violet-50 rounded-lg p-3 border border-violet-100 text-center">
              <p className="text-xs text-violet-600 mb-1 flex items-center justify-center gap-0.5">
                <MousePointerClick className="w-3 h-3" /> CTR
              </p>
              <p className="text-lg text-violet-700">{template.ctr}%</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-100 text-center">
              <p className="text-xs text-indigo-600 mb-1 flex items-center justify-center gap-0.5">
                <Bot className="w-3 h-3" /> AI Score
              </p>
              <p className="text-lg text-indigo-700">{template.aiScore}</p>
            </div>
          </div>

          {/* Subject */}
          <div>
            <p className="text-xs text-gray-400 mb-1.5 flex items-center gap-1">
              <Mail className="w-3 h-3" /> Subject Line
            </p>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <p className="text-sm text-gray-900">{template.subject}</p>
            </div>
          </div>

          {/* Variables */}
          {template.variables.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-1.5 flex items-center gap-1">
                <Code className="w-3 h-3" /> Variables
              </p>
              <div className="flex flex-wrap gap-1.5">
                {template.variables.map((v) => (
                  <span key={v} className="text-[10px] px-2 py-1 rounded bg-violet-100 text-violet-700 font-mono">
                    {`{{${v}}}`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Body Preview */}
          <div>
            <p className="text-xs text-gray-400 mb-1.5">Email Body (HTML)</p>
            <div
              className="bg-white rounded-lg p-4 border border-gray-200 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: template.bodyHtml }}
            />
          </div>

          {/* Plain text */}
          <div>
            <p className="text-xs text-gray-400 mb-1.5">Plain Text Version</p>
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
              <pre className="text-xs text-gray-600 whitespace-pre-wrap font-sans">{template.bodyText}</pre>
            </div>
          </div>

          {/* Meta info */}
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 text-xs text-gray-500 space-y-1">
            <p className="flex items-center gap-1.5">
              <Clock className="w-3 h-3" />
              Tạo: {new Date(template.createdAt).toLocaleDateString("vi-VN")}
              {creator && ` bởi ${creator.name}`}
            </p>
            <p>Cập nhật: {new Date(template.updatedAt).toLocaleDateString("vi-VN")}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button
            type="button"
            onClick={() => {
              toast.success(`Đã sao chép template "${template.name}"`);
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Copy className="w-4 h-4" /> Nhân bản
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors"
          >
            <Pencil className="w-4 h-4" /> Chỉnh sửa
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Editor Modal (Simplified)
 * ============================================================ */
function EditorModal({
  template,
  onClose,
  onSave,
}: {
  template: EmailTemplate | null;
  onClose: () => void;
  onSave: (data: Partial<EmailTemplate>) => void;
}) {
  const isNew = !template;
  const [name, setName] = useState(template?.name ?? "");
  const [subject, setSubject] = useState(template?.subject ?? "");
  const [category, setCategory] = useState<EmailTemplateCategory>(template?.category ?? "cold-outreach");
  const [status, setStatus] = useState<EmailTemplateStatus>(template?.status ?? "draft");
  const [bodyHtml, setBodyHtml] = useState(template?.bodyHtml ?? "");
  const [bodyText, setBodyText] = useState(template?.bodyText ?? "");
  const [tags, setTags] = useState(template?.tags.join(", ") ?? "");

  const handleSave = () => {
    if (!name.trim() || !subject.trim() || !bodyHtml.trim()) {
      toast.error("Vui lòng điền đầy đủ tên, subject, và nội dung email");
      return;
    }

    // Extract variables from bodyHtml and bodyText
    const allText = bodyHtml + " " + bodyText;
    const matches = allText.match(/\{\{(\w+)\}\}/g) ?? [];
    const variables = [...new Set(matches.map((m) => m.replace(/[{}]/g, "")))];

    onSave({
      name,
      subject,
      category,
      status,
      bodyHtml,
      bodyText: bodyText || bodyHtml.replace(/<[^>]*>/g, ""),
      variables,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">{isNew ? "Tạo Email Template Mới" : "Chỉnh sửa Template"}</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Tên template *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="VD: Cold Outreach - Tech"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Danh mục</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as EmailTemplateCategory)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {Object.entries(EMAIL_TEMPLATE_CATEGORY_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Subject line *</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="VD: Quick question about {{company}}"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
            <p className="text-[10px] text-gray-400 mt-1">Dùng {`{{variableName}}`} để personalize</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Trạng thái</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EmailTemplateStatus)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {Object.entries(EMAIL_TEMPLATE_STATUS_CONFIG).map(([key, cfg]) => (
                  <option key={key} value={key}>{cfg.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Tags (cách nhau bởi dấu phẩy)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="VD: high-performing, ai-generated"
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Email body (HTML) *</label>
            <textarea
              value={bodyHtml}
              onChange={(e) => setBodyHtml(e.target.value)}
              rows={10}
              placeholder="<p>Hi {{firstName}},</p><p>Content here...</p>"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs text-gray-600 mb-1">Plain text version (tùy chọn)</label>
            <textarea
              value={bodyText}
              onChange={(e) => setBodyText(e.target.value)}
              rows={6}
              placeholder="Hi {{firstName}},\n\nContent here..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 font-mono"
            />
            <p className="text-[10px] text-gray-400 mt-1">Để trống sẽ tự động tạo từ HTML</p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" /> {isNew ? "Tạo Template" : "Lưu Thay Đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Template Card (List View)
 * ============================================================ */
function TemplateCard({
  template,
  onPreview,
  onEdit,
  onDelete,
}: {
  template: EmailTemplate;
  onPreview: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const categoryCfg = EMAIL_TEMPLATE_CATEGORY_CONFIG[template.category];
  const statusCfg = EMAIL_TEMPLATE_STATUS_CONFIG[template.status];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm text-gray-900 mb-1 truncate">{template.name}</h4>
          <p className="text-xs text-gray-400 truncate mb-2">{template.subject}</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${categoryCfg.bgColor} ${categoryCfg.color}`}>
              {categoryCfg.label}
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${statusCfg.bgColor} ${statusCfg.color}`}>
              {statusCfg.label}
            </span>
            {template.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{tag}</span>
            ))}
          </div>
        </div>
        <AIScoreTrigger score={template.aiScore} name={template.name} category="email-template" />
      </div>

      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="text-center bg-blue-50 rounded-lg p-2 border border-blue-100">
          <p className="text-xs text-blue-700">{template.usageCount}</p>
          <p className="text-[10px] text-blue-600">Đã dùng</p>
        </div>
        <div className="text-center bg-green-50 rounded-lg p-2 border border-green-100">
          <p className="text-xs text-green-700">{template.openRate}%</p>
          <p className="text-[10px] text-green-600">Open</p>
        </div>
        <div className="text-center bg-violet-50 rounded-lg p-2 border border-violet-100">
          <p className="text-xs text-violet-700">{template.ctr}%</p>
          <p className="text-[10px] text-violet-600">CTR</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onPreview}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs text-violet-600 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors"
        >
          <Eye className="w-3.5 h-3.5" /> Xem
        </button>
        <button
          type="button"
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-1 px-2 py-1.5 text-xs text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" /> Sửa
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ============================================================
 * Main Page
 * ============================================================ */
export function EmailTemplatesPage() {
  // State
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<EmailTemplateCategory | null>(null);
  const [filterStatus, setFilterStatus] = useState<EmailTemplateStatus | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null | undefined>(null);
  const [deleteTarget, setDeleteTarget] = useState<EmailTemplate | null>(null);

  // Hooks
  const { mode: viewMode, setMode: setViewMode } = useViewMode("email-templates", "table");

  // Load data
  const loadTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchEmailTemplates({ search, category: filterCategory, status: filterStatus });
      setTemplates(data);
    } catch (error) {
      toast.error("Không thể tải danh sách templates");
    } finally {
      setLoading(false);
    }
  }, [search, filterCategory, filterStatus]);

  useEffect(() => {
    loadTemplates();
  }, [loadTemplates]);

  // Stats
  const stats = useMemo(() => {
    const active = templates.filter((t) => t.status === "active").length;
    const draft = templates.filter((t) => t.status === "draft").length;
    const avgOpenRate = templates.length > 0 ? Math.round(templates.reduce((s, t) => s + t.openRate, 0) / templates.length) : 0;
    const avgCtr = templates.length > 0 ? Math.round(templates.reduce((s, t) => s + t.ctr, 0) / templates.length) : 0;
    const totalUsage = templates.reduce((s, t) => s + t.usageCount, 0);
    const avgAiScore = templates.length > 0 ? Math.round(templates.reduce((s, t) => s + t.aiScore, 0) / templates.length) : 0;
    return { total: templates.length, active, draft, avgOpenRate, avgCtr, totalUsage, avgAiScore };
  }, [templates]);

  // Sorted & paginated
  const sorted = useMemo(() => {
    return [...templates].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }, [templates]);

  const {
    paginatedItems: paginated,
    currentPage, totalPages, totalItems,
    pageSize, startIndex, endIndex,
    isFirstPage, isLastPage,
    goToPage, nextPage, prevPage, setPageSize,
  } = usePagination(sorted, { storageKey: "email-templates", initialPageSize: 10 });

  // Handlers
  const handleCreate = useCallback(
    async (data: Partial<EmailTemplate>) => {
      const now = new Date().toISOString();
      await createEmailTemplate({
        name: data.name!,
        subject: data.subject!,
        category: data.category!,
        status: data.status!,
        bodyHtml: data.bodyHtml!,
        bodyText: data.bodyText!,
        variables: data.variables ?? [],
        usageCount: 0,
        openRate: 0,
        ctr: 0,
        aiScore: Math.floor(Math.random() * 30) + 60, // Mock AI score 60-90
        createdBy: "e1",
        createdAt: now,
        updatedAt: now,
        tags: data.tags ?? [],
      });
      toast.success(`Đã tạo template "${data.name}"`);
      setEditingTemplate(null);
      loadTemplates();
    },
    [loadTemplates],
  );

  const handleUpdate = useCallback(
    async (data: Partial<EmailTemplate>) => {
      if (!editingTemplate || !editingTemplate.id) return;
      await updateEmailTemplate(editingTemplate.id, { ...data, updatedAt: new Date().toISOString() });
      toast.success(`Đã cập nhật template "${data.name ?? editingTemplate.name}"`);
      setEditingTemplate(null);
      loadTemplates();
    },
    [editingTemplate, loadTemplates],
  );

  const handleDelete = useCallback(
    async () => {
      if (!deleteTarget) return;
      await deleteEmailTemplate(deleteTarget.id);
      toast.success(`Đã xoá template "${deleteTarget.name}"`);
      setDeleteTarget(null);
      loadTemplates();
    },
    [deleteTarget, loadTemplates],
  );

  const handleTemplateInlineEdit = useCallback(
    async (rowId: string, field: string, value: unknown) => {
      await updateEmailTemplate(rowId, { [field]: value, updatedAt: new Date().toISOString() });
      toast.success("Đã cập nhật template");
      loadTemplates();
    },
    [loadTemplates],
  );

  // Table columns
  const columns: ColumnDef<EmailTemplate>[] = [
    {
      key: "name",
      header: "Tên",
      sortable: true,
      render: (t) => (
        <div className="min-w-0">
          <div className="text-sm text-gray-900 truncate">{t.name}</div>
          <div className="text-xs text-gray-400 truncate">{t.subject}</div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Danh mục",
      render: (t) => {
        const cfg = EMAIL_TEMPLATE_CATEGORY_CONFIG[t.category];
        return <span className={`text-[11px] px-2 py-0.5 rounded ${cfg.bgColor} ${cfg.color}`}>{cfg.label}</span>;
      },
    },
    {
      key: "status",
      header: "Trạng thái",
      editable: true,
      render: (t) => {
        const cfg = EMAIL_TEMPLATE_STATUS_CONFIG[t.status];
        return <span className={`text-[11px] px-2 py-0.5 rounded ${cfg.bgColor} ${cfg.color}`}>{cfg.label}</span>;
      },
      renderEdit: (item, _v, onChange, onSave) => (
        <select value={item.status} onChange={(e) => { onChange(e.target.value); onSave(); }}
          onBlur={onSave} autoFocus
          className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
          {Object.entries(EMAIL_TEMPLATE_STATUS_CONFIG).map(([k, cfg]) => <option key={k} value={k}>{cfg.label}</option>)}
        </select>
      ),
    },
    {
      key: "usageCount",
      header: "Đã dùng",
      sortable: true,
      render: (t) => <span className="text-sm text-gray-700">{t.usageCount}</span>,
    },
    {
      key: "openRate",
      header: "Open Rate",
      sortable: true,
      render: (t) => (
        <span className="text-sm text-green-700 flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" /> {t.openRate}%
        </span>
      ),
    },
    {
      key: "ctr",
      header: "CTR",
      sortable: true,
      render: (t) => (
        <span className="text-sm text-violet-700 flex items-center gap-1">
          <MousePointerClick className="w-3.5 h-3.5" /> {t.ctr}%
        </span>
      ),
    },
    {
      key: "aiScore",
      header: "AI Score",
      sortable: true,
      render: (t) => <AIScoreTrigger score={t.aiScore} name={t.name} category="email-template" />,
    },
    {
      key: "actions",
      header: "",
      minWidth: 100,
      render: (t) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setPreviewTemplate(t)}
            className="p-1.5 text-gray-400 hover:text-violet-600 rounded-lg hover:bg-violet-50"
            title="Xem"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setEditingTemplate(t)}
            className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
            title="Sửa"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setDeleteTarget(t)}
            className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
            title="Xoá"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-gray-900">Email Templates</h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 flex items-center gap-1">
              <Zap className="w-3 h-3" /> AI-Optimized
            </span>
          </div>
          <p className="text-gray-500">Quản lý mẫu email · Personalization · AI scoring</p>
        </div>
        <button
          type="button"
          onClick={() => setEditingTemplate(undefined)}
          className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Tạo Template
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Tổng</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-3 text-center">
          <p className="text-lg text-green-700 flex items-center justify-center gap-0.5">
            <CheckCircle2 className="w-4 h-4" /> {stats.active}
          </p>
          <p className="text-xs text-green-600">Đang dùng</p>
        </div>
        <div className="bg-gray-50 rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-lg text-gray-700">{stats.draft}</p>
          <p className="text-xs text-gray-600">Nháp</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-3 text-center">
          <p className="text-lg text-blue-700">{stats.totalUsage}</p>
          <p className="text-xs text-blue-600">Lượt dùng</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-3 text-center">
          <p className="text-lg text-green-700">{stats.avgOpenRate}%</p>
          <p className="text-xs text-green-600">Open TB</p>
        </div>
        <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-3 text-center">
          <p className="text-lg text-indigo-700 flex items-center justify-center gap-0.5">
            <Bot className="w-4 h-4" /> {stats.avgAiScore}
          </p>
          <p className="text-xs text-indigo-600">AI Score TB</p>
        </div>
      </div>

      {/* Filters & View Toggle */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm template, subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 w-64"
            />
          </div>

          {/* Category filter */}
          <select
            value={filterCategory ?? ""}
            onChange={(e) => setFilterCategory(e.target.value ? (e.target.value as EmailTemplateCategory) : null)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">Tất cả danh mục</option>
            {Object.entries(EMAIL_TEMPLATE_CATEGORY_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={filterStatus ?? ""}
            onChange={(e) => setFilterStatus(e.target.value ? (e.target.value as EmailTemplateStatus) : null)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">Tất cả trạng thái</option>
            {Object.entries(EMAIL_TEMPLATE_STATUS_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>
                {cfg.label}
              </option>
            ))}
          </select>
        </div>

        {/* View Toggle */}
        <ViewToggle mode={viewMode} onSetMode={setViewMode} modes={["table", "card"]} />
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
        </div>
      ) : paginated.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Không có template nào</p>
          <button
            type="button"
            onClick={() => setEditingTemplate(undefined)}
            className="mt-3 text-sm text-violet-600 hover:text-violet-700"
          >
            Tạo template đầu tiên
          </button>
        </div>
      ) : viewMode === "table" ? (
        <DataTable data={paginated} columns={columns} storageKey="email-templates" onRowClick={(t) => setPreviewTemplate(t)} onInlineEdit={handleTemplateInlineEdit} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginated.map((t) => (
            <TemplateCard
              key={t.id}
              template={t}
              onPreview={() => setPreviewTemplate(t)}
              onEdit={() => setEditingTemplate(t)}
              onDelete={() => setDeleteTarget(t)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          startIndex={startIndex}
          endIndex={endIndex}
          isFirstPage={isFirstPage}
          isLastPage={isLastPage}
          onGoToPage={goToPage}
          onNextPage={nextPage}
          onPrevPage={prevPage}
          onSetPageSize={setPageSize}
        />
      )}

      {/* Preview Modal */}
      {previewTemplate && (
        <PreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onEdit={() => {
            setEditingTemplate(previewTemplate);
            setPreviewTemplate(null);
          }}
        />
      )}

      {/* Editor Modal */}
      {editingTemplate !== null && (
        <EditorModal
          template={editingTemplate || null}
          onClose={() => setEditingTemplate(null)}
          onSave={editingTemplate?.id ? handleUpdate : handleCreate}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.name ?? ""}
        entityType="template"
        description="Template đã xoá không thể khôi phục."
      />
    </div>
  );
}