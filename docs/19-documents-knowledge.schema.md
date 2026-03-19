# Phân hệ 19 — Tài liệu & Kiến thức (Documents & Knowledge Base)

> Quản lý tài liệu, cơ sở kiến thức nội bộ/khách hàng.

---

## 1. `documents`

Tài liệu (hợp đồng, proposal, báo cáo, …).

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(300)` | NO | — | NOT BLANK | Tên tài liệu |
| `document_type` | `VARCHAR(30)` | NO | `'general'` | CHECK IN ('contract','proposal','invoice','report','presentation','template','general') | Loại |
| `status` | `VARCHAR(20)` | NO | `'draft'` | CHECK IN ('draft','active','archived','expired') | Trạng thái |
| `file_url` | `TEXT` | YES | `NULL` | — | URL file lưu trữ |
| `file_size` | `BIGINT` | YES | `NULL` | CHECK >= 0 | Kích thước file (bytes) |
| `mime_type` | `VARCHAR(100)` | YES | `NULL` | — | MIME type |
| `folder` | `VARCHAR(500)` | YES | `NULL` | — | Thư mục chứa |
| `contact_id` | `UUID` | YES | `NULL` | FK → contacts(id) | Khách hàng liên quan |
| `deal_id` | `UUID` | YES | `NULL` | FK → deals(id) | Deal liên quan |
| `uploaded_by` | `UUID` | YES | `NULL` | FK → employees(id) | Người tải lên |
| `shared_with` | `JSONB` | NO | `'[]'` | — | Chia sẻ với ai (user_ids hoặc roles) |
| `expiry_date` | `DATE` | YES | `NULL` | — | Ngày hết hạn |
| `download_count` | `INTEGER` | NO | `0` | CHECK >= 0 | Số lần tải |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 2. `knowledge_categories`

Danh mục bài viết kiến thức.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `name` | `VARCHAR(200)` | NO | — | UNIQUE per tenant, NOT BLANK | Tên danh mục |
| `slug` | `VARCHAR(200)` | NO | — | UNIQUE per tenant | Slug |
| `description` | `TEXT` | YES | `NULL` | — | Mô tả |
| `parent_id` | `UUID` | YES | `NULL` | FK → knowledge_categories(id) | Danh mục cha |
| `icon` | `VARCHAR(50)` | YES | `NULL` | — | Icon |
| `sort_order` | `INTEGER` | NO | `0` | — | Thứ tự |
| `article_count` | `INTEGER` | NO | `0` | CHECK >= 0 | Số bài viết |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## 3. `knowledge_articles`

Bài viết trong cơ sở kiến thức.

| Tên trường | Kiểu dữ liệu | Null? | Mặc định | Ràng buộc & Logic | Mô tả |
|---|---|---|---|---|---|
| `id` | `UUID` | NO | `gen_random_uuid()` | PK | Định danh duy nhất |
| `tenant_id` | `UUID` | NO | — | FK → tenants(id) | Thuộc tenant nào |
| `title` | `VARCHAR(300)` | NO | — | NOT BLANK | Tiêu đề |
| `slug` | `VARCHAR(300)` | NO | — | UNIQUE per tenant | Slug URL |
| `category_id` | `UUID` | YES | `NULL` | FK → knowledge_categories(id) | Danh mục |
| `content_html` | `TEXT` | NO | `''` | — | Nội dung HTML |
| `content_text` | `TEXT` | NO | `''` | — | Nội dung plain text (search) |
| `status` | `VARCHAR(20)` | NO | `'draft'` | CHECK IN ('draft','published','archived') | Trạng thái |
| `visibility` | `VARCHAR(15)` | NO | `'internal'` | CHECK IN ('internal','public','customer') | Phạm vi hiển thị |
| `author_id` | `UUID` | YES | `NULL` | FK → employees(id) | Tác giả |
| `views` | `INTEGER` | NO | `0` | CHECK >= 0 | Lượt xem |
| `helpful_count` | `INTEGER` | NO | `0` | CHECK >= 0 | Số lượt "hữu ích" |
| `not_helpful_count` | `INTEGER` | NO | `0` | CHECK >= 0 | Số lượt "không hữu ích" |
| `related_article_ids` | `JSONB` | NO | `'[]'` | — | Bài viết liên quan |
| `version` | `INTEGER` | NO | `1` | CHECK >= 1 | Optimistic locking |
| `created_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian tạo |
| `updated_at` | `TIMESTAMPTZ` | NO | `NOW()` | — | Thời gian cập nhật |
| `deleted_at` | `TIMESTAMPTZ` | YES | `NULL` | Soft delete | Thời gian xoá mềm |

---

## Câu lệnh YSQL

```sql
-- ============================================================
-- PHÂN HỆ 19: TÀI LIỆU & KIẾN THỨC
-- ============================================================

CREATE TABLE documents (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(300) NOT NULL,
    document_type   VARCHAR(30) NOT NULL DEFAULT 'general'
                        CHECK (document_type IN ('contract','proposal','invoice','report','presentation','template','general')),
    status          VARCHAR(20) NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft','active','archived','expired')),
    file_url        TEXT,
    file_size       BIGINT      CHECK (file_size IS NULL OR file_size >= 0),
    mime_type       VARCHAR(100),
    folder          VARCHAR(500),
    contact_id      UUID        REFERENCES contacts(id),
    deal_id         UUID        REFERENCES deals(id),
    uploaded_by     UUID        REFERENCES employees(id),
    shared_with     JSONB       NOT NULL DEFAULT '[]',
    expiry_date     DATE,
    download_count  INTEGER     NOT NULL DEFAULT 0 CHECK (download_count >= 0),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_documents_tenant   ON documents (tenant_id)                WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_type     ON documents (tenant_id, document_type) WHERE deleted_at IS NULL;
CREATE INDEX idx_documents_contact  ON documents (tenant_id, contact_id)    WHERE deleted_at IS NULL AND contact_id IS NOT NULL;
CREATE INDEX idx_documents_deal     ON documents (tenant_id, deal_id)       WHERE deleted_at IS NULL AND deal_id IS NOT NULL;
CREATE INDEX idx_documents_folder   ON documents (tenant_id, folder)        WHERE deleted_at IS NULL;

CREATE TABLE knowledge_categories (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID        NOT NULL REFERENCES tenants(id),
    name            VARCHAR(200) NOT NULL,
    slug            VARCHAR(200) NOT NULL,
    description     TEXT,
    parent_id       UUID        REFERENCES knowledge_categories(id),
    icon            VARCHAR(50),
    sort_order      INTEGER     NOT NULL DEFAULT 0,
    article_count   INTEGER     NOT NULL DEFAULT 0 CHECK (article_count >= 0),
    version         INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at      TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_kb_categories_name ON knowledge_categories (tenant_id, name) WHERE deleted_at IS NULL;
CREATE UNIQUE INDEX uk_kb_categories_slug ON knowledge_categories (tenant_id, slug) WHERE deleted_at IS NULL;

CREATE TABLE knowledge_articles (
    id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID        NOT NULL REFERENCES tenants(id),
    title               VARCHAR(300) NOT NULL,
    slug                VARCHAR(300) NOT NULL,
    category_id         UUID        REFERENCES knowledge_categories(id),
    content_html        TEXT        NOT NULL DEFAULT '',
    content_text        TEXT        NOT NULL DEFAULT '',
    status              VARCHAR(20) NOT NULL DEFAULT 'draft'
                            CHECK (status IN ('draft','published','archived')),
    visibility          VARCHAR(15) NOT NULL DEFAULT 'internal'
                            CHECK (visibility IN ('internal','public','customer')),
    author_id           UUID        REFERENCES employees(id),
    views               INTEGER     NOT NULL DEFAULT 0 CHECK (views >= 0),
    helpful_count       INTEGER     NOT NULL DEFAULT 0 CHECK (helpful_count >= 0),
    not_helpful_count   INTEGER     NOT NULL DEFAULT 0 CHECK (not_helpful_count >= 0),
    related_article_ids JSONB       NOT NULL DEFAULT '[]',
    version             INTEGER     NOT NULL DEFAULT 1 CHECK (version >= 1),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ
);

CREATE UNIQUE INDEX uk_kb_articles_slug ON knowledge_articles (tenant_id, slug) WHERE deleted_at IS NULL;
CREATE INDEX idx_kb_articles_tenant     ON knowledge_articles (tenant_id)               WHERE deleted_at IS NULL;
CREATE INDEX idx_kb_articles_category   ON knowledge_articles (tenant_id, category_id)  WHERE deleted_at IS NULL;
CREATE INDEX idx_kb_articles_status     ON knowledge_articles (tenant_id, status)       WHERE deleted_at IS NULL;
```
