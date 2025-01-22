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
    const isGuest = await checkIsGuest();
    await connect();
    if (!isGuest) {
      const loggedUser = await checkUserLoggedIn();
      if (!loggedUser) {
        return NextResponse.json(
          { message: "You are not logged in!" },
          { status: 401 },
        );
      }

      const userLoggedIn = await UserModel.findOne({ _id: loggedUser }).exec();
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
    const { commentId, skip, limit } = body;
    if (!commentId || skip == null || limit == null) {
      return NextResponse.json(
        { message: "No comment id found" },
        { status: 400 },
      );
    }
    const whoLikedComment = await CommentsModel.findById({ _id: commentId })
      .select("likes")
      .populate({
        path: "likes",
        model: UserModel,
        select: ["username", "image", "_id"],
      })
      .exec();
    if (!whoLikedComment) {
      return NextResponse.json(
        { message: "People who liked not found" },
        { status: 400 },
      );
    }
    const whoLikedCommentSliced = whoLikedComment.likes.slice(
      skip,
      skip + limit,
    );
    const totalWhoLikedComment = whoLikedComment.likes.length;
    const hasMore = totalWhoLikedComment > skip + limit;

    return NextResponse.json(
      {
        users: whoLikedCommentSliced,
        message: "People who liked found",
        hasMore,
      },
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
