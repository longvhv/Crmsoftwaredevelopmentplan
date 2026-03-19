import * as React from "react";
import { Link } from "react-router";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

/**
 * PROGRESS DASHBOARD
 * Track development progress for CRM component library
 */

export function ProgressDashboard() {
  const phases = [
    {
      id: "phase-0",
      name: "Phase 0: Foundation & Planning",
      steps: "1-25",
      status: "complete" as const,
      description: "Strategic planning, architecture design, tech stack setup",
    },
    {
      id: "phase-1",
      name: "Phase 1: Core Infrastructure",
      steps: "26-64",
      status: "complete" as const,
      description: "Backend services, database, authentication, base CRM entities",
    },
    {
      id: "phase-2-1",
      name: "Phase 2.1: Form Components",
      steps: "65-80",
      status: "complete" as const,
      description: "16 advanced form components: Input, Select, Date, File Upload, etc.",
      link: "/showcase/forms",
    },
    {
      id: "phase-2-2",
      name: "Phase 2.2: Data Display Components",
      steps: "81-95",
      status: "complete" as const,
      description: "15 data display components: Cards, Tables, Charts, Stats, etc.",
      link: "/showcase/data-display",
    },
    {
      id: "phase-2-3",
      name: "Phase 2.3: Navigation Components",
      steps: "96-107",
      status: "complete" as const,
      description: "12 navigation components: Breadcrumb, Tabs, Stepper, Pagination, etc.",
      link: "/showcase/navigation",
    },
    {
      id: "phase-2-4",
      name: "Phase 2.4: Feedback & Overlay Components",
      steps: "108-120",
      status: "complete" as const,
      description: "13 components: Advanced modals, notifications, alerts, tooltips, popovers",
      link: "/showcase/feedback",
    },
    {
      id: "phase-3",
      name: "Phase 3: Enhanced CRM Core Pages",
      steps: "121-300",
      status: "upcoming" as const,
      description: "180 bước: Contacts, Companies, Deals, Activities nâng cao với CRUD đầy đủ, AI features",
      link: "/detailed-plan?phase=3",
    },
    {
      id: "phase-4",
      name: "Phase 4: Advanced CRM Features",
      steps: "301-550",
      status: "upcoming" as const,
      description: "250 bước: Pipeline, Marketing Automation, Workflow, Analytics, Integrations, Mobile",
      link: "/detailed-plan?phase=4",
    },
    {
      id: "phase-5",
      name: "Phase 5: AI Integration & World-Class",
      steps: "551-850",
      status: "upcoming" as const,
      description: "300 bước: AI Agents, Conversational UI, Predictive Analytics, Advanced Search, Scale",
      link: "/detailed-plan?phase=5",
    },
  ];

  const completedPhases = phases.filter((p) => p.status === "complete").length;
  const totalPhases = phases.length;
  const progressPercentage = Math.round((completedPhases / totalPhases) * 100);

  // Step progress
  const currentStep = 120;
  const totalSteps = 850;
  const stepProgress = ((currentStep / totalSteps) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b pb-6">
          <h1 className="text-4xl font-bold mb-2">Development Progress</h1>
          <p className="text-muted-foreground">
            CRM Component Library & Application Development Tracker
          </p>
        </div>

        {/* Overall Progress */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="p-6 border rounded-lg bg-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Phase Progress</h2>
              <span className="text-3xl font-bold text-primary">{progressPercentage}%</span>
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              {completedPhases} of {totalPhases} phases completed
            </p>
          </div>

          <div className="p-6 border rounded-lg bg-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Step Progress</h2>
              <span className="text-3xl font-bold text-primary">{stepProgress}%</span>
            </div>
            <div className="h-4 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all duration-500"
                style={{ width: `${stepProgress}%` }}
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
        </div>

        {/* Phase Details */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Phase Breakdown</h2>

          {phases.map((phase) => (
            <div
              key={phase.id}
              className="border rounded-lg p-6 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Status Icon */}
                <div className="flex-shrink-0 mt-1">
                  {phase.status === "complete" ? (
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{phase.name}</h3>
                    <span className="px-3 py-1 bg-muted rounded-full text-sm">
                      Steps {phase.steps}
                    </span>
                  </div>

                  <p className="text-muted-foreground">{phase.description}</p>

                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        phase.status === "complete"
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {phase.status === "complete" ? "✓ Complete" : "Upcoming"}
                    </span>

                    {phase.link && (
                      <Link
                        to={phase.link}
                        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                      >
                        View Components
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="border-t pt-8 space-y-4">
          <h2 className="text-2xl font-bold">Quick Links</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link
              to="/showcase"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <h3 className="font-semibold mb-1">Core Components</h3>
              <p className="text-sm text-muted-foreground">
                Empty states, loading, search, filters, pagination
              </p>
            </Link>

            <Link
              to="/showcase/forms"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <h3 className="font-semibold mb-1">Form Components</h3>
              <p className="text-sm text-muted-foreground">
                Advanced form inputs and validation
              </p>
            </Link>

            <Link
              to="/showcase/data-display"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <h3 className="font-semibold mb-1">Data Display</h3>
              <p className="text-sm text-muted-foreground">
                Tables, charts, timelines, and visualizations
              </p>
            </Link>

            <Link
              to="/showcase/navigation"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <h3 className="font-semibold mb-1">Navigation</h3>
              <p className="text-sm text-muted-foreground">
                Breadcrumbs, tabs, steppers, and scroll controls
              </p>
            </Link>

            <Link
              to="/showcase/feedback"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <h3 className="font-semibold mb-1">Feedback & Overlay</h3>
              <p className="text-sm text-muted-foreground">
                Modals, notifications, alerts, tooltips, and popovers
              </p>
            </Link>

            <Link
              to="/crm/leads"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <h3 className="font-semibold mb-1">Leads Page (Demo)</h3>
              <p className="text-sm text-muted-foreground">
                Full CRUD implementation with all features
              </p>
            </Link>

            <Link
              to="/dev-plan"
              className="p-4 border rounded-lg hover:bg-muted transition-colors"
            >
              <h3 className="font-semibold mb-1">Development Plan</h3>
              <p className="text-sm text-muted-foreground">
                Detailed roadmap and technical specifications
              </p>
            </Link>
          </div>
        </div>

        {/* Next Steps */}
        <div className="border rounded-lg p-6 bg-green-50 dark:bg-green-950">
          <h2 className="text-xl font-bold mb-4">✅ Phase 2 Complete!</h2>
          <div className="space-y-2">
            <p className="font-medium">All Phase 2 Components Completed (Steps 65-120)</p>
            <p className="text-sm text-muted-foreground">
              Successfully implemented 56 advanced UI components across 4 categories:
              Form Components, Data Display, Navigation, and Feedback & Overlay.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              <strong>Next:</strong> Phase 3 will focus on building enhanced CRM pages with full CRUD
              operations, advanced features, and AI integration.
            </p>
            <div className="flex gap-4 mt-4">
              <Link
                to="/detailed-plan-overview"
                className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
              >
                📘 Xem Kế Hoạch Chi Tiết 850 Bước
              </Link>
              <Link
                to="/detailed-plan"
                className="px-4 py-2 border rounded hover:bg-muted transition-colors"
              >
                📊 Xem Detailed Plan Interactive
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}