-- ============================================================
-- S019: Seed Data — Audit Logs
-- Sample audit trail cho các hoạt động quan trọng
-- Phụ thuộc: S001 (tenants, users), S003 (contacts, deals)
-- ============================================================

-- Giả định audit_logs schema:
-- id, tenant_id, user_id, action, entity_type, entity_id, 
-- old_values, new_values, ip_address, user_agent, created_at

-- ============================================================
-- TENANT 1: ABC Software - Audit Trail Examples
-- ============================================================

-- 1. User login events
INSERT INTO audit_logs (id, tenant_id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at) VALUES
  ('018d0022-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0001-7001-8001-000000000001', 'login', 'user', '018d0002-0001-7001-8001-000000000001',
   '{}', '{"login_method":"email","mfa_verified":true}', '103.56.158.23',
   'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '2026-03-15 08:30:00+07'),

  ('018d0022-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000001', 'login', 'user', '018d0002-0005-7001-8001-000000000001',
   '{}', '{"login_method":"email","mfa_verified":false}', '117.2.95.102',
   'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '2026-03-15 09:15:00+07');

-- 2. Contact creation
INSERT INTO audit_logs (id, tenant_id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at) VALUES
  ('018d0022-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000001', 'create', 'contact', '018d0006-0001-7001-8001-000000000001',
   '{}', 
   '{"first_name":"Nguyễn Thanh","last_name":"Tùng","email":"tung.nguyen@techcorp.vn","company":"TechCorp Vietnam","contact_type":"customer"}',
   '117.2.95.102', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '2026-03-14 10:20:00+07');

-- 3. Contact update (lead score change via AI)
INSERT INTO audit_logs (id, tenant_id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at) VALUES
  ('018d0022-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000015', -- AI BDR Agent
   'update', 'contact', '018d0006-0001-7001-8001-000000000001',
   '{"lead_score":75}', '{"lead_score":85}',
   '10.0.1.50', 'AI-Agent/1.0', '2026-03-15 11:45:00+07');

-- 4. Deal creation
INSERT INTO audit_logs (id, tenant_id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at) VALUES
  ('018d0022-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000001', 'create', 'deal', '018d0007-0001-7001-8001-000000000001',
   '{}',
   '{"name":"TechCorp — Hệ thống quản lý kho thông minh","value":120000,"currency":"USD","stage":"negotiation","probability":75}',
   '117.2.95.102', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '2026-03-14 14:30:00+07');

-- 5. Deal stage change (qualification → discovery)
INSERT INTO audit_logs (id, tenant_id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at) VALUES
  ('018d0022-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000001', 'update', 'deal', '018d0007-0001-7001-8001-000000000003',
   '{"stage":"qualification","probability":30}', '{"stage":"discovery","probability":40}',
   '117.2.95.102', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '2026-03-15 16:20:00+07');

-- 6. Deal won (stage change to closed-won)
INSERT INTO audit_logs (id, tenant_id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at) VALUES
  ('018d0022-0001-7001-8001-000000000007', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000003', 'update', 'deal', '018d0007-0001-7001-8001-000000000004',
   '{"stage":"negotiation","probability":80,"won":null}', 
   '{"stage":"closed-won","probability":100,"won":true,"actual_close_date":"2026-03-16"}',
   '125.212.220.15', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '2026-03-16 10:45:00+07');

-- 7. Deal value update (price negotiation)
INSERT INTO audit_logs (id, tenant_id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at) VALUES
  ('018d0022-0001-7001-8001-000000000008', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000001', 'update', 'deal', '018d0007-0001-7001-8001-000000000001',
   '{"value":120000}', '{"value":115000}',
   '117.2.95.102', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '2026-03-15 17:30:00+07');

-- 8. Contact deleted (soft delete)
INSERT INTO audit_logs (id, tenant_id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at) VALUES
  ('018d0022-0001-7001-8001-000000000009', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0001-7001-8001-000000000001', 'delete', 'contact', '018d0006-0001-7001-8001-000000000020',
   '{"status":"active","deleted_at":null}', '{"status":"inactive","deleted_at":"2026-03-16T14:30:00Z"}',
   '103.56.158.23', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '2026-03-16 14:30:00+07');

-- 9. User settings change (timezone update)
INSERT INTO audit_logs (id, tenant_id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at) VALUES
  ('018d0022-0001-7001-8001-000000000010', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000004', 'update', 'user', '018d0002-0005-7001-8001-000000000004',
   '{"timezone":"Asia/Ho_Chi_Minh"}', '{"timezone":"America/New_York"}',
   '45.118.134.92', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0)', '2026-03-16 20:15:00+07');

-- 10. Role assignment change
INSERT INTO audit_logs (id, tenant_id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at) VALUES
  ('018d0022-0001-7001-8001-000000000011', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0001-7001-8001-000000000001', 'update', 'user_role', '018d0002-0005-7001-8001-000000000002',
   '{"roles":["Business Development"]}', '{"roles":["Business Development","Account Manager"]}',
   '103.56.158.23', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '2026-03-17 09:00:00+07');

-- 11. Bulk contact import
INSERT INTO audit_logs (id, tenant_id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at) VALUES
  ('018d0022-0001-7001-8001-000000000012', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000004', 'bulk_import', 'contact', NULL,
   '{}', '{"imported_count":25,"failed_count":2,"source":"csv_upload"}',
   '117.5.200.88', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '2026-03-17 10:30:00+07');

-- 12. Failed login attempt
INSERT INTO audit_logs (id, tenant_id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at) VALUES
  ('018d0022-0001-7001-8001-000000000013', '018d0001-0001-7001-8001-000000000001',
   NULL, 'login_failed', 'user', NULL,
   '{}', '{"email":"suspicious@example.com","reason":"invalid_credentials"}',
   '185.220.101.42', 'curl/7.68.0', '2026-03-17 02:15:00+07');

-- 13. Export operation (GDPR compliance tracking)
INSERT INTO audit_logs (id, tenant_id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at) VALUES
  ('018d0022-0001-7001-8001-000000000014', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000008', 'export', 'contact', NULL,
   '{}', '{"format":"csv","record_count":150,"filters":{"date_range":"last_30_days"}}',
   '125.212.220.15', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '2026-03-17 11:45:00+07');

-- 14. Permission denied attempt
INSERT INTO audit_logs (id, tenant_id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at) VALUES
  ('018d0022-0001-7001-8001-000000000015', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000014', 'access_denied', 'deal', '018d0007-0001-7001-8001-000000000001',
   '{}', '{"reason":"insufficient_permissions","required_permission":"deals:delete"}',
   '117.2.95.102', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '2026-03-17 13:20:00+07');

-- 15. API key created
INSERT INTO audit_logs (id, tenant_id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at) VALUES
  ('018d0022-0001-7001-8001-000000000016', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000009', 'create', 'api_key', '018d0022-0099-7001-8001-000000000001',
   '{}', '{"name":"Production Integration","scopes":["contacts:read","deals:read"],"expires_at":"2027-03-17"}',
   '125.212.220.15', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '2026-03-17 14:00:00+07');

-- 16. Webhook configured
INSERT INTO audit_logs (id, tenant_id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at) VALUES
  ('018d0022-0001-7001-8001-000000000017', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000013', 'create', 'webhook', '018d0022-0098-7001-8001-000000000001',
   '{}', '{"url":"https://app.example.com/webhooks/crm","events":["deal.won","contact.created"],"status":"active"}',
   '103.56.158.23', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '2026-03-17 15:30:00+07');

-- 17. Mass delete operation
INSERT INTO audit_logs (id, tenant_id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at) VALUES
  ('018d0022-0001-7001-8001-000000000018', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0001-7001-8001-000000000001', 'bulk_delete', 'activity', NULL,
   '{}', '{"deleted_count":45,"filter":{"type":"note","created_before":"2025-01-01"}}',
   '103.56.158.23', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '2026-03-17 16:00:00+07');

-- 18. Password changed
INSERT INTO audit_logs (id, tenant_id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at) VALUES
  ('018d0022-0001-7001-8001-000000000019', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000005', 'update', 'user', '018d0002-0005-7001-8001-000000000005',
   '{}', '{"action":"password_changed","method":"self_service"}',
   '117.2.95.102', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '2026-03-17 17:15:00+07');

-- 19. Email sent (campaign activity)
INSERT INTO audit_logs (id, tenant_id, user_id, action, entity_type, entity_id, old_values, new_values, ip_address, user_agent, created_at) VALUES
  ('018d0022-0001-7001-8001-000000000020', '018d0001-0001-7001-8001-000000000001',
   '018d0002-0005-7001-8001-000000000016', -- AI Content Agent
   'send', 'email_campaign', '018d0022-0097-7001-8001-000000000001',
   '{}', '{"recipients_count":320,"subject":"Giới thiệu tính năng AI mới","status":"sent"}',
   '10.0.1.50', 'AI-Agent/1.0', '2026-03-17 18:00:00+07');


-- ============================================================
-- SUMMARY
-- ============================================================
-- Total audit log entries: 20
-- Event types covered:
--   - Authentication: login (2), login_failed (1), password_changed (1)
--   - CRUD: create (5), update (7), delete (2), bulk_delete (1)
--   - Data operations: bulk_import (1), export (1)
--   - Security: access_denied (1), api_key creation (1)
--   - Integration: webhook creation (1), email campaign (1)
--
-- Demonstrates:
--   - User activity tracking
--   - AI agent actions
--   - Security events
--   - GDPR compliance (export tracking)
--   - Failed access attempts
-- ============================================================
