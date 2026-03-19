-- ============================================================
-- S011: Seed Data — Territory, Quota, Competitors, Campaign ROI,
--       Revenue Leaks, Playbooks, Goals/OKRs, Inventory, Events
-- Phụ thuộc: S001-S003 (tenant, employees, contacts, deals)
-- Migration: V008
-- ============================================================

-- Tenant: 018d0001-0001-7001-8001-000000000001
-- emp An:    018d0005-0001-7001-8001-000000000001  (Sales Exec)
-- emp Bình:  018d0005-0001-7001-8001-000000000002  (Marketing Mgr)
-- emp Cường: 018d0005-0001-7001-8001-000000000003  (BDR)
-- emp Dung:  018d0005-0001-7001-8001-000000000004  (PM)
-- emp Đức:   018d0005-0001-7001-8001-000000000005  (Tech Lead)
-- emp Giang: 018d0005-0001-7001-8001-000000000006  (Account Mgr)
-- emp Nova:  018d0005-0001-7001-8001-000000000011  (AI BDR)
-- deals:    018d0007-0001-7001-8001-000000000001..008

-- ============================================================
-- Campaign ROIs (5 bản ghi phân tích ROI)
-- ============================================================
INSERT INTO campaign_rois (id, tenant_id, campaign_name, channel, spend, revenue, leads_generated, deals_closed, roi_percent, period) VALUES
  ('018d0060-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Google Ads — Enterprise CRM', 'paid-search', 145000000.00, 1250000000.00, 168, 12, 762.07, '2026-Q1'),
  ('018d0060-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Email Nurture Q1/2026', 'email', 12500000.00, 380000000.00, 38, 5, 2940.00, '2026-Q1'),
  ('018d0060-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'Webinar Series — AI in Sales', 'event', 76000000.00, 920000000.00, 78, 8, 1110.53, '2025-Q4'),
  ('018d0060-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'Content Marketing SEO Blog', 'organic', 18000000.00, 210000000.00, 45, 3, 1066.67, '2026-Q1'),
  ('018d0060-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   'LinkedIn Ads — Decision Makers', 'social', 35000000.00, 180000000.00, 52, 2, 414.29, '2025-Q4');

-- ============================================================
-- Competitors (4 đối thủ cạnh tranh)
-- ============================================================
INSERT INTO competitors (id, tenant_id, name, website, description, strengths, weaknesses, market_share, threat_level) VALUES
  ('018d0061-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Salesforce', 'https://salesforce.com',
   'CRM lớn nhất thế giới, đang mở rộng thị trường Việt Nam',
   '["Ecosystem rộng lớn","Brand recognition","AI Einstein","AppExchange marketplace"]',
   '["Giá cao cho SME","Triển khai phức tạp","UI nặng","Hỗ trợ tiếng Việt hạn chế"]',
   15.50, 'high'),

  ('018d0061-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'HubSpot CRM', 'https://hubspot.com',
   'CRM freemium phổ biến với inbound marketing approach',
   '["Free tier hấp dẫn","UX tốt","Content marketing integration","Cộng đồng lớn"]',
   '["Giá tăng nhanh khi scale","AI chưa mạnh","Customization hạn chế","Không có local presence VN"]',
   12.30, 'high'),

  ('018d0061-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'Zoho CRM', 'https://zoho.com',
   'Suite ứng dụng kinh doanh giá rẻ từ Ấn Độ',
   '["Giá cạnh tranh","Full suite (40+ apps)","AI Zia assistant"]',
   '["UX trung bình","Support chậm","Ít partner local","Integration ecosystem nhỏ"]',
   8.70, 'medium'),

  ('018d0061-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'Getfly CRM', 'https://getfly.vn',
   'CRM nội địa Việt Nam phổ biến cho SME',
   '["Giá rẻ","Tiếng Việt native","Hỗ trợ local tốt","Dễ triển khai"]',
   '["Không có AI/ML","Khó scale enterprise","API hạn chế","Reporting cơ bản"]',
   5.20, 'medium');

-- Competitor Battle Cards (4 battle cards)
INSERT INTO competitor_battle_cards (id, tenant_id, competitor_id, title, our_advantage, their_advantage, talking_points, objection_handlers) VALUES
  ('018d0062-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d0061-0001-7001-8001-000000000001',
   'vs Salesforce — Enterprise Deals',
   'AI-first architecture, giá tốt hơn 60%, triển khai nhanh 3x, hỗ trợ tiếng Việt native, local team',
   'Brand recognition, ecosystem apps, proven enterprise scale',
   '["Salesforce trung bình tốn 6-12 tháng triển khai, chúng tôi chỉ 4-8 tuần","ROI nhanh hơn vì giá license thấp + thời gian go-live ngắn","AI Sales Coach accuracy 94% — higher than Einstein for VN market data"]',
   '[{"objection":"Salesforce là tiêu chuẩn ngành","response":"Đúng cho US market. Tại VN, data patterns khác biệt — AI model train trên VN data cho accuracy cao hơn 15%"},{"objection":"Ecosystem nhỏ hơn","response":"Chúng tôi tích hợp tất cả top platforms (Slack, Google, SAP) + open API. ROI so sánh quan trọng hơn số lượng apps."}]'),

  ('018d0062-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d0061-0001-7001-8001-000000000002',
   'vs HubSpot — SME to Mid-Market',
   'AI capabilities vượt trội, pricing transparent (không hidden costs), local support, API mạnh hơn',
   'Brand awareness, free tier, content marketing integration',
   '["HubSpot free tier hấp dẫn nhưng Professional bắt đầu từ $800/mo — tương đương chúng tôi nhưng ít AI","AI Lead Scoring của chúng tôi tự động, HubSpot cần manual scoring rules","Local team hỗ trợ VN timezone, HubSpot support từ Singapore/US"]',
   '[{"objection":"HubSpot có free version","response":"Free rất limited — không có automation, reporting basic. So sánh HubSpot Pro vs chúng tôi, giá tương đương nhưng AI mạnh hơn nhiều."}]');

-- Competitor Skills (so sánh kỹ năng cho 2 đối thủ chính)
INSERT INTO competitor_skills (id, tenant_id, competitor_id, skill_name, our_score, their_score) VALUES
  ('018d0063-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d0061-0001-7001-8001-000000000001', 'AI/ML Capabilities', 9, 7),
  ('018d0063-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d0061-0001-7001-8001-000000000001', 'Vietnam Market Fit', 9, 4),
  ('018d0063-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d0061-0001-7001-8001-000000000001', 'Enterprise Scalability', 7, 10),
  ('018d0063-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   '018d0061-0001-7001-8001-000000000001', 'Pricing Value', 9, 3),
  ('018d0063-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   '018d0061-0001-7001-8001-000000000002', 'AI/ML Capabilities', 9, 5),
  ('018d0063-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   '018d0061-0001-7001-8001-000000000002', 'UX/UI Design', 8, 9),
  ('018d0063-0001-7001-8001-000000000007', '018d0001-0001-7001-8001-000000000001',
   '018d0061-0001-7001-8001-000000000002', 'Content Marketing Tools', 6, 10),
  ('018d0063-0001-7001-8001-000000000008', '018d0001-0001-7001-8001-000000000001',
   '018d0061-0001-7001-8001-000000000002', 'API & Integrations', 8, 7);

-- Win/Loss Records (4 bản ghi)
INSERT INTO win_loss_records (id, tenant_id, deal_id, result, competitor_id, reason, factors, deal_value, sales_cycle_days) VALUES
  ('018d0064-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d0007-0001-7001-8001-000000000001', 'win', '018d0061-0001-7001-8001-000000000001',
   'Khách hàng ấn tượng với AI Sales Coach, giá tốt hơn Salesforce 55%, triển khai nhanh',
   '["ai-capabilities","pricing","implementation-speed","local-support"]', 180000000.00, 42),

  ('018d0064-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d0007-0001-7001-8001-000000000003', 'win', '018d0061-0001-7001-8001-000000000002',
   'HubSpot giá cao khi scale lên 30 users, API hạn chế so với nhu cầu integration của khách',
   '["pricing","api-flexibility","local-support"]', 75000000.00, 28),

  ('018d0064-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   NULL, 'loss', '018d0061-0001-7001-8001-000000000001',
   'Khách hàng đa quốc gia yêu cầu global deployment, Salesforce có infrastructure sẵn',
   '["global-presence","ecosystem","brand-trust"]', 450000000.00, 65),

  ('018d0064-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   NULL, 'loss', '018d0061-0001-7001-8001-000000000004',
   'Startup nhỏ cần giải pháp rẻ nhất, Getfly đáp ứng nhu cầu cơ bản với giá 1/3',
   '["pricing","simplicity"]', 15000000.00, 14);

-- ============================================================
-- Revenue Leak Items (4 lỗ rò rỉ doanh thu)
-- ============================================================
INSERT INTO revenue_leak_items (id, tenant_id, category, description, estimated_loss, currency, severity, status, deal_id, assigned_to) VALUES
  ('018d0065-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Discount quá mức', 'Deal FinancePlus được discount 25% — vượt policy max 20%',
   130000000.00, 'VND', 'high', 'investigating',
   '018d0007-0001-7001-8001-000000000002', '018d0005-0001-7001-8001-000000000001'),

  ('018d0065-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Hợp đồng hết hạn chưa gia hạn', '3 hợp đồng hết hạn trong Q1 chưa được follow-up renewal',
   540000000.00, 'VND', 'critical', 'fixing',
   NULL, '018d0005-0001-7001-8001-000000000006'),

  ('018d0065-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'Stalled deals > 30 ngày', '5 deals trong pipeline không có activity > 30 ngày, risk mất deal',
   280000000.00, 'VND', 'medium', 'identified',
   NULL, '018d0005-0001-7001-8001-000000000001'),

  ('018d0065-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'Upsell bỏ lỡ', 'TechCorp dùng 30 licenses nhưng có 80 nhân viên sales — chưa approach expansion',
   180000000.00, 'VND', 'medium', 'fixing',
   '018d0007-0001-7001-8001-000000000001', '018d0005-0001-7001-8001-000000000006');

-- ============================================================
-- Territories (4 lãnh thổ bán hàng)
-- ============================================================
INSERT INTO territories (id, tenant_id, name, region, country, description, manager_id, status) VALUES
  ('018d0066-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Miền Bắc', 'North', 'Vietnam', 'Hà Nội, Hải Phòng, Quảng Ninh và các tỉnh phía Bắc',
   '018d0005-0001-7001-8001-000000000001', 'active'),
  ('018d0066-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Miền Nam', 'South', 'Vietnam', 'TP.HCM, Bình Dương, Đồng Nai và các tỉnh phía Nam',
   '018d0005-0001-7001-8001-000000000006', 'active'),
  ('018d0066-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'Miền Trung', 'Central', 'Vietnam', 'Đà Nẵng, Huế, Quy Nhơn và các tỉnh miền Trung',
   '018d0005-0001-7001-8001-000000000003', 'active'),
  ('018d0066-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'International', 'APAC', 'Regional', 'Khách hàng quốc tế: Singapore, Thailand, Japan',
   '018d0005-0001-7001-8001-000000000001', 'active');

-- Territory Reps (6 phân bổ nhân viên)
INSERT INTO territory_reps (id, tenant_id, territory_id, employee_id, role_in_territory) VALUES
  ('018d0067-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d0066-0001-7001-8001-000000000001', '018d0005-0001-7001-8001-000000000001', 'manager'),
  ('018d0067-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d0066-0001-7001-8001-000000000001', '018d0005-0001-7001-8001-000000000011', 'rep'),
  ('018d0067-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d0066-0001-7001-8001-000000000002', '018d0005-0001-7001-8001-000000000006', 'manager'),
  ('018d0067-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   '018d0066-0001-7001-8001-000000000002', '018d0005-0001-7001-8001-000000000003', 'rep'),
  ('018d0067-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   '018d0066-0001-7001-8001-000000000003', '018d0005-0001-7001-8001-000000000003', 'manager'),
  ('018d0067-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   '018d0066-0001-7001-8001-000000000004', '018d0005-0001-7001-8001-000000000001', 'manager');

-- Territory Quarter Revenues (8 bản ghi doanh thu theo quý)
INSERT INTO territory_quarter_revenues (id, tenant_id, territory_id, quarter, revenue, target, currency) VALUES
  ('018d0068-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d0066-0001-7001-8001-000000000001', '2025-Q4', 1200000000.00, 1000000000.00, 'VND'),
  ('018d0068-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d0066-0001-7001-8001-000000000001', '2026-Q1', 850000000.00, 1200000000.00, 'VND'),
  ('018d0068-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d0066-0001-7001-8001-000000000002', '2025-Q4', 1800000000.00, 1500000000.00, 'VND'),
  ('018d0068-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   '018d0066-0001-7001-8001-000000000002', '2026-Q1', 1350000000.00, 1800000000.00, 'VND'),
  ('018d0068-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   '018d0066-0001-7001-8001-000000000003', '2025-Q4', 450000000.00, 500000000.00, 'VND'),
  ('018d0068-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   '018d0066-0001-7001-8001-000000000003', '2026-Q1', 320000000.00, 600000000.00, 'VND'),
  ('018d0068-0001-7001-8001-000000000007', '018d0001-0001-7001-8001-000000000001',
   '018d0066-0001-7001-8001-000000000004', '2025-Q4', 600000000.00, 500000000.00, 'VND'),
  ('018d0068-0001-7001-8001-000000000008', '018d0001-0001-7001-8001-000000000001',
   '018d0066-0001-7001-8001-000000000004', '2026-Q1', 280000000.00, 700000000.00, 'VND');

-- Quota Reps (6 quota cá nhân)
INSERT INTO quota_reps (id, tenant_id, employee_id, period, quota_amount, achieved_amount, currency, attainment_pct) VALUES
  ('018d0069-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d0005-0001-7001-8001-000000000001', '2026-Q1', 800000000.00, 620000000.00, 'VND', 77.50),
  ('018d0069-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d0005-0001-7001-8001-000000000003', '2026-Q1', 500000000.00, 380000000.00, 'VND', 76.00),
  ('018d0069-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d0005-0001-7001-8001-000000000006', '2026-Q1', 600000000.00, 520000000.00, 'VND', 86.67),
  ('018d0069-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   '018d0005-0001-7001-8001-000000000001', '2025-Q4', 700000000.00, 1134000000.00, 'VND', 162.00),
  ('018d0069-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   '018d0005-0001-7001-8001-000000000003', '2025-Q4', 400000000.00, 356000000.00, 'VND', 89.00),
  ('018d0069-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   '018d0005-0001-7001-8001-000000000006', '2025-Q4', 500000000.00, 485000000.00, 'VND', 97.00);

-- ============================================================
-- Playbooks (3 sổ tay bán hàng)
-- ============================================================
INSERT INTO playbooks (id, tenant_id, name, description, methodology, stages, best_practices, is_active) VALUES
  ('018d006a-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Enterprise Sales Playbook', 'Quy trình bán hàng enterprise B2B từ prospecting đến closing', 'MEDDPICC',
   '[{"stage":"Discovery","duration_days":7,"tasks":["Identify pain points","Map stakeholders","Quantify impact"]},{"stage":"Demo & POC","duration_days":14,"tasks":["Custom demo","POC setup","Technical validation"]},{"stage":"Negotiation","duration_days":10,"tasks":["Pricing proposal","Contract review","Approval workflow"]},{"stage":"Closing","duration_days":5,"tasks":["Final terms","Signature","Handoff to CS"]}]',
   '["Luôn involve champion trong mọi giai đoạn","Demo phải custom theo industry, không dùng generic","Mutual Action Plan bắt buộc cho deal > 200M₫","AI Sales Coach check-in mỗi tuần"]',
   TRUE),

  ('018d006a-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'SME Quick-Close Playbook', 'Quy trình rút gọn cho deal SME, target close < 30 ngày', 'BANT',
   '[{"stage":"Qualify","duration_days":3,"tasks":["Budget confirmed","Authority identified","Need validated","Timeline < 30 days"]},{"stage":"Demo","duration_days":5,"tasks":["Standard demo","Free trial setup"]},{"stage":"Close","duration_days":7,"tasks":["Pricing confirmed","E-signature"]}]',
   '["Dùng standard demo, không custom","Trial 14 ngày tự phục vụ","Follow-up tối đa 3 lần","AI BDR Nova xử lý qualification ban đầu"]',
   TRUE),

  ('018d006a-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'Expansion & Upsell Playbook', 'Quy trình mở rộng khách hàng hiện tại', 'Value Selling',
   '[{"stage":"Identify Opportunity","duration_days":0,"tasks":["Review usage data","AI recommendation check","Health score review"]},{"stage":"Propose","duration_days":7,"tasks":["ROI presentation","New features demo"]},{"stage":"Close","duration_days":14,"tasks":["Amendment contract","Approval if needed"]}]',
   '["Check AI expansion recommendations hàng tuần","Dùng usage data để justify value","Timing tốt nhất: sau QBR hoặc khi NPS > 8","Offer training miễn phí cho new features"]',
   TRUE);

-- Playbook Battle Cards (3 tình huống)
INSERT INTO playbook_battle_cards (id, tenant_id, playbook_id, title, scenario, response, tags) VALUES
  ('018d006b-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d006a-0001-7001-8001-000000000001',
   'Khách hàng đề cập Salesforce', 
   'Prospect nói "Chúng tôi đang cân nhắc Salesforce"',
   'Chia sẻ: "Salesforce là lựa chọn tốt cho US. Tại Việt Nam, AI-CRM của chúng tôi train trên VN data nên accuracy cao hơn 15%. Thời gian triển khai 4-8 tuần vs 6-12 tháng. Giá chỉ bằng 40% cho cùng feature set."',
   '["competitive","salesforce","enterprise"]'),
  ('018d006b-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d006a-0001-7001-8001-000000000001',
   'Yêu cầu giảm giá > 20%',
   'Prospect yêu cầu discount 25-30%',
   'Không giảm thêm, thay vào đó offer: training miễn phí (trị giá 20M₫), dedicated onboarding engineer 30 ngày, hoặc extended trial 30→60 ngày. Nếu deal > 500M₫, escalate VP Sales để negotiation.',
   '["pricing","negotiation","discount"]'),
  ('018d006b-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d006a-0001-7001-8001-000000000002',
   'Prospect muốn dùng thử trước',
   'SME muốn free trial trước khi commit',
   'Offer trial 14 ngày tự đăng ký. Gửi link + quick start guide. Schedule check-in call ngày 7. AI BDR Nova tự động gửi tips email ngày 3, 5, 10.',
   '["trial","sme","quick-close"]');

-- ============================================================
-- Goals / OKRs (3 mục tiêu + 6 key results)
-- ============================================================
INSERT INTO goals (id, tenant_id, title, description, goal_type, owner_id, status, progress, start_date, end_date) VALUES
  ('018d006c-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Đạt 5 tỷ VND doanh thu Q1/2026', 'Mục tiêu doanh thu toàn công ty Q1/2026',
   'company', NULL, 'active', 56, '2026-01-01', '2026-03-31'),
  ('018d006c-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Tăng MQL 50% so với Q4/2025', 'Marketing đạt 150 MQLs trong Q1',
   'team', '018d0005-0001-7001-8001-000000000002', 'active', 63, '2026-01-01', '2026-03-31'),
  ('018d006c-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'An đạt 120% quota cá nhân Q1', 'Mục tiêu cá nhân: 960M₫ trong Q1/2026',
   'individual', '018d0005-0001-7001-8001-000000000001', 'active', 65, '2026-01-01', '2026-03-31');

-- Key Results cho Goal 1 (Company Revenue)
INSERT INTO key_results (id, tenant_id, goal_id, title, metric_type, current_value, target_value, unit, progress) VALUES
  ('018d006d-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d006c-0001-7001-8001-000000000001', 'Tổng doanh thu closed-won', 'currency', 2800000000.00, 5000000000.00, 'VND', 56),
  ('018d006d-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d006c-0001-7001-8001-000000000001', 'Số deal closed', 'number', 18.00, 35.00, 'deals', 51),
  ('018d006d-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d006c-0001-7001-8001-000000000002', 'Số MQL từ marketing', 'number', 95.00, 150.00, 'MQLs', 63),
  ('018d006d-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   '018d006c-0001-7001-8001-000000000002', 'MQL to SQL conversion rate', 'percentage', 38.00, 45.00, '%', 84),
  ('018d006d-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   '018d006c-0001-7001-8001-000000000003', 'Doanh thu An Q1', 'currency', 620000000.00, 960000000.00, 'VND', 65),
  ('018d006d-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   '018d006c-0001-7001-8001-000000000003', 'Win rate cá nhân', 'percentage', 42.00, 50.00, '%', 84);

-- ============================================================
-- Inventory Items (4 items — licenses, hardware, swag)
-- ============================================================
INSERT INTO inventory_items (id, tenant_id, name, sku, category, quantity, min_quantity, location, status, unit_cost, currency) VALUES
  ('018d006e-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'AI-CRM Enterprise License (Annual)', 'LIC-ENT-ANN', 'Software License', 500, 50, 'Digital', 'in-stock', 180000000.00, 'VND'),
  ('018d006e-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'AI-CRM Professional License (Monthly)', 'LIC-PRO-MON', 'Software License', 1000, 100, 'Digital', 'in-stock', 15000000.00, 'VND'),
  ('018d006e-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'Company Branded Backpack', 'MKT-BAG-001', 'Marketing Swag', 45, 20, 'Kho HCM — Tầng 2', 'in-stock', 350000.00, 'VND'),
  ('018d006e-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'Demo Tablet (iPad Air)', 'HW-TAB-001', 'Hardware', 3, 2, 'Phòng Sales — Tủ B3', 'low-stock', 18000000.00, 'VND');

-- ============================================================
-- CRM Events (3 sự kiện)
-- ============================================================
INSERT INTO crm_events (id, tenant_id, name, event_type, status, start_date, end_date, location, max_attendees, registered_count, attended_count, organizer_id, description, budget) VALUES
  ('018d006f-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Webinar: AI Sales Coach Deep Dive', 'webinar', 'completed',
   '2026-02-20 14:00:00+07', '2026-02-20 15:30:00+07', 'Online — Zoom', 200, 178, 134,
   '018d0005-0001-7001-8001-000000000002',
   'Webinar chuyên sâu về tính năng AI Sales Coach: cách hoạt động, use cases, demo live', 15000000.00),

  ('018d006f-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Workshop: CRM Implementation Best Practices', 'workshop', 'open',
   '2026-03-25 09:00:00+07', '2026-03-25 17:00:00+07', 'ABC Software Office — Tầng 12, Q1 TPHCM', 30, 22, 0,
   '018d0005-0001-7001-8001-000000000006',
   'Workshop 1 ngày hướng dẫn triển khai CRM thành công cho nhóm 20-50 người', 25000000.00),

  ('018d006f-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'Vietnam SaaS Summit 2026', 'conference', 'planned',
   '2026-05-15 08:00:00+07', '2026-05-16 17:00:00+07', 'GEM Center — Quận 1, TP.HCM', 500, 0, 0,
   '018d0005-0001-7001-8001-000000000002',
   'ABC Software tham gia triển lãm + sponsor Gold. Booth + 2 speaking slots.', 120000000.00);
