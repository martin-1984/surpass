import { NextResponse, type NextRequest } from "next/server";
import {
  AUTH_COOKIE,
  hasLocalSession,
  isAuthConfigured,
  updateSession,
} from "@/lib/supabase/middleware";

const protectedPaths = ["/dashboard", "/facturas"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isAuthConfigured()) {
    const response = await updateSession(request);
    const supabaseResponse = response;

    if (protectedPaths.some((path) => pathname.startsWith(path))) {
      const hasSession = request.cookies
        .getAll()
        .some((cookie) => cookie.name.startsWith("sb-"));

      if (!hasSession) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    }

    if (pathname === "/login") {
      const hasSession = request.cookies
        .getAll()
        .some((cookie) => cookie.name.startsWith("sb-"));

      if (hasSession) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }

    return supabaseResponse;
  }

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    if (!hasLocalSession(request)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (pathname === "/login" && hasLocalSession(request)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/facturas/:path*", "/login"],
};

export { AUTH_COOKIE };
