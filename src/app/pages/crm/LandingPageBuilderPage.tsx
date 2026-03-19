/**
 * Landing Page Builder
 * No-code visual editor cho landing pages: template gallery,
 * section-based, preview, A/B testing, analytics, embed forms.
 */
import { useState, useMemo } from "react";
import {
  Globe,
  Plus,
  Search,
  Eye,
  Copy,
  Trash2,
  Pencil,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Bot,
  BarChart3,
  ExternalLink,
  Smartphone,
  Monitor,
  MousePointerClick,
  Clock,
  Users,
  X,
  Layout,
  Image,
  Type,
  CheckCircle2,
  Play,
  Pause,
  Layers,
  Palette,
  Zap,
  FileText,
  Star,
  ArrowUpRight,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
type PageStatus = "published" | "draft" | "archived" | "ab-testing";

interface LandingPageSection {
  id: string;
  type: "hero" | "features" | "testimonials" | "pricing" | "cta" | "faq" | "form" | "video" | "stats" | "logos";
  label: string;
}

interface LandingPage {
  id: string;
  name: string;
  slug: string;
  status: PageStatus;
  template: string;
  sections: LandingPageSection[];
  // Stats
  visitors: number;
  conversions: number;
  conversionRate: number;
  bounceRate: number;
  avgTimeOnPage: string;
  // AB Test
  abVariant?: string;
  abWinner?: boolean;
  // Meta
  createdBy: string;
  createdAt: string;
  publishedAt: string | null;
  customDomain: string | null;
  tags: string[];
}

/* ============================================================
 * Constants
 * ============================================================ */
const STATUS_CFG: Record<PageStatus, { label: string; color: string; bg: string }> = {
  published: { label: "Đã xuất bản", color: "text-green-600", bg: "bg-green-50 border-green-200" },
  draft: { label: "Bản nháp", color: "text-gray-500", bg: "bg-gray-50 border-gray-200" },
  archived: { label: "Đã lưu trữ", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  "ab-testing": { label: "A/B Testing", color: "text-violet-600", bg: "bg-violet-50 border-violet-200" },
};

const SECTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  hero: Layout, features: Layers, testimonials: Star, pricing: BarChart3,
  cta: MousePointerClick, faq: FileText, form: Zap, video: Play,
  stats: TrendingUp, logos: Globe,
};

/* ============================================================
 * Mock Data
 * ============================================================ */
const MOCK_PAGES: LandingPage[] = [
  {
    id: "lp_001",
    name: "AI-CRM Enterprise — Trang chính",
    slug: "enterprise",
    status: "published",
    template: "Enterprise SaaS",
    sections: [
      { id: "s1", type: "hero", label: "Hero Banner — 'CRM AI-First cho doanh nghiệp Việt'" },
      { id: "s2", type: "logos", label: "Trusted by 500+ doanh nghiệp" },
      { id: "s3", type: "features", label: "6 tính năng nổi bật" },
      { id: "s4", type: "stats", label: "Thống kê ấn tượng (50K users, 99.9% uptime)" },
      { id: "s5", type: "testimonials", label: "3 testimonials từ khách hàng" },
      { id: "s6", type: "pricing", label: "Bảng giá 4 gói" },
      { id: "s7", type: "faq", label: "FAQ (8 câu hỏi)" },
      { id: "s8", type: "cta", label: "CTA — Dùng thử 14 ngày miễn phí" },
    ],
    visitors: 45200,
    conversions: 3890,
    conversionRate: 8.6,
    bounceRate: 34.2,
    avgTimeOnPage: "2:48",
    createdBy: "Nguyễn Thị Mai",
    createdAt: "2025-09-01T10:00:00Z",
    publishedAt: "2025-09-15T08:00:00Z",
    customDomain: "ai-crm.vn",
    tags: ["Main", "Enterprise", "SEO"],
  },
  {
    id: "lp_002",
    name: "Webinar: AI Sales Coach — Tháng 3",
    slug: "webinar-ai-sales-coach",
    status: "published",
    template: "Event Registration",
    sections: [
      { id: "s1", type: "hero", label: "Hero — Webinar banner với countdown timer" },
      { id: "s2", type: "features", label: "Nội dung chương trình (4 topics)" },
      { id: "s3", type: "testimonials", label: "Diễn giả profiles" },
      { id: "s4", type: "form", label: "Form đăng ký (5 fields)" },
    ],
    visitors: 6800,
    conversions: 1890,
    conversionRate: 27.8,
    bounceRate: 18.5,
    avgTimeOnPage: "1:52",
    createdBy: "Lê Hoàng Đức",
    createdAt: "2026-02-20T14:00:00Z",
    publishedAt: "2026-02-22T09:00:00Z",
    customDomain: null,
    tags: ["Webinar", "AI Sales Coach", "March"],
  },
  {
    id: "lp_003",
    name: "Whitepaper: AI trong CRM 2026",
    slug: "whitepaper-ai-crm-2026",
    status: "ab-testing",
    template: "Gated Content",
    sections: [
      { id: "s1", type: "hero", label: "Hero — Ảnh bìa whitepaper + preview" },
      { id: "s2", type: "stats", label: "Highlights (5 data points)" },
      { id: "s3", type: "form", label: "Form download (4 fields)" },
    ],
    visitors: 4200,
    conversions: 685,
    conversionRate: 16.3,
    bounceRate: 22.1,
    avgTimeOnPage: "1:15",
    abVariant: "A — Màu xanh, CTA ngắn",
    createdBy: "Trần Đức Anh",
    createdAt: "2026-01-10T09:00:00Z",
    publishedAt: "2026-01-12T10:00:00Z",
    customDomain: null,
    tags: ["Whitepaper", "Content", "A/B Test"],
  },
  {
    id: "lp_004",
    name: "Whitepaper: AI trong CRM 2026 (Variant B)",
    slug: "whitepaper-ai-crm-2026-b",
    status: "ab-testing",
    template: "Gated Content",
    sections: [
      { id: "s1", type: "hero", label: "Hero — Video preview + social proof" },
      { id: "s2", type: "testimonials", label: "Reader reviews (3)" },
      { id: "s3", type: "form", label: "Form download (3 fields — bớt 1 field)" },
    ],
    visitors: 4100,
    conversions: 738,
    conversionRate: 18.0,
    bounceRate: 19.8,
    avgTimeOnPage: "1:32",
    abVariant: "B — Video, form ngắn hơn",
    abWinner: true,
    createdBy: "Trần Đức Anh",
    createdAt: "2026-01-10T09:00:00Z",
    publishedAt: "2026-01-12T10:00:00Z",
    customDomain: null,
    tags: ["Whitepaper", "Content", "A/B Test"],
  },
  {
    id: "lp_005",
    name: "Pricing Page — Q2 2026",
    slug: "pricing-q2-2026",
    status: "draft",
    template: "Pricing Comparison",
    sections: [
      { id: "s1", type: "hero", label: "Hero — 'Giá minh bạch, không phí ẩn'" },
      { id: "s2", type: "pricing", label: "Bảng so sánh 4 gói" },
      { id: "s3", type: "faq", label: "FAQ giá cả (10 câu)" },
      { id: "s4", type: "cta", label: "CTA — Liên hệ tư vấn gói Enterprise" },
    ],
    visitors: 0,
    conversions: 0,
    conversionRate: 0,
    bounceRate: 0,
    avgTimeOnPage: "—",
    createdBy: "Phạm Minh Tâm",
    createdAt: "2026-03-03T08:00:00Z",
    publishedAt: null,
    customDomain: null,
    tags: ["Pricing", "Q2-2026"],
  },
];

const TEMPLATE_GALLERY = [
  { name: "Enterprise SaaS", desc: "Hero + features + pricing + testimonials", sections: 8 },
  { name: "Event Registration", desc: "Countdown + agenda + speaker + form", sections: 5 },
  { name: "Gated Content", desc: "Preview + highlights + download form", sections: 3 },
  { name: "Product Launch", desc: "Video + features + waitlist", sections: 6 },
  { name: "Pricing Comparison", desc: "Plans + FAQ + CTA", sections: 4 },
  { name: "Case Study", desc: "Challenge + solution + results + CTA", sections: 5 },
];

/* ============================================================
 * Preview Modal
 * ============================================================ */
function PagePreviewModal({ page, onClose }: { page: LandingPage; onClose: () => void }) {
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] shadow-xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div>
            <h3 className="text-sm text-gray-900">{page.name}</h3>
            <p className="text-[10px] text-gray-400">/{page.slug} • {page.template}</p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setDevice("desktop")}
              className={`p-1.5 rounded ${device === "desktop" ? "bg-violet-100 text-violet-600" : "text-gray-400"}`}>
              <Monitor className="w-4 h-4" />
            </button>
            <button type="button" onClick={() => setDevice("mobile")}
              className={`p-1.5 rounded ${device === "mobile" ? "bg-violet-100 text-violet-600" : "text-gray-400"}`}>
              <Smartphone className="w-4 h-4" />
            </button>
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 ml-2"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className={`p-4 ${device === "mobile" ? "max-w-[375px] mx-auto" : ""}`}>
          {/* Browser chrome mock */}
          <div className="rounded-t-lg bg-gray-200 px-3 py-2 flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 bg-white rounded px-2 py-0.5 text-[9px] text-gray-500 truncate">
              {page.customDomain || "pages.ai-crm.vn"}/{page.slug}
            </div>
          </div>

          {/* Sections preview */}
          <div className="border border-gray-200 border-t-0 rounded-b-lg overflow-hidden">
            {page.sections.map((section) => {
              const SIcon = SECTION_ICONS[section.type] || Layout;
              const bgColors: Record<string, string> = {
                hero: "bg-gradient-to-br from-violet-600 to-indigo-700 text-white",
                features: "bg-white",
                testimonials: "bg-gray-50",
                pricing: "bg-white",
                cta: "bg-gradient-to-r from-green-500 to-emerald-600 text-white",
                faq: "bg-gray-50",
                form: "bg-blue-50",
                video: "bg-gray-900 text-white",
                stats: "bg-violet-50",
                logos: "bg-white",
              };
              return (
                <div key={section.id} className={`${bgColors[section.type] || "bg-white"} px-4 py-6 border-b border-gray-100 last:border-b-0`}>
                  <div className="flex items-center gap-2 justify-center opacity-80">
                    <SIcon className="w-5 h-5" />
                    <span className="text-xs">{section.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        {page.visitors > 0 && (
          <div className="p-4 border-t border-gray-100">
            <div className="grid grid-cols-5 gap-2 text-center">
              <div>
                <p className="text-sm text-gray-900">{page.visitors.toLocaleString()}</p>
                <p className="text-[8px] text-gray-400">Visitors</p>
              </div>
              <div>
                <p className="text-sm text-green-600">{page.conversions.toLocaleString()}</p>
                <p className="text-[8px] text-gray-400">Conversions</p>
              </div>
              <div>
                <p className={`text-sm ${page.conversionRate >= 15 ? "text-green-600" : page.conversionRate >= 8 ? "text-blue-600" : "text-amber-600"}`}>{page.conversionRate}%</p>
                <p className="text-[8px] text-gray-400">CVR</p>
              </div>
              <div>
                <p className="text-sm text-amber-600">{page.bounceRate}%</p>
                <p className="text-[8px] text-gray-400">Bounce</p>
              </div>
              <div>
                <p className="text-sm text-gray-700">{page.avgTimeOnPage}</p>
                <p className="text-[8px] text-gray-400">Avg Time</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * Create Landing Page Modal
 * ============================================================ */
function CreateLandingPageModal({ onClose, onCreated }: { onClose: () => void; onCreated: (page: LandingPage) => void }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [template, setTemplate] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [selectedSections, setSelectedSections] = useState<LandingPageSection[]>([
    { id: "s1", type: "hero", label: "Hero Banner" },
    { id: "s2", type: "features", label: "Tính năng nổi bật" },
    { id: "s3", type: "cta", label: "Call-to-Action" },
  ]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const selectTemplate = (t: typeof TEMPLATE_GALLERY[number]) => {
    setTemplate(t.name);
    // Pre-fill sections based on template
    const sectionPresets: Record<string, LandingPageSection[]> = {
      "Enterprise SaaS": [
        { id: "s1", type: "hero", label: "Hero Banner" },
        { id: "s2", type: "logos", label: "Trusted by logos" },
        { id: "s3", type: "features", label: "Tính năng chính" },
        { id: "s4", type: "stats", label: "Thống kê ấn tượng" },
        { id: "s5", type: "testimonials", label: "Testimonials" },
        { id: "s6", type: "pricing", label: "Bảng giá" },
        { id: "s7", type: "faq", label: "FAQ" },
        { id: "s8", type: "cta", label: "CTA đăng ký" },
      ],
      "Event Registration": [
        { id: "s1", type: "hero", label: "Event Banner + Countdown" },
        { id: "s2", type: "features", label: "Nội dung chương trình" },
        { id: "s3", type: "testimonials", label: "Diễn giả" },
        { id: "s4", type: "form", label: "Form đăng ký" },
        { id: "s5", type: "faq", label: "FAQ" },
      ],
      "Gated Content": [
        { id: "s1", type: "hero", label: "Content Preview" },
        { id: "s2", type: "stats", label: "Highlights" },
        { id: "s3", type: "form", label: "Download Form" },
      ],
    };
    const preset = sectionPresets[t.name] || [
      { id: "s1", type: "hero" as const, label: "Hero Banner" },
      { id: "s2", type: "features" as const, label: "Tính năng" },
      { id: "s3", type: "cta" as const, label: "CTA" },
    ];
    setSelectedSections(preset);
  };

  const addSection = (type: LandingPageSection["type"]) => {
    const labels: Record<string, string> = {
      hero: "Hero Banner", features: "Tính năng", testimonials: "Testimonials",
      pricing: "Bảng giá", cta: "Call-to-Action", faq: "FAQ",
      form: "Form", video: "Video", stats: "Thống kê", logos: "Logos",
    };
    setSelectedSections((prev) => [...prev, { id: `s${Date.now()}`, type, label: labels[type] || type }]);
  };

  const removeSection = (id: string) => setSelectedSections((prev) => prev.filter((s) => s.id !== id));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) { setTags((prev) => [...prev, t]); setTagInput(""); }
  };

  const handleSave = () => {
    if (!name.trim()) { toast.error("Vui lòng nhập tên landing page"); return; }
    if (selectedSections.length === 0) { toast.error("Vui lòng thêm ít nhất 1 section"); return; }
    setSaving(true);
    const newPage: LandingPage = {
      id: `lp_${Date.now()}`, name,
      slug: slug || name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      status: "draft", template: template || "Custom",
      sections: selectedSections,
      visitors: 0, conversions: 0, conversionRate: 0,
      bounceRate: 0, avgTimeOnPage: "—",
      createdBy: "Người dùng hiện tại",
      createdAt: new Date().toISOString(), publishedAt: null,
      customDomain: customDomain || null, tags,
    };
    onCreated(newPage);
    toast.success(`Đã tạo landing page "${name}" với ${selectedSections.length} sections`);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Tạo Landing Page mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3 max-h-[65vh] overflow-y-auto">
          {/* Template quick select */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Chọn template nhanh</label>
            <div className="grid grid-cols-3 gap-1.5">
              {TEMPLATE_GALLERY.map((t) => (
                <button key={t.name} type="button" onClick={() => selectTemplate(t)}
                  className={`text-left p-2 rounded-lg border text-[10px] transition-colors ${template === t.name ? "border-cyan-400 bg-cyan-50" : "border-gray-200 hover:border-cyan-200"}`}>
                  <p className="text-gray-800">{t.name}</p>
                  <p className="text-gray-400 mt-0.5">{t.sections} sections</p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tên trang *</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="VD: Webinar AI Sales — Tháng 4"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Slug URL</label>
              <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="webinar-ai-sales"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Custom Domain</label>
              <input type="text" value={customDomain} onChange={(e) => setCustomDomain(e.target.value)} placeholder="event.company.com"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
            </div>
          </div>
          {/* Sections builder */}
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Sections ({selectedSections.length})</label>
            <div className="space-y-1 mb-2">
              {selectedSections.map((sec, idx) => {
                const SIcon = SECTION_ICONS[sec.type] || Layout;
                return (
                  <div key={sec.id} className="flex items-center gap-2 bg-gray-50 rounded-lg p-1.5 group">
                    <span className="text-[9px] text-gray-300 w-4">{idx + 1}</span>
                    <SIcon className="w-3 h-3 text-gray-400" />
                    <input type="text" value={sec.label}
                      onChange={(e) => setSelectedSections((prev) => prev.map((s) => s.id === sec.id ? { ...s, label: e.target.value } : s))}
                      className="flex-1 text-[11px] bg-transparent border-none focus:outline-none text-gray-700" />
                    <span className="text-[8px] text-cyan-500 bg-cyan-50 px-1 py-0.5 rounded">{sec.type}</span>
                    <button type="button" onClick={() => removeSection(sec.id)}
                      className="p-0.5 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><Trash2 className="w-2.5 h-2.5" /></button>
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-1">
              {(["hero", "features", "testimonials", "pricing", "cta", "faq", "form", "video", "stats", "logos"] as LandingPageSection["type"][]).map((type) => {
                const SIcon = SECTION_ICONS[type] || Layout;
                return (
                  <button key={type} type="button" onClick={() => addSection(type)}
                    className="flex items-center gap-1 px-2 py-1 text-[9px] text-gray-500 bg-white border border-dashed border-gray-200 rounded hover:border-cyan-300 hover:text-cyan-600">
                    <SIcon className="w-2.5 h-2.5" /> {type}
                  </button>
                );
              })}
            </div>
          </div>
          {/* Tags */}
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tags</label>
            <div className="flex items-center gap-2">
              <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())} placeholder="Nhập tag + Enter"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
              <button type="button" onClick={addTag} className="px-3 py-2 text-sm text-cyan-600 hover:bg-cyan-50 rounded-lg border border-cyan-200">Thêm</button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {tags.map((t) => (
                  <span key={t} className="text-[9px] px-2 py-0.5 bg-cyan-50 text-cyan-600 rounded flex items-center gap-1">
                    {t} <button type="button" onClick={() => setTags((prev) => prev.filter((x) => x !== t))} className="text-cyan-400 hover:text-cyan-700">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo Landing Page"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Main Page
 * ============================================================ */
export function LandingPageBuilderPage() {
  const [pages, setPages] = useState<LandingPage[]>(MOCK_PAGES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<PageStatus | "all">("all");
  const [previewPage, setPreviewPage] = useState<LandingPage | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filtered = useMemo(() => {
    let result = pages;
    if (statusFilter !== "all") result = result.filter((p) => p.status === statusFilter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.slug.includes(q));
    }
    return result;
  }, [pages, statusFilter, search]);

  const stats = useMemo(() => ({
    total: pages.length,
    published: pages.filter((p) => p.status === "published").length,
    totalVisitors: pages.reduce((s, p) => s + p.visitors, 0),
    totalConversions: pages.reduce((s, p) => s + p.conversions, 0),
    avgCVR: pages.filter((p) => p.conversionRate > 0).length > 0
      ? (pages.filter((p) => p.conversionRate > 0).reduce((s, p) => s + p.conversionRate, 0) / pages.filter((p) => p.conversionRate > 0).length).toFixed(1)
      : "0",
  }), [pages]);

  const handleDuplicate = (page: LandingPage) => {
    const clone: LandingPage = { ...page, id: `lp_${Date.now()}`, name: `${page.name} (Copy)`, slug: `${page.slug}-copy`, status: "draft", visitors: 0, conversions: 0, conversionRate: 0, bounceRate: 0, avgTimeOnPage: "—", publishedAt: null, createdAt: new Date().toISOString(), abVariant: undefined, abWinner: undefined };
    setPages((prev) => [clone, ...prev]);
    toast.success("Đã sao chép landing page");
  };

  return (
    <div className="space-y-5">
      <header>
        <h1 className="text-gray-900 flex items-center gap-2">
          <Globe className="w-6 h-6 text-cyan-600" /> Landing Page Builder
        </h1>
        <p className="text-gray-500 mt-0.5">
          Tạo landing page no-code — template gallery, A/B testing, analytics, custom domain
        </p>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
        <div className="bg-white rounded-xl border border-gray-100 p-2.5 text-center">
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-[9px] text-gray-400">Tổng pages</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-2.5 text-center">
          <p className="text-lg text-green-600">{stats.published}</p>
          <p className="text-[9px] text-green-700">Đã xuất bản</p>
        </div>
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-2.5 text-center">
          <p className="text-lg text-blue-600">{stats.totalVisitors.toLocaleString()}</p>
          <p className="text-[9px] text-blue-700">Visitors</p>
        </div>
        <div className="bg-violet-50 rounded-xl border border-violet-200 p-2.5 text-center">
          <p className="text-lg text-violet-600">{stats.totalConversions.toLocaleString()}</p>
          <p className="text-[9px] text-violet-700">Conversions</p>
        </div>
        <div className="bg-emerald-50 rounded-xl border border-emerald-200 p-2.5 text-center">
          <p className="text-lg text-emerald-600">{stats.avgCVR}%</p>
          <p className="text-[9px] text-emerald-700">TB CVR</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[150px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Tìm landing page..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as PageStatus | "all")}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
          <option value="all">Tất cả</option>
          {Object.entries(STATUS_CFG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <button type="button" onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700">
          <Plus className="w-4 h-4" /> Tạo Landing Page
        </button>
      </div>

      {/* Template Gallery */}
      {showTemplates && (
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm text-gray-900 flex items-center gap-1.5"><Palette className="w-4 h-4 text-cyan-600" /> Chọn template</h4>
            <button type="button" onClick={() => setShowTemplates(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {TEMPLATE_GALLERY.map((t) => (
              <button key={t.name} type="button"
                onClick={() => { toast.success(`Đã chọn template "${t.name}" — mở editor`); setShowTemplates(false); }}
                className="text-left p-3 rounded-lg border border-gray-200 hover:border-cyan-300 hover:bg-cyan-50 transition-colors">
                <div className="h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-2 flex items-center justify-center">
                  <Layout className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-xs text-gray-900">{t.name}</p>
                <p className="text-[9px] text-gray-400 mt-0.5">{t.desc}</p>
                <p className="text-[8px] text-cyan-500 mt-1">{t.sections} sections</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Page Cards */}
      <div className="space-y-3">
        {filtered.map((page) => {
          const stCfg = STATUS_CFG[page.status];
          return (
            <div key={page.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-cyan-200 transition-colors">
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${stCfg.bg}`}>
                    <Globe className={`w-5 h-5 ${stCfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm text-gray-900">{page.name}</h3>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded border ${stCfg.bg} ${stCfg.color}`}>{stCfg.label}</span>
                      {page.abWinner && <span className="text-[8px] px-1.5 py-0.5 bg-green-100 text-green-600 rounded border border-green-200">🏆 Winner</span>}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      /{page.slug} • Template: {page.template}
                      {page.abVariant && <span className="ml-1 text-violet-500">• {page.abVariant}</span>}
                    </p>

                    {/* Sections */}
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      {page.sections.map((s) => {
                        const SIcon = SECTION_ICONS[s.type] || Layout;
                        return (
                          <span key={s.id} className="flex items-center gap-0.5 text-[8px] px-1.5 py-0.5 bg-gray-50 border border-gray-200 rounded text-gray-500">
                            <SIcon className="w-2.5 h-2.5" /> {s.type}
                          </span>
                        );
                      })}
                    </div>

                    {/* Stats */}
                    {page.visitors > 0 && (
                      <div className="flex items-center gap-3 mt-2 text-[9px] text-gray-400 flex-wrap">
                        <span className="flex items-center gap-0.5"><Users className="w-3 h-3" /> {page.visitors.toLocaleString()} visitors</span>
                        <span className="flex items-center gap-0.5"><MousePointerClick className="w-3 h-3" /> {page.conversions.toLocaleString()} conversions</span>
                        <span className={`flex items-center gap-0.5 ${page.conversionRate >= 15 ? "text-green-500" : page.conversionRate >= 8 ? "text-blue-500" : "text-amber-500"}`}>
                          <ArrowUpRight className="w-3 h-3" /> {page.conversionRate}% CVR
                        </span>
                        <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" /> {page.avgTimeOnPage}</span>
                      </div>
                    )}

                    {/* Conversion bar */}
                    {page.visitors > 0 && (
                      <div className="mt-2">
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${page.conversionRate >= 15 ? "bg-green-400" : page.conversionRate >= 8 ? "bg-blue-400" : "bg-amber-400"}`}
                            style={{ width: `${Math.min(page.conversionRate * 3, 100)}%` }} />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      {page.tags.map((t) => (
                        <span key={t} className="text-[8px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">{t}</span>
                      ))}
                      {page.customDomain && (
                        <span className="text-[8px] px-1.5 py-0.5 bg-cyan-50 text-cyan-600 rounded border border-cyan-200">🌐 {page.customDomain}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 px-4 py-2.5 bg-gray-50 border-t border-gray-100 flex-wrap">
                <button type="button" onClick={() => setPreviewPage(page)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-gray-500 hover:bg-white rounded-lg">
                  <Eye className="w-3 h-3" /> Xem trước
                </button>
                <button type="button" onClick={() => toast.success("Mở Visual Editor")}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-cyan-600 hover:bg-cyan-50 rounded-lg">
                  <Pencil className="w-3 h-3" /> Sửa
                </button>
                <button type="button" onClick={() => handleDuplicate(page)}
                  className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-gray-500 hover:bg-white rounded-lg">
                  <Copy className="w-3 h-3" /> Sao chép
                </button>
                {page.status === "published" && (
                  <button type="button" onClick={() => window.open(`https://${page.customDomain || "pages.ai-crm.vn"}/${page.slug}`, "_blank")}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] text-blue-600 hover:bg-blue-50 rounded-lg">
                    <ExternalLink className="w-3 h-3" /> Mở trang
                  </button>
                )}
                <div className="flex-1" />
                <button type="button" onClick={() => { setPages((prev) => prev.filter((p) => p.id !== page.id)); toast.success("Đã xoá"); }}
                  className="p-1.5 text-gray-300 hover:text-red-500">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
          <Globe className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Không tìm thấy landing page nào</p>
        </div>
      )}

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-cyan-600" />
          <h4 className="text-sm text-cyan-900">AI Landing Page Insights</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm text-cyan-800">
          <p className="flex items-start gap-2">
            <TrendingUp className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>A/B Test Whitepaper: <strong>Variant B thắng</strong> với 18.0% vs 16.3%. Yếu tố: video preview + bớt 1 field form → tăng <strong>+10.4%</strong> conversion.</span>
          </p>
          <p className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
            <span>Trang Enterprise có <strong>bounce rate 34.2%</strong> — cao hơn benchmark. Đề xuất: thêm social proof section phía trên, rút gọn hero text.</span>
          </p>
          <p className="flex items-start gap-2">
            <Bot className="w-4 h-4 text-violet-500 mt-0.5 flex-shrink-0" />
            <span>AI có thể generate <strong>3 variant CTA</strong> cho từng page và tự động A/B test. Dự kiến tăng conversion <strong>+12-18%</strong>.</span>
          </p>
        </div>
      </div>

      {previewPage && <PagePreviewModal page={previewPage} onClose={() => setPreviewPage(null)} />}
      {showCreateModal && <CreateLandingPageModal onClose={() => setShowCreateModal(false)} onCreated={(page) => { setPages((prev) => [page, ...prev]); }} />}
    </div>
  );
}