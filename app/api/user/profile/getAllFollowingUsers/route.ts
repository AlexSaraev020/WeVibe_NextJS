import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { connect } from "@/db/mongo/db";
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
    const userId = await checkUserLoggedIn();
    if (!userId) {
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
    const userProfileFollowingSliced = userProfileFollowing.following.slice(
      skip,
      skip + limit,
    );
    const totalFollowersUser = userProfileFollowing.following.length;
    const hasMore = totalFollowersUser > skip + limit;
    console.log("userProfileFollowingSliced", userProfileFollowingSliced);
    return NextResponse.json({ users: userProfileFollowingSliced, hasMore }, { status: 200 });
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
