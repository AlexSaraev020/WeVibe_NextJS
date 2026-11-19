import { connect } from "@/db/mongo/db";
import { UserModel } from "@/models/user";
import { PostModel } from "@/models/posts/post";
import { NextResponse } from "next/server";
import { CommentsModel } from "@/models/posts/comments";
import { checkUserLoggedIn } from "@/actions/user/isLoggedIn/checkUserLoggedIn";
import { Types } from "mongoose";

export async function POST(req: Request) {
  if (req.method !== "POST") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 },
    );
  }

  try {
    await connect();
    const isLoggedIn = await checkUserLoggedIn();
    const body = await req.json();
    if (!body) {
      return NextResponse.json({ message: "Body not found" }, { status: 400 });
    }
    const { limit, seen } = body;
    if (limit == null) {
      return NextResponse.json({ message: "Missing limit" }, { status: 400 });
    }
    const pageSize = Math.min(Math.max(Number(limit) || 8, 1), 50);

    const totalPostsCount = await PostModel.countDocuments();
    if (!totalPostsCount) {
      return NextResponse.json({ posts: [], hasMore: false }, { status: 200 });
    }

    /* the feed is a shuffled deck: everything the visitor has already been shown is
       excluded, and once the deck is spent it restarts and the client is told to forget
       its list. shortcut: the seen ids travel in the request body, which stops being
       cheap past a few thousand posts — a server-side deck id is the upgrade. */
    const seenIds = (Array.isArray(seen) ? seen : [])
      .filter((id: string) => Types.ObjectId.isValid(id))
      .map((id: string) => new Types.ObjectId(id));
    const newDeck = seenIds.length >= totalPostsCount;
    const available = newDeck ? totalPostsCount : totalPostsCount - seenIds.length;

    const sampled = await PostModel.aggregate([
      ...(newDeck || !seenIds.length ? [] : [{ $match: { _id: { $nin: seenIds } } }]),
      { $sample: { size: Math.min(pageSize, available) } },
    ]);
    const order = new Map(sampled.map((doc, index) => [String(doc._id), index]));

    const posts = await PostModel.find({ _id: { $in: sampled.map((doc) => doc._id) } })
      .populate({
        path: "createdBy",
        model: UserModel,
        select: "username image verified",
      })
      .select("_id title description image createdAt createdBy comments likes")
      .lean()
      .exec();
    posts.sort((a, b) => (order.get(String(a._id)) ?? 0) - (order.get(String(b._id)) ?? 0));

    /* the badge must be the number of comments the thread can actually list, so it is
       counted from the Comment collection, not from the ids cached on the post */
    const postsWithCountedLikesAndComments = await Promise.all(
      posts.map(async (post) => ({
        ...post,
        likes: post.likes.length,
        comments: await CommentsModel.countDocuments({ post: post._id }),
        likedByMe: isLoggedIn ? post.likes.some((liked) => String(liked) === isLoggedIn) : false,
      })),
    );

    return NextResponse.json(
      { posts: postsWithCountedLikesAndComments, hasMore: true, newDeck },
      { status: 200 },
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ message: "An error occurred", error: error.message }, { status: 500 });
    }
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
