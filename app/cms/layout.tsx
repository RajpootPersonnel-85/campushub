import type { ReactNode } from "react"
import Link from "next/link"
import CmsSidebar from "@/components/cms/CmsSidebar"

export default function CmsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        <CmsSidebar />
        <div className="flex-1 min-w-0">
          <header className="border-b border-border p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur z-10">
            <div className="md:hidden">
              <Link href="/cms" className="font-semibold">CampusHub CMS</Link>
            </div>
            <div className="text-sm text-muted-foreground">Admin</div>
          </header>
          <main className="p-4 md:p-6 max-w-6xl mx-auto w-full">{children}</main>
        </div>
      </div>
    </div>
  )
}

//
