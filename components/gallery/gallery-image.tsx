"use client";

import { useState } from "react";
import { SVGViewerModal } from "../svg/svg-modal";
import { GalleryImageType } from "@/hooks/use-gallery-images";
import Image from "next/image";

type GalleryImageProps = {
  image: GalleryImageType;
  initial?: boolean;
  isUserGallery?: boolean;
};

export function GalleryImage({
  image,
  initial = false,
  isUserGallery = false,
}: GalleryImageProps) {
  const [isSelected, setIsSelected] = useState(initial);
  const [key, setKey] = useState(0);

  return (
    <>
      <button
        className="aspect-square bg-background/50 rounded overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
        onClick={() => setIsSelected(true)}
      >
        <Image
          src={image.prompts.image_url || "/placeholder.png"}
          alt={image.prompts.prompt_text}
          className="w-full h-full object-cover border-2 border-transparent hover:border-primary"
          width={256}
          height={256}
        />
      </button>

      <SVGViewerModal
        isSelected={isSelected}
        setIsSelected={setIsSelected}
        image={image}
        setReloadTriger={setKey}
        reloadTriger={key}
        isUserGallery={isUserGallery}
      />
    </>
  );
}
