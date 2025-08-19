"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const MY_LISTINGS = [
  { id: "algos-1", title: "Introduction to Algorithms", author: "Cormen", price: 899, condition: "Good" },
  { id: "os-1", title: "Operating Systems", author: "Silberschatz", price: 650, condition: "Excellent" },
]

export default function ManageBooksPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Book Listings</h1>
              <p className="text-muted-foreground">Edit or remove your posted books.</p>
            </div>
            <Link href="/books/new"><Button>New Listing</Button></Link>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {MY_LISTINGS.map((b) => (
              <Card key={b.id} className="hover:shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center justify-between text-base">
                    <span>{b.title} <span className="text-muted-foreground font-normal">by {b.author}</span></span>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{b.condition}</Badge>
                      <span className="font-medium text-primary">₹{b.price}</span>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Link href={`/books/${b.id}/edit`}><Button size="sm" variant="outline" className="bg-transparent">Edit</Button></Link>
                  <Button size="sm" variant="outline" className="bg-transparent" onClick={() => alert("Delete coming soon")}>Delete</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
