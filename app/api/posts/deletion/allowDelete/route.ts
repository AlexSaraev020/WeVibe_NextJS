import { checkIsGuest } from "@/actions/guest/checkIsGuest";
import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { connect } from "@/db/mongo/db";
import { PostModel } from "@/models/posts/post";
import { UserModel } from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 },
    );
  }
  try {
    const isGuest = await checkIsGuest();
    let isAllowed = false;
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
    if (!isGuest) {
      const isLoggedIn = await checkUserLoggedIn();
      if (!isLoggedIn) {
        return NextResponse.json(
          { message: "You are not logged in!" },
          { status: 401 },
        );
      }
      await connect();
      const loggedUser = await UserModel.findOne({
        _id: isLoggedIn,
      }).exec();
      const post = await PostModel.findById({ _id: postId }).exec();
      if (post?.createdBy._id.equals(isLoggedIn) || loggedUser?.isAdmin) {
        isAllowed = true;
      }
    }
    return NextResponse.json({ allow: isAllowed }, { status: 200 });
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
