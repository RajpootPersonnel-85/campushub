import { NextResponse } from "next/server"

const MAX_FILE_BYTES = 5 * 1024 * 1024 // ~5MB
const ALLOWED_MIME = new Set(["image/png", "image/jpeg", "image/jpg", "application/pdf"])

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || ""
    let payload: Record<string, any> = {}
    let attachment: File | null = null

    if (contentType.includes("multipart/form-data")) {
      const form = await req.formData()

      // Honeypot
      const website = (form.get("website") as string) || ""
      if (website) {
        return NextResponse.json({ ok: true })
      }

      for (const [k, v] of form.entries()) {
        if (k === "attachment" && v instanceof File) {
          attachment = v
        } else if (v instanceof File) {
          // ignore unexpected file fields
        } else {
          payload[k] = v
        }
      }
    } else if (contentType.includes("application/json")) {
      payload = await req.json()
    } else {
      // Fallback attempt
      try {
        payload = await req.json()
      } catch {}
    }

    const name = (payload.name || "").toString().trim()
    const email = (payload.email || "").toString().trim()
    const topic = (payload.topic || "").toString().trim()
    const subject = (payload.subject || "").toString().trim()
    const message = (payload.message || "").toString().trim()
    const phone = (payload.phone || "").toString().trim()
    const priority = (payload.priority || "normal").toString().trim()
    const department = (payload.department || "").toString().trim()
    const prefEmail = Boolean(payload.prefEmail)
    const prefWhatsapp = Boolean(payload.prefWhatsapp)

    if (!name || !email || !topic || !subject || !message) {
      return NextResponse.json({ ok: false, message: "Missing required fields" }, { status: 400 })
    }

    // Attachment checks
    let attachmentMeta: Record<string, any> | undefined
    if (attachment) {
      if (attachment.size > MAX_FILE_BYTES) {
        return NextResponse.json({ ok: false, message: "Attachment too large (max 5MB)" }, { status: 400 })
      }
      if (!ALLOWED_MIME.has(attachment.type)) {
        return NextResponse.json({ ok: false, message: "Unsupported attachment type" }, { status: 400 })
      }
      // In real usage, upload to storage here
      attachmentMeta = {
        name: attachment.name,
        type: attachment.type,
        size: attachment.size,
      }
    }

    const record = {
      name,
      email,
      phone,
      topic,
      priority,
      department,
      subject,
      message,
      prefEmail,
      prefWhatsapp,
      attachment: attachmentMeta,
      receivedAt: new Date().toISOString(),
      userAgent: req.headers.get("user-agent") || undefined,
      referer: req.headers.get("referer") || undefined,
    }

    // TODO: Persist to DB/CRM or send email/Slack
    console.log("Lead submission:", record)

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("Lead submission error:", err)
    return NextResponse.json({ ok: false, message: "Invalid request" }, { status: 400 })
  }
}
