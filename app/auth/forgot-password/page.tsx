"use client"

import { useState } from "react"
import { ArrowLeft, BookOpen } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/components/auth-context"

export default function ForgotPasswordPage() {
  const { sendOtp, verifyOtp } = useAuth()
  const [identifier, setIdentifier] = useState("")
  const [code, setCode] = useState("")
  const [step, setStep] = useState<"identifier" | "otp" | "done">("identifier")
  const [loading, setLoading] = useState(false)

  const onSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await sendOtp(identifier)
    setLoading(false)
    setStep("otp")
  }

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const ok = await verifyOtp(code)
    setLoading(false)
    if (ok) setStep("done")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-6">
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm text-muted-foreground">Back to Home</span>
          </Link>

          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">CampusHub</span>
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-2">Forgot password</h1>
          <p className="text-muted-foreground">We use OTP to verify your account for reset.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Password reset via OTP</CardTitle>
            <CardDescription>Enter your email/phone to get a code</CardDescription>
          </CardHeader>
          <CardContent>
            {step === "identifier" && (
              <form onSubmit={onSend} className="space-y-4">
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
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Sending..." : "Send OTP"}
                </Button>
              </form>
            )}
            {step === "otp" && (
              <form onSubmit={onVerify} className="space-y-4">
                <div>
                  <Label htmlFor="code">Enter OTP</Label>
                  <Input
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="6-digit code"
                    inputMode="numeric"
                    pattern="\d{6}"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Verifying..." : "Verify"}
                </Button>
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => setStep("identifier")}
                    className="text-sm text-primary hover:underline"
                  >
                    Use a different email/phone
                  </button>
                </div>
              </form>
            )}
            {step === "done" && (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Verified. As this is a demo, your account is confirmed. You can now sign in.
                </p>
                <Link href="/auth/login">
                  <Button>Go to Sign In</Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
