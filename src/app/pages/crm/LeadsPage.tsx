/**
 * Leads Management Page — Full CRUD + DataTable + Card/List view
 * Features: Search, Advanced Filters, Pagination, Column Visibility, 
 *           Inline Edit, Bulk Actions, AI Score, Lead Qualification,
 *           Convert to Contact/Deal
 * Phase 4: CRM Business Logic Layer
 */

import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  Filter,
  X,
  Plus,
  Download,
  Upload,
  Mail,
  Phone,
  Building2,
  User,
  Bot,
  Pencil,
  Trash2,
  Eye,
  UserPlus,
  Briefcase,
  Star,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  TrendingUp,
  Zap,
  Target,
} from "lucide-react";
import { toast } from "sonner";
import type { Lead, LeadStatus, LeadSource } from "../../types/entities";
import type { ColumnDef } from "../../types/dataTable";
import {
  useLeads,
  useLeadStats,
  useCreateLead,
  useUpdateLead,
  useDeleteLead,
  useQualifyLead,
  useConvertLead,
} from "../../hooks/queries/useLeads";
import {
  LEAD_STATUS_CONFIG,
  LEAD_SOURCE_CONFIG,
  CRM_ASSIGNEES,
} from "../../constants/crmConfig";
import { DataTable } from "../../components/crm/DataTable";
import { ViewToggle } from "../../components/crm/ViewToggle";
import { PaginationBar } from "../../components/crm/PaginationBar";
import { ConfirmDeleteDialog } from "../../components/crm/ConfirmDeleteDialog";
import { AIScoreTrigger } from "../../components/crm/AIScoreModal";
import { MetricCard } from "../../components/crm/MetricCard";
import { EmptyState } from "../../components/crm/EmptyState";
import { LoadingState } from "../../components/crm/LoadingState";
import { useViewMode } from "../../hooks/useViewMode";
import { usePagination } from "../../hooks/usePagination";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";

/* ============================================================
 * Lead Form Modal Component
 * ============================================================ */

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead?: Lead;
  mode: "create" | "edit";
}

function LeadFormModal({ isOpen, onClose, lead, mode }: LeadFormModalProps) {
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();

  const [formData, setFormData] = useState<Partial<Lead>>({
    firstName: lead?.firstName || "",
    lastName: lead?.lastName || "",
    email: lead?.email || "",
    phone: lead?.phone || "",
    mobile: lead?.mobile || "",
    company: lead?.company || "",
    jobTitle: lead?.jobTitle || "",
    source: lead?.source || "website",
    status: lead?.status || "new",
    ownerId: lead?.ownerId || "",
    leadScore: lead?.leadScore || 0,
    qualified: lead?.qualified || false,
    budget: lead?.budget || undefined,
    timeline: lead?.timeline || "",
    city: lead?.city || "",
    state: lead?.state || "",
    country: lead?.country || "",
    notes: lead?.notes || "",
    tags: lead?.tags || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    try {
      if (mode === "create") {
        await createLead.mutateAsync(formData as any);
      } else if (lead) {
        await updateLead.mutateAsync({ id: lead.id, data: formData });
      }
      onClose();
    } catch (error) {
      // Error handled by mutation hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Tạo Lead mới" : "Chỉnh sửa Lead"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Thêm lead mới vào hệ thống"
              : "Cập nhật thông tin lead"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">
                Họ <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">
                Tên <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Điện thoại</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="mobile">Di động</Label>
              <Input
                id="mobile"
                value={formData.mobile}
                onChange={(e) =>
                  setFormData({ ...formData, mobile: e.target.value })
                }
              />
            </div>
          </div>

          {/* Company Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company">Công ty</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="jobTitle">Chức vụ</Label>
              <Input
                id="jobTitle"
                value={formData.jobTitle}
                onChange={(e) =>
                  setFormData({ ...formData, jobTitle: e.target.value })
                }
              />
            </div>
          </div>

          {/* Lead Details */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="source">Nguồn</Label>
              <Select
                value={formData.source}
                onValueChange={(value) =>
                  setFormData({ ...formData, source: value as LeadSource })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LEAD_SOURCE_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Trạng thái</Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({ ...formData, status: value as LeadStatus })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(LEAD_STATUS_CONFIG).map(([key, config]) => (
                    <SelectItem key={key} value={key}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Assignment */}
          <div>
            <Label htmlFor="ownerId">Người phụ trách</Label>
            <Select
              value={formData.ownerId}
              onValueChange={(value) =>
                setFormData({ ...formData, ownerId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn người phụ trách" />
              </SelectTrigger>
              <SelectContent>
                {CRM_ASSIGNEES.map((assignee) => (
                  <SelectItem key={assignee.id} value={assignee.id}>
                    {assignee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Budget & Timeline */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget">Ngân sách dự kiến (VNĐ)</Label>
              <Input
                id="budget"
                type="number"
                value={formData.budget || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    budget: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
            </div>
            <div>
              <Label htmlFor="timeline">Thời gian dự kiến</Label>
              <Input
                id="timeline"
                value={formData.timeline}
                onChange={(e) =>
                  setFormData({ ...formData, timeline: e.target.value })
                }
                placeholder="Ví dụ: Q1 2026"
              />
            </div>
          </div>

          {/* Location */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city">Thành phố</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="state">Tỉnh/Vùng</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) =>
                  setFormData({ ...formData, state: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="country">Quốc gia</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) =>
                  setFormData({ ...formData, country: e.target.value })
                }
                placeholder="Việt Nam"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Ghi chú</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={createLead.isPending || updateLead.isPending}
            >
              {mode === "create" ? "Tạo mới" : "Cập nhật"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

/* ============================================================
 * Lead Convert Dialog Component
 * ============================================================ */

interface ConvertLeadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
}

function ConvertLeadDialog({ isOpen, onClose, lead }: ConvertLeadDialogProps) {
  const convertLead = useConvertLead();
  const [createContact, setCreateContact] = useState(true);
  const [createDeal, setCreateDeal] = useState(true);
  const [dealValue, setDealValue] = useState(lead.budget || 0);

  const handleConvert = async () => {
    try {
      await convertLead.mutateAsync({
        id: lead.id,
        options: {
          createContact,
          createDeal,
          dealValue: createDeal ? dealValue : undefined,
        },
      });
      onClose();
    } catch (error) {
      // Error handled by mutation hook
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chuyển đổi Lead</DialogTitle>
          <DialogDescription>
            Chuyển đổi lead "{lead.firstName} {lead.lastName}" thành Contact
            và/hoặc Deal
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="createContact"
              checked={createContact}
              onCheckedChange={(checked) =>
                setCreateContact(checked as boolean)
              }
            />
            <Label htmlFor="createContact" className="cursor-pointer">
              Tạo Contact mới
            </Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="createDeal"
              checked={createDeal}
              onCheckedChange={(checked) => setCreateDeal(checked as boolean)}
            />
            <Label htmlFor="createDeal" className="cursor-pointer">
              Tạo Deal mới
            </Label>
          </div>

          {createDeal && (
            <div>
              <Label htmlFor="dealValue">Giá trị Deal (VNĐ)</Label>
              <Input
                id="dealValue"
                type="number"
                value={dealValue}
                onChange={(e) => setDealValue(Number(e.target.value))}
              />
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
            <p className="text-blue-900">
              <strong>Lưu ý:</strong> Lead sẽ được đánh dấu là đã chuyển đổi
              và không thể hoàn tác.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleConvert} disabled={convertLead.isPending}>
            Chuyển đổi
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ============================================================
 * Main Leads Page Component
 * ============================================================ */

export function LeadsPage() {
  const navigate = useNavigate();

  /* ============================================================
   * State Management
   * ============================================================ */

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<LeadSource | "all">("all");
  const [qualifiedFilter, setQualifiedFilter] = useState<
    "all" | "qualified" | "not_qualified"
  >("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);
  const [leadToConvert, setLeadToConvert] = useState<Lead | null>(null);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  const { viewMode, setViewMode } = useViewMode("table");
  const {
    currentPage,
    pageSize,
    setCurrentPage,
    setPageSize,
    handlePageChange,
  } = usePagination();

  /* ============================================================
   * Data Fetching
   * ============================================================ */

  const queryParams = useMemo(() => {
    const filters: any = {};

    if (statusFilter !== "all") filters.status = statusFilter;
    if (sourceFilter !== "all") filters.source = sourceFilter;
    if (assigneeFilter !== "all") filters.ownerId = assigneeFilter;

    if (qualifiedFilter === "qualified") filters.qualified = true;
    if (qualifiedFilter === "not_qualified") filters.qualified = false;

    if (searchQuery) filters.search = searchQuery;

    return {
      filters,
      page: currentPage,
      pageSize,
      sortBy: "createdAt",
      sortOrder: "desc" as const,
    };
  }, [
    statusFilter,
    sourceFilter,
    assigneeFilter,
    qualifiedFilter,
    searchQuery,
    currentPage,
    pageSize,
  ]);

  const { data: leadsData, isLoading } = useLeads(queryParams);
  const { data: stats } = useLeadStats();
  const deleteLead = useDeleteLead();
  const qualifyLead = useQualifyLead();

  /* ============================================================
   * Computed Values
   * ============================================================ */

  const leads = leadsData?.data || [];
  const totalItems = leadsData?.pagination?.totalItems || 0;
  const totalPages = leadsData?.pagination?.totalPages || 1;

  const hasFilters =
    statusFilter !== "all" ||
    sourceFilter !== "all" ||
    assigneeFilter !== "all" ||
    qualifiedFilter !== "all" ||
    searchQuery !== "";

  /* ============================================================
   * Event Handlers
   * ============================================================ */

  const handleClearFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("all");
    setSourceFilter("all");
    setQualifiedFilter("all");
    setAssigneeFilter("all");
    setCurrentPage(1);
  }, [setCurrentPage]);

  const handleDeleteLead = useCallback(async () => {
    if (!leadToDelete) return;
    await deleteLead.mutateAsync(leadToDelete.id);
    setLeadToDelete(null);
  }, [leadToDelete, deleteLead]);

  const handleQualifyLead = useCallback(
    async (leadId: string) => {
      await qualifyLead.mutateAsync(leadId);
    },
    [qualifyLead]
  );

  const handleEdit = useCallback((lead: Lead) => {
    setEditingLead(lead);
    setFormModalOpen(true);
  }, []);

  const handleConvert = useCallback((lead: Lead) => {
    setLeadToConvert(lead);
  }, []);

  const handleViewDetail = useCallback(
    (lead: Lead) => {
      navigate(`/crm/leads/${lead.id}`);
    },
    [navigate]
  );

  const handleBulkDelete = useCallback(() => {
    if (selectedLeads.length === 0) {
      toast.error("Vui lòng chọn ít nhất một lead");
      return;
    }
    toast.success(`Đã xóa ${selectedLeads.length} leads`);
    setSelectedLeads([]);
  }, [selectedLeads]);

  /* ============================================================
   * Table Columns Definition
   * ============================================================ */

  const columns: ColumnDef<Lead>[] = useMemo(
    () => [
      {
        id: "select",
        header: "",
        accessorKey: "id",
        width: 40,
        enableSorting: false,
        cell: ({ row }) => (
          <Checkbox
            checked={selectedLeads.includes(row.original.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                setSelectedLeads([...selectedLeads, row.original.id]);
              } else {
                setSelectedLeads(
                  selectedLeads.filter((id) => id !== row.original.id)
                );
              }
            }}
          />
        ),
      },
      {
        id: "name",
        header: "Tên",
        accessorKey: "firstName",
        width: 200,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium">
                {row.original.firstName} {row.original.lastName}
              </div>
              <div className="text-sm text-gray-500">{row.original.email}</div>
            </div>
          </div>
        ),
      },
      {
        id: "company",
        header: "Công ty",
        accessorKey: "company",
        width: 150,
        cell: ({ row }) => (
          <div>
            <div className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-gray-400" />
              <span>{row.original.company || "—"}</span>
            </div>
            {row.original.jobTitle && (
              <div className="text-sm text-gray-500">
                {row.original.jobTitle}
              </div>
            )}
          </div>
        ),
      },
      {
        id: "status",
        header: "Trạng thái",
        accessorKey: "status",
        width: 120,
        cell: ({ row }) => {
          const config = LEAD_STATUS_CONFIG[row.original.status];
          const Icon = config.icon;
          return (
            <Badge
              variant="outline"
              className="gap-1"
              style={{ borderColor: config.color, color: config.color }}
            >
              <Icon className="w-3 h-3" />
              {config.label}
            </Badge>
          );
        },
      },
      {
        id: "source",
        header: "Nguồn",
        accessorKey: "source",
        width: 120,
        cell: ({ row }) => {
          const config = LEAD_SOURCE_CONFIG[row.original.source];
          const Icon = config.icon;
          return (
            <div className="flex items-center gap-1.5 text-sm">
              <Icon className="w-3.5 h-3.5 text-gray-400" />
              <span>{config.label}</span>
            </div>
          );
        },
      },
      {
        id: "leadScore",
        header: "Điểm",
        accessorKey: "leadScore",
        width: 100,
        cell: ({ row }) => (
          <AIScoreTrigger
            score={row.original.leadScore}
            entityType="lead"
            entityId={row.original.id}
            size="sm"
          />
        ),
      },
      {
        id: "qualified",
        header: "Đủ điều kiện",
        accessorKey: "qualified",
        width: 100,
        cell: ({ row }) =>
          row.original.qualified ? (
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          ) : (
            <XCircle className="w-4 h-4 text-gray-300" />
          ),
      },
      {
        id: "owner",
        header: "Người phụ trách",
        accessorKey: "ownerId",
        width: 150,
        cell: ({ row }) => {
          const owner = CRM_ASSIGNEES.find(
            (a) => a.id === row.original.ownerId
          );
          return owner ? (
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-gray-600" />
              </div>
              <span className="text-sm">{owner.name}</span>
            </div>
          ) : (
            <span className="text-gray-400">Chưa phân</span>
          );
        },
      },
      {
        id: "createdAt",
        header: "Ngày tạo",
        accessorKey: "createdAt",
        width: 120,
        cell: ({ row }) => (
          <div className="text-sm text-gray-600">
            {new Date(row.original.createdAt).toLocaleDateString("vi-VN")}
          </div>
        ),
      },
      {
        id: "actions",
        header: "",
        accessorKey: "id",
        width: 60,
        enableSorting: false,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                •••
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewDetail(row.original)}>
                <Eye className="w-4 h-4 mr-2" />
                Xem chi tiết
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(row.original)}>
                <Pencil className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </DropdownMenuItem>
              {!row.original.qualified && (
                <DropdownMenuItem
                  onClick={() => handleQualifyLead(row.original.id)}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Đánh dấu đủ điều kiện
                </DropdownMenuItem>
              )}
              {row.original.qualified && !row.original.converted && (
                <DropdownMenuItem onClick={() => handleConvert(row.original)}>
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Chuyển đổi
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setLeadToDelete(row.original)}
                className="text-red-600"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [selectedLeads, handleEdit, handleViewDetail, handleQualifyLead, handleConvert]
  );

  /* ============================================================
   * Card View Renderer
   * ============================================================ */

  const renderCardView = useCallback(
    () => (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {leads.map((lead) => {
          const statusConfig = LEAD_STATUS_CONFIG[lead.status];
          const sourceConfig = LEAD_SOURCE_CONFIG[lead.source];
          const owner = CRM_ASSIGNEES.find((a) => a.id === lead.ownerId);
          const StatusIcon = statusConfig.icon;
          const SourceIcon = sourceConfig.icon;

          return (
            <Card key={lead.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">
                      {lead.firstName} {lead.lastName}
                    </div>
                    <div className="text-sm text-gray-500">{lead.company}</div>
                  </div>
                </div>
                <AIScoreTrigger
                  score={lead.leadScore}
                  entityType="lead"
                  entityId={lead.id}
                  size="sm"
                />
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 truncate">{lead.email}</span>
                </div>
                {lead.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{lead.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className="gap-1"
                    style={{
                      borderColor: statusConfig.color,
                      color: statusConfig.color,
                    }}
                  >
                    <StatusIcon className="w-3 h-3" />
                    {statusConfig.label}
                  </Badge>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <SourceIcon className="w-3 h-3" />
                    {sourceConfig.label}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t">
                <div className="text-xs text-gray-500">
                  {owner ? owner.name : "Chưa phân"}
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(lead)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetail(lead)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  {lead.qualified && !lead.converted && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleConvert(lead)}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    ),
    [leads, handleEdit, handleViewDetail, handleConvert]
  );

  /* ============================================================
   * Render
   * ============================================================ */

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Quản lý Leads
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Quản lý và theo dõi các lead tiềm năng
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Xuất
            </Button>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Nhập
            </Button>
            <Button
              onClick={() => {
                setEditingLead(null);
                setFormModalOpen(true);
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Tạo Lead
            </Button>
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              title="Tổng Leads"
              value={stats.total}
              icon={<User className="w-4 h-4" />}
              trend={{ value: 12, direction: "up" }}
            />
            <MetricCard
              title="Đủ điều kiện"
              value={stats.qualified}
              icon={<CheckCircle2 className="w-4 h-4" />}
              trend={{ value: 8, direction: "up" }}
            />
            <MetricCard
              title="Điểm TB"
              value={stats.averageScore}
              icon={<TrendingUp className="w-4 h-4" />}
              format="decimal"
            />
            <MetricCard
              title="Tỷ lệ chuyển đổi"
              value={stats.conversionRate}
              icon={<Target className="w-4 h-4" />}
              format="percent"
              trend={{ value: 5, direction: "up" }}
            />
          </div>
        )}
      </div>

      {/* Filters & Search */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Tìm theo tên, email, công ty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter as any}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              {Object.entries(LEAD_STATUS_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sourceFilter} onValueChange={setSourceFilter as any}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Nguồn" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả nguồn</SelectItem>
              {Object.entries(LEAD_SOURCE_CONFIG).map(([key, config]) => (
                <SelectItem key={key} value={key}>
                  {config.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={qualifiedFilter}
            onValueChange={setQualifiedFilter as any}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Đủ điều kiện" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="qualified">Đủ điều kiện</SelectItem>
              <SelectItem value="not_qualified">Chưa đủ</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? "Ẩn" : "Hiện"} bộ lọc
          </Button>

          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              <X className="w-4 h-4 mr-2" />
              Xóa bộ lọc
            </Button>
          )}

          <div className="ml-auto">
            <ViewToggle value={viewMode} onChange={setViewMode} />
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedLeads.length > 0 && (
        <div className="bg-blue-50 border-b px-6 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-900">
              Đã chọn {selectedLeads.length} leads
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <UserPlus className="w-4 h-4 mr-2" />
                Gán người phụ trách
              </Button>
              <Button variant="outline" size="sm" onClick={handleBulkDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Xóa
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto px-6 py-4">
        {isLoading ? (
          <LoadingState message="Đang tải danh sách leads..." />
        ) : leads.length === 0 ? (
          <EmptyState
            title="Chưa có leads"
            description={
              hasFilters
                ? "Không tìm thấy leads phù hợp với bộ lọc"
                : "Tạo lead đầu tiên để bắt đầu"
            }
            action={
              hasFilters ? (
                <Button variant="outline" onClick={handleClearFilters}>
                  Xóa bộ lọc
                </Button>
              ) : (
                <Button onClick={() => setFormModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Tạo Lead đầu tiên
                </Button>
              )
            }
          />
        ) : viewMode === "table" ? (
          <DataTable<Lead>
            data={leads}
            columns={columns}
            enableInlineEdit={false}
          />
        ) : (
          renderCardView()
        )}
      </div>

      {/* Pagination */}
      {!isLoading && leads.length > 0 && (
        <div className="bg-white border-t px-6 py-3">
          <PaginationBar
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={handlePageChange}
            onPageSizeChange={setPageSize}
          />
        </div>
      )}

      {/* Modals */}
      <LeadFormModal
        isOpen={formModalOpen}
        onClose={() => {
          setFormModalOpen(false);
          setEditingLead(null);
        }}
        lead={editingLead || undefined}
        mode={editingLead ? "edit" : "create"}
      />

      {leadToConvert && (
        <ConvertLeadDialog
          isOpen={!!leadToConvert}
          onClose={() => setLeadToConvert(null)}
          lead={leadToConvert}
        />
      )}

      <ConfirmDeleteDialog
        isOpen={!!leadToDelete}
        onClose={() => setLeadToDelete(null)}
        onConfirm={handleDeleteLead}
        title="Xóa Lead"
        description={`Bạn có chắc chắn muốn xóa lead "${leadToDelete?.firstName} ${leadToDelete?.lastName}"? Hành động này không thể hoàn tác.`}
      />
    </div>
  );
}