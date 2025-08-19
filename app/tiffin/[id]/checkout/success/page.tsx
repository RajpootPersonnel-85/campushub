"use client"

import React from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function TiffinCheckoutSuccess({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const search = useSearchParams()
  const plan = search.get("plan") || "weekly"
  const start = search.get("start") || ""
  const total = search.get("total") || ""

  return (
    <div className="min-h-screen bg-background">
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-2xl">Subscription Confirmed 🎉</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-muted-foreground">Thanks for subscribing! Here are your details:</p>
              <div className="p-4 rounded border text-left text-sm space-y-1">
                <div><span className="font-medium">Service:</span> {id}</div>
                <div><span className="font-medium">Plan:</span> {plan}</div>
                {start && <div><span className="font-medium">Start:</span> {start}</div>}
                {total && <div><span className="font-medium">Total Paid:</span> ₹{total}</div>}
              </div>
              <div className="pt-4 flex justify-center gap-2">
                <Link href={`/tiffin/${id}`}><Button variant="outline" className="bg-transparent">Back to Service</Button></Link>
                <Link href={`/tiffin`}><Button>Explore More Services</Button></Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
