import { connect } from "@/db/mongo/db";
import { NextResponse } from "next/server";
import { UserModel } from "@/models/user";
import bcrypt from "bcrypt";
import { cookies } from "next/headers";
import { generateToken } from "@/actions/auth/jwtCreate";
import { ObjectId } from "mongoose";

export async function POST(req: Request) {
  try {
    await connect();
    if (req.method !== "POST") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 401 }
      );
    }

    const existingUser = (await UserModel.findOne({ email })) as {
      _id: ObjectId;
      password: string;
    };

    if (!existingUser) {
      return NextResponse.json(
        { message: "User doesn't exist!" },
        { status: 404 }
      );
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Incorrect password!" },
        { status: 402 }
      );
    }
    const token = await generateToken(existingUser._id.toString());

    cookies().set({
      name: "authToken",
      value: token,
      maxAge: 14 * 24 * 60 * 60,
      httpOnly: true,
      sameSite: "strict",
    });

    return NextResponse.json({ message: "Login successful!" }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "An error occurred", error },
      { status: 500 }
    );
  }
}
