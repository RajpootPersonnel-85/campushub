"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"

export default function LeadsWidget() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  // Force bottom-right with highest priority
  useEffect(() => {
    if (!mounted || !wrapperRef.current) return
    const el = wrapperRef.current
    const css = [
      "position: fixed !important",
      "inset: auto auto 24px  auto !important",
      "right: 24px !important",
      "bottom: 24px !important",
      "left: auto !important",
      "top: auto !important",
      "width: 56px !important",
      "height: 56px !important",
      "z-index: 2147483000 !important",
      "margin: 0 !important",
      "transform: none !important",
      "direction: ltr !important",
    ].join("; ")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(el.style as any).cssText = css
    // Simple responsive adjustment
    const mq = window.matchMedia("(max-width: 640px)")
    const apply = () => {
      const offset = mq.matches ? 16 : 24
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ;(el.style as any).cssText = css.replaceAll("24px", `${offset}px`)
    }
    mq.addEventListener?.("change", apply)
    apply()
    return () => mq.removeEventListener?.("change", apply)
  }, [mounted])

  // form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [topic, setTopic] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [department, setDepartment] = useState("")
  const [priority, setPriority] = useState("normal")
  const [prefEmail, setPrefEmail] = useState(true)
  const [prefWhatsapp, setPrefWhatsapp] = useState(false)
  const [attachment, setAttachment] = useState<File | null>(null)
  const [website, setWebsite] = useState("") // honeypot

  async function submit() {
    if (!name || !email || !topic || !subject || !message) {
      toast({ title: "Please fill required fields", description: "Name, Email, Topic, Subject, Message are required.", variant: "destructive" })
      return
    }
    try {
      setLoading(true)
      const form = new FormData()
      form.set("name", name)
      form.set("email", email)
      if (phone) form.set("phone", phone)
      form.set("topic", topic)
      form.set("subject", subject)
      form.set("message", message)
      if (department) form.set("department", department)
      form.set("priority", priority)
      form.set("prefEmail", String(prefEmail))
      form.set("prefWhatsapp", String(prefWhatsapp))
      if (attachment) form.set("attachment", attachment)
      // honeypot
      if (website) form.set("website", website)

      const res = await fetch("/api/leads", { method: "POST", body: form })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data?.ok) {
        throw new Error(data?.message || "Submission failed")
      }
      toast({ title: "Thanks!", description: "We received your message and will get back soon." })
      // reset and close
      setName("")
      setEmail("")
      setPhone("")
      setTopic("")
      setSubject("")
      setMessage("")
      setDepartment("")
      setPriority("normal")
      setPrefEmail(true)
      setPrefWhatsapp(false)
      setAttachment(null)
      setWebsite("")
      setOpen(false)
    } catch (e: any) {
      toast({ title: "Could not send", description: e?.message || String(e), variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {mounted && createPortal(
        <div
          className="fixed"
          dir="ltr"
          ref={wrapperRef}
          style={{
            position: "fixed",
            top: "auto",
            left: "auto",
            right: "24px",
            bottom: "24px",
            width: "56px",
            height: "56px",
            transform: "none",
            margin: 0,
            zIndex: 2147483000,
            // logical fallbacks for RTL environments
            // @ts-ignore - CSS logical props
            insetInlineEnd: "24px",
            // @ts-ignore - CSS logical props
            insetInlineStart: "auto",
          } as any}
        >
          <span className="pointer-events-none absolute inset-0 inline-block h-14 w-14 rounded-full bg-primary/30 animate-ping" />
          <Button
            aria-label={open ? "Close chat" : "Talk to us"}
            title={open ? "Close" : "Talk to us"}
            aria-pressed={open}
            className="relative h-14 w-14 rounded-full shadow-xl bg-primary text-primary-foreground hover:shadow-2xl transition-transform duration-200 hover:scale-105 ring-2 ring-primary/30 ring-offset-2"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          </Button>
        </div>,
        document.body
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md rounded-l-2xl border-l bg-background/95 backdrop-blur p-0 flex flex-col">
          <SheetHeader className="px-6 pt-6 shrink-0">
            <SheetTitle>We're ready to assist you!</SheetTitle>
            <SheetDescription className="text-xs">Press Esc to close</SheetDescription>
          </SheetHeader>

          <div className="mt-2 px-4 pb-6 sm:px-6 flex-1 overflow-y-auto">
            <div className="bg-card border rounded-xl shadow-sm p-4 sm:p-5 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="lead_name">Name *</Label>
                  <Input id="lead_name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lead_email">Email *</Label>
                  <Input id="lead_email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lead_phone">Phone</Label>
                  <Input id="lead_phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lead_topic">Topic *</Label>
                  <Input id="lead_topic" placeholder="e.g., Partnerships, Support" value={topic} onChange={(e) => setTopic(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lead_subject">Subject *</Label>
                  <Input id="lead_subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lead_message">Message *</Label>
                  <Textarea id="lead_message" rows={5} value={message} onChange={(e) => setMessage(e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="lead_department">Department</Label>
                    <Input id="lead_department" placeholder="e.g., Sales, Support" value={department} onChange={(e) => setDepartment(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="lead_priority">Priority</Label>
                    <Input id="lead_priority" placeholder="normal|urgent" value={priority} onChange={(e) => setPriority(e.target.value)} />
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox id="lead_pref_email" checked={prefEmail} onCheckedChange={(v) => setPrefEmail(Boolean(v))} />
                    <Label htmlFor="lead_pref_email">Prefer Email</Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Checkbox id="lead_pref_whatsapp" checked={prefWhatsapp} onCheckedChange={(v) => setPrefWhatsapp(Boolean(v))} />
                    <Label htmlFor="lead_pref_whatsapp">Prefer WhatsApp</Label>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lead_attachment">Attachment (PNG/JPG/PDF, max 5MB)</Label>
                  <Input id="lead_attachment" type="file" accept="image/png,image/jpeg,application/pdf" onChange={(e) => setAttachment(e.target.files?.[0] || null)} />
                </div>
                {/* Honeypot */}
                <input type="text" name="website" aria-hidden="true" tabIndex={-1} className="hidden" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setOpen(false)} className="rounded-full">Cancel</Button>
                <Button onClick={submit} disabled={loading} className="rounded-full">{loading ? "Sending..." : "Start Chat"}</Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
