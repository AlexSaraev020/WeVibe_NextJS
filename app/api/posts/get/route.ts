import { connect } from "@/db/mongo/db";
import { UserModel } from "@/models/user";
import { PostModel } from "@/models/posts/post";
import { NextResponse } from "next/server";
import { CommentRepliesModel } from "@/models/posts/commentReplies";
import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 },
    );
  }
  await connect();
  try {
    const isLoggedIn = await checkUserLoggedIn();
    if (!isLoggedIn) {
      return NextResponse.json(
        { message: "You are not logged in!" },
        { status: 401 },
      );
    }
    const userLoggedIn = await UserModel.findOne({ _id: isLoggedIn }).exec();
    if (!userLoggedIn) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ message: "Body not found" }, { status: 400 });
    }
    const { skip, limit } = body;
    if (skip == null || limit == null) {
      return NextResponse.json(
        { message: "Missing skip or limit" },
        { status: 400 },
      );
    }
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "createdBy",
        model: UserModel,
        select: "username image",
      })
      .select("_id title description image createdAt createdBy comments likes")
      .lean()
      .exec();

    if (!posts.length) {
      return NextResponse.json(
        { message: "No more posts found" },
        { status: 200 },
      );
    }
    const postsWithCountedLikesAndComments = await Promise.all(
      posts.map(async (post) => {
        const repliesCount = await CommentRepliesModel.countDocuments({
          postId: post._id,
        });
        return {
          ...post,
          likes: post.likes.length,
          comments: post.comments.length + repliesCount,
        };
      }),
    );

    const totalPostsCount = await PostModel.countDocuments();
    const hasMore = totalPostsCount > skip + limit;
    return NextResponse.json(
      { posts: postsWithCountedLikesAndComments, hasMore },
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
