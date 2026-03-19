/**
 * Deal Overview Tab - Hiển thị thông tin tổng quan về deal
 */
import { 
  Edit3, 
  DollarSign, 
  Calendar, 
  Target, 
  User, 
  Building2,
  Flame,
  Sun,
  Snowflake,
  TrendingUp,
  Clock,
  Mail,
  Phone,
  Bot,
  AlertCircle,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Deal, DealStage } from "../../../types/crm";
import { 
  DEAL_STAGE_CONFIG, 
  DEAL_PRIORITY_CONFIG,
  formatCurrency 
} from "../../../constants/crmConfig";

interface DealOverviewTabProps {
  deal: Deal;
  onUpdate: (updates: Partial<Deal>) => void;
}

const PRIORITY_ICONS: Record<string, React.ReactNode> = {
  hot: <Flame className="w-4 h-4" />,
  warm: <Sun className="w-4 h-4" />,
  cold: <Snowflake className="w-4 h-4" />,
};

const STAGE_PROGRESS_MAP: Record<DealStage, number> = {
  qualification: 10,
  discovery: 25,
  proposal: 50,
  negotiation: 75,
  "closed-won": 100,
  "closed-lost": 0,
};

export function DealOverviewTab({ deal, onUpdate }: DealOverviewTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const stageConfig = DEAL_STAGE_CONFIG[deal.stage];
  const priorityConfig = DEAL_PRIORITY_CONFIG[deal.priority];
  const progress = STAGE_PROGRESS_MAP[deal.stage];

  // AI Win Probability Score
  const winProbability = deal.stage === "closed-won" ? 100 : 
    deal.stage === "closed-lost" ? 0 :
    Math.round(50 + (progress / 2) + Math.random() * 20);

  // Calculate days in stage
  const createdDate = new Date(deal.createdDate);
  const now = new Date();
  const daysInStage = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));

  // AI Insights based on deal data
  const getAIInsights = () => {
    const insights = [];

    if (winProbability > 70) {
      insights.push({
        type: "success" as const,
        icon: <CheckCircle2 className="w-4 h-4" />,
        message: `Xác suất thành công cao (${winProbability}%). Tiếp tục theo dõi để đảm bảo chốt deal đúng hạn.`
      });
    } else if (winProbability < 40) {
      insights.push({
        type: "warning" as const,
        icon: <AlertCircle className="w-4 h-4" />,
        message: `Xác suất thành công thấp (${winProbability}%). Nên có cuộc họp với khách hàng để hiểu rõ concerns.`
      });
    }

    if (daysInStage > 30 && deal.stage !== "closed-won" && deal.stage !== "closed-lost") {
      insights.push({
        type: "warning" as const,
        icon: <Clock className="w-4 h-4" />,
        message: `Deal đã ở stage ${stageConfig.label} ${daysInStage} ngày. Cân nhắc các hành động đẩy nhanh.`
      });
    }

    if (deal.priority === "hot" && deal.closeDate) {
      const closeDate = new Date(deal.closeDate);
      const daysToClose = Math.floor((closeDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      if (daysToClose < 7 && daysToClose > 0) {
        insights.push({
          type: "urgent" as const,
          icon: <Flame className="w-4 h-4" />,
          message: `Deal hot sẽ đóng trong ${daysToClose} ngày. Ưu tiên cao nhất!`
        });
      }
    }

    return insights;
  };

  const aiInsights = getAIInsights();

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">Giá trị</span>
          </div>
          <div className="text-xl text-gray-900">{formatCurrency(deal.amount)}</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">Win Probability</span>
          </div>
          <div className="text-xl text-gray-900">{winProbability}%</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">Days in Stage</span>
          </div>
          <div className="text-xl text-gray-900">{daysInStage}</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-xs text-gray-500">Expected Close</span>
          </div>
          <div className="text-sm text-gray-900">
            {deal.closeDate ? new Date(deal.closeDate).toLocaleDateString("vi-VN") : "Chưa xác định"}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      {aiInsights.length > 0 && (
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="w-5 h-5 text-violet-600" />
            <h3 className="text-sm font-medium text-gray-900">AI Insights</h3>
          </div>
          <div className="space-y-2">
            {aiInsights.map((insight, index) => {
              const colorClasses = {
                success: "bg-green-50 border-green-200 text-green-700",
                warning: "bg-amber-50 border-amber-200 text-amber-700",
                urgent: "bg-red-50 border-red-200 text-red-700"
              };

              return (
                <div 
                  key={index}
                  className={`flex items-start gap-2 p-3 border rounded-lg ${colorClasses[insight.type]}`}
                >
                  {insight.icon}
                  <span className="text-sm flex-1">{insight.message}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Main Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-900">Deal Information</h3>
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className="text-violet-600 hover:text-violet-700 text-xs flex items-center gap-1"
              >
                <Edit3 className="w-3 h-3" />
                Edit
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Deal Name</label>
                <div className="text-sm text-gray-900 mt-1">{deal.title}</div>
              </div>

              <div>
                <label className="text-xs text-gray-500">Stage</label>
                <div className="mt-1">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${stageConfig.bgColor} ${stageConfig.color}`}>
                    {stageConfig.label}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500">Priority</label>
                <div className="mt-1">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs ${priorityConfig.bgColor} ${priorityConfig.color}`}>
                    {PRIORITY_ICONS[deal.priority]}
                    {priorityConfig.label}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500">Amount</label>
                <div className="text-sm text-gray-900 mt-1">{formatCurrency(deal.amount)}</div>
              </div>

              <div>
                <label className="text-xs text-gray-500">Close Date</label>
                <div className="text-sm text-gray-900 mt-1">
                  {deal.closeDate ? new Date(deal.closeDate).toLocaleDateString("vi-VN") : "—"}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500">Created Date</label>
                <div className="text-sm text-gray-900 mt-1">
                  {new Date(deal.createdDate).toLocaleDateString("vi-VN")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Contact & Company */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Contact & Company</h3>
            
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Primary Contact</label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{deal.contactName}</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500">Company</label>
                <div className="flex items-center gap-2 mt-1">
                  <Building2 className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{deal.company}</span>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-500">Deal Owner</label>
                <div className="flex items-center gap-2 mt-1">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{deal.assignedTo}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Win Probability Chart */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="text-sm font-medium text-gray-900 mb-4">Win Probability</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-semibold text-gray-900">{winProbability}%</span>
                <span className="text-xs text-gray-500">AI-powered prediction</span>
              </div>

              {/* Progress bar */}
              <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-500"
                  style={{ width: `${winProbability}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <div className="text-gray-500">Low</div>
                  <div className="text-red-600 font-medium">0-30%</div>
                </div>
                <div>
                  <div className="text-gray-500">Medium</div>
                  <div className="text-amber-600 font-medium">31-70%</div>
                </div>
                <div>
                  <div className="text-gray-500">High</div>
                  <div className="text-green-600 font-medium">71-100%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {deal.notes && (
        <div className="bg-white border border-gray-200 rounded-lg p-5">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Description</h3>
          <p className="text-sm text-gray-600 whitespace-pre-wrap">{deal.notes}</p>
        </div>
      )}
    </div>
  );
}
