/* ============================================================
 * Mock Data Factories - Central Export
 * ============================================================ */

export * from "./contactFactory";
export * from "./dealFactory";
export * from "./leadFactory";

// Simple factories for other entities (compact implementations)

import type { Employee, Activity, Product, Quotation, Contract, SupportTicket } from "@/types";
import { generateFullName, generateJobTitle, generateDepartment } from "../generators/names";
import { generateEntityDates, randomBusinessHours, randomFutureDate } from "../generators/dates";

const generateUUID = () => `018d${Math.random().toString(16).slice(2, 6)}-${Math.random().toString(16).slice(2, 6)}-7${Math.random().toString(16).slice(2, 4)}-${Math.random().toString(16).slice(2, 6)}-${Math.random().toString(16).slice(2, 14)}`;
const randomItem = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomBool = (p = 0.5) => Math.random() < p;

/* Employee Factory */
export function createEmployee(): Employee {
  const nameData = generateFullName();
  const dates = generateEntityDates();
  
  return {
    id: generateUUID(),
    tenantId: "018d0001-0001-7001-8001-000000000001",
    version: 1,
    createdAt: dates.createdAt.toISOString(),
    updatedAt: dates.updatedAt.toISOString(),
    deletedAt: null,
    
    employeeCode: `EMP${Math.floor(Math.random() * 10000).toString().padStart(4, "0")}`,
    fullName: nameData.fullName,
    email: `${nameData.fullName.toLowerCase().replace(/\s+/g, ".")}@company.vn`,
    departmentId: randomBool(0.9) ? generateUUID() : undefined,
    position: generateJobTitle(),
    employeeType: randomBool(0.95) ? "human" : "ai-agent",
    status: randomItem(["active", "inactive", "on-leave"]),
    performanceScore: Math.floor(Math.random() * 40) + 60, // 60-100
    performanceTrend: randomItem(["up", "down", "stable"]),
    tags: [],
  } as Employee;
}

export const createEmployees = (count: number): Employee[] => 
  Array.from({ length: count }, createEmployee);

/* Activity Factory */
export function createActivity(contactId?: string): Activity {
  const dates = generateEntityDates();
  const dueDate = randomBool(0.6) ? randomFutureDate(30) : undefined;
  
  return {
    id: generateUUID(),
    tenantId: "018d0001-0001-7001-8001-000000000001",
    version: 1,
    createdAt: dates.createdAt.toISOString(),
    updatedAt: dates.updatedAt.toISOString(),
    deletedAt: null,
    
    activityType: randomItem(["call", "email", "meeting", "note", "task"]),
    subject: randomItem([
      "Follow-up cuộc gọi",
      "Gửi báo giá",
      "Lên lịch demo",
      "Gặp khách hàng",
      "Ghi chú cuộc họp",
    ]),
    description: "Chi tiết hoạt động...",
    contactId: contactId || (randomBool(0.8) ? generateUUID() : undefined),
    dealId: randomBool(0.4) ? generateUUID() : undefined,
    ownerId: randomBool(0.95) ? generateUUID() : undefined,
    status: randomItem(["planned", "in-progress", "completed", "cancelled"]),
    priority: randomItem(["low", "medium", "high", "urgent"]),
    dueDate: dueDate?.toISOString(),
  } as Activity;
}

export const createActivities = (count: number): Activity[] =>
  Array.from({ length: count }, () => createActivity());

/* Product Factory */
export function createProduct(): Product {
  const dates = generateEntityDates();
  const products = ["CRM Software", "Analytics Platform", "Marketing Suite", "Support Desk", "Cloud Storage"];
  const name = randomItem(products);
  
  return {
    id: generateUUID(),
    tenantId: "018d0001-0001-7001-8001-000000000001",
    version: 1,
    createdAt: dates.createdAt.toISOString(),
    updatedAt: dates.updatedAt.toISOString(),
    deletedAt: null,
    
    name,
    sku: `PRD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    description: `${name} - Enterprise solution`,
    category: randomItem(["Software", "Services", "Hardware", "Consulting"]),
    basePrice: Math.floor(Math.random() * 50000000) + 10000000, // 10M-60M VND
    currency: "VND",
    isActive: randomBool(0.9),
    stockQuantity: randomBool(0.5) ? Math.floor(Math.random() * 100) : undefined,
    tags: [],
  } as Product;
}

export const createProducts = (count: number): Product[] =>
  Array.from({ length: count }, createProduct);

/* Quotation Factory */
export function createQuotation(contactId?: string): Quotation {
  const dates = generateEntityDates();
  const lineItems = Array.from({ length: Math.floor(Math.random() * 3) + 1 }, () => {
    const qty = Math.floor(Math.random() * 5) + 1;
    const price = Math.floor(Math.random() * 50000000) + 5000000;
    return { quantity: qty, unitPrice: price, lineTotal: qty * price };
  });
  
  const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
  
  return {
    id: generateUUID(),
    tenantId: "018d0001-0001-7001-8001-000000000001",
    version: 1,
    createdAt: dates.createdAt.toISOString(),
    updatedAt: dates.updatedAt.toISOString(),
    deletedAt: null,
    
    quotationNumber: `QUO-${Date.now().toString().slice(-6)}`,
    contactId: contactId || generateUUID(),
    dealId: randomBool(0.6) ? generateUUID() : undefined,
    status: randomItem(["draft", "sent", "accepted", "rejected", "expired"]),
    validUntil: randomFutureDate(30).toISOString().split("T")[0],
    subtotal,
    tax: subtotal * 0.1,
    discount: 0,
    total: subtotal * 1.1,
    currency: "VND",
  } as Quotation;
}

export const createQuotations = (count: number): Quotation[] =>
  Array.from({ length: count }, () => createQuotation());

/* Contract Factory */
export function createContract(contactId?: string): Contract {
  const dates = generateEntityDates();
  const startDate = new Date(dates.createdAt);
  const endDate = new Date(startDate);
  endDate.setFullYear(endDate.getFullYear() + 1);
  
  return {
    id: generateUUID(),
    tenantId: "018d0001-0001-7001-8001-000000000001",
    version: 1,
    createdAt: dates.createdAt.toISOString(),
    updatedAt: dates.updatedAt.toISOString(),
    deletedAt: null,
    
    contractNumber: `CON-${Date.now().toString().slice(-6)}`,
    contactId: contactId || generateUUID(),
    status: randomItem(["draft", "active", "expired", "terminated", "renewed"]),
    startDate: startDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
    value: Math.floor(Math.random() * 500000000) + 100000000, // 100M-600M VND
    currency: "VND",
    autoRenew: randomBool(0.4),
  } as Contract;
}

export const createContracts = (count: number): Contract[] =>
  Array.from({ length: count }, () => createContract());

/* Support Ticket Factory */
export function createSupportTicket(contactId?: string): SupportTicket {
  const dates = generateEntityDates();
  
  return {
    id: generateUUID(),
    tenantId: "018d0001-0001-7001-8001-000000000001",
    version: 1,
    createdAt: dates.createdAt.toISOString(),
    updatedAt: dates.updatedAt.toISOString(),
    deletedAt: null,
    
    ticketNumber: `TKT-${Date.now().toString().slice(-6)}`,
    contactId: contactId || (randomBool(0.9) ? generateUUID() : undefined),
    subject: randomItem([
      "Vấn đề đăng nhập",
      "Yêu cầu hỗ trợ kỹ thuật",
      "Câu hỏi về tính năng",
      "Báo lỗi hệ thống",
      "Yêu cầu nâng cấp",
    ]),
    description: "Mô tả chi tiết vấn đề...",
    status: randomItem(["open", "in-progress", "pending", "resolved", "closed"]),
    priority: randomItem(["low", "medium", "high", "urgent"]),
    assignedTo: randomBool(0.8) ? generateUUID() : undefined,
    resolvedAt: randomBool(0.3) ? dates.updatedAt.toISOString() : undefined,
  } as SupportTicket;
}

export const createSupportTickets = (count: number): SupportTicket[] =>
  Array.from({ length: count }, () => createSupportTicket());
