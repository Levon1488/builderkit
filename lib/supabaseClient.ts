import { cookies } from "next/headers";
import {
  createClientComponentClient,
  createRouteHandlerClient,
  createServerComponentClient,
  type SupabaseClient,
} from "@supabase/auth-helpers-nextjs";

export function getBrowserClient<T = any>(): SupabaseClient<T> {
  return createClientComponentClient<T>();
}

export function getServerClient<T = any>(): SupabaseClient<T> {
  return createServerComponentClient<T>({ cookies });
}

export function getRouteClient<T = any>(): SupabaseClient<T> {
  return createRouteHandlerClient<T>({ cookies });
}
