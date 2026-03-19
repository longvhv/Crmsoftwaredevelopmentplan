/**
 * Trang Role-Based Access Control (RBAC)
 * Quản lý phân quyền chi tiết: vai trò, permission matrix, field-level security,
 * user-role assignment, role hierarchy, AI suggestions.
 * Phase 1: Mock data + interactive matrix + full CRUD UI.
 */
import { useState, useMemo, useCallback } from "react";
import {
  Shield,
  Search,
  Plus,
  X,
  Check,
  Minus,
  Eye,
  Pencil,
  Trash2,
  Users,
  Lock,
  Unlock,
  ChevronDown,
  ChevronRight,
  Crown,
  Bot,
  Sparkles,
  Copy,
  Settings,
  AlertTriangle,
  Info,
  UserCheck,
  ShieldCheck,
  ShieldAlert,
  Key,
  Layers,
  ToggleLeft,
  ToggleRight,
  FileText,
  Building2,
  Contact2,
  Kanban,
  Ticket,
  BarChart3,
  Mail,
  Calendar,
  DollarSign,
  Package,
  Megaphone,
  Headphones,
  Database,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
type PermissionAction = "view" | "create" | "edit" | "delete" | "export" | "bulk";
type PermissionLevel = "full" | "own" | "team" | "none";

interface RolePermission {
  entity: string;
  actions: Record<PermissionAction, PermissionLevel>;
}

interface FieldPermission {
  entity: string;
  field: string;
  fieldLabel: string;
  access: "visible" | "read-only" | "hidden";
}

interface Role {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  level: number; // hierarchy level (0 = highest)
  isSystem: boolean; // system roles can't be deleted
  userCount: number;
  permissions: RolePermission[];
  fieldPermissions: FieldPermission[];
  createdAt: string;
  updatedAt: string;
}

interface UserAssignment {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  department: string;
  lastActive: string;
}

/* ============================================================
 * Constants
 * ============================================================ */
const PERMISSION_ACTIONS: { key: PermissionAction; label: string; icon: string }[] = [
  { key: "view", label: "Xem", icon: "👁️" },
  { key: "create", label: "Tạo", icon: "➕" },
  { key: "edit", label: "Sửa", icon: "✏️" },
  { key: "delete", label: "Xoá", icon: "🗑️" },
  { key: "export", label: "Xuất", icon: "📤" },
  { key: "bulk", label: "Hàng loạt", icon: "📋" },
];

const PERMISSION_LEVELS: { key: PermissionLevel; label: string; color: string; short: string }[] = [
  { key: "full", label: "Toàn quyền", color: "bg-green-100 text-green-700", short: "✓" },
  { key: "own", label: "Chỉ của mình", color: "bg-blue-100 text-blue-700", short: "◉" },
  { key: "team", label: "Trong nhóm", color: "bg-amber-100 text-amber-700", short: "◎" },
  { key: "none", label: "Không có", color: "bg-gray-100 text-gray-400", short: "—" },
];

const ENTITIES: { key: string; label: string; iconName: string }[] = [
  { key: "contacts", label: "Liên hệ", iconName: "contact" },
  { key: "deals", label: "Deals", iconName: "kanban" },
  { key: "companies", label: "Công ty", iconName: "building" },
  { key: "activities", label: "Hoạt động", iconName: "calendar" },
  { key: "tickets", label: "Ticket hỗ trợ", iconName: "ticket" },
  { key: "products", label: "Sản phẩm", iconName: "package" },
  { key: "quotations", label: "Báo giá", iconName: "file" },
  { key: "contracts", label: "Hợp đồng", iconName: "file" },
  { key: "campaigns", label: "Chiến dịch", iconName: "megaphone" },
  { key: "reports", label: "Báo cáo", iconName: "chart" },
  { key: "emails", label: "Email", iconName: "mail" },
  { key: "commissions", label: "Hoa hồng", iconName: "dollar" },
  { key: "settings", label: "Cấu hình hệ thống", iconName: "settings" },
  { key: "users", label: "Quản lý người dùng", iconName: "users" },
];

function makePermissions(
  overrides: Partial<Record<string, Partial<Record<PermissionAction, PermissionLevel>>>> = {},
  defaultLevel: PermissionLevel = "none",
): RolePermission[] {
  return ENTITIES.map((e) => ({
    entity: e.key,
    actions: {
      view: overrides[e.key]?.view ?? defaultLevel,
      create: overrides[e.key]?.create ?? defaultLevel,
      edit: overrides[e.key]?.edit ?? defaultLevel,
      delete: overrides[e.key]?.delete ?? defaultLevel,
      export: overrides[e.key]?.export ?? defaultLevel,
      bulk: overrides[e.key]?.bulk ?? defaultLevel,
    },
  }));
}

/* ============================================================
 * Mock Data
 * ============================================================ */
const INITIAL_ROLES: Role[] = [
  {
    id: "r1",
    name: "Super Admin",
    description: "Toàn quyền hệ thống. Quản lý mọi cấu hình, người dùng, và dữ liệu.",
    icon: "👑",
    color: "bg-red-500",
    level: 0,
    isSystem: true,
    userCount: 2,
    permissions: makePermissions({}, "full"),
    fieldPermissions: [],
    createdAt: "2025-01-15",
    updatedAt: "2026-03-01",
  },
  {
    id: "r2",
    name: "Admin",
    description: "Quản trị hệ thống, không thể xoá Super Admin hoặc thay đổi quyền Super Admin.",
    icon: "🛡️",
    color: "bg-orange-500",
    level: 1,
    isSystem: true,
    userCount: 3,
    permissions: makePermissions(
      {
        settings: { view: "full", create: "full", edit: "full", delete: "none", export: "full", bulk: "full" },
        users: { view: "full", create: "full", edit: "full", delete: "none", export: "full", bulk: "full" },
      },
      "full",
    ),
    fieldPermissions: [],
    createdAt: "2025-01-15",
    updatedAt: "2026-02-28",
  },
  {
    id: "r3",
    name: "Sales Manager",
    description: "Quản lý team sales: xem toàn bộ deals/contacts của team, quản lý pipeline, xem báo cáo.",
    icon: "📊",
    color: "bg-blue-500",
    level: 2,
    isSystem: true,
    userCount: 5,
    permissions: makePermissions({
      contacts: { view: "full", create: "full", edit: "full", delete: "team", export: "full", bulk: "full" },
      deals: { view: "full", create: "full", edit: "full", delete: "team", export: "full", bulk: "full" },
      companies: { view: "full", create: "full", edit: "full", delete: "team", export: "full", bulk: "full" },
      activities: { view: "full", create: "full", edit: "full", delete: "team", export: "full", bulk: "full" },
      products: { view: "full", create: "none", edit: "none", delete: "none", export: "full", bulk: "none" },
      quotations: { view: "full", create: "full", edit: "full", delete: "team", export: "full", bulk: "full" },
      contracts: { view: "full", create: "full", edit: "full", delete: "none", export: "full", bulk: "none" },
      campaigns: { view: "full", create: "none", edit: "none", delete: "none", export: "full", bulk: "none" },
      reports: { view: "full", create: "full", edit: "own", delete: "own", export: "full", bulk: "none" },
      emails: { view: "team", create: "full", edit: "own", delete: "own", export: "team", bulk: "full" },
      commissions: { view: "team", create: "none", edit: "none", delete: "none", export: "team", bulk: "none" },
      tickets: { view: "team", create: "full", edit: "team", delete: "none", export: "team", bulk: "none" },
      settings: { view: "none", create: "none", edit: "none", delete: "none", export: "none", bulk: "none" },
      users: { view: "team", create: "none", edit: "none", delete: "none", export: "none", bulk: "none" },
    }),
    fieldPermissions: [
      { entity: "commissions", field: "amount", fieldLabel: "Số tiền hoa hồng", access: "read-only" },
      { entity: "contacts", field: "ssn", fieldLabel: "Số CMND/CCCD", access: "hidden" },
    ],
    createdAt: "2025-02-01",
    updatedAt: "2026-03-02",
  },
  {
    id: "r4",
    name: "Sales Rep",
    description: "Nhân viên bán hàng: quản lý contacts/deals của mình, tạo báo giá, log activities.",
    icon: "💼",
    color: "bg-green-500",
    level: 3,
    isSystem: true,
    userCount: 15,
    permissions: makePermissions({
      contacts: { view: "own", create: "full", edit: "own", delete: "none", export: "own", bulk: "none" },
      deals: { view: "own", create: "full", edit: "own", delete: "none", export: "own", bulk: "none" },
      companies: { view: "full", create: "full", edit: "own", delete: "none", export: "none", bulk: "none" },
      activities: { view: "own", create: "full", edit: "own", delete: "own", export: "none", bulk: "none" },
      products: { view: "full", create: "none", edit: "none", delete: "none", export: "none", bulk: "none" },
      quotations: { view: "own", create: "full", edit: "own", delete: "own", export: "own", bulk: "none" },
      contracts: { view: "own", create: "none", edit: "none", delete: "none", export: "own", bulk: "none" },
      campaigns: { view: "full", create: "none", edit: "none", delete: "none", export: "none", bulk: "none" },
      reports: { view: "own", create: "none", edit: "none", delete: "none", export: "own", bulk: "none" },
      emails: { view: "own", create: "full", edit: "own", delete: "own", export: "none", bulk: "none" },
      commissions: { view: "own", create: "none", edit: "none", delete: "none", export: "none", bulk: "none" },
      tickets: { view: "own", create: "full", edit: "own", delete: "none", export: "none", bulk: "none" },
      settings: { view: "none", create: "none", edit: "none", delete: "none", export: "none", bulk: "none" },
      users: { view: "none", create: "none", edit: "none", delete: "none", export: "none", bulk: "none" },
    }),
    fieldPermissions: [
      { entity: "commissions", field: "amount", fieldLabel: "Số tiền hoa hồng", access: "read-only" },
      { entity: "contacts", field: "ssn", fieldLabel: "Số CMND/CCCD", access: "hidden" },
      { entity: "deals", field: "margin", fieldLabel: "Biên lợi nhuận", access: "hidden" },
    ],
    createdAt: "2025-02-01",
    updatedAt: "2026-03-01",
  },
  {
    id: "r5",
    name: "CS Agent",
    description: "Nhân viên chăm sóc khách hàng: quản lý tickets, xem contacts, log activities.",
    icon: "🎧",
    color: "bg-cyan-500",
    level: 3,
    isSystem: true,
    userCount: 8,
    permissions: makePermissions({
      contacts: { view: "full", create: "full", edit: "full", delete: "none", export: "none", bulk: "none" },
      deals: { view: "full", create: "none", edit: "none", delete: "none", export: "none", bulk: "none" },
      companies: { view: "full", create: "none", edit: "none", delete: "none", export: "none", bulk: "none" },
      activities: { view: "full", create: "full", edit: "own", delete: "own", export: "none", bulk: "none" },
      tickets: { view: "full", create: "full", edit: "full", delete: "none", export: "full", bulk: "full" },
      products: { view: "full", create: "none", edit: "none", delete: "none", export: "none", bulk: "none" },
      emails: { view: "own", create: "full", edit: "own", delete: "own", export: "none", bulk: "none" },
      reports: { view: "own", create: "none", edit: "none", delete: "none", export: "own", bulk: "none" },
    }),
    fieldPermissions: [
      { entity: "contacts", field: "ssn", fieldLabel: "Số CMND/CCCD", access: "hidden" },
      { entity: "deals", field: "amount", fieldLabel: "Giá trị deal", access: "read-only" },
    ],
    createdAt: "2025-03-01",
    updatedAt: "2026-02-15",
  },
  {
    id: "r6",
    name: "Marketing",
    description: "Nhân viên marketing: quản lý chiến dịch, xem contacts để segmentation, analytics.",
    icon: "📢",
    color: "bg-pink-500",
    level: 3,
    isSystem: false,
    userCount: 4,
    permissions: makePermissions({
      contacts: { view: "full", create: "none", edit: "none", delete: "none", export: "full", bulk: "none" },
      deals: { view: "full", create: "none", edit: "none", delete: "none", export: "none", bulk: "none" },
      companies: { view: "full", create: "none", edit: "none", delete: "none", export: "full", bulk: "none" },
      campaigns: { view: "full", create: "full", edit: "full", delete: "own", export: "full", bulk: "full" },
      emails: { view: "own", create: "full", edit: "own", delete: "own", export: "full", bulk: "full" },
      reports: { view: "full", create: "full", edit: "own", delete: "own", export: "full", bulk: "none" },
      activities: { view: "own", create: "full", edit: "own", delete: "own", export: "none", bulk: "none" },
    }),
    fieldPermissions: [
      { entity: "contacts", field: "ssn", fieldLabel: "Số CMND/CCCD", access: "hidden" },
      { entity: "contacts", field: "phone", fieldLabel: "Số điện thoại", access: "hidden" },
    ],
    createdAt: "2025-04-01",
    updatedAt: "2026-02-20",
  },
  {
    id: "r7",
    name: "Viewer",
    description: "Chỉ xem dữ liệu, không thể tạo, sửa, hoặc xoá bất kỳ thứ gì.",
    icon: "👀",
    color: "bg-gray-400",
    level: 4,
    isSystem: true,
    userCount: 10,
    permissions: makePermissions({
      contacts: { view: "full" },
      deals: { view: "full" },
      companies: { view: "full" },
      activities: { view: "full" },
      tickets: { view: "full" },
      products: { view: "full" },
      reports: { view: "full" },
      campaigns: { view: "full" },
    }),
    fieldPermissions: [
      { entity: "contacts", field: "ssn", fieldLabel: "Số CMND/CCCD", access: "hidden" },
      { entity: "commissions", field: "amount", fieldLabel: "Số tiền hoa hồng", access: "hidden" },
      { entity: "deals", field: "margin", fieldLabel: "Biên lợi nhuận", access: "hidden" },
    ],
    createdAt: "2025-02-01",
    updatedAt: "2026-01-15",
  },
  {
    id: "r8",
    name: "AI Agent",
    description: "Tài khoản cho AI Agents (BDR, CS, Analyst). Quyền tự động hoá, không truy cập settings.",
    icon: "🤖",
    color: "bg-violet-500",
    level: 3,
    isSystem: true,
    userCount: 4,
    permissions: makePermissions({
      contacts: { view: "full", create: "full", edit: "full", delete: "none", export: "none", bulk: "full" },
      deals: { view: "full", create: "full", edit: "full", delete: "none", export: "none", bulk: "full" },
      companies: { view: "full", create: "full", edit: "full", delete: "none", export: "none", bulk: "full" },
      activities: { view: "full", create: "full", edit: "full", delete: "none", export: "none", bulk: "full" },
      emails: { view: "full", create: "full", edit: "full", delete: "none", export: "none", bulk: "full" },
      tickets: { view: "full", create: "full", edit: "full", delete: "none", export: "none", bulk: "full" },
      reports: { view: "full", create: "full", edit: "own", delete: "own", export: "full", bulk: "none" },
    }),
    fieldPermissions: [
      { entity: "contacts", field: "ssn", fieldLabel: "Số CMND/CCCD", access: "hidden" },
    ],
    createdAt: "2025-06-01",
    updatedAt: "2026-03-01",
  },
];

const USER_ASSIGNMENTS: UserAssignment[] = [
  { id: "u1", name: "Trần Đức Anh", email: "anh.tran@company.vn", avatar: "TA", role: "Super Admin", department: "IT", lastActive: "2026-03-03T10:00:00" },
  { id: "u2", name: "Hoàng Thị Mai", email: "mai.hoang@company.vn", avatar: "HM", role: "Super Admin", department: "Management", lastActive: "2026-03-03T09:45:00" },
  { id: "u3", name: "Nguyễn Văn An", email: "an.nguyen@company.vn", avatar: "NA", role: "Admin", department: "IT", lastActive: "2026-03-03T10:15:00" },
  { id: "u4", name: "Phạm Thanh Tùng", email: "tung.pham@company.vn", avatar: "PT", role: "Sales Manager", department: "Sales", lastActive: "2026-03-03T09:30:00" },
  { id: "u5", name: "Lê Thị Hương", email: "huong.le@company.vn", avatar: "LH", role: "Sales Manager", department: "Sales", lastActive: "2026-03-02T17:00:00" },
  { id: "u6", name: "Vũ Minh Đức", email: "duc.vu@company.vn", avatar: "VD", role: "Sales Rep", department: "Sales", lastActive: "2026-03-03T10:20:00" },
  { id: "u7", name: "Đỗ Hải Yến", email: "yen.do@company.vn", avatar: "DY", role: "CS Agent", department: "Support", lastActive: "2026-03-03T08:45:00" },
  { id: "u8", name: "Bùi Quang Huy", email: "huy.bui@company.vn", avatar: "BH", role: "Marketing", department: "Marketing", lastActive: "2026-03-02T16:30:00" },
  { id: "u9", name: "AI BDR Agent", email: "ai-bdr@system", avatar: "🤖", role: "AI Agent", department: "AI", lastActive: "2026-03-03T10:25:00" },
  { id: "u10", name: "AI CS Agent", email: "ai-cs@system", avatar: "🤖", role: "AI Agent", department: "AI", lastActive: "2026-03-03T10:25:00" },
  { id: "u11", name: "Trịnh Văn Long", email: "long.trinh@company.vn", avatar: "TL", role: "Viewer", department: "Board", lastActive: "2026-02-28T14:00:00" },
  { id: "u12", name: "Ngô Bích Ngọc", email: "ngoc.ngo@company.vn", avatar: "NN", role: "Sales Rep", department: "Sales", lastActive: "2026-03-03T09:00:00" },
];

/* ============================================================
 * Permission Cell
 * ============================================================ */
function PermCell({
  level,
  onChange,
  editable,
}: {
  level: PermissionLevel;
  onChange: (l: PermissionLevel) => void;
  editable: boolean;
}) {
  const cfg = PERMISSION_LEVELS.find((p) => p.key === level)!;
  const cycle: PermissionLevel[] = ["full", "own", "team", "none"];

  const handleClick = () => {
    if (!editable) return;
    const idx = cycle.indexOf(level);
    onChange(cycle[(idx + 1) % cycle.length]);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!editable}
      className={`w-8 h-8 rounded-md text-xs flex items-center justify-center transition-colors ${cfg.color} ${editable ? "cursor-pointer hover:ring-2 hover:ring-violet-300" : "cursor-default opacity-70"}`}
      title={cfg.label}
    >
      {cfg.short}
    </button>
  );
}

/* ============================================================
 * Permission Matrix Tab
 * ============================================================ */
function PermissionMatrix({
  role,
  editable,
  onPermissionChange,
}: {
  role: Role;
  editable: boolean;
  onPermissionChange: (entity: string, action: PermissionAction, level: PermissionLevel) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left py-2 px-3 text-xs text-gray-500 sticky left-0 bg-white min-w-[140px]">Entity</th>
            {PERMISSION_ACTIONS.map((a) => (
              <th key={a.key} className="py-2 px-1 text-center text-xs text-gray-500 min-w-[50px]">
                <span className="block text-[10px]">{a.icon}</span>
                {a.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ENTITIES.map((entity) => {
            const perm = role.permissions.find((p) => p.entity === entity.key);
            return (
              <tr key={entity.key} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-2 px-3 text-xs text-gray-700 sticky left-0 bg-white">
                  {entity.label}
                </td>
                {PERMISSION_ACTIONS.map((action) => (
                  <td key={action.key} className="py-2 px-1 text-center">
                    <div className="flex justify-center">
                      <PermCell
                        level={perm?.actions[action.key] ?? "none"}
                        editable={editable}
                        onChange={(l) => onPermissionChange(entity.key, action.key, l)}
                      />
                    </div>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ============================================================
 * Field Permission Tab
 * ============================================================ */
function FieldPermissionList({
  fieldPermissions,
  onAccessChange,
  editable,
}: {
  fieldPermissions: FieldPermission[];
  onAccessChange: (idx: number, access: FieldPermission["access"]) => void;
  editable: boolean;
}) {
  const accessOptions: { key: FieldPermission["access"]; label: string; color: string }[] = [
    { key: "visible", label: "Hiển thị", color: "bg-green-100 text-green-700" },
    { key: "read-only", label: "Chỉ đọc", color: "bg-amber-100 text-amber-700" },
    { key: "hidden", label: "Ẩn", color: "bg-red-100 text-red-700" },
  ];

  if (fieldPermissions.length === 0) {
    return (
      <div className="text-center py-6 text-gray-400">
        <Lock className="w-6 h-6 mx-auto mb-2 opacity-40" />
        <p className="text-sm">Chưa có quy tắc bảo mật cấp trường nào.</p>
        <p className="text-xs mt-1">Mặc định tất cả trường đều hiển thị cho vai trò này.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {fieldPermissions.map((fp, idx) => {
        const entityLabel = ENTITIES.find((e) => e.key === fp.entity)?.label ?? fp.entity;
        return (
          <div key={`${fp.entity}-${fp.field}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="text-sm text-gray-900">{fp.fieldLabel}</p>
              <p className="text-[10px] text-gray-400">{entityLabel} → {fp.field}</p>
            </div>
            <div className="flex items-center gap-1">
              {accessOptions.map((opt) => (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => editable && onAccessChange(idx, opt.key)}
                  disabled={!editable}
                  className={`px-2 py-1 rounded text-[10px] transition-colors ${
                    fp.access === opt.key
                      ? `${opt.color} ring-1 ring-current`
                      : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                  } ${!editable ? "cursor-default" : "cursor-pointer"}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============================================================
 * Role Detail Modal
 * ============================================================ */
function RoleDetailModal({
  role,
  onClose,
  onSave,
}: {
  role: Role;
  onClose: () => void;
  onSave: (role: Role) => void;
}) {
  const [tab, setTab] = useState<"permissions" | "fields" | "users">("permissions");
  const [editingRole, setEditingRole] = useState<Role>({ ...role });
  const [editing, setEditing] = useState(false);

  const roleUsers = USER_ASSIGNMENTS.filter((u) => u.role === role.name);

  const handlePermissionChange = useCallback(
    (entity: string, action: PermissionAction, level: PermissionLevel) => {
      setEditingRole((prev) => ({
        ...prev,
        permissions: prev.permissions.map((p) =>
          p.entity === entity ? { ...p, actions: { ...p.actions, [action]: level } } : p,
        ),
      }));
    },
    [],
  );

  const handleFieldAccessChange = useCallback(
    (idx: number, access: FieldPermission["access"]) => {
      setEditingRole((prev) => ({
        ...prev,
        fieldPermissions: prev.fieldPermissions.map((fp, i) =>
          i === idx ? { ...fp, access } : fp,
        ),
      }));
    },
    [],
  );

  const handleSave = () => {
    onSave(editingRole);
    setEditing(false);
    toast.success(`Đã cập nhật vai trò "${editingRole.name}"`);
  };

  const tabs = [
    { key: "permissions" as const, label: "Ma trận quyền", count: ENTITIES.length },
    { key: "fields" as const, label: "Bảo mật cấp trường", count: editingRole.fieldPermissions.length },
    { key: "users" as const, label: "Người dùng", count: roleUsers.length },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] shadow-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${editingRole.color} rounded-xl flex items-center justify-center text-white text-lg`}>
              {editingRole.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-gray-900">{editingRole.name}</h3>
                {editingRole.isSystem && (
                  <span className="text-[8px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">Hệ thống</span>
                )}
                <span className="text-[8px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">Level {editingRole.level}</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">{editingRole.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {editing ? (
              <>
                <button type="button" onClick={() => { setEditingRole({ ...role }); setEditing(false); }}
                  className="px-3 py-1.5 text-sm text-gray-500 hover:bg-gray-50 rounded-lg">Huỷ</button>
                <button type="button" onClick={handleSave}
                  className="px-3 py-1.5 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700">Lưu</button>
              </>
            ) : (
              <button type="button" onClick={() => setEditing(true)}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-violet-600 hover:bg-violet-50 rounded-lg">
                <Pencil className="w-3.5 h-3.5" /> Chỉnh sửa
              </button>
            )}
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-4">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={`px-4 py-2.5 text-sm transition-colors relative ${
                tab === t.key ? "text-violet-600" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {t.label}
              <span className="ml-1.5 text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{t.count}</span>
              {tab === t.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-600 rounded-t" />}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {tab === "permissions" && (
            <>
              {/* Legend */}
              <div className="flex flex-wrap gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
                {PERMISSION_LEVELS.map((l) => (
                  <span key={l.key} className={`text-[9px] px-2 py-1 rounded ${l.color}`}>
                    {l.short} {l.label}
                  </span>
                ))}
                {editing && (
                  <span className="text-[9px] text-violet-600 ml-auto">💡 Click ô để chuyển quyền</span>
                )}
              </div>
              <PermissionMatrix
                role={editingRole}
                editable={editing}
                onPermissionChange={handlePermissionChange}
              />
            </>
          )}
          {tab === "fields" && (
            <FieldPermissionList
              fieldPermissions={editingRole.fieldPermissions}
              onAccessChange={handleFieldAccessChange}
              editable={editing}
            />
          )}
          {tab === "users" && (
            <div className="space-y-2">
              {roleUsers.length === 0 ? (
                <p className="text-center text-gray-400 text-sm py-6">Chưa có người dùng nào được gán vai trò này.</p>
              ) : (
                roleUsers.map((u) => (
                  <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs">
                        {u.avatar}
                      </div>
                      <div>
                        <p className="text-sm text-gray-900">{u.name}</p>
                        <p className="text-[10px] text-gray-400">{u.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-gray-400">{u.department}</p>
                      <p className="text-[9px] text-gray-300">
                        {new Date(u.lastActive).toLocaleDateString("vi-VN")}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính RBAC
 * ============================================================ */
export function RBACPage() {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"roles" | "users" | "compare">("roles");
  const [compareRoles, setCompareRoles] = useState<string[]>([]);

  const filtered = useMemo(() => {
    if (!search) return roles;
    const q = search.toLowerCase();
    return roles.filter(
      (r) => r.name.toLowerCase().includes(q) || r.description.toLowerCase().includes(q),
    );
  }, [roles, search]);

  const stats = useMemo(() => ({
    totalRoles: roles.length,
    systemRoles: roles.filter((r) => r.isSystem).length,
    customRoles: roles.filter((r) => !r.isSystem).length,
    totalUsers: roles.reduce((s, r) => s + r.userCount, 0),
    aiRoles: roles.filter((r) => r.name.includes("AI")).length,
  }), [roles]);

  const handleSaveRole = (updated: Role) => {
    setRoles((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setSelectedRole(null);
  };

  const toggleCompare = (roleId: string) => {
    setCompareRoles((prev) =>
      prev.includes(roleId) ? prev.filter((id) => id !== roleId) : prev.length < 3 ? [...prev, roleId] : prev,
    );
  };

  // Hierarchy sorted
  const sortedRoles = useMemo(
    () => [...filtered].sort((a, b) => a.level - b.level),
    [filtered],
  );

  // Count total permissions summary
  const getPermSummary = (role: Role) => {
    let full = 0, own = 0, team = 0, none = 0;
    role.permissions.forEach((p) => {
      Object.values(p.actions).forEach((l) => {
        if (l === "full") full++;
        else if (l === "own") own++;
        else if (l === "team") team++;
        else none++;
      });
    });
    return { full, own, team, none, total: full + own + team + none };
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <Shield className="w-6 h-6 text-violet-600" /> Phân quyền (RBAC)
        </h1>
        <p className="text-gray-500 mt-0.5">
          Quản lý vai trò, ma trận quyền, bảo mật cấp trường — Role-Based Access Control
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3">
          <Shield className="w-4 h-4 text-violet-500 mb-1" />
          <p className="text-lg text-gray-900">{stats.totalRoles}</p>
          <p className="text-xs text-gray-500">Vai trò</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-3">
          <Key className="w-4 h-4 text-amber-500 mb-1" />
          <p className="text-lg text-amber-600">{stats.systemRoles}</p>
          <p className="text-xs text-amber-700">Hệ thống</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-3">
          <Layers className="w-4 h-4 text-blue-500 mb-1" />
          <p className="text-lg text-blue-600">{stats.customRoles}</p>
          <p className="text-xs text-blue-700">Tuỳ chỉnh</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-3">
          <Users className="w-4 h-4 text-green-500 mb-1" />
          <p className="text-lg text-green-600">{stats.totalUsers}</p>
          <p className="text-xs text-green-700">Người dùng</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-3 col-span-2 lg:col-span-1">
          <Bot className="w-4 h-4 text-violet-500 mb-1" />
          <p className="text-lg text-violet-600">{stats.aiRoles}</p>
          <p className="text-xs text-violet-700">AI Agent Roles</p>
        </div>
      </div>

      {/* View Toggle & Search */}
      <div className="bg-white rounded-xl border border-gray-100 p-3">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-0.5 bg-gray-100 p-0.5 rounded-lg">
            {[
              { key: "roles" as const, label: "Vai trò" },
              { key: "users" as const, label: "Người dùng" },
              { key: "compare" as const, label: "So sánh" },
            ].map((v) => (
              <button
                key={v.key}
                type="button"
                onClick={() => setView(v.key)}
                className={`px-3 py-1.5 rounded-md text-xs whitespace-nowrap transition-all ${
                  view === v.key ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
          <div className="relative flex-1 min-w-[150px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm vai trò, mô tả..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          {view === "compare" && compareRoles.length > 0 && (
            <button type="button" onClick={() => setCompareRoles([])}
              className="text-xs text-red-500 hover:bg-red-50 px-2 py-1.5 rounded-lg">
              Xoá so sánh ({compareRoles.length}/3)
            </button>
          )}
        </div>
      </div>

      {/* ROLES VIEW */}
      {view === "roles" && (
        <>
          {/* Role Hierarchy */}
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm text-gray-900 flex items-center gap-2 mb-3">
              <Crown className="w-4 h-4 text-amber-500" /> Hệ phân cấp vai trò
            </h3>
            <div className="flex flex-wrap items-center gap-2">
              {sortedRoles.map((role, idx) => (
                <div key={role.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole(role)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors hover:shadow-sm ${
                      role.level === 0
                        ? "border-red-200 bg-red-50"
                        : role.level === 1
                          ? "border-orange-200 bg-orange-50"
                          : role.level === 2
                            ? "border-blue-200 bg-blue-50"
                            : role.level === 3
                              ? "border-green-200 bg-green-50"
                              : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <span className="text-sm">{role.icon}</span>
                    <span className="text-xs text-gray-800">{role.name}</span>
                    <span className="text-[8px] text-gray-400">({role.userCount})</span>
                  </button>
                  {idx < sortedRoles.length - 1 && sortedRoles[idx + 1].level > role.level && (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
                  )}
                  {idx < sortedRoles.length - 1 && sortedRoles[idx + 1].level === role.level && (
                    <span className="text-gray-200 text-xs">|</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Role Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {sortedRoles.map((role) => {
              const summary = getPermSummary(role);
              const accessPercent = Math.round(((summary.full + summary.own + summary.team) / summary.total) * 100);
              return (
                <div
                  key={role.id}
                  className="bg-white rounded-xl border border-gray-100 hover:shadow-md transition-shadow cursor-pointer overflow-hidden"
                  onClick={() => setSelectedRole(role)}
                >
                  <div className={`h-1.5 ${role.color}`} />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{role.icon}</span>
                        <div>
                          <h4 className="text-sm text-gray-900">{role.name}</h4>
                          <div className="flex items-center gap-1 mt-0.5">
                            {role.isSystem && (
                              <span className="text-[7px] px-1 py-0.5 bg-amber-100 text-amber-600 rounded">Hệ thống</span>
                            )}
                            <span className="text-[7px] px-1 py-0.5 bg-gray-100 text-gray-400 rounded">Level {role.level}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg text-gray-900">{role.userCount}</p>
                        <p className="text-[8px] text-gray-400">người dùng</p>
                      </div>
                    </div>

                    <p className="text-[10px] text-gray-400 line-clamp-2 mb-3">{role.description}</p>

                    {/* Permission bar */}
                    <div className="h-2 rounded-full overflow-hidden flex bg-gray-100 mb-1">
                      <div className="bg-green-400" style={{ width: `${(summary.full / summary.total) * 100}%` }} />
                      <div className="bg-blue-400" style={{ width: `${(summary.own / summary.total) * 100}%` }} />
                      <div className="bg-amber-400" style={{ width: `${(summary.team / summary.total) * 100}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-[8px] text-gray-400">
                      <span>Truy cập: {accessPercent}%</span>
                      <span>{role.fieldPermissions.length} trường bảo mật</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* USERS VIEW */}
      {view === "users" && (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left py-2.5 px-4 text-xs text-gray-500">Người dùng</th>
                  <th className="text-left py-2.5 px-4 text-xs text-gray-500">Email</th>
                  <th className="text-left py-2.5 px-4 text-xs text-gray-500">Vai trò</th>
                  <th className="text-left py-2.5 px-4 text-xs text-gray-500">Phòng ban</th>
                  <th className="text-left py-2.5 px-4 text-xs text-gray-500">Hoạt động gần đây</th>
                </tr>
              </thead>
              <tbody>
                {USER_ASSIGNMENTS.filter((u) =>
                  !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.role.toLowerCase().includes(search.toLowerCase()),
                ).map((user) => {
                  const role = roles.find((r) => r.name === user.role);
                  return (
                    <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                      <td className="py-2.5 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-[10px]">
                            {user.avatar}
                          </div>
                          <span className="text-gray-900 text-xs">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-xs text-gray-400">{user.email}</td>
                      <td className="py-2.5 px-4">
                        <button
                          type="button"
                          onClick={() => role && setSelectedRole(role)}
                          className="flex items-center gap-1.5 text-xs text-violet-600 hover:bg-violet-50 px-2 py-1 rounded"
                        >
                          <span>{role?.icon}</span> {user.role}
                        </button>
                      </td>
                      <td className="py-2.5 px-4 text-xs text-gray-500">{user.department}</td>
                      <td className="py-2.5 px-4 text-[10px] text-gray-400">
                        {new Date(user.lastActive).toLocaleString("vi-VN", { dateStyle: "short", timeStyle: "short" })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* COMPARE VIEW */}
      {view === "compare" && (
        <>
          {compareRoles.length < 2 ? (
            <div className="bg-white rounded-xl border border-gray-100 p-6">
              <p className="text-sm text-gray-500 text-center mb-4">
                Chọn 2–3 vai trò để so sánh ma trận quyền
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {sortedRoles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => toggleCompare(role.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-left transition-colors ${
                      compareRoles.includes(role.id)
                        ? "border-violet-300 bg-violet-50"
                        : "border-gray-200 hover:border-violet-200"
                    }`}
                  >
                    {compareRoles.includes(role.id) && <Check className="w-3.5 h-3.5 text-violet-600" />}
                    <span className="text-sm">{role.icon}</span>
                    <span className="text-xs text-gray-800">{role.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      <th className="text-left py-2 px-3 text-xs text-gray-500 sticky left-0 bg-gray-50 min-w-[120px]">Entity / Action</th>
                      {compareRoles.map((rid) => {
                        const r = roles.find((x) => x.id === rid)!;
                        return (
                          <th key={rid} colSpan={PERMISSION_ACTIONS.length} className="text-center py-2 px-1 text-xs border-l border-gray-200">
                            <div className="flex items-center justify-center gap-1">
                              <span>{r.icon}</span>
                              <span className="text-gray-700">{r.name}</span>
                              <button type="button" onClick={() => toggleCompare(rid)} className="text-gray-300 hover:text-red-500">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                    <tr className="border-b border-gray-100">
                      <th className="sticky left-0 bg-white" />
                      {compareRoles.map((rid) =>
                        PERMISSION_ACTIONS.map((a) => (
                          <th key={`${rid}-${a.key}`} className="py-1 px-0.5 text-center text-[8px] text-gray-400">{a.label}</th>
                        )),
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {ENTITIES.map((entity) => (
                      <tr key={entity.key} className="border-b border-gray-50 hover:bg-gray-50/50">
                        <td className="py-1.5 px-3 text-xs text-gray-700 sticky left-0 bg-white">{entity.label}</td>
                        {compareRoles.map((rid) => {
                          const r = roles.find((x) => x.id === rid)!;
                          const perm = r.permissions.find((p) => p.entity === entity.key);
                          return PERMISSION_ACTIONS.map((a) => {
                            const level = perm?.actions[a.key] ?? "none";
                            const cfg = PERMISSION_LEVELS.find((l) => l.key === level)!;
                            return (
                              <td key={`${rid}-${a.key}`} className="py-1.5 px-0.5 text-center">
                                <span className={`inline-block w-6 h-6 rounded text-[10px] leading-6 text-center ${cfg.color}`}>
                                  {cfg.short}
                                </span>
                              </td>
                            );
                          });
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Permission Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span>3 Sales Reps đang có quyền <strong>export contacts</strong> — recommend chuyển sang "own" để giảm rủi ro data leak cho {roles.find(r => r.name === "Sales Rep")?.userCount} users.</span>
          </p>
          <p className="flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Vai trò <strong>Viewer</strong> đã tuân thủ principle of least privilege — chỉ có quyền "view" và không có trường nhạy cảm nào hiển thị.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>Đề xuất tạo vai trò <strong>"Finance Manager"</strong> riêng cho bộ phận tài chính: quyền commissions + contracts + invoices thay vì dùng Admin.</span>
          </p>
        </div>
      </div>

      {/* Role Detail Modal */}
      {selectedRole && (
        <RoleDetailModal
          role={selectedRole}
          onClose={() => setSelectedRole(null)}
          onSave={handleSaveRole}
        />
      )}
    </div>
  );
}
