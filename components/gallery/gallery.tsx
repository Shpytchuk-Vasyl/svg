import { GalleryImage } from "./gallery-image";
import { GallerySearch } from "@/components/gallery/gallery-search";
import { GalleryPagination } from "@/components/gallery/gallery-pagination";
import { createServerClient } from "@/lib/supabase-server";

type GalleryImage = {
  id: string;
  svg_url: string;
  created_at: string;
  prompts: {
    id: string;
    prompt_text: string;
    image_url: string | null;
    style: string;
    user_id: string | null;
  };
};

const ITEMS_PER_PAGE = 12;

type GalleryProps = {
  searchParams: {
    page?: string;
    search?: string;
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

  const {
    data: images,
    count,
    error,
  } = (await query
    .order("created_at", { ascending: false })
    .range(start, end)) as {
    data: GalleryImage[] | null;
    count: number | null;
    error: any;
  };

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
    <div className="space-y-4">
      <GallerySearch search={search} />

      {!images || images.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          {search ? "Зображень не знайдено" : "Ще немає зображень"}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            {images.map((image) => (
              <GalleryImage
                key={image.id}
                id={image.id}
                svg_url={image.svg_url}
                prompt_text={image.prompts?.prompt_text}
                style={image.prompts?.style}
                created_at={image.created_at}
                image_url={image.prompts?.image_url || ""}
              />
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
    </div>
  );
}
