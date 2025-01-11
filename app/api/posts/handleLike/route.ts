import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { connect } from "@/db/mongo/db";
import { PostModel } from "@/models/posts/post";
import { UserModel } from "@/models/user";
import { Types } from "mongoose";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  if (req.method !== "PATCH") {
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
    const loggedUser = await UserModel.findOne({ _id: isLoggedIn }).exec();
    if (!loggedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
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
    const post = await PostModel.findOne({ _id: postId }).exec();
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    const isLoggedInUserIdObject = new Types.ObjectId(isLoggedIn);
    if (!isLoggedInUserIdObject) {
      return NextResponse.json(
        { message: "User id not found" },
        { status: 400 },
      );
    }

    if (post.likes.includes(isLoggedInUserIdObject)) {
      await PostModel.updateOne(
        { _id: postId },
        { $pull: { likes: isLoggedIn} },
      ).exec();
      return NextResponse.json(
        { message: "Post unliked", like: false },
        { status: 200 },
      );
    } else {
      await PostModel.updateOne(
        { _id: postId },
        { $addToSet: { likes: isLoggedIn } },
      ).exec();
      return NextResponse.json(
        { message: "Post liked", like: true },
        { status: 200 },
      );
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
