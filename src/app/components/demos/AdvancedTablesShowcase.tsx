import React from "react";
import { EnhancedDataTable, Column } from "../ui/enhanced-data-table";
import { EditableCell, EditableTableCell } from "../ui/inline-editable-table";
import { ExpandableRow, useExpandableRows, ExpandToggle } from "../ui/expandable-row-table";
import { useTableKeyboardNav, useRangeSelection } from "../ui/table-keyboard-nav";
import { TableContextMenu, ContextMenuItem } from "../ui/table-context-menu";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Avatar } from "../ui/avatar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/enhanced-card";
import {
  Edit,
  Trash2,
  Copy,
  Download,
  Mail,
  Phone,
  Eye,
  Star,
  Archive,
} from "lucide-react";

/* ============================================================
 * MOCK DATA
 * ============================================================ */

interface Employee {
  id: number;
  name: string;
  email: string;
  position: string;
  department: string;
  salary: number;
  startDate: string;
  status: "active" | "inactive" | "on-leave";
  avatar?: string;
}

const mockEmployees: Employee[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@company.com",
    position: "Senior Developer",
    department: "Engineering",
    salary: 95000,
    startDate: "2021-03-15",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@company.com",
    position: "Product Manager",
    department: "Product",
    salary: 105000,
    startDate: "2020-08-22",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob.johnson@company.com",
    position: "UX Designer",
    department: "Design",
    salary: 85000,
    startDate: "2022-01-10",
    status: "on-leave",
  },
  {
    id: 4,
    name: "Alice Brown",
    email: "alice.brown@company.com",
    position: "Marketing Manager",
    department: "Marketing",
    salary: 90000,
    startDate: "2021-11-05",
    status: "active",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
  },
  {
    id: 5,
    name: "Charlie Wilson",
    email: "charlie.wilson@company.com",
    position: "Sales Representative",
    department: "Sales",
    salary: 70000,
    startDate: "2023-02-18",
    status: "inactive",
  },
];

interface Project {
  id: number;
  name: string;
  description: string;
  status: "active" | "completed" | "on-hold";
  progress: number;
  budget: number;
  team: string[];
}

const mockProjects: Project[] = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Complete overhaul of company website with modern design",
    status: "active",
    progress: 65,
    budget: 150000,
    team: ["John Doe", "Bob Johnson"],
  },
  {
    id: 2,
    name: "Mobile App Development",
    description: "Native iOS and Android application",
    status: "active",
    progress: 40,
    budget: 250000,
    team: ["Jane Smith", "John Doe"],
  },
  {
    id: 3,
    name: "CRM Integration",
    description: "Integrate with Salesforce and HubSpot",
    status: "completed",
    progress: 100,
    budget: 80000,
    team: ["Alice Brown"],
  },
];

/* ============================================================
 * STATUS BADGE
 * ============================================================ */

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const variants: Record<string, string> = {
    active: "bg-[var(--success)]/10 text-[var(--success)] border-[var(--success)]/20",
    inactive: "bg-gray-500/10 text-gray-500 border-gray-500/20",
    "on-leave": "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20",
    completed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "on-hold": "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20",
  };

  return (
    <Badge size="sm" className={`border font-medium ${variants[status] || ""}`}>
      {status.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
    </Badge>
  );
};

/* ============================================================
 * SHOWCASE COMPONENT
 * ============================================================ */

export function AdvancedTablesShowcase() {
  /* ========================================
   * INLINE EDITING TABLE
   * ======================================== */
  const [employees, setEmployees] = React.useState(mockEmployees);

  const handleCellSave = async (rowId: string | number, columnId: string, value: any) => {
    console.log("Saving:", { rowId, columnId, value });
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setEmployees(prev =>
      prev.map(emp =>
        emp.id === rowId ? { ...emp, [columnId]: value } : emp
      )
    );
  };

  const editableColumns: Column<Employee>[] = [
    {
      id: "name",
      header: "Name",
      cell: (emp) => (
        <EditableTableCell
          rowId={emp.id}
          columnId="name"
          value={emp.name}
          type="text"
          onSave={handleCellSave}
          required
        />
      ),
    },
    {
      id: "email",
      header: "Email",
      cell: (emp) => (
        <EditableTableCell
          rowId={emp.id}
          columnId="email"
          value={emp.email}
          type="email"
          onSave={handleCellSave}
          required
        />
      ),
    },
    {
      id: "position",
      header: "Position",
      cell: (emp) => (
        <EditableTableCell
          rowId={emp.id}
          columnId="position"
          value={emp.position}
          type="text"
          onSave={handleCellSave}
        />
      ),
    },
    {
      id: "department",
      header: "Department",
      cell: (emp) => (
        <EditableTableCell
          rowId={emp.id}
          columnId="department"
          value={emp.department}
          type="select"
          options={[
            { label: "Engineering", value: "Engineering" },
            { label: "Product", value: "Product" },
            { label: "Design", value: "Design" },
            { label: "Marketing", value: "Marketing" },
            { label: "Sales", value: "Sales" },
          ]}
          onSave={handleCellSave}
        />
      ),
    },
    {
      id: "salary",
      header: "Salary",
      cell: (emp) => (
        <EditableTableCell
          rowId={emp.id}
          columnId="salary"
          value={emp.salary}
          type="number"
          onSave={handleCellSave}
          min={0}
          renderDisplay={(value) => `$${value.toLocaleString()}`}
        />
      ),
      align: "right",
    },
    {
      id: "status",
      header: "Status",
      cell: (emp) => (
        <EditableTableCell
          rowId={emp.id}
          columnId="status"
          value={emp.status}
          type="select"
          options={[
            { label: "Active", value: "active" },
            { label: "Inactive", value: "inactive" },
            { label: "On Leave", value: "on-leave" },
          ]}
          onSave={handleCellSave}
          renderDisplay={(value) => <StatusBadge status={value} />}
        />
      ),
    },
  ];

  /* ========================================
   * EXPANDABLE ROWS TABLE
   * ======================================== */
  const { expandedRows, isExpanded, toggleRow } = useExpandableRows();

  const expandableColumns: Column<Project>[] = [
    {
      id: "expand",
      header: "",
      cell: (project) => (
        <ExpandToggle
          isExpanded={isExpanded(project.id)}
          onToggle={() => toggleRow(project.id)}
        />
      ),
    },
    {
      id: "name",
      header: "Project Name",
      accessor: "name",
    },
    {
      id: "status",
      header: "Status",
      cell: (project) => <StatusBadge status={project.status} />,
    },
    {
      id: "progress",
      header: "Progress",
      cell: (project) => (
        <div className="flex items-center gap-2">
          <div className="flex-1 h-2 bg-accent rounded-full overflow-hidden">
            <div
              className="h-full bg-[var(--brand-primary)] transition-all"
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <span className="text-sm font-medium">{project.progress}%</span>
        </div>
      ),
    },
    {
      id: "budget",
      header: "Budget",
      cell: (project) => `$${project.budget.toLocaleString()}`,
      align: "right",
    },
  ];

  /* ========================================
   * KEYBOARD NAVIGATION TABLE
   * ======================================== */
  const keyboardNavColumns: Column<Employee>[] = [
    {
      id: "avatar",
      header: "",
      cell: (emp) => (
        <Avatar className="size-8">
          {emp.avatar ? (
            <img src={emp.avatar} alt={emp.name} className="object-cover" />
          ) : (
            <div className="flex items-center justify-center bg-[var(--brand-primary)] text-white text-sm font-medium">
              {emp.name.charAt(0).toUpperCase()}
            </div>
          )}
        </Avatar>
      ),
    },
    {
      id: "name",
      header: "Name",
      accessor: "name",
    },
    {
      id: "position",
      header: "Position",
      accessor: "position",
    },
    {
      id: "department",
      header: "Department",
      accessor: "department",
    },
  ];

  const { handleKeyDown, getCellProps, focusCell } = useTableKeyboardNav({
    rowCount: employees.length,
    columnCount: keyboardNavColumns.length,
    onCellActivate: (row, col) => {
      console.log("Cell activated:", { row, col });
    },
  });

  /* ========================================
   * CONTEXT MENU TABLE
   * ======================================== */
  const [selectedEmployee, setSelectedEmployee] = React.useState<Employee | null>(null);

  const contextMenuItems: ContextMenuItem[] = [
    {
      id: "view",
      label: "View Details",
      icon: <Eye className="size-4" />,
      shortcut: "⌘V",
      onClick: () => console.log("View:", selectedEmployee),
    },
    {
      id: "edit",
      label: "Edit",
      icon: <Edit className="size-4" />,
      shortcut: "⌘E",
      onClick: () => console.log("Edit:", selectedEmployee),
    },
    {
      id: "sep1",
      label: "",
      separator: true,
    },
    {
      id: "email",
      label: "Send Email",
      icon: <Mail className="size-4" />,
      onClick: () => console.log("Email:", selectedEmployee?.email),
    },
    {
      id: "call",
      label: "Call",
      icon: <Phone className="size-4" />,
      onClick: () => console.log("Call:", selectedEmployee),
    },
    {
      id: "sep2",
      label: "",
      separator: true,
    },
    {
      id: "star",
      label: "Add to Favorites",
      icon: <Star className="size-4" />,
      onClick: () => console.log("Favorite:", selectedEmployee),
    },
    {
      id: "archive",
      label: "Archive",
      icon: <Archive className="size-4" />,
      onClick: () => console.log("Archive:", selectedEmployee),
    },
    {
      id: "sep3",
      label: "",
      separator: true,
    },
    {
      id: "delete",
      label: "Delete",
      icon: <Trash2 className="size-4" />,
      shortcut: "⌘⌫",
      danger: true,
      onClick: () => console.log("Delete:", selectedEmployee),
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-8 space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Advanced Data Tables</h1>
        <p className="text-muted-foreground">
          Inline editing, expandable rows, keyboard navigation, and context menus
        </p>
      </div>

      {/* ============================================================
       * INLINE EDITING
       * ============================================================ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Inline Editing</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Click any cell to edit in-place with validation and async save
          </p>
        </div>

        <Card variant="bordered">
          <CardContent>
            <EnhancedDataTable
              columns={editableColumns}
              data={employees}
              hoverable
              density="normal"
            />
          </CardContent>
        </Card>

        <div className="flex items-center gap-4 p-4 bg-accent/50 rounded-lg">
          <div className="flex-1">
            <h4 className="font-medium text-sm">Features</h4>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• Click cell to edit, ESC to cancel, Enter to save</li>
              <li>• Text, number, email, select, and date inputs</li>
              <li>• Validation (required, min/max, email format)</li>
              <li>• Async save with loading state</li>
              <li>• Custom display rendering</li>
            </ul>
          </div>
        </div>
      </section>

      {/* ============================================================
       * EXPANDABLE ROWS
       * ============================================================ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Expandable Rows</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Click row to expand and show detailed information
          </p>
        </div>

        <Card variant="bordered">
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-accent/50 border-b border-border">
                  <tr>
                    {expandableColumns.map((col) => (
                      <th
                        key={col.id}
                        className="text-left align-middle font-semibold h-10 px-3"
                      >
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockProjects.map((project, index) => (
                    <ExpandableRow
                      key={project.id}
                      isExpanded={isExpanded(project.id)}
                      onToggle={() => toggleRow(project.id)}
                      expandedContent={
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-semibold mb-2">Description</h4>
                            <p className="text-muted-foreground">{project.description}</p>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-2">Team Members</h4>
                            <div className="flex gap-2">
                              {project.team.map((member, i) => (
                                <Badge key={i} variant="default">
                                  {member}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="primary" size="sm">
                              <Edit className="size-4 mr-2" />
                              Edit Project
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="size-4 mr-2" />
                              Export Data
                            </Button>
                          </div>
                        </div>
                      }
                    >
                      {expandableColumns.map((col) => (
                        <td key={col.id} className="p-3 align-middle">
                          {col.cell ? col.cell(project, index) : project[col.accessor as keyof Project]}
                        </td>
                      ))}
                    </ExpandableRow>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* ============================================================
       * KEYBOARD NAVIGATION
       * ============================================================ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Keyboard Navigation</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Use arrow keys to navigate, Enter to activate, Space to select
          </p>
        </div>

        <Card variant="bordered">
          <CardContent>
            <div onKeyDown={handleKeyDown} tabIndex={0} className="focus:outline-none">
              <table className="w-full text-sm">
                <thead className="bg-accent/50 border-b border-border">
                  <tr>
                    {keyboardNavColumns.map((col) => (
                      <th key={col.id} className="text-left align-middle font-semibold h-10 px-3">
                        {col.header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp, rowIndex) => (
                    <tr
                      key={emp.id}
                      className="border-b border-border hover:bg-accent/50 transition-colors"
                    >
                      {keyboardNavColumns.map((col, colIndex) => (
                        <td
                          key={col.id}
                          className="p-3 align-middle focus:bg-[var(--brand-primary)]/10 focus:ring-2 focus:ring-[var(--brand-primary)]/50 focus:outline-none"
                          {...getCellProps(rowIndex, colIndex)}
                        >
                          {col.cell ? col.cell(emp, rowIndex) : emp[col.accessor as keyof Employee]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="p-4 bg-accent/50 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Keyboard Shortcuts</h4>
          <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
            <div>↑/↓ - Navigate rows</div>
            <div>←/→ - Navigate columns</div>
            <div>Home/End - First/last column</div>
            <div>Ctrl+Home/End - First/last row</div>
            <div>Page Up/Down - Jump 10 rows</div>
            <div>Enter/Space - Activate cell</div>
          </div>
        </div>
      </section>

      {/* ============================================================
       * CONTEXT MENU
       * ============================================================ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Context Menu</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Right-click any row to open context menu with actions
          </p>
        </div>

        <Card variant="bordered">
          <CardContent>
            <table className="w-full text-sm">
              <thead className="bg-accent/50 border-b border-border">
                <tr>
                  <th className="text-left align-middle font-semibold h-10 px-3">Name</th>
                  <th className="text-left align-middle font-semibold h-10 px-3">Email</th>
                  <th className="text-left align-middle font-semibold h-10 px-3">Position</th>
                  <th className="text-left align-middle font-semibold h-10 px-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp) => (
                  <TableContextMenu
                    key={emp.id}
                    items={contextMenuItems}
                    onItemClick={(id) => console.log("Menu item clicked:", id)}
                  >
                    <tr
                      className="border-b border-border hover:bg-accent/50 transition-colors cursor-context-menu"
                      onContextMenu={() => setSelectedEmployee(emp)}
                    >
                      <td className="p-3">{emp.name}</td>
                      <td className="p-3">{emp.email}</td>
                      <td className="p-3">{emp.position}</td>
                      <td className="p-3">
                        <StatusBadge status={emp.status} />
                      </td>
                    </tr>
                  </TableContextMenu>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      {/* Feature Summary */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Advanced Features Summary</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              title: "Inline Editing",
              features: [
                "Click-to-edit cells",
                "Multiple input types",
                "Validation & error handling",
                "Async save operations",
                "Custom display renderers",
              ],
            },
            {
              title: "Expandable Rows",
              features: [
                "Toggle expand/collapse",
                "Nested content",
                "Smooth animations",
                "Keyboard accessible",
                "Controlled state",
              ],
            },
            {
              title: "Keyboard Navigation",
              features: [
                "Arrow key navigation",
                "Home/End shortcuts",
                "Page Up/Down",
                "Cell activation",
                "Focus management",
              ],
            },
            {
              title: "Context Menus",
              features: [
                "Right-click actions",
                "Keyboard shortcuts",
                "Icon support",
                "Grouped items",
                "Danger actions",
              ],
            },
          ].map((feature, index) => (
            <Card key={index} variant="bordered">
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1.5">
                  {feature.features.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <div className="size-1.5 rounded-full bg-[var(--brand-primary)]" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
