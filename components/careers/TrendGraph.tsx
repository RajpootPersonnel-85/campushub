"use client"

import { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { CAREER_CATALOG, CareerKey } from "@/lib/careers-data"

type Props = {
  compared: CareerKey[]
  visible: Record<CareerKey, boolean>
  loading: boolean
  onToggleVisible: (k: CareerKey) => void
}

export default function TrendGraph({ compared, visible, loading, onToggleVisible }: Props) {
  const { years, lines, minV, maxV } = useMemo(() => {
    const yearsLocal = CAREER_CATALOG["software_development"].trend.map((p) => p.year)
    const active = compared.filter((k) => visible[k])
    const base = active.length > 0 ? active : compared
    const allValues = base.flatMap((k) => CAREER_CATALOG[k].trend.map((p) => p.value))
    const minV = Math.min(...allValues)
    const maxV = Math.max(...allValues)
    const linesLocal = base.map((k, idx) => {
      const info = CAREER_CATALOG[k]
      const color = ["#2563eb", "#16a34a", "#dc2626"][idx % 3]
      const points = info.trend
        .map((p, i) => {
          const x = (i / (yearsLocal.length - 1)) * 100
          const y = 100 - ((p.value - minV) / Math.max(1, maxV - minV)) * 100
          return `${x},${y}`
        })
        .join(" ")
      return { key: k, color, points }
    })
    return { years: yearsLocal, lines: linesLocal, minV, maxV }
  }, [compared, visible])

  return (
    <div>
      {!loading && (
        <div className="mb-3 flex flex-wrap gap-2 print:hidden">
          {compared.map((k) => (
            <Button
              key={k}
              size="sm"
              variant={visible[k] ? "secondary" : "outline"}
              className={visible[k] ? "" : "opacity-70"}
              onClick={() => onToggleVisible(k)}
            >
              {CAREER_CATALOG[k].name}
            </Button>
          ))}
        </div>
      )}
      <div className="w-full overflow-x-auto">
        <div className="min-w-[600px]">
          {loading ? (
            <div className="w-full h-64 bg-muted/30 rounded border border-border animate-pulse" />
          ) : (
            <svg viewBox="0 0 100 100" className="w-full h-64 bg-muted/30 rounded border border-border">
              {/* Axes */}
              <line x1="0" y1="100" x2="100" y2="100" stroke="#999" strokeWidth="0.5" />
              <line x1="0" y1="0" x2="0" y2="100" stroke="#999" strokeWidth="0.5" />
              {/* Year ticks */}
              {years.map((yr, i) => (
                <g key={yr}>
                  <line x1={(i / (years.length - 1)) * 100} y1={100} x2={(i / (years.length - 1)) * 100} y2={99} stroke="#999" strokeWidth="0.3" />
                  {i % 3 === 0 && (
                    <text x={(i / (years.length - 1)) * 100} y={98} fontSize="2" textAnchor="middle" fill="#666">
                      {yr}
                    </text>
                  )}
                </g>
              ))}
              {/* Value ticks */}
              {[0, 25, 50, 75, 100].map((p) => (
                <g key={p}>
                  <line x1={0} y1={p} x2={1} y2={p} stroke="#999" strokeWidth="0.3" />
                  <text x={2} y={p + 2} fontSize="2" fill="#666">
                    {Math.round(((100 - p) / 100) * (maxV - minV) + minV)}
                  </text>
                </g>
              ))}
              {/* Lines */}
              {lines.map((l) => (
                <polyline key={l.key} points={l.points} fill="none" stroke={l.color} strokeWidth="0.8" />
              ))}
              {/* Legends */}
              {lines.map((l, i) => (
                <g key={l.key}>
                  <rect x={2 + i * 30} y={2} width={2.5} height={2.5} fill={l.color} />
                  <text x={5 + i * 30} y={4} fontSize="2" fill="#333">
                    {CAREER_CATALOG[l.key].name}
                  </text>
                </g>
              ))}
            </svg>
          )}
        </div>
      </div>
      <div className="text-xs text-muted-foreground mt-2">Y values are normalized to show trend shape per selection.</div>
    </div>
  )
}
