import { checkIsGuest } from "@/actions/guest/checkIsGuest";
import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { connect } from "@/db/mongo/db";
import { CommentRepliesModel } from "@/models/posts/commentReplies";
import { PostModel } from "@/models/posts/post";
import { UserModel } from "@/models/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 },
    );
  }
  try {
    const isGuest = await checkIsGuest();

    const body = await req.json();
    if (!body) {
      return NextResponse.json({ message: "Body not found" }, { status: 400 });
    }
    const { skip, limit } = body;
    if (skip == null || limit == null) {
      return NextResponse.json(
        { message: "Skip or limit not found" },
        { status: 400 },
      );
    }
    await connect();
    const userProfileId = req.nextUrl.searchParams.get("user");
    if (!userProfileId) {
      return NextResponse.json(
        { message: "User id not found" },
        { status: 404 },
      );
    }

    const searchedUser = await UserModel.findOne({ _id: userProfileId }).exec();
    if (!searchedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userProfilePosts = await PostModel.find({
      createdBy: userProfileId,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "createdBy",
        model: UserModel,
        select: "username image",
      })
      .select("_id title description image createdAt createdBy comments likes")
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
    if (!userProfilePosts) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    const postsWithCountedLikesAndComments = await Promise.all(
      userProfilePosts.map(async (post) => {
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
    const totalProfilePosts = searchedUser.posts.length;
    const hasMore = totalProfilePosts > skip + limit;
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
