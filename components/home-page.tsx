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
import UpcomingExamsHome from "@/components/exams/UpcomingExamsHome"
import dynamic from "next/dynamic"
const AdsCarousel = dynamic(() => import("@/components/ads/AdsCarousel"), {
  ssr: false,
  loading: () => <div className="w-full max-w-6xl h-[180px] sm:h-[240px] md:h-[300px] rounded-2xl border border-border animate-pulse bg-muted" />,
})
const CornerAd = dynamic(() => import("@/components/ads/CornerAd"), { ssr: false })

export default function HomePage() {
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

  // Auto-scroll the books row and loop seamlessly
  useEffect(() => {
    let raf = 0
    const speed = 0.6 // pixels per frame
    const step = () => {
      const el = booksCarouselRef.current
      if (el && !booksPaused) {
        el.scrollLeft += speed
        // Loop when we've scrolled through first set
        const half = el.scrollWidth / 2
        if (el.scrollLeft >= half) {
          // Seamless loop: shift back by half, maintaining visual continuity
          el.scrollLeft -= half
        }
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
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
          <img
            src="/student-life-illustration.png"
            alt="Student life illustration"
            className="w-full h-full object-cover opacity-5"
          />
        </div>
      </section>

      {/* Ad: Hero Ad Carousel (images/videos supported) */}
      <section className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AdsCarousel
            showDots
            slides={[
              { id: "home_h1", format: "hero", img: "/abstract-geometric-shapes.png", href: "/resources" },
              { id: "home_h2", format: "hero", img: "/algorithms-textbook.png", href: "/exams" },
              { id: "home_h3", format: "hero", img: "/calculus-textbook.png", href: "/resources" },
              { id: "home_h4", format: "hero", img: "/algorithms-textbook-pages.png", href: "/schemes" },
            ]}
          />
        </div>
      </section>

      {/* Upcoming Exams Strip */}
      <UpcomingExamsHome />

      {/* Ad: Hero Ad Carousel below Upcoming Exams */}
      <section className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <AdsCarousel
            showDots
            slides={[
              { id: "home_h5", format: "hero", img: "/abstract-geometric-shapes.png", href: "#deals" },
              { id: "home_h6", format: "hero", img: "/algorithms-textbook-pages.png", href: "/hostels/list" },
              { id: "home_h7", format: "hero", img: "/student-avatar.png", href: "/notes/upload" },
            ]}
          />
        </div>
      </section>

      {/* Tiffin Services Section */}
      <section id="tiffin" className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">🍱 Tiffin Services</h2>
              <p className="text-muted-foreground">Home-cooked meals and affordable plans near your campus</p>
            </div>
            <div className="flex items-center gap-3">
              <Link href="/tiffin">
                <Button variant="outline">View All</Button>
              </Link>
              <Link href="/tiffin/submit">
                <Button className="bg-primary hover:bg-primary/90">List Your Tiffin</Button>
              </Link>
            </div>
          </div>

          {/* Quick Filters */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Diet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="veg">Vegetarian</SelectItem>
                <SelectItem value="nonveg">Non-Veg</SelectItem>
                <SelectItem value="jain">Jain</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="distance">
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Closest First</SelectItem>
                <SelectItem value="price">Price: Low to High</SelectItem>
                <SelectItem value="rating">Rating: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { id: "maas-kitchen", name: "Maa's Kitchen", diet: "Veg", price: 80, rating: 4.7, distanceKm: 0.6, phone: "+919000011111" },
              { id: "healthy-bites", name: "Healthy Bites", diet: "Veg/Jain", price: 95, rating: 4.5, distanceKm: 1.1, phone: "+919000022222" },
              { id: "spicebox", name: "SpiceBox", diet: "Veg/Non-Veg", price: 110, rating: 4.6, distanceKm: 0.9, phone: "+919000033333" },
            ].map((svc) => {
              const waMsg = encodeURIComponent(`Hi, I'm interested in ${svc.name} tiffin service.`)
              const wa = `https://wa.me/${svc.phone.replace(/[^0-9]/g, "")}?text=${waMsg}`
              return (
                <Card key={svc.id} className="hover:shadow-lg transition-shadow">
                  <Link href={`/tiffin/${svc.id}`}>
                    <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                      <Utensils className="w-10 h-10 text-muted-foreground" />
                    </div>
                  </Link>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link href={`/tiffin/${svc.id}`} className="font-semibold hover:underline">{svc.name}</Link>
                        <p className="text-xs text-muted-foreground">{svc.diet}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{svc.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-primary">₹{svc.price}/meal</span>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{svc.distanceKm} km</span>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Link href={`/tiffin/${svc.id}?plan=trial`}><Button size="sm" variant="outline" className="bg-transparent">Try 1-Day</Button></Link>
                      <Link href={`/tiffin/${svc.id}?plan=weekly`}><Button size="sm">Subscribe Weekly</Button></Link>
                      <a href={wa} target="_blank" rel="noopener noreferrer" className="ml-auto">
                        <Button size="sm" variant="outline" className="bg-transparent"><Phone className="w-4 h-4 mr-2" /> WhatsApp</Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Jobs/Internships Section */}
      <section id="jobs" className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">💼 Jobs/Internships</h2>
              <p className="text-muted-foreground">Opportunities that fit your student schedule</p>
            </div>
            <Link href="/jobs">
              <Button className="bg-primary hover:bg-primary/90">View All Jobs</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Content Writer",
                company: "TechStart Solutions",
                type: "Part-time",
                location: "Work from home • 10-15 hrs/week",
                salary: "₹8,000 - ₹12,000/month",
                postedDate: "3 days ago",
              },
              {
                title: "Frontend Developer Intern",
                company: "InnovateTech",
                type: "Internship",
                location: "Bangalore • Hybrid",
                salary: "₹15,000 - ₹20,000/month",
                postedDate: "1 day ago",
              },
              {
                title: "Social Media Manager",
                company: "CreativeHub",
                type: "Part-time",
                location: "Remote • Flexible hours",
                salary: "₹12,000 - ₹18,000/month",
                postedDate: "2 days ago",
              },
            ].map((job, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription className="font-medium">{job.company}</CardDescription>
                    </div>
                    <Badge variant={job.type === "Internship" ? "default" : "secondary"}>{job.type}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-sm font-medium text-primary">
                      <Briefcase className="w-4 h-4 mr-2" />
                      {job.salary}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Posted {job.postedDate}</span>
                    <Button size="sm">Apply</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Student Deals & Discounts Section */}
      <section id="deals" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">🎁 Student Deals & Discounts</h2>
              <p className="text-muted-foreground">Exclusive offers for verified students</p>
              <Badge variant="secondary" className="mt-2">
                Coming in Phase 2
              </Badge>
            </div>
            <Link href="/deals">
              <Button className="bg-primary hover:bg-primary/90">View All Deals</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Zomato 20% Off for Students",
                company: "Zomato",
                discount: "20% OFF",
                validTill: "30 December 2025",
                category: "Food & Dining",
              },
              {
                title: "Amazon Prime Student",
                company: "Amazon",
                discount: "50% OFF",
                validTill: "Ongoing",
                category: "Shopping",
              },
              {
                title: "Domino's Student Special",
                company: "Domino's",
                discount: "Buy 1 Get 1",
                validTill: "20 January 2026",
                category: "Food & Dining",
              },
            ].map((deal, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Gift className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{deal.title}</CardTitle>
                        <CardDescription className="font-medium">{deal.company}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {deal.discount}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Gift className="w-4 h-4 mr-2" />
                      {deal.category}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <span>Valid till {deal.validTill}</span>
                    </div>
                  </div>

                  <Button size="sm" className="w-full">
                    Get Code
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Notes Section */}
      <section id="notes" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">📚 Recently Uploaded Notes by Students</h2>
              <p className="text-muted-foreground">Fresh notes from your fellow students</p>
            </div>
            <Link href="/notes">
              <Button variant="outline">
                See All Notes
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="computer-science">Computer Science</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="College" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Colleges</SelectItem>
                  <SelectItem value="iit">IIT</SelectItem>
                  <SelectItem value="nit">NIT</SelectItem>
                  <SelectItem value="iiit">IIIT</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Semesters</SelectItem>
                  <SelectItem value="1">Semester 1</SelectItem>
                  <SelectItem value="2">Semester 2</SelectItem>
                  <SelectItem value="3">Semester 3</SelectItem>
                  <SelectItem value="4">Semester 4</SelectItem>
                  <SelectItem value="5">Semester 5</SelectItem>
                  <SelectItem value="6">Semester 6</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="all">
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Formats</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="doc">DOC</SelectItem>
                  <SelectItem value="ppt">PPT</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="text-primary bg-transparent">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {[
              {
                subject: "Computer Science",
                semester: "Semester 1",
                title: "Data Structures & Algorithms",
                author: "Ankit S.",
                authorBadge: "Top Contributor",
                uploaded: "2 days ago",
                verified: true,
                views: 145,
                downloads: 45,
                rating: 4.8,
                college: "Prof. Gupta",
              },
              {
                subject: "Computer Science",
                semester: "Semester 2",
                title: "Data Structures & Algorithms",
                author: "Ankit S.",
                authorBadge: null,
                uploaded: "2 days ago",
                verified: true,
                views: 170,
                downloads: 55,
                rating: 4.9,
                college: "Prof. Gupta",
              },
              {
                subject: "Computer Science",
                semester: "Semester 3",
                title: "Data Structures & Algorithms",
                author: "Ankit S.",
                authorBadge: null,
                uploaded: "2 days ago",
                verified: false,
                views: 195,
                downloads: 65,
                rating: 4.7,
                college: "Prof. Gupta",
              },
              {
                subject: "Computer Science",
                semester: "Semester 4",
                title: "Data Structures & Algorithms",
                author: "Ankit S.",
                authorBadge: null,
                uploaded: "2 days ago",
                verified: true,
                views: 220,
                downloads: 75,
                rating: 4.8,
                college: "Prof. Gupta",
              },
              {
                subject: "Computer Science",
                semester: "Semester 5",
                title: "Data Structures & Algorithms",
                author: "Ankit S.",
                authorBadge: null,
                uploaded: "2 days ago",
                verified: true,
                views: 245,
                downloads: 85,
                rating: 4.9,
                college: "Prof. Gupta",
              },
            ].map((note, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      {note.subject}
                    </Badge>
                    {note.verified && <CheckCircle className="w-4 h-4 text-green-600" />}
                  </div>
                  <Badge variant="outline" className="w-fit text-xs">
                    {note.semester}
                  </Badge>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{note.title}</h3>
                    <div className="flex items-center text-xs text-muted-foreground mb-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      Uploaded {note.uploaded}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mb-2">
                      <Building className="w-3 h-3 mr-1" />
                      Verified by {note.college}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-3 h-3" />
                        <span>{note.views} views</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Download className="w-3 h-3" />
                        <span>{note.downloads} downloads</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 bg-purple-200 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-purple-800">{note.author.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="text-xs font-medium">{note.author}</p>
                        {note.authorBadge && (
                          <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                            {note.authorBadge}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <Button size="sm" variant="outline" className="text-xs bg-transparent">
                      View Notes
                    </Button>
                    <Button size="sm" className="text-xs">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Top Contributors */}
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-primary" />
                <span>Top Contributors This Week</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {["Priya S.", "Rahul K.", "Anita S.", "Vikash M.", "Sneha P."].map((name, index) => (
                  <Badge key={index} variant="secondary" className="bg-primary/10 text-primary">
                    #{index + 1} {name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Used Books Section */}
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
                  <div className="bg-muted rounded-t-lg h-40 sm:h-44 lg:h-48">
                    <img
                      src={`/abstract-geometric-shapes.png?height=220&width=180&query=${book.title} textbook cover`}
                      alt={book.title}
                      className="w-full h-full object-cover rounded-t-lg"
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
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{book.rating}</span>
                      </div>
                      <span className="text-muted-foreground">by {book.seller}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PG/Hostel Finder Section */}
      <section id="hostels" className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">🏠 PG/Hostel Finder</h2>
              <p className="text-muted-foreground">Find your perfect home away from home</p>
            </div>
            <Link href="/hostels">
              <Button variant="outline">View All Properties</Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {[
              {
                name: "Green Valley PG",
                price: "₹8,500/month",
                rating: 4.7,
                distance: "0.5 km",
                features: ["WiFi", "Food", "AC"],
              },
              {
                name: "Student Paradise",
                price: "₹7,200/month",
                rating: 4.5,
                distance: "1.2 km",
                features: ["WiFi", "Food", "Gym"],
              },
              {
                name: "Campus Heights",
                price: "₹9,800/month",
                rating: 4.8,
                distance: "0.8 km",
                features: ["WiFi", "Food", "AC", "Laundry"],
              },
            ].map((hostel, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <div className="aspect-video bg-muted rounded-t-lg">
                  <img
                    src={`/abstract-geometric-shapes.png?height=200&width=350&query=${hostel.name} hostel building exterior`}
                    alt={hostel.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{hostel.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{hostel.rating}</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-lg font-bold text-primary">{hostel.price}</span>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{hostel.distance}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {hostel.features.map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
    </div>
  )
}
