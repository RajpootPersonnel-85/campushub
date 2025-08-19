"use client"

import Link from "next/link"
import { UPCOMING_EXAMS } from "@/lib/exams-data"
import { Badge } from "@/components/ui/badge"
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
  const items = UPCOMING_EXAMS.slice().sort((a, b) => +new Date(a.date) - +new Date(b.date)).slice(0, 9)
  return (
    <section suppressHydrationWarning className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold">📅 Upcoming Exams</h2>
          <Link href="/exams" className="text-sm text-primary hover:underline">View all</Link>
        </div>
        <div className="overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex gap-3 min-w-full">
            {items.map((e) => {
              const d = daysLeft(e.date)
              const color = d <= 14 ? "bg-red-500" : d <= 45 ? "bg-amber-500" : "bg-emerald-500"
              return (
                <Link key={`${e.name}-${e.date}`} href={e.link || "/exams"} className="min-w-[260px] border rounded-lg p-3 hover:bg-muted/60 transition">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{e.name}</div>
                      <div className="text-xs text-muted-foreground truncate">{formatIsoDate(e.date)}</div>
                    </div>
                    <Badge className={`${color} text-white`}>{d >= 0 ? `${d}d` : "over"}</Badge>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
