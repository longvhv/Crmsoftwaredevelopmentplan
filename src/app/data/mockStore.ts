/* ============================================================
 * Mock Data Store - Zustand State Management
 * In-memory storage for mock data (thay thế API calls)
 * ============================================================ */

import { create } from "zustand";
import type { Contact, Deal, Lead, Employee, Activity, Product, Quotation, Contract, SupportTicket } from "@/types";

/* ============================================================
 * Store Interface
 * ============================================================ */

interface MockDataStore {
  // Data
  contacts: Contact[];
  deals: Deal[];
  leads: Lead[];
  employees: Employee[];
  activities: Activity[];
  products: Product[];
  quotations: Quotation[];
  contracts: Contract[];
  tickets: SupportTicket[];

  // Loaders
  isSeeded: boolean;
  isLoading: boolean;

  // Actions
  seedData: (data: Partial<MockDataStore>) => void;
  clearData: () => void;
  
  // Contact actions
  addContact: (contact: Contact) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  deleteContact: (id: string) => void;
  
  // Deal actions
  addDeal: (deal: Deal) => void;
  updateDeal: (id: string, updates: Partial<Deal>) => void;
  deleteDeal: (id: string) => void;
  
  // Lead actions
  addLead: (lead: Lead) => void;
  updateLead: (id: string, updates: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  
  // Activity actions
  addActivity: (activity: Activity) => void;
  updateActivity: (id: string, updates: Partial<Activity>) => void;
  deleteActivity: (id: string) => void;
}

/* ============================================================
 * Store Implementation
 * ============================================================ */

export const useMockStore = create<MockDataStore>((set) => ({
  // Initial state
  contacts: [],
  deals: [],
  leads: [],
  employees: [],
  activities: [],
  products: [],
  quotations: [],
  contracts: [],
  tickets: [],
  isSeeded: false,
  isLoading: false,

  // Seed data
  seedData: (data) =>
    set((state) => ({
      ...state,
      ...data,
      isSeeded: true,
    })),

  // Clear all data
  clearData: () =>
    set({
      contacts: [],
      deals: [],
      leads: [],
      employees: [],
      activities: [],
      products: [],
      quotations: [],
      contracts: [],
      tickets: [],
      isSeeded: false,
    }),

  // Contact actions
  addContact: (contact) =>
    set((state) => ({
      contacts: [...state.contacts, contact],
    })),

  updateContact: (id, updates) =>
    set((state) => ({
      contacts: state.contacts.map((c) =>
        c.id === id
          ? {
              ...c,
              ...updates,
              version: c.version + 1,
              updatedAt: new Date().toISOString(),
            }
          : c
      ),
    })),

  deleteContact: (id) =>
    set((state) => ({
      contacts: state.contacts.map((c) =>
        c.id === id
          ? {
              ...c,
              deletedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : c
      ),
    })),

  // Deal actions
  addDeal: (deal) =>
    set((state) => ({
      deals: [...state.deals, deal],
    })),

  updateDeal: (id, updates) =>
    set((state) => ({
      deals: state.deals.map((d) =>
        d.id === id
          ? {
              ...d,
              ...updates,
              version: d.version + 1,
              updatedAt: new Date().toISOString(),
            }
          : d
      ),
    })),

  deleteDeal: (id) =>
    set((state) => ({
      deals: state.deals.map((d) =>
        d.id === id
          ? {
              ...d,
              deletedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : d
      ),
    })),

  // Lead actions
  addLead: (lead) =>
    set((state) => ({
      leads: [...state.leads, lead],
    })),

  updateLead: (id, updates) =>
    set((state) => ({
      leads: state.leads.map((l) =>
        l.id === id
          ? {
              ...l,
              ...updates,
              version: l.version + 1,
              updatedAt: new Date().toISOString(),
            }
          : l
      ),
    })),

  deleteLead: (id) =>
    set((state) => ({
      leads: state.leads.map((l) =>
        l.id === id
          ? {
              ...l,
              deletedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : l
      ),
    })),

  // Activity actions
  addActivity: (activity) =>
    set((state) => ({
      activities: [...state.activities, activity],
    })),

  updateActivity: (id, updates) =>
    set((state) => ({
      activities: state.activities.map((a) =>
        a.id === id
          ? {
              ...a,
              ...updates,
              version: a.version + 1,
              updatedAt: new Date().toISOString(),
            }
          : a
      ),
    })),

  deleteActivity: (id) =>
    set((state) => ({
      activities: state.activities.map((a) =>
        a.id === id
          ? {
              ...a,
              deletedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }
          : a
      ),
    })),
}));

/* ============================================================
 * Selectors (Computed Values)
 * ============================================================ */

/** Get active contacts (not deleted) */
export const useActiveContacts = () =>
  useMockStore((state) => state.contacts.filter((c) => !c.deletedAt));

/** Get active deals */
export const useActiveDeals = () =>
  useMockStore((state) => state.deals.filter((d) => !d.deletedAt));

/** Get active leads */
export const useActiveLeads = () =>
  useMockStore((state) => state.leads.filter((l) => !l.deletedAt));

/** Get contact by ID */
export const useContact = (id: string) =>
  useMockStore((state) => state.contacts.find((c) => c.id === id));

/** Get deal by ID */
export const useDeal = (id: string) =>
  useMockStore((state) => state.deals.find((d) => d.id === id));

/** Get lead by ID */
export const useLead = (id: string) =>
  useMockStore((state) => state.leads.find((l) => l.id === id));

/** Get activities for contact */
export const useContactActivities = (contactId: string) =>
  useMockStore((state) =>
    state.activities.filter((a) => a.contactId === contactId && !a.deletedAt)
  );

/** Get deals for contact */
export const useContactDeals = (contactId: string) =>
  useMockStore((state) =>
    state.deals.filter((d) => d.contactId === contactId && !d.deletedAt)
  );

/** Stats */
export const useMockStats = () =>
  useMockStore((state) => ({
    totalContacts: state.contacts.filter((c) => !c.deletedAt).length,
    totalDeals: state.deals.filter((d) => !d.deletedAt).length,
    totalLeads: state.leads.filter((l) => !l.deletedAt).length,
    totalActivities: state.activities.filter((a) => !a.deletedAt).length,
  }));
