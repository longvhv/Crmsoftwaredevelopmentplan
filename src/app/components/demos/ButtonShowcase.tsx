import React from "react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { IconButton } from "../ui/icon-button";
import { ButtonBadge } from "../ui/button-badge";
import { SplitButton } from "../ui/split-button";
import { FAB } from "../ui/fab";
import {
  Plus,
  Download,
  Upload,
  Save,
  Trash2,
  Edit,
  Search,
  Star,
  Heart,
  Mail,
  Bell,
  Settings,
  Sparkles,
} from "lucide-react";

export function ButtonShowcase() {
  const [loading, setLoading] = React.useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto p-8 space-y-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Button System</h1>
        <p className="text-muted-foreground">
          Comprehensive button components with violet AI-first branding
        </p>
      </div>

      {/* Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button variant="default">Default</Button>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="outline-primary">Outline Primary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="ai" leftIcon={<Sparkles />}>
            AI Action
          </Button>
          <Button variant="gradient">Gradient</Button>
        </div>
      </section>

      {/* Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Sizes</h2>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
        </div>
      </section>

      {/* Shapes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Shapes</h2>
        <div className="flex flex-wrap gap-4">
          <Button shape="default">Default</Button>
          <Button shape="pill">Pill Shape</Button>
          <Button shape="square">Square</Button>
        </div>
      </section>

      {/* With Icons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">With Icons</h2>
        <div className="flex flex-wrap gap-4">
          <Button leftIcon={<Plus />}>Create New</Button>
          <Button rightIcon={<Download />}>Download</Button>
          <Button leftIcon={<Upload />} rightIcon={<Star />}>
            Both Sides
          </Button>
          <Button variant="outline" leftIcon={<Search />}>
            Search
          </Button>
          <Button variant="ai" leftIcon={<Sparkles />}>
            AI Generate
          </Button>
        </div>
      </section>

      {/* States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">States</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Default</Button>
          <Button disabled>Disabled</Button>
          <Button loading={loading} onClick={() => setLoading(!loading)}>
            {loading ? "Loading..." : "Click to Load"}
          </Button>
          <Button variant="success" leftIcon={<Star />}>
            Hover Me
          </Button>
          <Button variant="outline">Focus Me</Button>
        </div>
      </section>

      {/* Icon Buttons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Icon Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <IconButton icon={<Edit />} label="Edit" size="xs" />
          <IconButton icon={<Save />} label="Save" size="sm" />
          <IconButton icon={<Trash2 />} label="Delete" variant="destructive" />
          <IconButton icon={<Star />} label="Favorite" variant="outline" size="lg" />
          <IconButton
            icon={<Sparkles />}
            label="AI Action"
            variant="ai"
            size="xl"
          />
        </div>
      </section>

      {/* Button Groups */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Button Groups</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Attached Horizontal</p>
            <ButtonGroup>
              <Button variant="outline">Left</Button>
              <Button variant="outline">Middle</Button>
              <Button variant="outline">Right</Button>
            </ButtonGroup>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Detached Horizontal</p>
            <ButtonGroup attached={false}>
              <Button>Option 1</Button>
              <Button>Option 2</Button>
              <Button>Option 3</Button>
            </ButtonGroup>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Vertical</p>
            <ButtonGroup orientation="vertical">
              <Button variant="outline">Top</Button>
              <Button variant="outline">Middle</Button>
              <Button variant="outline">Bottom</Button>
            </ButtonGroup>
          </div>
        </div>
      </section>

      {/* Split Buttons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Split Buttons</h2>
        <div className="flex flex-wrap gap-4">
          <SplitButton
            onMainClick={() => alert("Save clicked")}
            options={[
              { label: "Save as Draft", value: "draft", onSelect: () => alert("Draft") },
              { label: "Save as Template", value: "template", onSelect: () => alert("Template") },
            ]}
          >
            Save
          </SplitButton>
          <SplitButton
            variant="secondary"
            onMainClick={() => alert("Export clicked")}
            options={[
              { label: "Export as PDF", value: "pdf", icon: <Download /> },
              { label: "Export as CSV", value: "csv", icon: <Download /> },
              { label: "Export as JSON", value: "json", icon: <Download /> },
            ]}
          >
            Export
          </SplitButton>
        </div>
      </section>

      {/* Button with Badge */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Button with Badge</h2>
        <div className="flex flex-wrap gap-4">
          <ButtonBadge badgeContent={3} leftIcon={<Bell />}>
            Notifications
          </ButtonBadge>
          <ButtonBadge
            badgeContent={99}
            badgePosition="top-left"
            variant="outline"
            leftIcon={<Mail />}
          >
            Messages
          </ButtonBadge>
          <ButtonBadge
            badgeContent="NEW"
            badgeVariant="success"
            badgePosition="inline-right"
            variant="ai"
            leftIcon={<Sparkles />}
          >
            AI Features
          </ButtonBadge>
          <ButtonBadge
            badgeContent={5}
            badgePosition="inline-left"
            badgeVariant="warning"
            variant="ghost"
            leftIcon={<Heart />}
          >
            Favorites
          </ButtonBadge>
        </div>
      </section>

      {/* FAB - Floating Action Button */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Floating Action Buttons</h2>
        <p className="text-sm text-muted-foreground">
          Note: FABs are positioned fixed in the viewport. Scroll down to see them.
        </p>
        <div className="relative h-96 bg-accent/20 rounded-lg border-2 border-dashed border-border overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground">Scroll area - FABs are fixed</p>
          </div>
          <FAB icon={<Plus />} label="Add new item" />
          <FAB
            icon={<Settings />}
            label="Settings"
            variant="secondary"
            position="bottom-left"
          />
          <FAB
            icon={<Sparkles />}
            label="AI Assistant"
            variant="ai"
            position="top-right"
          />
          <FAB
            variant="white"
            size="extended"
            icon={<Plus />}
            label="Create New"
            position="top-left"
          />
        </div>
      </section>

      {/* Loading States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Loading States</h2>
        <div className="flex flex-wrap gap-4">
          <Button loading>Loading Default</Button>
          <Button variant="secondary" loading>
            Loading Secondary
          </Button>
          <Button variant="outline" loading leftIcon={<Save />}>
            Saving...
          </Button>
          <Button variant="ai" loading>
            AI Processing
          </Button>
        </div>
      </section>
    </div>
  );
}
