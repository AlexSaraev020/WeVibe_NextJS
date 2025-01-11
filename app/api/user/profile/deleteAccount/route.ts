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
import { validateFieldsTrim } from "@/actions/auth/validateFieldsTrim";

export async function DELETE(req: NextRequest) {
  if (req.method !== "DELETE") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 },
    );
  }
  const imagesToBeDeleted = [];
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
    const isLoggedIn = await checkUserLoggedIn();
    if (!isLoggedIn) {
      return NextResponse.json(
        { message: "You are not logged in!" },
        { status: 401 },
      );
    }
    await connect();
    const loggedUser = await UserModel.findOne({ _id: isLoggedIn }).exec();
    if (!loggedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    if (userProfileId !== isLoggedIn && !loggedUser.isAdmin) {
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
    if (!password && !loggedUser.isAdmin) {
      return NextResponse.json(
        { message: "Password not found" },
        { status: 400 },
      );
    }
    const validateTrim = validateFieldsTrim({ password });
    if (validateTrim.error || !validateTrim.fields) {
      return NextResponse.json(
        { message: validateTrim.error },
        { status: 400 },
      );
    }
    const trimPassword = validateTrim.fields.password;
    const validFields = validate__Fields__Length({ password: trimPassword });
    if (validFields && !loggedUser.isAdmin) {
      return NextResponse.json({ message: validFields }, { status: 400 });
    }
    const isPasswordCorrect = await bcrypt.compare(
      trimPassword,
      loggedUser.password,
    );
    if (!isPasswordCorrect && !loggedUser.isAdmin) {
      return NextResponse.json(
        { message: "Password is incorrect" },
        { status: 401 },
      );
    }
    await UserModel.updateMany(
      { following: userProfileId },
      { $pull: { following: userProfileId } },
      { session },
    );
    await UserModel.updateMany(
      { followers: userProfileId },
      { $pull: { followers: userProfileId } },
      { session },
    );
    await CommentsModel.updateMany(
      { likes: userProfileId },
      { $pull: { likes: userProfileId } },
      { session },
    );
    await CommentRepliesModel.updateMany(
      { likes: userProfileId },
      { $pull: { likes: userProfileId } },
      { session },
    );
    await PostModel.updateMany(
      { likes: userProfileId },
      { $pull: { likes: userProfileId } },
      { session },
    );
    const userImageToBeDeleted = await UserModel.findOne({
      _id: userProfileId,
    });
    if (
      userImageToBeDeleted &&
      userImageToBeDeleted?.image.url !==
        "https://ik.imagekit.io/xkk8kgegl/defaultuser.webp?updatedAt=1735907399967"
    ) {
      imagesToBeDeleted.push(userImageToBeDeleted?.image);
    }
    await UserModel.deleteOne({ _id: userProfileId }, { session });
    await CommentRepliesModel.deleteMany({ user: userProfileId }, { session });
    await CommentsModel.deleteMany({ user: userProfileId }, { session });
    const postImagesToBeDeleted = await PostModel.find({
      createdBy: userProfileId,
    });
    postImagesToBeDeleted.forEach((post) => {
      imagesToBeDeleted.push(post.image);
    });
    await PostModel.deleteMany({ createdBy: userProfileId }, { session });
    await session.commitTransaction();
    if (!loggedUser.isAdmin) {
      const cookieStore = await cookies();
      const response = cookieStore.delete("authToken");
      if (!response) {
        return NextResponse.json(
          { message: "An error occurred" },
          { status: 500 },
        );
      }
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
