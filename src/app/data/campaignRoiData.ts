/**
 * Mock data — Campaign ROI Analyzer
 */
import type { CampaignRoi } from "../types/crm";

export const campaignRois: CampaignRoi[] = [
  { id: "cp_01", name: "Cloud Migration 2026 — Email Series", channel: "email", status: "active", startDate: "2026-02-01", endDate: "2026-03-31", budget: 150000000, spent: 98000000, leads: 420, mqls: 185, sqls: 72, opportunities: 28, wonDeals: 8, revenue: 3200000000, cpl: 233333, cac: 12250000, roas: 32.65, conversionRate: 1.9 },
  { id: "cp_02", name: "AI-CRM Demo Webinar Series", channel: "webinar", status: "active", startDate: "2026-01-15", endDate: "2026-04-15", budget: 200000000, spent: 145000000, leads: 680, mqls: 340, sqls: 95, opportunities: 42, wonDeals: 12, revenue: 5800000000, cpl: 213235, cac: 12083333, roas: 40.0, conversionRate: 1.76 },
  { id: "cp_03", name: "Google Ads — Enterprise CRM", channel: "sem", status: "active", startDate: "2026-01-01", endDate: "2026-06-30", budget: 500000000, spent: 320000000, leads: 1250, mqls: 375, sqls: 112, opportunities: 35, wonDeals: 9, revenue: 4500000000, cpl: 256000, cac: 35555556, roas: 14.06, conversionRate: 0.72 },
  { id: "cp_04", name: "LinkedIn Thought Leadership", channel: "social", status: "active", startDate: "2026-02-01", endDate: "2026-05-31", budget: 180000000, spent: 95000000, leads: 380, mqls: 152, sqls: 48, opportunities: 15, wonDeals: 4, revenue: 1800000000, cpl: 250000, cac: 23750000, roas: 18.95, conversionRate: 1.05 },
  { id: "cp_05", name: "SEO Content Hub — CRM Guides", channel: "seo", status: "active", startDate: "2025-10-01", endDate: "2026-09-30", budget: 120000000, spent: 65000000, leads: 890, mqls: 267, sqls: 80, opportunities: 22, wonDeals: 7, revenue: 2100000000, cpl: 73034, cac: 9285714, roas: 32.31, conversionRate: 0.79 },
  { id: "cp_06", name: "Customer Referral Program", channel: "referral", status: "active", startDate: "2025-12-01", endDate: "2026-12-31", budget: 300000000, spent: 120000000, leads: 145, mqls: 116, sqls: 72, opportunities: 38, wonDeals: 15, revenue: 7200000000, cpl: 827586, cac: 8000000, roas: 60.0, conversionRate: 10.34 },
  { id: "cp_07", name: "Partner Co-marketing — AWS", channel: "partner", status: "completed", startDate: "2026-01-10", endDate: "2026-02-28", budget: 100000000, spent: 95000000, leads: 210, mqls: 126, sqls: 42, opportunities: 18, wonDeals: 5, revenue: 2800000000, cpl: 452381, cac: 19000000, roas: 29.47, conversionRate: 2.38 },
  { id: "cp_08", name: "Blog + Ebook Content Series", channel: "content", status: "active", startDate: "2025-11-01", endDate: "2026-06-30", budget: 80000000, spent: 52000000, leads: 560, mqls: 168, sqls: 42, opportunities: 12, wonDeals: 3, revenue: 960000000, cpl: 92857, cac: 17333333, roas: 18.46, conversionRate: 0.54 },
];
