/**
 * AI Training Dashboard — Monitor & Fine-tune AI Models
 * Model registry, training pipeline, accuracy metrics,
 * A/B model comparison, deployment status, cost tracking.
 */
import { useState, useMemo } from "react";
import {
  BrainCog,
  Activity,
  Sparkles,
  Bot,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  RefreshCw,
  Zap,
  Server,
  Database,
  Shield,
  BarChart3,
  Target,
  Eye,
  Download,
  Cpu,
  HardDrive,
  Gauge,
  CircleDot,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
type ModelStatus = "production" | "staging" | "training" | "evaluating" | "archived" | "failed";
type ModelType = "classification" | "regression" | "nlp" | "recommendation" | "anomaly-detection";

interface AIModel {
  id: string;
  name: string;
  version: string;
  type: ModelType;
  status: ModelStatus;
  accuracy: number;
  prevAccuracy: number;
  f1Score: number;
  latencyMs: number;
  requestsPerDay: number;
  costPerDay: number;
  lastTrained: string;
  trainingDuration: string;
  datasetSize: string;
  framework: string;
  description: string;
  features: string[];
  metrics: { label: string; value: string; trend: "up" | "down" | "stable" }[];
}

interface TrainingRun {
  id: string;
  modelName: string;
  status: "running" | "completed" | "failed" | "queued";
  progress: number;
  epoch: number;
  totalEpochs: number;
  loss: number;
  startedAt: string;
  estimatedEnd: string;
  gpu: string;
}

/* ============================================================
 * Constants
 * ============================================================ */
const STATUS_CFG: Record<ModelStatus, { label: string; color: string; bg: string }> = {
  production: { label: "Production", color: "text-green-600", bg: "bg-green-50 border-green-200" },
  staging: { label: "Staging", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  training: { label: "Đang train", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  evaluating: { label: "Đang đánh giá", color: "text-violet-600", bg: "bg-violet-50 border-violet-200" },
  archived: { label: "Lưu trữ", color: "text-gray-400", bg: "bg-gray-50 border-gray-200" },
  failed: { label: "Lỗi", color: "text-red-600", bg: "bg-red-50 border-red-200" },
};

const TYPE_CFG: Record<ModelType, { label: string; color: string }> = {
  classification: { label: "Phân loại", color: "text-blue-600" },
  regression: { label: "Hồi quy", color: "text-emerald-600" },
  nlp: { label: "NLP", color: "text-violet-600" },
  recommendation: { label: "Gợi ý", color: "text-amber-600" },
  "anomaly-detection": { label: "Anomaly", color: "text-red-600" },
};

const fmtMoney = (n: number) => {
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (n >= 1e3) return `${(n / 1e3).toFixed(0)}K`;
  return n.toLocaleString("vi-VN");
};

/* ============================================================
 * Mock Data
 * ============================================================ */
const MOCK_MODELS: AIModel[] = [
  {
    id: "mdl_001", name: "Lead Scoring Model", version: "v3.2.1", type: "classification",
    status: "production", accuracy: 92.4, prevAccuracy: 89.8, f1Score: 0.91, latencyMs: 12,
    requestsPerDay: 45000, costPerDay: 850000, lastTrained: "2026-02-28", trainingDuration: "4h 32m",
    datasetSize: "250K leads", framework: "XGBoost + LightGBM",
    description: "Mô hình chấm điểm lead dựa trên hành vi, firmographics, engagement history. Ensemble model.",
    features: ["Firmographic data", "Behavioral signals", "Email engagement", "Website activity", "Social signals"],
    metrics: [
      { label: "Precision", value: "93.1%", trend: "up" },
      { label: "Recall", value: "89.7%", trend: "up" },
      { label: "AUC-ROC", value: "0.956", trend: "up" },
      { label: "MQL→SQL Rate", value: "+34%", trend: "up" },
    ],
  },
  {
    id: "mdl_002", name: "Deal Win Predictor", version: "v2.1.0", type: "classification",
    status: "production", accuracy: 87.6, prevAccuracy: 85.2, f1Score: 0.86, latencyMs: 18,
    requestsPerDay: 12000, costPerDay: 420000, lastTrained: "2026-02-25", trainingDuration: "6h 15m",
    datasetSize: "85K deals", framework: "Random Forest + Neural Net",
    description: "Dự đoán xác suất thắng deal dựa trên lịch sử pipeline, competitor, stakeholders, engagement.",
    features: ["Deal size", "Stage duration", "Competitor presence", "Stakeholder count", "Activity frequency"],
    metrics: [
      { label: "Win prediction", value: "87.6%", trend: "up" },
      { label: "Loss prediction", value: "91.2%", trend: "stable" },
      { label: "Revenue impact", value: "+18%", trend: "up" },
      { label: "False positive", value: "8.3%", trend: "down" },
    ],
  },
  {
    id: "mdl_003", name: "Email Content Generator", version: "v1.4.0", type: "nlp",
    status: "production", accuracy: 88.9, prevAccuracy: 84.1, f1Score: 0.87, latencyMs: 320,
    requestsPerDay: 8500, costPerDay: 1200000, lastTrained: "2026-03-01", trainingDuration: "12h 40m",
    datasetSize: "500K emails", framework: "GPT-4o fine-tuned",
    description: "Tạo email sales cá nhân hóa. Fine-tuned trên 500K high-performing sales emails. Brand voice trained.",
    features: ["Personalization", "Tone matching", "CTA optimization", "Subject line", "Follow-up timing"],
    metrics: [
      { label: "Open rate lift", value: "+28%", trend: "up" },
      { label: "Reply rate lift", value: "+42%", trend: "up" },
      { label: "BLEU Score", value: "0.82", trend: "up" },
      { label: "Human preference", value: "76%", trend: "stable" },
    ],
  },
  {
    id: "mdl_004", name: "Churn Prediction", version: "v2.0.0-beta", type: "classification",
    status: "staging", accuracy: 85.3, prevAccuracy: 0, f1Score: 0.83, latencyMs: 25,
    requestsPerDay: 0, costPerDay: 0, lastTrained: "2026-03-02", trainingDuration: "3h 10m",
    datasetSize: "120K customers", framework: "CatBoost + LSTM",
    description: "Dự đoán khách hàng có nguy cơ churn trong 30/60/90 ngày. Hybrid model: CatBoost cho tabular + LSTM cho time-series.",
    features: ["Usage patterns", "Support tickets", "Payment behavior", "Feature adoption", "NPS scores"],
    metrics: [
      { label: "30-day recall", value: "89.5%", trend: "up" },
      { label: "60-day recall", value: "82.1%", trend: "stable" },
      { label: "False alarm", value: "12.4%", trend: "down" },
      { label: "Estimated save", value: "2.1B/năm", trend: "up" },
    ],
  },
  {
    id: "mdl_005", name: "Meeting Summarizer", version: "v1.2.0", type: "nlp",
    status: "production", accuracy: 91.2, prevAccuracy: 88.5, f1Score: 0.90, latencyMs: 1500,
    requestsPerDay: 350, costPerDay: 280000, lastTrained: "2026-02-20", trainingDuration: "8h 55m",
    datasetSize: "15K meetings", framework: "Whisper + GPT-4o",
    description: "Transcribe meeting, tạo summary, extract action items, sentiment analysis per speaker.",
    features: ["Transcription", "Summary generation", "Action items", "Sentiment", "Speaker diarization"],
    metrics: [
      { label: "WER", value: "4.2%", trend: "down" },
      { label: "Summary quality", value: "4.6/5", trend: "up" },
      { label: "Action accuracy", value: "93%", trend: "up" },
      { label: "Time saved", value: "2h/user/day", trend: "stable" },
    ],
  },
  {
    id: "mdl_006", name: "Product Recommender", version: "v1.0.0", type: "recommendation",
    status: "training", accuracy: 0, prevAccuracy: 0, f1Score: 0, latencyMs: 0,
    requestsPerDay: 0, costPerDay: 0, lastTrained: "", trainingDuration: "~5h (est)",
    datasetSize: "200K transactions", framework: "Collaborative Filtering + Deep FM",
    description: "Cross-sell và upsell recommendation. Dựa trên purchase history, similar customers, product affinity.",
    features: ["Purchase history", "Customer similarity", "Product affinity", "Seasonal patterns", "Price sensitivity"],
    metrics: [],
  },
  {
    id: "mdl_007", name: "Anomaly Detection — Revenue", version: "v1.1.0", type: "anomaly-detection",
    status: "production", accuracy: 94.8, prevAccuracy: 93.1, f1Score: 0.93, latencyMs: 45,
    requestsPerDay: 2400, costPerDay: 180000, lastTrained: "2026-02-18", trainingDuration: "2h 20m",
    datasetSize: "1.2M transactions", framework: "Isolation Forest + AutoEncoder",
    description: "Phát hiện bất thường trong revenue data: fraud, billing errors, unusual patterns.",
    features: ["Transaction amount", "Frequency analysis", "Geo-location", "Time patterns", "User behavior"],
    metrics: [
      { label: "Detection rate", value: "94.8%", trend: "up" },
      { label: "False positive", value: "3.2%", trend: "down" },
      { label: "Saved from fraud", value: "890Mđ/năm", trend: "up" },
      { label: "MTTR", value: "< 5 min", trend: "down" },
    ],
  },
];

const MOCK_RUNS: TrainingRun[] = [
  { id: "run_001", modelName: "Product Recommender v1.0.0", status: "running", progress: 62, epoch: 31, totalEpochs: 50, loss: 0.342, startedAt: "2026-03-03 08:15", estimatedEnd: "2026-03-03 13:30", gpu: "A100 40GB × 2" },
  { id: "run_002", modelName: "Churn Prediction v2.0.0-beta (retrain)", status: "queued", progress: 0, epoch: 0, totalEpochs: 30, loss: 0, startedAt: "—", estimatedEnd: "~3h", gpu: "A100 40GB × 1" },
  { id: "run_003", modelName: "Lead Scoring v3.3.0 (experiment)", status: "completed", progress: 100, epoch: 100, totalEpochs: 100, loss: 0.089, startedAt: "2026-03-02 22:00", estimatedEnd: "2026-03-03 02:30", gpu: "V100 32GB × 4" },
];

type Tab = "models" | "training" | "costs";

/* ============================================================
 * Main Page
 * ============================================================ */
export function AiTrainingDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("models");
  const [expandedId, setExpandedId] = useState<string | null>("mdl_001");
  const [statusFilter, setStatusFilter] = useState<ModelStatus | "all">("all");

  const filtered = useMemo(() => {
    if (statusFilter === "all") return MOCK_MODELS;
    return MOCK_MODELS.filter((m) => m.status === statusFilter);
  }, [statusFilter]);

  const stats = useMemo(() => {
    const prod = MOCK_MODELS.filter((m) => m.status === "production");
    const avgAccuracy = prod.reduce((s, m) => s + m.accuracy, 0) / (prod.length || 1);
    const totalRequests = prod.reduce((s, m) => s + m.requestsPerDay, 0);
    const totalCost = MOCK_MODELS.reduce((s, m) => s + m.costPerDay, 0);
    return { totalModels: MOCK_MODELS.length, inProduction: prod.length, avgAccuracy, totalRequests, totalCost };
  }, []);

  const tabs: { key: Tab; label: string }[] = [
    { key: "models", label: "Model Registry" },
    { key: "training", label: "Training Pipeline" },
    { key: "costs", label: "Chi phí & Tài nguyên" },
  ];

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <BrainCog className="w-6 h-6 text-fuchsia-600" /> AI Training Dashboard
        </h1>
        <p className="text-gray-500 mt-0.5">Monitor, fine-tune & deploy AI models — accuracy tracking, cost optimization, training pipeline</p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <div className="bg-white rounded-xl border border-gray-100 p-2.5 text-center">
          <p className="text-lg text-gray-900">{stats.totalModels}</p>
          <p className="text-[9px] text-gray-400">AI Models</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{stats.inProduction}</p>
          <p className="text-[9px] text-green-700">In Production</p>
        </div>
        <div className="bg-fuchsia-50 rounded-xl border border-fuchsia-200 p-2.5 text-center">
          <p className="text-lg text-fuchsia-600">{stats.avgAccuracy.toFixed(1)}%</p>
          <p className="text-[9px] text-fuchsia-700">TB Accuracy</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{fmtMoney(stats.totalRequests)}</p>
          <p className="text-[9px] text-blue-700">Requests/ngày</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-2.5 text-center">
          <p className="text-lg text-amber-600">{fmtMoney(stats.totalCost)}đ</p>
          <p className="text-[9px] text-amber-700">Chi phí/ngày</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
              activeTab === t.key ? "bg-fuchsia-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* === Models Tab === */}
      {activeTab === "models" && (
        <>
          <div className="flex items-center gap-2">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as ModelStatus | "all")}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
              <option value="all">Tất cả trạng thái</option>
              {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            {filtered.map((model) => {
              const stCfg = STATUS_CFG[model.status];
              const tpCfg = TYPE_CFG[model.type];
              const isExpanded = expandedId === model.id;
              const accChange = model.prevAccuracy > 0 ? model.accuracy - model.prevAccuracy : 0;

              return (
                <div key={model.id} className={`bg-white rounded-xl border overflow-hidden ${
                  model.status === "production" ? "border-green-200" :
                  model.status === "failed" ? "border-red-200" : "border-gray-100"
                }`}>
                  <button type="button" onClick={() => setExpandedId(isExpanded ? null : model.id)}
                    className="w-full p-4 text-left">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        model.status === "production" ? "bg-green-50" :
                        model.status === "training" ? "bg-amber-50" : "bg-gray-50"
                      }`}>
                        <BrainCog className={`w-5 h-5 ${
                          model.status === "production" ? "text-green-600" :
                          model.status === "training" ? "text-amber-600" : "text-gray-500"
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm text-gray-900">{model.name}</span>
                          <span className="text-[8px] text-gray-400">{model.version}</span>
                          <span className={`text-[7px] px-1.5 py-0.5 rounded border ${stCfg.bg} ${stCfg.color}`}>{stCfg.label}</span>
                          <span className={`text-[7px] px-1.5 py-0.5 bg-gray-100 rounded ${tpCfg.color}`}>{tpCfg.label}</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5 truncate">{model.description}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 flex-shrink-0">
                        {model.accuracy > 0 && (
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-gray-900">{model.accuracy}%</span>
                            {accChange !== 0 && (
                              <span className={`text-[8px] flex items-center ${accChange > 0 ? "text-green-600" : "text-red-600"}`}>
                                {accChange > 0 ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                                {Math.abs(accChange).toFixed(1)}%
                              </span>
                            )}
                          </div>
                        )}
                        {model.latencyMs > 0 && <span className="text-[8px] text-gray-400">{model.latencyMs}ms latency</span>}
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
                      {/* Metrics grid */}
                      {model.metrics.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {model.metrics.map((m) => (
                            <div key={m.label} className="p-2 bg-gray-50 rounded-lg text-center">
                              <p className="text-xs text-gray-900 flex items-center justify-center gap-1">
                                {m.value}
                                {m.trend === "up" && <ArrowUpRight className="w-3 h-3 text-green-500" />}
                                {m.trend === "down" && <ArrowDownRight className="w-3 h-3 text-red-500" />}
                              </p>
                              <p className="text-[8px] text-gray-400">{m.label}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Details */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[9px]">
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <p className="text-gray-400">Framework</p>
                          <p className="text-gray-700">{model.framework}</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <p className="text-gray-400">Dataset</p>
                          <p className="text-gray-700">{model.datasetSize}</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <p className="text-gray-400">Thời gian train</p>
                          <p className="text-gray-700">{model.trainingDuration}</p>
                        </div>
                        <div className="p-2 bg-gray-50 rounded-lg">
                          <p className="text-gray-400">Requests/ngày</p>
                          <p className="text-gray-700">{model.requestsPerDay > 0 ? fmtMoney(model.requestsPerDay) : "—"}</p>
                        </div>
                      </div>

                      {/* Features */}
                      <div>
                        <p className="text-[9px] text-gray-400 mb-1">Input Features:</p>
                        <div className="flex flex-wrap gap-1">
                          {model.features.map((f) => (
                            <span key={f} className="text-[8px] px-1.5 py-0.5 bg-fuchsia-50 text-fuchsia-700 rounded border border-fuchsia-200">{f}</span>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-wrap">
                        {model.status === "staging" && (
                          <button type="button" onClick={() => toast.success(`Deploy ${model.name} lên production!`)}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] bg-green-600 text-white rounded-lg hover:bg-green-700">
                            <Play className="w-3 h-3" /> Deploy Production
                          </button>
                        )}
                        {model.status === "production" && (
                          <button type="button" onClick={() => toast.success(`Bắt đầu retrain ${model.name}`)}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-fuchsia-600 hover:bg-fuchsia-50 rounded-lg border border-fuchsia-200">
                            <RefreshCw className="w-3 h-3" /> Retrain
                          </button>
                        )}
                        <span className="text-[8px] text-gray-400 ml-auto">
                          Trained: {model.lastTrained || "—"} • Cost: {model.costPerDay > 0 ? `${fmtMoney(model.costPerDay)}đ/ngày` : "—"}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* === Training Pipeline === */}
      {activeTab === "training" && (
        <div className="space-y-3">
          {MOCK_RUNS.map((run) => {
            const statusMap: Record<string, { label: string; color: string; bg: string }> = {
              running: { label: "Đang chạy", color: "text-green-600", bg: "bg-green-50" },
              completed: { label: "Hoàn thành", color: "text-blue-600", bg: "bg-blue-50" },
              failed: { label: "Lỗi", color: "text-red-600", bg: "bg-red-50" },
              queued: { label: "Chờ", color: "text-gray-500", bg: "bg-gray-50" },
            };
            const st = statusMap[run.status];
            return (
              <div key={run.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-lg ${st.bg} flex items-center justify-center`}>
                    {run.status === "running" ? <Activity className={`w-4 h-4 ${st.color} animate-pulse`} /> :
                     run.status === "queued" ? <Clock className={`w-4 h-4 ${st.color}`} /> :
                     <CheckCircle2 className={`w-4 h-4 ${st.color}`} />}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-gray-900">{run.modelName}</span>
                      <span className={`text-[7px] px-1.5 py-0.5 rounded ${st.bg} ${st.color} border`}>{st.label}</span>
                    </div>
                    <p className="text-[9px] text-gray-400">
                      GPU: {run.gpu} • Bắt đầu: {run.startedAt} • Dự kiến: {run.estimatedEnd}
                    </p>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-1 flex items-center justify-between">
                  <span className="text-[9px] text-gray-400">Epoch {run.epoch}/{run.totalEpochs}</span>
                  <span className="text-[9px] text-gray-500">{run.progress}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${
                    run.status === "completed" ? "bg-blue-400" :
                    run.status === "running" ? "bg-green-400" : "bg-gray-300"
                  }`} style={{ width: `${run.progress}%` }} />
                </div>
                {run.loss > 0 && (
                  <p className="text-[8px] text-gray-400 mt-1">Loss: {run.loss.toFixed(4)}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* === Costs Tab === */}
      {activeTab === "costs" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm text-gray-900 mb-3">Chi phí AI theo Model (VNĐ/ngày)</h3>
            {MOCK_MODELS.filter((m) => m.costPerDay > 0).sort((a, b) => b.costPerDay - a.costPerDay).map((model) => {
              const maxCost = Math.max(...MOCK_MODELS.map((m) => m.costPerDay));
              return (
                <div key={model.id} className="mb-2">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[10px] text-gray-600">{model.name}</span>
                    <span className="text-[10px] text-gray-900">{fmtMoney(model.costPerDay)}đ/ngày ({fmtMoney(model.costPerDay * 30)}đ/tháng)</span>
                  </div>
                  <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-fuchsia-400 to-violet-500"
                      style={{ width: `${(model.costPerDay / maxCost) * 100}%` }} />
                  </div>
                  <p className="text-[8px] text-gray-400 mt-0.5">
                    {fmtMoney(model.requestsPerDay)} req/ngày • {model.latencyMs}ms avg • Cost/req: {(model.costPerDay / (model.requestsPerDay || 1)).toFixed(0)}đ
                  </p>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm text-gray-900 mb-2">Tổng quan Tài nguyên</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <Cpu className="w-5 h-5 text-fuchsia-500 mx-auto mb-1" />
                <p className="text-xs text-gray-900">4 × A100 40GB</p>
                <p className="text-[8px] text-gray-400">GPU Cluster</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <HardDrive className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <p className="text-xs text-gray-900">2.4 TB</p>
                <p className="text-[8px] text-gray-400">Training Data</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <Server className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                <p className="text-xs text-gray-900">99.97%</p>
                <p className="text-[8px] text-gray-400">Model Uptime</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <Gauge className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                <p className="text-xs text-gray-900">{fmtMoney(stats.totalCost * 30)}đ</p>
                <p className="text-[8px] text-gray-400">Cost/tháng</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-fuchsia-50 to-violet-50 rounded-xl border border-fuchsia-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-fuchsia-600" />
          <h4 className="text-sm text-fuchsia-900">AI Model Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-fuchsia-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span><strong>Lead Scoring v3.2.1</strong> accuracy tăng <strong>+2.6%</strong> sau retrain. MQL→SQL rate cải thiện <strong>+34%</strong>. ROI ước tính: <strong>12x</strong> chi phí training.</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span><strong>Email Content Generator</strong> chiếm <strong>41% tổng chi phí AI</strong> ({fmtMoney(1200000)}đ/ngày). Đề xuất: fine-tune model nhỏ hơn (GPT-4o-mini) cho drafts, chỉ dùng GPT-4o cho final version — tiết kiệm <strong>~45%</strong>.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span><strong>Churn Prediction v2.0.0-beta</strong> đang staging — recall 89.5%. Auto-deploy khi accuracy ≥86% trên production data. Estimated save: <strong>2.1B VNĐ/năm</strong> nếu rescue 40% at-risk customers.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
