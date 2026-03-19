/**
 * Trang danh sách Companies
 * Phase 3: Companies Management
 */
import { useState } from "react";
import { useNavigate } from "react-router";
import { Building2, Plus, Search } from "lucide-react";
import type { Company } from "../../types/crm";

// Mock companies data
const MOCK_COMPANIES: Company[] = [
  {
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
  },
  {
    id: "company-002",
    name: "Innovation Labs",
    domain: "innovationlabs.com",
    industry: "Technology",
    size: "11-50",
    type: "prospect",
    status: "active",
    website: "https://innovationlabs.com",
    city: "Hà Nội",
    country: "Vietnam",
    assignedTo: "user-002",
    icpScore: 72,
    engagementScore: 65,
    employeeCount: 35,
    annualRevenue: 1200000,
    createdDate: "2024-03-20",
    lastContactDate: "2026-03-12",
    tags: ["Startup", "Technology"],
  },
  {
    id: "company-003",
    name: "Global Solutions Inc",
    domain: "globalsolutions.com",
    industry: "Consulting",
    size: "201-500",
    type: "customer",
    status: "active",
    website: "https://globalsolutions.com",
    city: "Singapore",
    country: "Singapore",
    assignedTo: "user-001",
    icpScore: 90,
    engagementScore: 88,
    employeeCount: 320,
    annualRevenue: 15000000,
    createdDate: "2023-09-10",
    lastContactDate: "2026-03-15",
    tags: ["Enterprise", "Global", "Strategic"],
  },
];

export function CompaniesPage() {
  const navigate = useNavigate();
  const [companies] = useState<Company[]>(MOCK_COMPANIES);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCompanies = companies.filter(
    (company) =>
      company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company.city?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case "customer":
        return "text-green-600 bg-green-50";
      case "prospect":
        return "text-blue-600 bg-blue-50";
      case "partner":
        return "text-violet-600 bg-violet-50";
      case "vendor":
        return "text-amber-600 bg-amber-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "customer":
        return "Customer";
      case "prospect":
        return "Prospect";
      case "partner":
        return "Partner";
      case "vendor":
        return "Vendor";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-gray-900 mb-1">Companies</h1>
          <p className="text-sm text-gray-500">{filteredCompanies.length} công ty</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Thêm công ty
        </button>
      </header>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm công ty..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCompanies.map((company) => (
          <div
            key={company.id}
            onClick={() => navigate(`/crm/companies/${company.id}`)}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-all cursor-pointer group"
          >
            {/* Company Header */}
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white flex-shrink-0">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm text-gray-900 mb-1 group-hover:text-violet-600 transition-colors">
                  {company.name}
                </h3>
                <p className="text-xs text-gray-500">{company.industry}</p>
              </div>
            </div>

            {/* Company Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">ICP Score</span>
                <span className="text-violet-700">{company.icpScore}/100</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Engagement</span>
                <span className="text-blue-700">{company.engagementScore}/100</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Location</span>
                <span className="text-gray-700">
                  {company.city}, {company.country}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <span className={`text-xs px-2 py-1 rounded-full ${getTypeColor(company.type)}`}>
                {getTypeLabel(company.type)}
              </span>
              <span className="text-xs text-gray-500">{company.lastContactDate}</span>
            </div>
          </div>
        ))}
      </div>

      {filteredCompanies.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Không tìm thấy công ty nào</p>
        </div>
      )}
    </div>
  );
}
