import { connect } from "@/db/mongo/db";
import { UserModel } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 }
    );
  }
  try {
    let query = req.nextUrl.searchParams.get("q");
    if (!query) {
      return NextResponse.json({ message: "Query not found" }, { status: 404 });
    }

    query = query.trim();
    await connect();

    const users = await UserModel.find({ username: { $regex: query , $options: "i" } })
    .select("_id username image bio")
    .exec();
    
    if (!users) {
      return NextResponse.json(
        { message: `Users with the name ${query} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({ users }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "An error occurred", error },
      { status: 500 }
    );
  }
}
