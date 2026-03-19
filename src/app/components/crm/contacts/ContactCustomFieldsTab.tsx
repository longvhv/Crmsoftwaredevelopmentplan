/**
 * Tab Custom Fields cho Contact Detail Page
 * Quản lý các trường tùy chỉnh: text, number, date, dropdown, multi-select, checkbox
 */
import { useState } from "react";
import { Plus, Pencil, Trash2, Save, X, Settings } from "lucide-react";
import { Button } from "../../ui/button";
import { toast } from "sonner";

type FieldType = "text" | "number" | "date" | "dropdown" | "multi-select" | "checkbox" | "url" | "phone";

interface CustomField {
  id: string;
  name: string;
  type: FieldType;
  value: string | number | boolean | string[];
  options?: string[]; // For dropdown/multi-select
  required?: boolean;
  category?: string;
}

interface ContactCustomFieldsTabProps {
  contactId: string;
  fields?: CustomField[];
}

const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  text: "Văn bản",
  number: "Số",
  date: "Ngày tháng",
  dropdown: "Chọn một",
  "multi-select": "Chọn nhiều",
  checkbox: "Checkbox",
  url: "URL",
  phone: "Số điện thoại",
};

export function ContactCustomFieldsTab({ contactId, fields: initialFields = [] }: ContactCustomFieldsTabProps) {
  const [fields, setFields] = useState<CustomField[]>(initialFields);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newField, setNewField] = useState<Partial<CustomField>>({
    name: "",
    type: "text",
    value: "",
  });

  const handleAddField = () => {
    if (!newField.name || !newField.type) {
      toast.error("Vui lòng nhập tên và chọn loại trường");
      return;
    }

    const field: CustomField = {
      id: `field-${Date.now()}`,
      name: newField.name,
      type: newField.type as FieldType,
      value: newField.type === "checkbox" ? false : newField.type === "multi-select" ? [] : "",
      options: newField.options,
      category: newField.category,
    };

    setFields([...fields, field]);
    setNewField({ name: "", type: "text", value: "" });
    setIsAddingNew(false);
    toast.success("Đã thêm trường mới");
  };

  const handleUpdateField = (fieldId: string, value: any) => {
    setFields(fields.map((f) => (f.id === fieldId ? { ...f, value } : f)));
    toast.success("Đã cập nhật giá trị");
  };

  const handleDeleteField = (fieldId: string) => {
    setFields(fields.filter((f) => f.id !== fieldId));
    toast.success("Đã xóa trường");
  };

  const renderFieldInput = (field: CustomField) => {
    const isEditing = editingFieldId === field.id;

    switch (field.type) {
      case "text":
      case "url":
      case "phone":
        return (
          <input
            type={field.type === "url" ? "url" : field.type === "phone" ? "tel" : "text"}
            value={field.value as string}
            onChange={(e) => handleUpdateField(field.id, e.target.value)}
            disabled={!isEditing}
            className={`w-full px-3 py-2 text-sm border rounded-lg ${
              isEditing
                ? "border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                : "border-gray-200 bg-gray-50"
            }`}
          />
        );

      case "number":
        return (
          <input
            type="number"
            value={field.value as number}
            onChange={(e) => handleUpdateField(field.id, parseFloat(e.target.value))}
            disabled={!isEditing}
            className={`w-full px-3 py-2 text-sm border rounded-lg ${
              isEditing
                ? "border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                : "border-gray-200 bg-gray-50"
            }`}
          />
        );

      case "date":
        return (
          <input
            type="date"
            value={field.value as string}
            onChange={(e) => handleUpdateField(field.id, e.target.value)}
            disabled={!isEditing}
            className={`w-full px-3 py-2 text-sm border rounded-lg ${
              isEditing
                ? "border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                : "border-gray-200 bg-gray-50"
            }`}
          />
        );

      case "dropdown":
        return (
          <select
            value={field.value as string}
            onChange={(e) => handleUpdateField(field.id, e.target.value)}
            disabled={!isEditing}
            className={`w-full px-3 py-2 text-sm border rounded-lg ${
              isEditing
                ? "border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500"
                : "border-gray-200 bg-gray-50"
            }`}
          >
            <option value="">-- Chọn --</option>
            {field.options?.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        );

      case "multi-select":
        return (
          <div className="space-y-2">
            {field.options?.map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={(field.value as string[]).includes(opt)}
                  onChange={(e) => {
                    const current = field.value as string[];
                    const updated = e.target.checked
                      ? [...current, opt]
                      : current.filter((v) => v !== opt);
                    handleUpdateField(field.id, updated);
                  }}
                  disabled={!isEditing}
                  className="rounded border-gray-300"
                />
                {opt}
              </label>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={field.value as boolean}
              onChange={(e) => handleUpdateField(field.id, e.target.checked)}
              disabled={!isEditing}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">
              {field.value ? "Có" : "Không"}
            </span>
          </label>
        );

      default:
        return null;
    }
  };

  // Group fields by category
  const groupedFields = fields.reduce((acc, field) => {
    const category = field.category || "Khác";
    if (!acc[category]) acc[category] = [];
    acc[category].push(field);
    return acc;
  }, {} as Record<string, CustomField[]>);

  return (
    <div className="space-y-5">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Quản lý các trường thông tin tùy chỉnh cho contact này
        </p>
        <Button
          onClick={() => setIsAddingNew(true)}
          size="sm"
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Thêm trường
        </Button>
      </div>

      {/* Add New Field Form */}
      {isAddingNew && (
        <div className="bg-white rounded-xl border-2 border-violet-200 p-5 shadow-sm">
          <h4 className="text-sm text-gray-900 mb-4 flex items-center gap-2">
            <Settings className="w-4 h-4 text-violet-600" />
            Thêm trường mới
          </h4>
          <div className="space-y-3">
            <div>
              <label className="block text-xs text-gray-600 mb-1">Tên trường</label>
              <input
                type="text"
                value={newField.name}
                onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                placeholder="Ví dụ: Sở thích, Ngân sách..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Loại trường</label>
              <select
                value={newField.type}
                onChange={(e) => setNewField({ ...newField, type: e.target.value as FieldType })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {Object.entries(FIELD_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            {(newField.type === "dropdown" || newField.type === "multi-select") && (
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Tùy chọn (mỗi dòng một tùy chọn)
                </label>
                <textarea
                  value={newField.options?.join("\n")}
                  onChange={(e) =>
                    setNewField({ ...newField, options: e.target.value.split("\n").filter(Boolean) })
                  }
                  placeholder="Tùy chọn 1&#10;Tùy chọn 2&#10;Tùy chọn 3"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
                  rows={4}
                />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Button onClick={handleAddField} size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
              <Save className="w-4 h-4 mr-1.5" />
              Lưu
            </Button>
            <Button
              onClick={() => {
                setIsAddingNew(false);
                setNewField({ name: "", type: "text", value: "" });
              }}
              size="sm"
              variant="outline"
            >
              <X className="w-4 h-4 mr-1.5" />
              Hủy
            </Button>
          </div>
        </div>
      )}

      {/* Fields List */}
      {fields.length === 0 ? (
        <div className="py-16 text-center">
          <Settings className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm text-gray-500">Chưa có trường tùy chỉnh nào</p>
          <p className="text-xs text-gray-400 mt-1">Nhấn 'Thêm trường' để bắt đầu</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedFields).map(([category, categoryFields]) => (
            <div key={category}>
              <h4 className="text-sm text-gray-700 mb-3 flex items-center gap-2">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="px-3 bg-gray-50 rounded">{category}</span>
                <div className="h-px flex-1 bg-gray-200" />
              </h4>
              <div className="space-y-3">
                {categoryFields.map((field) => (
                  <div
                    key={field.id}
                    className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <label className="block text-sm text-gray-700 mb-2">
                          {field.name}
                          {field.required && <span className="text-red-500 ml-1">*</span>}
                        </label>
                        {renderFieldInput(field)}
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {editingFieldId === field.id ? (
                          <button
                            type="button"
                            onClick={() => setEditingFieldId(null)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setEditingFieldId(field.id)}
                            className="p-2 text-violet-600 hover:bg-violet-50 rounded transition-colors"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteField(field.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">
                      Loại: {FIELD_TYPE_LABELS[field.type]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
