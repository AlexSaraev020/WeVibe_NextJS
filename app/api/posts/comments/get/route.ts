import { connect } from "@/db/mongo/db";
import { CommentsModel } from "@/models/posts/comments";
import { UserModel } from "@/models/user";
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
    const { postId } = body;
    if (!postId) {
      return NextResponse.json(
        { message: "No post id found" },
        { status: 400 },
      );
    }
    const comments = await CommentsModel.find({ post: postId })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        model: UserModel,
        select: ["username", "image", "_id"],
      })
      .lean()
      .exec();
    if (!comments.length) {
      return NextResponse.json({ message: "No comments" }, { status: 200 });
    }

    const commentsWithLikesCount = comments.map((comment) => ({
      ...comment,
      replies: comment.replies.length,
      likes: comment.likes.length,
    }));

    return NextResponse.json(
      { comments: commentsWithLikesCount },
      { status: 200 },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { message: "An error occurred" + error },
      { status: 500 },
    );
  }
}
