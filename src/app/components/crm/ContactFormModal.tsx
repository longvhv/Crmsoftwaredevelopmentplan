/**
 * Modal form tạo/chỉnh sửa liên hệ.
 * Sử dụng ComboboxSelect cho danh mục (type, status, source).
 */
import { useState, useEffect, useCallback } from "react";
import { X, Plus, Save, User } from "lucide-react";
import type { Contact, ContactType, ContactStatus } from "../../types/crm";
import {
  CONTACT_TYPE_CONFIG,
  CONTACT_TYPE_OPTIONS,
  CONTACT_STATUS_CONFIG,
  CONTACT_SOURCES,
} from "../../constants/crmConfig";
import { employees } from "../../data/crmData";

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Contact, "id">) => Promise<void>;
  /** Contact hiện tại nếu đang chỉnh sửa, null nếu tạo mới */
  editingContact?: Contact | null;
}

/** Combobox nhỏ — select + có thể thêm mới */
function CategorySelect({
  label,
  value,
  options,
  onChange,
  renderLabel,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  renderLabel?: (v: string) => string;
}) {
  const [showAdd, setShowAdd] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [localOptions, setLocalOptions] = useState(options);

  const handleAdd = () => {
    const trimmed = newValue.trim();
    if (trimmed && !localOptions.includes(trimmed)) {
      setLocalOptions([...localOptions, trimmed]);
      onChange(trimmed);
    }
    setNewValue("");
    setShowAdd(false);
  };

  return (
    <div>
      <label className="text-xs text-gray-500 mb-1 block">{label}</label>
      <div className="flex items-center gap-1">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          <option value="">— Chọn —</option>
          {localOptions.map((opt) => (
            <option key={opt} value={opt}>
              {renderLabel ? renderLabel(opt) : opt}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          className="p-2 rounded-lg border border-gray-200 text-gray-400 hover:text-violet-600 hover:border-violet-300 transition-colors"
          title="Thêm mới"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      {showAdd && (
        <div className="flex items-center gap-1 mt-1">
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            placeholder={`Thêm ${label.toLowerCase()} mới...`}
            className="flex-1 px-2.5 py-1.5 bg-white border border-violet-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            autoFocus
          />
          <button
            type="button"
            onClick={handleAdd}
            className="px-2.5 py-1.5 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700"
          >
            Thêm
          </button>
        </div>
      )}
    </div>
  );
}

export function ContactFormModal({
  isOpen,
  onClose,
  onSave,
  editingContact,
}: ContactFormModalProps) {
  const isEditing = !!editingContact;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    position: "",
    type: "lead" as ContactType,
    status: "prospect" as ContactStatus,
    source: "",
    assignedTo: "",
    tags: [] as string[],
    notes: "",
  });

  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingContact) {
      setForm({
        name: editingContact.name,
        email: editingContact.email,
        phone: editingContact.phone,
        company: editingContact.company,
        position: editingContact.position,
        type: editingContact.type,
        status: editingContact.status,
        source: editingContact.source,
        assignedTo: editingContact.assignedTo,
        tags: [...editingContact.tags],
        notes: editingContact.notes || "",
      });
    } else {
      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        position: "",
        type: "lead",
        status: "prospect",
        source: "",
        assignedTo: "",
        tags: [],
        notes: "",
      });
    }
    setTagInput("");
  }, [editingContact, isOpen]);

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

  const handleSave = async () => {
    if (!form.name || !form.email) return;
    setSaving(true);
    try {
      await onSave({
        ...form,
        aiLeadScore: editingContact?.aiLeadScore ?? Math.floor(Math.random() * 40) + 50,
        engagementScore: editingContact?.engagementScore ?? Math.floor(Math.random() * 30) + 30,
        lastContactDate: editingContact?.lastContactDate ?? new Date().toISOString().split("T")[0],
        createdDate: editingContact?.createdDate ?? new Date().toISOString().split("T")[0],
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
            <User className="w-5 h-5 text-violet-600" />
            <h3 className="text-gray-900">
              {isEditing ? "Chỉnh sửa liên hệ" : "Tạo liên hệ mới"}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4">
          {/* Tên & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Họ tên *</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                placeholder="Nguyễn Văn A"
                className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Email *</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="email@company.com"
                className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Phone & Position */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Điện thoại</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="+84-xxx"
                className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Chức vụ</label>
              <input
                type="text"
                value={form.position}
                onChange={(e) => updateField("position", e.target.value)}
                placeholder="CTO, PM, ..."
                className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Company */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Công ty</label>
            <input
              type="text"
              value={form.company}
              onChange={(e) => updateField("company", e.target.value)}
              placeholder="Tên công ty"
              className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Danh mục: Type & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CategorySelect
              label="Loại liên hệ"
              value={form.type}
              options={CONTACT_TYPE_OPTIONS}
              onChange={(v) => updateField("type", v as ContactType)}
              renderLabel={(v) => CONTACT_TYPE_CONFIG[v as ContactType]?.label ?? v}
            />
            <CategorySelect
              label="Trạng thái"
              value={form.status}
              options={["active", "inactive", "prospect", "churned"]}
              onChange={(v) => updateField("status", v as ContactStatus)}
              renderLabel={(v) => CONTACT_STATUS_CONFIG[v as ContactStatus]?.label ?? v}
            />
          </div>

          {/* Source & Assigned */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <CategorySelect
              label="Nguồn"
              value={form.source}
              options={[...CONTACT_SOURCES]}
              onChange={(v) => updateField("source", v)}
            />
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
                    {emp.name} ({emp.primaryRole.name})
                  </option>
                ))}
              </select>
            </div>
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
            disabled={!form.name || !form.email || saving}
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
