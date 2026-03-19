/* ============================================================
 * React Query Client Configuration
 * Centralized query client with default options
 * ============================================================ */

import { QueryClient } from "@tanstack/react-query";

/* ============================================================
 * Default Query Options
 * ============================================================ */

export const defaultQueryOptions = {
  queries: {
    // Cache for 5 minutes
    gcTime: 1000 * 60 * 5,
    
    // Stale after 1 minute
    staleTime: 1000 * 60,
    
    // Retry failed requests 2 times
    retry: 2,
    
    // Refetch on window focus for fresh data
    refetchOnWindowFocus: true,
    
    // Refetch on reconnect
    refetchOnReconnect: true,
    
    // Refetch on mount if stale
    refetchOnMount: true,
  },
  mutations: {
    // Retry failed mutations once
    retry: 1,
  },
};

/* ============================================================
 * Query Client Instance
 * ============================================================ */

export const queryClient = new QueryClient({
  defaultOptions: defaultQueryOptions,
});

/* ============================================================
 * Query Key Factories
 * Consistent query keys across the app
 * ============================================================ */

export const queryKeys = {
  // Contacts
  contacts: {
    all: ["contacts"] as const,
    lists: () => [...queryKeys.contacts.all, "list"] as const,
    list: (filters?: unknown) => [...queryKeys.contacts.lists(), filters] as const,
    details: () => [...queryKeys.contacts.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.contacts.details(), id] as const,
    stats: () => [...queryKeys.contacts.all, "stats"] as const,
    search: (query: string) => [...queryKeys.contacts.all, "search", query] as const,
  },
  
  // Deals
  deals: {
    all: ["deals"] as const,
    lists: () => [...queryKeys.deals.all, "list"] as const,
    list: (filters?: unknown) => [...queryKeys.deals.lists(), filters] as const,
    details: () => [...queryKeys.deals.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.deals.details(), id] as const,
    stats: () => [...queryKeys.deals.all, "stats"] as const,
    byContact: (contactId: string) => [...queryKeys.deals.all, "by-contact", contactId] as const,
  },
  
  // Leads
  leads: {
    all: ["leads"] as const,
    lists: () => [...queryKeys.leads.all, "list"] as const,
    list: (filters?: unknown) => [...queryKeys.leads.lists(), filters] as const,
    details: () => [...queryKeys.leads.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.leads.details(), id] as const,
    stats: () => [...queryKeys.leads.all, "stats"] as const,
    search: (query: string) => [...queryKeys.leads.all, "search", query] as const,
  },
  
  // Activities
  activities: {
    all: ["activities"] as const,
    lists: () => [...queryKeys.activities.all, "list"] as const,
    list: (filters?: unknown) => [...queryKeys.activities.lists(), filters] as const,
    byContact: (contactId: string) => [...queryKeys.activities.all, "by-contact", contactId] as const,
  },
  
  // Employees
  employees: {
    all: ["employees"] as const,
    lists: () => [...queryKeys.employees.all, "list"] as const,
    list: (filters?: unknown) => [...queryKeys.employees.lists(), filters] as const,
    detail: (id: string) => [...queryKeys.employees.all, "detail", id] as const,
  },
  
  // Products
  products: {
    all: ["products"] as const,
    lists: () => [...queryKeys.products.all, "list"] as const,
    list: (filters?: unknown) => [...queryKeys.products.lists(), filters] as const,
  },
} as const;

/* ============================================================
 * Cache Invalidation Helpers
 * ============================================================ */

/** Invalidate all contact queries */
export function invalidateContacts() {
  return queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all });
}

/** Invalidate specific contact */
export function invalidateContact(id: string) {
  return queryClient.invalidateQueries({ queryKey: queryKeys.contacts.detail(id) });
}

/** Invalidate all deal queries */
export function invalidateDeals() {
  return queryClient.invalidateQueries({ queryKey: queryKeys.deals.all });
}

/** Invalidate specific deal */
export function invalidateDeal(id: string) {
  return queryClient.invalidateQueries({ queryKey: queryKeys.deals.detail(id) });
}

/** Invalidate all lead queries */
export function invalidateLeads() {
  return queryClient.invalidateQueries({ queryKey: queryKeys.leads.all });
}

/** Invalidate specific lead */
export function invalidateLead(id: string) {
  return queryClient.invalidateQueries({ queryKey: queryKeys.leads.detail(id) });
}

/** Invalidate all queries (global cache clear) */
export function invalidateAll() {
  return queryClient.invalidateQueries();
}

/* ============================================================
 * Prefetch Helpers
 * ============================================================ */

/** Prefetch contacts list */
export function prefetchContacts(filters?: unknown) {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.contacts.list(filters),
    queryFn: async () => {
      const { getContacts } = await import("@/api/mock");
      return getContacts({ filters: filters as never });
    },
  });
}

/** Prefetch contact detail */
export function prefetchContact(id: string) {
  return queryClient.prefetchQuery({
    queryKey: queryKeys.contacts.detail(id),
    queryFn: async () => {
      const { getContactById } = await import("@/api/mock");
      return getContactById(id);
    },
  });
}

/* ============================================================
 * Optimistic Update Helpers
 * ============================================================ */

/** Set optimistic contact data */
export function setOptimisticContact(id: string, data: unknown) {
  queryClient.setQueryData(queryKeys.contacts.detail(id), data);
}

/** Set optimistic deal data */
export function setOptimisticDeal(id: string, data: unknown) {
  queryClient.setQueryData(queryKeys.deals.detail(id), data);
}

/** Set optimistic lead data */
export function setOptimisticLead(id: string, data: unknown) {
  queryClient.setQueryData(queryKeys.leads.detail(id), data);
}
