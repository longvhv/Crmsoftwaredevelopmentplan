import * as React from 'react';
import { Link } from 'react-router';

/**
 * DATA DISPLAY COMPONENTS SHOWCASE
 * Demonstrates all Phase 2.2 components (Steps 81-95)
 */

export default function DataDisplayShowcase() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="border-b pb-6">
          <h1 className="text-4xl font-bold mb-2">Data Display Components</h1>
          <p className="text-muted-foreground">
            Phase 2.2: Steps 81-95 - Advanced data visualization and display components
          </p>
          <div className="mt-4 flex gap-2">
            <Link to="/showcase" className="text-sm text-primary hover:underline">
              ← Back to Main Showcase
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/showcase/navigation" className="text-sm text-primary hover:underline">
              Navigation Components →
            </Link>
          </div>
        </div>

        {/* Component List */}
        <div className="grid gap-6">
          <ComponentCard
            title="Progress Indicators"
            description="Linear, circular, stepped, and segmented progress displays"
            step="91"
          />
          
          <ComponentCard
            title="Data Widgets"
            description="Gauges, heatmaps, radial progress, and activity grids"
            step="92"
          />
          
          <ComponentCard
            title="Comparison Tables"
            description="Side-by-side comparisons, diff viewers, and metric tables"
            step="93"
          />
          
          <ComponentCard
            title="Pricing Tables"
            description="Product pricing displays with plans and features"
            step="94"
          />
          
          <ComponentCard
            title="Feature Matrix"
            description="Product comparison matrices and feature checklists"
            step="95"
          />
        </div>
      </div>
    </div>
  );
}

interface ComponentCardProps {
  title: string;
  description: string;
  step: string;
}

function ComponentCard({ title, description, step }: ComponentCardProps) {
  return (
    <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
          Step {step}
        </span>
      </div>
    </div>
  );
}