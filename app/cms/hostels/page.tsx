"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DataTable, { type Column } from "@/components/cms/DataTable"
import EntityDialog, { type FieldSpec } from "@/components/cms/EntityDialog"

type HostelRow = {
  id: number
  name: string
  location: string
  roomsAvailable: number
  pricePerMonth: number
  status: "draft" | "published"
  updatedAt: string
  active?: boolean
}

const initialHostels: HostelRow[] = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  name: ["Sunrise Residency", "GreenView Hostel", "City Nest", "Campus Stay"][i % 4],
  location: ["Sector 62", "Hinjewadi", "Koramangala", "Noida Sec 125"][i % 4],
  roomsAvailable: [2, 5, 0, 3][i % 4],
  pricePerMonth: [7000, 9000, 6500, 8000][i % 4],
  status: ["draft", "published"][i % 2] as HostelRow["status"],
  updatedAt: new Date(Date.now() - i * 20e5).toISOString(),
  active: (["draft", "published"][i % 2] as HostelRow["status"]) === "published",
}))

export default function CmsHostelsListPage() {
  const [rows, setRows] = useState<HostelRow[]>(initialHostels)
  const [addOpen, setAddOpen] = useState(false)
  const [status, setStatus] = useState<string>("all")

  const columns: Column<HostelRow>[] = [
    { key: "name", header: "Name", className: "min-w-[220px]", sortable: true },
    { key: "location", header: "Location", sortable: true },
    { key: "roomsAvailable", header: "Vacancy", sortable: true, render: (r) => `${r.roomsAvailable}` },
    { key: "pricePerMonth", header: "Price", sortable: true, render: (r) => `₹${r.pricePerMonth}/mo`, className: "text-right" },
    { key: "active", header: "Active", sortable: true, render: (r) => (
      <label className="inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={!!r.active}
          onChange={(e) => toggleActive(r.id, e.target.checked)}
          aria-label={`Set ${r.name} ${r.active ? "inactive" : "active"}`}
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
          <Link href={`/cms/hostels/${r.id}/edit`}><Button size="sm" variant="outline">Edit</Button></Link>
          <Button size="sm" variant="outline" onClick={() => onDelete(r.id)}>Delete</Button>
        </div>
      ),
    },
  ]

  function onDelete(id: number) { setRows((prev) => prev.filter((x) => x.id !== id)) }

  const addSchema: FieldSpec[] = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "location", label: "Location", type: "text", required: true },
    { name: "roomsAvailable", label: "Rooms Available", type: "number", required: true },
    { name: "pricePerMonth", label: "Price / month (₹)", type: "number", required: true },
    { name: "status", label: "Status", type: "select", options: ["draft","published"].map(v=>({label:v,value:v})) },
    { name: "active", label: "Active", type: "select", options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ] },
  ]

  async function onAdd(values: Record<string, any>) {
    const row: HostelRow = {
      id: (rows.at(0)?.id ?? 0) + Math.ceil(Math.random() * 1000),
      name: values.name,
      location: values.location,
      roomsAvailable: Number(values.roomsAvailable ?? 0),
      pricePerMonth: Number(values.pricePerMonth ?? 0),
      status: (values.status as HostelRow["status"]) ?? "draft",
      updatedAt: new Date().toISOString(),
      active: values.active ? values.active === "true" : (values.status === "published"),
    }
    setRows((prev) => [row, ...prev])
  }

  function toggleActive(id: number, next: boolean) {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, active: next } : r))
  }

  const searchable = useMemo(() => ["name", "location"], [])

  const filteredRows = useMemo(() => {
    if (status === "all") return rows
    return rows.filter((r) => r.status === status)
  }, [rows, status])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Hostels</h1>
        <div className="flex gap-2">
          <Button onClick={() => setAddOpen(true)}>Add Hostel</Button>
        </div>
      </div>

      <DataTable<HostelRow>
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
        title="Add Hostel"
        submitLabel="Create"
        schema={addSchema}
        onSubmit={onAdd}
      />
    </div>
  )
}
