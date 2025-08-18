"use client"

import { useState } from "react"
import { ArrowLeft, Star, Heart, Share2, MapPin, Clock, Shield, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { useParams } from "next/navigation"

// Mock data - in real app this would come from API
const mockBook = {
  id: 1,
  title: "Introduction to Algorithms",
  author: "Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein",
  price: 899,
  originalPrice: 1200,
  condition: "Good",
  subject: "Computer Science",
  seller: {
    name: "Amit Kumar",
    avatar: "/placeholder.svg?key=seller",
    rating: 4.8,
    totalSales: 23,
    location: "Delhi University",
    joinedDate: "2023-08-15",
    responseTime: "Usually responds within 2 hours",
    verified: true,
  },
  images: ["/placeholder-w85wi.png", "/placeholder-ksbas.png", "/algorithms-textbook-pages.png"],
  description:
    "Classic algorithms textbook in good condition. This comprehensive guide covers fundamental algorithms and data structures. Some highlighting in chapters 1-5 but all pages are intact and readable. Perfect for computer science students. No missing pages or major damage.",
  postedDate: "2024-01-15",
  isbn: "978-0262033848",
  edition: "3rd Edition",
  language: "English",
  publisher: "MIT Press",
  pages: 1312,
  weight: "2.5 kg",
  tags: ["Algorithms", "Data Structures", "Computer Science", "MIT Press"],
  specifications: {
    ISBN: "978-0262033848",
    Edition: "3rd Edition",
    Publisher: "MIT Press",
    Language: "English",
    Pages: "1312",
    Weight: "2.5 kg",
    Binding: "Hardcover",
  },
  reviews: [
    {
      id: 1,
      buyer: "Rahul S.",
      rating: 5,
      comment: "Excellent condition as described. Fast delivery and great communication from seller.",
      date: "2024-01-20",
      verified: true,
    },
    {
      id: 2,
      buyer: "Priya M.",
      rating: 4,
      comment: "Good book, some highlighting but doesn't affect readability. Fair price.",
      date: "2024-01-18",
      verified: true,
    },
  ],
}

export default function BookDetailPage() {
  const params = useParams()
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary/5 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/books">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Books
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
            <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden">
              <img
                src={mockBook.images[selectedImage] || "/placeholder.svg"}
                alt={mockBook.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              {mockBook.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-20 h-24 bg-muted rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? "border-primary" : "border-transparent"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${mockBook.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Book Details */}
          <div className="space-y-6">
            <div>
              <div className="flex gap-2 mb-3">
                <Badge variant="outline">{mockBook.subject}</Badge>
                <Badge variant={mockBook.condition === "Excellent" ? "default" : "secondary"}>
                  {mockBook.condition}
                </Badge>
              </div>

              <h1 className="text-3xl font-bold text-foreground mb-2">{mockBook.title}</h1>

              <p className="text-lg text-muted-foreground mb-4">by {mockBook.author}</p>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-3xl font-bold text-primary">₹{mockBook.price}</span>
                  <span className="text-lg text-muted-foreground line-through">₹{mockBook.originalPrice}</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {Math.round(((mockBook.originalPrice - mockBook.price) / mockBook.originalPrice) * 100)}% OFF
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2 mb-6">
                <Button className="flex-1" size="lg">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Seller
                </Button>
                <Button variant="outline" size="lg" onClick={() => setIsFavorited(!isFavorited)}>
                  <Heart className={`w-4 h-4 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
                </Button>
                <Button variant="outline" size="lg">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Posted on {new Date(mockBook.postedDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{mockBook.seller.location}</span>
                </div>
              </div>
            </div>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={mockBook.seller.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {mockBook.seller.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold">{mockBook.seller.name}</h4>
                      {mockBook.seller.verified && <Shield className="w-4 h-4 text-green-600" />}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>
                        {mockBook.seller.rating} • {mockBook.seller.totalSales} sales
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <p className="font-medium">{mockBook.seller.location}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Response Time:</span>
                    <p className="font-medium">{mockBook.seller.responseTime}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Detailed Information */}
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({mockBook.reviews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Book Description</h3>
                <p className="text-muted-foreground leading-relaxed mb-4">{mockBook.description}</p>

                <div className="flex flex-wrap gap-2">
                  {mockBook.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="specifications" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Book Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(mockBook.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b border-border last:border-0">
                      <span className="text-muted-foreground">{key}:</span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Buyer Reviews</h3>
                <div className="space-y-4">
                  {mockBook.reviews.map((review) => (
                    <div key={review.id} className="border-b border-border last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.buyer}</span>
                          {review.verified && (
                            <Badge variant="secondary" className="text-xs">
                              Verified Purchase
                            </Badge>
                          )}
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${
                                  i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground">{review.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Related Books */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6">Related Books</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Data Structures and Algorithms", price: 750, condition: "Good", rating: 4.6 },
              { title: "Computer Networks", price: 650, condition: "Excellent", rating: 4.8 },
              { title: "Operating Systems", price: 580, condition: "Fair", rating: 4.3 },
              { title: "Database Systems", price: 720, condition: "Good", rating: 4.7 },
            ].map((book, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-[3/4] bg-muted rounded-t-lg">
                  <img
                    src={`/abstract-geometric-shapes.png?height=300&width=225&query=${book.title} textbook`}
                    alt={book.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-sm mb-2 line-clamp-2">{book.title}</h4>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-lg font-bold text-primary">₹{book.price}</span>
                    <Badge variant={book.condition === "Excellent" ? "default" : "secondary"}>{book.condition}</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{book.rating}</span>
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
