# Phân hệ 07 — Hợp đồng (Contracts)

> Quản lý hợp đồng khách hàng, phụ lục sửa đổi, AI dự đoán gia hạn.

---

## 1. `contracts`

Hợp đồng với khách hàng.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `code` | `VARCHAR(50)` | NO | — | UNIQUE per tenant | Mã hợp đồng (CT-2026-001) |
| `contact_id` | `UUID` | NO | — | FK → contacts(id) | Khách hàng liên quan |
| `deal_id` | `UUID` | YES | `NULL` | FK → deals(id) | Deal gốc (nếu có) |
| `contract_type` | `VARCHAR(30)` | NO | `'outsource'` | CHECK IN ('outsource','product-license','consulting','managed-service','training') | Loại hợp đồng |
| `status` | `VARCHAR(20)` | NO | `'pending'` | CHECK IN ('active','expiring-soon','expired','pending','terminated','renewed') | Trạng thái |
| `start_date` | `DATE` | NO | — | — | Ngày bắt đầu |
| `end_date` | `DATE` | NO | — | CHECK end_date >= start_date | Ngày kết thúc |
| `total_value` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Tổng giá trị hợp đồng |
| `monthly_value` | `NUMERIC(15,2)` | NO | `0` | CHECK >= 0 | Giá trị hàng tháng |
| `currency` | `VARCHAR(3)` | NO | `'VND'` | ISO 4217 | Đơn vị tiền tệ |
| `auto_renew` | `BOOLEAN` | NO | `FALSE` | — | Tự động gia hạn |
| `payment_terms` | `VARCHAR(100)` | YES | `NULL` | — | Điều khoản thanh toán |
| `owner_id` | `UUID` | YES | `NULL` | FK → employees(id) | Người phụ trách |
| `ai_renewal_probability` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | AI dự đoán xác suất gia hạn |
| `ai_renewal_note` | `TEXT` | YES | `NULL` | — | AI ghi chú gia hạn |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 2. `contract_amendments`

Phụ lục / sửa đổi hợp đồng.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `contract_id` | `UUID` | NO | — | FK → contracts(id) | Hợp đồng gốc |
| `amendment_date` | `DATE` | NO | — | — | Ngày phụ lục |
| `amendment_type` | `VARCHAR(20)` | NO | — | CHECK IN ('scope-change','price-change','extension','team-change') | Loại sửa đổi |
| `description` | `TEXT` | NO | — | NOT BLANK | Nội dung sửa đổi |
| `approved_by` | `UUID` | YES | `NULL` | FK → employees(id) | Người phê duyệt |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## Câu lệnh YSQL

```sql
-- ============================================================
-- PHÂN HỆ 07: HỢP ĐỒNG
-- ============================================================

-- 1. contracts
CREATE TABLE contracts (
    id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id               UUID        NOT NULL REFERENCES tenants(id),
    code                    VARCHAR(50) NOT NULL,
    contact_id              UUID        NOT NULL REFERENCES contacts(id),
    deal_id                 UUID        REFERENCES deals(id),
    contract_type           VARCHAR(30) NOT NULL DEFAULT 'outsource'
                                CHECK (contract_type IN ('outsource','product-license','consulting','managed-service','training')),
    status                  VARCHAR(20) NOT NULL DEFAULT 'pending'
                                CHECK (status IN ('active','expiring-soon','expired','pending','terminated','renewed')),
    start_date              DATE        NOT NULL,
    end_date                DATE        NOT NULL,
    total_value             NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (total_value >= 0),
    monthly_value           NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (monthly_value >= 0),
    currency                VARCHAR(3)  NOT NULL DEFAULT 'VND',
    auto_renew              BOOLEAN     NOT NULL DEFAULT FALSE,
    payment_terms           VARCHAR(100),
    owner_id                UUID        REFERENCES employees(id),
    ai_renewal_probability  SMALLINT    NOT NULL DEFAULT 0 CHECK (ai_renewal_probability BETWEEN 0 AND 100),
    ai_renewal_note         TEXT,
    version                 INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at              TIMESTAMPTZ,
    CONSTRAINT chk_contracts_dates CHECK (end_date >= start_date)
);

CREATE UNIQUE INDEX uk_contracts_code   ON contracts (tenant_id, code)           WHERE deleted_at IS NULL;
CREATE INDEX idx_contracts_tenant       ON contracts (tenant_id)                 WHERE deleted_at IS NULL;
CREATE INDEX idx_contracts_status       ON contracts (tenant_id, status)         WHERE deleted_at IS NULL;
CREATE INDEX idx_contracts_contact      ON contracts (tenant_id, contact_id)     WHERE deleted_at IS NULL;
CREATE INDEX idx_contracts_end_date     ON contracts (tenant_id, end_date)       WHERE deleted_at IS NULL;
CREATE INDEX idx_contracts_type         ON contracts (tenant_id, contract_type)  WHERE deleted_at IS NULL;

-- 2. contract_amendments
CREATE TABLE contract_amendments (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    contract_id     UUID        NOT NULL REFERENCES contracts(id),
    amendment_date  DATE        NOT NULL,
    amendment_type  VARCHAR(20) NOT NULL
                        CHECK (amendment_type IN ('scope-change','price-change','extension','team-change')),
    description     TEXT        NOT NULL,
    approved_by     UUID        REFERENCES employees(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_amendments_contract ON contract_amendments (tenant_id, contract_id) WHERE deleted_at IS NULL;
```
