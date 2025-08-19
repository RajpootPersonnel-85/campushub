"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UPCOMING_EXAMS, CATEGORIES, slugify } from "@/lib/exams-data"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

function daysLeft(dateStr: string) {
  const today = new Date()
  const target = new Date(dateStr)
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  return diff
}

export default function UpcomingExams() {
  const [q, setQ] = useState("")
  const [cat, setCat] = useState<string>("all")
  const { toast } = useToast()

  const data = useMemo(() => {
    const list = UPCOMING_EXAMS.slice().sort((a, b) => +new Date(a.date) - +new Date(b.date))
    return list.filter((e) => {
      const matchQ = q ? e.name.toLowerCase().includes(q.toLowerCase()) : true
      const matchCat = cat === "all" ? true : (e.category || "").toString() === cat
      return matchQ && matchCat
    })
  }, [q, cat])

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Upcoming Exams</span>
          <div className="flex gap-2 items-center w-full max-w-md">
            <Input
              placeholder="Search exam"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <Select value={cat} onValueChange={setCat}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All categories</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.map((e) => {
            const dLeft = daysLeft(e.date)
            const urgent = dLeft <= 14
            const soon = dLeft > 14 && dLeft <= 45
            const badgeClass = urgent ? "bg-red-500" : soon ? "bg-amber-500" : "bg-emerald-500"
            const title = encodeURIComponent(e.name)
            const start = new Date(e.date)
            const end = new Date(start.getTime() + 2 * 60 * 60 * 1000)
            const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z"
            const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${fmt(start)}/${fmt(end)}&details=${encodeURIComponent("Exam date")}`
            const ics = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:${e.name}\nDTSTART:${fmt(start)}\nDTEND:${fmt(end)}\nDESCRIPTION:Exam date\nEND:VEVENT\nEND:VCALENDAR`
            return (
              <div key={`${e.name}-${e.date}`} className="border rounded-lg p-3 hover:bg-muted/50 transition overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <Link href={`/exams/${slugify(e.name)}`} className="font-medium truncate hover:underline">{e.name}</Link>
                    <div className="text-sm text-muted-foreground truncate">
                      {new Date(e.date).toLocaleDateString()} {e.applyBy ? `• Apply by ${new Date(e.applyBy).toLocaleDateString()}` : ""}
                    </div>
                    {e.category ? (
                      <div className="mt-1 text-xs text-muted-foreground truncate">{e.category}</div>
                    ) : null}
                  </div>
                  <Badge className={`${badgeClass} text-white shrink-0`}>{dLeft >= 0 ? `${dLeft}d left` : "over"}</Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="outline" className="bg-transparent w-full md:w-auto">
                    <a href={googleUrl} target="_blank" rel="noopener noreferrer">Add to Google Calendar</a>
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-transparent w-full md:w-auto"
                    onClick={() => {
                      const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement("a")
                      a.href = url
                      a.download = `${e.name.replace(/\s+/g, "_")}.ics`
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                  >
                    Download .ics
                  </Button>
                  <Button
                    size="sm"
                    className="w-full md:w-auto"
                    onClick={() => {
                      const key = "exam-reminders"
                      const current = JSON.parse(localStorage.getItem(key) || "[]") as any[]
                      const exists = current.find((it) => it.name === e.name && it.date === e.date)
                      if (!exists) current.push({ name: e.name, date: e.date })
                      localStorage.setItem(key, JSON.stringify(current))
                      toast({ title: "Reminder set", description: `${e.name} added to your reminders.` })
                    }}
                  >
                    Remind me
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
