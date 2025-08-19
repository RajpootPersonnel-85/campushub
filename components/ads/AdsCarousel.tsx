"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react"

export type AdFormat = "leaderboard" | "rectangle" | "hero"

export interface AdSlide {
  id: string
  href?: string
  img?: string // optional image url
  bg?: string // fallback background
  text?: string // fallback text
  video?: string // optional video url
  poster?: string // optional poster for video
  format: AdFormat
}

export default function AdsCarousel({
  slides,
  intervalMs = 4000,
  className,
  showDots = true,
  pauseOnHover = true,
}: {
  slides: AdSlide[]
  intervalMs?: number
  className?: string
  showDots?: boolean
  pauseOnHover?: boolean
}) {
  const [idx, setIdx] = useState(0)
  const [hover, setHover] = useState(false)
  const [paused, setPaused] = useState(false)
  const timer = useRef<number | null>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const touchStartX = useRef<number | null>(null)
  const touchDeltaX = useRef<number>(0)

  const dims = useMemo(() => {
    // Use current slide format to size the viewport
    const s = slides[idx]
    switch (s.format) {
      case "leaderboard":
        return "h-[90px] w-full max-w-[970px]"
      case "rectangle":
        return "h-[250px] w-[300px] sm:h-[280px] sm:w-[336px]"
      case "hero":
      default:
        return "w-full max-w-6xl h-[180px] sm:h-[240px] md:h-[300px]"
    }
  }, [slides, idx])

  useEffect(() => {
    // Respect reduced motion preference: start paused
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setPaused(true)
      }
    } catch {}
  }, [])

  useEffect(() => {
    if ((hover && pauseOnHover) || paused) {
      if (timer.current) window.clearInterval(timer.current)
      return
    }
    timer.current && window.clearInterval(timer.current)
    timer.current = window.setInterval(() => {
      setIdx((i) => (i + 1) % slides.length)
    }, intervalMs) as any
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [slides.length, intervalMs, hover, pauseOnHover, paused])

  // Ensure only the active video's playback is running
  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return
      if (i === idx && !paused) {
        try { v.play().catch(() => {}) } catch {}
      } else {
        try { v.pause() } catch {}
      }
    })
  }, [idx, paused])

  const goPrev = () => setIdx((i) => (i - 1 + slides.length) % slides.length)
  const goNext = () => setIdx((i) => (i + 1) % slides.length)

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchDeltaX.current = 0
    setHover(true)
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current
  }
  const onTouchEnd = () => {
    setHover(false)
    const threshold = 50
    if (Math.abs(touchDeltaX.current) > threshold) {
      if (touchDeltaX.current > 0) goPrev()
      else goNext()
    }
    touchStartX.current = null
    touchDeltaX.current = 0
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault(); goPrev()
    } else if (e.key === "ArrowRight") {
      e.preventDefault(); goNext()
    } else if (e.key === " " || e.key === "Spacebar" || e.key === "Enter") {
      e.preventDefault(); setPaused((p) => !p)
    }
  }

  return (
    <div className={cn("w-full flex flex-col items-center", className)}>
      <div
        className={cn("group rounded-2xl overflow-hidden shadow-sm border border-border mx-auto relative", dims)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        tabIndex={0}
        onKeyDown={onKeyDown}
        role="region"
        aria-label="Ads Carousel"
      >
        {/* Track */}
        <div
          className="absolute inset-0 flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${idx * 100}%)`, width: `${slides.length * 100}%` }}
        >
          {slides.map((s, i) => (
            <div key={s.id} className="w-full shrink-0 h-full">
              {s.href ? (
                <Link href={s.href} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                  {s.video ? (
                    <video
                      ref={(el) => {
                        if (el) videoRefs.current[i] = el
                      }}
                      src={s.video}
                      poster={s.poster}
                      muted
                      playsInline
                      loop
                      preload="metadata"
                      className="w-full h-full object-cover"
                    />
                  ) : s.img ? (
                    <Image src={s.img} alt="ad" fill sizes="100vw" className="object-cover" priority={i === 0} />
                  ) : (
                    <div
                      className={cn(
                        "w-full h-full flex items-center",
                        s.format === "leaderboard" ? "px-6" : "px-3 justify-center"
                      )}
                      style={{ background: s.bg || "linear-gradient(90deg,#0a1428,#1c2540,#0a1428)" }}
                    >
                      <span className="text-amber-300 font-semibold text-sm sm:text-base">{s.text || "Sponsored"}</span>
                    </div>
                  )}
                </Link>
              ) : s.video ? (
                <video
                  ref={(el) => {
                    videoRefs.current[i] = el
                  }}
                  src={s.video}
                  poster={s.poster}
                  muted
                  playsInline
                  loop
                  preload="metadata"
                  className="w-full h-full object-cover"
                />
              ) : s.img ? (
                <Image src={s.img} alt={s.text || "ad"} fill sizes="100vw" className="object-cover" />
              ) : (
                <div
                  className={cn(
                    "w-full h-full flex items-center",
                    s.format === "leaderboard" ? "px-6" : "px-3 justify-center"
                  )}
                  style={{ background: s.bg || "linear-gradient(90deg,#0a1428,#1c2540,#0a1428)" }}
                >
                  <span className="text-amber-300 font-semibold text-sm sm:text-base">{s.text || "Sponsored"}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Prev / Next arrows */}
        <button
          aria-label="Previous ad"
          onClick={goPrev}
          className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/70 hover:bg-background shadow flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          aria-label="Next ad"
          onClick={goNext}
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/70 hover:bg-background shadow flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Pause/Play control */}
        <button
          aria-label={paused ? "Play" : "Pause"}
          onClick={() => setPaused((p) => !p)}
          className="absolute right-2 bottom-2 h-8 w-8 rounded-full bg-background/70 hover:bg-background shadow flex items-center justify-center opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
        >
          {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </button>
      </div>

      {showDots && (
        <div className="mt-2 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to ad ${i + 1}`}
              onClick={() => setIdx(i)}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                i === idx ? "bg-foreground" : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
