import { connect } from "@/db/mongo/db";
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
  try {
    const posts = await PostModel.find({})
      .sort({ createdAt: -1 })
      .populate({ path: "createdBy", model: UserModel ,select: "username image"})
      .select("_id title description image createdAt createdBy comments")
      .exec();
    if (!posts.length) {
      return NextResponse.json({ message: "Posts not found" }, { status: 404 });
    }

    return NextResponse.json({ posts: posts }, { status: 200 });
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
