/**
 * InlineEditCell — Cell cho phép chỉnh sửa inline trong DataTable
 * Phase F0-12 — Support: text, number, select, combobox
 */
import { useState, useRef, useEffect, useCallback } from "react";
import { Check, X, Pencil } from "lucide-react";

/* ============================================================
 * Types
 * ============================================================ */
type EditType = "text" | "number" | "select";

interface BaseProps {
  value: string | number;
  onSave: (newValue: string | number) => void;
  onCancel: () => void;
  isEditing: boolean;
  onStartEdit: () => void;
  /** Có show icon bút khi hover không */
  showEditIcon?: boolean;
  /** Placeholder khi rỗng */
  placeholder?: string;
  /** Class cho text hiển thị */
  displayClassName?: string;
}

interface TextEditProps extends BaseProps {
  editType?: "text" | "number";
}

interface SelectEditProps extends BaseProps {
  editType: "select";
  options: { value: string; label: string }[];
}

type InlineEditCellProps = TextEditProps | SelectEditProps;

/* ============================================================
 * Component
 * ============================================================ */
export function InlineEditCell(props: InlineEditCellProps) {
  const {
    value,
    onSave,
    onCancel,
    isEditing,
    onStartEdit,
    showEditIcon = true,
    placeholder = "—",
    displayClassName = "",
    editType = "text",
  } = props;

  const [editValue, setEditValue] = useState<string>(String(value ?? ""));
  const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null);

  /* Focus khi bắt đầu edit */
  useEffect(() => {
    if (isEditing) {
      setEditValue(String(value ?? ""));
      setTimeout(() => {
        inputRef.current?.focus();
        if (inputRef.current instanceof HTMLInputElement) {
          inputRef.current.select();
        }
      }, 0);
    }
  }, [isEditing, value]);

  /* Keyboard handlers */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const finalValue = editType === "number" ? Number(editValue) : editValue;
      onSave(finalValue);
    } else if (e.key === "Escape") {
      onCancel();
    }
  }, [editValue, editType, onSave, onCancel]);

  const handleBlurSave = useCallback(() => {
    const finalValue = editType === "number" ? Number(editValue) : editValue;
    if (String(finalValue) !== String(value)) {
      onSave(finalValue);
    } else {
      onCancel();
    }
  }, [editValue, editType, value, onSave, onCancel]);

  /* ---- Edit Mode ---- */
  if (isEditing) {
    if (editType === "select" && "options" in props) {
      return (
        <div className="flex items-center gap-1">
          <select
            ref={inputRef as React.RefObject<HTMLSelectElement>}
            value={editValue}
            onChange={(e) => {
              setEditValue(e.target.value);
              onSave(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            onBlur={handleBlurSave}
            className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white focus:outline-none focus:ring-1 focus:ring-blue-200"
          >
            {props.options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1">
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type={editType === "number" ? "number" : "text"}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlurSave}
          className="w-full px-1.5 py-0.5 text-sm border border-blue-400 rounded bg-white
            focus:outline-none focus:ring-1 focus:ring-blue-200"
        />
      </div>
    );
  }

  /* ---- Display Mode ---- */
  const displayText = value == null || value === "" ? placeholder : String(value);
  const isEmpty = value == null || value === "";

  return (
    <div
      className="group/edit flex items-center gap-1 cursor-pointer rounded px-1 -mx-1 hover:bg-blue-50/50 transition-colors min-h-[24px]"
      onClick={onStartEdit}
      onKeyDown={(e) => { if (e.key === "Enter") onStartEdit(); }}
      role="button"
      tabIndex={0}
    >
      <span className={`truncate ${isEmpty ? "text-gray-300" : displayClassName}`}>
        {displayText}
      </span>
      {showEditIcon && (
        <Pencil className="w-3 h-3 text-gray-300 opacity-0 group-hover/edit:opacity-100 transition-opacity flex-shrink-0" />
      )}
    </div>
  );
}
