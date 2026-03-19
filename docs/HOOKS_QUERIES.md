# 🪝 Query Hooks Documentation

> **Version:** 1.0  
> **Last Updated:** 2026-03-17  
> **Purpose:** React Query hooks for data fetching & mutations

---

## 🎯 Overview

React Query hooks layer với đầy đủ tính năng:
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Auto-caching** - Intelligent cache management
- ✅ **Auto-refetch** - Stale data auto-refresh
- ✅ **Optimistic Updates** - Instant UI feedback
- ✅ **Error Handling** - Toast notifications
- ✅ **DevTools** - Debug queries in development
- ✅ **Prefetching** - Improve perceived performance
- ✅ **Pagination** - Built-in pagination support

---

## 📁 Structure

```
/src/app/
├── lib/
│   └── queryClient.ts         # QueryClient config & key factories
├── providers/
│   └── QueryProvider.tsx      # App-wide provider
└── hooks/
    └── queries/
        ├── useContacts.ts     # Contact hooks
        ├── useDeals.ts        # Deal hooks
        ├── useLeads.ts        # Lead hooks
        └── index.ts           # Central export
```

---

## 🔧 Setup

### 1. Wrap App with QueryProvider

```typescript
// App.tsx
import { QueryProvider } from "@/providers/QueryProvider";

function App() {
  return (
    <QueryProvider>
      <YourApp />
    </QueryProvider>
  );
}
```

### 2. Auto-seed mock data (optional)

```typescript
// App.tsx
import { useEffect } from "react";
import { autoSeedIfNeeded } from "@/data/seedMockData";

function App() {
  useEffect(() => {
    autoSeedIfNeeded(); // Seeds data on first load
  }, []);

  return <QueryProvider>...</QueryProvider>;
}
```

---

## 📞 Contact Hooks

### Query Hooks

#### `useContacts(params?)`

Fetch paginated contacts list with filters.

```typescript
import { useContacts } from "@/hooks/queries";

function ContactsList() {
  const { data, isLoading, error } = useContacts({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
    filters: {
      contactType: "customer",
      status: "active",
      search: "nguyễn",
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <h1>Contacts ({data.pagination.total})</h1>
      {data.data.map(contact => (
        <div key={contact.id}>{contact.fullName}</div>
      ))}
    </div>
  );
}
```

#### `useContact(id)`

Fetch single contact by ID.

```typescript
import { useContact } from "@/hooks/queries";

function ContactDetail({ id }: { id: string }) {
  const { data: contact, isLoading } = useContact(id);

  if (isLoading) return <div>Loading...</div>;
  if (!contact) return <div>Not found</div>;

  return (
    <div>
      <h1>{contact.fullName}</h1>
      <p>{contact.email}</p>
    </div>
  );
}
```

#### `useContactSearch(query, limit?)`

Quick search contacts.

```typescript
import { useContactSearch } from "@/hooks/queries";

function ContactSearchBar() {
  const [query, setQuery] = useState("");
  const { data: results } = useContactSearch(query, 10);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search contacts..."
      />
      {results?.map(contact => (
        <div key={contact.id}>{contact.fullName}</div>
      ))}
    </div>
  );
}
```

#### `useContactStats()`

Fetch contact analytics.

```typescript
import { useContactStats } from "@/hooks/queries";

function ContactStats() {
  const { data: stats } = useContactStats();

  return (
    <div>
      <div>Total: {stats?.total}</div>
      <div>Avg Lead Score: {stats?.avgLeadScore}</div>
      <div>Total LTV: {stats?.totalLifetimeValue.toLocaleString()} VND</div>
    </div>
  );
}
```

---

### Mutation Hooks

#### `useCreateContact()`

Create new contact.

```typescript
import { useCreateContact } from "@/hooks/queries";

function CreateContactForm() {
  const createContact = useCreateContact();

  const handleSubmit = (data) => {
    createContact.mutate({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      contactType: "customer",
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button disabled={createContact.isPending}>
        {createContact.isPending ? "Creating..." : "Create Contact"}
      </button>
    </form>
  );
}
```

#### `useUpdateContact()`

Update contact with optimistic updates.

```typescript
import { useUpdateContact } from "@/hooks/queries";

function EditContactForm({ contactId }: { contactId: string }) {
  const updateContact = useUpdateContact();

  const handleUpdate = (data) => {
    updateContact.mutate({
      id: contactId,
      data: {
        leadScore: 85,
        status: "active",
      },
    });
  };

  // Optimistic update happens immediately!
  // If error, automatically rolls back
  return <button onClick={handleUpdate}>Update</button>;
}
```

#### `useDeleteContact()`

Soft delete contact.

```typescript
import { useDeleteContact } from "@/hooks/queries";

function DeleteContactButton({ contactId }: { contactId: string }) {
  const deleteContact = useDeleteContact();

  return (
    <button
      onClick={() => deleteContact.mutate(contactId)}
      disabled={deleteContact.isPending}
    >
      Delete
    </button>
  );
}
```

#### `useBulkDeleteContacts()`

Delete multiple contacts.

```typescript
import { useBulkDeleteContacts } from "@/hooks/queries";

function BulkActions({ selectedIds }: { selectedIds: string[] }) {
  const bulkDelete = useBulkDeleteContacts();

  return (
    <button onClick={() => bulkDelete.mutate(selectedIds)}>
      Delete {selectedIds.length} contacts
    </button>
  );
}
```

---

### Compound Hooks

#### `useContactsWithStats(params?)`

Fetch contacts and stats together.

```typescript
import { useContactsWithStats } from "@/hooks/queries";

function ContactsDashboard() {
  const { contacts, stats, isLoading } = useContactsWithStats({
    filters: { status: "active" },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div>Total: {stats.data?.total}</div>
      <div>Contacts: {contacts.data?.data.length}</div>
    </div>
  );
}
```

---

## 💼 Deal Hooks

### Query Hooks

#### `useDeals(params?)`

```typescript
import { useDeals } from "@/hooks/queries";

const { data } = useDeals({
  filters: {
    stage: ["proposal", "negotiation"],
    priority: "hot",
  },
  sortBy: "value",
  sortOrder: "desc",
});
```

#### `useDeal(id)`

```typescript
import { useDeal } from "@/hooks/queries";

const { data: deal } = useDeal(dealId);
```

#### `useDealsByContact(contactId)`

```typescript
import { useDealsByContact } from "@/hooks/queries";

const { data: deals } = useDealsByContact(contactId);
```

#### `useDealStats()`

```typescript
import { useDealStats } from "@/hooks/queries";

const { data: stats } = useDealStats();
// stats: { total, byStage, byPriority, totalValue, avgDealSize, winRate }
```

---

### Mutation Hooks

#### `useCreateDeal()`

```typescript
import { useCreateDeal } from "@/hooks/queries";

const createDeal = useCreateDeal();

createDeal.mutate({
  name: "Enterprise Deal",
  contactId: "...",
  value: 500000000,
  stage: "qualification",
});
```

#### `useUpdateDeal()`

```typescript
import { useUpdateDeal } from "@/hooks/queries";

const updateDeal = useUpdateDeal();

updateDeal.mutate({
  id: dealId,
  data: { priority: "hot", value: 600000000 },
});
```

#### `useMoveDealToStage()`

```typescript
import { useMoveDealToStage } from "@/hooks/queries";

const moveDeal = useMoveDealToStage();

moveDeal.mutate({ id: dealId, stage: "proposal" });
```

#### `useMarkDealWon()` / `useMarkDealLost()`

```typescript
import { useMarkDealWon, useMarkDealLost } from "@/hooks/queries";

const markWon = useMarkDealWon();
const markLost = useMarkDealLost();

// Win
markWon.mutate(dealId);

// Lost
markLost.mutate({ id: dealId, reason: "Giá cả không cạnh tranh" });
```

---

## 🎯 Lead Hooks

### Query Hooks

#### `useLeads(params?)`

```typescript
import { useLeads } from "@/hooks/queries";

const { data } = useLeads({
  filters: {
    status: "qualified",
    minLeadScore: 70,
  },
});
```

#### `useLead(id)`

```typescript
import { useLead } from "@/hooks/queries";

const { data: lead } = useLead(leadId);
```

#### `useLeadSearch(query, limit?)`

```typescript
import { useLeadSearch } from "@/hooks/queries";

const { data: results } = useLeadSearch("nguyễn", 10);
```

#### `useLeadStats()`

```typescript
import { useLeadStats } from "@/hooks/queries";

const { data: stats } = useLeadStats();
// stats: { total, byStatus, bySource, avgLeadScore, conversionRate }
```

---

### Mutation Hooks

#### `useCreateLead()`

```typescript
import { useCreateLead } from "@/hooks/queries";

const createLead = useCreateLead();

createLead.mutate({
  firstName: "Văn A",
  lastName: "Nguyễn",
  email: "nguyen.van.a@example.com",
  source: "website",
});
```

#### `useQualifyLead()`

```typescript
import { useQualifyLead } from "@/hooks/queries";

const qualifyLead = useQualifyLead();

qualifyLead.mutate(leadId); // Sets status to "qualified"
```

#### `useConvertLead()`

```typescript
import { useConvertLead } from "@/hooks/queries";

const convertLead = useConvertLead();

convertLead.mutate({
  id: leadId,
  options: {
    createContact: true,
    createDeal: true,
    dealValue: 300000000,
  },
});
```

---

### Compound Hooks

#### `useQualifiedLeads()`

Pre-filtered qualified leads.

```typescript
import { useQualifiedLeads } from "@/hooks/queries";

const { data } = useQualifiedLeads();
// Auto-filters: status=qualified, minLeadScore=70, converted=false
```

#### `useNewLeads()`

Pre-filtered new leads.

```typescript
import { useNewLeads } from "@/hooks/queries";

const { data } = useNewLeads();
// Auto-filters: status in ["new", "contacted"]
```

---

## 🔄 Advanced Patterns

### Dependent Queries

```typescript
import { useContact, useDealsByContact } from "@/hooks/queries";

function ContactWithDeals({ id }: { id: string }) {
  const { data: contact } = useContact(id);
  const { data: deals } = useDealsByContact(contact?.id); // Waits for contact

  return <div>...</div>;
}
```

### Parallel Queries

```typescript
import { useContacts, useDeals, useLeads } from "@/hooks/queries";

function Dashboard() {
  const contacts = useContacts();
  const deals = useDeals();
  const leads = useLeads();

  // All 3 queries run in parallel
  const isLoading = contacts.isLoading || deals.isLoading || leads.isLoading;

  return <div>...</div>;
}
```

### Infinite Scroll

```typescript
import { useInfiniteQuery } from "@tanstack/react-query";
import { getContacts } from "@/api/mock";
import { queryKeys } from "@/lib/queryClient";

function InfiniteContactsList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: queryKeys.contacts.lists(),
    queryFn: ({ pageParam = 1 }) =>
      getContacts({ page: pageParam, limit: 20 }),
    getNextPageParam: (lastPage) =>
      lastPage.pagination.hasNext ? lastPage.pagination.page + 1 : undefined,
    initialPageParam: 1,
  });

  return (
    <div>
      {data?.pages.map((page) =>
        page.data.map((contact) => (
          <div key={contact.id}>{contact.fullName}</div>
        ))
      )}
      {hasNextPage && (
        <button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
          Load More
        </button>
      )}
    </div>
  );
}
```

### Prefetching

```typescript
import { prefetchContact, prefetchContacts } from "@/lib/queryClient";

function ContactListItem({ contact }: { contact: Contact }) {
  return (
    <Link
      to={`/contacts/${contact.id}`}
      onMouseEnter={() => prefetchContact(contact.id)} // Prefetch on hover
    >
      {contact.fullName}
    </Link>
  );
}
```

### Manual Cache Updates

```typescript
import { queryClient, queryKeys } from "@/lib/queryClient";

// Update cache manually
queryClient.setQueryData(
  queryKeys.contacts.detail(contactId),
  (old) => ({ ...old, status: "active" })
);

// Invalidate query
queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all });
```

---

## ⚙️ Configuration

### Query Options (global defaults)

```typescript
// lib/queryClient.ts
export const defaultQueryOptions = {
  queries: {
    gcTime: 1000 * 60 * 5,      // Cache 5 minutes
    staleTime: 1000 * 60,        // Stale after 1 minute
    retry: 2,                     // Retry 2 times
    refetchOnWindowFocus: true,   // Refetch on tab focus
  },
  mutations: {
    retry: 1,                     // Retry mutations once
  },
};
```

### Per-query Configuration

```typescript
const { data } = useContacts(params, {
  staleTime: 1000 * 60 * 10, // 10 minutes
  gcTime: 1000 * 60 * 30,    // 30 minutes
  retry: 5,                   // Retry 5 times
});
```

---

## 🐛 DevTools

React Query DevTools are automatically enabled in development:

```typescript
// Press Ctrl+Shift+D to toggle devtools
// Or click the floating icon in bottom-right corner
```

**Features:**
- View all queries & their states
- Inspect query data
- Trigger manual refetches
- Clear cache
- View query timings

---

## 🧪 Testing

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useContacts } from "@/hooks/queries";

test("fetches contacts", async () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  const { result } = renderHook(() => useContacts(), { wrapper });

  await waitFor(() => expect(result.current.isSuccess).toBe(true));

  expect(result.current.data?.data).toHaveLength(20);
});
```

---

## 🚀 Best Practices

1. **Use compound hooks** for related data
2. **Prefetch** on route transitions and hover
3. **Enable optimistic updates** for better UX
4. **Use proper query keys** for cache management
5. **Handle loading & error states** gracefully
6. **Leverage staleTime** to reduce unnecessary requests
7. **Use DevTools** to debug query issues

---

**Maintained by:** AI Development Team  
**Last Review:** 2026-03-17  
**Next Review:** Phase 2-B kickoff
