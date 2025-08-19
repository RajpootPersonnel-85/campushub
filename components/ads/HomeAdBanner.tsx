"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"

export default function HomeAdBanner({
  href = "#",
  text = "Endless Entertainment Anytime. Anywhere!",
  className,
}: {
  href?: string
  text?: string
  className?: string
}) {
  return (
    <Link
      href={href}
      className={cn(
        "block w-full max-w-5xl mx-auto",
        className
      )}
    >
      <div className="rounded-2xl overflow-hidden shadow-sm border border-border">
        <div
          className="h-[90px] sm:h-[90px] w-full flex items-center"
          style={{
            background:
              "linear-gradient(90deg, rgba(10,20,40,1) 0%, rgba(25,35,60,1) 50%, rgba(10,20,40,1) 100%)",
          }}
        >
          <div className="px-6 sm:px-8 w-full flex items-center">
            <div className="flex items-center gap-3">
              <div className="px-2 py-1 rounded bg-white/10 text-white text-xs tracking-widest">
                STREAM
              </div>
              <div className="text-amber-300 font-semibold text-base sm:text-lg line-clamp-1">
                {text}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
