import { connect } from "@/db/mongo/db";
import { CommentsModel } from "@/models/posts/comments";
import { PostModel } from "@/models/posts/post";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  if (req.method !== "PUT") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 }
    );
  }
  try {
    await connect();
    const body = await req.json();

    if (!body) {
      return NextResponse.json({ message: "Body not found" }, { status: 400 });
    }
    const { postId, comment, userId } = body;
    if (!postId || !comment || !userId) {
      return NextResponse.json(
        { message: "Please fill the required fields" },
        { status: 400 }
      );
    }

    const newComment = await CommentsModel.create({
      comment,
      post: postId,
      user: userId,
    });
    const updatedPost = await PostModel.findOneAndUpdate(
      { _id: postId },
      { $push: { comments: newComment._id } },
      { new: true }
    );

    if (!updatedPost) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Comment added successfully", post: updatedPost },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred", error },
      { status: 500 }
    );
  }
}
