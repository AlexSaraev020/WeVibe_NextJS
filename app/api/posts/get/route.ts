import { connect } from "@/db/mongo/db";
import { PostModel } from "@/models/posts/post";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    if (req.method !== "GET") {
      return NextResponse.json(
        { message: "Method not allowed" },
        { status: 400 }
      );
    }
    await connect();

    const posts = await PostModel.find({}).sort({ createdAt: -1 }).exec();
    if (!posts) {
      return NextResponse.json({ message: "Posts not found" }, { status: 404 });
    }
    return NextResponse.json({ posts }, { status: 200 });
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "An error occurred", error },
      { status: 500 }
    );
  }
}
