/* ============================================================
 * Validation Schemas
 * Zod schemas for form validation
 * ============================================================ */

import { z } from "zod";

/* ============================================================
 * Common Field Schemas
 * ============================================================ */

/** Email validation */
export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address")
  .max(255, "Email too long");

/** Optional email */
export const emailOptionalSchema = z
  .string()
  .email("Invalid email address")
  .max(255, "Email too long")
  .optional()
  .or(z.literal(""));

/** Phone validation */
export const phoneSchema = z
  .string()
  .regex(/^[0-9\s\-\+\(\)]+$/, "Invalid phone number")
  .min(10, "Phone number too short")
  .max(20, "Phone number too long");

/** Optional phone */
export const phoneOptionalSchema = phoneSchema.optional().or(z.literal(""));

/** URL validation */
export const urlSchema = z.string().url("Invalid URL").max(500, "URL too long");

/** Optional URL */
export const urlOptionalSchema = urlSchema.optional().or(z.literal(""));

/** Vietnamese name validation */
export const vietnameseNameSchema = z
  .string()
  .min(1, "Name is required")
  .max(100, "Name too long")
  .regex(
    /^[a-zA-ZÀ-ỹ\s]+$/,
    "Name can only contain letters and spaces"
  );

/** UUID validation */
export const uuidSchema = z
  .string()
  .uuid("Invalid ID format");

/** Date string validation */
export const dateStringSchema = z
  .string()
  .datetime("Invalid date format")
  .or(z.date());

/** Optional date */
export const dateOptionalSchema = dateStringSchema.optional();

/** Currency amount (VND) */
export const currencySchema = z
  .number()
  .int("Amount must be a whole number")
  .min(0, "Amount cannot be negative")
  .max(999999999999, "Amount too large");

/** Lead score (0-100) */
export const leadScoreSchema = z
  .number()
  .int("Score must be a whole number")
  .min(0, "Score cannot be negative")
  .max(100, "Score cannot exceed 100");

/** Percentage (0-100) */
export const percentageSchema = z
  .number()
  .min(0, "Percentage cannot be negative")
  .max(100, "Percentage cannot exceed 100");

/* ============================================================
 * Contact Form Schema
 * ============================================================ */

export const contactFormSchema = z.object({
  // Required fields
  firstName: vietnameseNameSchema,
  lastName: vietnameseNameSchema,
  email: emailSchema,
  
  // Contact type
  contactType: z.enum(["customer", "partner", "vendor", "other"], {
    required_error: "Contact type is required",
  }),
  
  // Optional personal info
  middleName: z.string().max(50, "Middle name too long").optional(),
  phone: phoneOptionalSchema,
  mobile: phoneOptionalSchema,
  website: urlOptionalSchema,
  
  // Organization
  company: z.string().max(200, "Company name too long").optional(),
  jobTitle: z.string().max(100, "Job title too long").optional(),
  department: z.string().max(100, "Department too long").optional(),
  
  // Address
  address: z.string().max(500, "Address too long").optional(),
  city: z.string().max(100, "City too long").optional(),
  state: z.string().max(100, "State too long").optional(),
  postalCode: z.string().max(20, "Postal code too long").optional(),
  country: z.string().max(100, "Country too long").optional(),
  
  // CRM fields
  status: z.enum(["active", "inactive", "blocked"]).default("active"),
  leadScore: leadScoreSchema.default(0),
  source: z.string().max(50).optional(),
  ownerId: uuidSchema.optional(),
  
  // Lifetime value
  lifetimeValue: currencySchema.default(0),
  
  // Tags
  tags: z.array(z.string()).default([]),
  
  // Notes
  notes: z.string().max(5000, "Notes too long").optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

/* ============================================================
 * Deal Form Schema
 * ============================================================ */

export const dealFormSchema = z.object({
  // Required fields
  name: z.string().min(1, "Deal name is required").max(200, "Name too long"),
  value: currencySchema,
  stage: z.enum(
    ["qualification", "needs_analysis", "proposal", "negotiation", "closed_won", "closed_lost"],
    { required_error: "Stage is required" }
  ),
  
  // Contact relationship
  contactId: uuidSchema.optional(),
  
  // Deal details
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  probability: percentageSchema.default(50),
  expectedCloseDate: dateOptionalSchema,
  actualCloseDate: dateOptionalSchema,
  
  // Owner
  ownerId: uuidSchema.optional(),
  
  // Source
  source: z.string().max(50).optional(),
  
  // Financial
  discount: currencySchema.default(0),
  tax: currencySchema.default(0),
  
  // Products
  productIds: z.array(uuidSchema).default([]),
  
  // Status
  status: z.enum(["open", "won", "lost"]).default("open"),
  lostReason: z.string().max(500).optional(),
  
  // Tags
  tags: z.array(z.string()).default([]),
  
  // Description
  description: z.string().max(5000, "Description too long").optional(),
  
  // Notes
  notes: z.string().max(5000, "Notes too long").optional(),
}).refine(
  (data) => {
    // If status is lost, require lostReason
    if (data.status === "lost" && !data.lostReason) {
      return false;
    }
    return true;
  },
  {
    message: "Lost reason is required when deal is marked as lost",
    path: ["lostReason"],
  }
).refine(
  (data) => {
    // expectedCloseDate must be in the future for open deals
    if (data.status === "open" && data.expectedCloseDate) {
      const closeDate = new Date(data.expectedCloseDate);
      const now = new Date();
      return closeDate > now;
    }
    return true;
  },
  {
    message: "Expected close date must be in the future",
    path: ["expectedCloseDate"],
  }
);

export type DealFormData = z.infer<typeof dealFormSchema>;

/* ============================================================
 * Lead Form Schema
 * ============================================================ */

export const leadFormSchema = z.object({
  // Required fields
  firstName: vietnameseNameSchema,
  lastName: vietnameseNameSchema,
  email: emailSchema,
  
  // Lead status
  status: z.enum(["new", "contacted", "qualified", "converted", "disqualified"]).default("new"),
  
  // Optional contact info
  phone: phoneOptionalSchema,
  mobile: phoneOptionalSchema,
  website: urlOptionalSchema,
  
  // Company
  company: z.string().max(200, "Company name too long").optional(),
  jobTitle: z.string().max(100, "Job title too long").optional(),
  
  // Lead source
  source: z.string().max(50).optional(),
  campaign: z.string().max(100).optional(),
  referrer: z.string().max(200).optional(),
  
  // Scoring
  leadScore: leadScoreSchema.default(0),
  qualified: z.boolean().default(false),
  
  // Interest
  interestedProducts: z.array(z.string()).default([]),
  budget: currencySchema.optional(),
  timeline: z.string().max(100).optional(),
  
  // Address
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  
  // Assignment
  ownerId: uuidSchema.optional(),
  
  // Conversion
  converted: z.boolean().default(false),
  convertedDate: dateOptionalSchema,
  contactId: uuidSchema.optional(),
  dealId: uuidSchema.optional(),
  
  // Disqualification
  disqualifiedReason: z.string().max(500).optional(),
  
  // Tags
  tags: z.array(z.string()).default([]),
  
  // Notes
  notes: z.string().max(5000, "Notes too long").optional(),
}).refine(
  (data) => {
    // If disqualified, require reason
    if (data.status === "disqualified" && !data.disqualifiedReason) {
      return false;
    }
    return true;
  },
  {
    message: "Disqualification reason is required",
    path: ["disqualifiedReason"],
  }
).refine(
  (data) => {
    // If converted, require contactId
    if (data.converted && !data.contactId) {
      return false;
    }
    return true;
  },
  {
    message: "Contact is required for converted leads",
    path: ["contactId"],
  }
);

export type LeadFormData = z.infer<typeof leadFormSchema>;

/* ============================================================
 * Activity Form Schema
 * ============================================================ */

export const activityFormSchema = z.object({
  // Activity type
  type: z.enum(["task", "meeting", "call", "email", "deadline", "other"], {
    required_error: "Activity type is required",
  }),
  
  // Required fields
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  dueDate: dateStringSchema,
  
  // Optional fields
  description: z.string().max(5000, "Description too long").optional(),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  status: z.enum(["pending", "in_progress", "completed", "cancelled"]).default("pending"),
  
  // Relationships
  contactId: uuidSchema.optional(),
  dealId: uuidSchema.optional(),
  leadId: uuidSchema.optional(),
  
  // Assignment
  assigneeId: uuidSchema.optional(),
  
  // Meeting/Call specific
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  location: z.string().max(200).optional(),
  participants: z.array(z.string()).default([]),
  
  // Completion
  completedDate: dateOptionalSchema,
  outcome: z.string().max(1000).optional(),
  
  // Reminders
  reminderMinutes: z.number().int().min(0).optional(),
  
  // Tags
  tags: z.array(z.string()).default([]),
}).refine(
  (data) => {
    // If type is meeting, require location or participants
    if (data.type === "meeting" && !data.location && data.participants.length === 0) {
      return false;
    }
    return true;
  },
  {
    message: "Meeting must have a location or participants",
    path: ["location"],
  }
).refine(
  (data) => {
    // If completed, require completedDate
    if (data.status === "completed" && !data.completedDate) {
      return false;
    }
    return true;
  },
  {
    message: "Completed date is required when activity is completed",
    path: ["completedDate"],
  }
);

export type ActivityFormData = z.infer<typeof activityFormSchema>;

/* ============================================================
 * Quick Create Schemas (simplified)
 * ============================================================ */

/** Quick contact create */
export const quickContactSchema = z.object({
  firstName: vietnameseNameSchema,
  lastName: vietnameseNameSchema,
  email: emailSchema,
  phone: phoneOptionalSchema,
  company: z.string().max(200).optional(),
  contactType: z.enum(["customer", "partner", "vendor", "other"]).default("customer"),
});

export type QuickContactData = z.infer<typeof quickContactSchema>;

/** Quick deal create */
export const quickDealSchema = z.object({
  name: z.string().min(1, "Deal name is required").max(200),
  value: currencySchema,
  contactId: uuidSchema.optional(),
  stage: z.enum([
    "qualification",
    "needs_analysis",
    "proposal",
    "negotiation",
    "closed_won",
    "closed_lost",
  ]).default("qualification"),
  expectedCloseDate: dateOptionalSchema,
});

export type QuickDealData = z.infer<typeof quickDealSchema>;

/** Quick lead create */
export const quickLeadSchema = z.object({
  firstName: vietnameseNameSchema,
  lastName: vietnameseNameSchema,
  email: emailSchema,
  phone: phoneOptionalSchema,
  company: z.string().max(200).optional(),
  source: z.string().max(50).optional(),
});

export type QuickLeadData = z.infer<typeof quickLeadSchema>;

/** Quick task create */
export const quickTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  dueDate: dateStringSchema,
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  contactId: uuidSchema.optional(),
  dealId: uuidSchema.optional(),
});

export type QuickTaskData = z.infer<typeof quickTaskSchema>;

/* ============================================================
 * Validation Utilities
 * ============================================================ */

/** Validate data against schema */
export function validateSchema<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error };
    }
    throw error;
  }
}

/** Get error messages from Zod error */
export function getErrorMessages(error: z.ZodError): Record<string, string> {
  const messages: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join(".");
    messages[path] = err.message;
  });
  
  return messages;
}

/** Check if field has error */
export function hasFieldError(
  errors: z.ZodError | undefined,
  field: string
): boolean {
  if (!errors) return false;
  return errors.errors.some((err) => err.path.join(".") === field);
}

/** Get field error message */
export function getFieldError(
  errors: z.ZodError | undefined,
  field: string
): string | undefined {
  if (!errors) return undefined;
  const error = errors.errors.find((err) => err.path.join(".") === field);
  return error?.message;
}
