"use client"

import { useState } from "react"
import {
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Share2,
  Heart,
  Shield,
  Wifi,
  Car,
  Utensils,
  Dumbbell,
  HomeIcon,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useParams } from "next/navigation"

// Mock data - in real app this would come from API
const mockHostel = {
  id: 1,
  name: "Green Valley PG",
  type: "PG",
  price: 8500,
  location: "Lajpat Nagar, Delhi",
  distance: "0.5 km from DU",
  rating: 4.7,
  reviews: 89,
  images: [
    "/placeholder.svg?key=hostel-main",
    "/placeholder.svg?key=hostel-room",
    "/placeholder.svg?key=hostel-common",
    "/placeholder.svg?key=hostel-kitchen",
  ],
  amenities: ["WiFi", "Food", "AC", "Laundry", "Security", "Parking"],
  gender: "Boys",
  description:
    "Modern PG with all amenities near Delhi University. Clean rooms with attached bathrooms, nutritious meals, and 24/7 security. Perfect for serious students who want a comfortable stay.",
  owner: {
    name: "Rajesh Kumar",
    avatar: "/placeholder.svg?key=owner",
    phone: "+91 98765 43210",
    email: "rajesh@greenvalleypg.com",
    verified: true,
    experience: "8 years",
    properties: 3,
  },
  roomTypes: [
    { type: "Single", price: 8500, available: 2, description: "Private room with attached bathroom" },
    { type: "Double", price: 6500, available: 5, description: "Shared room with 2 beds" },
    { type: "Triple", price: 5500, available: 3, description: "Shared room with 3 beds" },
  ],
  facilities: {
    "Room Features": ["Attached Bathroom", "Study Table", "Wardrobe", "Bed with Mattress"],
    "Common Areas": ["TV Lounge", "Dining Hall", "Kitchen Access", "Terrace"],
    Services: ["Daily Housekeeping", "Laundry Service", "Meal Service", "24/7 Security"],
    Connectivity: ["High Speed WiFi", "DTH Connection", "Intercom Facility"],
  },
  rules: [
    "No smoking or alcohol allowed",
    "Visitors allowed till 8 PM",
    "Maintain cleanliness",
    "No loud music after 10 PM",
    "Monthly rent to be paid by 5th of every month",
  ],
  nearbyPlaces: [
    { name: "Delhi University", distance: "0.5 km", type: "University" },
    { name: "Lajpat Nagar Metro", distance: "0.3 km", type: "Metro Station" },
    { name: "Central Market", distance: "0.2 km", type: "Shopping" },
    { name: "Max Hospital", distance: "1.2 km", type: "Hospital" },
  ],
  reviews: [
    {
      id: 1,
      user: "Rahul Sharma",
      rating: 5,
      comment: "Excellent PG with great food and clean rooms. Owner is very cooperative.",
      date: "2024-01-20",
      verified: true,
      duration: "6 months",
    },
    {
      id: 2,
      user: "Amit Kumar",
      rating: 4,
      comment: "Good location and facilities. WiFi could be better but overall satisfied.",
      date: "2024-01-15",
      verified: true,
      duration: "1 year",
    },
    {
      id: 3,
      user: "Vikash Singh",
      rating: 5,
      comment: "Best PG in the area. Highly recommended for students.",
      date: "2024-01-10",
      verified: true,
      duration: "8 months",
    },
  ],
}

const amenityIcons = {
  WiFi: Wifi,
  Food: Utensils,
  AC: HomeIcon,
  Gym: Dumbbell,
  Parking: Car,
  Laundry: HomeIcon,
  Security: Shield,
}

export default function HostelDetailPage() {
  const params = useParams()
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedRoomType, setSelectedRoomType] = useState(mockHostel.roomTypes[0])
  const [isFavorited, setIsFavorited] = useState(false)
  const [showContactForm, setShowContactForm] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary/5 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/hostels">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Hostels
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden">
              <img
                src={mockHostel.images[selectedImage] || "/placeholder.svg"}
                alt={mockHostel.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {mockHostel.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-video bg-muted rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${mockHostel.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Property Details */}
          <div className="space-y-6">
            <div>
              <div className="flex gap-2 mb-3">
                <Badge variant="secondary">{mockHostel.type}</Badge>
                <Badge variant={mockHostel.gender === "Co-ed" ? "default" : "outline"}>{mockHostel.gender}</Badge>
              </div>

              <h1 className="text-3xl font-bold text-foreground mb-2">{mockHostel.name}</h1>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{mockHostel.rating}</span>
                  <span className="text-muted-foreground">({mockHostel.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>{mockHostel.location}</span>
                </div>
              </div>

              <p className="text-muted-foreground mb-6">{mockHostel.description}</p>

              <div className="flex flex-wrap gap-2 mb-6">
                {mockHostel.amenities.map((amenity, index) => {
                  const Icon = amenityIcons[amenity as keyof typeof amenityIcons] || HomeIcon
                  return (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <Icon className="w-3 h-3" />
                      {amenity}
                    </Badge>
                  )
                })}
              </div>

              <div className="flex gap-2 mb-6">
                <Dialog open={showContactForm} onOpenChange={setShowContactForm}>
                  <DialogTrigger asChild>
                    <Button className="flex-1" size="lg">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Owner
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Contact {mockHostel.owner.name}</DialogTitle>
                      <DialogDescription>Send a message to inquire about availability and booking</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="name">Your Name</Label>
                        <Input id="name" placeholder="Enter your name" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" placeholder="Enter your phone number" />
                      </div>
                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea id="message" placeholder="Hi, I'm interested in your property..." rows={4} />
                      </div>
                      <Button className="w-full">Send Message</Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button variant="outline" size="lg">
                  <Phone className="w-4 h-4 mr-2" />
                  Call
                </Button>
                <Button variant="outline" size="lg" onClick={() => setIsFavorited(!isFavorited)}>
                  <Heart className={`w-4 h-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Room Types */}
            <Card>
              <CardHeader>
                <CardTitle>Room Types & Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockHostel.roomTypes.map((room, index) => (
                    <div
                      key={index}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedRoomType.type === room.type ? "border-primary bg-primary/5" : "border-border"
                      }`}
                      onClick={() => setSelectedRoomType(room)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold">{room.type} Room</h4>
                          <p className="text-sm text-muted-foreground">{room.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold text-primary">₹{room.price}/month</div>
                          <div className="text-sm text-muted-foreground">{room.available} available</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Owner Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={mockHostel.owner.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {mockHostel.owner.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{mockHostel.owner.name}</h4>
                      {mockHostel.owner.verified && <Shield className="w-4 h-4 text-green-600" />}
                    </div>
                    <p className="text-sm text-muted-foreground">Property Owner</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Experience:</span>
                    <p className="font-medium">{mockHostel.owner.experience}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Properties:</span>
                    <p className="font-medium">{mockHostel.owner.properties}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Information */}
        <Tabs defaultValue="facilities" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
            <TabsTrigger value="rules">Rules</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({mockHostel.reviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="facilities" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(mockHostel.facilities).map(([category, items]) => (
                <Card key={category}>
                  <CardHeader>
                    <CardTitle className="text-lg">{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {items.map((item, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rules" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>House Rules</CardTitle>
                <CardDescription>Please read and follow these rules during your stay</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockHostel.rules.map((rule, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm">{rule}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="location" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Location & Nearby Places</CardTitle>
                <CardDescription>
                  {mockHostel.location} • {mockHostel.distance}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockHostel.nearbyPlaces.map((place, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border rounded-lg">
                      <div>
                        <h4 className="font-medium">{place.name}</h4>
                        <p className="text-sm text-muted-foreground">{place.type}</p>
                      </div>
                      <Badge variant="outline">{place.distance}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Resident Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {mockHostel.reviews.map((review) => (
                    <div key={review.id} className="border-b border-border last:border-0 pb-6 last:pb-0">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback>
                              {review.user
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{review.user}</span>
                              {review.verified && (
                                <Badge variant="secondary" className="text-xs">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>Stayed for {review.duration}</span>
                              <span>•</span>
                              <span>{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Similar Properties */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6">Similar Properties</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Student Paradise", price: 7200, rating: 4.5, type: "Hostel" },
              { name: "Campus Heights", price: 9800, rating: 4.8, type: "PG" },
              { name: "Scholar's Den", price: 6500, rating: 4.3, type: "Hostel" },
            ].map((property, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-video bg-muted rounded-t-lg">
                  <img
                    src={`/placeholder-5s767.png?key=similar${index}&height=200&width=350&query=${property.name} hostel`}
                    alt={property.name}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">{property.name}</h4>
                    <Badge variant="secondary">{property.type}</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{property.rating}</span>
                    </div>
                    <div>
                      <span className="text-lg font-bold text-primary">₹{property.price}</span>
                      <span className="text-sm text-muted-foreground">/month</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
