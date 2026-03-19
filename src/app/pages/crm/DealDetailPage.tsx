/**
 * Deal Detail Page - Professional tabs-based layout
 * Phase 3.3.1: Complete Deal Management with AI insights
 */
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import {
  ArrowLeft,
  LayoutGrid,
  Clock,
  FileText,
  Activity,
  Package,
  Files,
  Edit3,
  Trash2,
  MoreVertical,
  Brain
} from "lucide-react";
import { toast } from "sonner";
import type { Deal, Activity as ActivityType } from "../../types/crm";
import { fetchDeals, fetchActivities, updateDeal } from "../../api/crmApi";
import { DealOverviewTab } from "../../components/crm/deals/DealOverviewTab";
import { DealTimelineTab } from "../../components/crm/deals/DealTimelineTab";
import { DealActivitiesTab } from "../../components/crm/deals/DealActivitiesTab";
import { DealProductsTab } from "../../components/crm/deals/DealProductsTab";
import { DealProbabilityScoring } from "../../components/crm/deals/DealProbabilityScoring";
import { ContactNotesTab } from "../../components/crm/contacts/ContactNotesTab";
import { ContactDocumentsTab } from "../../components/crm/contacts/ContactDocumentsTab";
import { DEAL_STAGE_CONFIG, DEAL_STAGE_ORDER } from "../../constants/crmConfig";

type TabType = "overview" | "timeline" | "activities" | "products" | "ai-scoring" | "notes" | "documents";

const TABS: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
  { id: "overview", label: "Tổng quan", icon: <LayoutGrid className="w-4 h-4" /> },
  { id: "timeline", label: "Timeline", icon: <Clock className="w-4 h-4" /> },
  { id: "activities", label: "Activities", icon: <Activity className="w-4 h-4" /> },
  { id: "products", label: "Sản phẩm", icon: <Package className="w-4 h-4" /> },
  { id: "ai-scoring", label: "Đánh giá AI", icon: <Brain className="w-4 h-4" /> },
  { id: "notes", label: "Ghi chú", icon: <FileText className="w-4 h-4" /> },
  { id: "documents", label: "Tài liệu", icon: <Files className="w-4 h-4" /> },
];

/**
 * Stage Progress Bar Component
 */
function StageProgressBar({ currentStage }: { currentStage: Deal["stage"] }) {
  const currentIdx = DEAL_STAGE_ORDER.indexOf(currentStage);
  const isClosedWon = currentStage === "closed-won";
  const isClosedLost = currentStage === "closed-lost";

  return (
    <div className="flex items-center gap-0.5 overflow-x-auto pb-2">
      {DEAL_STAGE_ORDER.map((stage, idx) => {
        const config = DEAL_STAGE_CONFIG[stage];
        const isActive = idx === currentIdx;
        const isPassed = idx < currentIdx;
        const isWon = stage === "closed-won" && isClosedWon;
        const isLost = stage === "closed-lost" && isClosedLost;

        let dotClass = "bg-gray-200 text-gray-400";
        if (isActive || isWon) dotClass = "bg-green-500 text-white";
        else if (isLost) dotClass = "bg-red-500 text-white";
        else if (isPassed) dotClass = "bg-violet-500 text-white";

        return (
          <div key={stage} className="flex items-center gap-0.5 flex-shrink-0">
            <div className="flex flex-col items-center gap-1">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-medium ${dotClass}`}
              >
                {isPassed && !isLost ? "✓" : idx + 1}
              </div>
              <span
                className={`text-[10px] whitespace-nowrap max-w-[60px] text-center leading-tight ${
                  isActive ? "text-gray-900 font-medium" : "text-gray-400"
                }`}
              >
                {config.label}
              </span>
            </div>
            {idx < DEAL_STAGE_ORDER.length - 1 && (
              <div className={`w-6 h-0.5 mb-4 ${isPassed ? "bg-violet-400" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export function DealDetailPage() {
  const { dealId } = useParams();
  const navigate = useNavigate();
  const [deal, setDeal] = useState<Deal | null>(null);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [isLoading, setIsLoading] = useState(true);
  const [showActionMenu, setShowActionMenu] = useState(false);

  useEffect(() => {
    loadData();
  }, [dealId]);

  const loadData = async () => {
    if (!dealId) return;
    
    setIsLoading(true);
    try {
      const [dealsData, activitiesData] = await Promise.all([
        fetchDeals(),
        fetchActivities()
      ]);

      const foundDeal = dealsData.find(d => d.id === dealId);
      if (!foundDeal) {
        toast.error("Không tìm thấy deal");
        navigate("/crm/pipeline");
        return;
      }

      setDeal(foundDeal);
      
      // Filter activities for this deal
      const dealActivities = activitiesData.filter(
        a => a.relatedTo === dealId || a.dealId === dealId
      );
      setActivities(dealActivities);
    } catch (error) {
      console.error("Error loading deal:", error);
      toast.error("Không thể tải thông tin deal");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDeal = async (updates: Partial<Deal>) => {
    if (!deal) return;

    try {
      const updatedDeal = await updateDeal(deal.id, updates);
      setDeal(updatedDeal);
      toast.success("Đã cập nhật deal");
    } catch (error) {
      console.error("Error updating deal:", error);
      toast.error("Không thể cập nhật deal");
    }
  };

  const handleUpdateActivity = (activityId: string, updates: Partial<ActivityType>) => {
    setActivities(activities.map(a => a.id === activityId ? { ...a, ...updates } : a));
  };

  const handleDeleteActivity = (activityId: string) => {
    setActivities(activities.filter(a => a.id !== activityId));
  };

  const handleDeleteDeal = () => {
    if (window.confirm("Bạn có chắc muốn xóa deal này? Hành động này không thể hoàn tác.")) {
      toast.success("Deal đã được xóa");
      navigate("/crm/pipeline");
    }
    setShowActionMenu(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm text-gray-500">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!deal) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không tìm thấy deal</p>
      </div>
    );
  }

  const stageConfig = DEAL_STAGE_CONFIG[deal.stage];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate("/crm/pipeline")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại Pipeline
          </button>

          {/* Deal Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl text-gray-900 mb-2 truncate">{deal.title}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`px-2 py-1 rounded text-xs ${stageConfig.bgColor} ${stageConfig.color}`}>
                  {stageConfig.label}
                </span>
                <Link
                  to={`/crm/contacts/${deal.contactId}`}
                  className="text-sm text-violet-600 hover:text-violet-700"
                >
                  {deal.contactName}
                </Link>
                <span className="text-sm text-gray-500">•</span>
                <Link
                  to={`/crm/companies/${deal.company}`}
                  className="text-sm text-violet-600 hover:text-violet-700"
                >
                  {deal.company}
                </Link>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => toast.info("Edit deal feature coming soon")}
                className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Chỉnh sửa
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowActionMenu(!showActionMenu)}
                  className="p-2 text-gray-400 hover:text-gray-600 border border-gray-200 rounded-lg"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showActionMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      type="button"
                      onClick={handleDeleteDeal}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                      Xóa deal
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stage Progress */}
          <StageProgressBar currentStage={deal.stage} />
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? "border-violet-600 text-violet-600"
                    : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === "overview" && (
          <DealOverviewTab deal={deal} onUpdate={handleUpdateDeal} />
        )}
        {activeTab === "timeline" && (
          <DealTimelineTab deal={deal} activities={activities} />
        )}
        {activeTab === "activities" && (
          <DealActivitiesTab
            activities={activities}
            onUpdate={handleUpdateActivity}
            onDelete={handleDeleteActivity}
            onAdd={() => toast.info("Add activity feature coming soon")}
          />
        )}
        {activeTab === "products" && (
          <DealProductsTab dealId={deal.id} />
        )}
        {activeTab === "ai-scoring" && (
          <DealProbabilityScoring deal={deal} />
        )}
        {activeTab === "notes" && (
          <ContactNotesTab contactId={deal.id} contactName={deal.title} />
        )}
        {activeTab === "documents" && (
          <ContactDocumentsTab contactId={deal.id} contactName={deal.title} />
        )}
      </div>
    </div>
  );
}