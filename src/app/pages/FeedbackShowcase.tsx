import * as React from "react";
import { Link } from "react-router";
import {
  AdvancedModal,
  Drawer,
  ConfirmationDialog,
  NotificationProvider,
  useNotifications,
  useToast,
  InlineNotification,
  NotificationBell,
  AdvancedAlert,
  BannerAlert,
  FloatingAlert,
  AlertList,
  EnhancedTooltip,
  RichTooltip,
  KeyboardShortcutTooltip,
  InfoTooltip,
  HelperText,
  AdvancedPopover,
  ContextMenu,
  QuickActionMenu,
} from "../components/ui";
import { Button } from "../components/ui/button";
import {
  Info,
  AlertCircle,
  Settings,
  User,
  Download,
  Trash2,
  Edit,
  Copy,
  Share2,
  MoreVertical,
} from "lucide-react";

/**
 * FEEDBACK & OVERLAY COMPONENTS SHOWCASE
 * Phase 2.4: Steps 108-120 - Advanced feedback and overlay components
 */

function FeedbackShowcaseContent() {
  const [modalOpen, setModalOpen] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [floatingAlertVisible, setFloatingAlertVisible] = React.useState(false);

  const { notifications, clearAll } = useNotifications();
  const { toast, success, error, warning, info } = useToast();

  const [alerts, setAlerts] = React.useState([
    {
      id: "1",
      variant: "info" as const,
      title: "System Maintenance",
      description: "Scheduled maintenance on Saturday 2AM-4AM",
      dismissible: true,
    },
    {
      id: "2",
      variant: "warning" as const,
      title: "Password Expiring",
      description: "Your password will expire in 7 days",
      dismissible: true,
    },
  ]);

  const handleConfirm = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    success("Action completed", "Your changes have been saved successfully");
  };

  const contextMenuItems = [
    { label: "Edit", icon: <Edit className="w-4 h-4" />, onClick: () => info("Edit clicked") },
    { label: "Copy", icon: <Copy className="w-4 h-4" />, onClick: () => info("Copy clicked") },
    { label: "Share", icon: <Share2 className="w-4 h-4" />, onClick: () => info("Share clicked") },
    { separator: true },
    {
      label: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: () => error("Delete clicked"),
      danger: true,
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="border-b pb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Feedback & Overlay Components</h1>
              <p className="text-muted-foreground">
                Phase 2.4: Steps 108-120 - Advanced feedback and overlay components
              </p>
            </div>
            <div className="flex items-center gap-2">
              <NotificationBell count={notifications.length} />
              {notifications.length > 0 && (
                <Button variant="outline" size="sm" onClick={clearAll}>
                  Clear All
                </Button>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/showcase" className="text-sm text-primary hover:underline">
              ← Core Components
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/showcase/navigation" className="text-sm text-primary hover:underline">
              Navigation Components
            </Link>
          </div>
        </div>

        {/* Modals & Drawers */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Modals & Drawers</h2>
            <p className="text-muted-foreground">Step 108: Advanced modal dialogs and slide-out panels</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Advanced Modal */}
            <div className="p-6 border rounded-lg space-y-3">
              <h3 className="font-semibold">Advanced Modal</h3>
              <p className="text-sm text-muted-foreground">
                Modal with drag, resize, and fullscreen support
              </p>
              <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
              <AdvancedModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                title="Advanced Modal"
                description="This modal supports dragging, resizing, and fullscreen mode"
                size="lg"
                draggable
                showFullscreenToggle
                footer={
                  <>
                    <Button variant="outline" onClick={() => setModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setModalOpen(false)}>Save Changes</Button>
                  </>
                }
              >
                <div className="space-y-4">
                  <p>Modal content goes here. You can drag this modal by clicking and dragging the header.</p>
                  <div className="p-4 bg-muted rounded">
                    <p className="text-sm">Sample content block</p>
                  </div>
                </div>
              </AdvancedModal>
            </div>

            {/* Drawer */}
            <div className="p-6 border rounded-lg space-y-3">
              <h3 className="font-semibold">Drawer (Slide-out Panel)</h3>
              <p className="text-sm text-muted-foreground">
                Side panel for additional content
              </p>
              <Button onClick={() => setDrawerOpen(true)}>Open Drawer</Button>
              <Drawer
                open={drawerOpen}
                onOpenChange={setDrawerOpen}
                side="right"
                title="Settings"
                size="lg"
                footer={
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setDrawerOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setDrawerOpen(false)}>Save</Button>
                  </div>
                }
              >
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Setting 1</label>
                    <input type="text" className="w-full mt-1 px-3 py-2 border rounded" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Setting 2</label>
                    <input type="text" className="w-full mt-1 px-3 py-2 border rounded" />
                  </div>
                </div>
              </Drawer>
            </div>

            {/* Confirmation Dialog */}
            <div className="p-6 border rounded-lg space-y-3">
              <h3 className="font-semibold">Confirmation Dialog</h3>
              <p className="text-sm text-muted-foreground">
                Confirm destructive or important actions
              </p>
              <div className="flex gap-2">
                <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
                  Delete Item
                </Button>
              </div>
              <ConfirmationDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="Confirm Deletion"
                description="Are you sure you want to delete this item? This action cannot be undone."
                confirmText="Delete"
                variant="destructive"
                onConfirm={handleConfirm}
              />
            </div>
          </div>
        </section>

        {/* Notifications */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Notifications & Toasts</h2>
            <p className="text-muted-foreground">Step 109: Toast notification system</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Toast Notifications */}
            <div className="p-6 border rounded-lg space-y-3">
              <h3 className="font-semibold">Toast Notifications</h3>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => success("Success!", "Operation completed successfully")}>
                  Success Toast
                </Button>
                <Button onClick={() => error("Error!", "Something went wrong")}>
                  Error Toast
                </Button>
                <Button onClick={() => warning("Warning!", "Please review your input")}>
                  Warning Toast
                </Button>
                <Button onClick={() => info("Info", "Here's some information")}>
                  Info Toast
                </Button>
                <Button
                  onClick={() =>
                    toast({
                      type: "info",
                      title: "Action Available",
                      description: "Click to learn more",
                      action: {
                        label: "Learn More",
                        onClick: () => console.log("Learn more clicked"),
                      },
                      persistent: true,
                    })
                  }
                >
                  With Action
                </Button>
              </div>
            </div>

            {/* Inline Notifications */}
            <div className="p-6 border rounded-lg space-y-3">
              <h3 className="font-semibold">Inline Notifications</h3>
              <div className="space-y-3">
                <InlineNotification
                  type="success"
                  title="Changes Saved"
                  description="Your profile has been updated"
                  dismissible
                />
                <InlineNotification
                  type="warning"
                  title="Action Required"
                  description="Please verify your email address"
                  action={{
                    label: "Verify Now",
                    onClick: () => console.log("Verify clicked"),
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Alerts */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Alerts</h2>
            <p className="text-muted-foreground">Step 110: Advanced alert components</p>
          </div>

          <div className="space-y-6">
            {/* Banner Alert */}
            <div className="p-6 border rounded-lg space-y-3">
              <h3 className="font-semibold">Banner Alert</h3>
              <BannerAlert
                variant="info"
                message="New features are now available! Check out our latest updates."
                action={{
                  label: "Learn More",
                  onClick: () => console.log("Learn more"),
                }}
              />
            </div>

            {/* Advanced Alerts */}
            <div className="p-6 border rounded-lg space-y-3">
              <h3 className="font-semibold">Advanced Alerts</h3>
              <div className="space-y-3">
                <AdvancedAlert
                  variant="success"
                  title="Deployment Successful"
                  description="Your application has been deployed to production"
                  actions={[
                    { label: "View Logs", onClick: () => console.log("Logs"), variant: "outline" },
                    { label: "Open App", onClick: () => console.log("Open") },
                  ]}
                  dismissible
                />

                <AdvancedAlert
                  variant="warning"
                  title="Storage Almost Full"
                  collapsible
                  dismissible
                >
                  <div className="space-y-2 text-sm">
                    <p>You've used 95% of your storage quota.</p>
                    <ul className="list-disc pl-5">
                      <li>Current usage: 9.5 GB</li>
                      <li>Total quota: 10 GB</li>
                    </ul>
                  </div>
                </AdvancedAlert>
              </div>
            </div>

            {/* Alert List */}
            <div className="p-6 border rounded-lg space-y-3">
              <h3 className="font-semibold">Alert List</h3>
              <AlertList
                alerts={alerts}
                onDismiss={(id) => setAlerts((prev) => prev.filter((a) => a.id !== id))}
              />
            </div>

            {/* Floating Alert */}
            <div className="p-6 border rounded-lg space-y-3">
              <h3 className="font-semibold">Floating Alert</h3>
              <Button onClick={() => setFloatingAlertVisible(true)}>
                Show Floating Alert
              </Button>
              {floatingAlertVisible && (
                <FloatingAlert
                  variant="success"
                  title="Settings Saved"
                  description="Your preferences have been updated"
                  position="top"
                  duration={3000}
                  onClose={() => setFloatingAlertVisible(false)}
                />
              )}
            </div>
          </div>
        </section>

        {/* Tooltips */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Tooltips</h2>
            <p className="text-muted-foreground">Step 111: Enhanced tooltip components</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Enhanced Tooltip */}
            <div className="p-6 border rounded-lg space-y-4">
              <h3 className="font-semibold">Enhanced Tooltips</h3>
              <div className="flex flex-wrap gap-4">
                <EnhancedTooltip content="This is a tooltip" side="top">
                  <Button>Hover (Top)</Button>
                </EnhancedTooltip>

                <EnhancedTooltip content="This is a tooltip" side="right">
                  <Button>Hover (Right)</Button>
                </EnhancedTooltip>

                <EnhancedTooltip content="This is a tooltip" side="bottom">
                  <Button>Hover (Bottom)</Button>
                </EnhancedTooltip>

                <EnhancedTooltip content="This is a tooltip" side="left">
                  <Button>Hover (Left)</Button>
                </EnhancedTooltip>
              </div>
            </div>

            {/* Rich Tooltip */}
            <div className="p-6 border rounded-lg space-y-4">
              <h3 className="font-semibold">Rich Tooltips</h3>
              <div className="flex flex-wrap gap-4">
                <RichTooltip
                  title="User Information"
                  description="View and manage user details, permissions, and settings"
                  icon={<User className="w-4 h-4" />}
                >
                  <Button variant="outline">
                    <User className="w-4 h-4 mr-2" />
                    User Info
                  </Button>
                </RichTooltip>

                <RichTooltip
                  title="Settings"
                  description="Configure application preferences and options"
                  icon={<Settings className="w-4 h-4" />}
                >
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </RichTooltip>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="p-6 border rounded-lg space-y-4">
              <h3 className="font-semibold">Keyboard Shortcut Tooltips</h3>
              <div className="flex flex-wrap gap-4">
                <KeyboardShortcutTooltip label="Save" shortcut={["Cmd", "S"]}>
                  <Button>Save</Button>
                </KeyboardShortcutTooltip>

                <KeyboardShortcutTooltip label="Copy" shortcut={["Cmd", "C"]}>
                  <Button>Copy</Button>
                </KeyboardShortcutTooltip>

                <KeyboardShortcutTooltip label="Find" shortcut={["Cmd", "F"]}>
                  <Button>Find</Button>
                </KeyboardShortcutTooltip>
              </div>
            </div>

            {/* Helper Text */}
            <div className="p-6 border rounded-lg space-y-4">
              <h3 className="font-semibold">Helper Text & Info Icons</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    Email Address
                    <InfoTooltip content="We'll never share your email with anyone" />
                  </label>
                  <input type="email" className="w-full mt-1 px-3 py-2 border rounded" />
                </div>

                <HelperText
                  text="Password must be at least 8 characters"
                  tooltip="Include uppercase, lowercase, numbers, and special characters for a strong password"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Popovers & Context Menus */}
        <section className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Popovers & Context Menus</h2>
            <p className="text-muted-foreground">Step 112: Advanced popover and context menu components</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Advanced Popover */}
            <div className="p-6 border rounded-lg space-y-4">
              <h3 className="font-semibold">Advanced Popover</h3>
              <div className="flex gap-4">
                <AdvancedPopover
                  trigger={<Button>Open Popover</Button>}
                  title="Quick Actions"
                  content={
                    <div className="space-y-2">
                      <p className="text-sm">Choose an action to perform:</p>
                      <div className="space-y-1">
                        <button className="w-full text-left px-2 py-1 hover:bg-muted rounded text-sm">
                          Edit
                        </button>
                        <button className="w-full text-left px-2 py-1 hover:bg-muted rounded text-sm">
                          Share
                        </button>
                        <button className="w-full text-left px-2 py-1 hover:bg-muted rounded text-sm">
                          Download
                        </button>
                      </div>
                    </div>
                  }
                  showClose
                />

                <QuickActionMenu
                  trigger={
                    <Button variant="outline">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  }
                  actions={[
                    { label: "Edit", icon: <Edit className="w-4 h-4" />, onClick: () => info("Edit") },
                    {
                      label: "Download",
                      icon: <Download className="w-4 h-4" />,
                      onClick: () => info("Download"),
                    },
                    {
                      label: "Delete",
                      icon: <Trash2 className="w-4 h-4" />,
                      onClick: () => error("Delete"),
                    },
                  ]}
                />
              </div>
            </div>

            {/* Context Menu */}
            <div className="p-6 border rounded-lg space-y-4">
              <h3 className="font-semibold">Context Menu</h3>
              <ContextMenu items={contextMenuItems}>
                <div className="p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground">
                  Right-click here to see context menu
                </div>
              </ContextMenu>
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">Phase 2.4 Complete ✓</h2>
          <p className="text-muted-foreground mb-4">
            All feedback and overlay components implemented (Steps 108-120):
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Advanced Modal
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Drawer Panel
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Confirmation Dialog
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Toast Notifications
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Inline Notifications
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Notification Bell
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Advanced Alerts
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Banner Alerts
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Floating Alerts
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Enhanced Tooltips
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Rich Tooltips
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Advanced Popover
            </div>
            <div className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Context Menu
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function FeedbackShowcase() {
  return (
    <NotificationProvider>
      <FeedbackShowcaseContent />
    </NotificationProvider>
  );
}
