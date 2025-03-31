import type { Metadata } from "next";
import { Gallery } from "@/components/gallery/gallery";

export const metadata: Metadata = {
  title: "Галерея",
  description: "Перегляд всіх зображень",
};

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
