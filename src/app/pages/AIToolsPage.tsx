import {
  Wand2,
  MessageSquare,
  FileText,
  Search,
  BarChart3,
  Mail,
  Phone,
  Globe,
  Lightbulb,
  Palette,
  Code,
  Shield,
  Target,
  Users,
  Zap,
  Brain,
  PenTool,
  Microscope,
  Bot,
  Sparkles,
  Calculator,
  Languages,
  Image,
  Video,
} from "lucide-react";
import { SectionCard } from "../components/SectionCard";
import { useState } from "react";

interface AITool {
  name: string;
  nameVi: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  users: string[];
  aiModel: string;
  status: "Live" | "Beta" | "Coming Soon";
}

const aiTools: AITool[] = [
  {
    name: "AI Email Composer",
    nameVi: "Soạn Email AI",
    description: "Tự động soạn email chuyên nghiệp cho sales, marketing, support. Phân tích context, suggest tone phù hợp.",
    icon: <Mail className="w-5 h-5" />,
    category: "Communication",
    users: ["Sales", "Marketing", "Support"],
    aiModel: "GPT-4 + Fine-tuned",
    status: "Live",
  },
  {
    name: "AI Lead Scorer",
    nameVi: "Chấm điểm Lead AI",
    description: "Chấm điểm lead tự động dựa trên 50+ tín hiệu: behavior, firmographics, engagement.",
    icon: <Target className="w-5 h-5" />,
    category: "Sales",
    users: ["Sales", "Marketing"],
    aiModel: "ML Ensemble Model",
    status: "Live",
  },
  {
    name: "AI Content Generator",
    nameVi: "Tạo Content AI",
    description: "Sinh content marketing: blog posts, social media, case studies, whitepapers. Đa ngôn ngữ.",
    icon: <PenTool className="w-5 h-5" />,
    category: "Marketing",
    users: ["Marketing", "Content"],
    aiModel: "GPT-4 + Claude",
    status: "Live",
  },
  {
    name: "AI Meeting Assistant",
    nameVi: "Trợ lý Cuộc họp AI",
    description: "Ghi chú cuộc họp tự động, tóm tắt action items, gửi follow-up email.",
    icon: <MessageSquare className="w-5 h-5" />,
    category: "Productivity",
    users: ["PM", "Sales", "BA", "All"],
    aiModel: "Whisper + GPT-4",
    status: "Live",
  },
  {
    name: "AI Document Analyzer",
    nameVi: "Phân tích Tài liệu AI",
    description: "Phân tích hợp đồng, RFP, proposals. Phát hiện rủi ro, extract key terms tự động.",
    icon: <FileText className="w-5 h-5" />,
    category: "Legal",
    users: ["BA", "PM", "Legal"],
    aiModel: "GPT-4 + NER",
    status: "Live",
  },
  {
    name: "AI Chatbot Builder",
    nameVi: "Xây dựng Chatbot AI",
    description: "Tạo chatbot khách hàng không cần code. Train bằng knowledge base, tự học từ conversations.",
    icon: <Bot className="w-5 h-5" />,
    category: "Support",
    users: ["Support", "Marketing"],
    aiModel: "RAG + GPT-4",
    status: "Live",
  },
  {
    name: "AI Data Explorer",
    nameVi: "Khám phá Dữ liệu AI",
    description: "Query dữ liệu CRM bằng ngôn ngữ tự nhiên tiếng Việt. Tự tạo biểu đồ & báo cáo.",
    icon: <Search className="w-5 h-5" />,
    category: "Analytics",
    users: ["All", "Management"],
    aiModel: "Text-to-SQL + GPT-4",
    status: "Live",
  },
  {
    name: "AI Forecast Engine",
    nameVi: "Dự báo AI",
    description: "Dự báo revenue, pipeline, churn. Time-series analysis với confidence intervals.",
    icon: <BarChart3 className="w-5 h-5" />,
    category: "Analytics",
    users: ["Sales", "Management", "Finance"],
    aiModel: "Prophet + LSTM",
    status: "Live",
  },
  {
    name: "AI Call Analyzer",
    nameVi: "Phân tích Cuộc gọi AI",
    description: "Transcribe & phân tích cuộc gọi sales. Detect sentiment, objections, coaching moments.",
    icon: <Phone className="w-5 h-5" />,
    category: "Sales",
    users: ["Sales", "Management"],
    aiModel: "Whisper + Sentiment",
    status: "Beta",
  },
  {
    name: "AI Competitor Intel",
    nameVi: "Tình báo Đối thủ AI",
    description: "Theo dõi đối thủ tự động: website changes, hiring, product updates, social mentions.",
    icon: <Globe className="w-5 h-5" />,
    category: "Strategy",
    users: ["Sales", "Marketing", "PM"],
    aiModel: "Web Scraping + NLP",
    status: "Beta",
  },
  {
    name: "AI Proposal Writer",
    nameVi: "Soạn Proposal AI",
    description: "Tự động tạo proposal dựa trên template, client info, và winning patterns.",
    icon: <Wand2 className="w-5 h-5" />,
    category: "Sales",
    users: ["Sales", "BD", "PM"],
    aiModel: "GPT-4 + Templates",
    status: "Beta",
  },
  {
    name: "AI Design Assistant",
    nameVi: "Trợ lý Thiết kế AI",
    description: "Tạo banner, social media graphics, presentation slides từ text descriptions.",
    icon: <Palette className="w-5 h-5" />,
    category: "Marketing",
    users: ["Marketing", "Design"],
    aiModel: "DALL-E 3 + Canva API",
    status: "Beta",
  },
  {
    name: "AI Code Reviewer",
    nameVi: "Review Code AI",
    description: "Review code tự động, phát hiện bugs, suggest best practices, security vulnerabilities.",
    icon: <Code className="w-5 h-5" />,
    category: "Development",
    users: ["Dev", "DevOps", "QA"],
    aiModel: "CodeLlama + GPT-4",
    status: "Live",
  },
  {
    name: "AI Security Scanner",
    nameVi: "Quét Bảo mật AI",
    description: "Scan & phát hiện threats, vulnerabilities, suspicious activities real-time.",
    icon: <Shield className="w-5 h-5" />,
    category: "Security",
    users: ["DevOps", "Security"],
    aiModel: "Custom ML + Rules",
    status: "Live",
  },
  {
    name: "AI Skill Matcher",
    nameVi: "Ghép Kỹ năng AI",
    description: "Matching nhân viên với project dựa trên skills, availability, past performance.",
    icon: <Users className="w-5 h-5" />,
    category: "HR",
    users: ["PM", "HR", "Management"],
    aiModel: "Recommendation Engine",
    status: "Live",
  },
  {
    name: "AI Workflow Builder",
    nameVi: "Xây dựng Workflow AI",
    description: "Tạo workflow automation từ mô tả ngôn ngữ tự nhiên. No-code automation.",
    icon: <Zap className="w-5 h-5" />,
    category: "Automation",
    users: ["All"],
    aiModel: "GPT-4 + Workflow Engine",
    status: "Beta",
  },
  {
    name: "AI Knowledge Brain",
    nameVi: "Bộ não Kiến thức AI",
    description: "RAG-powered knowledge base. Tìm kiếm & trả lời từ tất cả tài liệu công ty.",
    icon: <Brain className="w-5 h-5" />,
    category: "Knowledge",
    users: ["All"],
    aiModel: "RAG + Embeddings",
    status: "Live",
  },
  {
    name: "AI Idea Generator",
    nameVi: "Sinh Ý tưởng AI",
    description: "Brainstorm chiến lược, campaign ideas, feature ideas dựa trên market data.",
    icon: <Lightbulb className="w-5 h-5" />,
    category: "Strategy",
    users: ["PM", "Marketing", "Product"],
    aiModel: "GPT-4 + Market Data",
    status: "Beta",
  },
  {
    name: "AI Test Generator",
    nameVi: "Tạo Test AI",
    description: "Tự động sinh test cases, test data, regression suites. Increase test coverage.",
    icon: <Microscope className="w-5 h-5" />,
    category: "Development",
    users: ["QA", "Tester", "Dev"],
    aiModel: "GPT-4 + Code Analysis",
    status: "Beta",
  },
  {
    name: "AI Price Optimizer",
    nameVi: "Tối ưu Giá AI",
    description: "Phân tích thị trường, đề xuất pricing strategy tối ưu cho product & services.",
    icon: <Calculator className="w-5 h-5" />,
    category: "Strategy",
    users: ["Sales", "Product", "Finance"],
    aiModel: "Optimization + ML",
    status: "Coming Soon",
  },
  {
    name: "AI Translator",
    nameVi: "Dịch thuật AI",
    description: "Dịch tài liệu, email, proposals đa ngôn ngữ. Giữ context chuyên ngành IT.",
    icon: <Languages className="w-5 h-5" />,
    category: "Productivity",
    users: ["All"],
    aiModel: "GPT-4 + Domain Fine-tune",
    status: "Live",
  },
  {
    name: "AI Video Creator",
    nameVi: "Tạo Video AI",
    description: "Tạo video demo, tutorial, marketing clips từ scripts hoặc text.",
    icon: <Video className="w-5 h-5" />,
    category: "Marketing",
    users: ["Marketing", "Sales"],
    aiModel: "Synthesia + GPT-4",
    status: "Coming Soon",
  },
  {
    name: "AI Image Generator",
    nameVi: "Tạo Hình ảnh AI",
    description: "Tạo product mockups, social graphics, illustrations cho campaigns.",
    icon: <Image className="w-5 h-5" />,
    category: "Marketing",
    users: ["Marketing", "Design"],
    aiModel: "DALL-E 3 + MidJourney",
    status: "Coming Soon",
  },
  {
    name: "AI Performance Coach",
    nameVi: "Huấn luyện Hiệu suất AI",
    description: "Coaching cá nhân hóa cho mỗi nhân viên. Suggest cải thiện dựa trên data.",
    icon: <Sparkles className="w-5 h-5" />,
    category: "HR",
    users: ["All"],
    aiModel: "GPT-4 + Performance Data",
    status: "Beta",
  },
];

const categories = [...new Set(aiTools.map((t) => t.category))];

const statusColors = {
  Live: "bg-green-100 text-green-700",
  Beta: "bg-violet-100 text-violet-700",
  "Coming Soon": "bg-gray-100 text-gray-500",
};

export function AIToolsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredTools =
    selectedCategory === "All"
      ? aiTools
      : aiTools.filter((t) => t.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900">🛠️ Công cụ AI tích hợp</h1>
        <p className="text-gray-500 mt-1">
          25+ AI tools hỗ trợ toàn bộ hoạt động kinh doanh, marketing, development
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
          <p className="text-2xl text-green-700">
            {aiTools.filter((t) => t.status === "Live").length}
          </p>
          <p className="text-sm text-green-600">Live & Ready</p>
        </div>
        <div className="bg-gradient-to-br from-violet-50 to-indigo-50 rounded-xl p-4 border border-violet-100">
          <p className="text-2xl text-violet-700">
            {aiTools.filter((t) => t.status === "Beta").length}
          </p>
          <p className="text-sm text-violet-600">In Beta</p>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl p-4 border border-gray-200">
          <p className="text-2xl text-gray-700">
            {aiTools.filter((t) => t.status === "Coming Soon").length}
          </p>
          <p className="text-sm text-gray-500">Coming Soon</p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
            selectedCategory === "All"
              ? "bg-violet-600 text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          All ({aiTools.length})
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
              selectedCategory === cat
                ? "bg-violet-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {cat} ({aiTools.filter((t) => t.category === cat).length})
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTools.map((tool) => (
          <div
            key={tool.name}
            className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-violet-200 transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 flex items-center justify-center text-violet-600">
                {tool.icon}
              </div>
              <span className={`px-2 py-0.5 rounded text-xs ${statusColors[tool.status]}`}>
                {tool.status}
              </span>
            </div>
            <h4 className="text-sm text-gray-900">{tool.name}</h4>
            <p className="text-xs text-violet-600 mb-2">{tool.nameVi}</p>
            <p className="text-xs text-gray-500 mb-3 leading-relaxed">{tool.description}</p>
            <div className="flex items-center gap-1 mb-2 flex-wrap">
              {tool.users.map((u) => (
                <span
                  key={u}
                  className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded"
                >
                  {u}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gray-400">
              <Brain className="w-3 h-3" />
              {tool.aiModel}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
