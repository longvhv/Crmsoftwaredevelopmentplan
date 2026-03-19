-- ============================================================
-- S008: Seed Data — Workflows, Automation Rules, Custom Fields,
--       Webhooks, Notification Preferences
-- Phụ thuộc: S001 (tenant, users), S002 (employees)
-- Migration: V009
-- ============================================================

-- Tenant ID: 018d0001-0001-7001-8001-000000000001
-- Admin user: 018d0002-0001-7001-8001-000000000001
-- emp An    (Sales):    018d0005-0001-7001-8001-000000000001
-- emp Bình  (Marketing): 018d0005-0001-7001-8001-000000000002
-- emp Dung  (PM):       018d0005-0001-7001-8001-000000000004
-- emp Đức   (Tech Lead): 018d0005-0001-7001-8001-000000000005
-- emp Giang (Acct Mgr): 018d0005-0001-7001-8001-000000000006
-- emp Huy   (AI Eng):   018d0005-0001-7001-8001-000000000007

-- ============================================================
-- Settings Categories (6 danh mục)
-- ============================================================
INSERT INTO crm_settings_categories (id, tenant_id, name, slug, description, icon, sort_order) VALUES
  ('018d0030-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Tổng quan', 'general', 'Cấu hình chung của hệ thống CRM', 'Settings', 1),
  ('018d0030-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Tự động hóa', 'automation', 'Automation rules, workflows, triggers', 'Zap', 2),
  ('018d0030-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'Trường tùy chỉnh', 'custom-fields', 'Quản lý custom fields cho các entity', 'Columns', 3),
  ('018d0030-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'Tích hợp', 'integrations', 'Kết nối API, webhooks, third-party apps', 'Plug', 4),
  ('018d0030-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   'Thông báo', 'notifications', 'Cấu hình email, push, SMS notifications', 'Bell', 5),
  ('018d0030-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   'Bảo mật & Quyền', 'security', 'RLS, RBAC, audit log, compliance', 'Shield', 6);

-- ============================================================
-- Custom Fields (8 trường tùy chỉnh)
-- ============================================================
INSERT INTO custom_fields (id, tenant_id, entity_type, field_name, field_label, field_type, options, is_required, is_searchable, sort_order, default_value) VALUES
  ('018d0031-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'contacts', 'industry_vertical', 'Ngành dọc', 'select',
   '["Fintech","Logistics","Retail","Healthcare","Education","Manufacturing","SaaS","Other"]',
   FALSE, TRUE, 1, NULL),
  ('018d0031-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'contacts', 'annual_revenue', 'Doanh thu hàng năm (VND)', 'number',
   NULL, FALSE, FALSE, 2, NULL),
  ('018d0031-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'contacts', 'preferred_language', 'Ngôn ngữ ưa thích', 'select',
   '["Tiếng Việt","English","日本語","한국어"]',
   FALSE, FALSE, 3, 'Tiếng Việt'),
  ('018d0031-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'deals', 'competitor_involved', 'Đối thủ tham gia', 'multi-select',
   '["HubSpot","Salesforce","Zoho CRM","Freshsales","Pipedrive","Không có"]',
   FALSE, TRUE, 1, NULL),
  ('018d0031-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   'deals', 'decision_timeline', 'Timeline quyết định', 'select',
   '["< 1 tháng","1-3 tháng","3-6 tháng","6-12 tháng","> 12 tháng"]',
   TRUE, FALSE, 2, '1-3 tháng'),
  ('018d0031-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   'deals', 'procurement_process', 'Quy trình mua sắm', 'textarea',
   NULL, FALSE, FALSE, 3, NULL),
  ('018d0031-0001-7001-8001-000000000007', '018d0001-0001-7001-8001-000000000001',
   'leads', 'utm_source', 'UTM Source', 'text',
   NULL, FALSE, TRUE, 1, NULL),
  ('018d0031-0001-7001-8001-000000000008', '018d0001-0001-7001-8001-000000000001',
   'leads', 'initial_interest', 'Quan tâm ban đầu', 'multi-select',
   '["AI Sales Coach","Pipeline Management","Email Automation","Reporting","Deal Room","Full Suite"]',
   FALSE, FALSE, 2, NULL);

-- ============================================================
-- Automation Rules (5 quy tắc tự động)
-- ============================================================
INSERT INTO automation_rules (id, tenant_id, name, description, trigger_event, conditions, actions, is_active, execution_count, last_executed_at, created_by) VALUES
  ('018d0032-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Auto-assign lead theo khu vực', 'Tự động phân công lead mới dựa trên vùng miền',
   'lead.created',
   '[{"field":"region","operator":"equals","value":"Miền Bắc"},{"field":"lead_score","operator":"gte","value":30}]',
   '[{"type":"assign","target_employee":"018d0005-0001-7001-8001-000000000001"},{"type":"notify","channel":"in-app","message":"Lead mới từ Miền Bắc được gán cho bạn"}]',
   TRUE, 234, '2026-03-04 14:30:00+07',
   '018d0005-0001-7001-8001-000000000002'),

  ('018d0032-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Cảnh báo deal stalled > 14 ngày', 'Gửi thông báo khi deal không có activity trong 14 ngày',
   'deal.stalled',
   '[{"field":"days_since_last_activity","operator":"gte","value":14},{"field":"stage","operator":"not_in","value":["won","lost"]}]',
   '[{"type":"notify","channel":"email","template":"deal-stalled-warning"},{"type":"create_task","title":"Follow-up deal stalled","priority":"high"}]',
   TRUE, 67, '2026-03-03 09:00:00+07',
   '018d0005-0001-7001-8001-000000000001'),

  ('018d0032-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'Tự động gửi welcome email', 'Gửi email chào mừng khi contact mới được tạo',
   'contact.created',
   '[{"field":"contact_type","operator":"equals","value":"customer"}]',
   '[{"type":"send_email","template":"welcome-new-customer","delay_minutes":0}]',
   TRUE, 156, '2026-03-04 16:45:00+07',
   '018d0005-0001-7001-8001-000000000002'),

  ('018d0032-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'Lead scoring — Auto MQL', 'Tự động đánh dấu MQL khi lead score >= 70',
   'lead.score_changed',
   '[{"field":"lead_score","operator":"gte","value":70},{"field":"status","operator":"not_equals","value":"converted"}]',
   '[{"type":"update_field","field":"status","value":"qualified"},{"type":"notify","channel":"in-app","message":"Lead đã đạt MQL! Score: {{lead_score}}"}]',
   TRUE, 89, '2026-03-04 11:20:00+07',
   '018d0005-0001-7001-8001-000000000007'),

  ('018d0032-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   'Tạo task khi deal chuyển Negotiation', 'Tự động tạo task "Chuẩn bị báo giá" khi deal vào stage Negotiation',
   'deal.stage_changed',
   '[{"field":"new_stage","operator":"equals","value":"negotiation"}]',
   '[{"type":"create_task","title":"Chuẩn bị báo giá cho {{deal_name}}","assignee":"deal_owner","due_days":3,"priority":"high"}]',
   TRUE, 42, '2026-03-02 10:00:00+07',
   '018d0005-0001-7001-8001-000000000001');

-- ============================================================
-- Workflow Definitions (4 workflow)
-- ============================================================
INSERT INTO workflow_definitions (id, tenant_id, name, description, workflow_type, status, steps, trigger_conditions, created_by) VALUES
  ('018d0033-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Phê duyệt Báo giá > 500M', 'Workflow phê duyệt cho báo giá trên 500 triệu VND',
   'approval', 'active',
   '[{"step":1,"name":"Sales Manager Review","approver_role":"sales_manager","timeout_hours":24},{"step":2,"name":"VP Sales Approval","approver_role":"vp_sales","timeout_hours":48},{"step":3,"name":"CFO Sign-off","approver_role":"cfo","timeout_hours":72,"condition":"amount > 1000000000"}]',
   '{"entity":"quotation","condition":"total_amount >= 500000000"}',
   '018d0005-0001-7001-8001-000000000004'),

  ('018d0033-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Onboarding khách hàng mới', 'Quy trình onboarding 30 ngày cho khách hàng Enterprise',
   'onboarding', 'active',
   '[{"step":1,"name":"Welcome Call","owner":"account_manager","due_days":1},{"step":2,"name":"Technical Setup","owner":"tech_lead","due_days":5},{"step":3,"name":"Training Session 1","owner":"account_manager","due_days":10},{"step":4,"name":"Go-live Support","owner":"support_team","due_days":15},{"step":5,"name":"30-day Health Check","owner":"customer_success","due_days":30}]',
   '{"entity":"deal","condition":"stage = ''won'' AND plan IN (''enterprise'',''business'')"}',
   '018d0005-0001-7001-8001-000000000006'),

  ('018d0033-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'Escalation — Ticket P1/Critical', 'Tự động escalate khi ticket critical chưa resolved trong 2h',
   'escalation', 'active',
   '[{"step":1,"name":"Thông báo Support Lead","delay_minutes":30,"action":"notify","target":"support_lead"},{"step":2,"name":"Escalate to Manager","delay_minutes":120,"action":"reassign","target":"support_manager"},{"step":3,"name":"Alert VP Engineering","delay_minutes":240,"action":"notify","target":"vp_engineering"}]',
   '{"entity":"ticket","condition":"priority IN (''critical'',''high'') AND status != ''resolved''"}',
   '018d0005-0001-7001-8001-000000000005'),

  ('018d0033-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'Thông báo hợp đồng sắp hết hạn', 'Gửi reminder 90/60/30 ngày trước khi hợp đồng expire',
   'notification', 'active',
   '[{"step":1,"name":"Reminder 90 ngày","days_before":90,"channel":"email","template":"contract-renewal-90d"},{"step":2,"name":"Reminder 60 ngày","days_before":60,"channel":"email","template":"contract-renewal-60d"},{"step":3,"name":"Reminder 30 ngày — Urgent","days_before":30,"channel":"email+in-app","template":"contract-renewal-30d-urgent"},{"step":4,"name":"Task cho Account Manager","days_before":30,"action":"create_task"}]',
   '{"entity":"contract","condition":"status = ''active'' AND end_date IS NOT NULL"}',
   '018d0005-0001-7001-8001-000000000006');

-- ============================================================
-- Notification Preferences (8 preferences cho admin user)
-- ============================================================
INSERT INTO notification_preferences (id, tenant_id, user_id, channel, event_type, is_enabled) VALUES
  ('018d0034-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0001-7001-8001-000000000001', 'email', 'deal.won', TRUE),
  ('018d0034-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0001-7001-8001-000000000001', 'email', 'deal.lost', TRUE),
  ('018d0034-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0001-7001-8001-000000000001', 'in-app', 'lead.assigned', TRUE),
  ('018d0034-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0001-7001-8001-000000000001', 'in-app', 'task.overdue', TRUE),
  ('018d0034-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0001-7001-8001-000000000001', 'push', 'ticket.critical', TRUE),
  ('018d0034-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0001-7001-8001-000000000001', 'email', 'contract.expiring', TRUE),
  ('018d0034-0001-7001-8001-000000000007', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0001-7001-8001-000000000001', 'sms', 'deal.won', FALSE),
  ('018d0034-0001-7001-8001-000000000008', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0001-7001-8001-000000000001', 'in-app', 'mention.negative', TRUE);

-- ============================================================
-- Webhooks (3 webhook)
-- ============================================================
INSERT INTO webhooks (id, tenant_id, name, url, events, secret, is_active, last_triggered_at, failure_count, created_by) VALUES
  ('018d0035-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Slack — Deal Won Notification',
   'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
   '["deal.won","deal.lost"]',
   'whsec_abc123def456', TRUE, '2026-03-04 16:00:00+07', 0,
   '018d0005-0001-7001-8001-000000000005'),
  ('018d0035-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Zapier — New Lead to Google Sheets',
   'https://hooks.zapier.com/hooks/catch/12345678/abcdef/',
   '["lead.created","lead.qualified"]',
   'whsec_xyz789ghi012', TRUE, '2026-03-04 14:30:00+07', 0,
   '018d0005-0001-7001-8001-000000000002'),
  ('018d0035-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'SAP Integration — Contract Sync',
   'https://sap-gateway.abc-software.vn/api/webhook/contracts',
   '["contract.created","contract.signed","contract.renewed"]',
   'whsec_sap456mno789', TRUE, '2026-03-01 08:00:00+07', 3,
   '018d0005-0001-7001-8001-000000000005');
