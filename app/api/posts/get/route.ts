import { connect } from "@/db/mongo/db";
import { UserModel } from "@/models/user";
import { PostModel } from "@/models/posts/post";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 },
    );
  }
  await connect();
  try {
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ message: "Body not found" }, { status: 400 });
    }
    const { skip, limit } = body;
    if (skip == null || limit == null) {
      return NextResponse.json(
        { message: "Missing skip or limit" },
        { status: 400 },
      );
    }
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "createdBy",
        model: UserModel,
        select: "username image",
      })
      .select("_id title description image createdAt createdBy comments likes")
      .lean()
      .exec();

    if (!posts.length) {
      return NextResponse.json(
        { message: "No more posts found" },
        { status: 200 },
      );
    }
    const likesNumberPosts = posts.map((post) => ({
      ...post,
      likes: post.likes.length,
    }));
    
    const totalCommentsCount = await PostModel.countDocuments();
    const hasMore = totalCommentsCount > skip + limit;
    return NextResponse.json({ posts: likesNumberPosts, hasMore }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "An error occurred", error: error.message },
        { status: 500 },
      );
    }
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
