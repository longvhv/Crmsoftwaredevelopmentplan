# Phân hệ 15 — Kho, Sự kiện & Năng lực nhân sự

> Quản lý kho (license, hardware), sự kiện CRM, năng lực & phân bổ nhân sự.

---

## 1. `inventory_items`

Sản phẩm trong kho (license, hardware, subscription, consumable).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên sản phẩm |
| `sku` | `VARCHAR(50)` | NO | — | UNIQUE per tenant | Mã SKU |
| `item_type` | `VARCHAR(20)` | NO | `'license'` | CHECK IN ('license','hardware','subscription','consumable') | Loại |
| `category` | `VARCHAR(100)` | YES | `NULL` | — | Danh mục |
| `current_stock` | `INTEGER` | NO | `0` | CHECK >= 0 | Tồn kho hiện tại |
| `min_stock` | `INTEGER` | NO | `0` | CHECK >= 0 | Tồn kho tối thiểu |
| `max_stock` | `INTEGER` | NO | `0` | CHECK >= 0 | Tồn kho tối đa |
| `reserved_stock` | `INTEGER` | NO | `0` | CHECK >= 0 | Đã đặt trước |
| `unit_price` | `NUMERIC(15,2)` | NO | `0` | CHECK >= 0 | Đơn giá |
| `total_value` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Giá trị tổng |
| `status` | `VARCHAR(20)` | NO | `'in-stock'` | CHECK IN ('in-stock','low-stock','out-of-stock','overstock') | Trạng thái |
| `location` | `VARCHAR(200)` | YES | `NULL` | — | Vị trí kho |
| `supplier` | `VARCHAR(255)` | YES | `NULL` | — | Nhà cung cấp |
| `last_restocked_at` | `TIMESTAMPTZ` | YES | `NULL` | — | Lần nhập kho gần nhất |
| `monthly_usage` | `INTEGER` | NO | `0` | CHECK >= 0 | Sử dụng hàng tháng |
| `days_until_stockout` | `INTEGER` | YES | `NULL` | CHECK >= 0 | Số ngày trước khi hết hàng |
| `auto_reorder` | `BOOLEAN` | NO | `FALSE` | — | Tự động đặt lại |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 2. `crm_events`

Sự kiện CRM (webinar, workshop, conference, …).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(300)` | NO | — | NOT BLANK | Tên sự kiện |
| `event_type` | `VARCHAR(20)` | NO | `'webinar'` | CHECK IN ('webinar','workshop','conference','meetup','demo-day') | Loại sự kiện |
| `status` | `VARCHAR(20)` | NO | `'upcoming'` | CHECK IN ('upcoming','live','completed','cancelled') | Trạng thái |
| `event_date` | `DATE` | NO | — | — | Ngày diễn ra |
| `event_time` | `TIMETZ` | YES | `NULL` | — | Giờ diễn ra |
| `duration` | `VARCHAR(50)` | YES | `NULL` | — | Thời lượng (vd: '2 giờ') |
| `location` | `VARCHAR(500)` | YES | `NULL` | — | Địa điểm / Link |
| `is_virtual` | `BOOLEAN` | NO | `FALSE` | — | Sự kiện online |
| `registered` | `INTEGER` | NO | `0` | CHECK >= 0 | Số đăng ký |
| `attended` | `INTEGER` | NO | `0` | CHECK >= 0 | Số tham dự |
| `capacity` | `INTEGER` | NO | `0` | CHECK >= 0 | Sức chứa |
| `leads_generated` | `INTEGER` | NO | `0` | CHECK >= 0 | Lead tạo ra |
| `pipeline_influenced` | `NUMERIC(18,2)` | NO | `0` | CHECK >= 0 | Pipeline bị ảnh hưởng |
| `roi` | `NUMERIC(8,2)` | NO | `0` | — | ROI (%) |
| `speakers` | `JSONB` | NO | `'[]'` | — | Danh sách diễn giả |
| `description` | `TEXT` | YES | `NULL` | — | Mô tả |
| `follow_up_sent` | `BOOLEAN` | NO | `FALSE` | — | Đã gửi follow-up |
| `engagement_score` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Điểm tương tác |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 3. `team_members`

Năng lực & phân bổ nhân sự (Team Capacity).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `employee_id` | `UUID` | NO | — | FK → employees(id), UNIQUE per tenant | Nhân viên |
| `role` | `VARCHAR(100)` | YES | `NULL` | — | Vai trò (denormalized) |
| `department` | `VARCHAR(100)` | YES | `NULL` | — | Phòng ban (denormalized) |
| `member_type` | `VARCHAR(15)` | NO | `'human'` | CHECK IN ('human','ai-agent') | Loại thành viên |
| `skills` | `JSONB` | NO | `'[]'` | — | Kỹ năng |
| `capacity_hours` | `NUMERIC(5,1)` | NO | `40` | CHECK >= 0 | Giờ khả dụng /tuần |
| `allocated_hours` | `NUMERIC(5,1)` | NO | `0` | CHECK >= 0 | Giờ đã phân bổ |
| `utilization` | `NUMERIC(5,2)` | NO | `0` | CHECK BETWEEN 0 AND 200 | Tỉ lệ sử dụng (%) |
| `active_deals` | `INTEGER` | NO | `0` | CHECK >= 0 | Deal đang xử lý |
| `active_tasks` | `INTEGER` | NO | `0` | CHECK >= 0 | Task đang làm |
| `burnout_risk` | `VARCHAR(15)` | NO | `'low'` | CHECK IN ('low','medium','high','critical') | Mức rủi ro burnout |
| `satisfaction` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Mức hài lòng (%) |
| `performance_score` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Điểm hiệu suất |
| `pto_planned` | `INTEGER` | NO | `0` | CHECK >= 0 | Số ngày nghỉ đã lên kế hoạch |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## Câu lệnh YSQL

```sql
-- ============================================================
-- PHÂN HỆ 15: KHO, SỰ KIỆN & NĂNG LỰC NHÂN SỰ
-- ============================================================

-- 1. inventory_items
CREATE TABLE inventory_items (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    name                VARCHAR(255) NOT NULL,
    sku                 VARCHAR(50) NOT NULL,
    item_type           VARCHAR(20) NOT NULL DEFAULT 'license'
                            CHECK (item_type IN ('license','hardware','subscription','consumable')),
    category            VARCHAR(100),
    current_stock       INTEGER     NOT NULL DEFAULT 0 CHECK (current_stock >= 0),
    min_stock           INTEGER     NOT NULL DEFAULT 0 CHECK (min_stock >= 0),
    max_stock           INTEGER     NOT NULL DEFAULT 0 CHECK (max_stock >= 0),
    reserved_stock      INTEGER     NOT NULL DEFAULT 0 CHECK (reserved_stock >= 0),
    unit_price          NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (unit_price >= 0),
    total_value         NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (total_value >= 0),
    status              VARCHAR(20) NOT NULL DEFAULT 'in-stock'
                            CHECK (status IN ('in-stock','low-stock','out-of-stock','overstock')),
    location            VARCHAR(200),
    supplier            VARCHAR(255),
    last_restocked_at   TIMESTAMPTZ,
    monthly_usage       INTEGER     NOT NULL DEFAULT 0 CHECK (monthly_usage >= 0),
    days_until_stockout INTEGER     CHECK (days_until_stockout IS NULL OR days_until_stockout >= 0),
    auto_reorder        BOOLEAN     NOT NULL DEFAULT FALSE,
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_inventory_sku    ON inventory_items (tenant_id, sku)  WHERE deleted_at IS NULL;
CREATE INDEX idx_inventory_tenant       ON inventory_items (tenant_id)       WHERE deleted_at IS NULL;
CREATE INDEX idx_inventory_status       ON inventory_items (tenant_id, status) WHERE deleted_at IS NULL;
CREATE INDEX idx_inventory_type         ON inventory_items (tenant_id, item_type) WHERE deleted_at IS NULL;

-- 2. crm_events
CREATE TABLE crm_events (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    name                VARCHAR(300) NOT NULL,
    event_type          VARCHAR(20) NOT NULL DEFAULT 'webinar'
                            CHECK (event_type IN ('webinar','workshop','conference','meetup','demo-day')),
    status              VARCHAR(20) NOT NULL DEFAULT 'upcoming'
                            CHECK (status IN ('upcoming','live','completed','cancelled')),
    event_date          DATE        NOT NULL,
    event_time          TIMETZ,
    duration            VARCHAR(50),
    location            VARCHAR(500),
    is_virtual          BOOLEAN     NOT NULL DEFAULT FALSE,
    registered          INTEGER     NOT NULL DEFAULT 0 CHECK (registered >= 0),
    attended            INTEGER     NOT NULL DEFAULT 0 CHECK (attended >= 0),
    capacity            INTEGER     NOT NULL DEFAULT 0 CHECK (capacity >= 0),
    leads_generated     INTEGER     NOT NULL DEFAULT 0 CHECK (leads_generated >= 0),
    pipeline_influenced NUMERIC(18,2) NOT NULL DEFAULT 0 CHECK (pipeline_influenced >= 0),
    roi                 NUMERIC(8,2) NOT NULL DEFAULT 0,
    speakers            JSONB       NOT NULL DEFAULT '[]',
    description         TEXT,
    follow_up_sent      BOOLEAN     NOT NULL DEFAULT FALSE,
    engagement_score    SMALLINT    NOT NULL DEFAULT 0 CHECK (engagement_score BETWEEN 0 AND 100),
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_crm_events_tenant  ON crm_events (tenant_id)               WHERE deleted_at IS NULL;
CREATE INDEX idx_crm_events_type    ON crm_events (tenant_id, event_type)    WHERE deleted_at IS NULL;
CREATE INDEX idx_crm_events_status  ON crm_events (tenant_id, status)        WHERE deleted_at IS NULL;
CREATE INDEX idx_crm_events_date    ON crm_events (tenant_id, event_date)    WHERE deleted_at IS NULL;

-- 3. team_members
CREATE TABLE team_members (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    employee_id         UUID        NOT NULL REFERENCES employees(id),
    role                VARCHAR(100),
    department          VARCHAR(100),
    member_type         VARCHAR(15) NOT NULL DEFAULT 'human'
                            CHECK (member_type IN ('human','ai-agent')),
    skills              JSONB       NOT NULL DEFAULT '[]',
    capacity_hours      NUMERIC(5,1) NOT NULL DEFAULT 40 CHECK (capacity_hours >= 0),
    allocated_hours     NUMERIC(5,1) NOT NULL DEFAULT 0 CHECK (allocated_hours >= 0),
    utilization         NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (utilization BETWEEN 0 AND 200),
    active_deals        INTEGER     NOT NULL DEFAULT 0 CHECK (active_deals >= 0),
    active_tasks        INTEGER     NOT NULL DEFAULT 0 CHECK (active_tasks >= 0),
    burnout_risk        VARCHAR(15) NOT NULL DEFAULT 'low'
                            CHECK (burnout_risk IN ('low','medium','high','critical')),
    satisfaction        SMALLINT    NOT NULL DEFAULT 0 CHECK (satisfaction BETWEEN 0 AND 100),
    performance_score   SMALLINT    NOT NULL DEFAULT 0 CHECK (performance_score BETWEEN 0 AND 100),
    pto_planned         INTEGER     NOT NULL DEFAULT 0 CHECK (pto_planned >= 0),
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_team_members_employee ON team_members (tenant_id, employee_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_team_members_tenant         ON team_members (tenant_id)              WHERE deleted_at IS NULL;
CREATE INDEX idx_team_members_burnout        ON team_members (tenant_id, burnout_risk) WHERE deleted_at IS NULL;
CREATE INDEX idx_team_members_utilization    ON team_members (tenant_id, utilization DESC) WHERE deleted_at IS NULL;
```
