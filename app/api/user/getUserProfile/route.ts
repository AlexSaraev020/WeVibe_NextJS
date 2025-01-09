import { connect } from "@/db/mongo/db";
import { UserModel } from "@/models/user";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 },
    );
  }
  try {
    const userId = req.nextUrl.searchParams.get("user");
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "User id not found or invalid" },
        { status: 404 },
      );
    }
    await connect();

    const user = await UserModel.findOne({ _id: userId })
      .select("-password")
      .lean()
      .exec();

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const followersCount = user.followers?.length || 0;
    const followingCount = user.following?.length || 0;
    const postCount = user.posts?.length || 0;
    const optimizedUser = {
      ...user,
      posts: postCount,
      followers: followersCount,
      following: followingCount,
    };
    return NextResponse.json({ user: optimizedUser }, { status: 200 });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "An error occurred", error: error.message },
        { status: 500 },
      );
    }
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
