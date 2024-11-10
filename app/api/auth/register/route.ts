import { connect } from "@/db/mongo/db";
import { UserModel } from "@/models/user";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";
import { validate__Fields__Length } from "@/actions/auth/validateFieldsLength";

export async function POST(req: Request) {
  try {
    await connect();

    if (req.method !== "POST") {
      return NextResponse.json({ message: "Method not allowed" });
    }
    const body = await req.json();

    const { username, email, password } = body;
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 },
      );
    }

    const validFields = validate__Fields__Length({ username, email, password });
    if (validFields) {
      return NextResponse.json({ message: validFields }, { status: 400 });
    }
    const existingEmail = await UserModel.findOne({ email });
    const existingUsername = await UserModel.findOne({ username });
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
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    if (!newUser) {
      return NextResponse.json(
        { message: "Failed to create user" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "User created successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 501 },
    );
  }
}
