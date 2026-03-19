/* ============================================================
 * Vietnamese Name Generator
 * Generate realistic Vietnamese names
 * ============================================================ */

/* ============================================================
 * Vietnamese Last Names (Họ)
 * ============================================================ */

const LAST_NAMES = [
  "Nguyễn",
  "Trần",
  "Lê",
  "Phạm",
  "Hoàng",
  "Huỳnh",
  "Phan",
  "Vũ",
  "Võ",
  "Đặng",
  "Bùi",
  "Đỗ",
  "Hồ",
  "Ngô",
  "Dương",
  "Lý",
  "Đinh",
  "Mai",
  "Trương",
  "Cao",
];

/* ============================================================
 * Vietnamese Middle Names (Tên đệm)
 * ============================================================ */

const MIDDLE_NAMES_MALE = [
  "Văn",
  "Hữu",
  "Đức",
  "Quang",
  "Minh",
  "Công",
  "Gia",
  "Thành",
  "Hoàng",
  "Duy",
  "Anh",
  "Bảo",
  "Tuấn",
  "Ngọc",
  "Thanh",
];

const MIDDLE_NAMES_FEMALE = [
  "Thị",
  "Thanh",
  "Thu",
  "Ngọc",
  "Phương",
  "Hồng",
  "Hương",
  "Lan",
  "Kim",
  "Minh",
  "Thúy",
  "Quỳnh",
  "Bảo",
  "Ánh",
  "Diệu",
];

/* ============================================================
 * Vietnamese First Names (Tên)
 * ============================================================ */

const FIRST_NAMES_MALE = [
  "Anh",
  "Bình",
  "Cường",
  "Dũng",
  "Đạt",
  "Giang",
  "Hải",
  "Hùng",
  "Khánh",
  "Khoa",
  "Long",
  "Minh",
  "Nam",
  "Phúc",
  "Quân",
  "Sơn",
  "Tài",
  "Thắng",
  "Toàn",
  "Tuấn",
  "Tùng",
  "Vinh",
  "Vũ",
  "Hưng",
  "Hoàng",
  "Thành",
  "Trung",
  "Huy",
  "Đức",
  "Phong",
];

const FIRST_NAMES_FEMALE = [
  "Anh",
  "Chi",
  "Dung",
  "Hà",
  "Hằng",
  "Hạnh",
  "Hiền",
  "Hoa",
  "Hương",
  "Linh",
  "Loan",
  "Mai",
  "Nga",
  "Nhung",
  "Phương",
  "Quỳnh",
  "Tâm",
  "Trang",
  "Trinh",
  "Tú",
  "Uyên",
  "Vân",
  "Yến",
  "Lan",
  "Thảo",
  "Hồng",
  "My",
  "Thanh",
  "Nhi",
  "Khánh",
];

/* ============================================================
 * Helper Functions
 * ============================================================ */

/** Get random item from array */
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/** Random boolean with probability */
function randomBool(probability = 0.5): boolean {
  return Math.random() < probability;
}

/* ============================================================
 * Name Generation Functions
 * ============================================================ */

/** Generate Vietnamese last name */
export function generateLastName(): string {
  return randomItem(LAST_NAMES);
}

/** Generate Vietnamese middle name */
export function generateMiddleName(gender: "male" | "female"): string {
  const names = gender === "male" ? MIDDLE_NAMES_MALE : MIDDLE_NAMES_FEMALE;
  return randomBool(0.8) ? randomItem(names) : ""; // 80% chance có tên đệm
}

/** Generate Vietnamese first name */
export function generateFirstName(gender: "male" | "female"): string {
  const names = gender === "male" ? FIRST_NAMES_MALE : FIRST_NAMES_FEMALE;
  return randomItem(names);
}

/** Generate full Vietnamese name */
export function generateFullName(gender?: "male" | "female"): {
  firstName: string;
  lastName: string;
  fullName: string;
  gender: "male" | "female";
} {
  const actualGender = gender || (randomBool() ? "male" : "female");
  const lastName = generateLastName();
  const middleName = generateMiddleName(actualGender);
  const firstName = generateFirstName(actualGender);

  const fullName = middleName
    ? `${lastName} ${middleName} ${firstName}`
    : `${lastName} ${firstName}`;

  return {
    firstName: middleName ? `${middleName} ${firstName}` : firstName,
    lastName,
    fullName,
    gender: actualGender,
  };
}

/** Generate email from name */
export function generateEmail(fullName: string, domain?: string): string {
  const domains = domain ? [domain] : [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "company.vn",
    "business.vn",
  ];

  // Remove Vietnamese accents and convert to lowercase
  const normalized = fullName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/\s+/g, ".");

  const selectedDomain = randomItem(domains);
  const randomNum = Math.floor(Math.random() * 100);

  return randomBool(0.7)
    ? `${normalized}@${selectedDomain}`
    : `${normalized}${randomNum}@${selectedDomain}`;
}

/** Generate Vietnamese phone number */
export function generatePhone(): string {
  const prefixes = ["090", "091", "093", "094", "096", "097", "098", "032", "033", "034", "035", "036", "037", "038", "039"];
  const prefix = randomItem(prefixes);
  const suffix = Math.floor(Math.random() * 10000000).toString().padStart(7, "0");
  return `${prefix}${suffix}`;
}

/** Generate job title (Vietnamese) */
export function generateJobTitle(): string {
  const titles = [
    // Management
    "Giám đốc",
    "Phó Giám đốc",
    "Tổng Giám đốc",
    "Giám đốc điều hành",
    "Giám đốc kinh doanh",
    "Giám đốc marketing",
    "Giám đốc công nghệ",
    "Giám đốc tài chính",
    
    // Senior positions
    "Trưởng phòng kinh doanh",
    "Trưởng phòng marketing",
    "Trưởng phòng kỹ thuật",
    "Trưởng phòng nhân sự",
    "Trưởng phòng tài chính",
    
    // Mid-level
    "Phó phòng kinh doanh",
    "Quản lý dự án",
    "Quản lý sản phẩm",
    "Quản lý khu vực",
    "Chuyên viên kinh doanh",
    "Chuyên viên marketing",
    "Chuyên viên tư vấn",
    
    // Staff
    "Nhân viên kinh doanh",
    "Nhân viên marketing",
    "Nhân viên kỹ thuật",
    "Nhân viên hỗ trợ",
    "Kế toán",
    "Thư ký",
  ];

  return randomItem(titles);
}

/** Generate department (Vietnamese) */
export function generateDepartment(): string {
  const departments = [
    "Kinh doanh",
    "Marketing",
    "Kỹ thuật",
    "Công nghệ",
    "Nhân sự",
    "Tài chính",
    "Kế toán",
    "Hành chính",
    "Hỗ trợ khách hàng",
    "Sản phẩm",
    "Dự án",
    "Pháp lý",
  ];

  return randomItem(departments);
}

/* ============================================================
 * Batch Generation
 * ============================================================ */

/** Generate multiple names */
export function generateNames(count: number, gender?: "male" | "female"): Array<{
  firstName: string;
  lastName: string;
  fullName: string;
  gender: "male" | "female";
  email: string;
  phone: string;
}> {
  const names: Array<{
    firstName: string;
    lastName: string;
    fullName: string;
    gender: "male" | "female";
    email: string;
    phone: string;
  }> = [];

  for (let i = 0; i < count; i++) {
    const name = generateFullName(gender);
    names.push({
      ...name,
      email: generateEmail(name.fullName),
      phone: generatePhone(),
    });
  }

  return names;
}

/* ============================================================
 * Seeded Random (for consistent results)
 * ============================================================ */

let seed = Date.now();

/** Set random seed */
export function setSeed(newSeed: number): void {
  seed = newSeed;
}

/** Seeded random number generator */
function seededRandom(): number {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

/** Get random item with seed */
function seededRandomItem<T>(array: T[]): T {
  return array[Math.floor(seededRandom() * array.length)];
}

/** Generate name with seed (for reproducible results) */
export function generateSeededName(index: number, gender?: "male" | "female"): {
  firstName: string;
  lastName: string;
  fullName: string;
  gender: "male" | "female";
  email: string;
  phone: string;
} {
  setSeed(index);
  
  const actualGender = gender || (seededRandom() > 0.5 ? "male" : "female");
  const lastName = seededRandomItem(LAST_NAMES);
  const middleNames = actualGender === "male" ? MIDDLE_NAMES_MALE : MIDDLE_NAMES_FEMALE;
  const middleName = seededRandom() > 0.2 ? seededRandomItem(middleNames) : "";
  const firstNames = actualGender === "male" ? FIRST_NAMES_MALE : FIRST_NAMES_FEMALE;
  const firstName = seededRandomItem(firstNames);

  const fullName = middleName
    ? `${lastName} ${middleName} ${firstName}`
    : `${lastName} ${firstName}`;

  const name = {
    firstName: middleName ? `${middleName} ${firstName}` : firstName,
    lastName,
    fullName,
    gender: actualGender,
  };

  return {
    ...name,
    email: generateEmail(name.fullName),
    phone: generatePhone(),
  };
}
