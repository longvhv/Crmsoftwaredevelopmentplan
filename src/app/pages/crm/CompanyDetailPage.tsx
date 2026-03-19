/**
 * Trang chi tiết Công ty — PHASE 3: Full Implementation
 * Step 3.2.1 (146): Company Detail Page - Full Implementation
 * Hiển thị đầy đủ thông tin với 6 tabs: Overview, Contacts, Deals, Timeline, Notes, Documents
 */
import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  Edit3,
  Building2,
  Users,
  Target,
  Clock,
  MessageSquare,
  FileText,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import type { Company } from "../../types/crm";
import { CompanyOverviewTab } from "../../components/crm/companies/CompanyOverviewTab";
import { CompanyContactsTab } from "../../components/crm/companies/CompanyContactsTab";
import { CompanyDealsTab } from "../../components/crm/companies/CompanyDealsTab";
import { CompanyTimelineTab } from "../../components/crm/companies/CompanyTimelineTab";
import { ContactNotesTab } from "../../components/crm/contacts/ContactNotesTab";
import { ContactDocumentsTab } from "../../components/crm/contacts/ContactDocumentsTab";

// Mock data for now
const MOCK_COMPANY: Company = {
  id: "company-001",
  name: "TechCorp Vietnam",
  domain: "techcorp.vn",
  industry: "Software Development",
  size: "51-200",
  type: "customer",
  status: "active",
  website: "https://techcorp.vn",
  phone: "+84 28 1234 5678",
  email: "contact@techcorp.vn",
  address: "Tầng 15, Tòa nhà Saigon Trade Center",
  city: "Hồ Chí Minh",
  country: "Vietnam",
  assignedTo: "user-001",
  icpScore: 85,
  engagementScore: 78,
  employeeCount: 120,
  annualRevenue: 5000000,
  createdDate: "2024-01-15",
  lastContactDate: "2026-03-10",
  tags: ["Enterprise", "Technology", "High Value"],
  notes: "Khách hàng tiềm năng cao, đang trong giai đoạn mở rộng kinh doanh.",
};

type DetailTab = "overview" | "contacts" | "deals" | "timeline" | "notes" | "documents";

export function CompanyDetailPage() {
  const { companyId } = useParams<{ companyId: string }>();
  const navigate = useNavigate();

  const [company, setCompany] = useState<Company | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>("overview");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading company data
    setTimeout(() => {
      setCompany(MOCK_COMPANY);
      setLoading(false);
    }, 500);
  }, [companyId]);

  if (loading || !company) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-400 text-sm">Đang tải thông tin công ty...</p>
      </div>
    );
  }

  const TABS: { key: DetailTab; label: string; count?: number; icon: React.ReactNode }[] = [
    { key: "overview", label: "Tổng quan", icon: <Building2 className="w-4 h-4" /> },
    { key: "contacts", label: "Contacts", count: 12, icon: <Users className="w-4 h-4" /> },
    { key: "deals", label: "Deals", count: 5, icon: <Target className="w-4 h-4" /> },
    { key: "timeline", label: "Timeline", icon: <Clock className="w-4 h-4" /> },
    { key: "notes", label: "Ghi chú", icon: <MessageSquare className="w-4 h-4" /> },
    { key: "documents", label: "Tài liệu", icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => navigate("/crm/companies")}
          className="mt-1 p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          aria-label="Quay lại Companies"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="w-6 h-6 text-violet-600" />
            <h1 className="text-gray-900 truncate">{company.name}</h1>
          </div>
          <div className="flex items-center gap-2 flex-wrap text-sm text-gray-500">
            <span>{company.industry}</span>
            <span>•</span>
            <span>{company.city}, {company.country}</span>
            {company.website && (
              <>
                <span>•</span>
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center gap-1"
                >
                  {company.domain || company.website}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => toast.info("Chỉnh sửa công ty (Coming soon)")}
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
            className={`flex items-center gap-2 px-4 py-2.5 text-sm whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.key
                ? "border-violet-500 text-violet-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.icon}
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
          <CompanyOverviewTab
            company={company}
            stats={{
              totalContacts: 12,
              totalDeals: 5,
              totalActivities: 28,
              totalDocuments: 8,
            }}
          />
        )}
        {activeTab === "contacts" && (
          <CompanyContactsTab companyId={companyId || ""} companyName={company.name} />
        )}
        {activeTab === "deals" && (
          <CompanyDealsTab companyId={companyId || ""} companyName={company.name} />
        )}
        {activeTab === "timeline" && (
          <CompanyTimelineTab companyId={companyId || ""} companyName={company.name} />
        )}
        {activeTab === "notes" && <ContactNotesTab contactId={companyId || ""} />}
        {activeTab === "documents" && <ContactDocumentsTab contactId={companyId || ""} />}
      </div>
    </div>
  );
}