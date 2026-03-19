import {
  BarChart3,
  Target,
  TrendingUp,
  Award,
  Eye,
  Scale,
  Users,
  Bot,
  Star,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
} from "lucide-react";
import { SectionCard } from "../components/SectionCard";
import { StatCard } from "../components/StatCard";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useState } from "react";

const radarData = [
  { metric: "Revenue", human: 85, ai: 72, fullMark: 100 },
  { metric: "Leads", human: 70, ai: 95, fullMark: 100 },
  { metric: "Conversion", human: 78, ai: 68, fullMark: 100 },
  { metric: "Activity", human: 82, ai: 98, fullMark: 100 },
  { metric: "Quality", human: 90, ai: 75, fullMark: 100 },
  { metric: "Retention", human: 88, ai: 65, fullMark: 100 },
];

const teamPerformance = [
  { name: "Sales Team A", kpi: 92, target: 85, efficiency: 95 },
  { name: "Sales Team B", kpi: 78, target: 85, efficiency: 82 },
  { name: "Marketing", kpi: 88, target: 80, efficiency: 90 },
  { name: "BDR Team", kpi: 95, target: 90, efficiency: 93 },
  { name: "AI Agents", kpi: 97, target: 85, efficiency: 99 },
];

interface KPICategory {
  name: string;
  weight: string;
  metrics: {
    name: string;
    description: string;
    formula: string;
    weight: string;
    frequency: string;
  }[];
}

const salesKPIs: KPICategory[] = [
  {
    name: "Revenue & Deal Metrics",
    weight: "40%",
    metrics: [
      {
        name: "Revenue Achieved",
        description: "Doanh thu thực tế vs mục tiêu",
        formula: "Actual Revenue / Target Revenue × 100",
        weight: "15%",
        frequency: "Monthly",
      },
      {
        name: "Deal Win Rate",
        description: "Tỷ lệ chốt deal thành công",
        formula: "Won Deals / Total Qualified Deals × 100",
        weight: "10%",
        frequency: "Monthly",
      },
      {
        name: "Average Deal Size",
        description: "Giá trị trung bình mỗi deal",
        formula: "Total Revenue / Number of Deals",
        weight: "8%",
        frequency: "Quarterly",
      },
      {
        name: "Sales Cycle Length",
        description: "Thời gian trung bình chốt deal",
        formula: "Avg(Close Date - First Contact Date)",
        weight: "7%",
        frequency: "Monthly",
      },
    ],
  },
  {
    name: "Activity & Engagement Metrics",
    weight: "25%",
    metrics: [
      {
        name: "Activity Score",
        description: "Điểm hoạt động (calls, emails, meetings)",
        formula: "Weighted sum of all activities / Target",
        weight: "10%",
        frequency: "Weekly",
      },
      {
        name: "Response Time",
        description: "Thời gian phản hồi lead/khách hàng",
        formula: "Avg response time (minutes)",
        weight: "8%",
        frequency: "Daily",
      },
      {
        name: "Pipeline Coverage",
        description: "Pipeline value vs target ratio",
        formula: "Total Pipeline Value / Revenue Target",
        weight: "7%",
        frequency: "Weekly",
      },
    ],
  },
  {
    name: "Quality & Customer Metrics",
    weight: "20%",
    metrics: [
      {
        name: "Customer Satisfaction (CSAT)",
        description: "Đánh giá hài lòng từ khách hàng",
        formula: "Sum(Positive Ratings) / Total Ratings × 100",
        weight: "8%",
        frequency: "Per Deal",
      },
      {
        name: "Forecast Accuracy",
        description: "Độ chính xác dự báo deal",
        formula: "1 - |Forecast - Actual| / Actual",
        weight: "7%",
        frequency: "Monthly",
      },
      {
        name: "Upsell/Cross-sell Rate",
        description: "Tỷ lệ bán thêm cho khách hàng hiện tại",
        formula: "Upsell Revenue / Total Revenue × 100",
        weight: "5%",
        frequency: "Quarterly",
      },
    ],
  },
  {
    name: "AI Collaboration & Learning",
    weight: "15%",
    metrics: [
      {
        name: "AI Tool Adoption",
        description: "Mức độ sử dụng AI tools hỗ trợ",
        formula: "AI-assisted actions / Total actions × 100",
        weight: "5%",
        frequency: "Weekly",
      },
      {
        name: "Knowledge Contribution",
        description: "Đóng góp vào knowledge base",
        formula: "Articles + Best Practices + Feedback shared",
        weight: "5%",
        frequency: "Monthly",
      },
      {
        name: "Continuous Improvement",
        description: "Cải thiện KPI theo thời gian",
        formula: "Current Score / Previous Period Score",
        weight: "5%",
        frequency: "Monthly",
      },
    ],
  },
];

const marketingKPIs: KPICategory[] = [
  {
    name: "Lead Generation",
    weight: "30%",
    metrics: [
      { name: "MQL Generated", description: "Số Marketing Qualified Leads", formula: "Count(MQL status leads)", weight: "12%", frequency: "Weekly" },
      { name: "Cost per Lead (CPL)", description: "Chi phí trên mỗi lead", formula: "Total Spend / Total Leads", weight: "10%", frequency: "Monthly" },
      { name: "Lead-to-MQL Rate", description: "Tỷ lệ chuyển đổi lead → MQL", formula: "MQL / Total Leads × 100", weight: "8%", frequency: "Weekly" },
    ],
  },
  {
    name: "Campaign Performance",
    weight: "30%",
    metrics: [
      { name: "ROI per Campaign", description: "Hiệu quả đầu tư marketing", formula: "(Revenue - Cost) / Cost × 100", weight: "12%", frequency: "Per Campaign" },
      { name: "Engagement Rate", description: "Tỷ lệ tương tác (CTR, Open Rate)", formula: "Clicks / Impressions × 100", weight: "10%", frequency: "Per Campaign" },
      { name: "Content Performance", description: "Hiệu quả content marketing", formula: "Engagement Score per Content", weight: "8%", frequency: "Monthly" },
    ],
  },
  {
    name: "Brand & Pipeline Impact",
    weight: "25%",
    metrics: [
      { name: "Pipeline Contribution", description: "Đóng góp vào sales pipeline", formula: "Marketing-sourced Pipeline / Total Pipeline", weight: "10%", frequency: "Monthly" },
      { name: "Brand Awareness Score", description: "Điểm nhận biết thương hiệu", formula: "Survey Score + Social Mentions + Search Volume", weight: "8%", frequency: "Quarterly" },
      { name: "Customer Acquisition Cost", description: "Chi phí thu hút khách hàng", formula: "Total Marketing Cost / New Customers", weight: "7%", frequency: "Monthly" },
    ],
  },
  {
    name: "AI & Innovation",
    weight: "15%",
    metrics: [
      { name: "AI Content Utilization", description: "Sử dụng AI tạo content", formula: "AI-generated / Total content × 100", weight: "8%", frequency: "Weekly" },
      { name: "Experimentation Score", description: "Số A/B tests & experiments", formula: "Tests run + Insights generated", weight: "7%", frequency: "Monthly" },
    ],
  },
];

const sampleEmployees = [
  {
    name: "Nguyễn Văn An",
    type: "human" as const,
    role: "Senior Sales Executive",
    primaryRole: "Sales",
    secondaryRoles: ["Account Management", "Mentoring"],
    overallScore: 92,
    trend: "up" as const,
    scores: { revenue: 95, activity: 88, quality: 93, aiCollab: 85 },
  },
  {
    name: "Trần Thị Bình",
    type: "human" as const,
    role: "Marketing Manager",
    primaryRole: "Marketing",
    secondaryRoles: ["Content Strategy", "Brand"],
    overallScore: 88,
    trend: "up" as const,
    scores: { revenue: 82, activity: 90, quality: 91, aiCollab: 92 },
  },
  {
    name: "AI Sales Agent #1",
    type: "ai" as const,
    role: "AI BDR",
    primaryRole: "Lead Generation",
    secondaryRoles: ["Lead Qualification", "Email Outreach"],
    overallScore: 97,
    trend: "stable" as const,
    scores: { revenue: 94, activity: 99, quality: 75, aiCollab: 100 },
  },
  {
    name: "Lê Minh Cường",
    type: "human" as const,
    role: "Business Development",
    primaryRole: "BD",
    secondaryRoles: ["Partnership", "Sales"],
    overallScore: 85,
    trend: "down" as const,
    scores: { revenue: 80, activity: 85, quality: 88, aiCollab: 78 },
  },
  {
    name: "AI Marketing Agent",
    type: "ai" as const,
    role: "AI Content Creator",
    primaryRole: "Content Marketing",
    secondaryRoles: ["SEO", "Social Media"],
    overallScore: 94,
    trend: "up" as const,
    scores: { revenue: 88, activity: 98, quality: 80, aiCollab: 100 },
  },
  {
    name: "Phạm Hoàng Duy",
    type: "human" as const,
    role: "Sales Representative",
    primaryRole: "Sales",
    secondaryRoles: ["Customer Support"],
    overallScore: 76,
    trend: "down" as const,
    scores: { revenue: 72, activity: 78, quality: 80, aiCollab: 65 },
  },
];

const trendIcon = {
  up: <ArrowUpRight className="w-4 h-4 text-green-500" />,
  down: <ArrowDownRight className="w-4 h-4 text-red-500" />,
  stable: <Minus className="w-4 h-4 text-gray-400" />,
};

export function EvaluationPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "sales" | "marketing">("overview");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900">📊 Hệ thống Đánh giá Nhân viên</h1>
        <p className="text-gray-500 mt-1">
          Đánh giá công bằng, công khai, minh bạch - Cả nhân viên con người và AI
        </p>
      </div>

      {/* Principles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Scale className="w-5 h-5 text-white" />}
          label="Công bằng"
          value="Fair"
          subtitle="Cùng KPI framework cho tất cả"
          gradient="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          icon={<Eye className="w-5 h-5 text-white" />}
          label="Minh bạch"
          value="Transparent"
          subtitle="Mọi tiêu chí & công thức công khai"
          gradient="bg-gradient-to-br from-violet-500 to-violet-600"
        />
        <StatCard
          icon={<BarChart3 className="w-5 h-5 text-white" />}
          label="Real-time"
          value="Live"
          subtitle="Dashboard cập nhật liên tục"
          gradient="bg-gradient-to-br from-indigo-500 to-indigo-600"
        />
        <StatCard
          icon={<Bot className="w-5 h-5 text-white" />}
          label="AI-Powered"
          value="Smart"
          subtitle="AI phân tích & đề xuất cải thiện"
          gradient="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[
          { key: "overview" as const, label: "Tổng quan" },
          { key: "sales" as const, label: "KPI Sales" },
          { key: "marketing" as const, label: "KPI Marketing" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-md text-sm transition-all ${
              activeTab === tab.key
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <>
          {/* Performance Comparison Chart */}
          <div className="grid lg:grid-cols-2 gap-4">
            <SectionCard
              title="So sánh Human vs AI Performance"
              subtitle="Radar chart đa chiều"
              icon={<Target className="w-5 h-5" />}
            >
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Human" dataKey="human" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.3} />
                  <Radar name="AI Agent" dataKey="ai" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </SectionCard>

            <SectionCard
              title="Team Performance Overview"
              subtitle="KPI achievement by team"
              icon={<BarChart3 className="w-5 h-5" />}
            >
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={teamPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="kpi" name="KPI Score" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="target" name="Target" fill="#e2e8f0" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </SectionCard>
          </div>

          {/* Employee Leaderboard */}
          <SectionCard
            title="Bảng xếp hạng nhân viên"
            subtitle="Real-time performance leaderboard - Cả Human & AI"
            icon={<Award className="w-5 h-5" />}
            headerAction={
              <span className="text-xs text-gray-400">Cập nhật: Real-time</span>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-xs text-gray-500 border-b border-gray-100">
                    <th className="text-left pb-3 pr-4">#</th>
                    <th className="text-left pb-3 pr-4">Nhân viên</th>
                    <th className="text-left pb-3 pr-4">Loại</th>
                    <th className="text-left pb-3 pr-4">Vai trò chính</th>
                    <th className="text-left pb-3 pr-4">Vai trò kiêm nhiệm</th>
                    <th className="text-center pb-3 pr-4">Revenue</th>
                    <th className="text-center pb-3 pr-4">Activity</th>
                    <th className="text-center pb-3 pr-4">Quality</th>
                    <th className="text-center pb-3 pr-4">AI Collab</th>
                    <th className="text-center pb-3 pr-4">Overall</th>
                    <th className="text-center pb-3">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {sampleEmployees
                    .sort((a, b) => b.overallScore - a.overallScore)
                    .map((emp, idx) => (
                      <tr key={emp.name} className="border-b border-gray-50 hover:bg-gray-50">
                        <td className="py-3 pr-4">
                          {idx < 3 ? (
                            <span className="text-sm">
                              {idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-400">{idx + 1}</span>
                          )}
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs ${
                                emp.type === "ai"
                                  ? "bg-gradient-to-br from-violet-500 to-indigo-600"
                                  : "bg-gradient-to-br from-blue-500 to-blue-600"
                              }`}
                            >
                              {emp.type === "ai" ? (
                                <Bot className="w-3.5 h-3.5" />
                              ) : (
                                emp.name.charAt(0)
                              )}
                            </div>
                            <div>
                              <p className="text-sm text-gray-900">{emp.name}</p>
                              <p className="text-xs text-gray-400">{emp.role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4">
                          <span
                            className={`px-2 py-0.5 rounded text-xs ${
                              emp.type === "ai"
                                ? "bg-violet-100 text-violet-700"
                                : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {emp.type === "ai" ? "AI" : "Human"}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-700">
                            {emp.primaryRole}
                          </span>
                        </td>
                        <td className="py-3 pr-4">
                          <div className="flex gap-1 flex-wrap">
                            {emp.secondaryRoles.map((r) => (
                              <span
                                key={r}
                                className="text-[10px] bg-gray-50 px-1.5 py-0.5 rounded text-gray-500 border border-gray-100"
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                        </td>
                        {Object.values(emp.scores).map((score, i) => (
                          <td key={i} className="py-3 pr-4 text-center">
                            <span
                              className={`text-sm ${
                                score >= 90
                                  ? "text-green-600"
                                  : score >= 80
                                  ? "text-blue-600"
                                  : score >= 70
                                  ? "text-amber-600"
                                  : "text-red-600"
                              }`}
                            >
                              {score}
                            </span>
                          </td>
                        ))}
                        <td className="py-3 pr-4 text-center">
                          <span
                            className={`inline-flex items-center justify-center w-10 h-7 rounded-full text-sm text-white ${
                              emp.overallScore >= 90
                                ? "bg-green-500"
                                : emp.overallScore >= 80
                                ? "bg-blue-500"
                                : emp.overallScore >= 70
                                ? "bg-amber-500"
                                : "bg-red-500"
                            }`}
                          >
                            {emp.overallScore}
                          </span>
                        </td>
                        <td className="py-3 text-center">{trendIcon[emp.trend]}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Evaluation Principles */}
          <SectionCard
            title="Nguyên tắc đánh giá minh bạch"
            subtitle="Transparent Evaluation Framework"
            icon={<Scale className="w-5 h-5" />}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  icon: <Eye className="w-5 h-5" />,
                  title: "100% Công khai",
                  points: [
                    "Tất cả KPI & công thức tính công khai",
                    "Mọi nhân viên xem được tiêu chí đánh giá",
                    "Dashboard real-time cho mọi người",
                    "Không có KPI ẩn hoặc điều chỉnh ngầm",
                  ],
                },
                {
                  icon: <Scale className="w-5 h-5" />,
                  title: "Công bằng tuyệt đối",
                  points: [
                    "Cùng framework cho Human & AI",
                    "Điều chỉnh weight theo role & level",
                    "AI tự calibrate để loại bias",
                    "Peer review & 360-degree feedback",
                  ],
                },
                {
                  icon: <Sparkles className="w-5 h-5" />,
                  title: "AI-Powered Insights",
                  points: [
                    "AI phát hiện pattern hiệu suất",
                    "Suggest cải thiện cá nhân hóa",
                    "Dự đoán performance trend",
                    "Auto-detect anomalies & bias",
                  ],
                },
                {
                  icon: <Users className="w-5 h-5" />,
                  title: "Đa vai trò",
                  points: [
                    "1 người = 1 vai trò chính + N vai trò phụ",
                    "Đánh giá theo vai trò chính (70%)",
                    "Bonus từ vai trò kiêm nhiệm (30%)",
                    "AI optimize phân bổ vai trò",
                  ],
                },
                {
                  icon: <TrendingUp className="w-5 h-5" />,
                  title: "Cải thiện liên tục",
                  points: [
                    "Review cycle: Weekly → Monthly → Quarterly",
                    "AI coaching suggestions tự động",
                    "Learning path cá nhân hóa",
                    "Gamification & recognition",
                  ],
                },
                {
                  icon: <CheckCircle2 className="w-5 h-5" />,
                  title: "Data-Driven",
                  points: [
                    "100% dựa trên dữ liệu thực",
                    "Không đánh giá chủ quan",
                    "AI audit trail cho mọi quyết định",
                    "Historical comparison & benchmarking",
                  ],
                },
              ].map((p, i) => (
                <div key={i} className="p-4 rounded-xl border border-gray-100 hover:border-violet-200 transition-colors">
                  <div className="w-9 h-9 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center mb-3">
                    {p.icon}
                  </div>
                  <h4 className="text-sm text-gray-900 mb-2">{p.title}</h4>
                  <ul className="space-y-1">
                    {p.points.map((pt) => (
                      <li key={pt} className="text-xs text-gray-500 flex items-start gap-1.5">
                        <Star className="w-3 h-3 text-amber-400 mt-0.5 flex-shrink-0" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      )}

      {activeTab === "sales" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
            <h3 className="text-green-800 text-sm mb-1">💰 KPI Framework cho nhân viên Sales</h3>
            <p className="text-xs text-green-600">
              Áp dụng cho cả Sales Executive, BDR, Account Manager. Điều chỉnh weight theo level & role.
            </p>
          </div>
          {salesKPIs.map((cat) => (
            <SectionCard
              key={cat.name}
              title={cat.name}
              subtitle={`Weight: ${cat.weight}`}
              icon={<Target className="w-5 h-5" />}
            >
              <div className="space-y-3">
                {cat.metrics.map((m) => (
                  <div
                    key={m.name}
                    className="p-3 rounded-lg border border-gray-100 hover:border-violet-200 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm text-gray-900">{m.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-violet-100 text-violet-700 px-2 py-0.5 rounded">
                          {m.weight}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                          {m.frequency}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{m.description}</p>
                    <div className="flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded w-fit">
                      <code>{m.formula}</code>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          ))}
        </div>
      )}

      {activeTab === "marketing" && (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
            <h3 className="text-orange-800 text-sm mb-1">📣 KPI Framework cho nhân viên Marketing</h3>
            <p className="text-xs text-orange-600">
              Áp dụng cho Marketing Manager, Content Creator, Growth Hacker, SEO Specialist.
            </p>
          </div>
          {marketingKPIs.map((cat) => (
            <SectionCard
              key={cat.name}
              title={cat.name}
              subtitle={`Weight: ${cat.weight}`}
              icon={<Target className="w-5 h-5" />}
            >
              <div className="space-y-3">
                {cat.metrics.map((m) => (
                  <div
                    key={m.name}
                    className="p-3 rounded-lg border border-gray-100 hover:border-violet-200 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-sm text-gray-900">{m.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
                          {m.weight}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                          {m.frequency}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mb-1">{m.description}</p>
                    <div className="flex items-center gap-1 text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded w-fit">
                      <code>{m.formula}</code>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          ))}
        </div>
      )}
    </div>
  );
}
