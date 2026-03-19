/**
 * AI Score Explanation Modal — Giải thích chi tiết cách AI tính điểm
 * lead/contact/deal. Sử dụng cho Contact Detail, Lead Inbox, Deal Detail.
 */
import { useState } from "react";
import {
  X,
  Bot,
  TrendingUp,
  TrendingDown,
  Building2,
  Briefcase,
  Globe,
  Clock,
  Mail,
  Phone,
  Activity,
  Target,
  Zap,
  Info,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

/* ============================================================
 * Types
 * ============================================================ */
export type ScoreCategory = "lead" | "engagement" | "deal";

interface ScoreFactor {
  label: string;
  value: number;
  maxValue: number;
  weight: number;
  trend: "up" | "down" | "stable";
  description: string;
  icon: React.ReactNode;
}

interface AIScoreData {
  overallScore: number;
  category: ScoreCategory;
  entityName: string;
  lastUpdated: string;
  factors: ScoreFactor[];
  recommendations: string[];
  historicalScores: { date: string; score: number }[];
}

/* ============================================================
 * Mock Generator — tạo dữ liệu phân tích AI
 * ============================================================ */
function generateScoreData(
  score: number,
  name: string,
  category: ScoreCategory,
): AIScoreData {
  const leadFactors: ScoreFactor[] = [
    {
      label: "Quy mô công ty",
      value: Math.min(25, Math.round(score * 0.25)),
      maxValue: 25,
      weight: 25,
      trend: "stable",
      description: "Dựa trên số nhân viên, doanh thu ước tính, và thị trường hoạt động.",
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      label: "Vị trí người liên hệ",
      value: Math.min(20, Math.round(score * 0.22)),
      maxValue: 20,
      weight: 20,
      trend: "stable",
      description: "C-level và VP có quyền quyết định mua hàng cao hơn.",
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      label: "Mức độ tương tác",
      value: Math.min(20, Math.round(score * 0.2)),
      maxValue: 20,
      weight: 20,
      trend: score >= 70 ? "up" : "down",
      description: "Tần suất mở email, click link, trả lời tin nhắn trong 30 ngày.",
      icon: <Activity className="w-4 h-4" />,
    },
    {
      label: "Phù hợp ICP",
      value: Math.min(15, Math.round(score * 0.16)),
      maxValue: 15,
      weight: 15,
      trend: "stable",
      description: "So sánh với Ideal Customer Profile: ngành, quy mô, công nghệ.",
      icon: <Target className="w-4 h-4" />,
    },
    {
      label: "Nguồn lead",
      value: Math.min(10, Math.round(score * 0.09)),
      maxValue: 10,
      weight: 10,
      trend: "stable",
      description: "Referral và Clutch có tỷ lệ chuyển đổi cao hơn Cold Outreach.",
      icon: <Globe className="w-4 h-4" />,
    },
    {
      label: "Thời gian phản hồi",
      value: Math.min(10, Math.round(score * 0.1)),
      maxValue: 10,
      weight: 10,
      trend: score >= 80 ? "up" : score >= 50 ? "stable" : "down",
      description: "Thời gian phản hồi trung bình của lead khi được liên hệ.",
      icon: <Clock className="w-4 h-4" />,
    },
  ];

  const engagementFactors: ScoreFactor[] = [
    {
      label: "Tần suất liên hệ",
      value: Math.min(25, Math.round(score * 0.26)),
      maxValue: 25,
      weight: 25,
      trend: score >= 70 ? "up" : "down",
      description: "Số lần tương tác qua email, call, meeting trong 30 ngày.",
      icon: <Phone className="w-4 h-4" />,
    },
    {
      label: "Phản hồi email",
      value: Math.min(20, Math.round(score * 0.21)),
      maxValue: 20,
      weight: 20,
      trend: score >= 60 ? "up" : "down",
      description: "Tỷ lệ mở email và click-through rate.",
      icon: <Mail className="w-4 h-4" />,
    },
    {
      label: "Thời gian tương tác",
      value: Math.min(20, Math.round(score * 0.19)),
      maxValue: 20,
      weight: 20,
      trend: "stable",
      description: "Thời gian trung bình mỗi phiên tương tác (meeting, call).",
      icon: <Clock className="w-4 h-4" />,
    },
    {
      label: "Hoạt động gần đây",
      value: Math.min(20, Math.round(score * 0.2)),
      maxValue: 20,
      weight: 20,
      trend: score >= 75 ? "up" : score >= 40 ? "stable" : "down",
      description: "Mức độ hoạt động trong 7 ngày gần nhất.",
      icon: <Activity className="w-4 h-4" />,
    },
    {
      label: "Độ sâu quan hệ",
      value: Math.min(15, Math.round(score * 0.15)),
      maxValue: 15,
      weight: 15,
      trend: "stable",
      description: "Số người liên hệ trong cùng tổ chức, đa kênh tương tác.",
      icon: <Building2 className="w-4 h-4" />,
    },
  ];

  const dealFactors: ScoreFactor[] = [
    {
      label: "Tiến triển deal",
      value: Math.min(25, Math.round(score * 0.27)),
      maxValue: 25,
      weight: 25,
      trend: score >= 70 ? "up" : "stable",
      description: "Tốc độ di chuyển qua các giai đoạn pipeline.",
      icon: <Target className="w-4 h-4" />,
    },
    {
      label: "Engagement khách hàng",
      value: Math.min(20, Math.round(score * 0.2)),
      maxValue: 20,
      weight: 20,
      trend: score >= 60 ? "up" : "down",
      description: "Mức độ tham gia và phản hồi của khách hàng.",
      icon: <Activity className="w-4 h-4" />,
    },
    {
      label: "So sánh deal tương tự",
      value: Math.min(20, Math.round(score * 0.19)),
      maxValue: 20,
      weight: 20,
      trend: "stable",
      description: "So với các deal cùng ngành, quy mô, giai đoạn trong lịch sử.",
      icon: <Briefcase className="w-4 h-4" />,
    },
    {
      label: "Ngân sách & timeline",
      value: Math.min(15, Math.round(score * 0.15)),
      maxValue: 15,
      weight: 15,
      trend: score >= 80 ? "up" : "stable",
      description: "Khả năng ngân sách phù hợp và timeline close hợp lý.",
      icon: <Building2 className="w-4 h-4" />,
    },
    {
      label: "Đối thủ cạnh tranh",
      value: Math.min(20, Math.round(score * 0.18)),
      maxValue: 20,
      weight: 20,
      trend: score >= 70 ? "stable" : "down",
      description: "Mức độ cạnh tranh và vị thế so với đối thủ.",
      icon: <Zap className="w-4 h-4" />,
    },
  ];

  const factors =
    category === "lead"
      ? leadFactors
      : category === "engagement"
      ? engagementFactors
      : dealFactors;

  const recommendations =
    score >= 80
      ? [
          "Lead/Deal chất lượng cao — nên ưu tiên liên hệ trong 24h.",
          "Chuẩn bị proposal chi tiết phù hợp quy mô công ty.",
          "Lên lịch demo sản phẩm và gửi case study tương tự.",
        ]
      : score >= 60
      ? [
          "Tiềm năng trung bình — cần thêm hoạt động nurturing.",
          "Gửi thêm tài liệu liên quan để tăng engagement.",
          "Lên lịch gọi điện tìm hiểu nhu cầu cụ thể hơn.",
          "Xem xét gán cho AI Agent để tự động follow-up.",
        ]
      : [
          "Chất lượng thấp — xem xét chuyển sang nurture pipeline.",
          "AI đề xuất email nurturing tự động theo lịch trình 2 tuần/lần.",
          "Cần thu thập thêm thông tin để đánh giá lại.",
          "Xem xét disqualify nếu không có tín hiệu tích cực sau 30 ngày.",
        ];

  const historicalScores = [
    { date: "T12/2025", score: Math.max(20, score - 18) },
    { date: "T01/2026", score: Math.max(25, score - 12) },
    { date: "T02/2026", score: Math.max(30, score - 5) },
    { date: "T03/2026", score },
  ];

  return {
    overallScore: score,
    category,
    entityName: name,
    lastUpdated: "03/03/2026 08:00",
    factors,
    recommendations,
    historicalScores,
  };
}

/* ============================================================
 * Score Bar Component
 * ============================================================ */
function FactorBar({ factor }: { factor: ScoreFactor }) {
  const [expanded, setExpanded] = useState(false);
  const pct = (factor.value / factor.maxValue) * 100;
  const barColor =
    pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-blue-500" : pct >= 40 ? "bg-amber-500" : "bg-red-500";

  const TrendIcon =
    factor.trend === "up" ? TrendingUp : factor.trend === "down" ? TrendingDown : Activity;
  const trendColor =
    factor.trend === "up" ? "text-green-500" : factor.trend === "down" ? "text-red-500" : "text-gray-400";

  return (
    <div className="border border-gray-100 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 hover:bg-gray-50/50 transition-colors"
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-gray-400">{factor.icon}</span>
          <span className="text-sm text-gray-700 flex-1 text-left">{factor.label}</span>
          <TrendIcon className={`w-3.5 h-3.5 ${trendColor}`} />
          <span className="text-sm text-gray-900 w-16 text-right">
            {factor.value}/{factor.maxValue}
          </span>
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          )}
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full ${barColor} rounded-full transition-all`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-gray-400">Trọng số: {factor.weight}%</span>
        </div>
      </button>
      {expanded && (
        <div className="px-3 pb-3 border-t border-gray-50">
          <p className="text-xs text-gray-500 mt-2 flex items-start gap-1">
            <Info className="w-3 h-3 mt-0.5 flex-shrink-0 text-blue-400" />
            {factor.description}
          </p>
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * Main Modal
 * ============================================================ */
export function AIScoreModal({
  score,
  name,
  category,
  onClose,
}: {
  score: number;
  name: string;
  category: ScoreCategory;
  onClose: () => void;
}) {
  const data = generateScoreData(score, name, category);

  const scoreColor =
    score >= 80 ? "text-green-600" : score >= 60 ? "text-blue-600" : score >= 40 ? "text-amber-600" : "text-red-600";
  const scoreRingColor =
    score >= 80 ? "#22c55e" : score >= 60 ? "#3b82f6" : score >= 40 ? "#f59e0b" : "#ef4444";
  const scoreLabel =
    score >= 80 ? "Xuất sắc" : score >= 60 ? "Khá tốt" : score >= 40 ? "Trung bình" : "Cần cải thiện";

  const categoryLabel =
    category === "lead" ? "AI Lead Score" : category === "engagement" ? "Engagement Score" : "AI Win Probability";

  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - score / 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-blue-50 flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {/* Score Ring */}
              <div className="relative" style={{ width: 80, height: 80 }}>
                <svg width={80} height={80} className="rotate-[-90deg]">
                  <circle cx={40} cy={40} r={radius} fill="none" stroke="#e5e7eb" strokeWidth={5} />
                  <circle
                    cx={40} cy={40} r={radius} fill="none"
                    stroke={scoreRingColor} strokeWidth={5}
                    strokeDasharray={circumference} strokeDashoffset={offset}
                    strokeLinecap="round"
                  />
                </svg>
                <span className={`absolute inset-0 flex items-center justify-center text-xl ${scoreColor}`}>
                  {score}
                </span>
              </div>

              <div>
                <p className="text-xs text-violet-600 flex items-center gap-1 mb-0.5">
                  <Bot className="w-3.5 h-3.5" /> {categoryLabel}
                </p>
                <h3 className="text-gray-900">{name}</h3>
                <p className={`text-sm ${scoreColor}`}>{scoreLabel}</p>
              </div>
            </div>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Score Trend */}
          <div>
            <h4 className="text-sm text-gray-800 mb-2 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-violet-500" /> Xu hướng điểm số
            </h4>
            <div className="flex items-end gap-3 h-16">
              {data.historicalScores.map((hs, i) => {
                const isLast = i === data.historicalScores.length - 1;
                const barH = (hs.score / 100) * 100;
                const color = hs.score >= 80 ? "bg-green-400" : hs.score >= 60 ? "bg-blue-400" : hs.score >= 40 ? "bg-amber-400" : "bg-red-400";
                return (
                  <div key={hs.date} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-gray-500">{hs.score}</span>
                    <div className="w-full h-16 bg-gray-100 rounded relative overflow-hidden">
                      <div
                        className={`absolute bottom-0 w-full ${color} rounded ${isLast ? "opacity-100" : "opacity-60"}`}
                        style={{ height: `${barH}%` }}
                      />
                    </div>
                    <span className="text-[9px] text-gray-400">{hs.date}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Breakdown */}
          <div>
            <h4 className="text-sm text-gray-800 mb-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-violet-500" /> Phân tích chi tiết
            </h4>
            <div className="space-y-2">
              {data.factors.map((factor) => (
                <FactorBar key={factor.label} factor={factor} />
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-gradient-to-r from-violet-50 to-blue-50 rounded-xl border border-violet-100 p-4">
            <h4 className="text-sm text-violet-900 mb-2 flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-violet-600" /> AI Gợi ý hành động
            </h4>
            <ul className="space-y-1.5">
              {data.recommendations.map((rec) => (
                <li key={rec} className="text-sm text-violet-800 flex items-start gap-2">
                  <span className="mt-1 w-1.5 h-1.5 bg-violet-400 rounded-full flex-shrink-0" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>

          {/* Footer info */}
          <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
            <Bot className="w-3 h-3" />
            Cập nhật lần cuối: {data.lastUpdated} · Mô hình AI v2.1 · Dữ liệu mock
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trigger Button — dùng inline trong các trang khác
 * ============================================================ */
export function AIScoreTrigger({
  score,
  name,
  category,
  size = "sm",
}: {
  score: number;
  name: string;
  category: ScoreCategory;
  size?: "sm" | "md";
}) {
  const [showModal, setShowModal] = useState(false);
  const scoreColor =
    score >= 80 ? "text-green-600 bg-green-50 border-green-200" : score >= 60 ? "text-blue-600 bg-blue-50 border-blue-200" : score >= 40 ? "text-amber-600 bg-amber-50 border-amber-200" : "text-red-600 bg-red-50 border-red-200";

  return (
    <>
      <button
        type="button"
        onClick={() => setShowModal(true)}
        className={`inline-flex items-center gap-1 rounded-lg border transition-colors hover:opacity-80 ${scoreColor} ${
          size === "md" ? "px-2.5 py-1.5 text-sm" : "px-2 py-1 text-xs"
        }`}
        title="Xem chi tiết AI Score"
      >
        <Bot className={size === "md" ? "w-4 h-4" : "w-3 h-3"} />
        {score}
        <Info className={`opacity-50 ${size === "md" ? "w-3.5 h-3.5" : "w-3 h-3"}`} />
      </button>
      {showModal && (
        <AIScoreModal
          score={score}
          name={name}
          category={category}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
