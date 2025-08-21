"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"

const conditions = ["Excellent", "Good", "Fair"] as const

export default function CmsBookNewPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: "",
    author: "",
    price: "",
    condition: "Good" as (typeof conditions)[number],
    subject: "",
    description: "",
    isbn: "",
    edition: "",
    language: "",
    tags: "",
  })
  const [saving, setSaving] = useState(false)

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    // TODO: integrate with POST /api/books
    await new Promise((r) => setTimeout(r, 700))
    setSaving(false)
    router.push("/cms/books")
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Add Book</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm text-muted-foreground">Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Title</label>
              <Input required value={form.title} onChange={(e) => update("title", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Author</label>
              <Input required value={form.author} onChange={(e) => update("author", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Price (₹)</label>
              <Input type="number" min={0} required value={form.price} onChange={(e) => update("price", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Condition</label>
              <Select value={form.condition} onValueChange={(v) => update("condition", v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {conditions.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm mb-1">Subject</label>
              <Input value={form.subject} onChange={(e) => update("subject", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Description</label>
              <Textarea rows={6} value={form.description} onChange={(e) => update("description", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">ISBN</label>
              <Input value={form.isbn} onChange={(e) => update("isbn", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Edition</label>
              <Input value={form.edition} onChange={(e) => update("edition", e.target.value)} />
            </div>
            <div>
              <label className="block text-sm mb-1">Language</label>
              <Input value={form.language} onChange={(e) => update("language", e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm mb-1">Tags (comma separated)</label>
              <Input value={form.tags} onChange={(e) => update("tags", e.target.value)} />
            </div>

            <div className="md:col-span-2 flex gap-2 justify-end">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Create"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
