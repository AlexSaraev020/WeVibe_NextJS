import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { PostModel } from "@/models/posts/post";
import { NextResponse } from "next/server";
import { connect } from "@/db/mongo/db";
import { Types } from "mongoose";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 },
    );
  }
  try {
    const isUserLoggedIn = await checkUserLoggedIn();
    if (!isUserLoggedIn) {
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
    let isLiked = false;
    const isLoggedInUserIdObject = new Types.ObjectId(isUserLoggedIn);

    await connect();
    const post = await PostModel.findOne({ _id: postId }).exec();

    if (post?.likes.includes(isLoggedInUserIdObject)) {
      isLiked = true;
    }

    return NextResponse.json({ isLiked: isLiked , likesNumber: post?.likes.length }, { status: 200 });
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
