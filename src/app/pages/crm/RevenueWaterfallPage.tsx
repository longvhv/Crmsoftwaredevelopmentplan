/**
 * Revenue Waterfall — Phân tích dòng chảy Doanh thu
 * ARR movement: new, expansion, contraction, churn,
 * reactivation, net movement, cohort analysis.
 */
import { useState, useMemo } from "react";
import {
  ArrowDownToLine,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Bot,
  DollarSign,
  Plus,
  Minus,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
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

type MovementType = "new" | "expansion" | "contraction" | "churn" | "reactivation";

interface WaterfallPeriod {
  period: string;
  startingARR: number;
  newBusiness: number;
  expansion: number;
  contraction: number;
  churn: number;
  reactivation: number;
  endingARR: number;
}

interface MovementDetail {
  id: string;
  customer: string;
  type: MovementType;
  amount: number;
  reason: string;
  date: string;
}

const TYPE_CFG: Record<MovementType, { label: string; icon: string; color: string; bg: string }> = {
  new: { label: "New Business", icon: "🆕", color: "text-green-600", bg: "bg-green-50 border-green-200" },
  expansion: { label: "Expansion", icon: "📈", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  contraction: { label: "Contraction", icon: "📉", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  churn: { label: "Churn", icon: "🚪", color: "text-red-600", bg: "bg-red-50 border-red-200" },
  reactivation: { label: "Reactivation", icon: "🔄", color: "text-violet-600", bg: "bg-violet-50 border-violet-200" },
};

const WATERFALL_DATA: WaterfallPeriod[] = [
  { period: "Q3/2025", startingARR: 28000000000, newBusiness: 5200000000, expansion: 2800000000, contraction: -800000000, churn: -1500000000, reactivation: 400000000, endingARR: 34100000000 },
  { period: "Q4/2025", startingARR: 34100000000, newBusiness: 6800000000, expansion: 3500000000, contraction: -1200000000, churn: -2100000000, reactivation: 600000000, endingARR: 41700000000 },
  { period: "Q1/2026", startingARR: 41700000000, newBusiness: 8500000000, expansion: 4200000000, contraction: -900000000, churn: -1800000000, reactivation: 800000000, endingARR: 52500000000 },
];

const MOVEMENT_DETAILS: MovementDetail[] = [
  { id: "m01", customer: "TechViet Solutions", type: "expansion", amount: 1150000000, reason: "+50 seats Enterprise", date: "2026-03-01" },
  { id: "m02", customer: "Sakura Systems", type: "new", amount: 4200000000, reason: "Enterprise CRM + AI Agents", date: "2026-02-28" },
  { id: "m03", customer: "SEA Digital Pte", type: "expansion", amount: 540000000, reason: "AI Agent Add-on (5 agents)", date: "2026-03-01" },
  { id: "m04", customer: "NorthStar SaaS", type: "new", amount: 960000000, reason: "Professional 50 seats", date: "2026-02-25" },
  { id: "m05", customer: "DataStream Corp", type: "new", amount: 1800000000, reason: "Data Platform License", date: "2026-02-22" },
  { id: "m06", customer: "TechViet Solutions", type: "expansion", amount: 2800000000, reason: "CRM + Support Suite initial", date: "2026-01-20" },
  { id: "m07", customer: "OceanView Corp", type: "churn", amount: -2100000000, reason: "Không gia hạn — internal restructuring", date: "2026-02-05" },
  { id: "m08", customer: "SmallBiz Solutions", type: "contraction", amount: -450000000, reason: "Downgrade Enterprise → Professional (giảm 30 seats)", date: "2026-02-15" },
  { id: "m09", customer: "Alpine Solutions GmbH", type: "contraction", amount: -350000000, reason: "Remove AI Agent add-on (chuyển sang Pipedrive)", date: "2026-01-30" },
  { id: "m10", customer: "ReturnCo Inc", type: "reactivation", amount: 520000000, reason: "Quay lại sau 6 tháng — CRM Professional 20 seats", date: "2026-02-18" },
  { id: "m11", customer: "GlobalHealth Pte", type: "reactivation", amount: 280000000, reason: "Reactivate Starter plan", date: "2026-03-02" },
  { id: "m12", customer: "OldTech Ltd", type: "churn", amount: -680000000, reason: "Chuyển sang HubSpot — giá rẻ hơn", date: "2026-01-25" },
];

type Tab = "waterfall" | "details" | "cohort";

/* ============================================================
 * Component
 * ============================================================ */
export function RevenueWaterfallPage() {
  const [activeTab, setActiveTab] = useState<Tab>("waterfall");
  const [typeFilter, setTypeFilter] = useState<MovementType | "all">("all");

  const filteredDetails = useMemo(() => {
    if (typeFilter === "all") return MOVEMENT_DETAILS;
    return MOVEMENT_DETAILS.filter((m) => m.type === typeFilter);
  }, [typeFilter]);

  const currentQ = WATERFALL_DATA[WATERFALL_DATA.length - 1];
  const prevQ = WATERFALL_DATA[WATERFALL_DATA.length - 2];
  const netMovement = currentQ.endingARR - currentQ.startingARR;
  const growthRate = Math.round(((currentQ.endingARR - prevQ.endingARR) / prevQ.endingARR) * 100);
  const netRetention = Math.round(((currentQ.endingARR - currentQ.newBusiness) / currentQ.startingARR) * 100);
  const grossRetention = Math.round(((currentQ.startingARR + currentQ.contraction + currentQ.churn) / currentQ.startingARR) * 100);

  const tabs: { key: Tab; label: string }[] = [
    { key: "waterfall", label: "Waterfall" },
    { key: "details", label: "Chi tiết" },
    { key: "cohort", label: "Cohort" },
  ];

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <ArrowDownToLine className="w-6 h-6 text-cyan-600" /> Revenue Waterfall
          </h1>
          <p className="text-gray-500 mt-0.5">Dòng chảy doanh thu — ARR movement, net retention, cohort analysis</p>
        </div>
        <button type="button" onClick={() => toast.success("AI đang phân tích revenue pattern...")}
          className="flex items-center gap-1 px-3 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 self-start">
          <Sparkles className="w-4 h-4" /> AI Phân tích
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <div className="bg-cyan-50 rounded-xl border border-cyan-200 p-2.5 text-center">
          <p className="text-lg text-cyan-600">{fmtVND(currentQ.endingARR)}₫</p>
          <p className="text-[9px] text-cyan-700">Current ARR</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">+{fmtVND(netMovement)}₫</p>
          <p className="text-[9px] text-green-700">Net New Q1</p>
        </div>
        <div className={`rounded-xl border p-2.5 text-center ${growthRate >= 20 ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
          <p className={`text-lg ${growthRate >= 20 ? "text-emerald-600" : "text-amber-600"}`}>+{growthRate}%</p>
          <p className="text-[9px] text-gray-500">QoQ Growth</p>
        </div>
        <div className={`rounded-xl border p-2.5 text-center ${netRetention >= 110 ? "bg-green-50 border-green-200" : netRetention >= 100 ? "bg-blue-50 border-blue-200" : "bg-red-50 border-red-200"}`}>
          <p className={`text-lg ${netRetention >= 110 ? "text-green-600" : netRetention >= 100 ? "text-blue-600" : "text-red-600"}`}>{netRetention}%</p>
          <p className="text-[9px] text-gray-500">Net Retention</p>
        </div>
        <div className={`rounded-xl border p-2.5 text-center ${grossRetention >= 90 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
          <p className={`text-lg ${grossRetention >= 90 ? "text-green-600" : "text-amber-600"}`}>{grossRetention}%</p>
          <p className="text-[9px] text-gray-500">Gross Retention</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
              activeTab === t.key ? "bg-cyan-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>{t.label}</button>
        ))}
      </div>

      {/* === Waterfall Tab === */}
      {activeTab === "waterfall" && (
        <div className="space-y-3">
          {WATERFALL_DATA.map((q) => {
            const net = q.endingARR - q.startingARR;
            const maxVal = Math.max(q.newBusiness, q.expansion, Math.abs(q.churn), Math.abs(q.contraction), q.reactivation);
            const barScale = (v: number) => `${Math.min(Math.round((Math.abs(v) / maxVal) * 100), 100)}%`;
            return (
              <div key={q.period} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm text-gray-900">{q.period}</h3>
                  <div className="flex items-center gap-3 text-[9px]">
                    <span className="text-gray-400">Start: {fmtVND(q.startingARR)}₫</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-gray-700">End: <strong>{fmtVND(q.endingARR)}₫</strong></span>
                    <span className={net >= 0 ? "text-green-600" : "text-red-600"}>({net >= 0 ? "+" : ""}{fmtVND(net)}₫)</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {/* New */}
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] text-gray-500 w-24">🆕 New Business</span>
                    <div className="flex-1 h-4 bg-gray-50 rounded-full overflow-hidden">
                      <div className="h-full bg-green-400 rounded-full" style={{ width: barScale(q.newBusiness) }} />
                    </div>
                    <span className="text-[9px] text-green-600 w-20 text-right">+{fmtVND(q.newBusiness)}₫</span>
                  </div>
                  {/* Expansion */}
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] text-gray-500 w-24">📈 Expansion</span>
                    <div className="flex-1 h-4 bg-gray-50 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full" style={{ width: barScale(q.expansion) }} />
                    </div>
                    <span className="text-[9px] text-blue-600 w-20 text-right">+{fmtVND(q.expansion)}₫</span>
                  </div>
                  {/* Contraction */}
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] text-gray-500 w-24">📉 Contraction</span>
                    <div className="flex-1 h-4 bg-gray-50 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-400 rounded-full" style={{ width: barScale(q.contraction) }} />
                    </div>
                    <span className="text-[9px] text-amber-600 w-20 text-right">{fmtVND(q.contraction)}₫</span>
                  </div>
                  {/* Churn */}
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] text-gray-500 w-24">🚪 Churn</span>
                    <div className="flex-1 h-4 bg-gray-50 rounded-full overflow-hidden">
                      <div className="h-full bg-red-400 rounded-full" style={{ width: barScale(q.churn) }} />
                    </div>
                    <span className="text-[9px] text-red-600 w-20 text-right">{fmtVND(q.churn)}₫</span>
                  </div>
                  {/* Reactivation */}
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] text-gray-500 w-24">🔄 Reactivation</span>
                    <div className="flex-1 h-4 bg-gray-50 rounded-full overflow-hidden">
                      <div className="h-full bg-violet-400 rounded-full" style={{ width: barScale(q.reactivation) }} />
                    </div>
                    <span className="text-[9px] text-violet-600 w-20 text-right">+{fmtVND(q.reactivation)}₫</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === Details Tab === */}
      {activeTab === "details" && (
        <>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as MovementType | "all")}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
            <option value="all">Tất cả ({MOVEMENT_DETAILS.length})</option>
            {Object.entries(TYPE_CFG).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
          </select>
          <div className="space-y-2">
            {filteredDetails.map((m) => {
              const cfg = TYPE_CFG[m.type];
              const isPositive = m.amount > 0;
              return (
                <div key={m.id} className={`bg-white rounded-xl border p-3 ${isPositive ? "border-green-100" : "border-red-100"}`}>
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{cfg.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-900">{m.customer}</span>
                        <span className={`text-[7px] px-1.5 py-0.5 rounded border ${cfg.bg} ${cfg.color}`}>{cfg.label}</span>
                      </div>
                      <p className="text-[9px] text-gray-500 mt-0.5">{m.reason}</p>
                      <p className="text-[8px] text-gray-400">{m.date}</p>
                    </div>
                    <span className={`text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
                      {isPositive ? "+" : ""}{fmtVND(m.amount)}₫
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* === Cohort Tab === */}
      {activeTab === "cohort" && (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-900 mb-3">Revenue Retention Cohort (% ARR retained)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-[8px]">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100">
                  <th className="text-left py-1.5 pr-3">Cohort</th>
                  <th className="text-center py-1.5 px-2">Month 0</th>
                  <th className="text-center py-1.5 px-2">Month 3</th>
                  <th className="text-center py-1.5 px-2">Month 6</th>
                  <th className="text-center py-1.5 px-2">Month 9</th>
                  <th className="text-center py-1.5 px-2">Month 12</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { cohort: "Q1/2025", values: [100, 95, 92, 105, 112] },
                  { cohort: "Q2/2025", values: [100, 96, 94, 108, null] },
                  { cohort: "Q3/2025", values: [100, 97, 98, null, null] },
                  { cohort: "Q4/2025", values: [100, 94, null, null, null] },
                  { cohort: "Q1/2026", values: [100, null, null, null, null] },
                ].map((row) => (
                  <tr key={row.cohort} className="border-b border-gray-50">
                    <td className="py-2 pr-3 text-gray-700">{row.cohort}</td>
                    {row.values.map((v, i) => (
                      <td key={i} className="text-center py-2 px-2">
                        {v === null ? (
                          <span className="text-gray-300">—</span>
                        ) : (
                          <span className={`px-2 py-0.5 rounded ${
                            v >= 110 ? "bg-green-100 text-green-700" :
                            v >= 100 ? "bg-blue-100 text-blue-700" :
                            v >= 90 ? "bg-amber-100 text-amber-700" :
                            "bg-red-100 text-red-700"
                          }`}>{v}%</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-4 mt-3 text-[7px] text-gray-400">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-100 rounded" /> ≥110% (expansion)</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-blue-100 rounded" /> 100-109%</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-100 rounded" /> 90-99%</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-100 rounded" /> &lt;90%</span>
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-cyan-50 to-sky-50 rounded-xl border border-cyan-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-cyan-600" />
          <h4 className="text-sm text-cyan-900">AI Revenue Waterfall Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-cyan-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>ARR tăng <strong>+26% QoQ</strong> (41.7B → 52.5B₫). <strong>New business là driver chính</strong> (8.5B₫, +25% vs Q4). Expansion cũng tăng mạnh (+20%, 4.2B₫). Trajectory: nếu maintain pace, <strong>EOY 2026 ARR ≈ 85B₫</strong>.</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span><strong>Net Retention {netRetention}%</strong> — tốt nhưng <strong>Gross Retention chỉ {grossRetention}%</strong>. Churn Q1 ({fmtVND(Math.abs(currentQ.churn))}₫) chủ yếu từ <strong>OceanView Corp (restructuring)</strong>. AI predict: <strong>2 accounts at-risk</strong> nữa Q2 nếu không can thiệp — tiềm năng churn <strong>1.4B₫</strong>.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span><strong>Cohort Q1/2025</strong> đạt <strong>112% retention</strong> sau 12 tháng — best cohort. Pattern: onboarding &lt; 45 ngày + CSM dedicated + AI Agent adoption. AI suggest: áp dụng playbook này cho <strong>Q4/2025 cohort</strong> (đang chỉ 94%) — cần <strong>emergency intervention</strong>.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
