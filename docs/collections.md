# Danh sách Bảng Cơ sở dữ liệu — CRM AI-First

> **Database engine:** YugabyteDB (YSQL — tương thích PostgreSQL)
> **Quy ước:** Tên bảng `snake_case` số nhiều · PK = `id` UUID v7 · Mọi bảng có Standard Mixins (`id`, `tenant_id`, `version`, `created_at`, `updated_at`, `deleted_at`)

---

## Tổng hợp tất cả bảng

| # | Phân nhóm | Tên bảng | Mô tả |
|---|-----------|----------|-------|
| | **01 — Hệ thống lõi** | | |
| 1 | Hệ thống lõi | `tenants` | Tổ chức / công ty thuê hệ thống (multi-tenant root) |
| 2 | Hệ thống lõi | `users` | Tài khoản đăng nhập (con người hoặc service account) |
| 3 | Hệ thống lõi | `roles` | Vai trò phân quyền |
| 4 | Hệ thống lõi | `departments` | Phòng ban trong tổ chức |
| 5 | Hệ thống lõi | `user_roles` | Gán vai trò cho người dùng (N-N) |
| 6 | Hệ thống lõi | `audit_logs` | Nhật ký thao tác hệ thống |
| | **02 — CRM Cốt lõi** | | |
| 7 | CRM Cốt lõi | `employees` | Nhân viên (con người + AI agent) |
| 8 | CRM Cốt lõi | `employee_roles` | Vai trò phụ của nhân viên (N-N) |
| 9 | CRM Cốt lõi | `contacts` | Liên hệ / Khách hàng / Đối tác |
| 10 | CRM Cốt lõi | `deals` | Cơ hội kinh doanh (Pipeline) |
| 11 | CRM Cốt lõi | `activities` | Hoạt động CRM (call, email, meeting, note, task) |
| 12 | CRM Cốt lõi | `tags` | Bảng tag dùng chung cho mọi entity |
| 13 | CRM Cốt lõi | `entity_tags` | Gắn tag cho entity (polymorphic N-N) |
| | **03 — Quản lý Lead** | | |
| 14 | Quản lý Lead | `leads` | Lead đầu vào đa kênh, AI auto-qualify |
| | **04 — Truyền thông** | | |
| 15 | Truyền thông | `email_templates` | Mẫu email marketing / bán hàng |
| 16 | Truyền thông | `email_sequences` | Chuỗi email tự động (drip campaign) |
| 17 | Truyền thông | `email_sequence_steps` | Bước trong chuỗi email |
| 18 | Truyền thông | `sms_campaigns` | Chiến dịch SMS marketing |
| | **05 — Công việc & Lịch** | | |
| 19 | Công việc & Lịch | `tasks` | Công việc / to-do (Kanban board) |
| 20 | Công việc & Lịch | `calendar_events` | Sự kiện lịch hẹn |
| | **06 — Sản phẩm & Báo giá** | | |
| 21 | Sản phẩm & Báo giá | `products` | Sản phẩm / Dịch vụ catalog |
| 22 | Sản phẩm & Báo giá | `pricing_tiers` | Gói giá của sản phẩm |
| 23 | Sản phẩm & Báo giá | `quotations` | Báo giá cho khách hàng |
| 24 | Sản phẩm & Báo giá | `quotation_line_items` | Dòng sản phẩm trong báo giá |
| | **07 — Hợp đồng** | | |
| 25 | Hợp đồng | `contracts` | Hợp đồng với khách hàng |
| 26 | Hợp đồng | `contract_amendments` | Phụ lục / sửa đổi hợp đồng |
| | **08 — Hoa hồng & Dự báo** | | |
| 27 | Hoa hồng & Dự báo | `commission_tiers` | Bậc tính hoa hồng |
| 28 | Hoa hồng & Dự báo | `bonus_rules` | Quy tắc thưởng bổ sung |
| 29 | Hoa hồng & Dự báo | `sales_rep_commissions` | Hoa hồng thực tế của sales |
| 30 | Hoa hồng & Dự báo | `commission_bonuses` | Chi tiết bonus đã áp dụng |
| 31 | Hoa hồng & Dự báo | `rep_forecasts` | Dự báo doanh số theo sales rep |
| | **09 — Hỗ trợ khách hàng** | | |
| 32 | Hỗ trợ khách hàng | `support_tickets` | Ticket hỗ trợ kỹ thuật |
| 33 | Hỗ trợ khách hàng | `ticket_messages` | Tin nhắn trong ticket |
| | **10 — Nhà cung cấp & Đối tác** | | |
| 34 | Nhà cung cấp & Đối tác | `vendors` | Nhà cung cấp bên ngoài |
| 35 | Nhà cung cấp & Đối tác | `vendor_contracts` | Hợp đồng với nhà cung cấp |
| 36 | Nhà cung cấp & Đối tác | `partners` | Đối tác kinh doanh |
| | **11 — Customer Success** | | |
| 37 | Customer Success | `customer_healths` | Chỉ số sức khoẻ khách hàng |
| 38 | Customer Success | `health_metrics` | Chỉ số chi tiết sức khoẻ |
| 39 | Customer Success | `health_score_trends` | Lịch sử điểm sức khoẻ theo tháng |
| 40 | Customer Success | `nps_feedbacks` | Phản hồi NPS từ khách hàng |
| 41 | Customer Success | `client_nps_snapshots` | Tổng hợp NPS theo khách hàng |
| 42 | Customer Success | `churn_risk_accounts` | Tài khoản có rủi ro rời bỏ |
| 43 | Customer Success | `renewals` | Pipeline gia hạn hợp đồng |
| | **12 — Phân tích & Trí tuệ** | | |
| 44 | Phân tích & Trí tuệ | `campaign_rois` | Phân tích ROI chiến dịch marketing |
| 45 | Phân tích & Trí tuệ | `competitors` | Hồ sơ đối thủ cạnh tranh |
| 46 | Phân tích & Trí tuệ | `competitor_battle_cards` | Battle card so sánh đối thủ |
| 47 | Phân tích & Trí tuệ | `competitor_skills` | Đánh giá kỹ năng đối thủ vs ta |
| 48 | Phân tích & Trí tuệ | `win_loss_records` | Lịch sử thắng/thua deal |
| 49 | Phân tích & Trí tuệ | `revenue_leak_items` | Phát hiện rò rỉ doanh thu |
| | **13 — Lãnh thổ & Chỉ tiêu** | | |
| 50 | Lãnh thổ & Chỉ tiêu | `territories` | Vùng lãnh thổ sales |
| 51 | Lãnh thổ & Chỉ tiêu | `territory_reps` | Nhân viên trong lãnh thổ |
| 52 | Lãnh thổ & Chỉ tiêu | `territory_quarter_revenues` | Doanh thu theo quý của lãnh thổ |
| 53 | Lãnh thổ & Chỉ tiêu | `quota_reps` | Chỉ tiêu doanh số nhân viên |
| | **14 — Sales Enablement** | | |
| 54 | Sales Enablement | `playbooks` | Sổ tay bán hàng (methodology, process) |
| 55 | Sales Enablement | `playbook_battle_cards` | Battle card trong playbook |
| 56 | Sales Enablement | `goals` | Mục tiêu OKR (company/team/individual) |
| 57 | Sales Enablement | `key_results` | Key Results của mục tiêu |
| | **15 — Kho, Sự kiện & Nhân sự** | | |
| 58 | Kho & Sự kiện | `inventory_items` | Sản phẩm trong kho (license, hardware, …) |
| 59 | Kho & Sự kiện | `crm_events` | Sự kiện CRM (webinar, workshop, …) |
| 60 | Năng lực nhân sự | `team_members` | Năng lực & phân bổ nhân sự |
| | **16 — Cấu hình** | | |
| 61 | Cấu hình | `crm_settings_categories` | Danh mục cấu hình CRM |
| 62 | Cấu hình | `custom_fields` | Trường tuỳ chỉnh do người dùng tạo |
| 63 | Cấu hình | `automation_rules` | Quy tắc tự động hoá |
| 64 | Cấu hình | `workflow_definitions` | Định nghĩa workflow |
| 65 | Cấu hình | `notification_preferences` | Cấu hình thông báo người dùng |
| 66 | Cấu hình | `webhooks` | Cấu hình webhook đẩy sự kiện |
| | **17 — Biểu mẫu & Khảo sát** | | |
| 67 | Biểu mẫu | `forms` | Biểu mẫu (Form Builder) |
| 68 | Biểu mẫu | `form_fields` | Trường trong biểu mẫu |
| 69 | Biểu mẫu | `form_submissions` | Dữ liệu gửi từ biểu mẫu |
| 70 | Khảo sát | `surveys` | Khảo sát (Survey Builder) |
| 71 | Khảo sát | `survey_questions` | Câu hỏi khảo sát |
| 72 | Khảo sát | `survey_responses` | Phản hồi khảo sát |
| | **18 — Marketing mở rộng** | | |
| 73 | Marketing | `landing_pages` | Landing page |
| 74 | Marketing | `marketing_campaigns` | Chiến dịch marketing tổng hợp |
| 75 | Marketing | `content_calendar_items` | Nội dung lên lịch đăng |
| 76 | Marketing | `referral_programs` | Chương trình giới thiệu |
| 77 | Marketing | `referrals` | Lượt giới thiệu cụ thể |
| 78 | Marketing | `ab_tests` | A/B Testing |
| 79 | Marketing | `ab_test_variants` | Biến thể A/B test |
| | **19 — Tài liệu & Kiến thức** | | |
| 80 | Tài liệu | `documents` | Tài liệu (hợp đồng, proposal, …) |
| 81 | Kiến thức | `knowledge_categories` | Danh mục bài viết kiến thức |
| 82 | Kiến thức | `knowledge_articles` | Bài viết trong cơ sở kiến thức |
| | **20 — Trí tuệ khách hàng** | | |
| 83 | Phân khúc | `customer_segments` | Phân khúc khách hàng |
| 84 | Hành trình | `customer_journeys` | Hành trình khách hàng |
| 85 | Hành trình | `journey_touchpoints` | Điểm chạm trong hành trình |
| 86 | Account Planning | `account_plans` | Kế hoạch tài khoản trọng điểm |
| 87 | Deal Room | `deal_rooms` | Phòng deal ảo |
| 88 | Deal Room | `deal_room_documents` | Tài liệu trong Deal Room |
| | **21 — Truyền thông mở rộng** | | |
| 89 | Social | `social_mentions` | Lượt đề cập trên mạng xã hội |
| 90 | Live Chat | `live_chat_configs` | Cấu hình live chat widget |
| 91 | VoIP | `voip_call_logs` | Lịch sử cuộc gọi VoIP |
| 92 | Meeting | `meeting_recordings` | Ghi nhận cuộc họp & phân tích AI |
| | **22 — AI & Tự động hoá** | | |
| 93 | Chatbot | `chatbot_training_data` | Dữ liệu huấn luyện chatbot AI |
| 94 | AI Models | `ai_models` | Mô hình AI đang triển khai |
| 95 | Data Enrichment | `data_enrichment_jobs` | Công việc làm giàu dữ liệu |
| | **23 — Đăng ký & Tiền tệ** | | |
| 96 | Đăng ký | `subscriptions` | Đăng ký dịch vụ của khách hàng |
| 97 | Tiền tệ | `currency_exchange_rates` | Tỉ giá hối đoái |
| | **24 — Gamification** | | |
| 98 | Gamification | `gamification_badges` | Định nghĩa huy hiệu |
| 99 | Gamification | `gamification_achievements` | Thành tích đã đạt của nhân viên |
| | **25 — Tích hợp & API** | | |
| 100 | Tích hợp | `integrations` | Tích hợp hệ thống bên ngoài |
| 101 | API | `api_keys` | API key cho Dev Portal |
| 102 | API | `api_usage_logs` | Log sử dụng API |
| | **26 — Tuân thủ, SLA & Trust** | | |
| 103 | Tuân thủ | `compliance_checks` | Kiểm tra tuân thủ |
| 104 | SLA | `sla_policies` | Chính sách SLA |
| 105 | Trust | `trust_certifications` | Chứng nhận bảo mật & tin cậy |
| 106 | Dashboard | `custom_dashboards` | Dashboard tuỳ chỉnh |

---

## Tổng kết

| Chỉ số | Giá trị |
|--------|---------|
| **Tổng số bảng** | **106** |
| **Số phân hệ** | **26** |
| **Số file schema** | **26** (01 → 26) |
| **Standard Mixins** | `id`, `tenant_id`, `version`, `created_at`, `updated_at`, `deleted_at` |
| **Soft Delete** | Mọi bảng, cấm `DELETE` vật lý |
| **Primary Key** | UUID v7 |
| **Multi-tenant** | Mọi bảng có `tenant_id` FK → `tenants(id)` |
| **Partial Indexes** | `WHERE deleted_at IS NULL` cho mọi index |

---

## Danh sách file Schema

| File | Phân hệ |
|------|---------|
| `01-system.schema.md` | Hệ thống lõi |
| `02-crm-core.schema.md` | CRM Cốt lõi |
| `03-lead-management.schema.md` | Quản lý Lead |
| `04-communication.schema.md` | Truyền thông |
| `05-task-calendar.schema.md` | Công việc & Lịch |
| `06-products-quotations.schema.md` | Sản phẩm & Báo giá |
| `07-contracts.schema.md` | Hợp đồng |
| `08-commission-forecast.schema.md` | Hoa hồng & Dự báo |
| `09-support.schema.md` | Hỗ trợ khách hàng |
| `10-vendor-partner.schema.md` | Nhà cung cấp & Đối tác |
| `11-customer-success.schema.md` | Customer Success |
| `12-analytics.schema.md` | Phân tích & Trí tuệ |
| `13-territory-quota.schema.md` | Lãnh thổ & Chỉ tiêu |
| `14-sales-enablement.schema.md` | Sales Enablement |
| `15-inventory-events-team.schema.md` | Kho, Sự kiện & Nhân sự |
| `16-settings.schema.md` | Cấu hình & Quản trị |
| `17-forms-surveys.schema.md` | Biểu mẫu & Khảo sát |
| `18-marketing-extended.schema.md` | Marketing mở rộng |
| `19-documents-knowledge.schema.md` | Tài liệu & Kiến thức |
| `20-customer-intelligence.schema.md` | Trí tuệ khách hàng |
| `21-communication-extended.schema.md` | Truyền thông mở rộng |
| `22-ai-automation.schema.md` | AI & Tự động hoá |
| `23-subscriptions-currency.schema.md` | Đăng ký & Tiền tệ |
| `24-gamification.schema.md` | Gamification |
| `25-integrations-api.schema.md` | Tích hợp & API |
| `26-compliance-sla.schema.md` | Tuân thủ, SLA & Trust Center |
