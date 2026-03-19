-- ============================================================
-- S006: Seed Data — Support Tickets, Vendors, Partners, NPS
-- Tương ứng ticketData.ts, vendorData.ts, partnerData.ts, npsData.ts
-- ============================================================

-- Support Tickets
INSERT INTO support_tickets (id, tenant_id, ticket_number, subject, description, contact_id, assigned_to, status, priority, category, channel) VALUES
  ('018d000e-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'TKT-2026-001', 'Lỗi kết nối API sau cập nhật', 'API gateway trả về 502 sau khi deploy v2.1',
   '018d0006-0001-7001-8001-000000000001', '018d0005-0001-7001-8001-000000000005',
   'in-progress', 'high', 'Technical', 'email'),

  ('018d000e-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'TKT-2026-002', 'Yêu cầu bổ sung báo cáo tùy chỉnh', 'Cần thêm báo cáo revenue theo territory',
   '018d0006-0001-7001-8001-000000000006', '018d0005-0001-7001-8001-000000000004',
   'open', 'medium', 'Feature Request', 'portal'),

  ('018d000e-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'TKT-2026-003', 'Hướng dẫn import dữ liệu từ Salesforce', 'Cần hỗ trợ import contacts & deals',
   '018d0006-0001-7001-8001-000000000009', '018d0005-0001-7001-8001-000000000013',
   'resolved', 'low', 'Data Migration', 'chat'),

  ('018d000e-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'TKT-2026-004', 'Performance chậm module Analytics', 'Dashboard analytics load > 5s khi data lớn',
   '018d0006-0001-7001-8001-000000000002', '018d0005-0001-7001-8001-000000000005',
   'in-progress', 'critical', 'Performance', 'email'),

  ('018d000e-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   'TKT-2026-005', 'AI chatbot trả lời sai ngữ cảnh', 'Chatbot không hiểu câu hỏi về pricing',
   '018d0006-0001-7001-8001-000000000008', '018d0005-0001-7001-8001-000000000007',
   'open', 'medium', 'AI/ML', 'portal');

-- Vendors
INSERT INTO vendors (id, tenant_id, name, contact_email, website, category, status, rating, payment_terms) VALUES
  ('018d000f-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'AWS Vietnam', 'enterprise@aws.amazon.com', 'https://aws.amazon.com',
   'Cloud Infrastructure', 'active', 5, 'Net 30'),

  ('018d000f-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'OpenAI', 'sales@openai.com', 'https://openai.com',
   'AI/ML Services', 'active', 5, 'Monthly'),

  ('018d000f-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'Twilio', 'sales@twilio.com', 'https://twilio.com',
   'Communication', 'active', 4, 'Pay-as-you-go'),

  ('018d000f-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'Figma', 'sales@figma.com', 'https://figma.com',
   'Design Tools', 'active', 5, 'Annual');

-- Partners
INSERT INTO partners (id, tenant_id, name, partner_type, status, tier, contact_name, contact_email, commission_rate, total_referrals, total_revenue) VALUES
  ('018d0010-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Savvycom Technology', 'technology', 'active', 'gold',
   'Nguyễn Minh', 'minh@savvycom.vn', 15.00, 12, 450000.00),

  ('018d0010-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'CMC Global', 'strategic', 'active', 'platinum',
   'Trần Đức', 'duc@cmcglobal.vn', 20.00, 25, 1200000.00),

  ('018d0010-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'TMA Solutions', 'reseller', 'active', 'silver',
   'Lê Hải', 'hai@tmasolutions.vn', 10.00, 8, 180000.00),

  ('018d0010-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'VNG Corporation', 'referral', 'active', 'gold',
   'Phạm Tú', 'tu@vng.com.vn', 12.00, 15, 350000.00);

-- NPS Feedbacks
INSERT INTO nps_feedbacks (id, tenant_id, contact_id, score, comment, survey_source) VALUES
  ('018d0011-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d0006-0001-7001-8001-000000000001', 9,
   'Hệ thống CRM rất ổn định, team support phản hồi nhanh', 'quarterly-survey'),

  ('018d0011-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d0006-0001-7001-8001-000000000002', 8,
   'Module AI analytics rất hữu ích, mong có thêm custom reports', 'quarterly-survey'),

  ('018d0011-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d0006-0001-7001-8001-000000000006', 10,
   'Tuyệt vời! Supply chain optimization giảm 25% chi phí logistics', 'quarterly-survey'),

  ('018d0011-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   '018d0006-0001-7001-8001-000000000008', 7,
   'MVP lending platform hoạt động tốt, cần cải thiện UX mobile', 'post-project'),

  ('018d0011-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   '018d0006-0001-7001-8001-000000000009', 6,
   'Data migration mất nhiều thời gian hơn dự kiến', 'post-project'),

  ('018d0011-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   '018d0006-0001-7001-8001-000000000004', 9,
   'Telemedicine platform hoạt động xuất sắc, bệnh nhân rất hài lòng', 'quarterly-survey');

-- Customer Health
INSERT INTO customer_healths (id, tenant_id, contact_id, overall_score, health_status, csm_id, arr, usage_score, support_score, engagement_score) VALUES
  ('018d0012-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d0006-0001-7001-8001-000000000001', 85, 'healthy',
   '018d0005-0001-7001-8001-000000000006', 60000.00, 90, 85, 80),

  ('018d0012-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d0006-0001-7001-8001-000000000002', 78, 'healthy',
   '018d0005-0001-7001-8001-000000000006', 45000.00, 75, 80, 78),

  ('018d0012-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d0006-0001-7001-8001-000000000006', 92, 'healthy',
   '018d0005-0001-7001-8001-000000000006', 18000.00, 95, 90, 92),

  ('018d0012-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   '018d0006-0001-7001-8001-000000000009', 45, 'at-risk',
   '018d0005-0001-7001-8001-000000000006', 0.00, 40, 50, 45);
