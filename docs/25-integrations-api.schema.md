# Phân hệ 25 — Tích hợp & API (Integrations & API)

> Tích hợp bên ngoài, API keys, theo dõi sử dụng API.

---

## 1. `integrations`

Tích hợp hệ thống bên ngoài (Integration Hub).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(200)` | NO | — | NOT BLANK | Tên tích hợp |
| `provider` | `VARCHAR(100)` | NO | — | NOT BLANK | Nhà cung cấp (slack, google, salesforce, …) |
| `category` | `VARCHAR(30)` | NO | `'other'` | CHECK IN ('crm','communication','analytics','storage','payment','calendar','social','other') | Danh mục |
| `status` | `VARCHAR(20)` | NO | `'disconnected'` | CHECK IN ('connected','disconnected','error','pending') | Trạng thái |
| `config` | `JSONB` | NO | `'{}'` | — | Cấu hình (encrypted credentials ref) |
| `scopes` | `JSONB` | NO | `'[]'` | — | Quyền truy cập |
| `last_sync_at` | `TIMESTAMPTZ` | YES | `NULL` | — | Lần đồng bộ cuối |
| `sync_frequency` | `VARCHAR(20)` | YES | `NULL` | CHECK IN ('realtime','hourly','daily','weekly','manual') | Tần suất đồng bộ |
| `error_message` | `TEXT` | YES | `NULL` | — | Thông báo lỗi cuối |
| `connected_by` | `UUID` | YES | `NULL` | FK → employees(id) | Người kết nối |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 2. `api_keys`

API key cho Dev Portal.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(200)` | NO | — | NOT BLANK | Tên key |
| `key_hash` | `VARCHAR(255)` | NO | — | UNIQUE | Hash của API key |
| `key_prefix` | `VARCHAR(10)` | NO | — | — | Prefix hiển thị (vd: 'sk_live_…') |
| `scopes` | `JSONB` | NO | `'[]'` | — | Quyền ['read:contacts','write:deals',…] |
| `status` | `VARCHAR(20)` | NO | `'active'` | CHECK IN ('active','revoked','expired') | Trạng thái |
| `expires_at` | `TIMESTAMPTZ` | YES | `NULL` | — | Ngày hết hạn |
| `last_used_at` | `TIMESTAMPTZ` | YES | `NULL` | — | Lần sử dụng cuối |
| `request_count` | `BIGINT` | NO | `0` | CHECK >= 0 | Tổng request |
| `rate_limit` | `INTEGER` | NO | `1000` | CHECK > 0 | Rate limit (req/phút) |
| `created_by` | `UUID` | YES | `NULL` | FK → employees(id) | Người tạo |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 3. `api_usage_logs`

Log sử dụng API (cho monitoring & billing).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `api_key_id` | `UUID` | NO | — | FK → api_keys(id) | API key |
| `endpoint` | `VARCHAR(500)` | NO | — | NOT BLANK | Endpoint gọi |
| `method` | `VARCHAR(10)` | NO | — | CHECK IN ('GET','POST','PUT','PATCH','DELETE') | HTTP method |
| `status_code` | `SMALLINT` | NO | — | — | HTTP status code |
| `response_time_ms` | `INTEGER` | YES | `NULL` | CHECK >= 0 | Thời gian phản hồi (ms) |
| `ip_address` | `INET` | YES | `NULL` | — | IP gọi |
| `request_size` | `INTEGER` | YES | `NULL` | CHECK >= 0 | Kích thước request (bytes) |
| `response_size` | `INTEGER` | YES | `NULL` | CHECK >= 0 | Kích thước response (bytes) |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian gọi |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## Câu lệnh YSQL

```sql
-- ============================================================
-- PHÂN HỆ 25: TÍCH HỢP & API
-- ============================================================

CREATE TABLE integrations (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(200) NOT NULL,
    provider        VARCHAR(100) NOT NULL,
    category        VARCHAR(30) NOT NULL DEFAULT 'other'
                        CHECK (category IN ('crm','communication','analytics','storage','payment','calendar','social','other')),
    status          VARCHAR(20) NOT NULL DEFAULT 'disconnected'
                        CHECK (status IN ('connected','disconnected','error','pending')),
    config          JSONB       NOT NULL DEFAULT '{}',
    scopes          JSONB       NOT NULL DEFAULT '[]',
    last_sync_at    TIMESTAMPTZ,
    sync_frequency  VARCHAR(20) CHECK (sync_frequency IS NULL OR sync_frequency IN ('realtime','hourly','daily','weekly','manual')),
    error_message   TEXT,
    connected_by    UUID        REFERENCES employees(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_integrations_tenant    ON integrations (tenant_id)              WHERE deleted_at IS NULL;
CREATE INDEX idx_integrations_status    ON integrations (tenant_id, status)      WHERE deleted_at IS NULL;
CREATE INDEX idx_integrations_provider  ON integrations (tenant_id, provider)    WHERE deleted_at IS NULL;

CREATE TABLE api_keys (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(200) NOT NULL,
    key_hash        VARCHAR(255) NOT NULL,
    key_prefix      VARCHAR(10) NOT NULL,
    scopes          JSONB       NOT NULL DEFAULT '[]',
    status          VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active','revoked','expired')),
    expires_at      TIMESTAMPTZ,
    last_used_at    TIMESTAMPTZ,
    request_count   BIGINT      NOT NULL DEFAULT 0 CHECK (request_count >= 0),
    rate_limit      INTEGER     NOT NULL DEFAULT 1000 CHECK (rate_limit > 0),
    created_by      UUID        REFERENCES employees(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_api_keys_hash ON api_keys (key_hash) WHERE deleted_at IS NULL;
CREATE INDEX idx_api_keys_tenant     ON api_keys (tenant_id)         WHERE deleted_at IS NULL;
CREATE INDEX idx_api_keys_status     ON api_keys (tenant_id, status) WHERE deleted_at IS NULL;

CREATE TABLE api_usage_logs (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    api_key_id      UUID        NOT NULL REFERENCES api_keys(id),
    endpoint        VARCHAR(500) NOT NULL,
    method          VARCHAR(10) NOT NULL CHECK (method IN ('GET','POST','PUT','PATCH','DELETE')),
    status_code     SMALLINT    NOT NULL,
    response_time_ms INTEGER    CHECK (response_time_ms IS NULL OR response_time_ms >= 0),
    ip_address      INET,
    request_size    INTEGER     CHECK (request_size IS NULL OR request_size >= 0),
    response_size   INTEGER     CHECK (response_size IS NULL OR response_size >= 0),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_api_usage_tenant   ON api_usage_logs (tenant_id)                   WHERE deleted_at IS NULL;
CREATE INDEX idx_api_usage_key      ON api_usage_logs (tenant_id, api_key_id)       WHERE deleted_at IS NULL;
CREATE INDEX idx_api_usage_date     ON api_usage_logs (tenant_id, created_at DESC)  WHERE deleted_at IS NULL;
```
