"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DataTable, { type Column } from "@/components/cms/DataTable"
import EntityDialog, { type FieldSpec } from "@/components/cms/EntityDialog"
import { formatDateTimeUTC } from "@/lib/date"

type BookRow = {
  id: number
  title: string
  author: string
  subject: string
  condition: "Excellent" | "Good" | "Fair"
  price: number
  status: "draft" | "published"
  updatedAt: string
  active?: boolean
}

const BASE_TIME_MS = Date.parse("2025-01-01T00:00:00Z")
const initialBooks: BookRow[] = Array.from({ length: 12 }).map((_, i) => ({
  id: i + 1,
  title: [
    "Introduction to Algorithms",
    "Operating System Concepts",
    "Organic Chemistry",
    "Principles of Economics",
  ][i % 4],
  author: ["Cormen", "Silberschatz", "Bruice", "Mankiw"][i % 4],
  price: [899, 650, 750, 550][i % 4],
  condition: ["Excellent", "Good", "Fair"][i % 3] as BookRow["condition"],
  subject: ["Computer Science", "Chemistry", "Economics"][i % 3],
  status: ["draft", "published"][i % 2] as BookRow["status"],
  updatedAt: new Date(BASE_TIME_MS - i * 36e5).toISOString(),
  active: (["draft", "published"][i % 2] as BookRow["status"]) === "published",
}))

export default function CmsBooksListPage() {
  const [rows, setRows] = useState<BookRow[]>(initialBooks)
  const [addOpen, setAddOpen] = useState(false)
  const [status, setStatus] = useState<string>("all")
  const [viewOpen, setViewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [current, setCurrent] = useState<BookRow | null>(null)

  const columns: Column<BookRow>[] = [
    {
      key: "title",
      header: "Title",
      className: "min-w-[240px]",
      render: (r) => (
        <div>
          <div className="font-medium">{r.title}</div>
          <div className="text-xs text-muted-foreground">by {r.author}</div>
        </div>
      ),
    },
    { key: "subject", header: "Subject" },
    { key: "condition", header: "Condition" },
    {
      key: "price",
      header: "Price",
      className: "text-right",
      render: (r) => <span>₹{r.price}</span>,
    },
    {
      key: "active",
      header: "Active",
      render: (r) => (
        <label className="inline-flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!r.active}
            onChange={(e) => toggleActive(r.id, e.target.checked)}
            aria-label={`Set ${r.title} ${r.active ? "inactive" : "active"}`}
          />
          <span className={r.active ? "text-green-600" : "text-muted-foreground"}>{r.active ? "Active" : "Inactive"}</span>
        </label>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <span
          className={`px-2 py-0.5 rounded text-xs ${
            r.status === "published" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
          }`}
        >
          {r.status}
        </span>
      ),
    },
    {
      key: "updatedAt",
      header: "Updated",
      render: (r) => formatDateTimeUTC(r.updatedAt),
    },
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

  function onDelete(id: number) {
    setRows((prev) => prev.filter((x) => x.id !== id))
  }

  function openView(row: BookRow) { setCurrent(row); setViewOpen(true) }
  function openEdit(row: BookRow) { setCurrent(row); setEditOpen(true) }

  const addSchema: FieldSpec[] = [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "author", label: "Author", type: "text", required: true },
    { name: "price", label: "Price (₹)", type: "number", required: true },
    {
      name: "condition",
      label: "Condition",
      type: "select",
      required: true,
      options: ["Excellent", "Good", "Fair"].map((v) => ({ label: v, value: v })),
    },
    { name: "subject", label: "Subject", type: "text" },
    { name: "status", label: "Status", type: "select", options: ["draft", "published"].map((v) => ({ label: v, value: v })) },
    { name: "active", label: "Active", type: "select", options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ] },
    { name: "description", label: "Description", type: "textarea" },
    { name: "tags", label: "Tags", type: "tags" },
  ]

  // Use same schema for editing
  const editSchema: FieldSpec[] = addSchema

  async function onAdd(values: Record<string, any>) {
    const nextId = (rows.at(0)?.id ?? 0) + Math.ceil(Math.random() * 1000)
    const row: BookRow = {
      id: nextId,
      title: values.title,
      author: values.author,
      subject: values.subject ?? "",
      condition: (values.condition as BookRow["condition"]) ?? "Good",
      price: Number(values.price ?? 0),
      status: (values.status as BookRow["status"]) ?? "draft",
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
      author: values.author ?? r.author,
      subject: values.subject ?? r.subject,
      condition: (values.condition as BookRow["condition"]) ?? r.condition,
      price: values.price != null ? Number(values.price) : r.price,
      status: (values.status as BookRow["status"]) ?? r.status,
      active: values.active ? values.active === "true" : r.active,
      updatedAt: new Date().toISOString(),
    } : r))
  }

  function toggleActive(id: number, next: boolean) {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, active: next } : r))
  }

  const searchable = useMemo(() => ["title", "author", "subject"], [])

  const filteredRows = useMemo(() => {
    if (status === "all") return rows
    return rows.filter((r) => r.status === status)
  }, [rows, status])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Books</h1>
        <div className="flex gap-2">
          <Button onClick={() => setAddOpen(true)}>Add Book</Button>
          <Link href="/cms/books/new"><Button variant="outline">Open Full Form</Button></Link>
        </div>
      </div>

      <DataTable<BookRow>
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
        pageSizeOptions={[10, 20, 50]}
      />

      <EntityDialog<any>
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add Book"
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
            author: current.author,
            subject: current.subject,
            condition: current.condition,
            price: current.price,
            status: current.status,
            active: current.active ? "true" : "false",
            description: (undefined as any),
            tags: (undefined as any),
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
            author: current.author,
            subject: current.subject,
            condition: current.condition,
            price: current.price,
            status: current.status,
            active: current.active ? "true" : "false",
            description: "",
            tags: "",
          }}
          onSubmit={onEditSubmit}
        />
      )}
    </div>
  )
}
