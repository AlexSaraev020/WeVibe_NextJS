import { connect } from "@/db/mongo/db";
import { NextResponse } from "next/server";
import { UserModel } from "@/models/user";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { generateToken } from "@/actions/auth/jwtCreate";
import { validate__Fields__Length } from "@/actions/auth/validateFieldsLength";
import { validateFieldsTrim } from "@/actions/auth/validateFieldsTrim";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 },
    );
  }
  try {
    const cookieStore = await cookies();
    await connect();
    if (req.method !== "POST") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 400 },
      );
    }

    const body = await req.json();

    const { email, password, rememberMe } = body;
    const trimValidation = validateFieldsTrim({
      email: email,
      password: password,
    });
    if (trimValidation.error || !trimValidation.fields) {
      return NextResponse.json(
        { message: trimValidation.error },
        { status: 400 },
      );
    }

    const validFields = validate__Fields__Length({
      email: trimValidation.fields.email,
      password: trimValidation.fields.password,
    });
    if (validFields) {
      return NextResponse.json({ message: validFields }, { status: 400 });
    }

    const existingUser = await UserModel.findOne({
      email: trimValidation.fields.email,
    }).exec();

    if (!existingUser) {
      return NextResponse.json(
        { message: "User doesn't exist!" },
        { status: 404 },
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      trimValidation.fields.password,
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
      maxAge: rememberMe ? 14 * 24 * 60 * 60 : 60 * 60,
      httpOnly: true,
      sameSite: "strict",
    });
    cookieStore.set("isGuest", "false")

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
