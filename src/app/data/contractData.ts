/**
 * Mock data cho Contract Management
 * Phase 3 — Centralized data layer
 */
import type { Contract } from "../types/crm";

export const contracts: Contract[] = [
  {
    id: "ct1", code: "HĐ-2025-001", clientName: "David Chen", clientCompany: "TechCorp Inc.",
    dealName: "TechCorp AI Platform", type: "outsource", status: "active",
    startDate: "2025-07-01", endDate: "2026-06-30", totalValue: 840000, monthlyValue: 70000,
    currency: "USD", autoRenew: true, paymentTerms: "NET 30, thanh toán theo milestone",
    amendments: [
      { id: "am1", date: "2025-10-15", type: "team-change", description: "Bổ sung 2 senior devs (Phase 2)", approvedBy: "Nguyễn Văn An" },
      { id: "am2", date: "2026-01-10", type: "scope-change", description: "Thêm module AI Analytics", approvedBy: "David Chen" },
    ],
    owner: "Nguyễn Văn An", aiRenewalProbability: 92,
    aiRenewalNote: "Client hài lòng (NPS 9.2). SLA đạt 96%. Xác suất gia hạn rất cao.",
    tags: ["enterprise", "AI", "strategic"],
  },
  {
    id: "ct2", code: "HĐ-2025-002", clientName: "Sarah Miller", clientCompany: "InnovateAI",
    dealName: "InnovateAI ML Project", type: "outsource", status: "expiring-soon",
    startDate: "2025-10-01", endDate: "2026-03-31", totalValue: 420000, monthlyValue: 70000,
    currency: "USD", autoRenew: false, paymentTerms: "NET 15, bi-weekly sprint payment",
    amendments: [
      { id: "am3", date: "2026-01-20", type: "price-change", description: "Discount 15% cho phase mở rộng", approvedBy: "Sales Director" },
    ],
    owner: "Lê Minh Cường", aiRenewalProbability: 65,
    aiRenewalNote: "SLA gặp vấn đề resolution-time. Cần cải thiện trước khi đề xuất gia hạn.",
    tags: ["ML", "high-value"],
  },
  {
    id: "ct3", code: "HĐ-2025-003", clientName: "Tanaka Yuki", clientCompany: "GlobalSoft Japan",
    dealName: "GlobalSoft WMS License", type: "product-license", status: "active",
    startDate: "2025-09-01", endDate: "2026-08-31", totalValue: 90000, monthlyValue: 7500,
    currency: "USD", autoRenew: true, paymentTerms: "Thanh toán quý, trả trước",
    amendments: [],
    owner: "Lê Minh Cường", aiRenewalProbability: 98,
    aiRenewalNote: "SLA xuất sắc 6 tháng. Client đã plan mở rộng thêm 2 kho. Chuẩn bị upsell Enterprise tier.",
    tags: ["Japan", "product", "stable"],
  },
  {
    id: "ct4", code: "HĐ-2026-001", clientName: "Robert Kim", clientCompany: "FinServe Korea",
    dealName: "FinServe API Integration", type: "outsource", status: "active",
    startDate: "2026-01-01", endDate: "2026-12-31", totalValue: 360000, monthlyValue: 30000,
    currency: "USD", autoRenew: false, paymentTerms: "NET 30, monthly invoice",
    amendments: [
      { id: "am4", date: "2026-02-15", type: "scope-change", description: "Giảm scope sprint 7-8 do budget constraints", approvedBy: "Robert Kim" },
    ],
    owner: "Nguyễn Văn An", aiRenewalProbability: 45,
    aiRenewalNote: "SLA nguy cơ. 4 breach gần đây. Cần họp recovery trước khi thảo luận gia hạn.",
    tags: ["Korea", "API", "at-risk"],
  },
  {
    id: "ct5", code: "HĐ-2025-004", clientName: "Trần Quốc Bảo", clientCompany: "MediSys",
    dealName: "MediSys EMR + Support", type: "product-license", status: "expiring-soon",
    startDate: "2025-06-01", endDate: "2026-05-31", totalValue: 180000, monthlyValue: 15000,
    currency: "USD", autoRenew: false, paymentTerms: "NET 30, quarterly",
    amendments: [
      { id: "am5", date: "2025-12-01", type: "extension", description: "Gia hạn support thêm 6 tháng cho Phase 2", approvedBy: "VP Sales" },
    ],
    owner: "Hoàng Thị Mai", aiRenewalProbability: 88,
    aiRenewalNote: "Client dự kiến triển khai Phase 2 Telemedicine. Chuẩn bị quote mới bao gồm upsell.",
    tags: ["healthcare", "product", "upsell"],
  },
  {
    id: "ct6", code: "HĐ-2025-005", clientName: "Emma Wilson", clientCompany: "DigitalWave EU",
    dealName: "DigitalWave DX + Dev", type: "consulting", status: "active",
    startDate: "2025-11-01", endDate: "2026-10-31", totalValue: 480000, monthlyValue: 40000,
    currency: "USD", autoRenew: false, paymentTerms: "NET 45, milestone-based",
    amendments: [
      { id: "am6", date: "2026-01-20", type: "team-change", description: "Thay Tech Lead do performance issue", approvedBy: "Nguyễn Văn An" },
      { id: "am7", date: "2026-02-25", type: "price-change", description: "Credit $5K do SLA breach tháng 2", approvedBy: "VP Sales" },
    ],
    owner: "Hoàng Thị Mai", aiRenewalProbability: 30,
    aiRenewalNote: "Rủi ro cao. SLA vi phạm nghiêm trọng. Cần escalation Level 2 ngay và recovery plan.",
    tags: ["EU", "consulting", "critical"],
  },
  {
    id: "ct7", code: "HĐ-2025-006", clientName: "Lý Quang Minh", clientCompany: "VietFintech",
    dealName: "VietFintech CRM Setup", type: "managed-service", status: "renewed",
    startDate: "2025-03-01", endDate: "2026-02-28", totalValue: 120000, monthlyValue: 10000,
    currency: "USD", autoRenew: true, paymentTerms: "Thanh toán tháng, trả trước",
    amendments: [
      { id: "am8", date: "2026-02-28", type: "extension", description: "Gia hạn 12 tháng, giá giữ nguyên", approvedBy: "Lý Quang Minh" },
    ],
    owner: "Trần Đức Hùng", aiRenewalProbability: 100,
    aiRenewalNote: "Đã gia hạn thành công. Client trung thành 2 năm liên tiếp.",
    tags: ["fintech", "managed", "loyal"],
  },
  {
    id: "ct8", code: "HĐ-2024-010", clientName: "Park Ji-won", clientCompany: "SeoulTech Labs",
    dealName: "SeoulTech AI Training", type: "training", status: "expired",
    startDate: "2024-11-01", endDate: "2025-04-30", totalValue: 24000, monthlyValue: 4000,
    currency: "USD", autoRenew: false, paymentTerms: "Trả trước 50%, hoàn thành trả 50%",
    amendments: [],
    owner: "Lê Minh Cường", aiRenewalProbability: 55,
    aiRenewalNote: "Hợp đồng hết hạn nhưng client hài lòng. Gợi ý: liên hệ lại cho chương trình Corporate.",
    tags: ["Korea", "training", "follow-up"],
  },
];
