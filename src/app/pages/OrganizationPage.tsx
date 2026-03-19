import {
  Users,
  Bot,
  Crown,
  Star,
  Briefcase,
  Code,
  TestTube,
  FileSearch,
  Settings,
  Megaphone,
  Target,
  Headphones,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { SectionCard } from "../components/SectionCard";

interface Department {
  name: string;
  nameEn: string;
  icon: React.ReactNode;
  color: string;
  headcount: { human: number; ai: number };
  roles: {
    name: string;
    type: "human" | "ai" | "both";
    isPrimary: boolean;
    responsibilities: string[];
  }[];
}

const departments: Department[] = [
  {
    name: "Kinh doanh (Sales)",
    nameEn: "Sales Department",
    icon: <Target className="w-5 h-5" />,
    color: "from-green-500 to-emerald-600",
    headcount: { human: 12, ai: 4 },
    roles: [
      {
        name: "Sales Director",
        type: "human",
        isPrimary: true,
        responsibilities: ["Chiến lược bán hàng", "Revenue target", "Team management", "Key account ownership"],
      },
      {
        name: "Senior Sales Executive",
        type: "human",
        isPrimary: true,
        responsibilities: ["Enterprise deals", "Solution selling", "Contract negotiation", "Client relationship"],
      },
      {
        name: "Sales Representative",
        type: "both",
        isPrimary: true,
        responsibilities: ["Outreach", "Demo & presentations", "Pipeline management", "Closing deals"],
      },
      {
        name: "AI BDR Agent",
        type: "ai",
        isPrimary: true,
        responsibilities: ["Lead qualification 24/7", "Email outreach automation", "Meeting scheduling", "Data enrichment"],
      },
      {
        name: "AI Deal Analyst",
        type: "ai",
        isPrimary: true,
        responsibilities: ["Deal scoring", "Win probability prediction", "Competitive analysis", "Pricing optimization"],
      },
      {
        name: "Pre-sales Consultant",
        type: "human",
        isPrimary: false,
        responsibilities: ["Technical demos", "Solution architecture", "RFP responses", "POC support"],
      },
    ],
  },
  {
    name: "Marketing",
    nameEn: "Marketing Department",
    icon: <Megaphone className="w-5 h-5" />,
    color: "from-orange-500 to-amber-600",
    headcount: { human: 8, ai: 5 },
    roles: [
      {
        name: "Marketing Director",
        type: "human",
        isPrimary: true,
        responsibilities: ["Marketing strategy", "Brand management", "Budget allocation", "Campaign oversight"],
      },
      {
        name: "Content Manager",
        type: "human",
        isPrimary: true,
        responsibilities: ["Content strategy", "Editorial calendar", "Quality control", "Brand voice"],
      },
      {
        name: "AI Content Creator",
        type: "ai",
        isPrimary: true,
        responsibilities: ["Blog writing", "Social media posts", "Email copy", "SEO optimization"],
      },
      {
        name: "AI Campaign Optimizer",
        type: "ai",
        isPrimary: true,
        responsibilities: ["A/B testing", "Budget optimization", "Audience targeting", "Performance analysis"],
      },
      {
        name: "Growth Hacker",
        type: "human",
        isPrimary: true,
        responsibilities: ["Growth experiments", "Conversion optimization", "Funnel analysis", "Viral loops"],
      },
      {
        name: "AI Social Listener",
        type: "ai",
        isPrimary: true,
        responsibilities: ["Social monitoring", "Trend detection", "Sentiment analysis", "Competitor tracking"],
      },
    ],
  },
  {
    name: "Project Management",
    nameEn: "PM Department",
    icon: <Briefcase className="w-5 h-5" />,
    color: "from-violet-500 to-purple-600",
    headcount: { human: 6, ai: 2 },
    roles: [
      {
        name: "Program Manager",
        type: "human",
        isPrimary: true,
        responsibilities: ["Portfolio management", "Resource allocation", "Stakeholder management", "Risk management"],
      },
      {
        name: "Project Manager",
        type: "human",
        isPrimary: true,
        responsibilities: ["Sprint planning", "Team coordination", "Client communication", "Delivery management"],
      },
      {
        name: "Scrum Master",
        type: "human",
        isPrimary: false,
        responsibilities: ["Agile ceremonies", "Team coaching", "Process improvement", "Impediment removal"],
      },
      {
        name: "AI PM Assistant",
        type: "ai",
        isPrimary: true,
        responsibilities: ["Effort estimation", "Risk prediction", "Status reporting", "Resource optimization"],
      },
    ],
  },
  {
    name: "Business Analysis",
    nameEn: "BA Department",
    icon: <FileSearch className="w-5 h-5" />,
    color: "from-teal-500 to-cyan-600",
    headcount: { human: 5, ai: 2 },
    roles: [
      {
        name: "Senior BA",
        type: "human",
        isPrimary: true,
        responsibilities: ["Requirement analysis", "Process modeling", "Stakeholder management", "Solution design"],
      },
      {
        name: "BA",
        type: "human",
        isPrimary: true,
        responsibilities: ["User stories", "Acceptance criteria", "Documentation", "UAT support"],
      },
      {
        name: "AI Requirement Analyzer",
        type: "ai",
        isPrimary: true,
        responsibilities: ["Auto-generate user stories", "Impact analysis", "Process optimization suggestions", "Documentation generation"],
      },
    ],
  },
  {
    name: "Development",
    nameEn: "Dev Department",
    icon: <Code className="w-5 h-5" />,
    color: "from-blue-500 to-indigo-600",
    headcount: { human: 20, ai: 3 },
    roles: [
      {
        name: "Tech Lead",
        type: "human",
        isPrimary: true,
        responsibilities: ["Architecture design", "Tech stack decisions", "Code review", "Team mentoring"],
      },
      {
        name: "Senior Developer",
        type: "human",
        isPrimary: true,
        responsibilities: ["Complex feature development", "Performance optimization", "Security implementation", "API design"],
      },
      {
        name: "Developer",
        type: "human",
        isPrimary: true,
        responsibilities: ["Feature implementation", "Bug fixes", "Unit testing", "Documentation"],
      },
      {
        name: "AI Code Assistant",
        type: "ai",
        isPrimary: true,
        responsibilities: ["Code generation", "Code review", "Bug detection", "Refactoring suggestions"],
      },
      {
        name: "AI Test Generator",
        type: "ai",
        isPrimary: true,
        responsibilities: ["Auto-generate test cases", "Test data creation", "Coverage analysis", "Regression testing"],
      },
    ],
  },
  {
    name: "QA/Testing",
    nameEn: "QA Department",
    icon: <TestTube className="w-5 h-5" />,
    color: "from-red-500 to-rose-600",
    headcount: { human: 6, ai: 2 },
    roles: [
      {
        name: "QA Lead",
        type: "human",
        isPrimary: true,
        responsibilities: ["Test strategy", "Quality standards", "Team management", "Release readiness"],
      },
      {
        name: "QA Engineer",
        type: "human",
        isPrimary: true,
        responsibilities: ["Manual testing", "Test case design", "Bug reporting", "Regression testing"],
      },
      {
        name: "Automation Tester",
        type: "human",
        isPrimary: true,
        responsibilities: ["Test automation", "CI/CD testing", "Performance testing", "API testing"],
      },
      {
        name: "AI QA Agent",
        type: "ai",
        isPrimary: true,
        responsibilities: ["Visual regression testing", "Exploratory testing AI", "Defect prediction", "Test optimization"],
      },
    ],
  },
  {
    name: "DevOps & Infra",
    nameEn: "DevOps Department",
    icon: <Settings className="w-5 h-5" />,
    color: "from-slate-500 to-gray-600",
    headcount: { human: 4, ai: 2 },
    roles: [
      {
        name: "DevOps Lead",
        type: "human",
        isPrimary: true,
        responsibilities: ["Infrastructure architecture", "CI/CD pipeline", "Cloud management", "Security & compliance"],
      },
      {
        name: "SRE Engineer",
        type: "human",
        isPrimary: true,
        responsibilities: ["System reliability", "Monitoring", "Incident response", "Capacity planning"],
      },
      {
        name: "AI Ops Agent",
        type: "ai",
        isPrimary: true,
        responsibilities: ["Auto-scaling", "Anomaly detection", "Incident auto-response", "Performance optimization"],
      },
      {
        name: "AI Security Agent",
        type: "ai",
        isPrimary: true,
        responsibilities: ["Threat detection", "Vulnerability scanning", "Compliance monitoring", "Access management"],
      },
    ],
  },
  {
    name: "Customer Support",
    nameEn: "Support Department",
    icon: <Headphones className="w-5 h-5" />,
    color: "from-pink-500 to-rose-600",
    headcount: { human: 4, ai: 3 },
    roles: [
      {
        name: "Support Manager",
        type: "human",
        isPrimary: true,
        responsibilities: ["Team management", "SLA management", "Escalation handling", "Customer satisfaction"],
      },
      {
        name: "Support Engineer",
        type: "human",
        isPrimary: true,
        responsibilities: ["Technical support L2/L3", "Troubleshooting", "Knowledge base", "Customer training"],
      },
      {
        name: "AI Support Agent (L1)",
        type: "ai",
        isPrimary: true,
        responsibilities: ["24/7 customer chat", "Ticket classification", "FAQ responses", "Escalation routing"],
      },
      {
        name: "AI Customer Success Agent",
        type: "ai",
        isPrimary: true,
        responsibilities: ["Churn prediction", "Health score monitoring", "Proactive outreach", "Usage analytics"],
      },
    ],
  },
];

const totalHuman = departments.reduce((sum, d) => sum + d.headcount.human, 0);
const totalAI = departments.reduce((sum, d) => sum + d.headcount.ai, 0);

export function OrganizationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900">👥 Tổ chức Nhân sự</h1>
        <p className="text-gray-500 mt-1">
          Cấu trúc tổ chức kết hợp nhân viên con người và AI - Mỗi người kiêm nhiều vai trò
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <Users className="w-5 h-5 text-blue-600 mb-2" />
          <p className="text-2xl text-blue-700">{totalHuman}</p>
          <p className="text-xs text-blue-600">Nhân viên con người</p>
        </div>
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-100">
          <Bot className="w-5 h-5 text-violet-600 mb-2" />
          <p className="text-2xl text-violet-700">{totalAI}</p>
          <p className="text-xs text-violet-600">Nhân viên AI</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
          <Briefcase className="w-5 h-5 text-green-600 mb-2" />
          <p className="text-2xl text-green-700">{departments.length}</p>
          <p className="text-xs text-green-600">Bộ phận</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-4 border border-amber-100">
          <Star className="w-5 h-5 text-amber-600 mb-2" />
          <p className="text-2xl text-amber-700">{totalHuman + totalAI}</p>
          <p className="text-xs text-amber-600">Tổng nhân sự</p>
        </div>
      </div>

      {/* Role Model Explanation */}
      <SectionCard
        title="Mô hình vai trò linh hoạt"
        subtitle="Flexible Role Model - Một nhân viên kiêm nhiều vai trò"
        icon={<Crown className="w-5 h-5" />}
      >
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="text-sm text-blue-800 mb-2">🎯 Vai trò chính (Primary)</h4>
            <ul className="space-y-1 text-xs text-blue-700">
              <li>• Mỗi nhân viên có 1 vai trò chính</li>
              <li>• Chiếm 70% trọng số đánh giá</li>
              <li>• Xác định KPI framework chính</li>
              <li>• Quyết định team & reporting line</li>
            </ul>
          </div>
          <div className="p-4 bg-violet-50 rounded-xl border border-violet-100">
            <h4 className="text-sm text-violet-800 mb-2">⭐ Vai trò kiêm nhiệm (Secondary)</h4>
            <ul className="space-y-1 text-xs text-violet-700">
              <li>• Có thể kiêm nhiệm 1-3 vai trò phụ</li>
              <li>• Chiếm 30% trọng số đánh giá</li>
              <li>• Cross-functional collaboration</li>
              <li>• Bonus KPI cho đóng góp thêm</li>
            </ul>
          </div>
          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
            <h4 className="text-sm text-green-800 mb-2">🤖 Vai trò AI</h4>
            <ul className="space-y-1 text-xs text-green-700">
              <li>• AI agents có vai trò chuyên biệt</li>
              <li>• Đánh giá bằng cùng KPI framework</li>
              <li>• Có thể đảm nhận nhiều task types</li>
              <li>• Hoạt động 24/7, no burnout</li>
            </ul>
          </div>
        </div>
      </SectionCard>

      {/* Department Details */}
      <div className="space-y-4">
        {departments.map((dept) => (
          <SectionCard
            key={dept.name}
            title={dept.name}
            subtitle={`${dept.nameEn} • ${dept.headcount.human} Human + ${dept.headcount.ai} AI`}
            icon={dept.icon}
            headerAction={
              <div className="flex items-center gap-2">
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                  👤 {dept.headcount.human}
                </span>
                <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded">
                  🤖 {dept.headcount.ai}
                </span>
              </div>
            }
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {dept.roles.map((role) => (
                <div
                  key={role.name}
                  className={`p-3 rounded-lg border transition-colors ${
                    role.type === "ai"
                      ? "border-violet-200 bg-violet-50/50"
                      : role.type === "both"
                      ? "border-indigo-200 bg-indigo-50/50"
                      : "border-gray-100 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {role.type === "ai" ? (
                      <Bot className="w-4 h-4 text-violet-600" />
                    ) : role.type === "both" ? (
                      <div className="flex -space-x-1">
                        <Users className="w-4 h-4 text-blue-600" />
                        <Bot className="w-3 h-3 text-violet-600" />
                      </div>
                    ) : (
                      <Users className="w-4 h-4 text-blue-600" />
                    )}
                    <h4 className="text-sm text-gray-900 flex-1">{role.name}</h4>
                    {role.isPrimary && (
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                        Primary
                      </span>
                    )}
                  </div>
                  <div className="space-y-1">
                    {role.responsibilities.map((r) => (
                      <div key={r} className="flex items-center gap-1.5 text-xs text-gray-500">
                        <CheckCircle2 className="w-3 h-3 text-green-400 flex-shrink-0" />
                        {r}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  );
}
