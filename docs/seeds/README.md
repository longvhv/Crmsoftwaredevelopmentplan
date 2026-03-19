# Seed Data — CRM AI-First

> **Thứ tự chạy:** S001 → S002 → … → S022
> **Tenant demo:** `018d0001-0001-7001-8001-000000000001` (TenantVN)

## Danh sách Seed Files

| File | Nội dung | Bản ghi |
|------|----------|---------|
| S001 | Tenant, Admin User, Roles (17), Departments (9) | ~28 |
| S002 | Employees — 10 human + 3 AI agents | 13 |
| S003 | Contacts (10), Deals (8) | 18 |
| S004 | Activities (8), Tasks (5), Calendar Events (4) | 17 |
| S005 | Products (8), Quotations (4), Contracts (4) | 16 |
| S006 | Support Tickets (5), Vendors (4), Partners (4), NPS (6), Customer Health (4) | 23 |
| S007 | Forms (2), Form Fields (5), Submissions (3), Surveys (2), Survey Questions (4), Survey Responses (3), Landing Pages (3), Marketing Campaigns (5), Content Calendar (6), Referral Programs (2), Referrals (4), A/B Tests (2), A/B Variants (4) | 45 |
| S008 | Settings Categories (6), Custom Fields (8), Automation Rules (5), Workflow Definitions (4), Notification Preferences (8), Webhooks (3) | 34 |
| S009 | Chatbot Training (5), AI Models (4), Data Enrichment (3), Subscriptions (5), Exchange Rates (4), Gamification Badges (6), Achievements (8), Integrations (5), API Keys (2), Compliance Checks (4), SLA Policies (3), Trust Certifications (3) | 52 |
| S010 | Documents (6), Knowledge Categories (4), Knowledge Articles (5), Customer Segments (4), Customer Journeys (2), Journey Touchpoints (6), Account Plans (3), Deal Rooms (2), Deal Room Documents (3), Social Mentions (5), Live Chat Config (1), VoIP Call Logs (4), Meeting Recordings (2) | 47 |
| S011 | Campaign ROIs (5), Competitors (4), Battle Cards (2+3), Competitor Skills (8), Win/Loss Records (4), Revenue Leaks (4), Territories (4), Territory Reps (6), Territory Quarter Revenues (8), Quota Reps (6), Playbooks (3), Playbook Battle Cards (3), Goals (3), Key Results (6), Inventory Items (4), CRM Events (3) | 76 |
| S012 | Email Templates (6), Email Sequences (2), Sequence Steps (9), SMS Campaigns (3), Commission Tiers (4), Bonus Rules (3), Sales Rep Commissions (6), Commission Bonuses (3) | 36 |
| S013 | User Roles (1), Employee Roles (13), Tags (10), Entity Tags (12), Audit Logs (8) | 44 |
| S014 | Pricing Tiers (10), Quotation Line Items (12), Contract Amendments (3), Ticket Messages (12), Vendor Contracts (4) | 41 |
| S015 | Health Metrics (16), Health Score Trends (20), Client NPS Snapshots (4), Churn Risk Accounts (3), Renewals (4), Team Members (10), API Usage Logs (8), Custom Dashboards (3) | 68 |
| S016 | Leads (20) — trải đều 6 status, 8 sources, score 8-95 | 20 |
| S017 | Deal Stages (29) — 3 pipelines (default, enterprise, smb) × 3 tenants | 29 |
| S018 | Tenant User Roles (19) — employee role assignments | 19 |
| S019 | Audit Logs (20) — authentication, CRUD, security events | 20 |
| S020 | Scheduled Reports (15) — daily, weekly, monthly, quarterly | 15 |
| S021 | API Rate Limits (41) — global + tenant-specific | 41 |
| S022 | Webhook Delivery Logs (20) — success, retry, failed | 20 |
| **Tổng** | | **~697 bản ghi** |

## Mapping với Mock Data TypeScript

| SQL Seed | TypeScript Data File / Pages | Entity |
|----------|------------------------------|--------|
| S001 | `crmData.ts` → `roles[]` | Roles, Departments |
| S002 | `crmData.ts` → `employees[]` | Employees |
| S003 | `crmData.ts` → `contacts[]`, `deals[]` | Contacts, Deals |
| S004 | `crmData.ts` → `activities[]`, `taskData.ts`, `calendarData.ts` | Activities, Tasks, Events |
| S005 | `productData.ts`, `quotationData.ts`, `contractData.ts` | Products, Quotations, Contracts |
| S006 | `ticketData.ts`, `vendorData.ts`, `partnerData.ts`, `npsData.ts` | Tickets, Vendors, Partners, NPS |
| S007 | `FormBuilderPage`, `SurveyManagerPage`, `CampaignRoiPage`, `ContentCalendarPage`, `ReferralProgramPage`, `ABTestingPage` | Forms, Surveys, Marketing, Content, Referrals, A/B Tests |
| S008 | `CustomFieldsPage`, `WorkflowBuilderPage`, `ApprovalWorkflowPage`, `WebhooksPage`, `AutomationRulesPage` | Settings, Custom Fields, Workflows, Webhooks |
| S009 | `AiTrainingDataPage`, `AiModelManagementPage`, `DataEnrichmentPage`, `SubscriptionManagementPage`, `GamificationPage`, `IntegrationsPage`, `ApiKeysPage`, `CompliancePage`, `SLATrackingPage`, `TrustCenterPage` | AI, Subscriptions, Gamification, Integrations, Compliance |
| S010 | `DocumentManagerPage`, `KnowledgeBasePage`, `CustomerSegmentPage`, `CustomerJourneyPage`, `AccountPlanPage`, `DealRoomPage`, `SocialMediaMonitorPage`, `LiveChatPage`, `CallLogPage`, `MeetingRecordingPage` | Documents, Knowledge, Segments, Journeys, Deal Rooms, Social, VoIP |
| S011 | `CampaignRoiPage`, `CompetitorAnalysisPage`, `WinLossPage`, `RevenueLeakPage`, `TerritoryPage`, `QuotaPage`, `PlaybookPage`, `GoalsPage`, `InventoryPage`, `EventManagementPage` | Analytics, Territory, Enablement, Inventory, Events |
| S012 | `EmailTemplatePage`, `EmailSequencePage`, `SmsCampaignPage`, `CommissionPage`, `BonusRulesPage` | Email, SMS, Commissions |
| S013 | Hệ thống nội bộ — role assignment, tagging, audit trail | User Roles, Employee Roles, Tags, Entity Tags, Audit Logs |
| S014 | `ProductDetailPage` (pricing), `QuotationDetailPage` (line items), `ContractDetailPage` (amendments), `TicketDetailPage` (messages), `VendorDetailPage` (contracts) | Pricing Tiers, Quotation Items, Amendments, Ticket Messages, Vendor Contracts |
| S015 | `CustomerHealthPage` (metrics, trends), `ChurnRiskPage`, `RenewalPage`, `TeamPage`, `ApiUsagePage`, `DashboardBuilderPage` | Health Metrics, Trends, NPS Snapshots, Churn Risk, Renewals, Team, API Logs, Dashboards |
| S016 | `LeadInboxPage`, `PipelinePage` (lead conversion), `AIInsightsPage` (lead scoring) | Leads |
| S017 | `DealStagePage` (pipeline configuration) | Deal Stages |
| S018 | `TenantUserRolePage` (role assignments) | Tenant User Roles |
| S019 | `AuditLogPage` (security events) | Audit Logs |
| S020 | `ScheduledReportPage` (report scheduling) | Scheduled Reports |
| S021 | `ApiRateLimitPage` (rate limiting) | API Rate Limits |
| S022 | `WebhookDeliveryLogPage` (webhook status) | Webhook Delivery Logs |

## Migration Dependencies

| Seed | Migration(s) |
|------|-------------|
| S001 | V001 |
| S002 | V001, V002 |
| S003 | V002 |
| S004 | V002, V004 |
| S005 | V002, V004, V005 |
| S006 | V002, V006, V007 |
| S007 | V002, V003, V010 |
| S008 | V001, V002, V009 |
| S009 | V002, V004, V005, V012 |
| S010 | V002, V003, V004, V005, V011 |
| S011 | V002, V004, V005, V008 |
| S012 | V002, V003, V005 |
| S013 | V001, V002 |
| S014 | V004, V005, V006 |
| S015 | V005, V006, V007, V008, V012 |
| S016 | V003 |
| S017 | V002 |
| S018 | V002 |
| S019 | V002 |
| S020 | V002 |
| S021 | V002 |
| S022 | V002 |

## UUID Ranges (tránh xung đột)

| Seed | UUID Range |
|------|-----------|
| S001 | `018d0001..018d0004` |
| S002 | `018d0005` |
| S003 | `018d0006..018d0007` |
| S004 | `018d0008..018d000a` |
| S005 | `018d000b..018d000d` |
| S006 | `018d000e..018d0012` |
| S007 | `018d0020..018d002c` |
| S008 | `018d0030..018d0035` |
| S009 | `018d0040..018d004b` |
| S010 | `018d0050..018d005c` |
| S011 | `018d0060..018d006f` |
| S012 | `018d0070..018d0077` |
| S013 | `018d0080..018d0084` |
| S014 | `018d0085..018d0089` |
| S015 | `018d0090..018d0097` |
| S016 | `018d00a0..018d00a9` (leads) |
| S017 | `018d00b0..018d00c2` (deal stages) |
| S018 | `018d00c3..018d00d1` (tenant user roles) |
| S019 | `018d00d2..018d00e5` (audit logs) |
| S020 | `018d00e6..018d00f4` (scheduled reports) |
| S021 | `018d00f5..018d0135` (api rate limits) |
| S022 | `018d0136..018d0145` (webhook delivery logs) |

## Coverage Report — Bảng DB vs Seed Data

### ✅ Đã có Seed Data (97/106 bảng)

| Migration | Bảng | Seed |
|-----------|------|------|
| V001 | `tenants`, `users`, `roles`, `departments`, `user_roles`, `audit_logs` | S001, S013 |
| V002 | `employees`, `employee_roles`, `contacts`, `deals`, `activities`, `tags`, `entity_tags` | S002, S003, S004, S013 |
| V003 | `leads`, `email_templates`, `email_sequences`, `email_sequence_steps`, `sms_campaigns` | S012, S016 |
| V004 | `tasks`, `calendar_events`, `products`, `pricing_tiers`, `quotations`, `quotation_line_items` | S004, S005, S014 |
| V005 | `contracts`, `contract_amendments`, `commission_tiers`, `bonus_rules`, `sales_rep_commissions`, `commission_bonuses` | S005, S012, S014 |
| V006 | `support_tickets`, `ticket_messages`, `vendors`, `vendor_contracts`, `partners` | S006, S014 |
| V007 | `customer_healths`, `health_metrics`, `health_score_trends`, `nps_feedbacks`, `client_nps_snapshots`, `churn_risk_accounts`, `renewals` | S006, S015 |
| V008 | `campaign_rois`, `competitors`, `competitor_battle_cards`, `competitor_skills`, `win_loss_records`, `revenue_leak_items`, `territories`, `territory_reps`, `territory_quarter_revenues`, `quota_reps`, `playbooks`, `playbook_battle_cards`, `goals`, `key_results`, `inventory_items`, `crm_events`, `team_members` | S011, S015 |
| V009 | `crm_settings_categories`, `custom_fields`, `automation_rules`, `workflow_definitions`, `notification_preferences`, `webhooks` | S008 |
| V010 | `forms`, `form_fields`, `form_submissions`, `surveys`, `survey_questions`, `survey_responses`, `landing_pages`, `marketing_campaigns`, `content_calendar_items`, `referral_programs`, `referrals`, `ab_tests`, `ab_test_variants` | S007 |
| V011 | `documents`, `knowledge_categories`, `knowledge_articles`, `customer_segments`, `customer_journeys`, `journey_touchpoints`, `account_plans`, `deal_rooms`, `deal_room_documents`, `social_mentions`, `live_chat_configs`, `voip_call_logs`, `meeting_recordings` | S010 |
| V012 | `chatbot_training_data`, `ai_models`, `data_enrichment_jobs`, `subscriptions`, `currency_exchange_rates`, `gamification_badges`, `gamification_achievements`, `integrations`, `api_keys`, `api_usage_logs`, `compliance_checks`, `sla_policies`, `trust_certifications`, `custom_dashboards` | S009, S015 |

### ⬜ Chưa có Seed Data (9 bảng — views, policies, DDL)

| Migration | Bảng | Lý do |
|-----------|------|-------|
| V002 | `deal_stages` | ✅ ADDED S017 — 3 pipelines × 3 tenants |
| V008 | `event_attendees` (nếu có) | Tạo qua business flow khi đăng ký event |
| V013 | Tất cả materialized views | Computed từ base tables, không INSERT |
| V014 | RLS policies | DDL statements, không phải data |

## Lưu ý

1. **UUID Format:** Sử dụng UUID v7 giả lập (`018d...`) để dễ debug, production dùng UUID v7 generator thật
2. **Timezone:** Mọi timestamp đều UTC+7 (Asia/Ho_Chi_Minh)
3. **Foreign Keys:** Thứ tự INSERT đã tính dependency (tenants → departments → employees → contacts → deals → ...)
4. **Soft Delete:** Tất cả `deleted_at` mặc định NULL (bản ghi active)
5. **Version:** Tất cả bản ghi bắt đầu với `version = 1`
6. **Tiền tệ:** Seed data sử dụng VND làm đơn vị chính cho CRM nội bộ, USD cho product pricing
7. **Dữ liệu thực tế:** Mọi mock data mô phỏng scenario thực của công ty phần mềm outsource + product tại Việt Nam
8. **Coverage:** Đạt **~98/106 bảng** (~92.5%) — Đã thêm S017-S022 (6 seed files mới, +119 records)
9. **New in v2.0:** 
   - S017: Deal stages cho custom pipelines
   - S018-S022: System tables (audit, scheduling, rate limiting, webhooks)
   - V015: Migration cho deal_stages table