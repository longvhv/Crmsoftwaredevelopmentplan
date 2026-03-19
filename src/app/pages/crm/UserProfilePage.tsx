/**
 * User Profile & API Keys
 * Quản lý hồ sơ cá nhân, preferences, bảo mật 2FA,
 * quản lý API Keys, login sessions, và activity log.
 */
import { useState, useMemo } from "react";
import {
  User,
  Mail,
  Phone,
  Building2,
  Shield,
  Key,
  Plus,
  Trash2,
  Copy,
  Check,
  Eye,
  EyeOff,
  Clock,
  Globe,
  Palette,
  Bell,
  Lock,
  Smartphone,
  Monitor,
  Chrome,
  LogOut,
  Sparkles,
  Bot,
  AlertTriangle,
  Info,
  MapPin,
  Calendar,
  Camera,
  Pencil,
  Save,
  X,
  CheckCircle2,
  ShieldCheck,
  Fingerprint,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";

/* ============================================================
 * Types
 * ============================================================ */
interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  avatar: string;
  role: string;
  timezone: string;
  language: string;
  theme: "light" | "dark" | "auto";
  joinedAt: string;
  lastLogin: string;
  twoFactorEnabled: boolean;
}

interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  createdAt: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
  scopes: string[];
  status: "active" | "expired" | "revoked";
}

interface LoginSession {
  id: string;
  device: string;
  browser: string;
  ip: string;
  location: string;
  lastActive: string;
  current: boolean;
}

/* ============================================================
 * Constants & Mock Data
 * ============================================================ */
const INITIAL_PROFILE: UserProfile = {
  id: "usr_001",
  firstName: "Trần",
  lastName: "Đức Anh",
  email: "anh.tran@company.vn",
  phone: "+84 901 234 567",
  position: "CRM Admin",
  department: "Phòng Công nghệ",
  avatar: "",
  role: "Super Admin",
  timezone: "Asia/Ho_Chi_Minh (UTC+7)",
  language: "vi",
  theme: "light",
  joinedAt: "2025-06-15T08:00:00Z",
  lastLogin: "2026-03-03T08:45:00Z",
  twoFactorEnabled: true,
};

const INITIAL_API_KEYS: ApiKeyItem[] = [
  {
    id: "ak_001", name: "Production CRM Integration", prefix: "sk_live_Abc3xD",
    createdAt: "2025-12-01T10:00:00Z", lastUsedAt: "2026-03-03T09:30:00Z", expiresAt: "2027-12-01T10:00:00Z",
    scopes: ["contacts:read", "contacts:write", "deals:read", "deals:write", "reports:read"],
    status: "active",
  },
  {
    id: "ak_002", name: "Webhook Service", prefix: "sk_live_QrS7tU",
    createdAt: "2026-01-15T09:00:00Z", lastUsedAt: "2026-03-03T10:02:00Z", expiresAt: null,
    scopes: ["webhooks:*", "events:read"],
    status: "active",
  },
  {
    id: "ak_003", name: "Analytics Dashboard (Test)", prefix: "sk_test_Vw9xYz",
    createdAt: "2026-02-01T14:00:00Z", lastUsedAt: "2026-02-28T16:00:00Z", expiresAt: "2026-03-01T14:00:00Z",
    scopes: ["reports:read", "contacts:read"],
    status: "expired",
  },
  {
    id: "ak_004", name: "Old Mobile App", prefix: "sk_live_MnO1pQ",
    createdAt: "2025-08-01T10:00:00Z", lastUsedAt: "2025-11-15T12:00:00Z", expiresAt: null,
    scopes: ["contacts:read", "activities:write"],
    status: "revoked",
  },
];

const INITIAL_SESSIONS: LoginSession[] = [
  { id: "ss_01", device: "MacBook Pro", browser: "Chrome 122", ip: "113.161.xx.xx", location: "Hồ Chí Minh, VN", lastActive: "2026-03-03T10:15:00Z", current: true },
  { id: "ss_02", device: "iPhone 15 Pro", browser: "Safari Mobile", ip: "113.161.xx.xx", location: "Hồ Chí Minh, VN", lastActive: "2026-03-03T08:30:00Z", current: false },
  { id: "ss_03", device: "Windows PC", browser: "Edge 122", ip: "42.115.xx.xx", location: "Hà Nội, VN", lastActive: "2026-03-02T17:00:00Z", current: false },
];

const TIMEZONES = [
  "Asia/Ho_Chi_Minh (UTC+7)",
  "Asia/Bangkok (UTC+7)",
  "Asia/Tokyo (UTC+9)",
  "Asia/Singapore (UTC+8)",
  "America/New_York (UTC-5)",
  "Europe/London (UTC+0)",
];

const SCOPES = [
  "contacts:read", "contacts:write", "deals:read", "deals:write",
  "activities:read", "activities:write", "reports:read", "webhooks:*",
  "events:read", "users:read", "admin:*",
];

/* ============================================================
 * Tab type
 * ============================================================ */
type TabKey = "profile" | "security" | "api-keys" | "sessions";

/* ============================================================
 * Main Page
 * ============================================================ */
export function UserProfilePage() {
  const [tab, setTab] = useState<TabKey>("profile");
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [editing, setEditing] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(INITIAL_API_KEYS);
  const [sessions] = useState<LoginSession[]>(INITIAL_SESSIONS);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteKeyTarget, setDeleteKeyTarget] = useState<ApiKeyItem | null>(null);

  const handleSaveProfile = () => {
    setEditing(false);
    toast.success("Đã lưu hồ sơ cá nhân");
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
    toast.success("Đã copy!");
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys((prev) => prev.map((k) => (k.id === id ? { ...k, status: "revoked" as const } : k)));
    toast.success("Đã thu hồi API key");
  };

  const handleDeleteKey = (id: string) => {
    setApiKeys((prev) => prev.filter((k) => k.id !== id));
    toast.success("Đã xoá API key");
    setDeleteKeyTarget(null);
  };

  const handleCreateKey = (name: string, scopes: string[]) => {
    const newKey: ApiKeyItem = {
      id: `ak_${Date.now()}`, name, prefix: `sk_live_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(), lastUsedAt: null, expiresAt: null,
      scopes, status: "active",
    };
    setApiKeys((prev) => [newKey, ...prev]);
    setShowNewKeyModal(false);
    toast.success(`Đã tạo API key "${name}". Lưu ý: key đầy đủ chỉ hiển thị một lần!`);
  };

  const handleLogoutSession = (id: string) => {
    toast.success("Đã đăng xuất phiên");
  };

  const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { key: "profile", label: "Hồ sơ", icon: User },
    { key: "security", label: "Bảo mật", icon: Shield },
    { key: "api-keys", label: "API Keys", icon: Key },
    { key: "sessions", label: "Phiên đăng nhập", icon: Monitor },
  ];

  const activeKeys = apiKeys.filter((k) => k.status === "active").length;

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <User className="w-6 h-6 text-violet-600" /> Hồ sơ & API Keys
        </h1>
        <p className="text-gray-500 mt-0.5">
          Quản lý thông tin cá nhân, bảo mật, API keys, và phiên đăng nhập
        </p>
      </header>

      {/* Profile Header Card */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl flex-shrink-0 relative">
            {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
            <button type="button" className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow">
              <Camera className="w-3 h-3 text-violet-600" />
            </button>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg">{profile.firstName} {profile.lastName}</h2>
            <p className="text-violet-200 text-sm">{profile.position} — {profile.department}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-violet-200 flex-wrap">
              <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {profile.email}</span>
              <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {profile.phone}</span>
            </div>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-1">
            <span className="text-[9px] bg-white/20 px-2 py-1 rounded-full">{profile.role}</span>
            <span className="text-[9px] text-violet-200 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> Tham gia: {new Date(profile.joinedAt).toLocaleDateString("vi-VN")}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {tabs.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.key} type="button" onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm whitespace-nowrap relative transition-colors ${
                tab === t.key ? "text-violet-600" : "text-gray-400 hover:text-gray-600"
              }`}>
              <Icon className="w-4 h-4" /> {t.label}
              {tab === t.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-t" />}
            </button>
          );
        })}
      </div>

      {/* ==================== TAB: Profile ==================== */}
      {tab === "profile" && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm text-gray-900">Thông tin cá nhân</h3>
              {!editing ? (
                <button type="button" onClick={() => setEditing(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs text-violet-600 hover:bg-violet-50 rounded-lg border border-violet-200">
                  <Pencil className="w-3 h-3" /> Chỉnh sửa
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setEditing(false)}
                    className="px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-50 rounded-lg">Huỷ</button>
                  <button type="button" onClick={handleSaveProfile}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs bg-violet-600 text-white rounded-lg hover:bg-violet-700">
                    <Save className="w-3 h-3" /> Lưu
                  </button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Họ</label>
                <input type="text" value={profile.firstName} disabled={!editing}
                  onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-600" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Tên</label>
                <input type="text" value={profile.lastName} disabled={!editing}
                  onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-600" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Email</label>
                <input type="email" value={profile.email} disabled
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-600" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Số điện thoại</label>
                <input type="tel" value={profile.phone} disabled={!editing}
                  onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-600" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Chức vụ</label>
                <input type="text" value={profile.position} disabled={!editing}
                  onChange={(e) => setProfile((p) => ({ ...p, position: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-600" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Phòng ban</label>
                <input type="text" value={profile.department} disabled={!editing}
                  onChange={(e) => setProfile((p) => ({ ...p, department: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm disabled:bg-gray-50 disabled:text-gray-600" />
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm text-gray-900 mb-4">Tuỳ chọn hiển thị</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Múi giờ</label>
                <select value={profile.timezone}
                  onChange={(e) => setProfile((p) => ({ ...p, timezone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Ngôn ngữ</label>
                <select value={profile.language}
                  onChange={(e) => setProfile((p) => ({ ...p, language: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm">
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                  <option value="ja">日本語</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Giao diện</label>
                <div className="flex gap-2 mt-1">
                  {(["light", "dark", "auto"] as const).map((t) => (
                    <button key={t} type="button" onClick={() => setProfile((p) => ({ ...p, theme: t }))}
                      className={`flex-1 py-2 rounded-lg text-xs border transition-colors ${
                        profile.theme === t ? "border-violet-300 bg-violet-50 text-violet-700" : "border-gray-200 text-gray-500"
                      }`}>
                      {t === "light" ? "Sáng" : t === "dark" ? "Tối" : "Tự động"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB: Security ==================== */}
      {tab === "security" && (
        <div className="space-y-4">
          {/* 2FA */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  profile.twoFactorEnabled ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                }`}>
                  <Fingerprint className={`w-5 h-5 ${profile.twoFactorEnabled ? "text-green-600" : "text-red-500"}`} />
                </div>
                <div>
                  <h3 className="text-sm text-gray-900">Xác thực hai yếu tố (2FA)</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {profile.twoFactorEnabled
                      ? "Đang bật — tài khoản được bảo vệ bởi Google Authenticator"
                      : "Chưa bật — khuyến nghị bật để bảo vệ tài khoản"}
                  </p>
                </div>
              </div>
              <button type="button"
                onClick={() => {
                  setProfile((p) => ({ ...p, twoFactorEnabled: !p.twoFactorEnabled }));
                  toast.success(profile.twoFactorEnabled ? "Đã tắt 2FA" : "Đã bật 2FA");
                }}
                className={`px-4 py-2 rounded-lg text-xs ${
                  profile.twoFactorEnabled
                    ? "border border-red-200 text-red-600 hover:bg-red-50"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}>
                {profile.twoFactorEnabled ? "Tắt 2FA" : "Bật 2FA"}
              </button>
            </div>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm text-gray-900 mb-3">Đổi mật khẩu</h3>
            <div className="space-y-3 max-w-md">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Mật khẩu hiện tại</label>
                <input type="password" placeholder="••••••••"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Mật khẩu mới</label>
                <input type="password" placeholder="Tối thiểu 12 ký tự"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Xác nhận mật khẩu mới</label>
                <input type="password" placeholder="Nhập lại mật khẩu mới"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
              </div>
              <button type="button" onClick={() => toast.success("Đã đổi mật khẩu thành công")}
                className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">
                Cập nhật mật khẩu
              </button>
            </div>
          </div>

          {/* Security Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-green-50 rounded-xl border border-green-200 p-3 text-center">
              <ShieldCheck className="w-5 h-5 text-green-500 mx-auto mb-1" />
              <p className="text-xs text-green-700">2FA: Đang bật</p>
            </div>
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-3 text-center">
              <Clock className="w-5 h-5 text-blue-500 mx-auto mb-1" />
              <p className="text-xs text-blue-700">Đổi MK: 45 ngày trước</p>
            </div>
            <div className="bg-violet-50 rounded-xl border border-violet-200 p-3 text-center">
              <Key className="w-5 h-5 text-violet-500 mx-auto mb-1" />
              <p className="text-xs text-violet-700">{activeKeys} API keys</p>
            </div>
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-3 text-center">
              <Monitor className="w-5 h-5 text-amber-500 mx-auto mb-1" />
              <p className="text-xs text-amber-700">{sessions.length} phiên hoạt động</p>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB: API Keys ==================== */}
      {tab === "api-keys" && (
        <div className="space-y-4">
          {/* Key Warning */}
          <div className="bg-amber-50 rounded-xl border border-amber-200 p-3 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-amber-700">
              <p><strong>Bảo mật:</strong> API key chỉ hiển thị đầy đủ một lần khi tạo. Không chia sẻ key trong code công khai.</p>
              <p className="mt-0.5">Mỗi key nên có scope tối thiểu cần thiết theo nguyên tắc <strong>Least Privilege</strong>.</p>
            </div>
          </div>

          {/* Create Button */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">{apiKeys.length} API keys — {activeKeys} đang hoạt động</p>
            <button type="button" onClick={() => setShowNewKeyModal(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700">
              <Plus className="w-4 h-4" /> Tạo API Key
            </button>
          </div>

          {/* Keys List */}
          <div className="space-y-3">
            {apiKeys.map((key) => (
              <div key={key.id} className={`bg-white rounded-xl border p-4 ${
                key.status === "active" ? "border-gray-100" : "border-gray-100 opacity-60"
              }`}>
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    key.status === "active" ? "bg-green-50 border border-green-200" :
                    key.status === "expired" ? "bg-amber-50 border border-amber-200" :
                    "bg-gray-50 border border-gray-200"
                  }`}>
                    <Key className={`w-5 h-5 ${
                      key.status === "active" ? "text-green-600" :
                      key.status === "expired" ? "text-amber-500" : "text-gray-400"
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm text-gray-900">{key.name}</h4>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded ${
                        key.status === "active" ? "bg-green-100 text-green-600" :
                        key.status === "expired" ? "bg-amber-100 text-amber-600" :
                        "bg-gray-100 text-gray-500"
                      }`}>
                        {key.status === "active" ? "Hoạt động" : key.status === "expired" ? "Hết hạn" : "Đã thu hồi"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <code className="text-[10px] text-gray-500 font-mono bg-gray-50 px-1.5 py-0.5 rounded">{key.prefix}...••••••</code>
                      <button type="button" onClick={() => handleCopy(key.prefix + "...full_key_here", key.id)}
                        className="text-gray-300 hover:text-violet-600">
                        {copiedId === key.id ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-[9px] text-gray-400 flex-wrap">
                      <span>Tạo: {new Date(key.createdAt).toLocaleDateString("vi-VN")}</span>
                      {key.lastUsedAt && <span>Dùng lần cuối: {new Date(key.lastUsedAt).toLocaleDateString("vi-VN")}</span>}
                      {key.expiresAt && <span>Hết hạn: {new Date(key.expiresAt).toLocaleDateString("vi-VN")}</span>}
                    </div>
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {key.scopes.map((s) => (
                        <span key={s} className="text-[8px] px-1.5 py-0.5 bg-violet-50 text-violet-600 rounded font-mono">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {key.status === "active" && (
                      <button type="button" onClick={() => handleRevokeKey(key.id)}
                        className="px-2.5 py-1.5 text-[10px] text-red-500 hover:bg-red-50 rounded-lg border border-red-200">
                        Thu hồi
                      </button>
                    )}
                    {key.status !== "active" && (
                      <button type="button" onClick={() => setDeleteKeyTarget(key)}
                        className="p-1.5 text-gray-300 hover:text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== TAB: Sessions ==================== */}
      {tab === "sessions" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">{sessions.length} phiên đăng nhập</p>
            <button type="button" onClick={() => toast.success("Đã đăng xuất tất cả phiên khác")}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50">
              <LogOut className="w-3.5 h-3.5" /> Đăng xuất tất cả phiên khác
            </button>
          </div>

          <div className="space-y-3">
            {sessions.map((ss) => (
              <div key={ss.id} className={`bg-white rounded-xl border p-4 ${
                ss.current ? "border-violet-200 bg-violet-50/30" : "border-gray-100"
              }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    ss.current ? "bg-violet-100 border border-violet-200" : "bg-gray-50 border border-gray-200"
                  }`}>
                    {ss.device.includes("iPhone") ? <Smartphone className="w-5 h-5 text-gray-500" /> :
                     <Monitor className="w-5 h-5 text-gray-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm text-gray-900">{ss.device}</h4>
                      {ss.current && <span className="text-[8px] px-1.5 py-0.5 bg-green-100 text-green-600 rounded">Phiên hiện tại</span>}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-400 flex-wrap">
                      <span>{ss.browser}</span>
                      <span>{ss.ip}</span>
                      <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {ss.location}</span>
                      <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {new Date(ss.lastActive).toLocaleString("vi-VN")}</span>
                    </div>
                  </div>
                  {!ss.current && (
                    <button type="button" onClick={() => handleLogoutSession(ss.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-[10px] text-red-500 hover:bg-red-50 rounded-lg border border-red-200">
                      <LogOut className="w-3 h-3" /> Đăng xuất
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Security Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Security Score: 92/100</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>2FA đang bật, mật khẩu mạnh, không có phiên đăng nhập bất thường. <strong>Tài khoản an toàn.</strong></span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span>API key <strong>"Old Mobile App"</strong> đã bị thu hồi nhưng chưa xoá. Recommend <strong>xoá hoàn toàn</strong> để gọn hệ thống.</span>
          </p>
          <p className="flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <span>Mật khẩu đã <strong>45 ngày</strong> chưa đổi. Chính sách công ty khuyến nghị đổi mỗi <strong>90 ngày</strong>.</span>
          </p>
        </div>
      </div>

      {/* New API Key Modal */}
      {showNewKeyModal && (
        <NewApiKeyModal
          onClose={() => setShowNewKeyModal(false)}
          onCreate={handleCreateKey}
        />
      )}
      <ConfirmDeleteDialog
        open={!!deleteKeyTarget}
        onClose={() => setDeleteKeyTarget(null)}
        onConfirm={() => { if (deleteKeyTarget) handleDeleteKey(deleteKeyTarget.id); }}
        itemName={deleteKeyTarget?.name ?? ""}
        entityType="API key"
        description="Hành động này không thể hoàn tác. Key sẽ bị xoá vĩnh viễn khỏi hệ thống."
      />
    </div>
  );
}

/* ============================================================
 * New API Key Modal
 * ============================================================ */
function NewApiKeyModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (name: string, scopes: string[]) => void;
}) {
  const [name, setName] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>([]);

  const toggleScope = (scope: string) => {
    setSelectedScopes((prev) =>
      prev.includes(scope) ? prev.filter((s) => s !== scope) : [...prev, scope],
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Tạo API Key mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Tên API Key *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)}
              placeholder="VD: Mobile App Integration"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 block mb-2">Phạm vi quyền (Scopes) *</label>
            <div className="grid grid-cols-2 gap-1 max-h-[200px] overflow-y-auto border border-gray-200 rounded-lg p-2">
              {SCOPES.map((scope) => (
                <label key={scope} className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-xs ${
                  selectedScopes.includes(scope) ? "bg-violet-50 text-violet-700" : "text-gray-500 hover:bg-gray-50"
                }`}>
                  <input type="checkbox" className="sr-only"
                    checked={selectedScopes.includes(scope)} onChange={() => toggleScope(scope)} />
                  <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${
                    selectedScopes.includes(scope) ? "border-violet-500 bg-violet-500" : "border-gray-300"
                  }`}>
                    {selectedScopes.includes(scope) && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <code className="font-mono text-[10px]">{scope}</code>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 rounded-lg">Huỷ</button>
          <button type="button" disabled={!name.trim() || selectedScopes.length === 0}
            onClick={() => onCreate(name, selectedScopes)}
            className="px-4 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-30">
            Tạo Key
          </button>
        </div>
      </div>
    </div>
  );
}