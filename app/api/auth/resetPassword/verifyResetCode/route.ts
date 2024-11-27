import { jwtDecode } from "@/actions/auth/jwtDecode";
import { UserModel } from "@/models/user";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 },
    );
  }
  try {
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ message: "Body not found" }, { status: 400 });
    }

    const cookieStore = await cookies();
    if (!cookieStore) {
      return NextResponse.json(
        { message: "You need to activate cookies in order to be able to reset your password" },
        { status: 401 },
      );
    }
    const encryptedCode = cookieStore.get("resetCode");
    const encryptedMail = cookieStore.get("encryptedMail");
    const { code } = body;

    if (!encryptedCode || !encryptedMail || !code) {
      return NextResponse.json({ message: "No code found" }, { status: 404 });
    }

    const decryptedCode = await jwtDecode(encryptedCode.value);
    if (!decryptedCode) {
      return NextResponse.json({ message: "Invalid code format" }, { status: 401 });
    }

    const decryptedMail = await jwtDecode(encryptedMail.value);
    if (!decryptedMail) {
      return NextResponse.json({ message: "Invalid email format" }, { status: 401 });
    }

    if (decryptedCode !== code) {
      return NextResponse.json(
        { message: "Code is incorrect" },
        { status: 401 },
      );
    }

    const user = await UserModel.findOne({ email: decryptedMail }).exec();
    if (!user) {
      return NextResponse.json(
        { message: "No account is associated with this email" },
        { status: 404 },
      );
    }
   
    return NextResponse.json(
      { message: "You can change your password" },
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
