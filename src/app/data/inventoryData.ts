/**
 * Mock data cho Inventory Management.
 * Phase 5 — Centralized data layer.
 */
import type { InventoryItem } from "../types/crm";

export const inventoryItems: InventoryItem[] = [
  {
    id: "inv_001", name: "CRM Enterprise License", sku: "LIC-CRM-ENT", type: "license",
    category: "Phần mềm", currentStock: 45, minStock: 10, maxStock: 100, reservedStock: 12,
    unitPrice: 15000000, totalValue: 675000000, status: "in-stock",
    location: "Cloud License Pool", supplier: "Internal", lastRestocked: "2026-02-15",
    monthlyUsage: 8, daysUntilStockout: 128, autoReorder: true,
    tags: ["CRM", "Enterprise"],
  },
  {
    id: "inv_002", name: "AI Agent Seat License", sku: "LIC-AI-SEAT", type: "license",
    category: "AI", currentStock: 8, minStock: 10, maxStock: 50, reservedStock: 3,
    unitPrice: 8000000, totalValue: 64000000, status: "low-stock",
    location: "Cloud License Pool", supplier: "AI-CRM Labs", lastRestocked: "2026-01-20",
    monthlyUsage: 5, daysUntilStockout: 30, autoReorder: true,
    tags: ["AI", "License"],
  },
  {
    id: "inv_003", name: "API Gateway - Pro Tier", sku: "SUB-API-PRO", type: "subscription",
    category: "Infrastructure", currentStock: 25, minStock: 5, maxStock: 30, reservedStock: 0,
    unitPrice: 3500000, totalValue: 87500000, status: "in-stock",
    location: "Cloud", supplier: "AWS", lastRestocked: "2026-03-01",
    monthlyUsage: 2, daysUntilStockout: 375, autoReorder: true,
    tags: ["API", "Infra"],
  },
  {
    id: "inv_004", name: "Laptop Dell Latitude 7440", sku: "HW-LAP-7440", type: "hardware",
    category: "Thiết bị", currentStock: 0, minStock: 5, maxStock: 20, reservedStock: 0,
    unitPrice: 32000000, totalValue: 0, status: "out-of-stock",
    location: "Kho HCM", supplier: "Dell Vietnam", lastRestocked: "2025-12-10",
    monthlyUsage: 3, daysUntilStockout: null, autoReorder: false,
    tags: ["Laptop", "Hardware"],
  },
  {
    id: "inv_005", name: "SSL Certificate Wildcard", sku: "SUB-SSL-WC", type: "subscription",
    category: "Bảo mật", currentStock: 3, minStock: 2, maxStock: 5, reservedStock: 1,
    unitPrice: 5000000, totalValue: 15000000, status: "in-stock",
    location: "Cloud", supplier: "DigiCert", lastRestocked: "2026-01-05",
    monthlyUsage: 0.5, daysUntilStockout: 120, autoReorder: true,
    tags: ["SSL", "Bảo mật"],
  },
  {
    id: "inv_006", name: "Storage SSD 1TB NVMe", sku: "HW-SSD-1TB", type: "hardware",
    category: "Thiết bị", currentStock: 18, minStock: 5, maxStock: 30, reservedStock: 4,
    unitPrice: 2500000, totalValue: 45000000, status: "in-stock",
    location: "Kho HN", supplier: "Samsung Vietnam", lastRestocked: "2026-02-20",
    monthlyUsage: 3, daysUntilStockout: 140, autoReorder: false,
    tags: ["SSD", "Storage"],
  },
  {
    id: "inv_007", name: "Email Marketing Credits (10K)", sku: "CON-EMAIL-10K", type: "consumable",
    category: "Marketing", currentStock: 4, minStock: 3, maxStock: 15, reservedStock: 1,
    unitPrice: 1200000, totalValue: 4800000, status: "low-stock",
    location: "Cloud", supplier: "SendGrid", lastRestocked: "2026-02-01",
    monthlyUsage: 2, daysUntilStockout: 45, autoReorder: true,
    tags: ["Email", "Marketing"],
  },
  {
    id: "inv_008", name: "SMS Credits Pack (5000)", sku: "CON-SMS-5K", type: "consumable",
    category: "Marketing", currentStock: 7, minStock: 3, maxStock: 20, reservedStock: 0,
    unitPrice: 850000, totalValue: 5950000, status: "in-stock",
    location: "Cloud", supplier: "Twilio", lastRestocked: "2026-02-25",
    monthlyUsage: 2, daysUntilStockout: 105, autoReorder: true,
    tags: ["SMS", "Marketing"],
  },
  {
    id: "inv_009", name: "CRM Basic License", sku: "LIC-CRM-BAS", type: "license",
    category: "Phần mềm", currentStock: 120, minStock: 20, maxStock: 80, reservedStock: 5,
    unitPrice: 5000000, totalValue: 600000000, status: "overstock",
    location: "Cloud License Pool", supplier: "Internal", lastRestocked: "2026-03-01",
    monthlyUsage: 10, daysUntilStockout: 345, autoReorder: false,
    tags: ["CRM", "Basic"],
  },
  {
    id: "inv_010", name: "Màn hình Dell UltraSharp 27\"", sku: "HW-MON-27US", type: "hardware",
    category: "Thiết bị", currentStock: 6, minStock: 3, maxStock: 15, reservedStock: 2,
    unitPrice: 12000000, totalValue: 72000000, status: "in-stock",
    location: "Kho HCM", supplier: "Dell Vietnam", lastRestocked: "2026-02-10",
    monthlyUsage: 1, daysUntilStockout: 120, autoReorder: false,
    tags: ["Màn hình", "Hardware"],
  },
  {
    id: "inv_011", name: "Figma Enterprise License", sku: "SUB-FIGMA-ENT", type: "subscription",
    category: "Thiết kế", currentStock: 15, minStock: 5, maxStock: 25, reservedStock: 0,
    unitPrice: 2200000, totalValue: 33000000, status: "in-stock",
    location: "Cloud", supplier: "Figma Inc.", lastRestocked: "2026-01-15",
    monthlyUsage: 1, daysUntilStockout: 450, autoReorder: true,
    tags: ["Figma", "Design"],
  },
  {
    id: "inv_012", name: "GPU Server A100 80GB", sku: "HW-GPU-A100", type: "hardware",
    category: "AI Infrastructure", currentStock: 2, minStock: 2, maxStock: 8, reservedStock: 1,
    unitPrice: 450000000, totalValue: 900000000, status: "low-stock",
    location: "DC Tân Thuận", supplier: "NVIDIA Vietnam", lastRestocked: "2025-11-01",
    monthlyUsage: 0.5, daysUntilStockout: 60, autoReorder: false,
    tags: ["GPU", "AI", "Server"],
  },
];
