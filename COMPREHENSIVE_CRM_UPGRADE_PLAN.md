# KẾ HOẠCH NÂNG CẤP TOÀN DIỆN HỆ THỐNG CRM
## 🎯 Mục tiêu: Đảm bảo TẤT CẢ 96 trang CRM đều có đầy đủ tính năng chuyên nghiệp

---

## 📊 TỔNG QUAN HỆ THỐNG

### Tổng số trang CRM: **96 trang**

### Phân loại theo nhóm chức năng:

#### **A. Core CRM (14 trang) — Ưu tiên CAO**
Các trang cốt lõi của CRM, quản lý dữ liệu chính
1. ContactsPage ✅ **HOÀN THÀNH** (có DataTable, Card view, CRUD, filters, pagination, inline edit)
2. PipelinePage ✅ **HOÀN THÀNH** (có DnD, Table view, CRUD, filters)
3. TeamPage ✅ **HOÀN THÀNH** (có DataTable, Card view, CRUD, filters)
4. ActivitiesPage ✅ **HOÀN THÀNH** (có Timeline, Table view, pagination)
5. ProductCatalogPage ✅ **HOÀN THÀNH** (có Card, Table view, CRUD, filters)
6. TicketSupportPage ✅ **HOÀN THÀNH** (có Table, Card view, CRUD, filters)
7. CrmDashboardPage ⚠️ **CẦN KIỂM TRA** (Dashboard - ít cần CRUD)
8. ContactDetailPage ⚠️ **CẦN KIỂM TRA** (Detail page - có tabs)
9. DealDetailPage ⚠️ **CẦN KIỂM TRA** (Detail page - có tabs)
10. EmployeeDetailPage ⚠️ **CẦN KIỂM TRA** (Detail page - có tabs)
11. CalendarPage ⚠️ **CẦN NÂNG CẤP** (Calendar view - cần add table view)
12. TaskBoardPage ⚠️ **CẦN NÂNG CẤP** (Kanban - cần add table view)
13. ReportsPage ⚠️ **CẦN NÂNG CẤP** (Reports - visualization)
14. CrmSettingsPage ⚠️ **CẦN KIỂM TRA** (Settings - form based)

#### **B. Sales & Marketing (18 trang) — Ưu tiên TRUNG BÌNH**
15. LeadInboxPage 🔴 **CẦN NÂNG CẤP**
16. EmailTemplatesPage 🔴 **CẦN NÂNG CẤP**
17. EmailSequenceBuilderPage 🔴 **CẦN NÂNG CẤP**
18. MarketingCampaignPage 🔴 **CẦN NÂNG CẤP**
19. SmsCampaignPage 🔴 **CẦN NÂNG CẤP**
20. ContentCalendarPage 🔴 **CẦN NÂNG CẤP**
21. FormBuilderPage 🔴 **CẦN NÂNG CẤP**
22. LandingPageBuilderPage 🔴 **CẦN NÂNG CẤP**
23. SocialMediaMonitorPage 🔴 **CẦN NÂNG CẤP**
24. ABTestingPage 🔴 **CẦN NÂNG CẤP**
25. ReferralProgramPage 🔴 **CẦN NÂNG CẤP**
26. CustomerSegmentationPage 🔴 **CẦN NÂNG CẤP**
27. CustomerJourneyPage 🔴 **CẦN NÂNG CẤP**
28. CampaignRoiPage 🔴 **CẦN NÂNG CẤP**
29. LeaderboardPage 🔴 **CẦN NÂNG CẤP**
30. GamificationPage 🔴 **CẦN NÂNG CẤP**
31. SalesPlaybookPage 🔴 **CẦN NÂNG CẤP**
32. WinLossAnalysisPage 🔴 **CẦN NÂNG CẤP**

#### **C. Analytics & Intelligence (12 trang)**
33. AIInsightsPage 🔴 **CẦN NÂNG CẤP**
34. ForecastPage 🔴 **CẦN NÂNG CẤP**
35. PredictiveAnalyticsPage 🔴 **CẦN NÂNG CẤP**
36. ChurnPredictionPage 🔴 **CẦN NÂNG CẤP**
37. CustomerHealthPage 🔴 **CẦN NÂNG CẤP**
38. RevenueAttributionPage 🔴 **CẦN NÂNG CẤP**
39. RevenueIntelligencePage 🔴 **CẦN NÂNG CẤP**
40. RevenueLeakagePage 🔴 **CẦN NÂNG CẤP**
41. RevenueWaterfallPage 🔴 **CẦN NÂNG CẤP**
42. CompetitorAnalysisPage 🔴 **CẦN NÂNG CẤP**
43. MeetingIntelligencePage 🔴 **CẦN NÂNG CẤP**
44. DataEnrichmentPage 🔴 **CẦN NÂNG CẤP**

#### **D. Operations & Management (16 trang)**
45. ContractManagementPage 🔴 **CẦN NÂNG CẤP**
46. QuotationBuilderPage 🔴 **CẦN NÂNG CẤP**
47. CpqPage 🔴 **CẦN NÂNG CẤP**
48. SubscriptionManagementPage 🔴 **CẦN NÂNG CẤP**
49. RenewalPipelinePage 🔴 **CẦN NÂNG CẤP**
50. DocumentManagementPage 🔴 **CẦN NÂNG CẤP**
51. VendorManagementPage 🔴 **CẦN NÂNG CẤP**
52. InventoryManagementPage 🔴 **CẦN NÂNG CẤP**
53. TerritoryManagementPage 🔴 **CẦN NÂNG CẤP**
54. AccountPlanningPage 🔴 **CẦN NÂNG CẤP**
55. DealRoomPage 🔴 **CẦN NÂNG CẤP**
56. ApprovalWorkflowPage 🔴 **CẦN NÂNG CẤP**
57. CommissionCalculatorPage 🔴 **CẦN NÂNG CẤP**
58. QuotaManagementPage 🔴 **CẦN NÂNG CẤP**
59. TeamCapacityPage 🔴 **CẦN NÂNG CẤP**
60. SLATrackingPage 🔴 **CẦN NÂNG CẤP**

#### **E. Integration & Automation (11 trang)**
61. IntegrationHubPage 🔴 **CẦN NÂNG CẤP**
62. AutomationRulesPage 🔴 **CẦN NÂNG CẤP**
63. WorkflowBuilderPage 🔴 **CẦN NÂNG CẤP**
64. WebhookManagerPage 🔴 **CẦN NÂNG CẤP**
65. ApiExplorerPage 🔴 **CẦN NÂNG CẤP**
66. DataImportExportPage 🔴 **CẦN NÂNG CẤP**
67. DataImportWizardPage 🔴 **CẦN NÂNG CẤP**
68. PartnerMarketplacePage 🔴 **CẦN NÂNG CẤP**
69. PartnerPortalPage 🔴 **CẦN NÂNG CẤP**
70. PartnerScorecardPage 🔴 **CẦN NÂNG CẤP**
71. EventManagerPage 🔴 **CẦN NÂNG CẤP**

#### **F. AI & Advanced Features (10 trang)**
72. AiChatbotTrainingPage 🔴 **CẦN NÂNG CẤP**
73. AiCopilotSettingsPage 🔴 **CẦN NÂNG CẤP**
74. AiTrainingDashboardPage 🔴 **CẦN NÂNG CẤP**
75. VoipDialerPage 🔴 **CẦN NÂNG CẤP**
76. LiveChatConfigPage 🔴 **CẦN NÂNG CẤP**
77. NPSTrackerPage 🔴 **CẦN NÂNG CẤP**
78. SurveyBuilderPage 🔴 **CẦN NÂNG CẤP**
79. Customer360Page 🔴 **CẦN NÂNG CẤP**
80. FeedbackWallPage 🔴 **CẦN NÂNG CẤP**
81. OnboardingWorkflowPage 🔴 **CẦN NÂNG CẤP**

#### **G. Admin & Configuration (15 trang)**
82. RBACPage 🔴 **CẦN NÂNG CẤP**
83. CustomFieldsPage 🔴 **CẦN NÂNG CẤP**
84. NotificationPreferencesPage 🔴 **CẦN NÂNG CẤP**
85. UserProfilePage 🔴 **CẦN KIỂM TRA** (Profile - form based)
86. AuditLogPage 🔴 **CẦN NÂNG CẤP**
87. AuditTrailPage 🔴 **CẦN NÂNG CẤP**
88. CustomDashboardPage 🔴 **CẦN NÂNG CẤP**
89. GoalTrackingPage 🔴 **CẦN NÂNG CẤP**
90. MultiCurrencyPage 🔴 **CẦN NÂNG CẤP**
91. ComplianceDashboardPage 🔴 **CẦN NÂNG CẤP**
92. TrustCenterPage 🔴 **CẦN KIỂM TRA** (Info page)
93. DevPortalPage 🔴 **CẦN NÂNG CẤP**
94. KnowledgeBasePage 🔴 **CẦN NÂNG CẤP**
95. CustomerPortalPage 🔴 **CẦN KIỂM TRA** (Portal - dashboard style)
96. DependencyGraphPage 🔴 **CẦN NÂNG CẤP**

---

## 🎯 TIÊU CHUẨN HOÀN THÀNH CHO MỖI TRANG

### **Checklist 8 tiêu chí bắt buộc:**

#### ✅ **1. CRUD Operations** (nếu phù hợp)
- [ ] Create: Modal/Form để tạo mới
- [ ] Read: Hiển thị danh sách/detail
- [ ] Update: Inline edit hoặc modal edit
- [ ] Delete: Xóa đơn lẻ + bulk delete

#### ✅ **2. DataTable Integration**
- [ ] Sử dụng shared DataTable component
- [ ] Định nghĩa ColumnDef[] đầy đủ
- [ ] Default sort field hợp lý
- [ ] storageKey unique cho localStorage

#### ✅ **3. Filtering System**
- [ ] FilterBar component hoặc custom filters
- [ ] Tối thiểu 2-3 filters phù hợp với domain
- [ ] Clear filters button
- [ ] Filter count display

#### ✅ **4. Pagination**
- [ ] Tích hợp PaginationBar (qua DataTable)
- [ ] Page size options (10, 25, 50, 100)
- [ ] LocalStorage persistence
- [ ] First/Last/Prev/Next navigation

#### ✅ **5. Sorting**
- [ ] Column headers clickable
- [ ] Visual sort indicators (arrow up/down)
- [ ] Multi-column sort support
- [ ] sortValue functions cho complex data

#### ✅ **6. Column Visibility**
- [ ] ColumnVisibilityDropdown
- [ ] Tối thiểu 30% columns có thể ẩn/hiện
- [ ] Default hidden cho columns ít quan trọng
- [ ] Reset to default option

#### ✅ **7. Inline Editing** (cho trang quan trọng)
- [ ] Editable cells cho fields phù hợp
- [ ] Enter to save, Escape to cancel
- [ ] Visual feedback (border highlight)
- [ ] onInlineEdit handler

#### ✅ **8. View Modes** (cho trang quan trọng)
- [ ] ViewToggle component
- [ ] Tối thiểu 2 views (Table + Card/List/Kanban)
- [ ] LocalStorage persistence
- [ ] Responsive cho mobile

---

## 📋 KẾ HOẠCH CHI TIẾT TỪNG TRANG

### **PHASE 1: HOÀN THIỆN CORE CRM (Trang 7-14)**

#### **P1.01 — CalendarPage nâng cấp** (3 bước)
**Hiện trạng:** Có calendar view, cần thêm table view
**Yêu cầu:**
1. Thêm ViewToggle: Calendar / Table / List
2. Tạo CALENDAR_COLUMNS: ColumnDef<CalendarEvent>[]
   - Type (icon + label)
   - Title
   - Date + Time
   - Contact/Deal refs
   - Assigned To
   - Priority
   - Location/Online
   - AI generated badge
3. Table view với DataTable component
4. List view timeline style tương tự ActivitiesPage
5. Filters: type, assignedTo, date range, priority
6. CRUD: Create event modal (đã có), inline edit, delete
7. Pagination cho table/list view

**Ước tính:** ~120 dòng code mới

---

#### **P1.02 — TaskBoardPage nâng cấp** (3 bước)
**Hiện trạng:** Có Kanban board, cần thêm table view
**Yêu cầu:**
1. Thêm ViewToggle: Board / Table / List
2. Tạo TASK_COLUMNS: ColumnDef<Task>[]
   - Title
   - Status (badge)
   - Priority (badge với màu)
   - Category
   - Assignee
   - Due Date
   - Contact/Deal refs
   - AI suggested badge
3. Table view với full CRUD
4. Filters: status, priority, category, assignee
5. Inline edit: title, status, priority, assignee, dueDate
6. Bulk actions: delete, change status, reassign

**Ước tính:** ~140 dòng code mới

---

#### **P1.03 — ReportsPage nâng cấp** (2 bước)
**Hiện trạng:** Có charts, cần thêm raw data table
**Yêu cầu:**
1. Tab switching: Charts / Data Table
2. Data export option (CSV/Excel mock)
3. Filters: date range, deal stage, assignee, product
4. Table view cho deal breakdown
5. Column visibility cho metrics
6. Sorting by revenue, probability, etc.

**Ước tính:** ~80 dòng code mới

---

### **PHASE 2: SALES & MARKETING (Trang 15-32) — 18 trang**

#### **P2.01 — LeadInboxPage nâng cấp**
**Hiện trạng:** Có basic list, cần DataTable
**Yêu cầu:**
1. ViewToggle: Table / Card
2. LEAD_COLUMNS: score, source, status, assignee, createdDate, lastActivity
3. Filters: score range, source, status, assignee
4. Inline edit: status, assignee, tags
5. Bulk actions: assign, qualify, disqualify, delete
6. Detail panel slide-in khi click row

**Ước tính:** ~150 dòng

---

#### **P2.02 — EmailTemplatesPage nâng cấp**
**Hiện trạng:** Có card view, cần table
**Yêu cầu:**
1. ViewToggle: Card / Table
2. TEMPLATE_COLUMNS: name, category, subject, usage, lastModified
3. Filters: category, status (draft/active)
4. Preview modal
5. Clone template action
6. Usage statistics

**Ước tính:** ~120 dòng

---

#### **P2.03 — EmailSequenceBuilderPage nâng cấp**
**Hiện trạng:** Có list, cần builder view
**Yêu cầu:**
1. ViewToggle: List / Builder
2. SEQUENCE_COLUMNS: name, steps, active contacts, conversion rate, status
3. Filters: status, performance (high/medium/low)
4. Builder view: visual step editor
5. Analytics per sequence

**Ước tính:** ~180 dòng

---

#### **P2.04 — MarketingCampaignPage nâng cấp**
**Hiện trạng:** Có card view
**Yêu cầu:**
1. ViewToggle: Card / Table / Timeline
2. CAMPAIGN_COLUMNS: name, type, status, budget, spent, roi, startDate, endDate
3. Filters: status, channel, dateRange, performance
4. Performance metrics visualization
5. Detail page per campaign

**Ước tính:** ~150 dòng

---

#### **P2.05 — SmsCampaignPage nâng cấp**
**Yêu cầu:**
1. SMS_CAMPAIGN_COLUMNS: name, status, sent, delivered, clicked, revenue
2. Filters: status, dateRange
3. Delivery analytics
4. Template library integration

**Ước tính:** ~130 dòng

---

#### **P2.06 — ContentCalendarPage nâng cấp**
**Hiện trạng:** Có calendar view
**Yêu cầu:**
1. ViewToggle: Calendar / Table / Kanban
2. CONTENT_COLUMNS: title, type, channel, author, publishDate, status
3. Filters: type, channel, status, author
4. Drag-drop reschedule
5. Approval workflow

**Ước tính:** ~160 dòng

---

#### **P2.07 — FormBuilderPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: List / Builder
2. FORM_COLUMNS: name, submissions, conversion, lastSubmission, status
3. Filters: status, performance
4. Visual form builder
5. Submission analytics

**Ước tính:** ~140 dòng

---

#### **P2.08 — LandingPageBuilderPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: List / Builder / Preview
2. PAGE_COLUMNS: name, url, visits, conversions, conversionRate, status
3. Filters: status, performance
4. A/B test integration
5. Analytics dashboard

**Ước tính:** ~150 dòng

---

#### **P2.09 — SocialMediaMonitorPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Feed / Table / Analytics
2. MENTION_COLUMNS: platform, author, content, sentiment, engagement, timestamp
3. Filters: platform, sentiment, dateRange
4. Sentiment analysis visualization
5. Response management

**Ước tính:** ~140 dòng

---

#### **P2.10 — ABTestingPage nâng cấp**
**Yêu cầu:**
1. EXPERIMENT_COLUMNS: name, variants, status, confidence, winner, runtime
2. Filters: status, significance
3. Variant comparison view
4. Statistical significance calculator
5. Winner declaration workflow

**Ước tính:** ~150 dòng

---

#### **P2.11 — ReferralProgramPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Referrals / Rewards / Analytics
2. REFERRAL_COLUMNS: referrer, referred, status, value, date
3. Filters: status, dateRange, tier
4. Reward tracking
5. Payout management

**Ước tính:** ~130 dòng

---

#### **P2.12 — CustomerSegmentationPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Segments / Members / Builder
2. SEGMENT_COLUMNS: name, size, criteria, growth, value
3. Filters: type, size, activity
4. Visual segment builder
5. Export segment to campaign

**Ước tính:** ~160 dòng

---

#### **P2.13 — CustomerJourneyPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Journeys / Stages / Analytics
2. JOURNEY_COLUMNS: name, stages, contacts, conversionRate, avgDuration
3. Filters: industry, complexity
4. Visual journey builder
5. Bottleneck analysis

**Ước tính:** ~170 dòng

---

#### **P2.14 — CampaignRoiPage nâng cấp**
**Yêu cầu:**
1. CAMPAIGN_ROI_COLUMNS: name, spent, revenue, roas, roi, attribution
2. Filters: channel, dateRange, performance
3. Attribution model selector
4. ROI trend charts
5. Benchmark comparison

**Ước tính:** ~120 dòng

---

#### **P2.15 — LeaderboardPage nâng cấp**
**Yêu cầu:**
1. LEADERBOARD_COLUMNS: rank, name, metric, value, trend, achievement
2. Filters: period, metric, team
3. Gamification elements
4. Achievement showcase
5. Team vs individual toggle

**Ước tính:** ~110 dòng

---

#### **P2.16 — GamificationPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Players / Challenges / Rewards
2. PLAYER_COLUMNS: name, level, points, badges, rank
3. CHALLENGE_COLUMNS: name, type, points, participants, deadline
4. Filters: status, type, difficulty
5. Achievement tracking
6. Reward redemption

**Ước tính:** ~140 dòng

---

#### **P2.17 — SalesPlaybookPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Playbooks / Analytics
2. PLAYBOOK_COLUMNS: name, type, stage, usage, winRate, lastUpdated
3. Filters: type, stage, performance
4. Playbook content viewer
5. Usage analytics
6. Best practices library

**Ước tính:** ~130 dòng

---

#### **P2.18 — WinLossAnalysisPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Overview / Deals / Insights
2. DEAL_COLUMNS: name, outcome, reasons, value, competitor, closeDate
3. Filters: outcome, reason, competitor, dateRange
4. Reason categorization
5. Trend analysis
6. Competitor comparison

**Ước tính:** ~140 dòng

---

### **PHASE 3: ANALYTICS & INTELLIGENCE (Trang 33-44) — 12 trang**

#### **P3.01 — AIInsightsPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: All / Deals / Contacts / Activities
2. INSIGHT_COLUMNS: type, entity, prediction, confidence, impact, date
3. Filters: category, confidence, impact
4. Action recommendations
5. Feedback loop (accept/reject)
6. Historical accuracy tracking

**Ước tính:** ~150 dòng

---

#### **P3.02 — ForecastPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Chart / Table / Scenarios
2. FORECAST_COLUMNS: month, predicted, actual, variance, confidence
3. Filters: scenario, team, product
4. Scenario comparison
5. Drill-down to deals
6. Confidence intervals

**Ước tính:** ~140 dòng

---

#### **P3.03 — PredictiveAnalyticsPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Churn / Upsell / Cross-sell
2. PREDICTION_COLUMNS: customer, prediction, probability, value, nextAction
3. Filters: predictionType, probability, value
4. Model performance metrics
5. Action workflow trigger
6. Historical validation

**Ước tính:** ~160 dòng

---

#### **P3.04 — ChurnPredictionPage nâng cấp**
**Yêu cầu:**
1. CHURN_COLUMNS: customer, riskLevel, probability, value, signals, nextAction
2. Filters: riskLevel, segment, value
3. Early warning indicators
4. Retention playbook integration
5. Success tracking

**Ước tính:** ~130 dòng

---

#### **P3.05 — CustomerHealthPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: List / Matrix / Timeline
2. HEALTH_COLUMNS: customer, score, trend, usage, engagement, risk
3. Filters: healthScore, trend, segment
4. Health score breakdown
5. Alert configuration
6. Action history

**Ước tính:** ~150 dòng

---

#### **P3.06 — RevenueAttributionPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Table / Sankey / Timeline
2. ATTRIBUTION_COLUMNS: touchpoint, channel, contribution, deals, revenue
3. Filters: model, dateRange, channel
4. Model comparison
5. Journey visualization
6. Export report

**Ước tính:** ~140 dòng

---

#### **P3.07 — RevenueIntelligencePage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Overview / Breakdown / Trends
2. REVENUE_COLUMNS: segment, mrr, growth, churn, expansion, net
3. Filters: period, segment, product
4. Cohort analysis
5. Trend forecasting
6. Anomaly detection

**Ước tính:** ~150 dòng

---

#### **P3.08 — RevenueLeakagePage nâng cấp**
**Yêu cầu:**
1. LEAKAGE_COLUMNS: type, amount, impact, deal, reason, status
2. Filters: type, severity, status
3. Root cause analysis
4. Prevention recommendations
5. Recovery tracking

**Ước tính:** ~120 dòng

---

#### **P3.09 — RevenueWaterfallPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Chart / Table
2. MOVEMENT_COLUMNS: type, amount, deals, percentage, date
3. Filters: period, type
4. Waterfall visualization
5. Drill-down to deals
6. Period comparison

**Ước tính:** ~130 dòng

---

#### **P3.10 — CompetitorAnalysisPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Grid / Comparison / Matrix
2. COMPETITOR_COLUMNS: name, marketShare, strength, weakness, dealsLost, dealsWon
3. Filters: industry, tier
4. Feature comparison matrix
5. Win/loss analysis
6. Intelligence gathering

**Ước tính:** ~140 dòng

---

#### **P3.11 — MeetingIntelligencePage nâng cấp**
**Yêu cầu:**
1. MEETING_COLUMNS: title, participants, sentiment, actionItems, nextSteps, date
2. Filters: sentiment, dateRange, deal
3. Transcript viewer
4. Key topics extraction
5. Action item tracking
6. Talk ratio analysis

**Ước tính:** ~150 dòng

---

#### **P3.12 — DataEnrichmentPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Contacts / Companies / Jobs
2. ENRICHMENT_COLUMNS: entity, status, fieldsEnriched, confidence, source, date
3. Filters: status, source, quality
4. Bulk enrichment
5. Quality score
6. Auto-enrichment rules

**Ước tính:** ~140 dòng

---

### **PHASE 4: OPERATIONS & MANAGEMENT (Trang 45-60) — 16 trang**

#### **P4.01 — ContractManagementPage nâng cấp**
**Yêu cầu:**
1. CONTRACT_COLUMNS: name, client, value, startDate, endDate, status, renewal
2. Filters: status, client, value, dateRange
3. Inline edit: status, owner, tags
4. Renewal alerts
5. Document viewer
6. Version history

**Ước tính:** ~150 dòng

---

#### **P4.02 — QuotationBuilderPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: List / Builder
2. QUOTE_COLUMNS: quoteNo, client, value, items, status, validUntil
3. Filters: status, client, dateRange
4. Visual quote builder
5. Template library
6. PDF export
7. E-signature integration

**Ước tính:** ~180 dòng

---

#### **P4.03 — CpqPage (Configure-Price-Quote) nâng cấp**
**Yêu cầu:**
1. ViewToggle: Quotes / Products / Rules
2. CPQ_COLUMNS: quoteNo, product, configuration, price, discount, approval
3. Filters: status, product, approval
4. Product configurator
5. Pricing rules engine
6. Approval workflow
7. Quote analytics

**Ước tính:** ~200 dòng

---

#### **P4.04 — SubscriptionManagementPage nâng cấp**
**Yêu cầu:**
1. SUBSCRIPTION_COLUMNS: customer, plan, mrr, status, nextBilling, renewalDate
2. Filters: status, plan, mrr
3. Inline edit: plan, status
4. Upgrade/downgrade flow
5. Billing history
6. Churn prevention

**Ước tính:** ~160 dòng

---

#### **P4.05 — RenewalPipelinePage nâng cấp**
**Yêu cầu:**
1. RENEWAL_COLUMNS: account, value, renewalDate, probability, status, risk
2. Filters: timeframe, status, risk
3. Renewal health score
4. Action plan tracking
5. Success timeline
6. Expansion opportunities

**Ước tính:** ~140 dòng

---

#### **P4.06 — DocumentManagementPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Grid / List / Folders
2. DOCUMENT_COLUMNS: name, type, size, owner, modified, tags
3. Filters: type, owner, dateRange, tags
4. Folder structure
5. Version control
6. Access permissions
7. Preview modal

**Ước tính:** ~170 dòng

---

#### **P4.07 — VendorManagementPage nâng cấp**
**Yêu cầu:**
1. VENDOR_COLUMNS: name, category, rating, spent, contracts, lastOrder
2. Filters: category, rating, status
3. Vendor scorecard
4. Contract tracking
5. Performance metrics
6. Payment history

**Ước tính:** ~140 dòng

---

#### **P4.08 — InventoryManagementPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Inventory / Orders / Alerts
2. INVENTORY_COLUMNS: item, sku, quantity, reorderPoint, value, location
3. Filters: category, location, stockLevel
4. Reorder alerts
5. Stock movements
6. Valuation report

**Ước tính:** ~150 dòng

---

#### **P4.09 — TerritoryManagementPage nâng cấp**
**Yêu cầu:**
1. TERRITORY_COLUMNS: name, owner, accounts, revenue, quota, coverage
2. Filters: owner, region, performance
3. Map visualization
4. Territory rules
5. Rebalancing tool
6. Performance comparison

**Ước tính:** ~160 dòng

---

#### **P4.10 — AccountPlanningPage nâng cấp**
**Yêu cầu:**
1. ACCOUNT_COLUMNS: name, tier, revenue, growth, health, owner
2. Filters: tier, health, owner
3. Account plan template
4. Stakeholder mapping
5. SWOT analysis
6. Action tracking

**Ước tính:** ~150 dòng

---

#### **P4.11 — DealRoomPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Stakeholders / Timeline / Resources
2. STAKEHOLDER_COLUMNS: name, role, influence, sentiment, engagement
3. Resource library
4. Activity feed
5. Collaboration tools
6. Mutual action plan

**Ước tính:** ~140 dòng

---

#### **P4.12 — ApprovalWorkflowPage nâng cấp**
**Yêu cầu:**
1. REQUEST_COLUMNS: type, requestor, amount, status, approver, deadline
2. Filters: type, status, approver
3. Approval history
4. Delegation rules
5. Auto-approval criteria
6. SLA tracking

**Ước tính:** ~130 dòng

---

#### **P4.13 — CommissionCalculatorPage nâng cấp**
**Yêu cầu:**
1. COMMISSION_COLUMNS: rep, deals, revenue, commission, tier, status
2. Filters: period, tier, status
3. Commission structure builder
4. Payout schedule
5. Adjustment workflow
6. Report export

**Ước tính:** ~140 dòng

---

#### **P4.14 — QuotaManagementPage nâng cấp**
**Yêu cầu:**
1. QUOTA_COLUMNS: rep, quota, achieved, percentage, tier, status
2. Filters: period, team, status
3. Quota allocation rules
4. Performance tracking
5. Adjustment workflow
6. Historical comparison

**Ước tính:** ~130 dòng

---

#### **P4.15 — TeamCapacityPage nâng cấp**
**Yêu cầu:**
1. CAPACITY_COLUMNS: member, role, availability, allocated, capacity, utilization
2. Filters: type (human/AI), team, availability
3. Workload visualization
4. Resource planning
5. AI agent allocation
6. Burnout indicators

**Ước tính:** ~140 dòng

---

#### **P4.16 — SLATrackingPage nâng cấp**
**Yêu cầu:**
1. SLA_COLUMNS: ticket, priority, sla, remaining, status, breached
2. Filters: status, priority, breached
3. SLA rules configuration
4. Breach analysis
5. Performance metrics
6. Alert escalation

**Ước tính:** ~130 dòng

---

### **PHASE 5: INTEGRATION & AUTOMATION (Trang 61-71) — 11 trang**

#### **P5.01 — IntegrationHubPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Grid / List
2. INTEGRATION_COLUMNS: name, category, status, lastSync, records, health
3. Filters: category, status, health
4. Configuration wizard
5. Sync logs
6. Error handling
7. OAuth flow

**Ước tính:** ~150 dòng

---

#### **P5.02 — AutomationRulesPage nâng cấp**
**Yêu cầu:**
1. RULE_COLUMNS: name, trigger, actions, status, executions, lastRun
2. Filters: status, trigger, category
3. Rule builder UI
4. Execution history
5. Testing sandbox
6. Performance metrics

**Ước tính:** ~160 dòng

---

#### **P5.03 — WorkflowBuilderPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: List / Builder / Analytics
2. WORKFLOW_COLUMNS: name, steps, active, executions, conversionRate, status
3. Filters: status, category, performance
4. Visual workflow builder
5. Step library
6. Execution logs
7. A/B testing

**Ước tính:** ~200 dòng

---

#### **P5.04 — WebhookManagerPage nâng cấp**
**Yêu cầu:**
1. WEBHOOK_COLUMNS: endpoint, events, status, deliveries, failureRate, lastDelivery
2. Filters: status, event, health
3. Event selector
4. Retry configuration
5. Delivery logs
6. Signature verification
7. Testing tool

**Ước tính:** ~150 dòng

---

#### **P5.05 — ApiExplorerPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Docs / Playground / Logs
2. ENDPOINT_COLUMNS: method, path, description, auth, rateLimit
3. Filters: category, method
4. Interactive playground
5. Request/response samples
6. Error codes reference
7. SDK code generator

**Ước tính:** ~170 dòng

---

#### **P5.06 — DataImportExportPage nâng cấp**
**Yêu cầu:**
1. JOB_COLUMNS: type, entity, records, status, startTime, duration
2. Filters: type, status, entity
3. Import wizard
4. Field mapping
5. Validation rules
6. Error report
7. Rollback option

**Ước tính:** ~160 dòng

---

#### **P5.07 — DataImportWizardPage** (kiểm tra - wizard flow)
**Yêu cầu:**
1. Step progress indicator
2. File upload validation
3. Column mapping interface
4. Preview imported data
5. Error handling

**Ước tính:** ~80 dòng (mostly done)

---

#### **P5.08 — PartnerMarketplacePage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Grid / List
2. APP_COLUMNS: name, category, rating, installs, price, developer
3. Filters: category, rating, price
4. App details modal
5. Installation flow
6. Review system
7. Developer dashboard

**Ước tính:** ~150 dòng

---

#### **P5.09 — PartnerPortalPage nâng cấp**
**Yêu cầu:**
1. PARTNER_COLUMNS: name, tier, revenue, deals, status, performance
2. Filters: tier, status, performance
3. Partner dashboard
4. Resource library
5. Co-marketing tools
6. Deal registration

**Ước tính:** ~140 dòng

---

#### **P5.10 — PartnerScorecardPage nâng cấp**
**Yêu cầu:**
1. SCORECARD_COLUMNS: partner, tier, revenue, deals, satisfaction, status
2. Filters: tier, performance
3. Score breakdown
4. Tier progression
5. Benefit comparison
6. Action plan

**Ước tính:** ~130 dòng

---

#### **P5.11 — EventManagerPage nâng cấp**
**Yêu cầu:**
1. EVENT_COLUMNS: name, type, date, attendees, status, budget, roi
2. Filters: type, status, dateRange
3. Event details
4. Registration tracking
5. Budget management
6. Follow-up tracking
7. ROI calculator

**Ước tính:** ~150 dòng

---

### **PHASE 6: AI & ADVANCED FEATURES (Trang 72-81) — 10 trang**

#### **P6.01 — AiChatbotTrainingPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Intents / Entities / Knowledge
2. INTENT_COLUMNS: name, examples, confidence, usage, lastTrained
3. Filters: category, confidence
4. Training interface
5. Test console
6. Analytics dashboard
7. Model versioning

**Ước tính:** ~160 dòng

---

#### **P6.02 — AiCopilotSettingsPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Models / Guardrails / Usage
2. MODEL_COLUMNS: name, provider, cost, requests, latency, status
3. Guardrail configuration
4. Usage analytics
5. Cost tracking
6. Performance metrics

**Ước tính:** ~140 dòng

---

#### **P6.03 — AiTrainingDashboardPage nâng cấp**
**Yêu cầu:**
1. MODEL_COLUMNS: name, type, accuracy, version, status, lastTrained
2. Filters: type, status, performance
3. Training pipeline
4. Dataset management
5. Evaluation metrics
6. Deployment workflow

**Ước tính:** ~150 dòng

---

#### **P6.04 — VoipDialerPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Dialer / History / Analytics
2. CALL_COLUMNS: contact, duration, outcome, recording, sentiment, date
3. Filters: outcome, dateRange
4. Call recording player
5. Transcription viewer
6. Auto-dialer queue
7. Performance metrics

**Ước tính:** ~160 dòng

---

#### **P6.05 — LiveChatConfigPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Widget / Agents / Chats / Analytics
2. CHAT_COLUMNS: visitor, agent, duration, satisfaction, resolved, date
3. Widget customization
4. Agent availability
5. Routing rules
6. Canned responses
7. Chat analytics

**Ước tính:** ~150 dòng

---

#### **P6.06 — NPSTrackerPage nâng cấp**
**Yêu cầu:**
1. RESPONSE_COLUMNS: customer, score, category, feedback, date, followUp
2. Filters: category, score, dateRange
3. NPS trend chart
4. Category breakdown
5. Follow-up tracking
6. Action items

**Ước tính:** ~130 dòng

---

#### **P6.07 — SurveyBuilderPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: List / Builder / Responses
2. SURVEY_COLUMNS: name, questions, responses, completionRate, status
3. Filters: status, type
4. Visual builder
5. Logic branching
6. Response analytics
7. Export results

**Ước tính:** ~160 dòng

---

#### **P6.08 — Customer360Page nâng cấp**
**Yêu cầu:**
1. ViewToggle: Timeline / Profile / Relationships / Health
2. ACTIVITY_COLUMNS: type, description, date, outcome, contact
3. Contact history
4. Relationship mapping
5. Health indicators
6. Predictive insights
7. Action recommendations

**Ước tính:** ~170 dòng

---

#### **P6.09 — FeedbackWallPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Board / Table
2. FEEDBACK_COLUMNS: title, type, votes, status, submitter, date
3. Filters: type, status, votes
4. Voting system
5. Status workflow
6. Comment threads
7. Roadmap integration

**Ước tính:** ~140 dòng

---

#### **P6.10 — OnboardingWorkflowPage nâng cấp**
**Yêu cầu:**
1. JOURNEY_COLUMNS: customer, stage, progress, health, owner, startDate
2. Filters: stage, health, owner
3. Journey builder
4. Milestone tracking
5. Automated touchpoints
6. Success metrics

**Ước tính:** ~150 dòng

---

### **PHASE 7: ADMIN & CONFIGURATION (Trang 82-96) — 15 trang**

#### **P7.01 — RBACPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Roles / Permissions / Users
2. ROLE_COLUMNS: name, users, permissions, scope, status
3. Permission matrix
4. Role inheritance
5. User assignment
6. Audit trail

**Ước tính:** ~160 dòng

---

#### **P7.02 — CustomFieldsPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Fields / Groups / Usage
2. FIELD_COLUMNS: name, type, entity, required, usage, status
3. Filters: entity, type, status
4. Field builder
5. Validation rules
6. Dependency management
7. Usage analytics

**Ước tính:** ~150 dòng

---

#### **P7.03 — NotificationPreferencesPage** (kiểm tra - form based)
**Yêu cầu:**
1. Channel preferences table
2. Event subscriptions table
3. Digest settings
4. Test notification

**Ước tính:** ~60 dòng

---

#### **P7.04 — UserProfilePage** (kiểm tra - profile form)
**Yêu cầu:**
1. Profile editing
2. Security settings
3. Activity history table
4. Preferences

**Ước tính:** ~60 dòng

---

#### **P7.05 — AuditLogPage nâng cấp**
**Yêu cầu:**
1. AUDIT_COLUMNS: user, action, entity, changes, ip, timestamp
2. Filters: user, action, entity, dateRange
3. Change diff viewer
4. Export audit trail
5. Compliance reports

**Ước tính:** ~130 dòng

---

#### **P7.06 — AuditTrailPage nâng cấp**
**Yêu cầu:**
1. TRAIL_COLUMNS: event, user, before, after, timestamp
2. Filters: event, user, dateRange
3. Visual diff viewer
4. Search functionality
5. Export compliance report

**Ước tính:** ~120 dòng

---

#### **P7.07 — CustomDashboardPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Edit / View
2. WIDGET_COLUMNS: type, title, source, size, position
3. Drag-drop grid layout
4. Widget library
5. Data source configuration
6. Template gallery

**Ước tính:** ~150 dòng

---

#### **P7.08 — GoalTrackingPage nâng cấp**
**Yêu cầu:**
1. GOAL_COLUMNS: objective, owner, target, actual, progress, deadline
2. Filters: owner, status, type
3. OKR structure
4. Progress tracking
5. Check-in history
6. Analytics

**Ước tính:** ~140 dòng

---

#### **P7.09 — MultiCurrencyPage nâng cấp**
**Yêu cầu:**
1. RATE_COLUMNS: currency, rate, effective, source, lastUpdated
2. Filters: currency, status
3. Rate history
4. Auto-update configuration
5. Conversion calculator
6. Report currency selector

**Ước tính:** ~120 dòng

---

#### **P7.10 — ComplianceDashboardPage nâng cấp**
**Yêu cầu:**
1. REQUIREMENT_COLUMNS: framework, control, status, evidence, owner, lastReview
2. Filters: framework, status, owner
3. Compliance checklist
4. Evidence repository
5. Audit preparation
6. Gap analysis

**Ước tính:** ~140 dòng

---

#### **P7.11 — TrustCenterPage** (kiểm tra - info page)
**Yêu cầu:**
1. Certification display
2. Security documentation
3. Compliance status
4. Incident history

**Ước tính:** ~50 dòng

---

#### **P7.12 — DevPortalPage nâng cấp**
**Yêu cầu:**
1. APIKEY_COLUMNS: name, key, scopes, requests, lastUsed, status
2. Filters: status, scope
3. Key management
4. Usage analytics
5. Rate limit configuration
6. Webhook integration
7. Documentation

**Ước tính:** ~140 dòng

---

#### **P7.13 — KnowledgeBasePage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Grid / List / Tree
2. ARTICLE_COLUMNS: title, category, author, views, helpful, lastUpdated
3. Filters: category, author, status
4. Article editor
5. Search functionality
6. Version history
7. Analytics

**Ước tính:** ~160 dòng

---

#### **P7.14 — CustomerPortalPage** (kiểm tra - portal dashboard)
**Yêu cầu:**
1. Module cards
2. Activity feed
3. Resource library
4. Support integration

**Ước tính:** ~60 dòng

---

#### **P7.15 — DependencyGraphPage nâng cấp**
**Yêu cầu:**
1. ViewToggle: Graph / Table
2. DEPENDENCY_COLUMNS: module, dependsOn, type, status, version
3. Visual graph rendering
4. Impact analysis
5. Circular dependency detection
6. Export diagram

**Ước tính:** ~150 dòng

---

## 📊 TỔNG KẾT KẾ HOẠCH

### Thống kê tổng thể:
- **Tổng số trang:** 96
- **Hoàn thành:** 6 trang (6%)
- **Cần nâng cấp:** 76 trang (79%)
- **Cần kiểm tra:** 14 trang (15%)

### Ước tính tổng công việc:
- **Phase 1 (Core CRM):** ~400 dòng code (8 trang còn lại)
- **Phase 2 (Sales & Marketing):** ~2,480 dòng (18 trang)
- **Phase 3 (Analytics):** ~1,700 dòng (12 trang)
- **Phase 4 (Operations):** ~2,320 dòng (16 trang)
- **Phase 5 (Integration):** ~1,680 dòng (11 trang)
- **Phase 6 (AI & Advanced):** ~1,510 dòng (10 trang)
- **Phase 7 (Admin):** ~1,690 dòng (15 trang)

**TỔNG ƯỚC TÍNH:** ~11,780 dòng code mới

### Ưu tiên thực hiện:
1. **Tuần 1-2:** Phase 1 (Core CRM) — quan trọng nhất
2. **Tuần 3-5:** Phase 2 (Sales & Marketing) — tương tác người dùng nhiều
3. **Tuần 6-7:** Phase 3 (Analytics) — báo cáo và insight
4. **Tuần 8-10:** Phase 4 (Operations) — quy trình kinh doanh
5. **Tuần 11-12:** Phase 5 (Integration) — kết nối hệ thống
6. **Tuần 13-14:** Phase 6 (AI & Advanced) — tính năng nâng cao
7. **Tuần 15-16:** Phase 7 (Admin) — quản trị hệ thống

---

## 🎯 CHECKLIST PATTERNS CHUẨN

### **Template code pattern cho mỗi trang:**

```typescript
/* ============================================================
 * Column Definitions
 * ============================================================ */
const ENTITY_COLUMNS: ColumnDef<EntityType>[] = [
  {
    key: "id",
    header: "ID",
    sortable: true,
    defaultHidden: true,
    minWidth: 80,
  },
  {
    key: "name",
    header: "Tên",
    sortable: true,
    editable: true, // cho phép inline edit
    minWidth: 200,
    render: (item) => (/* custom render */),
  },
  // ... more columns
];

/* ============================================================
 * Main Page Component
 * ============================================================ */
export function EntityPage() {
  const { mode, setMode } = useViewMode("entity-view", "table");
  const [data, setData] = useState<EntityType[]>([]);
  const [filters, setFilters] = useState({/* filter state */});

  useEffect(() => {
    fetchEntities(filters).then(setData);
  }, [filters]);

  const handleInlineEdit = async (id: string, field: string, value: unknown) => {
    await updateEntity(id, { [field]: value });
    // refresh data
  };

  const handleBulkDelete = async (ids: string[]) => {
    await deleteEntities(ids);
    // refresh data
  };

  return (
    <div className="space-y-5">
      {/* Header + ViewToggle */}
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1>Entity Management</h1>
          <p className="text-gray-500 mt-1">Description</p>
        </div>
        <ViewToggle mode={mode} onSetMode={setMode} modes={["table", "card"]} />
      </header>

      {/* Filters */}
      <FilterBar /* ... */ />

      {/* View: Table or Card */}
      {mode === "table" ? (
        <DataTable
          data={data}
          columns={ENTITY_COLUMNS}
          storageKey="entity-table"
          defaultSortField="name"
          onInlineEdit={handleInlineEdit}
          onBulkDelete={handleBulkDelete}
          selectable={true}
          showToolbar={true}
        />
      ) : (
        <CardGrid /* ... */ />
      )}
    </div>
  );
}
```

---

## 🚀 BƯỚC TIẾP THEO

1. **Xác nhận kế hoạch:** Review và approve roadmap
2. **Ưu tiên phase:** Bắt đầu với Phase 1 (Core CRM)
3. **Iterative development:** Mỗi lần 2-3 trang
4. **Testing:** Đảm bảo pattern nhất quán
5. **Documentation:** Cập nhật progress tracking

---

**Generated:** 2026-03-04  
**Status:** Draft — Chờ xác nhận  
**Next Action:** Bắt đầu P1.01 — CalendarPage nâng cấp
