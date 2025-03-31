import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

const API_KEY = process.env.SVGIO_API_KEY

export async function POST(request: Request) {
  try {
    const { prompt, style, imageUrl } = await request.json()
    const supabase = createServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // For development/testing: if no API key or we want to bypass the actual API call
    // Generate a mock response instead of calling the real API
    if (!API_KEY || process.env.NODE_ENV === "development") {
      console.log("Using mock SVG generation (no API key or in development mode)")

      // Create a unique ID for this generation
      const mockId = crypto.randomUUID()

      // Save to database
      const { data: promptData, error: promptError } = await supabase
        .from("prompts")
        .insert({
          user_id: session?.user?.id || null,
          prompt_text: prompt,
          image_url: imageUrl || null,
          style: style || "FLAT_VECTOR",
          response_id: mockId,
        })
        .select()
        .single()

      if (promptError) {
        console.error("Error saving prompt:", promptError)
        return NextResponse.json({ error: "Failed to save prompt" }, { status: 500 })
      }

      // Generate a placeholder SVG URL based on the prompt
      const placeholderSvgUrl = `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(prompt.substring(0, 20))}`

      const { data: imageData, error: imageError } = await supabase
        .from("generated_images")
        .insert({
          prompt_id: promptData.id,
          svg_url: placeholderSvgUrl,
        })
        .select()
        .single()

      if (imageError) {
        console.error("Error saving image:", imageError)
        return NextResponse.json({ error: "Failed to save image" }, { status: 500 })
      }

      return NextResponse.json({
        id: mockId,
        svgUrl: placeholderSvgUrl,
        promptId: promptData.id,
        imageId: imageData.id,
      })
    }

    // If we have an API key and are not in development mode, call the real API
    console.log("Calling SVG.io API with key:", API_KEY.substring(0, 5) + "...")

    try {
      const response = await fetch("https://api.svg.io/v1/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          prompt,
          negativePrompt: "",
          style: style || "FLAT_VECTOR",
          initialImage: imageUrl || null,
          initialImageType: imageUrl ? "PNG" : null,
        }),
      })

      const result = await response.json()
      console.log("API response:", JSON.stringify(result).substring(0, 200) + "...")

      if (!result.success) {
        console.error("API error:", result)
        return NextResponse.json(
          { error: "API returned an error: " + (result.message || "Unknown error") },
          { status: 400 },
        )
      }

      const generatedImage = result.data[0]

      // Save to database
      const { data: promptData, error: promptError } = await supabase
        .from("prompts")
        .insert({
          user_id: session?.user?.id || null,
          prompt_text: prompt,
          image_url: imageUrl || null,
          style: style || "FLAT_VECTOR",
          response_id: generatedImage.id,
        })
        .select()
        .single()

      if (promptError) {
        console.error("Error saving prompt:", promptError)
        return NextResponse.json({ error: "Failed to save prompt" }, { status: 500 })
      }

      const { data: imageData, error: imageError } = await supabase
        .from("generated_images")
        .insert({
          prompt_id: promptData.id,
          svg_url: generatedImage.svgUrl,
        })
        .select()
        .single()

      if (imageError) {
        console.error("Error saving image:", imageError)
        return NextResponse.json({ error: "Failed to save image" }, { status: 500 })
      }

      return NextResponse.json({
        id: generatedImage.id,
        svgUrl: generatedImage.svgUrl,
        promptId: promptData.id,
        imageId: imageData.id,
      })
    } catch (apiError) {
      console.error("Error calling SVG.io API:", apiError)
      return NextResponse.json(
        { error: "Failed to call SVG.io API: " + (apiError instanceof Error ? apiError.message : "Unknown error") },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in generate-svg route:", error)
    return NextResponse.json(
      { error: "Failed to process request: " + (error instanceof Error ? error.message : "Unknown error") },
      { status: 500 },
    )
  }
}

