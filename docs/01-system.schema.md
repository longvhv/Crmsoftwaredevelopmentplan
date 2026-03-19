# Phân hệ 01 — Hệ thống lõi (System Core)

> Bảng nền tảng multi-tenant, xác thực, phân quyền, kiểm toán.

---

## 1. `tenants`

Tổ chức thuê hệ thống. Mọi bảng nghiệp vụ đều tham chiếu `tenant_id` để cách ly dữ liệu.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất (UUID v7) |
| `name` | `VARCHAR(255)` | NO | — | UNIQUE, NOT BLANK | Tên tổ chức |
| `slug` | `VARCHAR(100)` | NO | — | UNIQUE, `^[a-z0-9-]+$` | Slug URL-friendly |
| `domain` | `VARCHAR(255)` | YES | `NULL` | UNIQUE khi NOT NULL | Custom domain |
| `logo_url` | `TEXT` | YES | `NULL` | — | URL logo |
| `plan` | `VARCHAR(50)` | NO | `'free'` | CHECK IN ('free','starter','professional','enterprise') | Gói dịch vụ |
| `max_users` | `INTEGER` | NO | `5` | CHECK > 0 | Số user tối đa theo plan |
| `is_active` | `BOOLEAN` | NO | `TRUE` | — | Tenant đang hoạt động |
| `settings` | `JSONB` | NO | `'{}'` | — | Cấu hình mở rộng |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo (UTC) |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật (UTC) |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 2. `users`

Tài khoản đăng nhập hệ thống (con người hoặc service account).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id), NOT NULL | Thuộc tenant nào |
| `email` | `VARCHAR(320)` | NO | — | UNIQUE per tenant, valid email | Email đăng nhập |
| `password_hash` | `VARCHAR(255)` | NO | — | NOT BLANK | Mật khẩu đã hash (bcrypt/argon2) |
| `full_name` | `VARCHAR(255)` | NO | — | NOT BLANK | Họ và tên đầy đủ |
| `avatar_url` | `TEXT` | YES | `NULL` | — | URL ảnh đại diện |
| `phone` | `VARCHAR(20)` | YES | `NULL` | — | Số điện thoại |
| `status` | `VARCHAR(20)` | NO | `'active'` | CHECK IN ('active','inactive','suspended','pending') | Trạng thái tài khoản |
| `user_type` | `VARCHAR(20)` | NO | `'human'` | CHECK IN ('human','service') | Loại tài khoản |
| `last_login_at` | `TIMESTAMPTZ` | YES | `NULL` | — | Lần đăng nhập gần nhất |
| `email_verified_at` | `TIMESTAMPTZ` | YES | `NULL` | — | Thời gian xác minh email |
| `settings` | `JSONB` | NO | `'{}'` | — | Cấu hình cá nhân |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 3. `roles`

Vai trò phân quyền trong hệ thống.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(100)` | NO | — | UNIQUE per tenant, NOT BLANK | Tên vai trò |
| `description` | `TEXT` | YES | `NULL` | — | Mô tả vai trò |
| `permissions` | `JSONB` | NO | `'[]'` | — | Danh sách quyền (array of permission codes) |
| `is_system` | `BOOLEAN` | NO | `FALSE` | — | Vai trò hệ thống (không cho xoá) |
| `department` | `VARCHAR(100)` | YES | `NULL` | — | Phòng ban liên quan |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 4. `departments`

Phòng ban trong tổ chức.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(150)` | NO | — | UNIQUE per tenant, NOT BLANK | Tên phòng ban |
| `code` | `VARCHAR(30)` | NO | — | UNIQUE per tenant | Mã phòng ban |
| `parent_id` | `UUID` | YES | `NULL` | FK → departments(id) | Phòng ban cha (cây phân cấp) |
| `head_user_id` | `UUID` | YES | `NULL` | FK → users(id) | Trưởng phòng |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 5. `user_roles`

Bảng trung gian gán vai trò cho người dùng (N-N).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `user_id` | `UUID` | NO | — | FK → users(id) | Người dùng |
| `role_id` | `UUID` | NO | — | FK → roles(id) | Vai trò |
| `is_primary` | `BOOLEAN` | NO | `FALSE` | — | Vai trò chính (1 user chỉ có 1 primary) |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian gán |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

> **UNIQUE constraint:** `(tenant_id, user_id, role_id)` WHERE `deleted_at IS NULL`

---

## 6. `audit_logs`

Nhật ký thao tác — ghi lại mọi hành động quan trọng trên hệ thống.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `user_id` | `UUID` | YES | `NULL` | FK → users(id) | Người thực hiện (NULL = hệ thống) |
| `action` | `VARCHAR(50)` | NO | — | CHECK IN ('create','update','delete','login','logout','export','import','approve','reject') | Loại hành động |
| `entity_type` | `VARCHAR(100)` | NO | — | NOT BLANK | Loại entity bị tác động (vd: 'contacts') |
| `entity_id` | `UUID` | YES | `NULL` | — | ID entity bị tác động |
| `changes` | `JSONB` | YES | `NULL` | — | Chi tiết thay đổi (before/after) |
| `ip_address` | `INET` | YES | `NULL` | — | Địa chỉ IP |
| `user_agent` | `TEXT` | YES | `NULL` | — | Trình duyệt / client |
| `metadata` | `JSONB` | YES | `NULL` | — | Dữ liệu bổ sung |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian xảy ra |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

> **Lưu ý:** Bảng `audit_logs` thường append-only, `deleted_at` giữ để tuân chuẩn nhưng hiếm khi dùng.

---

## Câu lệnh YSQL

```sql
-- ============================================================
-- PHÂN HỆ 01: HỆ THỐNG LÕI
-- ============================================================

-- 1. tenants
CREATE TABLE tenants (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(100) NOT NULL,
    domain          VARCHAR(255),
    logo_url        TEXT,
    plan            VARCHAR(50) NOT NULL DEFAULT 'free'
                        CHECK (plan IN ('free','starter','professional','enterprise')),
    max_users       INTEGER     NOT NULL DEFAULT 5 CHECK (max_users > 0),
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    settings        JSONB       NOT NULL DEFAULT '{}',
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_tenants_slug   ON tenants (slug)          WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX uk_tenants_domain ON tenants (domain)        WHERE deleted_at IS NULL AND domain IS NOT NULL;
CREATE INDEX idx_tenants_plan         ON tenants (plan)          WHERE deleted_at IS NULL;
CREATE INDEX idx_tenants_is_active    ON tenants (is_active)     WHERE deleted_at IS NULL;

-- 2. users
CREATE TABLE users (
    id                UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id         UUID        NOT NULL REFERENCES tenants(id),
    email             VARCHAR(320) NOT NULL,
    password_hash     VARCHAR(255) NOT NULL,
    full_name         VARCHAR(255) NOT NULL,
    avatar_url        TEXT,
    phone             VARCHAR(20),
    status            VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active','inactive','suspended','pending')),
    user_type         VARCHAR(20) NOT NULL DEFAULT 'human'
                        CHECK (user_type IN ('human','service')),
    last_login_at     TIMESTAMPTZ,
    email_verified_at TIMESTAMPTZ,
    settings          JSONB       NOT NULL DEFAULT '{}',
    version           INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at        TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_users_email    ON users (tenant_id, email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_tenant         ON users (tenant_id)        WHERE deleted_at IS NULL;
CREATE INDEX idx_users_status         ON users (tenant_id, status) WHERE deleted_at IS NULL;

-- 3. roles
CREATE TABLE roles (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    permissions     JSONB       NOT NULL DEFAULT '[]',
    is_system       BOOLEAN     NOT NULL DEFAULT FALSE,
    department      VARCHAR(100),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_roles_name   ON roles (tenant_id, name) WHERE deleted_at IS NULL;
CREATE INDEX idx_roles_tenant       ON roles (tenant_id)       WHERE deleted_at IS NULL;

-- 4. departments
CREATE TABLE departments (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(150) NOT NULL,
    code            VARCHAR(30) NOT NULL,
    parent_id       UUID        REFERENCES departments(id),
    head_user_id    UUID        REFERENCES users(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_departments_name ON departments (tenant_id, name) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX uk_departments_code ON departments (tenant_id, code) WHERE deleted_at IS NULL;
CREATE INDEX idx_departments_parent     ON departments (parent_id)       WHERE deleted_at IS NULL;

-- 5. user_roles
CREATE TABLE user_roles (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    user_id         UUID        NOT NULL REFERENCES users(id),
    role_id         UUID        NOT NULL REFERENCES roles(id),
    is_primary      BOOLEAN     NOT NULL DEFAULT FALSE,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_user_roles ON user_roles (tenant_id, user_id, role_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_roles_user  ON user_roles (tenant_id, user_id)          WHERE deleted_at IS NULL;
CREATE INDEX idx_user_roles_role  ON user_roles (tenant_id, role_id)          WHERE deleted_at IS NULL;

-- 6. audit_logs
CREATE TABLE audit_logs (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    user_id         UUID        REFERENCES users(id),
    action          VARCHAR(50) NOT NULL
                        CHECK (action IN ('create','update','delete','login','logout','export','import','approve','reject')),
    entity_type     VARCHAR(100) NOT NULL,
    entity_id       UUID,
    changes         JSONB,
    ip_address      INET,
    user_agent      TEXT,
    metadata        JSONB,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_audit_logs_tenant      ON audit_logs (tenant_id)                   WHERE deleted_at IS NULL;
CREATE INDEX idx_audit_logs_user        ON audit_logs (tenant_id, user_id)          WHERE deleted_at IS NULL;
CREATE INDEX idx_audit_logs_entity      ON audit_logs (tenant_id, entity_type, entity_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_audit_logs_action      ON audit_logs (tenant_id, action)           WHERE deleted_at IS NULL;
CREATE INDEX idx_audit_logs_created     ON audit_logs (tenant_id, created_at DESC)  WHERE deleted_at IS NULL;
```
