/* ============================================================
 * Seed Mock Data - Populate Store with Realistic Data
 * Call this function once on app init to load mock data
 * ============================================================ */

import { useMockStore } from "./mockStore";
import {
  createContacts,
  createDealsWithStageDistribution,
  createLeads,
  createEmployees,
  createActivities,
  createProducts,
  createQuotations,
  createContracts,
  createSupportTickets,
  createHighValueContacts,
  createChurnedContacts,
  createQualifiedLeads,
  createHotDeals,
} from "./factories";

/* ============================================================
 * Seed Configuration
 * ============================================================ */

export interface SeedConfig {
  contacts: number;
  deals: number;
  leads: number;
  employees: number;
  activities: number;
  products: number;
  quotations: number;
  contracts: number;
  tickets: number;
}

/** Default seed counts */
export const DEFAULT_SEED_CONFIG: SeedConfig = {
  contacts: 100,
  deals: 80,
  leads: 50,
  employees: 20,
  activities: 200,
  products: 30,
  quotations: 40,
  contracts: 25,
  tickets: 60,
};

/** Small dataset for quick testing */
export const SMALL_SEED_CONFIG: SeedConfig = {
  contacts: 20,
  deals: 15,
  leads: 10,
  employees: 5,
  activities: 30,
  products: 10,
  quotations: 8,
  contracts: 5,
  tickets: 12,
};

/** Large dataset for stress testing */
export const LARGE_SEED_CONFIG: SeedConfig = {
  contacts: 500,
  deals: 300,
  leads: 200,
  employees: 50,
  activities: 1000,
  products: 100,
  quotations: 150,
  contracts: 80,
  tickets: 250,
};

/* ============================================================
 * Seed Function
 * ============================================================ */

/** Seed mock data into store */
export function seedMockData(config: SeedConfig = DEFAULT_SEED_CONFIG): void {
  console.log("🌱 Seeding mock data...");
  const startTime = performance.now();

  // Generate data
  console.log("  📊 Generating contacts...");
  const contacts = [
    ...createContacts(Math.floor(config.contacts * 0.7)), // 70% regular contacts
    ...createHighValueContacts(Math.floor(config.contacts * 0.1)), // 10% high-value
    ...createChurnedContacts(Math.floor(config.contacts * 0.05)), // 5% churned
    ...createContacts(Math.floor(config.contacts * 0.15)), // 15% more regular
  ];

  console.log("  💼 Generating deals...");
  const deals = [
    ...createDealsWithStageDistribution(Math.floor(config.deals * 0.85)), // 85% normal distribution
    ...createHotDeals(Math.floor(config.deals * 0.15)), // 15% hot deals
  ];

  console.log("  🎯 Generating leads...");
  const leads = [
    ...createLeads(Math.floor(config.leads * 0.7)), // 70% mixed leads
    ...createQualifiedLeads(Math.floor(config.leads * 0.3)), // 30% qualified
  ];

  console.log("  👥 Generating employees...");
  const employees = createEmployees(config.employees);

  console.log("  📅 Generating activities...");
  const activities = createActivities(config.activities);

  console.log("  📦 Generating products...");
  const products = createProducts(config.products);

  console.log("  📄 Generating quotations...");
  const quotations = createQuotations(config.quotations);

  console.log("  📋 Generating contracts...");
  const contracts = createContracts(config.contracts);

  console.log("  🎫 Generating support tickets...");
  const tickets = createSupportTickets(config.tickets);

  // Seed store
  console.log("  💾 Loading data into store...");
  useMockStore.getState().seedData({
    contacts,
    deals,
    leads,
    employees,
    activities,
    products,
    quotations,
    contracts,
    tickets,
  });

  const endTime = performance.now();
  const duration = (endTime - startTime).toFixed(2);

  console.log(`✅ Mock data seeded successfully in ${duration}ms`);
  console.log(`  📊 Stats:`);
  console.log(`    - Contacts: ${contacts.length}`);
  console.log(`    - Deals: ${deals.length}`);
  console.log(`    - Leads: ${leads.length}`);
  console.log(`    - Employees: ${employees.length}`);
  console.log(`    - Activities: ${activities.length}`);
  console.log(`    - Products: ${products.length}`);
  console.log(`    - Quotations: ${quotations.length}`);
  console.log(`    - Contracts: ${contracts.length}`);
  console.log(`    - Tickets: ${tickets.length}`);
  console.log(`    - Total: ${contacts.length + deals.length + leads.length + employees.length + activities.length + products.length + quotations.length + contracts.length + tickets.length} records`);
}

/** Clear mock data */
export function clearMockData(): void {
  console.log("🧹 Clearing mock data...");
  useMockStore.getState().clearData();
  console.log("✅ Mock data cleared");
}

/** Re-seed with new configuration */
export function reseedMockData(config: SeedConfig = DEFAULT_SEED_CONFIG): void {
  clearMockData();
  seedMockData(config);
}

/* ============================================================
 * Auto-seed on App Init
 * ============================================================ */

/** Check if data should be auto-seeded */
export function shouldAutoSeed(): boolean {
  const store = useMockStore.getState();
  return !store.isSeeded && store.contacts.length === 0;
}

/** Auto-seed if needed */
export function autoSeedIfNeeded(): void {
  if (shouldAutoSeed()) {
    console.log("🔄 Auto-seeding mock data on first load...");
    seedMockData(DEFAULT_SEED_CONFIG);
  }
}
