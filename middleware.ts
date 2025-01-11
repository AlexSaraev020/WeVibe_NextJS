import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
    const cookie = req.cookies.get("authToken");
  if (!cookie) {
    const loginUrl = new URL("/auth/login", req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/profile/:path*",
        "/home/:path*",
        "/search/:path*",
    ],
};

