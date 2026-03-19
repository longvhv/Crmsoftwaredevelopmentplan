-- ============================================================
-- V005: Hợp đồng, Hoa hồng & Dự báo
-- Phân hệ: 07-contracts, 08-commission-forecast
-- Phụ thuộc: V002, V004 (contacts, deals, employees, products)
-- ============================================================

-- ======== CONTRACTS ========

CREATE TABLE contracts (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    contract_number VARCHAR(50) NOT NULL,
    name            VARCHAR(300) NOT NULL,
    contact_id      UUID        REFERENCES contacts(id),
    deal_id         UUID        REFERENCES deals(id),
    owner_id        UUID        REFERENCES employees(id),
    status          VARCHAR(20) NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft','pending','active','expired','terminated','renewed')),
    contract_type   VARCHAR(30) NOT NULL DEFAULT 'subscription',
    value           NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (value >= 0),
    currency        VARCHAR(3)  NOT NULL DEFAULT 'USD',
    start_date      DATE        NOT NULL,
    end_date        DATE,
    auto_renew      BOOLEAN     NOT NULL DEFAULT FALSE,
    payment_terms   VARCHAR(50),
    terms_html      TEXT,
    signed_date     DATE,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_contracts_number ON contracts (tenant_id, contract_number) WHERE deleted_at IS NULL;
CREATE INDEX idx_contracts_tenant       ON contracts (tenant_id)                  WHERE deleted_at IS NULL;
CREATE INDEX idx_contracts_contact      ON contracts (tenant_id, contact_id)      WHERE deleted_at IS NULL;
CREATE INDEX idx_contracts_status       ON contracts (tenant_id, status)          WHERE deleted_at IS NULL;

CREATE TABLE contract_amendments (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    contract_id     UUID        NOT NULL REFERENCES contracts(id),
    amendment_number VARCHAR(50) NOT NULL,
    description     TEXT        NOT NULL,
    changes         JSONB       NOT NULL DEFAULT '{}',
    effective_date  DATE        NOT NULL,
    approved_by     UUID        REFERENCES employees(id),
    status          VARCHAR(20) NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft','pending','approved','rejected')),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_amendments ON contract_amendments (tenant_id, contract_id) WHERE deleted_at IS NULL;

-- ======== COMMISSION & FORECAST ========

CREATE TABLE commission_tiers (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(200) NOT NULL,
    min_revenue     NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (min_revenue >= 0),
    max_revenue     NUMERIC(18,2),
    rate_percent    NUMERIC(5,2) NOT NULL CHECK (rate_percent BETWEEN 0 AND 100),
    product_category VARCHAR(100),
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_commission_tiers ON commission_tiers (tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE bonus_rules (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    condition       JSONB       NOT NULL DEFAULT '{}',
    bonus_type      VARCHAR(20) NOT NULL DEFAULT 'percentage'
                        CHECK (bonus_type IN ('percentage','fixed','multiplier')),
    bonus_value     NUMERIC(15,2) NOT NULL CHECK (bonus_value >= 0),
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_bonus_rules ON bonus_rules (tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE sales_rep_commissions (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    employee_id     UUID        NOT NULL REFERENCES employees(id),
    deal_id         UUID        REFERENCES deals(id),
    period          VARCHAR(10) NOT NULL, -- 'YYYY-MM' hoặc 'YYYY-QN'
    base_amount     NUMERIC(18,2) NOT NULL DEFAULT 0,
    bonus_amount    NUMERIC(18,2) NOT NULL DEFAULT 0,
    total_amount    NUMERIC(18,2) NOT NULL DEFAULT 0,
    currency        VARCHAR(3)  NOT NULL DEFAULT 'USD',
    status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','approved','paid','disputed')),
    tier_id         UUID        REFERENCES commission_tiers(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_rep_commissions_emp    ON sales_rep_commissions (tenant_id, employee_id)   WHERE deleted_at IS NULL;
CREATE INDEX idx_rep_commissions_period ON sales_rep_commissions (tenant_id, period)        WHERE deleted_at IS NULL;

CREATE TABLE commission_bonuses (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    commission_id   UUID        NOT NULL REFERENCES sales_rep_commissions(id),
    rule_id         UUID        NOT NULL REFERENCES bonus_rules(id),
    amount          NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (amount >= 0),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_commission_bonuses ON commission_bonuses (tenant_id, commission_id) WHERE deleted_at IS NULL;

CREATE TABLE rep_forecasts (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    employee_id     UUID        NOT NULL REFERENCES employees(id),
    period          VARCHAR(10) NOT NULL,
    forecast_type   VARCHAR(20) NOT NULL DEFAULT 'commit'
                        CHECK (forecast_type IN ('commit','best-case','pipeline','closed')),
    amount          NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (amount >= 0),
    currency        VARCHAR(3)  NOT NULL DEFAULT 'USD',
    deal_count      INTEGER     NOT NULL DEFAULT 0 CHECK (deal_count >= 0),
    confidence      SMALLINT    NOT NULL DEFAULT 50 CHECK (confidence BETWEEN 0 AND 100),
    notes           TEXT,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_rep_forecasts_emp    ON rep_forecasts (tenant_id, employee_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_rep_forecasts_period ON rep_forecasts (tenant_id, period)      WHERE deleted_at IS NULL;
