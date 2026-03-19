# Phân hệ 03 — Quản lý Lead (Lead Management)

> Lead đầu vào đa kênh với AI auto-qualify scoring.

---

## 1. `leads`

Lead đầu vào — trước khi chuyển đổi thành Contact.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên lead |
| `email` | `VARCHAR(320)` | NO | — | — | Email |
| `phone` | `VARCHAR(30)` | YES | `NULL` | — | Số điện thoại |
| `company` | `VARCHAR(255)` | YES | `NULL` | — | Tên công ty |
| `position` | `VARCHAR(150)` | YES | `NULL` | — | Chức vụ |
| `channel` | `VARCHAR(30)` | NO | `'inbound'` | CHECK IN ('website','linkedin','clutch','cold-outreach','referral','event','inbound','partner') | Kênh tiếp nhận |
| `status` | `VARCHAR(20)` | NO | `'new'` | CHECK IN ('new','contacted','qualified','converted','disqualified') | Trạng thái workflow |
| `ai_score` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Điểm AI qualification (0-100) |
| `assigned_to` | `UUID` | YES | `NULL` | FK → employees(id) | Nhân viên phụ trách |
| `converted_contact_id` | `UUID` | YES | `NULL` | FK → contacts(id) | Liên hệ sau khi convert |
| `received_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời điểm nhận lead |
| `last_activity_at` | `TIMESTAMPTZ` | YES | `NULL` | — | Hoạt động gần nhất |
| `notes` | `TEXT` | YES | `NULL` | — | Ghi chú |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## Câu lệnh YSQL

```sql
-- ============================================================
-- PHÂN HỆ 03: QUẢN LÝ LEAD
-- ============================================================

CREATE TABLE leads (
    id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id               UUID        NOT NULL REFERENCES tenants(id),
    name                    VARCHAR(255) NOT NULL,
    email                   VARCHAR(320) NOT NULL,
    phone                   VARCHAR(30),
    company                 VARCHAR(255),
    position                VARCHAR(150),
    channel                 VARCHAR(30) NOT NULL DEFAULT 'inbound'
                                CHECK (channel IN ('website','linkedin','clutch','cold-outreach','referral','event','inbound','partner')),
    status                  VARCHAR(20) NOT NULL DEFAULT 'new'
                                CHECK (status IN ('new','contacted','qualified','converted','disqualified')),
    ai_score                SMALLINT    NOT NULL DEFAULT 0 CHECK (ai_score BETWEEN 0 AND 100),
    assigned_to             UUID        REFERENCES employees(id),
    converted_contact_id    UUID        REFERENCES contacts(id),
    received_at             TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_activity_at        TIMESTAMPTZ,
    notes                   TEXT,
    version                 INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at              TIMESTAMPTZ
);

CREATE INDEX idx_leads_tenant       ON leads (tenant_id)                 WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_status       ON leads (tenant_id, status)         WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_channel      ON leads (tenant_id, channel)        WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_assigned     ON leads (tenant_id, assigned_to)    WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_ai_score     ON leads (tenant_id, ai_score DESC)  WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_received     ON leads (tenant_id, received_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_email        ON leads (tenant_id, email)          WHERE deleted_at IS NULL;
```
