/**
 * Email Sequence Builder Page — P2.03
 * Build và quản lý email sequences với visual flow builder đơn giản
 */
import { useState, useMemo, useCallback, useEffect } from "react";
import { Search, Mail, Plus, Play, Pause, Trash2, Clock, GitBranch, CheckSquare, Bot, Users, TrendingUp, MessageSquare, X } from "lucide-react";
import { toast } from "sonner";
import type { EmailSequence, EmailSequenceStatus, SequenceStep } from "../../types/crm";
import { EMAIL_SEQUENCE_STATUS_CONFIG, SEQUENCE_STEP_TYPE_CONFIG, CRM_ASSIGNEES } from "../../constants/crmConfig";
import { fetchEmailSequences, deleteEmailSequence, fetchEmailTemplates, createEmailSequence } from "../../api/crmApi";
import { AIScoreTrigger } from "../../components/crm/AIScoreModal";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";

/* ============================================================
 * Step Badge Component
 * ============================================================ */
function StepBadge({ step }: { step: SequenceStep }) {
  const cfg = SEQUENCE_STEP_TYPE_CONFIG[step.type];
  
  const getIcon = () => {
    if (step.type === "email") return <Mail className="w-3 h-3" />;
    if (step.type === "wait") return <Clock className="w-3 h-3" />;
    if (step.type === "condition") return <GitBranch className="w-3 h-3" />;
    return <CheckSquare className="w-3 h-3" />;
  };

  const getLabel = () => {
    if (step.type === "email") return `Email #${step.templateId}`;
    if (step.type === "wait") return `${step.delayHours}h`;
    if (step.type === "condition") return step.condition?.type;
    if (step.type === "task") return step.taskTitle?.substring(0, 15) + "...";
    return step.type;
  };

  return (
    <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] ${cfg.color} bg-white border border-gray-200`}>
      {getIcon()}
      <span className="truncate max-w-[100px]">{getLabel()}</span>
    </div>
  );
}

/* ============================================================
 * Sequence Card
 * ============================================================ */
function SequenceCard({ sequence, onDelete }: { sequence: EmailSequence; onDelete: () => void }) {
  const statusCfg = EMAIL_SEQUENCE_STATUS_CONFIG[sequence.status];
  const creator = CRM_ASSIGNEES.find((a) => a.id === sequence.createdBy);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-sm text-gray-900 truncate">{sequence.name}</h4>
            <span className={`text-[10px] px-1.5 py-0.5 rounded ${statusCfg.bgColor} ${statusCfg.color}`}>
              {statusCfg.label}
            </span>
          </div>
          <p className="text-xs text-gray-400 line-clamp-2">{sequence.description}</p>
        </div>
        <AIScoreTrigger score={sequence.aiScore} name={sequence.name} category="email-sequence" />
      </div>

      {/* Flow steps visualization */}
      <div className="mb-3 bg-gray-50 rounded-lg p-2 border border-gray-100">
        <div className="flex items-center gap-1 flex-wrap">
          {sequence.steps.slice(0, 6).map((step, idx) => (
            <div key={step.id} className="flex items-center gap-1">
              {idx > 0 && <div className="w-3 h-px bg-gray-300" />}
              <StepBadge step={step} />
            </div>
          ))}
          {sequence.steps.length > 6 && (
            <span className="text-[10px] text-gray-400 ml-1">+{sequence.steps.length - 6} more</span>
          )}
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5">{sequence.steps.length} bước</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="text-center bg-blue-50 rounded-lg p-2 border border-blue-100">
          <p className="text-xs text-blue-700 flex items-center justify-center gap-0.5">
            <Users className="w-3 h-3" /> {sequence.enrolledCount}
          </p>
          <p className="text-[10px] text-blue-600">Enrolled</p>
        </div>
        <div className="text-center bg-green-50 rounded-lg p-2 border border-green-100">
          <p className="text-xs text-green-700 flex items-center justify-center gap-0.5">
            <TrendingUp className="w-3 h-3" /> {sequence.openRate}%
          </p>
          <p className="text-[10px] text-green-600">Open</p>
        </div>
        <div className="text-center bg-violet-50 rounded-lg p-2 border border-violet-100">
          <p className="text-xs text-violet-700 flex items-center justify-center gap-0.5">
            <MessageSquare className="w-3 h-3" /> {sequence.replyRate}%
          </p>
          <p className="text-[10px] text-violet-600">Reply</p>
        </div>
        <div className="text-center bg-gray-50 rounded-lg p-2 border border-gray-100">
          <p className="text-xs text-gray-700">{sequence.completedCount}</p>
          <p className="text-[10px] text-gray-600">Done</p>
        </div>
      </div>

      {/* Tags & Actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 flex-wrap flex-1 min-w-0">
          {sequence.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">{tag}</span>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {sequence.status === "active" ? (
            <button
              type="button"
              onClick={() => toast.success(`Tạm dừng sequence "${sequence.name}"`)}
              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
              title="Pause"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => toast.success(`Kích hoạt sequence "${sequence.name}"`)}
              className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Activate"
            >
              <Play className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={onDelete}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Footer metadata */}
      <div className="mt-3 pt-3 border-t border-gray-100 text-[10px] text-gray-400">
        {creator && `Tạo bởi ${creator.name}`} • {new Date(sequence.createdAt).toLocaleDateString("vi-VN")}
      </div>
    </div>
  );
}

/* ============================================================
 * Create Sequence Modal
 * ============================================================ */
function CreateSequenceModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) { toast.error("Vui lòng nhập tên sequence"); return; }
    setSaving(true);
    await createEmailSequence({
      name, description: description || `Email sequence — ${name}`,
      status: "draft", steps: [],
      enrolledCount: 0, completedCount: 0,
      openRate: 0, replyRate: 0, aiScore: 0,
      createdBy: "user_001",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: [],
    });
    toast.success(`Đã tạo sequence "${name}"`);
    setSaving(false);
    onCreated();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Tạo Email Sequence</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tên sequence *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Welcome Onboarding"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mô tả</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Mô tả mục tiêu và đối tượng..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo sequence"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Main Page
 * ============================================================ */
export function EmailSequenceBuilderPage() {
  // State
  const [sequences, setSequences] = useState<EmailSequence[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<EmailSequenceStatus | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<EmailSequence | null>(null);

  // Load data
  const loadSequences = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchEmailSequences({ search, status: filterStatus });
      setSequences(data);
    } catch (error) {
      toast.error("Không thể tải danh sách sequences");
    } finally {
      setLoading(false);
    }
  }, [search, filterStatus]);

  useEffect(() => {
    loadSequences();
  }, [loadSequences]);

  // Stats
  const stats = useMemo(() => {
    const active = sequences.filter((s) => s.status === "active").length;
    const totalEnrolled = sequences.reduce((s, seq) => s + seq.enrolledCount, 0);
    const avgOpenRate = sequences.length > 0 ? Math.round(sequences.reduce((s, seq) => s + seq.openRate, 0) / sequences.length) : 0;
    const avgReplyRate = sequences.length > 0 ? Math.round(sequences.reduce((s, seq) => s + seq.replyRate, 0) / sequences.length) : 0;
    const avgAiScore = sequences.length > 0 ? Math.round(sequences.reduce((s, seq) => s + seq.aiScore, 0) / sequences.length) : 0;
    return { total: sequences.length, active, totalEnrolled, avgOpenRate, avgReplyRate, avgAiScore };
  }, [sequences]);

  // Handlers
  const handleDeleteConfirm = useCallback(
    async () => {
      if (!deleteTarget) return;
      await deleteEmailSequence(deleteTarget.id);
      toast.success(`Đã xoá sequence "${deleteTarget.name}"`);
      setDeleteTarget(null);
      loadSequences();
    },
    [deleteTarget, loadSequences],
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-gray-900">Email Sequence Builder</h1>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 flex items-center gap-1">
              <GitBranch className="w-3 h-3" /> Automation
            </span>
          </div>
          <p className="text-gray-500">Xây dựng và quản lý email sequences tự động</p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> Tạo Sequence
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Tổng</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-3 text-center">
          <p className="text-lg text-green-700 flex items-center justify-center gap-0.5">
            <Play className="w-4 h-4" /> {stats.active}
          </p>
          <p className="text-xs text-green-600">Đang chạy</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-100 p-3 text-center">
          <p className="text-lg text-blue-700">{stats.totalEnrolled}</p>
          <p className="text-xs text-blue-600">Enrolled</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-100 p-3 text-center">
          <p className="text-lg text-green-700">{stats.avgOpenRate}%</p>
          <p className="text-xs text-green-600">Open TB</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-100 p-3 text-center">
          <p className="text-lg text-violet-700">{stats.avgReplyRate}%</p>
          <p className="text-xs text-violet-600">Reply TB</p>
        </div>
        <div className="bg-indigo-50 rounded-xl border border-indigo-100 p-3 text-center">
          <p className="text-lg text-indigo-700 flex items-center justify-center gap-0.5">
            <Bot className="w-4 h-4" /> {stats.avgAiScore}
          </p>
          <p className="text-xs text-indigo-600">AI Score TB</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm sequence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 w-64"
          />
        </div>

        {/* Status filter */}
        <select
          value={filterStatus ?? ""}
          onChange={(e) => setFilterStatus(e.target.value ? (e.target.value as EmailSequenceStatus) : null)}
          className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="">Tất cả trạng thái</option>
          {Object.entries(EMAIL_SEQUENCE_STATUS_CONFIG).map(([key, cfg]) => (
            <option key={key} value={key}>
              {cfg.label}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
        </div>
      ) : sequences.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <GitBranch className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">Chưa có sequence nào</p>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="mt-3 text-sm text-violet-600 hover:text-violet-700"
          >
            Tạo sequence đầu tiên
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sequences.map((seq) => (
            <SequenceCard key={seq.id} sequence={seq} onDelete={() => setDeleteTarget(seq)} />
          ))}
        </div>
      )}
      {showCreateModal && <CreateSequenceModal onClose={() => setShowCreateModal(false)} onCreated={loadSequences} />}
      <ConfirmDeleteDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        itemName={deleteTarget?.name ?? ""}
        entityType="sequence"
        description="Sequence đã xoá không thể khôi phục."
      />
    </div>
  );
}