# Phân hệ 10 — Nhà cung cấp & Đối tác (Vendor & Partner)

> Quản lý nhà cung cấp bên ngoài, đối tác kinh doanh, chấm điểm & xếp hạng.

---

## 1. `vendors`

Nhà cung cấp bên ngoài (development, design, infra, …).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên nhà cung cấp |
| `logo_url` | `TEXT` | YES | `NULL` | — | URL logo |
| `category` | `VARCHAR(30)` | NO | `'development'` | CHECK IN ('development','design','infrastructure','consulting','qa-testing','ai-ml') | Danh mục |
| `status` | `VARCHAR(20)` | NO | `'evaluating'` | CHECK IN ('active','on-hold','evaluating','terminated') | Trạng thái |
| `tier` | `VARCHAR(20)` | NO | `'trial'` | CHECK IN ('strategic','preferred','approved','trial') | Cấp độ vendor |
| `country` | `VARCHAR(100)` | YES | `NULL` | — | Quốc gia |
| `contact_person` | `VARCHAR(255)` | YES | `NULL` | — | Người liên hệ chính |
| `contact_email` | `VARCHAR(320)` | YES | `NULL` | — | Email liên hệ |
| `contact_phone` | `VARCHAR(30)` | YES | `NULL` | — | Điện thoại liên hệ |
| `description` | `TEXT` | YES | `NULL` | — | Mô tả |
| `team_size` | `INTEGER` | NO | `0` | CHECK >= 0 | Quy mô đội ngũ |
| `hourly_rate_min` | `NUMERIC(10,2)` | YES | `NULL` | CHECK >= 0 | Đơn giá giờ thấp nhất |
| `hourly_rate_max` | `NUMERIC(10,2)` | YES | `NULL` | CHECK >= hourly_rate_min | Đơn giá giờ cao nhất |
| `overall_score` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Điểm tổng thể |
| `quality_score` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Điểm chất lượng |
| `delivery_score` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Điểm giao hàng |
| `communication_score` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Điểm giao tiếp |
| `cost_score` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Điểm chi phí |
| `innovation_score` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Điểm đổi mới |
| `security_score` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Điểm bảo mật |
| `total_spend` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Tổng chi tiêu |
| `active_projects` | `INTEGER` | NO | `0` | CHECK >= 0 | Dự án đang chạy |
| `completed_projects` | `INTEGER` | NO | `0` | CHECK >= 0 | Dự án đã hoàn thành |
| `trend` | `VARCHAR(10)` | NO | `'stable'` | CHECK IN ('up','down','stable') | Xu hướng |
| `ai_note` | `TEXT` | YES | `NULL` | — | AI ghi chú |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 2. `vendor_contracts`

Hợp đồng với nhà cung cấp.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `vendor_id` | `UUID` | NO | — | FK → vendors(id) | Nhà cung cấp |
| `name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên hợp đồng |
| `start_date` | `DATE` | NO | — | — | Ngày bắt đầu |
| `end_date` | `DATE` | NO | — | CHECK end_date >= start_date | Ngày kết thúc |
| `value` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Giá trị hợp đồng |
| `currency` | `VARCHAR(3)` | NO | `'USD'` | ISO 4217 | Đơn vị tiền tệ |
| `status` | `VARCHAR(20)` | NO | `'active'` | CHECK IN ('active','expiring','expired') | Trạng thái |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 3. `partners`

Đối tác kinh doanh (reseller, SI, technology, …).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên đối tác |
| `logo_url` | `TEXT` | YES | `NULL` | — | URL logo |
| `tier` | `VARCHAR(20)` | NO | `'registered'` | CHECK IN ('platinum','gold','silver','registered') | Hạng đối tác |
| `partner_type` | `VARCHAR(20)` | NO | `'referral'` | CHECK IN ('reseller','si','technology','consulting','referral') | Loại đối tác |
| `region` | `VARCHAR(100)` | YES | `NULL` | — | Khu vực hoạt động |
| `score` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Điểm đối tác |
| `revenue_generated` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Doanh thu đã tạo |
| `revenue_target` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Mục tiêu doanh thu |
| `deals_registered` | `INTEGER` | NO | `0` | CHECK >= 0 | Số deal đã đăng ký |
| `deals_won` | `INTEGER` | NO | `0` | CHECK >= 0 | Số deal đã thắng |
| `certified_staff` | `INTEGER` | NO | `0` | CHECK >= 0 | Nhân sự đã chứng nhận |
| `required_certs` | `INTEGER` | NO | `0` | CHECK >= 0 | Số chứng nhận yêu cầu |
| `nps` | `SMALLINT` | YES | `NULL` | CHECK BETWEEN -100 AND 100 | Điểm NPS |
| `last_activity_at` | `TIMESTAMPTZ` | YES | `NULL` | — | Hoạt động gần nhất |
| `status` | `VARCHAR(20)` | NO | `'active'` | CHECK IN ('active','at-risk','inactive') | Trạng thái |
| `specializations` | `JSONB` | NO | `'[]'` | — | Chuyên môn ['cloud','ai',…] |
| `trend` | `VARCHAR(10)` | NO | `'flat'` | CHECK IN ('up','down','flat') | Xu hướng |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## Câu lệnh YSQL

```sql
-- ============================================================
-- PHÂN HỆ 10: NHÀ CUNG CẤP & ĐỐI TÁC
-- ============================================================

-- 1. vendors
CREATE TABLE vendors (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    name                VARCHAR(255) NOT NULL,
    logo_url            TEXT,
    category            VARCHAR(30) NOT NULL DEFAULT 'development'
                            CHECK (category IN ('development','design','infrastructure','consulting','qa-testing','ai-ml')),
    status              VARCHAR(20) NOT NULL DEFAULT 'evaluating'
                            CHECK (status IN ('active','on-hold','evaluating','terminated')),
    tier                VARCHAR(20) NOT NULL DEFAULT 'trial'
                            CHECK (tier IN ('strategic','preferred','approved','trial')),
    country             VARCHAR(100),
    contact_person      VARCHAR(255),
    contact_email       VARCHAR(320),
    contact_phone       VARCHAR(30),
    description         TEXT,
    team_size           INTEGER     NOT NULL DEFAULT 0 CHECK (team_size >= 0),
    hourly_rate_min     NUMERIC(10,2) CHECK (hourly_rate_min IS NULL OR hourly_rate_min >= 0),
    hourly_rate_max     NUMERIC(10,2),
    overall_score       SMALLINT    NOT NULL DEFAULT 0 CHECK (overall_score BETWEEN 0 AND 100),
    quality_score       SMALLINT    NOT NULL DEFAULT 0 CHECK (quality_score BETWEEN 0 AND 100),
    delivery_score      SMALLINT    NOT NULL DEFAULT 0 CHECK (delivery_score BETWEEN 0 AND 100),
    communication_score SMALLINT    NOT NULL DEFAULT 0 CHECK (communication_score BETWEEN 0 AND 100),
    cost_score          SMALLINT    NOT NULL DEFAULT 0 CHECK (cost_score BETWEEN 0 AND 100),
    innovation_score    SMALLINT    NOT NULL DEFAULT 0 CHECK (innovation_score BETWEEN 0 AND 100),
    security_score      SMALLINT    NOT NULL DEFAULT 0 CHECK (security_score BETWEEN 0 AND 100),
    total_spend         NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (total_spend >= 0),
    active_projects     INTEGER     NOT NULL DEFAULT 0 CHECK (active_projects >= 0),
    completed_projects  INTEGER     NOT NULL DEFAULT 0 CHECK (completed_projects >= 0),
    trend               VARCHAR(10) NOT NULL DEFAULT 'stable'
                            CHECK (trend IN ('up','down','stable')),
    ai_note             TEXT,
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_vendors_tenant     ON vendors (tenant_id)              WHERE deleted_at IS NULL;
CREATE INDEX idx_vendors_category   ON vendors (tenant_id, category)    WHERE deleted_at IS NULL;
CREATE INDEX idx_vendors_status     ON vendors (tenant_id, status)      WHERE deleted_at IS NULL;
CREATE INDEX idx_vendors_tier       ON vendors (tenant_id, tier)        WHERE deleted_at IS NULL;

-- 2. vendor_contracts
CREATE TABLE vendor_contracts (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    vendor_id       UUID        NOT NULL REFERENCES vendors(id),
    name            VARCHAR(255) NOT NULL,
    start_date      DATE        NOT NULL,
    end_date        DATE        NOT NULL,
    value           NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (value >= 0),
    currency        VARCHAR(3)  NOT NULL DEFAULT 'USD',
    status          VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active','expiring','expired')),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    CONSTRAINT chk_vendor_contract_dates CHECK (end_date >= start_date)
);

CREATE INDEX idx_vendor_contracts_vendor ON vendor_contracts (tenant_id, vendor_id) WHERE deleted_at IS NULL;

-- 3. partners
CREATE TABLE partners (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    name                VARCHAR(255) NOT NULL,
    logo_url            TEXT,
    tier                VARCHAR(20) NOT NULL DEFAULT 'registered'
                            CHECK (tier IN ('platinum','gold','silver','registered')),
    partner_type        VARCHAR(20) NOT NULL DEFAULT 'referral'
                            CHECK (partner_type IN ('reseller','si','technology','consulting','referral')),
    region              VARCHAR(100),
    score               SMALLINT    NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
    revenue_generated   NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (revenue_generated >= 0),
    revenue_target      NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (revenue_target >= 0),
    deals_registered    INTEGER     NOT NULL DEFAULT 0 CHECK (deals_registered >= 0),
    deals_won           INTEGER     NOT NULL DEFAULT 0 CHECK (deals_won >= 0),
    certified_staff     INTEGER     NOT NULL DEFAULT 0 CHECK (certified_staff >= 0),
    required_certs      INTEGER     NOT NULL DEFAULT 0 CHECK (required_certs >= 0),
    nps                 SMALLINT    CHECK (nps IS NULL OR nps BETWEEN -100 AND 100),
    last_activity_at    TIMESTAMPTZ,
    status              VARCHAR(20) NOT NULL DEFAULT 'active'
                            CHECK (status IN ('active','at-risk','inactive')),
    specializations     JSONB       NOT NULL DEFAULT '[]',
    trend               VARCHAR(10) NOT NULL DEFAULT 'flat'
                            CHECK (trend IN ('up','down','flat')),
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_partners_tenant    ON partners (tenant_id)             WHERE deleted_at IS NULL;
CREATE INDEX idx_partners_tier      ON partners (tenant_id, tier)       WHERE deleted_at IS NULL;
CREATE INDEX idx_partners_type      ON partners (tenant_id, partner_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_partners_status    ON partners (tenant_id, status)     WHERE deleted_at IS NULL;
```
