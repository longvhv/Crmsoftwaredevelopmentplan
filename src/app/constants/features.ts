/* ============================================================
 * Feature Flags - Feature Toggle System
 * Centralized feature management and A/B testing
 * ============================================================ */

/* ============================================================
 * Feature Definitions
 * ============================================================ */

export interface FeatureFlag {
  /** Feature ID */
  id: string;
  /** Feature name */
  name: string;
  /** Feature description */
  description: string;
  /** Is enabled globally */
  enabled: boolean;
  /** Enabled for specific tenants */
  enabledForTenants?: string[];
  /** Enabled for specific users */
  enabledForUsers?: string[];
  /** Enabled for percentage of users (0-100) */
  rolloutPercentage?: number;
  /** Feature dependencies (other feature IDs) */
  dependencies?: string[];
  /** Beta feature flag */
  beta?: boolean;
  /** Deprecated flag */
  deprecated?: boolean;
}

/* ============================================================
 * Core Features
 * ============================================================ */

export const CORE_FEATURES: Record<string, FeatureFlag> = {
  // CRM Core
  contacts: {
    id: "contacts",
    name: "Quản lý liên hệ",
    description: "Quản lý danh bạ khách hàng và liên hệ",
    enabled: true,
  },
  deals: {
    id: "deals",
    name: "Quản lý deal",
    description: "Quản lý cơ hội kinh doanh",
    enabled: true,
  },
  leads: {
    id: "leads",
    name: "Quản lý lead",
    description: "Quản lý khách hàng tiềm năng",
    enabled: true,
  },
  activities: {
    id: "activities",
    name: "Hoạt động",
    description: "Theo dõi hoạt động CRM",
    enabled: true,
  },
  tasks: {
    id: "tasks",
    name: "Nhiệm vụ",
    description: "Quản lý công việc",
    enabled: true,
  },

  // Products & Finance
  products: {
    id: "products",
    name: "Sản phẩm",
    description: "Quản lý danh mục sản phẩm",
    enabled: true,
  },
  quotations: {
    id: "quotations",
    name: "Báo giá",
    description: "Tạo và quản lý báo giá",
    enabled: true,
  },
  contracts: {
    id: "contracts",
    name: "Hợp đồng",
    description: "Quản lý hợp đồng",
    enabled: true,
  },

  // Support
  tickets: {
    id: "tickets",
    name: "Hỗ trợ",
    description: "Hệ thống ticket hỗ trợ",
    enabled: true,
  },

  // Analytics
  dashboards: {
    id: "dashboards",
    name: "Dashboard",
    description: "Bảng điều khiển và báo cáo",
    enabled: true,
  },
  reports: {
    id: "reports",
    name: "Báo cáo",
    description: "Báo cáo chi tiết và phân tích",
    enabled: true,
  },
} as const;

/* ============================================================
 * AI Features
 * ============================================================ */

export const AI_FEATURES: Record<string, FeatureFlag> = {
  aiScoring: {
    id: "ai-scoring",
    name: "AI Lead Scoring",
    description: "Tự động tính điểm lead/contact bằng AI",
    enabled: true,
    beta: false,
  },
  aiRecommendations: {
    id: "ai-recommendations",
    name: "AI Recommendations",
    description: "Đề xuất hành động tiếp theo từ AI",
    enabled: true,
    beta: false,
  },
  aiEmailComposer: {
    id: "ai-email-composer",
    name: "AI Email Composer",
    description: "Soạn email tự động bằng AI",
    enabled: true,
    beta: true,
  },
  aiSentimentAnalysis: {
    id: "ai-sentiment-analysis",
    name: "AI Sentiment Analysis",
    description: "Phân tích cảm xúc từ email/chat",
    enabled: true,
    beta: true,
  },
  aiChatbot: {
    id: "ai-chatbot",
    name: "AI Chatbot",
    description: "Chatbot hỗ trợ khách hàng",
    enabled: false,
    beta: true,
  },
  aiVoiceAnalysis: {
    id: "ai-voice-analysis",
    name: "AI Voice Analysis",
    description: "Phân tích cuộc gọi bằng AI",
    enabled: false,
    beta: true,
  },
  aiPredictiveForecasting: {
    id: "ai-predictive-forecasting",
    name: "AI Predictive Forecasting",
    description: "Dự báo doanh thu bằng AI",
    enabled: true,
    beta: false,
  },
} as const;

/* ============================================================
 * Advanced Features
 * ============================================================ */

export const ADVANCED_FEATURES: Record<string, FeatureFlag> = {
  // Automation
  workflows: {
    id: "workflows",
    name: "Workflows",
    description: "Tự động hóa quy trình",
    enabled: true,
  },
  automationRules: {
    id: "automation-rules",
    name: "Automation Rules",
    description: "Quy tắc tự động",
    enabled: true,
  },

  // Marketing
  emailCampaigns: {
    id: "email-campaigns",
    name: "Email Campaigns",
    description: "Chiến dịch email marketing",
    enabled: true,
  },
  landingPages: {
    id: "landing-pages",
    name: "Landing Pages",
    description: "Tạo landing page",
    enabled: false,
    beta: true,
  },
  abTesting: {
    id: "ab-testing",
    name: "A/B Testing",
    description: "Thử nghiệm A/B",
    enabled: false,
    beta: true,
  },

  // Customer Success
  customerHealth: {
    id: "customer-health",
    name: "Customer Health Score",
    description: "Điểm sức khỏe khách hàng",
    enabled: true,
  },
  nps: {
    id: "nps",
    name: "NPS Surveys",
    description: "Khảo sát NPS",
    enabled: true,
  },
  churnPrediction: {
    id: "churn-prediction",
    name: "Churn Prediction",
    description: "Dự đoán rủi ro mất khách",
    enabled: true,
    dependencies: ["ai-scoring"],
  },

  // Advanced Analytics
  advancedAnalytics: {
    id: "advanced-analytics",
    name: "Advanced Analytics",
    description: "Phân tích nâng cao",
    enabled: true,
  },
  customDashboards: {
    id: "custom-dashboards",
    name: "Custom Dashboards",
    description: "Tùy chỉnh dashboard",
    enabled: true,
  },
  dataExport: {
    id: "data-export",
    name: "Data Export",
    description: "Xuất dữ liệu",
    enabled: true,
  },

  // Integrations
  apiAccess: {
    id: "api-access",
    name: "API Access",
    description: "Truy cập API",
    enabled: true,
  },
  webhooks: {
    id: "webhooks",
    name: "Webhooks",
    description: "Webhook tích hợp",
    enabled: true,
  },
  zapierIntegration: {
    id: "zapier-integration",
    name: "Zapier Integration",
    description: "Tích hợp Zapier",
    enabled: false,
    beta: true,
  },
} as const;

/* ============================================================
 * UI/UX Features
 * ============================================================ */

export const UI_FEATURES: Record<string, FeatureFlag> = {
  darkMode: {
    id: "dark-mode",
    name: "Dark Mode",
    description: "Chế độ tối",
    enabled: true,
  },
  compactView: {
    id: "compact-view",
    name: "Compact View",
    description: "Chế độ hiển thị gọn",
    enabled: true,
  },
  kanbanView: {
    id: "kanban-view",
    name: "Kanban View",
    description: "Hiển thị dạng Kanban",
    enabled: true,
  },
  calendarView: {
    id: "calendar-view",
    name: "Calendar View",
    description: "Hiển thị lịch",
    enabled: true,
  },
  timelineView: {
    id: "timeline-view",
    name: "Timeline View",
    description: "Hiển thị timeline",
    enabled: false,
    beta: true,
  },
  inlineEditing: {
    id: "inline-editing",
    name: "Inline Editing",
    description: "Chỉnh sửa trực tiếp trên bảng",
    enabled: true,
  },
  bulkActions: {
    id: "bulk-actions",
    name: "Bulk Actions",
    description: "Hành động hàng loạt",
    enabled: true,
  },
  advancedFilters: {
    id: "advanced-filters",
    name: "Advanced Filters",
    description: "Bộ lọc nâng cao",
    enabled: true,
  },
  savedViews: {
    id: "saved-views",
    name: "Saved Views",
    description: "Lưu chế độ xem",
    enabled: true,
  },
  keyboardShortcuts: {
    id: "keyboard-shortcuts",
    name: "Keyboard Shortcuts",
    description: "Phím tắt",
    enabled: true,
  },
} as const;

/* ============================================================
 * Experimental Features
 * ============================================================ */

export const EXPERIMENTAL_FEATURES: Record<string, FeatureFlag> = {
  realtimeCollaboration: {
    id: "realtime-collaboration",
    name: "Real-time Collaboration",
    description: "Cộng tác thời gian thực",
    enabled: false,
    beta: true,
  },
  voiceCommands: {
    id: "voice-commands",
    name: "Voice Commands",
    description: "Điều khiển bằng giọng nói",
    enabled: false,
    beta: true,
  },
  mobileApp: {
    id: "mobile-app",
    name: "Mobile App",
    description: "Ứng dụng di động",
    enabled: false,
    beta: true,
  },
  offlineMode: {
    id: "offline-mode",
    name: "Offline Mode",
    description: "Chế độ offline",
    enabled: false,
    beta: true,
  },
} as const;

/* ============================================================
 * All Features Combined
 * ============================================================ */

export const ALL_FEATURES: Record<string, FeatureFlag> = {
  ...CORE_FEATURES,
  ...AI_FEATURES,
  ...ADVANCED_FEATURES,
  ...UI_FEATURES,
  ...EXPERIMENTAL_FEATURES,
} as const;

/* ============================================================
 * Feature Groups
 * ============================================================ */

export const FEATURE_GROUPS = {
  core: "Core Features",
  ai: "AI Features",
  advanced: "Advanced Features",
  ui: "UI/UX Features",
  experimental: "Experimental Features",
} as const;

export const FEATURES_BY_GROUP: Record<string, FeatureFlag[]> = {
  core: Object.values(CORE_FEATURES),
  ai: Object.values(AI_FEATURES),
  advanced: Object.values(ADVANCED_FEATURES),
  ui: Object.values(UI_FEATURES),
  experimental: Object.values(EXPERIMENTAL_FEATURES),
};

/* ============================================================
 * Feature Check Functions
 * ============================================================ */

/** Check if feature is enabled globally */
export function isFeatureEnabled(featureId: string): boolean {
  const feature = ALL_FEATURES[featureId];
  return feature?.enabled ?? false;
}

/** Check if feature is enabled for tenant */
export function isFeatureEnabledForTenant(
  featureId: string,
  tenantId: string
): boolean {
  const feature = ALL_FEATURES[featureId];
  if (!feature) return false;

  // Check global enable
  if (!feature.enabled) return false;

  // Check tenant-specific enable
  if (feature.enabledForTenants) {
    return feature.enabledForTenants.includes(tenantId);
  }

  return true;
}

/** Check if feature is enabled for user */
export function isFeatureEnabledForUser(
  featureId: string,
  userId: string,
  tenantId: string
): boolean {
  const feature = ALL_FEATURES[featureId];
  if (!feature) return false;

  // Check tenant-level first
  if (!isFeatureEnabledForTenant(featureId, tenantId)) return false;

  // Check user-specific enable
  if (feature.enabledForUsers) {
    return feature.enabledForUsers.includes(userId);
  }

  // Check rollout percentage
  if (feature.rolloutPercentage !== undefined) {
    const hash = hashString(userId);
    const userPercentage = (hash % 100) + 1;
    return userPercentage <= feature.rolloutPercentage;
  }

  return true;
}

/** Check if all dependencies are enabled */
export function areDependenciesEnabled(featureId: string): boolean {
  const feature = ALL_FEATURES[featureId];
  if (!feature || !feature.dependencies) return true;

  return feature.dependencies.every((depId) => isFeatureEnabled(depId));
}

/** Get all enabled features */
export function getEnabledFeatures(): FeatureFlag[] {
  return Object.values(ALL_FEATURES).filter((feature) => feature.enabled);
}

/** Get all beta features */
export function getBetaFeatures(): FeatureFlag[] {
  return Object.values(ALL_FEATURES).filter((feature) => feature.beta);
}

/** Get all deprecated features */
export function getDeprecatedFeatures(): FeatureFlag[] {
  return Object.values(ALL_FEATURES).filter((feature) => feature.deprecated);
}

/* ============================================================
 * Utility Functions
 * ============================================================ */

/** Simple hash function for user ID (for rollout percentage) */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/** Get feature by ID */
export function getFeature(featureId: string): FeatureFlag | undefined {
  return ALL_FEATURES[featureId];
}

/** Get features by group */
export function getFeaturesByGroup(group: keyof typeof FEATURE_GROUPS): FeatureFlag[] {
  return FEATURES_BY_GROUP[group] || [];
}

/** Check if feature is in beta */
export function isFeatureBeta(featureId: string): boolean {
  return ALL_FEATURES[featureId]?.beta ?? false;
}

/** Check if feature is deprecated */
export function isFeatureDeprecated(featureId: string): boolean {
  return ALL_FEATURES[featureId]?.deprecated ?? false;
}
