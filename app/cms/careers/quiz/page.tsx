"use client"

import { useState } from "react"
import EntityDialog, { type FieldSpec } from "@/components/cms/EntityDialog"
import { Button } from "@/components/ui/button"

export type QuizConfig = {
  interests: string[]
  workStyles: string[]
  salaryFocus: string[]
  studyLength: string[]
  description?: string
  updatedAt: string
}

export default function CmsCareerQuizPage() {
  const [config, setConfig] = useState<QuizConfig | null>(null)
  const [open, setOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)

  const schema: FieldSpec[] = [
    { name: "interests", label: "Interests", type: "tags", placeholder: "tech, business, health, design, core" },
    { name: "workStyles", label: "Work Styles", type: "tags", placeholder: "build, analyze, help, create" },
    { name: "salaryFocus", label: "Salary Focus", type: "tags", placeholder: "High, Balanced, Not important" },
    { name: "studyLength", label: "Study Length", type: "tags", placeholder: "short, medium, long" },
    { name: "description", label: "Description", type: "textarea", placeholder: "How recommendations are computed" },
  ]

  function onSave(values: Record<string, any>) {
    const next: QuizConfig = {
      interests: (values.interests ?? []) as string[],
      workStyles: (values.workStyles ?? []) as string[],
      salaryFocus: (values.salaryFocus ?? []) as string[],
      studyLength: (values.studyLength ?? []) as string[],
      description: values.description ?? "",
      updatedAt: new Date().toISOString(),
    }
    setConfig(next)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h1 className="text-xl font-semibold">Career Fit Mini-Quiz</h1>
        <div className="flex gap-2">
          <Button onClick={() => setOpen(true)}>{config ? "Edit Config" : "Create Config"}</Button>
          {config && <Button variant="outline" onClick={() => setViewOpen(true)}>View</Button>}
        </div>
      </div>

      <EntityDialog<any>
        open={open}
        onOpenChange={setOpen}
        title="Configure Quiz"
        submitLabel="Save"
        schema={schema}
        initial={config ?? {}}
        onSubmit={onSave}
      />

      {config && (
        <EntityDialog<any>
          open={viewOpen}
          onOpenChange={setViewOpen}
          title="Quiz Configuration"
          readOnly
          schema={schema}
          initial={config}
          onSubmit={() => {}}
        />
      )}
    </div>
  )
}
