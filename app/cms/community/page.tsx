"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DataTable, { type Column } from "@/components/cms/DataTable"
import EntityDialog, { type FieldSpec } from "@/components/cms/EntityDialog"

type PostRow = {
  id: number
  title: string
  author: string
  category: "General" | "Q&A" | "Market" | "Events"
  status: "draft" | "published"
  updatedAt: string
  active?: boolean
}

const initialPosts: PostRow[] = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  title: ["Welcome to CampusHub", "Best books for DSA?", "Selling calculator", "Workshop next week!"][i % 4],
  author: ["Amit Kumar", "Neha Reddy", "Rohit Singh"][i % 3],
  category: ["General", "Q&A", "Market", "Events"][i % 4] as PostRow["category"],
  status: ["draft", "published"][i % 2] as PostRow["status"],
  updatedAt: new Date(Date.now() - i * 19e5).toISOString(),
  active: (["draft", "published"][i % 2] as PostRow["status"]) === "published",
}))

export default function CmsCommunityListPage() {
  const [rows, setRows] = useState<PostRow[]>(initialPosts)
  const [addOpen, setAddOpen] = useState(false)
  const [status, setStatus] = useState<string>("all")

  const columns: Column<PostRow>[] = [
    { key: "title", header: "Title", className: "min-w-[240px]", sortable: true },
    { key: "author", header: "Author", sortable: true },
    { key: "category", header: "Category", sortable: true },
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
        <Link href={`/cms/community/${r.id}/edit`}><Button size="sm" variant="outline">Edit</Button></Link>
        <Button size="sm" variant="outline" onClick={() => onDelete(r.id)}>Delete</Button>
      </div>
    )},
  ]

  function onDelete(id: number) { setRows((prev) => prev.filter((x) => x.id !== id)) }

  const addSchema: FieldSpec[] = [
    { name: "title", label: "Title", type: "text", required: true },
    { name: "author", label: "Author", type: "text", required: true },
    { name: "category", label: "Category", type: "select", options: ["General","Q&A","Market","Events"].map(v=>({label:v,value:v})) },
    { name: "status", label: "Status", type: "select", options: ["draft","published"].map(v=>({label:v,value:v})) },
    { name: "active", label: "Active", type: "select", options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ] },
  ]

  async function onAdd(values: Record<string, any>) {
    const row: PostRow = {
      id: (rows.at(0)?.id ?? 0) + Math.ceil(Math.random() * 1000),
      title: values.title,
      author: values.author,
      category: (values.category as PostRow["category"]) ?? "General",
      status: (values.status as PostRow["status"]) ?? "draft",
      updatedAt: new Date().toISOString(),
      active: values.active ? values.active === "true" : (values.status === "published"),
    }
    setRows((prev) => [row, ...prev])
  }

  function toggleActive(id: number, next: boolean) {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, active: next } : r))
  }

  const searchable = useMemo(() => ["title", "author", "category"], [])
  const filteredRows = useMemo(() => status === "all" ? rows : rows.filter((r) => r.status === status), [rows, status])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Community Posts</h1>
        <div className="flex gap-2">
          <Button onClick={() => setAddOpen(true)}>Add Post</Button>
        </div>
      </div>

      <DataTable<PostRow>
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
      title="Add Post"
      submitLabel="Create"
      schema={addSchema}
      onSubmit={onAdd}
    />
    </div>
  )
}
