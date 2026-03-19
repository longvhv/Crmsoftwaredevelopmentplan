# Phân hệ 20 — Trí tuệ khách hàng (Customer Intelligence)

> Phân khúc khách hàng, hành trình khách hàng, kế hoạch tài khoản, Deal Room.

---

## 1. `customer_segments`

Phân khúc khách hàng.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(200)` | NO | — | UNIQUE per tenant, NOT BLANK | Tên phân khúc |
| `description` | `TEXT` | YES | `NULL` | — | Mô tả |
| `segment_type` | `VARCHAR(20)` | NO | `'dynamic'` | CHECK IN ('dynamic','static') | Loại: tự động / tĩnh |
| `rules` | `JSONB` | NO | `'[]'` | — | Quy tắc phân khúc |
| `contact_count` | `INTEGER` | NO | `0` | CHECK >= 0 | Số contact thuộc phân khúc |
| `avg_deal_value` | `NUMERIC(15,2)` | NO | `0` | CHECK >= 0 | Giá trị deal trung bình |
| `total_revenue` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Tổng doanh thu |
| `color` | `VARCHAR(30)` | YES | `NULL` | — | Màu hiển thị |
| `is_active` | `BOOLEAN` | NO | `TRUE` | — | Đang kích hoạt |
| `last_computed_at` | `TIMESTAMPTZ` | YES | `NULL` | — | Lần tính toán cuối |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 2. `customer_journeys`

Hành trình khách hàng (Customer Journey).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên hành trình |
| `description` | `TEXT` | YES | `NULL` | — | Mô tả |
| `status` | `VARCHAR(20)` | NO | `'active'` | CHECK IN ('draft','active','archived') | Trạng thái |
| `stages` | `JSONB` | NO | `'[]'` | — | Các giai đoạn [{id,name,description,order}] |
| `total_contacts` | `INTEGER` | NO | `0` | CHECK >= 0 | Tổng contact đang trong journey |
| `avg_completion_days` | `NUMERIC(8,1)` | YES | `NULL` | CHECK >= 0 | Số ngày hoàn thành trung bình |
| `conversion_rate` | `NUMERIC(5,2)` | NO | `0` | CHECK BETWEEN 0 AND 100 | Tỉ lệ chuyển đổi (%) |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 3. `journey_touchpoints`

Điểm chạm trong hành trình khách hàng.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `journey_id` | `UUID` | NO | — | FK → customer_journeys(id) | Hành trình |
| `contact_id` | `UUID` | NO | — | FK → contacts(id) | Khách hàng |
| `stage_id` | `VARCHAR(100)` | NO | — | NOT BLANK | ID giai đoạn (tham chiếu stages JSONB) |
| `touchpoint_type` | `VARCHAR(30)` | NO | — | CHECK IN ('email','call','meeting','website','ad','social','form','purchase','support') | Loại điểm chạm |
| `channel` | `VARCHAR(50)` | YES | `NULL` | — | Kênh |
| `description` | `TEXT` | YES | `NULL` | — | Mô tả |
| `sentiment` | `VARCHAR(15)` | YES | `NULL` | CHECK IN ('positive','neutral','negative') | Cảm xúc |
| `occurred_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời điểm xảy ra |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 4. `account_plans`

Kế hoạch tài khoản trọng điểm (Account Planning).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `contact_id` | `UUID` | NO | — | FK → contacts(id) | Tài khoản khách hàng |
| `account_name` | `VARCHAR(255)` | NO | — | — | Tên tài khoản (denormalized) |
| `owner_id` | `UUID` | YES | `NULL` | FK → employees(id) | Người phụ trách |
| `status` | `VARCHAR(20)` | NO | `'active'` | CHECK IN ('draft','active','review','archived') | Trạng thái |
| `objectives` | `JSONB` | NO | `'[]'` | — | Mục tiêu [{title,progress,dueDate}] |
| `stakeholders` | `JSONB` | NO | `'[]'` | — | Stakeholder map |
| `opportunities` | `JSONB` | NO | `'[]'` | — | Cơ hội upsell/cross-sell |
| `risks` | `JSONB` | NO | `'[]'` | — | Rủi ro |
| `current_arr` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | ARR hiện tại |
| `target_arr` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | ARR mục tiêu |
| `health_score` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Điểm sức khoẻ |
| `next_review_date` | `DATE` | YES | `NULL` | — | Ngày review tiếp |
| `ai_recommendations` | `JSONB` | NO | `'[]'` | — | AI đề xuất hành động |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 5. `deal_rooms`

Phòng deal ảo (Deal Room) — không gian cộng tác với khách hàng.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `deal_id` | `UUID` | NO | — | FK → deals(id), UNIQUE per tenant | Deal liên kết |
| `name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên phòng |
| `status` | `VARCHAR(20)` | NO | `'active'` | CHECK IN ('active','closed','archived') | Trạng thái |
| `access_code` | `VARCHAR(50)` | YES | `NULL` | UNIQUE khi NOT NULL | Mã truy cập cho khách |
| `participants` | `JSONB` | NO | `'[]'` | — | Thành viên [{userId,role,name}] |
| `milestones` | `JSONB` | NO | `'[]'` | — | Mốc tiến trình [{title,status,dueDate}] |
| `mutual_action_plan` | `JSONB` | NO | `'[]'` | — | Kế hoạch hành động chung |
| `last_activity_at` | `TIMESTAMPTZ` | YES | `NULL` | — | Hoạt động gần nhất |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 6. `deal_room_documents`

Tài liệu trong Deal Room.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `deal_room_id` | `UUID` | NO | — | FK → deal_rooms(id) | Phòng deal |
| `document_id` | `UUID` | YES | `NULL` | FK → documents(id) | Tài liệu từ hệ thống |
| `name` | `VARCHAR(300)` | NO | — | NOT BLANK | Tên file |
| `file_url` | `TEXT` | YES | `NULL` | — | URL file |
| `uploaded_by` | `UUID` | YES | `NULL` | FK → employees(id) | Người tải lên |
| `viewed_by_client` | `BOOLEAN` | NO | `FALSE` | — | Khách đã xem |
| `viewed_at` | `TIMESTAMPTZ` | YES | `NULL` | — | Thời gian khách xem |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## Câu lệnh YSQL

```sql
-- ============================================================
-- PHÂN HỆ 20: TRÍ TUỆ KHÁCH HÀNG
-- ============================================================

CREATE TABLE customer_segments (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    segment_type    VARCHAR(20) NOT NULL DEFAULT 'dynamic'
                        CHECK (segment_type IN ('dynamic','static')),
    rules           JSONB       NOT NULL DEFAULT '[]',
    contact_count   INTEGER     NOT NULL DEFAULT 0 CHECK (contact_count >= 0),
    avg_deal_value  NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (avg_deal_value >= 0),
    total_revenue   NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (total_revenue >= 0),
    color           VARCHAR(30),
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    last_computed_at TIMESTAMPTZ,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_segments_name ON customer_segments (tenant_id, name) WHERE deleted_at IS NULL;
CREATE INDEX idx_segments_tenant     ON customer_segments (tenant_id)       WHERE deleted_at IS NULL;

CREATE TABLE customer_journeys (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    name                VARCHAR(255) NOT NULL,
    description         TEXT,
    status              VARCHAR(20) NOT NULL DEFAULT 'active'
                            CHECK (status IN ('draft','active','archived')),
    stages              JSONB       NOT NULL DEFAULT '[]',
    total_contacts      INTEGER     NOT NULL DEFAULT 0 CHECK (total_contacts >= 0),
    avg_completion_days NUMERIC(8,1) CHECK (avg_completion_days IS NULL OR avg_completion_days >= 0),
    conversion_rate     NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (conversion_rate BETWEEN 0 AND 100),
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_journeys_tenant ON customer_journeys (tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE journey_touchpoints (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    journey_id      UUID        NOT NULL REFERENCES customer_journeys(id),
    contact_id      UUID        NOT NULL REFERENCES contacts(id),
    stage_id        VARCHAR(100) NOT NULL,
    touchpoint_type VARCHAR(30) NOT NULL
                        CHECK (touchpoint_type IN ('email','call','meeting','website','ad','social','form','purchase','support')),
    channel         VARCHAR(50),
    description     TEXT,
    sentiment       VARCHAR(15) CHECK (sentiment IS NULL OR sentiment IN ('positive','neutral','negative')),
    occurred_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_touchpoints_journey ON journey_touchpoints (tenant_id, journey_id)  WHERE deleted_at IS NULL;
CREATE INDEX idx_touchpoints_contact ON journey_touchpoints (tenant_id, contact_id)  WHERE deleted_at IS NULL;

CREATE TABLE account_plans (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    contact_id          UUID        NOT NULL REFERENCES contacts(id),
    account_name        VARCHAR(255) NOT NULL,
    owner_id            UUID        REFERENCES employees(id),
    status              VARCHAR(20) NOT NULL DEFAULT 'active'
                            CHECK (status IN ('draft','active','review','archived')),
    objectives          JSONB       NOT NULL DEFAULT '[]',
    stakeholders        JSONB       NOT NULL DEFAULT '[]',
    opportunities       JSONB       NOT NULL DEFAULT '[]',
    risks               JSONB       NOT NULL DEFAULT '[]',
    current_arr         NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (current_arr >= 0),
    target_arr          NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (target_arr >= 0),
    health_score        SMALLINT    NOT NULL DEFAULT 0 CHECK (health_score BETWEEN 0 AND 100),
    next_review_date    DATE,
    ai_recommendations  JSONB       NOT NULL DEFAULT '[]',
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_account_plans_tenant  ON account_plans (tenant_id)              WHERE deleted_at IS NULL;
CREATE INDEX idx_account_plans_contact ON account_plans (tenant_id, contact_id)  WHERE deleted_at IS NULL;
CREATE INDEX idx_account_plans_owner   ON account_plans (tenant_id, owner_id)    WHERE deleted_at IS NULL;

CREATE TABLE deal_rooms (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    deal_id         UUID        NOT NULL REFERENCES deals(id),
    name            VARCHAR(255) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'active'
                        CHECK (status IN ('active','closed','archived')),
    access_code     VARCHAR(50),
    participants    JSONB       NOT NULL DEFAULT '[]',
    milestones      JSONB       NOT NULL DEFAULT '[]',
    mutual_action_plan JSONB    NOT NULL DEFAULT '[]',
    last_activity_at TIMESTAMPTZ,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_deal_rooms_deal ON deal_rooms (tenant_id, deal_id) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX uk_deal_rooms_code ON deal_rooms (access_code) WHERE deleted_at IS NULL AND access_code IS NOT NULL;

CREATE TABLE deal_room_documents (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    deal_room_id    UUID        NOT NULL REFERENCES deal_rooms(id),
    document_id     UUID        REFERENCES documents(id),
    name            VARCHAR(300) NOT NULL,
    file_url        TEXT,
    uploaded_by     UUID        REFERENCES employees(id),
    viewed_by_client BOOLEAN    NOT NULL DEFAULT FALSE,
    viewed_at       TIMESTAMPTZ,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_deal_room_docs ON deal_room_documents (tenant_id, deal_room_id) WHERE deleted_at IS NULL;
```
