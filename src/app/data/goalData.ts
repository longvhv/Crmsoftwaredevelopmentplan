/**
 * Mock data cho Goal & OKR Tracking
 * Phase 3 — Centralized data layer
 */
import type { Goal } from "../types/crm";

export const goals: Goal[] = [
  {
    id: "g1", title: "Đạt ARR $5M vào cuối Q4/2026",
    description: "Mục tiêu doanh thu toàn công ty: tăng trưởng 60% so với năm trước thông qua mở rộng thị trường và upsell.",
    level: "company", status: "on-track", category: "revenue",
    owner: "CEO — Nguyễn Hữu Phúc", team: "Toàn công ty",
    progress: 68, startDate: "2026-01-01", dueDate: "2026-12-31",
    keyResults: [
      { id: "kr1a", title: "New ARR từ khách hàng mới", currentValue: 1200000, targetValue: 2000000, unit: "USD", progress: 60 },
      { id: "kr1b", title: "Expansion ARR từ upsell/cross-sell", currentValue: 850000, targetValue: 1200000, unit: "USD", progress: 71 },
      { id: "kr1c", title: "Net Revenue Retention", currentValue: 118, targetValue: 125, unit: "%", progress: 72 },
    ],
    aiCoachingNote: "Đang đúng tiến độ. Q1 vượt 5% target. Tập trung vào expansion revenue vì có ROI cao hơn 2.3x so với new business.",
    tags: ["strategic", "annual", "revenue"],
  },
  {
    id: "g2", title: "Nâng NPS lên 60+ cho tất cả khách hàng Enterprise",
    description: "Cải thiện trải nghiệm khách hàng Enterprise thông qua dedicated CSM, proactive support, và AI-driven insights.",
    level: "team", status: "at-risk", category: "customer",
    owner: "Hoàng Thị Mai", team: "Customer Success",
    progress: 45, startDate: "2026-01-01", dueDate: "2026-06-30",
    keyResults: [
      { id: "kr2a", title: "NPS trung bình Enterprise", currentValue: 52, targetValue: 60, unit: "điểm", progress: 65 },
      { id: "kr2b", title: "Thời gian phản hồi trung bình", currentValue: 2.5, targetValue: 1.5, unit: "giờ", progress: 33 },
      { id: "kr2c", title: "Tỷ lệ churn Enterprise", currentValue: 4.2, targetValue: 2, unit: "%", progress: 38 },
    ],
    aiCoachingNote: "Rủi ro ở response time. Đề xuất: (1) Thêm 1 CSM cho segment Enterprise, (2) Triển khai AI auto-triage để giảm 40% response time.",
    tags: ["customer-success", "enterprise", "NPS"],
  },
  {
    id: "g3", title: "Ra mắt CRM v2.0 với AI Copilot",
    description: "Phát triển và launch bản CRM thế hệ mới tích hợp AI Copilot, giúp sales team tăng productivity 30%.",
    level: "team", status: "on-track", category: "product",
    owner: "Phạm Hoàng Duy", team: "Engineering",
    progress: 72, startDate: "2026-01-01", dueDate: "2026-09-30",
    keyResults: [
      { id: "kr3a", title: "Số tính năng AI Copilot hoàn thành", currentValue: 8, targetValue: 12, unit: "tính năng", progress: 67 },
      { id: "kr3b", title: "Test coverage", currentValue: 82, targetValue: 90, unit: "%", progress: 78 },
      { id: "kr3c", title: "Beta user satisfaction", currentValue: 4.2, targetValue: 4.5, unit: "/5", progress: 84 },
    ],
    aiCoachingNote: "Tiến triển tốt. AI Copilot MVP nhận feedback tích cực. Ưu tiên: hoàn thành deal scoring AI và email generator trước Q3.",
    tags: ["product", "AI", "roadmap"],
  },
  {
    id: "g4", title: "Xây dựng đội ngũ AI Engineer 10 người",
    description: "Tuyển dụng và onboarding đội AI Engineer chất lượng cao để hỗ trợ chiến lược AI-first.",
    level: "team", status: "behind", category: "people",
    owner: "Lê Minh Cường", team: "HR & Talent",
    progress: 30, startDate: "2026-01-01", dueDate: "2026-06-30",
    keyResults: [
      { id: "kr4a", title: "Số AI Engineer tuyển được", currentValue: 3, targetValue: 10, unit: "người", progress: 30 },
      { id: "kr4b", title: "Thời gian onboarding trung bình", currentValue: 45, targetValue: 30, unit: "ngày", progress: 33 },
      { id: "kr4c", title: "Tỷ lệ pass probation", currentValue: 100, targetValue: 90, unit: "%", progress: 100 },
    ],
    aiCoachingNote: "Chậm tiến độ do thị trường AI Engineer khan hiếm. Gợi ý: (1) Tăng package 15%, (2) Mở rộng remote hiring, (3) Chương trình intern-to-hire.",
    tags: ["hiring", "AI-talent", "urgent"],
  },
  {
    id: "g5", title: "Đạt 20 deals won/tháng (cá nhân)",
    description: "Mục tiêu cá nhân của top performer — tăng conversion rate và deal velocity.",
    level: "individual", status: "on-track", category: "revenue",
    owner: "Nguyễn Văn An",
    progress: 85, startDate: "2026-01-01", dueDate: "2026-03-31",
    keyResults: [
      { id: "kr5a", title: "Deals won trung bình/tháng", currentValue: 17, targetValue: 20, unit: "deals", progress: 85 },
      { id: "kr5b", title: "Average deal size", currentValue: 42000, targetValue: 45000, unit: "USD", progress: 93 },
      { id: "kr5c", title: "Win rate", currentValue: 38, targetValue: 40, unit: "%", progress: 95 },
    ],
    aiCoachingNote: "Gần đạt target. Pipeline hiện tại đủ để hit target nếu giữ velocity hiện tại. Tập trung close 3 deals Enterprise đang ở negotiation.",
    tags: ["individual", "sales", "Q1"],
  },
  {
    id: "g6", title: "Giảm 30% chi phí infrastructure",
    description: "Tối ưu hóa cloud spending thông qua reserved instances, auto-scaling, và cleanup unused resources.",
    level: "team", status: "on-track", category: "operational",
    owner: "Trần Đức Hùng", team: "DevOps",
    progress: 62, startDate: "2026-01-01", dueDate: "2026-06-30",
    keyResults: [
      { id: "kr6a", title: "Chi phí cloud hàng tháng", currentValue: 28000, targetValue: 22000, unit: "USD", progress: 50 },
      { id: "kr6b", title: "Resource utilization rate", currentValue: 72, targetValue: 85, unit: "%", progress: 65 },
      { id: "kr6c", title: "Số unused resources cleanup", currentValue: 45, targetValue: 60, unit: "items", progress: 75 },
    ],
    aiCoachingNote: "Tiến triển ổn định. Reserved instances tiết kiệm $4K/tháng. Tiếp tục: auto-scaling cho staging environments, dự kiến giảm thêm $2K.",
    tags: ["cost-optimization", "cloud", "devops"],
  },
  {
    id: "g7", title: "Patent 2 công nghệ AI mới",
    description: "Nộp đơn bảo hộ sáng chế cho 2 công nghệ AI độc quyền: AI Lead Scoring Engine và Smart Pipeline Predictor.",
    level: "company", status: "not-started", category: "innovation",
    owner: "CTO — Phạm Hoàng Duy",
    progress: 0, startDate: "2026-07-01", dueDate: "2026-12-31",
    keyResults: [
      { id: "kr7a", title: "Số patent application nộp", currentValue: 0, targetValue: 2, unit: "patent", progress: 0 },
      { id: "kr7b", title: "Research papers published", currentValue: 0, targetValue: 3, unit: "papers", progress: 0 },
      { id: "kr7c", title: "Internal tech talks completed", currentValue: 0, targetValue: 6, unit: "talks", progress: 0 },
    ],
    aiCoachingNote: "Chưa bắt đầu (Q3). Chuẩn bị: thu thập prior art analysis cho cả 2 công nghệ. Kết nối với patent attorney trước Q3.",
    tags: ["innovation", "patent", "long-term"],
  },
  {
    id: "g8", title: "Hoàn thành 50 cuộc gọi discovery/tháng",
    description: "Tăng cường pipeline bằng cách tăng số lượng discovery calls chất lượng cao.",
    level: "individual", status: "completed", category: "revenue",
    owner: "AI Sales Agent (BDR)",
    progress: 100, startDate: "2026-01-01", dueDate: "2026-02-28",
    keyResults: [
      { id: "kr8a", title: "Discovery calls/tháng", currentValue: 58, targetValue: 50, unit: "calls", progress: 100 },
      { id: "kr8b", title: "Qualified leads từ calls", currentValue: 22, targetValue: 18, unit: "leads", progress: 100 },
      { id: "kr8c", title: "Demo conversion rate", currentValue: 45, targetValue: 35, unit: "%", progress: 100 },
    ],
    aiCoachingNote: "Hoàn thành vượt mức! AI BDR Agent tạo 58 calls/tháng, vượt 16% target. Qualified lead rate 38% — cao hơn human average 25%.",
    tags: ["AI-agent", "completed", "exceeded"],
  },
];
