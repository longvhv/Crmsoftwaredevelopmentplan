# Phân hệ 08 — Hoa hồng & Dự báo (Commission & Forecast)

> Cấu trúc hoa hồng đa bậc, thưởng, dự báo doanh số.

---

## 1. `commission_tiers`

Bậc tính hoa hồng (tier structure).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(100)` | NO | — | NOT BLANK | Tên bậc (Bronze, Silver, Gold, …) |
| `min_revenue` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Ngưỡng doanh thu tối thiểu |
| `max_revenue` | `NUMERIC(18,2)` | YES | `NULL` | NULL = không giới hạn | Ngưỡng doanh thu tối đa |
| `rate` | `NUMERIC(5,2)` | NO | `0` | CHECK BETWEEN 0 AND 100 | Tỉ lệ hoa hồng (%) |
| `accelerator` | `NUMERIC(5,2)` | NO | `1.00` | CHECK > 0 | Hệ số nhân khi vượt quota |
| `description` | `TEXT` | YES | `NULL` | — | Mô tả chi tiết |
| `sort_order` | `INTEGER` | NO | `0` | — | Thứ tự hiển thị |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 2. `bonus_rules`

Quy tắc thưởng bổ sung ngoài hoa hồng.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(150)` | NO | — | NOT BLANK | Tên quy tắc |
| `condition_expr` | `TEXT` | NO | — | NOT BLANK | Điều kiện áp dụng (mô tả / biểu thức) |
| `bonus_value` | `NUMERIC(15,2)` | NO | `0` | CHECK >= 0 | Giá trị thưởng |
| `bonus_type` | `VARCHAR(15)` | NO | `'flat'` | CHECK IN ('flat','percentage') | Loại: số tiền cố định / % |
| `icon` | `VARCHAR(50)` | YES | `NULL` | — | Icon hiển thị |
| `is_active` | `BOOLEAN` | NO | `TRUE` | — | Đang kích hoạt |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 3. `sales_rep_commissions`

Hoa hồng thực tế đã tính cho từng sales rep theo kỳ.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `employee_id` | `UUID` | NO | — | FK → employees(id) | Nhân viên sales |
| `period_year` | `SMALLINT` | NO | — | CHECK > 2000 | Năm kỳ tính |
| `period_month` | `SMALLINT` | NO | — | CHECK BETWEEN 1 AND 12 | Tháng kỳ tính |
| `quota` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Chỉ tiêu kỳ |
| `revenue` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Doanh thu thực tế |
| `attainment` | `NUMERIC(5,2)` | NO | `0` | CHECK >= 0 | Tỉ lệ đạt (%) |
| `tier_id` | `UUID` | YES | `NULL` | FK → commission_tiers(id) | Bậc áp dụng |
| `base_commission` | `NUMERIC(15,2)` | NO | `0` | CHECK >= 0 | Hoa hồng cơ bản |
| `accelerator_commission` | `NUMERIC(15,2)` | NO | `0` | CHECK >= 0 | Hoa hồng accelerator |
| `total_commission` | `NUMERIC(15,2)` | NO | `0` | CHECK >= 0 | Tổng hoa hồng (base + accelerator + bonus) |
| `split_deals` | `INTEGER` | NO | `0` | CHECK >= 0 | Số deal chia hoa hồng |
| `payout_status` | `VARCHAR(20)` | NO | `'pending'` | CHECK IN ('paid','pending','processing') | Trạng thái chi trả |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

> **UNIQUE constraint:** `(tenant_id, employee_id, period_year, period_month)` WHERE `deleted_at IS NULL`

---

## 4. `commission_bonuses`

Chi tiết bonus đã áp dụng cho mỗi kỳ commission.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `commission_id` | `UUID` | NO | — | FK → sales_rep_commissions(id) | Kỳ commission |
| `bonus_rule_id` | `UUID` | NO | — | FK → bonus_rules(id) | Quy tắc bonus |
| `bonus_name` | `VARCHAR(150)` | NO | — | NOT BLANK | Tên bonus (denormalized) |
| `amount` | `NUMERIC(15,2)` | NO | `0` | CHECK >= 0 | Số tiền thưởng |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 5. `rep_forecasts`

Dự báo doanh số theo sales rep (snapshot theo kỳ).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `employee_id` | `UUID` | NO | — | FK → employees(id) | Nhân viên sales |
| `period_year` | `SMALLINT` | NO | — | CHECK > 2000 | Năm dự báo |
| `period_quarter` | `SMALLINT` | NO | — | CHECK BETWEEN 1 AND 4 | Quý dự báo |
| `quota` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Chỉ tiêu |
| `commit` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Cam kết |
| `best_case` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Kịch bản tốt nhất |
| `upside` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Dự phòng tăng |
| `pipeline` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Pipeline đang mở |
| `coverage` | `NUMERIC(5,2)` | NO | `0` | CHECK >= 0 | Pipeline coverage ratio |
| `ai_confidence` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Độ tin cậy AI |
| `ai_note` | `TEXT` | YES | `NULL` | — | Ghi chú AI |
| `trend` | `VARCHAR(10)` | NO | `'stable'` | CHECK IN ('up','down','stable') | Xu hướng |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## Câu lệnh YSQL

```sql
-- ============================================================
-- PHÂN HỆ 08: HOA HỒNG & DỰ BÁO
-- ============================================================

-- 1. commission_tiers
CREATE TABLE commission_tiers (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(100) NOT NULL,
    min_revenue     NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (min_revenue >= 0),
    max_revenue     NUMERIC(18,2) CHECK (max_revenue IS NULL OR max_revenue >= min_revenue),
    rate            NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (rate BETWEEN 0 AND 100),
    accelerator     NUMERIC(5,2) NOT NULL DEFAULT 1.00 CHECK (accelerator > 0),
    description     TEXT,
    sort_order      INTEGER     NOT NULL DEFAULT 0,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_commission_tiers_tenant ON commission_tiers (tenant_id, sort_order) WHERE deleted_at IS NULL;

-- 2. bonus_rules
CREATE TABLE bonus_rules (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(150) NOT NULL,
    condition_expr  TEXT        NOT NULL,
    bonus_value     NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (bonus_value >= 0),
    bonus_type      VARCHAR(15) NOT NULL DEFAULT 'flat'
                        CHECK (bonus_type IN ('flat','percentage')),
    icon            VARCHAR(50),
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_bonus_rules_tenant ON bonus_rules (tenant_id) WHERE deleted_at IS NULL;

-- 3. sales_rep_commissions
CREATE TABLE sales_rep_commissions (
    id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id               UUID        NOT NULL REFERENCES tenants(id),
    employee_id             UUID        NOT NULL REFERENCES employees(id),
    period_year             SMALLINT    NOT NULL CHECK (period_year > 2000),
    period_month            SMALLINT    NOT NULL CHECK (period_month BETWEEN 1 AND 12),
    quota                   NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (quota >= 0),
    revenue                 NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (revenue >= 0),
    attainment              NUMERIC(5,2)  NOT NULL DEFAULT 0 CHECK (attainment >= 0),
    tier_id                 UUID        REFERENCES commission_tiers(id),
    base_commission         NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (base_commission >= 0),
    accelerator_commission  NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (accelerator_commission >= 0),
    total_commission        NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (total_commission >= 0),
    split_deals             INTEGER     NOT NULL DEFAULT 0 CHECK (split_deals >= 0),
    payout_status           VARCHAR(20) NOT NULL DEFAULT 'pending'
                                CHECK (payout_status IN ('paid','pending','processing')),
    version                 INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at              TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_rep_commissions_period ON sales_rep_commissions (tenant_id, employee_id, period_year, period_month) WHERE deleted_at IS NULL;
CREATE INDEX idx_rep_commissions_tenant      ON sales_rep_commissions (tenant_id)               WHERE deleted_at IS NULL;
CREATE INDEX idx_rep_commissions_employee    ON sales_rep_commissions (tenant_id, employee_id)   WHERE deleted_at IS NULL;
CREATE INDEX idx_rep_commissions_payout      ON sales_rep_commissions (tenant_id, payout_status) WHERE deleted_at IS NULL;

-- 4. commission_bonuses
CREATE TABLE commission_bonuses (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    commission_id   UUID        NOT NULL REFERENCES sales_rep_commissions(id),
    bonus_rule_id   UUID        NOT NULL REFERENCES bonus_rules(id),
    bonus_name      VARCHAR(150) NOT NULL,
    amount          NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (amount >= 0),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_commission_bonuses ON commission_bonuses (tenant_id, commission_id) WHERE deleted_at IS NULL;

-- 5. rep_forecasts
CREATE TABLE rep_forecasts (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    employee_id     UUID        NOT NULL REFERENCES employees(id),
    period_year     SMALLINT    NOT NULL CHECK (period_year > 2000),
    period_quarter  SMALLINT    NOT NULL CHECK (period_quarter BETWEEN 1 AND 4),
    quota           NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (quota >= 0),
    commit          NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (commit >= 0),
    best_case       NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (best_case >= 0),
    upside          NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (upside >= 0),
    pipeline        NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (pipeline >= 0),
    coverage        NUMERIC(5,2)  NOT NULL DEFAULT 0 CHECK (coverage >= 0),
    ai_confidence   SMALLINT    NOT NULL DEFAULT 0 CHECK (ai_confidence BETWEEN 0 AND 100),
    ai_note         TEXT,
    trend           VARCHAR(10) NOT NULL DEFAULT 'stable'
                        CHECK (trend IN ('up','down','stable')),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_rep_forecasts ON rep_forecasts (tenant_id, employee_id, period_year, period_quarter) WHERE deleted_at IS NULL;
CREATE INDEX idx_rep_forecasts_tenant   ON rep_forecasts (tenant_id)             WHERE deleted_at IS NULL;
CREATE INDEX idx_rep_forecasts_employee ON rep_forecasts (tenant_id, employee_id) WHERE deleted_at IS NULL;
```
