-- ============================================================
-- V008: Phân tích, Lãnh thổ, Sales Enablement, Kho & Sự kiện
-- Phân hệ: 12, 13, 14, 15
-- Phụ thuộc: V002-V005
-- ============================================================

-- ======== ANALYTICS (12) ========

CREATE TABLE campaign_rois (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    campaign_name   VARCHAR(255) NOT NULL,
    channel         VARCHAR(50) NOT NULL,
    spend           NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (spend >= 0),
    revenue         NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (revenue >= 0),
    leads_generated INTEGER     NOT NULL DEFAULT 0 CHECK (leads_generated >= 0),
    deals_closed    INTEGER     NOT NULL DEFAULT 0 CHECK (deals_closed >= 0),
    roi_percent     NUMERIC(8,2) NOT NULL DEFAULT 0,
    period          VARCHAR(10) NOT NULL,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_campaign_rois ON campaign_rois (tenant_id, period) WHERE deleted_at IS NULL;

CREATE TABLE competitors (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(255) NOT NULL,
    website         TEXT,
    description     TEXT,
    strengths       JSONB       NOT NULL DEFAULT '[]',
    weaknesses      JSONB       NOT NULL DEFAULT '[]',
    market_share    NUMERIC(5,2) CHECK (market_share IS NULL OR market_share BETWEEN 0 AND 100),
    threat_level    VARCHAR(10) NOT NULL DEFAULT 'medium'
                        CHECK (threat_level IN ('low','medium','high')),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_competitors ON competitors (tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE competitor_battle_cards (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    competitor_id   UUID        NOT NULL REFERENCES competitors(id),
    title           VARCHAR(200) NOT NULL,
    our_advantage   TEXT,
    their_advantage TEXT,
    talking_points  JSONB       NOT NULL DEFAULT '[]',
    objection_handlers JSONB    NOT NULL DEFAULT '[]',
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_battle_cards ON competitor_battle_cards (tenant_id, competitor_id) WHERE deleted_at IS NULL;

CREATE TABLE competitor_skills (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    competitor_id   UUID        NOT NULL REFERENCES competitors(id),
    skill_name      VARCHAR(100) NOT NULL,
    our_score       SMALLINT    NOT NULL CHECK (our_score BETWEEN 0 AND 10),
    their_score     SMALLINT    NOT NULL CHECK (their_score BETWEEN 0 AND 10),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_comp_skills ON competitor_skills (tenant_id, competitor_id) WHERE deleted_at IS NULL;

CREATE TABLE win_loss_records (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    deal_id         UUID        REFERENCES deals(id),
    result          VARCHAR(10) NOT NULL CHECK (result IN ('win','loss')),
    competitor_id   UUID        REFERENCES competitors(id),
    reason          TEXT,
    factors         JSONB       NOT NULL DEFAULT '[]',
    deal_value      NUMERIC(18,2) NOT NULL DEFAULT 0,
    sales_cycle_days INTEGER,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_win_loss ON win_loss_records (tenant_id, result) WHERE deleted_at IS NULL;

CREATE TABLE revenue_leak_items (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    category        VARCHAR(50) NOT NULL,
    description     TEXT        NOT NULL,
    estimated_loss  NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (estimated_loss >= 0),
    currency        VARCHAR(3)  NOT NULL DEFAULT 'USD',
    severity        VARCHAR(10) NOT NULL DEFAULT 'medium'
                        CHECK (severity IN ('low','medium','high','critical')),
    status          VARCHAR(20) NOT NULL DEFAULT 'identified'
                        CHECK (status IN ('identified','investigating','fixing','resolved')),
    deal_id         UUID        REFERENCES deals(id),
    assigned_to     UUID        REFERENCES employees(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_revenue_leaks ON revenue_leak_items (tenant_id, status) WHERE deleted_at IS NULL;

-- ======== TERRITORY & QUOTA (13) ========

CREATE TABLE territories (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(200) NOT NULL,
    region          VARCHAR(100),
    country         VARCHAR(100),
    description     TEXT,
    manager_id      UUID        REFERENCES employees(id),
    status          VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active','inactive')),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_territories ON territories (tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE territory_reps (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    territory_id    UUID        NOT NULL REFERENCES territories(id),
    employee_id     UUID        NOT NULL REFERENCES employees(id),
    role_in_territory VARCHAR(30) NOT NULL DEFAULT 'rep',
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_territory_reps ON territory_reps (tenant_id, territory_id, employee_id) WHERE deleted_at IS NULL;

CREATE TABLE territory_quarter_revenues (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    territory_id    UUID        NOT NULL REFERENCES territories(id),
    quarter         VARCHAR(7)  NOT NULL, -- 'YYYY-QN'
    revenue         NUMERIC(18,2) NOT NULL DEFAULT 0,
    target          NUMERIC(18,2) NOT NULL DEFAULT 0,
    currency        VARCHAR(3)  NOT NULL DEFAULT 'USD',
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_territory_rev ON territory_quarter_revenues (tenant_id, territory_id, quarter) WHERE deleted_at IS NULL;

CREATE TABLE quota_reps (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    employee_id     UUID        NOT NULL REFERENCES employees(id),
    period          VARCHAR(10) NOT NULL,
    quota_amount    NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (quota_amount >= 0),
    achieved_amount NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (achieved_amount >= 0),
    currency        VARCHAR(3)  NOT NULL DEFAULT 'USD',
    attainment_pct  NUMERIC(6,2) NOT NULL DEFAULT 0,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_quota_reps ON quota_reps (tenant_id, employee_id, period) WHERE deleted_at IS NULL;

-- ======== SALES ENABLEMENT (14) ========

CREATE TABLE playbooks (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    methodology     VARCHAR(50),
    stages          JSONB       NOT NULL DEFAULT '[]',
    best_practices  JSONB       NOT NULL DEFAULT '[]',
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_playbooks ON playbooks (tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE playbook_battle_cards (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    playbook_id     UUID        NOT NULL REFERENCES playbooks(id),
    title           VARCHAR(200) NOT NULL,
    scenario        TEXT,
    response        TEXT,
    tags            JSONB       NOT NULL DEFAULT '[]',
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_playbook_cards ON playbook_battle_cards (tenant_id, playbook_id) WHERE deleted_at IS NULL;

CREATE TABLE goals (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    title           VARCHAR(300) NOT NULL,
    description     TEXT,
    goal_type       VARCHAR(20) NOT NULL DEFAULT 'team'
                        CHECK (goal_type IN ('company','team','individual')),
    owner_id        UUID        REFERENCES employees(id),
    status          VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK (status IN ('draft','active','completed','cancelled')),
    progress        SMALLINT    NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    start_date      DATE,
    end_date        DATE,
    parent_goal_id  UUID        REFERENCES goals(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_goals ON goals (tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE key_results (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    goal_id         UUID        NOT NULL REFERENCES goals(id),
    title           VARCHAR(300) NOT NULL,
    metric_type     VARCHAR(20) NOT NULL DEFAULT 'number',
    current_value   NUMERIC(15,2) NOT NULL DEFAULT 0,
    target_value    NUMERIC(15,2) NOT NULL,
    unit            VARCHAR(30),
    progress        SMALLINT    NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_key_results ON key_results (tenant_id, goal_id) WHERE deleted_at IS NULL;

-- ======== INVENTORY, EVENTS, TEAM (15) ========

CREATE TABLE inventory_items (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(300) NOT NULL,
    sku             VARCHAR(100),
    category        VARCHAR(100),
    quantity        INTEGER     NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    min_quantity    INTEGER     NOT NULL DEFAULT 0 CHECK (min_quantity >= 0),
    location        VARCHAR(200),
    status          VARCHAR(20) NOT NULL DEFAULT 'in-stock'
                        CHECK (status IN ('in-stock','low-stock','out-of-stock','discontinued')),
    unit_cost       NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (unit_cost >= 0),
    currency        VARCHAR(3)  NOT NULL DEFAULT 'USD',
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_inventory ON inventory_items (tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE crm_events (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(300) NOT NULL,
    event_type      VARCHAR(30) NOT NULL DEFAULT 'webinar'
                        CHECK (event_type IN ('webinar','workshop','conference','meetup','training','other')),
    status          VARCHAR(20) NOT NULL DEFAULT 'planned'
                        CHECK (status IN ('planned','open','in-progress','completed','cancelled')),
    start_date      TIMESTAMPTZ NOT NULL,
    end_date        TIMESTAMPTZ,
    location        VARCHAR(300),
    max_attendees   INTEGER     CHECK (max_attendees IS NULL OR max_attendees > 0),
    registered_count INTEGER    NOT NULL DEFAULT 0 CHECK (registered_count >= 0),
    attended_count  INTEGER     NOT NULL DEFAULT 0 CHECK (attended_count >= 0),
    organizer_id    UUID        REFERENCES employees(id),
    description     TEXT,
    budget          NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (budget >= 0),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_crm_events ON crm_events (tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE team_members (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    employee_id     UUID        NOT NULL REFERENCES employees(id),
    role            VARCHAR(100),
    skills          JSONB       NOT NULL DEFAULT '[]',
    capacity_hours  NUMERIC(5,1) NOT NULL DEFAULT 40 CHECK (capacity_hours >= 0),
    allocated_hours NUMERIC(5,1) NOT NULL DEFAULT 0 CHECK (allocated_hours >= 0),
    utilization_pct NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (utilization_pct BETWEEN 0 AND 200),
    availability    VARCHAR(20) NOT NULL DEFAULT 'available'
                        CHECK (availability IN ('available','busy','on-leave','unavailable')),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_team_members ON team_members (tenant_id, employee_id) WHERE deleted_at IS NULL;
