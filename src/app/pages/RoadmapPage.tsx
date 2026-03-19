import {
  CalendarClock,
  Rocket,
  CheckCircle2,
  Clock,
  AlertCircle,
  Target,
  Users,
  DollarSign,
  Layers,
} from "lucide-react";
import { SectionCard } from "../components/SectionCard";

interface Phase {
  name: string;
  duration: string;
  period: string;
  status: "completed" | "in-progress" | "planned";
  goals: string[];
  deliverables: string[];
  team: string;
  budget: string;
}

const phases: Phase[] = [
  {
    name: "Phase 0: Foundation & Planning",
    duration: "4 tuần",
    period: "Tháng 1",
    status: "completed",
    goals: [
      "Hoàn thiện blueprint & architecture design",
      "Setup development environment & CI/CD",
      "Recruit & onboard core team",
      "Define KPI framework & evaluation criteria",
    ],
    deliverables: [
      "Architecture Decision Records (ADR)",
      "Tech stack & infrastructure setup",
      "Development guidelines & coding standards",
      "KPI framework document v1.0",
    ],
    team: "2 Architects, 1 PM, 1 BA",
    budget: "$15,000",
  },
  {
    name: "Phase 1: Core CRM + AI Foundation",
    duration: "12 tuần",
    period: "Tháng 2 - Tháng 4",
    status: "in-progress",
    goals: [
      "Build Contact & Account Management",
      "Build Sales Pipeline (basic)",
      "Setup AI infrastructure (LLM, Vector DB)",
      "Implement User Management & RBAC",
      "Build Activity Logging & Event Stream",
    ],
    deliverables: [
      "Contact management với AI enrichment",
      "Basic sales pipeline (Kanban board)",
      "AI service layer (GPT-4 integration)",
      "User auth, roles, permissions",
      "Event sourcing infrastructure",
    ],
    team: "4 Devs, 1 AI Engineer, 1 QA, 1 PM, 1 BA",
    budget: "$80,000",
  },
  {
    name: "Phase 2: Sales + Marketing Intelligence",
    duration: "10 tuần",
    period: "Tháng 5 - Tháng 7",
    status: "planned",
    goals: [
      "Advanced Sales Pipeline (AI scoring, predictions)",
      "Marketing Automation module",
      "AI Lead Scoring & Win Probability",
      "Email integration & AI composer",
      "Campaign management",
    ],
    deliverables: [
      "AI-powered sales pipeline",
      "Marketing campaign builder",
      "AI Email Composer tool",
      "Lead scoring engine",
      "Campaign analytics dashboard",
    ],
    team: "6 Devs, 2 AI Engineers, 2 QA, 1 PM, 1 BA",
    budget: "$120,000",
  },
  {
    name: "Phase 3: AI Agents + Evaluation System",
    duration: "10 tuần",
    period: "Tháng 8 - Tháng 10",
    status: "planned",
    goals: [
      "Deploy AI Agent orchestration system",
      "Build transparent performance evaluation",
      "AI BDR Agent, Support Agent go-live",
      "Multi-role employee management",
      "Real-time KPI dashboards",
    ],
    deliverables: [
      "AI Agent framework & 5 active agents",
      "Performance evaluation dashboard",
      "Employee multi-role management",
      "Public KPI leaderboard",
      "AI coaching recommendations",
    ],
    team: "6 Devs, 3 AI Engineers, 2 QA, 1 PM, 1 BA, 1 DevOps",
    budget: "$150,000",
  },
  {
    name: "Phase 4: Full Automation + Analytics",
    duration: "8 tuần",
    period: "Tháng 11 - Tháng 12",
    status: "planned",
    goals: [
      "Workflow Automation Engine",
      "Advanced BI & Analytics",
      "Natural language querying",
      "AI Content Generator tools",
      "Customer Support AI (L1 auto)",
    ],
    deliverables: [
      "No-code workflow builder",
      "AI-powered BI dashboards",
      "NL query interface (tiếng Việt)",
      "AI content tools suite",
      "24/7 AI support chatbot",
    ],
    team: "8 Devs, 3 AI Engineers, 3 QA, 2 PM, 1 BA, 1 DevOps",
    budget: "$140,000",
  },
  {
    name: "Phase 5: Enterprise + Scale",
    duration: "8 tuần",
    period: "Tháng 1 - Tháng 2 (Y2)",
    status: "planned",
    goals: [
      "Project & Delivery management",
      "Contract & Financial module",
      "Advanced security & compliance",
      "Multi-tenant architecture",
      "Mobile app (React Native)",
    ],
    deliverables: [
      "Project management module",
      "Contract lifecycle management",
      "SOC 2 Type II compliance",
      "White-label capability",
      "iOS & Android apps",
    ],
    team: "10 Devs, 3 AI Engineers, 3 QA, 2 PM, 2 BA, 2 DevOps",
    budget: "$180,000",
  },
];

const statusConfig = {
  completed: { icon: <CheckCircle2 className="w-4 h-4" />, color: "text-green-600 bg-green-100", label: "Hoàn thành" },
  "in-progress": { icon: <Clock className="w-4 h-4" />, color: "text-blue-600 bg-blue-100", label: "Đang triển khai" },
  planned: { icon: <AlertCircle className="w-4 h-4" />, color: "text-gray-500 bg-gray-100", label: "Kế hoạch" },
};

const totalBudget = phases.reduce((sum, p) => sum + parseInt(p.budget.replace(/[^0-9]/g, "")), 0);
const totalWeeks = phases.reduce((sum, p) => sum + parseInt(p.duration), 0);

export function RoadmapPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900">🗓️ Lộ trình triển khai</h1>
        <p className="text-gray-500 mt-1">
          6 phases, ~{totalWeeks} tuần, xây dựng CRM AI hoàn chỉnh
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <CalendarClock className="w-5 h-5 text-violet-600 mb-2" />
          <p className="text-2xl text-gray-900">~{totalWeeks} tuần</p>
          <p className="text-xs text-gray-500">Tổng thời gian</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <Layers className="w-5 h-5 text-blue-600 mb-2" />
          <p className="text-2xl text-gray-900">{phases.length} phases</p>
          <p className="text-xs text-gray-500">Giai đoạn phát triển</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <DollarSign className="w-5 h-5 text-green-600 mb-2" />
          <p className="text-2xl text-gray-900">${(totalBudget / 1000).toFixed(0)}K</p>
          <p className="text-xs text-gray-500">Tổng ngân sách ước tính</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <Users className="w-5 h-5 text-amber-600 mb-2" />
          <p className="text-2xl text-gray-900">~25 người</p>
          <p className="text-xs text-gray-500">Peak team size</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        {phases.map((phase, idx) => {
          const status = statusConfig[phase.status];
          return (
            <div
              key={phase.name}
              className={`bg-white rounded-xl border overflow-hidden ${
                phase.status === "in-progress" ? "border-blue-200 ring-1 ring-blue-100" : "border-gray-100"
              }`}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        phase.status === "completed"
                          ? "bg-green-100 text-green-600"
                          : phase.status === "in-progress"
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {status.icon}
                    </div>
                    {idx < phases.length - 1 && (
                      <div className="w-0.5 h-8 bg-gray-200 mt-2" />
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-sm text-gray-900">{phase.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs ${status.color}`}>
                        {status.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <span>⏱️ {phase.duration}</span>
                      <span>📅 {phase.period}</span>
                      <span>💰 {phase.budget}</span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                          <Target className="w-3.5 h-3.5" /> Mục tiêu
                        </h4>
                        <div className="space-y-1.5">
                          {phase.goals.map((g) => (
                            <div key={g} className="text-xs text-gray-700 flex items-start gap-1.5">
                              <div className="w-1 h-1 rounded-full bg-violet-500 mt-1.5 flex-shrink-0" />
                              {g}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                          <Rocket className="w-3.5 h-3.5" /> Deliverables
                        </h4>
                        <div className="space-y-1.5">
                          {phase.deliverables.map((d) => (
                            <div key={d} className="text-xs text-gray-700 flex items-start gap-1.5">
                              <CheckCircle2 className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                              {d}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                          <Users className="w-3.5 h-3.5" /> Team
                        </h4>
                        <p className="text-xs text-gray-700 bg-gray-50 p-2 rounded">{phase.team}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Success Metrics */}
      <SectionCard
        title="Tiêu chí đánh giá thành công"
        subtitle="Key Success Metrics cho dự án"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { metric: "User Adoption Rate", target: "> 90%", period: "After 3 months" },
            { metric: "AI Agent Automation Rate", target: "> 60%", period: "Phase 4+" },
            { metric: "Sales Productivity Increase", target: "> 30%", period: "After 6 months" },
            { metric: "Lead Response Time", target: "< 5 minutes", period: "Phase 2+" },
            { metric: "Customer Satisfaction (CSAT)", target: "> 4.5/5", period: "Ongoing" },
            { metric: "System Uptime", target: "> 99.9%", period: "Ongoing" },
            { metric: "Data Quality Score", target: "> 95%", period: "Phase 1+" },
            { metric: "Employee KPI Transparency", target: "100%", period: "Phase 3+" },
            { metric: "ROI", target: "> 300%", period: "Year 2" },
          ].map((m) => (
            <div key={m.metric} className="p-3 rounded-lg border border-gray-100 hover:border-green-200 transition-colors">
              <p className="text-sm text-gray-900">{m.metric}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-sm text-green-600">{m.target}</span>
                <span className="text-xs text-gray-400">{m.period}</span>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
