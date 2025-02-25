import { connect } from "@/db/mongo/db";
import { UserModel } from "@/models/user";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { validate__Fields__Length } from "@/actions/auth/validateFieldsLength";
import { validateFieldsTrim } from "@/actions/auth/validateFieldsTrim";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json({ message: "Method not allowed" });
  }
  try {
    await connect();
    const body = await req.json();
    const { username, email, password } = body;
    const validateTrim = validateFieldsTrim({ username, email, password });
    if (validateTrim.error || !validateTrim.fields) {
      return NextResponse.json(
        { message: validateTrim.error },
        { status: 400 },
      );
    }

    const validFields = validate__Fields__Length({
      username: validateTrim.fields.username,
      email: validateTrim.fields.email,
      password: validateTrim.fields.password,
    });
    if (validFields) {
      return NextResponse.json({ message: validFields }, { status: 400 });
    }
    const existingEmail = await UserModel.findOne({ email:validateTrim.fields.email });
    const existingUsername = await UserModel.findOne({ username:validateTrim.fields.username });
    if (existingEmail && existingUsername) {
      return NextResponse.json(
        {
          message:
            "Email and Username already in use, please use a different one!",
        },
        { status: 401 },
      );
    } else {
      if (existingEmail) {
        return NextResponse.json(
          { message: "Email already in use, please use a different one!" },
          { status: 401 },
        );
      }
      if (existingUsername) {
        return NextResponse.json(
          { message: "Username already in use, please use a different one!" },
          { status: 401 },
        );
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validateTrim.fields.password, salt);
    const newUser = await UserModel.create({
      username:validateTrim.fields.username,
      email:validateTrim.fields.email,
      password: hashedPassword,
    });

    if (!newUser) {
      return NextResponse.json(
        { message: "Failed to create user" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Account created successfully!" },
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
