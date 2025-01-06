import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 },
    );
  }
  const cookieStore = await cookies();
  try {
    const response = cookieStore.delete("authToken");

    if (!response) {
      return NextResponse.json(
        { message: "An error occurred" },
        { status: 500 },
      );
    }
    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "An error occurred", error: error.message },
        { status: 500 },
      );
    }
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
