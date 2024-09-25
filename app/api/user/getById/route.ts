import { connect } from "@/db/mongo/db";
import { User, UserModel } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    if (request.method !== "GET") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 400 }
      );
    }
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json(
        { message: "User ID not found" },
        { status: 404 }
      );
    }

    await connect();
    const user = (await UserModel.findOne({ _id: userId })) as User;

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
  }
}
