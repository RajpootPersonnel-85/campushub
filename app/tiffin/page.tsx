"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Utensils, Star, MapPin, Phone } from "lucide-react"
import Link from "next/link"

export default function TiffinPage() {
  const services = [
    { id: "maas-kitchen", name: "Maa's Kitchen", diet: "Veg", price: 80, rating: 4.7, distanceKm: 0.6, phone: "+919000011111", locality: "Main Gate" },
    { id: "healthy-bites", name: "Healthy Bites", diet: "Veg/Jain", price: 95, rating: 4.5, distanceKm: 1.1, phone: "+919000022222", locality: "Hostel Area" },
    { id: "spicebox", name: "SpiceBox", diet: "Veg/Non-Veg", price: 110, rating: 4.6, distanceKm: 0.9, phone: "+919000033333", locality: "Academic Block" },
    { id: "messmate", name: "MessMate", diet: "Veg", price: 70, rating: 4.2, distanceKm: 1.8, phone: "+919000044444", locality: "Hostel Area" },
  ] as const

  const [q, setQ] = useState("")
  const [diet, setDiet] = useState<string>("all")
  const [sort, setSort] = useState<string>("distance")
  const [area, setArea] = useState<string>("all")

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    let arr = services.filter((s) => {
      const matchesQ = query ? s.name.toLowerCase().includes(query) : true
      const matchesDiet =
        diet === "all"
          ? true
          : diet === "veg"
          ? s.diet.toLowerCase().includes("veg") && !s.diet.toLowerCase().includes("non-veg")
          : s.diet.toLowerCase().includes(diet)
      const matchesArea = area === "all" ? true : s.locality.toLowerCase() === area
      return matchesQ && matchesDiet && matchesArea
    })

    if (sort === "distance") arr = [...arr].sort((a, b) => a.distanceKm - b.distanceKm)
    if (sort === "price") arr = [...arr].sort((a, b) => a.price - b.price)
    if (sort === "rating") arr = [...arr].sort((a, b) => b.rating - a.rating)

    return arr
  }, [q, diet, area, sort, services])

  return (
    <div className="min-h-screen bg-background">
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">🍱 Tiffin Services</h1>
            <p className="text-muted-foreground">Find affordable, home-cooked meals near your campus</p>
          </div>

          <div className="mb-6 flex flex-wrap gap-3 items-center">
            <Input
              placeholder="Search services"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full sm:w-64"
            />
            <Select value={area} onValueChange={setArea}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                <SelectItem value="main gate">Main Gate</SelectItem>
                <SelectItem value="hostel area">Hostel Area</SelectItem>
                <SelectItem value="academic block">Academic Block</SelectItem>
              </SelectContent>
            </Select>
            <Select value={diet} onValueChange={setDiet}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Diet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="veg">Vegetarian</SelectItem>
                <SelectItem value="non-veg">Non-Veg</SelectItem>
                <SelectItem value="jain">Jain</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
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
            {filtered.map((svc) => {
              const waMsg = encodeURIComponent(`Hi, I'm interested in ${svc.name} tiffin service.`)
              const wa = `https://wa.me/${svc.phone.replace(/[^0-9]/g, "")}?text=${waMsg}`
              return (
                <Card key={svc.id} className="hover:shadow-lg transition-shadow">
                  <Link href={`/tiffin/${svc.id}`}>
                    <div className="aspect-video bg-muted rounded-t-lg flex items-center justify-center">
                      <Utensils className="w-10 h-10 text-muted-foreground" />
                    </div>
                  </Link>
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <Link href={`/tiffin/${svc.id}`} className="hover:underline">{svc.name}</Link>
                      <span className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" /> {svc.rating}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{svc.diet}</Badge>
                        <span className="text-muted-foreground">{svc.locality}</span>
                      </div>
                      <span className="font-medium text-primary">₹{svc.price}/meal</span>
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm">
                      <MapPin className="w-4 h-4 mr-1" /> {svc.distanceKm} km away
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Link href={`/tiffin/${svc.id}?plan=trial`}><Button size="sm" variant="outline" className="bg-transparent">Try 1-Day</Button></Link>
                      <Link href={`/tiffin/${svc.id}/checkout?plan=weekly`}><Button size="sm">Subscribe Weekly</Button></Link>
                      <a href={wa} target="_blank" rel="noopener noreferrer" className="ml-auto">
                        <Button size="sm" variant="outline" className="bg-transparent"><Phone className="w-4 h-4 mr-2" /> WhatsApp</Button>
                      </a>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="mt-10 p-4 border rounded flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <div className="font-medium">Are you a tiffin vendor?</div>
              <div className="text-sm text-muted-foreground">List your service and reach students on campus.</div>
            </div>
            <Link href="/tiffin/onboard"><Button>Onboard Your Service</Button></Link>
          </div>
        </div>
      </section>
    </div>
  )
}
