/**
 * Account Planning — Lập kế hoạch Tài khoản Chiến lược
 * Strategic account plans, white space analysis,
 * relationship mapping, growth opportunities, AI recommendations.
 */
import { useState, useMemo } from "react";
import {
  Map,
  Sparkles,
  Bot,
  Target,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Building2,
  Layers,
  Plus,
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

type AccountTier = "strategic" | "key" | "growth" | "standard";
type PlanStatus = "active" | "draft" | "review";

interface StrategicAccount {
  id: string;
  name: string;
  tier: AccountTier;
  industry: string;
  currentARR: number;
  potentialARR: number;
  whiteSpace: number;
  healthScore: number;
  nps: number;
  owner: string;
  planStatus: PlanStatus;
  objectives: string[];
  risks: string[];
  opportunities: string[];
  products: { name: string; adopted: boolean; potential: number }[];
  keyContacts: number;
  lastReview: string;
  nextQBR: string;
}

const TIER_CFG: Record<AccountTier, { label: string; color: string; bg: string; icon: string }> = {
  strategic: { label: "Strategic", color: "text-violet-600", bg: "bg-violet-50 border-violet-200", icon: "💎" },
  key: { label: "Key", color: "text-blue-600", bg: "bg-blue-50 border-blue-200", icon: "🔑" },
  growth: { label: "Growth", color: "text-green-600", bg: "bg-green-50 border-green-200", icon: "🌱" },
  standard: { label: "Standard", color: "text-gray-500", bg: "bg-gray-50 border-gray-200", icon: "📋" },
};

const MOCK_ACCOUNTS: StrategicAccount[] = [
  {
    id: "sa01", name: "Sakura Systems", tier: "strategic", industry: "Technology", currentARR: 4200000000, potentialARR: 8500000000, whiteSpace: 4300000000, healthScore: 88, nps: 9, owner: "Trần Minh Đức", planStatus: "active",
    objectives: ["Expand AI Agent adoption → 100% departments", "Cross-sell Data Platform (Q2)", "Executive sponsorship program"],
    risks: ["CTO retirement planned Q4/2026", "IT budget review Q3"],
    opportunities: ["Marketing dept chưa dùng sản phẩm (15 seats potential)", "Data Platform need (2.1B₫)", "AI Training service (800M₫)"],
    products: [
      { name: "CRM Enterprise", adopted: true, potential: 0 },
      { name: "AI Agents (5)", adopted: true, potential: 1200000000 },
      { name: "Data Platform", adopted: false, potential: 2100000000 },
      { name: "Marketing Suite", adopted: false, potential: 960000000 },
    ],
    keyContacts: 8, lastReview: "2026-02-28", nextQBR: "2026-04-15",
  },
  {
    id: "sa02", name: "TechViet Solutions", tier: "strategic", industry: "IT Services", currentARR: 2800000000, potentialARR: 6200000000, whiteSpace: 3400000000, healthScore: 82, nps: 8, owner: "Phạm Văn Khôi", planStatus: "active",
    objectives: ["Migrate legacy support system → CRM Tickets", "Deploy AI Copilot for CS team", "Land HQ + expand 3 branch offices"],
    risks: ["Competitor eval (Freshworks) for support module", "Budget freeze nếu revenue miss Q2"],
    opportunities: ["Support module (1.5B₫)", "Branch offices (3x = 2.4B₫)", "AI Copilot (480M₫)"],
    products: [
      { name: "CRM + Support Suite", adopted: true, potential: 0 },
      { name: "AI Copilot", adopted: false, potential: 480000000 },
      { name: "Branch Expansion", adopted: false, potential: 2400000000 },
    ],
    keyContacts: 6, lastReview: "2026-03-01", nextQBR: "2026-04-01",
  },
  {
    id: "sa03", name: "DataStream Corp", tier: "key", industry: "Data Analytics", currentARR: 1800000000, potentialARR: 3600000000, whiteSpace: 1800000000, healthScore: 75, nps: 7, owner: "Hoàng Thị Linh", planStatus: "review",
    objectives: ["Renew + expand license Q2", "Deploy predictive analytics module", "Executive alignment (new CRO)"],
    risks: ["New CRO chưa familiar với platform", "Usage decline 15% last month"],
    opportunities: ["Predictive Analytics add-on (900M₫)", "Additional 50 seats (600M₫)", "Custom integrations (300M₫)"],
    products: [
      { name: "Data Platform", adopted: true, potential: 0 },
      { name: "Predictive Analytics", adopted: false, potential: 900000000 },
      { name: "Seat Expansion", adopted: false, potential: 600000000 },
    ],
    keyContacts: 4, lastReview: "2026-02-20", nextQBR: "2026-03-20",
  },
  {
    id: "sa04", name: "SEA Digital Pte", tier: "key", industry: "E-commerce", currentARR: 540000000, potentialARR: 2400000000, whiteSpace: 1860000000, healthScore: 90, nps: 9, owner: "Phạm Văn Khôi", planStatus: "active",
    objectives: ["Upsell từ AI Agent add-on → full Enterprise suite", "Multi-country deployment (SG + TH + ID)", "Integration với Shopify"],
    risks: ["Ngân sách phụ thuộc vào performance Q1"],
    opportunities: ["Enterprise upgrade (1.2B₫)", "APAC expansion (3 countries)", "Shopify integration service"],
    products: [
      { name: "AI Agent Add-on", adopted: true, potential: 0 },
      { name: "CRM Enterprise", adopted: false, potential: 1200000000 },
      { name: "Multi-region", adopted: false, potential: 660000000 },
    ],
    keyContacts: 3, lastReview: "2026-03-02", nextQBR: "2026-04-10",
  },
  {
    id: "sa05", name: "NorthStar SaaS", tier: "growth", industry: "SaaS", currentARR: 960000000, potentialARR: 2000000000, whiteSpace: 1040000000, healthScore: 78, nps: 7, owner: "Nguyễn Thị Hương", planStatus: "draft",
    objectives: ["Expand từ Professional → Enterprise tier", "Deploy AI Agents for sales team", "Knowledge base migration"],
    risks: ["Team size nhỏ — decision process chậm", "CTO mới chưa quen platform"],
    opportunities: ["Enterprise upgrade (540M₫)", "AI Agents (360M₫)", "Knowledge Base (140M₫)"],
    products: [
      { name: "CRM Professional", adopted: true, potential: 0 },
      { name: "Enterprise Upgrade", adopted: false, potential: 540000000 },
      { name: "AI Agents", adopted: false, potential: 360000000 },
    ],
    keyContacts: 3, lastReview: "2026-02-15", nextQBR: "2026-03-30",
  },
];

type Tab = "accounts" | "white-space" | "objectives";

/* ============================================================
 * Component
 * ============================================================ */
export function AccountPlanningPage() {
  const [activeTab, setActiveTab] = useState<Tab>("accounts");
  const [tierFilter, setTierFilter] = useState<AccountTier | "all">("all");

  const filtered = useMemo(() => {
    let list = MOCK_ACCOUNTS;
    if (tierFilter !== "all") list = list.filter((a) => a.tier === tierFilter);
    return [...list].sort((a, b) => b.whiteSpace - a.whiteSpace);
  }, [tierFilter]);

  const stats = useMemo(() => {
    const totalCurrentARR = MOCK_ACCOUNTS.reduce((s, a) => s + a.currentARR, 0);
    const totalPotentialARR = MOCK_ACCOUNTS.reduce((s, a) => s + a.potentialARR, 0);
    const totalWhiteSpace = MOCK_ACCOUNTS.reduce((s, a) => s + a.whiteSpace, 0);
    const avgHealth = Math.round(MOCK_ACCOUNTS.reduce((s, a) => s + a.healthScore, 0) / MOCK_ACCOUNTS.length);
    const activeCount = MOCK_ACCOUNTS.filter((a) => a.planStatus === "active").length;
    return { totalCurrentARR, totalPotentialARR, totalWhiteSpace, avgHealth, activeCount };
  }, []);

  const tabs: { key: Tab; label: string }[] = [
    { key: "accounts", label: "Account Plans" },
    { key: "white-space", label: "White Space" },
    { key: "objectives", label: "Objectives" },
  ];

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Map className="w-6 h-6 text-emerald-600" /> Account Planning
          </h1>
          <p className="text-gray-500 mt-0.5">Kế hoạch tài khoản chiến lược — white space, opportunities, growth mapping</p>
        </div>
        <button type="button" onClick={() => toast.success("AI đang phân tích white space opportunities...")}
          className="flex items-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 self-start">
          <Sparkles className="w-4 h-4" /> AI White Space
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-2.5 text-center">
          <p className="text-lg text-emerald-600">{fmtVND(stats.totalCurrentARR)}₫</p>
          <p className="text-[9px] text-emerald-700">Current ARR</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{fmtVND(stats.totalPotentialARR)}₫</p>
          <p className="text-[9px] text-blue-700">Potential ARR</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-2.5 text-center">
          <p className="text-lg text-amber-600">{fmtVND(stats.totalWhiteSpace)}₫</p>
          <p className="text-[9px] text-amber-700">White Space</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{stats.avgHealth}</p>
          <p className="text-[9px] text-green-700">Avg Health</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-2.5 text-center">
          <p className="text-lg text-violet-600">{stats.activeCount}/{MOCK_ACCOUNTS.length}</p>
          <p className="text-[9px] text-violet-700">Active Plans</p>
        </div>
      </div>

      {/* Tabs + Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          {tabs.map((t) => (
            <button key={t.key} type="button" onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
                activeTab === t.key ? "bg-emerald-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
              }`}>{t.label}</button>
          ))}
        </div>
        <select value={tierFilter} onChange={(e) => setTierFilter(e.target.value as AccountTier | "all")}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white ml-auto">
          <option value="all">Tất cả Tiers</option>
          {Object.entries(TIER_CFG).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
        </select>
      </div>

      {/* === Accounts Tab === */}
      {activeTab === "accounts" && (
        <div className="space-y-3">
          {filtered.map((a) => {
            const tier = TIER_CFG[a.tier];
            const expansion = Math.round((a.whiteSpace / a.currentARR) * 100);
            return (
              <div key={a.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span className="text-sm text-gray-900">{a.name}</span>
                  <span className={`text-[7px] px-1.5 py-0.5 rounded border ${tier.bg} ${tier.color}`}>{tier.icon} {tier.label}</span>
                  <span className="text-[7px] px-1.5 py-0.5 bg-gray-50 text-gray-500 rounded border border-gray-200">{a.industry}</span>
                  <span className={`text-[7px] px-1.5 py-0.5 rounded border ${
                    a.planStatus === "active" ? "bg-green-50 text-green-600 border-green-200" :
                    a.planStatus === "review" ? "bg-amber-50 text-amber-600 border-amber-200" :
                    "bg-gray-50 text-gray-500 border-gray-200"
                  }`}>{a.planStatus}</span>
                </div>

                {/* ARR Bars */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <div className="flex items-center justify-between text-[8px] mb-0.5">
                      <span className="text-gray-400">ARR: {fmtVND(a.currentARR)}₫ / {fmtVND(a.potentialARR)}₫</span>
                      <span className="text-emerald-600">{Math.round((a.currentARR / a.potentialARR) * 100)}% penetration</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex">
                      <div className="h-full bg-emerald-400" style={{ width: `${(a.currentARR / a.potentialARR) * 100}%` }} />
                      <div className="h-full bg-amber-300" style={{ width: `${(a.whiteSpace / a.potentialARR) * 100}%` }} />
                    </div>
                    <div className="flex items-center gap-3 text-[7px] text-gray-400 mt-0.5">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-emerald-400 rounded" /> Current</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 bg-amber-300 rounded" /> White Space: {fmtVND(a.whiteSpace)}₫</span>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[8px] mb-0.5">
                      <span className="text-gray-400">Health Score</span>
                      <span className={a.healthScore >= 80 ? "text-green-600" : "text-amber-600"}>{a.healthScore}/100 | NPS: {a.nps}</span>
                    </div>
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${a.healthScore >= 80 ? "bg-green-400" : "bg-amber-400"}`}
                        style={{ width: `${a.healthScore}%` }} />
                    </div>
                  </div>
                </div>

                {/* Products */}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {a.products.map((p) => (
                    <span key={p.name} className={`text-[7px] px-1.5 py-0.5 rounded border ${
                      p.adopted ? "bg-green-50 text-green-600 border-green-200" : "bg-amber-50 text-amber-600 border-amber-200"
                    }`}>{p.adopted ? "✓" : "○"} {p.name} {!p.adopted && p.potential > 0 ? `(${fmtVND(p.potential)}₫)` : ""}</span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-[8px] text-gray-400 flex-wrap">
                  <span>👤 {a.owner}</span>
                  <span>👥 {a.keyContacts} contacts</span>
                  <span>📅 Last review: {a.lastReview}</span>
                  <span>📋 Next QBR: {a.nextQBR}</span>
                  <span className="text-amber-600">📈 Expansion potential: +{expansion}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === White Space Tab === */}
      {activeTab === "white-space" && (
        <div className="space-y-2">
          {MOCK_ACCOUNTS.sort((a, b) => b.whiteSpace - a.whiteSpace).map((a) => {
            const tier = TIER_CFG[a.tier];
            return (
              <div key={a.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm text-gray-900">{tier.icon} {a.name}</span>
                  <span className="text-sm text-amber-600 ml-auto">{fmtVND(a.whiteSpace)}₫ white space</span>
                </div>
                <div className="space-y-1.5">
                  {a.products.filter((p) => !p.adopted && p.potential > 0).map((p) => (
                    <div key={p.name} className="flex items-center gap-3">
                      <span className="text-[9px] text-gray-600 w-40">{p.name}</span>
                      <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${Math.min((p.potential / a.whiteSpace) * 100, 100)}%` }} />
                      </div>
                      <span className="text-[9px] text-amber-600 w-16 text-right">{fmtVND(p.potential)}₫</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-3 text-center">
            <p className="text-sm text-amber-800">Tổng White Space: <strong>{fmtVND(stats.totalWhiteSpace)}₫</strong> — expansion potential <strong>{Math.round((stats.totalWhiteSpace / stats.totalCurrentARR) * 100)}%</strong> trên base hiện tại</p>
          </div>
        </div>
      )}

      {/* === Objectives Tab === */}
      {activeTab === "objectives" && (
        <div className="space-y-3">
          {MOCK_ACCOUNTS.map((a) => {
            const tier = TIER_CFG[a.tier];
            return (
              <div key={a.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <h3 className="text-sm text-gray-900 mb-2">{tier.icon} {a.name}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <p className="text-[8px] text-blue-600 mb-1">🎯 Mục tiêu</p>
                    {a.objectives.map((o) => (
                      <p key={o} className="text-[9px] text-gray-600 flex items-start gap-1 mb-0.5">
                        <span className="text-blue-400">▸</span> {o}
                      </p>
                    ))}
                  </div>
                  <div>
                    <p className="text-[8px] text-green-600 mb-1">💡 Cơ hội</p>
                    {a.opportunities.map((o) => (
                      <p key={o} className="text-[9px] text-gray-600 flex items-start gap-1 mb-0.5">
                        <span className="text-green-400">▸</span> {o}
                      </p>
                    ))}
                  </div>
                  <div>
                    <p className="text-[8px] text-red-500 mb-1">⚠ Rủi ro</p>
                    {a.risks.map((r) => (
                      <p key={r} className="text-[9px] text-gray-600 flex items-start gap-1 mb-0.5">
                        <span className="text-red-400">▸</span> {r}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Summary */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <h4 className="text-sm text-emerald-900">AI Account Planning Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-emerald-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Tổng <strong>white space 12.4B₫</strong> trên 5 strategic accounts — expansion potential <strong>+120%</strong>. AI recommend: tập trung <strong>Sakura Systems</strong> (4.3B₫ white space) — <strong>Data Platform deal 2.1B₫</strong> có highest probability (85%).</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span><strong>DataStream Corp</strong> — health score giảm, usage decline 15%. <strong>CRO mới</strong> chưa engaged. AI suggest: <strong>emergency QBR trước 20/03</strong> + executive alignment meeting. Risk: <strong>1.8B₫ ARR</strong> nếu không can thiệp.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span><strong>SEA Digital</strong> — highest NPS (9), lowest ARR. AI detect: <strong>APAC expansion signal</strong> (hiring in Thailand + Indonesia). If land Enterprise upgrade + multi-region: <strong>+1.86B₫ ARR</strong>. Timing: <strong>propose Q2 before budget lock</strong>.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
