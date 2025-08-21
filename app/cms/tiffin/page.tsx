"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DataTable, { type Column } from "@/components/cms/DataTable"
import EntityDialog, { type FieldSpec } from "@/components/cms/EntityDialog"

type TiffinRow = {
  id: number
  vendor: string
  planName: string
  pricePerMonth: number
  veg: boolean
  status: "draft" | "published"
  updatedAt: string
  active?: boolean
}

const initialTiffin: TiffinRow[] = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  vendor: ["HomeKitchen", "DailyMeals", "GreenBite", "Chef's Cart"][i % 4],
  planName: ["Basic", "Student Pack", "Healthy", "Premium"][i % 4],
  pricePerMonth: [2500, 2800, 3200, 3800][i % 4],
  veg: [true, true, false, true][i % 4],
  status: ["draft", "published"][i % 2] as TiffinRow["status"],
  updatedAt: new Date(Date.now() - i * 12e5).toISOString(),
  active: (["draft", "published"][i % 2] as TiffinRow["status"]) === "published",
}))

export default function CmsTiffinListPage() {
  const [rows, setRows] = useState<TiffinRow[]>(initialTiffin)
  const [addOpen, setAddOpen] = useState(false)
  const [status, setStatus] = useState<string>("all")

  const columns: Column<TiffinRow>[] = [
    { key: "vendor", header: "Vendor", className: "min-w-[200px]", sortable: true },
    { key: "planName", header: "Plan", sortable: true },
    { key: "pricePerMonth", header: "Price", sortable: true, render: (r) => `₹${r.pricePerMonth}/mo` },
    { key: "veg", header: "Veg", sortable: true, render: (r) => r.veg ? "Yes" : "No" },
    { key: "active", header: "Active", sortable: true, render: (r) => (
      <label className="inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={!!r.active}
          onChange={(e) => toggleActive(r.id, e.target.checked)}
          aria-label={`Set ${r.vendor} ${r.active ? "inactive" : "active"}`}
        />
        <span className={r.active ? "text-green-600" : "text-muted-foreground"}>{r.active ? "Active" : "Inactive"}</span>
      </label>
    ) },
    { key: "status", header: "Status", render: (r) => (
      <span className={`px-2 py-0.5 rounded text-xs ${r.status === "published" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>{r.status}</span>
    ) },
    { key: "updatedAt", header: "Updated", sortable: true, sortAccessor: (r) => +new Date(r.updatedAt), render: (r) => new Date(r.updatedAt).toLocaleString() },
  ]

  const addSchema: FieldSpec[] = [
    { name: "vendor", label: "Vendor", type: "text", required: true },
    { name: "planName", label: "Plan Name", type: "text", required: true },
    { name: "pricePerMonth", label: "Price / month (₹)", type: "number", required: true },
    { name: "veg", label: "Veg", type: "select", options: [
      { label: "Veg", value: "true" },
      { label: "Non-Veg", value: "false" },
    ] },
    { name: "status", label: "Status", type: "select", options: ["draft","published"].map(v=>({label:v,value:v})) },
    { name: "active", label: "Active", type: "select", options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ] },
  ]

  function onDelete(id: number) { setRows((prev) => prev.filter((x) => x.id !== id)) }

  async function onAdd(values: Record<string, any>) {
    const row: TiffinRow = {
      id: (rows.at(0)?.id ?? 0) + Math.ceil(Math.random() * 1000),
      vendor: values.vendor,
      planName: values.planName,
      pricePerMonth: Number(values.pricePerMonth ?? 0),
      veg: values.veg ? values.veg === "true" : true,
      status: (values.status as TiffinRow["status"]) ?? "draft",
      updatedAt: new Date().toISOString(),
      active: values.active ? values.active === "true" : (values.status === "published"),
    }
    setRows((prev) => [row, ...prev])
  }

  function toggleActive(id: number, next: boolean) {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, active: next } : r))
  }

  const searchable = useMemo(() => ["vendor", "planName"], [])
  const filteredRows = useMemo(() => status === "all" ? rows : rows.filter((r) => r.status === status), [rows, status])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Tiffin</h1>
        <div className="flex gap-2">
          <Button onClick={() => setAddOpen(true)}>Add Plan</Button>
        </div>
      </div>

      <DataTable<TiffinRow>
        columns={columns}
        rows={filteredRows}
        rowKey={(r) => String(r.id)}
        searchableKeys={searchable}
        rightActions={(<Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>)}
      />

      <EntityDialog<any>
      open={addOpen}
      onOpenChange={setAddOpen}
      title="Add Tiffin Plan"
      submitLabel="Create"
      schema={addSchema}
      onSubmit={onAdd}
    />
    </div>
  )
}
