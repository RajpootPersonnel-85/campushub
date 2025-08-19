"use client"

import type React from "react"

import { useState } from "react"
import { ArrowLeft, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useAuth } from "@/components/auth-context"

export default function SignupPage() {
  const { sendOtp, verifyOtp } = useAuth()
  const [identifier, setIdentifier] = useState("")
  const [code, setCode] = useState("")
  const [step, setStep] = useState<"identifier" | "otp">("identifier")
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreeTerms) return
    setIsLoading(true)
    await sendOtp(identifier)
    setIsLoading(false)
    setStep("otp")
  }

  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    const ok = await verifyOtp(code)
    setIsLoading(false)
    if (ok) {
      window.location.href = "/profile"
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
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

          <h1 className="text-2xl font-bold text-foreground mb-2">Join CampusHub</h1>
          <p className="text-muted-foreground">Create your account to get started</p>
        </div>

        {/* Minimal OTP Signup */}
        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Sign up with email or phone. We'll send you an OTP.</CardDescription>
          </CardHeader>
          <CardContent>
            {step === "identifier" ? (
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
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={agreeTerms}
                    onCheckedChange={(checked) => setAgreeTerms(checked as boolean)}
                  />
                  <Label htmlFor="terms" className="text-sm leading-relaxed">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      Privacy Policy
                    </Link>
                  </Label>
                </div>
                <Button type="submit" className="w-full" disabled={!agreeTerms || isLoading}>
                  {isLoading ? "Sending OTP..." : "Send OTP"}
                </Button>
              </form>
            ) : (
              <form onSubmit={onVerify} className="space-y-4">
                <div>
                  <Label htmlFor="code">Enter OTP</Label>
                  <Input
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="6-digit code"
                    inputMode="numeric"
                    pattern="\\d{6}"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify & Create Account"}
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

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
