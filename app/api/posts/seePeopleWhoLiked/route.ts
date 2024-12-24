import { connect } from "@/db/mongo/db";
import { PostModel } from "@/models/posts/post";
import { UserModel } from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 },
    );
  }
  try {
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ message: "Body not found" }, { status: 400 });
    }
    const { postId, skip, limit } = body;
    if (!postId || skip == null || limit == null) {
      return NextResponse.json(
        { message: "No post id found" },
        { status: 400 },
      );
    }
    await connect();
    const peopleWhoLiked = await PostModel.findById({ _id: postId })
      .select("likes")
      .populate({
        path: "likes",
        model: UserModel,
        select: ["username", "image", "_id"],
      })
      .exec();
    if (!peopleWhoLiked) {
      return NextResponse.json(
        { message: "Nobody liked this post" },
        { status: 404 },
      );
    }
    const peopleWhoLikedSliced = peopleWhoLiked.likes.slice(skip, skip + limit);
    const totalUsersWhoLiked = peopleWhoLiked.likes.length;
    const hasMore = totalUsersWhoLiked > skip + limit;
    
    return NextResponse.json(
      { users: peopleWhoLikedSliced, hasMore },
      { status: 200 },
    );
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
