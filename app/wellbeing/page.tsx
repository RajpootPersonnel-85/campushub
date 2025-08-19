"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { HeartHandshake, MessageSquare, Stethoscope } from "lucide-react"

export default function WellbeingHubPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Mental Health & Counseling</h1>
            <p className="text-muted-foreground mt-2">
              Your wellbeing matters. Connect anonymously with mentors/seniors or request a session with partnered
              counselors.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" /> Anonymous Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Start a free anonymous chat with a mentor/senior. No signup required. For emergencies, contact local
                  authorities or professional helplines.
                </p>
                <Button asChild>
                  <Link href="/wellbeing/chat">Start Anonymous Chat</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5" /> Book Counseling
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Prefer a professional? Request a session with a partnered psychologist. We respect your privacy.
                </p>
                <Button asChild variant="outline">
                  <Link href="/wellbeing/counseling">Request Counseling</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5" /> Important
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 text-sm text-muted-foreground space-y-1">
                <li>This feature is supportive and not a substitute for medical advice.</li>
                <li>If you feel unsafe or in immediate danger, call local emergency services immediately.</li>
                <li>Your chats are anonymous on this device; do not share personal identifiers if you wish to remain anonymous.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
