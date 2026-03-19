/**
 * Phase 30: SALES PLAYBOOK & METHODOLOGY ENGINE
 * Structured sales methodologies (MEDDPICC, SPIN, Challenger),
 * playbook builder, guided selling, coaching AI, battle cards,
 * objection handling, talk tracks, competitive positioning.
 * Steps: 30.1.1 → 30.8.4 (~30 bước)
 */
import type { PlanStep } from "../../types/plan";

export const phase30Steps: PlanStep[] = [
  // --- 30.1 Sales Methodology Framework ---
  {
    id: "30.1.1",
    name: "Sales Methodology Registry & Configuration",
    description:
      "Registry cho phép đăng ký nhiều sales methodology (MEDDPICC, SPIN, Challenger, BANT, Sandler, Value Selling, Command of the Message). Mỗi methodology có: stages, qualification criteria, required fields per stage, scoring model, coaching prompts. Admin có thể tạo custom methodology.",
    phase: 30, category: "Sales Enablement", subCategory: "Methodology",
    responsible: ["Product Owner", "Sales Director", "Frontend Dev"],
    aiInvolvement: "AI-Assisted", dependencies: ["1.2.1"],
    duration: "5 ngày", status: "pending", priority: "Critical",
    deliverables: ["Methodology data model", "Registry CRUD API", "Admin configuration UI", "7 built-in methodologies"],
    aiTools: ["GPT-4o", "Methodology Template AI"],
  },
  {
    id: "30.1.2",
    name: "MEDDPICC Deep Integration — Qualification Scoring",
    description:
      "MEDDPICC integration sâu: Metrics (quantifiable value), Economic Buyer (identified + engaged), Decision criteria, Decision process, Paper process, Identify pain, Champion, Competition. Mỗi field có: scoring rubric (1-5), AI auto-fill từ meeting notes/emails, mandatory gates per stage, coach-suggested actions.",
    phase: 30, category: "Sales Enablement", subCategory: "MEDDPICC",
    responsible: ["Backend Dev", "Frontend Dev", "AI Engineer"],
    aiInvolvement: "AI-Driven", dependencies: ["30.1.1"],
    duration: "6 ngày", status: "pending", priority: "Critical",
    deliverables: ["MEDDPICC scoring engine", "Auto-fill từ conversations", "Deal health dashboard widget", "Qualification gap alerts"],
    aiTools: ["GPT-4o", "NLP Pipeline", "Meeting Transcript AI"],
  },
  {
    id: "30.1.3",
    name: "Challenger Sale Framework — Teaching & Tailoring",
    description:
      "Challenger model: Teach (insight delivery), Tailor (per stakeholder persona), Take Control (negotiation guidance). AI tự động phân loại rep style (Challenger, Relationship Builder, Lone Wolf, Hard Worker, Problem Solver). Coaching prompts theo từng style. Content recommendations per buyer persona.",
    phase: 30, category: "Sales Enablement", subCategory: "Challenger",
    responsible: ["AI Engineer", "Frontend Dev", "Sales Ops"],
    aiInvolvement: "AI-Driven", dependencies: ["30.1.1"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["Rep style classifier", "Coaching prompt engine", "Persona-based content recommender", "Teaching moment detector"],
    aiTools: ["Claude 3.5", "Personality AI", "Content AI"],
  },
  {
    id: "30.1.4",
    name: "Methodology Compliance Dashboard & Enforcement",
    description:
      "Dashboard đo lường compliance: % deals có đầy đủ qualification fields, methodology adherence score per rep, stage-gate enforcement (không cho chuyển stage nếu thiếu required fields), manager override workflow, trend analysis theo team/quarter.",
    phase: 30, category: "Sales Enablement", subCategory: "Compliance",
    responsible: ["Frontend Dev", "Backend Dev", "Sales Director"],
    aiInvolvement: "AI-Assisted", dependencies: ["30.1.2"],
    duration: "3 ngày", status: "pending", priority: "High",
    deliverables: ["Compliance dashboard", "Stage-gate enforcement", "Manager override flow", "Rep scorecard"],
    aiTools: ["Analytics Engine"],
  },

  // --- 30.2 Playbook Builder ---
  {
    id: "30.2.1",
    name: "Visual Playbook Builder — Drag & Drop",
    description:
      "Playbook builder dạng visual: drag-and-drop steps, branching logic (if/then/else based on buyer response), embed content (decks, videos, battle cards, ROI calculators), assign per deal type/segment/industry. Version control, A/B testing between playbook variants.",
    phase: 30, category: "Sales Enablement", subCategory: "Playbook Builder",
    responsible: ["Frontend Dev", "UX Designer", "Product Owner"],
    aiInvolvement: "AI-Assisted", dependencies: ["30.1.1"],
    duration: "7 ngày", status: "pending", priority: "Critical",
    deliverables: ["Drag-drop playbook editor", "Branching logic engine", "Content embedding", "Version control system"],
    aiTools: ["GPT-4o", "Workflow AI"],
  },
  {
    id: "30.2.2",
    name: "Playbook Analytics & Effectiveness Tracking",
    description:
      "Tracking: playbook adoption rate, step completion rate, skip patterns, correlation với win rate, time-to-close impact. A/B test results: variant A vs B win rate, deal velocity comparison. AI recommend best-performing playbook per segment.",
    phase: 30, category: "Sales Enablement", subCategory: "Playbook Analytics",
    responsible: ["Data Analyst", "Backend Dev", "AI Engineer"],
    aiInvolvement: "AI-Driven", dependencies: ["30.2.1"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["Playbook analytics dashboard", "A/B testing framework", "AI playbook recommender", "Win correlation analysis"],
    aiTools: ["Analytics AI", "Statistical Testing"],
  },
  {
    id: "30.2.3",
    name: "AI Playbook Generator — Tự động tạo Playbook",
    description:
      "AI phân tích top performers: email sequences, call patterns, content usage, timing, objection handling → tự động generate playbook mới. Input: CRM data + meeting transcripts + email threads + deal outcomes. Output: structured playbook with scoring confidence.",
    phase: 30, category: "Sales Enablement", subCategory: "AI Generation",
    responsible: ["AI Engineer", "ML Engineer", "Sales Ops"],
    aiInvolvement: "AI-Only", dependencies: ["30.2.2", "12.1.1"],
    duration: "6 ngày", status: "pending", priority: "High",
    deliverables: ["AI playbook generator", "Pattern mining engine", "Confidence scoring", "Human review workflow"],
    aiTools: ["GPT-4o", "Pattern Mining AI", "Behavioral Analytics"],
  },

  // --- 30.3 Battle Cards & Competitive Intelligence ---
  {
    id: "30.3.1",
    name: "Dynamic Battle Card Engine",
    description:
      "Battle cards tự động cập nhật: competitor strengths/weaknesses, pricing comparison, feature comparison matrix, win/loss stats vs competitor, recommended talk tracks, objection handling scripts. AI crawl competitor websites + G2/Capterra reviews + news để auto-update.",
    phase: 30, category: "Sales Enablement", subCategory: "Battle Cards",
    responsible: ["AI Engineer", "Product Marketing", "Frontend Dev"],
    aiInvolvement: "AI-Driven", dependencies: ["30.1.1"],
    duration: "5 ngày", status: "pending", priority: "Critical",
    deliverables: ["Battle card CRUD", "Auto-update crawler", "Feature comparison matrix", "Talk track library"],
    aiTools: ["GPT-4o", "Web Scraping AI", "Competitive Intel AI"],
  },
  {
    id: "30.3.2",
    name: "Real-time Competitive Alert System",
    description:
      "Monitor: competitor pricing changes, new feature launches, leadership changes, funding rounds, M&A, customer reviews. Push alerts to relevant reps (khi đang deal với competitor đó). AI summarize impact + recommended response.",
    phase: 30, category: "Sales Enablement", subCategory: "Competitive Alerts",
    responsible: ["AI Engineer", "Backend Dev", "Sales Ops"],
    aiInvolvement: "AI-Driven", dependencies: ["30.3.1"],
    duration: "4 ngày", status: "pending", priority: "Medium",
    deliverables: ["Competitive monitoring system", "Real-time alert engine", "Impact summarizer", "Rep notification system"],
    aiTools: ["Web Monitor AI", "News API", "G2/Capterra API"],
  },

  // --- 30.4 Guided Selling & In-context Coaching ---
  {
    id: "30.4.1",
    name: "Guided Selling Wizard — Next Best Action",
    description:
      "Trong mỗi deal, hiển thị real-time: suggested next step, recommended content to share, ideal timing for follow-up, stakeholder engagement recommendations, risk alerts, coaching tips. Based on: methodology stage, buyer signals, historical patterns.",
    phase: 30, category: "Sales Enablement", subCategory: "Guided Selling",
    responsible: ["AI Engineer", "Frontend Dev", "UX Designer"],
    aiInvolvement: "AI-Driven", dependencies: ["30.1.2", "30.2.1"],
    duration: "6 ngày", status: "pending", priority: "Critical",
    deliverables: ["Next best action engine", "In-context coaching panel", "Real-time risk alerts", "Content recommendation"],
    aiTools: ["GPT-4o", "Recommendation AI", "Behavioral Analytics"],
  },
  {
    id: "30.4.2",
    name: "Objection Handling Library & AI Coach",
    description:
      "Library: 200+ common objections categorized (price, timing, competition, features, risk). Mỗi objection có: recommended response variants, supporting evidence, case study references, role-play practice mode. AI generate custom responses based on deal context.",
    phase: 30, category: "Sales Enablement", subCategory: "Objection Handling",
    responsible: ["Product Marketing", "AI Engineer", "Sales Enablement"],
    aiInvolvement: "AI-Driven", dependencies: ["30.4.1"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["Objection library (200+ entries)", "AI response generator", "Role-play simulator", "Context-aware coaching"],
    aiTools: ["Claude 3.5", "Role-play AI", "Context Engine"],
  },
  {
    id: "30.4.3",
    name: "Deal Scoring AI — Multi-signal Qualification",
    description:
      "AI deal scoring tổng hợp: methodology compliance score, buyer engagement signals (email opens, meeting attendance, content downloads), stakeholder coverage, competitive landscape, timing signals, historical win pattern match. Output: 0-100 score + confidence interval + top 3 risk factors.",
    phase: 30, category: "Sales Enablement", subCategory: "Deal Scoring",
    responsible: ["ML Engineer", "Data Scientist", "Backend Dev"],
    aiInvolvement: "AI-Only", dependencies: ["30.4.1", "7.2.1"],
    duration: "5 ngày", status: "pending", priority: "Critical",
    deliverables: ["Multi-signal scoring model", "Feature importance dashboard", "Risk factor explainer", "Historical pattern matcher"],
    aiTools: ["XGBoost", "SHAP Explainability", "Feature Engineering AI"],
  },

  // --- 30.5 Sales Content Management ---
  {
    id: "30.5.1",
    name: "Sales Content Hub — Centralized Repository",
    description:
      "Content hub: decks, one-pagers, case studies, ROI calculators, demo videos, whitepapers. Tagging: industry, deal stage, buyer persona, product line, language. Version control, expiration dates, usage tracking. Search: full-text + AI semantic search.",
    phase: 30, category: "Sales Enablement", subCategory: "Content Management",
    responsible: ["Frontend Dev", "Backend Dev", "Product Marketing"],
    aiInvolvement: "AI-Assisted", dependencies: ["30.2.1"],
    duration: "5 ngày", status: "pending", priority: "High",
    deliverables: ["Content repository", "Tagging system", "Version control", "Semantic search"],
    aiTools: ["Embedding AI", "Search Engine", "Tag Classifier"],
  },
  {
    id: "30.5.2",
    name: "AI Content Personalization & Generation",
    description:
      "AI tự động customize content per deal: insert customer name, industry stats, relevant case studies, competitive comparison. Generate: personalized email drafts, proposal sections, executive summary, follow-up notes. Tone matching per buyer persona.",
    phase: 30, category: "Sales Enablement", subCategory: "Content AI",
    responsible: ["AI Engineer", "Product Marketing", "Frontend Dev"],
    aiInvolvement: "AI-Only", dependencies: ["30.5.1", "24.1.1"],
    duration: "5 ngày", status: "pending", priority: "High",
    deliverables: ["Content personalization engine", "Draft generator", "Tone matcher", "Template merging system"],
    aiTools: ["GPT-4o", "Claude 3.5", "Template Engine AI"],
  },
  {
    id: "30.5.3",
    name: "Content Effectiveness Analytics",
    description:
      "Track: content usage per deal, download/view rates, correlation với win rate, time spent per content piece, sharing patterns. AI identify: top-performing content per segment, content gaps (stages/personas without content), stale content alerts.",
    phase: 30, category: "Sales Enablement", subCategory: "Content Analytics",
    responsible: ["Data Analyst", "Product Marketing", "AI Engineer"],
    aiInvolvement: "AI-Driven", dependencies: ["30.5.1"],
    duration: "3 ngày", status: "pending", priority: "Medium",
    deliverables: ["Content effectiveness dashboard", "Win correlation analysis", "Content gap identifier", "Stale content alerts"],
    aiTools: ["Analytics AI", "Correlation Engine"],
  },

  // --- 30.6 Sales Coaching & Training ---
  {
    id: "30.6.1",
    name: "AI Sales Coach — Real-time Call Coaching",
    description:
      "During live calls: real-time transcription, sentiment analysis, talk/listen ratio, filler word detection, key topic extraction. Post-call: coaching summary, highlight moments, improvement suggestions, comparison với top performers, methodology compliance check.",
    phase: 30, category: "Sales Enablement", subCategory: "Coaching",
    responsible: ["AI Engineer", "ML Engineer", "Frontend Dev"],
    aiInvolvement: "AI-Only", dependencies: ["30.4.1", "8.1.1"],
    duration: "7 ngày", status: "pending", priority: "High",
    deliverables: ["Real-time coaching engine", "Talk ratio analyzer", "Sentiment tracker", "Post-call summary generator"],
    aiTools: ["Whisper", "GPT-4o", "Sentiment Analysis AI", "Speech Analytics"],
  },
  {
    id: "30.6.2",
    name: "Role-play Simulator & Certification",
    description:
      "AI role-play: simulate buyer personas (skeptical CFO, technical CTO, busy VP Sales). Scenarios: cold call, discovery, demo, negotiation, objection handling. Scoring: methodology adherence, talk track quality, objection response. Certification program with levels.",
    phase: 30, category: "Sales Enablement", subCategory: "Training",
    responsible: ["AI Engineer", "Sales Enablement", "UX Designer"],
    aiInvolvement: "AI-Only", dependencies: ["30.6.1"],
    duration: "5 ngày", status: "pending", priority: "Medium",
    deliverables: ["Role-play AI engine", "Persona simulator", "Certification system", "Scoring rubric"],
    aiTools: ["GPT-4o", "Voice AI", "Persona Generator"],
  },
  {
    id: "30.6.3",
    name: "Peer Learning & Best Practice Sharing",
    description:
      "Platform chia sẻ: top call recordings (with permission), winning email templates, successful negotiation tactics. AI curate: weekly digest of best practices, trending techniques, new competitor insights. Gamification: badges for sharing, upvotes, contribution score.",
    phase: 30, category: "Sales Enablement", subCategory: "Peer Learning",
    responsible: ["Frontend Dev", "Backend Dev", "Sales Enablement"],
    aiInvolvement: "AI-Assisted", dependencies: ["30.6.1"],
    duration: "4 ngày", status: "pending", priority: "Medium",
    deliverables: ["Knowledge sharing platform", "AI curation engine", "Weekly digest", "Gamification system"],
    aiTools: ["Content Curation AI", "Recommendation AI"],
  },

  // --- 30.7 Proposal & Presentation Builder ---
  {
    id: "30.7.1",
    name: "AI Proposal Generator — Context-aware",
    description:
      "Input: deal data + requirements + stakeholder info. Output: full proposal document (cover page, exec summary, solution overview, pricing, timeline, team, references, T&Cs). Template library per industry/deal size. AI customize based on buyer pain points từ discovery notes.",
    phase: 30, category: "Sales Enablement", subCategory: "Proposals",
    responsible: ["AI Engineer", "Frontend Dev", "Product Marketing"],
    aiInvolvement: "AI-Driven", dependencies: ["30.5.2"],
    duration: "6 ngày", status: "pending", priority: "Critical",
    deliverables: ["Proposal generator", "Template library", "Pain-point personalizer", "PDF/PPTX export"],
    aiTools: ["GPT-4o", "Document Generation AI", "Template Engine"],
  },
  {
    id: "30.7.2",
    name: "Interactive ROI Calculator Builder",
    description:
      "Build interactive ROI calculators per product/use case: input fields (current metrics), calculation logic (savings, revenue impact, efficiency gains), visualization (charts, before/after), shareable link. AI pre-fill with industry benchmarks. Track: calculator engagement per deal.",
    phase: 30, category: "Sales Enablement", subCategory: "ROI Calculator",
    responsible: ["Frontend Dev", "Product Marketing", "Data Analyst"],
    aiInvolvement: "AI-Assisted", dependencies: ["30.7.1"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["ROI calculator builder", "Industry benchmark database", "Shareable calculator links", "Engagement tracking"],
    aiTools: ["Benchmark AI", "Calculation Engine"],
  },

  // --- 30.8 Sales Ops & Process Optimization ---
  {
    id: "30.8.1",
    name: "Sales Process Mining & Optimization",
    description:
      "Process mining: map actual deal flows (vs intended), identify bottlenecks (stages where deals stall), detect bypassed steps, compare high-performing vs low-performing patterns. AI recommend: process improvements, stage durations, required activities per stage.",
    phase: 30, category: "Sales Enablement", subCategory: "Process Mining",
    responsible: ["Data Scientist", "Sales Ops", "AI Engineer"],
    aiInvolvement: "AI-Driven", dependencies: ["30.2.2"],
    duration: "5 ngày", status: "pending", priority: "High",
    deliverables: ["Process mining engine", "Bottleneck detector", "Pattern comparison", "Optimization recommendations"],
    aiTools: ["Process Mining AI", "Graph Analytics", "Pattern Recognition"],
  },
  {
    id: "30.8.2",
    name: "Ideal Customer Profile (ICP) Engine",
    description:
      "AI xây dựng ICP từ historical data: firmographics (industry, size, revenue, location), technographics (tech stack, tools), behavioral (website visits, content downloads), outcome (won deals, expansion, NRR). Scoring mỗi prospect against ICP. Auto-update quarterly.",
    phase: 30, category: "Sales Enablement", subCategory: "ICP",
    responsible: ["ML Engineer", "Data Scientist", "Sales Ops"],
    aiInvolvement: "AI-Only", dependencies: ["30.8.1", "7.2.1"],
    duration: "4 ngày", status: "pending", priority: "Critical",
    deliverables: ["ICP model", "Prospect scoring engine", "ICP dashboard", "Auto-refresh pipeline"],
    aiTools: ["ML Classification", "Feature Engineering", "Data Enrichment API"],
  },
  {
    id: "30.8.3",
    name: "Pipeline Velocity & Conversion Analytics",
    description:
      "Phân tích sâu: stage-to-stage conversion rates, velocity by segment/rep/product, deal aging alerts, stalled deal detection, win rate by entry source/channel. Drill-down: individual deal bottleneck root cause. AI forecast: expected pipeline velocity next quarter.",
    phase: 30, category: "Sales Enablement", subCategory: "Pipeline Analytics",
    responsible: ["Data Analyst", "Frontend Dev", "Sales Ops"],
    aiInvolvement: "AI-Assisted", dependencies: ["30.8.1"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["Velocity analytics dashboard", "Conversion funnel", "Deal aging system", "AI velocity forecast"],
    aiTools: ["Analytics AI", "Time Series Forecasting"],
  },
  {
    id: "30.8.4",
    name: "Sales Territory & Capacity Intelligence",
    description:
      "AI-driven territory planning: balance territories by opportunity count, revenue potential, rep capacity, travel time. What-if scenarios: add/remove rep, change territory boundaries, seasonal adjustments. Capacity model: max deals per rep by complexity tier.",
    phase: 30, category: "Sales Enablement", subCategory: "Territory Intelligence",
    responsible: ["Data Scientist", "Sales Ops", "Frontend Dev"],
    aiInvolvement: "AI-Driven", dependencies: ["30.8.2"],
    duration: "5 ngày", status: "pending", priority: "Medium",
    deliverables: ["Territory optimizer", "What-if simulator", "Capacity model", "Balance scorecard"],
    aiTools: ["Optimization AI", "Geo-analysis", "Capacity Planning AI"],
  },
];
