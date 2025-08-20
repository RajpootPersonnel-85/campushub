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
  // Build extended slides for seamless loop
  const extendedSlides = useMemo(() => {
    if (slides.length > 1) {
      const first = slides[0]
      const last = slides[slides.length - 1]
      return [last, ...slides, first]
    }
    return slides
  }, [slides])

  // Current index within extendedSlides (start at 1 to show first real slide)
  const [idx, setIdx] = useState(() => (slides.length > 1 ? 1 : 0))
  const [withTransition, setWithTransition] = useState(true)
  const [hover, setHover] = useState(false)
  const [paused, setPaused] = useState(false)
  const timer = useRef<number | null>(null)
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([])
  const touchStartX = useRef<number | null>(null)
  const touchDeltaX = useRef<number>(0)

  const dims = useMemo(() => {
    // Use current extended slide format to size the viewport
    const s = (extendedSlides[idx]) ?? slides[0]
    switch (s.format) {
      case "leaderboard":
        return "h-[90px] w-full max-w-[970px]"
      case "rectangle":
        return "h-[250px] w-[300px] sm:h-[280px] sm:w-[336px]"
      case "hero":
      default:
        return "w-full max-w-6xl h-[180px] sm:h-[240px] md:h-[300px]"
    }
  }, [extendedSlides, slides, idx])

  // Respect reduced motion preference
  useEffect(() => {
    // Respect reduced motion preference: start paused
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setPaused(true)
      }
    } catch {}
  }, [])

  // Auto-play advancing
  useEffect(() => {
    if (slides.length <= 1) return
    if ((hover && pauseOnHover) || paused) {
      if (timer.current) window.clearInterval(timer.current)
      return
    }
    timer.current && window.clearInterval(timer.current)
    timer.current = window.setInterval(() => {
      setIdx((i) => i + 1)
    }, intervalMs) as any
    return () => {
      if (timer.current) window.clearInterval(timer.current)
    }
  }, [slides.length, intervalMs, hover, pauseOnHover, paused])

  // Ensure only the active video's playback is running
  const hasVideo = useMemo(() => extendedSlides.some((s) => !!s.video), [extendedSlides])
  useEffect(() => {
    if (!hasVideo) return
    videoRefs.current.forEach((v, i) => {
      if (!v) return
      if (i === idx && !paused) {
        try { v.play().catch(() => {}) } catch {}
      } else {
        try { v.pause() } catch {}
      }
    })
  }, [idx, paused, hasVideo])

  const goPrev = () => { if (slides.length > 1) setIdx((i) => i - 1) }
  const goNext = () => { if (slides.length > 1) setIdx((i) => i + 1) }

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

  // Snap without transition when we hit the cloned edges
  useEffect(() => {
    if (slides.length <= 1) return
    if (!withTransition) return
    const lastIndex = extendedSlides.length - 1 // last is cloned first
    if (idx === 0) {
      // moved to cloned last; snap to real last
      setTimeout(() => {
        setWithTransition(false)
        setIdx(extendedSlides.length - 2)
        // re-enable transition on next frame
        requestAnimationFrame(() => setWithTransition(true))
      }, 0)
    } else if (idx === lastIndex) {
      // moved to cloned first; snap to real first (index 1)
      setTimeout(() => {
        setWithTransition(false)
        setIdx(1)
        requestAnimationFrame(() => setWithTransition(true))
      }, 0)
    }
  }, [idx, extendedSlides.length, slides.length, withTransition])

  // Reset index when slides change
  useEffect(() => {
    setWithTransition(false)
    setIdx(slides.length > 1 ? 1 : 0)
    requestAnimationFrame(() => setWithTransition(true))
  }, [slides.length])

  // Map extended index to real dot index
  const realIdx = slides.length > 1 ? ((idx - 1 + slides.length) % slides.length) : 0

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
          className={cn("absolute inset-0 flex", withTransition ? "transition-transform duration-500 ease-out" : "")}
          style={{ transform: `translateX(-${idx * 100}%)`, width: `${extendedSlides.length * 100}%`, willChange: "transform" }}
        >
          {extendedSlides.map((s, i) => {
            const isCloneStart = i === 0 && slides.length > 1 // cloned last at start
            const isCloneEnd = i === extendedSlides.length - 1 && slides.length > 1 // cloned first at end
            const key = isCloneStart ? `${s.id}__clone-start` : isCloneEnd ? `${s.id}__clone-end` : s.id
            return (
            <div key={key} className="w-full shrink-0 h-full">
              {s.href ? (
                <Link href={s.href} aria-label={s.text || "carousel slide"} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
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
                    <Image
                      src={s.img}
                      alt={s.text || "slide"}
                      fill
                      sizes="100vw"
                      className="object-cover"
                      priority={slides.length > 1 ? i === 1 : i === 0}
                      fetchPriority={(slides.length > 1 ? i === 1 : i === 0) ? "high" : undefined}
                      loading={(slides.length > 1 ? i === 1 : i === 0) ? undefined : "lazy"}
                      decoding="async"
                    />
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
                <Image
                  src={s.img}
                  alt={s.text || "ad"}
                  fill
                  sizes="100vw"
                  className="object-cover"
                  loading="lazy"
                  decoding="async"
                />
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
            )
          })}
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

      {showDots && slides.length > 0 && (
        <div className="mt-2 flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to ad ${i + 1}`}
              onClick={() => setIdx(slides.length > 1 ? i + 1 : 0)}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                i === realIdx ? "bg-foreground" : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}
