import React from "react";
import { EnhancedDataTable, Column, SortDirection } from "../ui/enhanced-data-table";
import { TableToolbar } from "../ui/table-toolbar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar } from "../ui/avatar";
import { Mail, Phone, MoreVertical, Edit, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

/* ============================================================
 * MOCK DATA
 * ============================================================ */

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  status: "active" | "inactive" | "pending";
  joinDate: string;
  avatar?: string;
}

const mockUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@company.com",
    role: "Product Manager",
    department: "Product",
    status: "active",
    joinDate: "2023-01-15",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@company.com",
    role: "Senior Developer",
    department: "Engineering",
    status: "active",
    joinDate: "2022-11-20",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob.johnson@company.com",
    role: "Designer",
    department: "Design",
    status: "inactive",
    joinDate: "2023-03-10",
  },
  {
    id: 4,
    name: "Alice Williams",
    email: "alice.williams@company.com",
    role: "Marketing Manager",
    department: "Marketing",
    status: "active",
    joinDate: "2022-08-05",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
  },
  {
    id: 5,
    name: "Charlie Brown",
    email: "charlie.brown@company.com",
    role: "Sales Representative",
    department: "Sales",
    status: "pending",
    joinDate: "2024-01-12",
  },
  {
    id: 6,
    name: "Diana Prince",
    email: "diana.prince@company.com",
    role: "HR Manager",
    department: "Human Resources",
    status: "active",
    joinDate: "2021-05-18",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=diana",
  },
  {
    id: 7,
    name: "Ethan Hunt",
    email: "ethan.hunt@company.com",
    role: "DevOps Engineer",
    department: "Engineering",
    status: "active",
    joinDate: "2022-09-22",
  },
  {
    id: 8,
    name: "Fiona Green",
    email: "fiona.green@company.com",
    role: "Content Writer",
    department: "Marketing",
    status: "active",
    joinDate: "2023-06-30",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=fiona",
  },
  {
    id: 9,
    name: "George White",
    email: "george.white@company.com",
    role: "Data Analyst",
    department: "Analytics",
    status: "inactive",
    joinDate: "2023-02-14",
  },
  {
    id: 10,
    name: "Hannah Lee",
    email: "hannah.lee@company.com",
    role: "UX Researcher",
    department: "Design",
    status: "active",
    joinDate: "2022-12-01",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=hannah",
  },
];

/* ============================================================
 * STATUS BADGE
 * ============================================================ */

const StatusBadge: React.FC<{ status: User["status"] }> = ({ status }) => {
  const variants = {
    active: "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20",
    inactive: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    pending: "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20",
  };

  return (
    <Badge size="sm" className={`border font-medium ${variants[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

/* ============================================================
 * SHOWCASE COMPONENT
 * ============================================================ */

export function DataTablesShowcase() {
  // State
  const [selectedRows, setSelectedRows] = React.useState<Set<number>>(new Set());
  const [sortBy, setSortBy] = React.useState<string>("name");
  const [sortDirection, setSortDirection] = React.useState<SortDirection>("asc");
  const [searchValue, setSearchValue] = React.useState("");
  const [density, setDensity] = React.useState<"compact" | "normal" | "comfortable">("normal");
  const [pinnedColumns, setPinnedColumns] = React.useState<Set<string>>(new Set());
  const [hiddenColumns, setHiddenColumns] = React.useState<Set<string>>(new Set());

  // Define columns
  const columns: Column<User>[] = [
    {
      id: "user",
      header: "User",
      cell: (user) => (
        <div className="flex items-center gap-3 min-w-[200px]">
          <Avatar className="size-8 shrink-0">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="object-cover" />
            ) : (
              <div className="flex items-center justify-center bg-[var(--brand-primary)] text-white text-sm font-medium">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{user.name}</div>
            <div className="text-xs text-muted-foreground truncate">{user.email}</div>
          </div>
        </div>
      ),
      sortable: true,
      accessor: "name",
    },
    {
      id: "role",
      header: "Role",
      accessor: "role",
      sortable: true,
    },
    {
      id: "department",
      header: "Department",
      accessor: "department",
      sortable: true,
    },
    {
      id: "status",
      header: "Status",
      cell: (user) => <StatusBadge status={user.status} />,
      sortable: true,
      accessor: "status",
    },
    {
      id: "joinDate",
      header: "Join Date",
      accessor: "joinDate",
      cell: (user) => new Date(user.joinDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      sortable: true,
    },
    {
      id: "actions",
      header: "Actions",
      align: "right",
      cell: (user) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Eye className="size-4 mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Edit className="size-4 mr-2" />
              Edit User
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Mail className="size-4 mr-2" />
              Send Email
            </DropdownMenuItem>
            <DropdownMenuItem className="text-[var(--error)]">
              <Trash2 className="size-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  // Filter data based on search
  const filteredData = React.useMemo(() => {
    if (!searchValue) return mockUsers;
    
    const lowerSearch = searchValue.toLowerCase();
    return mockUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(lowerSearch) ||
        user.email.toLowerCase().includes(lowerSearch) ||
        user.role.toLowerCase().includes(lowerSearch) ||
        user.department.toLowerCase().includes(lowerSearch)
    );
  }, [searchValue]);

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortBy || !sortDirection) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const column = columns.find((col) => col.id === sortBy);
      if (!column || !column.accessor) return 0;

      let aValue: any;
      let bValue: any;

      if (typeof column.accessor === "function") {
        aValue = column.accessor(a);
        bValue = column.accessor(b);
      } else {
        aValue = a[column.accessor];
        bValue = b[column.accessor];
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [filteredData, sortBy, sortDirection, columns]);

  // Handlers
  const handleSort = (columnId: string, direction: SortDirection) => {
    setSortBy(columnId);
    setSortDirection(direction);
  };

  const handlePinColumn = (columnId: string) => {
    setPinnedColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(columnId)) {
        newSet.delete(columnId);
      } else {
        newSet.add(columnId);
      }
      return newSet;
    });
  };

  const handleToggleColumnVisibility = (columnId: string) => {
    setHiddenColumns((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(columnId)) {
        newSet.delete(columnId);
      } else {
        newSet.add(columnId);
      }
      return newSet;
    });
  };

  const handleRefresh = () => {
    console.log("Refreshing data...");
    // Simulate refresh
  };

  const handleExport = () => {
    console.log("Exporting data...");
    // Simulate export
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-8 space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Enhanced Data Tables</h1>
        <p className="text-muted-foreground">
          Production-ready data tables with sorting, filtering, selection, and more
        </p>
      </div>

      {/* ============================================================
       * FULL FEATURED TABLE
       * ============================================================ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Full Featured Table</h2>
          <p className="text-sm text-muted-foreground mt-1">
            All features enabled: selection, sorting, search, density, column visibility, pinning
          </p>
        </div>

        <div className="border border-border rounded-xl overflow-hidden">
          <TableToolbar
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            searchPlaceholder="Search users..."
            columns={columns}
            hiddenColumns={hiddenColumns}
            onToggleColumnVisibility={handleToggleColumnVisibility}
            density={density}
            onDensityChange={setDensity}
            onRefresh={handleRefresh}
            onExport={handleExport}
            actions={
              selectedRows.size > 0 && (
                <div className="flex items-center gap-2">
                  <Badge variant="primary" size="sm">
                    {selectedRows.size} selected
                  </Badge>
                  <Button variant="outline" size="sm">
                    <Mail className="size-4 mr-2" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="size-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )
            }
          />

          <EnhancedDataTable
            columns={columns}
            data={sortedData}
            selectable
            selectedRows={selectedRows}
            onSelectionChange={setSelectedRows}
            sortable
            sortBy={sortBy}
            sortDirection={sortDirection}
            onSort={handleSort}
            hoverable
            density={density}
            pinnedColumns={pinnedColumns}
            onPinColumn={handlePinColumn}
            hiddenColumns={hiddenColumns}
            stickyHeader
            resizable
          />
        </div>
      </section>

      {/* ============================================================
       * FEATURE DEMOS
       * ============================================================ */}
      <section className="grid gap-8 md:grid-cols-2">
        {/* Zebra Striping */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Zebra Striping</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Alternating row colors for better readability
            </p>
          </div>
          <EnhancedDataTable
            columns={columns.slice(0, 3)}
            data={mockUsers.slice(0, 5)}
            zebra
            hoverable={false}
            density="compact"
          />
        </div>

        {/* Compact Density */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Compact Density</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Display more data in less space
            </p>
          </div>
          <EnhancedDataTable
            columns={columns.slice(0, 3)}
            data={mockUsers.slice(0, 5)}
            density="compact"
            hoverable
          />
        </div>

        {/* Comfortable Density */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Comfortable Density</h3>
            <p className="text-sm text-muted-foreground mt-1">
              More spacing for better touch targets
            </p>
          </div>
          <EnhancedDataTable
            columns={columns.slice(0, 3)}
            data={mockUsers.slice(0, 5)}
            density="comfortable"
            hoverable
          />
        </div>

        {/* Empty State */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Empty State</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Custom empty state display
            </p>
          </div>
          <EnhancedDataTable
            columns={columns.slice(0, 3)}
            data={[]}
            empty={
              <div>
                <div className="size-12 rounded-full bg-[var(--brand-primary)]/10 flex items-center justify-center mb-4 mx-auto">
                  <Eye className="size-6 text-[var(--brand-primary)]" />
                </div>
                <h3 className="font-semibold mb-1">No Users Found</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get started by adding your first user
                </p>
                <Button variant="primary" size="sm">
                  Add User
                </Button>
              </div>
            }
          />
        </div>

        {/* Loading State */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Loading State</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Skeleton loaders while data is fetching
            </p>
          </div>
          <EnhancedDataTable
            columns={columns.slice(0, 3)}
            data={[]}
            loading
          />
        </div>
      </section>

      {/* Feature List */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Features</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            "Row selection (single/multi)",
            "Column sorting (asc/desc)",
            "Search & filtering",
            "Column visibility toggle",
            "Column pinning",
            "Column resizing",
            "Sticky header",
            "Zebra striping",
            "Hover effects",
            "3 density options",
            "Loading skeleton",
            "Empty state",
            "Bulk actions",
            "Export functionality",
            "Responsive design",
          ].map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 p-3 rounded-lg bg-accent/50"
            >
              <div className="size-2 rounded-full bg-[var(--brand-primary)]" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
