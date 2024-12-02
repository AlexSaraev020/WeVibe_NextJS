import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { connect } from "@/db/mongo/db";
import { PostModel } from "@/models/posts/post";
import { UserModel } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
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

    const userProfileId = req.nextUrl.searchParams.get("user");
    if (!userProfileId) {
      return NextResponse.json(
        { message: "User id not found" },
        { status: 404 },
      );
    }

    const userProfilePosts = await UserModel.findOne({ _id: userProfileId })
      .select("posts")
      .populate({
        path: "posts",
        model: PostModel,
      })
      .exec();
    if (!userProfilePosts) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { posts: userProfilePosts.posts },
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
