/**
 * Referral Program — Chương trình giới thiệu khách hàng
 * Referral tracking, reward tiers, partner affiliates,
 * referral links, conversion analytics, payout management.
 */
import { useState, useMemo } from "react";
import {
  Gift,
  Users,
  Link2,
  Copy,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Bot,
  DollarSign,
  Star,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpRight,
  Share2,
  BarChart3,
  Eye,
  X,
  Trophy,
  Zap,
  Mail,
  ExternalLink,
  Search,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
type ReferralStatus = "pending" | "qualified" | "converted" | "paid" | "expired";
type RewardTier = "bronze" | "silver" | "gold" | "platinum";

interface Referral {
  id: string;
  referrerName: string;
  referrerCompany: string;
  referredName: string;
  referredCompany: string;
  referredEmail: string;
  status: ReferralStatus;
  reward: number;
  rewardPaid: boolean;
  dealValue: number | null;
  referralCode: string;
  createdAt: string;
  convertedAt: string | null;
  channel: string;
}

interface ReferrerProfile {
  id: string;
  name: string;
  company: string;
  email: string;
  tier: RewardTier;
  totalReferrals: number;
  converted: number;
  totalEarned: number;
  pendingPayout: number;
  referralCode: string;
  referralLink: string;
  joinedAt: string;
}

/* ============================================================
 * Constants
 * ============================================================ */
const STATUS_CFG: Record<ReferralStatus, { label: string; color: string; bg: string }> = {
  pending: { label: "Chờ xử lý", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  qualified: { label: "Đủ điều kiện", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  converted: { label: "Đã chuyển đổi", color: "text-green-600", bg: "bg-green-50 border-green-200" },
  paid: { label: "Đã thanh toán", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  expired: { label: "Hết hạn", color: "text-gray-500", bg: "bg-gray-50 border-gray-200" },
};

const TIER_CFG: Record<RewardTier, { label: string; color: string; bg: string; commission: string }> = {
  bronze: { label: "Bronze", color: "text-amber-700", bg: "bg-amber-100 border-amber-300", commission: "10%" },
  silver: { label: "Silver", color: "text-gray-600", bg: "bg-gray-200 border-gray-400", commission: "15%" },
  gold: { label: "Gold", color: "text-yellow-700", bg: "bg-yellow-100 border-yellow-400", commission: "20%" },
  platinum: { label: "Platinum", color: "text-violet-700", bg: "bg-violet-100 border-violet-300", commission: "25%" },
};

/* ============================================================
 * Mock Data
 * ============================================================ */
const MOCK_REFERRALS: Referral[] = [
  {
    id: "ref_001", referrerName: "Nguyễn Minh Tuấn", referrerCompany: "DataViet Corp",
    referredName: "Trần Văn Phúc", referredCompany: "NextGen Software", referredEmail: "phuc@nextgen.io",
    status: "converted", reward: 4500000, rewardPaid: true, dealValue: 180000000,
    referralCode: "DATAVIET2026", createdAt: "2026-01-15T10:00:00Z", convertedAt: "2026-02-20T14:00:00Z", channel: "Email",
  },
  {
    id: "ref_002", referrerName: "Nguyễn Minh Tuấn", referrerCompany: "DataViet Corp",
    referredName: "Lý Hoàng Mai", referredCompany: "CloudFirst VN", referredEmail: "mai@cloudfirst.vn",
    status: "qualified", reward: 0, rewardPaid: false, dealValue: null,
    referralCode: "DATAVIET2026", createdAt: "2026-02-28T09:00:00Z", convertedAt: null, channel: "Referral Link",
  },
  {
    id: "ref_003", referrerName: "Hoàng Thị Thuỷ", referrerCompany: "MedTech Solutions",
    referredName: "Đinh Quang Hải", referredCompany: "HealthCare Plus", referredEmail: "hai@hcplus.com",
    status: "converted", reward: 6200000, rewardPaid: false, dealValue: 248000000,
    referralCode: "MEDTECH-REF", createdAt: "2026-02-10T11:00:00Z", convertedAt: "2026-03-01T16:00:00Z", channel: "Personal Intro",
  },
  {
    id: "ref_004", referrerName: "Lê Quốc Anh", referrerCompany: "FinServe Pro",
    referredName: "Nguyễn Thanh Sơn", referredCompany: "BankTech VN", referredEmail: "son@banktech.vn",
    status: "pending", reward: 0, rewardPaid: false, dealValue: null,
    referralCode: "FINSERVE25", createdAt: "2026-03-02T15:00:00Z", convertedAt: null, channel: "LinkedIn",
  },
  {
    id: "ref_005", referrerName: "Lê Quốc Anh", referrerCompany: "FinServe Pro",
    referredName: "Cao Minh Tú", referredCompany: "InsureTech", referredEmail: "tu@insuretech.vn",
    status: "paid", reward: 8800000, rewardPaid: true, dealValue: 352000000,
    referralCode: "FINSERVE25", createdAt: "2025-12-01T09:00:00Z", convertedAt: "2026-01-15T10:00:00Z", channel: "Industry Event",
  },
  {
    id: "ref_006", referrerName: "Phạm Thuỳ Linh", referrerCompany: "Saigon Creative",
    referredName: "Đỗ Văn An", referredCompany: "DesignHub", referredEmail: "an@designhub.co",
    status: "expired", reward: 0, rewardPaid: false, dealValue: null,
    referralCode: "SAIGON-CR", createdAt: "2025-10-01T10:00:00Z", convertedAt: null, channel: "Email",
  },
];

const MOCK_REFERRERS: ReferrerProfile[] = [
  {
    id: "rp_001", name: "Nguyễn Minh Tuấn", company: "DataViet Corp", email: "tuan@dataviet.com",
    tier: "gold", totalReferrals: 8, converted: 5, totalEarned: 22500000, pendingPayout: 0,
    referralCode: "DATAVIET2026", referralLink: "https://ai-crm.vn/ref/DATAVIET2026", joinedAt: "2025-06-01",
  },
  {
    id: "rp_002", name: "Lê Quốc Anh", company: "FinServe Pro", email: "anh@finserve.com",
    tier: "platinum", totalReferrals: 12, converted: 9, totalEarned: 68400000, pendingPayout: 6200000,
    referralCode: "FINSERVE25", referralLink: "https://ai-crm.vn/ref/FINSERVE25", joinedAt: "2025-04-15",
  },
  {
    id: "rp_003", name: "Hoàng Thị Thuỷ", company: "MedTech Solutions", email: "thuy@medtech.vn",
    tier: "silver", totalReferrals: 4, converted: 2, totalEarned: 12400000, pendingPayout: 6200000,
    referralCode: "MEDTECH-REF", referralLink: "https://ai-crm.vn/ref/MEDTECH-REF", joinedAt: "2025-09-01",
  },
  {
    id: "rp_004", name: "Phạm Thuỳ Linh", company: "Saigon Creative", email: "linh@saigoncreative.vn",
    tier: "bronze", totalReferrals: 2, converted: 0, totalEarned: 0, pendingPayout: 0,
    referralCode: "SAIGON-CR", referralLink: "https://ai-crm.vn/ref/SAIGON-CR", joinedAt: "2025-10-01",
  },
];

type Tab = "referrals" | "referrers" | "tiers";

const fmtMoney = (n: number) => {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  return n.toLocaleString("vi-VN");
};

/* ============================================================
 * Create Referral Modal
 * ============================================================ */
function CreateReferralModal({ onClose, onCreated }: { onClose: () => void; onCreated: (ref: Referral) => void }) {
  const [referrerName, setReferrerName] = useState("");
  const [referrerCompany, setReferrerCompany] = useState("");
  const [referredName, setReferredName] = useState("");
  const [referredCompany, setReferredCompany] = useState("");
  const [referredEmail, setReferredEmail] = useState("");
  const [channel, setChannel] = useState("Email");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!referrerName.trim()) { toast.error("Vui lòng nhập tên người giới thiệu"); return; }
    if (!referredName.trim()) { toast.error("Vui lòng nhập tên người được giới thiệu"); return; }
    if (!referredEmail.trim()) { toast.error("Vui lòng nhập email người được giới thiệu"); return; }
    setSaving(true);
    const code = referrerCompany
      ? referrerCompany.replace(/\s+/g, "").toUpperCase().slice(0, 8) + "-REF"
      : "REF-" + Date.now().toString(36).toUpperCase();
    const newRef: Referral = {
      id: `ref_${Date.now()}`, referrerName, referrerCompany: referrerCompany || "Cá nhân",
      referredName, referredCompany: referredCompany || "Chưa rõ",
      referredEmail, status: "pending", reward: 0, rewardPaid: false, dealValue: null,
      referralCode: code, createdAt: new Date().toISOString(), convertedAt: null, channel,
    };
    onCreated(newRef);
    toast.success(`Đã tạo referral cho "${referredName}" từ "${referrerName}"`);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Tạo Referral mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          <p className="text-[10px] text-pink-600 bg-pink-50 rounded-lg p-2 border border-pink-100">👤 Người giới thiệu</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tên *</label>
              <input type="text" value={referrerName} onChange={(e) => setReferrerName(e.target.value)} placeholder="Nguyễn Văn A"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Công ty</label>
              <input type="text" value={referrerCompany} onChange={(e) => setReferrerCompany(e.target.value)} placeholder="Công ty ABC"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
          </div>
          <p className="text-[10px] text-blue-600 bg-blue-50 rounded-lg p-2 border border-blue-100">👤 Người được giới thiệu</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tên *</label>
              <input type="text" value={referredName} onChange={(e) => setReferredName(e.target.value)} placeholder="Trần Văn B"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Công ty</label>
              <input type="text" value={referredCompany} onChange={(e) => setReferredCompany(e.target.value)} placeholder="Công ty XYZ"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Email *</label>
              <input type="email" value={referredEmail} onChange={(e) => setReferredEmail(e.target.value)} placeholder="email@company.com"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Kênh giới thiệu</label>
              <select value={channel} onChange={(e) => setChannel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pink-500">
                <option>Email</option>
                <option>Referral Link</option>
                <option>Personal Intro</option>
                <option>LinkedIn</option>
                <option>Industry Event</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-pink-600 text-white rounded-lg text-sm hover:bg-pink-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo Referral"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Main Page
 * ============================================================ */
export function ReferralProgramPage() {
  const [activeTab, setActiveTab] = useState<Tab>("referrals");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReferralStatus | "all">("all");
  const [referrals, setReferrals] = useState(MOCK_REFERRALS);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredReferrals = useMemo(() => {
    let result = referrals;
    if (statusFilter !== "all") result = result.filter((r) => r.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        r.referredName.toLowerCase().includes(q) || r.referredCompany.toLowerCase().includes(q) || r.referrerName.toLowerCase().includes(q)
      );
    }
    return result;
  }, [referrals, statusFilter, search]);

  const stats = useMemo(() => {
    const total = referrals.length;
    const converted = referrals.filter((r) => r.status === "converted" || r.status === "paid").length;
    const totalRevenue = referrals.filter((r) => r.dealValue).reduce((s, r) => s + (r.dealValue ?? 0), 0);
    const totalPaid = referrals.reduce((s, r) => s + r.reward, 0);
    const conversionRate = total > 0 ? ((converted / total) * 100).toFixed(0) : "0";
    return { total, converted, totalRevenue, totalPaid, conversionRate };
  }, [referrals]);

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link).then(() => toast.success("Đã sao chép link giới thiệu!"));
  };

  const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "referrals", label: "Referrals", icon: Users },
    { key: "referrers", label: "Đối tác Giới thiệu", icon: Star },
    { key: "tiers", label: "Reward Tiers", icon: Trophy },
  ];

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Gift className="w-6 h-6 text-pink-600" /> Referral Program
          </h1>
          <p className="text-gray-500 mt-0.5">
            Chương trình giới thiệu — referral tracking, reward tiers, conversion analytics
          </p>
        </div>
        <button type="button" onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1 px-3 py-2 bg-pink-600 text-white rounded-lg text-sm hover:bg-pink-700 self-start">
          <Plus className="w-4 h-4" /> Thêm Referral
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        <div className="bg-white rounded-xl border border-gray-100 p-2.5 text-center">
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-[9px] text-gray-400">Giới thiệu</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{stats.converted}</p>
          <p className="text-[9px] text-green-700">Chuyển đổi</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{stats.conversionRate}%</p>
          <p className="text-[9px] text-blue-700">Tỷ lệ</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-2.5 text-center">
          <p className="text-lg text-violet-600">{fmtMoney(stats.totalRevenue)}đ</p>
          <p className="text-[9px] text-violet-700">Doanh thu từ referral</p>
        </div>
        <div className="bg-pink-50 rounded-xl border border-pink-200 p-2.5 text-center">
          <p className="text-lg text-pink-600">{fmtMoney(stats.totalPaid)}đ</p>
          <p className="text-[9px] text-pink-700">Đã thưởng</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              activeTab === t.key ? "bg-pink-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* === Tab: Referrals === */}
      {activeTab === "referrals" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[150px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Tìm referral..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ReferralStatus | "all")}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              <option value="all">Tất cả</option>
              {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>

          {filteredReferrals.map((ref) => {
            const stCfg = STATUS_CFG[ref.status];
            return (
              <div key={ref.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0 ${
                    ref.status === "converted" || ref.status === "paid" ? "bg-green-500" :
                    ref.status === "qualified" ? "bg-amber-500" :
                    ref.status === "pending" ? "bg-blue-400" : "bg-gray-400"
                  }`}>
                    {ref.referredName.split(" ").pop()?.[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-gray-900">{ref.referredName}</span>
                      <span className="text-[9px] text-gray-400">{ref.referredCompany}</span>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded border ${stCfg.bg} ${stCfg.color}`}>{stCfg.label}</span>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Giới thiệu bởi: <span className="text-gray-600">{ref.referrerName}</span> ({ref.referrerCompany}) • {ref.channel}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-[9px] text-gray-400 flex-wrap">
                      <span>Mã: {ref.referralCode}</span>
                      <span>{new Date(ref.createdAt).toLocaleDateString("vi-VN")}</span>
                      {ref.dealValue && <span className="text-green-600">Deal: {fmtMoney(ref.dealValue)}đ</span>}
                      {ref.reward > 0 && (
                        <span className={ref.rewardPaid ? "text-emerald-600" : "text-amber-600"}>
                          Thưởng: {fmtMoney(ref.reward)}đ {ref.rewardPaid ? "(đã trả)" : "(chờ)"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === Tab: Referrers === */}
      {activeTab === "referrers" && (
        <div className="space-y-3">
          {MOCK_REFERRERS.map((rp) => {
            const tCfg = TIER_CFG[rp.tier];
            return (
              <div key={rp.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border ${tCfg.bg}`}>
                    <Star className={`w-5 h-5 ${tCfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-gray-900">{rp.name}</span>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded border ${tCfg.bg} ${tCfg.color}`}>{tCfg.label} ({tCfg.commission})</span>
                    </div>
                    <p className="text-[10px] text-gray-400">{rp.company} • {rp.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2 text-center mb-3">
                  <div className="p-2 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-900">{rp.totalReferrals}</p>
                    <p className="text-[8px] text-gray-400">Giới thiệu</p>
                  </div>
                  <div className="p-2 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600">{rp.converted}</p>
                    <p className="text-[8px] text-green-700">Converted</p>
                  </div>
                  <div className="p-2 bg-violet-50 rounded-lg">
                    <p className="text-sm text-violet-600">{fmtMoney(rp.totalEarned)}đ</p>
                    <p className="text-[8px] text-violet-700">Đã nhận</p>
                  </div>
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <p className="text-sm text-amber-600">{fmtMoney(rp.pendingPayout)}đ</p>
                    <p className="text-[8px] text-amber-700">Chờ thanh toán</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                  <Link2 className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                  <span className="text-[10px] text-gray-500 truncate flex-1">{rp.referralLink}</span>
                  <button type="button" onClick={() => handleCopyLink(rp.referralLink)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === Tab: Reward Tiers === */}
      {activeTab === "tiers" && (
        <div className="space-y-3">
          {(["bronze", "silver", "gold", "platinum"] as RewardTier[]).map((tier) => {
            const cfg = TIER_CFG[tier];
            const thresholds = { bronze: "1-2 referrals", silver: "3-5 referrals", gold: "6-10 referrals", platinum: "11+ referrals" };
            const benefits = {
              bronze: ["10% hoa hồng trên deal value", "Referral link cá nhân", "Dashboard theo dõi"],
              silver: ["15% hoa hồng", "Mọi quyền Bronze", "Priority support cho referred customers", "Co-branded landing page"],
              gold: ["20% hoa hồng", "Mọi quyền Silver", "Quarterly bonus pool", "VIP event invitations", "Dedicated partner manager"],
              platinum: ["25% hoa hồng", "Mọi quyền Gold", "Revenue sharing model", "Joint marketing campaigns", "Executive dinner invitations", "Custom integration support"],
            };
            const count = MOCK_REFERRERS.filter((r) => r.tier === tier).length;
            return (
              <div key={tier} className={`bg-white rounded-xl border overflow-hidden ${tier === "platinum" ? "border-violet-300" : "border-gray-100"}`}>
                <div className={`p-4 ${tier === "platinum" ? "bg-gradient-to-r from-violet-50 to-indigo-50" : ""}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${cfg.bg}`}>
                      <Trophy className={`w-6 h-6 ${cfg.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className={`text-sm ${cfg.color}`}>{cfg.label}</h3>
                        <span className="text-[8px] text-gray-400">{thresholds[tier]}</span>
                      </div>
                      <p className="text-xs text-gray-500">Hoa hồng: <strong>{cfg.commission}</strong> deal value</p>
                    </div>
                    <span className="text-[9px] text-gray-400">{count} thành viên</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {benefits[tier].map((b) => (
                      <span key={b} className="text-[8px] px-2 py-1 bg-white border border-gray-200 rounded text-gray-600 flex items-center gap-0.5">
                        <CheckCircle2 className="w-2.5 h-2.5 text-green-500" /> {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl border border-pink-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-pink-600" />
          <h4 className="text-sm text-pink-900">AI Referral Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-pink-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Referred customers có <strong>LTV cao hơn 38%</strong> và <strong>churn rate thấp hơn 45%</strong> so với customers từ kênh khác. ROI chương trình referral: <strong>8.5x</strong>.</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span>Lê Quốc Anh (Platinum) có <strong>9/12 referrals converted</strong> — conversion rate 75%. Đề xuất tăng bonus và mời làm <strong>Partner Ambassador</strong>.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>AI phát hiện <strong>15 customers hài lòng</strong> (NPS 9-10) chưa tham gia referral program. Đề xuất gửi email mời tham gia với <strong>bonus sign-up 500K</strong>.</span>
          </p>
        </div>
      </div>

      {showCreateModal && <CreateReferralModal onClose={() => setShowCreateModal(false)} onCreated={(ref) => setReferrals((prev) => [ref, ...prev])} />}
    </div>
  );
}