"use client"

import Link from "next/link"
import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Building, Eye, Download, Award, ChevronRight } from "lucide-react"

export default function NotesSection() {
  const rowRef = useRef<HTMLDivElement | null>(null)
  const scrollByViewport = (dir: -1 | 1) => {
    const el = rowRef.current
    if (!el) return
    const delta = el.clientWidth * 0.9 * dir
    el.scrollBy({ left: delta, behavior: "smooth" })
  }
  return (
    <section id="notes" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">📚 Recently Uploaded Notes by Students</h2>
            <p className="text-muted-foreground">Fresh notes from your fellow students</p>
          </div>
          <Link href="/notes">
            <Button variant="outline">
              See All Notes
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                <SelectItem value="computer-science">Computer Science</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="physics">Physics</SelectItem>
                <SelectItem value="chemistry">Chemistry</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="College" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Colleges</SelectItem>
                <SelectItem value="iit">IIT</SelectItem>
                <SelectItem value="nit">NIT</SelectItem>
                <SelectItem value="iiit">IIIT</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Semester" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Semesters</SelectItem>
                <SelectItem value="1">Semester 1</SelectItem>
                <SelectItem value="2">Semester 2</SelectItem>
                <SelectItem value="3">Semester 3</SelectItem>
                <SelectItem value="4">Semester 4</SelectItem>
                <SelectItem value="5">Semester 5</SelectItem>
                <SelectItem value="6">Semester 6</SelectItem>
              </SelectContent>
            </Select>

            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Formats</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
                <SelectItem value="doc">DOC</SelectItem>
                <SelectItem value="ppt">PPT</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="text-primary bg-transparent">
              <Award className="w-4 h-4 mr-2" />
              More Filters
            </Button>
          </div>
        </div>

        <div className="relative">
          {/* Arrows */}
          <button
            type="button"
            aria-label="Previous notes"
            className="hidden sm:flex items-center justify-center absolute -left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full border border-border bg-background/90 shadow hover:bg-accent"
            onClick={() => scrollByViewport(-1)}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next notes"
            className="hidden sm:flex items-center justify-center absolute -right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full border border-border bg-background/90 shadow hover:bg-accent"
            onClick={() => scrollByViewport(1)}
          >
            ›
          </button>

          <div
            ref={rowRef}
            className="mb-8 flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none]"
            style={{ scrollPaddingInline: 16 }}
            onWheel={(e) => {
              // Horizontal wheel for trackpads
              if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return
              const el = rowRef.current
              if (!el) return
              el.scrollLeft += e.deltaY
              e.preventDefault()
            }}
          >
            {[
            { subject: "Computer Science", semester: "Semester 1", title: "Data Structures & Algorithms", author: "Ankit S.", authorBadge: "Top Contributor", uploaded: "2 days ago", verified: true, views: 145, downloads: 45, rating: 4.8, college: "Prof. Gupta" },
            { subject: "Computer Science", semester: "Semester 2", title: "Data Structures & Algorithms", author: "Ankit S.", authorBadge: null, uploaded: "2 days ago", verified: true, views: 170, downloads: 55, rating: 4.9, college: "Prof. Gupta" },
            { subject: "Computer Science", semester: "Semester 3", title: "Data Structures & Algorithms", author: "Ankit S.", authorBadge: null, uploaded: "2 days ago", verified: false, views: 195, downloads: 65, rating: 4.7, college: "Prof. Gupta" },
            { subject: "Computer Science", semester: "Semester 4", title: "Data Structures & Algorithms", author: "Ankit S.", authorBadge: null, uploaded: "2 days ago", verified: true, views: 220, downloads: 75, rating: 4.8, college: "Prof. Gupta" },
            { subject: "Computer Science", semester: "Semester 5", title: "Data Structures & Algorithms", author: "Ankit S.", authorBadge: null, uploaded: "2 days ago", verified: true, views: 245, downloads: 85, rating: 4.9, college: "Prof. Gupta" },
          ].map((note, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200 snap-start shrink-0 min-w-[280px] sm:min-w-[320px] md:min-w-[360px]"
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">{note.subject}</Badge>
                  {note.verified && <Calendar className="w-4 h-4 text-green-600" />}
                </div>
                <Badge variant="outline" className="w-fit text-xs">{note.semester}</Badge>
              </CardHeader>

              <CardContent className="space-y-3">
                <div>
                  <h3 className="font-semibold text-sm mb-1">{note.title}</h3>
                  <div className="flex items-center text-xs text-muted-foreground mb-1">
                    <Calendar className="w-3 h-3 mr-1" />
                    Uploaded {note.uploaded}
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground mb-2">
                    <Building className="w-3 h-3 mr-1" />
                    Verified by {note.college}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{note.views} views</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="w-3 h-3" />
                      <span>{note.downloads} downloads</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-purple-800">{note.author.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-xs font-medium">{note.author}</p>
                      {note.authorBadge && (
                        <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">{note.authorBadge}</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <Button size="sm" variant="outline" className="text-xs bg-transparent">View Notes</Button>
                  <Button size="sm" className="text-xs">
                    <Download className="w-3 h-3 mr-1" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          </div>
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-primary" />
              <span>Top Contributors This Week</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {["Priya S.", "Rahul K.", "Anita S.", "Vikash M.", "Sneha P."].map((name, index) => (
                <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                  #{index + 1} {name}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
