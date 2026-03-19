import { createBrowserRouter } from "react-router";

// Layout
import { Layout } from "./components/Layout";

// Blueprint Pages
import { OverviewPage } from "./pages/OverviewPage";
import { TestPage } from "./pages/TestPage";
import { ProgressDashboard } from "./pages/ProgressDashboard";
import { DetailedPlanPage } from "./pages/DetailedPlanPage";
import DetailedPlanOverview from "./pages/DetailedPlanOverview";
import { CrmDevPlanPage } from "./pages/CrmDevPlanPage";
import { ModulesPage } from "./pages/ModulesPage";
import { AIAgentsPage } from "./pages/AIAgentsPage";
import { EvaluationPage } from "./pages/EvaluationPage";
import { AIToolsPage } from "./pages/AIToolsPage";
import { OrganizationPage } from "./pages/OrganizationPage";
import { DataArchitecturePage } from "./pages/DataArchitecturePage";
import { SecurityPage } from "./pages/SecurityPage";
import { RoadmapPage } from "./pages/RoadmapPage";
import { NotFoundPage } from "./pages/NotFoundPage";

// CRM Pages
import { CrmDashboardPage } from "./pages/crm/CrmDashboardPage";
import { ContactsPage } from "./pages/crm/ContactsPage";
import { CompaniesPage } from "./pages/crm/CompaniesPage";
import { PipelinePage } from "./pages/crm/PipelinePage";
import { TeamPage } from "./pages/crm/TeamPage";
import { ActivitiesPage } from "./pages/crm/ActivitiesPage";
import { CrmSettingsPage } from "./pages/crm/CrmSettingsPage";
import { DealDetailPage } from "./pages/crm/DealDetailPage";
import { ContactDetailPage } from "./pages/crm/ContactDetailPage";
import { CompanyDetailPage } from "./pages/crm/CompanyDetailPage";
import { DealAutomationPage } from "./pages/crm/DealAutomationPage";
import { DealScoringDashboard } from "./pages/crm/DealScoringDashboard";
import { ReportsPage } from "./pages/crm/ReportsPage";
import { EmployeeDetailPage } from "./pages/crm/EmployeeDetailPage";
import { EmailTemplatesPage } from "./pages/crm/EmailTemplatesPage";
import { LeadsPage } from "./pages/crm/LeadsPage";
import { LeadInboxPage } from "./pages/crm/LeadInboxPage";
import { CalendarPage } from "./pages/crm/CalendarPage";
import { AutomationRulesPage } from "./pages/crm/AutomationRulesPage";
import { CustomerJourneyPage } from "./pages/crm/CustomerJourneyPage";
import { IntegrationHubPage } from "./pages/crm/IntegrationHubPage";
import { AIInsightsPage } from "./pages/crm/AIInsightsPage";
import { TaskBoardPage } from "./pages/crm/TaskBoardPage";
import { ProductCatalogPage } from "./pages/crm/ProductCatalogPage";
import { KnowledgeBasePage } from "./pages/crm/KnowledgeBasePage";
import { QuotationBuilderPage } from "./pages/crm/QuotationBuilderPage";
import { SLATrackingPage } from "./pages/crm/SLATrackingPage";
import { LeaderboardPage } from "./pages/crm/LeaderboardPage";
import { ContractManagementPage } from "./pages/crm/ContractManagementPage";
import { CommissionCalculatorPage } from "./pages/crm/CommissionCalculatorPage";
import { NPSTrackerPage } from "./pages/crm/NPSTrackerPage";
import { ForecastPage } from "./pages/crm/ForecastPage";
import { CompetitorAnalysisPage } from "./pages/crm/CompetitorAnalysisPage";
import { CustomDashboardPage } from "./pages/crm/CustomDashboardPage";
import { MarketingCampaignPage } from "./pages/crm/MarketingCampaignPage";
import { VendorManagementPage } from "./pages/crm/VendorManagementPage";
import { TicketSupportPage } from "./pages/crm/TicketSupportPage";
import { ApprovalWorkflowPage } from "./pages/crm/ApprovalWorkflowPage";
import { CustomerHealthPage } from "./pages/crm/CustomerHealthPage";
import { DataImportExportPage } from "./pages/crm/DataImportExportPage";
import { RevenueAttributionPage } from "./pages/crm/RevenueAttributionPage";
import { AuditLogPage } from "./pages/crm/AuditLogPage";
import { GoalTrackingPage } from "./pages/crm/GoalTrackingPage";
import { TerritoryManagementPage } from "./pages/crm/TerritoryManagementPage";
import { DocumentManagementPage } from "./pages/crm/DocumentManagementPage";
import { SubscriptionManagementPage } from "./pages/crm/SubscriptionManagementPage";
import { PartnerPortalPage } from "./pages/crm/PartnerPortalPage";
import { GamificationPage } from "./pages/crm/GamificationPage";
import { MeetingIntelligencePage } from "./pages/crm/MeetingIntelligencePage";
import { WorkflowBuilderPage } from "./pages/crm/WorkflowBuilderPage";
import { RBACPage } from "./pages/crm/RBACPage";
import { CustomFieldsPage } from "./pages/crm/CustomFieldsPage";
import { NotificationPreferencesPage } from "./pages/crm/NotificationPreferencesPage";
import { ApiExplorerPage } from "./pages/crm/ApiExplorerPage";
import { WebhookManagerPage } from "./pages/crm/WebhookManagerPage";
import { DataImportWizardPage } from "./pages/crm/DataImportWizardPage";
import { UserProfilePage } from "./pages/crm/UserProfilePage";
import { EmailSequenceBuilderPage } from "./pages/crm/EmailSequenceBuilderPage";
import { AuditTrailPage } from "./pages/crm/AuditTrailPage";
import { SmsCampaignPage } from "./pages/crm/SmsCampaignPage";
import { AiChatbotTrainingPage } from "./pages/crm/AiChatbotTrainingPage";
import { FormBuilderPage } from "./pages/crm/FormBuilderPage";
import { LandingPageBuilderPage } from "./pages/crm/LandingPageBuilderPage";
import { CustomerPortalPage } from "./pages/crm/CustomerPortalPage";
import { SocialMediaMonitorPage } from "./pages/crm/SocialMediaMonitorPage";
import { VoipDialerPage } from "./pages/crm/VoipDialerPage";
import { SurveyBuilderPage } from "./pages/crm/SurveyBuilderPage";
import { DataEnrichmentPage } from "./pages/crm/DataEnrichmentPage";
import { PredictiveAnalyticsPage } from "./pages/crm/PredictiveAnalyticsPage";
import { ReferralProgramPage } from "./pages/crm/ReferralProgramPage";
import { LiveChatConfigPage } from "./pages/crm/LiveChatConfigPage";
import { ABTestingPage } from "./pages/crm/ABTestingPage";
import { CustomerSegmentationPage } from "./pages/crm/CustomerSegmentationPage";
import { DependencyGraphPage } from "./pages/crm/DependencyGraphPage";
import { RevenueIntelligencePage } from "./pages/crm/RevenueIntelligencePage";
import { ContentCalendarPage } from "./pages/crm/ContentCalendarPage";
import { PartnerMarketplacePage } from "./pages/crm/PartnerMarketplacePage";
import { InventoryManagementPage } from "./pages/crm/InventoryManagementPage";
import { FeedbackWallPage } from "./pages/crm/FeedbackWallPage";
import { AiTrainingDashboardPage } from "./pages/crm/AiTrainingDashboardPage";
import { MultiCurrencyPage } from "./pages/crm/MultiCurrencyPage";
import { ComplianceDashboardPage } from "./pages/crm/ComplianceDashboardPage";
import { DevPortalPage } from "./pages/crm/DevPortalPage";
import { TeamCapacityPage } from "./pages/crm/TeamCapacityPage";
import { OnboardingWorkflowPage } from "./pages/crm/OnboardingWorkflowPage";
import { TrustCenterPage } from "./pages/crm/TrustCenterPage";
import { RevenueLeakagePage } from "./pages/crm/RevenueLeakagePage";
import { RenewalPipelinePage } from "./pages/crm/RenewalPipelinePage";
import { AiCopilotSettingsPage } from "./pages/crm/AiCopilotSettingsPage";
import { CpqPage } from "./pages/crm/CpqPage";
import { Customer360Page } from "./pages/crm/Customer360Page";
import { CampaignRoiPage } from "./pages/crm/CampaignRoiPage";
import { WinLossAnalysisPage } from "./pages/crm/WinLossAnalysisPage";
import { QuotaManagementPage } from "./pages/crm/QuotaManagementPage";
import { PartnerScorecardPage } from "./pages/crm/PartnerScorecardPage";
import { DealRoomPage } from "./pages/crm/DealRoomPage";
import { RevenueWaterfallPage } from "./pages/crm/RevenueWaterfallPage";
import { ChurnPredictionPage } from "./pages/crm/ChurnPredictionPage";
import { SalesPlaybookPage } from "./pages/crm/SalesPlaybookPage";
import { AccountPlanningPage } from "./pages/crm/AccountPlanningPage";
import { EventManagerPage } from "./pages/crm/EventManagerPage";

// Component Showcase
import ComponentShowcase from "./pages/ComponentShowcase";
import FormComponentsShowcase from "./pages/FormComponentsShowcase";
import SpecializedComponentsShowcase from "./pages/SpecializedComponentsShowcase";
import DataDisplayShowcase from "./pages/DataDisplayShowcase";
import NavigationShowcase from "./pages/NavigationShowcase";
import FeedbackShowcase from "./pages/FeedbackShowcase";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      /* ===== Bản thiết kế (Blueprint) ===== */
      { index: true, Component: OverviewPage },
      { path: "test", Component: TestPage },
      { path: "progress", Component: ProgressDashboard },
      { path: "detailed-plan", Component: DetailedPlanPage },
      { path: "detailed-plan-overview", Component: DetailedPlanOverview },
      { path: "dev-plan", Component: CrmDevPlanPage },
      { path: "modules", Component: ModulesPage },
      { path: "ai-agents", Component: AIAgentsPage },
      { path: "evaluation", Component: EvaluationPage },
      { path: "ai-tools", Component: AIToolsPage },
      { path: "organization", Component: OrganizationPage },
      { path: "data-architecture", Component: DataArchitecturePage },
      { path: "security", Component: SecurityPage },
      { path: "roadmap", Component: RoadmapPage },
      { path: "404", Component: NotFoundPage },

      /* ===== CRM Preview (Phase 1) ===== */
      { path: "crm", Component: CrmDashboardPage },
      { path: "crm/contacts", Component: ContactsPage },
      { path: "crm/companies", Component: CompaniesPage },
      { path: "crm/pipeline", Component: PipelinePage },
      { path: "crm/team", Component: TeamPage },
      { path: "crm/activities", Component: ActivitiesPage },
      { path: "crm/settings", Component: CrmSettingsPage },
      { path: "crm/deals/:dealId", Component: DealDetailPage },
      { path: "crm/contacts/:contactId", Component: ContactDetailPage },
      { path: "crm/companies/:companyId", Component: CompanyDetailPage },
      { path: "crm/deals/:dealId/automation", Component: DealAutomationPage },
      { path: "crm/deals/automation", Component: DealAutomationPage },
      { path: "crm/deals/scoring", Component: DealScoringDashboard },
      { path: "crm/reports", Component: ReportsPage },
      { path: "crm/team/:employeeId", Component: EmployeeDetailPage },
      { path: "crm/email-templates", Component: EmailTemplatesPage },
      { path: "crm/leads", Component: LeadsPage },
      { path: "crm/lead-inbox", Component: LeadInboxPage },
      { path: "crm/calendar", Component: CalendarPage },
      { path: "crm/automations", Component: AutomationRulesPage },
      { path: "crm/journey", Component: CustomerJourneyPage },
      { path: "crm/integrations", Component: IntegrationHubPage },
      { path: "crm/ai-insights", Component: AIInsightsPage },
      { path: "crm/tasks", Component: TaskBoardPage },
      { path: "crm/products", Component: ProductCatalogPage },
      { path: "crm/knowledge-base", Component: KnowledgeBasePage },
      { path: "crm/quotations", Component: QuotationBuilderPage },
      { path: "crm/sla", Component: SLATrackingPage },
      { path: "crm/leaderboard", Component: LeaderboardPage },
      { path: "crm/contracts", Component: ContractManagementPage },
      { path: "crm/commissions", Component: CommissionCalculatorPage },
      { path: "crm/nps", Component: NPSTrackerPage },
      { path: "crm/forecast", Component: ForecastPage },
      { path: "crm/competitors", Component: CompetitorAnalysisPage },
      { path: "crm/custom-dashboard", Component: CustomDashboardPage },
      { path: "crm/marketing", Component: MarketingCampaignPage },
      { path: "crm/vendors", Component: VendorManagementPage },
      { path: "crm/tickets", Component: TicketSupportPage },
      { path: "crm/approvals", Component: ApprovalWorkflowPage },
      { path: "crm/customer-health", Component: CustomerHealthPage },
      { path: "crm/data-center", Component: DataImportExportPage },
      { path: "crm/attribution", Component: RevenueAttributionPage },
      { path: "crm/audit-log", Component: AuditLogPage },
      { path: "crm/goals", Component: GoalTrackingPage },
      { path: "crm/territories", Component: TerritoryManagementPage },
      { path: "crm/documents", Component: DocumentManagementPage },
      { path: "crm/subscriptions", Component: SubscriptionManagementPage },
      { path: "crm/partners", Component: PartnerPortalPage },
      { path: "crm/gamification", Component: GamificationPage },
      { path: "crm/meetings", Component: MeetingIntelligencePage },
      { path: "crm/workflow-builder", Component: WorkflowBuilderPage },
      { path: "crm/rbac", Component: RBACPage },
      { path: "crm/custom-fields", Component: CustomFieldsPage },
      { path: "crm/notifications", Component: NotificationPreferencesPage },
      { path: "crm/api-explorer", Component: ApiExplorerPage },
      { path: "crm/webhooks", Component: WebhookManagerPage },
      { path: "crm/import-wizard", Component: DataImportWizardPage },
      { path: "crm/profile", Component: UserProfilePage },
      { path: "crm/email-sequences", Component: EmailSequenceBuilderPage },
      { path: "crm/audit-trail", Component: AuditTrailPage },
      { path: "crm/sms-campaigns", Component: SmsCampaignPage },
      { path: "crm/chatbot-training", Component: AiChatbotTrainingPage },
      { path: "crm/form-builder", Component: FormBuilderPage },
      { path: "crm/landing-pages", Component: LandingPageBuilderPage },
      { path: "crm/customer-portal", Component: CustomerPortalPage },
      { path: "crm/social-monitor", Component: SocialMediaMonitorPage },
      { path: "crm/voip-dialer", Component: VoipDialerPage },
      { path: "crm/surveys", Component: SurveyBuilderPage },
      { path: "crm/data-enrichment", Component: DataEnrichmentPage },
      { path: "crm/predictive-analytics", Component: PredictiveAnalyticsPage },
      { path: "crm/referral-program", Component: ReferralProgramPage },
      { path: "crm/live-chat-config", Component: LiveChatConfigPage },
      { path: "crm/ab-testing", Component: ABTestingPage },
      { path: "crm/segmentation", Component: CustomerSegmentationPage },
      { path: "crm/dependency-graph", Component: DependencyGraphPage },
      { path: "crm/revenue-intelligence", Component: RevenueIntelligencePage },
      { path: "crm/content-calendar", Component: ContentCalendarPage },
      { path: "crm/marketplace", Component: PartnerMarketplacePage },
      { path: "crm/inventory", Component: InventoryManagementPage },
      { path: "crm/feedback-wall", Component: FeedbackWallPage },
      { path: "crm/ai-training", Component: AiTrainingDashboardPage },
      { path: "crm/multi-currency", Component: MultiCurrencyPage },
      { path: "crm/compliance", Component: ComplianceDashboardPage },
      { path: "crm/dev-portal", Component: DevPortalPage },
      { path: "crm/team-capacity", Component: TeamCapacityPage },
      { path: "crm/onboarding", Component: OnboardingWorkflowPage },
      { path: "crm/trust-center", Component: TrustCenterPage },
      { path: "crm/revenue-leakage", Component: RevenueLeakagePage },
      { path: "crm/renewals", Component: RenewalPipelinePage },
      { path: "crm/ai-copilot", Component: AiCopilotSettingsPage },
      { path: "crm/cpq", Component: CpqPage },
      { path: "crm/customer-360", Component: Customer360Page },
      { path: "crm/campaign-roi", Component: CampaignRoiPage },
      { path: "crm/win-loss", Component: WinLossAnalysisPage },
      { path: "crm/quotas", Component: QuotaManagementPage },
      { path: "crm/partner-scorecard", Component: PartnerScorecardPage },
      { path: "crm/deal-room", Component: DealRoomPage },
      { path: "crm/revenue-waterfall", Component: RevenueWaterfallPage },
      { path: "crm/churn-prediction", Component: ChurnPredictionPage },
      { path: "crm/sales-playbook", Component: SalesPlaybookPage },
      { path: "crm/account-planning", Component: AccountPlanningPage },
      { path: "crm/event-manager", Component: EventManagerPage },
      
      /* ===== Component Showcase (Dev) ===== */
      { path: "showcase", Component: ComponentShowcase },
      { path: "showcase/forms", Component: FormComponentsShowcase },
      { path: "showcase/specialized", Component: SpecializedComponentsShowcase },
      { path: "showcase/data-display", Component: DataDisplayShowcase },
      { path: "showcase/navigation", Component: NavigationShowcase },
      { path: "showcase/feedback", Component: FeedbackShowcase },
      
      /* ===== 404 Catch All ===== */
      { path: "*", Component: NotFoundPage },
    ],
  },
]);