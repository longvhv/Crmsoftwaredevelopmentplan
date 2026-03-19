/**
 * Tab Notes cho Contact Detail Page
 * Hệ thống ghi chú với rich text, @mentions, attachments, AI summary
 */
import { useState } from "react";
import {
  MessageSquare,
  Plus,
  Bot,
  User,
  Clock,
  Pencil,
  Trash2,
  Sparkles,
  File,
  Search,
} from "lucide-react";
import { Button } from "../../ui/button";
import { toast } from "sonner";

interface Note {
  id: string;
  content: string;
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
  isPinned?: boolean;
  aiGenerated?: boolean;
  mentions?: string[];
  attachments?: { id: string; name: string; url: string }[];
}

interface ContactNotesTabProps {
  contactId: string;
  notes?: Note[];
}

export function ContactNotesTab({ contactId, notes: initialNotes = [] }: ContactNotesTabProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [newNoteContent, setNewNoteContent] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isGeneratingAiSummary, setIsGeneratingAiSummary] = useState(false);

  const handleAddNote = () => {
    if (!newNoteContent.trim()) {
      toast.error("Vui lòng nhập nội dung ghi chú");
      return;
    }

    const newNote: Note = {
      id: `note-${Date.now()}`,
      content: newNoteContent,
      createdBy: "user-001",
      createdAt: new Date().toISOString(),
    };

    setNotes([newNote, ...notes]);
    setNewNoteContent("");
    setIsAdding(false);
    toast.success("Đã thêm ghi chú mới");
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter((n) => n.id !== noteId));
    toast.success("Đã xóa ghi chú");
  };

  const handleGenerateAiSummary = async () => {
    setIsGeneratingAiSummary(true);
    
    // Simulate AI summary generation
    setTimeout(() => {
      const aiSummary: Note = {
        id: `ai-summary-${Date.now()}`,
        content: `📊 Tóm tắt AI: Contact này có ${notes.length} ghi chú. Chủ yếu về đàm phán hợp đồng và follow-up. Mức độ tương tác cao trong 2 tuần qua. Đề xuất: Lên lịch meeting tiếp theo trong vòng 3 ngày để chốt deal.`,
        createdBy: "ai-system",
        createdAt: new Date().toISOString(),
        aiGenerated: true,
      };
      setNotes([aiSummary, ...notes]);
      setIsGeneratingAiSummary(false);
      toast.success("Đã tạo tóm tắt AI");
    }, 2000);
  };

  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatRelativeTime = (iso: string): string => {
    const d = new Date(iso);
    const now = new Date();
    const diffH = Math.round((now.getTime() - d.getTime()) / 3600000);
    
    if (diffH < 1) return "Vừa xong";
    if (diffH < 24) return `${diffH}h trước`;
    
    const diffD = Math.floor(diffH / 24);
    if (diffD < 30) return `${diffD} ngày trước`;
    
    return `${Math.floor(diffD / 30)} tháng trước`;
  };

  return (
    <div className="space-y-5">
      {/* Header Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm trong ghi chú..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <Button
          onClick={() => setIsAdding(!isAdding)}
          size="sm"
          className="bg-violet-600 hover:bg-violet-700 text-white"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Thêm ghi chú
        </Button>
        <Button
          onClick={handleGenerateAiSummary}
          disabled={isGeneratingAiSummary || notes.length === 0}
          size="sm"
          variant="outline"
          className="border-violet-200 text-violet-700 hover:bg-violet-50"
        >
          {isGeneratingAiSummary ? (
            <>
              <Bot className="w-4 h-4 mr-1.5 animate-pulse" />
              Đang tạo...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-1.5" />
              Tóm tắt AI
            </>
          )}
        </Button>
      </div>

      {/* Add Note Form */}
      {isAdding && (
        <div className="bg-white rounded-xl border-2 border-violet-200 p-4 shadow-sm">
          <h4 className="text-sm text-gray-900 mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-violet-600" />
            Ghi chú mới
          </h4>
          <textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Nhập nội dung ghi chú... (Sử dụng @ để mention người khác)"
            className="w-full min-h-[120px] p-3 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
          />
          <div className="flex items-center gap-2 mt-3">
            <Button onClick={handleAddNote} size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
              Lưu ghi chú
            </Button>
            <Button
              onClick={() => {
                setIsAdding(false);
                setNewNoteContent("");
              }}
              size="sm"
              variant="outline"
            >
              Hủy
            </Button>
          </div>
        </div>
      )}

      {/* Notes List */}
      {filteredNotes.length === 0 ? (
        <div className="py-16 text-center">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm text-gray-500">
            {searchQuery ? "Không tìm thấy ghi chú nào" : "Chưa có ghi chú nào"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {searchQuery ? "Thử tìm kiếm với từ khóa khác" : "Nhấn 'Thêm ghi chú' để bắt đầu"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`bg-white rounded-xl border p-4 hover:shadow-sm transition-all ${
                note.aiGenerated
                  ? "border-violet-200 bg-gradient-to-br from-violet-50/50 to-purple-50/50"
                  : "border-gray-200"
              }`}
            >
              {/* Note Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2 flex-1">
                  {note.aiGenerated ? (
                    <div className="flex items-center gap-1.5 text-xs text-violet-700">
                      <Bot className="w-4 h-4" />
                      <span>AI Summary</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <User className="w-4 h-4" />
                      <span>Nguyễn Văn A</span>
                    </div>
                  )}
                  <span className="text-xs text-gray-400">•</span>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock className="w-3.5 h-3.5" />
                    {formatRelativeTime(note.createdAt)}
                  </div>
                </div>
                {!note.aiGenerated && (
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteNote(note.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Note Content */}
              <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {note.content}
              </div>

              {/* Attachments */}
              {note.attachments && note.attachments.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 flex-wrap">
                    {note.attachments.map((att) => (
                      <a
                        key={att.id}
                        href={att.url}
                        className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded"
                      >
                        <File className="w-3.5 h-3.5" />
                        {att.name}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
