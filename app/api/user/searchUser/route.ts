import { connect } from "@/db/mongo/db";
import { UserModel } from "@/models/user";
import { followedIds } from "@/lib/users/followedIds";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (req.method !== "GET") {
    return NextResponse.json(
      { message: "Method not allowed" },
      { status: 400 }
    );
  }
  try {
    const query = (req.nextUrl.searchParams.get("q") ?? "").trim();
    const sort = req.nextUrl.searchParams.get("sort") ?? (query ? "relevance" : "popular");
    await connect();

    /* an empty q is the Discover section asking who is worth following. It answers with
       follower counts rather than the id arrays themselves, and popularity first. */
    const users = await UserModel.aggregate([
      ...(query ? [{ $match: { username: { $regex: query, $options: "i" } } }] : []),
      { $addFields: { followers: { $size: "$followers" }, following: { $size: "$following" } } },
      ...(sort === "new"
        ? [{ $sort: { createdAt: -1 as const } }]
        : [{ $sort: { followers: -1 as const, createdAt: -1 as const } }]),
      { $limit: 40 },
      { $project: { username: 1, bio: 1, image: 1, verified: 1, followers: 1, following: 1, createdAt: 1 } },
    ]);

    /* each row carries whether the viewer already follows it, so a Follow button never
       paints as "Follow" and then corrects itself when a second request lands */
    const followingIds = await followedIds();

    return NextResponse.json(
      { users: users.map((u) => ({ ...u, followedBy: followingIds.has(String(u._id)) })) },
      { status: 200 },
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { message: "An error occurred", error },
      { status: 500 }
    );
  }
}
