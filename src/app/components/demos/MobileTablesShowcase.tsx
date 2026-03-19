import React from "react";
import {
  ResponsiveTable,
  ResponsiveTableColumn,
  ViewModeToggle,
  useResponsiveTable,
} from "../ui/responsive-table";
import {
  SwipeableListItem,
  createDeleteAction,
  createArchiveAction,
  createEditAction,
  createStarAction,
} from "../ui/swipeable-list-item";
import {
  BottomSheet,
  BottomSheetSection,
  BottomSheetFooter,
  useBottomSheet,
} from "../ui/bottom-sheet";
import { PullToRefresh, RefreshButton, RefreshIndicator } from "../ui/pull-to-refresh";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/enhanced-card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar } from "../ui/avatar";
import { Checkbox } from "../ui/checkbox";
import {
  Filter,
  Search,
  SlidersHorizontal,
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Star,
  MoreVertical,
} from "lucide-react";

/* ============================================================
 * MOCK DATA
 * ============================================================ */

interface Contact {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  position: string;
  location: string;
  value: number;
  status: "hot" | "warm" | "cold";
  lastContact: string;
  avatar?: string;
}

const mockContacts: Contact[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.j@techcorp.com",
    phone: "+1 (555) 123-4567",
    company: "TechCorp",
    position: "VP of Sales",
    location: "San Francisco, CA",
    value: 150000,
    status: "hot",
    lastContact: "2 hours ago",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "m.chen@innovate.io",
    phone: "+1 (555) 234-5678",
    company: "Innovate.io",
    position: "CEO",
    location: "New York, NY",
    value: 250000,
    status: "hot",
    lastContact: "1 day ago",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "e.rodriguez@startup.com",
    phone: "+1 (555) 345-6789",
    company: "Startup Inc",
    position: "CTO",
    location: "Austin, TX",
    value: 80000,
    status: "warm",
    lastContact: "3 days ago",
  },
  {
    id: 4,
    name: "David Kim",
    email: "david@enterprise.com",
    phone: "+1 (555) 456-7890",
    company: "Enterprise Co",
    position: "Director",
    location: "Seattle, WA",
    value: 120000,
    status: "warm",
    lastContact: "5 days ago",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
  },
  {
    id: 5,
    name: "Lisa Anderson",
    email: "lisa@growth.com",
    phone: "+1 (555) 567-8901",
    company: "Growth LLC",
    position: "Marketing Head",
    location: "Boston, MA",
    value: 50000,
    status: "cold",
    lastContact: "2 weeks ago",
  },
];

/* ============================================================
 * STATUS BADGE
 * ============================================================ */

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const variants: Record<string, string> = {
    hot: "bg-[var(--error)]/10 text-[var(--error)] border-[var(--error)]/20",
    warm: "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20",
    cold: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  const labels: Record<string, string> = {
    hot: "🔥 Hot",
    warm: "⚡ Warm",
    cold: "❄️ Cold",
  };

  return (
    <Badge size="sm" className={`border font-medium ${variants[status] || ""}`}>
      {labels[status] || status}
    </Badge>
  );
};

/* ============================================================
 * SHOWCASE COMPONENT
 * ============================================================ */

export function MobileTablesShowcase() {
  const [contacts, setContacts] = React.useState(mockContacts);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState<string[]>([]);
  const [selectedContacts, setSelectedContacts] = React.useState<Set<number>>(new Set());

  // Responsive table
  const { viewMode, setViewMode, isMobile, isTablet } = useResponsiveTable();

  // Bottom sheet for filters
  const filterSheet = useBottomSheet();

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  // Handle delete
  const handleDelete = (id: number) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  // Handle archive
  const handleArchive = (id: number) => {
    console.log("Archive:", id);
  };

  // Handle edit
  const handleEdit = (id: number) => {
    console.log("Edit:", id);
  };

  // Handle star
  const handleStar = (id: number) => {
    console.log("Star:", id);
  };

  // Filter contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch =
      !searchQuery ||
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus.length === 0 || selectedStatus.includes(contact.status);

    return matchesSearch && matchesStatus;
  });

  // Columns definition
  const columns: ResponsiveTableColumn<Contact>[] = [
    {
      id: "name",
      header: "Name",
      priority: 1,
      cell: (contact) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-10">
            {contact.avatar ? (
              <img src={contact.avatar} alt={contact.name} className="object-cover" />
            ) : (
              <div className="flex items-center justify-center bg-[var(--brand-primary)] text-white font-medium">
                {contact.name.charAt(0)}
              </div>
            )}
          </Avatar>
          <div>
            <div className="font-medium">{contact.name}</div>
            <div className="text-sm text-muted-foreground">{contact.position}</div>
          </div>
        </div>
      ),
    },
    {
      id: "company",
      header: "Company",
      accessor: "company",
      priority: 2,
      mobileHidden: true,
    },
    {
      id: "email",
      header: "Email",
      accessor: "email",
      priority: 4,
      mobileHidden: true,
    },
    {
      id: "phone",
      header: "Phone",
      accessor: "phone",
      priority: 5,
      mobileHidden: true,
    },
    {
      id: "status",
      header: "Status",
      priority: 3,
      cell: (contact) => <StatusBadge status={contact.status} />,
    },
    {
      id: "value",
      header: "Value",
      priority: 6,
      cell: (contact) => (
        <span className="font-medium">${contact.value.toLocaleString()}</span>
      ),
    },
  ];

  // Render card for mobile
  const renderCard = (contact: Contact) => (
    <Card variant="bordered" className="hover:shadow-md transition-all">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="size-12">
            {contact.avatar ? (
              <img src={contact.avatar} alt={contact.name} className="object-cover" />
            ) : (
              <div className="flex items-center justify-center bg-[var(--brand-primary)] text-white font-medium">
                {contact.name.charAt(0)}
              </div>
            )}
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-semibold">{contact.name}</h4>
                <p className="text-sm text-muted-foreground">{contact.position}</p>
              </div>
              <StatusBadge status={contact.status} />
            </div>

            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Users className="size-4 shrink-0" />
                <span className="truncate">{contact.company}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="size-4 shrink-0" />
                <span className="truncate">{contact.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="size-4 shrink-0" />
                  <span>${contact.value.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="size-4 shrink-0" />
                  <span>{contact.lastContact}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Refresh Indicator */}
      <RefreshIndicator isRefreshing={isRefreshing} />

      {/* Mobile Header */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="p-4 space-y-3">
          {/* Title & Actions */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Contacts</h1>
              <p className="text-sm text-muted-foreground">
                {filteredContacts.length} contacts
              </p>
            </div>
            <div className="flex items-center gap-2">
              {!isMobile && <RefreshButton onRefresh={handleRefresh} />}
              <Button
                variant="outline"
                size="sm"
                onClick={filterSheet.openSheet}
                className="gap-2"
              >
                <Filter className="size-4" />
                {selectedStatus.length > 0 && (
                  <Badge size="xs" className="ml-1">
                    {selectedStatus.length}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search contacts..."
              className="pl-10"
            />
          </div>

          {/* View Mode Toggle (Desktop) */}
          {!isMobile && (
            <div className="flex justify-end">
              <ViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
            </div>
          )}
        </div>
      </div>

      {/* Content with Pull to Refresh */}
      <PullToRefresh onRefresh={handleRefresh} className="h-[calc(100vh-12rem)]">
        <div className="p-4">
          {/* Desktop Table / Mobile Cards */}
          {viewMode === "cards" || isMobile ? (
            <div className="space-y-3">
              {filteredContacts.map((contact) => (
                <SwipeableListItem
                  key={contact.id}
                  leftActions={[
                    createEditAction(() => handleEdit(contact.id)),
                    createStarAction(() => handleStar(contact.id)),
                  ]}
                  rightActions={[
                    createArchiveAction(() => handleArchive(contact.id)),
                    createDeleteAction(() => handleDelete(contact.id)),
                  ]}
                >
                  {renderCard(contact)}
                </SwipeableListItem>
              ))}
            </div>
          ) : (
            <ResponsiveTable
              columns={columns}
              data={filteredContacts}
              viewMode={viewMode}
              renderCard={renderCard}
              onRowClick={(contact) => console.log("Clicked:", contact)}
            />
          )}

          {/* Empty State */}
          {filteredContacts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Users className="size-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No contacts found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </PullToRefresh>

      {/* Filter Bottom Sheet */}
      <BottomSheet
        open={filterSheet.open}
        onOpenChange={filterSheet.setOpen}
        title="Filter Contacts"
        description="Refine your contact list"
      >
        <BottomSheetSection title="Status">
          <div className="space-y-3">
            {[
              { value: "hot", label: "🔥 Hot Leads", color: "text-[var(--error)]" },
              { value: "warm", label: "⚡ Warm Leads", color: "text-[var(--warning)]" },
              { value: "cold", label: "❄️ Cold Leads", color: "text-blue-500" },
            ].map((option) => (
              <label
                key={option.value}
                className="flex items-center gap-3 cursor-pointer"
              >
                <Checkbox
                  checked={selectedStatus.includes(option.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedStatus([...selectedStatus, option.value]);
                    } else {
                      setSelectedStatus(selectedStatus.filter((s) => s !== option.value));
                    }
                  }}
                />
                <span className={`font-medium ${option.color}`}>{option.label}</span>
              </label>
            ))}
          </div>
        </BottomSheetSection>

        <BottomSheetSection title="Value Range">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Input type="number" placeholder="Min" />
              <span className="text-muted-foreground">to</span>
              <Input type="number" placeholder="Max" />
            </div>
          </div>
        </BottomSheetSection>

        <BottomSheetFooter>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setSelectedStatus([]);
                filterSheet.closeSheet();
              }}
            >
              Clear All
            </Button>
            <Button variant="primary" className="flex-1" onClick={filterSheet.closeSheet}>
              Apply Filters
            </Button>
          </div>
        </BottomSheetFooter>
      </BottomSheet>

      {/* Feature Documentation */}
      <div className="p-4 space-y-4 bg-accent/30 border-t border-border">
        <h2 className="text-xl font-semibold">Mobile Features</h2>
        
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: <SlidersHorizontal className="size-5" />,
              title: "Responsive Views",
              description: "Auto-switch between table, cards, and list based on screen size",
            },
            {
              icon: <TrendingUp className="size-5" />,
              title: "Swipe Actions",
              description: "Swipe left for delete/archive, right for edit/star",
            },
            {
              icon: <Filter className="size-5" />,
              title: "Bottom Sheet",
              description: "Mobile-optimized filters with swipe-to-close",
            },
            {
              icon: <Search className="size-5" />,
              title: "Pull to Refresh",
              description: "Pull down to refresh data (mobile only)",
            },
            {
              icon: <Star className="size-5" />,
              title: "Touch Optimized",
              description: "Large tap targets and smooth gestures",
            },
            {
              icon: <MoreVertical className="size-5" />,
              title: "Adaptive UI",
              description: "Different layouts for mobile, tablet, and desktop",
            },
          ].map((feature, index) => (
            <Card key={index} variant="bordered">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]">
                    {feature.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="p-4 bg-[var(--brand-primary)]/10 rounded-lg border border-[var(--brand-primary)]/20">
          <h4 className="font-semibold mb-2 text-[var(--brand-primary)]">
            📱 Try These Actions:
          </h4>
          <ul className="space-y-1 text-sm">
            <li>• <strong>Mobile:</strong> Pull down to refresh the list</li>
            <li>• <strong>Mobile:</strong> Swipe cards left/right for quick actions</li>
            <li>• <strong>Mobile:</strong> Tap filter button to open bottom sheet</li>
            <li>• <strong>Desktop:</strong> Switch between table/cards/list views</li>
            <li>• <strong>Desktop:</strong> Click refresh button in header</li>
            <li>• <strong>All Devices:</strong> Search and filter contacts</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
