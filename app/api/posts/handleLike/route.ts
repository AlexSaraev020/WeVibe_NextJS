import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { LikesModel } from "@/models/posts/likes";
import { PostModel } from "@/models/posts/post";
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
    const isLoggedInUserIdObject = new Types.ObjectId(loggedUser);
    if (!isLoggedInUserIdObject) {
      return NextResponse.json(
        { message: "User id not found" },
        { status: 400 },
      );
    }
    const existingLike = await LikesModel.findOne({
      post: post._id,
      user: isLoggedInUserIdObject,
    }).exec();

    if (existingLike) {
      await LikesModel.deleteOne({
        post: post._id,
        user: isLoggedInUserIdObject,
      }).exec();
      await PostModel.findOneAndUpdate(
        { _id: postId },
        { $pull: { likes: existingLike._id } },
      ).exec();
      return NextResponse.json(
        { message: "Post unliked", like: false },
        { status: 200 },
      );
    } else {
      const newLike = await LikesModel.create({
        post: post._id,
        user: isLoggedInUserIdObject,
      });
      await PostModel.findOneAndUpdate(
        { _id: postId },
        { $addToSet: { likes: newLike._id } },
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
