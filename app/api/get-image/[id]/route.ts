import { NextResponse } from "next/server"

const API_KEY = process.env.SVGIO_API_KEY

export async function GET(request: Request, { params }: { params: { id: string } }) {
  if (!API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 })
  }

  try {
    const id = params.id

    // Call the SVG.io API
    const response = await fetch(`https://api.svg.io/v1/get-image/${id}`, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
      },
    })

    const result = await response.json()

    if (!result.success) {
      return NextResponse.json({ error: "Failed to get SVG" }, { status: 400 })
    }

    return NextResponse.json(result.data)
  } catch (error) {
    console.error("Error getting SVG:", error)
    return NextResponse.json({ error: "Failed to get SVG" }, { status: 500 })
  }
}

