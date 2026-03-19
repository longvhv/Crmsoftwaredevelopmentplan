-- ============================================================
-- S020: Seed Data — Scheduled Reports
-- Báo cáo định kỳ tự động (daily, weekly, monthly)
-- Phụ thuộc: S001 (tenants, users), S002 (employees)
-- ============================================================

-- Giả định scheduled_reports schema:
-- id, tenant_id, name, report_type, schedule, recipients, 
-- filters, format, is_active, created_by, next_run_at, last_run_at

-- ============================================================
-- TENANT 1: ABC Software - Scheduled Reports
-- ============================================================

-- 1. Daily Sales Pipeline Report (cho Sales Manager)
INSERT INTO scheduled_reports (id, tenant_id, name, report_type, schedule, recipients, filters, format, is_active, created_by, next_run_at, last_run_at) VALUES
  ('018d0023-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Daily Pipeline Snapshot',
   'sales_pipeline',
   'daily',
   '["018d0002-0005-7001-8001-000000000001","018d0002-0001-7001-8001-000000000001"]', -- Sales Exec + Admin
   '{"pipeline":"default","stages":["qualification","discovery","proposal","negotiation"],"min_value":10000}',
   'pdf',
   TRUE,
   '018d0002-0005-7001-8001-000000000001',
   '2026-03-18 08:00:00+07',
   '2026-03-17 08:00:00+07');

-- 2. Weekly Won/Lost Deals Summary
INSERT INTO scheduled_reports (id, tenant_id, name, report_type, schedule, recipients, filters, format, is_active, created_by, next_run_at, last_run_at) VALUES
  ('018d0023-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Weekly Win/Loss Analysis',
   'deal_outcomes',
   'weekly',
   '["018d0002-0001-7001-8001-000000000001","018d0002-0005-7001-8001-000000000001","018d0002-0005-7001-8001-000000000003"]',
   '{"include_won":true,"include_lost":true,"group_by":"owner"}',
   'excel',
   TRUE,
   '018d0002-0001-7001-8001-000000000001',
   '2026-03-24 09:00:00+07',
   '2026-03-17 09:00:00+07');

-- 3. Monthly Revenue Forecast
INSERT INTO scheduled_reports (id, tenant_id, user_id, name, report_type, schedule, recipients, filters, format, is_active, created_by, next_run_at, last_run_at) VALUES
  ('018d0023-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   NULL,
   'Monthly Revenue Projection',
   'revenue_forecast',
   'monthly',
   '["018d0002-0001-7001-8001-000000000001","018d0002-0005-7001-8001-000000000008"]', -- Admin + Business Analyst
   '{"forecast_months":3,"probability_threshold":50,"currency":"USD"}',
   'pdf',
   TRUE,
   '018d0002-0005-7001-8001-000000000008',
   '2026-04-01 10:00:00+07',
   '2026-03-01 10:00:00+07');

-- 4. Weekly Lead Scoring Report (AI-driven)
INSERT INTO scheduled_reports (id, tenant_id, name, report_type, schedule, recipients, filters, format, is_active, created_by, next_run_at, last_run_at) VALUES
  ('018d0023-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'Weekly High-Value Leads',
   'lead_scoring',
   'weekly',
   '["018d0002-0005-7001-8001-000000000001","018d0002-0005-7001-8001-000000000002"]', -- Sales + BizDev
   '{"min_score":70,"contact_type":"lead","status":"active"}',
   'csv',
   TRUE,
   '018d0002-0005-7001-8001-000000000015', -- Created by AI BDR Agent
   '2026-03-24 07:00:00+07',
   '2026-03-17 07:00:00+07');

-- 5. Daily Activity Report (cho từng sales rep)
INSERT INTO scheduled_reports (id, tenant_id, name, report_type, schedule, recipients, filters, format, is_active, created_by, next_run_at, last_run_at) VALUES
  ('018d0023-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   'My Daily Activity Summary',
   'activity_log',
   'daily',
   '["018d0002-0005-7001-8001-000000000001"]', -- Sales Executive (individual report)
   '{"owner_id":"018d0005-0001-7001-8001-000000000001","activity_types":["call","email","meeting"],"completed_only":true}',
   'email_summary',
   TRUE,
   '018d0002-0005-7001-8001-000000000001',
   '2026-03-18 18:00:00+07',
   '2026-03-17 18:00:00+07');

-- 6. Weekly Marketing Campaign Performance
INSERT INTO scheduled_reports (id, tenant_id, name, report_type, schedule, recipients, filters, format, is_active, created_by, next_run_at, last_run_at) VALUES
  ('018d0023-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   'Campaign Performance Dashboard',
   'marketing_campaigns',
   'weekly',
   '["018d0002-0005-7001-8001-000000000004","018d0002-0005-7001-8001-000000000005"]', -- Marketing Manager + Content Creator
   '{"campaign_status":"active","metrics":["open_rate","click_rate","conversion_rate"],"min_recipients":100}',
   'pdf',
   TRUE,
   '018d0002-0005-7001-8001-000000000004',
   '2026-03-24 10:00:00+07',
   '2026-03-17 10:00:00+07');

-- 7. Monthly Customer Health Score
INSERT INTO scheduled_reports (id, tenant_id, name, report_type, schedule, recipients, filters, format, is_active, created_by, next_run_at, last_run_at) VALUES
  ('018d0023-0001-7001-8001-000000000007', '018d0001-0001-7001-8001-000000000001',
   'Customer Health & Churn Risk',
   'customer_health',
   'monthly',
   '["018d0002-0005-7001-8001-000000000003","018d0002-0001-7001-8001-000000000001"]', -- Account Manager + Admin
   '{"contact_type":"customer","include_churn_risk":true,"min_lifetime_value":50000}',
   'excel',
   TRUE,
   '018d0002-0005-7001-8001-000000000003',
   '2026-04-01 09:00:00+07',
   '2026-03-01 09:00:00+07');

-- 8. Weekly Team Performance KPIs
INSERT INTO scheduled_reports (id, tenant_id, name, report_type, schedule, recipients, filters, format, is_active, created_by, next_run_at, last_run_at) VALUES
  ('018d0023-0001-7001-8001-000000000008', '018d0001-0001-7001-8001-000000000001',
   'Sales Team KPI Dashboard',
   'team_performance',
   'weekly',
   '["018d0002-0001-7001-8001-000000000001"]', -- Admin only
   '{"department":"Sales","metrics":["deals_won","revenue","activity_count","avg_deal_size"]}',
   'pdf',
   TRUE,
   '018d0002-0001-7001-8001-000000000001',
   '2026-03-24 11:00:00+07',
   '2026-03-17 11:00:00+07');

-- 9. Monthly Product Performance Report
INSERT INTO scheduled_reports (id, tenant_id, name, report_type, schedule, recipients, filters, format, is_active, created_by, next_run_at, last_run_at) VALUES
  ('018d0023-0001-7001-8001-000000000009', '018d0001-0001-7001-8001-000000000001',
   'Product Sales Analysis',
   'product_sales',
   'monthly',
   '["018d0002-0005-7001-8001-000000000009","018d0002-0005-7001-8001-000000000007"]', -- Tech Lead + PM
   '{"group_by":"product","include_quotations":true,"min_quantity":10}',
   'excel',
   TRUE,
   '018d0002-0005-7001-8001-000000000007',
   '2026-04-01 11:00:00+07',
   '2026-03-01 11:00:00+07');

-- 10. Weekly Support Ticket Metrics
INSERT INTO scheduled_reports (id, tenant_id, name, report_type, schedule, recipients, filters, format, is_active, created_by, next_run_at, last_run_at) VALUES
  ('018d0023-0001-7001-8001-000000000010', '018d0001-0001-7001-8001-000000000001',
   'Support Ticket SLA Report',
   'support_metrics',
   'weekly',
   '["018d0002-0001-7001-8001-000000000001","018d0002-0005-7001-8001-000000000012"]', -- Admin + QA Lead
   '{"statuses":["open","in_progress","resolved"],"sla_breach_only":false,"priority":["high","urgent"]}',
   'pdf',
   TRUE,
   '018d0002-0005-7001-8001-000000000012',
   '2026-03-24 12:00:00+07',
   '2026-03-17 12:00:00+07');

-- 11. Daily AI Agent Performance
INSERT INTO scheduled_reports (id, tenant_id, name, report_type, schedule, recipients, filters, format, is_active, created_by, next_run_at, last_run_at) VALUES
  ('018d0023-0001-7001-8001-000000000011', '018d0001-0001-7001-8001-000000000001',
   'AI Agent Activity Log',
   'ai_agent_metrics',
   'daily',
   '["018d0002-0005-7001-8001-000000000011","018d0002-0001-7001-8001-000000000001"]', -- AI Engineer + Admin
   '{"agent_types":["ai-agent"],"metrics":["leads_created","emails_sent","sentiment_analysis"],"min_actions":1}',
   'json',
   TRUE,
   '018d0002-0005-7001-8001-000000000011',
   '2026-03-18 23:00:00+07',
   '2026-03-17 23:00:00+07');

-- 12. Monthly Territory Performance (paused)
INSERT INTO scheduled_reports (id, tenant_id, name, report_type, schedule, recipients, filters, format, is_active, created_by, next_run_at, last_run_at) VALUES
  ('018d0023-0001-7001-8001-000000000012', '018d0001-0001-7001-8001-000000000001',
   'Territory Sales Comparison',
   'territory_analysis',
   'monthly',
   '["018d0002-0001-7001-8001-000000000001"]',
   '{"compare_territories":true,"include_quota_vs_actual":true}',
   'pdf',
   FALSE, -- Paused
   '018d0002-0001-7001-8001-000000000001',
   NULL, -- No next run (paused)
   '2026-02-01 10:00:00+07');

-- 13. Weekly Email Deliverability Report
INSERT INTO scheduled_reports (id, tenant_id, name, report_type, schedule, recipients, filters, format, is_active, created_by, next_run_at, last_run_at) VALUES
  ('018d0023-0001-7001-8001-000000000013', '018d0001-0001-7001-8001-000000000001',
   'Email Engagement & Deliverability',
   'email_metrics',
   'weekly',
   '["018d0002-0005-7001-8001-000000000004","018d0002-0005-7001-8001-000000000016"]', -- Marketing + AI Content Agent
   '{"metrics":["delivered","bounced","opened","clicked","unsubscribed"],"min_sent":50}',
   'csv',
   TRUE,
   '018d0002-0005-7001-8001-000000000004',
   '2026-03-24 08:00:00+07',
   '2026-03-17 08:00:00+07');

-- 14. Quarterly Business Review (QBR)
INSERT INTO scheduled_reports (id, tenant_id, name, report_type, schedule, recipients, filters, format, is_active, created_by, next_run_at, last_run_at) VALUES
  ('018d0023-0001-7001-8001-000000000014', '018d0001-0001-7001-8001-000000000001',
   'Quarterly Business Review',
   'executive_summary',
   'quarterly',
   '["018d0002-0001-7001-8001-000000000001","018d0002-0005-7001-8001-000000000008"]', -- Admin + BA
   '{"sections":["revenue","pipeline","customer_growth","churn","team_performance"],"executive_summary":true}',
   'pdf',
   TRUE,
   '018d0002-0005-7001-8001-000000000008',
   '2026-07-01 10:00:00+07',
   '2026-01-01 10:00:00+07');

-- 15. Daily Deal Alerts (high-value, close to deadline)
INSERT INTO scheduled_reports (id, tenant_id, name, report_type, schedule, recipients, filters, format, is_active, created_by, next_run_at, last_run_at) VALUES
  ('018d0023-0001-7001-8001-000000000015', '018d0001-0001-7001-8001-000000000001',
   'Urgent Deals Alert',
   'deal_alerts',
   'daily',
   '["018d0002-0005-7001-8001-000000000001","018d0002-0005-7001-8001-000000000003"]',
   '{"min_value":100000,"expected_close_within_days":7,"stages":["proposal","negotiation"]}',
   'email_summary',
   TRUE,
   '018d0002-0005-7001-8001-000000000001',
   '2026-03-18 07:00:00+07',
   '2026-03-17 07:00:00+07');


-- ============================================================
-- SUMMARY
-- ============================================================
-- Total scheduled reports: 15
-- Frequency distribution:
--   - Daily: 5 reports
--   - Weekly: 7 reports
--   - Monthly: 4 reports
--   - Quarterly: 1 report
--   - Paused: 1 report
--
-- Report types:
--   - Sales/Pipeline: 5
--   - Marketing: 2
--   - Customer Success: 1
--   - Support: 1
--   - AI/Analytics: 2
--   - Team Performance: 2
--   - Executive: 1
--   - Product: 1
--
-- Output formats:
--   - PDF: 7
--   - Excel: 3
--   - CSV: 2
--   - Email Summary: 2
--   - JSON: 1
-- ============================================================
