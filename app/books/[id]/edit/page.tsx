"use client"

import React from "react"
import BookForm, { BookPayload } from "@/components/books/BookForm"

const MOCK_BOOKS: Record<string, Partial<BookPayload>> = {
  "algos-1": {
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    isbn: "9780262046305",
    condition: "Good",
    price: 899,
    category: "CS",
    description: "Well-used but clean. Minimal notes on a few pages.",
  },
  "os-1": {
    title: "Operating System Concepts",
    author: "Silberschatz, Galvin, Gagne",
    condition: "Excellent",
    price: 650,
    category: "CS",
  },
}

export default function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const initial = MOCK_BOOKS[id] || { title: "", author: "", price: 0, condition: "Good" }

  return (
    <div className="min-h-screen bg-background">
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Edit Book</h1>
            <p className="text-muted-foreground">Update details for your listing ({id}).</p>
          </div>
          <BookForm initial={initial} />
        </div>
      </section>
    </div>
  )
}
