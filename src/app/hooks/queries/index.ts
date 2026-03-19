/* ============================================================
 * Query Hooks - Central Export
 * All React Query hooks in one place
 * ============================================================ */

// Contact hooks
export {
  useContacts,
  useContact,
  useContactSearch,
  useContactStats,
  useCreateContact,
  useUpdateContact,
  useDeleteContact,
  useBulkDeleteContacts,
  useContactWithRelations,
  useContactsWithStats,
} from "./useContacts";

// Deal hooks
export {
  useDeals,
  useDeal,
  useDealsByContact,
  useDealStats,
  useCreateDeal,
  useUpdateDeal,
  useDeleteDeal,
  useMoveDealToStage,
  useMarkDealWon,
  useMarkDealLost,
  useDealsWithStats,
  useDealWithContact,
} from "./useDeals";

// Lead hooks
export {
  useLeads,
  useLead,
  useLeadSearch,
  useLeadStats,
  useCreateLead,
  useUpdateLead,
  useDeleteLead,
  useQualifyLead,
  useConvertLead,
  useLeadsWithStats,
  useQualifiedLeads,
  useNewLeads,
} from "./useLeads";
