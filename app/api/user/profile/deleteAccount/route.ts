import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { connect } from "@/db/mongo/db";
import { CommentRepliesModel } from "@/models/posts/commentReplies";
import { CommentsModel } from "@/models/posts/comments";
import { PostModel } from "@/models/posts/post";
import { UserModel } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { validate__Fields__Length } from "@/actions/auth/validateFieldsLength";
import { cookies } from "next/headers";
import { startSession } from "mongoose";

export async function DELETE(req: NextRequest) {
  if (req.method !== "DELETE") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 },
    );
  }
  const imagesToBeDeleted=[]
  const session = await startSession();
  session.startTransaction();
  try {
    const userProfileId = req.nextUrl.searchParams.get("user");
    if (!userProfileId) {
      return NextResponse.json(
        { message: "User profile id not found" },
        { status: 404 },
      );
    }
    const userId = await checkUserLoggedIn();
    if (!userId) {
      return NextResponse.json(
        { message: "You are not logged in!" },
        { status: 401 },
      );
    }
    if (userProfileId !== userId) {
      return NextResponse.json(
        { message: "You are not allowed to delete this account" },
        { status: 403 },
      );
    }
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ message: "Body not found" }, { status: 400 });
    }
    const { password } = body;
    if (!password) {
      return NextResponse.json(
        { message: "Password not found" },
        { status: 400 },
      );
    }
    const validFields = validate__Fields__Length({ password });
    if (validFields) {
      return NextResponse.json({ message: validFields }, { status: 400 });
    }
    await connect();
    const user = await UserModel.findOne({ _id: userId }).exec();
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { message: "Password is incorrect" },
        { status: 401 },
      );
    }
    await UserModel.updateMany(
      { following: userId },
      { $pull: { following: userId } },
      { session },
    );
    await UserModel.updateMany(
      { followers: userId },
      { $pull: { followers: userId } },
      { session },
    );
    await CommentsModel.updateMany(
      { likes: userId },
      { $pull: { likes: userId } },
      { session },
    );
    await CommentRepliesModel.updateMany(
      { likes: userId },
      { $pull: { likes: userId } },
      { session },
    );
    await PostModel.updateMany(
      { likes: userId },
      { $pull: { likes: userId } },
      { session },
    );
    const userImageToBeDeleted = await UserModel.findOne({ _id: userId });
    if (
      userImageToBeDeleted &&
      userImageToBeDeleted?.image.fileId !== "675fef71e375273f6052bf73"
    ) {
      imagesToBeDeleted.push(userImageToBeDeleted?.image);
    }
    await UserModel.deleteOne({ _id: userId }, { session });
    await CommentRepliesModel.deleteMany({ user: userId }, { session });
    await CommentsModel.deleteMany({ user: userId }, { session });
    const postImagesToBeDeleted = await PostModel.find({ createdBy: userId });
    postImagesToBeDeleted.forEach((post) => {
      imagesToBeDeleted.push(post.image);
    });
    await PostModel.deleteMany({ createdBy: userId }, { session });
    await session.commitTransaction();
    const cookieStore = await cookies();
    const response = cookieStore.delete("authToken");
    if (!response) {
      return NextResponse.json(
        { message: "An error occurred" },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { message: "Account deleted successfully", imagesToBeDeleted },
      { status: 200 },
    );
  } catch (error: unknown) {
    await session.abortTransaction();
    if (error instanceof Error) {
      return NextResponse.json(
        { message: "An error occurred", error: error.message },
        { status: 500 },
      );
    }
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  } finally {
    await session.endSession();
  }
}
