"use client"

import { useMemo, useState } from "react"
import DataTable, { type Column } from "@/components/cms/DataTable"
import EntityDialog, { type FieldSpec } from "@/components/cms/EntityDialog"
import { Button } from "@/components/ui/button"
import { CAREER_CATALOG, type CareerKey } from "@/lib/careers-data"

export type TrendRow = {
  id: string
  career: CareerKey
  year: number
  value: number
  updatedAt: string
}

const careerOptions = (Object.keys(CAREER_CATALOG) as CareerKey[]).map((k) => ({ label: CAREER_CATALOG[k].name, value: k }))

export default function CmsCareerTrendsPage() {
  const [rows, setRows] = useState<TrendRow[]>([])
  const [addOpen, setAddOpen] = useState(false)
  const [bulkOpen, setBulkOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [current, setCurrent] = useState<TrendRow | null>(null)

  const columns: Column<TrendRow>[] = [
    { key: "career", header: "Career", render: (r) => CAREER_CATALOG[r.career].name },
    { key: "year", header: "Year", sortable: true },
    { key: "value", header: "Value", sortable: true },
    { key: "updatedAt", header: "Updated", sortable: true, sortAccessor: (r) => +new Date(r.updatedAt), render: (r) => new Date(r.updatedAt).toLocaleString() },
    { key: "actions", header: "Actions", render: (r) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => { setCurrent(r); setEditOpen(true) }}>Edit</Button>
        <Button size="sm" variant="outline" onClick={() => onDelete(r.id)}>Delete</Button>
      </div>
    ) },
  ]

  function onDelete(id: string) { setRows((prev) => prev.filter((x) => x.id !== id)) }

  const addSchema: FieldSpec[] = [
    { name: "career", label: "Career", type: "select", required: true, options: careerOptions },
    { name: "year", label: "Year", type: "number", required: true },
    { name: "value", label: "Value", type: "number", required: true },
  ]
  const bulkSchema: FieldSpec[] = [
    { name: "career", label: "Career", type: "select", required: true, options: careerOptions },
    { name: "startYear", label: "Start Year", type: "number", required: true, placeholder: "2015" },
    { name: "endYear", label: "End Year", type: "number", required: true, placeholder: "2030" },
    { name: "startValue", label: "Start Value", type: "number", required: true, placeholder: "e.g., 90" },
    { name: "deltaPerYear", label: "Delta per Year", type: "number", required: true, placeholder: "e.g., 2.2" },
  ]

  async function onAdd(values: Record<string, any>) {
    const id = `${values.career}__${values.year}`
    const row: TrendRow = {
      id,
      career: values.career as CareerKey,
      year: Number(values.year),
      value: Number(values.value),
      updatedAt: new Date().toISOString(),
    }
    setRows((prev) => [row, ...prev])
  }

  async function onBulk(values: Record<string, any>) {
    const career = values.career as CareerKey
    const start = Number(values.startYear)
    const end = Number(values.endYear)
    const startValue = Number(values.startValue)
    const delta = Number(values.deltaPerYear)
    const toAdd: TrendRow[] = []
    for (let i = 0; i <= (end - start); i++) {
      const year = start + i
      const value = Math.round(startValue + delta * i)
      toAdd.push({ id: `${career}__${year}`, career, year, value, updatedAt: new Date().toISOString() })
    }
    setRows((prev) => [...toAdd, ...prev.filter((r) => !(r.career === career && r.year >= start && r.year <= end))])
  }

  async function onEditSubmit(values: Record<string, any>) {
    if (!current) return
    const id = current.id
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, year: Number(values.year ?? r.year), value: Number(values.value ?? r.value), updatedAt: new Date().toISOString() } : r))
  }

  const searchable = useMemo(() => ["career", "year"], [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Career Trends</h1>
        <div className="flex gap-2">
          <Button onClick={() => setAddOpen(true)}>Add Point</Button>
          <Button variant="outline" onClick={() => setBulkOpen(true)}>Bulk Add</Button>
        </div>
      </div>

      <DataTable<TrendRow>
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        searchableKeys={searchable}
      />

      <EntityDialog<any>
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add Trend Point"
        submitLabel="Create"
        schema={addSchema}
        onSubmit={onAdd}
      />

      <EntityDialog<any>
        open={bulkOpen}
        onOpenChange={setBulkOpen}
        title="Bulk Add Trend Points"
        submitLabel="Add"
        schema={bulkSchema}
        onSubmit={onBulk}
      />

      {current && (
        <EntityDialog<any>
          open={editOpen}
          onOpenChange={(o) => { setEditOpen(o); if (!o) setCurrent(null) }}
          title={`Edit: ${CAREER_CATALOG[current.career].name} — ${current.year}`}
          submitLabel="Save"
          schema={addSchema}
          initial={{ career: current.career, year: current.year, value: current.value }}
          onSubmit={onEditSubmit}
        />
      )}
    </div>
  )
}
