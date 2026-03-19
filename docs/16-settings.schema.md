# Phân hệ 16 — Cấu hình & Quản trị (Settings & Config)

> Danh mục cấu hình, trường tuỳ chỉnh, automation, workflow, thông báo, webhook.

---

## 1. `crm_settings_categories`

Danh mục cấu hình CRM (loại liên hệ, nguồn lead, giai đoạn deal, …).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `group_name` | `VARCHAR(100)` | NO | — | NOT BLANK | Nhóm danh mục (contact_types, sources, stages, …) |
| `item_key` | `VARCHAR(100)` | NO | — | NOT BLANK | Khoá mục (vd: 'customer','referral') |
| `item_label` | `VARCHAR(200)` | NO | — | NOT BLANK | Nhãn hiển thị |
| `color` | `VARCHAR(50)` | YES | `NULL` | — | Màu CSS class hoặc hex |
| `sort_order` | `INTEGER` | NO | `0` | — | Thứ tự |
| `is_system` | `BOOLEAN` | NO | `FALSE` | — | Mục hệ thống (không cho xoá) |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

> **UNIQUE:** `(tenant_id, group_name, item_key)` WHERE `deleted_at IS NULL`

---

## 2. `custom_fields`

Trường tuỳ chỉnh do người dùng tạo cho các entity.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `entity_type` | `VARCHAR(50)` | NO | — | NOT BLANK | Entity áp dụng ('contacts','deals',…) |
| `field_key` | `VARCHAR(100)` | NO | — | NOT BLANK, `^[a-z0-9_]+$` | Khoá trường (snake_case) |
| `field_label` | `VARCHAR(200)` | NO | — | NOT BLANK | Nhãn hiển thị |
| `field_type` | `VARCHAR(20)` | NO | — | CHECK IN ('text','number','date','boolean','select','multi-select','url','email','phone') | Kiểu trường |
| `options` | `JSONB` | YES | `NULL` | Required khi field_type IN ('select','multi-select') | Tuỳ chọn [{value,label}] |
| `is_required` | `BOOLEAN` | NO | `FALSE` | — | Bắt buộc nhập |
| `default_value` | `TEXT` | YES | `NULL` | — | Giá trị mặc định |
| `sort_order` | `INTEGER` | NO | `0` | — | Thứ tự hiển thị |
| `is_active` | `BOOLEAN` | NO | `TRUE` | — | Đang kích hoạt |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

> **UNIQUE:** `(tenant_id, entity_type, field_key)` WHERE `deleted_at IS NULL`

---

## 3. `automation_rules`

Quy tắc tự động hoá (trigger → condition → action).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên quy tắc |
| `description` | `TEXT` | YES | `NULL` | — | Mô tả |
| `trigger_type` | `VARCHAR(50)` | NO | — | NOT BLANK | Sự kiện kích hoạt |
| `trigger_config` | `JSONB` | NO | `'{}'` | — | Cấu hình trigger |
| `conditions` | `JSONB` | NO | `'[]'` | — | Điều kiện lọc |
| `actions` | `JSONB` | NO | `'[]'` | — | Hành động thực thi |
| `is_active` | `BOOLEAN` | NO | `TRUE` | — | Đang bật |
| `execution_count` | `INTEGER` | NO | `0` | CHECK >= 0 | Số lần đã chạy |
| `last_executed_at` | `TIMESTAMPTZ` | YES | `NULL` | — | Lần chạy gần nhất |
| `created_by` | `UUID` | YES | `NULL` | FK → employees(id) | Người tạo |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 4. `workflow_definitions`

Định nghĩa workflow (quy trình phê duyệt, onboarding, …).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên workflow |
| `description` | `TEXT` | YES | `NULL` | — | Mô tả |
| `workflow_type` | `VARCHAR(30)` | NO | `'approval'` | CHECK IN ('approval','onboarding','escalation','notification','custom') | Loại workflow |
| `trigger_entity` | `VARCHAR(50)` | YES | `NULL` | — | Entity kích hoạt ('deals','contracts',…) |
| `steps` | `JSONB` | NO | `'[]'` | — | Các bước [{id,type,config,nextStepId}] |
| `is_active` | `BOOLEAN` | NO | `TRUE` | — | Đang bật |
| `created_by` | `UUID` | YES | `NULL` | FK → employees(id) | Người tạo |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 5. `notification_preferences`

Cấu hình thông báo của từng người dùng.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `user_id` | `UUID` | NO | — | FK → users(id), UNIQUE per tenant | Người dùng |
| `email_enabled` | `BOOLEAN` | NO | `TRUE` | — | Nhận thông báo email |
| `push_enabled` | `BOOLEAN` | NO | `TRUE` | — | Nhận push notification |
| `sms_enabled` | `BOOLEAN` | NO | `FALSE` | — | Nhận SMS |
| `preferences` | `JSONB` | NO | `'{}'` | — | Chi tiết cấu hình theo loại sự kiện |
| `quiet_hours_start` | `TIMETZ` | YES | `NULL` | — | Giờ bắt đầu không làm phiền |
| `quiet_hours_end` | `TIMETZ` | YES | `NULL` | — | Giờ kết thúc không làm phiền |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 6. `webhooks`

Cấu hình webhook đẩy sự kiện ra bên ngoài.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên webhook |
| `url` | `TEXT` | NO | — | Valid URL | URL endpoint |
| `secret` | `VARCHAR(255)` | YES | `NULL` | — | Secret key để verify |
| `events` | `JSONB` | NO | `'[]'` | — | Danh sách sự kiện đăng ký ['deal.created','contact.updated',…] |
| `is_active` | `BOOLEAN` | NO | `TRUE` | — | Đang bật |
| `last_triggered_at` | `TIMESTAMPTZ` | YES | `NULL` | — | Lần trigger gần nhất |
| `failure_count` | `INTEGER` | NO | `0` | CHECK >= 0 | Số lần thất bại liên tiếp |
| `created_by` | `UUID` | YES | `NULL` | FK → employees(id) | Người tạo |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## Câu lệnh YSQL

```sql
-- ============================================================
-- PHÂN HỆ 16: CẤU HÌNH & QUẢN TRỊ
-- ============================================================

-- 1. crm_settings_categories
CREATE TABLE crm_settings_categories (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    group_name      VARCHAR(100) NOT NULL,
    item_key        VARCHAR(100) NOT NULL,
    item_label      VARCHAR(200) NOT NULL,
    color           VARCHAR(50),
    sort_order      INTEGER     NOT NULL DEFAULT 0,
    is_system       BOOLEAN     NOT NULL DEFAULT FALSE,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_settings_categories ON crm_settings_categories (tenant_id, group_name, item_key) WHERE deleted_at IS NULL;
CREATE INDEX idx_settings_categories_group ON crm_settings_categories (tenant_id, group_name) WHERE deleted_at IS NULL;

-- 2. custom_fields
CREATE TABLE custom_fields (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    entity_type     VARCHAR(50) NOT NULL,
    field_key       VARCHAR(100) NOT NULL,
    field_label     VARCHAR(200) NOT NULL,
    field_type      VARCHAR(20) NOT NULL
                        CHECK (field_type IN ('text','number','date','boolean','select','multi-select','url','email','phone')),
    options         JSONB,
    is_required     BOOLEAN     NOT NULL DEFAULT FALSE,
    default_value   TEXT,
    sort_order      INTEGER     NOT NULL DEFAULT 0,
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_custom_fields ON custom_fields (tenant_id, entity_type, field_key) WHERE deleted_at IS NULL;
CREATE INDEX idx_custom_fields_entity ON custom_fields (tenant_id, entity_type) WHERE deleted_at IS NULL;

-- 3. automation_rules
CREATE TABLE automation_rules (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    trigger_type    VARCHAR(50) NOT NULL,
    trigger_config  JSONB       NOT NULL DEFAULT '{}',
    conditions      JSONB       NOT NULL DEFAULT '[]',
    actions         JSONB       NOT NULL DEFAULT '[]',
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    execution_count INTEGER     NOT NULL DEFAULT 0 CHECK (execution_count >= 0),
    last_executed_at TIMESTAMPTZ,
    created_by      UUID        REFERENCES employees(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_automation_rules_tenant ON automation_rules (tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_automation_rules_active ON automation_rules (tenant_id, is_active) WHERE deleted_at IS NULL;

-- 4. workflow_definitions
CREATE TABLE workflow_definitions (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    workflow_type   VARCHAR(30) NOT NULL DEFAULT 'approval'
                        CHECK (workflow_type IN ('approval','onboarding','escalation','notification','custom')),
    trigger_entity  VARCHAR(50),
    steps           JSONB       NOT NULL DEFAULT '[]',
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    created_by      UUID        REFERENCES employees(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_workflow_defs_tenant ON workflow_definitions (tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_workflow_defs_type   ON workflow_definitions (tenant_id, workflow_type) WHERE deleted_at IS NULL;

-- 5. notification_preferences
CREATE TABLE notification_preferences (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    user_id         UUID        NOT NULL REFERENCES users(id),
    email_enabled   BOOLEAN     NOT NULL DEFAULT TRUE,
    push_enabled    BOOLEAN     NOT NULL DEFAULT TRUE,
    sms_enabled     BOOLEAN     NOT NULL DEFAULT FALSE,
    preferences     JSONB       NOT NULL DEFAULT '{}',
    quiet_hours_start TIMETZ,
    quiet_hours_end   TIMETZ,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_notif_prefs ON notification_preferences (tenant_id, user_id) WHERE deleted_at IS NULL;

-- 6. webhooks
CREATE TABLE webhooks (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(255) NOT NULL,
    url             TEXT        NOT NULL,
    secret          VARCHAR(255),
    events          JSONB       NOT NULL DEFAULT '[]',
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    last_triggered_at TIMESTAMPTZ,
    failure_count   INTEGER     NOT NULL DEFAULT 0 CHECK (failure_count >= 0),
    created_by      UUID        REFERENCES employees(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_webhooks_tenant ON webhooks (tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_webhooks_active ON webhooks (tenant_id, is_active) WHERE deleted_at IS NULL;
```
