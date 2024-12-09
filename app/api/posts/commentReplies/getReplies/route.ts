import { CommentRepliesModel } from "@/models/posts/commentReplies";
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
    const { commentId, postId } = body;
    if (!commentId || !postId) {
      return NextResponse.json(
        { message: "Missing commentId or postId" },
        { status: 400 },
      );
    }
    const replies = await CommentRepliesModel.find({ commentId, postId })
      .sort({ createdAt: -1 })
      .select("-__v -commentId -postId")
      .populate({
        path: "user",
        model: UserModel,
        select: ["username", "image", "_id"],
      })
      .lean()
      .exec();
    if (!replies.length) {
      return NextResponse.json(
        { message: "Replies not found" },
        { status: 404 },
      );
    }
    const formattedReplies = replies.map((reply) => ({
      ...reply,
      likes: reply.likes.length,
    }))
    return NextResponse.json({ replies: formattedReplies }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "An error occurred", error: error.message },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { message: "An unknown error occurred" },
      { status: 500 },
    );
  }
}
