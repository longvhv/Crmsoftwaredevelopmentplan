/**
 * Webhook Manager
 * Quản lý webhook subscriptions: tạo/sửa/xoá endpoint,
 * chọn events, xem delivery logs, retry policy, test webhook.
 */
import { useState, useMemo, useCallback } from "react";
import {
  Webhook,
  Search,
  Plus,
  X,
  Check,
  Pencil,
  Trash2,
  Play,
  RefreshCw,
  Eye,
  Copy,
  ChevronDown,
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Shield,
  Key,
  Zap,
  Send,
  RotateCcw,
  Info,
  Sparkles,
  Bot,
  Lock,
  Unlock,
  Globe,
  Activity,
  Hash,
  Server,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";

/* ============================================================
 * Types
 * ============================================================ */
type WebhookStatus = "active" | "inactive" | "failing";

interface WebhookEvent {
  key: string;
  label: string;
  category: string;
}

interface WebhookSubscription {
  id: string;
  name: string;
  url: string;
  secret: string;
  status: WebhookStatus;
  events: string[];
  retryPolicy: {
    maxRetries: number;
    backoffType: "linear" | "exponential";
    initialDelay: number;
  };
  headers: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  lastTriggeredAt: string | null;
  successRate: number;
  totalDeliveries: number;
  failedDeliveries: number;
}

type DeliveryStatus = "success" | "failed" | "pending" | "retrying";

interface DeliveryLog {
  id: string;
  webhookId: string;
  event: string;
  status: DeliveryStatus;
  statusCode: number | null;
  requestPayload: string;
  responseBody: string;
  duration: number;
  timestamp: string;
  attempt: number;
  nextRetryAt: string | null;
}

/* ============================================================
 * Constants
 * ============================================================ */
const WEBHOOK_EVENTS: WebhookEvent[] = [
  { key: "contact.created", label: "Liên hệ được tạo", category: "Liên hệ" },
  { key: "contact.updated", label: "Liên hệ được cập nhật", category: "Liên hệ" },
  { key: "contact.deleted", label: "Liên hệ bị xoá", category: "Liên hệ" },
  { key: "contact.merged", label: "Liên hệ được merge", category: "Liên hệ" },
  { key: "deal.created", label: "Deal mới được tạo", category: "Deals" },
  { key: "deal.stage_changed", label: "Deal chuyển stage", category: "Deals" },
  { key: "deal.won", label: "Deal thắng", category: "Deals" },
  { key: "deal.lost", label: "Deal thua", category: "Deals" },
  { key: "deal.amount_changed", label: "Giá trị deal thay đổi", category: "Deals" },
  { key: "ticket.created", label: "Ticket mới", category: "Tickets" },
  { key: "ticket.resolved", label: "Ticket đã giải quyết", category: "Tickets" },
  { key: "ticket.sla_breached", label: "Ticket vi phạm SLA", category: "Tickets" },
  { key: "activity.logged", label: "Hoạt động được ghi", category: "Hoạt động" },
  { key: "task.completed", label: "Task hoàn thành", category: "Hoạt động" },
  { key: "invoice.paid", label: "Hoá đơn đã thanh toán", category: "Tài chính" },
  { key: "invoice.overdue", label: "Hoá đơn quá hạn", category: "Tài chính" },
  { key: "contract.signed", label: "Hợp đồng được ký", category: "Tài chính" },
  { key: "workflow.completed", label: "Workflow hoàn thành", category: "Hệ thống" },
  { key: "workflow.failed", label: "Workflow thất bại", category: "Hệ thống" },
  { key: "user.login", label: "Người dùng đăng nhập", category: "Hệ thống" },
  { key: "user.role_changed", label: "Quyền thay đổi", category: "Hệ thống" },
  { key: "ai.lead_scored", label: "AI chấm điểm lead", category: "AI" },
  { key: "ai.anomaly_detected", label: "AI phát hiện bất thường", category: "AI" },
];

const STATUS_CONFIG: Record<WebhookStatus, { label: string; color: string; bg: string; icon: React.ComponentType<{ className?: string }> }> = {
  active: { label: "Hoạt động", color: "text-green-600", bg: "bg-green-50 border-green-200", icon: CheckCircle2 },
  inactive: { label: "Tạm dừng", color: "text-gray-500", bg: "bg-gray-50 border-gray-200", icon: XCircle },
  failing: { label: "Đang lỗi", color: "text-red-600", bg: "bg-red-50 border-red-200", icon: AlertTriangle },
};

/* ============================================================
 * Mock Data
 * ============================================================ */
const INITIAL_WEBHOOKS: WebhookSubscription[] = [
  {
    id: "wh_001", name: "Slack Notifications", url: "https://hooks.slack.com/services/T0XXXX/B0XXXX/AbCdEfGh",
    secret: "whsec_abc123def456ghi789", status: "active",
    events: ["deal.won", "deal.lost", "deal.stage_changed", "ticket.sla_breached"],
    retryPolicy: { maxRetries: 3, backoffType: "exponential", initialDelay: 60 },
    headers: { "X-Custom-Source": "AI-CRM" },
    createdAt: "2025-11-01T10:00:00Z", updatedAt: "2026-02-15T14:30:00Z",
    lastTriggeredAt: "2026-03-03T09:45:00Z",
    successRate: 98.5, totalDeliveries: 1247, failedDeliveries: 19,
  },
  {
    id: "wh_002", name: "ERP Sync", url: "https://erp.company.vn/api/webhooks/crm",
    secret: "whsec_erp_sync_key_2026", status: "active",
    events: ["contact.created", "contact.updated", "deal.won", "invoice.paid", "contract.signed"],
    retryPolicy: { maxRetries: 5, backoffType: "exponential", initialDelay: 30 },
    headers: { "X-Source": "CRM", "X-Version": "2.0" },
    createdAt: "2025-12-15T08:00:00Z", updatedAt: "2026-01-20T16:00:00Z",
    lastTriggeredAt: "2026-03-03T08:12:00Z",
    successRate: 99.2, totalDeliveries: 3489, failedDeliveries: 28,
  },
  {
    id: "wh_003", name: "Marketing Automation", url: "https://marketing.company.vn/hooks/lead-events",
    secret: "whsec_mkt_auto_key", status: "failing",
    events: ["contact.created", "contact.updated", "ai.lead_scored"],
    retryPolicy: { maxRetries: 3, backoffType: "linear", initialDelay: 120 },
    headers: {},
    createdAt: "2026-01-10T09:00:00Z", updatedAt: "2026-03-01T11:00:00Z",
    lastTriggeredAt: "2026-03-02T23:15:00Z",
    successRate: 72.3, totalDeliveries: 856, failedDeliveries: 237,
  },
  {
    id: "wh_004", name: "Analytics Platform", url: "https://analytics.internal/ingest/crm-events",
    secret: "whsec_analytics_prod", status: "active",
    events: ["contact.created", "deal.created", "deal.won", "deal.lost", "activity.logged", "ticket.created", "ticket.resolved"],
    retryPolicy: { maxRetries: 2, backoffType: "linear", initialDelay: 60 },
    headers: { "X-Pipeline": "production" },
    createdAt: "2026-02-01T12:00:00Z", updatedAt: "2026-02-28T10:00:00Z",
    lastTriggeredAt: "2026-03-03T10:02:00Z",
    successRate: 99.8, totalDeliveries: 5632, failedDeliveries: 11,
  },
  {
    id: "wh_005", name: "Legacy CRM Backup", url: "https://old-crm.company.vn/sync/incoming",
    secret: "whsec_legacy_backup", status: "inactive",
    events: ["contact.created", "contact.updated", "deal.created"],
    retryPolicy: { maxRetries: 1, backoffType: "linear", initialDelay: 300 },
    headers: {},
    createdAt: "2025-06-01T10:00:00Z", updatedAt: "2026-01-05T09:00:00Z",
    lastTriggeredAt: "2026-01-05T08:45:00Z",
    successRate: 95.0, totalDeliveries: 2100, failedDeliveries: 105,
  },
];

const INITIAL_LOGS: DeliveryLog[] = [
  { id: "dl_01", webhookId: "wh_001", event: "deal.won", status: "success", statusCode: 200, requestPayload: '{"event":"deal.won","data":{"id":"dl_089","name":"Enterprise License - VNTech","amount":450000000}}', responseBody: '{"ok":true}', duration: 124, timestamp: "2026-03-03T09:45:00Z", attempt: 1, nextRetryAt: null },
  { id: "dl_02", webhookId: "wh_002", event: "invoice.paid", status: "success", statusCode: 200, requestPayload: '{"event":"invoice.paid","data":{"id":"inv_034","amount":125000000,"contact_id":"ct_012"}}', responseBody: '{"received":true,"erp_id":"ERP-2026-0341"}', duration: 312, timestamp: "2026-03-03T08:12:00Z", attempt: 1, nextRetryAt: null },
  { id: "dl_03", webhookId: "wh_003", event: "contact.created", status: "failed", statusCode: 502, requestPayload: '{"event":"contact.created","data":{"id":"ct_new_045","name":"Lê Hoàng Minh"}}', responseBody: "Bad Gateway", duration: 5023, timestamp: "2026-03-02T23:15:00Z", attempt: 3, nextRetryAt: null },
  { id: "dl_04", webhookId: "wh_003", event: "ai.lead_scored", status: "retrying", statusCode: 503, requestPayload: '{"event":"ai.lead_scored","data":{"contact_id":"ct_041","score":88}}', responseBody: "Service Unavailable", duration: 3012, timestamp: "2026-03-02T22:50:00Z", attempt: 2, nextRetryAt: "2026-03-03T00:50:00Z" },
  { id: "dl_05", webhookId: "wh_004", event: "deal.created", status: "success", statusCode: 200, requestPayload: '{"event":"deal.created","data":{"id":"dl_091","name":"Cloud Migration - FPT","amount":680000000}}', responseBody: '{"ingested":true}', duration: 89, timestamp: "2026-03-03T10:02:00Z", attempt: 1, nextRetryAt: null },
  { id: "dl_06", webhookId: "wh_001", event: "ticket.sla_breached", status: "success", statusCode: 200, requestPayload: '{"event":"ticket.sla_breached","data":{"id":"tk_078","subject":"Lỗi tích hợp SSO"}}', responseBody: '{"ok":true}', duration: 145, timestamp: "2026-03-03T07:30:00Z", attempt: 1, nextRetryAt: null },
  { id: "dl_07", webhookId: "wh_004", event: "activity.logged", status: "success", statusCode: 200, requestPayload: '{"event":"activity.logged","data":{"id":"act_201","type":"call","contact_id":"ct_005"}}', responseBody: '{"ingested":true}', duration: 67, timestamp: "2026-03-03T09:18:00Z", attempt: 1, nextRetryAt: null },
  { id: "dl_08", webhookId: "wh_002", event: "contact.updated", status: "success", statusCode: 200, requestPayload: '{"event":"contact.updated","data":{"id":"ct_003","changes":["email","phone"]}}', responseBody: '{"synced":true}', duration: 198, timestamp: "2026-03-03T07:55:00Z", attempt: 1, nextRetryAt: null },
  { id: "dl_09", webhookId: "wh_003", event: "contact.updated", status: "failed", statusCode: 504, requestPayload: '{"event":"contact.updated","data":{"id":"ct_028","changes":["lead_score"]}}', responseBody: "Gateway Timeout", duration: 30000, timestamp: "2026-03-02T21:00:00Z", attempt: 3, nextRetryAt: null },
  { id: "dl_10", webhookId: "wh_001", event: "deal.stage_changed", status: "success", statusCode: 200, requestPayload: '{"event":"deal.stage_changed","data":{"id":"dl_085","from":"proposal","to":"negotiation"}}', responseBody: '{"ok":true}', duration: 110, timestamp: "2026-03-03T06:45:00Z", attempt: 1, nextRetryAt: null },
];

/* ============================================================
 * Toggle Component
 * ============================================================ */
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button type="button" onClick={() => onChange(!checked)}
      className={`w-9 h-5 rounded-full transition-colors relative flex-shrink-0 ${checked ? "bg-violet-500" : "bg-gray-300"}`}>
      <span className={`w-3.5 h-3.5 bg-white rounded-full shadow-sm absolute top-[3px] left-[3px] transition-transform ${checked ? "translate-x-4" : ""}`} />
    </button>
  );
}

/* ============================================================
 * Delivery Status Badge
 * ============================================================ */
function StatusBadge({ status }: { status: DeliveryStatus }) {
  const map: Record<DeliveryStatus, { color: string; label: string }> = {
    success: { color: "bg-green-100 text-green-700", label: "Thành công" },
    failed: { color: "bg-red-100 text-red-700", label: "Thất bại" },
    pending: { color: "bg-gray-100 text-gray-600", label: "Chờ gửi" },
    retrying: { color: "bg-amber-100 text-amber-700", label: "Đang retry" },
  };
  const cfg = map[status];
  return <span className={`text-[8px] px-1.5 py-0.5 rounded ${cfg.color}`}>{cfg.label}</span>;
}

/* ============================================================
 * Webhook Card
 * ============================================================ */
function WebhookCard({
  webhook,
  onEdit,
  onDelete,
  onTest,
  onToggle,
  onViewLogs,
}: {
  webhook: WebhookSubscription;
  onEdit: () => void;
  onDelete: () => void;
  onTest: () => void;
  onToggle: () => void;
  onViewLogs: () => void;
}) {
  const statusCfg = STATUS_CONFIG[webhook.status];
  const StatusIcon = statusCfg.icon;

  return (
    <div className={`bg-white rounded-xl border p-4 transition-colors ${
      webhook.status === "failing" ? "border-red-200" : "border-gray-100 hover:border-violet-200"
    }`}>
      <div className="flex items-start gap-3">
        {/* Status Icon */}
        <div className={`w-10 h-10 rounded-xl ${statusCfg.bg} border flex items-center justify-center flex-shrink-0`}>
          <StatusIcon className={`w-5 h-5 ${statusCfg.color}`} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm text-gray-900">{webhook.name}</h3>
            <span className={`text-[8px] px-1.5 py-0.5 rounded ${statusCfg.bg} ${statusCfg.color}`}>{statusCfg.label}</span>
          </div>
          <p className="text-[10px] text-gray-400 font-mono mt-0.5 truncate">{webhook.url}</p>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="text-[9px] text-gray-400 flex items-center gap-1">
              <Zap className="w-3 h-3" /> {webhook.events.length} events
            </span>
            <span className="text-[9px] text-gray-400 flex items-center gap-1">
              <Send className="w-3 h-3" /> {webhook.totalDeliveries.toLocaleString()} gửi
            </span>
            <span className={`text-[9px] flex items-center gap-1 ${webhook.successRate >= 95 ? "text-green-500" : webhook.successRate >= 80 ? "text-amber-500" : "text-red-500"}`}>
              <Activity className="w-3 h-3" /> {webhook.successRate}%
            </span>
            {webhook.lastTriggeredAt && (
              <span className="text-[9px] text-gray-300 flex items-center gap-1">
                <Clock className="w-3 h-3" /> {new Date(webhook.lastTriggeredAt).toLocaleString("vi-VN")}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Toggle checked={webhook.status === "active"} onChange={onToggle} />
        </div>
      </div>

      {/* Events preview */}
      <div className="mt-3 flex flex-wrap gap-1">
        {webhook.events.slice(0, 4).map((evt) => (
          <span key={evt} className="text-[8px] px-1.5 py-0.5 bg-violet-50 text-violet-600 rounded font-mono">{evt}</span>
        ))}
        {webhook.events.length > 4 && (
          <span className="text-[8px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">+{webhook.events.length - 4}</span>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="mt-3 pt-3 border-t border-gray-50 flex items-center gap-2">
        <button type="button" onClick={onViewLogs}
          className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-gray-500 hover:bg-gray-50 rounded-lg">
          <Eye className="w-3 h-3" /> Delivery Logs
        </button>
        <button type="button" onClick={onTest}
          className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-green-600 hover:bg-green-50 rounded-lg">
          <Play className="w-3 h-3" /> Test
        </button>
        <div className="flex-1" />
        <button type="button" onClick={onEdit}
          className="p-1.5 text-gray-300 hover:text-violet-600">
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={onDelete}
          className="p-1.5 text-gray-300 hover:text-red-500">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

/* ============================================================
 * Webhook Editor Modal
 * ============================================================ */
function WebhookEditorModal({
  webhook,
  isNew,
  onSave,
  onClose,
}: {
  webhook: WebhookSubscription | null;
  isNew: boolean;
  onSave: (wh: WebhookSubscription) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<WebhookSubscription>(
    webhook ?? {
      id: `wh_${Date.now()}`,
      name: "",
      url: "",
      secret: `whsec_${Math.random().toString(36).slice(2, 18)}`,
      status: "active",
      events: [],
      retryPolicy: { maxRetries: 3, backoffType: "exponential", initialDelay: 60 },
      headers: {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastTriggeredAt: null,
      successRate: 100,
      totalDeliveries: 0,
      failedDeliveries: 0,
    },
  );

  const [headerKey, setHeaderKey] = useState("");
  const [headerVal, setHeaderVal] = useState("");

  const update = <K extends keyof WebhookSubscription>(k: K, v: WebhookSubscription[K]) =>
    setForm((p) => ({ ...p, [k]: v }));

  const toggleEvent = (key: string) => {
    setForm((p) => ({
      ...p,
      events: p.events.includes(key) ? p.events.filter((e) => e !== key) : [...p.events, key],
    }));
  };

  const addHeader = () => {
    if (!headerKey.trim()) return;
    update("headers", { ...form.headers, [headerKey.trim()]: headerVal.trim() });
    setHeaderKey("");
    setHeaderVal("");
  };

  const removeHeader = (key: string) => {
    const h = { ...form.headers };
    delete h[key];
    update("headers", h);
  };

  const handleSave = () => {
    if (!form.name.trim()) { toast.error("Tên webhook là bắt buộc"); return; }
    if (!form.url.trim()) { toast.error("URL endpoint là bắt buộc"); return; }
    if (form.events.length === 0) { toast.error("Chọn ít nhất 1 event"); return; }
    onSave({ ...form, updatedAt: new Date().toISOString() });
  };

  const eventsByCategory = useMemo(() => {
    const map = new Map<string, WebhookEvent[]>();
    WEBHOOK_EVENTS.forEach((e) => {
      const list = map.get(e.category) ?? [];
      list.push(e);
      map.set(e.category, list);
    });
    return map;
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">{isNew ? "Tạo Webhook mới" : `Chỉnh sửa: ${webhook?.name}`}</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Basic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 block mb-1">Tên Webhook *</label>
              <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="VD: Slack Notifications" />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Secret Key</label>
              <div className="flex items-center gap-1">
                <input type="text" value={form.secret} readOnly
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 font-mono text-gray-500" />
                <button type="button" onClick={() => { navigator.clipboard.writeText(form.secret); toast.success("Đã copy secret"); }}
                  className="p-2 text-gray-400 hover:text-violet-600"><Copy className="w-4 h-4" /></button>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">Endpoint URL *</label>
            <input type="url" value={form.url} onChange={(e) => update("url", e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="https://your-server.com/webhooks/crm" />
          </div>

          {/* Events */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs text-gray-500">Sự kiện đăng ký * ({form.events.length} đã chọn)</label>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => update("events", WEBHOOK_EVENTS.map((e) => e.key))}
                  className="text-[9px] text-violet-600 hover:underline">Chọn tất cả</button>
                <button type="button" onClick={() => update("events", [])}
                  className="text-[9px] text-gray-400 hover:underline">Bỏ chọn</button>
              </div>
            </div>
            <div className="space-y-2 max-h-[200px] overflow-y-auto border border-gray-200 rounded-lg p-3">
              {Array.from(eventsByCategory.entries()).map(([cat, events]) => (
                <div key={cat}>
                  <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-1">{cat}</p>
                  <div className="grid grid-cols-2 gap-1">
                    {events.map((evt) => (
                      <label key={evt.key} className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-xs transition-colors ${
                        form.events.includes(evt.key) ? "bg-violet-50 text-violet-700" : "text-gray-500 hover:bg-gray-50"
                      }`}>
                        <input type="checkbox" className="sr-only"
                          checked={form.events.includes(evt.key)} onChange={() => toggleEvent(evt.key)} />
                        <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center flex-shrink-0 ${
                          form.events.includes(evt.key) ? "border-violet-500 bg-violet-500" : "border-gray-300"
                        }`}>
                          {form.events.includes(evt.key) && <Check className="w-2.5 h-2.5 text-white" />}
                        </div>
                        <span className="font-mono text-[10px]">{evt.key}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Retry Policy */}
          <div>
            <label className="text-xs text-gray-500 block mb-2">Retry Policy</label>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Số lần retry</label>
                <select value={form.retryPolicy.maxRetries}
                  onChange={(e) => update("retryPolicy", { ...form.retryPolicy, maxRetries: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm">
                  {[0, 1, 2, 3, 5, 10].map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Backoff</label>
                <select value={form.retryPolicy.backoffType}
                  onChange={(e) => update("retryPolicy", { ...form.retryPolicy, backoffType: e.target.value as "linear" | "exponential" })}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm">
                  <option value="linear">Linear</option>
                  <option value="exponential">Exponential</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">Delay ban đầu (giây)</label>
                <input type="number" value={form.retryPolicy.initialDelay}
                  onChange={(e) => update("retryPolicy", { ...form.retryPolicy, initialDelay: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-sm" />
              </div>
            </div>
          </div>

          {/* Custom Headers */}
          <div>
            <label className="text-xs text-gray-500 block mb-2">Custom Headers</label>
            {Object.entries(form.headers).length > 0 && (
              <div className="space-y-1 mb-2">
                {Object.entries(form.headers).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-2 px-2.5 py-1.5 bg-gray-50 rounded-lg">
                    <code className="text-[10px] text-violet-600">{k}</code>
                    <span className="text-[10px] text-gray-300">:</span>
                    <code className="text-[10px] text-gray-600 flex-1">{v}</code>
                    <button type="button" onClick={() => removeHeader(k)} className="text-gray-300 hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <div className="flex gap-2">
              <input type="text" value={headerKey} onChange={(e) => setHeaderKey(e.target.value)}
                placeholder="Key" className="flex-1 px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs font-mono" />
              <input type="text" value={headerVal} onChange={(e) => setHeaderVal(e.target.value)}
                placeholder="Value" className="flex-1 px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs font-mono" />
              <button type="button" onClick={addHeader}
                className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200">
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg">Huỷ</button>
          <button type="button" onClick={handleSave}
            className="px-4 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700">
            {isNew ? "Tạo Webhook" : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Delivery Logs Modal
 * ============================================================ */
function DeliveryLogsModal({
  webhook,
  logs,
  onClose,
  onRetry,
}: {
  webhook: WebhookSubscription;
  logs: DeliveryLog[];
  onClose: () => void;
  onRetry: (logId: string) => void;
}) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] shadow-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <h3 className="text-gray-900">Delivery Logs — {webhook.name}</h3>
            <p className="text-xs text-gray-400 font-mono mt-0.5">{webhook.url}</p>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="p-8 text-center">
              <Send className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Chưa có delivery nào</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {logs.map((log) => (
                <div key={log.id}>
                  <button type="button" onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors">
                    {expandedId === log.id ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                    <StatusBadge status={log.status} />
                    <code className="text-[10px] text-violet-600 font-mono">{log.event}</code>
                    <span className="flex-1" />
                    {log.statusCode && (
                      <span className={`text-[9px] font-mono ${log.statusCode < 400 ? "text-green-500" : "text-red-500"}`}>{log.statusCode}</span>
                    )}
                    <span className="text-[9px] text-gray-400">{log.duration}ms</span>
                    {log.attempt > 1 && (
                      <span className="text-[8px] bg-amber-100 text-amber-600 px-1 py-0.5 rounded">retry #{log.attempt}</span>
                    )}
                    <span className="text-[9px] text-gray-300">{new Date(log.timestamp).toLocaleTimeString("vi-VN")}</span>
                  </button>

                  {expandedId === log.id && (
                    <div className="px-4 pb-3 space-y-2">
                      <div>
                        <p className="text-[9px] text-gray-400 mb-1">Request Payload</p>
                        <pre className="bg-gray-900 text-green-400 p-2.5 rounded-lg text-[10px] overflow-x-auto font-mono">
                          {JSON.stringify(JSON.parse(log.requestPayload), null, 2)}
                        </pre>
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-400 mb-1">Response</p>
                        <pre className={`p-2.5 rounded-lg text-[10px] overflow-x-auto font-mono ${
                          log.status === "success" ? "bg-green-900/10 text-green-700" : "bg-red-900/10 text-red-600"
                        }`}>
                          {log.responseBody}
                        </pre>
                      </div>
                      {log.status === "failed" && (
                        <button type="button" onClick={() => onRetry(log.id)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100">
                          <RotateCcw className="w-3 h-3" /> Retry thủ công
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Main Page
 * ============================================================ */
export function WebhookManagerPage() {
  const [webhooks, setWebhooks] = useState<WebhookSubscription[]>(INITIAL_WEBHOOKS);
  const [logs] = useState<DeliveryLog[]>(INITIAL_LOGS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<WebhookStatus | "all">("all");
  const [editingWh, setEditingWh] = useState<WebhookSubscription | null>(null);
  const [isNewWh, setIsNewWh] = useState(false);
  const [viewingLogsWh, setViewingLogsWh] = useState<WebhookSubscription | null>(null);
  const [testingId, setTestingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<WebhookSubscription | null>(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    let result = webhooks;
    if (statusFilter !== "all") result = result.filter((w) => w.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((w) => w.name.toLowerCase().includes(q) || w.url.toLowerCase().includes(q));
    }
    return result;
  }, [webhooks, statusFilter, search]);

  const stats = useMemo(() => ({
    total: webhooks.length,
    active: webhooks.filter((w) => w.status === "active").length,
    failing: webhooks.filter((w) => w.status === "failing").length,
    totalDeliveries: webhooks.reduce((s, w) => s + w.totalDeliveries, 0),
    totalFailed: webhooks.reduce((s, w) => s + w.failedDeliveries, 0),
    avgSuccess: webhooks.length > 0 ? (webhooks.reduce((s, w) => s + w.successRate, 0) / webhooks.length).toFixed(1) : "0",
    totalEvents: new Set(webhooks.flatMap((w) => w.events)).size,
  }), [webhooks]);

  const handleSave = useCallback((wh: WebhookSubscription) => {
    setWebhooks((prev) => {
      const exists = prev.find((w) => w.id === wh.id);
      return exists ? prev.map((w) => (w.id === wh.id ? wh : w)) : [...prev, wh];
    });
    setEditingWh(null);
    setIsNewWh(false);
    toast.success(isNewWh ? `Đã tạo webhook "${wh.name}"` : `Đã cập nhật "${wh.name}"`);
  }, [isNewWh]);

  const handleDelete = (id: string) => {
    setDeleting(true);
    setTimeout(() => {
      const wh = webhooks.find((w) => w.id === id);
      setWebhooks((prev) => prev.filter((w) => w.id !== id));
      toast.success(`Đã xoá webhook "${wh?.name}"`);
      setDeleteTarget(null);
      setDeleting(false);
    }, 400);
  };

  const handleToggle = (id: string) => {
    setWebhooks((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, status: w.status === "active" ? "inactive" : "active" } : w,
      ),
    );
  };

  const handleTest = (id: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      toast.success("Test webhook thành công — 200 OK (142ms)");
    }, 1200);
  };

  const handleRetry = (logId: string) => {
    toast.success("Đã gửi retry — đang chờ response...");
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <Webhook className="w-6 h-6 text-violet-600" /> Webhook Manager
        </h1>
        <p className="text-gray-500 mt-0.5">
          Quản lý webhook subscriptions, theo dõi delivery logs, cấu hình retry policy
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
        <div className="bg-white rounded-xl border border-gray-100 p-2.5 text-center">
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-[9px] text-gray-400">Webhooks</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{stats.active}</p>
          <p className="text-[9px] text-green-700">Hoạt động</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-2.5 text-center">
          <p className="text-lg text-red-600">{stats.failing}</p>
          <p className="text-[9px] text-red-700">Đang lỗi</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{stats.totalDeliveries.toLocaleString()}</p>
          <p className="text-[9px] text-blue-700">Tổng gửi</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-2.5 text-center">
          <p className="text-lg text-amber-600">{stats.totalFailed}</p>
          <p className="text-[9px] text-amber-700">Thất bại</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-2.5 text-center">
          <p className="text-lg text-violet-600">{stats.avgSuccess}%</p>
          <p className="text-[9px] text-violet-700">TB thành công</p>
        </div>
        <div className="bg-cyan-50 rounded-xl border border-cyan-200 p-2.5 text-center">
          <p className="text-lg text-cyan-600">{stats.totalEvents}</p>
          <p className="text-[9px] text-cyan-700">Events đăng ký</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[150px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Tìm webhook..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as WebhookStatus | "all")}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
          <option value="all">Tất cả trạng thái</option>
          <option value="active">Hoạt động</option>
          <option value="inactive">Tạm dừng</option>
          <option value="failing">Đang lỗi</option>
        </select>
        <button type="button" onClick={() => { setEditingWh(null); setIsNewWh(true); }}
          className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">
          <Plus className="w-4 h-4" /> Tạo Webhook
        </button>
      </div>

      {/* Webhook List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((wh) => (
          <WebhookCard
            key={wh.id}
            webhook={wh}
            onEdit={() => { setEditingWh(wh); setIsNewWh(false); }}
            onDelete={() => setDeleteTarget(wh)}
            onTest={() => handleTest(wh.id)}
            onToggle={() => handleToggle(wh.id)}
            onViewLogs={() => setViewingLogsWh(wh)}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <Webhook className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Chưa có webhook nào</p>
          <button type="button" onClick={() => { setEditingWh(null); setIsNewWh(true); }}
            className="mt-2 text-sm text-violet-600 hover:text-violet-700">+ Tạo webhook đầu tiên</button>
        </div>
      )}

      {/* Signature Verification Guide */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-amber-600" />
          <h4 className="text-sm text-gray-900">Xác minh chữ ký Webhook</h4>
        </div>
        <p className="text-xs text-gray-500 mb-3">
          Mỗi webhook request đều kèm header <code className="px-1 py-0.5 bg-gray-100 rounded text-[10px] font-mono">X-CRM-Signature</code> — 
          là HMAC-SHA256 của payload với secret key. Verify để đảm bảo request đến từ AI-CRM.
        </p>
        <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-[10px] overflow-x-auto font-mono leading-relaxed">
{`// Node.js verification example
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}`}
        </pre>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">Webhook Health Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <span>Webhook <strong>"Marketing Automation"</strong> có success rate <strong>72.3%</strong> — phần lớn lỗi 502/504. Kiểm tra server endpoint hoặc tăng timeout.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span><strong>"Analytics Platform"</strong> gửi <strong>5,632 events</strong> — recommend bật <strong>batch mode</strong> (gom 10 events/request) để giảm 90% HTTP calls.</span>
          </p>
          <p className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <span>Event <strong>"ai.anomaly_detected"</strong> chưa có webhook nào subscribe. Đề xuất thêm vào <strong>"Slack Notifications"</strong> để phát hiện bất thường kịp thời.</span>
          </p>
        </div>
      </div>

      {/* Editor Modal */}
      {(editingWh || isNewWh) && (
        <WebhookEditorModal
          webhook={editingWh}
          isNew={isNewWh}
          onSave={handleSave}
          onClose={() => { setEditingWh(null); setIsNewWh(false); }}
        />
      )}

      {/* Delivery Logs Modal */}
      {viewingLogsWh && (
        <DeliveryLogsModal
          webhook={viewingLogsWh}
          logs={logs.filter((l) => l.webhookId === viewingLogsWh.id)}
          onClose={() => setViewingLogsWh(null)}
          onRetry={handleRetry}
        />
      )}

      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => { if (deleteTarget) handleDelete(deleteTarget.id); }}
        itemName={deleteTarget?.name ?? ""}
        entityType="webhook"
        description="Hành động này không thể hoàn tác. Mọi delivery logs liên quan sẽ bị mất."
        loading={deleting}
      />
    </div>
  );
}