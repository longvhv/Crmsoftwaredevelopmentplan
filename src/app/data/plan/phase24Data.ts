/**
 * Phase 24: GENERATIVE AI, LLM OPS & AI GOVERNANCE
 * LLM fine-tuning, RAG pipeline, prompt management,
 * AI safety, model evaluation, cost optimization, AI ethics.
 * Steps: 24.1.1 → 24.7.4 (~32 bước)
 */
import type { PlanStep } from "../../types/plan";

export const phase24Steps: PlanStep[] = [
  // --- 24.1 LLM Infrastructure & RAG ---
  {
    id: "24.1.1",
    name: "RAG Pipeline (Retrieval-Augmented Generation)",
    description:
      "RAG pipeline: document chunking (semantic splitting), embedding generation (text-embedding-3-large), vector database (Pinecone/Weaviate), hybrid search (semantic + keyword), re-ranking, context window optimization.",
    phase: 24, category: "Generative AI", subCategory: "RAG",
    responsible: ["AI Engineer", "Backend Dev"],
    aiInvolvement: "AI-Driven", dependencies: ["7.1.1", "12.1.1"],
    duration: "7 ngày", status: "pending", priority: "Critical",
    deliverables: ["RAG pipeline", "Chunking engine", "Vector database setup", "Hybrid search engine"],
    aiTools: ["OpenAI Embeddings", "Pinecone", "LangChain"],
  },
  {
    id: "24.1.2",
    name: "Multi-model LLM Gateway",
    description:
      "Gateway quản lý nhiều LLM providers: GPT-4o, Claude 3.5, Gemini Pro, Llama 3, Mistral. Automatic routing (cost vs quality), fallback chains, load balancing, response caching, token tracking.",
    phase: 24, category: "Generative AI", subCategory: "LLM Gateway",
    responsible: ["AI Engineer", "Backend Dev", "Architect"],
    aiInvolvement: "AI-Driven", dependencies: ["24.1.1"],
    duration: "5 ngày", status: "pending", priority: "Critical",
    deliverables: ["Multi-model gateway", "Auto-routing logic", "Fallback chains", "Token usage tracking"],
    aiTools: ["LiteLLM", "OpenRouter"],
  },
  {
    id: "24.1.3",
    name: "Fine-tuning Pipeline & Model Registry",
    description:
      "Pipeline fine-tune LLM: data preparation (instruction format), training loop, evaluation, versioning. Model registry: track experiments, compare metrics, promote to production. Support LoRA/QLoRA.",
    phase: 24, category: "Generative AI", subCategory: "Fine-tuning",
    responsible: ["AI Engineer", "ML Engineer"],
    aiInvolvement: "AI-Driven", dependencies: ["24.1.2"],
    duration: "6 ngày", status: "pending", priority: "High",
    deliverables: ["Fine-tuning pipeline", "Model registry", "Experiment tracking", "LoRA/QLoRA support"],
    aiTools: ["Weights & Biases", "MLflow", "Hugging Face"],
  },

  // --- 24.2 Prompt Engineering & Management ---
  {
    id: "24.2.1",
    name: "Prompt Management Platform",
    description:
      "Platform quản lý prompts: version control, A/B testing prompts, performance tracking (latency, quality scores), template library, variable injection, chain-of-thought templates.",
    phase: 24, category: "Generative AI", subCategory: "Prompt Management",
    responsible: ["AI Engineer", "Product"],
    aiInvolvement: "AI-Driven", dependencies: ["24.1.2"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["Prompt management UI", "Version control", "A/B testing framework", "Performance tracking"],
    aiTools: ["PromptLayer", "LangSmith"],
  },
  {
    id: "24.2.2",
    name: "AI Agent Framework (Tool Use & Function Calling)",
    description:
      "Framework cho AI agents: tool/function definitions, execution orchestration, multi-step reasoning (ReAct pattern), memory management (short/long-term), context window optimization, error recovery.",
    phase: 24, category: "Generative AI", subCategory: "AI Agents",
    responsible: ["AI Engineer", "Backend Dev"],
    aiInvolvement: "AI-Driven", dependencies: ["24.2.1", "12.3.1"],
    duration: "7 ngày", status: "pending", priority: "Critical",
    deliverables: ["Agent framework", "Tool registry", "ReAct execution engine", "Memory management"],
    aiTools: ["LangGraph", "CrewAI", "AutoGen"],
  },
  {
    id: "24.2.3",
    name: "Conversational AI — Natural Language CRM Interface",
    description:
      "Chat interface cho CRM bằng ngôn ngữ tự nhiên: 'Tạo deal 500M cho công ty ABC', 'Cho tôi xem pipeline tháng này', 'Lên lịch meeting với anh Minh thứ 5'. NLU → intent → action → confirmation.",
    phase: 24, category: "Generative AI", subCategory: "NL Interface",
    responsible: ["AI Engineer", "Frontend Dev"],
    aiInvolvement: "AI-Driven", dependencies: ["24.2.2"],
    duration: "6 ngày", status: "pending", priority: "High",
    deliverables: ["NL CRM interface", "Intent classification", "Action execution", "Confirmation flows"],
    aiTools: ["GPT-4o", "NLU Engine"],
  },

  // --- 24.3 AI Safety & Guardrails ---
  {
    id: "24.3.1",
    name: "AI Output Guardrails & Content Filtering",
    description:
      "Guardrails cho AI output: toxicity detection, PII masking in responses, hallucination detection, factual grounding verification, brand voice compliance, multi-language safety.",
    phase: 24, category: "Generative AI", subCategory: "AI Safety",
    responsible: ["AI Engineer", "Security Engineer"],
    aiInvolvement: "AI-Driven", dependencies: ["24.1.2"],
    duration: "5 ngày", status: "pending", priority: "Critical",
    deliverables: ["Output guardrails", "PII masking layer", "Hallucination detector", "Brand voice checker"],
    aiTools: ["Guardrails AI", "NeMo Guardrails"],
  },
  {
    id: "24.3.2",
    name: "AI Bias Detection & Fairness Monitoring",
    description:
      "Monitoring AI bias: demographic parity, equalized odds, calibration across groups. Regular bias audits for scoring models, hiring recommendations, content generation. Bias remediation workflows.",
    phase: 24, category: "Generative AI", subCategory: "AI Fairness",
    responsible: ["AI Engineer", "Ethics Officer"],
    aiInvolvement: "AI-Driven", dependencies: ["24.3.1"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["Bias detection framework", "Fairness metrics dashboard", "Audit reports", "Remediation playbooks"],
    aiTools: ["Fairlearn", "AI Fairness 360"],
  },
  {
    id: "24.3.3",
    name: "AI Explainability & Transparency (XAI)",
    description:
      "Explainability cho AI decisions: SHAP/LIME explanations for scoring models, feature importance visualization, decision audit trail, 'Why did AI suggest this?' button cho end users.",
    phase: 24, category: "Generative AI", subCategory: "Explainability",
    responsible: ["AI Engineer", "Frontend Dev"],
    aiInvolvement: "AI-Driven", dependencies: ["24.3.2"],
    duration: "5 ngày", status: "pending", priority: "High",
    deliverables: ["SHAP/LIME integration", "Feature importance UI", "Decision audit trail", "User-facing explanations"],
    aiTools: ["SHAP", "LIME", "Explainability Dashboard"],
  },

  // --- 24.4 AI Evaluation & Monitoring ---
  {
    id: "24.4.1",
    name: "LLM Evaluation Framework (Evals)",
    description:
      "Framework đánh giá LLM quality: automated evals (accuracy, relevance, completeness, safety), human-in-the-loop evaluation, golden test sets, regression testing. Eval-driven development.",
    phase: 24, category: "Generative AI", subCategory: "Evaluation",
    responsible: ["AI Engineer", "QA Lead"],
    aiInvolvement: "AI-Driven", dependencies: ["24.2.1"],
    duration: "5 ngày", status: "pending", priority: "Critical",
    deliverables: ["Eval framework", "Golden test sets", "Human eval workflows", "Regression test suite"],
    aiTools: ["OpenAI Evals", "Braintrust", "Ragas"],
  },
  {
    id: "24.4.2",
    name: "AI Production Monitoring & Drift Detection",
    description:
      "Monitoring AI in production: response quality tracking, latency monitoring, token cost tracking, model drift detection, data drift alerts, feedback loop integration (user thumbs up/down).",
    phase: 24, category: "Generative AI", subCategory: "Monitoring",
    responsible: ["ML Engineer", "DevOps"],
    aiInvolvement: "AI-Driven", dependencies: ["24.4.1"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["AI monitoring dashboard", "Drift detection alerts", "Cost tracking", "User feedback loop"],
    aiTools: ["Langfuse", "Helicone", "Datadog AI"],
  },

  // --- 24.5 AI Cost Optimization ---
  {
    id: "24.5.1",
    name: "AI Cost Optimization & Token Management",
    description:
      "Tối ưu chi phí AI: prompt compression, caching responses (semantic cache), model selection by task complexity, batch processing for non-urgent tasks, budget alerts per team/feature.",
    phase: 24, category: "Generative AI", subCategory: "Cost Optimization",
    responsible: ["AI Engineer", "Finance"],
    aiInvolvement: "AI-Driven", dependencies: ["24.1.2"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["Token management system", "Semantic cache", "Cost optimization rules", "Budget alerts"],
    aiTools: ["Token Optimizer", "Semantic Cache Engine"],
  },
  {
    id: "24.5.2",
    name: "On-premise / Private Cloud LLM Deployment",
    description:
      "Deploy LLM on-premise cho khách hàng enterprise yêu cầu data sovereignty: Llama 3 / Mistral self-hosted, GPU infrastructure, model quantization (GGUF/AWQ), inference optimization (vLLM/TGI).",
    phase: 24, category: "Generative AI", subCategory: "Self-hosted LLM",
    responsible: ["ML Engineer", "DevOps", "Architect"],
    aiInvolvement: "AI-Driven", dependencies: ["24.1.3"],
    duration: "6 ngày", status: "pending", priority: "Medium",
    deliverables: ["Self-hosted LLM setup", "Model quantization", "Inference optimization", "Deployment playbook"],
    aiTools: ["vLLM", "TGI", "Ollama"],
  },

  // --- 24.6 AI Governance & Compliance ---
  {
    id: "24.6.1",
    name: "AI Governance Framework & Policies",
    description:
      "Framework quản trị AI: AI usage policies, approval workflows for new AI features, risk assessment per AI model, compliance with EU AI Act, AI inventory & classification (high-risk, low-risk).",
    phase: 24, category: "Generative AI", subCategory: "Governance",
    responsible: ["Legal", "AI Engineer", "Product"],
    aiInvolvement: "Human-Led", dependencies: ["24.3.1"],
    duration: "4 ngày", status: "pending", priority: "Critical",
    deliverables: ["AI governance framework", "Usage policies", "Risk assessment templates", "EU AI Act compliance"],
    aiTools: ["Governance Dashboard"],
  },
  {
    id: "24.6.2",
    name: "AI Data Privacy & Consent Management",
    description:
      "Privacy cho AI: consent management for AI data usage, data deletion from training sets, opt-out workflows, privacy-preserving techniques (differential privacy, federated learning exploration).",
    phase: 24, category: "Generative AI", subCategory: "AI Privacy",
    responsible: ["Security Engineer", "Legal", "AI Engineer"],
    aiInvolvement: "AI-Assisted", dependencies: ["24.6.1", "9.2.1"],
    duration: "5 ngày", status: "pending", priority: "Critical",
    deliverables: ["AI consent management", "Data deletion from models", "Opt-out workflows", "Privacy techniques"],
    aiTools: ["Privacy AI", "Consent Engine"],
  },

  // --- 24.7 AI-Powered Automation ---
  {
    id: "24.7.1",
    name: "AI Workflow Automation (Trigger → AI → Action)",
    description:
      "AI-powered automation: 'When deal stuck 7 days → AI analyze blockers → suggest actions → auto-draft email'. Visual builder cho AI automation rules, trigger library, action library.",
    phase: 24, category: "Generative AI", subCategory: "AI Automation",
    responsible: ["AI Engineer", "Backend Dev", "Product"],
    aiInvolvement: "AI-Driven", dependencies: ["24.2.2", "4.1.1"],
    duration: "5 ngày", status: "pending", priority: "High",
    deliverables: ["AI automation builder", "Trigger library", "AI action library", "Execution monitoring"],
    aiTools: ["Automation AI", "Workflow Engine"],
  },
  {
    id: "24.7.2",
    name: "AI Knowledge Graph & Relationship Intelligence",
    description:
      "Knowledge graph: entities (people, companies, deals, products) + relationships + signals. AI infer hidden connections, recommend warm introductions, map decision-making units, influence scoring.",
    phase: 24, category: "Generative AI", subCategory: "Knowledge Graph",
    responsible: ["AI Engineer", "Backend Dev"],
    aiInvolvement: "AI-Driven", dependencies: ["24.1.1", "13.1.1"],
    duration: "6 ngày", status: "pending", priority: "High",
    deliverables: ["Knowledge graph engine", "Relationship mapping", "Warm intro recommender", "Influence scoring"],
    aiTools: ["Neo4j", "Graph Neural Network", "Entity Resolution"],
  },
  {
    id: "24.7.3",
    name: "AI Voice Assistant (Voice Commands CRM)",
    description:
      "Voice interface cho CRM: speech-to-text (Whisper), intent recognition, voice commands ('Log a call with Minh, 30 minutes, discussed pricing'), hands-free mode cho field sales.",
    phase: 24, category: "Generative AI", subCategory: "Voice AI",
    responsible: ["AI Engineer", "Frontend Dev", "Mobile Dev"],
    aiInvolvement: "AI-Driven", dependencies: ["24.2.3"],
    duration: "5 ngày", status: "pending", priority: "Medium",
    deliverables: ["Voice command engine", "Speech-to-text integration", "Intent recognition", "Hands-free mode"],
    aiTools: ["Whisper", "Voice Intent AI"],
  },
  {
    id: "24.7.4",
    name: "AI Competitive Intelligence Automation",
    description:
      "AI monitor đối thủ tự động: web scraping (pricing changes, feature launches, job postings), social media monitoring, patent filings, news alerts. Competitive battle cards auto-update.",
    phase: 24, category: "Generative AI", subCategory: "Competitive Intel",
    responsible: ["AI Engineer", "Product Marketing"],
    aiInvolvement: "AI-Driven", dependencies: ["24.1.1"],
    duration: "4 ngày", status: "pending", priority: "Medium",
    deliverables: ["Competitive monitoring engine", "Auto-updated battle cards", "Pricing change alerts", "Feature launch tracker"],
    aiTools: ["Web Scraping AI", "NLP Summarizer"],
  },
];
