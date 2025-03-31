"use client"

import { useState } from "react"
import { Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type GalleryImage = {
  id: string
  svg_url: string
  created_at: string
  prompts: {
    id: string
    prompt_text: string
    style: string
    user_id: string | null
  }
}

export function Gallery({ images }: { images: GalleryImage[] }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  const filteredImages = searchTerm
    ? images.filter((img) => img.prompts.prompt_text.toLowerCase().includes(searchTerm.toLowerCase()))
    : images

  return (
    <div>
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="search"
          placeholder="Search images..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredImages.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">No images found</div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              className="aspect-square rounded-lg overflow-hidden border cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image.svg_url || "/placeholder.svg"}
                alt={image.prompts.prompt_text}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-background rounded-lg shadow-lg">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 z-10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-4 w-4" />
            </Button>

            <div className="p-4">
              <div className="aspect-square w-full bg-background/50 rounded overflow-hidden mb-4">
                <img
                  src={selectedImage.svg_url || "/placeholder.svg"}
                  alt={selectedImage.prompts.prompt_text}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="space-y-2">
                <p className="font-medium">{selectedImage.prompts.prompt_text}</p>
                <p className="text-sm text-muted-foreground">
                  Style: {selectedImage.prompts.style.replace(/_/g, " ").toLowerCase()}
                </p>
                <p className="text-sm text-muted-foreground">
                  Created: {new Date(selectedImage.created_at).toLocaleString()}
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => window.open(selectedImage.svg_url, "_blank")}>
                    Open SVG
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement("a")
                      link.href = selectedImage.svg_url
                      link.download = `svg-${selectedImage.id}.svg`
                      document.body.appendChild(link)
                      link.click()
                      document.body.removeChild(link)
                    }}
                  >
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

