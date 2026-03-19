import { useState, useRef, useEffect, useCallback } from "react";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";

interface ComboboxSelectProps {
  /** Nhãn hiển thị */
  label: string;
  /** Danh sách lựa chọn */
  options: string[];
  /** Giá trị đang chọn (null = tất cả) */
  value: string | null;
  /** Callback khi thay đổi giá trị */
  onChange: (value: string | null) => void;
  /** Placeholder khi chưa chọn */
  placeholder?: string;
  /** Cho phép thêm mục mới */
  allowCreate?: boolean;
  /** Callback khi thêm mục mới */
  onCreateNew?: (value: string) => void;
  /** CSS class bổ sung */
  className?: string;
}

export function ComboboxSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Tất cả",
  allowCreate = false,
  onCreateNew,
  className = "",
}: ComboboxSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase()),
  );

  const canCreate = allowCreate && search.trim() !== "" && !options.some(
    (opt) => opt.toLowerCase() === search.trim().toLowerCase(),
  );

  const handleSelect = useCallback((selected: string | null) => {
    onChange(selected);
    setSearch("");
    setIsOpen(false);
  }, [onChange]);

  const handleCreate = useCallback(() => {
    const trimmed = search.trim();
    if (trimmed && onCreateNew) {
      onCreateNew(trimmed);
      onChange(trimmed);
      setSearch("");
      setIsOpen(false);
    }
  }, [search, onCreateNew, onChange]);

  /* Đóng dropdown khi click bên ngoài */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* Focus input khi mở dropdown */
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <label className="text-xs text-gray-500 mb-1 block">{label}</label>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm text-left hover:bg-gray-100 transition-colors"
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {value ?? placeholder}
        </span>
        <div className="flex items-center gap-1">
          {value && (
            <span
              role="button"
              tabIndex={0}
              className="p-0.5 hover:bg-gray-200 rounded"
              onClick={(e) => {
                e.stopPropagation();
                handleSelect(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.stopPropagation();
                  handleSelect(null);
                }
              }}
            >
              <X className="w-3 h-3 text-gray-400" />
            </span>
          )}
          <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
        </div>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden">
          {/* Ô tìm kiếm */}
          <div className="p-2 border-b border-gray-100">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm..."
              className="w-full px-2 py-1.5 bg-gray-50 border border-gray-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-violet-400"
            />
          </div>

          {/* Danh sách */}
          <div className="overflow-y-auto max-h-44">
            {/* Mục "Tất cả" */}
            <button
              type="button"
              onClick={() => handleSelect(null)}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors"
            >
              <Check className={`w-3.5 h-3.5 ${value === null ? "text-violet-600" : "text-transparent"}`} />
              <span className="text-gray-400">{placeholder}</span>
            </button>

            {filteredOptions.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-gray-50 transition-colors"
              >
                <Check className={`w-3.5 h-3.5 ${value === option ? "text-violet-600" : "text-transparent"}`} />
                <span className="text-gray-900 truncate">{option}</span>
              </button>
            ))}

            {filteredOptions.length === 0 && !canCreate && (
              <p className="px-3 py-4 text-sm text-gray-400 text-center">
                Không tìm thấy kết quả
              </p>
            )}

            {/* Thêm mới */}
            {canCreate && (
              <button
                type="button"
                onClick={handleCreate}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left text-violet-600 hover:bg-violet-50 transition-colors border-t border-gray-100"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Thêm mới: &quot;{search.trim()}&quot;</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
