import type { Metadata } from "next";
import { Gallery } from "@/components/gallery/gallery";
import { createServerClient } from "@/lib/supabase-server";
import { AuthCheck } from "@/components/auth/auth-check";

export const metadata: Metadata = {
  title: "Мої зображення",
  description: "Перегляд ваших зображень",
};

export default async function MyImagesPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return <AuthCheck />;
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-6">Мої зображення</h1>
      <Gallery
        searchParams={searchParams}
        isUserGallery={true}
        userId={session.user.id}
      />
    </>
  );
}
