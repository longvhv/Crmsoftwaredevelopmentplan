-- ============================================================
-- V003: Lead & Truyền thông
-- Phân hệ: 03-lead-management, 04-communication
-- Phụ thuộc: V002 (contacts, employees)
-- ============================================================

-- ======== LEAD MANAGEMENT ========

CREATE TABLE leads (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(200) NOT NULL,
    email           VARCHAR(320),
    phone           VARCHAR(30),
    company         VARCHAR(255),
    job_title       VARCHAR(200),
    source          VARCHAR(50) NOT NULL DEFAULT 'website'
                        CHECK (source IN ('website','referral','social','cold-call','event','ad','email','partner','other')),
    status          VARCHAR(20) NOT NULL DEFAULT 'new'
                        CHECK (status IN ('new','contacted','qualified','unqualified','converted','lost')),
    score           SMALLINT    NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
    score_factors   JSONB       NOT NULL DEFAULT '{}',
    assigned_to     UUID        REFERENCES employees(id),
    converted_contact_id UUID   REFERENCES contacts(id),
    converted_deal_id    UUID   REFERENCES deals(id),
    notes           TEXT,
    custom_fields   JSONB       NOT NULL DEFAULT '{}',
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_leads_tenant   ON leads (tenant_id)            WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_status   ON leads (tenant_id, status)    WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_assigned ON leads (tenant_id, assigned_to) WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_source   ON leads (tenant_id, source)    WHERE deleted_at IS NULL;
CREATE INDEX idx_leads_score    ON leads (tenant_id, score DESC) WHERE deleted_at IS NULL;

-- ======== COMMUNICATION ========

CREATE TABLE email_templates (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(200) NOT NULL,
    subject         VARCHAR(500) NOT NULL,
    body_html       TEXT        NOT NULL DEFAULT '',
    category        VARCHAR(50),
    variables       JSONB       NOT NULL DEFAULT '[]',
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    created_by      UUID        REFERENCES employees(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_email_templates_tenant ON email_templates (tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE email_sequences (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft','active','paused','completed')),
    trigger_event   VARCHAR(50),
    enrolled_count  INTEGER     NOT NULL DEFAULT 0 CHECK (enrolled_count >= 0),
    completed_count INTEGER     NOT NULL DEFAULT 0 CHECK (completed_count >= 0),
    created_by      UUID        REFERENCES employees(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_email_sequences_tenant ON email_sequences (tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE email_sequence_steps (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    sequence_id     UUID        NOT NULL REFERENCES email_sequences(id),
    step_order      INTEGER     NOT NULL CHECK (step_order >= 1),
    template_id     UUID        REFERENCES email_templates(id),
    delay_days      INTEGER     NOT NULL DEFAULT 1 CHECK (delay_days >= 0),
    subject_override VARCHAR(500),
    body_override   TEXT,
    condition       JSONB       NOT NULL DEFAULT '{}',
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_seq_steps ON email_sequence_steps (tenant_id, sequence_id, step_order) WHERE deleted_at IS NULL;

CREATE TABLE sms_campaigns (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(200) NOT NULL,
    message         TEXT        NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft','scheduled','sending','completed','cancelled')),
    recipient_count INTEGER     NOT NULL DEFAULT 0 CHECK (recipient_count >= 0),
    delivered_count INTEGER     NOT NULL DEFAULT 0 CHECK (delivered_count >= 0),
    failed_count    INTEGER     NOT NULL DEFAULT 0 CHECK (failed_count >= 0),
    scheduled_at    TIMESTAMPTZ,
    sent_at         TIMESTAMPTZ,
    created_by      UUID        REFERENCES employees(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_sms_campaigns_tenant ON sms_campaigns (tenant_id) WHERE deleted_at IS NULL;
