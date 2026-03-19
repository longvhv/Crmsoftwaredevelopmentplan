/**
 * Deal Products Tab - Quản lý sản phẩm/dịch vụ trong deal
 */
import { useState } from "react";
import {
  Plus,
  Package,
  DollarSign,
  Percent,
  Trash2,
  Edit3,
  Search
} from "lucide-react";
import { toast } from "sonner";
import { formatCurrency } from "../../../constants/crmConfig";

interface DealProduct {
  id: string;
  name: string;
  sku?: string;
  quantity: number;
  unitPrice: number;
  discount: number; // percentage
  total: number;
}

interface DealProductsTabProps {
  dealId: string;
}

// Mock products data
const generateMockProducts = (dealId: string): DealProduct[] => {
  const productTemplates = [
    { name: "CRM Enterprise License", sku: "CRM-ENT-001", unitPrice: 50000000 },
    { name: "Professional Services - Implementation", sku: "PS-IMP-001", unitPrice: 30000000 },
    { name: "Training Package (5 days)", sku: "TRN-PKG-005", unitPrice: 15000000 },
    { name: "Premium Support (Annual)", sku: "SUP-PRM-YR", unitPrice: 12000000 },
    { name: "Data Migration Service", sku: "PS-MIG-001", unitPrice: 8000000 },
  ];

  const numProducts = Math.floor(Math.random() * 3) + 2; // 2-4 products
  const selectedProducts = productTemplates.slice(0, numProducts);

  return selectedProducts.map((template, index) => {
    const quantity = Math.floor(Math.random() * 3) + 1;
    const discount = [0, 5, 10, 15][Math.floor(Math.random() * 4)];
    const subtotal = template.unitPrice * quantity;
    const total = subtotal * (1 - discount / 100);

    return {
      id: `prod-${dealId}-${index}`,
      name: template.name,
      sku: template.sku,
      quantity,
      unitPrice: template.unitPrice,
      discount,
      total
    };
  });
};

export function DealProductsTab({ dealId }: DealProductsTabProps) {
  const [products, setProducts] = useState<DealProduct[]>(() => generateMockProducts(dealId));
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  // Calculate totals
  const subtotal = products.reduce((sum, p) => sum + (p.unitPrice * p.quantity), 0);
  const totalDiscount = products.reduce((sum, p) => {
    const itemSubtotal = p.unitPrice * p.quantity;
    return sum + (itemSubtotal * p.discount / 100);
  }, 0);
  const total = subtotal - totalDiscount;

  const handleDeleteProduct = (productId: string) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      setProducts(products.filter(p => p.id !== productId));
      toast.success("Đã xóa sản phẩm");
    }
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setProducts(products.map(p => {
      if (p.id === productId) {
        const subtotal = p.unitPrice * quantity;
        const total = subtotal * (1 - p.discount / 100);
        return { ...p, quantity, total };
      }
      return p;
    }));
  };

  const handleUpdateDiscount = (productId: string, discount: number) => {
    if (discount < 0 || discount > 100) return;
    
    setProducts(products.map(p => {
      if (p.id === productId) {
        const subtotal = p.unitPrice * p.quantity;
        const total = subtotal * (1 - discount / 100);
        return { ...p, discount, total };
      }
      return p;
    }));
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm sản phẩm..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            setIsAddingProduct(true);
            toast.info("Add product feature coming soon");
          }}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg text-sm hover:bg-violet-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Thêm sản phẩm
        </button>
      </div>

      {/* Products Table */}
      {filteredProducts.length > 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sản phẩm
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Đơn giá
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Số lượng
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Giảm giá
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thành tiền
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-violet-100 text-violet-600 rounded flex items-center justify-center flex-shrink-0">
                          <Package className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-500">{product.sku || "—"}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm text-gray-900">{formatCurrency(product.unitPrice)}</span>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        value={product.quantity}
                        onChange={(e) => handleUpdateQuantity(product.id, parseInt(e.target.value) || 1)}
                        min="1"
                        className="w-16 px-2 py-1 text-sm text-center border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          value={product.discount}
                          onChange={(e) => handleUpdateDiscount(product.id, parseFloat(e.target.value) || 0)}
                          min="0"
                          max="100"
                          step="5"
                          className="w-16 px-2 py-1 text-sm text-center border border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                        />
                        <Percent className="w-3 h-3 text-gray-400" />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(product.total)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() => toast.info("Edit feature coming soon")}
                          className="p-1 text-gray-400 hover:text-violet-600 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(product.id)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                          title="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary */}
          <div className="border-t border-gray-200 bg-gray-50 p-4">
            <div className="max-w-md ml-auto space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="text-gray-900">{formatCurrency(subtotal)}</span>
              </div>
              
              {totalDiscount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Giảm giá:</span>
                  <span className="text-red-600">-{formatCurrency(totalDiscount)}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-base font-semibold pt-2 border-t border-gray-200">
                <span className="text-gray-900">Tổng cộng:</span>
                <span className="text-violet-600">{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-sm text-gray-500 mb-4">
            {searchQuery ? "Không tìm thấy sản phẩm" : "Chưa có sản phẩm nào trong deal"}
          </p>
          {!searchQuery && (
            <button
              type="button"
              onClick={() => toast.info("Add product feature coming soon")}
              className="text-sm text-violet-600 hover:text-violet-700"
            >
              Thêm sản phẩm đầu tiên
            </button>
          )}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-1">Tổng sản phẩm</div>
          <div className="text-2xl font-semibold text-gray-900">{products.length}</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-1">Tổng giảm giá</div>
          <div className="text-2xl font-semibold text-red-600">{formatCurrency(totalDiscount)}</div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-1">Giá trị deal</div>
          <div className="text-2xl font-semibold text-violet-600">{formatCurrency(total)}</div>
        </div>
      </div>
    </div>
  );
}
