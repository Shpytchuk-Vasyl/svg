import {
  createServerComponentClient,
  SupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import type { Database } from "./database.types";

let serverClient: SupabaseClient<Database> | null = null;
let adminClient: SupabaseClient<Database> | null = null;

export const createServerClient = () => {
  if (!serverClient) {
    serverClient = createServerComponentClient<Database>({
      cookies,
    });
  }
  return serverClient;
};

// Створення адміністративного клієнта з сервісним ключем
export const createAdminClient = () => {
  if (!adminClient) {
    // Отримуємо URL та сервісний ключ з змінних середовища
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing Supabase service credentials");
    }

    adminClient = createClient<Database>(supabaseUrl, supabaseServiceKey);
  }
  return adminClient;
};
