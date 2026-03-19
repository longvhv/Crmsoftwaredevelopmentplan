-- ============================================================
-- V015: Deal Stages Table
-- Mở rộng: Quản lý stages tùy chỉnh cho từng pipeline & tenant
-- Phụ thuộc: V002 (deals table)
-- ============================================================

-- deal_stages: Định nghĩa các giai đoạn trong sales pipeline
CREATE TABLE deal_stages (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    pipeline        VARCHAR(100) NOT NULL DEFAULT 'default',
    name            VARCHAR(100) NOT NULL,
    display_order   SMALLINT    NOT NULL DEFAULT 0 CHECK (display_order >= 0),
    probability     SMALLINT    NOT NULL DEFAULT 0 CHECK (probability BETWEEN 0 AND 100),
    is_closed       BOOLEAN     NOT NULL DEFAULT FALSE,
    is_won          BOOLEAN     NOT NULL DEFAULT FALSE,
    color           VARCHAR(30),
    description     TEXT,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

-- Indexes
CREATE UNIQUE INDEX uk_deal_stages_name 
    ON deal_stages (tenant_id, pipeline, name) 
    WHERE deleted_at IS NULL;

CREATE INDEX idx_deal_stages_tenant 
    ON deal_stages (tenant_id) 
    WHERE deleted_at IS NULL;

CREATE INDEX idx_deal_stages_pipeline 
    ON deal_stages (tenant_id, pipeline, display_order) 
    WHERE deleted_at IS NULL;

-- Constraint: nếu is_won = TRUE thì is_closed phải = TRUE
ALTER TABLE deal_stages 
    ADD CONSTRAINT chk_deal_stages_won_closed 
    CHECK (NOT is_won OR is_closed);

-- Comment
COMMENT ON TABLE deal_stages IS 'Định nghĩa stages tùy chỉnh cho từng sales pipeline (default, enterprise, custom...)';
COMMENT ON COLUMN deal_stages.pipeline IS 'Tên pipeline (default, enterprise, SMB, etc.)';
COMMENT ON COLUMN deal_stages.display_order IS 'Thứ tự hiển thị trong UI (0 = đầu tiên)';
COMMENT ON COLUMN deal_stages.probability IS 'Xác suất thắng default cho stage này (%)';
COMMENT ON COLUMN deal_stages.is_closed IS 'Stage kết thúc (won hoặc lost)';
COMMENT ON COLUMN deal_stages.is_won IS 'Stage thắng deal (closed-won)';
