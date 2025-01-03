import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { connect } from "@/db/mongo/db";
import { PostModel } from "@/models/posts/post";
import { UserModel } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
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
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ message: "Body not found" }, { status: 400 });
    }
    const { skip, limit } = body;
    if (skip == null || limit == null) {
      return NextResponse.json(
        { message: "Skip or limit not found" },
        { status: 400 },
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

    const searchedUser = await UserModel.findOne({ _id: userProfileId }).exec();
    if (!searchedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userProfilePosts = await PostModel.find({
      createdBy: userProfileId,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "createdBy",
        select: "username image",
      })
      .skip(skip)
      .limit(limit)
      .exec();
    if (!userProfilePosts) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const totalProfilePosts = searchedUser.posts.length;
    const hasMore = totalProfilePosts > skip + limit;
    return NextResponse.json(
      { posts: userProfilePosts, hasMore },
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
