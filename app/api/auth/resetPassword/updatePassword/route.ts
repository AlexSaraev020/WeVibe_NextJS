import { jwtDecode } from "@/actions/auth/jwtDecode";
import { validate__Fields__Length } from "@/actions/auth/validateFieldsLength";
import { connect } from "@/db/mongo/db";
import { UserModel } from "@/models/user";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed!" },
      { status: 400 },
    );
  }
  try {
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ message: "Body not found" }, { status: 401 });
    }
    const { password } = body;
    if (!password || password.trim() === "") {
      return NextResponse.json(
        { message: "Password cannot be empty" },
        { status: 402 },
      );
    }
    const trimmedPassword = password.trim();
    const validFields = validate__Fields__Length({ password: trimmedPassword });
    if (validFields) {
      return NextResponse.json({ message: validFields }, { status: 400 });
    }

    const cookieStore = await cookies();
    if (!cookieStore) {
      return NextResponse.json(
        {
          message:
            "You need to activate cookies in order to be able to reset your password",
        },
        { status: 403 },
      );
    }
    const encryptedMail = cookieStore.get("encryptedMail");
    if (!encryptedMail) {
      return NextResponse.json(
        { message: "Email token has expired" },
        { status: 404 },
      );
    }
    const decryptedMail = await jwtDecode(encryptedMail.value);
    if (!decryptedMail) {
      return NextResponse.json(
        { message: "Invalid email format" },
        { status: 405 },
      );
    }
    await connect();
    const user = await UserModel.findOne({ email:decryptedMail });
    if (!user) {
      return NextResponse.json(
        { message: "No user account is associated with this mail" },
        { status: 204 },
      );
    }
    const isPasswordIdentic = await bcrypt.compare(trimmedPassword, user.password);
    if (trimmedPassword !== undefined && trimmedPassword !== null && !isPasswordIdentic) {
      const salt = await bcrypt.genSalt(10);
      const newEncryptedPassword = await bcrypt.hash(trimmedPassword, salt);
      user.password = newEncryptedPassword;
      await user.save();
      cookieStore.delete("encryptedMail");
      cookieStore.delete("resetCode");
      return NextResponse.json(
        { message: "Password changed, you can now log in" },
        { status: 200 },
      );
    }
    return NextResponse.json(
      { message: "New password must be different from the old one" },
      { status: 402 },
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
