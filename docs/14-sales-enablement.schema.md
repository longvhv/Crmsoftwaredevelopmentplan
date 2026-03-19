# Phân hệ 14 — Sales Enablement

> Sổ tay bán hàng (Playbook), battle card, mục tiêu OKR, key results.

---

## 1. `playbooks`

Sổ tay bán hàng.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên playbook |
| `playbook_type` | `VARCHAR(20)` | NO | `'methodology'` | CHECK IN ('methodology','process','objection','battle-card','onboarding') | Loại |
| `description` | `TEXT` | YES | `NULL` | — | Mô tả |
| `stages` | `JSONB` | NO | `'[]'` | — | Giai đoạn áp dụng ['prospecting','discovery',…] |
| `steps` | `INTEGER` | NO | `0` | CHECK >= 0 | Số bước |
| `completed_by_reps` | `INTEGER` | NO | `0` | CHECK >= 0 | Số rep đã hoàn thành |
| `total_reps` | `INTEGER` | NO | `0` | CHECK >= 0 | Tổng số rep |
| `win_rate_impact` | `NUMERIC(5,2)` | NO | `0` | — | Tác động tỉ lệ thắng (%) |
| `avg_deal_velocity` | `NUMERIC(8,1)` | NO | `0` | CHECK >= 0 | Tốc độ deal TB (ngày) |
| `author_id` | `UUID` | YES | `NULL` | FK → employees(id) | Tác giả |
| `rating` | `NUMERIC(2,1)` | NO | `0` | CHECK BETWEEN 0 AND 5 | Đánh giá (0-5 sao) |
| `is_ai_generated` | `BOOLEAN` | NO | `FALSE` | — | AI tạo |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 2. `playbook_battle_cards`

Battle card trong playbook (vs đối thủ cụ thể).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `competitor_name` | `VARCHAR(255)` | NO | — | NOT BLANK | Tên đối thủ |
| `competitor_id` | `UUID` | YES | `NULL` | FK → competitors(id) | Đối thủ (nếu đã có hồ sơ) |
| `win_rate` | `NUMERIC(5,2)` | NO | `0` | CHECK BETWEEN 0 AND 100 | Tỉ lệ thắng |
| `key_differentiators` | `JSONB` | NO | `'[]'` | — | Điểm khác biệt then chốt |
| `objections` | `JSONB` | NO | `'[]'` | — | Phản đối thường gặp |
| `talk_tracks` | `JSONB` | NO | `'[]'` | — | Kịch bản nói chuyện |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 3. `goals`

Mục tiêu OKR (company / team / individual).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `title` | `VARCHAR(300)` | NO | — | NOT BLANK | Tiêu đề mục tiêu |
| `description` | `TEXT` | YES | `NULL` | — | Mô tả |
| `level` | `VARCHAR(15)` | NO | `'team'` | CHECK IN ('company','team','individual') | Cấp độ |
| `status` | `VARCHAR(15)` | NO | `'not-started'` | CHECK IN ('on-track','at-risk','behind','completed','not-started') | Trạng thái |
| `category` | `VARCHAR(20)` | NO | `'revenue'` | CHECK IN ('revenue','customer','product','people','operational','innovation') | Danh mục |
| `owner_id` | `UUID` | YES | `NULL` | FK → employees(id) | Chủ sở hữu |
| `team` | `VARCHAR(100)` | YES | `NULL` | — | Đội / nhóm |
| `progress` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Tiến độ (%) |
| `start_date` | `DATE` | NO | — | — | Ngày bắt đầu |
| `due_date` | `DATE` | NO | — | CHECK >= start_date | Ngày hạn |
| `ai_coaching_note` | `TEXT` | YES | `NULL` | — | AI coaching |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 4. `key_results`

Key Results gắn với mục tiêu.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `goal_id` | `UUID` | NO | — | FK → goals(id) | Mục tiêu cha |
| `title` | `VARCHAR(300)` | NO | — | NOT BLANK | Tiêu đề KR |
| `current_value` | `NUMERIC(15,2)` | NO | `0` | — | Giá trị hiện tại |
| `target_value` | `NUMERIC(15,2)` | NO | `0` | CHECK > 0 | Giá trị mục tiêu |
| `unit` | `VARCHAR(50)` | NO | `''` | — | Đơn vị ($, %, deals, …) |
| `progress` | `SMALLINT` | NO | `0` | CHECK BETWEEN 0 AND 100 | Tiến độ (%) |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## Câu lệnh YSQL

```sql
-- ============================================================
-- PHÂN HỆ 14: SALES ENABLEMENT
-- ============================================================

-- 1. playbooks
CREATE TABLE playbooks (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    name                VARCHAR(255) NOT NULL,
    playbook_type       VARCHAR(20) NOT NULL DEFAULT 'methodology'
                            CHECK (playbook_type IN ('methodology','process','objection','battle-card','onboarding')),
    description         TEXT,
    stages              JSONB       NOT NULL DEFAULT '[]',
    steps               INTEGER     NOT NULL DEFAULT 0 CHECK (steps >= 0),
    completed_by_reps   INTEGER     NOT NULL DEFAULT 0 CHECK (completed_by_reps >= 0),
    total_reps          INTEGER     NOT NULL DEFAULT 0 CHECK (total_reps >= 0),
    win_rate_impact     NUMERIC(5,2) NOT NULL DEFAULT 0,
    avg_deal_velocity   NUMERIC(8,1) NOT NULL DEFAULT 0 CHECK (avg_deal_velocity >= 0),
    author_id           UUID        REFERENCES employees(id),
    rating              NUMERIC(2,1) NOT NULL DEFAULT 0 CHECK (rating BETWEEN 0 AND 5),
    is_ai_generated     BOOLEAN     NOT NULL DEFAULT FALSE,
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_playbooks_tenant   ON playbooks (tenant_id)                WHERE deleted_at IS NULL;
CREATE INDEX idx_playbooks_type     ON playbooks (tenant_id, playbook_type) WHERE deleted_at IS NULL;

-- 2. playbook_battle_cards
CREATE TABLE playbook_battle_cards (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    competitor_name     VARCHAR(255) NOT NULL,
    competitor_id       UUID        REFERENCES competitors(id),
    win_rate            NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (win_rate BETWEEN 0 AND 100),
    key_differentiators JSONB       NOT NULL DEFAULT '[]',
    objections          JSONB       NOT NULL DEFAULT '[]',
    talk_tracks         JSONB       NOT NULL DEFAULT '[]',
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_pb_battle_cards_tenant ON playbook_battle_cards (tenant_id) WHERE deleted_at IS NULL;

-- 3. goals
CREATE TABLE goals (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    title           VARCHAR(300) NOT NULL,
    description     TEXT,
    level           VARCHAR(15) NOT NULL DEFAULT 'team'
                        CHECK (level IN ('company','team','individual')),
    status          VARCHAR(15) NOT NULL DEFAULT 'not-started'
                        CHECK (status IN ('on-track','at-risk','behind','completed','not-started')),
    category        VARCHAR(20) NOT NULL DEFAULT 'revenue'
                        CHECK (category IN ('revenue','customer','product','people','operational','innovation')),
    owner_id        UUID        REFERENCES employees(id),
    team            VARCHAR(100),
    progress        SMALLINT    NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    start_date      DATE        NOT NULL,
    due_date        DATE        NOT NULL,
    ai_coaching_note TEXT,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ,
    CONSTRAINT chk_goals_dates CHECK (due_date >= start_date)
);

CREATE INDEX idx_goals_tenant   ON goals (tenant_id)            WHERE deleted_at IS NULL;
CREATE INDEX idx_goals_level    ON goals (tenant_id, level)     WHERE deleted_at IS NULL;
CREATE INDEX idx_goals_status   ON goals (tenant_id, status)    WHERE deleted_at IS NULL;
CREATE INDEX idx_goals_owner    ON goals (tenant_id, owner_id)  WHERE deleted_at IS NULL;

-- 4. key_results
CREATE TABLE key_results (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    goal_id         UUID        NOT NULL REFERENCES goals(id),
    title           VARCHAR(300) NOT NULL,
    current_value   NUMERIC(15,2) NOT NULL DEFAULT 0,
    target_value    NUMERIC(15,2) NOT NULL DEFAULT 0 CHECK (target_value > 0),
    unit            VARCHAR(50) NOT NULL DEFAULT '',
    progress        SMALLINT    NOT NULL DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_key_results_goal ON key_results (tenant_id, goal_id) WHERE deleted_at IS NULL;
```
