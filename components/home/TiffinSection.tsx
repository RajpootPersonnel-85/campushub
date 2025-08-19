"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Utensils, Star, MapPin, Phone } from "lucide-react"

export default function TiffinSection() {
  return (
    <section id="tiffin" className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">🍱 Tiffin Services</h2>
            <p className="text-muted-foreground">Home-cooked meals and affordable plans near your campus</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/tiffin">
              <Button variant="outline">View All</Button>
            </Link>
            <Link href="/tiffin/submit">
              <Button className="bg-primary hover:bg-primary/90">List Your Tiffin</Button>
            </Link>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Diet" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="veg">Vegetarian</SelectItem>
              <SelectItem value="nonveg">Non-Veg</SelectItem>
              <SelectItem value="jain">Jain</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="distance">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="distance">Closest First</SelectItem>
              <SelectItem value="price">Price: Low to High</SelectItem>
              <SelectItem value="rating">Rating: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { id: "maas-kitchen", name: "Maa's Kitchen", diet: "Veg", price: 80, rating: 4.7, distanceKm: 0.6, phone: "+919000011111" },
            { id: "healthy-bites", name: "Healthy Bites", diet: "Veg/Jain", price: 95, rating: 4.5, distanceKm: 1.1, phone: "+919000022222" },
            { id: "spicebox", name: "SpiceBox", diet: "Veg/Non-Veg", price: 110, rating: 4.6, distanceKm: 0.9, phone: "+919000033333" },
          ].map((svc) => {
            const waMsg = encodeURIComponent(`Hi, I'm interested in ${svc.name} tiffin service.`)
            const wa = `https://wa.me/${svc.phone.replace(/[^0-9]/g, "")}?text=${waMsg}`
            return (
              <Card key={svc.id} className="hover:shadow-lg transition-shadow">
                <Link href={`/tiffin/${svc.id}`}>
                  <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                    <Utensils className="w-10 h-10 text-muted-foreground" />
                  </div>
                </Link>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link href={`/tiffin/${svc.id}`} className="font-semibold hover:underline">{svc.name}</Link>
                      <p className="text-xs text-muted-foreground">{svc.diet}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{svc.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-primary">₹{svc.price}/meal</span>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>{svc.distanceKm} km</span>
                    </div>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Link href={`/tiffin/${svc.id}?plan=trial`}><Button size="sm" variant="outline" className="bg-transparent">Try 1-Day</Button></Link>
                    <Link href={`/tiffin/${svc.id}?plan=weekly`}><Button size="sm">Subscribe Weekly</Button></Link>
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="ml-auto">
                      <Button size="sm" variant="outline" className="bg-transparent"><Phone className="w-4 h-4 mr-2" /> WhatsApp</Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
