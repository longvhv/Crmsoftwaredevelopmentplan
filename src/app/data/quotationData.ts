/**
 * Mock data — Báo giá (Quotation)
 * Dữ liệu mẫu 8 báo giá với nhiều trạng thái.
 */
import type { Quotation } from "../types/crm";

export const quotations: Quotation[] = [
  {
    id: "q1", code: "QT-2026-001", clientName: "David Chen", clientCompany: "TechCorp Inc.",
    dealName: "TechCorp AI Platform", status: "accepted",
    items: [
      { id: "li1", productName: "Phát triển phần mềm", tier: "Senior Team", quantity: 6, unitPrice: 45, unit: "/giờ/người", discount: 10, subtotal: 43740 },
      { id: "li2", productName: "DevOps & Cloud", tier: "Full DevOps", quantity: 1, unitPrice: 25000, unit: "trọn gói", discount: 0, subtotal: 25000 },
    ],
    subtotal: 68740, discountTotal: 4860, taxRate: 10, taxAmount: 6387, grandTotal: 70267,
    currency: "USD", validUntil: "2026-02-28", createdDate: "2026-01-15", createdBy: "Nguyễn Văn An",
    notes: "Commitment 6 tháng, payment theo milestone.",
    aiSuggestion: "Gợi ý thêm gói AI Chatbot Pro ($1,200/tháng) — khách đang dùng chatbot đối thủ.",
    tags: ["enterprise", "AI"],
  },
  {
    id: "q2", code: "QT-2026-002", clientName: "Sarah Miller", clientCompany: "InnovateAI",
    dealName: "InnovateAI ML Project", status: "sent",
    items: [
      { id: "li3", productName: "Phát triển phần mềm", tier: "Enterprise", quantity: 8, unitPrice: 65, unit: "/giờ/người", discount: 15, subtotal: 75140 },
      { id: "li4", productName: "Tư vấn chuyển đổi số", tier: "Assessment", quantity: 1, unitPrice: 10000, unit: "trọn gói", discount: 0, subtotal: 10000 },
    ],
    subtotal: 85140, discountTotal: 13260, taxRate: 10, taxAmount: 7188, grandTotal: 79068,
    currency: "USD", validUntil: "2026-03-20", createdDate: "2026-02-20", createdBy: "Lê Minh Cường",
    notes: "Team 8 người, 6 tháng. Discount 15% vì strategic account.",
    aiSuggestion: "Win rate tăng 25% nếu kèm Bootcamp đào tạo AI/ML ($8,000).",
    tags: ["ML", "strategic"],
  },
  {
    id: "q3", code: "QT-2026-003", clientName: "Tanaka Yuki", clientCompany: "GlobalSoft Japan",
    dealName: "GlobalSoft WMS", status: "viewed",
    items: [
      { id: "li5", productName: "WMS - Quản lý Kho", tier: "Pro", quantity: 3, unitPrice: 2500, unit: "/tháng", discount: 10, subtotal: 6750 },
      { id: "li6", productName: "Đào tạo AI/ML", tier: "Workshop", quantity: 2, unitPrice: 3000, unit: "trọn gói", discount: 0, subtotal: 6000 },
    ],
    subtotal: 12750, discountTotal: 750, taxRate: 10, taxAmount: 1200, grandTotal: 13200,
    currency: "USD", validUntil: "2026-03-15", createdDate: "2026-02-25", createdBy: "Lê Minh Cường",
    notes: "3 kho tại Nhật, cần phiên dịch.",
    aiSuggestion: "Khách dùng 3 kho — gợi ý upgrade Enterprise ($5,000/tháng) khi mở rộng.",
    tags: ["WMS", "Japan"],
  },
  {
    id: "q4", code: "QT-2026-004", clientName: "Robert Kim", clientCompany: "FinServe Korea",
    dealName: "FinServe API Integration", status: "draft",
    items: [
      { id: "li7", productName: "Phát triển phần mềm", tier: "Senior Team", quantity: 4, unitPrice: 45, unit: "/giờ/người", discount: 5, subtotal: 29160 },
      { id: "li8", productName: "AI Chatbot", tier: "Pro", quantity: 1, unitPrice: 1200, unit: "/tháng", discount: 0, subtotal: 1200 },
    ],
    subtotal: 30360, discountTotal: 1540, taxRate: 10, taxAmount: 2882, grandTotal: 31702,
    currency: "USD", validUntil: "2026-04-01", createdDate: "2026-03-01", createdBy: "Nguyễn Văn An",
    notes: "Đang chờ confirm scope cuối cùng.",
    tags: ["API", "fintech"],
  },
  {
    id: "q5", code: "QT-2026-005", clientName: "Emma Wilson", clientCompany: "DigitalWave EU",
    dealName: "DigitalWave DX Bundle", status: "rejected",
    items: [
      { id: "li9", productName: "Tư vấn chuyển đổi số", tier: "Full Consulting", quantity: 1, unitPrice: 25000, unit: "trọn gói", discount: 10, subtotal: 22500 },
      { id: "li10", productName: "Phát triển phần mềm", tier: "Senior Team", quantity: 5, unitPrice: 45, unit: "/giờ/người", discount: 10, subtotal: 34650 },
      { id: "li11", productName: "AI Chatbot", tier: "Enterprise", quantity: 1, unitPrice: 3000, unit: "/tháng", discount: 0, subtotal: 3000 },
    ],
    subtotal: 60150, discountTotal: 8100, taxRate: 10, taxAmount: 5205, grandTotal: 57255,
    currency: "USD", validUntil: "2026-02-15", createdDate: "2026-01-20", createdBy: "Hoàng Thị Mai",
    notes: "Khách từ chối vì budget constraints. Cần re-quote với scope nhỏ hơn.",
    tags: ["DX", "EU"],
  },
  {
    id: "q6", code: "QT-2026-006", clientName: "Trần Quốc Bảo", clientCompany: "MediSys",
    dealName: "MediSys Phase 2", status: "expired",
    items: [
      { id: "li12", productName: "AI CRM Platform", tier: "Enterprise", quantity: 50, unitPrice: 99, unit: "/user/tháng", discount: 20, subtotal: 3960 },
      { id: "li13", productName: "Data Analytics Platform", tier: "Business", quantity: 20, unitPrice: 59, unit: "/user/tháng", discount: 15, subtotal: 1003 },
    ],
    subtotal: 4963, discountTotal: 1327, taxRate: 10, taxAmount: 364, grandTotal: 3999,
    currency: "USD", validUntil: "2026-02-01", createdDate: "2025-12-15", createdBy: "Nguyễn Văn An",
    notes: "Hết hạn — cần tạo quote mới cho Phase 2.",
    tags: ["CRM", "health-tech"],
  },
  {
    id: "q7", code: "QT-2026-007", clientName: "Lý Quang Minh", clientCompany: "EduTech",
    dealName: "EduTech LMS + AI", status: "sent",
    items: [
      { id: "li14", productName: "Phát triển phần mềm", tier: "Senior Team", quantity: 5, unitPrice: 45, unit: "/giờ/người", discount: 8, subtotal: 35424 },
      { id: "li15", productName: "UI/UX Design", tier: "Complete", quantity: 1, unitPrice: 15000, unit: "trọn gói", discount: 0, subtotal: 15000 },
    ],
    subtotal: 50424, discountTotal: 3096, taxRate: 10, taxAmount: 4733, grandTotal: 52061,
    currency: "USD", validUntil: "2026-03-30", createdDate: "2026-03-02", createdBy: "Hoàng Thị Mai",
    notes: "LMS cho 10 trường, deadline Q2.",
    aiSuggestion: "Thêm Data Analytics Team plan ($29/user/tháng) cho reporting cho giáo viên.",
    tags: ["edu-tech", "LMS"],
  },
  {
    id: "q8", code: "QT-2026-008", clientName: "Park Ji-yeon", clientCompany: "SeoulTech",
    dealName: "SeoulTech Mobile App", status: "viewed",
    items: [
      { id: "li16", productName: "Phát triển phần mềm", tier: "Enterprise", quantity: 6, unitPrice: 65, unit: "/giờ/người", discount: 12, subtotal: 58656 },
      { id: "li17", productName: "DevOps & Cloud", tier: "Managed", quantity: 1, unitPrice: 3000, unit: "/tháng", discount: 0, subtotal: 3000 },
    ],
    subtotal: 61656, discountTotal: 8424, taxRate: 10, taxAmount: 5323, grandTotal: 58555,
    currency: "USD", validUntil: "2026-03-25", createdDate: "2026-02-28", createdBy: "Lê Minh Cường",
    notes: "Mobile app cho 500K users, cần performance testing.",
    aiSuggestion: "Gợi ý thêm QA Testing package để đảm bảo performance với 500K users.",
    tags: ["mobile", "Korea"],
  },
];
