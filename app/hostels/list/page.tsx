"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, X, Plus, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"

export default function ListHostelPage() {
  const [propertyName, setPropertyName] = useState("")
  const [propertyType, setPropertyType] = useState("")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [nearbyLandmark, setNearbyLandmark] = useState("")
  const [genderPreference, setGenderPreference] = useState("")
  const [description, setDescription] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [amenities, setAmenities] = useState<string[]>([])
  const [roomTypes, setRoomTypes] = useState([{ type: "Single", price: "", available: "" }])
  const [ownerName, setOwnerName] = useState("")
  const [ownerPhone, setOwnerPhone] = useState("")
  const [ownerEmail, setOwnerEmail] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)

  const propertyTypes = ["PG", "Hostel", "Flat", "Room"]
  const cities = ["Delhi", "Mumbai", "Bangalore", "Chennai", "Kolkata", "Hyderabad", "Pune"]
  const genderOptions = ["Boys", "Girls", "Co-ed"]
  const availableAmenities = [
    "WiFi",
    "Food",
    "AC",
    "Gym",
    "Parking",
    "Laundry",
    "Security",
    "Study Room",
    "Library",
    "Common Room",
    "Kitchen Access",
    "Terrace",
  ]

  const handleAmenityChange = (amenity: string, checked: boolean) => {
    if (checked) {
      setAmenities([...amenities, amenity])
    } else {
      setAmenities(amenities.filter((a) => a !== amenity))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).slice(0, 8 - images.length)
      setImages([...images, ...newImages])
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const addRoomType = () => {
    setRoomTypes([...roomTypes, { type: "", price: "", available: "" }])
  }

  const removeRoomType = (index: number) => {
    setRoomTypes(roomTypes.filter((_, i) => i !== index))
  }

  const updateRoomType = (index: number, field: string, value: string) => {
    const updated = roomTypes.map((room, i) => (i === index ? { ...room, [field]: value } : room))
    setRoomTypes(updated)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Listing property:", {
      propertyName,
      propertyType,
      address,
      city,
      nearbyLandmark,
      genderPreference,
      description,
      images,
      amenities,
      roomTypes,
      ownerName,
      ownerPhone,
      ownerEmail,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary/5 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/hostels">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Hostels
              </Button>
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">List Your Property</h1>
          <p className="text-muted-foreground">Reach thousands of students looking for accommodation</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Tell us about your property</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="propertyName">Property Name *</Label>
                      <Input
                        id="propertyName"
                        value={propertyName}
                        onChange={(e) => setPropertyName(e.target.value)}
                        placeholder="e.g., Green Valley PG"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="propertyType">Property Type *</Label>
                      <Select value={propertyType} onValueChange={setPropertyType} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Full Address *</Label>
                    <Textarea
                      id="address"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Enter complete address with area, locality..."
                      rows={3}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Select value={city} onValueChange={setCity} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((cityName) => (
                            <SelectItem key={cityName} value={cityName}>
                              {cityName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="nearbyLandmark">Nearby Landmark</Label>
                      <Input
                        id="nearbyLandmark"
                        value={nearbyLandmark}
                        onChange={(e) => setNearbyLandmark(e.target.value)}
                        placeholder="e.g., Near Delhi University"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-3 block">Gender Preference *</Label>
                    <RadioGroup value={genderPreference} onValueChange={setGenderPreference}>
                      <div className="flex gap-6">
                        {genderOptions.map((option) => (
                          <div key={option} className="flex items-center space-x-2">
                            <RadioGroupItem value={option} id={option} />
                            <Label htmlFor={option}>{option}</Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div>
                    <Label htmlFor="description">Property Description *</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your property, facilities, rules, and what makes it special..."
                      rows={4}
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Room Types & Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle>Room Types & Pricing</CardTitle>
                  <CardDescription>Add different room types and their prices</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {roomTypes.map((room, index) => (
                    <div key={index} className="p-4 border border-border rounded-lg">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Room Type {index + 1}</h4>
                        {roomTypes.length > 1 && (
                          <Button type="button" variant="outline" size="sm" onClick={() => removeRoomType(index)}>
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Room Type</Label>
                          <Select value={room.type} onValueChange={(value) => updateRoomType(index, "type", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Single">Single</SelectItem>
                              <SelectItem value="Double">Double</SelectItem>
                              <SelectItem value="Triple">Triple</SelectItem>
                              <SelectItem value="Dormitory">Dormitory</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Monthly Rent (₹)</Label>
                          <Input
                            type="number"
                            value={room.price}
                            onChange={(e) => updateRoomType(index, "price", e.target.value)}
                            placeholder="8500"
                          />
                        </div>
                        <div>
                          <Label>Available Rooms</Label>
                          <Input
                            type="number"
                            value={room.available}
                            onChange={(e) => updateRoomType(index, "available", e.target.value)}
                            placeholder="5"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addRoomType}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Room Type
                  </Button>
                </CardContent>
              </Card>

              {/* Amenities */}
              <Card>
                <CardHeader>
                  <CardTitle>Amenities</CardTitle>
                  <CardDescription>Select all amenities available at your property</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {availableAmenities.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={amenity}
                          checked={amenities.includes(amenity)}
                          onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                        />
                        <Label htmlFor={amenity} className="text-sm">
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Photos */}
              <Card>
                <CardHeader>
                  <CardTitle>Property Photos</CardTitle>
                  <CardDescription>Add up to 8 photos of your property</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                        <img
                          src={URL.createObjectURL(image) || "/placeholder.svg"}
                          alt={`Property photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}

                    {images.length < 8 && (
                      <div className="aspect-video border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50">
                        <Input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <Label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center">
                          <Camera className="w-8 h-8 text-muted-foreground mb-2" />
                          <span className="text-sm text-muted-foreground text-center">Add Photo</span>
                        </Label>
                      </div>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Add clear photos of rooms, common areas, and exterior. First photo will be used as main image.
                  </p>
                </CardContent>
              </Card>

              {/* Owner Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Owner Information</CardTitle>
                  <CardDescription>Your contact details for potential tenants</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="ownerName">Full Name *</Label>
                    <Input
                      id="ownerName"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="ownerPhone">Phone Number *</Label>
                      <Input
                        id="ownerPhone"
                        value={ownerPhone}
                        onChange={(e) => setOwnerPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="ownerEmail">Email Address</Label>
                      <Input
                        id="ownerEmail"
                        type="email"
                        value={ownerEmail}
                        onChange={(e) => setOwnerEmail(e.target.value)}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Terms */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreeTerms}
                      onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                    />
                    <Label htmlFor="terms" className="text-sm leading-relaxed">
                      I agree to the{" "}
                      <a href="#" className="text-primary hover:underline">
                        Terms of Service
                      </a>{" "}
                      and confirm that I am the authorized owner/manager of this property. I understand that providing
                      false information may result in listing removal and account suspension.
                    </Label>
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" size="lg" disabled={!agreeTerms}>
                List Property
              </Button>
            </form>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Listing Benefits</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium mb-1">Free Listing</h4>
                  <p className="text-muted-foreground">List your property for free and reach thousands of students</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Direct Contact</h4>
                  <p className="text-muted-foreground">Students can contact you directly without any middleman</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Easy Management</h4>
                  <p className="text-muted-foreground">Update availability and manage inquiries from your dashboard</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Verified Listings</h4>
                  <p className="text-muted-foreground">Get verified badge to build trust with potential tenants</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tips for Better Listing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Add high-quality photos of all rooms</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Write detailed and honest descriptions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Mention nearby colleges and landmarks</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Keep pricing competitive</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Respond to inquiries quickly</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
