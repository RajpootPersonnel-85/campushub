"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Menu,
  LayoutDashboard,
  Book,
  FileText,
  Briefcase,
  Building2,
  Tags,
  GraduationCap,
  Library,
  Landmark,
  Users,
  LineChart,
  Utensils,
  HeartPulse,
  Megaphone,
  Inbox,
  Settings,
  Search as SearchIcon,
  RefreshCcw,
} from "lucide-react"

export default function CmsSidebar() {
  const pathname = usePathname()

  type SectionDef = { key: string; title: string; items: { href: string; label: string }[] }
  const sections = useMemo<SectionDef[]>(() => ([
    { key: "general", title: "General", items: [
      { href: "/cms", label: "Dashboard" },
    ]},
    { key: "market", title: "Marketplace", items: [
      { href: "/cms/books", label: "Books" },
      { href: "/cms/notes", label: "Notes" },
      { href: "/cms/jobs", label: "Jobs" },
      { href: "/cms/hostels", label: "Hostels" },
      { href: "/cms/deals", label: "Deals" },
    ]},
    { key: "academics", title: "Academics", items: [
      { href: "/cms/exams", label: "Exams" },
      { href: "/cms/resources", label: "Resources" },
      { href: "/cms/schemes", label: "Schemes" },
    ]},
    { key: "community", title: "Community & Career", items: [
      { href: "/cms/community", label: "Community Posts" },
      { href: "/cms/careers/manage", label: "Careers Manage (All-in-one)" },
    ]},
    { key: "wellbeing", title: "Tiffin & Wellbeing", items: [
      { href: "/cms/tiffin", label: "Tiffin" },
      { href: "/cms/wellbeing", label: "Wellbeing" },
    ]},
    { key: "other", title: "Other", items: [
      { href: "/cms/ads", label: "Ads" },
      { href: "/cms/leads", label: "Leads" },
      { href: "/cms/conversions", label: "Conversions" },
      { href: "/cms/settings", label: "Site Settings" },
    ]},
  ]), [])

  const [expanded, setExpanded] = useState<Record<string, boolean>>({})
  const [query, setQuery] = useState("")
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem("cms_sidebar_expanded")
      if (raw) setExpanded(JSON.parse(raw))
      else {
        const def: Record<string, boolean> = {}
        sections.forEach((s) => (def[s.key] = true))
        setExpanded(def)
      }
    } catch {}
  }, [sections])

  useEffect(() => {
    try {
      localStorage.setItem("cms_sidebar_expanded", JSON.stringify(expanded))
    } catch {}
  }, [expanded])

  function toggle(key: string) {
    setExpanded((e) => ({ ...e, [key]: !e[key] }))
  }

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return sections
    return sections
      .map((s) => ({
        ...s,
        items: s.items.filter((it) => it.label.toLowerCase().includes(q)),
      }))
      .filter((s) => s.items.length > 0)
  }, [sections, query])

  function iconFor(label: string) {
    switch (label) {
      case "Dashboard":
        return <LayoutDashboard className="h-4 w-4" />
      case "Books":
        return <Book className="h-4 w-4" />
      case "Notes":
        return <FileText className="h-4 w-4" />
      case "Jobs":
        return <Briefcase className="h-4 w-4" />
      case "Hostels":
        return <Building2 className="h-4 w-4" />
      case "Deals":
        return <Tags className="h-4 w-4" />
      case "Exams":
        return <GraduationCap className="h-4 w-4" />
      case "Resources":
        return <Library className="h-4 w-4" />
      case "Schemes":
        return <Landmark className="h-4 w-4" />
      case "Community Posts":
        return <Users className="h-4 w-4" />
      case "Careers Manage (All-in-one)":
        return <Image src="/careers-logo.svg" alt="Careers" width={16} height={16} />
      case "Tiffin":
        return <Utensils className="h-4 w-4" />
      case "Wellbeing":
        return <HeartPulse className="h-4 w-4" />
      case "Ads":
        return <Megaphone className="h-4 w-4" />
      case "Leads":
        return <Inbox className="h-4 w-4" />
      case "Conversions":
        return <RefreshCcw className="h-4 w-4" />
      case "Site Settings":
        return <Settings className="h-4 w-4" />
      default:
        return null
    }
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-64 border-r border-border min-h-screen p-4 sticky top-0">
        <div className="mb-6">
          <Link href="/cms" className="font-bold text-xl">CampusHub CMS</Link>
          <p className="text-xs text-muted-foreground">Content Management</p>
        </div>
        {/* Search */}
        <div className="mb-3 relative">
          <SearchIcon className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full pl-8 pr-2 py-2 rounded-md border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <nav className="space-y-2 text-sm">
          {filteredSections.map((s) => (
            <div key={s.key} className="">
              <button
                onClick={() => toggle(s.key)}
                className="w-full flex items-center justify-between px-2 py-2 rounded-md text-[10px] uppercase tracking-wider text-muted-foreground hover:bg-accent transition-colors"
                aria-expanded={!!expanded[s.key]}
              >
                <span>{s.title}</span>
                <span className={"transition-transform duration-200 " + (expanded[s.key] ? "rotate-90" : "rotate-0")}>▶</span>
              </button>
              <div
                className={
                  "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out " +
                  (expanded[s.key] ? "max-h-[999px] opacity-100" : "max-h-0 opacity-0")
                }
              >
                <div className="mt-1">
                  {s.items.map((it) => (
                    <NavItem key={it.href} href={it.href} label={it.label} active={pathname === it.href} icon={iconFor(it.label)} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </nav>
        <div className="mt-4 flex gap-2">
          <button
            className="text-xs px-2 py-1 rounded border border-border hover:bg-accent transition-colors"
            onClick={() => {
              const all: Record<string, boolean> = {}
              sections.forEach((s) => (all[s.key] = true))
              setExpanded(all)
            }}
          >
            Expand all
          </button>
          <button
            className="text-xs px-2 py-1 rounded border border-border hover:bg-accent transition-colors"
            onClick={() => {
              const none: Record<string, boolean> = {}
              sections.forEach((s) => (none[s.key] = false))
              setExpanded(none)
            }}
          >
            Collapse all
          </button>
        </div>
      </aside>

      {/* Mobile trigger */}
      <button
        aria-label="Open menu"
        className="fixed md:hidden left-4 bottom-4 z-40 p-3 rounded-full border border-border bg-background shadow-sm hover:bg-accent"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile Drawer */}
      <div
        className={
          "fixed inset-0 z-50 md:hidden " + (mobileOpen ? "pointer-events-auto" : "pointer-events-none")
        }
      >
        {/* Backdrop */}
        <div
          className={
            "absolute inset-0 bg-black/40 transition-opacity " +
            (mobileOpen ? "opacity-100" : "opacity-0")
          }
          onClick={() => setMobileOpen(false)}
        />
        {/* Panel */}
        <div
          className={
            "absolute left-0 top-0 h-full w-72 bg-background border-r border-border p-4 transition-transform duration-300 " +
            (mobileOpen ? "translate-x-0" : "-translate-x-full")
          }
          role="dialog"
          aria-modal="true"
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="font-semibold">Menu</span>
            <button
              className="text-sm text-muted-foreground hover:underline"
              onClick={() => setMobileOpen(false)}
            >
              Close
            </button>
          </div>
          <div className="mb-3 relative">
            <SearchIcon className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-8 pr-2 py-2 rounded-md border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <nav className="space-y-2 text-sm overflow-y-auto h-[calc(100%-100px)]">
            {filteredSections.map((s) => (
              <div key={s.key}>
                <button
                  onClick={() => toggle(s.key)}
                  className="w-full flex items-center justify-between px-2 py-2 rounded-md text-[10px] uppercase tracking-wider text-muted-foreground hover:bg-accent transition-colors"
                  aria-expanded={!!expanded[s.key]}
                >
                  <span>{s.title}</span>
                  <span className={"transition-transform duration-200 " + (expanded[s.key] ? "rotate-90" : "rotate-0")}>▶</span>
                </button>
                <div
                  className={
                    "overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out " +
                    (expanded[s.key] ? "max-h-[999px] opacity-100" : "max-h-0 opacity-0")
                  }
                >
                  <div className="mt-1">
                    {s.items.map((it) => (
                      <NavItem
                        key={it.href}
                        href={it.href}
                        label={it.label}
                        active={pathname === it.href}
                        icon={iconFor(it.label)}
                        onClick={() => setMobileOpen(false)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}

function NavItem({ href, label, active, icon, onClick }: { href: string; label: string; active?: boolean; icon?: ReactNode; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={
        "block rounded-md px-2 py-2 transition-colors " +
        (active ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground")
      }
    >
      <span className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </span>
    </Link>
  )
}
