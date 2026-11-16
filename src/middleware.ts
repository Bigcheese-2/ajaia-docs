import { NextResponse, type NextRequest } from "next/server";

// Keep in sync with SESSION_COOKIE in features/auth/session.ts
// (that module is server-only and can't be imported into middleware).
const SESSION_COOKIE = "ajaia_session";

/** Send signed-out visitors to /login. Pages still verify the user server-side. */
export function middleware(req: NextRequest) {
  if (!req.cookies.has(SESSION_COOKIE) && req.nextUrl.pathname !== "/login") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/|favicon.ico|.*\\.(?:png|svg|jpg|ico)$).*)"],
};
