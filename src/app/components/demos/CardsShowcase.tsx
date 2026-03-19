import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardImage,
} from "../ui/enhanced-card";
import { StatCard } from "../ui/stat-card";
import { ProfileCard } from "../ui/profile-card";
import { DealCard } from "../ui/deal-card";
import { CompanyCard } from "../ui/company-card";
import { ContactCard } from "../ui/contact-card";
import { Button } from "../ui/button";
import { unsplash_tool } from "../../tools/unsplash";
import {
  Users,
  DollarSign,
  TrendingUp,
  ShoppingCart,
  Heart,
  Share2,
  Mail,
  MessageSquare,
} from "lucide-react";

export function CardsShowcase() {
  return (
    <div className="w-full max-w-7xl mx-auto p-8 space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Card Components</h1>
        <p className="text-muted-foreground">
          Flexible card system with variants, hover effects, and specialized types
        </p>
      </div>

      {/* ============================================================
       * BASIC CARDS
       * ============================================================ */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Basic Cards</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Foundation card component with variants and features
          </p>
        </div>

        {/* Variants */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Variants</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card variant="default">
              <CardHeader>
                <CardTitle>Default Card</CardTitle>
                <CardDescription>With border and shadow</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This is the default card style with subtle shadow and border.
                </p>
              </CardContent>
            </Card>

            <Card variant="bordered">
              <CardHeader>
                <CardTitle>Bordered Card</CardTitle>
                <CardDescription>Thicker border</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This card has a prominent 2px border.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated">
              <CardHeader>
                <CardTitle>Elevated Card</CardTitle>
                <CardDescription>Larger shadow</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This card appears to float with a larger shadow.
                </p>
              </CardContent>
            </Card>

            <Card variant="flat">
              <CardHeader>
                <CardTitle>Flat Card</CardTitle>
                <CardDescription>No border or shadow</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Minimal card with no decorations.
                </p>
              </CardContent>
            </Card>

            <Card variant="interactive">
              <CardHeader>
                <CardTitle>Interactive Card</CardTitle>
                <CardDescription>Clickable with hover</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This card is clickable and shows hover effects.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Hoverable */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Hover Effects</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <Card variant="bordered" hoverable>
              <CardHeader>
                <CardTitle>Hoverable Card</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Hover over this card to see the lift effect.
                </p>
              </CardContent>
            </Card>

            <Card variant="elevated" hoverable>
              <CardHeader>
                <CardTitle>Elevated + Hover</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Combines elevated shadow with hover effect.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* With Image */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Card with Image</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <Card variant="bordered" hoverable>
              <CardImage
                src="https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=400"
                alt="Code on screen"
                className="h-48"
              />
              <CardHeader>
                <CardTitle>Product Title</CardTitle>
                <CardDescription>$99.00</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Beautiful product card with image header.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="primary" className="w-full">
                  Add to Cart
                </Button>
              </CardFooter>
            </Card>

            <Card variant="bordered" hoverable>
              <CardImage
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400"
                alt="Business"
                className="h-48"
              />
              <CardHeader>
                <CardTitle>Blog Post</CardTitle>
                <CardDescription>Published 2 days ago</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Learn how to build modern web applications.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm">
                  <Heart className="size-4 mr-2" />
                  Like
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="size-4 mr-2" />
                  Share
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Collapsible */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Collapsible Card</h3>
          <Card variant="bordered" collapsible defaultCollapsed={false}>
            <CardHeader>
              <CardTitle>Expandable Content</CardTitle>
              <CardDescription>Click header to collapse/expand</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                This card can be collapsed to save space. Click the header to toggle visibility.
              </p>
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-accent">
                  <p className="text-sm">Hidden content item 1</p>
                </div>
                <div className="p-3 rounded-lg bg-accent">
                  <p className="text-sm">Hidden content item 2</p>
                </div>
                <div className="p-3 rounded-lg bg-accent">
                  <p className="text-sm">Hidden content item 3</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Loading State */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Loading State</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <Card variant="bordered" loading />
            <Card variant="bordered" loading />
            <Card variant="bordered" loading />
          </div>
        </div>
      </section>

      {/* ============================================================
       * STAT CARDS
       * ============================================================ */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Stat Cards</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Display key metrics with trends and icons
          </p>
        </div>

        {/* Basic Stats */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Key Metrics</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Revenue"
              value="$45,231"
              trend="up"
              trendValue="+20.1%"
              description="from last month"
              icon={DollarSign}
              variant="primary"
            />
            <StatCard
              title="Active Users"
              value="2,350"
              trend="up"
              trendValue="+12.5%"
              description="from last week"
              icon={Users}
              variant="success"
            />
            <StatCard
              title="Sales"
              value="1,234"
              trend="down"
              trendValue="-4.3%"
              description="from yesterday"
              icon={ShoppingCart}
              variant="warning"
            />
            <StatCard
              title="Conversion"
              value="3.2%"
              trend="neutral"
              trendValue="0.0%"
              description="no change"
              icon={TrendingUp}
              variant="default"
            />
          </div>
        </div>

        {/* Variants */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Color Variants</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Default"
              value="1,234"
              icon={Users}
              variant="default"
            />
            <StatCard
              title="Primary"
              value="5,678"
              icon={DollarSign}
              variant="primary"
            />
            <StatCard
              title="Success"
              value="9,012"
              icon={TrendingUp}
              variant="success"
            />
            <StatCard
              title="Warning"
              value="345"
              icon={ShoppingCart}
              variant="warning"
            />
          </div>
        </div>
      </section>

      {/* ============================================================
       * PROFILE CARDS
       * ============================================================ */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Profile Cards</h2>
          <p className="text-sm text-muted-foreground mt-1">
            User profile displays with different layouts
          </p>
        </div>

        {/* Compact Variant */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Compact Layout</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <ProfileCard
              variant="compact"
              name="John Doe"
              role="Software Engineer"
              avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=john"
              status="online"
              actions={
                <Button variant="ghost" size="sm">
                  <MessageSquare className="size-4" />
                </Button>
              }
            />
            <ProfileCard
              variant="compact"
              name="Jane Smith"
              role="Product Manager"
              status="busy"
              actions={
                <Button variant="ghost" size="sm">
                  <Mail className="size-4" />
                </Button>
              }
            />
          </div>
        </div>

        {/* Default Variant */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Default Layout</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <ProfileCard
              name="Alice Johnson"
              role="UX Designer"
              company="Design Co"
              avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=alice"
              status="online"
              tags={["Design", "Figma", "UI/UX"]}
              actions={
                <div className="flex gap-2 w-full">
                  <Button variant="primary" size="sm" className="flex-1">
                    Message
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    View
                  </Button>
                </div>
              }
            />
            <ProfileCard
              name="Bob Williams"
              role="Backend Developer"
              company="Tech Startup"
              status="away"
              tags={["Node.js", "Python", "AWS"]}
              actions={
                <div className="flex gap-2 w-full">
                  <Button variant="primary" size="sm" className="flex-1">
                    Connect
                  </Button>
                </div>
              }
            />
          </div>
        </div>

        {/* Detailed Variant */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Detailed Layout</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <ProfileCard
              variant="detailed"
              name="Sarah Chen"
              role="Senior Developer"
              company="Acme Corp"
              avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=sarah"
              coverImage="https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=400"
              email="sarah.chen@example.com"
              phone="+1 (555) 123-4567"
              location="San Francisco, CA"
              status="online"
              tags={["React", "TypeScript", "GraphQL"]}
              actions={
                <div className="flex gap-2 w-full">
                  <Button variant="primary" size="sm" className="flex-1">
                    <Mail className="size-4 mr-2" />
                    Email
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    View Profile
                  </Button>
                </div>
              }
            />
          </div>
        </div>
      </section>

      {/* ============================================================
       * DEAL CARDS
       * ============================================================ */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Deal Cards</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Sales pipeline deal tracking
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DealCard
            title="Enterprise Software License"
            value={125000}
            stage="Negotiation"
            probability={75}
            priority="high"
            closeDate={new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)}
            company="Acme Corp"
            daysInStage={12}
            owner={{
              name: "John Doe",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
            }}
          />

          <DealCard
            title="Marketing Campaign Package"
            value={45000}
            stage="Proposal"
            probability={50}
            priority="medium"
            closeDate={new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)}
            company="Marketing Inc"
            daysInStage={5}
            owner={{
              name: "Jane Smith",
            }}
          />

          <DealCard
            title="Website Redesign Project"
            value={35000}
            stage="Discovery"
            probability={25}
            priority="low"
            closeDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
            company="Design Studio"
            daysInStage={3}
            owner={{
              name: "Bob Wilson",
              avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
            }}
          />
        </div>
      </section>

      {/* ============================================================
       * COMPANY CARDS
       * ============================================================ */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Company Cards</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Company profiles with ICP scoring
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <CompanyCard
            name="Acme Corporation"
            industry="Technology"
            size="500-1000"
            revenue="$50M-$100M"
            location="San Francisco, CA"
            website="https://acme.com"
            icpScore={92}
            stats={{
              contacts: 24,
              deals: 8,
              value: 450000,
            }}
            tags={["Enterprise", "SaaS", "B2B"]}
            actions={
              <div className="flex gap-2 w-full">
                <Button variant="primary" size="sm" className="flex-1">
                  View Details
                </Button>
              </div>
            }
          />

          <CompanyCard
            name="Tech Startup Inc"
            industry="Software"
            size="50-100"
            revenue="$10M-$50M"
            location="Austin, TX"
            website="https://techstartup.io"
            icpScore={68}
            stats={{
              contacts: 12,
              deals: 3,
              value: 125000,
            }}
            tags={["Startup", "Mobile"]}
            actions={
              <div className="flex gap-2 w-full">
                <Button variant="outline" size="sm" className="flex-1">
                  Contact
                </Button>
              </div>
            }
          />

          <CompanyCard
            name="Global Enterprises"
            industry="Manufacturing"
            size="10000+"
            revenue="$1B+"
            location="New York, NY"
            website="https://globalent.com"
            icpScore={45}
            stats={{
              contacts: 8,
              deals: 2,
              value: 80000,
            }}
            tags={["Enterprise", "Manufacturing", "Global"]}
          />
        </div>
      </section>

      {/* ============================================================
       * CONTACT CARDS
       * ============================================================ */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Contact Cards</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Contact information with lead scoring
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <ContactCard
            name="Michael Brown"
            title="VP of Sales"
            company="Acme Corp"
            avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=michael"
            email="michael.brown@acme.com"
            phone="+1 (555) 987-6543"
            location="San Francisco, CA"
            leadScore={95}
            status="hot"
            tags={["Decision Maker", "Enterprise"]}
            actions={
              <div className="flex gap-2 w-full">
                <Button variant="primary" size="sm" className="flex-1">
                  <Mail className="size-4 mr-2" />
                  Email
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Call
                </Button>
              </div>
            }
          />

          <ContactCard
            name="Emily Davis"
            title="Marketing Manager"
            company="Tech Startup"
            email="emily@techstartup.io"
            phone="+1 (555) 246-8101"
            leadScore={72}
            status="active"
            tags={["Marketing", "Influencer"]}
            actions={
              <div className="flex gap-2 w-full">
                <Button variant="outline" size="sm" className="flex-1">
                  View Profile
                </Button>
              </div>
            }
          />

          <ContactCard
            name="David Lee"
            title="Software Engineer"
            company="Design Co"
            avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=david"
            email="david.lee@design.co"
            leadScore={48}
            status="new"
            tags={["Technical", "Developer"]}
          />
        </div>
      </section>
    </div>
  );
}
