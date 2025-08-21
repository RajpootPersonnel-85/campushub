"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DataTable, { type Column } from "@/components/cms/DataTable"
import EntityDialog, { type FieldSpec } from "@/components/cms/EntityDialog"

type ResourceRow = {
  id: number
  title: string
  type: "Article" | "Video" | "Tool"
  url: string
  tags?: string
  status: "draft" | "published"
  updatedAt: string
  active?: boolean
}

const initialResources: ResourceRow[] = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  title: ["Learn DSA", "React Hooks Guide", "GATE Rank Predictor"][i % 3],
  type: ["Article", "Video", "Tool"][i % 3] as ResourceRow["type"],
  url: ["https://example.com/dsa", "https://example.com/react", "https://example.com/tool"][i % 3],
  tags: ["dsa, algorithms", "react, hooks", "gate, predictor"][i % 3],
  status: ["draft", "published"][i % 2] as ResourceRow["status"],
  updatedAt: new Date(Date.now() - i * 13e5).toISOString(),
  active: (["draft", "published"][i % 2] as ResourceRow["status"]) === "published",
}))

export default function CmsResourcesListPage() {
  const [rows, setRows] = useState<ResourceRow[]>(initialResources)
  const [addOpen, setAddOpen] = useState(false)
  const [status, setStatus] = useState<string>("all")
  const [editOpen, setEditOpen] = useState(false)
  const [editing, setEditing] = useState<ResourceRow | null>(null)

  const columns: Column<ResourceRow>[] = [
    { key: "title", header: "Title", className: "min-w-[220px]", sortable: true },
    { key: "type", header: "Type", sortable: true },
    { key: "url", header: "URL", render: (r) => <a href={r.url} target="_blank" className="text-blue-600 underline">Open</a> },
    { key: "tags", header: "Tags" },
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
    { key: "status", header: "Status", render: (r) => (<span className={`px-2 py-0.5 rounded text-xs ${r.status === "published" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>{r.status}</span>) },
    { key: "updatedAt", header: "Updated", sortable: true, sortAccessor: (r) => +new Date(r.updatedAt), render: (r) => new Date(r.updatedAt).toLocaleString() },
    { key: "actions", header: "", className: "w-[160px]", render: (r) => (
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="outline" onClick={() => openEdit(r)}>Edit</Button>
        <Button size="sm" variant="outline" onClick={() => onDelete(r.id)}>Delete</Button>
      </div>
    )},
  ]

  function onDelete(id: number) { setRows((prev) => prev.filter((x) => x.id !== id)) }

  function openEdit(row: ResourceRow) {
    setEditing(row)
    setEditOpen(true)
  }

  const addSchema: FieldSpec[] = [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "type", label: "Type", type: "select", options: ["Article","Video","Tool"].map(v=>({label:v,value:v})) },
    { name: "url", label: "URL", type: "text", required: true },
    { name: "tags", label: "Tags", type: "tags" },
    { name: "status", label: "Status", type: "select", options: ["draft","published"].map(v=>({label:v,value:v})) },
    { name: "active", label: "Active", type: "select", options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ] },
  ]

  const editSchema: FieldSpec[] = addSchema

  async function onAdd(values: Record<string, any>) {
    const row: ResourceRow = {
      id: (rows.at(0)?.id ?? 0) + Math.ceil(Math.random() * 1000),
      title: values.title,
      type: (values.type as ResourceRow["type"]) ?? "Article",
      url: values.url,
      tags: values.tags ?? "",
      status: (values.status as ResourceRow["status"]) ?? "draft",
      updatedAt: new Date().toISOString(),
      active: values.active ? values.active === "true" : (values.status === "published"),
    }
    setRows((prev) => [row, ...prev])
  }

  async function onEditSubmit(values: Record<string, any>) {
    if (!editing) return
    const id = editing.id
    setRows((prev) => prev.map((r) => r.id === id ? {
      ...r,
      title: values.title,
      type: (values.type as ResourceRow["type"]) ?? r.type,
      url: values.url,
      tags: values.tags ?? "",
      status: (values.status as ResourceRow["status"]) ?? r.status,
      updatedAt: new Date().toISOString(),
      active: values.active ? values.active === "true" : (values.status ? values.status === "published" : !!r.active),
    } : r))
  }

  function toggleActive(id: number, next: boolean) {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, active: next } : r))
  }

  const searchable = useMemo(() => ["title", "type", "tags"], [])
  const filteredRows = useMemo(() => status === "all" ? rows : rows.filter((r) => r.status === status), [rows, status])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Resources</h1>
        <div className="flex gap-2">
          <Button onClick={() => setAddOpen(true)}>Add Resource</Button>
        </div>
      </div>

      <DataTable<ResourceRow>
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
      title="Add Resource"
      submitLabel="Create"
      schema={addSchema}
      onSubmit={onAdd}
    />

      {editing && (
        <EntityDialog<any>
          open={editOpen}
          onOpenChange={(o) => { setEditOpen(o); if (!o) setEditing(null) }}
          title={`Edit: ${editing.title}`}
          submitLabel="Save"
          schema={editSchema}
          initial={{
            title: editing.title,
            type: editing.type,
            url: editing.url,
            tags: editing.tags ?? "",
            status: editing.status,
            active: editing.active ? "true" : "false",
          }}
          onSubmit={onEditSubmit}
        />
      )}
    </div>
  )
}
