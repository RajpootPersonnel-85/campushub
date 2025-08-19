"use client"

import React, { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

export type AdSize = "leaderboard" | "rectangle" | "responsive"

export default function AdSlot({
  id,
  size = "responsive",
  className,
  placeholder = true,
}: {
  id: string
  size?: AdSize
  className?: string
  placeholder?: boolean
}) {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // Hook for ad network (e.g., AdSense / GPT) can be placed here.
    // Example AdSense hook (commented):
    // try { (window as any).adsbygoogle = (window as any).adsbygoogle || []; (window as any).adsbygoogle.push({}); } catch {}
  }, [])

  const dims = (() => {
    switch (size) {
      case "leaderboard":
        return "w-full max-w-[970px] h-[90px] sm:h-[90px]"
      case "rectangle":
        return "w-[300px] h-[250px] sm:w-[336px] sm:h-[280px]"
      default:
        return "w-full min-h-[90px]"
    }
  })()

  return (
    <div
      ref={ref}
      data-ad-slot={id}
      className={cn(
        "mx-auto flex items-center justify-center",
        dims,
        placeholder && "border border-dashed rounded-md text-xs text-muted-foreground bg-muted/40",
        className
      )}
    >
      {placeholder && <span>Ad Slot: {id}</span>}
    </div>
  )}
