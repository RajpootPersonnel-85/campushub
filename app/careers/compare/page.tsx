"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CAREER_CATALOG, CATEGORIES, CareerKey, growthSignal } from "@/lib/careers-data"
import { TrendingUp, TrendingDown, Minus, Search } from "lucide-react"

export default function CareersComparePage() {
  const [category, setCategory] = useState<string>("Engineering")
  const [careerKey, setCareerKey] = useState<string>("")
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<CareerKey[]>(["software_development", "data_science"]) // defaults
  const [compared, setCompared] = useState<CareerKey[]>(selected)

  const careersInCategory = useMemo(() => {
    const cat = CATEGORIES.find((c) => c.value === category)
    if (!cat) return []
    let keys = cat.careers
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      keys = keys.filter((k) => CAREER_CATALOG[k].name.toLowerCase().includes(q))
    }
    return keys
  }, [category, query])

  const canAdd = useMemo(() => {
    return careerKey && selected.length < 3 && !selected.includes(careerKey as CareerKey)
  }, [careerKey, selected])

  const insight = useMemo(() => {
    if (compared.length < 2) return "Pick 2–3 careers to see insights."
    const sorted = [...compared].sort((a, b) => CAREER_CATALOG[b].growthRate - CAREER_CATALOG[a].growthRate)
    const best = CAREER_CATALOG[sorted[0]]
    const worst = CAREER_CATALOG[sorted[sorted.length - 1]]
    const dir = worst.growthRate < 0 ? "falling" : worst.growthRate === 0 ? "stable" : "slower"
    return `${worst.name} demand is ${dir}. Students may consider ${best.name} for better opportunities.`
  }, [compared])

  const years = CAREER_CATALOG["software_development"].trend.map((p) => p.year)
  const allValues = compared.flatMap((k) => CAREER_CATALOG[k].trend.map((p) => p.value))
  const minV = Math.min(...allValues)
  const maxV = Math.max(...allValues)

  const lines = compared.map((k, idx) => {
    const info = CAREER_CATALOG[k]
    const color = ["#2563eb", "#16a34a", "#dc2626"][idx % 3] // blue, green, red cycling
    const points = info.trend
      .map((p, i) => {
        const x = (i / (years.length - 1)) * 100
        const y = 100 - ((p.value - minV) / Math.max(1, maxV - minV)) * 100
        return `${x},${y}`
      })
      .join(" ")
    return { key: k, color, points }
  })

  return (
    <div className="min-h-screen bg-background">
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Career vs Demand Comparison</h1>
            <Button asChild variant="outline" className="bg-transparent">
              <Link href="/wellbeing">Student Wellbeing</Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Careers (2–3)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="flex gap-2">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Select value={careerKey} onValueChange={setCareerKey}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Pick a career" />
                    </SelectTrigger>
                    <SelectContent>
                      {careersInCategory.map((k) => (
                        <SelectItem key={k} value={k}>
                          {CAREER_CATALOG[k].name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={() => canAdd && setSelected((s) => [...s, careerKey as CareerKey])} disabled={!canAdd}>
                    Add
                  </Button>
                </div>
                <div className="flex gap-2">
                  <div className="relative w-full">
                    <Input placeholder="Search career in category" value={query} onChange={(e) => setQuery(e.target.value)} />
                    <Search className="w-4 h-4 text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2" />
                  </div>
                  <Button variant="secondary" onClick={() => setCompared(selected)} disabled={selected.length < 2}>
                    Compare
                  </Button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {selected.map((k) => (
                  <Badge key={k} variant="secondary" className="flex items-center gap-2">
                    {CAREER_CATALOG[k].name}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-5 px-1"
                      onClick={() => setSelected((s) => s.filter((x) => x !== k))}
                    >
                      ✕
                    </Button>
                  </Badge>
                ))}
                {selected.length === 0 && <span className="text-sm text-muted-foreground">No careers selected yet.</span>}
              </div>
            </CardContent>
          </Card>

          {/* Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Career Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Career</TableHead>
                      <TableHead className="whitespace-nowrap">Growth Rate</TableHead>
                      <TableHead>Avg Salary (India)</TableHead>
                      <TableHead>Annual Openings (India)</TableHead>
                      <TableHead>Key Skills</TableHead>
                      <TableHead>Future Scope (2025–2030)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {compared.map((k) => {
                      const c = CAREER_CATALOG[k]
                      const sig = growthSignal(c.growthRate)
                      return (
                        <TableRow key={k}>
                          <TableCell className="font-medium">{c.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {sig === "green" ? (
                                <TrendingUp className="w-4 h-4 text-green-600" />
                              ) : sig === "red" ? (
                                <TrendingDown className="w-4 h-4 text-red-600" />
                              ) : (
                                <Minus className="w-4 h-4 text-yellow-600" />
                              )}
                              <span className={sig === "green" ? "text-green-600" : sig === "red" ? "text-red-600" : "text-yellow-700"}>
                                {c.growthRate > 0 ? `+${c.growthRate}%` : `${c.growthRate}%`}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>{c.avgSalaryIndia}</TableCell>
                          <TableCell>{c.annualOpeningsIndia}</TableCell>
                          <TableCell className="whitespace-pre-wrap">
                            {c.skills.join(", ")}
                          </TableCell>
                          <TableCell className="whitespace-pre-wrap">{c.futureScope}</TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
              <div className="text-sm text-muted-foreground mt-3">
                ✅ {insight}
              </div>
            </CardContent>
          </Card>

          {/* International Scope */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">International Scope: India vs USA vs Canada vs Dubai</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {compared.map((k) => {
                  const c = CAREER_CATALOG[k]
                  const sig = growthSignal(c.international.globalGrowth)
                  return (
                    <Card key={k} className="border border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{c.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-1">
                        <div className="flex justify-between"><span>India</span><span>{c.international.indiaSalary}</span></div>
                        <div className="flex justify-between"><span>USA</span><span>{c.international.usaSalary}</span></div>
                        <div className="flex justify-between"><span>Canada</span><span>{c.international.canadaSalary}</span></div>
                        {c.international.dubaiSalary && (
                          <div className="flex justify-between"><span>Dubai</span><span>{c.international.dubaiSalary}</span></div>
                        )}
                        <div className="pt-2 flex items-center gap-2">
                          {sig === "green" ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                          ) : sig === "red" ? (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                          ) : (
                            <Minus className="w-4 h-4 text-yellow-600" />
                          )}
                          <span>Global Growth: {c.international.globalGrowth > 0 ? `+${c.international.globalGrowth}%` : `${c.international.globalGrowth}%`}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Trend Graph */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Demand Trend (2015–2030)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full overflow-x-auto">
                <div className="min-w-[600px]">
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
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">Y values are normalized to show trend shape per selection.</div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
