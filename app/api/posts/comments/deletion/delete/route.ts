import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { connect } from "@/db/mongo/db";
import { CommentRepliesModel } from "@/models/posts/commentReplies";
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
  try {
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ message: "Body not found" }, { status: 400 });
    }
    const { commentId, postId } = body;
    if (!commentId || !postId) {
      return NextResponse.json(
        { message: "No comment or post id found" },
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
    const comment = await CommentsModel.findOne({ _id: commentId }).exec();
    if (!comment) {
      return NextResponse.json({ message: "Comment not found" }, { status: 404 });
    }
    if (comment.user.toString() !== userLoggedIn._id.toString() && !userLoggedIn.isAdmin) {
      return NextResponse.json(
        { message: "You cannot delete this comment" },
        { status: 401 },
      );
    }
    await PostModel.updateOne(
      { _id: postId },
      { $pull: { comments:  commentId  } },
    );
    await CommentRepliesModel.deleteMany({ commentId: commentId });
    await CommentsModel.deleteOne({ _id: commentId });
    return NextResponse.json(
      { message: "Comment deleted successfully" },
      { status: 200 },
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
