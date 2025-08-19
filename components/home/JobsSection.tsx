"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Briefcase } from "lucide-react"

export default function JobsSection() {
  return (
    <section id="jobs" className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">💼 Jobs/Internships</h2>
            <p className="text-muted-foreground">Opportunities that fit your student schedule</p>
          </div>
          <Link href="/jobs">
            <Button className="bg-primary hover:bg-primary/90">View All Jobs</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            {
              title: "Content Writer",
              company: "TechStart Solutions",
              type: "Part-time",
              location: "Work from home • 10-15 hrs/week",
              salary: "₹8,000 - ₹12,000/month",
              postedDate: "3 days ago",
            },
            {
              title: "Frontend Developer Intern",
              company: "InnovateTech",
              type: "Internship",
              location: "Bangalore • Hybrid",
              salary: "₹15,000 - ₹20,000/month",
              postedDate: "1 day ago",
            },
            {
              title: "Social Media Manager",
              company: "CreativeHub",
              type: "Part-time",
              location: "Remote • Flexible hours",
              salary: "₹12,000 - ₹18,000/month",
              postedDate: "2 days ago",
            },
          ].map((job, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{job.title}</CardTitle>
                    <CardDescription className="font-medium">{job.company}</CardDescription>
                  </div>
                  <Badge variant={job.type === "Internship" ? "default" : "secondary"}>{job.type}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm font-medium text-primary">
                    <Briefcase className="w-4 h-4 mr-2" />
                    {job.salary}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Posted {job.postedDate}</span>
                  <Button size="sm">Apply</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
