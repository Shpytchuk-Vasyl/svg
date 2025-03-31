"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Download,
  Share2,
  ExternalLink,
  RotateCw,
} from "lucide-react";

interface GalleryImageMenuProps {
  id: string;
  svg_url: string;
  image_url: string;
  prompt_text: string;
  onReload: () => void;
}

export function GalleryImageMenu({
  id,
  svg_url,
  image_url,
  prompt_text,
  onReload,
}: GalleryImageMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onReload}>
          <RotateCw className="mr-2 h-4 w-4" />
          Оновити
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => window.open(svg_url, "_blank")}>
          <ExternalLink className="mr-2 h-4 w-4" />
          Відкрити SVG
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            const link = document.createElement("a");
            link.href = svg_url;
            link.download = `svg-${id}.svg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          Завантажити SVG
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            const link = document.createElement("a");
            link.href = image_url;
            link.download = `image-${id}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          Завантажити PNG
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            navigator.share({
              url: `${window.location.origin}/gallery?initial=${id}&search=${prompt_text}`,
              title: prompt_text,
            });
          }}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Поділитися
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
