"use client"

import { useState } from "react"
import { Search, Gift, Calendar, Filter, Tag, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const studentDeals = [
  {
    id: 1,
    title: "Zomato 20% Off for Students",
    company: "Zomato",
    logo: "/zomato-logo.png",
    discount: "20% OFF",
    description: "Get 20% off on your food orders. Valid on orders above ₹200.",
    validTill: "30 December 2025",
    category: "Food & Dining",
    code: "STUDENT20",
    terms: "Valid for verified students only. Maximum discount ₹100.",
    featured: true,
  },
  {
    id: 2,
    title: "Swiggy Student Discount",
    company: "Swiggy",
    logo: "/swiggy-logo.png",
    discount: "25% OFF",
    description: "Special student pricing on food delivery with free delivery.",
    validTill: "31 December 2025",
    category: "Food & Dining",
    code: "SWIGGY25",
    terms: "Valid for orders above ₹150. Free delivery included.",
    featured: false,
  },
  {
    id: 3,
    title: "Amazon Prime Student",
    company: "Amazon",
    logo: "/amazon-logo.png",
    discount: "50% OFF",
    description: "Get Amazon Prime at student pricing with all benefits included.",
    validTill: "Ongoing",
    category: "Shopping & Entertainment",
    code: "PRIME50",
    terms: "Valid student ID required. Annual subscription.",
    featured: true,
  },
  {
    id: 4,
    title: "Netflix Student Plan",
    company: "Netflix",
    logo: "/netflix-logo.png",
    discount: "30% OFF",
    description: "Stream unlimited movies and shows at student rates.",
    validTill: "Ongoing",
    category: "Shopping & Entertainment",
    code: "NETFLIX30",
    terms: "Verification required. Mobile plan only.",
    featured: false,
  },
  {
    id: 5,
    title: "Myntra Campus Collection",
    company: "Myntra",
    logo: "/myntra-logo.png",
    discount: "40% OFF",
    description: "Exclusive student discounts on fashion and lifestyle products.",
    validTill: "15 January 2026",
    category: "Shopping & Entertainment",
    code: "CAMPUS40",
    terms: "Valid on select brands. Minimum purchase ₹999.",
    featured: false,
  },
  {
    id: 6,
    title: "Uber Student Rides",
    company: "Uber",
    logo: "/uber-logo.png",
    discount: "15% OFF",
    description: "Save on your daily commute with student ride discounts.",
    validTill: "28 February 2026",
    category: "Transportation",
    code: "UBERSTU15",
    terms: "Valid for verified students. Maximum 5 rides per month.",
    featured: false,
  },
  {
    id: 7,
    title: "BookMyShow Student Offers",
    company: "BookMyShow",
    logo: "/bookmyshow-logo.png",
    discount: "₹100 OFF",
    description: "Flat ₹100 off on movie tickets for students.",
    validTill: "31 March 2026",
    category: "Shopping & Entertainment",
    code: "BMS100",
    terms: "Valid on weekdays only. Student ID required.",
    featured: false,
  },
  {
    id: 8,
    title: "Domino's Student Special",
    company: "Domino's",
    logo: "/dominos-logo.png",
    discount: "Buy 1 Get 1",
    description: "Buy 1 Get 1 Free on medium pizzas for students.",
    validTill: "20 January 2026",
    category: "Food & Dining",
    code: "DOMSTU1",
    terms: "Valid on medium pizzas only. Dine-in and takeaway.",
    featured: true,
  },
]

export default function DealsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showFeatured, setShowFeatured] = useState(false)

  const filteredDeals = studentDeals.filter((deal) => {
    const matchesSearch =
      deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deal.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || deal.category === selectedCategory
    const matchesFeatured = !showFeatured || deal.featured

    return matchesSearch && matchesCategory && matchesFeatured
  })

  const handleGetCode = (deal: (typeof studentDeals)[0]) => {
    // In a real app, this would handle code revelation/copying
    navigator.clipboard.writeText(deal.code)
    alert(`Code ${deal.code} copied to clipboard!`)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary/5 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Student Deals & Discounts</h1>
              <p className="text-muted-foreground">Exclusive offers and discounts for verified students</p>
            </div>
            <Badge variant="secondary" className="text-sm">
              Coming in Phase 2
            </Badge>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search deals, brands..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Food & Dining">Food & Dining</SelectItem>
                <SelectItem value="Shopping & Entertainment">Shopping & Entertainment</SelectItem>
                <SelectItem value="Transportation">Transportation</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={showFeatured ? "default" : "outline"}
              onClick={() => setShowFeatured(!showFeatured)}
              className="w-full"
            >
              <Tag className="w-4 h-4 mr-2" />
              Featured Only
            </Button>
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {filteredDeals.length} of {studentDeals.length} deals
          </p>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDeals.map((deal) => (
            <Card
              key={deal.id}
              className={`hover:shadow-lg transition-shadow ${deal.featured ? "ring-2 ring-primary/20" : ""}`}
            >
              {deal.featured && (
                <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-t-lg text-center">
                  Featured Deal
                </div>
              )}

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

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{deal.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    Valid till {deal.validTill}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {deal.category}
                  </Badge>
                </div>

                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-2">Terms & Conditions:</p>
                  <p className="text-xs">{deal.terms}</p>
                </div>

                <Button className="w-full" onClick={() => handleGetCode(deal)}>
                  <Percent className="w-4 h-4 mr-2" />
                  Get Code
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDeals.length === 0 && (
          <div className="text-center py-12">
            <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No deals found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        )}

        {/* How it Works Section */}
        <div className="mt-16 bg-primary/5 rounded-lg p-8">
          <h3 className="text-2xl font-bold text-foreground mb-6 text-center">How Student Deals Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold">1</span>
              </div>
              <h4 className="font-semibold mb-2">Verify Student Status</h4>
              <p className="text-sm text-muted-foreground">Upload your student ID or use your .edu email to verify</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold">2</span>
              </div>
              <h4 className="font-semibold mb-2">Browse & Select</h4>
              <p className="text-sm text-muted-foreground">Choose from hundreds of exclusive student deals</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-primary-foreground font-bold">3</span>
              </div>
              <h4 className="font-semibold mb-2">Get Code & Save</h4>
              <p className="text-sm text-muted-foreground">Copy the code and enjoy instant savings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
