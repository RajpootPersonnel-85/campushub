"use client"

import Link from "next/link"
import { UPCOMING_EXAMS } from "@/lib/exams-data"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, ChevronRight, Clock3, Tag } from "lucide-react"
// no client-only gating; keep render identical on server and client

function daysLeft(dateStr: string) {
  // Compare in UTC at midnight to avoid timezone and time-of-day differences
  const toUtcMidnight = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  const today = new Date()
  const target = new Date(`${dateStr}T00:00:00Z`)
  const diffMs = toUtcMidnight(target) - toUtcMidnight(today)
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24))
}

// Deterministic date formatting without Intl (avoid environment differences)
const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"] as const
function formatIsoDate(dateStr: string) {
  // dateStr expected: YYYY-MM-DD
  const [y, m, d] = dateStr.split("-")
  const day = d?.padStart(2, "0") ?? "01"
  const monthName = MONTHS[(Number(m) || 1) - 1]
  return `${day} ${monthName} ${y}`
}

export default function UpcomingExamsHome() {
  const items = UPCOMING_EXAMS
    .filter((e) => daysLeft(e.date) >= 0)
    .sort((a, b) => +new Date(a.date) - +new Date(b.date))
    .slice(0, 9)
  return (
    <section suppressHydrationWarning className="py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs tracking-wider text-muted-foreground uppercase">Exams</div>
            <h2 className="text-2xl font-bold flex items-center gap-2"><CalendarDays className="h-5 w-5 text-primary" /> Upcoming Exams</h2>
          </div>
          <Button asChild size="sm" variant="ghost" className="gap-1">
            <Link href="/exams">View all <ChevronRight className="h-4 w-4" /></Link>
          </Button>
        </div>
        <div className="overflow-x-auto md:overflow-visible [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 min-w-full">
            {items.map((e) => {
              const d = daysLeft(e.date)
              const isOver = d < 0
              const badgeColor = isOver ? "bg-zinc-500" : d <= 14 ? "bg-red-600" : d <= 45 ? "bg-amber-500" : "bg-emerald-600"
              const dateClass = isOver ? "line-through text-muted-foreground/70" : "text-muted-foreground"
              const statusLabel = isOver ? "Over" : d === 0 ? "Today" : `${d} days left`
              return (
                <Card
                  key={`${e.name}-${e.date}`}
                  className="group relative min-w-[260px] md:min-w-0 overflow-hidden rounded-xl border bg-card/80 backdrop-blur-sm shadow-sm transition hover:shadow-md hover:border-primary/30 focus-within:ring-2 focus-within:ring-primary/30"
                >
                  <Link href={e.link || "/exams"} className="block">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-medium truncate group-hover:text-primary transition-colors">{e.name}</div>
                          <div className="mt-1 inline-flex items-center gap-1 rounded-md bg-muted/60 px-2 py-0.5 text-[11px] text-muted-foreground">
                            <CalendarDays className="size-3" />
                            <span className={dateClass}>{formatIsoDate(e.date)}</span>
                          </div>
                        </div>
                        <Badge className={`${badgeColor} text-white shrink-0 rounded-full px-2.5 py-1 text-[11px] leading-none flex items-center gap-1`}>
                          <Clock3 className="size-3.5 opacity-90" />
                          {statusLabel}
                        </Badge>
                      </div>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          {e.category ? (
                            <span className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] text-muted-foreground bg-muted/40">
                              <Tag className="size-3 opacity-70" />
                              <span className="truncate">{e.category}</span>
                            </span>
                          ) : <span />}
                          {e.applyBy ? (
                            <span className="text-[11px] text-muted-foreground truncate">Apply by {formatIsoDate(e.applyBy)}</span>
                          ) : null}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <span className="mr-1">Details</span>
                          <ChevronRight className="size-3.5 opacity-70 group-hover:opacity-100 transition" />
                        </div>
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
