export type AdFormat = "leaderboard" | "rectangle" | "hero"

export interface AdRecord {
  id: string
  format: AdFormat
  href?: string
  img?: string
  bg?: string
  text?: string
  video?: string
  poster?: string
  active?: boolean
  position?: string // e.g., home_hero_top, home_hero_mid, sidebar_rect
  order?: number
}

let ads: AdRecord[] = [
  { id: "home_h1", format: "hero", img: "/abstract-geometric-shapes.png", href: "/resources", text: "Discover Resources", position: "home_hero_top", order: 1, active: true },
  { id: "home_h2", format: "hero", img: "/algorithms-textbook.png", href: "/exams", text: "Crack Exams", position: "home_hero_top", order: 2, active: true },
  { id: "home_h3", format: "hero", img: "/calculus-textbook.png", href: "/resources", text: "Study Smarter", position: "home_hero_top", order: 3, active: true },
  { id: "home_h4", format: "hero", img: "/algorithms-textbook-pages.png", href: "/schemes", text: "Explore Schemes", position: "home_hero_top", order: 4, active: true },
  { id: "home_h5", format: "hero", img: "/abstract-geometric-shapes.png", href: "#deals", text: "Deals for Students", position: "home_hero_mid", order: 1, active: true },
  { id: "home_h6", format: "hero", img: "/algorithms-textbook-pages.png", href: "/hostels/list", text: "Find Hostels", position: "home_hero_mid", order: 2, active: true },
  { id: "home_h7", format: "hero", img: "/student-avatar.png", href: "/notes/upload", text: "Upload Notes", position: "home_hero_mid", order: 3, active: true },
]

export function getAds() { return ads.slice() }
export function getAdsByPosition(position: string) {
  return ads.filter(a => (a.active ?? true) && a.position === position).sort((a,b) => (a.order ?? 0) - (b.order ?? 0))
}
export function getAd(id: string) { return ads.find(a => a.id === id) || null }
export function createAd(a: AdRecord) { ads = [a, ...ads]; return a }
export function updateAd(id: string, patch: Partial<AdRecord>) {
  ads = ads.map(a => a.id === id ? { ...a, ...patch, id: a.id } : a)
  return getAd(id)
}
export function deleteAd(id: string) { const before = ads.length; ads = ads.filter(a => a.id !== id); return ads.length < before }
