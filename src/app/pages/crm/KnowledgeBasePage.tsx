/**
 * Trang Knowledge Base — Tài liệu nội bộ sales: playbook, FAQ, battle cards,
 * case studies, objection handling, pricing guide.
 * AI-powered search, tagging, view analytics.
 * Phase 1: Static content with interactive UI.
 */
import { useState, useMemo } from "react";
import {
  BookOpen,
  Search,
  Star,
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Bot,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Tag,
  FileText,
  Shield,
  Swords,
  MessageSquareQuote,
  HelpCircle,
  Target,
  Users,
  Lightbulb,
  TrendingUp,
  DollarSign,
  BookMarked,
  Folder,
  X,
  Copy,
  ExternalLink,
  Filter,
  Award,
  Zap,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

/* ============================================================
 * Types
 * ============================================================ */
type ArticleCategory =
  | "playbook"
  | "battle-card"
  | "objection"
  | "case-study"
  | "faq"
  | "pricing"
  | "process";

type ArticleDifficulty = "beginner" | "intermediate" | "advanced";

interface Article {
  id: string;
  title: string;
  summary: string;
  category: ArticleCategory;
  difficulty: ArticleDifficulty;
  content: string;
  tags: string[];
  author: string;
  authorRole: string;
  createdDate: string;
  updatedDate: string;
  views: number;
  likes: number;
  readTime: number;
  isStarred: boolean;
  relatedArticles: string[];
}

/* ============================================================
 * Constants
 * ============================================================ */
const CATEGORY_CONFIG: Record<ArticleCategory, { label: string; icon: React.ReactNode; color: string; bgColor: string }> = {
  playbook: { label: "Sales Playbook", icon: <BookMarked className="w-4 h-4" />, color: "text-violet-600", bgColor: "bg-violet-50 border-violet-200" },
  "battle-card": { label: "Battle Card", icon: <Swords className="w-4 h-4" />, color: "text-red-600", bgColor: "bg-red-50 border-red-200" },
  objection: { label: "Xử lý từ chối", icon: <Shield className="w-4 h-4" />, color: "text-amber-600", bgColor: "bg-amber-50 border-amber-200" },
  "case-study": { label: "Case Study", icon: <Award className="w-4 h-4" />, color: "text-green-600", bgColor: "bg-green-50 border-green-200" },
  faq: { label: "FAQ", icon: <HelpCircle className="w-4 h-4" />, color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200" },
  pricing: { label: "Hướng dẫn giá", icon: <DollarSign className="w-4 h-4" />, color: "text-pink-600", bgColor: "bg-pink-50 border-pink-200" },
  process: { label: "Quy trình", icon: <Zap className="w-4 h-4" />, color: "text-indigo-600", bgColor: "bg-indigo-50 border-indigo-200" },
};

const DIFFICULTY_CONFIG: Record<ArticleDifficulty, { label: string; color: string }> = {
  beginner: { label: "Cơ bản", color: "text-green-600 bg-green-50" },
  intermediate: { label: "Trung bình", color: "text-amber-600 bg-amber-50" },
  advanced: { label: "Nâng cao", color: "text-red-600 bg-red-50" },
};

/* ============================================================
 * Mock Data — 14 bài viết phong phú
 * ============================================================ */
const ARTICLES: Article[] = [
  {
    id: "kb1",
    title: "Sales Playbook: Quy trình bán Outsource cho Enterprise",
    summary: "Hướng dẫn từ A-Z quy trình tiếp cận, qualify, propose và close deal outsource cho khách hàng enterprise. Bao gồm timeline, checkpoint và template.",
    category: "playbook",
    difficulty: "intermediate",
    content: `## 1. Giai đoạn Prospecting (Tuần 1-2)
- Xác định ICP: CTO/VP Engineering tại công ty 200+ nhân viên
- Kênh tiếp cận: LinkedIn InMail + Email sequence + Referral
- Template: Sử dụng "Enterprise Outreach v3" trong Email Templates

## 2. Giai đoạn Discovery (Tuần 3-4)
- Câu hỏi BANT: Budget, Authority, Need, Timeline
- Pain points phổ biến: thiếu nhân lực, deadline gấp, skill gap
- Demo: 30 phút overview + 15 phút Q&A

## 3. Giai đoạn Proposal (Tuần 5-6)
- Sử dụng proposal template "Outsource Enterprise v2"
- Pricing: Team-based (tham khảo Pricing Guide)
- Highlight: Case studies tương tự (MediSys, TechCorp)

## 4. Giai đoạn Negotiation & Close (Tuần 7-8)
- Đàm phán: Linh hoạt payment terms, không giảm rate
- Upsell opportunity: DevOps, AI Chatbot
- Close signal: Hỏi về onboarding timeline`,
    tags: ["enterprise", "outsource", "process"],
    author: "Nguyễn Văn An", authorRole: "Sales Director",
    createdDate: "2025-08-15", updatedDate: "2026-02-20",
    views: 342, likes: 45, readTime: 12, isStarred: true,
    relatedArticles: ["kb3", "kb5", "kb8"],
  },
  {
    id: "kb2",
    title: "Battle Card: So sánh với đối thủ FPT Software",
    summary: "Phân tích điểm mạnh/yếu so với FPT Software. Cách positioning khi khách hàng so sánh, talking points chính và counter-arguments.",
    category: "battle-card",
    difficulty: "advanced",
    content: `## Tổng quan đối thủ
FPT Software: 27,000+ nhân viên, revenue $1B+, focus enterprise Nhật/Âu

## Điểm mạnh của họ
- Scale lớn, brand mạnh tại Nhật
- Chứng chỉ CMMI Level 5
- Giá cạnh tranh cho team lớn 50+ người

## Điểm yếu của họ
- Bureaucratic, slow decision making
- Junior ratio cao (60%+)
- Chất lượng không đồng đều giữa các đơn vị
- Thiếu chuyên sâu AI/ML

## Talking Points (Khi khách so sánh)
1. "Chúng tôi focus vào chất lượng với senior ratio 70%+"
2. "AI-first approach — tích hợp AI vào quy trình phát triển"
3. "Agile thực sự, không chỉ trên giấy — sprint demo mỗi 2 tuần"
4. "Dedicated team, không rotate nhân sự giữa các dự án"

## Khi nào KHÔNG nên cạnh tranh
- Dự án > 100 người: FPT có lợi thế scale
- Khách hàng Nhật yêu cầu on-site: FPT có office tại Tokyo`,
    tags: ["competitor", "FPT", "positioning"],
    author: "Lê Minh Cường", authorRole: "Business Development",
    createdDate: "2025-10-01", updatedDate: "2026-01-15",
    views: 218, likes: 38, readTime: 8, isStarred: true,
    relatedArticles: ["kb4", "kb6"],
  },
  {
    id: "kb3",
    title: "Xử lý từ chối: \"Giá của bạn quá cao\"",
    summary: "Framework LAER (Listen-Acknowledge-Explore-Respond) cho objection phổ biến nhất. Kèm script mẫu và role-play scenarios.",
    category: "objection",
    difficulty: "intermediate",
    content: `## Framework LAER

### Listen (Lắng nghe)
"Tôi hiểu concern của anh/chị về pricing. Có thể chia sẻ thêm anh/chị đang so sánh với giải pháp nào không?"

### Acknowledge (Công nhận)
"Đúng là investment ban đầu không nhỏ. Nhiều khách hàng enterprise của chúng tôi cũng có concern tương tự trước khi bắt đầu."

### Explore (Khám phá)
- "Budget range anh/chị đang target là bao nhiêu?"
- "Anh/chị đánh giá ROI như thế nào?"
- "Chi phí nếu KHÔNG triển khai là bao nhiêu? (Cost of inaction)"

### Respond (Phản hồi)
1. Value-based: "Senior team của chúng tôi deliver nhanh hơn 40%, tổng cost thấp hơn"
2. ROI: "Khách hàng TechCorp tiết kiệm $180K/năm sau khi triển khai"
3. Flexible: "Chúng tôi có thể bắt đầu với team nhỏ 3 người để prove value"`,
    tags: ["objection", "pricing", "negotiation"],
    author: "Hoàng Thị Mai", authorRole: "Account Manager",
    createdDate: "2025-09-20", updatedDate: "2026-02-10",
    views: 456, likes: 67, readTime: 6, isStarred: false,
    relatedArticles: ["kb1", "kb7"],
  },
  {
    id: "kb4",
    title: "Battle Card: So sánh với đối thủ NashTech",
    summary: "Phân tích điểm mạnh/yếu so với NashTech (Harvey Nash). Focus vào thị trường UK/EU và .NET ecosystem.",
    category: "battle-card",
    difficulty: "advanced",
    content: `## Tổng quan
NashTech: 2,500+ nhân viên, thuộc Harvey Nash Group (UK), mạnh .NET và Azure

## Điểm mạnh
- Brand Harvey Nash tại UK
- .NET ecosystem chuyên sâu
- Azure partnership

## Điểm yếu
- Hạn chế ngoài .NET stack
- Thiếu khả năng AI/ML
- Giá cao hơn trung bình

## Positioning
"Chúng tôi polyglot — thành thạo nhiều tech stack, đặc biệt mạnh về AI/ML"`,
    tags: ["competitor", "NashTech", "UK"],
    author: "Lê Minh Cường", authorRole: "Business Development",
    createdDate: "2025-11-05", updatedDate: "2026-01-20",
    views: 134, likes: 22, readTime: 5, isStarred: false,
    relatedArticles: ["kb2"],
  },
  {
    id: "kb5",
    title: "Case Study: TechCorp AI Platform — $120K deal",
    summary: "Câu chuyện thành công triển khai AI platform cho TechCorp Inc. Từ lead đến close trong 6 tuần, upsell thêm DevOps.",
    category: "case-study",
    difficulty: "beginner",
    content: `## Bối cảnh
TechCorp Inc — startup AI tại Singapore, 150 nhân viên, cần augment team ML

## Thách thức
- Thiếu 5 ML engineers giỏi
- Timeline tight: 3 tháng MVP
- Budget giới hạn $120K

## Giải pháp
- Team 6 người: 1 Tech Lead + 3 Senior ML + 1 DevOps + 1 QA
- Agile sprint 2 tuần
- Tích hợp CI/CD từ ngày 1

## Kết quả
- MVP đúng hạn 3 tháng
- Client satisfaction: 9.2/10
- Upsell: DevOps managed service ($3K/tháng)
- Mở rộng team lên 10 người (Phase 2)

## Bài học
- Đưa Tech Lead vào presales call → tăng trust
- Demo real code quality → khách hàng tin tưởng
- Upsell DevOps tự nhiên khi đang triển khai`,
    tags: ["AI", "Singapore", "success", "outsource"],
    author: "Nguyễn Văn An", authorRole: "Sales Director",
    createdDate: "2025-12-01", updatedDate: "2026-02-15",
    views: 289, likes: 52, readTime: 7, isStarred: true,
    relatedArticles: ["kb1", "kb8"],
  },
  {
    id: "kb6",
    title: "Xử lý từ chối: \"Chúng tôi đã có team in-house\"",
    summary: "Cách reframe từ 'thay thế' sang 'augment'. Talking points về hybrid model và flexibility.",
    category: "objection",
    difficulty: "intermediate",
    content: `## Mindset shift
KHÔNG bán "thay thế team" → BÁN "augment & accelerate"

## Phản hồi mẫu
"Tuyệt vời! Team in-house là nền tảng quan trọng. Chúng tôi thường bổ sung chuyên môn đặc thù mà team chưa có — ví dụ AI/ML hoặc scale nhanh cho deadline gấp."

## Scenarios
1. Thiếu skill đặc thù → "Chúng tôi cung cấp expertise AI/ML ngay lập tức"
2. Thiếu bandwidth → "Augment 3-5 người trong 6 tháng, ramp down khi dự án ổn"
3. Cần tốc độ → "Team experienced, onboard trong 1 tuần thay vì 3 tháng recruit"`,
    tags: ["objection", "in-house", "augmentation"],
    author: "Hoàng Thị Mai", authorRole: "Account Manager",
    createdDate: "2025-10-15", updatedDate: "2026-01-25",
    views: 312, likes: 41, readTime: 5, isStarred: false,
    relatedArticles: ["kb3"],
  },
  {
    id: "kb7",
    title: "Hướng dẫn giá: Pricing Strategy & Discount Policy",
    summary: "Chính sách giá chuẩn, quy tắc discount, approval workflow. Cập nhật Q1/2026.",
    category: "pricing",
    difficulty: "advanced",
    content: `## Bảng giá chuẩn Q1/2026

| Level | Rate (USD/h) | Tối thiểu |
|-------|-------------|-----------|
| Junior | $20-25 | 3 tháng |
| Mid | $30-35 | 3 tháng |
| Senior | $40-50 | 6 tháng |
| Tech Lead | $55-65 | 6 tháng |
| Architect | $70-85 | 12 tháng |

## Discount Policy
- 10%: Deal > $100K hoặc commitment > 12 tháng
- 15%: Deal > $200K + referral
- 20%: Strategic account (cần VP approval)
- > 20%: KHÔNG được phép

## Approval Matrix
- Discount ≤ 10%: Sales Manager
- Discount 11-15%: Sales Director
- Discount 16-20%: VP Sales
- Pricing exception: CEO`,
    tags: ["pricing", "discount", "policy"],
    author: "Nguyễn Văn An", authorRole: "Sales Director",
    createdDate: "2025-06-01", updatedDate: "2026-01-01",
    views: 523, likes: 71, readTime: 10, isStarred: true,
    relatedArticles: ["kb3", "kb1"],
  },
  {
    id: "kb8",
    title: "Sales Playbook: Bán sản phẩm SaaS (CRM/WMS)",
    summary: "Quy trình bán product khác với outsource. Focus vào demo, trial, và recurring revenue.",
    category: "playbook",
    difficulty: "intermediate",
    content: `## Khác biệt vs Outsource

| Yếu tố | Outsource | Product |
|---------|-----------|---------|
| Cycle | 4-8 tuần | 2-4 tuần |
| Focus | Team capability | Product fit |
| Pricing | Hourly/monthly | Per-user/tier |
| Upsell | Add members | Add modules |

## Quy trình bán Product
1. Demo request → Schedule trong 24h
2. Live demo 45 phút (30 demo + 15 Q&A)
3. Free trial 14 ngày
4. Follow-up ngày 7 và 12
5. Close hoặc extend trial

## Metrics cần track
- Demo-to-trial: Target 60%
- Trial-to-paid: Target 30%
- Time-to-close: Target 21 ngày`,
    tags: ["SaaS", "product", "demo", "trial"],
    author: "Lê Minh Cường", authorRole: "Business Development",
    createdDate: "2025-11-20", updatedDate: "2026-02-05",
    views: 198, likes: 33, readTime: 8, isStarred: false,
    relatedArticles: ["kb1", "kb5"],
  },
  {
    id: "kb9",
    title: "FAQ: Câu hỏi thường gặp từ khách hàng",
    summary: "Top 10 câu hỏi khách hàng thường hỏi và cách trả lời chuẩn. Luôn cập nhật.",
    category: "faq",
    difficulty: "beginner",
    content: `## Top 10 FAQ

**Q1: Các bạn có bao nhiêu nhân viên?**
→ "Chúng tôi có hơn 200 kỹ sư, trong đó 70% là Senior+"

**Q2: Đã làm dự án AI/ML nào chưa?**
→ Tham khảo case study TechCorp, MediSys

**Q3: Timezone có overlap không?**
→ "Team linh hoạt, overlap 4-6 giờ/ngày với mọi timezone"

**Q4: Bảo mật dữ liệu?**
→ "ISO 27001 certified, NDA ký trước khi bắt đầu"

**Q5: Nếu nhân viên nghỉ thì sao?**
→ "Backup policy: luôn có 1 shadow cho mỗi critical role"`,
    tags: ["FAQ", "common-questions", "preparation"],
    author: "Hoàng Thị Mai", authorRole: "Account Manager",
    createdDate: "2025-07-01", updatedDate: "2026-03-01",
    views: 687, likes: 89, readTime: 5, isStarred: true,
    relatedArticles: ["kb3", "kb6"],
  },
  {
    id: "kb10",
    title: "Case Study: MediSys EMR — Healthcare Digital Transformation",
    summary: "Triển khai hệ thống EMR cho chuỗi 12 phòng khám. Dự án product + consulting kết hợp.",
    category: "case-study",
    difficulty: "intermediate",
    content: `## Bối cảnh
MediSys — chuỗi 12 phòng khám tại TP.HCM, 500+ bác sĩ

## Thách thức
- Hệ thống legacy 10 năm tuổi
- Dữ liệu phân tán 12 location
- HIPAA-like compliance requirements

## Giải pháp
- Phase 1 (6 tháng): Core EMR + Data migration
- Phase 2 (3 tháng): AI diagnostics + Analytics dashboard
- Training program cho 500+ staff

## Kết quả
- Giảm 60% thời gian nhập liệu
- 0 sự cố bảo mật sau 12 tháng
- NPS score: 82
- Upsell Phase 3: Telemedicine module`,
    tags: ["healthcare", "EMR", "product", "success"],
    author: "Nguyễn Văn An", authorRole: "Sales Director",
    createdDate: "2026-01-15", updatedDate: "2026-02-28",
    views: 176, likes: 29, readTime: 7, isStarred: false,
    relatedArticles: ["kb5"],
  },
  {
    id: "kb11",
    title: "Quy trình: Onboarding khách hàng mới",
    summary: "Checklist và timeline onboarding khách hàng sau khi ký hợp đồng. Template tài liệu kickoff.",
    category: "process",
    difficulty: "beginner",
    content: `## Timeline chuẩn

### Ngày 1-2: Admin setup
- [ ] Tạo project trong Jira/Azure DevOps
- [ ] Setup communication channels (Slack/Teams)
- [ ] NDA & contract signed
- [ ] Access provisioning

### Ngày 3-5: Kickoff
- [ ] Kickoff meeting (PM + Tech Lead + Client)
- [ ] Requirement walkthrough
- [ ] Sprint 0 planning
- [ ] Development environment setup

### Tuần 2: Ramp-up
- [ ] First sprint started
- [ ] Daily standup schedule confirmed
- [ ] Reporting cadence agreed
- [ ] Escalation matrix shared`,
    tags: ["onboarding", "process", "checklist"],
    author: "Hoàng Thị Mai", authorRole: "Account Manager",
    createdDate: "2025-09-01", updatedDate: "2026-02-01",
    views: 402, likes: 55, readTime: 6, isStarred: false,
    relatedArticles: ["kb1", "kb8"],
  },
  {
    id: "kb12",
    title: "Xử lý từ chối: \"Timeline quá dài\"",
    summary: "Khi khách hàng muốn nhanh hơn. Cách negotiate scope vs timeline, MVP approach.",
    category: "objection",
    difficulty: "intermediate",
    content: `## Phản hồi mẫu
"Tôi hiểu urgency của dự án. Hãy cùng xem chúng ta có thể phân chia thành MVP + iterations không?"

## Strategy: MVP First
1. Xác định 3-5 core features cho MVP
2. Propose timeline MVP: 6-8 tuần (thay vì 16 tuần full)
3. Iterate sau MVP dựa trên user feedback

## Nếu khách vẫn push timeline gốc
- Option A: Tăng team size (trade-off: cost)
- Option B: Giảm scope (trade-off: features)
- Option C: Parallel development tracks (trade-off: complexity)
- KHÔNG bao giờ hứa timeline không realistic`,
    tags: ["objection", "timeline", "MVP", "scope"],
    author: "Lê Minh Cường", authorRole: "Business Development",
    createdDate: "2025-12-10", updatedDate: "2026-02-25",
    views: 245, likes: 36, readTime: 5, isStarred: false,
    relatedArticles: ["kb3", "kb6"],
  },
  {
    id: "kb13",
    title: "Battle Card: So sánh với đối thủ KMS Technology",
    summary: "Phân tích điểm mạnh/yếu so với KMS. Focus vào quality, testing expertise và US market.",
    category: "battle-card",
    difficulty: "advanced",
    content: `## Tổng quan
KMS Technology: 1,800+ nhân viên, mạnh QA/Testing, focus US market

## Điểm mạnh
- QA/Testing expertise hàng đầu
- US office & sales team
- Cloud-native approach

## Điểm yếu
- Giá cao hơn 15-20% so với market
- Chậm scale cho dự án lớn
- Ít kinh nghiệm AI/ML sâu

## Khi nào chúng ta thắng
- Dự án cần AI/ML expertise
- Khách hàng price-sensitive
- Cần ramp-up nhanh (< 2 tuần)`,
    tags: ["competitor", "KMS", "US-market"],
    author: "Lê Minh Cường", authorRole: "Business Development",
    createdDate: "2026-01-05", updatedDate: "2026-02-20",
    views: 156, likes: 24, readTime: 5, isStarred: false,
    relatedArticles: ["kb2", "kb4"],
  },
  {
    id: "kb14",
    title: "Quy trình: Escalation & Account Recovery",
    summary: "Khi khách hàng không hài lòng — quy trình escalation, recovery plan, và communication template.",
    category: "process",
    difficulty: "advanced",
    content: `## Mức độ Escalation

### Level 1 — Yellow (Account Manager xử lý)
- Feedback tiêu cực nhẹ
- Response time: 24h
- Action: 1-on-1 call, document feedback, action plan

### Level 2 — Orange (Sales Director tham gia)
- Đe dọa giảm scope/team
- Response time: 4h
- Action: Executive meeting, recovery plan, discount/credits

### Level 3 — Red (VP/CEO tham gia)
- Đe dọa chấm dứt hợp đồng
- Response time: 2h
- Action: War room, on-site visit, executive sponsor

## Recovery Template
1. Acknowledge the issue (KHÔNG đổ lỗi)
2. Present root cause analysis
3. Action plan with timeline
4. Compensation if applicable
5. Follow-up schedule`,
    tags: ["escalation", "recovery", "process", "crisis"],
    author: "Nguyễn Văn An", authorRole: "Sales Director",
    createdDate: "2025-08-20", updatedDate: "2026-01-30",
    views: 198, likes: 31, readTime: 8, isStarred: true,
    relatedArticles: ["kb11"],
  },
];

/* ============================================================
 * Article Card
 * ============================================================ */
function ArticleCard({ article, onSelect }: {
  article: Article;
  onSelect: (article: Article) => void;
}) {
  const catCfg = CATEGORY_CONFIG[article.category];
  const diffCfg = DIFFICULTY_CONFIG[article.difficulty];

  return (
    <div
      className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onSelect(article)}
    >
      <div className="flex items-start gap-3">
        <span className={`p-2 rounded-lg ${catCfg.bgColor} ${catCfg.color} flex-shrink-0 border`}>
          {catCfg.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            {article.isStarred && <Star className="w-3 h-3 text-amber-400 fill-amber-400 flex-shrink-0" />}
            <h4 className="text-sm text-gray-900 truncate group-hover:text-violet-600 transition-colors">
              {article.title}
            </h4>
          </div>
          <p className="text-xs text-gray-500 line-clamp-2 mb-2">{article.summary}</p>

          {/* Tags */}
          <div className="flex items-center gap-1 flex-wrap mb-2">
            <span className={`text-[9px] px-1.5 py-0.5 rounded ${diffCfg.color}`}>
              {diffCfg.label}
            </span>
            {article.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-gray-50 text-gray-400 border border-gray-100">
                {tag}
              </span>
            ))}
            {article.tags.length > 2 && (
              <span className="text-[9px] text-gray-300">+{article.tags.length - 2}</span>
            )}
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 text-[10px] text-gray-400">
            <span className="flex items-center gap-0.5">
              <Users className="w-3 h-3" /> {article.author}
            </span>
            <span className="flex items-center gap-0.5">
              <Eye className="w-3 h-3" /> {article.views}
            </span>
            <span className="flex items-center gap-0.5">
              <ThumbsUp className="w-3 h-3" /> {article.likes}
            </span>
            <span className="flex items-center gap-0.5">
              <Clock className="w-3 h-3" /> {article.readTime} phút
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Article Detail Modal
 * ============================================================ */
function ArticleDetailModal({ article, allArticles, onClose }: {
  article: Article;
  allArticles: Article[];
  onClose: () => void;
}) {
  const catCfg = CATEGORY_CONFIG[article.category];
  const diffCfg = DIFFICULTY_CONFIG[article.difficulty];
  const related = allArticles.filter((a) => article.relatedArticles.includes(a.id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <span className={`p-2 rounded-lg ${catCfg.bgColor} ${catCfg.color} border flex-shrink-0 mt-0.5`}>
              {catCfg.icon}
            </span>
            <div className="min-w-0">
              <h2 className="text-gray-900">{article.title}</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className={`text-[9px] px-1.5 py-0.5 rounded border ${catCfg.bgColor} ${catCfg.color}`}>
                  {catCfg.label}
                </span>
                <span className={`text-[9px] px-1.5 py-0.5 rounded ${diffCfg.color}`}>
                  {diffCfg.label}
                </span>
                <span className="text-[10px] text-gray-400">
                  {article.readTime} phút đọc
                </span>
              </div>
            </div>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 flex-shrink-0">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4 space-y-4">
          {/* Author info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-sm flex-shrink-0">
              {article.author.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">{article.author}</p>
              <p className="text-[10px] text-gray-400">{article.authorRole} · Cập nhật {new Date(article.updatedDate).toLocaleDateString("vi-VN")}</p>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {article.views}</span>
              <span className="flex items-center gap-0.5"><ThumbsUp className="w-3 h-3" /> {article.likes}</span>
            </div>
          </div>

          {/* Article body - rendered as simple markdown-like */}
          <div className="prose prose-sm max-w-none">
            {article.content.split("\n").map((line, i) => {
              if (line.startsWith("## ")) {
                return <h3 key={i} className="text-gray-900 mt-4 mb-2 text-sm border-b border-gray-100 pb-1">{line.replace("## ", "")}</h3>;
              }
              if (line.startsWith("### ")) {
                return <h4 key={i} className="text-gray-800 mt-3 mb-1 text-sm">{line.replace("### ", "")}</h4>;
              }
              if (line.startsWith("- ")) {
                return <p key={i} className="text-gray-600 text-sm pl-4 py-0.5">• {line.replace("- ", "")}</p>;
              }
              if (line.startsWith("| ")) {
                return <p key={i} className="text-gray-600 text-xs font-mono bg-gray-50 px-2 py-1">{line}</p>;
              }
              if (line.startsWith("**")) {
                return <p key={i} className="text-gray-800 text-sm mt-2">{line.replace(/\*\*/g, "")}</p>;
              }
              if (line.startsWith("→")) {
                return <p key={i} className="text-gray-500 text-sm pl-4 italic">{line}</p>;
              }
              if (line.trim() === "") return <div key={i} className="h-2" />;
              return <p key={i} className="text-gray-600 text-sm">{line}</p>;
            })}
          </div>

          {/* Tags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <Tag className="w-3 h-3 text-gray-400" />
            {article.tags.map((tag) => (
              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                {tag}
              </span>
            ))}
          </div>

          {/* Related Articles */}
          {related.length > 0 && (
            <div className="bg-blue-50 rounded-lg border border-blue-100 p-3">
              <h4 className="text-xs text-blue-800 mb-2 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5" /> Bài viết liên quan
              </h4>
              <div className="space-y-1.5">
                {related.map((r) => (
                  <div key={r.id} className="flex items-center gap-2 text-sm text-blue-700">
                    <ChevronRight className="w-3 h-3 text-blue-400" />
                    <span className="truncate">{r.title}</span>
                    <span className="text-[9px] text-blue-400 flex-shrink-0">
                      {CATEGORY_CONFIG[r.category].label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toast.success("Đã thích bài viết")}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
            >
              <ThumbsUp className="w-3.5 h-3.5" /> Hữu ích
            </button>
            <button
              type="button"
              onClick={() => toast.info("Cảm ơn phản hồi, nội dung sẽ được cải thiện")}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            type="button"
            onClick={() => { toast.success("Đã sao chép nội dung"); }}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <Copy className="w-3.5 h-3.5" /> Sao chép
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Create Article Modal
 * ============================================================ */
function CreateArticleModal({ onClose, onCreated }: { onClose: () => void; onCreated: (article: Article) => void }) {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState<ArticleCategory>("playbook");
  const [difficulty, setDifficulty] = useState<ArticleDifficulty>("beginner");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) { setTags((prev) => [...prev, t]); setTagInput(""); }
  };

  const handleSave = () => {
    if (!title.trim()) { toast.error("Vui lòng nhập tiêu đề bài viết"); return; }
    if (!content.trim()) { toast.error("Vui lòng nhập nội dung"); return; }
    setSaving(true);
    const now = new Date().toISOString().slice(0, 10);
    const newArticle: Article = {
      id: `art_${Date.now()}`, title, summary: summary || title,
      category, difficulty, content, tags,
      author: "Người dùng hiện tại", authorRole: "Sales Manager",
      createdDate: now, updatedDate: now,
      views: 0, likes: 0, readTime: Math.max(1, Math.ceil(content.length / 800)),
      isStarred: false, relatedArticles: [],
    };
    onCreated(newArticle);
    toast.success(`Đã tạo bài viết "${title}"`);
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-gray-900">Tạo bài viết mới</h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-4 space-y-3 max-h-[65vh] overflow-y-auto">
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tiêu đề *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="VD: Cách xử lý objection về giá"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tóm tắt</label>
            <input type="text" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Tóm tắt ngắn..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Danh mục</label>
              <select value={category} onChange={(e) => setCategory(e.target.value as ArticleCategory)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                {Object.entries(CATEGORY_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">Độ khó</label>
              <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as ArticleDifficulty)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500">
                <option value="beginner">Cơ bản</option>
                <option value="intermediate">Trung bình</option>
                <option value="advanced">Nâng cao</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Nội dung *</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={5}
              placeholder="Nhập nội dung bài viết..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Tags</label>
            <div className="flex items-center gap-2">
              <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Nhập tag + Enter"
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              <button type="button" onClick={addTag} className="px-3 py-2 text-sm text-violet-600 hover:bg-violet-50 rounded-lg border border-violet-200">Thêm</button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((t) => (
                  <span key={t} className="text-[9px] px-2 py-0.5 bg-violet-50 text-violet-600 rounded flex items-center gap-1">
                    {t}
                    <button type="button" onClick={() => setTags((prev) => prev.filter((x) => x !== t))} className="text-violet-400 hover:text-violet-700">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="bg-violet-50 rounded-lg p-3 border border-violet-100">
            <p className="text-[10px] text-violet-700 flex items-center gap-1"><Sparkles className="w-3 h-3" /> AI sẽ tự động gợi ý tags, tạo related articles, và tối ưu SEO cho bài viết.</p>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 p-4 border-t border-gray-100">
          <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">Hủy</button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 disabled:opacity-50">
            {saving ? "Đang tạo..." : "Tạo bài viết"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Trang chính
 * ============================================================ */
export function KnowledgeBasePage() {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState<ArticleCategory | "">("");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [showStarredOnly, setShowStarredOnly] = useState(false);
  const [articles, setArticles] = useState(ARTICLES);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredArticles = useMemo(() => {
    let result = [...articles];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.summary.toLowerCase().includes(q) ||
          a.tags.some((t) => t.toLowerCase().includes(q)) ||
          a.content.toLowerCase().includes(q),
      );
    }
    if (filterCategory) result = result.filter((a) => a.category === filterCategory);
    if (showStarredOnly) result = result.filter((a) => a.isStarred);
    return result.sort((a, b) => b.views - a.views);
  }, [articles, search, filterCategory, showStarredOnly]);

  const stats = useMemo(() => ({
    total: articles.length,
    totalViews: articles.reduce((s, a) => s + a.views, 0),
    totalLikes: articles.reduce((s, a) => s + a.likes, 0),
    starred: articles.filter((a) => a.isStarred).length,
  }), [articles]);

  const categoryTabs = [
    { key: "" as const, label: "Tất cả" },
    ...Object.entries(CATEGORY_CONFIG).map(([key, cfg]) => ({
      key: key as ArticleCategory,
      label: cfg.label,
    })),
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-gray-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-violet-600" /> Knowledge Base
          </h1>
          <p className="text-gray-500 mt-0.5">
            Tài liệu nội bộ sales: playbook, battle cards, case studies, FAQ, pricing guide
          </p>
        </div>
        <button type="button" onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1 px-3 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 self-start">
          <Plus className="w-4 h-4" /> Thêm bài viết
        </button>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-lg text-gray-900">{stats.total}</p>
          <p className="text-xs text-gray-500">Bài viết</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-lg text-gray-900">{stats.totalViews.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Lượt xem</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-lg text-gray-900">{stats.totalLikes}</p>
          <p className="text-xs text-gray-500">Lượt thích</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
          <p className="text-lg text-amber-600 flex items-center justify-center gap-1">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" /> {stats.starred}
          </p>
          <p className="text-xs text-gray-500">Quan trọng</p>
        </div>
      </div>

      {/* AI Search */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 rounded-xl border border-violet-100 p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h3 className="text-sm text-violet-900">AI-Powered Search</h3>
        </div>
        <div className="relative">
          <Bot className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-violet-400" />
          <input
            type="text"
            placeholder="Hỏi AI: &quot;Cách xử lý khi khách nói giá cao?&quot;, &quot;So sánh với FPT&quot;..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-violet-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder:text-violet-300"
          />
        </div>
        {search && (
          <p className="text-[10px] text-violet-500 mt-2 flex items-center gap-1">
            <Bot className="w-3 h-3" /> Tìm thấy {filteredArticles.length} kết quả cho "{search}"
          </p>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1 overflow-x-auto flex-1">
          {categoryTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setFilterCategory(tab.key as ArticleCategory | "")}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors ${
                filterCategory === tab.key
                  ? "bg-violet-600 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setShowStarredOnly(!showStarredOnly)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
            showStarredOnly
              ? "bg-amber-100 text-amber-700 border border-amber-200"
              : "text-gray-400 hover:bg-gray-100"
          }`}
        >
          <Star className={`w-3.5 h-3.5 ${showStarredOnly ? "fill-amber-400" : ""}`} />
          Quan trọng
        </button>
      </div>

      {/* Articles List */}
      <div className="space-y-3">
        {filteredArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onSelect={setSelectedArticle}
          />
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40" />
          <p className="text-sm">Không tìm thấy bài viết phù hợp</p>
        </div>
      )}

      {/* Bottom AI Tip */}
      <div className="bg-white rounded-xl border border-gray-100 p-4">
        <div className="flex items-center gap-2 text-sm">
          <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <p className="text-gray-600">
            <span className="text-gray-900">Mẹo:</span> Sử dụng Knowledge Base trước mỗi cuộc gọi sales.
            Nhân viên đọc battle card trước meeting có win rate cao hơn <span className="text-green-600">23%</span>.
          </p>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          allArticles={articles}
          onClose={() => setSelectedArticle(null)}
        />
      )}
      {showCreateModal && <CreateArticleModal onClose={() => setShowCreateModal(false)} onCreated={(article) => setArticles((prev) => [article, ...prev])} />}
    </div>
  );
}