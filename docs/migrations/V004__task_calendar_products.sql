-- ============================================================
-- V004: Công việc, Lịch, Sản phẩm & Báo giá
-- Phân hệ: 05-task-calendar, 06-products-quotations
-- Phụ thuộc: V002 (employees, contacts, deals)
-- ============================================================

-- ======== TASKS & CALENDAR ========

CREATE TABLE tasks (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    title           VARCHAR(300) NOT NULL,
    description     TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'todo'
                        CHECK (status IN ('todo','in-progress','review','done','cancelled')),
    priority        VARCHAR(10) NOT NULL DEFAULT 'medium'
                        CHECK (priority IN ('low','medium','high','urgent')),
    assignee_id     UUID        REFERENCES employees(id),
    reporter_id     UUID        REFERENCES employees(id),
    contact_id      UUID        REFERENCES contacts(id),
    deal_id         UUID        REFERENCES deals(id),
    due_date        DATE,
    completed_at    TIMESTAMPTZ,
    tags            JSONB       NOT NULL DEFAULT '[]',
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_tasks_tenant   ON tasks (tenant_id)                WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_assignee ON tasks (tenant_id, assignee_id)   WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_status   ON tasks (tenant_id, status)        WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_due      ON tasks (tenant_id, due_date)      WHERE deleted_at IS NULL;

CREATE TABLE calendar_events (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    title           VARCHAR(300) NOT NULL,
    description     TEXT,
    event_type      VARCHAR(20) NOT NULL DEFAULT 'meeting'
                        CHECK (event_type IN ('meeting','call','demo','follow-up','other')),
    start_time      TIMESTAMPTZ NOT NULL,
    end_time        TIMESTAMPTZ NOT NULL,
    all_day         BOOLEAN     NOT NULL DEFAULT FALSE,
    location        VARCHAR(300),
    meeting_url     TEXT,
    organizer_id    UUID        REFERENCES employees(id),
    attendees       JSONB       NOT NULL DEFAULT '[]',
    contact_id      UUID        REFERENCES contacts(id),
    deal_id         UUID        REFERENCES deals(id),
    status          VARCHAR(20) NOT NULL DEFAULT 'scheduled'
                        CHECK (status IN ('scheduled','confirmed','cancelled','completed')),
    recurrence      JSONB,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_cal_events_tenant    ON calendar_events (tenant_id)               WHERE deleted_at IS NULL;
CREATE INDEX idx_cal_events_organizer ON calendar_events (tenant_id, organizer_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_cal_events_range     ON calendar_events (tenant_id, start_time, end_time) WHERE deleted_at IS NULL;

-- ======== PRODUCTS & QUOTATIONS ========

CREATE TABLE products (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(300) NOT NULL,
    sku             VARCHAR(100),
    description     TEXT,
    category        VARCHAR(100),
    base_price      NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (base_price >= 0),
    currency        VARCHAR(3)  NOT NULL DEFAULT 'USD',
    unit            VARCHAR(30) NOT NULL DEFAULT 'license',
    status          VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active','inactive','discontinued')),
    image_url       TEXT,
    features        JSONB       NOT NULL DEFAULT '[]',
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_products_tenant ON products (tenant_id)            WHERE deleted_at IS NULL;
CREATE INDEX idx_products_sku    ON products (tenant_id, sku)       WHERE deleted_at IS NULL AND sku IS NOT NULL;

CREATE TABLE pricing_tiers (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    product_id      UUID        NOT NULL REFERENCES products(id),
    tier_name       VARCHAR(100) NOT NULL,
    min_quantity    INTEGER     NOT NULL DEFAULT 1 CHECK (min_quantity >= 1),
    max_quantity    INTEGER,
    unit_price      NUMERIC(15,2) NOT NULL CHECK (unit_price >= 0),
    billing_cycle   VARCHAR(15) NOT NULL DEFAULT 'monthly'
                        CHECK (billing_cycle IN ('one-time','monthly','quarterly','annually')),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_pricing_tiers ON pricing_tiers (tenant_id, product_id) WHERE deleted_at IS NULL;

CREATE TABLE quotations (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    quote_number    VARCHAR(50) NOT NULL,
    contact_id      UUID        REFERENCES contacts(id),
    deal_id         UUID        REFERENCES deals(id),
    owner_id        UUID        REFERENCES employees(id),
    status          VARCHAR(20) NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft','sent','viewed','accepted','rejected','expired')),
    subtotal        NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
    discount_amount NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (discount_amount >= 0),
    tax_amount      NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
    total           NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (total >= 0),
    currency        VARCHAR(3)  NOT NULL DEFAULT 'USD',
    valid_until     DATE,
    notes           TEXT,
    terms           TEXT,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_quotations_number ON quotations (tenant_id, quote_number) WHERE deleted_at IS NULL;
CREATE INDEX idx_quotations_contact      ON quotations (tenant_id, contact_id)   WHERE deleted_at IS NULL;

CREATE TABLE quotation_line_items (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    quotation_id    UUID        NOT NULL REFERENCES quotations(id),
    product_id      UUID        REFERENCES products(id),
    description     VARCHAR(500) NOT NULL,
    quantity        NUMERIC(10,2) NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price      NUMERIC(15,2) NOT NULL CHECK (unit_price >= 0),
    discount_percent NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (discount_percent BETWEEN 0 AND 100),
    line_total      NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (line_total >= 0),
    sort_order      INTEGER     NOT NULL DEFAULT 0,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_quote_items ON quotation_line_items (tenant_id, quotation_id) WHERE deleted_at IS NULL;
