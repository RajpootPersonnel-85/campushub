"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { GraduationCap, ChevronRight } from "lucide-react"
import { CATEGORIES, EXAMS, UPCOMING_EXAMS, slugify } from "@/lib/exams-data"

export default function ExamsMegaMenu() {
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>(CATEGORIES[0])
  const items = useMemo(() => EXAMS[active] || [], [active])
  const dueSoon = useMemo(() => {
    const today = new Date()
    return UPCOMING_EXAMS
      .map((e) => ({
        ...e,
        days: Math.ceil((new Date(e.date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)),
      }))
      .filter((e) => e.days >= 0 && e.days <= 30)
      .sort((a, b) => a.days - b.days)
      .slice(0, 6)
  }, [])

  return (
    <div className="relative group">
      {/* Trigger */}
      <button
        className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors"
        aria-haspopup="true"
        aria-expanded="false"
      >
        <GraduationCap className="w-4 h-4" />
        <span>Exams</span>
      </button>

      {/* Panel */}
      <div
        className="invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-[opacity,visibility] duration-150"
      >
        <div
          className="absolute left-0 top-full mt-3 w-[min(1100px,calc(100vw-2rem))] bg-popover text-popover-foreground border rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="grid grid-cols-[280px_1fr] divide-x">
            {/* Left categories */}
            <div className="max-h-[70vh] overflow-y-auto p-2 bg-gradient-to-b from-muted/40 to-background">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onMouseEnter={() => setActive(cat)}
                  className={`w-full flex items-center justify-between text-left px-3 py-2 rounded-lg hover:bg-muted ${active === cat ? "bg-muted" : ""}`}
                >
                  <span className="truncate">{cat}</span>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </button>
              ))}
            </div>

            {/* Right grid */}
            <div className="p-3 max-h-[70vh] overflow-y-auto">
              {dueSoon.length > 0 && (
                <div className="mb-3">
                  <div className="text-xs font-medium text-muted-foreground mb-2">Due soon</div>
                  <div className="flex flex-wrap gap-2">
                    {dueSoon.map((e) => (
                      <Link
                        key={`${e.name}-${e.date}`}
                        href={`/exams/${slugify(e.name)}`}
                        className="text-xs px-2 py-1 rounded-full border hover:bg-muted"
                        title={`${e.name} • ${new Date(e.date).toLocaleDateString()}`}
                      >
                        {e.name} · {e.days}d
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((exam) => (
                  <Link
                    key={exam.name}
                    href={`/exams/${slugify(exam.name)}`}
                    className="flex items-center justify-between px-3 py-2 border rounded-lg hover:bg-muted hover:shadow-sm transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                        <GraduationCap className="w-4 h-4 text-muted-foreground" />
                      </div>
                      <span className="truncate">{exam.name}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </Link>
                ))}
              </div>
              <div className="mt-3 text-right">
                <Link href="/exams" className="text-sm text-primary hover:underline">
                  Explore all exams
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
