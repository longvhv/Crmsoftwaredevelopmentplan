-- ============================================================
-- S012: Seed Data — Email Templates, Email Sequences,
--       SMS Campaigns, Commission Tiers, Bonus Rules, Commissions
-- Phụ thuộc: S001-S003 (tenant, employees, contacts, deals)
-- Migration: V003 (email/sms), V005 (commissions)
-- ============================================================

-- Tenant: 018d0001-0001-7001-8001-000000000001
-- emp An:    018d0005-0001-7001-8001-000000000001
-- emp Bình:  018d0005-0001-7001-8001-000000000002
-- emp Cường: 018d0005-0001-7001-8001-000000000003
-- emp Giang: 018d0005-0001-7001-8001-000000000006
-- emp Nova:  018d0005-0001-7001-8001-000000000011
-- deals:    018d0007-0001-7001-8001-000000000001..008

-- ============================================================
-- Email Templates (6 mẫu email)
-- ============================================================
INSERT INTO email_templates (id, tenant_id, name, subject, body_html, category, variables, is_active, created_by) VALUES
  ('018d0070-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Welcome — Khách hàng mới',
   'Chào mừng {{contact_name}} đến với AI-CRM! 🎉',
   '<h2>Xin chào {{contact_name}}!</h2><p>Cảm ơn bạn đã tin tưởng lựa chọn AI-CRM. Đội ngũ sẵn sàng hỗ trợ bạn bắt đầu.</p><ul><li>📖 <a href="{{quickstart_url}}">Quick Start Guide</a></li><li>📞 Hotline: 1900-xxxx</li><li>💬 Live Chat 24/7</li></ul><p>Chúc bạn thành công!<br/>Đội ngũ AI-CRM</p>',
   'onboarding',
   '["contact_name","quickstart_url","company_name"]', TRUE,
   '018d0005-0001-7001-8001-000000000002'),

  ('018d0070-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Demo Follow-up',
   '{{contact_name}}, cảm ơn bạn đã tham gia demo AI-CRM!',
   '<h2>Chào {{contact_name}},</h2><p>Rất vui được giới thiệu AI-CRM cho {{company_name}} hôm nay.</p><p>Tóm tắt những gì đã demo:</p><ul><li>AI Lead Scoring — tự động chấm điểm lead</li><li>Pipeline Management — quản lý deal trực quan</li><li>AI Sales Coach — gợi ý next best action</li></ul><p>Bước tiếp theo: {{next_step}}</p>',
   'sales',
   '["contact_name","company_name","next_step","demo_date"]', TRUE,
   '018d0005-0001-7001-8001-000000000001'),

  ('018d0070-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'Deal Stalled Reminder',
   '{{deal_name}} — Bạn cần cập nhật',
   '<h2>Nhắc nhở deal stalled</h2><p>Deal <strong>{{deal_name}}</strong> ({{deal_value}}) đã không có activity trong {{days_stalled}} ngày.</p><p>Gợi ý từ AI Sales Coach:</p><ul>{{ai_suggestions}}</ul>',
   'internal',
   '["deal_name","deal_value","days_stalled","ai_suggestions","owner_name"]', TRUE,
   '018d0005-0001-7001-8001-000000000011'),

  ('018d0070-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'Hợp đồng sắp hết hạn — 30 ngày',
   '⚠️ Hợp đồng {{contract_name}} sẽ hết hạn trong 30 ngày',
   '<h2>Chào {{contact_name}},</h2><p>Hợp đồng <strong>{{contract_name}}</strong> sẽ hết hạn vào ngày {{expiry_date}}.</p><p>Chúng tôi muốn đảm bảo bạn không bị gián đoạn dịch vụ. Vui lòng liên hệ Account Manager {{am_name}} để thảo luận gia hạn.</p><p>📞 {{am_phone}} | ✉️ {{am_email}}</p>',
   'renewal',
   '["contact_name","contract_name","expiry_date","am_name","am_phone","am_email"]', TRUE,
   '018d0005-0001-7001-8001-000000000006'),

  ('018d0070-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   'NPS Survey Invitation',
   '{{contact_name}}, chúng tôi muốn nghe ý kiến của bạn!',
   '<h2>Chào {{contact_name}},</h2><p>Bạn đã sử dụng AI-CRM được {{months_active}} tháng. Chúng tôi rất muốn biết trải nghiệm của bạn.</p><p>Khảo sát chỉ mất 2 phút: <a href="{{survey_url}}">Bắt đầu khảo sát</a></p><p>Phản hồi của bạn giúp chúng tôi cải thiện sản phẩm!</p>',
   'feedback',
   '["contact_name","months_active","survey_url"]', TRUE,
   '018d0005-0001-7001-8001-000000000002'),

  ('018d0070-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   'Cold Outreach — AI-first CRM',
   '{{contact_name}}, AI đang thay đổi cách bán hàng B2B tại Việt Nam',
   '<h2>Chào {{contact_name}},</h2><p>Tôi nhận thấy {{company_name}} đang tăng trưởng ấn tượng trong lĩnh vực {{industry}}.</p><p>Nhiều công ty tương tự như {{reference_company}} đã tăng deal velocity 40% nhờ AI-CRM. Bạn có 15 phút để tìm hiểu?</p><p>— {{sender_name}}, {{sender_title}}</p>',
   'outreach',
   '["contact_name","company_name","industry","reference_company","sender_name","sender_title"]', TRUE,
   '018d0005-0001-7001-8001-000000000011');

-- ============================================================
-- Email Sequences (2 chuỗi email)
-- ============================================================
INSERT INTO email_sequences (id, tenant_id, name, description, status, trigger_event, enrolled_count, completed_count, created_by) VALUES
  ('018d0071-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'New Customer Onboarding', 'Chuỗi 5 email onboarding trong 30 ngày đầu tiên',
   'active', 'deal.won', 45, 32,
   '018d0005-0001-7001-8001-000000000006'),

  ('018d0071-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'AI BDR Cold Outreach Sequence', 'Chuỗi 4 email cold outreach tự động bởi AI BDR Nova',
   'active', 'lead.created', 320, 185,
   '018d0005-0001-7001-8001-000000000011');

-- Email Sequence Steps (9 steps cho 2 sequences)
INSERT INTO email_sequence_steps (id, tenant_id, sequence_id, step_order, template_id, delay_days, subject_override, condition) VALUES
  -- Onboarding sequence
  ('018d0072-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d0071-0001-7001-8001-000000000001', 1,
   '018d0070-0001-7001-8001-000000000001', 0, NULL, '{}'),
  ('018d0072-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d0071-0001-7001-8001-000000000001', 2,
   NULL, 3, 'Mẹo #1: Thiết lập pipeline trong 5 phút', '{}'),
  ('018d0072-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d0071-0001-7001-8001-000000000001', 3,
   NULL, 7, 'Mẹo #2: Kích hoạt AI Lead Scoring', '{}'),
  ('018d0072-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   '018d0071-0001-7001-8001-000000000001', 4,
   NULL, 14, 'Check-in tuần 2 — Bạn đang tiến bộ tốt!', '{}'),
  ('018d0072-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   '018d0071-0001-7001-8001-000000000001', 5,
   '018d0070-0001-7001-8001-000000000005', 30, NULL, '{}'),
  -- Cold Outreach sequence
  ('018d0072-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   '018d0071-0001-7001-8001-000000000002', 1,
   '018d0070-0001-7001-8001-000000000006', 0, NULL, '{}'),
  ('018d0072-0001-7001-8001-000000000007', '018d0001-0001-7001-8001-000000000001',
   '018d0071-0001-7001-8001-000000000002', 2,
   NULL, 3, 'Re: AI đang thay đổi cách bán hàng — Case study đính kèm',
   '{"condition":"not_opened_previous"}'),
  ('018d0072-0001-7001-8001-000000000008', '018d0001-0001-7001-8001-000000000001',
   '018d0071-0001-7001-8001-000000000002', 3,
   NULL, 7, '{{contact_name}}, 3 lý do team sales nên thử AI-CRM',
   '{"condition":"not_replied"}'),
  ('018d0072-0001-7001-8001-000000000009', '018d0001-0001-7001-8001-000000000001',
   '018d0071-0001-7001-8001-000000000002', 4,
   NULL, 14, 'Lần cuối: Link demo 1 phút cho {{company_name}}',
   '{"condition":"not_replied"}');

-- ============================================================
-- SMS Campaigns (3 chiến dịch SMS)
-- ============================================================
INSERT INTO sms_campaigns (id, tenant_id, name, message, status, recipient_count, delivered_count, failed_count, scheduled_at, sent_at, created_by) VALUES
  ('018d0073-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Nhắc nhở Webinar AI Sales',
   'ABC Software: Webinar "AI Sales Coach Deep Dive" bắt đầu lúc 14h hôm nay. Link tham gia: https://zoom.us/j/xxx. Reply STOP để hủy đăng ký.',
   'completed', 178, 165, 4, '2026-02-20 10:00:00+07', '2026-02-20 10:00:00+07',
   '018d0005-0001-7001-8001-000000000002'),

  ('018d0073-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Chúc mừng Tết Nguyên Đán 2026',
   'ABC Software chúc quý khách An Khang Thịnh Vượng năm Bính Ngọ! Cảm ơn bạn đã đồng hành cùng AI-CRM. ☎ 1900-xxxx',
   'completed', 450, 438, 3, '2026-01-28 08:00:00+07', '2026-01-28 08:00:00+07',
   '018d0005-0001-7001-8001-000000000002'),

  ('018d0073-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'Workshop CRM Implementation — Reminder',
   'ABC Software: Workshop "CRM Implementation Best Practices" ngày 25/03. Còn 8 slot! Đăng ký: https://abc-software.vn/workshop. Reply STOP để hủy.',
   'scheduled', 200, 0, 0, '2026-03-20 09:00:00+07', NULL,
   '018d0005-0001-7001-8001-000000000002');

-- ============================================================
-- Commission Tiers (4 bậc hoa hồng)
-- ============================================================
INSERT INTO commission_tiers (id, tenant_id, name, min_revenue, max_revenue, rate_percent, product_category, is_active) VALUES
  ('018d0074-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Tier 1 — Basic', 0.00, 200000000.00, 5.00, NULL, TRUE),
  ('018d0074-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Tier 2 — Standard', 200000000.01, 500000000.00, 7.50, NULL, TRUE),
  ('018d0074-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'Tier 3 — Premium', 500000000.01, 1000000000.00, 10.00, NULL, TRUE),
  ('018d0074-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'Tier 4 — Elite', 1000000000.01, NULL, 12.50, NULL, TRUE);

-- Bonus Rules (3 quy tắc thưởng)
INSERT INTO bonus_rules (id, tenant_id, name, description, condition, bonus_type, bonus_value, is_active) VALUES
  ('018d0075-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Accelerator — 120% Quota', 'Thưởng thêm 2x khi đạt > 120% quota quý',
   '{"type":"quota_attainment","operator":"gte","value":120}',
   'multiplier', 2.00, TRUE),
  ('018d0075-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'New Logo Bonus', 'Thưởng 5M₫ cho mỗi khách hàng hoàn toàn mới (new logo)',
   '{"type":"new_logo","operator":"equals","value":true}',
   'fixed', 5000000.00, TRUE),
  ('018d0075-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'Multi-year Deal Bonus', 'Thưởng thêm 20% commission cho hợp đồng >= 2 năm',
   '{"type":"contract_duration_years","operator":"gte","value":2}',
   'percentage', 20.00, TRUE);

-- Sales Rep Commissions (6 bản ghi commission)
INSERT INTO sales_rep_commissions (id, tenant_id, employee_id, deal_id, period, base_amount, bonus_amount, total_amount, currency, status, tier_id) VALUES
  ('018d0076-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d0005-0001-7001-8001-000000000001',
   '018d0007-0001-7001-8001-000000000001',
   '2025-Q4', 18000000.00, 5000000.00, 23000000.00, 'VND', 'paid',
   '018d0074-0001-7001-8001-000000000001'),

  ('018d0076-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d0005-0001-7001-8001-000000000001',
   '018d0007-0001-7001-8001-000000000002',
   '2026-Q1', 39000000.00, 10000000.00, 49000000.00, 'VND', 'approved',
   '018d0074-0001-7001-8001-000000000002'),

  ('018d0076-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d0005-0001-7001-8001-000000000003',
   '018d0007-0001-7001-8001-000000000003',
   '2026-Q1', 5625000.00, 5000000.00, 10625000.00, 'VND', 'approved',
   '018d0074-0001-7001-8001-000000000001'),

  ('018d0076-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   '018d0005-0001-7001-8001-000000000006',
   NULL,
   '2025-Q4', 24250000.00, 0.00, 24250000.00, 'VND', 'paid',
   '018d0074-0001-7001-8001-000000000002'),

  ('018d0076-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   '018d0005-0001-7001-8001-000000000006',
   NULL,
   '2026-Q1', 26000000.00, 0.00, 26000000.00, 'VND', 'pending',
   '018d0074-0001-7001-8001-000000000002'),

  ('018d0076-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   '018d0005-0001-7001-8001-000000000001',
   NULL,
   '2025-Q4', 0.00, 50000000.00, 50000000.00, 'VND', 'paid',
   '018d0074-0001-7001-8001-000000000004');

-- Commission Bonuses (3 bonuses liên kết)
INSERT INTO commission_bonuses (id, tenant_id, commission_id, rule_id, amount) VALUES
  ('018d0077-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d0076-0001-7001-8001-000000000001', '018d0075-0001-7001-8001-000000000002', 5000000.00),
  ('018d0077-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d0076-0001-7001-8001-000000000002', '018d0075-0001-7001-8001-000000000002', 5000000.00),
  ('018d0077-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d0076-0001-7001-8001-000000000003', '018d0075-0001-7001-8001-000000000002', 5000000.00);
