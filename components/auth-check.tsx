"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useSupabase } from "@/components/supabase-provider"

export function AuthCheck() {
  const { supabase } = useSupabase()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    setIsLoading(true)

    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/my-images`,
        },
      })
    } catch (error) {
      console.error("Error signing in:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <h2 className="text-xl font-semibold mb-4">Sign in to view your images</h2>
      <p className="text-muted-foreground mb-6">You need to be signed in to view your personal gallery</p>
      <Button onClick={handleLogin} disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign in with Google"}
      </Button>
    </div>
  )
}

