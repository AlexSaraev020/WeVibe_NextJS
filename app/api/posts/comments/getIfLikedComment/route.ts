import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { connect } from "@/db/mongo/db";
import { CommentsModel } from "@/models/posts/comments";
import { UserModel } from "@/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 },
    );
  }
  try {
    const loggedUser = await checkUserLoggedIn();
    if (!loggedUser) {
      return NextResponse.json(
        { message: "You are not logged in!" },
        { status: 401 },
      );
    }
    await connect();
    const userLoggedIn = await UserModel.findOne({ _id: loggedUser }).exec();
    if (!userLoggedIn) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ message: "Body not found" }, { status: 400 });
    }
    const { commentId, postId } = body;
    if (!commentId || !postId) {
      return NextResponse.json(
        { message: "No comment id or post id found" },
        { status: 400 },
      );
    }
    const comment = await CommentsModel.findOne({ _id: commentId }).exec();
    if (!comment) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 });
    }
    const isLoggedInUserIdObject = new Types.ObjectId(loggedUser);
    const isLiked = comment.likes.includes(isLoggedInUserIdObject);
    return NextResponse.json({ isLiked }, { status: 200 });
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
