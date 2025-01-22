import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const isLogged = req.cookies.get("authToken");
  const isGuest = req.cookies.get("isGuest");
  if (!isLogged && !isGuest) {
    const loginUrl = new URL("/auth/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/home/:path*", "/search/:path*"],
};
