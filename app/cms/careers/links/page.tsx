"use client"

import { useState } from "react"
import DataTable, { type Column } from "@/components/cms/DataTable"
import EntityDialog, { type FieldSpec } from "@/components/cms/EntityDialog"
import { Button } from "@/components/ui/button"
import { CAREER_CATALOG, type CareerKey } from "@/lib/careers-data"

export type JobLinkRow = {
  id: string
  career: CareerKey
  source: string
  label: string
  url: string
  updatedAt: string
}

const careerOptions = (Object.keys(CAREER_CATALOG) as CareerKey[]).map((k) => ({ label: CAREER_CATALOG[k].name, value: k }))
const sourceOptions = ["Indeed","LinkedIn Jobs","Internshala","Naukri","Custom"].map((s)=>({label:s,value:s}))

export default function CmsCareerLinksPage() {
  const [rows, setRows] = useState<JobLinkRow[]>([])
  const [addOpen, setAddOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [current, setCurrent] = useState<JobLinkRow | null>(null)

  const columns: Column<JobLinkRow>[] = [
    { key: "career", header: "Career", render: (r) => CAREER_CATALOG[r.career].name },
    { key: "source", header: "Source" },
    { key: "label", header: "Label" },
    { key: "url", header: "URL", render: (r) => <a className="text-blue-600 underline" href={r.url} target="_blank">Open</a> },
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
    { name: "source", label: "Source", type: "select", required: true, options: sourceOptions },
    { name: "label", label: "Label", type: "text", required: true },
    { name: "url", label: "URL", type: "text", required: true, placeholder: "https://..." },
  ]

  async function onAdd(values: Record<string, any>) {
    const id = `${values.career}__${values.label}`
    const row: JobLinkRow = {
      id,
      career: values.career as CareerKey,
      source: values.source,
      label: values.label,
      url: values.url,
      updatedAt: new Date().toISOString(),
    }
    setRows((prev) => [row, ...prev])
  }

  async function onEditSubmit(values: Record<string, any>) {
    if (!current) return
    const id = current.id
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, source: values.source ?? r.source, label: values.label ?? r.label, url: values.url ?? r.url, updatedAt: new Date().toISOString() } : r))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Career Job Links</h1>
        <div className="flex gap-2">
          <Button onClick={() => setAddOpen(true)}>Add Link</Button>
        </div>
      </div>

      <DataTable<JobLinkRow>
        columns={columns}
        rows={rows}
        rowKey={(r) => r.id}
        searchableKeys={["career", "source", "label", "url"]}
      />

      <EntityDialog<any>
        open={addOpen}
        onOpenChange={setAddOpen}
        title="Add Job Link"
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
          initial={{ career: current.career, source: current.source, label: current.label, url: current.url }}
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
          initial={{ career: current.career, source: current.source, label: current.label, url: current.url }}
          onSubmit={onEditSubmit}
        />
      )}
    </div>
  )
}
