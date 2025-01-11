import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { connect } from "@/db/mongo/db";
import { CommentRepliesModel } from "@/models/posts/commentReplies";
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
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ message: "Body not found" }, { status: 400 });
    }
    const { _id } = body;
    if (!_id) {
      return NextResponse.json(
        { message: "No reply id or comment id found" },
        { status: 400 },
      );
    }
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
    
    const reply = await CommentRepliesModel.findOne({ _id }).exec();
    if (!reply) {
      return NextResponse.json({ message: "Reply not found" }, { status: 404 });
    }
    const isAllowed = reply.user.toString() === isLoggedIn || userLoggedIn.isAdmin;
    return NextResponse.json({ allow: isAllowed }, { status: 200 });
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
