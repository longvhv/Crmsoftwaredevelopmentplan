-- ============================================================
-- S010: Seed Data — Documents, Knowledge Base, Customer Segments,
--       Customer Journeys, Account Plans, Deal Rooms
-- Phụ thuộc: S001-S003 (tenant, employees, contacts, deals)
-- Migration: V011
-- ============================================================

-- Tenant: 018d0001-0001-7001-8001-000000000001
-- emp An:    018d0005-0001-7001-8001-000000000001  (Sales)
-- emp Bình:  018d0005-0001-7001-8001-000000000002  (Marketing)
-- emp Dung:  018d0005-0001-7001-8001-000000000004  (PM)
-- emp Đức:   018d0005-0001-7001-8001-000000000005  (Tech Lead)
-- emp Giang: 018d0005-0001-7001-8001-000000000006  (Account Mgr)
-- emp Huy:   018d0005-0001-7001-8001-000000000007  (AI Engineer)
-- emp Muse:  018d0005-0001-7001-8001-000000000012  (AI Content)
-- contacts: 018d0006-0001-7001-8001-000000000001..010
-- deals:    018d0007-0001-7001-8001-000000000001..008

-- ============================================================
-- Documents (6 tài liệu)
-- ============================================================
INSERT INTO documents (id, tenant_id, name, document_type, status, file_url, file_size, mime_type, folder, contact_id, deal_id, uploaded_by, shared_with, download_count) VALUES
  ('018d0050-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Hợp đồng Enterprise — TechCorp', 'contract', 'active',
   'https://storage.abc-software.vn/docs/contract-techcorp-2025.pdf', 2456000,
   'application/pdf', '/Contracts/2025',
   '018d0006-0001-7001-8001-000000000001', '018d0007-0001-7001-8001-000000000001',
   '018d0005-0001-7001-8001-000000000006',
   '["018d0005-0001-7001-8001-000000000001"]', 8),

  ('018d0050-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Proposal — FinancePlus Full Suite', 'proposal', 'active',
   'https://storage.abc-software.vn/docs/proposal-financeplus-2026.pdf', 3840000,
   'application/pdf', '/Proposals/2026',
   '018d0006-0001-7001-8001-000000000002', '018d0007-0001-7001-8001-000000000002',
   '018d0005-0001-7001-8001-000000000001',
   '["018d0005-0001-7001-8001-000000000006"]', 12),

  ('018d0050-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'Báo cáo ROI Q4/2025', 'report', 'active',
   'https://storage.abc-software.vn/docs/roi-report-q4-2025.xlsx', 1250000,
   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '/Reports/Quarterly',
   NULL, NULL,
   '018d0005-0001-7001-8001-000000000002',
   '[]', 25),

  ('018d0050-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'Template — NDA Song Ngữ Anh-Việt', 'template', 'active',
   'https://storage.abc-software.vn/docs/nda-template-en-vi.docx', 85000,
   'application/vnd.openxmlformats-officedocument.wordprocessingml.document', '/Templates/Legal',
   NULL, NULL,
   '018d0005-0001-7001-8001-000000000006',
   '["018d0005-0001-7001-8001-000000000001","018d0005-0001-7001-8001-000000000003"]', 42),

  ('018d0050-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   'Slide Deck — AI-CRM Product Overview', 'presentation', 'active',
   'https://storage.abc-software.vn/docs/product-overview-2026.pptx', 18500000,
   'application/vnd.openxmlformats-officedocument.presentationml.presentation', '/Sales/Pitch Decks',
   NULL, NULL,
   '018d0005-0001-7001-8001-000000000012',
   '["018d0005-0001-7001-8001-000000000001","018d0005-0001-7001-8001-000000000003","018d0005-0001-7001-8001-000000000006"]', 67),

  ('018d0050-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   'Invoice INV-2026-0042 — RetailMax', 'invoice', 'archived',
   'https://storage.abc-software.vn/docs/invoice-retailmax-0042.pdf', 340000,
   'application/pdf', '/Invoices/2026',
   '018d0006-0001-7001-8001-000000000003', NULL,
   '018d0005-0001-7001-8001-000000000006',
   '[]', 3);

-- ============================================================
-- Knowledge Categories (4 danh mục)
-- ============================================================
INSERT INTO knowledge_categories (id, tenant_id, name, slug, description, parent_id, icon, sort_order, article_count) VALUES
  ('018d0051-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Bắt đầu sử dụng', 'bat-dau-su-dung', 'Hướng dẫn cài đặt và cấu hình ban đầu',
   NULL, 'Rocket', 1, 5),
  ('018d0051-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Quản lý Pipeline', 'quan-ly-pipeline', 'Hướng dẫn sử dụng deal pipeline, stages, automation',
   NULL, 'GitBranch', 2, 8),
  ('018d0051-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'Tính năng AI', 'tinh-nang-ai', 'Tài liệu về AI Sales Coach, Lead Scoring, Forecast AI',
   NULL, 'Brain', 3, 6),
  ('018d0051-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'API & Tích hợp', 'api-tich-hop', 'API Reference, Webhooks, Third-party integrations',
   NULL, 'Plug', 4, 12);

-- Knowledge Articles (5 bài viết)
INSERT INTO knowledge_articles (id, tenant_id, title, slug, category_id, content_html, content_text, status, visibility, author_id, views, helpful_count, not_helpful_count) VALUES
  ('018d0052-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Hướng dẫn thiết lập Deal Pipeline', 'huong-dan-thiet-lap-deal-pipeline',
   '018d0051-0001-7001-8001-000000000002',
   '<h2>Thiết lập Deal Pipeline</h2><p>Bước 1: Vào Settings > Pipeline...</p>',
   'Thiết lập Deal Pipeline. Bước 1: Vào Settings > Pipeline...',
   'published', 'public',
   '018d0005-0001-7001-8001-000000000006', 1240, 98, 5),

  ('018d0052-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Cấu hình AI Lead Scoring', 'cau-hinh-ai-lead-scoring',
   '018d0051-0001-7001-8001-000000000003',
   '<h2>AI Lead Scoring</h2><p>AI-CRM sử dụng mô hình Gradient Boosting để chấm điểm lead...</p>',
   'AI Lead Scoring. AI-CRM sử dụng mô hình Gradient Boosting để chấm điểm lead...',
   'published', 'public',
   '018d0005-0001-7001-8001-000000000007', 890, 76, 3),

  ('018d0052-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'REST API Authentication Guide', 'rest-api-authentication-guide',
   '018d0051-0001-7001-8001-000000000004',
   '<h2>API Authentication</h2><p>Sử dụng Bearer Token trong header Authorization...</p>',
   'API Authentication. Sử dụng Bearer Token trong header Authorization...',
   'published', 'customer',
   '018d0005-0001-7001-8001-000000000005', 2100, 156, 12),

  ('018d0052-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'Quick Start: 15 phút đầu tiên với AI-CRM', 'quick-start-15-phut-dau-tien',
   '018d0051-0001-7001-8001-000000000001',
   '<h2>Quick Start</h2><p>Chào mừng bạn đến với AI-CRM! Trong 15 phút...</p>',
   'Quick Start. Chào mừng bạn đến với AI-CRM! Trong 15 phút...',
   'published', 'public',
   '018d0005-0001-7001-8001-000000000012', 3400, 245, 8),

  ('018d0052-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   'Webhook Events Reference (Draft)', 'webhook-events-reference',
   '018d0051-0001-7001-8001-000000000004',
   '<h2>Webhook Events</h2><p>Danh sách tất cả events có thể subscribe...</p>',
   'Webhook Events. Danh sách tất cả events có thể subscribe...',
   'draft', 'internal',
   '018d0005-0001-7001-8001-000000000005', 45, 3, 0);

-- ============================================================
-- Customer Segments (4 phân khúc)
-- ============================================================
INSERT INTO customer_segments (id, tenant_id, name, description, segment_type, rules, contact_count, avg_deal_value, total_revenue, color, is_active, last_computed_at) VALUES
  ('018d0053-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Enterprise High-Value', 'Khách hàng enterprise có lifetime value > 200M₫',
   'dynamic',
   '[{"field":"lifetime_value","operator":"gte","value":200000000},{"field":"contact_type","operator":"equals","value":"customer"}]',
   28, 450000000.00, 12600000000.00, '#7C3AED', TRUE, '2026-03-05 06:00:00+07'),

  ('018d0053-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'SME Growth Potential', 'Doanh nghiệp vừa và nhỏ có tốc độ tăng trưởng cao',
   'dynamic',
   '[{"field":"company_size","operator":"between","value":[20,200]},{"field":"lead_score","operator":"gte","value":60}]',
   65, 120000000.00, 7800000000.00, '#2563EB', TRUE, '2026-03-05 06:00:00+07'),

  ('018d0053-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'At-Risk Churn', 'Khách hàng có chỉ số churn risk cao (AI prediction)',
   'dynamic',
   '[{"field":"churn_risk_score","operator":"gte","value":70},{"field":"status","operator":"equals","value":"active"}]',
   12, 180000000.00, 2160000000.00, '#DC2626', TRUE, '2026-03-04 06:00:00+07'),

  ('018d0053-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'Webinar Attendees Q1/2026', 'Người tham gia chuỗi webinar AI Sales Q1/2026',
   'static',
   '[{"field":"tag","operator":"contains","value":"webinar-q1-2026"}]',
   267, 0.00, 0.00, '#059669', TRUE, '2026-02-01 10:00:00+07');

-- ============================================================
-- Customer Journeys (2 hành trình)
-- ============================================================
INSERT INTO customer_journeys (id, tenant_id, name, description, status, stages, total_contacts, avg_completion_days, conversion_rate) VALUES
  ('018d0054-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Acquisition → Onboarding → Expansion',
   'Hành trình từ lead capture đến upsell/cross-sell', 'active',
   '[{"id":"awareness","name":"Nhận biết","order":1},{"id":"consideration","name":"Cân nhắc","order":2},{"id":"decision","name":"Quyết định","order":3},{"id":"onboarding","name":"Onboarding","order":4},{"id":"adoption","name":"Sử dụng","order":5},{"id":"expansion","name":"Mở rộng","order":6}]',
   185, 45.5, 18.40),

  ('018d0054-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Churn Prevention Flow',
   'Hành trình phát hiện và ngăn chặn churn', 'active',
   '[{"id":"risk-detected","name":"Phát hiện rủi ro","order":1},{"id":"outreach","name":"Liên hệ","order":2},{"id":"intervention","name":"Can thiệp","order":3},{"id":"resolution","name":"Giải quyết","order":4},{"id":"re-engagement","name":"Tái gắn kết","order":5}]',
   34, 21.0, 62.50);

-- Journey Touchpoints (6 điểm chạm)
INSERT INTO journey_touchpoints (id, tenant_id, journey_id, contact_id, stage_id, touchpoint_type, channel, description, sentiment, occurred_at) VALUES
  ('018d0055-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d0054-0001-7001-8001-000000000001',
   '018d0006-0001-7001-8001-000000000001', 'awareness', 'website', 'organic-search',
   'Truy cập blog "10 lý do chuyển sang CRM AI-first"', 'neutral', '2025-04-10 14:30:00+07'),
  ('018d0055-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d0054-0001-7001-8001-000000000001',
   '018d0006-0001-7001-8001-000000000001', 'consideration', 'form', 'website',
   'Đăng ký demo qua landing page', 'positive', '2025-04-15 10:00:00+07'),
  ('018d0055-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d0054-0001-7001-8001-000000000001',
   '018d0006-0001-7001-8001-000000000001', 'decision', 'meeting', 'zoom',
   'Demo call 45 phút với Sales team', 'positive', '2025-04-22 15:00:00+07'),
  ('018d0055-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   '018d0054-0001-7001-8001-000000000001',
   '018d0006-0001-7001-8001-000000000001', 'onboarding', 'call', 'phone',
   'Welcome call + Technical setup kickoff', 'positive', '2025-06-01 09:00:00+07'),
  ('018d0055-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   '018d0054-0001-7001-8001-000000000002',
   '018d0006-0001-7001-8001-000000000005', 'risk-detected', 'support', 'in-app',
   'Churn risk AI alert: login giảm 60% trong 30 ngày', 'negative', '2026-02-01 08:00:00+07'),
  ('018d0055-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   '018d0054-0001-7001-8001-000000000002',
   '018d0006-0001-7001-8001-000000000005', 'outreach', 'call', 'phone',
   'Account Manager gọi điện tìm hiểu vấn đề', 'neutral', '2026-02-03 14:00:00+07');

-- ============================================================
-- Account Plans (3 kế hoạch khách hàng)
-- ============================================================
INSERT INTO account_plans (id, tenant_id, contact_id, account_name, owner_id, status, objectives, stakeholders, opportunities, risks, current_arr, target_arr, health_score, next_review_date, ai_recommendations) VALUES
  ('018d0056-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d0006-0001-7001-8001-000000000001', 'TechCorp Vietnam',
   '018d0005-0001-7001-8001-000000000006', 'active',
   '[{"title":"Mở rộng lên 50 users","deadline":"2026-06-30","progress":40},{"title":"Upsell AI Sales Coach","deadline":"2026-Q2","progress":20}]',
   '[{"name":"Nguyễn Thanh Tùng","role":"CTO","influence":"high","sentiment":"champion"},{"name":"Lê Văn Hải","role":"VP Sales","influence":"high","sentiment":"neutral"}]',
   '[{"title":"Expansion 50→100 licenses","value":180000000,"probability":60},{"title":"AI Coach add-on","value":60000000,"probability":75}]',
   '[{"title":"Budget freeze Q3 possible","severity":"medium"},{"title":"Competitor Salesforce đang pitch","severity":"high"}]',
   180000000.00, 420000000.00, 82, '2026-04-15',
   '["Lên lịch meeting với VP Sales để demo AI Coach","Gửi case study của FinancePlus (cùng ngành)","Tạo mutual success plan trước renewal"]'),

  ('018d0056-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d0006-0001-7001-8001-000000000002', 'FinancePlus',
   '018d0005-0001-7001-8001-000000000006', 'active',
   '[{"title":"Full Suite migration Q2","deadline":"2026-06-30","progress":65},{"title":"API integration hoàn thành","deadline":"2026-04-30","progress":80}]',
   '[{"name":"Trần Minh Hằng","role":"VP Engineering","influence":"high","sentiment":"champion"}]',
   '[{"title":"Full Suite upgrade","value":520000000,"probability":85}]',
   '[{"title":"Integration timeline tight","severity":"medium"}]',
   180000000.00, 520000000.00, 90, '2026-03-30',
   '["Accelerate API integration support","Offer dedicated onboarding engineer"]'),

  ('018d0056-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d0006-0001-7001-8001-000000000005', 'MediCare Plus',
   '018d0005-0001-7001-8001-000000000006', 'review',
   '[{"title":"Prevent churn — address pain points","deadline":"2026-03-31","progress":30}]',
   '[{"name":"Hoàng Thị Yến","role":"COO","influence":"high","sentiment":"detractor"}]',
   '[]',
   '[{"title":"Đang đánh giá Salesforce","severity":"critical"},{"title":"Support response time chậm","severity":"high"}]',
   180000000.00, 180000000.00, 35, '2026-03-15',
   '["Escalate support SLA cho account này","Tổ chức exec-to-exec meeting","Offer 2 tháng miễn phí để rebuild trust"]');

-- ============================================================
-- Deal Rooms (2 phòng deal)
-- ============================================================
INSERT INTO deal_rooms (id, tenant_id, deal_id, name, status, access_code, participants, milestones, mutual_action_plan, last_activity_at) VALUES
  ('018d0057-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d0007-0001-7001-8001-000000000002', 'FinancePlus — Full Suite Deal Room', 'active',
   'FP-2026-DR-001',
   '[{"name":"Trần Minh Hằng","role":"VP Engineering","company":"FinancePlus"},{"name":"Nguyễn Văn An","role":"Sales Executive","company":"ABC Software"},{"name":"Hoàng Thị Giang","role":"Account Manager","company":"ABC Software"}]',
   '[{"title":"NDA Signed","completed":true,"date":"2026-01-15"},{"title":"Technical Assessment","completed":true,"date":"2026-02-10"},{"title":"Pricing Agreed","completed":false,"target_date":"2026-03-15"},{"title":"Contract Signed","completed":false,"target_date":"2026-03-31"}]',
   '[{"task":"Gửi proposal chi tiết","owner":"An","due":"2026-03-08","status":"done"},{"task":"Technical POC review","owner":"Hằng","due":"2026-03-12","status":"in-progress"},{"task":"Legal review NDA","owner":"Legal team","due":"2026-03-20","status":"pending"}]',
   '2026-03-04 16:30:00+07'),

  ('018d0057-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d0007-0001-7001-8001-000000000004', 'EduTech — Starter Package', 'active',
   'ET-2026-DR-002',
   '[{"name":"Phạm Thị Mai","role":"Head of Operations","company":"EduTech Solutions"},{"name":"Lê Hoàng Cường","role":"BDR","company":"ABC Software"}]',
   '[{"title":"Intro Call","completed":true,"date":"2026-02-20"},{"title":"Demo","completed":true,"date":"2026-02-28"},{"title":"Trial Setup","completed":false,"target_date":"2026-03-10"}]',
   '[{"task":"Setup trial environment","owner":"Đức","due":"2026-03-10","status":"in-progress"},{"task":"Gửi training schedule","owner":"Cường","due":"2026-03-12","status":"pending"}]',
   '2026-03-03 11:00:00+07');

-- Deal Room Documents (3 tài liệu trong deal room)
INSERT INTO deal_room_documents (id, tenant_id, deal_room_id, document_id, name, file_url, uploaded_by, viewed_by_client, viewed_at) VALUES
  ('018d0058-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d0057-0001-7001-8001-000000000001',
   '018d0050-0001-7001-8001-000000000002',
   'Proposal — FinancePlus Full Suite',
   'https://storage.abc-software.vn/docs/proposal-financeplus-2026.pdf',
   '018d0005-0001-7001-8001-000000000001', TRUE, '2026-03-02 09:15:00+07'),

  ('018d0058-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d0057-0001-7001-8001-000000000001', NULL,
   'Technical Architecture Overview',
   'https://storage.abc-software.vn/deal-rooms/FP-2026/technical-arch.pdf',
   '018d0005-0001-7001-8001-000000000005', TRUE, '2026-02-12 14:00:00+07'),

  ('018d0058-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d0057-0001-7001-8001-000000000001', NULL,
   'ROI Calculator — FinancePlus customized',
   'https://storage.abc-software.vn/deal-rooms/FP-2026/roi-calculator.xlsx',
   '018d0005-0001-7001-8001-000000000006', FALSE, NULL);

-- ============================================================
-- Social Mentions (5 đề cập trên mạng xã hội)
-- ============================================================
INSERT INTO social_mentions (id, tenant_id, platform, mention_type, content, author_name, author_handle, url, sentiment, engagement, contact_id, is_responded, responded_by, mentioned_at) VALUES
  ('018d0059-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'linkedin', 'post', 'Vừa triển khai AI-CRM của ABC Software cho team sales 30 người. Sau 3 tháng, deal velocity tăng 40%! Highly recommend cho B2B SaaS companies.',
   'Nguyễn Thanh Tùng', 'thanhtung-nguyen', 'https://linkedin.com/posts/thanhtung-nguyen/abc-crm-review',
   'positive', '{"likes":128,"comments":23,"shares":15}',
   '018d0006-0001-7001-8001-000000000001', TRUE, '018d0005-0001-7001-8001-000000000002', '2026-02-20 09:00:00+07'),

  ('018d0059-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'facebook', 'review', 'CRM khá tốt nhưng mobile app còn chậm, mong team cải thiện thêm. 4/5 sao.',
   'Lê Phương Thảo', 'phuongthao.le', 'https://facebook.com/abcsoftware/reviews/12345',
   'neutral', '{"likes":12,"comments":5}',
   '018d0006-0001-7001-8001-000000000003', TRUE, '018d0005-0001-7001-8001-000000000002', '2026-02-25 16:00:00+07'),

  ('018d0059-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'twitter', 'mention', 'Anyone tried @ABCSoftware AI-CRM? Looking for alternatives to Salesforce for Vietnam market.',
   'David Tran', '@davidtran_tech', 'https://twitter.com/davidtran_tech/status/123456789',
   'neutral', '{"likes":8,"retweets":3,"replies":12}',
   NULL, FALSE, NULL, '2026-03-02 11:30:00+07'),

  ('018d0059-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'linkedin', 'comment', 'AI Sales Coach từ ABC Software giúp team tôi cải thiện win rate đáng kể. AI suggestions rất chính xác!',
   'Trần Minh Hằng', 'minhhang-tran', NULL,
   'positive', '{"likes":45,"comments":8}',
   '018d0006-0001-7001-8001-000000000002', FALSE, NULL, '2026-03-01 13:00:00+07'),

  ('018d0059-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   'reddit', 'comment', 'Đã dùng ABC CRM 6 tháng rồi bị lỗi API liên tục, support trả lời chậm. Đang cân nhắc chuyển sang HubSpot.',
   'anonymous_user_vn', 'u/crm_reviewer_vn', 'https://reddit.com/r/vietnam_tech/comments/abc123',
   'negative', '{"upvotes":34,"comments":18}',
   NULL, FALSE, NULL, '2026-03-03 20:00:00+07');

-- ============================================================
-- Live Chat Config (1 cấu hình)
-- ============================================================
INSERT INTO live_chat_configs (id, tenant_id, is_enabled, widget_color, welcome_message, offline_message, auto_reply_enabled, business_hours, assigned_agents, routing_strategy) VALUES
  ('018d005a-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   TRUE, '#3B82F6',
   'Xin chào! Đội ngũ AI-CRM sẵn sàng hỗ trợ bạn. Bạn cần giúp gì?',
   'Hiện đang ngoài giờ làm việc. Vui lòng để lại tin nhắn, chúng tôi sẽ phản hồi trong 24h.',
   TRUE,
   '{"monday":{"start":"08:00","end":"18:00"},"tuesday":{"start":"08:00","end":"18:00"},"wednesday":{"start":"08:00","end":"18:00"},"thursday":{"start":"08:00","end":"18:00"},"friday":{"start":"08:00","end":"17:00"},"saturday":{"start":"09:00","end":"12:00"}}',
   '["018d0005-0001-7001-8001-000000000006","018d0005-0001-7001-8001-000000000013"]',
   'skill-based');

-- ============================================================
-- VoIP Call Logs (4 cuộc gọi)
-- ============================================================
INSERT INTO voip_call_logs (id, tenant_id, direction, caller_number, callee_number, contact_id, agent_id, status, duration_seconds, sentiment, notes, started_at, ended_at) VALUES
  ('018d005b-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'outbound', '02871234567', '0912345678',
   '018d0006-0001-7001-8001-000000000001', '018d0005-0001-7001-8001-000000000001',
   'answered', 1245, 'positive',
   'Gọi follow-up deal expansion. Khách hàng rất hài lòng, muốn thêm 20 licenses.',
   '2026-03-04 10:00:00+07', '2026-03-04 10:20:45+07'),

  ('018d005b-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'inbound', '0923456789', '02871234567',
   '018d0006-0001-7001-8001-000000000002', '018d0005-0001-7001-8001-000000000006',
   'answered', 890, 'neutral',
   'Hỏi về timeline API integration. Đã confirm deadline 30/04.',
   '2026-03-04 14:30:00+07', '2026-03-04 14:44:50+07'),

  ('018d005b-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'outbound', '02871234567', '0945678901',
   '018d0006-0001-7001-8001-000000000005', '018d0005-0001-7001-8001-000000000006',
   'missed', 0, NULL,
   'Gọi để follow-up churn risk alert. Không nghe máy.',
   '2026-03-04 16:00:00+07', NULL),

  ('018d005b-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'outbound', '02871234567', '0967890123',
   NULL, '018d0005-0001-7001-8001-000000000003',
   'answered', 420, 'positive',
   'Cold call thành công. Lead mới từ công ty logistics, quan tâm gói Starter.',
   '2026-03-05 09:30:00+07', '2026-03-05 09:37:00+07');

-- ============================================================
-- Meeting Recordings (2 bản ghi cuộc họp)
-- ============================================================
INSERT INTO meeting_recordings (id, tenant_id, deal_id, contact_id, title, duration_minutes, summary, action_items, key_topics, sentiment_score, talk_ratio, participants, host_id, meeting_date) VALUES
  ('018d005c-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d0007-0001-7001-8001-000000000002', '018d0006-0001-7001-8001-000000000002',
   'FinancePlus — Technical POC Review', 45,
   'Review kết quả POC 2 tuần. FinancePlus rất ấn tượng với AI Lead Scoring accuracy. Một số concern về API rate limiting cần address.',
   '[{"task":"Tăng API rate limit cho FinancePlus trial","owner":"Đức","due":"2026-03-10"},{"task":"Gửi pricing proposal updated","owner":"An","due":"2026-03-08"}]',
   '["AI Lead Scoring accuracy","API rate limiting","Pricing negotiation","Timeline Q2 go-live"]',
   78, '{"seller":42,"buyer":58}',
   '[{"name":"Trần Minh Hằng","role":"VP Engineering"},{"name":"Nguyễn Văn An","role":"Sales"},{"name":"Vũ Minh Đức","role":"Tech Lead"}]',
   '018d0005-0001-7001-8001-000000000001', '2026-03-03 15:00:00+07'),

  ('018d005c-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   NULL, '018d0006-0001-7001-8001-000000000005',
   'MediCare Plus — Churn Prevention Call', 30,
   'Cuộc gọi tìm hiểu lý do usage giảm. COO không hài lòng với response time support. Đề xuất dedicated support + 2 tháng miễn phí.',
   '[{"task":"Assign dedicated support agent","owner":"Support Lead","due":"2026-03-06"},{"task":"Tạo credit 2 tháng","owner":"Giang","due":"2026-03-07"},{"task":"Schedule exec-to-exec call","owner":"VP Sales","due":"2026-03-10"}]',
   '["Support response time","Feature adoption low","Competitor evaluation","Retention offer"]',
   32, '{"seller":65,"buyer":35}',
   '[{"name":"Hoàng Thị Yến","role":"COO"},{"name":"Hoàng Thị Giang","role":"Account Manager"}]',
   '018d0005-0001-7001-8001-000000000006', '2026-03-04 10:00:00+07');
