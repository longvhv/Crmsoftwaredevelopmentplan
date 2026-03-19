/**
 * Tab Overview cho Company Detail Page
 * Hiển thị tổng quan thông tin công ty, AI ICP scores, firmographics
 */
import {
  Bot,
  Globe,
  Mail,
  Phone,
  MapPin,
  Users,
  DollarSign,
  TrendingUp,
  Building2,
  Target,
} from "lucide-react";
import type { Company } from "../../../types/crm";
import { getEmployeeName } from "../../../api/crmApi";
import { formatCurrency } from "../../../constants/crmConfig";

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

interface CompanyOverviewTabProps {
  company: Company;
  stats?: {
    totalContacts: number;
    totalDeals: number;
    totalActivities: number;
    totalDocuments: number;
  };
}

const COMPANY_SIZE_LABELS: Record<string, string> = {
  "1-10": "1-10 nhân viên",
  "11-50": "11-50 nhân viên",
  "51-200": "51-200 nhân viên",
  "201-500": "201-500 nhân viên",
  "501-1000": "501-1000 nhân viên",
  "1000+": "1000+ nhân viên",
};

export function CompanyOverviewTab({ company, stats }: CompanyOverviewTabProps) {
  return (
    <div className="space-y-5">
      {/* Quick Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-blue-50 rounded-xl border border-blue-100 p-4 text-center">
            <p className="text-2xl text-blue-700">{stats.totalContacts}</p>
            <p className="text-xs text-blue-600">Contacts</p>
          </div>
          <div className="bg-violet-50 rounded-xl border border-violet-100 p-4 text-center">
            <p className="text-2xl text-violet-700">{stats.totalDeals}</p>
            <p className="text-xs text-violet-600">Deals</p>
          </div>
          <div className="bg-amber-50 rounded-xl border border-amber-100 p-4 text-center">
            <p className="text-2xl text-amber-700">{stats.totalActivities}</p>
            <p className="text-xs text-amber-600">Hoạt động</p>
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
          <ScoreBar score={company.icpScore} label="ICP Score (Ideal Customer Profile)" icon={<Target className="w-4 h-4" />} />
          <ScoreBar score={company.engagementScore} label="Engagement Score" icon={<TrendingUp className="w-4 h-4" />} />
        </div>
        {/* AI Insights */}
        <div className="mt-4 pt-4 border-t border-violet-100">
          <p className="text-xs text-violet-700">
            <Bot className="w-3.5 h-3.5 inline mr-1" />
            {company.icpScore >= 80
              ? "Công ty này phù hợp rất cao với ICP, nên ưu tiên tài nguyên."
              : company.icpScore >= 60
              ? "Công ty có tiềm năng tốt, tiếp tục nurture."
              : "Công ty cần đánh giá thêm về mức độ phù hợp."}
          </p>
        </div>
      </div>

      {/* Firmographics */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h4 className="text-sm text-gray-900 mb-4">Firmographics</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Building2 className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">Ngành</p>
              <p className="text-sm text-gray-700">{company.industry}</p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Users className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400">Quy mô</p>
              <p className="text-sm text-gray-700">{COMPANY_SIZE_LABELS[company.size]}</p>
            </div>
          </div>
          {company.employeeCount && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Users className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400">Số nhân viên</p>
                <p className="text-sm text-gray-700">{company.employeeCount.toLocaleString()}</p>
              </div>
            </div>
          )}
          {company.annualRevenue && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-400">Doanh thu/năm</p>
                <p className="text-sm text-gray-700">{formatCurrency(company.annualRevenue)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Thông tin liên hệ */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h4 className="text-sm text-gray-900 mb-4">Thông tin liên hệ</h4>
        <div className="space-y-3">
          {company.website && (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-700 hover:bg-blue-100 transition-colors"
            >
              <Globe className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{company.website}</span>
            </a>
          )}
          {company.email && (
            <a
              href={`mailto:${company.email}`}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Mail className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <span className="truncate">{company.email}</span>
            </a>
          )}
          {company.phone && (
            <a
              href={`tel:${company.phone}`}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Phone className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <span className="truncate">{company.phone}</span>
            </a>
          )}
          {company.address && (
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-700">{company.address}</p>
                {(company.city || company.country) && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {[company.city, company.country].filter(Boolean).join(", ")}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Chi tiết bổ sung */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h4 className="text-sm text-gray-900 mb-4">Chi tiết</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">Người phụ trách</p>
            <p className="text-sm text-gray-900">{getEmployeeName(company.assignedTo)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Liên hệ gần nhất</p>
            <p className="text-sm text-gray-900">{company.lastContactDate}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 mb-1">Ngày tạo</p>
            <p className="text-sm text-gray-900">{company.createdDate}</p>
          </div>
        </div>

        {/* Tags */}
        {company.tags.length > 0 && (
          <div className="pt-4 mt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-2">Tags</p>
            <div className="flex flex-wrap gap-2">
              {company.tags.map((tag) => (
                <span key={tag} className="text-xs px-3 py-1 rounded-full bg-violet-100 text-violet-700">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Ghi chú */}
      {company.notes && (
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
          <h4 className="text-sm text-amber-900 mb-2">Ghi chú</h4>
          <p className="text-sm text-amber-800 leading-relaxed">{company.notes}</p>
        </div>
      )}
    </div>
  );
}
