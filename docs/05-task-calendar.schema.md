# Phân hệ 05 — Công việc & Lịch (Task & Calendar)

> Quản lý task Kanban và lịch hẹn CRM.

---

## 1. `tasks`

Công việc / to-do quản lý theo Kanban board.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `title` | `VARCHAR(300)` | NO | — | NOT BLANK | Tiêu đề task |
| `description` | `TEXT` | YES | `NULL` | — | Mô tả chi tiết |
| `status` | `VARCHAR(20)` | NO | `'todo'` | CHECK IN ('backlog','todo','in-progress','done') | Trạng thái Kanban |
| `priority` | `VARCHAR(10)` | NO | `'medium'` | CHECK IN ('urgent','high','medium','low') | Mức ưu tiên |
| `category` | `VARCHAR(20)` | NO | `'admin'` | CHECK IN ('follow-up','meeting','proposal','review','outreach','admin') | Danh mục |
| `assignee_id` | `UUID` | YES | `NULL` | FK → employees(id) | Người thực hiện |
| `due_date` | `DATE` | YES | `NULL` | — | Ngày hạn |
| `contact_id` | `UUID` | YES | `NULL` | FK → contacts(id) | Liên hệ liên quan |
| `deal_id` | `UUID` | YES | `NULL` | FK → deals(id) | Deal liên quan |
| `is_ai_suggested` | `BOOLEAN` | NO | `FALSE` | — | AI đề xuất hay không |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 2. `calendar_events`

Sự kiện lịch hẹn CRM.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `title` | `VARCHAR(300)` | NO | — | NOT BLANK | Tiêu đề sự kiện |
| `event_type` | `VARCHAR(20)` | NO | `'meeting'` | CHECK IN ('meeting','call','follow-up','deadline','task','demo') | Loại sự kiện |
| `event_date` | `DATE` | NO | — | — | Ngày diễn ra |
| `start_time` | `TIMETZ` | NO | — | — | Giờ bắt đầu |
| `end_time` | `TIMETZ` | NO | — | CHECK end_time > start_time | Giờ kết thúc |
| `contact_id` | `UUID` | YES | `NULL` | FK → contacts(id) | Liên hệ liên quan |
| `deal_id` | `UUID` | YES | `NULL` | FK → deals(id) | Deal liên quan |
| `location` | `VARCHAR(500)` | YES | `NULL` | — | Địa điểm / Link meeting |
| `is_online` | `BOOLEAN` | NO | `FALSE` | — | Sự kiện trực tuyến |
| `assigned_to` | `UUID` | NO | — | FK → employees(id) | Nhân viên phụ trách |
| `is_ai_generated` | `BOOLEAN` | NO | `FALSE` | — | AI tạo tự động |
| `priority` | `VARCHAR(10)` | NO | `'medium'` | CHECK IN ('high','medium','low') | Mức ưu tiên |
| `notes` | `TEXT` | YES | `NULL` | — | Ghi chú |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## Câu lệnh YSQL

```sql
-- ============================================================
-- PHÂN HỆ 05: CÔNG VIỆC & LỊCH
-- ============================================================

-- 1. tasks
CREATE TABLE tasks (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    title           VARCHAR(300) NOT NULL,
    description     TEXT,
    status          VARCHAR(20) NOT NULL DEFAULT 'todo'
                        CHECK (status IN ('backlog','todo','in-progress','done')),
    priority        VARCHAR(10) NOT NULL DEFAULT 'medium'
                        CHECK (priority IN ('urgent','high','medium','low')),
    category        VARCHAR(20) NOT NULL DEFAULT 'admin'
                        CHECK (category IN ('follow-up','meeting','proposal','review','outreach','admin')),
    assignee_id     UUID        REFERENCES employees(id),
    due_date        DATE,
    contact_id      UUID        REFERENCES contacts(id),
    deal_id         UUID        REFERENCES deals(id),
    is_ai_suggested BOOLEAN     NOT NULL DEFAULT FALSE,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_tasks_tenant       ON tasks (tenant_id)                WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_status       ON tasks (tenant_id, status)        WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_assignee     ON tasks (tenant_id, assignee_id)   WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_priority     ON tasks (tenant_id, priority)      WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_due_date     ON tasks (tenant_id, due_date)      WHERE deleted_at IS NULL;
CREATE INDEX idx_tasks_deal         ON tasks (tenant_id, deal_id)       WHERE deleted_at IS NULL AND deal_id IS NOT NULL;

-- 2. calendar_events
CREATE TABLE calendar_events (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    title           VARCHAR(300) NOT NULL,
    event_type      VARCHAR(20) NOT NULL DEFAULT 'meeting'
                        CHECK (event_type IN ('meeting','call','follow-up','deadline','task','demo')),
    event_date      DATE        NOT NULL,
    start_time      TIMETZ      NOT NULL,
    end_time        TIMETZ      NOT NULL,
    contact_id      UUID        REFERENCES contacts(id),
    deal_id         UUID        REFERENCES deals(id),
    location        VARCHAR(500),
    is_online       BOOLEAN     NOT NULL DEFAULT FALSE,
    assigned_to     UUID        NOT NULL REFERENCES employees(id),
    is_ai_generated BOOLEAN     NOT NULL DEFAULT FALSE,
    priority        VARCHAR(10) NOT NULL DEFAULT 'medium'
                        CHECK (priority IN ('high','medium','low')),
    notes           TEXT,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_cal_events_tenant      ON calendar_events (tenant_id)                      WHERE deleted_at IS NULL;
CREATE INDEX idx_cal_events_date        ON calendar_events (tenant_id, event_date)           WHERE deleted_at IS NULL;
CREATE INDEX idx_cal_events_assigned    ON calendar_events (tenant_id, assigned_to)          WHERE deleted_at IS NULL;
CREATE INDEX idx_cal_events_type        ON calendar_events (tenant_id, event_type)           WHERE deleted_at IS NULL;
CREATE INDEX idx_cal_events_contact     ON calendar_events (tenant_id, contact_id)           WHERE deleted_at IS NULL AND contact_id IS NOT NULL;
```
