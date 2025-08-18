"use client"

import { useState } from "react"
import { Search, Filter, BookOpen, Star, Heart, Grid, List, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

const mockBooks = [
  {
    id: 1,
    title: "Introduction to Algorithms",
    author: "Thomas H. Cormen",
    price: 899,
    originalPrice: 1200,
    condition: "Good",
    subject: "Computer Science",
    seller: {
      name: "Amit Kumar",
      rating: 4.8,
      totalSales: 23,
      location: "Delhi University",
    },
    images: ["/algorithms-textbook.png"],
    description: "Classic algorithms textbook in good condition. Some highlighting but all pages intact.",
    postedDate: "2024-01-15",
    isbn: "978-0262033848",
    edition: "3rd Edition",
    language: "English",
    tags: ["Algorithms", "Data Structures", "Computer Science"],
  },
  {
    id: 2,
    title: "Operating System Concepts",
    author: "Abraham Silberschatz",
    price: 650,
    originalPrice: 950,
    condition: "Excellent",
    subject: "Computer Science",
    seller: {
      name: "Neha Reddy",
      rating: 4.9,
      totalSales: 31,
      location: "IIT Delhi",
    },
    images: ["/placeholder-rixpp.png"],
    description: "Like new condition. Barely used, no markings or damage.",
    postedDate: "2024-01-12",
    isbn: "978-1118063330",
    edition: "10th Edition",
    language: "English",
    tags: ["Operating Systems", "Computer Science"],
  },
  {
    id: 3,
    title: "Organic Chemistry",
    author: "Paula Yurkanis Bruice",
    price: 750,
    originalPrice: 1100,
    condition: "Good",
    subject: "Chemistry",
    seller: {
      name: "Rohit Singh",
      rating: 4.6,
      totalSales: 18,
      location: "Mumbai University",
    },
    images: ["/placeholder-zhp4n.png"],
    description: "Well-maintained chemistry textbook. Some notes in margins but very readable.",
    postedDate: "2024-01-10",
    isbn: "978-0321803221",
    edition: "7th Edition",
    language: "English",
    tags: ["Chemistry", "Organic Chemistry"],
  },
  {
    id: 4,
    title: "Principles of Economics",
    author: "N. Gregory Mankiw",
    price: 550,
    originalPrice: 800,
    condition: "Fair",
    subject: "Economics",
    seller: {
      name: "Kavya Mehta",
      rating: 4.3,
      totalSales: 12,
      location: "LSR College",
    },
    images: ["/placeholder-cnh45.png"],
    description: "Good for reference. Some wear and tear but content is complete.",
    postedDate: "2024-01-08",
    isbn: "978-1285165875",
    edition: "7th Edition",
    language: "English",
    tags: ["Economics", "Microeconomics", "Macroeconomics"],
  },
  {
    id: 5,
    title: "Digital Electronics",
    author: "Morris Mano",
    price: 480,
    originalPrice: 720,
    condition: "Good",
    subject: "Electronics",
    seller: {
      name: "Arjun Patel",
      rating: 4.7,
      totalSales: 25,
      location: "NIT Warangal",
    },
    images: ["/placeholder-prake.png"],
    description: "Standard electronics textbook. Clean pages with minimal highlighting.",
    postedDate: "2024-01-05",
    isbn: "978-0132145220",
    edition: "5th Edition",
    language: "English",
    tags: ["Electronics", "Digital Systems"],
  },
  {
    id: 6,
    title: "Calculus: Early Transcendentals",
    author: "James Stewart",
    price: 720,
    originalPrice: 1050,
    condition: "Excellent",
    subject: "Mathematics",
    seller: {
      name: "Priya Sharma",
      rating: 4.9,
      totalSales: 28,
      location: "Delhi University",
    },
    images: ["/calculus-textbook.png"],
    description: "Excellent condition mathematics textbook. Perfect for engineering students.",
    postedDate: "2024-01-03",
    isbn: "978-1285741550",
    edition: "8th Edition",
    language: "English",
    tags: ["Mathematics", "Calculus", "Engineering"],
  },
]

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedCondition, setSelectedCondition] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 1500])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("recent")
  const [showFilters, setShowFilters] = useState(false)

  const subjects = [
    "all",
    "Computer Science",
    "Chemistry",
    "Economics",
    "Electronics",
    "Mathematics",
    "Physics",
    "Biology",
  ]
  const conditions = ["all", "Excellent", "Good", "Fair"]

  const filteredBooks = mockBooks.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSubject = selectedSubject === "all" || book.subject === selectedSubject
    const matchesCondition = selectedCondition === "all" || book.condition === selectedCondition
    const matchesPrice = book.price >= priceRange[0] && book.price <= priceRange[1]

    return matchesSearch && matchesSubject && matchesCondition && matchesPrice
  })

  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.seller.rating - a.seller.rating
      case "recent":
      default:
        return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
    }
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Used Books Marketplace</h1>
              <p className="text-muted-foreground">Quality textbooks at student-friendly prices</p>
            </div>
            <Link href="/books/sell">
              <Button className="bg-primary hover:bg-primary/90">Sell Your Book</Button>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search books, authors, or subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recently Added</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Top Rated Sellers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className={`w-80 space-y-6 ${showFilters ? "block" : "hidden lg:block"}`}>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Subject Filter */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Subject</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((subject) => (
                        <SelectItem key={subject} value={subject}>
                          {subject === "all" ? "All Subjects" : subject}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Condition Filter */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Condition</Label>
                  <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map((condition) => (
                        <SelectItem key={condition} value={condition}>
                          {condition === "all" ? "All Conditions" : condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                  </Label>
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={1500}
                    min={0}
                    step={50}
                    className="w-full"
                  />
                </div>

                {/* Quick Filters */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Quick Filters</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="excellent" />
                      <Label htmlFor="excellent" className="text-sm">
                        Excellent Condition Only
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="nearby" />
                      <Label htmlFor="nearby" className="text-sm">
                        Nearby Sellers
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="verified" />
                      <Label htmlFor="verified" className="text-sm">
                        Verified Sellers
                      </Label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* View Controls */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">Showing {sortedBooks.length} books</p>
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Books Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedBooks.map((book) => (
                  <Link key={book.id} href={`/books/${book.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <div className="aspect-[3/4] bg-muted rounded-t-lg relative overflow-hidden">
                        <img
                          src={book.images[0] || "/placeholder.svg"}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Button variant="ghost" size="sm" className="bg-background/80 hover:bg-background">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="absolute top-2 left-2">
                          <Badge variant={book.condition === "Excellent" ? "default" : "secondary"}>
                            {book.condition}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-sm mb-1 line-clamp-2">{book.title}</h3>
                        <p className="text-xs text-muted-foreground mb-2">by {book.author}</p>

                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-primary">₹{book.price}</span>
                            <span className="text-xs text-muted-foreground line-through">₹{book.originalPrice}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {book.subject}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span>{book.seller.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{book.seller.location}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedBooks.map((book) => (
                  <Link key={book.id} href={`/books/${book.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="w-24 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={book.images[0] || "/placeholder.svg"}
                              alt={book.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h3 className="text-lg font-semibold mb-1">{book.title}</h3>
                                <p className="text-sm text-muted-foreground mb-2">by {book.author}</p>
                                <div className="flex gap-2 mb-2">
                                  <Badge variant="outline">{book.subject}</Badge>
                                  <Badge variant={book.condition === "Excellent" ? "default" : "secondary"}>
                                    {book.condition}
                                  </Badge>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-xl font-bold text-primary">₹{book.price}</span>
                                  <span className="text-sm text-muted-foreground line-through">
                                    ₹{book.originalPrice}
                                  </span>
                                </div>
                                <Button variant="ghost" size="sm">
                                  <Heart className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{book.description}</p>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span>
                                    {book.seller.rating} • {book.seller.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{book.seller.location}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                <span>Posted {new Date(book.postedDate).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {sortedBooks.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No books found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Label({ children, className, ...props }: any) {
  return (
    <label className={className} {...props}>
      {children}
    </label>
  )
}
