/**
 * Trang Cấu hình CRM — quản lý danh mục, ngưỡng AI, xuất dữ liệu.
 * Phase 1: Bổ sung tiện ích quản trị
 */
import { useState, useCallback } from "react";
import {
  Settings,
  Tag,
  Bot,
  Download,
  Plus,
  X,
  Trash2,
  Save,
  Sliders,
  FileSpreadsheet,
  Check,
} from "lucide-react";
import { toast } from "sonner";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";
import { fetchContacts, fetchDeals, fetchActivities } from "../../api/crmApi";
import {
  CONTACT_SOURCES,
  DEAL_STAGE_CONFIG,
  CONTACT_TYPE_CONFIG,
  ACTIVITY_TYPE_CONFIG,
  formatCurrency,
} from "../../constants/crmConfig";

/* ============================================================
 * Tab danh sách
 * ============================================================ */
type SettingsTab = "categories" | "ai" | "export";

const TABS: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
  { key: "categories", label: "Danh mục", icon: <Tag className="w-4 h-4" /> },
  { key: "ai", label: "Cấu hình AI", icon: <Bot className="w-4 h-4" /> },
  { key: "export", label: "Xuất dữ liệu", icon: <Download className="w-4 h-4" /> },
];

/* ============================================================
 * Component: Danh sách danh mục có thể thêm/xoá
 * ============================================================ */
function CategoryList({
  title,
  items: initialItems,
  renderBadge,
}: {
  title: string;
  items: { key: string; label: string; color?: string }[];
  renderBadge?: (item: { key: string; label: string; color?: string }) => React.ReactNode;
}) {
  const [items, setItems] = useState(initialItems);
  const [showAdd, setShowAdd] = useState(false);
  const [newLabel, setNewLabel] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<{ key: string; label: string } | null>(null);

  const handleAdd = () => {
    const trimmed = newLabel.trim();
    if (!trimmed) return;
    const key = trimmed.toLowerCase().replace(/\s+/g, "-");
    if (items.some((i) => i.key === key)) {
      toast.error("Danh mục đã tồn tại");
      return;
    }
    setItems([...items, { key, label: trimmed, color: "bg-gray-100 text-gray-700" }]);
    setNewLabel("");
    setShowAdd(false);
    toast.success(`Đã thêm "${trimmed}" vào ${title}`);
  };

  const handleRemoveConfirm = () => {
    if (!deleteTarget) return;
    setItems(items.filter((i) => i.key !== deleteTarget.key));
    toast.success("Đã xoá danh mục");
    setDeleteTarget(null);
  };

  return (
    <div className="border border-gray-100 rounded-xl bg-white">
      <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
        <h4 className="text-sm text-gray-800">{title}</h4>
        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-1 px-2 py-1 text-xs text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Thêm
        </button>
      </div>

      {showAdd && (
        <div className="px-4 py-2.5 bg-violet-50/50 border-b border-gray-50 flex items-center gap-2">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder={`Thêm ${title.toLowerCase()} mới...`}
            className="flex-1 px-2.5 py-1.5 bg-white border border-violet-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            autoFocus
          />
          <button
            type="button"
            onClick={handleAdd}
            className="px-3 py-1.5 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700"
          >
            Thêm
          </button>
          <button
            type="button"
            onClick={() => { setShowAdd(false); setNewLabel(""); }}
            className="p-1.5 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="divide-y divide-gray-50">
        {items.map((item) => (
          <div key={item.key} className="px-4 py-2.5 flex items-center justify-between group">
            <div className="flex items-center gap-2">
              {renderBadge ? (
                renderBadge(item)
              ) : (
                <span className={`text-xs px-2 py-0.5 rounded ${item.color || ""}`}>
                  {item.label}
                </span>
              )}
              <span className="text-[10px] text-gray-400">({item.key})</span>
            </div>
            <button
              type="button"
              onClick={() => setDeleteTarget({ key: item.key, label: item.label })}
              className="opacity-0 group-hover:opacity-100 p-1 text-gray-300 hover:text-red-500 transition-all"
              aria-label={`Xoá ${item.label}`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
        {items.length === 0 && (
          <div className="px-4 py-6 text-center text-sm text-gray-400">
            Chưa có danh mục nào
          </div>
        )}
      </div>

      <ConfirmDeleteDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleRemoveConfirm}
        itemName={deleteTarget?.label ?? ""}
        entityType="danh mục"
        description={`Danh mục "${deleteTarget?.label ?? ""}" sẽ bị xoá khỏi ${title}. Thao tác này không thể hoàn tác.`}
      />
    </div>
  );
}

/* ============================================================
 * Tab: Quản lý danh mục
 * ============================================================ */
function CategoriesTab() {
  const contactTypes = Object.entries(CONTACT_TYPE_CONFIG).map(([key, config]) => ({
    key,
    label: config.label,
    color: config.color,
  }));

  const dealStages = Object.entries(DEAL_STAGE_CONFIG).map(([key, config]) => ({
    key,
    label: config.label,
    color: `${config.bgColor} ${config.color}`,
  }));

  const activityTypes = Object.entries(ACTIVITY_TYPE_CONFIG).map(([key, config]) => ({
    key,
    label: config.label,
    color: config.color,
  }));

  const sources = CONTACT_SOURCES.map((s) => ({
    key: s.toLowerCase().replace(/\s+/g, "-"),
    label: s,
    color: "bg-gray-100 text-gray-700",
  }));

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Quản lý danh mục phân loại. Thêm/xoá mục sẽ áp dụng cho các form tạo mới.
      </p>
      <div className="grid lg:grid-cols-2 gap-4">
        <CategoryList title="Loại liên hệ" items={contactTypes} />
        <CategoryList title="Giai đoạn Pipeline" items={dealStages} />
        <CategoryList title="Loại hoạt động" items={activityTypes} />
        <CategoryList title="Nguồn liên hệ" items={sources} />
      </div>
    </div>
  );
}

/* ============================================================
 * Tab: Cấu hình AI
 * ============================================================ */
function AIConfigTab() {
  const [config, setConfig] = useState({
    leadScoreThreshold: 70,
    engagementMinimum: 40,
    autoAssignEnabled: true,
    aiAgentAutoResponse: true,
    winProbabilityAlert: 75,
    inactiveDaysThreshold: 60,
    autoLogEmails: true,
    autoLogCalls: true,
    sentimentAnalysis: true,
    smartPrioritization: true,
  });

  const handleSave = () => {
    toast.success("Đã lưu cấu hình AI");
  };

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-500">
        Điều chỉnh ngưỡng và hành vi của AI trong hệ thống CRM.
      </p>

      {/* Ngưỡng điểm */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-4">
        <h4 className="text-sm text-gray-800 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-violet-500" /> Ngưỡng điểm số
        </h4>

        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-gray-600">Lead Score tối thiểu để ưu tiên</label>
              <span className="text-sm text-violet-700">{config.leadScoreThreshold}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={config.leadScoreThreshold}
              onChange={(e) => setConfig({ ...config, leadScoreThreshold: Number(e.target.value) })}
              className="w-full accent-violet-600"
            />
            <div className="flex justify-between text-[10px] text-gray-400">
              <span>0 (Tất cả)</span>
              <span>100 (Chỉ hot lead)</span>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-gray-600">Engagement tối thiểu</label>
              <span className="text-sm text-violet-700">{config.engagementMinimum}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={config.engagementMinimum}
              onChange={(e) => setConfig({ ...config, engagementMinimum: Number(e.target.value) })}
              className="w-full accent-violet-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-gray-600">Win Probability cảnh báo (≥)</label>
              <span className="text-sm text-green-700">{config.winProbabilityAlert}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={config.winProbabilityAlert}
              onChange={(e) => setConfig({ ...config, winProbabilityAlert: Number(e.target.value) })}
              className="w-full accent-green-600"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-gray-600">Số ngày không hoạt động → cảnh báo</label>
              <span className="text-sm text-amber-700">{config.inactiveDaysThreshold} ngày</span>
            </div>
            <input
              type="range"
              min={7}
              max={180}
              value={config.inactiveDaysThreshold}
              onChange={(e) => setConfig({ ...config, inactiveDaysThreshold: Number(e.target.value) })}
              className="w-full accent-amber-600"
            />
          </div>
        </div>
      </div>

      {/* Toggle switches */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
        <h4 className="text-sm text-gray-800 flex items-center gap-2">
          <Bot className="w-4 h-4 text-violet-500" /> Tự động hoá AI
        </h4>

        {([
          { key: "autoAssignEnabled" as const, label: "Tự động phân công lead cho nhân viên", desc: "AI sẽ phân tích workload và phân công lead phù hợp" },
          { key: "aiAgentAutoResponse" as const, label: "AI Agent tự động phản hồi", desc: "AI BDR agent sẽ gửi email chào hàng tự động" },
          { key: "autoLogEmails" as const, label: "Tự động ghi nhận email", desc: "Mọi email gửi/nhận được ghi vào nhật ký hoạt động" },
          { key: "autoLogCalls" as const, label: "Tự động ghi nhận cuộc gọi", desc: "Cuộc gọi qua VoIP tự động log vào hệ thống" },
          { key: "sentimentAnalysis" as const, label: "Phân tích cảm xúc email", desc: "AI phân tích tone email để đánh giá mức độ quan tâm" },
          { key: "smartPrioritization" as const, label: "Sắp xếp ưu tiên thông minh", desc: "AI tự động sắp xếp danh sách lead theo khả năng chốt" },
        ]).map((item) => (
          <label key={item.key} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
            <div className="relative mt-0.5">
              <input
                type="checkbox"
                checked={config[item.key]}
                onChange={(e) => setConfig({ ...config, [item.key]: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-gray-200 rounded-full peer-checked:bg-violet-600 transition-colors" />
              <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform peer-checked:translate-x-4" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-800">{item.label}</p>
              <p className="text-[11px] text-gray-400">{item.desc}</p>
            </div>
          </label>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          Lưu cấu hình
        </button>
      </div>
    </div>
  );
}

/* ============================================================
 * Tab: Xuất dữ liệu CSV
 * ============================================================ */
function ExportTab() {
  const [exporting, setExporting] = useState<string | null>(null);

  const exportCSV = useCallback(async (type: string) => {
    setExporting(type);

    try {
      let csvContent = "";
      let filename = "";

      if (type === "contacts") {
        const data = await fetchContacts();
        csvContent = "ID,Tên,Email,Điện thoại,Công ty,Chức vụ,Loại,Trạng thái,Nguồn,AI Lead Score\n";
        csvContent += data
          .map((c) => `${c.id},"${c.name}","${c.email}","${c.phone}","${c.company}","${c.position}",${c.type},${c.status},"${c.source}",${c.aiLeadScore}`)
          .join("\n");
        filename = "contacts.csv";
      } else if (type === "deals") {
        const data = await fetchDeals();
        csvContent = "ID,Tiêu đề,Liên hệ,Công ty,Giá trị,Giai đoạn,Ưu tiên,Xác suất AI,Ngày dự kiến\n";
        csvContent += data
          .map((d) => `${d.id},"${d.title}","${d.contactName}","${d.company}",${d.value},${d.stage},${d.priority},${d.aiWinProbability},${d.expectedCloseDate}`)
          .join("\n");
        filename = "deals.csv";
      } else if (type === "activities") {
        const data = await fetchActivities();
        csvContent = "ID,Loại,Tiêu đề,Người thực hiện,Thời điểm,Auto Logged\n";
        csvContent += data
          .map((a) => `${a.id},${a.type},"${a.title}",${a.performedBy},${a.performedAt},${a.isAutoLogged}`)
          .join("\n");
        filename = "activities.csv";
      }

      // Tạo download
      const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`Đã xuất ${filename} thành công`);
    } finally {
      setExporting(null);
    }
  }, []);

  const exportItems = [
    {
      type: "contacts",
      title: "Danh sách liên hệ",
      desc: "Xuất tất cả contacts với thông tin, AI scores, tags",
      icon: "👥",
    },
    {
      type: "deals",
      title: "Deals / Cơ hội",
      desc: "Xuất pipeline deals với giá trị, giai đoạn, xác suất AI",
      icon: "🎯",
    },
    {
      type: "activities",
      title: "Nhật ký hoạt động",
      desc: "Xuất toàn bộ activities (human + AI)",
      icon: "📋",
    },
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        Xuất dữ liệu CRM ra định dạng CSV để phân tích bên ngoài hoặc backup.
      </p>

      <div className="grid sm:grid-cols-3 gap-3">
        {exportItems.map((item) => (
          <div
            key={item.type}
            className="bg-white rounded-xl border border-gray-100 p-4 space-y-3"
          >
            <div className="text-2xl">{item.icon}</div>
            <div>
              <h4 className="text-sm text-gray-800">{item.title}</h4>
              <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
            </div>
            <button
              type="button"
              onClick={() => exportCSV(item.type)}
              disabled={exporting === item.type}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-700 transition-colors disabled:opacity-50"
            >
              {exporting === item.type ? (
                <>Đang xuất...</>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4" />
                  Xuất CSV
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function CrmSettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("categories");

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <Settings className="w-6 h-6 text-violet-600" />
          Cấu hình CRM
        </h1>
        <p className="text-gray-500 mt-1">
          Quản lý danh mục phân loại, điều chỉnh ngưỡng AI, và xuất dữ liệu
        </p>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.key
                ? "border-violet-500 text-violet-700"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "categories" && <CategoriesTab />}
      {activeTab === "ai" && <AIConfigTab />}
      {activeTab === "export" && <ExportTab />}
    </div>
  );
}