import {
  createServerComponentClient,
  SupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

let serverClient: SupabaseClient<Database> | null = null;

export const createServerClient = () => {
  if (!serverClient) {
    serverClient = createServerComponentClient<Database>({
      cookies,
    });
  }
  return serverClient;
};
