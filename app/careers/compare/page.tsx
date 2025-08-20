"use client"

import { useEffect, useMemo, useState, useDeferredValue, useRef, useTransition } from "react"
import type { CSSProperties } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CAREER_CATALOG, CATEGORIES, CareerKey, growthSignal } from "@/lib/careers-data"
import type { AdSlide } from "@/components/ads/AdsCarousel"
const AdsCarousel = dynamic(() => import("@/components/ads/AdsCarousel"), { ssr: false })
import { TrendingUp, TrendingDown, Minus, Search, FileDown, ShieldCheck } from "lucide-react"

export default function CareersComparePage() {
  const [_isPending, startTransition] = useTransition()
  const [category, setCategory] = useState<string>("Engineering")
  const [careerKey, setCareerKey] = useState<string>("")
  const [query, setQuery] = useState("")
  const deferredQuery = useDeferredValue(query)
  const [selected, setSelected] = useState<CareerKey[]>(["software_development", "data_science"]) // defaults
  const [compared, setCompared] = useState<CareerKey[]>(selected)
  const [visible, setVisible] = useState<Record<CareerKey, boolean>>({
    software_development: true,
    data_science: true,
    civil_engineering: false,
    mechanical_engineering: false,
    graphic_design: false,
    ux_ui_design: false,
    mbbs: false,
    nursing: false,
    pharmacy: false,
    ca: false,
    mba_finance: false,
    cfa: false,
    lawyer: false,
    commerce_general: false,
    arts_general: false,
  })

  // Build internships/jobs slides for carousel (screen only)
  const jobSlides: AdSlide[] = useMemo(() => {
    const slides: AdSlide[] = []
    const keys = compared.length ? compared : selected
    const mk = (id: string, text: string, href: string, bg: string): AdSlide => ({ id, text, href, bg, format: "hero" })
    keys.forEach((k) => {
      const name = CAREER_CATALOG[k].name
      const q = encodeURIComponent(name)
      slides.push(mk(`${k}-li`, `${name} — LinkedIn Jobs`, `https://www.linkedin.com/jobs/search/?keywords=${q}`, "linear-gradient(90deg,#0a66c2,#004182)"))
      slides.push(mk(`${k}-is`, `${name} — Internshala`, `https://internshala.com/internships/keywords-${q}`, "linear-gradient(90deg,#2f57e5,#1b35a8)"))
      slides.push(mk(`${k}-nk`, `${name} — Naukri`, `https://www.naukri.com/${q}-jobs`, "linear-gradient(90deg,#1f88e5,#155a99)"))
      slides.push(mk(`${k}-id`, `${name} — Indeed`, `https://in.indeed.com/jobs?q=${q}`, "linear-gradient(90deg,#3b82f6,#1e40af)"))
    })
    return slides
  }, [compared, selected])

  // Keep visibility keys synced with compared list (default new ones to true)
  useEffect(() => {
    setVisible((prev) => {
      const next: Record<CareerKey, boolean> = { ...prev }
      const list: CareerKey[] = Array.isArray(compared) ? (compared as CareerKey[]) : []
      list.forEach((k: CareerKey) => {
        if (next[k] === undefined) next[k] = true
      })
      // Optionally hide keys no longer compared
      ;(Object.keys(next) as CareerKey[]).forEach((k: CareerKey) => {
        if (!list.includes(k)) next[k] = false
      })
      return { ...next }
    })
  }, [compared])

  // Quiz state and recommendations
  const [quiz, setQuiz] = useState({
    interest: "tech", // tech | business | health | design | core
    workStyle: "build", // build | analyze | help | create
    salaryFocus: "balanced", // high | balanced | not_important
    studyLength: "medium", // short | medium | long
  })
  const [recs, setRecs] = useState<CareerKey[]>([])
  const [loading, setLoading] = useState(false)

  // Reset selections to defaults
  const resetSelections = () => {
    const defaults: CareerKey[] = ["software_development", "data_science"]
    setSelected(defaults)
    setCompared(defaults)
  }

  function scoreCareer(key: CareerKey) {
    const c = CAREER_CATALOG[key]
    let score = 0
    // Interest -> category mapping
    const interestMap: Record<string, string[]> = {
      tech: ["Engineering"],
      business: ["Commerce"],
      health: ["Medical"],
      design: ["Arts"],
      core: ["Engineering", "Commerce"],
    }
    if (interestMap[quiz.interest]?.includes(c.category)) score += 3

    // Work style -> skills keywords
    const styleMap: Record<string, string[]> = {
      build: ["Java", "Python", "Cloud", "DevOps", "CAD", "Manufacturing"],
      analyze: ["AI", "ML", "Data", "Finance", "Audit", "Law"],
      help: ["Care", "Patient", "Clinical", "Pharma", "Nursing"],
      create: ["Design", "UX", "UI", "Graphics", "Creative"],
    }
    const styleWords = new Set(styleMap[quiz.workStyle] || [])
    c.skills.forEach((s) => {
      for (const w of styleWords) if (s.toLowerCase().includes(w.toLowerCase())) score += 1.2
    })

    // Salary focus approximated via avgSalaryIndia and international growth
    if (quiz.salaryFocus === "high") score += Math.max(0, c.international.globalGrowth) / 4
    if (quiz.salaryFocus === "balanced") score += Math.max(0, c.growthRate) / 6

    // Study length heuristic by category
    const longCats = new Set(["Medical"])
    const shortCats = new Set(["Arts", "Commerce"]) // relative
    if (quiz.studyLength === "long" && longCats.has(c.category)) score += 2
    if (quiz.studyLength === "short" && shortCats.has(c.category)) score += 1.5

    // Base growth weight
    score += Math.max(0, c.growthRate) / 8
    return score
  }

  function computeRecommendations() {
    const keys = Object.keys(CAREER_CATALOG) as CareerKey[]
    const ranked = keys
      .map((k) => ({ k, s: scoreCareer(k) }))
      .sort((a, b) => b.s - a.s)
      .slice(0, 3)
      .map((x) => x.k)
    setRecs(ranked)
  }

  const careersInCategory = useMemo(() => {
    const cat = CATEGORIES.find((c) => c.value === category)
    if (!cat) return []
    let keys = cat.careers
    if (deferredQuery.trim()) {
      const q = deferredQuery.trim().toLowerCase()
      keys = keys.filter((k) => CAREER_CATALOG[k].name.toLowerCase().includes(q))
    }
    return keys
  }, [category, deferredQuery])

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

  const { years, baseKeys, lines, minV, maxV } = useMemo(() => {
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
    return { years: yearsLocal, baseKeys: base, lines: linesLocal, minV, maxV }
  }, [compared, visible])

  // Lazy-mount carousel when in viewport
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const [carouselInView, setCarouselInView] = useState(false)
  useEffect(() => {
    if (typeof window === "undefined" || !carouselRef.current) return
    const el = carouselRef.current
    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0]
        if (e && e.isIntersecting) {
          setCarouselInView(true)
          obs.disconnect()
        }
      },
      { root: null, threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Print helpers (client-only to avoid hydration mismatch)
  const [printDateStr, setPrintDateStr] = useState("")
  useEffect(() => {
    try {
      setPrintDateStr(new Date().toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }))
    } catch {}
  }, [])

  // Mount flag to stabilize hydration of dynamic summary
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  // Defer non-critical UI (carousel, quiz) slightly to reduce initial main-thread work
  const [deferNonCritical, setDeferNonCritical] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setDeferNonCritical(false), 300)
    return () => clearTimeout(t)
  }, [])

  // Shareable permalink: read on mount and set selection
  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    const careers = params.get("careers")
    if (careers) {
      const keysRaw = careers.split(",").map((s) => s.trim()).filter(Boolean)
      const valid: CareerKey[] = keysRaw.filter((k): k is CareerKey => (CAREER_CATALOG as any)[k])
      if (valid.length) {
        setSelected(valid.slice(0, 3))
        if (valid.length >= 2) {
          setLoading(true)
          setCompared(valid.slice(0, 3))
          setTimeout(() => setLoading(false), 300)
        }
      }
    }
  }, [])

  // Share link generator
  const [copied, setCopied] = useState(false)
  function copyShareLink() {
    if (typeof window === "undefined") return
    const keys = (compared.length ? compared : selected).slice(0, 3)
    const url = new URL(window.location.href)
    if (keys.length) url.searchParams.set("careers", keys.join(","))
    else url.searchParams.delete("careers")
    const str = url.toString()
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(str)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Career vs Demand Comparison</h1>
            <div className="flex items-center gap-2">
              <Button aria-label="Download as PDF" title="Download as PDF" variant="secondary" onClick={() => window.print()} className="bg-transparent">
                <FileDown className="w-4 h-4 mr-2" /> Download PDF
              </Button>
              <Button aria-label="Copy shareable link" title="Copy shareable link" variant="outline" onClick={copyShareLink} className="bg-transparent print:hidden">
                {copied ? "Copied!" : "Share Link"}
              </Button>
              <Button aria-label="Clear selections" title="Clear selections" variant="outline" onClick={resetSelections} className="bg-transparent print:hidden">
                Clear
              </Button>
              <Button aria-label="Go to Student Wellbeing" asChild variant="outline" className="bg-transparent print:hidden">
                <Link href="/wellbeing">Student Wellbeing</Link>
              </Button>
            </div>
          </div>

          {/* Print header (shown only on print) */}
          <div className="hidden print:block">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Career vs Demand Comparison</h2>
              <span suppressHydrationWarning className="text-sm text-muted-foreground">Printed on: {printDateStr || ""}</span>
            </div>
            <div className="h-px bg-border my-3" />
          </div>

          <Card style={{ contentVisibility: "auto", containIntrinsicSize: "820px" } as CSSProperties}>
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
                    <Input aria-label="Search career in category" placeholder="Search career in category" value={query} onChange={(e) => setQuery(e.target.value)} />
                    <Search className="w-4 h-4 text-muted-foreground absolute right-2 top-1/2 -translate-y-1/2" />
                  </div>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      if (selected.length >= 2) {
                        setLoading(true)
                        startTransition(() => {
                          setCompared(selected)
                        })
                        setTimeout(() => setLoading(false), 300)
                      }
                    }}
                    disabled={selected.length < 2}
                  >
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
                      aria-label={`Remove ${CAREER_CATALOG[k].name}`}
                      title={`Remove ${CAREER_CATALOG[k].name}`}
                      className="h-6 px-2"
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

          {/* Alternatives & Adjacent Roles */}
          <div className="print:break-before-page">
          <Card style={{ contentVisibility: "auto", containIntrinsicSize: "400px" } as CSSProperties}>
            <CardHeader>
              <CardTitle className="text-lg">Alternatives & Adjacent Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                  <>
                    {[0,1].map((i) => (
                      <div key={i} className="border border-border rounded p-4 animate-pulse space-y-2">
                        <div className="h-5 bg-muted rounded w-2/3" />
                        <div className="h-4 bg-muted rounded" />
                        <div className="h-4 bg-muted rounded w-10/12" />
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                  {compared.map((k) => {
                    const c = CAREER_CATALOG[k]
                    const alts = Object.values(CAREER_CATALOG)
                      .filter((x) => x.category === c.category && x.key !== c.key)
                      .sort((a, b) => b.growthRate - a.growthRate)
                      .slice(0, 3)
                    return (
                      <Card key={k} className="border border-border">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">{c.name}</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                          {alts.length === 0 ? (
                            <div className="text-muted-foreground">No close alternatives in the same category.</div>
                          ) : (
                            alts.map((a) => (
                              <div key={a.key} className="flex items-center justify-between gap-2">
                                <span>{a.name}</span>
                                <span className="text-xs text-muted-foreground">growth {a.growthRate > 0 ? `+${a.growthRate}%` : `${a.growthRate}%`}</span>
                              </div>
                            ))
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          </div>

          {/* Internships & Jobs Carousel (screen), plus print-only static links */}
          <div className="print:break-before-page">
          {/* Screen: Carousel */}
          <Card className="print:hidden" style={{ contentVisibility: "auto", containIntrinsicSize: "260px" } as CSSProperties}>
            <CardHeader>
              <CardTitle suppressHydrationWarning className="text-lg">Internships & Jobs</CardTitle>
            </CardHeader>
            <CardContent>
              <div ref={carouselRef}>
                {loading || jobSlides.length === 0 || deferNonCritical || !carouselInView ? (
                  <div className="w-full h-40 bg-muted/30 rounded border border-border animate-pulse" />
                ) : (
                  <AdsCarousel slides={jobSlides} intervalMs={3500} />
                )}
              </div>
            </CardContent>
          </Card>

          {/* Print: Static quick links grid */}
          <Card className="hidden print:block">
            <CardHeader>
              <CardTitle className="text-lg">Internships & Jobs (Links)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {compared.map((k) => {
                  const c = CAREER_CATALOG[k]
                  const q = encodeURIComponent(c.name)
                  const links = [
                    { label: "LinkedIn Jobs", href: `https://www.linkedin.com/jobs/search/?keywords=${q}` },
                    { label: "Internshala", href: `https://internshala.com/internships/keywords-${q}` },
                    { label: "Naukri", href: `https://www.naukri.com/${q}-jobs` },
                    { label: "Indeed", href: `https://in.indeed.com/jobs?q=${q}` },
                  ]
                  return (
                    <div key={k} className="text-sm">
                      <div className="font-medium mb-1">{c.name}</div>
                      <div className="flex flex-wrap gap-2">
                        {links.map((lnk) => (
                          <span key={lnk.href} className="underline">{lnk.label}: {lnk.href}</span>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
          </div>

          {/* Print footer (shown only on print) */}
          <div className="hidden print:block mt-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>campushub • https://localhost:3000/careers/compare</span>
              <span suppressHydrationWarning>Printed on: {printDateStr || ""}</span>
            </div>
          </div>


          {/* Career Fit Mini-Quiz */}
          <Card className="print:hidden" style={{ contentVisibility: "auto", containIntrinsicSize: "520px" } as CSSProperties}>
            <CardHeader>
              <CardTitle className="text-lg">Career Fit Mini-Quiz</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {deferNonCritical ? (
                <div className="space-y-2 animate-pulse">
                  <div className="h-5 bg-muted rounded w-2/3" />
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-10/12" />
                </div>
              ) : (
              <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="mb-2 font-medium">Your primary interest</div>
                  <RadioGroup
                    value={quiz.interest}
                    onValueChange={(v) => setQuiz((q) => ({ ...q, interest: v as typeof q.interest }))}
                    className="grid grid-cols-2 gap-2"
                  >
                    {["tech", "business", "health", "design", "core"].map((v) => (
                      <div key={v} className="flex items-center space-x-2 border rounded p-2">
                        <RadioGroupItem id={`interest-${v}`} value={v} />
                        <Label htmlFor={`interest-${v}`} className="capitalize">{v}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div>
                  <div className="mb-2 font-medium">Preferred work style</div>
                  <RadioGroup
                    value={quiz.workStyle}
                    onValueChange={(v) => setQuiz((q) => ({ ...q, workStyle: v as typeof q.workStyle }))}
                    className="grid grid-cols-2 gap-2"
                  >
                    {["build", "analyze", "help", "create"].map((v) => (
                      <div key={v} className="flex items-center space-x-2 border rounded p-2">
                        <RadioGroupItem id={`style-${v}`} value={v} />
                        <Label htmlFor={`style-${v}`} className="capitalize">{v}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div>
                  <div className="mb-2 font-medium">Salary focus</div>
                  <RadioGroup
                    value={quiz.salaryFocus}
                    onValueChange={(v) => setQuiz((q) => ({ ...q, salaryFocus: v as typeof q.salaryFocus }))}
                    className="grid grid-cols-3 gap-2"
                  >
                    {[
                      { v: "high", label: "High" },
                      { v: "balanced", label: "Balanced" },
                      { v: "not_important", label: "Not important" },
                    ].map(({ v, label }) => (
                      <div key={v} className="flex items-center space-x-2 border rounded p-2">
                        <RadioGroupItem id={`salary-${v}`} value={v} />
                        <Label htmlFor={`salary-${v}`}>{label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
                <div>
                  <div className="mb-2 font-medium">Study length you prefer</div>
                  <RadioGroup
                    value={quiz.studyLength}
                    onValueChange={(v) => setQuiz((q) => ({ ...q, studyLength: v as typeof q.studyLength }))}
                    className="grid grid-cols-3 gap-2"
                  >
                    {["short", "medium", "long"].map((v) => (
                      <div key={v} className="flex items-center space-x-2 border rounded p-2">
                        <RadioGroupItem id={`study-${v}`} value={v} />
                        <Label htmlFor={`study-${v}`} className="capitalize">{v}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={computeRecommendations}>Get recommendations</Button>
                {recs.length > 0 && (
                  <>
                    <div className="text-sm text-muted-foreground">Top matches: {recs.map((k) => CAREER_CATALOG[k].name).join(", ")}</div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setLoading(true)
                        startTransition(() => {
                          setCompared(recs as CareerKey[])
                        })
                        setTimeout(() => setLoading(false), 300)
                      }}
                    >
                      Apply to comparison
                    </Button>
                  </>
                )}
              </div>
              </>
              )}
            </CardContent>
          </Card>


          {/* Print Header (visible only when printing) */}
          <Card className="hidden print:block print:shadow-none print:border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">CampusHub — Career Comparison Report</CardTitle>
            </CardHeader>
            <div className="hidden print:block text-xs text-muted-foreground mt-6">
              <div className="flex items-center justify-between">
                <span>CampusHub • Career Comparison</span>
                <span suppressHydrationWarning>Generated: {printDateStr}</span>
              </div>
            </div>
            <CardContent className="text-sm text-muted-foreground">
              <div className="flex flex-wrap gap-3">
                <span suppressHydrationWarning>Date: {printDateStr}</span>
                <span>Selected: {compared.map((k) => CAREER_CATALOG[k].name).join(", ")}</span>
                <span>URL: /careers/compare</span>
              </div>
            </CardContent>
          </Card>

          {/* Executive Summary */}
          <Card className="print:shadow-none print:border-0" style={{ contentVisibility: "auto", containIntrinsicSize: "280px" } as CSSProperties}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Executive Summary</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {!mounted ? (
                <div className="text-muted-foreground">Preparing summary…</div>
              ) : compared.length >= 2 ? (
                <div className="space-y-2">
                  <div>
                    <span className="font-medium text-foreground">Overview:</span> {insight}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <div>
                      <span className="font-medium text-foreground">Compared:</span> {compared.map((k) => CAREER_CATALOG[k].name).join(", ")}
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Categories:</span> {
                        Array.from(new Set(compared.map((k) => CAREER_CATALOG[k].category))).join(", ")
                      }
                    </div>
                    <div>
                      <span className="font-medium text-foreground">Growth Leaders:</span> {
                        [...compared]
                          .sort((a, b) => CAREER_CATALOG[b].growthRate - CAREER_CATALOG[a].growthRate)
                          .slice(0, 1)
                          .map((k) => CAREER_CATALOG[k].name)
                          .join(", ")
                      }
                    </div>
                  </div>
                  <div className="text-xs">
                    Note: Comfort Index adjusts salary potential by cost-of-living across regions (India, USA, Canada, Dubai) to guide realistic expectations.
                  </div>
                </div>
              ) : (
                <div>Select two or more careers to generate an executive summary.</div>
              )}
            </CardContent>
          </Card>

          {/* Comparison Table */}
          <div className="print:break-before-page">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Career Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                {loading ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-6 bg-muted rounded" />
                    <div className="h-6 bg-muted rounded w-11/12" />
                    <div className="h-6 bg-muted rounded w-10/12" />
                  </div>
                ) : (
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
                )}
              </div>
              <div className="text-sm text-muted-foreground mt-3">
                ✅ {insight}
              </div>
            </CardContent>
          </Card>

          </div>

          {/* International Scope */}
          <div className="print:break-before-page">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">International Scope & Comfort Index</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                  <>
                    {[0,1,2].map((i) => (
                      <div key={i} className="border border-border rounded p-4 animate-pulse space-y-2">
                        <div className="h-5 bg-muted rounded w-2/3" />
                        <div className="h-4 bg-muted rounded" />
                        <div className="h-4 bg-muted rounded w-11/12" />
                        <div className="h-4 bg-muted rounded w-10/12" />
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                {compared.map((k) => {
                  const c = CAREER_CATALOG[k]
                  const sig = growthSignal(c.international.globalGrowth)
                  const col = { india: 1.0, usa: 2.1, canada: 1.8, dubai: 1.7 }
                  const comfort = (factor: number) => (factor <= 1.1 ? "High" : factor <= 1.8 ? "Medium" : "Moderate")
                  return (
                    <Card key={k} className="border border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{c.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-1">
                        <div className="flex justify-between items-center gap-2">
                          <span>India</span>
                          <span className="flex items-center gap-2">
                            {c.international.indiaSalary}
                            <Badge variant="secondary" className="text-xs" title={`CoL factor ~ ${col.india}`}>Comfort: {comfort(col.india)}</Badge>
                          </span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <span>USA</span>
                          <span className="flex items-center gap-2">
                            {c.international.usaSalary}
                            <Badge variant="secondary" className="text-xs" title={`CoL factor ~ ${col.usa}`}>Comfort: {comfort(col.usa)}</Badge>
                          </span>
                        </div>
                        <div className="flex justify-between items-center gap-2">
                          <span>Canada</span>
                          <span className="flex items-center gap-2">
                            {c.international.canadaSalary}
                            <Badge variant="secondary" className="text-xs" title={`CoL factor ~ ${col.canada}`}>Comfort: {comfort(col.canada)}</Badge>
                          </span>
                        </div>
                        {c.international.dubaiSalary && (
                          <div className="flex justify-between items-center gap-2">
                            <span>Dubai</span>
                            <span className="flex items-center gap-2">
                              {c.international.dubaiSalary}
                              <Badge variant="secondary" className="text-xs" title={`CoL factor ~ ${col.dubai}`}>Comfort: {comfort(col.dubai)}</Badge>
                            </span>
                          </div>
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
                        <div className="text-xs text-muted-foreground mt-1">
                          Comfort Index (cost-of-living): India {comfort(col.india)}, USA {comfort(col.usa)}, Canada {comfort(col.canada)}{c.international.dubaiSalary ? `, Dubai ${comfort(col.dubai)}` : ""}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
                  </>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-3">Note: CoL reference (lower is easier): India 1.0, USA ≈ 2.1, Canada ≈ 1.8, Dubai ≈ 1.7. Salaries shown are typical early-career bands.</p>
            </CardContent>
          </Card>

          </div>

          {/* Stability & Risk (Quick Insights) */}
          <div className="print:break-before-page">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stability & Risk (Quick Insights)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                  <>
                    {[0,1].map((i) => (
                      <div key={i} className="border border-border rounded p-4 animate-pulse space-y-2">
                        <div className="h-5 bg-muted rounded w-2/3" />
                        <div className="h-4 bg-muted rounded" />
                        <div className="h-4 bg-muted rounded w-11/12" />
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                {compared.map((k) => {
                  const c = CAREER_CATALOG[k]
                  // Derive a simple stability score from local and global growth, clamped to 0-100
                  const raw = (c.growthRate + c.international.globalGrowth) / 2
                  const stability = Math.max(0, Math.min(100, Math.round(((raw + 20) / 40) * 100)))
                  const sig = growthSignal(c.growthRate)
                  const tone = sig === "green" ? "text-green-600" : sig === "red" ? "text-red-600" : "text-amber-600"
                  const suited = c.skills.slice(0, 2).join(" / ") || c.category
                  // Suggest 1-2 alternatives within same category by higher growth
                  const alternatives = Object.values(CAREER_CATALOG)
                    .filter((x) => x.category === c.category && x.key !== c.key)
                    .sort((a, b) => b.growthRate - a.growthRate)
                    .slice(0, 2)
                    .map((x) => x.name)
                  return (
                    <Card key={k} className="border border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-primary" /> {c.name}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Stability Score:</span> <span className="font-semibold">{stability}/100</span>
                        </div>
                        <div>
                          <span className="font-medium">Best suited for:</span> <span className="text-muted-foreground">{suited}</span>
                        </div>
                        <div>
                          <span className="font-medium">Growth signal:</span> <span className={tone}>{c.growthRate > 0 ? `+${c.growthRate}%` : `${c.growthRate}%`} (India)</span>
                        </div>
                        <div>
                          <span className="font-medium">Future scope:</span> <span className="text-muted-foreground">{c.futureScope}</span>
                        </div>
                        {alternatives.length > 0 && (
                          <div>
                            <span className="font-medium">Consider also:</span> <span className="text-muted-foreground">{alternatives.join(", ")}</span>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          </div>

          {/* Education Pathway & Skill Roadmap */}
          <div className="print:break-before-page">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Education Pathway & Skill Roadmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? (
                  <>
                    {[0,1].map((i) => (
                      <div key={i} className="border border-border rounded p-4 animate-pulse space-y-2">
                        <div className="h-5 bg-muted rounded w-2/3" />
                        <div className="h-4 bg-muted rounded" />
                        <div className="h-4 bg-muted rounded w-8/12" />
                      </div>
                    ))}
                  </>
                ) : (
                  <>
                {compared.map((k) => {
                  const c = CAREER_CATALOG[k]
                  const skills = c.skills
                  const basics = skills.slice(0, 2)
                  const advanced = skills.slice(2, 5)
                  const tip = c.futureScope.length > 140 ? c.futureScope.slice(0, 140) + "…" : c.futureScope
                  return (
                    <Card key={k} className="border border-border">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">{c.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-sm space-y-2">
                        <div>
                          <span className="font-medium">Year 1–2 (Basics):</span>
                          <span className="text-muted-foreground"> {basics.join(" · ") || "Foundational coursework"}</span>
                        </div>
                        <div>
                          <span className="font-medium">Year 3–4 (Specialize):</span>
                          <span className="text-muted-foreground"> {advanced.join(" · ") || "Projects + Internship"}</span>
                        </div>
                        <div>
                          <span className="font-medium">Post-grad tips:</span>
                          <span className="text-muted-foreground"> {tip}</span>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          </div>

          {/* Trend Graph */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Demand Trend (2015–2030)</CardTitle>
            </CardHeader>
            <CardContent>
              {!loading && (
                <div className="mb-3 flex flex-wrap gap-2 print:hidden">
                  {compared.map((k) => (
                    <Button
                      key={k}
                      size="sm"
                      variant={visible[k] ? "secondary" : "outline"}
                      className={visible[k] ? "" : "opacity-70"}
                      onClick={() => setVisible((v) => ({ ...v, [k]: !v[k] }))}
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
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
