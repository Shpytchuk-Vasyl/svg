import type { Metadata } from "next"
import { Gallery } from "@/components/gallery"
import { createServerClient } from "@/lib/supabase-server"

export const metadata: Metadata = {
  title: "SVG Generator - Gallery",
  description: "Browse all generated SVG images",
}

export default async function GalleryPage() {
  const supabase = createServerClient()

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
    .order("created_at", { ascending: false })
    .limit(50)

  return (
    <div className="container max-w-md mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-center mb-6">Gallery</h1>
      <Gallery images={images || []} />
    </div>
  )
}

