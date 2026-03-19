# Phân hệ 04 — Truyền thông (Communication)

> Email templates, email sequences (drip campaigns), SMS campaigns.

---

## 1. `email_templates`

Mẫu email marketing / bán hàng với AI scoring.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên mẫu |
| `subject` | `VARCHAR(500)` | NO | — | NOT BLANK | Tiêu đề email |
| `category` | `VARCHAR(30)` | NO | `'follow-up'` | CHECK IN ('cold-outreach','follow-up','proposal','nurture','onboarding','support') | Danh mục |
| `status` | `VARCHAR(20)` | NO | `'draft'` | CHECK IN ('active','draft','archived') | Trạng thái |
| `body_html` | `TEXT` | NO | `''` | — | Nội dung HTML |
| `body_text` | `TEXT` | NO | `''` | — | Nội dung plain text (fallback) |
| `variables` | `JSONB` | NO | `'[]'` | — | Biến cá nhân hoá ['firstName','company',…] |
| `usage_count` | `INTEGER` | NO | `0` | CHECK >= 0 | Số lần sử dụng |
| `open_rate` | `NUMERIC(5,2)` | NO | `0` | CHECK BETWEEN 0 AND 100 | Tỉ lệ mở (%) |
| `ctr` | `NUMERIC(5,2)` | NO | `0` | CHECK BETWEEN 0 AND 100 | Tỉ lệ click (%) |
| `ai_score` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Điểm hiệu quả AI (0-100) |
| `created_by` | `UUID` | NO | — | FK → employees(id) | Người tạo |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 2. `email_sequences`

Chuỗi email tự động (drip campaign).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên chuỗi |
| `description` | `TEXT` | YES | `NULL` | — | Mô tả |
| `status` | `VARCHAR(20)` | NO | `'draft'` | CHECK IN ('active','paused','draft','completed') | Trạng thái |
| `enrolled_count` | `INTEGER` | NO | `0` | CHECK >= 0 | Số contact đã enroll |
| `completed_count` | `INTEGER` | NO | `0` | CHECK >= 0 | Số đã hoàn thành |
| `open_rate` | `NUMERIC(5,2)` | NO | `0` | CHECK BETWEEN 0 AND 100 | Tỉ lệ mở tổng (%) |
| `reply_rate` | `NUMERIC(5,2)` | NO | `0` | CHECK BETWEEN 0 AND 100 | Tỉ lệ phản hồi (%) |
| `ai_score` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Điểm hiệu quả AI |
| `created_by` | `UUID` | NO | — | FK → employees(id) | Người tạo |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 3. `email_sequence_steps`

Bước trong chuỗi email (email, wait, condition, task).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `sequence_id` | `UUID` | NO | — | FK → email_sequences(id) | Thuộc sequence nào |
| `step_type` | `VARCHAR(20)` | NO | `'email'` | CHECK IN ('email','wait','condition','task') | Loại bước |
| `step_order` | `INTEGER` | NO | — | CHECK >= 0 | Thứ tự (0-based) |
| `template_id` | `UUID` | YES | `NULL` | FK → email_templates(id), required khi step_type='email' | Mẫu email |
| `delay_hours` | `INTEGER` | YES | `NULL` | CHECK >= 0, required khi step_type='wait' | Thời gian chờ (giờ) |
| `condition_config` | `JSONB` | YES | `NULL` | Required khi step_type='condition' | Cấu hình điều kiện {type, trueStepId, falseStepId} |
| `task_title` | `VARCHAR(300)` | YES | `NULL` | Required khi step_type='task' | Tiêu đề task |
| `task_assignee` | `UUID` | YES | `NULL` | FK → employees(id) | Người thực hiện task |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 4. `sms_campaigns`

Chiến dịch SMS marketing.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên chiến dịch |
| `message` | `TEXT` | NO | — | NOT BLANK, max 1600 chars | Nội dung SMS |
| `status` | `VARCHAR(20)` | NO | `'draft'` | CHECK IN ('draft','scheduled','sending','sent','failed') | Trạng thái |
| `recipient_count` | `INTEGER` | NO | `0` | CHECK >= 0 | Số người nhận |
| `delivered_count` | `INTEGER` | NO | `0` | CHECK >= 0 | Số đã gửi thành công |
| `failed_count` | `INTEGER` | NO | `0` | CHECK >= 0 | Số thất bại |
| `scheduled_at` | `TIMESTAMPTZ` | YES | `NULL` | — | Thời gian gửi lên lịch |
| `sent_at` | `TIMESTAMPTZ` | YES | `NULL` | — | Thời gian gửi thực tế |
| `created_by` | `UUID` | NO | — | FK → employees(id) | Người tạo |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## Câu lệnh YSQL

```sql
-- ============================================================
-- PHÂN HỆ 04: TRUYỀN THÔNG
-- ============================================================

-- 1. email_templates
CREATE TABLE email_templates (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(255) NOT NULL,
    subject         VARCHAR(500) NOT NULL,
    category        VARCHAR(30) NOT NULL DEFAULT 'follow-up'
                        CHECK (category IN ('cold-outreach','follow-up','proposal','nurture','onboarding','support')),
    status          VARCHAR(20) NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('active','draft','archived')),
    body_html       TEXT        NOT NULL DEFAULT '',
    body_text       TEXT        NOT NULL DEFAULT '',
    variables       JSONB       NOT NULL DEFAULT '[]',
    usage_count     INTEGER     NOT NULL DEFAULT 0 CHECK (usage_count >= 0),
    open_rate       NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (open_rate BETWEEN 0 AND 100),
    ctr             NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (ctr BETWEEN 0 AND 100),
    ai_score        SMALLINT    NOT NULL DEFAULT 0 CHECK (ai_score BETWEEN 0 AND 100),
    created_by      UUID        NOT NULL REFERENCES employees(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_email_templates_tenant   ON email_templates (tenant_id)            WHERE deleted_at IS NULL;
CREATE INDEX idx_email_templates_category ON email_templates (tenant_id, category)  WHERE deleted_at IS NULL;
CREATE INDEX idx_email_templates_status   ON email_templates (tenant_id, status)    WHERE deleted_at IS NULL;

-- 2. email_sequences
CREATE TABLE email_sequences (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('active','paused','draft','completed')),
    enrolled_count  INTEGER     NOT NULL DEFAULT 0 CHECK (enrolled_count >= 0),
    completed_count INTEGER     NOT NULL DEFAULT 0 CHECK (completed_count >= 0),
    open_rate       NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (open_rate BETWEEN 0 AND 100),
    reply_rate      NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (reply_rate BETWEEN 0 AND 100),
    ai_score        SMALLINT    NOT NULL DEFAULT 0 CHECK (ai_score BETWEEN 0 AND 100),
    created_by      UUID        NOT NULL REFERENCES employees(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_email_sequences_tenant ON email_sequences (tenant_id)          WHERE deleted_at IS NULL;
CREATE INDEX idx_email_sequences_status ON email_sequences (tenant_id, status)  WHERE deleted_at IS NULL;

-- 3. email_sequence_steps
CREATE TABLE email_sequence_steps (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    sequence_id     UUID        NOT NULL REFERENCES email_sequences(id),
    step_type       VARCHAR(20) NOT NULL DEFAULT 'email'
                        CHECK (step_type IN ('email','wait','condition','task')),
    step_order      INTEGER     NOT NULL CHECK (step_order >= 0),
    template_id     UUID        REFERENCES email_templates(id),
    delay_hours     INTEGER     CHECK (delay_hours >= 0),
    condition_config JSONB,
    task_title      VARCHAR(300),
    task_assignee   UUID        REFERENCES employees(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_seq_steps_sequence ON email_sequence_steps (tenant_id, sequence_id, step_order) WHERE deleted_at IS NULL;

-- 4. sms_campaigns
CREATE TABLE sms_campaigns (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(255) NOT NULL,
    message         TEXT        NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft','scheduled','sending','sent','failed')),
    recipient_count INTEGER     NOT NULL DEFAULT 0 CHECK (recipient_count >= 0),
    delivered_count INTEGER     NOT NULL DEFAULT 0 CHECK (delivered_count >= 0),
    failed_count    INTEGER     NOT NULL DEFAULT 0 CHECK (failed_count >= 0),
    scheduled_at    TIMESTAMPTZ,
    sent_at         TIMESTAMPTZ,
    created_by      UUID        NOT NULL REFERENCES employees(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_sms_campaigns_tenant ON sms_campaigns (tenant_id)          WHERE deleted_at IS NULL;
CREATE INDEX idx_sms_campaigns_status ON sms_campaigns (tenant_id, status)  WHERE deleted_at IS NULL;
```
