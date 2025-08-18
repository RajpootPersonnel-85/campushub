"use client"

import { useState } from "react"
import { Search, Home, Star, MapPin, Wifi, Car, Utensils, Dumbbell, Grid, List, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Link from "next/link"

const mockHostels = [
  {
    id: 1,
    name: "Green Valley PG",
    type: "PG",
    price: 8500,
    location: "Lajpat Nagar, Delhi",
    distance: "0.5 km from DU",
    rating: 4.7,
    reviews: 89,
    images: ["/placeholder.svg?key=hostel1"],
    amenities: ["WiFi", "Food", "AC", "Laundry", "Security"],
    gender: "Boys",
    description: "Modern PG with all amenities near Delhi University. Clean rooms with attached bathrooms.",
    owner: {
      name: "Rajesh Kumar",
      phone: "+91 98765 43210",
      verified: true,
    },
    roomTypes: [
      { type: "Single", price: 8500, available: 2 },
      { type: "Double", price: 6500, available: 5 },
      { type: "Triple", price: 5500, available: 3 },
    ],
  },
  {
    id: 2,
    name: "Student Paradise",
    type: "Hostel",
    price: 7200,
    location: "Kamla Nagar, Delhi",
    distance: "1.2 km from DU",
    rating: 4.5,
    reviews: 156,
    images: ["/placeholder.svg?key=hostel2"],
    amenities: ["WiFi", "Food", "Gym", "Study Room", "Security"],
    gender: "Girls",
    description: "Safe and comfortable hostel for girls with 24/7 security and home-like environment.",
    owner: {
      name: "Sunita Sharma",
      phone: "+91 98765 43211",
      verified: true,
    },
    roomTypes: [
      { type: "Single", price: 7200, available: 1 },
      { type: "Double", price: 5800, available: 4 },
      { type: "Triple", price: 4800, available: 6 },
    ],
  },
  {
    id: 3,
    name: "Campus Heights",
    type: "PG",
    price: 9800,
    location: "Mukherjee Nagar, Delhi",
    distance: "0.8 km from DU",
    rating: 4.8,
    reviews: 203,
    images: ["/placeholder.svg?key=hostel3"],
    amenities: ["WiFi", "Food", "AC", "Laundry", "Parking", "Security"],
    gender: "Co-ed",
    description: "Premium PG accommodation with modern facilities and excellent food quality.",
    owner: {
      name: "Amit Gupta",
      phone: "+91 98765 43212",
      verified: true,
    },
    roomTypes: [
      { type: "Single", price: 9800, available: 3 },
      { type: "Double", price: 7800, available: 2 },
    ],
  },
  {
    id: 4,
    name: "Scholar's Den",
    type: "Hostel",
    price: 6500,
    location: "Civil Lines, Delhi",
    distance: "2.1 km from DU",
    rating: 4.3,
    reviews: 78,
    images: ["/placeholder.svg?key=hostel4"],
    amenities: ["WiFi", "Food", "Study Room", "Library", "Security"],
    gender: "Boys",
    description: "Budget-friendly hostel with focus on studies. Quiet environment perfect for serious students.",
    owner: {
      name: "Dr. Vinod Singh",
      phone: "+91 98765 43213",
      verified: true,
    },
    roomTypes: [
      { type: "Double", price: 6500, available: 8 },
      { type: "Triple", price: 5200, available: 12 },
    ],
  },
  {
    id: 5,
    name: "Royal Residency",
    type: "PG",
    price: 11000,
    location: "Karol Bagh, Delhi",
    distance: "3.5 km from DU",
    rating: 4.9,
    reviews: 145,
    images: ["/placeholder.svg?key=hostel5"],
    amenities: ["WiFi", "Food", "AC", "Laundry", "Gym", "Parking", "Security"],
    gender: "Girls",
    description: "Luxury PG with premium amenities and excellent service. Perfect for those who want comfort.",
    owner: {
      name: "Priya Malhotra",
      phone: "+91 98765 43214",
      verified: true,
    },
    roomTypes: [
      { type: "Single", price: 11000, available: 1 },
      { type: "Double", price: 8500, available: 3 },
    ],
  },
  {
    id: 6,
    name: "Unity Boys Hostel",
    type: "Hostel",
    price: 5800,
    location: "Shakti Nagar, Delhi",
    distance: "1.8 km from DU",
    rating: 4.1,
    reviews: 92,
    images: ["/placeholder.svg?key=hostel6"],
    amenities: ["WiFi", "Food", "Common Room", "Security"],
    gender: "Boys",
    description: "Affordable hostel with basic amenities. Good for budget-conscious students.",
    owner: {
      name: "Mohan Lal",
      phone: "+91 98765 43215",
      verified: false,
    },
    roomTypes: [
      { type: "Double", price: 5800, available: 6 },
      { type: "Triple", price: 4500, available: 10 },
    ],
  },
]

const amenityIcons = {
  WiFi: Wifi,
  Food: Utensils,
  AC: Home,
  Gym: Dumbbell,
  Parking: Car,
  Laundry: Home,
  Security: Home,
  "Study Room": Home,
  Library: Home,
  "Common Room": Home,
}

export default function HostelsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedGender, setSelectedGender] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 15000])
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("rating")
  const [showFilters, setShowFilters] = useState(false)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [ratingRange, setRatingRange] = useState([0])
  const [distanceRange, setDistanceRange] = useState([0])
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [girlsOnly, setGirlsOnly] = useState(false)
  const [boysOnly, setBoysOnly] = useState(false)
  const [foodIncluded, setFoodIncluded] = useState(false)

  const locations = [
    "all",
    "Lajpat Nagar",
    "Kamla Nagar",
    "Mukherjee Nagar",
    "Civil Lines",
    "Karol Bagh",
    "Shakti Nagar",
  ]
  const types = ["all", "PG", "Hostel"]
  const genders = ["all", "Boys", "Girls", "Co-ed"]
  const allAmenities = ["WiFi", "Food", "AC", "Gym", "Parking", "Laundry", "Security", "Study Room", "Library"]

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities([...selectedAmenities, amenity])
    } else {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity))
    }
  }

  const filteredHostels = mockHostels.filter((hostel) => {
    const matchesSearch =
      hostel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      hostel.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesLocation = selectedLocation === "all" || hostel.location.includes(selectedLocation)
    const matchesType = selectedType === "all" || hostel.type === selectedType
    const matchesGender = selectedGender === "all" || hostel.gender === selectedGender || hostel.gender === "Co-ed"
    const matchesPrice = hostel.price >= priceRange[0] && hostel.price <= priceRange[1]
    const matchesAmenities =
      selectedAmenities.length === 0 || selectedAmenities.every((amenity) => hostel.amenities.includes(amenity))
    const matchesRating = ratingRange[0] === 0 || hostel.rating >= ratingRange[0]
    const matchesDistance = distanceRange[0] === 0 || Number.parseFloat(hostel.distance) <= distanceRange[0]
    const matchesVerified = !verifiedOnly || hostel.owner.verified
    const matchesGirlsOnly = !girlsOnly || hostel.gender === "Girls" || hostel.gender === "Co-ed"
    const matchesBoysOnly = !boysOnly || hostel.gender === "Boys" || hostel.gender === "Co-ed"
    const matchesFoodIncluded = !foodIncluded || hostel.amenities.includes("Food")

    return (
      matchesSearch &&
      matchesLocation &&
      matchesType &&
      matchesGender &&
      matchesPrice &&
      matchesAmenities &&
      matchesRating &&
      matchesDistance &&
      matchesVerified &&
      matchesGirlsOnly &&
      matchesBoysOnly &&
      matchesFoodIncluded
    )
  })

  const sortedHostels = [...filteredHostels].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "distance":
        return Number.parseFloat(a.distance) - Number.parseFloat(b.distance)
      case "rating":
      default:
        return b.rating - a.rating
    }
  })

  const clearAllFilters = () => {
    setSelectedLocation("all")
    setSelectedType("all")
    setSelectedGender("all")
    setPriceRange([0, 15000])
    setSelectedAmenities([])
    setRatingRange([0])
    setDistanceRange([0])
    setVerifiedOnly(false)
    setGirlsOnly(false)
    setBoysOnly(false)
    setFoodIncluded(false)
    setActiveFilters([])
    setSearchQuery("")
  }

  const updateActiveFilters = () => {
    const filters: string[] = []
    if (selectedLocation !== "all") filters.push(`Location: ${selectedLocation}`)
    if (selectedType !== "all") filters.push(`Type: ${selectedType}`)
    if (selectedGender !== "all") filters.push(`Gender: ${selectedGender}`)
    if (priceRange[0] > 0 || priceRange[1] < 15000) filters.push(`Price: ₹${priceRange[0]}-₹${priceRange[1]}`)
    if (selectedAmenities.length > 0) filters.push(`Amenities: ${selectedAmenities.length} selected`)
    if (ratingRange[0] > 0) filters.push(`Rating: ${ratingRange[0]}+`)
    if (distanceRange[0] > 0) filters.push(`Distance: ${distanceRange[0]}km`)
    if (verifiedOnly) filters.push("Verified Only")
    if (girlsOnly) filters.push("Girls Only")
    if (boysOnly) filters.push("Boys Only")
    if (foodIncluded) filters.push("Food Included")
    setActiveFilters(filters)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">PG & Hostel Finder</h1>
              <p className="text-muted-foreground">Find your perfect home away from home</p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" className="text-primary bg-transparent">
                <Home className="w-4 h-4 mr-2" />
                List Your PG
              </Button>
              <Button className="bg-primary hover:bg-primary/90">See All Hostels</Button>
            </div>
          </div>

          {/* Enhanced Search and Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search by name or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Button
                variant={girlsOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setGirlsOnly(!girlsOnly)}
                className="text-xs"
              >
                Girls Only
              </Button>
              <Button
                variant={boysOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setBoysOnly(!boysOnly)}
                className="text-xs"
              >
                Boys Only
              </Button>
              <Button
                variant={foodIncluded ? "default" : "outline"}
                size="sm"
                onClick={() => setFoodIncluded(!foodIncluded)}
                className="text-xs"
              >
                Food Included
              </Button>

              <Popover open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="text-primary bg-transparent">
                    <Filter className="w-4 h-4 mr-2" />
                    More Filters
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Advanced Filters</h4>
                      <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                        Clear All
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium">Minimum Rating</Label>
                        <Slider
                          value={ratingRange}
                          onValueChange={setRatingRange}
                          max={5}
                          min={0}
                          step={0.5}
                          className="mt-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>0</span>
                          <span>{ratingRange[0]} stars</span>
                          <span>5</span>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Maximum Distance (km)</Label>
                        <Slider
                          value={distanceRange}
                          onValueChange={setDistanceRange}
                          max={10}
                          min={0}
                          step={0.5}
                          className="mt-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>0</span>
                          <span>{distanceRange[0]}km</span>
                          <span>10km+</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox id="verified" checked={verifiedOnly} onCheckedChange={setVerifiedOnly} />
                        <Label htmlFor="verified" className="text-sm">
                          Verified owners only
                        </Label>
                      </div>
                    </div>

                    <Button
                      className="w-full"
                      onClick={() => {
                        updateActiveFilters()
                        setShowAdvancedFilters(false)
                      }}
                    >
                      Apply Filters
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="distance">Nearest First</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {activeFilters.map((filter, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {filter}
                  <X className="w-3 h-3 ml-1 cursor-pointer" onClick={clearAllFilters} />
                </Badge>
              ))}
            </div>
          )}
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
                {/* Location Filter */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Location</Label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location === "all" ? "All Locations" : location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Type Filter */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Property Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {types.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type === "all" ? "All Types" : type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Gender Filter */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Gender Preference</Label>
                  <Select value={selectedGender} onValueChange={setSelectedGender}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {genders.map((gender) => (
                        <SelectItem key={gender} value={gender}>
                          {gender === "all" ? "All" : gender}
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
                    max={15000}
                    min={0}
                    step={500}
                    className="w-full"
                  />
                </div>

                {/* Amenities Filter */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Amenities</Label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {allAmenities.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity}
                          checked={selectedAmenities.includes(amenity)}
                          onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                        />
                        <Label htmlFor={amenity} className="text-sm">
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* View Controls */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">Showing {sortedHostels.length} properties</p>
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

            {/* Hostels Grid/List */}
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedHostels.map((hostel) => (
                  <Link key={hostel.id} href={`/hostels/${hostel.id}`}>
                    <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                      <div className="aspect-video bg-muted rounded-t-lg relative overflow-hidden">
                        <img
                          src={hostel.images[0] || "/placeholder.svg"}
                          alt={hostel.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2">
                          <Badge variant="secondary">{hostel.type}</Badge>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge variant={hostel.gender === "Co-ed" ? "default" : "outline"}>{hostel.gender}</Badge>
                        </div>
                        {hostel.owner.verified && (
                          <div className="absolute bottom-2 left-2">
                            <Badge variant="default" className="bg-green-600 text-white text-xs">
                              Verified
                            </Badge>
                          </div>
                        )}
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-lg">{hostel.name}</h3>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{hostel.rating}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>{hostel.location}</span>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{hostel.description}</p>

                        <div className="flex flex-wrap gap-1 mb-3">
                          {hostel.amenities.slice(0, 4).map((amenity, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {hostel.amenities.length > 4 && (
                            <Badge variant="secondary" className="text-xs">
                              +{hostel.amenities.length - 4}
                            </Badge>
                          )}
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-xl font-bold text-primary">₹{hostel.price}</span>
                            <span className="text-sm text-muted-foreground">/month</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{hostel.distance}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {sortedHostels.map((hostel) => (
                  <Link key={hostel.id} href={`/hostels/${hostel.id}`}>
                    <Card className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex gap-4">
                          <div className="w-48 h-32 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={hostel.images[0] || "/placeholder.svg"}
                              alt={hostel.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="flex gap-2 mb-2">
                                  <Badge variant="secondary">{hostel.type}</Badge>
                                  <Badge variant={hostel.gender === "Co-ed" ? "default" : "outline"}>
                                    {hostel.gender}
                                  </Badge>
                                  {hostel.owner.verified && (
                                    <Badge variant="default" className="bg-green-600 text-white text-xs">
                                      Verified
                                    </Badge>
                                  )}
                                </div>
                                <h3 className="text-xl font-semibold mb-1">{hostel.name}</h3>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                                  <MapPin className="w-4 h-4" />
                                  <span>
                                    {hostel.location} • {hostel.distance}
                                  </span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-1 mb-1">
                                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                  <span className="font-medium">{hostel.rating}</span>
                                  <span className="text-sm text-muted-foreground">({hostel.reviews})</span>
                                </div>
                                <div>
                                  <span className="text-2xl font-bold text-primary">₹{hostel.price}</span>
                                  <span className="text-sm text-muted-foreground">/month</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{hostel.description}</p>
                            <div className="flex flex-wrap gap-1">
                              {hostel.amenities.map((amenity, index) => (
                                <Badge key={index} variant="secondary" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {sortedHostels.length === 0 && (
              <div className="text-center py-12">
                <Home className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No properties found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
