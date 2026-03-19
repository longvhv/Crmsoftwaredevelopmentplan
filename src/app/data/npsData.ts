/**
 * Mock data — NPS Tracker
 */
import type { FeedbackEntry, ClientNPS } from "../types/crm";

export const npsFeedbacks: FeedbackEntry[] = [
  { id: "f1", clientName: "David Chen", clientCompany: "TechCorp Inc.", score: 9, category: "promoter",
    channel: "survey", comment: "Team rất chuyên nghiệp, delivery đúng hạn. AI features vượt kỳ vọng.", date: "2026-03-01",
    sentiment: "positive", tags: ["delivery", "AI", "chuyên nghiệp"], responded: true },
  { id: "f2", clientName: "David Chen", clientCompany: "TechCorp Inc.", score: 10, category: "promoter",
    channel: "meeting", comment: "Sẵn sàng giới thiệu cho partner khác. Quan hệ hợp tác xuất sắc.", date: "2026-02-15",
    sentiment: "positive", tags: ["referral", "partnership"], responded: true },
  { id: "f3", clientName: "Sarah Miller", clientCompany: "InnovateAI", score: 7, category: "passive",
    channel: "email", comment: "Chất lượng code tốt nhưng bug resolution hơi chậm. Cần cải thiện response time.", date: "2026-02-28",
    sentiment: "neutral", tags: ["bug-resolution", "response-time"], responded: true },
  { id: "f4", clientName: "Tanaka Yuki", clientCompany: "GlobalSoft Japan", score: 10, category: "promoter",
    channel: "survey", comment: "WMS hoạt động ổn định, uptime xuất sắc. Support team rất nhanh.", date: "2026-02-25",
    sentiment: "positive", tags: ["uptime", "support", "ổn định"], responded: true },
  { id: "f5", clientName: "Robert Kim", clientCompany: "FinServe Korea", score: 5, category: "detractor",
    channel: "call", comment: "Sprint delivery liên tục trễ. Cần thêm senior devs. Đang xem xét options khác.", date: "2026-03-02",
    sentiment: "negative", tags: ["delivery-trễ", "staffing", "churn-risk"], responded: false },
  { id: "f6", clientName: "Robert Kim", clientCompany: "FinServe Korea", score: 6, category: "detractor",
    channel: "survey", comment: "Communication gap giữa team Dev và PM. Ticket response quá chậm.", date: "2026-02-20",
    sentiment: "negative", tags: ["communication", "response-time"], responded: true },
  { id: "f7", clientName: "Trần Quốc Bảo", clientCompany: "MediSys", score: 8, category: "passive",
    channel: "in-app", comment: "EMR ổn định, nhưng UI/UX cần modernize. Mong đợi Phase 2.", date: "2026-02-22",
    sentiment: "neutral", tags: ["UI/UX", "modernize"], responded: true },
  { id: "f8", clientName: "Emma Wilson", clientCompany: "DigitalWave EU", score: 3, category: "detractor",
    channel: "meeting", comment: "Rất thất vọng. Sprint delivery chỉ 72%, nhiều bug. Cần họp escalation.", date: "2026-03-02",
    sentiment: "negative", tags: ["delivery", "bug", "escalation"], responded: false },
  { id: "f9", clientName: "Emma Wilson", clientCompany: "DigitalWave EU", score: 4, category: "detractor",
    channel: "email", comment: "Tech Lead mới chưa hiểu domain. Mất 2 tuần để onboard lại.", date: "2026-02-10",
    sentiment: "negative", tags: ["onboarding", "domain-knowledge"], responded: true },
  { id: "f10", clientName: "Lý Quang Minh", clientCompany: "VietFintech", score: 9, category: "promoter",
    channel: "survey", comment: "CRM hoạt động tốt, team support rất tận tâm. Đã gia hạn hợp đồng.", date: "2026-02-28",
    sentiment: "positive", tags: ["support", "tận tâm", "renewal"], responded: true },
  { id: "f11", clientName: "Lý Quang Minh", clientCompany: "VietFintech", score: 9, category: "promoter",
    channel: "in-app", comment: "AI features giúp tiết kiệm 30% thời gian data entry. Rất hài lòng.", date: "2026-01-15",
    sentiment: "positive", tags: ["AI", "productivity", "hài lòng"], responded: true },
  { id: "f12", clientName: "Park Ji-won", clientCompany: "SeoulTech Labs", score: 8, category: "passive",
    channel: "survey", comment: "Training program chất lượng tốt. Mong có advanced course.", date: "2025-04-20",
    sentiment: "positive", tags: ["training", "quality"], responded: true },
  { id: "f13", clientName: "Tanaka Yuki", clientCompany: "GlobalSoft Japan", score: 9, category: "promoter",
    channel: "call", comment: "Phiên dịch tốt, team hiểu rõ quy trình kho Nhật. Sẵn sàng mở rộng.", date: "2026-01-20",
    sentiment: "positive", tags: ["localization", "mở rộng"], responded: true },
  { id: "f14", clientName: "Sarah Miller", clientCompany: "InnovateAI", score: 7, category: "passive",
    channel: "in-app", comment: "ML model accuracy đạt 89% — gần target 92%. Cần thêm training data.", date: "2026-01-30",
    sentiment: "neutral", tags: ["ML-accuracy", "training-data"], responded: true },
  { id: "f15", clientName: "Trần Quốc Bảo", clientCompany: "MediSys", score: 9, category: "promoter",
    channel: "meeting", comment: "Support 24/7 rất ấn tượng. Đặc biệt critical bug fix nhanh.", date: "2026-01-10",
    sentiment: "positive", tags: ["support-24/7", "bug-fix"], responded: true },
];

export const clientNpsRecords: ClientNPS[] = [
  { id: "cn1", clientCompany: "TechCorp Inc.", clientName: "David Chen", currentNPS: 95, previousNPS: 88, trend: "up", responseCount: 2, avgScore: 9.5, lastFeedback: "2026-03-01", topConcern: null, topPraise: "Delivery đúng hạn, AI features" },
  { id: "cn2", clientCompany: "InnovateAI", clientName: "Sarah Miller", currentNPS: 40, previousNPS: 55, trend: "down", responseCount: 2, avgScore: 7.0, lastFeedback: "2026-02-28", topConcern: "Bug resolution chậm", topPraise: "Chất lượng code tốt" },
  { id: "cn3", clientCompany: "GlobalSoft Japan", clientName: "Tanaka Yuki", currentNPS: 100, previousNPS: 95, trend: "up", responseCount: 2, avgScore: 9.5, lastFeedback: "2026-02-25", topConcern: null, topPraise: "Uptime xuất sắc, support nhanh" },
  { id: "cn4", clientCompany: "FinServe Korea", clientName: "Robert Kim", currentNPS: -80, previousNPS: -40, trend: "down", responseCount: 2, avgScore: 5.5, lastFeedback: "2026-03-02", topConcern: "Sprint delivery trễ, staffing", topPraise: null },
  { id: "cn5", clientCompany: "MediSys", clientName: "Trần Quốc Bảo", currentNPS: 50, previousNPS: 45, trend: "up", responseCount: 2, avgScore: 8.5, lastFeedback: "2026-02-22", topConcern: "UI/UX cần modernize", topPraise: "Support 24/7 ấn tượng" },
  { id: "cn6", clientCompany: "DigitalWave EU", clientName: "Emma Wilson", currentNPS: -100, previousNPS: -60, trend: "down", responseCount: 2, avgScore: 3.5, lastFeedback: "2026-03-02", topConcern: "Delivery 72%, nhiều bug", topPraise: null },
  { id: "cn7", clientCompany: "VietFintech", clientName: "Lý Quang Minh", currentNPS: 100, previousNPS: 90, trend: "up", responseCount: 2, avgScore: 9.0, lastFeedback: "2026-02-28", topConcern: null, topPraise: "AI tiết kiệm 30% thời gian" },
  { id: "cn8", clientCompany: "SeoulTech Labs", clientName: "Park Ji-won", currentNPS: 50, previousNPS: 50, trend: "stable", responseCount: 1, avgScore: 8.0, lastFeedback: "2025-04-20", topConcern: null, topPraise: "Training chất lượng" },
];

/** Dữ liệu xu hướng NPS theo tháng */
export const npsTrendData = [
  { month: "T10", nps: 42, promoters: 45, passives: 30, detractors: 25 },
  { month: "T11", nps: 38, promoters: 40, passives: 35, detractors: 25 },
  { month: "T12", nps: 35, promoters: 42, passives: 30, detractors: 28 },
  { month: "T1", nps: 40, promoters: 48, passives: 28, detractors: 24 },
  { month: "T2", nps: 36, promoters: 44, passives: 26, detractors: 30 },
  { month: "T3", nps: 38, promoters: 46, passives: 24, detractors: 30 },
];
