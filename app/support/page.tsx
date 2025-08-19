"use client"

import { useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const SUBJECT_MAX = 120
const MESSAGE_MAX = 2000
const MAX_FILE_BYTES = 5 * 1024 * 1024 // 5MB
const ALLOWED_MIME = new Set(["image/png", "image/jpeg", "image/jpg", "application/pdf"])

export default function SupportPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [dragActive, setDragActive] = useState(false)
  const [fileMeta, setFileMeta] = useState<{ name: string; size: number; type: string } | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const subjectLeft = useMemo(() => SUBJECT_MAX - subject.length, [subject])
  const messageLeft = useMemo(() => MESSAGE_MAX - message.length, [message])

  function validateAndSetFile(file: File | null) {
    if (!file) {
      setFileMeta(null)
      setFileError(null)
      return true
    }
    if (file.size > MAX_FILE_BYTES) {
      setFileMeta(null)
      setFileError("File too large (max 5MB)")
      return false
    }
    if (!ALLOWED_MIME.has(file.type)) {
      setFileMeta(null)
      setFileError("Unsupported file type (only PNG, JPG, PDF)")
      return false
    }
    setFileMeta({ name: file.name, size: file.size, type: file.type })
    setFileError(null)
    return true
  }

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null
    validateAndSetFile(file)
  }

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    const f = e.dataTransfer.files?.[0]
    if (!f) return
    if (!validateAndSetFile(f)) return
    // Set the file onto the hidden input so it submits with FormData
    if (fileInputRef.current) {
      const dt = new DataTransfer()
      dt.items.add(f)
      fileInputRef.current.files = dt.files
    }
  }

  function onDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(true)
  }

  function onDragLeave(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
  }

  function clearFile() {
    setFileMeta(null)
    setFileError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const form = new FormData(e.currentTarget)
    // Honeypot
    if ((form.get("website") as string)?.length) {
      // likely bot; pretend success
      router.push("/support/thank-you")
      return
    }

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        body: form, // multipart with optional file
      })
      if (!res.ok) throw new Error("Failed to submit. Please try again.")
      router.push("/support/thank-you")
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Talk to us</h1>
          <p className="text-muted-foreground mb-8">
            Report issues, ask questions, inquire about ads and partnerships, or request support.
          </p>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Honeypot */}
            <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Name</label>
                <Input name="name" placeholder="Your name" required />
              </div>
              <div>
                <label className="block text-sm mb-1">Email</label>
                <Input type="email" name="email" placeholder="you@example.com" required />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Phone (optional)</label>
                <Input type="tel" name="phone" placeholder="+91 90000 00000" pattern="^[+0-9\-()\s]{7,}$" />
              </div>
              <div>
                <label className="block text-sm mb-1">Priority</label>
                <select name="priority" className="w-full rounded-md border border-border bg-background p-2 text-sm" defaultValue="normal">
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Topic</label>
                <select name="topic" required className="w-full rounded-md border border-border bg-background p-2 text-sm" defaultValue="issue">
                  <option value="issue">Report an issue</option>
                  <option value="query">General query</option>
                  <option value="ads">Ads & partnerships</option>
                  <option value="support">Support</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-1">Department</label>
                <select name="department" className="w-full rounded-md border border-border bg-background p-2 text-sm" defaultValue="product">
                  <option value="product">Product</option>
                  <option value="ads">Ads & Partnerships</option>
                  <option value="billing">Billing</option>
                  <option value="general">General</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm mb-1">Subject</label>
              <Input name="subject" placeholder="Short summary" required maxLength={SUBJECT_MAX} value={subject} onChange={(e) => setSubject(e.target.value)} />
              <div className="mt-1 text-xs text-muted-foreground">{subjectLeft} characters left</div>
            </div>

            <div>
              <label className="block text-sm mb-1">Message</label>
              <Textarea name="message" placeholder="Describe your request" className="min-h-[160px]" required maxLength={MESSAGE_MAX} value={message} onChange={(e) => setMessage(e.target.value)} />
              <div className="mt-1 text-xs text-muted-foreground">{messageLeft} characters left</div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1">Attachment (optional)</label>
                {/* Hidden native input to participate in form submission */}
                <input
                  ref={fileInputRef}
                  name="attachment"
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={onFileChange}
                />

                {/* Dropzone UI */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={onDrop}
                  onDragOver={onDragOver}
                  onDragEnter={onDragOver}
                  onDragLeave={onDragLeave}
                  className={
                    "group cursor-pointer rounded-md border text-sm p-4 transition bg-background/50 " +
                    (dragActive ? "border-primary ring-2 ring-primary/20" : "border-border hover:bg-accent/30")
                  }
                  role="button"
                  tabIndex={0}
                  aria-label="Upload attachment"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-muted-foreground">
                      <div className="font-medium text-foreground">Click to upload</div>
                      <div className="text-xs">or drag and drop PNG, JPG, or PDF (max 5MB)</div>
                    </div>
                    <Button type="button" variant="outline" className="shrink-0">Choose file</Button>
                  </div>
                  {fileMeta ? (
                    <div className="mt-3 flex items-center justify-between rounded-md bg-muted px-3 py-2">
                      <div className="truncate">
                        <span className="font-medium">{fileMeta.name}</span>
                        <span className="ml-2 text-xs text-muted-foreground">{(fileMeta.size / 1024).toFixed(0)} KB</span>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); clearFile() }}>Remove</Button>
                    </div>
                  ) : null}
                  {fileError ? (
                    <div className="mt-2 text-xs text-destructive">{fileError}</div>
                  ) : (
                    <div className="mt-2 text-xs text-muted-foreground">Max ~5MB. Screenshots help us resolve faster.</div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm mb-1">Preferred contact</label>
                <div className="flex items-center gap-4 text-sm">
                  <label className="inline-flex items-center gap-2"><input type="checkbox" name="prefEmail" defaultChecked /> Email</label>
                  <label className="inline-flex items-center gap-2"><input type="checkbox" name="prefWhatsapp" /> WhatsApp</label>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-2 text-sm">
              <input id="consent" name="consent" type="checkbox" className="mt-1 size-4" required />
              <label htmlFor="consent">I agree to be contacted regarding my request and consent to processing my data per the Privacy Policy.</label>
            </div>

            {error ? (
              <div className="text-sm text-destructive">{error}</div>
            ) : null}

            <div className="flex justify-between items-center">
              <p className="text-xs text-muted-foreground">Typical response time: within 24–48 hours.</p>
              <Button type="submit" disabled={submitting}>
                {submitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </form>

          <div className="mt-12 border-t pt-8">
            <h2 className="text-xl font-semibold mb-3">Quick help</h2>
            <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
              <li>For urgent ad queries, email us at <a href="mailto:ads@campushub.local" className="underline">ads@campushub.local</a></li>
              <li>Product troubleshooting tips: clear cache, update browser, and try again</li>
              <li>Billing questions? Include your payment reference or order ID</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
