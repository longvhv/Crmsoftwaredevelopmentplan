/**
 * 404 Not Found Page
 */
import { Link } from "react-router";
import { AlertCircle, Home, ArrowLeft } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center p-6">
      <div className="text-center max-w-md">
        <div className="mb-6">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-4xl text-gray-900 mb-2">404</h1>
          <p className="text-lg text-gray-600 mb-1">Trang không tìm thấy</p>
          <p className="text-sm text-gray-500">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors"
          >
            <Home className="w-4 h-4" />
            Về trang chủ
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại
          </button>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-2">Các trang phổ biến:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link to="/crm" className="text-xs text-violet-600 hover:underline">
              CRM Dashboard
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/crm/contacts" className="text-xs text-violet-600 hover:underline">
              Contacts
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/crm/companies" className="text-xs text-violet-600 hover:underline">
              Companies
            </Link>
            <span className="text-gray-300">•</span>
            <Link to="/showcase" className="text-xs text-violet-600 hover:underline">
              Components
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
