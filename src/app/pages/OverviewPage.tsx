import {
  Boxes,
  Bot,
  Users,
  Zap,
  Database,
  Shield,
  ArrowRight,
  Layers,
  GitBranch,
  Cloud,
  Cpu,
  Globe,
  ListChecks,
  BarChart3,
  Monitor,
  Sparkles,
  TrendingUp,
  Target,
} from "lucide-react";
import { StatCard } from "../components/StatCard";
import { SectionCard } from "../components/SectionCard";

/* ============================================================
 * Dữ liệu tĩnh
 * ============================================================ */
const architectureLayers = [
  {
    name: "Presentation Layer",
    color: "bg-blue-500",
    items: ["React Dashboard", "Mobile App (React Native)", "AI Chatbot Interface", "Email/Slack Integration"],
  },
  {
    name: "API Gateway & Orchestration",
    color: "bg-violet-500",
    items: ["GraphQL API", "REST API", "WebSocket Real-time", "AI Agent Router"],
  },
  {
    name: "Business Logic Layer",
    color: "bg-indigo-500",
    items: ["CRM Core Engine", "AI Decision Engine", "Workflow Automation", "Evaluation Engine"],
  },
  {
    name: "AI/ML Layer",
    color: "bg-purple-500",
    items: ["LLM Integration (GPT/Claude)", "Predictive Analytics", "NLP Processing", "Computer Vision (OCR)"],
  },
  {
    name: "Data Layer",
    color: "bg-pink-500",
    items: ["PostgreSQL (Primary)", "Redis (Cache)", "Elasticsearch", "Vector DB (Pinecone)"],
  },
  {
    name: "Infrastructure",
    color: "bg-rose-500",
    items: ["Kubernetes (K8s)", "CI/CD Pipeline", "Monitoring & Logging", "Security & Compliance"],
  },
];

const keyPrinciples = [
  {
    icon: <Bot className="w-5 h-5" />,
    title: "AI-First Design",
    desc: "Mọi dữ liệu được cấu trúc để AI đọc, hiểu và hành động. Schema chuẩn hóa với metadata phong phú.",
  },
  {
    icon: <Database className="w-5 h-5" />,
    title: "Data as Input for AI",
    desc: "Structured logging, event sourcing, semantic tagging - mọi thao tác tạo dữ liệu huấn luyện cho AI.",
  },
  {
    icon: <Users className="w-5 h-5" />,
    title: "Human + AI Workforce",
    desc: "Nhân viên AI và con người cùng hệ thống. Một người kiêm nhiều vai trò với 1 vai trò chính.",
  },
  {
    icon: <Shield className="w-5 h-5" />,
    title: "Transparent Evaluation",
    desc: "KPI công khai, thuật toán đánh giá minh bạch. Mọi nhân viên xem được tiêu chí và kết quả real-time.",
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: "Automation First",
    desc: "Tự động hóa triệt để: từ lead scoring, email nurturing đến báo cáo và phân tích.",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "Dual Business Model",
    desc: "Hỗ trợ cả outsource và product: quản lý client, project, pipeline song song.",
  },
];

/* Sidebar group summary — phản ánh cấu trúc mới */
const sidebarGroups = [
  { name: "💰 Bán hàng", count: 23, examples: "Pipeline, Deal Room, CPQ, Revenue Intelligence, Sales Playbook, Account Planning..." },
  { name: "📣 Marketing", count: 12, examples: "Campaigns, Email Sequences, Landing Pages, Campaign ROI, A/B Testing, Event Manager..." },
  { name: "🤝 Khách hàng", count: 15, examples: "Customer 360°, Journey, Tickets, Churn Prediction, Renewal Pipeline, SLA Tracking..." },
  { name: "🤖 AI & Tự động", count: 9, examples: "AI Insights, AI Training, AI Copilot, Predictive Analytics, Workflow Builder..." },
  { name: "⚙️ Vận hành", count: 15, examples: "Nhân sự, Tasks, Approvals, OKR, Inventory, Capacity Planner, VoIP Dialer..." },
  { name: "🔧 Quản trị", count: 17, examples: "RBAC, API Explorer, Webhooks, Compliance, Trust Center, Developer Portal..." },
];

/* Phase summary — 31 phases (0→30) */
const phaseHighlights = [
  { range: "0–5", label: "Nền tảng & CRM Cốt lõi", desc: "Lập kế hoạch, CRM core, AI engine, agent framework, automation, mở rộng doanh nghiệp" },
  { range: "6–11", label: "Backend & Ecosystem", desc: "Production backend, ML engine, omnichannel, security, mobile i18n, marketplace" },
  { range: "12–17", label: "Advanced AI & Scale", desc: "Autonomous agents, CDP analytics, customer engagement, industry solutions, DevOps, monetization" },
  { range: "18–23", label: "Quality & Revenue Ops", desc: "Testing QA, iPaaS integration, real-time collaboration, document intelligence, RevOps, customer success" },
  { range: "24–30", label: "AI Governance & Future", desc: "LLM Ops, data sovereignty, performance at scale, developer experience, accessibility, business continuity, sales playbook engine" },
];

/* ============================================================
 * Component
 * ============================================================ */
export function OverviewPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-gray-900">
            🏗️ Kế hoạch xây dựng AI-CRM Enterprise
          </h1>
          <p className="text-gray-500 mt-1">
            Phần mềm CRM đẳng cấp thế giới cho công ty phần mềm Outsource + Product
          </p>
        </div>
        <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-sm">
          v2.0 Blueprint
        </span>
      </div>

      {/* === Project Scale Stats === */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<ListChecks className="w-5 h-5 text-white" />}
          label="Kế hoạch"
          value="31 Phases"
          subtitle="Phase 0 → 30"
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          icon={<BarChart3 className="w-5 h-5 text-white" />}
          label="Tổng Bước"
          value="~900+"
          subtitle="Implementation steps"
          gradient="bg-gradient-to-br from-violet-500 to-violet-600"
        />
        <StatCard
          icon={<Monitor className="w-5 h-5 text-white" />}
          label="CRM Routes"
          value="110"
          subtitle="93 sidebar + 17 khác"
          gradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
        />
        <StatCard
          icon={<Sparkles className="w-5 h-5 text-white" />}
          label="Sidebar Groups"
          value="8 nhóm"
          subtitle="Sales, Marketing, CS..."
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      {/* === System Capabilities === */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Boxes className="w-5 h-5 text-white" />}
          label="Core Modules"
          value="12+"
          subtitle="Fully integrated"
          gradient="bg-gradient-to-br from-cyan-500 to-cyan-600"
        />
        <StatCard
          icon={<Bot className="w-5 h-5 text-white" />}
          label="AI Agents"
          value="15+"
          subtitle="Autonomous agents"
          gradient="bg-gradient-to-br from-pink-500 to-pink-600"
        />
        <StatCard
          icon={<Zap className="w-5 h-5 text-white" />}
          label="AI Tools"
          value="25+"
          subtitle="Built-in AI tools"
          gradient="bg-gradient-to-br from-amber-500 to-amber-600"
        />
        <StatCard
          icon={<Users className="w-5 h-5 text-white" />}
          label="Departments"
          value="8"
          subtitle="PM, BA, Dev, QA..."
          gradient="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
      </div>

      {/* === Sidebar Structure Overview === */}
      <SectionCard
        title="Cấu trúc CRM — 8 nhóm phân loại"
        subtitle="93 trang CRM được tổ chức theo 6 nhóm chức năng + Tổng quan + Bản thiết kế"
        icon={<Target className="w-5 h-5" />}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {sidebarGroups.map((g) => (
            <div
              key={g.name}
              className="p-3 rounded-xl border border-gray-100 hover:border-violet-200 hover:shadow-sm transition-all"
            >
              <div className="flex items-center justify-between mb-1.5">
                <h4 className="text-sm text-gray-900">{g.name}</h4>
                <span className="text-xs text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
                  {g.count} trang
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{g.examples}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 p-3 bg-violet-50 rounded-xl border border-violet-100">
          <p className="text-sm text-violet-800">
            <strong>Tổng cộng:</strong> 📊 Tổng quan (2) + 💰 Bán hàng (23) + 📣 Marketing (12) + 🤝 Khách hàng (15) + 🤖 AI (9) + ⚙️ Vận hành (15) + 🔧 Quản trị (17) = <strong>93 CRM sidebar items</strong> — collapsible groups giúp điều hướng dễ dàng.
          </p>
        </div>
      </SectionCard>

      {/* === Phase Roadmap Summary === */}
      <SectionCard
        title="Lộ trình 31 Phases — Tổng quan"
        subtitle="Từ nền tảng đến sales playbook engine"
        icon={<TrendingUp className="w-5 h-5" />}
      >
        <div className="space-y-3">
          {phaseHighlights.map((ph) => (
            <div key={ph.range} className="flex items-stretch gap-4">
              <div className="w-1.5 rounded-full bg-gradient-to-b from-violet-400 to-indigo-500 flex-shrink-0" />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs text-violet-600 bg-violet-50 px-2.5 py-0.5 rounded-full">
                    Phase {ph.range}
                  </span>
                  <h4 className="text-sm text-gray-900">{ph.label}</h4>
                </div>
                <p className="text-xs text-gray-500">{ph.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Architecture Layers */}
      <SectionCard
        title="Kiến trúc hệ thống 6 lớp"
        subtitle="Microservices Architecture with AI-Native Design"
        icon={<Layers className="w-5 h-5" />}
      >
        <div className="space-y-3">
          {architectureLayers.map((layer, idx) => (
            <div key={idx} className="flex items-stretch gap-4">
              <div className={`w-1.5 rounded-full ${layer.color} flex-shrink-0`} />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-gray-400 w-6">L{idx + 1}</span>
                  <h4 className="text-sm text-gray-900">{layer.name}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {layer.items.map((item) => (
                    <span
                      key={item}
                      className="px-2.5 py-1 text-xs bg-gray-50 text-gray-600 rounded-md border border-gray-100"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Key Principles */}
      <SectionCard
        title="Nguyên tắc thiết kế cốt lõi"
        subtitle="6 pillars of AI-CRM Architecture"
        icon={<GitBranch className="w-5 h-5" />}
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {keyPrinciples.map((p, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-gray-100 hover:border-violet-200 hover:shadow-sm transition-all group"
            >
              <div className="w-9 h-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center mb-3 group-hover:bg-violet-100 transition-colors">
                {p.icon}
              </div>
              <h4 className="text-sm text-gray-900 mb-1">{p.title}</h4>
              <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Tech Stack */}
      <div className="grid md:grid-cols-2 gap-4">
        <SectionCard title="Tech Stack chính" icon={<Cpu className="w-5 h-5" />}>
          <div className="space-y-3">
            {[
              { cat: "Frontend", techs: "React 18, Next.js 14, TailwindCSS, Shadcn/UI" },
              { cat: "Backend", techs: "Node.js, NestJS, GraphQL, tRPC" },
              { cat: "AI/ML", techs: "OpenAI GPT-4, Claude, LangChain, LlamaIndex" },
              { cat: "Database", techs: "PostgreSQL, Redis, Elasticsearch, Pinecone" },
              { cat: "DevOps", techs: "Docker, Kubernetes, GitHub Actions, Terraform" },
              { cat: "Monitoring", techs: "Grafana, Prometheus, Sentry, DataDog" },
            ].map((s) => (
              <div key={s.cat} className="flex items-start gap-3">
                <span className="text-xs text-violet-600 bg-violet-50 px-2 py-0.5 rounded w-20 text-center flex-shrink-0">
                  {s.cat}
                </span>
                <span className="text-sm text-gray-600">{s.techs}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="AI Production Process" icon={<Cloud className="w-5 h-5" />}>
          <div className="space-y-2">
            {[
              { step: "1", title: "AI Requirement Analysis", desc: "AI phân tích yêu cầu từ stakeholders, tự tạo user stories" },
              { step: "2", title: "AI-Assisted Design", desc: "AI đề xuất UI/UX, data model, API schema" },
              { step: "3", title: "AI Code Generation", desc: "AI sinh code, review, suggest refactoring" },
              { step: "4", title: "AI Testing", desc: "AI tạo test cases, regression testing, performance testing" },
              { step: "5", title: "AI Deployment", desc: "AI agent quản lý CI/CD, canary deployment, rollback" },
              { step: "6", title: "AI Monitoring", desc: "AI giám sát 24/7, tự phát hiện anomaly, tự fix bugs" },
            ].map((s) => (
              <div key={s.step} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                <span className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-white text-xs flex items-center justify-center flex-shrink-0">
                  {s.step}
                </span>
                <div>
                  <p className="text-sm text-gray-900">{s.title}</p>
                  <p className="text-xs text-gray-500">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Data Flow */}
      <SectionCard
        title="Luồng dữ liệu AI-Ready"
        subtitle="Mọi tương tác → Structured Data → AI Training → Intelligent Action"
      >
        <div className="flex items-center justify-between flex-wrap gap-4">
          {[
            { label: "User Action", color: "bg-blue-100 text-blue-700" },
            { label: "Event Stream", color: "bg-violet-100 text-violet-700" },
            { label: "AI Processing", color: "bg-purple-100 text-purple-700" },
            { label: "Knowledge Base", color: "bg-indigo-100 text-indigo-700" },
            { label: "AI Decision", color: "bg-pink-100 text-pink-700" },
            { label: "Automated Action", color: "bg-rose-100 text-rose-700" },
          ].map((item, idx, arr) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className={`px-3 py-2 rounded-lg text-sm ${item.color}`}>
                {item.label}
              </span>
              {idx < arr.length - 1 && (
                <ArrowRight className="w-4 h-4 text-gray-300" />
              )}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
