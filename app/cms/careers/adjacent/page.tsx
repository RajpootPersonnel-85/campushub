"use client"

import { useState } from "react"
import DataTable, { type Column } from "@/components/cms/DataTable"
import EntityDialog, { type FieldSpec } from "@/components/cms/EntityDialog"
import { Button } from "@/components/ui/button"
import { CAREER_CATALOG, type CareerKey } from "@/lib/careers-data"

export type AdjacentRow = {
  id: string
  career: CareerKey
  related: CareerKey
  label?: string
  updatedAt: string
}

const careerOptions = (Object.keys(CAREER_CATALOG) as CareerKey[]).map((k) => ({ label: CAREER_CATALOG[k].name, value: k }))

export default function CmsCareerAdjacentPage() {
  const [rows, setRows] = useState<AdjacentRow[]>([])
  const [addOpen, setAddOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [current, setCurrent] = useState<AdjacentRow | null>(null)

  const columns: Column<AdjacentRow>[] = [
    { key: "career", header: "Career", render: (r) => CAREER_CATALOG[r.career].name },
    { key: "related", header: "Adjacent", render: (r) => CAREER_CATALOG[r.related].name },
    { key: "label", header: "Label", render: (r) => r.label || "-" },
    { key: "updatedAt", header: "Updated", sortable: true, sortAccessor: (r) => +new Date(r.updatedAt), render: (r) => new Date(r.updatedAt).toLocaleString() },
    { key: "actions", header: "Actions", render: (r) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => { setCurrent(r); setViewOpen(true) }}>View</Button>
        <Button size="sm" variant="outline" onClick={() => { setCurrent(r); setEditOpen(true) }}>Edit</Button>
        <Button size="sm" variant="outline" onClick={() => onDelete(r.id)}>Delete</Button>
      </div>
    ) },
  ]

  function onDelete(id: string) { setRows((prev) => prev.filter((x) => x.id !== id)) }

  const schema: FieldSpec[] = [
    { name: "career", label: "Career", type: "select", required: true, options: careerOptions },
    { name: "related", label: "Adjacent / Alternative", type: "select", required: true, options: careerOptions },
    { name: "label", label: "Label", type: "text", placeholder: "Optional custom label" },
  ]

  async function onAdd(values: Record<string, any>) {
    const id = `${values.career}__${values.related}`
    const row: AdjacentRow = {
      id,
      career: values.career as CareerKey,
      related: values.related as CareerKey,
      label: values.label ?? "",
      updatedAt: new Date().toISOString(),
    }
    setRows((prev) => [row, ...prev])
  }

  async function onEditSubmit(values: Record<string, any>) {
    if (!current) return
    const id = current.id
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, label: values.label ?? r.label, updatedAt: new Date().toISOString() } : r))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Adjacent & Alternative Roles</h1>
        <div className="flex gap-2">
          <Button onClick={() => setAddOpen(true)}>Add Mapping</Button>
        </div>
      </div>

      <DataTable<AdjacentRow>
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        searchableKeys={["career", "related", "label"]}
      />

      <EntityDialog<any>
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add Adjacent Role"
        submitLabel="Create"
        schema={schema}
        onSubmit={onAdd}
      />

      {current && (
        <EntityDialog<any>
          open={viewOpen}
          onOpenChange={(o) => { setViewOpen(o); if (!o) setCurrent(null) }}
          title={`View: ${CAREER_CATALOG[current.career].name} → ${CAREER_CATALOG[current.related].name}`}
          readOnly
          schema={schema}
          initial={{
            career: current.career,
            related: current.related,
            label: current.label ?? "",
          }}
          onSubmit={() => {}}
        />
      )}

      {current && (
        <EntityDialog<any>
          open={editOpen}
          onOpenChange={(o) => { setEditOpen(o); if (!o) setCurrent(null) }}
          title={`Edit: ${CAREER_CATALOG[current.career].name} → ${CAREER_CATALOG[current.related].name}`}
          submitLabel="Save"
          schema={schema}
          initial={{
            career: current.career,
            related: current.related,
            label: current.label ?? "",
          }}
          onSubmit={onEditSubmit}
        />
      )}
    </div>
  )
}
