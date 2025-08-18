"use client"

import { useState } from "react"
import { Search, BookOpen, Star, Download, Upload, Grid, List, Filter, X, Calendar, User, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import Link from "next/link"

const mockNotes = [
  {
    id: 1,
    title: "Data Structures and Algorithms - Complete Guide",
    subject: "Computer Science",
    semester: "3rd Sem",
    author: "Priya Sharma",
    university: "Delhi University",
    rating: 4.8,
    downloads: 234,
    pages: 45,
    uploadDate: "2024-01-15",
    tags: ["Arrays", "Linked Lists", "Trees", "Graphs"],
    description: "Comprehensive notes covering all major data structures with examples and practice problems.",
    format: "PDF",
    verified: true,
    college: "DU",
  },
  {
    id: 2,
    title: "Machine Learning Fundamentals",
    subject: "Computer Science",
    semester: "6th Sem",
    author: "Rahul Kumar",
    university: "IIT Delhi",
    rating: 4.9,
    downloads: 189,
    pages: 67,
    uploadDate: "2024-01-12",
    tags: ["Supervised Learning", "Neural Networks", "Python"],
    description: "Essential ML concepts with practical implementations and real-world examples.",
    format: "PDF",
    verified: true,
    college: "IIT",
  },
  {
    id: 3,
    title: "Database Management Systems",
    subject: "Computer Science",
    semester: "4th Sem",
    author: "Anita Singh",
    university: "Mumbai University",
    rating: 4.7,
    downloads: 156,
    pages: 38,
    uploadDate: "2024-01-10",
    tags: ["SQL", "Normalization", "Transactions"],
    description: "Complete DBMS notes with SQL queries and database design principles.",
    format: "DOC",
    verified: false,
    college: "MU",
  },
  {
    id: 4,
    title: "Organic Chemistry Reactions",
    subject: "Chemistry",
    semester: "2nd Sem",
    author: "Vikash Mehta",
    university: "Pune University",
    rating: 4.6,
    downloads: 198,
    pages: 52,
    uploadDate: "2024-01-08",
    tags: ["Reactions", "Mechanisms", "Synthesis"],
    description: "Detailed organic chemistry reactions with mechanisms and practice problems.",
    format: "PDF",
    verified: true,
    college: "PU",
  },
  {
    id: 5,
    title: "Microeconomics Theory",
    subject: "Economics",
    semester: "1st Sem",
    author: "Sneha Patel",
    university: "LSR College",
    rating: 4.5,
    downloads: 143,
    pages: 41,
    uploadDate: "2024-01-05",
    tags: ["Demand", "Supply", "Market Structure"],
    description: "Fundamental microeconomics concepts with graphs and real-world applications.",
    format: "PPT",
    verified: true,
    college: "LSR",
  },
  {
    id: 6,
    title: "Digital Electronics",
    subject: "Electronics",
    semester: "3rd Sem",
    author: "Arjun Reddy",
    university: "NIT Warangal",
    rating: 4.7,
    downloads: 167,
    pages: 55,
    uploadDate: "2024-01-03",
    tags: ["Logic Gates", "Flip Flops", "Counters"],
    description: "Complete digital electronics notes with circuit diagrams and truth tables.",
    format: "PDF",
    verified: true,
    college: "NIT",
  },
]

export default function NotesPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedSemester, setSelectedSemester] = useState("all")
  const [selectedCollege, setSelectedCollege] = useState("all")
  const [selectedFormat, setSelectedFormat] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("recent")

  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [ratingRange, setRatingRange] = useState([0])
  const [downloadRange, setDownloadRange] = useState([0])
  const [pageRange, setPageRange] = useState([0])
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [dateRange, setDateRange] = useState("all")
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  const subjects = ["all", "Computer Science", "Chemistry", "Economics", "Electronics", "Mathematics", "Physics"]
  const semesters = ["all", "1st Sem", "2nd Sem", "3rd Sem", "4th Sem", "5th Sem", "6th Sem", "7th Sem", "8th Sem"]
  const colleges = ["all", "IIT", "NIT", "DU", "MU", "PU", "LSR", "Other"]
  const formats = ["all", "PDF", "DOC", "PPT", "TXT"]

  const filteredNotes = mockNotes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesSubject = selectedSubject === "all" || note.subject === selectedSubject
    const matchesSemester = selectedSemester === "all" || note.semester === selectedSemester
    const matchesCollege = selectedCollege === "all" || note.college === selectedCollege
    const matchesFormat = selectedFormat === "all" || note.format === selectedFormat
    const matchesRating = ratingRange[0] === 0 || note.rating >= ratingRange[0]
    const matchesDownloads = downloadRange[0] === 0 || note.downloads >= downloadRange[0]
    const matchesPages = pageRange[0] === 0 || note.pages >= pageRange[0]
    const matchesVerified = !verifiedOnly || note.verified

    return (
      matchesSearch &&
      matchesSubject &&
      matchesSemester &&
      matchesCollege &&
      matchesFormat &&
      matchesRating &&
      matchesDownloads &&
      matchesPages &&
      matchesVerified
    )
  })

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "downloads":
        return b.downloads - a.downloads
      case "recent":
      default:
        return new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
    }
  })

  const clearAllFilters = () => {
    setSelectedSubject("all")
    setSelectedSemester("all")
    setSelectedCollege("all")
    setSelectedFormat("all")
    setRatingRange([0])
    setDownloadRange([0])
    setPageRange([0])
    setVerifiedOnly(false)
    setDateRange("all")
    setActiveFilters([])
    setSearchQuery("")
  }

  const updateActiveFilters = () => {
    const filters: string[] = []
    if (selectedSubject !== "all") filters.push(`Subject: ${selectedSubject}`)
    if (selectedSemester !== "all") filters.push(`Semester: ${selectedSemester}`)
    if (selectedCollege !== "all") filters.push(`College: ${selectedCollege}`)
    if (selectedFormat !== "all") filters.push(`Format: ${selectedFormat}`)
    if (ratingRange[0] > 0) filters.push(`Rating: ${ratingRange[0]}+`)
    if (downloadRange[0] > 0) filters.push(`Downloads: ${downloadRange[0]}+`)
    if (pageRange[0] > 0) filters.push(`Pages: ${pageRange[0]}+`)
    if (verifiedOnly) filters.push("Verified Only")
    setActiveFilters(filters)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary/5 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Study Notes</h1>
              <p className="text-muted-foreground">Access quality notes from top students across universities</p>
            </div>
            <Button className="bg-primary hover:bg-primary/90">
              <Upload className="w-4 h-4 mr-2" />
              Upload Notes
            </Button>
          </div>

          {/* Search and Basic Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search notes, subjects, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject === "all" ? "All Subjects" : subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedCollege} onValueChange={setSelectedCollege}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="College" />
                </SelectTrigger>
                <SelectContent>
                  {colleges.map((college) => (
                    <SelectItem key={college} value={college}>
                      {college === "all" ? "All Colleges" : college}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Semester" />
                </SelectTrigger>
                <SelectContent>
                  {semesters.map((semester) => (
                    <SelectItem key={semester} value={semester}>
                      {semester === "all" ? "All Sems" : semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Format" />
                </SelectTrigger>
                <SelectContent>
                  {formats.map((format) => (
                    <SelectItem key={format} value={format}>
                      {format === "all" ? "All Formats" : format}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

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
                        <Label className="text-sm font-medium">Minimum Downloads</Label>
                        <Slider
                          value={downloadRange}
                          onValueChange={setDownloadRange}
                          max={500}
                          min={0}
                          step={50}
                          className="mt-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>0</span>
                          <span>{downloadRange[0]}+</span>
                          <span>500+</span>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Minimum Pages</Label>
                        <Slider
                          value={pageRange}
                          onValueChange={setPageRange}
                          max={100}
                          min={0}
                          step={10}
                          className="mt-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>0</span>
                          <span>{pageRange[0]}+</span>
                          <span>100+</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox id="verified" checked={verifiedOnly} onCheckedChange={setVerifiedOnly} />
                        <Label htmlFor="verified" className="text-sm">
                          Verified notes only
                        </Label>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Upload Date</Label>
                        <Select value={dateRange} onValueChange={setDateRange}>
                          <SelectTrigger className="mt-2">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="week">Last Week</SelectItem>
                            <SelectItem value="month">Last Month</SelectItem>
                            <SelectItem value="year">Last Year</SelectItem>
                          </SelectContent>
                        </Select>
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
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent</SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                  <SelectItem value="downloads">Most Downloaded</SelectItem>
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
        {/* View Controls */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">Showing {sortedNotes.length} notes</p>
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Notes Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedNotes.map((note) => (
              <Link key={note.id} href={`/notes/${note.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{note.subject}</Badge>
                        {note.verified && (
                          <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <Badge variant="outline">{note.semester}</Badge>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{note.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <User className="w-3 h-3" />
                      {note.author} •
                      <Building className="w-3 h-3" />
                      {note.university}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{note.description}</p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {note.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {note.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{note.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{note.rating}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-muted-foreground">
                        <Download className="w-4 h-4" />
                        <span>{note.downloads}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {note.format}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedNotes.map((note) => (
              <Link key={note.id} href={`/notes/${note.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary">{note.subject}</Badge>
                          <Badge variant="outline">{note.semester}</Badge>
                          <Badge variant="outline" className="text-xs">
                            {note.format}
                          </Badge>
                          {note.verified && (
                            <Badge variant="default" className="bg-green-100 text-green-800 text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <h3 className="text-lg font-semibold mb-1">{note.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                          <User className="w-3 h-3" />
                          {note.author} •
                          <Building className="w-3 h-3" />
                          {note.university} •
                          <Calendar className="w-3 h-3" />
                          {new Date(note.uploadDate).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-1">{note.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {note.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 ml-4">
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{note.rating}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                          <Download className="w-4 h-4" />
                          <span>{note.downloads}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{note.pages} pages</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {sortedNotes.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No notes found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
