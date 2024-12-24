import { validate__Fields__Length } from "@/actions/auth/validateFieldsLength";
import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { connect } from "@/db/mongo/db";
import { CommentRepliesModel } from "@/models/posts/commentReplies";
import { CommentsModel } from "@/models/posts/comments";
import { PostModel } from "@/models/posts/post";
import { UserModel } from "@/models/user";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  if (req.method !== "PUT") {
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
    const { commentId, postId, reply } = body;
    if (!commentId || !postId || !reply) {
      return NextResponse.json(
        { message: "No commentId or postId found" },
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

    const post = await PostModel.findOne({ _id: postId }).exec();

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const comment = await CommentsModel.findOne({ _id: commentId }).exec();

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 },
      );
    }

    const validate = validate__Fields__Length({ comment: reply });

    if (validate) {
      return NextResponse.json({ message: validate }, { status: 400 });
    }

    const newReply = await CommentRepliesModel.create({
      commentId: commentId,
      postId: postId,
      user: isLoggedIn,
      content: reply,
    });

    if (!newReply) {
      return NextResponse.json(
        { message: "Reply not created" },
        { status: 404 },
      );
    }

    await CommentsModel.findOneAndUpdate(
      { _id: commentId },
      { $push: { replies: newReply._id } },
      { new: true },
    );
    const populatedNewReply = await CommentRepliesModel.populate(newReply, {
      path: "user",
      model: UserModel,
      select: ["username", "image", "_id"],
    });

    return NextResponse.json(
      { message: "Reply created successfully", reply: populatedNewReply },
      { status: 201 },
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
