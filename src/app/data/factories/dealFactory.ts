/* ============================================================
 * Deal Mock Factory
 * Generate realistic deal data
 * ============================================================ */

import type { Deal, DealStage, DealPriority, CurrencyCode } from "@/types";
import { generateDealDates } from "../generators/dates";
import { DEAL_STAGE_PROBABILITIES } from "@/constants";

/* ============================================================
 * Factory Configuration
 * ============================================================ */

const DEFAULT_TENANT_ID = "018d0001-0001-7001-8001-000000000001";

const DEAL_STAGES: DealStage[] = [
  "qualification",
  "discovery",
  "proposal",
  "negotiation",
  "closed-won",
  "closed-lost",
];

const DEAL_PRIORITIES: DealPriority[] = ["hot", "warm", "cold"];

const PIPELINES = [
  "Enterprise Sales",
  "SMB Sales",
  "Inbound Sales",
  "Partner Channel",
  "Direct Sales",
];

const DEAL_NAME_TEMPLATES = [
  "{company} - Enterprise License",
  "{company} - {product} Implementation",
  "{company} - Annual Subscription",
  "{company} - Consulting Services",
  "{company} - Support Package",
  "{company} - Premium Plan",
  "{company} - Professional Services",
  "{company} - Cloud Migration",
];

const PRODUCTS = [
  "CRM Software",
  "ERP System",
  "Marketing Automation",
  "Analytics Platform",
  "Cloud Storage",
  "Cybersecurity Suite",
  "HR Management System",
  "Project Management Tool",
];

/* ============================================================
 * Helper Functions
 * ============================================================ */

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomBool(probability = 0.5): boolean {
  return Math.random() < probability;
}

function generateUUID(): string {
  return `018d${Math.random().toString(16).slice(2, 6)}-${Math.random().toString(16).slice(2, 6)}-7${Math.random().toString(16).slice(2, 4)}-${Math.random().toString(16).slice(2, 6)}-${Math.random().toString(16).slice(2, 14)}`;
}

function generateDealValue(stage: DealStage): number {
  // Deal values vary by stage (closed deals tend to be more valuable)
  const baseValue = Math.random() * Math.random() * 1000000000; // 0-1B VND, skewed low
  
  if (stage === "closed-won") {
    // Closed-won deals tend to be higher value
    return Math.floor(baseValue * 1.5) + 50000000; // Min 50M VND
  } else if (stage === "closed-lost") {
    // Lost deals are random
    return Math.floor(baseValue);
  } else {
    // Active deals
    return Math.floor(baseValue * 1.2);
  }
}

function generateDealName(contactName?: string): string {
  const template = randomItem(DEAL_NAME_TEMPLATES);
  const company = contactName || `Company ${Math.floor(Math.random() * 1000)}`;
  const product = randomItem(PRODUCTS);
  
  return template
    .replace("{company}", company)
    .replace("{product}", product);
}

function getLostReason(): string | undefined {
  const reasons = [
    "Giá cả không cạnh tranh",
    "Chọn đối thủ cạnh tranh",
    "Ngân sách bị cắt giảm",
    "Không phù hợp với nhu cầu",
    "Thời gian triển khai quá lâu",
    "Thiếu tính năng quan trọng",
    "Khách hàng hủy dự án",
    "Không liên lạc được",
  ];
  
  return randomItem(reasons);
}

/* ============================================================
 * Deal Factory
 * ============================================================ */

export interface DealFactoryOptions {
  tenantId?: string;
  stage?: DealStage;
  priority?: DealPriority;
  currency?: CurrencyCode;
  contactId?: string;
  ownerId?: string;
  pipeline?: string;
}

/** Create single deal */
export function createDeal(options: DealFactoryOptions = {}): Deal {
  const {
    tenantId = DEFAULT_TENANT_ID,
    stage = randomItem(DEAL_STAGES),
    priority = randomItem(DEAL_PRIORITIES),
    currency = "VND" as CurrencyCode,
    contactId = randomBool(0.8) ? generateUUID() : undefined,
    ownerId = randomBool(0.95) ? generateUUID() : undefined,
    pipeline = randomItem(PIPELINES),
  } = options;

  const dates = generateDealDates();
  const value = generateDealValue(stage);
  const probability = DEAL_STAGE_PROBABILITIES[stage];
  
  // Determine if deal is won/lost
  const won = stage === "closed-won" ? true : (stage === "closed-lost" ? false : undefined);
  const actualCloseDate = stage === "closed-won" || stage === "closed-lost" 
    ? dates.actualCloseDate 
    : undefined;

  const deal: Deal = {
    // Standard Mixins
    id: generateUUID(),
    tenantId,
    version: 1,
    createdAt: dates.createdAt.toISOString(),
    updatedAt: dates.updatedAt.toISOString(),
    deletedAt: null,

    // Basic info
    name: generateDealName(),
    contactId,
    
    // Financial
    value,
    currency,
    
    // Stage & Status
    stage,
    probability,
    priority,
    
    // Ownership
    ownerId,
    
    // Dates
    expectedCloseDate: dates.expectedCloseDate.toISOString().split("T")[0],
    actualCloseDate: actualCloseDate?.toISOString().split("T")[0],
    
    // Outcome
    won,
    lostReason: stage === "closed-lost" ? getLostReason() : undefined,
    
    // Classification
    pipeline,
    source: randomItem(["website", "referral", "social", "event", "cold-call", "partner"]),
    
    // AI scoring
    aiScore: Math.floor(Math.random() * 101),
    aiMetadata: {
      lastScoredAt: dates.updatedAt.toISOString(),
      scoringModel: "deal-ai-v1.5",
      confidence: Math.random() * 0.3 + 0.7,
      factors: [
        { name: "deal_size", weight: 0.3, value: Math.random() },
        { name: "buyer_intent", weight: 0.25, value: Math.random() },
        { name: "competition", weight: 0.2, value: Math.random() },
        { name: "timeline", weight: 0.25, value: Math.random() },
      ],
    },
    
    // Tags
    tags: Array.from({ length: Math.floor(Math.random() * 4) }, () => generateUUID()),
    
    // Custom fields
    customFields: randomBool(0.4) ? {
      productType: randomItem(PRODUCTS),
      leadSource: randomItem(["website", "referral", "cold-call"]),
      competitorName: randomBool(0.5) ? randomItem(["Competitor A", "Competitor B", "Competitor C"]) : undefined,
    } : {},
  };

  return deal;
}

/** Create multiple deals */
export function createDeals(count: number, options: DealFactoryOptions = {}): Deal[] {
  return Array.from({ length: count }, () => createDeal(options));
}

/** Create deals with realistic stage distribution */
export function createDealsWithStageDistribution(totalCount: number): Deal[] {
  // Realistic distribution:
  // 15% qualification
  // 20% discovery
  // 25% proposal
  // 20% negotiation
  // 15% closed-won
  // 5% closed-lost
  
  const distribution: Record<DealStage, number> = {
    qualification: Math.floor(totalCount * 0.15),
    discovery: Math.floor(totalCount * 0.20),
    proposal: Math.floor(totalCount * 0.25),
    negotiation: Math.floor(totalCount * 0.20),
    "closed-won": Math.floor(totalCount * 0.15),
    "closed-lost": Math.floor(totalCount * 0.05),
  };

  const deals: Deal[] = [];

  for (const [stage, count] of Object.entries(distribution) as Array<[DealStage, number]>) {
    deals.push(...createDeals(count, { stage }));
  }

  return deals;
}

/** Create hot deals (high priority, late stage) */
export function createHotDeals(count: number): Deal[] {
  return Array.from({ length: count }, () => {
    const stage = randomItem(["proposal", "negotiation"] as DealStage[]);
    const deal = createDeal({
      stage,
      priority: "hot",
    });

    // Override to make them high value
    deal.value = Math.floor(Math.random() * 500000000) + 200000000; // 200M-700M VND
    deal.aiScore = Math.floor(Math.random() * 21) + 80; // 80-100

    return deal;
  });
}

/** Create won deals */
export function createWonDeals(count: number): Deal[] {
  return createDeals(count, {
    stage: "closed-won",
  });
}

/** Create lost deals */
export function createLostDeals(count: number): Deal[] {
  return createDeals(count, {
    stage: "closed-lost",
  });
}

/** Create deals for specific contact */
export function createDealsForContact(contactId: string, count: number): Deal[] {
  return createDeals(count, { contactId });
}
