"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-6 px-4 py-10 text-center">
      <div className="flex flex-col items-center gap-2">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-2xl font-bold">Щось пішло не так</h2>
      </div>
      <p className="text-muted-foreground max-w-md">
        Виникла помилка під час завантаження сторінки. Спробуйте
        перезавантажити. Або зверніться до технічної підтримки.
      </p>
      {error.message && (
        <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md max-w-lg overflow-auto">
          <p className="text-sm font-mono">{error.message}</p>
        </div>
      )}
      <div className="flex gap-4">
        <Button variant="outline" onClick={() => (window.location.href = "/")}>
          На головну
        </Button>
        <Button onClick={() => reset()}>
          <RefreshCw className="mr-2 h-4 w-4" /> Спробувати знову
        </Button>
      </div>
    </div>
  );
}
