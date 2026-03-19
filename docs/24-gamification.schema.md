# Phân hệ 24 — Gamification

> Huy hiệu, thành tích, bảng xếp hạng — động lực cho đội sales.

---

## 1. `gamification_badges`

Định nghĩa huy hiệu.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(200)` | NO | — | UNIQUE per tenant, NOT BLANK | Tên huy hiệu |
| `description` | `TEXT` | YES | `NULL` | — | Mô tả |
| `icon` | `VARCHAR(50)` | YES | `NULL` | — | Icon / emoji |
| `category` | `VARCHAR(30)` | NO | `'sales'` | CHECK IN ('sales','activity','milestone','collaboration','quality','special') | Danh mục |
| `criteria` | `JSONB` | NO | `'{}'` | — | Điều kiện đạt {metric, threshold, …} |
| `points` | `INTEGER` | NO | `0` | CHECK >= 0 | Điểm khi đạt |
| `rarity` | `VARCHAR(15)` | NO | `'common'` | CHECK IN ('common','uncommon','rare','epic','legendary') | Độ hiếm |
| `is_active` | `BOOLEAN` | NO | `TRUE` | — | Đang kích hoạt |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 2. `gamification_achievements`

Thành tích đã đạt của nhân viên.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `employee_id` | `UUID` | NO | — | FK → employees(id) | Nhân viên |
| `badge_id` | `UUID` | NO | — | FK → gamification_badges(id) | Huy hiệu |
| `points_earned` | `INTEGER` | NO | `0` | CHECK >= 0 | Điểm đã nhận |
| `achieved_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian đạt |
| `context` | `JSONB` | NO | `'{}'` | — | Ngữ cảnh (deal_id, metric_value, …) |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

> **UNIQUE:** `(tenant_id, employee_id, badge_id)` WHERE `deleted_at IS NULL` — mỗi badge chỉ đạt 1 lần.

---

## Câu lệnh YSQL

```sql
-- ============================================================
-- PHÂN HỆ 24: GAMIFICATION
-- ============================================================

CREATE TABLE gamification_badges (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    icon            VARCHAR(50),
    category        VARCHAR(30) NOT NULL DEFAULT 'sales'
                        CHECK (category IN ('sales','activity','milestone','collaboration','quality','special')),
    criteria        JSONB       NOT NULL DEFAULT '{}',
    points          INTEGER     NOT NULL DEFAULT 0 CHECK (points >= 0),
    rarity          VARCHAR(15) NOT NULL DEFAULT 'common'
                        CHECK (rarity IN ('common','uncommon','rare','epic','legendary')),
    is_active       BOOLEAN     NOT NULL DEFAULT TRUE,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_badges_name ON gamification_badges (tenant_id, name) WHERE deleted_at IS NULL;
CREATE INDEX idx_badges_tenant     ON gamification_badges (tenant_id)       WHERE deleted_at IS NULL;

CREATE TABLE gamification_achievements (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    employee_id     UUID        NOT NULL REFERENCES employees(id),
    badge_id        UUID        NOT NULL REFERENCES gamification_badges(id),
    points_earned   INTEGER     NOT NULL DEFAULT 0 CHECK (points_earned >= 0),
    achieved_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    context         JSONB       NOT NULL DEFAULT '{}',
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_achievements ON gamification_achievements (tenant_id, employee_id, badge_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_achievements_employee ON gamification_achievements (tenant_id, employee_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_achievements_badge    ON gamification_achievements (tenant_id, badge_id)    WHERE deleted_at IS NULL;
```
