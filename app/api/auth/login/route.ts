import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { AUTH_COOKIE, isAuthConfigured } from "@/lib/supabase/middleware";

const LOCAL_EMAIL = process.env.LOCAL_AUTH_EMAIL ?? "admin@surpass.local";
const LOCAL_PASSWORD = process.env.LOCAL_AUTH_PASSWORD ?? "surpass123";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email?.trim();
  const password = body.password ?? "";

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

    return NextResponse.json({ ok: true });
  }

  if (email !== LOCAL_EMAIL || password !== LOCAL_PASSWORD) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

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
