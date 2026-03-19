# Phân hệ 22 — AI & Tự động hoá mở rộng

> Chatbot training, AI model management, data enrichment.

---

## 1. `chatbot_training_data`

Dữ liệu huấn luyện chatbot AI.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `intent` | `VARCHAR(200)` | NO | — | NOT BLANK | Ý định (intent) |
| `category` | `VARCHAR(100)` | YES | `NULL` | — | Phân loại |
| `training_phrases` | `JSONB` | NO | `'[]'` | — | Cụm từ huấn luyện |
| `response_templates` | `JSONB` | NO | `'[]'` | — | Mẫu phản hồi |
| `context` | `JSONB` | NO | `'{}'` | — | Ngữ cảnh |
| `confidence_threshold` | `NUMERIC(3,2)` | NO | `0.70` | CHECK BETWEEN 0 AND 1 | Ngưỡng độ tin cậy |
| `is_active` | `BOOLEAN` | NO | `TRUE` | — | Đang kích hoạt |
| `usage_count` | `INTEGER` | NO | `0` | CHECK >= 0 | Số lần sử dụng |
| `accuracy_rate` | `NUMERIC(5,2)` | NO | `0` | CHECK BETWEEN 0 AND 100 | Tỉ lệ chính xác (%) |
| `created_by` | `UUID` | YES | `NULL` | FK → employees(id) | Người tạo |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 2. `ai_models`

Mô hình AI đang triển khai (AI Training Dashboard).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên model |
| `model_type` | `VARCHAR(30)` | NO | — | CHECK IN ('lead-scoring','churn-prediction','deal-forecast','sentiment','recommendation','classification') | Loại model |
| `status` | `VARCHAR(20)` | NO | `'training'` | CHECK IN ('training','deployed','retired','failed') | Trạng thái |
| `accuracy` | `NUMERIC(5,2)` | YES | `NULL` | CHECK BETWEEN 0 AND 100 | Độ chính xác (%) |
| `precision_score` | `NUMERIC(5,2)` | YES | `NULL` | CHECK BETWEEN 0 AND 100 | Precision (%) |
| `recall_score` | `NUMERIC(5,2)` | YES | `NULL` | CHECK BETWEEN 0 AND 100 | Recall (%) |
| `training_data_size` | `INTEGER` | NO | `0` | CHECK >= 0 | Kích thước dữ liệu huấn luyện |
| `last_trained_at` | `TIMESTAMPTZ` | YES | `NULL` | — | Lần huấn luyện gần nhất |
| `deployed_at` | `TIMESTAMPTZ` | YES | `NULL` | — | Thời gian triển khai |
| `config` | `JSONB` | NO | `'{}'` | — | Cấu hình hyperparameters |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 3. `data_enrichment_jobs`

Công việc làm giàu dữ liệu (Data Enrichment).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên công việc |
| `source` | `VARCHAR(50)` | NO | — | CHECK IN ('clearbit','zoominfo','linkedin','manual','ai-generated') | Nguồn dữ liệu |
| `entity_type` | `VARCHAR(50)` | NO | `'contacts'` | — | Loại entity làm giàu |
| `status` | `VARCHAR(20)` | NO | `'pending'` | CHECK IN ('pending','running','completed','failed') | Trạng thái |
| `total_records` | `INTEGER` | NO | `0` | CHECK >= 0 | Tổng bản ghi |
| `enriched_records` | `INTEGER` | NO | `0` | CHECK >= 0 | Số đã làm giàu |
| `failed_records` | `INTEGER` | NO | `0` | CHECK >= 0 | Số thất bại |
| `fields_enriched` | `JSONB` | NO | `'[]'` | — | Trường đã làm giàu |
| `started_at` | `TIMESTAMPTZ` | YES | `NULL` | — | Thời gian bắt đầu |
| `completed_at` | `TIMESTAMPTZ` | YES | `NULL` | — | Thời gian hoàn thành |
| `triggered_by` | `UUID` | YES | `NULL` | FK → employees(id) | Người kích hoạt |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## Câu lệnh YSQL

```sql
-- ============================================================
-- PHÂN HỆ 22: AI & TỰ ĐỘNG HOÁ MỞ RỘNG
-- ============================================================

CREATE TABLE chatbot_training_data (
    id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id               UUID        NOT NULL REFERENCES tenants(id),
    intent                  VARCHAR(200) NOT NULL,
    category                VARCHAR(100),
    training_phrases        JSONB       NOT NULL DEFAULT '[]',
    response_templates      JSONB       NOT NULL DEFAULT '[]',
    context                 JSONB       NOT NULL DEFAULT '{}',
    confidence_threshold    NUMERIC(3,2) NOT NULL DEFAULT 0.70 CHECK (confidence_threshold BETWEEN 0 AND 1),
    is_active               BOOLEAN     NOT NULL DEFAULT TRUE,
    usage_count             INTEGER     NOT NULL DEFAULT 0 CHECK (usage_count >= 0),
    accuracy_rate           NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (accuracy_rate BETWEEN 0 AND 100),
    created_by              UUID        REFERENCES employees(id),
    version                 INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at              TIMESTAMPTZ
);

CREATE INDEX idx_chatbot_data_tenant ON chatbot_training_data (tenant_id)          WHERE deleted_at IS NULL;
CREATE INDEX idx_chatbot_data_intent ON chatbot_training_data (tenant_id, intent)  WHERE deleted_at IS NULL;

CREATE TABLE ai_models (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    name                VARCHAR(255) NOT NULL,
    model_type          VARCHAR(30) NOT NULL
                            CHECK (model_type IN ('lead-scoring','churn-prediction','deal-forecast','sentiment','recommendation','classification')),
    status              VARCHAR(20) NOT NULL DEFAULT 'training'
                            CHECK (status IN ('training','deployed','retired','failed')),
    accuracy            NUMERIC(5,2) CHECK (accuracy IS NULL OR accuracy BETWEEN 0 AND 100),
    precision_score     NUMERIC(5,2) CHECK (precision_score IS NULL OR precision_score BETWEEN 0 AND 100),
    recall_score        NUMERIC(5,2) CHECK (recall_score IS NULL OR recall_score BETWEEN 0 AND 100),
    training_data_size  INTEGER     NOT NULL DEFAULT 0 CHECK (training_data_size >= 0),
    last_trained_at     TIMESTAMPTZ,
    deployed_at         TIMESTAMPTZ,
    config              JSONB       NOT NULL DEFAULT '{}',
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_ai_models_tenant ON ai_models (tenant_id)              WHERE deleted_at IS NULL;
CREATE INDEX idx_ai_models_type   ON ai_models (tenant_id, model_type)  WHERE deleted_at IS NULL;
CREATE INDEX idx_ai_models_status ON ai_models (tenant_id, status)      WHERE deleted_at IS NULL;

CREATE TABLE data_enrichment_jobs (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(255) NOT NULL,
    source          VARCHAR(50) NOT NULL
                        CHECK (source IN ('clearbit','zoominfo','linkedin','manual','ai-generated')),
    entity_type     VARCHAR(50) NOT NULL DEFAULT 'contacts',
    status          VARCHAR(20) NOT NULL DEFAULT 'pending'
                        CHECK (status IN ('pending','running','completed','failed')),
    total_records   INTEGER     NOT NULL DEFAULT 0 CHECK (total_records >= 0),
    enriched_records INTEGER    NOT NULL DEFAULT 0 CHECK (enriched_records >= 0),
    failed_records  INTEGER     NOT NULL DEFAULT 0 CHECK (failed_records >= 0),
    fields_enriched JSONB       NOT NULL DEFAULT '[]',
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    triggered_by    UUID        REFERENCES employees(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_enrichment_jobs_tenant ON data_enrichment_jobs (tenant_id)          WHERE deleted_at IS NULL;
CREATE INDEX idx_enrichment_jobs_status ON data_enrichment_jobs (tenant_id, status)  WHERE deleted_at IS NULL;
```
