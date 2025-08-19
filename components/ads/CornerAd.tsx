"use client"

import { useEffect, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { X, Volume2, VolumeX } from "lucide-react"
import { cn } from "@/lib/utils"

export type CornerAdMedia =
  | { type: "image"; src: string; alt?: string }
  | { type: "video"; src: string; poster?: string; muted?: boolean; loop?: boolean }

export default function CornerAd({
  href,
  media,
  className,
  storageKey = "corner_ad_dismissed",
  showAfterMs = 500,
  width = 320,
  height = 180,
  rememberDismiss = false,
  responsive = false,
  sizeClasses,
}: {
  href?: string
  media: CornerAdMedia
  className?: string
  storageKey?: string // remember dismiss for session
  showAfterMs?: number
  width?: number
  height?: number
  rememberDismiss?: boolean
  responsive?: boolean
  sizeClasses?: string // e.g. "w-40 h-64 sm:w-44 sm:h-72 md:w-48 md:h-80 lg:w-56 lg:h-96"
}) {
  const [visible, setVisible] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [muted, setMuted] = useState(media.type === "video" ? media.muted ?? true : true)
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (rememberDismiss) {
      try {
        const v = sessionStorage.getItem(storageKey)
        if (v === "1") setDismissed(true)
      } catch {}
    }
    const t = setTimeout(() => setVisible(true), showAfterMs)
    return () => clearTimeout(t)
  }, [showAfterMs, storageKey, rememberDismiss])

  useEffect(() => {
    if (media.type === "video" && videoRef.current) {
      videoRef.current.muted = muted
      try { videoRef.current.play().catch(() => {}) } catch {}
    }
  }, [muted, media])

  if (dismissed) return null

  const defaultSizeClasses = "w-40 h-64 sm:w-44 sm:h-72 md:w-48 md:h-80 lg:w-56 lg:h-96" // ~160x256 up to 224x384
  const appliedSizeClasses = responsive ? (sizeClasses || defaultSizeClasses) : ""

  const content = (
    <div
      className={cn(
        "relative rounded-xl overflow-hidden shadow-lg border border-border bg-background",
        appliedSizeClasses,
        "transition-transform duration-300",
        className
      )}
      style={responsive ? undefined : { width, height }}
    >
      {/* Close button */}
      <button
        aria-label="Close ad"
        onClick={(e) => {
          e.preventDefault()
          setDismissed(true)
          if (rememberDismiss) {
            try { sessionStorage.setItem(storageKey, "1") } catch {}
          }
        }}
        className="absolute -top-2 -right-2 z-10 h-7 w-7 rounded-full bg-background shadow flex items-center justify-center hover:bg-background/90"
      >
        <X className="h-4 w-4" />
      </button>

      {media.type === "video" ? (
        <video
          ref={videoRef}
          src={media.src}
          poster={media.poster}
          muted={muted}
          loop={media.loop ?? true}
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
        />
      ) : (
        <Image src={media.src} alt={media.alt || "ad"} fill sizes="320px" className="object-cover" />
      )}

      {media.type === "video" && (
        <button
          aria-label={muted ? "Unmute" : "Mute"}
          onClick={(e) => {
            e.preventDefault()
            setMuted((m) => !m)
          }}
          className="absolute left-2 bottom-2 z-10 h-8 w-8 rounded-full bg-background/70 hover:bg-background shadow flex items-center justify-center"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      )}
    </div>
  )

  return (
    <div
      className={cn(
        "fixed left-4 bottom-4 z-50",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
        "transition-all duration-300"
      )}
    >
      {href ? (
        <Link href={href} target="_blank" rel="noopener noreferrer">
          {content}
        </Link>
      ) : (
        content
      )}
    </div>
  )
}
