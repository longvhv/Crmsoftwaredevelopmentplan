-- ============================================================
-- S001: Seed Data — System Core
-- Tương ứng mock data trong /src/app/data/crmData.ts
-- Tenant demo: TenantVN (công ty phần mềm outsource + product)
-- ============================================================

-- Tenant
INSERT INTO tenants (id, tenant_id, name, domain, plan, status, max_users) VALUES
  ('018d0001-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001', 'TenantVN - Công ty Phần Mềm ABC', 'abc-software.vn', 'enterprise', 'active', 100);

-- Admin user
INSERT INTO users (id, tenant_id, email, display_name, status, mfa_enabled, locale, timezone) VALUES
  ('018d0002-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001', 'admin@abc-software.vn', 'Admin Hệ Thống', 'active', TRUE, 'vi-VN', 'Asia/Ho_Chi_Minh');

-- Roles (tương ứng roles[] trong crmData.ts)
INSERT INTO roles (id, tenant_id, name, description, permissions, is_system) VALUES
  ('018d0003-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001', 'Sales Executive',       'Nhân viên kinh doanh',        '["deals:*","contacts:*","activities:*"]', FALSE),
  ('018d0003-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001', 'Business Development',  'Phát triển kinh doanh',       '["leads:*","contacts:*","deals:create"]', FALSE),
  ('018d0003-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001', 'Account Manager',       'Quản lý khách hàng',          '["contacts:*","deals:*","contracts:*"]', FALSE),
  ('018d0003-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001', 'Marketing Manager',     'Quản lý marketing',           '["campaigns:*","content:*","leads:read"]', FALSE),
  ('018d0003-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001', 'Content Creator',       'Sáng tạo nội dung',           '["content:*"]', FALSE),
  ('018d0003-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001', 'SEO Specialist',        'Chuyên gia SEO',              '["content:*","analytics:read"]', FALSE),
  ('018d0003-0001-7001-8001-000000000007', '018d0001-0001-7001-8001-000000000001', 'Project Manager',       'Quản lý dự án',               '["projects:*","activities:*"]', FALSE),
  ('018d0003-0001-7001-8001-000000000008', '018d0001-0001-7001-8001-000000000001', 'Business Analyst',      'Phân tích nghiệp vụ',         '["reports:*","analytics:*"]', FALSE),
  ('018d0003-0001-7001-8001-000000000009', '018d0001-0001-7001-8001-000000000001', 'Tech Lead',             'Trưởng nhóm kỹ thuật',        '["products:*","integrations:*"]', FALSE),
  ('018d0003-0001-7001-8001-000000000010', '018d0001-0001-7001-8001-000000000001', 'Senior Developer',      'Lập trình viên cao cấp',      '["products:read","integrations:read"]', FALSE),
  ('018d0003-0001-7001-8001-000000000011', '018d0001-0001-7001-8001-000000000001', 'AI Engineer',           'Kỹ sư AI/ML',                 '["ai:*","analytics:*"]', FALSE),
  ('018d0003-0001-7001-8001-000000000012', '018d0001-0001-7001-8001-000000000001', 'QA Lead',               'Trưởng nhóm kiểm thử',       '["products:read","reports:read"]', FALSE),
  ('018d0003-0001-7001-8001-000000000013', '018d0001-0001-7001-8001-000000000001', 'DevOps Engineer',       'Kỹ sư vận hành',              '["integrations:*","settings:*"]', FALSE),
  ('018d0003-0001-7001-8001-000000000014', '018d0001-0001-7001-8001-000000000001', 'UX Designer',           'Thiết kế trải nghiệm',        '["content:*","products:read"]', FALSE),
  ('018d0003-0001-7001-8001-000000000015', '018d0001-0001-7001-8001-000000000001', 'AI BDR Agent',          'AI agent bán hàng tự động',   '["leads:*","contacts:create","activities:create"]', TRUE),
  ('018d0003-0001-7001-8001-000000000016', '018d0001-0001-7001-8001-000000000001', 'AI Content Agent',      'AI agent tạo nội dung',       '["content:*"]', TRUE),
  ('018d0003-0001-7001-8001-000000000017', '018d0001-0001-7001-8001-000000000001', 'AI Support Agent',      'AI agent hỗ trợ khách hàng',  '["tickets:*","knowledge:read"]', TRUE);

-- Departments
INSERT INTO departments (id, tenant_id, name) VALUES
  ('018d0004-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001', 'Sales'),
  ('018d0004-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001', 'Marketing'),
  ('018d0004-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001', 'Delivery'),
  ('018d0004-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001', 'Engineering'),
  ('018d0004-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001', 'AI/ML'),
  ('018d0004-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001', 'QA'),
  ('018d0004-0001-7001-8001-000000000007', '018d0001-0001-7001-8001-000000000001', 'Infrastructure'),
  ('018d0004-0001-7001-8001-000000000008', '018d0001-0001-7001-8001-000000000001', 'Design'),
  ('018d0004-0001-7001-8001-000000000009', '018d0001-0001-7001-8001-000000000001', 'Support');
