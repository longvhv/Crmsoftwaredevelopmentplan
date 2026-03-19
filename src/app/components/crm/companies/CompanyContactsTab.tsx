/**
 * Tab Contacts cho Company Detail Page
 * Hiển thị danh sách contacts thuộc công ty này
 */
import { useState } from "react";
import {
  Users,
  Mail,
  Phone,
  Plus,
  Search,
  Star,
  MessageSquare,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { toast } from "sonner";
import type { Contact } from "../../../types/crm";
import { getEmployeeName } from "../../../api/crmApi";
import { CONTACT_STATUS_CONFIG, CONTACT_TYPE_CONFIG } from "../../../constants/crmConfig";

interface CompanyContactsTabProps {
  companyId: string;
  companyName: string;
}

// Mock contacts data
const MOCK_CONTACTS: Contact[] = [
  {
    id: "contact-001",
    name: "Nguyễn Văn An",
    email: "an.nguyen@techcorp.vn",
    phone: "+84 90 123 4567",
    company: "TechCorp Vietnam",
    position: "CTO",
    type: "decision-maker",
    status: "active",
    source: "referral",
    assignedTo: "user-001",
    aiLeadScore: 92,
    engagementScore: 88,
    lastContactDate: "2026-03-15",
    createdDate: "2024-06-10",
    tags: ["Technical", "Decision Maker"],
    notes: "Key technical decision maker",
  },
  {
    id: "contact-002",
    name: "Trần Thị Bình",
    email: "binh.tran@techcorp.vn",
    phone: "+84 91 234 5678",
    company: "TechCorp Vietnam",
    position: "Head of Procurement",
    type: "decision-maker",
    status: "active",
    source: "website",
    assignedTo: "user-002",
    aiLeadScore: 85,
    engagementScore: 78,
    lastContactDate: "2026-03-12",
    createdDate: "2024-08-15",
    tags: ["Procurement", "Budget Owner"],
  },
  {
    id: "contact-003",
    name: "Lê Văn Cường",
    email: "cuong.le@techcorp.vn",
    phone: "+84 92 345 6789",
    company: "TechCorp Vietnam",
    position: "Product Manager",
    type: "champion",
    status: "active",
    source: "linkedin",
    assignedTo: "user-001",
    aiLeadScore: 78,
    engagementScore: 82,
    lastContactDate: "2026-03-10",
    createdDate: "2024-09-20",
    tags: ["Product", "Champion"],
  },
  {
    id: "contact-004",
    name: "Phạm Thị Diễm",
    email: "diem.pham@techcorp.vn",
    phone: "+84 93 456 7890",
    company: "TechCorp Vietnam",
    position: "Software Engineer",
    type: "end-user",
    status: "active",
    source: "event",
    assignedTo: "user-002",
    aiLeadScore: 65,
    engagementScore: 70,
    lastContactDate: "2026-03-08",
    createdDate: "2024-11-05",
    tags: ["Technical", "End User"],
  },
];

export function CompanyContactsTab({ companyId, companyName }: CompanyContactsTabProps) {
  const [contacts] = useState<Contact[]>(MOCK_CONTACTS);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeConfig = (type: string) =>
    CONTACT_TYPE_CONFIG[type as keyof typeof CONTACT_TYPE_CONFIG] || {
      label: type,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    };

  const getStatusConfig = (status: string) =>
    CONTACT_STATUS_CONFIG[status as keyof typeof CONTACT_STATUS_CONFIG] || {
      label: status,
      color: "text-gray-600",
      bgColor: "bg-gray-100",
    };

  return (
    <div className="space-y-4">
      {/* Header Actions */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-violet-600" />
          <h3 className="text-sm text-gray-900">
            {filteredContacts.length} Contact{filteredContacts.length !== 1 ? "s" : ""}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm contacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <button
            type="button"
            onClick={() => toast.info("Thêm contact mới (Coming soon)")}
            className="flex items-center gap-1.5 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Thêm contact</span>
          </button>
        </div>
      </div>

      {/* Contacts List */}
      {filteredContacts.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">
            {searchQuery ? "Không tìm thấy contact nào" : "Chưa có contact nào"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredContacts.map((contact) => {
            const typeConfig = getTypeConfig(contact.type);
            const statusConfig = getStatusConfig(contact.status);

            return (
              <div
                key={contact.id}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all group"
              >
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-lg">
                      {contact.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm text-gray-900 truncate">{contact.name}</h4>
                          {contact.type === "decision-maker" && (
                            <Star className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-gray-500">{contact.position}</p>
                      </div>

                      {/* Status & Type Badges */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className={`text-[10px] px-2 py-1 rounded-full ${statusConfig.bgColor} ${statusConfig.color}`}
                        >
                          {statusConfig.label}
                        </span>
                        <span
                          className={`text-[10px] px-2 py-1 rounded-full ${typeConfig.bgColor} ${typeConfig.color}`}
                        >
                          {typeConfig.label}
                        </span>
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                      <a
                        href={`mailto:${contact.email}`}
                        className="flex items-center gap-2 text-xs text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{contact.email}</span>
                      </a>
                      <a
                        href={`tel:${contact.phone}`}
                        className="flex items-center gap-2 text-xs text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{contact.phone}</span>
                      </a>
                    </div>

                    {/* Scores & Metrics */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                      <div className="bg-blue-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-blue-600 mb-0.5">Lead Score</p>
                        <p className="text-sm text-blue-700">{contact.aiLeadScore}</p>
                      </div>
                      <div className="bg-violet-50 rounded-lg p-2 text-center">
                        <p className="text-xs text-violet-600 mb-0.5">Engagement</p>
                        <p className="text-sm text-violet-700">{contact.engagementScore}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-500 mb-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Liên hệ
                        </p>
                        <p className="text-xs text-gray-700">{contact.lastContactDate}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-2">
                        <p className="text-xs text-gray-500 mb-0.5">Phụ trách</p>
                        <p className="text-xs text-gray-700 truncate">
                          {getEmployeeName(contact.assignedTo)}
                        </p>
                      </div>
                    </div>

                    {/* Tags */}
                    {contact.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {contact.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Quick Actions */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        type="button"
                        onClick={() => toast.info(`Email to ${contact.name}`)}
                        className="text-xs px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-1"
                      >
                        <Mail className="w-3 h-3" />
                        Email
                      </button>
                      <button
                        type="button"
                        onClick={() => toast.info(`Call ${contact.name}`)}
                        className="text-xs px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        Call
                      </button>
                      <button
                        type="button"
                        onClick={() => toast.info(`Note for ${contact.name}`)}
                        className="text-xs px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors flex items-center gap-1"
                      >
                        <MessageSquare className="w-3 h-3" />
                        Note
                      </button>
                      <button
                        type="button"
                        onClick={() => (window.location.href = `/crm/contacts/${contact.id}`)}
                        className="text-xs px-3 py-1.5 bg-violet-50 text-violet-600 rounded-lg hover:bg-violet-100 transition-colors flex items-center gap-1"
                      >
                        <TrendingUp className="w-3 h-3" />
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
