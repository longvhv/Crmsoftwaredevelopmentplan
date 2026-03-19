import React from "react";
import { Modal, ModalBody, ModalFooter, useModal } from "../ui/modal";
import { Drawer, DrawerBody, DrawerFooter, useDrawer } from "../ui/drawer";
import {
  ConfirmationDialog,
  AlertDialog,
  useConfirmation,
  useAlert,
} from "../ui/confirmation-dialog";
import { FormModal, MultiStepFormModal, Step } from "../ui/form-modal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../ui/enhanced-card";
import { Badge } from "../ui/badge";
import {
  MessageSquare,
  Settings,
  Bell,
  User,
  Mail,
  Lock,
  CreditCard,
  FileText,
  Image as ImageIcon,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Info,
  XCircle,
} from "lucide-react";

/* ============================================================
 * SHOWCASE COMPONENT
 * ============================================================ */

export function ModalsShowcase() {
  // Basic Modal
  const basicModal = useModal();
  
  // Size Variants
  const smallModal = useModal();
  const mediumModal = useModal();
  const largeModal = useModal();
  const fullModal = useModal();

  // Type Variants
  const defaultModal = useModal();
  const dangerModal = useModal();
  const successModal = useModal();
  const warningModal = useModal();
  const infoModal = useModal();

  // Drawers
  const rightDrawer = useDrawer();
  const leftDrawer = useDrawer();
  const topDrawer = useDrawer();
  const bottomDrawer = useDrawer();

  // Confirmation Dialogs
  const deleteConfirmation = useConfirmation({
    title: "Delete Item",
    description: "Are you sure you want to delete this item? This action cannot be undone.",
    type: "danger",
    confirmText: "Delete",
    cancelText: "Cancel",
    onConfirm: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Item deleted");
    },
  });

  const warningConfirmation = useConfirmation({
    title: "Unsaved Changes",
    description: "You have unsaved changes. Are you sure you want to leave?",
    type: "warning",
    confirmText: "Leave",
    cancelText: "Stay",
    onConfirm: () => {
      console.log("Leaving...");
    },
  });

  // Alert Dialogs
  const successAlert = useAlert({
    title: "Success!",
    description: "Your changes have been saved successfully.",
    type: "success",
    buttonText: "Got it",
  });

  const errorAlert = useAlert({
    title: "Error",
    description: "Something went wrong. Please try again later.",
    type: "danger",
    buttonText: "Close",
  });

  const infoAlert = useAlert({
    title: "New Feature",
    description: "Check out our new AI-powered insights dashboard!",
    type: "info",
    buttonText: "Learn More",
  });

  // Form Modals
  const [formModalOpen, setFormModalOpen] = React.useState(false);
  const [multiStepModalOpen, setMultiStepModalOpen] = React.useState(false);

  const handleFormSubmit = async (data: any) => {
    console.log("Form data:", data);
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  // Multi-step form steps
  const steps: Step[] = [
    {
      id: "personal",
      title: "Personal Info",
      description: "Tell us about yourself",
      content: (
        <div className="space-y-4">
          <Input label="Full Name" name="fullName" required />
          <Input label="Email" name="email" type="email" required />
          <Input label="Phone" name="phone" type="tel" />
        </div>
      ),
    },
    {
      id: "company",
      title: "Company Info",
      description: "About your organization",
      content: (
        <div className="space-y-4">
          <Input label="Company Name" name="company" required />
          <Input label="Job Title" name="jobTitle" />
          <Select name="industry">
            <SelectTrigger>
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tech">Technology</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ),
    },
    {
      id: "preferences",
      title: "Preferences",
      description: "Customize your experience",
      optional: true,
      content: (
        <div className="space-y-4">
          <Textarea label="Tell us about your goals" name="goals" rows={4} />
          <Select name="plan">
            <SelectTrigger>
              <SelectValue placeholder="Select a plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="pro">Pro</SelectItem>
              <SelectItem value="enterprise">Enterprise</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-8 space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Modals & Dialogs</h1>
        <p className="text-muted-foreground">
          Comprehensive modal system with variants, drawers, and confirmation dialogs
        </p>
      </div>

      {/* ============================================================
       * BASIC MODALS
       * ============================================================ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Basic Modals</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Standard modal dialogs with title, body, and footer
          </p>
        </div>

        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3">
              <Button onClick={basicModal.openModal}>
                Open Basic Modal
              </Button>
            </div>
          </CardContent>
        </Card>

        <Modal
          open={basicModal.open}
          onOpenChange={basicModal.setOpen}
          title="Basic Modal"
          description="This is a simple modal dialog"
        >
          <ModalBody>
            <p className="text-sm">
              This is a basic modal with a title, description, and content area.
              You can put any content here, including forms, lists, or other components.
            </p>
          </ModalBody>
          <ModalFooter>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={basicModal.closeModal}>
                Cancel
              </Button>
              <Button variant="primary" onClick={basicModal.closeModal}>
                Confirm
              </Button>
            </div>
          </ModalFooter>
        </Modal>
      </section>

      {/* ============================================================
       * MODAL SIZES
       * ============================================================ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Modal Sizes</h2>
          <p className="text-sm text-muted-foreground mt-1">
            7 size options: xs, sm, md, lg, xl, 2xl, full
          </p>
        </div>

        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3">
              <Button size="sm" onClick={smallModal.openModal}>Small (sm)</Button>
              <Button size="sm" onClick={mediumModal.openModal}>Medium (md)</Button>
              <Button size="sm" onClick={largeModal.openModal}>Large (lg)</Button>
              <Button size="sm" onClick={fullModal.openModal}>Full Screen</Button>
            </div>
          </CardContent>
        </Card>

        <Modal open={smallModal.open} onOpenChange={smallModal.setOpen} size="sm" title="Small Modal">
          <ModalBody>
            <p className="text-sm">This is a small modal (max-width: 384px)</p>
          </ModalBody>
        </Modal>

        <Modal open={mediumModal.open} onOpenChange={mediumModal.setOpen} size="md" title="Medium Modal">
          <ModalBody>
            <p className="text-sm">This is a medium modal (max-width: 448px)</p>
          </ModalBody>
        </Modal>

        <Modal open={largeModal.open} onOpenChange={largeModal.setOpen} size="lg" title="Large Modal">
          <ModalBody>
            <p className="text-sm">This is a large modal (max-width: 512px)</p>
          </ModalBody>
        </Modal>

        <Modal open={fullModal.open} onOpenChange={fullModal.setOpen} size="full" title="Full Screen Modal">
          <ModalBody>
            <p className="text-sm">This modal takes up almost the entire viewport</p>
          </ModalBody>
        </Modal>
      </section>

      {/* ============================================================
       * MODAL VARIANTS
       * ============================================================ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Modal Variants</h2>
          <p className="text-sm text-muted-foreground mt-1">
            5 variants: default, danger, success, warning, info
          </p>
        </div>

        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3">
              <Button onClick={defaultModal.openModal}>Default</Button>
              <Button onClick={dangerModal.openModal} variant="destructive">Danger</Button>
              <Button onClick={successModal.openModal} className="bg-[var(--success)] text-white hover:bg-[var(--success)]/90">Success</Button>
              <Button onClick={warningModal.openModal} className="bg-[var(--warning)] text-white hover:bg-[var(--warning)]/90">Warning</Button>
              <Button onClick={infoModal.openModal}>Info</Button>
            </div>
          </CardContent>
        </Card>

        <Modal open={defaultModal.open} onOpenChange={defaultModal.setOpen} variant="default" title="Default Modal">
          <ModalBody><p className="text-sm">Standard modal appearance</p></ModalBody>
        </Modal>

        <Modal open={dangerModal.open} onOpenChange={dangerModal.setOpen} variant="danger" title="Danger Modal">
          <ModalBody><p className="text-sm">Used for destructive actions</p></ModalBody>
        </Modal>

        <Modal open={successModal.open} onOpenChange={successModal.setOpen} variant="success" title="Success Modal">
          <ModalBody><p className="text-sm">Used for successful operations</p></ModalBody>
        </Modal>

        <Modal open={warningModal.open} onOpenChange={warningModal.setOpen} variant="warning" title="Warning Modal">
          <ModalBody><p className="text-sm">Used for warnings and cautions</p></ModalBody>
        </Modal>

        <Modal open={infoModal.open} onOpenChange={infoModal.setOpen} variant="info" title="Info Modal">
          <ModalBody><p className="text-sm">Used for informational messages</p></ModalBody>
        </Modal>
      </section>

      {/* ============================================================
       * DRAWERS
       * ============================================================ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Drawers</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Slide-in panels from any direction
          </p>
        </div>

        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3">
              <Button onClick={rightDrawer.openDrawer} className="gap-2">
                <Settings className="size-4" />
                Right Drawer
              </Button>
              <Button onClick={leftDrawer.openDrawer} className="gap-2">
                <Bell className="size-4" />
                Left Drawer
              </Button>
              <Button onClick={topDrawer.openDrawer} className="gap-2">
                <Mail className="size-4" />
                Top Drawer
              </Button>
              <Button onClick={bottomDrawer.openDrawer} className="gap-2">
                <FileText className="size-4" />
                Bottom Drawer
              </Button>
            </div>
          </CardContent>
        </Card>

        <Drawer
          open={rightDrawer.open}
          onOpenChange={rightDrawer.setOpen}
          position="right"
          title="Settings"
          description="Manage your account settings"
        >
          <DrawerBody>
            <div className="space-y-4">
              <Input label="Display Name" defaultValue="John Doe" />
              <Input label="Email" type="email" defaultValue="john@example.com" />
              <Select>
                <SelectTrigger><SelectValue placeholder="Theme" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </DrawerBody>
          <DrawerFooter>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={rightDrawer.closeDrawer}>Cancel</Button>
              <Button variant="primary" onClick={rightDrawer.closeDrawer}>Save</Button>
            </div>
          </DrawerFooter>
        </Drawer>

        <Drawer open={leftDrawer.open} onOpenChange={leftDrawer.setOpen} position="left" title="Notifications">
          <DrawerBody><p className="text-sm">Your notifications will appear here</p></DrawerBody>
        </Drawer>

        <Drawer open={topDrawer.open} onOpenChange={topDrawer.setOpen} position="top" title="Messages" size="sm">
          <DrawerBody><p className="text-sm">Quick messages preview</p></DrawerBody>
        </Drawer>

        <Drawer open={bottomDrawer.open} onOpenChange={bottomDrawer.setOpen} position="bottom" title="Details" size="md">
          <DrawerBody><p className="text-sm">Additional details and information</p></DrawerBody>
        </Drawer>
      </section>

      {/* ============================================================
       * CONFIRMATION DIALOGS
       * ============================================================ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Confirmation Dialogs</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Ask for user confirmation before important actions
          </p>
        </div>

        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3">
              <Button onClick={deleteConfirmation.confirm} variant="destructive" className="gap-2">
                <Trash2 className="size-4" />
                Delete Item
              </Button>
              <Button onClick={warningConfirmation.confirm} className="gap-2">
                <AlertTriangle className="size-4" />
                Discard Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        <deleteConfirmation.ConfirmationDialog />
        <warningConfirmation.ConfirmationDialog />
      </section>

      {/* ============================================================
       * ALERT DIALOGS
       * ============================================================ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Alert Dialogs</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Display important messages to users
          </p>
        </div>

        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3">
              <Button onClick={successAlert.showAlert} className="gap-2 bg-[var(--success)] text-white hover:bg-[var(--success)]/90">
                <CheckCircle className="size-4" />
                Success Alert
              </Button>
              <Button onClick={errorAlert.showAlert} variant="destructive" className="gap-2">
                <XCircle className="size-4" />
                Error Alert
              </Button>
              <Button onClick={infoAlert.showAlert} className="gap-2">
                <Info className="size-4" />
                Info Alert
              </Button>
            </div>
          </CardContent>
        </Card>

        <successAlert.AlertDialog />
        <errorAlert.AlertDialog />
        <infoAlert.AlertDialog />
      </section>

      {/* ============================================================
       * FORM MODALS
       * ============================================================ */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">Form Modals</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Modals optimized for forms and multi-step workflows
          </p>
        </div>

        <Card variant="bordered">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setFormModalOpen(true)}>Simple Form</Button>
              <Button onClick={() => setMultiStepModalOpen(true)}>Multi-Step Form</Button>
            </div>
          </CardContent>
        </Card>

        <FormModal
          open={formModalOpen}
          onOpenChange={setFormModalOpen}
          title="Contact Form"
          description="Send us a message"
          onSubmit={handleFormSubmit}
          submitText="Send Message"
        >
          <div className="space-y-4">
            <Input label="Name" name="name" required />
            <Input label="Email" name="email" type="email" required />
            <Textarea label="Message" name="message" rows={4} required />
          </div>
        </FormModal>

        <MultiStepFormModal
          open={multiStepModalOpen}
          onOpenChange={setMultiStepModalOpen}
          title="Complete Your Profile"
          steps={steps}
          onComplete={handleFormSubmit}
        />
      </section>

      {/* Feature Summary */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Features Summary</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "7 Sizes", icon: "📏", features: ["xs, sm, md, lg, xl, 2xl", "Full screen mode", "Responsive"] },
            { title: "5 Variants", icon: "🎨", features: ["Default, Danger, Success", "Warning, Info", "Custom icons"] },
            { title: "Drawers", icon: "📂", features: ["4 positions", "Multiple sizes", "Slide animations"] },
            { title: "Confirmations", icon: "✅", features: ["Async actions", "Loading states", "Type-safe"] },
            { title: "Alerts", icon: "🔔", features: ["Single button", "Auto-focus", "Keyboard close"] },
            { title: "Forms", icon: "📝", features: ["Multi-step wizard", "Progress indicator", "Validation"] },
          ].map((feature, index) => (
            <Card key={index} variant="bordered">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">{feature.icon}</span>
                  {feature.title}
                </CardTitle>
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
