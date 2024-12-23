import { connect } from "@/db/mongo/db";
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
    const { replyId, skip, limit } = body;
    if (!replyId || skip == null || limit == null) {
      return NextResponse.json(
        { message: "No reply id found" },
        { status: 400 },
      );
    }
    await connect();
    const whoLikedReply = await CommentRepliesModel.findById({ _id: replyId })
      .select("likes")
      .populate({
        path: "likes",
        model: UserModel,
        select: ["username", "image", "_id"],
      })
      .exec();
    if (!whoLikedReply) {
      return NextResponse.json({ message: "Reply not found" }, { status: 404 });
    }
    const whoLikedReplySliced = whoLikedReply.likes.slice(skip, skip + limit);
    const totalWhoLikedReply = await CommentRepliesModel.countDocuments({
      _id: replyId,
    });
    const hasMore = totalWhoLikedReply >= skip + limit;
    return NextResponse.json(
      { likes:whoLikedReplySliced, message: "People who liked found", hasMore },
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
