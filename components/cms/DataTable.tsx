"use client"

import { useMemo, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export type Column<T> = {
  key: keyof T | string
  header: string
  className?: string
  align?: "left" | "right" | "center"
  render?: (row: T) => React.ReactNode
  sortable?: boolean
  sortAccessor?: (row: T) => string | number | Date
}

export type DataTableProps<T> = {
  columns: Column<T>[]
  rows: T[]
  rowKey?: (row: T, index: number) => string
  searchableKeys?: (keyof T | string)[]
  rightActions?: React.ReactNode
  pageSizeOptions?: number[]
  selectable?: boolean
  onSelectionChange?: (keys: string[]) => void
  bulkActions?: React.ReactNode
}

export function DataTable<T extends Record<string, any>>({
  columns,
  rows,
  rowKey,
  searchableKeys = [],
  rightActions,
  pageSizeOptions = [10, 20, 50],
  selectable = false,
  onSelectionChange,
  bulkActions,
}: DataTableProps<T>) {
  const [q, setQ] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(pageSizeOptions[0])
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  const filtered = useMemo(() => {
    if (!q.trim()) return rows
    const lower = q.toLowerCase()
    return rows.filter((r) =>
      searchableKeys.some((k) => String(r[k as keyof T] ?? "").toLowerCase().includes(lower))
    )
  }, [q, rows, searchableKeys])

  const sorted = useMemo(() => {
    if (!sortKey) return filtered
    // find column for accessor if provided
    const col = columns.find(c => String(c.key) === sortKey)
    const accessor = col?.sortAccessor
    const toValue = (row: T) => {
      if (accessor) return accessor(row)
      const v = row[sortKey as keyof T] as any
      return v
    }
    const arr = [...filtered]
    arr.sort((a, b) => {
      const va = toValue(a)
      const vb = toValue(b)
      let cmp = 0
      if (va == null && vb != null) cmp = -1
      else if (va != null && vb == null) cmp = 1
      else if (va == null && vb == null) cmp = 0
      else if (va instanceof Date || vb instanceof Date) cmp = new Date(va).getTime() - new Date(vb).getTime()
      else if (typeof va === "number" && typeof vb === "number") cmp = va - vb
      else cmp = String(va).localeCompare(String(vb))
      return sortDir === "asc" ? cmp : -cmp
    })
    return arr
  }, [filtered, sortKey, sortDir, columns])

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize))
  const start = (page - 1) * pageSize
  const paged = sorted.slice(start, start + pageSize)

  const allPagedSelected = useMemo(() => {
    if (!selectable) return false
    return paged.every((row, i) => selectedKeys.includes(rowKey ? rowKey(row, start + i) : String(start + i))) && paged.length > 0
  }, [paged, selectedKeys, selectable, rowKey, start])

  function toggleHeaderSelection() {
    if (!selectable) return
    if (allPagedSelected) {
      // deselect paged
      const pageKeys = paged.map((row, i) => (rowKey ? rowKey(row, start + i) : String(start + i)))
      const next = selectedKeys.filter(k => !pageKeys.includes(k))
      setSelectedKeys(next)
      onSelectionChange?.(next)
    } else {
      // select all paged
      const pageKeys = paged.map((row, i) => (rowKey ? rowKey(row, start + i) : String(start + i)))
      const set = new Set([...selectedKeys, ...pageKeys])
      const next = Array.from(set)
      setSelectedKeys(next)
      onSelectionChange?.(next)
    }
  }

  function toggleRowSelection(row: T, index: number) {
    if (!selectable) return
    const key = rowKey ? rowKey(row, index) : String(index)
    const exists = selectedKeys.includes(key)
    const next = exists ? selectedKeys.filter(k => k !== key) : [...selectedKeys, key]
    setSelectedKeys(next)
    onSelectionChange?.(next)
  }

  function onColumnHeaderClick(c: Column<T>) {
    if (!c.sortable) return
    const key = String(c.key)
    if (sortKey === key) {
      setSortDir(d => (d === "asc" ? "desc" : "asc"))
    } else {
      setSortKey(key)
      setSortDir("asc")
    }
    setPage(1)
  }

  return (
    <Card>
      <CardContent className="p-0">
        {/* Toolbar */}
        <div className="p-3 border-b border-border flex items-center gap-2">
          {selectable && selectedKeys.length > 0 && (
            <div className="text-sm px-2 py-1 rounded bg-accent">
              {selectedKeys.length} selected
            </div>
          )}
          <Input
            placeholder="Search..."
            value={q}
            onChange={(e) => {
              setQ(e.target.value)
              setPage(1)
            }}
            className="max-w-xs"
          />
          <div className="ml-auto flex items-center gap-2">
            {selectable && selectedKeys.length > 0 ? bulkActions : rightActions}
            <Select value={String(pageSize)} onValueChange={(v) => { setPageSize(Number(v)); setPage(1) }}>
              <SelectTrigger className="w-[90px]"><SelectValue /></SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map((n) => (
                  <SelectItem key={n} value={String(n)}>{n}/page</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {selectable && (
                  <TableHead className="w-[40px]">
                    <input
                      type="checkbox"
                      className="h-4 w-4 align-middle"
                      checked={allPagedSelected}
                      onChange={toggleHeaderSelection}
                    />
                  </TableHead>
                )}
                {columns.map((c) => (
                  <TableHead
                    key={String(c.key)}
                    className={c.className + (c.sortable ? " cursor-pointer select-none" : "")}
                    onClick={() => onColumnHeaderClick(c)}
                  >
                    <span className="inline-flex items-center gap-1">
                      {c.header}
                      {c.sortable && String(c.key) === sortKey && (
                        <span className="text-xs text-muted-foreground">{sortDir === "asc" ? "▲" : "▼"}</span>
                      )}
                    </span>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paged.map((row, i) => {
                const absoluteIndex = start + i
                const key = rowKey ? rowKey(row, absoluteIndex) : `${absoluteIndex}`
                const isSelected = selectable && selectedKeys.includes(key)
                return (
                  <TableRow key={key} data-state={isSelected ? "selected" : undefined}>
                    {selectable && (
                      <TableCell className="w-[40px]">
                        <input
                          type="checkbox"
                          className="h-4 w-4 align-middle"
                          checked={isSelected}
                          onChange={() => toggleRowSelection(row, absoluteIndex)}
                        />
                      </TableCell>
                    )}
                    {columns.map((c) => (
                      <TableCell key={String(c.key)} className={c.className}>
                        {c.render ? c.render(row) : String(row[c.key as keyof T] ?? "")}
                      </TableCell>
                    ))}
                  </TableRow>
                )
              })}
              {paged.length === 0 && (
                <TableRow>
                  <TableCell colSpan={(selectable ? 1 : 0) + columns.length} className="text-center py-10 text-muted-foreground text-sm">
                    No records
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="p-3 border-t border-border flex items-center justify-between text-sm">
          <div>
            Showing {sorted.length === 0 ? 0 : start + 1}
            -{Math.min(sorted.length, start + pageSize)} of {sorted.length}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
              Prev
            </Button>
            <div className="px-2 py-1 rounded border border-border">Page {page} / {totalPages}</div>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DataTable
