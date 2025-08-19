"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import UserMenu from "@/components/user-menu"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, Briefcase, Gift, Home as HomeIcon, Utensils, HeartHandshake, Search, ClipboardList, FolderOpen, Landmark } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import ExamsMegaMenu from "@/components/exams/ExamsMegaMenu"

const nav = [
  { href: "/resources", label: "Resources" },
  { href: "/schemes", label: "Schemes" },
  { href: "/books", label: "Used Books", icon: BookOpen },
  { href: "/hostels", label: "PG/Hostels", icon: HomeIcon },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
  { href: "/tiffin", label: "Tiffin Services", icon: Utensils },
  { href: "/wellbeing", label: "Wellbeing", icon: HeartHandshake },
  { href: "/deals", label: "Student Deals", icon: Gift },
]

export default function SiteNavbar() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [showSearch, setShowSearch] = useState(false)
  const [q, setQ] = useState("")

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center gap-3">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-base mr-2">
          <span className="inline-flex w-7 h-7 bg-primary rounded-lg items-center justify-center">
            <BookOpen className="w-4 h-4 text-primary-foreground" />
          </span>
          CampusHub
        </Link>

        {/* Primary nav: grouped headings with hover submenus */}
        <nav className="hidden md:flex items-center gap-2 text-sm">
          <NavigationMenu delayDuration={100} skipDelayDuration={400}>
            <NavigationMenuList>
              {/* Exams (Top-level with mega menu) */}
              <NavigationMenuItem key="exams">
                <NavigationMenuTrigger>Exams</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ExamsMegaMenu mode="content" />
                </NavigationMenuContent>
              </NavigationMenuItem>
              {/* Academics */}
              <NavigationMenuItem key="academics">
                <NavigationMenuTrigger>Academics</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-1 p-2 w-56">
                    <NavigationMenuLink asChild>
                      <Link href="/resources" className="rounded-sm px-2 py-2 hover:bg-accent flex flex-row items-center gap-2 text-foreground">
                        <FolderOpen className="w-4 h-4" />
                        <span>Resources</span>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/schemes" className="rounded-sm px-2 py-2 hover:bg-accent flex flex-row items-center gap-2 text-foreground">
                        <Landmark className="w-4 h-4" />
                        <span>Schemes</span>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Student Life */}
              <NavigationMenuItem key="student-life">
                <NavigationMenuTrigger>Student Life</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-1 p-2 w-56">
                    <NavigationMenuLink asChild>
                      <Link href="/books" className="rounded-sm px-2 py-2 hover:bg-accent flex flex-row items-center gap-2 text-foreground">
                        <BookOpen className="w-4 h-4" /> Used Books
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/hostels" className="rounded-sm px-2 py-2 hover:bg-accent flex flex-row items-center gap-2 text-foreground">
                        <HomeIcon className="w-4 h-4" /> PG/Hostels
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/tiffin" className="rounded-sm px-2 py-2 hover:bg-accent flex flex-row items-center gap-2 text-foreground">
                        <Utensils className="w-4 h-4" /> Tiffin Services
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/wellbeing" className="rounded-sm px-2 py-2 hover:bg-accent flex flex-row items-center gap-2 text-foreground">
                        <HeartHandshake className="w-4 h-4" /> Wellbeing
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Opportunities */}
              <NavigationMenuItem key="opportunities">
                <NavigationMenuTrigger>Opportunities</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-1 p-2 w-56">
                    <NavigationMenuLink asChild>
                      <Link href="/jobs" className="rounded-sm px-2 py-2 hover:bg-accent flex flex-row items-center gap-2 text-foreground">
                        <Briefcase className="w-4 h-4" /> Jobs
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link href="/deals" className="rounded-sm px-2 py-2 hover:bg-accent flex flex-row items-center gap-2 text-foreground">
                        <Gift className="w-4 h-4" /> Student Deals
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
            <NavigationMenuViewport />
          </NavigationMenu>
        </nav>

        {/* Right controls */}
        <div className="ml-auto flex items-center gap-2">
          {showSearch && (
            <Input
              className="w-40 sm:w-56 md:w-64 transition-all"
              placeholder="Search..."
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setShowSearch(false)
              }}
            />
          )}
          <Button variant="ghost" size="sm" onClick={() => setShowSearch((v) => !v)} aria-label="Toggle search">
            <Search className="w-4 h-4" />
          </Button>
          {user && (
            <Button asChild size="sm">
              <Link href="/subscribe">Subscribe</Link>
            </Button>
          )}
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
