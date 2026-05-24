import { isSupabaseConfigured } from "./types";
import { localStorageAdapter } from "./local";
import { supabaseStorageAdapter } from "./supabase";

export function getStorageAdapter() {
  return isSupabaseConfigured() ? supabaseStorageAdapter : localStorageAdapter;
}
