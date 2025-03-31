"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useDebounce } from "@/hooks/use-debounce";

export function GallerySearch({ search }: { search: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams]
  );

  const debouncedSearch = useDebounce((value: string) => {
    const queryString = createQueryString({
      search: value || null,
      page: null,
    });
    router.push(`?${queryString}`);
  }, 700);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
      <Input
        type="search"
        placeholder="Шукати..."
        defaultValue={search}
        onChange={(e) => debouncedSearch(e.target.value)}
        className="pl-10"
      />
    </div>
  );
}
