/**
 * Onboarding Workflow — Quy trình Onboarding Khách hàng
 * Customer onboarding journeys, milestones, task assignment,
 * progress tracking, templates, TTV metrics.
 */
import { useState, useMemo } from "react";
import {
  Rocket,
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Search,
  Plus,
  Sparkles,
  Bot,
  TrendingUp,
  Users,
  Target,
  Flag,
  ArrowRight,
  Play,
  Pause,
  BarChart3,
  Zap,
  Timer,
  Star,
  X,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
type OnboardingStatus = "not-started" | "in-progress" | "completed" | "at-risk" | "paused";
type MilestoneStatus = "done" | "current" | "upcoming" | "blocked";

interface OnboardingJourney {
  id: string;
  customerName: string;
  customerLogo: string;
  plan: string;
  csm: string;
  status: OnboardingStatus;
  startDate: string;
  targetDate: string;
  progress: number;
  currentMilestone: string;
  daysInOnboarding: number;
  targetDays: number;
  healthScore: number;
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  name: string;
  status: MilestoneStatus;
  completedDate: string | null;
  tasks: number;
  completedTasks: number;
}

interface OnboardingTemplate {
  id: string;
  name: string;
  description: string;
  targetDays: number;
  milestones: number;
  totalTasks: number;
  usageCount: number;
  avgTTV: number;
  rating: number;
}

/* ============================================================
 * Mock Data
 * ============================================================ */
const STATUS_CFG: Record<OnboardingStatus, { label: string; color: string; bg: string }> = {
  "not-started": { label: "Chưa bắt đầu", color: "text-gray-500", bg: "bg-gray-50 border-gray-200" },
  "in-progress": { label: "Đang thực hiện", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  completed: { label: "Hoàn thành", color: "text-green-600", bg: "bg-green-50 border-green-200" },
  "at-risk": { label: "Có rủi ro", color: "text-red-600", bg: "bg-red-50 border-red-200" },
  paused: { label: "Tạm dừng", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
};

const MILESTONE_CFG: Record<MilestoneStatus, { icon: typeof CheckCircle2; color: string }> = {
  done: { icon: CheckCircle2, color: "text-green-500" },
  current: { icon: Play, color: "text-blue-500" },
  upcoming: { icon: Circle, color: "text-gray-300" },
  blocked: { icon: AlertTriangle, color: "text-red-500" },
};

const MOCK_JOURNEYS: OnboardingJourney[] = [
  {
    id: "onb_001", customerName: "TechViet Solutions", customerLogo: "TV", plan: "Enterprise", csm: "Phạm Văn Khôi",
    status: "in-progress", startDate: "2026-02-15", targetDate: "2026-04-15", progress: 65, currentMilestone: "Cấu hình Hệ thống",
    daysInOnboarding: 16, targetDays: 60, healthScore: 82,
    milestones: [
      { id: "m1", name: "Kickoff & Kế hoạch", status: "done", completedDate: "2026-02-17", tasks: 5, completedTasks: 5 },
      { id: "m2", name: "Tích hợp Dữ liệu", status: "done", completedDate: "2026-02-25", tasks: 8, completedTasks: 8 },
      { id: "m3", name: "Cấu hình Hệ thống", status: "current", completedDate: null, tasks: 12, completedTasks: 7 },
      { id: "m4", name: "Đào tạo Người dùng", status: "upcoming", completedDate: null, tasks: 6, completedTasks: 0 },
      { id: "m5", name: "Go-Live & Handoff", status: "upcoming", completedDate: null, tasks: 4, completedTasks: 0 },
    ],
  },
  {
    id: "onb_002", customerName: "CloudFirst Global", customerLogo: "CF", plan: "Professional", csm: "Nguyễn Thị Hương",
    status: "at-risk", startDate: "2026-01-20", targetDate: "2026-03-20", progress: 45, currentMilestone: "Tích hợp Dữ liệu",
    daysInOnboarding: 42, targetDays: 60, healthScore: 58,
    milestones: [
      { id: "m1", name: "Kickoff & Kế hoạch", status: "done", completedDate: "2026-01-22", tasks: 4, completedTasks: 4 },
      { id: "m2", name: "Tích hợp Dữ liệu", status: "blocked", completedDate: null, tasks: 6, completedTasks: 2 },
      { id: "m3", name: "Cấu hình Hệ thống", status: "upcoming", completedDate: null, tasks: 8, completedTasks: 0 },
      { id: "m4", name: "Go-Live & Handoff", status: "upcoming", completedDate: null, tasks: 4, completedTasks: 0 },
    ],
  },
  {
    id: "onb_003", customerName: "Sakura Systems", customerLogo: "SS", plan: "Enterprise", csm: "Phạm Văn Khôi",
    status: "completed", startDate: "2025-12-01", targetDate: "2026-02-01", progress: 100, currentMilestone: "Hoàn thành",
    daysInOnboarding: 55, targetDays: 60, healthScore: 95,
    milestones: [
      { id: "m1", name: "Kickoff & Kế hoạch", status: "done", completedDate: "2025-12-03", tasks: 5, completedTasks: 5 },
      { id: "m2", name: "Tích hợp Dữ liệu", status: "done", completedDate: "2025-12-18", tasks: 8, completedTasks: 8 },
      { id: "m3", name: "Cấu hình Hệ thống", status: "done", completedDate: "2026-01-10", tasks: 10, completedTasks: 10 },
      { id: "m4", name: "Đào tạo Người dùng", status: "done", completedDate: "2026-01-22", tasks: 6, completedTasks: 6 },
      { id: "m5", name: "Go-Live & Handoff", status: "done", completedDate: "2026-01-25", tasks: 4, completedTasks: 4 },
    ],
  },
  {
    id: "onb_004", customerName: "SEA Digital Pte", customerLogo: "SD", plan: "Starter", csm: "AI Agent — Nova",
    status: "in-progress", startDate: "2026-02-25", targetDate: "2026-03-25", progress: 40, currentMilestone: "Tích hợp Dữ liệu",
    daysInOnboarding: 6, targetDays: 30, healthScore: 88,
    milestones: [
      { id: "m1", name: "Kickoff & Kế hoạch", status: "done", completedDate: "2026-02-26", tasks: 3, completedTasks: 3 },
      { id: "m2", name: "Tích hợp Dữ liệu", status: "current", completedDate: null, tasks: 4, completedTasks: 2 },
      { id: "m3", name: "Go-Live", status: "upcoming", completedDate: null, tasks: 3, completedTasks: 0 },
    ],
  },
  {
    id: "onb_005", customerName: "EuroFinance AG", customerLogo: "EF", plan: "Enterprise", csm: "Phạm Văn Khôi",
    status: "not-started", startDate: "2026-03-10", targetDate: "2026-05-10", progress: 0, currentMilestone: "Chưa bắt đầu",
    daysInOnboarding: 0, targetDays: 60, healthScore: 75,
    milestones: [
      { id: "m1", name: "Kickoff & Kế hoạch", status: "upcoming", completedDate: null, tasks: 5, completedTasks: 0 },
      { id: "m2", name: "Tích hợp Dữ liệu", status: "upcoming", completedDate: null, tasks: 10, completedTasks: 0 },
      { id: "m3", name: "Cấu hình Hệ thống", status: "upcoming", completedDate: null, tasks: 12, completedTasks: 0 },
      { id: "m4", name: "Đào tạo Người dùng", status: "upcoming", completedDate: null, tasks: 8, completedTasks: 0 },
      { id: "m5", name: "Go-Live & Handoff", status: "upcoming", completedDate: null, tasks: 5, completedTasks: 0 },
    ],
  },
];

const MOCK_TEMPLATES: OnboardingTemplate[] = [
  { id: "tpl_01", name: "Enterprise Full Onboarding", description: "Quy trình 5 giai đoạn cho khách Enterprise: Kickoff → Data → Config → Training → Go-Live", targetDays: 60, milestones: 5, totalTasks: 35, usageCount: 24, avgTTV: 52, rating: 4.8 },
  { id: "tpl_02", name: "Professional Quick Start", description: "Quy trình 4 giai đoạn rút gọn cho khách Professional", targetDays: 45, milestones: 4, totalTasks: 22, usageCount: 38, avgTTV: 38, rating: 4.5 },
  { id: "tpl_03", name: "Starter Self-Service", description: "Quy trình 3 giai đoạn tự động hoá cho Starter plan, AI-driven", targetDays: 30, milestones: 3, totalTasks: 10, usageCount: 65, avgTTV: 18, rating: 4.7 },
  { id: "tpl_04", name: "Migration from HubSpot", description: "Quy trình chuyên biệt cho migration từ HubSpot CRM sang AI-CRM", targetDays: 45, milestones: 5, totalTasks: 28, usageCount: 12, avgTTV: 42, rating: 4.3 },
];

type Tab = "journeys" | "templates" | "metrics";

/* ============================================================
 * Create Onboarding Journey Modal
 * ============================================================ */
function CreateJourneyModal({ onClose, onCreated }: { onClose: () => void; onCreated: (j: OnboardingJourney) => void }) {
  const [customerName, setCustomerName] = useState("");
  const [plan, setPlan] = useState("Professional");
  const [csm, setCsm] = useState("");
  const [targetDays, setTargetDays] = useState(60);
  const [saving, setSaving] = useState(false);

  const defaultMilestones: Milestone[] = [
    { id: `m_${Date.now()}_1`, name: "Kickoff & Kế hoạch", status: "upcoming", completedDate: null, tasks: 5, completedTasks: 0 },
    { id: `m_${Date.now()}_2`, name: "Tích hợp Dữ liệu", status: "upcoming", completedDate: null, tasks: 8, completedTasks: 0 },
    { id: `m_${Date.now()}_3`, name: "Cấu hình Hệ thống", status: "upcoming", completedDate: null, tasks: 10, completedTasks: 0 },
    { id: `m_${Date.now()}_4`, name: "Đào tạo Người dùng", status: "upcoming", completedDate: null, tasks: 6, completedTasks: 0 },
    { id: `m_${Date.now()}_5`, name: "Go-Live & Handoff", status: "upcoming", completedDate: null, tasks: 4, completedTasks: 0 },
  ];

  const handleSave = () => {
    if (!customerName.trim()) { toast.error("Vui lòng nhập tên khách hàng"); return; }
    setSaving(true);
    const today = new Date().toISOString().slice(0, 10);
    const target = new Date(Date.now() + targetDays * 86400000).toISOString().slice(0, 10);
    const newJourney: OnboardingJourney = {
      id: `onb_${Date.now()}`, customerName, customerLogo: customerName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
      plan, csm: csm || "Chưa gán", status: "not-started", startDate: today, targetDate: target,
      progress: 0, currentMilestone: "Kickoff & Kế hoạch", daysInOnboarding: 0, targetDays, healthScore: 100,
      milestones: defaultMilestones,
    };
    onCreated(newJourney);
    toast.success(`Đã tạo hành trình onboarding cho "${customerName}"`);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Tạo Hành trình Onboarding</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tên khách hàng *</label>
            <input type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="VD: TechViet Solutions"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Gói sản phẩm</label>
              <select value={plan} onChange={(e) => setPlan(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                <option value="Starter">Starter</option>
                <option value="Professional">Professional</option>
                <option value="Enterprise">Enterprise</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Thời gian mục tiêu (ngày)</label>
              <input type="number" value={targetDays} onChange={(e) => setTargetDays(Number(e.target.value))} min={7} max={180}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">CSM phụ trách</label>
            <input type="text" value={csm} onChange={(e) => setCsm(e.target.value)} placeholder="VD: Phạm Văn Khôi"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500" />
          </div>
          <div className="bg-orange-50 rounded-lg p-3 border border-orange-100">
            <p className="text-[10px] text-orange-700 mb-1.5">Milestones mặc định (có thể chỉnh sau):</p>
            <div className="space-y-1">
              {defaultMilestones.map((m, idx) => (
                <div key={m.id} className="flex items-center gap-2 text-[10px] text-orange-800">
                  <span className="w-4 h-4 rounded-full bg-orange-200 text-orange-700 flex items-center justify-center flex-shrink-0">{idx + 1}</span>
                  <span>{m.name}</span>
                  <span className="text-orange-400 ml-auto">{m.tasks} tasks</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo hành trình"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Component
 * ============================================================ */
export function OnboardingWorkflowPage() {
  const [activeTab, setActiveTab] = useState<Tab>("journeys");
  const [statusFilter, setStatusFilter] = useState<OnboardingStatus | "all">("all");
  const [expandedId, setExpandedId] = useState<string | null>("onb_001");
  const [journeys, setJourneys] = useState(MOCK_JOURNEYS);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handleCreateJourney = (j: OnboardingJourney) => {
    setJourneys((prev) => [j, ...prev]);
    setExpandedId(j.id);
  };

  const filteredJourneys = useMemo(() => {
    if (statusFilter === "all") return journeys;
    return journeys.filter((j) => j.status === statusFilter);
  }, [journeys, statusFilter]);

  const stats = useMemo(() => ({
    active: journeys.filter((j) => j.status === "in-progress").length,
    atRisk: journeys.filter((j) => j.status === "at-risk").length,
    completed: journeys.filter((j) => j.status === "completed").length,
    avgTTV: Math.round(journeys.filter((j) => j.status === "completed").reduce((s, j) => s + j.daysInOnboarding, 0) / (journeys.filter((j) => j.status === "completed").length || 1)),
  }), [journeys]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "journeys", label: "Hành trình" },
    { key: "templates", label: "Mẫu quy trình" },
    { key: "metrics", label: "Chỉ số" },
  ];

  return (
    <div className="space-y-5">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <Rocket className="w-6 h-6 text-orange-500" /> Onboarding Workflow
          </h1>
          <p className="text-gray-500 mt-0.5">Quy trình onboarding khách hàng — milestones, tiến độ, TTV, templates</p>
        </div>
        <button type="button" onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1 px-3 py-2 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 self-start">
          <Plus className="w-4 h-4" /> Tạo Hành trình
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{stats.active}</p>
          <p className="text-[9px] text-blue-700">Đang onboarding</p>
        </div>
        <div className={`rounded-xl border p-2.5 text-center ${stats.atRisk > 0 ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
          <p className={`text-lg ${stats.atRisk > 0 ? "text-red-600" : "text-green-600"}`}>{stats.atRisk}</p>
          <p className="text-[9px] text-gray-500">Có rủi ro</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{stats.completed}</p>
          <p className="text-[9px] text-green-700">Hoàn thành</p>
        </div>
        <div className="bg-orange-50 rounded-xl border border-orange-200 p-2.5 text-center">
          <p className="text-lg text-orange-600">{stats.avgTTV} ngày</p>
          <p className="text-[9px] text-orange-700">Time-to-Value TB</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto">
        {tabs.map((t) => (
          <button key={t.key} type="button" onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${
              activeTab === t.key ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-500 hover:bg-gray-50"
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* === Journeys Tab === */}
      {activeTab === "journeys" && (
        <>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as OnboardingStatus | "all")}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
            <option value="all">Tất cả trạng thái</option>
            {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>

          <div className="space-y-3">
            {filteredJourneys.map((j) => {
              const st = STATUS_CFG[j.status];
              const isExpanded = expandedId === j.id;
              const isOverdue = j.daysInOnboarding > j.targetDays && j.status !== "completed";
              return (
                <div key={j.id} className={`bg-white rounded-xl border ${j.status === "at-risk" ? "border-red-200" : "border-gray-100"}`}>
                  <button type="button" onClick={() => setExpandedId(isExpanded ? null : j.id)}
                    className="w-full p-4 text-left">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[10px] text-orange-700 flex-shrink-0">
                        {j.customerLogo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm text-gray-900">{j.customerName}</span>
                          <span className="text-[8px] text-gray-400">{j.plan}</span>
                          <span className={`text-[7px] px-1.5 py-0.5 rounded border ${st.bg} ${st.color}`}>{st.label}</span>
                          {isOverdue && <span className="text-[7px] px-1.5 py-0.5 bg-red-100 text-red-600 rounded border border-red-200">Trễ hạn</span>}
                        </div>
                        <p className="text-[9px] text-gray-400">CSM: {j.csm} • Bắt đầu: {j.startDate} • Mục tiêu: {j.targetDate}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className={`text-lg ${j.progress === 100 ? "text-green-600" : "text-blue-600"}`}>{j.progress}%</p>
                        <p className="text-[8px] text-gray-400">Ngày {j.daysInOnboarding}/{j.targetDays}</p>
                      </div>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${
                        j.status === "at-risk" ? "bg-red-400" :
                        j.status === "completed" ? "bg-green-400" : "bg-blue-400"
                      }`} style={{ width: `${j.progress}%` }} />
                    </div>
                  </button>

                  {/* Expanded milestones */}
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-50 pt-3">
                      <div className="relative">
                        {j.milestones.map((m, idx) => {
                          const mcfg = MILESTONE_CFG[m.status];
                          const Icon = mcfg.icon;
                          return (
                            <div key={m.id} className="flex items-start gap-3 mb-3 last:mb-0">
                              <div className="flex flex-col items-center">
                                <Icon className={`w-5 h-5 ${mcfg.color}`} />
                                {idx < j.milestones.length - 1 && <div className="w-px h-6 bg-gray-200 mt-1" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-sm text-gray-700">{m.name}</span>
                                  <span className="text-[8px] text-gray-400">{m.completedTasks}/{m.tasks} tasks</span>
                                  {m.completedDate && <span className="text-[8px] text-green-600">✓ {m.completedDate}</span>}
                                </div>
                                {m.tasks > 0 && (
                                  <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden w-40">
                                    <div className="h-full bg-green-400 rounded-full" style={{ width: `${(m.completedTasks / m.tasks) * 100}%` }} />
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* === Templates Tab === */}
      {activeTab === "templates" && (
        <div className="space-y-2">
          {MOCK_TEMPLATES.map((tpl) => (
            <div key={tpl.id} className="bg-white rounded-xl border border-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm text-gray-900">{tpl.name}</span>
                    <span className="text-[8px] text-gray-400">v1.0</span>
                    <div className="flex items-center gap-0.5 ml-auto">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-[9px] text-amber-600">{tpl.rating}</span>
                    </div>
                  </div>
                  <p className="text-[9px] text-gray-500 mt-0.5">{tpl.description}</p>
                  <div className="flex items-center gap-4 mt-1.5 text-[8px] text-gray-400 flex-wrap">
                    <span>📅 {tpl.targetDays} ngày</span>
                    <span>🎯 {tpl.milestones} milestones</span>
                    <span>📋 {tpl.totalTasks} tasks</span>
                    <span>📊 Đã dùng {tpl.usageCount} lần</span>
                    <span>⏱️ TTV trung bình: {tpl.avgTTV} ngày</span>
                  </div>
                </div>
                <button type="button" onClick={() => toast.success(`Áp dụng template "${tpl.name}"`)}
                  className="flex items-center gap-1 px-3 py-1.5 text-[9px] bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex-shrink-0">
                  <Play className="w-3 h-3" /> Dùng
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* === Metrics Tab === */}
      {activeTab === "metrics" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm text-gray-900 mb-3">Time-to-Value theo Plan</h3>
            {[
              { plan: "Enterprise", days: 52, target: 60, color: "bg-violet-400" },
              { plan: "Professional", days: 38, target: 45, color: "bg-blue-400" },
              { plan: "Starter", days: 18, target: 30, color: "bg-green-400" },
            ].map((p) => (
              <div key={p.plan} className="mb-3 last:mb-0">
                <div className="flex items-center justify-between text-[9px] mb-0.5">
                  <span className="text-gray-700">{p.plan}</span>
                  <span className="text-gray-500">{p.days} / {p.target} ngày</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${p.color}`} style={{ width: `${(p.days / p.target) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-100 p-4">
            <h3 className="text-sm text-gray-900 mb-3">Tỷ lệ hoàn thành theo Milestone</h3>
            {[
              { name: "Kickoff & Kế hoạch", rate: 98, color: "bg-green-400" },
              { name: "Tích hợp Dữ liệu", rate: 82, color: "bg-blue-400" },
              { name: "Cấu hình Hệ thống", rate: 75, color: "bg-amber-400" },
              { name: "Đào tạo Người dùng", rate: 88, color: "bg-violet-400" },
              { name: "Go-Live & Handoff", rate: 92, color: "bg-emerald-400" },
            ].map((m) => (
              <div key={m.name} className="mb-2.5 last:mb-0">
                <div className="flex items-center justify-between text-[9px] mb-0.5">
                  <span className="text-gray-700">{m.name}</span>
                  <span className="text-gray-500">{m.rate}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.rate}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-orange-600" />
          <h4 className="text-sm text-orange-900">AI Onboarding Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-orange-800">
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <span><strong>CloudFirst Global</strong> bị block tại <strong>Tích hợp Dữ liệu</strong> — 42 ngày, chỉ 45% progress. Root cause: API legacy không tương thích. AI suggest: <strong>cử Solution Architect hỗ trợ</strong> + custom connector, giảm TTV ~15 ngày.</span>
          </p>
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Template <strong>"Starter Self-Service"</strong> hiệu quả nhất: TTV <strong>18 ngày</strong> (target 30), 65 lần sử dụng, rating 4.7/5. AI recommend: áp dụng workflow tương tự cho <strong>Professional plan</strong> (giảm TTV từ 38→25 ngày).</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span><strong>SEA Digital</strong> (Starter, AI-driven onboarding) — progress <strong>40% trong 6 ngày</strong>, dự báo hoàn thành trong <strong>15 ngày</strong> (sớm hơn target 50%). AI Agent Nova xử lý 100% tự động, tiết kiệm <strong>~20h CSM time</strong>.</span>
          </p>
        </div>
      </div>
      {showCreateModal && <CreateJourneyModal onClose={() => setShowCreateModal(false)} onCreated={handleCreateJourney} />}
    </div>
  );
}