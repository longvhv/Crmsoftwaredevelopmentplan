/**
 * GENERATOR: Tạo kế hoạch đầy đủ 850 bước
 * Kết hợp detailedPlanData.ts hiện có + các bước mới (121-850)
 */

import type { PlanStep } from "../types/plan";

// Template functions để generate steps theo pattern
function generateSteps(
  startId: number,
  count: number,
  config: {
    phase: number;
    category: string;
    subCategory: string;
    prefix: string;
    baseStatus: "done" | "in-progress" | "upcoming" | "pending";
    basePriority: "Critical" | "High" | "Medium" | "Low";
    responsible: string[];
    aiInvolvement: "Manual" | "AI-Assisted" | "AI-Driven";
    durationRange: [number, number]; // days
  }
): PlanStep[] {
  const steps: PlanStep[] = [];
  
  for (let i = 0; i < count; i++) {
    const stepNum = startId + i;
    const duration = Math.floor(Math.random() * (config.durationRange[1] - config.durationRange[0] + 1)) + config.durationRange[0];
    
    steps.push({
      id: `${config.phase}.${Math.floor(stepNum / 100)}.${stepNum % 100}`,
      name: `${config.prefix} - Step ${stepNum}`,
      description: `Chi tiết implementation cho ${config.subCategory} step ${stepNum}`,
      phase: config.phase,
      category: config.category,
      subCategory: config.subCategory,
      responsible: config.responsible,
      aiInvolvement: config.aiInvolvement,
      dependencies: stepNum > startId ? [`${config.phase}.${Math.floor((stepNum-1) / 100)}.${(stepNum-1) % 100}`] : [],
      duration: `${duration} ngày`,
      status: config.baseStatus,
      priority: config.basePriority,
      deliverables: [`Deliverable ${stepNum}A`, `Deliverable ${stepNum}B`],
      aiTools: config.aiInvolvement !== "Manual" ? ["AI Code Assistant"] : [],
    });
  }
  
  return steps;
}

// ============================================================
// PHASE 3: ENHANCED CRM CORE PAGES (Steps 121-300) - 180 bước
// ============================================================

const phase3Steps: PlanStep[] = [
  // 3.1 Contacts Advanced (121-145) - 25 bước
  ...generateSteps(121, 25, {
    phase: 3,
    category: "CRM Pages",
    subCategory: "Contacts Advanced",
    prefix: "Contact",
    baseStatus: "upcoming",
    basePriority: "High",
    responsible: ["Frontend Dev", "Backend Dev"],
    aiInvolvement: "AI-Assisted",
    durationRange: [2, 4],
  }),
  
  // 3.2 Companies Advanced (146-170) - 25 bước
  ...generateSteps(146, 25, {
    phase: 3,
    category: "CRM Pages",
    subCategory: "Companies Advanced",
    prefix: "Company",
    baseStatus: "upcoming",
    basePriority: "High",
    responsible: ["Frontend Dev", "Backend Dev"],
    aiInvolvement: "AI-Assisted",
    durationRange: [2, 4],
  }),
  
  // 3.3 Deals/Opportunities (171-195) - 25 bước
  ...generateSteps(171, 25, {
    phase: 3,
    category: "CRM Pages",
    subCategory: "Deals & Opportunities",
    prefix: "Deal",
    baseStatus: "upcoming",
    basePriority: "Critical",
    responsible: ["Frontend Dev", "Backend Dev", "AI Engineer"],
    aiInvolvement: "AI-Driven",
    durationRange: [2, 5],
  }),
  
  // 3.4 Activities & Tasks (196-220) - 25 bước
  ...generateSteps(196, 25, {
    phase: 3,
    category: "CRM Pages",
    subCategory: "Activities & Tasks",
    prefix: "Activity",
    baseStatus: "upcoming",
    basePriority: "High",
    responsible: ["Frontend Dev", "Backend Dev"],
    aiInvolvement: "AI-Assisted",
    durationRange: [2, 3],
  }),
  
  // 3.5 Document Management (221-245) - 25 bước
  ...generateSteps(221, 25, {
    phase: 3,
    category: "CRM Pages",
    subCategory: "Document Management",
    prefix: "Document",
    baseStatus: "upcoming",
    basePriority: "Medium",
    responsible: ["Frontend Dev", "Backend Dev"],
    aiInvolvement: "AI-Assisted",
    durationRange: [2, 4],
  }),
  
  // 3.6 Email Integration (246-270) - 25 bước
  ...generateSteps(246, 25, {
    phase: 3,
    category: "CRM Pages",
    subCategory: "Email Integration",
    prefix: "Email",
    baseStatus: "upcoming",
    basePriority: "Critical",
    responsible: ["Backend Dev", "Integration Specialist"],
    aiInvolvement: "AI-Driven",
    durationRange: [3, 5],
  }),
  
  // 3.7 Reporting & Dashboards (271-300) - 30 bước
  ...generateSteps(271, 30, {
    phase: 3,
    category: "CRM Pages",
    subCategory: "Reporting & Dashboards",
    prefix: "Report",
    baseStatus: "upcoming",
    basePriority: "High",
    responsible: ["Frontend Dev", "Data Analyst"],
    aiInvolvement: "AI-Driven",
    durationRange: [2, 4],
  }),
];

// ============================================================
// PHASE 4: ADVANCED CRM FEATURES (Steps 301-550) - 250 bước
// ============================================================

const phase4Steps: PlanStep[] = [
  // 4.1 Sales Pipeline & Forecasting (301-340) - 40 bước
  ...generateSteps(301, 40, {
    phase: 4,
    category: "Advanced Features",
    subCategory: "Sales Pipeline",
    prefix: "Pipeline",
    baseStatus: "pending",
    basePriority: "Critical",
    responsible: ["Frontend Dev", "Backend Dev", "AI Engineer"],
    aiInvolvement: "AI-Driven",
    durationRange: [3, 5],
  }),
  
  // 4.2 Marketing Automation (341-380) - 40 bước
  ...generateSteps(341, 40, {
    phase: 4,
    category: "Advanced Features",
    subCategory: "Marketing Automation",
    prefix: "Marketing",
    baseStatus: "pending",
    basePriority: "High",
    responsible: ["Frontend Dev", "Backend Dev", "Marketing Ops"],
    aiInvolvement: "AI-Driven",
    durationRange: [3, 5],
  }),
  
  // 4.3 Workflow Automation (381-420) - 40 bước
  ...generateSteps(381, 40, {
    phase: 4,
    category: "Advanced Features",
    subCategory: "Workflow Automation",
    prefix: "Workflow",
    baseStatus: "pending",
    basePriority: "Critical",
    responsible: ["Backend Dev", "DevOps"],
    aiInvolvement: "AI-Assisted",
    durationRange: [3, 6],
  }),
  
  // 4.4 Advanced Analytics (421-460) - 40 bước
  ...generateSteps(421, 40, {
    phase: 4,
    category: "Advanced Features",
    subCategory: "Advanced Analytics",
    prefix: "Analytics",
    baseStatus: "pending",
    basePriority: "High",
    responsible: ["Data Engineer", "Data Scientist", "AI Engineer"],
    aiInvolvement: "AI-Driven",
    durationRange: [3, 5],
  }),
  
  // 4.5 Integration Platform (461-500) - 40 bước
  ...generateSteps(461, 40, {
    phase: 4,
    category: "Advanced Features",
    subCategory: "Integration Platform",
    prefix: "Integration",
    baseStatus: "pending",
    basePriority: "High",
    responsible: ["Backend Dev", "Integration Specialist"],
    aiInvolvement: "AI-Assisted",
    durationRange: [3, 5],
  }),
  
  // 4.6 Mobile Application (501-540) - 40 bước
  ...generateSteps(501, 40, {
    phase: 4,
    category: "Advanced Features",
    subCategory: "Mobile Application",
    prefix: "Mobile",
    baseStatus: "pending",
    basePriority: "High",
    responsible: ["Mobile Dev", "Backend Dev"],
    aiInvolvement: "AI-Assisted",
    durationRange: [3, 5],
  }),
  
  // 4.7 Advanced Security & Compliance (541-550) - 10 bước
  ...generateSteps(541, 10, {
    phase: 4,
    category: "Advanced Features",
    subCategory: "Security & Compliance",
    prefix: "Security",
    baseStatus: "pending",
    basePriority: "Critical",
    responsible: ["Security Engineer", "Compliance Officer"],
    aiInvolvement: "Manual",
    durationRange: [3, 7],
  }),
];

// ============================================================
// PHASE 5: AI INTEGRATION & WORLD-CLASS (Steps 551-850) - 300 bước
// ============================================================

const phase5Steps: PlanStep[] = [
  // 5.1 AI Agents & Automation (551-630) - 80 bước
  ...generateSteps(551, 80, {
    phase: 5,
    category: "AI Integration",
    subCategory: "AI Agents",
    prefix: "AI Agent",
    baseStatus: "pending",
    basePriority: "Critical",
    responsible: ["AI Engineer", "ML Engineer", "Backend Dev"],
    aiInvolvement: "AI-Driven",
    durationRange: [3, 7],
  }),
  
  // 5.2 Conversational UI & Voice (631-680) - 50 bước
  ...generateSteps(631, 50, {
    phase: 5,
    category: "AI Integration",
    subCategory: "Conversational UI",
    prefix: "Conversational",
    baseStatus: "pending",
    basePriority: "High",
    responsible: ["AI Engineer", "Frontend Dev"],
    aiInvolvement: "AI-Driven",
    durationRange: [3, 5],
  }),
  
  // 5.3 Predictive Analytics (681-730) - 50 bước
  ...generateSteps(681, 50, {
    phase: 5,
    category: "AI Integration",
    subCategory: "Predictive Analytics",
    prefix: "Predictive",
    baseStatus: "pending",
    basePriority: "High",
    responsible: ["Data Scientist", "ML Engineer"],
    aiInvolvement: "AI-Driven",
    durationRange: [4, 7],
  }),
  
  // 5.4 Advanced Search & Knowledge Graph (731-780) - 50 bước
  ...generateSteps(731, 50, {
    phase: 5,
    category: "AI Integration",
    subCategory: "Search & Knowledge",
    prefix: "Search",
    baseStatus: "pending",
    basePriority: "Medium",
    responsible: ["AI Engineer", "Backend Dev"],
    aiInvolvement: "AI-Driven",
    durationRange: [3, 5],
  }),
  
  // 5.5 Performance & Scalability (781-820) - 40 bước
  ...generateSteps(781, 40, {
    phase: 5,
    category: "Performance",
    subCategory: "Optimization & Scale",
    prefix: "Performance",
    baseStatus: "pending",
    basePriority: "Critical",
    responsible: ["Backend Dev", "DevOps", "SRE"],
    aiInvolvement: "AI-Assisted",
    durationRange: [3, 5],
  }),
  
  // 5.6 Launch, Testing & Go-Live (821-850) - 30 bước
  ...generateSteps(821, 30, {
    phase: 5,
    category: "Launch",
    subCategory: "Production Launch",
    prefix: "Launch",
    baseStatus: "pending",
    basePriority: "Critical",
    responsible: ["PM", "DevOps", "QA", "Support"],
    aiInvolvement: "AI-Assisted",
    durationRange: [2, 5],
  }),
];

// ============================================================
// COMBINE ALL STEPS
// ============================================================

export const fullPlanSteps: PlanStep[] = [
  ...phase3Steps,
  ...phase4Steps,
  ...phase5Steps,
];

// Summary function
export function getPlanSummary() {
  return {
    phase3: {
      name: "Enhanced CRM Core Pages",
      range: "121-300",
      count: phase3Steps.length,
      categories: [...new Set(phase3Steps.map(s => s.subCategory))],
    },
    phase4: {
      name: "Advanced CRM Features",
      range: "301-550",
      count: phase4Steps.length,
      categories: [...new Set(phase4Steps.map(s => s.subCategory))],
    },
    phase5: {
      name: "AI Integration & World-Class",
      range: "551-850",
      count: phase5Steps.length,
      categories: [...new Set(phase5Steps.map(s => s.subCategory))],
    },
    total: phase3Steps.length + phase4Steps.length + phase5Steps.length,
  };
}
