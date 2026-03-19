-- ============================================================
-- V002: CRM Cốt lõi
-- Phân hệ: 02-crm-core
-- Phụ thuộc: V001 (tenants, users, departments)
-- ============================================================

-- 1. employees
CREATE TABLE employees (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    user_id         UUID        REFERENCES users(id),
    employee_code   VARCHAR(50),
    full_name       VARCHAR(200) NOT NULL,
    email           VARCHAR(320) NOT NULL,
    phone           VARCHAR(30),
    avatar_url      TEXT,
    department_id   UUID        REFERENCES departments(id),
    position        VARCHAR(100),
    employee_type   VARCHAR(20) NOT NULL DEFAULT 'human'
                        CHECK (employee_type IN ('human','ai-agent')),
    status          VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active','inactive','on-leave')),
    hire_date       DATE,
    manager_id      UUID        REFERENCES employees(id),
    skills          JSONB       NOT NULL DEFAULT '[]',
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_employees_code  ON employees (tenant_id, employee_code) WHERE deleted_at IS NULL AND employee_code IS NOT NULL;
CREATE UNIQUE INDEX uk_employees_email ON employees (tenant_id, email)         WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_tenant      ON employees (tenant_id)                WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_dept        ON employees (tenant_id, department_id) WHERE deleted_at IS NULL;

-- 2. employee_roles (N-N)
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
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100),
    full_name       VARCHAR(200) GENERATED ALWAYS AS (
                        CASE WHEN last_name IS NOT NULL THEN first_name || ' ' || last_name ELSE first_name END
                    ) STORED,
    email           VARCHAR(320),
    phone           VARCHAR(30),
    company         VARCHAR(255),
    job_title       VARCHAR(200),
    contact_type    VARCHAR(20) NOT NULL DEFAULT 'customer'
                        CHECK (contact_type IN ('customer','lead','partner','vendor','other')),
    status          VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active','inactive','churned')),
    source          VARCHAR(50),
    owner_id        UUID        REFERENCES employees(id),
    address         JSONB       NOT NULL DEFAULT '{}',
    social_profiles JSONB       NOT NULL DEFAULT '{}',
    custom_fields   JSONB       NOT NULL DEFAULT '{}',
    lead_score      SMALLINT    CHECK (lead_score IS NULL OR lead_score BETWEEN 0 AND 100),
    lifetime_value  NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (lifetime_value >= 0),
    last_activity_at TIMESTAMPTZ,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_contacts_tenant    ON contacts (tenant_id)              WHERE deleted_at IS NULL;
CREATE INDEX idx_contacts_email     ON contacts (tenant_id, email)       WHERE deleted_at IS NULL AND email IS NOT NULL;
CREATE INDEX idx_contacts_company   ON contacts (tenant_id, company)     WHERE deleted_at IS NULL AND company IS NOT NULL;
CREATE INDEX idx_contacts_owner     ON contacts (tenant_id, owner_id)    WHERE deleted_at IS NULL;
CREATE INDEX idx_contacts_type      ON contacts (tenant_id, contact_type) WHERE deleted_at IS NULL;

-- 4. deals
CREATE TABLE deals (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(300) NOT NULL,
    contact_id      UUID        REFERENCES contacts(id),
    value           NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (value >= 0),
    currency        VARCHAR(3)  NOT NULL DEFAULT 'USD',
    stage           VARCHAR(50) NOT NULL DEFAULT 'qualification',
    probability     SMALLINT    NOT NULL DEFAULT 0 CHECK (probability BETWEEN 0 AND 100),
    owner_id        UUID        REFERENCES employees(id),
    source          VARCHAR(50),
    expected_close_date DATE,
    actual_close_date   DATE,
    won             BOOLEAN,
    lost_reason     TEXT,
    pipeline        VARCHAR(100) NOT NULL DEFAULT 'default',
    custom_fields   JSONB       NOT NULL DEFAULT '{}',
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_deals_tenant   ON deals (tenant_id)                WHERE deleted_at IS NULL;
CREATE INDEX idx_deals_contact  ON deals (tenant_id, contact_id)    WHERE deleted_at IS NULL;
CREATE INDEX idx_deals_owner    ON deals (tenant_id, owner_id)      WHERE deleted_at IS NULL;
CREATE INDEX idx_deals_stage    ON deals (tenant_id, stage)         WHERE deleted_at IS NULL;
CREATE INDEX idx_deals_pipeline ON deals (tenant_id, pipeline)      WHERE deleted_at IS NULL;

-- 5. activities
CREATE TABLE activities (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    activity_type   VARCHAR(20) NOT NULL
                        CHECK (activity_type IN ('call','email','meeting','note','task')),
    subject         VARCHAR(300) NOT NULL,
    description     TEXT,
    contact_id      UUID        REFERENCES contacts(id),
    deal_id         UUID        REFERENCES deals(id),
    owner_id        UUID        REFERENCES employees(id),
    status          VARCHAR(20) NOT NULL DEFAULT 'planned'
                        CHECK (status IN ('planned','in-progress','completed','cancelled')),
    priority        VARCHAR(10) NOT NULL DEFAULT 'medium'
                        CHECK (priority IN ('low','medium','high','urgent')),
    due_date        TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    outcome         TEXT,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_activities_tenant  ON activities (tenant_id)                WHERE deleted_at IS NULL;
CREATE INDEX idx_activities_contact ON activities (tenant_id, contact_id)    WHERE deleted_at IS NULL;
CREATE INDEX idx_activities_deal    ON activities (tenant_id, deal_id)       WHERE deleted_at IS NULL;
CREATE INDEX idx_activities_owner   ON activities (tenant_id, owner_id)      WHERE deleted_at IS NULL;
CREATE INDEX idx_activities_date    ON activities (tenant_id, due_date)      WHERE deleted_at IS NULL;

-- 6. tags
CREATE TABLE tags (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(100) NOT NULL,
    color           VARCHAR(20),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_tags_name ON tags (tenant_id, name) WHERE deleted_at IS NULL;

-- 7. entity_tags (polymorphic N-N)
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
