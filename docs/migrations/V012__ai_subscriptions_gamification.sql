-- ============================================================
-- V012: AI, Subscriptions, Gamification, Integrations, Compliance
-- Phân hệ: 22, 23, 24, 25, 26
-- Phụ thuộc: V001-V011
-- ============================================================

-- ======== AI & AUTOMATION (22) ========

CREATE TABLE chatbot_training_data (
    id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id               UUID        NOT NULL REFERENCES tenants(id),
    intent                  VARCHAR(200) NOT NULL,
    category                VARCHAR(100),
    training_phrases        JSONB       NOT NULL DEFAULT '[]',
    response_templates      JSONB       NOT NULL DEFAULT '[]',
    context                 JSONB       NOT NULL DEFAULT '{}',
    confidence_threshold    NUMERIC(3,2) NOT NULL DEFAULT 0.70 CHECK (confidence_threshold BETWEEN 0 AND 1),
    is_active               BOOLEAN     NOT NULL DEFAULT TRUE,
    usage_count             INTEGER     NOT NULL DEFAULT 0 CHECK (usage_count >= 0),
    accuracy_rate           NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (accuracy_rate BETWEEN 0 AND 100),
    created_by              UUID        REFERENCES employees(id),
    version                 INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at              TIMESTAMPTZ
);

CREATE INDEX idx_chatbot ON chatbot_training_data (tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE ai_models (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    name                VARCHAR(255) NOT NULL,
    model_type          VARCHAR(30) NOT NULL
                            CHECK (model_type IN ('lead-scoring','churn-prediction','deal-forecast','sentiment','recommendation','classification')),
    status              VARCHAR(20) NOT NULL DEFAULT 'training'
                            CHECK (status IN ('training','deployed','retired','failed')),
    accuracy            NUMERIC(5,2) CHECK (accuracy IS NULL OR accuracy BETWEEN 0 AND 100),
    precision_score     NUMERIC(5,2) CHECK (precision_score IS NULL OR precision_score BETWEEN 0 AND 100),
    recall_score        NUMERIC(5,2) CHECK (recall_score IS NULL OR recall_score BETWEEN 0 AND 100),
    training_data_size  INTEGER     NOT NULL DEFAULT 0 CHECK (training_data_size >= 0),
    last_trained_at     TIMESTAMPTZ,
    deployed_at         TIMESTAMPTZ,
    config              JSONB       NOT NULL DEFAULT '{}',
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_ai_models ON ai_models (tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE data_enrichment_jobs (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(255) NOT NULL,
    source          VARCHAR(50) NOT NULL
                        CHECK (source IN ('clearbit','zoominfo','linkedin','manual','ai-generated')),
    entity_type     VARCHAR(50) NOT NULL DEFAULT 'contacts',
    status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','running','completed','failed')),
    total_records   INTEGER     NOT NULL DEFAULT 0 CHECK (total_records >= 0),
    enriched_records INTEGER    NOT NULL DEFAULT 0 CHECK (enriched_records >= 0),
    failed_records  INTEGER     NOT NULL DEFAULT 0 CHECK (failed_records >= 0),
    fields_enriched JSONB       NOT NULL DEFAULT '[]',
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    triggered_by    UUID        REFERENCES employees(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_enrichment ON data_enrichment_jobs (tenant_id) WHERE deleted_at IS NULL;

-- ======== SUBSCRIPTIONS & CURRENCY (23) ========

CREATE TABLE subscriptions (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    contact_id      UUID        NOT NULL REFERENCES contacts(id),
    product_id      UUID        REFERENCES products(id),
    plan_name       VARCHAR(100) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active','trial','past-due','cancelled','expired','paused')),
    billing_cycle   VARCHAR(15) NOT NULL DEFAULT 'monthly'
                        CHECK (billing_cycle IN ('monthly','quarterly','annually')),
    amount          NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (amount >= 0),
    currency        VARCHAR(3)  NOT NULL DEFAULT 'USD',
    start_date      DATE        NOT NULL,
    end_date        DATE,
    trial_end_date  DATE,
    next_billing_date DATE,
    auto_renew      BOOLEAN     NOT NULL DEFAULT TRUE,
    cancel_reason   TEXT,
    mrr             NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (mrr >= 0),
    usage_quantity  NUMERIC(10,2) CHECK (usage_quantity IS NULL OR usage_quantity >= 0),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_subscriptions ON subscriptions (tenant_id, contact_id) WHERE deleted_at IS NULL;

CREATE TABLE currency_exchange_rates (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    from_currency   VARCHAR(3)  NOT NULL,
    to_currency     VARCHAR(3)  NOT NULL,
    rate            NUMERIC(18,8) NOT NULL CHECK (rate > 0),
    effective_date  DATE        NOT NULL,
    source          VARCHAR(50) NOT NULL DEFAULT 'manual'
                        CHECK (source IN ('manual','api','ecb','openexchange')),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_exchange_rates ON currency_exchange_rates (tenant_id, from_currency, to_currency, effective_date) WHERE deleted_at IS NULL;

-- ======== GAMIFICATION (24) ========

CREATE TABLE gamification_badges (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    icon            VARCHAR(50),
    category        VARCHAR(30) NOT NULL DEFAULT 'sales'
                        CHECK (category IN ('sales','activity','milestone','collaboration','quality','special')),
    criteria        JSONB       NOT NULL DEFAULT '{}',
    points          INTEGER     NOT NULL DEFAULT 0 CHECK (points >= 0),
    rarity          VARCHAR(15) NOT NULL DEFAULT 'common'
                        CHECK (rarity IN ('common','uncommon','rare','epic','legendary')),
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_badges ON gamification_badges (tenant_id, name) WHERE deleted_at IS NULL;

CREATE TABLE gamification_achievements (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    employee_id     UUID        NOT NULL REFERENCES employees(id),
    badge_id        UUID        NOT NULL REFERENCES gamification_badges(id),
    points_earned   INTEGER     NOT NULL DEFAULT 0 CHECK (points_earned >= 0),
    achieved_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    context         JSONB       NOT NULL DEFAULT '{}',
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_achievements ON gamification_achievements (tenant_id, employee_id, badge_id) WHERE deleted_at IS NULL;

-- ======== INTEGRATIONS & API (25) ========

CREATE TABLE integrations (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(200) NOT NULL,
    provider        VARCHAR(100) NOT NULL,
    category        VARCHAR(30) NOT NULL DEFAULT 'other'
                        CHECK (category IN ('crm','communication','analytics','storage','payment','calendar','social','other')),
    status          VARCHAR(20) NOT NULL DEFAULT 'disconnected'
                        CHECK (status IN ('connected','disconnected','error','pending')),
    config          JSONB       NOT NULL DEFAULT '{}',
    scopes          JSONB       NOT NULL DEFAULT '[]',
    last_sync_at    TIMESTAMPTZ,
    sync_frequency  VARCHAR(20) CHECK (sync_frequency IS NULL OR sync_frequency IN ('realtime','hourly','daily','weekly','manual')),
    error_message   TEXT,
    connected_by    UUID        REFERENCES employees(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_integrations ON integrations (tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE api_keys (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(200) NOT NULL,
    key_hash        VARCHAR(255) NOT NULL,
    key_prefix      VARCHAR(10) NOT NULL,
    scopes          JSONB       NOT NULL DEFAULT '[]',
    status          VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active','revoked','expired')),
    expires_at      TIMESTAMPTZ,
    last_used_at    TIMESTAMPTZ,
    request_count   BIGINT      NOT NULL DEFAULT 0 CHECK (request_count >= 0),
    rate_limit      INTEGER     NOT NULL DEFAULT 1000 CHECK (rate_limit > 0),
    created_by      UUID        REFERENCES employees(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_api_keys ON api_keys (key_hash) WHERE deleted_at IS NULL;

CREATE TABLE api_usage_logs (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    api_key_id      UUID        NOT NULL REFERENCES api_keys(id),
    endpoint        VARCHAR(500) NOT NULL,
    method          VARCHAR(10) NOT NULL CHECK (method IN ('GET','POST','PUT','PATCH','DELETE')),
    status_code     SMALLINT    NOT NULL,
    response_time_ms INTEGER    CHECK (response_time_ms IS NULL OR response_time_ms >= 0),
    ip_address      INET,
    request_size    INTEGER     CHECK (request_size IS NULL OR request_size >= 0),
    response_size   INTEGER     CHECK (response_size IS NULL OR response_size >= 0),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_api_usage ON api_usage_logs (tenant_id, created_at DESC) WHERE deleted_at IS NULL;

-- ======== COMPLIANCE, SLA, TRUST (26) ========

CREATE TABLE compliance_checks (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(255) NOT NULL,
    framework       VARCHAR(50) NOT NULL
                        CHECK (framework IN ('gdpr','soc2','iso27001','hipaa','pci-dss','ccpa','custom')),
    status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('compliant','non-compliant','pending','in-progress','exempted')),
    category        VARCHAR(50),
    description     TEXT,
    evidence_url    TEXT,
    due_date        DATE,
    reviewer_id     UUID        REFERENCES employees(id),
    risk_level      VARCHAR(15) NOT NULL DEFAULT 'medium'
                        CHECK (risk_level IN ('critical','high','medium','low')),
    notes           TEXT,
    last_checked_at TIMESTAMPTZ,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_compliance ON compliance_checks (tenant_id, framework) WHERE deleted_at IS NULL;

CREATE TABLE sla_policies (
    id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id               UUID        NOT NULL REFERENCES tenants(id),
    name                    VARCHAR(200) NOT NULL,
    description             TEXT,
    priority                VARCHAR(15) NOT NULL DEFAULT 'medium'
                                CHECK (priority IN ('critical','high','medium','low')),
    response_time_hours     NUMERIC(6,1) NOT NULL DEFAULT 4 CHECK (response_time_hours > 0),
    resolution_time_hours   NUMERIC(6,1) NOT NULL DEFAULT 24 CHECK (resolution_time_hours > 0),
    business_hours_only     BOOLEAN     NOT NULL DEFAULT TRUE,
    escalation_rules        JSONB       NOT NULL DEFAULT '[]',
    is_active               BOOLEAN     NOT NULL DEFAULT TRUE,
    version                 INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at              TIMESTAMPTZ
);

CREATE INDEX idx_sla ON sla_policies (tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE trust_certifications (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(200) NOT NULL,
    issuer          VARCHAR(200),
    cert_type       VARCHAR(30) NOT NULL
                        CHECK (cert_type IN ('security','privacy','quality','industry','custom')),
    status          VARCHAR(20) NOT NULL DEFAULT 'valid'
                        CHECK (status IN ('valid','expired','pending','revoked')),
    issued_date     DATE,
    expiry_date     DATE,
    certificate_url TEXT,
    description     TEXT,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_trust ON trust_certifications (tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE custom_dashboards (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    owner_id        UUID        NOT NULL REFERENCES users(id),
    is_shared       BOOLEAN     NOT NULL DEFAULT FALSE,
    layout          JSONB       NOT NULL DEFAULT '[]',
    filters         JSONB       NOT NULL DEFAULT '{}',
    refresh_interval INTEGER    CHECK (refresh_interval IS NULL OR refresh_interval >= 0),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_custom_dashboards ON custom_dashboards (tenant_id, owner_id) WHERE deleted_at IS NULL;
