import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { connect } from "@/db/mongo/db";
import { UserModel } from "@/models/user";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 },
    );
  }
  try {
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ message: "Body not found" }, { status: 400 });
    }
    const { query } = body;
    const isLoggedIn = await checkUserLoggedIn();
    if (!isLoggedIn) {
      return NextResponse.json(
        { message: "You are not logged in!" },
        { status: 401 },
      );
    }
    const userId = new Types.ObjectId(isLoggedIn);
    if (!userId || !query) {
      return NextResponse.json(
        { message: "UserId or query not found" },
        { status: 400 },
      );
    }
    await connect();
    const queriedUser = await UserModel.findOne({ _id: query }).exec();
    const loggedUser = await UserModel.findOne({ _id: userId }).exec();
    if (!queriedUser || !loggedUser) {
      return NextResponse.json(
        { message: "You are not logged in or user not found!" },
        { status: 404 },
      );
    }

    if (!queriedUser.followers.includes(userId)) {
      return NextResponse.json(
        { message: "You don't follow this user!" },
        { status: 400 },
      );
    }

    if (!loggedUser.following.includes(query)) {
      return NextResponse.json(
        { message: "You don't follow this user!" },
        { status: 400 },
      );
    }

    await Promise.all([
      loggedUser.updateOne({ $pull: { following: query } }),
      queriedUser.updateOne({ $pull: { followers: userId } }),
    ]);
    return NextResponse.json(
      { message: "Unfollowed successfully" },
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
