"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useSupabase } from "@/providers/supabase-provider";

export function AuthCheck() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { supabase } = useSupabase();

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=/my-images`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error signing in:", error);
      toast({
        title: "Помилка при вході",
        description:
          error instanceof Error ? error.message : "Помилка при вході",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <h2 className="text-xl font-semibold mb-4">
        Зареєструйтеся для перегляду своїх зображень
      </h2>
      <p className="text-muted-foreground mb-6">
        Ви повинні бути зареєстровані для перегляду своїх зображень
      </p>
      <Button onClick={handleLogin} disabled={isLoading} variant="outline">
        {isLoading ? "Вхід..." : "Увійти з Google"}
      </Button>
    </div>
  );
}
