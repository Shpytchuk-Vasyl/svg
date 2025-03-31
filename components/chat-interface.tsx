"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ImagePlus, Send, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useSupabase } from "@/components/supabase-provider"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  type: "system" | "user" | "svg"
  content: string
  svgUrl?: string
}

const STYLES = [
  { value: "FLAT_VECTOR", label: "Flat Vector" },
  { value: "FLAT_VECTOR_OUTLINE", label: "Outline" },
  { value: "FLAT_VECTOR_SILHOUETTE", label: "Silhouette" },
  { value: "FLAT_VECTOR_ONE_LINE_ART", label: "One Line Art" },
  { value: "FLAT_VECTOR_LINE_ART", label: "Line Art" },
]

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "system",
      content: "What would you like to draw today?",
    },
  ])
  const [input, setInput] = useState("")
  const [style, setStyle] = useState("FLAT_VECTOR")
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()
  const { supabase } = useSupabase()

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Update the handleSubmit function to better handle errors
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    const userMessage = {
      id: Date.now().toString(),
      type: "user" as const,
      content: input,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/generate-svg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: input,
          style,
          imageUrl,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate SVG")
      }

      setMessages((prev) => [
        ...prev,
        {
          id: data.id,
          type: "svg",
          content: input,
          svgUrl: data.svgUrl,
        },
      ])

      // Clear the image upload after successful generation
      setImageUrl(null)
    } catch (error) {
      console.error("Error generating SVG:", error)

      // Add an error message to the chat
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          type: "system",
          content: `Error: ${error instanceof Error ? error.message : "Failed to generate SVG. Please try again."}`,
        },
      ])

      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate SVG. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file",
        description: "Please upload an image file",
        variant: "destructive",
      })
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setImageUrl(event.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-180px)]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={cn("flex", message.type === "user" ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "rounded-lg p-3 max-w-[80%]",
                message.type === "user"
                  ? "bg-primary text-primary-foreground"
                  : message.type === "svg"
                    ? "bg-background border"
                    : message.content.startsWith("Error:")
                      ? "bg-destructive/10 text-destructive border border-destructive/20"
                      : "bg-muted",
              )}
            >
              {message.type === "svg" ? (
                <div className="space-y-2">
                  <p className="text-sm">{message.content}</p>
                  <div className="relative aspect-square w-full bg-background/50 rounded overflow-hidden">
                    <img
                      src={message.svgUrl || "/placeholder.svg"}
                      alt={message.content}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>
              ) : (
                <p>{message.content}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t">
        {imageUrl && (
          <div className="mb-2 relative w-16 h-16 rounded overflow-hidden border">
            <img src={imageUrl || "/placeholder.svg"} alt="Upload preview" className="w-full h-full object-cover" />
            <button
              onClick={() => setImageUrl(null)}
              className="absolute top-0 right-0 bg-background/80 p-1 rounded-bl"
            >
              &times;
            </button>
          </div>
        )}

        <div className="flex gap-2 mb-2">
          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select style" />
            </SelectTrigger>
            <SelectContent>
              {STYLES.map((style) => (
                <SelectItem key={style.value} value={style.value}>
                  {style.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button type="button" size="icon" variant="outline" onClick={() => fileInputRef.current?.click()}>
            <ImagePlus className="h-4 w-4" />
          </Button>
          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to draw..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
      </div>
    </div>
  )
}

