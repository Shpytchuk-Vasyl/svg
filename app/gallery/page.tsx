import type { Metadata } from "next";
import { Gallery } from "@/components/gallery/gallery";
import { createServerClient } from "@/lib/supabase-server";

type Props = {
  params: {};
  searchParams: { initial?: string; search?: string };
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const initialId = searchParams.initial;

  let metadata: Metadata = {
    title: "Галерея - Love You",
    description: "Перегляньте колекцію згенерованих SVG зображень",
    openGraph: {
      title: "Галерея SVG зображень - Love You",
      description: "Перегляньте колекцію згенерованих SVG зображень",
      images: ["screenshots/og-gallery.png"],
    },
  };

  if (initialId) {
    const supabase = createServerClient();
    const { data } = await supabase
      .from("generated_images")
      .select(
        `
        id,
        svg_url,
        prompts!inner (
          prompt_text,
          image_url
        )
      `
      )
      .eq("id", initialId)
      .single();

    if (data) {
      //@ts-ignore
      const promptText = data.prompts.prompt_text;
      //@ts-ignore
      const imageUrl = data.prompts.image_url;

      // Оновлюємо метадані з інформацією про конкретне зображення
      metadata = {
        title: `Галерея - ${promptText}`,
        description: `Перегляньте "${promptText}" та інші SVG зображення в нашій галереї`,
        openGraph: {
          title: promptText,
          description: `Красиве SVG зображення "${promptText}"`,
          images: [
            {
              url: imageUrl || "screenshots/og-gallery.png",
              width: 1200,
              height: 630,
              alt: promptText,
            },
          ],
        },
        twitter: {
          card: "summary_large_image",
          title: promptText,
          description: `Красиве SVG зображення в галереї`,
          images: [imageUrl || "screenshots/og-gallery.png"],
        },
      };
    }
  }

  return metadata;
}

export default function GalleryPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-6">Галерея</h1>
      <Gallery searchParams={searchParams} />
    </>
  );
}
