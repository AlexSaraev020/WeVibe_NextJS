import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { connect } from "@/db/mongo/db";
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
    const userId = await checkUserLoggedIn();
    if (!userId) {
      return NextResponse.json(
        { message: "You are not logged in!" },
        { status: 401 },
      );
    }
    await connect();
    const userLogged = await UserModel.findOne({ _id: userId }).exec();
    if (!userLogged) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    
    const userProfileId = req.nextUrl.searchParams.get("user");
    if (!userProfileId) {
      return NextResponse.json(
        { message: "User id not found" },
        { status: 404 },
      );
    }
    const userProfileFollowing = await UserModel.findOne({ _id: userProfileId })
      .select("following")
      .populate({
        path: "following",
        model: UserModel,
        select: "username image",
      })
      .exec();
    if (!userProfileFollowing) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json({ userProfileFollowing }, { status: 200 });
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
