/**
 * Tìm kiếm toàn cục xuyên suốt contacts, deals, activities.
 * Hiển thị kết quả gom nhóm trong dropdown overlay.
 */
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  X,
  User,
  Target,
  Clock,
  ArrowRight,
} from "lucide-react";
import type { Contact, Deal, Activity } from "../../types/crm";
import { fetchContacts, fetchDeals, fetchActivities, getEmployeeName } from "../../api/crmApi";
import {
  CONTACT_TYPE_CONFIG,
  DEAL_STAGE_CONFIG,
  ACTIVITY_TYPE_CONFIG,
  formatCurrency,
} from "../../constants/crmConfig";

interface SearchResult {
  id: string;
  type: "contact" | "deal" | "activity";
  title: string;
  subtitle: string;
  badge?: { label: string; color: string };
  navigateTo: string;
}

function mapContactToResult(c: Contact): SearchResult {
  const typeConf = CONTACT_TYPE_CONFIG[c.type];
  return {
    id: c.id,
    type: "contact",
    title: c.name,
    subtitle: `${c.company} · ${c.email}`,
    badge: { label: typeConf.label, color: typeConf.color },
    navigateTo: "/crm/contacts",
  };
}

function mapDealToResult(d: Deal): SearchResult {
  const stageConf = DEAL_STAGE_CONFIG[d.stage];
  return {
    id: d.id,
    type: "deal",
    title: d.title,
    subtitle: `${d.company} · ${formatCurrency(d.value)}`,
    badge: { label: stageConf.label, color: `${stageConf.bgColor} ${stageConf.color}` },
    navigateTo: "/crm/pipeline",
  };
}

function mapActivityToResult(a: Activity): SearchResult {
  const typeConf = ACTIVITY_TYPE_CONFIG[a.type];
  return {
    id: a.id,
    type: "activity",
    title: a.title,
    subtitle: `${getEmployeeName(a.performedBy)} · ${a.performedAt}`,
    badge: { label: typeConf.label, color: typeConf.color },
    navigateTo: "/crm/activities",
  };
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  contact: <User className="w-4 h-4 text-blue-500" />,
  deal: <Target className="w-4 h-4 text-violet-500" />,
  activity: <Clock className="w-4 h-4 text-green-500" />,
};

const TYPE_LABELS: Record<string, string> = {
  contact: "Liên hệ",
  deal: "Deals",
  activity: "Hoạt động",
};

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [allContacts, setAllContacts] = useState<Contact[]>([]);
  const [allDeals, setAllDeals] = useState<Deal[]>([]);
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Tải data một lần
  useEffect(() => {
    fetchContacts().then(setAllContacts);
    fetchDeals().then(setAllDeals);
    fetchActivities().then(setAllActivities);
  }, []);

  // Keyboard shortcut: Ctrl+K / Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  // Click outside
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    const maxPerType = 5;

    const contactResults = allContacts
      .filter((c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.company.toLowerCase().includes(q),
      )
      .slice(0, maxPerType)
      .map(mapContactToResult);

    const dealResults = allDeals
      .filter((d) =>
        d.title.toLowerCase().includes(q) ||
        d.company.toLowerCase().includes(q) ||
        d.contactName.toLowerCase().includes(q),
      )
      .slice(0, maxPerType)
      .map(mapDealToResult);

    const activityResults = allActivities
      .filter((a) =>
        a.title.toLowerCase().includes(q) ||
        (a.description || "").toLowerCase().includes(q),
      )
      .slice(0, maxPerType)
      .map(mapActivityToResult);

    return [...contactResults, ...dealResults, ...activityResults];
  }, [query, allContacts, allDeals, allActivities]);

  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    for (const r of results) {
      if (!groups[r.type]) groups[r.type] = [];
      groups[r.type].push(r);
    }
    return groups;
  }, [results]);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      navigate(result.navigateTo);
      setIsOpen(false);
      setQuery("");
    },
    [navigate],
  );

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger button / Input */}
      {!isOpen ? (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setTimeout(() => inputRef.current?.focus(), 50);
          }}
          className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-400 hover:border-violet-300 transition-colors w-full sm:w-64"
        >
          <Search className="w-4 h-4" />
          <span className="flex-1 text-left">Tìm kiếm...</span>
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-400 rounded border border-gray-200">
            ⌘K
          </kbd>
        </button>
      ) : (
        <div className="flex items-center gap-2 px-3 py-2 bg-white border border-violet-300 rounded-lg shadow-sm">
          <Search className="w-4 h-4 text-violet-500" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm liên hệ, deals, hoạt động..."
            className="flex-1 text-sm bg-transparent outline-none min-w-0"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* Dropdown kết quả */}
      {isOpen && query.trim() && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-[400px] overflow-y-auto z-50">
          {results.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              <Search className="w-6 h-6 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Không tìm thấy kết quả cho "{query}"</p>
            </div>
          ) : (
            Object.entries(groupedResults).map(([type, items]) => (
              <div key={type}>
                {/* Tiêu đề nhóm */}
                <div className="px-3 py-2 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                  {TYPE_ICONS[type]}
                  <span className="text-xs text-gray-500">{TYPE_LABELS[type]}</span>
                  <span className="text-[10px] text-gray-400">({items.length})</span>
                </div>

                {/* Kết quả */}
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-violet-50 transition-colors text-left"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 truncate">{item.title}</p>
                      <p className="text-xs text-gray-400 truncate">{item.subtitle}</p>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded flex-shrink-0 ${item.badge.color}`}>
                        {item.badge.label}
                      </span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" />
                  </button>
                ))}
              </div>
            ))
          )}

          {/* Footer */}
          <div className="px-3 py-2 bg-gray-50 border-t border-gray-100 text-[10px] text-gray-400 flex items-center justify-between">
            <span>{results.length} kết quả</span>
            <span>ESC để đóng</span>
          </div>
        </div>
      )}
    </div>
  );
}