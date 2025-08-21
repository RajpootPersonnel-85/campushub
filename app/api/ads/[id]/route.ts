import { NextResponse } from "next/server"
import { deleteAd, getAd, updateAd } from "@/lib/ads-store"

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const item = getAd(params.id)
  if (!item) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 })
  return NextResponse.json({ ok: true, item })
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const patch = await req.json()
    const item = updateAd(params.id, patch)
    if (!item) return NextResponse.json({ ok: false, error: "not_found" }, { status: 404 })
    return NextResponse.json({ ok: true, item })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: String(e?.message || e) }, { status: 400 })
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const ok = deleteAd(params.id)
  return NextResponse.json({ ok })
}
