"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DataTable, { type Column } from "@/components/cms/DataTable"
import EntityDialog, { type FieldSpec } from "@/components/cms/EntityDialog"

type DealRow = {
  id: number
  title: string
  partner: string
  category: "Food" | "Books" | "Hostel" | "Travel" | "Other"
  discount: string
  status: "draft" | "published"
  updatedAt: string
  active?: boolean
}

const initialDeals: DealRow[] = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  title: ["Pizza Friday", "Book Bonanza", "Hostel Discount", "Metro Pass Offer"][i % 4],
  partner: ["Domino's", "CampusBookShop", "CampusStay", "MetroCorp"][i % 4],
  category: ["Food", "Books", "Hostel", "Travel"][i % 4] as DealRow["category"],
  discount: ["20% off", "Buy 2 Get 1", "₹500 off", "15% off"][i % 4],
  status: ["draft", "published"][i % 2] as DealRow["status"],
  updatedAt: new Date(Date.now() - i * 14e5).toISOString(),
  active: (["draft", "published"][i % 2] as DealRow["status"]) === "published",
}))

export default function CmsDealsListPage() {
  const [rows, setRows] = useState<DealRow[]>(initialDeals)
  const [addOpen, setAddOpen] = useState(false)
  const [status, setStatus] = useState<string>("all")

  const columns: Column<DealRow>[] = [
    { key: "title", header: "Title", className: "min-w-[220px]", sortable: true },
    { key: "partner", header: "Partner", sortable: true },
    { key: "category", header: "Category", sortable: true },
    { key: "discount", header: "Discount" },
    { key: "active", header: "Active", sortable: true, render: (r) => (
      <label className="inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={!!r.active}
          onChange={(e) => toggleActive(r.id, e.target.checked)}
          aria-label={`Set ${r.title} ${r.active ? "inactive" : "active"}`}
        />
        <span className={r.active ? "text-green-600" : "text-muted-foreground"}>{r.active ? "Active" : "Inactive"}</span>
      </label>
    ) },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <span className={`px-2 py-0.5 rounded text-xs ${r.status === "published" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>{r.status}</span>
      ),
    },
    { key: "updatedAt", header: "Updated", sortable: true, sortAccessor: (r) => +new Date(r.updatedAt), render: (r) => new Date(r.updatedAt).toLocaleString() },
    {
      key: "actions",
      header: "",
      className: "w-[160px]",
      render: (r) => (
        <div className="flex justify-end gap-2">
          <Link href={`/cms/deals/${r.id}/edit`}><Button size="sm" variant="outline">Edit</Button></Link>
          <Button size="sm" variant="outline" onClick={() => onDelete(r.id)}>Delete</Button>
        </div>
      ),
    },
  ]

  function onDelete(id: number) { setRows((prev) => prev.filter((x) => x.id !== id)) }

  const addSchema: FieldSpec[] = [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "partner", label: "Partner", type: "text", required: true },
    { name: "category", label: "Category", type: "select", options: ["Food","Books","Hostel","Travel","Other"].map(v=>({label:v,value:v})) },
    { name: "discount", label: "Discount", type: "text", placeholder: "e.g., 20% off" },
    { name: "status", label: "Status", type: "select", options: ["draft","published"].map(v=>({label:v,value:v})) },
    { name: "active", label: "Active", type: "select", options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ] },
  ]

  async function onAdd(values: Record<string, any>) {
    const row: DealRow = {
      id: (rows.at(0)?.id ?? 0) + Math.ceil(Math.random() * 1000),
      title: values.title,
      partner: values.partner,
      category: (values.category as DealRow["category"]) ?? "Other",
      discount: values.discount ?? "",
      status: (values.status as DealRow["status"]) ?? "draft",
      updatedAt: new Date().toISOString(),
      active: values.active ? values.active === "true" : (values.status === "published"),
    }
    setRows((prev) => [row, ...prev])
  }

  function toggleActive(id: number, next: boolean) {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, active: next } : r))
  }

  const searchable = useMemo(() => ["title", "partner", "category"], [])

  const filteredRows = useMemo(() => {
    if (status === "all") return rows
    return rows.filter((r) => r.status === status)
  }, [rows, status])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Deals</h1>
        <div className="flex gap-2">
          <Button onClick={() => setAddOpen(true)}>Add Deal</Button>
        </div>
      </div>

      <DataTable<DealRow>
        columns={columns}
        rows={filteredRows}
        rowKey={(r) => String(r.id)}
        searchableKeys={searchable}
        rightActions={(
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        )}
      />

      <EntityDialog<any>
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add Deal"
        submitLabel="Create"
        schema={addSchema}
        onSubmit={onAdd}
      />
    </div>
  )
}
