import {
  Database,
  Layers,
  GitBranch,
  Zap,
  Bot,
  FileJson,
  Table2,
  Activity,
  Search,
  Lock,
} from "lucide-react";
import { SectionCard } from "../components/SectionCard";

const dataEntities = [
  {
    name: "contacts",
    fields: ["id", "name", "email", "phone", "company_id", "type (human|ai)", "primary_role", "secondary_roles[]", "ai_score", "engagement_level", "created_by", "metadata_json"],
    aiFields: ["embedding_vector", "intent_signals[]", "behavior_tags[]", "predicted_value"],
    purpose: "Core entity cho mọi liên hệ: khách hàng, nhân viên, AI agents",
  },
  {
    name: "employees",
    fields: ["id", "contact_id", "employee_type (human|ai)", "primary_role_id", "department_id", "manager_id", "status", "hire_date", "skills_json", "capacity"],
    aiFields: ["performance_embedding", "skill_vector", "workload_score", "burnout_risk", "productivity_index"],
    purpose: "Quản lý cả nhân viên human & AI, hỗ trợ đa vai trò",
  },
  {
    name: "employee_roles",
    fields: ["id", "employee_id", "role_id", "is_primary", "weight_percentage", "start_date", "end_date", "status"],
    aiFields: ["role_fit_score", "performance_in_role"],
    purpose: "Junction table cho mô hình đa vai trò, 1 employee → N roles",
  },
  {
    name: "deals",
    fields: ["id", "name", "company_id", "contact_id", "owner_id", "stage", "value", "currency", "probability", "expected_close", "deal_type (outsource|product)"],
    aiFields: ["ai_win_score", "risk_flags[]", "competitor_analysis_json", "next_best_action", "sentiment_score"],
    purpose: "Pipeline bán hàng cho cả outsource và product model",
  },
  {
    name: "activities",
    fields: ["id", "type (call|email|meeting|task)", "actor_id", "actor_type (human|ai)", "entity_type", "entity_id", "timestamp", "duration", "outcome", "notes"],
    aiFields: ["sentiment", "intent", "quality_score", "embedding", "extracted_entities[]"],
    purpose: "Event log cho mọi hoạt động - dữ liệu training chính cho AI",
  },
  {
    name: "performance_scores",
    fields: ["id", "employee_id", "period", "category", "metric_name", "formula", "target_value", "actual_value", "score", "weight", "is_public"],
    aiFields: ["trend_direction", "anomaly_flag", "peer_benchmark", "ai_recommendation"],
    purpose: "KPI scores minh bạch - mọi nhân viên đều xem được",
  },
  {
    name: "campaigns",
    fields: ["id", "name", "type", "status", "budget", "start_date", "end_date", "target_audience_json", "channels[]", "created_by"],
    aiFields: ["predicted_roi", "optimal_budget", "audience_score", "content_suggestions[]", "performance_prediction"],
    purpose: "Marketing campaigns với AI optimization",
  },
  {
    name: "ai_agent_logs",
    fields: ["id", "agent_id", "action_type", "input_data", "output_data", "model_used", "tokens_used", "latency_ms", "success", "timestamp"],
    aiFields: ["confidence_score", "human_feedback", "quality_rating", "improvement_notes"],
    purpose: "Audit trail cho mọi hành động của AI agents - transparency",
  },
];

const eventTypes = [
  { event: "contact.created", description: "Liên hệ mới được tạo", aiUsage: "Trigger enrichment, scoring" },
  { event: "deal.stage_changed", description: "Deal chuyển stage", aiUsage: "Update win probability, trigger next action" },
  { event: "activity.logged", description: "Hoạt động được ghi nhận", aiUsage: "Training data, performance scoring" },
  { event: "email.sent", description: "Email được gửi", aiUsage: "Sentiment analysis, engagement tracking" },
  { event: "meeting.completed", description: "Cuộc họp hoàn thành", aiUsage: "Auto-summarize, extract action items" },
  { event: "campaign.metrics_updated", description: "Metrics campaign cập nhật", aiUsage: "Optimization, budget reallocation" },
  { event: "performance.score_calculated", description: "Điểm KPI được tính", aiUsage: "Trend analysis, coaching suggestion" },
  { event: "ai_agent.action_completed", description: "AI agent hoàn thành task", aiUsage: "Quality monitoring, learning" },
];

export function DataArchitecturePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900">🗄️ Kiến trúc Dữ liệu AI-Ready</h1>
        <p className="text-gray-500 mt-1">
          Thiết kế dữ liệu làm đầu vào cho AI Agent - Event Sourcing, Structured Logging
        </p>
      </div>

      {/* Design Principles */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <FileJson className="w-5 h-5" />, title: "Structured Data", desc: "JSON metadata phong phú trên mọi entity", color: "text-blue-600 bg-blue-50" },
          { icon: <Activity className="w-5 h-5" />, title: "Event Sourcing", desc: "Mọi thay đổi là immutable event stream", color: "text-violet-600 bg-violet-50" },
          { icon: <Search className="w-5 h-5" />, title: "Semantic Tagging", desc: "AI tự động gắn tags & embeddings", color: "text-indigo-600 bg-indigo-50" },
          { icon: <Lock className="w-5 h-5" />, title: "Audit Trail", desc: "100% traceable, không xóa dữ liệu", color: "text-green-600 bg-green-50" },
        ].map((p) => (
          <div key={p.title} className="bg-white rounded-xl border border-gray-100 p-4">
            <div className={`w-9 h-9 rounded-lg ${p.color} flex items-center justify-center mb-3`}>
              {p.icon}
            </div>
            <h4 className="text-sm text-gray-900 mb-1">{p.title}</h4>
            <p className="text-xs text-gray-500">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Data Models */}
      <SectionCard
        title="Core Data Entities"
        subtitle="Schema thiết kế AI-first với AI-specific fields"
        icon={<Table2 className="w-5 h-5" />}
      >
        <div className="space-y-4">
          {dataEntities.map((entity) => (
            <div key={entity.name} className="p-4 rounded-xl border border-gray-100 hover:border-violet-200 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <Database className="w-4 h-4 text-violet-600" />
                <code className="text-sm text-violet-700 bg-violet-50 px-2 py-0.5 rounded">{entity.name}</code>
                <span className="text-xs text-gray-400">— {entity.purpose}</span>
              </div>
              <div className="grid md:grid-cols-2 gap-3 mt-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1.5">📋 Standard Fields</p>
                  <div className="flex flex-wrap gap-1">
                    {entity.fields.map((f) => (
                      <code key={f} className="text-[10px] bg-gray-50 text-gray-600 px-1.5 py-0.5 rounded border border-gray-100">
                        {f}
                      </code>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-violet-500 mb-1.5 flex items-center gap-1">
                    <Bot className="w-3 h-3" /> AI-Specific Fields
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {entity.aiFields.map((f) => (
                      <code key={f} className="text-[10px] bg-violet-50 text-violet-600 px-1.5 py-0.5 rounded border border-violet-100">
                        {f}
                      </code>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Event Stream */}
      <SectionCard
        title="Event Stream System"
        subtitle="Mọi sự kiện được capture cho AI processing"
        icon={<Zap className="w-5 h-5" />}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-xs text-gray-500 border-b border-gray-100">
                <th className="text-left pb-3 pr-4">Event Type</th>
                <th className="text-left pb-3 pr-4">Description</th>
                <th className="text-left pb-3">AI Usage</th>
              </tr>
            </thead>
            <tbody>
              {eventTypes.map((evt) => (
                <tr key={evt.event} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-2.5 pr-4">
                    <code className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded">
                      {evt.event}
                    </code>
                  </td>
                  <td className="py-2.5 pr-4 text-sm text-gray-600">{evt.description}</td>
                  <td className="py-2.5 text-xs text-violet-600">{evt.aiUsage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Data Pipeline */}
      <SectionCard
        title="AI Data Pipeline"
        subtitle="Luồng xử lý dữ liệu cho AI training & inference"
        icon={<GitBranch className="w-5 h-5" />}
      >
        <div className="space-y-3">
          {[
            { step: "1. Capture", desc: "Mọi user action, API call, system event → Event Store (Kafka)", color: "bg-blue-500" },
            { step: "2. Transform", desc: "ETL pipeline: clean, normalize, enrich data → Data Warehouse", color: "bg-violet-500" },
            { step: "3. Embed", desc: "Chuyển đổi text → vector embeddings → Vector DB (Pinecone)", color: "bg-indigo-500" },
            { step: "4. Index", desc: "Full-text search indexing → Elasticsearch", color: "bg-purple-500" },
            { step: "5. Train", desc: "Fine-tune AI models trên dữ liệu mới → Model Registry", color: "bg-pink-500" },
            { step: "6. Serve", desc: "AI inference API phục vụ real-time predictions → API Gateway", color: "bg-rose-500" },
            { step: "7. Monitor", desc: "Track AI performance, data drift, model degradation → Dashboard", color: "bg-red-500" },
          ].map((s) => (
            <div key={s.step} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
              <div className={`w-2 h-2 rounded-full ${s.color} mt-1.5 flex-shrink-0`} />
              <div>
                <p className="text-sm text-gray-900">{s.step}</p>
                <p className="text-xs text-gray-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
