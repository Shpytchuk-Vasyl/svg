"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "@/lib/database.types";

export function AuthButton({
  user,
  supabase,
}: {
  user: any;
  supabase: SupabaseClient<Database>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="flex items-center gap-4">
      {user && (
        <Avatar className="size-10">
          <AvatarImage src={user.user_metadata?.avatar_url || undefined} />
          <AvatarFallback>
            <User className="size-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <Button
        onClick={user ? handleLogout : handleLogin}
        disabled={isLoading}
        variant="outline"
      >
        {isLoading ? "Вхід..." : user ? "Вийти" : "Увійти з Google"}
      </Button>
    </div>
  );
}
