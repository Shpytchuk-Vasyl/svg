"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SvgViewer } from "@/components/svg-viewer";
import { STYLES } from "../chat/chat-input";
import { GalleryImageMenu } from "./gallery-image-menu";

type GalleryImageProps = {
  id: string;
  svg_url: string;
  prompt_text: string;
  style: string;
  created_at: string;
  image_url: string;
  initial?: boolean;
};

export function GalleryImage({
  id,
  svg_url,
  prompt_text,
  style,
  created_at,
  image_url,
  initial,
}: GalleryImageProps) {
  const [isSelected, setIsSelected] = useState(initial);
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
          className="w-full h-full object-cover border-2 border-transparent hover:border-primary"
        />
      </div>

      <Dialog open={isSelected} onOpenChange={setIsSelected}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="flex flex-row gap-4 items-center space-y-0">
            <GalleryImageMenu
              id={id}
              svg_url={svg_url}
              image_url={image_url}
              prompt_text={prompt_text}
              onReload={() => setKey((prev) => prev + 1)}
            />
            <DialogTitle>Деталі</DialogTitle>
          </DialogHeader>

          <div className="p-4">
            <div className="aspect-square w-full bg-background/50 rounded overflow-hidden mb-4 relative">
              <SvgViewer reload={key} url={svg_url} className="w-full h-full" />
            </div>

            <div className="space-y-2">
              <p className="font-medium">{prompt_text}</p>
              <p className="text-sm text-muted-foreground">
                Стиль: {STYLES.find((s) => s.value === style)?.label}
              </p>
              <p className="text-sm text-muted-foreground">
                Створено: {new Date(created_at).toLocaleString("uk-UA")}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
