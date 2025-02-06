import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const isLogged = req.cookies.get("authToken");
  const isGuest = req.cookies.get("isGuest")?.value;
  
  const res = NextResponse.next();

  if (isLogged) {
    res.cookies.set("isGuest", "false", { path: "/" });
    return NextResponse.redirect(new URL("/home", req.nextUrl.origin));
  } 
  
  if (isGuest === "true") {
    res.cookies.delete("authToken");
    return NextResponse.redirect(new URL("/home", req.nextUrl.origin));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [ "/"],
};
