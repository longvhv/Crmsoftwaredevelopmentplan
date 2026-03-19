/**
 * Mock data — Competitor Analysis.
 * Đối thủ cạnh tranh + lịch sử win/loss.
 */
import type { Competitor, WinLossRecord } from "../types/crm";

/* ============================================================
 * Competitors
 * ============================================================ */
export const competitors: Competitor[] = [
  {
    id: "c1", name: "AlphaTech Solutions", logo: "AT",
    description: "Đối thủ trực tiếp mạnh nhất, chuyên outsource + AI cho thị trường APAC",
    region: "Đông Nam Á, Nhật Bản", threat: "high",
    strengths: ["Team size lớn (500+ devs)", "Giá rẻ hơn 15-20%", "Có office Tokyo", "Kinh nghiệm fintech lâu năm"],
    weaknesses: ["Chất lượng code không đồng đều", "Turnover cao", "AI capability yếu", "Không có sản phẩm riêng"],
    pricing: "$28-45/h (Outsource), Thấp hơn 15-20%",
    ourWinRate: 62, totalEncounters: 13, dealsWon: 8, dealsLost: 5, avgDealSize: 85000,
    skills: [
      { name: "Pricing", score: 88 }, { name: "Team Size", score: 92 }, { name: "AI/ML", score: 45 },
      { name: "Quality", score: 55 }, { name: "Product", score: 20 }, { name: "Support", score: 60 },
    ],
    ourSkills: [
      { name: "Pricing", score: 65 }, { name: "Team Size", score: 60 }, { name: "AI/ML", score: 92 },
      { name: "Quality", score: 88 }, { name: "Product", score: 85 }, { name: "Support", score: 82 },
    ],
    battleCards: [
      { id: "bc1", topic: "Giá cả", ourStrength: "Chất lượng/giá tốt nhất — AI tự động giảm 30% rework", theirWeakness: "Giá rẻ nhưng rework nhiều, total cost cao hơn", talkingPoint: "Hãy so sánh total cost of ownership, không chỉ hourly rate" },
      { id: "bc2", topic: "AI Capability", ourStrength: "AI Agent tích hợp sẵn, AutoML pipeline", theirWeakness: "Chưa có team AI chuyên biệt", talkingPoint: "Client cần demo AI Agent vs manual process — time savings 40%" },
      { id: "bc3", topic: "Chất lượng", ourStrength: "Defect rate <2%, SLA 98%+", theirWeakness: "Defect rate ~8%, turnover gây knowledge loss", talkingPoint: "Yêu cầu client check reference — NPS score và defect metrics" },
    ],
    aiInsight: "Đối thủ đang mở rộng team AI. Cần duy trì technology lead bằng cách đẩy mạnh AI features trong demo.",
    topWinReason: "AI capability vượt trội + chất lượng code cao",
    topLossReason: "Giá hourly rate cao hơn 15-20%",
    tags: ["direct-competitor", "apac"],
  },
  {
    id: "c2", name: "ByteWorks Global", logo: "BW",
    description: "Chuyên consulting + managed services, khách hàng enterprise Âu Mỹ",
    region: "EU, Bắc Mỹ", threat: "medium",
    strengths: ["Brand awareness cao EU/US", "Consulting framework matured", "ISO certifications đầy đủ", "Partnership Salesforce/SAP"],
    weaknesses: ["Giá rất cao ($80-120/h)", "Không focus Đông Nam Á", "Development speed chậm", "Legacy stack"],
    pricing: "$80-120/h (Consulting), Cao hơn 50-80%",
    ourWinRate: 71, totalEncounters: 7, dealsWon: 5, dealsLost: 2, avgDealSize: 120000,
    skills: [
      { name: "Pricing", score: 30 }, { name: "Team Size", score: 75 }, { name: "AI/ML", score: 55 },
      { name: "Quality", score: 82 }, { name: "Product", score: 40 }, { name: "Support", score: 78 },
    ],
    ourSkills: [
      { name: "Pricing", score: 80 }, { name: "Team Size", score: 60 }, { name: "AI/ML", score: 92 },
      { name: "Quality", score: 88 }, { name: "Product", score: 85 }, { name: "Support", score: 82 },
    ],
    battleCards: [
      { id: "bc4", topic: "Giá cả", ourStrength: "Giá chỉ bằng 40-60% — same quality", theirWeakness: "Rất đắt, không phù hợp mid-market", talkingPoint: "So sánh output per dollar — demo productivity metrics" },
      { id: "bc5", topic: "Tốc độ", ourStrength: "Agile sprint, delivery 2-week cycles", theirWeakness: "Waterfall-heavy, delivery cycles 4-6 weeks", talkingPoint: "Time to market là competitive advantage — faster = more revenue" },
    ],
    aiInsight: "ByteWorks yếu ở mid-market segment. Target các deals $50K-200K sẽ gặp ít cạnh tranh từ họ.",
    topWinReason: "Giá cạnh tranh + development speed nhanh hơn",
    topLossReason: "Thiếu brand recognition ở EU enterprise",
    tags: ["consulting", "eu-us"],
  },
  {
    id: "c3", name: "SaigonSoft Corp", logo: "SS",
    description: "Đối thủ nội địa lớn nhất, focus outsource Nhật Bản và sản phẩm ERP",
    region: "Việt Nam, Nhật Bản", threat: "high",
    strengths: ["Largest IT company VN (2000+ devs)", "Quan hệ Nhật lâu năm", "Sản phẩm ERP riêng", "Giá rẻ nhất thị trường"],
    weaknesses: ["Innovation chậm", "Bộ máy cồng kềnh", "AI adoption thấp", "Quản lý theo kiểu cũ"],
    pricing: "$22-35/h (Outsource), Thấp hơn 25-30%",
    ourWinRate: 55, totalEncounters: 11, dealsWon: 6, dealsLost: 5, avgDealSize: 60000,
    skills: [
      { name: "Pricing", score: 95 }, { name: "Team Size", score: 98 }, { name: "AI/ML", score: 30 },
      { name: "Quality", score: 62 }, { name: "Product", score: 70 }, { name: "Support", score: 55 },
    ],
    ourSkills: [
      { name: "Pricing", score: 65 }, { name: "Team Size", score: 60 }, { name: "AI/ML", score: 92 },
      { name: "Quality", score: 88 }, { name: "Product", score: 85 }, { name: "Support", score: 82 },
    ],
    battleCards: [
      { id: "bc6", topic: "Đổi mới", ourStrength: "AI-first approach, modern stack", theirWeakness: "Legacy mindset, slow adoption", talkingPoint: "Hỏi client: 'Bạn cần vendor giữ status quo hay partner giúp innovate?'" },
      { id: "bc7", topic: "Team Quality", ourStrength: "Senior ratio 40%, low turnover", theirWeakness: "Junior-heavy, high turnover", talkingPoint: "Yêu cầu demo team CVs — so sánh experience level" },
    ],
    aiInsight: "SaigonSoft đang mất thị phần Nhật vì chất lượng giảm. Cơ hội lấy clients Nhật đang chuyển đổi vendor.",
    topWinReason: "AI capabilities + team quality vượt trội",
    topLossReason: "Giá hourly rate và team size không cạnh tranh",
    tags: ["domestic", "japan-market"],
  },
  {
    id: "c4", name: "CloudNine Labs", logo: "C9",
    description: "Startup AI-native, chuyên ML/AI products, nổi lên nhanh 2 năm gần đây",
    region: "Singapore, Mỹ", threat: "medium",
    strengths: ["AI-native DNA", "Top talent từ Google/Meta", "Funding dồi dào ($50M Series B)", "Community & thought leadership"],
    weaknesses: ["Chưa có outsource model", "Scale hạn chế (<100 người)", "Giá cao $100+/h", "Chưa có track record enterprise"],
    pricing: "$100-150/h (AI Consulting), Rất cao",
    ourWinRate: 67, totalEncounters: 6, dealsWon: 4, dealsLost: 2, avgDealSize: 95000,
    skills: [
      { name: "Pricing", score: 25 }, { name: "Team Size", score: 20 }, { name: "AI/ML", score: 95 },
      { name: "Quality", score: 90 }, { name: "Product", score: 55 }, { name: "Support", score: 50 },
    ],
    ourSkills: [
      { name: "Pricing", score: 65 }, { name: "Team Size", score: 60 }, { name: "AI/ML", score: 92 },
      { name: "Quality", score: 88 }, { name: "Product", score: 85 }, { name: "Support", score: 82 },
    ],
    battleCards: [
      { id: "bc8", topic: "Scale & Reliability", ourStrength: "Full-stack team + support 24/7", theirWeakness: "Nhỏ, khó scale, support limited", talkingPoint: "Enterprise cần reliability — hỏi về SLA và team backup plan" },
      { id: "bc9", topic: "Total Solution", ourStrength: "Outsource + Product + AI = one vendor", theirWeakness: "Chỉ AI consulting, cần thêm vendor khác", talkingPoint: "Consolidate vendors = less risk, faster integration" },
    ],
    aiInsight: "CloudNine mạnh ở pure AI nhưng không có outsource. Position mình là 'AI + full delivery' — one-stop-shop.",
    topWinReason: "Full-service model + giá cạnh tranh hơn",
    topLossReason: "AI thought leadership yếu hơn ở deep ML",
    tags: ["ai-native", "startup"],
  },
  {
    id: "c5", name: "NexGen Systems", logo: "NX",
    description: "Đối thủ Ấn Độ, giá rất rẻ, chuyên staff augmentation",
    region: "Ấn Độ, Toàn cầu", threat: "low",
    strengths: ["Giá rẻ nhất ($15-25/h)", "Pool 10,000+ devs", "Presence toàn cầu", "CMMI Level 5"],
    weaknesses: ["Timezone challenges", "Language barrier", "Cookie-cutter approach", "Không có AI focus"],
    pricing: "$15-25/h (Staff Aug), Rẻ nhất",
    ourWinRate: 78, totalEncounters: 9, dealsWon: 7, dealsLost: 2, avgDealSize: 45000,
    skills: [
      { name: "Pricing", score: 98 }, { name: "Team Size", score: 99 }, { name: "AI/ML", score: 35 },
      { name: "Quality", score: 45 }, { name: "Product", score: 30 }, { name: "Support", score: 40 },
    ],
    ourSkills: [
      { name: "Pricing", score: 65 }, { name: "Team Size", score: 60 }, { name: "AI/ML", score: 92 },
      { name: "Quality", score: 88 }, { name: "Product", score: 85 }, { name: "Support", score: 82 },
    ],
    battleCards: [
      { id: "bc10", topic: "Chất lượng", ourStrength: "Dedicated team, deep domain knowledge", theirWeakness: "Rotation cao, shallow understanding", talkingPoint: "Hỏi: 'Bao nhiêu lần phải re-explain requirements cho team mới?'" },
    ],
    aiInsight: "NexGen chỉ win khi client chọn purely by price. Focus vào value proposition — không compete on price.",
    topWinReason: "Chất lượng, timezone, và communication vượt trội",
    topLossReason: "Giá cao hơn gấp 2-3 lần",
    tags: ["india", "staff-aug"],
  },
];

/* ============================================================
 * Win/Loss Records
 * ============================================================ */
export const winLossRecords: WinLossRecord[] = [
  { id: "wl1", dealName: "TechCorp AI Platform", clientCompany: "TechCorp Inc.", competitor: "AlphaTech Solutions", outcome: "won", value: 840000, reason: "AI Agent demo thuyết phục. Client thấy automation value ngay.", date: "2025-06-15", owner: "Nguyễn Văn An", tags: ["enterprise", "ai"] },
  { id: "wl2", dealName: "FinServe API Phase 1", clientCompany: "FinServe Korea", competitor: "AlphaTech Solutions", outcome: "won", value: 360000, reason: "Security compliance và code quality audit vượt đối thủ.", date: "2025-12-20", owner: "Nguyễn Văn An", tags: ["fintech", "compliance"] },
  { id: "wl3", dealName: "RetailMax CRM", clientCompany: "RetailMax", competitor: "SaigonSoft Corp", outcome: "lost", value: 150000, reason: "Client chọn giá rẻ hơn 30%. Không đủ budget cho AI tier.", date: "2025-09-10", owner: "Lê Minh Cường", tags: ["retail", "price-sensitive"] },
  { id: "wl4", dealName: "MediSys EMR", clientCompany: "MediSys", competitor: "ByteWorks Global", outcome: "won", value: 180000, reason: "Giá cạnh tranh hơn 50% + faster delivery timeline.", date: "2025-05-20", owner: "Hoàng Thị Mai", tags: ["healthcare"] },
  { id: "wl5", dealName: "DataVault ML Pipeline", clientCompany: "DataVault", competitor: "CloudNine Labs", outcome: "lost", value: 200000, reason: "Client cần pure ML expertise. CloudNine có PhD team.", date: "2025-11-05", owner: "Lê Minh Cường", tags: ["ml", "deep-tech"] },
  { id: "wl6", dealName: "LogiTrack WMS", clientCompany: "LogiTrack", competitor: "NexGen Systems", outcome: "won", value: 90000, reason: "Timezone match + Japanese language support.", date: "2025-08-15", owner: "Lê Minh Cường", tags: ["logistics", "japan"] },
  { id: "wl7", dealName: "BankPro Core", clientCompany: "BankPro", competitor: "SaigonSoft Corp", outcome: "lost", value: 280000, reason: "SaigonSoft có quan hệ sẵn từ project trước. Incumbent advantage.", date: "2025-10-25", owner: "Trần Đức Hùng", tags: ["banking", "incumbent"] },
  { id: "wl8", dealName: "EduTech LMS", clientCompany: "EduTech", competitor: "AlphaTech Solutions", outcome: "won", value: 65000, reason: "AI-powered content recommendation demo gây ấn tượng.", date: "2026-01-15", owner: "Đỗ Hải Yến", tags: ["edtech", "ai"] },
];
