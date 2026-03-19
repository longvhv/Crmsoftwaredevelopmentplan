import React from "react";
import { ToastProvider, useToast } from "../ui/toast";
import {
  NotificationProvider,
  useNotification,
  NotificationCenter,
  NotificationBell,
} from "../ui/notification-center";
import {
  ProgressBar,
  CircularProgress,
  StepProgress,
  LoadingSpinner,
  Skeleton,
  Step,
} from "../ui/progress";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/enhanced-card";
import { Badge } from "../ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader2,
  Bell,
  Mail,
  UserPlus,
  DollarSign,
  Calendar,
  Clock,
  Download,
  Upload,
  Save,
  Trash2,
} from "lucide-react";

/* ============================================================
 * TOAST DEMOS
 * ============================================================ */

function ToastDemos() {
  const toast = useToast();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Toast Notifications</h2>
        <p className="text-sm text-muted-foreground">
          Lightweight notifications with auto-dismiss and actions
        </p>
      </div>

      {/* Basic Toasts */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Basic Variants</CardTitle>
          <CardDescription>5 semantic variants with icons</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button
            onClick={() => toast.toast({ title: "Default notification", description: "This is a default toast message" })}
          >
            Default
          </Button>
          <Button
            onClick={() => toast.success("Success!", "Your changes have been saved")}
            className="bg-[var(--success)] text-white hover:bg-[var(--success)]/90"
          >
            Success
          </Button>
          <Button
            onClick={() => toast.error("Error occurred", "Unable to save your changes")}
            variant="destructive"
          >
            Error
          </Button>
          <Button
            onClick={() => toast.warning("Warning", "This action cannot be undone")}
            className="bg-[var(--warning)] text-white hover:bg-[var(--warning)]/90"
          >
            Warning
          </Button>
          <Button
            onClick={() => toast.info("New feature", "Check out our new AI insights!")}
          >
            Info
          </Button>
          <Button
            onClick={() => toast.loading("Processing...", "Please wait")}
            className="gap-2"
          >
            <Loader2 className="size-4 animate-spin" />
            Loading
          </Button>
        </CardContent>
      </Card>

      {/* Toast with Actions */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Interactive Toasts</CardTitle>
          <CardDescription>Toasts with action buttons</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button
            onClick={() =>
              toast.toast({
                title: "File deleted",
                description: "Your file has been moved to trash",
                variant: "default",
                action: {
                  label: "Undo",
                  onClick: () => console.log("Undo delete"),
                },
              })
            }
            className="gap-2"
          >
            <Trash2 className="size-4" />
            Delete with Undo
          </Button>
          <Button
            onClick={() =>
              toast.toast({
                title: "Update available",
                description: "A new version is ready to install",
                variant: "info",
                action: {
                  label: "Update now",
                  onClick: () => console.log("Start update"),
                },
                duration: 10000,
              })
            }
            className="gap-2"
          >
            <Download className="size-4" />
            Update Available
          </Button>
          <Button
            onClick={() =>
              toast.toast({
                title: "Invitation sent",
                description: "John Doe will receive your invitation",
                variant: "success",
                action: {
                  label: "View",
                  onClick: () => console.log("View invitation"),
                },
              })
            }
            className="gap-2"
          >
            <Mail className="size-4" />
            Send Invitation
          </Button>
        </CardContent>
      </Card>

      {/* Promise Toast */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Promise-based Toast</CardTitle>
          <CardDescription>Automatic state handling for async operations</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button
            onClick={() => {
              const fakeApiCall = new Promise((resolve) => setTimeout(resolve, 2000));
              toast.promise(fakeApiCall, {
                loading: "Saving changes...",
                success: "Changes saved successfully!",
                error: "Failed to save changes",
              });
            }}
            className="gap-2"
          >
            <Save className="size-4" />
            Save (Success)
          </Button>
          <Button
            onClick={() => {
              const fakeApiCall = new Promise((_, reject) =>
                setTimeout(() => reject(new Error("Network error")), 2000)
              );
              toast.promise(fakeApiCall, {
                loading: "Uploading file...",
                success: "File uploaded!",
                error: (err) => `Upload failed: ${err.message}`,
              });
            }}
            variant="destructive"
            className="gap-2"
          >
            <Upload className="size-4" />
            Upload (Error)
          </Button>
        </CardContent>
      </Card>

      {/* Duration Control */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Duration Control</CardTitle>
          <CardDescription>Customize auto-dismiss timing</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={() => toast.toast({ title: "Quick toast", duration: 1000 })}>
            1 second
          </Button>
          <Button onClick={() => toast.toast({ title: "Normal toast", duration: 3000 })}>
            3 seconds
          </Button>
          <Button onClick={() => toast.toast({ title: "Longer toast", duration: 10000 })}>
            10 seconds
          </Button>
          <Button onClick={() => toast.toast({ title: "Persistent", duration: 0 })}>
            No auto-dismiss
          </Button>
        </CardContent>
      </Card>

      {/* Custom Icons */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Custom Icons</CardTitle>
          <CardDescription>Override default icons</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button
            onClick={() =>
              toast.toast({
                title: "New user registered",
                description: "John Doe just signed up",
                icon: <UserPlus className="size-5" />,
              })
            }
            className="gap-2"
          >
            <UserPlus className="size-4" />
            User Registered
          </Button>
          <Button
            onClick={() =>
              toast.toast({
                title: "Payment received",
                description: "$299.00 from Acme Corp",
                icon: <DollarSign className="size-5" />,
                variant: "success",
              })
            }
            className="gap-2"
          >
            <DollarSign className="size-4" />
            Payment Received
          </Button>
          <Button
            onClick={() =>
              toast.toast({
                title: "Meeting reminder",
                description: "Team sync in 15 minutes",
                icon: <Calendar className="size-5" />,
                variant: "info",
              })
            }
            className="gap-2"
          >
            <Calendar className="size-4" />
            Meeting Reminder
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/* ============================================================
 * NOTIFICATION CENTER DEMO
 * ============================================================ */

function NotificationCenterDemo() {
  const { addNotification, notifications, unreadCount } = useNotification();
  const [centerOpen, setCenterOpen] = React.useState(false);

  const addSampleNotification = (type: "system" | "deal" | "contact" | "task" | "message") => {
    const samples = {
      system: {
        title: "System Update",
        description: "Your CRM has been updated to version 2.5.0 with new AI features",
        category: "system" as const,
        priority: "medium" as const,
      },
      deal: {
        title: "Deal Won! 🎉",
        description: "Acme Corp deal closed at $50,000. Great work!",
        category: "deal" as const,
        priority: "high" as const,
        action: {
          label: "View Deal",
          onClick: () => console.log("View deal"),
        },
      },
      contact: {
        title: "New Contact Added",
        description: "Jane Smith from TechStart has been added to your contacts",
        category: "contact" as const,
        priority: "low" as const,
      },
      task: {
        title: "Task Due Soon",
        description: "Follow up with John Doe - Due in 2 hours",
        category: "task" as const,
        priority: "urgent" as const,
        action: {
          label: "Complete Task",
          onClick: () => console.log("Complete task"),
        },
      },
      message: {
        title: "New Message",
        description: "Sarah Johnson: Can we schedule a call for tomorrow?",
        category: "message" as const,
        priority: "medium" as const,
        action: {
          label: "Reply",
          onClick: () => console.log("Open message"),
        },
      },
    };

    addNotification(samples[type]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold mb-1">Notification Center</h2>
          <p className="text-sm text-muted-foreground">
            Persistent notifications with filtering and actions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="primary">{notifications.length} total</Badge>
          <Badge variant="default">{unreadCount} unread</Badge>
          <NotificationBell onClick={() => setCenterOpen(true)} />
        </div>
      </div>

      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Add Sample Notifications</CardTitle>
          <CardDescription>Test different notification types and priorities</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={() => addSampleNotification("system")} size="sm">
            System
          </Button>
          <Button onClick={() => addSampleNotification("deal")} size="sm">
            Deal
          </Button>
          <Button onClick={() => addSampleNotification("contact")} size="sm">
            Contact
          </Button>
          <Button onClick={() => addSampleNotification("task")} size="sm">
            Task
          </Button>
          <Button onClick={() => addSampleNotification("message")} size="sm">
            Message
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="size-5" />
              Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {[
                "Category filtering (system, deal, contact, etc.)",
                "Priority levels (low, medium, high, urgent)",
                "Read/unread status tracking",
                "Timestamp with relative time",
                "Action buttons for quick actions",
                "Mark all as read",
                "Clear all notifications",
                "Unread count badge",
              ].map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="size-4 text-[var(--success)] shrink-0 mt-0.5" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card variant="bordered">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="size-5" />
              Priority Colors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="size-3 rounded-full bg-gray-500" />
                <span className="text-sm">Low - Gray</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-3 rounded-full bg-blue-500" />
                <span className="text-sm">Medium - Blue</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-3 rounded-full bg-[var(--warning)]" />
                <span className="text-sm">High - Orange</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-3 rounded-full bg-[var(--error)]" />
                <span className="text-sm">Urgent - Red</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <NotificationCenter open={centerOpen} onOpenChange={setCenterOpen} />
    </div>
  );
}

/* ============================================================
 * PROGRESS INDICATORS DEMO
 * ============================================================ */

function ProgressDemo() {
  const [progress, setProgress] = React.useState(35);
  const [step, setStep] = React.useState(1);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 5));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const steps: Step[] = [
    { label: "Account", description: "Create your account" },
    { label: "Profile", description: "Setup your profile" },
    { label: "Team", description: "Invite team members" },
    { label: "Complete", description: "Start using CRM" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold mb-1">Progress Indicators</h2>
        <p className="text-sm text-muted-foreground">
          Visual feedback for loading states and multi-step processes
        </p>
      </div>

      {/* Progress Bars */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Progress Bars</CardTitle>
          <CardDescription>Linear progress indicators with variants</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ProgressBar value={progress} label="Default" showLabel />
          <ProgressBar value={75} variant="success" label="Success" showLabel />
          <ProgressBar value={50} variant="error" label="Error" showLabel />
          <ProgressBar value={90} variant="warning" label="Warning" showLabel />
          <ProgressBar value={65} variant="info" label="Info" showLabel />
          <ProgressBar value={progress} animated striped label="Animated" showLabel />
        </CardContent>
      </Card>

      {/* Circular Progress */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Circular Progress</CardTitle>
          <CardDescription>Radial progress indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-8 justify-center">
            <CircularProgress value={progress} label="Default" />
            <CircularProgress value={85} variant="success" label="Success" size={100} />
            <CircularProgress value={45} variant="error" label="Error" size={100} />
            <CircularProgress value={70} variant="warning" label="Warning" size={100} />
          </div>
        </CardContent>
      </Card>

      {/* Step Progress */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Step Progress</CardTitle>
          <CardDescription>Multi-step process indicators</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h4 className="text-sm font-medium mb-4">Horizontal</h4>
            <StepProgress steps={steps} currentStep={step} orientation="horizontal" />
            <div className="flex gap-3 mt-6">
              <Button size="sm" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
                Previous
              </Button>
              <Button
                size="sm"
                onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
                disabled={step === steps.length - 1}
              >
                Next
              </Button>
              <Button size="sm" variant="outline" onClick={() => setStep(0)}>
                Reset
              </Button>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-4">Vertical</h4>
            <StepProgress steps={steps} currentStep={step} orientation="vertical" />
          </div>
        </CardContent>
      </Card>

      {/* Loading Spinners */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Loading Spinners</CardTitle>
          <CardDescription>Indeterminate loading indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-6 items-center">
            <LoadingSpinner size="xs" />
            <LoadingSpinner size="sm" />
            <LoadingSpinner size="md" />
            <LoadingSpinner size="lg" />
            <LoadingSpinner size="xl" />
            <LoadingSpinner variant="primary" label="Loading..." />
            <LoadingSpinner variant="success" label="Processing..." />
            <LoadingSpinner variant="error" label="Error..." />
          </div>
        </CardContent>
      </Card>

      {/* Skeleton Loaders */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Skeleton Loaders</CardTitle>
          <CardDescription>Content placeholders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="text" width="80%" />
            <Skeleton variant="text" width="40%" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton variant="circular" width={48} height={48} />
            <div className="flex-1 space-y-2">
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="text" width="60%" />
            </div>
          </div>
          <Skeleton variant="rectangular" height={200} className="w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

/* ============================================================
 * MAIN SHOWCASE
 * ============================================================ */

export function ToastsShowcase() {
  return (
    <ToastProvider position="top-right" maxToasts={5}>
      <NotificationProvider maxNotifications={50}>
        <div className="w-full max-w-7xl mx-auto p-8 space-y-12">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">Toasts & Notifications</h1>
            <p className="text-muted-foreground">
              Complete notification system with toasts, notification center, and progress indicators
            </p>
          </div>

          <Tabs defaultValue="toasts" className="space-y-6">
            <TabsList>
              <TabsTrigger value="toasts">Toasts</TabsTrigger>
              <TabsTrigger value="notifications">Notification Center</TabsTrigger>
              <TabsTrigger value="progress">Progress Indicators</TabsTrigger>
            </TabsList>

            <TabsContent value="toasts">
              <ToastDemos />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationCenterDemo />
            </TabsContent>

            <TabsContent value="progress">
              <ProgressDemo />
            </TabsContent>
          </Tabs>
        </div>
      </NotificationProvider>
    </ToastProvider>
  );
}
