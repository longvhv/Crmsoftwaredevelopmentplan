import React from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Switch } from "../ui/switch";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import {
  Mail,
  Lock,
  Search,
  User,
  DollarSign,
  Calendar,
  Phone,
  Globe,
} from "lucide-react";

export function FormShowcase() {
  const [switchValue, setSwitchValue] = React.useState(false);
  const [sliderValue, setSliderValue] = React.useState<number>(50);

  return (
    <div className="w-full max-w-7xl mx-auto p-8 space-y-12">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Form Components</h1>
        <p className="text-muted-foreground">
          Comprehensive form system with violet AI-first branding
        </p>
      </div>

      {/* Input - Basic */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Input - Basic</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input placeholder="Default input" />
          <Input placeholder="With label" label="Email" />
          <Input placeholder="Required field" label="Username" required />
          <Input placeholder="Optional field" label="Nickname" optional />
        </div>
      </section>

      {/* Input - Variants */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Input - Variants</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input variant="default" placeholder="Default variant" />
          <Input variant="filled" placeholder="Filled variant" />
          <Input variant="outlined" placeholder="Outlined variant" />
          <Input variant="ghost" placeholder="Ghost variant" />
        </div>
      </section>

      {/* Input - Sizes */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Input - Sizes</h2>
        <div className="grid gap-4">
          <Input inputSize="xs" placeholder="Extra small" />
          <Input inputSize="sm" placeholder="Small" />
          <Input inputSize="md" placeholder="Medium (default)" />
          <Input inputSize="lg" placeholder="Large" />
          <Input inputSize="xl" placeholder="Extra large" />
        </div>
      </section>

      {/* Input - With Icons */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Input - With Icons</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input leftIcon={<Mail />} placeholder="Email address" />
          <Input leftIcon={<Lock />} type="password" placeholder="Password" />
          <Input leftIcon={<Search />} placeholder="Search..." />
          <Input leftIcon={<User />} rightIcon={<Calendar />} placeholder="Both sides" />
        </div>
      </section>

      {/* Input - With Prefix/Suffix */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Input - Prefix/Suffix</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Input prefix="https://" placeholder="example.com" />
          <Input suffix=".com" placeholder="domain" />
          <Input prefix="$" placeholder="0.00" type="number" />
          <Input placeholder="username" suffix="@company.com" />
        </div>
      </section>

      {/* Input - States */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Input - States</h2>
        <div className="grid gap-4">
          <Input
            error="Email is required"
            placeholder="Email"
            label="Email"
            required
          />
          <Input
            success="Username is available"
            placeholder="Username"
            label="Username"
          />
          <Input
            warning="Password strength: weak"
            type="password"
            placeholder="Password"
            label="Password"
          />
          <Input
            placeholder="Disabled input"
            label="Disabled"
            disabled
          />
        </div>
      </section>

      {/* Input - Clearable & Character Count */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Input - Features</h2>
        <div className="grid gap-4">
          <Input
            clearable
            placeholder="Clearable input"
            label="Clearable"
            defaultValue="Clear me"
          />
          <Input
            showCount
            maxLength={50}
            placeholder="Tweet something..."
            label="Character Count"
          />
          <Input
            showCount
            clearable
            maxLength={100}
            placeholder="Both features"
            label="Combined"
            helperText="Max 100 characters"
          />
        </div>
      </section>

      {/* Textarea */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Textarea</h2>
        <div className="grid gap-4">
          <Textarea placeholder="Default textarea" />
          <Textarea
            placeholder="With label and helper"
            label="Description"
            helperText="Tell us more about yourself"
          />
          <Textarea
            placeholder="Character count"
            label="Bio"
            showCount
            maxLength={200}
            helperText="Max 200 characters"
          />
          <div className="grid md:grid-cols-3 gap-4">
            <Textarea inputSize="sm" placeholder="Small" />
            <Textarea inputSize="md" placeholder="Medium" />
            <Textarea inputSize="lg" placeholder="Large" />
          </div>
        </div>
      </section>

      {/* Select */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Select</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Country</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
                <SelectItem value="au">Australia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Size</Label>
            <Select>
              <SelectTrigger size="lg">
                <SelectValue placeholder="Large select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="xs">Extra Small</SelectItem>
                <SelectItem value="sm">Small</SelectItem>
                <SelectItem value="md">Medium</SelectItem>
                <SelectItem value="lg">Large</SelectItem>
                <SelectItem value="xl">Extra Large</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Checkbox */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Checkbox</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Checkbox id="terms" />
            <Label htmlFor="terms">Accept terms and conditions</Label>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">Sizes</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox size="sm" id="small" />
                <Label htmlFor="small">Small</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox size="md" id="medium" defaultChecked />
                <Label htmlFor="medium">Medium</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox size="lg" id="large" />
                <Label htmlFor="large">Large</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">States</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox id="checked" defaultChecked />
                <Label htmlFor="checked">Checked</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="indeterminate" indeterminate />
                <Label htmlFor="indeterminate">Indeterminate</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="disabled" disabled />
                <Label htmlFor="disabled">Disabled</Label>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Radio Group */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Radio Group</h2>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select plan</Label>
            <RadioGroup defaultValue="pro">
              <div className="flex items-center gap-2">
                <RadioGroupItem value="free" id="free" />
                <Label htmlFor="free">Free - $0/month</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="pro" id="pro" />
                <Label htmlFor="pro">Pro - $9/month</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="enterprise" id="enterprise" />
                <Label htmlFor="enterprise">Enterprise - $29/month</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Sizes</p>
            <RadioGroup defaultValue="md">
              <div className="flex items-center gap-2">
                <RadioGroupItem size="sm" value="sm" id="radio-sm" />
                <Label htmlFor="radio-sm">Small</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem size="md" value="md" id="radio-md" />
                <Label htmlFor="radio-md">Medium</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem size="lg" value="lg" id="radio-lg" />
                <Label htmlFor="radio-lg">Large</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </section>

      {/* Switch */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Switch</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Switch id="notifications" checked={switchValue} onCheckedChange={setSwitchValue} />
            <Label htmlFor="notifications">Enable notifications</Label>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Sizes</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch size="sm" id="switch-sm" />
                <Label htmlFor="switch-sm">Small</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch size="md" id="switch-md" defaultChecked />
                <Label htmlFor="switch-md">Medium</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch size="lg" id="switch-lg" />
                <Label htmlFor="switch-lg">Large</Label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch id="disabled-switch" disabled />
            <Label htmlFor="disabled-switch">Disabled</Label>
          </div>
        </div>
      </section>

      {/* Slider */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Slider</h2>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Volume: {sliderValue}%</Label>
            <Slider
              value={sliderValue}
              onChange={(val) => setSliderValue(val as number)}
              min={0}
              max={100}
              step={1}
            />
          </div>

          <div className="space-y-2">
            <Label>Price Range</Label>
            <Slider
              range
              defaultValue={[25, 75]}
              min={0}
              max={100}
              showMinMax
            />
          </div>

          <div className="space-y-2">
            <Label>With Marks</Label>
            <Slider
              defaultValue={50}
              min={0}
              max={100}
              marks={[0, 25, 50, 75, 100]}
            />
          </div>
        </div>
      </section>

      {/* Complete Form Example */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Complete Form Example</h2>
        <form className="space-y-6 max-w-2xl">
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="John"
              required
              leftIcon={<User />}
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              required
              leftIcon={<User />}
            />
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            required
            leftIcon={<Mail />}
            helperText="We'll never share your email"
          />

          <Input
            label="Phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            leftIcon={<Phone />}
            optional
          />

          <div className="space-y-2">
            <Label>Country</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
                <SelectItem value="ca">Canada</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea
            label="Message"
            placeholder="Tell us about your project..."
            showCount
            maxLength={500}
            helperText="Describe what you need help with"
          />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox id="newsletter" />
              <Label htmlFor="newsletter">Subscribe to newsletter</Label>
            </div>
            
            <div className="flex items-center gap-2">
              <Checkbox id="form-terms" />
              <Label htmlFor="form-terms">
                I agree to the terms and conditions *
              </Label>
            </div>
          </div>

          <div className="flex gap-3">
            <Button type="submit" variant="primary">
              Submit Form
            </Button>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
