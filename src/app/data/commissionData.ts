/**
 * Mock data — Commission Calculator.
 * Dữ liệu hoa hồng sales reps.
 */
import type { SalesRepCommission, CommissionTier, BonusRule } from "../types/crm";

/* ============================================================
 * Commission Tiers
 * ============================================================ */
export const commissionTiers: CommissionTier[] = [
  { id: "t1", name: "Bronze", minRevenue: 0, maxRevenue: 200000, rate: 5, accelerator: 1.0, description: "Doanh thu dưới $200K — tỷ lệ cơ bản" },
  { id: "t2", name: "Silver", minRevenue: 200000, maxRevenue: 400000, rate: 7, accelerator: 1.2, description: "$200K-$400K — tăng 2% + accelerator 1.2x" },
  { id: "t3", name: "Gold", minRevenue: 400000, maxRevenue: 700000, rate: 9, accelerator: 1.5, description: "$400K-$700K — tăng 2% + accelerator 1.5x" },
  { id: "t4", name: "Platinum", minRevenue: 700000, maxRevenue: null, rate: 12, accelerator: 2.0, description: "Trên $700K — tỷ lệ cao nhất + accelerator 2x" },
];

/* ============================================================
 * Bonus Rules
 * ============================================================ */
export const bonusRules: BonusRule[] = [
  { id: "br1", name: "Vượt Target 120%", condition: "Attainment ≥ 120%", bonus: 5000, type: "flat", icon: "🎯" },
  { id: "br2", name: "Enterprise Deal", condition: "Deal ≥ $100K", bonus: 2, type: "percentage", icon: "🐋" },
  { id: "br3", name: "New Logo", condition: "Khách hàng mới hoàn toàn", bonus: 3000, type: "flat", icon: "⭐" },
  { id: "br4", name: "Cross-sell", condition: "Bán thêm sản phẩm cho client hiện tại", bonus: 1, type: "percentage", icon: "🔗" },
  { id: "br5", name: "Quarterly Streak", condition: "Đạt target 3 tháng liên tiếp", bonus: 10000, type: "flat", icon: "🔥" },
  { id: "br6", name: "Team MVP", condition: "Top 1 doanh thu trong quý", bonus: 8000, type: "flat", icon: "👑" },
];

/* ============================================================
 * Sales Reps Commission Data
 * ============================================================ */
export const salesRepCommissions: SalesRepCommission[] = [
  {
    id: "rc1", name: "Nguyễn Văn An", role: "Sales Director", avatar: "NVA",
    quota: 800000, revenue: 840000, attainment: 105,
    baseTier: "Platinum", baseCommission: 75600, acceleratorCommission: 16800,
    bonuses: [
      { name: "Enterprise Deal", amount: 4200 },
      { name: "Team MVP", amount: 8000 },
    ],
    totalCommission: 104600, splitDeals: 2, payoutStatus: "paid",
    monthlyCommissions: [14200, 11800, 18500, 15300, 22800, 22000],
    tags: ["top-performer", "director"],
  },
  {
    id: "rc2", name: "Lê Minh Cường", role: "Business Development", avatar: "LMC",
    quota: 600000, revenue: 620000, attainment: 103,
    baseTier: "Gold", baseCommission: 49600, acceleratorCommission: 9300,
    bonuses: [
      { name: "New Logo", amount: 6000 },
      { name: "Cross-sell", amount: 3100 },
    ],
    totalCommission: 68000, splitDeals: 1, payoutStatus: "processing",
    monthlyCommissions: [9500, 11200, 10800, 10500, 13200, 12800],
    tags: ["bd", "new-logo"],
  },
  {
    id: "rc3", name: "Hoàng Thị Mai", role: "Account Manager", avatar: "HTM",
    quota: 500000, revenue: 540000, attainment: 108,
    baseTier: "Gold", baseCommission: 41400, acceleratorCommission: 8100,
    bonuses: [
      { name: "Cross-sell", amount: 2700 },
      { name: "Quarterly Streak", amount: 10000 },
    ],
    totalCommission: 62200, splitDeals: 3, payoutStatus: "paid",
    monthlyCommissions: [8800, 9200, 10500, 9800, 11500, 12400],
    tags: ["am", "streak"],
  },
  {
    id: "rc4", name: "Trần Đức Hùng", role: "Senior Sales", avatar: "TĐH",
    quota: 450000, revenue: 420000, attainment: 93,
    baseTier: "Gold", baseCommission: 33600, acceleratorCommission: 0,
    bonuses: [
      { name: "Enterprise Deal", amount: 2100 },
    ],
    totalCommission: 35700, splitDeals: 0, payoutStatus: "pending",
    monthlyCommissions: [5200, 6100, 6500, 5800, 6900, 5200],
    tags: ["senior"],
  },
  {
    id: "rc5", name: "AI Sales Agent — Nova", role: "AI Agent", avatar: "🤖",
    quota: 300000, revenue: 380000, attainment: 127,
    baseTier: "Silver", baseCommission: 22800, acceleratorCommission: 5400,
    bonuses: [
      { name: "Vượt Target 120%", amount: 5000 },
      { name: "New Logo", amount: 9000 },
    ],
    totalCommission: 42200, splitDeals: 8, payoutStatus: "processing",
    monthlyCommissions: [4500, 5800, 6400, 7200, 8500, 9800],
    isAI: true,
    tags: ["ai-agent", "high-growth"],
  },
  {
    id: "rc6", name: "Phạm Thanh Tùng", role: "Sales Rep", avatar: "PTT",
    quota: 400000, revenue: 310000, attainment: 78,
    baseTier: "Silver", baseCommission: 18600, acceleratorCommission: 0,
    bonuses: [],
    totalCommission: 18600, splitDeals: 0, payoutStatus: "pending",
    monthlyCommissions: [5800, 4200, 3500, 2800, 1500, 800],
    tags: ["at-risk"],
  },
  {
    id: "rc7", name: "Đỗ Hải Yến", role: "Sales Rep", avatar: "ĐHY",
    quota: 300000, revenue: 250000, attainment: 83,
    baseTier: "Silver", baseCommission: 15000, acceleratorCommission: 0,
    bonuses: [
      { name: "New Logo", amount: 3000 },
    ],
    totalCommission: 18000, splitDeals: 1, payoutStatus: "paid",
    monthlyCommissions: [2500, 2800, 3000, 3100, 3200, 3400],
    tags: ["new-hire"],
  },
];
