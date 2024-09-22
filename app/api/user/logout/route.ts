import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json(
      { message: "Logged out" },
      { status: 200 }
    );
    response.cookies.delete("authToken");
    return response;
  } catch (error: unknown) {
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
