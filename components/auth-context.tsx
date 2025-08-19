"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

export type MinimalUser = {
  id: string
  email?: string
  phone?: string
  profile?: {
    firstName?: string
    lastName?: string
    college?: string
    course?: string
    semester?: string
  }
}

type AuthContextType = {
  user: MinimalUser | null
  loading: boolean
  sendOtp: (identifier: string) => Promise<void>
  verifyOtp: (code: string) => Promise<boolean>
  loginWithIdentifier: (identifier: string) => Promise<void>
  logout: () => void
  updateProfile: (data: MinimalUser["profile"]) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = "campushub_auth_user"
const OTP_KEY = "campushub_auth_otp"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MinimalUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null
    if (raw) {
      try {
        setUser(JSON.parse(raw))
      } catch {}
    }
    setLoading(false)
  }, [])

  const sendOtp = useCallback(async (identifier: string) => {
    // Mock: generate 6-digit code and store temporarily
    const code = String(Math.floor(100000 + Math.random() * 900000))
    if (typeof window !== "undefined") {
      localStorage.setItem(OTP_KEY, JSON.stringify({ code, identifier, ts: Date.now() }))
    }
    console.log("Mock OTP (dev only):", code)
  }, [])

  const verifyOtp = useCallback(async (code: string) => {
    const raw = typeof window !== "undefined" ? localStorage.getItem(OTP_KEY) : null
    if (!raw) return false
    try {
      const data = JSON.parse(raw) as { code: string; identifier: string; ts: number }
      const ok = data.code === code
      if (ok) {
        // Create user record if not exists
        const existing = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null
        let u: MinimalUser | null = existing ? JSON.parse(existing) : null
        if (!u) {
          const isEmail = data.identifier.includes("@");
          u = {
            id: crypto.randomUUID(),
            email: isEmail ? data.identifier : undefined,
            phone: !isEmail ? data.identifier : undefined,
          }
        }
        setUser(u)
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
          localStorage.removeItem(OTP_KEY)
        }
      }
      return ok
    } catch {
      return false
    }
  }, [])

  const loginWithIdentifier = useCallback(async (identifier: string) => {
    const isEmail = identifier.includes("@");
    const u: MinimalUser = {
      id: crypto.randomUUID(),
      email: isEmail ? identifier : undefined,
      phone: !isEmail ? identifier : undefined,
    }
    setUser(u)
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(u))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    if (typeof window !== "undefined") localStorage.removeItem(STORAGE_KEY)
  }, [])

  const updateProfile = useCallback((data: MinimalUser["profile"]) => {
    setUser((prev) => {
      if (!prev) return prev
      const next = { ...prev, profile: { ...prev.profile, ...data } }
      if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ user, loading, sendOtp, verifyOtp, loginWithIdentifier, logout, updateProfile }),
    [user, loading, sendOtp, verifyOtp, loginWithIdentifier, logout, updateProfile]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
