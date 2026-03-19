###  📝 Form Hooks Documentation

> **Version:** 1.0  
> **Last Updated:** 2026-03-17  
> **Purpose:** React Hook Form + Zod validation hooks

---

## 🎯 Overview

Form management layer với đầy đủ tính năng:
- ✅ **Type-safe** - Full TypeScript + Zod validation
- ✅ **React Hook Form** - Performant form management
- ✅ **Auto-validation** - Real-time validation
- ✅ **Error Handling** - User-friendly error messages
- ✅ **Optimistic Updates** - Integrated with React Query
- ✅ **Helper Methods** - Business logic utilities
- ✅ **Quick Forms** - Simplified create modals

---

## 📁 Structure

```
/src/app/
├── hooks/forms/
│   ├── useFormBase.ts         # Base form hook
│   ├── useContactForm.ts      # Contact form
│   ├── useDealForm.ts         # Deal form
│   ├── useLeadForm.ts         # Lead form
│   ├── useActivityForm.ts     # Activity form
│   ├── useQuickForm.ts        # Quick create forms
│   └── index.ts               # Central export
├── schemas/
│   └── validation.ts          # Zod schemas
├── types/
│   └── forms.ts               # Form types
├── utils/
│   └── formUtils.ts           # Form utilities
└── components/forms/
    ├── FormField.tsx          # Reusable fields
    └── index.ts               # Component exports
```

---

## 📞 Contact Form Hook

### Basic Usage

```typescript
import { useContactForm } from "@/hooks/forms";

function CreateContactForm() {
  const form = useContactForm({
    mode: "create",
    onSuccess: (contact) => {
      console.log("Contact created:", contact);
      // Navigate or close modal
    },
    onCancel: () => {
      // Handle cancel
    },
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <TextField
        {...form.form.register("firstName")}
        label="First Name"
        error={form.form.formState.errors.firstName}
        required
      />
      <TextField
        {...form.form.register("lastName")}
        label="Last Name"
        error={form.form.formState.errors.lastName}
        required
      />
      <TextField
        {...form.form.register("email")}
        label="Email"
        type="email"
        error={form.form.formState.errors.email}
        required
      />
      
      <FormActions
        isSubmitting={form.isSubmitting}
        canSubmit={form.canSubmit}
        onCancel={form.handleCancel}
      />
    </form>
  );
}
```

### Edit Mode

```typescript
function EditContactForm({ contact }: { contact: Contact }) {
  const form = useContactForm({
    mode: "edit",
    contact,
    onSuccess: (updatedContact) => {
      console.log("Contact updated:", updatedContact);
    },
  });

  // Form renders similarly...
}
```

### Helper Methods

```typescript
const form = useContactForm({ mode: "create" });

// Get full name
const fullName = form.helpers.getFullName();

// Auto-generate email from name
form.helpers.generateEmail();

// Recalculate lead score based on filled fields
form.helpers.recalculateLeadScore();

// Set default country
form.helpers.setDefaultCountry();

// Validate email uniqueness
const isUnique = await form.helpers.validateEmailUnique("test@example.com");
```

---

## 💼 Deal Form Hook

### Basic Usage

```typescript
import { useDealForm } from "@/hooks/forms";

function CreateDealForm({ contactId }: { contactId?: string }) {
  const form = useDealForm({
    mode: "create",
    contactId, // Optional: pre-fill contact
    onSuccess: (deal) => {
      console.log("Deal created:", deal);
    },
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <TextField
        {...form.form.register("name")}
        label="Deal Name"
        error={form.form.formState.errors.name}
        required
      />
      <TextField
        {...form.form.register("value", { valueAsNumber: true })}
        label="Value (VND)"
        type="number"
        error={form.form.formState.errors.value}
        required
      />
      <SelectField
        {...form.form.register("stage")}
        label="Stage"
        options={[
          { label: "Qualification", value: "qualification" },
          { label: "Needs Analysis", value: "needs_analysis" },
          { label: "Proposal", value: "proposal" },
          { label: "Negotiation", value: "negotiation" },
        ]}
        error={form.form.formState.errors.stage}
        required
      />
      
      <FormActions
        isSubmitting={form.isSubmitting}
        canSubmit={form.canSubmit}
        onCancel={form.handleCancel}
      />
    </form>
  );
}
```

### Helper Methods

```typescript
const form = useDealForm({ mode: "create" });

// Update probability when stage changes
form.helpers.updateProbabilityFromStage("proposal"); // Sets to 60%

// Calculate final value (value - discount + tax)
const finalValue = form.helpers.calculateFinalValue();

// Get weighted value for forecasting
const weighted = form.helpers.getWeightedValue();

// Check if deal is overdue
const overdue = form.helpers.isOverdue();

// Get days until close
const days = form.helpers.getDaysUntilClose();

// Update stage and auto-set probability
form.helpers.updateStage("negotiation");

// Get discount percentage
const discountPercent = form.helpers.getDiscountPercentage();
```

---

## 🎯 Lead Form Hook

### Basic Usage

```typescript
import { useLeadForm } from "@/hooks/forms";

function CreateLeadForm() {
  const form = useLeadForm({
    mode: "create",
    onSuccess: (lead) => {
      console.log("Lead created:", lead);
    },
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <FormRow columns={2}>
        <TextField
          {...form.form.register("firstName")}
          label="First Name"
          error={form.form.formState.errors.firstName}
          required
        />
        <TextField
          {...form.form.register("lastName")}
          label="Last Name"
          error={form.form.formState.errors.lastName}
          required
        />
      </FormRow>
      
      <TextField
        {...form.form.register("email")}
        label="Email"
        type="email"
        error={form.form.formState.errors.email}
        required
      />
      
      <TextField
        {...form.form.register("company")}
        label="Company"
        error={form.form.formState.errors.company}
      />
      
      <div className="text-sm text-muted-foreground">
        Lead Score: {form.form.watch("leadScore")} / 100
      </div>
      
      <FormActions
        isSubmitting={form.isSubmitting}
        canSubmit={form.canSubmit}
        onCancel={form.handleCancel}
      />
    </form>
  );
}
```

### Auto Lead Scoring

```typescript
const form = useLeadForm({ mode: "create" });

// Calculate lead score automatically based on filled fields
const score = form.helpers.calculateLeadScore();
// Returns 0-100 based on:
// - Email: 10 points
// - Phone: 10 points
// - Mobile: 5 points
// - Company: 15 points
// - Job Title: 10 points
// - Budget: 20 points
// - Interested Products: 15 points
// - Timeline: 10 points
// - Website: 5 points

// Check if lead meets qualification criteria
const isQualified = form.helpers.checkQualification(); // score >= 70

// Mark as qualified
form.helpers.markAsQualified();

// Mark as disqualified
form.helpers.markAsDisqualified("Not interested");
```

### Lead Conversion

```typescript
const form = useLeadForm({ mode: "edit", lead });

// Validate if lead can be converted
const validation = form.helpers.validateConversion();
if (!validation.canConvert) {
  console.log("Conversion blocked:", validation.errors);
}

// Prepare conversion data
const conversion = form.helpers.prepareConversion();
if (conversion.ready) {
  // conversion.contactData - data for new contact
  // conversion.dealData - data for new deal (if budget exists)
  
  // After conversion, mark as converted
  form.helpers.markAsConverted(contactId, dealId);
}

// Get quality rating
const rating = form.helpers.getQualityRating();
// { label: "Excellent", color: "green" } for score >= 80
// { label: "Good", color: "blue" } for score >= 60
// { label: "Fair", color: "yellow" } for score >= 40
// { label: "Poor", color: "red" } for score < 40
```

---

## 📅 Activity Form Hook

### Basic Usage

```typescript
import { useActivityForm } from "@/hooks/forms";

function CreateActivityForm({
  contactId,
  dealId,
}: {
  contactId?: string;
  dealId?: string;
}) {
  const form = useActivityForm({
    mode: "create",
    contactId,
    dealId,
    onSuccess: (activity) => {
      console.log("Activity created:", activity);
    },
  });

  return (
    <form onSubmit={form.handleSubmit}>
      <SelectField
        {...form.form.register("type")}
        label="Type"
        options={[
          { label: "Task", value: "task" },
          { label: "Meeting", value: "meeting" },
          { label: "Call", value: "call" },
          { label: "Email", value: "email" },
        ]}
        error={form.form.formState.errors.type}
        required
        onValueChange={(type) => {
          // Auto-set time slots for meetings/calls
          form.helpers.setDefaultTimeSlots(type as never);
        }}
      />
      
      <TextField
        {...form.form.register("title")}
        label="Title"
        error={form.form.formState.errors.title}
        required
      />
      
      <TextField
        {...form.form.register("dueDate")}
        label="Due Date"
        type="datetime-local"
        error={form.form.formState.errors.dueDate}
        required
      />
      
      <FormActions
        isSubmitting={form.isSubmitting}
        canSubmit={form.canSubmit}
        onCancel={form.handleCancel}
      />
    </form>
  );
}
```

### Helper Methods

```typescript
const form = useActivityForm({ mode: "create" });

// Set default time slots based on activity type
form.helpers.setDefaultTimeSlots("meeting"); // 1-hour default
form.helpers.setDefaultTimeSlots("call"); // 30-min default

// Mark activity as completed
form.helpers.markAsCompleted("Meeting went well");

// Cancel activity
form.helpers.cancelActivity();

// Get duration in minutes
const minutes = form.helpers.getDurationMinutes();

// Get formatted duration
const formatted = form.helpers.getFormattedDuration(); // "1h 30m"

// Check if overdue
const overdue = form.helpers.isOverdue();

// Get days until due
const days = form.helpers.getDaysUntilDue();

// Get reminder time
const reminderTime = form.helpers.getReminderTime();

// Add/remove participants
form.helpers.addParticipant("user@example.com");
form.helpers.removeParticipant("user@example.com");

// Validate time range
const isValid = form.helpers.validateTimeRange();
```

---

## ⚡ Quick Form Hooks

### Quick Contact

```typescript
import { useQuickContactForm } from "@/hooks/forms";

function QuickCreateContactModal({ onClose }: { onClose: () => void }) {
  const form = useQuickContactForm({
    onSuccess: (contact) => {
      console.log("Contact created:", contact);
      onClose();
    },
    onCancel: onClose,
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Quick Create Contact</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit}>
          <FormRow>
            <TextField {...form.form.register("firstName")} label="First Name" required />
            <TextField {...form.form.register("lastName")} label="Last Name" required />
          </FormRow>
          <TextField {...form.form.register("email")} label="Email" type="email" required />
          <FormActions isSubmitting={form.isSubmitting} onCancel={onClose} />
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### Quick Deal

```typescript
import { useQuickDealForm } from "@/hooks/forms";

function QuickCreateDealModal({ contactId, onClose }: { contactId?: string; onClose: () => void }) {
  const form = useQuickDealForm({
    contactId,
    onSuccess: (deal) => {
      console.log("Deal created:", deal);
      onClose();
    },
  });

  // Minimal form with name, value, stage
}
```

### Universal Quick Form

```typescript
import { useQuickForm, type QuickCreateEntity } from "@/hooks/forms";

function QuickCreateModal({ entity, onClose }: { entity: QuickCreateEntity; onClose: () => void }) {
  const form = useQuickForm({
    entity, // "contact" | "deal" | "lead" | "task"
    onSuccess: (result) => {
      console.log(`${entity} created:`, result);
      onClose();
    },
  });

  // Form automatically adapts based on entity type
}
```

---

## ✅ Validation

### Zod Schemas

All forms use Zod for validation:

```typescript
// From @/schemas/validation

// Contact validation
const contactFormSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().max(255),
  contactType: z.enum(["customer", "partner", "vendor", "other"]),
  // ... more fields
});

// Deal validation with custom rules
const dealFormSchema = z.object({
  name: z.string().min(1).max(200),
  value: z.number().min(0),
  stage: z.enum([...]),
  // ...
}).refine(
  (data) => {
    // Custom validation: lost deals require reason
    if (data.status === "lost" && !data.lostReason) return false;
    return true;
  },
  { message: "Lost reason required", path: ["lostReason"] }
);
```

### Custom Validation

```typescript
const form = useContactForm({ mode: "create" });

// Add custom async validation
const validateEmail = async () => {
  const email = form.getFieldValue("email");
  const isUnique = await form.helpers.validateEmailUnique(email);
  
  if (!isUnique) {
    form.form.setError("email", {
      type: "manual",
      message: "Email already exists",
    });
  }
};
```

---

## 🎨 Form Components

### Text Field

```typescript
<TextField
  {...form.register("firstName")}
  label="First Name"
  description="Enter the contact's first name"
  error={form.formState.errors.firstName}
  required
  placeholder="Nguyễn"
/>
```

### Select Field

```typescript
<SelectField
  {...form.register("contactType")}
  label="Contact Type"
  options={[
    { label: "Customer", value: "customer" },
    { label: "Partner", value: "partner" },
  ]}
  error={form.formState.errors.contactType}
  required
/>
```

### Textarea Field

```typescript
<TextareaField
  {...form.register("notes")}
  label="Notes"
  rows={5}
  error={form.formState.errors.notes}
/>
```

### Form Layout

```typescript
<FormSection title="Personal Information" description="Basic contact details">
  <FormRow columns={2}>
    <TextField {...form.register("firstName")} label="First Name" required />
    <TextField {...form.register("lastName")} label="Last Name" required />
  </FormRow>
  <TextField {...form.register("email")} label="Email" type="email" required />
</FormSection>

<FormSection title="Company Information">
  <TextField {...form.register("company")} label="Company" />
  <FormRow columns={2}>
    <TextField {...form.register("jobTitle")} label="Job Title" />
    <TextField {...form.register("department")} label="Department" />
  </FormRow>
</FormSection>

<FormActions
  submitLabel="Create Contact"
  isSubmitting={form.isSubmitting}
  canSubmit={form.canSubmit}
  onCancel={form.handleCancel}
/>
```

---

## 🚀 Advanced Patterns

### Conditional Fields

```typescript
const form = useDealForm({ mode: "create" });
const status = form.form.watch("status");

return (
  <form>
    <SelectField {...form.register("status")} label="Status" />
    
    {status === "lost" && (
      <TextareaField
        {...form.register("lostReason")}
        label="Lost Reason"
        required
        description="Why did we lose this deal?"
      />
    )}
  </form>
);
```

### Dynamic Field Updates

```typescript
const form = useLeadForm({ mode: "create" });

// Watch for changes and auto-calculate score
useEffect(() => {
  const subscription = form.form.watch(() => {
    form.helpers.calculateLeadScore();
  });
  
  return () => subscription.unsubscribe();
}, [form]);
```

### Multi-Step Forms

```typescript
function MultiStepContactForm() {
  const [step, setStep] = useState(1);
  const form = useContactForm({ mode: "create" });

  return (
    <form onSubmit={form.handleSubmit}>
      {step === 1 && (
        <FormSection title="Step 1: Basic Info">
          <TextField {...form.register("firstName")} />
          <TextField {...form.register("lastName")} />
        </FormSection>
      )}
      
      {step === 2 && (
        <FormSection title="Step 2: Contact Details">
          <TextField {...form.register("email")} />
          <TextField {...form.register("phone")} />
        </FormSection>
      )}
      
      {step === 3 && (
        <FormSection title="Step 3: Company Info">
          <TextField {...form.register("company")} />
          <TextField {...form.register("jobTitle")} />
        </FormSection>
      )}
      
      <div className="flex gap-2">
        {step > 1 && (
          <button type="button" onClick={() => setStep(step - 1)}>
            Back
          </button>
        )}
        {step < 3 ? (
          <button type="button" onClick={() => setStep(step + 1)}>
            Next
          </button>
        ) : (
          <FormActions isSubmitting={form.isSubmitting} />
        )}
      </div>
    </form>
  );
}
```

---

## 🐛 Error Handling

### Field Errors

```typescript
const form = useContactForm({ mode: "create" });

// Check if field has error
const hasError = form.hasError("email");

// Get error message
const errorMsg = form.getError("email");

// Display inline
<TextField
  {...form.register("email")}
  error={form.form.formState.errors.email}
/>
```

### Form-Level Errors

```typescript
const form = useContactForm({
  mode: "create",
  onError: (error) => {
    // Handle submission errors
    console.error("Form error:", error);
    
    // Set form-level error
    form.form.setError("root", {
      type: "manual",
      message: "Failed to create contact. Please try again.",
    });
  },
});
```

---

## 💡 Best Practices

1. **Always validate** - Use Zod schemas for type-safe validation
2. **Provide feedback** - Show loading states and error messages
3. **Auto-save drafts** - Use `watch()` to save form state
4. **Pre-fill data** - Pass `defaultValues` for edit forms
5. **Helper methods** - Use built-in helpers for business logic
6. **Quick forms** - Use simplified schemas for modals
7. **Accessibility** - Use proper labels, ARIA attributes
8. **Mobile-friendly** - Test on mobile devices

---

**Maintained by:** AI Development Team  
**Last Review:** 2026-03-17  
**Next Review:** Phase 2-C kickoff
