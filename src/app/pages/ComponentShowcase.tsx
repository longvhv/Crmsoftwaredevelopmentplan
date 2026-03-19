/* ============================================================
 * Component Showcase Page
 * Demo tất cả shared components
 * ============================================================ */

import React from "react";
import { Plus, Download, Trash2, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";

// Import all shared components from barrel export
import {
  EmptyState,
  EmptyContacts,
  EmptySearchResults,
  LoadingState,
  SkeletonTable,
  SkeletonCard,
  SearchBar,
  FilterPanel,
  Pagination,
  SimplePagination,
  BulkActions,
  ViewModeSelector,
  StatusBadge,
  LeadStatusBadge,
  DealStatusBadge,
  PriorityBadge,
  ScoreBadge,
  ColumnVisibilityPanel,
  SimpleColumnToggle,
  ListView,
  GridView,
  ContactCard,
  KanbanView,
  DealCard,
} from "@/components/crm";

import {
  useSelection,
  useSearch,
  usePagination,
  useViewMode,
  useFilters,
  useColumnVisibility,
  createColumnDefinition,
} from "@/hooks/ui";

import type { BulkAction } from "@/types/ui-state";
import type { KanbanColumn } from "@/components/crm";

/* ============================================================
 * Component Showcase
 * ============================================================ */

export default function ComponentShowcase() {
  const [activeSection, setActiveSection] = React.useState("empty-states");

  const sections = [
    { id: "empty-states", label: "Empty States" },
    { id: "loading-states", label: "Loading States" },
    { id: "search", label: "Search" },
    { id: "filters", label: "Filters" },
    { id: "pagination", label: "Pagination" },
    { id: "bulk-actions", label: "Bulk Actions" },
    { id: "view-modes", label: "View Modes" },
    { id: "badges", label: "Status Badges" },
    { id: "columns", label: "Column Visibility" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r p-4 overflow-y-auto">
        <h2 className="text-lg font-semibold mb-4">Component Showcase</h2>
        
        {/* Navigation Links */}
        <div className="mb-6 space-y-2 pb-4 border-b">
          <Link to="/showcase" className="block text-sm font-medium text-primary">
            Core Components
          </Link>
          <Link to="/showcase/forms" className="block text-sm text-muted-foreground hover:text-primary">
            Form Components
          </Link>
          <Link to="/showcase/specialized" className="block text-sm text-muted-foreground hover:text-primary">
            Specialized Components
          </Link>
          <Link to="/showcase/data-display" className="block text-sm text-muted-foreground hover:text-primary">
            Data Display
          </Link>
          <Link to="/showcase/navigation" className="block text-sm text-muted-foreground hover:text-primary">
            Navigation
          </Link>
          <Link to="/showcase/feedback" className="block text-sm text-muted-foreground hover:text-primary">
            Feedback & Overlay
          </Link>
        </div>
        
        <nav className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full text-left px-3 py-2 rounded text-sm ${
                activeSection === section.id
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Empty States */}
          {activeSection === "empty-states" && (
            <Section title="Empty States" id="empty-states">
              <Demo title="Generic Empty State">
                <EmptyState
                  title="No items found"
                  description="Get started by creating your first item"
                  action={{
                    label: "Create Item",
                    onClick: () => alert("Create clicked"),
                  }}
                />
              </Demo>

              <Demo title="Empty Contacts">
                <EmptyContacts
                  onAction={() => alert("Add contact")}
                  onSecondaryAction={() => alert("Import")}
                />
              </Demo>

              <Demo title="Empty Search Results">
                <EmptySearchResults
                  query="test search"
                  onClear={() => alert("Clear search")}
                />
              </Demo>
            </Section>
          )}

          {/* Loading States */}
          {activeSection === "loading-states" && (
            <Section title="Loading States" id="loading-states">
              <Demo title="Spinner">
                <LoadingState type="spinner" message="Loading data..." />
              </Demo>

              <Demo title="Dots">
                <LoadingState type="dots" size="lg" />
              </Demo>

              <Demo title="Skeleton Table">
                <SkeletonTable rows={3} columns={4} />
              </Demo>

              <Demo title="Skeleton Card">
                <div className="grid grid-cols-3 gap-4">
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </div>
              </Demo>
            </Section>
          )}

          {/* Search */}
          {activeSection === "search" && <SearchDemo />}

          {/* Filters */}
          {activeSection === "filters" && <FilterDemo />}

          {/* Pagination */}
          {activeSection === "pagination" && <PaginationDemo />}

          {/* Bulk Actions */}
          {activeSection === "bulk-actions" && <BulkActionsDemo />}

          {/* View Modes */}
          {activeSection === "view-modes" && <ViewModeDemo />}

          {/* Badges */}
          {activeSection === "badges" && <BadgesDemo />}

          {/* Columns */}
          {activeSection === "columns" && <ColumnsDemo />}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Section Components
 * ============================================================ */

function Section({
  title,
  id,
  children,
}: {
  title: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="space-y-6">
      <h2 className="text-2xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Demo({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-sm font-medium text-gray-700 mb-4">{title}</h3>
      {children}
    </div>
  );
}

/* ============================================================
 * Search Demo
 * ============================================================ */

function SearchDemo() {
  const search = useSearch({
    searchFields: ["name", "email"],
    debounceMs: 300,
  });

  return (
    <Section title="Search" id="search">
      <Demo title="Search Bar">
        <SearchBar
          value={search.query}
          onChange={search.setQuery}
          onClear={search.clearSearch}
          isSearching={search.isSearching}
          resultCount={42}
          showFilters
          onToggleFilters={() => alert("Toggle filters")}
        />
      </Demo>

      <Demo title="Search Bar States">
        <div className="space-y-4">
          <SearchBar
            value=""
            onChange={() => {}}
            placeholder="Empty state with keyboard hint"
          />
          <SearchBar
            value="searching..."
            onChange={() => {}}
            isSearching
          />
          <SearchBar
            value="test query"
            onChange={() => {}}
            resultCount={5}
          />
        </div>
      </Demo>
    </Section>
  );
}

/* ============================================================
 * Filter Demo
 * ============================================================ */

function FilterDemo() {
  const filters = useFilters();

  const fields = [
    { value: "name", label: "Tên" },
    { value: "email", label: "Email" },
    { value: "status", label: "Trạng thái" },
    { value: "score", label: "Điểm", type: "number" },
  ];

  return (
    <Section title="Filters" id="filters">
      <Demo title="Filter Panel">
        <FilterPanel
          groups={filters.filters.groups}
          onAddGroup={() => {
            filters.addGroup({ logic: "AND", conditions: [] });
          }}
          onRemoveGroup={filters.removeGroup}
          onUpdateGroup={filters.updateGroup}
          onAddCondition={(groupIndex) => {
            filters.addCondition(groupIndex, {
              field: "",
              operator: "equals",
              value: "",
            });
          }}
          onRemoveCondition={filters.removeCondition}
          onUpdateCondition={filters.updateCondition}
          onClear={filters.clearAll}
          fields={fields}
        />
      </Demo>
    </Section>
  );
}

/* ============================================================
 * Pagination Demo
 * ============================================================ */

function PaginationDemo() {
  const pagination = usePagination({
    initialPage: 1,
    initialPageSize: 25,
    total: 248,
  });

  return (
    <Section title="Pagination" id="pagination">
      <Demo title="Full Pagination">
        <Pagination {...pagination} />
      </Demo>

      <Demo title="Simple Pagination">
        <SimplePagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={pagination.goToPage}
        />
      </Demo>
    </Section>
  );
}

/* ============================================================
 * Bulk Actions Demo
 * ============================================================ */

function BulkActionsDemo() {
  const selection = useSelection({ mode: "multiple" });

  const mockItems = [
    { id: "1", name: "Item 1" },
    { id: "2", name: "Item 2" },
    { id: "3", name: "Item 3" },
  ];

  React.useEffect(() => {
    selection.selectAll(mockItems.map((i) => i.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const actions: BulkAction[] = [
    {
      id: "export",
      label: "Xuất",
      icon: <Download className="w-4 h-4" />,
      handler: async () => alert("Export"),
    },
    {
      id: "archive",
      label: "Lưu trữ",
      icon: <Archive className="w-4 h-4" />,
      handler: async () => alert("Archive"),
    },
    {
      id: "delete",
      label: "Xóa",
      icon: <Trash2 className="w-4 h-4" />,
      handler: async () => alert("Delete"),
      isDestructive: true,
    },
  ];

  return (
    <Section title="Bulk Actions" id="bulk-actions">
      <Demo title="Bulk Actions Bar">
        <BulkActions
          selectedCount={selection.selectedCount}
          totalCount={mockItems.length}
          actions={actions}
          selectedItems={mockItems.filter(item => selection.selectedIds.has(item.id))}
          onDeselectAll={selection.deselectAll}
          onSelectAll={() => selection.selectAll(mockItems.map((i) => i.id))}
        />
      </Demo>
    </Section>
  );
}

/* ============================================================
 * View Mode Demo
 * ============================================================ */

function ViewModeDemo() {
  const viewMode = useViewMode({
    initialMode: "table",
  });

  return (
    <Section title="View Modes" id="view-modes">
      <Demo title="View Mode Selector">
        <ViewModeSelector
          mode={viewMode.mode}
          onModeChange={viewMode.setMode}
          density={viewMode.density}
          onDensityChange={viewMode.setDensity}
          showImages={viewMode.showImages}
          onToggleImages={viewMode.toggleImages}
          showSettings
        />
      </Demo>

      <Demo title="Current Mode">
        <div className="text-center py-8">
          <p className="text-lg">
            Current mode: <strong>{viewMode.mode}</strong>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            Density: {viewMode.density}
          </p>
        </div>
      </Demo>
    </Section>
  );
}

/* ============================================================
 * Badges Demo
 * ============================================================ */

function BadgesDemo() {
  return (
    <Section title="Status Badges" id="badges">
      <Demo title="Generic Badges">
        <div className="flex flex-wrap gap-2">
          <StatusBadge status="Default" variant="default" />
          <StatusBadge status="Success" variant="success" />
          <StatusBadge status="Error" variant="error" />
          <StatusBadge status="Warning" variant="warning" />
          <StatusBadge status="Info" variant="info" />
          <StatusBadge status="Primary" variant="primary" />
        </div>
      </Demo>

      <Demo title="Lead Status">
        <div className="flex flex-wrap gap-2">
          <LeadStatusBadge status="new" />
          <LeadStatusBadge status="contacted" />
          <LeadStatusBadge status="qualified" />
          <LeadStatusBadge status="unqualified" />
          <LeadStatusBadge status="lost" />
        </div>
      </Demo>

      <Demo title="Deal Status">
        <div className="flex flex-wrap gap-2">
          <DealStatusBadge status="draft" />
          <DealStatusBadge status="open" />
          <DealStatusBadge status="won" />
          <DealStatusBadge status="lost" />
        </div>
      </Demo>

      <Demo title="Priority">
        <div className="flex flex-wrap gap-2">
          <PriorityBadge priority="low" />
          <PriorityBadge priority="medium" />
          <PriorityBadge priority="high" />
          <PriorityBadge priority="urgent" />
        </div>
      </Demo>

      <Demo title="Score">
        <div className="flex flex-wrap gap-2">
          <ScoreBadge score={25} />
          <ScoreBadge score={50} />
          <ScoreBadge score={75} />
          <ScoreBadge score={95} />
        </div>
      </Demo>
    </Section>
  );
}

/* ============================================================
 * Columns Demo
 * ============================================================ */

function ColumnsDemo() {
  const columns = useColumnVisibility({
    initialColumns: [
      createColumnDefinition("name", "Name", "name", { order: 0 }),
      createColumnDefinition("email", "Email", "email", { order: 1 }),
      createColumnDefinition("phone", "Phone", "phone", { order: 2 }),
      createColumnDefinition("company", "Company", "company", { order: 3 }),
      createColumnDefinition("status", "Status", "status", { order: 4 }),
    ],
  });

  return (
    <Section title="Column Visibility" id="columns">
      <Demo title="Column Visibility Panel">
        <ColumnVisibilityPanel
          columns={Object.values(columns.columns).sort((a, b) => a.order - b.order)}
          onToggleColumn={columns.toggleColumn}
          onShowAll={columns.showAllColumns}
          onHideAll={columns.hideAllColumns}
          onReset={columns.resetColumns}
          onMove={columns.moveColumn}
          onPin={columns.pinColumn}
        />
      </Demo>

      <Demo title="Simple Column Toggle">
        <SimpleColumnToggle
          columns={Object.values(columns.columns)}
          onToggleColumn={columns.toggleColumn}
        />
      </Demo>
    </Section>
  );
}