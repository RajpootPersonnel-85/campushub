"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useAuth } from "@/components/auth-context"

export default function AuthDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const { sendOtp, verifyOtp, updateProfile } = useAuth()

  // Unified flow: email/phone -> Get OTP -> show OTP (+ optional name if new)
  const [identifier, setIdentifier] = useState("")
  const [code, setCode] = useState("")
  const [fullName, setFullName] = useState("")
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await sendOtp(identifier)
    setLoading(false)
    setSent(true)
    setError(null)
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const ok = await verifyOtp(code)
    setLoading(false)
    if (ok) {
      // If user provided a name, save it to profile before redirect
      const name = fullName.trim()
      if (name) {
        const [firstName, ...rest] = name.split(" ")
        const lastName = rest.join(" ") || undefined
        updateProfile({ firstName, lastName })
      }
      onOpenChange(false)
      window.location.href = "/"
    }
    else {
      setError("Incorrect OTP. Please try again or resend OTP.")
    }
  }

  const handleResend = async () => {
    if (!identifier) return
    setLoading(true)
    await sendOtp(identifier)
    setLoading(false)
    setCode("")
    setError(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to CampusHub</DialogTitle>
          <DialogDescription>Continue with your email or phone using OTP</DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={sent ? handleVerify : handleSendOtp}>
          <div>
            <Label htmlFor="identifier">Email or phone</Label>
            <Input
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="name@example.com or 9876543210"
              required
            />
          </div>
          {sent && (
            <>
              <div>
                <Label htmlFor="fullName">Full name (only if new user)</Label>
                <Input
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label htmlFor="code">OTP</Label>
                <Input
                  id="code"
                  type="tel"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="6-digit code"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  required
                />
                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                <div className="flex justify-end mt-2">
                  <button
                    type="button"
                    className="text-sm text-primary hover:underline"
                    onClick={handleResend}
                    disabled={loading}
                  >
                    Resend OTP
                  </button>
                </div>
              </div>
            </>
          )}
          <Button type="submit" className="w-full" disabled={loading || (sent && code.length !== 6)}>
            {loading ? (sent ? "Verifying..." : "Sending...") : sent ? "Verify & Continue" : "Get OTP"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
