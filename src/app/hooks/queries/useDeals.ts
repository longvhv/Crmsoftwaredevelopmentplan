/* ============================================================
 * Deal Query Hooks
 * React Query hooks for deal data fetching
 * ============================================================ */

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryClient";
import {
  getDeals,
  getDealById,
  createDeal,
  updateDeal,
  deleteDeal,
  moveDealToStage,
  markDealWon,
  markDealLost,
  getDealsByContact,
  getDealStats,
  type GetDealsParams,
  type CreateDealDto,
  type UpdateDealDto,
  type Deal,
  type DealStage,
} from "@/api/mock";
import { toast } from "sonner";

/* ============================================================
 * Query Hooks
 * ============================================================ */

/** Fetch deals list with filters, pagination, sorting */
export function useDeals(params?: GetDealsParams) {
  return useQuery({
    queryKey: queryKeys.deals.list(params),
    queryFn: async () => {
      const response = await getDeals(params);
      
      if ("error" in response) {
        throw new Error(response.message);
      }
      
      return response;
    },
  });
}

/** Fetch single deal by ID */
export function useDeal(id: string | undefined) {
  return useQuery({
    queryKey: queryKeys.deals.detail(id || ""),
    queryFn: async () => {
      if (!id) throw new Error("Deal ID is required");
      
      const response = await getDealById(id);
      
      if ("error" in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    enabled: !!id,
  });
}

/** Fetch deals by contact */
export function useDealsByContact(contactId: string | undefined) {
  return useQuery({
    queryKey: queryKeys.deals.byContact(contactId || ""),
    queryFn: async () => {
      if (!contactId) throw new Error("Contact ID is required");
      
      const response = await getDealsByContact(contactId);
      
      if ("error" in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    enabled: !!contactId,
  });
}

/** Fetch deal stats */
export function useDealStats() {
  return useQuery({
    queryKey: queryKeys.deals.stats(),
    queryFn: async () => {
      const response = await getDealStats();
      
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

/** Create deal mutation */
export function useCreateDeal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateDealDto) => {
      const response = await createDeal(data);
      
      if ("error" in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: (newDeal) => {
      // Invalidate deals list
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.stats() });
      
      // Invalidate contact's deals if contactId exists
      if (newDeal.contactId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.deals.byContact(newDeal.contactId) });
      }
      
      // Set new deal in cache
      queryClient.setQueryData(queryKeys.deals.detail(newDeal.id), newDeal);
      
      toast.success("Deal created successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create deal");
    },
  });
}

/** Update deal mutation */
export function useUpdateDeal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateDealDto }) => {
      const response = await updateDeal(id, data);
      
      if ("error" in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.deals.detail(id) });
      
      // Snapshot previous value
      const previousDeal = queryClient.getQueryData<Deal>(queryKeys.deals.detail(id));
      
      // Optimistically update
      if (previousDeal) {
        queryClient.setQueryData(queryKeys.deals.detail(id), {
          ...previousDeal,
          ...data,
        });
      }
      
      return { previousDeal };
    },
    onSuccess: (updatedDeal) => {
      // Update deal in cache
      queryClient.setQueryData(queryKeys.deals.detail(updatedDeal.id), updatedDeal);
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.stats() });
      
      // Invalidate contact's deals if contactId exists
      if (updatedDeal.contactId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.deals.byContact(updatedDeal.contactId) });
      }
      
      toast.success("Deal updated successfully");
    },
    onError: (error, { id }, context) => {
      // Rollback on error
      if (context?.previousDeal) {
        queryClient.setQueryData(queryKeys.deals.detail(id), context.previousDeal);
      }
      
      toast.error(error.message || "Failed to update deal");
    },
  });
}

/** Delete deal mutation */
export function useDeleteDeal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteDeal(id);
      
      if ("error" in response) {
        throw new Error(response.message);
      }
      
      return id;
    },
    onSuccess: (id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.deals.detail(id) });
      
      // Invalidate lists
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.stats() });
      
      toast.success("Deal deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete deal");
    },
  });
}

/** Move deal to stage mutation */
export function useMoveDealToStage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, stage }: { id: string; stage: DealStage }) => {
      const response = await moveDealToStage(id, stage);
      
      if ("error" in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: (updatedDeal) => {
      // Update deal in cache
      queryClient.setQueryData(queryKeys.deals.detail(updatedDeal.id), updatedDeal);
      
      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.stats() });
      
      toast.success(`Deal moved to ${updatedDeal.stage}`);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to move deal");
    },
  });
}

/** Mark deal as won mutation */
export function useMarkDealWon() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await markDealWon(id);
      
      if ("error" in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: (wonDeal) => {
      // Update deal in cache
      queryClient.setQueryData(queryKeys.deals.detail(wonDeal.id), wonDeal);
      
      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.stats() });
      
      // Also invalidate contact's deals and stats
      if (wonDeal.contactId) {
        queryClient.invalidateQueries({ queryKey: queryKeys.deals.byContact(wonDeal.contactId) });
        queryClient.invalidateQueries({ queryKey: queryKeys.contacts.stats() });
      }
      
      toast.success("🎉 Deal won!");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to mark deal as won");
    },
  });
}

/** Mark deal as lost mutation */
export function useMarkDealLost() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason?: string }) => {
      const response = await markDealLost(id, reason);
      
      if ("error" in response) {
        throw new Error(response.message);
      }
      
      return response.data;
    },
    onSuccess: (lostDeal) => {
      // Update deal in cache
      queryClient.setQueryData(queryKeys.deals.detail(lostDeal.id), lostDeal);
      
      // Invalidate lists and stats
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.lists() });
      queryClient.invalidateQueries({ queryKey: queryKeys.deals.stats() });
      
      toast.success("Deal marked as lost");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to mark deal as lost");
    },
  });
}

/* ============================================================
 * Compound Hooks
 * ============================================================ */

/** Fetch deals with stats */
export function useDealsWithStats(params?: GetDealsParams) {
  const deals = useDeals(params);
  const stats = useDealStats();
  
  return {
    deals,
    stats,
    isLoading: deals.isLoading || stats.isLoading,
    isError: deals.isError || stats.isError,
  };
}

/** Fetch deal with contact info */
export function useDealWithContact(dealId: string | undefined) {
  const deal = useDeal(dealId);
  
  // Import useContact hook when ready
  // const contact = useContact(deal.data?.contactId);
  
  return {
    deal,
    // contact,
    isLoading: deal.isLoading,
    isError: deal.isError,
  };
}
