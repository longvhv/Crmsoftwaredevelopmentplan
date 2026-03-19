/* ============================================================
 * API Endpoints - Centralized API URL Configurations
 * Theo chuẩn Guidelines: /api/{service}/v1/{resource}
 * ============================================================ */

/* ============================================================
 * Base URLs
 * ============================================================ */

/** API base URL */
export const API_BASE_URL = "/api";

/** Page base URL */
export const PAGE_BASE_URL = "/page";

/** API version */
export const API_VERSION = "v1";

/* ============================================================
 * Service Base Paths (theo Guidelines - singular nouns)
 * ============================================================ */

export const SERVICE_PATHS = {
  // Core services
  tenant: "/api/tenant/v1",
  user: "/api/user/v1",
  authentication: "/api/authentication/v1",

  // CRM services
  contact: "/api/contact/v1",
  deal: "/api/deal/v1",
  lead: "/api/lead/v1",
  employee: "/api/employee/v1",
  activity: "/api/activity/v1",

  // Products & Finance
  product: "/api/product/v1",
  quotation: "/api/quotation/v1",
  contract: "/api/contract/v1",
  invoice: "/api/invoice/v1",

  // Support
  support: "/api/support/v1",
  ticket: "/api/ticket/v1",

  // Customer Success
  customerSuccess: "/api/customer-success/v1",

  // Marketing
  marketing: "/api/marketing/v1",
  campaign: "/api/campaign/v1",

  // Analytics
  analytics: "/api/analytics/v1",
  report: "/api/report/v1",

  // AI & Automation
  ai: "/api/ai/v1",
  automation: "/api/automation/v1",

  // Settings
  settings: "/api/settings/v1",
} as const;

/* ============================================================
 * Contact Endpoints
 * ============================================================ */

export const CONTACT_ENDPOINTS = {
  list: `${SERVICE_PATHS.contact}/contacts`,
  create: `${SERVICE_PATHS.contact}/contacts`,
  detail: (id: string) => `${SERVICE_PATHS.contact}/contacts/${id}`,
  update: (id: string) => `${SERVICE_PATHS.contact}/contacts/${id}`,
  delete: (id: string) => `${SERVICE_PATHS.contact}/contacts/${id}`,
  bulkDelete: `${SERVICE_PATHS.contact}/contacts/bulk-delete`,
  export: `${SERVICE_PATHS.contact}/contacts/export`,
  import: `${SERVICE_PATHS.contact}/contacts/import`,
  search: `${SERVICE_PATHS.contact}/contacts/search`,
  duplicates: `${SERVICE_PATHS.contact}/contacts/duplicates`,
  merge: `${SERVICE_PATHS.contact}/contacts/merge`,
} as const;

/* ============================================================
 * Deal Endpoints
 * ============================================================ */

export const DEAL_ENDPOINTS = {
  list: `${SERVICE_PATHS.deal}/deals`,
  create: `${SERVICE_PATHS.deal}/deals`,
  detail: (id: string) => `${SERVICE_PATHS.deal}/deals/${id}`,
  update: (id: string) => `${SERVICE_PATHS.deal}/deals/${id}`,
  delete: (id: string) => `${SERVICE_PATHS.deal}/deals/${id}`,
  changeStage: (id: string) => `${SERVICE_PATHS.deal}/deals/${id}/stage`,
  bulkDelete: `${SERVICE_PATHS.deal}/deals/bulk-delete`,
  bulkChangeStage: `${SERVICE_PATHS.deal}/deals/bulk-change-stage`,
  pipeline: `${SERVICE_PATHS.deal}/deals/pipeline`,
  forecast: `${SERVICE_PATHS.deal}/deals/forecast`,
  export: `${SERVICE_PATHS.deal}/deals/export`,
} as const;

/* ============================================================
 * Lead Endpoints
 * ============================================================ */

export const LEAD_ENDPOINTS = {
  list: `${SERVICE_PATHS.lead}/leads`,
  create: `${SERVICE_PATHS.lead}/leads`,
  detail: (id: string) => `${SERVICE_PATHS.lead}/leads/${id}`,
  update: (id: string) => `${SERVICE_PATHS.lead}/leads/${id}`,
  delete: (id: string) => `${SERVICE_PATHS.lead}/leads/${id}`,
  convert: (id: string) => `${SERVICE_PATHS.lead}/leads/${id}/convert`,
  bulkConvert: `${SERVICE_PATHS.lead}/leads/bulk-convert`,
  score: (id: string) => `${SERVICE_PATHS.lead}/leads/${id}/score`,
  export: `${SERVICE_PATHS.lead}/leads/export`,
  import: `${SERVICE_PATHS.lead}/leads/import`,
} as const;

/* ============================================================
 * Employee Endpoints
 * ============================================================ */

export const EMPLOYEE_ENDPOINTS = {
  list: `${SERVICE_PATHS.employee}/employees`,
  create: `${SERVICE_PATHS.employee}/employees`,
  detail: (id: string) => `${SERVICE_PATHS.employee}/employees/${id}`,
  update: (id: string) => `${SERVICE_PATHS.employee}/employees/${id}`,
  delete: (id: string) => `${SERVICE_PATHS.employee}/employees/${id}`,
  performance: (id: string) => `${SERVICE_PATHS.employee}/employees/${id}/performance`,
  kpis: (id: string) => `${SERVICE_PATHS.employee}/employees/${id}/kpis`,
} as const;

/* ============================================================
 * Activity Endpoints
 * ============================================================ */

export const ACTIVITY_ENDPOINTS = {
  list: `${SERVICE_PATHS.activity}/activities`,
  create: `${SERVICE_PATHS.activity}/activities`,
  detail: (id: string) => `${SERVICE_PATHS.activity}/activities/${id}`,
  update: (id: string) => `${SERVICE_PATHS.activity}/activities/${id}`,
  delete: (id: string) => `${SERVICE_PATHS.activity}/activities/${id}`,
  complete: (id: string) => `${SERVICE_PATHS.activity}/activities/${id}/complete`,
  timeline: `${SERVICE_PATHS.activity}/activities/timeline`,
} as const;

/* ============================================================
 * Product Endpoints
 * ============================================================ */

export const PRODUCT_ENDPOINTS = {
  list: `${SERVICE_PATHS.product}/products`,
  create: `${SERVICE_PATHS.product}/products`,
  detail: (id: string) => `${SERVICE_PATHS.product}/products/${id}`,
  update: (id: string) => `${SERVICE_PATHS.product}/products/${id}`,
  delete: (id: string) => `${SERVICE_PATHS.product}/products/${id}`,
  pricingTiers: (id: string) => `${SERVICE_PATHS.product}/products/${id}/pricing-tiers`,
  export: `${SERVICE_PATHS.product}/products/export`,
} as const;

/* ============================================================
 * Quotation Endpoints
 * ============================================================ */

export const QUOTATION_ENDPOINTS = {
  list: `${SERVICE_PATHS.quotation}/quotations`,
  create: `${SERVICE_PATHS.quotation}/quotations`,
  detail: (id: string) => `${SERVICE_PATHS.quotation}/quotations/${id}`,
  update: (id: string) => `${SERVICE_PATHS.quotation}/quotations/${id}`,
  delete: (id: string) => `${SERVICE_PATHS.quotation}/quotations/${id}`,
  send: (id: string) => `${SERVICE_PATHS.quotation}/quotations/${id}/send`,
  accept: (id: string) => `${SERVICE_PATHS.quotation}/quotations/${id}/accept`,
  reject: (id: string) => `${SERVICE_PATHS.quotation}/quotations/${id}/reject`,
  pdf: (id: string) => `${SERVICE_PATHS.quotation}/quotations/${id}/pdf`,
} as const;

/* ============================================================
 * Contract Endpoints
 * ============================================================ */

export const CONTRACT_ENDPOINTS = {
  list: `${SERVICE_PATHS.contract}/contracts`,
  create: `${SERVICE_PATHS.contract}/contracts`,
  detail: (id: string) => `${SERVICE_PATHS.contract}/contracts/${id}`,
  update: (id: string) => `${SERVICE_PATHS.contract}/contracts/${id}`,
  delete: (id: string) => `${SERVICE_PATHS.contract}/contracts/${id}`,
  renew: (id: string) => `${SERVICE_PATHS.contract}/contracts/${id}/renew`,
  terminate: (id: string) => `${SERVICE_PATHS.contract}/contracts/${id}/terminate`,
  amendments: (id: string) => `${SERVICE_PATHS.contract}/contracts/${id}/amendments`,
  pdf: (id: string) => `${SERVICE_PATHS.contract}/contracts/${id}/pdf`,
} as const;

/* ============================================================
 * Support Ticket Endpoints
 * ============================================================ */

export const TICKET_ENDPOINTS = {
  list: `${SERVICE_PATHS.ticket}/tickets`,
  create: `${SERVICE_PATHS.ticket}/tickets`,
  detail: (id: string) => `${SERVICE_PATHS.ticket}/tickets/${id}`,
  update: (id: string) => `${SERVICE_PATHS.ticket}/tickets/${id}`,
  delete: (id: string) => `${SERVICE_PATHS.ticket}/tickets/${id}`,
  messages: (id: string) => `${SERVICE_PATHS.ticket}/tickets/${id}/messages`,
  addMessage: (id: string) => `${SERVICE_PATHS.ticket}/tickets/${id}/messages`,
  resolve: (id: string) => `${SERVICE_PATHS.ticket}/tickets/${id}/resolve`,
  reopen: (id: string) => `${SERVICE_PATHS.ticket}/tickets/${id}/reopen`,
  assign: (id: string) => `${SERVICE_PATHS.ticket}/tickets/${id}/assign`,
} as const;

/* ============================================================
 * AI Endpoints
 * ============================================================ */

export const AI_ENDPOINTS = {
  // Scoring
  scoreContact: (id: string) => `${SERVICE_PATHS.ai}/score/contact/${id}`,
  scoreLead: (id: string) => `${SERVICE_PATHS.ai}/score/lead/${id}`,
  scoreDeal: (id: string) => `${SERVICE_PATHS.ai}/score/deal/${id}`,

  // Recommendations
  nextAction: `${SERVICE_PATHS.ai}/recommend/next-action`,
  emailSubject: `${SERVICE_PATHS.ai}/recommend/email-subject`,
  dealStrategy: `${SERVICE_PATHS.ai}/recommend/deal-strategy`,

  // Generation
  composeEmail: `${SERVICE_PATHS.ai}/generate/email`,
  summarize: `${SERVICE_PATHS.ai}/generate/summary`,
  sentimentAnalysis: `${SERVICE_PATHS.ai}/analyze/sentiment`,

  // Chatbot
  chat: `${SERVICE_PATHS.ai}/chat`,
  chatHistory: (sessionId: string) => `${SERVICE_PATHS.ai}/chat/${sessionId}/history`,
} as const;

/* ============================================================
 * Analytics Endpoints
 * ============================================================ */

export const ANALYTICS_ENDPOINTS = {
  dashboard: `${SERVICE_PATHS.analytics}/dashboard`,
  salesOverview: `${SERVICE_PATHS.analytics}/sales/overview`,
  salesTrends: `${SERVICE_PATHS.analytics}/sales/trends`,
  pipelineAnalysis: `${SERVICE_PATHS.analytics}/pipeline/analysis`,
  conversionRates: `${SERVICE_PATHS.analytics}/conversion-rates`,
  topPerformers: `${SERVICE_PATHS.analytics}/top-performers`,
  activityHeatmap: `${SERVICE_PATHS.analytics}/activity-heatmap`,
  forecastAccuracy: `${SERVICE_PATHS.analytics}/forecast-accuracy`,
} as const;

/* ============================================================
 * Search & Global Endpoints
 * ============================================================ */

export const SEARCH_ENDPOINTS = {
  global: `${API_BASE_URL}/search/global`,
  contacts: `${API_BASE_URL}/search/contacts`,
  deals: `${API_BASE_URL}/search/deals`,
  leads: `${API_BASE_URL}/search/leads`,
  activities: `${API_BASE_URL}/search/activities`,
} as const;

/* ============================================================
 * Settings Endpoints
 * ============================================================ */

export const SETTINGS_ENDPOINTS = {
  profile: `${SERVICE_PATHS.settings}/profile`,
  preferences: `${SERVICE_PATHS.settings}/preferences`,
  notifications: `${SERVICE_PATHS.settings}/notifications`,
  customFields: `${SERVICE_PATHS.settings}/custom-fields`,
  tags: `${SERVICE_PATHS.settings}/tags`,
  roles: `${SERVICE_PATHS.settings}/roles`,
  permissions: `${SERVICE_PATHS.settings}/permissions`,
  integrations: `${SERVICE_PATHS.settings}/integrations`,
  webhooks: `${SERVICE_PATHS.settings}/webhooks`,
  apiKeys: `${SERVICE_PATHS.settings}/api-keys`,
} as const;

/* ============================================================
 * Authentication Endpoints
 * ============================================================ */

export const AUTH_ENDPOINTS = {
  login: `${SERVICE_PATHS.authentication}/login`,
  logout: `${SERVICE_PATHS.authentication}/logout`,
  register: `${SERVICE_PATHS.authentication}/register`,
  refreshToken: `${SERVICE_PATHS.authentication}/refresh-token`,
  forgotPassword: `${SERVICE_PATHS.authentication}/forgot-password`,
  resetPassword: `${SERVICE_PATHS.authentication}/reset-password`,
  verifyEmail: `${SERVICE_PATHS.authentication}/verify-email`,
  changePassword: `${SERVICE_PATHS.authentication}/change-password`,
  mfa: {
    enable: `${SERVICE_PATHS.authentication}/mfa/enable`,
    disable: `${SERVICE_PATHS.authentication}/mfa/disable`,
    verify: `${SERVICE_PATHS.authentication}/mfa/verify`,
  },
} as const;

/* ============================================================
 * Utility Functions
 * ============================================================ */

/** Build full API URL */
export function buildApiUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;

  if (params && Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ).toString();
    url += `?${queryString}`;
  }

  return url;
}

/** Build pagination params */
export function buildPaginationParams(page: number, pageSize: number): Record<string, number> {
  return { page, pageSize };
}

/** Build sort params */
export function buildSortParams(field: string, direction: "asc" | "desc"): Record<string, string> {
  return { sortBy: field, sortOrder: direction };
}

/** Build filter params */
export function buildFilterParams(filters: Record<string, unknown>): Record<string, string> {
  const params: Record<string, string> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      params[key] = String(value);
    }
  });

  return params;
}

/** Get endpoint by entity type */
export function getEntityEndpoints(entityType: string) {
  const endpointMap = {
    contact: CONTACT_ENDPOINTS,
    deal: DEAL_ENDPOINTS,
    lead: LEAD_ENDPOINTS,
    employee: EMPLOYEE_ENDPOINTS,
    activity: ACTIVITY_ENDPOINTS,
    product: PRODUCT_ENDPOINTS,
    quotation: QUOTATION_ENDPOINTS,
    contract: CONTRACT_ENDPOINTS,
    ticket: TICKET_ENDPOINTS,
  };

  return endpointMap[entityType as keyof typeof endpointMap];
}
