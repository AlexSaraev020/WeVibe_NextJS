import { checkIsGuest } from "@/actions/guest/checkIsGuest";
import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { connect } from "@/db/mongo/db";
import { CommentRepliesModel } from "@/models/posts/commentReplies";
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
    const isGuest = await checkIsGuest();
    let isLiked = false;
    await connect();
    if (!isGuest) {
      const isLoggedIn = await checkUserLoggedIn();
      if (!isLoggedIn) {
        return NextResponse.json(
          { message: "You are not logged in!" },
          { status: 401 },
        );
      }
      const loggedUser = await UserModel.findOne({ _id: isLoggedIn }).exec();
      if (!loggedUser) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 },
        );
      }
      const body = await req.json();
      if (!body) {
        return NextResponse.json(
          { message: "Body not found" },
          { status: 400 },
        );
      }
      const { _id } = body;
      if (!_id) {
        return NextResponse.json(
          { message: "No reply id found" },
          { status: 400 },
        );
      }
      const reply = await CommentRepliesModel.findOne({ _id }).exec();
      if (!reply) {
        return NextResponse.json(
          { message: "Comment not found" },
          { status: 404 },
        );
      }
      const isLoggedInUserIdObject = new Types.ObjectId(isLoggedIn);
      if (reply.likes.includes(isLoggedInUserIdObject)) {
        isLiked = true;
      }
    }
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
