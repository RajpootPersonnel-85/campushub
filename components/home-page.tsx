"use client"

import {
  Search,
  BookOpen,
  Home,
  Briefcase,
  Gift,
  Utensils,
  Phone,
  Star,
  MapPin,
  Users,
  TrendingUp,
  Award,
  ChevronRight,
  Filter,
  Download,
  Eye,
  CheckCircle,
  Calendar,
  Building,
  HeartHandshake,
} from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"
import Image from "next/image"
import dynamic from "next/dynamic"
// Import UpcomingExamsHome dynamically with ssr disabled to keep server/client markup consistent
const UpcomingExamsHome = dynamic(() => import("@/components/exams/UpcomingExamsHome"), {
  ssr: false,
  // Render an identical wrapper element on the server to avoid hydration structure mismatches
  loading: () => <section className="py-12 px-4 sm:px-6 lg:px-8" />,
})
const AdsCarousel = dynamic(() => import("@/components/ads/AdsCarousel"), {
  ssr: false,
  loading: () => <div className="w-full max-w-6xl h-[180px] sm:h-[240px] md:h-[300px] rounded-2xl border border-border animate-pulse bg-muted" />,
})
const CornerAd = dynamic(() => import("@/components/ads/CornerAd"), {
  ssr: false,
  // Render a stable placeholder so server/client markup match
  loading: () => <div data-slot="corner-ad" aria-hidden />,
})
const LeadsWidget = dynamic(() => import("@/components/leads/LeadsWidget"), {
  ssr: false,
  // Stable placeholder on server and before hydrate
  loading: () => <span data-slot="leads-widget" aria-hidden />,
})
// Below-the-fold sections (deferred)
const TiffinSection = dynamic(() => import("@/components/home/TiffinSection"), { ssr: false, loading: () => null })
const JobsSection = dynamic(() => import("@/components/home/JobsSection"), { ssr: false, loading: () => null })
const DealsSection = dynamic(() => import("@/components/home/DealsSection"), { ssr: false, loading: () => null })
const NotesSection = dynamic(() => import("@/components/home/NotesSection"), { ssr: false, loading: () => null })
const BooksSection = dynamic(() => import("@/components/home/BooksSection"), { ssr: false, loading: () => null })
const HostelsSection = dynamic(() => import("@/components/home/HostelsSection"), { ssr: false, loading: () => null })

  // Ads: load from API by position with fallback
  type AdSlide = {
    id: string
    href?: string
    img?: string
    bg?: string
    text?: string
    video?: string
    poster?: string
    format: "leaderboard" | "rectangle" | "hero"
  }

  const fallbackTop: AdSlide[] = [
    { id: "home_h1", format: "hero", img: "/abstract-geometric-shapes.png", href: "/resources" },
    { id: "home_h2", format: "hero", img: "/algorithms-textbook.png", href: "/exams" },
    { id: "home_h3", format: "hero", img: "/calculus-textbook.png", href: "/resources" },
    { id: "home_h4", format: "hero", img: "/algorithms-textbook-pages.png", href: "/schemes" },
  ]
  const fallbackMid: AdSlide[] = [
    { id: "home_h5", format: "hero", img: "/abstract-geometric-shapes.png", href: "#deals" },
    { id: "home_h6", format: "hero", img: "/algorithms-textbook-pages.png", href: "/hostels/list" },
    { id: "home_h7", format: "hero", img: "/student-avatar.png", href: "/notes/upload" },
  ]

export default function HomePage() {
  // Ads: hooks must be inside component
  const [heroTopSlides, setHeroTopSlides] = useState<AdSlide[]>(fallbackTop)
  const [heroMidSlides, setHeroMidSlides] = useState<AdSlide[]>(fallbackMid)

  useEffect(() => {
    let cancelled = false
    async function loadAds() {
      try {
        const [topRes, midRes] = await Promise.all([
          fetch("/api/ads/position/home_hero_top", { cache: "no-store" }),
          fetch("/api/ads/position/home_hero_mid", { cache: "no-store" }),
        ])
        const topJson = await topRes.json().catch(() => ({ ok: false }))
        const midJson = await midRes.json().catch(() => ({ ok: false }))
        if (!cancelled) {
          if (topJson?.ok && Array.isArray(topJson.items) && topJson.items.length > 0) {
            setHeroTopSlides(topJson.items.map((a: any) => ({
              id: a.id,
              href: a.href,
              img: a.img,
              bg: a.bg,
              text: a.text,
              video: a.video,
              poster: a.poster,
              format: a.format ?? "hero",
            })))
          }
          if (midJson?.ok && Array.isArray(midJson.items) && midJson.items.length > 0) {
            setHeroMidSlides(midJson.items.map((a: any) => ({
              id: a.id,
              href: a.href,
              img: a.img,
              bg: a.bg,
              text: a.text,
              video: a.video,
              poster: a.poster,
              format: a.format ?? "hero",
            })))
          }
        }
      } catch {}
    }
    loadAds()
    return () => { cancelled = true }
  }, [])
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
        // kick loop
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
    <div className="min-h-screen bg-background">

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background to-muted">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Your Ultimate <span className="text-primary">Student</span> Platform
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Find notes, buy books, discover hostels, and connect with your college community - all in one place.
          </p>

          {/* Central Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="flex flex-col sm:flex-row gap-2 p-2 bg-card rounded-lg border border-border shadow-sm">
              <Select defaultValue="notes">
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="notes">Search Notes</SelectItem>
                  <SelectItem value="books">Search Books</SelectItem>
                  <SelectItem value="hostels">Search Hostels</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="What are you looking for?" className="flex-1" />
              <Button className="w-full sm:w-auto">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/notes/upload" className="inline-flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Upload Notes → Earn Credits
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="text-lg px-8">
              <Link href="/schemes" className="inline-flex items-center">
                🎓
                <span className="ml-2">Not just career – find schemes & free resources</span>
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/hostels/list" className="inline-flex items-center">
                <Home className="w-5 h-5 mr-2" />
                List Your Hostel Free
              </Link>
            </Button>
         
          </div>
        </div>

        {/* Background Illustration */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <Image
            src="/abstract-geometric-shapes.png"
            alt=""
            role="presentation"
            fill
            sizes="100vw"
            priority={false}
            loading="lazy"
            className="object-cover opacity-5"
          />
        </div>
      </section>

      {/* Ad: Hero Ad Carousel (images/videos supported) */}
      <section className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AdsCarousel showDots slides={heroTopSlides} />
        </div>
      </section>

      {/* Upcoming Exams Strip */}
      <UpcomingExamsHome />

      {/* Ad: Hero Ad Carousel below Upcoming Exams */}
      <section className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AdsCarousel showDots slides={heroMidSlides} />
        </div>
      </section>

      {/* Tiffin Services Section (deferred) */}
      <TiffinSection />

      {/* Jobs/Internships Section (deferred) */}
      <JobsSection />

      {/* Student Deals & Discounts Section (deferred) */}
      <DealsSection />

      {/* Enhanced Notes Section (deferred) */}
      <NotesSection />

      {/* Used Books Section (deferred) */}
      <BooksSection />

      {/* PG/Hostel Finder Section (deferred) */}
      <HostelsSection />

      {/* Enhanced Engagement Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">CampusHub Impact</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of students who are already benefiting from our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {/* Statistics Cards */}
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                <p className="text-sm text-muted-foreground">Active Students</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">25K+</div>
                <p className="text-sm text-muted-foreground">Notes Shared</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">15K+</div>
                <p className="text-sm text-muted-foreground">Books Sold</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">500+</div>
                <p className="text-sm text-muted-foreground">Colleges</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Weekly Highlights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  <span>This Week's Impact</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Notes Uploaded</span>
                    <span className="font-bold text-primary">300+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Books Sold</span>
                    <span className="font-bold text-primary">200+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">PGs Reviewed</span>
                    <span className="font-bold text-primary">50+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Jobs Applied</span>
                    <span className="font-bold text-primary">120+</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-primary" />
                  <span>Top Students</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "Priya Sharma", points: 2450, badge: "🥇" },
                    { name: "Rahul Kumar", points: 2180, badge: "🥈" },
                    { name: "Anita Singh", points: 1950, badge: "🥉" },
                  ].map((student, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{student.badge}</span>
                        <span className="font-medium">{student.name}</span>
                      </div>
                      <span className="text-sm text-primary font-bold">{student.points} pts</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Community CTA */}
            <Card className="bg-primary text-primary-foreground">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>Join Your Community</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4 opacity-90">
                  Connect with students from your college for discussions, Q&A, and more.
                </p>
                <Button variant="secondary" className="w-full">
                  Join College Community
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      

      {/* Corner Overlay Ad (image/video supported) */}
      <CornerAd
        href="/deals"
        media={{ type: "image", src: "/abstract-geometric-shapes.png", alt: "Student Deals" }}
        responsive
      />
      {/* Floating Leads / Talk-to-Us widget */}
      <LeadsWidget />
    </div>
  )
}
