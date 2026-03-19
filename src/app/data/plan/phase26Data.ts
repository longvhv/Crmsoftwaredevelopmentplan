/**
 * Phase 26: PERFORMANCE AT SCALE — CACHING, CDN, EDGE COMPUTING
 * Database optimization, caching strategy, CDN, edge functions,
 * query optimization, connection pooling, auto-scaling v2.
 * Steps: 26.1.1 → 26.6.3 (~28 bước)
 */
import type { PlanStep } from "../../types/plan";

export const phase26Steps: PlanStep[] = [
  // --- 26.1 Database Optimization ---
  {
    id: "26.1.1",
    name: "Database Sharding & Partitioning Strategy",
    description:
      "Sharding strategy: horizontal sharding by tenant_id, table partitioning (time-based cho activities, range-based cho analytics), shard router, cross-shard queries, rebalancing tools.",
    phase: 26, category: "Performance", subCategory: "Database",
    responsible: ["DBA", "Architect", "Backend Dev"],
    aiInvolvement: "AI-Assisted", dependencies: ["6.1.1"],
    duration: "7 ngày", status: "pending", priority: "Critical",
    deliverables: ["Sharding architecture", "Partition strategy", "Shard router", "Rebalancing tools"],
    aiTools: ["Database AI", "Shard Manager"],
  },
  {
    id: "26.1.2",
    name: "Query Optimization & Index Strategy",
    description:
      "Query optimization: slow query detection, EXPLAIN analysis automation, index recommendations (AI-suggested), covering indexes, partial indexes, materialized views refresh strategy.",
    phase: 26, category: "Performance", subCategory: "Query Optimization",
    responsible: ["DBA", "Backend Dev"],
    aiInvolvement: "AI-Driven", dependencies: ["26.1.1"],
    duration: "5 ngày", status: "pending", priority: "Critical",
    deliverables: ["Slow query monitor", "AI index recommender", "Index audit tool", "Query rewrite suggestions"],
    aiTools: ["pg_stat_statements AI", "Index Advisor"],
  },
  {
    id: "26.1.3",
    name: "Read Replica & Connection Pooling",
    description:
      "Read replicas: automatic read/write splitting, replica lag monitoring, failover. Connection pooling (PgBouncer/PgCat): pool sizing, transaction vs session mode, monitoring & alerts.",
    phase: 26, category: "Performance", subCategory: "Database",
    responsible: ["DBA", "DevOps"],
    aiInvolvement: "AI-Assisted", dependencies: ["26.1.1"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["Read replica setup", "Read/write splitter", "Connection pool config", "Lag monitoring"],
    aiTools: ["PgBouncer", "Replica Monitor"],
  },
  {
    id: "26.1.4",
    name: "Database Migration & Zero-downtime Schema Changes",
    description:
      "Zero-downtime migrations: expand-contract pattern, online schema changes (gh-ost/pgroll), backward-compatible migrations, rollback scripts, migration testing pipeline.",
    phase: 26, category: "Performance", subCategory: "Migrations",
    responsible: ["Backend Dev", "DBA"],
    aiInvolvement: "AI-Assisted", dependencies: ["26.1.1"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["Migration framework", "Zero-downtime patterns", "Rollback scripts", "Migration CI pipeline"],
    aiTools: ["pgroll", "Migration Validator"],
  },

  // --- 26.2 Caching Strategy ---
  {
    id: "26.2.1",
    name: "Multi-layer Caching Architecture",
    description:
      "Caching architecture: L1 (in-memory per instance), L2 (Redis cluster), L3 (CDN edge cache). Cache key strategy, TTL management, cache warming, cache stampede prevention (locking + jitter).",
    phase: 26, category: "Performance", subCategory: "Caching",
    responsible: ["Backend Dev", "Architect"],
    aiInvolvement: "AI-Assisted", dependencies: ["6.3.1"],
    duration: "5 ngày", status: "pending", priority: "Critical",
    deliverables: ["3-layer cache architecture", "Cache key conventions", "TTL management", "Stampede prevention"],
    aiTools: ["Redis AI", "Cache Optimizer"],
  },
  {
    id: "26.2.2",
    name: "Intelligent Cache Invalidation",
    description:
      "Cache invalidation engine: event-driven invalidation (CDC-based), tag-based invalidation, pattern invalidation, selective purge, cache dependency graph, consistency guarantees.",
    phase: 26, category: "Performance", subCategory: "Cache Invalidation",
    responsible: ["Backend Dev"],
    aiInvolvement: "AI-Driven", dependencies: ["26.2.1", "19.3.2"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["Event-driven invalidation", "Tag-based purge", "Dependency graph", "Consistency verification"],
    aiTools: ["Cache Invalidation AI"],
  },
  {
    id: "26.2.3",
    name: "API Response Caching & Rate Limiting v2",
    description:
      "API caching: per-endpoint caching rules, ETag/Last-Modified headers, conditional requests, stale-while-revalidate. Rate limiting v2: sliding window, token bucket, per-plan limits, burst allowance.",
    phase: 26, category: "Performance", subCategory: "API Caching",
    responsible: ["Backend Dev"],
    aiInvolvement: "AI-Assisted", dependencies: ["26.2.1"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["API caching layer", "ETag support", "Rate limiter v2", "Per-plan limit config"],
    aiTools: ["API Cache Engine"],
  },

  // --- 26.3 CDN & Edge Computing ---
  {
    id: "26.3.1",
    name: "Global CDN Setup (CloudFront/Fastly)",
    description:
      "CDN toàn cầu: static assets, API response caching, image optimization (WebP/AVIF auto-conversion), Brotli compression, custom caching rules, geo-routing, 99.99% availability.",
    phase: 26, category: "Performance", subCategory: "CDN",
    responsible: ["DevOps", "Frontend Dev"],
    aiInvolvement: "AI-Assisted", dependencies: ["16.4.1"],
    duration: "4 ngày", status: "pending", priority: "Critical",
    deliverables: ["CDN configuration", "Image optimization pipeline", "Compression setup", "Geo-routing rules"],
    aiTools: ["CloudFront", "Fastly"],
  },
  {
    id: "26.3.2",
    name: "Edge Functions & Compute@Edge",
    description:
      "Edge computing: edge functions cho personalization, A/B testing, geo-redirect, bot detection, request transformation. Cloudflare Workers / Lambda@Edge. < 50ms response time globally.",
    phase: 26, category: "Performance", subCategory: "Edge Computing",
    responsible: ["Backend Dev", "DevOps"],
    aiInvolvement: "AI-Assisted", dependencies: ["26.3.1"],
    duration: "5 ngày", status: "pending", priority: "High",
    deliverables: ["Edge function framework", "Personalization at edge", "Bot detection", "< 50ms global latency"],
    aiTools: ["Cloudflare Workers", "Lambda@Edge"],
  },

  // --- 26.4 Frontend Performance ---
  {
    id: "26.4.1",
    name: "Frontend Bundle Optimization & Code Splitting",
    description:
      "Bundle optimization: route-based code splitting, dynamic imports, tree shaking audit, dependency deduplication, module federation for micro-frontends. Target: initial bundle < 200KB gzipped.",
    phase: 26, category: "Performance", subCategory: "Frontend",
    responsible: ["Frontend Dev"],
    aiInvolvement: "AI-Assisted", dependencies: ["18.4.3"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["Code splitting setup", "Bundle analysis", "Tree shaking audit", "< 200KB initial bundle"],
    aiTools: ["Webpack Analyzer", "Vite Optimizer"],
  },
  {
    id: "26.4.2",
    name: "Virtual Scrolling & Data Virtualization",
    description:
      "Virtual scrolling cho large lists (10K+ items): react-virtualized/tanstack-virtual, infinite scroll, windowed rendering, variable height rows, grouped virtual lists, virtual grids.",
    phase: 26, category: "Performance", subCategory: "Frontend",
    responsible: ["Frontend Dev"],
    aiInvolvement: "AI-Assisted", dependencies: ["26.4.1"],
    duration: "3 ngày", status: "pending", priority: "High",
    deliverables: ["Virtual scroll implementation", "Infinite scroll", "Variable height support", "Virtual grid"],
    aiTools: ["TanStack Virtual"],
  },
  {
    id: "26.4.3",
    name: "Service Worker & Offline Support",
    description:
      "Service worker: offline-first cho critical features (view contacts, deals, tasks), background sync, push notifications, cache-first for static assets, network-first for API calls.",
    phase: 26, category: "Performance", subCategory: "Offline",
    responsible: ["Frontend Dev", "Mobile Dev"],
    aiInvolvement: "AI-Assisted", dependencies: ["26.2.1"],
    duration: "5 ngày", status: "pending", priority: "High",
    deliverables: ["Service worker setup", "Offline data access", "Background sync", "Cache strategies"],
    aiTools: ["Workbox", "PWA Builder"],
  },

  // --- 26.5 Auto-scaling & Resource Optimization ---
  {
    id: "26.5.1",
    name: "Kubernetes Auto-scaling v2 (HPA/VPA/KEDA)",
    description:
      "Auto-scaling nâng cao: HPA (CPU/memory + custom metrics), VPA (right-sizing recommendations), KEDA (event-driven scaling: queue depth, request count, schedule-based). Cost-aware scaling.",
    phase: 26, category: "Performance", subCategory: "Auto-scaling",
    responsible: ["DevOps", "SRE"],
    aiInvolvement: "AI-Driven", dependencies: ["16.1.1"],
    duration: "5 ngày", status: "pending", priority: "Critical",
    deliverables: ["HPA/VPA/KEDA setup", "Custom metrics scaling", "Cost-aware policies", "Scaling dashboard"],
    aiTools: ["KEDA", "Kubecost"],
  },
  {
    id: "26.5.2",
    name: "Predictive Auto-scaling (AI-based)",
    description:
      "AI dự đoán load patterns: historical analysis, seasonal patterns, event-based predictions (marketing campaign, product launch), pre-scale resources. Cost savings vs reactive scaling.",
    phase: 26, category: "Performance", subCategory: "Predictive Scaling",
    responsible: ["AI Engineer", "DevOps"],
    aiInvolvement: "AI-Driven", dependencies: ["26.5.1"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["Predictive scaling model", "Pre-scaling triggers", "Cost savings tracker", "Load pattern dashboard"],
    aiTools: ["Time Series AI", "Prophet"],
  },

  // --- 26.6 Performance Monitoring & SLO ---
  {
    id: "26.6.1",
    name: "SLI/SLO/SLA Framework & Error Budgets",
    description:
      "SLI/SLO framework: define SLIs (latency, availability, error rate, freshness), set SLOs (99.95% availability, p99 < 500ms), error budget tracking, burn rate alerts, SLA reporting.",
    phase: 26, category: "Performance", subCategory: "SLO",
    responsible: ["SRE", "Product"],
    aiInvolvement: "AI-Assisted", dependencies: ["16.2.1"],
    duration: "4 ngày", status: "pending", priority: "Critical",
    deliverables: ["SLI/SLO definitions", "Error budget tracking", "Burn rate alerts", "SLA compliance reports"],
    aiTools: ["SLO Monitor", "Nobl9"],
  },
  {
    id: "26.6.2",
    name: "Distributed Tracing & APM (OpenTelemetry)",
    description:
      "Distributed tracing: OpenTelemetry instrumentation, trace correlation across services, flame graphs, latency breakdown, dependency maps, anomaly detection in traces.",
    phase: 26, category: "Performance", subCategory: "Tracing",
    responsible: ["Backend Dev", "DevOps"],
    aiInvolvement: "AI-Assisted", dependencies: ["26.6.1"],
    duration: "4 ngày", status: "pending", priority: "High",
    deliverables: ["OpenTelemetry setup", "Trace correlation", "Flame graphs", "Dependency maps"],
    aiTools: ["Jaeger", "Tempo", "Datadog APM"],
  },
  {
    id: "26.6.3",
    name: "Performance Regression Detection (Automated)",
    description:
      "Automated performance regression detection: benchmark comparison per release, statistical significance testing, auto-block deploy if regression detected, performance budget CI gate.",
    phase: 26, category: "Performance", subCategory: "Regression",
    responsible: ["QA Lead", "DevOps"],
    aiInvolvement: "AI-Driven", dependencies: ["26.6.2", "18.4.2"],
    duration: "3 ngày", status: "pending", priority: "High",
    deliverables: ["Regression detector", "Benchmark CI integration", "Auto-block logic", "Performance budgets"],
    aiTools: ["Performance AI", "Benchmark Engine"],
  },
];
