"use client"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type FieldType = "text" | "number" | "textarea" | "select" | "date" | "tags"

export type FieldSpec = {
  name: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  options?: { label: string; value: string }[] // for select
}

export type EntityDialogProps<T extends Record<string, any>> = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  submitLabel?: string
  schema: FieldSpec[]
  initial?: Partial<T>
  onSubmit: (values: T) => Promise<void> | void
  readOnly?: boolean
}

export default function EntityDialog<T extends Record<string, any>>({
  open,
  onOpenChange,
  title,
  submitLabel = "Save",
  schema,
  initial,
  onSubmit,
  readOnly = false,
}: EntityDialogProps<T>) {
  const initialState = useMemo(() => {
    const base: Record<string, any> = {}
    for (const f of schema) base[f.name] = initial?.[f.name] ?? ""
    return base
  }, [schema, initial])

  const [values, setValues] = useState<Record<string, any>>(initialState)
  const [saving, setSaving] = useState(false)

  useEffect(() => setValues(initialState), [initialState])

  function set(name: string, value: any) {
    setValues((v) => ({ ...v, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (readOnly) {
      onOpenChange(false)
      return
    }
    setSaving(true)
    await onSubmit(values as T)
    setSaving(false)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
            {schema.map((f) => (
              <div key={f.name} className={f.type === "textarea" ? "md:col-span-2" : undefined}>
                <label className="block text-sm mb-1">
                  {f.label}{f.required && !readOnly ? <span className="text-red-600">*</span> : null}
                </label>
                {f.type === "text" && (
                  <Input
                    placeholder={f.placeholder}
                    value={values[f.name] ?? ""}
                    onChange={(e) => set(f.name, e.target.value)}
                    required={readOnly ? false : f.required}
                    disabled={readOnly}
                  />
                )}
                {f.type === "number" && (
                  <Input
                    type="number"
                    placeholder={f.placeholder}
                    value={values[f.name] ?? ""}
                    onChange={(e) => set(f.name, e.target.value)}
                    required={readOnly ? false : f.required}
                    disabled={readOnly}
                  />
                )}
                {f.type === "textarea" && (
                  <Textarea
                    rows={6}
                    placeholder={f.placeholder}
                    value={values[f.name] ?? ""}
                    onChange={(e) => set(f.name, e.target.value)}
                    required={readOnly ? false : f.required}
                    disabled={readOnly}
                  />
                )}
                {f.type === "select" && (
                  <Select value={values[f.name] ?? ""} onValueChange={(v) => set(f.name, v)}>
                    <SelectTrigger disabled={readOnly}><SelectValue placeholder={f.placeholder} /></SelectTrigger>
                    <SelectContent>
                      {(f.options ?? []).map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {f.type === "date" && (
                  <Input type="date" value={values[f.name] ?? ""} onChange={(e) => set(f.name, e.target.value)} disabled={readOnly} />
                )}
                {f.type === "tags" && (
                  <Input
                    placeholder="Comma separated"
                    value={values[f.name] ?? ""}
                    onChange={(e) => set(f.name, e.target.value)}
                    disabled={readOnly}
                  />
                )}
              </div>
            ))}
          </div>
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{readOnly ? "Close" : "Cancel"}</Button>
            {!readOnly && (
              <Button type="submit" disabled={saving}>{saving ? "Saving..." : submitLabel}</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
