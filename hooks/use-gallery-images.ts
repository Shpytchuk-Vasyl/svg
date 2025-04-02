export type GalleryImageType = {
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

export const useGalleryImages = async (
  query: any,
  start: number,
  end: number
) => {
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

  return { images, count, error };
};
