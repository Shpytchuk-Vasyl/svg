import { Gallery } from "@/components/gallery/gallery";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { page?: string; search?: string };
}) {
  return (
    <>
      <h1 className="text-2xl font-bold text-center mb-6">Адмінка</h1>
      <Gallery searchParams={searchParams} isUserGallery={true} />
    </>
  );
}
