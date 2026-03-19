-- ============================================================
-- S009: Seed Data — AI Models, Chatbot Training, Data Enrichment,
--       Subscriptions, Gamification, Integrations, Compliance
-- Phụ thuộc: S001 (tenant, users), S002 (employees), S003 (contacts)
-- Migration: V012
-- ============================================================

-- Tenant: 018d0001-0001-7001-8001-000000000001
-- emp An:    018d0005-0001-7001-8001-000000000001
-- emp Bình:  018d0005-0001-7001-8001-000000000002
-- emp Đức:   018d0005-0001-7001-8001-000000000005
-- emp Giang: 018d0005-0001-7001-8001-000000000006
-- emp Huy:   018d0005-0001-7001-8001-000000000007
-- emp Nova (AI BDR):    018d0005-0001-7001-8001-000000000011
-- emp Muse (AI Content): 018d0005-0001-7001-8001-000000000012
-- contacts: 018d0006-0001-7001-8001-000000000001..010

-- ============================================================
-- Chatbot Training Data (5 intents)
-- ============================================================
INSERT INTO chatbot_training_data (id, tenant_id, intent, category, training_phrases, response_templates, context, confidence_threshold, is_active, usage_count, accuracy_rate, created_by) VALUES
  ('018d0040-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'greeting', 'general',
   '["Xin chào","Hello","Hi","Chào bạn","Mình cần hỗ trợ"]',
   '["Xin chào! Tôi là AI Assistant của AI-CRM. Tôi có thể giúp gì cho bạn hôm nay?","Chào bạn! Rất vui được hỗ trợ. Bạn cần tư vấn về sản phẩm hay hỗ trợ kỹ thuật?"]',
   '{"follow_up_intents":["product_inquiry","support_request"]}',
   0.85, TRUE, 4520, 97.30,
   '018d0005-0001-7001-8001-000000000007'),

  ('018d0040-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'pricing_inquiry', 'sales',
   '["Giá bao nhiêu","Bảng giá","Chi phí","Plans","Gói nào phù hợp","Pricing"]',
   '["AI-CRM có 3 gói: Starter (5M₫/tháng), Professional (15M₫/tháng), Enterprise (tùy chỉnh). Bạn muốn tìm hiểu gói nào?","Để tư vấn giá chính xác, cho tôi biết quy mô đội ngũ sales và nhu cầu chính của bạn nhé!"]',
   '{"entities":["plan_name","team_size"],"escalate_to":"sales_team"}',
   0.80, TRUE, 2340, 94.50,
   '018d0005-0001-7001-8001-000000000007'),

  ('018d0040-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'demo_request', 'sales',
   '["Muốn xem demo","Demo sản phẩm","Thử miễn phí","Trial","Đăng ký dùng thử"]',
   '["Tuyệt vời! Tôi sẽ đặt lịch demo 30 phút cho bạn với chuyên gia. Bạn rảnh thời gian nào trong tuần tới?","Bạn có thể đăng ký demo tại: [link]. Hoặc cho tôi email, đội ngũ sẽ liên hệ trong 24h!"]',
   '{"entities":["email","preferred_time"],"create_lead":true}',
   0.82, TRUE, 1890, 96.20,
   '018d0005-0001-7001-8001-000000000007'),

  ('018d0040-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'technical_support', 'support',
   '["Lỗi","Bug","Không hoạt động","Error","Hỗ trợ kỹ thuật","API issue"]',
   '["Tôi hiểu bạn đang gặp vấn đề kỹ thuật. Bạn có thể mô tả chi tiết lỗi và ảnh chụp màn hình không?","Tôi sẽ tạo ticket hỗ trợ ngay. Trong lúc chờ, bạn có thể thử: 1) Clear cache, 2) Kiểm tra API key, 3) Xem status page."]',
   '{"entities":["error_message","module"],"create_ticket":true,"priority":"medium"}',
   0.75, TRUE, 3210, 89.80,
   '018d0005-0001-7001-8001-000000000007'),

  ('018d0040-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   'feature_request', 'product',
   '["Tính năng mới","Feature request","Đề xuất","Có thể thêm","Wish list"]',
   '["Cảm ơn góp ý! Tôi đã ghi nhận yêu cầu của bạn. Đội Product sẽ review trong sprint tiếp theo.","Ý tưởng hay! Bạn có thể vote cho feature này trên roadmap: [link]. Hiện tại có 23 người cũng muốn tính năng tương tự."]',
   '{"entities":["feature_description","module"],"notify":"product_team"}',
   0.78, TRUE, 876, 91.40,
   '018d0005-0001-7001-8001-000000000007');

-- ============================================================
-- AI Models (4 mô hình AI)
-- ============================================================
INSERT INTO ai_models (id, tenant_id, name, model_type, status, accuracy, precision_score, recall_score, training_data_size, last_trained_at, deployed_at, config) VALUES
  ('018d0041-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'LeadScorer v3.2', 'lead-scoring', 'deployed',
   94.20, 91.50, 96.80, 15000,
   '2026-02-28 03:00:00+07', '2026-03-01 08:00:00+07',
   '{"algorithm":"gradient_boosting","features":["industry","company_size","engagement_score","website_visits","email_opens","content_downloads"],"threshold":0.65}'),

  ('018d0041-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'ChurnPredictor v2.1', 'churn-prediction', 'deployed',
   88.70, 85.30, 92.10, 8500,
   '2026-02-15 03:00:00+07', '2026-02-16 09:00:00+07',
   '{"algorithm":"random_forest","features":["usage_frequency","support_tickets","nps_score","login_days","feature_adoption"],"predict_window_days":90}'),

  ('018d0041-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'DealForecaster v1.8', 'deal-forecast', 'deployed',
   91.30, 89.70, 93.00, 12000,
   '2026-03-01 03:00:00+07', '2026-03-01 10:00:00+07',
   '{"algorithm":"lstm_neural_network","features":["deal_stage","days_in_stage","deal_value","contact_engagement","competitor_presence","decision_maker_involved"],"forecast_horizon_days":30}'),

  ('018d0041-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'SentimentAnalyzer v4.0', 'sentiment', 'training',
   NULL, NULL, NULL, 25000,
   NULL, NULL,
   '{"algorithm":"transformer_bert_vi","languages":["vi","en"],"domains":["customer_feedback","social_media","email"],"version":"training_epoch_15"}');

-- ============================================================
-- Data Enrichment Jobs (3 jobs)
-- ============================================================
INSERT INTO data_enrichment_jobs (id, tenant_id, name, source, entity_type, status, total_records, enriched_records, failed_records, fields_enriched, started_at, completed_at, triggered_by) VALUES
  ('018d0042-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'LinkedIn Enrichment — Contacts Q1', 'linkedin', 'contacts', 'completed',
   450, 398, 12,
   '["job_title","company_size","industry","linkedin_url","education"]',
   '2026-02-20 09:00:00+07', '2026-02-20 11:30:00+07',
   '018d0005-0001-7001-8001-000000000002'),

  ('018d0042-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'AI-Generated Company Intel', 'ai-generated', 'contacts', 'completed',
   200, 195, 5,
   '["company_description","tech_stack","funding_stage","growth_indicators"]',
   '2026-03-01 10:00:00+07', '2026-03-01 10:45:00+07',
   '018d0005-0001-7001-8001-000000000007'),

  ('018d0042-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'ZoomInfo Batch — New Leads March', 'zoominfo', 'contacts', 'running',
   320, 178, 3,
   '["email_verified","phone_verified","intent_signals","department"]',
   '2026-03-05 08:00:00+07', NULL,
   '018d0005-0001-7001-8001-000000000002');

-- ============================================================
-- Subscriptions (5 subscriptions)
-- ============================================================
INSERT INTO subscriptions (id, tenant_id, contact_id, plan_name, status, billing_cycle, amount, currency, start_date, end_date, trial_end_date, next_billing_date, auto_renew, mrr) VALUES
  ('018d0043-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d0006-0001-7001-8001-000000000001',
   'Enterprise', 'active', 'annually', 180000000.00, 'VND',
   '2025-06-01', '2026-05-31', NULL, '2026-06-01', TRUE, 15000000.00),

  ('018d0043-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d0006-0001-7001-8001-000000000002',
   'Professional', 'active', 'monthly', 15000000.00, 'VND',
   '2025-09-15', NULL, NULL, '2026-04-15', TRUE, 15000000.00),

  ('018d0043-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d0006-0001-7001-8001-000000000003',
   'Professional', 'trial', 'monthly', 15000000.00, 'VND',
   '2026-02-20', NULL, '2026-03-20', NULL, FALSE, 0.00),

  ('018d0043-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   '018d0006-0001-7001-8001-000000000004',
   'Starter', 'active', 'monthly', 5000000.00, 'VND',
   '2025-12-01', NULL, NULL, '2026-04-01', TRUE, 5000000.00),

  ('018d0043-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   '018d0006-0001-7001-8001-000000000005',
   'Enterprise', 'past-due', 'annually', 180000000.00, 'VND',
   '2025-03-01', '2026-02-28', NULL, '2026-03-01', TRUE, 15000000.00);

-- ============================================================
-- Currency Exchange Rates (4 cặp tiền tệ)
-- ============================================================
INSERT INTO currency_exchange_rates (id, tenant_id, from_currency, to_currency, rate, effective_date, source) VALUES
  ('018d0044-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'USD', 'VND', 25350.00000000, '2026-03-05', 'api'),
  ('018d0044-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'EUR', 'VND', 27580.00000000, '2026-03-05', 'api'),
  ('018d0044-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'JPY', 'VND', 168.50000000, '2026-03-05', 'api'),
  ('018d0044-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'SGD', 'VND', 18920.00000000, '2026-03-05', 'api');

-- ============================================================
-- Gamification Badges (6 huy hiệu)
-- ============================================================
INSERT INTO gamification_badges (id, tenant_id, name, description, icon, category, criteria, points, rarity, is_active) VALUES
  ('018d0045-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Người Mở Đường', 'Đóng deal đầu tiên trong tháng', 'Trophy',
   'sales', '{"type":"first_deal_of_month"}', 100, 'common', TRUE),

  ('018d0045-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Thợ Săn Voi', 'Đóng deal enterprise >= 500M₫', 'Target',
   'sales', '{"type":"deal_value_gte","value":500000000}', 500, 'epic', TRUE),

  ('018d0045-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'Siêu Năng Suất', 'Hoàn thành >= 50 activities trong 1 tuần', 'Zap',
   'activity', '{"type":"weekly_activities_gte","value":50}', 200, 'uncommon', TRUE),

  ('018d0045-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'Bậc Thầy Pipeline', 'Duy trì pipeline accuracy >= 90% trong 3 tháng liên tiếp', 'TrendingUp',
   'quality', '{"type":"pipeline_accuracy_gte","value":90,"months":3}', 800, 'rare', TRUE),

  ('018d0045-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   'Team Player', 'Hỗ trợ đồng nghiệp đóng >= 5 deals (collaboration tag)', 'Users',
   'collaboration', '{"type":"assisted_deals_gte","value":5}', 300, 'uncommon', TRUE),

  ('018d0045-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   'Huyền Thoại Q1', 'Đạt 150% quota trong quý', 'Crown',
   'milestone', '{"type":"quota_achievement_gte","value":150,"period":"quarter"}', 1500, 'legendary', TRUE);

-- Gamification Achievements (8 thành tích)
INSERT INTO gamification_achievements (id, tenant_id, employee_id, badge_id, points_earned, achieved_at, context) VALUES
  ('018d0046-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d0005-0001-7001-8001-000000000001', '018d0045-0001-7001-8001-000000000001',
   100, '2026-01-05 10:00:00+07', '{"deal_name":"TechCorp Enterprise License","deal_value":180000000}'),

  ('018d0046-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d0005-0001-7001-8001-000000000001', '018d0045-0001-7001-8001-000000000002',
   500, '2026-02-14 16:00:00+07', '{"deal_name":"FinancePlus Full Suite","deal_value":520000000}'),

  ('018d0046-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d0005-0001-7001-8001-000000000003', '018d0045-0001-7001-8001-000000000001',
   100, '2026-01-12 09:30:00+07', '{"deal_name":"RetailMax Starter","deal_value":60000000}'),

  ('018d0046-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   '018d0005-0001-7001-8001-000000000003', '018d0045-0001-7001-8001-000000000003',
   200, '2026-02-07 17:00:00+07', '{"weekly_activities":62,"week":"2026-W06"}'),

  ('018d0046-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   '018d0005-0001-7001-8001-000000000006', '018d0045-0001-7001-8001-000000000005',
   300, '2026-02-28 14:00:00+07', '{"assisted_deals":7,"top_collaborator":"Nguyễn Văn An"}'),

  ('018d0046-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   '018d0005-0001-7001-8001-000000000001', '018d0045-0001-7001-8001-000000000004',
   800, '2026-03-01 08:00:00+07', '{"accuracy_q4":92.1,"accuracy_q1_jan":93.5,"accuracy_q1_feb":91.8}'),

  ('018d0046-0001-7001-8001-000000000007', '018d0001-0001-7001-8001-000000000001',
   '018d0005-0001-7001-8001-000000000011', '018d0045-0001-7001-8001-000000000003',
   200, '2026-01-20 23:59:00+07', '{"weekly_activities":128,"week":"2026-W03","note":"AI agent - auto emails + lead qualification"}'),

  ('018d0046-0001-7001-8001-000000000008', '018d0001-0001-7001-8001-000000000001',
   '018d0005-0001-7001-8001-000000000001', '018d0045-0001-7001-8001-000000000006',
   1500, '2026-03-02 09:00:00+07', '{"quota_achievement_pct":162,"quarter":"Q4-2025","revenue":"2.4B VND"}');

-- ============================================================
-- Integrations (5 tích hợp)
-- ============================================================
INSERT INTO integrations (id, tenant_id, name, provider, category, status, config, scopes, last_sync_at, sync_frequency, error_message, connected_by) VALUES
  ('018d0047-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Google Workspace', 'google', 'calendar', 'connected',
   '{"domain":"abc-software.vn","sync_calendar":true,"sync_contacts":true,"sync_drive":false}',
   '["calendar.read","calendar.write","contacts.read","gmail.send"]',
   '2026-03-05 06:00:00+07', 'realtime', NULL,
   '018d0005-0001-7001-8001-000000000005'),

  ('018d0047-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Slack', 'slack', 'communication', 'connected',
   '{"workspace":"abc-software","channels":["#sales-wins","#support-alerts","#marketing"]}',
   '["channels:read","chat:write","users:read"]',
   '2026-03-05 07:30:00+07', 'realtime', NULL,
   '018d0005-0001-7001-8001-000000000005'),

  ('018d0047-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'SAP Business One', 'sap', 'crm', 'error',
   '{"instance":"sap-prod.abc-software.vn","sync_invoices":true,"sync_orders":true}',
   '["invoice.read","order.write","product.read"]',
   '2026-03-01 08:00:00+07', 'hourly',
   'Connection timeout: SAP gateway not responding (last 3 attempts failed)',
   '018d0005-0001-7001-8001-000000000005'),

  ('018d0047-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'Mailchimp', 'mailchimp', 'communication', 'connected',
   '{"list_id":"abc123","auto_sync_contacts":true}',
   '["lists:read","campaigns:write","contacts:sync"]',
   '2026-03-04 22:00:00+07', 'daily', NULL,
   '018d0005-0001-7001-8001-000000000002'),

  ('018d0047-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   'Google Analytics 4', 'google', 'analytics', 'connected',
   '{"property_id":"GA4-123456789","track_events":["form_submit","demo_request","pricing_view"]}',
   '["analytics:read"]',
   '2026-03-05 05:00:00+07', 'daily', NULL,
   '018d0005-0001-7001-8001-000000000002');

-- ============================================================
-- API Keys (2 API keys)
-- ============================================================
INSERT INTO api_keys (id, tenant_id, name, key_hash, key_prefix, scopes, status, expires_at, last_used_at, request_count, rate_limit, created_by) VALUES
  ('018d0048-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Production API Key', 'sha256$a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0',
   'crm_prod_', '["contacts:*","deals:*","activities:*","reports:read"]',
   'active', '2026-12-31 23:59:59+07', '2026-03-05 07:45:00+07', 125430, 1000,
   '018d0005-0001-7001-8001-000000000005'),

  ('018d0048-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Staging API Key', 'sha256$z9y8x7w6v5u4t3s2r1q0p9o8n7m6l5k4j3i2h1g0',
   'crm_stg_', '["*"]',
   'active', '2026-06-30 23:59:59+07', '2026-03-04 18:20:00+07', 34560, 500,
   '018d0005-0001-7001-8001-000000000005');

-- ============================================================
-- Compliance Checks (4 kiểm tra tuân thủ)
-- ============================================================
INSERT INTO compliance_checks (id, tenant_id, name, framework, status, category, description, due_date, reviewer_id, risk_level, notes, last_checked_at) VALUES
  ('018d0049-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'GDPR — Data Processing Agreement', 'gdpr', 'compliant',
   'Data Protection', 'Kiểm tra DPA với tất cả sub-processors và hosting providers',
   '2026-06-30', '018d0005-0001-7001-8001-000000000005', 'high',
   'DPA đã ký với AWS, Cloudflare, SendGrid. Review lần sau Q3/2026.',
   '2026-02-15 10:00:00+07'),

  ('018d0049-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'SOC 2 Type II — Annual Audit', 'soc2', 'in-progress',
   'Security', 'Audit SOC 2 Type II hàng năm — đang trong giai đoạn thu thập evidence',
   '2026-04-30', '018d0005-0001-7001-8001-000000000005', 'critical',
   'Auditor: Deloitte Vietnam. Kickoff 01/03/2026. Evidence collection deadline: 15/04/2026.',
   '2026-03-01 09:00:00+07'),

  ('018d0049-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'ISO 27001 — ISMS Review', 'iso27001', 'compliant',
   'Information Security', 'Review hệ thống quản lý an toàn thông tin theo ISO 27001',
   '2026-09-30', '018d0005-0001-7001-8001-000000000005', 'medium',
   'Chứng chỉ ISO 27001:2022 có hiệu lực đến 09/2026. Surveillance audit dự kiến 07/2026.',
   '2026-01-10 14:00:00+07'),

  ('018d0049-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'PCI-DSS — Payment Data Handling', 'pci-dss', 'pending',
   'Payment Security', 'Đánh giá tuân thủ PCI-DSS cho module thanh toán subscription',
   '2026-05-31', NULL, 'high',
   'Chưa bắt đầu. Cần assign reviewer và lên kế hoạch assessment.',
   NULL);

-- ============================================================
-- SLA Policies (3 chính sách SLA)
-- ============================================================
INSERT INTO sla_policies (id, tenant_id, name, description, priority, response_time_hours, resolution_time_hours, business_hours_only, escalation_rules, is_active) VALUES
  ('018d004a-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'SLA Critical — P1', 'Sự cố nghiêm trọng ảnh hưởng toàn bộ hệ thống',
   'critical', 0.5, 4.0, FALSE,
   '[{"after_minutes":30,"action":"notify","target":"engineering_lead"},{"after_minutes":120,"action":"escalate","target":"vp_engineering"},{"after_minutes":240,"action":"escalate","target":"cto"}]',
   TRUE),
  ('018d004a-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'SLA High — P2', 'Sự cố ảnh hưởng một phần chức năng, có workaround',
   'high', 2.0, 12.0, TRUE,
   '[{"after_minutes":120,"action":"notify","target":"support_lead"},{"after_minutes":480,"action":"escalate","target":"engineering_lead"}]',
   TRUE),
  ('018d004a-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'SLA Medium — P3', 'Yêu cầu hỗ trợ thông thường, không khẩn cấp',
   'medium', 8.0, 48.0, TRUE,
   '[{"after_minutes":480,"action":"notify","target":"support_lead"}]',
   TRUE);

-- ============================================================
-- Trust Certifications (3 chứng chỉ)
-- ============================================================
INSERT INTO trust_certifications (id, tenant_id, name, issuer, cert_type, status, issued_date, expiry_date, certificate_url, description) VALUES
  ('018d004b-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'ISO 27001:2022', 'BSI Group Vietnam', 'security', 'valid',
   '2023-09-15', '2026-09-14',
   'https://trust.abc-software.vn/certs/iso27001',
   'Chứng chỉ ISO 27001:2022 cho hệ thống quản lý an toàn thông tin'),
  ('018d004b-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'SOC 2 Type II', 'Deloitte Vietnam', 'security', 'valid',
   '2025-05-01', '2026-04-30',
   'https://trust.abc-software.vn/certs/soc2',
   'Báo cáo SOC 2 Type II — Security, Availability, Confidentiality'),
  ('018d004b-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'GDPR Compliance Certificate', 'TÜV Rheinland', 'privacy', 'valid',
   '2024-01-20', '2027-01-19',
   'https://trust.abc-software.vn/certs/gdpr',
   'Chứng nhận tuân thủ GDPR cho xử lý dữ liệu khách hàng EU');
