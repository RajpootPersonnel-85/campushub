"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/components/auth-context"
import UserMenu from "@/components/user-menu"
import { BookOpen, Search, Home, Briefcase, Gift } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuth()
  const [showSearch, setShowSearch] = useState(false)
  const [searchText, setSearchText] = useState("")
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    college: "",
    course: "",
    semester: "",
  })
  const [saving, setSaving] = useState(false)
  // Simple in-memory data for subsections
  const [addresses, setAddresses] = useState<string[]>([])
  const [newAddress, setNewAddress] = useState("")
  const [pan, setPan] = useState("")
  const [giftBalance, setGiftBalance] = useState<number>(0)
  const [giftCode, setGiftCode] = useState("")
  const [upiIds, setUpiIds] = useState<string[]>([])
  const [newUpi, setNewUpi] = useState("")
  type CardInfo = { holder: string; last4: string; expiry: string }
  const [cards, setCards] = useState<CardInfo[]>([])
  const [newCard, setNewCard] = useState({ holder: "", number: "", expiry: "" })
  const [coupons] = useState<Array<{ code: string; off: string; status: "active" | "expired" }>>([
    { code: "WELCOME10", off: "10% OFF", status: "active" },
    { code: "STUDENT50", off: "₹50 OFF", status: "expired" },
  ])
  const [reviews] = useState<Array<{ item: string; rating: number; comment: string }>>([
    { item: "Data Structures Notes", rating: 5, comment: "Very helpful and concise." },
    { item: "Operating Systems Book", rating: 4, comment: "Good, minor wear and tear." },
  ])
  const [notifications, setNotifications] = useState<Array<{ id: number; text: string; read: boolean }>>([
    { id: 1, text: "Your order #1234 has shipped.", read: false },
    { id: 2, text: "New notes uploaded for Mathematics.", read: true },
  ])
  const [wishlist, setWishlist] = useState<Array<{ id: number; title: string }>>([
    { id: 1, title: "Introduction to Algorithms" },
    { id: 2, title: "Green Valley PG Room 203" },
  ])
  const [active, setActive] = useState<
    | "orders"
    | "profile"
    | "addresses"
    | "pan"
    | "giftcards"
    | "upi"
    | "cards"
    | "coupons"
    | "reviews"
    | "notifications"
    | "wishlist"
  >("profile")

  useEffect(() => {
    if (user?.profile) {
      setForm({
        firstName: user.profile.firstName ?? "",
        lastName: user.profile.lastName ?? "",
        college: user.profile.college ?? "",
        course: user.profile.course ?? "",
        semester: user.profile.semester ?? "",
      })
    }
  }, [user])

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    updateProfile(form)
    setTimeout(() => setSaving(false), 400)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar (same style as home) */}
      <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">CampusHub</span>
            </Link>
            {/* Main Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/notes"
                className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Notes</span>
              </Link>
              <Link
                href="/books"
                className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                <span>Used Books</span>
              </Link>
              <Link
                href="/hostels"
                className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors"
              >
                <Home className="w-4 h-4" />
                <span>PG/Hostels</span>
              </Link>
              <Link
                href="/jobs"
                className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors"
              >
                <Briefcase className="w-4 h-4" />
                <span>Jobs</span>
                <Badge variant="secondary" className="text-xs">Phase 2</Badge>
              </Link>
              <a
                href="#deals"
                className="flex items-center space-x-1 text-muted-foreground hover:text-primary transition-colors"
              >
                <Gift className="w-4 h-4" />
                <span>Student Deals</span>
                <Badge variant="secondary" className="text-xs">Phase 2</Badge>
              </a>
            </div>
            {/* Right Side */}
            <div className="flex items-center space-x-4">
              {showSearch && (
                <Input
                  className="w-40 sm:w-56 md:w-64 transition-all"
                  placeholder="Search..."
                  autoFocus
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Escape") setShowSearch(false) }}
                />
              )}
              <Button variant="ghost" size="sm" onClick={() => setShowSearch((v) => !v)} aria-label="Toggle search">
                <Search className="w-4 h-4" />
              </Button>
              {user && (
                <Button asChild size="sm"><Link href="/subscribe">Subscribe</Link></Button>
              )}
              <UserMenu />
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        {/* Sidebar */}
        <aside className="space-y-4">
          <section>
            <h3 className="text-sm font-semibold text-muted-foreground mb-2">MY ORDERS</h3>
            <div className="grid">
              <Button variant={active === "orders" ? "default" : "outline"} className="justify-start" onClick={() => setActive("orders")}>Orders</Button>
            </div>
          </section>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="account">
              <AccordionTrigger className="text-sm font-semibold">ACCOUNT SETTINGS</AccordionTrigger>
              <AccordionContent className="transition-all data-[state=open]:animate-in data-[state=closed]:animate-out">
                <div className="grid gap-2 pt-2">
                  <Button variant={active === "profile" ? "default" : "outline"} className="justify-start" onClick={() => setActive("profile")}>Profile Information</Button>
                  <Button variant={active === "addresses" ? "default" : "outline"} className="justify-start" onClick={() => setActive("addresses")}>Manage Addresses</Button>
                  <Button variant={active === "pan" ? "default" : "outline"} className="justify-start" onClick={() => setActive("pan")}>PAN Card Information</Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="payments">
              <AccordionTrigger className="text-sm font-semibold">PAYMENTS</AccordionTrigger>
              <AccordionContent className="transition-all data-[state=open]:animate-in data-[state=closed]:animate-out">
                <div className="grid gap-2 pt-2">
                  <Button variant={active === "giftcards" ? "default" : "outline"} className="justify-between" onClick={() => setActive("giftcards")}><span>Gift Cards</span><span className="text-muted-foreground">₹0</span></Button>
                  <Button variant={active === "upi" ? "default" : "outline"} className="justify-start" onClick={() => setActive("upi")}>Saved UPI</Button>
                  <Button variant={active === "cards" ? "default" : "outline"} className="justify-start" onClick={() => setActive("cards")}>Saved Cards</Button>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="stuff">
              <AccordionTrigger className="text-sm font-semibold">MY STUFF</AccordionTrigger>
              <AccordionContent className="transition-all data-[state=open]:animate-in data-[state=closed]:animate-out">
                <div className="grid gap-2 pt-2">
                  <Button variant={active === "coupons" ? "default" : "outline"} className="justify-start" onClick={() => setActive("coupons")}>My Coupons</Button>
                  <Button variant={active === "reviews" ? "default" : "outline"} className="justify-start" onClick={() => setActive("reviews")}>My Reviews & Ratings</Button>
                  <Button variant={active === "notifications" ? "default" : "outline"} className="justify-start" onClick={() => setActive("notifications")}>All Notifications</Button>
                  <Button variant={active === "wishlist" ? "default" : "outline"} className="justify-start" onClick={() => setActive("wishlist")}>My Wishlist</Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <section>
            <div className="grid">
              <Button variant="destructive" className="justify-start" onClick={() => { logout(); window.location.href = "/" }}>Logout</Button>
            </div>
          </section>
        </aside>

        {/* Main content */}
        <main>
          {active === "profile" && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your account information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      value={form.firstName}
                      onChange={(e) => setForm((s) => ({ ...s, firstName: e.target.value }))}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      value={form.lastName}
                      onChange={(e) => setForm((s) => ({ ...s, lastName: e.target.value }))}
                      placeholder="Doe"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="college">College / University</Label>
                    <Input
                      id="college"
                      value={form.college}
                      onChange={(e) => setForm((s) => ({ ...s, college: e.target.value }))}
                      placeholder="Your college"
                    />
                  </div>
                  <div>
                    <Label htmlFor="course">Course</Label>
                    <Input
                      id="course"
                      value={form.course}
                      onChange={(e) => setForm((s) => ({ ...s, course: e.target.value }))}
                      placeholder="B.Tech CSE"
                    />
                  </div>
                  <div>
                    <Label htmlFor="semester">Semester</Label>
                    <Input
                      id="semester"
                      value={form.semester}
                      onChange={(e) => setForm((s) => ({ ...s, semester: e.target.value }))}
                      placeholder="5th"
                    />
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}
          {active === "addresses" && (
            <Card>
              <CardHeader>
                <CardTitle>Manage Addresses</CardTitle>
                <CardDescription>Add or remove your delivery addresses</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="newAddress">New Address</Label>
                  <Input id="newAddress" placeholder="Address line" value={newAddress} onChange={(e) => setNewAddress(e.target.value)} />
                  <div className="flex justify-end">
                    <Button
                      onClick={() => {
                        if (newAddress.trim()) {
                          setAddresses((a) => [newAddress.trim(), ...a])
                          setNewAddress("")
                        }
                      }}
                    >Add Address</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  {addresses.length === 0 && (
                    <p className="text-sm text-muted-foreground">No addresses added yet.</p>
                  )}
                  {addresses.map((addr, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-md border p-3">
                      <span className="text-sm">{addr}</span>
                      <Button variant="outline" size="sm" onClick={() => setAddresses((a) => a.filter((_, i) => i !== idx))}>Remove</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {active === "pan" && (
            <Card>
              <CardHeader>
                <CardTitle>PAN Card Information</CardTitle>
                <CardDescription>Link your PAN for verification</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div>
                  <Label htmlFor="pan">PAN Number</Label>
                  <Input id="pan" value={pan} onChange={(e) => setPan(e.target.value.toUpperCase())} placeholder="ABCDE1234F" maxLength={10} />
                  <p className="text-xs text-muted-foreground mt-1">Format: 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)</p>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => alert(pan.length === 10 ? "PAN saved (mock)." : "Invalid PAN format.")}>Save PAN</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {active === "giftcards" && (
            <Card>
              <CardHeader>
                <CardTitle>Gift Cards</CardTitle>
                <CardDescription>Balance and redemption</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-md border p-3">
                  <span className="text-sm">Current Balance</span>
                  <span className="font-semibold">₹{giftBalance}</span>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="giftCode">Redeem Code</Label>
                  <Input id="giftCode" placeholder="Enter gift card code" value={giftCode} onChange={(e) => setGiftCode(e.target.value)} />
                  <div className="flex justify-end">
                    <Button
                      onClick={() => {
                        if (giftCode.trim()) {
                          setGiftBalance((b) => b + 100) // mock add
                          setGiftCode("")
                        }
                      }}
                    >Redeem</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {active === "upi" && (
            <Card>
              <CardHeader>
                <CardTitle>Saved UPI</CardTitle>
                <CardDescription>Manage your UPI IDs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="newUpi">Add UPI ID</Label>
                  <Input id="newUpi" placeholder="username@bank" value={newUpi} onChange={(e) => setNewUpi(e.target.value)} />
                  <div className="flex justify-end">
                    <Button onClick={() => { if (newUpi.trim()) { setUpiIds((u) => [newUpi.trim(), ...u]); setNewUpi("") } }}>Add</Button>
                  </div>
                </div>
                <div className="space-y-2">
                  {upiIds.length === 0 && <p className="text-sm text-muted-foreground">No UPI IDs saved.</p>}
                  {upiIds.map((id, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-md border p-3">
                      <span className="text-sm">{id}</span>
                      <Button variant="outline" size="sm" onClick={() => setUpiIds((u) => u.filter((_, i) => i !== idx))}>Remove</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {active === "cards" && (
            <Card>
              <CardHeader>
                <CardTitle>Saved Cards</CardTitle>
                <CardDescription>Manage your cards</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-1">
                    <Label>Cardholder Name</Label>
                    <Input value={newCard.holder} onChange={(e) => setNewCard((c) => ({ ...c, holder: e.target.value }))} placeholder="John Doe" />
                  </div>
                  <div className="md:col-span-1">
                    <Label>Card Number</Label>
                    <Input value={newCard.number} onChange={(e) => setNewCard((c) => ({ ...c, number: e.target.value.replace(/[^0-9]/g, "").slice(0,16) }))} placeholder="4111111111111111" />
                  </div>
                  <div className="md:col-span-1">
                    <Label>Expiry</Label>
                    <Input value={newCard.expiry} onChange={(e) => setNewCard((c) => ({ ...c, expiry: e.target.value }))} placeholder="MM/YY" />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => {
                    if (newCard.holder && newCard.number.length >= 12 && newCard.expiry) {
                      const last4 = newCard.number.slice(-4)
                      setCards((list) => [{ holder: newCard.holder, last4, expiry: newCard.expiry }, ...list])
                      setNewCard({ holder: "", number: "", expiry: "" })
                    }
                  }}>Add Card</Button>
                </div>
                <div className="space-y-2">
                  {cards.length === 0 && <p className="text-sm text-muted-foreground">No cards saved.</p>}
                  {cards.map((c, idx) => (
                    <div key={idx} className="flex items-center justify-between rounded-md border p-3">
                      <div className="text-sm">
                        <div className="font-medium">{c.holder}</div>
                        <div className="text-muted-foreground">•••• •••• •••• {c.last4} · Exp {c.expiry}</div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setCards((list) => list.filter((_, i) => i !== idx))}>Remove</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {active === "coupons" && (
            <Card>
              <CardHeader>
                <CardTitle>My Coupons</CardTitle>
                <CardDescription>Available and expired coupons</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                {coupons.map((c, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-md border p-3">
                    <div className="text-sm">
                      <div className="font-medium">{c.code}</div>
                      <div className="text-muted-foreground">{c.off}</div>
                    </div>
                    <Badge variant={c.status === "active" ? "default" : "secondary"}>{c.status}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {active === "reviews" && (
            <Card>
              <CardHeader>
                <CardTitle>My Reviews & Ratings</CardTitle>
                <CardDescription>Your recent feedback</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                {reviews.map((r, idx) => (
                  <div key={idx} className="rounded-md border p-3">
                    <div className="flex items-center justify-between">
                      <div className="font-medium text-sm">{r.item}</div>
                      <div className="text-primary text-sm font-semibold">{r.rating}★</div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{r.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {active === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>All Notifications</CardTitle>
                <CardDescription>Updates about your activity</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-2">
                {notifications.map((n) => (
                  <div key={n.id} className="flex items-center justify-between rounded-md border p-3">
                    <span className={`text-sm ${n.read ? "text-muted-foreground" : ""}`}>{n.text}</span>
                    <Button size="sm" variant="outline" onClick={() => setNotifications((list) => list.map((x) => x.id === n.id ? { ...x, read: !x.read } : x))}>
                      {n.read ? "Mark Unread" : "Mark Read"}
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {active === "wishlist" && (
            <Card>
              <CardHeader>
                <CardTitle>My Wishlist</CardTitle>
                <CardDescription>Items you saved for later</CardDescription>
              </CardHeader>
              <CardContent>
                {wishlist.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Your wishlist is empty.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {wishlist.map((w) => (
                      <div key={w.id} className="flex items-center justify-between rounded-md border p-3">
                        <span className="text-sm">{w.title}</span>
                        <Button size="sm" variant="outline" onClick={() => setWishlist((list) => list.filter((x) => x.id !== w.id))}>Remove</Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {active === "orders" && (
            <Card>
              <CardHeader>
                <CardTitle>My Orders</CardTitle>
                <CardDescription>Recent orders summary</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">No orders yet.</p>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  )
}
