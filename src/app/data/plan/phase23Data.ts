/**
 * Phase 23: CUSTOMER SUCCESS & RETENTION PLATFORM
 * Health scoring, onboarding automation, churn prevention,
 * QBR automation, renewal management, advocacy programs.
 * Steps: 23.1.1 → 23.6.4 (~30 bước)
 */
import type { PlanStep } from "../../types/plan";

export const phase23Steps: PlanStep[] = [
  // --- 23.1 Customer Health Scoring ---
  {
    id: "23.1.1",
    name: "AI Customer Health Score Engine",
    description:
      "Health score engine đa chiều: product usage (login frequency, feature adoption, DAU/MAU), support sentiment, payment behavior, engagement (email opens, event attendance), NPS/CSAT trends. Composite score 0-100 với weights tuỳ chỉnh.",
    phase: 23, category: "Customer Success", subCategory: "Health Scoring",
    responsible: ["AI Engineer", "CS Lead", "Product"],
    aiInvolvement: "AI-Driven", dependencies: ["7.2.1", "14.1.1"],
    duration: "6 ngày", status: "pending", priority: "Critical",
    deliverables: ["Health score model", "Multi-dimension scoring", "Weight customization", "Real-time updates"],
    aiTools: ["Health Score AI", "ML Pipeline"],
  },
  {
    id: "23.1.2",
    name: "Health Score Dashboard & Alert System",
    description:
      "Dashboard health scores: portfolio view, trend charts, segment comparison, risk matrix (health vs revenue), early warning alerts (score drop > 10 points), auto-assign CSM tasks.",
    phase: 23, category: "Customer Success", subCategory: "Dashboard",
    responsible: ["Frontend Dev", "CS Lead"],
    aiInvolvement: "AI-Driven", dependencies: ["23.1.1"],
    duration: "4 ngày", status: "pending", priority: "Critical",
    deliverables: ["Health dashboard", "Risk matrix", "Early warning alerts", "Auto-task assignment"],
    aiTools: ["Dashboard AI", "Alert Engine"],
  },

  // --- 23.2 Onboarding Automation ---
  {
    id: "23.2.1",
    name: "Customer Onboarding Workflow Builder",
    description:
      "Onboarding workflow visual builder: multi-step journeys, conditional branching (company size, industry, plan), milestone tracking, task assignment (CSM + customer), progress dashboard.",
    phase: 23, category: "Customer Success", subCategory: "Onboarding",
    responsible: ["Product", "Frontend Dev", "CS Lead"],
    aiInvolvement: "AI-Assisted", dependencies: ["14.2.1"],
    duration: "5 ngày", status: "pending", priority: "Critical",
    deliverables: ["Onboarding workflow builder", "Milestone tracking", "Task assignment system", "Progress dashboard"],
    aiTools: ["Workflow AI"],
  },
  {
    id: "23.2.2",
    name: "In-app Guides & Product Tours",
    description:
      "Product tours tích hợp: step-by-step guides, tooltips, hotspots, checklists, video walkthroughs. Segment-based tours (new user, power user, admin). Completion tracking & analytics.",
    phase: 23, category: "Customer Success", subCategory: "In-app Guides",
    responsible: ["Frontend Dev", "Product"],
    aiInvolvement: "AI-Assisted", dependencies: ["23.2.1"],
    duration: "5 ngày", status: "pending", priority: "High",
    deliverables: ["Product tour engine", "Tooltip/hotspot system", "Checklist widget", "Tour analytics"],
    aiTools: ["Tour Builder AI"],
  },
  {
    id: "23.2.3",
    name: "Time-to-Value Optimization",
    description:
      "Đo lường & tối ưu time-to-value: first value milestones per persona, bottleneck detection, personalized onboarding paths, A/B testing onboarding flows. Target: reduce TTV 30%.",
    phase: 23, category: "Customer Success", subCategory: "TTV",
    responsible: ["Product", "AI Engineer", "CS Lead"],
    aiInvolvement: "AI-Driven", dependencies: ["23.2.2"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["TTV measurement framework", "Bottleneck detection", "Personalized paths", "A/B testing setup"],
    aiTools: ["TTV Optimizer AI", "Funnel Analyzer"],
  },

  // --- 23.3 Churn Prevention & Rescue ---
  {
    id: "23.3.1",
    name: "AI Churn Prediction & Risk Segmentation",
    description:
      "Churn prediction model: 30/60/90 day churn probability, risk segmentation (at-risk, watch, healthy, champion), root cause analysis per customer, save probability scoring.",
    phase: 23, category: "Customer Success", subCategory: "Churn Prevention",
    responsible: ["AI Engineer", "CS Lead"],
    aiInvolvement: "AI-Driven", dependencies: ["23.1.1", "7.3.1"],
    duration: "6 ngày", status: "pending", priority: "Critical",
    deliverables: ["Churn prediction model", "Risk segmentation", "Root cause analyzer", "Save probability score"],
    aiTools: ["Churn AI", "CatBoost", "SHAP Explainer"],
  },
  {
    id: "23.3.2",
    name: "Automated Rescue Playbooks",
    description:
      "Playbooks tự động rescue at-risk customers: triggered by health score drop, customized actions per risk reason (usage drop → training session, support issues → exec sponsor call, payment → flexible terms).",
    phase: 23, category: "Customer Success", subCategory: "Rescue Playbooks",
    responsible: ["CS Lead", "Backend Dev"],
    aiInvolvement: "AI-Driven", dependencies: ["23.3.1"],
    duration: "5 ngày", status: "pending", priority: "Critical",
    deliverables: ["Automated playbook engine", "Risk-based action library", "Escalation rules", "Save rate tracking"],
    aiTools: ["Playbook AI", "Action Recommender"],
  },
  {
    id: "23.3.3",
    name: "Win-back Campaign Engine",
    description:
      "Campaigns win-back churned customers: automated email sequences, personalized offers, re-engagement scoring, win-back attribution. Analysis: why they left, what changed, probability of return.",
    phase: 23, category: "Customer Success", subCategory: "Win-back",
    responsible: ["CS Lead", "Marketing"],
    aiInvolvement: "AI-Driven", dependencies: ["23.3.2"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["Win-back campaign engine", "Personalized offer generator", "Re-engagement scoring", "Win-back analytics"],
    aiTools: ["Campaign AI", "Offer Optimizer"],
  },

  // --- 23.4 QBR & Business Reviews ---
  {
    id: "23.4.1",
    name: "Automated QBR (Quarterly Business Review) Builder",
    description:
      "AI tự động tạo QBR deck: auto-pull usage data, ROI calculations, success metrics, benchmark vs peers, goal progress, next quarter recommendations. Customizable per account.",
    phase: 23, category: "Customer Success", subCategory: "QBR",
    responsible: ["AI Engineer", "CS Lead", "Frontend Dev"],
    aiInvolvement: "AI-Driven", dependencies: ["23.1.1", "21.1.3"],
    duration: "5 ngày", status: "pending", priority: "High",
    deliverables: ["QBR auto-generator", "ROI calculator", "Peer benchmarking", "Goal tracking"],
    aiTools: ["QBR AI", "Benchmark Engine"],
  },
  {
    id: "23.4.2",
    name: "Success Plan & Goal Management",
    description:
      "Success plans per customer: joint objectives (customer + CSM), milestones, KPI tracking, risk flags. Templates per industry/company size. Progress reviews, plan revision history.",
    phase: 23, category: "Customer Success", subCategory: "Success Plans",
    responsible: ["Product", "CS Lead"],
    aiInvolvement: "AI-Assisted", dependencies: ["23.4.1"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["Success plan builder", "Joint objective tracking", "KPI dashboard per customer", "Plan templates"],
    aiTools: ["Goal Tracker AI"],
  },

  // --- 23.5 Renewal Management ---
  {
    id: "23.5.1",
    name: "Renewal Pipeline & Forecasting",
    description:
      "Pipeline renewals: upcoming renewals board (30/60/90/180 days), renewal probability scoring (based on health + usage + engagement), revenue at risk, auto-reminders, CSM assignment.",
    phase: 23, category: "Customer Success", subCategory: "Renewals",
    responsible: ["CS Lead", "Backend Dev", "Finance"],
    aiInvolvement: "AI-Driven", dependencies: ["23.1.1", "22.3.1"],
    duration: "5 ngày", status: "pending", priority: "Critical",
    deliverables: ["Renewal pipeline board", "Probability scoring", "Revenue at risk dashboard", "Auto-reminder system"],
    aiTools: ["Renewal AI", "Forecast Engine"],
  },
  {
    id: "23.5.2",
    name: "Expansion Revenue & Upsell Intelligence",
    description:
      "AI phát hiện upsell/cross-sell opportunities: feature usage gaps, peer comparison, growth signals (headcount increase, new offices), timing optimization. Revenue expansion playbooks.",
    phase: 23, category: "Customer Success", subCategory: "Expansion",
    responsible: ["AI Engineer", "CS Lead", "Sales"],
    aiInvolvement: "AI-Driven", dependencies: ["23.5.1", "12.1.1"],
    duration: "5 ngày", status: "pending", priority: "High",
    deliverables: ["Upsell detection model", "Cross-sell recommender", "Growth signal tracker", "Expansion playbooks"],
    aiTools: ["Expansion AI", "Signal Detection"],
  },

  // --- 23.6 Advocacy & Community ---
  {
    id: "23.6.1",
    name: "Customer Advocacy Platform",
    description:
      "Advocacy program: reference customers database, case study pipeline, speaking opportunities, beta testers pool, G2/Capterra review campaigns. Advocacy score per customer.",
    phase: 23, category: "Customer Success", subCategory: "Advocacy",
    responsible: ["CS Lead", "Marketing", "Product"],
    aiInvolvement: "AI-Assisted", dependencies: ["23.1.1"],
    duration: "4 ngày", status: "pending", priority: "Medium",
    deliverables: ["Advocacy platform", "Reference database", "Case study pipeline", "Review campaign engine"],
    aiTools: ["Advocacy AI"],
  },
  {
    id: "23.6.2",
    name: "Customer Community & Forum",
    description:
      "Community platform: discussion forums (product feedback, best practices, Q&A), user groups per industry, events calendar, idea voting, knowledge sharing. Gamification (points, badges, levels).",
    phase: 23, category: "Customer Success", subCategory: "Community",
    responsible: ["Frontend Dev", "Product", "Community Manager"],
    aiInvolvement: "AI-Assisted", dependencies: ["23.6.1"],
    duration: "5 ngày", status: "pending", priority: "Medium",
    deliverables: ["Community forum", "User groups", "Idea voting board", "Gamification system"],
    aiTools: ["Community AI", "Moderation AI"],
  },
  {
    id: "23.6.3",
    name: "AI Customer Success Copilot",
    description:
      "AI copilot cho CSM: next best action per account, talking points trước meeting, email draft suggestions, risk explanations, portfolio prioritization. Proactive alert summaries mỗi sáng.",
    phase: 23, category: "Customer Success", subCategory: "AI Copilot",
    responsible: ["AI Engineer", "CS Lead"],
    aiInvolvement: "AI-Driven", dependencies: ["23.1.1", "23.3.1", "12.2.1"],
    duration: "5 ngày", status: "pending", priority: "High",
    deliverables: ["CS Copilot", "Next best action engine", "Meeting talking points", "Morning briefing AI"],
    aiTools: ["GPT-4o", "CS Intelligence Engine"],
  },
  {
    id: "23.6.4",
    name: "Customer Success Analytics & ROI Tracking",
    description:
      "Analytics tổng hợp CS: NRR per CSM, time-to-value trends, health score correlation with retention, CS team capacity planning, ROI of CS activities. Board-level CS metrics.",
    phase: 23, category: "Customer Success", subCategory: "Analytics",
    responsible: ["Data Analyst", "CS Lead"],
    aiInvolvement: "AI-Driven", dependencies: ["23.5.1", "23.3.1"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["CS analytics dashboard", "NRR per CSM tracking", "CS ROI calculator", "Capacity planning"],
    aiTools: ["CS Analytics AI"],
  },
];
