"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DataTable, { type Column } from "@/components/cms/DataTable"
import EntityDialog, { type FieldSpec } from "@/components/cms/EntityDialog"

type JobRow = {
  id: number
  title: string
  company: string
  location: string
  type: "Full-time" | "Internship" | "Part-time"
  salary?: string
  status: "draft" | "published"
  updatedAt: string
  active?: boolean
}

const initialJobs: JobRow[] = Array.from({ length: 9 }).map((_, i) => ({
  id: i + 1,
  title: ["Frontend Developer", "Data Analyst", "Mechanical Intern"][i % 3],
  company: ["TechNova", "InsightWorks", "MechaCorp"][i % 3],
  location: ["Bengaluru", "Hyderabad", "Pune"][i % 3],
  type: ["Full-time", "Internship", "Part-time"][i % 3] as JobRow["type"],
  salary: ["₹10-14 LPA", "₹8-11 LPA", "₹20k/mo"][i % 3],
  status: ["draft", "published"][i % 2] as JobRow["status"],
  updatedAt: new Date(Date.now() - i * 24e5).toISOString(),
  active: (["draft", "published"][i % 2] as JobRow["status"]) === "published",
}))

export default function CmsJobsListPage() {
  const [rows, setRows] = useState<JobRow[]>(initialJobs)
  const [addOpen, setAddOpen] = useState(false)
  const [status, setStatus] = useState<string>("all")
  const [viewOpen, setViewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [current, setCurrent] = useState<JobRow | null>(null)

  const columns: Column<JobRow>[] = [
    {
      key: "title",
      header: "Role",
      className: "min-w-[260px]",
      render: (r) => (
        <div>
          <div className="font-medium">{r.title}</div>
          <div className="text-xs text-muted-foreground">{r.company} • {r.location}</div>
        </div>
      ),
    },
    { key: "type", header: "Type", sortable: true },
    { key: "salary", header: "Salary" },
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
      className: "w-[200px]",
      render: (r) => (
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline" onClick={() => openView(r)}>View</Button>
          <Button size="sm" variant="outline" onClick={() => openEdit(r)}>Edit</Button>
          <Button size="sm" variant="outline" onClick={() => onDelete(r.id)}>Delete</Button>
        </div>
      ),
    },
  ]

  function onDelete(id: number) { setRows((prev) => prev.filter((x) => x.id !== id)) }

  function openView(row: JobRow) { setCurrent(row); setViewOpen(true) }
  function openEdit(row: JobRow) { setCurrent(row); setEditOpen(true) }

  const addSchema: FieldSpec[] = [
    { name: "title", label: "Job Title", type: "text", required: true },
    { name: "company", label: "Company", type: "text", required: true },
    { name: "location", label: "Location", type: "text", required: true },
    { name: "type", label: "Type", type: "select", options: ["Full-time","Internship","Part-time"].map(v=>({label:v,value:v})) },
    { name: "salary", label: "Salary Range", type: "text", placeholder: "e.g., ₹8-12 LPA or ₹25k/mo" },
    { name: "status", label: "Status", type: "select", options: ["draft","published"].map(v=>({label:v,value:v})) },
    { name: "active", label: "Active", type: "select", options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ] },
  ]

  // Use same schema for editing
  const editSchema: FieldSpec[] = addSchema

  async function onAdd(values: Record<string, any>) {
    const row: JobRow = {
      id: (rows.at(0)?.id ?? 0) + Math.ceil(Math.random() * 1000),
      title: values.title,
      company: values.company,
      location: values.location,
      type: (values.type as JobRow["type"]) ?? "Full-time",
      salary: values.salary ?? "",
      status: (values.status as JobRow["status"]) ?? "draft",
      updatedAt: new Date().toISOString(),
      active: values.active ? values.active === "true" : (values.status === "published"),
    }
    setRows((prev) => [row, ...prev])
  }

  async function onEditSubmit(values: Record<string, any>) {
    if (!current) return
    const id = current.id
    setRows((prev) => prev.map((r) => r.id === id ? {
      ...r,
      title: values.title ?? r.title,
      company: values.company ?? r.company,
      location: values.location ?? r.location,
      type: (values.type as JobRow["type"]) ?? r.type,
      salary: values.salary ?? r.salary,
      status: (values.status as JobRow["status"]) ?? r.status,
      active: values.active ? values.active === "true" : r.active,
      updatedAt: new Date().toISOString(),
    } : r))
  }

  function toggleActive(id: number, next: boolean) {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, active: next } : r))
  }

  const searchable = useMemo(() => ["title", "company", "location"], [])

  const filteredRows = useMemo(() => {
    if (status === "all") return rows
    return rows.filter((r) => r.status === status)
  }, [rows, status])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Jobs</h1>
        <div className="flex gap-2">
          <Button onClick={() => setAddOpen(true)}>Add Job</Button>
        </div>
      </div>

      <DataTable<JobRow>
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
        title="Add Job"
        submitLabel="Create"
        schema={addSchema}
        onSubmit={onAdd}
      />

      {current && (
        <EntityDialog<any>
          open={viewOpen}
          onOpenChange={(o) => { setViewOpen(o); if (!o) setCurrent(null) }}
          title={`View: ${current.title}`}
          readOnly
          schema={editSchema}
          initial={{
            title: current.title,
            company: current.company,
            location: current.location,
            type: current.type,
            salary: current.salary ?? "",
            status: current.status,
            active: current.active ? "true" : "false",
          }}
          onSubmit={() => {}}
        />
      )}

      {current && (
        <EntityDialog<any>
          open={editOpen}
          onOpenChange={(o) => { setEditOpen(o); if (!o) setCurrent(null) }}
          title={`Edit: ${current.title}`}
          submitLabel="Save"
          schema={editSchema}
          initial={{
            title: current.title,
            company: current.company,
            location: current.location,
            type: current.type,
            salary: current.salary ?? "",
            status: current.status,
            active: current.active ? "true" : "false",
          }}
          onSubmit={onEditSubmit}
        />
      )}
    </div>
  )
}
