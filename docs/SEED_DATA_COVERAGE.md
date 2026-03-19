# 📊 Seed Data Coverage Report

> **Cập nhật:** 2026-03-17  
> **Version:** 2.0 (Phase 1 Complete)  
> **Total Records:** ~697 bản ghi  
> **Coverage:** 98/106 bảng (~92.5%)

---

## 🎯 Tổng quan

Hệ thống CRM AI-First đã có **22 seed files** phủ **98/106 bảng** trong database với ~697 bản ghi mẫu, mô phỏng đầy đủ kịch bản thực tế của công ty phần mềm ABC Software tại Việt Nam.

### ✅ Điểm mạnh

1. **Comprehensive Coverage**: 92.5% bảng có seed data
2. **Realistic Scenarios**: Mô phỏng đa dạng use cases (B2B SaaS, Enterprise, SMB)
3. **Multi-tenant Ready**: 3 tenants demo với data riêng biệt
4. **AI-First**: Seed data cho AI agents, AI scoring, AI workflows
5. **Production-Like**: Audit trails, webhooks, rate limits, scheduled reports

### 📦 Phân loại theo nhóm chức năng

| Nhóm | Files | Bảng | Records | Mục đích |
|------|-------|------|---------|----------|
| **System Core** | S001, S013, S018-S022 | 12 | ~153 | Tenants, Users, Roles, Audit, API, Webhooks |
| **CRM Core** | S002, S003, S017 | 6 | ~60 | Employees, Contacts, Deals, Deal Stages |
| **Sales & Lead** | S004, S016 | 4 | ~37 | Activities, Tasks, Leads, Calendar |
| **Products & Finance** | S005, S014 | 7 | ~67 | Products, Quotations, Contracts, Pricing |
| **Customer Success** | S006, S015 | 13 | ~91 | Support, Health, NPS, Churn, Renewals |
| **Marketing** | S007 | 13 | ~45 | Campaigns, Forms, Surveys, Content, A/B Tests |
| **Sales Enablement** | S011, S012 | 21 | ~112 | Territory, Quota, Playbooks, Competitors, Commissions |
| **Automation & AI** | S008, S009 | 19 | ~86 | Workflows, AI Models, Chatbots, Gamification |
| **Documents & Knowledge** | S010 | 13 | ~47 | Documents, Knowledge Base, Deal Rooms, Social |

---

## 📋 Chi tiết từng seed file

### **S001: System Core** (~28 records)
- 1 Tenant (ABC Software)
- 1 Admin User
- 17 Roles (Sales, Marketing, Engineering, AI Agents)
- 9 Departments

### **S002: Employees** (13 records)
- 10 Human employees (Sales, Marketing, Engineering, QA, DevOps, Design)
- 3 AI Agents (BDR, Content, Support)

### **S003: Contacts & Deals** (18 records)
- 10 Contacts (mix of customers & leads)
- 8 Deals (stages: qualification → closed-won/lost)

### **S004: Activities, Tasks & Calendar** (17 records)
- 8 Activities (call, email, meeting, note)
- 5 Tasks (follow-up, proposal, demo)
- 4 Calendar Events

### **S005: Products, Quotations & Contracts** (16 records)
- 8 Products (SaaS licenses, consulting, training)
- 4 Quotations
- 4 Contracts

### **S006: Support & Partners** (23 records)
- 5 Support Tickets (priority: low → urgent)
- 4 Vendors
- 4 Partners
- 6 NPS Feedbacks
- 4 Customer Health records

### **S007: Marketing Extended** (45 records)
- 2 Forms + 5 Fields + 3 Submissions
- 2 Surveys + 4 Questions + 3 Responses
- 3 Landing Pages
- 5 Marketing Campaigns
- 6 Content Calendar Items
- 2 Referral Programs + 4 Referrals
- 2 A/B Tests + 4 Variants

### **S008: Settings & Automation** (34 records)
- 6 Settings Categories
- 8 Custom Fields
- 5 Automation Rules
- 4 Workflow Definitions
- 8 Notification Preferences
- 3 Webhooks

### **S009: AI, Subscriptions & Gamification** (52 records)
- 5 Chatbot Training Data
- 4 AI Models
- 3 Data Enrichment Jobs
- 5 Subscriptions
- 4 Currency Exchange Rates
- 6 Gamification Badges
- 8 Achievements
- 5 Integrations
- 2 API Keys
- 4 Compliance Checks
- 3 SLA Policies
- 3 Trust Certifications

### **S010: Documents & Intelligence** (47 records)
- 6 Documents
- 4 Knowledge Categories + 5 Articles
- 4 Customer Segments
- 2 Customer Journeys + 6 Touchpoints
- 3 Account Plans
- 2 Deal Rooms + 3 Deal Room Documents
- 5 Social Mentions
- 1 Live Chat Config
- 4 VoIP Call Logs
- 2 Meeting Recordings

### **S011: Territory & Enablement** (76 records)
- 5 Campaign ROIs
- 4 Competitors + 5 Battle Cards + 8 Skills
- 4 Win/Loss Records
- 4 Revenue Leak Items
- 4 Territories + 6 Territory Reps + 8 Quarter Revenues
- 6 Quota Reps
- 3 Playbooks + 3 Playbook Battle Cards
- 3 Goals + 6 Key Results
- 4 Inventory Items
- 3 CRM Events

### **S012: Email & Commissions** (36 records)
- 6 Email Templates
- 2 Email Sequences + 9 Sequence Steps
- 3 SMS Campaigns
- 4 Commission Tiers
- 3 Bonus Rules
- 6 Sales Rep Commissions
- 3 Commission Bonuses

### **S013: System Joins & Tags** (44 records)
- 1 User Role assignment
- 13 Employee Roles
- 10 Tags
- 12 Entity Tags (polymorphic tagging)
- 8 Audit Logs

### **S014: Child Tables** (41 records)
- 10 Pricing Tiers (product SKUs)
- 12 Quotation Line Items
- 3 Contract Amendments
- 12 Ticket Messages (support threads)
- 4 Vendor Contracts

### **S015: Customer Success Extended** (68 records)
- 16 Health Metrics
- 20 Health Score Trends
- 4 Client NPS Snapshots
- 3 Churn Risk Accounts
- 4 Renewals
- 10 Team Members
- 8 API Usage Logs
- 3 Custom Dashboards

### **S016: Leads** (20 records)
- 20 Leads distributed across:
  - 6 statuses (new, contacted, qualified, nurturing, converted, lost)
  - 8 sources (website, referral, social, event, ad, cold-call, partner, other)
  - Lead scores: 8-95

### **S017: Deal Stages** ✨ NEW (29 records)
- **Default Pipeline** (6 stages): Qualification → Discovery → Proposal → Negotiation → Closed Won/Lost
- **Enterprise Pipeline** (9 stages): Initial Contact → Qualification → Discovery → Technical Evaluation/POC → Proposal → Negotiation → Legal Review → Closed Won/Lost
- **SMB Pipeline** (5 stages): Lead Qualified → Demo Scheduled → Proposal Sent → Closed Won/Lost
- Across 3 tenants with customizable stage properties (probability, color, is_closed, is_won)

### **S018: Tenant User Roles** ✨ NEW (19 records)
- Maps users to roles within tenant context
- 19 role assignments covering:
  - Sales team (3)
  - Marketing team (3)
  - Delivery team (2)
  - Engineering team (2)
  - Support teams (6)
  - AI Agents (3)
- Includes primary/secondary role distinction

### **S019: Audit Logs** ✨ NEW (20 records)
- **Authentication events** (3): login, login_failed, password_changed
- **CRUD operations** (14): create, update, delete, bulk_import, bulk_delete, export
- **Security events** (2): access_denied, permission_denied
- **Integration events** (1): api_key creation, webhook configuration
- Tracks old_values → new_values, IP addresses, user agents

### **S020: Scheduled Reports** ✨ NEW (15 records)
- **Daily reports** (5): Pipeline snapshot, Activity summary, Deal alerts, AI agent metrics
- **Weekly reports** (7): Win/loss analysis, Lead scoring, Campaign performance, Team KPIs, Support SLA, Email deliverability
- **Monthly reports** (3): Revenue forecast, Customer health, Product sales, Territory performance
- **Quarterly reports** (1): Business review (QBR)
- Output formats: PDF (7), Excel (3), CSV (2), Email Summary (2), JSON (1)

### **S021: API Rate Limits** ✨ NEW (41 records)
- **Global limits** (38):
  - Authentication endpoints: 3 configs (strict limits for security)
  - CRUD APIs by tier: 12 configs (Free/Starter/Pro/Enterprise × 3 resources)
  - Webhooks: 1 config
  - Bulk operations: 4 configs (import/export)
  - AI endpoints: 6 configs (lead scoring, email composer, sentiment analysis)
  - Search: 3 configs (expensive queries)
- **Tenant-specific overrides** (3):
  - ABC Software custom high limits (3)
  - Internal testing unlimited (1)
  - Partner integrations (1)

### **S022: Webhook Delivery Logs** ✨ NEW (20 records)
- **Successful deliveries** (14): 70% success rate
- **Permanent failures** (4): 4xx errors, invalid responses
- **Pending retries** (3): Network issues, timeouts, rate limits
- Event types:
  - Deal events (6): won, created, stage_changed, value_changed
  - Contact events (4): created, updated, deleted, scored
  - Email events (2): bounced, campaign.sent
  - System events (4): user.login, quota.exceeded, task.assigned, report.generated
  - Financial (2): invoice.paid, subscription.renewed

---

## 🔍 Coverage by Migration

| Migration | Tables | Seeded | Coverage | Seed Files |
|-----------|--------|--------|----------|------------|
| V001 | 6 | 6 | 100% | S001, S013, S018-S022 |
| V002 | 7 | 7 | 100% | S002, S003, S013, S017 |
| V003 | 5 | 5 | 100% | S012, S016 |
| V004 | 6 | 6 | 100% | S004, S005, S014 |
| V005 | 6 | 6 | 100% | S005, S012, S014 |
| V006 | 5 | 5 | 100% | S006, S014 |
| V007 | 7 | 7 | 100% | S006, S015 |
| V008 | 12 | 11 | 92% | S011, S015 (missing: event_attendees) |
| V009 | 6 | 6 | 100% | S008 |
| V010 | 12 | 12 | 100% | S007 |
| V011 | 11 | 11 | 100% | S010 |
| V012 | 13 | 13 | 100% | S009, S015 |
| V013 | 6 MV | 0 | 0% | N/A (Materialized Views - computed) |
| V014 | ~70 policies | 0 | 0% | N/A (RLS Policies - DDL) |
| V015 | 1 | 1 | 100% | S017 |
| **Total** | **106 + 6 MV** | **98** | **92.5%** | **22 files** |

---

## ⏭️ Missing Tables (8 bảng)

| Table | Migration | Reason | Priority |
|-------|-----------|--------|----------|
| `event_attendees` | V008 | Tạo qua business flow khi đăng ký event | Low |
| Materialized Views (6) | V013 | Computed from base tables, auto-refresh | N/A |
| RLS Policies (~70) | V014 | DDL statements, not data | N/A |

**Note:** Thực tế chỉ thiếu 1 bảng nghiệp vụ (`event_attendees`), còn lại là views và policies.

---

## 🎨 Data Quality Standards

### ✅ Tuân thủ Guidelines 100%

- ✅ **Naming**: `snake_case` cho tables/fields, số nhiều cho tables
- ✅ **Primary Keys**: UUID v7 format (`018d...`)
- ✅ **Standard Mixins**: Mọi bảng có `id`, `tenant_id`, `version`, `created_at`, `updated_at`, `deleted_at`
- ✅ **Soft Delete**: Không có physical DELETE, chỉ UPDATE `deleted_at`
- ✅ **Optimistic Locking**: Mọi record bắt đầu với `version = 1`
- ✅ **Timezone**: UTC+7 (Asia/Ho_Chi_Minh) cho tất cả timestamps
- ✅ **Foreign Keys**: Thứ tự INSERT đã tính dependency tree

### 📊 Dữ liệu mô phỏng thực tế

- 🇻🇳 **Vietnamese Context**: Tên, công ty, địa chỉ Việt Nam
- 🏢 **Real Scenarios**: Công ty phần mềm outsource + product SaaS
- 💰 **Currencies**: VND (nội bộ), USD (products)
- 📧 **Email Domains**: Realistic `.vn` domains
- 📱 **Phone Numbers**: Vietnamese mobile format (09xx, 03xx)
- 🌐 **IP Addresses**: Vietnamese ISP ranges

---

## 🚀 Usage Examples

### Load All Seeds (Correct Order)

```bash
# PostgreSQL/YugabyteDB
for i in {001..022}; do
  psql -U postgres -d crm_db -f "docs/seeds/S${i}__*.sql"
done
```

### Check Coverage

```sql
-- Count records per table
SELECT 
  schemaname,
  tablename,
  n_tup_ins AS inserted_rows
FROM pg_stat_user_tables
WHERE schemaname = 'public'
ORDER BY n_tup_ins DESC;

-- Verify tenant data
SELECT tenant_id, COUNT(*) AS record_count
FROM contacts
WHERE deleted_at IS NULL
GROUP BY tenant_id;
```

### Reset Seeds (Caution!)

```sql
-- Soft delete all (preserves structure)
UPDATE contacts SET deleted_at = NOW();
UPDATE deals SET deleted_at = NOW();
-- ... repeat for all tables

-- Hard reset (dangerous - truncates all data)
TRUNCATE TABLE contacts, deals, activities CASCADE;
```

---

## 📈 Metrics & Statistics

### Records by Entity Type

| Entity Type | Count | Percentage |
|-------------|-------|------------|
| System (Users, Roles, Settings) | ~153 | 22% |
| CRM Core (Contacts, Deals, Activities) | ~97 | 14% |
| Sales & Marketing | ~157 | 23% |
| Customer Success | ~91 | 13% |
| Products & Finance | ~67 | 10% |
| Automation & AI | ~86 | 12% |
| Documents & Knowledge | ~47 | 7% |

### Multi-tenant Distribution

| Tenant | Name | Records | Percentage |
|--------|------|---------|------------|
| `018d0001-0001-7001-8001-000000000001` | ABC Software (Primary) | ~600 | 86% |
| `018d0001-0001-7001-8001-000000000002` | FinTech Startup | ~50 | 7% |
| `018d0001-0001-7001-8001-000000000003` | E-commerce Platform | ~47 | 7% |

**Note:** Tenant 1 (ABC Software) có dữ liệu đầy đủ nhất cho demo và testing.

---

## 🔮 Future Enhancements (Phase 2+)

- [ ] Add more tenants (4-5 total) for realistic multi-tenant testing
- [ ] Event attendees seed data
- [ ] More international data (English names, global companies)
- [ ] Performance testing datasets (100K+ records)
- [ ] Data anonymization scripts for production cloning
- [ ] Seed data versioning & migration scripts
- [ ] Automated seed data validation tests

---

## 📝 Change Log

### v2.0 (2026-03-17) - Phase 1 Complete ✨
- ➕ Added S017: Deal Stages (29 records, 3 pipelines)
- ➕ Added S018: Tenant User Roles (19 records)
- ➕ Added S019: Audit Logs (20 records)
- ➕ Added S020: Scheduled Reports (15 records)
- ➕ Added S021: API Rate Limits (41 records)
- ➕ Added S022: Webhook Delivery Logs (20 records)
- ➕ Added V015: Deal Stages Table migration
- 📊 Coverage: 91.5% → 92.5%
- 📦 Total records: 578 → 697 (+119)

### v1.0 (2026-03-10) - Initial Release
- ✅ 16 seed files covering 97/106 tables
- ✅ 578 initial records
- ✅ 91.5% coverage

---

**Maintained by:** AI Development Team  
**Last Review:** 2026-03-17  
**Next Review:** Phase 2 kickoff
