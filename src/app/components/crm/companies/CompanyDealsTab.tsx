/**
 * Tab Deals cho Company Detail Page
 * Hiển thị danh sách deals/opportunities thuộc công ty này
 */
import { useState } from "react";
import {
  Target,
  Plus,
  Search,
  TrendingUp,
  Calendar,
  DollarSign,
  User,
  ArrowRight,
  CircleDot,
} from "lucide-react";
import { toast } from "sonner";
import type { Deal } from "../../../types/crm";
import { getEmployeeName } from "../../../api/crmApi";
import { DEAL_STAGE_CONFIG, formatCurrency } from "../../../constants/crmConfig";

interface CompanyDealsTabProps {
  companyId: string;
  companyName: string;
}

// Mock deals data
const MOCK_DEALS: Deal[] = [
  {
    id: "deal-001",
    title: "Enterprise License Q1 2026",
    contactId: "contact-001",
    contactName: "Nguyễn Văn An",
    company: "TechCorp Vietnam",
    value: 250000,
    currency: "USD",
    stage: "proposal",
    priority: "hot",
    probability: 75,
    assignedTo: "user-001",
    expectedCloseDate: "2026-03-31",
    createdDate: "2026-01-15",
    aiWinProbability: 78,
    aiNextAction: "Schedule demo with technical team",
    tags: ["Enterprise", "High Value"],
    notes: "Key strategic deal for Q1",
  },
  {
    id: "deal-002",
    title: "API Integration Services",
    contactId: "contact-002",
    contactName: "Trần Thị Bình",
    company: "TechCorp Vietnam",
    value: 85000,
    currency: "USD",
    stage: "negotiation",
    priority: "warm",
    probability: 60,
    assignedTo: "user-002",
    expectedCloseDate: "2026-04-15",
    createdDate: "2026-02-01",
    aiWinProbability: 65,
    aiNextAction: "Send final proposal with pricing options",
    tags: ["Services", "Integration"],
  },
  {
    id: "deal-003",
    title: "Training & Onboarding Package",
    contactId: "contact-003",
    contactName: "Lê Văn Cường",
    company: "TechCorp Vietnam",
    value: 45000,
    currency: "USD",
    stage: "discovery",
    priority: "warm",
    probability: 40,
    assignedTo: "user-001",
    expectedCloseDate: "2026-05-01",
    createdDate: "2026-02-15",
    aiWinProbability: 45,
    aiNextAction: "Understand training requirements",
    tags: ["Training", "Onboarding"],
  },
  {
    id: "deal-004",
    title: "Premium Support Plan",
    contactId: "contact-001",
    contactName: "Nguyễn Văn An",
    company: "TechCorp Vietnam",
    value: 30000,
    currency: "USD",
    stage: "qualification",
    priority: "cold",
    probability: 25,
    assignedTo: "user-002",
    expectedCloseDate: "2026-06-01",
    createdDate: "2026-03-01",
    aiWinProbability: 30,
    aiNextAction: "Qualify budget and timeline",
    tags: ["Support", "Recurring"],
  },
  {
    id: "deal-005",
    title: "Custom Development Project",
    contactId: "contact-002",
    contactName: "Trần Thị Bình",
    company: "TechCorp Vietnam",
    value: 180000,
    currency: "USD",
    stage: "closed-won",
    priority: "hot",
    probability: 100,
    assignedTo: "user-001",
    expectedCloseDate: "2026-02-28",
    createdDate: "2025-12-10",
    aiWinProbability: 100,
    tags: ["Custom", "Development", "Won"],
  },
];

export function CompanyDealsTab({ companyId, companyName }: CompanyDealsTabProps) {
  const [deals] = useState<Deal[]>(MOCK_DEALS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStage, setFilterStage] = useState<string>("all");

  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.contactName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStage = filterStage === "all" || deal.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  const totalValue = filteredDeals.reduce((sum, deal) => sum + deal.value, 0);
  const avgProbability =
    filteredDeals.length > 0
      ? Math.round(filteredDeals.reduce((sum, deal) => sum + deal.probability, 0) / filteredDeals.length)
      : 0;
  const wonDeals = deals.filter((d) => d.stage === "closed-won");
  const wonValue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "hot":
        return "text-red-600 bg-red-50";
      case "warm":
        return "text-amber-600 bg-amber-50";
      case "cold":
        return "text-blue-600 bg-blue-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "hot":
        return "Hot";
      case "warm":
        return "Warm";
      case "cold":
        return "Cold";
      default:
        return priority;
    }
  };

  return (
    <div className="space-y-4">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-violet-50 rounded-xl border border-violet-100 p-4">
          <p className="text-xs text-violet-600 mb-1">Tổng giá trị</p>
          <p className="text-lg text-violet-900">{formatCurrency(totalValue)}</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-4">
          <p className="text-xs text-blue-600 mb-1">Đang hoạt động</p>
          <p className="text-lg text-blue-900">
            {deals.filter((d) => !d.stage.startsWith("closed")).length} deals
          </p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-4">
          <p className="text-xs text-green-600 mb-1">Đã thắng</p>
          <p className="text-lg text-green-900">{formatCurrency(wonValue)}</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-100 p-4">
          <p className="text-xs text-amber-600 mb-1">Xác suất TB</p>
          <p className="text-lg text-amber-900">{avgProbability}%</p>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm deals..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent w-64"
            />
          </div>
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          >
            <option value="all">Tất cả giai đoạn</option>
            <option value="qualification">Qualification</option>
            <option value="discovery">Discovery</option>
            <option value="proposal">Proposal</option>
            <option value="negotiation">Negotiation</option>
            <option value="closed-won">Won</option>
            <option value="closed-lost">Lost</option>
          </select>
        </div>
        <button
          type="button"
          onClick={() => toast.info("Tạo deal mới (Coming soon)")}
          className="flex items-center gap-1.5 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Tạo deal</span>
        </button>
      </div>

      {/* Deals List */}
      {filteredDeals.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <Target className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            {searchQuery || filterStage !== "all" ? "Không tìm thấy deal nào" : "Chưa có deal nào"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredDeals.map((deal) => {
            const stageConfig = DEAL_STAGE_CONFIG[deal.stage];

            return (
              <div
                key={deal.id}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all group cursor-pointer"
                onClick={() => (window.location.href = `/crm/deals/${deal.id}`)}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-sm text-gray-900">{deal.title}</h4>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${getPriorityColor(deal.priority)}`}>
                        {getPriorityLabel(deal.priority)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <User className="w-3.5 h-3.5" />
                      <span>{deal.contactName}</span>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-lg text-gray-900">{formatCurrency(deal.value)}</p>
                    <p className="text-xs text-gray-500">{deal.currency}</p>
                  </div>
                </div>

                {/* Stage & Probability */}
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2">
                    <CircleDot className={`w-4 h-4 ${stageConfig.color}`} />
                    <span className={`text-xs ${stageConfig.color}`}>{stageConfig.label}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3.5 h-3.5" />
                      {deal.probability}%
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {deal.expectedCloseDate}
                    </span>
                  </div>
                </div>

                {/* AI Insights */}
                {deal.aiNextAction && (
                  <div className="bg-blue-50 rounded-lg p-3 mb-3">
                    <p className="text-xs text-blue-600 mb-1 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      AI gợi ý hành động tiếp theo
                    </p>
                    <p className="text-xs text-blue-900">{deal.aiNextAction}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-blue-600">AI Win Probability:</span>
                      <span className="text-xs text-blue-700">{deal.aiWinProbability}%</span>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <User className="w-3.5 h-3.5" />
                    <span>{getEmployeeName(deal.assignedTo)}</span>
                  </div>
                  {deal.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {deal.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
