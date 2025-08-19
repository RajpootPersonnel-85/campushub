"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { SCHEMES, STATES, CATEGORIES, LEVELS, SchemeItem } from "@/lib/schemes-data"
import { ExternalLink } from "lucide-react"

export default function SchemesPage() {
  const [state, setState] = useState<string>("All")
  const [category, setCategory] = useState<string>("All")
  const [level, setLevel] = useState<string>("All")
  const [q, setQ] = useState("")

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase()
    return SCHEMES.filter((s) => s.active)
      .filter((s) => (state === "All" ? true : s.state === state))
      .filter((s) => (category === "All" ? true : s.category === category))
      .filter((s) => (level === "All" ? true : s.level === level))
      .filter((s) => (text ? `${s.name} ${s.eligibility} ${s.benefits}`.toLowerCase().includes(text) : true))
  }, [state, category, level, q])

  return (
    <div className="min-h-screen bg-background">
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Government Schemes & Scholarships You Shouldn’t Miss</h1>
            <p className="text-sm text-muted-foreground mt-1">Filter by state, category, and course level to find relevant schemes. Updated periodically.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Find Schemes / Scholarships</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <Select value={state} onValueChange={setState}>
                <SelectTrigger className="w-full"><SelectValue placeholder="State" /></SelectTrigger>
                <SelectContent>
                  {STATES.map((s) => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Course Level" /></SelectTrigger>
                <SelectContent>
                  {LEVELS.map((l) => (
                    <SelectItem key={l} value={l}>{l}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Input placeholder="Search by keyword" value={q} onChange={(e) => setQ(e.target.value)} />
                <Button variant="outline" onClick={() => { setState("All"); setCategory("All"); setLevel("All"); setQ("") }} className="bg-transparent">Reset</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Active Schemes ({filtered.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Eligibility</TableHead>
                      <TableHead>Benefits</TableHead>
                      <TableHead>Apply</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((s: SchemeItem) => (
                      <TableRow key={s.id}>
                        <TableCell className="align-top">
                          <div className="font-medium">{s.name}</div>
                          <div className="text-xs text-muted-foreground flex gap-2 mt-1">
                            <Badge variant="secondary">{s.state}</Badge>
                            {s.category !== "All" && <Badge variant="secondary">{s.category}</Badge>}
                            {s.level !== "All" && <Badge variant="secondary">{s.level}</Badge>}
                          </div>
                        </TableCell>
                        <TableCell className="align-top whitespace-pre-wrap">{s.eligibility}</TableCell>
                        <TableCell className="align-top whitespace-pre-wrap">{s.benefits}</TableCell>
                        <TableCell className="align-top">
                          <a href={s.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                            Apply Now <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
