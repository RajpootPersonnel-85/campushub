import type { Metadata } from "next"

export const metadata: Metadata = {
  metadataBase: new URL("https://campushub.example.com"),
  title: {
    default: "CampusHub — Exams, Schemes, Resources, Deals",
    template: "%s | CampusHub",
  },
  description:
    "CampusHub helps students with exam details, scholarships, hostel listings, learning resources, tiffin, jobs, and more.",
  alternates: { canonical: "/" },
  openGraph: {
    title: "CampusHub — Exams, Schemes, Resources, Deals",
    description:
      "CampusHub helps students with exam details, scholarships, hostel listings, learning resources, tiffin, jobs, and more.",
    url: "/",
    siteName: "CampusHub",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CampusHub — Exams, Schemes, Resources, Deals",
    description:
      "CampusHub helps students with exam details, scholarships, hostel listings, learning resources, tiffin, jobs, and more.",
  },
}
