-- ============================================================
-- V014: Row-Level Security (RLS) Policies
-- Multi-tenant isolation cho tất cả bảng nghiệp vụ
-- YugabyteDB YSQL (PostgreSQL-compatible)
-- ============================================================

-- ============================================================
-- 1. Helper function: lấy tenant_id từ session variable
-- ============================================================
CREATE OR REPLACE FUNCTION current_tenant_id()
RETURNS UUID
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    current_setting('app.current_tenant_id', TRUE)::UUID,
    '00000000-0000-0000-0000-000000000000'::UUID
  );
$$;

CREATE OR REPLACE FUNCTION current_user_id()
RETURNS UUID
LANGUAGE sql
STABLE
AS $$
  SELECT COALESCE(
    current_setting('app.current_user_id', TRUE)::UUID,
    '00000000-0000-0000-0000-000000000000'::UUID
  );
$$;

-- ============================================================
-- 2. Enable RLS trên tất cả bảng nghiệp vụ
-- ============================================================

-- System Core
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;

-- CRM Core
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_stage_histories ENABLE ROW LEVEL SECURITY;

-- Lead & Communication
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequence_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequence_enrollments ENABLE ROW LEVEL SECURITY;

-- Task, Calendar, Product
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_prices ENABLE ROW LEVEL SECURITY;

-- Contracts & Commissions
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE contract_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_records ENABLE ROW LEVEL SECURITY;

-- Support & Vendors
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ticket_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sla_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE sla_breaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE partner_referrals ENABLE ROW LEVEL SECURITY;

-- Customer Success
ALTER TABLE customer_healths ENABLE ROW LEVEL SECURITY;
ALTER TABLE nps_feedbacks ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_segments ENABLE ROW LEVEL SECURITY;
ALTER TABLE customer_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;

-- Analytics & Territory
ALTER TABLE territories ENABLE ROW LEVEL SECURITY;
ALTER TABLE territory_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE competitive_deals ENABLE ROW LEVEL SECURITY;

-- Settings
ALTER TABLE tenant_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Marketing & Forms
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaign_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE survey_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE landing_pages ENABLE ROW LEVEL SECURITY;

-- Documents & Intelligence
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE meeting_records ENABLE ROW LEVEL SECURITY;

-- AI & Subscriptions
ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_training_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_usages ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Gamification
ALTER TABLE gamification_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE gamification_player_stats ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 3. CREATE POLICIES — Tenant Isolation
--    Mỗi bảng có 4 policies: SELECT, INSERT, UPDATE, DELETE
-- ============================================================

-- ---- Generic macro ----
-- Vì YSQL không có macro, ta tạo policy cho từng nhóm bảng

-- ============================================================
-- 3.1 Tenants table — đặc biệt (chỉ xem tenant của mình)
-- ============================================================
CREATE POLICY tenant_isolation_select ON tenants
  FOR SELECT USING (id = current_tenant_id());

CREATE POLICY tenant_isolation_update ON tenants
  FOR UPDATE USING (id = current_tenant_id());

-- ============================================================
-- 3.2 Standard Tenant-Scoped Tables
-- Áp dụng pattern: tenant_id = current_tenant_id()
-- ============================================================

-- Tạo helper DO block để generate policies hàng loạt
DO $$
DECLARE
  tbl TEXT;
  tbls TEXT[] := ARRAY[
    -- System Core
    'users', 'roles', 'user_roles', 'departments', 'employees',
    -- CRM Core
    'contacts', 'companies', 'deals', 'deal_stage_histories',
    -- Lead & Communication
    'leads', 'lead_scores', 'activities',
    'email_templates', 'email_sequences', 'email_sequence_steps', 'email_sequence_enrollments',
    -- Task, Calendar, Product
    'tasks', 'calendar_events', 'calendar_event_attendees',
    'products', 'product_prices',
    -- Contracts & Commissions
    'quotations', 'quotation_items', 'contracts', 'contract_milestones',
    'commission_plans', 'commission_records',
    -- Support & Vendors
    'support_tickets', 'ticket_comments', 'sla_policies', 'sla_breaches',
    'vendors', 'vendor_contracts', 'partners', 'partner_referrals',
    -- Customer Success
    'customer_healths', 'nps_feedbacks', 'customer_segments',
    'customer_journeys', 'goals',
    -- Analytics & Territory
    'territories', 'territory_assignments', 'forecasts',
    'competitors', 'competitive_deals',
    -- Settings
    'tenant_configs', 'custom_fields', 'automation_rules',
    'approval_workflows', 'approval_requests', 'audit_logs',
    -- Marketing & Forms
    'campaigns', 'campaign_contacts', 'forms', 'form_submissions',
    'surveys', 'survey_responses', 'landing_pages',
    -- Documents & Intelligence
    'documents', 'knowledge_articles', 'meeting_records',
    -- AI & Subscriptions
    'ai_models', 'ai_training_data', 'ai_predictions',
    'subscriptions', 'subscription_usages', 'invoices',
    -- Gamification
    'gamification_badges', 'gamification_challenges', 'gamification_player_stats'
  ];
BEGIN
  FOREACH tbl IN ARRAY tbls LOOP
    -- SELECT: chỉ xem dữ liệu của tenant mình
    EXECUTE format(
      'CREATE POLICY rls_%1$s_select ON %1$I FOR SELECT USING (tenant_id = current_tenant_id())',
      tbl
    );

    -- INSERT: chỉ insert dữ liệu cho tenant mình
    EXECUTE format(
      'CREATE POLICY rls_%1$s_insert ON %1$I FOR INSERT WITH CHECK (tenant_id = current_tenant_id())',
      tbl
    );

    -- UPDATE: chỉ update dữ liệu của tenant mình, không cho đổi tenant_id
    EXECUTE format(
      'CREATE POLICY rls_%1$s_update ON %1$I FOR UPDATE USING (tenant_id = current_tenant_id()) WITH CHECK (tenant_id = current_tenant_id())',
      tbl
    );

    -- DELETE: block physical delete (soft delete only), nhưng vẫn cần RLS
    -- Trong thực tế, app dùng UPDATE deleted_at thay vì DELETE
    EXECUTE format(
      'CREATE POLICY rls_%1$s_delete ON %1$I FOR DELETE USING (tenant_id = current_tenant_id())',
      tbl
    );
  END LOOP;
END;
$$;

-- ============================================================
-- 4. Soft Delete Filter — Chỉ xem bản ghi chưa bị xóa
-- Tạo thêm policy overlay cho các bảng chính
-- ============================================================
DO $$
DECLARE
  tbl TEXT;
  core_tbls TEXT[] := ARRAY[
    'contacts', 'deals', 'leads', 'activities', 'tasks',
    'products', 'quotations', 'contracts', 'support_tickets',
    'vendors', 'partners', 'employees', 'campaigns',
    'documents', 'subscriptions'
  ];
BEGIN
  FOREACH tbl IN ARRAY core_tbls LOOP
    -- Thêm điều kiện soft-delete vào SELECT policy
    EXECUTE format(
      'DROP POLICY IF EXISTS rls_%1$s_select ON %1$I',
      tbl
    );
    EXECUTE format(
      'CREATE POLICY rls_%1$s_select ON %1$I FOR SELECT USING (tenant_id = current_tenant_id() AND deleted_at IS NULL)',
      tbl
    );
  END LOOP;
END;
$$;

-- ============================================================
-- 5. Special Policy: Audit Logs — Chỉ đọc, không sửa/xóa
-- ============================================================
DROP POLICY IF EXISTS rls_audit_logs_update ON audit_logs;
DROP POLICY IF EXISTS rls_audit_logs_delete ON audit_logs;

CREATE POLICY rls_audit_logs_update ON audit_logs
  FOR UPDATE USING (FALSE); -- Không ai được update audit logs

CREATE POLICY rls_audit_logs_delete ON audit_logs
  FOR DELETE USING (FALSE); -- Không ai được delete audit logs

-- ============================================================
-- 6. Bypass RLS cho service accounts
-- Trong production, tạo service role riêng
-- ============================================================
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
-- ALTER DEFAULT PRIVILEGES IN SCHEMA public
--   GRANT ALL ON TABLES TO service_role;

-- Service role bypasses RLS:
-- ALTER ROLE service_role SET row_security = off;

-- ============================================================
-- 7. Hướng dẫn sử dụng trong Application Layer (Golang)
-- ============================================================
-- Trước mỗi request, set session variables:
--
--   SET LOCAL app.current_tenant_id = '018d0001-0001-7001-8001-000000000001';
--   SET LOCAL app.current_user_id = '018d0002-0001-7001-8001-000000000001';
--
-- Hoặc trong connection pool (pgxpool):
--   conn.Exec(ctx, "SET LOCAL app.current_tenant_id = $1", tenantID)
--
-- SET LOCAL tự động reset khi transaction kết thúc.
