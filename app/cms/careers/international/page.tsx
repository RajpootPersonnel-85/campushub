"use client"

import { useState } from "react"
import DataTable, { type Column } from "@/components/cms/DataTable"
import EntityDialog, { type FieldSpec } from "@/components/cms/EntityDialog"
import { Button } from "@/components/ui/button"
import { CAREER_CATALOG, type CareerKey } from "@/lib/careers-data"

export type InternationalRow = {
  id: string
  career: CareerKey
  indiaSalary: string
  usaSalary: string
  canadaSalary: string
  dubaiSalary?: string
  globalGrowth: number
  updatedAt: string
}

const careerOptions = (Object.keys(CAREER_CATALOG) as CareerKey[]).map((k) => ({ label: CAREER_CATALOG[k].name, value: k }))

export default function CmsCareerInternationalPage() {
  const [rows, setRows] = useState<InternationalRow[]>([])
  const [addOpen, setAddOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [current, setCurrent] = useState<InternationalRow | null>(null)

  const columns: Column<InternationalRow>[] = [
    { key: "career", header: "Career", render: (r) => CAREER_CATALOG[r.career].name },
    { key: "indiaSalary", header: "India" },
    { key: "usaSalary", header: "USA" },
    { key: "canadaSalary", header: "Canada" },
    { key: "dubaiSalary", header: "Dubai" },
    { key: "globalGrowth", header: "Global Growth %", sortable: true },
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
    { name: "indiaSalary", label: "India Salary", type: "text", required: true, placeholder: "₹7 LPA" },
    { name: "usaSalary", label: "USA Salary", type: "text", required: true, placeholder: "$85k/year" },
    { name: "canadaSalary", label: "Canada Salary", type: "text", required: true, placeholder: "CAD $75k/year" },
    { name: "dubaiSalary", label: "Dubai Salary", type: "text", placeholder: "AED 160k/year" },
    { name: "globalGrowth", label: "Global Growth %", type: "number", required: true },
  ]

  async function onAdd(values: Record<string, any>) {
    const id = `${values.career}`
    const row: InternationalRow = {
      id,
      career: values.career as CareerKey,
      indiaSalary: values.indiaSalary,
      usaSalary: values.usaSalary,
      canadaSalary: values.canadaSalary,
      dubaiSalary: values.dubaiSalary ?? "",
      globalGrowth: Number(values.globalGrowth ?? 0),
      updatedAt: new Date().toISOString(),
    }
    setRows((prev) => [row, ...prev])
  }

  async function onEditSubmit(values: Record<string, any>) {
    if (!current) return
    const id = current.id
    setRows((prev) => prev.map((r) => r.id === id ? {
      ...r,
      indiaSalary: values.indiaSalary ?? r.indiaSalary,
      usaSalary: values.usaSalary ?? r.usaSalary,
      canadaSalary: values.canadaSalary ?? r.canadaSalary,
      dubaiSalary: values.dubaiSalary ?? r.dubaiSalary,
      globalGrowth: values.globalGrowth != null ? Number(values.globalGrowth) : r.globalGrowth,
      updatedAt: new Date().toISOString(),
    } : r))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">International Profiles</h1>
        <div className="flex gap-2">
          <Button onClick={() => setAddOpen(true)}>Add Profile</Button>
        </div>
      </div>

      <DataTable<InternationalRow>
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        searchableKeys={["career", "indiaSalary", "usaSalary", "canadaSalary", "dubaiSalary"]}
      />

      <EntityDialog<any>
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add International Profile"
        submitLabel="Create"
        schema={schema}
        onSubmit={onAdd}
      />

      {current && (
        <EntityDialog<any>
          open={viewOpen}
          onOpenChange={(o) => { setViewOpen(o); if (!o) setCurrent(null) }}
          title={`View: ${CAREER_CATALOG[current.career].name}`}
          readOnly
          schema={schema}
          initial={{
            career: current.career,
            indiaSalary: current.indiaSalary,
            usaSalary: current.usaSalary,
            canadaSalary: current.canadaSalary,
            dubaiSalary: current.dubaiSalary ?? "",
            globalGrowth: current.globalGrowth,
          }}
          onSubmit={() => {}}
        />
      )}

      {current && (
        <EntityDialog<any>
          open={editOpen}
          onOpenChange={(o) => { setEditOpen(o); if (!o) setCurrent(null) }}
          title={`Edit: ${CAREER_CATALOG[current.career].name}`}
          submitLabel="Save"
          schema={schema}
          initial={{
            career: current.career,
            indiaSalary: current.indiaSalary,
            usaSalary: current.usaSalary,
            canadaSalary: current.canadaSalary,
            dubaiSalary: current.dubaiSalary ?? "",
            globalGrowth: current.globalGrowth,
          }}
          onSubmit={onEditSubmit}
        />
      )}
    </div>
  )
}
