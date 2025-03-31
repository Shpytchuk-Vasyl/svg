"use client";

import { useState } from "react";
import { X, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SvgViewer } from "@/components/svg-viewer";

type GalleryImageProps = {
  id: string;
  svg_url: string;
  prompt_text: string;
  style: string;
  created_at: string;
  image_url: string;
};

export function GalleryImage({
  id,
  svg_url,
  prompt_text,
  style,
  created_at,
  image_url,
}: GalleryImageProps) {
  const [isSelected, setIsSelected] = useState(false);
  const [key, setKey] = useState(0); // для перезапуску анімації

  return (
    <>
      <div
        className="aspect-square bg-background/50 rounded overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => setIsSelected(true)}
      >
        <img
          src={image_url || "/placeholder.png"}
          alt={prompt_text}
          className="w-full h-full object-cover"
        />
      </div>

      <Dialog open={isSelected} onOpenChange={setIsSelected}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>SVG Деталі</DialogTitle>
          </DialogHeader>

          <div className="p-4">
            <div className="aspect-square w-full bg-background/50 rounded overflow-hidden mb-4 relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10"
                onClick={() => setKey((prev) => prev + 1)}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
              <SvgViewer reload={key} url={svg_url} className="w-full h-full" />
            </div>

            <div className="space-y-2">
              <p className="font-medium">{prompt_text}</p>
              <p className="text-sm text-muted-foreground">
                Стиль: {style.replace(/_/g, " ").toLowerCase()}
              </p>
              <p className="text-sm text-muted-foreground">
                Створено: {new Date(created_at).toLocaleString()}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(svg_url, "_blank")}
                >
                  Відкрити SVG
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = svg_url;
                    link.download = `svg-${id}.svg`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  Завантажити SVG
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = image_url;
                    link.download = `image-${id}.png`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                >
                  Завантажити PNG
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
