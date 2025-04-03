import Image from "next/image";
import { AuthButton } from "./auth-button";
import { createServerClient } from "@/lib/supabase-server";
import Link from "next/link";
import { MY_ID } from "@/constants";

export async function AuthButtonWrapper() {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Link href={user?.id === MY_ID ? "/admin" : "#"}>
        <Image src="/logo.svg" alt="logo" width={40} height={40} />
      </Link>

      <AuthButton user={user!} />
    </>
  );
}
