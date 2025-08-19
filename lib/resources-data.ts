export type ResourceTag = "Engineering" | "Commerce" | "Healthcare" | "Competitive Exams" | "School" | "UG" | "PG" | "General"

export interface ResourceItem {
  id: string
  name: string
  description: string
  tags: ResourceTag[]
  link: string
}

export const RESOURCES: ResourceItem[] = [
  {
    id: "nptel",
    name: "NPTEL (IIT Video Lectures)",
    description: "Free video courses by IITs & IISc across Engineering, Science, Humanities, and Management.",
    tags: ["Engineering", "UG", "PG"],
    link: "https://nptel.ac.in/",
  },
  {
    id: "swayam",
    name: "SWAYAM",
    description: "MOOCs by the Government of India—courses by AICTE, UGC, NPTEL, IGNOU and more.",
    tags: ["General", "UG", "PG"],
    link: "https://swayam.gov.in/",
  },
  {
    id: "khan_india",
    name: "Khan Academy India",
    description: "Free lessons and practice exercises for school and foundational subjects.",
    tags: ["School", "General"],
    link: "https://hi.khanacademy.org/",
  },
  {
    id: "coursera_free",
    name: "Coursera Free Programs",
    description: "Explore free courses from top universities. Certificates may be paid.",
    tags: ["General", "UG", "PG"],
    link: "https://www.coursera.org/courses?query=free",
  },
  {
    id: "ndli",
    name: "National Digital Library of India (NDLI)",
    description: "Millions of academic resources—books, articles, thesis, audio, video.",
    tags: ["General", "UG", "PG"],
    link: "https://ndl.iitkgp.ac.in/",
  },
  {
    id: "ncert_ebooks",
    name: "NCERT e-Books",
    description: "Free e-textbooks for school students (Classes 1–12).",
    tags: ["School"],
    link: "https://ncert.nic.in/textbook.php",
  },
]

export const RESOURCE_TAGS: (ResourceTag | "All")[] = [
  "All",
  "Engineering",
  "Commerce",
  "Healthcare",
  "Competitive Exams",
  "School",
  "UG",
  "PG",
  "General",
]
