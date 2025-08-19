"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, GraduationCap } from "lucide-react"
import Link from "next/link"
import { CATEGORIES, EXAMS, EXAM_DETAILS, slugify } from "@/lib/exams-data"
import UpcomingExams from "@/components/exams/UpcomingExams"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ExamsPage() {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("SSC Exams")
  const items = useMemo(() => EXAMS[active] || [], [active])
  const [age, setAge] = useState<string>("")
  const [qual, setQual] = useState<string>("all")
  const [stream, setStream] = useState<string>("all")
  const [discipline, setDiscipline] = useState<string>("all")

  // Reset dependent filters when qualification changes
  useEffect(() => {
    setStream("all")
    setDiscipline("all")
  }, [qual])

  function normalizeQualification(name: string) {
    const d = EXAM_DETAILS[slugify(name)]
    const q = (d?.qualification || "").toLowerCase()
    if (/(10th|matric)/.test(q)) return "10th"
    if (/(12th|higher secondary|intermediate)/.test(q)) return "12th"
    if (/(bachelor|graduation|graduate)/.test(q)) return "graduate"
    if (/(postgraduate|master|pg)/.test(q)) return "postgraduate"
    return "other"
  }

  const filtered = useMemo(() => {
    return items.filter((exam) => {
      // qualification filter
      const nq = normalizeQualification(exam.name)
      const qualOk = qual === "all" ? true : qual === nq
      // age filter (basic textual check against upper range if present)
      let ageOk = true
      if (age) {
        const d = EXAM_DETAILS[slugify(exam.name)]
        const text = (d?.ageLimit || "").toLowerCase()
        const numMatches = text.match(/\d{2}/g) || []
        const max = Math.max(...numMatches.map((n) => parseInt(n, 10)), -1)
        if (!Number.isNaN(parseInt(age, 10)) && max >= 0) {
          ageOk = parseInt(age, 10) <= max
        }
      }
      // stream filter for 12th
      let streamOk = true
      if (qual === "12th" && stream !== "all") {
        const d = EXAM_DETAILS[slugify(exam.name)]
        if (d?.eligibleStreams && d.eligibleStreams.length > 0) {
          streamOk = d.eligibleStreams.includes(stream as any)
        }
      }
      // discipline filter for graduate/postgraduate
      let disciplineOk = true
      if ((qual === "graduate" || qual === "postgraduate") && discipline !== "all") {
        const d = EXAM_DETAILS[slugify(exam.name)]
        if (d?.eligibleDisciplines && d.eligibleDisciplines.length > 0) {
          disciplineOk = d.eligibleDisciplines.some((disc) => disc.toLowerCase() === discipline.toLowerCase())
        }
      }
      return qualOk && ageOk && streamOk && disciplineOk
    })
  }, [items, qual, age, stream, discipline])

  return (
    <div className="min-h-screen bg-background">
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Popular Exams</h1>
            <p className="text-muted-foreground">Get exam-ready with concepts, questions and study notes as per the latest pattern</p>
          </div>

          {/* Upcoming exams */}
          <UpcomingExams />

          {/* Eligibility Filters */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Input
              placeholder="Your age"
              value={age}
              onChange={(e) => setAge(e.target.value.replace(/[^0-9]/g, ""))}
              className="w-28"
              inputMode="numeric"
            />
            <Select value={qual} onValueChange={setQual}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Qualification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All qualifications</SelectItem>
                <SelectItem value="10th">10th Pass</SelectItem>
                <SelectItem value="12th">12th Pass</SelectItem>
                <SelectItem value="graduate">Graduate</SelectItem>
                <SelectItem value="postgraduate">Postgraduate</SelectItem>
              </SelectContent>
            </Select>
            {qual === "12th" && (
              <Select value={stream} onValueChange={setStream}>
                <SelectTrigger className="w-56">
                  <SelectValue placeholder="12th Stream" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Streams</SelectItem>
                  <SelectItem value="Non-Medical">Non-Medical</SelectItem>
                  <SelectItem value="Medical">Medical</SelectItem>
                  <SelectItem value="Commerce">Commerce</SelectItem>
                  <SelectItem value="Arts">Arts</SelectItem>
                </SelectContent>
              </Select>
            )}
            {(qual === "graduate" || qual === "postgraduate") && (
              <Select value={discipline} onValueChange={setDiscipline}>
                <SelectTrigger className="w-56">
                  <SelectValue placeholder={qual === "graduate" ? "Graduate Discipline" : "Postgraduate Discipline"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Disciplines</SelectItem>
                  <SelectItem value="Any discipline">Any discipline</SelectItem>
                  <SelectItem value="Engineering">Engineering</SelectItem>
                  <SelectItem value="CS/IT">CS/IT</SelectItem>
                  <SelectItem value="Science">Science</SelectItem>
                  <SelectItem value="Commerce">Commerce</SelectItem>
                  <SelectItem value="Arts">Arts</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Chemistry">Chemistry</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                  <SelectItem value="Biotechnology">Biotechnology</SelectItem>
                  <SelectItem value="Geology">Geology</SelectItem>
                  <SelectItem value="Economics">Economics</SelectItem>
                  <SelectItem value="Mechanical">Mechanical</SelectItem>
                  <SelectItem value="Electrical">Electrical</SelectItem>
                  <SelectItem value="Automobile">Automobile</SelectItem>
                  <SelectItem value="Production">Production</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Category tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-3 py-1.5 rounded-full border text-sm whitespace-nowrap ${active === cat ? "bg-primary/10 border-primary text-primary" : "hover:bg-muted"}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Exam grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((exam) => (
              <Card key={exam.name} className="hover:shadow-sm">
                <CardHeader className="py-3">
                  <CardTitle className="text-base flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <Link href={`/exams/${slugify(exam.name)}`} className="hover:underline">{exam.name}</Link>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}

            {/* Explore all */}
            <Card className="hover:shadow-sm">
              <CardHeader className="py-3">
                <CardTitle className="text-base flex items-center justify-between">
                  <span className="text-primary">Explore all exams</span>
                  <ChevronRight className="w-4 h-4 text-primary" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link href="#" className="text-sm text-muted-foreground hover:underline">Browse full list by category</Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
