# KE HOACH TONG THE - CRM AI-FIRST
## Master Implementation Plan v3.0
### Trang thai: 108/580 buoc (18.6%) | Phase 1: 108/120 (90%)

---

## MUC LUC

| Phase | Ten | So buoc | Tich luy |
|-------|-----|---------|----------|
| 1 | Foundation & UI Components | 120 | 120 |
| 2 | Core CRM CRUD & Data Layer | 140 | 260 |
| 3 | AI Features & Intelligence | 80 | 340 |
| 4 | Advanced Modules | 100 | 440 |
| 5 | Integration, DevOps & Polish | 80 | 520 |
| 6 | Mobile Optimization & PWA | 60 | 580 |

---

## PHASE 1: FOUNDATION & UI COMPONENTS (120 buoc)
### Trang thai: 108/120 hoan thanh (90%)

### 1.9 Final Polish (12 buoc con lai)

| # | Buoc | Mo ta | File chinh |
|---|------|-------|-----------|
| 109 | ScrollArea polish | Toi uu scroll behavior, custom scrollbar violet theme | `ui/scroll-area.tsx` |
| 110 | Focus management | Keyboard navigation toan ung dung, focus trap cho modals | `hooks/ui/useFocusManagement.ts` |
| 111 | Theme tokens audit | Kiem tra tat ca CSS tokens violet primary nhat quan | `styles/theme.css` |
| 112 | Responsive breakpoints | Xac dinh chuan breakpoints sm/md/lg/xl cho toan app | `constants/breakpoints.ts` |
| 113 | Loading skeleton system | Skeleton placeholders cho moi kieu component | `ui/skeleton.tsx` |
| 114 | Error boundary | Global error boundary + fallback UI | `components/ErrorBoundary.tsx` |
| 115 | Empty state patterns | Thong nhat empty state cho bang, list, chart | `components/crm/EmptyState.tsx` |
| 116 | Animation tokens | Chuan hoa duration, easing, transition cho Motion | `constants/animations.ts` |
| 117 | Icon system audit | Kiem tra icon nhat quan, tao Icon constants map | `constants/icons.ts` |
| 118 | Typography scale | Xac dinh font-size scale, line-height, font-weight | `styles/theme.css` |
| 119 | Color contrast check | Dam bao WCAG AA contrast ratio toan bo | `utils/accessibility.ts` |
| 120 | Phase 1 integration test | Chay test toan bo UI components, fix regression | Toan bo `ui/` |

---

## PHASE 2: CORE CRM CRUD & DATA LAYER (140 buoc)
### Buoc 121-260 | Trang thai: Chua bat dau

### 2.1 Type System & Data Contracts (Buoc 121-135)

| # | Buoc | Mo ta | File chinh |
|---|------|-------|-----------|
| 121 | Standard Mixins type | Tao base type voi id, tenant_id, version, created_at, updated_at, deleted_at | `types/base.ts` |
| 122 | Contact type refactor | Them Standard Mixins vao Contact, them address, social_links | `types/crm.ts` |
| 123 | Company type refactor | Them Standard Mixins, them billing_address, shipping_address | `types/crm.ts` |
| 124 | Deal type refactor | Them Standard Mixins, them products[], competitors[], attachments[] | `types/crm.ts` |
| 125 | Lead type | Tao Lead type ke thua Contact + lead_source, conversion_date, qualified_by | `types/crm.ts` |
| 126 | Activity type | Tao Activity: call, email, meeting, task, note voi polymorphic metadata | `types/activity.ts` |
| 127 | Product type | Product, ProductCategory, PriceList voi multi-currency | `types/product.ts` |
| 128 | Quotation type | Quotation, QuotationLine, Discount, Tax | `types/quotation.ts` |
| 129 | Contract type | Contract, ContractLine, Renewal, Amendment | `types/contract.ts` |
| 130 | Task type | Task, Subtask, TaskComment, TaskAttachment | `types/task.ts` |
| 131 | Email Template type | EmailTemplate, Variable, SequenceStep | `types/email.ts` |
| 132 | Campaign type | Campaign, CampaignStep, CampaignMetric | `types/campaign.ts` |
| 133 | Ticket type | Ticket, TicketComment, SLAPolicy, Escalation | `types/ticket.ts` |
| 134 | API Response types | PagedResponse<T>, ApiError, SortConfig, FilterConfig | `types/api.ts` |
| 135 | Form schema types | Zod schemas cho tat ca entity, validation rules | `schemas/` |

### 2.2 Mock Data Factories (Buoc 136-150)

| # | Buoc | Mo ta | File chinh |
|---|------|-------|-----------|
| 136 | Base factory | Tao createFactory<T> utility voi faker seed, Standard Mixins auto-fill | `data/factories/base.ts` |
| 137 | Contact factory | 200+ contacts voi realistic VN/EN names, companies | `data/factories/contactFactory.ts` |
| 138 | Company factory | 100+ companies voi industries, sizes, revenue | `data/factories/companyFactory.ts` |
| 139 | Deal factory | 150+ deals trai deu pipeline stages | `data/factories/dealFactory.ts` |
| 140 | Lead factory | 300+ leads voi sources, scores | `data/factories/leadFactory.ts` |
| 141 | Activity factory | 1000+ activities link toi contacts/deals | `data/factories/activityFactory.ts` |
| 142 | Product factory | 50+ products voi categories, pricing tiers | `data/factories/productFactory.ts` |
| 143 | Quotation factory | 80+ quotations voi line items, discounts | `data/factories/quotationFactory.ts` |
| 144 | Contract factory | 60+ contracts voi renewal dates, amendments | `data/factories/contractFactory.ts` |
| 145 | Task factory | 200+ tasks voi subtasks, assignments | `data/factories/taskFactory.ts` |
| 146 | Email template factory | 30+ templates voi variables, categories | `data/factories/emailFactory.ts` |
| 147 | Campaign factory | 20+ campaigns voi steps, metrics | `data/factories/campaignFactory.ts` |
| 148 | Ticket factory | 100+ tickets voi SLA, priority, categories | `data/factories/ticketFactory.ts` |
| 149 | Relational linking | Link tat ca entities voi nhau qua foreign keys | `data/factories/linkEntities.ts` |
| 150 | Seed data orchestrator | Tao seedAll() function, export mockDB singleton | `data/seedMockData.ts` |

### 2.3 Mock API Layer (Buoc 151-170)

| # | Buoc | Mo ta | File chinh |
|---|------|-------|-----------|
| 151 | API client base | Tao mockApiClient voi delay simulation, error injection | `api/mock/client.ts` |
| 152 | CRUD generic | createCrudApi<T> voi getAll, getById, create, update, softDelete | `api/mock/crud.ts` |
| 153 | Contacts API | Full CRUD + search, filter, sort, paginate | `api/mock/contactsApi.ts` |
| 154 | Companies API | Full CRUD + hierarchy (parent/child), aggregate stats | `api/mock/companiesApi.ts` |
| 155 | Deals API | Full CRUD + pipeline move, stage history, win/loss tracking | `api/mock/dealsApi.ts` |
| 156 | Leads API | Full CRUD + convert to contact, scoring, assignment | `api/mock/leadsApi.ts` |
| 157 | Activities API | Full CRUD + timeline query, activity feed | `api/mock/activitiesApi.ts` |
| 158 | Products API | Full CRUD + category tree, price list management | `api/mock/productsApi.ts` |
| 159 | Quotations API | Full CRUD + line items, PDF generate mock, approval flow | `api/mock/quotationsApi.ts` |
| 160 | Contracts API | Full CRUD + renewal alerts, amendment tracking | `api/mock/contractsApi.ts` |
| 161 | Tasks API | Full CRUD + kanban reorder, subtask management | `api/mock/tasksApi.ts` |
| 162 | Email Templates API | Full CRUD + template render preview | `api/mock/emailTemplatesApi.ts` |
| 163 | Campaigns API | Full CRUD + campaign analytics, A/B test | `api/mock/campaignsApi.ts` |
| 164 | Tickets API | Full CRUD + SLA calculation, escalation logic | `api/mock/ticketsApi.ts` |
| 165 | Dashboard stats API | Aggregate queries: revenue, conversion, funnel | `api/mock/dashboardApi.ts` |
| 166 | Search API | Global search across all entities voi ranking | `api/mock/searchApi.ts` |
| 167 | Bulk operations API | Bulk update, bulk delete, bulk assign, bulk tag | `api/mock/bulkApi.ts` |
| 168 | Import/Export API | CSV/JSON import parser, export formatter | `api/mock/importExportApi.ts` |
| 169 | Audit log API | Log moi thay doi, query audit trail | `api/mock/auditApi.ts` |
| 170 | Notification API | In-app notifications, preferences | `api/mock/notificationApi.ts` |

### 2.4 Custom Hooks (Buoc 171-195)

| # | Buoc | Mo ta | File chinh |
|---|------|-------|-----------|
| 171 | useEntity generic | Base hook: loading, error, data, refetch cho moi entity | `hooks/queries/useEntity.ts` |
| 172 | useContacts | List + CRUD + filters + pagination + sort | `hooks/queries/useContacts.ts` |
| 173 | useCompanies | List + CRUD + hierarchy + aggregate | `hooks/queries/useCompanies.ts` |
| 174 | useDeals | List + CRUD + pipeline ops + forecast | `hooks/queries/useDeals.ts` |
| 175 | useLeads | List + CRUD + scoring + conversion | `hooks/queries/useLeads.ts` |
| 176 | useActivities | List + CRUD + timeline + feed | `hooks/queries/useActivities.ts` |
| 177 | useProducts | List + CRUD + categories | `hooks/queries/useProducts.ts` |
| 178 | useQuotations | List + CRUD + line items + approval | `hooks/queries/useQuotations.ts` |
| 179 | useContracts | List + CRUD + renewals | `hooks/queries/useContracts.ts` |
| 180 | useTasks | List + CRUD + kanban + subtasks | `hooks/queries/useTasks.ts` |
| 181 | useEmailTemplates | List + CRUD + preview | `hooks/queries/useEmailTemplates.ts` |
| 182 | useCampaigns | List + CRUD + analytics | `hooks/queries/useCampaigns.ts` |
| 183 | useTickets | List + CRUD + SLA | `hooks/queries/useTickets.ts` |
| 184 | useDashboardStats | Aggregate data cho dashboard | `hooks/queries/useDashboardStats.ts` |
| 185 | useGlobalSearch | Debounced search across entities | `hooks/queries/useGlobalSearch.ts` |
| 186 | useBulkActions | Bulk select, bulk operations | `hooks/ui/useBulkActions.ts` |
| 187 | useAdvancedFilter | Dynamic filter builder voi conditions, groups | `hooks/ui/useAdvancedFilter.ts` |
| 188 | useColumnConfig | Column visibility, order, width persistence | `hooks/ui/useColumnConfig.ts` |
| 189 | useInlineEdit v2 | Enhanced inline edit voi validation, undo | `hooks/ui/useInlineEditV2.ts` |
| 190 | useExport | Export to CSV, JSON, PDF | `hooks/ui/useExport.ts` |
| 191 | useImport | Import CSV/JSON voi validation, mapping | `hooks/ui/useImport.ts` |
| 192 | useOptimisticUpdate | Optimistic UI updates voi rollback | `hooks/queries/useOptimisticUpdate.ts` |
| 193 | useDebounce & useThrottle | Utility hooks cho search, scroll | `hooks/ui/useDebounce.ts` |
| 194 | useLocalStorage | Persist user preferences (view mode, columns, filters) | `hooks/ui/useLocalStorage.ts` |
| 195 | useKeyboardShortcuts | Global keyboard shortcuts (Ctrl+K search, etc.) | `hooks/ui/useKeyboardShortcuts.ts` |

### 2.5 Contacts Module - Full CRUD (Buoc 196-215)

| # | Buoc | Mo ta | File chinh |
|---|------|-------|-----------|
| 196 | ContactsPage refactor | Tich hop useContacts hook, remove hardcoded data | `pages/crm/ContactsPage.tsx` |
| 197 | Contact DataTable | Enhanced table voi sort, filter, pagination, column visibility | `components/crm/contacts/ContactDataTable.tsx` |
| 198 | Contact ListView | Card-based list view voi avatar, score, tags | `components/crm/contacts/ContactListView.tsx` |
| 199 | Contact ViewToggle | Toggle giua Table / List / Kanban (by status) | `components/crm/contacts/ContactViewToggle.tsx` |
| 200 | Contact FilterBar | Filter by status, type, source, score range, date range, tags | `components/crm/contacts/ContactFilterBar.tsx` |
| 201 | Contact CreateModal | Form modal voi validation, combobox cho company (co the them moi) | `components/crm/contacts/ContactCreateModal.tsx` |
| 202 | Contact EditModal | Pre-filled form, optimistic update | `components/crm/contacts/ContactEditModal.tsx` |
| 203 | Contact DeleteConfirm | Soft delete confirmation dialog | `components/crm/contacts/ContactDeleteConfirm.tsx` |
| 204 | Contact InlineEdit | Inline edit cho ten, email, phone, status truc tiep tren table | `components/crm/contacts/ContactInlineEdit.tsx` |
| 205 | Contact BulkActions | Bulk assign, tag, delete, export | `components/crm/contacts/ContactBulkActions.tsx` |
| 206 | Contact SearchBar | Debounced search voi highlight ket qua | `components/crm/contacts/ContactSearchBar.tsx` |
| 207 | Contact Export | Export filtered contacts to CSV/JSON | `components/crm/contacts/ContactExport.tsx` |
| 208 | Contact Import | Import CSV voi field mapping, preview, validation | `components/crm/contacts/ContactImport.tsx` |
| 209 | ContactDetailPage refactor | Tab layout: Overview, Activities, Deals, Notes, Documents, Custom Fields | `pages/crm/ContactDetailPage.tsx` |
| 210 | Contact Overview tab | Thong tin co ban, AI scores, engagement chart | `components/crm/contacts/ContactOverviewTab.tsx` |
| 211 | Contact Activities tab | Timeline activities, add new activity | `components/crm/contacts/ContactActivitiesTab.tsx` |
| 212 | Contact Deals tab | Danh sach deals lien quan, mini pipeline | `components/crm/contacts/ContactDealsTab.tsx` |
| 213 | Contact Notes tab | Rich text notes, history | `components/crm/contacts/ContactNotesTab.tsx` |
| 214 | Contact Documents tab | File upload, document list | `components/crm/contacts/ContactDocumentsTab.tsx` |
| 215 | Contact Mobile optimize | Bottom sheet, swipe actions, responsive layout | `components/crm/contacts/ContactMobile.tsx` |

### 2.6 Companies Module - Full CRUD (Buoc 216-230)

| # | Buoc | Mo ta | File chinh |
|---|------|-------|-----------|
| 216 | CompaniesPage refactor | Tich hop useCompanies, table/card toggle | `pages/crm/CompaniesPage.tsx` |
| 217 | Company DataTable | Sort, filter, pagination, inline edit | `components/crm/companies/CompanyDataTable.tsx` |
| 218 | Company CardView | Card grid voi logo, stats, score | `components/crm/companies/CompanyCardView.tsx` |
| 219 | Company FilterBar | Filter by industry, size, type, status, revenue range | `components/crm/companies/CompanyFilterBar.tsx` |
| 220 | Company CreateModal | Form voi address autocomplete, industry combobox | `components/crm/companies/CompanyCreateModal.tsx` |
| 221 | Company EditModal | Pre-filled form, logo upload | `components/crm/companies/CompanyEditModal.tsx` |
| 222 | Company DeleteConfirm | Soft delete voi check related contacts/deals | `components/crm/companies/CompanyDeleteConfirm.tsx` |
| 223 | Company InlineEdit | Inline edit status, assignedTo, tags | `components/crm/companies/CompanyInlineEdit.tsx` |
| 224 | Company BulkActions | Bulk operations | `components/crm/companies/CompanyBulkActions.tsx` |
| 225 | CompanyDetailPage refactor | Tabs: Overview, Contacts, Deals, Activities, Timeline | `pages/crm/CompanyDetailPage.tsx` |
| 226 | Company Contacts tab | Danh sach contacts thuoc company voi add/remove | `components/crm/companies/CompanyContactsTab.tsx` |
| 227 | Company Deals tab | Revenue chart, active deals, history | `components/crm/companies/CompanyDealsTab.tsx` |
| 228 | Company Hierarchy | Parent/child company tree view | `components/crm/companies/CompanyHierarchy.tsx` |
| 229 | Company 360 widget | Summary widget: health score, revenue, contacts count | `components/crm/companies/Company360Widget.tsx` |
| 230 | Company Mobile optimize | Responsive layout, touch-friendly | `components/crm/companies/CompanyMobile.tsx` |

### 2.7 Deals & Pipeline - Full CRUD (Buoc 231-250)

| # | Buoc | Mo ta | File chinh |
|---|------|-------|-----------|
| 231 | PipelinePage refactor | Kanban + Table + Forecast toggle | `pages/crm/PipelinePage.tsx` |
| 232 | Deal KanbanView | Drag-drop giua stages, deal card voi value, probability | `components/crm/deals/DealKanbanView.tsx` |
| 233 | Deal DataTable | Full CRUD table voi inline stage change | `components/crm/deals/DealDataTable.tsx` |
| 234 | Deal FilterBar | Filter by stage, priority, value range, date, owner | `components/crm/deals/DealFilterBar.tsx` |
| 235 | Deal CreateModal | Form voi contact/company combobox, products picker | `components/crm/deals/DealCreateModal.tsx` |
| 236 | Deal EditModal | All fields editable, stage history | `components/crm/deals/DealEditModal.tsx` |
| 237 | Deal DeleteConfirm | Soft delete voi reason (lost reason tracking) | `components/crm/deals/DealDeleteConfirm.tsx` |
| 238 | Deal Stage Change | Slide-over panel khi move stage, require fields per stage | `components/crm/deals/DealStageChange.tsx` |
| 239 | Deal Products tab | Add/remove products, calculate total, discount | `components/crm/deals/DealProductsTab.tsx` |
| 240 | Deal Activities tab | Activity timeline, schedule next action | `components/crm/deals/DealActivitiesTab.tsx` |
| 241 | Deal BulkActions | Bulk move stage, assign, tag | `components/crm/deals/DealBulkActions.tsx` |
| 242 | DealDetailPage refactor | Tabs: Overview, Products, Activities, Competitors, Documents | `pages/crm/DealDetailPage.tsx` |
| 243 | Deal Overview tab | Value, probability, AI prediction, competitor intel | `components/crm/deals/DealOverviewTab.tsx` |
| 244 | Deal Competitors tab | Add competitors, track win/loss against | `components/crm/deals/DealCompetitorsTab.tsx` |
| 245 | Deal Documents tab | Proposals, contracts, attachments | `components/crm/deals/DealDocumentsTab.tsx` |
| 246 | Pipeline Analytics | Conversion rates, velocity, bottleneck analysis | `components/crm/deals/PipelineAnalytics.tsx` |
| 247 | Forecast view | Weighted pipeline, commit vs best-case | `components/crm/deals/ForecastView.tsx` |
| 248 | Deal scoring UI | AI win probability breakdown, factor analysis | `components/crm/deals/DealScoringUI.tsx` |
| 249 | Deal timeline | Visual timeline tu creation den close | `components/crm/deals/DealTimeline.tsx` |
| 250 | Deal Mobile optimize | Swipe to change stage, compact kanban | `components/crm/deals/DealMobile.tsx` |

### 2.8 Leads Module (Buoc 251-260)

| # | Buoc | Mo ta | File chinh |
|---|------|-------|-----------|
| 251 | LeadsPage refactor | Table/Card/Kanban views, scoring | `pages/crm/LeadsPage.tsx` |
| 252 | Lead DataTable | Full CRUD, score column, source tracking | `components/crm/leads/LeadDataTable.tsx` |
| 253 | Lead CardView | Score-based color coding, quick actions | `components/crm/leads/LeadCardView.tsx` |
| 254 | Lead CreateModal | Source tracking, auto-assign rules | `components/crm/leads/LeadCreateModal.tsx` |
| 255 | Lead Scoring UI | AI score breakdown, qualification criteria | `components/crm/leads/LeadScoringUI.tsx` |
| 256 | Lead Conversion | Convert lead to contact + optional deal + company | `components/crm/leads/LeadConversion.tsx` |
| 257 | Lead Inbox | Priority inbox voi AI-sorted leads | `components/crm/leads/LeadInbox.tsx` |
| 258 | Lead Nurture | Nurture sequence assignment, drip campaign | `components/crm/leads/LeadNurture.tsx` |
| 259 | Lead Duplicate Detection | AI-powered duplicate merge UI | `components/crm/leads/LeadDuplicateDetect.tsx` |
| 260 | Lead Mobile optimize | Touch-friendly scoring, swipe actions | `components/crm/leads/LeadMobile.tsx` |

---

## PHASE 3: AI FEATURES & INTELLIGENCE (80 buoc)
### Buoc 261-340 | Trang thai: Chua bat dau

### 3.1 AI Chat & Copilot (Buoc 261-280)

| # | Buoc | Mo ta | File chinh |
|---|------|-------|-----------|
| 261 | AI Chat Widget refactor | Floating chat, context-aware, markdown render | `components/crm/AIChatWidget.tsx` |
| 262 | AI Chat history | Luu lich su chat, search conversations | `components/crm/ai/AIChatHistory.tsx` |
| 263 | AI Chat suggestions | Goi y cau hoi dua tren context hien tai | `components/crm/ai/AIChatSuggestions.tsx` |
| 264 | AI Copilot sidebar | Side panel voi AI suggestions per page | `components/crm/ai/AICopilotSidebar.tsx` |
| 265 | AI Deal insights | AI phan tich deal: risk, next action, similar deals | `components/crm/ai/AIDealInsights.tsx` |
| 266 | AI Contact insights | AI scoring explanation, engagement prediction | `components/crm/ai/AIContactInsights.tsx` |
| 267 | AI Email writer | AI generate email draft tu context | `components/crm/ai/AIEmailWriter.tsx` |
| 268 | AI Meeting summary | Auto-generate meeting notes, action items | `components/crm/ai/AIMeetingSummary.tsx` |
| 269 | AI Task suggestion | AI de xuat tasks dua tren deal stage, activity gap | `components/crm/ai/AITaskSuggestion.tsx` |
| 270 | AI Competitor brief | Auto-generate competitor comparison | `components/crm/ai/AICompetitorBrief.tsx` |
| 271 | AI Sentiment analysis | Phan tich tone email/note, customer mood tracking | `components/crm/ai/AISentimentAnalysis.tsx` |
| 272 | AI Forecast model | ML-based revenue forecast UI | `components/crm/ai/AIForecastModel.tsx` |
| 273 | AI Lead scoring model | Explain AI scoring factors, tune weights | `components/crm/ai/AILeadScoringModel.tsx` |
| 274 | AI Churn prediction | Churn risk score, early warning signals | `components/crm/ai/AIChurnPrediction.tsx` |
| 275 | AI Cross-sell/Upsell | Product recommendations per customer | `components/crm/ai/AICrossSell.tsx` |
| 276 | AI Data enrichment | Auto-fill company/contact info tu web | `components/crm/ai/AIDataEnrichment.tsx` |
| 277 | AI Anomaly detection | Unusual activity alerts, data quality issues | `components/crm/ai/AIAnomalyDetection.tsx` |
| 278 | AI Report generator | Natural language to report | `components/crm/ai/AIReportGenerator.tsx` |
| 279 | AI Workflow suggest | Goi y automation rules dua tren patterns | `components/crm/ai/AIWorkflowSuggest.tsx` |
| 280 | AI Settings page | Model selection, confidence thresholds, training data | `pages/crm/AiCopilotSettingsPage.tsx` |

### 3.2 AI Training & Feedback (Buoc 281-295)

| # | Buoc | Mo ta | File chinh |
|---|------|-------|-----------|
| 281 | AI Training dashboard | Model performance, accuracy metrics | `pages/crm/AiTrainingDashboardPage.tsx` |
| 282 | AI Feedback loop | Thumbs up/down on AI suggestions | `components/crm/ai/AIFeedbackWidget.tsx` |
| 283 | AI Confidence display | Show confidence level on all AI outputs | `components/crm/ai/AIConfidenceBadge.tsx` |
| 284 | AI Training data review | Review & label training examples | `components/crm/ai/AITrainingDataReview.tsx` |
| 285 | AI Model comparison | A/B test different model versions | `components/crm/ai/AIModelComparison.tsx` |
| 286 | AI Chatbot training | Train custom Q&A pairs | `pages/crm/AiChatbotTrainingPage.tsx` |
| 287 | AI Prompt templates | Reusable prompt templates cho AI | `components/crm/ai/AIPromptTemplates.tsx` |
| 288 | AI Knowledge base sync | Sync knowledge base voi AI context | `components/crm/ai/AIKnowledgeSync.tsx` |
| 289 | AI Usage analytics | Token usage, cost tracking, limits | `components/crm/ai/AIUsageAnalytics.tsx` |
| 290 | AI Error handling | Graceful fallback khi AI unavailable | `components/crm/ai/AIErrorFallback.tsx` |

### 3.3 Predictive Analytics (Buoc 291-300)

| # | Buoc | Mo ta | File chinh |
|---|------|-------|-----------|
| 291 | Revenue forecast chart | Time-series forecast voi confidence band | `components/crm/analytics/RevenueForecast.tsx` |
| 292 | Pipeline velocity | Stage duration analysis, bottleneck detection | `components/crm/analytics/PipelineVelocity.tsx` |
| 293 | Win rate analysis | Win/loss by segment, rep, product | `components/crm/analytics/WinRateAnalysis.tsx` |
| 294 | Customer lifetime value | CLV calculation, segment by value | `components/crm/analytics/CLVAnalysis.tsx` |
| 295 | Cohort analysis | Customer retention by cohort | `components/crm/analytics/CohortAnalysis.tsx` |
| 296 | Funnel analysis | Multi-step funnel voi drop-off rates | `components/crm/analytics/FunnelAnalysis.tsx` |
| 297 | Attribution modeling | Multi-touch attribution, channel ROI | `components/crm/analytics/AttributionModel.tsx` |
| 298 | Trend detection | Auto-detect trends, seasonality | `components/crm/analytics/TrendDetection.tsx` |
| 299 | Benchmark comparison | Compare metrics vs industry, vs last period | `components/crm/analytics/BenchmarkComparison.tsx` |
| 300 | Analytics export | Export analytics to PDF, PowerPoint format | `components/crm/analytics/AnalyticsExport.tsx` |

### 3.4 Smart Automation (Buoc 301-315)

| # | Buoc | Mo ta | File chinh |
|---|------|-------|-----------|
| 301 | Workflow builder refactor | Visual drag-drop workflow editor | `pages/crm/WorkflowBuilderPage.tsx` |
| 302 | Trigger types | Event triggers: record create, update, stage change, date, webhook | `components/crm/automation/TriggerConfig.tsx` |
| 303 | Condition builder | If/else conditions voi nested groups | `components/crm/automation/ConditionBuilder.tsx` |
| 304 | Action types | Send email, create task, update field, notify, webhook | `components/crm/automation/ActionConfig.tsx` |
| 305 | Workflow templates | Pre-built workflow templates | `components/crm/automation/WorkflowTemplates.tsx` |
| 306 | Workflow test runner | Test workflow voi sample data | `components/crm/automation/WorkflowTester.tsx` |
| 307 | Workflow history | Execution log, success/failure tracking | `components/crm/automation/WorkflowHistory.tsx` |
| 308 | Auto-assignment rules | Round-robin, load-based, territory-based assignment | `components/crm/automation/AssignmentRules.tsx` |
| 309 | SLA automation | Auto-escalate khi SLA breach, notifications | `components/crm/automation/SLAAutomation.tsx` |
| 310 | Email sequence engine | Multi-step email drip voi conditions | `components/crm/automation/EmailSequenceEngine.tsx` |
| 311 | Lead routing | Auto-route leads based on criteria | `components/crm/automation/LeadRouting.tsx` |
| 312 | Deal stage automation | Auto-actions per stage (send doc, schedule call) | `components/crm/automation/DealStageAuto.tsx` |
| 313 | Approval workflow | Multi-level approval for quotes, discounts | `components/crm/automation/ApprovalFlow.tsx` |
| 314 | Notification rules | Custom notification conditions & channels | `components/crm/automation/NotificationRules.tsx` |
| 315 | Automation analytics | Automation impact, time saved, error rate | `components/crm/automation/AutomationAnalytics.tsx` |

### 3.5 AI Dashboard & Reports (Buoc 316-340)

| # | Buoc | Mo ta | File chinh |
|---|------|-------|-----------|
| 316 | AI Insights dashboard | Tong hop AI insights, alerts, recommendations | `pages/crm/AIInsightsPage.tsx` |
| 317 | Smart report builder | Drag-drop report widgets | `components/crm/reports/ReportBuilder.tsx` |
| 318 | Report templates | Pre-built: Sales Summary, Pipeline, Activity, Forecast | `components/crm/reports/ReportTemplates.tsx` |
| 319 | Report scheduling | Schedule reports, email delivery | `components/crm/reports/ReportScheduler.tsx` |
| 320 | Report sharing | Share reports voi team, role-based access | `components/crm/reports/ReportSharing.tsx` |
| 321 | KPI dashboard | Customizable KPI cards voi targets, trends | `components/crm/reports/KPIDashboard.tsx` |
| 322 | Sales leaderboard | Rep ranking voi gamification elements | `pages/crm/LeaderboardPage.tsx` |
| 323 | Activity analytics | Call volume, email open rates, meeting stats | `components/crm/reports/ActivityAnalytics.tsx` |
| 324 | Revenue analytics | MRR, ARR, revenue growth, churn rate | `components/crm/reports/RevenueAnalytics.tsx` |
| 325 | Custom dashboard builder | User-created dashboards voi drag-drop widgets | `pages/crm/CustomDashboardPage.tsx` |
| 326 | Dashboard widget library | Widget catalog: chart, metric, list, table, AI | `components/crm/dashboard/WidgetLibrary.tsx` |
| 327 | Dashboard layout engine | Grid layout, resize, reorder widgets | `components/crm/dashboard/LayoutEngine.tsx` |
| 328 | Dashboard filters | Global date range, segment filters | `components/crm/dashboard/DashboardFilters.tsx` |
| 329 | Dashboard sharing | Share dashboard voi team, embed | `components/crm/dashboard/DashboardSharing.tsx` |
| 330 | Real-time metrics | WebSocket mock for live updating stats | `components/crm/dashboard/RealTimeMetrics.tsx` |
| 331 | Goal tracking dashboard | Goals vs actual, progress bars, forecasts | `pages/crm/GoalTrackingPage.tsx` |
| 332 | Team performance | Team metrics, individual breakdown | `components/crm/reports/TeamPerformance.tsx` |
| 333 | Revenue waterfall | Revenue changes visualization | `pages/crm/RevenueWaterfallPage.tsx` |
| 334 | Campaign ROI report | Campaign spend vs revenue, attribution | `pages/crm/CampaignRoiPage.tsx` |
| 335 | Win/Loss analysis | Win/loss reasons, trends, competitor impact | `pages/crm/WinLossAnalysisPage.tsx` |
| 336 | Territory performance | Territory-based metrics, map view | `components/crm/reports/TerritoryPerformance.tsx` |
| 337 | Quota attainment | Rep quota vs actual, pacing | `pages/crm/QuotaManagementPage.tsx` |
| 338 | Customer health report | Health score distribution, at-risk accounts | `pages/crm/CustomerHealthPage.tsx` |
| 339 | NPS report | NPS trends, promoter/detractor analysis | `pages/crm/NPSTrackerPage.tsx` |
| 340 | Report export | PDF, Excel, PowerPoint, scheduled email | `components/crm/reports/ReportExport.tsx` |

---

## PHASE 4: ADVANCED MODULES (100 buoc)
### Buoc 341-440 | Trang thai: Chua bat dau

### 4.1 Marketing & Campaigns (Buoc 341-360)

| # | Buoc | Mo ta | File chinh |
|---|------|-------|-----------|
| 341 | Campaign list page | CRUD campaigns voi status, metrics | `pages/crm/MarketingCampaignPage.tsx` |
| 342 | Campaign builder | Multi-step campaign voi triggers, delays | `components/crm/marketing/CampaignBuilder.tsx` |
| 343 | Email campaign | Email blast, template select, personalization | `components/crm/marketing/EmailCampaign.tsx` |
| 344 | SMS campaign | SMS templates, scheduling, opt-out | `pages/crm/SmsCampaignPage.tsx` |
| 345 | Social media monitor | Track mentions, sentiment, engagement | `pages/crm/SocialMediaMonitorPage.tsx` |
| 346 | Landing page builder | Drag-drop landing page editor | `pages/crm/LandingPageBuilderPage.tsx` |
| 347 | Form builder | Custom forms voi field types, validation | `pages/crm/FormBuilderPage.tsx` |
| 348 | A/B testing | Split test emails, landing pages | `pages/crm/ABTestingPage.tsx` |
| 349 | Content calendar | Calendar view cho scheduled content | `pages/crm/ContentCalendarPage.tsx` |
| 350 | Customer segmentation | Dynamic segments voi conditions | `pages/crm/CustomerSegmentationPage.tsx` |
| 351 | Referral program | Referral tracking, rewards | `pages/crm/ReferralProgramPage.tsx` |
| 352 | Survey builder | Custom surveys, NPS, CSAT | `pages/crm/SurveyBuilderPage.tsx` |
| 353 | Email sequence builder | Multi-step nurture sequences | `pages/crm/EmailSequenceBuilderPage.tsx` |
| 354 | Campaign analytics | Open rate, CTR, conversion, ROI | `components/crm/marketing/CampaignAnalytics.tsx` |
| 355 | Marketing attribution | First-touch, last-touch, multi-touch | `components/crm/marketing/MarketingAttribution.tsx` |
| 356 | Lead magnet tracker | Track downloads, signups, conversions | `components/crm/marketing/LeadMagnetTracker.tsx` |
| 357 | UTM tracking | UTM parameter management, link builder | `components/crm/marketing/UTMTracker.tsx` |
| 358 | Campaign templates | Pre-built campaign templates | `components/crm/marketing/CampaignTemplates.tsx` |
| 359 | Marketing calendar | Unified calendar toan bo marketing activities | `components/crm/marketing/MarketingCalendar.tsx` |
| 360 | Marketing dashboard | KPIs, funnel, channel performance | `components/crm/marketing/MarketingDashboard.tsx` |

### 4.2 Customer Service (Buoc 361-380)

| # | Buoc | Mo ta | File chinh |
|---|------|-------|-----------|
| 361 | Ticket list page | CRUD tickets voi priority, SLA, status | `pages/crm/TicketSupportPage.tsx` |
| 362 | Ticket detail view | Full ticket conversation thread | `components/crm/tickets/TicketDetail.tsx` |
| 363 | Ticket create form | Category, priority, assignee, attachments | `components/crm/tickets/TicketCreateForm.tsx` |
| 364 | SLA tracking | SLA policies, breach alerts, timers | `pages/crm/SLATrackingPage.tsx` |
| 365 | Knowledge base | Article CRUD, categories, search | `pages/crm/KnowledgeBasePage.tsx` |
| 366 | Knowledge base editor | Rich text editor, images, code blocks | `components/crm/kb/KBEditor.tsx` |
| 367 | KB search | Full-text search, AI-suggested articles | `components/crm/kb/KBSearch.tsx` |
| 368 | Live chat config | Chat widget settings, routing rules | `pages/crm/LiveChatConfigPage.tsx` |
| 369 | Live chat UI | Real-time chat interface mock | `components/crm/chat/LiveChatUI.tsx` |
| 370 | Chatbot builder | Q&A pairs, decision tree, AI integration | `pages/crm/AiChatbotTrainingPage.tsx` |
| 371 | Customer portal | Self-service portal cho customers | `pages/crm/CustomerPortalPage.tsx` |
| 372 | Feedback wall | Public feedback board, voting, status | `pages/crm/FeedbackWallPage.tsx` |
| 373 | NPS tracker | NPS surveys, trends, follow-up workflows | `pages/crm/NPSTrackerPage.tsx` |
| 374 | CSAT tracking | Customer satisfaction scores per interaction | `components/crm/tickets/CSATTracker.tsx` |
| 375 | Escalation rules | Auto-escalate based on priority, time, customer tier | `components/crm/tickets/EscalationRules.tsx` |
| 376 | Ticket analytics | Volume, resolution time, satisfaction trends | `components/crm/tickets/TicketAnalytics.tsx` |
| 377 | Canned responses | Reusable response templates | `components/crm/tickets/CannedResponses.tsx` |
| 378 | Ticket merge | Merge duplicate tickets | `components/crm/tickets/TicketMerge.tsx` |
| 379 | Customer timeline unified | Tat ca interactions (tickets, calls, emails) tren 1 timeline | `components/crm/tickets/CustomerTimeline.tsx` |
| 380 | Service dashboard | Service KPIs, agent performance | `components/crm/tickets/ServiceDashboard.tsx` |

### 4.3 Finance & Operations (Buoc 381-405)

| # | Buoc | Mo ta | File chinh |
|---|------|-------|-----------|
| 381 | Product catalog refactor | Full CRUD products, categories, pricing | `pages/crm/ProductCatalogPage.tsx` |
| 382 | Price list management | Multiple price lists, tier pricing, date ranges | `components/crm/products/PriceListManager.tsx` |
| 383 | Quotation builder refactor | Line items, discounts, taxes, PDF preview | `pages/crm/QuotationBuilderPage.tsx` |
| 384 | Quotation approval | Multi-level approval workflow | `components/crm/quotations/QuotationApproval.tsx` |
| 385 | Quotation PDF | Generate PDF mock, template selection | `components/crm/quotations/QuotationPDF.tsx` |
| 386 | CPQ engine | Configure-Price-Quote logic | `pages/crm/CpqPage.tsx` |
| 387 | Contract management refactor | Full CRUD, renewal tracking, amendments | `pages/crm/ContractManagementPage.tsx` |
| 388 | Contract renewal pipeline | Upcoming renewals, risk assessment | `pages/crm/RenewalPipelinePage.tsx` |
| 389 | Commission calculator refactor | Commission rules, tiers, calculation | `pages/crm/CommissionCalculatorPage.tsx` |
| 390 | Commission rules engine | Complex rule definitions, split commissions | `components/crm/commissions/CommissionRules.tsx` |
| 391 | Invoice generation | Auto-generate invoices tu contracts/quotations | `components/crm/finance/InvoiceGenerator.tsx` |
| 392 | Payment tracking | Payment status, overdue alerts | `components/crm/finance/PaymentTracker.tsx` |
| 393 | Multi-currency refactor | Exchange rates, auto-convert, reporting | `pages/crm/MultiCurrencyPage.tsx` |
| 394 | Revenue recognition | Revenue schedule, deferred revenue | `components/crm/finance/RevenueRecognition.tsx` |
| 395 | Subscription management refactor | Plans, billing cycles, upgrades/downgrades | `pages/crm/SubscriptionManagementPage.tsx` |
| 396 | Inventory management refactor | Stock levels, reorder points, tracking | `pages/crm/InventoryManagementPage.tsx` |
| 397 | Vendor management refactor | Vendor CRUD, evaluation, purchase orders | `pages/crm/VendorManagementPage.tsx` |
| 398 | Approval workflows refactor | Multi-level approvals cho quotes, discounts, expenses | `pages/crm/ApprovalWorkflowPage.tsx` |
| 399 | Expense tracking | Employee expenses, approval, reimbursement | `components/crm/finance/ExpenseTracker.tsx` |
| 400 | Financial dashboard | Revenue, expenses, profit, cash flow | `components/crm/finance/FinancialDashboard.tsx` |
| 401 | Tax configuration | Tax rules, regional taxes, exemptions | `components/crm/finance/TaxConfig.tsx` |
| 402 | Discount rules | Discount types, volume discounts, bundle pricing | `components/crm/finance/DiscountRules.tsx` |
| 403 | Billing history | Customer billing history, payment methods | `components/crm/finance/BillingHistory.tsx` |
| 404 | Revenue leakage analysis | Identify uncollected revenue, discrepancies | `pages/crm/RevenueLeakagePage.tsx` |
| 405 | Finance reports | P&L, aging report, collection forecast | `components/crm/finance/FinanceReports.tsx` |

### 4.4 Team & HR (Buoc 406-420)

| # | Buoc | Mo ta | File chinh |
|---|------|-------|-----------|
| 406 | Team page refactor | Grid/list view, human + AI agents | `pages/crm/TeamPage.tsx` |
| 407 | Employee detail refactor | Profile, performance, deals, activities | `pages/crm/EmployeeDetailPage.tsx` |
| 408 | Team capacity refactor | Workload distribution, capacity planning | `pages/crm/TeamCapacityPage.tsx` |
| 409 | Territory management refactor | Territory CRUD, assignment, map view | `pages/crm/TerritoryManagementPage.tsx` |
| 410 | Quota management refactor | Quota assignment, tracking, adjustment | `pages/crm/QuotaManagementPage.tsx` |
| 411 | Gamification refactor | Points, badges, challenges, streaks | `pages/crm/GamificationPage.tsx` |
| 412 | Sales playbook refactor | Playbook CRUD, step-by-step guides | `pages/crm/SalesPlaybookPage.tsx` |
| 413 | Onboarding workflow refactor | New rep onboarding checklist, progress | `pages/crm/OnboardingWorkflowPage.tsx` |
| 414 | Meeting intelligence refactor | AI meeting notes, action items, insights | `pages/crm/MeetingIntelligencePage.tsx` |
| 415 | VoIP dialer refactor | Click-to-call, call log, recording | `pages/crm/VoipDialerPage.tsx` |
| 416 | Calendar refactor | Multi-view calendar, availability | `pages/crm/CalendarPage.tsx` |
| 417 | Task board refactor | Kanban tasks, my tasks, team tasks | `pages/crm/TaskBoardPage.tsx` |
| 418 | Activity feed refactor | Global activity feed, filters, search | `pages/crm/ActivitiesPage.tsx` |
| 419 | Team analytics | Team performance comparison, trends | `components/crm/team/TeamAnalytics.tsx` |
| 420 | AI Agent management | Configure AI agents, roles, permissions | `components/crm/team/AIAgentManager.tsx` |

### 4.5 Partner & External (Buoc 421-440)

| # | Buoc | Mo ta | File chinh |
|---|------|-------|-----------|
| 421 | Partner portal refactor | Partner CRUD, deal registration, commission | `pages/crm/PartnerPortalPage.tsx` |
| 422 | Partner scorecard refactor | Partner performance metrics, tiers | `pages/crm/PartnerScorecardPage.tsx` |
| 423 | Partner marketplace refactor | App/service marketplace | `pages/crm/PartnerMarketplacePage.tsx` |
| 424 | Integration hub refactor | OAuth connections, API keys, webhooks | `pages/crm/IntegrationHubPage.tsx` |
| 425 | Webhook manager refactor | Webhook CRUD, logs, retry | `pages/crm/WebhookManagerPage.tsx` |
| 426 | API explorer refactor | Interactive API docs, test console | `pages/crm/ApiExplorerPage.tsx` |
| 427 | Dev portal refactor | API docs, SDKs, changelogs | `pages/crm/DevPortalPage.tsx` |
| 428 | Data import wizard refactor | Step-by-step import, mapping, preview | `pages/crm/DataImportWizardPage.tsx` |
| 429 | Data export center | Bulk export, scheduled exports | `pages/crm/DataImportExportPage.tsx` |
| 430 | Data enrichment refactor | Auto-fill data tu external sources | `pages/crm/DataEnrichmentPage.tsx` |
| 431 | Account planning refactor | Strategic account plans, goals, stakeholder map | `pages/crm/AccountPlanningPage.tsx` |
| 432 | Customer 360 refactor | Unified customer view, all interactions | `pages/crm/Customer360Page.tsx` |
| 433 | Customer journey refactor | Journey mapping, touchpoints, drop-off | `pages/crm/CustomerJourneyPage.tsx` |
| 434 | Deal room refactor | Virtual deal room, shared documents | `pages/crm/DealRoomPage.tsx` |
| 435 | Event manager refactor | Event CRUD, RSVPs, check-in | `pages/crm/EventManagerPage.tsx` |
| 436 | Document management refactor | File storage, versioning, sharing | `pages/crm/DocumentManagementPage.tsx` |
| 437 | Competitor analysis refactor | Competitor profiles, SWOT, battlecards | `pages/crm/CompetitorAnalysisPage.tsx` |
| 438 | Churn prediction refactor | At-risk accounts, intervention playbooks | `pages/crm/ChurnPredictionPage.tsx` |
| 439 | Revenue intelligence refactor | Revenue signals, deal health, insights | `pages/crm/RevenueIntelligencePage.tsx` |
| 440 | Dependency graph refactor | System dependency visualization | `pages/crm/DependencyGraphPage.tsx` |

---

## PHASE 5: INTEGRATION, DEVOPS & POLISH (80 buoc)
### Buoc 441-520 | Trang thai: Chua bat dau

### 5.1 Settings & Administration (Buoc 441-460)

| # | Buoc | Mo ta | File chinh |
|---|------|-------|-----------|
| 441 | Settings page refactor | Tabbed settings: General, Users, Roles, API, Billing | `pages/crm/CrmSettingsPage.tsx` |
| 442 | RBAC refactor | Role CRUD, permission matrix, role assignment | `pages/crm/RBACPage.tsx` |
| 443 | Custom fields refactor | Custom field CRUD, field types, validation rules | `pages/crm/CustomFieldsPage.tsx` |
| 444 | Notification preferences refactor | Channel preferences, notification rules | `pages/crm/NotificationPreferencesPage.tsx` |
| 445 | User profile refactor | Profile edit, avatar, password, 2FA | `pages/crm/UserProfilePage.tsx` |
| 446 | Audit trail refactor | Full audit log, filter by entity/user/action | `pages/crm/AuditTrailPage.tsx` |
| 447 | Audit log refactor | System-wide audit log voi search | `pages/crm/AuditLogPage.tsx` |
| 448 | Compliance dashboard refactor | GDPR, data retention, consent tracking | `pages/crm/ComplianceDashboardPage.tsx` |
| 449 | Trust center refactor | Security policies, certifications, privacy | `pages/crm/TrustCenterPage.tsx` |
| 450 | Email templates refactor | Template CRUD, variable system, preview | `pages/crm/EmailTemplatesPage.tsx` |
| 451 | Tenant configuration | Multi-tenant settings, branding, limits | `components/crm/settings/TenantConfig.tsx` |
| 452 | Data retention policies | Auto-archive, purge rules, compliance | `components/crm/settings/DataRetention.tsx` |
| 453 | Backup & restore | Data backup scheduling, restore UI | `components/crm/settings/BackupRestore.tsx` |
| 454 | System health | Service status, performance metrics | `components/crm/settings/SystemHealth.tsx` |
| 455 | Feature flags | Toggle features per tenant/user | `components/crm/settings/FeatureFlags.tsx` |
| 456 | Branding config | Logo, colors, custom domain | `components/crm/settings/BrandingConfig.tsx` |
| 457 | Localization settings | Language, timezone, date/number format | `components/crm/settings/LocalizationSettings.tsx` |
| 458 | API rate limiting | Rate limit config, usage dashboard | `components/crm/settings/RateLimiting.tsx` |
| 459 | Changelog | Version history, release notes | `components/crm/settings/Changelog.tsx` |
| 460 | Settings search | Search across all settings | `components/crm/settings/SettingsSearch.tsx` |

### 5.2 Navigation & Layout (Buoc 461-475)

| # | Buoc | Mo ta | File chinh |
|---|------|-------|-----------|
| 461 | Sidebar refactor | Collapsible groups, favorites, recent, search | `components/Sidebar.tsx` |
| 462 | Sidebar favorites | Pin/unpin pages, drag reorder | `components/layout/SidebarFavorites.tsx` |
| 463 | Sidebar search | Search sidebar items, keyboard navigation | `components/layout/SidebarSearch.tsx` |
| 464 | Breadcrumb system | Auto-generated breadcrumbs per route | `components/layout/Breadcrumbs.tsx` |
| 465 | Command palette | Ctrl+K global search & command palette | `components/layout/CommandPalette.tsx` |
| 466 | Notification center refactor | Bell icon, dropdown, mark read, filter | `components/crm/NotificationCenter.tsx` |
| 467 | Global search refactor | Search all entities, recent searches | `components/crm/GlobalSearch.tsx` |
| 468 | Tab navigation | Multi-tab interface for power users | `components/layout/TabNavigation.tsx` |
| 469 | Contextual help | Help tooltips, onboarding tours | `components/layout/ContextualHelp.tsx` |
| 470 | Page header standard | Unified page header: title, actions, breadcrumb | `components/layout/PageHeader.tsx` |
| 471 | Loading states | Page-level, section-level, inline loading | `components/layout/LoadingStates.tsx` |
| 472 | Error pages | 404, 500, 403, maintenance pages | `pages/NotFoundPage.tsx` |
| 473 | Keyboard shortcuts panel | Show all shortcuts, customizable | `components/layout/ShortcutsPanel.tsx` |
| 474 | Quick actions menu | + button for quick create contact/deal/task | `components/layout/QuickActions.tsx` |
| 475 | Layout persistence | Remember sidebar state, panel sizes | `hooks/ui/useLayoutPersistence.ts` |

### 5.3 Performance & UX (Buoc 476-495)

| # | Buoc | Mo ta | File chinh |
|---|------|-------|-----------|
| 476 | Virtual scrolling | Virtualized lists cho 1000+ items | `components/crm/VirtualizedList.tsx` |
| 477 | Lazy loading routes | Code split moi CRM page | `routes.ts` |
| 478 | Image optimization | Lazy load images, placeholder, srcset | `components/ui/OptimizedImage.tsx` |
| 479 | Debounced inputs | Debounce search, filter inputs globally | `hooks/ui/useDebounce.ts` |
| 480 | Optimistic UI | Instant UI feedback, rollback on error | `hooks/queries/useOptimisticUpdate.ts` |
| 481 | Skeleton loading | Per-page skeleton screens | Multiple pages |
| 482 | Infinite scroll | Option for infinite scroll vs pagination | `hooks/ui/useInfiniteScroll.ts` |
| 483 | Prefetch hover | Prefetch data on link hover | `hooks/ui/usePrefetch.ts` |
| 484 | State persistence | Persist filter, sort, view mode per page | `hooks/ui/useStatePersistence.ts` |
| 485 | Undo system | Global undo for destructive actions | `hooks/ui/useUndo.ts` |
| 486 | Batch API calls | Batch multiple API calls into one request | `api/mock/batchApi.ts` |
| 487 | Cache management | Client-side cache voi TTL, invalidation | `hooks/queries/useCache.ts` |
| 488 | Form autosave | Auto-save draft forms | `hooks/forms/useAutosave.ts` |
| 489 | Offline indicator | Show offline status, queue actions | `components/layout/OfflineIndicator.tsx` |
| 490 | Error recovery | Auto-retry failed API calls, error boundaries | `hooks/queries/useRetry.ts` |
| 491 | Accessibility audit | ARIA labels, keyboard nav, screen reader | Toan bo components |
| 492 | Color blind mode | Alternative color schemes | `hooks/ui/useColorBlindMode.ts` |
| 493 | High contrast mode | WCAG AAA contrast option | `styles/high-contrast.css` |
| 494 | Reduced motion | Respect prefers-reduced-motion | `hooks/ui/useReducedMotion.ts` |
| 495 | Performance monitoring | FPS counter, render count tracking (dev mode) | `utils/performanceMonitor.ts` |

### 5.4 Data & API Readiness (Buoc 496-520)

| # | Buoc | Mo ta | File chinh |
|---|------|-------|-----------|
| 496 | API client interface | Abstract interface cho moi API, swap mock/real | `api/apiClient.ts` |
| 497 | API error handling | Standardized error codes, user-friendly messages | `api/errorHandler.ts` |
| 498 | API interceptors | Auth token injection, refresh token, retry | `api/interceptors.ts` |
| 499 | Request queue | Queue requests khi offline, replay khi online | `api/requestQueue.ts` |
| 500 | API versioning | Support multiple API versions | `api/versioning.ts` |
| 501 | WebSocket mock | Mock real-time updates cho notifications, chat | `api/mock/websocketMock.ts` |
| 502 | File upload handler | Chunked upload, progress, cancel | `api/mock/fileUploadApi.ts` |
| 503 | GraphQL mock | Optional GraphQL layer cho complex queries | `api/mock/graphqlMock.ts` |
| 504 | API documentation | OpenAPI spec generation tu mock | `api/openApiSpec.ts` |
| 505 | Rate limiting mock | Simulate rate limits, backoff | `api/mock/rateLimiting.ts` |
| 506 | Data migration utils | Schema migration helpers, data transform | `utils/dataMigration.ts` |
| 507 | Validation layer | Shared validation between client & mock API | `utils/validation.ts` |
| 508 | Sanitization | XSS prevention, input sanitization | `utils/sanitization.ts` |
| 509 | Encryption utils | Client-side encryption cho sensitive fields | `utils/encryption.ts` |
| 510 | Logging system | Structured logging, log levels, export | `utils/logger.ts` |
| 511 | Feature detection | Browser capability detection, polyfills | `utils/featureDetection.ts` |
| 512 | Analytics events | Track user actions cho product analytics | `utils/analytics.ts` |
| 513 | A/B test framework | Client-side A/B testing, variant assignment | `utils/abTest.ts` |
| 514 | Session management | Session timeout, multi-tab sync | `utils/sessionManager.ts` |
| 515 | Deep linking | Preserve state in URL, shareable links | `utils/deepLinking.ts` |
| 516 | Print styles | Print-friendly layouts for reports, invoices | `styles/print.css` |
| 517 | CSV parser | Robust CSV parsing voi encoding detection | `utils/csvParser.ts` |
| 518 | Date utilities | Timezone handling, relative dates, business days | `utils/dateUtils.ts` |
| 519 | Number formatting | Currency, percentage, compact notation | `utils/numberFormat.ts` |
| 520 | Text utilities | Truncate, highlight, slugify, pluralize | `utils/textUtils.ts` |

---

## PHASE 6: MOBILE OPTIMIZATION & PWA (60 buoc)
### Buoc 521-580 | Trang thai: Chua bat dau

### 6.1 Mobile-First Responsive (Buoc 521-545)

| # | Buoc | Mo ta | File chinh |
|---|------|-------|-----------|
| 521 | Mobile navigation | Bottom tab bar, hamburger menu, swipe gestures | `components/layout/MobileNav.tsx` |
| 522 | Mobile sidebar | Slide-in drawer, touch-friendly | `components/layout/MobileSidebar.tsx` |
| 523 | Mobile header | Compact header, search, notifications | `components/layout/MobileHeader.tsx` |
| 524 | Touch interactions | Swipe to delete, long press, pull-to-refresh | `hooks/ui/useTouchGestures.ts` |
| 525 | Bottom sheets | Bottom sheet cho forms, filters, actions | `components/ui/bottom-sheet.tsx` |
| 526 | Mobile data table | Horizontal scroll, pinned columns, expandable rows | `components/crm/MobileDataTable.tsx` |
| 527 | Mobile card views | Touch-optimized card layouts cho all entities | `components/crm/MobileCardView.tsx` |
| 528 | Mobile forms | Full-screen form modals, step-by-step | `components/crm/MobileFormModal.tsx` |
| 529 | Mobile filters | Bottom sheet filters, chips display | `components/crm/MobileFilterSheet.tsx` |
| 530 | Mobile search | Full-screen search overlay, voice search button | `components/crm/MobileSearch.tsx` |
| 531 | Mobile dashboard | Scrollable widget cards, swipe between dashboards | `pages/crm/MobileDashboard.tsx` |
| 532 | Mobile pipeline | Horizontal scroll kanban, tap to open | `components/crm/deals/MobilePipeline.tsx` |
| 533 | Mobile contact detail | Tab-based detail view, quick actions FAB | `components/crm/contacts/MobileContactDetail.tsx` |
| 534 | Mobile deal detail | Swipe between tabs, stage progress bar | `components/crm/deals/MobileDealDetail.tsx` |
| 535 | Mobile calendar | Day/agenda view optimized, swipe nav | `components/crm/MobileCalendar.tsx` |
| 536 | Mobile task board | Vertical kanban, swipe to change status | `components/crm/MobileTaskBoard.tsx` |
| 537 | Mobile chat | Full-screen AI chat, voice input | `components/crm/MobileAIChat.tsx` |
| 538 | Mobile notifications | Push notification-style alerts | `components/crm/MobileNotifications.tsx` |
| 539 | Mobile quick actions | FAB voi quick create options | `components/crm/MobileQuickActions.tsx` |
| 540 | Responsive images | Adaptive image sizes per breakpoint | `components/ui/ResponsiveImage.tsx` |
| 541 | Touch-friendly tooltips | Long press tooltips, no hover dependency | `components/ui/TouchTooltip.tsx` |
| 542 | Mobile date picker | Native-feel date picker | `components/ui/MobileDatePicker.tsx` |
| 543 | Mobile select | Bottom sheet select cho mobile | `components/ui/MobileSelect.tsx` |
| 544 | Mobile multi-select | Chip-based multi-select, bottom sheet | `components/ui/MobileMultiSelect.tsx` |
| 545 | Mobile combobox | Full-screen search select voi add new | `components/ui/MobileCombobox.tsx` |

### 6.2 PWA & Offline (Buoc 546-560)

| # | Buoc | Mo ta | File chinh |
|---|------|-------|-----------|
| 546 | Service worker | Cache strategies, offline fallback | `public/sw.js` |
| 547 | App manifest | PWA manifest, icons, theme color violet | `public/manifest.json` |
| 548 | Install prompt | Custom install banner, A2HS | `components/layout/InstallPrompt.tsx` |
| 549 | Offline data sync | Queue changes offline, sync when online | `utils/offlineSync.ts` |
| 550 | Offline indicator | Visual indicator khi offline | `components/layout/OfflineIndicator.tsx` |
| 551 | Background sync | Sync data in background khi reconnect | `utils/backgroundSync.ts` |
| 552 | Push notifications | Web push notification registration | `utils/pushNotifications.ts` |
| 553 | Cache management | Cache versioning, cleanup, size limits | `utils/cacheManager.ts` |
| 554 | Offline pages | Offline fallback pages voi cached data | `pages/OfflinePage.tsx` |
| 555 | IndexedDB storage | Local database cho offline data | `utils/indexedDB.ts` |
| 556 | Sync conflict resolution | Handle merge conflicts khi sync | `utils/conflictResolution.ts` |
| 557 | Data compression | Compress cached data, reduce storage | `utils/compression.ts` |
| 558 | Network detection | Detect connection quality, adapt requests | `hooks/ui/useNetworkStatus.ts` |
| 559 | Prefetch strategy | Prefetch likely-needed data | `utils/prefetchStrategy.ts` |
| 560 | PWA testing | Test install, offline, sync flows | Testing |

### 6.3 Final Integration & Launch (Buoc 561-580)

| # | Buoc | Mo ta | File chinh |
|---|------|-------|-----------|
| 561 | Cross-browser testing | Chrome, Firefox, Safari, Edge | Testing |
| 562 | Responsive testing | Mobile, tablet, desktop, ultra-wide | Testing |
| 563 | Performance audit | Lighthouse score target >90 | Testing |
| 564 | Accessibility audit | WAVE, axe-core, manual keyboard test | Testing |
| 565 | Security review | XSS, CSRF, injection, data exposure | Testing |
| 566 | API contract validation | Ensure mock API matches real API spec | Testing |
| 567 | Data integrity check | Verify all mock data relationships | Testing |
| 568 | Error scenario testing | Network errors, timeout, 500, 403 | Testing |
| 569 | Load testing | Performance voi 10k+ records | Testing |
| 570 | Localization readiness | i18n key extraction, RTL support prep | `utils/i18n.ts` |
| 571 | Theme system | Dark mode, light mode, custom themes | `styles/themes/` |
| 572 | Dark mode implementation | Full dark mode support toan app | `styles/dark.css` |
| 573 | Animation review | Consistent animations, reduced motion | Toan bo components |
| 574 | Typography review | Font loading, fallback, consistency | `styles/fonts.css` |
| 575 | Icon review | Icon consistency, missing icons | Toan bo components |
| 576 | Empty state review | All pages have meaningful empty states | Toan bo pages |
| 577 | Error state review | All pages handle errors gracefully | Toan bo pages |
| 578 | Documentation | Component docs, API docs, usage guides | `docs/` |
| 579 | Storybook-style demos | Interactive component demos | `pages/ComponentShowcase.tsx` |
| 580 | Final review & sign-off | Full walkthrough, bug fixes, polish | Toan bo |

---

## TONG KET THEO MODULE

| Module | Buoc | Trang thai |
|--------|------|-----------|
| UI Components (Phase 1) | 1-120 | 90% (108/120) |
| Types & Data | 121-150 | 0% |
| Mock API | 151-170 | 0% |
| Hooks | 171-195 | 0% |
| Contacts CRUD | 196-215 | 0% |
| Companies CRUD | 216-230 | 0% |
| Deals & Pipeline | 231-250 | 0% |
| Leads | 251-260 | 0% |
| AI Chat & Copilot | 261-280 | 0% |
| AI Training | 281-290 | 0% |
| Predictive Analytics | 291-300 | 0% |
| Smart Automation | 301-315 | 0% |
| AI Dashboard & Reports | 316-340 | 0% |
| Marketing & Campaigns | 341-360 | 0% |
| Customer Service | 361-380 | 0% |
| Finance & Operations | 381-405 | 0% |
| Team & HR | 406-420 | 0% |
| Partner & External | 421-440 | 0% |
| Settings & Admin | 441-460 | 0% |
| Navigation & Layout | 461-475 | 0% |
| Performance & UX | 476-495 | 0% |
| Data & API Readiness | 496-520 | 0% |
| Mobile Responsive | 521-545 | 0% |
| PWA & Offline | 546-560 | 0% |
| Final Integration | 561-580 | 0% |

---

## GHI CHU QUAN TRONG

1. **Kien truc phan tang**: `types -> constants -> data -> api -> hooks -> components -> pages`
2. **Sonar compliance**: Moi file khong qua 1500 dong, tach component khi can
3. **Standard Mixins**: Moi entity phai co id, tenant_id, version, created_at, updated_at, deleted_at
4. **Soft Delete**: KHONG BAO GIO dung physical DELETE
5. **Mock-first**: Toan bo API la mock, de swap sang real backend sau
6. **Violet primary**: `#a855f7` cho AI-first branding
7. **Mobile-first**: Tat ca component phai responsive, uu tien touch
8. **Combobox co the them moi**: Moi dropdown nen cho phep them muc moi
9. **View modes**: Trang quan trong co Table + Card/List + Kanban views
10. **UUID v7**: Primary key la UUID v7 format
