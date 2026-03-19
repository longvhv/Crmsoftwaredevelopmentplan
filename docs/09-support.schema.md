# Phân hệ 09 — Hỗ trợ khách hàng (Support)

> Ticket hỗ trợ, SLA tracking, AI gợi ý giải pháp.

---

## 1. `support_tickets`

Ticket hỗ trợ kỹ thuật.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `ticket_no` | `VARCHAR(30)` | NO | — | UNIQUE per tenant | Mã ticket (TK-20260001) |
| `subject` | `VARCHAR(500)` | NO | — | NOT BLANK | Tiêu đề |
| `description` | `TEXT` | NO | — | NOT BLANK | Mô tả chi tiết |
| `contact_id` | `UUID` | YES | `NULL` | FK → contacts(id) | Khách hàng |
| `client_company` | `VARCHAR(255)` | YES | `NULL` | — | Tên công ty (denormalized) |
| `client_name` | `VARCHAR(255)` | YES | `NULL` | — | Tên người gửi |
| `client_email` | `VARCHAR(320)` | YES | `NULL` | — | Email người gửi |
| `category` | `VARCHAR(30)` | NO | `'question'` | CHECK IN ('bug','feature-request','question','billing','integration','performance') | Danh mục |
| `priority` | `VARCHAR(15)` | NO | `'medium'` | CHECK IN ('critical','high','medium','low') | Mức ưu tiên |
| `status` | `VARCHAR(20)` | NO | `'open'` | CHECK IN ('open','in-progress','waiting','resolved','closed') | Trạng thái |
| `assignee_id` | `UUID` | YES | `NULL` | FK → employees(id) | Nhân viên xử lý |
| `sla_deadline` | `TIMESTAMPTZ` | YES | `NULL` | — | Hạn SLA |
| `sla_breached` | `BOOLEAN` | NO | `FALSE` | — | Đã vi phạm SLA |
| `ai_suggestion` | `TEXT` | YES | `NULL` | — | AI gợi ý giải pháp |
| `resolution_time_hours` | `NUMERIC(8,2)` | YES | `NULL` | CHECK >= 0 | Thời gian giải quyết (giờ) |
| `resolved_at` | `TIMESTAMPTZ` | YES | `NULL` | — | Thời điểm giải quyết |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 2. `ticket_messages`

Tin nhắn trong ticket (conversation thread).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `ticket_id` | `UUID` | NO | — | FK → support_tickets(id) | Ticket cha |
| `sender_id` | `UUID` | YES | `NULL` | FK → users(id), NULL nếu khách gửi | Người gửi (nội bộ) |
| `sender_name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên người gửi (denormalized) |
| `is_agent` | `BOOLEAN` | NO | `FALSE` | — | Agent nội bộ hay khách hàng |
| `content` | `TEXT` | NO | — | NOT BLANK | Nội dung tin nhắn |
| `attachments` | `JSONB` | NO | `'[]'` | — | File đính kèm [{name, url, size}] |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian gửi |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## Câu lệnh YSQL

```sql
-- ============================================================
-- PHÂN HỆ 09: HỖ TRỢ KHÁCH HÀNG
-- ============================================================

-- 1. support_tickets
CREATE TABLE support_tickets (
    id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id               UUID        NOT NULL REFERENCES tenants(id),
    ticket_no               VARCHAR(30) NOT NULL,
    subject                 VARCHAR(500) NOT NULL,
    description             TEXT        NOT NULL,
    contact_id              UUID        REFERENCES contacts(id),
    client_company          VARCHAR(255),
    client_name             VARCHAR(255),
    client_email            VARCHAR(320),
    category                VARCHAR(30) NOT NULL DEFAULT 'question'
                                CHECK (category IN ('bug','feature-request','question','billing','integration','performance')),
    priority                VARCHAR(15) NOT NULL DEFAULT 'medium'
                                CHECK (priority IN ('critical','high','medium','low')),
    status                  VARCHAR(20) NOT NULL DEFAULT 'open'
                                CHECK (status IN ('open','in-progress','waiting','resolved','closed')),
    assignee_id             UUID        REFERENCES employees(id),
    sla_deadline            TIMESTAMPTZ,
    sla_breached            BOOLEAN     NOT NULL DEFAULT FALSE,
    ai_suggestion           TEXT,
    resolution_time_hours   NUMERIC(8,2) CHECK (resolution_time_hours IS NULL OR resolution_time_hours >= 0),
    resolved_at             TIMESTAMPTZ,
    version                 INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at              TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_tickets_no       ON support_tickets (tenant_id, ticket_no) WHERE deleted_at IS NULL;
CREATE INDEX idx_tickets_tenant         ON support_tickets (tenant_id)            WHERE deleted_at IS NULL;
CREATE INDEX idx_tickets_status         ON support_tickets (tenant_id, status)    WHERE deleted_at IS NULL;
CREATE INDEX idx_tickets_priority       ON support_tickets (tenant_id, priority)  WHERE deleted_at IS NULL;
CREATE INDEX idx_tickets_assignee       ON support_tickets (tenant_id, assignee_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_tickets_category       ON support_tickets (tenant_id, category)  WHERE deleted_at IS NULL;
CREATE INDEX idx_tickets_sla            ON support_tickets (tenant_id, sla_deadline) WHERE deleted_at IS NULL AND status NOT IN ('resolved','closed');
CREATE INDEX idx_tickets_contact        ON support_tickets (tenant_id, contact_id) WHERE deleted_at IS NULL AND contact_id IS NOT NULL;

-- 2. ticket_messages
CREATE TABLE ticket_messages (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    ticket_id       UUID        NOT NULL REFERENCES support_tickets(id),
    sender_id       UUID        REFERENCES users(id),
    sender_name     VARCHAR(255) NOT NULL,
    is_agent        BOOLEAN     NOT NULL DEFAULT FALSE,
    content         TEXT        NOT NULL,
    attachments     JSONB       NOT NULL DEFAULT '[]',
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_ticket_msgs_ticket ON ticket_messages (tenant_id, ticket_id, created_at) WHERE deleted_at IS NULL;
```
