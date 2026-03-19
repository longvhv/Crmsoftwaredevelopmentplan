# Phân hệ 21 — Truyền thông mở rộng (Communication Extended)

> Social media monitoring, live chat, VoIP, meeting intelligence.

---

## 1. `social_mentions`

Lượt đề cập trên mạng xã hội (Social Media Monitor).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `platform` | `VARCHAR(30)` | NO | — | CHECK IN ('twitter','linkedin','facebook','instagram','reddit','youtube','tiktok','other') | Nền tảng |
| `mention_type` | `VARCHAR(20)` | NO | `'mention'` | CHECK IN ('mention','review','comment','post','share') | Loại đề cập |
| `content` | `TEXT` | NO | — | NOT BLANK | Nội dung |
| `author_name` | `VARCHAR(255)` | YES | `NULL` | — | Tên tác giả |
| `author_handle` | `VARCHAR(200)` | YES | `NULL` | — | Handle / username |
| `url` | `TEXT` | YES | `NULL` | — | URL bài viết gốc |
| `sentiment` | `VARCHAR(15)` | NO | `'neutral'` | CHECK IN ('positive','neutral','negative') | Phân tích cảm xúc |
| `engagement` | `JSONB` | NO | `'{}'` | — | Chỉ số {likes, shares, comments, …} |
| `contact_id` | `UUID` | YES | `NULL` | FK → contacts(id) | Khách hàng liên quan |
| `is_responded` | `BOOLEAN` | NO | `FALSE` | — | Đã phản hồi |
| `responded_by` | `UUID` | YES | `NULL` | FK → employees(id) | Người phản hồi |
| `mentioned_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian đề cập |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 2. `live_chat_configs`

Cấu hình live chat widget.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id), UNIQUE | Thuộc tenant nào (1 config / tenant) |
| `is_enabled` | `BOOLEAN` | NO | `TRUE` | — | Bật/tắt chat |
| `widget_color` | `VARCHAR(20)` | NO | `'#3B82F6'` | — | Màu widget |
| `welcome_message` | `TEXT` | NO | `'Xin chào! Tôi có thể giúp gì?'` | — | Tin nhắn chào |
| `offline_message` | `TEXT` | NO | `'Hiện không có agent online.'` | — | Tin nhắn offline |
| `auto_reply_enabled` | `BOOLEAN` | NO | `FALSE` | — | Tự động trả lời (AI) |
| `business_hours` | `JSONB` | NO | `'{}'` | — | Giờ làm việc |
| `assigned_agents` | `JSONB` | NO | `'[]'` | — | Danh sách agent |
| `routing_strategy` | `VARCHAR(20)` | NO | `'round-robin'` | CHECK IN ('round-robin','least-active','skill-based','random') | Chiến lược phân phối |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 3. `voip_call_logs`

Lịch sử cuộc gọi VoIP.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `direction` | `VARCHAR(10)` | NO | — | CHECK IN ('inbound','outbound') | Chiều cuộc gọi |
| `caller_number` | `VARCHAR(30)` | NO | — | — | Số gọi |
| `callee_number` | `VARCHAR(30)` | NO | — | — | Số nhận |
| `contact_id` | `UUID` | YES | `NULL` | FK → contacts(id) | Khách hàng |
| `agent_id` | `UUID` | YES | `NULL` | FK → employees(id) | Agent xử lý |
| `status` | `VARCHAR(20)` | NO | — | CHECK IN ('answered','missed','voicemail','busy','failed') | Trạng thái |
| `duration_seconds` | `INTEGER` | NO | `0` | CHECK >= 0 | Thời lượng (giây) |
| `recording_url` | `TEXT` | YES | `NULL` | — | URL ghi âm |
| `transcript` | `TEXT` | YES | `NULL` | — | Bản ghi lời nói (AI) |
| `sentiment` | `VARCHAR(15)` | YES | `NULL` | CHECK IN ('positive','neutral','negative') | Cảm xúc cuộc gọi |
| `notes` | `TEXT` | YES | `NULL` | — | Ghi chú |
| `started_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian bắt đầu |
| `ended_at` | `TIMESTAMPTZ` | YES | `NULL` | — | Thời gian kết thúc |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 4. `meeting_recordings`

Ghi nhận cuộc họp & phân tích AI (Meeting Intelligence).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `calendar_event_id` | `UUID` | YES | `NULL` | FK → calendar_events(id) | Sự kiện lịch |
| `deal_id` | `UUID` | YES | `NULL` | FK → deals(id) | Deal liên quan |
| `contact_id` | `UUID` | YES | `NULL` | FK → contacts(id) | Khách hàng |
| `title` | `VARCHAR(300)` | NO | — | NOT BLANK | Tiêu đề cuộc họp |
| `recording_url` | `TEXT` | YES | `NULL` | — | URL ghi hình |
| `duration_minutes` | `INTEGER` | YES | `NULL` | CHECK >= 0 | Thời lượng (phút) |
| `transcript` | `TEXT` | YES | `NULL` | — | Bản ghi lời nói (AI) |
| `summary` | `TEXT` | YES | `NULL` | — | Tóm tắt AI |
| `action_items` | `JSONB` | NO | `'[]'` | — | Hạng mục hành động AI trích xuất |
| `key_topics` | `JSONB` | NO | `'[]'` | — | Chủ đề chính |
| `sentiment_score` | `SMALLINT` | YES | `NULL` | CHECK BETWEEN 0 AND 100 | Điểm cảm xúc |
| `talk_ratio` | `JSONB` | NO | `'{}'` | — | Tỉ lệ nói {agent: %, client: %} |
| `participants` | `JSONB` | NO | `'[]'` | — | Danh sách tham dự |
| `host_id` | `UUID` | YES | `NULL` | FK → employees(id) | Người chủ trì |
| `meeting_date` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian họp |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## Câu lệnh YSQL

```sql
-- ============================================================
-- PHÂN HỆ 21: TRUYỀN THÔNG MỞ RỘNG
-- ============================================================

CREATE TABLE social_mentions (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    platform        VARCHAR(30) NOT NULL
                        CHECK (platform IN ('twitter','linkedin','facebook','instagram','reddit','youtube','tiktok','other')),
    mention_type    VARCHAR(20) NOT NULL DEFAULT 'mention'
                        CHECK (mention_type IN ('mention','review','comment','post','share')),
    content         TEXT        NOT NULL,
    author_name     VARCHAR(255),
    author_handle   VARCHAR(200),
    url             TEXT,
    sentiment       VARCHAR(15) NOT NULL DEFAULT 'neutral'
                        CHECK (sentiment IN ('positive','neutral','negative')),
    engagement      JSONB       NOT NULL DEFAULT '{}',
    contact_id      UUID        REFERENCES contacts(id),
    is_responded    BOOLEAN     NOT NULL DEFAULT FALSE,
    responded_by    UUID        REFERENCES employees(id),
    mentioned_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_social_mentions_tenant     ON social_mentions (tenant_id)                  WHERE deleted_at IS NULL;
CREATE INDEX idx_social_mentions_platform   ON social_mentions (tenant_id, platform)        WHERE deleted_at IS NULL;
CREATE INDEX idx_social_mentions_sentiment  ON social_mentions (tenant_id, sentiment)       WHERE deleted_at IS NULL;
CREATE INDEX idx_social_mentions_date       ON social_mentions (tenant_id, mentioned_at DESC) WHERE deleted_at IS NULL;

CREATE TABLE live_chat_configs (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    is_enabled          BOOLEAN     NOT NULL DEFAULT TRUE,
    widget_color        VARCHAR(20) NOT NULL DEFAULT '#3B82F6',
    welcome_message     TEXT        NOT NULL DEFAULT 'Xin chào! Tôi có thể giúp gì?',
    offline_message     TEXT        NOT NULL DEFAULT 'Hiện không có agent online.',
    auto_reply_enabled  BOOLEAN     NOT NULL DEFAULT FALSE,
    business_hours      JSONB       NOT NULL DEFAULT '{}',
    assigned_agents     JSONB       NOT NULL DEFAULT '[]',
    routing_strategy    VARCHAR(20) NOT NULL DEFAULT 'round-robin'
                            CHECK (routing_strategy IN ('round-robin','least-active','skill-based','random')),
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_live_chat_tenant ON live_chat_configs (tenant_id) WHERE deleted_at IS NULL;

CREATE TABLE voip_call_logs (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    direction       VARCHAR(10) NOT NULL CHECK (direction IN ('inbound','outbound')),
    caller_number   VARCHAR(30) NOT NULL,
    callee_number   VARCHAR(30) NOT NULL,
    contact_id      UUID        REFERENCES contacts(id),
    agent_id        UUID        REFERENCES employees(id),
    status          VARCHAR(20) NOT NULL
                        CHECK (status IN ('answered','missed','voicemail','busy','failed')),
    duration_seconds INTEGER    NOT NULL DEFAULT 0 CHECK (duration_seconds >= 0),
    recording_url   TEXT,
    transcript      TEXT,
    sentiment       VARCHAR(15) CHECK (sentiment IS NULL OR sentiment IN ('positive','neutral','negative')),
    notes           TEXT,
    started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ended_at        TIMESTAMPTZ,
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_voip_calls_tenant  ON voip_call_logs (tenant_id)                   WHERE deleted_at IS NULL;
CREATE INDEX idx_voip_calls_contact ON voip_call_logs (tenant_id, contact_id)        WHERE deleted_at IS NULL AND contact_id IS NOT NULL;
CREATE INDEX idx_voip_calls_agent   ON voip_call_logs (tenant_id, agent_id)          WHERE deleted_at IS NULL;
CREATE INDEX idx_voip_calls_date    ON voip_call_logs (tenant_id, started_at DESC)   WHERE deleted_at IS NULL;

CREATE TABLE meeting_recordings (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    calendar_event_id   UUID        REFERENCES calendar_events(id),
    deal_id             UUID        REFERENCES deals(id),
    contact_id          UUID        REFERENCES contacts(id),
    title               VARCHAR(300) NOT NULL,
    recording_url       TEXT,
    duration_minutes    INTEGER     CHECK (duration_minutes IS NULL OR duration_minutes >= 0),
    transcript          TEXT,
    summary             TEXT,
    action_items        JSONB       NOT NULL DEFAULT '[]',
    key_topics          JSONB       NOT NULL DEFAULT '[]',
    sentiment_score     SMALLINT    CHECK (sentiment_score IS NULL OR sentiment_score BETWEEN 0 AND 100),
    talk_ratio          JSONB       NOT NULL DEFAULT '{}',
    participants        JSONB       NOT NULL DEFAULT '[]',
    host_id             UUID        REFERENCES employees(id),
    meeting_date        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE INDEX idx_meeting_recs_tenant    ON meeting_recordings (tenant_id)                WHERE deleted_at IS NULL;
CREATE INDEX idx_meeting_recs_deal      ON meeting_recordings (tenant_id, deal_id)       WHERE deleted_at IS NULL AND deal_id IS NOT NULL;
CREATE INDEX idx_meeting_recs_date      ON meeting_recordings (tenant_id, meeting_date DESC) WHERE deleted_at IS NULL;
```
