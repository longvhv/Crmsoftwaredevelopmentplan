/**
 * Developer Portal — API Documentation, SDK, Sandbox
 * API usage analytics, SDK downloads, webhook testing,
 * API keys management, rate limits, developer resources.
 */
import { useState, useMemo } from "react";
import {
  Code2,
  Key,
  Search,
  Plus,
  Copy,
  Eye,
  EyeOff,
  Sparkles,
  Bot,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  BarChart3,
  Terminal,
  BookOpen,
  Zap,
  Globe,
  Server,
  Shield,
  Download,
  Play,
  ExternalLink,
  RefreshCw,
  Webhook,
  FileCode2,
  Package,
  X,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
interface APIKey {
  id: string;
  name: string;
  keyPrefix: string;
  environment: "production" | "sandbox";
  permissions: string[];
  createdAt: string;
  lastUsed: string;
  requestsToday: number;
  rateLimit: number;
  status: "active" | "revoked" | "expired";
}

interface APIEndpoint {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  path: string;
  description: string;
  category: string;
  avgLatency: number;
  requestsToday: number;
  errorRate: number;
}

interface SDKInfo {
  language: string;
  icon: string;
  version: string;
  downloads: number;
  lastUpdated: string;
  installCommand: string;
}

interface WebhookEvent {
  id: string;
  event: string;
  url: string;
  status: "delivered" | "failed" | "pending";
  timestamp: string;
  responseCode: number;
  latencyMs: number;
}

/* ============================================================
 * Mock Data
 * ============================================================ */
const MOCK_KEYS: APIKey[] = [
  { id: "key_001", name: "Production App — Main", keyPrefix: "crm_live_sk_7x9K...mN4p", environment: "production", permissions: ["contacts:read", "contacts:write", "deals:read", "deals:write", "reports:read"], createdAt: "2025-08-15", lastUsed: "2026-03-03 08:45", requestsToday: 12450, rateLimit: 1000, status: "active" },
  { id: "key_002", name: "Sandbox — Dev Team", keyPrefix: "crm_test_sk_3bQ2...fR8w", environment: "sandbox", permissions: ["contacts:read", "contacts:write", "deals:read", "deals:write", "webhooks:manage"], createdAt: "2025-10-20", lastUsed: "2026-03-03 09:12", requestsToday: 3420, rateLimit: 5000, status: "active" },
  { id: "key_003", name: "Integration — ERP Sync", keyPrefix: "crm_live_sk_9pL5...kW2j", environment: "production", permissions: ["contacts:read", "deals:read", "invoices:read", "invoices:write"], createdAt: "2026-01-10", lastUsed: "2026-03-03 07:30", requestsToday: 8920, rateLimit: 500, status: "active" },
  { id: "key_004", name: "Mobile App — v2 (deprecated)", keyPrefix: "crm_live_sk_1mX8...aB5c", environment: "production", permissions: ["contacts:read", "deals:read"], createdAt: "2025-06-01", lastUsed: "2026-02-15", requestsToday: 0, rateLimit: 200, status: "revoked" },
];

const MOCK_ENDPOINTS: APIEndpoint[] = [
  { method: "GET", path: "/api/v2/contacts", description: "Lấy danh sách liên hệ (phân trang)", category: "Contacts", avgLatency: 45, requestsToday: 8200, errorRate: 0.1 },
  { method: "POST", path: "/api/v2/contacts", description: "Tạo liên hệ mới", category: "Contacts", avgLatency: 62, requestsToday: 1850, errorRate: 0.3 },
  { method: "GET", path: "/api/v2/deals", description: "Lấy danh sách deals (phân trang + filter)", category: "Deals", avgLatency: 78, requestsToday: 6500, errorRate: 0.2 },
  { method: "POST", path: "/api/v2/deals", description: "Tạo deal mới", category: "Deals", avgLatency: 85, requestsToday: 920, errorRate: 0.4 },
  { method: "PATCH", path: "/api/v2/deals/:id/stage", description: "Cập nhật stage của deal", category: "Deals", avgLatency: 35, requestsToday: 3200, errorRate: 0.1 },
  { method: "GET", path: "/api/v2/reports/pipeline", description: "Báo cáo pipeline summary", category: "Reports", avgLatency: 320, requestsToday: 450, errorRate: 1.2 },
  { method: "POST", path: "/api/v2/ai/lead-score", description: "AI chấm điểm lead", category: "AI", avgLatency: 180, requestsToday: 5600, errorRate: 0.5 },
  { method: "POST", path: "/api/v2/ai/email-generate", description: "AI tạo email sales", category: "AI", avgLatency: 2200, requestsToday: 1200, errorRate: 0.8 },
  { method: "GET", path: "/api/v2/activities", description: "Lấy activities (calls, emails, meetings)", category: "Activities", avgLatency: 55, requestsToday: 4100, errorRate: 0.2 },
  { method: "POST", path: "/api/v2/webhooks", description: "Đăng ký webhook endpoint", category: "Webhooks", avgLatency: 25, requestsToday: 85, errorRate: 0.0 },
];

const MOCK_SDKS: SDKInfo[] = [
  { language: "TypeScript/Node.js", icon: "🟦", version: "v3.2.1", downloads: 45200, lastUpdated: "2026-02-28", installCommand: "npm install @ai-crm/sdk" },
  { language: "Python", icon: "🐍", version: "v3.1.0", downloads: 28500, lastUpdated: "2026-02-25", installCommand: "pip install ai-crm-sdk" },
  { language: "Java", icon: "☕", version: "v2.4.0", downloads: 12800, lastUpdated: "2026-02-20", installCommand: 'implementation "com.ai-crm:sdk:2.4.0"' },
  { language: "Go", icon: "🔵", version: "v2.2.0", downloads: 8600, lastUpdated: "2026-02-18", installCommand: "go get github.com/ai-crm/sdk-go" },
  { language: "C#/.NET", icon: "🟣", version: "v2.1.0", downloads: 6200, lastUpdated: "2026-02-15", installCommand: "dotnet add package AiCrm.Sdk" },
];

const MOCK_WEBHOOKS: WebhookEvent[] = [
  { id: "wh_001", event: "deal.stage_changed", url: "https://erp.company.com/webhook/crm", status: "delivered", timestamp: "2026-03-03 09:15:32", responseCode: 200, latencyMs: 145 },
  { id: "wh_002", event: "contact.created", url: "https://marketing.company.com/api/sync", status: "delivered", timestamp: "2026-03-03 09:12:18", responseCode: 200, latencyMs: 89 },
  { id: "wh_003", event: "deal.won", url: "https://billing.company.com/webhook", status: "failed", timestamp: "2026-03-03 08:55:41", responseCode: 503, latencyMs: 5000 },
  { id: "wh_004", event: "contact.updated", url: "https://erp.company.com/webhook/crm", status: "delivered", timestamp: "2026-03-03 08:48:22", responseCode: 200, latencyMs: 112 },
  { id: "wh_005", event: "ai.lead_scored", url: "https://analytics.company.com/events", status: "pending", timestamp: "2026-03-03 09:16:00", responseCode: 0, latencyMs: 0 },
];

const METHOD_COLOR: Record<string, string> = {
  GET: "bg-green-100 text-green-700",
  POST: "bg-blue-100 text-blue-700",
  PUT: "bg-amber-100 text-amber-700",
  PATCH: "bg-violet-100 text-violet-700",
  DELETE: "bg-red-100 text-red-700",
};

const fmtK = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}K` : String(n));

type Tab = "api-keys" | "endpoints" | "sdks" | "webhooks";

/* ============================================================
 * Create API Key Modal
 * ============================================================ */
function CreateAPIKeyModal({ onClose, onCreated }: { onClose: () => void; onCreated: (k: APIKey) => void }) {
  const [name, setName] = useState("");
  const [environment, setEnvironment] = useState<"production" | "sandbox">("sandbox");
  const [rateLimit, setRateLimit] = useState(1000);
  const [permissions, setPermissions] = useState<string[]>(["contacts:read", "deals:read"]);
  const [saving, setSaving] = useState(false);

  const allPerms = [
    "contacts:read", "contacts:write",
    "deals:read", "deals:write",
    "reports:read",
    "invoices:read", "invoices:write",
    "webhooks:manage",
  ];

  const togglePerm = (perm: string) => {
    setPermissions((prev) => prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]);
  };

  const handleSave = () => {
    if (!name.trim()) { toast.error("Vui lòng nhập tên API Key"); return; }
    if (permissions.length === 0) { toast.error("Vui lòng chọn ít nhất 1 quyền"); return; }
    setSaving(true);
    const prefix = environment === "production" ? "crm_live_sk_" : "crm_test_sk_";
    const rand = Math.random().toString(36).slice(2, 6) + "..." + Math.random().toString(36).slice(2, 6);
    const newKey: APIKey = {
      id: `key_${Date.now()}`, name,
      keyPrefix: `${prefix}${rand}`,
      environment, permissions,
      createdAt: new Date().toISOString().slice(0, 10),
      lastUsed: "Chưa sử dụng",
      requestsToday: 0, rateLimit, status: "active",
    };
    onCreated(newKey);
    toast.success(`Đã tạo API Key "${name}" (${environment})`);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Tạo API Key mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tên API Key *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Mobile App — v3"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Môi trường</label>
              <select value={environment} onChange={(e) => setEnvironment(e.target.value as "production" | "sandbox")}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                <option value="sandbox">🧪 Sandbox</option>
                <option value="production">🚀 Production</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Rate Limit (req/min)</label>
              <select value={rateLimit} onChange={(e) => setRateLimit(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                <option value={100}>100</option>
                <option value={200}>200</option>
                <option value={500}>500</option>
                <option value={1000}>1,000</option>
                <option value={5000}>5,000</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Quyền truy cập</label>
            <div className="grid grid-cols-2 gap-1.5">
              {allPerms.map((perm) => (
                <label key={perm} className="flex items-center gap-2 cursor-pointer p-1.5 bg-gray-50 rounded-lg hover:bg-sky-50">
                  <input type="checkbox" checked={permissions.includes(perm)} onChange={() => togglePerm(perm)}
                    className="w-3.5 h-3.5 rounded border-gray-300 text-sky-600 focus:ring-sky-500" />
                  <code className="text-[10px] text-gray-700">{perm}</code>
                </label>
              ))}
            </div>
          </div>
          {environment === "production" && (
            <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
              <p className="text-[10px] text-amber-800 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Key production sẽ có quyền truy cập dữ liệu thật. Hãy bảo mật cẩn thận.</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg text-sm hover:bg-sky-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo API Key"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Component
 * ============================================================ */
export function DevPortalPage() {
  const [activeTab, setActiveTab] = useState<Tab>("api-keys");
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [search, setSearch] = useState("");
  const [apiKeys, setApiKeys] = useState(MOCK_KEYS);
  const [showCreateKey, setShowCreateKey] = useState(false);

  const handleCreateKey = (k: APIKey) => {
    setApiKeys((prev) => [...prev, k]);
  };

  const filteredEndpoints = useMemo(() => {
    if (!search) return MOCK_ENDPOINTS;
    const q = search.toLowerCase();
    return MOCK_ENDPOINTS.filter((e) => e.path.toLowerCase().includes(q) || e.description.toLowerCase().includes(q) || e.category.toLowerCase().includes(q));
  }, [search]);

  const stats = useMemo(() => ({
    totalRequests: MOCK_ENDPOINTS.reduce((s, e) => s + e.requestsToday, 0),
    activeKeys: MOCK_KEYS.filter((k) => k.status === "active").length,
    avgLatency: Math.round(MOCK_ENDPOINTS.reduce((s, e) => s + e.avgLatency, 0) / MOCK_ENDPOINTS.length),
    sdkDownloads: MOCK_SDKS.reduce((s, sdk) => s + sdk.downloads, 0),
  }), []);

  const tabs: { key: Tab; label: string }[] = [
    { key: "api-keys", label: "API Keys" },
    { key: "endpoints", label: "Endpoints" },
    { key: "sdks", label: "SDKs" },
    { key: "webhooks", label: "Webhooks" },
  ];

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Code2 className="w-6 h-6 text-sky-600" /> Developer Portal
          </h1>
          <p className="text-gray-500 mt-0.5">API keys, endpoints, SDKs, webhooks — tất cả tài nguyên cho developers</p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <a href="#" onClick={(e) => { e.preventDefault(); toast.success("Mở API Documentation"); }}
            className="flex items-center gap-1 px-3 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50">
            <BookOpen className="w-4 h-4" /> Docs
          </a>
          <button type="button" onClick={() => setShowCreateKey(true)}
            className="flex items-center gap-1 px-3 py-2 bg-sky-600 text-white rounded-lg text-sm hover:bg-sky-700">
            <Plus className="w-4 h-4" /> Tạo Key
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-sky-50 rounded-xl border border-sky-200 p-2.5 text-center">
          <p className="text-lg text-sky-600">{fmtK(stats.totalRequests)}</p>
          <p className="text-[9px] text-sky-700">Requests hôm nay</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{stats.activeKeys}</p>
          <p className="text-[9px] text-green-700">Active API Keys</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-2.5 text-center">
          <p className="text-lg text-violet-600">{stats.avgLatency}ms</p>
          <p className="text-[9px] text-violet-700">Avg Latency</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-2.5 text-center">
          <p className="text-lg text-amber-600">{fmtK(stats.sdkDownloads)}</p>
          <p className="text-[9px] text-amber-700">SDK Downloads</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
              activeTab === t.key ? "bg-sky-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* === API Keys Tab === */}
      {activeTab === "api-keys" && (
        <div className="space-y-2">
          {apiKeys.map((key) => (
            <div key={key.id} className={`bg-white rounded-xl border p-4 ${key.status === "revoked" ? "border-gray-200 opacity-60" : "border-gray-100"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  key.environment === "production" ? "bg-green-50" : "bg-amber-50"
                }`}>
                  <Key className={`w-5 h-5 ${key.environment === "production" ? "text-green-600" : "text-amber-600"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-900">{key.name}</span>
                    <span className={`text-[7px] px-1.5 py-0.5 rounded border ${
                      key.environment === "production" ? "bg-green-50 text-green-600 border-green-200" : "bg-amber-50 text-amber-600 border-amber-200"
                    }`}>{key.environment}</span>
                    <span className={`text-[7px] px-1.5 py-0.5 rounded border ${
                      key.status === "active" ? "bg-green-50 text-green-600 border-green-200" : "bg-red-50 text-red-600 border-red-200"
                    }`}>{key.status}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-[9px] bg-gray-100 px-2 py-0.5 rounded font-mono text-gray-600">
                      {showKeys[key.id] ? key.keyPrefix.replace("...", "abcdef1234567890") : key.keyPrefix}
                    </code>
                    <button type="button" onClick={() => setShowKeys((p) => ({ ...p, [key.id]: !p[key.id] }))}
                      className="text-gray-400 hover:text-gray-600">
                      {showKeys[key.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                    <button type="button" onClick={() => toast.success("Đã copy API key")}
                      className="text-gray-400 hover:text-gray-600">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-[8px] text-gray-400 flex-wrap">
                    <span>Tạo: {key.createdAt}</span>
                    <span>Dùng lần cuối: {key.lastUsed}</span>
                    <span>Hôm nay: {fmtK(key.requestsToday)} req</span>
                    <span>Limit: {fmtK(key.rateLimit)}/min</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {key.permissions.map((p) => (
                      <span key={p} className="text-[7px] px-1 py-0.5 bg-sky-50 text-sky-600 rounded border border-sky-200">{p}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === Endpoints Tab === */}
      {activeTab === "endpoints" && (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Tìm endpoint..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm" />
          </div>
          <div className="space-y-1.5">
            {filteredEndpoints.map((ep, idx) => (
              <div key={idx} className="bg-white rounded-xl border border-gray-100 p-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[8px] px-1.5 py-0.5 rounded ${METHOD_COLOR[ep.method]}`}>{ep.method}</span>
                  <code className="text-[10px] font-mono text-gray-700">{ep.path}</code>
                  <span className="text-[8px] text-gray-400 ml-auto hidden sm:inline">{ep.category}</span>
                </div>
                <p className="text-[9px] text-gray-500 mt-0.5">{ep.description}</p>
                <div className="flex items-center gap-4 mt-1 text-[8px] text-gray-400">
                  <span>⚡ {ep.avgLatency}ms</span>
                  <span>📊 {fmtK(ep.requestsToday)} req/today</span>
                  <span className={ep.errorRate > 1 ? "text-red-500" : ""}>❌ {ep.errorRate}% errors</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* === SDKs Tab === */}
      {activeTab === "sdks" && (
        <div className="space-y-2">
          {MOCK_SDKS.map((sdk) => (
            <div key={sdk.language} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{sdk.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-900">{sdk.language}</span>
                    <span className="text-[8px] text-gray-400">{sdk.version}</span>
                  </div>
                  <div className="mt-1.5 bg-gray-900 rounded-lg px-3 py-2 flex items-center gap-2">
                    <Terminal className="w-3 h-3 text-green-400 flex-shrink-0" />
                    <code className="text-[9px] text-green-400 font-mono flex-1">{sdk.installCommand}</code>
                    <button type="button" onClick={() => { navigator.clipboard.writeText(sdk.installCommand); toast.success("Đã copy!"); }}
                      className="text-gray-400 hover:text-white">
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mt-1.5 text-[8px] text-gray-400">
                    <span>📥 {fmtK(sdk.downloads)} downloads</span>
                    <span>Cập nhật: {sdk.lastUpdated}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === Webhooks Tab === */}
      {activeTab === "webhooks" && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-[9px]">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100 bg-gray-50">
                  <th className="text-left py-2.5 px-3">Thời gian</th>
                  <th className="text-left py-2.5 px-2">Event</th>
                  <th className="text-left py-2.5 px-2">URL</th>
                  <th className="text-center py-2.5 px-2">Status</th>
                  <th className="text-right py-2.5 px-2">Code</th>
                  <th className="text-right py-2.5 px-3">Latency</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_WEBHOOKS.map((wh) => (
                  <tr key={wh.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2 px-3 text-gray-500 whitespace-nowrap">{wh.timestamp}</td>
                    <td className="py-2 px-2 text-gray-800 font-mono text-[8px]">{wh.event}</td>
                    <td className="py-2 px-2 text-gray-500 truncate max-w-[150px]">{wh.url}</td>
                    <td className="py-2 px-2 text-center">
                      {wh.status === "delivered" && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mx-auto" />}
                      {wh.status === "failed" && <AlertTriangle className="w-3.5 h-3.5 text-red-500 mx-auto" />}
                      {wh.status === "pending" && <Clock className="w-3.5 h-3.5 text-amber-500 mx-auto" />}
                    </td>
                    <td className={`py-2 px-2 text-right ${wh.responseCode >= 400 || wh.responseCode === 0 ? "text-red-600" : "text-green-600"}`}>
                      {wh.responseCode || "—"}
                    </td>
                    <td className="py-2 px-3 text-right text-gray-500">{wh.latencyMs > 0 ? `${wh.latencyMs}ms` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-xl border border-sky-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-sky-600" />
          <h4 className="text-sm text-sky-900">AI Developer Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-sky-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>API usage tăng <strong>+23% tuần này</strong>. Top endpoint: <code className="text-[9px] bg-sky-100 px-1 rounded">/api/v2/ai/lead-score</code> (5.6K req/ngày). AI suggest: nâng rate limit cho AI endpoints lên <strong>2000 req/min</strong>.</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span>Webhook <strong>billing.company.com trả 503</strong> — failure rate <strong>12% trong 24h</strong>. AI đã tự động retry 3 lần + gửi alert. Nên kiểm tra endpoint hoặc tạm disable circuit breaker.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>Key <strong>"ERP Sync" đạt 89% rate limit</strong> (8.9K/10K). Predict sẽ bị throttle trong 2 giờ nữa. AI đề xuất: <strong>upgrade plan</strong> hoặc optimize batch calls (giảm ~40% requests).</span>
          </p>
        </div>
      </div>
      {showCreateKey && <CreateAPIKeyModal onClose={() => setShowCreateKey(false)} onCreated={handleCreateKey} />}
    </div>
  );
}