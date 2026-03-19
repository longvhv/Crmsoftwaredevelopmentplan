/**
 * Mock data — Territory Management.
 * Vùng lãnh thổ sales.
 */
import type { Territory } from "../types/crm";

export const territories: Territory[] = [
  {
    id: "t1", name: "Hồ Chí Minh & Miền Nam", region: "vietnam", country: "Việt Nam", flag: "🇻🇳",
    status: "active", revenue: 420000, target: 500000, attainment: 84,
    accounts: 85, activeDeals: 18, pipeline: 280000, avgDealSize: 12500, winRate: 38,
    reps: [
      { name: "Nguyễn Văn An", role: "Senior Sales", accounts: 45, quota: 300000, attainment: 88 },
      { name: "Phạm Thanh Tùng", role: "Account Manager", accounts: 40, quota: 200000, attainment: 78 },
    ],
    topIndustries: ["Công nghệ", "Tài chính", "Bán lẻ"],
    trend: "up", coverageScore: 82, overlapRisk: false, overlapNote: null,
    quarterRevenue: [{ quarter: "Q3'25", revenue: 95 }, { quarter: "Q4'25", revenue: 105 }, { quarter: "Q1'26", revenue: 110 }, { quarter: "Q2'26F", revenue: 130 }],
    aiInsight: "Territory mạnh nhất VN. Pipeline $280K healthy. Cơ hội mở rộng vào ngành logistics — 5 prospects chưa tiếp cận.",
    tags: ["core-market", "high-volume"],
  },
  {
    id: "t2", name: "Hà Nội & Miền Bắc", region: "vietnam", country: "Việt Nam", flag: "🇻🇳",
    status: "underperforming", revenue: 185000, target: 300000, attainment: 62,
    accounts: 52, activeDeals: 8, pipeline: 120000, avgDealSize: 9500, winRate: 28,
    reps: [
      { name: "Trần Minh Anh", role: "Sales Rep", accounts: 52, quota: 300000, attainment: 62 },
    ],
    topIndustries: ["Giáo dục", "Chính phủ", "Sản xuất"],
    trend: "down", coverageScore: 55, overlapRisk: false, overlapNote: null,
    quarterRevenue: [{ quarter: "Q3'25", revenue: 55 }, { quarter: "Q4'25", revenue: 50 }, { quarter: "Q1'26", revenue: 48 }, { quarter: "Q2'26F", revenue: 60 }],
    aiInsight: "Underperforming: 62% attainment. 1 rep cho 52 accounts quá tải. Recommend: thêm 1 rep, focus vào government sector có budget Q2.",
    tags: ["needs-attention", "government"],
  },
  {
    id: "t3", name: "Hàn Quốc", region: "apac", country: "South Korea", flag: "🇰🇷",
    status: "active", revenue: 310000, target: 350000, attainment: 89,
    accounts: 28, activeDeals: 12, pipeline: 420000, avgDealSize: 18500, winRate: 35,
    reps: [
      { name: "Hoàng Thị Mai", role: "Sales Manager", accounts: 28, quota: 350000, attainment: 89 },
    ],
    topIndustries: ["Tài chính", "Công nghệ", "Logistics"],
    trend: "up", coverageScore: 78, overlapRisk: true, overlapNote: "FinServe Korea cũng được assign cho team APAC general — cần resolve.",
    quarterRevenue: [{ quarter: "Q3'25", revenue: 72 }, { quarter: "Q4'25", revenue: 78 }, { quarter: "Q1'26", revenue: 82 }, { quarter: "Q2'26F", revenue: 95 }],
    aiInsight: "Top APAC territory. Pipeline $420K rất mạnh. FinServe overlap cần resolve ngay để tránh confuse khách hàng.",
    tags: ["apac-top", "fintech"],
  },
  {
    id: "t4", name: "Nhật Bản", region: "apac", country: "Japan", flag: "🇯🇵",
    status: "high-growth", revenue: 245000, target: 200000, attainment: 123,
    accounts: 15, activeDeals: 6, pipeline: 180000, avgDealSize: 22000, winRate: 42,
    reps: [
      { name: "Lê Minh Cường", role: "Solutions Architect", accounts: 15, quota: 200000, attainment: 123 },
    ],
    topIndustries: ["Sản xuất", "Công nghệ", "Y tế"],
    trend: "up", coverageScore: 45, overlapRisk: false, overlapNote: null,
    quarterRevenue: [{ quarter: "Q3'25", revenue: 35 }, { quarter: "Q4'25", revenue: 55 }, { quarter: "Q1'26", revenue: 72 }, { quarter: "Q2'26F", revenue: 90 }],
    aiInsight: "Vượt target 123%! Coverage chỉ 45% — rất nhiều room to grow. Cần thêm 1 rep biết tiếng Nhật để scale.",
    tags: ["high-growth", "expansion"],
  },
  {
    id: "t5", name: "Singapore & SEA", region: "apac", country: "Singapore", flag: "🇸🇬",
    status: "new", revenue: 85000, target: 150000, attainment: 57,
    accounts: 12, activeDeals: 5, pipeline: 95000, avgDealSize: 14000, winRate: 30,
    reps: [
      { name: "Đỗ Hải Yến", role: "Business Development", accounts: 12, quota: 150000, attainment: 57 },
    ],
    topIndustries: ["Fintech", "E-commerce", "Logistics"],
    trend: "up", coverageScore: 30, overlapRisk: false, overlapNote: null,
    quarterRevenue: [{ quarter: "Q3'25", revenue: 0 }, { quarter: "Q4'25", revenue: 18 }, { quarter: "Q1'26", revenue: 32 }, { quarter: "Q2'26F", revenue: 45 }],
    aiInsight: "New territory, ramping well. Singapore fintech ecosystem có 200+ prospects. Partner với local SI sẽ accelerate coverage.",
    tags: ["new-market", "fintech"],
  },
  {
    id: "t6", name: "Australia & NZ", region: "apac", country: "Australia", flag: "🇦🇺",
    status: "active", revenue: 195000, target: 220000, attainment: 89,
    accounts: 18, activeDeals: 7, pipeline: 150000, avgDealSize: 16000, winRate: 40,
    reps: [
      { name: "Partner — CloudStack ANZ", role: "Channel Partner", accounts: 18, quota: 220000, attainment: 89 },
    ],
    topIndustries: ["Mining", "Healthcare", "Education"],
    trend: "stable", coverageScore: 60, overlapRisk: false, overlapNote: null,
    quarterRevenue: [{ quarter: "Q3'25", revenue: 48 }, { quarter: "Q4'25", revenue: 50 }, { quarter: "Q1'26", revenue: 50 }, { quarter: "Q2'26F", revenue: 55 }],
    aiInsight: "Channel-led territory qua CloudStack. Revenue stable. Mining vertical có growth potential — propose industry-specific solution.",
    tags: ["channel", "stable"],
  },
  {
    id: "t7", name: "UAE & Trung Đông", region: "emea", country: "UAE", flag: "🇦🇪",
    status: "new", revenue: 65000, target: 100000, attainment: 65,
    accounts: 8, activeDeals: 3, pipeline: 85000, avgDealSize: 20000, winRate: 25,
    reps: [
      { name: "Partner — NeuralWave ME", role: "Channel Partner", accounts: 8, quota: 100000, attainment: 65 },
    ],
    topIndustries: ["Oil & Gas", "Real Estate", "Fintech"],
    trend: "up", coverageScore: 20, overlapRisk: false, overlapNote: null,
    quarterRevenue: [{ quarter: "Q3'25", revenue: 0 }, { quarter: "Q4'25", revenue: 10 }, { quarter: "Q1'26", revenue: 25 }, { quarter: "Q2'26F", revenue: 35 }],
    aiInsight: "Early-stage market. UAE government digitalization push tạo cơ hội lớn. Arabic localization sẽ tăng conversion 2x.",
    tags: ["emerging", "partner-led"],
  },
  {
    id: "t8", name: "Bắc Mỹ (US & Canada)", region: "americas", country: "United States", flag: "🇺🇸",
    status: "new", revenue: 45000, target: 80000, attainment: 56,
    accounts: 5, activeDeals: 2, pipeline: 65000, avgDealSize: 25000, winRate: 20,
    reps: [
      { name: "Trần Đức Hùng", role: "CEO (Direct)", accounts: 5, quota: 80000, attainment: 56 },
    ],
    topIndustries: ["SaaS", "AI/ML", "Consulting"],
    trend: "up", coverageScore: 8, overlapRisk: false, overlapNote: null,
    quarterRevenue: [{ quarter: "Q3'25", revenue: 0 }, { quarter: "Q4'25", revenue: 0 }, { quarter: "Q1'26", revenue: 22 }, { quarter: "Q2'26F", revenue: 30 }],
    aiInsight: "Earliest stage. CEO direct selling — không scale. Cần hire US-based sales rep hoặc partner. Product-market fit cần validate.",
    tags: ["early-stage", "ceo-direct"],
  },
];
