import { checkIsGuest } from "@/actions/guest/checkIsGuest";
import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { connect } from "@/db/mongo/db";
import { CommentsModel } from "@/models/posts/comments";
import { UserModel } from "@/models/user";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 },
    );
  }

  try {
    await connect();
    const isGuest = await checkIsGuest();
    if (isGuest === "false") {
      const isLoggedIn = await checkUserLoggedIn();
      if (!isLoggedIn) {
        return NextResponse.json(
          { message: "You are not logged in!" },
          { status: 401 },
        );
      }
      const userLoggedIn = await UserModel.findOne({ _id: isLoggedIn }).exec();
      if (!userLoggedIn) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 },
        );
      }
    }
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
    const comments = await CommentsModel.find({ post: postId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "user",
        model: UserModel,
        select: ["username", "image", "_id"],
      })
      .lean()
      .exec();
    if (!comments.length) {
      return NextResponse.json({ message: "No comments" }, { status: 404 });
    }

    const formattedComments = comments.map((comment) => ({
      ...comment,
      replies: comment.replies.length,
      likes: comment.likes.length,
    }));
    const totalCommentsCount = await CommentsModel.countDocuments({
      post: postId,
    });
    const hasMore = totalCommentsCount > skip + limit;

    return NextResponse.json(
      { comments: formattedComments, hasMore },
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
