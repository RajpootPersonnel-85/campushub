"use client"

import BookForm from "@/components/books/BookForm"

export default function NewBookPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">List a Book</h1>
            <p className="text-muted-foreground">Post your used textbook with photos, pricing, and details.</p>
          </div>
          <BookForm />
        </div>
      </section>
    </div>
  )
}
