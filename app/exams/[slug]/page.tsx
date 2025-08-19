import React from "react"
import { notFound } from "next/navigation"
import { EXAM_DETAILS } from "@/lib/exams-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

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
    </div>
  )
}
