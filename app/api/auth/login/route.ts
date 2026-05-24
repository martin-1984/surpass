import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { AUTH_COOKIE, isAuthConfigured } from "@/lib/supabase/middleware";
import {
  DEFAULT_SESSION_MAX_AGE,
  REMEMBER_SESSION_MAX_AGE,
} from "@/lib/auth/session";

const LOCAL_EMAIL = process.env.LOCAL_AUTH_EMAIL ?? "admin@surpass.local";
const LOCAL_PASSWORD = process.env.LOCAL_AUTH_PASSWORD ?? "surpass123";

function applySessionMaxAge(rememberMe: boolean) {
  const maxAge = rememberMe ? REMEMBER_SESSION_MAX_AGE : DEFAULT_SESSION_MAX_AGE;
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

async function extendSupabaseAuthCookies(rememberMe: boolean) {
  if (!rememberMe) return;

  const maxAge = REMEMBER_SESSION_MAX_AGE;
  const cookieStore = await cookies();

  cookieStore.getAll().forEach((cookie) => {
    if (cookie.name.startsWith("sb-") && cookie.name.includes("-auth-token")) {
      cookieStore.set(cookie.name, cookie.value, {
        ...applySessionMaxAge(true),
        maxAge,
      });
    }
  });
}

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    password?: string;
    rememberMe?: boolean;
  };
  const email = body.email?.trim();
  const password = body.password ?? "";
  const rememberMe = body.rememberMe === true;

  if (!email || !password) {
    return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 });
  }

  if (isAuthConfigured()) {
    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    await extendSupabaseAuthCookies(rememberMe);

    return NextResponse.json({ ok: true });
  }

  if (email !== LOCAL_EMAIL || password !== LOCAL_PASSWORD) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, "1", applySessionMaxAge(rememberMe));

  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  if (isAuthConfigured()) {
    const supabase = await createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
  } else {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE);
  }

  return NextResponse.json({ ok: true });
}
