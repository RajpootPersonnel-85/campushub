"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, X, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"

export default function SellBookPage() {
  const [title, setTitle] = useState("")
  const [author, setAuthor] = useState("")
  const [isbn, setIsbn] = useState("")
  const [edition, setEdition] = useState("")
  const [subject, setSubject] = useState("")
  const [condition, setCondition] = useState("")
  const [price, setPrice] = useState("")
  const [originalPrice, setOriginalPrice] = useState("")
  const [description, setDescription] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [tags, setTags] = useState<string[]>([])
  const [currentTag, setCurrentTag] = useState("")
  const [agreeTerms, setAgreeTerms] = useState(false)

  const subjects = [
    "Computer Science",
    "Chemistry",
    "Economics",
    "Electronics",
    "Mathematics",
    "Physics",
    "Biology",
    "English",
    "History",
    "Geography",
  ]
  const conditions = ["Excellent", "Good", "Fair"]

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).slice(0, 5 - images.length)
      setImages([...images, ...newImages])
    }
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log("Listing book:", {
      title,
      author,
      isbn,
      edition,
      subject,
      condition,
      price,
      originalPrice,
      description,
      images,
      tags,
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary/5 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/books">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Books
              </Button>
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2">Sell Your Book</h1>
          <p className="text-muted-foreground">List your textbook and connect with buyers</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Book Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Book Information</CardTitle>
                  <CardDescription>Provide details about your book</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Book Title *</Label>
                      <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g., Introduction to Algorithms"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="author">Author(s) *</Label>
                      <Input
                        id="author"
                        value={author}
                        onChange={(e) => setAuthor(e.target.value)}
                        placeholder="e.g., Thomas H. Cormen"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="isbn">ISBN</Label>
                      <Input
                        id="isbn"
                        value={isbn}
                        onChange={(e) => setIsbn(e.target.value)}
                        placeholder="978-0262033848"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edition">Edition</Label>
                      <Input
                        id="edition"
                        value={edition}
                        onChange={(e) => setEdition(e.target.value)}
                        placeholder="3rd Edition"
                      />
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject *</Label>
                      <Select value={subject} onValueChange={setSubject} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subj) => (
                            <SelectItem key={subj} value={subj}>
                              {subj}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe the condition, any markings, missing pages, etc..."
                      rows={4}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags (Optional)</Label>
                    <div className="flex gap-2 mb-2">
                      <Input
                        id="tags"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        placeholder="Add a tag (e.g., Algorithms, Data Structures)"
                        onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                      />
                      <Button type="button" onClick={handleAddTag} variant="outline">
                        Add
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <X className="w-3 h-3 cursor-pointer" onClick={() => handleRemoveTag(tag)} />
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Condition & Pricing */}
              <Card>
                <CardHeader>
                  <CardTitle>Condition & Pricing</CardTitle>
                  <CardDescription>Set the condition and price for your book</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="condition">Condition *</Label>
                    <Select value={condition} onValueChange={setCondition} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        {conditions.map((cond) => (
                          <SelectItem key={cond} value={cond}>
                            {cond}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>
                        <strong>Excellent:</strong> Like new, no markings or damage
                      </p>
                      <p>
                        <strong>Good:</strong> Minor wear, some highlighting acceptable
                      </p>
                      <p>
                        <strong>Fair:</strong> Noticeable wear, but all pages intact
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Selling Price (₹) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="899"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="originalPrice">Original Price (₹)</Label>
                      <Input
                        id="originalPrice"
                        type="number"
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value)}
                        placeholder="1200"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Photos */}
              <Card>
                <CardHeader>
                  <CardTitle>Photos</CardTitle>
                  <CardDescription>Add up to 5 photos of your book</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative aspect-[3/4] bg-muted rounded-lg overflow-hidden">
                        <img
                          src={URL.createObjectURL(image) || "/placeholder.svg"}
                          alt={`Book photo ${index + 1}`}
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

                    {images.length < 5 && (
                      <div className="aspect-[3/4] border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50">
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
                    Add clear photos showing the front cover, back cover, and any damage or markings.
                  </p>
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
                      and confirm that this book is my property and I have the right to sell it. I understand that
                      providing false information may result in account suspension.
                    </Label>
                  </div>
                </CardContent>
              </Card>

              <Button type="submit" className="w-full" size="lg" disabled={!agreeTerms}>
                List Book for Sale
              </Button>
            </form>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Selling Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium mb-1">Take Great Photos</h4>
                  <p className="text-muted-foreground">Clear, well-lit photos increase your chances of selling</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Be Honest About Condition</h4>
                  <p className="text-muted-foreground">Accurate descriptions build trust with buyers</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Competitive Pricing</h4>
                  <p className="text-muted-foreground">Research similar books to price competitively</p>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Quick Response</h4>
                  <p className="text-muted-foreground">Respond to inquiries promptly to close deals faster</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Safety Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Meet in public places for exchanges</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Verify payment before handing over books</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Trust your instincts about buyers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Report suspicious activity</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
