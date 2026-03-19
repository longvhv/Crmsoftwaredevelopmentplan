# Phân hệ 26 — Tuân thủ, SLA & Trust Center

> Kiểm tra tuân thủ, chính sách SLA, chứng nhận trust, dashboard tuỳ chỉnh.

---

## 1. `compliance_checks`

Kiểm tra tuân thủ (Compliance Dashboard).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên kiểm tra |
| `framework` | `VARCHAR(50)` | NO | — | CHECK IN ('gdpr','soc2','iso27001','hipaa','pci-dss','ccpa','custom') | Framework |
| `status` | `VARCHAR(20)` | NO | `'pending'` | CHECK IN ('compliant','non-compliant','pending','in-progress','exempted') | Trạng thái |
| `category` | `VARCHAR(50)` | YES | `NULL` | — | Danh mục kiểm tra |
| `description` | `TEXT` | YES | `NULL` | — | Mô tả |
| `evidence_url` | `TEXT` | YES | `NULL` | — | URL bằng chứng |
| `due_date` | `DATE` | YES | `NULL` | — | Ngày hạn |
| `reviewer_id` | `UUID` | YES | `NULL` | FK → employees(id) | Người đánh giá |
| `risk_level` | `VARCHAR(15)` | NO | `'medium'` | CHECK IN ('critical','high','medium','low') | Mức rủi ro |
| `notes` | `TEXT` | YES | `NULL` | — | Ghi chú |
| `last_checked_at` | `TIMESTAMPTZ` | YES | `NULL` | — | Lần kiểm tra cuối |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 2. `sla_policies`

Chính sách SLA (SLA Tracking).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(200)` | NO | — | NOT BLANK | Tên chính sách |
| `description` | `TEXT` | YES | `NULL` | — | Mô tả |
| `priority` | `VARCHAR(15)` | NO | `'medium'` | CHECK IN ('critical','high','medium','low') | Mức ưu tiên áp dụng |
| `response_time_hours` | `NUMERIC(6,1)` | NO | `4` | CHECK > 0 | Thời gian phản hồi cam kết (giờ) |
| `resolution_time_hours` | `NUMERIC(6,1)` | NO | `24` | CHECK > 0 | Thời gian giải quyết cam kết (giờ) |
| `business_hours_only` | `BOOLEAN` | NO | `TRUE` | — | Chỉ tính giờ hành chính |
| `escalation_rules` | `JSONB` | NO | `'[]'` | — | Quy tắc leo thang |
| `is_active` | `BOOLEAN` | NO | `TRUE` | — | Đang kích hoạt |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 3. `trust_certifications`

Chứng nhận bảo mật & tin cậy (Trust Center).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(200)` | NO | — | NOT BLANK | Tên chứng nhận |
| `issuer` | `VARCHAR(200)` | YES | `NULL` | — | Cơ quan cấp |
| `cert_type` | `VARCHAR(30)` | NO | — | CHECK IN ('security','privacy','quality','industry','custom') | Loại chứng nhận |
| `status` | `VARCHAR(20)` | NO | `'valid'` | CHECK IN ('valid','expired','pending','revoked') | Trạng thái |
| `issued_date` | `DATE` | YES | `NULL` | — | Ngày cấp |
| `expiry_date` | `DATE` | YES | `NULL` | — | Ngày hết hạn |
| `certificate_url` | `TEXT` | YES | `NULL` | — | URL chứng nhận |
| `description` | `TEXT` | YES | `NULL` | — | Mô tả |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 4. `custom_dashboards`

Dashboard tuỳ chỉnh (Custom Dashboard).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên dashboard |
| `description` | `TEXT` | YES | `NULL` | — | Mô tả |
| `owner_id` | `UUID` | NO | — | FK → users(id) | Chủ sở hữu |
| `is_shared` | `BOOLEAN` | NO | `FALSE` | — | Chia sẻ team |
| `layout` | `JSONB` | NO | `'[]'` | — | Bố cục widget [{id,type,position,size,config}] |
| `filters` | `JSONB` | NO | `'{}'` | — | Bộ lọc mặc định |
| `refresh_interval` | `INTEGER` | YES | `NULL` | CHECK >= 0 | Tần suất refresh (giây) |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## Câu lệnh YSQL

```sql
-- ============================================================
-- PHÂN HỆ 26: TUÂN THỦ, SLA & TRUST CENTER
-- ============================================================

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

CREATE INDEX idx_compliance_tenant      ON compliance_checks (tenant_id)              WHERE deleted_at IS NULL;
CREATE INDEX idx_compliance_framework   ON compliance_checks (tenant_id, framework)   WHERE deleted_at IS NULL;
CREATE INDEX idx_compliance_status      ON compliance_checks (tenant_id, status)      WHERE deleted_at IS NULL;

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

CREATE INDEX idx_sla_policies_tenant ON sla_policies (tenant_id) WHERE deleted_at IS NULL;

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

CREATE INDEX idx_trust_certs_tenant ON trust_certifications (tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_trust_certs_status ON trust_certifications (tenant_id, status) WHERE deleted_at IS NULL;

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

CREATE INDEX idx_custom_dashboards_tenant ON custom_dashboards (tenant_id)           WHERE deleted_at IS NULL;
CREATE INDEX idx_custom_dashboards_owner  ON custom_dashboards (tenant_id, owner_id) WHERE deleted_at IS NULL;
```
