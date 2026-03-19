/**
 * CPQ — Configure, Price, Quote
 * Product configuration, pricing rules, discount tiers,
 * quote generation, approval workflows, e-sign integration.
 */
import { useState, useMemo } from "react";
import {
  SlidersVertical,
  Plus,
  Search,
  Sparkles,
  Bot,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  Send,
  Download,
  Eye,
  Copy,
  DollarSign,
  Package,
  Layers,
  Target,
  TrendingUp,
  Zap,
  FileText,
  Lock,
  Percent,
  Calculator,
  ArrowRight,
  X,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
type QuoteStatus = "draft" | "review" | "approved" | "sent" | "accepted" | "rejected" | "expired";

interface QuoteLineItem {
  id: string;
  product: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  total: number;
}

interface Quote {
  id: string;
  number: string;
  customer: string;
  deal: string;
  status: QuoteStatus;
  createdDate: string;
  expiryDate: string;
  createdBy: string;
  lineItems: QuoteLineItem[];
  subtotal: number;
  totalDiscount: number;
  tax: number;
  grandTotal: number;
  currency: string;
  approvalRequired: boolean;
  approver: string | null;
  version: number;
  aiOptimized: boolean;
}

interface PricingRule {
  id: string;
  name: string;
  description: string;
  type: "volume" | "bundle" | "loyalty" | "seasonal" | "competitive";
  isActive: boolean;
  timesApplied: number;
  revenueImpact: number;
}

/* ============================================================
 * Constants & Mock Data
 * ============================================================ */
const STATUS_CFG: Record<QuoteStatus, { label: string; color: string; bg: string }> = {
  draft: { label: "Bản nháp", color: "text-gray-500", bg: "bg-gray-50 border-gray-200" },
  review: { label: "Chờ duyệt", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  approved: { label: "Đã duyệt", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  sent: { label: "Đã gửi", color: "text-violet-600", bg: "bg-violet-50 border-violet-200" },
  accepted: { label: "Chấp nhận", color: "text-green-600", bg: "bg-green-50 border-green-200" },
  rejected: { label: "Từ chối", color: "text-red-600", bg: "bg-red-50 border-red-200" },
  expired: { label: "Hết hạn", color: "text-gray-400", bg: "bg-gray-50 border-gray-200" },
};

const fmtVND = (n: number) => {
  if (Math.abs(n) >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (Math.abs(n) >= 1e6) return `${(n / 1e6).toFixed(0)}M`;
  return n.toLocaleString("vi-VN");
};

const MOCK_QUOTES: Quote[] = [
  {
    id: "q_001", number: "Q-2026-0089", customer: "TechGlobal Corp", deal: "Deal #1042", status: "review",
    createdDate: "2026-03-01", expiryDate: "2026-03-31", createdBy: "Trần Minh Đức", version: 2, aiOptimized: true,
    approvalRequired: true, approver: "Sales Director",
    lineItems: [
      { id: "li1", product: "AI-CRM Enterprise License", sku: "CRM-ENT-100", quantity: 100, unitPrice: 25000000, discount: 12, total: 2200000000 },
      { id: "li2", product: "AI Agent Add-on (5 agents)", sku: "AI-AGT-5", quantity: 1, unitPrice: 600000000, discount: 10, total: 540000000 },
      { id: "li3", product: "Professional Services", sku: "PS-IMP-ENT", quantity: 1, unitPrice: 350000000, discount: 0, total: 350000000 },
      { id: "li4", product: "Priority Support 24/7", sku: "SUP-PRI-12", quantity: 12, unitPrice: 15000000, discount: 0, total: 180000000 },
    ],
    subtotal: 3270000000, totalDiscount: 340000000, tax: 327000000, grandTotal: 3257000000, currency: "VND",
  },
  {
    id: "q_002", number: "Q-2026-0090", customer: "SEA Digital Pte", deal: "Deal #1058", status: "sent",
    createdDate: "2026-02-28", expiryDate: "2026-03-28", createdBy: "AI Agent — Luna", version: 1, aiOptimized: true,
    approvalRequired: false, approver: null,
    lineItems: [
      { id: "li1", product: "AI-CRM Professional License", sku: "CRM-PRO-25", quantity: 25, unitPrice: 15000000, discount: 8, total: 345000000 },
      { id: "li2", product: "Data Enrichment Module", sku: "MOD-ENRICH", quantity: 1, unitPrice: 120000000, discount: 0, total: 120000000 },
    ],
    subtotal: 465000000, totalDiscount: 30000000, tax: 46500000, grandTotal: 481500000, currency: "VND",
  },
  {
    id: "q_003", number: "Q-2026-0091", customer: "EuroFinance AG", deal: "Deal #1060", status: "draft",
    createdDate: "2026-03-03", expiryDate: "2026-04-03", createdBy: "Hoàng Thị Linh", version: 1, aiOptimized: false,
    approvalRequired: true, approver: "Sales Director",
    lineItems: [
      { id: "li1", product: "AI-CRM Enterprise License", sku: "CRM-ENT-200", quantity: 200, unitPrice: 22000000, discount: 15, total: 3740000000 },
      { id: "li2", product: "AI Agent Add-on (10 agents)", sku: "AI-AGT-10", quantity: 1, unitPrice: 1100000000, discount: 10, total: 990000000 },
      { id: "li3", product: "Multi-Region Deployment", sku: "INFRA-MR", quantity: 1, unitPrice: 500000000, discount: 0, total: 500000000 },
      { id: "li4", product: "Professional Services", sku: "PS-IMP-ENT", quantity: 1, unitPrice: 450000000, discount: 5, total: 427500000 },
      { id: "li5", product: "Compliance Package (GDPR)", sku: "COMP-GDPR", quantity: 1, unitPrice: 200000000, discount: 0, total: 200000000 },
    ],
    subtotal: 5857500000, totalDiscount: 832500000, tax: 585750000, grandTotal: 5610750000, currency: "VND",
  },
  {
    id: "q_004", number: "Q-2026-0085", customer: "Sakura Systems", deal: "Renewal", status: "accepted",
    createdDate: "2026-02-20", expiryDate: "2026-03-20", createdBy: "Phạm Văn Khôi", version: 3, aiOptimized: true,
    approvalRequired: false, approver: null,
    lineItems: [
      { id: "li1", product: "AI-CRM Enterprise Renewal (100 seats)", sku: "CRM-ENT-R100", quantity: 1, unitPrice: 2100000000, discount: 5, total: 1995000000 },
      { id: "li2", product: "Expansion +50 seats", sku: "CRM-ENT-EXP50", quantity: 50, unitPrice: 23000000, discount: 8, total: 1058000000 },
    ],
    subtotal: 3053000000, totalDiscount: 197000000, tax: 305300000, grandTotal: 3160800000, currency: "VND",
  },
  {
    id: "q_005", number: "Q-2026-0082", customer: "DataDriven Inc", deal: "Deal #1055", status: "rejected",
    createdDate: "2026-02-15", expiryDate: "2026-03-15", createdBy: "Nguyễn Thị Hương", version: 2, aiOptimized: false,
    approvalRequired: false, approver: null,
    lineItems: [
      { id: "li1", product: "AI-CRM Starter License", sku: "CRM-STR-10", quantity: 10, unitPrice: 8000000, discount: 0, total: 80000000 },
    ],
    subtotal: 80000000, totalDiscount: 0, tax: 8000000, grandTotal: 88000000, currency: "VND",
  },
];

const MOCK_RULES: PricingRule[] = [
  { id: "pr_01", name: "Volume Discount (50+ seats)", description: "Giảm 8% cho đơn hàng ≥50 seats, 12% cho ≥100, 15% cho ≥200", type: "volume", isActive: true, timesApplied: 45, revenueImpact: -2400000000 },
  { id: "pr_02", name: "Bundle: CRM + AI Agents", description: "Giảm 10% khi mua CRM license + AI Agent Add-on combo", type: "bundle", isActive: true, timesApplied: 28, revenueImpact: -850000000 },
  { id: "pr_03", name: "Loyalty Renewal Discount", description: "Giảm 5% cho khách hàng gia hạn từ năm thứ 2, 8% từ năm thứ 3", type: "loyalty", isActive: true, timesApplied: 18, revenueImpact: -620000000 },
  { id: "pr_04", name: "Q1 2026 Promotion", description: "Giảm thêm 5% cho hợp đồng ký trong Q1/2026", type: "seasonal", isActive: false, timesApplied: 12, revenueImpact: -180000000 },
  { id: "pr_05", name: "Competitive Switch Offer", description: "Giảm 20% năm đầu cho khách chuyển từ Salesforce/HubSpot", type: "competitive", isActive: true, timesApplied: 8, revenueImpact: -960000000 },
];

type Tab = "quotes" | "configure" | "rules";

/* ============================================================
 * Create Quote Modal
 * ============================================================ */
function CreateQuoteModal({ onClose, onCreated }: { onClose: () => void; onCreated: (q: Quote) => void }) {
  const [customer, setCustomer] = useState("");
  const [deal, setDeal] = useState("");
  const [productName, setProductName] = useState("AI-CRM Enterprise License");
  const [quantity, setQuantity] = useState(10);
  const [unitPrice, setUnitPrice] = useState(25000000);
  const [discount, setDiscount] = useState(0);
  const [expiryDays, setExpiryDays] = useState(30);
  const [aiOptimized, setAiOptimized] = useState(true);
  const [saving, setSaving] = useState(false);

  const lineTotal = quantity * unitPrice * (1 - discount / 100);
  const tax = lineTotal * 0.1;

  const handleSave = () => {
    if (!customer.trim()) { toast.error("Vui lòng nhập tên khách hàng"); return; }
    setSaving(true);
    const today = new Date();
    const expiry = new Date(today.getTime() + expiryDays * 86400000);
    const number = `Q-2026-${String(Math.floor(Math.random() * 9000 + 1000))}`;
    const lineItem: QuoteLineItem = {
      id: `li_${Date.now()}`, product: productName, sku: `SKU-${Date.now().toString(36).slice(-4).toUpperCase()}`,
      quantity, unitPrice, discount, total: lineTotal,
    };
    const newQuote: Quote = {
      id: `q_${Date.now()}`, number, customer, deal: deal || "Chưa liên kết", status: "draft",
      createdDate: today.toISOString().slice(0, 10), expiryDate: expiry.toISOString().slice(0, 10),
      createdBy: "Người dùng hiện tại", lineItems: [lineItem],
      subtotal: lineTotal, totalDiscount: quantity * unitPrice * discount / 100,
      tax, grandTotal: lineTotal + tax, currency: "VND",
      approvalRequired: lineTotal > 1000000000, approver: lineTotal > 1000000000 ? "Sales Director" : null,
      version: 1, aiOptimized,
    };
    onCreated(newQuote);
    toast.success(`Đã tạo báo giá "${number}" cho ${customer}`);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Tạo Báo giá mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Khách hàng *</label>
            <input type="text" value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="VD: TechGlobal Corp"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Deal liên kết</label>
            <input type="text" value={deal} onChange={(e) => setDeal(e.target.value)} placeholder="VD: Deal #1042"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
          </div>
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
            <p className="text-[10px] text-gray-500 mb-2">Sản phẩm chính (thêm sản phẩm sau khi tạo)</p>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tên sản phẩm</label>
              <input type="text" value={productName} onChange={(e) => setProductName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Số lượng</label>
                <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min={1}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Đơn giá</label>
                <input type="number" value={unitPrice} onChange={(e) => setUnitPrice(Number(e.target.value))} min={0}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Giảm giá %</label>
                <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} min={0} max={100}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Hiệu lực (ngày)</label>
              <input type="number" value={expiryDays} onChange={(e) => setExpiryDays(Number(e.target.value))} min={1}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={aiOptimized} onChange={(e) => setAiOptimized(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-sm text-gray-700">AI tối ưu giá</span>
              </label>
            </div>
          </div>
          <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100 text-sm">
            <div className="flex justify-between text-gray-600"><span>Tạm tính:</span><span>{fmtVND(lineTotal)}₫</span></div>
            <div className="flex justify-between text-gray-500 text-xs"><span>VAT (10%):</span><span>{fmtVND(tax)}₫</span></div>
            <div className="flex justify-between text-emerald-700 mt-1 border-t border-emerald-200 pt-1"><span>Tổng:</span><span>{fmtVND(lineTotal + tax)}₫</span></div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo báo giá"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Main Component
 * ============================================================ */
export function CpqPage() {
  const [activeTab, setActiveTab] = useState<Tab>("quotes");
  const [statusFilter, setStatusFilter] = useState<QuoteStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>("q_001");
  const [quotes, setQuotes] = useState(MOCK_QUOTES);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateQuote = (q: Quote) => {
    setQuotes((prev) => [q, ...prev]);
    setExpandedId(q.id);
  };

  const filtered = useMemo(() => {
    let result = quotes;
    if (statusFilter !== "all") result = result.filter((q) => q.status === statusFilter);
    if (search) {
      const q2 = search.toLowerCase();
      result = result.filter((q) => q.customer.toLowerCase().includes(q2) || q.number.toLowerCase().includes(q2));
    }
    return result;
  }, [quotes, statusFilter, search]);

  const stats = useMemo(() => ({
    totalValue: quotes.reduce((s, q) => s + q.grandTotal, 0),
    pendingValue: quotes.filter((q) => ["draft", "review"].includes(q.status)).reduce((s, q) => s + q.grandTotal, 0),
    acceptedValue: quotes.filter((q) => q.status === "accepted").reduce((s, q) => s + q.grandTotal, 0),
    avgDiscount: Math.round(quotes.reduce((s, q) => s + (q.subtotal > 0 ? (q.totalDiscount / q.subtotal) * 100 : 0), 0) / (quotes.length || 1)),
  }), [quotes]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "quotes", label: "Báo giá" },
    { key: "configure", label: "Cấu hình SP" },
    { key: "rules", label: "Pricing Rules" },
  ];

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <SlidersVertical className="w-6 h-6 text-emerald-600" /> CPQ — Configure, Price, Quote
          </h1>
          <p className="text-gray-500 mt-0.5">Cấu hình sản phẩm, định giá tự động, tạo báo giá, phê duyệt, e-sign</p>
        </div>
        <button type="button" onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1 px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 self-start">
          <Plus className="w-4 h-4" /> Tạo Báo giá
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-2.5 text-center">
          <p className="text-lg text-emerald-600">{fmtVND(stats.totalValue)}₫</p>
          <p className="text-[9px] text-emerald-700">Tổng giá trị BG</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{fmtVND(stats.pendingValue)}₫</p>
          <p className="text-[9px] text-blue-700">Đang chờ xử lý</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{fmtVND(stats.acceptedValue)}₫</p>
          <p className="text-[9px] text-green-700">Đã chấp nhận</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-2.5 text-center">
          <p className="text-lg text-amber-600">{stats.avgDiscount}%</p>
          <p className="text-[9px] text-amber-700">Discount TB</p>
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

      {/* === Quotes Tab === */}
      {activeTab === "quotes" && (
        <>
          <div className="flex items-center gap-2">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as QuoteStatus | "all")}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              <option value="all">Tất cả trạng thái</option>
              {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white"
              placeholder="Tìm kiếm khách hàng hoặc số báo giá" />
          </div>

          <div className="space-y-2">
            {filtered.map((q) => {
              const st = STATUS_CFG[q.status];
              const isExpanded = expandedId === q.id;
              return (
                <div key={q.id} className="bg-white rounded-xl border border-gray-100">
                  <button type="button" onClick={() => setExpandedId(isExpanded ? null : q.id)} className="w-full p-4 text-left">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm text-gray-900">{q.number}</span>
                          <span className={`text-[7px] px-1.5 py-0.5 rounded border ${st.bg} ${st.color}`}>{st.label}</span>
                          {q.aiOptimized && <span className="text-[7px] px-1.5 py-0.5 bg-violet-50 text-violet-600 rounded border border-violet-200">🤖 AI Optimized</span>}
                          {q.approvalRequired && q.status === "review" && <span className="text-[7px] px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded border border-amber-200">⏳ Chờ duyệt</span>}
                          <span className="text-[8px] text-gray-400">v{q.version}</span>
                        </div>
                        <p className="text-[9px] text-gray-500 mt-0.5">{q.customer} • {q.deal} • Tạo bởi: {q.createdBy}</p>
                        <p className="text-[8px] text-gray-400">Ngày tạo: {q.createdDate} • Hết hạn: {q.expiryDate}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg text-gray-900">{fmtVND(q.grandTotal)}₫</p>
                        {q.totalDiscount > 0 && <p className="text-[8px] text-red-500">-{fmtVND(q.totalDiscount)}₫ discount</p>}
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-50 pt-3">
                      <table className="w-full text-[9px]">
                        <thead>
                          <tr className="text-gray-400 border-b border-gray-100">
                            <th className="text-left pb-1.5">Sản phẩm</th>
                            <th className="text-right pb-1.5">SL</th>
                            <th className="text-right pb-1.5">Đơn giá</th>
                            <th className="text-right pb-1.5">Giảm</th>
                            <th className="text-right pb-1.5">Thành tiền</th>
                          </tr>
                        </thead>
                        <tbody>
                          {q.lineItems.map((li) => (
                            <tr key={li.id} className="border-b border-gray-50">
                              <td className="py-1.5 text-gray-700">{li.product}<br /><span className="text-gray-400">{li.sku}</span></td>
                              <td className="text-right text-gray-600">{li.quantity}</td>
                              <td className="text-right text-gray-600">{fmtVND(li.unitPrice)}₫</td>
                              <td className="text-right text-red-500">{li.discount > 0 ? `-${li.discount}%` : "—"}</td>
                              <td className="text-right text-gray-900">{fmtVND(li.total)}₫</td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="text-gray-600">
                          <tr><td colSpan={4} className="text-right pt-2">Tạm tính:</td><td className="text-right pt-2">{fmtVND(q.subtotal)}₫</td></tr>
                          {q.totalDiscount > 0 && <tr className="text-red-500"><td colSpan={4} className="text-right">Giảm giá:</td><td className="text-right">-{fmtVND(q.totalDiscount)}₫</td></tr>}
                          <tr><td colSpan={4} className="text-right">Thuế (10%):</td><td className="text-right">{fmtVND(q.tax)}₫</td></tr>
                          <tr className="text-gray-900"><td colSpan={4} className="text-right pt-1"><strong>Tổng cộng:</strong></td><td className="text-right pt-1"><strong>{fmtVND(q.grandTotal)}₫</strong></td></tr>
                        </tfoot>
                      </table>
                      <div className="flex items-center gap-2 mt-3 flex-wrap">
                        <button type="button" onClick={() => toast.success(`Gửi ${q.number} cho khách`)} className="flex items-center gap-1 px-2.5 py-1.5 text-[9px] bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"><Send className="w-3 h-3" /> Gửi KH</button>
                        <button type="button" onClick={() => toast.success("Tải PDF")} className="flex items-center gap-1 px-2.5 py-1.5 text-[9px] border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"><Download className="w-3 h-3" /> PDF</button>
                        <button type="button" onClick={() => toast.success("Nhân bản báo giá")} className="flex items-center gap-1 px-2.5 py-1.5 text-[9px] border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50"><Copy className="w-3 h-3" /> Nhân bản</button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* === Configure Tab === */}
      {activeTab === "configure" && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500">Cấu hình sản phẩm — chọn bundle, tính giá tự động</p>
          {[
            { name: "AI-CRM Enterprise", base: 25000000, desc: "Full-featured CRM: Sales, Marketing, CS, Analytics", features: ["Unlimited Workflows", "AI Agents (up to 10)", "SSO/SAML", "Multi-region", "Priority Support"] },
            { name: "AI-CRM Professional", base: 15000000, desc: "Mid-tier CRM cho team 10-100 người", features: ["50 Workflows", "AI Agents (up to 3)", "SSO", "Standard Support"] },
            { name: "AI-CRM Starter", base: 8000000, desc: "CRM cơ bản cho team nhỏ", features: ["10 Workflows", "AI Agent (1)", "Email Support"] },
          ].map((p) => (
            <div key={p.name} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm text-gray-900">{p.name}</h3>
                  <p className="text-[9px] text-gray-500">{p.desc}</p>
                </div>
                <p className="text-lg text-emerald-600">{fmtVND(p.base)}₫<span className="text-[8px] text-gray-400">/user/năm</span></p>
              </div>
              <div className="flex flex-wrap gap-1">
                {p.features.map((f) => <span key={f} className="text-[7px] px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded border border-emerald-200">✓ {f}</span>)}
              </div>
            </div>
          ))}

          <h3 className="text-sm text-gray-700 mt-2">Add-ons</h3>
          {[
            { name: "AI Agent Pack (5 agents)", price: 600000000 },
            { name: "Data Enrichment Module", price: 120000000 },
            { name: "Multi-Region Deployment", price: 500000000 },
            { name: "Compliance Package (GDPR/CCPA)", price: 200000000 },
            { name: "Professional Services", price: 350000000 },
          ].map((a) => (
            <div key={a.name} className="bg-white rounded-xl border border-gray-100 p-3 flex items-center justify-between">
              <span className="text-[10px] text-gray-700">{a.name}</span>
              <span className="text-sm text-emerald-600">{fmtVND(a.price)}₫</span>
            </div>
          ))}
        </div>
      )}

      {/* === Pricing Rules Tab === */}
      {activeTab === "rules" && (
        <div className="space-y-2">
          {MOCK_RULES.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${r.isActive ? "bg-emerald-100" : "bg-gray-100"}`}>
                  <Percent className={`w-4 h-4 ${r.isActive ? "text-emerald-600" : "text-gray-400"}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-900">{r.name}</span>
                    <span className={`text-[7px] px-1.5 py-0.5 rounded border ${r.isActive ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-50 text-gray-400 border-gray-200"}`}>{r.isActive ? "Active" : "Inactive"}</span>
                    <span className="text-[7px] px-1.5 py-0.5 bg-gray-50 text-gray-500 rounded border border-gray-200">{r.type}</span>
                  </div>
                  <p className="text-[9px] text-gray-500 mt-0.5">{r.description}</p>
                  <div className="flex items-center gap-4 mt-1 text-[8px] text-gray-400">
                    <span>Áp dụng {r.timesApplied} lần</span>
                    <span className="text-red-500">Impact: {fmtVND(r.revenueImpact)}₫</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <h4 className="text-sm text-emerald-900">AI CPQ Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-emerald-800">
          <p className="flex items-start gap-2">
            <Calculator className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
            <span><strong>Q-2026-0091</strong> (EuroFinance, 5.6B₫): AI phát hiện discount 15% <strong>vượt ngưỡng optimal</strong>. Đề xuất: giảm xuống 12% + thêm <strong>2 tháng free support</strong> thay vì discount thêm — giữ deal value tăng thêm <strong>280M₫</strong>.</span>
          </p>
          <p className="flex items-start gap-2">
            <Target className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <span>Competitive Switch Offer <strong>ROI tốt nhất</strong>: 8 deals converted, ARR mới <strong>4.8B₫</strong> vs discount cost <strong>960M₫</strong> — <strong>ROI 5x</strong>. AI suggest: tăng ngân sách program này Q2/2026.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>AI Agent Luna đã <strong>auto-generate 12 quotes</strong> tháng này (Q-2026-0090 là 1 trong số đó), trung bình <strong>3 phút/quote</strong> vs 45 phút manual. Accuracy: <strong>98%</strong>, chỉ cần review minor cho 2 quotes.</span>
          </p>
        </div>
      </div>
      {showCreateModal && <CreateQuoteModal onClose={() => setShowCreateModal(false)} onCreated={handleCreateQuote} />}
    </div>
  );
}