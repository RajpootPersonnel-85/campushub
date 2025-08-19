export type CareerKey =
  | "civil_engineering"
  | "mechanical_engineering"
  | "software_development"
  | "data_science"
  | "graphic_design"
  | "ux_ui_design"
  | "mbbs"
  | "nursing"
  | "pharmacy"
  | "ca"
  | "mba_finance"
  | "cfa"
  | "lawyer"
  | "commerce_general"
  | "arts_general"

export type CareerCategory =
  | "Engineering"
  | "Finance"
  | "Design"
  | "Healthcare"
  | "Law"
  | "Commerce"
  | "Arts"

export interface TrendPoint { year: number; value: number }

export interface InternationalData {
  indiaSalary: string
  usaSalary: string
  canadaSalary: string
  dubaiSalary?: string
  globalGrowth: number
}

export interface CareerInfo {
  key: CareerKey
  name: string
  category: CareerCategory
  growthRate: number // India growth estimate %
  avgSalaryIndia: string // e.g., "₹7 LPA"
  annualOpeningsIndia: string // e.g., "~4.5 Lakh"
  skills: string[]
  futureScope: string
  international: InternationalData
  trend: TrendPoint[] // 2015-2030
}

export const CAREER_CATALOG: Record<CareerKey, CareerInfo> = {
  civil_engineering: {
    key: "civil_engineering",
    name: "Civil Engineering",
    category: "Engineering",
    growthRate: -5,
    avgSalaryIndia: "₹3.5 LPA",
    annualOpeningsIndia: "~50k",
    skills: ["AutoCAD", "Project Mgmt", "Estimation", "Site Supervision"],
    futureScope: "Slower infra demand; niche roles in green infra, BIM, and project controls remain.",
    international: {
      indiaSalary: "₹3.5 LPA",
      usaSalary: "$60k/year",
      canadaSalary: "CAD $55k/year",
      dubaiSalary: "AED 90k/year",
      globalGrowth: -5,
    },
    trend: Array.from({ length: 16 }, (_, i) => {
      const year = 2015 + i
      const base = 100 - i * 1.2 // gradual decline
      return { year, value: Math.max(70, Math.round(base)) }
    }),
  },
  mechanical_engineering: {
    key: "mechanical_engineering",
    name: "Mechanical Engineering",
    category: "Engineering",
    growthRate: 2,
    avgSalaryIndia: "₹4 LPA",
    annualOpeningsIndia: "~1 Lakh",
    skills: ["CAD/CAM", "Manufacturing", "Thermodynamics", "Maintenance"],
    futureScope: "Stable with pockets in EVs, robotics, and advanced manufacturing.",
    international: {
      indiaSalary: "₹4 LPA",
      usaSalary: "$72k/year",
      canadaSalary: "CAD $65k/year",
      dubaiSalary: "AED 120k/year",
      globalGrowth: 3,
    },
    trend: Array.from({ length: 16 }, (_, i) => {
      const year = 2015 + i
      const base = 100 + i * 0.5
      return { year, value: Math.min(125, Math.round(base)) }
    }),
  },
  software_development: {
    key: "software_development",
    name: "Software Development",
    category: "Engineering",
    growthRate: 18,
    avgSalaryIndia: "₹7 LPA",
    annualOpeningsIndia: "~4.5 Lakh",
    skills: ["Java", "Python", "Cloud", "AI/ML", "DevOps"],
    futureScope: "Booming IT + startups; AI, cloud, and cyber-security expand roles.",
    international: {
      indiaSalary: "₹7 LPA",
      usaSalary: "$85k/year",
      canadaSalary: "CAD $75k/year",
      dubaiSalary: "AED 160k/year",
      globalGrowth: 18,
    },
    trend: Array.from({ length: 16 }, (_, i) => {
      const year = 2015 + i
      const base = 90 + i * 2.2
      return { year, value: Math.min(160, Math.round(base)) }
    }),
  },
  data_science: {
    key: "data_science",
    name: "Data Science",
    category: "Engineering",
    growthRate: 22,
    avgSalaryIndia: "₹8 LPA",
    annualOpeningsIndia: "~1.5 Lakh",
    skills: ["Python", "SQL", "ML", "Statistics", "Visualization"],
    futureScope: "High demand globally; analytics embedded across domains.",
    international: {
      indiaSalary: "₹8 LPA",
      usaSalary: "$100k/year",
      canadaSalary: "CAD $85k/year",
      dubaiSalary: "AED 180k/year",
      globalGrowth: 22,
    },
    trend: Array.from({ length: 16 }, (_, i) => {
      const year = 2015 + i
      const base = 80 + i * 2.6
      return { year, value: Math.min(170, Math.round(base)) }
    }),
  },
  graphic_design: {
    key: "graphic_design",
    name: "Graphic Design",
    category: "Design",
    growthRate: 5,
    avgSalaryIndia: "₹3.6 LPA",
    annualOpeningsIndia: "~40k",
    skills: ["Adobe CC", "Branding", "Layout", "Illustration"],
    futureScope: "Steady demand; AI tools shift focus to creative direction and brand systems.",
    international: {
      indiaSalary: "₹3.6 LPA",
      usaSalary: "$55k/year",
      canadaSalary: "CAD $50k/year",
      dubaiSalary: "AED 100k/year",
      globalGrowth: 6,
    },
    trend: Array.from({ length: 16 }, (_, i) => {
      const year = 2015 + i
      const base = 95 + i * 0.9
      return { year, value: Math.min(120, Math.round(base)) }
    }),
  },
  ux_ui_design: {
    key: "ux_ui_design",
    name: "UX/UI Design",
    category: "Design",
    growthRate: 12,
    avgSalaryIndia: "₹6.5 LPA",
    annualOpeningsIndia: "~70k",
    skills: ["User Research", "Wireframing", "Figma", "Prototyping"],
    futureScope: "Strong demand as products mature; research and systems design valued.",
    international: {
      indiaSalary: "₹6.5 LPA",
      usaSalary: "$95k/year",
      canadaSalary: "CAD $80k/year",
      dubaiSalary: "AED 200k/year",
      globalGrowth: 13,
    },
    trend: Array.from({ length: 16 }, (_, i) => {
      const year = 2015 + i
      const base = 92 + i * 1.8
      return { year, value: Math.min(150, Math.round(base)) }
    }),
  },
  mbbs: {
    key: "mbbs",
    name: "Doctor (MBBS)",
    category: "Healthcare",
    growthRate: 10,
    avgSalaryIndia: "₹7.5 LPA",
    annualOpeningsIndia: "~80k",
    skills: ["Clinical Diagnosis", "Patient Care", "Emergency Mgmt"],
    futureScope: "Consistent demand; specialization drives earnings and roles.",
    international: {
      indiaSalary: "₹7.5 LPA",
      usaSalary: "$160k/year",
      canadaSalary: "CAD $140k/year",
      dubaiSalary: "AED 300k/year",
      globalGrowth: 9,
    },
    trend: Array.from({ length: 16 }, (_, i) => {
      const year = 2015 + i
      const base = 100 + i * 1.5
      return { year, value: Math.min(140, Math.round(base)) }
    }),
  },
  nursing: {
    key: "nursing",
    name: "Nursing",
    category: "Healthcare",
    growthRate: 14,
    avgSalaryIndia: "₹3.2 LPA",
    annualOpeningsIndia: "~1.2 Lakh",
    skills: ["Patient Care", "ICU", "Critical Care", "Communication"],
    futureScope: "Growing with aging population; strong international opportunities.",
    international: {
      indiaSalary: "₹3.2 LPA",
      usaSalary: "$75k/year",
      canadaSalary: "CAD $70k/year",
      dubaiSalary: "AED 120k/year",
      globalGrowth: 14,
    },
    trend: Array.from({ length: 16 }, (_, i) => {
      const year = 2015 + i
      const base = 95 + i * 2.0
      return { year, value: Math.min(150, Math.round(base)) }
    }),
  },
  pharmacy: {
    key: "pharmacy",
    name: "Pharmacy",
    category: "Healthcare",
    growthRate: 7,
    avgSalaryIndia: "₹3.4 LPA",
    annualOpeningsIndia: "~60k",
    skills: ["Pharmacology", "Dispensing", "Regulatory", "QA/QC"],
    futureScope: "Steady; biotech and clinical research offer growth tracks.",
    international: {
      indiaSalary: "₹3.4 LPA",
      usaSalary: "$120k/year",
      canadaSalary: "CAD $100k/year",
      dubaiSalary: "AED 220k/year",
      globalGrowth: 6,
    },
    trend: Array.from({ length: 16 }, (_, i) => {
      const year = 2015 + i
      const base = 98 + i * 1.0
      return { year, value: Math.min(130, Math.round(base)) }
    }),
  },
  ca: {
    key: "ca",
    name: "Chartered Accountant (CA)",
    category: "Finance",
    growthRate: 8,
    avgSalaryIndia: "₹8.5 LPA",
    annualOpeningsIndia: "~70k",
    skills: ["Audit", "Taxation", "Accounting", "IFRS"],
    futureScope: "Strong and stable; advisory and analytics skills valued.",
    international: {
      indiaSalary: "₹8.5 LPA",
      usaSalary: "$70k/year",
      canadaSalary: "CAD $65k/year",
      dubaiSalary: "AED 180k/year",
      globalGrowth: 8,
    },
    trend: Array.from({ length: 16 }, (_, i) => {
      const year = 2015 + i
      const base = 100 + i * 1.2
      return { year, value: Math.min(140, Math.round(base)) }
    }),
  },
  mba_finance: {
    key: "mba_finance",
    name: "MBA (Finance)",
    category: "Finance",
    growthRate: 9,
    avgSalaryIndia: "₹9 LPA",
    annualOpeningsIndia: "~90k",
    skills: ["Corporate Finance", "Excel/Modeling", "Strategy"],
    futureScope: "Stable to good; fintech and analytics broaden roles.",
    international: {
      indiaSalary: "₹9 LPA",
      usaSalary: "$100k/year",
      canadaSalary: "CAD $85k/year",
      dubaiSalary: "AED 220k/year",
      globalGrowth: 9,
    },
    trend: Array.from({ length: 16 }, (_, i) => {
      const year = 2015 + i
      const base = 98 + i * 1.4
      return { year, value: Math.min(145, Math.round(base)) }
    }),
  },
  cfa: {
    key: "cfa",
    name: "CFA",
    category: "Finance",
    growthRate: 6,
    avgSalaryIndia: "₹10 LPA",
    annualOpeningsIndia: "~20k",
    skills: ["Equity Research", "Valuation", "Portfolio Mgmt"],
    futureScope: "Niche and valued; roles concentrated in metros and global firms.",
    international: {
      indiaSalary: "₹10 LPA",
      usaSalary: "$110k/year",
      canadaSalary: "CAD $95k/year",
      dubaiSalary: "AED 260k/year",
      globalGrowth: 7,
    },
    trend: Array.from({ length: 16 }, (_, i) => {
      const year = 2015 + i
      const base = 95 + i * 1.3
      return { year, value: Math.min(145, Math.round(base)) }
    }),
  },
  lawyer: {
    key: "lawyer",
    name: "Lawyer",
    category: "Law",
    growthRate: 4,
    avgSalaryIndia: "₹4.5 LPA",
    annualOpeningsIndia: "~40k",
    skills: ["Legal Research", "Drafting", "Litigation", "Advisory"],
    futureScope: "Stable; corporate law, IP, and tech policy offer growth.",
    international: {
      indiaSalary: "₹4.5 LPA",
      usaSalary: "$120k/year",
      canadaSalary: "CAD $110k/year",
      dubaiSalary: "AED 300k/year",
      globalGrowth: 4,
    },
    trend: Array.from({ length: 16 }, (_, i) => {
      const year = 2015 + i
      const base = 100 + i * 0.8
      return { year, value: Math.min(130, Math.round(base)) }
    }),
  },
  commerce_general: {
    key: "commerce_general",
    name: "Commerce (General)",
    category: "Commerce",
    growthRate: 3,
    avgSalaryIndia: "₹3.2 LPA",
    annualOpeningsIndia: "~2 Lakh",
    skills: ["Accounting", "Tally/ERP", "MS Office"],
    futureScope: "Stable entry roles; specialization increases growth.",
    international: {
      indiaSalary: "₹3.2 LPA",
      usaSalary: "$45k/year",
      canadaSalary: "CAD $42k/year",
      dubaiSalary: "AED 90k/year",
      globalGrowth: 3,
    },
    trend: Array.from({ length: 16 }, (_, i) => {
      const year = 2015 + i
      const base = 100 + i * 0.6
      return { year, value: Math.min(125, Math.round(base)) }
    }),
  },
  arts_general: {
    key: "arts_general",
    name: "Arts (General)",
    category: "Arts",
    growthRate: 2,
    avgSalaryIndia: "₹3 LPA",
    annualOpeningsIndia: "~1.5 Lakh",
    skills: ["Communication", "Content", "Research"],
    futureScope: "Varies by specialization; content and policy areas see steady demand.",
    international: {
      indiaSalary: "₹3 LPA",
      usaSalary: "$42k/year",
      canadaSalary: "CAD $40k/year",
      dubaiSalary: "AED 85k/year",
      globalGrowth: 2,
    },
    trend: Array.from({ length: 16 }, (_, i) => {
      const year = 2015 + i
      const base = 98 + i * 0.6
      return { year, value: Math.min(122, Math.round(base)) }
    }),
  },
}

export const CATEGORIES: { label: string; value: CareerCategory; careers: CareerKey[] }[] = [
  {
    label: "Engineering",
    value: "Engineering",
    careers: [
      "civil_engineering",
      "mechanical_engineering",
      "software_development",
      "data_science",
    ],
  },
  {
    label: "Finance",
    value: "Finance",
    careers: ["ca", "mba_finance", "cfa"],
  },
  {
    label: "Design",
    value: "Design",
    careers: ["graphic_design", "ux_ui_design"],
  },
  {
    label: "Healthcare",
    value: "Healthcare",
    careers: ["mbbs", "nursing", "pharmacy"],
  },
  { label: "Law", value: "Law", careers: ["lawyer"] },
  { label: "Commerce", value: "Commerce", careers: ["commerce_general"] },
  { label: "Arts", value: "Arts", careers: ["arts_general"] },
]

export function growthSignal(pct: number): "green" | "yellow" | "red" {
  if (pct >= 10) return "green"
  if (pct <= -2) return "red"
  return "yellow"
}
