/**
 * Revenue Intelligence — Phân tích doanh thu đa chiều
 * Multi-touch attribution, revenue waterfall, cohort analysis,
 * MRR/ARR tracking, churn revenue, expansion revenue.
 */
import { useState, useMemo } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Bot,
  AlertTriangle,
  BarChart3,
  PieChart,
  Target,
  Users,
  Zap,
  Calendar,
  Layers,
  RefreshCw,
  Download,
  Filter,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
type Period = "month" | "quarter" | "year";
type Tab = "overview" | "waterfall" | "cohort" | "attribution";

interface RevenueMetric {
  label: string;
  value: number;
  prevValue: number;
  format: "currency" | "percent" | "number";
  color: string;
}

interface WaterfallItem {
  label: string;
  value: number;
  type: "positive" | "negative" | "total";
  color: string;
}

interface CohortRow {
  cohort: string;
  customers: number;
  months: number[];
}

interface TouchPoint {
  channel: string;
  firstTouch: number;
  lastTouch: number;
  linear: number;
  timeDecay: number;
  revenue: number;
  deals: number;
  color: string;
}

/* ============================================================
 * Helpers
 * ============================================================ */
const fmtMoney = (n: number): string => {
  if (Math.abs(n) >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (Math.abs(n) >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return n.toLocaleString("vi-VN");
};

const fmtValue = (v: number, fmt: "currency" | "percent" | "number") => {
  if (fmt === "currency") return `${fmtMoney(v)}đ`;
  if (fmt === "percent") return `${v.toFixed(1)}%`;
  return fmtMoney(v);
};

const changePercent = (curr: number, prev: number) =>
  prev === 0 ? 0 : ((curr - prev) / prev) * 100;

/* ============================================================
 * Mock Data
 * ============================================================ */
const METRICS: RevenueMetric[] = [
  { label: "MRR", value: 2_850_000_000, prevValue: 2_620_000_000, format: "currency", color: "text-emerald-600" },
  { label: "ARR", value: 34_200_000_000, prevValue: 31_440_000_000, format: "currency", color: "text-blue-600" },
  { label: "ARPU", value: 18_900_000, prevValue: 17_600_000, format: "currency", color: "text-violet-600" },
  { label: "Net Revenue Retention", value: 118.5, prevValue: 112.3, format: "percent", color: "text-amber-600" },
  { label: "Gross Margin", value: 82.3, prevValue: 80.1, format: "percent", color: "text-cyan-600" },
  { label: "CAC Payback (tháng)", value: 8.2, prevValue: 9.5, format: "number", color: "text-orange-600" },
];

const WATERFALL: WaterfallItem[] = [
  { label: "MRR Đầu kỳ", value: 2_620_000_000, type: "total", color: "bg-gray-400" },
  { label: "New Business", value: 380_000_000, type: "positive", color: "bg-emerald-500" },
  { label: "Expansion", value: 210_000_000, type: "positive", color: "bg-blue-500" },
  { label: "Reactivation", value: 45_000_000, type: "positive", color: "bg-violet-500" },
  { label: "Contraction", value: -95_000_000, type: "negative", color: "bg-amber-500" },
  { label: "Churn", value: -310_000_000, type: "negative", color: "bg-red-500" },
  { label: "MRR Cuối kỳ", value: 2_850_000_000, type: "total", color: "bg-emerald-600" },
];

const COHORTS: CohortRow[] = [
  { cohort: "T9/2025", customers: 45, months: [100, 91, 84, 78, 73, 70] },
  { cohort: "T10/2025", customers: 52, months: [100, 88, 81, 75, 71] },
  { cohort: "T11/2025", customers: 61, months: [100, 92, 86, 80] },
  { cohort: "T12/2025", customers: 48, months: [100, 89, 83] },
  { cohort: "T1/2026", customers: 67, months: [100, 94] },
  { cohort: "T2/2026", customers: 73, months: [100] },
];

const TOUCHPOINTS: TouchPoint[] = [
  { channel: "Google Ads", firstTouch: 28.5, lastTouch: 12.3, linear: 18.2, timeDecay: 15.8, revenue: 8_120_000_000, deals: 42, color: "bg-blue-500" },
  { channel: "LinkedIn Ads", firstTouch: 22.1, lastTouch: 8.5, linear: 14.8, timeDecay: 12.1, revenue: 6_350_000_000, deals: 31, color: "bg-cyan-500" },
  { channel: "Content Marketing", firstTouch: 18.3, lastTouch: 15.2, linear: 16.5, timeDecay: 16.8, revenue: 5_680_000_000, deals: 38, color: "bg-emerald-500" },
  { channel: "Email Nurture", firstTouch: 5.2, lastTouch: 25.8, linear: 15.8, timeDecay: 20.3, revenue: 5_120_000_000, deals: 35, color: "bg-violet-500" },
  { channel: "Referral", firstTouch: 12.8, lastTouch: 18.5, linear: 15.2, timeDecay: 16.5, revenue: 4_850_000_000, deals: 28, color: "bg-amber-500" },
  { channel: "Webinar", firstTouch: 8.4, lastTouch: 10.2, linear: 9.5, timeDecay: 9.8, revenue: 2_380_000_000, deals: 15, color: "bg-pink-500" },
  { channel: "Direct / Organic", firstTouch: 4.7, lastTouch: 9.5, linear: 10.0, timeDecay: 8.7, revenue: 1_700_000_000, deals: 12, color: "bg-gray-500" },
];

const MONTHLY_REVENUE = [
  { month: "T9", newBiz: 320, expansion: 150, churn: -180, net: 290 },
  { month: "T10", newBiz: 350, expansion: 170, churn: -200, net: 320 },
  { month: "T11", newBiz: 310, expansion: 190, churn: -220, net: 280 },
  { month: "T12", newBiz: 380, expansion: 200, churn: -190, net: 390 },
  { month: "T1", newBiz: 420, expansion: 220, churn: -250, net: 390 },
  { month: "T2", newBiz: 380, expansion: 210, churn: -310, net: 280 },
];

/* ============================================================
 * Revenue Bar (inline mini chart)
 * ============================================================ */
function MiniBar({ value, max, color }: { value: number; max: number; color: string }) {
  const w = max > 0 ? (Math.abs(value) / max) * 100 : 0;
  return (
    <div className="h-4 bg-gray-100 rounded overflow-hidden">
      <div className={`h-full rounded ${color}`} style={{ width: `${w}%` }} />
    </div>
  );
}

/* ============================================================
 * Main Page
 * ============================================================ */
export function RevenueIntelligencePage() {
  const [period, setPeriod] = useState<Period>("month");
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const tabs: { key: Tab; label: string; icon: typeof BarChart3 }[] = [
    { key: "overview", label: "Tổng quan", icon: BarChart3 },
    { key: "waterfall", label: "MRR Waterfall", icon: Layers },
    { key: "cohort", label: "Cohort Retention", icon: Users },
    { key: "attribution", label: "Attribution", icon: Target },
  ];

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-600" /> Revenue Intelligence
          </h1>
          <p className="text-gray-500 mt-0.5">
            Phân tích doanh thu đa chiều — MRR/ARR, Waterfall, Cohort Retention, Multi-touch Attribution
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select value={period} onChange={(e) => setPeriod(e.target.value as Period)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm nay</option>
          </select>
          <button type="button" onClick={() => toast.success("Đã xuất báo cáo Revenue Intelligence")}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" /> Xuất
          </button>
        </div>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {METRICS.map((m) => {
          const chg = changePercent(m.value, m.prevValue);
          const up = chg >= 0;
          // CAC Payback giảm = tốt
          const positive = m.label.includes("CAC") ? !up : up;
          return (
            <div key={m.label} className="bg-white rounded-xl border border-gray-100 p-3">
              <p className="text-[9px] text-gray-400 mb-1">{m.label}</p>
              <p className={`text-lg ${m.color}`}>{fmtValue(m.value, m.format)}</p>
              <span className={`text-[9px] flex items-center gap-0.5 mt-0.5 ${positive ? "text-green-600" : "text-red-600"}`}>
                {up ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                {Math.abs(chg).toFixed(1)}% vs kỳ trước
              </span>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              activeTab === t.key ? "bg-emerald-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* === Overview === */}
      {activeTab === "overview" && (
        <div className="space-y-4">
          {/* Monthly Trend */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm text-gray-900 mb-3">Xu hướng Doanh thu 6 tháng (triệu đ)</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-[9px]">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100">
                    <th className="text-left py-2 pr-3">Tháng</th>
                    <th className="text-right py-2 px-2">New Business</th>
                    <th className="text-right py-2 px-2">Expansion</th>
                    <th className="text-right py-2 px-2">Churn</th>
                    <th className="text-right py-2 pl-2">Net Change</th>
                  </tr>
                </thead>
                <tbody>
                  {MONTHLY_REVENUE.map((r) => (
                    <tr key={r.month} className="border-b border-gray-50">
                      <td className="py-2 pr-3 text-gray-700">{r.month}</td>
                      <td className="text-right py-2 px-2 text-emerald-600">+{r.newBiz}M</td>
                      <td className="text-right py-2 px-2 text-blue-600">+{r.expansion}M</td>
                      <td className="text-right py-2 px-2 text-red-600">{r.churn}M</td>
                      <td className={`text-right py-2 pl-2 ${r.net >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                        {r.net >= 0 ? "+" : ""}{r.net}M
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Revenue Breakdown visual bars */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm text-gray-900 mb-3">Phân bổ MRR theo loại</h3>
            {[
              { label: "New Business", value: 380, pct: 59.7, color: "bg-emerald-500" },
              { label: "Expansion", value: 210, pct: 33.0, color: "bg-blue-500" },
              { label: "Reactivation", value: 45, pct: 7.1, color: "bg-violet-500" },
            ].map((item) => (
              <div key={item.label} className="mb-2">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] text-gray-600">{item.label}</span>
                  <span className="text-[10px] text-gray-900">+{item.value}M ({item.pct}%)</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
            <div className="mt-3 pt-3 border-t border-gray-100">
              {[
                { label: "Contraction", value: -95, pct: 23.5, color: "bg-amber-500" },
                { label: "Churn", value: -310, pct: 76.5, color: "bg-red-500" },
              ].map((item) => (
                <div key={item.label} className="mb-2">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] text-gray-600">{item.label}</span>
                    <span className="text-[10px] text-red-600">{item.value}M ({item.pct}%)</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* === Waterfall === */}
      {activeTab === "waterfall" && (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-900 mb-3">MRR Waterfall — Tháng 2/2026</h3>
          <p className="text-[10px] text-gray-400 mb-4">
            Phân tích biến động MRR: từ đầu kỳ → New Business + Expansion + Reactivation – Contraction – Churn → cuối kỳ.
          </p>
          <div className="space-y-2">
            {WATERFALL.map((item) => {
              const maxVal = Math.max(...WATERFALL.map((w) => Math.abs(w.value)));
              const barW = (Math.abs(item.value) / maxVal) * 100;
              return (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-28 flex-shrink-0 text-right">
                    <span className="text-[10px] text-gray-600">{item.label}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="h-7 bg-gray-50 rounded relative overflow-hidden">
                      <div className={`h-full rounded ${item.color} flex items-center justify-end pr-2`}
                        style={{ width: `${barW}%` }}>
                        <span className="text-[8px] text-white whitespace-nowrap">
                          {item.value >= 0 ? "+" : ""}{fmtMoney(item.value)}đ
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-10 flex-shrink-0">
                    {item.type === "positive" && <ArrowUpRight className="w-4 h-4 text-emerald-500" />}
                    {item.type === "negative" && <ArrowDownRight className="w-4 h-4 text-red-500" />}
                    {item.type === "total" && <BarChart3 className="w-4 h-4 text-gray-400" />}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
            <p className="text-[10px] text-emerald-700">
              <strong>Net MRR Growth:</strong> +{fmtMoney(230_000_000)}đ (+8.8%) • New Business chiếm 59.7% tăng trưởng • Churn rate 11.8% (mục tiêu &lt;10%)
            </p>
          </div>
        </div>
      )}

      {/* === Cohort Retention === */}
      {activeTab === "cohort" && (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-900 mb-1">Cohort Revenue Retention</h3>
          <p className="text-[10px] text-gray-400 mb-4">% doanh thu còn lại theo tháng kể từ khi khách hàng onboard. Xanh đậm = giữ chân tốt.</p>
          <div className="overflow-x-auto">
            <table className="w-full text-[9px]">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100">
                  <th className="text-left py-2 pr-3">Cohort</th>
                  <th className="text-center py-2 px-1">KH</th>
                  {[0, 1, 2, 3, 4, 5].map((m) => (
                    <th key={m} className="text-center py-2 px-1">T+{m}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COHORTS.map((row) => (
                  <tr key={row.cohort} className="border-b border-gray-50">
                    <td className="py-2 pr-3 text-gray-700 whitespace-nowrap">{row.cohort}</td>
                    <td className="text-center py-2 px-1 text-gray-500">{row.customers}</td>
                    {row.months.map((pct, i) => {
                      const intensity = Math.round((pct / 100) * 200 + 55);
                      const bg = pct >= 90 ? `rgb(34, ${intensity}, 94)` :
                                 pct >= 75 ? `rgb(59, ${intensity}, 246)` :
                                 pct >= 60 ? `rgb(245, ${intensity}, 11)` :
                                 `rgb(239, ${Math.min(intensity, 200)}, 68)`;
                      return (
                        <td key={i} className="text-center py-2 px-1">
                          <span className="inline-block w-10 py-1 rounded text-white text-[8px]"
                            style={{ backgroundColor: bg }}>
                            {pct}%
                          </span>
                        </td>
                      );
                    })}
                    {/* Empty cells */}
                    {Array.from({ length: 6 - row.months.length }).map((_, i) => (
                      <td key={`empty-${i}`} className="text-center py-2 px-1">
                        <span className="text-[8px] text-gray-300">—</span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-[10px] text-blue-700">
              <strong>Insight:</strong> Cohort T1/2026 retention tốt nhất (94% sau tháng 1) — nhờ onboarding flow mới 3 bước. Cohort T10/2025 có drop mạnh nhất (-12% tháng đầu) — tháng launch nhiều bug.
            </p>
          </div>
        </div>
      )}

      {/* === Attribution === */}
      {activeTab === "attribution" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm text-gray-900 mb-1">Multi-touch Revenue Attribution</h3>
            <p className="text-[10px] text-gray-400 mb-4">
              So sánh 4 mô hình attribution: First Touch, Last Touch, Linear, Time Decay — để hiểu kênh nào thực sự đem lại doanh thu.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-[9px]">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100">
                    <th className="text-left py-2 pr-3">Kênh</th>
                    <th className="text-right py-2 px-2">First Touch</th>
                    <th className="text-right py-2 px-2">Last Touch</th>
                    <th className="text-right py-2 px-2">Linear</th>
                    <th className="text-right py-2 px-2">Time Decay</th>
                    <th className="text-right py-2 px-2">Revenue</th>
                    <th className="text-right py-2 pl-2">Deals</th>
                  </tr>
                </thead>
                <tbody>
                  {TOUCHPOINTS.map((tp) => (
                    <tr key={tp.channel} className="border-b border-gray-50">
                      <td className="py-2 pr-3 text-gray-700 flex items-center gap-1.5">
                        <div className={`w-2 h-2 rounded-full ${tp.color}`} />
                        {tp.channel}
                      </td>
                      <td className="text-right py-2 px-2 text-gray-600">{tp.firstTouch}%</td>
                      <td className="text-right py-2 px-2 text-gray-600">{tp.lastTouch}%</td>
                      <td className="text-right py-2 px-2 text-gray-600">{tp.linear}%</td>
                      <td className="text-right py-2 px-2 text-gray-700">{tp.timeDecay}%</td>
                      <td className="text-right py-2 px-2 text-emerald-600">{fmtMoney(tp.revenue)}đ</td>
                      <td className="text-right py-2 pl-2 text-gray-500">{tp.deals}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Channel comparison bars */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm text-gray-900 mb-3">Revenue theo Kênh (Time Decay Model)</h3>
            {TOUCHPOINTS.sort((a, b) => b.timeDecay - a.timeDecay).map((tp) => (
              <div key={tp.channel} className="mb-2">
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] text-gray-600 flex items-center gap-1">
                    <span className={`w-2 h-2 rounded-full inline-block ${tp.color}`} />
                    {tp.channel}
                  </span>
                  <span className="text-[10px] text-gray-900">{tp.timeDecay}% • {fmtMoney(tp.revenue)}đ</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${tp.color}`} style={{ width: `${(tp.timeDecay / 25) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-xl border border-emerald-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <h4 className="text-sm text-emerald-900">AI Revenue Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-emerald-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span><strong>Email Nurture</strong> đang bị undervalued ở First Touch (5.2%) nhưng là kênh #1 ở Last Touch (25.8%). Đề xuất tăng 30% budget cho email sequences — ROI ước tính tăng 2.4x.</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span><strong>Churn rate 11.8%</strong> vượt mục tiêu &lt;10%. Top 3 lý do: thiếu onboarding (32%), giá (28%), thiếu tính năng (22%). Rescue campaign cho <strong>At Risk segment</strong> có thể giảm 3% churn.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>AI dự báo: nếu duy trì tốc độ hiện tại, ARR sẽ đạt <strong>{fmtMoney(42_000_000_000)}đ</strong> cuối 2026. Growth trajectory: <strong>+22.8%</strong> YoY. Expansion revenue là lever mạnh nhất.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
