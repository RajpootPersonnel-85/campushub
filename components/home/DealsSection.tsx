"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gift } from "lucide-react"

export default function DealsSection() {
  return (
    <section id="deals" className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">🎁 Student Deals & Discounts</h2>
            <p className="text-muted-foreground">Exclusive offers for verified students</p>
            <Badge variant="secondary" className="mt-2">Coming in Phase 2</Badge>
          </div>
          <Link href="/deals">
            <Button className="bg-primary hover:bg-primary/90">View All Deals</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { title: "Zomato 20% Off for Students", company: "Zomato", discount: "20% OFF", validTill: "30 December 2025", category: "Food & Dining" },
            { title: "Amazon Prime Student", company: "Amazon", discount: "50% OFF", validTill: "Ongoing", category: "Shopping" },
            { title: "Domino's Student Special", company: "Domino's", discount: "Buy 1 Get 1", validTill: "20 January 2026", category: "Food & Dining" },
          ].map((deal, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                      <Gift className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{deal.title}</CardTitle>
                      <CardDescription className="font-medium">{deal.company}</CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">{deal.discount}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Gift className="w-4 h-4 mr-2" />
                    {deal.category}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span>Valid till {deal.validTill}</span>
                  </div>
                </div>

                <Button size="sm" className="w-full">Get Code</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
