/**
 * Trang Meeting Intelligence — AI phân tích cuộc họp.
 * Transcript summary, sentiment analysis, action items,
 * talk ratio, key topics, follow-up recommendations.
 * Phase 1: Mock data + interactive cards + detail modal.
 */
import { useState, useMemo } from "react";
import {
  Mic,
  Search,
  X,
  Bot,
  Sparkles,
  Video,
  Phone,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  MessageSquare,
  ListChecks,
  BarChart3,
  Smile,
  Frown,
  Meh,
  Calendar,
  ExternalLink,
  Play,
  FileText,
  Zap,
  Target,
  ArrowUpRight,
  ThumbsUp,
  ThumbsDown,
  Flag,
} from "lucide-react";
import { toast } from "sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
  LineChart,
  Line,
} from "recharts";

/* ============================================================
 * Types
 * ============================================================ */
type MeetingType = "discovery" | "demo" | "negotiation" | "qbr" | "internal" | "onboarding";
type Sentiment = "positive" | "neutral" | "negative" | "mixed";
type ActionStatus = "pending" | "completed" | "overdue";

interface ActionItem {
  id: string;
  text: string;
  assignee: string;
  dueDate: string;
  status: ActionStatus;
  priority: "high" | "medium" | "low";
}

interface KeyMoment {
  timestamp: string;
  label: string;
  type: "objection" | "interest" | "commitment" | "risk" | "question";
}

interface Meeting {
  id: string;
  title: string;
  type: MeetingType;
  date: string;
  duration: number;
  client: string;
  clientLogo: string;
  participants: { name: string; role: string; isInternal: boolean }[];
  sentiment: Sentiment;
  sentimentScore: number;
  talkRatio: { internal: number; external: number };
  summary: string;
  keyTopics: string[];
  keyMoments: KeyMoment[];
  actionItems: ActionItem[];
  dealId: string | null;
  dealValue: number | null;
  nextStep: string;
  aiInsight: string;
  engagementScore: number;
  questionsAsked: number;
  longestMonologue: number;
}

/* ============================================================
 * Constants
 * ============================================================ */
const TYPE_CONFIG: Record<MeetingType, { label: string; icon: string; color: string }> = {
  discovery: { label: "Discovery", icon: "🔍", color: "bg-blue-50 text-blue-700" },
  demo: { label: "Demo", icon: "🖥️", color: "bg-violet-50 text-violet-700" },
  negotiation: { label: "Negotiation", icon: "🤝", color: "bg-amber-50 text-amber-700" },
  qbr: { label: "QBR", icon: "📊", color: "bg-green-50 text-green-700" },
  internal: { label: "Internal", icon: "🏢", color: "bg-gray-100 text-gray-700" },
  onboarding: { label: "Onboarding", icon: "🚀", color: "bg-teal-50 text-teal-700" },
};

const SENTIMENT_CONFIG: Record<Sentiment, { label: string; icon: React.ReactNode; color: string }> = {
  positive: { label: "Tích cực", icon: <Smile className="w-3.5 h-3.5" />, color: "text-green-600 bg-green-50" },
  neutral: { label: "Trung lập", icon: <Meh className="w-3.5 h-3.5" />, color: "text-gray-600 bg-gray-100" },
  negative: { label: "Tiêu cực", icon: <Frown className="w-3.5 h-3.5" />, color: "text-red-600 bg-red-50" },
  mixed: { label: "Hỗn hợp", icon: <Meh className="w-3.5 h-3.5" />, color: "text-amber-600 bg-amber-50" },
};

const MOMENT_COLORS: Record<string, string> = {
  objection: "bg-red-50 text-red-600 border-red-200",
  interest: "bg-green-50 text-green-600 border-green-200",
  commitment: "bg-blue-50 text-blue-600 border-blue-200",
  risk: "bg-amber-50 text-amber-600 border-amber-200",
  question: "bg-violet-50 text-violet-600 border-violet-200",
};

/* ============================================================
 * Mock Data — 8 meetings
 * ============================================================ */
const MEETINGS: Meeting[] = [
  {
    id: "m1", title: "TechCorp AI Phase 2 — Negotiation Final", type: "negotiation",
    date: "2026-03-03T10:00:00", duration: 45, client: "TechCorp Inc.", clientLogo: "🏢",
    participants: [
      { name: "Nguyễn Văn An", role: "Senior Sales", isInternal: true },
      { name: "Lê Minh Cường", role: "Tech Lead", isInternal: true },
      { name: "David Chen", role: "CTO", isInternal: false },
      { name: "Lisa Wang", role: "VP Engineering", isInternal: false },
    ],
    sentiment: "positive", sentimentScore: 82,
    talkRatio: { internal: 42, external: 58 },
    summary: "Final negotiation cho AI Phase 2. David đồng ý pricing $120K, Lisa yêu cầu thêm 2 tuần buffer cho timeline. Verbal commitment received. Contract sẽ gửi trong 24h.",
    keyTopics: ["Pricing", "Timeline", "SLA 99.9%", "IP Transfer", "Support Level"],
    keyMoments: [
      { timestamp: "05:20", label: "David hỏi về competitive pricing", type: "objection" },
      { timestamp: "12:45", label: "Lisa rất hào hứng với AI Agent demo", type: "interest" },
      { timestamp: "28:30", label: "Verbal commitment on $120K", type: "commitment" },
      { timestamp: "35:10", label: "Timeline concern — cần thêm 2 tuần", type: "risk" },
    ],
    actionItems: [
      { id: "a1", text: "Gửi contract final trong 24h", assignee: "Nguyễn Văn An", dueDate: "2026-03-04", status: "pending", priority: "high" },
      { id: "a2", text: "Update timeline +2 tuần trong SOW", assignee: "Lê Minh Cường", dueDate: "2026-03-04", status: "pending", priority: "high" },
      { id: "a3", text: "Chuẩn bị technical onboarding plan", assignee: "Lê Minh Cường", dueDate: "2026-03-07", status: "pending", priority: "medium" },
    ],
    dealId: "D-2026-0089", dealValue: 120000, nextStep: "Gửi contract, chờ e-signature",
    aiInsight: "Win probability 92%. David's body language tích cực khi discuss pricing. Lisa's timeline concern legit — accommodate để close faster. Competitor mention chỉ là leverage tactic.",
    engagementScore: 85, questionsAsked: 12, longestMonologue: 180,
  },
  {
    id: "m2", title: "MediSys EMR Phase 2 — Demo", type: "demo",
    date: "2026-03-03T14:00:00", duration: 60, client: "MediSys", clientLogo: "🏥",
    participants: [
      { name: "Đỗ Hải Yến", role: "CS Manager", isInternal: true },
      { name: "Lê Minh Cường", role: "Tech Lead", isInternal: true },
      { name: "Dr. Phạm Minh", role: "Medical Director", isInternal: false },
      { name: "Ngọc Hà", role: "IT Manager", isInternal: false },
    ],
    sentiment: "positive", sentimentScore: 78,
    talkRatio: { internal: 55, external: 45 },
    summary: "Demo EMR Phase 2 + Mobile app. Dr. Phạm rất ấn tượng với mobile prescription feature. Ngọc Hà lo lắng về HIPAA compliance. Cần follow-up với compliance documentation.",
    keyTopics: ["Mobile Prescription", "HIPAA Compliance", "HL7 Integration", "User Training", "Go-live Timeline"],
    keyMoments: [
      { timestamp: "08:15", label: "Dr. Phạm wow mobile prescription UI", type: "interest" },
      { timestamp: "22:30", label: "Ngọc Hà hỏi chi tiết HIPAA", type: "question" },
      { timestamp: "38:00", label: "Concern về data migration risk", type: "risk" },
      { timestamp: "52:00", label: "Dr. Phạm nói 'chúng tôi muốn triển khai Q2'", type: "commitment" },
    ],
    actionItems: [
      { id: "a4", text: "Gửi HIPAA compliance documentation", assignee: "Đỗ Hải Yến", dueDate: "2026-03-05", status: "pending", priority: "high" },
      { id: "a5", text: "Prepare data migration plan", assignee: "Lê Minh Cường", dueDate: "2026-03-07", status: "pending", priority: "medium" },
      { id: "a6", text: "Schedule follow-up với IT team", assignee: "Đỗ Hải Yến", dueDate: "2026-03-06", status: "pending", priority: "medium" },
    ],
    dealId: "D-2026-0086", dealValue: 135000, nextStep: "HIPAA docs → IT follow-up → SOW",
    aiInsight: "Dr. Phạm là champion rõ ràng. Ngọc Hà là technical blocker — cần satisfy HIPAA concerns trước. Talk ratio 55/45 hơi nhiều internal — để khách nói nhiều hơn next time.",
    engagementScore: 75, questionsAsked: 8, longestMonologue: 240,
  },
  {
    id: "m3", title: "FinServe Korea — QBR Q1", type: "qbr",
    date: "2026-03-02T09:00:00", duration: 75, client: "FinServe Korea", clientLogo: "🏦",
    participants: [
      { name: "Hoàng Thị Mai", role: "Sales Manager", isInternal: true },
      { name: "Đỗ Hải Yến", role: "CS Manager", isInternal: true },
      { name: "Robert Kim", role: "CEO", isInternal: false },
      { name: "Jung-hee Park", role: "CTO", isInternal: false },
    ],
    sentiment: "mixed", sentimentScore: 55,
    talkRatio: { internal: 48, external: 52 },
    summary: "QBR khó khăn. Robert hài lòng về product nhưng frustrated về support response time. Jung-hee escalate SSO issue chưa fix 3 tháng. Cần action plan ngay.",
    keyTopics: ["Support SLA", "SSO Integration", "API Performance", "Roadmap Review", "Contract Renewal"],
    keyMoments: [
      { timestamp: "10:00", label: "Robert khen product quality", type: "interest" },
      { timestamp: "18:30", label: "Jung-hee escalate SSO chưa fix", type: "objection" },
      { timestamp: "32:00", label: "Robert đe doạ xem xét competitor", type: "risk" },
      { timestamp: "55:00", label: "Đồng ý action plan 2 tuần", type: "commitment" },
    ],
    actionItems: [
      { id: "a7", text: "Fix SSO integration trong 2 tuần", assignee: "Lê Minh Cường", dueDate: "2026-03-16", status: "pending", priority: "high" },
      { id: "a8", text: "Assign dedicated support engineer", assignee: "Đỗ Hải Yến", dueDate: "2026-03-04", status: "completed", priority: "high" },
      { id: "a9", text: "Gửi API performance improvement plan", assignee: "Lê Minh Cường", dueDate: "2026-03-07", status: "pending", priority: "medium" },
    ],
    dealId: null, dealValue: null, nextStep: "SSO fix → follow-up meeting → renewal discussion",
    aiInsight: "⚠️ Churn risk tăng. Robert's competitor mention là warning signal thật. SSO fix là make-or-break. Sentiment 55% — thấp nhất trong QBR history. Cần CEO intervention.",
    engagementScore: 60, questionsAsked: 15, longestMonologue: 300,
  },
  {
    id: "m4", title: "BankPro — Discovery Call", type: "discovery",
    date: "2026-03-02T15:00:00", duration: 30, client: "BankPro", clientLogo: "🏧",
    participants: [
      { name: "Nguyễn Văn An", role: "Senior Sales", isInternal: true },
      { name: "Trịnh Hoàng Long", role: "CTO", isInternal: false },
    ],
    sentiment: "positive", sentimentScore: 75,
    talkRatio: { internal: 35, external: 65 },
    summary: "Discovery call tốt. Long chia sẻ pain points: KYC manual process, compliance reporting lag. Budget $50-80K. Decision by end Q1. Competitor: đang dùng basic tool, muốn upgrade.",
    keyTopics: ["KYC Automation", "Compliance Reporting", "Budget", "Timeline", "Current Solution"],
    keyMoments: [
      { timestamp: "05:00", label: "Long mô tả KYC pain point chi tiết", type: "interest" },
      { timestamp: "15:30", label: "Budget range $50-80K confirmed", type: "commitment" },
      { timestamp: "22:00", label: "Muốn POC trước khi decide", type: "question" },
    ],
    actionItems: [
      { id: "a10", text: "Gửi proposal + POC plan", assignee: "Nguyễn Văn An", dueDate: "2026-03-05", status: "pending", priority: "high" },
      { id: "a11", text: "Prepare banking compliance demo", assignee: "Lê Minh Cường", dueDate: "2026-03-07", status: "pending", priority: "medium" },
    ],
    dealId: null, dealValue: 65000, nextStep: "Gửi proposal → POC setup → Demo",
    aiInsight: "Great discovery! Talk ratio 35/65 — excellent (khách nói 65%). Budget confirmed. POC request = serious buyer. Fast-track POC sẽ close trước end Q1.",
    engagementScore: 80, questionsAsked: 6, longestMonologue: 120,
  },
  {
    id: "m5", title: "CloudStack ANZ — Partner Review", type: "qbr",
    date: "2026-03-01T11:00:00", duration: 50, client: "CloudStack Asia", clientLogo: "☁️",
    participants: [
      { name: "Hoàng Thị Mai", role: "Sales Manager", isInternal: true },
      { name: "Alex Wong", role: "VP Sales", isInternal: false },
    ],
    sentiment: "positive", sentimentScore: 80,
    talkRatio: { internal: 45, external: 55 },
    summary: "Partner review tích cực. Alex report pipeline $280K strong. Muốn exclusive territory rights cho ANZ. Discuss 3-year renewal at $540K. Cần CEO approval.",
    keyTopics: ["Pipeline Review", "Territory Rights", "3-Year Renewal", "Co-marketing Budget", "New Verticals"],
    keyMoments: [
      { timestamp: "08:00", label: "Pipeline $280K — above forecast", type: "interest" },
      { timestamp: "20:00", label: "Request exclusive ANZ territory", type: "commitment" },
      { timestamp: "35:00", label: "3-year renewal discussion $540K", type: "commitment" },
    ],
    actionItems: [
      { id: "a12", text: "Prepare 3-year renewal proposal", assignee: "Hoàng Thị Mai", dueDate: "2026-03-05", status: "completed", priority: "high" },
      { id: "a13", text: "Get CEO approval for territory exclusivity", assignee: "Hoàng Thị Mai", dueDate: "2026-03-07", status: "pending", priority: "high" },
    ],
    dealId: "D-2026-0088", dealValue: 540000, nextStep: "CEO approval → Renewal proposal → Signing",
    aiInsight: "Strong partner relationship. $540K 3-year = 12% discount vs annual — good deal for both. Territory exclusivity request reasonable given performance.",
    engagementScore: 82, questionsAsked: 9, longestMonologue: 150,
  },
  {
    id: "m6", title: "EduTech — Onboarding Kickoff", type: "onboarding",
    date: "2026-02-28T10:00:00", duration: 40, client: "EduTech", clientLogo: "📚",
    participants: [
      { name: "Đỗ Hải Yến", role: "CS Manager", isInternal: true },
      { name: "Nguyễn Hoàng Nam", role: "Support", isInternal: true },
      { name: "Trần Thuý", role: "Product Owner", isInternal: false },
    ],
    sentiment: "positive", sentimentScore: 88,
    talkRatio: { internal: 50, external: 50 },
    summary: "Onboarding kickoff suôn sẻ. Trần Thuý rất enthusiastic. Set up timeline 3 tuần. Data migration đơn giản (chỉ 500 contacts). NPS target: 9+.",
    keyTopics: ["Onboarding Plan", "Data Migration", "User Training", "Success Metrics", "Timeline"],
    keyMoments: [
      { timestamp: "05:00", label: "Thuý excited về AI features", type: "interest" },
      { timestamp: "25:00", label: "Quick win: import 500 contacts done live", type: "commitment" },
    ],
    actionItems: [
      { id: "a14", text: "Complete data migration", assignee: "Nguyễn Hoàng Nam", dueDate: "2026-03-07", status: "completed", priority: "medium" },
      { id: "a15", text: "Schedule user training sessions", assignee: "Đỗ Hải Yến", dueDate: "2026-03-10", status: "pending", priority: "medium" },
    ],
    dealId: null, dealValue: null, nextStep: "Training sessions → Go-live → 30-day check-in",
    aiInsight: "Perfect onboarding start. NPS 9+ likely. Quick win (live import) built trust instantly. Upsell AI Agent add-on sau 30 days sẽ natural.",
    engagementScore: 90, questionsAsked: 5, longestMonologue: 90,
  },
  {
    id: "m7", title: "Internal — Weekly Sales Standup", type: "internal",
    date: "2026-03-03T08:30:00", duration: 25, client: "Internal", clientLogo: "🏢",
    participants: [
      { name: "Hoàng Thị Mai", role: "Sales Manager", isInternal: true },
      { name: "Nguyễn Văn An", role: "Senior Sales", isInternal: true },
      { name: "Phạm Thanh Tùng", role: "Account Manager", isInternal: true },
      { name: "Trần Minh Anh", role: "Sales Rep", isInternal: true },
    ],
    sentiment: "neutral", sentimentScore: 68,
    talkRatio: { internal: 100, external: 0 },
    summary: "Weekly standup. An report TechCorp sắp close. Tùng pipeline thấp — cần thêm outbound. Anh struggling với Hà Nội territory. Mai assign mentoring pairs.",
    keyTopics: ["Pipeline Review", "Territory Issues", "Mentoring", "Weekly Targets", "Blockers"],
    keyMoments: [
      { timestamp: "03:00", label: "An: TechCorp verbal commit received", type: "commitment" },
      { timestamp: "10:00", label: "Tùng pipeline gap — needs action", type: "risk" },
      { timestamp: "18:00", label: "Anh request help with Hà Nội", type: "question" },
    ],
    actionItems: [
      { id: "a16", text: "Tùng: thêm 5 qualified leads tuần này", assignee: "Phạm Thanh Tùng", dueDate: "2026-03-07", status: "pending", priority: "high" },
      { id: "a17", text: "An mentor Anh on enterprise selling", assignee: "Nguyễn Văn An", dueDate: "2026-03-07", status: "pending", priority: "medium" },
    ],
    dealId: null, dealValue: null, nextStep: "Follow-up: pipeline review thứ 6",
    aiInsight: "Tùng's pipeline gap là concern chính. Anh cần hands-on mentoring, không chỉ advice. Recommend: joint calls An+Anh cho 2 tuần tới.",
    engagementScore: 65, questionsAsked: 7, longestMonologue: 180,
  },
  {
    id: "m8", title: "SeoulTech — Retention Call", type: "negotiation",
    date: "2026-02-28T16:00:00", duration: 35, client: "SeoulTech", clientLogo: "🇰🇷",
    participants: [
      { name: "Hoàng Thị Mai", role: "Sales Manager", isInternal: true },
      { name: "Park Ji-yeon", role: "CEO", isInternal: false },
    ],
    sentiment: "negative", sentimentScore: 35,
    talkRatio: { internal: 40, external: 60 },
    summary: "Retention call khó khăn. Park nói budget cut, đang evaluate downgrade hoặc cancel. Usage giảm 35%. Offer 20% discount + free training. Park sẽ discuss internal và trả lời tuần sau.",
    keyTopics: ["Budget Cut", "Usage Decline", "Discount Offer", "Downgrade Option", "Value Proposition"],
    keyMoments: [
      { timestamp: "02:00", label: "Park announce budget cut 30%", type: "risk" },
      { timestamp: "12:00", label: "Đề xuất cancel subscription", type: "objection" },
      { timestamp: "22:00", label: "Accept 20% discount để consider", type: "interest" },
      { timestamp: "30:00", label: "Sẽ trả lời tuần sau", type: "commitment" },
    ],
    actionItems: [
      { id: "a18", text: "Gửi retention package + ROI analysis", assignee: "Hoàng Thị Mai", dueDate: "2026-03-03", status: "overdue", priority: "high" },
      { id: "a19", text: "Follow-up call với Park", assignee: "Hoàng Thị Mai", dueDate: "2026-03-07", status: "pending", priority: "high" },
    ],
    dealId: null, dealValue: null, nextStep: "ROI analysis → Follow-up → Decision",
    aiInsight: "🔴 High churn risk. Sentiment 35% — lowest. Park's tone softened sau discount offer. ROI analysis phải show clear value vs cost. Nếu downgrade thay vì cancel = partial win.",
    engagementScore: 45, questionsAsked: 4, longestMonologue: 210,
  },
];

/* ============================================================
 * Chart Data
 * ============================================================ */
const SENTIMENT_DIST = Object.entries(SENTIMENT_CONFIG).map(([key, cfg]) => ({
  name: cfg.label, value: MEETINGS.filter((m) => m.sentiment === key).length, color: key === "positive" ? "#22c55e" : key === "neutral" ? "#9ca3af" : key === "negative" ? "#ef4444" : "#f59e0b",
})).filter((d) => d.value > 0);

const TYPE_DIST = Object.entries(TYPE_CONFIG).map(([key, cfg]) => ({
  name: cfg.label, count: MEETINGS.filter((m) => m.type === key).length,
})).filter((d) => d.count > 0).sort((a, b) => b.count - a.count);
const TYPE_COLORS = ["#3b82f6", "#8b5cf6", "#f59e0b", "#22c55e", "#6b7280", "#14b8a6"];

const ENGAGEMENT_TREND = [
  { week: "W7", score: 72 }, { week: "W8", score: 68 },
  { week: "W9", score: 75 }, { week: "W10", score: 73 },
];

/* ============================================================
 * Detail Modal
 * ============================================================ */
function MeetingDetailModal({ meeting, onClose }: { meeting: Meeting; onClose: () => void }) {
  const tCfg = TYPE_CONFIG[meeting.type];
  const sCfg = SENTIMENT_CONFIG[meeting.sentiment];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}>

        <div className="flex items-center justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[9px] px-2 py-0.5 rounded ${tCfg.color}`}>{tCfg.icon} {tCfg.label}</span>
              <span className={`text-[9px] px-2 py-0.5 rounded ${sCfg.color} flex items-center gap-0.5`}>{sCfg.icon} {sCfg.label}</span>
            </div>
            <h3 className="text-gray-900 text-sm">{meeting.title}</h3>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* Meta */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="bg-gray-50 rounded p-1.5">
              <p className="text-xs text-gray-900">{meeting.duration}m</p>
              <p className="text-[7px] text-gray-400">Thời lượng</p>
            </div>
            <div className={`rounded p-1.5 ${meeting.sentimentScore >= 70 ? "bg-green-50" : meeting.sentimentScore >= 50 ? "bg-amber-50" : "bg-red-50"}`}>
              <p className={`text-xs ${meeting.sentimentScore >= 70 ? "text-green-600" : meeting.sentimentScore >= 50 ? "text-amber-600" : "text-red-600"}`}>{meeting.sentimentScore}%</p>
              <p className="text-[7px] text-gray-400">Sentiment</p>
            </div>
            <div className="bg-gray-50 rounded p-1.5">
              <p className="text-xs text-gray-900">{meeting.engagementScore}%</p>
              <p className="text-[7px] text-gray-400">Engagement</p>
            </div>
            <div className="bg-gray-50 rounded p-1.5">
              <p className="text-xs text-gray-900">{meeting.questionsAsked}</p>
              <p className="text-[7px] text-gray-400">Câu hỏi</p>
            </div>
          </div>

          {/* Talk Ratio */}
          <div>
            <p className="text-[9px] text-gray-400 mb-1">Talk Ratio</p>
            <div className="flex h-4 rounded-full overflow-hidden">
              <div className="bg-violet-500 flex items-center justify-center" style={{ width: `${meeting.talkRatio.internal}%` }}>
                <span className="text-[7px] text-white">Nội bộ {meeting.talkRatio.internal}%</span>
              </div>
              <div className="bg-blue-400 flex items-center justify-center" style={{ width: `${meeting.talkRatio.external}%` }}>
                <span className="text-[7px] text-white">Khách {meeting.talkRatio.external}%</span>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-[9px] text-gray-400 mb-1">AI Summary</p>
            <p className="text-xs text-gray-800">{meeting.summary}</p>
          </div>

          {/* Key Moments */}
          <div>
            <h4 className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> Key Moments ({meeting.keyMoments.length})
            </h4>
            <div className="space-y-1.5">
              {meeting.keyMoments.map((km, i) => (
                <div key={i} className={`rounded-lg border p-2 flex items-center gap-2 ${MOMENT_COLORS[km.type]}`}>
                  <span className="text-[9px] font-mono flex-shrink-0">{km.timestamp}</span>
                  <p className="text-xs flex-1">{km.label}</p>
                  <span className="text-[7px] px-1 py-0.5 rounded bg-white/50">{km.type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Items */}
          <div>
            <h4 className="text-xs text-gray-500 mb-2 flex items-center gap-1">
              <ListChecks className="w-3.5 h-3.5" /> Action Items ({meeting.actionItems.length})
            </h4>
            <div className="space-y-1.5">
              {meeting.actionItems.map((ai) => (
                <div key={ai.id} className={`rounded-lg border p-2 ${
                  ai.status === "overdue" ? "border-red-200 bg-red-50/50" :
                  ai.status === "completed" ? "border-green-200 bg-green-50/50" : "border-gray-200"
                }`}>
                  <div className="flex items-start justify-between">
                    <p className={`text-xs flex-1 ${ai.status === "completed" ? "line-through text-gray-400" : "text-gray-800"}`}>{ai.text}</p>
                    <span className={`text-[7px] px-1 py-0.5 rounded flex-shrink-0 ml-2 ${
                      ai.status === "overdue" ? "bg-red-100 text-red-600" :
                      ai.status === "completed" ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-500"
                    }`}>{ai.status === "overdue" ? "Quá hạn" : ai.status === "completed" ? "Done" : "Pending"}</span>
                  </div>
                  <p className="text-[8px] text-gray-400 mt-0.5">{ai.assignee} · {new Date(ai.dueDate).toLocaleDateString("vi-VN")}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Participants */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {meeting.participants.map((p) => (
              <span key={p.name} className={`text-[8px] px-2 py-0.5 rounded ${p.isInternal ? "bg-violet-50 text-violet-600" : "bg-blue-50 text-blue-600"}`}>
                {p.isInternal ? "🏢" : "👤"} {p.name} ({p.role})
              </span>
            ))}
          </div>

          {/* AI Insight */}
          <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-lg border border-violet-100 p-3">
            <p className="text-xs text-violet-800 flex items-start gap-1.5">
              <Bot className="w-3.5 h-3.5 text-violet-500 mt-0.5 flex-shrink-0" />
              <span>{meeting.aiInsight}</span>
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
 * Trang chính
 * ============================================================ */
export function MeetingIntelligencePage() {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<MeetingType | "">("");

  const stats = useMemo(() => {
    const avgSentiment = Math.round(MEETINGS.reduce((s, m) => s + m.sentimentScore, 0) / MEETINGS.length);
    const totalActions = MEETINGS.reduce((s, m) => s + m.actionItems.length, 0);
    const overdueActions = MEETINGS.reduce((s, m) => s + m.actionItems.filter((a) => a.status === "overdue").length, 0);
    const avgEngagement = Math.round(MEETINGS.reduce((s, m) => s + m.engagementScore, 0) / MEETINGS.length);
    return { total: MEETINGS.length, avgSentiment, totalActions, overdueActions, avgEngagement };
  }, []);

  const filtered = useMemo(() => {
    let result = [...MEETINGS];
    if (filterType) result = result.filter((m) => m.type === filterType);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((m) => m.title.toLowerCase().includes(q) || m.client.toLowerCase().includes(q));
    }
    return result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filterType, search]);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <Mic className="w-6 h-6 text-violet-600" /> Meeting Intelligence
        </h1>
        <p className="text-gray-500 mt-0.5">
          AI transcript analysis, sentiment, key moments, action items, coaching insights
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <Video className="w-4 h-4 text-violet-500 mb-1" />
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Cuộc họp</p>
        </div>
        <div className={`rounded-xl border p-3 ${stats.avgSentiment >= 70 ? "bg-green-50 border-green-200" : stats.avgSentiment >= 50 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"}`}>
          <p className={`text-lg ${stats.avgSentiment >= 70 ? "text-green-600" : stats.avgSentiment >= 50 ? "text-amber-600" : "text-red-600"}`}>{stats.avgSentiment}%</p>
          <p className="text-xs text-gray-600">Sentiment TB</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-3">
          <p className="text-lg text-blue-600">{stats.avgEngagement}%</p>
          <p className="text-xs text-blue-700">Engagement TB</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <p className="text-lg text-gray-900">{stats.totalActions}</p>
          <p className="text-xs text-gray-500">Action items</p>
        </div>
        <div className={`rounded-xl border p-3 col-span-2 lg:col-span-1 ${stats.overdueActions > 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
          <p className={`text-lg ${stats.overdueActions > 0 ? "text-red-600" : "text-green-600"}`}>{stats.overdueActions}</p>
          <p className="text-xs text-gray-600">Actions quá hạn</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3">Sentiment Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={SENTIMENT_DIST} dataKey="value" nameKey="name" cx="50%" cy="50%"
                outerRadius={65} innerRadius={25}
                label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                {SENTIMENT_DIST.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3">Theo Loại</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={TYPE_DIST}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {TYPE_DIST.map((_, i) => <Cell key={i} fill={TYPE_COLORS[i]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <h3 className="text-sm text-gray-800 mb-3">Engagement Trend</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={ENGAGEMENT_TREND}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" name="Engagement" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1">
            {(["", ...Object.keys(TYPE_CONFIG)] as (MeetingType | "")[]).map((t) => (
              <button key={t} type="button" onClick={() => setFilterType(t)}
                className={`px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition-colors ${
                  filterType === t ? "bg-violet-600 text-white" : "text-gray-500 hover:bg-gray-100"
                }`}>
                {t === "" ? "Tất cả" : `${TYPE_CONFIG[t].icon} ${TYPE_CONFIG[t].label}`}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-[150px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Tìm cuộc họp..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
        </div>
      </div>

      {/* Meeting List */}
      <div className="space-y-2">
        {filtered.map((m) => {
          const tCfg = TYPE_CONFIG[m.type];
          const sCfg = SENTIMENT_CONFIG[m.sentiment];
          const pendingActions = m.actionItems.filter((a) => a.status === "pending" || a.status === "overdue").length;
          return (
            <div key={m.id}
              className={`bg-white rounded-xl border p-4 hover:shadow-sm transition-shadow cursor-pointer ${
                m.sentimentScore < 50 ? "border-red-200" : "border-gray-100"
              }`}
              onClick={() => setSelectedMeeting(m)}>
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">{m.clientLogo}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <span className={`text-[8px] px-1.5 py-0.5 rounded ${tCfg.color}`}>{tCfg.icon} {tCfg.label}</span>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded ${sCfg.color} flex items-center gap-0.5`}>{sCfg.icon} {m.sentimentScore}%</span>
                    {pendingActions > 0 && (
                      <span className="text-[8px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-600">{pendingActions} action(s)</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-900 line-clamp-1">{m.title}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {m.client} · {m.duration}m · {m.participants.length} người · {m.keyMoments.length} key moments
                  </p>
                  {/* Talk ratio mini bar */}
                  <div className="flex h-1.5 rounded-full overflow-hidden mt-1.5 w-32">
                    <div className="bg-violet-400" style={{ width: `${m.talkRatio.internal}%` }} />
                    <div className="bg-blue-300" style={{ width: `${m.talkRatio.external}%` }} />
                  </div>
                  <p className="text-[7px] text-gray-300 mt-0.5">Nội bộ {m.talkRatio.internal}% · Khách {m.talkRatio.external}%</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-[10px] text-gray-900">{new Date(m.date).toLocaleDateString("vi-VN")}</p>
                  <p className="text-[9px] text-gray-400">{new Date(m.date).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</p>
                  {m.dealValue && <p className="text-[9px] text-green-600 mt-0.5">${(m.dealValue / 1000).toFixed(0)}K</p>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <Mic className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Không tìm thấy cuộc họp phù hợp</p>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Meeting Coach</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            BankPro discovery có talk ratio 35/65 — best practice! Khách nói 65% = more insights. Apply pattern này cho mọi discovery call.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            SeoulTech retention: sentiment 35% lowest ever. Action item ROI analysis đang quá hạn! Complete ngay trước follow-up call.
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            FinServe QBR sentiment giảm vs Q4. Longest monologue 5 phút — cần shorten. Để khách express concerns sẽ improve relationship.
          </p>
        </div>
      </div>

      {selectedMeeting && <MeetingDetailModal meeting={selectedMeeting} onClose={() => setSelectedMeeting(null)} />}
    </div>
  );
}
