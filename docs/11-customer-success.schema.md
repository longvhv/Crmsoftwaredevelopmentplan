# Phân hệ 11 — Customer Success

> Sức khoẻ khách hàng, NPS tracking, dự đoán churn, pipeline gia hạn.

---

## 1. `customer_healths`

Chỉ số sức khoẻ tổng hợp của khách hàng.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `contact_id` | `UUID` | NO | — | FK → contacts(id), UNIQUE per tenant | Khách hàng (1-1) |
| `company_name` | `VARCHAR(255)` | NO | — | — | Tên công ty (denormalized) |
| `logo_url` | `TEXT` | YES | `NULL` | — | URL logo |
| `industry` | `VARCHAR(100)` | YES | `NULL` | — | Ngành |
| `health_score` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Điểm sức khoẻ tổng |
| `health_level` | `VARCHAR(15)` | NO | `'good'` | CHECK IN ('excellent','good','at-risk','critical') | Cấp độ sức khoẻ |
| `churn_risk` | `VARCHAR(15)` | NO | `'low'` | CHECK IN ('low','medium','high','very-high') | Mức rủi ro rời bỏ |
| `churn_probability` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Xác suất rời bỏ (%) |
| `mrr` | `NUMERIC(15,2)` | NO | `0` | CHECK >= 0 | Monthly Recurring Revenue |
| `mrr_trend` | `VARCHAR(10)` | NO | `'stable'` | CHECK IN ('up','down','stable') | Xu hướng MRR |
| `lifetime_value` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Giá trị trọn đời |
| `contract_end_date` | `DATE` | YES | `NULL` | — | Ngày hết hạn hợp đồng |
| `last_activity_at` | `TIMESTAMPTZ` | YES | `NULL` | — | Hoạt động gần nhất |
| `days_since_contact` | `INTEGER` | NO | `0` | CHECK >= 0 | Số ngày từ lần liên hệ cuối |
| `login_frequency` | `NUMERIC(5,1)` | NO | `0` | CHECK >= 0 | Tần suất đăng nhập (lần/tuần) |
| `feature_adoption` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Tỉ lệ sử dụng tính năng (%) |
| `ticket_count` | `INTEGER` | NO | `0` | CHECK >= 0 | Số ticket đang mở |
| `nps_score` | `SMALLINT` | YES | `NULL` | CHECK BETWEEN -100 AND 100 | Điểm NPS mới nhất |
| `risk_factors` | `JSONB` | NO | `'[]'` | — | Các yếu tố rủi ro |
| `retention_actions` | `JSONB` | NO | `'[]'` | — | Hành động giữ chân đề xuất |
| `ai_insight` | `TEXT` | YES | `NULL` | — | AI phân tích |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 2. `health_metrics`

Chỉ số chi tiết sức khoẻ (con của customer_healths).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `customer_health_id` | `UUID` | NO | — | FK → customer_healths(id) | Khách hàng |
| `name` | `VARCHAR(100)` | NO | — | NOT BLANK | Tên chỉ số (Engagement, Usage, …) |
| `score` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Điểm |
| `trend` | `VARCHAR(10)` | NO | `'stable'` | CHECK IN ('up','down','stable') | Xu hướng |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 3. `health_score_trends`

Lịch sử điểm sức khoẻ theo tháng (time-series).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `customer_health_id` | `UUID` | NO | — | FK → customer_healths(id) | Khách hàng |
| `month` | `VARCHAR(7)` | NO | — | Format 'YYYY-MM' | Tháng |
| `score` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Điểm sức khoẻ |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

> **UNIQUE:** `(tenant_id, customer_health_id, month)` WHERE `deleted_at IS NULL`

---

## 4. `nps_feedbacks`

Phản hồi NPS từ khách hàng.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `contact_id` | `UUID` | YES | `NULL` | FK → contacts(id) | Khách hàng (nếu có) |
| `client_name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên người phản hồi |
| `client_company` | `VARCHAR(255)` | YES | `NULL` | — | Công ty |
| `score` | `SMALLINT` | NO | — | CHECK BETWEEN 0 AND 10 | Điểm NPS (0-10) |
| `category` | `VARCHAR(15)` | NO | — | CHECK IN ('promoter','passive','detractor'), auto từ score | Phân loại NPS |
| `channel` | `VARCHAR(20)` | NO | `'email'` | CHECK IN ('email','in-app','survey','call','meeting') | Kênh thu thập |
| `comment` | `TEXT` | YES | `NULL` | — | Nội dung phản hồi |
| `feedback_date` | `DATE` | NO | `CURRENT_DATE` | — | Ngày phản hồi |
| `sentiment` | `VARCHAR(15)` | NO | `'neutral'` | CHECK IN ('positive','neutral','negative') | Sentiment analysis |
| `responded` | `BOOLEAN` | NO | `FALSE` | — | Đã phản hồi lại chưa |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 5. `client_nps_snapshots`

Tổng hợp NPS theo khách hàng (materialized/cached).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `contact_id` | `UUID` | NO | — | FK → contacts(id), UNIQUE per tenant | Khách hàng |
| `client_company` | `VARCHAR(255)` | NO | — | — | Tên công ty |
| `client_name` | `VARCHAR(255)` | NO | — | — | Tên người liên hệ |
| `current_nps` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 10 | Điểm NPS hiện tại |
| `previous_nps` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 10 | Điểm NPS kỳ trước |
| `trend` | `VARCHAR(10)` | NO | `'stable'` | CHECK IN ('up','down','stable') | Xu hướng |
| `response_count` | `INTEGER` | NO | `0` | CHECK >= 0 | Tổng số phản hồi |
| `avg_score` | `NUMERIC(4,2)` | NO | `0` | CHECK BETWEEN 0 AND 10 | Điểm trung bình |
| `last_feedback_at` | `TIMESTAMPTZ` | YES | `NULL` | — | Phản hồi gần nhất |
| `top_concern` | `TEXT` | YES | `NULL` | — | Mối quan tâm hàng đầu |
| `top_praise` | `TEXT` | YES | `NULL` | — | Lời khen hàng đầu |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 6. `churn_risk_accounts`

Tài khoản có rủi ro rời bỏ (AI-detected).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `contact_id` | `UUID` | NO | — | FK → contacts(id) | Khách hàng |
| `customer_name` | `VARCHAR(255)` | NO | — | — | Tên khách hàng |
| `arr` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Annual Recurring Revenue |
| `churn_probability` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Xác suất churn (%) |
| `risk_level` | `VARCHAR(15)` | NO | `'medium'` | CHECK IN ('critical','high','medium','low') | Mức rủi ro |
| `health_score` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Điểm sức khoẻ |
| `health_trend` | `VARCHAR(15)` | NO | `'stable'` | CHECK IN ('declining','stable','improving') | Xu hướng sức khoẻ |
| `days_to_renewal` | `INTEGER` | NO | `0` | — | Số ngày đến hạn gia hạn |
| `signals` | `JSONB` | NO | `'[]'` | — | Tín hiệu rủi ro |
| `intervention_status` | `VARCHAR(20)` | NO | `'none'` | CHECK IN ('none','planned','in-progress','completed') | Trạng thái can thiệp |
| `intervention_note` | `TEXT` | YES | `NULL` | — | Ghi chú can thiệp |
| `csm_id` | `UUID` | YES | `NULL` | FK → employees(id) | Customer Success Manager |
| `last_contact_at` | `TIMESTAMPTZ` | YES | `NULL` | — | Lần liên hệ gần nhất |
| `usage_change` | `NUMERIC(5,1)` | NO | `0` | — | Thay đổi mức sử dụng (%) |
| `nps` | `SMALLINT` | YES | `NULL` | CHECK BETWEEN -100 AND 100 | Điểm NPS |
| `tickets_open` | `INTEGER` | NO | `0` | CHECK >= 0 | Số ticket đang mở |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 7. `renewals`

Pipeline gia hạn hợp đồng.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `contact_id` | `UUID` | NO | — | FK → contacts(id) | Khách hàng |
| `contract_id` | `UUID` | YES | `NULL` | FK → contracts(id) | Hợp đồng gốc |
| `customer_name` | `VARCHAR(255)` | NO | — | — | Tên khách hàng |
| `logo_url` | `TEXT` | YES | `NULL` | — | Logo |
| `plan` | `VARCHAR(100)` | YES | `NULL` | — | Gói hiện tại |
| `arr` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | ARR |
| `contract_end_date` | `DATE` | NO | — | — | Ngày hết hạn |
| `days_until_renewal` | `INTEGER` | NO | `0` | — | Số ngày còn lại |
| `status` | `VARCHAR(20)` | NO | `'upcoming'` | CHECK IN ('upcoming','in-progress','committed','at-risk','churned','renewed') | Trạng thái |
| `health_score` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Điểm sức khoẻ |
| `nps` | `SMALLINT` | YES | `NULL` | CHECK BETWEEN -100 AND 100 | NPS |
| `expansion_opportunity` | `NUMERIC(18,2)` | YES | `NULL` | CHECK >= 0 | Cơ hội mở rộng |
| `csm_id` | `UUID` | YES | `NULL` | FK → employees(id) | CSM phụ trách |
| `last_contact_at` | `TIMESTAMPTZ` | YES | `NULL` | — | Lần liên hệ cuối |
| `risk_factors` | `JSONB` | NO | `'[]'` | — | Yếu tố rủi ro |
| `renewal_probability` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Xác suất gia hạn (%) |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## Câu lệnh YSQL

```sql
-- ============================================================
-- PHÂN HỆ 11: CUSTOMER SUCCESS
-- ============================================================

-- 1. customer_healths
CREATE TABLE customer_healths (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    contact_id          UUID        NOT NULL REFERENCES contacts(id),
    company_name        VARCHAR(255) NOT NULL,
    logo_url            TEXT,
    industry            VARCHAR(100),
    health_score        SMALLINT    NOT NULL DEFAULT 0 CHECK (health_score BETWEEN 0 AND 100),
    health_level        VARCHAR(15) NOT NULL DEFAULT 'good'
                            CHECK (health_level IN ('excellent','good','at-risk','critical')),
    churn_risk          VARCHAR(15) NOT NULL DEFAULT 'low'
                            CHECK (churn_risk IN ('low','medium','high','very-high')),
    churn_probability   SMALLINT    NOT NULL DEFAULT 0 CHECK (churn_probability BETWEEN 0 AND 100),
    mrr                 NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (mrr >= 0),
    mrr_trend           VARCHAR(10) NOT NULL DEFAULT 'stable'
                            CHECK (mrr_trend IN ('up','down','stable')),
    lifetime_value      NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (lifetime_value >= 0),
    contract_end_date   DATE,
    last_activity_at    TIMESTAMPTZ,
    days_since_contact  INTEGER     NOT NULL DEFAULT 0 CHECK (days_since_contact >= 0),
    login_frequency     NUMERIC(5,1) NOT NULL DEFAULT 0 CHECK (login_frequency >= 0),
    feature_adoption    SMALLINT    NOT NULL DEFAULT 0 CHECK (feature_adoption BETWEEN 0 AND 100),
    ticket_count        INTEGER     NOT NULL DEFAULT 0 CHECK (ticket_count >= 0),
    nps_score           SMALLINT    CHECK (nps_score IS NULL OR nps_score BETWEEN -100 AND 100),
    risk_factors        JSONB       NOT NULL DEFAULT '[]',
    retention_actions   JSONB       NOT NULL DEFAULT '[]',
    ai_insight          TEXT,
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_customer_healths_contact ON customer_healths (tenant_id, contact_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_customer_healths_level         ON customer_healths (tenant_id, health_level)  WHERE deleted_at IS NULL;
CREATE INDEX idx_customer_healths_churn         ON customer_healths (tenant_id, churn_risk)    WHERE deleted_at IS NULL;
CREATE INDEX idx_customer_healths_score         ON customer_healths (tenant_id, health_score)  WHERE deleted_at IS NULL;

-- 2. health_metrics
CREATE TABLE health_metrics (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    customer_health_id  UUID        NOT NULL REFERENCES customer_healths(id),
    name                VARCHAR(100) NOT NULL,
    score               SMALLINT    NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
    trend               VARCHAR(10) NOT NULL DEFAULT 'stable'
                            CHECK (trend IN ('up','down','stable')),
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_health_metrics ON health_metrics (tenant_id, customer_health_id) WHERE deleted_at IS NULL;

-- 3. health_score_trends
CREATE TABLE health_score_trends (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    customer_health_id  UUID        NOT NULL REFERENCES customer_healths(id),
    month               VARCHAR(7)  NOT NULL,
    score               SMALLINT    NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_health_trends ON health_score_trends (tenant_id, customer_health_id, month) WHERE deleted_at IS NULL;

-- 4. nps_feedbacks
CREATE TABLE nps_feedbacks (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    contact_id      UUID        REFERENCES contacts(id),
    client_name     VARCHAR(255) NOT NULL,
    client_company  VARCHAR(255),
    score           SMALLINT    NOT NULL CHECK (score BETWEEN 0 AND 10),
    category        VARCHAR(15) NOT NULL
                        CHECK (category IN ('promoter','passive','detractor')),
    channel         VARCHAR(20) NOT NULL DEFAULT 'email'
                        CHECK (channel IN ('email','in-app','survey','call','meeting')),
    comment         TEXT,
    feedback_date   DATE        NOT NULL DEFAULT CURRENT_DATE,
    sentiment       VARCHAR(15) NOT NULL DEFAULT 'neutral'
                        CHECK (sentiment IN ('positive','neutral','negative')),
    responded       BOOLEAN     NOT NULL DEFAULT FALSE,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_nps_feedbacks_tenant   ON nps_feedbacks (tenant_id)               WHERE deleted_at IS NULL;
CREATE INDEX idx_nps_feedbacks_category ON nps_feedbacks (tenant_id, category)      WHERE deleted_at IS NULL;
CREATE INDEX idx_nps_feedbacks_contact  ON nps_feedbacks (tenant_id, contact_id)    WHERE deleted_at IS NULL AND contact_id IS NOT NULL;
CREATE INDEX idx_nps_feedbacks_date     ON nps_feedbacks (tenant_id, feedback_date DESC) WHERE deleted_at IS NULL;

-- 5. client_nps_snapshots
CREATE TABLE client_nps_snapshots (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    contact_id      UUID        NOT NULL REFERENCES contacts(id),
    client_company  VARCHAR(255) NOT NULL,
    client_name     VARCHAR(255) NOT NULL,
    current_nps     SMALLINT    NOT NULL DEFAULT 0 CHECK (current_nps BETWEEN 0 AND 10),
    previous_nps    SMALLINT    NOT NULL DEFAULT 0 CHECK (previous_nps BETWEEN 0 AND 10),
    trend           VARCHAR(10) NOT NULL DEFAULT 'stable'
                        CHECK (trend IN ('up','down','stable')),
    response_count  INTEGER     NOT NULL DEFAULT 0 CHECK (response_count >= 0),
    avg_score       NUMERIC(4,2) NOT NULL DEFAULT 0 CHECK (avg_score BETWEEN 0 AND 10),
    last_feedback_at TIMESTAMPTZ,
    top_concern     TEXT,
    top_praise      TEXT,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_client_nps ON client_nps_snapshots (tenant_id, contact_id) WHERE deleted_at IS NULL;

-- 6. churn_risk_accounts
CREATE TABLE churn_risk_accounts (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    contact_id          UUID        NOT NULL REFERENCES contacts(id),
    customer_name       VARCHAR(255) NOT NULL,
    arr                 NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (arr >= 0),
    churn_probability   SMALLINT    NOT NULL DEFAULT 0 CHECK (churn_probability BETWEEN 0 AND 100),
    risk_level          VARCHAR(15) NOT NULL DEFAULT 'medium'
                            CHECK (risk_level IN ('critical','high','medium','low')),
    health_score        SMALLINT    NOT NULL DEFAULT 0 CHECK (health_score BETWEEN 0 AND 100),
    health_trend        VARCHAR(15) NOT NULL DEFAULT 'stable'
                            CHECK (health_trend IN ('declining','stable','improving')),
    days_to_renewal     INTEGER     NOT NULL DEFAULT 0,
    signals             JSONB       NOT NULL DEFAULT '[]',
    intervention_status VARCHAR(20) NOT NULL DEFAULT 'none'
                            CHECK (intervention_status IN ('none','planned','in-progress','completed')),
    intervention_note   TEXT,
    csm_id              UUID        REFERENCES employees(id),
    last_contact_at     TIMESTAMPTZ,
    usage_change        NUMERIC(5,1) NOT NULL DEFAULT 0,
    nps                 SMALLINT    CHECK (nps IS NULL OR nps BETWEEN -100 AND 100),
    tickets_open        INTEGER     NOT NULL DEFAULT 0 CHECK (tickets_open >= 0),
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_churn_risk_tenant  ON churn_risk_accounts (tenant_id)              WHERE deleted_at IS NULL;
CREATE INDEX idx_churn_risk_level   ON churn_risk_accounts (tenant_id, risk_level)   WHERE deleted_at IS NULL;
CREATE INDEX idx_churn_risk_contact ON churn_risk_accounts (tenant_id, contact_id)   WHERE deleted_at IS NULL;

-- 7. renewals
CREATE TABLE renewals (
    id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id               UUID        NOT NULL REFERENCES tenants(id),
    contact_id              UUID        NOT NULL REFERENCES contacts(id),
    contract_id             UUID        REFERENCES contracts(id),
    customer_name           VARCHAR(255) NOT NULL,
    logo_url                TEXT,
    plan                    VARCHAR(100),
    arr                     NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (arr >= 0),
    contract_end_date       DATE        NOT NULL,
    days_until_renewal      INTEGER     NOT NULL DEFAULT 0,
    status                  VARCHAR(20) NOT NULL DEFAULT 'upcoming'
                                CHECK (status IN ('upcoming','in-progress','committed','at-risk','churned','renewed')),
    health_score            SMALLINT    NOT NULL DEFAULT 0 CHECK (health_score BETWEEN 0 AND 100),
    nps                     SMALLINT    CHECK (nps IS NULL OR nps BETWEEN -100 AND 100),
    expansion_opportunity   NUMERIC(18,2) CHECK (expansion_opportunity IS NULL OR expansion_opportunity >= 0),
    csm_id                  UUID        REFERENCES employees(id),
    last_contact_at         TIMESTAMPTZ,
    risk_factors            JSONB       NOT NULL DEFAULT '[]',
    renewal_probability     SMALLINT    NOT NULL DEFAULT 0 CHECK (renewal_probability BETWEEN 0 AND 100),
    version                 INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at              TIMESTAMPTZ
);

CREATE INDEX idx_renewals_tenant    ON renewals (tenant_id)              WHERE deleted_at IS NULL;
CREATE INDEX idx_renewals_status    ON renewals (tenant_id, status)      WHERE deleted_at IS NULL;
CREATE INDEX idx_renewals_end_date  ON renewals (tenant_id, contract_end_date) WHERE deleted_at IS NULL;
CREATE INDEX idx_renewals_contact   ON renewals (tenant_id, contact_id)  WHERE deleted_at IS NULL;
```
