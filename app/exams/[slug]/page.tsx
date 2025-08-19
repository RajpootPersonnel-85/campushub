import React from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { EXAM_DETAILS } from "@/lib/exams-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import dynamic from "next/dynamic"
const AdsCarousel = dynamic(() => import("@/components/ads/AdsCarousel"), {
  ssr: false,
  loading: () => <div className="w-full max-w-6xl h-[180px] sm:h-[240px] md:h-[300px] rounded-2xl border border-border animate-pulse bg-muted" />,
})
const CornerAd = dynamic(() => import("@/components/ads/CornerAd"), { ssr: false })

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const detail = EXAM_DETAILS[params.slug]
  if (!detail) return { title: "Exam Not Found | CampusHub" }
  const title = `${detail.name} Exam Details | CampusHub`
  const description = `Eligibility, fees, syllabus, dates and vacancies for ${detail.name}. Prepare with resources and tips on CampusHub.`
  const url = `https://campushub.example.com/exams/${params.slug}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "CampusHub",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default function ExamDetailPage(props: { params: { slug: string } }) {
  const { slug } = props.params
  const detail = EXAM_DETAILS[slug]
  if (!detail) return notFound()

  const isoDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s)
  const fmt = (s: string) => (isoDate(s) ? new Date(s).toLocaleDateString() : s)
  const headerYear = (() => {
    const d = detail.importantDates?.find((x) => isoDate(x.date))?.date
    return d ? new Date(d).getFullYear() : new Date().getFullYear()
  })()

  return (
    <div className="min-h-screen bg-background">
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">{detail.name}</h1>
            <div className="mt-2 flex gap-2 flex-wrap text-sm text-muted-foreground">
              {detail.mode && <Badge variant="secondary">{detail.mode}</Badge>}
              {detail.timing && <Badge variant="secondary">{detail.timing}</Badge>}
            </div>
            {/* JSON-LD structured data for SEO */}
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "WebPage",
                  name: `${detail.name} Exam Details`,
                  description: `Eligibility, fees, syllabus, dates and vacancies for ${detail.name}.`,
                  url: `https://campushub.example.com/exams/${slug}`,
                  breadcrumb: {
                    "@type": "BreadcrumbList",
                    itemListElement: [
                      { "@type": "ListItem", position: 1, name: "Home", item: "https://campushub.example.com/" },
                      { "@type": "ListItem", position: 2, name: "Exams", item: "https://campushub.example.com/exams" },
                      { "@type": "ListItem", position: 3, name: detail.name, item: `https://campushub.example.com/exams/${slug}` },
                    ],
                  },
                }),
              }}
            />
          </div>

          {/* Ads Carousel */}
          <div className="py-2">
            <AdsCarousel
              slides={[
                { id: "exam_lb_1", format: "leaderboard", text: "Prepare smarter with free mock tests!", href: "/resources" },
                { id: "exam_rect_1", format: "rectangle", text: "Scholarships open – apply now", href: "/schemes" },
              ]}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Eligibility & Fees</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Qualification</div>
                <div className="font-medium">{detail.qualification}</div>
              </div>
              {detail.ageLimit && (
                <div>
                  <div className="text-sm text-muted-foreground">Age Limit</div>
                  <div className="font-medium">{detail.ageLimit}</div>
                </div>
              )}
              {detail.fee && (
                <div>
                  <div className="text-sm text-muted-foreground">Application Fee</div>
                  <div className="font-medium">{detail.fee}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {detail.syllabus && detail.syllabus.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Syllabus</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-1">
                  {detail.syllabus.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {detail.importantDates && detail.importantDates.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>{detail.name} Exam Dates {headerYear}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/2">Events</TableHead>
                        <TableHead className="w-1/2">Dates</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detail.importantDates.map((d) => (
                        <TableRow key={d.label}>
                          <TableCell className="font-medium">{d.label}</TableCell>
                          <TableCell>{fmt(d.date)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}

          {detail.vacancies && detail.vacancies.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Vacancies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/3">Post Name</TableHead>
                        <TableHead className="w-2/3">No. of Posts</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {detail.vacancies.map((v) => (
                        <TableRow key={v.postName}>
                          <TableCell className="font-medium">{v.postName}</TableCell>
                          <TableCell className="whitespace-pre-wrap">{v.posts}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* Corner overlay ad for exams pages */}
      <CornerAd
        href="/resources"
        media={{ type: "video", src: "https://www.w3schools.com/html/mov_bbb.mp4", poster: "/algorithms-textbook.png", muted: true, loop: true }}
        responsive
        showAfterMs={1800}
        storageKey="corner_ad_exams"
      />
    </div>
  )
}
