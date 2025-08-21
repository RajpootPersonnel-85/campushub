"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DataTable, { type Column } from "@/components/cms/DataTable"
import EntityDialog, { type FieldSpec } from "@/components/cms/EntityDialog"

type LeadRow = {
  id: number
  name: string
  email: string
  topic: string
  subject: string
  status: "new" | "responded" | "closed" | "draft" | "published"
  createdAt: string
  active?: boolean
}

const initialLeads: LeadRow[] = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: ["Arjun Mehta", "Priya Kapoor", "Karan Patel"][i % 3],
  email: ["arjun@example.com", "priya@example.com", "karan@example.com"][i % 3],
  topic: ["Admissions", "Scholarships", "Hostels"][i % 3],
  subject: ["Query about CS program", "Scholarship details", "Room availability"][i % 3],
  status: (["new", "responded", "closed"][i % 3] as LeadRow["status"]) ?? "new",
  createdAt: new Date(Date.now() - i * 36e5).toISOString(),
  active: ((["draft", "published"][i % 2] as any) === "published") as boolean,
}))

export default function CmsLeadsListPage() {
  const [rows, setRows] = useState<LeadRow[]>(initialLeads)
  const [addOpen, setAddOpen] = useState(false)
  const [status, setStatus] = useState<string>("all")

  const columns: Column<LeadRow>[] = [
    { key: "name", header: "Name", className: "min-w-[200px]", sortable: true },
    { key: "email", header: "Email", sortable: true },
    { key: "topic", header: "Topic", sortable: true },
    { key: "subject", header: "Subject", className: "min-w-[260px]" },
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
    { key: "status", header: "Status", render: (r) => (
      <span className={`px-2 py-0.5 rounded text-xs ${r.status === "closed" ? "bg-gray-200 text-gray-800" : r.status === "responded" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"}`}>{r.status}</span>
    ) },
    { key: "createdAt", header: "Created", sortable: true, sortAccessor: (r) => +new Date(r.createdAt), render: (r) => new Date(r.createdAt).toLocaleString() },
    {
      key: "actions",
      header: "",
      className: "w-[160px]",
      render: (r) => (
        <div className="flex justify-end gap-2">
          <Link href={`/cms/leads/${r.id}`}><Button size="sm" variant="outline">View</Button></Link>
          <Button size="sm" variant="outline" onClick={() => onDelete(r.id)}>Delete</Button>
        </div>
      ),
    },
  ]

  function onDelete(id: number) { setRows((prev) => prev.filter((x) => x.id !== id)) }

  const addSchema: FieldSpec[] = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "email", label: "Email", type: "text", required: true },
    { name: "topic", label: "Topic", type: "text", required: true },
    { name: "subject", label: "Subject", type: "text", required: true },
    { name: "status", label: "Status", type: "select", options: ["new","responded","closed"].map(v=>({label:v,value:v})) },
    { name: "active", label: "Active", type: "select", options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ] },
  ]

  async function onAdd(values: Record<string, any>) {
    const row: LeadRow = {
      id: (rows.at(0)?.id ?? 0) + Math.ceil(Math.random() * 1000),
      name: values.name,
      email: values.email,
      topic: values.topic,
      subject: values.subject,
      status: (values.status as LeadRow["status"]) ?? "new",
      createdAt: new Date().toISOString(),
      active: values.active ? values.active === "true" : (values.status === "published"),
    }
    setRows((prev) => [row, ...prev])
  }

  function toggleActive(id: number, next: boolean) {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, active: next } : r))
  }

  const searchable = useMemo(() => ["name", "email", "topic", "subject"], [])
  const filteredRows = useMemo(() => status === "all" ? rows : rows.filter((r) => r.status === status), [rows, status])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Leads</h1>
        <div className="flex gap-2">
          <Button onClick={() => setAddOpen(true)}>Add Lead</Button>
        </div>
      </div>

      <DataTable<LeadRow>
        columns={columns}
        rows={filteredRows}
        rowKey={(r) => String(r.id)}
        searchableKeys={searchable}
        rightActions={(
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-48"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>
        )}
      />

      <EntityDialog<any>
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add Lead"
        submitLabel="Create"
        schema={addSchema}
        onSubmit={onAdd}
      />
    </div>
  )
}
