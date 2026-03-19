/**
 * Mock data — Quota Management
 * Phase 6 — Centralized data layer
 */
import type { QuotaRep } from "../types/crm";

export const quotaReps: QuotaRep[] = [
  {
    id: "qr_01", name: "Trần Minh Đức", role: "Senior AE", isAI: false,
    avatar: "TĐ", team: "Enterprise",
    quota: 12_000_000_000, closed: 7_200_000_000, pipeline: 15_000_000_000,
    attainment: 60, status: "on-track", trend: "up",
    dealsWon: 5, dealsOpen: 8, avgDealSize: 1_440_000_000,
    forecastClose: 13_200_000_000, period: "quarterly",
    tags: ["Enterprise", "Top performer"],
  },
  {
    id: "qr_02", name: "Phạm Văn Khôi", role: "AE / CSM", isAI: false,
    avatar: "PK", team: "Enterprise",
    quota: 8_000_000_000, closed: 6_800_000_000, pipeline: 8_500_000_000,
    attainment: 85, status: "exceeded", trend: "up",
    dealsWon: 6, dealsOpen: 4, avgDealSize: 1_133_333_333,
    forecastClose: 9_500_000_000, period: "quarterly",
    tags: ["Enterprise", "Star performer"],
  },
  {
    id: "qr_03", name: "Nguyễn Thị Hương", role: "AE", isAI: false,
    avatar: "NH", team: "Mid-Market",
    quota: 6_000_000_000, closed: 2_400_000_000, pipeline: 5_200_000_000,
    attainment: 40, status: "at-risk", trend: "down",
    dealsWon: 3, dealsOpen: 6, avgDealSize: 800_000_000,
    forecastClose: 4_800_000_000, period: "quarterly",
    tags: ["Mid-Market", "Cần coaching"],
  },
  {
    id: "qr_04", name: "Hoàng Thị Linh", role: "AE", isAI: false,
    avatar: "HL", team: "Enterprise",
    quota: 8_000_000_000, closed: 2_600_000_000, pipeline: 9_800_000_000,
    attainment: 33, status: "behind", trend: "down",
    dealsWon: 2, dealsOpen: 7, avgDealSize: 1_300_000_000,
    forecastClose: 5_200_000_000, period: "quarterly",
    tags: ["Enterprise", "Rủi ro miss quota"],
  },
  {
    id: "qr_05", name: "Lê Hoàng Anh", role: "SDR → AE", isAI: false,
    avatar: "LA", team: "SMB",
    quota: 4_000_000_000, closed: 1_800_000_000, pipeline: 4_200_000_000,
    attainment: 45, status: "on-track", trend: "up",
    dealsWon: 3, dealsOpen: 5, avgDealSize: 600_000_000,
    forecastClose: 4_100_000_000, period: "quarterly",
    tags: ["SMB", "Đang phát triển"],
  },
  {
    id: "qr_06", name: "AI Agent — Luna", role: "AI Sales Agent", isAI: true,
    avatar: "🤖", team: "AI",
    quota: 3_000_000_000, closed: 900_000_000, pipeline: 3_800_000_000,
    attainment: 30, status: "at-risk", trend: "flat",
    dealsWon: 2, dealsOpen: 8, avgDealSize: 450_000_000,
    forecastClose: 2_400_000_000, period: "quarterly",
    tags: ["AI", "Cần fine-tuning"],
  },
  {
    id: "qr_07", name: "AI Agent — Nova", role: "AI CS Agent", isAI: true,
    avatar: "🤖", team: "AI",
    quota: 2_000_000_000, closed: 1_200_000_000, pipeline: 2_100_000_000,
    attainment: 60, status: "on-track", trend: "up",
    dealsWon: 4, dealsOpen: 3, avgDealSize: 300_000_000,
    forecastClose: 2_200_000_000, period: "quarterly",
    tags: ["AI", "Hiệu quả tốt"],
  },
];
