/**
 * Dependency Graph — Biểu đồ phụ thuộc 18 Phases
 * Interactive phase dependency visualization,
 * critical path, progress tracking, bottleneck detection.
 */
import { useState, useMemo, useRef, useEffect } from "react";
import {
  GitBranch,
  Sparkles,
  Bot,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  Eye,
  ZoomIn,
  ZoomOut,
  Maximize2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Target,
  Zap,
  Users,
  Shield,
  BarChart3,
  Layers,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
type PhaseStatus = "completed" | "in-progress" | "planned" | "blocked";

interface PhaseNode {
  id: number;
  name: string;
  shortName: string;
  description: string;
  status: PhaseStatus;
  progress: number;
  duration: string;
  team: string;
  dependencies: number[];
  stepCount: number;
  criticalPath: boolean;
  estimatedStart: string;
  estimatedEnd: string;
  blockers: string[];
}

/* ============================================================
 * Constants
 * ============================================================ */
const STATUS_CFG: Record<PhaseStatus, { label: string; color: string; bg: string; borderColor: string; fillColor: string }> = {
  completed: { label: "Hoàn thành", color: "text-green-600", bg: "bg-green-50", borderColor: "#22c55e", fillColor: "#dcfce7" },
  "in-progress": { label: "Đang thực hiện", color: "text-blue-600", bg: "bg-blue-50", borderColor: "#3b82f6", fillColor: "#dbeafe" },
  planned: { label: "Kế hoạch", color: "text-gray-500", bg: "bg-gray-50", borderColor: "#9ca3af", fillColor: "#f3f4f6" },
  blocked: { label: "Bị chặn", color: "text-red-600", bg: "bg-red-50", borderColor: "#ef4444", fillColor: "#fef2f2" },
};

/* ============================================================
 * Mock Data: 18 Phases (0→17)
 * ============================================================ */
const PHASES: PhaseNode[] = [
  { id: 0, name: "Khởi tạo & Thiết lập Dự án", shortName: "P0: Khởi tạo", description: "Setup repo, CI/CD, infra, coding standards", status: "completed", progress: 100, duration: "2 tuần", team: "DevOps + Lead", dependencies: [], stepCount: 18, criticalPath: true, estimatedStart: "2026-01-06", estimatedEnd: "2026-01-17", blockers: [] },
  { id: 1, name: "Core CRM Foundation", shortName: "P1: Core CRM", description: "Contact, Company, Deal, Activity, Pipeline", status: "completed", progress: 100, duration: "4 tuần", team: "Backend + Frontend", dependencies: [0], stepCount: 35, criticalPath: true, estimatedStart: "2026-01-20", estimatedEnd: "2026-02-14", blockers: [] },
  { id: 2, name: "Communication Hub", shortName: "P2: Comms", description: "Email, SMS, VoIP, Chat, Notification", status: "completed", progress: 100, duration: "3 tuần", team: "Backend + Integration", dependencies: [1], stepCount: 28, criticalPath: true, estimatedStart: "2026-02-17", estimatedEnd: "2026-03-06", blockers: [] },
  { id: 3, name: "Sales Intelligence", shortName: "P3: Sales AI", description: "Forecasting, Lead Scoring, Deal Insights", status: "in-progress", progress: 65, duration: "4 tuần", team: "AI/ML + Backend", dependencies: [1, 2], stepCount: 32, criticalPath: true, estimatedStart: "2026-03-09", estimatedEnd: "2026-04-03", blockers: [] },
  { id: 4, name: "Marketing Automation", shortName: "P4: Marketing", description: "Campaign, Email Sequence, Landing Pages", status: "in-progress", progress: 40, duration: "4 tuần", team: "Frontend + Backend", dependencies: [2], stepCount: 30, criticalPath: false, estimatedStart: "2026-03-09", estimatedEnd: "2026-04-03", blockers: [] },
  { id: 5, name: "Customer Success", shortName: "P5: CS", description: "Health Score, NPS, Churn Prevention", status: "in-progress", progress: 25, duration: "3 tuần", team: "Backend + AI", dependencies: [1, 3], stepCount: 25, criticalPath: true, estimatedStart: "2026-04-06", estimatedEnd: "2026-04-24", blockers: [] },
  { id: 6, name: "Quản lý Hợp đồng & Báo giá", shortName: "P6: Contracts", description: "Quote Builder, Contract Lifecycle, E-Sign", status: "planned", progress: 0, duration: "3 tuần", team: "Backend + Frontend", dependencies: [1], stepCount: 28, criticalPath: false, estimatedStart: "2026-04-27", estimatedEnd: "2026-05-15", blockers: [] },
  { id: 7, name: "Tài chính & Thanh toán", shortName: "P7: Finance", description: "Invoice, Subscription, Commission, Revenue", status: "planned", progress: 0, duration: "4 tuần", team: "Backend + Integration", dependencies: [6], stepCount: 32, criticalPath: false, estimatedStart: "2026-05-18", estimatedEnd: "2026-06-12", blockers: [] },
  { id: 8, name: "Hỗ trợ Khách hàng", shortName: "P8: Support", description: "Ticketing, SLA, Knowledge Base, Chatbot", status: "planned", progress: 0, duration: "3 tuần", team: "Full-stack + AI", dependencies: [2, 5], stepCount: 27, criticalPath: true, estimatedStart: "2026-04-27", estimatedEnd: "2026-05-15", blockers: [] },
  { id: 9, name: "HR & Quản lý Nhân sự", shortName: "P9: HR", description: "Employee, Evaluation, Gamification, OKR", status: "planned", progress: 0, duration: "3 tuần", team: "Backend + Frontend", dependencies: [0], stepCount: 24, criticalPath: false, estimatedStart: "2026-05-18", estimatedEnd: "2026-06-05", blockers: [] },
  { id: 10, name: "AI Agent Framework", shortName: "P10: AI Agent", description: "Agent Runtime, Tool Chain, Training Pipeline", status: "planned", progress: 0, duration: "5 tuần", team: "AI/ML Team", dependencies: [3, 5], stepCount: 38, criticalPath: true, estimatedStart: "2026-05-18", estimatedEnd: "2026-06-19", blockers: [] },
  { id: 11, name: "Analytics & Reporting", shortName: "P11: Analytics", description: "Dashboards, Custom Reports, Data Export", status: "planned", progress: 0, duration: "3 tuần", team: "Frontend + Data", dependencies: [1, 3, 7], stepCount: 26, criticalPath: false, estimatedStart: "2026-06-15", estimatedEnd: "2026-07-03", blockers: [] },
  { id: 12, name: "Integration Hub", shortName: "P12: Integrations", description: "API Gateway, Webhooks, 3rd-party connectors", status: "planned", progress: 0, duration: "4 tuần", team: "Backend + DevOps", dependencies: [2, 10], stepCount: 30, criticalPath: true, estimatedStart: "2026-06-22", estimatedEnd: "2026-07-17", blockers: [] },
  { id: 13, name: "Bảo mật & Tuân thủ", shortName: "P13: Security", description: "RBAC, Audit, GDPR, Encryption, SSO", status: "planned", progress: 0, duration: "3 tuần", team: "Security + Backend", dependencies: [0, 1], stepCount: 28, criticalPath: false, estimatedStart: "2026-07-20", estimatedEnd: "2026-08-07", blockers: [] },
  { id: 14, name: "Mobile & Offline", shortName: "P14: Mobile", description: "PWA, Offline Sync, Push Notifications", status: "planned", progress: 0, duration: "4 tuần", team: "Mobile Team", dependencies: [1, 2, 12], stepCount: 25, criticalPath: false, estimatedStart: "2026-07-20", estimatedEnd: "2026-08-14", blockers: [] },
  { id: 15, name: "Performance & Scale", shortName: "P15: Scale", description: "Caching, CDN, DB optimization, Load Testing", status: "planned", progress: 0, duration: "3 tuần", team: "DevOps + Backend", dependencies: [12, 13], stepCount: 22, criticalPath: true, estimatedStart: "2026-08-17", estimatedEnd: "2026-09-04", blockers: [] },
  { id: 16, name: "Testing & QA", shortName: "P16: QA", description: "E2E tests, Performance tests, Security audit", status: "planned", progress: 0, duration: "3 tuần", team: "QA Team", dependencies: [15], stepCount: 28, criticalPath: true, estimatedStart: "2026-09-07", estimatedEnd: "2026-09-25", blockers: [] },
  { id: 17, name: "Launch & Go-live", shortName: "P17: Launch", description: "Production deploy, migration, monitoring, training", status: "planned", progress: 0, duration: "2 tuần", team: "All Teams", dependencies: [16], stepCount: 20, criticalPath: true, estimatedStart: "2026-09-28", estimatedEnd: "2026-10-09", blockers: [] },
];

/* ============================================================
 * Canvas Graph Renderer
 * ============================================================ */
function PhaseGraph({ phases, selectedId, onSelect }: {
  phases: PhaseNode[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);

  // Layout: arrange phases in rows by dependency depth
  const layout = useMemo(() => {
    const depths: Record<number, number> = {};
    const getDepth = (id: number, visited = new Set<number>()): number => {
      if (visited.has(id)) return 0;
      visited.add(id);
      if (depths[id] !== undefined) return depths[id];
      const p = phases.find((ph) => ph.id === id);
      if (!p || p.dependencies.length === 0) { depths[id] = 0; return 0; }
      depths[id] = Math.max(...p.dependencies.map((d) => getDepth(d, visited))) + 1;
      return depths[id];
    };
    phases.forEach((p) => getDepth(p.id));

    const rows: Record<number, number[]> = {};
    phases.forEach((p) => {
      const d = depths[p.id] ?? 0;
      if (!rows[d]) rows[d] = [];
      rows[d].push(p.id);
    });

    const nodeW = 160, nodeH = 56, gapX = 40, gapY = 80;
    const positions: Record<number, { x: number; y: number }> = {};
    const maxDepth = Math.max(...Object.keys(rows).map(Number));

    for (let d = 0; d <= maxDepth; d++) {
      const ids = rows[d] || [];
      const totalW = ids.length * nodeW + (ids.length - 1) * gapX;
      const startX = (Math.max(totalW, 400) - totalW) / 2 + 30;
      ids.forEach((id, i) => {
        positions[id] = { x: startX + i * (nodeW + gapX), y: 30 + d * (nodeH + gapY) };
      });
    }

    const canvasW = Math.max(...Object.values(positions).map((p) => p.x + nodeW + 30), 600);
    const canvasH = Math.max(...Object.values(positions).map((p) => p.y + nodeH + 30), 400);
    return { positions, nodeW, nodeH, canvasW, canvasH };
  }, [phases]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = layout.canvasW * zoom;
    const h = layout.canvasH * zoom;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr * zoom, dpr * zoom);

    ctx.clearRect(0, 0, layout.canvasW, layout.canvasH);

    // Draw edges
    phases.forEach((p) => {
      p.dependencies.forEach((depId) => {
        const from = layout.positions[depId];
        const to = layout.positions[p.id];
        if (!from || !to) return;

        const isCritical = p.criticalPath && phases.find((ph) => ph.id === depId)?.criticalPath;
        ctx.beginPath();
        ctx.strokeStyle = isCritical ? "#8b5cf6" : "#d1d5db";
        ctx.lineWidth = isCritical ? 2 : 1;
        if (isCritical) ctx.setLineDash([]);
        else ctx.setLineDash([4, 4]);

        const fromX = from.x + layout.nodeW / 2;
        const fromY = from.y + layout.nodeH;
        const toX = to.x + layout.nodeW / 2;
        const toY = to.y;

        ctx.moveTo(fromX, fromY);
        ctx.bezierCurveTo(fromX, fromY + 30, toX, toY - 30, toX, toY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Arrow
        const angle = Math.atan2(toY - (toY - 20), toX - toX);
        ctx.beginPath();
        ctx.fillStyle = isCritical ? "#8b5cf6" : "#d1d5db";
        ctx.moveTo(toX, toY);
        ctx.lineTo(toX - 5, toY - 8);
        ctx.lineTo(toX + 5, toY - 8);
        ctx.fill();
      });
    });

    // Draw nodes
    phases.forEach((p) => {
      const pos = layout.positions[p.id];
      if (!pos) return;
      const cfg = STATUS_CFG[p.status];
      const isSelected = selectedId === p.id;

      // Shadow
      if (isSelected) {
        ctx.shadowColor = "rgba(139,92,246,0.3)";
        ctx.shadowBlur = 12;
      }

      // Node rect
      ctx.beginPath();
      ctx.roundRect(pos.x, pos.y, layout.nodeW, layout.nodeH, 8);
      ctx.fillStyle = isSelected ? "#f5f3ff" : cfg.fillColor;
      ctx.fill();
      ctx.strokeStyle = isSelected ? "#8b5cf6" : cfg.borderColor;
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.stroke();
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;

      // Phase number badge
      ctx.beginPath();
      ctx.roundRect(pos.x + 6, pos.y + 6, 22, 16, 4);
      ctx.fillStyle = cfg.borderColor;
      ctx.fill();
      ctx.fillStyle = "#fff";
      ctx.font = "bold 9px system-ui";
      ctx.textAlign = "center";
      ctx.fillText(`${p.id}`, pos.x + 17, pos.y + 17);

      // Name
      ctx.fillStyle = "#1f2937";
      ctx.font = "11px system-ui";
      ctx.textAlign = "left";
      const maxTextW = layout.nodeW - 40;
      let name = p.shortName.replace(/^P\d+: /, "");
      if (ctx.measureText(name).width > maxTextW) {
        while (ctx.measureText(name + "…").width > maxTextW && name.length > 3) name = name.slice(0, -1);
        name += "…";
      }
      ctx.fillText(name, pos.x + 34, pos.y + 18);

      // Progress bar
      const barY = pos.y + 28;
      ctx.beginPath();
      ctx.roundRect(pos.x + 6, barY, layout.nodeW - 12, 6, 3);
      ctx.fillStyle = "#e5e7eb";
      ctx.fill();
      if (p.progress > 0) {
        ctx.beginPath();
        ctx.roundRect(pos.x + 6, barY, (layout.nodeW - 12) * (p.progress / 100), 6, 3);
        ctx.fillStyle = cfg.borderColor;
        ctx.fill();
      }

      // Progress text
      ctx.fillStyle = "#6b7280";
      ctx.font = "9px system-ui";
      ctx.fillText(`${p.progress}% • ${p.stepCount} bước • ${p.duration}`, pos.x + 6, pos.y + 48);

      // Critical path indicator
      if (p.criticalPath) {
        ctx.beginPath();
        ctx.arc(pos.x + layout.nodeW - 10, pos.y + 10, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#8b5cf6";
        ctx.fill();
      }
    });
  }, [phases, layout, zoom, selectedId]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    for (const p of phases) {
      const pos = layout.positions[p.id];
      if (!pos) continue;
      if (x >= pos.x && x <= pos.x + layout.nodeW && y >= pos.y && y <= pos.y + layout.nodeH) {
        onSelect(p.id);
        return;
      }
    }
    onSelect(-1);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-1 mb-2">
        <button type="button" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
          className="p-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          <ZoomOut className="w-3.5 h-3.5 text-gray-500" />
        </button>
        <span className="text-[10px] text-gray-400 w-10 text-center">{Math.round(zoom * 100)}%</span>
        <button type="button" onClick={() => setZoom(Math.min(1.5, zoom + 0.1))}
          className="p-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          <ZoomIn className="w-3.5 h-3.5 text-gray-500" />
        </button>
        <button type="button" onClick={() => setZoom(1)}
          className="p-1.5 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          <Maximize2 className="w-3.5 h-3.5 text-gray-500" />
        </button>
        <div className="flex items-center gap-3 ml-auto text-[8px] text-gray-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" /> Hoàn thành</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500" /> Đang làm</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-400" /> Kế hoạch</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-violet-500" /> Critical Path</span>
        </div>
      </div>
      <div className="overflow-auto border border-gray-200 rounded-xl bg-white" style={{ maxHeight: "500px" }}>
        <canvas ref={canvasRef} onClick={handleClick} className="cursor-pointer" />
      </div>
    </div>
  );
}

/* ============================================================
 * Main Page
 * ============================================================ */
export function DependencyGraphPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [view, setView] = useState<"graph" | "list">("graph");

  const selected = selectedId !== null && selectedId >= 0 ? PHASES.find((p) => p.id === selectedId) : null;

  const stats = useMemo(() => {
    const completed = PHASES.filter((p) => p.status === "completed").length;
    const inProgress = PHASES.filter((p) => p.status === "in-progress").length;
    const totalSteps = PHASES.reduce((s, p) => s + p.stepCount, 0);
    const completedSteps = PHASES.filter((p) => p.status === "completed").reduce((s, p) => s + p.stepCount, 0) +
      PHASES.filter((p) => p.status === "in-progress").reduce((s, p) => s + Math.round(p.stepCount * p.progress / 100), 0);
    const criticalPathPhases = PHASES.filter((p) => p.criticalPath).length;
    return { completed, inProgress, totalSteps, completedSteps, criticalPathPhases, totalPhases: PHASES.length };
  }, []);

  const overallProgress = Math.round((stats.completedSteps / stats.totalSteps) * 100);

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <GitBranch className="w-6 h-6 text-violet-600" /> Dependency Graph
        </h1>
        <p className="text-gray-500 mt-0.5">
          Biểu đồ phụ thuộc 18 phases — critical path, tiến độ, bottleneck detection
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        <div className="bg-white rounded-xl border border-gray-100 p-2 text-center">
          <p className="text-lg text-gray-900">{stats.totalPhases}</p>
          <p className="text-[8px] text-gray-400">Phases</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2 text-center">
          <p className="text-lg text-green-600">{stats.completed}</p>
          <p className="text-[8px] text-green-700">Hoàn thành</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2 text-center">
          <p className="text-lg text-blue-600">{stats.inProgress}</p>
          <p className="text-[8px] text-blue-700">Đang làm</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-2 text-center">
          <p className="text-lg text-violet-600">{stats.criticalPathPhases}</p>
          <p className="text-[8px] text-violet-700">Critical Path</p>
        </div>
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-2 text-center">
          <p className="text-lg text-amber-600">{stats.totalSteps}</p>
          <p className="text-[8px] text-amber-700">Tổng bước</p>
        </div>
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-2 text-center">
          <p className="text-lg text-emerald-600">{overallProgress}%</p>
          <p className="text-[8px] text-emerald-700">Tiến độ</p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="bg-white rounded-xl border border-gray-100 p-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-gray-500">Tiến độ tổng thể</span>
          <span className="text-xs text-gray-900">{stats.completedSteps}/{stats.totalSteps} bước ({overallProgress}%)</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-green-400 via-blue-400 to-violet-500 transition-all"
            style={{ width: `${overallProgress}%` }} />
        </div>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-1">
        <button type="button" onClick={() => setView("graph")}
          className={`px-3 py-1.5 rounded-lg text-sm ${view === "graph" ? "bg-violet-600 text-white" : "bg-white border border-gray-200 text-gray-500"}`}>
          <GitBranch className="w-4 h-4 inline mr-1" /> Graph
        </button>
        <button type="button" onClick={() => setView("list")}
          className={`px-3 py-1.5 rounded-lg text-sm ${view === "list" ? "bg-violet-600 text-white" : "bg-white border border-gray-200 text-gray-500"}`}>
          <Layers className="w-4 h-4 inline mr-1" /> List
        </button>
      </div>

      {/* Graph View */}
      {view === "graph" && <PhaseGraph phases={PHASES} selectedId={selectedId} onSelect={setSelectedId} />}

      {/* List View */}
      {view === "list" && (
        <div className="space-y-2">
          {PHASES.map((p) => {
            const cfg = STATUS_CFG[p.status];
            return (
              <button key={p.id} type="button"
                onClick={() => setSelectedId(selectedId === p.id ? null : p.id)}
                className={`w-full text-left p-3 rounded-xl border transition-colors ${
                  selectedId === p.id ? "border-violet-300 bg-violet-50" : "border-gray-100 bg-white hover:bg-gray-50"
                }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs text-white flex-shrink-0`}
                    style={{ backgroundColor: cfg.borderColor }}>
                    {p.id}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs text-gray-900">{p.name}</span>
                      <span className={`text-[7px] px-1 py-0.5 rounded border ${cfg.bg} ${cfg.color} border-current`}>{cfg.label}</span>
                      {p.criticalPath && <span className="text-[7px] px-1 py-0.5 bg-violet-100 text-violet-600 rounded border border-violet-200">Critical</span>}
                    </div>
                    <p className="text-[9px] text-gray-400">{p.team} • {p.duration} • {p.stepCount} bước • Deps: {p.dependencies.length > 0 ? p.dependencies.map((d) => `P${d}`).join(", ") : "Không"}</p>
                  </div>
                  <div className="w-16 flex-shrink-0">
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${p.progress}%`, backgroundColor: cfg.borderColor }} />
                    </div>
                    <p className="text-[8px] text-gray-400 text-right mt-0.5">{p.progress}%</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Selected Phase Detail */}
      {selected && (
        <div className="bg-white rounded-xl border border-violet-200 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm"
              style={{ backgroundColor: STATUS_CFG[selected.status].borderColor }}>
              {selected.id}
            </div>
            <div className="flex-1">
              <h3 className="text-sm text-gray-900">{selected.name}</h3>
              <p className="text-[10px] text-gray-400">{selected.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2 bg-gray-50 rounded-lg text-center">
              <p className="text-xs text-gray-900">{selected.stepCount}</p>
              <p className="text-[8px] text-gray-400">Bước</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg text-center">
              <p className="text-xs text-gray-900">{selected.duration}</p>
              <p className="text-[8px] text-gray-400">Thời lượng</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg text-center">
              <p className="text-xs text-gray-900">{selected.team}</p>
              <p className="text-[8px] text-gray-400">Team</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg text-center">
              <p className="text-xs text-gray-900">{selected.estimatedStart} → {selected.estimatedEnd}</p>
              <p className="text-[8px] text-gray-400">Timeline</p>
            </div>
          </div>

          {selected.dependencies.length > 0 && (
            <div>
              <p className="text-[9px] text-gray-400 mb-1">Phụ thuộc vào:</p>
              <div className="flex flex-wrap gap-1">
                {selected.dependencies.map((d) => {
                  const dep = PHASES.find((p) => p.id === d);
                  return (
                    <button key={d} type="button" onClick={() => setSelectedId(d)}
                      className="text-[8px] px-2 py-1 bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100">
                      Phase {d}: {dep?.shortName.replace(/^P\d+: /, "") ?? ""}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dependents */}
          {(() => {
            const dependents = PHASES.filter((p) => p.dependencies.includes(selected.id));
            if (dependents.length === 0) return null;
            return (
              <div>
                <p className="text-[9px] text-gray-400 mb-1">Phases phụ thuộc phase này:</p>
                <div className="flex flex-wrap gap-1">
                  {dependents.map((dep) => (
                    <button key={dep.id} type="button" onClick={() => setSelectedId(dep.id)}
                      className="text-[8px] px-2 py-1 bg-violet-50 text-violet-600 rounded border border-violet-200 hover:bg-violet-100">
                      Phase {dep.id}: {dep.shortName.replace(/^P\d+: /, "")}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h4 className="text-sm text-violet-900">AI Dependency Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-violet-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span><strong>Critical Path:</strong> P0 → P1 → P3 → P5 → P10 → P12 → P15 → P16 → P17. Tổng <strong>10 phases</strong>, ước tính <strong>34 tuần</strong>. Delay bất kỳ phase nào sẽ ảnh hưởng deadline cuối.</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span><strong>Bottleneck:</strong> Phase 10 (AI Agent) phụ thuộc cả P3 và P5 — cả hai đang in-progress. Nếu P3 trễ 1 tuần, cascade delay đến P10, P12, P15, P16, P17 (~5 phases).</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span><strong>Tối ưu:</strong> P4 (Marketing) và P9 (HR) độc lập khỏi critical path — có thể assign team riêng chạy song song mà không ảnh hưởng deadline chính.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
