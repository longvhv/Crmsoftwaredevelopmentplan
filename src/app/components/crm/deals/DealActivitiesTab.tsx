/**
 * Deal Activities Tab - Quản lý activities của deal
 */
import { useState } from "react";
import {
  Phone,
  Mail,
  Video,
  FileText,
  CheckSquare,
  Plus,
  Filter,
  Search,
  Calendar,
  User,
  Clock,
  MoreVertical,
  Edit3,
  Trash2
} from "lucide-react";
import { toast } from "sonner";
import type { Activity, ActivityType } from "../../../types/crm";
import { ACTIVITY_TYPE_CONFIG } from "../../../constants/crmConfig";

interface DealActivitiesTabProps {
  activities: Activity[];
  onUpdate: (activityId: string, updates: Partial<Activity>) => void;
  onDelete: (activityId: string) => void;
  onAdd: () => void;
}

const ACTIVITY_TYPE_ICONS: Record<ActivityType, React.ReactNode> = {
  call: <Phone className="w-4 h-4" />,
  email: <Mail className="w-4 h-4" />,
  meeting: <Video className="w-4 h-4" />,
  note: <FileText className="w-4 h-4" />,
  task: <CheckSquare className="w-4 h-4" />,
};

export function DealActivitiesTab({
  activities,
  onUpdate,
  onDelete,
  onAdd
}: DealActivitiesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<ActivityType | "all">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "completed" | "pending">("all");
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);

  // Filter activities
  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.notes?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || activity.type === typeFilter;
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "completed" && activity.completed) ||
                         (statusFilter === "pending" && !activity.completed);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Group by status
  const upcomingActivities = filteredActivities.filter(a => !a.completed);
  const completedActivities = filteredActivities.filter(a => a.completed);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleComplete = (activityId: string, completed: boolean) => {
    onUpdate(activityId, { completed });
    toast.success(completed ? "Activity đã hoàn thành" : "Activity đã mở lại");
  };

  const handleDelete = (activityId: string) => {
    if (window.confirm("Bạn có chắc muốn xóa activity này?")) {
      onDelete(activityId);
      toast.success("Đã xóa activity");
    }
    setShowActionMenu(null);
  };

  const renderActivityCard = (activity: Activity) => {
    const config = ACTIVITY_TYPE_CONFIG[activity.type];
    
    return (
      <div
        key={activity.id}
        className="bg-white border border-gray-200 rounded-lg p-4 hover:border-violet-200 transition-colors"
      >
        <div className="flex items-start gap-3">
          {/* Type Icon */}
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${config.bgColor} ${config.color}`}>
            {ACTIVITY_TYPE_ICONS[activity.type]}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
              
              {/* Actions Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowActionMenu(showActionMenu === activity.id ? null : activity.id)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>
                
                {showActionMenu === activity.id && (
                  <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                    <button
                      type="button"
                      onClick={() => {
                        toast.info("Edit activity feature coming soon");
                        setShowActionMenu(null);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Edit3 className="w-3 h-3" />
                      Chỉnh sửa
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(activity.id)}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <Trash2 className="w-3 h-3" />
                      Xóa
                    </button>
                  </div>
                )}
              </div>
            </div>

            {activity.notes && (
              <p className="text-sm text-gray-600 mb-3">{activity.notes}</p>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formatDate(activity.date)}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatTime(activity.date)}
              </div>
              <div className="flex items-center gap-1">
                <User className="w-3 h-3" />
                {activity.assignedTo}
              </div>
            </div>
          </div>

          {/* Completion Toggle */}
          <button
            type="button"
            onClick={() => handleComplete(activity.id, !activity.completed)}
            className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
              activity.completed
                ? "bg-green-500 border-green-500"
                : "border-gray-300 hover:border-green-500"
            }`}
          >
            {activity.completed && (
              <CheckSquare className="w-3 h-3 text-white" />
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm activities..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Thêm Activity
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-gray-400" />
        
        {/* Type Filter */}
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as ActivityType | "all")}
          className="px-3 py-1 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="all">Tất cả loại</option>
          <option value="call">Calls</option>
          <option value="email">Emails</option>
          <option value="meeting">Meetings</option>
          <option value="task">Tasks</option>
          <option value="note">Notes</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as "all" | "completed" | "pending")}
          className="px-3 py-1 text-xs border border-gray-200 rounded bg-white focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Đang chờ</option>
          <option value="completed">Đã hoàn thành</option>
        </select>

        {filteredActivities.length > 0 && (
          <span className="text-xs text-gray-500">
            {filteredActivities.length} activities
          </span>
        )}
      </div>

      {/* Upcoming Activities */}
      {upcomingActivities.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">
            Đang chờ ({upcomingActivities.length})
          </h3>
          <div className="space-y-2">
            {upcomingActivities.map(renderActivityCard)}
          </div>
        </div>
      )}

      {/* Completed Activities */}
      {completedActivities.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">
            Đã hoàn thành ({completedActivities.length})
          </h3>
          <div className="space-y-2 opacity-60">
            {completedActivities.map(renderActivityCard)}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredActivities.length === 0 && (
        <div className="text-center py-12">
          <CheckSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm text-gray-500 mb-4">
            {searchQuery || typeFilter !== "all" || statusFilter !== "all"
              ? "Không tìm thấy activities phù hợp"
              : "Chưa có activities nào"}
          </p>
          <button
            type="button"
            onClick={onAdd}
            className="text-sm text-violet-600 hover:text-violet-700"
          >
            Thêm activity đầu tiên
          </button>
        </div>
      )}
    </div>
  );
}
