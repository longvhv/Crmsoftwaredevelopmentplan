/* ============================================================
 * Contact Query Hooks
 * React Query hooks for contact data fetching
 * ============================================================ */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryClient";
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  bulkDeleteContacts,
  searchContacts,
  getContactStats,
  type GetContactsParams,
  type CreateContactDto,
  type UpdateContactDto,
  type Contact,
} from "@/api/mock";
import { toast } from "sonner";

/* ============================================================
 * Query Hooks
 * ============================================================ */

/** Fetch contacts list with filters, pagination, sorting */
export function useContacts(params?: GetContactsParams) {
  return useQuery({
    queryKey: queryKeys.contacts.list(params),
    queryFn: async () => {
      const response = await getContacts(params);
      
      if ("error" in response) {
        throw new Error(response.message);
      }
      
      return response;
    },
  });
}

/** Fetch single contact by ID */
export function useContact(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.contacts.detail(id || ""),
    queryFn: async () => {
      if (!id) throw new Error("Contact ID is required");
      
      const response = await getContactById(id);
      
      if ("error" in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    enabled: !!id,
  });
}

/** Search contacts */
export function useContactSearch(query: string, limit?: number) {
  return useQuery({
    queryKey: queryKeys.contacts.search(query),
    queryFn: async () => {
      const response = await searchContacts(query, limit);
      
      if ("error" in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    enabled: query.length > 0,
    staleTime: 1000 * 30, // 30 seconds
  });
}

/** Fetch contact stats */
export function useContactStats() {
  return useQuery({
    queryKey: queryKeys.contacts.stats(),
    queryFn: async () => {
      const response = await getContactStats();
      
      if ("error" in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/* ============================================================
 * Mutation Hooks
 * ============================================================ */

/** Create contact mutation */
export function useCreateContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateContactDto) => {
      const response = await createContact(data);
      
      if ("error" in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: (newContact) => {
      // Invalidate contacts list
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.stats() });
      
      // Set new contact in cache
      queryClient.setQueryData(queryKeys.contacts.detail(newContact.id), newContact);
      
      toast.success("Contact created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create contact");
    },
  });
}

/** Update contact mutation */
export function useUpdateContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateContactDto }) => {
      const response = await updateContact(id, data);
      
      if ("error" in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.contacts.detail(id) });
      
      // Snapshot previous value
      const previousContact = queryClient.getQueryData<Contact>(queryKeys.contacts.detail(id));
      
      // Optimistically update
      if (previousContact) {
        queryClient.setQueryData(queryKeys.contacts.detail(id), {
          ...previousContact,
          ...data,
        });
      }
      
      return { previousContact };
    },
    onSuccess: (updatedContact) => {
      // Update contact in cache
      queryClient.setQueryData(queryKeys.contacts.detail(updatedContact.id), updatedContact);
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.stats() });
      
      toast.success("Contact updated successfully");
    },
    onError: (error, { id }, context) => {
      // Rollback on error
      if (context?.previousContact) {
        queryClient.setQueryData(queryKeys.contacts.detail(id), context.previousContact);
      }
      
      toast.error(error.message || "Failed to update contact");
    },
  });
}

/** Delete contact mutation */
export function useDeleteContact() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteContact(id);
      
      if ("error" in response) {
        throw new Error(response.message);
      }
      
      return id;
    },
    onSuccess: (id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.contacts.detail(id) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.stats() });
      
      toast.success("Contact deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete contact");
    },
  });
}

/** Bulk delete contacts mutation */
export function useBulkDeleteContacts() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (ids: string[]) => {
      const response = await bulkDeleteContacts(ids);
      
      if ("error" in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: (result) => {
      // Invalidate all contact queries
      queryClient.invalidateQueries({ queryKey: queryKeys.contacts.all });
      
      toast.success(`${result.deleted} contacts deleted successfully`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete contacts");
    },
  });
}

/* ============================================================
 * Compound Hooks (convenience)
 * ============================================================ */

/** Fetch contact with its deals and activities */
export function useContactWithRelations(id: string | undefined) {
  const contact = useContact(id);
  
  // TODO: Add deals and activities queries when those hooks are ready
  // const deals = useDealsByContact(id);
  // const activities = useActivitiesByContact(id);
  
  return {
    contact,
    // deals,
    // activities,
    isLoading: contact.isLoading,
    isError: contact.isError,
    error: contact.error,
  };
}

/** Fetch contacts with stats */
export function useContactsWithStats(params?: GetContactsParams) {
  const contacts = useContacts(params);
  const stats = useContactStats();
  
  return {
    contacts,
    stats,
    isLoading: contacts.isLoading || stats.isLoading,
    isError: contacts.isError || stats.isError,
  };
}
