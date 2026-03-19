/**
 * Tab Timeline cho Company Detail Page
 * Hiển thị timeline các hoạt động, tương tác với công ty
 */
import { useState, useMemo } from "react";
import {
  Clock,
  Mail,
  Phone,
  Calendar,
  MessageSquare,
  FileText,
  TrendingUp,
  User,
  Filter,
  ChevronDown,
} from "lucide-react";
import type { Activity } from "../../../types/crm";
import { getEmployeeName } from "../../../api/crmApi";

interface CompanyTimelineTabProps {
  companyId: string;
  companyName: string;
}

// Extended activity type for timeline
interface TimelineActivity extends Activity {
  contactName?: string;
  dealTitle?: string;
}

// Mock timeline data
const MOCK_ACTIVITIES: TimelineActivity[] = [
  {
    id: "activity-001",
    type: "meeting",
    title: "Quarterly Business Review Meeting",
    description: "Discussed Q1 performance and roadmap for Q2. CTO expressed strong interest in API integration.",
    contactId: "contact-001",
    contactName: "Nguyễn Văn An",
    dealId: "deal-001",
    dealTitle: "Enterprise License Q1 2026",
    performedBy: "user-001",
    performedAt: "2026-03-15T14:30:00Z",
    duration: 90,
    isAutoLogged: false,
  },
  {
    id: "activity-002",
    type: "email",
    title: "Proposal sent for API Integration Services",
    description: "Comprehensive proposal with 3 pricing tiers and timeline breakdown.",
    contactId: "contact-002",
    contactName: "Trần Thị Bình",
    dealId: "deal-002",
    dealTitle: "API Integration Services",
    performedBy: "user-002",
    performedAt: "2026-03-14T10:15:00Z",
    isAutoLogged: true,
  },
  {
    id: "activity-003",
    type: "call",
    title: "Discovery call with Product Manager",
    description: "Initial conversation about training needs and current team skills.",
    contactId: "contact-003",
    contactName: "Lê Văn Cường",
    performedBy: "user-001",
    performedAt: "2026-03-12T16:00:00Z",
    duration: 30,
    isAutoLogged: false,
  },
  {
    id: "activity-004",
    type: "note",
    title: "Contract negotiations progressing well",
    description: "Legal team reviewing terms. Expecting signature next week.",
    dealId: "deal-001",
    dealTitle: "Enterprise License Q1 2026",
    performedBy: "user-001",
    performedAt: "2026-03-10T11:20:00Z",
    isAutoLogged: false,
  },
  {
    id: "activity-005",
    type: "email",
    title: "Follow-up email after demo",
    description: "Sent technical documentation and case studies as requested.",
    contactId: "contact-001",
    contactName: "Nguyễn Văn An",
    performedBy: "user-002",
    performedAt: "2026-03-08T09:45:00Z",
    isAutoLogged: true,
  },
  {
    id: "activity-006",
    type: "meeting",
    title: "Product demo session",
    description: "Live demo of core features. 6 stakeholders attended. Very positive feedback.",
    contactId: "contact-001",
    contactName: "Nguyễn Văn An",
    performedBy: "user-001",
    performedAt: "2026-03-05T13:00:00Z",
    duration: 60,
    isAutoLogged: false,
  },
  {
    id: "activity-007",
    type: "call",
    title: "Budget confirmation call",
    description: "Confirmed Q1 budget allocation. Green light to proceed.",
    contactId: "contact-002",
    contactName: "Trần Thị Bình",
    performedBy: "user-002",
    performedAt: "2026-03-01T15:30:00Z",
    duration: 20,
    isAutoLogged: false,
  },
  {
    id: "activity-008",
    type: "note",
    title: "Competitor analysis completed",
    description: "TechCorp currently using Solution X. Pain points identified: slow support, lack of API flexibility.",
    performedBy: "user-001",
    performedAt: "2026-02-28T10:00:00Z",
    isAutoLogged: false,
  },
];

const ACTIVITY_CONFIG = {
  meeting: {
    icon: Calendar,
    color: "text-violet-600",
    bgColor: "bg-violet-100",
    label: "Meeting",
  },
  email: {
    icon: Mail,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    label: "Email",
  },
  call: {
    icon: Phone,
    color: "text-green-600",
    bgColor: "bg-green-100",
    label: "Call",
  },
  note: {
    icon: MessageSquare,
    color: "text-amber-600",
    bgColor: "bg-amber-100",
    label: "Note",
  },
  task: {
    icon: FileText,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    label: "Task",
  },
};

export function CompanyTimelineTab({ companyId, companyName }: CompanyTimelineTabProps) {
  const [filterType, setFilterType] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const filteredActivities = useMemo(() => {
    return MOCK_ACTIVITIES.filter((activity) => filterType === "all" || activity.type === filterType);
  }, [filterType]);

  // Group by date
  const groupedActivities = useMemo(() => {
    const groups: Record<string, TimelineActivity[]> = {};
    filteredActivities.forEach((activity) => {
      const date = new Date(activity.performedAt).toLocaleDateString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
    });
    return groups;
  }, [filteredActivities]);

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-violet-600" />
          <h3 className="text-sm text-gray-900">{filteredActivities.length} hoạt động</h3>
        </div>
        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm hover:bg-gray-50 transition-colors"
        >
          <Filter className="w-4 h-4" />
          Lọc
          <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? "rotate-180" : ""}`} />
        </button>
      </div>

      {showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <p className="text-xs text-gray-600 mb-2">Loại hoạt động</p>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setFilterType("all")}
              className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                filterType === "all"
                  ? "bg-violet-600 text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              Tất cả
            </button>
            {Object.entries(ACTIVITY_CONFIG).map(([type, config]) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilterType(type)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  filterType === type
                    ? `${config.bgColor} ${config.color}`
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <config.icon className="w-3.5 h-3.5" />
                {config.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Timeline */}
      {Object.entries(groupedActivities).length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Chưa có hoạt động nào</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedActivities).map(([date, activities]) => (
            <div key={date}>
              {/* Date Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px bg-gray-200 flex-1" />
                <h4 className="text-xs text-gray-500 px-3 py-1 bg-gray-100 rounded-full">{date}</h4>
                <div className="h-px bg-gray-200 flex-1" />
              </div>

              {/* Activities for this date */}
              <div className="space-y-3 relative before:absolute before:left-[15px] before:top-8 before:bottom-0 before:w-px before:bg-gray-200">
                {activities.map((activity, index) => {
                  const config = ACTIVITY_CONFIG[activity.type as keyof typeof ACTIVITY_CONFIG];
                  const Icon = config.icon;
                  const isLast = index === activities.length - 1;

                  return (
                    <div key={activity.id} className={`relative pl-12 ${isLast ? "" : "pb-3"}`}>
                      {/* Icon */}
                      <div
                        className={`absolute left-0 top-1 w-8 h-8 rounded-full ${config.bgColor} flex items-center justify-center border-2 border-white shadow-sm`}
                      >
                        <Icon className={`w-4 h-4 ${config.color}`} />
                      </div>

                      {/* Content */}
                      <div className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex-1 min-w-0">
                            <h5 className="text-sm text-gray-900 mb-1">{activity.title}</h5>
                            {activity.description && (
                              <p className="text-xs text-gray-600 leading-relaxed">{activity.description}</p>
                            )}
                          </div>
                          <span className="text-xs text-gray-400 flex-shrink-0">{formatTime(activity.performedAt)}</span>
                        </div>

                        {/* Meta info */}
                        <div className="flex items-center gap-3 flex-wrap text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {getEmployeeName(activity.performedBy)}
                          </span>
                          {activity.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {activity.duration} phút
                            </span>
                          )}
                          {activity.contactName && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">
                              <User className="w-3 h-3" />
                              {activity.contactName}
                            </span>
                          )}
                          {activity.dealTitle && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-violet-50 text-violet-600 rounded-full">
                              <TrendingUp className="w-3 h-3" />
                              {activity.dealTitle}
                            </span>
                          )}
                          {activity.isAutoLogged && (
                            <span className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 rounded-full">
                              AI Logged
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
