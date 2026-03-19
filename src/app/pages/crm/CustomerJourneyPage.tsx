/**
 * Trang Customer Journey Map — Trực quan hóa hành trình khách hàng
 * từ Lead → Contact → Qualified → Proposal → Won → Onboarding → Retention.
 * Phase 1: Visual journey timeline + AI Insights.
 */
import { useState, useMemo } from "react";
import {
  Map,
  UserPlus,
  Users,
  Target,
  FileText,
  HandshakeIcon,
  Rocket,
  Heart,
  Bot,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Zap,
  ChevronDown,
  ChevronUp,
  X,
  Search,
  BarChart3,
  Star,
  Mail,
  Phone,
  Video,
  Activity,
} from "lucide-react";

/* ============================================================
 * Types
 * ============================================================ */
type JourneyStage =
  | "lead-captured"
  | "first-contact"
  | "qualified"
  | "proposal"
  | "negotiation"
  | "won"
  | "onboarding"
  | "active-customer";

type TouchpointType = "email" | "call" | "meeting" | "demo" | "ai-action" | "form" | "milestone";

interface Touchpoint {
  id: string;
  type: TouchpointType;
  title: string;
  date: string;
  description: string;
  performedBy: string;
  isAI: boolean;
  sentiment?: "positive" | "neutral" | "negative";
}

interface CustomerJourney {
  id: string;
  contactName: string;
  company: string;
  currentStage: JourneyStage;
  startDate: string;
  totalDays: number;
  dealValue: number;
  touchpoints: Touchpoint[];
  aiInsight: string;
  healthScore: number;
}

/* ============================================================
 * Constants
 * ============================================================ */
const STAGE_CONFIG: Record<JourneyStage, { label: string; icon: React.ReactNode; color: string; bgColor: string; stepNumber: number }> = {
  "lead-captured": { label: "Lead mới", icon: <UserPlus className="w-4 h-4" />, color: "text-blue-700", bgColor: "bg-blue-100 border-blue-300", stepNumber: 1 },
  "first-contact": { label: "Liên hệ đầu tiên", icon: <Phone className="w-4 h-4" />, color: "text-sky-700", bgColor: "bg-sky-100 border-sky-300", stepNumber: 2 },
  qualified: { label: "Đủ điều kiện", icon: <Target className="w-4 h-4" />, color: "text-violet-700", bgColor: "bg-violet-100 border-violet-300", stepNumber: 3 },
  proposal: { label: "Đề xuất", icon: <FileText className="w-4 h-4" />, color: "text-amber-700", bgColor: "bg-amber-100 border-amber-300", stepNumber: 4 },
  negotiation: { label: "Đàm phán", icon: <HandshakeIcon className="w-4 h-4" />, color: "text-orange-700", bgColor: "bg-orange-100 border-orange-300", stepNumber: 5 },
  won: { label: "Thắng deal", icon: <CheckCircle2 className="w-4 h-4" />, color: "text-green-700", bgColor: "bg-green-100 border-green-300", stepNumber: 6 },
  onboarding: { label: "Onboarding", icon: <Rocket className="w-4 h-4" />, color: "text-pink-700", bgColor: "bg-pink-100 border-pink-300", stepNumber: 7 },
  "active-customer": { label: "Khách hàng", icon: <Heart className="w-4 h-4" />, color: "text-emerald-700", bgColor: "bg-emerald-100 border-emerald-300", stepNumber: 8 },
};

const STAGE_ORDER: JourneyStage[] = [
  "lead-captured", "first-contact", "qualified", "proposal",
  "negotiation", "won", "onboarding", "active-customer",
];

const TOUCHPOINT_ICON: Record<TouchpointType, React.ReactNode> = {
  email: <Mail className="w-3.5 h-3.5" />,
  call: <Phone className="w-3.5 h-3.5" />,
  meeting: <Video className="w-3.5 h-3.5" />,
  demo: <Target className="w-3.5 h-3.5" />,
  "ai-action": <Bot className="w-3.5 h-3.5" />,
  form: <FileText className="w-3.5 h-3.5" />,
  milestone: <Star className="w-3.5 h-3.5" />,
};

/* ============================================================
 * Mock Data — 6 hành trình mẫu
 * ============================================================ */
const JOURNEYS: CustomerJourney[] = [
  {
    id: "j1",
    contactName: "David Chen",
    company: "TechCorp Inc.",
    currentStage: "negotiation",
    startDate: "2025-12-01",
    totalDays: 93,
    dealValue: 120000,
    healthScore: 85,
    aiInsight: "Deal đang tiến triển tốt. Gợi ý: Gửi proposal cuối với ưu đãi 5% để đẩy nhanh quyết định.",
    touchpoints: [
      { id: "t1", type: "form", title: "Điền form liên hệ trên website", date: "2025-12-01", description: "Lead từ trang giải pháp AI", performedBy: "Website", isAI: false, sentiment: "neutral" },
      { id: "t2", type: "ai-action", title: "AI phân tích & chấm điểm lead", date: "2025-12-01", description: "AI Score: 87/100 — ICP fit cao", performedBy: "AI Sales Agent", isAI: true, sentiment: "positive" },
      { id: "t3", type: "email", title: "Gửi welcome email", date: "2025-12-02", description: "Email giới thiệu công ty và case study", performedBy: "AI Sales Agent", isAI: true, sentiment: "positive" },
      { id: "t4", type: "call", title: "Discovery call 30 phút", date: "2025-12-05", description: "Tìm hiểu nhu cầu AI platform", performedBy: "Nguyễn Văn An", isAI: false, sentiment: "positive" },
      { id: "t5", type: "meeting", title: "Workshop yêu cầu kỹ thuật", date: "2025-12-15", description: "2h workshop cùng team tech TechCorp", performedBy: "Lê Minh Cường", isAI: false, sentiment: "positive" },
      { id: "t6", type: "demo", title: "Demo nền tảng AI", date: "2026-01-10", description: "Demo live với 5 stakeholders", performedBy: "Nguyễn Văn An", isAI: false, sentiment: "positive" },
      { id: "t7", type: "email", title: "Gửi proposal chi tiết", date: "2026-01-20", description: "Proposal $120K — 6 tháng", performedBy: "Nguyễn Văn An", isAI: false, sentiment: "neutral" },
      { id: "t8", type: "ai-action", title: "AI phân tích sentiment email phản hồi", date: "2026-02-01", description: "Sentiment: Tích cực — quan tâm timeline", performedBy: "AI Analytics Agent", isAI: true, sentiment: "positive" },
      { id: "t9", type: "call", title: "Đàm phán điều khoản", date: "2026-02-15", description: "Thảo luận pricing & SLA", performedBy: "Nguyễn Văn An", isAI: false, sentiment: "neutral" },
    ],
  },
  {
    id: "j2",
    contactName: "Trần Quốc Bảo",
    company: "MediSys Việt Nam",
    currentStage: "active-customer",
    startDate: "2025-01-10",
    totalDays: 417,
    dealValue: 180000,
    healthScore: 92,
    aiInsight: "Khách hàng hài lòng, engagement cao. Gợi ý: Đề xuất mở rộng phase 2 với module mới.",
    touchpoints: [
      { id: "t10", type: "form", title: "Giới thiệu từ đối tác", date: "2025-01-10", description: "Referral từ đối tác y tế", performedBy: "Đối tác", isAI: false, sentiment: "positive" },
      { id: "t11", type: "call", title: "Discovery call", date: "2025-01-15", description: "Nhu cầu: Hệ thống EMR", performedBy: "Hoàng Thị Mai", isAI: false, sentiment: "positive" },
      { id: "t12", type: "meeting", title: "Workshop requirement 2 ngày", date: "2025-02-01", description: "Workshop tại bệnh viện đối tác", performedBy: "Nguyễn Văn An", isAI: false, sentiment: "positive" },
      { id: "t13", type: "milestone", title: "Ký hợp đồng $180K", date: "2025-08-10", description: "Closed-won sau 7 tháng", performedBy: "Nguyễn Văn An", isAI: false, sentiment: "positive" },
      { id: "t14", type: "milestone", title: "Kickoff project", date: "2025-08-20", description: "Bắt đầu phase 1 EMR", performedBy: "Delivery Team", isAI: false, sentiment: "positive" },
      { id: "t15", type: "milestone", title: "Go-live Phase 1", date: "2026-02-28", description: "Deploy thành công", performedBy: "Delivery Team", isAI: false, sentiment: "positive" },
    ],
  },
  {
    id: "j3",
    contactName: "Sarah Miller",
    company: "InnovateAI",
    currentStage: "proposal",
    startDate: "2026-01-15",
    totalDays: 47,
    dealValue: 85000,
    healthScore: 72,
    aiInsight: "Khách cần thêm demo kỹ thuật. Gợi ý: Tổ chức code review session với team dev InnovateAI.",
    touchpoints: [
      { id: "t16", type: "email", title: "Cold outreach via LinkedIn", date: "2026-01-15", description: "InMail giới thiệu dịch vụ outsource", performedBy: "AI Sales Agent", isAI: true, sentiment: "neutral" },
      { id: "t17", type: "call", title: "Intro call", date: "2026-01-20", description: "15 phút trao đổi nhu cầu", performedBy: "Nguyễn Văn An", isAI: false, sentiment: "positive" },
      { id: "t18", type: "email", title: "Gửi portfolio & case study", date: "2026-01-22", description: "AI projects portfolio", performedBy: "AI Sales Agent", isAI: true, sentiment: "neutral" },
      { id: "t19", type: "meeting", title: "Technical deep-dive", date: "2026-02-05", description: "1h meeting về tech stack", performedBy: "Lê Minh Cường", isAI: false, sentiment: "positive" },
      { id: "t20", type: "email", title: "Gửi proposal", date: "2026-02-20", description: "Proposal team 8 người - $85K", performedBy: "Nguyễn Văn An", isAI: false, sentiment: "neutral" },
    ],
  },
  {
    id: "j4",
    contactName: "Tanaka Yuki",
    company: "GlobalSoft Japan",
    currentStage: "qualified",
    startDate: "2026-02-01",
    totalDays: 30,
    dealValue: 200000,
    healthScore: 65,
    aiInsight: "Deal lớn nhưng cần thêm workshop. Gợi ý: Chuẩn bị tech proposal bằng tiếng Nhật.",
    touchpoints: [
      { id: "t21", type: "form", title: "Inquiry từ Clutch", date: "2026-02-01", description: "Tìm kiếm vendor WMS", performedBy: "Clutch", isAI: false, sentiment: "neutral" },
      { id: "t22", type: "ai-action", title: "AI qualify & score", date: "2026-02-01", description: "Score: 78 — Enterprise Japan", performedBy: "AI Sales Agent", isAI: true, sentiment: "positive" },
      { id: "t23", type: "call", title: "Intro call (qua phiên dịch)", date: "2026-02-05", description: "Thảo luận nhu cầu quản lý kho", performedBy: "Lê Minh Cường", isAI: false, sentiment: "neutral" },
      { id: "t24", type: "meeting", title: "Workshop requirement", date: "2026-03-02", description: "2h online workshop", performedBy: "Lê Minh Cường", isAI: false, sentiment: "positive" },
    ],
  },
  {
    id: "j5",
    contactName: "Robert Kim",
    company: "FinServe Korea",
    currentStage: "won",
    startDate: "2025-11-15",
    totalDays: 108,
    dealValue: 65000,
    healthScore: 95,
    aiInsight: "Deal sắp ký hợp đồng. Chuẩn bị onboarding: tài liệu API, sandbox, team assignment.",
    touchpoints: [
      { id: "t25", type: "form", title: "Lead từ sự kiện Korea FinTech", date: "2025-11-15", description: "Gặp tại booth", performedBy: "Sự kiện", isAI: false, sentiment: "positive" },
      { id: "t26", type: "email", title: "Follow-up sau sự kiện", date: "2025-11-18", description: "Gửi tài liệu API integration", performedBy: "Lê Minh Cường", isAI: false, sentiment: "neutral" },
      { id: "t27", type: "demo", title: "API demo live", date: "2025-12-01", description: "Demo tích hợp payment API", performedBy: "Lê Minh Cường", isAI: false, sentiment: "positive" },
      { id: "t28", type: "milestone", title: "POC thành công", date: "2026-01-15", description: "Proof of concept hoàn thành", performedBy: "Dev Team", isAI: false, sentiment: "positive" },
      { id: "t29", type: "call", title: "Đàm phán hợp đồng", date: "2026-02-15", description: "Thống nhất điều khoản", performedBy: "Lê Minh Cường", isAI: false, sentiment: "positive" },
      { id: "t30", type: "milestone", title: "Đồng ý điều khoản", date: "2026-03-02", description: "Chờ ký chính thức", performedBy: "Robert Kim", isAI: false, sentiment: "positive" },
    ],
  },
  {
    id: "j6",
    contactName: "Emma Wilson",
    company: "DigitalWave EU",
    currentStage: "first-contact",
    startDate: "2026-02-05",
    totalDays: 26,
    dealValue: 150000,
    healthScore: 48,
    aiInsight: "Engagement thấp, cần tăng cường nurturing. Gợi ý: Gửi case study EU và GDPR compliance.",
    touchpoints: [
      { id: "t31", type: "form", title: "Đăng ký whitepaper trên website", date: "2026-02-05", description: "Download: 'AI in SaaS 2026'", performedBy: "Website", isAI: false, sentiment: "neutral" },
      { id: "t32", type: "ai-action", title: "AI gửi email follow-up", date: "2026-02-06", description: "Email tự động với thêm tài liệu", performedBy: "AI Sales Agent", isAI: true, sentiment: "neutral" },
      { id: "t33", type: "ai-action", title: "AI phân tích sentiment", date: "2026-03-03", description: "Chưa phản hồi — cần follow up", performedBy: "AI Analytics Agent", isAI: true, sentiment: "negative" },
    ],
  },
];

/* ============================================================
 * Journey Progress Bar
 * ============================================================ */
function JourneyProgress({ currentStage }: { currentStage: JourneyStage }) {
  const currentIndex = STAGE_ORDER.indexOf(currentStage);

  return (
    <div className="flex items-center gap-0.5 overflow-x-auto pb-1">
      {STAGE_ORDER.map((stage, i) => {
        const cfg = STAGE_CONFIG[stage];
        const isCompleted = i < currentIndex;
        const isCurrent = i === currentIndex;

        return (
          <div key={stage} className="flex items-center flex-shrink-0">
            <div className={`flex items-center gap-1 px-1.5 py-1 rounded-lg text-[10px] ${
              isCurrent
                ? `${cfg.bgColor} ${cfg.color} border`
                : isCompleted
                ? "bg-green-50 text-green-600"
                : "bg-gray-50 text-gray-300"
            }`}>
              {isCompleted ? <CheckCircle2 className="w-3 h-3" /> : cfg.icon}
              <span className="hidden sm:inline">{cfg.label}</span>
            </div>
            {i < STAGE_ORDER.length - 1 && (
              <ArrowRight className={`w-3 h-3 mx-0.5 flex-shrink-0 ${
                i < currentIndex ? "text-green-400" : "text-gray-200"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
 * Journey Detail Panel
 * ============================================================ */
function JourneyDetail({ journey, onClose }: { journey: CustomerJourney; onClose: () => void }) {
  const stageCfg = STAGE_CONFIG[journey.currentStage];
  const healthColor = journey.healthScore >= 80 ? "text-green-600" : journey.healthScore >= 60 ? "text-amber-600" : "text-red-600";

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-50 bg-gradient-to-r from-violet-50 to-blue-50">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-gray-900">{journey.contactName}</h3>
            <p className="text-sm text-gray-500">{journey.company} · ${journey.dealValue.toLocaleString()}</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress */}
        <JourneyProgress currentStage={journey.currentStage} />

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="bg-white/80 rounded-lg p-2 text-center">
            <p className="text-sm text-gray-900">{journey.totalDays} ngày</p>
            <p className="text-[10px] text-gray-400">Thời gian</p>
          </div>
          <div className="bg-white/80 rounded-lg p-2 text-center">
            <p className="text-sm text-gray-900">{journey.touchpoints.length}</p>
            <p className="text-[10px] text-gray-400">Điểm chạm</p>
          </div>
          <div className="bg-white/80 rounded-lg p-2 text-center">
            <p className={`text-sm ${healthColor}`}>{journey.healthScore}%</p>
            <p className="text-[10px] text-gray-400">Sức khỏe</p>
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="mx-4 mt-4 bg-violet-50 border border-violet-100 rounded-lg p-3">
        <p className="text-xs text-violet-600 flex items-center gap-1 mb-1">
          <Bot className="w-3 h-3" /> AI Insight
        </p>
        <p className="text-sm text-violet-800">{journey.aiInsight}</p>
      </div>

      {/* Timeline */}
      <div className="p-4">
        <h4 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
          <Activity className="w-4 h-4 text-violet-500" /> Dòng thời gian
        </h4>
        <div className="relative pl-6">
          {/* Vertical line */}
          <div className="absolute left-2.5 top-0 bottom-0 w-px bg-gray-200" />

          <div className="space-y-4">
            {journey.touchpoints.map((tp) => {
              const sentimentColor =
                tp.sentiment === "positive" ? "border-green-300 bg-green-50" :
                tp.sentiment === "negative" ? "border-red-300 bg-red-50" :
                "border-gray-200 bg-white";

              return (
                <div key={tp.id} className="relative">
                  {/* Dot */}
                  <div className={`absolute -left-6 top-1.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    tp.isAI ? "bg-violet-100 border-violet-400" : "bg-white border-gray-300"
                  }`}>
                    {tp.isAI ? <Bot className="w-2.5 h-2.5 text-violet-600" /> : (
                      <div className="w-2 h-2 bg-gray-400 rounded-full" />
                    )}
                  </div>

                  <div className={`rounded-lg border p-3 ${sentimentColor}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 text-sm text-gray-900">
                        {TOUCHPOINT_ICON[tp.type]}
                        {tp.title}
                      </div>
                      <span className="text-[10px] text-gray-400 flex-shrink-0">
                        {new Date(tp.date).toLocaleDateString("vi-VN", { day: "numeric", month: "short" })}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{tp.description}</p>
                    <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                      {tp.isAI && <Bot className="w-2.5 h-2.5 text-violet-400" />}
                      {tp.performedBy}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Journey Card
 * ============================================================ */
function JourneyCard({
  journey,
  isSelected,
  onSelect,
}: {
  journey: CustomerJourney;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const stageCfg = STAGE_CONFIG[journey.currentStage];
  const healthColor = journey.healthScore >= 80 ? "text-green-600 bg-green-50" : journey.healthScore >= 60 ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left bg-white rounded-xl border p-4 transition-all hover:shadow-sm ${
        isSelected ? "border-violet-300 bg-violet-50/30 shadow-sm" : "border-gray-100 hover:border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <h4 className="text-sm text-gray-900 truncate">{journey.contactName}</h4>
          <p className="text-xs text-gray-400 truncate">{journey.company}</p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full ${healthColor} flex-shrink-0`}>
          {journey.healthScore}%
        </span>
      </div>

      {/* Current stage badge */}
      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] mb-2 ${stageCfg.bgColor} ${stageCfg.color}`}>
        {stageCfg.icon} {stageCfg.label}
      </div>

      {/* Mini progress */}
      <div className="flex items-center gap-px mb-2">
        {STAGE_ORDER.map((stage, i) => {
          const isCurrent = stage === journey.currentStage;
          const isCompleted = STAGE_ORDER.indexOf(stage) < STAGE_ORDER.indexOf(journey.currentStage);
          return (
            <div key={stage} className={`h-1.5 flex-1 rounded-full ${
              isCurrent ? "bg-violet-500" : isCompleted ? "bg-green-400" : "bg-gray-200"
            }`} />
          );
        })}
      </div>

      {/* Bottom */}
      <div className="flex items-center justify-between text-[11px] text-gray-400">
        <span className="flex items-center gap-0.5">
          <Clock className="w-3 h-3" /> {journey.totalDays} ngày
        </span>
        <span className="flex items-center gap-0.5">
          <Activity className="w-3 h-3" /> {journey.touchpoints.length} điểm chạm
        </span>
        <span className="text-gray-600">${journey.dealValue.toLocaleString()}</span>
      </div>
    </button>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function CustomerJourneyPage() {
  const [selectedJourney, setSelectedJourney] = useState<CustomerJourney | null>(null);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState<JourneyStage | "">("");

  const filtered = useMemo(() => {
    let result = [...JOURNEYS];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((j) =>
        j.contactName.toLowerCase().includes(q) || j.company.toLowerCase().includes(q),
      );
    }
    if (filterStage) result = result.filter((j) => j.currentStage === filterStage);
    return result;
  }, [search, filterStage]);

  const stats = useMemo(() => {
    const avgDays = Math.round(JOURNEYS.reduce((s, j) => s + j.totalDays, 0) / JOURNEYS.length);
    const avgHealth = Math.round(JOURNEYS.reduce((s, j) => s + j.healthScore, 0) / JOURNEYS.length);
    const totalTouchpoints = JOURNEYS.reduce((s, j) => s + j.touchpoints.length, 0);
    const aiTouchpoints = JOURNEYS.reduce((s, j) => s + j.touchpoints.filter((t) => t.isAI).length, 0);
    return { avgDays, avgHealth, totalTouchpoints, aiTouchpoints };
  }, []);

  /* ---- Stage funnel summary ---- */
  const stageCounts = useMemo(() => {
    const counts: Record<JourneyStage, number> = {} as any;
    for (const s of STAGE_ORDER) counts[s] = 0;
    for (const j of JOURNEYS) counts[j.currentStage]++;
    return counts;
  }, []);

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Map className="w-6 h-6 text-violet-600" /> Customer Journey Map
          </h1>
          <p className="text-gray-500 mt-0.5">
            Trực quan hóa hành trình khách hàng từ Lead đến Retention
          </p>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-lg text-gray-900">{JOURNEYS.length}</p>
          <p className="text-xs text-gray-500">Hành trình</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-3 text-center">
          <p className="text-lg text-blue-700">{stats.avgDays} ngày</p>
          <p className="text-xs text-blue-600">Chu kỳ TB</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-3 text-center">
          <p className="text-lg text-green-700">{stats.avgHealth}%</p>
          <p className="text-xs text-green-600">Sức khỏe TB</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-100 p-3 text-center">
          <p className="text-lg text-violet-700 flex items-center justify-center gap-1">
            <Bot className="w-4 h-4" /> {stats.aiTouchpoints}
          </p>
          <p className="text-xs text-violet-600">Điểm chạm AI</p>
        </div>
      </div>

      {/* Stage Funnel */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <h3 className="text-sm text-gray-800 mb-3 flex items-center gap-1.5">
          <BarChart3 className="w-4 h-4 text-violet-500" /> Phân bố giai đoạn
        </h3>
        <div className="flex items-end gap-2 h-20">
          {STAGE_ORDER.map((stage) => {
            const cfg = STAGE_CONFIG[stage];
            const count = stageCounts[stage];
            const pct = (count / JOURNEYS.length) * 100;
            return (
              <button
                key={stage}
                type="button"
                onClick={() => setFilterStage(filterStage === stage ? "" : stage)}
                className={`flex-1 flex flex-col items-center gap-1 transition-all ${
                  filterStage === stage ? "opacity-100" : filterStage ? "opacity-40" : "opacity-100"
                }`}
              >
                <span className="text-xs text-gray-600">{count}</span>
                <div className="w-full h-20 bg-gray-100 rounded relative overflow-hidden">
                  <div
                    className={`absolute bottom-0 w-full rounded ${cfg.bgColor.split(" ")[0]}`}
                    style={{ height: `${Math.max(15, pct)}%` }}
                  />
                </div>
                <span className="text-[9px] text-gray-400 text-center leading-tight">{cfg.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl border border-gray-100 p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo tên hoặc công ty..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value as JourneyStage | "")}
            className="px-2 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
          >
            <option value="">Tất cả giai đoạn</option>
            {STAGE_ORDER.map((s) => (
              <option key={s} value={s}>{STAGE_CONFIG[s].label}</option>
            ))}
          </select>
          {filterStage && (
            <button type="button" onClick={() => setFilterStage("")}
              className="text-xs text-violet-600 hover:text-violet-800 px-2 py-1">
              Xoá bộ lọc
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className={`space-y-3 ${selectedJourney ? "lg:col-span-1" : "lg:col-span-3"}`}>
          <div className={`grid gap-3 ${selectedJourney ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"}`}>
            {filtered.map((j) => (
              <JourneyCard
                key={j.id}
                journey={j}
                isSelected={selectedJourney?.id === j.id}
                onSelect={() => setSelectedJourney(selectedJourney?.id === j.id ? null : j)}
              />
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Map className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Không tìm thấy hành trình phù hợp</p>
            </div>
          )}
        </div>

        {selectedJourney && (
          <div className="lg:col-span-2">
            <JourneyDetail journey={selectedJourney} onClose={() => setSelectedJourney(null)} />
          </div>
        )}
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-blue-50 rounded-xl border border-violet-100 p-5">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Journey Analytics</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            Kênh Referral có tỷ lệ chuyển đổi cao nhất (100%) với chu kỳ TB 7 tháng.
          </p>
          <p className="flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            {JOURNEYS.filter((j) => j.healthScore < 60).length} hành trình có sức khỏe thấp cần chú ý theo dõi.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            AI đã tham gia {stats.aiTouchpoints}/{stats.totalTouchpoints} điểm chạm ({Math.round(stats.aiTouchpoints / stats.totalTouchpoints * 100)}% tự động hóa).
          </p>
        </div>
      </div>
    </div>
  );
}
