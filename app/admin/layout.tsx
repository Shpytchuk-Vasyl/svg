import { createServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { MY_ID } from "@/constants";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || session.user.id !== MY_ID) {
    redirect("/");
  }
  return children;
}
