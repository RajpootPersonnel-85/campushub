export type SchemeCategory = "General" | "SC" | "ST" | "OBC" | "EWS"
export type CourseLevel = "School" | "UG" | "PG"

export interface SchemeItem {
  id: string
  name: string
  state: string | "Central"
  category: SchemeCategory | "All"
  level: CourseLevel | "All"
  eligibility: string
  benefits: string
  link: string
  active: boolean
}

export const SCHEMES: SchemeItem[] = [
  {
    id: "aicte_pragati",
    name: "AICTE Pragati Scholarship",
    state: "Central",
    category: "All",
    level: "UG",
    eligibility: "Girl students admitted in 1st year of AICTE approved technical degree/diploma.",
    benefits: "₹50,000 per year for tuition, books, equipment, etc.",
    link: "https://www.aicte-india.org/schemes/students-development-schemes/pragati-scheme",
    active: true,
  },
  {
    id: "nsp_central_sector",
    name: "NSP Central Sector Scheme of Scholarships",
    state: "Central",
    category: "All",
    level: "UG",
    eligibility: "Meritorious students with family income criteria as per MHRD norms.",
    benefits: "Scholarship amount credited directly via DBT; renewal on performance.",
    link: "https://scholarships.gov.in/",
    active: true,
  },
  {
    id: "up_laptop_yojana",
    name: "UP Govt. Laptop Yojana",
    state: "Uttar Pradesh",
    category: "All",
    level: "School",
    eligibility: "Students securing first division as per state notification.",
    benefits: "Free laptop for eligible students.",
    link: "https://up.gov.in/",
    active: true,
  },
]

export const STATES: string[] = [
  "All",
  "Central",
  "Andhra Pradesh",
  "Delhi",
  "Gujarat",
  "Karnataka",
  "Maharashtra",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
]

export const CATEGORIES: (SchemeCategory | "All")[] = ["All", "General", "SC", "ST", "OBC", "EWS"]
export const LEVELS: (CourseLevel | "All")[] = ["All", "School", "UG", "PG"]
