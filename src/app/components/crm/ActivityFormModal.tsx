/**
 * Modal form tạo hoạt động mới.
 * Sử dụng CategorySelect cho loại hoạt động, chọn contact/deal liên quan.
 */
import { useState, useEffect, useCallback } from "react";
import { X, Save, Clock } from "lucide-react";
import type { Activity, ActivityType, Contact, Deal } from "../../types/crm";
import { ACTIVITY_TYPE_CONFIG } from "../../constants/crmConfig";
import { employees } from "../../data/crmData";
import { fetchContacts, fetchDeals } from "../../api/crmApi";

interface ActivityFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Activity, "id">) => Promise<void>;
}

export function ActivityFormModal({ isOpen, onClose, onSave }: ActivityFormModalProps) {
  const [form, setForm] = useState({
    type: "call" as ActivityType,
    title: "",
    description: "",
    contactId: "",
    dealId: "",
    performedBy: "",
    duration: 0,
    isAutoLogged: false,
  });

  const [saving, setSaving] = useState(false);
  const [contactList, setContactList] = useState<Contact[]>([]);
  const [dealList, setDealList] = useState<Deal[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchContacts().then(setContactList);
      fetchDeals().then(setDealList);
      setForm({
        type: "call",
        title: "",
        description: "",
        contactId: "",
        dealId: "",
        performedBy: "",
        duration: 0,
        isAutoLogged: false,
      });
    }
  }, [isOpen]);

  const updateField = useCallback(
    <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleSave = async () => {
    if (!form.title || !form.performedBy) return;
    setSaving(true);
    try {
      await onSave({
        ...form,
        performedAt: new Date().toISOString(),
        contactId: form.contactId || undefined,
        dealId: form.dealId || undefined,
        duration: form.duration || undefined,
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
  const activityTypeOptions = Object.entries(ACTIVITY_TYPE_CONFIG);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-xl rounded-t-xl max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-violet-600" />
            <h3 className="text-gray-900">Ghi nhận hoạt động</h3>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-4">
          {/* Loại hoạt động */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Loại hoạt động *</label>
            <div className="grid grid-cols-5 gap-1.5">
              {activityTypeOptions.map(([key, config]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => updateField("type", key as ActivityType)}
                  className={`flex flex-col items-center gap-1 px-2 py-2 rounded-lg border text-xs transition-all ${
                    form.type === key
                      ? "border-violet-300 bg-violet-50 text-violet-700"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tiêu đề */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tiêu đề *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              placeholder="VD: Gọi trao đổi hợp đồng..."
              className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Mô tả */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Mô tả</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={2}
              placeholder="Chi tiết hoạt động..."
              className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {/* Người thực hiện & Thời lượng */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Người thực hiện *</label>
              <select
                value={form.performedBy}
                onChange={(e) => updateField("performedBy", e.target.value)}
                className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">— Chọn —</option>
                {activeEmployees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name} {emp.type === "ai" ? "(AI)" : ""}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Thời lượng (phút)</label>
              <input
                type="number"
                value={form.duration || ""}
                onChange={(e) => updateField("duration", parseInt(e.target.value) || 0)}
                placeholder="30"
                min={0}
                className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          {/* Liên kết Contact & Deal */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Liên hệ liên quan</label>
              <select
                value={form.contactId}
                onChange={(e) => updateField("contactId", e.target.value)}
                className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">— Không chọn —</option>
                {contactList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.company})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Deal liên quan</label>
              <select
                value={form.dealId}
                onChange={(e) => updateField("dealId", e.target.value)}
                className="w-full px-2.5 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value="">— Không chọn —</option>
                {dealList.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.title} ({d.company})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* AI auto-logged */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isAutoLogged}
              onChange={(e) => updateField("isAutoLogged", e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-violet-600 focus:ring-violet-500"
            />
            <span className="text-sm text-gray-600">AI tự động ghi nhận</span>
          </label>
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
            disabled={!form.title || !form.performedBy || saving}
            className="px-4 py-2 text-sm bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" />
            {saving ? "Đang lưu..." : "Ghi nhận"}
          </button>
        </div>
      </div>
    </div>
  );
}
