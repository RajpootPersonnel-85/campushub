"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DataTable, { type Column } from "@/components/cms/DataTable"
import EntityDialog, { type FieldSpec } from "@/components/cms/EntityDialog"

type WellbeingRow = {
  id: number
  title: string
  type: "Article" | "Tip" | "Event"
  status: "draft" | "published"
  updatedAt: string
  active?: boolean
}

const initialWB: WellbeingRow[] = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  title: ["Mindfulness Basics", "Exam Stress Tips", "Yoga Session", "Healthy Eating"][i % 4],
  type: ["Article", "Tip", "Event"][i % 3] as WellbeingRow["type"],
  status: ["draft", "published"][i % 2] as WellbeingRow["status"],
  updatedAt: new Date(Date.now() - i * 18e5).toISOString(),
  active: (["draft", "published"][i % 2] as WellbeingRow["status"]) === "published",
}))

export default function CmsWellbeingListPage() {
  const [rows, setRows] = useState<WellbeingRow[]>(initialWB)
  const [addOpen, setAddOpen] = useState(false)
  const [status, setStatus] = useState<string>("all")

  const columns: Column<WellbeingRow>[] = [
    { key: "title", header: "Title", className: "min-w-[220px]", sortable: true },
    { key: "type", header: "Type", sortable: true },
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
    { key: "status", header: "Status", render: (r) => (
      <span className={`px-2 py-0.5 rounded text-xs ${r.status === "published" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>{r.status}</span>
    ) },
    { key: "updatedAt", header: "Updated", sortable: true, sortAccessor: (r) => +new Date(r.updatedAt), render: (r) => new Date(r.updatedAt).toLocaleString() },
  ]

  const addSchema: FieldSpec[] = [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "type", label: "Type", type: "select", options: ["Article","Tip","Event"].map(v=>({label:v,value:v})) },
    { name: "status", label: "Status", type: "select", options: ["draft","published"].map(v=>({label:v,value:v})) },
    { name: "active", label: "Active", type: "select", options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ] },
  ]

  async function onAdd(values: Record<string, any>) {
    const row: WellbeingRow = {
      id: (rows.at(0)?.id ?? 0) + Math.ceil(Math.random() * 1000),
      title: values.title,
      type: (values.type as WellbeingRow["type"]) ?? "Article",
      status: (values.status as WellbeingRow["status"]) ?? "draft",
      updatedAt: new Date().toISOString(),
      active: values.active ? values.active === "true" : (values.status === "published"),
    }
    setRows((prev) => [row, ...prev])
  }

  function toggleActive(id: number, next: boolean) {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, active: next } : r))
  }

  const searchable = useMemo(() => ["title", "type"], [])
  const filteredRows = useMemo(() => status === "all" ? rows : rows.filter((r) => r.status === status), [rows, status])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Wellbeing</h1>
        <div className="flex gap-2">
          <Button onClick={() => setAddOpen(true)}>Add Item</Button>
        </div>
      </div>

      <DataTable<WellbeingRow>
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
      title="Add Wellbeing Item"
      submitLabel="Create"
      schema={addSchema}
      onSubmit={onAdd}
    />
    </div>
  )
}
