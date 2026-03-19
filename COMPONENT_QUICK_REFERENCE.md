# 🚀 COMPONENT QUICK REFERENCE

## Import Pattern
```typescript
import {
  // Import any component you need
  EmptyState,
  LoadingState,
  SearchBar,
  DataTable,
  ListView,
  GridView,
  KanbanView,
  // ... etc
} from "@/components/crm";
```

---

## 📦 COMPONENT CATEGORIES

### 1. EMPTY & LOADING STATES

#### EmptyState
```typescript
<EmptyState
  title="No contacts found"
  description="Get started by adding your first contact"
  action={{ label: "Add Contact", onClick: handleAdd }}
/>

// Presets
<EmptyContacts onAction={handleAdd} />
<EmptyDeals onAction={handleAdd} />
<EmptyLeads onAction={handleAdd} />
<EmptySearchResults query="test" onClear={handleClear} />
<EmptyFilterResults onClear={handleClear} />
<ErrorState onRetry={handleRetry} />
```

#### LoadingState
```typescript
<LoadingState type="spinner" message="Loading..." />
<LoadingState type="dots" size="lg" />
<LoadingState type="bars" />

// Skeletons
<SkeletonTable rows={5} columns={4} />
<SkeletonCard />
<SkeletonGrid items={6} />
<SkeletonList items={5} />
<SkeletonForm fields={5} />

// Presets
<TableLoadingState />
<GridLoadingState />
<ListLoadingState />
<FullPageLoading message="Loading..." />
<InlineLoading message="Saving..." />
<ButtonLoading />
```

---

### 2. SEARCH & FILTER

#### SearchBar
```typescript
const search = useSearch({ 
  searchFields: ["name", "email"],
  debounceMs: 300 
});

<SearchBar
  value={search.query}
  onChange={search.setQuery}
  onClear={search.clearSearch}
  isSearching={search.isSearching}
  resultCount={42}
  showFilters
  onToggleFilters={() => {}}
/>

// Advanced
<AdvancedSearchBar
  {...search}
  suggestions={["John", "Jane"]}
  recentSearches={["test", "demo"]}
  onSuggestionClick={handleSuggestion}
/>

// With Scope
<SearchBarWithScope
  {...search}
  scopes={[
    { value: "all", label: "All" },
    { value: "contacts", label: "Contacts" }
  ]}
  currentScope="all"
  onScopeChange={setScope}
/>
```

#### FilterPanel
```typescript
const filters = useFilters();

<FilterPanel
  groups={filters.filters.groups}
  onAddGroup={() => filters.addGroup({ logic: "AND", conditions: [] })}
  onRemoveGroup={filters.removeGroup}
  onUpdateGroup={filters.updateGroup}
  onAddCondition={(idx) => filters.addCondition(idx, {...})}
  onRemoveCondition={filters.removeCondition}
  onUpdateCondition={filters.updateCondition}
  onClear={filters.clearAll}
  fields={[
    { value: "name", label: "Name" },
    { value: "email", label: "Email" },
  ]}
  presets={[
    { id: "active", label: "Active", filter: {...} }
  ]}
/>

// Simple
<SimpleFilterBar
  filters={filters}
  onFilterChange={(key, value) => {}}
  onClear={() => {}}
  fields={[
    { key: "status", label: "Status", type: "select", options: [...] }
  ]}
/>
```

---

### 3. PAGINATION

#### Pagination
```typescript
const pagination = usePagination({
  initialPage: 1,
  initialPageSize: 25,
  total: 248
});

<Pagination
  page={pagination.page}
  pageSize={pagination.pageSize}
  total={pagination.total}
  totalPages={pagination.totalPages}
  onPageChange={pagination.goToPage}
  onPageSizeChange={pagination.setPageSize}
  pageSizeOptions={[10, 25, 50, 100]}
  showPageSize
  showSummary
  showFirstLast
/>

// Simple
<SimplePagination
  page={1}
  totalPages={10}
  onPageChange={goToPage}
/>

// Compact (mobile)
<CompactPagination
  page={1}
  pageSize={25}
  total={248}
  totalPages={10}
  onPageChange={goToPage}
/>

// Infinite Scroll
<InfiniteScrollIndicator
  hasMore={true}
  isLoading={false}
  onLoadMore={loadMore}
/>
```

---

### 4. BULK ACTIONS

#### BulkActions
```typescript
const selection = useSelection({ mode: "multiple" });

const actions: BulkAction[] = [
  {
    id: "export",
    label: "Export",
    icon: <Download className="w-4 h-4" />,
    handler: async (ids) => { /* export logic */ }
  },
  {
    id: "delete",
    label: "Delete",
    icon: <Trash2 className="w-4 h-4" />,
    handler: async (ids) => { /* delete logic */ },
    isDestructive: true
  }
];

<BulkActions
  selectedCount={selection.selectedCount}
  totalCount={items.length}
  actions={actions}
  selectedItems={selection.selectedItems}
  onDeselectAll={selection.deselectAll}
  onSelectAll={() => selection.selectAll(items.map(i => i.id))}
/>

// Compact
<CompactBulkActions
  selectedCount={3}
  actions={actions}
  selectedItems={items}
  onDeselectAll={deselectAll}
/>

// Dropdown
<BulkActionsDropdown
  selectedCount={3}
  actions={actions}
  selectedItems={items}
/>
```

---

### 5. VIEW MODE

#### ViewModeSelector
```typescript
const viewMode = useViewMode({ initialMode: "table" });

<ViewModeSelector
  mode={viewMode.mode}
  onModeChange={viewMode.setMode}
  availableModes={["table", "list", "grid", "kanban"]}
  density={viewMode.density}
  onDensityChange={viewMode.setDensity}
  showImages={viewMode.showImages}
  onToggleImages={viewMode.toggleImages}
  showSettings
/>

// Simple
<SimpleViewModeSelector
  mode="table"
  onModeChange={setMode}
  modes={["table", "list"]}
/>

// Compact Toggle
<CompactViewModeToggle
  mode="table"
  onModeChange={setMode}
/>
```

---

### 6. STATUS BADGES

#### StatusBadge
```typescript
<StatusBadge status="Active" variant="success" size="md" />
<StatusBadge status="Custom" variant="primary" icon={Star} />
<StatusBadge status="With Dot" variant="info" dot />

// Presets
<ActiveBadge />
<InactiveBadge />
<PendingBadge />
<CancelledBadge />
<CompletedBadge />

// Domain-specific
<LeadStatusBadge status="new" />
<LeadStatusBadge status="qualified" />

<DealStatusBadge status="open" />
<DealStatusBadge status="won" />

<PriorityBadge priority="high" />
<PriorityBadge priority="urgent" />

<ContactTypeBadge type="customer" />
<ContactTypeBadge type="partner" />

<ScoreBadge score={75} max={100} />
<CountBadge count={5} label="items" />
```

---

### 7. COLUMN VISIBILITY

#### ColumnVisibilityPanel
```typescript
const columns = useColumnVisibility({
  initialColumns: [
    createColumnDefinition("name", "Name", "name", { order: 0 }),
    createColumnDefinition("email", "Email", "email", { order: 1 }),
  ]
});

<ColumnVisibilityPanel
  columns={Object.values(columns.columns)}
  onToggleColumn={columns.toggleColumn}
  onShowAll={columns.showAllColumns}
  onHideAll={columns.hideAllColumns}
  onReset={columns.resetColumns}
  onMove={columns.moveColumn}
  onPin={columns.pinColumn}
/>

// Simple
<SimpleColumnToggle
  columns={Object.values(columns.columns)}
  onToggleColumn={columns.toggleColumn}
/>

// Grouped
<ColumnGroupToggle
  groups={[
    { id: "basic", label: "Basic Info", columnIds: ["name", "email"] },
    { id: "details", label: "Details", columnIds: ["phone", "company"] }
  ]}
  columns={columns.columns}
  onToggleGroup={(ids, visible) => {}}
/>
```

---

### 8. DATA TABLE

#### DataTable
```typescript
<DataTable
  data={contacts}
  columns={[
    { key: "name", header: "Name", sortable: true },
    { key: "email", header: "Email", editable: true },
    { key: "phone", header: "Phone" },
    { 
      key: "status", 
      header: "Status",
      render: (item) => <StatusBadge status={item.status} />
    }
  ]}
  storageKey="contacts-table"
  selectable
  onInlineEdit={(id, field, value) => handleEdit(id, field, value)}
  onRowClick={(item) => navigate(`/contacts/${item.id}`)}
  onBulkDelete={(ids) => handleDelete(ids)}
  renderRowActions={(item) => (
    <>
      <Button onClick={() => edit(item)}>Edit</Button>
      <Button onClick={() => delete(item)}>Delete</Button>
    </>
  )}
  defaultSortField="name"
  emptyMessage="No contacts found"
  showToolbar
/>
```

---

### 9. LIST VIEW

#### ListView
```typescript
<ListView
  items={contacts}
  renderImage={(contact) => (
    <img src={contact.avatar} className="w-10 h-10 rounded-full" />
  )}
  renderTitle={(contact) => contact.name}
  renderSubtitle={(contact) => contact.email}
  renderMeta={(contact) => (
    <>
      <span>{contact.phone}</span>
      <span>{contact.company}</span>
    </>
  )}
  renderActions={(contact) => (
    <Button onClick={() => edit(contact)}>Edit</Button>
  )}
  columns={[
    { 
      id: "score", 
      label: "Score",
      render: (c) => <ScoreBadge score={c.score} />
    }
  ]}
  onItemClick={(item) => navigate(`/contacts/${item.id}`)}
  selectable
  selectedIds={selectedIds}
  onToggleSelect={toggleSelect}
  density="comfortable"
  showDividers
/>

// Compact
<CompactListView
  items={contacts}
  renderTitle={(c) => c.name}
  renderSubtitle={(c) => c.email}
  renderIcon={(c) => <User className="w-4 h-4" />}
  onItemClick={handleClick}
/>

// Simple (for sidebars)
<SimpleListView
  items={[
    { id: "1", label: "Item 1", icon: <Star />, badge: 5 },
    { id: "2", label: "Item 2", active: true }
  ]}
  onItemClick={handleClick}
/>

// Grouped
<GroupedListView
  groups={[
    { id: "active", label: "Active", items: activeContacts },
    { id: "inactive", label: "Inactive", items: inactiveContacts }
  ]}
  renderItem={(contact) => <div>{contact.name}</div>}
  onItemClick={handleClick}
/>
```

---

### 10. GRID VIEW

#### GridView
```typescript
<GridView
  items={contacts}
  renderCard={(contact) => (
    <Card>
      <CardImage src={contact.avatar} alt={contact.name} />
      <CardHeader 
        title={contact.name}
        subtitle={contact.company}
        badge={<ScoreBadge score={contact.score} />}
      />
      <CardContent>
        <p>{contact.email}</p>
        <p>{contact.phone}</p>
      </CardContent>
      <CardFooter>
        <Button>Edit</Button>
        <Button>Delete</Button>
      </CardFooter>
    </Card>
  )}
  onItemClick={(item) => navigate(`/contacts/${item.id}`)}
  selectable
  selectedIds={selectedIds}
  onToggleSelect={toggleSelect}
  columns={3}
  gap={4}
/>

// Preset Card
<GridView
  items={contacts}
  renderCard={(contact) => (
    <ContactCard
      name={contact.name}
      email={contact.email}
      phone={contact.phone}
      company={contact.company}
      avatar={contact.avatar}
      tags={contact.tags}
      score={contact.score}
      onEdit={() => edit(contact)}
      onDelete={() => delete(contact)}
    />
  )}
  columns={3}
/>

// Masonry (Pinterest-style)
<MasonryGridView
  items={posts}
  renderCard={(post) => <PostCard {...post} />}
  onItemClick={handleClick}
  columns={3}
  gap={4}
/>
```

---

### 11. KANBAN VIEW

#### KanbanView
```typescript
const columns: KanbanColumn<Deal>[] = [
  { 
    id: "new", 
    title: "New Leads", 
    color: "#3b82f6",
    items: newDeals,
    maxItems: 10
  },
  { 
    id: "qualified", 
    title: "Qualified", 
    color: "#10b981",
    items: qualifiedDeals 
  },
  { 
    id: "proposal", 
    title: "Proposal", 
    color: "#f59e0b",
    items: proposalDeals 
  },
  { 
    id: "won", 
    title: "Won", 
    color: "#22c55e",
    items: wonDeals 
  }
];

<KanbanView
  columns={columns}
  renderCard={(deal, columnId) => (
    <KanbanCard>
      <KanbanCardHeader 
        title={deal.title}
        subtitle={deal.company}
        badge={<PriorityBadge priority={deal.priority} />}
      />
      <KanbanCardContent>
        <div className="text-lg font-semibold">
          {deal.value.toLocaleString()}đ
        </div>
      </KanbanCardContent>
      <KanbanCardFooter>
        <span>{deal.owner}</span>
        <span>{deal.dueDate}</span>
      </KanbanCardFooter>
    </KanbanCard>
  )}
  onCardClick={(deal) => navigate(`/deals/${deal.id}`)}
  onCardMove={(id, from, to) => handleMove(id, from, to)}
  onAddCard={(columnId) => handleAdd(columnId)}
  onColumnAction={(id, action) => handleColumnAction(id, action)}
  cardHeight="auto"
  showColumnCount
  showColumnTotal
  getColumnTotal={(items) => items.reduce((sum, i) => sum + i.value, 0)}
/>

// Preset Card
<KanbanView
  columns={columns}
  renderCard={(deal) => (
    <DealCard
      title={deal.title}
      company={deal.company}
      value={deal.value}
      owner={deal.owner}
      avatar={deal.ownerAvatar}
      dueDate={deal.dueDate}
      priority={deal.priority}
      tags={deal.tags}
    />
  )}
  onCardMove={handleMove}
/>

// Simple (no drag-drop)
<SimpleKanbanView
  columns={columns}
  renderCard={(deal) => <DealCard {...deal} />}
  onCardClick={handleClick}
/>
```

---

## 🎯 COMMON PATTERNS

### Full Page with All Features
```typescript
function ContactsPage() {
  // Hooks
  const search = useSearch({ searchFields: ["name", "email"] });
  const filters = useFilters();
  const pagination = usePagination({ total: contacts.length });
  const selection = useSelection({ mode: "multiple" });
  const viewMode = useViewMode({ initialMode: "table" });
  const columns = useColumnVisibility({ initialColumns });

  // Filtered & paginated data
  const filteredData = applyFilters(contacts, search, filters);
  const paginatedData = paginate(filteredData, pagination);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between">
        <h1>Contacts</h1>
        <Button onClick={handleAdd}>Add Contact</Button>
      </div>

      {/* Search & Filters */}
      <div className="flex gap-2">
        <SearchBar {...search} />
        <ViewModeSelector {...viewMode} />
        <SimpleColumnToggle {...columns} />
      </div>

      <FilterPanel {...filters} fields={filterFields} />

      {/* Bulk Actions */}
      {selection.selectedCount > 0 && (
        <BulkActions {...selection} actions={bulkActions} />
      )}

      {/* View */}
      {viewMode.mode === "table" && (
        <DataTable
          data={paginatedData}
          columns={columns.visibleColumns}
          selectable
          {...selection}
        />
      )}

      {viewMode.mode === "list" && (
        <ListView
          items={paginatedData}
          renderTitle={(c) => c.name}
          renderSubtitle={(c) => c.email}
          selectable
          {...selection}
        />
      )}

      {viewMode.mode === "grid" && (
        <GridView
          items={paginatedData}
          renderCard={(c) => <ContactCard {...c} />}
          selectable
          {...selection}
        />
      )}

      {viewMode.mode === "kanban" && (
        <KanbanView
          columns={kanbanColumns}
          renderCard={(c) => <ContactCard {...c} />}
          onCardMove={handleMove}
        />
      )}

      {/* Pagination */}
      <Pagination {...pagination} />
    </div>
  );
}
```

---

## 🎨 THEMING

All components use Tailwind classes and respect the theme:
- Primary color: `text-primary`, `bg-primary`
- Gray scale: `gray-50` to `gray-900`
- Semantic colors: `red`, `green`, `yellow`, `blue`
- Border radius: `rounded`, `rounded-lg`, `rounded-full`
- Shadows: `shadow-sm`, `shadow-md`, `shadow-lg`

---

## 📱 RESPONSIVE

All components are mobile-first:
- Grid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Text: `text-sm md:text-base`
- Spacing: `px-4 md:px-6`
- Hidden: `hidden md:block`

---

## ⌨️ KEYBOARD SHORTCUTS

- Search: `⌘K` / `Ctrl+K` to focus
- Search: `Esc` to clear
- Table: Arrow keys for navigation (planned)
- Modal: `Esc` to close

---

## 🔗 LINKS

- **Demo:** `/showcase`
- **Documentation:** `/PHASE_3A_COMPLETION.md`
- **Guidelines:** `/Guidelines.md`
- **Components:** `/src/app/components/crm/`
- **Hooks:** `/src/app/hooks/ui/`

---

**Happy Coding! 🚀**
