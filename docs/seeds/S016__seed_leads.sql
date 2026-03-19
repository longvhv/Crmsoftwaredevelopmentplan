-- ============================================================
-- S016: Seed Data — Leads (V003)
-- Phụ thuộc: S001 (tenants), S002 (employees), S003 (contacts, deals)
-- Migration: V003 (leads table)
-- ============================================================

-- Tenant: 018d0001-0001-7001-8001-000000000001
-- Employees:
--   An:     018d0005-0001-7001-8001-000000000001
--   Bình:   018d0005-0001-7001-8001-000000000002
--   Cường:  018d0005-0001-7001-8001-000000000003
--   Dương:  018d0005-0001-7001-8001-000000000004
--   Giang:  018d0005-0001-7001-8001-000000000006
--   Nova:   018d0005-0001-7001-8001-000000000011
-- Contacts (đã convert):
--   Tùng:   018d0006-0001-7001-8001-000000000001
--   Hằng:   018d0006-0001-7001-8001-000000000002
-- Deals (đã convert):
--   Deal#1: 018d0007-0001-7001-8001-000000000001
--   Deal#3: 018d0007-0001-7001-8001-000000000003

-- ============================================================
-- Leads: 20 bản ghi trải đều các status, source, score
-- ============================================================
INSERT INTO leads (id, tenant_id, name, email, phone, company, job_title, source, status, score, score_factors, assigned_to, converted_contact_id, converted_deal_id, notes, custom_fields, version, created_at, updated_at) VALUES

  -- === NEW (4 leads) ===
  ('018d00a0-0001-7001-8001-000000000001', '018d0001-0001-7001-8001-000000000001',
   'Hoàng Văn Kiên', 'kien.hoang@logismart.vn', '0971234567',
   'LogiSmart Vietnam', 'Giám đốc Vận hành',
   'website', 'new', 35,
   '{"website_visit": 15, "page_views": 10, "form_submit": 10}',
   '018d0005-0001-7001-8001-000000000001', NULL, NULL,
   'Đăng ký qua form landing page campaign Q1/2026.',
   '{"utm_source": "google", "utm_campaign": "q1-2026-erp"}',
   1, '2026-02-28T09:30:00Z', '2026-02-28T09:30:00Z'),

  ('018d00a0-0001-7001-8001-000000000002', '018d0001-0001-7001-8001-000000000001',
   'Đỗ Thị Ngọc Hà', 'ha.do@greentech.vn', '0982345678',
   'GreenTech Solutions', 'HR Manager',
   'social', 'new', 20,
   '{"linkedin_engagement": 10, "profile_view": 10}',
   '018d0005-0001-7001-8001-000000000003', NULL, NULL,
   'Tương tác qua LinkedIn — quan tâm module HR.',
   '{"linkedin_url": "https://linkedin.com/in/hangoc"}',
   1, '2026-03-01T14:15:00Z', '2026-03-01T14:15:00Z'),

  ('018d00a0-0001-7001-8001-000000000003', '018d0001-0001-7001-8001-000000000001',
   'Bùi Minh Quân', 'quan.bui@mediaviet.com', '0993456789',
   'MediaViet Corp', 'Marketing Director',
   'ad', 'new', 28,
   '{"ad_click": 8, "whitepaper_download": 15, "email_open": 5}',
   NULL, NULL, NULL,
   'Click quảng cáo Facebook Ads → download whitepaper. Chưa assign.',
   '{"ad_id": "fb_camp_2026q1_001"}',
   1, '2026-03-02T10:00:00Z', '2026-03-02T10:00:00Z'),

  ('018d00a0-0001-7001-8001-000000000004', '018d0001-0001-7001-8001-000000000001',
   'Trương Thị Lan Anh', 'lananh.truong@pharmastar.vn', '0904567890',
   'PharmaStar', 'IT Manager',
   'event', 'new', 42,
   '{"event_attend": 20, "booth_visit": 12, "card_scan": 10}',
   '018d0005-0001-7001-8001-000000000006', NULL, NULL,
   'Gặp tại Tech Summit Hà Nội 2026 — rất quan tâm CRM + Inventory.',
   '{"event_name": "Tech Summit HN 2026", "booth_interaction_min": 15}',
   1, '2026-03-03T08:20:00Z', '2026-03-03T08:20:00Z'),

  -- === CONTACTED (4 leads) ===
  ('018d00a0-0001-7001-8001-000000000005', '018d0001-0001-7001-8001-000000000001',
   'Ngô Đức Thịnh', 'thinh.ngo@autoparts.vn', '0915678901',
   'AutoParts Vietnam', 'Purchasing Manager',
   'cold-call', 'contacted', 45,
   '{"cold_call_response": 20, "email_reply": 15, "company_size": 10}',
   '018d0005-0001-7001-8001-000000000002', NULL, NULL,
   'Cold call lần 1 — quan tâm module Quản lý Kho. Hẹn gọi lại 10/03.',
   '{"call_duration_sec": 480, "next_call": "2026-03-10"}',
   2, '2026-02-20T11:00:00Z', '2026-02-25T14:30:00Z'),

  ('018d00a0-0001-7001-8001-000000000006', '018d0001-0001-7001-8001-000000000001',
   'Lý Thanh Sơn', 'son.ly@buildmaster.vn', '0926789012',
   'BuildMaster JSC', 'CFO',
   'referral', 'contacted', 55,
   '{"referral_score": 25, "email_engagement": 15, "company_revenue": 15}',
   '018d0005-0001-7001-8001-000000000001', NULL, NULL,
   'Được giới thiệu bởi Nguyễn Thanh Tùng (TechCorp). Đã gửi email giới thiệu.',
   '{"referrer_contact_id": "018d0006-0001-7001-8001-000000000001"}',
   2, '2026-02-15T09:00:00Z', '2026-02-22T16:45:00Z'),

  ('018d00a0-0001-7001-8001-000000000007', '018d0001-0001-7001-8001-000000000001',
   'Phạm Thị Thanh Hương', 'huong.pham@freshfoods.vn', '0937890123',
   'FreshFoods Việt Nam', 'Operations Director',
   'email', 'contacted', 48,
   '{"email_sequence_open": 20, "link_click": 15, "case_study_view": 13}',
   '018d0005-0001-7001-8001-000000000004', NULL, NULL,
   'Mở 4/5 email trong sequence. Đã click link demo 2 lần.',
   '{"sequence_id": "seq_onboard_2026", "emails_opened": 4}',
   2, '2026-02-10T08:00:00Z', '2026-02-28T10:00:00Z'),

  ('018d00a0-0001-7001-8001-000000000008', '018d0001-0001-7001-8001-000000000001',
   'Vũ Hoàng Nam', 'nam.vu@smartedu.vn', '0948901234',
   'SmartEdu Academy', 'Founder & CEO',
   'partner', 'contacted', 62,
   '{"partner_intro": 25, "demo_request": 20, "company_fit": 17}',
   '018d0005-0001-7001-8001-000000000003', NULL, NULL,
   'Đối tác EduTech giới thiệu. Đã schedule demo 07/03.',
   '{"partner_name": "EduTech Vietnam", "demo_date": "2026-03-07"}',
   3, '2026-02-05T10:30:00Z', '2026-03-01T09:00:00Z'),

  -- === QUALIFIED (4 leads) ===
  ('018d00a0-0001-7001-8001-000000000009', '018d0001-0001-7001-8001-000000000001',
   'Đặng Minh Trí', 'tri.dang@cyberguard.vn', '0959012345',
   'CyberGuard Security', 'VP Sales',
   'website', 'qualified', 78,
   '{"demo_completed": 25, "pricing_page_view": 20, "rfp_submitted": 18, "budget_confirmed": 15}',
   '018d0005-0001-7001-8001-000000000001', NULL, NULL,
   'Demo xong, rất ấn tượng. Budget approved Q2. Đang negotiate pricing.',
   '{"budget_range": "200M-500M VND", "timeline": "Q2-2026"}',
   4, '2026-01-20T09:00:00Z', '2026-03-02T15:00:00Z'),

  ('018d00a0-0001-7001-8001-000000000010', '018d0001-0001-7001-8001-000000000001',
   'Nguyễn Thị Bích Ngọc', 'ngoc.nguyen@luxurygroup.vn', '0960123456',
   'Luxury Group Vietnam', 'Digital Transformation Lead',
   'event', 'qualified', 85,
   '{"event_keynote": 20, "1on1_meeting": 25, "technical_eval": 20, "champion_identified": 20}',
   '018d0005-0001-7001-8001-000000000006', NULL, NULL,
   'Key contact từ sự kiện CRM Summit. Đã technical evaluation OK. Champion nội bộ mạnh.',
   '{"decision_makers": ["CEO", "CTO"], "competitors_evaluated": ["Salesforce", "HubSpot"]}',
   5, '2026-01-10T08:00:00Z', '2026-03-04T11:00:00Z'),

  ('018d00a0-0001-7001-8001-000000000011', '018d0001-0001-7001-8001-000000000001',
   'Trần Quốc Huy', 'huy.tran@steelworks.vn', '0911234567',
   'SteelWorks Industries', 'General Manager',
   'cold-call', 'qualified', 72,
   '{"multiple_meetings": 20, "needs_analysis": 20, "proposal_sent": 17, "positive_feedback": 15}',
   '018d0005-0001-7001-8001-000000000002', NULL, NULL,
   'Đã gặp 3 lần. Proposal gửi 01/03. Feedback tích cực, chờ board approve.',
   '{"meetings_count": 3, "proposal_value": 350000000}',
   4, '2026-01-25T10:00:00Z', '2026-03-03T16:00:00Z'),

  ('018d00a0-0001-7001-8001-000000000012', '018d0001-0001-7001-8001-000000000001',
   'Lê Hoài Phương', 'phuong.le@travelease.vn', '0922345678',
   'TravelEase Corporation', 'Head of Technology',
   'referral', 'qualified', 80,
   '{"referral_quality": 25, "poc_completed": 25, "integration_tested": 15, "contract_draft": 15}',
   '018d0005-0001-7001-8001-000000000011', NULL, NULL,
   'POC xong — integration test thành công. Đang draft hợp đồng.',
   '{"poc_duration_days": 14, "integrations_tested": ["PMS", "Booking API"]}',
   5, '2026-01-05T09:00:00Z', '2026-03-05T10:00:00Z'),

  -- === CONVERTED (4 leads — có link tới contact/deal) ===
  ('018d00a0-0001-7001-8001-000000000013', '018d0001-0001-7001-8001-000000000001',
   'Nguyễn Thanh Tùng', 'tung.nguyen@techcorp.vn', '0912345678',
   'TechCorp Vietnam', 'CTO',
   'referral', 'converted', 92,
   '{"full_pipeline": 25, "champion": 25, "budget_approved": 22, "contract_signed": 20}',
   '018d0005-0001-7001-8001-000000000001',
   '018d0006-0001-7001-8001-000000000001',
   '018d0007-0001-7001-8001-000000000001',
   'Converted thành Contact + Deal. Hợp đồng ký 15/02/2026.',
   '{"conversion_date": "2026-02-15", "deal_value": 500000000}',
   6, '2025-11-01T08:00:00Z', '2026-02-15T14:00:00Z'),

  ('018d00a0-0001-7001-8001-000000000014', '018d0001-0001-7001-8001-000000000001',
   'Trần Minh Hằng', 'hang.tran@financeplus.vn', '0923456789',
   'FinancePlus', 'VP Engineering',
   'website', 'converted', 95,
   '{"inbound_quality": 25, "fast_cycle": 25, "enterprise_fit": 25, "multi_year_deal": 20}',
   '018d0005-0001-7001-8001-000000000006',
   '018d0006-0001-7001-8001-000000000002',
   '018d0007-0001-7001-8001-000000000003',
   'Fast close — 45 ngày từ lead → deal. Multi-year contract.',
   '{"conversion_date": "2026-01-20", "deal_value": 800000000, "contract_years": 3}',
   7, '2025-10-15T10:00:00Z', '2026-01-20T16:00:00Z'),

  ('018d00a0-0001-7001-8001-000000000015', '018d0001-0001-7001-8001-000000000001',
   'Cao Văn Đức', 'duc.cao@sungroup.vn', '0933456789',
   'Sun Group', 'IT Director',
   'event', 'converted', 88,
   '{"event_connection": 20, "executive_sponsor": 25, "pilot_success": 23, "signed": 20}',
   '018d0005-0001-7001-8001-000000000003', NULL, NULL,
   'Converted sau pilot 30 ngày. Executive sponsor mạnh.',
   '{"conversion_date": "2026-02-01", "pilot_duration_days": 30}',
   5, '2025-12-01T08:00:00Z', '2026-02-01T10:00:00Z'),

  ('018d00a0-0001-7001-8001-000000000016', '018d0001-0001-7001-8001-000000000001',
   'Mai Thị Hồng Nhung', 'nhung.mai@cosmovn.com', '0944567890',
   'CosmoVN Beauty', 'CEO',
   'partner', 'converted', 90,
   '{"partner_qualified": 25, "fast_evaluation": 25, "contract_signed": 20, "upsell_potential": 20}',
   '018d0005-0001-7001-8001-000000000001', NULL, NULL,
   'Partner channel conversion. Upsell opportunity Q3.',
   '{"conversion_date": "2026-01-30", "partner_commission_pct": 15}',
   6, '2025-11-20T09:00:00Z', '2026-01-30T15:00:00Z'),

  -- === UNQUALIFIED (2 leads) ===
  ('018d00a0-0001-7001-8001-000000000017', '018d0001-0001-7001-8001-000000000001',
   'Phan Hữu Tài', 'tai.phan@smallshop.vn', '0955678901',
   'Small Shop Online', 'Owner',
   'ad', 'unqualified', 12,
   '{"ad_click_only": 8, "no_budget": 0, "too_small": 4}',
   '018d0005-0001-7001-8001-000000000004', NULL, NULL,
   'Doanh nghiệp quá nhỏ (<5 nhân viên), không có budget cho CRM enterprise.',
   '{"disqualify_reason": "company_too_small", "employee_count": 3}',
   2, '2026-02-18T11:00:00Z', '2026-02-20T09:00:00Z'),

  ('018d00a0-0001-7001-8001-000000000018', '018d0001-0001-7001-8001-000000000001',
   'Đinh Thế Vinh', 'vinh.dinh@freelancer.com', '0966789012',
   NULL, 'Freelance Consultant',
   'website', 'unqualified', 8,
   '{"form_submit": 5, "no_company": 0, "wrong_icp": 3}',
   NULL, NULL, NULL,
   'Freelancer cá nhân, không phải ICP. Tự động DQ bởi AI scoring.',
   '{"disqualify_reason": "not_icp", "ai_auto_dq": true}',
   1, '2026-03-01T16:00:00Z', '2026-03-01T16:05:00Z'),

  -- === LOST (2 leads) ===
  ('018d00a0-0001-7001-8001-000000000019', '018d0001-0001-7001-8001-000000000001',
   'Huỳnh Minh Khoa', 'khoa.huynh@bigretail.vn', '0977890123',
   'BigRetail Corporation', 'VP Operations',
   'cold-call', 'lost', 55,
   '{"initial_interest": 20, "competitor_won": 0, "budget_freeze": 15, "timing_bad": 20}',
   '018d0005-0001-7001-8001-000000000002', NULL, NULL,
   'Budget bị freeze Q1/2026. Chọn Salesforce vì đã có ecosystem. Revisit Q4.',
   '{"lost_reason": "competitor_won", "competitor": "Salesforce", "revisit_date": "2026-10-01"}',
   4, '2025-12-10T10:00:00Z', '2026-02-28T17:00:00Z'),

  ('018d00a0-0001-7001-8001-000000000020', '018d0001-0001-7001-8001-000000000001',
   'Tạ Quang Hải', 'hai.ta@construct360.vn', '0988901234',
   'Construct360', 'General Director',
   'referral', 'lost', 48,
   '{"referral_score": 20, "meetings_done": 15, "no_decision": 13}',
   '018d0005-0001-7001-8001-000000000003', NULL, NULL,
   'Sau 3 tháng nurture, không có decision maker push. Project bị hủy nội bộ.',
   '{"lost_reason": "no_decision", "nurture_duration_days": 90}',
   3, '2025-11-15T09:00:00Z', '2026-02-15T14:00:00Z');

-- ============================================================
-- Verify count
-- ============================================================
-- SELECT status, COUNT(*) FROM leads WHERE deleted_at IS NULL GROUP BY status;
-- Expected: new=4, contacted=4, qualified=4, converted=4, unqualified=2, lost=2 → Total: 20