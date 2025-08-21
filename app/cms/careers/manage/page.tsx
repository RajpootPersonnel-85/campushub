"use client"

import { useEffect, useMemo, useState } from "react"
import { LineChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import DataTable, { type Column } from "@/components/cms/DataTable"
import EntityDialog, { type FieldSpec } from "@/components/cms/EntityDialog"
// Dynamic careers managed locally on this page (UI-only). Backend integration can persist later.

// Types reused in unified screen
type CareerRow = { id: string; key: string; name: string; updatedAt: string }
type AdjacentRow = { id: string; career: string; related: string; label?: string; updatedAt: string }
type JobLinkRow = { id: string; career: string; source: string; label: string; url: string; updatedAt: string }
type InternationalRow = { id: string; career: string; indiaSalary: string; usaSalary: string; canadaSalary: string; dubaiSalary?: string; globalGrowth: number; updatedAt: string }
type TrendRow = { id: string; career: string; year: number; value: number; updatedAt: string }
type ComparisonRow = { id: string; careerA: string; careerB: string; executiveSummary: string; categories: string[]; growthLeader?: string; note?: string; adjacentA?: string[]; adjacentB?: string[]; jobLinksA?: string[]; jobLinksB?: string[]; updatedAt: string }

type QuizConfig = { interests: string[]; workStyles: string[]; salaryFocus: string[]; studyLength: string[]; description?: string; updatedAt: string }

export default function CmsCareersUnifiedPage() {
  // Dynamic Career Catalog
  const [careers, setCareers] = useState<CareerRow[]>([])
  const careerOptions = useMemo(() => careers.map((c) => ({ label: c.name, value: c.key })), [careers])
  const nameFor = (key: string) => careers.find((c) => c.key === key)?.name || key

  // Persist careers to localStorage (temporary until backend)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cms_career_catalog")
      if (raw) {
        const parsed = JSON.parse(raw) as CareerRow[]
        if (Array.isArray(parsed)) setCareers(parsed)
      }
    } catch {}
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem("cms_career_catalog", JSON.stringify(careers))
    } catch {}
  }, [careers])

  // Selection for quick comparison preview
  const [selected, setSelected] = useState<string[]>([])

  // Local stores for each section (UI-only)
  const [adjacentRows, setAdjacentRows] = useState<AdjacentRow[]>([])
  const [linkRows, setLinkRows] = useState<JobLinkRow[]>([])
  const [intlRows, setIntlRows] = useState<InternationalRow[]>([])
  const [trendRows, setTrendRows] = useState<TrendRow[]>([])
  const [comparisons, setComparisons] = useState<ComparisonRow[]>([])
  const [quiz, setQuiz] = useState<QuizConfig | null>(null)

  // Roles management (moved from /cms/careers)
  type RoleRow = {
    id: number
    role: string
    company: string
    level: "Junior" | "Mid" | "Senior"
    status: "draft" | "published"
    updatedAt: string
    active?: boolean
    url?: string
    tags?: string
  }
  const [roles, setRoles] = useState<RoleRow[]>([])
  const [roleAddOpen, setRoleAddOpen] = useState(false)
  const [roleEditOpen, setRoleEditOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<RoleRow | null>(null)

  // Collapsible sections state
  const [open, setOpen] = useState<Record<string, boolean>>({
    roles: true,
    international: false,
    trends: false,
    adjacent: false,
    links: false,
    comparisons: true,
    quiz: false,
  })

  // Schemas
  const catalogSchema: FieldSpec[] = [
    { name: "key", label: "Career Key", type: "text", required: true, placeholder: "e.g., software_engineer" },
    { name: "name", label: "Career Name", type: "text", required: true, placeholder: "e.g., Software Development" },
  ]
  const roleSchema: FieldSpec[] = [
    { name: "role", label: "Role", type: "text", required: true },
    { name: "company", label: "Company", type: "text", required: true },
    { name: "level", label: "Level", type: "select", options: ["Junior","Mid","Senior"].map(v=>({label:v,value:v})) },
    { name: "status", label: "Status", type: "select", options: ["draft","published"].map(v=>({label:v,value:v})) },
    { name: "active", label: "Active", type: "select", options: [
      { label: "Active", value: "true" },
      { label: "Inactive", value: "false" },
    ] },
    { name: "url", label: "URL", type: "text", placeholder: "Optional link" },
    { name: "tags", label: "Tags", type: "tags" },
  ]
  const adjacentSchema: FieldSpec[] = [
    { name: "career", label: "Career", type: "select", required: true, options: careerOptions },
    { name: "related", label: "Adjacent / Alternative", type: "select", required: true, options: careerOptions },
    { name: "label", label: "Label", type: "text", placeholder: "Optional custom label" },
  ]
  const linkSchema: FieldSpec[] = [
    { name: "career", label: "Career", type: "select", required: true, options: careerOptions },
    { name: "source", label: "Source", type: "select", required: true, options: ["Indeed","LinkedIn Jobs","Internshala","Naukri","Custom"].map((s)=>({label:s,value:s})) },
    { name: "label", label: "Label", type: "text", required: true },
    { name: "url", label: "URL", type: "text", required: true, placeholder: "https://..." },
  ]
  const intlSchema: FieldSpec[] = [
    { name: "career", label: "Career", type: "select", required: true, options: careerOptions },
    { name: "indiaSalary", label: "India Salary", type: "text", required: true, placeholder: "₹7 LPA" },
    { name: "usaSalary", label: "USA Salary", type: "text", required: true, placeholder: "$85k/year" },
    { name: "canadaSalary", label: "Canada Salary", type: "text", required: true, placeholder: "CAD $75k/year" },
    { name: "dubaiSalary", label: "Dubai Salary", type: "text", placeholder: "AED 160k/year" },
    { name: "globalGrowth", label: "Global Growth %", type: "number", required: true },
  ]
  const trendAddSchema: FieldSpec[] = [
    { name: "career", label: "Career", type: "select", required: true, options: careerOptions },
    { name: "year", label: "Year", type: "number", required: true },
    { name: "value", label: "Value", type: "number", required: true },
  ]
  const trendBulkSchema: FieldSpec[] = [
    { name: "career", label: "Career", type: "select", required: true, options: careerOptions },
    { name: "startYear", label: "Start Year", type: "number", required: true },
    { name: "endYear", label: "End Year", type: "number", required: true },
    { name: "startValue", label: "Start Value", type: "number", required: true },
    { name: "deltaPerYear", label: "Delta per Year", type: "number", required: true, placeholder: "+3 or -2" },
  ]
  const compareSchema: FieldSpec[] = [
    { name: "careerA", label: "Career A", type: "select", required: true, options: careerOptions },
    { name: "careerB", label: "Career B", type: "select", required: true, options: careerOptions },
    { name: "executiveSummary", label: "Executive Summary", type: "textarea", required: true },
    { name: "categories", label: "Categories", type: "tags" },
    { name: "growthLeader", label: "Growth Leader", type: "select", options: careerOptions },
    { name: "note", label: "Note", type: "textarea", placeholder: "Comfort Index etc." },
    { name: "adjacentA", label: "Adjacent — Career A", type: "tags" },
    { name: "adjacentB", label: "Adjacent — Career B", type: "tags" },
    { name: "jobLinksA", label: "Job Links — Career A", type: "tags" },
    { name: "jobLinksB", label: "Job Links — Career B", type: "tags" },
  ]
  const quizSchema: FieldSpec[] = [
    { name: "interests", label: "Interests", type: "tags" },
    { name: "workStyles", label: "Work Styles", type: "tags" },
    { name: "salaryFocus", label: "Salary Focus", type: "tags" },
    { name: "studyLength", label: "Study Length", type: "tags" },
    { name: "description", label: "Description", type: "textarea" },
  ]

  // Columns
  const adjacentCols: Column<AdjacentRow>[] = [
    { key: "career", header: "Career", render: (r) => nameFor(r.career) },
    { key: "related", header: "Adjacent", render: (r) => nameFor(r.related) },
    { key: "label", header: "Label", render: (r) => r.label || "-" },
  ]
  const linkCols: Column<JobLinkRow>[] = [
    { key: "career", header: "Career", render: (r) => nameFor(r.career) },
    { key: "source", header: "Source" },
    { key: "label", header: "Label" },
    { key: "url", header: "URL", render: (r) => <a className="text-blue-600 underline" href={r.url} target="_blank">Open</a> },
  ]
  const intlCols: Column<InternationalRow>[] = [
    { key: "career", header: "Career", render: (r) => nameFor(r.career) },
    { key: "indiaSalary", header: "India" },
    { key: "usaSalary", header: "USA" },
    { key: "canadaSalary", header: "Canada" },
    { key: "dubaiSalary", header: "Dubai" },
    { key: "globalGrowth", header: "Global Growth %" },
  ]
  const trendCols: Column<TrendRow>[] = [
    { key: "career", header: "Career", render: (r) => nameFor(r.career) },
    { key: "year", header: "Year" },
    { key: "value", header: "Value" },
  ]
  const compareCols: Column<ComparisonRow>[] = [
    { key: "pair", header: "Pair", render: (r) => `${nameFor(r.careerA)} vs ${nameFor(r.careerB)}` },
    { key: "categories", header: "Categories", render: (r) => r.categories.join(", ") },
    { key: "growthLeader", header: "Growth Leader", render: (r) => r.growthLeader ? nameFor(r.growthLeader) : "-" },
  ]

  // Roles columns
  const roleCols: Column<RoleRow>[] = [
    { key: "role", header: "Role", className: "min-w-[240px]", sortable: true },
    { key: "company", header: "Company", sortable: true },
    { key: "level", header: "Level", sortable: true },
    { key: "url", header: "URL", render: (r) => r.url ? <a href={r.url} target="_blank" className="text-blue-600 underline">Open</a> : "" },
    { key: "tags", header: "Tags" },
    { key: "active", header: "Active", sortable: true, render: (r) => (
      <label className="inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={!!r.active}
          onChange={(e) => toggleRoleActive(r.id, e.target.checked)}
          aria-label={`Set ${r.role} ${r.active ? "inactive" : "active"}`}
        />
        <span className={r.active ? "text-green-600" : "text-muted-foreground"}>{r.active ? "Active" : "Inactive"}</span>
      </label>
    ) },
    { key: "status", header: "Status", render: (r) => (<span className={`px-2 py-0.5 rounded text-xs ${r.status === "published" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}`}>{r.status}</span>) },
    { key: "updatedAt", header: "Updated", sortable: true, sortAccessor: (r) => +new Date(r.updatedAt) },
    { key: "actions", header: "", className: "w-[160px]", render: (r) => (
      <div className="flex justify-end gap-2">
        <Button size="sm" variant="outline" onClick={() => openRoleEdit(r)}>Edit</Button>
        <Button size="sm" variant="outline" onClick={() => deleteRole(r.id)}>Delete</Button>
      </div>
    )},
  ]

  // Handlers
  function addAdjacent(values: Record<string, any>) {
    const id = `${values.career}__${values.related}`
    const row: AdjacentRow = { id, career: values.career as string, related: values.related as string, label: values.label ?? "", updatedAt: new Date().toISOString() }
    setAdjacentRows((p) => [row, ...p])
  }
  function addLink(values: Record<string, any>) {
    const id = `${values.career}__${values.label}`
    const row: JobLinkRow = { id, career: values.career as string, source: values.source, label: values.label, url: values.url, updatedAt: new Date().toISOString() }
    setLinkRows((p) => [row, ...p])
  }
  function addIntl(values: Record<string, any>) {
    const id = `${values.career}`
    const row: InternationalRow = { id, career: values.career as string, indiaSalary: values.indiaSalary, usaSalary: values.usaSalary, canadaSalary: values.canadaSalary, dubaiSalary: values.dubaiSalary ?? "", globalGrowth: Number(values.globalGrowth ?? 0), updatedAt: new Date().toISOString() }
    setIntlRows((p) => [row, ...p])
  }
  function addTrend(values: Record<string, any>) {
    const id = `${values.career}__${values.year}`
    const row: TrendRow = { id, career: values.career as string, year: Number(values.year), value: Number(values.value), updatedAt: new Date().toISOString() }
    setTrendRows((p) => [row, ...p])
  }
  function addTrendBulk(values: Record<string, any>) {
    const c = values.career as string
    const start = Number(values.startYear)
    const end = Number(values.endYear)
    const startVal = Number(values.startValue)
    const delta = Number(values.deltaPerYear)
    if (!c || isNaN(start) || isNaN(end) || start > end) return
    const now = new Date().toISOString()
    const newRows: TrendRow[] = []
    for (let y = start; y <= end; y++) {
      const offset = y - start
      const val = startVal + offset * delta
      newRows.push({ id: `${c}__${y}` , career: c, year: y, value: val, updatedAt: now })
    }
    setTrendRows((p) => [...newRows, ...p.filter(r => r.career !== c || r.year < start || r.year > end)])
  }
  function addCompare(values: Record<string, any>) {
    const id = `${values.careerA}__${values.careerB}`
    const row: ComparisonRow = { id, careerA: values.careerA as string, careerB: values.careerB as string, executiveSummary: values.executiveSummary ?? "", categories: (values.categories ?? []) as string[], growthLeader: (values.growthLeader || undefined) as string | undefined, note: values.note ?? "", adjacentA: (values.adjacentA ?? []) as string[], adjacentB: (values.adjacentB ?? []) as string[], jobLinksA: (values.jobLinksA ?? []) as string[], jobLinksB: (values.jobLinksB ?? []) as string[], updatedAt: new Date().toISOString() }
    setComparisons((p) => [row, ...p])
  }
  function saveQuiz(values: Record<string, any>) {
    setQuiz({ interests: values.interests ?? [], workStyles: values.workStyles ?? [], salaryFocus: values.salaryFocus ?? [], studyLength: values.studyLength ?? [], description: values.description ?? "", updatedAt: new Date().toISOString() })
  }

  const selectedNames = useMemo(() => selected.map((k) => nameFor(k)), [selected, careers])

  // Role handlers
  function addRole(values: Record<string, any>) {
    const row: RoleRow = {
      id: (roles.at(0)?.id ?? 0) + Math.ceil(Math.random() * 1000),
      role: values.role,
      company: values.company,
      level: (values.level as RoleRow["level"]) ?? "Junior",
      status: (values.status as RoleRow["status"]) ?? "draft",
      updatedAt: new Date().toISOString(),
      active: values.active ? values.active === "true" : (values.status === "published"),
      url: values.url ?? "",
      tags: values.tags ?? "",
    }
    setRoles((prev) => [row, ...prev])
  }
  function openRoleEdit(row: RoleRow) { setEditingRole(row); setRoleEditOpen(true) }
  function editRole(values: Record<string, any>) {
    if (!editingRole) return
    const id = editingRole.id
    setRoles((prev) => prev.map((r) => r.id === id ? {
      ...r,
      role: values.role,
      company: values.company,
      level: (values.level as RoleRow["level"]) ?? r.level,
      status: (values.status as RoleRow["status"]) ?? r.status,
      updatedAt: new Date().toISOString(),
      active: values.active ? values.active === "true" : (values.status ? values.status === "published" : !!r.active),
      url: values.url ?? r.url,
      tags: values.tags ?? r.tags,
    } : r))
  }
  function deleteRole(id: number) { setRoles((prev) => prev.filter((x) => x.id !== id)) }
  function toggleRoleActive(id: number, next: boolean) { setRoles((prev) => prev.map((r) => r.id === id ? { ...r, active: next } : r)) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold flex items-center gap-2">
          <LineChart className="h-5 w-5 text-primary" />
          Careers — All-in-one
        </h1>
        <div className="text-sm text-muted-foreground">Select 2–3 careers to preview comparison</div>
      </div>

      {/* Career Catalog */}
      <Section title="Career Catalog" open={true} onToggle={() => {}}>
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm text-muted-foreground">Add careers dynamically. These drive all selectors below.</div>
          <AddButton label="Add Career" schema={catalogSchema} onSubmit={(v) => {
            const id = v.key
            if (!v.key || !v.name) return
            // Avoid duplicates by key
            setCareers((prev) => [{ id, key: v.key, name: v.name, updatedAt: new Date().toISOString() }, ...prev.filter((c) => c.key !== v.key)])
          }} />
        </div>
        <DataTable
          columns={[
            { key: "key", header: "Key" },
            { key: "name", header: "Name" },
          ] as Column<CareerRow>[]}
          rows={careers}
          rowKey={(r: CareerRow) => r.id}
          searchableKeys={["key","name"]}
        />
        {/* Quick selector driven by dynamic careers */}
        <div className="mt-3 flex flex-wrap gap-2">
          {careers.map((c) => (
            <button
              key={c.key}
              className={"px-2 py-1 text-xs rounded border " + (selected.includes(c.key) ? "bg-primary text-primary-foreground border-primary" : "border-border")}
              onClick={() => setSelected((prev) => prev.includes(c.key) ? prev.filter((k) => k !== c.key) : (prev.length >= 3 ? prev : [...prev, c.key]))}
              aria-pressed={selected.includes(c.key)}
            >
              {c.name}
            </button>
          ))}
          {selected.length > 0 && (
            <button className="text-xs px-2 py-1 rounded border border-border" onClick={() => setSelected([])}>Clear</button>
          )}
        </div>
      </Section>

      {/* Quick Comparison Preview */}
      {selected.length >= 2 && (
        <div className="rounded border border-border p-3 bg-accent/30">
          <div className="mb-2 font-medium">Comparison preview: {selectedNames.join(" vs ")}</div>
          <div className="text-xs text-muted-foreground">Use the Comparisons section below to author the full executive summary and notes.</div>
        </div>
      )}

      {/* Sections */}
      <Section title="Roles" open={open.roles} onToggle={() => setOpen((o) => ({ ...o, roles: !o.roles }))}>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="text-sm text-muted-foreground">Manage role postings and metadata.</div>
          <Button onClick={() => setRoleAddOpen(true)}>Add Role</Button>
        </div>
        <DataTable<RoleRow>
          columns={roleCols}
          rows={roles}
          rowKey={(r) => String(r.id)}
          searchableKeys={["role","company","level"]}
        />
        <EntityDialog<any>
          open={roleAddOpen}
          onOpenChange={setRoleAddOpen}
          title="Add Role"
          submitLabel="Create"
          schema={roleSchema}
          onSubmit={addRole}
        />
        {editingRole && (
          <EntityDialog<any>
            open={roleEditOpen}
            onOpenChange={(o) => { setRoleEditOpen(o); if (!o) setEditingRole(null) }}
            title={`Edit: ${editingRole.role}`}
            submitLabel="Save"
            schema={roleSchema}
            initial={{
              role: editingRole.role,
              company: editingRole.company,
              level: editingRole.level,
              status: editingRole.status,
              active: editingRole.active ? "true" : "false",
              url: editingRole.url ?? "",
              tags: editingRole.tags ?? "",
            }}
            onSubmit={editRole}
          />
        )}
      </Section>

      <Section title="International Profiles" open={open.international} onToggle={() => setOpen((o) => ({ ...o, international: !o.international }))}>
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-muted-foreground">India/USA/Canada/Dubai salaries and global growth.</div>
          <EntityDialog open={false} onOpenChange={()=>{}} title="" schema={[]} onSubmit={()=>{}} />
          <AddButton label="Add Profile" schema={intlSchema} onSubmit={addIntl} />
        </div>
        <DataTable columns={intlCols} rows={intlRows} rowKey={(r: InternationalRow) => r.id} searchableKeys={["career","indiaSalary","usaSalary","canadaSalary","dubaiSalary"]} />
      </Section>

      <Section title="Career Trends" open={open.trends} onToggle={() => setOpen((o) => ({ ...o, trends: !o.trends }))}>
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-muted-foreground">Manage demand trend points (2015–2030).</div>
          <div className="flex gap-2">
            <AddButton label="Add Trend Point" schema={trendAddSchema} onSubmit={addTrend} />
            <AddButton label="Bulk Add (Range)" schema={trendBulkSchema} onSubmit={addTrendBulk} />
          </div>
        </div>
        <DataTable columns={trendCols} rows={trendRows} rowKey={(r: TrendRow) => r.id} searchableKeys={["career","year"]} />
      </Section>

      <Section title="Adjacent & Alternative Roles" open={open.adjacent} onToggle={() => setOpen((o) => ({ ...o, adjacent: !o.adjacent }))}>
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-muted-foreground">Map adjacent or alternative roles per career.</div>
          <AddButton label="Add Mapping" schema={adjacentSchema} onSubmit={addAdjacent} />
        </div>
        <DataTable columns={adjacentCols} rows={adjacentRows} rowKey={(r: AdjacentRow) => r.id} searchableKeys={["career","related","label"]} />
      </Section>

      <Section title="Career Job Links" open={open.links} onToggle={() => setOpen((o) => ({ ...o, links: !o.links }))}>
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-muted-foreground">Add job/internship links per career.</div>
          <AddButton label="Add Link" schema={linkSchema} onSubmit={addLink} />
        </div>
        <DataTable columns={linkCols} rows={linkRows} rowKey={(r: JobLinkRow) => r.id} searchableKeys={["career","source","label","url"]} />
      </Section>

      <Section title="Career Comparisons" open={open.comparisons} onToggle={() => setOpen((o) => ({ ...o, comparisons: !o.comparisons }))}>
        <div className="flex justify-between items-center mb-2">
          <div className="text-sm text-muted-foreground">Author executive summary, leaders, categories, notes, and related links for a pair.</div>
          <AddButton label="Add Comparison" schema={compareSchema} onSubmit={addCompare} />
        </div>
        <DataTable columns={compareCols} rows={comparisons} rowKey={(r: ComparisonRow) => r.id} searchableKeys={["pair","categories","growthLeader"]} />
      </Section>

      <Section title="Career Fit Mini-Quiz" open={open.quiz} onToggle={() => setOpen((o) => ({ ...o, quiz: !o.quiz }))}>
        <div className="flex items-center gap-2">
          <AddButton label={quiz ? "Edit Config" : "Create Config"} schema={quizSchema} onSubmit={saveQuiz} initial={quiz ?? {}} />
          {quiz && <Button variant="outline" onClick={() => { /* read-only modal reuse via AddButton not ideal; left minimal */ }}>View</Button>}
        </div>
        {quiz && (
          <div className="mt-3 text-sm text-muted-foreground">
            <div>Interests: {quiz.interests.join(", ") || "-"}</div>
            <div>Work Styles: {quiz.workStyles.join(", ") || "-"}</div>
            <div>Salary Focus: {quiz.salaryFocus.join(", ") || "-"}</div>
            <div>Study Length: {quiz.studyLength.join(", ") || "-"}</div>
          </div>
        )}
      </Section>
    </div>
  )
}

function Section({ title, open, onToggle, children }: { title: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="border border-border rounded">
      <button className="w-full flex items-center justify-between px-3 py-2 text-sm bg-accent/50" onClick={onToggle} aria-expanded={open}>
        <span className="font-medium">{title}</span>
        <span className={"transition-transform " + (open ? "rotate-90" : "rotate-0")}>▶</span>
      </button>
      {open && <div className="p-3">{children}</div>}
    </div>
  )
}

function AddButton({ label, schema, onSubmit, initial }: { label: string; schema: FieldSpec[]; onSubmit: (v: Record<string, any>) => void; initial?: Record<string, any> }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}>{label}</Button>
      <EntityDialog<any>
        open={open}
        onOpenChange={setOpen}
        title={label}
        submitLabel="Save"
        schema={schema}
        initial={initial}
        onSubmit={(v) => { onSubmit(v); setOpen(false) }}
      />
    </>
  )
}
