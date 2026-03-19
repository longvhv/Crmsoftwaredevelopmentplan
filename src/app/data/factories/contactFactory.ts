/* ============================================================
 * Contact Mock Factory
 * Generate realistic contact data
 * ============================================================ */

import type { Contact, ContactType, ContactStatus } from "@/types";
import { generateFullName, generateEmail, generatePhone, generateJobTitle } from "../generators/names";
import { generateCompany } from "../generators/companies";
import { generateEntityDates, generateLastActivityDate } from "../generators/dates";

/* ============================================================
 * Factory Configuration
 * ============================================================ */

const DEFAULT_TENANT_ID = "018d0001-0001-7001-8001-000000000001";

/** Contact type distribution */
const CONTACT_TYPE_WEIGHTS: Record<ContactType, number> = {
  customer: 0.5, // 50%
  lead: 0.25, // 25%
  partner: 0.15, // 15%
  vendor: 0.08, // 8%
  other: 0.02, // 2%
};

/** Contact status distribution */
const CONTACT_STATUS_WEIGHTS: Record<ContactStatus, number> = {
  active: 0.75, // 75%
  inactive: 0.20, // 20%
  churned: 0.05, // 5%
};

/* ============================================================
 * Helper Functions
 * ============================================================ */

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomBool(probability = 0.5): boolean {
  return Math.random() < probability;
}

function weightedRandom<T extends string>(weights: Record<T, number>): T {
  const random = Math.random();
  let cumulative = 0;
  
  for (const [key, weight] of Object.entries(weights) as Array<[T, number]>) {
    cumulative += weight;
    if (random < cumulative) {
      return key;
    }
  }
  
  return Object.keys(weights)[0] as T;
}

function generateUUID(): string {
  // Simple UUID v7 mock (not cryptographically secure)
  return `018d${Math.random().toString(16).slice(2, 6)}-${Math.random().toString(16).slice(2, 6)}-7${Math.random().toString(16).slice(2, 4)}-${Math.random().toString(16).slice(2, 6)}-${Math.random().toString(16).slice(2, 14)}`;
}

function generateLeadScore(): number {
  // Lead scores follow a distribution:
  // 10% high (80-100)
  // 30% medium-high (60-79)
  // 40% medium (40-59)
  // 20% low (0-39)
  const random = Math.random();
  
  if (random < 0.1) {
    return Math.floor(Math.random() * 21) + 80; // 80-100
  } else if (random < 0.4) {
    return Math.floor(Math.random() * 20) + 60; // 60-79
  } else if (random < 0.8) {
    return Math.floor(Math.random() * 20) + 40; // 40-59
  } else {
    return Math.floor(Math.random() * 40); // 0-39
  }
}

function generateLifetimeValue(): number {
  // LTV in VND (0 - 500 million)
  const base = Math.random() * Math.random() * 500000000; // Skewed toward lower values
  return Math.floor(base);
}

function generateAIScore(): number {
  // AI score 0-100
  return Math.floor(Math.random() * 101);
}

/* ============================================================
 * Contact Factory
 * ============================================================ */

export interface ContactFactoryOptions {
  tenantId?: string;
  contactType?: ContactType;
  status?: ContactStatus;
  withCompany?: boolean;
  withJobTitle?: boolean;
  createdAt?: Date;
}

/** Create single contact */
export function createContact(options: ContactFactoryOptions = {}): Contact {
  const {
    tenantId = DEFAULT_TENANT_ID,
    contactType = weightedRandom(CONTACT_TYPE_WEIGHTS),
    status = weightedRandom(CONTACT_STATUS_WEIGHTS),
    withCompany = randomBool(0.7), // 70% have company
    withJobTitle = randomBool(0.6), // 60% have job title
    createdAt,
  } = options;

  const nameData = generateFullName();
  const company = withCompany ? generateCompany() : null;
  const dates = generateEntityDates(createdAt);

  const contact: Contact = {
    // Standard Mixins
    id: generateUUID(),
    tenantId,
    version: 1,
    createdAt: dates.createdAt.toISOString(),
    updatedAt: dates.updatedAt.toISOString(),
    deletedAt: dates.deletedAt?.toISOString() || null,

    // Basic info
    firstName: nameData.firstName,
    lastName: nameData.lastName,
    fullName: nameData.fullName,
    email: randomBool(0.9) ? generateEmail(nameData.fullName) : undefined,
    phone: randomBool(0.8) ? generatePhone() : undefined,
    
    // Company info
    company: company?.name,
    jobTitle: withJobTitle ? generateJobTitle() : undefined,
    
    // Classification
    contactType,
    status,
    source: randomItem(["website", "referral", "social", "event", "ad", "cold-call", "partner"]),
    
    // Ownership
    ownerId: randomBool(0.9) ? generateUUID() : undefined, // 90% have owner
    
    // Metrics
    leadScore: contactType === "lead" ? generateLeadScore() : undefined,
    lifetimeValue: status === "active" ? generateLifetimeValue() : 0,
    lastActivityAt: dates.lastActivityAt?.toISOString() || undefined,
    
    // AI scoring
    aiScore: generateAIScore(),
    aiMetadata: {
      lastScoredAt: dates.updatedAt.toISOString(),
      scoringModel: "crm-ai-v2.1",
      confidence: Math.random() * 0.3 + 0.7, // 0.7-1.0
      factors: [
        {
          name: "engagement",
          weight: 0.3,
          value: Math.random(),
        },
        {
          name: "demographics",
          weight: 0.25,
          value: Math.random(),
        },
        {
          name: "behavioral",
          weight: 0.25,
          value: Math.random(),
        },
        {
          name: "firmographics",
          weight: 0.2,
          value: Math.random(),
        },
      ],
    },
    
    // Tags (0-5 tags)
    tags: Array.from({ length: Math.floor(Math.random() * 6) }, () => generateUUID()),
    
    // Custom fields
    customFields: randomBool(0.3) ? {
      industry: company?.industry,
      companySize: company?.size.size,
      preferredLanguage: "vi",
      timezone: "Asia/Ho_Chi_Minh",
    } : {},
  };

  return contact;
}

/** Create multiple contacts */
export function createContacts(count: number, options: ContactFactoryOptions = {}): Contact[] {
  return Array.from({ length: count }, () => createContact(options));
}

/** Create contacts with specific distribution */
export function createContactsWithDistribution(counts: {
  customers?: number;
  leads?: number;
  partners?: number;
  vendors?: number;
}): Contact[] {
  const contacts: Contact[] = [];

  if (counts.customers) {
    contacts.push(...createContacts(counts.customers, { contactType: "customer", status: "active" }));
  }

  if (counts.leads) {
    contacts.push(...createContacts(counts.leads, { contactType: "lead" }));
  }

  if (counts.partners) {
    contacts.push(...createContacts(counts.partners, { contactType: "partner", status: "active" }));
  }

  if (counts.vendors) {
    contacts.push(...createContacts(counts.vendors, { contactType: "vendor", status: "active" }));
  }

  return contacts;
}

/** Create high-value customer contacts */
export function createHighValueContacts(count: number): Contact[] {
  return Array.from({ length: count }, () => {
    const contact = createContact({
      contactType: "customer",
      status: "active",
      withCompany: true,
      withJobTitle: true,
    });

    // Override LTV to be high
    contact.lifetimeValue = Math.floor(Math.random() * 200000000) + 100000000; // 100M-300M VND
    contact.leadScore = Math.floor(Math.random() * 21) + 80; // 80-100
    contact.aiScore = Math.floor(Math.random() * 21) + 80;

    return contact;
  });
}

/** Create churned contacts */
export function createChurnedContacts(count: number): Contact[] {
  return createContacts(count, {
    status: "churned",
    contactType: "customer",
  }).map(contact => ({
    ...contact,
    lifetimeValue: 0,
    leadScore: Math.floor(Math.random() * 30), // Low scores
    aiScore: Math.floor(Math.random() * 30),
  }));
}
