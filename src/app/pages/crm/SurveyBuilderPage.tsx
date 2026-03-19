/**
 * Survey Builder — Khảo sát nâng cao
 * Tạo khảo sát đa dạng: NPS, CSAT, CES, custom surveys,
 * logic branching, analytics, export, CRM integration.
 */
import { useState, useMemo } from "react";
import {
  ClipboardList,
  Plus,
  Search,
  Eye,
  Copy,
  Trash2,
  Pencil,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Bot,
  BarChart3,
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Users,
  CheckCircle2,
  X,
  Send,
  Clock,
  ExternalLink,
  FileDown,
  Share2,
  Zap,
  ArrowUpRight,
  Hash,
  ListChecks,
  ToggleLeft,
  CircleDot,
  Type,
  Smile,
  Frown,
  Meh,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
type SurveyType = "nps" | "csat" | "ces" | "custom" | "onboarding" | "exit";
type SurveyStatus = "active" | "draft" | "completed" | "paused";
type QuestionType = "nps-scale" | "csat-scale" | "rating" | "single-choice" | "multi-choice" | "text" | "ces-scale" | "emoji";

interface SurveyQuestion {
  id: string;
  type: QuestionType;
  text: string;
  required: boolean;
  options?: string[];
}

interface Survey {
  id: string;
  name: string;
  type: SurveyType;
  status: SurveyStatus;
  questions: SurveyQuestion[];
  trigger: string;
  targetAudience: string;
  // Stats
  sent: number;
  responses: number;
  responseRate: number;
  avgScore: number | null;
  npsScore: number | null;
  // Meta
  createdBy: string;
  createdAt: string;
  expiresAt: string | null;
  tags: string[];
}

/* ============================================================
 * Constants
 * ============================================================ */
const TYPE_CFG: Record<SurveyType, { label: string; color: string; bg: string }> = {
  nps: { label: "NPS", color: "text-violet-600", bg: "bg-violet-50 border-violet-200" },
  csat: { label: "CSAT", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  ces: { label: "CES", color: "text-teal-600", bg: "bg-teal-50 border-teal-200" },
  custom: { label: "Tuỳ chỉnh", color: "text-gray-600", bg: "bg-gray-50 border-gray-200" },
  onboarding: { label: "Onboarding", color: "text-green-600", bg: "bg-green-50 border-green-200" },
  exit: { label: "Exit Survey", color: "text-red-600", bg: "bg-red-50 border-red-200" },
};

const STATUS_CFG: Record<SurveyStatus, { label: string; color: string; bg: string }> = {
  active: { label: "Đang chạy", color: "text-green-600", bg: "bg-green-50 border-green-200" },
  draft: { label: "Bản nháp", color: "text-gray-500", bg: "bg-gray-50 border-gray-200" },
  completed: { label: "Hoàn thành", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  paused: { label: "Tạm dừng", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
};

const Q_ICONS: Record<QuestionType, React.ComponentType<{ className?: string }>> = {
  "nps-scale": Hash, "csat-scale": Star, rating: Star, "single-choice": CircleDot,
  "multi-choice": ListChecks, text: Type, "ces-scale": BarChart3, emoji: Smile,
};

/* ============================================================
 * Mock Data
 * ============================================================ */
const MOCK_SURVEYS: Survey[] = [
  {
    id: "srv_001", name: "NPS Survey Q1/2026", type: "nps", status: "active",
    questions: [
      { id: "q1", type: "nps-scale", text: "Bạn sẽ giới thiệu AI-CRM cho đồng nghiệp/bạn bè ở mức nào? (0-10)", required: true },
      { id: "q2", type: "text", text: "Vì sao bạn chọn điểm này?", required: false },
      { id: "q3", type: "single-choice", text: "Tính năng bạn yêu thích nhất?", required: false, options: ["AI Insights", "Sales Pipeline", "Automation", "Reports", "Integrations", "Khác"] },
    ],
    trigger: "Tự động sau 30 ngày sử dụng", targetAudience: "Active customers (>30 ngày)",
    sent: 5600, responses: 1890, responseRate: 33.8, avgScore: null, npsScore: 62,
    createdBy: "Lê Hoàng Đức", createdAt: "2026-02-01T09:00:00Z", expiresAt: "2026-03-31T23:59:00Z",
    tags: ["NPS", "Q1-2026", "Quarterly"],
  },
  {
    id: "srv_002", name: "CSAT — Post-Support Ticket", type: "csat", status: "active",
    questions: [
      { id: "q1", type: "csat-scale", text: "Bạn hài lòng với hỗ trợ vừa nhận được ở mức nào?", required: true },
      { id: "q2", type: "single-choice", text: "Thời gian phản hồi thế nào?", required: true, options: ["Rất nhanh", "Nhanh", "Bình thường", "Chậm", "Rất chậm"] },
      { id: "q3", type: "text", text: "Góp ý thêm để chúng tôi cải thiện?", required: false },
    ],
    trigger: "Trigger: khi ticket status = Resolved", targetAudience: "Tất cả customers có ticket resolved",
    sent: 3400, responses: 1560, responseRate: 45.9, avgScore: 4.2, npsScore: null,
    createdBy: "Vũ Thanh Hà", createdAt: "2025-12-01T10:00:00Z", expiresAt: null,
    tags: ["CSAT", "Support", "Automated"],
  },
  {
    id: "srv_003", name: "CES — Sau khi Onboarding", type: "ces", status: "active",
    questions: [
      { id: "q1", type: "ces-scale", text: "Mức độ dễ dàng khi cài đặt và bắt đầu dùng AI-CRM? (1-7)", required: true },
      { id: "q2", type: "multi-choice", text: "Bước nào khó nhất?", required: false, options: ["Import dữ liệu", "Cấu hình pipeline", "Thiết lập automation", "Kết nối tích hợp", "Training nhân viên", "Không có bước nào khó"] },
      { id: "q3", type: "emoji", text: "Cảm xúc tổng thể về trải nghiệm onboarding?", required: true },
      { id: "q4", type: "text", text: "Bạn muốn cải thiện gì ở quy trình onboarding?", required: false },
    ],
    trigger: "Tự động sau 7 ngày kể từ khi activate", targetAudience: "New customers (activate < 14 ngày)",
    sent: 890, responses: 412, responseRate: 46.3, avgScore: 5.8, npsScore: null,
    createdBy: "Nguyễn Thị Mai", createdAt: "2026-01-15T10:00:00Z", expiresAt: null,
    tags: ["CES", "Onboarding", "Automated"],
  },
  {
    id: "srv_004", name: "Exit Survey — Churned Customers", type: "exit", status: "active",
    questions: [
      { id: "q1", type: "single-choice", text: "Lý do chính bạn ngừng sử dụng AI-CRM?", required: true, options: ["Giá quá cao", "Thiếu tính năng cần thiết", "Khó sử dụng", "Chuyển sang sản phẩm khác", "Công ty thay đổi chiến lược", "Khác"] },
      { id: "q2", type: "single-choice", text: "Bạn chuyển sang sản phẩm nào?", required: false, options: ["Salesforce", "HubSpot", "Zoho CRM", "Freshsales", "Tự phát triển", "Không dùng CRM", "Khác"] },
      { id: "q3", type: "rating", text: "Mức độ hài lòng tổng thể với AI-CRM? (1-5 sao)", required: true },
      { id: "q4", type: "text", text: "Điều gì sẽ khiến bạn quay lại?", required: false },
    ],
    trigger: "Trigger: khi subscription cancelled", targetAudience: "Churned customers",
    sent: 420, responses: 134, responseRate: 31.9, avgScore: 2.8, npsScore: null,
    createdBy: "Phạm Minh Tâm", createdAt: "2025-11-01T10:00:00Z", expiresAt: null,
    tags: ["Exit", "Churn", "Automated"],
  },
  {
    id: "srv_005", name: "Feature Feedback — AI Sales Coach", type: "custom", status: "completed",
    questions: [
      { id: "q1", type: "rating", text: "Đánh giá tính năng AI Sales Coach (1-5 sao)?", required: true },
      { id: "q2", type: "multi-choice", text: "Bạn dùng AI Sales Coach cho mục đích gì?", required: true, options: ["Soạn email", "Chuẩn bị cuộc gọi", "Handle objections", "Research khách hàng", "Dự báo deal", "Khác"] },
      { id: "q3", type: "single-choice", text: "AI Sales Coach giúp tiết kiệm bao nhiêu thời gian/ngày?", required: true, options: ["< 30 phút", "30-60 phút", "1-2 giờ", "2-3 gi���", "> 3 giờ"] },
      { id: "q4", type: "text", text: "Tính năng nào bạn muốn thêm cho AI Sales Coach?", required: false },
    ],
    trigger: "Email blast 1 lần", targetAudience: "Users đã dùng AI Sales Coach > 5 lần",
    sent: 1200, responses: 567, responseRate: 47.3, avgScore: 4.3, npsScore: null,
    createdBy: "Trần Đức Anh", createdAt: "2026-02-15T10:00:00Z", expiresAt: "2026-03-01T23:59:00Z",
    tags: ["Feature Feedback", "AI Sales Coach"],
  },
  {
    id: "srv_006", name: "Onboarding Check-in Day 3", type: "onboarding", status: "draft",
    questions: [
      { id: "q1", type: "emoji", text: "Cảm xúc của bạn sau 3 ngày dùng AI-CRM?", required: true },
      { id: "q2", type: "single-choice", text: "Bạn đã hoàn thành setup chưa?", required: true, options: ["Đã xong hoàn toàn", "Gần xong", "Mới bắt đầu", "Chưa bắt đầu"] },
      { id: "q3", type: "text", text: "Bạn cần hỗ trợ gì không?", required: false },
    ],
    trigger: "Tự động ngày thứ 3 sau activate", targetAudience: "New customers",
    sent: 0, responses: 0, responseRate: 0, avgScore: null, npsScore: null,
    createdBy: "Vũ Thanh Hà", createdAt: "2026-03-03T08:00:00Z", expiresAt: null,
    tags: ["Onboarding", "Day 3", "Check-in"],
  },
];

/* ============================================================
 * NPS Gauge
 * ============================================================ */
function NpsGauge({ score }: { score: number }) {
  const color = score >= 50 ? "text-green-600" : score >= 0 ? "text-amber-600" : "text-red-600";
  const bg = score >= 50 ? "bg-green-50 border-green-200" : score >= 0 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200";
  const label = score >= 50 ? "Excellent" : score >= 0 ? "Good" : "Needs Work";
  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg border ${bg}`}>
      <span className={`text-sm ${color}`}>{score}</span>
      <span className={`text-[8px] ${color}`}>{label}</span>
    </div>
  );
}

/* ============================================================
 * Detail Modal
 * ============================================================ */
function SurveyDetailModal({ survey, onClose }: { survey: Survey; onClose: () => void }) {
  const typeCfg = TYPE_CFG[survey.type];
  const statusCfg = STATUS_CFG[survey.status];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] shadow-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm text-gray-900">{survey.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`text-[8px] px-1.5 py-0.5 rounded border ${typeCfg.bg} ${typeCfg.color}`}>{typeCfg.label}</span>
              <span className={`text-[8px] px-1.5 py-0.5 rounded border ${statusCfg.bg} ${statusCfg.color}`}>{statusCfg.label}</span>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        {/* Questions */}
        <div className="p-4 space-y-3">
          <p className="text-[10px] text-gray-400">Câu hỏi ({survey.questions.length})</p>
          {survey.questions.map((q, i) => {
            const QIcon = Q_ICONS[q.type];
            return (
              <div key={q.id} className="flex gap-2 p-2.5 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-[9px] text-gray-400 mt-0.5 w-4 flex-shrink-0">{i + 1}.</span>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <QIcon className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-700">{q.text}</span>
                    {q.required && <span className="text-red-400 text-[8px]">*</span>}
                  </div>
                  {q.options && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {q.options.map((o) => (
                        <span key={o} className="text-[8px] px-1.5 py-0.5 bg-white border border-gray-200 rounded text-gray-500">{o}</span>
                      ))}
                    </div>
                  )}
                  {q.type === "nps-scale" && <div className="flex gap-0.5 mt-1">{Array.from({ length: 11 }).map((_, n) => <span key={n} className="w-5 h-5 rounded bg-white border border-gray-200 text-[8px] flex items-center justify-center text-gray-400">{n}</span>)}</div>}
                  {q.type === "emoji" && <div className="flex gap-2 mt-1"><Frown className="w-5 h-5 text-red-300" /><Meh className="w-5 h-5 text-amber-300" /><Smile className="w-5 h-5 text-green-300" /></div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* Meta */}
        <div className="px-4 pb-4 text-[10px] text-gray-400 space-y-1 border-t border-gray-100 pt-3">
          <div className="flex justify-between"><span>Trigger:</span><span className="text-gray-600">{survey.trigger}</span></div>
          <div className="flex justify-between"><span>Đối tượng:</span><span className="text-gray-600">{survey.targetAudience}</span></div>
          {survey.responses > 0 && <div className="flex justify-between"><span>Response rate:</span><span className="text-gray-600">{survey.responseRate}%</span></div>}
          {survey.npsScore != null && <div className="flex justify-between"><span>NPS Score:</span><NpsGauge score={survey.npsScore} /></div>}
          {survey.avgScore != null && <div className="flex justify-between"><span>Điểm TB:</span><span className="text-gray-600">{survey.avgScore}/5</span></div>}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Create Survey Modal
 * ============================================================ */
function CreateSurveyModal({ onClose, onCreated }: { onClose: () => void; onCreated: (survey: Survey) => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState<SurveyType>("nps");
  const [trigger, setTrigger] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [questions, setQuestions] = useState<SurveyQuestion[]>([
    { id: `q_${Date.now()}`, type: "nps-scale", text: "Bạn sẽ giới thiệu sản phẩm cho đồng nghiệp ở mức nào? (0-10)", required: true },
  ]);
  const [saving, setSaving] = useState(false);

  const addQuestion = (qType: QuestionType) => {
    const templates: Record<QuestionType, string> = {
      "nps-scale": "Bạn sẽ giới thiệu sản phẩm cho bạn bè? (0-10)",
      "csat-scale": "Bạn hài lòng với dịch vụ ở mức nào?",
      "ces-scale": "Mức độ dễ dàng khi thực hiện thao tác? (1-7)",
      "rating": "Đánh giá trải nghiệm tổng thể? (1-5 sao)",
      "single-choice": "Chọn một đáp án phù hợp nhất",
      "multi-choice": "Chọn các đáp án phù hợp",
      "text": "Chia sẻ thêm ý kiến của bạn",
      "emoji": "Cảm xúc tổng thể của bạn?",
    };
    setQuestions((prev) => [...prev, {
      id: `q_${Date.now()}`, type: qType, text: templates[qType], required: false,
      options: ["single-choice", "multi-choice"].includes(qType) ? ["Đáp án 1", "Đáp án 2", "Đáp án 3"] : undefined,
    }]);
  };

  const removeQuestion = (id: string) => setQuestions((prev) => prev.filter((q) => q.id !== id));

  const updateQuestion = (id: string, updates: Partial<SurveyQuestion>) => {
    setQuestions((prev) => prev.map((q) => q.id === id ? { ...q, ...updates } : q));
  };

  const handleSave = () => {
    if (!name.trim()) { toast.error("Vui lòng nhập tên khảo sát"); return; }
    if (questions.length === 0) { toast.error("Vui lòng thêm ít nhất 1 câu hỏi"); return; }
    setSaving(true);
    const newSurvey: Survey = {
      id: `srv_${Date.now()}`, name, type, status: "draft", questions,
      trigger: trigger || "Thủ công", targetAudience: targetAudience || "Tất cả",
      sent: 0, responses: 0, responseRate: 0, avgScore: null, npsScore: null,
      createdBy: "Người dùng hiện tại", createdAt: new Date().toISOString(), expiresAt: null,
      tags: [],
    };
    onCreated(newSurvey);
    toast.success(`Đã tạo khảo sát "${name}" với ${questions.length} câu hỏi`);
    setSaving(false);
    onClose();
  };

  const qTypeLabels: Record<QuestionType, string> = {
    "nps-scale": "NPS (0-10)", "csat-scale": "CSAT", "ces-scale": "CES (1-7)",
    "rating": "Rating ⭐", "single-choice": "Một lựa chọn", "multi-choice": "Nhiều lựa chọn",
    "text": "Tự do", "emoji": "Emoji 😊",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Tạo Khảo sát mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3 max-h-[65vh] overflow-y-auto">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tên khảo sát *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: NPS Survey Q2/2026"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Loại khảo sát</label>
              <select value={type} onChange={(e) => setType(e.target.value as SurveyType)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                {Object.entries(TYPE_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Trigger</label>
              <input type="text" value={trigger} onChange={(e) => setTrigger(e.target.value)} placeholder="VD: Sau 30 ngày"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Đối tượng</label>
              <input type="text" value={targetAudience} onChange={(e) => setTargetAudience(e.target.value)} placeholder="VD: Active users"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>

          {/* Questions Builder */}
          <div>
            <label className="text-xs text-gray-500 mb-2 block">Câu hỏi ({questions.length})</label>
            <div className="space-y-1.5 mb-2">
              {questions.map((q, idx) => {
                const QIcon = Q_ICONS[q.type];
                return (
                  <div key={q.id} className="bg-gray-50 rounded-lg p-2 group">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] text-gray-300 w-4">{idx + 1}</span>
                      <QIcon className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                      <input type="text" value={q.text} onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
                        className="flex-1 text-sm bg-transparent border-none focus:outline-none text-gray-700" />
                      <span className="text-[8px] text-violet-500 bg-violet-50 px-1.5 py-0.5 rounded flex-shrink-0">{qTypeLabels[q.type]}</span>
                      <label className="flex items-center gap-1 text-[9px] text-gray-400 cursor-pointer flex-shrink-0">
                        <input type="checkbox" checked={q.required} onChange={(e) => updateQuestion(q.id, { required: e.target.checked })}
                          className="w-3 h-3 rounded border-gray-300 text-violet-600" />
                        Bắt buộc
                      </label>
                      <button type="button" onClick={() => removeQuestion(q.id)}
                        className="p-0.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    {q.options && (
                      <div className="ml-9 mt-1 flex flex-wrap gap-1">
                        {q.options.map((o, oi) => (
                          <span key={oi} className="text-[8px] px-1.5 py-0.5 bg-white border border-gray-200 rounded text-gray-500">{o}</span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-1">
              {(Object.entries(qTypeLabels) as [QuestionType, string][]).map(([qType, label]) => {
                const QIcon = Q_ICONS[qType];
                return (
                  <button key={qType} type="button" onClick={() => addQuestion(qType)}
                    className="flex items-center gap-1 px-2 py-1 text-[9px] text-gray-500 bg-white border border-dashed border-gray-200 rounded hover:border-violet-300 hover:text-violet-600 transition-colors">
                    <QIcon className="w-2.5 h-2.5" /> {label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="bg-violet-50 rounded-lg p-3 border border-violet-100">
            <p className="text-[10px] text-violet-700 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Sau khi tạo, bạn có thể thêm logic branching, scheduling, và custom styling trong Survey Editor.</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo khảo sát"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Main Page
 * ============================================================ */
export function SurveyBuilderPage() {
  const [surveys, setSurveys] = useState<Survey[]>(MOCK_SURVEYS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<SurveyStatus | "all">("all");
  const [selectedSurvey, setSelectedSurvey] = useState<Survey | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = useMemo(() => {
    let result = surveys;
    if (statusFilter !== "all") result = result.filter((s) => s.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(q));
    }
    return result;
  }, [surveys, statusFilter, search]);

  const stats = useMemo(() => ({
    total: surveys.length,
    active: surveys.filter((s) => s.status === "active").length,
    totalSent: surveys.reduce((s, sv) => s + sv.sent, 0),
    totalResponses: surveys.reduce((s, sv) => s + sv.responses, 0),
    avgResponseRate: surveys.filter((s) => s.responseRate > 0).length > 0
      ? (surveys.filter((s) => s.responseRate > 0).reduce((acc, s) => acc + s.responseRate, 0) / surveys.filter((s) => s.responseRate > 0).length).toFixed(1) : "0",
    npsScore: surveys.find((s) => s.type === "nps" && s.npsScore != null)?.npsScore ?? null,
  }), [surveys]);

  const handleDuplicate = (survey: Survey) => {
    const clone: Survey = { ...survey, id: `srv_${Date.now()}`, name: `${survey.name} (Copy)`, status: "draft", sent: 0, responses: 0, responseRate: 0, avgScore: null, npsScore: null, createdAt: new Date().toISOString() };
    setSurveys((prev) => [clone, ...prev]);
    toast.success("Đã sao chép khảo sát");
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-violet-600" /> Survey Builder
        </h1>
        <p className="text-gray-500 mt-0.5">
          Tạo khảo sát NPS, CSAT, CES — logic branching, auto-trigger, CRM integration
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        <div className="bg-white rounded-xl border border-gray-100 p-2.5 text-center">
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-[9px] text-gray-400">Khảo sát</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{stats.active}</p>
          <p className="text-[9px] text-green-700">Đang chạy</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{stats.totalSent.toLocaleString()}</p>
          <p className="text-[9px] text-blue-700">Đã gửi</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-2.5 text-center">
          <p className="text-lg text-violet-600">{stats.totalResponses.toLocaleString()}</p>
          <p className="text-[9px] text-violet-700">Phản hồi</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-2.5 text-center">
          <p className="text-lg text-amber-600">{stats.avgResponseRate}%</p>
          <p className="text-[9px] text-amber-700">TB Response</p>
        </div>
        {stats.npsScore != null && (
          <div className={`rounded-xl border p-2.5 text-center ${stats.npsScore >= 50 ? "bg-green-50 border-green-200" : "bg-amber-50 border-amber-200"}`}>
            <p className={`text-lg ${stats.npsScore >= 50 ? "text-green-600" : "text-amber-600"}`}>{stats.npsScore}</p>
            <p className="text-[9px] text-gray-500">NPS Score</p>
          </div>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[150px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Tìm khảo sát..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as SurveyStatus | "all")}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
          <option value="all">Tất cả</option>
          {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <button type="button" onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">
          <Plus className="w-4 h-4" /> Tạo khảo sát
        </button>
      </div>

      {/* Survey Cards */}
      <div className="space-y-3">
        {filtered.map((survey) => {
          const typeCfg = TYPE_CFG[survey.type];
          const stCfg = STATUS_CFG[survey.status];
          return (
            <div key={survey.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-violet-200 transition-colors">
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${typeCfg.bg}`}>
                    <ClipboardList className={`w-5 h-5 ${typeCfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm text-gray-900">{survey.name}</h3>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded border ${typeCfg.bg} ${typeCfg.color}`}>{typeCfg.label}</span>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded border ${stCfg.bg} ${stCfg.color}`}>{stCfg.label}</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">{survey.questions.length} câu hỏi • {survey.trigger}</p>

                    {/* Question types preview */}
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      {survey.questions.map((q) => {
                        const QIcon = Q_ICONS[q.type];
                        return (
                          <span key={q.id} className="flex items-center gap-0.5 text-[8px] px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded text-gray-500">
                            <QIcon className="w-2.5 h-2.5" /> {q.type.replace("-", " ")}
                          </span>
                        );
                      })}
                    </div>

                    {/* Stats */}
                    {survey.sent > 0 && (
                      <div className="flex items-center gap-3 mt-2 text-[9px] text-gray-400 flex-wrap">
                        <span className="flex items-center gap-0.5"><Send className="w-3 h-3" /> {survey.sent.toLocaleString()} gửi</span>
                        <span className="flex items-center gap-0.5"><Users className="w-3 h-3" /> {survey.responses.toLocaleString()} phản hồi</span>
                        <span className={`flex items-center gap-0.5 ${survey.responseRate >= 40 ? "text-green-500" : survey.responseRate >= 25 ? "text-blue-500" : "text-amber-500"}`}>
                          <ArrowUpRight className="w-3 h-3" /> {survey.responseRate}%
                        </span>
                        {survey.npsScore != null && <NpsGauge score={survey.npsScore} />}
                        {survey.avgScore != null && (
                          <span className="flex items-center gap-0.5 text-amber-500">
                            <Star className="w-3 h-3" /> {survey.avgScore}/5
                          </span>
                        )}
                      </div>
                    )}

                    {/* Response bar */}
                    {survey.sent > 0 && (
                      <div className="mt-2">
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${survey.responseRate >= 40 ? "bg-green-400" : survey.responseRate >= 25 ? "bg-blue-400" : "bg-amber-400"}`}
                            style={{ width: `${Math.min(survey.responseRate * 2, 100)}%` }} />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      {survey.tags.map((t) => (
                        <span key={t} className="text-[8px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex-wrap">
                <button type="button" onClick={() => setSelectedSurvey(survey)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-gray-500 hover:bg-white rounded-lg">
                  <Eye className="w-3 h-3" /> Xem chi tiết
                </button>
                <button type="button" onClick={() => handleDuplicate(survey)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-gray-500 hover:bg-white rounded-lg">
                  <Copy className="w-3 h-3" /> Sao chép
                </button>
                <button type="button" onClick={() => toast.success("Export responses to CSV")}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-blue-600 hover:bg-blue-50 rounded-lg">
                  <FileDown className="w-3 h-3" /> Export
                </button>
                <div className="flex-1" />
                <button type="button" onClick={() => { setSurveys((prev) => prev.filter((s) => s.id !== survey.id)); toast.success("Đã xoá"); }}
                  className="p-1.5 text-gray-300 hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <ClipboardList className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Không tìm thấy khảo sát nào</p>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Survey Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>NPS Score <strong>62</strong> — tăng 8 điểm so với Q4/2025. Promoters tăng mạnh ở segment <strong>Enterprise</strong> (+15 điểm). Key driver: AI Insights feature.</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span>Exit Survey: <strong>34% churn vì giá</strong>, 28% thiếu tính năng. Top feature request: <strong>"Mobile app native"</strong> (45 lần đề cập). Recommend ưu tiên Phase 16.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>CES onboarding <strong>5.8/7</strong> — bước khó nhất: <strong>"Import dữ liệu"</strong> (42%). AI đề xuất thêm wizard import tự động từ CSV/Excel/Salesforce.</span>
          </p>
        </div>
      </div>

      {selectedSurvey && <SurveyDetailModal survey={selectedSurvey} onClose={() => setSelectedSurvey(null)} />}
      {showCreateModal && <CreateSurveyModal onClose={() => setShowCreateModal(false)} onCreated={(survey) => { setSurveys((prev) => [survey, ...prev]); }} />}
    </div>
  );
}