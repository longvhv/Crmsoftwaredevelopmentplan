# Phân hệ 13 — Lãnh thổ & Chỉ tiêu (Territory & Quota)

> Quản lý vùng lãnh thổ sales, phân bổ chỉ tiêu, theo dõi hiệu quả.

---

## 1. `territories`

Vùng lãnh thổ sales.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(200)` | NO | — | UNIQUE per tenant, NOT BLANK | Tên lãnh thổ |
| `region` | `VARCHAR(20)` | NO | `'apac'` | CHECK IN ('apac','emea','americas','vietnam') | Khu vực |
| `country` | `VARCHAR(100)` | YES | `NULL` | — | Quốc gia |
| `flag` | `VARCHAR(10)` | YES | `NULL` | — | Emoji cờ quốc gia |
| `status` | `VARCHAR(20)` | NO | `'active'` | CHECK IN ('active','underperforming','high-growth','new') | Trạng thái |
| `revenue` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Doanh thu hiện tại |
| `target` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Mục tiêu doanh thu |
| `attainment` | `NUMERIC(5,2)` | NO | `0` | CHECK >= 0 | Tỉ lệ đạt (%) |
| `accounts` | `INTEGER` | NO | `0` | CHECK >= 0 | Số tài khoản |
| `active_deals` | `INTEGER` | NO | `0` | CHECK >= 0 | Số deal đang mở |
| `pipeline` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Pipeline |
| `avg_deal_size` | `NUMERIC(15,2)` | NO | `0` | CHECK >= 0 | Kích thước deal TB |
| `win_rate` | `NUMERIC(5,2)` | NO | `0` | CHECK BETWEEN 0 AND 100 | Tỉ lệ thắng (%) |
| `top_industries` | `JSONB` | NO | `'[]'` | — | Ngành hàng đầu |
| `trend` | `VARCHAR(10)` | NO | `'stable'` | CHECK IN ('up','down','stable') | Xu hướng |
| `coverage_score` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Điểm phủ sóng |
| `overlap_risk` | `BOOLEAN` | NO | `FALSE` | — | Rủi ro chồng chéo |
| `overlap_note` | `TEXT` | YES | `NULL` | — | Ghi chú chồng chéo |
| `ai_insight` | `TEXT` | YES | `NULL` | — | AI phân tích |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 2. `territory_reps`

Nhân viên trong lãnh thổ.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `territory_id` | `UUID` | NO | — | FK → territories(id) | Lãnh thổ |
| `employee_id` | `UUID` | NO | — | FK → employees(id) | Nhân viên |
| `role_in_territory` | `VARCHAR(100)` | YES | `NULL` | — | Vai trò trong lãnh thổ |
| `accounts` | `INTEGER` | NO | `0` | CHECK >= 0 | Số tài khoản quản lý |
| `quota` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Chỉ tiêu |
| `attainment` | `NUMERIC(5,2)` | NO | `0` | CHECK >= 0 | Tỉ lệ đạt (%) |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 3. `territory_quarter_revenues`

Doanh thu theo quý của lãnh thổ (time-series).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `territory_id` | `UUID` | NO | — | FK → territories(id) | Lãnh thổ |
| `quarter` | `VARCHAR(6)` | NO | — | Format 'Q1-24' | Quý |
| `revenue` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Doanh thu quý |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

> **UNIQUE:** `(tenant_id, territory_id, quarter)` WHERE `deleted_at IS NULL`

---

## 4. `quota_reps`

Chỉ tiêu doanh số nhân viên theo kỳ.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `employee_id` | `UUID` | NO | — | FK → employees(id) | Nhân viên |
| `team` | `VARCHAR(100)` | YES | `NULL` | — | Đội / nhóm |
| `period` | `VARCHAR(15)` | NO | `'quarterly'` | CHECK IN ('monthly','quarterly','yearly') | Kỳ quota |
| `period_label` | `VARCHAR(20)` | NO | — | — | Nhãn kỳ (Q1-2026, FY2026) |
| `quota` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Chỉ tiêu |
| `closed` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Doanh thu đã đóng |
| `pipeline` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Pipeline |
| `attainment` | `NUMERIC(5,2)` | NO | `0` | CHECK >= 0 | Tỉ lệ đạt (%) |
| `status` | `VARCHAR(20)` | NO | `'on-track'` | CHECK IN ('exceeded','on-track','at-risk','behind') | Trạng thái |
| `trend` | `VARCHAR(10)` | NO | `'flat'` | CHECK IN ('up','down','flat') | Xu hướng |
| `deals_won` | `INTEGER` | NO | `0` | CHECK >= 0 | Số deal thắng |
| `deals_open` | `INTEGER` | NO | `0` | CHECK >= 0 | Số deal mở |
| `avg_deal_size` | `NUMERIC(15,2)` | NO | `0` | CHECK >= 0 | Kích thước deal TB |
| `forecast_close` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Dự báo đóng |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## Câu lệnh YSQL

```sql
-- ============================================================
-- PHÂN HỆ 13: LÃNH THỔ & CHỈ TIÊU
-- ============================================================

-- 1. territories
CREATE TABLE territories (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(200) NOT NULL,
    region          VARCHAR(20) NOT NULL DEFAULT 'apac'
                        CHECK (region IN ('apac','emea','americas','vietnam')),
    country         VARCHAR(100),
    flag            VARCHAR(10),
    status          VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active','underperforming','high-growth','new')),
    revenue         NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (revenue >= 0),
    target          NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (target >= 0),
    attainment      NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (attainment >= 0),
    accounts        INTEGER     NOT NULL DEFAULT 0 CHECK (accounts >= 0),
    active_deals    INTEGER     NOT NULL DEFAULT 0 CHECK (active_deals >= 0),
    pipeline        NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (pipeline >= 0),
    avg_deal_size   NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (avg_deal_size >= 0),
    win_rate        NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (win_rate BETWEEN 0 AND 100),
    top_industries  JSONB       NOT NULL DEFAULT '[]',
    trend           VARCHAR(10) NOT NULL DEFAULT 'stable'
                        CHECK (trend IN ('up','down','stable')),
    coverage_score  SMALLINT    NOT NULL DEFAULT 0 CHECK (coverage_score BETWEEN 0 AND 100),
    overlap_risk    BOOLEAN     NOT NULL DEFAULT FALSE,
    overlap_note    TEXT,
    ai_insight      TEXT,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_territories_name ON territories (tenant_id, name) WHERE deleted_at IS NULL;
CREATE INDEX idx_territories_tenant     ON territories (tenant_id)       WHERE deleted_at IS NULL;
CREATE INDEX idx_territories_region     ON territories (tenant_id, region) WHERE deleted_at IS NULL;

-- 2. territory_reps
CREATE TABLE territory_reps (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    territory_id        UUID        NOT NULL REFERENCES territories(id),
    employee_id         UUID        NOT NULL REFERENCES employees(id),
    role_in_territory   VARCHAR(100),
    accounts            INTEGER     NOT NULL DEFAULT 0 CHECK (accounts >= 0),
    quota               NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (quota >= 0),
    attainment          NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (attainment >= 0),
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_territory_reps ON territory_reps (tenant_id, territory_id, employee_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_territory_reps_territory ON territory_reps (tenant_id, territory_id) WHERE deleted_at IS NULL;

-- 3. territory_quarter_revenues
CREATE TABLE territory_quarter_revenues (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    territory_id    UUID        NOT NULL REFERENCES territories(id),
    quarter         VARCHAR(6)  NOT NULL,
    revenue         NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (revenue >= 0),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_territory_quarter ON territory_quarter_revenues (tenant_id, territory_id, quarter) WHERE deleted_at IS NULL;

-- 4. quota_reps
CREATE TABLE quota_reps (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    employee_id     UUID        NOT NULL REFERENCES employees(id),
    team            VARCHAR(100),
    period          VARCHAR(15) NOT NULL DEFAULT 'quarterly'
                        CHECK (period IN ('monthly','quarterly','yearly')),
    period_label    VARCHAR(20) NOT NULL,
    quota           NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (quota >= 0),
    closed          NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (closed >= 0),
    pipeline        NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (pipeline >= 0),
    attainment      NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (attainment >= 0),
    status          VARCHAR(20) NOT NULL DEFAULT 'on-track'
                        CHECK (status IN ('exceeded','on-track','at-risk','behind')),
    trend           VARCHAR(10) NOT NULL DEFAULT 'flat'
                        CHECK (trend IN ('up','down','flat')),
    deals_won       INTEGER     NOT NULL DEFAULT 0 CHECK (deals_won >= 0),
    deals_open      INTEGER     NOT NULL DEFAULT 0 CHECK (deals_open >= 0),
    avg_deal_size   NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (avg_deal_size >= 0),
    forecast_close  NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (forecast_close >= 0),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_quota_reps_tenant      ON quota_reps (tenant_id)               WHERE deleted_at IS NULL;
CREATE INDEX idx_quota_reps_employee    ON quota_reps (tenant_id, employee_id)   WHERE deleted_at IS NULL;
CREATE INDEX idx_quota_reps_status      ON quota_reps (tenant_id, status)        WHERE deleted_at IS NULL;
CREATE INDEX idx_quota_reps_period      ON quota_reps (tenant_id, period_label)  WHERE deleted_at IS NULL;
```
