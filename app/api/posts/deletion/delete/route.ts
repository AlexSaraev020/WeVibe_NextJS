import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { CommentsModel } from "@/models/posts/comments";
import { LikesModel } from "@/models/posts/postLikes";
import { PostModel } from "@/models/posts/post";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  if (req.method !== "DELETE") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 },
    );
  }
  try {
    const loggedUser = await checkUserLoggedIn();
    if (!loggedUser) {
      return NextResponse.json(
        { message: "You are not logged in!" },
        { status: 401 },
      );
    }
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ message: "Body not found" }, { status: 400 });
    }
    const { postId, createdBy } = body;
    if (!postId) {
      return NextResponse.json(
        { message: "No post id found" },
        { status: 400 },
      );
    }
    if (createdBy !== loggedUser) {
      return NextResponse.json(
        { message: "You are not allowed to delete this post", allow: false },
        { status: 403 },
      );
    }
    await PostModel.findByIdAndDelete(postId);
    await LikesModel.deleteMany({ post: postId });
    await CommentsModel.deleteMany({ post: postId });
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
