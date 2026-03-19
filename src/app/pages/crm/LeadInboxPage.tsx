/**
 * Lead Inbox Page — Quản lý nguồn lead đầu vào với AI auto-qualify
 * Phase P2.01: Table + List view, full CRUD, filters, bulk actions
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  Bot,
  Upload,
  Download,
  UserPlus,
  Trash2,
  Mail,
  Phone,
  Clock,
  Eye,
  Pencil,
  Globe,
  Linkedin,
  Star,
  Users,
  Megaphone,
  TrendingUp,
  X,
  CheckSquare,
  Square,
  ArrowRight,
  Zap,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import type { Lead, LeadStatus, LeadChannel } from "../../types/crm";
import type { ColumnDef } from "../../types/dataTable";
import { LEAD_STATUS_CONFIG, LEAD_CHANNEL_CONFIG, CRM_ASSIGNEES } from "../../constants/crmConfig";
import { fetchLeads, createLead, updateLead, deleteLead, deleteLeads } from "../../api/crmApi";
import { DataTable } from "../../components/crm/DataTable";
import { ViewToggle } from "../../components/crm/ViewToggle";
import { PaginationBar } from "../../components/crm/PaginationBar";
import { useViewMode } from "../../hooks/useViewMode";
import { usePagination } from "../../hooks/usePagination";
import { AIScoreTrigger } from "../../components/crm/AIScoreModal";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";

/* ============================================================
 * Channel Icons Helper
 * ============================================================ */
function getChannelIcon(channel: LeadChannel) {
  switch (channel) {
    case "website": return <Globe className="w-3.5 h-3.5" />;
    case "linkedin": return <Linkedin className="w-3.5 h-3.5" />;
    case "clutch": return <Star className="w-3.5 h-3.5" />;
    case "cold-outreach": return <Mail className="w-3.5 h-3.5" />;
    case "referral": return <Users className="w-3.5 h-3.5" />;
    case "event": return <Megaphone className="w-3.5 h-3.5" />;
    case "inbound": return <TrendingUp className="w-3.5 h-3.5" />;
    case "partner": return <Users className="w-3.5 h-3.5" />;
    default: return <Mail className="w-3.5 h-3.5" />;
  }
}

/* ============================================================
 * Helper: Time ago
 * ============================================================ */
function getTimeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  if (hours < 1) return "Vừa xong";
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Hôm qua";
  return `${days} ngày trước`;
}

/* ============================================================
 * Import Modal
 * ============================================================ */
function ImportModal({ onClose, onImport }: { onClose: () => void; onImport: (count: number) => void }) {
  const [importing, setImporting] = useState(false);

  const handleImport = () => {
    setImporting(true);
    setTimeout(() => {
      onImport(5);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900 flex items-center gap-2">
            <Upload className="w-5 h-5 text-violet-600" /> Nhập Lead
          </h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-violet-300 transition-colors cursor-pointer">
            <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm text-gray-600 mb-1">Kéo thả file CSV/Excel vào đây</p>
            <p className="text-xs text-gray-400">Hoặc click để chọn file</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <p className="text-xs text-blue-700 flex items-center gap-1 mb-1">
              <Bot className="w-3.5 h-3.5" /> AI Auto-Qualify
            </p>
            <p className="text-[11px] text-blue-600">
              Sau khi nhập, AI sẽ tự động phân tích và chấm điểm từng lead dựa trên dữ liệu công ty, vị trí, và lịch sử tương tác.
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-600 mb-2">Nguồn hỗ trợ:</p>
            <div className="flex flex-wrap gap-1.5">
              {["CSV", "Excel (.xlsx)", "Google Sheets", "HubSpot", "Salesforce"].map((src) => (
                <span key={src} className="text-[10px] px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-600">
                  {src}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
            Huỷ
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={importing}
            className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors disabled:opacity-50"
          >
            {importing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" /> Nhập & Phân tích AI
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Bulk Action Bar
 * ============================================================ */
function BulkActionBar({
  count,
  onAssign,
  onChangeStatus,
  onExport,
  onDelete,
  onClear,
}: {
  count: number;
  onAssign: (assigneeId: string) => void;
  onChangeStatus: (status: LeadStatus) => void;
  onExport: () => void;
  onDelete: () => void;
  onClear: () => void;
}) {
  const [showAssign, setShowAssign] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

  return (
    <div className="sticky top-0 z-10 bg-violet-600 text-white rounded-xl p-3 flex items-center gap-2 flex-wrap shadow-lg">
      <span className="text-sm flex items-center gap-1.5">
        <CheckSquare className="w-4 h-4" />
        Đã chọn <strong>{count}</strong> lead
      </span>

      <div className="flex-1" />

      {/* Gán nhân viên */}
      <div className="relative">
        <button
          type="button"
          onClick={() => { setShowAssign(!showAssign); setShowStatus(false); }}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs transition-colors"
        >
          <UserPlus className="w-3.5 h-3.5" /> Gán
        </button>
        {showAssign && (
          <div className="absolute top-full mt-1 right-0 bg-white rounded-lg shadow-xl border border-gray-100 py-1 w-52 z-20">
            {CRM_ASSIGNEES.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => { onAssign(a.id); setShowAssign(false); }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-violet-50 flex items-center gap-2"
              >
                {a.id.startsWith("ai") ? <Bot className="w-3.5 h-3.5 text-violet-500" /> : <Users className="w-3.5 h-3.5 text-blue-500" />}
                {a.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Đổi trạng thái */}
      <div className="relative">
        <button
          type="button"
          onClick={() => { setShowStatus(!showStatus); setShowAssign(false); }}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5" /> Trạng thái
        </button>
        {showStatus && (
          <div className="absolute top-full mt-1 right-0 bg-white rounded-lg shadow-xl border border-gray-100 py-1 w-44 z-20">
            {Object.entries(LEAD_STATUS_CONFIG).map(([key, cfg]) => (
              <button
                key={key}
                type="button"
                onClick={() => { onChangeStatus(key as LeadStatus); setShowStatus(false); }}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${cfg.bgColor} ${cfg.color}`}>{cfg.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Xuất */}
      <button
        type="button"
        onClick={onExport}
        className="flex items-center gap-1 px-2.5 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-xs transition-colors"
      >
        <Download className="w-3.5 h-3.5" /> Xuất
      </button>

      {/* Xoá */}
      <button
        type="button"
        onClick={onDelete}
        className="flex items-center gap-1 px-2.5 py-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg text-xs transition-colors"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {/* Bỏ chọn */}
      <button
        type="button"
        onClick={onClear}
        className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
        aria-label="Bỏ chọn tất cả"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

/* ============================================================
 * Lead Card (List View)
 * ============================================================ */
function LeadCard({
  lead,
  isSelected,
  onToggleSelect,
  onViewDetail,
}: {
  lead: Lead;
  isSelected: boolean;
  onToggleSelect: () => void;
  onViewDetail: () => void;
}) {
  const channelCfg = LEAD_CHANNEL_CONFIG[lead.channel];
  const statusCfg = LEAD_STATUS_CONFIG[lead.status];
  const assignee = CRM_ASSIGNEES.find((a) => a.id === lead.assignedTo);
  const timeAgo = getTimeAgo(lead.receivedAt);

  return (
    <div className={`bg-white rounded-xl border p-4 transition-all hover:shadow-sm ${isSelected ? "border-violet-300 bg-violet-50/30 shadow-sm" : "border-gray-100 hover:border-gray-200"}`}>
      <div className="flex items-start gap-3">
        {/* Checkbox */}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onToggleSelect(); }}
          className="mt-0.5 flex-shrink-0 text-gray-300 hover:text-violet-500 transition-colors"
        >
          {isSelected ? <CheckSquare className="w-5 h-5 text-violet-600" /> : <Square className="w-5 h-5" />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div className="min-w-0">
              <h4 className="text-sm text-gray-900 truncate">{lead.name}</h4>
              <p className="text-xs text-gray-400 truncate">{lead.position} · {lead.company}</p>
            </div>

            {/* AI Score */}
            <div className="flex-shrink-0">
              <AIScoreTrigger score={lead.aiScore} name={lead.name} category="lead" />
            </div>
          </div>

          {/* Email / Phone */}
          <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-2">
            <span className="flex items-center gap-0.5 truncate">
              <Mail className="w-3 h-3" /> {lead.email}
            </span>
            {lead.phone && (
              <span className="flex items-center gap-0.5 flex-shrink-0">
                <Phone className="w-3 h-3" /> {lead.phone}
              </span>
            )}
          </div>

          {/* Tags row */}
          <div className="flex items-center gap-1.5 flex-wrap mb-2">
            <span className={`text-[10px] px-1.5 py-0.5 rounded flex items-center gap-0.5 ${channelCfg.color}`}>
              {getChannelIcon(lead.channel)} {channelCfg.label}
            </span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${statusCfg.bgColor} ${statusCfg.color}`}>
              {statusCfg.label}
            </span>
            {lead.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{tag}</span>
            ))}
          </div>

          {/* Bottom row */}
          <div className="flex items-center justify-between text-[11px] text-gray-400">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-0.5">
                <Clock className="w-3 h-3" /> {timeAgo}
              </span>
              {assignee && (
                <span className="flex items-center gap-0.5">
                  {assignee.id.startsWith("ai") ? <Bot className="w-3 h-3 text-violet-500" /> : <Users className="w-3 h-3 text-blue-500" />}
                  {assignee.name}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onViewDetail}
              className="flex items-center gap-0.5 text-violet-500 hover:text-violet-700 transition-colors"
            >
              <Eye className="w-3 h-3" /> Chi tiết
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Detail Panel
 * ============================================================ */
function LeadDetailPanel({ lead, onClose, onEdit }: { lead: Lead; onClose: () => void; onEdit: () => void }) {
  const channelCfg = LEAD_CHANNEL_CONFIG[lead.channel];
  const statusCfg = LEAD_STATUS_CONFIG[lead.status];
  const assignee = CRM_ASSIGNEES.find((a) => a.id === lead.assignedTo);
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      <div className="p-4 border-b border-gray-50 bg-gradient-to-r from-violet-50 to-blue-50">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-gray-900">{lead.name}</h3>
            <p className="text-sm text-gray-500">{lead.position} · {lead.company}</p>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onEdit}
              className="text-gray-400 hover:text-gray-600 p-1.5"
              title="Chỉnh sửa"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${channelCfg.color}`}>
            {getChannelIcon(lead.channel)} {channelCfg.label}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded ${statusCfg.bgColor} ${statusCfg.color}`}>
            {statusCfg.label}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* AI Score */}
        <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-lg p-3 border border-violet-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-violet-700 flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" /> AI Qualification Score
            </span>
            <span className="text-lg text-violet-900">{lead.aiScore}/100</span>
          </div>
          <div className="h-2 bg-violet-200 rounded-full overflow-hidden">
            <div className="h-full bg-violet-600 rounded-full" style={{ width: `${lead.aiScore}%` }} />
          </div>
          <p className="text-[10px] text-violet-500 mt-1">
            {lead.aiScore >= 80 ? "Lead chất lượng cao — nên liên hệ sớm" : lead.aiScore >= 60 ? "Tiềm năng trung bình — cần thêm thông tin" : "Lead chất lượng thấp — theo dõi thêm"}
          </p>
        </div>

        {/* Contact info */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Mail className="w-4 h-4 text-gray-400" /> {lead.email}
          </div>
          {lead.phone && (
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4 text-gray-400" /> {lead.phone}
            </div>
          )}
          <div className="flex items-center gap-2 text-gray-600">
            <Clock className="w-4 h-4 text-gray-400" /> Nhận lúc: {new Date(lead.receivedAt).toLocaleString("vi-VN")}
          </div>
        </div>

        {/* Assigned */}
        <div>
          <p className="text-xs text-gray-400 mb-1">Phụ trách</p>
          {assignee ? (
            <span className="text-sm text-gray-700 flex items-center gap-1">
              {assignee.id.startsWith("ai") ? <Bot className="w-4 h-4 text-violet-500" /> : <Users className="w-4 h-4 text-blue-500" />}
              {assignee.name}
            </span>
          ) : (
            <span className="text-sm text-gray-400 italic">Chưa gán</span>
          )}
        </div>

        {/* Tags */}
        {lead.tags.length > 0 && (
          <div>
            <p className="text-xs text-gray-400 mb-1">Tags</p>
            <div className="flex flex-wrap gap-1">
              {lead.tags.map((tag) => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-violet-50 text-violet-700">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {lead.notes && (
          <div>
            <p className="text-xs text-gray-400 mb-1">Ghi chú</p>
            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-2">{lead.notes}</p>
          </div>
        )}

        {/* Convert to Contact */}
        {lead.status !== "converted" && lead.status !== "disqualified" && (
          <button
            type="button"
            onClick={() => {
              toast.success(`Đã chuyển "${lead.name}" thành liên hệ CRM`);
              navigate("/crm/contacts");
            }}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> Chuyển thành Liên hệ CRM
          </button>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * Main Page
 * ============================================================ */
export function LeadInboxPage() {
  // State
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterChannel, setFilterChannel] = useState<LeadChannel | null>(null);
  const [filterStatus, setFilterStatus] = useState<LeadStatus | null>(null);
  const [filterAssignedTo, setFilterAssignedTo] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [detailLead, setDetailLead] = useState<Lead | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);

  // Hooks
  const { mode: viewMode, setMode: setViewMode } = useViewMode("lead-inbox", "table");

  // Load data
  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchLeads({ search, status: filterStatus, channel: filterChannel, assignedTo: filterAssignedTo });
      setLeads(data);
    } catch (error) {
      toast.error("Không thể tải danh sách lead");
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus, filterChannel, filterAssignedTo]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  // Stats
  const stats = useMemo(() => {
    const newCount = leads.filter((l) => l.status === "new").length;
    const contacted = leads.filter((l) => l.status === "contacted").length;
    const qualified = leads.filter((l) => l.status === "qualified").length;
    const converted = leads.filter((l) => l.status === "converted").length;
    const avgScore = leads.length > 0 ? Math.round(leads.reduce((s, l) => s + l.aiScore, 0) / leads.length) : 0;
    return { total: leads.length, new: newCount, contacted, qualified, converted, avgScore };
  }, [leads]);

  // Filtered & sorted
  const sorted = useMemo(() => {
    return [...leads].sort((a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime());
  }, [leads]);

  const {
    paginatedItems: paginated,
    currentPage, totalPages, totalItems,
    pageSize, startIndex, endIndex,
    isFirstPage, isLastPage,
    goToPage, nextPage, prevPage, setPageSize,
  } = usePagination(sorted, { storageKey: "lead-inbox", initialPageSize: 10 });

  // Selection
  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSelectAll = useCallback(() => {
    if (selectedIds.size === paginated.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginated.map((l) => l.id)));
    }
  }, [paginated, selectedIds.size]);

  // Bulk actions
  const handleBulkAssign = useCallback(async (assigneeId: string) => {
    const name = CRM_ASSIGNEES.find((a) => a.id === assigneeId)?.name ?? assigneeId;
    for (const id of selectedIds) {
      await updateLead(id, { assignedTo: assigneeId });
    }
    toast.success(`Đã gán ${selectedIds.size} lead cho ${name}`);
    setSelectedIds(new Set());
    loadLeads();
  }, [selectedIds, loadLeads]);

  const handleBulkStatus = useCallback(async (status: LeadStatus) => {
    for (const id of selectedIds) {
      await updateLead(id, { status });
    }
    toast.success(`Đã đổi trạng thái ${selectedIds.size} lead thành "${LEAD_STATUS_CONFIG[status].label}"`);
    setSelectedIds(new Set());
    loadLeads();
  }, [selectedIds, loadLeads]);

  const handleBulkDeleteConfirm = useCallback(async () => {
    const count = selectedIds.size;
    await deleteLeads(Array.from(selectedIds));
    toast.success(`Đã xoá ${count} lead`);
    setSelectedIds(new Set());
    setShowBulkDeleteConfirm(false);
    loadLeads();
  }, [selectedIds, loadLeads]);

  const handleBulkExport = useCallback(() => {
    toast.success(`Đã xuất ${selectedIds.size} lead ra file CSV`);
    setSelectedIds(new Set());
  }, [selectedIds]);

  const handleImport = useCallback((count: number) => {
    toast.success(`Đã nhập ${count} lead mới — AI đang phân tích...`);
    loadLeads();
  }, [loadLeads]);

  const handleInlineEdit = useCallback(async (rowId: string, field: string, value: unknown) => {
    await updateLead(rowId, { [field]: value });
    toast.success("Đã cập nhật lead");
    loadLeads();
  }, [loadLeads]);

  // Table columns
  const columns: ColumnDef<Lead>[] = [
    {
      key: "select",
      header: "",
      minWidth: 40,
      render: (lead) => (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); toggleSelect(lead.id); }}
          className="text-gray-300 hover:text-violet-500"
        >
          {selectedIds.has(lead.id) ? <CheckSquare className="w-4 h-4 text-violet-600" /> : <Square className="w-4 h-4" />}
        </button>
      ),
    },
    {
      key: "name",
      header: "Tên",
      sortable: true,
      render: (lead) => (
        <div>
          <div className="text-sm text-gray-900">{lead.name}</div>
          <div className="text-xs text-gray-400 truncate">{lead.position} · {lead.company}</div>
        </div>
      ),
    },
    {
      key: "email",
      header: "Email",
      render: (lead) => (
        <div className="text-sm text-gray-600 flex items-center gap-1">
          <Mail className="w-3.5 h-3.5 text-gray-400" />
          {lead.email}
        </div>
      ),
    },
    {
      key: "channel",
      header: "Kênh",
      render: (lead) => {
        const cfg = LEAD_CHANNEL_CONFIG[lead.channel];
        return (
          <span className={`text-[11px] px-2 py-0.5 rounded flex items-center gap-1 w-fit ${cfg.color}`}>
            {getChannelIcon(lead.channel)} {cfg.label}
          </span>
        );
      },
    },
    {
      key: "status",
      header: "Trạng thái",
      editable: true,
      render: (lead) => {
        const cfg = LEAD_STATUS_CONFIG[lead.status];
        return (
          <span className={`text-[11px] px-2 py-0.5 rounded ${cfg.bgColor} ${cfg.color}`}>
            {cfg.label}
          </span>
        );
      },
      renderEdit: (item, _v, onChange, onSave) => (
        <select value={item.status} onChange={(e) => { onChange(e.target.value); onSave(); }}
          onBlur={onSave} autoFocus
          className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
          {Object.entries(LEAD_STATUS_CONFIG).map(([k, cfg]) => <option key={k} value={k}>{cfg.label}</option>)}
        </select>
      ),
    },
    {
      key: "aiScore",
      header: "AI Score",
      sortable: true,
      render: (lead) => <AIScoreTrigger score={lead.aiScore} name={lead.name} category="lead" />,
    },
    {
      key: "assignedTo",
      header: "Phụ trách",
      render: (lead) => {
        const assignee = CRM_ASSIGNEES.find((a) => a.id === lead.assignedTo);
        if (!assignee) return <span className="text-xs text-gray-400 italic">Chưa gán</span>;
        return (
          <span className="text-xs text-gray-700 flex items-center gap-1">
            {assignee.id.startsWith("ai") ? <Bot className="w-3.5 h-3.5 text-violet-500" /> : <Users className="w-3.5 h-3.5 text-blue-500" />}
            {assignee.name}
          </span>
        );
      },
    },
    {
      key: "receivedAt",
      header: "Nhận lúc",
      sortable: true,
      render: (lead) => (
        <span className="text-xs text-gray-500 flex items-center gap-1">
          <Clock className="w-3 h-3" /> {getTimeAgo(lead.receivedAt)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      minWidth: 80,
      render: (lead) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setDetailLead(lead)}
            className="p-1.5 text-gray-400 hover:text-violet-600 rounded-lg hover:bg-violet-50"
            title="Xem chi tiết"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setEditingLead(lead)}
            className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
            title="Chỉnh sửa"
          >
            <Pencil className="w-4 h-4" />
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
            <h1 className="text-gray-900">Lead Inbox</h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
              <Zap className="w-3 h-3" /> AI Auto-Qualify
            </span>
          </div>
          <p className="text-gray-500">
            Quản lý nguồn lead đầu vào · Đa kênh · Phân loại tự động bởi AI
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowImport(true)}
            className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            <Upload className="w-4 h-4" /> Nhập
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Tổng leads</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-3 text-center">
          <p className="text-lg text-blue-700">{stats.new}</p>
          <p className="text-xs text-blue-600">Mới</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-100 p-3 text-center">
          <p className="text-lg text-amber-700">{stats.contacted}</p>
          <p className="text-xs text-amber-600">Đã liên hệ</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-3 text-center">
          <p className="text-lg text-green-700">{stats.qualified}</p>
          <p className="text-xs text-green-600">Đủ ĐK</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-100 p-3 text-center">
          <p className="text-lg text-violet-700">{stats.converted}</p>
          <p className="text-xs text-violet-600">Chuyển đổi</p>
        </div>
        <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-3 text-center">
          <p className="text-lg text-indigo-700 flex items-center justify-center gap-1">
            <Bot className="w-4 h-4" /> {stats.avgScore}
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
              placeholder="Tìm tên, email, công ty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 w-64"
            />
          </div>

          {/* Channel filter */}
          <select
            value={filterChannel ?? ""}
            onChange={(e) => setFilterChannel(e.target.value ? e.target.value as LeadChannel : null)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">Tất cả kênh</option>
            {Object.entries(LEAD_CHANNEL_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={filterStatus ?? ""}
            onChange={(e) => setFilterStatus(e.target.value ? e.target.value as LeadStatus : null)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">Tất cả trạng thái</option>
            {Object.entries(LEAD_STATUS_CONFIG).map(([key, cfg]) => (
              <option key={key} value={key}>{cfg.label}</option>
            ))}
          </select>

          {/* Assignee filter */}
          <select
            value={filterAssignedTo ?? ""}
            onChange={(e) => setFilterAssignedTo(e.target.value || null)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            <option value="">Tất cả người phụ trách</option>
            {CRM_ASSIGNEES.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>

        {/* View Toggle */}
        <ViewToggle mode={viewMode} onSetMode={setViewMode} modes={["table", "card"]} />
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <BulkActionBar
          count={selectedIds.size}
          onAssign={handleBulkAssign}
          onChangeStatus={handleBulkStatus}
          onExport={handleBulkExport}
          onDelete={() => setShowBulkDeleteConfirm(true)}
          onClear={() => setSelectedIds(new Set())}
        />
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
        </div>
      ) : paginated.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-gray-500">Không có lead nào</p>
        </div>
      ) : viewMode === "table" ? (
        <DataTable
          data={paginated}
          columns={columns}
          storageKey="lead-inbox"
          onRowClick={(lead) => setDetailLead(lead)}
          onInlineEdit={handleInlineEdit}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {paginated.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              isSelected={selectedIds.has(lead.id)}
              onToggleSelect={() => toggleSelect(lead.id)}
              onViewDetail={() => setDetailLead(lead)}
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

      {/* Detail Panel */}
      {detailLead && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-2xl z-50 overflow-y-auto">
          <LeadDetailPanel
            lead={detailLead}
            onClose={() => setDetailLead(null)}
            onEdit={() => {
              setEditingLead(detailLead);
              setDetailLead(null);
            }}
          />
        </div>
      )}

      {/* Import Modal */}
      {showImport && (
        <ImportModal
          onClose={() => setShowImport(false)}
          onImport={handleImport}
        />
      )}

      {/* Bulk Delete Confirmation */}
      <ConfirmDeleteDialog
        open={showBulkDeleteConfirm}
        onClose={() => setShowBulkDeleteConfirm(false)}
        onConfirm={handleBulkDeleteConfirm}
        itemName={`${selectedIds.size} lead`}
        entityType="lead"
        description={`${selectedIds.size} lead đã chọn sẽ bị xoá vĩnh viễn và không thể khôi phục.`}
      />
    </div>
  );
}