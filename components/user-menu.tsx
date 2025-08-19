"use client"

import { useState } from "react"
import { User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/components/auth-context"
import AuthDialog from "@/components/auth-dialog"

export default function UserMenu() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const [authOpen, setAuthOpen] = useState(false)

  if (!user) {
    return (
      <>
        <div className="flex items-center space-x-4">
          <Link href="/subscribe">
            <Button
              variant="outline"
              size="sm"
              className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
            >
              Subscribe
            </Button>
          </Link>
          <Button size="sm" onClick={() => setAuthOpen(true)}>Sign in / Sign up</Button>
        </div>
        <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
      </>
    )
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          aria-label="User menu"
          onMouseEnter={() => setOpen(true)}
          onFocus={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onBlur={() => setOpen(false)}
        >
          <User className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-48"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <DropdownMenuItem asChild>
          <Link href="/profile">Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/auth/forgot-password">Forgot password</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => logout()} variant="destructive">
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
