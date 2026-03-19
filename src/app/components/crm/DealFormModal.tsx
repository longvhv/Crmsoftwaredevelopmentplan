/**
 * Modal form tạo/chỉnh sửa Deal.
 * Sử dụng ComboboxSelect cho danh mục (stage, priority).
 */
import { useState, useEffect, useCallback } from "react";
import { X, Plus, Save, Target } from "lucide-react";
import type { Deal, DealStage, DealPriority } from "../../types/crm";
import {
  DEAL_STAGE_CONFIG,
  ACTIVE_DEAL_STAGES,
  DEAL_PRIORITY_CONFIG,
} from "../../constants/crmConfig";
import { contacts, employees } from "../../data/crmData";

interface DealFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Deal, "id">) => Promise<void>;
  editingDeal?: Deal | null;
}

export function DealFormModal({
  isOpen,
  onClose,
  onSave,
  editingDeal,
}: DealFormModalProps) {
  const isEditing = !!editingDeal;

  const [form, setForm] = useState({
    title: "",
    contactId: "",
    value: 0,
    currency: "USD",
    stage: "qualification" as DealStage,
    priority: "warm" as DealPriority,
    probability: 20,
    assignedTo: "",
    expectedCloseDate: "",
    tags: [] as string[],
    notes: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingDeal) {
      setForm({
        title: editingDeal.title,
        contactId: editingDeal.contactId,
        value: editingDeal.value,
        currency: editingDeal.currency,
        stage: editingDeal.stage,
        priority: editingDeal.priority,
        probability: editingDeal.probability,
        assignedTo: editingDeal.assignedTo,
        expectedCloseDate: editingDeal.expectedCloseDate,
        tags: [...editingDeal.tags],
        notes: editingDeal.notes || "",
      });
    } else {
      setForm({
        title: "",
        contactId: "",
        value: 0,
        currency: "USD",
        stage: "qualification",
        priority: "warm",
        probability: 20,
        assignedTo: "",
        expectedCloseDate: "",
        tags: [],
        notes: "",
      });
    }
    setTagInput("");
  }, [editingDeal, isOpen]);

  const updateField = useCallback(
    <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !form.tags.includes(trimmed)) {
      updateField("tags", [...form.tags, trimmed]);
    }
    setTagInput("");
  };

  const removeTag = (tag: string) => {
    updateField("tags", form.tags.filter((t) => t !== tag));
  };

  const selectedContact = contacts.find((c) => c.id === form.contactId);

  const handleSave = async () => {
    if (!form.title || !form.contactId) return;
    setSaving(true);
    try {
      await onSave({
        ...form,
        contactName: selectedContact?.name ?? "",
        company: selectedContact?.company ?? "",
        createdDate: editingDeal?.createdDate ?? new Date().toISOString().split("T")[0],
        aiWinProbability: editingDeal?.aiWinProbability ?? Math.floor(Math.random() * 40) + 20,
        aiNextAction: editingDeal?.aiNextAction,
      });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const activeEmployees = employees.filter((e) => e.status === "active");

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-xl rounded-t-xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-violet-600" />
            <h3 className="text-gray-900">
              {isEditing ? "Chỉnh sửa Deal" : "Tạo Deal mới"}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4">
          {/* Tiêu đề deal */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tiêu đề Deal *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="Tên dự án / deal"
              className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Contact & Assigned */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Liên hệ *</label>
              <select
                value={form.contactId}
                onChange={(e) => updateField("contactId", e.target.value)}
                className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">— Chọn liên hệ —</option>
                {contacts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.company})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Người phụ trách</label>
              <select
                value={form.assignedTo}
                onChange={(e) => updateField("assignedTo", e.target.value)}
                className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">— Chọn —</option>
                {activeEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Giá trị & Tiền tệ */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Giá trị (USD)</label>
              <input
                type="number"
                value={form.value || ""}
                onChange={(e) => updateField("value", Number(e.target.value))}
                placeholder="100000"
                min={0}
                className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Xác suất chốt (%)</label>
              <input
                type="number"
                value={form.probability}
                onChange={(e) => updateField("probability", Number(e.target.value))}
                min={0}
                max={100}
                className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Stage & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Giai đoạn</label>
              <select
                value={form.stage}
                onChange={(e) => updateField("stage", e.target.value as DealStage)}
                className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {ACTIVE_DEAL_STAGES.map((s) => (
                  <option key={s} value={s}>
                    {DEAL_STAGE_CONFIG[s].label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Mức ưu tiên</label>
              <select
                value={form.priority}
                onChange={(e) => updateField("priority", e.target.value as DealPriority)}
                className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {(["hot", "warm", "cold"] as DealPriority[]).map((p) => (
                  <option key={p} value={p}>
                    {DEAL_PRIORITY_CONFIG[p].emoji} {DEAL_PRIORITY_CONFIG[p].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Ngày dự kiến chốt */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Ngày dự kiến chốt</label>
            <input
              type="date"
              value={form.expectedCloseDate}
              onChange={(e) => updateField("expectedCloseDate", e.target.value)}
              className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tags</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {form.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-violet-50 text-violet-700 px-2 py-0.5 rounded flex items-center gap-1"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Thêm tag..."
                className="flex-1 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
              />
              <button
                type="button"
                onClick={addTag}
                className="p-1.5 rounded-lg border border-gray-200 text-gray-400 hover:text-violet-600"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Ghi chú</label>
            <textarea
              value={form.notes}
              onChange={(e) => updateField("notes", e.target.value)}
              rows={3}
              placeholder="Ghi chú thêm..."
              className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white px-5 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!form.title || !form.contactId || saving}
            className="px-4 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            {saving ? "Đang lưu..." : isEditing ? "Cập nhật" : "Tạo mới"}
          </button>
        </div>
      </div>
    </div>
  );
}
