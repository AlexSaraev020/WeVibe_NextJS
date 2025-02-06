import { checkIsGuest } from "@/actions/guest/checkIsGuest";
import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
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
  try {
    const isGuest = await checkIsGuest();
    let isAllowed = false;
    await connect();
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ message: "Body not found" }, { status: 400 });
    }
    const { commentId } = body;
    if (!commentId) {
      return NextResponse.json(
        { message: "No comment id found" },
        { status: 400 },
      );
    }
    if (isGuest === "false") {
      const isLoggedIn = await checkUserLoggedIn();
      if (!isLoggedIn) {
        return NextResponse.json(
          { message: "You are not logged in!" },
          { status: 401 },
        );
      }
      const userLoggedIn = await UserModel.findOne({
        _id: isLoggedIn,
      });

      const comment = await CommentsModel.findById({ _id: commentId }).exec();
      if (!comment) {
        return NextResponse.json(
          { message: "Comment not found" },
          { status: 404 },
        );
      }
      if (comment.user.toString() === isLoggedIn || userLoggedIn?.isAdmin) {
        isAllowed = true;
      }
    }

    return NextResponse.json(
      {
        allow: isAllowed,
        message: `You ${isAllowed ? "can" : "cannot"} delete this comment`,
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
