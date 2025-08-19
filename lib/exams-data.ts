export const CATEGORIES = [
  "SSC Exams",
  "Banking Exams",
  "Teaching Exams",
  "Civil Services Exam",
  "Railways Exams",
  "Engineering Recruitment Exams",
  "Defence Exams",
  "Police Exams",
  // Additional categories
  "Insurance Exams",
  "Nursing Exams",
  "Other Govt. Exams",
  "NRA CET",
  "PG Entrance Exams",
  "Campus Placement",
  "Marketing",
  "MBA Entrance Exam",
  "CUET and UG Entrance",
  "Professional Skills",
  "Software Development",
  "Data Science & Analytics",
  "Accounting and Commerce",
  "Management",
  "Judiciary Exams",
  "Regulatory Body Exams",
  "DIBO",
] as const

export const EXAMS: Record<string, { name: string }[]> = {
  "SSC Exams": [
    { name: "SSC CGL" },
    { name: "SSC CHSL" },
    { name: "SSC MTS" },
    { name: "SSC GD Constable" },
    { name: "SSC CPO" },
    { name: "SSC Stenographer" },
    { name: "SSC Selection Post" },
    { name: "Delhi Police Constable" },
  ],
  "Banking Exams": [
    { name: "IBPS PO" },
    { name: "IBPS Clerk" },
    { name: "SBI PO" },
    { name: "SBI Clerk" },
  ],
  "Teaching Exams": [
    { name: "CTET" },
    { name: "KVS" },
    { name: "DSSSB" },
  ],
  "Civil Services Exam": [
    { name: "UPSC CSE" },
    { name: "State PSC" },
  ],
  "Railways Exams": [
    { name: "RRB ALP" },
    { name: "RRB JE" },
    { name: "RRB Technician" },
  ],
  "Engineering Recruitment Exams": [
    { name: "RRB JE EE" },
    { name: "RRB JE EC" },
    { name: "SSC JE" },
    { name: "GATE" },
  ],
  "Defence Exams": [
    { name: "NDA" },
    { name: "CDS" },
    { name: "AFCAT" },
  ],
  "Police Exams": [
    { name: "BSF SI" },
    { name: "Delhi Police Head Constable" },
    { name: "IB ACIO" },
  ],
  // Additional categories (with example items)
  "Insurance Exams": [
    { name: "LIC AAO" },
    { name: "NIACL AO" },
  ],
  "Nursing Exams": [
    { name: "AIIMS Nursing" },
    { name: "RUHS Nursing" },
  ],
  "Other Govt. Exams": [
    { name: "State Govt. Clerk" },
    { name: "Municipal Recruitment" },
  ],
  "NRA CET": [
    { name: "CET Graduate" },
    { name: "CET 12th" },
    { name: "CET 10th" },
  ],
  "PG Entrance Exams": [
    { name: "CUET PG" },
    { name: "IIT JAM" },
    { name: "CEETA PG" },
  ],
  "Campus Placement": [
    { name: "Aptitude Prep" },
    { name: "Reasoning Prep" },
  ],
  "Marketing": [
    { name: "Digital Marketing" },
    { name: "Brand Management" },
  ],
  "MBA Entrance Exam": [
    { name: "CAT" },
    { name: "XAT" },
    { name: "MAT" },
  ],
  "CUET and UG Entrance": [
    { name: "CUET UG" },
    { name: "IPU CET" },
  ],
  "Professional Skills": [
    { name: "Communication Skills" },
    { name: "MS Office" },
  ],
  "Software Development": [
    { name: "DSA" },
    { name: "System Design" },
  ],
  "Data Science & Analytics": [
    { name: "Data Analysis" },
    { name: "Machine Learning" },
  ],
  "Accounting and Commerce": [
    { name: "CA Foundation" },
    { name: "CMA Foundation" },
  ],
  "Management": [
    { name: "Project Management" },
    { name: "Operations" },
  ],
  "Judiciary Exams": [
    { name: "Judicial Services" },
    { name: "District Judge" },
  ],
  "Regulatory Body Exams": [
    { name: "SEBI Grade A" },
    { name: "RBI Grade B" },
  ],
  "DIBO": [
    { name: "DIBO Mock Test" },
  ],
}

export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")

export type UpcomingExam = {
  name: string
  date: string // ISO date
  applyBy?: string // ISO date
  category?: (typeof CATEGORIES)[number] | string
  link?: string
}

export const UPCOMING_EXAMS: UpcomingExam[] = [
  { name: "CUET PG", date: "2025-09-15", applyBy: "2025-08-31", category: "PG Entrance Exams", link: "/exams?exam=CUET%20PG" },
  { name: "IIT JAM", date: "2025-02-09", applyBy: "2024-10-20", category: "PG Entrance Exams", link: "/exams?exam=IIT%20JAM" },
  { name: "CAT", date: "2025-11-30", applyBy: "2025-09-25", category: "MBA Entrance Exam", link: "/exams?exam=CAT" },
  { name: "SSC CGL Tier-I", date: "2025-07-20", applyBy: "2025-05-10", category: "SSC Exams", link: "/exams?exam=SSC%20CGL" },
  { name: "RRB ALP", date: "2025-06-10", applyBy: "2025-04-15", category: "Railways Exams", link: "/exams?exam=RRB%20ALP" },
]

export type ExamDetail = {
  slug: string
  name: string
  qualification: string
  ageLimit?: string
  fee?: string
  mode?: string
  timing?: string
  syllabus?: string[]
  importantDates?: { label: string; date: string }[]
  // If the exam targets 12th pass candidates with specific streams
  eligibleStreams?: ("Non-Medical" | "Medical" | "Commerce" | "Arts")[]
  // If the exam targets graduates with specific disciplines/degree backgrounds
  eligibleDisciplines?: string[]
}

export const EXAM_DETAILS: Record<string, ExamDetail> = (() => {
  const make = (name: string, detail: Omit<ExamDetail, "slug" | "name">): ExamDetail => ({
    slug: slugify(name),
    name,
    ...detail,
  })
  const list: ExamDetail[] = [
    make("SSC CGL", {
      qualification: "Bachelor's Degree",
      eligibleDisciplines: ["Any discipline"],
      ageLimit: "18–32 years (varies by post)",
      fee: "₹100 (Gen/OBC); Women/SC/ST/PwD: Nil",
      mode: "Online (Tier I & II)",
      timing: "Multiple shifts",
      syllabus: ["General Intelligence & Reasoning", "General Awareness", "Quantitative Aptitude", "English Comprehension"],
      importantDates: [
        { label: "Notification", date: "2025-05-01" },
        { label: "Tier-I Exam", date: "2025-07-20" },
      ],
    }),
    make("CUET PG", {
      qualification: "Graduation in relevant discipline",
      eligibleDisciplines: ["CS/IT", "Science", "Commerce", "Arts", "Engineering"],
      ageLimit: "No upper age limit",
      fee: "As per category/subjects",
      mode: "Online",
      timing: "Slot based",
      syllabus: ["Language Comprehension", "Domain-specific", "General Awareness"],
      importantDates: [
        { label: "Application Last Date", date: "2025-08-31" },
        { label: "Exam Date", date: "2025-09-15" },
      ],
    }),
    make("IIT JAM", {
      qualification: "BSc/BTech (as per paper)",
      eligibleDisciplines: ["Physics", "Chemistry", "Mathematics", "Biotechnology", "Geology", "Economics"],
      ageLimit: "No upper age limit",
      fee: "Varies by category",
      mode: "Online",
      timing: "3 hours",
      syllabus: ["Mathematics", "Physics", "Chemistry", "Biotechnology (as chosen)"],
    }),
    make("CAT", {
      qualification: "Bachelor's Degree with 50% (45% SC/ST/PwD)",
      eligibleDisciplines: ["Any discipline"],
      ageLimit: "No upper age limit",
      fee: "~₹2400 (varies)",
      mode: "Online",
      timing: "2 hours (3 sections)",
      syllabus: ["VARC", "DILR", "QA"],
    }),
    make("RRB ALP", {
      qualification: "Matriculation + ITI/Act Apprenticeship or Diploma",
      eligibleStreams: ["Non-Medical", "Arts", "Commerce"],
      eligibleDisciplines: ["Mechanical", "Electrical", "Automobile", "Production", "Electronics"],
      ageLimit: "18–30 years",
      fee: "₹500 (Gen/OBC); ₹250 (Others, refundable conditions)",
      mode: "Online",
      timing: "CBT stages",
      syllabus: ["Mathematics", "General Intelligence & Reasoning", "General Science", "General Awareness"],
    }),
  ]
  return Object.fromEntries(list.map((d) => [d.slug, d]))
})()
