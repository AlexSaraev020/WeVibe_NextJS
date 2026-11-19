import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { CommentRepliesModel } from "@/models/posts/commentReplies";
import { CommentsModel } from "@/models/posts/comments";
import { PostModel } from "@/models/posts/post";
import { UserModel } from "@/models/user";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  if (req.method !== "DELETE") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 },
    );
  }
  try {
    const isLoggedIn = await checkUserLoggedIn();
    if (!isLoggedIn) {
      return NextResponse.json(
        { message: "You are not logged in!" },
        { status: 401 },
      );
    }
    const loggedUser = await UserModel.findOne({
      _id: isLoggedIn,
    })
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
    /* ownership is read off the post, not off the request body: a caller used to be able to
       claim createdBy as themselves and delete anybody's post */
    const post = await PostModel.findById(postId).select("createdBy").lean().exec();
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    if (String(post.createdBy) !== String(isLoggedIn) && !loggedUser?.isAdmin) {
      return NextResponse.json(
        { message: "You are not allowed to delete this post", allow: false },
        { status: 403 },
      );
    }
    await PostModel.findByIdAndDelete(postId);
    await UserModel.updateMany(
      { _id: post.createdBy },
      { $pull: { posts: postId } },
    );
    await CommentsModel.deleteMany({ post: postId });
    await CommentRepliesModel.deleteMany({ postId: postId });
    return NextResponse.json({ message: "Post deleted" }, { status: 200 });
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
