-- ============================================================
-- S005: Seed Data — Products, Quotations, Contracts
-- Tương ứng productData.ts, quotationData.ts, contractData.ts
-- ============================================================

-- Products
INSERT INTO products (id, tenant_id, name, sku, description, category, base_price, currency, unit, status) VALUES
  ('018d000b-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'CRM Enterprise Suite', 'CRM-ENT-001', 'Giải pháp CRM toàn diện cho doanh nghiệp',
   'Software', 5000.00, 'USD', 'license', 'active'),

  ('018d000b-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'AI Analytics Module', 'AI-ANA-001', 'Module phân tích dữ liệu với AI/ML',
   'AI/ML', 3000.00, 'USD', 'license', 'active'),

  ('018d000b-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'Custom Development', 'DEV-CUS-001', 'Dịch vụ phát triển phần mềm theo yêu cầu',
   'Service', 150.00, 'USD', 'hour', 'active'),

  ('018d000b-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'Cloud Hosting — Standard', 'CLD-STD-001', 'Hosting cloud cho hệ thống <= 100 users',
   'Infrastructure', 500.00, 'USD', 'month', 'active'),

  ('018d000b-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   'Premium Support Package', 'SUP-PRE-001', 'Hỗ trợ ưu tiên 24/7 với SLA 2 giờ',
   'Support', 1500.00, 'USD', 'month', 'active'),

  ('018d000b-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   'Data Migration Service', 'MIG-DAT-001', 'Dịch vụ di chuyển dữ liệu từ hệ thống cũ',
   'Service', 8000.00, 'USD', 'project', 'active'),

  ('018d000b-0001-7001-8001-000000000007', '018d0001-0001-7001-8001-000000000001',
   'Training & Onboarding', 'TRN-ONB-001', 'Đào tạo sử dụng hệ thống cho nhân viên',
   'Service', 2000.00, 'USD', 'session', 'active'),

  ('018d000b-0001-7001-8001-000000000008', '018d0001-0001-7001-8001-000000000001',
   'API Integration Gateway', 'INT-API-001', 'Gateway tích hợp API cho hệ thống bên thứ 3',
   'Software', 2500.00, 'USD', 'license', 'active');

-- Quotations
INSERT INTO quotations (id, tenant_id, quote_number, contact_id, deal_id, owner_id, status, subtotal, discount_amount, tax_amount, total, currency, valid_until) VALUES
  ('018d000c-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'QUO-2026-001', '018d0006-0001-7001-8001-000000000001', '018d0007-0001-7001-8001-000000000001',
   '018d0005-0001-7001-8001-000000000001', 'sent',
   125000.00, 5000.00, 12000.00, 132000.00, 'USD', '2026-04-15'),

  ('018d000c-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'QUO-2026-002', '018d0006-0001-7001-8001-000000000002', '018d0007-0001-7001-8001-000000000002',
   '018d0005-0001-7001-8001-000000000006', 'viewed',
   88000.00, 3000.00, 8500.00, 93500.00, 'USD', '2026-05-01'),

  ('018d000c-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'QUO-2026-003', '018d0006-0001-7001-8001-000000000006', '018d0007-0001-7001-8001-000000000006',
   '018d0005-0001-7001-8001-000000000006', 'draft',
   360000.00, 10000.00, 35000.00, 385000.00, 'USD', '2026-04-30'),

  ('018d000c-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'QUO-2026-004', '018d0006-0001-7001-8001-000000000008', '018d0007-0001-7001-8001-000000000007',
   '018d0005-0001-7001-8001-000000000001', 'accepted',
   75000.00, 0.00, 7500.00, 82500.00, 'USD', '2026-02-28');

-- Contracts
INSERT INTO contracts (id, tenant_id, contract_number, name, contact_id, deal_id, owner_id, status, contract_type, value, currency, start_date, end_date, auto_renew, payment_terms) VALUES
  ('018d000d-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'CTR-2026-001', 'FinTech Startup — Lending Platform MVP',
   '018d0006-0001-7001-8001-000000000008', '018d0007-0001-7001-8001-000000000007',
   '018d0005-0001-7001-8001-000000000001', 'active', 'fixed-price',
   82500.00, 'USD', '2026-03-01', '2026-08-31', FALSE, 'Net 30'),

  ('018d000d-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'CTR-2025-008', 'TechCorp — CRM License Annual',
   '018d0006-0001-7001-8001-000000000001', NULL,
   '018d0005-0001-7001-8001-000000000001', 'active', 'subscription',
   60000.00, 'USD', '2025-06-01', '2026-05-31', TRUE, 'Annual'),

  ('018d000d-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'CTR-2025-012', 'LogisticsPro — Premium Support',
   '018d0006-0001-7001-8001-000000000006', NULL,
   '018d0005-0001-7001-8001-000000000006', 'active', 'subscription',
   18000.00, 'USD', '2025-09-01', '2026-08-31', TRUE, 'Monthly'),

  ('018d000d-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'CTR-2025-015', 'Insurance VN — Data Migration',
   '018d0006-0001-7001-8001-000000000009', NULL,
   '018d0005-0001-7001-8001-000000000006', 'expired', 'fixed-price',
   45000.00, 'USD', '2025-03-01', '2025-12-31', FALSE, 'Net 45');
