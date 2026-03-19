/**
 * AI Chatbot Widget — Trợ lý AI nổi (floating) cho CRM.
 * Giả lập phản hồi AI, hỗ trợ thao tác nhanh, quick actions.
 * Sử dụng toàn cục trong Layout.
 */
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Bot,
  X,
  Send,
  Sparkles,
  BarChart3,
  Users,
  Target,
  Mail,
  Lightbulb,
  Loader2,
  MessageCircle,
  Minimize2,
} from "lucide-react";

/* ============================================================
 * Types
 * ============================================================ */
interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  prompt: string;
}

/* ============================================================
 * Constants
 * ============================================================ */
const QUICK_ACTIONS: QuickAction[] = [
  { icon: <BarChart3 className="w-3.5 h-3.5" />, label: "Tổng quan pipeline", prompt: "Cho tôi tổng quan pipeline hiện tại" },
  { icon: <Target className="w-3.5 h-3.5" />, label: "Deals cần chú ý", prompt: "Những deals nào cần chú ý hôm nay?" },
  { icon: <Users className="w-3.5 h-3.5" />, label: "Lead mới hôm nay", prompt: "Có lead mới nào hôm nay không?" },
  { icon: <Mail className="w-3.5 h-3.5" />, label: "Gợi ý email", prompt: "Gợi ý email follow-up cho deal đang negotiation" },
  { icon: <Lightbulb className="w-3.5 h-3.5" />, label: "Gợi ý hành động", prompt: "Gợi ý 3 hành động tôi nên làm hôm nay" },
];

/** Giả lập phản hồi AI dựa trên từ khoá */
function generateAIResponse(userMessage: string): string {
  const msg = userMessage.toLowerCase();

  if (msg.includes("pipeline") || msg.includes("tổng quan")) {
    return `📊 **Tổng quan Pipeline hôm nay:**

• **8 deals đang mở** — Tổng giá trị $485,000
• **3 deals ở giai đoạn Đàm phán** — nên ưu tiên follow-up
• **2 deals mới** vào giai đoạn Đánh giá sáng nay
• Win rate tháng này: **38%** (↑ 5% so với tháng trước)

💡 *Gợi ý:* Tập trung vào deal "TechCorp AI Platform" ($120K) — xác suất thắng AI dự đoán 78%.`;
  }

  if (msg.includes("deal") && (msg.includes("chú ý") || msg.includes("hôm nay"))) {
    return `🎯 **3 Deals cần chú ý ngay:**

1. **GlobalSoft Japan — CRM System** ($85K)
   ⚠️ Expected close date: ngày mai! Cần gọi xác nhận.

2. **InnovateAI — AI Platform** ($120K)
   📞 Đã 5 ngày không có hoạt động. Gợi ý: gửi email follow-up.

3. **DigitalWave EU — Web App** ($45K)
   🔄 Vừa chuyển sang Đề xuất. Nên lên lịch demo chi tiết.

Tôi có thể soạn email cho deal nào không?`;
  }

  if (msg.includes("lead") && (msg.includes("mới") || msg.includes("hôm nay"))) {
    return `📬 **Lead mới hôm nay: 3 leads**

1. **James Rodriguez** — Finova Capital (VP Technology)
   🔗 LinkedIn | AI Score: 89 | 🔥 Nên liên hệ ngay

2. **Ahmed Hassan** — PayGate UAE (CIO)
   🌐 Inbound | AI Score: 83 | Ngành payments

3. **Lisa Chen** — CloudBridge.io (Founder)
   📧 Cold Outreach | AI Score: 56 | Startup SaaS

💡 *Gợi ý:* Tôi đã tự động gửi email giới thiệu cho James Rodriguez. Bạn muốn tôi liên hệ Ahmed không?`;
  }

  if (msg.includes("email") || msg.includes("follow")) {
    return `✉️ **Gợi ý Email Follow-up:**

**Tiêu đề:** "Cập nhật tiến độ — Dự án {{product_name}} cho {{company}}"

**Nội dung tóm tắt:**
- Nhắc lại những điểm chính từ cuộc họp trước
- Đề xuất timeline cụ thể 
- Kèm case study tương tự
- CTA: Đặt lịch họp tuần sau

📋 Tôi đã có template "Follow-up sau demo" sẵn trong **Email Templates**. Bạn muốn tôi tuỳ chỉnh cho deal nào cụ thể?`;
  }

  if (msg.includes("hành động") || msg.includes("gợi ý") || msg.includes("nên làm")) {
    return `💡 **3 Hành động ưu tiên hôm nay:**

1. 📞 **Gọi xác nhận** deal GlobalSoft Japan ($85K) — close date ngày mai
2. 📬 **Review 3 lead mới** trong Lead Inbox — 2 lead có AI score > 80
3. ✉️ **Gửi proposal** cho DigitalWave EU — đã vào giai đoạn Đề xuất 3 ngày

⏰ Ước tính: ~45 phút để hoàn thành tất cả.

Bạn muốn tôi hỗ trợ việc nào trước?`;
  }

  if (msg.includes("xin chào") || msg.includes("hello") || msg.includes("hi") || msg.includes("chào")) {
    return `👋 Xin chào! Tôi là **AI CRM Assistant**.

Tôi có thể giúp bạn:
• 📊 Tổng quan pipeline & báo cáo nhanh
• 🎯 Phân tích deals & gợi ý hành động
• 📬 Quản lý lead inbox
• ✉️ Soạn email & follow-up
• 📈 Dự đoán & insights từ dữ liệu CRM

Hãy hỏi tôi bất cứ điều gì!`;
  }

  return `Tôi hiểu yêu cầu của bạn. Dựa trên dữ liệu CRM hiện tại:

📊 **Phân tích nhanh:**
• Pipeline có 8 deals đang mở ($485K tổng giá trị)
• 3 lead mới chưa được xử lý
• 2 deals cần follow-up trong tuần này

Bạn muốn tôi đi sâu vào phần nào? Tôi có thể:
1. Phân tích chi tiết một deal cụ thể
2. Soạn email tự động
3. Đề xuất chiến lược tiếp cận lead

Hãy cho tôi biết! 🤖`;
}

/* ============================================================
 * Chat Widget Component
 * ============================================================ */
let msgIdCounter = 1;

export function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Xin chào! Tôi là **AI CRM Assistant**. Tôi có thể giúp bạn phân tích pipeline, quản lý lead, soạn email, và nhiều hơn nữa. Hãy hỏi tôi bất cứ điều gì!",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!text.trim()) return;

      const userMsg: ChatMessage = {
        id: `msg-${msgIdCounter++}`,
        role: "user",
        content: text.trim(),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      // Giả lập delay phản hồi AI
      setTimeout(() => {
        const response = generateAIResponse(text);
        const aiMsg: ChatMessage = {
          id: `msg-${msgIdCounter++}`,
          role: "assistant",
          content: response,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);

        if (!isOpen) {
          setUnreadCount((prev) => prev + 1);
        }
      }, 800 + Math.random() * 700);
    },
    [isOpen],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setUnreadCount(0);
  };

  /** Render markdown-like bold */
  function renderContent(content: string) {
    const parts = content.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="text-gray-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return (
          <em key={i} className="text-gray-500">
            {part.slice(1, -1)}
          </em>
        );
      }
      return <span key={i}>{part}</span>;
    });
  }

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          style={{ height: "min(520px, calc(100vh - 120px))" }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-white text-sm">AI CRM Assistant</h4>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                  <span className="text-white/70 text-[10px]">Trực tuyến</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Thu nhỏ"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                aria-label="Đóng"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.role === "user"
                      ? "bg-violet-600 text-white rounded-br-md"
                      : "bg-gray-100 text-gray-700 rounded-bl-md"
                  }`}
                >
                  {msg.role === "assistant" ? renderContent(msg.content) : msg.content}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3 flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length <= 2 && (
            <div className="px-3 pb-2 flex gap-1.5 flex-wrap">
              {QUICK_ACTIONS.map((action) => (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => sendMessage(action.prompt)}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-violet-50 text-violet-700 border border-violet-200 rounded-full text-[11px] hover:bg-violet-100 transition-colors"
                >
                  {action.icon}
                  {action.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-gray-100 flex-shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Hỏi AI Assistant..."
                rows={1}
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-violet-500 max-h-20"
              />
              <button
                type="button"
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isTyping}
                className="p-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              >
                {isTyping ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-[9px] text-gray-400 mt-1 text-center">
              AI Assistant sử dụng dữ liệu CRM mock · Không phải AI thực
            </p>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        type="button"
        onClick={isOpen ? () => setIsOpen(false) : handleOpen}
        className={`fixed bottom-4 right-4 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 ${
          isOpen
            ? "bg-gray-600 hover:bg-gray-700"
            : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700"
        }`}
        aria-label={isOpen ? "Đóng trợ lý AI" : "Mở trợ lý AI"}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <>
            <MessageCircle className="w-6 h-6 text-white" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </>
        )}
      </button>
    </>
  );
}
