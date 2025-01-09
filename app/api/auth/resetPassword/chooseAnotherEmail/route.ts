import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  if (req.method !== "DELETE") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 },
    );
  }
  try {
    const cookieStore = await cookies();
    if (!cookieStore) {
      return NextResponse.json(
        { message: "You can already choose another mail" },
        { status: 403 },
      );
    }
    cookieStore.delete("encryptedMail");
    cookieStore.delete("resetCode");
    return NextResponse.json(
      { message: "You can now choose another mail" },
      { status: 200 },
    );
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
