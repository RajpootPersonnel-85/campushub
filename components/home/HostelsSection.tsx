"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star } from "lucide-react"

export default function HostelsSection() {
  return (
    <section id="hostels" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">🏠 PG/Hostel Finder</h2>
            <p className="text-muted-foreground">Find your perfect home away from home</p>
          </div>
          <Link href="/hostels">
            <Button variant="outline">View All Properties</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {[
            { name: "Green Valley PG", price: "₹8,500/month", rating: 4.7, distance: "0.5 km", features: ["WiFi", "Food", "AC"] },
            { name: "Student Paradise", price: "₹7,200/month", rating: 4.5, distance: "1.2 km", features: ["WiFi", "Food", "Gym"] },
            { name: "Campus Heights", price: "₹9,800/month", rating: 4.8, distance: "0.8 km", features: ["WiFi", "Food", "AC", "Laundry"] },
          ].map((hostel, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-muted rounded-t-lg relative overflow-hidden">
                <Image
                  src={`/abstract-geometric-shapes.png?height=200&width=350&query=${encodeURIComponent(hostel.name)}%20hostel%20building%20exterior`}
                  alt={hostel.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 33vw"
                  className="object-cover rounded-t-lg"
                  loading="lazy"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{hostel.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{hostel.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-bold text-primary">{hostel.price}</span>
                  <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{hostel.distance}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {hostel.features.map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
