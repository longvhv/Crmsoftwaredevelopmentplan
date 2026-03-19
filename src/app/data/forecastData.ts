/**
 * Mock data cho Forecast & Revenue Planning.
 * Phase 5 — Centralized data layer.
 */
import type { RepForecast } from "../types/crm";

export const repForecasts: RepForecast[] = [
  {
    id: "rf1", name: "Nguyễn Văn An", role: "Sales Director", avatar: "NVA",
    quota: 300000, commit: 280000, bestCase: 340000, upside: 90000, pipeline: 150000,
    coverage: 287, aiConfidence: 92,
    aiNote: "Pipeline chất lượng cao. 2 enterprise deals giai đoạn cuối. Dự báo vượt target.",
    trend: "up", tags: ["Enterprise", "Director"],
  },
  {
    id: "rf2", name: "Lê Minh Cường", role: "Business Development", avatar: "LMC",
    quota: 250000, commit: 195000, bestCase: 260000, upside: 120000, pipeline: 200000,
    coverage: 310, aiConfidence: 78,
    aiNote: "Commit hơi thấp so với target. 3 deals best-case cần push trong 2 tuần tới.",
    trend: "stable", tags: ["BD", "New Business"],
  },
  {
    id: "rf3", name: "Hoàng Thị Mai", role: "Account Manager", avatar: "HTM",
    quota: 220000, commit: 210000, bestCase: 280000, upside: 60000, pipeline: 85000,
    coverage: 289, aiConfidence: 88,
    aiNote: "Upsell từ existing clients rất mạnh. MediSys Phase 2 sắp close.",
    trend: "up", tags: ["Upsell", "Account"],
  },
  {
    id: "rf4", name: "Trần Đức Hùng", role: "Senior Sales", avatar: "TĐH",
    quota: 200000, commit: 140000, bestCase: 180000, upside: 80000, pipeline: 160000,
    coverage: 280, aiConfidence: 55,
    aiNote: "Gap $60K giữa commit và target. Cần convert 2 best-case deals để đạt quota.",
    trend: "down", tags: ["Senior", "Gap"],
  },
  {
    id: "rf5", name: "AI Sales Agent — Nova", role: "AI Agent", avatar: "🤖",
    quota: 150000, commit: 120000, bestCase: 175000, upside: 200000, pipeline: 350000,
    coverage: 563, aiConfidence: 75,
    aiNote: "Volume pipeline lớn nhưng deal size nhỏ. Conversion rate cải thiện 8% tháng này.",
    trend: "up", isAI: true, tags: ["AI", "Volume"],
  },
  {
    id: "rf6", name: "Phạm Thanh Tùng", role: "Sales Rep", avatar: "PTT",
    quota: 180000, commit: 95000, bestCase: 130000, upside: 50000, pipeline: 120000,
    coverage: 219, aiConfidence: 35,
    aiNote: "Rủi ro cao. Commit chỉ 53% target. Pipeline quality thấp — cần mentor support.",
    trend: "down", tags: ["At Risk", "Junior"],
  },
  {
    id: "rf7", name: "Đỗ Hải Yến", role: "Sales Rep", avatar: "ĐHY",
    quota: 160000, commit: 125000, bestCase: 170000, upside: 45000, pipeline: 90000,
    coverage: 269, aiConfidence: 72,
    aiNote: "Tiến bộ đều. 1 deal $40K đang negotiation — nếu close sẽ đạt target.",
    trend: "up", tags: ["Improving", "Mid"],
  },
  {
    id: "rf8", name: "Vũ Quang Minh", role: "Enterprise Sales", avatar: "VQM",
    quota: 400000, commit: 350000, bestCase: 420000, upside: 100000, pipeline: 180000,
    coverage: 263, aiConfidence: 85,
    aiNote: "Pipeline enterprise chất lượng. 1 deal $150K commit sẽ close tuần tới.",
    trend: "up", tags: ["Enterprise", "Senior"],
  },
];

/** Dữ liệu dự báo 12 tháng */
export const monthlyForecastData = [
  { month: "T1/26", conservative: 180, base: 220, optimistic: 280, actual: 245, target: 250 },
  { month: "T2/26", conservative: 195, base: 240, optimistic: 310, actual: 260, target: 250 },
  { month: "T3/26", conservative: 210, base: 260, optimistic: 340, actual: null, target: 250 },
  { month: "T4/26", conservative: 200, base: 250, optimistic: 330, actual: null, target: 270 },
  { month: "T5/26", conservative: 220, base: 275, optimistic: 360, actual: null, target: 270 },
  { month: "T6/26", conservative: 230, base: 290, optimistic: 380, actual: null, target: 270 },
  { month: "T7/26", conservative: 215, base: 265, optimistic: 345, actual: null, target: 290 },
  { month: "T8/26", conservative: 240, base: 300, optimistic: 400, actual: null, target: 290 },
  { month: "T9/26", conservative: 250, base: 315, optimistic: 420, actual: null, target: 290 },
  { month: "T10/26", conservative: 260, base: 330, optimistic: 440, actual: null, target: 310 },
  { month: "T11/26", conservative: 270, base: 340, optimistic: 460, actual: null, target: 310 },
  { month: "T12/26", conservative: 290, base: 370, optimistic: 500, actual: null, target: 310 },
];
