/**
 * Campaign ROI Analyzer — Phân tích ROI Chiến dịch
 * Multi-channel campaign performance, cost analysis,
 * attribution modeling, ROAS, CAC, LTV/CAC ratio.
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import {
  PieChart,
  Search,
  Sparkles,
  Bot,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  BarChart3,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Users,
  Mail,
  Globe,
  Megaphone,
  MousePointerClick,
  Eye,
  ShoppingCart,
  Calculator,
  Plus,
  X,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { DataTable } from "../../components/crm/DataTable";
import { ViewToggle } from "../../components/crm/ViewToggle";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";
import { useViewMode } from "../../hooks/useViewMode";
import type { ColumnDef } from "../../types/dataTable";
import type { CampaignRoi, CampaignChannel, CampaignStatus } from "../../types/crm";
import { fetchCampaignRois, updateCampaignRoi } from "../../api/crmApi";

/* ============================================================
 * Types & Constants
 * ============================================================ */
type Channel = CampaignChannel;
type Campaign = CampaignRoi;

const CHANNEL_CFG: Record<Channel, { label: string; icon: string; color: string }> = {
  email: { label: "Email", icon: "📧", color: "text-blue-600" },
  social: { label: "Social Media", icon: "📱", color: "text-pink-600" },
  sem: { label: "SEM / Google Ads", icon: "🔍", color: "text-amber-600" },
  seo: { label: "SEO / Organic", icon: "🌐", color: "text-green-600" },
  webinar: { label: "Webinar", icon: "🎥", color: "text-violet-600" },
  content: { label: "Content Marketing", icon: "📝", color: "text-cyan-600" },
  referral: { label: "Referral", icon: "🤝", color: "text-orange-600" },
  partner: { label: "Partner Co-marketing", icon: "🏢", color: "text-indigo-600" },
};

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  active: { label: "Đang chạy", color: "text-green-600", bg: "bg-green-50 border-green-200" },
  completed: { label: "Hoàn thành", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  paused: { label: "Tạm dừng", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
};

const fmtVND = (n: number) => {
  if (Math.abs(n) >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(0)}M`;
  return n.toLocaleString("vi-VN");
};

/* Mock data imported from centralized API layer */

type Tab = "campaigns" | "channels" | "funnel";
type SortBy = "roas" | "revenue" | "cac" | "leads";

/* ============================================================
 * Create Campaign Modal
 * ============================================================ */
function CreateCampaignModal({ onClose, onCreated }: { onClose: () => void; onCreated: (c: Campaign) => void }) {
  const [name, setName] = useState("");
  const [channel, setChannel] = useState<Channel>("email");
  const [budget, setBudget] = useState(100000000);
  const [startDate, setStartDate] = useState("2026-03-05");
  const [endDate, setEndDate] = useState("2026-04-30");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!name.trim()) { toast.error("Vui lòng nhập tên chiến dịch"); return; }
    setSaving(true);
    const newCampaign: Campaign = {
      id: `cp_${Date.now()}`, name, channel,
      status: "active", startDate, endDate,
      budget, spent: 0,
      leads: 0, mqls: 0, sqls: 0, opportunities: 0, wonDeals: 0, revenue: 0,
      cpl: 0, cac: 0, roas: 0, conversionRate: 0,
    };
    onCreated(newCampaign);
    toast.success(`Đã tạo chiến dịch "${name}" — Budget: ${fmtVND(budget)}₫`);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900 flex items-center gap-2"><Megaphone className="w-5 h-5 text-pink-600" /> Tạo Chiến dịch mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tên chiến dịch *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: AI-CRM Launch Campaign Q2"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Kênh</label>
              <select value={channel} onChange={(e) => setChannel(e.target.value as Channel)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500">
                {Object.entries(CHANNEL_CFG).map(([k, cfg]) => <option key={k} value={k}>{cfg.icon} {cfg.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Budget (VNĐ)</label>
              <input type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} min={0} step={10000000}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Ngày bắt đầu</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Ngày kết thúc</label>
              <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
          </div>
          <div className="bg-pink-50 rounded-lg p-3 border border-pink-100">
            <p className="text-[10px] text-pink-700 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI sẽ tự động tracking ROI, tối ưu budget allocation, và đề xuất A/B testing strategies.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm hover:bg-pink-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo Chiến dịch"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Component
 * ============================================================ */
export function CampaignRoiPage() {
  const [activeTab, setActiveTab] = useState<Tab>("campaigns");
  const [sortBy, setSortBy] = useState<SortBy>("roas");
  const [channelFilter, setChannelFilter] = useState<Channel | "all">("all");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ ids: string[]; label: string } | null>(null);
  const [deleting, setDeleting] = useState(false);

  /** Load data from API */
  const loadCampaigns = useCallback(async () => {
    const data = await fetchCampaignRois();
    setCampaigns(data);
  }, []);

  useEffect(() => { loadCampaigns(); }, [loadCampaigns]);
  const { mode, setMode } = useViewMode("campaign-roi", "list");

  const filtered = useMemo(() => {
    let list = campaigns;
    if (channelFilter !== "all") list = list.filter((c) => c.channel === channelFilter);
    if (sortBy === "roas") return [...list].sort((a, b) => b.roas - a.roas);
    if (sortBy === "revenue") return [...list].sort((a, b) => b.revenue - a.revenue);
    if (sortBy === "cac") return [...list].sort((a, b) => a.cac - b.cac);
    return [...list].sort((a, b) => b.leads - a.leads);
  }, [channelFilter, sortBy, campaigns]);

  const stats = useMemo(() => {
    const totalSpent = campaigns.reduce((s, c) => s + c.spent, 0);
    const totalRevenue = campaigns.reduce((s, c) => s + c.revenue, 0);
    const totalLeads = campaigns.reduce((s, c) => s + c.leads, 0);
    const totalWon = campaigns.reduce((s, c) => s + c.wonDeals, 0);
    const overallRoas = totalSpent > 0 ? (totalRevenue / totalSpent) : 0;
    const avgCac = totalWon > 0 ? Math.round(totalSpent / totalWon) : 0;
    return { totalSpent, totalRevenue, totalLeads, totalWon, overallRoas, avgCac };
  }, [campaigns]);

  const channelSummary = useMemo(() => {
    const map = new Map<Channel, { spent: number; revenue: number; leads: number; wonDeals: number }>();
    for (const c of campaigns) {
      const prev = map.get(c.channel) || { spent: 0, revenue: 0, leads: 0, wonDeals: 0 };
      map.set(c.channel, { spent: prev.spent + c.spent, revenue: prev.revenue + c.revenue, leads: prev.leads + c.leads, wonDeals: prev.wonDeals + c.wonDeals });
    }
    return Array.from(map.entries())
      .map(([ch, data]) => ({ channel: ch, ...data, roas: data.spent > 0 ? data.revenue / data.spent : 0 }))
      .sort((a, b) => b.roas - a.roas);
  }, [campaigns]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "campaigns", label: "Chiến dịch" },
    { key: "channels", label: "Kênh" },
    { key: "funnel", label: "Funnel" },
  ];

  const columns: ColumnDef<Campaign>[] = [
    {
      key: "name", header: "Chiến dịch", sortable: true, minWidth: 220,
      render: (c) => {
        const chCfg = CHANNEL_CFG[c.channel];
        return (
          <div className="min-w-0">
            <p className="text-gray-900 truncate">{c.name}</p>
            <span className={`text-[8px] ${chCfg.color}`}>{chCfg.icon} {chCfg.label}</span>
          </div>
        );
      },
    },
    {
      key: "status", header: "Trạng thái", sortable: true, minWidth: 90, editable: true,
      render: (c) => {
        const stCfg = STATUS_CFG[c.status];
        return <span className={`text-[9px] px-1.5 py-0.5 rounded border ${stCfg.bg} ${stCfg.color}`}>{stCfg.label}</span>;
      },
      renderEdit: (item, _v, onChange, onSave) => (
        <select defaultValue={item.status} onChange={(e) => { onChange(e.target.value); onSave(); }}
          onBlur={onSave} autoFocus
          className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none">
          {Object.entries(STATUS_CFG).map(([k, cfg]) => <option key={k} value={k}>{cfg.label}</option>)}
        </select>
      ),
    },
    { key: "roas", header: "ROAS", sortable: true, minWidth: 70,
      render: (c) => <span className={c.roas >= 30 ? "text-green-600" : c.roas >= 15 ? "text-amber-600" : "text-red-600"}>{c.roas.toFixed(1)}x</span>,
      sortValue: (c) => c.roas,
    },
    { key: "revenue", header: "Doanh thu", sortable: true, minWidth: 100,
      render: (c) => <span className="text-green-600">{fmtVND(c.revenue)}₫</span>,
      sortValue: (c) => c.revenue,
    },
    { key: "leads", header: "Leads", sortable: true, minWidth: 60, render: (c) => <span>{c.leads}</span>, sortValue: (c) => c.leads },
    { key: "wonDeals", header: "Won", sortable: true, minWidth: 50, render: (c) => <span>{c.wonDeals}</span>, sortValue: (c) => c.wonDeals },
    { key: "cac", header: "CAC", sortable: true, minWidth: 90,
      render: (c) => <span className="text-gray-600">{fmtVND(c.cac)}₫</span>,
      sortValue: (c) => c.cac,
    },
    { key: "spent", header: "Chi tiêu", sortable: true, minWidth: 90,
      render: (c) => <span className="text-gray-600">{fmtVND(c.spent)}₫ / {fmtVND(c.budget)}₫</span>,
      sortValue: (c) => c.spent,
    },
  ];

  const handleInlineEdit = useCallback(async (rowId: string, field: string, value: unknown) => {
    await updateCampaignRoi(rowId, { [field]: value });
    setCampaigns((prev) => prev.map((c) => c.id === rowId ? { ...c, [field]: value } : c));
    toast.success("Đã cập nhật chiến dịch");
  }, []);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    await new Promise((r) => setTimeout(r, 400));
    setCampaigns((prev) => prev.filter((c) => !deleteTarget.ids.includes(c.id)));
    toast.success(`Đã xóa ${deleteTarget.ids.length > 1 ? deleteTarget.ids.length + " chiến dịch" : "\"" + deleteTarget.label + "\""}`);
    setDeleteTarget(null);
    setDeleting(false);
  }, [deleteTarget]);

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <PieChart className="w-6 h-6 text-pink-600" /> Campaign ROI Analyzer
          </h1>
          <p className="text-gray-500 mt-0.5">Phân tích ROI chiến dịch — ROAS, CAC, attribution, funnel conversion</p>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => toast.success("AI đang phân tích ROI tối ưu...")}
            className="flex items-center gap-1 px-3 py-2 bg-pink-100 text-pink-700 rounded-lg text-sm hover:bg-pink-200">
            <Sparkles className="w-4 h-4" /> AI Tối ưu
          </button>
          <button type="button" onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1 px-3 py-2 bg-pink-600 text-white rounded-lg text-sm hover:bg-pink-700">
            <Plus className="w-4 h-4" /> Tạo Chiến dịch
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        <div className="bg-pink-50 rounded-xl border border-pink-200 p-2.5 text-center">
          <p className="text-lg text-pink-600">{fmtVND(stats.totalSpent)}₫</p>
          <p className="text-[9px] text-pink-700">Tổng chi tiêu</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{fmtVND(stats.totalRevenue)}₫</p>
          <p className="text-[9px] text-green-700">Tổng doanh thu</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-2.5 text-center">
          <p className="text-lg text-violet-600">{stats.overallRoas.toFixed(1)}x</p>
          <p className="text-[9px] text-violet-700">ROAS tổng</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{stats.totalLeads.toLocaleString()}</p>
          <p className="text-[9px] text-blue-700">Tổng Leads</p>
        </div>
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-2.5 text-center">
          <p className="text-lg text-emerald-600">{stats.totalWon}</p>
          <p className="text-[9px] text-emerald-700">Deals Won</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-2.5 text-center">
          <p className="text-lg text-amber-600">{fmtVND(stats.avgCac)}₫</p>
          <p className="text-[9px] text-amber-700">CAC trung bình</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
              activeTab === t.key ? "bg-pink-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* === Campaigns Tab === */}
      {activeTab === "campaigns" && (
        <>
          <div className="flex items-center gap-2 flex-wrap">
            <select value={channelFilter} onChange={(e) => setChannelFilter(e.target.value as Channel | "all")}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              <option value="all">Tất cả kênh</option>
              {Object.entries(CHANNEL_CFG).map(([k, v]) => <option key={k} value={k}>{v.icon} {v.label}</option>)}
            </select>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              <option value="roas">Sắp xếp: ROAS</option>
              <option value="revenue">Sắp xếp: Doanh thu</option>
              <option value="cac">Sắp xếp: CAC (thấp→cao)</option>
              <option value="leads">Sắp xếp: Leads</option>
            </select>
            <ViewToggle mode={mode} onSetMode={setMode} modes={["table", "list"]} />
          </div>

          {mode === "table" ? (
            <DataTable<Campaign>
              data={filtered}
              columns={columns}
              storageKey="campaign-roi-table"
              selectable
              onInlineEdit={handleInlineEdit}
              onBulkDelete={(ids) => setDeleteTarget({ ids, label: `${ids.length} chiến dịch được chọn` })}
              renderRowActions={(item) => (
                <button type="button" onClick={() => setDeleteTarget({ ids: [item.id], label: item.name })} className="p-1 text-gray-400 hover:text-red-600 rounded" title="Xóa"><Trash2 className="w-3.5 h-3.5" /></button>
              )}
              emptyMessage="Không tìm thấy chiến dịch phù hợp"
            />
          ) : (
          <div className="space-y-2">
            {filtered.map((c) => {
              const chCfg = CHANNEL_CFG[c.channel];
              const stCfg = STATUS_CFG[c.status];
              const budgetUsed = Math.round((c.spent / c.budget) * 100);
              return (
                <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl mt-0.5">{chCfg.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-900">{c.name}</span>
                        <span className={`text-[7px] px-1.5 py-0.5 rounded border ${stCfg.bg} ${stCfg.color}`}>{stCfg.label}</span>
                        <span className={`text-[7px] px-1.5 py-0.5 bg-gray-50 ${chCfg.color} rounded border border-gray-200`}>{chCfg.label}</span>
                      </div>
                      <p className="text-[8px] text-gray-400 mt-0.5">{c.startDate} → {c.endDate}</p>

                      {/* Budget bar */}
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-[8px] mb-0.5">
                          <span className="text-gray-400">Budget: {fmtVND(c.spent)}₫ / {fmtVND(c.budget)}₫</span>
                          <span className="text-gray-500">{budgetUsed}%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${budgetUsed > 90 ? "bg-red-400" : budgetUsed > 70 ? "bg-amber-400" : "bg-green-400"}`}
                            style={{ width: `${Math.min(budgetUsed, 100)}%` }} />
                        </div>
                      </div>

                      {/* Funnel metrics */}
                      <div className="flex items-center gap-1 mt-2 text-[8px] overflow-x-auto">
                        <span className="bg-gray-50 rounded px-1.5 py-1 text-gray-500 whitespace-nowrap">{c.leads} Leads</span>
                        <span className="text-gray-300">→</span>
                        <span className="bg-blue-50 rounded px-1.5 py-1 text-blue-600 whitespace-nowrap">{c.mqls} MQL</span>
                        <span className="text-gray-300">→</span>
                        <span className="bg-violet-50 rounded px-1.5 py-1 text-violet-600 whitespace-nowrap">{c.sqls} SQL</span>
                        <span className="text-gray-300">��</span>
                        <span className="bg-amber-50 rounded px-1.5 py-1 text-amber-600 whitespace-nowrap">{c.opportunities} Opp</span>
                        <span className="text-gray-300">→</span>
                        <span className="bg-green-50 rounded px-1.5 py-1 text-green-600 whitespace-nowrap">{c.wonDeals} Won</span>
                      </div>

                      {/* KPIs */}
                      <div className="flex items-center gap-4 mt-2 text-[8px] text-gray-400 flex-wrap">
                        <span>💰 Revenue: <strong className="text-green-600">{fmtVND(c.revenue)}₫</strong></span>
                        <span className={c.roas >= 30 ? "text-green-600" : c.roas >= 15 ? "text-amber-600" : "text-red-600"}>
                          📊 ROAS: <strong>{c.roas.toFixed(1)}x</strong>
                        </span>
                        <span>💵 CPL: {fmtVND(c.cpl)}₫</span>
                        <span>🎯 CAC: {fmtVND(c.cac)}₫</span>
                        <span>📈 CVR: {c.conversionRate}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          )}
        </>
      )}

      {/* === Channels Tab === */}
      {activeTab === "channels" && (
        <div className="space-y-2">
          {channelSummary.map((ch) => {
            const cfg = CHANNEL_CFG[ch.channel];
            return (
              <div key={ch.channel} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{cfg.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-900">{cfg.label}</span>
                      <span className={`text-sm ${ch.roas >= 30 ? "text-green-600" : ch.roas >= 15 ? "text-amber-600" : "text-red-600"}`}>{ch.roas.toFixed(1)}x ROAS</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-[9px] text-gray-400">
                      <span>Chi: {fmtVND(ch.spent)}₫</span>
                      <span>Thu: <strong className="text-green-600">{fmtVND(ch.revenue)}₫</strong></span>
                      <span>{ch.leads} leads</span>
                      <span>{ch.wonDeals} won</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${ch.roas >= 30 ? "bg-green-400" : ch.roas >= 15 ? "bg-amber-400" : "bg-red-400"}`}
                        style={{ width: `${Math.min((ch.roas / 60) * 100, 100)}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === Funnel Tab === */}
      {activeTab === "funnel" && (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-900 mb-4">Tổng hợp Funnel — Tất cả Chiến dịch</h3>
          {(() => {
            const totalLeads = campaigns.reduce((s, c) => s + c.leads, 0);
            const totalMqls = campaigns.reduce((s, c) => s + c.mqls, 0);
            const totalSqls = campaigns.reduce((s, c) => s + c.sqls, 0);
            const totalOpps = campaigns.reduce((s, c) => s + c.opportunities, 0);
            const totalWon = campaigns.reduce((s, c) => s + c.wonDeals, 0);
            const stages = [
              { name: "Leads", value: totalLeads, color: "bg-gray-400" },
              { name: "MQL", value: totalMqls, color: "bg-blue-400" },
              { name: "SQL", value: totalSqls, color: "bg-violet-400" },
              { name: "Opportunities", value: totalOpps, color: "bg-amber-400" },
              { name: "Won Deals", value: totalWon, color: "bg-green-400" },
            ];
            return (
              <div className="space-y-3">
                {stages.map((st, idx) => {
                  const pct = (st.value / totalLeads) * 100;
                  const prevValue = idx > 0 ? stages[idx - 1].value : st.value;
                  const convRate = prevValue > 0 ? ((st.value / prevValue) * 100).toFixed(1) : "—";
                  return (
                    <div key={st.name}>
                      <div className="flex items-center justify-between text-[9px] mb-0.5">
                        <span className="text-gray-700">{st.name}</span>
                        <span className="text-gray-500">{st.value.toLocaleString()} {idx > 0 ? `(${convRate}% từ ${stages[idx - 1].name})` : ""}</span>
                      </div>
                      <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${st.color} flex items-center justify-end pr-2`}
                          style={{ width: `${Math.max(pct, 3)}%` }}>
                          {pct > 10 && <span className="text-[7px] text-white">{pct.toFixed(1)}%</span>}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="bg-gray-50 rounded-lg p-3 text-center text-[9px] text-gray-500 mt-3">
                  Lead → Won conversion rate: <strong className="text-gray-900">{((totalWon / totalLeads) * 100).toFixed(2)}%</strong> | 
                  Avg deal cycle: <strong className="text-gray-900">42 ngày</strong> | 
                  LTV/CAC ratio: <strong className="text-green-600">8.2x</strong>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-pink-600" />
          <h4 className="text-sm text-pink-900">AI Campaign ROI Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-pink-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span><strong>Referral Program</strong> đạt <strong>ROAS 60x</strong> — cao nhất, CAC thấp nhất (<strong>8M₫</strong>). AI recommend: tăng budget gấp đôi (300M → 600M₫) + tạo <strong>tiered rewards</strong> (silver/gold/platinum referrer). Estimated impact: +<strong>15 deals/quarter</strong>.</span>
          </p>
          <p className="flex items-start gap-2">
            <TrendingDown className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <span><strong>Google Ads</strong> có <strong>ROAS thấp nhất (14x)</strong> và CAC cao nhất (<strong>35.5M₫</strong>). AI phát hiện: 45% budget vào <strong>broad keywords</strong> có CVR 0.3%. Đề xuất: reallocate 150M₫ sang <strong>exact match + competitor keywords</strong> — tăng ROAS lên ~22x.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>AI optimal budget allocation: <strong>Referral 25%</strong>, Webinar 20%, Email 15%, SEO 15%, Partner 10%, Social 8%, Content 5%, SEM 2%. Nếu apply, estimated overall <strong>ROAS tăng từ 29x → 42x</strong>, tiết kiệm <strong>280M₫/quarter</strong>.</span>
          </p>
        </div>
      </div>
      {showCreateModal && <CreateCampaignModal onClose={() => setShowCreateModal(false)} onCreated={(c) => setCampaigns((prev) => [c, ...prev])} />}
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        itemName={deleteTarget?.label ?? ""}
        entityType="chiến dịch"
        description="Thao tác này không thể hoàn tác. Dữ liệu ROI sẽ bị đánh dấu xóa."
        loading={deleting}
      />
    </div>
  );
}