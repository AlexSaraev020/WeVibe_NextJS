import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { Types } from "mongoose";
import { connect } from "@/db/mongo/db";
import { UserModel } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import { checkIsGuest } from "@/actions/guest/checkIsGuest";

type Allow = {
  edit: boolean;
  follow: boolean;
  unfollow: boolean;
};

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 },
    );
  }

  try {
    const isGuest = await checkIsGuest();
    let allow: Allow = { edit: false, follow: false, unfollow: false };
    if(!isGuest){
      const isLoggedIn = await checkUserLoggedIn();
    if (!isLoggedIn) {
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

    const loggedUser = await UserModel.findOne({ _id: isLoggedIn }).exec();
    if (!loggedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

   
    if (isLoggedIn === query) {
      allow = { edit: true, follow: false, unfollow: false };
    } else {
      const user = await UserModel.findOne({ _id: query }).exec();
      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 },
        );
      }
      const objectUserId = new Types.ObjectId(isLoggedIn);
      allow = user.followers.includes(objectUserId)
        ? { edit: loggedUser.isAdmin ? true : false, follow: false, unfollow: true }
        : { edit: loggedUser.isAdmin ? true : false, follow: true, unfollow: false };
    }
    }

    return NextResponse.json({ allow }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
