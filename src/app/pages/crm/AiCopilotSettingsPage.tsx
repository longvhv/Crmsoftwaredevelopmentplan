/**
 * AI Copilot Settings — Cấu hình Trợ lý AI
 * AI model configuration, prompt templates, guardrails,
 * usage analytics, cost tracking, persona management.
 */
import { useState, useMemo } from "react";
import {
  BrainCircuit,
  Sparkles,
  Bot,
  Settings,
  Zap,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingUp,
  BarChart3,
  Play,
  Pause,
  Edit3,
  Copy,
  Trash2,
  Plus,
  Eye,
  Lock,
  DollarSign,
  MessageSquare,
  Target,
  Gauge,
  ToggleLeft,
  ToggleRight,
  X,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
interface AIModel {
  id: string;
  name: string;
  provider: string;
  icon: string;
  version: string;
  capabilities: string[];
  costPer1kTokens: number;
  avgLatency: number;
  isActive: boolean;
  usageToday: number;
  costToday: number;
  accuracy: number;
}

interface AIPersona {
  id: string;
  name: string;
  role: string;
  description: string;
  model: string;
  temperature: number;
  maxTokens: number;
  systemPrompt: string;
  isActive: boolean;
  requestsToday: number;
  satisfactionScore: number;
}

interface Guardrail {
  id: string;
  name: string;
  description: string;
  category: "safety" | "privacy" | "quality" | "cost";
  isEnabled: boolean;
  triggeredToday: number;
  blockedToday: number;
}

interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  usageCount: number;
  avgRating: number;
  lastUpdated: string;
}

/* ============================================================
 * Mock Data
 * ============================================================ */
const MOCK_MODELS: AIModel[] = [
  { id: "mdl_01", name: "GPT-4o", provider: "OpenAI", icon: "🟢", version: "2024-11-20", capabilities: ["Text Gen", "Reasoning", "Vision", "Function Calling"], costPer1kTokens: 0.005, avgLatency: 850, isActive: true, usageToday: 45200, costToday: 226, accuracy: 94 },
  { id: "mdl_02", name: "GPT-4o-mini", provider: "OpenAI", icon: "🟢", version: "2024-07-18", capabilities: ["Text Gen", "Function Calling"], costPer1kTokens: 0.00015, avgLatency: 320, isActive: true, usageToday: 182000, costToday: 27.3, accuracy: 88 },
  { id: "mdl_03", name: "Claude 3.5 Sonnet", provider: "Anthropic", icon: "🟠", version: "2025-10-22", capabilities: ["Text Gen", "Reasoning", "Code", "Vision"], costPer1kTokens: 0.003, avgLatency: 920, isActive: true, usageToday: 28500, costToday: 85.5, accuracy: 96 },
  { id: "mdl_04", name: "Gemini 2.0 Flash", provider: "Google", icon: "🔵", version: "2025-02", capabilities: ["Text Gen", "Reasoning", "Vision", "Audio"], costPer1kTokens: 0.0001, avgLatency: 250, isActive: false, usageToday: 0, costToday: 0, accuracy: 85 },
  { id: "mdl_05", name: "Local LLM (Llama 3.3)", provider: "Self-hosted", icon: "🏠", version: "70B-Q4", capabilities: ["Text Gen", "PII-safe"], costPer1kTokens: 0, avgLatency: 1200, isActive: true, usageToday: 15800, costToday: 0, accuracy: 82 },
];

const MOCK_PERSONAS: AIPersona[] = [
  { id: "per_01", name: "Luna", role: "AI Sales Agent", description: "Agent bán hàng — tạo email, chấm điểm leads, đề xuất follow-up actions", model: "GPT-4o", temperature: 0.7, maxTokens: 2048, systemPrompt: "You are Luna, an expert AI sales assistant...", isActive: true, requestsToday: 5600, satisfactionScore: 92 },
  { id: "per_02", name: "Nova", role: "AI Support Agent", description: "Agent hỗ trợ — phân loại ticket, trả lời FAQ, tóm tắt cuộc gọi", model: "Claude 3.5 Sonnet", temperature: 0.3, maxTokens: 4096, systemPrompt: "You are Nova, a professional support agent...", isActive: true, requestsToday: 8200, satisfactionScore: 96 },
  { id: "per_03", name: "Aria", role: "AI Data Agent", description: "Agent dữ liệu — enrichment, segmentation, analytics, báo cáo tự động", model: "GPT-4o-mini", temperature: 0.1, maxTokens: 1024, systemPrompt: "You are Aria, a data analysis specialist...", isActive: true, requestsToday: 3400, satisfactionScore: 94 },
  { id: "per_04", name: "Sage", role: "AI Strategy Advisor", description: "Cố vấn chiến lược — revenue insights, competitive intelligence, forecast", model: "GPT-4o", temperature: 0.5, maxTokens: 4096, systemPrompt: "You are Sage, a strategic business advisor...", isActive: true, requestsToday: 1200, satisfactionScore: 89 },
  { id: "per_05", name: "Felix", role: "AI Code Assistant", description: "Trợ lý code — tạo custom reports, API scripts, automation workflows", model: "Claude 3.5 Sonnet", temperature: 0.2, maxTokens: 8192, systemPrompt: "You are Felix, a software development assistant...", isActive: false, requestsToday: 0, satisfactionScore: 91 },
];

const MOCK_GUARDRAILS: Guardrail[] = [
  { id: "gr_01", name: "PII Masking", description: "Tự động ẩn PII (email, CCCD, phone) trước khi gửi tới LLM", category: "privacy", isEnabled: true, triggeredToday: 2450, blockedToday: 0 },
  { id: "gr_02", name: "Toxicity Filter", description: "Lọc nội dung độc hại, thiên kiến, phân biệt đối xử", category: "safety", isEnabled: true, triggeredToday: 12, blockedToday: 3 },
  { id: "gr_03", name: "Hallucination Detection", description: "Phát hiện AI bịa thông tin — cross-check với CRM data", category: "quality", isEnabled: true, triggeredToday: 85, blockedToday: 28 },
  { id: "gr_04", name: "Cost Guard ($500/day)", description: "Tự động tắt expensive models khi chi phí vượt $500/ngày", category: "cost", isEnabled: true, triggeredToday: 0, blockedToday: 0 },
  { id: "gr_05", name: "Competitor Mention Block", description: "Ngăn AI đề cập tích cực về đối thủ trong email sales", category: "quality", isEnabled: true, triggeredToday: 18, blockedToday: 18 },
  { id: "gr_06", name: "Legal Disclaimer", description: "Tự động thêm disclaimer cho output liên quan pháp lý/tài chính", category: "safety", isEnabled: true, triggeredToday: 42, blockedToday: 0 },
  { id: "gr_07", name: "Data Residency Enforcement", description: "Chặn request ra ngoài region đã chọn cho khách hàng", category: "privacy", isEnabled: true, triggeredToday: 5, blockedToday: 5 },
  { id: "gr_08", name: "Rate Limiting per User", description: "Max 100 AI requests/user/giờ", category: "cost", isEnabled: true, triggeredToday: 8, blockedToday: 2 },
];

const MOCK_TEMPLATES: PromptTemplate[] = [
  { id: "pt_01", name: "Sales Email — Cold Outreach", category: "Sales", description: "Email giới thiệu sản phẩm cho lead mới", usageCount: 4200, avgRating: 4.6, lastUpdated: "2026-03-01" },
  { id: "pt_02", name: "Sales Email — Follow-up", category: "Sales", description: "Email follow-up sau demo/meeting", usageCount: 3800, avgRating: 4.7, lastUpdated: "2026-02-28" },
  { id: "pt_03", name: "Lead Score Analysis", category: "Analytics", description: "Chấm điểm lead dựa trên firmographic + behavioral data", usageCount: 5600, avgRating: 4.8, lastUpdated: "2026-03-02" },
  { id: "pt_04", name: "Meeting Summary", category: "Productivity", description: "Tóm tắt cuộc họp từ transcript", usageCount: 2100, avgRating: 4.5, lastUpdated: "2026-02-25" },
  { id: "pt_05", name: "Ticket Auto-Response", category: "Support", description: "Phản hồi tự động ticket hỗ trợ dựa trên knowledge base", usageCount: 8200, avgRating: 4.4, lastUpdated: "2026-03-01" },
  { id: "pt_06", name: "Competitive Battlecard", category: "Strategy", description: "Tạo battlecard so sánh với đối thủ", usageCount: 890, avgRating: 4.3, lastUpdated: "2026-02-20" },
];

const CATEGORY_CFG: Record<string, { label: string; color: string }> = {
  safety: { label: "An toàn", color: "text-red-600" },
  privacy: { label: "Quyền riêng tư", color: "text-blue-600" },
  quality: { label: "Chất lượng", color: "text-amber-600" },
  cost: { label: "Chi phí", color: "text-green-600" },
};

type Tab = "models" | "personas" | "guardrails" | "templates";

/* ============================================================
 * Create AI Persona Modal
 * ============================================================ */
function CreatePersonaModal({ onClose, onCreated }: { onClose: () => void; onCreated: (p: AIPersona) => void }) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [description, setDescription] = useState("");
  const [model, setModel] = useState("GPT-4o");
  const [temperature, setTemperature] = useState(0.7);
  const [maxTokens, setMaxTokens] = useState(2048);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    if (!name.trim()) { toast.error("Vui lòng nhập tên persona"); return; }
    if (!role.trim()) { toast.error("Vui lòng nhập vai trò"); return; }
    setSaving(true);
    const newPersona: AIPersona = {
      id: `per_${Date.now()}`, name, role,
      description: description || `${name} — ${role}`,
      model, temperature, maxTokens,
      systemPrompt: systemPrompt || `You are ${name}, a ${role}...`,
      isActive: true, requestsToday: 0, satisfactionScore: 0,
    };
    onCreated(newPersona);
    toast.success(`Đã tạo AI Persona "${name}" (${role})`);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Tạo AI Persona mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Tên Persona *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Atlas"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Vai trò *</label>
              <input type="text" value={role} onChange={(e) => setRole(e.target.value)} placeholder="VD: AI Marketing Agent"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mô tả</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Mô tả chức năng..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Model</label>
              <select value={model} onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                {MOCK_MODELS.map((m) => <option key={m.id} value={m.name}>{m.icon} {m.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Temperature</label>
              <input type="number" value={temperature} onChange={(e) => setTemperature(Number(e.target.value))} min={0} max={2} step={0.1}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Max Tokens</label>
              <select value={maxTokens} onChange={(e) => setMaxTokens(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option value={1024}>1,024</option>
                <option value={2048}>2,048</option>
                <option value={4096}>4,096</option>
                <option value={8192}>8,192</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">System Prompt</label>
            <textarea value={systemPrompt} onChange={(e) => setSystemPrompt(e.target.value)} rows={3}
              placeholder="You are [Name], a [role] specialized in..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none font-mono text-xs" />
          </div>
          <div className="bg-violet-50 rounded-lg p-3 border border-violet-100">
            <p className="text-[10px] text-violet-700 flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI sẽ tự tối ưu system prompt dựa trên feedback và kết quả thực tế sau khi deploy.</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo Persona"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Component
 * ============================================================ */
export function AiCopilotSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("models");
  const [guardrails, setGuardrails] = useState(MOCK_GUARDRAILS);
  const [personas, setPersonas] = useState(MOCK_PERSONAS);
  const [showCreatePersona, setShowCreatePersona] = useState(false);

  const handleCreatePersona = (p: AIPersona) => {
    setPersonas((prev) => [...prev, p]);
  };

  const stats = useMemo(() => {
    const totalRequests = MOCK_MODELS.reduce((s, m) => s + m.usageToday, 0);
    const totalCost = MOCK_MODELS.reduce((s, m) => s + m.costToday, 0);
    const activeModels = MOCK_MODELS.filter((m) => m.isActive).length;
    const activePersonas = personas.filter((p) => p.isActive).length;
    const guardrailBlocks = guardrails.reduce((s, g) => s + g.blockedToday, 0);
    return { totalRequests, totalCost, activeModels, activePersonas, guardrailBlocks };
  }, [guardrails, personas]);

  const fmtK = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n));

  const toggleGuardrail = (id: string) => {
    setGuardrails((prev) => prev.map((g) => g.id === id ? { ...g, isEnabled: !g.isEnabled } : g));
    toast.success("Đã cập nhật guardrail");
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: "models", label: "AI Models" },
    { key: "personas", label: "Personas" },
    { key: "guardrails", label: "Guardrails" },
    { key: "templates", label: "Prompts" },
  ];

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <BrainCircuit className="w-6 h-6 text-violet-600" /> AI Copilot Settings
          </h1>
          <p className="text-gray-500 mt-0.5">Cấu hình AI — models, personas, guardrails, prompt templates, chi phí</p>
        </div>
        <button type="button" onClick={() => setShowCreatePersona(true)}
          className="flex items-center gap-1 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 self-start">
          <Plus className="w-4 h-4" /> Tạo Persona
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-2.5 text-center">
          <p className="text-lg text-violet-600">{fmtK(stats.totalRequests)}</p>
          <p className="text-[9px] text-violet-700">AI Requests hôm nay</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">${stats.totalCost.toFixed(0)}</p>
          <p className="text-[9px] text-green-700">Chi phí hôm nay</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{stats.activeModels}</p>
          <p className="text-[9px] text-blue-700">Models Active</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-2.5 text-center">
          <p className="text-lg text-amber-600">{stats.activePersonas}</p>
          <p className="text-[9px] text-amber-700">Personas Active</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-2.5 text-center">
          <p className="text-lg text-red-600">{stats.guardrailBlocks}</p>
          <p className="text-[9px] text-red-700">Guardrail Blocks</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
              activeTab === t.key ? "bg-violet-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* === Models Tab === */}
      {activeTab === "models" && (
        <div className="space-y-2">
          {MOCK_MODELS.map((m) => (
            <div key={m.id} className={`bg-white rounded-xl border p-4 ${m.isActive ? "border-gray-100" : "border-gray-200 opacity-60"}`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{m.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-900">{m.name}</span>
                    <span className="text-[8px] text-gray-400">{m.provider} • {m.version}</span>
                    <span className={`text-[7px] px-1.5 py-0.5 rounded border ${m.isActive ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-50 text-gray-400 border-gray-200"}`}>
                      {m.isActive ? "Active" : "Inactive"}
                    </span>
                    {m.costPer1kTokens === 0 && <span className="text-[7px] px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded border border-blue-200">Self-hosted</span>}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {m.capabilities.map((c) => <span key={c} className="text-[7px] px-1 py-0.5 bg-violet-50 text-violet-600 rounded">{c}</span>)}
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-[8px] text-gray-400 flex-wrap">
                    <span>💰 ${m.costPer1kTokens}/1K tokens</span>
                    <span>⚡ {m.avgLatency}ms avg</span>
                    <span>📊 {fmtK(m.usageToday)} req/today</span>
                    <span>💵 ${m.costToday.toFixed(1)} today</span>
                    <span>🎯 Accuracy: {m.accuracy}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === Personas Tab === */}
      {activeTab === "personas" && (
        <div className="space-y-2">
          {personas.map((p) => (
            <div key={p.id} className={`bg-white rounded-xl border p-4 ${p.isActive ? "border-gray-100" : "border-gray-200 opacity-60"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${p.isActive ? "bg-violet-100" : "bg-gray-100"}`}>
                  <Bot className={`w-5 h-5 ${p.isActive ? "text-violet-600" : "text-gray-400"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-900">{p.name}</span>
                    <span className="text-[8px] text-gray-400">{p.role}</span>
                    <span className={`text-[7px] px-1.5 py-0.5 rounded border ${p.isActive ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-50 text-gray-400 border-gray-200"}`}>
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-[9px] text-gray-500 mt-0.5">{p.description}</p>
                  <div className="flex items-center gap-4 mt-1.5 text-[8px] text-gray-400 flex-wrap">
                    <span>🧠 Model: {p.model}</span>
                    <span>🌡️ Temp: {p.temperature}</span>
                    <span>📝 Max: {p.maxTokens} tokens</span>
                    <span>📊 {fmtK(p.requestsToday)} req/today</span>
                    <span>😊 Satisfaction: {p.satisfactionScore}%</span>
                  </div>
                </div>
                <button type="button" onClick={() => toast.success(`Chỉnh sửa persona ${p.name}`)}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === Guardrails Tab === */}
      {activeTab === "guardrails" && (
        <div className="space-y-2">
          {guardrails.map((g) => {
            const catCfg = CATEGORY_CFG[g.category];
            return (
              <div key={g.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => toggleGuardrail(g.id)} className="flex-shrink-0">
                    {g.isEnabled ? (
                      <ToggleRight className="w-8 h-8 text-green-500" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-gray-300" />
                    )}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm text-gray-900">{g.name}</span>
                      <span className={`text-[7px] px-1.5 py-0.5 rounded bg-gray-50 border border-gray-200 ${catCfg.color}`}>{catCfg.label}</span>
                    </div>
                    <p className="text-[9px] text-gray-500 mt-0.5">{g.description}</p>
                    <div className="flex items-center gap-4 mt-1 text-[8px] text-gray-400">
                      <span>Triggered: {g.triggeredToday} lần hôm nay</span>
                      <span className={g.blockedToday > 0 ? "text-red-500" : ""}>Blocked: {g.blockedToday}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === Templates Tab === */}
      {activeTab === "templates" && (
        <div className="space-y-2">
          {MOCK_TEMPLATES.map((t) => (
            <div key={t.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-900">{t.name}</span>
                    <span className="text-[7px] px-1.5 py-0.5 bg-violet-50 text-violet-600 rounded border border-violet-200">{t.category}</span>
                    <div className="flex items-center gap-0.5 ml-auto">
                      <Sparkles className="w-3 h-3 text-amber-400" />
                      <span className="text-[9px] text-amber-600">{t.avgRating}</span>
                    </div>
                  </div>
                  <p className="text-[9px] text-gray-500 mt-0.5">{t.description}</p>
                  <div className="flex items-center gap-4 mt-1 text-[8px] text-gray-400">
                    <span>📊 {fmtK(t.usageCount)} lần sử dụng</span>
                    <span>📅 Cập nhật: {t.lastUpdated}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button type="button" onClick={() => toast.success(`Copy prompt "${t.name}"`)} className="p-1.5 text-gray-400 hover:text-gray-600"><Copy className="w-3.5 h-3.5" /></button>
                  <button type="button" onClick={() => toast.success(`Chỉnh sửa "${t.name}"`)} className="p-1.5 text-gray-400 hover:text-gray-600"><Edit3 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AI Meta-Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Self-Optimization Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <DollarSign className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Chi phí hôm nay <strong>$338</strong> ($500 budget). AI phát hiện <strong>62% requests</strong> dùng GPT-4o có thể chuyển sang <strong>GPT-4o-mini</strong> mà không giảm quality — tiết kiệm <strong>$180/ngày (~$5.4K/tháng)</strong>.</span>
          </p>
          <p className="flex items-start gap-2">
            <Shield className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <span>Hallucination Detection đã block <strong>28 responses sai</strong> hôm nay (rate: <strong>0.1%</strong>). Top cause: AI trích dẫn sai giá sản phẩm từ data cũ. Fix: <strong>update product embedding index</strong> — đã auto-scheduled.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>Persona <strong>Nova</strong> (Support) đạt <strong>96% satisfaction</strong> — cao nhất. Pattern: dùng <strong>Claude 3.5 Sonnet + temp 0.3</strong>. AI suggest: áp dụng cùng cấu hình cho persona <strong>Sage</strong> (hiện 89%) để cải thiện +5%.</span>
          </p>
        </div>
      </div>
      {showCreatePersona && <CreatePersonaModal onClose={() => setShowCreatePersona(false)} onCreated={handleCreatePersona} />}
    </div>
  );
}