import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
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
    const isLoggedIn = await checkUserLoggedIn();
    if (!isLoggedIn) {
      return NextResponse.json(
        { message: "You are not logged in!" },
        { status: 401 },
      );
    }
    await connect();
    const userLoggedIn = await UserModel.findOne({ _id: isLoggedIn }).exec();
    if (!userLoggedIn) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ message: "Body not found" }, { status: 400 });
    }
    const { commentId, postId, skip, limit } = body;
    if (!commentId || !postId || skip == null || limit == null) {
      return NextResponse.json(
        { message: "The body is invalid" },
        { status: 400 },
      );
    }
    const replies = await CommentRepliesModel.find({ commentId, postId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("-__v -postId")
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
    }));
    const totalRepliesCount = await CommentRepliesModel.countDocuments({
      postId,
      commentId,
    });
    const hasMore = totalRepliesCount > skip + limit;
    return NextResponse.json({ replies: formattedReplies, hasMore }, { status: 200 });
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
