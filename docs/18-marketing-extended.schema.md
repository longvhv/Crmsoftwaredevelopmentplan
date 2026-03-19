# Phân hệ 18 — Marketing mở rộng (Marketing Extended)

> Landing pages, marketing campaigns, content calendar, referral, A/B testing.

---

## 1. `landing_pages`

Landing page do người dùng thiết kế.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên trang |
| `slug` | `VARCHAR(200)` | NO | — | UNIQUE per tenant | Slug URL |
| `status` | `VARCHAR(20)` | NO | `'draft'` | CHECK IN ('draft','published','archived') | Trạng thái |
| `template` | `VARCHAR(50)` | YES | `NULL` | — | Mẫu sử dụng |
| `content_html` | `TEXT` | YES | `NULL` | — | Nội dung HTML |
| `meta_title` | `VARCHAR(200)` | YES | `NULL` | — | SEO title |
| `meta_description` | `VARCHAR(500)` | YES | `NULL` | — | SEO description |
| `form_id` | `UUID` | YES | `NULL` | FK → forms(id) | Biểu mẫu nhúng |
| `views` | `INTEGER` | NO | `0` | CHECK >= 0 | Lượt xem |
| `conversions` | `INTEGER` | NO | `0` | CHECK >= 0 | Lượt chuyển đổi |
| `conversion_rate` | `NUMERIC(5,2)` | NO | `0` | CHECK BETWEEN 0 AND 100 | Tỉ lệ chuyển đổi (%) |
| `published_at` | `TIMESTAMPTZ` | YES | `NULL` | — | Thời gian publish |
| `created_by` | `UUID` | YES | `NULL` | FK → employees(id) | Người tạo |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 2. `marketing_campaigns`

Chiến dịch marketing tổng hợp (khác campaign_rois ở mức quản lý vận hành).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên chiến dịch |
| `description` | `TEXT` | YES | `NULL` | — | Mô tả |
| `campaign_type` | `VARCHAR(30)` | NO | `'email'` | CHECK IN ('email','social','event','content','multi-channel','paid-ads') | Loại chiến dịch |
| `status` | `VARCHAR(20)` | NO | `'draft'` | CHECK IN ('draft','scheduled','active','paused','completed','cancelled') | Trạng thái |
| `budget` | `NUMERIC(15,2)` | NO | `0` | CHECK >= 0 | Ngân sách |
| `spent` | `NUMERIC(15,2)` | NO | `0` | CHECK >= 0 | Đã chi |
| `currency` | `VARCHAR(3)` | NO | `'USD'` | — | Đơn vị tiền tệ |
| `start_date` | `DATE` | YES | `NULL` | — | Ngày bắt đầu |
| `end_date` | `DATE` | YES | `NULL` | — | Ngày kết thúc |
| `target_audience` | `JSONB` | NO | `'{}'` | — | Đối tượng mục tiêu |
| `goals` | `JSONB` | NO | `'{}'` | — | Mục tiêu chiến dịch |
| `metrics` | `JSONB` | NO | `'{}'` | — | Chỉ số (impressions, clicks, …) |
| `owner_id` | `UUID` | YES | `NULL` | FK → employees(id) | Người phụ trách |
| `campaign_roi_id` | `UUID` | YES | `NULL` | FK → campaign_rois(id) | Liên kết ROI analysis |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 3. `content_calendar_items`

Nội dung lên lịch đăng (Content Calendar).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `title` | `VARCHAR(300)` | NO | — | NOT BLANK | Tiêu đề nội dung |
| `content_type` | `VARCHAR(30)` | NO | `'blog'` | CHECK IN ('blog','social','email','video','webinar','whitepaper','case-study','infographic') | Loại nội dung |
| `status` | `VARCHAR(20)` | NO | `'idea'` | CHECK IN ('idea','planned','in-progress','review','published','archived') | Trạng thái |
| `channel` | `VARCHAR(30)` | YES | `NULL` | — | Kênh phân phối |
| `scheduled_date` | `DATE` | YES | `NULL` | — | Ngày lên lịch |
| `published_date` | `DATE` | YES | `NULL` | — | Ngày đăng thực tế |
| `author_id` | `UUID` | YES | `NULL` | FK → employees(id) | Tác giả |
| `campaign_id` | `UUID` | YES | `NULL` | FK → marketing_campaigns(id) | Chiến dịch liên quan |
| `description` | `TEXT` | YES | `NULL` | — | Mô tả / brief |
| `url` | `TEXT` | YES | `NULL` | — | URL nội dung |
| `metrics` | `JSONB` | NO | `'{}'` | — | Chỉ số (views, shares, …) |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 4. `referral_programs`

Chương trình giới thiệu khách hàng.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên chương trình |
| `description` | `TEXT` | YES | `NULL` | — | Mô tả |
| `status` | `VARCHAR(20)` | NO | `'active'` | CHECK IN ('active','paused','ended') | Trạng thái |
| `reward_type` | `VARCHAR(20)` | NO | `'cash'` | CHECK IN ('cash','credit','discount','gift') | Loại thưởng |
| `reward_value` | `NUMERIC(15,2)` | NO | `0` | CHECK >= 0 | Giá trị thưởng |
| `reward_currency` | `VARCHAR(3)` | NO | `'USD'` | — | Đơn vị tiền |
| `total_referrals` | `INTEGER` | NO | `0` | CHECK >= 0 | Tổng lượt giới thiệu |
| `successful_referrals` | `INTEGER` | NO | `0` | CHECK >= 0 | Lượt thành công |
| `total_revenue_generated` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Doanh thu tạo ra |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 5. `referrals`

Lượt giới thiệu cụ thể.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `program_id` | `UUID` | NO | — | FK → referral_programs(id) | Chương trình |
| `referrer_contact_id` | `UUID` | YES | `NULL` | FK → contacts(id) | Người giới thiệu |
| `referrer_name` | `VARCHAR(255)` | NO | — | — | Tên người giới thiệu |
| `referred_name` | `VARCHAR(255)` | NO | — | — | Tên người được giới thiệu |
| `referred_email` | `VARCHAR(320)` | NO | — | — | Email người được giới thiệu |
| `referred_company` | `VARCHAR(255)` | YES | `NULL` | — | Công ty |
| `status` | `VARCHAR(20)` | NO | `'pending'` | CHECK IN ('pending','contacted','qualified','converted','rejected') | Trạng thái |
| `lead_id` | `UUID` | YES | `NULL` | FK → leads(id) | Lead tạo ra |
| `deal_id` | `UUID` | YES | `NULL` | FK → deals(id) | Deal tạo ra |
| `reward_paid` | `BOOLEAN` | NO | `FALSE` | — | Đã trả thưởng |
| `reward_amount` | `NUMERIC(15,2)` | NO | `0` | CHECK >= 0 | Số tiền thưởng |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 6. `ab_tests`

A/B Testing cho email, landing page, …

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên test |
| `test_type` | `VARCHAR(30)` | NO | `'email'` | CHECK IN ('email-subject','email-body','landing-page','cta','pricing','form') | Loại test |
| `status` | `VARCHAR(20)` | NO | `'draft'` | CHECK IN ('draft','running','completed','cancelled') | Trạng thái |
| `hypothesis` | `TEXT` | YES | `NULL` | — | Giả thuyết |
| `metric` | `VARCHAR(50)` | NO | `'open_rate'` | — | Chỉ số đo lường chính |
| `traffic_split` | `JSONB` | NO | `'[50,50]'` | — | Phân chia traffic (%) |
| `sample_size` | `INTEGER` | NO | `0` | CHECK >= 0 | Kích thước mẫu |
| `confidence_level` | `NUMERIC(5,2)` | YES | `NULL` | CHECK BETWEEN 0 AND 100 | Độ tin cậy thống kê (%) |
| `winner_variant_id` | `UUID` | YES | `NULL` | — | Biến thể thắng |
| `start_date` | `DATE` | YES | `NULL` | — | Ngày bắt đầu |
| `end_date` | `DATE` | YES | `NULL` | — | Ngày kết thúc |
| `created_by` | `UUID` | YES | `NULL` | FK → employees(id) | Người tạo |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 7. `ab_test_variants`

Biến thể trong A/B test.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `test_id` | `UUID` | NO | — | FK → ab_tests(id) | A/B test |
| `variant_name` | `VARCHAR(50)` | NO | — | NOT BLANK (A, B, C, …) | Tên biến thể |
| `content` | `JSONB` | NO | `'{}'` | — | Nội dung biến thể |
| `impressions` | `INTEGER` | NO | `0` | CHECK >= 0 | Lượt hiển thị |
| `conversions` | `INTEGER` | NO | `0` | CHECK >= 0 | Lượt chuyển đổi |
| `conversion_rate` | `NUMERIC(5,2)` | NO | `0` | CHECK BETWEEN 0 AND 100 | Tỉ lệ chuyển đổi (%) |
| `is_control` | `BOOLEAN` | NO | `FALSE` | — | Biến thể kiểm soát |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## Câu lệnh YSQL

```sql
-- ============================================================
-- PHÂN HỆ 18: MARKETING MỞ RỘNG
-- ============================================================

CREATE TABLE landing_pages (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(200) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft','published','archived')),
    template        VARCHAR(50),
    content_html    TEXT,
    meta_title      VARCHAR(200),
    meta_description VARCHAR(500),
    form_id         UUID        REFERENCES forms(id),
    views           INTEGER     NOT NULL DEFAULT 0 CHECK (views >= 0),
    conversions     INTEGER     NOT NULL DEFAULT 0 CHECK (conversions >= 0),
    conversion_rate NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (conversion_rate BETWEEN 0 AND 100),
    published_at    TIMESTAMPTZ,
    created_by      UUID        REFERENCES employees(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_landing_pages_slug ON landing_pages (tenant_id, slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_landing_pages_tenant     ON landing_pages (tenant_id)        WHERE deleted_at IS NULL;

CREATE TABLE marketing_campaigns (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(255) NOT NULL,
    description     TEXT,
    campaign_type   VARCHAR(30) NOT NULL DEFAULT 'email'
                        CHECK (campaign_type IN ('email','social','event','content','multi-channel','paid-ads')),
    status          VARCHAR(20) NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft','scheduled','active','paused','completed','cancelled')),
    budget          NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (budget >= 0),
    spent           NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (spent >= 0),
    currency        VARCHAR(3)  NOT NULL DEFAULT 'USD',
    start_date      DATE,
    end_date        DATE,
    target_audience JSONB       NOT NULL DEFAULT '{}',
    goals           JSONB       NOT NULL DEFAULT '{}',
    metrics         JSONB       NOT NULL DEFAULT '{}',
    owner_id        UUID        REFERENCES employees(id),
    campaign_roi_id UUID        REFERENCES campaign_rois(id),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_mkt_campaigns_tenant ON marketing_campaigns (tenant_id)          WHERE deleted_at IS NULL;
CREATE INDEX idx_mkt_campaigns_status ON marketing_campaigns (tenant_id, status)  WHERE deleted_at IS NULL;

CREATE TABLE content_calendar_items (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    title           VARCHAR(300) NOT NULL,
    content_type    VARCHAR(30) NOT NULL DEFAULT 'blog'
                        CHECK (content_type IN ('blog','social','email','video','webinar','whitepaper','case-study','infographic')),
    status          VARCHAR(20) NOT NULL DEFAULT 'idea'
                        CHECK (status IN ('idea','planned','in-progress','review','published','archived')),
    channel         VARCHAR(30),
    scheduled_date  DATE,
    published_date  DATE,
    author_id       UUID        REFERENCES employees(id),
    campaign_id     UUID        REFERENCES marketing_campaigns(id),
    description     TEXT,
    url             TEXT,
    metrics         JSONB       NOT NULL DEFAULT '{}',
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_content_cal_tenant ON content_calendar_items (tenant_id)                WHERE deleted_at IS NULL;
CREATE INDEX idx_content_cal_date   ON content_calendar_items (tenant_id, scheduled_date) WHERE deleted_at IS NULL;

CREATE TABLE referral_programs (
    id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id               UUID        NOT NULL REFERENCES tenants(id),
    name                    VARCHAR(255) NOT NULL,
    description             TEXT,
    status                  VARCHAR(20) NOT NULL DEFAULT 'active'
                                CHECK (status IN ('active','paused','ended')),
    reward_type             VARCHAR(20) NOT NULL DEFAULT 'cash'
                                CHECK (reward_type IN ('cash','credit','discount','gift')),
    reward_value            NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (reward_value >= 0),
    reward_currency         VARCHAR(3)  NOT NULL DEFAULT 'USD',
    total_referrals         INTEGER     NOT NULL DEFAULT 0 CHECK (total_referrals >= 0),
    successful_referrals    INTEGER     NOT NULL DEFAULT 0 CHECK (successful_referrals >= 0),
    total_revenue_generated NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (total_revenue_generated >= 0),
    version                 INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at              TIMESTAMPTZ
);

CREATE INDEX idx_referral_programs_tenant ON referral_programs (tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE referrals (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    program_id          UUID        NOT NULL REFERENCES referral_programs(id),
    referrer_contact_id UUID        REFERENCES contacts(id),
    referrer_name       VARCHAR(255) NOT NULL,
    referred_name       VARCHAR(255) NOT NULL,
    referred_email      VARCHAR(320) NOT NULL,
    referred_company    VARCHAR(255),
    status              VARCHAR(20) NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending','contacted','qualified','converted','rejected')),
    lead_id             UUID        REFERENCES leads(id),
    deal_id             UUID        REFERENCES deals(id),
    reward_paid         BOOLEAN     NOT NULL DEFAULT FALSE,
    reward_amount       NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (reward_amount >= 0),
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_referrals_program ON referrals (tenant_id, program_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_referrals_status  ON referrals (tenant_id, status)     WHERE deleted_at IS NULL;

CREATE TABLE ab_tests (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    name                VARCHAR(255) NOT NULL,
    test_type           VARCHAR(30) NOT NULL DEFAULT 'email-subject'
                            CHECK (test_type IN ('email-subject','email-body','landing-page','cta','pricing','form')),
    status              VARCHAR(20) NOT NULL DEFAULT 'draft'
                            CHECK (status IN ('draft','running','completed','cancelled')),
    hypothesis          TEXT,
    metric              VARCHAR(50) NOT NULL DEFAULT 'open_rate',
    traffic_split       JSONB       NOT NULL DEFAULT '[50,50]',
    sample_size         INTEGER     NOT NULL DEFAULT 0 CHECK (sample_size >= 0),
    confidence_level    NUMERIC(5,2) CHECK (confidence_level IS NULL OR confidence_level BETWEEN 0 AND 100),
    winner_variant_id   UUID,
    start_date          DATE,
    end_date            DATE,
    created_by          UUID        REFERENCES employees(id),
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_ab_tests_tenant ON ab_tests (tenant_id)          WHERE deleted_at IS NULL;
CREATE INDEX idx_ab_tests_status ON ab_tests (tenant_id, status)  WHERE deleted_at IS NULL;

CREATE TABLE ab_test_variants (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    test_id         UUID        NOT NULL REFERENCES ab_tests(id),
    variant_name    VARCHAR(50) NOT NULL,
    content         JSONB       NOT NULL DEFAULT '{}',
    impressions     INTEGER     NOT NULL DEFAULT 0 CHECK (impressions >= 0),
    conversions     INTEGER     NOT NULL DEFAULT 0 CHECK (conversions >= 0),
    conversion_rate NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (conversion_rate BETWEEN 0 AND 100),
    is_control      BOOLEAN     NOT NULL DEFAULT FALSE,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_ab_variants_test ON ab_test_variants (tenant_id, test_id) WHERE deleted_at IS NULL;
```
