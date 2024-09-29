import { connect } from "@/db/mongo/db";
import { UserModel } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    if (request.method !== "GET") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 400 }
      );
    }
    const query = request.nextUrl.searchParams.get("q");
    if (!query) {
      return NextResponse.json({ message: "Query not found" }, { status: 404 });
    }
    await connect();

    const users = await UserModel.find({ username: { $regex: query } });
    if (!users) {
      return NextResponse.json({ message: "Users not found" }, { status: 404 });
    }

    return NextResponse.json({ users }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "An error occurred", error },
      { status: 500 }
    );
  }
}
