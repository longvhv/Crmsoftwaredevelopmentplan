# Phân hệ 23 — Đăng ký & Tiền tệ (Subscriptions & Currency)

> Quản lý đăng ký dịch vụ, tỉ giá đa tiền tệ.

---

## 1. `subscriptions`

Đăng ký dịch vụ của khách hàng.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `contact_id` | `UUID` | NO | — | FK → contacts(id) | Khách hàng |
| `product_id` | `UUID` | YES | `NULL` | FK → products(id) | Sản phẩm/dịch vụ |
| `plan_name` | `VARCHAR(100)` | NO | — | NOT BLANK | Tên gói |
| `status` | `VARCHAR(20)` | NO | `'active'` | CHECK IN ('active','trial','past-due','cancelled','expired','paused') | Trạng thái |
| `billing_cycle` | `VARCHAR(15)` | NO | `'monthly'` | CHECK IN ('monthly','quarterly','annually') | Chu kỳ thanh toán |
| `amount` | `NUMERIC(15,2)` | NO | `0` | CHECK >= 0 | Số tiền mỗi kỳ |
| `currency` | `VARCHAR(3)` | NO | `'USD'` | ISO 4217 | Đơn vị tiền tệ |
| `start_date` | `DATE` | NO | — | — | Ngày bắt đầu |
| `end_date` | `DATE` | YES | `NULL` | — | Ngày kết thúc |
| `trial_end_date` | `DATE` | YES | `NULL` | — | Ngày hết dùng thử |
| `next_billing_date` | `DATE` | YES | `NULL` | — | Ngày thanh toán tiếp |
| `auto_renew` | `BOOLEAN` | NO | `TRUE` | — | Tự động gia hạn |
| `cancel_reason` | `TEXT` | YES | `NULL` | — | Lý do huỷ |
| `mrr` | `NUMERIC(15,2)` | NO | `0` | CHECK >= 0 | Monthly Recurring Revenue |
| `usage_quantity` | `NUMERIC(10,2)` | YES | `NULL` | CHECK >= 0 | Lượng sử dụng (users, seats, …) |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 2. `currency_exchange_rates`

Tỉ giá hối đoái (Multi-Currency).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `from_currency` | `VARCHAR(3)` | NO | — | ISO 4217 | Tiền tệ gốc |
| `to_currency` | `VARCHAR(3)` | NO | — | ISO 4217 | Tiền tệ đích |
| `rate` | `NUMERIC(18,8)` | NO | — | CHECK > 0 | Tỉ giá |
| `effective_date` | `DATE` | NO | — | — | Ngày hiệu lực |
| `source` | `VARCHAR(50)` | NO | `'manual'` | CHECK IN ('manual','api','ecb','openexchange') | Nguồn tỉ giá |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

> **UNIQUE:** `(tenant_id, from_currency, to_currency, effective_date)` WHERE `deleted_at IS NULL`

---

## Câu lệnh YSQL

```sql
-- ============================================================
-- PHÂN HỆ 23: ĐĂNG KÝ & TIỀN TỆ
-- ============================================================

CREATE TABLE subscriptions (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    contact_id      UUID        NOT NULL REFERENCES contacts(id),
    product_id      UUID        REFERENCES products(id),
    plan_name       VARCHAR(100) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active','trial','past-due','cancelled','expired','paused')),
    billing_cycle   VARCHAR(15) NOT NULL DEFAULT 'monthly'
                        CHECK (billing_cycle IN ('monthly','quarterly','annually')),
    amount          NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (amount >= 0),
    currency        VARCHAR(3)  NOT NULL DEFAULT 'USD',
    start_date      DATE        NOT NULL,
    end_date        DATE,
    trial_end_date  DATE,
    next_billing_date DATE,
    auto_renew      BOOLEAN     NOT NULL DEFAULT TRUE,
    cancel_reason   TEXT,
    mrr             NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (mrr >= 0),
    usage_quantity  NUMERIC(10,2) CHECK (usage_quantity IS NULL OR usage_quantity >= 0),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_subscriptions_tenant   ON subscriptions (tenant_id)              WHERE deleted_at IS NULL;
CREATE INDEX idx_subscriptions_contact  ON subscriptions (tenant_id, contact_id)  WHERE deleted_at IS NULL;
CREATE INDEX idx_subscriptions_status   ON subscriptions (tenant_id, status)      WHERE deleted_at IS NULL;
CREATE INDEX idx_subscriptions_billing  ON subscriptions (tenant_id, next_billing_date) WHERE deleted_at IS NULL;

CREATE TABLE currency_exchange_rates (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    from_currency   VARCHAR(3)  NOT NULL,
    to_currency     VARCHAR(3)  NOT NULL,
    rate            NUMERIC(18,8) NOT NULL CHECK (rate > 0),
    effective_date  DATE        NOT NULL,
    source          VARCHAR(50) NOT NULL DEFAULT 'manual'
                        CHECK (source IN ('manual','api','ecb','openexchange')),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_exchange_rates ON currency_exchange_rates (tenant_id, from_currency, to_currency, effective_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_exchange_rates_tenant ON currency_exchange_rates (tenant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_exchange_rates_date   ON currency_exchange_rates (tenant_id, effective_date DESC) WHERE deleted_at IS NULL;
```
