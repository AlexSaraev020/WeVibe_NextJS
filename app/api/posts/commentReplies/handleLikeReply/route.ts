import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { connect } from "@/db/mongo/db";
import { CommentRepliesModel } from "@/models/posts/commentReplies";
import { UserModel } from "@/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  if (req.method !== "PUT") {
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
    const { _id } = body;
    if (!_id) {
      return NextResponse.json({ message: "No id found" }, { status: 400 });
    }
    const reply = await CommentRepliesModel.findOne({ _id }).exec();
    if (!reply) {
      return NextResponse.json({ message: "Reply not found" }, { status: 404 });
    }
    const isLoggedInUserIdObject = new Types.ObjectId(loggedUser);
    if (!isLoggedInUserIdObject) {
      return NextResponse.json(
        { message: "User id not found" },
        { status: 400 },
      );
    }
    const isLiked = reply.likes.includes(isLoggedInUserIdObject)
    if (isLiked) {
      await CommentRepliesModel.updateOne(
        { _id: _id },
        { $pull: { likes: isLoggedInUserIdObject } },
      )
      return NextResponse.json({ message: "Reply unliked" }, { status: 200 });
    } else {
      await CommentRepliesModel.updateOne(
        { _id: _id },
        { $addToSet: { likes: isLoggedInUserIdObject } },
        { new: true },
      );
      return NextResponse.json({ message: "Reply liked" }, { status: 200 });
    }
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
