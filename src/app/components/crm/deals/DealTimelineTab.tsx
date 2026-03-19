/**
 * Deal Timeline Tab - Lịch sử chuyển stage và activities
 */
import { 
  Phone, 
  Mail, 
  Video, 
  FileText, 
  CheckSquare,
  ArrowRight,
  User,
  Clock,
  Filter
} from "lucide-react";
import { useState } from "react";
import type { Deal, DealStage, Activity, ActivityType } from "../../../types/crm";
import { DEAL_STAGE_CONFIG } from "../../../constants/crmConfig";

interface DealTimelineTabProps {
  deal: Deal;
  activities: Activity[];
}

interface StageHistoryEntry {
  id: string;
  fromStage: DealStage | null;
  toStage: DealStage;
  changedBy: string;
  changedAt: string;
  note?: string;
}

const ACTIVITY_TYPE_ICONS: Record<ActivityType, React.ReactNode> = {
  call: <Phone className="w-3.5 h-3.5" />,
  email: <Mail className="w-3.5 h-3.5" />,
  meeting: <Video className="w-3.5 h-3.5" />,
  note: <FileText className="w-3.5 h-3.5" />,
  task: <CheckSquare className="w-3.5 h-3.5" />,
};

const ACTIVITY_TYPE_COLORS: Record<ActivityType, string> = {
  call: "bg-green-100 text-green-700 border-green-200",
  email: "bg-blue-100 text-blue-700 border-blue-200",
  meeting: "bg-violet-100 text-violet-700 border-violet-200",
  note: "bg-amber-100 text-amber-700 border-amber-200",
  task: "bg-slate-100 text-slate-700 border-slate-200",
};

// Generate mock stage history
function generateStageHistory(deal: Deal): StageHistoryEntry[] {
  const stages: DealStage[] = ["qualification", "discovery", "proposal", "negotiation"];
  const currentStageIndex = stages.indexOf(deal.stage);
  const history: StageHistoryEntry[] = [];
  
  const baseDate = new Date(deal.createdDate);
  
  // Add creation
  history.push({
    id: `stage-0`,
    fromStage: null,
    toStage: "qualification",
    changedBy: deal.assignedTo,
    changedAt: deal.createdDate,
    note: "Deal được tạo mới"
  });

  // Add stage changes
  for (let i = 1; i <= Math.min(currentStageIndex, stages.length - 1); i++) {
    const date = new Date(baseDate);
    date.setDate(date.getDate() + i * 7);
    
    history.push({
      id: `stage-${i}`,
      fromStage: stages[i - 1],
      toStage: stages[i],
      changedBy: deal.assignedTo,
      changedAt: date.toISOString(),
    });
  }

  // Add closed stage if applicable
  if (deal.stage === "closed-won" || deal.stage === "closed-lost") {
    const closeDate = new Date(baseDate);
    closeDate.setDate(closeDate.getDate() + (currentStageIndex + 1) * 7);
    history.push({
      id: `stage-final`,
      fromStage: stages[Math.min(currentStageIndex, stages.length - 1)],
      toStage: deal.stage,
      changedBy: deal.assignedTo,
      changedAt: closeDate.toISOString(),
      note: deal.stage === "closed-won" ? "Deal thành công!" : "Deal không thành công"
    });
  }

  return history.reverse();
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRelative(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diffH = Math.round((now.getTime() - d.getTime()) / 3600000);
  
  if (diffH < 1) return "Vừa xong";
  if (diffH < 24) return `${diffH}h trước`;
  
  const diffD = Math.floor(diffH / 24);
  if (diffD < 30) return `${diffD} ngày trước`;
  
  const diffM = Math.floor(diffD / 30);
  return `${diffM} tháng trước`;
}

export function DealTimelineTab({ deal, activities }: DealTimelineTabProps) {
  const [filter, setFilter] = useState<"all" | "stages" | "activities">("all");
  const stageHistory = generateStageHistory(deal);

  // Combine and sort timeline items
  const timelineItems = [
    ...stageHistory.map(entry => ({
      type: "stage" as const,
      id: entry.id,
      timestamp: entry.changedAt,
      data: entry
    })),
    ...activities.map(activity => ({
      type: "activity" as const,
      id: activity.id,
      timestamp: activity.date,
      data: activity
    }))
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Apply filter
  const filteredItems = timelineItems.filter(item => {
    if (filter === "all") return true;
    if (filter === "stages") return item.type === "stage";
    if (filter === "activities") return item.type === "activity";
    return true;
  });

  // Group by date
  const groupedByDate = filteredItems.reduce((acc, item) => {
    const date = new Date(item.timestamp).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
    
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {} as Record<string, typeof filteredItems>);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-gray-400" />
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded text-xs transition-colors ${
            filter === "all"
              ? "bg-violet-100 text-violet-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Tất cả
        </button>
        <button
          type="button"
          onClick={() => setFilter("stages")}
          className={`px-3 py-1 rounded text-xs transition-colors ${
            filter === "stages"
              ? "bg-violet-100 text-violet-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Stage Changes
        </button>
        <button
          type="button"
          onClick={() => setFilter("activities")}
          className={`px-3 py-1 rounded text-xs transition-colors ${
            filter === "activities"
              ? "bg-violet-100 text-violet-700"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Activities
        </button>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {Object.entries(groupedByDate).map(([date, items]) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-3">
              <div className="text-xs font-medium text-gray-900">{date}</div>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div className="space-y-3">
              {items.map((item) => {
                if (item.type === "stage") {
                  const entry = item.data as StageHistoryEntry;
                  const toStageConfig = DEAL_STAGE_CONFIG[entry.toStage];
                  const fromStageConfig = entry.fromStage ? DEAL_STAGE_CONFIG[entry.fromStage] : null;

                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <span className="text-sm font-medium text-gray-900">Stage thay đổi</span>
                            {fromStageConfig && (
                              <>
                                <span className={`px-2 py-0.5 rounded text-xs ${fromStageConfig.bgColor} ${fromStageConfig.color}`}>
                                  {fromStageConfig.label}
                                </span>
                                <ArrowRight className="w-3 h-3 text-gray-400" />
                              </>
                            )}
                            <span className={`px-2 py-0.5 rounded text-xs ${toStageConfig.bgColor} ${toStageConfig.color}`}>
                              {toStageConfig.label}
                            </span>
                          </div>
                          
                          {entry.note && (
                            <p className="text-sm text-gray-600 mb-2">{entry.note}</p>
                          )}
                          
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {entry.changedBy}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatRelative(entry.changedAt)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  const activity = item.data as Activity;
                  const typeColor = ACTIVITY_TYPE_COLORS[activity.type];

                  return (
                    <div
                      key={item.id}
                      className="bg-white border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${typeColor}`}>
                          {ACTIVITY_TYPE_ICONS[activity.type]}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 mb-1">
                            {activity.title}
                          </div>
                          
                          {activity.notes && (
                            <p className="text-sm text-gray-600 mb-2">{activity.notes}</p>
                          )}
                          
                          <div className="flex items-center gap-3 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {activity.assignedTo}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatRelative(activity.date)}
                            </div>
                          </div>
                        </div>

                        <div className="text-xs text-gray-400">
                          {formatDateTime(activity.date)}
                        </div>
                      </div>
                    </div>
                  );
                }
              })}
            </div>
          </div>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm">Chưa có timeline items</p>
        </div>
      )}
    </div>
  );
}
