-- ============================================================
-- V010: Biểu mẫu, Khảo sát & Marketing mở rộng
-- Phân hệ: 17-forms-surveys, 18-marketing-extended
-- Phụ thuộc: V002, V003 (contacts, leads, deals, employees)
-- ============================================================

-- ======== FORMS (17) ========

CREATE TABLE forms (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    name                VARCHAR(255) NOT NULL,
    description         TEXT,
    status              VARCHAR(20) NOT NULL DEFAULT 'draft'
                            CHECK (status IN ('draft','published','archived')),
    form_type           VARCHAR(30) NOT NULL DEFAULT 'contact'
                            CHECK (form_type IN ('contact','lead-capture','feedback','registration','support','custom')),
    slug                VARCHAR(200) NOT NULL,
    submit_button_text  VARCHAR(100) NOT NULL DEFAULT 'Gửi',
    success_message     TEXT,
    redirect_url        TEXT,
    notification_emails JSONB       NOT NULL DEFAULT '[]',
    submission_count    INTEGER     NOT NULL DEFAULT 0 CHECK (submission_count >= 0),
    conversion_rate     NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (conversion_rate BETWEEN 0 AND 100),
    created_by          UUID        REFERENCES employees(id),
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_forms_slug ON forms (tenant_id, slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_forms_tenant     ON forms (tenant_id)       WHERE deleted_at IS NULL;

CREATE TABLE form_fields (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    form_id         UUID        NOT NULL REFERENCES forms(id),
    field_key       VARCHAR(100) NOT NULL,
    field_label     VARCHAR(200) NOT NULL,
    field_type      VARCHAR(30) NOT NULL DEFAULT 'text'
                        CHECK (field_type IN ('text','textarea','number','email','phone','date','select','multi-select','checkbox','radio','file','hidden')),
    placeholder     VARCHAR(200),
    options         JSONB,
    validations     JSONB       NOT NULL DEFAULT '{}',
    is_required     BOOLEAN     NOT NULL DEFAULT FALSE,
    sort_order      INTEGER     NOT NULL DEFAULT 0,
    width           VARCHAR(10) NOT NULL DEFAULT 'full'
                        CHECK (width IN ('full','half','third')),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_form_fields ON form_fields (tenant_id, form_id) WHERE deleted_at IS NULL;

CREATE TABLE form_submissions (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    form_id             UUID        NOT NULL REFERENCES forms(id),
    data                JSONB       NOT NULL DEFAULT '{}',
    submitter_ip        INET,
    submitter_user_agent TEXT,
    lead_id             UUID        REFERENCES leads(id),
    contact_id          UUID        REFERENCES contacts(id),
    is_spam             BOOLEAN     NOT NULL DEFAULT FALSE,
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_form_submissions ON form_submissions (tenant_id, form_id) WHERE deleted_at IS NULL;

-- ======== SURVEYS (17) ========

CREATE TABLE surveys (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft','active','closed','archived')),
    survey_type     VARCHAR(20) NOT NULL DEFAULT 'nps'
                        CHECK (survey_type IN ('nps','csat','ces','custom')),
    target_audience VARCHAR(50),
    response_count  INTEGER     NOT NULL DEFAULT 0 CHECK (response_count >= 0),
    avg_score       NUMERIC(4,2),
    start_date      DATE,
    end_date        DATE,
    created_by      UUID        REFERENCES employees(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_surveys ON surveys (tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE survey_questions (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    survey_id       UUID        NOT NULL REFERENCES surveys(id),
    question_text   TEXT        NOT NULL,
    question_type   VARCHAR(20) NOT NULL DEFAULT 'rating'
                        CHECK (question_type IN ('rating','text','single-choice','multi-choice','scale','yes-no')),
    options         JSONB,
    is_required     BOOLEAN     NOT NULL DEFAULT TRUE,
    sort_order      INTEGER     NOT NULL DEFAULT 0,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_survey_questions ON survey_questions (tenant_id, survey_id) WHERE deleted_at IS NULL;

CREATE TABLE survey_responses (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    survey_id       UUID        NOT NULL REFERENCES surveys(id),
    contact_id      UUID        REFERENCES contacts(id),
    respondent_name VARCHAR(255),
    respondent_email VARCHAR(320),
    answers         JSONB       NOT NULL DEFAULT '{}',
    overall_score   NUMERIC(4,2),
    completed       BOOLEAN     NOT NULL DEFAULT TRUE,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_survey_responses ON survey_responses (tenant_id, survey_id) WHERE deleted_at IS NULL;

-- ======== MARKETING EXTENDED (18) ========

CREATE TABLE landing_pages (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(200) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft','published','archived')),
    template        VARCHAR(50),
    content_html    TEXT,
    meta_title      VARCHAR(200),
    meta_description VARCHAR(500),
    form_id         UUID        REFERENCES forms(id),
    views           INTEGER     NOT NULL DEFAULT 0 CHECK (views >= 0),
    conversions     INTEGER     NOT NULL DEFAULT 0 CHECK (conversions >= 0),
    conversion_rate NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (conversion_rate BETWEEN 0 AND 100),
    published_at    TIMESTAMPTZ,
    created_by      UUID        REFERENCES employees(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_lp_slug ON landing_pages (tenant_id, slug) WHERE deleted_at IS NULL;

CREATE TABLE marketing_campaigns (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    campaign_type   VARCHAR(30) NOT NULL DEFAULT 'email'
                        CHECK (campaign_type IN ('email','social','event','content','multi-channel','paid-ads')),
    status          VARCHAR(20) NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft','scheduled','active','paused','completed','cancelled')),
    budget          NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (budget >= 0),
    spent           NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (spent >= 0),
    currency        VARCHAR(3)  NOT NULL DEFAULT 'USD',
    start_date      DATE,
    end_date        DATE,
    target_audience JSONB       NOT NULL DEFAULT '{}',
    goals           JSONB       NOT NULL DEFAULT '{}',
    metrics         JSONB       NOT NULL DEFAULT '{}',
    owner_id        UUID        REFERENCES employees(id),
    campaign_roi_id UUID        REFERENCES campaign_rois(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_mkt_campaigns ON marketing_campaigns (tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE content_calendar_items (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    title           VARCHAR(300) NOT NULL,
    content_type    VARCHAR(30) NOT NULL DEFAULT 'blog'
                        CHECK (content_type IN ('blog','social','email','video','webinar','whitepaper','case-study','infographic')),
    status          VARCHAR(20) NOT NULL DEFAULT 'idea'
                        CHECK (status IN ('idea','planned','in-progress','review','published','archived')),
    channel         VARCHAR(30),
    scheduled_date  DATE,
    published_date  DATE,
    author_id       UUID        REFERENCES employees(id),
    campaign_id     UUID        REFERENCES marketing_campaigns(id),
    description     TEXT,
    url             TEXT,
    metrics         JSONB       NOT NULL DEFAULT '{}',
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_content_cal ON content_calendar_items (tenant_id, scheduled_date) WHERE deleted_at IS NULL;

CREATE TABLE referral_programs (
    id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id               UUID        NOT NULL REFERENCES tenants(id),
    name                    VARCHAR(255) NOT NULL,
    description             TEXT,
    status                  VARCHAR(20) NOT NULL DEFAULT 'active'
                                CHECK (status IN ('active','paused','ended')),
    reward_type             VARCHAR(20) NOT NULL DEFAULT 'cash'
                                CHECK (reward_type IN ('cash','credit','discount','gift')),
    reward_value            NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (reward_value >= 0),
    reward_currency         VARCHAR(3)  NOT NULL DEFAULT 'USD',
    total_referrals         INTEGER     NOT NULL DEFAULT 0 CHECK (total_referrals >= 0),
    successful_referrals    INTEGER     NOT NULL DEFAULT 0 CHECK (successful_referrals >= 0),
    total_revenue_generated NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (total_revenue_generated >= 0),
    version                 INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at              TIMESTAMPTZ
);

CREATE INDEX idx_referral_progs ON referral_programs (tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE referrals (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    program_id          UUID        NOT NULL REFERENCES referral_programs(id),
    referrer_contact_id UUID        REFERENCES contacts(id),
    referrer_name       VARCHAR(255) NOT NULL,
    referred_name       VARCHAR(255) NOT NULL,
    referred_email      VARCHAR(320) NOT NULL,
    referred_company    VARCHAR(255),
    status              VARCHAR(20) NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending','contacted','qualified','converted','rejected')),
    lead_id             UUID        REFERENCES leads(id),
    deal_id             UUID        REFERENCES deals(id),
    reward_paid         BOOLEAN     NOT NULL DEFAULT FALSE,
    reward_amount       NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (reward_amount >= 0),
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_referrals ON referrals (tenant_id, program_id) WHERE deleted_at IS NULL;

CREATE TABLE ab_tests (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    name                VARCHAR(255) NOT NULL,
    test_type           VARCHAR(30) NOT NULL DEFAULT 'email-subject'
                            CHECK (test_type IN ('email-subject','email-body','landing-page','cta','pricing','form')),
    status              VARCHAR(20) NOT NULL DEFAULT 'draft'
                            CHECK (status IN ('draft','running','completed','cancelled')),
    hypothesis          TEXT,
    metric              VARCHAR(50) NOT NULL DEFAULT 'open_rate',
    traffic_split       JSONB       NOT NULL DEFAULT '[50,50]',
    sample_size         INTEGER     NOT NULL DEFAULT 0 CHECK (sample_size >= 0),
    confidence_level    NUMERIC(5,2) CHECK (confidence_level IS NULL OR confidence_level BETWEEN 0 AND 100),
    winner_variant_id   UUID,
    start_date          DATE,
    end_date            DATE,
    created_by          UUID        REFERENCES employees(id),
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_ab_tests ON ab_tests (tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE ab_test_variants (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    test_id         UUID        NOT NULL REFERENCES ab_tests(id),
    variant_name    VARCHAR(50) NOT NULL,
    content         JSONB       NOT NULL DEFAULT '{}',
    impressions     INTEGER     NOT NULL DEFAULT 0 CHECK (impressions >= 0),
    conversions     INTEGER     NOT NULL DEFAULT 0 CHECK (conversions >= 0),
    conversion_rate NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (conversion_rate BETWEEN 0 AND 100),
    is_control      BOOLEAN     NOT NULL DEFAULT FALSE,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_ab_variants ON ab_test_variants (tenant_id, test_id) WHERE deleted_at IS NULL;
