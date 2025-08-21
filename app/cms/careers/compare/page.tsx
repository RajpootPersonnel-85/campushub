"use client"

import { useMemo, useState } from "react"
import DataTable, { type Column } from "@/components/cms/DataTable"
import EntityDialog, { type FieldSpec } from "@/components/cms/EntityDialog"
import { Button } from "@/components/ui/button"
import { CAREER_CATALOG, type CareerKey } from "@/lib/careers-data"

export type ComparisonRow = {
  id: string
  careerA: CareerKey
  careerB: CareerKey
  executiveSummary: string
  categories: string[]
  growthLeader?: CareerKey
  note?: string
  adjacentA?: string[]
  adjacentB?: string[]
  jobLinksA?: string[]
  jobLinksB?: string[]
  updatedAt: string
}

const careerOptions = (Object.keys(CAREER_CATALOG) as CareerKey[]).map((k) => ({ label: CAREER_CATALOG[k].name, value: k }))
const categoryOptions = Array.from(new Set((Object.keys(CAREER_CATALOG) as CareerKey[]).map((k) => CAREER_CATALOG[k].category)))
  .map((c) => ({ label: c, value: c }))

export default function CmsCareerComparisonsPage() {
  const [rows, setRows] = useState<ComparisonRow[]>([])
  const [addOpen, setAddOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [current, setCurrent] = useState<ComparisonRow | null>(null)

  const columns: Column<ComparisonRow>[] = [
    { key: "pair", header: "Pair", render: (r) => `${CAREER_CATALOG[r.careerA].name} vs ${CAREER_CATALOG[r.careerB].name}` },
    { key: "categories", header: "Categories", render: (r) => r.categories.join(", ") },
    { key: "growthLeader", header: "Growth Leader", render: (r) => r.growthLeader ? CAREER_CATALOG[r.growthLeader].name : "-" },
    { key: "updatedAt", header: "Updated", sortable: true, sortAccessor: (r) => +new Date(r.updatedAt), render: (r) => new Date(r.updatedAt).toLocaleString() },
    { key: "actions", header: "Actions", render: (r) => (
      <div className="flex gap-2">
        <Button size="sm" variant="outline" onClick={() => openView(r)}>View</Button>
        <Button size="sm" variant="outline" onClick={() => openEdit(r)}>Edit</Button>
        <Button size="sm" variant="outline" onClick={() => onDelete(r.id)}>Delete</Button>
      </div>
    ) },
  ]

  function onDelete(id: string) { setRows((prev) => prev.filter((x) => x.id !== id)) }
  function openView(row: ComparisonRow) { setCurrent(row); setViewOpen(true) }
  function openEdit(row: ComparisonRow) { setCurrent(row); setEditOpen(true) }

  const addSchema: FieldSpec[] = [
    { name: "careerA", label: "Career A", type: "select", required: true, options: careerOptions },
    { name: "careerB", label: "Career B", type: "select", required: true, options: careerOptions },
    { name: "executiveSummary", label: "Executive Summary", type: "textarea", required: true, placeholder: "Overview comparing both careers" },
    { name: "categories", label: "Categories", type: "tags", placeholder: "e.g., Engineering" },
    { name: "growthLeader", label: "Growth Leader", type: "select", options: careerOptions },
    { name: "note", label: "Note", type: "textarea", placeholder: "Notes like Comfort Index explanation" },
    { name: "adjacentA", label: "Adjacent Roles — Career A", type: "tags", placeholder: "Alternatives for Career A" },
    { name: "adjacentB", label: "Adjacent Roles — Career B", type: "tags", placeholder: "Alternatives for Career B" },
    { name: "jobLinksA", label: "Job Links — Career A", type: "tags", placeholder: "Paste URLs or 'Label | URL'" },
    { name: "jobLinksB", label: "Job Links — Career B", type: "tags", placeholder: "Paste URLs or 'Label | URL'" },
  ]

  const editSchema: FieldSpec[] = addSchema

  async function onAdd(values: Record<string, any>) {
    if (!values.careerA || !values.careerB) return
    const id = `${values.careerA}__${values.careerB}`
    const row: ComparisonRow = {
      id,
      careerA: values.careerA as CareerKey,
      careerB: values.careerB as CareerKey,
      executiveSummary: values.executiveSummary ?? "",
      categories: (values.categories ?? []) as string[],
      growthLeader: (values.growthLeader || undefined) as CareerKey | undefined,
      note: values.note ?? "",
      adjacentA: (values.adjacentA ?? []) as string[],
      adjacentB: (values.adjacentB ?? []) as string[],
      jobLinksA: (values.jobLinksA ?? []) as string[],
      jobLinksB: (values.jobLinksB ?? []) as string[],
      updatedAt: new Date().toISOString(),
    }
    setRows((prev) => [row, ...prev])
  }

  async function onEditSubmit(values: Record<string, any>) {
    if (!current) return
    const id = current.id
    setRows((prev) => prev.map((r) => r.id === id ? {
      ...r,
      executiveSummary: values.executiveSummary ?? r.executiveSummary,
      categories: (values.categories ?? r.categories) as string[],
      growthLeader: (values.growthLeader || undefined) as CareerKey | undefined,
      note: values.note ?? r.note,
      adjacentA: (values.adjacentA ?? r.adjacentA) as string[],
      adjacentB: (values.adjacentB ?? r.adjacentB) as string[],
      jobLinksA: (values.jobLinksA ?? r.jobLinksA) as string[],
      jobLinksB: (values.jobLinksB ?? r.jobLinksB) as string[],
      updatedAt: new Date().toISOString(),
    } : r))
  }

  const searchable = useMemo(() => ["careerA", "careerB", "categories"], [])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Career Comparisons</h1>
        <div className="flex gap-2">
          <Button onClick={() => setAddOpen(true)}>Add Comparison</Button>
        </div>
      </div>

      <DataTable<ComparisonRow>
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        searchableKeys={searchable}
      />

      <EntityDialog<any>
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add Comparison"
        submitLabel="Create"
        schema={addSchema}
        onSubmit={onAdd}
      />

      {current && (
        <EntityDialog<any>
          open={viewOpen}
          onOpenChange={(o) => { setViewOpen(o); if (!o) setCurrent(null) }}
          title={`View: ${CAREER_CATALOG[current.careerA].name} vs ${CAREER_CATALOG[current.careerB].name}`}
          readOnly
          schema={editSchema}
          initial={{
            careerA: current.careerA,
            careerB: current.careerB,
            executiveSummary: current.executiveSummary,
            categories: current.categories,
            growthLeader: current.growthLeader,
            note: current.note ?? "",
            adjacentA: current.adjacentA ?? [],
            adjacentB: current.adjacentB ?? [],
            jobLinksA: current.jobLinksA ?? [],
            jobLinksB: current.jobLinksB ?? [],
          }}
          onSubmit={() => {}}
        />
      )}

      {current && (
        <EntityDialog<any>
          open={editOpen}
          onOpenChange={(o) => { setEditOpen(o); if (!o) setCurrent(null) }}
          title={`Edit: ${CAREER_CATALOG[current.careerA].name} vs ${CAREER_CATALOG[current.careerB].name}`}
          submitLabel="Save"
          schema={editSchema}
          initial={{
            careerA: current.careerA,
            careerB: current.careerB,
            executiveSummary: current.executiveSummary,
            categories: current.categories,
            growthLeader: current.growthLeader,
            note: current.note ?? "",
            adjacentA: current.adjacentA ?? [],
            adjacentB: current.adjacentB ?? [],
            jobLinksA: current.jobLinksA ?? [],
            jobLinksB: current.jobLinksB ?? [],
          }}
          onSubmit={onEditSubmit}
        />
      )}
    </div>
  )
}
