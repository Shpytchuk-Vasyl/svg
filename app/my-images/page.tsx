import type { Metadata } from "next"
import { Gallery } from "@/components/gallery"
import { createServerClient } from "@/lib/supabase-server"
import { AuthCheck } from "@/components/auth-check"

export const metadata: Metadata = {
  title: "SVG Generator - My Images",
  description: "Browse your generated SVG images",
}

export default async function MyImagesPage() {
  const supabase = createServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return <AuthCheck />
  }

  const { data: images } = await supabase
    .from("generated_images")
    .select(`
      id,
      svg_url,
      created_at,
      prompts (
        id,
        prompt_text,
        style,
        user_id
      )
    `)
    .eq("prompts.user_id", session.user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-6">My Images</h1>
      <Gallery images={images || []} />
    </div>
  )
}

