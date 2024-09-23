import { connect } from "@/db/mongo/db";
import { User, UserModel } from "@/models/user";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from "@/types/userTypes/token/decoded";

export async function GET(req: Request) {
  try {
    if (req.method !== "GET") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 400 }
      );
    }
    const cookieStore = cookies();
    const token = cookieStore.get("authToken");
    if (!token) {
      return NextResponse.json(
        { message: "You are not logged in!" },
        { status: 400 }
      );
    }
    const userId = jwtDecode(token.value) as DecodedToken;
    await connect();
    if (!userId) {
      return NextResponse.json(
        { message: "You are not logged in!" },
        { status: 400 }
      );
    }

    const user = (await UserModel.findOne({ _id: userId.userId })) as User;
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred", error },
      { status: 500 }
    );
  }
}
