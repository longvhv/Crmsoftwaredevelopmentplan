/**
 * Trust Center — Trung tâm Tin cậy & Bảo mật
 * Public-facing security posture, certifications,
 * sub-processors, incident history, SLA, data practices.
 */
import { useState } from "react";
import {
  Shield,
  ShieldCheck,
  Lock,
  Globe,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  Download,
  Sparkles,
  Bot,
  Server,
  Database,
  Eye,
  FileCheck2,
  Fingerprint,
  Scale,
  MapPin,
  Award,
  Zap,
  BarChart3,
  RefreshCw,
  HeartPulse,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
interface CertCard {
  name: string;
  icon: string;
  status: "active" | "in-progress" | "planned";
  validUntil: string | null;
  auditor: string | null;
  description: string;
  docUrl: string | null;
}

interface SubProcessor {
  name: string;
  purpose: string;
  dataTypes: string[];
  location: string;
  dpaUrl: string;
}

interface Incident {
  id: string;
  date: string;
  title: string;
  severity: "critical" | "major" | "minor";
  status: "resolved" | "monitoring";
  affectedServices: string[];
  resolution: string;
  duration: string;
}

interface DataPractice {
  category: string;
  icon: typeof Shield;
  practices: { name: string; description: string; status: "implemented" | "planned" }[];
}

/* ============================================================
 * Mock Data
 * ============================================================ */
const MOCK_CERTS: CertCard[] = [
  { name: "SOC 2 Type II", icon: "🔒", status: "active", validUntil: "2026-09-30", auditor: "Deloitte", description: "Security, Availability, Confidentiality — kiểm toán hàng năm", docUrl: "#" },
  { name: "ISO 27001:2022", icon: "📋", status: "in-progress", validUntil: null, auditor: "BSI Group", description: "Hệ thống quản lý an ninh thông tin quốc tế", docUrl: null },
  { name: "GDPR Compliant", icon: "🇪🇺", status: "active", validUntil: "2027-01-15", auditor: "EY Vietnam", description: "Tuân thủ Quy định Bảo vệ Dữ liệu Chung Châu Âu", docUrl: "#" },
  { name: "CCPA Compliant", icon: "🇺🇸", status: "active", validUntil: "2026-12-01", auditor: "PwC", description: "California Consumer Privacy Act compliance", docUrl: "#" },
  { name: "HIPAA", icon: "🏥", status: "planned", validUntil: null, auditor: null, description: "Health Insurance Portability and Accountability Act — dự kiến Q4 2026", docUrl: null },
  { name: "PCI DSS Level 1", icon: "💳", status: "planned", validUntil: null, auditor: null, description: "Payment Card Industry Data Security Standard — dự kiến Q1 2027", docUrl: null },
];

const MOCK_PROCESSORS: SubProcessor[] = [
  { name: "Amazon Web Services (AWS)", purpose: "Cloud Infrastructure & Hosting", dataTypes: ["Tất cả dữ liệu CRM"], location: "Singapore, Frankfurt, Virginia", dpaUrl: "#" },
  { name: "Supabase", purpose: "Database & Authentication", dataTypes: ["User accounts", "CRM data"], location: "Singapore", dpaUrl: "#" },
  { name: "Stripe", purpose: "Payment Processing", dataTypes: ["Billing data", "Payment methods"], location: "US, EU", dpaUrl: "#" },
  { name: "SendGrid (Twilio)", purpose: "Email Delivery", dataTypes: ["Email addresses", "Email content"], location: "US", dpaUrl: "#" },
  { name: "OpenAI", purpose: "AI Features (GPT-4o)", dataTypes: ["Processed text (no PII)"], location: "US", dpaUrl: "#" },
  { name: "Datadog", purpose: "Monitoring & Observability", dataTypes: ["Application logs (anonymized)"], location: "US, EU", dpaUrl: "#" },
  { name: "Sentry", purpose: "Error Tracking", dataTypes: ["Error logs (no PII)"], location: "US", dpaUrl: "#" },
];

const MOCK_INCIDENTS: Incident[] = [
  { id: "inc_001", date: "2026-02-15", title: "API Latency Degradation — US East Region", severity: "major", status: "resolved", affectedServices: ["API", "Dashboard"], resolution: "Database connection pool exhaustion — increased pool size and added circuit breaker", duration: "47 phút" },
  { id: "inc_002", date: "2026-01-28", title: "Scheduled Maintenance — Database Migration", severity: "minor", status: "resolved", affectedServices: ["All Services"], resolution: "Planned maintenance for database schema optimization — zero data loss", duration: "2 giờ (dự kiến)" },
  { id: "inc_003", date: "2025-12-10", title: "Email Delivery Delay", severity: "minor", status: "resolved", affectedServices: ["Email"], resolution: "SendGrid rate limiting — implemented queue management and retry logic", duration: "1.5 giờ" },
  { id: "inc_004", date: "2025-11-05", title: "Authentication Service Outage", severity: "critical", status: "resolved", affectedServices: ["Login", "API Auth"], resolution: "JWT signing key rotation failure — implemented automated key rotation with rollback", duration: "23 phút" },
];

const MOCK_PRACTICES: DataPractice[] = [
  {
    category: "Mã hoá & Bảo mật Dữ liệu",
    icon: Lock,
    practices: [
      { name: "Encryption at Rest (AES-256)", description: "Toàn bộ dữ liệu mã hoá AES-256 trên disk", status: "implemented" },
      { name: "Encryption in Transit (TLS 1.3)", description: "Tất cả kết nối sử dụng TLS 1.3", status: "implemented" },
      { name: "Field-level Encryption", description: "Mã hoá riêng cho PII: email, phone, CCCD", status: "implemented" },
      { name: "Key Management (AWS KMS)", description: "Quản lý khoá tập trung, rotation tự động 90 ngày", status: "implemented" },
    ],
  },
  {
    category: "Kiểm soát Truy cập",
    icon: Fingerprint,
    practices: [
      { name: "Multi-Factor Authentication (MFA)", description: "MFA bắt buộc cho tất cả tài khoản", status: "implemented" },
      { name: "Role-Based Access Control (RBAC)", description: "Phân quyền chi tiết theo vai trò", status: "implemented" },
      { name: "Single Sign-On (SSO)", description: "SAML 2.0 / OIDC cho enterprise", status: "implemented" },
      { name: "Zero Trust Network", description: "Zero trust architecture cho tất cả services", status: "planned" },
    ],
  },
  {
    category: "Quyền riêng tư Dữ liệu",
    icon: Eye,
    practices: [
      { name: "Data Minimization", description: "Chỉ thu thập dữ liệu cần thiết", status: "implemented" },
      { name: "Right to Erasure", description: "Quy trình xoá dữ liệu tự động khi nhận yêu cầu", status: "implemented" },
      { name: "Data Portability", description: "Export dữ liệu khách hàng JSON/CSV", status: "implemented" },
      { name: "Consent Management", description: "Quản lý đồng ý chi tiết theo kênh", status: "implemented" },
    ],
  },
  {
    category: "Giám sát & Ứng phó",
    icon: HeartPulse,
    practices: [
      { name: "24/7 Security Monitoring", description: "SIEM + AI anomaly detection liên tục", status: "implemented" },
      { name: "Penetration Testing", description: "Pentest hàng quý bởi vendor bên ngoài", status: "implemented" },
      { name: "Bug Bounty Program", description: "Chương trình bug bounty với HackerOne", status: "planned" },
      { name: "Incident Response Plan", description: "Quy trình phản ứng sự cố < 15 phút", status: "implemented" },
    ],
  },
];

const SEVERITY_CFG: Record<string, { label: string; color: string; bg: string }> = {
  critical: { label: "Nghiêm trọng", color: "text-red-600", bg: "bg-red-50 border-red-200" },
  major: { label: "Lớn", color: "text-orange-600", bg: "bg-orange-50 border-orange-200" },
  minor: { label: "Nhỏ", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
};

type Tab = "overview" | "certifications" | "subprocessors" | "incidents" | "practices";

/* ============================================================
 * Component
 * ============================================================ */
export function TrustCenterPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  const uptime = 99.97;
  const avgResponseTime = 145;
  const incidentFreedays = 16;

  const tabs: { key: Tab; label: string }[] = [
    { key: "overview", label: "Tổng quan" },
    { key: "certifications", label: "Chứng chỉ" },
    { key: "practices", label: "Bảo mật" },
    { key: "subprocessors", label: "Sub-processors" },
    { key: "incidents", label: "Sự cố" },
  ];

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-green-600" /> Trust Center
          </h1>
          <p className="text-gray-500 mt-0.5">Trung tâm Tin cậy — bảo mật, chứng chỉ, quyền riêng tư, SLA, sự cố</p>
        </div>
        <div className="flex items-center gap-2 self-start">
          <button type="button" onClick={() => toast.success("Đã tải Security Whitepaper")}
            className="flex items-center gap-1 px-3 py-2 border border-gray-200 text-gray-600 rounded-lg text-sm hover:bg-gray-50">
            <Download className="w-4 h-4" /> Whitepaper
          </button>
          <button type="button" onClick={() => toast.success("Đã gửi yêu cầu Security Assessment")}
            className="flex items-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700">
            <FileCheck2 className="w-4 h-4" /> Yêu cầu Assessment
          </button>
        </div>
      </header>

      {/* Hero stats */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-5">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-3xl text-green-600">{uptime}%</p>
            <p className="text-[9px] text-green-700 mt-0.5">Uptime (12 tháng)</p>
          </div>
          <div>
            <p className="text-3xl text-blue-600">{avgResponseTime}ms</p>
            <p className="text-[9px] text-blue-700 mt-0.5">API Response Time (p50)</p>
          </div>
          <div>
            <p className="text-3xl text-violet-600">{MOCK_CERTS.filter((c) => c.status === "active").length}</p>
            <p className="text-[9px] text-violet-700 mt-0.5">Chứng chỉ Active</p>
          </div>
          <div>
            <p className="text-3xl text-emerald-600">{incidentFreedays}</p>
            <p className="text-[9px] text-emerald-700 mt-0.5">Ngày không sự cố</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
              activeTab === t.key ? "bg-green-600 text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* === Overview Tab === */}
      {activeTab === "overview" && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {MOCK_CERTS.slice(0, 6).map((cert) => (
              <div key={cert.name} className="bg-white rounded-xl border border-gray-100 p-3 text-center">
                <span className="text-2xl">{cert.icon}</span>
                <p className="text-[10px] text-gray-900 mt-1">{cert.name}</p>
                <span className={`inline-block text-[7px] mt-0.5 px-1.5 py-0.5 rounded ${
                  cert.status === "active" ? "bg-green-100 text-green-600" :
                  cert.status === "in-progress" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"
                }`}>{cert.status === "active" ? "✓ Active" : cert.status === "in-progress" ? "⏳ Triển khai" : "📋 Planned"}</span>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm text-gray-900 mb-2">Cam kết Bảo mật</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[9px] text-gray-600">
              {[
                "✅ Mã hoá AES-256 at rest & TLS 1.3 in transit",
                "✅ MFA bắt buộc cho tất cả tài khoản",
                "✅ RBAC chi tiết với audit trail",
                "✅ SSO (SAML 2.0 / OIDC) cho Enterprise",
                "✅ Data residency: chọn region lưu trữ",
                "✅ Backup tự động mỗi giờ, PITR 30 ngày",
                "✅ Pentest hàng quý bởi vendor độc lập",
                "✅ Monitoring & alerting 24/7 (SIEM + AI)",
              ].map((item) => (
                <p key={item} className="flex items-center gap-1">{item}</p>
              ))}
            </div>
          </div>
        </>
      )}

      {/* === Certifications Tab === */}
      {activeTab === "certifications" && (
        <div className="space-y-3">
          {MOCK_CERTS.map((cert) => (
            <div key={cert.name} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{cert.icon}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-900">{cert.name}</span>
                    <span className={`text-[7px] px-1.5 py-0.5 rounded border ${
                      cert.status === "active" ? "bg-green-50 text-green-600 border-green-200" :
                      cert.status === "in-progress" ? "bg-blue-50 text-blue-600 border-blue-200" :
                      "bg-gray-50 text-gray-400 border-gray-200"
                    }`}>{cert.status === "active" ? "✓ Active" : cert.status === "in-progress" ? "⏳ Đang triển khai" : "📋 Planned"}</span>
                  </div>
                  <p className="text-[9px] text-gray-500 mt-0.5">{cert.description}</p>
                  <div className="text-[8px] text-gray-400 mt-1">
                    {cert.auditor && <span>Auditor: {cert.auditor}</span>}
                    {cert.validUntil && <span> • Hết hạn: {cert.validUntil}</span>}
                  </div>
                </div>
                {cert.docUrl && (
                  <button type="button" onClick={() => toast.success(`Tải chứng chỉ ${cert.name}`)}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-[9px] border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 flex-shrink-0">
                    <Download className="w-3 h-3" /> Tải về
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === Practices Tab === */}
      {activeTab === "practices" && (
        <div className="space-y-4">
          {MOCK_PRACTICES.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.category} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Icon className="w-5 h-5 text-green-600" />
                  <h3 className="text-sm text-gray-900">{cat.category}</h3>
                </div>
                <div className="space-y-2">
                  {cat.practices.map((p) => (
                    <div key={p.name} className="flex items-start gap-2">
                      {p.status === "implemented" ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Clock className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <span className="text-[10px] text-gray-700">{p.name}</span>
                        <p className="text-[8px] text-gray-400">{p.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === Sub-processors Tab === */}
      {activeTab === "subprocessors" && (
        <div className="space-y-2">
          <p className="text-[9px] text-gray-400">Cập nhật lần cuối: 03/03/2026. Chúng tôi thông báo thay đổi sub-processor trước 30 ngày.</p>
          {MOCK_PROCESSORS.map((sp) => (
            <div key={sp.name} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-900">{sp.name}</span>
                  </div>
                  <p className="text-[9px] text-gray-500 mt-0.5">{sp.purpose}</p>
                  <div className="flex items-center gap-3 mt-1 text-[8px] text-gray-400">
                    <span>📍 {sp.location}</span>
                    <span>📦 {sp.dataTypes.join(", ")}</span>
                  </div>
                </div>
                <button type="button" onClick={() => toast.success(`Xem DPA của ${sp.name}`)}
                  className="text-[9px] text-blue-600 hover:text-blue-800 flex-shrink-0">
                  <span className="flex items-center gap-0.5">DPA <ExternalLink className="w-3 h-3" /></span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === Incidents Tab === */}
      {activeTab === "incidents" && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-xl border border-green-200">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-700">Tất cả hệ thống hoạt động bình thường — {incidentFreedays} ngày không sự cố</p>
          </div>
          {MOCK_INCIDENTS.map((inc) => {
            const sev = SEVERITY_CFG[inc.severity];
            return (
              <div key={inc.id} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[8px] text-gray-400">{inc.date}</span>
                  <span className={`text-[7px] px-1.5 py-0.5 rounded border ${sev.bg} ${sev.color}`}>{sev.label}</span>
                  <span className="text-[7px] px-1.5 py-0.5 bg-green-50 text-green-600 rounded border border-green-200">Đã giải quyết</span>
                </div>
                <h4 className="text-sm text-gray-900">{inc.title}</h4>
                <p className="text-[9px] text-gray-500 mt-0.5">{inc.resolution}</p>
                <div className="flex items-center gap-3 mt-1 text-[8px] text-gray-400">
                  <span>⏱️ Thời gian: {inc.duration}</span>
                  <span>🔧 Ảnh hưởng: {inc.affectedServices.join(", ")}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* AI Security Status */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-green-600" />
          <h4 className="text-sm text-green-900">AI Security Status</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-green-800">
          <p className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Tất cả <strong>AI features</strong> chạy qua <strong>guardrails</strong>: PII masking, toxicity filter, hallucination detection. Không có PII nào gửi tới LLM providers — dữ liệu được anonymize trước khi xử lý.</span>
          </p>
          <p className="flex items-start gap-2">
            <Database className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <span>Data residency: khách hàng <strong>tự chọn region</strong> lưu trữ (Singapore, Frankfurt, Virginia). Dữ liệu <strong>không bao giờ rời khỏi region</strong> đã chọn, kể cả trong AI processing (sử dụng local models cho sensitive data).</span>
          </p>
          <p className="flex items-start gap-2">
            <Award className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>Security questionnaire <strong>auto-responder</strong> đã trả lời <strong>48 questionnaires</strong> trong Q1 2026 (SIG, CAIQ, custom). Thời gian phản hồi trung bình: <strong>2.3 ngày</strong> (trước đây: 2 tuần). Accuracy: <strong>97%</strong>.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
