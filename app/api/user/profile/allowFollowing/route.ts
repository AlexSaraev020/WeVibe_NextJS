import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { Types } from "mongoose";
import { connect } from "@/db/mongo/db";
import { UserModel } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

type Allow = "edit" | "follow" | "unfollow";

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
    const query = req.nextUrl.searchParams.get("user");
    if (!query) {
      return NextResponse.json({ message: "Query not found" }, { status: 404 });
    }
    await connect();

    let allow: Allow;
    if (userId === query) {
      allow = "edit";
    } else {
      const user = await UserModel.findOne({ _id: query }).exec();
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 },
        );
      }
      const objectUserId = new Types.ObjectId(userId);
      allow = user.followers.includes(objectUserId) ? "unfollow" : "follow";
    }

    return NextResponse.json({ allow }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
