import { connect } from "@/db/mongo/db";
import {  UserModel } from "@/models/user";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/types/userTypes/token/decoded";

export async function GET(req: Request) {
  if (req.method !== "GET") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 }
    );
  }
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("authToken");
    if (!token) {
      return NextResponse.json(
        { message: "You are not logged in!" },
        { status: 401 }
      );
    }
    const userId = jwtDecode(token.value) as DecodedToken;
    if (!userId || !userId.userId) {
      return NextResponse.json(
        { message: "You are not logged in!" },
        { status: 401 }
      );
    }

    await connect();
    const user = await UserModel.findOne({ _id: userId.userId })
      .select("_id username image")
      .exec();
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "An error occurred", error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
