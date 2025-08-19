"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Gift, Eye, Download } from "lucide-react"

export default function BooksSection() {
  // Used Books carousel state
  const booksCarouselRef = useRef<HTMLDivElement | null>(null)
  const [booksPaused, setBooksPaused] = useState(false)
  const books = [
    { title: "Introduction to Algorithms", price: "₹899", condition: "Good", rating: 4.5, seller: "Amit K." },
    { title: "Operating Systems", price: "₹650", condition: "Excellent", rating: 4.8, seller: "Neha R." },
    { title: "Computer Networks", price: "₹750", condition: "Good", rating: 4.6, seller: "Rohit S." },
    { title: "Software Engineering", price: "₹550", condition: "Fair", rating: 4.3, seller: "Kavya M." },
  ] as const

  // Filters for used books
  const [bookQuery, setBookQuery] = useState("")
  const [bookCondition, setBookCondition] = useState<string>("all")
  const [bookSort, setBookSort] = useState<string>("relevance")

  const filteredBooks = useMemo(() => {
    const q = bookQuery.trim().toLowerCase()
    let arr = books.filter((b) => {
      const matchesQ = q ? b.title.toLowerCase().includes(q) || b.seller.toLowerCase().includes(q) : true
      const matchesC = bookCondition === "all" ? true : b.condition.toLowerCase() === bookCondition
      return matchesQ && matchesC
    })
    // Sorting
    if (bookSort === "price-asc" || bookSort === "price-desc") {
      const toNum = (p: string) => parseInt(p.replace(/[^0-9]/g, ""), 10)
      arr = [...arr].sort((a, b) => (toNum(a.price) - toNum(b.price)) * (bookSort === "price-asc" ? 1 : -1))
    } else if (bookSort === "rating-desc") {
      arr = [...arr].sort((a, b) => b.rating - a.rating)
    }
    return arr
  }, [books, bookQuery, bookCondition, bookSort])

  // Reset scroll when list changes
  useEffect(() => {
    const el = booksCarouselRef.current
    if (el) el.scrollLeft = 0
  }, [filteredBooks.length, bookQuery, bookCondition, bookSort])

  // Auto-scroll the books row and loop seamlessly (paused on reduced motion / hidden tab)
  useEffect(() => {
    const prefersReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return // Respect user preference

    let raf = 0
    const speed = 0.6 // pixels per frame
    const step = () => {
      if (document.hidden) {
        raf = requestAnimationFrame(step)
        return
      }
      const el = booksCarouselRef.current
      if (el && !booksPaused) {
        el.scrollLeft += speed
        const half = el.scrollWidth / 2
        if (el.scrollLeft >= half) {
          el.scrollLeft -= half
        }
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    const onVisibility = () => {
      if (!document.hidden) {
        cancelAnimationFrame(raf)
        raf = requestAnimationFrame(step)
      }
    }
    document.addEventListener("visibilitychange", onVisibility)
    return () => {
      document.removeEventListener("visibilitychange", onVisibility)
      cancelAnimationFrame(raf)
    }
  }, [booksPaused])

  return (
    <section id="books" className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">📖 Used Books & Essentials</h2>
            <p className="text-muted-foreground">Quality books at student-friendly prices</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button asChild variant="outline" className="text-primary bg-transparent">
              <Link href="/books/sell" className="inline-flex items-center">
                <Gift className="w-4 h-4 mr-2" />
                Sell Your Book
              </Link>
            </Button>
            <Link href="/books">
              <Button className="bg-primary hover:bg-primary/90">View All Books</Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Input
            placeholder="Search books or sellers"
            value={bookQuery}
            onChange={(e) => setBookQuery(e.target.value)}
            className="w-full sm:w-64"
          />
          <Select value={bookCondition} onValueChange={setBookCondition}>
            <SelectTrigger className="w-36">
              <SelectValue placeholder="Condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Conditions</SelectItem>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
            </SelectContent>
          </Select>
          <Select value={bookSort} onValueChange={setBookSort}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rating-desc">Rating: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Horizontal auto-scrolling carousel (loops) */}
        <div
          ref={booksCarouselRef}
          className="overflow-x-auto w-full [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          onMouseEnter={() => setBooksPaused(true)}
          onMouseLeave={() => setBooksPaused(false)}
          aria-label="Used books carousel"
        >
          <div className="flex gap-4 w-max py-1">
            {[...filteredBooks, ...filteredBooks].map((book, index) => (
              <Card key={`${book.title}-${index}`} className="hover:shadow-md transition-shadow min-w-[200px] sm:min-w-[220px] lg:min-w-[240px]">
                <div className="bg-muted rounded-t-lg h-40 sm:h-44 lg:h-48 relative">
                  <Image
                    src={`/abstract-geometric-shapes.png?height=220&width=180&query=${encodeURIComponent(book.title)}%20textbook%20cover`}
                    alt={book.title}
                    fill
                    sizes="(max-width: 640px) 200px, (max-width: 1024px) 220px, 240px"
                    className="object-cover rounded-t-lg"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium text-xs mb-1">{book.title}</h3>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-base font-bold text-primary">{book.price}</span>
                    <Badge className="text-[10px] px-1.5 py-0" variant={book.condition === "Excellent" ? "default" : "secondary"}>{book.condition}</Badge>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <div className="flex items-center space-x-1">
                      <Eye className="w-3 h-3" />
                      <span>{book.rating.toFixed(1)}★</span>
                    </div>
                    <div className="text-muted-foreground">{book.seller}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
