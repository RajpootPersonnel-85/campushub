"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DataTable, { type Column } from "@/components/cms/DataTable"
import EntityDialog, { type FieldSpec } from "@/components/cms/EntityDialog"

type NoteRow = {
  id: number
  title: string
  subject: string
  semester: string
  format: "pdf" | "docx" | "pptx"
  sizeMB: number
  status: "draft" | "published"
  updatedAt: string
  active?: boolean
}

const initialNotes: NoteRow[] = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  title: ["DSA Cheatsheet", "Thermodynamics Summary", "Microeconomics Notes"][i % 3],
  subject: ["CS", "ME", "ECO"][i % 3],
  semester: ["Sem 1", "Sem 3", "Sem 5"][i % 3],
  format: ["pdf", "docx", "pptx"][i % 3] as NoteRow["format"],
  sizeMB: [1.8, 4.2, 7.5][i % 3],
  status: ["draft", "published"][i % 2] as NoteRow["status"],
  updatedAt: new Date(Date.now() - i * 48e5).toISOString(),
  active: (["draft", "published"][i % 2] as NoteRow["status"]) === "published",
}))

export default function CmsNotesListPage() {
  const [rows, setRows] = useState<NoteRow[]>(initialNotes)
  const [addOpen, setAddOpen] = useState(false)
  const [status, setStatus] = useState<string>("all")

  const columns: Column<NoteRow>[] = [
    { key: "title", header: "Title", className: "min-w-[220px]", sortable: true },
    { key: "subject", header: "Subject", sortable: true },
    { key: "semester", header: "Semester", sortable: true },
    { key: "format", header: "Format", sortable: true },
    { key: "sizeMB", header: "Size", sortable: true, render: (r) => `${r.sizeMB} MB` },
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
          <Link href={`/cms/notes/${r.id}/edit`}><Button size="sm" variant="outline">Edit</Button></Link>
          <Button size="sm" variant="outline" onClick={() => onDelete(r.id)}>Delete</Button>
        </div>
      ),
    },
  ]

  function onDelete(id: number) { setRows((prev) => prev.filter((x) => x.id !== id)) }

  const addSchema: FieldSpec[] = [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "subject", label: "Subject", type: "text", required: true },
    { name: "semester", label: "Semester", type: "select", options: ["Sem 1","Sem 2","Sem 3","Sem 4","Sem 5","Sem 6","Sem 7","Sem 8"].map(v=>({label:v,value:v})) },
    { name: "format", label: "Format", type: "select", options: ["pdf","docx","pptx"].map(v=>({label:v,value:v})) },
    { name: "sizeMB", label: "Size (MB)", type: "number" },
    { name: "status", label: "Status", type: "select", options: ["draft","published"].map(v=>({label:v,value:v})) },
    { name: "active", label: "Active", type: "select", options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ] },
  ]

  async function onAdd(values: Record<string, any>) {
    const row: NoteRow = {
      id: (rows.at(0)?.id ?? 0) + Math.ceil(Math.random() * 1000),
      title: values.title,
      subject: values.subject,
      semester: values.semester ?? "Sem 1",
      format: (values.format as NoteRow["format"]) ?? "pdf",
      sizeMB: Number(values.sizeMB ?? 0),
      status: (values.status as NoteRow["status"]) ?? "draft",
      updatedAt: new Date().toISOString(),
      active: values.active ? values.active === "true" : (values.status === "published"),
    }
    setRows((prev) => [row, ...prev])
  }

  function toggleActive(id: number, next: boolean) {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, active: next } : r))
  }

  const searchable = useMemo(() => ["title", "subject", "semester"], [])

  const filteredRows = useMemo(() => {
    if (status === "all") return rows
    return rows.filter((r) => r.status === status)
  }, [rows, status])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Notes</h1>
        <div className="flex gap-2">
          <Button onClick={() => setAddOpen(true)}>Add Note</Button>
        </div>
      </div>

      <DataTable<NoteRow>
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
        title="Add Note"
        submitLabel="Create"
        schema={addSchema}
        onSubmit={onAdd}
      />
    </div>
  )
}
