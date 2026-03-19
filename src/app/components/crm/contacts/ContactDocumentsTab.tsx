/**
 * Tab Documents cho Contact Detail Page
 * Quản lý tài liệu, file uploads, version control
 */
import { useState } from "react";
import {
  File,
  FileText,
  FileSpreadsheet,
  FileImage,
  Upload,
  Download,
  Trash2,
  Eye,
  Clock,
  User,
  Search,
  FolderOpen,
} from "lucide-react";
import { Button } from "../../ui/button";
import { toast } from "sonner";

interface Document {
  id: string;
  name: string;
  type: "pdf" | "doc" | "xls" | "img" | "other";
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  url: string;
  category?: string;
}

const FILE_TYPE_ICONS: Record<Document["type"], React.ReactNode> = {
  pdf: <FileText className="w-5 h-5 text-red-500" />,
  doc: <FileText className="w-5 h-5 text-blue-500" />,
  xls: <FileSpreadsheet className="w-5 h-5 text-green-500" />,
  img: <FileImage className="w-5 h-5 text-purple-500" />,
  other: <File className="w-5 h-5 text-gray-500" />,
};

interface ContactDocumentsTabProps {
  contactId: string;
  documents?: Document[];
}

export function ContactDocumentsTab({ contactId, documents: initialDocuments = [] }: ContactDocumentsTabProps) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

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

  const handleUpload = () => {
    // Simulate file upload
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      name: "Hợp đồng mẫu.pdf",
      type: "pdf",
      size: 2456789,
      uploadedBy: "user-001",
      uploadedAt: new Date().toISOString(),
      url: "#",
      category: "Contracts",
    };
    setDocuments([newDoc, ...documents]);
    toast.success("Đã tải lên tài liệu");
  };

  const handleDelete = (docId: string) => {
    setDocuments(documents.filter((d) => d.id !== docId));
    toast.success("Đã xóa tài liệu");
  };

  const categories = ["all", ...Array.from(new Set(documents.map((d) => d.category).filter(Boolean)))];

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-5">
      {/* Header Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm tài liệu..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
          />
        </div>
        <Button onClick={handleUpload} size="sm" className="bg-violet-600 hover:bg-violet-700 text-white">
          <Upload className="w-4 h-4 mr-1.5" />
          Tải lên
        </Button>
      </div>

      {/* Categories Filter */}
      {categories.length > 1 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-500">Danh mục:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs rounded-lg transition-colors ${
                selectedCategory === cat
                  ? "bg-violet-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat === "all" ? "Tất cả" : cat}
            </button>
          ))}
        </div>
      )}

      {/* Documents List */}
      {filteredDocuments.length === 0 ? (
        <div className="py-16 text-center">
          <FolderOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm text-gray-500">
            {searchQuery || selectedCategory !== "all" ? "Không tìm thấy tài liệu nào" : "Chưa có tài liệu nào"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {searchQuery || selectedCategory !== "all"
              ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm"
              : "Nhấn 'Tải lên' để thêm tài liệu mới"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-all group"
            >
              {/* Document Header */}
              <div className="flex items-start gap-3 mb-3">
                <div className="flex-shrink-0">{FILE_TYPE_ICONS[doc.type]}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm text-gray-900 truncate mb-1">{doc.name}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{formatFileSize(doc.size)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(doc.uploadedAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Category */}
              {doc.category && (
                <div className="mb-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-violet-100 text-violet-700">
                    {doc.category}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 px-2 py-1 hover:bg-blue-50 rounded transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Xem
                </button>
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-xs text-green-600 hover:text-green-700 px-2 py-1 hover:bg-green-50 rounded transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  Tải về
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(doc.id)}
                  className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 px-2 py-1 hover:bg-red-50 rounded transition-colors ml-auto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {documents.length > 0 && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>
              Tổng: <strong className="text-gray-900">{documents.length}</strong> tài liệu
            </span>
            <span>•</span>
            <span>
              Dung lượng:{" "}
              <strong className="text-gray-900">
                {formatFileSize(documents.reduce((sum, d) => sum + d.size, 0))}
              </strong>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}