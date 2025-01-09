import { validate__Fields__Length } from "@/actions/auth/validateFieldsLength";
import { connect } from "@/db/mongo/db";
import { CommentsModel } from "@/models/posts/comments";
import { PostModel } from "@/models/posts/post";
import { UserModel } from "@/models/user";
import { NextResponse } from "next/server";

export async function PATCH(req: Request) {
  if (req.method !== "PATCH") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 },
    );
  }
  await connect();
  try {
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ message: "Body not found" }, { status: 400 });
    }
    const { postId, comment, userId } = body;
    if (!postId || !comment || !userId) {
      return NextResponse.json(
        { message: "Please fill the required fields" },
        { status: 400 },
      );
    }

    if (comment.trim() === "") {
      return NextResponse.json(
        { message: "Comment cannot be empty" },
        { status: 400 },
      );
    }

    const trimmedComment = comment.trim();

    const validate = validate__Fields__Length({ comment: trimmedComment });
    if (validate) {
      return NextResponse.json({ message: validate }, { status: 400 });
    }

    const newComment = await CommentsModel.create({
      comment: trimmedComment,
      post: postId,
      user: userId,
    });
    await PostModel.findOneAndUpdate(
      { _id: postId },
      { $push: { comments: newComment._id } },
      { new: true },
    );

    const populatedNewComment = await CommentsModel.populate(newComment, {
      path: "user",
      model: UserModel,
      select: ["username", "image", "_id"],
    });

    return NextResponse.json(
      { message: "Comment added successfully", comment: populatedNewComment },
      { status: 200 },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error);
      return NextResponse.json(
        { message: "An error occurred", error: error.message },
        { status: 500 },
      );
    }
    console.error("Unknown error:", error);
    return NextResponse.json(
      { message: "An error occurred", error },
      { status: 500 },
    );
  }
}
