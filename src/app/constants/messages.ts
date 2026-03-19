/* ============================================================
 * Message Constants - UI Messages & Notifications
 * Centralized user-facing messages (Vietnamese)
 * ============================================================ */

/* ============================================================
 * Success Messages
 * ============================================================ */

export const SUCCESS_MESSAGES = {
  // Generic CRUD
  created: (entity: string) => `${entity} đã được tạo thành công`,
  updated: (entity: string) => `${entity} đã được cập nhật thành công`,
  deleted: (entity: string) => `${entity} đã được xóa thành công`,
  saved: (entity: string) => `${entity} đã được lưu thành công`,
  restored: (entity: string) => `${entity} đã được khôi phục thành công`,

  // Specific entities
  contactCreated: "Liên hệ đã được tạo thành công",
  contactUpdated: "Liên hệ đã được cập nhật thành công",
  contactDeleted: "Liên hệ đã được xóa thành công",

  dealCreated: "Deal đã được tạo thành công",
  dealUpdated: "Deal đã được cập nhật thành công",
  dealStageChanged: "Giai đoạn deal đã được thay đổi",
  dealWon: "Chúc mừng! Deal đã thắng thầu",
  dealLost: "Deal đã bị thua thầu",

  leadCreated: "Lead đã được tạo thành công",
  leadConverted: "Lead đã được chuyển đổi thành khách hàng",

  activityCreated: "Hoạt động đã được tạo thành công",
  activityCompleted: "Hoạt động đã được đánh dấu hoàn thành",

  quotationSent: "Báo giá đã được gửi thành công",
  quotationAccepted: "Báo giá đã được chấp nhận",

  contractSigned: "Hợp đồng đã được ký kết",
  contractRenewed: "Hợp đồng đã được gia hạn",

  ticketCreated: "Ticket hỗ trợ đã được tạo",
  ticketResolved: "Ticket đã được giải quyết",

  // Bulk operations
  bulkDeleted: (count: number) => `Đã xóa ${count} bản ghi`,
  bulkUpdated: (count: number) => `Đã cập nhật ${count} bản ghi`,
  bulkImported: (count: number) => `Đã nhập ${count} bản ghi`,

  // Export/Import
  exportStarted: "Xuất dữ liệu đang được xử lý",
  exportCompleted: "Xuất dữ liệu hoàn tất",
  importCompleted: (success: number, total: number) =>
    `Nhập thành công ${success}/${total} bản ghi`,

  // Settings
  settingsSaved: "Cài đặt đã được lưu",
  passwordChanged: "Mật khẩu đã được thay đổi",
  profileUpdated: "Hồ sơ đã được cập nhật",

  // Notifications
  emailSent: "Email đã được gửi",
  notificationSent: "Thông báo đã được gửi",

  // Other
  copied: "Đã sao chép vào clipboard",
  shared: "Đã chia sẻ thành công",
} as const;

/* ============================================================
 * Error Messages
 * ============================================================ */

export const ERROR_MESSAGES = {
  // Generic errors
  unknown: "Đã xảy ra lỗi không xác định",
  serverError: "Lỗi máy chủ. Vui lòng thử lại sau",
  networkError: "Lỗi kết nối mạng. Kiểm tra kết nối internet của bạn",
  timeout: "Yêu cầu hết thời gian. Vui lòng thử lại",

  // Authentication errors
  unauthorized: "Bạn không có quyền truy cập",
  sessionExpired: "Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại",
  invalidCredentials: "Email hoặc mật khẩu không đúng",
  accountLocked: "Tài khoản đã bị khóa",
  accountInactive: "Tài khoản chưa được kích hoạt",

  // Validation errors
  requiredField: "Vui lòng điền đầy đủ các trường bắt buộc",
  invalidFormat: "Định dạng không hợp lệ",
  invalidEmail: "Email không hợp lệ",
  invalidPhone: "Số điện thoại không hợp lệ",
  invalidDate: "Ngày không hợp lệ",

  // CRUD errors
  notFound: (entity: string) => `Không tìm thấy ${entity}`,
  createFailed: (entity: string) => `Không thể tạo ${entity}`,
  updateFailed: (entity: string) => `Không thể cập nhật ${entity}`,
  deleteFailed: (entity: string) => `Không thể xóa ${entity}`,

  // Specific errors
  contactNotFound: "Không tìm thấy liên hệ",
  dealNotFound: "Không tìm thấy deal",
  leadNotFound: "Không tìm thấy lead",

  // Conflict errors
  duplicateEmail: "Email đã được sử dụng",
  duplicatePhone: "Số điện thoại đã được sử dụng",
  duplicateSku: "Mã SKU đã tồn tại",
  versionMismatch: "Dữ liệu đã được cập nhật bởi người khác. Vui lòng tải lại",

  // Permission errors
  noPermission: "Bạn không có quyền thực hiện hành động này",
  readOnly: "Bạn chỉ có quyền xem",
  cannotDelete: "Không thể xóa mục này",
  cannotEdit: "Không thể chỉnh sửa mục này",

  // File upload errors
  fileTooLarge: (maxSize: string) => `File quá lớn. Kích thước tối đa: ${maxSize}`,
  invalidFileType: (types: string) => `Định dạng file không hợp lệ. Chấp nhận: ${types}`,
  uploadFailed: "Tải file lên thất bại",

  // Import/Export errors
  importFailed: "Nhập dữ liệu thất bại",
  exportFailed: "Xuất dữ liệu thất bại",
  invalidImportFile: "File nhập không hợp lệ",

  // Business logic errors
  leadAlreadyConverted: "Lead này đã được chuyển đổi",
  dealAlreadyClosed: "Deal này đã đóng",
  quotationExpired: "Báo giá đã hết hạn",
  contractExpired: "Hợp đồng đã hết hạn",
  ticketAlreadyClosed: "Ticket đã đóng",

  // AI errors
  aiServiceUnavailable: "Dịch vụ AI tạm thời không khả dụng",
  scoringFailed: "Không thể tính điểm",
  recommendationFailed: "Không thể tạo đề xuất",
} as const;

/* ============================================================
 * Warning Messages
 * ============================================================ */

export const WARNING_MESSAGES = {
  // Confirmations
  unsavedChanges: "Bạn có thay đổi chưa lưu. Bạn có muốn tiếp tục?",
  confirmDelete: (entity: string) => `Bạn có chắc muốn xóa ${entity}?`,
  confirmBulkDelete: (count: number) => `Bạn có chắc muốn xóa ${count} bản ghi?`,
  confirmClose: "Bạn có muốn đóng deal này?",
  confirmCancel: "Bạn có muốn hủy bỏ?",

  // Data loss warnings
  cannotUndo: "Hành động này không thể hoàn tác",
  permanentDelete: "Dữ liệu sẽ bị xóa vĩnh viễn",

  // Status warnings
  quotationExpiringSoon: (days: number) => `Báo giá sẽ hết hạn trong ${days} ngày`,
  contractExpiringSoon: (days: number) => `Hợp đồng sẽ hết hạn trong ${days} ngày`,
  slaBreached: "SLA đã bị vi phạm",
  approachingSlaDeadline: "Sắp đến hạn SLA",

  // Limits
  maxItemsReached: (max: number) => `Đã đạt giới hạn ${max} mục`,
  quotaExceeded: "Đã vượt quá hạn mức",
  rateLimitExceeded: "Quá nhiều yêu cầu. Vui lòng thử lại sau",

  // Feature warnings
  featureDisabled: "Tính năng này hiện không khả dụng",
  betaFeature: "Đây là tính năng beta. Có thể có lỗi",
} as const;

/* ============================================================
 * Info Messages
 * ============================================================ */

export const INFO_MESSAGES = {
  // Loading states
  loading: "Đang tải...",
  processing: "Đang xử lý...",
  saving: "Đang lưu...",
  deleting: "Đang xóa...",
  uploading: "Đang tải lên...",
  generating: "Đang tạo...",

  // Empty states
  noData: "Không có dữ liệu",
  noResults: "Không tìm thấy kết quả",
  noMatches: "Không có kết quả phù hợp",
  emptyList: "Danh sách trống",

  // Instructions
  dragDropFile: "Kéo thả file vào đây hoặc nhấp để chọn",
  selectAtLeast: (count: number) => `Vui lòng chọn ít nhất ${count} mục`,
  fillRequired: "Vui lòng điền các trường bắt buộc",

  // Tips
  tipKeyboardShortcuts: "Nhấn Ctrl+K để mở tìm kiếm nhanh",
  tipBulkActions: "Chọn nhiều mục để thực hiện hành động hàng loạt",
  tipFilters: "Sử dụng bộ lọc để thu hẹp kết quả",

  // Status updates
  syncing: "Đang đồng bộ...",
  syncCompleted: "Đồng bộ hoàn tất",
  offline: "Bạn đang offline",
  reconnected: "Đã kết nối lại",
} as const;

/* ============================================================
 * Confirmation Messages
 * ============================================================ */

export const CONFIRMATION_MESSAGES = {
  // Delete confirmations
  deleteContact: "Bạn có chắc muốn xóa liên hệ này?",
  deleteDeal: "Bạn có chắc muốn xóa deal này?",
  deleteLead: "Bạn có chắc muốn xóa lead này?",
  deleteActivity: "Bạn có chắc muốn xóa hoạt động này?",

  // Status change confirmations
  closeDeal: "Bạn có chắc muốn đóng deal này?",
  convertLead: "Bạn có chắc muốn chuyển đổi lead này thành khách hàng?",
  approveQuotation: "Bạn có chắc muốn phê duyệt báo giá này?",
  rejectQuotation: "Bạn có chắc muốn từ chối báo giá này?",
  resolveTicket: "Bạn có chắc muốn đánh dấu ticket này là đã giải quyết?",

  // Bulk confirmations
  bulkDelete: (count: number, entity: string) =>
    `Bạn có chắc muốn xóa ${count} ${entity}?`,
  bulkUpdate: (count: number, entity: string) =>
    `Bạn có chắc muốn cập nhật ${count} ${entity}?`,

  // Irreversible actions
  permanentAction: "Hành động này không thể hoàn tác. Bạn có chắc muốn tiếp tục?",
} as const;

/* ============================================================
 * Placeholder Messages
 * ============================================================ */

export const PLACEHOLDER_MESSAGES = {
  // Search placeholders
  searchGlobal: "Tìm kiếm liên hệ, deal, lead...",
  searchContacts: "Tìm kiếm liên hệ...",
  searchDeals: "Tìm kiếm deal...",
  searchLeads: "Tìm kiếm lead...",

  // Input placeholders
  enterName: "Nhập tên...",
  enterEmail: "Nhập email...",
  enterPhone: "Nhập số điện thoại...",
  enterCompany: "Nhập tên công ty...",
  enterAddress: "Nhập địa chỉ...",
  enterDescription: "Nhập mô tả...",
  enterNotes: "Nhập ghi chú...",

  // Select placeholders
  selectOption: "Chọn một tùy chọn...",
  selectContact: "Chọn liên hệ...",
  selectEmployee: "Chọn nhân viên...",
  selectProduct: "Chọn sản phẩm...",
  selectStatus: "Chọn trạng thái...",
  selectPriority: "Chọn mức độ ưu tiên...",

  // Date placeholders
  selectDate: "Chọn ngày...",
  selectDateRange: "Chọn khoảng ngày...",
} as const;

/* ============================================================
 * Button Labels
 * ============================================================ */

export const BUTTON_LABELS = {
  // Actions
  create: "Tạo mới",
  edit: "Chỉnh sửa",
  delete: "Xóa",
  save: "Lưu",
  cancel: "Hủy",
  close: "Đóng",
  back: "Quay lại",
  next: "Tiếp theo",
  submit: "Gửi",
  confirm: "Xác nhận",
  apply: "Áp dụng",
  reset: "Đặt lại",
  clear: "Xóa",
  search: "Tìm kiếm",
  filter: "Lọc",
  export: "Xuất",
  import: "Nhập",
  download: "Tải xuống",
  upload: "Tải lên",
  refresh: "Làm mới",
  retry: "Thử lại",

  // Specific actions
  addContact: "Thêm liên hệ",
  addDeal: "Thêm deal",
  addLead: "Thêm lead",
  addActivity: "Thêm hoạt động",
  sendEmail: "Gửi email",
  makeCall: "Gọi điện",
  scheduleMeeting: "Lên lịch họp",

  // Bulk actions
  bulkDelete: "Xóa hàng loạt",
  bulkUpdate: "Cập nhật hàng loạt",
  bulkExport: "Xuất hàng loạt",

  // Other
  viewDetails: "Xem chi tiết",
  viewAll: "Xem tất cả",
  learnMore: "Tìm hiểu thêm",
  getStarted: "Bắt đầu",
} as const;

/* ============================================================
 * Utility Functions
 * ============================================================ */

/** Get success message */
export function getSuccessMessage(action: string, entity: string): string {
  const messages: Record<string, (entity: string) => string> = {
    create: SUCCESS_MESSAGES.created,
    update: SUCCESS_MESSAGES.updated,
    delete: SUCCESS_MESSAGES.deleted,
    save: SUCCESS_MESSAGES.saved,
    restore: SUCCESS_MESSAGES.restored,
  };

  return messages[action]?.(entity) || `${entity} đã được ${action}`;
}

/** Get error message */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  return ERROR_MESSAGES.unknown;
}

/** Get confirmation message */
export function getConfirmMessage(action: string, entity: string): string {
  if (action === "delete") {
    return CONFIRMATION_MESSAGES.deleteContact.replace("liên hệ", entity);
  }
  return `Bạn có chắc muốn ${action} ${entity}?`;
}
