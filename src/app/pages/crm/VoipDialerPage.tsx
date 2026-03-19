/**
 * VoIP Dialer — Gọi điện tích hợp CRM
 * Click-to-call, power dialer, call recording, live transcription,
 * AI coaching real-time, call analytics, disposition tracking.
 */
import { useState, useMemo, useEffect, useRef } from "react";
import {
  Phone,
  PhoneCall,
  PhoneOff,
  PhoneMissed,
  PhoneIncoming,
  PhoneOutgoing,
  Mic,
  MicOff,
  Pause,
  Play,
  Search,
  Clock,
  User,
  Building2,
  Star,
  Sparkles,
  Bot,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  MessageSquare,
  Volume2,
  VolumeX,
  FileText,
  Hash,
  X,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  ListChecks,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
type CallStatus = "idle" | "ringing" | "connected" | "on-hold" | "ended";
type CallDirection = "inbound" | "outbound";
type Disposition = "connected" | "no-answer" | "busy" | "voicemail" | "wrong-number" | "interested" | "not-interested" | "callback";

interface CallRecord {
  id: string;
  contactName: string;
  contactCompany: string;
  phone: string;
  direction: CallDirection;
  disposition: Disposition;
  duration: number; // seconds
  recordingUrl: string | null;
  notes: string;
  aiSummary: string;
  sentimentScore: number; // -100 to 100
  createdAt: string;
  agent: string;
}

interface DialerContact {
  id: string;
  name: string;
  company: string;
  phone: string;
  title: string;
  lastCalled: string | null;
  callCount: number;
  priority: "hot" | "warm" | "cold";
}

/* ============================================================
 * Constants
 * ============================================================ */
const DISPOSITION_CFG: Record<Disposition, { label: string; color: string }> = {
  connected: { label: "Đã kết nối", color: "bg-green-100 text-green-600" },
  "no-answer": { label: "Không nghe", color: "bg-gray-100 text-gray-500" },
  busy: { label: "Bận", color: "bg-amber-100 text-amber-600" },
  voicemail: { label: "Hộp thư thoại", color: "bg-blue-100 text-blue-600" },
  "wrong-number": { label: "Sai số", color: "bg-red-100 text-red-600" },
  interested: { label: "Quan tâm", color: "bg-emerald-100 text-emerald-700" },
  "not-interested": { label: "Không quan tâm", color: "bg-orange-100 text-orange-600" },
  callback: { label: "Gọi lại sau", color: "bg-violet-100 text-violet-600" },
};

/* ============================================================
 * Mock Data
 * ============================================================ */
const MOCK_CALL_HISTORY: CallRecord[] = [
  {
    id: "call_001", contactName: "Nguyễn Văn Hùng", contactCompany: "TechCorp Việt Nam",
    phone: "0901234567", direction: "outbound", disposition: "interested",
    duration: 458, recordingUrl: "#", notes: "Khách quan tâm gói Enterprise, muốn demo tuần sau",
    aiSummary: "Khách hàng Nguyễn Văn Hùng rất quan tâm AI Sales Coach. Yêu cầu demo 1-1 với CTO. Budget: 200-500 triệu/năm. Next step: gửi proposal + book demo thứ 3 tuần tới.",
    sentimentScore: 82, createdAt: "2026-03-03T10:15:00Z", agent: "Trần Đức Anh",
  },
  {
    id: "call_002", contactName: "Phạm Thị Hà", contactCompany: "Green Logistics",
    phone: "0912345678", direction: "outbound", disposition: "callback",
    duration: 125, recordingUrl: "#", notes: "Đang bận họp, hẹn gọi lại 14h chiều nay",
    aiSummary: "Cuộc gọi ngắn. Khách đang bận. Hẹn callback lúc 14:00 hôm nay. Tone tích cực.",
    sentimentScore: 45, createdAt: "2026-03-03T09:30:00Z", agent: "Trần Đức Anh",
  },
  {
    id: "call_003", contactName: "Lê Hoàng Anh", contactCompany: "Startup XYZ",
    phone: "0923456789", direction: "inbound", disposition: "connected",
    duration: 892, recordingUrl: "#", notes: "Gọi hỏi về API rate limit và pricing Enterprise",
    aiSummary: "Khách gọi hỏi nâng rate limit lên 500 req/min. Đã giải thích plan Enterprise Custom có unlimited. Khách muốn nhận proposal so sánh pricing. Objection: giá cao hơn HubSpot — đã handle bằng ROI calculator.",
    sentimentScore: 58, createdAt: "2026-03-03T08:45:00Z", agent: "Nguyễn Thị Mai",
  },
  {
    id: "call_004", contactName: "Vũ Thanh Hà", contactCompany: "Big Retail Group",
    phone: "0934567890", direction: "outbound", disposition: "no-answer",
    duration: 0, recordingUrl: null, notes: "", aiSummary: "",
    sentimentScore: 0, createdAt: "2026-03-03T08:30:00Z", agent: "Trần Đức Anh",
  },
  {
    id: "call_005", contactName: "Đỗ Quang Hải", contactCompany: "Fintech Pro",
    phone: "0945678901", direction: "outbound", disposition: "not-interested",
    duration: 180, recordingUrl: "#", notes: "Đã ký hợp đồng với Salesforce rồi, không quan tâm",
    aiSummary: "Khách đã chọn Salesforce 3 tháng trước. Contract 2 năm. Không có cơ hội ngắn hạn. Recommend nurture long-term, contact lại Q3/2027 khi hết hợp đồng.",
    sentimentScore: -25, createdAt: "2026-03-02T16:00:00Z", agent: "Phạm Minh Tâm",
  },
  {
    id: "call_006", contactName: "Trần Thị Lan", contactCompany: "Saigon Food",
    phone: "0956789012", direction: "outbound", disposition: "voicemail",
    duration: 32, recordingUrl: "#", notes: "Để lại voicemail",
    aiSummary: "Voicemail — đã để lại lời nhắn giới thiệu AI-CRM và số hotline.",
    sentimentScore: 0, createdAt: "2026-03-02T14:00:00Z", agent: "Trần Đức Anh",
  },
];

const MOCK_DIALER_CONTACTS: DialerContact[] = [
  { id: "dc_001", name: "Nguyễn Minh Tuấn", company: "DataViet Corp", phone: "0967890123", title: "CTO", lastCalled: null, callCount: 0, priority: "hot" },
  { id: "dc_002", name: "Hoàng Thị Thuỷ", company: "MedTech Solutions", phone: "0978901234", title: "VP Sales", lastCalled: null, callCount: 0, priority: "hot" },
  { id: "dc_003", name: "Bùi Văn Đạt", company: "EduTech Pro", phone: "0989012345", title: "CEO", lastCalled: "2026-02-28T10:00:00Z", callCount: 2, priority: "warm" },
  { id: "dc_004", name: "Cao Thị Ngọc", company: "Fashion Forward", phone: "0990123456", title: "Marketing Director", lastCalled: "2026-02-25T15:00:00Z", callCount: 1, priority: "warm" },
  { id: "dc_005", name: "Đinh Quốc Bảo", company: "Smart Manufacturing", phone: "0901234568", title: "COO", lastCalled: null, callCount: 0, priority: "cold" },
];

type Tab = "dialer" | "history" | "analytics";

/* ============================================================
 * Live Call Panel
 * ============================================================ */
function LiveCallPanel({ contact, onEnd }: { contact: DialerContact; onEnd: () => void }) {
  const [status, setStatus] = useState<CallStatus>("ringing");
  const [elapsed, setElapsed] = useState(0);
  const [muted, setMuted] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const ringTimer = setTimeout(() => {
      setStatus("connected");
      timerRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    }, 2000);
    return () => {
      clearTimeout(ringTimer);
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  const handleEnd = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setStatus("ended");
    toast.success(`Cuộc gọi với ${contact.name} kết thúc — ${formatTime(elapsed)}`);
    setTimeout(onEnd, 500);
  };

  return (
    <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-2xl p-5 text-white">
      <div className="text-center mb-4">
        <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-2">
          {status === "ringing" ? (
            <PhoneCall className="w-8 h-8 text-white animate-pulse" />
          ) : (
            <Phone className="w-8 h-8 text-white" />
          )}
        </div>
        <h3 className="text-lg">{contact.name}</h3>
        <p className="text-violet-200 text-sm">{contact.company} • {contact.title}</p>
        <p className="text-violet-200 text-xs mt-0.5">{contact.phone}</p>
        <div className="mt-2">
          {status === "ringing" && <span className="text-sm text-violet-200 animate-pulse">Đang đổ chuông...</span>}
          {status === "connected" && <span className="text-lg text-green-300">{formatTime(elapsed)}</span>}
          {status === "on-hold" && <span className="text-sm text-amber-300">Đang giữ máy</span>}
        </div>
      </div>

      {/* AI Real-time Coaching */}
      {status === "connected" && elapsed > 5 && (
        <div className="bg-white/10 rounded-xl p-3 mb-4 border border-white/20">
          <div className="flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-[10px] text-amber-300">AI Coaching (real-time)</span>
          </div>
          <div className="space-y-1 text-xs text-violet-100">
            {elapsed < 20 && <p>💡 Bắt đầu bằng cách hỏi về thách thức sales hiện tại của khách.</p>}
            {elapsed >= 20 && elapsed < 60 && <p>📊 Khách đề cập "budget" — gợi ý dùng ROI calculator: tiết kiệm 3-5h/tuần/sales rep.</p>}
            {elapsed >= 60 && <p>🎯 Đã hơn 1 phút — chuyển sang đề xuất next step: book demo hoặc gửi proposal.</p>}
          </div>
        </div>
      )}

      {/* Controls */}
      {status !== "ended" && (
        <div className="flex items-center justify-center gap-4">
          <button type="button" onClick={() => setMuted(!muted)}
            className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30">
            {muted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          {status === "connected" && (
            <button type="button" onClick={() => setStatus(status === "on-hold" ? "connected" : "on-hold")}
              className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30">
              {status === "on-hold" ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </button>
          )}
          <button type="button" onClick={handleEnd}
            className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 shadow-lg">
            <PhoneOff className="w-6 h-6" />
          </button>
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * Main Page
 * ============================================================ */
export function VoipDialerPage() {
  const [activeTab, setActiveTab] = useState<Tab>("dialer");
  const [search, setSearch] = useState("");
  const [activeCall, setActiveCall] = useState<DialerContact | null>(null);
  const [expandedCall, setExpandedCall] = useState<string | null>(null);

  const filteredContacts = useMemo(() => {
    if (!search) return MOCK_DIALER_CONTACTS;
    const q = search.toLowerCase();
    return MOCK_DIALER_CONTACTS.filter((c) => c.name.toLowerCase().includes(q) || c.company.toLowerCase().includes(q) || c.phone.includes(q));
  }, [search]);

  const stats = useMemo(() => {
    const total = MOCK_CALL_HISTORY.length;
    const connected = MOCK_CALL_HISTORY.filter((c) => c.disposition === "connected" || c.disposition === "interested" || c.disposition === "callback").length;
    const totalDuration = MOCK_CALL_HISTORY.reduce((s, c) => s + c.duration, 0);
    const avgDuration = total > 0 ? Math.round(totalDuration / MOCK_CALL_HISTORY.filter((c) => c.duration > 0).length) : 0;
    const connectRate = total > 0 ? ((connected / total) * 100).toFixed(0) : "0";
    const avgSentiment = MOCK_CALL_HISTORY.filter((c) => c.sentimentScore !== 0).length > 0
      ? Math.round(MOCK_CALL_HISTORY.filter((c) => c.sentimentScore !== 0).reduce((s, c) => s + c.sentimentScore, 0) / MOCK_CALL_HISTORY.filter((c) => c.sentimentScore !== 0).length)
      : 0;
    return { total, connected, connectRate, avgDuration, totalDuration, avgSentiment };
  }, []);

  const handleCall = (contact: DialerContact) => {
    setActiveCall(contact);
    toast.info(`Đang gọi ${contact.name}...`);
  };

  const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "dialer", label: "Power Dialer", icon: Phone },
    { key: "history", label: "Lịch sử", icon: Clock },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <Phone className="w-6 h-6 text-emerald-600" /> VoIP Dialer
        </h1>
        <p className="text-gray-500 mt-0.5">
          Gọi điện tích hợp CRM — power dialer, AI coaching, call recording, analytics
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        <div className="bg-white rounded-xl border border-gray-100 p-2.5 text-center">
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-[9px] text-gray-400">Cuộc gọi (7d)</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{stats.connectRate}%</p>
          <p className="text-[9px] text-green-700">Connect Rate</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{Math.floor(stats.avgDuration / 60)}:{(stats.avgDuration % 60).toString().padStart(2, "0")}</p>
          <p className="text-[9px] text-blue-700">TB thời lượng</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-2.5 text-center">
          <p className="text-lg text-violet-600">{Math.floor(stats.totalDuration / 60)}p</p>
          <p className="text-[9px] text-violet-700">Tổng phút gọi</p>
        </div>
        <div className={`rounded-xl border p-2.5 text-center ${stats.avgSentiment >= 30 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
          <p className={`text-lg ${stats.avgSentiment >= 30 ? "text-green-600" : "text-amber-600"}`}>+{stats.avgSentiment}</p>
          <p className="text-[9px] text-gray-500">TB Sentiment</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-2.5 text-center">
          <p className="text-lg text-amber-600">{MOCK_DIALER_CONTACTS.length}</p>
          <p className="text-[9px] text-amber-700">Trong queue</p>
        </div>
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

      {/* === Tab: Dialer === */}
      {activeTab === "dialer" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Contact Queue */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Tìm contact để gọi..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm" />
            </div>

            <div className="space-y-2">
              {filteredContacts.map((c) => {
                const priorityColors = { hot: "bg-red-100 text-red-600 border-red-200", warm: "bg-amber-100 text-amber-600 border-amber-200", cold: "bg-blue-100 text-blue-600 border-blue-200" };
                return (
                  <div key={c.id} className="bg-white rounded-xl border border-gray-100 p-3 hover:border-emerald-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0 ${
                        c.priority === "hot" ? "bg-red-500" : c.priority === "warm" ? "bg-amber-500" : "bg-blue-400"
                      }`}>
                        {c.name.split(" ").pop()?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm text-gray-900">{c.name}</span>
                          <span className={`text-[8px] px-1.5 py-0.5 rounded border ${priorityColors[c.priority]}`}>{c.priority.toUpperCase()}</span>
                        </div>
                        <p className="text-[10px] text-gray-400">{c.title} • {c.company}</p>
                        <p className="text-[10px] text-gray-400">{c.phone}</p>
                        {c.lastCalled && <p className="text-[9px] text-gray-400">Gọi lần cuối: {new Date(c.lastCalled).toLocaleDateString("vi-VN")} ({c.callCount} cuộc)</p>}
                      </div>
                      <button type="button" onClick={() => handleCall(c)} disabled={activeCall !== null}
                        className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white hover:bg-emerald-600 disabled:opacity-50 flex-shrink-0">
                        <Phone className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Call Panel / Placeholder */}
          <div>
            {activeCall ? (
              <LiveCallPanel contact={activeCall} onEnd={() => setActiveCall(null)} />
            ) : (
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 text-center">
                <Phone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Chọn contact và bấm gọi để bắt đầu</p>
                <p className="text-[10px] text-gray-400 mt-1">Power Dialer sẽ tự động gọi tiếp contact kế tiếp</p>
              </div>
            )}

            {/* Quick Stats */}
            <div className="mt-4 bg-white rounded-xl border border-gray-100 p-4">
              <h4 className="text-sm text-gray-900 mb-2">Hôm nay</h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <p className="text-lg text-gray-900">4</p>
                  <p className="text-[8px] text-gray-400">Cuộc gọi</p>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <p className="text-lg text-green-600">2</p>
                  <p className="text-[8px] text-green-700">Kết nối</p>
                </div>
                <div className="p-2 bg-blue-50 rounded-lg">
                  <p className="text-lg text-blue-600">26p</p>
                  <p className="text-[8px] text-blue-700">Tổng phút</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === Tab: History === */}
      {activeTab === "history" && (
        <div className="space-y-2">
          {MOCK_CALL_HISTORY.map((call) => {
            const dispCfg = DISPOSITION_CFG[call.disposition];
            const isExpanded = expandedCall === call.id;
            return (
              <div key={call.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                <button type="button" onClick={() => setExpandedCall(isExpanded ? null : call.id)}
                  className="w-full flex items-center gap-3 p-3 text-left hover:bg-gray-50/50">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${
                    call.direction === "inbound" ? "bg-blue-50 border border-blue-200" : "bg-emerald-50 border border-emerald-200"
                  }`}>
                    {call.direction === "inbound" ? <PhoneIncoming className="w-4 h-4 text-blue-600" /> : <PhoneOutgoing className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-gray-900">{call.contactName}</span>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded ${dispCfg.color}`}>{dispCfg.label}</span>
                    </div>
                    <p className="text-[10px] text-gray-400">{call.contactCompany} • {call.phone}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {call.duration > 0 && <p className="text-xs text-gray-700">{Math.floor(call.duration / 60)}:{(call.duration % 60).toString().padStart(2, "0")}</p>}
                    <p className="text-[9px] text-gray-400">{new Date(call.createdAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                </button>

                {isExpanded && call.aiSummary && (
                  <div className="px-3 pb-3 border-t border-gray-50">
                    <div className="mt-2 bg-violet-50 rounded-lg p-3 border border-violet-200">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Sparkles className="w-3.5 h-3.5 text-violet-600" />
                        <span className="text-[10px] text-violet-600">AI Call Summary</span>
                        {call.sentimentScore !== 0 && (
                          <span className={`text-[8px] px-1.5 py-0.5 rounded ml-auto ${
                            call.sentimentScore >= 50 ? "bg-green-100 text-green-600" :
                            call.sentimentScore >= 0 ? "bg-amber-100 text-amber-600" :
                            "bg-red-100 text-red-600"
                          }`}>Sentiment: {call.sentimentScore > 0 ? "+" : ""}{call.sentimentScore}</span>
                        )}
                      </div>
                      <p className="text-xs text-violet-800 leading-relaxed">{call.aiSummary}</p>
                    </div>
                    {call.notes && (
                      <div className="mt-2">
                        <p className="text-[10px] text-gray-400 mb-0.5">Ghi chú:</p>
                        <p className="text-xs text-gray-600">{call.notes}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2 text-[9px] text-gray-400">
                      <span>Agent: {call.agent}</span>
                      {call.recordingUrl && (
                        <button type="button" onClick={() => toast.success("Đang phát lại bản ghi")}
                          className="flex items-center gap-0.5 text-blue-600 hover:underline">
                          <Volume2 className="w-3 h-3" /> Nghe lại
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* === Tab: Analytics === */}
      {activeTab === "analytics" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
              <p className="text-xl text-gray-900">156</p>
              <p className="text-[9px] text-gray-400">Cuộc gọi (30d)</p>
            </div>
            <div className="bg-green-50 rounded-xl border border-green-200 p-3 text-center">
              <p className="text-xl text-green-600">52%</p>
              <p className="text-[9px] text-green-700">Connect Rate</p>
            </div>
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-3 text-center">
              <p className="text-xl text-blue-600">5:24</p>
              <p className="text-[9px] text-blue-700">TB thời lượng</p>
            </div>
            <div className="bg-violet-50 rounded-xl border border-violet-200 p-3 text-center">
              <p className="text-xl text-violet-600">23%</p>
              <p className="text-[9px] text-violet-700">Conversion → Demo</p>
            </div>
          </div>

          {/* Disposition breakdown */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h4 className="text-sm text-gray-900 mb-3">Phân loại kết quả cuộc gọi (30 ngày)</h4>
            <div className="space-y-2">
              {[
                { disp: "interested" as Disposition, count: 36, pct: 23 },
                { disp: "connected" as Disposition, count: 28, pct: 18 },
                { disp: "callback" as Disposition, count: 24, pct: 15 },
                { disp: "no-answer" as Disposition, count: 32, pct: 21 },
                { disp: "voicemail" as Disposition, count: 18, pct: 12 },
                { disp: "not-interested" as Disposition, count: 12, pct: 8 },
                { disp: "busy" as Disposition, count: 6, pct: 3 },
              ].map((d) => (
                <div key={d.disp} className="flex items-center gap-3">
                  <span className={`text-[9px] px-2 py-0.5 rounded w-28 text-center ${DISPOSITION_CFG[d.disp].color}`}>{DISPOSITION_CFG[d.disp].label}</span>
                  <div className="flex-1">
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${d.pct * 3}%` }} />
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 w-8 text-right">{d.count}</span>
                  <span className="text-[9px] text-gray-400 w-8 text-right">{d.pct}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top performers */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h4 className="text-sm text-gray-900 mb-3">Top Sales Reps (30 ngày)</h4>
            <div className="space-y-2">
              {[
                { name: "Trần Đức Anh", calls: 68, connected: 38, avgDuration: "6:12", conversion: 28 },
                { name: "Nguyễn Thị Mai", calls: 52, connected: 30, avgDuration: "5:48", conversion: 24 },
                { name: "Phạm Minh Tâm", calls: 36, connected: 18, avgDuration: "4:30", conversion: 16 },
              ].map((rep, i) => (
                <div key={rep.name} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <span className="text-[9px] text-gray-400 w-4">{i + 1}.</span>
                  <span className="text-xs text-gray-900 flex-1">{rep.name}</span>
                  <span className="text-[9px] text-gray-500">{rep.calls} gọi</span>
                  <span className="text-[9px] text-green-600">{rep.connected} KN</span>
                  <span className="text-[9px] text-blue-600">{rep.avgDuration}</span>
                  <span className="text-[9px] text-violet-600">{rep.conversion}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl border border-emerald-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <h4 className="text-sm text-emerald-900">AI Call Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-emerald-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Trần Đức Anh có connect rate <strong>56%</strong> — cao nhất team. Bí quyết: gọi 8-9h sáng thứ 3, 5. Đề xuất toàn team áp dụng.</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span>Objection phổ biến nhất: <strong>"đã dùng Salesforce"</strong> (18%). AI đề xuất battle card mới với ROI comparison data.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>AI phát hiện cuộc gọi kéo dài &gt;8 phút có <strong>conversion rate 3.5x</strong> cao hơn. Đề xuất tối thiểu 5 phút/cuộc cho discovery calls.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
