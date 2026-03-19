/**
 * Phase 27: DEVELOPER EXPERIENCE (DX) & API ECONOMY
 * SDK ecosystem, CLI tools, plugin architecture,
 * developer documentation, sandbox, API monetization.
 * Steps: 27.1.1 → 27.6.3 (~28 bước)
 */
import type { PlanStep } from "../../types/plan";

export const phase27Steps: PlanStep[] = [
  // --- 27.1 SDK Ecosystem ---
  {
    id: "27.1.1",
    name: "Multi-language SDK Generation (TypeScript, Python, Java, Go, C#)",
    description:
      "Auto-generate SDKs từ OpenAPI spec: TypeScript (Node + Browser), Python, Java, Go, C#. Type-safe, async support, pagination helpers, error handling, retry logic, rate limit handling.",
    phase: 27, category: "Developer Experience", subCategory: "SDK",
    responsible: ["Backend Dev", "DX Engineer"],
    aiInvolvement: "AI-Assisted", dependencies: ["19.4.2"],
    duration: "6 ngày", status: "pending", priority: "Critical",
    deliverables: ["5 language SDKs", "Auto-generation pipeline", "Type-safe interfaces", "SDK documentation"],
    aiTools: ["OpenAPI Generator", "SDK Builder AI"],
  },
  {
    id: "27.1.2",
    name: "SDK Testing & Compatibility Matrix",
    description:
      "SDK testing: automated tests per language, compatibility matrix (runtime versions), integration tests against staging API, SDK versioning (semver), breaking change detection.",
    phase: 27, category: "Developer Experience", subCategory: "SDK Testing",
    responsible: ["QA", "DX Engineer"],
    aiInvolvement: "AI-Assisted", dependencies: ["27.1.1"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["SDK test suites", "Compatibility matrix", "Breaking change alerts", "Version management"],
    aiTools: ["SDK Tester AI"],
  },
  {
    id: "27.1.3",
    name: "React Component Library (NPM Package)",
    description:
      "React component library: CRM UI components (ContactCard, DealCard, Pipeline, Timeline, etc.) exportable as NPM package. Storybook documentation, theming API, accessibility built-in.",
    phase: 27, category: "Developer Experience", subCategory: "Component Library",
    responsible: ["Frontend Dev", "UX Designer"],
    aiInvolvement: "AI-Assisted", dependencies: ["27.1.1"],
    duration: "5 ngày", status: "pending", priority: "Medium",
    deliverables: ["React component NPM package", "Storybook documentation", "Theming API", "Accessibility compliance"],
    aiTools: ["Storybook AI", "Component Generator"],
  },

  // --- 27.2 CLI & Developer Tools ---
  {
    id: "27.2.1",
    name: "CLI Tool (crm-cli)",
    description:
      "Command-line tool: crm-cli login, crm-cli contacts list, crm-cli deals create, crm-cli export, crm-cli webhook test, crm-cli plugin scaffold. Autocomplete, colored output, progress bars.",
    phase: 27, category: "Developer Experience", subCategory: "CLI",
    responsible: ["Backend Dev", "DX Engineer"],
    aiInvolvement: "AI-Assisted", dependencies: ["27.1.1"],
    duration: "5 ngày", status: "pending", priority: "High",
    deliverables: ["crm-cli tool", "CRUD commands", "Webhook testing", "Plugin scaffolding"],
    aiTools: ["CLI Builder", "Oclif"],
  },
  {
    id: "27.2.2",
    name: "VS Code Extension",
    description:
      "VS Code extension: inline CRM data lookup, API reference hover, code snippets cho SDK, webhook debugging, environment management, syntax highlighting cho CRM formulas.",
    phase: 27, category: "Developer Experience", subCategory: "IDE Extension",
    responsible: ["DX Engineer"],
    aiInvolvement: "AI-Assisted", dependencies: ["27.2.1"],
    duration: "4 ngày", status: "pending", priority: "Medium",
    deliverables: ["VS Code extension", "Data lookup", "Code snippets", "Webhook debugger"],
    aiTools: ["VS Code AI"],
  },
  {
    id: "27.2.3",
    name: "Postman/Insomnia Collection & Environment",
    description:
      "Pre-built API collections: Postman/Insomnia collections auto-generated, environment templates, example requests, test scripts, mock server, collection auto-update với API changes.",
    phase: 27, category: "Developer Experience", subCategory: "API Tools",
    responsible: ["DX Engineer", "Technical Writer"],
    aiInvolvement: "AI-Assisted", dependencies: ["19.4.2"],
    duration: "3 ngày", status: "pending", priority: "Medium",
    deliverables: ["Postman collection", "Environment templates", "Test scripts", "Mock server"],
    aiTools: ["Postman AI"],
  },

  // --- 27.3 Plugin Architecture ---
  {
    id: "27.3.1",
    name: "Plugin Architecture & Sandboxed Runtime",
    description:
      "Plugin system: sandboxed JavaScript runtime (V8 isolates), API hooks (beforeCreate, afterUpdate, onDelete), UI extension points (sidebar, detail page, dashboard widget), resource limits.",
    phase: 27, category: "Developer Experience", subCategory: "Plugin Architecture",
    responsible: ["Backend Dev", "Architect"],
    aiInvolvement: "AI-Assisted", dependencies: ["11.1.1"],
    duration: "7 ngày", status: "pending", priority: "Critical",
    deliverables: ["Plugin runtime (V8 isolates)", "API hooks system", "UI extension points", "Resource limiting"],
    aiTools: ["V8 Isolates", "Plugin Sandbox"],
  },
  {
    id: "27.3.2",
    name: "Plugin SDK & Development Kit",
    description:
      "Plugin SDK: boilerplate generator (create-crm-plugin), local development server, hot reload, debugging tools, testing framework, publishing workflow, versioning.",
    phase: 27, category: "Developer Experience", subCategory: "Plugin SDK",
    responsible: ["DX Engineer", "Backend Dev"],
    aiInvolvement: "AI-Assisted", dependencies: ["27.3.1"],
    duration: "5 ngày", status: "pending", priority: "High",
    deliverables: ["Plugin SDK", "create-crm-plugin CLI", "Local dev server", "Testing framework"],
    aiTools: ["Plugin Builder AI"],
  },
  {
    id: "27.3.3",
    name: "Plugin Marketplace & Review Process",
    description:
      "Plugin marketplace: submission workflow, automated security scan, manual review process, pricing models (free/paid/freemium), analytics for developers, revenue sharing.",
    phase: 27, category: "Developer Experience", subCategory: "Marketplace",
    responsible: ["Product", "Security Engineer"],
    aiInvolvement: "AI-Assisted", dependencies: ["27.3.2", "11.2.1"],
    duration: "5 ngày", status: "pending", priority: "High",
    deliverables: ["Submission workflow", "Security scan pipeline", "Revenue sharing system", "Developer analytics"],
    aiTools: ["Security Scanner", "Marketplace AI"],
  },

  // --- 27.4 Documentation Excellence ---
  {
    id: "27.4.1",
    name: "Developer Documentation Portal (Docusaurus)",
    description:
      "Docs portal: Docusaurus-based, versioned docs, interactive API reference, tutorials (quick start, advanced), guides per use case, changelog, migration guides. Dark mode, search (Algolia).",
    phase: 27, category: "Developer Experience", subCategory: "Documentation",
    responsible: ["Technical Writer", "DX Engineer", "Frontend Dev"],
    aiInvolvement: "AI-Assisted", dependencies: ["19.4.2"],
    duration: "5 ngày", status: "pending", priority: "Critical",
    deliverables: ["Docusaurus portal", "Versioned docs", "Interactive API ref", "Search integration"],
    aiTools: ["Docusaurus", "Algolia"],
  },
  {
    id: "27.4.2",
    name: "AI-Powered Documentation Assistant",
    description:
      "AI chatbot cho docs: answer developer questions from documentation, suggest code examples, debug API errors, explain concepts. RAG-based trên toàn bộ docs + API specs + SDK code.",
    phase: 27, category: "Developer Experience", subCategory: "AI Docs",
    responsible: ["AI Engineer", "DX Engineer"],
    aiInvolvement: "AI-Driven", dependencies: ["27.4.1", "24.1.1"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["Docs chatbot", "RAG on documentation", "Code example generator", "Error debugger"],
    aiTools: ["GPT-4o", "RAG Pipeline"],
  },
  {
    id: "27.4.3",
    name: "Code Samples & Recipe Library",
    description:
      "Library 200+ code samples: authentication flows, CRUD operations, webhooks, batch operations, real-time subscriptions. Recipes cho common use cases. Executable in-browser (CodeSandbox/StackBlitz).",
    phase: 27, category: "Developer Experience", subCategory: "Code Samples",
    responsible: ["DX Engineer", "Technical Writer"],
    aiInvolvement: "AI-Assisted", dependencies: ["27.4.1"],
    duration: "4 ngày", status: "pending", priority: "Medium",
    deliverables: ["200+ code samples", "Recipe library", "In-browser execution", "Multi-language examples"],
    aiTools: ["CodeSandbox", "StackBlitz"],
  },

  // --- 27.5 Developer Sandbox & Testing ---
  {
    id: "27.5.1",
    name: "Developer Sandbox Environment",
    description:
      "Sandbox per developer account: isolated data, realistic seed data, API identical to production, reset capability, time travel (simulate future dates), webhook testing endpoint.",
    phase: 27, category: "Developer Experience", subCategory: "Sandbox",
    responsible: ["Backend Dev", "DevOps"],
    aiInvolvement: "AI-Assisted", dependencies: ["19.4.2"],
    duration: "5 ngày", status: "pending", priority: "High",
    deliverables: ["Sandbox provisioning", "Seed data generator", "Reset API", "Webhook test endpoint"],
    aiTools: ["Sandbox Engine"],
  },
  {
    id: "27.5.2",
    name: "API Mocking & Contract Testing for Developers",
    description:
      "Mock server cho developers: auto-generate mock responses from OpenAPI spec, configurable response behaviors (success/error/delay), record & replay mode, contract validation.",
    phase: 27, category: "Developer Experience", subCategory: "Mocking",
    responsible: ["Backend Dev", "DX Engineer"],
    aiInvolvement: "AI-Assisted", dependencies: ["27.5.1"],
    duration: "3 ngày", status: "pending", priority: "Medium",
    deliverables: ["Mock server", "Response configurator", "Record & replay", "Contract validator"],
    aiTools: ["Mock AI", "Prism"],
  },

  // --- 27.6 API Monetization ---
  {
    id: "27.6.1",
    name: "API Monetization & Usage-based Billing",
    description:
      "API monetization: tiered plans (free/starter/pro/enterprise), usage metering (API calls, records, AI tokens), overage handling, billing integration, developer dashboard với spending insights.",
    phase: 27, category: "Developer Experience", subCategory: "API Monetization",
    responsible: ["Product", "Backend Dev", "Finance"],
    aiInvolvement: "AI-Assisted", dependencies: ["22.2.2", "19.4.2"],
    duration: "5 ngày", status: "pending", priority: "High",
    deliverables: ["API tiered plans", "Usage metering", "Overage billing", "Developer spending dashboard"],
    aiTools: ["Billing AI", "Metering Engine"],
  },
  {
    id: "27.6.2",
    name: "Developer Community & Ecosystem Growth",
    description:
      "Developer community: forum (Discourse), Discord server, developer blog, hackathons, developer advocate program, certified developer program, community-built integrations showcase.",
    phase: 27, category: "Developer Experience", subCategory: "Community",
    responsible: ["DevRel", "Community Manager"],
    aiInvolvement: "Human-Led", dependencies: ["27.4.1"],
    duration: "4 ngày", status: "pending", priority: "Medium",
    deliverables: ["Developer forum", "Discord setup", "Hackathon framework", "Certification program"],
    aiTools: ["Community AI"],
  },
  {
    id: "27.6.3",
    name: "Developer Analytics & DX Metrics",
    description:
      "DX metrics tracking: time-to-first-API-call, SDK adoption rates, API endpoint popularity, error rates per SDK version, developer satisfaction (DX survey), funnel analysis (signup → first app → production).",
    phase: 27, category: "Developer Experience", subCategory: "Analytics",
    responsible: ["Data Analyst", "DX Engineer"],
    aiInvolvement: "AI-Driven", dependencies: ["27.6.1"],
    duration: "3 ngày", status: "pending", priority: "Medium",
    deliverables: ["DX metrics dashboard", "Funnel analysis", "SDK adoption tracking", "Developer satisfaction survey"],
    aiTools: ["DX Analytics AI"],
  },
];
