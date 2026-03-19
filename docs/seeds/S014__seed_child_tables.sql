-- ============================================================
-- S014: Seed Data — Child/Detail Tables
-- Bảng: pricing_tiers, quotation_line_items, contract_amendments,
--       ticket_messages, vendor_contracts
-- Phụ thuộc: S005 (products, quotations, contracts), S006 (tickets, vendors)
-- Migration: V004, V005, V006
-- ============================================================

-- ============================================================
-- Pricing Tiers (10 bậc giá cho 4 sản phẩm phần mềm)
-- Products:
--   001 CRM Enterprise Suite ($5,000/license)
--   002 AI Analytics Module ($3,000/license)
--   004 Cloud Hosting Standard ($500/month)
--   005 Premium Support Package ($1,500/month)
-- ============================================================
INSERT INTO pricing_tiers (id, tenant_id, product_id, tier_name, min_quantity, max_quantity, unit_price, billing_cycle) VALUES
  -- CRM Enterprise Suite: giá giảm theo số lượng license
  ('018d0085-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d000b-0001-7001-8001-000000000001', 'Individual (1-9)', 1, 9, 5000.00, 'annually'),
  ('018d0085-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d000b-0001-7001-8001-000000000001', 'Team (10-29)', 10, 29, 4500.00, 'annually'),
  ('018d0085-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d000b-0001-7001-8001-000000000001', 'Business (30-99)', 30, 99, 3800.00, 'annually'),
  ('018d0085-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   '018d000b-0001-7001-8001-000000000001', 'Enterprise (100+)', 100, NULL, 3200.00, 'annually'),

  -- AI Analytics Module
  ('018d0085-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   '018d000b-0001-7001-8001-000000000002', 'Standard (1-9)', 1, 9, 3000.00, 'annually'),
  ('018d0085-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   '018d000b-0001-7001-8001-000000000002', 'Scale (10+)', 10, NULL, 2500.00, 'annually'),

  -- Cloud Hosting
  ('018d0085-0001-7001-8001-000000000007', '018d0001-0001-7001-8001-000000000001',
   '018d000b-0001-7001-8001-000000000004', 'Monthly', 1, NULL, 500.00, 'monthly'),
  ('018d0085-0001-7001-8001-000000000008', '018d0001-0001-7001-8001-000000000001',
   '018d000b-0001-7001-8001-000000000004', 'Annual (save 20%)', 1, NULL, 400.00, 'annually'),

  -- Premium Support
  ('018d0085-0001-7001-8001-000000000009', '018d0001-0001-7001-8001-000000000001',
   '018d000b-0001-7001-8001-000000000005', 'Monthly', 1, NULL, 1500.00, 'monthly'),
  ('018d0085-0001-7001-8001-000000000010', '018d0001-0001-7001-8001-000000000001',
   '018d000b-0001-7001-8001-000000000005', 'Annual (save 15%)', 1, NULL, 1275.00, 'annually');

-- ============================================================
-- Quotation Line Items (12 dòng chi tiết cho 4 báo giá)
-- Quotations:
--   001 QUO-2026-001 TechCorp ($132,000)
--   002 QUO-2026-002 FinancePlus ($93,500)
--   003 QUO-2026-003 LogisticsPro ($385,000)
--   004 QUO-2026-004 FinTech Startup ($82,500)
-- ============================================================
INSERT INTO quotation_line_items (id, tenant_id, quotation_id, product_id, description, quantity, unit_price, discount_percent, line_total, sort_order) VALUES
  -- QUO-2026-001: TechCorp expansion
  ('018d0086-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d000c-0001-7001-8001-000000000001', '018d000b-0001-7001-8001-000000000001',
   'CRM Enterprise Suite — 20 licenses (expansion)', 20.00, 4500.00, 10.00, 81000.00, 1),
  ('018d0086-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d000c-0001-7001-8001-000000000001', '018d000b-0001-7001-8001-000000000002',
   'AI Analytics Module — 20 licenses', 20.00, 2500.00, 12.00, 44000.00, 2),

  -- QUO-2026-002: FinancePlus full suite
  ('018d0086-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d000c-0001-7001-8001-000000000002', '018d000b-0001-7001-8001-000000000001',
   'CRM Enterprise Suite — 15 licenses', 15.00, 4500.00, 5.00, 64125.00, 1),
  ('018d0086-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   '018d000c-0001-7001-8001-000000000002', '018d000b-0001-7001-8001-000000000004',
   'Cloud Hosting Standard — 12 tháng', 12.00, 500.00, 0.00, 6000.00, 2),
  ('018d0086-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   '018d000c-0001-7001-8001-000000000002', '018d000b-0001-7001-8001-000000000005',
   'Premium Support — 12 tháng', 12.00, 1500.00, 0.00, 18000.00, 3),

  -- QUO-2026-003: LogisticsPro large deal
  ('018d0086-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   '018d000c-0001-7001-8001-000000000003', '018d000b-0001-7001-8001-000000000001',
   'CRM Enterprise Suite — 50 licenses', 50.00, 3800.00, 0.00, 190000.00, 1),
  ('018d0086-0001-7001-8001-000000000007', '018d0001-0001-7001-8001-000000000001',
   '018d000c-0001-7001-8001-000000000003', '018d000b-0001-7001-8001-000000000002',
   'AI Analytics Module — 50 licenses', 50.00, 2500.00, 10.00, 112500.00, 2),
  ('018d0086-0001-7001-8001-000000000008', '018d0001-0001-7001-8001-000000000001',
   '018d000c-0001-7001-8001-000000000003', '018d000b-0001-7001-8001-000000000008',
   'API Integration Gateway — 3 instances', 3.00, 2500.00, 0.00, 7500.00, 3),
  ('018d0086-0001-7001-8001-000000000009', '018d0001-0001-7001-8001-000000000001',
   '018d000c-0001-7001-8001-000000000003', '018d000b-0001-7001-8001-000000000006',
   'Data Migration Service', 1.00, 8000.00, 0.00, 8000.00, 4),
  ('018d0086-0001-7001-8001-000000000010', '018d0001-0001-7001-8001-000000000001',
   '018d000c-0001-7001-8001-000000000003', '018d000b-0001-7001-8001-000000000007',
   'Training & Onboarding — 5 sessions', 5.00, 2000.00, 0.00, 10000.00, 5),

  -- QUO-2026-004: FinTech Startup MVP
  ('018d0086-0001-7001-8001-000000000011', '018d0001-0001-7001-8001-000000000001',
   '018d000c-0001-7001-8001-000000000004', '018d000b-0001-7001-8001-000000000003',
   'Custom Development — Lending Platform MVP (500h)', 500.00, 150.00, 0.00, 75000.00, 1),
  ('018d0086-0001-7001-8001-000000000012', '018d0001-0001-7001-8001-000000000001',
   '018d000c-0001-7001-8001-000000000004', NULL,
   'Project Management & QA overhead', 1.00, 0.00, 0.00, 0.00, 2);

-- ============================================================
-- Contract Amendments (3 bản sửa đổi hợp đồng)
-- Contracts:
--   001 CTR-2026-001 FinTech MVP
--   002 CTR-2025-008 TechCorp License
--   003 CTR-2025-012 LogisticsPro Support
-- ============================================================
INSERT INTO contract_amendments (id, tenant_id, contract_id, amendment_number, description, changes, effective_date, approved_by, status) VALUES
  ('018d0087-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d000d-0001-7001-8001-000000000001', 'AMD-2026-001-01',
   'Thêm module Payment Gateway vào scope MVP',
   '{"scope_added":"Payment Gateway Integration","hours_added":120,"value_increase":18000}',
   '2026-04-01', '018d0005-0001-7001-8001-000000000004', 'approved'),

  ('018d0087-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d000d-0001-7001-8001-000000000002', 'AMD-2025-008-01',
   'Tăng từ 30 lên 50 licenses, gia hạn thêm 6 tháng',
   '{"licenses":{"from":30,"to":50},"end_date":{"from":"2026-05-31","to":"2026-11-30"},"value_increase":40000}',
   '2026-03-01', '018d0005-0001-7001-8001-000000000006', 'pending'),

  ('018d0087-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d000d-0001-7001-8001-000000000003', 'AMD-2025-012-01',
   'Upgrade từ Standard Support lên Premium Support',
   '{"support_tier":{"from":"standard","to":"premium"},"monthly_fee":{"from":1000,"to":1500}}',
   '2026-01-01', '018d0005-0001-7001-8001-000000000006', 'approved');

-- ============================================================
-- Ticket Messages (12 tin nhắn cho 4 tickets)
-- Tickets:
--   001 TKT-2026-001 Lỗi API (assigned: Đức)
--   002 TKT-2026-002 Yêu cầu báo cáo (assigned: Dung)
--   004 TKT-2026-004 Performance chậm (assigned: Đức)
--   005 TKT-2026-005 AI chatbot sai (assigned: Huy)
-- ============================================================
INSERT INTO ticket_messages (id, tenant_id, ticket_id, sender_type, sender_id, message, attachments, is_internal) VALUES
  -- Ticket 001: Lỗi API
  ('018d0088-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d000e-0001-7001-8001-000000000001', 'customer', '018d0006-0001-7001-8001-000000000001',
   'Sau khi update v2.1, toàn bộ API calls trả về 502 Bad Gateway. Xin hỗ trợ gấp vì production đang ảnh hưởng.',
   '[]', FALSE),
  ('018d0088-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d000e-0001-7001-8001-000000000001', 'agent', '018d0005-0001-7001-8001-000000000005',
   'Xin chào anh Tùng. Tôi đã kiểm tra gateway logs, phát hiện issue với certificate rotation sau deployment. Đang hotfix ngay.',
   '[]', FALSE),
  ('018d0088-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d000e-0001-7001-8001-000000000001', 'agent', '018d0005-0001-7001-8001-000000000005',
   '[Internal] Root cause: SSL cert đã hết hạn khi deploy v2.1, auto-renewal bị disable do config change. Cần thêm monitoring alert.',
   '[]', TRUE),
  ('018d0088-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   '018d000e-0001-7001-8001-000000000001', 'agent', '018d0005-0001-7001-8001-000000000005',
   'Hotfix đã deploy. API đã hoạt động bình thường. Vui lòng xác nhận từ phía anh.',
   '[]', FALSE),

  -- Ticket 002: Yêu cầu báo cáo
  ('018d0088-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   '018d000e-0001-7001-8001-000000000002', 'customer', '018d0006-0001-7001-8001-000000000006',
   'Chúng tôi cần thêm báo cáo doanh thu theo territory và theo quý. Hiện chỉ có báo cáo tổng hợp, khó phân tích chi tiết.',
   '[]', FALSE),
  ('018d0088-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   '018d000e-0001-7001-8001-000000000002', 'agent', '018d0005-0001-7001-8001-000000000004',
   'Cảm ơn yêu cầu. Tôi đã tạo ticket nội bộ cho team phát triển. Dự kiến release trong sprint tiếp theo (2 tuần). Tôi sẽ cập nhật khi có progress.',
   '[]', FALSE),

  -- Ticket 004: Performance chậm
  ('018d0088-0001-7001-8001-000000000007', '018d0001-0001-7001-8001-000000000001',
   '018d000e-0001-7001-8001-000000000004', 'customer', '018d0006-0001-7001-8001-000000000002',
   'Dashboard Analytics load mất hơn 5 giây khi data đạt 50k records. Ảnh hưởng đến team sales daily standup.',
   '[{"name":"slow-load-screenshot.png","size":245000}]', FALSE),
  ('018d0088-0001-7001-8001-000000000008', '018d0001-0001-7001-8001-000000000001',
   '018d000e-0001-7001-8001-000000000004', 'agent', '018d0005-0001-7001-8001-000000000005',
   '[Internal] Profiling cho thấy N+1 query trên deals + contacts join. Cần refactor dùng materialized view + batch loading.',
   '[]', TRUE),
  ('018d0088-0001-7001-8001-000000000009', '018d0001-0001-7001-8001-000000000001',
   '018d000e-0001-7001-8001-000000000004', 'agent', '018d0005-0001-7001-8001-000000000005',
   'Chị Hằng, tôi đã xác định nguyên nhân là do query optimization. Đang implement caching layer, dự kiến sẽ giảm load time xuống < 1s. ETA: 3 ngày.',
   '[]', FALSE),

  -- Ticket 005: AI chatbot sai
  ('018d0088-0001-7001-8001-000000000010', '018d0001-0001-7001-8001-000000000001',
   '018d000e-0001-7001-8001-000000000005', 'customer', '018d0006-0001-7001-8001-000000000008',
   'Chatbot trả lời sai khi hỏi "Giá gói Enterprise bao nhiêu?" — nó trả về giá gói Starter thay vì Enterprise.',
   '[]', FALSE),
  ('018d0088-0001-7001-8001-000000000011', '018d0001-0001-7001-8001-000000000001',
   '018d000e-0001-7001-8001-000000000005', 'agent', '018d0005-0001-7001-8001-000000000007',
   'Cảm ơn anh đã báo. Tôi phát hiện intent classification bị nhầm giữa "pricing-starter" và "pricing-enterprise" do training data chưa đủ. Đang retrain model với thêm training phrases.',
   '[]', FALSE),
  ('018d0088-0001-7001-8001-000000000012', '018d0001-0001-7001-8001-000000000001',
   '018d000e-0001-7001-8001-000000000005', 'system', NULL,
   'AI model "chatbot-pricing-v2" đã được retrain thành công. Accuracy: 94.2% → 97.8%. Auto-deployed.',
   '[]', FALSE);

-- ============================================================
-- Vendor Contracts (4 hợp đồng nhà cung cấp)
-- Vendors:
--   001 AWS Vietnam
--   002 OpenAI
--   003 Twilio
--   004 Figma
-- ============================================================
INSERT INTO vendor_contracts (id, tenant_id, vendor_id, contract_number, name, value, currency, start_date, end_date, status) VALUES
  ('018d0089-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d000f-0001-7001-8001-000000000001', 'VND-AWS-2025-001',
   'AWS Infrastructure Services — Annual Commit', 120000.00, 'USD',
   '2025-04-01', '2026-03-31', 'active'),

  ('018d0089-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d000f-0001-7001-8001-000000000002', 'VND-OAI-2025-001',
   'OpenAI API Enterprise Plan', 48000.00, 'USD',
   '2025-06-01', '2026-05-31', 'active'),

  ('018d0089-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d000f-0001-7001-8001-000000000003', 'VND-TWI-2025-001',
   'Twilio Communication APIs — Pay-as-you-go', 0.00, 'USD',
   '2025-01-01', NULL, 'active'),

  ('018d0089-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   '018d000f-0001-7001-8001-000000000004', 'VND-FIG-2025-001',
   'Figma Organization Plan — 15 editors', 10800.00, 'USD',
   '2025-07-01', '2026-06-30', 'active');
