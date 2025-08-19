"use client"

import React, { useEffect, useMemo, useState } from "react"
import { notFound, useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const ALL_SERVICES = [
  { id: "maas-kitchen", name: "Maa's Kitchen", base: 80 },
  { id: "healthy-bites", name: "Healthy Bites", base: 95 },
  { id: "spicebox", name: "SpiceBox", base: 110 },
] as const

export default function TiffinCheckout({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params)
  const router = useRouter()
  const search = useSearchParams()
  const svc = useMemo(() => ALL_SERVICES.find((s) => s.id === id), [id])
  if (!svc) return notFound()

  const [plan, setPlan] = useState<string>("weekly")
  const [start, setStart] = useState<string>("")
  const [address, setAddress] = useState<string>("")
  const [payment, setPayment] = useState<string>("upi")
  const [notes, setNotes] = useState<string>("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const p = (search.get("plan") || "").toLowerCase()
    if (p && ["daily", "weekly", "monthly"].includes(p)) {
      setPlan(p)
    }
  }, [search])

  const meals = plan === "daily" ? 1 : plan === "weekly" ? 7 : 28
  const total = meals * svc.base

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    // TODO: send to backend
    setTimeout(() => {
      setSubmitting(false)
      const q = new URLSearchParams({ plan, start, total: String(total) }).toString()
      router.push(`/tiffin/${id}/checkout/success?${q}`)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Checkout — {svc.name}</h1>
            <p className="text-muted-foreground">Choose your plan and delivery details</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Plan</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Select Plan</label>
                  <Select value={plan} onValueChange={setPlan}>
                    <SelectTrigger>
                      <SelectValue placeholder="Plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily (1 meal)</SelectItem>
                      <SelectItem value="weekly">Weekly (7 meals)</SelectItem>
                      <SelectItem value="monthly">Monthly (28 meals)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Start Date</label>
                  <Input type="date" required value={start} onChange={(e) => setStart(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Delivery</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Address</label>
                  <Textarea rows={3} required placeholder="Hostel name / Landmark, Street, City" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium">Special Notes (optional)</label>
                  <Textarea rows={2} placeholder="Less oil, no onion/garlic, call on arrival, etc." value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Method</label>
                  <Select value={payment} onValueChange={setPayment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Payment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="upi">UPI</SelectItem>
                      <SelectItem value="cod">Cash on Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Summary</label>
                  <div className="p-3 border rounded text-sm">{meals} meals × ₹{svc.base} = <span className="font-semibold">₹{total}</span></div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button type="submit" disabled={submitting}>{submitting ? "Processing..." : "Confirm Subscription"}</Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
