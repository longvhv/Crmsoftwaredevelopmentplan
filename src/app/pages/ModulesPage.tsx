import {
  Users,
  Target,
  Megaphone,
  FileText,
  Briefcase,
  BarChart3,
  MessageCircle,
  Calendar,
  Package,
  HeartHandshake,
  Workflow,
  Settings,
  Bot,
  ChevronRight,
} from "lucide-react";
import { SectionCard } from "../components/SectionCard";
import { useState } from "react";

interface Module {
  id: string;
  icon: React.ReactNode;
  name: string;
  nameEn: string;
  color: string;
  priority: "Critical" | "High" | "Medium";
  aiFeatures: string[];
  subModules: string[];
  description: string;
  aiAgentSupport: string;
}

const modules: Module[] = [
  {
    id: "contact",
    icon: <Users className="w-5 h-5" />,
    name: "Quản lý Contacts & Accounts",
    nameEn: "Contact & Account Management",
    color: "from-blue-500 to-blue-600",
    priority: "Critical",
    aiFeatures: [
      "AI tự động enrichment thông tin liên hệ từ web/social",
      "AI phát hiện duplicate contacts & suggest merge",
      "AI scoring contact quality & engagement level",
      "AI phân loại ICP (Ideal Customer Profile)",
    ],
    subModules: ["Contacts", "Companies", "Contact Groups", "Import/Export", "Contact Timeline"],
    description: "Quản lý toàn bộ thông tin khách hàng, đối tác. AI tự động cập nhật và làm giàu dữ liệu.",
    aiAgentSupport: "Contact Intelligence Agent",
  },
  {
    id: "sales",
    icon: <Target className="w-5 h-5" />,
    name: "Quản lý Sales Pipeline",
    nameEn: "Sales Pipeline Management",
    color: "from-green-500 to-emerald-600",
    priority: "Critical",
    aiFeatures: [
      "AI lead scoring tự động dựa trên behavior",
      "AI dự đoán xác suất chốt deal (Win Probability)",
      "AI suggest next best action cho từng deal",
      "AI phát hiện deal at risk & alert",
    ],
    subModules: ["Leads", "Opportunities", "Deals", "Quotations", "Pipeline Board", "Win/Loss Analysis"],
    description: "Pipeline bán hàng cho cả outsource (project-based) và product (subscription-based).",
    aiAgentSupport: "Sales Intelligence Agent",
  },
  {
    id: "marketing",
    icon: <Megaphone className="w-5 h-5" />,
    name: "Marketing Automation",
    nameEn: "Marketing Campaign Management",
    color: "from-orange-500 to-amber-600",
    priority: "Critical",
    aiFeatures: [
      "AI tạo content marketing tự động (blog, email, social)",
      "AI A/B testing & optimization campaigns",
      "AI audience segmentation thông minh",
      "AI attribution modeling - đo lường ROI chính xác",
    ],
    subModules: ["Campaigns", "Email Marketing", "Social Media", "Landing Pages", "Lead Nurturing", "Analytics"],
    description: "Quản lý toàn bộ hoạt động marketing. AI tối ưu hóa campaign performance real-time.",
    aiAgentSupport: "Marketing AI Agent",
  },
  {
    id: "project",
    icon: <Briefcase className="w-5 h-5" />,
    name: "Quản lý Project & Delivery",
    nameEn: "Project & Resource Management",
    color: "from-violet-500 to-purple-600",
    priority: "Critical",
    aiFeatures: [
      "AI estimate effort & timeline dự án",
      "AI resource allocation optimization",
      "AI risk detection & mitigation suggestion",
      "AI progress prediction & delay alert",
    ],
    subModules: ["Projects", "Tasks", "Sprints", "Resource Planning", "Time Tracking", "Client Portal"],
    description: "Quản lý delivery cho outsource projects. Tích hợp Agile/Scrum workflow.",
    aiAgentSupport: "Project Intelligence Agent",
  },
  {
    id: "contract",
    icon: <FileText className="w-5 h-5" />,
    name: "Quản lý Hợp đồng & Tài chính",
    nameEn: "Contract & Financial Management",
    color: "from-teal-500 to-cyan-600",
    priority: "High",
    aiFeatures: [
      "AI review hợp đồng & phát hiện rủi ro pháp lý",
      "AI dự báo revenue & cash flow",
      "AI phát hiện thanh toán bất thường",
      "AI tối ưu pricing strategy",
    ],
    subModules: ["Contracts", "Invoices", "Payments", "Revenue Forecast", "Pricing Models"],
    description: "Quản lý vòng đời hợp đồng, theo dõi thanh toán và forecast tài chính.",
    aiAgentSupport: "Finance AI Agent",
  },
  {
    id: "support",
    icon: <HeartHandshake className="w-5 h-5" />,
    name: "Customer Success & Support",
    nameEn: "Customer Support & Success",
    color: "from-pink-500 to-rose-600",
    priority: "High",
    aiFeatures: [
      "AI Chatbot trả lời tự động 24/7",
      "AI phân loại & route ticket thông minh",
      "AI dự đoán churn risk & suggest retention actions",
      "AI phân tích sentiment khách hàng",
    ],
    subModules: ["Tickets", "Knowledge Base", "SLA Management", "Customer Health Score", "Feedback"],
    description: "Chăm sóc khách hàng sau bán. AI agent hỗ trợ L1 tự động.",
    aiAgentSupport: "Support AI Agent",
  },
  {
    id: "communication",
    icon: <MessageCircle className="w-5 h-5" />,
    name: "Communication Hub",
    nameEn: "Unified Communications",
    color: "from-sky-500 to-blue-600",
    priority: "High",
    aiFeatures: [
      "AI tóm tắt cuộc họp & tạo meeting notes",
      "AI suggest email responses",
      "AI phân tích tone & sentiment trong giao tiếp",
      "AI lên lịch hẹn tự động",
    ],
    subModules: ["Email Integration", "Chat", "Video Call", "Calendar Sync", "Activity Log"],
    description: "Hub giao tiếp đa kênh. AI hỗ trợ soạn thảo, tóm tắt và phân tích giao tiếp.",
    aiAgentSupport: "Communication AI Agent",
  },
  {
    id: "hr",
    icon: <Users className="w-5 h-5" />,
    name: "Quản lý nhân sự CRM",
    nameEn: "CRM HR & Team Management",
    color: "from-amber-500 to-yellow-600",
    priority: "High",
    aiFeatures: [
      "AI skill gap analysis cho team",
      "AI đề xuất training path cá nhân hóa",
      "AI phân tích workload & burnout risk",
      "AI matching nhân viên phù hợp cho project",
    ],
    subModules: ["Employee Profiles", "Roles & Permissions", "Skill Matrix", "Training", "Performance"],
    description: "Quản lý nhân viên con người và AI. Hỗ trợ kiêm nhiệm nhiều vai trò.",
    aiAgentSupport: "HR Intelligence Agent",
  },
  {
    id: "analytics",
    icon: <BarChart3 className="w-5 h-5" />,
    name: "Analytics & BI",
    nameEn: "Business Intelligence & Analytics",
    color: "from-indigo-500 to-violet-600",
    priority: "High",
    aiFeatures: [
      "AI tự động tạo dashboard & báo cáo",
      "AI phát hiện trends & anomalies",
      "AI natural language querying (hỏi bằng tiếng Việt)",
      "AI predictive forecasting",
    ],
    subModules: ["Dashboards", "Custom Reports", "Data Explorer", "AI Insights", "Export & Share"],
    description: "BI platform tích hợp AI. Query dữ liệu bằng ngôn ngữ tự nhiên.",
    aiAgentSupport: "Analytics AI Agent",
  },
  {
    id: "workflow",
    icon: <Workflow className="w-5 h-5" />,
    name: "Workflow Automation Engine",
    nameEn: "Workflow & Process Automation",
    color: "from-red-500 to-rose-600",
    priority: "High",
    aiFeatures: [
      "AI suggest workflow optimization",
      "AI tự tạo workflow từ mô tả ngôn ngữ tự nhiên",
      "AI monitor workflow performance",
      "AI detect bottlenecks & suggest fixes",
    ],
    subModules: ["Workflow Builder", "Triggers", "Actions", "Conditions", "Templates", "Logs"],
    description: "Engine tự động hóa quy trình. AI tạo và tối ưu workflow tự động.",
    aiAgentSupport: "Automation AI Agent",
  },
  {
    id: "product",
    icon: <Package className="w-5 h-5" />,
    name: "Product Management",
    nameEn: "Product & Service Catalog",
    color: "from-emerald-500 to-green-600",
    priority: "Medium",
    aiFeatures: [
      "AI phân tích product-market fit",
      "AI suggest feature prioritization",
      "AI competitive analysis tự động",
      "AI pricing optimization",
    ],
    subModules: ["Products", "Services", "Pricing Plans", "Feature Requests", "Roadmap"],
    description: "Quản lý sản phẩm và dịch vụ. AI hỗ trợ product strategy.",
    aiAgentSupport: "Product AI Agent",
  },
  {
    id: "admin",
    icon: <Settings className="w-5 h-5" />,
    name: "System Administration",
    nameEn: "Admin & Configuration",
    color: "from-gray-500 to-slate-600",
    priority: "Medium",
    aiFeatures: [
      "AI system health monitoring",
      "AI security threat detection",
      "AI usage analytics & optimization suggestions",
      "AI automated backup & recovery",
    ],
    subModules: ["User Management", "Roles & Permissions", "Integrations", "API Management", "Audit Logs"],
    description: "Quản trị hệ thống toàn diện. AI giám sát và bảo vệ hệ thống 24/7.",
    aiAgentSupport: "System Admin AI Agent",
  },
];

const priorityColors = {
  Critical: "bg-red-100 text-red-700",
  High: "bg-amber-100 text-amber-700",
  Medium: "bg-blue-100 text-blue-700",
};

export function ModulesPage() {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900">📦 Hệ thống Module CRM</h1>
        <p className="text-gray-500 mt-1">
          12+ modules tích hợp AI, thiết kế cho công ty phần mềm Outsource + Product
        </p>
      </div>

      {/* Module Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((mod) => (
          <div
            key={mod.id}
            onClick={() => setSelectedModule(selectedModule?.id === mod.id ? null : mod)}
            className={`bg-white rounded-xl border p-5 cursor-pointer transition-all hover:shadow-md ${
              selectedModule?.id === mod.id
                ? "border-violet-300 shadow-md ring-1 ring-violet-200"
                : "border-gray-100"
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${mod.color} flex items-center justify-center text-white`}
              >
                {mod.icon}
              </div>
              <span className={`px-2 py-0.5 rounded text-xs ${priorityColors[mod.priority]}`}>
                {mod.priority}
              </span>
            </div>
            <h4 className="text-sm text-gray-900 mb-1">{mod.name}</h4>
            <p className="text-xs text-gray-500 mb-3">{mod.description}</p>
            <div className="flex items-center gap-1.5 text-xs text-violet-600">
              <Bot className="w-3.5 h-3.5" />
              <span>{mod.aiAgentSupport}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
              <span>{mod.subModules.length} sub-modules</span>
              <ChevronRight className="w-3 h-3" />
              <span>{mod.aiFeatures.length} AI features</span>
            </div>
          </div>
        ))}
      </div>

      {/* Module Detail */}
      {selectedModule && (
        <SectionCard
          title={selectedModule.name}
          subtitle={selectedModule.nameEn}
          icon={selectedModule.icon}
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm text-gray-900 mb-3">Sub-modules</h4>
              <div className="space-y-2">
                {selectedModule.subModules.map((sub) => (
                  <div
                    key={sub}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                    {sub}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm text-gray-900 mb-3 flex items-center gap-2">
                <Bot className="w-4 h-4 text-violet-600" />
                AI Features
              </h4>
              <div className="space-y-2">
                {selectedModule.aiFeatures.map((feat) => (
                  <div
                    key={feat}
                    className="flex items-start gap-2 px-3 py-2 bg-violet-50 rounded-lg text-sm text-violet-800"
                  >
                    <Zap className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    {feat}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </SectionCard>
      )}
    </div>
  );
}

function Zap(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
    </svg>
  );
}
