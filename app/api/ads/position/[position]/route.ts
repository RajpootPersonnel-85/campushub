import { NextResponse } from "next/server"
import { getAdsByPosition } from "@/lib/ads-store"

export async function GET(_: Request, { params }: { params: Promise<{ position: string }> }) {
  const { position } = await params
  const items = getAdsByPosition(position)
  return NextResponse.json({ ok: true, items })
}
