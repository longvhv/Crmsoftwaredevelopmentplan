-- ============================================================
-- V007: Customer Success
-- Phân hệ: 11-customer-success
-- Phụ thuộc: V002 (contacts, employees, deals), V005 (contracts)
-- ============================================================

CREATE TABLE customer_healths (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    contact_id      UUID        NOT NULL REFERENCES contacts(id),
    overall_score   SMALLINT    NOT NULL DEFAULT 50 CHECK (overall_score BETWEEN 0 AND 100),
    health_status   VARCHAR(15) NOT NULL DEFAULT 'healthy'
                        CHECK (health_status IN ('healthy','at-risk','critical','churned')),
    csm_id          UUID        REFERENCES employees(id),
    last_engagement_date TIMESTAMPTZ,
    arr             NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (arr >= 0),
    usage_score     SMALLINT    CHECK (usage_score IS NULL OR usage_score BETWEEN 0 AND 100),
    support_score   SMALLINT    CHECK (support_score IS NULL OR support_score BETWEEN 0 AND 100),
    engagement_score SMALLINT   CHECK (engagement_score IS NULL OR engagement_score BETWEEN 0 AND 100),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_customer_health_tenant   ON customer_healths (tenant_id)                  WHERE deleted_at IS NULL;
CREATE INDEX idx_customer_health_contact  ON customer_healths (tenant_id, contact_id)      WHERE deleted_at IS NULL;
CREATE INDEX idx_customer_health_status   ON customer_healths (tenant_id, health_status)   WHERE deleted_at IS NULL;

CREATE TABLE health_metrics (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    health_id       UUID        NOT NULL REFERENCES customer_healths(id),
    metric_name     VARCHAR(100) NOT NULL,
    metric_value    NUMERIC(10,2) NOT NULL,
    weight          NUMERIC(3,2) NOT NULL DEFAULT 1.0 CHECK (weight BETWEEN 0 AND 1),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_health_metrics ON health_metrics (tenant_id, health_id) WHERE deleted_at IS NULL;

CREATE TABLE health_score_trends (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    health_id       UUID        NOT NULL REFERENCES customer_healths(id),
    period          VARCHAR(7)  NOT NULL, -- 'YYYY-MM'
    score           SMALLINT    NOT NULL CHECK (score BETWEEN 0 AND 100),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_health_trends ON health_score_trends (tenant_id, health_id, period) WHERE deleted_at IS NULL;

CREATE TABLE nps_feedbacks (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    contact_id      UUID        REFERENCES contacts(id),
    score           SMALLINT    NOT NULL CHECK (score BETWEEN 0 AND 10),
    category        VARCHAR(15) GENERATED ALWAYS AS (
                        CASE WHEN score >= 9 THEN 'promoter' WHEN score >= 7 THEN 'passive' ELSE 'detractor' END
                    ) STORED,
    comment         TEXT,
    survey_source   VARCHAR(50),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_nps_tenant   ON nps_feedbacks (tenant_id)                WHERE deleted_at IS NULL;
CREATE INDEX idx_nps_contact  ON nps_feedbacks (tenant_id, contact_id)    WHERE deleted_at IS NULL;

CREATE TABLE client_nps_snapshots (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    contact_id      UUID        NOT NULL REFERENCES contacts(id),
    avg_score       NUMERIC(4,2) NOT NULL CHECK (avg_score BETWEEN 0 AND 10),
    latest_score    SMALLINT    NOT NULL CHECK (latest_score BETWEEN 0 AND 10),
    response_count  INTEGER     NOT NULL DEFAULT 0 CHECK (response_count >= 0),
    trend           VARCHAR(10) CHECK (trend IS NULL OR trend IN ('up','down','stable')),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_nps_snapshots ON client_nps_snapshots (tenant_id, contact_id) WHERE deleted_at IS NULL;

CREATE TABLE churn_risk_accounts (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    contact_id      UUID        NOT NULL REFERENCES contacts(id),
    risk_level      VARCHAR(15) NOT NULL DEFAULT 'medium'
                        CHECK (risk_level IN ('high','medium','low')),
    risk_score      SMALLINT    NOT NULL DEFAULT 50 CHECK (risk_score BETWEEN 0 AND 100),
    risk_factors    JSONB       NOT NULL DEFAULT '[]',
    predicted_churn_date DATE,
    arr_at_risk     NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (arr_at_risk >= 0),
    assigned_csm    UUID        REFERENCES employees(id),
    action_plan     JSONB       NOT NULL DEFAULT '[]',
    status          VARCHAR(20) NOT NULL DEFAULT 'monitoring'
                        CHECK (status IN ('monitoring','action-required','mitigated','churned')),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_churn_risk_tenant  ON churn_risk_accounts (tenant_id)             WHERE deleted_at IS NULL;
CREATE INDEX idx_churn_risk_contact ON churn_risk_accounts (tenant_id, contact_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_churn_risk_level   ON churn_risk_accounts (tenant_id, risk_level) WHERE deleted_at IS NULL;

CREATE TABLE renewals (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    contract_id     UUID        NOT NULL REFERENCES contracts(id),
    contact_id      UUID        REFERENCES contacts(id),
    owner_id        UUID        REFERENCES employees(id),
    renewal_date    DATE        NOT NULL,
    current_value   NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (current_value >= 0),
    proposed_value  NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (proposed_value >= 0),
    currency        VARCHAR(3)  NOT NULL DEFAULT 'USD',
    status          VARCHAR(20) NOT NULL DEFAULT 'upcoming'
                        CHECK (status IN ('upcoming','in-progress','renewed','churned','downgraded')),
    likelihood      SMALLINT    NOT NULL DEFAULT 50 CHECK (likelihood BETWEEN 0 AND 100),
    notes           TEXT,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_renewals_tenant    ON renewals (tenant_id)               WHERE deleted_at IS NULL;
CREATE INDEX idx_renewals_contract  ON renewals (tenant_id, contract_id)  WHERE deleted_at IS NULL;
CREATE INDEX idx_renewals_date      ON renewals (tenant_id, renewal_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_renewals_status    ON renewals (tenant_id, status)       WHERE deleted_at IS NULL;
