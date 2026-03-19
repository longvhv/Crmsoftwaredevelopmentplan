import React from "react";
import { DatePicker } from "../ui/date-picker";
import { Combobox, ComboboxOption } from "../ui/combobox";
import { FileUpload } from "../ui/file-upload";
import { Button } from "../ui/button";
import { DateRange } from "react-day-picker";

/* ============================================================
 * MOCK DATA
 * ============================================================ */

const COUNTRIES: ComboboxOption[] = [
  { value: "us", label: "United States", group: "North America" },
  { value: "ca", label: "Canada", group: "North America" },
  { value: "mx", label: "Mexico", group: "North America" },
  { value: "uk", label: "United Kingdom", group: "Europe" },
  { value: "fr", label: "France", group: "Europe" },
  { value: "de", label: "Germany", group: "Europe" },
  { value: "jp", label: "Japan", group: "Asia" },
  { value: "cn", label: "China", group: "Asia" },
  { value: "kr", label: "South Korea", group: "Asia" },
  { value: "vn", label: "Vietnam", group: "Asia" },
];

const SKILLS: ComboboxOption[] = [
  { value: "react", label: "React" },
  { value: "typescript", label: "TypeScript" },
  { value: "nodejs", label: "Node.js" },
  { value: "python", label: "Python" },
  { value: "java", label: "Java" },
  { value: "golang", label: "Go" },
  { value: "rust", label: "Rust" },
  { value: "docker", label: "Docker" },
  { value: "kubernetes", label: "Kubernetes" },
  { value: "aws", label: "AWS" },
];

/* ============================================================
 * COMPONENT
 * ============================================================ */

export function AdvancedFormsShowcase() {
  // DatePicker state
  const [singleDate, setSingleDate] = React.useState<Date>();
  const [dateRange, setDateRange] = React.useState<DateRange>();
  const [dateTime, setDateTime] = React.useState<Date>();
  const [dateWithTimezone, setDateWithTimezone] = React.useState<Date>();

  // Combobox state
  const [country, setCountry] = React.useState<string>("");
  const [skills, setSkills] = React.useState<string[]>([]);
  const [searchableValue, setSearchableValue] = React.useState<string>("");
  const [creatableSkills, setCreatableSkills] = React.useState<ComboboxOption[]>(SKILLS);

  // FileUpload state
  const [files, setFiles] = React.useState<File[]>([]);
  const [multipleFiles, setMultipleFiles] = React.useState<File[]>([]);

  const handleCreateSkill = (value: string) => {
    const newSkill: ComboboxOption = {
      value: value.toLowerCase().replace(/\s/g, "-"),
      label: value,
    };
    setCreatableSkills([...creatableSkills, newSkill]);
    setSkills([...skills, newSkill.value]);
  };

  const handleFileUpload = async (file: File) => {
    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-8 space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Advanced Form Components</h1>
        <p className="text-muted-foreground">
          DatePicker, Combobox, and FileUpload with full features
        </p>
      </div>

      {/* ============================================================
       * DATE PICKER
       * ============================================================ */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">DatePicker</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Powerful date selection with presets, time, and timezone support
          </p>
        </div>

        {/* Single Date */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Single Date Selection</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <DatePicker
              label="Basic Date"
              placeholder="Select a date"
              value={singleDate}
              onChange={setSingleDate}
              helperText="Choose any date"
            />
            <DatePicker
              label="With Min/Max"
              placeholder="Select date"
              minDate={new Date()}
              maxDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
              helperText="Next 30 days only"
            />
          </div>
          {singleDate && (
            <div className="p-4 rounded-lg bg-accent">
              <p className="text-sm">
                <strong>Selected:</strong> {singleDate.toLocaleDateString()}
              </p>
            </div>
          )}
        </div>

        {/* Date Range */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Date Range Selection</h3>
          <DatePicker
            mode="range"
            label="Date Range"
            placeholder="Select date range"
            rangeValue={dateRange}
            onRangeChange={setDateRange}
            showPresets
            helperText="Use presets or select custom range"
          />
          {dateRange?.from && dateRange?.to && (
            <div className="p-4 rounded-lg bg-accent">
              <p className="text-sm">
                <strong>From:</strong> {dateRange.from.toLocaleDateString()} <br />
                <strong>To:</strong> {dateRange.to.toLocaleDateString()} <br />
                <strong>Days:</strong>{" "}
                {Math.ceil(
                  (dateRange.to.getTime() - dateRange.from.getTime()) /
                    (1000 * 60 * 60 * 24)
                )}
              </p>
            </div>
          )}
        </div>

        {/* With Time */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Date with Time</h3>
          <DatePicker
            label="Appointment Date & Time"
            placeholder="Select date and time"
            value={dateTime}
            onChange={setDateTime}
            showTime
            helperText="Include time in your selection"
          />
          {dateTime && (
            <div className="p-4 rounded-lg bg-accent">
              <p className="text-sm">
                <strong>Selected:</strong> {dateTime.toLocaleString()}
              </p>
            </div>
          )}
        </div>

        {/* With Timezone */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Date with Time & Timezone</h3>
          <DatePicker
            label="Meeting Date & Time"
            placeholder="Select date, time, and timezone"
            value={dateWithTimezone}
            onChange={setDateWithTimezone}
            showTime
            showTimezone
            showPresets={false}
            helperText="Full date/time with timezone selection"
          />
        </div>

        {/* States */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">States</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <DatePicker
              label="Required Field"
              placeholder="Select date"
              required
              helperText="This field is required"
            />
            <DatePicker
              label="Optional Field"
              placeholder="Select date"
              optional
            />
            <DatePicker
              label="With Error"
              placeholder="Select date"
              error="Please select a valid date"
            />
            <DatePicker
              label="With Success"
              placeholder="Select date"
              success="Date confirmed!"
            />
            <DatePicker
              label="Disabled"
              placeholder="Cannot select"
              disabled
            />
          </div>
        </div>
      </section>

      {/* ============================================================
       * COMBOBOX
       * ============================================================ */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Combobox</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Searchable select with multi-select, grouping, and create option
          </p>
        </div>

        {/* Single Select */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Single Selection</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Combobox
              label="Country"
              placeholder="Select country"
              options={COUNTRIES}
              value={country}
              onChange={(val) => setCountry(val as string)}
              helperText="Choose your country"
            />
            <Combobox
              label="Simple Select"
              placeholder="Select option"
              options={SKILLS.slice(0, 5)}
              searchable={false}
              helperText="No search, just select"
            />
          </div>
          {country && (
            <div className="p-4 rounded-lg bg-accent">
              <p className="text-sm">
                <strong>Selected Country:</strong>{" "}
                {COUNTRIES.find((c) => c.value === country)?.label}
              </p>
            </div>
          )}
        </div>

        {/* Multi Select */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Multiple Selection</h3>
          <Combobox
            label="Skills"
            placeholder="Select multiple skills"
            options={SKILLS}
            value={skills}
            onChange={(val) => setSkills(val as string[])}
            multiple
            clearable
            helperText="Select all that apply"
          />
          {skills.length > 0 && (
            <div className="p-4 rounded-lg bg-accent">
              <p className="text-sm">
                <strong>Selected Skills:</strong>{" "}
                {skills
                  .map((s) => SKILLS.find((sk) => sk.value === s)?.label)
                  .join(", ")}
              </p>
            </div>
          )}
        </div>

        {/* Searchable */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Searchable with Groups</h3>
          <Combobox
            label="Searchable Country"
            placeholder="Search countries"
            searchPlaceholder="Type to search..."
            options={COUNTRIES}
            value={searchableValue}
            onChange={(val) => setSearchableValue(val as string)}
            searchable
            helperText="Type to filter by country name"
          />
        </div>

        {/* Creatable */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Creatable (Add New Options)</h3>
          <Combobox
            label="Custom Skills"
            placeholder="Select or create skills"
            options={creatableSkills}
            value={skills}
            onChange={(val) => setSkills(val as string[])}
            multiple
            creatable
            onCreate={handleCreateSkill}
            helperText="Can't find your skill? Create it!"
          />
        </div>

        {/* States */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">States</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Combobox
              label="Required"
              placeholder="Select option"
              options={SKILLS.slice(0, 5)}
              required
              helperText="This field is required"
            />
            <Combobox
              label="Optional"
              placeholder="Select option"
              options={SKILLS.slice(0, 5)}
              optional
            />
            <Combobox
              label="With Error"
              placeholder="Select option"
              options={SKILLS.slice(0, 5)}
              error="Please select at least one option"
            />
            <Combobox
              label="With Success"
              placeholder="Select option"
              options={SKILLS.slice(0, 5)}
              success="Great choice!"
            />
            <Combobox
              label="Loading"
              placeholder="Loading..."
              options={[]}
              loading
              helperText="Fetching options..."
            />
            <Combobox
              label="Disabled"
              placeholder="Cannot select"
              options={SKILLS.slice(0, 5)}
              disabled
            />
          </div>
        </div>

        {/* Sizes */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Sizes</h3>
          <div className="grid gap-4">
            <Combobox
              label="Small"
              placeholder="Small size"
              options={SKILLS.slice(0, 5)}
              size="sm"
            />
            <Combobox
              label="Medium (Default)"
              placeholder="Medium size"
              options={SKILLS.slice(0, 5)}
              size="md"
            />
            <Combobox
              label="Large"
              placeholder="Large size"
              options={SKILLS.slice(0, 5)}
              size="lg"
            />
          </div>
        </div>
      </section>

      {/* ============================================================
       * FILE UPLOAD
       * ============================================================ */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">FileUpload</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Drag-and-drop file upload with preview and progress
          </p>
        </div>

        {/* Single File */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Single File Upload</h3>
          <FileUpload
            label="Profile Picture"
            helperText="Upload your profile picture (max 5MB)"
            accept="image/*"
            maxSize={5}
            value={files}
            onChange={setFiles}
            onUpload={handleFileUpload}
            showPreview
          />
        </div>

        {/* Multiple Files */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Multiple Files Upload</h3>
          <FileUpload
            label="Documents"
            helperText="Upload multiple documents (max 10MB each, up to 5 files)"
            accept=".pdf,.doc,.docx,.txt"
            maxSize={10}
            maxFiles={5}
            multiple
            value={multipleFiles}
            onChange={setMultipleFiles}
            onUpload={handleFileUpload}
          />
        </div>

        {/* Compact Variant */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Compact Variant</h3>
          <FileUpload
            label="Attachment"
            variant="compact"
            accept="*/*"
            maxSize={10}
            multiple
            helperText="Compact upload area"
          />
        </div>

        {/* States */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">States</h3>
          <div className="grid gap-4">
            <FileUpload
              label="Required"
              required
              helperText="This field is required"
            />
            <FileUpload
              label="Optional"
              optional
            />
            <FileUpload
              label="With Error"
              error="Failed to upload. Please try again."
            />
            <FileUpload
              label="With Success"
              success="All files uploaded successfully!"
            />
            <FileUpload
              label="Disabled"
              disabled
              helperText="Upload is disabled"
            />
          </div>
        </div>

        {/* Without Preview */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Without Preview</h3>
          <FileUpload
            label="Files (No Preview)"
            multiple
            showPreview={false}
            helperText="Files will not show preview thumbnails"
          />
        </div>
      </section>

      {/* Complete Form Example */}
      <section className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Complete Form Example</h2>
          <p className="text-sm text-muted-foreground mt-1">
            All advanced form components working together
          </p>
        </div>

        <form className="space-y-6 max-w-2xl p-6 rounded-lg border border-border bg-background">
          <div className="grid md:grid-cols-2 gap-4">
            <DatePicker
              label="Start Date"
              placeholder="Select start date"
              required
            />
            <DatePicker
              label="End Date"
              placeholder="Select end date"
              required
            />
          </div>

          <Combobox
            label="Country"
            placeholder="Select your country"
            options={COUNTRIES}
            required
            helperText="Where are you located?"
          />

          <Combobox
            label="Skills"
            placeholder="Select your skills"
            options={SKILLS}
            multiple
            creatable
            onCreate={handleCreateSkill}
            helperText="Add all relevant skills"
          />

          <FileUpload
            label="Resume / CV"
            accept=".pdf,.doc,.docx"
            maxSize={5}
            required
            helperText="Upload your resume (PDF or Word)"
          />

          <FileUpload
            label="Portfolio Files"
            multiple
            maxFiles={5}
            maxSize={10}
            helperText="Upload up to 5 files showcasing your work"
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" variant="primary">
              Submit Application
            </Button>
            <Button type="button" variant="outline">
              Save Draft
            </Button>
            <Button type="button" variant="ghost">
              Cancel
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
