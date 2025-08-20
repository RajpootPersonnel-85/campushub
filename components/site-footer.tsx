import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen } from "lucide-react"

export default function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="mt-10 border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-flex w-8 h-8 bg-primary rounded-lg items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary-foreground" />
              </span>
              <span className="text-xl font-bold">CampusHub</span>
            </div>
            <p className="text-muted-foreground mb-4 max-w-md">
              Your ultimate student platform for notes, books, hostels, and community connections.
            </p>
            <div className="flex gap-4">
              <Button variant="ghost" size="sm" asChild>
                <a href="#" aria-label="Instagram">Instagram</a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="#" aria-label="WhatsApp">WhatsApp</a>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <a href="#" aria-label="LinkedIn">LinkedIn</a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2 text-sm">
              <Link href="/about" className="block text-muted-foreground hover:text-foreground">About</Link>
              <Link href="/contact" className="block text-muted-foreground hover:text-foreground">Contact</Link>
              <Link href="/careers/compare" className="block text-muted-foreground hover:text-foreground">Careers</Link>
              <Link href="/ambassador" className="block text-muted-foreground hover:text-foreground">Ambassador Program</Link>
              <Link href="/support" className="block text-muted-foreground hover:text-foreground">Leads / Talk to Us</Link>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-4">Stay Updated</h3>
            <p className="text-muted-foreground text-sm mb-4">Get student deals weekly</p>
            <div className="flex gap-2">
              <Input placeholder="Your email" className="flex-1" />
              <Button size="sm">Subscribe</Button>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {year} CampusHub. All rights reserved.</p>
          <div className="mt-3 flex items-center justify-center gap-4">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/support" className="hover:text-foreground">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
