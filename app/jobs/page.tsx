"use client"

import { useState } from "react"
import { Search, MapPin, Briefcase, Filter, Building2, Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const jobListings = [
  {
    id: 1,
    title: "Content Writer",
    company: "TechStart Solutions",
    logo: "/techstart-solutions-logo.png",
    type: "Part-time",
    location: "Work from home • 10-15 hrs/week",
    salary: "₹8,000 - ₹12,000/month",
    postedDate: "3 days ago",
    description: "Create engaging content for our tech blog and social media platforms.",
    requirements: ["Excellent writing skills", "Basic SEO knowledge", "Creative mindset"],
    category: "Content & Marketing",
  },
  {
    id: 2,
    title: "Frontend Developer Intern",
    company: "InnovateTech",
    logo: "/innovatetech-logo.png",
    type: "Internship",
    location: "Bangalore • Hybrid",
    salary: "₹15,000 - ₹20,000/month",
    postedDate: "1 day ago",
    description: "Work on exciting web applications using React and modern technologies.",
    requirements: ["React knowledge", "JavaScript proficiency", "Portfolio required"],
    category: "Technology",
  },
  {
    id: 3,
    title: "Social Media Manager",
    company: "CreativeHub",
    logo: "/creativehub-logo.png",
    type: "Part-time",
    location: "Remote • Flexible hours",
    salary: "₹12,000 - ₹18,000/month",
    postedDate: "2 days ago",
    description: "Manage social media accounts and create engaging content strategies.",
    requirements: ["Social media expertise", "Content creation skills", "Analytics knowledge"],
    category: "Content & Marketing",
  },
  {
    id: 4,
    title: "Data Analysis Intern",
    company: "DataCorp",
    logo: "/datacorp-logo.png",
    type: "Internship",
    location: "Mumbai • On-site",
    salary: "₹18,000 - ₹25,000/month",
    postedDate: "4 days ago",
    description: "Analyze business data and create insightful reports using Python and SQL.",
    requirements: ["Python/SQL skills", "Statistics knowledge", "Excel proficiency"],
    category: "Data & Analytics",
  },
  {
    id: 5,
    title: "Graphic Designer",
    company: "DesignStudio",
    logo: "/designstudio-logo.png",
    type: "Freelance",
    location: "Remote • Project-based",
    salary: "₹500 - ₹2,000/project",
    postedDate: "1 week ago",
    description: "Create visual designs for various marketing materials and digital platforms.",
    requirements: ["Adobe Creative Suite", "Portfolio required", "Creative thinking"],
    category: "Design & Creative",
  },
  {
    id: 6,
    title: "Marketing Assistant",
    company: "GrowthCo",
    logo: "/growthco-logo.png",
    type: "Part-time",
    location: "Delhi • Hybrid",
    salary: "₹10,000 - ₹15,000/month",
    postedDate: "5 days ago",
    description: "Support marketing campaigns and help with market research activities.",
    requirements: ["Marketing basics", "Communication skills", "MS Office proficiency"],
    category: "Content & Marketing",
  },
]

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")

  const filteredJobs = jobListings.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || job.category === selectedCategory
    const matchesType = selectedType === "all" || job.type === selectedType
    const matchesLocation =
      selectedLocation === "all" || job.location.toLowerCase().includes(selectedLocation.toLowerCase())

    return matchesSearch && matchesCategory && matchesType && matchesLocation
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary/5 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Jobs & Internships</h1>
              <p className="text-muted-foreground">Find opportunities that match your skills and schedule</p>
            </div>
            <Badge variant="secondary" className="text-sm">
              Coming in Phase 2
            </Badge>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search jobs, companies..."
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
                <SelectItem value="Technology">Technology</SelectItem>
                <SelectItem value="Content & Marketing">Content & Marketing</SelectItem>
                <SelectItem value="Design & Creative">Design & Creative</SelectItem>
                <SelectItem value="Data & Analytics">Data & Analytics</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Internship">Internship</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Freelance">Freelance</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger>
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="remote">Remote</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-muted-foreground">
            Showing {filteredJobs.length} of {jobListings.length} opportunities
          </p>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{job.title}</CardTitle>
                      <CardDescription className="font-medium">{job.company}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={job.type === "Internship" ? "default" : "secondary"}>{job.type}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {job.salary}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    Posted {job.postedDate}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>

                <div className="flex flex-wrap gap-1">
                  {job.requirements.slice(0, 2).map((req, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {req}
                    </Badge>
                  ))}
                  {job.requirements.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{job.requirements.length - 2} more
                    </Badge>
                  )}
                </div>

                <Button className="w-full">Apply Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Briefcase className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No jobs found</h3>
            <p className="text-muted-foreground">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}
