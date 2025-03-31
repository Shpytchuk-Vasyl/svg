import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

const serverClient = createServerComponentClient<Database>({
  cookies: () => cookies(),
});

export const createServerClient = () => {
  return serverClient;
};
