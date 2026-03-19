/**
 * DETAILED PLAN OVERVIEW
 * Tổng quan chi tiết về kế hoạch phát triển 850 bước
 */

import * as React from "react";
import { Link } from "react-router";
import { CheckCircle2, Circle, ArrowRight, Users, Zap, Code, Brain } from "lucide-react";
import { getPlanSummary } from "../data/generateFullPlan";

export default function DetailedPlanOverview() {
  const summary = getPlanSummary();

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="border-b pb-6">
          <h1 className="text-5xl font-bold mb-4">Kế Hoạch Chi Tiết 850 Bước</h1>
          <p className="text-xl text-muted-foreground">
            Lộ trình phát triển hệ thống CRM AI-first chuyên nghiệp
          </p>
          <div className="mt-4 flex gap-4">
            <Link to="/progress" className="text-primary hover:underline">
              ← Quay lại Progress Dashboard
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link to="/detailed-plan" className="text-primary hover:underline">
              Xem chi tiết từng bước →
            </Link>
          </div>
        </div>

        {/* Overall Stats */}
        <div className="grid gap-6 md:grid-cols-4">
          <div className="p-6 border rounded-lg bg-card">
            <div className="text-4xl font-bold text-primary mb-2">{summary.total}</div>
            <div className="text-sm text-muted-foreground">Tổng số bước</div>
          </div>
          <div className="p-6 border rounded-lg bg-card">
            <div className="text-4xl font-bold text-green-500 mb-2">120</div>
            <div className="text-sm text-muted-foreground">Đã hoàn thành</div>
          </div>
          <div className="p-6 border rounded-lg bg-card">
            <div className="text-4xl font-bold text-blue-500 mb-2">730</div>
            <div className="text-sm text-muted-foreground">Sắp triển khai</div>
          </div>
          <div className="p-6 border rounded-lg bg-card">
            <div className="text-4xl font-bold text-purple-500 mb-2">3</div>
            <div className="text-sm text-muted-foreground">Phases chính</div>
          </div>
        </div>

        {/* Phase 3: Enhanced CRM Core */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-violet-100">
              <Code className="w-8 h-8 text-violet-700" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Phase 3: Enhanced CRM Core Pages</h2>
              <p className="text-muted-foreground">Bước {summary.phase3.range} • {summary.phase3.count} bước</p>
            </div>
          </div>

          <div className="border-l-4 border-violet-500 pl-6 space-y-4">
            <p className="text-lg">
              Xây dựng đầy đủ các trang CRM cốt lõi với CRUD hoàn chỉnh, tính năng nâng cao, 
              và tích hợp AI sơ bộ.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {summary.phase3.categories.map((category) => (
                <div key={category} className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
                  <h3 className="font-semibold mb-2">{category}</h3>
                  <p className="text-sm text-muted-foreground">
                    25-30 bước chi tiết implementation
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-violet-50 dark:bg-violet-950 rounded-lg">
              <h4 className="font-semibold mb-2">Highlights:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Contact Management: Timeline, Notes, Custom Fields, Merge, Segmentation</li>
                <li>• Company Management: Hierarchy, ICP Scoring, Data Enrichment, Territory</li>
                <li>• Deals/Opportunities: Pipeline, Forecasting, Deal Rooms, Win/Loss Analysis</li>
                <li>• Activities & Tasks: Calendar Integration, Email Tracking, Meeting Notes</li>
                <li>• Document Management: File Upload, Version Control, E-signatures</li>
                <li>• Email Integration: Gmail/Outlook Sync, Templates, Tracking, Sequences</li>
                <li>• Reporting & Dashboards: Custom Reports, Dashboard Builder, KPI Tracking</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Phase 4: Advanced Features */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-orange-100">
              <Zap className="w-8 h-8 text-orange-700" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Phase 4: Advanced CRM Features</h2>
              <p className="text-muted-foreground">Bước {summary.phase4.range} • {summary.phase4.count} bước</p>
            </div>
          </div>

          <div className="border-l-4 border-orange-500 pl-6 space-y-4">
            <p className="text-lg">
              Triển khai các tính năng nâng cao: Sales Pipeline, Marketing Automation, 
              Workflow Builder, Analytics, Integrations, và Mobile App.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {summary.phase4.categories.map((category) => (
                <div key={category} className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
                  <h3 className="font-semibold mb-2">{category}</h3>
                  <p className="text-sm text-muted-foreground">
                    40 bước chi tiết implementation
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <h4 className="font-semibold mb-2">Highlights:</h4>
              <ul className="space-y-1 text-sm">
                <li>• Sales Pipeline: Weighted Forecasting, AI Predictions, Stage Automation</li>
                <li>• Marketing Automation: Email Campaigns, Drip Campaigns, Lead Nurturing, Scoring</li>
                <li>• Workflow Automation: Visual Builder, Triggers, Conditions, Actions, Approvals</li>
                <li>• Advanced Analytics: Cohort Analysis, Attribution, Funnel Analysis, Predictive</li>
                <li>• Integration Platform: Zapier, Webhooks, API Marketplace, Custom Integrations</li>
                <li>• Mobile Application: Native iOS/Android, Offline Mode, Push Notifications</li>
                <li>• Advanced Security: SSO, MFA, IP Whitelist, Audit Logs, Encryption</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Phase 5: AI Integration */}
        <section className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-red-100">
              <Brain className="w-8 h-8 text-red-700" />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Phase 5: AI Integration & World-Class</h2>
              <p className="text-muted-foreground">Bước {summary.phase5.range} • {summary.phase5.count} bước</p>
            </div>
          </div>

          <div className="border-l-4 border-red-500 pl-6 space-y-4">
            <p className="text-lg">
              Tích hợp đầy đủ AI Agents, Conversational UI, Predictive Analytics, 
              Advanced Search, và tối ưu hóa hệ thống cho production scale.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
              {summary.phase5.categories.map((category) => (
                <div key={category} className="p-4 border rounded-lg bg-card hover:shadow-md transition-shadow">
                  <h3 className="font-semibold mb-2">{category}</h3>
                  <p className="text-sm text-muted-foreground">
                    40-80 bước chi tiết implementation
                  </p>
                </div>
              ))}
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
              <h4 className="font-semibold mb-2">Highlights:</h4>
              <ul className="space-y-1 text-sm">
                <li>• AI Agents: SDR Agent, Qualification Agent, Routing Agent, Enrichment Agent</li>
                <li>• Conversational UI: AI Chatbot, Voice Commands, Natural Language Queries</li>
                <li>• Predictive Analytics: Churn Prediction, Upsell Opportunities, Next Best Action</li>
                <li>• Advanced Search: Semantic Search, Knowledge Graph, Q&A System</li>
                <li>• Performance: Caching Strategy, CDN, Database Optimization, Monitoring</li>
                <li>• Launch & Scale: Beta Testing, Production Deployment, Auto-scaling, Monitoring</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Technology Stack */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Technology Stack</h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Frontend
              </h3>
              <ul className="space-y-2 text-sm">
                <li>• React 19 + TypeScript</li>
                <li>• React Router v7 (Data Mode)</li>
                <li>• Tailwind CSS v4</li>
                <li>• Recharts for visualization</li>
                <li>• Motion for animations</li>
                <li>• Lucide React icons</li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Backend
              </h3>
              <ul className="space-y-2 text-sm">
                <li>• Go Microservices</li>
                <li>• YugabyteDB (YSQL)</li>
                <li>• Event Sourcing (Kafka)</li>
                <li>• Redis Cache</li>
                <li>• gRPC + REST APIs</li>
                <li>• OAuth2/JWT Auth</li>
              </ul>
            </div>

            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                AI & ML
              </h3>
              <ul className="space-y-2 text-sm">
                <li>• OpenAI GPT-4 / Claude</li>
                <li>• Vector Database (Pinecone)</li>
                <li>• LangChain for Agents</li>
                <li>• Scikit-learn / PyTorch</li>
                <li>• Sentence Transformers</li>
                <li>• Custom ML Models</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Key Principles */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Key Development Principles</h2>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-6 border rounded-lg bg-card">
              <h3 className="font-semibold mb-2">🎯 AI-First Architecture</h3>
              <p className="text-sm text-muted-foreground">
                Every feature designed with AI integration in mind. Event sourcing cho AI training,
                embeddings for semantic search, structured data cho agents.
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-card">
              <h3 className="font-semibold mb-2">📊 Data Quality & Governance</h3>
              <p className="text-sm text-muted-foreground">
                Standard Mixins (tenant_id, version, timestamps, soft delete), data validation,
                audit logs, GDPR compliance từ đầu.
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-card">
              <h3 className="font-semibold mb-2">⚡ Performance & Scale</h3>
              <p className="text-sm text-muted-foreground">
                Microservices cho horizontal scaling, distributed caching, CDN cho assets,
                database optimization, API rate limiting.
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-card">
              <h3 className="font-semibold mb-2">🔐 Security First</h3>
              <p className="text-sm text-muted-foreground">
                Multi-tenant isolation, role-based access control, encryption at rest and in transit,
                SOC 2 compliance, regular security audits.
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-card">
              <h3 className="font-semibold mb-2">🚀 DevOps & Automation</h3>
              <p className="text-sm text-muted-foreground">
                CI/CD pipelines, automated testing, infrastructure as code, monitoring & alerting,
                auto-scaling, zero-downtime deployments.
              </p>
            </div>

            <div className="p-6 border rounded-lg bg-card">
              <h3 className="font-semibold mb-2">📱 Mobile & Responsive</h3>
              <p className="text-sm text-muted-foreground">
                Mobile-first design, responsive UI, progressive web app, native mobile apps,
                offline-first architecture, sync optimization.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <div className="border-t pt-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Sẵn sàng bắt đầu Phase 3?</h2>
            <p className="text-muted-foreground">
              Xem chi tiết từng bước hoặc bắt đầu implementation ngay
            </p>
            <div className="flex justify-center gap-4">
              <Link
                to="/detailed-plan"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
              >
                Xem Chi Tiết 850 Bước
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/progress"
                className="px-6 py-3 border rounded-lg hover:bg-muted transition-colors"
              >
                Quay lại Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
