/**
 * API Explorer / Developer Portal
 * Giao diện khám phá API mock với interactive playground.
 * Hiển thị endpoints, request/response schema, try-it-out,
 * authentication flow, rate limits, và code snippets.
 */
import { useState, useMemo, useCallback } from "react";
import {
  Code2,
  Search,
  Play,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Lock,
  Unlock,
  Zap,
  Clock,
  Server,
  Shield,
  BookOpen,
  Terminal,
  FileJson2,
  Send,
  Eye,
  Hash,
  AlertTriangle,
  Info,
  Sparkles,
  Bot,
  ExternalLink,
  Key,
  Gauge,
  ArrowRight,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface ApiParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
  example: string;
  in: "path" | "query" | "body" | "header";
}

interface ApiEndpoint {
  id: string;
  method: HttpMethod;
  path: string;
  summary: string;
  description: string;
  category: string;
  auth: boolean;
  rateLimit: string;
  params: ApiParam[];
  requestBody?: string;
  responseExample: string;
  responseCode: number;
  deprecated?: boolean;
}

/* ============================================================
 * Constants
 * ============================================================ */
const METHOD_COLORS: Record<HttpMethod, { bg: string; text: string; badge: string }> = {
  GET: { bg: "bg-green-50", text: "text-green-700", badge: "bg-green-500" },
  POST: { bg: "bg-blue-50", text: "text-blue-700", badge: "bg-blue-500" },
  PUT: { bg: "bg-amber-50", text: "text-amber-700", badge: "bg-amber-500" },
  PATCH: { bg: "bg-orange-50", text: "text-orange-700", badge: "bg-orange-500" },
  DELETE: { bg: "bg-red-50", text: "text-red-700", badge: "bg-red-500" },
};

const CATEGORIES = [
  { key: "contacts", label: "Liên hệ", count: 0 },
  { key: "deals", label: "Deals", count: 0 },
  { key: "companies", label: "Công ty", count: 0 },
  { key: "activities", label: "Hoạt động", count: 0 },
  { key: "tickets", label: "Tickets", count: 0 },
  { key: "products", label: "Sản phẩm", count: 0 },
  { key: "users", label: "Người dùng", count: 0 },
  { key: "workflows", label: "Workflows", count: 0 },
  { key: "reports", label: "Báo cáo", count: 0 },
  { key: "ai", label: "AI Services", count: 0 },
];

/* ============================================================
 * Mock Endpoints
 * ============================================================ */
const ENDPOINTS: ApiEndpoint[] = [
  // Contacts
  {
    id: "c1", method: "GET", path: "/api/v1/contacts", summary: "Danh sách liên hệ",
    description: "Trả về danh sách liên hệ có phân trang, hỗ trợ filter và sort. Tối đa 100 records/page.",
    category: "contacts", auth: true, rateLimit: "100/phút",
    params: [
      { name: "page", type: "integer", required: false, description: "Số trang (mặc định: 1)", example: "1", in: "query" },
      { name: "limit", type: "integer", required: false, description: "Số records/trang (tối đa 100)", example: "20", in: "query" },
      { name: "search", type: "string", required: false, description: "Tìm theo tên, email, phone", example: "Nguyễn", in: "query" },
      { name: "sort", type: "string", required: false, description: "Sắp xếp: created_at, name, lead_score", example: "-created_at", in: "query" },
      { name: "status", type: "string", required: false, description: "Filter: active, inactive, all", example: "active", in: "query" },
    ],
    responseExample: JSON.stringify({
      data: [
        { id: "ct_001", first_name: "Nguyễn", last_name: "Văn An", email: "an@company.vn", phone: "+84901234567", company: "TechCorp", lead_score: 85, status: "active", created_at: "2026-01-15T08:30:00Z" },
        { id: "ct_002", first_name: "Trần", last_name: "Thị Mai", email: "mai@startup.vn", phone: "+84912345678", company: "StartupXYZ", lead_score: 72, status: "active", created_at: "2026-02-01T10:00:00Z" },
      ],
      pagination: { page: 1, limit: 20, total: 1247, total_pages: 63 },
    }, null, 2),
    responseCode: 200,
  },
  {
    id: "c2", method: "GET", path: "/api/v1/contacts/{id}", summary: "Chi tiết liên hệ",
    description: "Lấy thông tin chi tiết của một liên hệ theo ID, bao gồm custom fields và activity history.",
    category: "contacts", auth: true, rateLimit: "200/phút",
    params: [
      { name: "id", type: "string", required: true, description: "ID của liên hệ", example: "ct_001", in: "path" },
      { name: "include", type: "string", required: false, description: "Bao gồm: activities, deals, notes", example: "activities,deals", in: "query" },
    ],
    responseExample: JSON.stringify({
      data: {
        id: "ct_001", first_name: "Nguyễn", last_name: "Văn An", email: "an@company.vn",
        phone: "+84901234567", company: { id: "cp_001", name: "TechCorp" },
        lead_score: 85, status: "active", tags: ["VIP", "Hot"],
        custom_fields: { industry: "Công nghệ", linkedin_url: "https://linkedin.com/in/an-nguyen" },
        activities: [{ id: "act_001", type: "email", subject: "Follow up Q1", date: "2026-03-01" }],
      },
    }, null, 2),
    responseCode: 200,
  },
  {
    id: "c3", method: "POST", path: "/api/v1/contacts", summary: "Tạo liên hệ mới",
    description: "Tạo một liên hệ mới. Trả về object vừa tạo kèm ID.",
    category: "contacts", auth: true, rateLimit: "50/phút",
    params: [
      { name: "first_name", type: "string", required: true, description: "Họ", example: "Lê", in: "body" },
      { name: "last_name", type: "string", required: true, description: "Tên", example: "Minh Đức", in: "body" },
      { name: "email", type: "string", required: true, description: "Email (unique)", example: "duc@company.vn", in: "body" },
      { name: "phone", type: "string", required: false, description: "Số điện thoại", example: "+84923456789", in: "body" },
      { name: "company_id", type: "string", required: false, description: "ID công ty", example: "cp_001", in: "body" },
      { name: "lead_source", type: "string", required: false, description: "Nguồn lead", example: "website", in: "body" },
    ],
    requestBody: JSON.stringify({
      first_name: "Lê", last_name: "Minh Đức", email: "duc@company.vn",
      phone: "+84923456789", company_id: "cp_001", lead_source: "website",
    }, null, 2),
    responseExample: JSON.stringify({
      data: { id: "ct_new_001", first_name: "Lê", last_name: "Minh Đức", email: "duc@company.vn", created_at: "2026-03-03T10:30:00Z" },
      message: "Liên hệ đã được tạo thành công",
    }, null, 2),
    responseCode: 201,
  },
  {
    id: "c4", method: "PUT", path: "/api/v1/contacts/{id}", summary: "Cập nhật liên hệ",
    description: "Cập nhật toàn bộ thông tin liên hệ (full replace). Dùng PATCH cho partial update.",
    category: "contacts", auth: true, rateLimit: "50/phút",
    params: [
      { name: "id", type: "string", required: true, description: "ID liên hệ", example: "ct_001", in: "path" },
    ],
    requestBody: JSON.stringify({ first_name: "Nguyễn", last_name: "Văn An", email: "an.updated@company.vn", lead_score: 90 }, null, 2),
    responseExample: JSON.stringify({ data: { id: "ct_001", updated_at: "2026-03-03T11:00:00Z" }, message: "Cập nhật thành công" }, null, 2),
    responseCode: 200,
  },
  {
    id: "c5", method: "DELETE", path: "/api/v1/contacts/{id}", summary: "Xoá liên hệ",
    description: "Soft-delete liên hệ. Có thể khôi phục trong 30 ngày. Yêu cầu quyền delete_contacts.",
    category: "contacts", auth: true, rateLimit: "20/phút",
    params: [{ name: "id", type: "string", required: true, description: "ID liên hệ", example: "ct_001", in: "path" }],
    responseExample: JSON.stringify({ message: "Đã xoá liên hệ. Có thể khôi phục trong 30 ngày.", deleted_at: "2026-03-03T12:00:00Z" }, null, 2),
    responseCode: 200,
  },

  // Deals
  {
    id: "d1", method: "GET", path: "/api/v1/deals", summary: "Danh sách deals",
    description: "Lấy danh sách deals với filter theo stage, owner, date range.",
    category: "deals", auth: true, rateLimit: "100/phút",
    params: [
      { name: "stage", type: "string", required: false, description: "Filter theo pipeline stage", example: "negotiation", in: "query" },
      { name: "owner_id", type: "string", required: false, description: "Filter theo owner", example: "usr_001", in: "query" },
      { name: "min_amount", type: "number", required: false, description: "Giá trị tối thiểu", example: "10000000", in: "query" },
    ],
    responseExample: JSON.stringify({
      data: [
        { id: "dl_001", name: "Enterprise License - TechCorp", amount: 500000000, stage: "negotiation", probability: 75, owner: "Phạm Thanh Tùng", close_date: "2026-04-15" },
      ],
      pagination: { page: 1, limit: 20, total: 89 },
    }, null, 2),
    responseCode: 200,
  },
  {
    id: "d2", method: "POST", path: "/api/v1/deals", summary: "Tạo deal mới",
    description: "Tạo deal mới trong pipeline. Tự động trigger workflow nếu có automation rules.",
    category: "deals", auth: true, rateLimit: "30/phút",
    params: [
      { name: "name", type: "string", required: true, description: "Tên deal", example: "Cloud Migration - StartupXYZ", in: "body" },
      { name: "amount", type: "number", required: true, description: "Giá trị deal (VND)", example: "250000000", in: "body" },
      { name: "stage", type: "string", required: false, description: "Stage ban đầu", example: "qualification", in: "body" },
      { name: "contact_id", type: "string", required: true, description: "ID liên hệ chính", example: "ct_002", in: "body" },
    ],
    requestBody: JSON.stringify({ name: "Cloud Migration - StartupXYZ", amount: 250000000, stage: "qualification", contact_id: "ct_002" }, null, 2),
    responseExample: JSON.stringify({ data: { id: "dl_new_001", name: "Cloud Migration - StartupXYZ", created_at: "2026-03-03T10:00:00Z" } }, null, 2),
    responseCode: 201,
  },
  {
    id: "d3", method: "PATCH", path: "/api/v1/deals/{id}/stage", summary: "Chuyển stage deal",
    description: "Chuyển deal sang stage mới. Trigger webhook và notification events.",
    category: "deals", auth: true, rateLimit: "50/phút",
    params: [
      { name: "id", type: "string", required: true, description: "ID deal", example: "dl_001", in: "path" },
      { name: "stage", type: "string", required: true, description: "Stage mới", example: "proposal", in: "body" },
      { name: "reason", type: "string", required: false, description: "Lý do chuyển", example: "Khách hàng đồng ý POC", in: "body" },
    ],
    requestBody: JSON.stringify({ stage: "proposal", reason: "Khách hàng đồng ý POC" }, null, 2),
    responseExample: JSON.stringify({ data: { id: "dl_001", stage: "proposal", previous_stage: "negotiation", moved_at: "2026-03-03T14:00:00Z" } }, null, 2),
    responseCode: 200,
  },

  // Activities
  {
    id: "a1", method: "POST", path: "/api/v1/activities", summary: "Log hoạt động",
    description: "Ghi lại hoạt động (call, email, meeting, note). Tự động liên kết với contact/deal.",
    category: "activities", auth: true, rateLimit: "100/phút",
    params: [
      { name: "type", type: "string", required: true, description: "Loại: call, email, meeting, note, task", example: "call", in: "body" },
      { name: "subject", type: "string", required: true, description: "Tiêu đề", example: "Follow-up call Q1", in: "body" },
      { name: "contact_id", type: "string", required: false, description: "ID liên hệ", example: "ct_001", in: "body" },
      { name: "deal_id", type: "string", required: false, description: "ID deal", example: "dl_001", in: "body" },
      { name: "duration_minutes", type: "integer", required: false, description: "Thời lượng (phút)", example: "15", in: "body" },
      { name: "notes", type: "string", required: false, description: "Ghi chú", example: "Khách hàng quan tâm gói Premium", in: "body" },
    ],
    requestBody: JSON.stringify({ type: "call", subject: "Follow-up call Q1", contact_id: "ct_001", deal_id: "dl_001", duration_minutes: 15, notes: "Khách hàng quan tâm gói Premium" }, null, 2),
    responseExample: JSON.stringify({ data: { id: "act_new_001", type: "call", created_at: "2026-03-03T15:00:00Z" } }, null, 2),
    responseCode: 201,
  },

  // Tickets
  {
    id: "t1", method: "GET", path: "/api/v1/tickets", summary: "Danh sách tickets",
    description: "Lấy danh sách ticket hỗ trợ. Filter theo status, priority, assignee.",
    category: "tickets", auth: true, rateLimit: "100/phút",
    params: [
      { name: "status", type: "string", required: false, description: "Filter: open, in_progress, resolved, closed", example: "open", in: "query" },
      { name: "priority", type: "string", required: false, description: "Filter: critical, high, medium, low", example: "high", in: "query" },
    ],
    responseExample: JSON.stringify({
      data: [{ id: "tk_001", subject: "Lỗi đăng nhập SSO", status: "open", priority: "critical", assignee: "Đỗ Hải Yến", sla_due: "2026-03-03T18:00:00Z" }],
      pagination: { total: 34 },
    }, null, 2),
    responseCode: 200,
  },

  // AI Services
  {
    id: "ai1", method: "POST", path: "/api/v1/ai/lead-score", summary: "AI Lead Scoring",
    description: "Tính điểm lead tự động bằng AI dựa trên hành vi, demographics, và interaction history.",
    category: "ai", auth: true, rateLimit: "30/phút",
    params: [
      { name: "contact_id", type: "string", required: true, description: "ID liên hệ cần score", example: "ct_001", in: "body" },
      { name: "model", type: "string", required: false, description: "Model: v1, v2, latest", example: "latest", in: "body" },
    ],
    requestBody: JSON.stringify({ contact_id: "ct_001", model: "latest" }, null, 2),
    responseExample: JSON.stringify({
      data: {
        contact_id: "ct_001", score: 85, confidence: 0.92, model_version: "v2.3",
        factors: [
          { name: "Engagement Score", weight: 0.35, value: 92 },
          { name: "Company Fit", weight: 0.25, value: 88 },
          { name: "Buying Intent", weight: 0.25, value: 78 },
          { name: "Recency", weight: 0.15, value: 85 },
        ],
        recommendation: "Hot lead — đề xuất liên hệ trong 24h",
      },
    }, null, 2),
    responseCode: 200,
  },
  {
    id: "ai2", method: "POST", path: "/api/v1/ai/email-draft", summary: "AI Email Draft",
    description: "Tạo nháp email tự động dựa trên context (contact info, deal stage, previous interactions).",
    category: "ai", auth: true, rateLimit: "20/phút",
    params: [
      { name: "contact_id", type: "string", required: true, description: "ID liên hệ", example: "ct_001", in: "body" },
      { name: "purpose", type: "string", required: true, description: "Mục đích: follow_up, proposal, intro, thank_you", example: "follow_up", in: "body" },
      { name: "tone", type: "string", required: false, description: "Giọng điệu: professional, friendly, urgent", example: "professional", in: "body" },
      { name: "language", type: "string", required: false, description: "Ngôn ngữ: vi, en", example: "vi", in: "body" },
    ],
    requestBody: JSON.stringify({ contact_id: "ct_001", purpose: "follow_up", tone: "professional", language: "vi" }, null, 2),
    responseExample: JSON.stringify({
      data: {
        subject: "Theo dõi cuộc họp ngày 01/03 — TechCorp × AI-CRM",
        body: "Kính gửi anh An,\n\nCảm ơn anh đã dành thời gian trao đổi về giải pháp CRM cho TechCorp...",
        estimated_open_rate: 0.68,
        ai_suggestions: ["Nên gửi trước 9:00 sáng", "Thêm case study của ngành Công nghệ"],
      },
    }, null, 2),
    responseCode: 200,
  },
  {
    id: "ai3", method: "POST", path: "/api/v1/ai/forecast", summary: "AI Revenue Forecast",
    description: "Dự báo doanh thu dựa trên pipeline hiện tại, historical data, và market trends.",
    category: "ai", auth: true, rateLimit: "10/phút",
    params: [
      { name: "period", type: "string", required: true, description: "Kỳ dự báo: quarter, month, year", example: "quarter", in: "body" },
      { name: "team_id", type: "string", required: false, description: "Filter theo team", example: "team_sales_01", in: "body" },
    ],
    requestBody: JSON.stringify({ period: "quarter", team_id: "team_sales_01" }, null, 2),
    responseExample: JSON.stringify({
      data: {
        period: "Q2/2026",
        forecast: { best_case: 12500000000, most_likely: 8700000000, worst_case: 5200000000 },
        confidence: 0.78,
        pipeline_health: "Tốt",
        risks: ["3 deals lớn chưa có next step trong 14 ngày", "Win rate tháng 2 giảm 5%"],
      },
    }, null, 2),
    responseCode: 200,
  },

  // Workflows
  {
    id: "w1", method: "POST", path: "/api/v1/workflows/{id}/trigger", summary: "Trigger workflow",
    description: "Kích hoạt workflow thủ công. Truyền context data cho các bước trong workflow.",
    category: "workflows", auth: true, rateLimit: "20/phút",
    params: [
      { name: "id", type: "string", required: true, description: "ID workflow", example: "wf_001", in: "path" },
      { name: "context", type: "object", required: true, description: "Dữ liệu context", example: '{"contact_id": "ct_001"}', in: "body" },
    ],
    requestBody: JSON.stringify({ context: { contact_id: "ct_001", deal_id: "dl_001", trigger_source: "manual" } }, null, 2),
    responseExample: JSON.stringify({ data: { execution_id: "exec_001", status: "running", started_at: "2026-03-03T10:00:00Z" } }, null, 2),
    responseCode: 202,
  },

  // Reports
  {
    id: "r1", method: "GET", path: "/api/v1/reports/sales-summary", summary: "Sales Summary Report",
    description: "Báo cáo tổng hợp doanh số: revenue, deals won/lost, conversion rate, top performers.",
    category: "reports", auth: true, rateLimit: "30/phút",
    params: [
      { name: "from", type: "date", required: true, description: "Ngày bắt đầu", example: "2026-01-01", in: "query" },
      { name: "to", type: "date", required: true, description: "Ngày kết thúc", example: "2026-03-31", in: "query" },
      { name: "group_by", type: "string", required: false, description: "Nhóm theo: day, week, month", example: "month", in: "query" },
    ],
    responseExample: JSON.stringify({
      data: {
        total_revenue: 8700000000, deals_won: 23, deals_lost: 8, conversion_rate: 0.742,
        by_month: [
          { month: "2026-01", revenue: 2100000000, deals: 7 },
          { month: "2026-02", revenue: 3200000000, deals: 9 },
          { month: "2026-03", revenue: 3400000000, deals: 7 },
        ],
        top_performers: [
          { name: "Phạm Thanh Tùng", revenue: 2800000000, deals: 8 },
          { name: "Vũ Minh Đức", revenue: 1900000000, deals: 6 },
        ],
      },
    }, null, 2),
    responseCode: 200,
  },

  // Users
  {
    id: "u1", method: "GET", path: "/api/v1/users/me", summary: "Thông tin user hiện tại",
    description: "Lấy thông tin profile, permissions, và preferences của user đang đăng nhập.",
    category: "users", auth: true, rateLimit: "200/phút",
    params: [],
    responseExample: JSON.stringify({
      data: {
        id: "usr_001", name: "Trần Đức Anh", email: "anh.tran@company.vn",
        role: "Admin", permissions: ["contacts:*", "deals:*", "reports:read"],
        preferences: { timezone: "Asia/Ho_Chi_Minh", language: "vi", theme: "light" },
      },
    }, null, 2),
    responseCode: 200,
  },
];

/* ============================================================
 * Code Snippet Generator
 * ============================================================ */
function generateSnippet(
  endpoint: ApiEndpoint,
  lang: "curl" | "javascript" | "python",
): string {
  const base = "https://api.crm.company.vn";

  if (lang === "curl") {
    let cmd = `curl -X ${endpoint.method} "${base}${endpoint.path}"`;
    cmd += `\n  -H "Authorization: Bearer YOUR_API_KEY"`;
    cmd += `\n  -H "Content-Type: application/json"`;
    if (endpoint.requestBody) {
      cmd += `\n  -d '${endpoint.requestBody.replace(/\n/g, "").replace(/  +/g, " ")}'`;
    }
    return cmd;
  }

  if (lang === "javascript") {
    const hasBody = endpoint.method !== "GET" && endpoint.requestBody;
    return `const response = await fetch("${base}${endpoint.path}", {
  method: "${endpoint.method}",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },${hasBody ? `\n  body: JSON.stringify(${endpoint.requestBody}),` : ""}
});
const data = await response.json();
console.log(data);`;
  }

  // Python
  const hasBody = endpoint.method !== "GET" && endpoint.requestBody;
  return `import requests

response = requests.${endpoint.method.toLowerCase()}(
    "${base}${endpoint.path}",
    headers={"Authorization": "Bearer YOUR_API_KEY"},${hasBody ? `\n    json=${endpoint.requestBody},` : ""}
)
data = response.json()
print(data)`;
}

/* ============================================================
 * Endpoint Detail Panel
 * ============================================================ */
function EndpointDetail({
  endpoint,
  onClose,
}: {
  endpoint: ApiEndpoint;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"params" | "response" | "code">("params");
  const [codeLang, setCodeLang] = useState<"curl" | "javascript" | "python">("curl");
  const [tryLoading, setTryLoading] = useState(false);
  const [tryResult, setTryResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const colors = METHOD_COLORS[endpoint.method];

  const handleTry = () => {
    setTryLoading(true);
    setTryResult(null);
    setTimeout(() => {
      setTryLoading(false);
      setTryResult(endpoint.responseExample);
      toast.success(`${endpoint.method} ${endpoint.path} — ${endpoint.responseCode} OK`);
    }, 800 + Math.random() * 700);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    toast.success("Đã copy!");
  };

  const pathParams = endpoint.params.filter((p) => p.in === "path");
  const queryParams = endpoint.params.filter((p) => p.in === "query");
  const bodyParams = endpoint.params.filter((p) => p.in === "body");

  const tabs = [
    { key: "params" as const, label: "Parameters", count: endpoint.params.length },
    { key: "response" as const, label: "Response", count: null },
    { key: "code" as const, label: "Code", count: null },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] shadow-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-xs text-white ${colors.badge}`}>{endpoint.method}</span>
              <code className="text-sm text-gray-800 font-mono">{endpoint.path}</code>
              {endpoint.auth && <Lock className="w-3.5 h-3.5 text-amber-500" />}
            </div>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
              <ChevronDown className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-gray-900">{endpoint.summary}</p>
          <p className="text-xs text-gray-400 mt-1">{endpoint.description}</p>
          <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
            <span className="flex items-center gap-1"><Gauge className="w-3 h-3" /> {endpoint.rateLimit}</span>
            <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> Bearer Token</span>
            <span className="flex items-center gap-1"><Server className="w-3 h-3" /> {endpoint.responseCode}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-4">
          {tabs.map((t) => (
            <button key={t.key} type="button" onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-sm relative transition-colors ${tab === t.key ? "text-violet-600" : "text-gray-400 hover:text-gray-600"}`}>
              {t.label}
              {t.count != null && <span className="ml-1 text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{t.count}</span>}
              {tab === t.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-t" />}
            </button>
          ))}
          <div className="flex-1" />
          <button type="button" onClick={handleTry} disabled={tryLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 my-1 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 disabled:opacity-50">
            {tryLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            Try it
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {tab === "params" && (
            <div className="space-y-4">
              {pathParams.length > 0 && (
                <div>
                  <h4 className="text-xs text-gray-500 mb-2">Path Parameters</h4>
                  {pathParams.map((p) => (
                    <ParamRow key={p.name} param={p} />
                  ))}
                </div>
              )}
              {queryParams.length > 0 && (
                <div>
                  <h4 className="text-xs text-gray-500 mb-2">Query Parameters</h4>
                  {queryParams.map((p) => (
                    <ParamRow key={p.name} param={p} />
                  ))}
                </div>
              )}
              {bodyParams.length > 0 && (
                <div>
                  <h4 className="text-xs text-gray-500 mb-2">Body Parameters</h4>
                  {bodyParams.map((p) => (
                    <ParamRow key={p.name} param={p} />
                  ))}
                </div>
              )}
              {endpoint.requestBody && (
                <div>
                  <h4 className="text-xs text-gray-500 mb-2">Request Body Example</h4>
                  <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs overflow-x-auto font-mono">{endpoint.requestBody}</pre>
                </div>
              )}
            </div>
          )}

          {tab === "response" && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">Response {endpoint.responseCode}</span>
              </div>
              <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto font-mono leading-relaxed max-h-[50vh]">
                {endpoint.responseExample}
              </pre>
            </div>
          )}

          {tab === "code" && (
            <div className="space-y-3">
              <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg w-fit">
                {(["curl", "javascript", "python"] as const).map((l) => (
                  <button key={l} type="button" onClick={() => setCodeLang(l)}
                    className={`px-3 py-1 rounded-md text-xs transition-colors ${codeLang === l ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
                    {l === "curl" ? "cURL" : l === "javascript" ? "JavaScript" : "Python"}
                  </button>
                ))}
              </div>
              <div className="relative">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto font-mono leading-relaxed">
                  {generateSnippet(endpoint, codeLang)}
                </pre>
                <button type="button" onClick={() => handleCopy(generateSnippet(endpoint, codeLang))}
                  className="absolute top-2 right-2 p-1.5 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600">
                  {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          )}

          {/* Try Result */}
          {tryResult && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                <span className="text-xs text-green-600">Mock Response — {endpoint.responseCode}</span>
                <span className="text-[9px] text-gray-400 ml-auto">~{(Math.random() * 200 + 50).toFixed(0)}ms</span>
              </div>
              <pre className="bg-gray-900 text-green-400 p-3 rounded-lg text-xs overflow-x-auto font-mono max-h-[30vh]">{tryResult}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ParamRow({ param }: { param: ApiParam }) {
  return (
    <div className="flex items-start gap-3 p-2.5 bg-gray-50 rounded-lg mb-1.5">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <code className="text-xs text-violet-700 font-mono">{param.name}</code>
          <span className="text-[8px] px-1 py-0.5 bg-gray-200 text-gray-500 rounded">{param.type}</span>
          <span className="text-[8px] px-1 py-0.5 bg-gray-200 text-gray-500 rounded">{param.in}</span>
          {param.required && <span className="text-[7px] px-1 py-0.5 bg-red-100 text-red-600 rounded">bắt buộc</span>}
        </div>
        <p className="text-[10px] text-gray-400 mt-0.5">{param.description}</p>
      </div>
      <code className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded font-mono flex-shrink-0">{param.example}</code>
    </div>
  );
}

/* ============================================================
 * Main Page
 * ============================================================ */
export function ApiExplorerPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | "all">("all");
  const [selectedMethod, setSelectedMethod] = useState<HttpMethod | "all">("all");
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint | null>(null);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const categoriesWithCount = useMemo(() =>
    CATEGORIES.map((c) => ({
      ...c,
      count: ENDPOINTS.filter((e) => e.category === c.key).length,
    })),
  []);

  const filtered = useMemo(() => {
    let result = ENDPOINTS;
    if (selectedCategory !== "all") {
      result = result.filter((e) => e.category === selectedCategory);
    }
    if (selectedMethod !== "all") {
      result = result.filter((e) => e.method === selectedMethod);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (e) => e.path.toLowerCase().includes(q) || e.summary.toLowerCase().includes(q) || e.description.toLowerCase().includes(q),
      );
    }
    return result;
  }, [selectedCategory, selectedMethod, search]);

  const grouped = useMemo(() => {
    const map = new Map<string, ApiEndpoint[]>();
    filtered.forEach((e) => {
      const list = map.get(e.category) ?? [];
      list.push(e);
      map.set(e.category, list);
    });
    return map;
  }, [filtered]);

  const stats = useMemo(() => ({
    total: ENDPOINTS.length,
    get: ENDPOINTS.filter((e) => e.method === "GET").length,
    post: ENDPOINTS.filter((e) => e.method === "POST").length,
    put: ENDPOINTS.filter((e) => e.method === "PUT").length,
    patch: ENDPOINTS.filter((e) => e.method === "PATCH").length,
    del: ENDPOINTS.filter((e) => e.method === "DELETE").length,
    categories: new Set(ENDPOINTS.map((e) => e.category)).size,
  }), []);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <Code2 className="w-6 h-6 text-violet-600" /> API Explorer
        </h1>
        <p className="text-gray-500 mt-0.5">
          Khám phá API endpoints, thử nghiệm trực tiếp, và tạo code snippets — Developer Portal
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
        <div className="bg-white rounded-xl border border-gray-100 p-2.5 text-center">
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-[9px] text-gray-400">Endpoints</p>
        </div>
        {(["GET", "POST", "PUT", "PATCH", "DELETE"] as const).map((m) => {
          const c = METHOD_COLORS[m];
          const count = m === "GET" ? stats.get : m === "POST" ? stats.post : m === "PUT" ? stats.put : m === "PATCH" ? stats.patch : stats.del;
          return (
            <div key={m} className={`${c.bg} rounded-xl border border-gray-100 p-2.5 text-center`}>
              <p className={`text-lg ${c.text}`}>{count}</p>
              <p className="text-[9px] text-gray-500">{m}</p>
            </div>
          );
        })}
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-2.5 text-center">
          <p className="text-lg text-violet-600">{stats.categories}</p>
          <p className="text-[9px] text-violet-700">Categories</p>
        </div>
      </div>

      {/* Auth Info */}
      <div className="bg-amber-50 rounded-xl border border-amber-200 p-3 flex items-start gap-3">
        <Key className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-amber-900">Xác thực API</p>
          <p className="text-xs text-amber-700 mt-0.5">
            Tất cả endpoints yêu cầu <code className="px-1 py-0.5 bg-amber-100 rounded text-[10px]">Authorization: Bearer YOUR_API_KEY</code>. 
            Tạo API key tại <span className="text-amber-900 underline cursor-pointer">Cấu hình → API Keys</span>. 
            Rate limit mặc định: 100 requests/phút. Môi trường hiện tại: <strong>Sandbox (Mock)</strong>.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[150px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Tìm endpoint, path, mô tả..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
            <option value="all">Tất cả ({ENDPOINTS.length})</option>
            {categoriesWithCount.filter((c) => c.count > 0).map((c) => (
              <option key={c.key} value={c.key}>{c.label} ({c.count})</option>
            ))}
          </select>
          <div className="flex items-center gap-0.5 bg-gray-100 p-0.5 rounded-lg">
            <button type="button" onClick={() => setSelectedMethod("all")}
              className={`px-2 py-1 rounded-md text-[10px] ${selectedMethod === "all" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>ALL</button>
            {(["GET", "POST", "PUT", "PATCH", "DELETE"] as const).map((m) => (
              <button key={m} type="button" onClick={() => setSelectedMethod(m)}
                className={`px-2 py-1 rounded-md text-[10px] ${selectedMethod === m ? `bg-white ${METHOD_COLORS[m].text} shadow-sm` : "text-gray-400"}`}>{m}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Endpoints */}
      <div className="space-y-4">
        {Array.from(grouped.entries()).map(([catKey, endpoints]) => {
          const cat = CATEGORIES.find((c) => c.key === catKey);
          if (!cat) return null;

          return (
            <div key={catKey} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-4 py-2.5 bg-gray-50 border-b border-gray-100">
                <span className="text-sm text-gray-800">{cat.label}</span>
                <span className="ml-2 text-[9px] bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full">{endpoints.length}</span>
              </div>
              <div className="divide-y divide-gray-50">
                {endpoints.map((ep) => {
                  const colors = METHOD_COLORS[ep.method];
                  return (
                    <button key={ep.id} type="button"
                      onClick={() => setSelectedEndpoint(ep)}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors`}>
                      <span className={`px-2 py-0.5 rounded text-[10px] text-white flex-shrink-0 ${colors.badge} min-w-[52px] text-center`}>
                        {ep.method}
                      </span>
                      <code className="text-xs text-gray-700 font-mono flex-shrink-0 hidden sm:block">{ep.path}</code>
                      <span className="text-xs text-gray-500 flex-1 truncate">{ep.summary}</span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {ep.auth && <Lock className="w-3 h-3 text-gray-300" />}
                        <span className="text-[8px] text-gray-300">{ep.rateLimit}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-300" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
            <Code2 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">Không tìm thấy endpoint nào</p>
          </div>
        )}
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">API Usage Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>Endpoint <strong>GET /contacts</strong> chiếm <strong>42% traffic</strong>. Gợi ý bật caching với TTL 60s để giảm tải database.</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span>AI Lead Scoring đang <strong>gần rate limit</strong> (28/30 req/phút). Cân nhắc nâng lên 50/phút hoặc implement queue.</span>
          </p>
          <p className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <span>Webhook endpoint chưa được thêm. Đề xuất tạo <strong>POST /webhooks</strong> để cho phép external systems subscribe events.</span>
          </p>
        </div>
      </div>

      {/* Endpoint Detail Modal */}
      {selectedEndpoint && (
        <EndpointDetail
          endpoint={selectedEndpoint}
          onClose={() => setSelectedEndpoint(null)}
        />
      )}
    </div>
  );
}
