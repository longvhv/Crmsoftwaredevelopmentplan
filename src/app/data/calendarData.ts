/**
 * Mock data — Sự kiện lịch hẹn CRM.
 * Dùng mutable array để giả lập CRUD.
 */
import type { CalendarEvent } from "../types/crm";

export const calendarEvents: CalendarEvent[] = [
  { id: "ev1", title: "Workshop yêu cầu GlobalSoft", type: "meeting", date: "2026-03-03", startTime: "09:00", endTime: "10:30", contactName: "Tanaka Yuki", company: "GlobalSoft Japan", dealTitle: "Hệ thống quản lý kho GlobalSoft", isOnline: true, assignedTo: "Lê Minh Cường", isAIGenerated: false, priority: "high" },
  { id: "ev2", title: "Follow-up deal TechCorp", type: "follow-up", date: "2026-03-03", startTime: "11:00", endTime: "11:30", contactName: "David Chen", company: "TechCorp Inc.", dealTitle: "Xây dựng nền tảng AI cho TechCorp", isOnline: false, assignedTo: "Nguyễn Văn An", isAIGenerated: true, priority: "high", notes: "AI gợi ý: Gửi proposal cuối cùng với giá ưu đãi 5%" },
  { id: "ev3", title: "Demo sản phẩm cho InnovateAI", type: "demo", date: "2026-03-04", startTime: "14:00", endTime: "15:00", contactName: "Sarah Miller", company: "InnovateAI", dealTitle: "Outsource team 8 người cho InnovateAI", isOnline: true, assignedTo: "Nguyễn Văn An", isAIGenerated: false, priority: "high" },
  { id: "ev4", title: "Gọi xác nhận FinServe", type: "call", date: "2026-03-04", startTime: "10:00", endTime: "10:30", contactName: "Robert Kim", company: "FinServe Korea", dealTitle: "Tích hợp API tài chính FinServe", isOnline: false, assignedTo: "Lê Minh Cường", isAIGenerated: false, priority: "high" },
  { id: "ev5", title: "Hạn gửi proposal DigitalWave", type: "deadline", date: "2026-03-05", startTime: "17:00", endTime: "17:00", contactName: "Emma Wilson", company: "DigitalWave EU", dealTitle: "SaaS platform cho DigitalWave", isOnline: false, assignedTo: "Phạm Hoàng Duy", isAIGenerated: false, priority: "medium" },
  { id: "ev6", title: "Họp nội bộ review pipeline Q1", type: "meeting", date: "2026-03-05", startTime: "09:00", endTime: "10:00", location: "Phòng họp A3", isOnline: false, assignedTo: "Nguyễn Văn An", isAIGenerated: false, priority: "medium" },
  { id: "ev7", title: "Follow-up VietTech proposal", type: "follow-up", date: "2026-03-06", startTime: "14:00", endTime: "14:30", contactName: "Nguyễn Thị Lan", company: "VietTech Solutions", dealTitle: "Nâng cấp hệ thống CNTT VietTech", isOnline: true, assignedTo: "Nguyễn Văn An", isAIGenerated: true, priority: "medium", notes: "AI gợi ý: Follow up proposal sau 3 ngày" },
  { id: "ev8", title: "Chuẩn bị tài liệu CloudMatrix", type: "task", date: "2026-03-06", startTime: "10:00", endTime: "12:00", company: "CloudMatrix", dealTitle: "Cloud migration cho CloudMatrix", isOnline: false, assignedTo: "AI Sales Agent", isAIGenerated: true, priority: "low" },
  { id: "ev9", title: "Gọi lead mới Finova Capital", type: "call", date: "2026-03-07", startTime: "09:30", endTime: "10:00", contactName: "James Rodriguez", company: "Finova Capital", isOnline: false, assignedTo: "Nguyễn Văn An", isAIGenerated: true, priority: "high", notes: "Lead mới từ LinkedIn, AI Score 89" },
  { id: "ev10", title: "Demo CRM Phase 2 cho ban lãnh đạo", type: "demo", date: "2026-03-10", startTime: "15:00", endTime: "16:30", location: "Phòng họp lớn B1", isOnline: false, assignedTo: "Nguyễn Văn An", isAIGenerated: false, priority: "high" },
  { id: "ev11", title: "Training AI Agent cho team Sales", type: "meeting", date: "2026-03-11", startTime: "10:00", endTime: "11:30", isOnline: true, assignedTo: "Lê Minh Cường", isAIGenerated: false, priority: "medium" },
  { id: "ev12", title: "Deadline close deal FinServe", type: "deadline", date: "2026-03-20", startTime: "23:59", endTime: "23:59", contactName: "Robert Kim", company: "FinServe Korea", isOnline: false, assignedTo: "Lê Minh Cường", isAIGenerated: false, priority: "high" },
  { id: "ev13", title: "Quarterly business review", type: "meeting", date: "2026-03-15", startTime: "14:00", endTime: "16:00", location: "Phòng họp lớn B1", isOnline: false, assignedTo: "Nguyễn Văn An", isAIGenerated: false, priority: "high" },
  { id: "ev14", title: "Follow-up NexGen Digital", type: "follow-up", date: "2026-03-08", startTime: "11:00", endTime: "11:30", contactName: "Akiko Yamamoto", company: "NexGen Digital", isOnline: true, assignedTo: "AI Sales Agent", isAIGenerated: true, priority: "medium" },
  { id: "ev15", title: "Gọi PayGate UAE", type: "call", date: "2026-03-09", startTime: "16:00", endTime: "16:30", contactName: "Ahmed Hassan", company: "PayGate UAE", isOnline: false, assignedTo: "Phạm Hoàng Duy", isAIGenerated: true, priority: "medium" },
];
