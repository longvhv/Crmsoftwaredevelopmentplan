# 🔌 Mock API Documentation

> **Version:** 1.0  
> **Last Updated:** 2026-03-17  
> **Purpose:** Mock API layer for development (replaces real backend calls)

---

## 🎯 Overview

Mock API system với đầy đủ tính năng:
- ✅ **Full CRUD** (Create, Read, Update, Delete)
- ✅ **Advanced Filtering** (multi-field, operators)
- ✅ **Full-text Search** (Vietnamese accent-insensitive)
- ✅ **Pagination** (page/limit or offset/limit)
- ✅ **Sorting** (multi-column, asc/desc)
- ✅ **Soft Delete** (deletedAt timestamp)
- ✅ **Validation** (required fields, formats)
- ✅ **Error Handling** (typed errors with status codes)
- ✅ **Network Delay Simulation** (200-600ms)
- ✅ **Type-safe** (Full TypeScript support)

---

## 📁 Structure

```
/src/app/api/mock/
├── utils.ts          # Base utilities (pagination, sort, filter, search)
├── contactsApi.ts    # Contacts CRUD + filters
├── dealsApi.ts       # Deals CRUD + filters
├── leadsApi.ts       # Leads CRUD + filters
└── index.ts          # Central export
```

---

## 🔧 Base Utilities (`utils.ts`)

### Delay Simulation

```typescript
import { simulateDelay, simulateRandomDelay } from "@/api/mock";

// Fixed delay
await simulateDelay(500); // 500ms

// Random delay (200-600ms)
await simulateRandomDelay();
```

### Response Builders

```typescript
import { buildSuccessResponse, buildErrorResponse, buildPaginatedResponse } from "@/api/mock";

// Success response
const response = buildSuccessResponse(data, "Operation successful");
// { data: T, message: string, timestamp: string }

// Error response
const error = buildErrorResponse("NOT_FOUND", "Resource not found", 404);
// { error: string, message: string, statusCode: number, timestamp: string }

// Paginated response
const paginated = buildPaginatedResponse(items, { page: 1, limit: 20 }, totalCount);
// {
//   data: T[],
//   pagination: {
//     page, limit, total, totalPages, hasNext, hasPrev
//   }
// }
```

### Pagination

```typescript
import { paginate } from "@/api/mock";

const { data, total } = paginate(items, { page: 2, limit: 20 });
// Returns items 20-39 and total count

// Or use offset
const result = paginate(items, { offset: 40, limit: 20 });
// Returns items 40-59
```

### Sorting

```typescript
import { sortBy, applySorting } from "@/api/mock";

// Sort by single field
const sorted = sortBy(items, "createdAt", "desc");

// Apply sorting params
const sorted = applySorting(items, {
  sortBy: "fullName",
  sortOrder: "asc"
});
```

### Filtering

```typescript
import { filterBy, filterByDateRange, applyAdvancedFilters } from "@/api/mock";

// Simple filter (exact match)
const filtered = filterBy(items, { status: "active", contactType: "customer" });

// Date range filter
const filtered = filterByDateRange(
  items,
  "createdAt",
  "2026-01-01",
  "2026-03-31"
);

// Advanced filters with operators
const filtered = applyAdvancedFilters(items, [
  { field: "leadScore", operator: "gte", value: 70 },
  { field: "status", operator: "in", value: ["active", "inactive"] },
  { field: "company", operator: "contains", value: "tech" },
]);
```

**Operators:**
- `eq` - equals
- `ne` - not equals
- `gt` - greater than
- `gte` - greater than or equal
- `lt` - less than
- `lte` - less than or equal
- `in` - in array
- `contains` - contains substring (case-insensitive, accent-insensitive)

### Search

```typescript
import { searchInFields } from "@/api/mock";

// Search across multiple fields (Vietnamese accent-insensitive)
const results = searchInFields(
  contacts,
  "nguyen",
  ["fullName", "email", "company"]
);
// Matches: "Nguyễn Văn A", "nguyen.van.a@example.com", "Công ty Nguyễn"
```

### Validation

```typescript
import { validateRequiredFields, isValidUUID } from "@/api/mock";

// Validate required fields
const errors = validateRequiredFields(data, ["firstName", "lastName", "email"]);
if (errors.length > 0) {
  // Handle validation errors
}

// Validate UUID format
if (!isValidUUID(id)) {
  // Handle invalid ID
}
```

---

## 📞 Contacts API

### Get All Contacts

```typescript
import { getContacts } from "@/api/mock";

const response = await getContacts({
  // Pagination
  page: 1,
  limit: 20,
  
  // Sorting
  sortBy: "createdAt",
  sortOrder: "desc",
  
  // Filters
  filters: {
    contactType: "customer",
    status: ["active", "inactive"],
    search: "nguyễn",
    ownerId: "...",
    source: "website",
    createdAfter: "2026-01-01",
    createdBefore: "2026-12-31",
    minLeadScore: 70,
    maxLeadScore: 100,
    minLifetimeValue: 50000000, // 50M VND
    hasCompany: true,
    tags: ["vip", "enterprise"],
  },
  
  // Include soft-deleted
  includeDeleted: false,
});

// Response type: PaginatedResponse<Contact>
```

### Get Contact by ID

```typescript
import { getContactById } from "@/api/mock";

const response = await getContactById("018d...");

if ("error" in response) {
  // Handle error
  console.error(response.message);
} else {
  // Success
  const contact = response.data;
}
```

### Create Contact

```typescript
import { createContact } from "@/api/mock";

const response = await createContact({
  firstName: "Văn A",
  lastName: "Nguyễn",
  email: "nguyen.van.a@example.com",
  phone: "0901234567",
  company: "Công ty ABC",
  jobTitle: "Giám đốc",
  contactType: "customer",
  status: "active",
  source: "website",
  ownerId: "...",
  customFields: {
    industry: "Technology",
  },
});

// Response type: ApiResponse<Contact>
```

### Update Contact

```typescript
import { updateContact } from "@/api/mock";

const response = await updateContact("018d...", {
  status: "inactive",
  leadScore: 85,
  lifetimeValue: 100000000, // 100M VND
  tags: ["vip", "high-value"],
});
```

### Delete Contact (Soft Delete)

```typescript
import { deleteContact, bulkDeleteContacts } from "@/api/mock";

// Single delete
await deleteContact("018d...");

// Bulk delete
const response = await bulkDeleteContacts(["018d...", "018d...", "018d..."]);
// { deleted: 3 }
```

### Search Contacts

```typescript
import { searchContacts } from "@/api/mock";

const response = await searchContacts("nguyễn", 10);
// Returns top 10 matching contacts
```

### Get Contact Stats

```typescript
import { getContactStats } from "@/api/mock";

const response = await getContactStats();
// {
//   total: 100,
//   byType: { customer: 50, lead: 25, partner: 15, ... },
//   byStatus: { active: 75, inactive: 20, churned: 5 },
//   avgLeadScore: 68,
//   totalLifetimeValue: 5000000000, // 5B VND
// }
```

---

## 💼 Deals API

### Get All Deals

```typescript
import { getDeals } from "@/api/mock";

const response = await getDeals({
  page: 1,
  limit: 20,
  sortBy: "value",
  sortOrder: "desc",
  filters: {
    stage: ["proposal", "negotiation"],
    priority: "hot",
    ownerId: "...",
    contactId: "...",
    pipeline: "Enterprise Sales",
    won: undefined, // true | false | undefined
    search: "software",
    createdAfter: "2026-01-01",
    minValue: 100000000, // 100M VND
    maxValue: 1000000000, // 1B VND
    minProbability: 60,
    expectedCloseAfter: "2026-03-01",
    expectedCloseBefore: "2026-06-30",
  },
});
```

### Get Deal by ID

```typescript
import { getDealById } from "@/api/mock";

const response = await getDealById("018d...");
```

### Create Deal

```typescript
import { createDeal } from "@/api/mock";

const response = await createDeal({
  name: "ABC Corp - Enterprise License",
  contactId: "...",
  value: 500000000, // 500M VND
  currency: "VND",
  stage: "qualification",
  priority: "hot",
  ownerId: "...",
  expectedCloseDate: "2026-06-30",
  pipeline: "Enterprise Sales",
  source: "referral",
  customFields: {
    productType: "CRM Software",
  },
});
```

### Update Deal

```typescript
import { updateDeal, moveDealToStage, markDealWon, markDealLost } from "@/api/mock";

// Update fields
await updateDeal("018d...", {
  stage: "proposal",
  priority: "hot",
  value: 600000000,
});

// Move to stage (auto-updates probability)
await moveDealToStage("018d...", "negotiation");

// Mark as won
await markDealWon("018d...");

// Mark as lost
await markDealLost("018d...", "Giá cả không cạnh tranh");
```

### Get Deals by Contact

```typescript
import { getDealsByContact } from "@/api/mock";

const response = await getDealsByContact("contact-id");
```

### Get Deal Stats

```typescript
import { getDealStats } from "@/api/mock";

const response = await getDealStats();
// {
//   total: 80,
//   byStage: { qualification: 12, discovery: 16, proposal: 20, ... },
//   byPriority: { hot: 15, warm: 45, cold: 20 },
//   totalValue: 40000000000, // 40B VND
//   avgDealSize: 500000000, // 500M VND
//   winRate: 42.5, // %
// }
```

---

## 🎯 Leads API

### Get All Leads

```typescript
import { getLeads } from "@/api/mock";

const response = await getLeads({
  page: 1,
  limit: 20,
  sortBy: "leadScore",
  sortOrder: "desc",
  filters: {
    status: "qualified",
    source: ["website", "referral"],
    ownerId: "...",
    search: "tech",
    createdAfter: "2026-01-01",
    minLeadScore: 70,
    maxLeadScore: 100,
    qualified: true,
    converted: false,
  },
});
```

### Get Lead by ID

```typescript
import { getLeadById } from "@/api/mock";

const response = await getLeadById("018d...");
```

### Create Lead

```typescript
import { createLead } from "@/api/mock";

const response = await createLead({
  firstName: "Văn B",
  lastName: "Trần",
  email: "tran.van.b@example.com",
  phone: "0912345678",
  company: "Công ty XYZ",
  jobTitle: "CTO",
  source: "website",
  status: "new",
  ownerId: "...",
  customFields: {
    interest: "CRM Software",
  },
});
```

### Update Lead

```typescript
import { updateLead, qualifyLead } from "@/api/mock";

// Update fields
await updateLead("018d...", {
  status: "contacted",
  leadScore: 75,
  tags: ["high-potential"],
});

// Qualify lead (sets status to "qualified" + qualifiedAt)
await qualifyLead("018d...");
```

### Convert Lead

```typescript
import { convertLead } from "@/api/mock";

const response = await convertLead("018d...", {
  createContact: true, // Create contact from lead
  createDeal: true, // Also create deal
  dealValue: 300000000, // 300M VND
});

// Response:
// {
//   lead: Lead, // Updated lead with status="converted"
//   contactId: "...",
//   dealId: "...",
// }
```

### Search Leads

```typescript
import { searchLeads } from "@/api/mock";

const response = await searchLeads("nguyễn", 10);
```

### Get Lead Stats

```typescript
import { getLeadStats } from "@/api/mock";

const response = await getLeadStats();
// {
//   total: 50,
//   byStatus: { new: 15, contacted: 10, qualified: 12, ... },
//   bySource: { website: 20, referral: 15, social: 10, ... },
//   avgLeadScore: 62,
//   qualifiedCount: 12,
//   convertedCount: 8,
//   conversionRate: 16.0, // %
// }
```

---

## 🚦 Error Handling

All API functions return **either** success response **or** error response:

```typescript
const response = await getContactById(id);

// Type guard check
if ("error" in response) {
  // Error response
  console.error(response.error); // Error code
  console.error(response.message); // Human-readable message
  console.error(response.statusCode); // HTTP status code
  
  // Handle specific errors
  if (response.statusCode === 404) {
    // Not found
  } else if (response.statusCode === 400) {
    // Validation error
  }
} else {
  // Success response
  const contact = response.data;
  console.log(response.message); // Optional success message
}
```

### Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `VALIDATION_ERROR` | 400 | Missing/invalid fields |
| `DUPLICATE_EMAIL` | 409 | Email already exists |
| `INVALID_ID` | 400 | Invalid UUID format |
| `NOT_FOUND` | 404 | Resource not found |
| `ALREADY_CONVERTED` | 400 | Lead already converted |
| `FETCH_ERROR` | 500 | Internal error |

---

## 🔄 Integration with Mock Store

All API functions use the Zustand mock store internally:

```typescript
// API function internally calls:
const store = useMockStore.getState();
const contacts = store.contacts;

// CRUD operations update store:
store.addContact(contact);
store.updateContact(id, updates);
store.deleteContact(id); // Soft delete
```

**Important:** Always use API functions instead of directly mutating the store. This ensures:
- ✅ Validation
- ✅ Delay simulation
- ✅ Error handling
- ✅ Version incrementing
- ✅ Timestamp updates

---

## 🎨 Usage in Components

### With React Query

```typescript
import { useQuery, useMutation } from "@tanstack/react-query";
import { getContacts, createContact, updateContact } from "@/api/mock";

// Fetch contacts
const { data, isLoading, error } = useQuery({
  queryKey: ["contacts", filters],
  queryFn: () => getContacts({ filters, page: 1, limit: 20 }),
});

// Create contact
const createMutation = useMutation({
  mutationFn: createContact,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["contacts"] });
  },
});

// Update contact
const updateMutation = useMutation({
  mutationFn: ({ id, data }) => updateContact(id, data),
});
```

### Direct Usage

```typescript
import { getContacts } from "@/api/mock";

async function fetchContacts() {
  const response = await getContacts({
    filters: { status: "active" },
    page: 1,
    limit: 20,
  });

  if ("error" in response) {
    console.error(response.message);
    return;
  }

  const { data, pagination } = response;
  console.log(`Showing ${data.length} of ${pagination.total} contacts`);
}
```

---

## 🔧 Configuration

### Change Default Delay

```typescript
import { simulateDelay } from "@/api/mock";

// In your API function
await simulateDelay(1000); // 1 second delay
```

### Disable Delay (for testing)

Create a mock bypass:

```typescript
// In test environment
vi.mock("@/api/mock/utils", () => ({
  ...actual,
  simulateRandomDelay: vi.fn(() => Promise.resolve()),
}));
```

---

## 🧪 Testing

### Example Test

```typescript
import { describe, it, expect, beforeEach } from "vitest";
import { createContact, getContactById, deleteContact } from "@/api/mock";
import { useMockStore } from "@/data/mockStore";

describe("Contacts API", () => {
  beforeEach(() => {
    // Clear store before each test
    useMockStore.getState().clearData();
  });

  it("should create contact", async () => {
    const response = await createContact({
      firstName: "Test",
      lastName: "User",
      email: "test@example.com",
      contactType: "customer",
    });

    expect("data" in response).toBe(true);
    if ("data" in response) {
      expect(response.data.fullName).toBe("User Test");
    }
  });

  it("should return error for duplicate email", async () => {
    await createContact({
      firstName: "User1",
      lastName: "Test",
      email: "dup@example.com",
      contactType: "customer",
    });

    const response = await createContact({
      firstName: "User2",
      lastName: "Test",
      email: "dup@example.com",
      contactType: "customer",
    });

    expect("error" in response).toBe(true);
    if ("error" in response) {
      expect(response.error).toBe("DUPLICATE_EMAIL");
    }
  });

  it("should soft delete contact", async () => {
    const createResp = await createContact({
      firstName: "Delete",
      lastName: "Me",
      email: "delete@example.com",
      contactType: "customer",
    });

    if ("data" in createResp) {
      await deleteContact(createResp.data.id);

      const getResp = await getContactById(createResp.data.id);
      expect("error" in getResp).toBe(true);
    }
  });
});
```

---

## 🚀 Next Steps

- [ ] Add Activities API
- [ ] Add Products API
- [ ] Add Quotations API
- [ ] Add Contracts API
- [ ] Add Support Tickets API
- [ ] Add bulk operations (import/export)
- [ ] Add webhooks simulation
- [ ] Add rate limiting
- [ ] Add request/response logging

---

**Maintained by:** AI Development Team  
**Last Review:** 2026-03-17  
**Next Review:** Phase 2 kickoff
