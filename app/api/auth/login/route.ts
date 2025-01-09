import { connect } from "@/db/mongo/db";
import { NextResponse } from "next/server";
import { UserModel } from "@/models/user";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { generateToken } from "@/actions/auth/jwtCreate";
import { validate__Fields__Length } from "@/actions/auth/validateFieldsLength";

export async function POST(req: Request) {
  try {
    await connect();
    if (req.method !== "POST") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 400 },
      );
    }

    const body = await req.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 401 },
      );
    }

    if (email.length > 0 && email.trim() === "") {
      return NextResponse.json(
        { message: "Email cannot be empty" },
        { status: 401 },
      );
    }

    if (password.length > 0 && password.trim() === "") {
      return NextResponse.json(
        { message: "Password cannot be empty" },
        { status: 401 },
      );
    }

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const validFields = validate__Fields__Length({
      email: trimmedEmail,
      password: trimmedPassword,
    });
    if (validFields) {
      return NextResponse.json({ message: validFields }, { status: 400 });
    }

    const existingUser = await UserModel.findOne({ email: trimmedEmail }).exec();

    if (!existingUser) {
      return NextResponse.json(
        { message: "User doesn't exist!" },
        { status: 404 },
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      trimmedPassword,
      existingUser.password,
    );

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Incorrect password!" },
        { status: 402 },
      );
    }
    const token = await generateToken(existingUser._id.toString());

    (await cookies()).set({
      name: "authToken",
      value: token,
      maxAge: 14 * 24 * 60 * 60,
      httpOnly: true,
      sameSite: "strict",
    });

    return NextResponse.json({ message: "Logged in!" }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "An error occurred", error },
      { status: 500 },
    );
  }
}
