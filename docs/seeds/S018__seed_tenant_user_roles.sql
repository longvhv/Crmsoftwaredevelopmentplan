-- ============================================================
-- S018: Seed Data — Tenant User Roles
-- Liên kết users với roles trong multi-tenant context
-- Phụ thuộc: S001 (tenants, users), S002 (employees)
-- ============================================================

-- Giả định có bảng tenant_user_roles (N-N: users <-> roles <-> tenants)
-- Schema: id, tenant_id, user_id, role_id, is_primary, version, timestamps

-- ============================================================
-- TENANT 1: ABC Software - Employee Role Assignments
-- Link employees với các roles cụ thể
-- ============================================================

-- Admin user - Super Admin role
INSERT INTO tenant_user_roles (id, tenant_id, user_id, role_id, is_primary, granted_by, granted_at) VALUES
  ('018d0021-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0001-7001-8001-000000000001', -- Admin user
   '018d0003-0001-7001-8001-000000000001', -- Sales Executive role (for demo)
   TRUE, '018d0002-0001-7001-8001-000000000001', NOW());

-- Sales team members (từ S002 employees)
-- Nguyễn Văn An - Sales Executive (primary) + Account Manager (secondary)
INSERT INTO tenant_user_roles (id, tenant_id, user_id, role_id, is_primary, granted_by, granted_at) VALUES
  ('018d0021-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000001', -- User liên kết với employee An
   '018d0003-0001-7001-8001-000000000001', -- Sales Executive
   TRUE, '018d0002-0001-7001-8001-000000000001', NOW()),

  ('018d0021-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000001',
   '018d0003-0001-7001-8001-000000000003', -- Account Manager (secondary)
   FALSE, '018d0002-0001-7001-8001-000000000001', NOW());

-- Trần Thị Bích - Business Development
INSERT INTO tenant_user_roles (id, tenant_id, user_id, role_id, is_primary, granted_by, granted_at) VALUES
  ('018d0021-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000002',
   '018d0003-0001-7001-8001-000000000002', -- Business Development
   TRUE, '018d0002-0001-7001-8001-000000000001', NOW());

-- Lê Hoàng Cường - Account Manager
INSERT INTO tenant_user_roles (id, tenant_id, user_id, role_id, is_primary, granted_by, granted_at) VALUES
  ('018d0021-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000003',
   '018d0003-0001-7001-8001-000000000003', -- Account Manager
   TRUE, '018d0002-0001-7001-8001-000000000001', NOW());

-- Marketing team
-- Phạm Minh Đức - Marketing Manager
INSERT INTO tenant_user_roles (id, tenant_id, user_id, role_id, is_primary, granted_by, granted_at) VALUES
  ('018d0021-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000004',
   '018d0003-0001-7001-8001-000000000004', -- Marketing Manager
   TRUE, '018d0002-0001-7001-8001-000000000001', NOW());

-- Võ Thị Ngọc - Content Creator
INSERT INTO tenant_user_roles (id, tenant_id, user_id, role_id, is_primary, granted_by, granted_at) VALUES
  ('018d0021-0001-7001-8001-000000000007', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000005',
   '018d0003-0001-7001-8001-000000000005', -- Content Creator
   TRUE, '018d0002-0001-7001-8001-000000000001', NOW());

-- Hoàng Đức Thắng - SEO Specialist
INSERT INTO tenant_user_roles (id, tenant_id, user_id, role_id, is_primary, granted_by, granted_at) VALUES
  ('018d0021-0001-7001-8001-000000000008', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000006',
   '018d0003-0001-7001-8001-000000000006', -- SEO Specialist
   TRUE, '018d0002-0001-7001-8001-000000000001', NOW());

-- Delivery team
-- Đặng Văn Hùng - Project Manager
INSERT INTO tenant_user_roles (id, tenant_id, user_id, role_id, is_primary, granted_by, granted_at) VALUES
  ('018d0021-0001-7001-8001-000000000009', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000007',
   '018d0003-0001-7001-8001-000000000007', -- Project Manager
   TRUE, '018d0002-0001-7001-8001-000000000001', NOW());

-- Nguyễn Thị Lan - Business Analyst
INSERT INTO tenant_user_roles (id, tenant_id, user_id, role_id, is_primary, granted_by, granted_at) VALUES
  ('018d0021-0001-7001-8001-000000000010', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000008',
   '018d0003-0001-7001-8001-000000000008', -- Business Analyst
   TRUE, '018d0002-0001-7001-8001-000000000001', NOW());

-- Engineering team
-- Trần Quang Minh - Tech Lead
INSERT INTO tenant_user_roles (id, tenant_id, user_id, role_id, is_primary, granted_by, granted_at) VALUES
  ('018d0021-0001-7001-8001-000000000011', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000009',
   '018d0003-0001-7001-8001-000000000009', -- Tech Lead
   TRUE, '018d0002-0001-7001-8001-000000000001', NOW());

-- Lê Thị Hương - Senior Developer
INSERT INTO tenant_user_roles (id, tenant_id, user_id, role_id, is_primary, granted_by, granted_at) VALUES
  ('018d0021-0001-7001-8001-000000000012', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000010',
   '018d0003-0001-7001-8001-000000000010', -- Senior Developer
   TRUE, '018d0002-0001-7001-8001-000000000001', NOW());

-- AI/ML team
-- Phạm Tuấn Anh - AI Engineer
INSERT INTO tenant_user_roles (id, tenant_id, user_id, role_id, is_primary, granted_by, granted_at) VALUES
  ('018d0021-0001-7001-8001-000000000013', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000011',
   '018d0003-0001-7001-8001-000000000011', -- AI Engineer
   TRUE, '018d0002-0001-7001-8001-000000000001', NOW());

-- QA team
-- Ngô Văn Tú - QA Lead
INSERT INTO tenant_user_roles (id, tenant_id, user_id, role_id, is_primary, granted_by, granted_at) VALUES
  ('018d0021-0001-7001-8001-000000000014', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000012',
   '018d0003-0001-7001-8001-000000000012', -- QA Lead
   TRUE, '018d0002-0001-7001-8001-000000000001', NOW());

-- Infrastructure team
-- Vũ Đức Nam - DevOps Engineer
INSERT INTO tenant_user_roles (id, tenant_id, user_id, role_id, is_primary, granted_by, granted_at) VALUES
  ('018d0021-0001-7001-8001-000000000015', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000013',
   '018d0003-0001-7001-8001-000000000013', -- DevOps Engineer
   TRUE, '018d0002-0001-7001-8001-000000000001', NOW());

-- Design team
-- Bùi Thị Mai - UX Designer
INSERT INTO tenant_user_roles (id, tenant_id, user_id, role_id, is_primary, granted_by, granted_at) VALUES
  ('018d0021-0001-7001-8001-000000000016', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000014',
   '018d0003-0001-7001-8001-000000000014', -- UX Designer
   TRUE, '018d0002-0001-7001-8001-000000000001', NOW());

-- AI Agents - Special roles
-- BDR Agent - AI BDR Agent role
INSERT INTO tenant_user_roles (id, tenant_id, user_id, role_id, is_primary, granted_by, granted_at) VALUES
  ('018d0021-0001-7001-8001-000000000017', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000015', -- AI BDR user
   '018d0003-0001-7001-8001-000000000015', -- AI BDR Agent role
   TRUE, '018d0002-0001-7001-8001-000000000001', NOW());

-- ContentBot - AI Content Agent role
INSERT INTO tenant_user_roles (id, tenant_id, user_id, role_id, is_primary, granted_by, granted_at) VALUES
  ('018d0021-0001-7001-8001-000000000018', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000016',
   '018d0003-0001-7001-8001-000000000016', -- AI Content Agent role
   TRUE, '018d0002-0001-7001-8001-000000000001', NOW());

-- SupportAI - AI Support Agent role
INSERT INTO tenant_user_roles (id, tenant_id, user_id, role_id, is_primary, granted_by, granted_at) VALUES
  ('018d0021-0001-7001-8001-000000000019', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000017',
   '018d0003-0001-7001-8001-000000000017', -- AI Support Agent role
   TRUE, '018d0002-0001-7001-8001-000000000001', NOW());


-- ============================================================
-- SUMMARY
-- ============================================================
-- Total role assignments: 19
--   - Tenant 1 (ABC Software): 19 user-role mappings
--   - Covers: Sales (3), Marketing (3), Delivery (2), Engineering (2),
--             AI/ML (1), QA (1), Infra (1), Design (1), AI Agents (3)
--   - 1 secondary role (Account Manager for Sales Executive)
-- ============================================================
