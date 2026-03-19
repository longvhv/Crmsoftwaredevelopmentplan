-- ============================================================
-- V009: Cấu hình & Quản trị
-- Phân hệ: 16-settings
-- Phụ thuộc: V001, V002 (tenants, users, employees)
-- ============================================================

CREATE TABLE crm_settings_categories (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(200) NOT NULL,
    slug            VARCHAR(200) NOT NULL,
    description     TEXT,
    icon            VARCHAR(50),
    sort_order      INTEGER     NOT NULL DEFAULT 0,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_settings_cat_slug ON crm_settings_categories (tenant_id, slug) WHERE deleted_at IS NULL;

CREATE TABLE custom_fields (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    entity_type     VARCHAR(50) NOT NULL,
    field_name      VARCHAR(100) NOT NULL,
    field_label     VARCHAR(200) NOT NULL,
    field_type      VARCHAR(20) NOT NULL DEFAULT 'text'
                        CHECK (field_type IN ('text','number','date','boolean','select','multi-select','email','phone','url','textarea')),
    options         JSONB,
    is_required     BOOLEAN     NOT NULL DEFAULT FALSE,
    is_searchable   BOOLEAN     NOT NULL DEFAULT FALSE,
    sort_order      INTEGER     NOT NULL DEFAULT 0,
    default_value   TEXT,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_custom_fields ON custom_fields (tenant_id, entity_type, field_name) WHERE deleted_at IS NULL;
CREATE INDEX idx_custom_fields_entity ON custom_fields (tenant_id, entity_type) WHERE deleted_at IS NULL;

CREATE TABLE automation_rules (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    trigger_event   VARCHAR(100) NOT NULL,
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

CREATE INDEX idx_automation_rules ON automation_rules (tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE workflow_definitions (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    workflow_type   VARCHAR(30) NOT NULL DEFAULT 'approval'
                        CHECK (workflow_type IN ('approval','onboarding','escalation','notification','custom')),
    status          VARCHAR(20) NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft','active','inactive')),
    steps           JSONB       NOT NULL DEFAULT '[]',
    trigger_conditions JSONB    NOT NULL DEFAULT '{}',
    created_by      UUID        REFERENCES employees(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_workflow_defs ON workflow_definitions (tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE notification_preferences (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    user_id         UUID        NOT NULL REFERENCES users(id),
    channel         VARCHAR(20) NOT NULL CHECK (channel IN ('email','push','sms','in-app')),
    event_type      VARCHAR(100) NOT NULL,
    is_enabled      BOOLEAN     NOT NULL DEFAULT TRUE,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_notif_prefs ON notification_preferences (tenant_id, user_id, channel, event_type) WHERE deleted_at IS NULL;

CREATE TABLE webhooks (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(200) NOT NULL,
    url             TEXT        NOT NULL,
    events          JSONB       NOT NULL DEFAULT '[]',
    secret          VARCHAR(255),
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    last_triggered_at TIMESTAMPTZ,
    failure_count   INTEGER     NOT NULL DEFAULT 0 CHECK (failure_count >= 0),
    created_by      UUID        REFERENCES employees(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_webhooks ON webhooks (tenant_id) WHERE deleted_at IS NULL;
