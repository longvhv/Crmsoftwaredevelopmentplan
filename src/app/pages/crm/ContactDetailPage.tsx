/**
 * Trang chi tiết Liên hệ — PHASE 3: Full Implementation
 * Hiển thị đầy đủ thông tin với 7 tabs: Overview, Timeline, Notes, Activities, Deals, Documents, Custom Fields
 * Step 3.1.1 (121): Contact Detail Page - Full Implementation
 */
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Edit3,
  Mail,
  Phone,
  ExternalLink,
  Building2,
  Clock,
  Target,
  FileText,
  Bot,
  User,
  CheckSquare,
  Video,
  Calendar,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import type { Contact, Activity, Deal, ActivityType as ActivityTypeEnum } from "../../types/crm";
import {
  fetchContactById,
  fetchActivities,
  fetchDealsByContactId,
  updateContact,
  getEmployeeName,
} from "../../api/crmApi";
import {
  CONTACT_TYPE_CONFIG,
  CONTACT_STATUS_CONFIG,
  DEAL_STAGE_CONFIG,
  DEAL_PRIORITY_CONFIG,
  ACTIVITY_TYPE_CONFIG,
  formatCurrency,
} from "../../constants/crmConfig";
import { ContactFormModal } from "../../components/crm/ContactFormModal";
import { ContactOverviewTab } from "../../components/crm/contacts/ContactOverviewTab";
import { ContactTimelineTab } from "../../components/crm/contacts/ContactTimelineTab";
import { ContactNotesTab } from "../../components/crm/contacts/ContactNotesTab";
import { ContactDocumentsTab } from "../../components/crm/contacts/ContactDocumentsTab";
import { ContactCustomFieldsTab } from "../../components/crm/contacts/ContactCustomFieldsTab";

/* ============================================================
 * Trang chính
 * ============================================================ */
type DetailTab =
  | "overview"
  | "timeline"
  | "notes"
  | "activities"
  | "deals"
  | "documents"
  | "customFields";

export function ContactDetailPage() {
  const { contactId } = useParams<{ contactId: string }>();
  const navigate = useNavigate();

  const [contact, setContact] = useState<Contact | null>(null);
  const [relatedDeals, setRelatedDeals] = useState<Deal[]>([]);
  const [relatedActivities, setRelatedActivities] = useState<Activity[]>([]);
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [showEditForm, setShowEditForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadContact = useCallback(async () => {
    if (!contactId) return;
    setLoading(true);
    try {
      const found = await fetchContactById(contactId);
      if (!found) {
        toast.error("Không tìm thấy liên hệ");
        navigate("/crm/contacts");
        return;
      }
      setContact(found);

      // Load related data
      const [acts, dls] = await Promise.all([
        fetchActivities({ contactId }),
        fetchDealsByContactId(contactId),
      ]);
      setRelatedActivities(acts);
      setRelatedDeals(dls);
    } finally {
      setLoading(false);
    }
  }, [contactId, navigate]);

  useEffect(() => {
    loadContact();
  }, [loadContact]);

  if (loading || !contact) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400 text-sm">Đang tải thông tin liên hệ...</p>
      </div>
    );
  }

  const typeConfig = CONTACT_TYPE_CONFIG[contact.type];
  const statusConfig = CONTACT_STATUS_CONFIG[contact.status];

  const TABS: { key: DetailTab; label: string; count?: number }[] = [
    { key: "overview", label: "Tổng quan" },
    { key: "timeline", label: "Timeline" },
    { key: "notes", label: "Ghi chú" },
    { key: "activities", label: "Hoạt động", count: relatedActivities.length },
    { key: "deals", label: "Deals", count: relatedDeals.length },
    { key: "documents", label: "Tài liệu" },
    { key: "customFields", label: "Trường tùy chỉnh" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => navigate("/crm/contacts")}
          className="mt-1 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          aria-label="Quay lại Liên hệ"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h1 className="text-gray-900 truncate">{contact.name}</h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs px-2 py-0.5 rounded ${typeConfig.color}`}>
              {typeConfig.label}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded ${statusConfig.color}`}>
              {statusConfig.label}
            </span>
            <span className="text-xs text-gray-400">
              {contact.company} · {contact.position}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowEditForm(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors flex-shrink-0"
        >
          <Edit3 className="w-4 h-4" />
          <span className="hidden sm:inline">Chỉnh sửa</span>
        </button>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.key
                ? "border-violet-500 text-violet-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="max-w-4xl">
        {activeTab === "overview" && (
          <ContactOverviewTab
            contact={contact}
            stats={{
              totalDeals: relatedDeals.length,
              totalActivities: relatedActivities.length,
              totalNotes: 0,
              totalDocuments: 0,
            }}
          />
        )}
        {activeTab === "timeline" && <ContactTimelineTab activities={relatedActivities} />}
        {activeTab === "notes" && <ContactNotesTab contactId={contactId || ""} />}
        {activeTab === "activities" && <ActivitiesTab activities={relatedActivities} />}
        {activeTab === "deals" && (
          <DealsTab deals={relatedDeals} onNavigateDeal={(id) => navigate(`/crm/deals/${id}`)} />
        )}
        {activeTab === "documents" && <ContactDocumentsTab contactId={contactId || ""} />}
        {activeTab === "customFields" && <ContactCustomFieldsTab contactId={contactId || ""} />}
      </div>

      {/* Edit Form */}
      <ContactFormModal
        isOpen={showEditForm}
        onClose={() => setShowEditForm(false)}
        editingContact={contact}
        onSave={async (data) => {
          await updateContact(contact.id, data);
          toast.success(`Đã cập nhật liên hệ "${data.name}"`);
          setShowEditForm(false);
          loadContact();
        }}
      />
    </div>
  );
}

/* ============================================================
 * Tab: Deals liên quan
 * ============================================================ */
function DealsTab({ deals, onNavigateDeal }: { deals: Deal[]; onNavigateDeal: (id: string) => void }) {
  if (deals.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400">
        <Target className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">Chưa có deal nào liên quan</p>
      </div>
    );
  }

  const totalValue = deals.reduce((sum, d) => sum + d.value, 0);
  const activeDeals = deals.filter((d) => d.stage !== "closed-won" && d.stage !== "closed-lost");

  return (
    <div className="space-y-4">
      {/* Thống kê */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-lg text-gray-900">{deals.length}</p>
          <p className="text-xs text-gray-500">Tổng deals</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-100 p-3 text-center">
          <p className="text-lg text-violet-700">{activeDeals.length}</p>
          <p className="text-xs text-violet-600">Đang mở</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-3 text-center">
          <p className="text-lg text-green-700">{formatCurrency(totalValue)}</p>
          <p className="text-xs text-green-600">Tổng giá trị</p>
        </div>
      </div>

      {/* Danh sách deals */}
      <div className="space-y-2">
        {deals.map((deal) => {
          const stageConfig = DEAL_STAGE_CONFIG[deal.stage];
          const priorityConfig = DEAL_PRIORITY_CONFIG[deal.priority];

          return (
            <button
              key={deal.id}
              type="button"
              onClick={() => onNavigateDeal(deal.id)}
              className="w-full text-left bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm hover:border-gray-200 transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-sm text-gray-900">{deal.title}</h4>
                <ExternalLink className="w-3.5 h-3.5 text-gray-300 flex-shrink-0 mt-0.5" />
              </div>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${stageConfig.bgColor} ${stageConfig.color}`}>
                  {stageConfig.label}
                </span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${priorityConfig.color}`}>
                  {priorityConfig.emoji} {priorityConfig.label}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  {formatCurrency(deal.value)}
                </span>
                <span className="flex items-center gap-1">
                  <Bot className="w-3 h-3 text-violet-500" />
                  AI {deal.aiWinProbability}%
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {deal.expectedCloseDate}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
 * Tab: Hoạt động
 * ============================================================ */
function ActivitiesTab({ activities }: { activities: Activity[] }) {
  if (activities.length === 0) {
    return (
      <div className="py-12 text-center text-gray-400">
        <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">Chưa có hoạt động nào liên quan</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {activities.map((act) => {
        const typeConfig = ACTIVITY_TYPE_CONFIG[act.type];
        return (
          <div key={act.id} className="flex gap-3 group">
            {/* Timeline dot */}
            <div className="flex flex-col items-center flex-shrink-0">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${ACT_COLORS[act.type]}`}>
                {ACT_ICONS[act.type]}
              </div>
              <div className="w-0.5 flex-1 bg-gray-200 mt-1" />
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <div className="bg-white rounded-xl border border-gray-100 p-3 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h4 className="text-sm text-gray-900">{act.title}</h4>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 ${typeConfig.color}`}>
                    {typeConfig.label}
                  </span>
                </div>
                {act.description && (
                  <p className="text-xs text-gray-500 mb-1.5">{act.description}</p>
                )}
                <div className="flex items-center gap-3 flex-wrap text-[11px] text-gray-400">
                  <span className="flex items-center gap-1">
                    {act.isAutoLogged ? <Bot className="w-3 h-3 text-violet-500" /> : <User className="w-3 h-3" />}
                    {getEmployeeName(act.performedBy)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {formatRelative(act.performedAt)}
                  </span>
                  {act.duration && (
                    <span className="bg-gray-100 px-1.5 py-0.5 rounded text-[10px]">
                      {act.duration} phút
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
 * Icon & color cho Activity
 * ============================================================ */
const ACT_ICONS: Record<ActivityTypeEnum, React.ReactNode> = {
  call: <Phone className="w-3.5 h-3.5" />,
  email: <Mail className="w-3.5 h-3.5" />,
  meeting: <Video className="w-3.5 h-3.5" />,
  note: <FileText className="w-3.5 h-3.5" />,
  task: <CheckSquare className="w-3.5 h-3.5" />,
};

const ACT_COLORS: Record<ActivityTypeEnum, string> = {
  call: "bg-green-100 text-green-700",
  email: "bg-blue-100 text-blue-700",
  meeting: "bg-violet-100 text-violet-700",
  note: "bg-amber-100 text-amber-700",
  task: "bg-slate-100 text-slate-700",
};

/* ============================================================
 * Format thời gian
 * ============================================================ */
function formatRelative(iso: string): string {
  const d = new Date(iso);
  const now = new Date("2026-03-03T12:00:00");
  const diffH = Math.round((now.getTime() - d.getTime()) / 3600000);
  if (diffH < 1) return "Vừa xong";
  if (diffH < 24) return `${diffH}h trước`;
  const diffD = Math.floor(diffH / 24);
  if (diffD < 30) return `${diffD} ngày trước`;
  return `${Math.floor(diffD / 30)} tháng trước`;
}