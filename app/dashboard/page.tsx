"use client"

import { useState } from "react"
import { BookOpen, Upload, Download, Star, Users, MessageSquare, Calendar, Bell, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"

export default function DashboardPage() {
  const [user] = useState({
    name: "Rahul Sharma",
    email: "rahul@student.du.ac.in",
    college: "Delhi University",
    course: "B.Tech Computer Science",
    semester: "6th Sem",
    avatar: "/placeholder.svg?key=user-avatar",
    joinedDate: "September 2023",
    points: 2450,
    level: "Gold Contributor",
  })

  const stats = {
    notesUploaded: 15,
    notesDownloaded: 89,
    booksListed: 3,
    booksSold: 2,
    communityPosts: 12,
    helpfulAnswers: 8,
  }

  const recentActivity = [
    { type: "upload", title: "Data Structures Notes", time: "2 hours ago", points: 50 },
    { type: "download", title: "Machine Learning Algorithms", time: "1 day ago", points: -10 },
    { type: "sell", title: "Operating Systems Textbook", time: "3 days ago", points: 100 },
    { type: "answer", title: "Helped with Database Query", time: "1 week ago", points: 25 },
  ]

  const achievements = [
    { title: "First Upload", description: "Uploaded your first notes", earned: true },
    { title: "Helpful Helper", description: "Received 10 helpful votes", earned: true },
    { title: "Book Seller", description: "Sold your first book", earned: true },
    { title: "Community Star", description: "Get 100 community points", earned: false },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary/5 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user.name}!</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Bell className="w-4 h-4 mr-2" />
                Notifications
              </Button>
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <LogOut className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="font-semibold text-lg">{user.name}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  <Badge variant="secondary" className="mt-2">
                    {user.level}
                  </Badge>
                </div>

                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">College:</span>
                    <p className="font-medium">{user.college}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Course:</span>
                    <p className="font-medium">{user.course}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Semester:</span>
                    <p className="font-medium">{user.semester}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Points:</span>
                    <p className="font-bold text-primary">{user.points}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Member since:</span>
                    <p className="font-medium">{user.joinedDate}</p>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-6 bg-transparent">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card>
                <CardContent className="p-4 text-center">
                  <Upload className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.notesUploaded}</div>
                  <div className="text-xs text-muted-foreground">Notes Uploaded</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <Download className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.notesDownloaded}</div>
                  <div className="text-xs text-muted-foreground">Notes Downloaded</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <BookOpen className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.booksSold}</div>
                  <div className="text-xs text-muted-foreground">Books Sold</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <MessageSquare className="w-6 h-6 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stats.helpfulAnswers}</div>
                  <div className="text-xs text-muted-foreground">Helpful Answers</div>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="activity" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                <TabsTrigger value="achievements">Achievements</TabsTrigger>
                <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
              </TabsList>

              <TabsContent value="activity" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Your latest actions on CampusHub</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border border-border rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            {activity.type === "upload" && <Upload className="w-4 h-4 text-green-600" />}
                            {activity.type === "download" && <Download className="w-4 h-4 text-blue-600" />}
                            {activity.type === "sell" && <BookOpen className="w-4 h-4 text-purple-600" />}
                            {activity.type === "answer" && <MessageSquare className="w-4 h-4 text-orange-600" />}
                            <div>
                              <p className="font-medium">{activity.title}</p>
                              <p className="text-sm text-muted-foreground">{activity.time}</p>
                            </div>
                          </div>
                          <Badge variant={activity.points > 0 ? "default" : "secondary"}>
                            {activity.points > 0 ? "+" : ""}
                            {activity.points} pts
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Achievements</CardTitle>
                    <CardDescription>Your progress and milestones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {achievements.map((achievement, index) => (
                        <div
                          key={index}
                          className={`p-4 border rounded-lg ${
                            achievement.earned ? "border-primary bg-primary/5" : "border-border"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                achievement.earned ? "bg-primary text-primary-foreground" : "bg-muted"
                              }`}
                            >
                              <Star className="w-5 h-5" />
                            </div>
                            <div>
                              <h4 className="font-medium">{achievement.title}</h4>
                              <p className="text-sm text-muted-foreground">{achievement.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="quick-actions" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Common tasks and shortcuts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Link href="/notes/upload">
                        <Button variant="outline" className="w-full h-20 flex-col bg-transparent">
                          <Upload className="w-6 h-6 mb-2" />
                          Upload Notes
                        </Button>
                      </Link>
                      <Link href="/books/sell">
                        <Button variant="outline" className="w-full h-20 flex-col bg-transparent">
                          <BookOpen className="w-6 h-6 mb-2" />
                          Sell Books
                        </Button>
                      </Link>
                      <Link href="/community">
                        <Button variant="outline" className="w-full h-20 flex-col bg-transparent">
                          <Users className="w-6 h-6 mb-2" />
                          Join Community
                        </Button>
                      </Link>
                      <Link href="/hostels/list">
                        <Button variant="outline" className="w-full h-20 flex-col bg-transparent">
                          <Calendar className="w-6 h-6 mb-2" />
                          List Property
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
