/**
 * Phase 25: DATA SOVEREIGNTY, PRIVACY ENGINEERING & TRUST CENTER
 * GDPR/CCPA/PDPA compliance automation, data residency,
 * privacy-by-design, consent management, trust center,
 * right to erasure, data processing agreements.
 * Steps: 25.1.1 → 25.6.3 (~28 bước)
 */
import type { PlanStep } from "../../types/plan";

export const phase25Steps: PlanStep[] = [
  // --- 25.1 Data Residency & Sovereignty ---
  {
    id: "25.1.1",
    name: "Multi-region Data Residency Architecture",
    description:
      "Architecture lưu trữ dữ liệu theo vùng: Vietnam (HCM/HN), Singapore, US (East/West), EU (Frankfurt/Ireland), Japan (Tokyo). Tenant-level region selection, data never leaves chosen region.",
    phase: 25, category: "Privacy", subCategory: "Data Residency",
    responsible: ["Architect", "DevOps", "Legal"],
    aiInvolvement: "Human-Led", dependencies: ["16.4.1"],
    duration: "7 ngày", status: "pending", priority: "Critical",
    deliverables: ["Multi-region architecture", "Region selection per tenant", "Data isolation verification", "Compliance documentation"],
    aiTools: ["Cloud Architecture AI"],
  },
  {
    id: "25.1.2",
    name: "Cross-border Data Transfer Compliance",
    description:
      "Compliance cho chuyển dữ liệu xuyên biên giới: Standard Contractual Clauses (SCCs), Binding Corporate Rules, adequacy decisions mapping, transfer impact assessments, encryption in transit.",
    phase: 25, category: "Privacy", subCategory: "Cross-border",
    responsible: ["Legal", "Security Engineer"],
    aiInvolvement: "AI-Assisted", dependencies: ["25.1.1"],
    duration: "4 ngày", status: "pending", priority: "Critical",
    deliverables: ["SCCs templates", "Transfer impact assessment tool", "Adequacy mapping", "Encryption verification"],
    aiTools: ["Privacy Compliance AI"],
  },

  // --- 25.2 GDPR Compliance Engine ---
  {
    id: "25.2.1",
    name: "GDPR/CCPA/PDPA Compliance Automation Engine",
    description:
      "Engine tự động hoá compliance: lawful basis tracking per data processing activity, data mapping (what data, where stored, who accessed, retention period), processing register (Article 30).",
    phase: 25, category: "Privacy", subCategory: "GDPR",
    responsible: ["Backend Dev", "Legal", "DPO"],
    aiInvolvement: "AI-Assisted", dependencies: ["9.2.1"],
    duration: "6 ngày", status: "pending", priority: "Critical",
    deliverables: ["Compliance engine", "Lawful basis tracker", "Data mapping tool", "Processing register"],
    aiTools: ["GDPR Compliance AI", "OneTrust"],
  },
  {
    id: "25.2.2",
    name: "Right to Erasure (RTBF) & Data Portability",
    description:
      "Right to be forgotten: automated data deletion workflow (main DB + backups + logs + analytics + third-party), verification, audit trail. Data portability: export all user data in standard formats (JSON, CSV).",
    phase: 25, category: "Privacy", subCategory: "Data Rights",
    responsible: ["Backend Dev", "DevOps"],
    aiInvolvement: "AI-Assisted", dependencies: ["25.2.1"],
    duration: "5 ngày", status: "pending", priority: "Critical",
    deliverables: ["Erasure workflow", "Backup cleanup", "Third-party deletion", "Data export tool"],
    aiTools: ["Data Deletion AI"],
  },
  {
    id: "25.2.3",
    name: "Data Subject Access Request (DSAR) Portal",
    description:
      "Self-service DSAR portal: khách hàng request xem/xóa/chỉnh sửa data, identity verification, request tracking, SLA compliance (30 days GDPR), auto-response for simple requests.",
    phase: 25, category: "Privacy", subCategory: "DSAR",
    responsible: ["Frontend Dev", "Backend Dev", "Legal"],
    aiInvolvement: "AI-Assisted", dependencies: ["25.2.2"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["DSAR portal UI", "Identity verification", "Request tracking dashboard", "Auto-response engine"],
    aiTools: ["DSAR Automation"],
  },

  // --- 25.3 Consent Management ---
  {
    id: "25.3.1",
    name: "Consent Management Platform (CMP)",
    description:
      "CMP toàn diện: cookie consent banners, granular consent options (analytics, marketing, personalization), consent storage & audit, preference center, consent withdrawal, TCF v2.2 support.",
    phase: 25, category: "Privacy", subCategory: "Consent",
    responsible: ["Frontend Dev", "Backend Dev", "Legal"],
    aiInvolvement: "AI-Assisted", dependencies: ["25.2.1"],
    duration: "5 ngày", status: "pending", priority: "Critical",
    deliverables: ["CMP platform", "Cookie consent banners", "Preference center", "TCF v2.2 compliance"],
    aiTools: ["Consent AI"],
  },
  {
    id: "25.3.2",
    name: "Marketing Consent & Unsubscribe Management",
    description:
      "Marketing consent: double opt-in, channel-level consent (email, SMS, push, WhatsApp), unsubscribe center, suppression lists, consent sync across systems, re-permission campaigns.",
    phase: 25, category: "Privacy", subCategory: "Marketing Consent",
    responsible: ["Backend Dev", "Marketing"],
    aiInvolvement: "AI-Assisted", dependencies: ["25.3.1"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["Double opt-in system", "Channel-level consent", "Unsubscribe center", "Suppression lists"],
    aiTools: ["Email Compliance"],
  },

  // --- 25.4 Privacy-by-Design Implementation ---
  {
    id: "25.4.1",
    name: "PII Detection & Auto-classification",
    description:
      "AI tự động detect PII trong tất cả data inputs: tên, email, phone, CCCD/CMND, tài khoản ngân hàng, địa chỉ. Auto-classify sensitivity level, apply masking rules, alert on unexpected PII.",
    phase: 25, category: "Privacy", subCategory: "PII Detection",
    responsible: ["AI Engineer", "Security Engineer"],
    aiInvolvement: "AI-Driven", dependencies: ["25.2.1"],
    duration: "5 ngày", status: "pending", priority: "Critical",
    deliverables: ["PII detection model", "Auto-classification", "Masking rules engine", "PII alerts"],
    aiTools: ["PII Detector AI", "NER Model"],
  },
  {
    id: "25.4.2",
    name: "Data Anonymization & Pseudonymization",
    description:
      "Anonymization/pseudonymization engine: k-anonymity, l-diversity, t-closeness. Pseudonymization cho analytics (reversible with key), full anonymization cho test data. Utility preservation metrics.",
    phase: 25, category: "Privacy", subCategory: "Anonymization",
    responsible: ["Backend Dev", "Data Engineer"],
    aiInvolvement: "AI-Driven", dependencies: ["25.4.1"],
    duration: "5 ngày", status: "pending", priority: "High",
    deliverables: ["Anonymization engine", "Pseudonymization service", "k-anonymity verification", "Utility metrics"],
    aiTools: ["Anonymization AI", "ARX"],
  },
  {
    id: "25.4.3",
    name: "Data Retention & Lifecycle Management",
    description:
      "Data retention policies: configurable retention periods per data type, auto-archival, auto-deletion, legal hold capability, retention exceptions, compliance reporting.",
    phase: 25, category: "Privacy", subCategory: "Data Retention",
    responsible: ["Backend Dev", "Legal", "DevOps"],
    aiInvolvement: "AI-Assisted", dependencies: ["25.2.1"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["Retention policy engine", "Auto-archival system", "Legal hold", "Compliance reports"],
    aiTools: ["Retention Manager"],
  },

  // --- 25.5 Trust Center ---
  {
    id: "25.5.1",
    name: "Public Trust Center & Security Portal",
    description:
      "Trust center public page: security certifications (SOC 2, ISO 27001), privacy practices, data handling, sub-processor list, incident history, SLA commitments, compliance documents download.",
    phase: 25, category: "Privacy", subCategory: "Trust Center",
    responsible: ["Frontend Dev", "Security Engineer", "Legal"],
    aiInvolvement: "AI-Assisted", dependencies: ["9.3.1"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["Trust center website", "Certification display", "Sub-processor list", "Document downloads"],
    aiTools: ["Trust Portal Builder"],
  },
  {
    id: "25.5.2",
    name: "Security Questionnaire Automation",
    description:
      "Tự động trả lời security questionnaires từ enterprise prospects: AI match câu hỏi với knowledge base, auto-fill responses, approval workflow, response library, SIG/CAIQ/VSA support.",
    phase: 25, category: "Privacy", subCategory: "Questionnaires",
    responsible: ["Security Engineer", "AI Engineer", "Sales"],
    aiInvolvement: "AI-Driven", dependencies: ["25.5.1", "24.1.1"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["Questionnaire AI responder", "Response library", "Auto-fill engine", "Approval workflow"],
    aiTools: ["Security AI", "RAG Responder"],
  },

  // --- 25.6 Privacy Impact & Monitoring ---
  {
    id: "25.6.1",
    name: "Privacy Impact Assessment (PIA) Workflow",
    description:
      "PIA tool: automated assessment cho new features/data processing, risk scoring, mitigation recommendations, DPO review workflow, audit trail, template library per processing type.",
    phase: 25, category: "Privacy", subCategory: "PIA",
    responsible: ["DPO", "Product", "Backend Dev"],
    aiInvolvement: "AI-Assisted", dependencies: ["25.2.1"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["PIA workflow tool", "Risk scoring engine", "DPO review portal", "Template library"],
    aiTools: ["PIA AI"],
  },
  {
    id: "25.6.2",
    name: "Real-time Privacy Monitoring & Breach Detection",
    description:
      "Privacy monitoring: real-time data access logging, unusual access pattern detection, bulk export alerts, cross-border transfer monitoring, 72-hour breach notification workflow (GDPR Art. 33).",
    phase: 25, category: "Privacy", subCategory: "Monitoring",
    responsible: ["Security Engineer", "DevOps"],
    aiInvolvement: "AI-Driven", dependencies: ["25.4.1", "9.4.1"],
    duration: "5 ngày", status: "pending", priority: "Critical",
    deliverables: ["Privacy monitoring system", "Anomaly detection", "Breach notification workflow", "72-hour compliance timer"],
    aiTools: ["Privacy Monitor AI", "SIEM Integration"],
  },
  {
    id: "25.6.3",
    name: "Privacy Compliance Dashboard & Reporting",
    description:
      "Dashboard compliance tổng hợp: GDPR/CCPA/PDPA compliance score, open DSARs, consent statistics, retention policy compliance, PIA status, breach history, audit readiness score.",
    phase: 25, category: "Privacy", subCategory: "Dashboard",
    responsible: ["Frontend Dev", "DPO"],
    aiInvolvement: "AI-Assisted", dependencies: ["25.6.2"],
    duration: "3 ngày", status: "pending", priority: "High",
    deliverables: ["Privacy compliance dashboard", "Compliance scoring", "DSAR tracking", "Audit readiness report"],
    aiTools: ["Compliance Dashboard AI"],
  },
];
