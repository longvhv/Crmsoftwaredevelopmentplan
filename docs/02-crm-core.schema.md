# Phân hệ 02 — CRM Cốt lõi (Core CRM)

> Nhân viên, liên hệ, deal, hoạt động, tag — nền tảng mọi nghiệp vụ CRM.

---

## 1. `employees`

Nhân viên trong tổ chức (con người hoặc AI agent).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `user_id` | `UUID` | YES | `NULL` | FK → users(id), UNIQUE per tenant khi NOT NULL | Liên kết tài khoản đăng nhập |
| `name` | `VARCHAR(255)` | NO | — | NOT BLANK | Họ tên nhân viên |
| `email` | `VARCHAR(320)` | NO | — | UNIQUE per tenant | Email công việc |
| `avatar_url` | `TEXT` | YES | `NULL` | — | URL ảnh đại diện |
| `employee_type` | `VARCHAR(20)` | NO | `'human'` | CHECK IN ('human','ai') | Loại: con người / AI agent |
| `status` | `VARCHAR(20)` | NO | `'active'` | CHECK IN ('active','inactive','on-leave') | Trạng thái hoạt động |
| `primary_role_id` | `UUID` | YES | `NULL` | FK → roles(id) | Vai trò chính |
| `department_id` | `UUID` | YES | `NULL` | FK → departments(id) | Phòng ban chính |
| `join_date` | `DATE` | NO | — | — | Ngày gia nhập |
| `performance_score` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Điểm hiệu suất tổng hợp |
| `performance_trend` | `VARCHAR(10)` | NO | `'stable'` | CHECK IN ('up','down','stable') | Xu hướng hiệu suất |
| `kpi_revenue` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | KPI doanh thu |
| `kpi_activity` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | KPI hoạt động |
| `kpi_quality` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | KPI chất lượng |
| `kpi_ai_collaboration` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | KPI phối hợp AI |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 2. `employee_roles`

Vai trò phụ của nhân viên (N-N với roles).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `employee_id` | `UUID` | NO | — | FK → employees(id) | Nhân viên |
| `role_id` | `UUID` | NO | — | FK → roles(id) | Vai trò phụ |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian gán |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 3. `contacts`

Liên hệ / Khách hàng / Đối tác / Nhà cung cấp.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên liên hệ |
| `email` | `VARCHAR(320)` | NO | — | — | Email liên hệ |
| `phone` | `VARCHAR(30)` | YES | `NULL` | — | Số điện thoại |
| `company` | `VARCHAR(255)` | YES | `NULL` | — | Tên công ty |
| `position` | `VARCHAR(150)` | YES | `NULL` | — | Chức vụ |
| `contact_type` | `VARCHAR(20)` | NO | `'lead'` | CHECK IN ('lead','customer','partner','vendor') | Loại liên hệ |
| `status` | `VARCHAR(20)` | NO | `'active'` | CHECK IN ('active','inactive','prospect','churned') | Trạng thái |
| `source` | `VARCHAR(100)` | YES | `NULL` | — | Nguồn liên hệ (website, referral, …) |
| `assigned_to` | `UUID` | YES | `NULL` | FK → employees(id) | Nhân viên phụ trách |
| `ai_lead_score` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Điểm chất lượng lead (AI) |
| `engagement_score` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Điểm tương tác |
| `last_contact_date` | `TIMESTAMPTZ` | YES | `NULL` | — | Lần liên hệ gần nhất |
| `notes` | `TEXT` | YES | `NULL` | — | Ghi chú |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 4. `deals`

Cơ hội kinh doanh trong pipeline.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `title` | `VARCHAR(300)` | NO | — | NOT BLANK | Tiêu đề deal |
| `contact_id` | `UUID` | NO | — | FK → contacts(id) | Liên hệ liên quan |
| `company` | `VARCHAR(255)` | YES | `NULL` | — | Tên công ty (denormalized) |
| `value` | `NUMERIC(15,2)` | NO | `0` | CHECK >= 0 | Giá trị deal |
| `currency` | `VARCHAR(3)` | NO | `'VND'` | CHECK length = 3 (ISO 4217) | Đơn vị tiền tệ |
| `stage` | `VARCHAR(30)` | NO | `'qualification'` | CHECK IN ('qualification','discovery','proposal','negotiation','closed-won','closed-lost') | Giai đoạn pipeline |
| `priority` | `VARCHAR(10)` | NO | `'warm'` | CHECK IN ('hot','warm','cold') | Mức ưu tiên |
| `probability` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Xác suất thắng (%) |
| `assigned_to` | `UUID` | YES | `NULL` | FK → employees(id) | Sales phụ trách |
| `expected_close_date` | `DATE` | YES | `NULL` | — | Ngày dự kiến đóng deal |
| `ai_win_probability` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | AI dự đoán xác suất thắng |
| `ai_next_action` | `TEXT` | YES | `NULL` | — | AI gợi ý hành động tiếp theo |
| `notes` | `TEXT` | YES | `NULL` | — | Ghi chú |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 5. `activities`

Hoạt động CRM: gọi điện, gửi email, họp, ghi chú, công việc.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `activity_type` | `VARCHAR(20)` | NO | — | CHECK IN ('call','email','meeting','note','task') | Loại hoạt động |
| `title` | `VARCHAR(300)` | NO | — | NOT BLANK | Tiêu đề |
| `description` | `TEXT` | YES | `NULL` | — | Nội dung chi tiết |
| `contact_id` | `UUID` | YES | `NULL` | FK → contacts(id) | Liên hệ liên quan |
| `deal_id` | `UUID` | YES | `NULL` | FK → deals(id) | Deal liên quan |
| `performed_by` | `UUID` | NO | — | FK → employees(id) | Người thực hiện |
| `performed_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời điểm thực hiện |
| `duration_minutes` | `INTEGER` | YES | `NULL` | CHECK >= 0 | Thời lượng (phút) |
| `is_auto_logged` | `BOOLEAN` | NO | `FALSE` | — | AI tự động ghi hay con người |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 6. `tags`

Bảng tag dùng chung cho mọi entity trong hệ thống.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(100)` | NO | — | UNIQUE per tenant, NOT BLANK | Tên tag |
| `color` | `VARCHAR(30)` | YES | `NULL` | — | Màu hiển thị (CSS class hoặc hex) |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 7. `entity_tags`

Gắn tag cho bất kỳ entity nào (polymorphic N-N).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `tag_id` | `UUID` | NO | — | FK → tags(id) | Tag |
| `entity_type` | `VARCHAR(50)` | NO | — | NOT BLANK | Loại entity ('contacts','deals','leads',…) |
| `entity_id` | `UUID` | NO | — | — | ID entity |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian gắn tag |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

> **UNIQUE constraint:** `(tenant_id, tag_id, entity_type, entity_id)` WHERE `deleted_at IS NULL`

---

## Câu lệnh YSQL

```sql
-- ============================================================
-- PHÂN HỆ 02: CRM CỐT LÕI
-- ============================================================

-- 1. employees
CREATE TABLE employees (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    user_id             UUID        REFERENCES users(id),
    name                VARCHAR(255) NOT NULL,
    email               VARCHAR(320) NOT NULL,
    avatar_url          TEXT,
    employee_type       VARCHAR(20) NOT NULL DEFAULT 'human'
                            CHECK (employee_type IN ('human','ai')),
    status              VARCHAR(20) NOT NULL DEFAULT 'active'
                            CHECK (status IN ('active','inactive','on-leave')),
    primary_role_id     UUID        REFERENCES roles(id),
    department_id       UUID        REFERENCES departments(id),
    join_date           DATE        NOT NULL,
    performance_score   SMALLINT    NOT NULL DEFAULT 0 CHECK (performance_score BETWEEN 0 AND 100),
    performance_trend   VARCHAR(10) NOT NULL DEFAULT 'stable'
                            CHECK (performance_trend IN ('up','down','stable')),
    kpi_revenue         SMALLINT    NOT NULL DEFAULT 0 CHECK (kpi_revenue BETWEEN 0 AND 100),
    kpi_activity        SMALLINT    NOT NULL DEFAULT 0 CHECK (kpi_activity BETWEEN 0 AND 100),
    kpi_quality         SMALLINT    NOT NULL DEFAULT 0 CHECK (kpi_quality BETWEEN 0 AND 100),
    kpi_ai_collaboration SMALLINT   NOT NULL DEFAULT 0 CHECK (kpi_ai_collaboration BETWEEN 0 AND 100),
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_employees_email   ON employees (tenant_id, email)   WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX uk_employees_user    ON employees (tenant_id, user_id) WHERE deleted_at IS NULL AND user_id IS NOT NULL;
CREATE INDEX idx_employees_tenant        ON employees (tenant_id)          WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_type          ON employees (tenant_id, employee_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_department    ON employees (tenant_id, department_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_status        ON employees (tenant_id, status)  WHERE deleted_at IS NULL;

-- 2. employee_roles
CREATE TABLE employee_roles (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    employee_id     UUID        NOT NULL REFERENCES employees(id),
    role_id         UUID        NOT NULL REFERENCES roles(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_employee_roles ON employee_roles (tenant_id, employee_id, role_id) WHERE deleted_at IS NULL;

-- 3. contacts
CREATE TABLE contacts (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    name                VARCHAR(255) NOT NULL,
    email               VARCHAR(320) NOT NULL,
    phone               VARCHAR(30),
    company             VARCHAR(255),
    position            VARCHAR(150),
    contact_type        VARCHAR(20) NOT NULL DEFAULT 'lead'
                            CHECK (contact_type IN ('lead','customer','partner','vendor')),
    status              VARCHAR(20) NOT NULL DEFAULT 'active'
                            CHECK (status IN ('active','inactive','prospect','churned')),
    source              VARCHAR(100),
    assigned_to         UUID        REFERENCES employees(id),
    ai_lead_score       SMALLINT    NOT NULL DEFAULT 0 CHECK (ai_lead_score BETWEEN 0 AND 100),
    engagement_score    SMALLINT    NOT NULL DEFAULT 0 CHECK (engagement_score BETWEEN 0 AND 100),
    last_contact_date   TIMESTAMPTZ,
    notes               TEXT,
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_contacts_tenant        ON contacts (tenant_id)               WHERE deleted_at IS NULL;
CREATE INDEX idx_contacts_type          ON contacts (tenant_id, contact_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_contacts_status        ON contacts (tenant_id, status)       WHERE deleted_at IS NULL;
CREATE INDEX idx_contacts_assigned      ON contacts (tenant_id, assigned_to)  WHERE deleted_at IS NULL;
CREATE INDEX idx_contacts_company       ON contacts (tenant_id, company)      WHERE deleted_at IS NULL;
CREATE INDEX idx_contacts_email         ON contacts (tenant_id, email)        WHERE deleted_at IS NULL;
CREATE INDEX idx_contacts_ai_score      ON contacts (tenant_id, ai_lead_score DESC) WHERE deleted_at IS NULL;

-- 4. deals
CREATE TABLE deals (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    title               VARCHAR(300) NOT NULL,
    contact_id          UUID        NOT NULL REFERENCES contacts(id),
    company             VARCHAR(255),
    value               NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (value >= 0),
    currency            VARCHAR(3)  NOT NULL DEFAULT 'VND',
    stage               VARCHAR(30) NOT NULL DEFAULT 'qualification'
                            CHECK (stage IN ('qualification','discovery','proposal','negotiation','closed-won','closed-lost')),
    priority            VARCHAR(10) NOT NULL DEFAULT 'warm'
                            CHECK (priority IN ('hot','warm','cold')),
    probability         SMALLINT    NOT NULL DEFAULT 0 CHECK (probability BETWEEN 0 AND 100),
    assigned_to         UUID        REFERENCES employees(id),
    expected_close_date DATE,
    ai_win_probability  SMALLINT    NOT NULL DEFAULT 0 CHECK (ai_win_probability BETWEEN 0 AND 100),
    ai_next_action      TEXT,
    notes               TEXT,
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_deals_tenant       ON deals (tenant_id)                WHERE deleted_at IS NULL;
CREATE INDEX idx_deals_stage        ON deals (tenant_id, stage)         WHERE deleted_at IS NULL;
CREATE INDEX idx_deals_priority     ON deals (tenant_id, priority)      WHERE deleted_at IS NULL;
CREATE INDEX idx_deals_assigned     ON deals (tenant_id, assigned_to)   WHERE deleted_at IS NULL;
CREATE INDEX idx_deals_contact      ON deals (tenant_id, contact_id)    WHERE deleted_at IS NULL;
CREATE INDEX idx_deals_close_date   ON deals (tenant_id, expected_close_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_deals_value        ON deals (tenant_id, value DESC)    WHERE deleted_at IS NULL;

-- 5. activities
CREATE TABLE activities (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    activity_type       VARCHAR(20) NOT NULL
                            CHECK (activity_type IN ('call','email','meeting','note','task')),
    title               VARCHAR(300) NOT NULL,
    description         TEXT,
    contact_id          UUID        REFERENCES contacts(id),
    deal_id             UUID        REFERENCES deals(id),
    performed_by        UUID        NOT NULL REFERENCES employees(id),
    performed_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    duration_minutes    INTEGER     CHECK (duration_minutes >= 0),
    is_auto_logged      BOOLEAN     NOT NULL DEFAULT FALSE,
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_activities_tenant      ON activities (tenant_id)                       WHERE deleted_at IS NULL;
CREATE INDEX idx_activities_type        ON activities (tenant_id, activity_type)        WHERE deleted_at IS NULL;
CREATE INDEX idx_activities_contact     ON activities (tenant_id, contact_id)           WHERE deleted_at IS NULL;
CREATE INDEX idx_activities_deal        ON activities (tenant_id, deal_id)              WHERE deleted_at IS NULL;
CREATE INDEX idx_activities_performed   ON activities (tenant_id, performed_by)         WHERE deleted_at IS NULL;
CREATE INDEX idx_activities_date        ON activities (tenant_id, performed_at DESC)    WHERE deleted_at IS NULL;

-- 6. tags
CREATE TABLE tags (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(100) NOT NULL,
    color           VARCHAR(30),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_tags_name ON tags (tenant_id, name) WHERE deleted_at IS NULL;

-- 7. entity_tags
CREATE TABLE entity_tags (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    tag_id          UUID        NOT NULL REFERENCES tags(id),
    entity_type     VARCHAR(50) NOT NULL,
    entity_id       UUID        NOT NULL,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_entity_tags ON entity_tags (tenant_id, tag_id, entity_type, entity_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_entity_tags_entity ON entity_tags (tenant_id, entity_type, entity_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_entity_tags_tag    ON entity_tags (tenant_id, tag_id)                 WHERE deleted_at IS NULL;
```
