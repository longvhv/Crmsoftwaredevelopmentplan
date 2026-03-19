import {
  Bot,
  Brain,
  Zap,
  MessageSquare,
  TrendingUp,
  Shield,
  Users,
  Code,
  FileSearch,
  Megaphone,
  Headphones,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { SectionCard } from "../components/SectionCard";
import { useState } from "react";

interface AIAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  capabilities: string[];
  triggers: string[];
  outputs: string[];
  autonomyLevel: "Full Auto" | "Semi-Auto" | "Human-in-Loop";
  status: "Active" | "Beta" | "Planned";
}

const agents: AIAgent[] = [
  {
    id: "sales-agent",
    name: "Sales Intelligence Agent",
    role: "Trợ lý bán hàng thông minh",
    description: "Phân tích pipeline, dự đoán win/loss, đề xuất hành động tối ưu cho từng deal",
    icon: <TrendingUp className="w-5 h-5" />,
    color: "from-green-500 to-emerald-600",
    capabilities: [
      "Lead scoring tự động theo 50+ tiêu chí",
      "Dự đoán xác suất chốt deal real-time",
      "Phân tích competitor & suggest battlecard",
      "Tự động tạo proposal & quotation",
      "Gợi ý next best action cho sales rep",
      "Phát hiện deal at risk & escalation tự động",
    ],
    triggers: ["New lead assigned", "Deal stage change", "No activity > 3 days", "Competitor detected"],
    outputs: ["Action recommendations", "Risk alerts", "Automated emails", "Deal score update"],
    autonomyLevel: "Semi-Auto",
    status: "Active",
  },
  {
    id: "marketing-agent",
    name: "Marketing AI Agent",
    role: "Chuyên gia marketing tự động",
    description: "Tạo content, tối ưu campaign, phân tích audience & attribution",
    icon: <Megaphone className="w-5 h-5" />,
    color: "from-orange-500 to-amber-600",
    capabilities: [
      "Tạo content marketing (blog, email, social post)",
      "A/B testing & auto-optimization",
      "Audience segmentation thông minh",
      "Multi-touch attribution modeling",
      "SEO analysis & content optimization",
      "Social listening & trend detection",
    ],
    triggers: ["Campaign launch", "Low engagement detected", "New content needed", "Budget threshold"],
    outputs: ["Generated content", "Optimized campaigns", "Audience insights", "ROI reports"],
    autonomyLevel: "Semi-Auto",
    status: "Active",
  },
  {
    id: "support-agent",
    name: "Customer Support Agent",
    role: "Nhân viên hỗ trợ khách hàng AI",
    description: "Chatbot thông minh, phân loại ticket, giải quyết vấn đề L1 tự động",
    icon: <Headphones className="w-5 h-5" />,
    color: "from-blue-500 to-sky-600",
    capabilities: [
      "Trả lời câu hỏi 24/7 bằng tiếng Việt & English",
      "Phân loại & route ticket tự động",
      "Tạo ticket summary & suggest resolution",
      "Escalation thông minh khi cần human support",
      "Knowledge base tự động cập nhật",
      "Sentiment analysis real-time",
    ],
    triggers: ["New ticket", "Customer message", "SLA breach warning", "Negative sentiment"],
    outputs: ["Auto-responses", "Ticket classification", "Escalation alerts", "Satisfaction scores"],
    autonomyLevel: "Full Auto",
    status: "Active",
  },
  {
    id: "analytics-agent",
    name: "Analytics & Insights Agent",
    role: "Nhà phân tích dữ liệu AI",
    description: "Tự động phân tích data, phát hiện trends, tạo báo cáo insights",
    icon: <BarChart3 className="w-5 h-5" />,
    color: "from-indigo-500 to-violet-600",
    capabilities: [
      "Natural language querying (hỏi bằng tiếng Việt)",
      "Auto-generate dashboard & báo cáo",
      "Anomaly detection & alerting",
      "Predictive forecasting revenue/churn",
      "Cross-module data correlation",
      "Executive summary tự động hàng tuần",
    ],
    triggers: ["Scheduled reports", "Anomaly detected", "User query", "Threshold breach"],
    outputs: ["Interactive dashboards", "Insight reports", "Predictions", "Anomaly alerts"],
    autonomyLevel: "Full Auto",
    status: "Active",
  },
  {
    id: "hr-agent",
    name: "HR & Performance Agent",
    role: "Trợ lý nhân sự thông minh",
    description: "Đánh giá performance, phân tích workload, đề xuất training path",
    icon: <Users className="w-5 h-5" />,
    color: "from-amber-500 to-yellow-600",
    capabilities: [
      "Performance scoring tự động & công bằng",
      "Workload analysis & burnout detection",
      "Skill gap analysis & training recommendation",
      "Employee-project matching optimization",
      "360-degree feedback aggregation",
      "Compensation benchmarking",
    ],
    triggers: ["Performance review cycle", "Workload imbalance", "Skill assessment", "New project staffing"],
    outputs: ["Performance reports", "Training plans", "Staffing recommendations", "Alerts"],
    autonomyLevel: "Human-in-Loop",
    status: "Active",
  },
  {
    id: "code-agent",
    name: "Development AI Agent",
    role: "Trợ lý phát triển phần mềm",
    description: "Hỗ trợ code review, testing, CI/CD và project estimation",
    icon: <Code className="w-5 h-5" />,
    color: "from-slate-500 to-gray-600",
    capabilities: [
      "AI code review & suggest improvements",
      "Auto-generate unit tests",
      "CI/CD pipeline management",
      "Bug prediction & prevention",
      "Technical debt analysis",
      "Effort estimation cho features mới",
    ],
    triggers: ["PR created", "Build failure", "Sprint planning", "Code quality threshold"],
    outputs: ["Code suggestions", "Test cases", "Build status", "Technical reports"],
    autonomyLevel: "Semi-Auto",
    status: "Beta",
  },
  {
    id: "ba-agent",
    name: "Business Analysis Agent",
    role: "Chuyên gia phân tích nghiệp vụ AI",
    description: "Phân tích requirements, tạo user stories, document management",
    icon: <FileSearch className="w-5 h-5" />,
    color: "from-teal-500 to-cyan-600",
    capabilities: [
      "Requirement analysis từ meeting notes",
      "Auto-generate user stories & acceptance criteria",
      "Impact analysis cho change requests",
      "Process mapping & optimization",
      "Stakeholder communication automation",
      "Documentation auto-generation",
    ],
    triggers: ["New requirement", "Meeting completed", "Change request", "Sprint retrospective"],
    outputs: ["User stories", "Process docs", "Impact reports", "Meeting summaries"],
    autonomyLevel: "Semi-Auto",
    status: "Beta",
  },
  {
    id: "security-agent",
    name: "Security & Compliance Agent",
    role: "Chuyên gia bảo mật AI",
    description: "Giám sát bảo mật 24/7, phát hiện threats, đảm bảo compliance",
    icon: <Shield className="w-5 h-5" />,
    color: "from-red-500 to-rose-600",
    capabilities: [
      "Real-time threat detection",
      "Access pattern anomaly detection",
      "GDPR/Data privacy compliance check",
      "Vulnerability scanning & patching",
      "Audit trail analysis",
      "Incident response automation",
    ],
    triggers: ["Suspicious activity", "Compliance check schedule", "New vulnerability", "Access violation"],
    outputs: ["Security alerts", "Compliance reports", "Patch recommendations", "Incident reports"],
    autonomyLevel: "Full Auto",
    status: "Active",
  },
];

const autonomyColors = {
  "Full Auto": "bg-green-100 text-green-700",
  "Semi-Auto": "bg-blue-100 text-blue-700",
  "Human-in-Loop": "bg-amber-100 text-amber-700",
};

const statusColors = {
  Active: "bg-green-100 text-green-700",
  Beta: "bg-violet-100 text-violet-700",
  Planned: "bg-gray-100 text-gray-500",
};

const statusIcons = {
  Active: <CheckCircle2 className="w-3.5 h-3.5" />,
  Beta: <Clock className="w-3.5 h-3.5" />,
  Planned: <AlertTriangle className="w-3.5 h-3.5" />,
};

export function AIAgentsPage() {
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900">🤖 AI Agent & Tự động hóa</h1>
        <p className="text-gray-500 mt-1">
          Hệ thống AI Agents tự vận hành, phối hợp với nhân viên con người
        </p>
      </div>

      {/* Agent Orchestration */}
      <SectionCard
        title="AI Agent Orchestration Architecture"
        subtitle="Multi-Agent System with Central Coordinator"
        icon={<Brain className="w-5 h-5" />}
      >
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-violet-100">
              <Brain className="w-5 h-5 text-violet-600" />
              <span className="text-sm text-gray-900">Central AI Orchestrator</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Điều phối tất cả agents, phân bổ task, quản lý context & memory
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {agents.slice(0, 8).map((agent) => (
              <div
                key={agent.id}
                className="bg-white rounded-lg p-3 text-center shadow-sm border border-gray-100"
              >
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${agent.color} flex items-center justify-center text-white mx-auto mb-2`}
                >
                  {agent.icon}
                </div>
                <p className="text-xs text-gray-900 truncate">{agent.name.split(" ").slice(0, 2).join(" ")}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {statusIcons[agent.status]}
                  <span className="text-[10px] text-gray-400">{agent.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Agent List */}
      <div className="space-y-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div
              className="p-5 cursor-pointer"
              onClick={() =>
                setExpandedAgent(expandedAgent === agent.id ? null : agent.id)
              }
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center text-white flex-shrink-0`}
                >
                  {agent.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm text-gray-900">{agent.name}</h4>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${statusColors[agent.status]}`}>
                      {agent.status}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] ${autonomyColors[agent.autonomyLevel]}`}>
                      {agent.autonomyLevel}
                    </span>
                  </div>
                  <p className="text-xs text-violet-600 mt-0.5">{agent.role}</p>
                  <p className="text-sm text-gray-500 mt-1">{agent.description}</p>
                </div>
                <ChevronRight
                  className={`w-4 h-4 text-gray-400 transition-transform flex-shrink-0 ${
                    expandedAgent === agent.id ? "rotate-90" : ""
                  }`}
                />
              </div>
            </div>

            {expandedAgent === agent.id && (
              <div className="px-5 pb-5 border-t border-gray-50 pt-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h5 className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" /> Capabilities
                    </h5>
                    <div className="space-y-1.5">
                      {agent.capabilities.map((cap) => (
                        <div
                          key={cap}
                          className="text-xs text-gray-700 flex items-start gap-1.5 bg-gray-50 p-2 rounded"
                        >
                          <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                          {cap}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5" /> Triggers
                    </h5>
                    <div className="space-y-1.5">
                      {agent.triggers.map((t) => (
                        <div
                          key={t}
                          className="text-xs text-gray-700 flex items-start gap-1.5 bg-blue-50 p-2 rounded"
                        >
                          <ArrowRight className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                          {t}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                      <Bot className="w-3.5 h-3.5" /> Outputs
                    </h5>
                    <div className="space-y-1.5">
                      {agent.outputs.map((o) => (
                        <div
                          key={o}
                          className="text-xs text-gray-700 flex items-start gap-1.5 bg-violet-50 p-2 rounded"
                        >
                          <CheckCircle2 className="w-3 h-3 text-violet-500 mt-0.5 flex-shrink-0" />
                          {o}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ChevronRight(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
