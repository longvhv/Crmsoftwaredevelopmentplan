# Phân hệ 12 — Phân tích & Trí tuệ (Analytics & Intelligence)

> Campaign ROI, đối thủ cạnh tranh, win/loss, phát hiện rò rỉ doanh thu.

---

## 1. `campaign_rois`

Phân tích ROI chiến dịch marketing.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên chiến dịch |
| `channel` | `VARCHAR(20)` | NO | — | CHECK IN ('email','social','sem','seo','webinar','content','referral','partner') | Kênh marketing |
| `status` | `VARCHAR(20)` | NO | `'active'` | CHECK IN ('active','completed','paused') | Trạng thái |
| `start_date` | `DATE` | NO | — | — | Ngày bắt đầu |
| `end_date` | `DATE` | YES | `NULL` | CHECK >= start_date | Ngày kết thúc |
| `budget` | `NUMERIC(15,2)` | NO | `0` | CHECK >= 0 | Ngân sách |
| `spent` | `NUMERIC(15,2)` | NO | `0` | CHECK >= 0 | Đã chi |
| `leads` | `INTEGER` | NO | `0` | CHECK >= 0 | Số lead |
| `mqls` | `INTEGER` | NO | `0` | CHECK >= 0 | Marketing Qualified Leads |
| `sqls` | `INTEGER` | NO | `0` | CHECK >= 0 | Sales Qualified Leads |
| `opportunities` | `INTEGER` | NO | `0` | CHECK >= 0 | Số cơ hội |
| `won_deals` | `INTEGER` | NO | `0` | CHECK >= 0 | Số deal thắng |
| `revenue` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Doanh thu mang lại |
| `cpl` | `NUMERIC(10,2)` | NO | `0` | CHECK >= 0 | Cost Per Lead |
| `cac` | `NUMERIC(10,2)` | NO | `0` | CHECK >= 0 | Customer Acquisition Cost |
| `roas` | `NUMERIC(8,2)` | NO | `0` | CHECK >= 0 | Return On Ad Spend |
| `conversion_rate` | `NUMERIC(5,2)` | NO | `0` | CHECK BETWEEN 0 AND 100 | Tỉ lệ chuyển đổi (%) |
| `currency` | `VARCHAR(3)` | NO | `'USD'` | ISO 4217 | Đơn vị tiền tệ |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 2. `competitors`

Hồ sơ đối thủ cạnh tranh.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(255)` | NO | — | UNIQUE per tenant, NOT BLANK | Tên đối thủ |
| `logo_url` | `TEXT` | YES | `NULL` | — | URL logo |
| `description` | `TEXT` | YES | `NULL` | — | Mô tả |
| `region` | `VARCHAR(100)` | YES | `NULL` | — | Khu vực hoạt động |
| `threat` | `VARCHAR(10)` | NO | `'medium'` | CHECK IN ('high','medium','low') | Mức đe doạ |
| `strengths` | `JSONB` | NO | `'[]'` | — | Thế mạnh |
| `weaknesses` | `JSONB` | NO | `'[]'` | — | Điểm yếu |
| `pricing` | `TEXT` | YES | `NULL` | — | Thông tin giá |
| `our_win_rate` | `NUMERIC(5,2)` | NO | `0` | CHECK BETWEEN 0 AND 100 | Tỉ lệ thắng của ta (%) |
| `total_encounters` | `INTEGER` | NO | `0` | CHECK >= 0 | Tổng lần đối đầu |
| `deals_won` | `INTEGER` | NO | `0` | CHECK >= 0 | Số deal ta thắng |
| `deals_lost` | `INTEGER` | NO | `0` | CHECK >= 0 | Số deal ta thua |
| `avg_deal_size` | `NUMERIC(15,2)` | NO | `0` | CHECK >= 0 | Kích thước deal trung bình |
| `ai_insight` | `TEXT` | YES | `NULL` | — | AI phân tích |
| `top_win_reason` | `TEXT` | YES | `NULL` | — | Lý do thắng chính |
| `top_loss_reason` | `TEXT` | YES | `NULL` | — | Lý do thua chính |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 3. `competitor_battle_cards`

Battle card chi tiết cho từng đối thủ.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `competitor_id` | `UUID` | NO | — | FK → competitors(id) | Đối thủ |
| `topic` | `VARCHAR(200)` | NO | — | NOT BLANK | Chủ đề so sánh |
| `our_strength` | `TEXT` | NO | — | — | Thế mạnh của ta |
| `their_weakness` | `TEXT` | NO | — | — | Điểm yếu của họ |
| `talking_point` | `TEXT` | NO | — | — | Điểm nói chuyện với khách |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 4. `competitor_skills`

So sánh kỹ năng/năng lực đối thủ vs ta.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `competitor_id` | `UUID` | NO | — | FK → competitors(id) | Đối thủ |
| `skill_name` | `VARCHAR(100)` | NO | — | NOT BLANK | Tên kỹ năng |
| `their_score` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Điểm của họ |
| `our_score` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Điểm của ta |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 5. `win_loss_records`

Lịch sử thắng/thua deal vs đối thủ.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `deal_id` | `UUID` | YES | `NULL` | FK → deals(id) | Deal liên quan |
| `deal_name` | `VARCHAR(300)` | NO | — | — | Tên deal |
| `client_company` | `VARCHAR(255)` | NO | — | — | Công ty khách hàng |
| `competitor_id` | `UUID` | YES | `NULL` | FK → competitors(id) | Đối thủ |
| `competitor_name` | `VARCHAR(255)` | YES | `NULL` | — | Tên đối thủ (denormalized) |
| `outcome` | `VARCHAR(10)` | NO | — | CHECK IN ('won','lost') | Kết quả |
| `value` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Giá trị deal |
| `loss_reason` | `VARCHAR(30)` | YES | `NULL` | CHECK IN ('price','competitor','no-budget','timing','feature-gap','champion-left','no-decision','internal-politics') khi outcome='lost' | Lý do thua |
| `close_date` | `DATE` | NO | — | — | Ngày đóng deal |
| `sales_cycle_days` | `INTEGER` | YES | `NULL` | CHECK >= 0 | Chu kỳ bán hàng (ngày) |
| `rep_id` | `UUID` | YES | `NULL` | FK → employees(id) | Sales phụ trách |
| `stage` | `VARCHAR(30)` | YES | `NULL` | — | Giai đoạn khi đóng |
| `ai_insight` | `TEXT` | YES | `NULL` | — | AI phân tích |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 6. `revenue_leak_items`

Phát hiện rò rỉ doanh thu bởi AI.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `leak_type` | `VARCHAR(30)` | NO | — | CHECK IN ('stale-deal','missed-followup','pricing-error','discount-abuse','churn-signal','missed-upsell','contract-gap','billing-error') | Loại rò rỉ |
| `severity` | `VARCHAR(15)` | NO | `'medium'` | CHECK IN ('critical','high','medium','low') | Mức nghiêm trọng |
| `status` | `VARCHAR(20)` | NO | `'open'` | CHECK IN ('open','investigating','resolved','dismissed') | Trạng thái |
| `title` | `VARCHAR(300)` | NO | — | NOT BLANK | Tiêu đề |
| `description` | `TEXT` | YES | `NULL` | — | Mô tả chi tiết |
| `estimated_loss` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Tổn thất ước tính |
| `deal_id` | `UUID` | YES | `NULL` | FK → deals(id) | Deal liên quan |
| `contact_id` | `UUID` | YES | `NULL` | FK → contacts(id) | Khách hàng liên quan |
| `customer_name` | `VARCHAR(255)` | YES | `NULL` | — | Tên khách hàng |
| `detected_date` | `DATE` | NO | `CURRENT_DATE` | — | Ngày phát hiện |
| `assigned_to` | `UUID` | YES | `NULL` | FK → employees(id) | Người xử lý |
| `ai_confidence` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Độ tin cậy AI |
| `suggested_action` | `TEXT` | YES | `NULL` | — | AI đề xuất hành động |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## Câu lệnh YSQL

```sql
-- ============================================================
-- PHÂN HỆ 12: PHÂN TÍCH & TRÍ TUỆ
-- ============================================================

-- 1. campaign_rois
CREATE TABLE campaign_rois (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(255) NOT NULL,
    channel         VARCHAR(20) NOT NULL
                        CHECK (channel IN ('email','social','sem','seo','webinar','content','referral','partner')),
    status          VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active','completed','paused')),
    start_date      DATE        NOT NULL,
    end_date        DATE,
    budget          NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (budget >= 0),
    spent           NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (spent >= 0),
    leads           INTEGER     NOT NULL DEFAULT 0 CHECK (leads >= 0),
    mqls            INTEGER     NOT NULL DEFAULT 0 CHECK (mqls >= 0),
    sqls            INTEGER     NOT NULL DEFAULT 0 CHECK (sqls >= 0),
    opportunities   INTEGER     NOT NULL DEFAULT 0 CHECK (opportunities >= 0),
    won_deals       INTEGER     NOT NULL DEFAULT 0 CHECK (won_deals >= 0),
    revenue         NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (revenue >= 0),
    cpl             NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (cpl >= 0),
    cac             NUMERIC(10,2) NOT NULL DEFAULT 0 CHECK (cac >= 0),
    roas            NUMERIC(8,2) NOT NULL DEFAULT 0 CHECK (roas >= 0),
    conversion_rate NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (conversion_rate BETWEEN 0 AND 100),
    currency        VARCHAR(3)  NOT NULL DEFAULT 'USD',
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_campaign_rois_tenant   ON campaign_rois (tenant_id)            WHERE deleted_at IS NULL;
CREATE INDEX idx_campaign_rois_channel  ON campaign_rois (tenant_id, channel)   WHERE deleted_at IS NULL;
CREATE INDEX idx_campaign_rois_status   ON campaign_rois (tenant_id, status)    WHERE deleted_at IS NULL;

-- 2. competitors
CREATE TABLE competitors (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(255) NOT NULL,
    logo_url        TEXT,
    description     TEXT,
    region          VARCHAR(100),
    threat          VARCHAR(10) NOT NULL DEFAULT 'medium'
                        CHECK (threat IN ('high','medium','low')),
    strengths       JSONB       NOT NULL DEFAULT '[]',
    weaknesses      JSONB       NOT NULL DEFAULT '[]',
    pricing         TEXT,
    our_win_rate    NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (our_win_rate BETWEEN 0 AND 100),
    total_encounters INTEGER    NOT NULL DEFAULT 0 CHECK (total_encounters >= 0),
    deals_won       INTEGER     NOT NULL DEFAULT 0 CHECK (deals_won >= 0),
    deals_lost      INTEGER     NOT NULL DEFAULT 0 CHECK (deals_lost >= 0),
    avg_deal_size   NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (avg_deal_size >= 0),
    ai_insight      TEXT,
    top_win_reason  TEXT,
    top_loss_reason TEXT,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_competitors_name ON competitors (tenant_id, name) WHERE deleted_at IS NULL;
CREATE INDEX idx_competitors_tenant     ON competitors (tenant_id)       WHERE deleted_at IS NULL;
CREATE INDEX idx_competitors_threat     ON competitors (tenant_id, threat) WHERE deleted_at IS NULL;

-- 3. competitor_battle_cards
CREATE TABLE competitor_battle_cards (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    competitor_id   UUID        NOT NULL REFERENCES competitors(id),
    topic           VARCHAR(200) NOT NULL,
    our_strength    TEXT        NOT NULL,
    their_weakness  TEXT        NOT NULL,
    talking_point   TEXT        NOT NULL,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_battle_cards_competitor ON competitor_battle_cards (tenant_id, competitor_id) WHERE deleted_at IS NULL;

-- 4. competitor_skills
CREATE TABLE competitor_skills (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    competitor_id   UUID        NOT NULL REFERENCES competitors(id),
    skill_name      VARCHAR(100) NOT NULL,
    their_score     SMALLINT    NOT NULL DEFAULT 0 CHECK (their_score BETWEEN 0 AND 100),
    our_score       SMALLINT    NOT NULL DEFAULT 0 CHECK (our_score BETWEEN 0 AND 100),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_competitor_skills ON competitor_skills (tenant_id, competitor_id) WHERE deleted_at IS NULL;

-- 5. win_loss_records
CREATE TABLE win_loss_records (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    deal_id         UUID        REFERENCES deals(id),
    deal_name       VARCHAR(300) NOT NULL,
    client_company  VARCHAR(255) NOT NULL,
    competitor_id   UUID        REFERENCES competitors(id),
    competitor_name VARCHAR(255),
    outcome         VARCHAR(10) NOT NULL CHECK (outcome IN ('won','lost')),
    value           NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (value >= 0),
    loss_reason     VARCHAR(30) CHECK (loss_reason IS NULL OR loss_reason IN ('price','competitor','no-budget','timing','feature-gap','champion-left','no-decision','internal-politics')),
    close_date      DATE        NOT NULL,
    sales_cycle_days INTEGER    CHECK (sales_cycle_days IS NULL OR sales_cycle_days >= 0),
    rep_id          UUID        REFERENCES employees(id),
    stage           VARCHAR(30),
    ai_insight      TEXT,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_win_loss_tenant        ON win_loss_records (tenant_id)                  WHERE deleted_at IS NULL;
CREATE INDEX idx_win_loss_outcome       ON win_loss_records (tenant_id, outcome)          WHERE deleted_at IS NULL;
CREATE INDEX idx_win_loss_competitor    ON win_loss_records (tenant_id, competitor_id)    WHERE deleted_at IS NULL AND competitor_id IS NOT NULL;
CREATE INDEX idx_win_loss_date          ON win_loss_records (tenant_id, close_date DESC)  WHERE deleted_at IS NULL;

-- 6. revenue_leak_items
CREATE TABLE revenue_leak_items (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    leak_type       VARCHAR(30) NOT NULL
                        CHECK (leak_type IN ('stale-deal','missed-followup','pricing-error','discount-abuse','churn-signal','missed-upsell','contract-gap','billing-error')),
    severity        VARCHAR(15) NOT NULL DEFAULT 'medium'
                        CHECK (severity IN ('critical','high','medium','low')),
    status          VARCHAR(20) NOT NULL DEFAULT 'open'
                        CHECK (status IN ('open','investigating','resolved','dismissed')),
    title           VARCHAR(300) NOT NULL,
    description     TEXT,
    estimated_loss  NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (estimated_loss >= 0),
    deal_id         UUID        REFERENCES deals(id),
    contact_id      UUID        REFERENCES contacts(id),
    customer_name   VARCHAR(255),
    detected_date   DATE        NOT NULL DEFAULT CURRENT_DATE,
    assigned_to     UUID        REFERENCES employees(id),
    ai_confidence   SMALLINT    NOT NULL DEFAULT 0 CHECK (ai_confidence BETWEEN 0 AND 100),
    suggested_action TEXT,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_rev_leaks_tenant   ON revenue_leak_items (tenant_id)            WHERE deleted_at IS NULL;
CREATE INDEX idx_rev_leaks_severity ON revenue_leak_items (tenant_id, severity)   WHERE deleted_at IS NULL;
CREATE INDEX idx_rev_leaks_status   ON revenue_leak_items (tenant_id, status)     WHERE deleted_at IS NULL;
CREATE INDEX idx_rev_leaks_type     ON revenue_leak_items (tenant_id, leak_type)  WHERE deleted_at IS NULL;
```
