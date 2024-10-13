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
      .populate({ path: "createdBy", model: UserModel })
      .sort({ createdAt: -1 })
      .exec();
    if (!posts.length) {
      return NextResponse.json({ message: "Posts not found" }, { status: 404 });
    }
    const filteredPosts = posts.map((post) => {
      return {
        _id: post._id,
        title: post.title,
        description: post.description,
        image: post.image,
        createdAt: post.createdAt,
        createdBy: post.createdBy,
      };
    });
    if (!filteredPosts.length) {
      return NextResponse.json({ message: "Posts not found" }, { status: 404 });
    }
    return NextResponse.json({ posts: filteredPosts }, { status: 200 });
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
