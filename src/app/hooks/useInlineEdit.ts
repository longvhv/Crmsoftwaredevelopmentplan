/**
 * Hook useInlineEdit — Quản lý trạng thái chỉnh sửa inline trong bảng
 * Phase F0-03
 */
import { useState, useCallback } from "react";

interface UseInlineEditReturn {
  /** ID hàng đang edit */
  editingId: string | null;
  /** Field đang edit */
  editingField: string | null;
  /** Giá trị ban đầu (để revert khi cancel) */
  originalValue: unknown;
  /** Bắt đầu edit 1 cell */
  startEdit: (rowId: string, field: string, currentValue: unknown) => void;
  /** Hủy edit */
  cancelEdit: () => void;
  /** Hoàn tất edit (gọi callback rồi clear state) */
  commitEdit: (newValue: unknown, onSave: (rowId: string, field: string, value: unknown) => void) => void;
  /** Kiểm tra cell có đang edit không */
  isEditing: (rowId: string, field: string) => boolean;
}

export function useInlineEdit(): UseInlineEditReturn {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [originalValue, setOriginalValue] = useState<unknown>(null);

  const startEdit = useCallback((rowId: string, field: string, currentValue: unknown) => {
    setEditingId(rowId);
    setEditingField(field);
    setOriginalValue(currentValue);
  }, []);

  const cancelEdit = useCallback(() => {
    setEditingId(null);
    setEditingField(null);
    setOriginalValue(null);
  }, []);

  const commitEdit = useCallback(
    (newValue: unknown, onSave: (rowId: string, field: string, value: unknown) => void) => {
      if (editingId && editingField && newValue !== originalValue) {
        onSave(editingId, editingField, newValue);
      }
      setEditingId(null);
      setEditingField(null);
      setOriginalValue(null);
    },
    [editingId, editingField, originalValue],
  );

  const isEditing = useCallback(
    (rowId: string, field: string) => editingId === rowId && editingField === field,
    [editingId, editingField],
  );

  return { editingId, editingField, originalValue, startEdit, cancelEdit, commitEdit, isEditing };
}
