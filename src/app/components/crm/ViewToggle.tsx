/**
 * ViewToggle — Nút toggle giữa Table / Card / List
 * Phase F0-10
 */
import { LayoutGrid, List, Table2 } from "lucide-react";
import type { ViewMode } from "../../types/dataTable";

interface ViewToggleProps {
  mode: ViewMode;
  onSetMode: (mode: ViewMode) => void;
  /** Chỉ hiện các mode cần thiết, mặc định ["table", "card"] */
  modes?: ViewMode[];
}

const MODE_CONFIG: Record<ViewMode, { icon: typeof Table2; label: string }> = {
  table: { icon: Table2, label: "Bảng" },
  card: { icon: LayoutGrid, label: "Thẻ" },
  list: { icon: List, label: "Danh sách" },
};

export function ViewToggle({ mode, onSetMode, modes = ["table", "card"] }: ViewToggleProps) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-0.5">
      {modes.map((m) => {
        const cfg = MODE_CONFIG[m];
        const Icon = cfg.icon;
        const active = m === mode;
        return (
          <button
            key={m}
            type="button"
            onClick={() => onSetMode(m)}
            title={cfg.label}
            className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md transition-colors ${
              active
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{cfg.label}</span>
          </button>
        );
      })}
    </div>
  );
}
