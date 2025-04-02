import { Gallery } from "@/components/gallery/gallery";
import { createServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

const myID = "193e36a1-4202-49ca-86da-0c5f10456a9b";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || session.user.id !== myID) {
    redirect("/");
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-6">Адмінка</h1>
      <Gallery searchParams={searchParams} isUserGallery={true} />
    </>
  );
}
