import { GalleryImage } from "./gallery-image";
import { GallerySearch } from "@/components/gallery/gallery-search";
import { GalleryPagination } from "@/components/gallery/gallery-pagination";
import { createServerClient } from "@/lib/supabase-server";
import { useGalleryImages } from "@/hooks/use-gallery-images";

const ITEMS_PER_PAGE = 12;

type GalleryProps = {
  searchParams: {
    page?: string;
    search?: string;
    initial?: string;
  };
  isUserGallery?: boolean;
  userId?: string;
};

export async function Gallery({
  searchParams,
  isUserGallery = false,
  userId,
}: GalleryProps) {
  const supabase = createServerClient();
  const page = Number(searchParams.page) || 1;
  const search = searchParams.search || "";
  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE - 1;
  const initialSVg = searchParams.initial || "";

  let query = supabase.from("generated_images").select(
    `
      id,
      svg_url,
      created_at,
      prompts!inner (
        id,
        prompt_text,
        style,
        image_url,
        user_id
      )
    `,
    { count: "exact" }
  );

  if (isUserGallery && userId) {
    query = query.eq("prompts.user_id", userId);
  }

  if (search) {
    query = query.ilike("prompts.prompt_text", `%${search}%`);
  }

  const { images, count, error } = await useGalleryImages(query, start, end);

  if (error) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        ОЙ, щось пішло не так
        <br />
        Перезавантажте сторінку будь-ласка
      </div>
    );
  }

  const totalPages = Math.ceil((count || 0) / ITEMS_PER_PAGE);

  return (
    <>
      <GallerySearch search={search} />

      {!images || images.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {search ? "Зображень не знайдено" : "Ще немає зображень"}
        </div>
      ) : (
        <>
          <div className="flex overflow-y-auto w-full flex-wrap gap-4 justify-around">
            {images.map((image) => (
              <div
                key={image.id}
                className="size-[320px] xl:size-[400px]"
              >
                <GalleryImage
                  image={image}
                  initial={initialSVg === image.id}
                  isUserGallery={isUserGallery}
                />
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <GalleryPagination
              currentPage={page}
              totalPages={totalPages}
              search={search}
            />
          )}
        </>
      )}
    </>
  );
}
