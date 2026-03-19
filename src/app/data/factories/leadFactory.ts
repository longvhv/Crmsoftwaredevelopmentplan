/* ============================================================
 * Lead Mock Factory
 * ============================================================ */

import type { Lead, LeadStatus, LeadSource } from "@/types";
import { generateFullName, generateEmail, generatePhone, generateJobTitle } from "../generators/names";
import { generateCompany } from "../generators/companies";
import { generateEntityDates } from "../generators/dates";

const DEFAULT_TENANT_ID = "018d0001-0001-7001-8001-000000000001";

const LEAD_STATUSES: LeadStatus[] = ["new", "contacted", "qualified", "nurturing", "converted", "lost"];
const LEAD_SOURCES: LeadSource[] = ["website", "referral", "social", "event", "ad", "cold-call", "partner", "other"];

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomBool(probability = 0.5): boolean {
  return Math.random() < probability;
}

function generateUUID(): string {
  return `018d${Math.random().toString(16).slice(2, 6)}-${Math.random().toString(16).slice(2, 6)}-7${Math.random().toString(16).slice(2, 4)}-${Math.random().toString(16).slice(2, 6)}-${Math.random().toString(16).slice(2, 14)}`;
}

function generateLeadScore(status: LeadStatus): number {
  if (status === "converted") return Math.floor(Math.random() * 21) + 80; // 80-100
  if (status === "qualified") return Math.floor(Math.random() * 20) + 60; // 60-79
  if (status === "nurturing") return Math.floor(Math.random() * 30) + 40; // 40-69
  if (status === "lost") return Math.floor(Math.random() * 40); // 0-39
  return Math.floor(Math.random() * 60); // 0-59 for new/contacted
}

export interface LeadFactoryOptions {
  tenantId?: string;
  status?: LeadStatus;
  source?: LeadSource;
}

export function createLead(options: LeadFactoryOptions = {}): Lead {
  const {
    tenantId = DEFAULT_TENANT_ID,
    status = randomItem(LEAD_STATUSES),
    source = randomItem(LEAD_SOURCES),
  } = options;

  const nameData = generateFullName();
  const company = randomBool(0.6) ? generateCompany() : null;
  const dates = generateEntityDates();
  const leadScore = generateLeadScore(status);

  const lead: Lead = {
    id: generateUUID(),
    tenantId,
    version: 1,
    createdAt: dates.createdAt.toISOString(),
    updatedAt: dates.updatedAt.toISOString(),
    deletedAt: null,

    firstName: nameData.firstName,
    lastName: nameData.lastName,
    fullName: nameData.fullName,
    email: generateEmail(nameData.fullName),
    phone: randomBool(0.7) ? generatePhone() : undefined,
    company: company?.name,
    jobTitle: randomBool(0.5) ? generateJobTitle() : undefined,

    status,
    source,
    ownerId: randomBool(0.9) ? generateUUID() : undefined,

    leadScore,
    qualifiedAt: status === "qualified" || status === "converted" ? dates.updatedAt.toISOString() : undefined,
    convertedAt: status === "converted" ? dates.updatedAt.toISOString() : undefined,
    convertedToContactId: status === "converted" ? generateUUID() : undefined,

    aiScore: Math.floor(Math.random() * 101),
    aiMetadata: {
      lastScoredAt: dates.updatedAt.toISOString(),
      scoringModel: "lead-ai-v1.2",
      confidence: Math.random() * 0.3 + 0.7,
      factors: [
        { name: "engagement", weight: 0.4, value: Math.random() },
        { name: "fit", weight: 0.35, value: Math.random() },
        { name: "intent", weight: 0.25, value: Math.random() },
      ],
    },

    tags: Array.from({ length: Math.floor(Math.random() * 3) }, () => generateUUID()),
    customFields: {},
  };

  return lead;
}

export function createLeads(count: number, options: LeadFactoryOptions = {}): Lead[] {
  return Array.from({ length: count }, () => createLead(options));
}

export function createQualifiedLeads(count: number): Lead[] {
  return createLeads(count, { status: "qualified" });
}

export function createConvertedLeads(count: number): Lead[] {
  return createLeads(count, { status: "converted" });
}
