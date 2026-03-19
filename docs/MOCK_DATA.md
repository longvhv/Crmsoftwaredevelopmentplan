# 📊 Mock Data System Documentation

> **Version:** 1.0  
> **Last Updated:** 2026-03-17  
> **Purpose:** In-memory mock data for development & demo

---

## 🎯 Overview

Hệ thống mock data hoàn chỉnh với:
- ✅ Vietnamese-first data generators
- ✅ Realistic business scenarios
- ✅ Zustand state management
- ✅ Type-safe factories
- ✅ Configurable seeding
- ✅ Auto-seed on app init

---

## 📁 Structure

```
/src/app/data/
├── generators/
│   ├── names.ts          # Vietnamese names, email, phone
│   ├── companies.ts      # Company names, addresses, tax IDs
│   └── dates.ts          # Realistic timestamps
├── factories/
│   ├── contactFactory.ts # Contact mock generator
│   ├── dealFactory.ts    # Deal mock generator
│   ├── leadFactory.ts    # Lead mock generator
│   └── index.ts          # All factories + simple ones
├── mockStore.ts          # Zustand store
└── seedMockData.ts       # Seeding utilities
```

---

## 🏭 Generators

### 1. Name Generator (`names.ts`)

**Features:**
- 20 common Vietnamese last names (Họ)
- 15+ middle names for male/female (Tên đệm)
- 30+ first names for male/female (Tên)
- Email generation with accent removal
- Vietnamese phone numbers (090, 091, 032, etc.)
- Job titles & departments (Vietnamese)

**Usage:**
```typescript
import { generateFullName, generateEmail, generatePhone } from "@/data/generators/names";

const person = generateFullName("female");
// {
//   firstName: "Thanh Hương",
//   lastName: "Nguyễn",
//   fullName: "Nguyễn Thanh Hương",
//   gender: "female"
// }

const email = generateEmail(person.fullName);
// "nguyen.thanh.huong@gmail.com"

const phone = generatePhone();
// "0901234567"
```

**Batch Generation:**
```typescript
import { generateNames } from "@/data/generators/names";

const people = generateNames(10, "male");
// Array of 10 male names with emails & phones
```

---

### 2. Company Generator (`companies.ts`)

**Features:**
- Vietnamese company types (Công ty TNHH, CP, etc.)
- 10 industry categories with keywords
- Realistic company names (Vietnamese + English mix)
- Vietnamese addresses (streets, wards, districts, cities)
- Tax IDs (MST format: 10 digits or 10-3)
- Company sizes (small, medium, large, enterprise)
- Revenue estimates

**Usage:**
```typescript
import { generateCompany, generateAddress } from "@/data/generators/companies";

const company = generateCompany("technology");
// {
//   name: "Công ty TNHH Tech Solutions Việt Nam",
//   industry: "Công nghệ",
//   website: "www.tech-solutions.vn",
//   address: { ... },
//   taxId: "0123456789-001",
//   size: {
//     size: "medium",
//     employeeCount: 85,
//     revenue: 45000000000 // 45B VND
//   }
// }

const address = generateAddress();
// {
//   street: "123 Nguyễn Huệ",
//   ward: "Bến Nghé",
//   district: "Quận 1",
//   city: "TP. Hồ Chí Minh",
//   fullAddress: "123 Nguyễn Huệ, Bến Nghé, Quận 1, TP. Hồ Chí Minh"
// }
```

**Industries:**
- Technology, Finance, Consulting, Manufacturing
- Retail, Education, Healthcare, Real Estate
- Logistics, Media

---

### 3. Date Generator (`dates.ts`)

**Features:**
- Realistic CRM date patterns
- Business hours timestamps
- Deal/contract lifecycle dates
- Activity timelines
- Follow-up scheduling
- Date range utilities

**Usage:**
```typescript
import {
  generateContactCreatedDate,
  generateDealDates,
  generateActivityDate,
  generateFollowUpDate,
} from "@/data/generators/dates";

// Contact created date (more recent = higher probability)
const contactCreated = generateContactCreatedDate();
// 40% last 3 months, 30% last 6 months, 20% last year

// Deal lifecycle dates
const dealDates = generateDealDates();
// {
//   createdAt: Date,
//   updatedAt: Date,
//   expectedCloseDate: Date (30-180 days after creation),
//   actualCloseDate: Date | null (30% are closed)
// }

// Activity during business hours
const activityDate = generateActivityDate(contactCreated);
// Random business day, 8:00-18:00

// Follow-up 1-14 days in future
const followUp = generateFollowUpDate();
```

---

## 🏭 Factories

### Contact Factory

**Distribution:**
- 50% customers
- 25% leads
- 15% partners
- 8% vendors
- 2% other

**Status:**
- 75% active
- 20% inactive
- 5% churned

**Features:**
- Vietnamese names with proper accents
- Company info (70% have company)
- Job titles (60% have job title)
- Lead scores (tiered distribution)
- Lifetime value (realistic VND amounts)
- AI scoring with confidence & factors
- Custom fields & tags

**Usage:**
```typescript
import { createContact, createContacts, createHighValueContacts } from "@/data/factories";

// Single contact
const contact = createContact({
  contactType: "customer",
  status: "active",
  withCompany: true,
});

// Batch
const contacts = createContacts(100);

// High-value customers (LTV 100M-300M VND, scores 80+)
const vipContacts = createHighValueContacts(10);
```

---

### Deal Factory

**Stage Distribution:**
- 15% qualification
- 20% discovery
- 25% proposal
- 20% negotiation
- 15% closed-won
- 5% closed-lost

**Features:**
- Deal values 0-1B VND (skewed toward lower)
- Probability matches stage (10% qualification → 100% won)
- Hot/warm/cold priorities
- Lost reasons (for closed-lost)
- AI scoring
- Multiple pipelines

**Usage:**
```typescript
import { createDealsWithStageDistribution, createHotDeals } from "@/data/factories";

// Realistic stage distribution
const deals = createDealsWithStageDistribution(100);

// Hot deals (high priority, late stage, high value)
const hotDeals = createHotDeals(15);
```

---

### Lead Factory

**Status Distribution:**
- Mixed across new → converted → lost

**Scoring:**
- Converted: 80-100
- Qualified: 60-79
- Nurturing: 40-69
- Lost: 0-39
- New/Contacted: 0-59

**Usage:**
```typescript
import { createLeads, createQualifiedLeads } from "@/data/factories";

const leads = createLeads(50);
const qualifiedLeads = createQualifiedLeads(15); // Ready to convert
```

---

### Other Factories

**Available:**
- `createEmployee()` - Employees & AI agents
- `createActivity()` - Calls, emails, meetings, tasks
- `createProduct()` - Software, services, hardware
- `createQuotation()` - With line items
- `createContract()` - 12/24/36 month durations
- `createSupportTicket()` - Support tickets with priorities

---

## 💾 Mock Store (Zustand)

### State Structure

```typescript
interface MockDataStore {
  // Data arrays
  contacts: Contact[];
  deals: Deal[];
  leads: Lead[];
  employees: Employee[];
  activities: Activity[];
  products: Product[];
  quotations: Quotation[];
  contracts: Contract[];
  tickets: SupportTicket[];

  // Metadata
  isSeeded: boolean;
  isLoading: boolean;

  // Actions
  seedData(data): void;
  clearData(): void;
  addContact(contact): void;
  updateContact(id, updates): void;
  deleteContact(id): void;
  // ... (similar for other entities)
}
```

### Usage

```typescript
import { useMockStore, useActiveContacts, useContact } from "@/data/mockStore";

// In component
function ContactsList() {
  const contacts = useActiveContacts(); // Only non-deleted
  const addContact = useMockStore(state => state.addContact);
  
  // ...
}

// Get single contact
function ContactDetail({ id }) {
  const contact = useContact(id);
  
  if (!contact) return <div>Not found</div>;
  // ...
}

// Get related data
function ContactActivitiesTab({ contactId }) {
  const activities = useContactActivities(contactId);
  // ...
}
```

---

## 🌱 Seeding

### Seed Configurations

**1. Default (for development):**
```typescript
DEFAULT_SEED_CONFIG = {
  contacts: 100,
  deals: 80,
  leads: 50,
  employees: 20,
  activities: 200,
  products: 30,
  quotations: 40,
  contracts: 25,
  tickets: 60,
}
// Total: ~605 records
```

**2. Small (for quick testing):**
```typescript
SMALL_SEED_CONFIG = {
  contacts: 20,
  deals: 15,
  leads: 10,
  // ...
}
// Total: ~105 records
```

**3. Large (for stress testing):**
```typescript
LARGE_SEED_CONFIG = {
  contacts: 500,
  deals: 300,
  leads: 200,
  // ...
}
// Total: ~2,580 records
```

### Manual Seeding

```typescript
import { seedMockData, clearMockData, reseedMockData, SMALL_SEED_CONFIG } from "@/data/seedMockData";

// Seed with default config
seedMockData();

// Seed with custom config
seedMockData(SMALL_SEED_CONFIG);

// Clear all data
clearMockData();

// Re-seed (clear + seed)
reseedMockData({ contacts: 50, deals: 30, leads: 20, ... });
```

### Auto-Seeding

Add to `App.tsx` or root component:

```typescript
import { useEffect } from "react";
import { autoSeedIfNeeded } from "@/data/seedMockData";

function App() {
  useEffect(() => {
    autoSeedIfNeeded(); // Only seeds if store is empty
  }, []);

  return <div>...</div>;
}
```

---

## 📊 Data Characteristics

### Vietnamese-First

- ✅ Realistic Vietnamese names with proper accents
- ✅ Vietnamese company names & types
- ✅ Vietnamese addresses (Hà Nội, TP.HCM, Đà Nẵng, etc.)
- ✅ Vietnamese phone format (090, 091, 032, 033, etc.)
- ✅ Vietnamese job titles & departments
- ✅ Vietnamese time zone (Asia/Ho_Chi_Minh, UTC+7)

### Realistic Business Scenarios

- ✅ Skewed value distributions (not uniform random)
- ✅ Probabilistic outcomes (30% deals closed, 70% have recent activity)
- ✅ Correlated data (high LTV → high lead score)
- ✅ Time-based relationships (updated ≥ created)
- ✅ Soft deletes (5% of records)
- ✅ Business hours for activities (8:00-18:00)

### Multi-Tenant Ready

- ✅ All entities have `tenantId`
- ✅ Default tenant: `018d0001-0001-7001-8001-000000000001`
- ✅ Easy to generate multi-tenant data

### Standard Mixins Compliant

Every entity has:
- ✅ `id` (UUID v7 format)
- ✅ `tenantId`
- ✅ `version` (starts at 1, increments on update)
- ✅ `createdAt`, `updatedAt`, `deletedAt`
- ✅ Soft delete support

---

## 🔧 Customization

### Add Custom Generator

```typescript
// /src/app/data/generators/myGenerator.ts
export function generateCustomField(): string {
  const options = ["Option A", "Option B", "Option C"];
  return options[Math.floor(Math.random() * options.length)];
}
```

### Extend Factory

```typescript
// /src/app/data/factories/myFactory.ts
import { createContact } from "./contactFactory";

export function createVIPContact(): Contact {
  const contact = createContact({
    contactType: "customer",
    status: "active",
    withCompany: true,
    withJobTitle: true,
  });

  // Override fields
  return {
    ...contact,
    lifetimeValue: 500000000, // 500M VND
    leadScore: 95,
    customFields: {
      ...contact.customFields,
      vipTier: "platinum",
    },
  };
}
```

---

## 🎯 Best Practices

1. **Use Seeded Random** for reproducible data:
   ```typescript
   import { generateSeededName, setSeed } from "@/data/generators/names";
   
   setSeed(42); // Same seed = same data
   const name = generateSeededName(0);
   ```

2. **Batch Generation** for performance:
   ```typescript
   // ✅ Good
   const contacts = createContacts(100);
   
   // ❌ Avoid
   const contacts = [];
   for (let i = 0; i < 100; i++) {
     contacts.push(createContact());
   }
   ```

3. **Use Selectors** for filtered data:
   ```typescript
   // ✅ Good - memoized selector
   const activeContacts = useActiveContacts();
   
   // ❌ Avoid - filter every render
   const contacts = useMockStore(state =>
     state.contacts.filter(c => !c.deletedAt)
   );
   ```

4. **Clear Data** when testing:
   ```typescript
   beforeEach(() => {
     clearMockData();
     seedMockData(SMALL_SEED_CONFIG);
   });
   ```

---

## 🚀 Next Steps

- [ ] Add GraphQL resolvers using mock store
- [ ] Create mock API endpoints (REST)
- [ ] Add real-time updates (WebSocket mock)
- [ ] Export/import mock data
- [ ] Visual mock data browser (admin panel)

---

**Maintained by:** AI Development Team  
**Last Review:** 2026-03-17  
**Next Review:** Phase 2 kickoff
