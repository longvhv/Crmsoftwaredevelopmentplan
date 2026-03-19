/**
 * Multi-Currency Manager — Quản lý Đa Tiền tệ
 * Exchange rates, currency conversions, FX exposure,
 * deal value tracking in multiple currencies, rate history.
 */
import { useState, useMemo } from "react";
import {
  Banknote,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Plus,
  Settings,
  Sparkles,
  Bot,
  Globe,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart3,
  ArrowLeftRight,
  X,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rateToVND: number;
  prevRate: number;
  change24h: number;
  isBase: boolean;
  isActive: boolean;
  dealsCount: number;
  totalValueVND: number;
  lastUpdated: string;
}

interface FXExposure {
  currency: string;
  symbol: string;
  flag: string;
  openDeals: number;
  totalValueOriginal: number;
  totalValueVND: number;
  unrealizedGainLoss: number;
  percentOfPortfolio: number;
}

interface ConversionLog {
  id: string;
  from: string;
  to: string;
  amount: number;
  rate: number;
  result: number;
  date: string;
  deal: string;
}

/* ============================================================
 * Mock Data
 * ============================================================ */
const MOCK_CURRENCIES: Currency[] = [
  { code: "VND", name: "Đồng Việt Nam", symbol: "₫", flag: "🇻🇳", rateToVND: 1, prevRate: 1, change24h: 0, isBase: true, isActive: true, dealsCount: 245, totalValueVND: 125000000000, lastUpdated: "2026-03-03 09:00" },
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸", rateToVND: 25380, prevRate: 25350, change24h: 0.12, isBase: false, isActive: true, dealsCount: 87, totalValueVND: 89000000000, lastUpdated: "2026-03-03 09:00" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺", rateToVND: 27450, prevRate: 27520, change24h: -0.25, isBase: false, isActive: true, dealsCount: 32, totalValueVND: 28500000000, lastUpdated: "2026-03-03 09:00" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵", rateToVND: 170, prevRate: 168.5, change24h: 0.89, isBase: false, isActive: true, dealsCount: 18, totalValueVND: 15200000000, lastUpdated: "2026-03-03 09:00" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬", rateToVND: 18950, prevRate: 18920, change24h: 0.16, isBase: false, isActive: true, dealsCount: 24, totalValueVND: 12800000000, lastUpdated: "2026-03-03 09:00" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧", rateToVND: 32100, prevRate: 32250, change24h: -0.47, isBase: false, isActive: true, dealsCount: 11, totalValueVND: 8500000000, lastUpdated: "2026-03-03 09:00" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺", rateToVND: 16420, prevRate: 16380, change24h: 0.24, isBase: false, isActive: true, dealsCount: 8, totalValueVND: 4200000000, lastUpdated: "2026-03-03 09:00" },
  { code: "KRW", name: "Korean Won", symbol: "₩", flag: "🇰🇷", rateToVND: 17.5, prevRate: 17.6, change24h: -0.57, isBase: false, isActive: true, dealsCount: 14, totalValueVND: 6800000000, lastUpdated: "2026-03-03 09:00" },
  { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭", rateToVND: 720, prevRate: 718, change24h: 0.28, isBase: false, isActive: false, dealsCount: 3, totalValueVND: 1200000000, lastUpdated: "2026-03-03 09:00" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥", flag: "🇨🇳", rateToVND: 3480, prevRate: 3470, change24h: 0.29, isBase: false, isActive: false, dealsCount: 5, totalValueVND: 3100000000, lastUpdated: "2026-03-03 09:00" },
];

const MOCK_FX_EXPOSURE: FXExposure[] = [
  { currency: "USD", symbol: "$", flag: "🇺🇸", openDeals: 42, totalValueOriginal: 3500000, totalValueVND: 88830000000, unrealizedGainLoss: 1260000000, percentOfPortfolio: 30.2 },
  { currency: "EUR", symbol: "€", flag: "🇪🇺", openDeals: 18, totalValueOriginal: 850000, totalValueVND: 23332500000, unrealizedGainLoss: -595000000, percentOfPortfolio: 9.7 },
  { currency: "JPY", symbol: "¥", flag: "🇯🇵", openDeals: 12, totalValueOriginal: 85000000, totalValueVND: 14450000000, unrealizedGainLoss: 1275000000, percentOfPortfolio: 5.2 },
  { currency: "SGD", symbol: "S$", flag: "🇸🇬", openDeals: 15, totalValueOriginal: 620000, totalValueVND: 11749000000, unrealizedGainLoss: 186000000, percentOfPortfolio: 4.3 },
  { currency: "GBP", symbol: "£", flag: "🇬🇧", openDeals: 7, totalValueOriginal: 215000, totalValueVND: 6901500000, unrealizedGainLoss: -322500000, percentOfPortfolio: 2.9 },
];

const MOCK_LOGS: ConversionLog[] = [
  { id: "cvt_001", from: "USD", to: "VND", amount: 150000, rate: 25380, result: 3807000000, date: "2026-03-03", deal: "Deal #1087 — CloudFirst Enterprise" },
  { id: "cvt_002", from: "EUR", to: "VND", amount: 85000, rate: 27450, result: 2333250000, date: "2026-03-02", deal: "Deal #1092 — TechEU GmbH" },
  { id: "cvt_003", from: "JPY", to: "VND", amount: 12000000, rate: 170, result: 2040000000, date: "2026-03-01", deal: "Deal #1078 — Sakura Systems" },
  { id: "cvt_004", from: "SGD", to: "VND", amount: 45000, rate: 18950, result: 852750000, date: "2026-02-28", deal: "Deal #1065 — SEA Digital Pte" },
  { id: "cvt_005", from: "GBP", to: "USD", amount: 50000, rate: 1.265, result: 63250, date: "2026-02-27", deal: "Deal #1054 — LondonTech Ltd" },
];

const fmtVND = (n: number) => {
  if (Math.abs(n) >= 1e12) return `${(n / 1e12).toFixed(1)}T`;
  if (Math.abs(n) >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  return n.toLocaleString("vi-VN");
};

const fmtCur = (n: number, symbol: string) => `${symbol}${n.toLocaleString("en-US")}`;

type Tab = "rates" | "exposure" | "converter" | "history";

/* ============================================================
 * Add Currency Modal
 * ============================================================ */
function AddCurrencyModal({ onClose, onCreated }: { onClose: () => void; onCreated: (c: Currency) => void }) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [flag, setFlag] = useState("🏳️");
  const [rateToVND, setRateToVND] = useState(1);
  const [saving, setSaving] = useState(false);

  const presets = [
    { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳", rate: 305 },
    { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", flag: "🇲🇾", rate: 5700 },
    { code: "TWD", name: "Taiwan Dollar", symbol: "NT$", flag: "🇹🇼", rate: 790 },
    { code: "HKD", name: "Hong Kong Dollar", symbol: "HK$", flag: "🇭🇰", rate: 3250 },
    { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭", rate: 28500 },
  ];

  const handlePreset = (p: typeof presets[0]) => {
    setCode(p.code);
    setName(p.name);
    setSymbol(p.symbol);
    setFlag(p.flag);
    setRateToVND(p.rate);
  };

  const handleSave = () => {
    if (!code.trim() || !name.trim()) { toast.error("Vui lòng nhập mã và tên tiền tệ"); return; }
    setSaving(true);
    const newCurrency: Currency = {
      code: code.toUpperCase(), name, symbol: symbol || code, flag, rateToVND, prevRate: rateToVND,
      change24h: 0, isBase: false, isActive: true, dealsCount: 0, totalValueVND: 0,
      lastUpdated: new Date().toISOString().slice(0, 16).replace("T", " "),
    };
    onCreated(newCurrency);
    toast.success(`Đã thêm tiền tệ "${code.toUpperCase()} — ${name}"`);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Thêm Tiền tệ mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Chọn nhanh</label>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <button key={p.code} type="button" onClick={() => handlePreset(p)}
                  className="flex items-center gap-1 px-2 py-1 text-[10px] bg-gray-50 border border-gray-200 rounded-lg hover:bg-emerald-50 hover:border-emerald-200">
                  <span>{p.flag}</span> <span>{p.code}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Mã tiền tệ *</label>
              <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} maxLength={3} placeholder="USD"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 uppercase" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Ký hiệu</label>
              <input type="text" value={symbol} onChange={(e) => setSymbol(e.target.value)} placeholder="$"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Cờ</label>
              <input type="text" value={flag} onChange={(e) => setFlag(e.target.value)} placeholder="🇺🇸"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tên đầy đủ *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="US Dollar"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tỷ giá (1 đơn vị = ? VNĐ)</label>
            <input type="number" value={rateToVND} onChange={(e) => setRateToVND(Number(e.target.value))} min={0} step={0.01}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50">
            {saving ? "Đang thêm..." : "Thêm tiền tệ"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Component
 * ============================================================ */
export function MultiCurrencyPage() {
  const [activeTab, setActiveTab] = useState<Tab>("rates");
  const [search, setSearch] = useState("");
  const [convertFrom, setConvertFrom] = useState("USD");
  const [convertTo, setConvertTo] = useState("VND");
  const [convertAmount, setConvertAmount] = useState("10000");
  const [currencies, setCurrencies] = useState(MOCK_CURRENCIES);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleAddCurrency = (c: Currency) => {
    setCurrencies((prev) => [...prev, c]);
  };

  const filteredCurrencies = useMemo(() => {
    if (!search) return currencies;
    const q = search.toLowerCase();
    return currencies.filter((c) => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q));
  }, [search]);

  const stats = useMemo(() => {
    const totalValueVND = currencies.reduce((s, c) => s + c.totalValueVND, 0);
    const totalDeals = currencies.reduce((s, c) => s + c.dealsCount, 0);
    const activeCurrencies = currencies.filter((c) => c.isActive).length;
    const unrealizedTotal = MOCK_FX_EXPOSURE.reduce((s, e) => s + e.unrealizedGainLoss, 0);
    return { totalValueVND, totalDeals, activeCurrencies, unrealizedTotal };
  }, [currencies]);

  const convertResult = useMemo(() => {
    const amt = parseFloat(convertAmount) || 0;
    const from = currencies.find((c) => c.code === convertFrom);
    const to = currencies.find((c) => c.code === convertTo);
    if (!from || !to || amt <= 0) return null;
    const valueVND = amt * from.rateToVND;
    const result = valueVND / to.rateToVND;
    const rate = from.rateToVND / to.rateToVND;
    return { result, rate, fromSymbol: from.symbol, toSymbol: to.symbol };
  }, [convertFrom, convertTo, convertAmount]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "rates", label: "Tỷ giá" },
    { key: "exposure", label: "FX Exposure" },
    { key: "converter", label: "Quy đổi" },
    { key: "history", label: "Lịch sử" },
  ];

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Banknote className="w-6 h-6 text-emerald-600" /> Multi-Currency Manager
          </h1>
          <p className="text-gray-500 mt-0.5">Quản lý đa tiền tệ — tỷ giá, quy đổi, FX exposure, lịch sử giao dịch</p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <button type="button" onClick={() => toast.success("Đã cập nhật tỷ giá từ ECB/XE")}
            className="flex items-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700">
            <RefreshCw className="w-4 h-4" /> Cập nhật tỷ giá
          </button>
          <button type="button" onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-1 px-3 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50">
            <Plus className="w-4 h-4" /> Thêm
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-white rounded-xl border border-gray-100 p-2.5 text-center">
          <p className="text-lg text-gray-900">{stats.activeCurrencies}</p>
          <p className="text-[9px] text-gray-400">Tiền tệ hoạt động</p>
        </div>
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-2.5 text-center">
          <p className="text-lg text-emerald-600">{fmtVND(stats.totalValueVND)}₫</p>
          <p className="text-[9px] text-emerald-700">Tổng giá trị Deal</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{stats.totalDeals}</p>
          <p className="text-[9px] text-blue-700">Deals đa tiền tệ</p>
        </div>
        <div className={`rounded-xl border p-2.5 text-center ${stats.unrealizedTotal >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
          <p className={`text-lg ${stats.unrealizedTotal >= 0 ? "text-green-600" : "text-red-600"}`}>
            {stats.unrealizedTotal >= 0 ? "+" : ""}{fmtVND(stats.unrealizedTotal)}₫
          </p>
          <p className="text-[9px] text-gray-500">Lãi/Lỗ FX chưa thực hiện</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
              activeTab === t.key ? "bg-emerald-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* === Rates Tab === */}
      {activeTab === "rates" && (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Tìm tiền tệ..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm" />
          </div>
          <div className="space-y-2">
            {filteredCurrencies.map((c) => (
              <div key={c.code} className={`bg-white rounded-xl border p-4 ${c.isBase ? "border-emerald-200 bg-emerald-50/30" : "border-gray-100"}`}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{c.flag}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-gray-900">{c.code}</span>
                      <span className="text-[10px] text-gray-400">{c.name}</span>
                      {c.isBase && <span className="text-[7px] px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded border border-emerald-200">Base Currency</span>}
                      {!c.isActive && <span className="text-[7px] px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded">Inactive</span>}
                    </div>
                    <div className="flex items-center gap-4 mt-1 text-[9px] text-gray-400">
                      <span>{c.dealsCount} deals</span>
                      <span>Giá trị: {fmtVND(c.totalValueVND)}₫</span>
                      <span>Cập nhật: {c.lastUpdated}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {!c.isBase && (
                      <>
                        <p className="text-sm text-gray-900">{c.rateToVND.toLocaleString("vi-VN")}₫</p>
                        <p className={`text-[9px] flex items-center justify-end gap-0.5 ${
                          c.change24h > 0 ? "text-green-600" : c.change24h < 0 ? "text-red-600" : "text-gray-400"
                        }`}>
                          {c.change24h > 0 ? <ArrowUpRight className="w-2.5 h-2.5" /> : c.change24h < 0 ? <ArrowDownRight className="w-2.5 h-2.5" /> : null}
                          {c.change24h > 0 ? "+" : ""}{c.change24h}%
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* === FX Exposure Tab === */}
      {activeTab === "exposure" && (
        <div className="space-y-3">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm text-gray-900 mb-3">FX Exposure theo Tiền tệ</h3>
            {MOCK_FX_EXPOSURE.map((exp) => {
              const maxPercent = Math.max(...MOCK_FX_EXPOSURE.map((e) => e.percentOfPortfolio));
              return (
                <div key={exp.currency} className="mb-3 last:mb-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{exp.flag}</span>
                      <span className="text-[10px] text-gray-700">{exp.currency}</span>
                      <span className="text-[8px] text-gray-400">{exp.openDeals} deals</span>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-900">{fmtCur(exp.totalValueOriginal, exp.symbol)} → {fmtVND(exp.totalValueVND)}₫</p>
                      <p className={`text-[8px] ${exp.unrealizedGainLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                        FX {exp.unrealizedGainLoss >= 0 ? "+" : ""}{fmtVND(exp.unrealizedGainLoss)}₫
                      </p>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${exp.unrealizedGainLoss >= 0 ? "bg-emerald-400" : "bg-red-400"}`}
                      style={{ width: `${(exp.percentOfPortfolio / maxPercent) * 100}%` }} />
                  </div>
                  <p className="text-[7px] text-gray-400 mt-0.5">{exp.percentOfPortfolio}% tổng portfolio</p>
                </div>
              );
            })}
          </div>

          <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h4 className="text-sm text-amber-800">Cảnh báo FX Risk</h4>
            </div>
            <ul className="space-y-1.5 text-sm text-amber-700">
              <li>• <strong>EUR exposure giảm -0.25%</strong> trong 24h → lỗ chưa thực hiện <strong>-595M₫</strong> trên 18 deals. Nên xem xét hedging.</li>
              <li>• <strong>GBP yếu (-0.47%)</strong> ảnh hưởng 7 deals. Tổng lỗ FX: <strong>-322.5M₫</strong>.</li>
              <li>• <strong>JPY mạnh (+0.89%)</strong> → lãi FX <strong>+1.275B₫</strong>. AI đề xuất close deals JPY sớm để lock profit.</li>
            </ul>
          </div>
        </div>
      )}

      {/* === Converter Tab === */}
      {activeTab === "converter" && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 max-w-lg mx-auto">
          <h3 className="text-sm text-gray-900 mb-4 text-center">Quy đổi Tiền tệ</h3>
          <div className="space-y-4">
            <div>
              <label className="text-[9px] text-gray-400 mb-1 block">Số tiền</label>
              <div className="flex items-center gap-2">
                <select value={convertFrom} onChange={(e) => setConvertFrom(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white w-24">
                  {currencies.map((c) => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                </select>
                <input type="number" value={convertAmount} onChange={(e) => setConvertAmount(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" placeholder="Nhập số tiền" />
              </div>
            </div>

            <div className="flex items-center justify-center">
              <button type="button" onClick={() => { setConvertFrom(convertTo); setConvertTo(convertFrom); }}
                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                <ArrowLeftRight className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            <div>
              <label className="text-[9px] text-gray-400 mb-1 block">Quy đổi sang</label>
              <div className="flex items-center gap-2">
                <select value={convertTo} onChange={(e) => setConvertTo(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white w-24">
                  {currencies.map((c) => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                </select>
                <div className="flex-1 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg text-sm text-emerald-700">
                  {convertResult ? convertResult.result.toLocaleString("en-US", { maximumFractionDigits: 2 }) : "—"}
                </div>
              </div>
            </div>

            {convertResult && (
              <p className="text-center text-[9px] text-gray-400">
                1 {convertFrom} = {convertResult.rate.toLocaleString("en-US", { maximumFractionDigits: 4 })} {convertTo}
              </p>
            )}
          </div>
        </div>
      )}

      {/* === History Tab === */}
      {activeTab === "history" && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[9px]">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-2.5 px-3">Ngày</th>
                  <th className="text-left py-2.5 px-2">Từ</th>
                  <th className="text-left py-2.5 px-2">Sang</th>
                  <th className="text-right py-2.5 px-2">Số tiền</th>
                  <th className="text-right py-2.5 px-2">Tỷ giá</th>
                  <th className="text-right py-2.5 px-2">Kết quả</th>
                  <th className="text-left py-2.5 px-3">Deal</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_LOGS.map((log) => (
                  <tr key={log.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 px-3 text-gray-500 whitespace-nowrap">{log.date}</td>
                    <td className="py-2 px-2 text-gray-800">{log.from}</td>
                    <td className="py-2 px-2 text-gray-800">{log.to}</td>
                    <td className="py-2 px-2 text-right text-gray-700">{log.amount.toLocaleString("en-US")}</td>
                    <td className="py-2 px-2 text-right text-gray-500">{log.rate.toLocaleString("en-US")}</td>
                    <td className="py-2 px-2 text-right text-emerald-600">{log.result.toLocaleString("en-US")}</td>
                    <td className="py-2 px-3 text-gray-500 truncate max-w-[180px]">{log.deal}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <h4 className="text-sm text-emerald-900">AI Currency Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-emerald-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>JPY đang mạnh lên <strong>+0.89%</strong>. AI đề xuất <strong>ưu tiên close 12 deals JPY</strong> trước cuối tuần để lock-in lãi FX <strong>+1.275B₫</strong>. Dự báo JPY sẽ điều chỉnh -0.3% tuần sau.</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span>Tỷ trọng USD chiếm <strong>30.2% portfolio</strong> — vượt ngưỡng 25% khuyến nghị. Diversification score: <strong>C+</strong>. Đề xuất tăng deals EUR/SGD để cân bằng.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>Mô hình FX forecast: <strong>USD/VND sẽ tăng ~0.5%</strong> trong Q2 (Fed hawkish). Recommend: <strong>invoice deals USD sớm</strong> hoặc set forward contracts. Tiết kiệm ước tính: <strong>450M₫</strong>.</span>
          </p>
        </div>
      </div>
      {showCreateModal && <AddCurrencyModal onClose={() => setShowCreateModal(false)} onCreated={handleAddCurrency} />}
    </div>
  );
}