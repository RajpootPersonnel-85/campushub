"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { CalendarClock, Shield } from "lucide-react"

export default function CounselingRequestPage() {
  const { toast } = useToast()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [preference, setPreference] = useState("mentor")
  const [availability, setAvailability] = useState("")
  const [notes, setNotes] = useState("")
  const [consent, setConsent] = useState(false)

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you can POST to your backend. For now we just toast and console.log
    console.log("Counseling request", { fullName, email, phone, preference, availability, notes })
    toast({ title: "Request submitted", description: "We'll reach out to you shortly to confirm a slot." })
    setFullName("")
    setEmail("")
    setPhone("")
    setPreference("mentor")
    setAvailability("")
    setNotes("")
    setConsent(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold">Request Counseling</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Choose a mentor/senior or a partnered psychologist. We will match you and share a time slot.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarClock className="w-4 h-4" /> Your Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={submit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="preference">I want to talk to</Label>
                    <Select value={preference} onValueChange={setPreference}>
                      <SelectTrigger id="preference">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mentor">Mentor / Senior</SelectItem>
                        <SelectItem value="psychologist">Partnered Psychologist</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="availability">Preferred time slots</Label>
                  <Input
                    id="availability"
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    placeholder="e.g., Weekdays after 6 PM, Sat morning"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Anything you want to share (optional)</Label>
                  <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} />
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox id="consent" checked={consent} onCheckedChange={(v) => setConsent(!!v)} />
                  <Label htmlFor="consent" className="text-sm">
                    I agree to be contacted about my request. I understand this is a supportive service and not a
                    substitute for medical care.
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <Button type="submit" disabled={!consent}>
                    Submit Request
                  </Button>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" /> Your details are used only to arrange the session.
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
