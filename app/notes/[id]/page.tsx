"use client"

import { useState } from "react"
import { ArrowLeft, Star, Download, Share2, Flag, BookOpen, Calendar, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { useParams } from "next/navigation"

// Mock data - in real app this would come from API
const mockNote = {
  id: 1,
  title: "Data Structures and Algorithms - Complete Guide",
  subject: "Computer Science",
  semester: "3rd Sem",
  author: {
    name: "Priya Sharma",
    avatar: "/student-avatar.png",
    university: "Delhi University",
    totalNotes: 12,
    rating: 4.8,
  },
  rating: 4.8,
  downloads: 234,
  pages: 45,
  uploadDate: "2024-01-15",
  tags: ["Arrays", "Linked Lists", "Trees", "Graphs", "Algorithms", "Data Structures"],
  description:
    "Comprehensive notes covering all major data structures with examples and practice problems. These notes include detailed explanations of arrays, linked lists, stacks, queues, trees, graphs, and various algorithms with time and space complexity analysis.",
  tableOfContents: [
    "Introduction to Data Structures",
    "Arrays and Dynamic Arrays",
    "Linked Lists (Singly, Doubly, Circular)",
    "Stacks and Queues",
    "Trees (Binary, BST, AVL, Red-Black)",
    "Graphs (Representation, Traversal)",
    "Sorting Algorithms",
    "Searching Algorithms",
    "Dynamic Programming Basics",
    "Practice Problems and Solutions",
  ],
  reviews: [
    {
      id: 1,
      user: "Rahul K.",
      rating: 5,
      comment: "Excellent notes! Very well organized and easy to understand.",
      date: "2024-01-20",
    },
    {
      id: 2,
      user: "Anita S.",
      rating: 4,
      comment: "Good coverage of topics. Could use more examples in some sections.",
      date: "2024-01-18",
    },
  ],
}

export default function NoteDetailPage() {
  const params = useParams()
  const [hasDownloaded, setHasDownloaded] = useState(false)

  const handleDownload = () => {
    setHasDownloaded(true)
    // In real app, this would trigger actual download
    console.log("Downloading note...")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary/5 border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/notes">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Notes
              </Button>
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className="flex gap-2 mb-3">
                <Badge variant="secondary">{mockNote.subject}</Badge>
                <Badge variant="outline">{mockNote.semester}</Badge>
              </div>

              <h1 className="text-3xl font-bold text-foreground mb-4">{mockNote.title}</h1>

              <p className="text-muted-foreground mb-4">{mockNote.description}</p>

              <div className="flex flex-wrap gap-1 mb-4">
                {mockNote.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{mockNote.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Download className="w-4 h-4" />
                  <span>{mockNote.downloads} downloads</span>
                </div>
                <div className="flex items-center gap-1">
                  <FileText className="w-4 h-4" />
                  <span>{mockNote.pages} pages</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>Jan 15, 2024</span>
                </div>
              </div>
            </div>

            <div className="lg:w-80">
              <Card>
                <CardContent className="p-6">
                  <div className="flex gap-2 mb-4">
                    <Button className="flex-1" onClick={handleDownload} disabled={hasDownloaded}>
                      <Download className="w-4 h-4 mr-2" />
                      {hasDownloaded ? "Downloaded" : "Download PDF"}
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Flag className="w-4 h-4" />
                    </Button>
                  </div>

                  <Separator className="my-4" />

                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={mockNote.author.avatar || "/placeholder.svg"} />
                      <AvatarFallback>
                        {mockNote.author.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-semibold">{mockNote.author.name}</h4>
                      <p className="text-sm text-muted-foreground">{mockNote.author.university}</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-primary">{mockNote.author.totalNotes}</div>
                      <div className="text-xs text-muted-foreground">Notes Uploaded</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-primary">{mockNote.author.rating}</div>
                      <div className="text-xs text-muted-foreground">Avg Rating</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Table of Contents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Table of Contents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {mockNote.tableOfContents.map((item, index) => (
                    <div key={index} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
                      <span className="text-sm font-medium text-primary w-6">{index + 1}.</span>
                      <span className="text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Reviews */}
            <Card>
              <CardHeader>
                <CardTitle>Reviews ({mockNote.reviews.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockNote.reviews.map((review) => (
                    <div key={review.id} className="border-b border-border last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{review.user}</span>
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
          </div>

          <div className="space-y-6">
            {/* Related Notes */}
            <Card>
              <CardHeader>
                <CardTitle>Related Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { title: "Advanced Algorithms", author: "John D.", rating: 4.6 },
                    { title: "System Design Basics", author: "Sarah M.", rating: 4.7 },
                    { title: "Competitive Programming", author: "Mike R.", rating: 4.5 },
                  ].map((note, index) => (
                    <div key={index} className="p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                      <h4 className="font-medium text-sm mb-1">{note.title}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">by {note.author}</span>
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{note.rating}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
