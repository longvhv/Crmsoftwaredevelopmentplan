# Phân hệ 06 — Sản phẩm & Báo giá (Products & Quotations)

> Catalog sản phẩm/dịch vụ, gói giá, báo giá cho khách hàng.

---

## 1. `products`

Sản phẩm / Dịch vụ trong catalog.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên sản phẩm |
| `short_description` | `TEXT` | YES | `NULL` | — | Mô tả ngắn |
| `product_type` | `VARCHAR(20)` | NO | `'product'` | CHECK IN ('product','service','bundle') | Loại sản phẩm |
| `category` | `VARCHAR(30)` | NO | `'product'` | CHECK IN ('outsource','product','consulting','ai-solution','maintenance','training') | Danh mục |
| `pricing_model` | `VARCHAR(20)` | NO | `'fixed'` | CHECK IN ('fixed','hourly','monthly','per-user','custom') | Mô hình định giá |
| `base_price` | `NUMERIC(15,2)` | NO | `0` | CHECK >= 0 | Giá cơ bản |
| `currency` | `VARCHAR(3)` | NO | `'USD'` | ISO 4217 | Đơn vị tiền tệ |
| `deals_using` | `INTEGER` | NO | `0` | CHECK >= 0 | Số deal đang dùng (computed/cached) |
| `total_revenue` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Tổng doanh thu |
| `avg_deal_size` | `NUMERIC(15,2)` | NO | `0` | CHECK >= 0 | Kích thước deal trung bình |
| `win_rate` | `NUMERIC(5,2)` | NO | `0` | CHECK BETWEEN 0 AND 100 | Tỉ lệ thắng (%) |
| `status` | `VARCHAR(20)` | NO | `'active'` | CHECK IN ('active','draft','deprecated') | Trạng thái |
| `ai_tech_fit_score` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | AI tech fit score |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 2. `pricing_tiers`

Gói giá của sản phẩm (1 sản phẩm có nhiều gói).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `product_id` | `UUID` | NO | — | FK → products(id) | Thuộc sản phẩm nào |
| `name` | `VARCHAR(100)` | NO | — | NOT BLANK | Tên gói (Basic, Pro, …) |
| `price` | `NUMERIC(15,2)` | NO | `0` | CHECK >= 0 | Giá gói |
| `unit` | `VARCHAR(50)` | NO | `'month'` | — | Đơn vị tính (month, user, hour) |
| `features` | `JSONB` | NO | `'[]'` | — | Danh sách tính năng |
| `is_recommended` | `BOOLEAN` | NO | `FALSE` | — | Gói được đề xuất |
| `sort_order` | `INTEGER` | NO | `0` | — | Thứ tự hiển thị |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 3. `quotations`

Báo giá cho khách hàng.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `code` | `VARCHAR(50)` | NO | — | UNIQUE per tenant | Mã báo giá (QT-2026-001) |
| `contact_id` | `UUID` | NO | — | FK → contacts(id) | Khách hàng |
| `deal_id` | `UUID` | YES | `NULL` | FK → deals(id) | Deal liên quan |
| `status` | `VARCHAR(20)` | NO | `'draft'` | CHECK IN ('draft','sent','viewed','accepted','rejected','expired') | Trạng thái |
| `subtotal` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Tổng phụ trước chiết khấu |
| `discount_total` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Tổng chiết khấu |
| `tax_rate` | `NUMERIC(5,2)` | NO | `0` | CHECK BETWEEN 0 AND 100 | Thuế suất (%) |
| `tax_amount` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Tiền thuế |
| `grand_total` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Tổng cộng cuối |
| `currency` | `VARCHAR(3)` | NO | `'VND'` | ISO 4217 | Đơn vị tiền tệ |
| `valid_until` | `DATE` | NO | — | — | Ngày hết hạn báo giá |
| `notes` | `TEXT` | YES | `NULL` | — | Ghi chú |
| `ai_suggestion` | `TEXT` | YES | `NULL` | — | AI gợi ý tối ưu giá |
| `created_by` | `UUID` | NO | — | FK → employees(id) | Người tạo |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 4. `quotation_line_items`

Dòng sản phẩm trong báo giá.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `quotation_id` | `UUID` | NO | — | FK → quotations(id) | Thuộc báo giá nào |
| `product_id` | `UUID` | YES | `NULL` | FK → products(id) | Sản phẩm (nullable cho dòng tuỳ chỉnh) |
| `product_name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên sản phẩm (denormalized) |
| `tier_name` | `VARCHAR(100)` | YES | `NULL` | — | Tên gói giá |
| `quantity` | `NUMERIC(10,2)` | NO | `1` | CHECK > 0 | Số lượng |
| `unit_price` | `NUMERIC(15,2)` | NO | `0` | CHECK >= 0 | Đơn giá |
| `unit` | `VARCHAR(50)` | NO | `'unit'` | — | Đơn vị tính |
| `discount` | `NUMERIC(5,2)` | NO | `0` | CHECK BETWEEN 0 AND 100 | Chiết khấu (%) |
| `subtotal` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Thành tiền |
| `sort_order` | `INTEGER` | NO | `0` | — | Thứ tự dòng |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## Câu lệnh YSQL

```sql
-- ============================================================
-- PHÂN HỆ 06: SẢN PHẨM & BÁO GIÁ
-- ============================================================

-- 1. products
CREATE TABLE products (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    name                VARCHAR(255) NOT NULL,
    short_description   TEXT,
    product_type        VARCHAR(20) NOT NULL DEFAULT 'product'
                            CHECK (product_type IN ('product','service','bundle')),
    category            VARCHAR(30) NOT NULL DEFAULT 'product'
                            CHECK (category IN ('outsource','product','consulting','ai-solution','maintenance','training')),
    pricing_model       VARCHAR(20) NOT NULL DEFAULT 'fixed'
                            CHECK (pricing_model IN ('fixed','hourly','monthly','per-user','custom')),
    base_price          NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (base_price >= 0),
    currency            VARCHAR(3)  NOT NULL DEFAULT 'USD',
    deals_using         INTEGER     NOT NULL DEFAULT 0 CHECK (deals_using >= 0),
    total_revenue       NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (total_revenue >= 0),
    avg_deal_size       NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (avg_deal_size >= 0),
    win_rate            NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (win_rate BETWEEN 0 AND 100),
    status              VARCHAR(20) NOT NULL DEFAULT 'active'
                            CHECK (status IN ('active','draft','deprecated')),
    ai_tech_fit_score   SMALLINT    NOT NULL DEFAULT 0 CHECK (ai_tech_fit_score BETWEEN 0 AND 100),
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_products_tenant    ON products (tenant_id)              WHERE deleted_at IS NULL;
CREATE INDEX idx_products_category  ON products (tenant_id, category)    WHERE deleted_at IS NULL;
CREATE INDEX idx_products_type      ON products (tenant_id, product_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_status    ON products (tenant_id, status)      WHERE deleted_at IS NULL;

-- 2. pricing_tiers
CREATE TABLE pricing_tiers (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    product_id      UUID        NOT NULL REFERENCES products(id),
    name            VARCHAR(100) NOT NULL,
    price           NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (price >= 0),
    unit            VARCHAR(50) NOT NULL DEFAULT 'month',
    features        JSONB       NOT NULL DEFAULT '[]',
    is_recommended  BOOLEAN     NOT NULL DEFAULT FALSE,
    sort_order      INTEGER     NOT NULL DEFAULT 0,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_pricing_tiers_product ON pricing_tiers (tenant_id, product_id, sort_order) WHERE deleted_at IS NULL;

-- 3. quotations
CREATE TABLE quotations (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    code            VARCHAR(50) NOT NULL,
    contact_id      UUID        NOT NULL REFERENCES contacts(id),
    deal_id         UUID        REFERENCES deals(id),
    status          VARCHAR(20) NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft','sent','viewed','accepted','rejected','expired')),
    subtotal        NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
    discount_total  NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (discount_total >= 0),
    tax_rate        NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (tax_rate BETWEEN 0 AND 100),
    tax_amount      NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
    grand_total     NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (grand_total >= 0),
    currency        VARCHAR(3)  NOT NULL DEFAULT 'VND',
    valid_until     DATE        NOT NULL,
    notes           TEXT,
    ai_suggestion   TEXT,
    created_by      UUID        NOT NULL REFERENCES employees(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_quotations_code  ON quotations (tenant_id, code)     WHERE deleted_at IS NULL;
CREATE INDEX idx_quotations_tenant      ON quotations (tenant_id)           WHERE deleted_at IS NULL;
CREATE INDEX idx_quotations_status      ON quotations (tenant_id, status)   WHERE deleted_at IS NULL;
CREATE INDEX idx_quotations_contact     ON quotations (tenant_id, contact_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_quotations_deal        ON quotations (tenant_id, deal_id)  WHERE deleted_at IS NULL AND deal_id IS NOT NULL;

-- 4. quotation_line_items
CREATE TABLE quotation_line_items (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    quotation_id    UUID        NOT NULL REFERENCES quotations(id),
    product_id      UUID        REFERENCES products(id),
    product_name    VARCHAR(255) NOT NULL,
    tier_name       VARCHAR(100),
    quantity        NUMERIC(10,2) NOT NULL DEFAULT 1 CHECK (quantity > 0),
    unit_price      NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
    unit            VARCHAR(50) NOT NULL DEFAULT 'unit',
    discount        NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (discount BETWEEN 0 AND 100),
    subtotal        NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (subtotal >= 0),
    sort_order      INTEGER     NOT NULL DEFAULT 0,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_quotation_items_quotation ON quotation_line_items (tenant_id, quotation_id, sort_order) WHERE deleted_at IS NULL;
```
