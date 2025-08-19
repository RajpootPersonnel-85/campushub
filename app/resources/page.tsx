"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RESOURCES, RESOURCE_TAGS, ResourceItem } from "@/lib/resources-data"
import { ExternalLink } from "lucide-react"

export default function ResourcesPage() {
  const [tag, setTag] = useState<string>("All")
  const [q, setQ] = useState("")

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase()
    return RESOURCES.filter((r) => (tag === "All" ? true : r.tags.includes(tag as any))).filter((r) =>
      text ? `${r.name} ${r.description}`.toLowerCase().includes(text) : true
    )
  }, [tag, q])

  return (
    <div className="min-h-screen bg-background">
      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Best Free Learning Resources</h1>
            <p className="text-sm text-muted-foreground mt-1">Curated list of free books, lectures, and practice platforms.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Filter Resources</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Select value={tag} onValueChange={setTag}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Category" /></SelectTrigger>
                <SelectContent>
                  {RESOURCE_TAGS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="md:col-span-2 flex gap-2">
                <Input placeholder="Search resources" value={q} onChange={(e) => setQ(e.target.value)} />
                <Button variant="outline" onClick={() => { setTag("All"); setQ("") }} className="bg-transparent">Reset</Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((r: ResourceItem) => (
              <Card key={r.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{r.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{r.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {r.tags.map((t) => (
                      <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>
                    ))}
                  </div>
                  <a href={r.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">
                    Visit <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
