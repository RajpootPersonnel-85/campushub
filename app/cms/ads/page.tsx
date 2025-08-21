"use client"

import { useEffect, useMemo, useState } from "react"
import DataTable, { Column } from "@/components/cms/DataTable"
import EntityDialog, { type FieldSpec } from "@/components/cms/EntityDialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export type AdFormat = "leaderboard" | "rectangle" | "hero"

export type AdRecord = {
  id: string
  format: AdFormat
  href?: string
  img?: string
  bg?: string
  text?: string
  video?: string
  poster?: string
  active?: boolean
  position?: string
  order?: number
}

export default function CmsAdsPage() {
  const [items, setItems] = useState<AdRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [selected, setSelected] = useState<string[]>([])
  const [viewOpen, setViewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [current, setCurrent] = useState<AdRecord | null>(null)

  async function load() {
    setLoading(true)
    try {
      const res = await fetch("/api/ads", { cache: "no-store" })
      const json = await res.json()
      if (json.ok) setItems(json.items)
    } finally {
      setLoading(false)
    }
  }

  function openView(row: AdRecord) { setCurrent(row); setViewOpen(true) }
  function openEdit(row: AdRecord) { setCurrent(row); setEditOpen(true) }

  async function handleEdit(values: any) {
    if (!current) return
    const id = current.id
    const payload: Partial<AdRecord> = {
      format: (values.format as AdFormat) ?? current.format,
      href: values.href ?? current.href,
      img: values.img ?? current.img,
      bg: values.bg ?? current.bg,
      text: values.text ?? current.text,
      video: values.video ?? current.video,
      poster: values.poster ?? current.poster,
      active: values.active ? values.active === "true" : current.active,
      position: values.position ?? current.position,
      order: values.order != null ? Number(values.order) : current.order,
    }
    await fetch(`/api/ads/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    await load()
  }

  useEffect(() => { load() }, [])

  const columns: Column<AdRecord>[] = [
    { key: "id", header: "ID", sortable: true },
    { key: "position", header: "Position", sortable: true },
    { key: "format", header: "Format", sortable: true },
    { key: "order", header: "Order", sortable: true, sortAccessor: (r) => r.order ?? 0 },
    { key: "preview", header: "Preview", render: (r) => (
      <div className="flex items-center gap-2">
        {r.img ? <span className="text-xs text-muted-foreground">🖼️ {r.img}</span> : r.video ? <span className="text-xs">🎬 {r.video}</span> : <span className="text-xs">{r.text || r.bg || "-"}</span>}
      </div>
    ) },
    { key: "href", header: "Link" },
    { key: "active", header: "Active", sortable: true, render: (r) => (
      <label className="inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={!!r.active}
          onChange={(e) => toggleActive(r.id, e.target.checked)}
          aria-label={`Set ${r.id} ${r.active ? "inactive" : "active"}`}
        />
        <span className={r.active ? "text-green-600" : "text-muted-foreground"}>{r.active ? "Active" : "Inactive"}</span>
      </label>
    ) },
    { key: "actions", header: "Actions", render: (r) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => openView(r)}>View</Button>
        <Button size="sm" variant="outline" onClick={() => openEdit(r)}>Edit</Button>
        <Button size="sm" variant="outline" onClick={() => handleDelete(r.id)}>Delete</Button>
      </div>
    ) },
  ]

  const searchable: (keyof AdRecord | string)[] = ["id", "position", "href", "text"]

  const fields: FieldSpec[] = [
    { name: "id", label: "ID", type: "text", required: true, placeholder: "Unique ID (e.g. home_h8)" },
    { name: "position", label: "Position", type: "select", required: true, options: [
      { label: "Home Hero Top", value: "home_hero_top" },
      { label: "Home Hero Mid", value: "home_hero_mid" },
      { label: "Sidebar Rectangle", value: "sidebar_rect" },
    ]},
    { name: "format", label: "Format", type: "select", required: true, options: [
      { label: "Hero", value: "hero" },
      { label: "Leaderboard", value: "leaderboard" },
      { label: "Rectangle", value: "rectangle" },
    ] },
    { name: "order", label: "Order", type: "number", placeholder: "Display order (smaller first)" },
    { name: "active", label: "Active", type: "select", options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ] },
    { name: "href", label: "Link", type: "text", placeholder: "https://... or /internal" },
    { name: "img", label: "Image URL", type: "text", placeholder: "/banner.png" },
    { name: "video", label: "Video URL", type: "text", placeholder: "/promo.mp4" },
    { name: "poster", label: "Poster Image", type: "text", placeholder: "/promo-poster.jpg" },
    { name: "bg", label: "Background CSS", type: "text", placeholder: "linear-gradient(...)" },
    { name: "text", label: "Fallback Text", type: "text", placeholder: "Sponsored / message" },
  ]

  // Use same schema for editing
  const editFields: FieldSpec[] = fields

  async function handleAdd(values: any) {
    const payload: AdRecord = {
      id: values.id,
      format: values.format as AdFormat,
      href: values.href || undefined,
      img: values.img || undefined,
      bg: values.bg || undefined,
      text: values.text || undefined,
      video: values.video || undefined,
      poster: values.poster || undefined,
      active: values.active ? values.active === "true" : true,
      position: values.position,
      order: values.order ? Number(values.order) : 0,
    }
    await fetch("/api/ads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    await load()
  }

  async function handleDelete(id: string) {
    await fetch(`/api/ads/${id}`, { method: "DELETE" })
    await load()
  }

  async function toggleActive(id: string, next: boolean) {
    // optimistic update
    setItems((prev) => prev.map((it) => it.id === id ? { ...it, active: next } : it))
    const res = await fetch(`/api/ads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: next }),
    })
    const json = await res.json().catch(() => ({ ok: false }))
    if (!json?.ok) {
      // rollback
      setItems((prev) => prev.map((it) => it.id === id ? { ...it, active: !next } : it))
    }
  }

  async function handleBulkDelete() {
    const ids = selected
    for (const id of ids) {
      await fetch(`/api/ads/${id}`, { method: "DELETE" })
    }
    setSelected([])
    await load()
  }

  const rightActions = (
    <div className="flex items-center gap-2">
      <Button onClick={() => setAddOpen(true)}>Add Ad</Button>
      <Button variant="outline" onClick={load} disabled={loading}>{loading ? "Refreshing..." : "Refresh"}</Button>
    </div>
  )

  const bulkActions = (
    <div className="flex items-center gap-2">
      <Button variant="destructive" onClick={handleBulkDelete}>Delete Selected</Button>
    </div>
  )

  const rowKey = (r: AdRecord) => r.id

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Ads</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Manage promotional banners and placements. Supported formats: hero, leaderboard, rectangle. Use positions to control where ads render on the site.</p>
        </CardContent>
      </Card>

      <DataTable
        columns={columns}
        rows={items}
        rowKey={(r) => rowKey(r)}
        searchableKeys={searchable}
        rightActions={rightActions}
        selectable
        onSelectionChange={setSelected}
        bulkActions={bulkActions}
      />

      <EntityDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add Ad"
        submitLabel="Create"
        schema={fields}
        onSubmit={handleAdd}
      />

      {current && (
        <EntityDialog
          open={viewOpen}
          onOpenChange={(o) => { setViewOpen(o); if (!o) setCurrent(null) }}
          title={`View: ${current.id}`}
          readOnly
          schema={editFields}
          initial={{
            id: current.id,
            position: current.position ?? "",
            format: current.format,
            order: current.order ?? 0,
            active: current.active ? "true" : "false",
            href: current.href ?? "",
            img: current.img ?? "",
            video: current.video ?? "",
            poster: current.poster ?? "",
            bg: current.bg ?? "",
            text: current.text ?? "",
          }}
          onSubmit={() => {}}
        />
      )}

      {current && (
        <EntityDialog
          open={editOpen}
          onOpenChange={(o) => { setEditOpen(o); if (!o) setCurrent(null) }}
          title={`Edit: ${current.id}`}
          submitLabel="Save"
          schema={editFields}
          initial={{
            id: current.id,
            position: current.position ?? "",
            format: current.format,
            order: current.order ?? 0,
            active: current.active ? "true" : "false",
            href: current.href ?? "",
            img: current.img ?? "",
            video: current.video ?? "",
            poster: current.poster ?? "",
            bg: current.bg ?? "",
            text: current.text ?? "",
          }}
          onSubmit={handleEdit}
        />
      )}
    </div>
  )
}
