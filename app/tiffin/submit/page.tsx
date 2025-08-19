"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

export default function TiffinSubmitPage() {
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)

    // Collect form data
    const fd = new FormData(e.currentTarget)
    const payload = Object.fromEntries(fd.entries())

    // TODO: send to backend or Google Form. For now, we show a success toast.
    console.log("Tiffin submission:", payload)
    await new Promise((r) => setTimeout(r, 600))

    toast({ title: "Submitted!", description: "We'll review your listing and get back within 1-2 days." })
    setSubmitting(false)
    e.currentTarget.reset()
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">List Your Tiffin Service</h1>
            <p className="text-muted-foreground mt-1">Reach students near your campus with daily meals and plans.</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Provider Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Business / Kitchen Name</label>
                    <Input name="name" required placeholder="e.g., Maa's Kitchen" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Service Type</label>
                    <Select name="serviceType" defaultValue="home_cooked">
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="home_cooked">Home-cooked</SelectItem>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="cloud_kitchen">Cloud Kitchen</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Cuisine</label>
                    <Input name="cuisine" placeholder="North Indian, South Indian, Mixed..." />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Veg/Non-Veg</label>
                    <Select name="vegType" defaultValue="veg">
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="veg">Veg Only</SelectItem>
                        <SelectItem value="nonveg">Non-Veg Only</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Price per Meal (₹)</label>
                    <Input name="pricePerMeal" type="number" min={0} step="1" placeholder="80" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Monthly Plan (₹)</label>
                    <Input name="monthlyPlan" type="number" min={0} step="1" placeholder="2200" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Delivery Areas / Colleges</label>
                  <Textarea name="areas" placeholder="List neighbourhoods or colleges you cover" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Contact Person</label>
                    <Input name="contactName" placeholder="Your name" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone / WhatsApp</label>
                    <Input name="phone" type="tel" placeholder="98765 43210" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium">Address</label>
                    <Input name="address" placeholder="Street, city" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium">Website / Instagram</label>
                    <Input name="website" type="url" placeholder="https://instagram.com/yourpage" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Timings</label>
                    <Input name="timings" placeholder="Lunch: 12–3pm, Dinner: 7–10pm" />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Days</label>
                    <Input name="days" placeholder="Mon–Sat" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">Photos (optional)</label>
                  <Input name="photos" type="file" accept="image/*" multiple />
                  <p className="text-xs text-muted-foreground mt-1">You can upload menu or kitchen images. (Not stored yet.)</p>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox id="terms" name="terms" required />
                  <label htmlFor="terms" className="text-sm text-muted-foreground">I confirm the details are accurate and agree to be contacted.</label>
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={submitting} className="bg-primary hover:bg-primary/90">
                    {submitting ? "Submitting..." : "Submit for Review"}
                  </Button>
                  <Button type="reset" variant="outline">Reset</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
