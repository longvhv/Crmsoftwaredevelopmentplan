import * as React from "react";
import { EnhancedBreadcrumb, CompactBreadcrumb } from "../components/ui/enhanced-breadcrumb";
import { AdvancedPagination, SimplePagination, LoadMorePagination } from "../components/ui/advanced-pagination";
import { EnhancedTabs, ScrollableTabs, SegmentedControl } from "../components/ui/enhanced-tabs";
import { Stepper } from "../components/ui/stepper";
import { BackToTop, ScrollProgress, ScrollIndicator } from "../components/ui/back-to-top";
import { Home, FolderOpen, FileText, Settings, User, Bell, LayoutDashboard, Package } from "lucide-react";

/**
 * NAVIGATION COMPONENTS SHOWCASE
 * Phase 2.3: Steps 96-107 - Advanced navigation components
 */

export default function NavigationShowcase() {
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(10);
  const [activeTab, setActiveTab] = React.useState("overview");
  const [segmentValue, setSegmentValue] = React.useState("all");
  const [currentStep, setCurrentStep] = React.useState(0);

  // Breadcrumb data
  const breadcrumbItems = [
    { label: "Dashboard", href: "/", icon: <Home className="w-4 h-4" /> },
    { label: "Projects", href: "/projects", icon: <FolderOpen className="w-4 h-4" /> },
    { label: "Website Redesign", href: "/projects/1" },
    { label: "Documentation", icon: <FileText className="w-4 h-4" /> },
  ];

  // Tab data
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: <LayoutDashboard className="w-4 h-4" />,
      content: <div className="p-4 border rounded-lg">Overview content goes here</div>,
    },
    {
      id: "products",
      label: "Products",
      icon: <Package className="w-4 h-4" />,
      badge: 12,
      content: <div className="p-4 border rounded-lg">Products content goes here</div>,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-4 h-4" />,
      content: <div className="p-4 border rounded-lg">Settings content goes here</div>,
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell className="w-4 h-4" />,
      badge: 3,
      closeable: true,
      content: <div className="p-4 border rounded-lg">Notifications content goes here</div>,
    },
  ];

  // Stepper data
  const steps = [
    {
      id: "personal",
      label: "Personal Info",
      description: "Enter your basic information",
    },
    {
      id: "account",
      label: "Account Details",
      description: "Set up your account credentials",
    },
    {
      id: "preferences",
      label: "Preferences",
      description: "Customize your experience",
      optional: true,
    },
    {
      id: "review",
      label: "Review & Submit",
      description: "Confirm your information",
    },
  ];

  // Scroll sections
  const sections = [
    { id: "breadcrumbs", label: "Breadcrumbs" },
    { id: "pagination", label: "Pagination" },
    { id: "tabs", label: "Tabs" },
    { id: "steppers", label: "Steppers" },
    { id: "scroll-controls", label: "Scroll Controls" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Scroll Progress */}
      <ScrollProgress position="top" height={3} />

      {/* Scroll Indicator */}
      <ScrollIndicator sections={sections} position="right" />

      {/* Back to Top */}
      <BackToTop showAt={200} />

      <div className="max-w-7xl mx-auto p-8 space-y-16">
        {/* Header */}
        <div className="border-b pb-6">
          <h1 className="text-4xl font-bold mb-2">Navigation Components</h1>
          <p className="text-muted-foreground">
            Phase 2.3: Steps 96-107 - Advanced navigation and scroll components
          </p>
        </div>

        {/* Breadcrumbs Section */}
        <section id="breadcrumbs" className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Breadcrumbs</h2>
            <p className="text-muted-foreground">Step 96: Enhanced breadcrumb navigation</p>
          </div>

          <div className="space-y-6">
            {/* Enhanced Breadcrumb */}
            <div className="p-6 border rounded-lg space-y-3">
              <h3 className="font-semibold">Enhanced Breadcrumb</h3>
              <EnhancedBreadcrumb
                items={breadcrumbItems}
                showHome
                maxItems={4}
                onItemClick={(item, index) => console.log("Clicked:", item, index)}
              />
            </div>

            {/* Compact Breadcrumb */}
            <div className="p-6 border rounded-lg space-y-3">
              <h3 className="font-semibold">Compact Breadcrumb (Mobile)</h3>
              <CompactBreadcrumb
                items={breadcrumbItems}
                onBack={() => console.log("Back clicked")}
              />
            </div>

            {/* Long Breadcrumb with Collapse */}
            <div className="p-6 border rounded-lg space-y-3">
              <h3 className="font-semibold">Long Breadcrumb with Auto-Collapse</h3>
              <EnhancedBreadcrumb
                items={[
                  { label: "Home", href: "/" },
                  { label: "Category 1", href: "/cat1" },
                  { label: "Category 2", href: "/cat2" },
                  { label: "Category 3", href: "/cat3" },
                  { label: "Subcategory", href: "/sub" },
                  { label: "Product", href: "/product" },
                  { label: "Details" },
                ]}
                maxItems={4}
              />
            </div>
          </div>
        </section>

        {/* Pagination Section */}
        <section id="pagination" className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Pagination</h2>
            <p className="text-muted-foreground">Step 97: Advanced pagination controls</p>
          </div>

          <div className="space-y-6">
            {/* Advanced Pagination */}
            <div className="p-6 border rounded-lg space-y-3">
              <h3 className="font-semibold">Advanced Pagination (Full Features)</h3>
              <AdvancedPagination
                currentPage={currentPage}
                totalPages={20}
                pageSize={pageSize}
                totalItems={200}
                pageSizeOptions={[10, 20, 50, 100]}
                showPageSizeSelect
                showQuickJumper
                showInfo
                onPageChange={setCurrentPage}
                onPageSizeChange={setPageSize}
              />
            </div>

            {/* Simple Pagination */}
            <div className="p-6 border rounded-lg space-y-3">
              <h3 className="font-semibold">Simple Pagination (Mobile)</h3>
              <SimplePagination
                currentPage={currentPage}
                totalPages={20}
                onPageChange={setCurrentPage}
              />
            </div>

            {/* Load More */}
            <div className="p-6 border rounded-lg space-y-3">
              <h3 className="font-semibold">Load More Pagination</h3>
              <LoadMorePagination
                hasMore={currentPage < 10}
                loadedItems={currentPage * 10}
                totalItems={100}
                onLoadMore={() => setCurrentPage((p) => p + 1)}
              />
            </div>
          </div>
        </section>

        {/* Tabs Section */}
        <section id="tabs" className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Tabs</h2>
            <p className="text-muted-foreground">Step 98: Enhanced tab navigation</p>
          </div>

          <div className="space-y-6">
            {/* Default Tabs */}
            <div className="p-6 border rounded-lg space-y-3">
              <h3 className="font-semibold">Default Tabs</h3>
              <EnhancedTabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                variant="default"
              />
            </div>

            {/* Pills Tabs */}
            <div className="p-6 border rounded-lg space-y-3">
              <h3 className="font-semibold">Pills Tabs</h3>
              <EnhancedTabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                variant="pills"
              />
            </div>

            {/* Underline Tabs */}
            <div className="p-6 border rounded-lg space-y-3">
              <h3 className="font-semibold">Underline Tabs</h3>
              <EnhancedTabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                variant="underline"
              />
            </div>

            {/* Scrollable Tabs */}
            <div className="p-6 border rounded-lg space-y-3">
              <h3 className="font-semibold">Scrollable Tabs</h3>
              <ScrollableTabs
                tabs={[...tabs, ...tabs, ...tabs]}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
            </div>

            {/* Segmented Control */}
            <div className="p-6 border rounded-lg space-y-3">
              <h3 className="font-semibold">Segmented Control</h3>
              <SegmentedControl
                options={[
                  { value: "all", label: "All" },
                  { value: "active", label: "Active" },
                  { value: "archived", label: "Archived" },
                ]}
                value={segmentValue}
                onChange={setSegmentValue}
              />
            </div>

            {/* Vertical Tabs */}
            <div className="p-6 border rounded-lg space-y-3">
              <h3 className="font-semibold">Vertical Tabs</h3>
              <EnhancedTabs
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                orientation="vertical"
                variant="default"
              />
            </div>
          </div>
        </section>

        {/* Steppers Section */}
        <section id="steppers" className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold mb-2">Steppers</h2>
            <p className="text-muted-foreground">Step 99: Multi-step progress indicators</p>
          </div>

          <div className="space-y-6">
            {/* Default Stepper */}
            <div className="p-6 border rounded-lg space-y-4">
              <h3 className="font-semibold">Default Stepper</h3>
              <Stepper
                steps={steps}
                currentStep={currentStep}
                variant="default"
                orientation="horizontal"
                onStepClick={setCurrentStep}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentStep((s) => Math.max(0, s - 1))}
                  disabled={currentStep === 0}
                  className="px-4 py-2 border rounded hover:bg-muted disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => setCurrentStep((s) => Math.min(steps.length - 1, s + 1))}
                  disabled={currentStep === steps.length - 1}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>

            {/* Circle Stepper */}
            <div className="p-6 border rounded-lg space-y-4">
              <h3 className="font-semibold">Circle Stepper</h3>
              <Stepper
                steps={steps}
                currentStep={currentStep}
                variant="circles"
                orientation="horizontal"
                onStepClick={setCurrentStep}
              />
            </div>

            {/* Dot Stepper */}
            <div className="p-6 border rounded-lg space-y-4">
              <h3 className="font-semibold">Dot Stepper (Minimal)</h3>
              <Stepper
                steps={steps}
                currentStep={currentStep}
                variant="dots"
                onStepClick={setCurrentStep}
              />
            </div>

            {/* Number Stepper */}
            <div className="p-6 border rounded-lg space-y-4">
              <h3 className="font-semibold">Number Stepper</h3>
              <Stepper
                steps={steps}
                currentStep={currentStep}
                variant="numbers"
                orientation="horizontal"
                onStepClick={setCurrentStep}
              />
            </div>

            {/* Vertical Stepper */}
            <div className="p-6 border rounded-lg space-y-4">
              <h3 className="font-semibold">Vertical Stepper</h3>
              <Stepper
                steps={steps}
                currentStep={currentStep}
                variant="default"
                orientation="vertical"
                onStepClick={setCurrentStep}
              />
            </div>
          </div>
        </section>

        {/* Scroll Controls Section */}
        <section id="scroll-controls" className="space-y-6 pb-32">
          <div>
            <h2 className="text-3xl font-bold mb-2">Scroll Controls</h2>
            <p className="text-muted-foreground">Step 100-107: Back to top, progress, and indicators</p>
          </div>

          <div className="space-y-6">
            <div className="p-6 border rounded-lg space-y-3">
              <h3 className="font-semibold">Active Components</h3>
              <ul className="list-disc pl-6 space-y-2 text-sm text-muted-foreground">
                <li>Scroll Progress Bar (Top of page)</li>
                <li>Scroll Indicator (Right side)</li>
                <li>Back to Top Button (Bottom right, visible after scrolling)</li>
              </ul>
            </div>

            {/* Spacer for scroll testing */}
            <div className="p-6 border rounded-lg space-y-3">
              <h3 className="font-semibold">Scroll Test Area</h3>
              <p className="text-muted-foreground">
                Scroll down to see the Back to Top button appear and test the scroll indicators.
              </p>
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="p-4 bg-muted rounded">
                  Sample content block {i + 1}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="border-t pt-8">
          <h2 className="text-2xl font-bold mb-4">Phase 2.3 Complete ✓</h2>
          <p className="text-muted-foreground mb-4">
            All navigation components implemented (Steps 96-107):
          </p>
          <ul className="grid grid-cols-2 gap-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Enhanced Breadcrumb
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Command Palette
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Mega Menu
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Contextual Navigation
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Advanced Pagination
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Enhanced Tabs
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Stepper
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Scroll Progress
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Floating Action Button
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Speed Dial
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Back to Top
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span> Scroll Indicator
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}