# 🎨 UI State Hooks Documentation

> **Version:** 1.0  
> **Last Updated:** 2026-03-17  
> **Purpose:** Comprehensive UI state management for CRM

---

## 🎯 Overview

Complete UI state management layer với:
- ✅ **Selection** - Single/multiple select với keyboard support
- ✅ **Filters** - Advanced filtering với groups và operators
- ✅ **Sort** - Multi-column sorting
- ✅ **Search** - Full-text search với debounce
- ✅ **Pagination** - Client/server pagination
- ✅ **View Mode** - Table/List/Grid/Kanban switching
- ✅ **Column Visibility** - Show/hide/reorder columns
- ✅ **Modal & Dialog** - Modal và dialog management
- ✅ **Combined State** - All-in-one table state hook

---

## 📁 Structure

```
/src/app/
├── hooks/ui/
│   ├── useSelection.ts          # Multi-select hook
│   ├── useFilters.ts            # Advanced filters
│   ├── useSort.ts               # Multi-column sort
│   ├── useSearch.ts             # Search with debounce
│   ├── usePagination.ts         # Pagination hook
│   ├── useViewMode.ts           # View mode switching
│   ├── useColumnVisibility.ts   # Column management
│   ├── useModal.ts              # Modal state
│   ├── useDialog.ts             # Dialog prompts
│   ├── useTableState.ts         # Combined table state
│   └── index.ts                 # Central export
└── types/
    └── ui-state.ts              # UI state types
```

---

## 🔘 useSelection

Multi-select with keyboard shortcuts (Shift, Ctrl/Cmd).

### Basic Usage

```typescript
import { useSelection } from "@/hooks/ui";

function ContactsTable({ contacts }: { contacts: Contact[] }) {
  const selection = useSelection<string>({
    mode: "multiple",
    onSelectionChange: (selectedIds) => {
      console.log("Selected:", selectedIds);
    },
  });

  return (
    <div>
      <button onClick={() => selection.selectAll(contacts.map(c => c.id))}>
        Select All
      </button>
      <button onClick={() => selection.deselectAll()}>
        Deselect All
      </button>
      
      {contacts.map((contact) => (
        <div
          key={contact.id}
          onClick={() => selection.toggle(contact.id)}
          className={selection.isSelected(contact.id) ? "selected" : ""}
        >
          <input
            type="checkbox"
            checked={selection.isSelected(contact.id)}
            onChange={() => selection.toggle(contact.id)}
          />
          {contact.name}
        </div>
      ))}
      
      <div>
        Selected: {selection.selectedCount} / {contacts.length}
      </div>
    </div>
  );
}
```

### Keyboard Support

```typescript
// Shift + Click for range selection
function handleRowClick(id: string, event: React.MouseEvent) {
  if (event.shiftKey && selection.lastSelectedId) {
    selection.selectRange(
      selection.lastSelectedId,
      id,
      contacts.map(c => c.id)
    );
  } else if (event.ctrlKey || event.metaKey) {
    selection.toggle(id);
  } else {
    selection.select(id);
  }
}
```

### API Reference

```typescript
interface UseSelectionReturn<T = string> {
  // State
  mode: SelectionMode; // "none" | "single" | "multiple"
  selectedIds: Set<T>;
  lastSelectedId: T | null;
  isAllSelected: boolean;
  selectedCount: number;
  hasSelection: boolean;

  // Actions
  select: (id: T) => void;
  deselect: (id: T) => void;
  toggle: (id: T) => void;
  selectAll: (ids: T[]) => void;
  deselectAll: () => void;
  selectRange: (fromId: T, toId: T, allIds: T[]) => void;

  // Helpers
  isSelected: (id: T) => boolean;
}
```

---

## 🔍 useFilters

Advanced filtering with multiple conditions and groups.

### Basic Usage

```typescript
import { useFilters, applyFilters } from "@/hooks/ui";

function ContactsPage() {
  const filters = useFilters({
    onFiltersChange: (filters) => {
      console.log("Filters updated:", filters);
    },
  });

  // Apply filters to data
  const filteredContacts = useMemo(() => {
    return applyFilters(contacts, filters.filters);
  }, [contacts, filters.filters]);

  return (
    <div>
      {/* Quick Filters */}
      <select
        onChange={(e) => filters.setQuickFilter("contactType", e.target.value)}
      >
        <option value="">All Types</option>
        <option value="customer">Customers</option>
        <option value="partner">Partners</option>
      </select>

      {/* Advanced Filters */}
      <button
        onClick={() => {
          filters.addGroup({
            logic: "AND",
            conditions: [
              { field: "status", operator: "equals", value: "active" },
              { field: "leadScore", operator: "greater_than", value: 70 },
            ],
          });
        }}
      >
        Add Filter Group
      </button>

      <div>
        Active Filters: {filters.filterCount}
        {filters.hasFilters && (
          <button onClick={filters.clearAll}>Clear All</button>
        )}
      </div>
    </div>
  );
}
```

### Filter Operators

```typescript
type FilterOperator =
  | "equals"              // value === filterValue
  | "not_equals"          // value !== filterValue
  | "contains"            // value.includes(filterValue)
  | "not_contains"        // !value.includes(filterValue)
  | "starts_with"         // value.startsWith(filterValue)
  | "ends_with"           // value.endsWith(filterValue)
  | "greater_than"        // value > filterValue
  | "greater_than_or_equal" // value >= filterValue
  | "less_than"           // value < filterValue
  | "less_than_or_equal"  // value <= filterValue
  | "in"                  // filterValue.includes(value)
  | "not_in"              // !filterValue.includes(value)
  | "is_empty"            // value is null/undefined/""
  | "is_not_empty"        // value is not null/undefined/""
  | "between"             // value >= min && value <= max
  | "not_between";        // !(value >= min && value <= max)
```

### Presets

```typescript
// Apply preset filters
const presets = {
  highValueCustomers: [
    { field: "contactType", operator: "equals", value: "customer" },
    { field: "lifetimeValue", operator: "greater_than", value: 100000000 },
  ],
  hotLeads: [
    { field: "leadScore", operator: "greater_than_or_equal", value: 80 },
    { field: "status", operator: "equals", value: "active" },
  ],
};

filters.applyPreset(presets.highValueCustomers);
```

---

## 📊 useSort

Multi-column sorting with stable sort.

### Basic Usage

```typescript
import { useSort, applySort } from "@/hooks/ui";

function ContactsTable() {
  const sort = useSort({
    multiSort: true,
    onSortChange: (sortFields) => {
      console.log("Sort changed:", sortFields);
    },
  });

  const sortedData = useMemo(() => {
    return applySort(contacts, sort.sortFields);
  }, [contacts, sort.sortFields]);

  return (
    <table>
      <thead>
        <tr>
          <th onClick={() => sort.toggleSortField("firstName")}>
            First Name
            {sort.isSorted("firstName") && (
              <span>{sort.getSortDirection("firstName") === "asc" ? "↑" : "↓"}</span>
            )}
            {sort.getSortIndex("firstName") >= 0 && (
              <span>{sort.getSortIndex("firstName") + 1}</span>
            )}
          </th>
          <th onClick={() => sort.toggleSortField("leadScore")}>
            Lead Score
            {sort.isSorted("leadScore") && (
              <span>{sort.getSortDirection("leadScore") === "asc" ? "↑" : "↓"}</span>
            )}
          </th>
        </tr>
      </thead>
      <tbody>
        {sortedData.map((contact) => (
          <tr key={contact.id}>
            <td>{contact.firstName}</td>
            <td>{contact.leadScore}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Multi-Column Sort

```typescript
// Ctrl/Cmd + Click to add sort column
function handleHeaderClick(field: string, event: React.MouseEvent) {
  if (event.ctrlKey || event.metaKey) {
    sort.addSortField(field);
  } else {
    sort.setSortField(field);
  }
}
```

---

## 🔎 useSearch

Full-text search with debounce and highlighting.

### Basic Usage

```typescript
import { useSearch, applySearch, highlightMatches } from "@/hooks/ui";

function ContactsSearch() {
  const search = useSearch({
    searchFields: ["firstName", "lastName", "email", "company"],
    debounceMs: 300,
    onSearchChange: (query) => {
      console.log("Search:", query);
    },
  });

  const searchedData = useMemo(() => {
    return applySearch(contacts, search.search);
  }, [contacts, search.search]);

  return (
    <div>
      <input
        type="text"
        value={search.query}
        onChange={(e) => search.setQuery(e.target.value)}
        placeholder="Search contacts..."
      />
      
      {search.isSearching && <span>Searching...</span>}
      
      {search.hasQuery && (
        <button onClick={search.clearSearch}>Clear</button>
      )}

      <div>
        {searchedData.length} results
      </div>
    </div>
  );
}
```

### Highlight Matches

```typescript
function HighlightedText({ text, query }: { text: string; query: string }) {
  const parts = highlightMatches(text, query);

  return (
    <span>
      {parts.map((part, index) => (
        <span
          key={index}
          className={part.isMatch ? "bg-yellow-200" : ""}
        >
          {part.text}
        </span>
      ))}
    </span>
  );
}
```

---

## 📄 usePagination

Client-side and server-side pagination.

### Client Pagination

```typescript
import { usePagination, paginateData } from "@/hooks/ui";

function ContactsList() {
  const pagination = usePagination({
    initialPage: 1,
    initialPageSize: 25,
    total: contacts.length,
  });

  const paginatedContacts = useMemo(() => {
    return paginateData(contacts, pagination.page, pagination.pageSize);
  }, [contacts, pagination.page, pagination.pageSize]);

  return (
    <div>
      {paginatedContacts.map((contact) => (
        <div key={contact.id}>{contact.name}</div>
      ))}

      <div className="pagination">
        <button
          onClick={pagination.firstPage}
          disabled={!pagination.hasPreviousPage}
        >
          First
        </button>
        <button
          onClick={pagination.previousPage}
          disabled={!pagination.hasPreviousPage}
        >
          Previous
        </button>
        
        <span>
          Page {pagination.page} of {pagination.totalPages}
        </span>
        
        <button
          onClick={pagination.nextPage}
          disabled={!pagination.hasNextPage}
        >
          Next
        </button>
        <button
          onClick={pagination.lastPage}
          disabled={!pagination.hasNextPage}
        >
          Last
        </button>

        <select
          value={pagination.pageSize}
          onChange={(e) => pagination.setPageSize(Number(e.target.value))}
        >
          {pagination.pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
```

### Server Pagination

```typescript
import { useServerPagination } from "@/hooks/ui";

function ContactsServerPaginated() {
  const { data, pagination, isLoading, reload } = useServerPagination({
    initialPage: 1,
    initialPageSize: 25,
    fetchData: async (page, pageSize) => {
      const response = await fetch(
        `/api/contacts?page=${page}&pageSize=${pageSize}`
      );
      const result = await response.json();
      return {
        data: result.contacts,
        total: result.total,
      };
    },
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {data.map((contact) => (
        <div key={contact.id}>{contact.name}</div>
      ))}
      {/* Use pagination controls */}
    </div>
  );
}
```

---

## 🎨 useViewMode

Switch between table/list/grid/kanban views.

### Basic Usage

```typescript
import { useViewMode } from "@/hooks/ui";

function ContactsView() {
  const viewMode = useViewMode({
    initialMode: "table",
  });

  return (
    <div>
      <div className="view-controls">
        <button onClick={() => viewMode.setMode("table")}>Table</button>
        <button onClick={() => viewMode.setMode("list")}>List</button>
        <button onClick={() => viewMode.setMode("grid")}>Grid</button>
        <button onClick={() => viewMode.setMode("kanban")}>Kanban</button>

        <select
          value={viewMode.density}
          onChange={(e) => viewMode.setDensity(e.target.value as any)}
        >
          <option value="compact">Compact</option>
          <option value="comfortable">Comfortable</option>
          <option value="spacious">Spacious</option>
        </select>

        <button onClick={viewMode.toggleImages}>
          {viewMode.showImages ? "Hide" : "Show"} Images
        </button>
      </div>

      {viewMode.isTableView && <ContactsTable />}
      {viewMode.isListView && <ContactsList />}
      {viewMode.isGridView && <ContactsGrid />}
      {viewMode.isKanbanView && <ContactsKanban />}
    </div>
  );
}
```

---

## 👁️ useColumnVisibility

Show/hide/reorder table columns.

### Basic Usage

```typescript
import { useColumnVisibility, createColumnDefinition } from "@/hooks/ui";

function ContactsTable() {
  const columns = useColumnVisibility({
    initialColumns: [
      createColumnDefinition("name", "Name", "name", { order: 0, pinned: "left" }),
      createColumnDefinition("email", "Email", "email", { order: 1 }),
      createColumnDefinition("phone", "Phone", "phone", { order: 2 }),
      createColumnDefinition("company", "Company", "company", { order: 3 }),
      createColumnDefinition("leadScore", "Score", "leadScore", { order: 4 }),
    ],
  });

  return (
    <div>
      {/* Column visibility dropdown */}
      <div>
        {Object.values(columns.columns).map((col) => (
          <label key={col.id}>
            <input
              type="checkbox"
              checked={col.visible}
              onChange={() => columns.toggleColumn(col.id)}
            />
            {col.label}
          </label>
        ))}
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            {columns.visibleColumns.map((col) => (
              <th key={col.id}>
                {col.label}
                <button onClick={() => columns.moveColumn(col.id, "left")}>←</button>
                <button onClick={() => columns.moveColumn(col.id, "right")}>→</button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id}>
              {columns.visibleColumns.map((col) => (
                <td key={col.id}>{contact[col.field]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
```

---

## 🪟 useModal & useDialog

Modal and dialog management.

### Modal Usage

```typescript
import { useModal } from "@/hooks/ui";

function ContactsPage() {
  const createModal = useModal<Contact>();
  const editModal = useModal<Contact>();

  return (
    <div>
      <button onClick={() => createModal.open("create")}>
        Create Contact
      </button>

      {contacts.map((contact) => (
        <div key={contact.id}>
          {contact.name}
          <button onClick={() => editModal.open("edit", contact)}>
            Edit
          </button>
        </div>
      ))}

      {createModal.isOpen && (
        <ContactFormModal
          mode="create"
          onClose={createModal.close}
        />
      )}

      {editModal.isOpen && editModal.data && (
        <ContactFormModal
          mode="edit"
          contact={editModal.data}
          onClose={editModal.close}
        />
      )}
    </div>
  );
}
```

### Dialog Usage

```typescript
import { useDialog, useDeleteConfirmation } from "@/hooks/ui";

function ContactActions({ contact }: { contact: Contact }) {
  const dialog = useDialog();

  const handleDelete = useDeleteConfirmation(async () => {
    await deleteContact(contact.id);
  });

  return (
    <div>
      <button onClick={() => handleDelete(contact.name)}>
        Delete
      </button>

      <button
        onClick={async () => {
          const confirmed = await dialog.confirm({
            title: "Archive Contact",
            message: "Are you sure you want to archive this contact?",
            confirmLabel: "Archive",
            cancelLabel: "Cancel",
          });

          if (confirmed) {
            // Archive contact
          }
        }}
      >
        Archive
      </button>
    </div>
  );
}
```

---

## 🎯 useTableState (Combined)

All-in-one table state management.

### Basic Usage

```typescript
import { useTableState } from "@/hooks/ui";

function ContactsTable({ contacts }: { contacts: Contact[] }) {
  const table = useTableState({
    data: contacts,
    selection: { mode: "multiple" },
    search: { searchFields: ["firstName", "lastName", "email"] },
    sort: { multiSort: true },
    pagination: { initialPageSize: 25 },
  });

  return (
    <div>
      {/* Search */}
      <input
        type="text"
        value={table.search.query}
        onChange={(e) => table.search.setQuery(e.target.value)}
        placeholder="Search..."
      />

      {/* Stats */}
      <div>
        Showing {table.pagination.pageRange.start}-{table.pagination.pageRange.end}{" "}
        of {table.filteredCount} items
        {table.selectedCount > 0 && ` (${table.selectedCount} selected)`}
      </div>

      {/* Table */}
      <table>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={table.selection.isAllSelected}
                onChange={() =>
                  table.selection.isAllSelected
                    ? table.selection.deselectAll()
                    : table.selection.selectAll(contacts.map((c) => c.id))
                }
              />
            </th>
            <th onClick={() => table.sort.toggleSortField("firstName")}>
              Name {table.sort.getSortDirection("firstName")}
            </th>
            <th onClick={() => table.sort.toggleSortField("leadScore")}>
              Score {table.sort.getSortDirection("leadScore")}
            </th>
          </tr>
        </thead>
        <tbody>
          {table.processedData.map((contact) => (
            <tr key={contact.id}>
              <td>
                <input
                  type="checkbox"
                  checked={table.selection.isSelected(contact.id)}
                  onChange={() => table.selection.toggle(contact.id)}
                />
              </td>
              <td>{contact.firstName} {contact.lastName}</td>
              <td>{contact.leadScore}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div>
        <button onClick={table.pagination.previousPage}>Previous</button>
        <span>Page {table.pagination.page}</span>
        <button onClick={table.pagination.nextPage}>Next</button>
      </div>

      {/* Reset */}
      <button onClick={table.resetAll}>Reset All</button>
    </div>
  );
}
```

### Simplified Hook

```typescript
import { useSimpleTable } from "@/hooks/ui";

function QuickContactsTable({ contacts }: { contacts: Contact[] }) {
  const table = useSimpleTable({
    data: contacts,
    searchFields: ["firstName", "lastName", "email"],
    defaultPageSize: 25,
  });

  // All features enabled with sensible defaults
  return <div>{/* Use table.* */}</div>;
}
```

---

## 💡 Best Practices

1. **Combine hooks** - Use `useTableState` for complex tables
2. **Memoize data** - Always use `useMemo` for filtered/sorted data
3. **Debounce search** - Default 300ms is good for most cases
4. **Server pagination** - Use for large datasets (>1000 items)
5. **Keyboard support** - Implement Shift+Click for range selection
6. **Persist state** - Save to localStorage/URL params
7. **Loading states** - Show loading indicators during async operations
8. **Empty states** - Show helpful messages when no data
9. **Accessibility** - Use proper ARIA attributes
10. **Mobile friendly** - Test on mobile devices

---

**Maintained by:** AI Development Team  
**Last Review:** 2026-03-17  
**Next Review:** Phase 2-D kickoff
