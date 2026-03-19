/**
 * Deal Automation Page - Quản lý automation rules cho deals
 */
import { useState, useEffect } from "react";
import { Zap, Bot, ArrowLeft, TrendingUp, Clock, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router";
import { DealAutomationRules, type AutomationRule } from "../../components/crm/deals/DealAutomationRules";
import { toast } from "sonner";

// Mock data - In real app, fetch from API
const MOCK_RULES: AutomationRule[] = [
  {
    id: "rule-1",
    name: "Gửi email khi deal chuyển sang Negotiation",
    description: "Tự động gửi email template negotiation cho customer khi deal chuyển sang giai đoạn đàm phán",
    enabled: true,
    trigger: {
      type: "stage_changed",
      condition: {
        toStage: "negotiation",
      },
    },
    actions: [
      {
        type: "send_email",
        config: {
          emailTemplate: "Negotiation Welcome",
        },
      },
      {
        type: "create_task",
        config: {
          taskTitle: "Chuẩn bị tài liệu đàm phán",
          taskAssignee: "emp-001",
        },
      },
    ],
    createdDate: "2026-03-10",
    lastTriggered: "2026-03-17",
    triggerCount: 12,
  },
  {
    id: "rule-2",
    name: "Cảnh báo deal ở stage quá lâu",
    description: "Gửi notification khi deal ở một stage quá 14 ngày mà không có hoạt động",
    enabled: true,
    trigger: {
      type: "time_in_stage",
      condition: {
        days: 14,
      },
    },
    actions: [
      {
        type: "send_notification",
        config: {
          notificationMessage: "Deal đang stuck! Hãy review và chuyển stage hoặc thêm activity.",
        },
      },
    ],
    createdDate: "2026-03-05",
    lastTriggered: "2026-03-16",
    triggerCount: 5,
  },
  {
    id: "rule-3",
    name: "Auto-assign deal có giá trị cao",
    description: "Tự động assign deal cho senior sales khi giá trị vượt 500M",
    enabled: true,
    trigger: {
      type: "value_threshold",
      condition: {
        threshold: 500000000,
      },
    },
    actions: [
      {
        type: "assign_to",
        config: {
          assigneeId: "emp-001",
        },
      },
      {
        type: "send_notification",
        config: {
          notificationMessage: "High-value deal detected! Assigned to senior sales.",
        },
      },
    ],
    createdDate: "2026-02-28",
    lastTriggered: "2026-03-15",
    triggerCount: 3,
  },
  {
    id: "rule-4",
    name: "Update priority khi AI Win% cao",
    description: "Tự động chuyển priority thành HOT khi AI Win Probability >= 80%",
    enabled: false,
    trigger: {
      type: "probability_threshold",
      condition: {
        threshold: 80,
      },
    },
    actions: [
      {
        type: "update_field",
        config: {
          fieldName: "priority",
          fieldValue: "hot",
        },
      },
    ],
    createdDate: "2026-03-12",
    triggerCount: 0,
  },
];

export function DealAutomationPage() {
  const navigate = useNavigate();
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRules(MOCK_RULES);
      setLoading(false);
    }, 300);
  }, []);

  const handleSaveRule = (rule: AutomationRule) => {
    setRules((prev) => {
      const existing = prev.find((r) => r.id === rule.id);
      if (existing) {
        return prev.map((r) => (r.id === rule.id ? rule : r));
      }
      return [...prev, rule];
    });
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules((prev) => prev.filter((r) => r.id !== ruleId));
  };

  const handleToggleRule = (ruleId: string, enabled: boolean) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled } : r))
    );
  };

  // Calculate stats
  const activeRules = rules.filter((r) => r.enabled).length;
  const totalTriggers = rules.reduce((sum, r) => sum + r.triggerCount, 0);
  const recentTriggers = rules.filter((r) => r.lastTriggered).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/crm/deals")}
            className="p-2 hover:bg-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Zap className="w-6 h-6 text-violet-600" />
              Deal Automation
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Tự động hóa workflow cho deals với automation rules
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-violet-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Active Rules</p>
                <p className="text-2xl font-semibold text-gray-900">{activeRules}</p>
                <p className="text-xs text-gray-400">
                  {rules.length - activeRules} paused
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Triggers</p>
                <p className="text-2xl font-semibold text-gray-900">{totalTriggers}</p>
                <p className="text-xs text-gray-400">all time</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Recently Active</p>
                <p className="text-2xl font-semibold text-gray-900">{recentTriggers}</p>
                <p className="text-xs text-gray-400">rules triggered</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <Bot className="w-5 h-5 text-violet-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-gray-900 mb-1">
                AI-Powered Automation
              </h3>
              <p className="text-xs text-gray-600">
                Automation rules được tối ưu bởi AI để tự động hóa workflow, giảm công việc thủ công 
                và đảm bảo không bỏ sót deal quan trọng. Rules có thể trigger dựa trên stage changes, 
                AI predictions, deal value, và time-based conditions.
              </p>
            </div>
          </div>
        </div>

        {/* Automation Rules */}
        <div className="bg-gray-50 rounded-xl p-6">
          <DealAutomationRules
            rules={rules}
            onSave={handleSaveRule}
            onDelete={handleDeleteRule}
            onToggle={handleToggleRule}
          />
        </div>

        {/* Best Practices */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            Best Practices cho Automation Rules
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-1.5 flex-shrink-0" />
                <p className="text-gray-600">
                  <span className="font-medium text-gray-900">Test trước khi enable:</span> Luôn test rule với sample data trước
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-1.5 flex-shrink-0" />
                <p className="text-gray-600">
                  <span className="font-medium text-gray-900">Tránh conflict:</span> Đảm bảo không có 2 rules cùng action
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-1.5 flex-shrink-0" />
                <p className="text-gray-600">
                  <span className="font-medium text-gray-900">Monitor performance:</span> Theo dõi trigger count & effectiveness
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-1.5 flex-shrink-0" />
                <p className="text-gray-600">
                  <span className="font-medium text-gray-900">Start simple:</span> Bắt đầu với rules đơn giản, sau đó scale up
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-1.5 flex-shrink-0" />
                <p className="text-gray-600">
                  <span className="font-medium text-gray-900">Document logic:</span> Viết mô tả rõ ràng cho mỗi rule
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-1.5 flex-shrink-0" />
                <p className="text-gray-600">
                  <span className="font-medium text-gray-900">Review regularly:</span> Xem lại và optimize rules định kỳ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
