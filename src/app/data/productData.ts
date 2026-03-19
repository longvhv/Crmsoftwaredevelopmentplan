/**
 * Mock data — Sản phẩm & Dịch vụ.
 * Dùng mutable array để giả lập CRUD.
 * Khi tích hợp backend, chỉ cần bỏ file này và thay API calls.
 */
import type { Product } from "../types/crm";

export const products: Product[] = [
  { id: "p1", name: "Phát triển phần mềm theo yêu cầu", shortDescription: "Đội ngũ outsource chuyên nghiệp cho mọi dự án.", type: "service", category: "outsource", pricingModel: "hourly", basePrice: 35, currency: "USD",
    tiers: [{ name: "Junior Team", price: 25, unit: "/giờ/người", features: ["1-3 devs", "Supervision", "Basic QA"] }, { name: "Senior Team", price: 45, unit: "/giờ/người", features: ["4-8 devs", "Tech Lead", "CI/CD", "Code Review"], recommended: true }, { name: "Enterprise", price: 65, unit: "/giờ/người", features: ["8+ devs", "Dedicated PM", "24/7 support", "SLA 99.9%"] }],
    dealsUsing: 12, totalRevenue: 840000, avgDealSize: 70000, winRate: 72, tags: ["fullstack", "agile", "offshore"], status: "active", aiCrossSell: ["p5", "p8"], icon: "💻", createdDate: "2024-01-15" },
  { id: "p2", name: "AI CRM Platform", shortDescription: "Nền tảng CRM AI-first cho doanh nghiệp.", type: "product", category: "product", pricingModel: "per-user", basePrice: 49, currency: "USD",
    tiers: [{ name: "Starter", price: 29, unit: "/user/tháng", features: ["5 users", "Basic CRM"] }, { name: "Professional", price: 49, unit: "/user/tháng", features: ["25 users", "AI Insights", "Pipeline"], recommended: true }, { name: "Enterprise", price: 99, unit: "/user/tháng", features: ["Unlimited", "AI Agents", "SSO"] }],
    dealsUsing: 8, totalRevenue: 520000, avgDealSize: 65000, winRate: 68, tags: ["SaaS", "AI", "CRM"], status: "active", aiCrossSell: ["p6", "p10"], icon: "🤖", createdDate: "2024-06-01" },
  { id: "p3", name: "WMS - Quản lý Kho thông minh", shortDescription: "Hệ thống quản lý kho tích hợp IoT.", type: "product", category: "product", pricingModel: "monthly", basePrice: 2500, currency: "USD",
    tiers: [{ name: "Basic", price: 1500, unit: "/tháng", features: ["1 kho", "Barcode"] }, { name: "Pro", price: 2500, unit: "/tháng", features: ["5 kho", "IoT", "AI dự báo"], recommended: true }, { name: "Enterprise", price: 5000, unit: "/tháng", features: ["Unlimited", "Custom integration"] }],
    dealsUsing: 5, totalRevenue: 375000, avgDealSize: 75000, winRate: 60, tags: ["logistics", "IoT"], status: "active", aiCrossSell: ["p5", "p9"], icon: "📦", createdDate: "2024-03-20" },
  { id: "p4", name: "Tư vấn chuyển đổi số", shortDescription: "Chiến lược và lộ trình chuyển đổi số toàn diện.", type: "service", category: "consulting", pricingModel: "fixed", basePrice: 25000, currency: "USD",
    tiers: [{ name: "Assessment", price: 10000, unit: "trọn gói", features: ["Đánh giá", "Roadmap", "2 tuần"] }, { name: "Full Consulting", price: 25000, unit: "trọn gói", features: ["Assessment", "Implementation", "8 tuần"], recommended: true }],
    dealsUsing: 6, totalRevenue: 270000, avgDealSize: 45000, winRate: 55, tags: ["DX", "strategy"], status: "active", aiCrossSell: ["p1", "p2"], icon: "🎯", createdDate: "2024-02-10" },
  { id: "p5", name: "AI Chatbot & Virtual Assistant", shortDescription: "Chatbot AI đa kênh tích hợp NLP tiếng Việt.", type: "product", category: "ai-solution", pricingModel: "monthly", basePrice: 1200, currency: "USD",
    tiers: [{ name: "Basic", price: 500, unit: "/tháng", features: ["1 kênh", "FAQ bot"] }, { name: "Pro", price: 1200, unit: "/tháng", features: ["Đa kênh", "NLP", "Analytics"], recommended: true }, { name: "Enterprise", price: 3000, unit: "/tháng", features: ["Unlimited", "Custom LLM"] }],
    dealsUsing: 9, totalRevenue: 216000, avgDealSize: 24000, winRate: 75, tags: ["AI", "NLP", "chatbot"], status: "active", aiCrossSell: ["p2", "p6"], icon: "💬", createdDate: "2024-04-15" },
  { id: "p6", name: "Data Analytics Platform", shortDescription: "Nền tảng phân tích dữ liệu với dashboard tùy chỉnh.", type: "product", category: "ai-solution", pricingModel: "per-user", basePrice: 39, currency: "USD",
    tiers: [{ name: "Team", price: 29, unit: "/user/tháng", features: ["10 users", "Basic reports"] }, { name: "Business", price: 59, unit: "/user/tháng", features: ["50 users", "AI insights", "API"], recommended: true }],
    dealsUsing: 4, totalRevenue: 156000, avgDealSize: 39000, winRate: 62, tags: ["analytics", "BI"], status: "active", aiCrossSell: ["p2", "p5"], icon: "📊", createdDate: "2024-05-01" },
  { id: "p7", name: "UI/UX Design Service", shortDescription: "Thiết kế giao diện chuyên nghiệp.", type: "service", category: "outsource", pricingModel: "fixed", basePrice: 15000, currency: "USD",
    tiers: [{ name: "Basic", price: 5000, unit: "trọn gói", features: ["Wireframe", "5 screens"] }, { name: "Complete", price: 15000, unit: "trọn gói", features: ["UX Research", "UI/UX", "Prototype"], recommended: true }],
    dealsUsing: 7, totalRevenue: 175000, avgDealSize: 25000, winRate: 80, tags: ["design", "UX"], status: "active", aiCrossSell: ["p1", "p4"], icon: "🎨", createdDate: "2024-01-20" },
  { id: "p8", name: "DevOps & Cloud Migration", shortDescription: "Dịch vụ chuyển đổi cloud và CI/CD.", type: "service", category: "maintenance", pricingModel: "fixed", basePrice: 20000, currency: "USD",
    tiers: [{ name: "Migration", price: 15000, unit: "trọn gói", features: ["Assessment", "Migration"] }, { name: "Full DevOps", price: 25000, unit: "trọn gói", features: ["Migration", "CI/CD", "Monitoring"], recommended: true }],
    dealsUsing: 3, totalRevenue: 120000, avgDealSize: 40000, winRate: 65, tags: ["cloud", "AWS"], status: "active", aiCrossSell: ["p1", "p9"], icon: "☁️", createdDate: "2024-03-01" },
  { id: "p9", name: "Đào tạo công nghệ AI/ML", shortDescription: "Chương trình đào tạo AI, ML và Data Science.", type: "service", category: "training", pricingModel: "fixed", basePrice: 8000, currency: "USD",
    tiers: [{ name: "Workshop", price: 3000, unit: "trọn gói", features: ["1 ngày", "20 người"] }, { name: "Bootcamp", price: 8000, unit: "trọn gói", features: ["1 tuần", "Project-based", "Certificate"], recommended: true }],
    dealsUsing: 4, totalRevenue: 64000, avgDealSize: 16000, winRate: 85, tags: ["training", "AI"], status: "active", aiCrossSell: ["p5", "p6"], icon: "🎓", createdDate: "2024-07-01" },
  { id: "p10", name: "Gói Digital Transformation Bundle", shortDescription: "Combo: Tư vấn + Phát triển + AI + Đào tạo — tiết kiệm 20%.", type: "bundle", category: "consulting", pricingModel: "custom", basePrice: 80000, currency: "USD",
    tiers: [{ name: "SME", price: 50000, unit: "trọn gói", features: ["Tư vấn DX", "1 hệ thống", "Chatbot"] }, { name: "Enterprise", price: 80000, unit: "trọn gói", features: ["Full consulting", "2 hệ thống", "Chatbot Pro", "12 tháng"], recommended: true }],
    dealsUsing: 2, totalRevenue: 180000, avgDealSize: 90000, winRate: 50, tags: ["bundle", "DX"], status: "active", aiCrossSell: ["p4", "p1"], icon: "🚀", createdDate: "2025-01-10" },
];
