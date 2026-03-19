/**
 * Trang Quản lý Liên hệ — CRUD đầy đủ + DataTable + Card view
 * Features: Search, Filter, Pagination, Column Visibility, Inline Edit,
 *           View Toggle (Table/Card), Delete, Bulk Delete, Detail Panel
 * Phase F1-01 → F1-06
 */
import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  Filter,
  X,
  Mail,
  Phone,
  Building2,
  Bot,
  ExternalLink,
  Plus,
  Pencil,
  Clock,
  User,
  Trash2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import type { Contact, ContactType, ContactStatus, Activity } from "../../types/crm";
import type { ColumnDef } from "../../types/dataTable";
import {
  fetchContacts,
  getEmployeeName,
  createContact,
  updateContact,
  deleteContact,
  deleteContacts,
  fetchActivities,
} from "../../api/crmApi";
import {
  CONTACT_TYPE_CONFIG,
  CONTACT_TYPE_OPTIONS,
  CONTACT_STATUS_CONFIG,
  ACTIVITY_TYPE_CONFIG,
} from "../../constants/crmConfig";
import { ContactFormModal } from "../../components/crm/ContactFormModal";
import { AIScoreTrigger } from "../../components/crm/AIScoreModal";
import { DataTable } from "../../components/crm/DataTable";
import { ViewToggle } from "../../components/crm/ViewToggle";
import { PaginationBar } from "../../components/crm/PaginationBar";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";
import { useViewMode } from "../../hooks/useViewMode";
import { usePagination } from "../../hooks/usePagination";

/* ============================================================
 * Column Definitions cho DataTable
 * ============================================================ */
const CONTACT_COLUMNS: ColumnDef<Contact>[] = [
  {
    key: "name",
    header: "Tên",
    sortable: true,
    editable: true,
    minWidth: 160,
    render: (item) => (
      <div>
        <p className="text-gray-900 truncate">{item.name}</p>
        <p className="text-[10px] text-gray-400 truncate">{item.position}</p>
      </div>
    ),
  },
  {
    key: "company",
    header: "Công ty",
    sortable: true,
    editable: true,
    minWidth: 130,
    render: (item) => (
      <div className="flex items-center gap-1.5">
        <Building2 className="w-3 h-3 text-gray-400 flex-shrink-0" />
        <span className="truncate text-gray-700">{item.company}</span>
      </div>
    ),
  },
  {
    key: "email",
    header: "Email",
    sortable: true,
    minWidth: 180,
    render: (item) => (
      <a href={`mailto:${item.email}`} className="text-blue-600 hover:underline truncate block text-[13px]">
        {item.email}
      </a>
    ),
  },
  {
    key: "phone",
    header: "Điện thoại",
    defaultHidden: true,
    minWidth: 120,
    render: (item) => <span className="text-gray-600 text-[13px]">{item.phone}</span>,
  },
  {
    key: "type",
    header: "Loại",
    sortable: true,
    minWidth: 90,
    render: (item) => {
      const cfg = CONTACT_TYPE_CONFIG[item.type];
      return <span className={`text-[11px] px-2 py-0.5 rounded ${cfg.color}`}>{cfg.label}</span>;
    },
    editable: true,
    renderEdit: (item, _value, onChange, onSave) => (
      <select
        value={item.type}
        onChange={(e) => { onChange(e.target.value); onSave(); }}
        onBlur={onSave}
        autoFocus
        className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none"
      >
        {CONTACT_TYPE_OPTIONS.map((t) => (
          <option key={t} value={t}>{CONTACT_TYPE_CONFIG[t].label}</option>
        ))}
      </select>
    ),
  },
  {
    key: "status",
    header: "Trạng thái",
    sortable: true,
    minWidth: 100,
    render: (item) => {
      const cfg = CONTACT_STATUS_CONFIG[item.status];
      return <span className={`text-[11px] px-2 py-0.5 rounded ${cfg.color}`}>{cfg.label}</span>;
    },
    editable: true,
    renderEdit: (item, _value, onChange, onSave) => (
      <select
        value={item.status}
        onChange={(e) => { onChange(e.target.value); onSave(); }}
        onBlur={onSave}
        autoFocus
        className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none"
      >
        {(["active", "inactive", "prospect", "churned"] as ContactStatus[]).map((s) => (
          <option key={s} value={s}>{CONTACT_STATUS_CONFIG[s].label}</option>
        ))}
      </select>
    ),
  },
  {
    key: "aiLeadScore",
    header: "AI Score",
    sortable: true,
    minWidth: 90,
    render: (item) => <ScoreBar score={item.aiLeadScore} />,
    sortValue: (item) => item.aiLeadScore,
  },
  {
    key: "engagementScore",
    header: "Tương tác",
    sortable: true,
    defaultHidden: true,
    minWidth: 90,
    render: (item) => <ScoreBar score={item.engagementScore} />,
    sortValue: (item) => item.engagementScore,
  },
  {
    key: "assignedTo",
    header: "Phụ trách",
    sortable: true,
    minWidth: 120,
    render: (item) => (
      <span className="text-gray-600 text-[13px] truncate block">{getEmployeeName(item.assignedTo)}</span>
    ),
    sortValue: (item) => getEmployeeName(item.assignedTo),
  },
  {
    key: "lastContactDate",
    header: "Liên hệ gần nhất",
    sortable: true,
    defaultHidden: true,
    minWidth: 120,
    render: (item) => <span className="text-gray-500 text-[13px]">{item.lastContactDate}</span>,
  },
  {
    key: "source",
    header: "Nguồn",
    defaultHidden: true,
    minWidth: 100,
    render: (item) => <span className="text-gray-500 text-[13px]">{item.source}</span>,
  },
  {
    key: "tags",
    header: "Tags",
    defaultHidden: true,
    hideable: true,
    minWidth: 150,
    render: (item) => (
      <div className="flex flex-wrap gap-1">
        {item.tags.map((t) => (
          <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">{t}</span>
        ))}
      </div>
    ),
  },
];

/* ============================================================
 * ScoreBar
 * ============================================================ */
function ScoreBar({ score }: { score: number }) {
  const color = score >= 80 ? "bg-green-500" : score >= 60 ? "bg-blue-500" : score >= 40 ? "bg-amber-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden min-w-[40px]">
        <div className={`h-full ${color} rounded-full`} style={{ width: `${score}%` }} />
      </div>
      <span className="text-[11px] text-gray-600 w-6 text-right">{score}</span>
    </div>
  );
}

/* ============================================================
 * ContactCard (cho Card view)
 * ============================================================ */
function ContactCard({
  contact,
  isSelected,
  onSelect,
  onDelete,
}: {
  contact: Contact;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
}) {
  const typeConfig = CONTACT_TYPE_CONFIG[contact.type];
  const statusConfig = CONTACT_STATUS_CONFIG[contact.status];

  return (
    <div
      className={`relative group text-left p-4 rounded-xl border transition-all hover:shadow-sm ${
        isSelected ? "border-blue-300 bg-blue-50/50 shadow-sm" : "border-gray-100 bg-white hover:border-gray-200"
      }`}
    >
      {/* Delete button (hover) */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
        className="absolute top-2 right-2 p-1 rounded text-gray-300 hover:text-red-500 hover:bg-red-50
          opacity-0 group-hover:opacity-100 transition-all"
        title="Xóa"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      <button type="button" onClick={onSelect} className="w-full text-left">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0">
            <h4 className="text-sm text-gray-900 truncate">{contact.name}</h4>
            <p className="text-xs text-gray-400 truncate">{contact.position}</p>
          </div>
          <span className={`text-[10px] px-2 py-0.5 rounded flex-shrink-0 ${typeConfig.color}`}>
            {typeConfig.label}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-2">
          <Building2 className="w-3 h-3" />
          <span className="truncate">{contact.company}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className={`text-[10px] px-1.5 py-0.5 rounded ${statusConfig.color}`}>
            {statusConfig.label}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-gray-400">
            <Bot className="w-3 h-3 text-violet-500" />
            <span>Score: {contact.aiLeadScore}</span>
          </div>
        </div>
      </button>
    </div>
  );
}

/* ============================================================
 * ContactDetail Panel
 * ============================================================ */
function ContactDetail({
  contact,
  onClose,
  onEdit,
  onViewDetail,
}: {
  contact: Contact;
  onClose: () => void;
  onEdit: () => void;
  onViewDetail: () => void;
}) {
  const typeConfig = CONTACT_TYPE_CONFIG[contact.type];
  const statusConfig = CONTACT_STATUS_CONFIG[contact.status];
  const [activeTab, setActiveTab] = useState<"info" | "activities">("info");
  const [relatedActivities, setRelatedActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetchActivities({ contactId: contact.id }).then(setRelatedActivities);
  }, [contact.id]);

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-gray-50 bg-gradient-to-r from-blue-50 to-violet-50">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-gray-900">{contact.name}</h3>
            <p className="text-sm text-gray-500">{contact.position}</p>
          </div>
          <div className="flex items-center gap-1">
            <button type="button" onClick={onEdit} className="text-blue-600 hover:bg-blue-100 p-1.5 rounded-lg transition-colors" aria-label="Chỉnh sửa">
              <Pencil className="w-4 h-4" />
            </button>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg" aria-label="Đóng">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`text-xs px-2 py-0.5 rounded ${typeConfig.color}`}>{typeConfig.label}</span>
          <span className={`text-xs px-2 py-0.5 rounded ${statusConfig.color}`}>{statusConfig.label}</span>
          {contact.tags.map((tag) => (
            <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-gray-100 text-gray-600">{tag}</span>
          ))}
        </div>
      </div>

      {/* Tab switcher */}
      <div className="flex border-b border-gray-100">
        <button type="button" onClick={() => setActiveTab("info")}
          className={`flex-1 px-4 py-2.5 text-sm transition-colors ${activeTab === "info" ? "text-blue-700 border-b-2 border-blue-500" : "text-gray-500 hover:text-gray-700"}`}>
          Thông tin
        </button>
        <button type="button" onClick={() => setActiveTab("activities")}
          className={`flex-1 px-4 py-2.5 text-sm transition-colors flex items-center justify-center gap-1.5 ${activeTab === "activities" ? "text-blue-700 border-b-2 border-blue-500" : "text-gray-500 hover:text-gray-700"}`}>
          Hoạt động
          {relatedActivities.length > 0 && (
            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">{relatedActivities.length}</span>
          )}
        </button>
      </div>

      {/* Tab content */}
      <div className="p-4 sm:p-5">
        {activeTab === "info" ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                <Mail className="w-4 h-4" /> {contact.email}
              </a>
              <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                <Phone className="w-4 h-4" /> {contact.phone}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Building2 className="w-4 h-4 text-gray-400" />
              <span>{contact.company}</span>
            </div>
            <div className="p-3 bg-violet-50 rounded-lg border border-violet-100">
              <p className="text-xs text-violet-700 mb-2 flex items-center gap-1">
                <Bot className="w-3.5 h-3.5" /> Điểm đánh giá AI
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Lead Score</span>
                  <AIScoreTrigger score={contact.aiLeadScore} name={contact.name} category="lead" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">Engagement</span>
                  <AIScoreTrigger score={contact.engagementScore} name={contact.name} category="engagement" />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><p className="text-xs text-gray-400">Nguồn</p><p className="text-gray-700">{contact.source}</p></div>
              <div><p className="text-xs text-gray-400">Phụ trách</p><p className="text-gray-700">{getEmployeeName(contact.assignedTo)}</p></div>
              <div><p className="text-xs text-gray-400">Liên hệ gần nhất</p><p className="text-gray-700">{contact.lastContactDate}</p></div>
              <div><p className="text-xs text-gray-400">Ngày tạo</p><p className="text-gray-700">{contact.createdDate}</p></div>
            </div>
            {contact.notes && (
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                <p className="text-xs text-amber-800">{contact.notes}</p>
              </div>
            )}
            <button type="button" onClick={onViewDetail}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-sm hover:bg-blue-100 transition-colors">
              <ExternalLink className="w-4 h-4" /> Xem chi tiết đầy đủ
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {relatedActivities.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Clock className="w-6 h-6 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Chưa có hoạt động nào</p>
              </div>
            ) : (
              relatedActivities.map((a) => {
                const typeConf = ACTIVITY_TYPE_CONFIG[a.type];
                return (
                  <div key={a.id} className="flex gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${typeConf.color}`}>
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{a.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-gray-400">{new Date(a.performedAt).toLocaleDateString("vi-VN")}</span>
                        <span className="text-[10px] text-gray-400">·</span>
                        <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                          {a.isAutoLogged ? <Bot className="w-2.5 h-2.5 text-violet-500" /> : <User className="w-2.5 h-2.5" />}
                          {getEmployeeName(a.performedBy)}
                        </span>
                      </div>
                    </div>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded h-fit ${typeConf.color}`}>{typeConf.label}</span>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function ContactsPage() {
  const navigate = useNavigate();
  const { mode, setMode } = useViewMode("contacts", "table");

  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<ContactType | null>(null);
  const [filterStatus, setFilterStatus] = useState<ContactStatus | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  /* Delete state */
  const [deleteTarget, setDeleteTarget] = useState<Contact | null>(null);
  const [bulkDeleteIds, setBulkDeleteIds] = useState<string[] | null>(null);

  const reload = useCallback(() => {
    fetchContacts().then(setAllContacts);
  }, []);

  useEffect(() => { reload(); }, [reload]);

  /* Filter */
  const filtered = useMemo(() => {
    let result = [...allContacts];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q),
      );
    }
    if (filterType) result = result.filter((c) => c.type === filterType);
    if (filterStatus) result = result.filter((c) => c.status === filterStatus);
    return result;
  }, [allContacts, search, filterType, filterStatus]);

  const hasFilters = !!filterType || !!filterStatus || !!search;
  const clearFilters = useCallback(() => { setSearch(""); setFilterType(null); setFilterStatus(null); }, []);

  /* Pagination for card view */
  const cardPagination = usePagination(filtered, { storageKey: "contacts-card" });

  /* Inline edit handler */
  const handleInlineEdit = useCallback(async (rowId: string, field: string, value: unknown) => {
    await updateContact(rowId, { [field]: value });
    toast.success("Đã cập nhật");
    reload();
  }, [reload]);

  /* Delete single */
  const handleDeleteConfirm = useCallback(async () => {
    if (deleteTarget) {
      await deleteContact(deleteTarget.id);
      toast.success(`Đã xóa "${deleteTarget.name}"`);
      if (selectedContact?.id === deleteTarget.id) setSelectedContact(null);
      setDeleteTarget(null);
      reload();
    }
  }, [deleteTarget, selectedContact, reload]);

  /* Bulk delete */
  const handleBulkDeleteConfirm = useCallback(async () => {
    if (bulkDeleteIds) {
      const count = await deleteContacts(bulkDeleteIds);
      toast.success(`Đã xóa ${count} liên hệ`);
      if (selectedContact && bulkDeleteIds.includes(selectedContact.id)) setSelectedContact(null);
      setBulkDeleteIds(null);
      reload();
    }
  }, [bulkDeleteIds, selectedContact, reload]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <header className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-gray-900">Quản lý Liên hệ</h1>
          <p className="text-gray-500 mt-1 text-sm">
            {allContacts.length} liên hệ · AI Lead Scoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle mode={mode} onSetMode={setMode} modes={["table", "card"]} />
          <button type="button" onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Tạo mới</span>
          </button>
        </div>
      </header>

      {/* Search & Filter bar */}
      <div className="bg-white rounded-xl border border-gray-100 p-3 space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm tên, email, công ty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button type="button" onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm border transition-colors ${showFilters ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-gray-50 border-gray-200 text-gray-600"}`}>
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Bộ lọc</span>
            {hasFilters && <span className="w-2 h-2 rounded-full bg-blue-500" />}
          </button>
          {hasFilters && (
            <button type="button" onClick={clearFilters} className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
              <X className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Xoá lọc</span>
            </button>
          )}
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-gray-100">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Loại liên hệ</label>
              <select value={filterType ?? ""} onChange={(e) => setFilterType((e.target.value || null) as ContactType | null)}
                className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                <option value="">Tất cả</option>
                {CONTACT_TYPE_OPTIONS.map((t) => (
                  <option key={t} value={t}>{CONTACT_TYPE_CONFIG[t].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Trạng thái</label>
              <select value={filterStatus ?? ""} onChange={(e) => setFilterStatus((e.target.value || null) as ContactStatus | null)}
                className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm">
                <option value="">Tất cả</option>
                {(["active", "inactive", "prospect", "churned"] as ContactStatus[]).map((s) => (
                  <option key={s} value={s}>{CONTACT_STATUS_CONFIG[s].label}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`${selectedContact && mode === "card" ? "grid lg:grid-cols-3 gap-4" : ""}`}>
        {/* ======= TABLE VIEW ======= */}
        {mode === "table" && (
          <div className={selectedContact ? "lg:col-span-1" : ""}>
            <DataTable<Contact>
              data={filtered}
              columns={CONTACT_COLUMNS}
              storageKey="contacts"
              selectable
              defaultSortField="aiLeadScore"
              onInlineEdit={handleInlineEdit}
              onRowClick={(item) => setSelectedContact(selectedContact?.id === item.id ? null : item)}
              onBulkDelete={(ids) => setBulkDeleteIds(ids)}
              emptyMessage="Không tìm thấy liên hệ phù hợp"
              renderRowActions={(item) => (
                <div className="flex items-center gap-0.5">
                  <button type="button" onClick={() => navigate(`/crm/contacts/${item.id}`)}
                    className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors" title="Xem chi tiết">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => { setEditingContact(item); setShowForm(true); }}
                    className="p-1 text-gray-400 hover:text-blue-600 rounded transition-colors" title="Sửa">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" onClick={() => setDeleteTarget(item)}
                    className="p-1 text-gray-400 hover:text-red-600 rounded transition-colors" title="Xóa">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            />
          </div>
        )}

        {/* ======= CARD VIEW ======= */}
        {mode === "card" && (
          <div className={selectedContact ? "lg:col-span-1" : ""}>
            <div className={`grid gap-3 ${selectedContact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"}`}>
              {cardPagination.paginatedItems.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  isSelected={selectedContact?.id === contact.id}
                  onSelect={() => setSelectedContact(selectedContact?.id === contact.id ? null : contact)}
                  onDelete={() => setDeleteTarget(contact)}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Không tìm thấy liên hệ phù hợp</p>
              </div>
            )}

            {/* Card view pagination */}
            {filtered.length > 0 && (
              <div className="mt-3 bg-white rounded-xl border border-gray-100 overflow-hidden">
                <PaginationBar
                  currentPage={cardPagination.currentPage}
                  totalPages={cardPagination.totalPages}
                  totalItems={cardPagination.totalItems}
                  pageSize={cardPagination.pageSize}
                  startIndex={cardPagination.startIndex}
                  endIndex={cardPagination.endIndex}
                  isFirstPage={cardPagination.isFirstPage}
                  isLastPage={cardPagination.isLastPage}
                  onGoToPage={cardPagination.goToPage}
                  onNextPage={cardPagination.nextPage}
                  onPrevPage={cardPagination.prevPage}
                  onSetPageSize={cardPagination.setPageSize}
                />
              </div>
            )}
          </div>
        )}

        {/* Detail panel */}
        {selectedContact && (
          <div className={mode === "card" ? "lg:col-span-2" : "mt-4"}>
            <ContactDetail
              contact={selectedContact}
              onClose={() => setSelectedContact(null)}
              onEdit={() => { setEditingContact(selectedContact); setShowForm(true); }}
              onViewDetail={() => navigate(`/crm/contacts/${selectedContact.id}`)}
            />
          </div>
        )}
      </div>

      {/* Form tạo / chỉnh sửa */}
      <ContactFormModal
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditingContact(null); }}
        editingContact={editingContact}
        onSave={async (data) => {
          if (editingContact) {
            await updateContact(editingContact.id, data);
            toast.success(`Đã cập nhật liên hệ "${data.name}"`);
            setSelectedContact({ ...editingContact, ...data } as Contact);
          } else {
            await createContact(data);
            toast.success(`Đã tạo liên hệ "${data.name}"`);
          }
          reload();
          setEditingContact(null);
        }}
      />

      {/* Confirm Delete Dialog */}
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        itemName={deleteTarget?.name ?? ""}
        entityType="liên hệ"
        description="Hành động này không thể hoàn tác. Các hoạt động liên quan sẽ không bị xóa."
      />

      {/* Confirm Bulk Delete Dialog */}
      <ConfirmDeleteDialog
        open={!!bulkDeleteIds}
        onClose={() => setBulkDeleteIds(null)}
        onConfirm={handleBulkDeleteConfirm}
        itemName={`${bulkDeleteIds?.length ?? 0} liên hệ`}
        entityType="liên hệ"
        description="Xóa hàng loạt không thể hoàn tác."
      />
    </div>
  );
}
