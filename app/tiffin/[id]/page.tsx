"use client"

import { notFound, useSearchParams } from "next/navigation"
import React, { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Utensils, Star, MapPin, Phone, Clock } from "lucide-react"
import Link from "next/link"

const ALL_SERVICES = [
  {
    id: "maas-kitchen",
    name: "Maa's Kitchen",
    diet: "Veg",
    price: 80,
    rating: 4.7,
    distanceKm: 0.6,
    phone: "+919000011111",
    locality: "Main Gate",
    delivery: "Lunch 12:30-2:30 • Dinner 7:30-9:30",
    skip: "2 skip credits per week",
    menu: ["Dal Tadka", "Aloo Gobi", "Roti", "Rice", "Salad"],
  },
  {
    id: "healthy-bites",
    name: "Healthy Bites",
    diet: "Veg/Jain",
    price: 95,
    rating: 4.5,
    distanceKm: 1.1,
    phone: "+919000022222",
    locality: "Hostel Area",
    delivery: "Lunch 1:00-2:30 • Dinner 8:00-9:30",
    skip: "1 skip credit per week",
    menu: ["Paneer Bhurji", "Mix Veg", "Phulka", "Jeera Rice", "Buttermilk"],
  },
  {
    id: "spicebox",
    name: "SpiceBox",
    diet: "Veg/Non-Veg",
    price: 110,
    rating: 4.6,
    distanceKm: 0.9,
    phone: "+919000033333",
    locality: "Academic Block",
    delivery: "Lunch 12:00-2:00 • Dinner 7:00-9:00",
    skip: "No skip credits",
    menu: ["Chicken Curry", "Dal Fry", "Veg Pulao", "Roti", "Kheer (Fri)"]
  },
] as const

export default function TiffinDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const service = useMemo(() => ALL_SERVICES.find((s) => s.id === id), [id])
  const search = useSearchParams()
  const action = search.get("plan") // "trial" | "weekly" | null

  if (!service) return notFound()

  const waMsg = encodeURIComponent(
    `Hi, I'm interested in your tiffin service (${service.name}).\nPlan: ${action || "inquiry"}. Can you share details?`
  )
  const waLink = `https://wa.me/${service.phone.replace(/[^0-9]/g, "")}??text=${waMsg}`.replace("??", "?")

  return (
    <div className="min-h-screen bg-background">
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-1">🍱 {service.name}</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="secondary">{service.diet}</Badge>
              <span className="flex items-center gap-1"><Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {service.rating}</span>
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {service.distanceKm} km • {service.locality}</span>
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {service.delivery}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                <Utensils className="w-14 h-14 text-muted-foreground" />
              </div>
              <CardHeader>
                <CardTitle>Weekly Menu</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm list-disc pl-5">
                  {service.menu.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
                <p className="text-sm text-muted-foreground mt-3">Skip policy: {service.skip}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plans</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">1-Day Trial</div>
                    <div className="text-sm text-muted-foreground">Taste before you subscribe</div>
                  </div>
                  <Link href={`/tiffin/${service.id}?plan=trial`}>
                    <Button size="sm" variant="outline" className="bg-transparent">Start Trial</Button>
                  </Link>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Weekly Plan</div>
                    <div className="text-sm text-muted-foreground">7 meals • starting ₹{service.price}/meal</div>
                  </div>
                  <Link href={`/tiffin/${service.id}/checkout?plan=weekly`}>
                    <Button size="sm">Subscribe</Button>
                  </Link>
                </div>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="inline-block w-full">
                  <Button variant="outline" className="w-full bg-transparent"><Phone className="w-4 h-4 mr-2" /> WhatsApp</Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
