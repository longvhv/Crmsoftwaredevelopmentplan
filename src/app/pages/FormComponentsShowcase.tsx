/* ============================================================
 * Form Components Showcase
 * Demonstration of all form components
 * ============================================================ */

import { useState } from "react";
import { Link } from "react-router";
import { z } from "zod";
import {
  FormBuilder,
  ValidationDisplay,
  FileUpload,
  RichTextEditor,
  DateRangePicker,
  DatePicker,
  TagInput,
  ColorPicker,
  PhoneInput,
  type FieldConfig,
  type FormBuilderSection,
  type Tag,
  type DateRangeValue,
} from "@/components/crm";
import { useFormBase } from "@/hooks/forms/useFormBase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { CountryIso2 } from "react-international-phone";

/* ============================================================
 * Demo Form Schema
 * ============================================================ */

const demoFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  role: z.string().min(1, "Please select a role"),
  bio: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: "You must accept terms and conditions",
  }),
});

type DemoFormData = z.infer<typeof demoFormSchema>;

/* ============================================================
 * Main Component
 * ============================================================ */

export default function FormComponentsShowcase() {
  return (
    <div className="container max-w-7xl mx-auto p-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-4 mb-4">
          <Link to="/showcase" className="text-sm text-muted-foreground hover:text-primary">
            ← Back to Core Components
          </Link>
          <span className="text-muted-foreground">|</span>
          <Link to="/showcase/specialized" className="text-sm text-muted-foreground hover:text-primary">
            Specialized Components →
          </Link>
        </div>
        <h1 className="text-4xl font-bold">Form Components Showcase</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Demonstration of all form components available in the CRM system
        </p>
      </div>

      <Tabs defaultValue="builder" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="builder">FormBuilder</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="file">FileUpload</TabsTrigger>
          <TabsTrigger value="richtext">RichText</TabsTrigger>
          <TabsTrigger value="date">Date</TabsTrigger>
          <TabsTrigger value="tags">Tags</TabsTrigger>
          <TabsTrigger value="color">Color</TabsTrigger>
          <TabsTrigger value="phone">Phone</TabsTrigger>
        </TabsList>

        {/* FormBuilder Demo */}
        <TabsContent value="builder" className="space-y-6">
          <FormBuilderDemo />
        </TabsContent>

        {/* Validation Demo */}
        <TabsContent value="validation" className="space-y-6">
          <ValidationDemo />
        </TabsContent>

        {/* FileUpload Demo */}
        <TabsContent value="file" className="space-y-6">
          <FileUploadDemo />
        </TabsContent>

        {/* RichTextEditor Demo */}
        <TabsContent value="richtext" className="space-y-6">
          <RichTextDemo />
        </TabsContent>

        {/* DatePicker Demo */}
        <TabsContent value="date" className="space-y-6">
          <DatePickerDemo />
        </TabsContent>

        {/* TagInput Demo */}
        <TabsContent value="tags" className="space-y-6">
          <TagInputDemo />
        </TabsContent>

        {/* ColorPicker Demo */}
        <TabsContent value="color" className="space-y-6">
          <ColorPickerDemo />
        </TabsContent>

        {/* PhoneInput Demo */}
        <TabsContent value="phone" className="space-y-6">
          <PhoneInputDemo />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ============================================================
 * FormBuilder Demo
 * ============================================================ */

function FormBuilderDemo() {
  const formHook = useFormBase({
    schema: demoFormSchema,
    config: {
      mode: "create",
      onSubmit: async (data) => {
        console.log("Form submitted:", data);
      },
    },
  });

  const sections: FormBuilderSection[] = [
    {
      id: "basic",
      title: "Basic Information",
      description: "Enter your basic details",
      columns: 2,
      fields: [
        {
          name: "name",
          label: "Full Name",
          type: "text",
          placeholder: "John Doe",
          required: true,
        },
        {
          name: "email",
          label: "Email Address",
          type: "email",
          placeholder: "john@example.com",
          required: true,
        },
        {
          name: "phone",
          label: "Phone Number",
          type: "tel",
          placeholder: "+1 (555) 000-0000",
        },
        {
          name: "role",
          label: "Role",
          type: "select",
          required: true,
          options: [
            { label: "Developer", value: "developer" },
            { label: "Designer", value: "designer" },
            { label: "Manager", value: "manager" },
          ],
        },
      ],
    },
    {
      id: "additional",
      title: "Additional Info",
      collapsible: true,
      fields: [
        {
          name: "bio",
          label: "Bio",
          type: "textarea",
          placeholder: "Tell us about yourself...",
          rows: 4,
        },
        {
          name: "acceptTerms",
          label: "Terms and Conditions",
          type: "checkbox",
          placeholder: "I accept the terms and conditions",
          required: true,
        },
      ],
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>FormBuilder Component</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Dynamic form builder with sections, validation, and multiple field types
        </p>
      </CardHeader>
      <CardContent>
        <FormBuilder
          formHook={formHook}
          sections={sections}
          showSubmit
          showReset
          showCancel
        />
      </CardContent>
    </Card>
  );
}

/* ============================================================
 * Validation Demo
 * ============================================================ */

function ValidationDemo() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Inline Validation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ValidationDisplay error="This field is required" variant="inline" />
          <ValidationDisplay
            error={{ message: "Invalid email format", severity: "error" }}
            variant="inline"
          />
          <ValidationDisplay
            error={{ message: "Password strength: Medium", severity: "warning" }}
            variant="inline"
          />
          <ValidationDisplay
            error={{ message: "Available username", severity: "success" }}
            variant="inline"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Block Validation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ValidationDisplay
            errors={[
              "Name is required",
              "Email is invalid",
              "Password must be at least 8 characters",
            ]}
            variant="block"
            severity="error"
          />
          <ValidationDisplay
            errors={[{ message: "Changes saved successfully", severity: "success" }]}
            variant="block"
            severity="success"
          />
        </CardContent>
      </Card>
    </div>
  );
}

/* ============================================================
 * FileUpload Demo
 * ============================================================ */

function FileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>FileUpload Component</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Drag and drop file upload with preview and validation
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <FileUpload
          value={files}
          onChange={(newFiles) => setFiles(Array.isArray(newFiles) ? newFiles : [newFiles!])}
          accept="image/*,.pdf"
          multiple
          maxSize={5 * 1024 * 1024}
          maxFiles={5}
          showPreview
        />

        <div className="text-sm text-gray-600 dark:text-gray-400">
          Selected files: {files.length}
        </div>
      </CardContent>
    </Card>
  );
}

/* ============================================================
 * RichText Demo
 * ============================================================ */

function RichTextDemo() {
  const [content, setContent] = useState("<p>Start typing your content here...</p>");

  return (
    <Card>
      <CardHeader>
        <CardTitle>RichTextEditor Component</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ContentEditable-based rich text editor with formatting toolbar
        </p>
      </CardHeader>
      <CardContent>
        <RichTextEditor
          value={content}
          onChange={setContent}
          placeholder="Write something amazing..."
          minHeight={300}
        />
      </CardContent>
    </Card>
  );
}

/* ============================================================
 * DatePicker Demo
 * ============================================================ */

function DatePickerDemo() {
  const [date, setDate] = useState<Date | null>(null);
  const [dateRange, setDateRange] = useState<DateRangeValue | null>(null);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Single Date Picker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DatePicker
            value={date}
            onChange={setDate}
            placeholder="Select a date"
            clearable
          />
          {date && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Selected: {date.toLocaleDateString()}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Date Range Picker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DateRangePicker
            value={dateRange}
            onChange={setDateRange}
            placeholder="Select date range"
            showPresets
            numberOfMonths={2}
            clearable
          />
          {dateRange && (
            <div className="text-sm text-gray-600 dark:text-gray-400">
              From: {dateRange.from.toLocaleDateString()} - To: {dateRange.to.toLocaleDateString()}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* ============================================================
 * TagInput Demo
 * ============================================================ */

function TagInputDemo() {
  const [tags, setTags] = useState<Tag[]>([
    { id: "1", label: "React" },
    { id: "2", label: "TypeScript" },
  ]);

  const suggestions: Tag[] = [
    { id: "s1", label: "JavaScript" },
    { id: "s2", label: "Node.js" },
    { id: "s3", label: "Next.js" },
    { id: "s4", label: "Tailwind CSS" },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>TagInput Component</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage tags with autocomplete suggestions
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <TagInput
          value={tags}
          onChange={setTags}
          placeholder="Add skills..."
          suggestions={suggestions}
          maxTags={10}
        />

        <div className="text-sm text-gray-600 dark:text-gray-400">
          {tags.length} tags selected
        </div>
      </CardContent>
    </Card>
  );
}

/* ============================================================
 * ColorPicker Demo
 * ============================================================ */

function ColorPickerDemo() {
  const [color, setColor] = useState("#3B82F6");

  return (
    <Card>
      <CardHeader>
        <CardTitle>ColorPicker Component</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Pick colors from presets or use custom color picker
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <ColorPicker
          value={color}
          onChange={setColor}
          showPresets
          allowCustom
        />

        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-lg border-2"
            style={{ backgroundColor: color }}
          />
          <div className="text-sm">
            <div className="font-medium">Selected Color</div>
            <div className="text-gray-600 dark:text-gray-400 font-mono">
              {color}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ============================================================
 * PhoneInput Demo
 * ============================================================ */

function PhoneInputDemo() {
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState<CountryIso2>("us");

  return (
    <Card>
      <CardHeader>
        <CardTitle>PhoneInput Component</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          International phone number input with country selection
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <PhoneInput
          value={phone}
          onChange={(newPhone, newCountry) => {
            setPhone(newPhone);
            setCountry(newCountry);
          }}
          defaultCountry="us"
          preferredCountries={["us", "gb", "ca", "vn"]}
          label="Phone Number"
          placeholder="Enter phone number"
        />

        {phone && (
          <div className="text-sm space-y-1">
            <div className="text-gray-600 dark:text-gray-400">
              Phone: <span className="font-mono">{phone}</span>
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              Country: <span className="font-mono">{country}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}