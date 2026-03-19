-- ============================================================
-- S007: Seed Data — Marketing Campaigns, Landing Pages,
--       Content Calendar, Referral Programs, A/B Tests
-- Phụ thuộc: S001 (tenant), S002 (employees), S003 (contacts)
-- Migration: V010
-- ============================================================

-- Tenant ID tham chiếu
-- tenant:  018d0001-0001-7001-8001-000000000001
-- emp Bình (Marketing Mgr): 018d0005-0001-7001-8001-000000000002
-- emp An   (Sales Exec):     018d0005-0001-7001-8001-000000000001
-- emp Cường (BDR):           018d0005-0001-7001-8001-000000000003
-- emp Giang (Acct Mgr):      018d0005-0001-7001-8001-000000000006
-- emp Muse (AI Content):     018d0005-0001-7001-8001-000000000012
-- contact Tùng:              018d0006-0001-7001-8001-000000000001
-- contact Hằng:              018d0006-0001-7001-8001-000000000002

-- ============================================================
-- Forms (2 mẫu)
-- ============================================================
INSERT INTO forms (id, tenant_id, name, description, status, form_type, slug, submit_button_text, success_message, notification_emails, submission_count, conversion_rate, created_by) VALUES
  ('018d0020-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Đăng ký Demo AI-CRM', 'Form đăng ký demo sản phẩm trên landing page', 'published', 'lead-capture',
   'dang-ky-demo-ai-crm', 'Đăng ký ngay', 'Cảm ơn bạn đã đăng ký! Đội ngũ sẽ liên hệ trong 24h.',
   '["binh.tran@company.com","an.nguyen@company.com"]', 156, 12.40,
   '018d0005-0001-7001-8001-000000000002'),

  ('018d0020-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Phản hồi sau Webinar', 'Khảo sát nhanh sau webinar AI Sales Automation', 'published', 'feedback',
   'phan-hoi-webinar-q1-2026', 'Gửi phản hồi', 'Cảm ơn ý kiến quý báu của bạn!',
   '["binh.tran@company.com"]', 89, 68.50,
   '018d0005-0001-7001-8001-000000000002');

-- Form Fields cho form Demo
INSERT INTO form_fields (id, tenant_id, form_id, field_key, field_label, field_type, placeholder, is_required, sort_order, width) VALUES
  ('018d0021-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d0020-0001-7001-8001-000000000001', 'full_name', 'Họ và tên', 'text', 'Nhập họ tên...', TRUE, 1, 'full'),
  ('018d0021-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d0020-0001-7001-8001-000000000001', 'email', 'Email công ty', 'email', 'ten@congty.com', TRUE, 2, 'half'),
  ('018d0021-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d0020-0001-7001-8001-000000000001', 'phone', 'Số điện thoại', 'phone', '09xx xxx xxx', FALSE, 3, 'half'),
  ('018d0021-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   '018d0020-0001-7001-8001-000000000001', 'company', 'Tên công ty', 'text', 'Công ty ABC', TRUE, 4, 'full'),
  ('018d0021-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   '018d0020-0001-7001-8001-000000000001', 'team_size', 'Quy mô đội ngũ', 'select', NULL, TRUE, 5, 'half');

-- Form Submissions (3 mẫu)
INSERT INTO form_submissions (id, tenant_id, form_id, data, contact_id) VALUES
  ('018d0022-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d0020-0001-7001-8001-000000000001',
   '{"full_name":"Nguyễn Thanh Tùng","email":"tung.nguyen@techcorp.vn","phone":"0912345678","company":"TechCorp Vietnam","team_size":"20-50"}',
   '018d0006-0001-7001-8001-000000000001'),
  ('018d0022-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d0020-0001-7001-8001-000000000001',
   '{"full_name":"Trần Minh Hằng","email":"hang.tran@financeplus.vn","company":"FinancePlus","team_size":"50-100"}',
   '018d0006-0001-7001-8001-000000000002'),
  ('018d0022-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d0020-0001-7001-8001-000000000002',
   '{"rating":9,"feedback":"Webinar rất hữu ích, muốn biết thêm về AI Sales Coach"}',
   NULL);

-- ============================================================
-- Surveys (2 bộ khảo sát)
-- ============================================================
INSERT INTO surveys (id, tenant_id, name, description, status, survey_type, target_audience, response_count, avg_score, start_date, end_date, created_by) VALUES
  ('018d0023-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'CSAT Q1/2026', 'Khảo sát mức độ hài lòng khách hàng quý 1 năm 2026', 'active', 'csat',
   'Khách hàng đang dùng gói Professional+', 67, 8.40, '2026-01-15', '2026-03-31',
   '018d0005-0001-7001-8001-000000000006'),
  ('018d0023-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'CES — Trải nghiệm Onboarding', 'Đánh giá mức độ dễ sử dụng khi triển khai ban đầu', 'closed', 'ces',
   'Khách hàng mới < 90 ngày', 43, 7.60, '2025-10-01', '2025-12-31',
   '018d0005-0001-7001-8001-000000000002');

-- Survey Questions (4 câu cho CSAT Q1)
INSERT INTO survey_questions (id, tenant_id, survey_id, question_text, question_type, options, is_required, sort_order) VALUES
  ('018d0024-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d0023-0001-7001-8001-000000000001',
   'Mức độ hài lòng tổng thể với AI-CRM? (1-10)', 'scale', '{"min":1,"max":10}', TRUE, 1),
  ('018d0024-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d0023-0001-7001-8001-000000000001',
   'Tính năng nào bạn đánh giá cao nhất?', 'multi-choice',
   '["AI Sales Coach","Pipeline Management","Email Automation","Reporting","Deal Room","Gamification"]', TRUE, 2),
  ('018d0024-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d0023-0001-7001-8001-000000000001',
   'Bạn có giới thiệu AI-CRM cho đồng nghiệp không?', 'single-choice',
   '["Chắc chắn có","Có thể","Không chắc","Không"]', TRUE, 3),
  ('018d0024-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   '018d0023-0001-7001-8001-000000000001',
   'Góp ý để chúng tôi cải thiện:', 'text', NULL, FALSE, 4);

-- Survey Responses (3 phản hồi)
INSERT INTO survey_responses (id, tenant_id, survey_id, contact_id, respondent_name, respondent_email, answers, overall_score, completed) VALUES
  ('018d0025-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d0023-0001-7001-8001-000000000001',
   '018d0006-0001-7001-8001-000000000001', 'Nguyễn Thanh Tùng', 'tung.nguyen@techcorp.vn',
   '{"q1":9,"q2":["AI Sales Coach","Pipeline Management"],"q3":"Chắc chắn có","q4":"Rất tốt, mong có thêm mobile app"}',
   9.00, TRUE),
  ('018d0025-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d0023-0001-7001-8001-000000000001',
   '018d0006-0001-7001-8001-000000000002', 'Trần Minh Hằng', 'hang.tran@financeplus.vn',
   '{"q1":8,"q2":["Reporting","Deal Room"],"q3":"Có thể","q4":"API documentation cần cải thiện thêm"}',
   8.00, TRUE),
  ('018d0025-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d0023-0001-7001-8001-000000000001',
   NULL, 'Lê Phương Thảo', 'thao.le@retailmax.vn',
   '{"q1":7,"q2":["Email Automation","Gamification"],"q3":"Có thể","q4":""}',
   7.00, TRUE);

-- ============================================================
-- Landing Pages (3 trang)
-- ============================================================
INSERT INTO landing_pages (id, tenant_id, name, slug, status, template, meta_title, meta_description, form_id, views, conversions, conversion_rate, published_at, created_by) VALUES
  ('018d0026-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'AI-CRM Demo Registration', 'demo-ai-crm', 'published', 'hero-form',
   'Đăng ký Demo AI-CRM miễn phí | Công ty ABC', 'Trải nghiệm CRM AI-first hàng đầu Việt Nam. Đăng ký demo 1:1 với chuyên gia ngay.',
   '018d0020-0001-7001-8001-000000000001', 4520, 156, 3.45, '2025-11-01 08:00:00+07',
   '018d0005-0001-7001-8001-000000000002'),
  ('018d0026-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Webinar AI Sales Automation Q1-2026', 'webinar-ai-sales-q1-2026', 'published', 'event-registration',
   'Webinar: AI Sales Automation 2026 | ABC Software', 'Tham gia webinar miễn phí về xu hướng AI trong Sales 2026.',
   NULL, 2890, 234, 8.10, '2026-01-10 09:00:00+07',
   '018d0005-0001-7001-8001-000000000002'),
  ('018d0026-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'Ebook: 10 Chiến lược CRM', 'ebook-10-chien-luoc-crm', 'archived', 'lead-magnet',
   'Download Ebook miễn phí: 10 Chiến lược CRM cho SME', 'Tổng hợp 10 chiến lược CRM hiệu quả cho doanh nghiệp vừa và nhỏ.',
   NULL, 1230, 89, 7.24, '2025-06-15 08:00:00+07',
   '018d0005-0001-7001-8001-000000000012');

-- ============================================================
-- Marketing Campaigns (5 chiến dịch)
-- ============================================================
INSERT INTO marketing_campaigns (id, tenant_id, name, description, campaign_type, status, budget, spent, currency, start_date, end_date, target_audience, goals, metrics, owner_id) VALUES
  ('018d0027-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Email Nurture Q1/2026', 'Chuỗi email nurture cho leads từ webinar và demo đăng ký', 'email', 'active',
   50000000.00, 12500000.00, 'VND', '2026-01-15', '2026-03-31',
   '{"segment":"webinar-attendees","lead_score_min":40}',
   '{"target_mqls":50,"target_sqls":20,"target_deals":5}',
   '{"emails_sent":3200,"open_rate":42.5,"click_rate":8.3,"mqls":38}',
   '018d0005-0001-7001-8001-000000000002'),

  ('018d0027-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Google Ads — Enterprise CRM', 'Chiến dịch SEM nhắm mục tiêu từ khóa enterprise CRM', 'paid-ads', 'active',
   200000000.00, 145000000.00, 'VND', '2026-01-01', '2026-06-30',
   '{"geo":"Vietnam","company_size":"50+","keywords":["enterprise crm","crm ai","quan ly khach hang"]}',
   '{"target_leads":200,"target_mqls":80,"target_cpa":800000}',
   '{"impressions":125000,"clicks":4200,"ctr":3.36,"leads":168,"cost_per_lead":863095}',
   '018d0005-0001-7001-8001-000000000002'),

  ('018d0027-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'Webinar Series — AI in Sales', 'Chuỗi 4 webinar về ứng dụng AI trong bán hàng B2B', 'event', 'completed',
   80000000.00, 76000000.00, 'VND', '2025-10-01', '2026-01-31',
   '{"segment":"b2b-sales-leaders","job_titles":["VP Sales","Sales Director","CRO"]}',
   '{"target_registrations":400,"target_attendance":200,"target_mqls":60}',
   '{"registrations":512,"attendance":267,"mqls":78,"sqls":32,"deals_influenced":8}',
   '018d0005-0001-7001-8001-000000000002'),

  ('018d0027-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'Content Marketing — SEO Blog', 'Xuất bản 20 bài blog SEO về CRM, AI, Sales Ops', 'content', 'active',
   30000000.00, 18000000.00, 'VND', '2026-01-01', '2026-12-31',
   '{"channel":"organic-search","topics":["crm-best-practices","ai-sales","sales-ops"]}',
   '{"target_traffic":50000,"target_leads":300,"target_domain_authority":45}',
   '{"articles_published":8,"organic_traffic":12400,"leads_from_content":45,"avg_time_on_page":"4m32s"}',
   '018d0005-0001-7001-8001-000000000012'),

  ('018d0027-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   'Social Media Brand Awareness', 'Chiến dịch tăng nhận diện thương hiệu trên LinkedIn + Facebook', 'social', 'scheduled',
   60000000.00, 0.00, 'VND', '2026-04-01', '2026-06-30',
   '{"platforms":["linkedin","facebook"],"audience":"it-decision-makers-vietnam"}',
   '{"target_reach":500000,"target_followers":2000,"target_engagement_rate":5.0}',
   '{}',
   '018d0005-0001-7001-8001-000000000002');

-- ============================================================
-- Content Calendar Items (6 mục)
-- ============================================================
INSERT INTO content_calendar_items (id, tenant_id, title, content_type, status, channel, scheduled_date, published_date, author_id, campaign_id, description, url) VALUES
  ('018d0028-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '10 Lý do chuyển đổi sang CRM AI-first', 'blog', 'published', 'website',
   '2026-01-20', '2026-01-20', '018d0005-0001-7001-8001-000000000012',
   '018d0027-0001-7001-8001-000000000004',
   'Blog post phân tích lợi ích CRM tích hợp AI so với CRM truyền thống', 'https://abc-software.vn/blog/10-ly-do-crm-ai-first'),

  ('018d0028-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Case Study: TechCorp tăng 40% deal velocity', 'case-study', 'published', 'website',
   '2026-02-05', '2026-02-05', '018d0005-0001-7001-8001-000000000002',
   '018d0027-0001-7001-8001-000000000004',
   'Case study chi tiết về việc TechCorp triển khai AI-CRM', 'https://abc-software.vn/case-study/techcorp'),

  ('018d0028-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'Video: AI Sales Coach Demo 60s', 'video', 'in-progress', 'social',
   '2026-03-10', NULL, '018d0005-0001-7001-8001-000000000012',
   '018d0027-0001-7001-8001-000000000005',
   'Short video demo tính năng AI Sales Coach cho TikTok/Reels', NULL),

  ('018d0028-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'LinkedIn Carousel: Pipeline Management Tips', 'social', 'planned', 'linkedin',
   '2026-03-15', NULL, '018d0005-0001-7001-8001-000000000012',
   '018d0027-0001-7001-8001-000000000005',
   '10-slide carousel chia sẻ best practices quản lý pipeline', NULL),

  ('018d0028-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   'Whitepaper: AI trong CRM — Xu hướng 2026', 'whitepaper', 'review', 'website',
   '2026-03-20', NULL, '018d0005-0001-7001-8001-000000000007',
   '018d0027-0001-7001-8001-000000000004',
   'Whitepaper 20 trang phân tích xu hướng AI CRM toàn cầu', NULL),

  ('018d0028-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   'Email Newsletter — Tháng 3/2026', 'email', 'idea', 'email',
   '2026-03-28', NULL, '018d0005-0001-7001-8001-000000000002',
   '018d0027-0001-7001-8001-000000000001',
   'Newsletter tổng hợp tin tức sản phẩm, blog mới, upcoming events', NULL);

-- ============================================================
-- Referral Programs (2 chương trình)
-- ============================================================
INSERT INTO referral_programs (id, tenant_id, name, description, status, reward_type, reward_value, reward_currency, total_referrals, successful_referrals, total_revenue_generated) VALUES
  ('018d0029-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Giới thiệu bạn bè — Cash Reward', 'Nhận 5 triệu VND cho mỗi khách hàng mới qua giới thiệu',
   'active', 'cash', 5000000.00, 'VND', 45, 18, 1800000000.00),
  ('018d0029-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Partner Referral — Credit', 'Đối tác được credit 10% giá trị hợp đồng năm đầu tiên',
   'active', 'credit', 0.00, 'VND', 23, 12, 2400000000.00);

-- Referrals (4 lượt giới thiệu)
INSERT INTO referrals (id, tenant_id, program_id, referrer_contact_id, referrer_name, referred_name, referred_email, referred_company, status, reward_paid, reward_amount) VALUES
  ('018d002a-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d0029-0001-7001-8001-000000000001',
   '018d0006-0001-7001-8001-000000000001', 'Nguyễn Thanh Tùng',
   'Đặng Quốc Việt', 'viet.dang@logisticspro.vn', 'LogisticsPro', 'converted', TRUE, 5000000.00),
  ('018d002a-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d0029-0001-7001-8001-000000000001',
   '018d0006-0001-7001-8001-000000000002', 'Trần Minh Hằng',
   'Cao Thị Uyên', 'uyen.cao@mediagroup.vn', 'MediaGroup', 'qualified', FALSE, 0.00),
  ('018d002a-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d0029-0001-7001-8001-000000000001',
   NULL, 'Phạm Đức Long',
   'Trịnh Thị Mai', 'mai.trinh@edutech.vn', 'EduTech Solutions', 'contacted', FALSE, 0.00),
  ('018d002a-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   '018d0029-0001-7001-8001-000000000002',
   '018d0006-0001-7001-8001-000000000001', 'Nguyễn Thanh Tùng',
   'Hoàng Anh Tuấn', 'tuan.hoang@healthcareit.vn', 'HealthcareIT', 'converted', TRUE, 12000000.00);

-- ============================================================
-- A/B Tests (2 test)
-- ============================================================
INSERT INTO ab_tests (id, tenant_id, name, test_type, status, hypothesis, metric, traffic_split, sample_size, confidence_level, start_date, end_date, created_by) VALUES
  ('018d002b-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Email Subject Line — Demo Invitation', 'email-subject', 'completed',
   'Subject line có chứa "AI" sẽ có open rate cao hơn 15% so với subject không có',
   'open_rate', '[50,50]', 3200, 95.20, '2026-01-20', '2026-02-05',
   '018d0005-0001-7001-8001-000000000002'),
  ('018d002b-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Landing Page CTA Button Color', 'landing-page', 'running',
   'CTA button màu cam sẽ có click-through rate cao hơn 10% so với button xanh',
   'click_through_rate', '[50,50]', 1800, NULL, '2026-02-15', '2026-03-15',
   '018d0005-0001-7001-8001-000000000002');

-- A/B Test Variants (4 variants cho 2 tests)
INSERT INTO ab_test_variants (id, tenant_id, test_id, variant_name, content, impressions, conversions, conversion_rate, is_control) VALUES
  ('018d002c-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d002b-0001-7001-8001-000000000001', 'Control — Không có AI',
   '{"subject":"Đăng ký Demo CRM miễn phí — Tăng doanh thu ngay"}',
   1600, 576, 36.00, TRUE),
  ('018d002c-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d002b-0001-7001-8001-000000000001', 'Variant A — Có AI',
   '{"subject":"🤖 Demo AI-CRM miễn phí — AI tăng deal velocity 40%"}',
   1600, 720, 45.00, FALSE),
  ('018d002c-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d002b-0001-7001-8001-000000000002', 'Control — Xanh dương',
   '{"button_color":"#2563EB","button_text":"Đăng ký Demo"}',
   900, 63, 7.00, TRUE),
  ('018d002c-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   '018d002b-0001-7001-8001-000000000002', 'Variant A — Cam',
   '{"button_color":"#EA580C","button_text":"Đăng ký Demo ngay!"}',
   900, 81, 9.00, FALSE);

-- Cập nhật winner cho test 1 (variant có AI thắng)
UPDATE ab_tests
SET winner_variant_id = '018d002c-0001-7001-8001-000000000002'
WHERE id = '018d002b-0001-7001-8001-000000000001';
