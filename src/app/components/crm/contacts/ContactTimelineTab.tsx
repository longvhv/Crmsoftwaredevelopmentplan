/**
 * Tab Timeline cho Contact Detail Page
 * Hiển thị timeline đầy đủ của tất cả hoạt động: emails, calls, meetings, notes, deal updates
 */
import { useState } from "react";
import {
  Phone,
  Mail,
  Video,
  FileText,
  CheckSquare,
  Clock,
  User,
  Bot,
  Filter,
  Target,
  Calendar,
  TrendingUp,
  MessageCircle,
  File,
} from "lucide-react";
import type { Activity, ActivityType } from "../../../types/crm";
import { ACTIVITY_TYPE_CONFIG } from "../../../constants/crmConfig";
import { getEmployeeName } from "../../../api/crmApi";

const ACTIVITY_ICONS: Record<ActivityType, React.ReactNode> = {
  call: <Phone className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
  meeting: <Video className="w-4 h-4" />,
  note: <FileText className="w-4 h-4" />,
  task: <CheckSquare className="w-4 h-4" />,
};

const ACTIVITY_COLORS: Record<ActivityType, string> = {
  call: "bg-green-100 text-green-700 border-green-200",
  email: "bg-blue-100 text-blue-700 border-blue-200",
  meeting: "bg-violet-100 text-violet-700 border-violet-200",
  note: "bg-amber-100 text-amber-700 border-amber-200",
  task: "bg-slate-100 text-slate-700 border-slate-200",
};

function formatRelative(iso: string): string {
  const d = new Date(iso);
  const now = new Date("2026-03-17T12:00:00");
  const diffMs = now.getTime() - d.getTime();
  const diffH = Math.round(diffMs / 3600000);
  
  if (diffH < 1) return "Vừa xong";
  if (diffH < 24) return `${diffH}h trước`;
  
  const diffD = Math.floor(diffH / 24);
  if (diffD < 30) return `${diffD} ngày trước`;
  
  const diffM = Math.floor(diffD / 30);
  if (diffM < 12) return `${diffM} tháng trước`;
  
  return `${Math.floor(diffM / 12)} năm trước`;
}

interface ContactTimelineTabProps {
  activities: Activity[];
}

export function ContactTimelineTab({ activities }: ContactTimelineTabProps) {
  const [filterType, setFilterType] = useState<ActivityType | "all">("all");
  const [showAutoLogged, setShowAutoLogged] = useState(true);

  // Filter activities
  const filteredActivities = activities.filter((act) => {
    if (filterType !== "all" && act.type !== filterType) return false;
    if (!showAutoLogged && act.isAutoLogged) return false;
    return true;
  });

  // Group by date
  const groupedByDate = filteredActivities.reduce((acc, act) => {
    const date = new Date(act.performedAt).toLocaleDateString("vi-VN");
    if (!acc[date]) acc[date] = [];
    acc[date].push(act);
    return acc;
  }, {} as Record<string, Activity[]>);

  const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
    return new Date(groupedByDate[b][0].performedAt).getTime() - new Date(groupedByDate[a][0].performedAt).getTime();
  });

  if (activities.length === 0) {
    return (
      <div className="py-16 text-center">
        <Clock className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p className="text-sm text-gray-500">Chưa có hoạt động nào</p>
        <p className="text-xs text-gray-400 mt-1">Các hoạt động sẽ được hiển thị ở đây</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap bg-white border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Filter className="w-4 h-4" />
          <span>Lọc:</span>
        </div>
        <div className="flex items-center gap-2 flex-wrap flex-1">
          <button
            type="button"
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
              filterType === "all"
                ? "bg-violet-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Tất cả ({activities.length})
          </button>
          {(["call", "email", "meeting", "note", "task"] as ActivityType[]).map((type) => {
            const count = activities.filter((a) => a.type === type).length;
            return (
              <button
                key={type}
                type="button"
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center gap-1.5 ${
                  filterType === type
                    ? "bg-violet-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {ACTIVITY_ICONS[type]}
                {ACTIVITY_TYPE_CONFIG[type].label} ({count})
              </button>
            );
          })}
        </div>
        <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={showAutoLogged}
            onChange={(e) => setShowAutoLogged(e.target.checked)}
            className="rounded border-gray-300"
          />
          Hiện hoạt động tự động
        </label>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {filteredActivities.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <p className="text-sm">Không có hoạt động nào phù hợp với bộ lọc</p>
          </div>
        ) : (
          sortedDates.map((date) => (
            <div key={date} className="space-y-3">
              {/* Date Header */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-100 px-3 py-1 rounded-lg">
                  <Calendar className="w-4 h-4" />
                  {date}
                </div>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Activities for this date */}
              <div className="space-y-2 pl-4">
                {groupedByDate[date].map((act, idx) => {
                  const isLast = idx === groupedByDate[date].length - 1;
                  return (
                    <div key={act.id} className="flex gap-3 group">
                      {/* Timeline dot and line */}
                      <div className="flex flex-col items-center flex-shrink-0 pt-1">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${ACTIVITY_COLORS[act.type]}`}
                        >
                          {ACTIVITY_ICONS[act.type]}
                        </div>
                        {!isLast && <div className="w-0.5 flex-1 bg-gray-200 mt-2 min-h-[20px]" />}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-3">
                        <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all">
                          <div className="flex items-start justify-between gap-3 mb-2">
                            <h4 className="text-sm text-gray-900 flex-1">{act.title}</h4>
                            <span
                              className={`text-[10px] px-2 py-1 rounded-full flex-shrink-0 ${ACTIVITY_TYPE_CONFIG[act.type].color}`}
                            >
                              {ACTIVITY_TYPE_CONFIG[act.type].label}
                            </span>
                          </div>

                          {act.description && (
                            <p className="text-xs text-gray-600 mb-3 leading-relaxed">{act.description}</p>
                          )}

                          {/* Metadata */}
                          <div className="flex items-center gap-4 flex-wrap text-[11px] text-gray-400">
                            <span className="flex items-center gap-1.5">
                              {act.isAutoLogged ? (
                                <>
                                  <Bot className="w-3.5 h-3.5 text-violet-500" />
                                  <span className="text-violet-600">AI tự động</span>
                                </>
                              ) : (
                                <>
                                  <User className="w-3.5 h-3.5" />
                                  {getEmployeeName(act.performedBy)}
                                </>
                              )}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5" />
                              {formatRelative(act.performedAt)}
                            </span>
                            {act.duration && (
                              <span className="bg-gray-100 px-2 py-0.5 rounded text-[10px] text-gray-600">
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}
