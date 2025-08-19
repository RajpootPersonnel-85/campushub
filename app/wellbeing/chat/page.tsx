"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ShieldAlert, Send, User } from "lucide-react"

// Very lightweight local chat. For production, replace storage with a realtime backend (e.g., Firebase, Supabase).

type ChatMessage = {
  id: string
  author: "me" | "mentor"
  text: string
  ts: number
}

const STORAGE_KEY = "wellbeing_chat_messages_v1"
const NICK_KEY = "wellbeing_chat_nick"

export default function AnonymousChatPage() {
  const { toast } = useToast()
  const [nick, setNick] = useState<string>("")
  const [nickInput, setNickInput] = useState<string>("")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [text, setText] = useState<string>("")
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const savedNick = localStorage.getItem(NICK_KEY) || "Anon" + Math.floor(Math.random() * 1000)
    setNick(savedNick)
    setNickInput(savedNick)
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setMessages(JSON.parse(raw))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem(NICK_KEY, nick)
  }, [nick])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
    // auto scroll
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" })
  }, [messages])

  const send = () => {
    const content = text.trim()
    if (!content) return
    const now = Date.now()
    setMessages((prev) => [...prev, { id: String(now), author: "me", text: content, ts: now }])
    setText("")
    // Simulate mentor acknowledgment
    setTimeout(() => {
      const reply = `Hi ${nick}, thanks for reaching out. A mentor will respond here. If you are in immediate danger, please contact local emergency services.`
      setMessages((prev) => [...prev, { id: String(Date.now()), author: "mentor", text: reply, ts: Date.now() }])
    }, 600)
  }

  const clearChat = () => {
    setMessages([])
    localStorage.removeItem(STORAGE_KEY)
    toast({ title: "Cleared", description: "Chat history cleared on this device." })
  }

  const headerTS = useMemo(() => new Date().toLocaleString(), [])

  return (
    <div className="min-h-screen bg-background">
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold">Anonymous Chat</h1>
              <p className="text-sm text-muted-foreground mt-1">Session started: {headerTS}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <User className="w-3.5 h-3.5" /> {nick}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => setNick(prompt("Enter display name", nick) || nick)}>
                Edit name
              </Button>
              <Button variant="outline" size="sm" onClick={clearChat}>
                Clear
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldAlert className="w-4 h-4" /> Safety Note
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              This space is supportive but not a substitute for professional care. If you feel unsafe or in immediate
              danger, call local emergency services right away.
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-0">
              <div ref={listRef} className="h-[50vh] overflow-y-auto p-4 space-y-3">
                {messages.map((m) => (
                  <div key={m.id} className={`flex ${m.author === "me" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        m.author === "me" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      <div className="opacity-70 text-[11px] mb-0.5">{m.author === "me" ? nick : "Mentor"}</div>
                      <div>{m.text}</div>
                    </div>
                  </div>
                ))}
                {messages.length === 0 && (
                  <div className="p-4 text-sm text-muted-foreground">No messages yet. Say hi to start the chat.</div>
                )}
              </div>
              <div className="border-t p-3 flex gap-2">
                <Textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Type your message..."
                  rows={2}
                  className="resize-none"
                />
                <Button onClick={send} disabled={!text.trim()}>
                  <Send className="w-4 h-4 mr-1" /> Send
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-xs text-muted-foreground">
            To enable real-time mentor conversations across devices, connect this UI to a backend like Firebase or
            Supabase (anonymous auth + messages collection). This demo stores chat only in your browser.
          </div>
        </div>
      </section>
    </div>
  )
}
