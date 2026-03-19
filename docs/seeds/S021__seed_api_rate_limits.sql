-- ============================================================
-- S021: Seed Data — API Rate Limits
-- Cấu hình rate limiting cho API endpoints theo tenant & plan
-- Phụ thuộc: S001 (tenants, users)
-- ============================================================

-- Giả định api_rate_limits schema:
-- id, tenant_id, resource_type, plan_tier, requests_per_minute,
-- requests_per_hour, requests_per_day, burst_limit, is_active

-- ============================================================
-- GLOBAL RATE LIMITS (tenant_id NULL = áp dụng mọi tenant)
-- ============================================================

-- 1. Authentication endpoints (strict limits)
INSERT INTO api_rate_limits (id, tenant_id, resource_type, plan_tier, requests_per_minute, requests_per_hour, requests_per_day, burst_limit, is_active, description) VALUES
  ('018d0024-0000-7001-8001-000000000001', NULL,
   'auth.login', 'all', 5, 20, 100, 10, TRUE,
   'Login rate limit - prevent brute force attacks'),

  ('018d0024-0000-7001-8001-000000000002', NULL,
   'auth.password_reset', 'all', 3, 10, 20, 5, TRUE,
   'Password reset request limit'),

  ('018d0024-0000-7001-8001-000000000003', NULL,
   'auth.mfa_verify', 'all', 10, 30, 100, 15, TRUE,
   'MFA verification attempts');

-- 2. Public API endpoints (by plan tier)
-- Free tier
INSERT INTO api_rate_limits (id, tenant_id, resource_type, plan_tier, requests_per_minute, requests_per_hour, requests_per_day, burst_limit, is_active, description) VALUES
  ('018d0024-0000-7001-8001-000000000011', NULL,
   'api.contacts', 'free', 10, 300, 5000, 20, TRUE,
   'Contacts API - Free tier'),

  ('018d0024-0000-7001-8001-000000000012', NULL,
   'api.deals', 'free', 10, 300, 5000, 20, TRUE,
   'Deals API - Free tier'),

  ('018d0024-0000-7001-8001-000000000013', NULL,
   'api.activities', 'free', 10, 300, 5000, 20, TRUE,
   'Activities API - Free tier');

-- Starter tier
INSERT INTO api_rate_limits (id, tenant_id, resource_type, plan_tier, requests_per_minute, requests_per_hour, requests_per_day, burst_limit, is_active, description) VALUES
  ('018d0024-0000-7001-8001-000000000021', NULL,
   'api.contacts', 'starter', 30, 1000, 20000, 50, TRUE,
   'Contacts API - Starter tier'),

  ('018d0024-0000-7001-8001-000000000022', NULL,
   'api.deals', 'starter', 30, 1000, 20000, 50, TRUE,
   'Deals API - Starter tier'),

  ('018d0024-0000-7001-8001-000000000023', NULL,
   'api.activities', 'starter', 30, 1000, 20000, 50, TRUE,
   'Activities API - Starter tier');

-- Professional tier
INSERT INTO api_rate_limits (id, tenant_id, resource_type, plan_tier, requests_per_minute, requests_per_hour, requests_per_day, burst_limit, is_active, description) VALUES
  ('018d0024-0000-7001-8001-000000000031', NULL,
   'api.contacts', 'professional', 60, 3000, 50000, 100, TRUE,
   'Contacts API - Professional tier'),

  ('018d0024-0000-7001-8001-000000000032', NULL,
   'api.deals', 'professional', 60, 3000, 50000, 100, TRUE,
   'Deals API - Professional tier'),

  ('018d0024-0000-7001-8001-000000000033', NULL,
   'api.activities', 'professional', 60, 3000, 50000, 100, TRUE,
   'Activities API - Professional tier');

-- Enterprise tier (highest limits)
INSERT INTO api_rate_limits (id, tenant_id, resource_type, plan_tier, requests_per_minute, requests_per_hour, requests_per_day, burst_limit, is_active, description) VALUES
  ('018d0024-0000-7001-8001-000000000041', NULL,
   'api.contacts', 'enterprise', 120, 6000, 200000, 200, TRUE,
   'Contacts API - Enterprise tier'),

  ('018d0024-0000-7001-8001-000000000042', NULL,
   'api.deals', 'enterprise', 120, 6000, 200000, 200, TRUE,
   'Deals API - Enterprise tier'),

  ('018d0024-0000-7001-8001-000000000043', NULL,
   'api.activities', 'enterprise', 120, 6000, 200000, 200, TRUE,
   'Activities API - Enterprise tier');

-- 3. Webhook delivery (global limits)
INSERT INTO api_rate_limits (id, tenant_id, resource_type, plan_tier, requests_per_minute, requests_per_hour, requests_per_day, burst_limit, is_active, description) VALUES
  ('018d0024-0000-7001-8001-000000000051', NULL,
   'webhook.delivery', 'all', 100, 3000, 50000, 150, TRUE,
   'Webhook delivery rate (outgoing)');

-- 4. Bulk operations (expensive endpoints)
INSERT INTO api_rate_limits (id, tenant_id, resource_type, plan_tier, requests_per_minute, requests_per_hour, requests_per_day, burst_limit, is_active, description) VALUES
  ('018d0024-0000-7001-8001-000000000061', NULL,
   'api.bulk_import', 'professional', 2, 10, 50, 5, TRUE,
   'Bulk import operations - Professional'),

  ('018d0024-0000-7001-8001-000000000062', NULL,
   'api.bulk_import', 'enterprise', 5, 30, 200, 10, TRUE,
   'Bulk import operations - Enterprise'),

  ('018d0024-0000-7001-8001-000000000063', NULL,
   'api.bulk_export', 'professional', 5, 30, 100, 10, TRUE,
   'Bulk export operations - Professional'),

  ('018d0024-0000-7001-8001-000000000064', NULL,
   'api.bulk_export', 'enterprise', 10, 60, 500, 20, TRUE,
   'Bulk export operations - Enterprise');

-- 5. AI-powered endpoints (token-intensive)
INSERT INTO api_rate_limits (id, tenant_id, resource_type, plan_tier, requests_per_minute, requests_per_hour, requests_per_day, burst_limit, is_active, description) VALUES
  ('018d0024-0000-7001-8001-000000000071', NULL,
   'ai.lead_scoring', 'professional', 20, 500, 5000, 30, TRUE,
   'AI Lead Scoring API - Professional'),

  ('018d0024-0000-7001-8001-000000000072', NULL,
   'ai.lead_scoring', 'enterprise', 50, 1500, 20000, 75, TRUE,
   'AI Lead Scoring API - Enterprise'),

  ('018d0024-0000-7001-8001-000000000073', NULL,
   'ai.email_composer', 'professional', 10, 200, 2000, 15, TRUE,
   'AI Email Composer - Professional'),

  ('018d0024-0000-7001-8001-000000000074', NULL,
   'ai.email_composer', 'enterprise', 30, 600, 10000, 50, TRUE,
   'AI Email Composer - Enterprise'),

  ('018d0024-0000-7001-8001-000000000075', NULL,
   'ai.sentiment_analysis', 'professional', 15, 300, 3000, 25, TRUE,
   'AI Sentiment Analysis - Professional'),

  ('018d0024-0000-7001-8001-000000000076', NULL,
   'ai.sentiment_analysis', 'enterprise', 40, 1000, 15000, 60, TRUE,
   'AI Sentiment Analysis - Enterprise');

-- 6. Search endpoints (expensive queries)
INSERT INTO api_rate_limits (id, tenant_id, resource_type, plan_tier, requests_per_minute, requests_per_hour, requests_per_day, burst_limit, is_active, description) VALUES
  ('018d0024-0000-7001-8001-000000000081', NULL,
   'api.search_global', 'starter', 10, 200, 2000, 15, TRUE,
   'Global search - Starter'),

  ('018d0024-0000-7001-8001-000000000082', NULL,
   'api.search_global', 'professional', 30, 600, 10000, 45, TRUE,
   'Global search - Professional'),

  ('018d0024-0000-7001-8001-000000000083', NULL,
   'api.search_global', 'enterprise', 60, 1500, 50000, 90, TRUE,
   'Global search - Enterprise');


-- ============================================================
-- TENANT-SPECIFIC OVERRIDES
-- ============================================================

-- Tenant 1 (ABC Software) - Enterprise plan với custom limits cao hơn
INSERT INTO api_rate_limits (id, tenant_id, resource_type, plan_tier, requests_per_minute, requests_per_hour, requests_per_day, burst_limit, is_active, description) VALUES
  ('018d0024-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'api.contacts', 'enterprise', 200, 10000, 500000, 300, TRUE,
   'Custom limit for ABC Software - High volume integration'),

  ('018d0024-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'api.deals', 'enterprise', 200, 10000, 500000, 300, TRUE,
   'Custom limit for ABC Software - High volume integration'),

  ('018d0024-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'ai.lead_scoring', 'enterprise', 100, 3000, 50000, 150, TRUE,
   'Custom AI limit for ABC Software - Heavy AI usage');

-- Internal testing tenant - Unlimited (for development)
INSERT INTO api_rate_limits (id, tenant_id, resource_type, plan_tier, requests_per_minute, requests_per_hour, requests_per_day, burst_limit, is_active, description) VALUES
  ('018d0024-9999-7001-8001-000000000001', '018d0001-9999-7001-8001-000000000001',
   'api.*', 'internal', 10000, 500000, 10000000, 20000, TRUE,
   'Internal testing - No practical limits');


-- ============================================================
-- RATE LIMIT EXEMPTIONS (Whitelisted IPs/API Keys)
-- ============================================================

-- Partner integration API key - Higher limits
INSERT INTO api_rate_limits (id, tenant_id, resource_type, plan_tier, requests_per_minute, requests_per_hour, requests_per_day, burst_limit, is_active, description, api_key_id) VALUES
  ('018d0024-0001-7001-8001-000000000091', '018d0001-0001-7001-8001-000000000001',
   'api.*', 'partner', 500, 20000, 1000000, 750, TRUE,
   'Partner API key - Zapier integration',
   '018d0024-0099-7001-8001-000000000001');


-- ============================================================
-- SUMMARY
-- ============================================================
-- Total rate limit configurations: 41
--
-- Global limits (tenant_id NULL): 38
--   - Authentication: 3
--   - CRUD APIs by tier: 12 (Free/Starter/Pro/Enterprise × 3 resources)
--   - Webhooks: 1
--   - Bulk operations: 4
--   - AI endpoints: 6
--   - Search: 3
--
-- Tenant-specific overrides: 3
--   - ABC Software (custom high limits): 3
--   - Internal testing (unlimited): 1
--   - Partner integrations: 1
--
-- Plan tier coverage:
--   - Free: 3 resources
--   - Starter: 4 resources
--   - Professional: 9 resources
--   - Enterprise: 9 resources
--   - Internal/Partner: 2 special cases
--
-- Rate limit strategy:
--   - Authentication: Strict (prevent attacks)
--   - Standard CRUD: Tiered by plan
--   - Bulk operations: Very conservative
--   - AI endpoints: Token-aware limits
--   - Search: Query-cost aware
-- ============================================================
