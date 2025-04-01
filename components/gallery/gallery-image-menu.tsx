"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GalleryImageType } from "@/hooks/use-gallery-images";
import {
  MoreHorizontal,
  Download,
  Share2,
  ExternalLink,
  RotateCw,
  Trash,
} from "lucide-react";
import { useSupabase } from "../supabase-provider";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface GalleryImageMenuProps {
  image: GalleryImageType;
  onReload: () => void;
  isUserGallery: boolean;
}

export function GalleryImageMenu({
  image,
  onReload,
  isUserGallery,
}: GalleryImageMenuProps) {
  const { supabase } = useSupabase();
  const router = useRouter();
  const { toast } = useToast();

  const deleteImage = async (id: string) => {
    const { error } = await supabase.from("prompts").delete().eq("id", id);

    if (error) {
      toast({
        title: "Помилка при видаленні зображення",
        variant: "destructive",
      });
    } else {
      router.refresh();
      toast({
        title: "Зображення видалено",
        description: "Зображення та всі пов'язані з ним промпти були видалені",
      });
    }
  };

  const download = ({ href, linkText }: { href: string; linkText: string }) => {
    const link = document.createElement("a");
    link.href = href;
    link.download = linkText;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Зображення завантажено",
    });
  };

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
        <DropdownMenuItem onClick={() => window.open(image.svg_url, "_blank")}>
          <ExternalLink className="mr-2 h-4 w-4" />
          Відкрити SVG
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            download({
              href: image.svg_url,
              linkText: `svg-${image.id}.svg`,
            });
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          Завантажити SVG
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            download({
              href: image.prompts.image_url!,
              linkText: `image-${image.id}.png`,
            });
          }}
        >
          <Download className="mr-2 h-4 w-4" />
          Завантажити PNG
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            navigator.share({
              url: `${window.location.origin}/gallery?initial=${image.id}`,
              title: image.prompts.prompt_text,
            });
          }}
        >
          <Share2 className="mr-2 h-4 w-4" />
          Поділитися
        </DropdownMenuItem>
        {isUserGallery && (
          <DropdownMenuItem onClick={() => deleteImage(image.prompts.id)}>
            <Trash className="mr-2 h-4 w-4" />
            Видалити
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
