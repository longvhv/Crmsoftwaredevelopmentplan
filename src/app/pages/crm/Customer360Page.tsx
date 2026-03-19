/**
 * Customer 360 View — Toàn cảnh Khách hàng
 * Unified view: profile, deals, tickets, activities,
 * health score, journey timeline, AI recommendations.
 */
import { useState } from "react";
import {
  Eye,
  Search,
  Sparkles,
  Bot,
  CheckCircle2,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Star,
  HeartPulse,
  BarChart3,
  MessageSquare,
  Ticket,
  FileText,
  ArrowRight,
  Zap,
  Building2,
  Activity,
  Target,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types & Mock Data
 * ============================================================ */
const fmtVND = (n: number) => {
  if (Math.abs(n) >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(0)}M`;
  return n.toLocaleString("vi-VN");
};

interface CustomerProfile {
  id: string;
  name: string;
  logo: string;
  industry: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  plan: string;
  status: "active" | "at-risk" | "churned";
  healthScore: number;
  nps: number;
  ltv: number;
  arr: number;
  contractStart: string;
  contractEnd: string;
  csm: string;
  employees: number;
  userSeats: number;
  activeUsers: number;
  lastActivity: string;
  tags: string[];
}

interface TimelineEvent {
  id: string;
  date: string;
  type: "deal" | "ticket" | "email" | "meeting" | "note" | "milestone" | "alert";
  title: string;
  description: string;
  actor: string;
}

interface DealSummary {
  id: string;
  name: string;
  value: number;
  stage: string;
  status: "won" | "open" | "lost";
}

interface TicketSummary {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  status: "open" | "resolved";
  date: string;
}

const CUSTOMER: CustomerProfile = {
  id: "cust_001", name: "TechViet Solutions", logo: "TV", industry: "Phần mềm & Công nghệ",
  website: "techviet.com.vn", phone: "+84 28 3812 5678", email: "contact@techviet.com.vn",
  address: "Tầng 15, Landmark 81, Q. Bình Thạnh, TP.HCM", plan: "Enterprise", status: "active",
  healthScore: 82, nps: 45, ltv: 12500000000, arr: 2800000000,
  contractStart: "2025-05-01", contractEnd: "2026-05-01", csm: "Phạm Văn Khôi",
  employees: 450, userSeats: 100, activeUsers: 87, lastActivity: "2026-03-03",
  tags: ["Enterprise", "Outsource & Product", "AI-first", "Key Account"],
};

const TIMELINE: TimelineEvent[] = [
  { id: "tl_01", date: "2026-03-03", type: "email", title: "Email: Proposal expansion 50 seats", description: "Gửi proposal upgrade từ 100 → 150 seats cho VP Engineering", actor: "Phạm Văn Khôi" },
  { id: "tl_02", date: "2026-03-02", type: "meeting", title: "QBR Q1/2026 — Online", description: "Quarterly Business Review: review KPIs, usage metrics, roadmap alignment", actor: "Phạm Văn Khôi + CTO TechViet" },
  { id: "tl_03", date: "2026-02-28", type: "ticket", title: "Ticket #T-4521: API rate limit issue", description: "Khách báo lỗi rate limit khi sync data từ ERP. Đã tăng quota lên 10K/min", actor: "AI Agent — Nova" },
  { id: "tl_04", date: "2026-02-25", type: "milestone", title: "Onboarding hoàn thành — Go-Live", description: "100% milestones completed. Time-to-Value: 55 ngày (target: 60)", actor: "System" },
  { id: "tl_05", date: "2026-02-20", type: "deal", title: "Deal #1042: Expansion +50 seats", description: "Tạo deal mới cho expansion. Value: 1.15B₫. Stage: Negotiation", actor: "Trần Minh Đức" },
  { id: "tl_06", date: "2026-02-15", type: "note", title: "Ghi chú: CTO quan tâm AI Agent", description: "CTO Nguyễn Minh rất quan tâm đến AI Sales Agent. Yêu cầu demo riêng tuần sau", actor: "Trần Minh Đức" },
  { id: "tl_07", date: "2026-02-10", type: "alert", title: "AI Alert: Usage spike +40%", description: "AI phát hiện usage tăng 40% trong 2 tuần — tín hiệu positive adoption", actor: "AI Agent — Aria" },
  { id: "tl_08", date: "2026-01-15", type: "email", title: "Email: NPS Survey Response", description: "CTO trả lời NPS = 9/10. Feedback: 'Excellent onboarding experience'", actor: "System" },
];

const DEALS: DealSummary[] = [
  { id: "d_001", name: "Initial Enterprise License (100 seats)", value: 2800000000, stage: "Closed Won", status: "won" },
  { id: "d_002", name: "AI Agent Add-on (5 agents)", value: 540000000, stage: "Closed Won", status: "won" },
  { id: "d_003", name: "Expansion +50 seats", value: 1150000000, stage: "Negotiation", status: "open" },
];

const TICKETS: TicketSummary[] = [
  { id: "t_001", title: "API rate limit issue", priority: "high", status: "resolved", date: "2026-02-28" },
  { id: "t_002", title: "Dashboard loading slow", priority: "medium", status: "resolved", date: "2026-02-10" },
  { id: "t_003", title: "SSO configuration help", priority: "low", status: "resolved", date: "2026-01-22" },
];

const EVENT_ICONS: Record<string, { icon: typeof Mail; color: string }> = {
  deal: { icon: DollarSign, color: "text-green-500" },
  ticket: { icon: Ticket, color: "text-red-500" },
  email: { icon: Mail, color: "text-blue-500" },
  meeting: { icon: Calendar, color: "text-violet-500" },
  note: { icon: FileText, color: "text-amber-500" },
  milestone: { icon: CheckCircle2, color: "text-emerald-500" },
  alert: { icon: Zap, color: "text-orange-500" },
};

type Tab = "timeline" | "deals" | "tickets" | "engagement";

const CUSTOMERS_LIST = [
  { id: "cust_001", name: "TechViet Solutions", health: 82 },
  { id: "cust_002", name: "CloudFirst Global", health: 42 },
  { id: "cust_003", name: "Sakura Systems", health: 95 },
  { id: "cust_004", name: "SEA Digital Pte", health: 88 },
  { id: "cust_005", name: "EuroFinance AG", health: 65 },
];

/* ============================================================
 * Component
 * ============================================================ */
export function Customer360Page() {
  const [activeTab, setActiveTab] = useState<Tab>("timeline");
  const [selectedCustomer, setSelectedCustomer] = useState("cust_001");
  const c = CUSTOMER; // current customer data

  const tabs: { key: Tab; label: string }[] = [
    { key: "timeline", label: "Timeline" },
    { key: "deals", label: "Deals" },
    { key: "tickets", label: "Tickets" },
    { key: "engagement", label: "Engagement" },
  ];

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Eye className="w-6 h-6 text-indigo-600" /> Customer 360°
          </h1>
          <p className="text-gray-500 mt-0.5">Toàn cảnh khách hàng — profile, deals, tickets, timeline, health score</p>
        </div>
        <select value={selectedCustomer} onChange={(e) => { setSelectedCustomer(e.target.value); toast.info("Đổi khách hàng (mock)"); }}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white self-start">
          {CUSTOMERS_LIST.map((cl) => (
            <option key={cl.id} value={cl.id}>{cl.name} (Health: {cl.health})</option>
          ))}
        </select>
      </header>

      {/* Customer Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-start gap-4 flex-col sm:flex-row">
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-xl text-indigo-700 flex-shrink-0">
            {c.logo}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-gray-900">{c.name}</h2>
              <span className="text-[7px] px-1.5 py-0.5 bg-indigo-50 text-indigo-600 rounded border border-indigo-200">{c.plan}</span>
              <span className={`text-[7px] px-1.5 py-0.5 rounded border ${
                c.status === "active" ? "bg-green-50 text-green-600 border-green-200" :
                c.status === "at-risk" ? "bg-red-50 text-red-600 border-red-200" :
                "bg-gray-50 text-gray-500 border-gray-200"
              }`}>{c.status === "active" ? "Hoạt động" : c.status === "at-risk" ? "Rủi ro" : "Đã rời"}</span>
            </div>
            <p className="text-[9px] text-gray-500 mt-1">{c.industry} • {c.employees} nhân viên</p>
            <div className="flex items-center gap-4 mt-1.5 text-[9px] text-gray-400 flex-wrap">
              <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {c.website}</span>
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {c.phone}</span>
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {c.email}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {c.address}</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {c.tags.map((t) => <span key={t} className="text-[7px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{t}</span>)}
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4">
          <div className={`rounded-xl border p-2 text-center ${c.healthScore >= 70 ? "bg-green-50 border-green-200" : c.healthScore >= 40 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"}`}>
            <p className={`text-lg ${c.healthScore >= 70 ? "text-green-600" : c.healthScore >= 40 ? "text-amber-600" : "text-red-600"}`}>{c.healthScore}</p>
            <p className="text-[8px] text-gray-500">Health Score</p>
          </div>
          <div className="bg-violet-50 rounded-xl border border-violet-200 p-2 text-center">
            <p className="text-lg text-violet-600">+{c.nps}</p>
            <p className="text-[8px] text-violet-700">NPS</p>
          </div>
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-2 text-center">
            <p className="text-lg text-blue-600">{fmtVND(c.arr)}₫</p>
            <p className="text-[8px] text-blue-700">ARR</p>
          </div>
          <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-2 text-center">
            <p className="text-lg text-emerald-600">{fmtVND(c.ltv)}₫</p>
            <p className="text-[8px] text-emerald-700">LTV</p>
          </div>
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-2 text-center">
            <p className="text-lg text-amber-600">{c.activeUsers}/{c.userSeats}</p>
            <p className="text-[8px] text-amber-700">Active Users</p>
          </div>
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-2 text-center">
            <p className="text-lg text-gray-600">CSM</p>
            <p className="text-[8px] text-gray-500">{c.csm}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
              activeTab === t.key ? "bg-indigo-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* === Timeline Tab === */}
      {activeTab === "timeline" && (
        <div className="space-y-0">
          {TIMELINE.map((ev, idx) => {
            const ecfg = EVENT_ICONS[ev.type];
            const Icon = ecfg.icon;
            return (
              <div key={ev.id} className="flex items-start gap-3 pb-4">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-lg bg-white border border-gray-100 flex items-center justify-center ${ecfg.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  {idx < TIMELINE.length - 1 && <div className="w-px h-full bg-gray-200 mt-1 min-h-[20px]" />}
                </div>
                <div className="flex-1 min-w-0 bg-white rounded-xl border border-gray-100 p-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[8px] text-gray-400">{ev.date}</span>
                    <span className="text-[7px] px-1.5 py-0.5 bg-gray-50 text-gray-500 rounded border border-gray-200">{ev.type}</span>
                    <span className="text-[8px] text-gray-400 ml-auto">{ev.actor}</span>
                  </div>
                  <h4 className="text-sm text-gray-900 mt-0.5">{ev.title}</h4>
                  <p className="text-[9px] text-gray-500 mt-0.5">{ev.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === Deals Tab === */}
      {activeTab === "deals" && (
        <div className="space-y-2">
          {DEALS.map((d) => (
            <div key={d.id} className={`bg-white rounded-xl border p-4 ${d.status === "won" ? "border-green-200" : d.status === "open" ? "border-blue-200" : "border-red-200"}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900">{d.name}</span>
                    <span className={`text-[7px] px-1.5 py-0.5 rounded border ${
                      d.status === "won" ? "bg-green-50 text-green-600 border-green-200" :
                      d.status === "open" ? "bg-blue-50 text-blue-600 border-blue-200" :
                      "bg-red-50 text-red-600 border-red-200"
                    }`}>{d.status === "won" ? "Won" : d.status === "open" ? "Open" : "Lost"}</span>
                  </div>
                  <p className="text-[9px] text-gray-400 mt-0.5">Stage: {d.stage}</p>
                </div>
                <p className={`text-lg ${d.status === "won" ? "text-green-600" : d.status === "open" ? "text-blue-600" : "text-red-600"}`}>{fmtVND(d.value)}₫</p>
              </div>
            </div>
          ))}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 text-center">
            <p className="text-[9px] text-gray-500">Tổng LTV: <strong className="text-gray-900">{fmtVND(DEALS.reduce((s, d) => s + d.value, 0))}₫</strong> ({DEALS.filter((d) => d.status === "won").length} won, {DEALS.filter((d) => d.status === "open").length} open)</p>
          </div>
        </div>
      )}

      {/* === Tickets Tab === */}
      {activeTab === "tickets" && (
        <div className="space-y-2">
          {TICKETS.map((t) => (
            <div key={t.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-900">{t.title}</span>
                <span className={`text-[7px] px-1.5 py-0.5 rounded border ${
                  t.priority === "high" ? "bg-red-50 text-red-600 border-red-200" :
                  t.priority === "medium" ? "bg-amber-50 text-amber-600 border-amber-200" :
                  "bg-gray-50 text-gray-500 border-gray-200"
                }`}>{t.priority}</span>
                <span className="text-[7px] px-1.5 py-0.5 bg-green-50 text-green-600 rounded border border-green-200">✓ {t.status}</span>
                <span className="text-[8px] text-gray-400 ml-auto">{t.date}</span>
              </div>
            </div>
          ))}
          <div className="bg-green-50 rounded-xl border border-green-200 p-3 text-center">
            <p className="text-[9px] text-green-700">✓ Tất cả tickets đã resolved — Avg resolution time: 4.2 giờ</p>
          </div>
        </div>
      )}

      {/* === Engagement Tab === */}
      {activeTab === "engagement" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm text-gray-900 mb-3">Adoption Metrics</h3>
            {[
              { metric: "Daily Active Users", value: 72, total: 87, color: "bg-blue-400" },
              { metric: "Feature Adoption", value: 68, total: 100, color: "bg-violet-400" },
              { metric: "AI Features Usage", value: 45, total: 100, color: "bg-emerald-400" },
              { metric: "Mobile App Usage", value: 38, total: 100, color: "bg-amber-400" },
            ].map((m) => (
              <div key={m.metric} className="mb-2.5 last:mb-0">
                <div className="flex items-center justify-between text-[9px] mb-0.5">
                  <span className="text-gray-700">{m.metric}</span>
                  <span className="text-gray-500">{m.value}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.value}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm text-gray-900 mb-3">Engagement Score Trend</h3>
            <div className="space-y-2">
              {[
                { month: "Tháng 10/2025", score: 55, label: "Onboarding" },
                { month: "Tháng 11/2025", score: 68, label: "Ramp-up" },
                { month: "Tháng 12/2025", score: 75, label: "Adoption" },
                { month: "Tháng 01/2026", score: 80, label: "Active" },
                { month: "Tháng 02/2026", score: 82, label: "Mature" },
                { month: "Tháng 03/2026", score: 85, label: "Power User" },
              ].map((m) => (
                <div key={m.month} className="flex items-center gap-2">
                  <span className="text-[8px] text-gray-400 w-24">{m.month}</span>
                  <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-400 rounded-full" style={{ width: `${m.score}%` }} />
                  </div>
                  <span className="text-[8px] text-gray-500 w-10 text-right">{m.score}</span>
                  <span className="text-[7px] text-indigo-500 w-16">{m.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border border-indigo-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          <h4 className="text-sm text-indigo-900">AI Customer 360° Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-indigo-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span><strong>TechViet</strong> đang ở giai đoạn <strong>Power User</strong> — engagement score tăng liên tục 6 tháng (55→85). <strong>87/100 seats active</strong>. AI predict: sẽ cần <strong>upgrade lên 150 seats</strong> trong Q3/2026 (confidence: 88%).</span>
          </p>
          <p className="flex items-start gap-2">
            <Target className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <span><strong>Expansion opportunity: 1.15B₫</strong> (Deal #1042 đang Negotiation). CTO đã express interest cho <strong>AI Agent Add-on</strong>. AI suggest: schedule AI Agent demo trong tuần tới — tăng deal probability từ 72% → 85%.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>AI Features adoption mới ở <strong>45%</strong> — room for growth. Top unused: <strong>Predictive Analytics</strong> (0%), <strong>AI Email Writer</strong> (12%). AI suggest: tạo <strong>feature spotlight webinar</strong> cho TechViet team, ước tính tăng adoption lên 70%.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
