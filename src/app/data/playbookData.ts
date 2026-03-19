/**
 * Mock data — Sales Playbook Library
 * Phase 6 — Centralized data layer
 */
import type { Playbook, PlaybookBattleCard } from "../types/crm";

export const playbooks: Playbook[] = [
  {
    id: "pb01", name: "MEDDPICC Enterprise Qualification", type: "methodology",
    description: "Framework chuẩn cho enterprise deals >2B₫. Bao gồm: Metrics scoring, Economic Buyer identification, Decision process mapping, Champion development, Competition tracking.",
    stages: ["discovery", "demo", "proposal", "negotiation"],
    steps: 24, completedByReps: 5, totalReps: 7, winRateImpact: 18, avgDealVelocity: -12,
    lastUpdated: "2026-03-02", author: "Sales Director", rating: 4.8, isAIGenerated: false,
    tags: ["Enterprise", "Qualification", "MEDDPICC"],
  },
  {
    id: "pb02", name: "Challenger Sale — Teaching Playbook", type: "methodology",
    description: "Playbook Challenger: insight delivery per industry, tailoring per persona, controlled negotiation framework. Bao gồm 15 teaching moments + 8 tailoring templates.",
    stages: ["prospecting", "discovery", "demo", "proposal"],
    steps: 18, completedByReps: 3, totalReps: 7, winRateImpact: 15, avgDealVelocity: -8,
    lastUpdated: "2026-02-25", author: "AI Agent — Aria", rating: 4.5, isAIGenerated: true,
    tags: ["Challenger", "Methodology", "Teaching"],
  },
  {
    id: "pb03", name: "SMB Quick Close Process", type: "process",
    description: "Quy trình fast-track cho SMB deals <500M₫. Mục tiêu: close trong 21 ngày. Bao gồm: single-call discovery+demo, template proposal, e-sign ready contracts.",
    stages: ["prospecting", "discovery", "demo", "closing"],
    steps: 12, completedByReps: 6, totalReps: 7, winRateImpact: 22, avgDealVelocity: -35,
    lastUpdated: "2026-03-01", author: "Phạm Văn Khôi", rating: 4.9, isAIGenerated: false,
    tags: ["SMB", "Fast-track", "Efficiency"],
  },
  {
    id: "pb04", name: "Price Objection Playbook", type: "objection",
    description: "15 kịch bản xử lý objection về giá: value reframing, TCO comparison, ROI demonstration, payment flexibility, phased rollout. Mỗi kịch bản có 3 response variants theo buyer persona.",
    stages: ["negotiation", "closing"],
    steps: 15, completedByReps: 7, totalReps: 7, winRateImpact: 12, avgDealVelocity: -5,
    lastUpdated: "2026-02-28", author: "AI + Human", rating: 4.6, isAIGenerated: true,
    tags: ["Pricing", "Objection", "Negotiation"],
  },
  {
    id: "pb05", name: "Competitor Displacement — HubSpot", type: "battle-card",
    description: "Chiến lược thay thế HubSpot: feature comparison matrix, migration plan, pricing advantage analysis, customer success stories, integration superiority.",
    stages: ["discovery", "demo", "proposal", "negotiation"],
    steps: 20, completedByReps: 4, totalReps: 7, winRateImpact: 25, avgDealVelocity: 0,
    lastUpdated: "2026-03-03", author: "Product Marketing", rating: 4.7, isAIGenerated: false,
    tags: ["HubSpot", "Competitive", "Displacement"],
  },
  {
    id: "pb06", name: "New Rep Onboarding — 30/60/90 Day", type: "onboarding",
    description: "Chương trình onboarding 90 ngày: Week 1-4 product knowledge, Week 5-8 methodology training + shadowing, Week 9-12 first deals + coaching. Bao gồm certification checkpoints.",
    stages: ["prospecting", "discovery", "demo", "proposal", "negotiation", "closing"],
    steps: 30, completedByReps: 2, totalReps: 7, winRateImpact: 0, avgDealVelocity: 0,
    lastUpdated: "2026-02-20", author: "Sales Enablement", rating: 4.3, isAIGenerated: false,
    tags: ["Onboarding", "Training", "Certification"],
  },
  {
    id: "pb07", name: "AI-Generated: Expansion Playbook", type: "process",
    description: "AI phân tích 50+ successful expansions → auto-generated playbook: optimal timing (3 months post-go-live), trigger signals (usage >80%, NPS >7), upsell talk tracks, pricing anchors.",
    stages: ["discovery", "proposal", "closing"],
    steps: 14, completedByReps: 3, totalReps: 7, winRateImpact: 30, avgDealVelocity: -20,
    lastUpdated: "2026-03-03", author: "AI Agent — Luna", rating: 4.4, isAIGenerated: true,
    tags: ["Expansion", "Upsell", "AI-Generated"],
  },
];

export const playbookBattleCards: PlaybookBattleCard[] = [
  {
    id: "bc01", competitor: "Salesforce", lastUpdated: "2026-03-03", winRate: 45,
    keyDifferentiators: [
      "AI Agent capabilities (ta có, SF không)",
      "Giá thấp hơn 40-60%",
      "Implementation nhanh hơn 3x",
      "Vietnamese language native",
    ],
    objections: [
      "SF là market leader, brand trust",
      "AppExchange ecosystem rộng hơn",
      "Trailhead training platform",
    ],
    talkTracks: [
      "So sánh TCO 3 năm — ta rẻ hơn 2.1B₫",
      "Demo AI Agent vs Einstein — 10x capability gap",
      "Reference call: Sakura Systems switched từ SF",
    ],
  },
  {
    id: "bc02", competitor: "HubSpot", lastUpdated: "2026-03-02", winRate: 55,
    keyDifferentiators: [
      "AI-first architecture",
      "Enterprise-grade security",
      "Custom workflow builder",
      "Multi-entity support",
    ],
    objections: [
      "HubSpot freemium model hấp dẫn",
      "Marketing tools mature hơn",
      "Community lớn hơn",
    ],
    talkTracks: [
      "HubSpot giá tăng gấp 3x khi scale >50 users",
      "AI Agent giúp tiết kiệm 3 FTE/năm",
      "Case study: NorthStar SaaS migration từ HubSpot",
    ],
  },
  {
    id: "bc03", competitor: "Microsoft Dynamics 365", lastUpdated: "2026-03-01", winRate: 50,
    keyDifferentiators: [
      "AI capabilities vượt trội",
      "Go-live 60 ngày vs 6 tháng",
      "Modern UX/UI",
      "API-first architecture",
    ],
    objections: [
      "Microsoft ecosystem integration",
      "On-premise option",
      "Enterprise brand trust",
    ],
    talkTracks: [
      "TCO comparison: hidden costs MS implementation",
      "Demo: AI Agent capabilities — MS không có",
      "Speed to value: 60 ngày vs 6 tháng",
    ],
  },
];
