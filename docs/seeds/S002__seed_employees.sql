-- ============================================================
-- S002: Seed Data — Employees
-- Tương ứng employees[] trong /src/app/data/crmData.ts
-- ============================================================

-- Nhân viên (human + AI agents)
INSERT INTO employees (id, tenant_id, full_name, email, employee_type, status, department_id, position, hire_date, skills) VALUES
  -- Human employees
  ('018d0005-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Nguyễn Văn An', 'an.nguyen@company.com', 'human', 'active',
   '018d0004-0001-7001-8001-000000000001', 'Sales Executive', '2023-03-15',
   '["enterprise-deals", "top-performer"]'),

  ('018d0005-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Trần Thị Bình', 'binh.tran@company.com', 'human', 'active',
   '018d0004-0001-7001-8001-000000000002', 'Marketing Manager', '2022-08-01',
   '["content-strategy", "seo"]'),

  ('018d0005-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'Lê Hoàng Cường', 'cuong.le@company.com', 'human', 'active',
   '018d0004-0001-7001-8001-000000000001', 'Business Development', '2023-06-01',
   '["outbound", "cold-calling"]'),

  ('018d0005-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'Phạm Thị Dung', 'dung.pham@company.com', 'human', 'active',
   '018d0004-0001-7001-8001-000000000003', 'Project Manager', '2022-01-15',
   '["agile", "scrum", "delivery"]'),

  ('018d0005-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   'Vũ Minh Đức', 'duc.vu@company.com', 'human', 'active',
   '018d0004-0001-7001-8001-000000000004', 'Tech Lead', '2021-09-01',
   '["golang", "react", "architecture"]'),

  ('018d0005-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   'Hoàng Thị Giang', 'giang.hoang@company.com', 'human', 'active',
   '018d0004-0001-7001-8001-000000000001', 'Account Manager', '2023-01-10',
   '["customer-success", "renewals"]'),

  ('018d0005-0001-7001-8001-000000000007', '018d0001-0001-7001-8001-000000000001',
   'Đỗ Quang Huy', 'huy.do@company.com', 'human', 'active',
   '018d0004-0001-7001-8001-000000000005', 'AI Engineer', '2023-04-01',
   '["pytorch", "llm", "nlp"]'),

  ('018d0005-0001-7001-8001-000000000008', '018d0001-0001-7001-8001-000000000001',
   'Ngô Thị Lan', 'lan.ngo@company.com', 'human', 'active',
   '018d0004-0001-7001-8001-000000000008', 'UX Designer', '2022-11-01',
   '["figma", "ux-research", "prototyping"]'),

  ('018d0005-0001-7001-8001-000000000009', '018d0001-0001-7001-8001-000000000001',
   'Bùi Thanh Minh', 'minh.bui@company.com', 'human', 'active',
   '018d0004-0001-7001-8001-000000000006', 'QA Lead', '2022-05-15',
   '["automation-testing", "performance"]'),

  ('018d0005-0001-7001-8001-000000000010', '018d0001-0001-7001-8001-000000000001',
   'Lý Văn Nam', 'nam.ly@company.com', 'human', 'on-leave',
   '018d0004-0001-7001-8001-000000000007', 'DevOps Engineer', '2023-02-01',
   '["kubernetes", "aws", "terraform"]'),

  -- AI Agents
  ('018d0005-0001-7001-8001-000000000011', '018d0001-0001-7001-8001-000000000001',
   'AI BDR Agent — Nova', 'nova-bdr@ai.company.com', 'ai-agent', 'active',
   '018d0004-0001-7001-8001-000000000001', 'AI BDR Agent', '2024-01-01',
   '["lead-qualification", "email-outreach", "scheduling"]'),

  ('018d0005-0001-7001-8001-000000000012', '018d0001-0001-7001-8001-000000000001',
   'AI Content Agent — Muse', 'muse-content@ai.company.com', 'ai-agent', 'active',
   '018d0004-0001-7001-8001-000000000002', 'AI Content Agent', '2024-01-15',
   '["copywriting", "seo-optimization", "social-media"]'),

  ('018d0005-0001-7001-8001-000000000013', '018d0001-0001-7001-8001-000000000001',
   'AI Support Agent — Helper', 'helper-support@ai.company.com', 'ai-agent', 'active',
   '018d0004-0001-7001-8001-000000000009', 'AI Support Agent', '2024-02-01',
   '["ticket-routing", "knowledge-base", "sentiment-analysis"]');
