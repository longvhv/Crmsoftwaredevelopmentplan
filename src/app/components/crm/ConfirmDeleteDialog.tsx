/**
 * ConfirmDeleteDialog — Hộp thoại xác nhận xóa dùng chung
 * Phase F0-13
 */
import { AlertTriangle, X } from "lucide-react";

interface ConfirmDeleteDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  /** Tên item sắp xóa (hiện trong dialog) */
  itemName: string;
  /** Loại entity (vd: "liên hệ", "deal", "ticket") */
  entityType?: string;
  /** Mô tả thêm về hậu quả */
  description?: string;
  /** Đang loading */
  loading?: boolean;
}

export function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
  itemName,
  entityType = "mục",
  description,
  loading = false,
}: ConfirmDeleteDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Dialog */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-sm w-full p-5 animate-in fade-in zoom-in-95 duration-200">
        {/* Close */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center w-11 h-11 rounded-full bg-red-50 mb-4">
          <AlertTriangle className="w-5 h-5 text-red-600" />
        </div>

        {/* Content */}
        <h3 className="text-gray-900 mb-1">Xóa {entityType}?</h3>
        <p className="text-sm text-gray-500 mb-1">
          Bạn có chắc muốn xóa <span className="text-gray-800">"{itemName}"</span>?
        </p>
        {description && (
          <p className="text-xs text-gray-400 mb-4">{description}</p>
        )}
        {!description && <div className="mb-4" />}

        {/* Actions */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-700
              hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 px-4 py-2 text-sm bg-red-600 text-white rounded-lg
              hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Đang xóa..." : "Xóa"}
          </button>
        </div>
      </div>
    </div>
  );
}
