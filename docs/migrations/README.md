# Migration Scripts — CRM AI-First

> **Engine:** YugabyteDB (YSQL)
> **Tool:** Flyway / golang-migrate
> **Convention:** `V{NNN}__{description}.sql`

## Thứ tự chạy & Phụ thuộc

```
V001 ─── System Core (tenants, users, roles, departments)
  │
  ├── V002 ─── CRM Core (employees, contacts, deals, activities, tags)
  │     │
  │     ├── V003 ─── Leads & Communication (leads, email_*, sms_campaigns)
  │     │
  │     ├── V004 ─── Tasks, Calendar, Products & Quotations
  │     │     │
  │     │     └── V005 ─── Contracts & Commissions/Forecast
  │     │
  │     ├── V006 ─── Support, Vendors & Partners
  │     │
  │     ├── V007 ─── Customer Success (health, NPS, churn, renewals)
  │     │            [Depends: V005 contracts]
  │     │
  │     └── V008 ─── Analytics, Territory, Sales Enablement, Inventory
  │
  ├── V009 ─── Settings (custom_fields, automations, workflows, webhooks)
  │
  ├── V010 ─── Forms, Surveys & Marketing Extended
  │            [Depends: V003 leads, V008 campaign_rois]
  │
  ├── V011 ─── Documents, Customer Intelligence, Communication Extended
  │            [Depends: V002-V005, V010]
  │
  ├── V012 ─── AI, Subscriptions, Gamification, Integrations, Compliance
  │            [Depends: V001-V011]
  │
  ├── V013 ─── Materialized Views (dashboard aggregations)
  │            [Depends: ALL above]
  │            │
  │            ├── V014 ─── Row-Level Security (RLS) Policies
  │            │            [Depends: ALL tables above]
  │            │
  │            └── V015 ─── Deal Stages Table (Custom Pipelines)
  │                         [Depends: V002 deals]
```

## Tổng kết

| Version | Phân hệ | Số bảng | Số index |
|---------|---------|---------|----------|
| V001 | System Core | 6 | 7 |
| V002 | CRM Core | 7 | 14 |
| V003 | Leads & Communication | 5 | 9 |
| V004 | Tasks, Calendar, Products | 6 | 9 |
| V005 | Contracts & Commissions | 6 | 8 |
| V006 | Support, Vendors, Partners | 5 | 8 |
| V007 | Customer Success | 7 | 12 |
| V008 | Analytics, Territory, Enablement | 12 | 13 |
| V009 | Settings | 6 | 7 |
| V010 | Forms, Surveys, Marketing | 12 | 12 |
| V011 | Documents, Intelligence, Comms | 11 | 11 |
| V012 | AI, Subs, Gamif, Integ, Compliance | 13 | 13 |
| V013 | Materialized Views | 6 MV | 6 |
| V014 | RLS Policies (multi-tenant isolation) | ~70 policies | — |
| V015 | Deal Stages Table (Custom Pipelines) | 1 | 1 |
| **Tổng** | **26 phân hệ** | **106 bảng + 6 MV** | **~129** |

## Lưu ý quan trọng

1. **Partial Index**: Mọi index đều có `WHERE deleted_at IS NULL` để tối ưu performance
2. **Soft Delete**: Cấm `DELETE` vật lý, chỉ dùng `UPDATE SET deleted_at = NOW()`
3. **Optimistic Locking**: Kiểm tra `version` trước khi UPDATE, increment +1 sau khi thành công
4. **Materialized Views**: Cần refresh định kỳ (pg_cron hoặc external scheduler)
5. **UUID v7**: Sử dụng `gen_random_uuid()` tạm thời, production nên dùng UUID v7 generator
6. **Multi-tenant**: Mọi query phải filter `tenant_id` trước (row-level security hoặc middleware)
7. **RLS Policies (V014)**: Đã tạo Row-Level Security cho toàn bộ bảng. App layer cần `SET LOCAL app.current_tenant_id` trước mỗi transaction