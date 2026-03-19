-- ============================================================
-- S022: Seed Data — Webhook Delivery Logs
-- Lịch sử gửi webhooks (thành công & thất bại)
-- Phụ thuộc: S001 (tenants), integrations/webhooks setup
-- ============================================================

-- Giả định webhook_delivery_logs schema:
-- id, tenant_id, webhook_id, event_type, payload, 
-- status, http_status_code, response_body, attempts, 
-- delivered_at, failed_at, next_retry_at

-- ============================================================
-- TENANT 1: ABC Software - Webhook Delivery History
-- ============================================================

-- 1. Successful webhook: deal.won event
INSERT INTO webhook_delivery_logs (id, tenant_id, webhook_id, event_type, entity_type, entity_id, payload, status, http_status_code, response_body, attempts, delivered_at, created_at) VALUES
  ('018d0025-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   '018d0022-0098-7001-8001-000000000001', -- Webhook ID từ S019
   'deal.won', 'deal', '018d0007-0001-7001-8001-000000000004',
   '{"event":"deal.won","deal_id":"018d0007-0001-7001-8001-000000000004","value":180000,"currency":"USD","closed_at":"2026-03-16T10:45:00Z"}',
   'delivered', 200,
   '{"success":true,"message":"Webhook received","tracking_id":"abc-123"}',
   1, '2026-03-16 10:45:15+07', '2026-03-16 10:45:12+07');

-- 2. Successful webhook: contact.created event
INSERT INTO webhook_delivery_logs (id, tenant_id, webhook_id, event_type, entity_type, entity_id, payload, status, http_status_code, response_body, attempts, delivered_at, created_at) VALUES
  ('018d0025-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   '018d0022-0098-7001-8001-000000000001',
   'contact.created', 'contact', '018d0006-0001-7001-8001-000000000001',
   '{"event":"contact.created","contact_id":"018d0006-0001-7001-8001-000000000001","email":"tung.nguyen@techcorp.vn","company":"TechCorp Vietnam"}',
   'delivered', 200,
   '{"success":true}',
   1, '2026-03-14 10:20:08+07', '2026-03-14 10:20:05+07');

-- 3. Failed webhook: Timeout (will retry)
INSERT INTO webhook_delivery_logs (id, tenant_id, webhook_id, event_type, entity_type, entity_id, payload, status, http_status_code, response_body, attempts, failed_at, next_retry_at, created_at) VALUES
  ('018d0025-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   '018d0022-0098-7001-8001-000000000001',
   'deal.stage_changed', 'deal', '018d0007-0001-7001-8001-000000000003',
   '{"event":"deal.stage_changed","deal_id":"018d0007-0001-7001-8001-000000000003","old_stage":"qualification","new_stage":"discovery"}',
   'pending_retry', 0,
   '{"error":"Connection timeout after 30s"}',
   1, '2026-03-15 16:20:45+07', '2026-03-15 16:25:45+07', '2026-03-15 16:20:10+07');

-- 4. Retry successful after initial failure
INSERT INTO webhook_delivery_logs (id, tenant_id, webhook_id, event_type, entity_type, entity_id, payload, status, http_status_code, response_body, attempts, delivered_at, created_at) VALUES
  ('018d0025-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   '018d0022-0098-7001-8001-000000000001',
   'activity.completed', 'activity', '018d0010-0001-7001-8001-000000000005',
   '{"event":"activity.completed","activity_id":"018d0010-0001-7001-8001-000000000005","type":"call","contact_id":"018d0006-0001-7001-8001-000000000002"}',
   'delivered', 200,
   '{"success":true}',
   2, '2026-03-15 14:10:30+07', '2026-03-15 14:05:00+07');

-- 5. Failed webhook: 4xx Client Error (won't retry)
INSERT INTO webhook_delivery_logs (id, tenant_id, webhook_id, event_type, entity_type, entity_id, payload, status, http_status_code, response_body, attempts, failed_at, created_at) VALUES
  ('018d0025-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   '018d0022-0098-7001-8001-000000000001',
   'contact.updated', 'contact', '018d0006-0001-7001-8001-000000000005',
   '{"event":"contact.updated","contact_id":"018d0006-0001-7001-8001-000000000005"}',
   'failed', 400,
   '{"error":"Invalid payload format","field":"contact_id"}',
   1, '2026-03-15 12:30:00+07', '2026-03-15 12:29:55+07');

-- 6. Failed webhook: 5xx Server Error (max retries exhausted)
INSERT INTO webhook_delivery_logs (id, tenant_id, webhook_id, event_type, entity_type, entity_id, payload, status, http_status_code, response_body, attempts, failed_at, created_at) VALUES
  ('018d0025-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   '018d0022-0098-7001-8001-000000000001',
   'deal.created', 'deal', '018d0007-0001-7001-8001-000000000008',
   '{"event":"deal.created","deal_id":"018d0007-0001-7001-8001-000000000008","value":95000}',
   'failed', 503,
   '{"error":"Service Temporarily Unavailable"}',
   5, '2026-03-16 08:45:00+07', '2026-03-16 08:00:00+07');

-- 7. Successful webhook: email.bounced event
INSERT INTO webhook_delivery_logs (id, tenant_id, webhook_id, event_type, entity_type, entity_id, payload, status, http_status_code, response_body, attempts, delivered_at, created_at) VALUES
  ('018d0025-0001-7001-8001-000000000007', '018d0001-0001-7001-8001-000000000001',
   '018d0022-0098-7001-8001-000000000001',
   'email.bounced', 'email_log', '018d0025-0099-7001-8001-000000000001',
   '{"event":"email.bounced","email_id":"018d0025-0099-7001-8001-000000000001","recipient":"invalid@nonexistent.com","bounce_type":"hard"}',
   'delivered', 200,
   '{"success":true,"action":"marked_as_bounced"}',
   1, '2026-03-16 11:20:00+07', '2026-03-16 11:19:58+07');

-- 8. Successful webhook: lead.scored event (AI-driven)
INSERT INTO webhook_delivery_logs (id, tenant_id, webhook_id, event_type, entity_type, entity_id, payload, status, http_status_code, response_body, attempts, delivered_at, created_at) VALUES
  ('018d0025-0001-7001-8001-000000000008', '018d0001-0001-7001-8001-000000000001',
   '018d0022-0098-7001-8001-000000000001',
   'lead.scored', 'contact', '018d0006-0001-7001-8001-000000000001',
   '{"event":"lead.scored","contact_id":"018d0006-0001-7001-8001-000000000001","score":85,"previous_score":75,"factors":["engagement","fit","intent"]}',
   'delivered', 200,
   '{"success":true}',
   1, '2026-03-15 11:45:10+07', '2026-03-15 11:45:05+07');

-- 9. Successful webhook: campaign.sent event
INSERT INTO webhook_delivery_logs (id, tenant_id, webhook_id, event_type, entity_type, entity_id, payload, status, http_status_code, response_body, attempts, delivered_at, created_at) VALUES
  ('018d0025-0001-7001-8001-000000000009', '018d0001-0001-7001-8001-000000000001',
   '018d0022-0098-7001-8001-000000000001',
   'campaign.sent', 'email_campaign', '018d0022-0097-7001-8001-000000000001',
   '{"event":"campaign.sent","campaign_id":"018d0022-0097-7001-8001-000000000001","recipients":320,"subject":"Giới thiệu tính năng AI mới"}',
   'delivered', 200,
   '{"success":true}',
   1, '2026-03-17 18:00:15+07', '2026-03-17 18:00:12+07');

-- 10. Failed webhook: DNS resolution failure
INSERT INTO webhook_delivery_logs (id, tenant_id, webhook_id, event_type, entity_type, entity_id, payload, status, http_status_code, response_body, attempts, failed_at, next_retry_at, created_at) VALUES
  ('018d0025-0001-7001-8001-000000000010', '018d0001-0001-7001-8001-000000000001',
   '018d0022-0098-7001-8001-000000000001',
   'ticket.created', 'ticket', '018d0025-0098-7001-8001-000000000001',
   '{"event":"ticket.created","ticket_id":"018d0025-0098-7001-8001-000000000001","priority":"high"}',
   'pending_retry', 0,
   '{"error":"DNS resolution failed for webhook.example.com"}',
   1, '2026-03-17 09:30:00+07', '2026-03-17 09:35:00+07', '2026-03-17 09:29:55+07');

-- 11. Successful webhook: invoice.paid event
INSERT INTO webhook_delivery_logs (id, tenant_id, webhook_id, event_type, entity_type, entity_id, payload, status, http_status_code, response_body, attempts, delivered_at, created_at) VALUES
  ('018d0025-0001-7001-8001-000000000011', '018d0001-0001-7001-8001-000000000001',
   '018d0022-0098-7001-8001-000000000001',
   'invoice.paid', 'invoice', '018d0025-0097-7001-8001-000000000001',
   '{"event":"invoice.paid","invoice_id":"018d0025-0097-7001-8001-000000000001","amount":120000,"currency":"USD","payment_method":"bank_transfer"}',
   'delivered', 200,
   '{"success":true,"accounting_entry_id":"acc-789"}',
   1, '2026-03-17 15:20:00+07', '2026-03-17 15:19:58+07');

-- 12. Failed webhook: SSL certificate error
INSERT INTO webhook_delivery_logs (id, tenant_id, webhook_id, event_type, entity_type, entity_id, payload, status, http_status_code, response_body, attempts, failed_at, next_retry_at, created_at) VALUES
  ('018d0025-0001-7001-8001-000000000012', '018d0001-0001-7001-8001-000000000001',
   '018d0022-0098-7001-8001-000000000001',
   'contact.deleted', 'contact', '018d0006-0001-7001-8001-000000000020',
   '{"event":"contact.deleted","contact_id":"018d0006-0001-7001-8001-000000000020"}',
   'pending_retry', 0,
   '{"error":"SSL certificate verification failed"}',
   2, '2026-03-16 14:30:30+07', '2026-03-16 14:40:30+07', '2026-03-16 14:30:00+07');

-- 13. Successful webhook: task.assigned event
INSERT INTO webhook_delivery_logs (id, tenant_id, webhook_id, event_type, entity_type, entity_id, payload, status, http_status_code, response_body, attempts, delivered_at, created_at) VALUES
  ('018d0025-0001-7001-8001-000000000013', '018d0001-0001-7001-8001-000000000001',
   '018d0022-0098-7001-8001-000000000001',
   'task.assigned', 'task', '018d0025-0096-7001-8001-000000000001',
   '{"event":"task.assigned","task_id":"018d0025-0096-7001-8001-000000000001","assigned_to":"018d0005-0001-7001-8001-000000000003","due_date":"2026-03-20"}',
   'delivered', 200,
   '{"success":true}',
   1, '2026-03-17 16:45:00+07', '2026-03-17 16:44:58+07');

-- 14. Successful webhook: quota.exceeded event
INSERT INTO webhook_delivery_logs (id, tenant_id, webhook_id, event_type, entity_type, entity_id, payload, status, http_status_code, response_body, attempts, delivered_at, created_at) VALUES
  ('018d0025-0001-7001-8001-000000000014', '018d0001-0001-7001-8001-000000000001',
   '018d0022-0098-7001-8001-000000000001',
   'quota.exceeded', 'tenant', '018d0001-0001-7001-8001-000000000001',
   '{"event":"quota.exceeded","resource":"api_calls","limit":200000,"current":200150,"overage":150}',
   'delivered', 200,
   '{"success":true,"notification_sent":true}',
   1, '2026-03-17 17:30:00+07', '2026-03-17 17:29:58+07');

-- 15. Failed webhook: Rate limit exceeded on destination
INSERT INTO webhook_delivery_logs (id, tenant_id, webhook_id, event_type, entity_type, entity_id, payload, status, http_status_code, response_body, attempts, failed_at, next_retry_at, created_at) VALUES
  ('018d0025-0001-7001-8001-000000000015', '018d0001-0001-7001-8001-000000000001',
   '018d0022-0098-7001-8001-000000000001',
   'deal.value_changed', 'deal', '018d0007-0001-7001-8001-000000000001',
   '{"event":"deal.value_changed","deal_id":"018d0007-0001-7001-8001-000000000001","old_value":120000,"new_value":115000}',
   'pending_retry', 429,
   '{"error":"Rate limit exceeded","retry_after":300}',
   1, '2026-03-15 17:30:05+07', '2026-03-15 17:35:05+07', '2026-03-15 17:30:00+07');

-- 16. Successful webhook: user.login event (security monitoring)
INSERT INTO webhook_delivery_logs (id, tenant_id, webhook_id, event_type, entity_type, entity_id, payload, status, http_status_code, response_body, attempts, delivered_at, created_at) VALUES
  ('018d0025-0001-7001-8001-000000000016', '018d0001-0001-7001-8001-000000000001',
   '018d0022-0098-7001-8001-000000000002', -- Different webhook (security monitoring)
   'user.login', 'user', '018d0002-0005-7001-8001-000000000001',
   '{"event":"user.login","user_id":"018d0002-0005-7001-8001-000000000001","ip":"117.2.95.102","location":"Hanoi, Vietnam","device":"Desktop"}',
   'delivered', 200,
   '{"success":true}',
   1, '2026-03-15 09:15:05+07', '2026-03-15 09:15:02+07');

-- 17. Successful webhook: ai_agent.action event
INSERT INTO webhook_delivery_logs (id, tenant_id, webhook_id, event_type, entity_type, entity_id, payload, status, http_status_code, response_body, attempts, delivered_at, created_at) VALUES
  ('018d0025-0001-7001-8001-000000000017', '018d0001-0001-7001-8001-000000000001',
   '018d0022-0098-7001-8001-000000000001',
   'ai_agent.action', 'activity', '018d0025-0095-7001-8001-000000000001',
   '{"event":"ai_agent.action","agent_id":"018d0005-0001-7001-8001-000000000015","action":"lead_outreach","result":"email_sent","contact_id":"018d0006-0001-7001-8001-000000000007"}',
   'delivered', 200,
   '{"success":true}',
   1, '2026-03-17 10:15:00+07', '2026-03-17 10:14:58+07');

-- 18. Failed webhook: Invalid JSON response
INSERT INTO webhook_delivery_logs (id, tenant_id, webhook_id, event_type, entity_type, entity_id, payload, status, http_status_code, response_body, attempts, failed_at, created_at) VALUES
  ('018d0025-0001-7001-8001-000000000018', '018d0001-0001-7001-8001-000000000001',
   '018d0022-0098-7001-8001-000000000001',
   'product.updated', 'product', '018d0025-0094-7001-8001-000000000001',
   '{"event":"product.updated","product_id":"018d0025-0094-7001-8001-000000000001","price":1500}',
   'failed', 200,
   'OK', -- Invalid JSON response
   1, '2026-03-17 11:00:00+07', '2026-03-17 10:59:58+07');

-- 19. Successful webhook: subscription.renewed event
INSERT INTO webhook_delivery_logs (id, tenant_id, webhook_id, event_type, entity_type, entity_id, payload, status, http_status_code, response_body, attempts, delivered_at, created_at) VALUES
  ('018d0025-0001-7001-8001-000000000019', '018d0001-0001-7001-8001-000000000001',
   '018d0022-0098-7001-8001-000000000001',
   'subscription.renewed', 'subscription', '018d0025-0093-7001-8001-000000000001',
   '{"event":"subscription.renewed","subscription_id":"018d0025-0093-7001-8001-000000000001","plan":"enterprise","next_billing_date":"2026-04-17"}',
   'delivered', 200,
   '{"success":true}',
   1, '2026-03-17 12:00:00+07', '2026-03-17 11:59:58+07');

-- 20. Successful webhook: report.generated event
INSERT INTO webhook_delivery_logs (id, tenant_id, webhook_id, event_type, entity_type, entity_id, payload, status, http_status_code, response_body, attempts, delivered_at, created_at) VALUES
  ('018d0025-0001-7001-8001-000000000020', '018d0001-0001-7001-8001-000000000001',
   '018d0022-0098-7001-8001-000000000001',
   'report.generated', 'report', '018d0023-0001-7001-8001-000000000001',
   '{"event":"report.generated","report_id":"018d0023-0001-7001-8001-000000000001","type":"sales_pipeline","format":"pdf","download_url":"https://cdn.example.com/reports/abc123.pdf"}',
   'delivered', 200,
   '{"success":true}',
   1, '2026-03-17 18:00:30+07', '2026-03-17 18:00:28+07');


-- ============================================================
-- SUMMARY
-- ============================================================
-- Total webhook delivery logs: 20
--
-- Status distribution:
--   - Delivered (success): 14 (70%)
--   - Failed (permanent): 4 (20%)
--   - Pending retry: 3 (15%)
--
-- Event types covered:
--   - Deal events: 6 (won, created, stage_changed, value_changed)
--   - Contact events: 4 (created, updated, deleted, scored)
--   - Email events: 2 (bounced, campaign.sent)
--   - Activity events: 2 (completed, ai_agent.action)
--   - Financial: 2 (invoice.paid, subscription.renewed)
--   - System: 4 (user.login, quota.exceeded, task.assigned, report.generated)
--
-- Failure reasons:
--   - Network issues: 3 (timeout, DNS, SSL)
--   - Server errors (5xx): 1
--   - Client errors (4xx): 1
--   - Rate limiting: 1
--   - Invalid response: 1
--
-- Retry attempts:
--   - First attempt: 17
--   - Second attempt (retry): 2
--   - Max retries exhausted: 1
--
-- Demonstrates:
--   - Successful delivery flow
--   - Retry logic for transient failures
--   - Permanent failure handling (4xx)
--   - Various event types
--   - Error diversity (network, HTTP, validation)
-- ============================================================
