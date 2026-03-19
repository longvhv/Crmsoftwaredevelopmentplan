/**
 * Phase 29: BUSINESS CONTINUITY, RESILIENCE & FUTURE-PROOFING
 * Disaster recovery, multi-cloud strategy, infrastructure as code,
 * sustainability, tech debt management, long-term architecture.
 * Steps: 29.1.1 → 29.7.3 (~30 bước)
 */
import type { PlanStep } from "../../types/plan";

export const phase29Steps: PlanStep[] = [
  // --- 29.1 Disaster Recovery & Business Continuity ---
  {
    id: "29.1.1",
    name: "Business Continuity Plan (BCP)",
    description:
      "BCP toàn diện: risk assessment, impact analysis (BIA), recovery strategies per system, communication plan, team roles & responsibilities, vendor dependencies, quarterly drill schedule.",
    phase: 29, category: "Resilience", subCategory: "BCP",
    responsible: ["CTO", "DevOps", "SRE", "Legal"],
    aiInvolvement: "Human-Led", dependencies: ["16.3.1"],
    duration: "5 ngày", status: "pending", priority: "Critical",
    deliverables: ["BCP document", "Risk assessment matrix", "Communication plan", "Drill schedule"],
    aiTools: ["BCP Template AI"],
  },
  {
    id: "29.1.2",
    name: "Multi-region Active-Active Architecture",
    description:
      "Active-active deployment: traffic routing (latency-based, geo-based), data replication (sync + async), conflict resolution, health checks, automatic failover, split-brain prevention.",
    phase: 29, category: "Resilience", subCategory: "Multi-region",
    responsible: ["Architect", "DevOps", "DBA"],
    aiInvolvement: "AI-Assisted", dependencies: ["29.1.1", "25.1.1"],
    duration: "8 ngày", status: "pending", priority: "Critical",
    deliverables: ["Active-active architecture", "Data replication", "Failover automation", "Split-brain prevention"],
    aiTools: ["Multi-region AI", "CockroachDB"],
  },
  {
    id: "29.1.3",
    name: "Backup Strategy & Point-in-time Recovery",
    description:
      "Backup strategy: continuous backups (WAL archiving), point-in-time recovery (any second in last 30 days), cross-region backup replication, backup encryption, restore testing automation.",
    phase: 29, category: "Resilience", subCategory: "Backup",
    responsible: ["DBA", "DevOps"],
    aiInvolvement: "AI-Assisted", dependencies: ["29.1.2"],
    duration: "4 ngày", status: "pending", priority: "Critical",
    deliverables: ["Continuous backup setup", "PITR capability", "Cross-region replication", "Restore test automation"],
    aiTools: ["pgBackRest", "Barman"],
  },
  {
    id: "29.1.4",
    name: "Incident Response & War Room Automation",
    description:
      "Incident response: severity classification, auto-escalation, war room creation (Slack/Teams channel), runbook execution, status page updates, post-incident review (PIR) template, blameless culture.",
    phase: 29, category: "Resilience", subCategory: "Incident Response",
    responsible: ["SRE", "DevOps", "Engineering Manager"],
    aiInvolvement: "AI-Assisted", dependencies: ["29.1.1"],
    duration: "4 ngày", status: "pending", priority: "Critical",
    deliverables: ["Incident response playbook", "Auto-escalation rules", "War room automation", "PIR template"],
    aiTools: ["PagerDuty", "Incident AI"],
  },

  // --- 29.2 Multi-cloud & Vendor Independence ---
  {
    id: "29.2.1",
    name: "Multi-cloud Strategy & Abstraction Layer",
    description:
      "Multi-cloud abstraction: cloud-agnostic infrastructure layer (Terraform modules), support AWS + GCP + Azure, portable container images, cloud-agnostic storage (S3-compatible), vendor lock-in assessment.",
    phase: 29, category: "Resilience", subCategory: "Multi-cloud",
    responsible: ["Architect", "DevOps"],
    aiInvolvement: "AI-Assisted", dependencies: ["16.1.1"],
    duration: "6 ngày", status: "pending", priority: "High",
    deliverables: ["Cloud abstraction layer", "Terraform modules", "Vendor lock-in report", "Migration playbooks"],
    aiTools: ["Terraform AI", "Cloud Advisor"],
  },
  {
    id: "29.2.2",
    name: "Infrastructure as Code (IaC) Maturity",
    description:
      "IaC mature: 100% infrastructure defined in code (Terraform/Pulumi), policy as code (OPA), GitOps workflow, drift detection, cost estimation pre-deploy, environment parity.",
    phase: 29, category: "Resilience", subCategory: "IaC",
    responsible: ["DevOps", "SRE"],
    aiInvolvement: "AI-Assisted", dependencies: ["29.2.1"],
    duration: "5 ngày", status: "pending", priority: "High",
    deliverables: ["100% IaC coverage", "Policy as code", "Drift detection", "Cost estimation"],
    aiTools: ["Terraform", "Pulumi", "Infracost"],
  },

  // --- 29.3 Technical Debt Management ---
  {
    id: "29.3.1",
    name: "Technical Debt Tracking & Prioritization System",
    description:
      "Tech debt tracking: debt registry (categorized: code, architecture, test, documentation, dependency), impact scoring, interest rate estimation, debt sprints scheduling, debt-to-feature ratio.",
    phase: 29, category: "Resilience", subCategory: "Tech Debt",
    responsible: ["Tech Lead", "Engineering Manager"],
    aiInvolvement: "AI-Assisted", dependencies: [],
    duration: "3 ngày", status: "pending", priority: "High",
    deliverables: ["Debt registry", "Impact scoring system", "Sprint scheduling", "Debt ratio tracking"],
    aiTools: ["SonarQube", "Code Climate"],
  },
  {
    id: "29.3.2",
    name: "Dependency Management & Security Updates",
    description:
      "Dependency management: automated dependency updates (Dependabot/Renovate), vulnerability alerts, breaking change detection, dependency graph visualization, license compliance checking.",
    phase: 29, category: "Resilience", subCategory: "Dependencies",
    responsible: ["Backend Dev", "Frontend Dev", "Security Engineer"],
    aiInvolvement: "AI-Driven", dependencies: ["29.3.1"],
    duration: "3 ngày", status: "pending", priority: "High",
    deliverables: ["Dependabot setup", "Vulnerability alerts", "License compliance", "Dependency graph"],
    aiTools: ["Dependabot", "Renovate", "Snyk"],
  },
  {
    id: "29.3.3",
    name: "Code Quality Gates & Architecture Fitness Functions",
    description:
      "Quality gates: SonarQube integration (duplications, complexity, coverage), architecture fitness functions (dependency rules, layer violations, circular dependencies), custom quality metrics.",
    phase: 29, category: "Resilience", subCategory: "Code Quality",
    responsible: ["Tech Lead", "QA Lead"],
    aiInvolvement: "AI-Assisted", dependencies: ["29.3.1"],
    duration: "3 ngày", status: "pending", priority: "High",
    deliverables: ["SonarQube gates", "Fitness functions", "Dependency rules", "Quality dashboard"],
    aiTools: ["SonarQube", "ArchUnit"],
  },

  // --- 29.4 Sustainability & Green Engineering ---
  {
    id: "29.4.1",
    name: "Carbon Footprint Tracking & Green Engineering",
    description:
      "Carbon footprint: CO2 tracking per compute resource, green region selection, resource optimization for sustainability, carbon-aware scheduling, sustainability report cho customers.",
    phase: 29, category: "Resilience", subCategory: "Sustainability",
    responsible: ["DevOps", "Product"],
    aiInvolvement: "AI-Assisted", dependencies: ["26.5.1"],
    duration: "3 ngày", status: "pending", priority: "Medium",
    deliverables: ["CO2 tracking dashboard", "Green region recommendations", "Carbon-aware scheduling", "Sustainability report"],
    aiTools: ["Cloud Carbon Footprint", "Green AI"],
  },
  {
    id: "29.4.2",
    name: "Resource Efficiency & Cost Optimization",
    description:
      "Cost optimization: idle resource detection, right-sizing recommendations, reserved instance management, spot instance utilization, cost allocation per team/feature, budget alerts.",
    phase: 29, category: "Resilience", subCategory: "Cost Optimization",
    responsible: ["DevOps", "Finance"],
    aiInvolvement: "AI-Driven", dependencies: ["29.4.1"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["Cost optimization dashboard", "Right-sizing tool", "Reserved instance manager", "Cost allocation"],
    aiTools: ["Kubecost", "CloudHealth"],
  },

  // --- 29.5 Future Architecture ---
  {
    id: "29.5.1",
    name: "Architecture Decision Records (ADR) & Evolution",
    description:
      "ADR system: document every significant architecture decision, context, alternatives considered, consequences. Searchable ADR library, yearly architecture review, technology radar.",
    phase: 29, category: "Resilience", subCategory: "Architecture",
    responsible: ["Architect", "Tech Lead"],
    aiInvolvement: "Human-Led", dependencies: [],
    duration: "3 ngày", status: "pending", priority: "High",
    deliverables: ["ADR template", "ADR library", "Technology radar", "Yearly review process"],
    aiTools: ["ADR Tools"],
  },
  {
    id: "29.5.2",
    name: "Modular Monolith → Microservices Migration Path",
    description:
      "Migration roadmap: identify bounded contexts ready for extraction, strangler fig pattern, event-driven decomposition, service mesh setup, data ownership per service, migration risk assessment.",
    phase: 29, category: "Resilience", subCategory: "Migration",
    responsible: ["Architect", "Backend Dev"],
    aiInvolvement: "AI-Assisted", dependencies: ["29.5.1"],
    duration: "5 ngày", status: "pending", priority: "High",
    deliverables: ["Migration roadmap", "Bounded context map", "Strangler fig plan", "Risk assessment"],
    aiTools: ["Architecture AI", "DDD Tools"],
  },
  {
    id: "29.5.3",
    name: "Event Sourcing & CQRS Implementation",
    description:
      "Event sourcing cho critical domains: event store, projections, snapshots, temporal queries. CQRS separation cho read-heavy dashboards. Eventual consistency patterns, saga orchestration.",
    phase: 29, category: "Resilience", subCategory: "Event Sourcing",
    responsible: ["Architect", "Backend Dev"],
    aiInvolvement: "AI-Assisted", dependencies: ["29.5.2", "19.3.1"],
    duration: "6 ngày", status: "pending", priority: "Medium",
    deliverables: ["Event store", "Projection engine", "CQRS implementation", "Saga orchestrator"],
    aiTools: ["EventStoreDB", "Axon Framework"],
  },

  // --- 29.6 Team & Process Maturity ---
  {
    id: "29.6.1",
    name: "Engineering Handbook & Onboarding Program",
    description:
      "Engineering handbook: coding standards, review guidelines, testing philosophy, deployment process, incident response, career ladder, mentorship program. New hire onboarding (30-60-90 day plan).",
    phase: 29, category: "Resilience", subCategory: "Engineering Culture",
    responsible: ["Engineering Manager", "Tech Lead"],
    aiInvolvement: "Human-Led", dependencies: [],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["Engineering handbook", "Onboarding program", "Career ladder", "Mentorship framework"],
    aiTools: ["Documentation AI"],
  },
  {
    id: "29.6.2",
    name: "Engineering Metrics & DORA Framework",
    description:
      "DORA metrics tracking: deployment frequency, lead time for changes, change failure rate, mean time to recover. Engineering productivity metrics, developer satisfaction survey, team health checks.",
    phase: 29, category: "Resilience", subCategory: "Engineering Metrics",
    responsible: ["Engineering Manager", "DevOps"],
    aiInvolvement: "AI-Driven", dependencies: ["29.6.1"],
    duration: "3 ngày", status: "pending", priority: "High",
    deliverables: ["DORA dashboard", "Productivity metrics", "Developer survey", "Team health checks"],
    aiTools: ["DORA AI", "LinearB"],
  },

  // --- 29.7 Long-term Vision ---
  {
    id: "29.7.1",
    name: "Technology Radar & Innovation Lab",
    description:
      "Technology radar: quarterly assessment of emerging tech (assess → trial → adopt → hold). Innovation lab: 10% time for experiments, hackathon program, POC evaluation framework.",
    phase: 29, category: "Resilience", subCategory: "Innovation",
    responsible: ["CTO", "Architect", "Engineering Manager"],
    aiInvolvement: "Human-Led", dependencies: [],
    duration: "3 ngày", status: "pending", priority: "Medium",
    deliverables: ["Technology radar", "Innovation lab charter", "Hackathon program", "POC framework"],
    aiTools: ["Tech Radar Tool"],
  },
  {
    id: "29.7.2",
    name: "AI-Native Architecture Roadmap (2027-2030)",
    description:
      "Roadmap AI-native: autonomous CRM operations, multi-agent systems, real-time personalization at scale, predictive everything, zero-touch customer support, AI-designed UI/UX.",
    phase: 29, category: "Resilience", subCategory: "AI Vision",
    responsible: ["CTO", "AI Lead", "Product"],
    aiInvolvement: "AI-Driven", dependencies: ["24.2.2"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["AI roadmap 2027-2030", "Multi-agent architecture", "Zero-touch support vision", "Investment plan"],
    aiTools: ["Strategic AI Planning"],
  },
  {
    id: "29.7.3",
    name: "Competitive Moat & Market Leadership Strategy",
    description:
      "Chiến lược tạo lợi thế cạnh tranh bền vững: data network effects, AI model flywheel, ecosystem lock-in (marketplace + developer platform), vertical depth, brand authority, patent portfolio.",
    phase: 29, category: "Resilience", subCategory: "Strategy",
    responsible: ["CEO", "CTO", "Product", "Strategy"],
    aiInvolvement: "Human-Led", dependencies: ["29.7.2", "17.8.1"],
    duration: "5 ngày", status: "pending", priority: "Critical",
    deliverables: ["Competitive moat analysis", "Network effects strategy", "Ecosystem lock-in plan", "Patent portfolio plan"],
    aiTools: ["Strategy AI", "Market Intelligence"],
  },
];
