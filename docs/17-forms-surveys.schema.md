# Phân hệ 17 — Biểu mẫu & Khảo sát (Forms & Surveys)

> Form builder, survey builder, thu thập dữ liệu từ khách hàng.

---

## 1. `forms`

Biểu mẫu do người dùng thiết kế (Form Builder).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên biểu mẫu |
| `description` | `TEXT` | YES | `NULL` | — | Mô tả |
| `status` | `VARCHAR(20)` | NO | `'draft'` | CHECK IN ('draft','published','archived') | Trạng thái |
| `form_type` | `VARCHAR(30)` | NO | `'contact'` | CHECK IN ('contact','lead-capture','feedback','registration','support','custom') | Loại biểu mẫu |
| `slug` | `VARCHAR(200)` | NO | — | UNIQUE per tenant | Slug URL |
| `submit_button_text` | `VARCHAR(100)` | NO | `'Gửi'` | — | Nhãn nút gửi |
| `success_message` | `TEXT` | YES | `NULL` | — | Thông báo sau khi gửi |
| `redirect_url` | `TEXT` | YES | `NULL` | — | URL chuyển hướng sau gửi |
| `notification_emails` | `JSONB` | NO | `'[]'` | — | Email nhận thông báo khi có submission |
| `submission_count` | `INTEGER` | NO | `0` | CHECK >= 0 | Tổng lượt gửi |
| `conversion_rate` | `NUMERIC(5,2)` | NO | `0` | CHECK BETWEEN 0 AND 100 | Tỉ lệ chuyển đổi (%) |
| `created_by` | `UUID` | YES | `NULL` | FK → employees(id) | Người tạo |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 2. `form_fields`

Trường dữ liệu trong biểu mẫu.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `form_id` | `UUID` | NO | — | FK → forms(id) | Thuộc biểu mẫu nào |
| `field_key` | `VARCHAR(100)` | NO | — | NOT BLANK | Khoá trường |
| `field_label` | `VARCHAR(200)` | NO | — | NOT BLANK | Nhãn hiển thị |
| `field_type` | `VARCHAR(30)` | NO | `'text'` | CHECK IN ('text','textarea','number','email','phone','date','select','multi-select','checkbox','radio','file','hidden') | Kiểu trường |
| `placeholder` | `VARCHAR(200)` | YES | `NULL` | — | Placeholder |
| `options` | `JSONB` | YES | `NULL` | — | Tuỳ chọn cho select/radio/checkbox |
| `validations` | `JSONB` | NO | `'{}'` | — | Quy tắc validate {required, minLength, maxLength, pattern, …} |
| `is_required` | `BOOLEAN` | NO | `FALSE` | — | Bắt buộc |
| `sort_order` | `INTEGER` | NO | `0` | — | Thứ tự hiển thị |
| `width` | `VARCHAR(10)` | NO | `'full'` | CHECK IN ('full','half','third') | Chiều rộng cột |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 3. `form_submissions`

Dữ liệu gửi từ biểu mẫu.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `form_id` | `UUID` | NO | — | FK → forms(id) | Biểu mẫu |
| `data` | `JSONB` | NO | `'{}'` | — | Dữ liệu gửi {field_key: value} |
| `submitter_ip` | `INET` | YES | `NULL` | — | IP người gửi |
| `submitter_user_agent` | `TEXT` | YES | `NULL` | — | Trình duyệt |
| `lead_id` | `UUID` | YES | `NULL` | FK → leads(id) | Lead tạo từ submission |
| `contact_id` | `UUID` | YES | `NULL` | FK → contacts(id) | Contact liên kết |
| `is_spam` | `BOOLEAN` | NO | `FALSE` | — | Spam flag |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian gửi |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 4. `surveys`

Khảo sát (Survey Builder).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên khảo sát |
| `description` | `TEXT` | YES | `NULL` | — | Mô tả |
| `status` | `VARCHAR(20)` | NO | `'draft'` | CHECK IN ('draft','active','closed','archived') | Trạng thái |
| `survey_type` | `VARCHAR(20)` | NO | `'nps'` | CHECK IN ('nps','csat','ces','custom') | Loại khảo sát |
| `target_audience` | `VARCHAR(50)` | YES | `NULL` | — | Đối tượng (customers, leads, all) |
| `response_count` | `INTEGER` | NO | `0` | CHECK >= 0 | Số phản hồi |
| `avg_score` | `NUMERIC(4,2)` | YES | `NULL` | — | Điểm trung bình |
| `start_date` | `DATE` | YES | `NULL` | — | Ngày bắt đầu |
| `end_date` | `DATE` | YES | `NULL` | — | Ngày kết thúc |
| `created_by` | `UUID` | YES | `NULL` | FK → employees(id) | Người tạo |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 5. `survey_questions`

Câu hỏi trong khảo sát.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `survey_id` | `UUID` | NO | — | FK → surveys(id) | Khảo sát |
| `question_text` | `TEXT` | NO | — | NOT BLANK | Nội dung câu hỏi |
| `question_type` | `VARCHAR(20)` | NO | `'rating'` | CHECK IN ('rating','text','single-choice','multi-choice','scale','yes-no') | Kiểu câu hỏi |
| `options` | `JSONB` | YES | `NULL` | — | Tuỳ chọn trả lời |
| `is_required` | `BOOLEAN` | NO | `TRUE` | — | Bắt buộc |
| `sort_order` | `INTEGER` | NO | `0` | — | Thứ tự |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 6. `survey_responses`

Phản hồi khảo sát.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `survey_id` | `UUID` | NO | — | FK → surveys(id) | Khảo sát |
| `contact_id` | `UUID` | YES | `NULL` | FK → contacts(id) | Người phản hồi (nếu biết) |
| `respondent_name` | `VARCHAR(255)` | YES | `NULL` | — | Tên người phản hồi |
| `respondent_email` | `VARCHAR(320)` | YES | `NULL` | — | Email |
| `answers` | `JSONB` | NO | `'{}'` | — | Câu trả lời {question_id: answer} |
| `overall_score` | `NUMERIC(4,2)` | YES | `NULL` | — | Điểm tổng (nếu có) |
| `completed` | `BOOLEAN` | NO | `TRUE` | — | Hoàn thành hay bỏ dở |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian phản hồi |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## Câu lệnh YSQL

```sql
-- ============================================================
-- PHÂN HỆ 17: BIỂU MẪU & KHẢO SÁT
-- ============================================================

-- 1. forms
CREATE TABLE forms (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    name                VARCHAR(255) NOT NULL,
    description         TEXT,
    status              VARCHAR(20) NOT NULL DEFAULT 'draft'
                            CHECK (status IN ('draft','published','archived')),
    form_type           VARCHAR(30) NOT NULL DEFAULT 'contact'
                            CHECK (form_type IN ('contact','lead-capture','feedback','registration','support','custom')),
    slug                VARCHAR(200) NOT NULL,
    submit_button_text  VARCHAR(100) NOT NULL DEFAULT 'Gửi',
    success_message     TEXT,
    redirect_url        TEXT,
    notification_emails JSONB       NOT NULL DEFAULT '[]',
    submission_count    INTEGER     NOT NULL DEFAULT 0 CHECK (submission_count >= 0),
    conversion_rate     NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (conversion_rate BETWEEN 0 AND 100),
    created_by          UUID        REFERENCES employees(id),
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_forms_slug   ON forms (tenant_id, slug)   WHERE deleted_at IS NULL;
CREATE INDEX idx_forms_tenant       ON forms (tenant_id)         WHERE deleted_at IS NULL;
CREATE INDEX idx_forms_status       ON forms (tenant_id, status) WHERE deleted_at IS NULL;

-- 2. form_fields
CREATE TABLE form_fields (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    form_id         UUID        NOT NULL REFERENCES forms(id),
    field_key       VARCHAR(100) NOT NULL,
    field_label     VARCHAR(200) NOT NULL,
    field_type      VARCHAR(30) NOT NULL DEFAULT 'text'
                        CHECK (field_type IN ('text','textarea','number','email','phone','date','select','multi-select','checkbox','radio','file','hidden')),
    placeholder     VARCHAR(200),
    options         JSONB,
    validations     JSONB       NOT NULL DEFAULT '{}',
    is_required     BOOLEAN     NOT NULL DEFAULT FALSE,
    sort_order      INTEGER     NOT NULL DEFAULT 0,
    width           VARCHAR(10) NOT NULL DEFAULT 'full'
                        CHECK (width IN ('full','half','third')),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_form_fields ON form_fields (tenant_id, form_id, sort_order) WHERE deleted_at IS NULL;

-- 3. form_submissions
CREATE TABLE form_submissions (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    form_id             UUID        NOT NULL REFERENCES forms(id),
    data                JSONB       NOT NULL DEFAULT '{}',
    submitter_ip        INET,
    submitter_user_agent TEXT,
    lead_id             UUID        REFERENCES leads(id),
    contact_id          UUID        REFERENCES contacts(id),
    is_spam             BOOLEAN     NOT NULL DEFAULT FALSE,
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_form_submissions_form      ON form_submissions (tenant_id, form_id)     WHERE deleted_at IS NULL;
CREATE INDEX idx_form_submissions_created    ON form_submissions (tenant_id, created_at DESC) WHERE deleted_at IS NULL;

-- 4. surveys
CREATE TABLE surveys (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft','active','closed','archived')),
    survey_type     VARCHAR(20) NOT NULL DEFAULT 'nps'
                        CHECK (survey_type IN ('nps','csat','ces','custom')),
    target_audience VARCHAR(50),
    response_count  INTEGER     NOT NULL DEFAULT 0 CHECK (response_count >= 0),
    avg_score       NUMERIC(4,2),
    start_date      DATE,
    end_date        DATE,
    created_by      UUID        REFERENCES employees(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_surveys_tenant ON surveys (tenant_id)          WHERE deleted_at IS NULL;
CREATE INDEX idx_surveys_status ON surveys (tenant_id, status)  WHERE deleted_at IS NULL;

-- 5. survey_questions
CREATE TABLE survey_questions (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    survey_id       UUID        NOT NULL REFERENCES surveys(id),
    question_text   TEXT        NOT NULL,
    question_type   VARCHAR(20) NOT NULL DEFAULT 'rating'
                        CHECK (question_type IN ('rating','text','single-choice','multi-choice','scale','yes-no')),
    options         JSONB,
    is_required     BOOLEAN     NOT NULL DEFAULT TRUE,
    sort_order      INTEGER     NOT NULL DEFAULT 0,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_survey_questions ON survey_questions (tenant_id, survey_id, sort_order) WHERE deleted_at IS NULL;

-- 6. survey_responses
CREATE TABLE survey_responses (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    survey_id       UUID        NOT NULL REFERENCES surveys(id),
    contact_id      UUID        REFERENCES contacts(id),
    respondent_name VARCHAR(255),
    respondent_email VARCHAR(320),
    answers         JSONB       NOT NULL DEFAULT '{}',
    overall_score   NUMERIC(4,2),
    completed       BOOLEAN     NOT NULL DEFAULT TRUE,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_survey_responses_survey    ON survey_responses (tenant_id, survey_id)   WHERE deleted_at IS NULL;
CREATE INDEX idx_survey_responses_contact   ON survey_responses (tenant_id, contact_id)  WHERE deleted_at IS NULL AND contact_id IS NOT NULL;
```
