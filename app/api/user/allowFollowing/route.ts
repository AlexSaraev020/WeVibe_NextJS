import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { Types } from "mongoose";
import { connect } from "@/db/mongo/db";
import { UserModel } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 }
    );
  }

  try {
    const query = req.nextUrl.searchParams.get("user");
    if (!query) {
      return NextResponse.json({ message: "Query not found" }, { status: 404 });
    }
    const userId = await checkUserLoggedIn();
    if (!userId) {
      return NextResponse.json(
        { message: "You are not logged in!" },
        { status: 401 }
      );
    }
    await connect();
    console.log("connected to mongo");
    if (userId === query) {
      return NextResponse.json(
        {
          message: "You don't follow this user!",
          allowedActions: {
            allowFollowing: false,
            allowUnfollowing: false,
            allowEditing: true,
          },
        },
        { status: 200 }
      );
    }
    const user = await UserModel.findOne({ _id: query }).exec();
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const objectUserId = new Types.ObjectId(userId);
    if (!user.followers.includes(objectUserId)) {
      return NextResponse.json(
        {
          message: "You don't follow this user!",
          allowedActions: {
            allowFollowing: true,
            allowUnfollowing: false,
            allowEditing: false,
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        message: "You follow this user!",
        allowedActions: {
          allowFollowing: false,
          allowUnfollowing: true,
          allowEditing: false,
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
