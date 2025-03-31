"use client";
import { SupabaseClient } from "@supabase/supabase-js";

const URLs = [
  "https://api.svg.io/v1",
  "https://vercel-proxy-git-master-shpytchuk-vasyls-projects.vercel.app/https://api.svg.io/v1",
  "https://vercel-proxy-git-stag-shpytchuk-vasyls-projects.vercel.app/https://api.svg.io/v1",
];

export type ImagePostResponse = {
  id: string;
  png_s3_url: string;
  prompt: string;
};

export type ImageGetResponse = {
  id: string;
  png_s3_url: string;
  svg_s3_url: string;
  user_prompt: string;
};

export async function generateSVG(
  prompt: string,
  style: string | null,
  imageUrl: string | null,
  supabase: SupabaseClient,
  retry: number = 0
) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  try {
    const response = await fetch(
      URLs[Math.floor(Math.random() * URLs.length)] + "/generate-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userPrompt: prompt,
          negativePrompt: "",
          style: style || "FLAT_VECTOR",
          initialImage: imageUrl || null,
          initialImageType: imageUrl ? "PNG" : null,
        }),
      }
    );

    const result = await response.json();

    if (!result.success) {
      if (retry < 2) {
        return await generateSVG(prompt, style, imageUrl, supabase, retry + 1);
      }
      throw new Error();
    }

    const generatedImage = result.data[0] as ImagePostResponse;

    // Save to database
    const { data: promptData, error: promptError } = await supabase
      .from("prompts")
      .insert({
        user_id: session?.user?.id || null,
        prompt_text: prompt,
        image_url:
          (generatedImage as any)?.pngUrl || generatedImage.png_s3_url || null,
        style: style || "FLAT_VECTOR",
        response_id: generatedImage.id,
      })
      .select()
      .single();

    const imageInfo = await fetch(
      URLs[Math.floor(Math.random() * URLs.length)] +
        "/get-image/" +
        generatedImage.id
    );

    const imageInfoJSON = await imageInfo.json();
    const imageInfoData = imageInfoJSON.data[0] as ImageGetResponse;

    const { data: imageData, error: imageError } = await supabase
      .from("generated_images")
      .insert({
        prompt_id: promptData.id,
        svg_url: (imageInfoData as any).svgUrl || imageInfoData.svg_s3_url,
      })
      .select()
      .single();

    if (imageError || promptError) {
      throw new Error();
    }

    return imageInfoData;
  } catch (error) {
    throw new Error("Ой не вдалось згенерувати SVG");
  }
}
