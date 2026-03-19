-- ============================================================
-- V011: Tài liệu, Trí tuệ khách hàng, Truyền thông mở rộng
-- Phân hệ: 19, 20, 21
-- Phụ thuộc: V002-V005, V010 (contacts, deals, employees, forms, calendar_events)
-- ============================================================

-- ======== DOCUMENTS & KNOWLEDGE (19) ========

CREATE TABLE documents (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(300) NOT NULL,
    document_type   VARCHAR(30) NOT NULL DEFAULT 'general'
                        CHECK (document_type IN ('contract','proposal','invoice','report','presentation','template','general')),
    status          VARCHAR(20) NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft','active','archived','expired')),
    file_url        TEXT,
    file_size       BIGINT      CHECK (file_size IS NULL OR file_size >= 0),
    mime_type       VARCHAR(100),
    folder          VARCHAR(500),
    contact_id      UUID        REFERENCES contacts(id),
    deal_id         UUID        REFERENCES deals(id),
    uploaded_by     UUID        REFERENCES employees(id),
    shared_with     JSONB       NOT NULL DEFAULT '[]',
    expiry_date     DATE,
    download_count  INTEGER     NOT NULL DEFAULT 0 CHECK (download_count >= 0),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_documents_tenant ON documents (tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_folder ON documents (tenant_id, folder) WHERE deleted_at IS NULL;

CREATE TABLE knowledge_categories (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(200) NOT NULL,
    slug            VARCHAR(200) NOT NULL,
    description     TEXT,
    parent_id       UUID        REFERENCES knowledge_categories(id),
    icon            VARCHAR(50),
    sort_order      INTEGER     NOT NULL DEFAULT 0,
    article_count   INTEGER     NOT NULL DEFAULT 0 CHECK (article_count >= 0),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_kb_cat_slug ON knowledge_categories (tenant_id, slug) WHERE deleted_at IS NULL;

CREATE TABLE knowledge_articles (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    title               VARCHAR(300) NOT NULL,
    slug                VARCHAR(300) NOT NULL,
    category_id         UUID        REFERENCES knowledge_categories(id),
    content_html        TEXT        NOT NULL DEFAULT '',
    content_text        TEXT        NOT NULL DEFAULT '',
    status              VARCHAR(20) NOT NULL DEFAULT 'draft'
                            CHECK (status IN ('draft','published','archived')),
    visibility          VARCHAR(15) NOT NULL DEFAULT 'internal'
                            CHECK (visibility IN ('internal','public','customer')),
    author_id           UUID        REFERENCES employees(id),
    views               INTEGER     NOT NULL DEFAULT 0 CHECK (views >= 0),
    helpful_count       INTEGER     NOT NULL DEFAULT 0 CHECK (helpful_count >= 0),
    not_helpful_count   INTEGER     NOT NULL DEFAULT 0 CHECK (not_helpful_count >= 0),
    related_article_ids JSONB       NOT NULL DEFAULT '[]',
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_kb_art_slug ON knowledge_articles (tenant_id, slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_kb_articles       ON knowledge_articles (tenant_id, category_id) WHERE deleted_at IS NULL;

-- ======== CUSTOMER INTELLIGENCE (20) ========

CREATE TABLE customer_segments (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    segment_type    VARCHAR(20) NOT NULL DEFAULT 'dynamic'
                        CHECK (segment_type IN ('dynamic','static')),
    rules           JSONB       NOT NULL DEFAULT '[]',
    contact_count   INTEGER     NOT NULL DEFAULT 0 CHECK (contact_count >= 0),
    avg_deal_value  NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (avg_deal_value >= 0),
    total_revenue   NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (total_revenue >= 0),
    color           VARCHAR(30),
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    last_computed_at TIMESTAMPTZ,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_segments ON customer_segments (tenant_id, name) WHERE deleted_at IS NULL;

CREATE TABLE customer_journeys (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    name                VARCHAR(255) NOT NULL,
    description         TEXT,
    status              VARCHAR(20) NOT NULL DEFAULT 'active'
                            CHECK (status IN ('draft','active','archived')),
    stages              JSONB       NOT NULL DEFAULT '[]',
    total_contacts      INTEGER     NOT NULL DEFAULT 0 CHECK (total_contacts >= 0),
    avg_completion_days NUMERIC(8,1) CHECK (avg_completion_days IS NULL OR avg_completion_days >= 0),
    conversion_rate     NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (conversion_rate BETWEEN 0 AND 100),
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_journeys ON customer_journeys (tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE journey_touchpoints (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    journey_id      UUID        NOT NULL REFERENCES customer_journeys(id),
    contact_id      UUID        NOT NULL REFERENCES contacts(id),
    stage_id        VARCHAR(100) NOT NULL,
    touchpoint_type VARCHAR(30) NOT NULL
                        CHECK (touchpoint_type IN ('email','call','meeting','website','ad','social','form','purchase','support')),
    channel         VARCHAR(50),
    description     TEXT,
    sentiment       VARCHAR(15) CHECK (sentiment IS NULL OR sentiment IN ('positive','neutral','negative')),
    occurred_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_touchpoints ON journey_touchpoints (tenant_id, journey_id) WHERE deleted_at IS NULL;

CREATE TABLE account_plans (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    contact_id          UUID        NOT NULL REFERENCES contacts(id),
    account_name        VARCHAR(255) NOT NULL,
    owner_id            UUID        REFERENCES employees(id),
    status              VARCHAR(20) NOT NULL DEFAULT 'active'
                            CHECK (status IN ('draft','active','review','archived')),
    objectives          JSONB       NOT NULL DEFAULT '[]',
    stakeholders        JSONB       NOT NULL DEFAULT '[]',
    opportunities       JSONB       NOT NULL DEFAULT '[]',
    risks               JSONB       NOT NULL DEFAULT '[]',
    current_arr         NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (current_arr >= 0),
    target_arr          NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (target_arr >= 0),
    health_score        SMALLINT    NOT NULL DEFAULT 0 CHECK (health_score BETWEEN 0 AND 100),
    next_review_date    DATE,
    ai_recommendations  JSONB       NOT NULL DEFAULT '[]',
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_account_plans ON account_plans (tenant_id, contact_id) WHERE deleted_at IS NULL;

CREATE TABLE deal_rooms (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    deal_id             UUID        NOT NULL REFERENCES deals(id),
    name                VARCHAR(255) NOT NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'active'
                            CHECK (status IN ('active','closed','archived')),
    access_code         VARCHAR(50),
    participants        JSONB       NOT NULL DEFAULT '[]',
    milestones          JSONB       NOT NULL DEFAULT '[]',
    mutual_action_plan  JSONB       NOT NULL DEFAULT '[]',
    last_activity_at    TIMESTAMPTZ,
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_deal_rooms ON deal_rooms (tenant_id, deal_id) WHERE deleted_at IS NULL;

CREATE TABLE deal_room_documents (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    deal_room_id    UUID        NOT NULL REFERENCES deal_rooms(id),
    document_id     UUID        REFERENCES documents(id),
    name            VARCHAR(300) NOT NULL,
    file_url        TEXT,
    uploaded_by     UUID        REFERENCES employees(id),
    viewed_by_client BOOLEAN    NOT NULL DEFAULT FALSE,
    viewed_at       TIMESTAMPTZ,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_dr_docs ON deal_room_documents (tenant_id, deal_room_id) WHERE deleted_at IS NULL;

-- ======== COMMUNICATION EXTENDED (21) ========

CREATE TABLE social_mentions (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    platform        VARCHAR(30) NOT NULL
                        CHECK (platform IN ('twitter','linkedin','facebook','instagram','reddit','youtube','tiktok','other')),
    mention_type    VARCHAR(20) NOT NULL DEFAULT 'mention'
                        CHECK (mention_type IN ('mention','review','comment','post','share')),
    content         TEXT        NOT NULL,
    author_name     VARCHAR(255),
    author_handle   VARCHAR(200),
    url             TEXT,
    sentiment       VARCHAR(15) NOT NULL DEFAULT 'neutral'
                        CHECK (sentiment IN ('positive','neutral','negative')),
    engagement      JSONB       NOT NULL DEFAULT '{}',
    contact_id      UUID        REFERENCES contacts(id),
    is_responded    BOOLEAN     NOT NULL DEFAULT FALSE,
    responded_by    UUID        REFERENCES employees(id),
    mentioned_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_social_mentions ON social_mentions (tenant_id, mentioned_at DESC) WHERE deleted_at IS NULL;

CREATE TABLE live_chat_configs (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    is_enabled          BOOLEAN     NOT NULL DEFAULT TRUE,
    widget_color        VARCHAR(20) NOT NULL DEFAULT '#3B82F6',
    welcome_message     TEXT        NOT NULL DEFAULT 'Xin chào! Tôi có thể giúp gì?',
    offline_message     TEXT        NOT NULL DEFAULT 'Hiện không có agent online.',
    auto_reply_enabled  BOOLEAN     NOT NULL DEFAULT FALSE,
    business_hours      JSONB       NOT NULL DEFAULT '{}',
    assigned_agents     JSONB       NOT NULL DEFAULT '[]',
    routing_strategy    VARCHAR(20) NOT NULL DEFAULT 'round-robin'
                            CHECK (routing_strategy IN ('round-robin','least-active','skill-based','random')),
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_live_chat ON live_chat_configs (tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE voip_call_logs (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    direction       VARCHAR(10) NOT NULL CHECK (direction IN ('inbound','outbound')),
    caller_number   VARCHAR(30) NOT NULL,
    callee_number   VARCHAR(30) NOT NULL,
    contact_id      UUID        REFERENCES contacts(id),
    agent_id        UUID        REFERENCES employees(id),
    status          VARCHAR(20) NOT NULL
                        CHECK (status IN ('answered','missed','voicemail','busy','failed')),
    duration_seconds INTEGER    NOT NULL DEFAULT 0 CHECK (duration_seconds >= 0),
    recording_url   TEXT,
    transcript      TEXT,
    sentiment       VARCHAR(15) CHECK (sentiment IS NULL OR sentiment IN ('positive','neutral','negative')),
    notes           TEXT,
    started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at        TIMESTAMPTZ,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_voip_calls ON voip_call_logs (tenant_id, started_at DESC) WHERE deleted_at IS NULL;

CREATE TABLE meeting_recordings (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    calendar_event_id   UUID        REFERENCES calendar_events(id),
    deal_id             UUID        REFERENCES deals(id),
    contact_id          UUID        REFERENCES contacts(id),
    title               VARCHAR(300) NOT NULL,
    recording_url       TEXT,
    duration_minutes    INTEGER     CHECK (duration_minutes IS NULL OR duration_minutes >= 0),
    transcript          TEXT,
    summary             TEXT,
    action_items        JSONB       NOT NULL DEFAULT '[]',
    key_topics          JSONB       NOT NULL DEFAULT '[]',
    sentiment_score     SMALLINT    CHECK (sentiment_score IS NULL OR sentiment_score BETWEEN 0 AND 100),
    talk_ratio          JSONB       NOT NULL DEFAULT '{}',
    participants        JSONB       NOT NULL DEFAULT '[]',
    host_id             UUID        REFERENCES employees(id),
    meeting_date        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_meeting_recs ON meeting_recordings (tenant_id, meeting_date DESC) WHERE deleted_at IS NULL;
