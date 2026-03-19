/**
 * Deal Room — Phòng Chiến lược Deal
 * Virtual war room: stakeholder map, action items,
 * competitive intel, mutual action plan, AI coaching.
 */
import { useState } from "react";
import {
  Swords,
  Sparkles,
  Bot,
  Users,
  DollarSign,
  Target,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MessageSquare,
  FileText,
  Calendar,
  Shield,
  TrendingUp,
  Zap,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  Star,
  UserCheck,
  UserX,
  Phone,
  Mail,
  Video,
  Plus,
  X,
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

type StakeholderRole = "champion" | "decision-maker" | "influencer" | "blocker" | "end-user";
type Sentiment = "positive" | "neutral" | "negative" | "unknown";

interface Stakeholder {
  id: string;
  name: string;
  title: string;
  role: StakeholderRole;
  sentiment: Sentiment;
  lastContact: string;
  engagementScore: number;
  notes: string;
}

interface ActionItem {
  id: string;
  task: string;
  owner: string;
  dueDate: string;
  status: "done" | "in-progress" | "overdue" | "pending";
  type: "internal" | "customer";
}

interface CompetitorIntel {
  name: string;
  strengths: string[];
  weaknesses: string[];
  pricing: string;
  status: "active" | "eliminated";
}

const ROLE_CFG: Record<StakeholderRole, { label: string; icon: string; color: string }> = {
  champion: { label: "Champion", icon: "⭐", color: "text-amber-600" },
  "decision-maker": { label: "Decision Maker", icon: "👑", color: "text-violet-600" },
  influencer: { label: "Influencer", icon: "💡", color: "text-blue-600" },
  blocker: { label: "Blocker", icon: "🚫", color: "text-red-600" },
  "end-user": { label: "End User", icon: "👤", color: "text-gray-500" },
};

const SENTIMENT_CFG: Record<Sentiment, { label: string; color: string; bg: string }> = {
  positive: { label: "Tích cực", color: "text-green-600", bg: "bg-green-50 border-green-200" },
  neutral: { label: "Trung lập", color: "text-gray-500", bg: "bg-gray-50 border-gray-200" },
  negative: { label: "Tiêu cực", color: "text-red-600", bg: "bg-red-50 border-red-200" },
  unknown: { label: "Chưa rõ", color: "text-gray-400", bg: "bg-gray-50 border-gray-200" },
};

const STATUS_CFG: Record<string, { label: string; color: string; bg: string }> = {
  done: { label: "Hoàn thành", color: "text-green-600", bg: "bg-green-50 border-green-200" },
  "in-progress": { label: "Đang làm", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  overdue: { label: "Quá hạn", color: "text-red-600", bg: "bg-red-50 border-red-200" },
  pending: { label: "Chờ", color: "text-gray-500", bg: "bg-gray-50 border-gray-200" },
};

/* === Current Deal Context === */
const DEAL = {
  name: "EuroFinance AG — Enterprise CRM 200 seats",
  value: 5610750000,
  stage: "Negotiation",
  probability: 65,
  closeDate: "2026-04-15",
  daysInStage: 12,
  totalDays: 48,
  owner: "Hoàng Thị Linh",
  nextStep: "Gửi revised proposal với discount 12% + 2 tháng free support",
  aiWinScore: 62,
};

const STAKEHOLDERS: Stakeholder[] = [
  { id: "s1", name: "Klaus Mueller", title: "CTO", role: "champion", sentiment: "positive", lastContact: "2026-03-02", engagementScore: 85, notes: "Rất hứng thú với AI Agent capabilities. Đã tham dự 3 demo sessions" },
  { id: "s2", name: "Helga Schmidt", title: "CEO", role: "decision-maker", sentiment: "neutral", lastContact: "2026-02-20", engagementScore: 40, notes: "Chỉ tham gia QBR, chưa xem demo trực tiếp. Quan tâm ROI hơn features" },
  { id: "s3", name: "Franz Weber", title: "VP Engineering", role: "influencer", sentiment: "positive", lastContact: "2026-03-01", engagementScore: 72, notes: "Đánh giá cao API documentation + developer portal. Muốn custom integration" },
  { id: "s4", name: "Ingrid Bauer", title: "CFO", role: "blocker", sentiment: "negative", lastContact: "2026-02-15", engagementScore: 25, notes: "Lo ngại budget, muốn so sánh giá với Microsoft Dynamics 365. Đang push cho phương án rẻ hơn" },
  { id: "s5", name: "Otto Braun", title: "Sales Director", role: "end-user", sentiment: "positive", lastContact: "2026-02-28", engagementScore: 68, notes: "Đã dùng thử sandbox 2 tuần, feedback tốt. Muốn mobile app mạnh hơn" },
];

const ACTION_ITEMS: ActionItem[] = [
  { id: "a1", task: "Gửi revised proposal (discount 12% + 2 tháng free support)", owner: "Hoàng Thị Linh", dueDate: "2026-03-05", status: "in-progress", type: "internal" },
  { id: "a2", task: "Schedule CEO presentation — focus ROI + case study Financial Services", owner: "Trần Minh Đức", dueDate: "2026-03-07", status: "pending", type: "internal" },
  { id: "a3", task: "Prepare TCO comparison vs Dynamics 365 cho CFO", owner: "AI Agent — Aria", dueDate: "2026-03-04", status: "done", type: "internal" },
  { id: "a4", task: "Technical deep-dive session — API integration + custom workflows", owner: "Solution Architect", dueDate: "2026-03-10", status: "pending", type: "customer" },
  { id: "a5", task: "Share security & GDPR compliance documentation", owner: "Legal Team", dueDate: "2026-03-03", status: "overdue", type: "customer" },
  { id: "a6", task: "Arrange reference call với Sakura Systems (similar use case)", owner: "Phạm Văn Khôi", dueDate: "2026-03-08", status: "pending", type: "customer" },
  { id: "a7", task: "AI Agent Luna: auto-generate personalized ROI report", owner: "AI Agent — Luna", dueDate: "2026-03-04", status: "in-progress", type: "internal" },
];

const COMPETITORS: CompetitorIntel[] = [
  { name: "Microsoft Dynamics 365", strengths: ["Brand trust enterprise", "Office 365 integration", "On-premise option", "Giá thấp hơn 20%"], weaknesses: ["AI capabilities yếu", "UI/UX phức tạp", "Implementation lâu (6-12 tháng)", "Không có AI Agent"], pricing: "~18M₫/user/năm", status: "active" },
  { name: "Salesforce", strengths: ["Market leader", "AppExchange ecosystem", "Trailhead training"], weaknesses: ["Giá rất cao", "Complexity overhead", "Vendor lock-in"], pricing: "~30M₫/user/năm", status: "eliminated" },
];

type Tab = "stakeholders" | "actions" | "competitors" | "timeline";

/* ============================================================
 * Create Deal Room Modal
 * ============================================================ */
function CreateDealRoomModal({ onClose }: { onClose: () => void }) {
  const [dealName, setDealName] = useState("");
  const [client, setClient] = useState("");
  const [value, setValue] = useState(1000000000);
  const [stage, setStage] = useState("Discovery");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!dealName.trim() || !client.trim()) { toast.error("Vui lòng nhập tên deal và khách hàng"); return; }
    setSaving(true);
    toast.success(`Đã tạo Deal Room cho "${dealName}" — ${client}`);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900 flex items-center gap-2"><Swords className="w-5 h-5 text-rose-600" /> Tạo Deal Room mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tên Deal *</label>
            <input type="text" value={dealName} onChange={(e) => setDealName(e.target.value)} placeholder="VD: CloudStack Asia — Enterprise 500 seats"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Khách hàng *</label>
              <input type="text" value={client} onChange={(e) => setClient(e.target.value)} placeholder="VD: CloudStack Asia"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Giá trị (VNĐ)</label>
              <input type="number" value={value} onChange={(e) => setValue(Number(e.target.value))} min={0} step={100000000}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Giai đoạn</label>
            <select value={stage} onChange={(e) => setStage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500">
              <option>Discovery</option>
              <option>Demo</option>
              <option>Proposal</option>
              <option>Negotiation</option>
              <option>Closing</option>
            </select>
          </div>
          <div className="bg-rose-50 rounded-lg p-3 border border-rose-100">
            <p className="text-[10px] text-rose-700 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI sẽ tự động tạo stakeholder map, competitive analysis, mutual action plan, và coaching strategy.
            </p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo Deal Room"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Component
 * ============================================================ */
export function DealRoomPage() {
  const [activeTab, setActiveTab] = useState<Tab>("stakeholders");
  const [showCreateModal, setShowCreateModal] = useState(false);

  const tabs: { key: Tab; label: string }[] = [
    { key: "stakeholders", label: "Stakeholder Map" },
    { key: "actions", label: "Action Plan" },
    { key: "competitors", label: "Đối thủ" },
    { key: "timeline", label: "Timeline" },
  ];

  const actionStats = {
    total: ACTION_ITEMS.length,
    done: ACTION_ITEMS.filter((a) => a.status === "done").length,
    overdue: ACTION_ITEMS.filter((a) => a.status === "overdue").length,
  };

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Swords className="w-6 h-6 text-rose-600" /> Deal Room
          </h1>
          <p className="text-gray-500 mt-0.5">
            Virtual war room — stakeholder mapping, action plan, competitive intel, AI coaching
          </p>
        </div>
        <button type="button" onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1 px-3 py-2 bg-rose-600 text-white rounded-lg text-sm hover:bg-rose-700 self-start">
          <Plus className="w-4 h-4" /> Tạo Deal Room
        </button>
      </header>

      {/* Deal Summary Card */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-gray-900">{DEAL.name}</h2>
            <div className="flex items-center gap-3 mt-1 text-[9px] text-gray-400 flex-wrap">
              <span className="text-[7px] px-1.5 py-0.5 bg-violet-50 text-violet-600 rounded border border-violet-200">{DEAL.stage}</span>
              <span>💰 {fmtVND(DEAL.value)}₫</span>
              <span>📅 Close: {DEAL.closeDate}</span>
              <span>⏱️ {DEAL.totalDays} ngày (stage: {DEAL.daysInStage}d)</span>
              <span>🎯 {DEAL.owner}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 self-start">
            <div className={`text-center px-4 py-2 rounded-xl border ${DEAL.probability >= 70 ? "bg-green-50 border-green-200" : DEAL.probability >= 40 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"}`}>
              <p className={`text-xl ${DEAL.probability >= 70 ? "text-green-600" : DEAL.probability >= 40 ? "text-amber-600" : "text-red-600"}`}>{DEAL.probability}%</p>
              <p className="text-[7px] text-gray-500">Probability</p>
            </div>
            <div className={`text-center px-4 py-2 rounded-xl border ${DEAL.aiWinScore >= 70 ? "bg-emerald-50 border-emerald-200" : DEAL.aiWinScore >= 40 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"}`}>
              <p className={`text-xl ${DEAL.aiWinScore >= 70 ? "text-emerald-600" : DEAL.aiWinScore >= 40 ? "text-amber-600" : "text-red-600"}`}>{DEAL.aiWinScore}</p>
              <p className="text-[7px] text-gray-500">AI Win Score</p>
            </div>
          </div>
        </div>
        <div className="mt-3 bg-blue-50 rounded-lg border border-blue-100 p-2.5">
          <p className="text-[9px] text-blue-700">📋 <strong>Next Step:</strong> {DEAL.nextStep}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-green-50 rounded-xl border border-green-200 p-2 text-center">
          <p className="text-lg text-green-600">{STAKEHOLDERS.filter((s) => s.sentiment === "positive").length}</p>
          <p className="text-[8px] text-green-700">Supporters</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-2 text-center">
          <p className="text-lg text-red-600">{STAKEHOLDERS.filter((s) => s.sentiment === "negative").length}</p>
          <p className="text-[8px] text-red-700">Blockers</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2 text-center">
          <p className="text-lg text-blue-600">{actionStats.done}/{actionStats.total}</p>
          <p className="text-[8px] text-blue-700">Actions Done</p>
        </div>
        <div className={`rounded-xl border p-2 text-center ${actionStats.overdue > 0 ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"}`}>
          <p className={`text-lg ${actionStats.overdue > 0 ? "text-red-600" : "text-gray-500"}`}>{actionStats.overdue}</p>
          <p className="text-[8px] text-gray-500">Quá hạn</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
              activeTab === t.key ? "bg-rose-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>{t.label}</button>
        ))}
      </div>

      {/* === Stakeholders Tab === */}
      {activeTab === "stakeholders" && (
        <div className="space-y-2">
          {STAKEHOLDERS.map((s) => {
            const role = ROLE_CFG[s.role];
            const sent = SENTIMENT_CFG[s.sentiment];
            return (
              <div key={s.id} className={`bg-white rounded-xl border p-4 ${
                s.role === "blocker" ? "border-red-200" : s.role === "champion" ? "border-amber-200" : "border-gray-100"
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${
                    s.sentiment === "positive" ? "bg-green-100" :
                    s.sentiment === "negative" ? "bg-red-100" : "bg-gray-100"
                  }`}>
                    {role.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-gray-900">{s.name}</span>
                      <span className="text-[8px] text-gray-400">{s.title}</span>
                      <span className={`text-[7px] px-1.5 py-0.5 rounded border ${sent.bg} ${sent.color}`}>{sent.label}</span>
                      <span className={`text-[7px] px-1.5 py-0.5 bg-gray-50 rounded border border-gray-200 ${role.color}`}>{role.label}</span>
                    </div>

                    {/* Engagement bar */}
                    <div className="mt-1.5">
                      <div className="flex items-center justify-between text-[8px] mb-0.5">
                        <span className="text-gray-400">Engagement Score</span>
                        <span className={s.engagementScore >= 60 ? "text-green-600" : s.engagementScore >= 30 ? "text-amber-600" : "text-red-600"}>{s.engagementScore}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${s.engagementScore >= 60 ? "bg-green-400" : s.engagementScore >= 30 ? "bg-amber-400" : "bg-red-400"}`}
                          style={{ width: `${s.engagementScore}%` }} />
                      </div>
                    </div>

                    <p className="text-[9px] text-gray-500 mt-1.5">{s.notes}</p>
                    <p className="text-[8px] text-gray-400 mt-0.5">Liên hệ gần nhất: {s.lastContact}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === Actions Tab === */}
      {activeTab === "actions" && (
        <div className="space-y-2">
          {ACTION_ITEMS.map((a) => {
            const st = STATUS_CFG[a.status];
            return (
              <div key={a.id} className={`bg-white rounded-xl border p-3 flex items-start gap-3 ${
                a.status === "overdue" ? "border-red-200" : "border-gray-100"
              }`}>
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  a.status === "done" ? "bg-green-100" :
                  a.status === "overdue" ? "bg-red-100" :
                  a.status === "in-progress" ? "bg-blue-100" : "bg-gray-100"
                }`}>
                  {a.status === "done" ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" /> :
                   a.status === "overdue" ? <AlertTriangle className="w-3.5 h-3.5 text-red-600" /> :
                   a.status === "in-progress" ? <Clock className="w-3.5 h-3.5 text-blue-600" /> :
                   <Clock className="w-3.5 h-3.5 text-gray-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-sm ${a.status === "done" ? "text-gray-400 line-through" : "text-gray-900"}`}>{a.task}</span>
                    <span className={`text-[7px] px-1.5 py-0.5 rounded border ${st.bg} ${st.color}`}>{st.label}</span>
                    <span className={`text-[7px] px-1.5 py-0.5 rounded border ${a.type === "customer" ? "bg-violet-50 text-violet-600 border-violet-200" : "bg-gray-50 text-gray-500 border-gray-200"}`}>{a.type === "customer" ? "Customer" : "Internal"}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-[8px] text-gray-400">
                    <span>👤 {a.owner}</span>
                    <span>📅 {a.dueDate}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === Competitors Tab === */}
      {activeTab === "competitors" && (
        <div className="space-y-3">
          {COMPETITORS.map((c) => (
            <div key={c.name} className={`bg-white rounded-xl border p-4 ${c.status === "eliminated" ? "border-green-200 opacity-70" : "border-red-200"}`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm text-gray-900">⚔️ {c.name}</span>
                <span className={`text-[7px] px-1.5 py-0.5 rounded border ${c.status === "eliminated" ? "bg-green-50 text-green-600 border-green-200" : "bg-red-50 text-red-600 border-red-200"}`}>
                  {c.status === "eliminated" ? "✓ Eliminated" : "⚠ Active Threat"}
                </span>
                <span className="text-[8px] text-gray-400 ml-auto">Pricing: {c.pricing}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <p className="text-[8px] text-red-500 mb-1">Điểm mạnh đối thủ:</p>
                  {c.strengths.map((s) => (
                    <p key={s} className="text-[9px] text-gray-600 flex items-start gap-1 mb-0.5">
                      <span className="text-red-400 mt-0.5">▸</span> {s}
                    </p>
                  ))}
                </div>
                <div>
                  <p className="text-[8px] text-green-500 mb-1">Điểm yếu đối thủ (lợi thế ta):</p>
                  {c.weaknesses.map((w) => (
                    <p key={w} className="text-[9px] text-gray-600 flex items-start gap-1 mb-0.5">
                      <span className="text-green-400 mt-0.5">▸</span> {w}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === Timeline Tab === */}
      {activeTab === "timeline" && (
        <div className="space-y-0">
          {[
            { date: "2026-03-03", event: "AI Aria hoàn thành TCO comparison vs Dynamics 365", type: "ai", icon: "🤖" },
            { date: "2026-03-02", event: "QBR với CTO Klaus Mueller — positive feedback về AI Agent", type: "meeting", icon: "🎥" },
            { date: "2026-03-01", event: "VP Engineering Franz Weber request API deep-dive session", type: "email", icon: "📧" },
            { date: "2026-02-28", event: "Sales Director Otto Braun hoàn thành sandbox trial — NPS 8/10", type: "milestone", icon: "🏆" },
            { date: "2026-02-25", event: "Proposal V1 gửi — 5.6B₫ (200 seats + AI Agents + Multi-region)", type: "deal", icon: "💰" },
            { date: "2026-02-20", event: "CEO Helga Schmidt tham dự QBR — hỏi nhiều về ROI", type: "meeting", icon: "👑" },
            { date: "2026-02-15", event: "CFO Ingrid Bauer raise concern về giá — yêu cầu so sánh Dynamics", type: "alert", icon: "⚠️" },
            { date: "2026-02-10", event: "Salesforce eliminated — khách xác nhận chỉ còn ta vs Microsoft", type: "milestone", icon: "✅" },
          ].map((ev, idx, arr) => (
            <div key={ev.date + ev.event} className="flex items-start gap-3 pb-3">
              <div className="flex flex-col items-center">
                <span className="text-lg">{ev.icon}</span>
                {idx < arr.length - 1 && <div className="w-px h-full bg-gray-200 mt-1 min-h-[16px]" />}
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-3 flex-1">
                <span className="text-[8px] text-gray-400">{ev.date}</span>
                <p className="text-[10px] text-gray-700 mt-0.5">{ev.event}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Coaching */}
      <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-rose-600" />
          <h4 className="text-sm text-rose-900">AI Deal Coaching</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-rose-800">
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <span><strong>Risk #1: CFO Blocker</strong> — Engagement score chỉ <strong>25%</strong>. AI recommend: <strong>schedule 1-on-1 CFO meeting</strong> với TCO comparison + ROI calculator personalized. Nếu không engage CFO trước 10/03, deal probability drop <strong>65% → 40%</strong>.</span>
          </p>
          <p className="flex items-start gap-2">
            <Target className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span><strong>Risk #2: Single-threaded</strong> — chỉ có <strong>1 champion</strong> (CTO). AI suggest: <strong>multi-thread strategy</strong> — engage VP Eng (đang positive, score 72) thành <strong>second champion</strong>. Offer exclusive <strong>API preview access</strong>.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span><strong>Win strategy</strong>: AI phân tích 150+ similar deals — pattern thắng Microsoft: <strong>speed to value</strong> (demo POC 2 tuần vs MS 3 tháng) + <strong>AI capabilities gap</strong> (ta có AI Agent, MS không). Focus messaging: <strong>"Go live in 60 days, not 6 months"</strong>.</span>
          </p>
        </div>
      </div>
      {showCreateModal && <CreateDealRoomModal onClose={() => setShowCreateModal(false)} />}
    </div>
  );
}