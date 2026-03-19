/* ============================================================
 * Mock API Usage Examples
 * Demonstrates common API patterns and best practices
 * ============================================================ */

import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
  searchContacts,
  getContactStats,
  getDeals,
  createDeal,
  updateDeal,
  markDealWon,
  getLeads,
  createLead,
  qualifyLead,
  convertLead,
  type ContactFilters,
  type DealFilters,
  type LeadFilters,
} from "./index";

/* ============================================================
 * CONTACTS EXAMPLES
 * ============================================================ */

/** Example 1: Fetch all active customers with pagination */
export async function example1_FetchActiveCustomers() {
  const response = await getContacts({
    page: 1,
    limit: 20,
    sortBy: "createdAt",
    sortOrder: "desc",
    filters: {
      contactType: "customer",
      status: "active",
    },
  });

  if ("error" in response) {
    console.error("Error:", response.message);
    return;
  }

  console.log(`Found ${response.pagination.total} active customers`);
  console.log(`Showing page ${response.pagination.page} of ${response.pagination.totalPages}`);
  response.data.forEach((contact) => {
    console.log(`- ${contact.fullName} (${contact.email})`);
  });
}

/** Example 2: Search contacts by name/email */
export async function example2_SearchContacts() {
  const query = "nguyễn";
  const response = await searchContacts(query, 10);

  if ("error" in response) {
    console.error("Error:", response.message);
    return;
  }

  console.log(`Search results for "${query}":`);
  response.data.forEach((contact) => {
    console.log(`- ${contact.fullName} (${contact.company || "No company"})`);
  });
}

/** Example 3: Create new contact with validation */
export async function example3_CreateContact() {
  const response = await createContact({
    firstName: "Văn A",
    lastName: "Nguyễn",
    email: "nguyen.van.a@example.com",
    phone: "0901234567",
    company: "Công ty TNHH ABC",
    jobTitle: "Giám đốc kinh doanh",
    contactType: "customer",
    status: "active",
    source: "website",
  });

  if ("error" in response) {
    if (response.error === "DUPLICATE_EMAIL") {
      console.log("Contact with this email already exists");
    } else if (response.error === "VALIDATION_ERROR") {
      console.log("Validation failed:", response.message);
    } else {
      console.error("Error:", response.message);
    }
    return;
  }

  console.log("Contact created successfully!");
  console.log(`ID: ${response.data.id}`);
  console.log(`Name: ${response.data.fullName}`);
}

/** Example 4: Update contact with optimistic locking */
export async function example4_UpdateContact(contactId: string) {
  // First, get current contact
  const getResponse = await getContactById(contactId);
  
  if ("error" in getResponse) {
    console.error("Contact not found");
    return;
  }

  const contact = getResponse.data;
  console.log(`Current version: ${contact.version}`);

  // Update contact
  const updateResponse = await updateContact(contactId, {
    leadScore: 85,
    lifetimeValue: 150000000, // 150M VND
    tags: ["vip", "high-value"],
  });

  if ("error" in updateResponse) {
    console.error("Update failed:", updateResponse.message);
    return;
  }

  console.log("Contact updated successfully!");
  console.log(`New version: ${updateResponse.data.version}`);
}

/** Example 5: Advanced filtering */
export async function example5_AdvancedFiltering() {
  const filters: ContactFilters = {
    contactType: ["customer", "partner"],
    status: "active",
    minLeadScore: 70,
    minLifetimeValue: 50000000, // 50M VND
    hasCompany: true,
    createdAfter: "2026-01-01",
    search: "tech",
  };

  const response = await getContacts({ filters });

  if ("error" in response) {
    console.error("Error:", response.message);
    return;
  }

  console.log(`Found ${response.pagination.total} high-value tech contacts`);
}

/** Example 6: Get stats and analytics */
export async function example6_GetContactStats() {
  const response = await getContactStats();

  if ("error" in response) {
    console.error("Error:", response.message);
    return;
  }

  const stats = response.data;
  console.log("=== Contact Statistics ===");
  console.log(`Total Contacts: ${stats.total}`);
  console.log(`Average Lead Score: ${stats.avgLeadScore}`);
  console.log(`Total LTV: ${(stats.totalLifetimeValue / 1000000000).toFixed(2)}B VND`);
  console.log("\nBy Type:");
  Object.entries(stats.byType).forEach(([type, count]) => {
    console.log(`  ${type}: ${count}`);
  });
  console.log("\nBy Status:");
  Object.entries(stats.byStatus).forEach(([status, count]) => {
    console.log(`  ${status}: ${count}`);
  });
}

/* ============================================================
 * DEALS EXAMPLES
 * ============================================================ */

/** Example 7: Create deal and link to contact */
export async function example7_CreateDeal(contactId: string) {
  const response = await createDeal({
    name: "ABC Corp - Enterprise License Q2/2026",
    contactId,
    value: 500000000, // 500M VND
    currency: "VND",
    stage: "qualification",
    priority: "hot",
    expectedCloseDate: "2026-06-30",
    pipeline: "Enterprise Sales",
    source: "referral",
  });

  if ("error" in response) {
    console.error("Error:", response.message);
    return;
  }

  console.log("Deal created successfully!");
  console.log(`ID: ${response.data.id}`);
  console.log(`Value: ${(response.data.value / 1000000).toFixed(0)}M VND`);
  console.log(`Probability: ${response.data.probability}%`);
}

/** Example 8: Move deal through pipeline */
export async function example8_MoveDealThroughPipeline(dealId: string) {
  const stages = ["qualification", "discovery", "proposal", "negotiation"];

  for (const stage of stages) {
    console.log(`Moving to stage: ${stage}...`);
    
    const response = await updateDeal(dealId, { stage: stage as never });
    
    if ("error" in response) {
      console.error("Error:", response.message);
      return;
    }

    console.log(`  ✓ Probability now: ${response.data.probability}%`);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1s
  }

  console.log("Deal ready for closing!");
}

/** Example 9: Close deal as won */
export async function example9_CloseDealWon(dealId: string) {
  const response = await markDealWon(dealId);

  if ("error" in response) {
    console.error("Error:", response.message);
    return;
  }

  console.log("🎉 Deal won!");
  console.log(`Value: ${(response.data.value / 1000000).toFixed(0)}M VND`);
  console.log(`Closed on: ${response.data.actualCloseDate}`);
}

/** Example 10: Filter hot deals closing soon */
export async function example10_GetHotDealsClosingSoon() {
  const today = new Date();
  const next30Days = new Date();
  next30Days.setDate(next30Days.getDate() + 30);

  const filters: DealFilters = {
    stage: ["proposal", "negotiation"],
    priority: "hot",
    expectedCloseAfter: today.toISOString().split("T")[0],
    expectedCloseBefore: next30Days.toISOString().split("T")[0],
  };

  const response = await getDeals({
    filters,
    sortBy: "expectedCloseDate",
    sortOrder: "asc",
  });

  if ("error" in response) {
    console.error("Error:", response.message);
    return;
  }

  console.log(`Found ${response.pagination.total} hot deals closing in next 30 days:`);
  response.data.forEach((deal) => {
    console.log(`- ${deal.name}: ${(deal.value / 1000000).toFixed(0)}M VND (${deal.expectedCloseDate})`);
  });
}

/* ============================================================
 * LEADS EXAMPLES
 * ============================================================ */

/** Example 11: Create lead from web form */
export async function example11_CreateLeadFromWebForm(formData: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
}) {
  // Parse name
  const nameParts = formData.name.split(" ");
  const lastName = nameParts[0];
  const firstName = nameParts.slice(1).join(" ");

  const response = await createLead({
    firstName,
    lastName,
    email: formData.email,
    phone: formData.phone,
    company: formData.company,
    source: "website",
    status: "new",
    customFields: {
      initialMessage: formData.message,
      submittedAt: new Date().toISOString(),
    },
  });

  if ("error" in response) {
    console.error("Error:", response.message);
    return;
  }

  console.log("Lead captured from website!");
  console.log(`Lead ID: ${response.data.id}`);
  console.log(`Lead Score: ${response.data.leadScore}`);
}

/** Example 12: Qualify lead */
export async function example12_QualifyLead(leadId: string) {
  // First update lead score
  await updateLead(leadId, { leadScore: 75 });

  // Then qualify
  const response = await qualifyLead(leadId);

  if ("error" in response) {
    console.error("Error:", response.message);
    return;
  }

  console.log("Lead qualified!");
  console.log(`Qualified at: ${response.data.qualifiedAt}`);
}

/** Example 13: Convert lead to customer with deal */
export async function example13_ConvertLeadToCustomer(leadId: string) {
  const response = await convertLead(leadId, {
    createContact: true,
    createDeal: true,
    dealValue: 200000000, // 200M VND
  });

  if ("error" in response) {
    console.error("Error:", response.message);
    return;
  }

  console.log("Lead converted successfully!");
  console.log(`Contact ID: ${response.data.contactId}`);
  console.log(`Deal ID: ${response.data.dealId}`);
  console.log(`Converted at: ${response.data.lead.convertedAt}`);
}

/** Example 14: Find qualified leads ready to convert */
export async function example14_FindQualifiedLeads() {
  const filters: LeadFilters = {
    status: "qualified",
    minLeadScore: 70,
    qualified: true,
    converted: false,
  };

  const response = await getLeads({
    filters,
    sortBy: "leadScore",
    sortOrder: "desc",
  });

  if ("error" in response) {
    console.error("Error:", response.message);
    return;
  }

  console.log(`Found ${response.pagination.total} qualified leads ready to convert:`);
  response.data.forEach((lead) => {
    console.log(`- ${lead.fullName} (Score: ${lead.leadScore}) - ${lead.company || "No company"}`);
  });
}

/* ============================================================
 * COMPLEX WORKFLOWS
 * ============================================================ */

/** Example 15: Complete sales cycle */
export async function example15_CompleteSalesCycle() {
  console.log("=== Starting Complete Sales Cycle ===\n");

  // Step 1: Create lead from marketing campaign
  console.log("1. Lead captured from Google Ads...");
  const leadResponse = await createLead({
    firstName: "Thị B",
    lastName: "Trần",
    email: "tran.thi.b@company.vn",
    phone: "0912345678",
    company: "Công ty CP XYZ",
    jobTitle: "Giám đốc marketing",
    source: "ad",
  });

  if ("error" in leadResponse) {
    console.error("Failed to create lead");
    return;
  }

  const lead = leadResponse.data;
  console.log(`   ✓ Lead created: ${lead.fullName} (Score: ${lead.leadScore})\n`);

  // Step 2: Qualify lead
  console.log("2. Sales team contacted and qualified lead...");
  await qualifyLead(lead.id);
  await updateLead(lead.id, { leadScore: 80 });
  console.log("   ✓ Lead qualified with score 80\n");

  // Step 3: Convert to contact and create deal
  console.log("3. Converting to customer and creating deal...");
  const convertResponse = await convertLead(lead.id, {
    createContact: true,
    createDeal: true,
    dealValue: 300000000, // 300M VND
  });

  if ("error" in convertResponse) {
    console.error("Failed to convert lead");
    return;
  }

  const contactId = convertResponse.data.contactId!;
  const dealId = convertResponse.data.dealId!;
  console.log(`   ✓ Contact created: ${contactId}`);
  console.log(`   ✓ Deal created: ${dealId} (300M VND)\n`);

  // Step 4: Move deal through pipeline
  console.log("4. Moving deal through pipeline...");
  const stages = ["discovery", "proposal", "negotiation"];
  
  for (const stage of stages) {
    await updateDeal(dealId, { stage: stage as never });
    console.log(`   ✓ Moved to ${stage}`);
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  console.log();

  // Step 5: Close deal as won
  console.log("5. Closing deal...");
  await markDealWon(dealId);
  console.log("   ✓ Deal won! 🎉\n");

  // Step 6: Update contact with LTV
  console.log("6. Updating customer lifetime value...");
  await updateContact(contactId, {
    lifetimeValue: 300000000,
    tags: ["customer", "closed-won"],
  });
  console.log("   ✓ Customer updated\n");

  console.log("=== Sales cycle completed successfully! ===");
}

/* ============================================================
 * ERROR HANDLING EXAMPLES
 * ============================================================ */

/** Example 16: Robust error handling */
export async function example16_RobustErrorHandling(contactId: string) {
  try {
    const response = await getContactById(contactId);

    if ("error" in response) {
      // Handle specific errors
      switch (response.error) {
        case "NOT_FOUND":
          console.log("Contact not found. Maybe it was deleted?");
          break;
        
        case "INVALID_ID":
          console.log("Invalid contact ID format");
          break;
        
        default:
          console.error(`Unexpected error: ${response.message}`);
      }
      return;
    }

    // Success
    const contact = response.data;
    console.log(`Found contact: ${contact.fullName}`);
    
  } catch (err) {
    // Handle unexpected errors (network issues, etc.)
    console.error("Unexpected error:", err);
  }
}

/* ============================================================
 * EXPORT ALL EXAMPLES
 * ============================================================ */

export const examples = {
  contacts: {
    fetchActiveCustomers: example1_FetchActiveCustomers,
    searchContacts: example2_SearchContacts,
    createContact: example3_CreateContact,
    updateContact: example4_UpdateContact,
    advancedFiltering: example5_AdvancedFiltering,
    getStats: example6_GetContactStats,
  },
  deals: {
    createDeal: example7_CreateDeal,
    moveThroughPipeline: example8_MoveDealThroughPipeline,
    closeDealWon: example9_CloseDealWon,
    getHotDeals: example10_GetHotDealsClosingSoon,
  },
  leads: {
    createFromWebForm: example11_CreateLeadFromWebForm,
    qualifyLead: example12_QualifyLead,
    convertToCustomer: example13_ConvertLeadToCustomer,
    findQualified: example14_FindQualifiedLeads,
  },
  workflows: {
    completeSalesCycle: example15_CompleteSalesCycle,
  },
  errorHandling: {
    robustErrorHandling: example16_RobustErrorHandling,
  },
};
