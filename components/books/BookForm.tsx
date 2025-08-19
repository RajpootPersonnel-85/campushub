"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

export type BookPayload = {
  title: string
  author: string
  isbn?: string
  condition: "Excellent" | "Good" | "Fair"
  price: number
  category?: string
  description?: string
}

export default function BookForm({ initial }: { initial?: Partial<BookPayload> }) {
  const [data, setData] = useState<BookPayload>({
    title: initial?.title || "",
    author: initial?.author || "",
    isbn: initial?.isbn || "",
    condition: (initial?.condition as any) || "Good",
    price: initial?.price || 0,
    category: initial?.category || "Other",
    description: initial?.description || "",
  })
  const [loadingIsbn, setLoadingIsbn] = useState(false)
  const [isbnError, setIsbnError] = useState<string | null>(null)

  const fetchByISBN = async () => {
    if (!data.isbn) return
    setLoadingIsbn(true)
    setIsbnError(null)
    try {
      const clean = data.isbn.replace(/[^0-9Xx]/g, "")
      const res = await fetch(`https://openlibrary.org/isbn/${clean}.json`)
      if (!res.ok) throw new Error("ISBN not found")
      const b = await res.json()
      setData((d) => ({
        ...d,
        title: b.title || d.title,
        // OpenLibrary stores authors as keys; keep previous author if not resolved
      }))
      // Try resolve author name quickly (best-effort)
      if (Array.isArray((b as any).authors) && (b as any).authors[0]?.key) {
        const key = (b as any).authors[0].key
        fetch(`https://openlibrary.org${key}.json`).then(r => r.json()).then((a) => {
          setData((d) => ({ ...d, author: a.name || d.author }))
        }).catch(() => {})
      }
    } catch (e: any) {
      setIsbnError(e.message || "Failed to fetch ISBN")
    } finally {
      setLoadingIsbn(false)
    }
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Placeholder: submit to backend later
    alert(`Saved listing: ${data.title} by ${data.author}`)
  }

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Title</label>
              <Input value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm font-medium">Author</label>
              <Input value={data.author} onChange={(e) => setData({ ...data, author: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm font-medium">ISBN</label>
              <div className="flex gap-2">
                <Input placeholder="978..." value={data.isbn} onChange={(e) => setData({ ...data, isbn: e.target.value })} />
                <Button type="button" onClick={fetchByISBN} disabled={loadingIsbn}>{loadingIsbn ? "Fetching" : "Autofill"}</Button>
              </div>
              {isbnError && <p className="text-xs text-red-500 mt-1">{isbnError}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Condition</label>
              <Select value={data.condition} onValueChange={(v: any) => setData({ ...data, condition: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Excellent">Excellent</SelectItem>
                  <SelectItem value="Good">Good</SelectItem>
                  <SelectItem value="Fair">Fair</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Price (₹)</label>
              <Input type="number" min={0} value={data.price} onChange={(e) => setData({ ...data, price: Number(e.target.value) })} required />
            </div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select value={data.category} onValueChange={(v) => setData({ ...data, category: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CS">CS</SelectItem>
                  <SelectItem value="EE">EE</SelectItem>
                  <SelectItem value="ME">ME</SelectItem>
                  <SelectItem value="Civil">Civil</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea rows={4} value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="submit">Save Listing</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
