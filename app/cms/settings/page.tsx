"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CmsSettingsPage() {
  const [form, setForm] = useState({
    siteName: "CampusHub",
    contactEmail: "support@campushub.example",
    supportPhone: "+91 98765 43210",
    theme: "system" as "light" | "dark" | "system",
    homepageMessage: "Welcome to CampusHub!",
  })
  const [saving, setSaving] = useState(false)

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((p) => ({ ...p, [k]: v }))
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    try {
      // TODO: integrate with settings API
      await new Promise((r) => setTimeout(r, 600))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Site Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-2">
              <Label htmlFor="siteName">Site Name</Label>
              <Input id="siteName" value={form.siteName} onChange={(e) => update("siteName", e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input id="contactEmail" type="email" value={form.contactEmail} onChange={(e) => update("contactEmail", e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="supportPhone">Support Phone</Label>
              <Input id="supportPhone" value={form.supportPhone} onChange={(e) => update("supportPhone", e.target.value)} />
            </div>

            <div className="grid gap-2">
              <Label>Theme</Label>
              <Select value={form.theme} onValueChange={(v) => update("theme", v as any)}>
                <SelectTrigger className="w-[200px]"><SelectValue placeholder="Theme" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">System</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="homepageMessage">Homepage Message</Label>
              <Textarea id="homepageMessage" rows={4} value={form.homepageMessage} onChange={(e) => update("homepageMessage", e.target.value)} />
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
