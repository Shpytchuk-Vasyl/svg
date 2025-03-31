"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useSupabase } from "@/components/supabase-provider";
import { useToast } from "@/hooks/use-toast";

export function AuthCheck() {
  const { supabase } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/my-images`,
        },
      });
    } catch (error) {
      console.error("Error signing in:", error);
      toast({
        title: "Помилка при вході",
        description: "Помилка при вході",
        variant: "destructive",
      });
    } finally {
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
      <Button onClick={handleLogin} disabled={isLoading}>
        {isLoading ? "Вхід..." : "Увійти з Google"}
      </Button>
    </div>
  );
}
