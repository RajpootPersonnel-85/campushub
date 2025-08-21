"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DataTable, { type Column } from "@/components/cms/DataTable"
import EntityDialog, { type FieldSpec } from "@/components/cms/EntityDialog"

type ExamRow = {
  id: number
  name: string
  category: string
  date: string
  mode: "online" | "offline"
  status: "draft" | "published"
  updatedAt: string
  active?: boolean
}

const initialExams: ExamRow[] = Array.from({ length: 8 }).map((_, i) => ({
  id: i + 1,
  name: ["GATE 2026", "JEE Mains", "CAT 2025", "CUET UG"][i % 4],
  category: ["Engineering", "Undergrad", "MBA", "Undergrad"][i % 4],
  date: new Date(Date.now() + (i + 3) * 86400000).toISOString().slice(0, 10),
  mode: ["online", "offline"][i % 2] as ExamRow["mode"],
  status: ["draft", "published"][i % 2] as ExamRow["status"],
  updatedAt: new Date(Date.now() - i * 15e5).toISOString(),
  active: (["draft", "published"][i % 2] as ExamRow["status"]) === "published",
}))

export default function CmsExamsListPage() {
  const [rows, setRows] = useState<ExamRow[]>(initialExams)
  const [addOpen, setAddOpen] = useState(false)
  const [status, setStatus] = useState<string>("all")

  const columns: Column<ExamRow>[] = [
    { key: "name", header: "Name", className: "min-w-[220px]", sortable: true },
    { key: "category", header: "Category", sortable: true },
    { key: "date", header: "Date", sortable: true },
    { key: "mode", header: "Mode", sortable: true },
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
          <Link href={`/cms/exams/${r.id}/edit`}><Button size="sm" variant="outline">Edit</Button></Link>
          <Button size="sm" variant="outline" onClick={() => onDelete(r.id)}>Delete</Button>
        </div>
      ),
    },
  ]

  function onDelete(id: number) { setRows((prev) => prev.filter((x) => x.id !== id)) }

  const addSchema: FieldSpec[] = [
    { name: "name", label: "Name", type: "text", required: true },
    { name: "category", label: "Category", type: "text", required: true },
    { name: "date", label: "Exam Date", type: "date", required: true },
    { name: "mode", label: "Mode", type: "select", options: ["online","offline"].map(v=>({label:v,value:v})) },
    { name: "status", label: "Status", type: "select", options: ["draft","published"].map(v=>({label:v,value:v})) },
    { name: "active", label: "Active", type: "select", options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ] },
  ]

  async function onAdd(values: Record<string, any>) {
    const row: ExamRow = {
      id: (rows.at(0)?.id ?? 0) + Math.ceil(Math.random() * 1000),
      name: values.name,
      category: values.category,
      date: values.date ?? new Date().toISOString().slice(0,10),
      mode: (values.mode as ExamRow["mode"]) ?? "online",
      status: (values.status as ExamRow["status"]) ?? "draft",
      updatedAt: new Date().toISOString(),
      active: values.active ? values.active === "true" : (values.status === "published"),
    }
    setRows((prev) => [row, ...prev])
  }

  function toggleActive(id: number, next: boolean) {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, active: next } : r))
  }

  const searchable = useMemo(() => ["name", "category", "date"], [])

  const filteredRows = useMemo(() => {
    if (status === "all") return rows
    return rows.filter((r) => r.status === status)
  }, [rows, status])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Exams</h1>
        <div className="flex gap-2">
          <Button onClick={() => setAddOpen(true)}>Add Exam</Button>
        </div>
      </div>

      <DataTable<ExamRow>
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
        title="Add Exam"
        submitLabel="Create"
        schema={addSchema}
        onSubmit={onAdd}
      />
    </div>
  )
}
