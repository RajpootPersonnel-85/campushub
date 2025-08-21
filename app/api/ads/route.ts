import { NextResponse } from "next/server"
import { createAd, getAds, type AdRecord } from "@/lib/ads-store"

export async function GET() {
  const items = getAds()
  return NextResponse.json({ ok: true, items })
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const ad: AdRecord = {
      id: body.id,
      format: body.format,
      href: body.href,
      img: body.img,
      bg: body.bg,
      text: body.text,
      video: body.video,
      poster: body.poster,
      active: body.active ?? true,
      position: body.position,
      order: body.order ?? 0,
    }
    if (!ad.id || !ad.format) return NextResponse.json({ ok: false, error: "id and format are required" }, { status: 400 })
    createAd(ad)
    return NextResponse.json({ ok: true, item: ad })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 400 })
  }
}
