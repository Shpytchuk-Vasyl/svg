import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <section className="flex overflow-y-auto w-full flex-wrap gap-4 justify-around">
      {Array.from({ length: 10 }).map((_, index) => (
        <div key={index} className="size-[296px]">
          <Skeleton className="w-full h-full" />
        </div>
      ))}
    </section>
  );
}
