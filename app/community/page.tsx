"use client"

import { useState } from "react"
import {
  Search,
  Plus,
  Users,
  Calendar,
  MessageSquare,
  TrendingUp,
  Pin,
  Clock,
  Eye,
  ThumbsUp,
  MessageCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

const mockDiscussions = [
  {
    id: 1,
    title: "Best study spots near DU campus?",
    content: "Looking for quiet places to study with good WiFi. Any recommendations?",
    author: "Rahul Sharma",
    avatar: "/placeholder.svg?key=user1",
    category: "General",
    tags: ["study", "campus", "wifi"],
    createdAt: "2024-01-20T10:30:00Z",
    replies: 15,
    views: 234,
    likes: 8,
    isPinned: false,
    lastActivity: "2 hours ago",
  },
  {
    id: 2,
    title: "Study Group for Data Structures & Algorithms",
    content: "Starting a study group for DSA preparation. Meeting every weekend at Central Library.",
    author: "Priya Singh",
    avatar: "/placeholder.svg?key=user2",
    category: "Study Groups",
    tags: ["dsa", "study-group", "programming"],
    createdAt: "2024-01-19T15:45:00Z",
    replies: 23,
    views: 456,
    likes: 18,
    isPinned: true,
    lastActivity: "1 hour ago",
  },
  {
    id: 3,
    title: "Anyone selling Engineering Mathematics textbook?",
    content: "Need the latest edition of Engineering Mathematics by RK Jain. Willing to pay good price.",
    author: "Amit Kumar",
    avatar: "/placeholder.svg?key=user3",
    category: "Buy/Sell",
    tags: ["textbook", "mathematics", "engineering"],
    createdAt: "2024-01-19T09:20:00Z",
    replies: 7,
    views: 123,
    likes: 3,
    isPinned: false,
    lastActivity: "3 hours ago",
  },
  {
    id: 4,
    title: "Tech Fest 2024 - Call for Volunteers",
    content:
      "Our annual tech fest is approaching! We need volunteers for various activities. Great opportunity to network.",
    author: "Student Council",
    avatar: "/placeholder.svg?key=council",
    category: "Events",
    tags: ["tech-fest", "volunteer", "networking"],
    createdAt: "2024-01-18T14:00:00Z",
    replies: 45,
    views: 789,
    likes: 32,
    isPinned: true,
    lastActivity: "30 minutes ago",
  },
  {
    id: 5,
    title: "Help with Organic Chemistry reactions",
    content: "Struggling with mechanism of organic reactions. Can someone explain SN1 vs SN2?",
    author: "Neha Gupta",
    avatar: "/placeholder.svg?key=user4",
    category: "Academic Help",
    tags: ["chemistry", "organic", "help"],
    createdAt: "2024-01-18T11:15:00Z",
    replies: 12,
    views: 167,
    likes: 9,
    isPinned: false,
    lastActivity: "4 hours ago",
  },
]

const mockStudyGroups = [
  {
    id: 1,
    name: "GATE CS Preparation 2024",
    description: "Comprehensive preparation for GATE Computer Science exam with weekly mock tests and discussions.",
    members: 45,
    category: "Competitive Exams",
    meetingTime: "Saturdays 10:00 AM",
    location: "Central Library, Room 201",
    admin: "Vikash Singh",
    tags: ["gate", "computer-science", "competitive"],
    isJoined: false,
  },
  {
    id: 2,
    name: "Web Development Bootcamp",
    description: "Learn modern web development with React, Node.js, and MongoDB. Hands-on projects included.",
    members: 32,
    category: "Programming",
    meetingTime: "Sundays 2:00 PM",
    location: "Computer Lab B",
    admin: "Arjun Patel",
    tags: ["web-dev", "react", "nodejs"],
    isJoined: true,
  },
  {
    id: 3,
    name: "English Literature Discussion",
    description: "Weekly discussions on classic and contemporary literature. Currently reading 'Pride and Prejudice'.",
    members: 18,
    category: "Literature",
    meetingTime: "Fridays 4:00 PM",
    location: "Library Reading Room",
    admin: "Shreya Sharma",
    tags: ["literature", "english", "discussion"],
    isJoined: false,
  },
  {
    id: 4,
    name: "Mathematics Problem Solving",
    description: "Solve challenging mathematical problems together. Focus on calculus and linear algebra.",
    members: 28,
    category: "Mathematics",
    meetingTime: "Wednesdays 6:00 PM",
    location: "Math Department",
    admin: "Rohit Kumar",
    tags: ["mathematics", "calculus", "algebra"],
    isJoined: true,
  },
]

const mockEvents = [
  {
    id: 1,
    title: "Annual Tech Symposium 2024",
    description: "Join us for a day of innovation, technology talks, and networking opportunities.",
    date: "2024-02-15",
    time: "9:00 AM - 6:00 PM",
    location: "Main Auditorium",
    organizer: "Tech Society",
    attendees: 234,
    category: "Technology",
    isRegistered: false,
  },
  {
    id: 2,
    title: "Career Guidance Workshop",
    description: "Industry experts will share insights on career opportunities and interview preparation.",
    date: "2024-02-08",
    time: "2:00 PM - 5:00 PM",
    location: "Seminar Hall",
    organizer: "Placement Cell",
    attendees: 156,
    category: "Career",
    isRegistered: true,
  },
  {
    id: 3,
    title: "Cultural Night - Expressions 2024",
    description: "Showcase your talents in music, dance, drama, and poetry. Open to all students.",
    date: "2024-02-20",
    time: "7:00 PM - 10:00 PM",
    location: "Open Air Theatre",
    organizer: "Cultural Committee",
    attendees: 89,
    category: "Cultural",
    isRegistered: false,
  },
]

export default function CommunityPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("recent")

  const categories = ["all", "General", "Study Groups", "Academic Help", "Buy/Sell", "Events"]
  const sortOptions = [
    { value: "recent", label: "Most Recent" },
    { value: "popular", label: "Most Popular" },
    { value: "replies", label: "Most Replies" },
  ]

  const filteredDiscussions = mockDiscussions.filter((discussion) => {
    const matchesSearch =
      discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      discussion.content.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || discussion.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary/5 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Community</h1>
              <p className="text-muted-foreground">Connect, learn, and grow together</p>
            </div>
            <Link href="/community/create">
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="w-4 h-4 mr-2" />
                New Discussion
              </Button>
            </Link>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="discussions" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="study-groups">Study Groups</TabsTrigger>
            <TabsTrigger value="events">Events</TabsTrigger>
          </TabsList>

          <TabsContent value="discussions" className="mt-6">
            <div className="space-y-4">
              {filteredDiscussions.map((discussion) => (
                <Link key={discussion.id} href={`/community/discussion/${discussion.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <Avatar className="w-10 h-10 flex-shrink-0">
                          <AvatarImage src={discussion.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {discussion.author
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {discussion.isPinned && <Pin className="w-4 h-4 text-primary" />}
                              <h3 className="font-semibold text-lg hover:text-primary transition-colors">
                                {discussion.title}
                              </h3>
                            </div>
                            <Badge variant="secondary">{discussion.category}</Badge>
                          </div>

                          <p className="text-muted-foreground mb-3 line-clamp-2">{discussion.content}</p>

                          <div className="flex flex-wrap gap-1 mb-3">
                            {discussion.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-4">
                              <span>by {discussion.author}</span>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatTimeAgo(discussion.createdAt)}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <Eye className="w-4 h-4" />
                                <span>{discussion.views}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <ThumbsUp className="w-4 h-4" />
                                <span>{discussion.likes}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="w-4 h-4" />
                                <span>{discussion.replies}</span>
                              </div>
                              <span>Last activity: {discussion.lastActivity}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="study-groups" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockStudyGroups.map((group) => (
                <Card key={group.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{group.name}</CardTitle>
                      <Badge variant="secondary">{group.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{group.description}</p>

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{group.members} members</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{group.meetingTime}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <span>{group.location}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {group.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Admin: {group.admin}</span>
                      <Button variant={group.isJoined ? "outline" : "default"} size="sm">
                        {group.isJoined ? "Joined" : "Join Group"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg line-clamp-2">{event.title}</CardTitle>
                      <Badge variant="secondary">{event.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{event.description}</p>

                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-muted-foreground" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-muted-foreground" />
                        <span>{event.attendees} registered</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">by {event.organizer}</span>
                      <Button variant={event.isRegistered ? "outline" : "default"} size="sm">
                        {event.isRegistered ? "Registered" : "Register"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Community Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6 text-center">
              <MessageSquare className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">1,234</div>
              <div className="text-sm text-muted-foreground">Discussions</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">45</div>
              <div className="text-sm text-muted-foreground">Study Groups</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">23</div>
              <div className="text-sm text-muted-foreground">Upcoming Events</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold">5,678</div>
              <div className="text-sm text-muted-foreground">Active Members</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
