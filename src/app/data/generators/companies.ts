/* ============================================================
 * Vietnamese Company Name Generator
 * Generate realistic Vietnamese company names
 * ============================================================ */

/* ============================================================
 * Company Types & Prefixes
 * ============================================================ */

const COMPANY_TYPES = [
  "Công ty TNHH", // Limited Liability Company
  "Công ty CP", // Joint Stock Company
  "Công ty", // Company
  "Tập đoàn", // Corporation
  "Chi nhánh", // Branch
  "Văn phòng đại diện", // Representative Office
];

const COMPANY_PREFIXES = [
  "Tập đoàn",
  "Công ty",
  "Doanh nghiệp",
  "Tổng công ty",
];

/* ============================================================
 * Industry Types
 * ============================================================ */

const INDUSTRIES = {
  technology: {
    name: "Công nghệ",
    keywords: [
      "Tech",
      "Digital",
      "Solutions",
      "Software",
      "Technology",
      "IT",
      "Data",
      "Cloud",
      "AI",
      "Innovation",
    ],
  },
  finance: {
    name: "Tài chính",
    keywords: [
      "Finance",
      "Capital",
      "Investment",
      "Bank",
      "Securities",
      "Asset",
      "Wealth",
      "Fund",
    ],
  },
  consulting: {
    name: "Tư vấn",
    keywords: [
      "Consulting",
      "Advisory",
      "Partners",
      "Group",
      "Associates",
      "Management",
      "Strategy",
    ],
  },
  manufacturing: {
    name: "Sản xuất",
    keywords: [
      "Manufacturing",
      "Industries",
      "Production",
      "Factory",
      "Engineering",
      "Industrial",
    ],
  },
  retail: {
    name: "Bán lẻ",
    keywords: [
      "Retail",
      "Trade",
      "Commerce",
      "Mart",
      "Store",
      "Shopping",
      "Market",
    ],
  },
  education: {
    name: "Giáo dục",
    keywords: [
      "Education",
      "Academy",
      "Institute",
      "Training",
      "Learning",
      "School",
      "University",
    ],
  },
  healthcare: {
    name: "Y tế",
    keywords: [
      "Health",
      "Medical",
      "Care",
      "Hospital",
      "Clinic",
      "Pharma",
      "Wellness",
    ],
  },
  real_estate: {
    name: "Bất động sản",
    keywords: [
      "Real Estate",
      "Property",
      "Land",
      "Housing",
      "Development",
      "Construction",
    ],
  },
  logistics: {
    name: "Logistics",
    keywords: [
      "Logistics",
      "Transport",
      "Shipping",
      "Supply Chain",
      "Delivery",
      "Cargo",
    ],
  },
  media: {
    name: "Truyền thông",
    keywords: [
      "Media",
      "Communications",
      "Publishing",
      "Broadcasting",
      "Digital Media",
      "Content",
    ],
  },
};

/* ============================================================
 * Vietnamese Company Name Parts
 * ============================================================ */

const VIETNAMESE_KEYWORDS = [
  // Positive attributes
  "Thịnh Vượng", // Prosperity
  "Phát Đạt", // Development
  "Tiến Phát", // Progress
  "Thành Công", // Success
  "Hưng Thịnh", // Prosperity
  "An Phát", // Peace & Development
  "Bảo Minh", // Protection & Brightness
  "Tân Tiến", // Innovation
  "Việt Hưng", // Vietnamese Prosperity
  "Hòa Bình", // Peace
  "Đại Phát", // Great Development
  "Thăng Long", // Rising Dragon
  "Kim Phát", // Golden Development
  "Hoàng Gia", // Royal
  "Minh Anh", // Brightness
  
  // Regional
  "Việt Nam",
  "Sài Gòn",
  "Hà Nội",
  "Đông Dương", // Indochina
  "Nam Á", // South Asia
  "Á Châu", // Asia
];

/* ============================================================
 * Multinational Company Names
 * ============================================================ */

const MULTINATIONAL_NAMES = [
  "Global",
  "International",
  "WorldWide",
  "Universal",
  "Pacific",
  "Asia Pacific",
  "Euro Asia",
  "Metro",
  "Prime",
  "Elite",
  "Premium",
  "Supreme",
  "United",
  "Alliance",
  "Nexus",
  "Pinnacle",
  "Apex",
  "Zenith",
];

/* ============================================================
 * Helper Functions
 * ============================================================ */

function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function randomBool(probability = 0.5): boolean {
  return Math.random() < probability;
}

/* ============================================================
 * Company Name Generation
 * ============================================================ */

/** Generate Vietnamese company name */
export function generateCompanyName(industry?: keyof typeof INDUSTRIES): string {
  const selectedIndustry = industry || randomItem(Object.keys(INDUSTRIES) as Array<keyof typeof INDUSTRIES>);
  const industryData = INDUSTRIES[selectedIndustry];

  // 40% Vietnamese name, 60% English/Mixed
  if (randomBool(0.4)) {
    // Pure Vietnamese
    const type = randomItem(COMPANY_TYPES);
    const name = randomItem(VIETNAMESE_KEYWORDS);
    return `${type} ${name}`;
  } else {
    // English or Mixed
    const keyword = randomItem(industryData.keywords);
    
    if (randomBool(0.5)) {
      // Mixed Vietnamese + English
      const type = randomItem(COMPANY_TYPES);
      return `${type} ${keyword} Việt Nam`;
    } else {
      // Pure English style
      const suffix = randomItem(["Group", "Corporation", "Co., Ltd", "Solutions", "Services", "International"]);
      return randomBool(0.7) ? `${keyword} ${suffix}` : keyword;
    }
  }
}

/** Generate multinational company name */
export function generateMultinationalName(): string {
  const name = randomItem(MULTINATIONAL_NAMES);
  const suffix = randomItem(["Corporation", "Group", "International", "Holdings", "Solutions"]);
  return `${name} ${suffix}`;
}

/** Generate startup/tech company name */
export function generateStartupName(): string {
  const prefixes = ["Smart", "Cloud", "Data", "Tech", "Digital", "Cyber", "Net", "Web", "App", "Soft"];
  const suffixes = ["Tech", "Labs", "Hub", "Studio", "Works", "Soft", "AI", "IO", "ly"];
  
  const prefix = randomItem(prefixes);
  const suffix = randomItem(suffixes);
  
  return randomBool(0.6) ? `${prefix}${suffix}` : `${prefix} ${suffix}`;
}

/** Generate company website */
export function generateWebsite(companyName: string): string {
  // Remove Vietnamese accents and special chars
  const normalized = companyName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/^(cong-ty-tnhh|cong-ty-cp|cong-ty|tap-doan)-/g, "");

  const tlds = [".vn", ".com.vn", ".com", ".net", ".io"];
  const tld = randomItem(tlds);

  return `www.${normalized}${tld}`;
}

/** Generate company address (Vietnamese) */
export function generateAddress(): {
  street: string;
  ward: string;
  district: string;
  city: string;
  fullAddress: string;
} {
  const streets = [
    "Nguyễn Huệ",
    "Lê Lợi",
    "Trần Hưng Đạo",
    "Hai Bà Trưng",
    "Điện Biên Phủ",
    "Lý Thường Kiệt",
    "Võ Văn Tần",
    "Pasteur",
    "Cách Mạng Tháng 8",
    "Nam Kỳ Khởi Nghĩa",
  ];

  const wards = [
    "Bến Nghé",
    "Bến Thành",
    "Đa Kao",
    "Tân Định",
    "Cô Giang",
    "Nguyễn Cư Trinh",
    "Phạm Ngũ Lão",
    "Cầu Ông Lãnh",
    "Nguyễn Thái Bình",
    "Phường 1",
    "Phường 2",
    "Phường 3",
  ];

  const districts = [
    "Quận 1",
    "Quận 3",
    "Quận 5",
    "Quận 7",
    "Quận 10",
    "Bình Thạnh",
    "Phú Nhuận",
    "Tân Bình",
  ];

  const cities = [
    "TP. Hồ Chí Minh",
    "Hà Nội",
    "Đà Nẵng",
    "Cần Thơ",
    "Hải Phòng",
  ];

  const number = Math.floor(Math.random() * 500) + 1;
  const street = randomItem(streets);
  const ward = randomItem(wards);
  const district = randomItem(districts);
  const city = randomItem(cities);

  return {
    street: `${number} ${street}`,
    ward,
    district,
    city,
    fullAddress: `${number} ${street}, ${ward}, ${district}, ${city}`,
  };
}

/** Generate tax ID (Vietnamese MST) */
export function generateTaxId(): string {
  // MST format: 10 digits or 10 digits + branch (3 digits)
  const mainId = Math.floor(Math.random() * 10000000000).toString().padStart(10, "0");
  return randomBool(0.3) 
    ? `${mainId}-${Math.floor(Math.random() * 1000).toString().padStart(3, "0")}`
    : mainId;
}

/** Generate company size */
export function generateCompanySize(): {
  size: "small" | "medium" | "large" | "enterprise";
  employeeCount: number;
  revenue: number; // in VND
} {
  const random = Math.random();
  
  if (random < 0.4) {
    // Small (40%)
    return {
      size: "small",
      employeeCount: Math.floor(Math.random() * 40) + 10, // 10-50
      revenue: Math.floor(Math.random() * 20) * 1000000000 + 5000000000, // 5-25 billion VND
    };
  } else if (random < 0.75) {
    // Medium (35%)
    return {
      size: "medium",
      employeeCount: Math.floor(Math.random() * 150) + 50, // 50-200
      revenue: Math.floor(Math.random() * 75) * 1000000000 + 25000000000, // 25-100 billion VND
    };
  } else if (random < 0.95) {
    // Large (20%)
    return {
      size: "large",
      employeeCount: Math.floor(Math.random() * 300) + 200, // 200-500
      revenue: Math.floor(Math.random() * 400) * 1000000000 + 100000000000, // 100-500 billion VND
    };
  } else {
    // Enterprise (5%)
    return {
      size: "enterprise",
      employeeCount: Math.floor(Math.random() * 1500) + 500, // 500-2000+
      revenue: Math.floor(Math.random() * 2000) * 1000000000 + 500000000000, // 500+ billion VND
    };
  }
}

/* ============================================================
 * Batch Generation
 * ============================================================ */

/** Generate complete company profile */
export function generateCompany(industry?: keyof typeof INDUSTRIES): {
  name: string;
  industry: string;
  website: string;
  address: ReturnType<typeof generateAddress>;
  taxId: string;
  size: ReturnType<typeof generateCompanySize>;
} {
  const selectedIndustry = industry || randomItem(Object.keys(INDUSTRIES) as Array<keyof typeof INDUSTRIES>);
  const name = generateCompanyName(selectedIndustry);

  return {
    name,
    industry: INDUSTRIES[selectedIndustry].name,
    website: generateWebsite(name),
    address: generateAddress(),
    taxId: generateTaxId(),
    size: generateCompanySize(),
  };
}

/** Generate multiple companies */
export function generateCompanies(count: number): Array<ReturnType<typeof generateCompany>> {
  const companies: Array<ReturnType<typeof generateCompany>> = [];
  
  for (let i = 0; i < count; i++) {
    companies.push(generateCompany());
  }
  
  return companies;
}

/** Get all industries */
export function getIndustries(): Array<{ key: string; name: string }> {
  return Object.entries(INDUSTRIES).map(([key, value]) => ({
    key,
    name: value.name,
  }));
}
