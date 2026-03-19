-- ============================================================
-- S017: Seed Data — Deal Stages
-- Định nghĩa stages chuẩn cho sales pipelines
-- Phụ thuộc: S001 (tenants), V015 (deal_stages table)
-- ============================================================

-- ============================================================
-- PIPELINE: Default (Standard B2B SaaS Sales)
-- 6 stages chuẩn từ qualification đến closed
-- ============================================================

INSERT INTO deal_stages (id, tenant_id, pipeline, name, display_order, probability, is_closed, is_won, color, description) VALUES
  -- Stage 1: Qualification (Sàng lọc ban đầu)
  ('018d0020-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'default', 'Qualification', 0, 10, FALSE, FALSE, '#94a3b8',
   'Xác minh lead có nhu cầu thực sự, ngân sách và quyền quyết định'),

  -- Stage 2: Discovery (Khám phá nhu cầu)
  ('018d0020-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'default', 'Discovery', 1, 25, FALSE, FALSE, '#60a5fa',
   'Hiểu sâu pain points, yêu cầu kỹ thuật, quy trình hiện tại'),

  -- Stage 3: Proposal (Trình phương án)
  ('018d0020-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'default', 'Proposal', 2, 50, FALSE, FALSE, '#a78bfa',
   'Gửi proposal, demo sản phẩm, thương thảo scope & giá'),

  -- Stage 4: Negotiation (Đàm phán)
  ('018d0020-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'default', 'Negotiation', 3, 75, FALSE, FALSE, '#fb923c',
   'Đàm phán hợp đồng, điều khoản, pricing, timeline'),

  -- Stage 5: Closed Won (Thắng)
  ('018d0020-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   'default', 'Closed Won', 4, 100, TRUE, TRUE, '#22c55e',
   'Deal ký hợp đồng thành công, chuyển sang onboarding'),

  -- Stage 6: Closed Lost (Thua)
  ('018d0020-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   'default', 'Closed Lost', 5, 0, TRUE, FALSE, '#ef4444',
   'Deal không thành công, ghi nhận lý do để học hỏi');


-- ============================================================
-- PIPELINE: Enterprise (Chu kỳ bán hàng dài cho khách hàng lớn)
-- 8 stages chi tiết hơn, thêm POC & Legal Review
-- ============================================================

INSERT INTO deal_stages (id, tenant_id, pipeline, name, display_order, probability, is_closed, is_won, color, description) VALUES
  -- Enterprise Stage 1: Initial Contact
  ('018d0020-0001-7001-8001-000000000011', '018d0001-0001-7001-8001-000000000001',
   'enterprise', 'Initial Contact', 0, 5, FALSE, FALSE, '#cbd5e1',
   'Tiếp cận đầu tiên với enterprise account, xác định stakeholders'),

  -- Enterprise Stage 2: Qualification
  ('018d0020-0001-7001-8001-000000000012', '018d0001-0001-7001-8001-000000000001',
   'enterprise', 'Qualification', 1, 15, FALSE, FALSE, '#94a3b8',
   'Xác minh BANT (Budget, Authority, Need, Timeline), executive buy-in'),

  -- Enterprise Stage 3: Discovery
  ('018d0020-0001-7001-8001-000000000013', '018d0001-0001-7001-8001-000000000001',
   'enterprise', 'Discovery', 2, 30, FALSE, FALSE, '#60a5fa',
   'Discovery workshops với multiple stakeholders, requirements gathering'),

  -- Enterprise Stage 4: Technical Evaluation / POC
  ('018d0020-0001-7001-8001-000000000014', '018d0001-0001-7001-8001-000000000001',
   'enterprise', 'Technical Evaluation', 3, 45, FALSE, FALSE, '#8b5cf6',
   'Proof of Concept, technical deep dive, security review, integration tests'),

  -- Enterprise Stage 5: Proposal
  ('018d0020-0001-7001-8001-000000000015', '018d0001-0001-7001-8001-000000000001',
   'enterprise', 'Proposal', 4, 60, FALSE, FALSE, '#a78bfa',
   'RFP response, formal proposal, business case presentation'),

  -- Enterprise Stage 6: Negotiation
  ('018d0020-0001-7001-8001-000000000016', '018d0001-0001-7001-8001-000000000001',
   'enterprise', 'Negotiation', 5, 75, FALSE, FALSE, '#fb923c',
   'Commercial negotiation, SLA discussions, pricing finalization'),

  -- Enterprise Stage 7: Legal Review
  ('018d0020-0001-7001-8001-000000000017', '018d0001-0001-7001-8001-000000000001',
   'enterprise', 'Legal Review', 6, 90, FALSE, FALSE, '#fbbf24',
   'Legal, compliance, procurement review, contract redlining'),

  -- Enterprise Stage 8: Closed Won
  ('018d0020-0001-7001-8001-000000000018', '018d0001-0001-7001-8001-000000000001',
   'enterprise', 'Closed Won', 7, 100, TRUE, TRUE, '#22c55e',
   'Contract signed, PO issued, handoff to implementation team'),

  -- Enterprise Stage 9: Closed Lost
  ('018d0020-0001-7001-8001-000000000019', '018d0001-0001-7001-8001-000000000001',
   'enterprise', 'Closed Lost', 8, 0, TRUE, FALSE, '#ef4444',
   'Deal lost, competitor won, or project cancelled');


-- ============================================================
-- PIPELINE: SMB (Small & Medium Business - Chu kỳ ngắn)
-- 4 stages đơn giản, nhanh gọn
-- ============================================================

INSERT INTO deal_stages (id, tenant_id, pipeline, name, display_order, probability, is_closed, is_won, color, description) VALUES
  -- SMB Stage 1: Lead Qualified
  ('018d0020-0001-7001-8001-000000000021', '018d0001-0001-7001-8001-000000000001',
   'smb', 'Lead Qualified', 0, 20, FALSE, FALSE, '#94a3b8',
   'Lead đã qualify (có budget, timeline rõ ràng)'),

  -- SMB Stage 2: Demo Scheduled
  ('018d0020-0001-7001-8001-000000000022', '018d0001-0001-7001-8001-000000000001',
   'smb', 'Demo Scheduled', 1, 50, FALSE, FALSE, '#60a5fa',
   'Demo/trial đã book, prospect engaged'),

  -- SMB Stage 3: Proposal Sent
  ('018d0020-0001-7001-8001-000000000023', '018d0001-0001-7001-8001-000000000001',
   'smb', 'Proposal Sent', 2, 70, FALSE, FALSE, '#a78bfa',
   'Đã gửi quote/proposal, chờ feedback'),

  -- SMB Stage 4: Closed Won
  ('018d0020-0001-7001-8001-000000000024', '018d0001-0001-7001-8001-000000000001',
   'smb', 'Closed Won', 3, 100, TRUE, TRUE, '#22c55e',
   'Deal won, payment received hoặc contract signed'),

  -- SMB Stage 5: Closed Lost
  ('018d0020-0001-7001-8001-000000000025', '018d0001-0001-7001-8001-000000000001',
   'smb', 'Closed Lost', 4, 0, TRUE, FALSE, '#ef4444',
   'Not interested, budget issue, hoặc chọn competitor');


-- ============================================================
-- TENANT 2: FinTech Startup (Demo tenant khác)
-- Default pipeline cho tenant thứ 2
-- ============================================================

INSERT INTO deal_stages (id, tenant_id, pipeline, name, display_order, probability, is_closed, is_won, color, description) VALUES
  ('018d0020-0002-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000002',
   'default', 'Qualification', 0, 10, FALSE, FALSE, '#94a3b8', 'Qualification stage'),

  ('018d0020-0002-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000002',
   'default', 'Discovery', 1, 25, FALSE, FALSE, '#60a5fa', 'Discovery stage'),

  ('018d0020-0002-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000002',
   'default', 'Proposal', 2, 50, FALSE, FALSE, '#a78bfa', 'Proposal stage'),

  ('018d0020-0002-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000002',
   'default', 'Negotiation', 3, 75, FALSE, FALSE, '#fb923c', 'Negotiation stage'),

  ('018d0020-0002-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000002',
   'default', 'Closed Won', 4, 100, TRUE, TRUE, '#22c55e', 'Deal won'),

  ('018d0020-0002-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000002',
   'default', 'Closed Lost', 5, 0, TRUE, FALSE, '#ef4444', 'Deal lost');


-- ============================================================
-- TENANT 3: E-commerce Platform (Demo tenant 3)
-- Default pipeline
-- ============================================================

INSERT INTO deal_stages (id, tenant_id, pipeline, name, display_order, probability, is_closed, is_won, color, description) VALUES
  ('018d0020-0003-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000003',
   'default', 'Qualification', 0, 10, FALSE, FALSE, '#94a3b8', 'Qualification stage'),

  ('018d0020-0003-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000003',
   'default', 'Discovery', 1, 25, FALSE, FALSE, '#60a5fa', 'Discovery stage'),

  ('018d0020-0003-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000003',
   'default', 'Proposal', 2, 50, FALSE, FALSE, '#a78bfa', 'Proposal stage'),

  ('018d0020-0003-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000003',
   'default', 'Negotiation', 3, 75, FALSE, FALSE, '#fb923c', 'Negotiation stage'),

  ('018d0020-0003-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000003',
   'default', 'Closed Won', 4, 100, TRUE, TRUE, '#22c55e', 'Deal won'),

  ('018d0020-0003-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000003',
   'default', 'Closed Lost', 5, 0, TRUE, FALSE, '#ef4444', 'Deal lost');


-- ============================================================
-- SUMMARY
-- ============================================================
-- Total stages inserted: 29
--   - Tenant 1 (ABC Software): 19 stages (3 pipelines: default, enterprise, smb)
--   - Tenant 2 (FinTech): 6 stages (default)
--   - Tenant 3 (E-commerce): 6 stages (default)
--
-- Pipelines coverage:
--   - default: 6 stages (standard B2B)
--   - enterprise: 9 stages (complex, long sales cycle)
--   - smb: 5 stages (fast, simple)
-- ============================================================
