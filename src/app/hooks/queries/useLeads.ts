/* ============================================================
 * Lead Query Hooks
 * React Query hooks for lead data fetching
 * ============================================================ */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryClient";
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  qualifyLead,
  convertLead,
  searchLeads,
  getLeadStats,
  type GetLeadsParams,
  type CreateLeadDto,
  type UpdateLeadDto,
  type ConvertLeadDto,
  type Lead,
} from "@/api/mock";
import { toast } from "sonner";

/* ============================================================
 * Query Hooks
 * ============================================================ */

/** Fetch leads list with filters, pagination, sorting */
export function useLeads(params?: GetLeadsParams) {
  return useQuery({
    queryKey: queryKeys.leads.list(params),
    queryFn: async () => {
      const response = await getLeads(params);
      
      if ("error" in response) {
        throw new Error(response.message);
      }
      
      return response;
    },
  });
}

/** Fetch single lead by ID */
export function useLead(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.leads.detail(id || ""),
    queryFn: async () => {
      if (!id) throw new Error("Lead ID is required");
      
      const response = await getLeadById(id);
      
      if ("error" in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    enabled: !!id,
  });
}

/** Search leads */
export function useLeadSearch(query: string, limit?: number) {
  return useQuery({
    queryKey: queryKeys.leads.search(query),
    queryFn: async () => {
      const response = await searchLeads(query, limit);
      
      if ("error" in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    enabled: query.length > 0,
    staleTime: 1000 * 30, // 30 seconds
  });
}

/** Fetch lead stats */
export function useLeadStats() {
  return useQuery({
    queryKey: queryKeys.leads.stats(),
    queryFn: async () => {
      const response = await getLeadStats();
      
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

/** Create lead mutation */
export function useCreateLead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateLeadDto) => {
      const response = await createLead(data);
      
      if ("error" in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: (newLead) => {
      // Invalidate leads list
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.stats() });
      
      // Set new lead in cache
      queryClient.setQueryData(queryKeys.leads.detail(newLead.id), newLead);
      
      toast.success("Lead created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create lead");
    },
  });
}

/** Update lead mutation */
export function useUpdateLead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateLeadDto }) => {
      const response = await updateLead(id, data);
      
      if ("error" in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.leads.detail(id) });
      
      // Snapshot previous value
      const previousLead = queryClient.getQueryData<Lead>(queryKeys.leads.detail(id));
      
      // Optimistically update
      if (previousLead) {
        queryClient.setQueryData(queryKeys.leads.detail(id), {
          ...previousLead,
          ...data,
        });
      }
      
      return { previousLead };
    },
    onSuccess: (updatedLead) => {
      // Update lead in cache
      queryClient.setQueryData(queryKeys.leads.detail(updatedLead.id), updatedLead);
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.stats() });
      
      toast.success("Lead updated successfully");
    },
    onError: (error, { id }, context) => {
      // Rollback on error
      if (context?.previousLead) {
        queryClient.setQueryData(queryKeys.leads.detail(id), context.previousLead);
      }
      
      toast.error(error.message || "Failed to update lead");
    },
  });
}

/** Delete lead mutation */
export function useDeleteLead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteLead(id);
      
      if ("error" in response) {
        throw new Error(response.message);
      }
      
      return id;
    },
    onSuccess: (id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.leads.detail(id) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.stats() });
      
      toast.success("Lead deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete lead");
    },
  });
}

/** Qualify lead mutation */
export function useQualifyLead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await qualifyLead(id);
      
      if ("error" in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: (qualifiedLead) => {
      // Update lead in cache
      queryClient.setQueryData(queryKeys.leads.detail(qualifiedLead.id), qualifiedLead);
      
      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.stats() });
      
      toast.success("Lead qualified successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to qualify lead");
    },
  });
}

/** Convert lead mutation */
export function useConvertLead() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, options }: { id: string; options?: ConvertLeadDto }) => {
      const response = await convertLead(id, options);
      
      if ("error" in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: (result) => {
      // Update lead in cache
      queryClient.setQueryData(queryKeys.leads.detail(result.lead.id), result.lead);
      
      // Invalidate leads
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.leads.stats() });
      
      // Invalidate contacts and deals if created
      if (result.contactId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.contacts.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.contacts.stats() });
      }
      
      if (result.dealId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.deals.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.deals.stats() });
      }
      
      toast.success("Lead converted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to convert lead");
    },
  });
}

/* ============================================================
 * Compound Hooks
 * ============================================================ */

/** Fetch leads with stats */
export function useLeadsWithStats(params?: GetLeadsParams) {
  const leads = useLeads(params);
  const stats = useLeadStats();
  
  return {
    leads,
    stats,
    isLoading: leads.isLoading || stats.isLoading,
    isError: leads.isError || stats.isError,
  };
}

/** Fetch qualified leads ready to convert */
export function useQualifiedLeads() {
  return useLeads({
    filters: {
      status: "qualified",
      minLeadScore: 70,
      qualified: true,
      converted: false,
    },
    sortBy: "leadScore",
    sortOrder: "desc",
  });
}

/** Fetch new leads needing attention */
export function useNewLeads() {
  return useLeads({
    filters: {
      status: ["new", "contacted"],
    },
    sortBy: "createdAt",
    sortOrder: "desc",
  });
}
