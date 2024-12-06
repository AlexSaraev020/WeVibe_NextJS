import { validate__Fields__Length } from "@/actions/auth/validateFieldsLength";
import { connect } from "@/db/mongo/db";
import { CommentsModel } from "@/models/posts/comments";
import { PostModel } from "@/models/posts/post";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  if (req.method !== "PUT") {
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
    
    const validate = validate__Fields__Length({ comment });
    if (validate) {
      return NextResponse.json({ message: validate }, { status: 400 });
    }

    const newComment = await CommentsModel.create({
      comment,
      post: postId,
      user: userId,
    });
    await PostModel.findOneAndUpdate(
      { _id: postId },
      { $push: { comments: newComment._id } },
      { new: true },
    );

    return NextResponse.json(
      { message: "Comment added successfully", comment: newComment },
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
