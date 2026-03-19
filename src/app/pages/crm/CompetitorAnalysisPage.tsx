/**
 * Competitor Analysis — Phân tích đối thủ cạnh tranh.
 * Features: DataTable + Card view, FilterBar, Pagination,
 *   Column Visibility, Detail Modal (radar + battle cards),
 *   Win/Loss DataTable, AI Insights, Delete đơn lẻ + bulk.
 * Phase 5 — Centralized types/constants/data/API.
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  Swords, Trophy, Eye, X, Bot, Sparkles,
  DollarSign, Target, Shield, Trash2,
  ThumbsUp, ThumbsDown, Building2, BarChart3,
  FileText, AlertTriangle, Plus,
} from "lucide-react";
import { toast } from "sonner";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Radar, ResponsiveContainer, Tooltip, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Cell, PieChart, Pie, Legend,
} from "recharts";
import type { Competitor, CompetitorThreat, WinLossRecord, DealOutcome } from "../../types/crm";
import type { ColumnDef } from "../../types/dataTable";
import { THREAT_CONFIG, DEAL_OUTCOME_CONFIG, formatUSD } from "../../constants/crmConfig";
import {
  fetchCompetitors, updateCompetitor, deleteCompetitors,
  fetchWinLossRecords, deleteWinLossRecords,
  createCompetitor,
} from "../../api/crmApi";
import { DataTable } from "../../components/crm/DataTable";
import { ViewToggle } from "../../components/crm/ViewToggle";
import { FilterBar, type FilterConfig } from "../../components/crm/FilterBar";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";
import { useViewMode } from "../../hooks/useViewMode";
import { usePagination } from "../../hooks/usePagination";

/* ============================================================
 * Filter configs
 * ============================================================ */
const COMP_FILTERS: FilterConfig[] = [
  {
    key: "threat", label: "Mức đe doạ", type: "button-group",
    options: Object.entries(THREAT_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
  },
];

const WL_FILTERS: FilterConfig[] = [
  {
    key: "outcome", label: "Kết quả", type: "button-group",
    options: Object.entries(DEAL_OUTCOME_CONFIG).map(([v, c]) => ({ value: v, label: c.label })),
  },
];

/* ============================================================
 * Competitor Column Definitions
 * ============================================================ */
const COMP_COLUMNS: ColumnDef<Competitor>[] = [
  {
    key: "name", header: "Đối thủ", sortable: true, minWidth: 200,
    render: (c) => (
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-xs text-white flex-shrink-0">
          {c.logo}
        </div>
        <div className="min-w-0">
          <p className="text-gray-900 truncate">{c.name}</p>
          <p className="text-[10px] text-gray-400 truncate">{c.region}</p>
        </div>
      </div>
    ),
  },
  {
    key: "threat", header: "Mức đe doạ", sortable: true, minWidth: 100, editable: true,
    render: (c) => {
      const cfg = THREAT_CONFIG[c.threat];
      return <span className={`text-[11px] px-2 py-0.5 rounded border ${cfg.bgColor} ${cfg.color}`}>{cfg.label}</span>;
    },
    renderEdit: (item, _v, onChange, onSave) => (
      <select value={item.threat} onChange={(e) => { onChange(e.target.value); onSave(); }}
        onBlur={onSave} autoFocus
        className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
        {Object.entries(THREAT_CONFIG).map(([k, cfg]) => <option key={k} value={k}>{cfg.label}</option>)}
      </select>
    ),
  },
  {
    key: "ourWinRate", header: "Win Rate", sortable: true, minWidth: 90,
    render: (c) => {
      const color = c.ourWinRate >= 65 ? "text-green-600" : c.ourWinRate >= 50 ? "text-amber-600" : "text-red-600";
      return <span className={color}>{c.ourWinRate}%</span>;
    },
    sortValue: (c) => c.ourWinRate,
  },
  {
    key: "encounters", header: "W/L", sortable: true, minWidth: 80,
    render: (c) => <span className="text-gray-600">{c.dealsWon}W / {c.dealsLost}L</span>,
    sortValue: (c) => c.totalEncounters,
  },
  {
    key: "avgDealSize", header: "Avg Deal", sortable: true, minWidth: 90,
    render: (c) => <span className="text-gray-900">{formatUSD(c.avgDealSize)}</span>,
    sortValue: (c) => c.avgDealSize,
  },
  {
    key: "battleCards", header: "Battle Cards", sortable: true, minWidth: 80,
    render: (c) => <span className="text-violet-600">{c.battleCards.length}</span>,
    sortValue: (c) => c.battleCards.length,
  },
  {
    key: "pricing", header: "Mức giá", sortable: false, minWidth: 160,
    defaultHidden: true,
    render: (c) => <span className="text-xs text-gray-500 truncate block">{c.pricing}</span>,
  },
];

/* ============================================================
 * Win/Loss Column Definitions
 * ============================================================ */
const WL_COLUMNS: ColumnDef<WinLossRecord>[] = [
  {
    key: "outcome", header: "", sortable: true, minWidth: 40,
    render: (w) => (
      <span className={`w-7 h-7 rounded-full flex items-center justify-center ${
        w.outcome === "won" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"
      }`}>
        {w.outcome === "won" ? <Trophy className="w-3.5 h-3.5" /> : <ThumbsDown className="w-3.5 h-3.5" />}
      </span>
    ),
    sortValue: (w) => (w.outcome === "won" ? 1 : 0),
  },
  {
    key: "dealName", header: "Deal", sortable: true, minWidth: 160,
    render: (w) => (
      <div className="min-w-0">
        <p className="text-gray-900 truncate">{w.dealName}</p>
        <p className="text-[10px] text-gray-400 truncate">{w.clientCompany}</p>
      </div>
    ),
  },
  {
    key: "competitor", header: "Đối thủ", sortable: true, minWidth: 120,
    render: (w) => <span className="text-gray-600 text-xs">{w.competitor}</span>,
  },
  {
    key: "value", header: "Giá trị", sortable: true, minWidth: 90,
    render: (w) => <span className="text-gray-900">{formatUSD(w.value)}</span>,
    sortValue: (w) => w.value,
  },
  {
    key: "reason", header: "Lý do", sortable: false, minWidth: 200,
    render: (w) => <span className="text-xs text-gray-500 truncate block">{w.reason}</span>,
  },
  {
    key: "date", header: "Ngày", sortable: true, minWidth: 90,
    render: (w) => <span className="text-xs text-gray-400">{new Date(w.date).toLocaleDateString("vi-VN")}</span>,
    sortValue: (w) => new Date(w.date).getTime(),
  },
  {
    key: "owner", header: "Owner", sortable: true, minWidth: 120,
    defaultHidden: true,
    render: (w) => <span className="text-xs text-gray-600">{w.owner}</span>,
  },
];

/* ============================================================
 * Competitor Card
 * ============================================================ */
function CompCard({ comp, onView, onDelete }: {
  comp: Competitor; onView: () => void; onDelete: () => void;
}) {
  const tCfg = THREAT_CONFIG[comp.threat];
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer group"
      onClick={onView}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-sm text-white flex-shrink-0">
            {comp.logo}
          </div>
          <div className="min-w-0">
            <h4 className="text-sm text-gray-900 truncate">{comp.name}</h4>
            <p className="text-[10px] text-gray-400">{comp.region}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <span className={`text-[9px] px-1.5 py-0.5 rounded border ${tCfg.bgColor} ${tCfg.color}`}>{tCfg.label}</span>
          <button type="button" onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{comp.description}</p>
      <div className="grid grid-cols-3 gap-2 mb-3 text-center">
        <div className={`rounded p-1.5 ${comp.ourWinRate >= 65 ? "bg-green-50" : comp.ourWinRate >= 50 ? "bg-amber-50" : "bg-red-50"}`}>
          <p className={`text-sm ${comp.ourWinRate >= 65 ? "text-green-600" : comp.ourWinRate >= 50 ? "text-amber-600" : "text-red-600"}`}>{comp.ourWinRate}%</p>
          <p className="text-[8px] text-gray-400">Win Rate</p>
        </div>
        <div className="bg-gray-50 rounded p-1.5">
          <p className="text-sm text-gray-900">{comp.dealsWon}W/{comp.dealsLost}L</p>
          <p className="text-[8px] text-gray-400">W/L</p>
        </div>
        <div className="bg-gray-50 rounded p-1.5">
          <p className="text-sm text-gray-900">{comp.battleCards.length}</p>
          <p className="text-[8px] text-gray-400">Battle Cards</p>
        </div>
      </div>
      <div className="flex items-center gap-1 text-[9px] text-gray-400">
        <Eye className="w-3 h-3 group-hover:text-violet-500 transition-colors" />
        Xem chi tiết & battle cards
      </div>
    </div>
  );
}

/* ============================================================
 * Competitor Detail Modal
 * ============================================================ */
function CompDetailModal({ comp, onClose }: {
  comp: Competitor; onClose: () => void;
}) {
  const tCfg = THREAT_CONFIG[comp.threat];
  const radarData = comp.skills.map((s, i) => ({
    name: s.name, them: s.score, us: comp.ourSkills[i]?.score ?? 0,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center text-sm text-white">
              {comp.logo}
            </div>
            <div>
              <h3 className="text-gray-900 flex items-center gap-2">
                {comp.name}
                <span className={`text-[9px] px-1.5 py-0.5 rounded border ${tCfg.bgColor} ${tCfg.color}`}>
                  Mức đe doạ: {tCfg.label}
                </span>
              </h3>
              <p className="text-xs text-gray-500">{comp.region}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          <p className="text-sm text-gray-600">{comp.description}</p>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2">
            <div className={`rounded-lg p-2 text-center ${comp.ourWinRate >= 65 ? "bg-green-50" : comp.ourWinRate >= 50 ? "bg-amber-50" : "bg-red-50"}`}>
              <p className={`text-sm ${comp.ourWinRate >= 65 ? "text-green-600" : comp.ourWinRate >= 50 ? "text-amber-600" : "text-red-600"}`}>{comp.ourWinRate}%</p>
              <p className="text-[9px] text-gray-400">Win Rate</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-sm text-gray-900">{comp.totalEncounters}</p>
              <p className="text-[9px] text-gray-400">Encounters</p>
            </div>
            <div className="bg-green-50 rounded-lg p-2 text-center">
              <p className="text-sm text-green-600">{comp.dealsWon}W</p>
              <p className="text-[9px] text-gray-400">/{comp.dealsLost}L</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2 text-center">
              <p className="text-sm text-gray-900">{formatUSD(comp.avgDealSize)}</p>
              <p className="text-[9px] text-gray-400">Avg Deal</p>
            </div>
          </div>

          {/* Radar Chart */}
          <div>
            <h4 className="text-xs text-gray-500 mb-1">So sánh năng lực</h4>
            <ResponsiveContainer width="100%" height={220}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="name" tick={{ fontSize: 9, fill: "#9ca3af" }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
                <Radar name="Chúng ta" dataKey="us" stroke="#6366f1" fill="#6366f1" fillOpacity={0.2} strokeWidth={2} />
                <Radar name={comp.name} dataKey="them" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 10 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Strengths / Weaknesses */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <h4 className="text-xs text-red-600 mb-1 flex items-center gap-1"><Shield className="w-3 h-3" /> Điểm mạnh đối thủ</h4>
              <ul className="space-y-1">
                {comp.strengths.map((s, i) => (
                  <li key={i} className="text-[11px] text-gray-600 flex items-start gap-1">
                    <span className="text-red-400 mt-0.5">•</span> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs text-green-600 mb-1 flex items-center gap-1"><Target className="w-3 h-3" /> Điểm yếu đối thủ</h4>
              <ul className="space-y-1">
                {comp.weaknesses.map((w, i) => (
                  <li key={i} className="text-[11px] text-gray-600 flex items-start gap-1">
                    <span className="text-green-400 mt-0.5">•</span> {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="text-xs text-gray-500 mb-1 flex items-center gap-1"><DollarSign className="w-3 h-3" /> Mức giá</h4>
            <p className="text-sm text-gray-900">{comp.pricing}</p>
          </div>

          {/* Battle Cards */}
          <div>
            <h4 className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Swords className="w-3.5 h-3.5" /> Battle Cards ({comp.battleCards.length})
            </h4>
            <div className="space-y-2">
              {comp.battleCards.map((bc) => (
                <div key={bc.id} className="bg-violet-50/50 rounded-lg border border-violet-100 p-3">
                  <p className="text-xs text-violet-800 mb-1.5">{bc.topic}</p>
                  <div className="grid grid-cols-2 gap-2 text-[10px] mb-2">
                    <div>
                      <p className="text-green-600 mb-0.5 flex items-center gap-0.5"><ThumbsUp className="w-3 h-3" /> Ta mạnh</p>
                      <p className="text-gray-600">{bc.ourStrength}</p>
                    </div>
                    <div>
                      <p className="text-red-500 mb-0.5 flex items-center gap-0.5"><ThumbsDown className="w-3 h-3" /> Họ yếu</p>
                      <p className="text-gray-600">{bc.theirWeakness}</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-violet-700 bg-violet-100/50 rounded p-1.5">
                    💬 <span className="italic">{bc.talkingPoint}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Win/Loss reasons */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 rounded-lg border border-green-100 p-2.5">
              <p className="text-[9px] text-green-600 mb-0.5 flex items-center gap-0.5"><Trophy className="w-3 h-3" /> Top Win Reason</p>
              <p className="text-xs text-gray-700">{comp.topWinReason}</p>
            </div>
            <div className="bg-red-50 rounded-lg border border-red-100 p-2.5">
              <p className="text-[9px] text-red-500 mb-0.5 flex items-center gap-0.5"><AlertTriangle className="w-3 h-3" /> Top Loss Reason</p>
              <p className="text-xs text-gray-700">{comp.topLossReason}</p>
            </div>
          </div>

          {/* AI Insight */}
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-lg border border-violet-100 p-3">
            <p className="text-xs text-violet-800 flex items-start gap-1.5">
              <Bot className="w-3.5 h-3.5 text-violet-500 mt-0.5 flex-shrink-0" />
              <span><span className="text-violet-900">AI Strategy:</span> {comp.aiInsight}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end p-4 border-t border-gray-100 flex-shrink-0">
          <button type="button" onClick={onClose}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">Đóng</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Create Competitor Modal
 * ============================================================ */
function CreateCompetitorModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [logo, setLogo] = useState("🏢");
  const [region, setRegion] = useState("Vietnam");
  const [threat, setThreat] = useState<CompetitorThreat>("medium");
  const [description, setDescription] = useState("");
  const [strengths, setStrengths] = useState("");
  const [weaknesses, setWeaknesses] = useState("");
  const [pricing, setPricing] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Vui lòng nhập tên đối thủ"); return; }
    setSaving(true);
    await createCompetitor({
      name, logo, description, region, threat,
      strengths: strengths.split(",").map((s) => s.trim()).filter(Boolean),
      weaknesses: weaknesses.split(",").map((s) => s.trim()).filter(Boolean),
      pricing: pricing || "Chưa rõ",
      ourWinRate: 50, totalEncounters: 0, dealsWon: 0, dealsLost: 0, avgDealSize: 0,
      skills: [{ name: "Product", score: 50 }, { name: "Pricing", score: 50 }, { name: "Support", score: 50 }],
      ourSkills: [{ name: "Product", score: 70 }, { name: "Pricing", score: 60 }, { name: "Support", score: 80 }],
      battleCards: [],
      aiInsight: `AI đang thu thập dữ liệu về ${name}. Insights sẽ cập nhật khi có thêm encounter data.`,
      topWinReason: "Chưa có dữ liệu",
      topLossReason: "Chưa có dữ liệu",
      tags: [],
    });
    toast.success(`Đã thêm đối thủ "${name}"`);
    setSaving(false);
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900 flex items-center gap-2"><Swords className="w-5 h-5 text-violet-600" /> Thêm Đối thủ mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3 max-h-[65vh] overflow-y-auto">
          <div className="grid grid-cols-[60px_1fr] gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Logo</label>
              <input type="text" value={logo} onChange={(e) => setLogo(e.target.value)} maxLength={2}
                className="w-full px-2 py-2 border border-gray-200 rounded-lg text-center text-lg focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tên đối thủ *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Salesforce, HubSpot..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Khu vực</label>
              <input type="text" value={region} onChange={(e) => setRegion(e.target.value)} placeholder="VD: Global, APAC"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Mức đe doạ</label>
              <select value={threat} onChange={(e) => setThreat(e.target.value as CompetitorThreat)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                {Object.entries(THREAT_CONFIG).map(([k, cfg]) => <option key={k} value={k}>{cfg.label}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mô tả</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Mô tả ngắn về đối thủ..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Điểm mạnh (cách nhau bởi dấu phẩy)</label>
            <input type="text" value={strengths} onChange={(e) => setStrengths(e.target.value)} placeholder="VD: Brand mạnh, Hệ sinh thái lớn"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Điểm yếu (cách nhau bởi dấu phẩy)</label>
            <input type="text" value={weaknesses} onChange={(e) => setWeaknesses(e.target.value)} placeholder="VD: Giá cao, UI phức tạp"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Định giá ước tính</label>
            <input type="text" value={pricing} onChange={(e) => setPricing(e.target.value)} placeholder="VD: ~$50/user/tháng"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="bg-violet-50 rounded-lg p-3 border border-violet-100">
            <p className="text-[10px] text-violet-700 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI sẽ tự động thu thập thông tin đối thủ, tạo battle cards, và cập nhật win/loss analytics.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 disabled:opacity-50">
            {saving ? "Đang thêm..." : "Thêm Đối thủ"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Chart helpers
 * ============================================================ */
const WIN_RATE_COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#6366f1", "#8b5cf6"];

/* ============================================================
 * Trang chính
 * ============================================================ */
export function CompetitorAnalysisPage() {
  const [comps, setComps] = useState<Competitor[]>([]);
  const [wlRecords, setWlRecords] = useState<WinLossRecord[]>([]);
  const [compSearch, setCompSearch] = useState("");
  const [compFilters, setCompFilters] = useState<Record<string, string>>({});
  const [wlSearch, setWlSearch] = useState("");
  const [wlFilters, setWlFilters] = useState<Record<string, string>>({});
  const { mode, setMode } = useViewMode("competitor-analysis");
  const [selectedComp, setSelectedComp] = useState<Competitor | null>(null);
  const [deleteCompTarget, setDeleteCompTarget] = useState<Competitor | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  /* ---- Load data ---- */
  const loadComps = useCallback(async () => {
    const data = await fetchCompetitors({
      search: compSearch || undefined,
      threat: (compFilters.threat as CompetitorThreat) || null,
    });
    setComps(data);
  }, [compSearch, compFilters]);

  const loadWL = useCallback(async () => {
    const data = await fetchWinLossRecords({
      search: wlSearch || undefined,
      outcome: (wlFilters.outcome as DealOutcome) || null,
    });
    setWlRecords(data);
  }, [wlSearch, wlFilters]);

  useEffect(() => { loadComps(); }, [loadComps]);
  useEffect(() => { loadWL(); }, [loadWL]);

  /* ---- Stats ---- */
  const overallWinRate = useMemo(() => {
    if (wlRecords.length === 0) return 0;
    const won = wlRecords.filter((r) => r.outcome === "won").length;
    return Math.round((won / wlRecords.length) * 100);
  }, [wlRecords]);

  const overallWinLoss = useMemo(() => [
    { name: "Won", value: wlRecords.filter((r) => r.outcome === "won").length, fill: "#22c55e" },
    { name: "Lost", value: wlRecords.filter((r) => r.outcome === "lost").length, fill: "#ef4444" },
  ], [wlRecords]);

  const winRateChart = useMemo(() => comps.map((c) => ({
    name: c.name.split(" ")[0], winRate: c.ourWinRate, encounters: c.totalEncounters,
  })), [comps]);

  /* ---- Pagination for card view ---- */
  const { paginatedItems: paginatedComps, currentPage, totalPages, goToPage, nextPage, prevPage,
    startIndex, endIndex, isFirstPage, isLastPage, totalItems } = usePagination(comps, { storageKey: "competitor-cards" });

  /* ---- Handlers ---- */
  const compHasActive = compSearch !== "" || Object.values(compFilters).some((v) => v !== "");
  const wlHasActive = wlSearch !== "" || Object.values(wlFilters).some((v) => v !== "");

  const handleCompFilterChange = useCallback((key: string, value: string) => {
    setCompFilters((p) => ({ ...p, [key]: value }));
  }, []);
  const handleWlFilterChange = useCallback((key: string, value: string) => {
    setWlFilters((p) => ({ ...p, [key]: value }));
  }, []);

  const handleCompInlineEdit = useCallback(async (rowId: string, field: string, value: unknown) => {
    await updateCompetitor(rowId, { [field]: value });
    toast.success("Đã cập nhật đối thủ");
    loadComps();
  }, [loadComps]);

  const handleDeleteComp = useCallback(async () => {
    if (!deleteCompTarget) return;
    await deleteCompetitors([deleteCompTarget.id]);
    toast.success(`Đã xóa "${deleteCompTarget.name}"`);
    setDeleteCompTarget(null);
    loadComps();
  }, [deleteCompTarget, loadComps]);

  const handleBulkDeleteComps = useCallback(async (ids: string[]) => {
    const count = await deleteCompetitors(ids);
    toast.success(`Đã xóa ${count} đối thủ`);
    loadComps();
  }, [loadComps]);

  const handleBulkDeleteWL = useCallback(async (ids: string[]) => {
    const count = await deleteWinLossRecords(ids);
    toast.success(`Đã xóa ${count} bản ghi win/loss`);
    loadWL();
  }, [loadWL]);

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Swords className="w-6 h-6 text-violet-600" /> Phân tích Đối thủ
          </h1>
          <p className="text-gray-500 mt-0.5">
            Battle cards, win/loss analysis, so sánh năng lực, AI competitive strategy
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ViewToggle mode={mode} onSetMode={setMode} />
          <button type="button" onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">
            <Plus className="w-4 h-4" /> Thêm Đối thủ
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className={`rounded-xl border p-3 ${overallWinRate >= 65 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
          <Trophy className="w-4 h-4 text-green-500 mb-1" />
          <p className="text-lg text-green-600">{overallWinRate}%</p>
          <p className="text-xs text-gray-600">Win Rate tổng thể</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <p className="text-lg text-gray-900">{comps.length}</p>
          <p className="text-xs text-gray-500">Đối thủ theo dõi</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <p className="text-lg text-gray-900">{wlRecords.length}</p>
          <p className="text-xs text-gray-500">Deals so kè</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <p className="text-lg text-gray-900">
            {comps.reduce((s, c) => s + c.battleCards.length, 0)}
          </p>
          <p className="text-xs text-gray-500">Battle Cards</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
            <BarChart3 className="w-4 h-4 text-green-500" /> Win Rate vs Đối thủ
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={winRateChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(v: number) => [`${v}%`, "Win Rate"]} />
              <Bar dataKey="winRate" radius={[4, 4, 0, 0]}>
                {winRateChart.map((_, i) => <Cell key={i} fill={WIN_RATE_COLORS[i % WIN_RATE_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-violet-500" /> Tổng quan Won/Lost
          </h3>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="40%" height={200}>
              <PieChart>
                <Pie data={overallWinLoss} dataKey="value" nameKey="name"
                  cx="50%" cy="50%" outerRadius={65} innerRadius={30}
                  label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                  {overallWinLoss.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
                <span className="text-sm text-gray-600 flex-1">Won</span>
                <span className="text-gray-900">{overallWinLoss[0].value} deals</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500 flex-shrink-0" />
                <span className="text-sm text-gray-600 flex-1">Lost</span>
                <span className="text-gray-900">{overallWinLoss[1].value} deals</span>
              </div>
              <p className="text-xs text-gray-400 pt-1">
                Tổng giá trị: {formatUSD(wlRecords.reduce((s, r) => s + r.value, 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Competitor FilterBar */}
      <h3 className="text-sm text-gray-800 flex items-center gap-1.5">
        <Building2 className="w-4 h-4 text-violet-500" /> Đối thủ ({comps.length})
      </h3>
      <FilterBar
        search={compSearch}
        onSearchChange={setCompSearch}
        searchPlaceholder="Tìm đối thủ, khu vực..."
        filters={COMP_FILTERS}
        filterValues={compFilters}
        onFilterChange={handleCompFilterChange}
        onClearAll={() => { setCompSearch(""); setCompFilters({}); }}
        hasActiveFilters={compHasActive}
        actions={<ViewToggle mode={mode} onSetMode={setMode} />}
      />

      {/* Competitor Data View */}
      {mode === "table" ? (
        <DataTable
          data={comps}
          columns={COMP_COLUMNS}
          storageKey="competitor-table"
          selectable
          onInlineEdit={handleCompInlineEdit}
          onRowClick={setSelectedComp}
          onBulkDelete={handleBulkDeleteComps}
          renderRowActions={(item) => (
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setSelectedComp(item)}
                className="p-1 text-gray-400 hover:text-violet-600"><Eye className="w-4 h-4" /></button>
              <button type="button" onClick={() => setDeleteCompTarget(item)}
                className="p-1 text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          )}
          defaultSortField="ourWinRate"
          emptyMessage="Không có đối thủ nào"
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {paginatedComps.map((comp) => (
              <CompCard key={comp.id} comp={comp}
                onView={() => setSelectedComp(comp)}
                onDelete={() => setDeleteCompTarget(comp)}
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="bg-white rounded-xl border border-gray-100 px-4 py-2 flex items-center justify-between text-xs text-gray-500">
              <span>{startIndex + 1}–{endIndex} / {totalItems}</span>
              <div className="flex items-center gap-1">
                <button type="button" disabled={isFirstPage} onClick={prevPage}
                  className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-30">←</button>
                <span>Trang {currentPage}/{totalPages}</span>
                <button type="button" disabled={isLastPage} onClick={nextPage}
                  className="px-2 py-1 rounded hover:bg-gray-100 disabled:opacity-30">→</button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Win/Loss Records */}
      <h3 className="text-sm text-gray-800 flex items-center gap-1.5 pt-2">
        <FileText className="w-4 h-4 text-blue-500" /> Lịch sử Win/Loss ({wlRecords.length})
      </h3>
      <FilterBar
        search={wlSearch}
        onSearchChange={setWlSearch}
        searchPlaceholder="Tìm deal, đối thủ, client..."
        filters={WL_FILTERS}
        filterValues={wlFilters}
        onFilterChange={handleWlFilterChange}
        onClearAll={() => { setWlSearch(""); setWlFilters({}); }}
        hasActiveFilters={wlHasActive}
      />
      <DataTable
        data={wlRecords}
        columns={WL_COLUMNS}
        storageKey="win-loss-table"
        selectable
        onBulkDelete={handleBulkDeleteWL}
        defaultSortField="date"
        emptyMessage="Không có bản ghi win/loss"
      />

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Competitive Strategy</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            Lợi thế lớn nhất: AI capability. 67% deals won nhờ AI demo. Đầu tư thêm vào demo kit và case studies.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            Rủi ro lớn nhất: SaigonSoft Corp — win rate chỉ 55%. Họ có incumbent advantage và giá rẻ. Cần strategy riêng.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            Cơ hội: AlphaTech đang mất clients Nhật. Target 3 accounts đang đánh giá lại vendor trong Q2.
          </p>
        </div>
      </div>

      {/* Modals */}
      {selectedComp && <CompDetailModal comp={selectedComp} onClose={() => setSelectedComp(null)} />}
      <ConfirmDeleteDialog
        open={!!deleteCompTarget}
        onClose={() => setDeleteCompTarget(null)}
        onConfirm={handleDeleteComp}
        itemName={deleteCompTarget?.name ?? ""}
        entityType="đối thủ"
        description="Thao tác này sẽ xóa toàn bộ battle cards và dữ liệu liên quan."
      />
      {showCreateModal && <CreateCompetitorModal onClose={() => setShowCreateModal(false)} onCreated={loadComps} />}
    </div>
  );
}