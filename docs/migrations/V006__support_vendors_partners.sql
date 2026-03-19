-- ============================================================
-- V006: Hỗ trợ, Nhà cung cấp & Đối tác
-- Phân hệ: 09-support, 10-vendor-partner
-- Phụ thuộc: V002 (contacts, employees, deals)
-- ============================================================

-- ======== SUPPORT ========

CREATE TABLE support_tickets (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    ticket_number   VARCHAR(50) NOT NULL,
    subject         VARCHAR(300) NOT NULL,
    description     TEXT,
    contact_id      UUID        REFERENCES contacts(id),
    assigned_to     UUID        REFERENCES employees(id),
    status          VARCHAR(20) NOT NULL DEFAULT 'open'
                        CHECK (status IN ('open','in-progress','waiting','resolved','closed')),
    priority        VARCHAR(10) NOT NULL DEFAULT 'medium'
                        CHECK (priority IN ('low','medium','high','critical')),
    category        VARCHAR(100),
    channel         VARCHAR(20) NOT NULL DEFAULT 'email'
                        CHECK (channel IN ('email','phone','chat','portal','social')),
    resolution      TEXT,
    satisfaction    SMALLINT    CHECK (satisfaction IS NULL OR satisfaction BETWEEN 1 AND 5),
    first_response_at TIMESTAMPTZ,
    resolved_at     TIMESTAMPTZ,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_tickets_number ON support_tickets (tenant_id, ticket_number) WHERE deleted_at IS NULL;
CREATE INDEX idx_tickets_tenant       ON support_tickets (tenant_id)                WHERE deleted_at IS NULL;
CREATE INDEX idx_tickets_contact      ON support_tickets (tenant_id, contact_id)    WHERE deleted_at IS NULL;
CREATE INDEX idx_tickets_assigned     ON support_tickets (tenant_id, assigned_to)   WHERE deleted_at IS NULL;
CREATE INDEX idx_tickets_status       ON support_tickets (tenant_id, status)        WHERE deleted_at IS NULL;

CREATE TABLE ticket_messages (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    ticket_id       UUID        NOT NULL REFERENCES support_tickets(id),
    sender_type     VARCHAR(10) NOT NULL CHECK (sender_type IN ('agent','customer','system')),
    sender_id       UUID,
    message         TEXT        NOT NULL,
    attachments     JSONB       NOT NULL DEFAULT '[]',
    is_internal     BOOLEAN     NOT NULL DEFAULT FALSE,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_ticket_messages ON ticket_messages (tenant_id, ticket_id, created_at) WHERE deleted_at IS NULL;

-- ======== VENDORS & PARTNERS ========

CREATE TABLE vendors (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(255) NOT NULL,
    contact_email   VARCHAR(320),
    contact_phone   VARCHAR(30),
    website         TEXT,
    category        VARCHAR(100),
    status          VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active','inactive','blacklisted')),
    rating          SMALLINT    CHECK (rating IS NULL OR rating BETWEEN 1 AND 5),
    payment_terms   VARCHAR(50),
    address         JSONB       NOT NULL DEFAULT '{}',
    notes           TEXT,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_vendors_tenant ON vendors (tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE vendor_contracts (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    vendor_id       UUID        NOT NULL REFERENCES vendors(id),
    contract_number VARCHAR(50),
    name            VARCHAR(300) NOT NULL,
    value           NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (value >= 0),
    currency        VARCHAR(3)  NOT NULL DEFAULT 'USD',
    start_date      DATE,
    end_date        DATE,
    status          VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK (status IN ('draft','active','expired','terminated')),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_vendor_contracts ON vendor_contracts (tenant_id, vendor_id) WHERE deleted_at IS NULL;

CREATE TABLE partners (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(255) NOT NULL,
    partner_type    VARCHAR(20) NOT NULL DEFAULT 'reseller'
                        CHECK (partner_type IN ('reseller','referral','technology','strategic','affiliate')),
    status          VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active','inactive','pending','suspended')),
    tier            VARCHAR(20) NOT NULL DEFAULT 'silver'
                        CHECK (tier IN ('bronze','silver','gold','platinum')),
    contact_name    VARCHAR(200),
    contact_email   VARCHAR(320),
    contact_phone   VARCHAR(30),
    website         TEXT,
    commission_rate NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (commission_rate BETWEEN 0 AND 100),
    total_referrals INTEGER     NOT NULL DEFAULT 0 CHECK (total_referrals >= 0),
    total_revenue   NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (total_revenue >= 0),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_partners_tenant ON partners (tenant_id)       WHERE deleted_at IS NULL;
CREATE INDEX idx_partners_type   ON partners (tenant_id, partner_type) WHERE deleted_at IS NULL;
