# 📘 HƯỚNG DẪN CHÍNH THỨC & SỔ TAY KỸ THUẬT (V2.0)

## 3. Quy chuẩn dữ liệu & đặt tên

### 3.1 Quy ước đặt tên

| **Thành phần**           | **Quy ước**             | **Ví dụ**                       |
| ------------------------ | ----------------------- | ------------------------------- |
| **Database / Table**     | `snake_case` (Số nhiều) | `order_items`, `tenant_configs` |
| **Database Field**       | `snake_case`            | `user_id`, `created_at`         |
| **Golang Struct / JSON** | `camelCase`             | `UserId`, `createdAt`           |
| **Primary Key**          | `id` (UUID v7)         | `018d1234-5678-7123...`         |

### 3.2 Các trường bắt buộc (Standard Mixins)

Mọi bản ghi nghiệp vụ (Yugabyte/Mongo) phải bao gồm:

* `id`: UUID định danh duy nhất.
* `tenant_id`: Định danh Tenant (bắt buộc để isolation).
* `version`: Số nguyên phục vụ **Optimistic Locking** (chống ghi đè).
* `created_at / updated_at`: Thời gian UTC.
* `deleted_at`: Đánh dấu **Soft Delete**. Cấm dùng lệnh `DELETE` vật lý.

### 3.3 Tiêu chuẩn thiết kế API

#### 3.3.1. Base Path Naming
Chúng ta thống nhất sử dụng danh từ số ít (Singular) và loại bỏ hậu tố `-service` để URL ngắn gọn, sạch sẽ.

| Loại Service | Định dạng cũ (Bỏ)                | Định dạng chuẩn (Dùng)   |
| :----------- | :------------------------------- | :----------------------- |
| Tenant       | `/api/tenant-service/v1/tenants` | `/api/tenant/v1/tenants` |
| User         | `/api/user-service/v1`           | `/api/user/v1/users`     |
| Auth         | `/api/authentication-service/v1`           | `/api/authentication/v1/login`     |
| Auth Page    | `/page/auth-service/`            | `/page/auth/login`       |
| User Page    | `/page/user-service/`            | `/page/user/users`       |

#### 3.3.2. Tại sao dùng số ít?
- Tránh nhầm lẫn giữa Resource (ví dụ: `/users/123`) và Service quản lý Resource đó.
- Nhất quán với cấu trúc folder trong mã nguồn (thường đặt tên package là `user`, `tenant`).
- URL ngắn gọn, dễ nhớ cho việc cấu hình Gateway/Reverse Proxy.

