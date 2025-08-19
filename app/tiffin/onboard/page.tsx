"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TiffinOnboardPage() {
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    // TODO: send to backend
    setTimeout(() => {
      setSubmitting(false)
      alert("Thanks! We will verify and get back to you shortly.")
    }, 800)
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Onboard Your Tiffin Service</h1>
            <p className="text-muted-foreground">Share details so students can discover and subscribe to your meals.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Vendor Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Business Name</label>
                    <Input required placeholder="e.g., Maa's Kitchen" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">WhatsApp Number</label>
                    <Input required placeholder="e.g., +9190xxxxxxxx" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Primary Diet</label>
                    <Select defaultValue="veg">
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="veg">Vegetarian</SelectItem>
                        <SelectItem value="non-veg">Non-Veg</SelectItem>
                        <SelectItem value="jain">Jain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Locality</label>
                    <Select defaultValue="hostel">
                      <SelectTrigger>
                        <SelectValue placeholder="Area" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main-gate">Main Gate</SelectItem>
                        <SelectItem value="hostel">Hostel Area</SelectItem>
                        <SelectItem value="academic">Academic Block</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Base Price (₹/meal)</label>
                    <Input type="number" min={0} required placeholder="e.g., 90" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Delivery Window</label>
                    <Input placeholder="e.g., Lunch 12:30-2:30 • Dinner 7:30-9:30" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Weekly Menu (short)</label>
                  <Textarea rows={4} placeholder="Dal, Roti, Rice, Seasonal Sabzi, Salad..." />
                </div>
                <div>
                  <label className="text-sm font-medium">About / Special Notes</label>
                  <Textarea rows={3} placeholder="Hygienic kitchen, less oil on request, trial available, etc." />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="submit" disabled={submitting}>{submitting ? "Submitting..." : "Submit for Verification"}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
