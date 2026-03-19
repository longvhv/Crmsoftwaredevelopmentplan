-- ============================================================
-- S003: Seed Data — Contacts & Deals
-- Tương ứng contacts[] và deals[] trong /src/app/data/crmData.ts
-- ============================================================

-- Contacts (khách hàng & leads)
INSERT INTO contacts (id, tenant_id, first_name, last_name, email, phone, company, job_title, contact_type, status, source, owner_id, lead_score, lifetime_value) VALUES
  ('018d0006-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Nguyễn Thanh', 'Tùng', 'tung.nguyen@techcorp.vn', '0912345678',
   'TechCorp Vietnam', 'CTO', 'customer', 'active', 'referral',
   '018d0005-0001-7001-8001-000000000001', 85, 250000.00),

  ('018d0006-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Trần Minh', 'Hằng', 'hang.tran@financeplus.vn', '0923456789',
   'FinancePlus', 'VP Engineering', 'customer', 'active', 'website',
   '018d0005-0001-7001-8001-000000000006', 92, 180000.00),

  ('018d0006-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'Lê Phương', 'Thảo', 'thao.le@retailmax.vn', '0934567890',
   'RetailMax', 'Head of Digital', 'lead', 'active', 'event',
   '018d0005-0001-7001-8001-000000000003', 78, 0.00),

  ('018d0006-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'Phạm Quốc', 'Bảo', 'bao.pham@healthtech.vn', '0945678901',
   'HealthTech Solutions', 'CEO', 'customer', 'active', 'cold-call',
   '018d0005-0001-7001-8001-000000000001', 70, 320000.00),

  ('018d0006-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   'Võ Thị', 'Mai', 'mai.vo@edutechvn.com', '0956789012',
   'EduTech Vietnam', 'Product Director', 'lead', 'active', 'social',
   '018d0005-0001-7001-8001-000000000011', 65, 0.00),

  ('018d0006-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   'Hoàng Đức', 'Long', 'long.hoang@logisticspro.vn', '0967890123',
   'LogisticsPro', 'CIO', 'customer', 'active', 'partner',
   '018d0005-0001-7001-8001-000000000006', 88, 450000.00),

  ('018d0006-0001-7001-8001-000000000007', '018d0001-0001-7001-8001-000000000001',
   'Đặng Thùy', 'Linh', 'linh.dang@mediagroup.vn', '0978901234',
   'MediaGroup Vietnam', 'Marketing Director', 'lead', 'active', 'ad',
   '018d0005-0001-7001-8001-000000000003', 55, 0.00),

  ('018d0006-0001-7001-8001-000000000008', '018d0001-0001-7001-8001-000000000001',
   'Ngô Văn', 'Khoa', 'khoa.ngo@fintechstartup.vn', '0989012345',
   'FinTech Startup', 'Founder & CEO', 'customer', 'active', 'referral',
   '018d0005-0001-7001-8001-000000000001', 95, 150000.00),

  ('018d0006-0001-7001-8001-000000000009', '018d0001-0001-7001-8001-000000000001',
   'Phan Thị', 'Ngọc', 'ngoc.phan@insurancevn.com', '0990123456',
   'Insurance VN', 'Head of IT', 'customer', 'active', 'website',
   '018d0005-0001-7001-8001-000000000006', 72, 200000.00),

  ('018d0006-0001-7001-8001-000000000010', '018d0001-0001-7001-8001-000000000001',
   'Bùi Anh', 'Tuấn', 'tuan.bui@proptech.vn', '0901234567',
   'PropTech Vietnam', 'CTO', 'lead', 'active', 'event',
   '018d0005-0001-7001-8001-000000000011', 60, 0.00);

-- Deals (cơ hội kinh doanh)
INSERT INTO deals (id, tenant_id, name, contact_id, value, currency, stage, probability, owner_id, source, expected_close_date, pipeline) VALUES
  ('018d0007-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'TechCorp — Hệ thống quản lý kho thông minh',
   '018d0006-0001-7001-8001-000000000001', 120000.00, 'USD', 'negotiation', 75,
   '018d0005-0001-7001-8001-000000000001', 'referral', '2026-04-15', 'default'),

  ('018d0007-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'FinancePlus — Module AI fraud detection',
   '018d0006-0001-7001-8001-000000000002', 85000.00, 'USD', 'proposal', 60,
   '018d0005-0001-7001-8001-000000000006', 'website', '2026-05-01', 'default'),

  ('018d0007-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'RetailMax — Platform e-commerce B2B',
   '018d0006-0001-7001-8001-000000000003', 200000.00, 'USD', 'qualification', 30,
   '018d0005-0001-7001-8001-000000000003', 'event', '2026-06-30', 'default'),

  ('018d0007-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'HealthTech — Telemedicine platform v2',
   '018d0006-0001-7001-8001-000000000004', 180000.00, 'USD', 'negotiation', 80,
   '018d0005-0001-7001-8001-000000000001', 'cold-call', '2026-03-30', 'default'),

  ('018d0007-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   'EduTech — LMS + AI tutoring',
   '018d0006-0001-7001-8001-000000000005', 95000.00, 'USD', 'discovery', 20,
   '018d0005-0001-7001-8001-000000000003', 'social', '2026-07-15', 'default'),

  ('018d0007-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   'LogisticsPro — Supply chain optimization',
   '018d0006-0001-7001-8001-000000000006', 350000.00, 'USD', 'proposal', 65,
   '018d0005-0001-7001-8001-000000000006', 'partner', '2026-04-30', 'enterprise'),

  ('018d0007-0001-7001-8001-000000000007', '018d0001-0001-7001-8001-000000000001',
   'FinTech Startup — Lending platform MVP',
   '018d0006-0001-7001-8001-000000000008', 75000.00, 'USD', 'closed-won', 100,
   '018d0005-0001-7001-8001-000000000001', 'referral', '2026-02-28', 'default'),

  ('018d0007-0001-7001-8001-000000000008', '018d0001-0001-7001-8001-000000000001',
   'Insurance VN — Claims automation',
   '018d0006-0001-7001-8001-000000000009', 160000.00, 'USD', 'qualification', 35,
   '018d0005-0001-7001-8001-000000000006', 'website', '2026-06-15', 'default');

-- Cập nhật deal đã won
UPDATE deals SET won = TRUE, actual_close_date = '2026-02-28'
WHERE id = '018d0007-0001-7001-8001-000000000007';
