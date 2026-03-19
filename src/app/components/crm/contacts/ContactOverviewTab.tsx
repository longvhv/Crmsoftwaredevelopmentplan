/**
 * Tab Overview cho Contact Detail Page
 * Hiển thị tổng quan thông tin contact, AI scores, thống kê
 */
import { Bot, Building2, Calendar, Mail, Phone, User, Target, TrendingUp, MessageSquare } from "lucide-react";
import type { Contact } from "../../../types/crm";
import { CONTACT_TYPE_CONFIG, CONTACT_STATUS_CONFIG } from "../../../constants/crmConfig";
import { getEmployeeName } from "../../../api/crmApi";

interface ScoreBarProps {
  score: number;
  label: string;
  icon?: React.ReactNode;
}

function ScoreBar({ score, label, icon }: ScoreBarProps) {
  const color =
    score >= 80 ? "bg-green-500" : score >= 60 ? "bg-blue-500" : score >= 40 ? "bg-amber-500" : "bg-red-500";
  const textColor =
    score >= 80 ? "text-green-700" : score >= 60 ? "text-blue-700" : score >= 40 ? "text-amber-700" : "text-red-700";

  return (
    <div className="flex items-center gap-3">
      {icon && <div className="flex-shrink-0 text-gray-400">{icon}</div>}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">{label}</span>
          <span className={`text-sm ${textColor}`}>{score}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className={`h-full ${color} rounded-full transition-all`} style={{ width: `${score}%` }} />
        </div>
      </div>
    </div>
  );
}

interface ContactOverviewTabProps {
  contact: Contact;
  stats?: {
    totalDeals: number;
    totalActivities: number;
    totalNotes: number;
    totalDocuments: number;
  };
}

export function ContactOverviewTab({ contact, stats }: ContactOverviewTabProps) {
  const typeConfig = CONTACT_TYPE_CONFIG[contact.type];
  const statusConfig = CONTACT_STATUS_CONFIG[contact.status];

  return (
    <div className="space-y-5">
      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-violet-50 rounded-xl border border-violet-100 p-4 text-center">
            <p className="text-2xl text-violet-700">{stats.totalDeals}</p>
            <p className="text-xs text-violet-600">Deals</p>
          </div>
          <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 text-center">
            <p className="text-2xl text-blue-700">{stats.totalActivities}</p>
            <p className="text-xs text-blue-600">Hoạt động</p>
          </div>
          <div className="bg-amber-50 rounded-xl border border-amber-100 p-4 text-center">
            <p className="text-2xl text-amber-700">{stats.totalNotes}</p>
            <p className="text-xs text-amber-600">Ghi chú</p>
          </div>
          <div className="bg-green-50 rounded-xl border border-green-100 p-4 text-center">
            <p className="text-2xl text-green-700">{stats.totalDocuments}</p>
            <p className="text-xs text-green-600">Tài liệu</p>
          </div>
        </div>
      )}

      {/* AI Scores */}
      <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bot className="w-5 h-5 text-violet-600" />
          <h4 className="text-sm text-violet-900">Đánh giá AI</h4>
        </div>
        <div className="space-y-4">
          <ScoreBar score={contact.aiLeadScore} label="Lead Score" icon={<Target className="w-4 h-4" />} />
          <ScoreBar score={contact.engagementScore} label="Engagement Score" icon={<TrendingUp className="w-4 h-4" />} />
        </div>
        {/* AI Insights */}
        <div className="mt-4 pt-4 border-t border-violet-100">
          <p className="text-xs text-violet-700">
            <Bot className="w-3.5 h-3.5 inline mr-1" />
            {contact.aiLeadScore >= 80
              ? "Contact có tiềm năng cao, nên ưu tiên liên hệ ngay."
              : contact.aiLeadScore >= 60
              ? "Contact có tiềm năng tốt, tiếp tục nurture."
              : "Contact cần thêm thông tin và tương tác."}
          </p>
        </div>
      </div>

      {/* Thông tin liên lạc */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h4 className="text-sm text-gray-900 mb-4">Thông tin liên lạc</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-700 hover:bg-blue-100 transition-colors"
          >
            <Mail className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">{contact.email}</span>
          </a>
          <a
            href={`tel:${contact.phone}`}
            className="flex items-center gap-3 p-3 bg-green-50 rounded-lg text-sm text-green-700 hover:bg-green-100 transition-colors"
          >
            <Phone className="w-5 h-5 flex-shrink-0" />
            <span className="truncate">{contact.phone}</span>
          </a>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Building2 className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">Công ty</p>
              <p className="text-sm text-gray-700 truncate">{contact.company}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">Vị trí</p>
              <p className="text-sm text-gray-700 truncate">{contact.position}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chi tiết bổ sung */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h4 className="text-sm text-gray-900 mb-4">Chi tiết</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Nguồn</p>
            <p className="text-sm text-gray-900">{contact.source}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Người phụ trách</p>
            <p className="text-sm text-gray-900">{getEmployeeName(contact.assignedTo)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Liên hệ gần nhất</p>
            <p className="text-sm text-gray-900">{contact.lastContactDate}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Ngày tạo</p>
            <p className="text-sm text-gray-900">{contact.createdDate}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Loại</p>
            <span className={`text-xs px-2 py-1 rounded ${typeConfig.color}`}>{typeConfig.label}</span>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Trạng thái</p>
            <span className={`text-xs px-2 py-1 rounded ${statusConfig.color}`}>{statusConfig.label}</span>
          </div>
        </div>

        {/* Tags */}
        {contact.tags.length > 0 && (
          <div className="pt-4 mt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {contact.tags.map((tag) => (
                <span key={tag} className="text-xs px-3 py-1 rounded-full bg-violet-100 text-violet-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Ghi chú nhanh */}
      {contact.notes && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-4 h-4 text-amber-600" />
            <h4 className="text-sm text-amber-900">Ghi chú nhanh</h4>
          </div>
          <p className="text-sm text-amber-800 leading-relaxed">{contact.notes}</p>
        </div>
      )}
    </div>
  );
}
