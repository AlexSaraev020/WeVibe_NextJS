import { connect } from "@/db/mongo/db";
import { CommentsModel } from "@/models/posts/comments";
import { UserModel } from "@/models/user";
import { PostModel } from "@/models/posts/post";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  if (req.method !== "GET") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 }
    );
  }
  await connect();
  console.log("Connected to database");
  try {
    const posts = await PostModel.find({})
      .populate({
        path: "comments",
        model: CommentsModel,
        select: "comment user",
      })
      .populate({ path: "createdBy", model: UserModel })
      .sort({ createdAt: -1 });
    console.log("Posts retrieved:", posts);
    if (!posts.length) {
      return NextResponse.json({ message: "Posts not found" }, { status: 404 });
    }
    return NextResponse.json({ posts }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "An error occurred", error: error.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
