-- ============================================================
-- V001: Hệ thống lõi (System Core)
-- Phân hệ: 01-system
-- Phụ thuộc: Không (root migration)
-- ============================================================

-- 1. tenants
CREATE TABLE tenants (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL, -- self-reference hoặc parent
    name            VARCHAR(255) NOT NULL,
    domain          VARCHAR(200),
    plan            VARCHAR(30) NOT NULL DEFAULT 'trial'
                        CHECK (plan IN ('trial','starter','professional','enterprise')),
    status          VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active','suspended','cancelled')),
    settings        JSONB       NOT NULL DEFAULT '{}',
    max_users       INTEGER     NOT NULL DEFAULT 10 CHECK (max_users > 0),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_tenants_domain ON tenants (domain) WHERE deleted_at IS NULL AND domain IS NOT NULL;

-- 2. users
CREATE TABLE users (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    email           VARCHAR(320) NOT NULL,
    display_name    VARCHAR(200) NOT NULL,
    password_hash   VARCHAR(500),
    avatar_url      TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active','inactive','locked','pending')),
    last_login_at   TIMESTAMPTZ,
    mfa_enabled     BOOLEAN     NOT NULL DEFAULT FALSE,
    locale          VARCHAR(10) NOT NULL DEFAULT 'vi-VN',
    timezone        VARCHAR(50) NOT NULL DEFAULT 'Asia/Ho_Chi_Minh',
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_users_email ON users (tenant_id, email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_tenant     ON users (tenant_id)         WHERE deleted_at IS NULL;

-- 3. roles
CREATE TABLE roles (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    permissions     JSONB       NOT NULL DEFAULT '[]',
    is_system       BOOLEAN     NOT NULL DEFAULT FALSE,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_roles_name ON roles (tenant_id, name) WHERE deleted_at IS NULL;

-- 4. departments
CREATE TABLE departments (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(200) NOT NULL,
    parent_id       UUID        REFERENCES departments(id),
    head_user_id    UUID        REFERENCES users(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_departments_name ON departments (tenant_id, name) WHERE deleted_at IS NULL;

-- 5. user_roles (N-N)
CREATE TABLE user_roles (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    user_id         UUID        NOT NULL REFERENCES users(id),
    role_id         UUID        NOT NULL REFERENCES roles(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_user_roles ON user_roles (tenant_id, user_id, role_id) WHERE deleted_at IS NULL;

-- 6. audit_logs
CREATE TABLE audit_logs (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    user_id         UUID        REFERENCES users(id),
    action          VARCHAR(50) NOT NULL,
    entity_type     VARCHAR(100) NOT NULL,
    entity_id       UUID,
    changes         JSONB       NOT NULL DEFAULT '{}',
    ip_address      INET,
    user_agent      TEXT,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_audit_logs_tenant  ON audit_logs (tenant_id)                    WHERE deleted_at IS NULL;
CREATE INDEX idx_audit_logs_user    ON audit_logs (tenant_id, user_id)           WHERE deleted_at IS NULL;
CREATE INDEX idx_audit_logs_entity  ON audit_logs (tenant_id, entity_type, entity_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_audit_logs_date    ON audit_logs (tenant_id, created_at DESC)   WHERE deleted_at IS NULL;
