"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function CmsDashboardPage() {
  const [tab, setTab] = useState("overview")

  const stats = {
    books: 128,
    notes: 342,
    jobs: 27,
    hostels: 18,
    deals: 12,
  }

  const recent = [
    { type: "Book", title: "Operating System Concepts", when: "2h ago", link: "/cms/books" },
    { type: "Note", title: "DTU ECE SEM5 Signals PDF", when: "4h ago", link: "/cms/notes" },
    { type: "Exam", title: "JEE Mains 2026 Update", when: "Yesterday", link: "/cms/exams" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">CMS Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/">
            <Button variant="outline">View Site</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Books" value={stats.books} href="/cms/books" />
        <StatCard label="Notes" value={stats.notes} href="/cms/notes" />
        <StatCard label="Jobs" value={stats.jobs} href="/cms/jobs" />
        <StatCard label="Hostels" value={stats.hostels} href="/cms/hostels" />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Create</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2">
                <Link href="/cms/books/new"><Button>Add Book</Button></Link>
                <Link href="/cms/notes/new"><Button variant="outline">Add Note</Button></Link>
                <Link href="/cms/jobs/new"><Button variant="outline">Add Job</Button></Link>
                <Link href="/cms/exams/new"><Button variant="outline">Add Exam</Button></Link>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Publishing Tips</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>Use clear titles and add at least one image for marketplace items.</p>
                <p>Keep status as draft until you are ready to publish.</p>
                <p>Remember to revalidate pages if deploying with ISR.</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm">
                {recent.map((r, i) => (
                  <li key={i} className="py-2 border-b border-border last:border-0 flex items-center justify-between">
                    <div>
                      <span className="font-medium">{r.type}:</span> {r.title}
                      <span className="text-muted-foreground ml-2">• {r.when}</span>
                    </div>
                    <Link href={r.link} className="text-primary hover:underline">Open</Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
        </CardContent>
      </Card>
    </Link>
  )
}
