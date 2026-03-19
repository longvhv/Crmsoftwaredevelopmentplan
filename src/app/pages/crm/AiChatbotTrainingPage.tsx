/**
 * AI Chatbot Training
 * Huấn luyện chatbot AI: quản lý intents, training data,
 * knowledge base articles, test conversations, performance analytics.
 */
import { useState, useMemo, useRef } from "react";
import {
  Bot,
  Plus,
  Search,
  Pencil,
  Trash2,
  Brain,
  MessageSquare,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Upload,
  FileText,
  Globe,
  Zap,
  Send,
  User,
  RefreshCw,
  TrendingUp,
  BarChart3,
  BookOpen,
  Target,
  X,
  ChevronDown,
  ChevronRight,
  Play,
  Settings,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
interface Intent {
  id: string;
  name: string;
  category: string;
  description: string;
  trainingPhrases: string[];
  responses: string[];
  confidence: number; // 0-100
  hitCount: number;
  lastTriggered: string | null;
  status: "active" | "draft" | "disabled";
}

interface KnowledgeSource {
  id: string;
  name: string;
  type: "url" | "document" | "faq" | "api";
  source: string;
  articlesCount: number;
  lastSynced: string;
  status: "synced" | "syncing" | "error";
}

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  content: string;
  confidence?: number;
  matchedIntent?: string;
}

type Tab = "intents" | "knowledge" | "playground" | "analytics";

/* ============================================================
 * Mock Data
 * ============================================================ */
const MOCK_INTENTS: Intent[] = [
  {
    id: "int_001", name: "Hỏi giá sản phẩm", category: "Sales",
    description: "Khách hỏi về giá, bảng giá, chi phí các gói dịch vụ",
    trainingPhrases: ["giá bao nhiêu", "bảng giá", "chi phí gói enterprise", "gói nào rẻ nhất", "so sánh giá", "giá ưu đãi", "discount cho startup"],
    responses: ["Cảm ơn bạn quan tâm! AI-CRM có 4 gói: Starter (2tr/tháng), Professional (5tr), Enterprise (12tr), Custom. Xem chi tiết tại: {{pricing_link}}"],
    confidence: 94, hitCount: 1234, lastTriggered: "2026-03-03T09:45:00Z", status: "active",
  },
  {
    id: "int_002", name: "Đặt lịch demo", category: "Sales",
    description: "Khách muốn xem demo sản phẩm, đặt lịch tư vấn",
    trainingPhrases: ["đặt lịch demo", "muốn xem demo", "book demo", "tư vấn trực tiếp", "gặp sales", "lịch tư vấn"],
    responses: ["Tuyệt vời! Để đặt lịch demo 1-1, vui lòng chọn thời gian tại: {{booking_link}}. Hoặc để lại SĐT, team sẽ liên hệ trong 30 phút!"],
    confidence: 91, hitCount: 876, lastTriggered: "2026-03-03T10:12:00Z", status: "active",
  },
  {
    id: "int_003", name: "Hỗ trợ kỹ thuật", category: "Support",
    description: "Khách gặp lỗi, cần hỗ trợ kỹ thuật, troubleshooting",
    trainingPhrases: ["bị lỗi", "không hoạt động", "lỗi đăng nhập", "bug", "trục trặc", "cần hỗ trợ", "không thể import", "lỗi API"],
    responses: ["Mình hiểu sự bất tiện! Để hỗ trợ nhanh nhất:\n1️⃣ Mô tả chi tiết lỗi\n2️⃣ Gửi screenshot nếu có\n3️⃣ Cho mình biết trình duyệt bạn dùng\n\nHoặc tạo ticket tại: {{support_link}}"],
    confidence: 88, hitCount: 2341, lastTriggered: "2026-03-03T10:05:00Z", status: "active",
  },
  {
    id: "int_004", name: "Tính năng mới", category: "Product",
    description: "Khách hỏi về roadmap, tính năng sắp ra mắt",
    trainingPhrases: ["tính năng mới", "roadmap", "khi nào có", "cập nhật mới", "sắp ra mắt", "feature request"],
    responses: ["Cảm ơn bạn quan tâm! Một số tính năng sắp ra mắt:\n🚀 AI Sales Coach (Q2/2026)\n📊 Advanced Analytics (Q2/2026)\n🤖 Autonomous AI SDR (Q3/2026)\nXem roadmap đầy đủ: {{roadmap_link}}"],
    confidence: 85, hitCount: 543, lastTriggered: "2026-03-02T16:30:00Z", status: "active",
  },
  {
    id: "int_005", name: "Huỷ subscription", category: "Billing",
    description: "Khách muốn huỷ đăng ký, downgrade, hoàn tiền",
    trainingPhrases: ["huỷ tài khoản", "huỷ subscription", "cancel", "dừng dịch vụ", "hoàn tiền", "refund", "downgrade"],
    responses: ["Mình rất tiếc khi nghe điều này 😢. Trước khi huỷ, bạn có thể cho mình biết lý do không? Mình sẽ cố gắng giúp:\n• Chuyển sang gói phù hợp hơn\n• Hỗ trợ sử dụng hiệu quả\n• Ưu đãi đặc biệt\n\nNếu vẫn muốn huỷ, mình sẽ chuyển cho CS Manager hỗ trợ."],
    confidence: 92, hitCount: 156, lastTriggered: "2026-03-01T11:00:00Z", status: "active",
  },
  {
    id: "int_006", name: "Chào hỏi", category: "General",
    description: "Lời chào, bắt đầu cuộc trò chuyện",
    trainingPhrases: ["xin chào", "hello", "hi", "chào bạn", "alo", "hey", "chào buổi sáng"],
    responses: ["Xin chào! 👋 Mình là AI Assistant của AI-CRM. Mình có thể giúp bạn:\n• Tìm hiểu sản phẩm & giá\n• Đặt lịch demo\n• Hỗ trợ kỹ thuật\n• Quản lý tài khoản\n\nBạn cần hỗ trợ gì hôm nay?"],
    confidence: 98, hitCount: 5600, lastTriggered: "2026-03-03T10:15:00Z", status: "active",
  },
  {
    id: "int_007", name: "So sánh đối thủ", category: "Sales",
    description: "Khách so sánh với Salesforce, HubSpot, Zoho...",
    trainingPhrases: ["so sánh salesforce", "khác gì hubspot", "vs zoho", "tại sao chọn AI-CRM", "ưu điểm", "so sánh"],
    responses: ["Đây là so sánh nhanh:\n\n| | AI-CRM | Salesforce | HubSpot |\n|---|---|---|---|\n| AI-First | ✅ Native | ❌ Add-on | ⚠️ Limited |\n| Tiếng Việt | ✅ Native | ❌ | ❌ |\n| Giá | Từ 2tr | Từ $25/user | Từ $50/user |\n| AI Agents | ✅ | ❌ | ❌ |\n\nXem chi tiết: {{comparison_link}}"],
    confidence: 87, hitCount: 432, lastTriggered: "2026-03-02T14:00:00Z", status: "active",
  },
  {
    id: "int_008", name: "Tích hợp API", category: "Technical",
    description: "Hỏi về API, tích hợp, webhooks, SDK",
    trainingPhrases: ["API documentation", "tích hợp", "webhook", "REST API", "SDK", "integration", "kết nối", "zapier"],
    responses: ["AI-CRM cung cấp:\n📘 REST API v2 — Full CRUD cho tất cả entities\n🔗 Webhooks — Real-time events\n🔌 SDK — JavaScript, Python, PHP\n⚡ Zapier — 5000+ app connections\n\nDocs: {{api_docs_link}}\nAPI Explorer: {{api_explorer_link}}"],
    confidence: 90, hitCount: 678, lastTriggered: "2026-03-03T08:30:00Z", status: "active",
  },
];

const MOCK_KNOWLEDGE: KnowledgeSource[] = [
  { id: "ks_001", name: "Help Center Articles", type: "url", source: "https://help.ai-crm.vn", articlesCount: 245, lastSynced: "2026-03-03T06:00:00Z", status: "synced" },
  { id: "ks_002", name: "Product Documentation", type: "url", source: "https://docs.ai-crm.vn", articlesCount: 180, lastSynced: "2026-03-03T06:00:00Z", status: "synced" },
  { id: "ks_003", name: "FAQ Database", type: "faq", source: "Internal FAQ (120 Q&A pairs)", articlesCount: 120, lastSynced: "2026-03-02T22:00:00Z", status: "synced" },
  { id: "ks_004", name: "Sales Playbook PDF", type: "document", source: "sales_playbook_2026.pdf (45 pages)", articlesCount: 45, lastSynced: "2026-02-28T10:00:00Z", status: "synced" },
  { id: "ks_005", name: "Pricing API", type: "api", source: "GET /api/v2/pricing", articlesCount: 5, lastSynced: "2026-03-03T10:00:00Z", status: "synced" },
  { id: "ks_006", name: "Release Notes Blog", type: "url", source: "https://blog.ai-crm.vn/releases", articlesCount: 0, lastSynced: "2026-03-03T10:15:00Z", status: "syncing" },
];

/* ============================================================
 * Create Intent Modal
 * ============================================================ */
function CreateIntentModal({ onClose, onCreated }: { onClose: () => void; onCreated: (intent: Intent) => void }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Sales");
  const [description, setDescription] = useState("");
  const [phraseInput, setPhraseInput] = useState("");
  const [phrases, setPhrases] = useState<string[]>([]);
  const [response, setResponse] = useState("");
  const [saving, setSaving] = useState(false);

  const addPhrase = () => {
    const p = phraseInput.trim();
    if (p && !phrases.includes(p)) { setPhrases((prev) => [...prev, p]); setPhraseInput(""); }
  };

  const handleSave = () => {
    if (!name.trim()) { toast.error("Vui lòng nhập tên intent"); return; }
    if (phrases.length === 0) { toast.error("Vui lòng thêm ít nhất 1 training phrase"); return; }
    if (!response.trim()) { toast.error("Vui lòng nhập response mẫu"); return; }
    setSaving(true);
    const newIntent: Intent = {
      id: `int_${Date.now()}`, name, category,
      description: description || name,
      trainingPhrases: phrases, responses: [response],
      confidence: 70, hitCount: 0, lastTriggered: null, status: "draft",
    };
    onCreated(newIntent);
    toast.success(`Đã tạo intent "${name}" với ${phrases.length} training phrases`);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Tạo Intent mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3 max-h-[65vh] overflow-y-auto">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-xs text-gray-500 mb-1 block">Tên Intent *</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Hỏi chính sách bảo hành"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Danh mục</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option>Sales</option><option>Support</option><option>Product</option>
                <option>Billing</option><option>General</option><option>Technical</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mô tả</label>
            <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Mô tả ngắn khi nào intent này kích hoạt..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          {/* Training Phrases */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Training Phrases ({phrases.length}) *</label>
            <div className="flex items-center gap-2 mb-2">
              <input type="text" value={phraseInput} onChange={(e) => setPhraseInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addPhrase())}
                placeholder="Nhập câu mẫu + Enter"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              <button type="button" onClick={addPhrase} className="px-3 py-2 text-sm text-violet-600 hover:bg-violet-50 rounded-lg border border-violet-200">Thêm</button>
            </div>
            {phrases.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {phrases.map((p) => (
                  <span key={p} className="text-[9px] px-2 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-200 flex items-center gap-1">
                    {p}
                    <button type="button" onClick={() => setPhrases((prev) => prev.filter((x) => x !== p))} className="text-blue-400 hover:text-blue-700">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* Response */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Response mẫu *</label>
            <textarea value={response} onChange={(e) => setResponse(e.target.value)} rows={3}
              placeholder="Chatbot sẽ trả lời như thế nào khi nhận diện intent này?"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
          </div>
          <div className="bg-violet-50 rounded-lg p-3 border border-violet-100">
            <p className="text-[10px] text-violet-700 flex items-center gap-1"><Sparkles className="w-3 h-3" /> Sau khi tạo, AI sẽ tự generate thêm training phrases và tối ưu response. Confidence sẽ tăng theo thời gian.</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo Intent"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Add Knowledge Source Modal
 * ============================================================ */
function AddKnowledgeSourceModal({ onClose, onCreated }: { onClose: () => void; onCreated: (src: KnowledgeSource) => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState<KnowledgeSource["type"]>("url");
  const [source, setSource] = useState("");
  const [saving, setSaving] = useState(false);

  const typeLabels: Record<KnowledgeSource["type"], string> = {
    url: "Website URL", document: "Tài liệu", faq: "FAQ Database", api: "API Endpoint",
  };

  const handleSave = () => {
    if (!name.trim()) { toast.error("Vui lòng nhập tên nguồn dữ liệu"); return; }
    if (!source.trim()) { toast.error("Vui lòng nhập đường dẫn/nguồn"); return; }
    setSaving(true);
    const newSrc: KnowledgeSource = {
      id: `ks_${Date.now()}`, name, type, source,
      articlesCount: 0, lastSynced: new Date().toISOString(), status: "syncing",
    };
    onCreated(newSrc);
    toast.success(`Đã thêm nguồn "${name}" — đang đồng bộ...`);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Thêm nguồn dữ liệu</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tên nguồn *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Tài liệu sản phẩm mới"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Loại nguồn</label>
            <select value={type} onChange={(e) => setType(e.target.value as KnowledgeSource["type"])}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
              {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">
              {type === "url" ? "URL" : type === "api" ? "API Endpoint" : type === "faq" ? "Mô tả nguồn FAQ" : "Tên file / đường dẫn"} *
            </label>
            <input type="text" value={source} onChange={(e) => setSource(e.target.value)}
              placeholder={type === "url" ? "https://docs.company.com" : type === "api" ? "GET /api/v2/products" : "Nhập mô tả nguồn..."}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="bg-violet-50 rounded-lg p-3 border border-violet-100">
            <p className="text-[10px] text-violet-700 flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI sẽ crawl, phân tích và tạo articles tự động từ nguồn dữ liệu này.</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 disabled:opacity-50">
            {saving ? "Đang thêm..." : "Thêm nguồn"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Playground Component
 * ============================================================ */
function ChatPlayground() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "m1", role: "bot", content: "Xin chào! 👋 Mình là AI Assistant của AI-CRM. Bạn cần hỗ trợ gì?", confidence: 98, matchedIntent: "Chào hỏi" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const mockRespond = (userMsg: string) => {
    const lower = userMsg.toLowerCase();
    if (lower.includes("giá") || lower.includes("bao nhiêu") || lower.includes("chi phí"))
      return { content: "AI-CRM có 4 gói: Starter (2tr/tháng), Professional (5tr), Enterprise (12tr), Custom. Xem chi tiết tại bảng giá!", confidence: 94, intent: "Hỏi giá sản phẩm" };
    if (lower.includes("demo") || lower.includes("tư vấn"))
      return { content: "Để đặt lịch demo 1-1, vui lòng chọn thời gian hoặc để lại SĐT nhé!", confidence: 91, intent: "Đặt lịch demo" };
    if (lower.includes("lỗi") || lower.includes("bug") || lower.includes("hỗ trợ"))
      return { content: "Mình hiểu sự bất tiện! Hãy mô tả chi tiết lỗi, gửi screenshot nếu có. Mình sẽ hỗ trợ ngay!", confidence: 88, intent: "Hỗ trợ kỹ thuật" };
    if (lower.includes("huỷ") || lower.includes("cancel"))
      return { content: "Mình rất tiếc! Trước khi huỷ, bạn cho mình biết lý do không? Mình sẽ cố gắng giúp tìm giải pháp phù hợp hơn.", confidence: 92, intent: "Huỷ subscription" };
    if (lower.includes("api") || lower.includes("tích hợp"))
      return { content: "AI-CRM cung cấp REST API v2, Webhooks, SDK (JS/Python/PHP), và Zapier integration. Xem docs để bắt đầu!", confidence: 90, intent: "Tích hợp API" };
    return { content: "Cảm ơn câu hỏi! Mình chưa chắc chắn lắm về vấn đề này. Để mình chuyển cho nhân viên hỗ trợ nhé. Bạn có muốn tạo ticket không?", confidence: 42, intent: "Fallback" };
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: `m_${Date.now()}`, role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const resp = mockRespond(input);
      const botMsg: ChatMessage = {
        id: `m_${Date.now()}_bot`, role: "bot", content: resp.content,
        confidence: resp.confidence, matchedIntent: resp.intent,
      };
      setMessages((prev) => [...prev, botMsg]);
      setLoading(false);
      scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 800);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col" style={{ height: "500px" }}>
      <div className="p-3 border-b border-gray-100 flex items-center gap-2">
        <Bot className="w-5 h-5 text-violet-600" />
        <div>
          <p className="text-sm text-gray-900">Chat Playground</p>
          <p className="text-[9px] text-gray-400">Test chatbot trước khi deploy</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[80%] ${m.role === "user" ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-800"} rounded-2xl px-3 py-2`}>
              <p className="text-sm whitespace-pre-wrap">{m.content}</p>
              {m.confidence != null && m.role === "bot" && (
                <div className="flex items-center gap-2 mt-1.5 pt-1.5 border-t border-gray-200/50">
                  <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                    m.confidence >= 80 ? "bg-green-100 text-green-600" :
                    m.confidence >= 50 ? "bg-amber-100 text-amber-600" :
                    "bg-red-100 text-red-600"
                  }`}>
                    {m.confidence}% confidence
                  </span>
                  <span className="text-[8px] text-gray-400">Intent: {m.matchedIntent}</span>
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-3 py-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      <div className="p-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <input type="text" value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
            placeholder="Nhập tin nhắn để test chatbot..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm" />
          <button type="button" onClick={handleSend} disabled={loading}
            className="p-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50">
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {["Giá bao nhiêu?", "Đặt lịch demo", "Bị lỗi đăng nhập", "API documentation"].map((q) => (
            <button key={q} type="button"
              onClick={() => { setInput(q); }}
              className="text-[9px] px-2 py-1 bg-gray-50 border border-gray-200 text-gray-500 rounded-lg hover:bg-violet-50 hover:border-violet-200 hover:text-violet-600">
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Main Page
 * ============================================================ */
export function AiChatbotTrainingPage() {
  const [intents, setIntents] = useState<Intent[]>(MOCK_INTENTS);
  const [knowledge, setKnowledge] = useState<KnowledgeSource[]>(MOCK_KNOWLEDGE);
  const [activeTab, setActiveTab] = useState<Tab>("intents");
  const [search, setSearch] = useState("");
  const [expandedIntent, setExpandedIntent] = useState<string | null>(null);
  const [showIntentModal, setShowIntentModal] = useState(false);
  const [showKBModal, setShowKBModal] = useState(false);

  const filteredIntents = useMemo(() => {
    if (!search) return intents;
    const q = search.toLowerCase();
    return intents.filter((i) =>
      i.name.toLowerCase().includes(q) ||
      i.trainingPhrases.some((p) => p.toLowerCase().includes(q)),
    );
  }, [intents, search]);

  const stats = useMemo(() => ({
    totalIntents: intents.length,
    activeIntents: intents.filter((i) => i.status === "active").length,
    totalHits: intents.reduce((s, i) => s + i.hitCount, 0),
    avgConfidence: intents.length > 0 ? (intents.reduce((s, i) => s + i.confidence, 0) / intents.length).toFixed(0) : 0,
    totalKBArticles: knowledge.reduce((s, k) => s + k.articlesCount, 0),
    kbSources: knowledge.length,
  }), [intents, knowledge]);

  const tabs: { key: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "intents", label: "Intents", icon: Target },
    { key: "knowledge", label: "Knowledge Base", icon: BookOpen },
    { key: "playground", label: "Playground", icon: MessageSquare },
    { key: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <Brain className="w-6 h-6 text-violet-600" /> AI Chatbot Training
        </h1>
        <p className="text-gray-500 mt-0.5">
          Huấn luyện chatbot AI — quản lý intents, knowledge base, test & analytics
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        <div className="bg-white rounded-xl border border-gray-100 p-2.5 text-center">
          <p className="text-lg text-gray-900">{stats.totalIntents}</p>
          <p className="text-[9px] text-gray-400">Intents</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{stats.activeIntents}</p>
          <p className="text-[9px] text-green-700">Active</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-2.5 text-center">
          <p className="text-lg text-violet-600">{stats.avgConfidence}%</p>
          <p className="text-[9px] text-violet-700">TB Confidence</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{stats.totalHits.toLocaleString()}</p>
          <p className="text-[9px] text-blue-700">Tổng Hit</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-2.5 text-center">
          <p className="text-lg text-amber-600">{stats.totalKBArticles}</p>
          <p className="text-[9px] text-amber-700">KB Articles</p>
        </div>
        <div className="bg-cyan-50 rounded-xl border border-cyan-200 p-2.5 text-center">
          <p className="text-lg text-cyan-600">{stats.kbSources}</p>
          <p className="text-[9px] text-cyan-700">Data Sources</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              activeTab === t.key
                ? "bg-violet-600 text-white"
                : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>
            <t.icon className="w-4 h-4" /> {t.label}
          </button>
        ))}
      </div>

      {/* === Tab: Intents === */}
      {activeTab === "intents" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 min-w-[150px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input type="text" placeholder="Tìm intent hoặc training phrase..."
                value={search} onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
            </div>
            <button type="button" onClick={() => setShowIntentModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">
              <Plus className="w-4 h-4" /> Thêm Intent
            </button>
          </div>

          <div className="space-y-2">
            {filteredIntents.map((intent) => {
              const isExpanded = expandedIntent === intent.id;
              return (
                <div key={intent.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                  <button type="button" onClick={() => setExpandedIntent(isExpanded ? null : intent.id)}
                    className="w-full flex items-start gap-3 p-3 text-left hover:bg-gray-50/50">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      intent.confidence >= 85 ? "bg-green-50 border border-green-200" :
                      intent.confidence >= 60 ? "bg-amber-50 border border-amber-200" :
                      "bg-red-50 border border-red-200"
                    }`}>
                      <Target className={`w-4 h-4 ${
                        intent.confidence >= 85 ? "text-green-600" :
                        intent.confidence >= 60 ? "text-amber-600" : "text-red-600"
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-gray-900">{intent.name}</span>
                        <span className="text-[8px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{intent.category}</span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                          intent.confidence >= 85 ? "bg-green-100 text-green-600" :
                          intent.confidence >= 60 ? "bg-amber-100 text-amber-600" :
                          "bg-red-100 text-red-600"
                        }`}>{intent.confidence}%</span>
                      </div>
                      <p className="text-[10px] text-gray-400 mt-0.5">{intent.description}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-[9px] text-gray-400">
                        <span>{intent.trainingPhrases.length} phrases</span>
                        <span>{intent.hitCount.toLocaleString()} hits</span>
                        {intent.lastTriggered && <span>Gần nhất: {new Date(intent.lastTriggered).toLocaleTimeString("vi-VN")}</span>}
                      </div>
                    </div>
                    {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400 mt-1" /> : <ChevronRight className="w-4 h-4 text-gray-400 mt-1" />}
                  </button>

                  {isExpanded && (
                    <div className="px-3 pb-3 border-t border-gray-50">
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1.5">Training Phrases ({intent.trainingPhrases.length})</p>
                          <div className="flex flex-wrap gap-1">
                            {intent.trainingPhrases.map((p) => (
                              <span key={p} className="text-[9px] px-2 py-1 bg-blue-50 text-blue-600 rounded-lg border border-blue-200">{p}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 mb-1.5">Response</p>
                          <div className="bg-green-50 rounded-lg p-2 text-[10px] text-green-800 border border-green-200 whitespace-pre-wrap">
                            {intent.responses[0]}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mt-3 pt-2 border-t border-gray-50">
                        <button type="button" onClick={() => toast.success("Mở editor intent")}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-violet-600 hover:bg-violet-50 rounded-lg">
                          <Pencil className="w-3 h-3" /> Sửa
                        </button>
                        <button type="button" onClick={() => { setActiveTab("playground"); setSearch(""); }}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Play className="w-3 h-3" /> Test
                        </button>
                        <button type="button" onClick={() => toast.success("AI đang tạo thêm training phrases...")}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-green-600 hover:bg-green-50 rounded-lg">
                          <Sparkles className="w-3 h-3" /> AI Generate Phrases
                        </button>
                        <div className="flex-1" />
                        <button type="button" onClick={() => { setIntents((prev) => prev.filter((i) => i.id !== intent.id)); toast.success("Đã xoá intent"); }}
                          className="p-1.5 text-gray-300 hover:text-red-500">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* === Tab: Knowledge Base === */}
      {activeTab === "knowledge" && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <button type="button" onClick={() => setShowKBModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">
              <Plus className="w-4 h-4" /> Thêm nguồn
            </button>
            <button type="button" onClick={() => toast.success("Đang đồng bộ tất cả nguồn...")}
              className="flex items-center gap-1.5 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              <RefreshCw className="w-4 h-4" /> Sync tất cả
            </button>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
            {knowledge.map((ks) => {
              const TypeIcon = ks.type === "url" ? Globe : ks.type === "document" ? FileText : ks.type === "faq" ? MessageSquare : Zap;
              return (
                <div key={ks.id} className="flex items-center gap-3 p-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center flex-shrink-0">
                    <TypeIcon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{ks.name}</p>
                    <p className="text-[10px] text-gray-400 truncate">{ks.source}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-600">{ks.articlesCount} articles</p>
                    <div className="flex items-center gap-1 justify-end mt-0.5">
                      {ks.status === "synced" && <CheckCircle2 className="w-3 h-3 text-green-500" />}
                      {ks.status === "syncing" && <RefreshCw className="w-3 h-3 text-blue-500 animate-spin" />}
                      {ks.status === "error" && <XCircle className="w-3 h-3 text-red-500" />}
                      <span className="text-[9px] text-gray-400">{new Date(ks.lastSynced).toLocaleDateString("vi-VN")}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-violet-50 rounded-xl border border-violet-200 p-3">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span className="text-sm text-violet-900">RAG Pipeline Status</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-2">
              <div className="text-center">
                <p className="text-sm text-violet-700">{stats.totalKBArticles}</p>
                <p className="text-[8px] text-violet-500">Tổng articles đã index</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-violet-700">12,456</p>
                <p className="text-[8px] text-violet-500">Vector embeddings</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-violet-700">89ms</p>
                <p className="text-[8px] text-violet-500">Avg query time</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* === Tab: Playground === */}
      {activeTab === "playground" && <ChatPlayground />}

      {/* === Tab: Analytics === */}
      {activeTab === "analytics" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
              <p className="text-xl text-gray-900">11,860</p>
              <p className="text-[9px] text-gray-400">Tổng conversations (30 ngày)</p>
            </div>
            <div className="bg-green-50 rounded-xl border border-green-200 p-3 text-center">
              <p className="text-xl text-green-600">78.5%</p>
              <p className="text-[9px] text-green-700">Containment Rate</p>
            </div>
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-3 text-center">
              <p className="text-xl text-blue-600">4.2/5</p>
              <p className="text-[9px] text-blue-700">CSAT Score</p>
            </div>
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-3 text-center">
              <p className="text-xl text-amber-600">21.5%</p>
              <p className="text-[9px] text-amber-700">Escalation Rate</p>
            </div>
          </div>

          {/* Top Intents */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h4 className="text-sm text-gray-900 mb-3">Top Intents (30 ngày)</h4>
            <div className="space-y-2">
              {intents.sort((a, b) => b.hitCount - a.hitCount).slice(0, 5).map((intent, i) => {
                const maxHit = intents[0]?.hitCount || 1;
                return (
                  <div key={intent.id} className="flex items-center gap-3">
                    <span className="text-[9px] text-gray-400 w-4">{i + 1}.</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs text-gray-700">{intent.name}</span>
                        <span className="text-xs text-gray-500">{intent.hitCount.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-400 rounded-full" style={{ width: `${(intent.hitCount / maxHit) * 100}%` }} />
                      </div>
                    </div>
                    <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                      intent.confidence >= 85 ? "bg-green-100 text-green-600" : "bg-amber-100 text-amber-600"
                    }`}>{intent.confidence}%</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Unrecognized */}
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h4 className="text-sm text-amber-900">Top Unrecognized Queries (cần training)</h4>
            </div>
            <div className="space-y-1">
              {["chính sách bảo hành", "trả góp được không", "có app mobile không", "export dữ liệu ra excel", "hỗ trợ tiếng Anh"].map((q) => (
                <div key={q} className="flex items-center justify-between py-1.5 px-2 bg-white rounded-lg">
                  <span className="text-xs text-gray-700">"{q}"</span>
                  <button type="button" onClick={() => toast.success(`Tạo intent cho: "${q}"`)}
                    className="text-[8px] px-2 py-1 bg-violet-100 text-violet-600 rounded hover:bg-violet-200">
                    + Tạo Intent
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Training Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Containment rate tăng <strong>+12%</strong> sau khi thêm 45 training phrases mới tuần trước. Intent <strong>"Hỗ trợ kỹ thuật"</strong> cải thiện nhiều nhất.</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span><strong>5 queries</strong> xuất hiện &gt;50 lần nhưng chưa có intent. Đề xuất tạo intent cho <strong>"chính sách bảo hành"</strong> và <strong>"app mobile"</strong>.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>AI có thể tự generate <strong>~200 training phrases</strong> từ 8 intents hiện có, dự kiến tăng accuracy lên <strong>+8%</strong>. Bấm "AI Generate" để bắt đầu.</span>
          </p>
        </div>
      </div>
      {showIntentModal && <CreateIntentModal onClose={() => setShowIntentModal(false)} onCreated={(intent) => setIntents((prev) => [intent, ...prev])} />}
      {showKBModal && <AddKnowledgeSourceModal onClose={() => setShowKBModal(false)} onCreated={(src) => setKnowledge((prev) => [src, ...prev])} />}
    </div>
  );
}