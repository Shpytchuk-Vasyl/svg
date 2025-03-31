import { AuthButton } from "./auth-button";
import { createServerClient } from "@/lib/supabase-server";

export async function AuthButtonWrapper() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <AuthButton user={user} />;
}
